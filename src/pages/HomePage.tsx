import { useState } from 'react';
import { Droplets, Eye, Gauge, Sun, Sunrise, Wind } from 'lucide-react';
import {
  AlertBanner,
  CurrentWeatherCard,
  DetailsGrid,
  EmptyState,
  ForecastPanel,
  Loader,
  PageHeading,
} from '../components/index';
import type { DetailCardProps } from '../components/DetailCard/DetailCard';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useWeather } from '../hooks/useWeather';
import type { CurrentConditions, Units } from '../types/weather';
import { describeHumidity, describeUv, describeVisibility, uvAdvice } from '../utils/describe';
import { formatDistance, formatSpeed } from '../utils/units';
import './HomePage.css';

function buildDetails(current: CurrentConditions, units: Units): DetailCardProps[] {
  return [
    { icon: <Droplets size={14} />, label: 'Humidity', value: `${current.humidity}%`, caption: describeHumidity(current.humidity) },
    { icon: <Wind size={14} />, label: 'Wind', value: formatSpeed(current.windKmh, units), caption: `${current.windDirection} · Gusts ${formatSpeed(current.gustKmh, units)}` },
    { icon: <Gauge size={14} />, label: 'Pressure', value: `${current.pressureHpa} hPa`, caption: current.pressureTrend },
    { icon: <Eye size={14} />, label: 'Visibility', value: formatDistance(current.visibilityKm, units), caption: describeVisibility(current.visibilityKm) },
    { icon: <Sun size={14} />, label: 'UV index', value: `${current.uvIndex} · ${describeUv(current.uvIndex)}`, caption: uvAdvice(current.uvIndex) },
    { icon: <Sunrise size={14} />, label: 'Sunrise / sunset', value: `${current.sunrise} / ${current.sunset}`, caption: `${current.daylight} daylight` },
  ];
}

export default function HomePage() {
  const { activeLocationId, units, isSaved, toggleSaved } = useAppContext();
  const { showToast } = useToast();
  const { data, isLoading, error, isFromCache } = useWeather(activeLocationId);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  if (isLoading) return <Loader label="Fetching the forecast…" />;
  if (error || !data) {
    return <EmptyState title="We couldn't load the forecast" description={error ?? 'Please try again in a moment.'} />;
  }

  const handleToggleSaved = () => {
    const wasAdded = toggleSaved(data.location);
    showToast(wasAdded ? `${data.location.name} saved.` : `${data.location.name} removed from saved.`, 'success');
  };

  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const updatedTime = new Date(data.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <>
      <PageHeading title="Your day, at a glance" subtitle="A clearer forecast for whatever comes next." />
      <CurrentWeatherCard
        location={data.location}
        dateLabel={dateLabel}
        current={data.current}
        units={units}
        isSaved={isSaved(data.location.id)}
        onToggleSaved={handleToggleSaved}
      />
      {data.alerts
        .filter((alert) => !dismissedAlertIds.includes(alert.id))
        .map((alert) => (
          <AlertBanner
            key={alert.id}
            title={alert.title}
            message={alert.message}
            onDismiss={() => setDismissedAlertIds((ids) => [...ids, alert.id])}
          />
        ))}
      <ForecastPanel hourly={data.hourly} daily={data.daily} units={units} />
      <section aria-label="Today's details" className="home-page__details">
        <h2 className="home-page__heading">Today's details</h2>
        <DetailsGrid items={buildDetails(data.current, units)} />
      </section>
      <p className="home-page__footnote">
        {isFromCache ? 'Offline: showing saved data from your last visit.' : `Updated ${updatedTime} · Mock weather data`}
      </p>
    </>
  );
}

import { useEffect, useState } from 'react';
import { Droplets, Eye, Gauge, Sun, Sunrise, Sunset, Wind } from 'lucide-react';
import { useSearchParams } from 'react-router';
import AlertBanner from '../components/AlertBanner/AlertBanner';
import CurrentWeatherCard from '../components/CurrentWeatherCard/CurrentWeatherCard';
import DetailsGrid from '../components/DetailsGrid/DetailsGrid';
import EmptyState from '../components/EmptyState/EmptyState';
import ForecastSection from '../components/ForecastPanel/ForecastPanel';
import Spinner from '../components/Spinner/Spinner';
import { useSettings } from '../context/SettingsContext';
import { useSavedLocations } from '../hooks/useSavedLocations';
import { useWeather } from '../hooks/useWeather';
import { formatDistance, formatSpeed } from '../utils/units';
import { findNearestLocation } from '../api/weatherService';
import './HomePage.css';

const LAST_KEY = 'nimbus:lastLocation';
const FALLBACK_ID = 'kimberley';

export default function Home() {
  const [params, setParams] = useSearchParams();
  const locationId = params.get('loc');
  const { units } = useSettings();
  const { isSaved, toggleSaved } = useSavedLocations();
  const { data, isLoading, isFromCache, error } = useWeather(locationId);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // No location chosen yet: try geolocation, then the last used location, then a default.
  useEffect(() => {
    if (locationId) { localStorage.setItem(LAST_KEY, locationId); return; }
    const fallback = localStorage.getItem(LAST_KEY) ?? FALLBACK_ID;
    const open = (id: string) => setParams({ loc: id }, { replace: true });
    if (!navigator.geolocation) return open(fallback);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try { open((await findNearestLocation(coords.latitude, coords.longitude)).id); }
        catch { open(fallback); }
      },
      () => open(fallback),
    );
  }, [locationId, setParams]);

  if (error) return <main className="page"><EmptyState title="Couldn't load weather" description={error} /></main>;
  if (!data) return <main className="page"><Spinner label={isLoading ? 'Fetching the forecast…' : 'Finding your location…'} /></main>;

  const visibleAlerts = data.alerts.filter((alert) => !dismissedAlerts.includes(alert.id));

  return (
    <main className="page">
      <h1 className="page__title">Your day, at a glance</h1>
      <p className="page__subtitle">A clearer forecast for whatever comes next.</p>
      <CurrentWeatherCard location={data.location}
        dateLabel={new Date(data.updatedAt).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}
        current={data.current} units={units}
        isSaved={isSaved(data.location.id)} onToggleSaved={() => toggleSaved(data.location)} />
      {visibleAlerts.map((alert) => (
        <AlertBanner key={alert.id} title={alert.title} message={alert.message}
          onDismiss={() => setDismissedAlerts((prev) => [...prev, alert.id])} />
      ))}
      <ForecastSection hourly={data.hourly} daily={data.daily} units={units} />
      <DetailsGrid items={[
        { icon: <Droplets size={16} />, label: 'Humidity', value: `${data.current.humidity}%` },
        { icon: <Wind size={16} />, label: 'Wind', value: formatSpeed(data.current.windKmh, units), caption: data.current.windDirection },
        { icon: <Wind size={16} />, label: 'Wind gusts', value: formatSpeed(data.current.gustKmh, units) },
        { icon: <Gauge size={16} />, label: 'Pressure', value: `${data.current.pressureHpa} hPa`, caption: data.current.pressureTrend },
        { icon: <Eye size={16} />, label: 'Visibility', value: formatDistance(data.current.visibilityKm, units) },
        { icon: <Sun size={16} />, label: 'UV index', value: String(data.current.uvIndex) },
        { icon: <Sunrise size={16} />, label: 'Sunrise', value: data.current.sunrise },
        { icon: <Sunset size={16} />, label: 'Sunset', value: data.current.sunset },
      ]} />
      <p className="page__footer">
        {isFromCache ? 'Offline · showing saved data from ' : 'Updated '}
        {new Date(data.updatedAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })} · Demo data via MockAPI
      </p>
    </main>
  );
}

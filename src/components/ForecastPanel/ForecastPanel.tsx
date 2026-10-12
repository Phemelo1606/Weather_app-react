import { useState } from 'react';
import type { DailyPoint, HourlyPoint, Units } from '../../types/weather';
import { formatTemp } from '../../utils/units';
import Card from '../Card/Card';
import ForecastItem from '../ForecastItem/ForecastItem';
import SegmentedControl from '../SegmentedControl/SegmentedControl';
import './ForecastPanel.css';

type ViewMode = 'hourly' | 'daily';

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
];

interface ForecastPanelProps {
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  units: Units;
}

export default function ForecastPanel({ hourly, daily, units }: ForecastPanelProps) {
  const [view, setView] = useState<ViewMode>('hourly');
  const isHourly = view === 'hourly';

  return (
    <Card className="forecast-panel" aria-label="Forecast">
      <div className="forecast-panel__head">
        <div>
          <h2 className="forecast-panel__title">{isHourly ? 'The next 24 hours' : 'The next 7 days'}</h2>
          <p className="forecast-panel__subtitle">{isHourly ? 'Your forecast, hour by hour.' : 'Your forecast, day by day.'}</p>
        </div>
        <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} ariaLabel="Forecast view" />
      </div>

      <ul className="forecast-panel__list">
        {isHourly
          ? hourly.map((point, index) => (
              <ForecastItem
                key={`${point.label}-${index}`}
                label={point.label}
                condition={point.condition}
                temperature={formatTemp(point.tempC, units)}
                rainChance={point.rainChance}
                isActive={index === 0}
              />
            ))
          : daily.map((point, index) => (
              <ForecastItem
                key={point.label}
                label={point.label}
                condition={point.condition}
                temperature={formatTemp(point.highC, units)}
                secondaryTemperature={formatTemp(point.lowC, units)}
                rainChance={point.rainChance}
                isActive={index === 0}
              />
            ))}
      </ul>

      <p className="forecast-panel__note">All times local · Rain chance in %</p>
    </Card>
  );
}

import { MapPin, Star, Sun } from 'lucide-react';
import type { CurrentConditions, LocationInfo, Units } from '../../types/weather';
import { formatTemp } from '../../utils/units';
import Button from '../Button/Button';
import Card from '../Card/card';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import './CurrentWeatherCard.css';

interface CurrentWeatherCardProps {
  location: LocationInfo;
  dateLabel: string;
  current: CurrentConditions;
  units: Units;
  isSaved: boolean;
  onToggleSaved: () => void;
}

export default function CurrentWeatherCard({
  location, dateLabel, current, units, isSaved, onToggleSaved,
}: CurrentWeatherCardProps) {
  return (
    <Card variant="tinted" className="current-card" aria-label={`Current weather in ${location.name}`}>
      <div className="current-card__top">
        <div>
          <h2 className="current-card__place"><MapPin size={16} aria-hidden="true" />{location.name}</h2>
          <p className="current-card__meta">{location.region}, {location.country} · {dateLabel}</p>
        </div>
        <Button
          variant="ghost"
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${location.name} from saved` : `Save ${location.name}`}
          icon={<Star size={16} fill={isSaved ? 'currentColor' : 'none'} />}
          onClick={onToggleSaved}
        />
      </div>

      <div className="current-card__body">
        <div className="current-card__reading">
          <p className="current-card__temp">{formatTemp(current.tempC, units)}</p>
          <WeatherIcon condition={current.condition} size={72} title={current.summary} />
        </div>
        <div className="current-card__summary">
          <p className="current-card__condition">{current.summary}</p>
          <p className="current-card__range">
            Feels like {formatTemp(current.feelsLikeC, units)} · High {formatTemp(current.highC, units)} · Low {formatTemp(current.lowC, units)}
          </p>
          <p className="current-card__tip"><Sun size={13} aria-hidden="true" />{current.tip}</p>
        </div>
      </div>
    </Card>
  );
}

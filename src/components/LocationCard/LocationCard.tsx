import { Trash2 } from 'lucide-react';
import type { Condition, LocationInfo } from '../../types/weather';
import Button from '../Button/Button';
import Card from '../Card/card';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import './LocationCard.css';

interface LocationCardProps {
  location: LocationInfo;
  temperature: string;
  condition: Condition;
  summary: string;
  isActive?: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export default function LocationCard({
  location, temperature, condition, summary, isActive = false, onSelect, onRemove,
}: LocationCardProps) {
  return (
    <Card as="article" className={`location-card${isActive ? ' location-card--active' : ''}`}>
      <button type="button" className="location-card__select" onClick={onSelect} aria-label={`Show weather for ${location.name}`}>
        <WeatherIcon condition={condition} size={36} />
        <span className="location-card__info">
          <span className="location-card__name">{location.name}</span>
          <span className="location-card__meta">{location.region} · {summary}</span>
        </span>
        <span className="location-card__temp">{temperature}</span>
      </button>
      <Button variant="ghost" aria-label={`Remove ${location.name}`} icon={<Trash2 size={15} />} onClick={onRemove} />
    </Card>
  );
}

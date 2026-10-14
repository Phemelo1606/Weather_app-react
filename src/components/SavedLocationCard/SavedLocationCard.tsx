import { useWeather } from '../../hooks/useWeather';
import type { SavedLocation, Units } from '../../types/weather';
import { formatTemp } from '../../utils/units';
import Card from '../Card/card';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import './SavedLocationCard.css';

interface SavedLocationCardProps {
  saved: SavedLocation; units: Units; onOpen: (locationId: string) => void; onRemove: (location: SavedLocation['location']) => void;
}

export default function SavedLocationCard({ saved, units, onOpen, onRemove }: SavedLocationCardProps) {
  const { data } = useWeather(saved.locationId);

  return (
    <Card as="article" className="saved-card">
      <button type="button" className="saved-card__main" onClick={() => onOpen(saved.locationId)}>
        <span>
          <strong className="saved-card__name">{saved.location.name}</strong>
          <span className="saved-card__region">{saved.location.region}</span>
        </span>
        {data ? (
          <span className="saved-card__weather">
            <WeatherIcon condition={data.current.condition} size={16} />
            <span className="saved-card__temp">{formatTemp(data.current.tempC, units)}</span>
          </span>
        ) : <span className="saved-card__region">Loading…</span>}
      </button>
      <button type="button" className="saved-card__remove" aria-label={`Remove ${saved.location.name}`}
        onClick={() => onRemove(saved.location)}>🗑</button>
    </Card>
  );
}

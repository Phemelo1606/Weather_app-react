import { Droplet } from 'lucide-react';
import type { Condition } from '../../types/weather';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import './ForecastItem.css';

interface ForecastItemProps {
  label: string;
  condition: Condition;
  temperature: string;
  secondaryTemperature?: string;
  rainChance: number;
  isActive?: boolean;
}

/** One tile in the forecast row. Used for both hourly and daily views. */
export default function ForecastItem({
  label, condition, temperature, secondaryTemperature, rainChance, isActive = false,
}: ForecastItemProps) {
  return (
    <li className={`forecast-item${isActive ? ' forecast-item--active' : ''}`}>
      <span className="forecast-item__label">{label}</span>
      <WeatherIcon condition={condition} size={30} />
      <span className="forecast-item__temp">{temperature}</span>
      {secondaryTemperature && <span className="forecast-item__secondary">{secondaryTemperature}</span>}
      <span className="forecast-item__rain"><Droplet size={11} aria-hidden="true" />{rainChance}%</span>
    </li>
  );
}

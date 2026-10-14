import type { Units } from '../types/weather';

const celsiusToFahrenheit = (celsius: number): number => (celsius * 9) / 5 + 32;

export const formatTemp = (celsius: number, units: Units): string => {
  const value = units === 'metric' ? celsius : celsiusToFahrenheit(celsius);
  return `${Math.round(value)}°${units === 'metric' ? 'C' : 'F'}`;
};

export const formatSpeed = (kmh: number, units: Units): string =>
  units === 'metric' ? `${Math.round(kmh)} km/h` : `${Math.round(kmh * 0.621371)} mph`;

export const formatDistance = (km: number, units: Units): string =>
  units === 'metric' ? `${Math.round(km)} km` : `${Math.round(km * 0.621371)} mi`;

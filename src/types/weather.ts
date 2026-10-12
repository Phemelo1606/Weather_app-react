export type Units = 'metric' | 'imperial';
export type Theme = 'light' | 'dark' | 'system';
export type Condition = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'storm';

export interface LocationInfo {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CurrentConditions {
  tempC: number;
  feelsLikeC: number;
  highC: number;
  lowC: number;
  condition: Condition;
  summary: string;
  tip: string;
  humidity: number;
  windKmh: number;
  gustKmh: number;
  windDirection: string;
  pressureHpa: number;
  pressureTrend: 'Rising' | 'Steady' | 'Falling';
  visibilityKm: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  daylight: string;
}

export interface HourlyPoint {
  label: string;
  tempC: number;
  rainChance: number;
  condition: Condition;
}

export interface DailyPoint {
  label: string;
  highC: number;
  lowC: number;
  rainChance: number;
  condition: Condition;
}

export interface WeatherAlert {
  id: string;
  title: string;
  message: string;
}

export interface WeatherData {
  location: LocationInfo;
  updatedAt: string;
  current: CurrentConditions;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  alerts: WeatherAlert[];
}

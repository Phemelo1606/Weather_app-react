import type {
  Condition, DailyPoint, HourlyPoint, LocationInfo, WeatherData,
} from '../types/weather';

const CITIES: LocationInfo[] = [
  { id: 'kimberley', name: 'Kimberley', region: 'Northern Cape', country: 'ZA', lat: -28.74, lon: 24.77 },
  { id: 'bloemfontein', name: 'Bloemfontein', region: 'Free State', country: 'ZA', lat: -29.12, lon: 26.21 },
  { id: 'cape-town', name: 'Cape Town', region: 'Western Cape', country: 'ZA', lat: -33.92, lon: 18.42 },
  { id: 'johannesburg', name: 'Johannesburg', region: 'Gauteng', country: 'ZA', lat: -26.2, lon: 28.05 },
  { id: 'pretoria', name: 'Pretoria', region: 'Gauteng', country: 'ZA', lat: -25.75, lon: 28.19 },
  { id: 'durban', name: 'Durban', region: 'KwaZulu-Natal', country: 'ZA', lat: -29.86, lon: 31.02 },
  { id: 'gqeberha', name: 'Gqeberha', region: 'Eastern Cape', country: 'ZA', lat: -33.96, lon: 25.6 },
  { id: 'upington', name: 'Upington', region: 'Northern Cape', country: 'ZA', lat: -28.45, lon: 21.26 },
];

const CONDITION_CYCLE: Condition[] = ['sunny', 'sunny', 'partly-cloudy', 'partly-cloudy', 'cloudy', 'rain'];
const SUMMARIES: Record<Condition, string> = {
  sunny: 'Sunny',
  'partly-cloudy': 'Partly cloudy',
  cloudy: 'Cloudy',
  rain: 'Rain showers',
  storm: 'Thunderstorms',
};
const TIPS: Record<Condition, string> = {
  sunny: 'Clear skies. A good day to get outside.',
  'partly-cloudy': 'Sunny breaks ahead. A good day to get outside.',
  cloudy: 'Overcast but dry. Light layers will do.',
  rain: 'Showers on the way. Take an umbrella.',
  storm: 'Storms possible. Stay indoors if you can.',
};
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const wait = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));
const hashString = (text: string): number =>
  [...text].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
const formatHour = (hour: number): string => `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`;

function buildHourly(seed: number, baseTemp: number): HourlyPoint[] {
  const start = new Date();
  return Array.from({ length: 24 }, (_, index) => {
    const hour = (start.getHours() + index) % 24;
    const swing = 4 * Math.sin(((hour - 9) / 24) * 2 * Math.PI);
    const condition = CONDITION_CYCLE[(seed + Math.floor(index / 3)) % CONDITION_CYCLE.length];
    return {
      label: index === 0 ? 'Now' : formatHour(hour),
      tempC: Math.round(baseTemp + swing),
      rainChance: condition === 'rain' ? 60 : (seed + index * 7) % 25,
      condition,
    };
  });
}

function buildDaily(seed: number, baseTemp: number): DailyPoint[] {
  const today = new Date().getDay();
  return Array.from({ length: 7 }, (_, index) => {
    const condition = CONDITION_CYCLE[(seed + index) % CONDITION_CYCLE.length];
    return {
      label: index === 0 ? 'Today' : WEEKDAYS[(today + index) % 7],
      highC: baseTemp + 3 + ((seed + index) % 4),
      lowC: baseTemp - 6 + ((seed + index) % 3),
      rainChance: condition === 'rain' ? 55 : (seed + index * 5) % 30,
      condition,
    };
  });
}

function buildWeather(location: LocationInfo): WeatherData {
  const seed = hashString(location.id);
  const baseTemp = 14 + (seed % 14);
  const hourly = buildHourly(seed, baseTemp);
  const daily = buildDaily(seed, baseTemp);
  const now = hourly[0];
  const hasAlert = location.id === 'kimberley' || seed % 3 === 0;

  return {
    location,
    updatedAt: new Date().toISOString(),
    current: {
      tempC: now.tempC,
      feelsLikeC: now.tempC - 1,
      highC: daily[0].highC,
      lowC: daily[0].lowC,
      condition: now.condition,
      summary: SUMMARIES[now.condition],
      tip: TIPS[now.condition],
      humidity: 40 + (seed % 40),
      windKmh: 8 + (seed % 20),
      gustKmh: 22 + (seed % 25),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][seed % 8],
      pressureHpa: 1008 + (seed % 14),
      pressureTrend: (['Rising', 'Steady', 'Falling'] as const)[seed % 3],
      visibilityKm: 6 + (seed % 12),
      uvIndex: 2 + (seed % 8),
      sunrise: '7:12',
      sunset: '18:42',
      daylight: '11h 30m',
    },
    hourly,
    daily,
    alerts: hasAlert
      ? [{
          id: `${location.id}-wind`,
          title: 'Strong wind advisory',
          message: 'Today, 3–8 PM. Gusts up to 45 km/h expected. Take care outdoors.',
        }]
      : [],
  };
}

export async function searchLocations(query: string): Promise<LocationInfo[]> {
  await wait(300);
  const term = query.trim().toLowerCase();
  return CITIES.filter(
    (city) => city.name.toLowerCase().includes(term) || city.region.toLowerCase().includes(term),
  );
}

export async function findNearestLocation(lat: number, lon: number): Promise<LocationInfo> {
  await wait(300);
  const distance = (city: LocationInfo) => (city.lat - lat) ** 2 + (city.lon - lon) ** 2;
  return [...CITIES].sort((a, b) => distance(a) - distance(b))[0];
}

export async function fetchWeather(locationId: string): Promise<WeatherData> {
  await wait();
  const location = CITIES.find((city) => city.id === locationId);
  if (!location) throw new Error(`Unknown location: ${locationId}`);
  return buildWeather(location);
}

import type {
  DailyPoint, HourlyPoint, LocationInfo, WeatherData,
} from '../types/weather';

const BASE_URL = import.meta.env.VITE_MOCKAPI_URL;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const formatHour = (hour: number): string => `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`;

// Shape of a record in the MockAPI `weather` resource.
interface WeatherRecord {
  id: string;
  locationId: string;
  location: LocationInfo;
  current: WeatherData['current'];
  hourly: Array<Omit<HourlyPoint, 'label'> & { hour: number }>;
  daily: Array<Omit<DailyPoint, 'label'> & { dayOffset: number }>;
  alerts: WeatherData['alerts'];
}

let allRecordsRequest: Promise<WeatherRecord[]> | null = null;

function getUrl(path: string): string {
  if (!BASE_URL) throw new Error('VITE_MOCKAPI_URL is not configured.');
  if (BASE_URL.endsWith('/')) {
    throw new Error('VITE_MOCKAPI_URL must not have a trailing slash.');
  }
  if (!path.startsWith('/') || path.startsWith('//')) {
    throw new Error(`API paths must start with exactly one slash: ${path}`);
  }
  return `${BASE_URL}${path}`;
}

async function getJson<T>(path: string): Promise<T> {
  const url = getUrl(path);
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`Network request failed for ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!response.ok) throw new Error(`Request failed (${response.status}) for ${url}`);
  try {
    return await response.json() as T;
  } catch (error) {
    throw new Error(`Invalid JSON response (${response.status}) for ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function getAllRecords(): Promise<WeatherRecord[]> {
  if (!allRecordsRequest) {
    allRecordsRequest = getJson<WeatherRecord[]>('/weather')
      .then((records) => {
        const url = getUrl('/weather');
        if (!Array.isArray(records)) {
          throw new Error(`Invalid weather response (HTTP 200) for ${url}: expected an array of records.`);
        }
        records.forEach((record) => validateRecord(record, url));
        return records;
      })
      .catch((error: unknown) => {
        allRecordsRequest = null;
        throw error;
      });
  }
  return allRecordsRequest;
}

function validateRecord(record: WeatherRecord, url: string): void {
  if (
    !record
    || typeof record.id !== 'string'
    || typeof record.locationId !== 'string'
    || !record.id
    || !record.locationId
    || !record.location
    || typeof record.location.name !== 'string'
    || typeof record.location.region !== 'string'
    || !record.current
    || !Array.isArray(record.hourly)
    || record.hourly.length !== 24
    || !record.hourly.every((item) => item && Number.isInteger(item.hour))
    || !Array.isArray(record.daily)
    || record.daily.length !== 7
    || !record.daily.every((item) => item && Number.isInteger(item.dayOffset))
    || !Array.isArray(record.alerts)
  ) {
    throw new Error(`Invalid weather record (HTTP 200) for ${url}: expected id, locationId, location, current, 24 hourly entries, 7 daily entries, and alerts.`);
  }
}

export async function searchLocations(query: string): Promise<LocationInfo[]> {
  const term = query.trim().toLowerCase();
  const records = await getAllRecords();
  return records
    .map((record) => record.location)
    .filter(
      (city) => city.name.toLowerCase().includes(term) || city.region.toLowerCase().includes(term),
    );
}

export async function findNearestLocation(lat: number, lon: number): Promise<LocationInfo> {
  const cities = (await getAllRecords()).map((record) => record.location);
  if (cities.length === 0) {
    throw new Error(`No weather locations are available (HTTP 200) for ${getUrl('/weather')}`);
  }
  const distance = (city: LocationInfo) => (city.lat - lat) ** 2 + (city.lon - lon) ** 2;
  return [...cities].sort((a, b) => distance(a) - distance(b))[0];
}

export async function fetchWeather(locationId: string): Promise<WeatherData> {
  const path = `/weather?locationId=${encodeURIComponent(locationId)}`;
  const url = getUrl(path);
  const matches = await getJson<WeatherRecord[]>(path);
  if (!Array.isArray(matches)) {
    throw new Error(`Invalid weather response (HTTP 200) for ${url}: expected an array of records.`);
  }
  // MockAPI's field filter can do a partial match, so pick the exact one.
  const record = matches.find((item) => item.locationId === locationId);
  if (!record) throw new Error(`Weather location "${locationId}" not found (HTTP 200) for ${url}`);
  validateRecord(record, url);

  // Time-relative parts (labels, ordering) are derived here; everything else comes from the API.
  const startHour = new Date().getHours();
  const hourly: HourlyPoint[] = Array.from({ length: 24 }, (_, index) => {
    const hour = (startHour + index) % 24;
    const entry = record.hourly.find((item) => item.hour === hour);
    if (!entry) throw new Error(`Invalid hourly forecast (HTTP 200) for ${url}: missing hour ${hour}.`);
    return {
      label: index === 0 ? 'Now' : formatHour(entry.hour),
      tempC: entry.tempC,
      rainChance: entry.rainChance,
      condition: entry.condition,
    };
  });

  const today = new Date().getDay();
  const daily: DailyPoint[] = [...record.daily]
    .sort((a, b) => a.dayOffset - b.dayOffset)
    .map((entry) => ({
      label: entry.dayOffset === 0 ? 'Today' : WEEKDAYS[(today + entry.dayOffset) % 7],
      highC: entry.highC,
      lowC: entry.lowC,
      rainChance: entry.rainChance,
      condition: entry.condition,
    }));

  return {
    location: record.location,
    updatedAt: new Date().toISOString(),
    current: record.current,
    hourly,
    daily,
    alerts: record.alerts,
  };
}

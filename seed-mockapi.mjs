// One-off seed script: generates the weather data and uploads it to MockAPI.io.
//
// Usage (Node 18+):
//   MOCKAPI_URL=https://6ace180ef338359cf1c31221.mockapi.io node seed-mockapi.mjs
//
// Creates one record per city in the `weather` resource.
// Run it once. Running it again will create duplicates, so clear the resource first.

const BASE_URL = process.env.MOCKAPI_URL?.replace(/\/+$/, '');
if (!BASE_URL) {
  console.error('Set MOCKAPI_URL to your MockAPI project base URL.');
  process.exit(1);
}

const CITIES = [
  { id: 'kimberley', name: 'Kimberley', region: 'Northern Cape', country: 'ZA', lat: -28.74, lon: 24.77 },
  { id: 'bloemfontein', name: 'Bloemfontein', region: 'Free State', country: 'ZA', lat: -29.12, lon: 26.21 },
  { id: 'cape-town', name: 'Cape Town', region: 'Western Cape', country: 'ZA', lat: -33.92, lon: 18.42 },
  { id: 'johannesburg', name: 'Johannesburg', region: 'Gauteng', country: 'ZA', lat: -26.2, lon: 28.05 },
  { id: 'pretoria', name: 'Pretoria', region: 'Gauteng', country: 'ZA', lat: -25.75, lon: 28.19 },
  { id: 'durban', name: 'Durban', region: 'KwaZulu-Natal', country: 'ZA', lat: -29.86, lon: 31.02 },
  { id: 'gqeberha', name: 'Gqeberha', region: 'Eastern Cape', country: 'ZA', lat: -33.96, lon: 25.6 },
  { id: 'upington', name: 'Upington', region: 'Northern Cape', country: 'ZA', lat: -28.45, lon: 21.26 },
];

const CONDITION_CYCLE = ['sunny', 'sunny', 'partly-cloudy', 'partly-cloudy', 'cloudy', 'rain'];
const SUMMARIES = {
  sunny: 'Sunny',
  'partly-cloudy': 'Partly cloudy',
  cloudy: 'Cloudy',
  rain: 'Rain showers',
  storm: 'Thunderstorms',
};
const TIPS = {
  sunny: 'Clear skies. A good day to get outside.',
  'partly-cloudy': 'Sunny breaks ahead. A good day to get outside.',
  cloudy: 'Overcast but dry. Light layers will do.',
  rain: 'Showers on the way. Take an umbrella.',
  storm: 'Storms possible. Stay indoors if you can.',
};

const hashString = (text) =>
  [...text].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);

// Hourly data is stored by hour of day (0-23). The app rotates it to start at the current hour.
function buildHourly(seed, baseTemp) {
  return Array.from({ length: 24 }, (_, hour) => {
    const swing = 4 * Math.sin(((hour - 9) / 24) * 2 * Math.PI);
    const condition = CONDITION_CYCLE[(seed + Math.floor(hour / 3)) % CONDITION_CYCLE.length];
    return {
      hour,
      tempC: Math.round(baseTemp + swing),
      rainChance: condition === 'rain' ? 60 : (seed + hour * 7) % 25,
      condition,
    };
  });
}

// Daily data is stored by day offset (0 = today). The app turns offsets into weekday labels.
function buildDaily(seed, baseTemp) {
  return Array.from({ length: 7 }, (_, dayOffset) => {
    const condition = CONDITION_CYCLE[(seed + dayOffset) % CONDITION_CYCLE.length];
    return {
      dayOffset,
      highC: baseTemp + 3 + ((seed + dayOffset) % 4),
      lowC: baseTemp - 6 + ((seed + dayOffset) % 3),
      rainChance: condition === 'rain' ? 55 : (seed + dayOffset * 5) % 30,
      condition,
    };
  });
}

function buildRecord(location) {
  const seed = hashString(location.id);
  const baseTemp = 14 + (seed % 14);
  const hourly = buildHourly(seed, baseTemp);
  const daily = buildDaily(seed, baseTemp);
  const now = hourly[new Date().getHours()];
  const hasAlert = location.id === 'kimberley' || seed % 3 === 0;

  return {
    locationId: location.id,
    location,
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
      pressureTrend: ['Rising', 'Steady', 'Falling'][seed % 3],
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

for (const city of CITIES) {
  const response = await fetch(`${BASE_URL}/weather`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildRecord(city)),
  });
  if (!response.ok) {
    console.error(`Failed for ${city.name}: ${response.status} ${await response.text()}`);
    process.exit(1);
  }
  console.log(`Uploaded ${city.name}`);
}
console.log('Done.');

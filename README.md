# Nimbus: React Weather App

A responsive React + TypeScript weather app for checking current conditions and forecasts for your location or any city you search for. Built for **Task 4: React Weather App** (ReactTS, Lesson 4).

## Features

- Detects your location (with permission) and shows its weather
- Search for cities and locations
- Current conditions: temperature, humidity, wind speed, pressure, visibility, UV index, sunrise and sunset
- Hourly and daily forecasts with a toggle between the two
- Save favourite locations and switch between them (stored in MockAPI)
- Local notifications for severe weather alerts (when permission is granted)
- Light and dark themes, and Celsius/Fahrenheit display units
- Cached weather data for offline access
- Toast notifications for background processes and completed actions
- Responsive layout at 320, 480, 768, 1024 and 1200px

## Tech Stack

- React + TypeScript (Vite)
- `react-router` for routing
- MockAPI.io for weather data and saved locations
- Browser `localStorage` for settings, cached weather and the last viewed location
- Plain CSS, one stylesheet per component

## Getting Started

### 1. Set up MockAPI

Create a project at [mockapi.io](https://mockapi.io) with two resources:

- `weather`: filled by the seed script below
- `saved`: with the fields `locationId` (string) and `location` (object)

### 2. Install and configure

```bash
npm install
npm install react-router
```

Copy `.env.example` to `.env` and set your MockAPI base URL, with no resource name, no `/api/v1` and no trailing slash:

```
VITE_MOCKAPI_URL=https://YOUR_PROJECT_ID.mockapi.io
```

Restart the dev server after changing `.env`. Do not commit `.env`.

### 3. Seed the weather data (run once)

```bash
MOCKAPI_URL=https://YOUR_PROJECT_ID.mockapi.io node seed-mockapi.mjs
```

On Windows PowerShell:

```powershell
$env:MOCKAPI_URL="https://YOUR_PROJECT_ID.mockapi.io"; node seed-mockapi.mjs
```

Running it twice creates duplicates, so clear the `weather` resource first if you need to re-seed.

### 4. Run

```bash
npm run dev
```

## Routes

| Path        | Page                                                                              |
| ----------- | --------------------------------------------------------------------------------- |
| `/`         | Home: current weather, forecast and details (`/?loc=<locationId>` selects a city) |
| `/saved`    | Saved locations                                                                   |
| `/settings` | Theme, units and alert notifications                                              |

## How Data Is Stored

| Data                     | Where                                           |
| ------------------------ | ----------------------------------------------- |
| Weather records          | MockAPI `weather` resource (read)               |
| Saved locations          | MockAPI `saved` resource (create, read, delete) |
| Theme and units          | `localStorage`                                  |
| Cached weather (offline) | `localStorage`                                  |
| Last viewed location     | `localStorage`                                  |

The task asks for `localStorage` as the main store. MockAPI is used in addition for weather and saved-location data.

## Privacy

- Your device location is used only in the browser to pick the nearest city. Coordinates are never sent to or stored on a server.
- Only the locations you choose to save are sent to MockAPI.
- Settings and cached weather stay on your device.

## Project Structure

```
src/
├── api/            MockAPI services (weather, saved locations)
├── components/     Reusable UI components, each with its own .css file
├── context/        Settings and toast providers
├── hooks/          useWeather, useSavedLocations
├── layouts/
├── pages/          Home, Saved, Settings
├── types/
├── utils/          Unit conversion helpers
├── App.tsx
├── main.tsx
└── index.css       Theme variables and shared page layout
```

Reusable components include the search bar, header and navigation, current weather card, forecast tiles and panel, details grid, saved location card, alert banner, toasts, segmented control and spinner. They are customised through props rather than duplicated.

## Design

- Figma: https://www.figma.com/design/30T93kMIKhOA9KB1nm8jxH/Untitled?node-id=1-2&t=2H7Jcv2oJ25maakl-1
- Inspiration: [Weather App UI Design on Dribbble](https://dribbble.com/shots/27472320-Weather-App-UI-Design-Clean-Forecast-Experience)

## Host link

- https://weatherapp-react-sand.vercel.app/

## Troubleshooting

- **Blank page:** open the browser console (F12) and read the first red error.
- **Requests return 404:** check `VITE_MOCKAPI_URL` has no `/api/v1` or trailing slash, and that both resources exist.
- **No cities appear:** open `YOUR_BASE_URL/weather` in the browser. If it shows `[]`, run the seed script.
- **`.env` changes ignored:** restart `npm run dev`.

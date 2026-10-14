# Weather App

A simple React weather application for checking current weather and forecasts for different locations.

## Features
- Search for cities and locations
- View current weather details
- See hourly or daily forecasts
- Save favourite locations using MockAPI
- Keep settings and cached weather in local storage
- Responsive design for desktop and mobile

## Getting Started

Create a MockAPI project with `weather` and `saved` resources, then configure its API base URL:

```bash
npm install
```

Copy `.env.example` to `.env` and use your MockAPI base URL without a resource prefix or trailing slash. The app expects the `weather` and `saved` resources under that base URL. Restart the Vite development server after changing `.env`. Do not commit `.env`.

```bash
npm run dev
```

## Project Details
- Built with React
- Intended for the Task 4 React Weather App assignment
- Uses MockAPI for weather and saved-location data
- Uses browser local storage for settings and cached weather

## Project Structure
```bash
src/
├── api/
├── components/
│   └── [reusable components, each with its own stylesheet]
├── context/
├── hooks/
├── layouts/
├── pages/
├── types/
├── utils/
├── App.tsx
├── main.tsx
└── index.css
```

The `src/components/` folder is where reusable UI components for the weather app should live. Examples include the search input, current weather card, forecast tiles, saved location list, theme toggle, and alert banner. Keeping these pieces in separate components makes the app easier to maintain, reuse, and scale.

## Figma Link
- https://www.figma.com/design/30T93kMIKhOA9KB1nm8jxH/Untitled?node-id=1-2&t=2H7Jcv2oJ25maakl-1

- inspiration for design from dribbble: https://dribbble.com/shots/27472320-Weather-App-UI-Design-Clean-Forecast-Experience

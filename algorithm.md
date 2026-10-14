# Weather App Algorithm

## 1. Project Goal
The app will provide users with current weather information and short-term forecasts for their current location and any searched city. It will save recent and favourite locations in local storage so users do not have to repeatedly search for the same places. The app should also support theme switching, unit conversion, responsive layout, and offline-friendly cached weather data.

## 2. Design Overview
The application will have the following sections:
- Header: app title, theme toggle, unit toggle, search bar
- Current location card: city name, date, weather icon, temperature, humidity, wind speed, and conditions
- Forecast section: toggle between hourly and daily forecast
- Saved locations panel: favourite or recently visited cities
- Notifications/alerts area: severe weather warnings for the active location

This layout keeps the main information visible while making secondary controls easy to access on mobile and desktop.

## 3. Step-by-Step Planning

### Step 1: Set up the app structure
- Create the root React components for the layout.
- Define state for current weather, forecast, selected location, theme, units, loading state, and saved locations.
- Set the initial theme and unit values from local storage if they exist.

### Step 2: Manage saved locations
- Use localStorage to store:
  - favourite locations
  - recently searched cities
  - theme preference
  - selected unit (Celsius or Fahrenheit)
- On page load, load saved values and restore the app state.
- When the user saves a location, check if it already exists before adding it again.

### Step 3: Detect the user location
- Request browser geolocation permission.
- If permission is granted, read latitude and longitude.
- Convert coordinates to a city name using a reverse geocoding API or weather API response.
- If permission is denied, fall back to a default city such as Johannesburg or a previously saved location.

### Step 4: Search for a city
- When the user submits a location query:
  - trim whitespace
  - validate that the search is not empty
  - call the weather API with the city name
- If the result is successful, update the selected location and store it in recent searches.
- If not found, show a friendly error message.

### Step 5: Fetch weather data
- Use a weather API endpoint to fetch:
  - current weather conditions
  - hourly forecast
  - daily forecast
- Combine the returned data into a single state object for easier rendering.
- Cache the response in localStorage and/or session memory to reduce repeated reloads.

### Step 6: Display current weather
- Render temperature, humidity, wind speed, weather description, and icon.
- Format the day/time based on the selected location timezone.
- Convert values according to the active unit system.

### Step 7: Display forecasts
- Add a toggle to switch between hourly and daily views.
- For hourly forecast: show next 12 hours with time, icon, and temperature.
- For daily forecast: show 5 to 7 days with date, weather icon, high/low temperatures, and precipitation probability.

### Step 8: Implement alerts
- Check if the returned data includes severe weather warnings.
- If an alert is present, display a banner or notification near the top of the page.
- Use Notification API when available and the user has allowed notifications.

### Step 9: Enable theme and unit customization
- Theme toggle switches between light and dark mode.
- Unit toggle switches between Celsius and Fahrenheit.
- Convert display values while keeping the original API data intact for calculations.

### Step 10: Make the app responsive and offline-friendly
- Use CSS media queries for mobile, tablet, and desktop breakpoints.
- Ensure cards stack correctly on smaller screens.
- Display cached weather data when the network is unavailable.
- Store the last weather response in localStorage so the app can still show meaningful information offline.

### Step 11: Validate and refine
- Check that loading and error states work correctly.
- Confirm that saved locations are restored properly after refresh.
- Test search, geolocation fallback, forecast toggle, and alert rendering.

## 5. Data Flow
1. User opens the app.
2. App reads saved preferences and locations from localStorage.
3. Browser attempts to get geolocation.
4. If available, weather data is fetched for the current location.
5. User can search or select a saved location.
6. Weather API response is processed and displayed.
7. Forecast view switches between hourly and daily data.
8. App stores the latest settings and data locally for quick reload and offline use.

## 6. Algorithm Summary
The algorithm follows a simple event-driven structure:
- initialize state
- restore saved preferences
- detect or select a location
- fetch weather data
- transform and render the results
- update local storage
- respond to user actions such as search, theme change, and forecast toggle

This design ensures the app is understandable, maintainable, and responsive while meeting the requirements for weather forecasting, saved locations, and user customization.

## 7. UI Implementation Plan
- Use reusable cards for weather summary, hourly items, and daily items.
- Use a shared button component for theme and unit switching.
- Use a reusable search input and location list component.
- Keep layout responsive with CSS Grid and Flexbox.
- Use semantic HTML and accessible labels for form controls.

## 8. Expected Outcome
The final weather app should allow a user to:
- see current weather for a detected or searched city
- switch between hourly and daily forecasts
- save favourite locations for faster access
- change theme and unit preferences
- keep data available offline using local storage
- view weather alerts when severe conditions are detected

# Specs

## Saved Locations
- Behavior: The sidebar shows saved city cards, highlighting the currently selected city.
- Usage: Click a saved city card to make it the active weather location.
- Source: `src/components/Sidebar/Sidebar.jsx`, `src/components/Sidebar/LocationCard.jsx`, `src/constants/defaultCities.js`

## Search and Add Location
- Behavior: Search input accepts new city names, and selected search results are appended to the saved list.
- Usage: Enter a city in the sidebar search field, select a result, and the application loads its weather and selects it.
- Source: `src/components/Sidebar/SearchBar.jsx`, `src/components/Sidebar/Sidebar.jsx`

## Current Weather Display
- Behavior: Shows the current weather snapshot for the active city.
- Usage: Read the temperature, condition, and current weather metrics immediately after selecting a city or refreshing.
- Source: `src/components/CurrentWeather/CurrentWeather.jsx`, `src/App.jsx`

## Forecast Summary Card
- Behavior: Displays a quick multi-day weather forecast and includes an action to open the detailed outlook.
- Usage: View the daily forecast tiles and tap the outlook button to inspect hourly details.
- Source: `src/components/Forecast/ForecastCard.jsx`, `src/components/Forecast/ForecastGrid.jsx`

## Detailed Outlook Modal
- Behavior: Presents hourly forecast data in two tabs: a table and charts.
- Usage: Open the detailed outlook from the forecast card, then switch between tabulated data and graphical view. Hover chart points for tooltip details.
- Source: `src/components/Forecast/DetailedOutlookModal.jsx`, `src/hooks/useOutlookData.js`, `src/hooks/useChartHover.js`

## Top Bar Controls
- Behavior: Displays the current city name, date, unit toggle, refresh button, and device location.
- Usage:
  - `°C` / `°F`: Toggle temperature units.
  - Refresh button: Reload weather data for the active city.
  - Device location: Shows the device's current geolocation if allowed.
- Source: `src/components/Topbar/TopBar.jsx`, `src/App.jsx`

## Device Location Display
- Behavior: When browser geolocation permission is granted, the top bar displays the device city and street address.
- Usage: On page load, geolocation runs automatically; if successful, the top bar updates to show the current device location. If geolocation fails or is denied, it falls back to an unavailable state.
- Source: `src/components/Topbar/TopBar.jsx`, `src/API/weather.js`

## Device Battery Status
- Behavior: Shows battery percentage and charging state in the sidebar.
- Usage: Automatically reads battery info from the browser if supported and updates on battery level or charging state changes.
- Source: `src/components/Sidebar/Sidebar.jsx`

## Weather Data Fetching and Transformation
- Behavior: Fetches weather data from the Open-Meteo API and transforms hourly data for display.
- Usage: `useWeather` fetches current and forecast data based on selected city coordinates. `useOutlookData` converts hourly arrays into row objects and chart points.
- Source: `src/hooks/useWeather.js`, `src/hooks/useOutlookData.js`, `src/API/weather.js`

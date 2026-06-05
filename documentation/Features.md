# Features

## 1. Saved Locations
- Location: `src/components/Sidebar/Sidebar.jsx`
- Related files: `src/components/Sidebar/SearchBar.jsx`, `src/components/Sidebar/LocationCard.jsx`, `src/constants/defaultCities.js`
- Description: Displays a list of saved city cards. The sidebar loads default cities from `DEFAULT_CITIES`, updates the active city, and lets the user switch between saved locations.

## 2. Search and Add Location
- Location: `src/components/Sidebar/SearchBar.jsx`
- Related files: `src/components/Sidebar/Sidebar.jsx`, `src/hooks/useWeather.js`
- Description: Allows searching for new cities and adding them to the saved location list. New cities are added to the sidebar and become the currently selected city.

## 3. Current Weather Display
- Location: `src/components/CurrentWeather/CurrentWeather.jsx`
- Related files: `src/App.jsx`, `src/hooks/useWeather.js`, `src/API/weather.js`
- Description: Shows the current weather metrics for the selected city, including temperature, humidity, wind, and additional summary values.

## 4. Forecast Summary Card
- Location: `src/components/Forecast/ForecastCard.jsx`
- Related files: `src/components/Forecast/ForecastGrid.jsx`, `src/App.jsx`, `src/hooks/useWeather.js`
- Description: Displays a quick daily forecast summary and provides access to the detailed outlook modal.

## 5. Detailed Outlook Modal
- Location: `src/components/Forecast/DetailedOutlookModal.jsx`
- Related files: `src/components/Forecast/ForecastCard.jsx`, `src/hooks/useOutlookData.js`, `src/hooks/useChartHover.js`
- Description: Presents hourly forecast data in tabbed table and chart views, including min/max/avg/trend values and interactive charts.

## 6. Today Highlight Panel
- Location: `src/components/TodayHighlight/TodayHighlight.jsx`
- Related files: `src/App.jsx`, `src/hooks/useWeather.js`
- Description: Highlights important weather metrics for the current day in a separate panel on the right side.

## 7. Top Bar Controls
- Location: `src/components/Topbar/TopBar.jsx`
- Related files: `src/App.jsx`, `src/hooks/useWeather.js`, `src/API/weather.js`
- Description: Displays current city, date, unit toggle buttons, refresh button, and dynamic device location information.

## 8. Device Location Display
- Location: `src/components/Topbar/TopBar.jsx`
- Related files: `src/API/weather.js`, `src/hooks/useWeather.js`
- Description: Uses browser geolocation and reverse geocoding to show the device's current city and street location in the top bar.

## 9. Device Battery Status
- Location: `src/components/Sidebar/Sidebar.jsx`
- Related files: `src/API/weather.js`
- Description: Shows battery level and charging state for supported browsers using the Battery Status API.

## 10. Weather Data Fetching and Transformation
- Location: `src/hooks/useWeather.js`
- Related files: `src/API/weather.js`, `src/hooks/useOutlookData.js`
- Description: Centralized hook for fetching current and forecast weather data. It also initializes the default/current city and handles the selected city state.

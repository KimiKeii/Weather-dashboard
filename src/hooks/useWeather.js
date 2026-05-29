// src/hooks/useWeather.js
import { useState, useEffect, useCallback } from "react";
import { getWeather, reverseGeocode } from "/workspaces/Weather-dashboard/src/API/weather.js";

export function useWeather() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (lat, lon, name, country) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeather(lat, lon);
      setWeatherData(data);
      setSelectedCity({ name, country, lat, lon });
    } catch (err) {
      setError("Failed to fetch weather data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const geo = await reverseGeocode(latitude, longitude);
            fetchWeather(latitude, longitude, geo.name, geo.country);
          } catch {
            fetchWeather(51.5074, -0.1278, "London", "UK");
          }
        },
        () => fetchWeather(51.5074, -0.1278, "London", "UK")
      );
    } else {
      fetchWeather(51.5074, -0.1278, "London", "UK");
    }
  }, [fetchWeather]);

  return { weatherData, isLoading, error, selectedCity, fetchWeather };
}
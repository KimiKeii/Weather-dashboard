import { useState, useEffect, useCallback } from "react";
import { getWeather, reverseGeocode } from "../API/weather";

const DEFAULT_CITY = {
  name: "London",
  country: "United Kingdom",
  lat: 51.5074,
  lon: -0.1278,
};

export function useWeather() {
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
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
    // Default to London — skip geolocation to avoid CORS issues with Nominatim
    fetchWeather(51.5074, -0.1278, "London", "United Kingdom");
  }, [fetchWeather]);

  return { weatherData, isLoading, error, selectedCity, fetchWeather };
}
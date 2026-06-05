import { useState, useEffect, useCallback } from "react";
import { getWeather, reverseGeocode } from "../API/weather";

const DEFAULT_CITY = {
  name: "LOADING...",
  country: "",
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
  return { weatherData, isLoading, error, selectedCity, fetchWeather };
}
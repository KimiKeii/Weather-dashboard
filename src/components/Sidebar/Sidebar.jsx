import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import LocationCard from "./LocationCard";
import { getWeather, getWeatherEmoji } from "../../API/weather";

const DEFAULT_CITIES = [
  { id: 1, name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { id: 2, name: "New York", country: "United States", lat: 40.7128, lon: -74.006 },
  { id: 3, name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708 },
  { id: 4, name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
];

export default function Sidebar({ onCitySelect }) {
  const [activeId, setActiveId] = useState(1);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    async function loadTemps() {
      const updated = await Promise.all(
        DEFAULT_CITIES.map(async (city) => {
          const data = await getWeather(city.lat, city.lon);
          const temp = Math.round(data.current.temperature_2m);
          const emoji = getWeatherEmoji(data.current.weathercode);
          return { ...city, temp, emoji };
        })
      );
      setCities(updated);
      onCitySelect(updated[0]);
    }
    loadTemps();
  }, []);

  function handleSelect(city) {
    setActiveId(city.id);
    onCitySelect(city);
  }

  function handleNewCity(city) {
    const newCity = {
      id: Date.now(),
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
      temp: "...",
      emoji: "🌍",
    };
    setCities((prev) => [...prev, newCity]);
    setActiveId(newCity.id);
    onCitySelect(newCity);

    getWeather(city.lat, city.lon).then((data) => {
      const temp = Math.round(data.current.temperature_2m);
      const emoji = getWeatherEmoji(data.current.weathercode);
      setCities((prev) =>
        prev.map((c) => (c.id === newCity.id ? { ...c, temp, emoji } : c))
      );
    });
  }

  return (
    <aside className="flex flex-col w-full h-full min-h-full bg-white border-r border-gray-200 px-4 py-5 gap-4">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-lg">
          ⛅
        </div>
        <span className="text-sm font-medium text-gray-800">
          WeatherScope <span className="text-blue-500">Pro</span>
        </span>
      </div>

      <SearchBar onCitySelect={handleNewCity} />

      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
        Saved locations
      </p>

      <div className="flex flex-col gap-1 overflow-y-auto">
        {cities.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-4">Loading...</p>
        )}
        {cities.map((city) => (
          <LocationCard
            key={city.id}
            city={city}
            isActive={activeId === city.id}
            onClick={() => handleSelect(city)}
          />
        ))}
      </div>

    </aside>
  );
}
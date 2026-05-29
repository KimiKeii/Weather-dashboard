import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import LocationCard from "./LocationCard";
import { getWeather, getWeatherEmoji, reverseGeocode } from "../../API/weather";

const DEFAULT_CITIES = [
];

export default function Sidebar({ onCitySelect }) {
  const [activeId, setActiveId] = useState(null);
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

      if (!navigator.geolocation) {
        setActiveId(updated[0].id);
        onCitySelect(updated[0]);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const location = await reverseGeocode(coords.latitude, coords.longitude);
            const data = await getWeather(coords.latitude, coords.longitude);
            const temp = Math.round(data.current.temperature_2m);
            const emoji = getWeatherEmoji(data.current.weathercode);

            const currentLocationCity = {
              id: Date.now(),
              name: location.name || "Current Location",
              country: location.country || "",
              lat: coords.latitude,
              lon: coords.longitude,
              temp,
              emoji,
            };

            setCities((prev) => {
              if (prev.some((city) => city.lat === currentLocationCity.lat && city.lon === currentLocationCity.lon)) {
                const existing = prev.find(
                  (city) => city.lat === currentLocationCity.lat && city.lon === currentLocationCity.lon
                );
                setActiveId(existing.id);
                onCitySelect(existing);
                return prev;
              }

              setActiveId(currentLocationCity.id);
              onCitySelect(currentLocationCity);
              return [currentLocationCity, ...prev];
            });
          } catch (error) {
            console.error("Unable to load current location weather:", error);
            setActiveId(updated[0].id);
            onCitySelect(updated[0]);
          }
        },
        () => {
          setActiveId(updated[0].id);
          onCitySelect(updated[0]);
        }
      );
    }

    loadTemps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(city) {
    setActiveId(city.id);
    onCitySelect(city);
  }

  function handleRemoveCity(cityId) {
    setCities((prev) => {
      const updated = prev.filter((city) => city.id !== cityId);
      if (activeId === cityId && updated.length > 0) {
        setActiveId(updated[0].id);
        onCitySelect(updated[0]);
      }
      return updated;
    });
  }

  function handleNewCity(city) {
    const existing = cities.find(
      (item) => item.lat === city.lat && item.lon === city.lon
    );

    if (existing) {
      setActiveId(existing.id);
      onCitySelect(existing);
      return;
    }

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
    onCitySelect({ ...newCity, isLoading: true });

    getWeather(city.lat, city.lon).then((data) => {
      const temp = Math.round(data.current.temperature_2m);
      const emoji = getWeatherEmoji(data.current.weathercode);
      const updatedCity = { ...newCity, temp, emoji, isLoading: false };
      setCities((prev) =>
        prev.map((c) => (c.id === newCity.id ? updatedCity : c))
      );
      onCitySelect(updatedCity);
    });
  }

  return (
    <aside className="flex flex-col w-full h-full min-h-full bg-white border-r border-gray-200 px-4 py-5 gap-4 overflow-hidden">

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

      <div className="flex-1 min-h-0 max-h-[calc(100vh-220px)] flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {cities.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-4">Loading...</p>
        )}
        {cities.map((city) => (
          <LocationCard
            key={city.id}
            city={city}
            isActive={activeId === city.id}
            onClick={() => handleSelect(city)}
            onRemove={() => handleRemoveCity(city.id)}
          />
        ))}
      </div>

    </aside>
  );
}
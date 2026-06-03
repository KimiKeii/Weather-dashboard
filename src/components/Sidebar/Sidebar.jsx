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
  const [batteryInfo, setBatteryInfo] = useState({ supported: true, level: null, charging: null });

  useEffect(() => {
    let batteryCleanup;

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

    async function initBattery() {
      if (navigator?.getBattery) {
        const battery = await navigator.getBattery();
        const update = () => {
          setBatteryInfo({
            supported: true,
            level: Math.round(battery.level * 100),
            charging: battery.charging,
          });
        };
        update();
        battery.addEventListener("levelchange", update);
        battery.addEventListener("chargingchange", update);
        batteryCleanup = () => {
          battery.removeEventListener("levelchange", update);
          battery.removeEventListener("chargingchange", update);
        };
      } else {
        setBatteryInfo({ supported: false, level: null, charging: null });
      }
    }

    loadTemps();
    initBattery();

    return () => {
      if (typeof batteryCleanup === "function") batteryCleanup();
    };
  }, []);

  function handleSelect(city) {
    setActiveId(city.id);
    onCitySelect(city);
  }

  function handleDelete(id) {
    if (cities.length === 1) return;
    setCities((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (id === activeId) {
        setActiveId(updated[0].id);
        onCitySelect(updated[0]);
      }
      return updated;
    });
  }

  function handleNewCity(city) {
    // Logic unchanged
    const newCity = { id: Date.now(), name: city.name, country: city.country, lat: city.lat, lon: city.lon, temp: "...", emoji: "🌍" };
    setCities((prev) => [...prev, newCity]);
    setActiveId(newCity.id);
    onCitySelect(newCity);
    getWeather(city.lat, city.lon).then((data) => {
      const temp = Math.round(data.current.temperature_2m);
      const emoji = getWeatherEmoji(data.current.weathercode);
      setCities((prev) => prev.map((c) => (c.id === newCity.id ? { ...c, temp, emoji } : c)));
    });
  }

  return (
    <aside className="flex flex-col h-full bg-white px-6 py-8">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-600/30">
          <img src="/src/assets/logo.svg" alt="Logo" className="w-7 h-7" />
        </div>
        <span className="text-2xl font-bold text-slate-800">
          Weatherly <span className="text-blue-600"></span>
        </span>
      </div>

      <div className="mb-6"><SearchBar onCitySelect={handleNewCity} /></div>

      <div className="flex flex-col gap-4 h-1/2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Saved locations</p>
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 pb-4">
          {cities.map((city) => (
            <LocationCard
              key={city.id}
              city={city}
              isActive={activeId === city.id}
              onClick={() => handleSelect(city)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Device status</h3>
        <p className="text-sm text-slate-600">
          {batteryInfo.supported
            ? `Battery level is ${batteryInfo.level ?? "--"}% and the device is currently ${batteryInfo.charging ? "charging" : "not charging"}.`
            : "Battery status is not available for this device."}
        </p>
      </div>

      <div className="text-xs text-slate-400 text-center mt-4">© 2024 Weatherly. All rights reserved.</div>
    </aside>
  );
}
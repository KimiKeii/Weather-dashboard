import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import LocationCard from "./LocationCard";
import { getWeather, getWeatherEmoji } from "../../API/weather";

const FALLBACK_CITIES = [
  { id: 1, name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { id: 2, name: "New York", country: "United States", lat: 40.7128, lon: -74.006 },
  { id: 3, name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708 },
  { id: 4, name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
];

async function enrichCity(city) {
  const data = await getWeather(city.lat, city.lon);
  return { ...city, temp: Math.round(data.current.temperature_2m), emoji: getWeatherEmoji(data.current.weathercode) };
}

async function reverseGeocode(lat, lon) {
  const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
  const d = await res.json();
  return {
    id: "device",
    name: d.city || d.locality || d.principalSubdivision || "My Location",
    country: (d.countryName || "Unknown").replace(/\s*\(.*?\)/g, "").trim(),
    lat, lon, temp: "...", emoji: "📍", isDevice: true,
  };
}

export default function Sidebar({ onCitySelect, onLocationStatusChange }) {
  const [activeId, setActiveId] = useState(null);
  const [cities, setCities] = useState([]);
  const [locationStatus, setLocationStatus] = useState("loading");
  const [batteryInfo, setBatteryInfo] = useState({ supported: true, level: null, charging: null });

  function updateLocationStatus(status) {
    setLocationStatus(status);
    onLocationStatusChange?.(status); // 👈 notify App
  }

  function setActive(city) {
    setActiveId(city.id);
    onCitySelect(city);
  }

  function upsertDeviceCity(enriched) {
    setCities((prev) => [enriched, ...prev.filter((c) => c.id !== "device")]);
    setActive(enriched);
  }

  useEffect(() => {
    // Load fallback cities
    Promise.all(FALLBACK_CITIES.map(enrichCity)).then((updated) => {
      setCities(updated);
      setLocationStatus((prev) => { if (prev === "denied") setActive(updated[0]); return prev; });
    });

    // Load device location
    if (!navigator?.geolocation) return updateLocationStatus("denied");
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lon } }) => {
        updateLocationStatus("granted");
        try {
          upsertDeviceCity(await enrichCity(await reverseGeocode(lat, lon)));
        } catch {
          upsertDeviceCity(await enrichCity({
            id: "device", name: "My Location", country: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
            lat, lon, temp: "...", emoji: "📍", isDevice: true,
          }));
        }
      },
      () => {
        updateLocationStatus("denied");
        setCities((prev) => { if (prev.length > 0) setActive(prev[0]); return prev; });
      },
      { timeout: 8000 }
    );

    // Battery
    if (!navigator?.getBattery) return setBatteryInfo({ supported: false, level: null, charging: null });
    let cleanup;
    navigator.getBattery().then((battery) => {
      const update = () => setBatteryInfo({ supported: true, level: Math.round(battery.level * 100), charging: battery.charging });
      update();
      battery.addEventListener("levelchange", update);
      battery.addEventListener("chargingchange", update);
      cleanup = () => { battery.removeEventListener("levelchange", update); battery.removeEventListener("chargingchange", update); };
    });
    return () => cleanup?.();
  }, []);

  function handleDelete(id) {
    if (cities.length === 1) return;
    setCities((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (id === activeId) setActive(updated[0]);
      return updated;
    });
  }

  function handleNewCity(city) {
    const exists = cities.find((c) => c.name.toLowerCase() === city.name.toLowerCase());
    if (exists) return setActive(exists);

    const newCity = { id: Date.now(), ...city, temp: "...", emoji: "🌍" };
    setCities((prev) => [...prev, newCity]);
    setActive(newCity);
    getWeather(city.lat, city.lon).then((data) =>
      setCities((prev) => prev.map((c) => c.id === newCity.id
        ? { ...c, temp: Math.round(data.current.temperature_2m), emoji: getWeatherEmoji(data.current.weathercode) }
        : c
      ))
    );
  }

  const activeCity = cities.find((c) => c.id === activeId);
  const otherCities = cities.filter((c) => c.id !== activeId);

  return (
    <aside className="flex flex-col h-full bg-white px-6 py-8">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-600/30">
          <img src="/src/assets/logo.svg" alt="Logo" className="w-7 h-7" />
        </div>
        <span className="text-2xl font-bold text-slate-800">Weatherly</span>
      </div>

      <div className="mb-6"><SearchBar onCitySelect={handleNewCity} /></div>

      {/* Current Location */}
      <div className="mb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Current Location</p>
        {locationStatus === "loading" && !activeCity ? (
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 flex items-center gap-3 animate-pulse">
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-sm font-semibold text-blue-700">Detecting location…</p>
              <p className="text-xs text-blue-400">Waiting for permission</p>
            </div>
          </div>
        ) : activeCity && (
          <div className="rounded-2xl bg-blue-600 text-white p-4 shadow-lg shadow-blue-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold leading-tight">{activeCity.name}</p>
                <p className="text-sm text-blue-200">{activeCity.country}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl">{activeCity.emoji}</span>
                <p className="text-xl font-bold mt-1">{activeCity.temp !== "..." ? `${activeCity.temp}°C` : "–"}</p>
              </div>
            </div>
          </div>
        )}
        {locationStatus === "denied" && activeCity && !activeCity.isDevice && (
          <p className="text-xs text-slate-400 mt-2">⚠️ Location access denied — showing saved cities instead.</p>
        )}
      </div>

      {/* Saved Locations */}
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saved locations</p>
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 pb-4">
          {otherCities.length === 0
            ? <p className="text-sm text-slate-400 italic">No other saved locations.</p>
            : otherCities.map((city) => (
                <LocationCard key={city.id} city={city} isActive={false} onClick={() => setActive(city)} onDelete={handleDelete} />
              ))}
        </div>
      </div>

      {/* Device Status */}
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
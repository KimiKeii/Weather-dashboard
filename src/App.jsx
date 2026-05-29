import { useState, useEffect } from "react";
import TopBar from "./components/Topbar/TopBar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
// Import your API utilities
import { getWeather, reverseGeocode, getWeatherEmoji, getWeatherLabel } from "./API/weather.js";

function App() {
  // UI State
  const [unit, setUnit] = useState("C");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data State
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Core API Logic ---
  
  const fetchWeather = async (lat, lon, name, country) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeather(lat, lon);
      setWeatherData(data);
      setSelectedCity({ name, country, lat, lon });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Load: Try Geolocation, fallback to London
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const geo = await reverseGeocode(latitude, longitude);
            fetchWeather(latitude, longitude, geo.name, geo.country);
          } catch {
            // Fallback if reverse geocode fails
            fetchWeather(51.5074, -0.1278, "London", "UK");
          }
        },
        () => {
          // Fallback if user denies location
          fetchWeather(51.5074, -0.1278, "London", "UK");
        }
      );
    } else {
      fetchWeather(51.5074, -0.1278, "London", "UK");
    }
  }, []);

  // --- Handlers ---

  async function handleRefresh() {
    if (!selectedCity) return;
    setIsRefreshing(true);
    await fetchWeather(selectedCity.lat, selectedCity.lon, selectedCity.name, selectedCity.country);
    setIsRefreshing(false);
  }

  const handleCitySelect = (city) => {
    // Expects city object from Sidebar: { lat, lon, name, country }
    if (sidebarOpen) setSidebarOpen(false);
    fetchWeather(city.lat, city.lon, city.name, city.country);
  };

  // Helper to convert Celsius to Fahrenheit on the fly based on 'unit' state
  const displayTemp = (celsiusTemp) => {
    if (unit === "F") return Math.round((celsiusTemp * 9) / 5 + 32);
    return Math.round(celsiusTemp);
  };

  return (
    <main className="min-h-screen bg-[#d8d8d8] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 xl:px-14">
      <section className="mx-auto flex w-full max-w-[1600px] min-h-[calc(100vh-48px)] flex-col overflow-hidden rounded-[34px] bg-[#f5f7fb] shadow-2xl lg:flex-row">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-[300px] lg:shrink-0">
          <Sidebar onCitySelect={handleCitySelect} />
        </div>

        {/* Mobile Sidebar overlay */}
        <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="absolute inset-0 bg-slate-950/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 h-screen w-[85%] max-w-sm bg-white p-6 shadow-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="mb-5 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600"
            >
              Close
            </button>
            <Sidebar onCitySelect={handleCitySelect} />
          </aside> {/* FIX: Resolved structural character break here */}
        </div>

        {/* Main Content Area */}
        <section className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <TopBar
            cityName={selectedCity?.name ?? "Loading..."}
            countryCode={selectedCity?.country ?? ""}
            date={new Date()}
            unit={unit}
            onUnitChange={setUnit}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="mx-auto max-w-5xl">
              
              {/* Status States */}
              {isLoading && (
                <div className="animate-pulse flex flex-col items-center justify-center py-20">
                  <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                  <p className="mt-4 font-semibold text-slate-400">Fetching the latest weather...</p>
                </div>
              )}
              
              {error && (
                <div className="rounded-[28px] bg-red-50 p-8 text-center text-red-600 shadow-sm">
                  <p className="font-bold">{error}</p>
                </div>
              )}

              {/* Dynamic Weather Dashboard */}
              {!isLoading && !error && weatherData && (
                <div className="space-y-6">
                  
                  {/* Current Weather Card */}
                  <div className="rounded-[28px] bg-white p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                        Current Conditions
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <span className="text-7xl">{getWeatherEmoji(weatherData.current.weathercode)}</span>
                        <div>
                          <h2 className="text-6xl font-black tracking-tight text-slate-950">
                            {displayTemp(weatherData.current.temperature_2m)}° <span className="text-3xl text-slate-400">{unit}</span>
                          </h2>
                          <p className="text-xl font-bold text-slate-600 mt-1">
                            {getWeatherLabel(weatherData.current.weathercode)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:min-w-[300px]">
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-sm font-semibold text-slate-400">Wind</p>
                        <p className="text-lg font-bold text-slate-800">{weatherData.current.windspeed_10m} km/h</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-sm font-semibold text-slate-400">Humidity</p>
                        <p className="text-lg font-bold text-slate-800">{weatherData.current.relativehumidity_2m}%</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-sm font-semibold text-slate-400">Visibility</p>
                        <p className="text-lg font-bold text-slate-800">{(weatherData.current.visibility / 1000).toFixed(1)} km</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-sm font-semibold text-slate-400">UV Index</p>
                        <p className="text-lg font-bold text-slate-800">{weatherData.current.uv_index}</p>
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Forecast */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">7-Day Forecast</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
                      {weatherData.daily.time.map((time, index) => (
                        <div key={time} className="flex flex-col items-center justify-center rounded-[24px] bg-white p-5 shadow-sm transition-transform hover:scale-105">
                          <p className="text-sm font-bold text-slate-400">
                            {new Date(time).toLocaleDateString(undefined, { weekday: 'short' })}
                          </p>
                          <p className="my-3 text-4xl">
                            {getWeatherEmoji(weatherData.daily.weathercode[index])}
                          </p>
                          <p className="text-sm font-bold text-slate-800">
                            {displayTemp(weatherData.daily.temperature_2m_max[index])}°
                            <span className="ml-2 font-medium text-slate-400">
                              {displayTemp(weatherData.daily.temperature_2m_min[index])}°
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
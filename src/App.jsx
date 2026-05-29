import { useState } from "react";
import TopBar from "./components/Topbar/TopBar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import CurrentWeather from "./components/CurrentWeather/CurrentWeather.jsx";
import TodayHighlight from "./components/TodayHighlight/TodayHighlight.jsx";
import Forecast from "./components/Forecast/ForecastCard.jsx";

// Import our custom data fetching hook
import { useWeather } from "./hooks/useWeather";

function App() {
  const [unit, setUnit] = useState("C");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // All the heavy data logic is handled by this one hook
  const { weatherData, isLoading, error, selectedCity, fetchWeather } = useWeather();

  async function handleRefresh() {
    if (!selectedCity) return;
    setIsRefreshing(true);
    await fetchWeather(selectedCity.lat, selectedCity.lon, selectedCity.name, selectedCity.country);
    setIsRefreshing(false);
  }

  const handleCitySelect = (city) => {
    if (sidebarOpen) setSidebarOpen(false);
    fetchWeather(city.lat, city.lon, city.name, city.country);
  };

  return (
    <main className="min-h-screen bg-[#d8d8d8] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 xl:px-14">
      <section className="mx-auto flex w-full max-w-[1600px] min-h-[calc(100vh-48px)] flex-col overflow-hidden rounded-[34px] bg-[#f5f7fb] shadow-2xl lg:flex-row">
        
        {/* Sidebar */}
        <div className="hidden lg:block lg:w-[300px] lg:shrink-0">
          <Sidebar onCitySelect={handleCitySelect} />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="absolute inset-0 bg-slate-950/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 h-screen w-[85%] max-w-sm bg-white p-6 shadow-2xl overflow-hidden">
            <button onClick={() => setSidebarOpen(false)} className="mb-5 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">Close</button>
            <Sidebar onCitySelect={handleCitySelect} />
          </aside> {/* FIX: Resolved structural character break here */}
        </div>

        {/* Main Content */}
        <section className="flex min-w-0 flex-1 flex-col">
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

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="mx-auto max-w-5xl rounded-[28px] bg-white p-8 shadow-sm">
              
              {/* Status Messages */}
              {isLoading && <div className="text-center font-semibold text-slate-400 py-20">Fetching the latest weather...</div>}
              {error && <div className="rounded-[16px] bg-red-50 p-6 text-center text-red-600 font-bold">{error}</div>}

              {/* Fully Modularized Weather UI */}
              {!isLoading && !error && weatherData && (
                <div className="flex flex-col gap-12">
                  
                  {/* Top Row: Current Weather & Highlights */}
                  <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
                    <CurrentWeather data={weatherData.current} unit={unit} />
                    <TodayHighlight data={weatherData.current} />
                  </div>

                  {/* Bottom Row: 7-Day Forecast */}
                  <Forecast data={weatherData.daily} unit={unit} />
                  
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
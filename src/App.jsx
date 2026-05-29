import { useState } from "react";
import TopBar from "./components/Topbar/TopBar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import CurrentWeather from "./components/CurrentWeather/CurrentWeather.jsx";
import TodayHighlight from "./components/TodayHighlight/TodayHighlight.jsx";
import ForecastCard from "./components/Forecast/ForecastCard.jsx";
import WeatherMap from "./components/WeatherMap/WeatherMap.jsx"; // Ensure path matches your setup

import { useWeather } from "./hooks/useWeather";

function App() {
  const [unit, setUnit] = useState("C");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
    <main className="min-h-screen bg-[#d8d8d8] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 xl:px-14 flex items-center justify-center">
      {/* Outer App Container matching the image's overall window */}
      <section className="mx-auto flex w-full max-w-[1400px] h-[90vh] min-h-[800px] flex-col overflow-hidden rounded-[40px] bg-[#f5f7fb] shadow-2xl lg:flex-row">
        
        {/* Sidebar */}
        <div className="hidden lg:block lg:w-[280px] lg:shrink-0 bg-white">
          <Sidebar onCitySelect={handleCitySelect} />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="absolute inset-0 bg-slate-950/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 h-screen w-[85%] max-w-sm bg-white p-6 shadow-2xl overflow-hidden">
            <button onClick={() => setSidebarOpen(false)} className="mb-5 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">Close</button>
            <Sidebar onCitySelect={handleCitySelect} />
          </aside>
        </div>

        {/* Main Content */}
        <section className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
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

          {/* Dashboard Area - Changed background to match inspiration */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#f5f7fb]">
            
            {isLoading && <div className="text-center font-semibold text-slate-400 py-20">Fetching the latest weather...</div>}
            {error && <div className="rounded-[16px] bg-red-50 p-6 text-center text-red-600 font-bold">{error}</div>}

            {!isLoading && !error && weatherData && (
              <div className="flex flex-col gap-6 mx-auto max-w-6xl h-full">
                
                {/* Top Row: Current Weather & Highlights */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Current Weather takes about 5 columns */}
                  <div className="lg:col-span-5 h-full">
                    <CurrentWeather data={weatherData.current} unit={unit} />
                  </div>
                  {/* Highlights take the remaining 7 columns */}
                  <div className="lg:col-span-7 h-full">
                    <TodayHighlight data={weatherData.current} />
                  </div>
                </div>

                {/* Bottom Row: 7-Day Forecast & Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[300px]">
                  <div className="lg:col-span-7 h-full">
                    <ForecastCard data={weatherData.daily} unit={unit} />
                  </div>
                  <div className="lg:col-span-5 h-full">
                    <WeatherMap location={selectedCity} />
                  </div>
                </div>
                
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
import { useState, useEffect } from "react";
import TopBar from "./components/Topbar/TopBar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import CurrentWeather from "./components/CurrentWeather/CurrentWeather.jsx";
import TodayHighlight from "./components/TodayHighlight/TodayHighlight.jsx";
import ForecastCard from "./components/Forecast/ForecastCard.jsx";
import DetailedOutlookModal from "./components/Forecast/DetailedOutlookModal.jsx";
import DeviceInfo from "./components/DeviceInfo/DeviceInfo.jsx";
import { useWeather } from "./hooks/useWeather";

const FALLBACK = { name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708  };

async function reverseGeocode(lat, lon) {
  const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
  const d = await res.json();
  return {
    name: d.city || d.locality || d.principalSubdivision || "My Location",
    country: (d.countryName || "Unknown").replace(/\s*\(.*?\)/g, "").trim(),
    lat, lon,
  };
}

function App() {
  const [unit, setUnit] = useState("C");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOutlook, setShowOutlook] = useState(false);
  const [locationStatus, setLocationStatus] = useState("loading");

  const { weatherData, isLoading, error, selectedCity, fetchWeather } = useWeather();

  useEffect(() => {
    setLocationStatus("granted");
    fetchWeather(FALLBACK.lat, FALLBACK.lon, FALLBACK.name, FALLBACK.country);
  }, [fetchWeather]); 

  async function handleRefresh() {
    if (!selectedCity) return;
    setIsRefreshing(true);
    await fetchWeather(selectedCity.lat, selectedCity.lon, selectedCity.name, selectedCity.country);
    setIsRefreshing(false);
  }

  return (
    <main className="min-h-screen bg-[#d8d8d8] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 xl:px-14 flex items-center justify-center">
      <section className="mx-auto flex w-full max-w-[1400px] h-[90vh] min-h-[800px] flex-col overflow-hidden rounded-[40px] bg-[#f5f7fb] shadow-2xl lg:flex-row">

        

        {/* Main Content */}
        <section className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
          <TopBar
            cityName={selectedCity?.name}
            countryCode={selectedCity?.country}
            isLocating={locationStatus === "loading"}
            date={new Date()}
            unit={unit}
            onUnitChange={setUnit}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          <div className="flex-1 overflow-y-auto p-6 pb-10 lg:p-8 lg:pb-10 bg-[#f5f7fb]">
            {isLoading && (
              <div className="text-center font-semibold text-slate-400 py-20">
                Fetching the latest weather...
              </div>
            )}
            {error && (
              <div className="rounded-[16px] bg-red-50 p-6 text-center text-red-600 font-bold">
                {error}
              </div>
            )}
            {!isLoading && !error && weatherData && (
              <>
                {showOutlook ? (
                  <DetailedOutlookModal
                    data={weatherData.hourly}
                    unit={unit}
                    cityName={selectedCity?.name}
                    country={selectedCity?.country}
                    onClose={() => setShowOutlook(false)}
                  />
                ) : (
                  <div className="flex flex-col gap-6 mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <CurrentWeather data={weatherData.current} unit={unit} />
                        <ForecastCard data={weatherData.daily} unit={unit} onOpenOutlook={() => setShowOutlook(true)} />
                      </div>
                      <div className="lg:col-span-5 flex flex-col gap-6">
                        <TodayHighlight data={weatherData.current} hourly={weatherData.hourly} />
                        <DeviceInfo cityName={selectedCity?.name} countryCode={selectedCity?.country} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
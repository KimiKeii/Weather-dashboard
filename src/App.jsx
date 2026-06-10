import { useState, useEffect } from "react";
import TopBar from "./components/Topbar/TopBar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import CurrentWeather from "./components/CurrentWeather/CurrentWeather.jsx";
import TodayHighlight from "./components/TodayHighlight/TodayHighlight.jsx";
import ForecastCard from "./components/Forecast/ForecastCard.jsx";
import DetailedOutlookModal from "./components/Forecast/DetailedOutlookModal.jsx";
import DeviceInfo from "./components/DeviceInfo/DeviceInfo.jsx";
import { useWeather } from "./hooks/useWeather";

const FALLBACK = { name: "Salamin Bldg", country: "", lat: 14.5547, lon: 121.0244 };

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

  // Panel Resizing States
  const [sidebarWidth, setSidebarWidth] = useState(280); // Default width in pixels
  const [isDragging, setIsDragging] = useState(false);

  const { weatherData, isLoading, error, selectedCity, fetchWeather } = useWeather();

  useEffect(() => {
    setLocationStatus("granted");
    fetchWeather(FALLBACK.lat, FALLBACK.lon, FALLBACK.name, FALLBACK.country);
  }, [fetchWeather]);

  // Handle Drag/Resize Engine
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      // Enforce min width (200px) and max width (500px) boundaries
      if (e.clientX > 200 && e.clientX < 500) {
        setSidebarWidth(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  async function handleRefresh() {
    if (!selectedCity) return;
    setIsRefreshing(true);
    await fetchWeather(selectedCity.lat, selectedCity.lon, selectedCity.name, selectedCity.country);
    setIsRefreshing(false);
  }

  return (
    /* 1. Outer Container: Locked to exactly 100% viewport width & height */
    <main className="h-screen w-screen bg-[#d8d8d8] text-slate-900 overflow-hidden flex items-center justify-center">
      
      {/* 2. Main App Panel: Modified to take full edge-to-edge space fluidly */}
      <section className="flex w-full h-full flex-row overflow-hidden bg-[#f5f7fb]">
        
        {/* 3. The Scalable Sidebar Panel Wrapper */}
        <div 
          style={{ width: `${sidebarWidth}px` }} 
          className="hidden lg:block h-full flex-shrink-0 overflow-y-auto bg-white border-r border-slate-200"
        >
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* 4. Draggable Split-Bar Resizer Handle */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          className={`hidden lg:block w-1.5 h-full cursor-col-resize flex-shrink-0 transition-colors duration-200 ${
            isDragging ? "bg-blue-500" : "bg-slate-200 hover:bg-blue-400"
          }`}
        />

        {/* Main Content Area */}
        <section className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
          <TopBar
            cityName={selectedCity?.name}
            countryCode={selectedCity?.country}
            isLocating={locationStatus === "loading"}
            unit={unit}
            onUnitChange={setUnit}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          {/* Added 'overflow-y-auto' below so only the data view scrolls, keeping headers fixed */}
          <div className="flex-1 p-6 pb-10 lg:p-8 lg:pb-10 bg-[#f5f7fb] overflow-y-auto">
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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <CurrentWeather data={weatherData.current} unit={unit} />
                        <ForecastCard data={weatherData.daily} unit={unit} onOpenOutlook={() => setShowOutlook(true)} />
                      </div>
                      <div className="lg:col-span-5 lg:row-span-5 flex flex-col gap-6">
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
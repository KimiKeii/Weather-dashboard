import { useState } from "react";
import TopBar from "./components/Topbar/TopBar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TodayHighlight from "./components/TodayHighlight/TodayHighlight.jsx"; 
import ForecastCard from "./components/Forecast/ForecastCard.jsx";
import { Wind, Droplets, Eye } from "lucide-react";

function App() {
  const [unit, setUnit] = useState("C");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#d8d8d8] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 xl:px-14">
      <section className="mx-auto flex w-full max-w-[1600px] min-h-[calc(100vh-48px)] flex-col overflow-hidden rounded-[34px] bg-[#f5f7fb] shadow-2xl lg:flex-row">
        
        {/* Desktop Sidebar Area */}
        <div className="hidden lg:block lg:w-[300px] lg:shrink-0">
          <Sidebar onCitySelect={handleCitySelect} />
        </div>

        {/* Mobile Flyout Drawer Menu */}
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

        {/* Central Workspace Canvas */}
        <section className="flex min-w-0 flex-1 flex-col">
          <TopBar
            cityName={selectedCity?.name ?? "London"}
            countryCode={selectedCity?.country ?? "UK"}
            date={new Date()}
            unit={unit}
            onUnitChange={setUnit}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          {/* Main Layout Grid Section */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 xl:grid-cols-2">
              
              {/* ROW 1, COL 1: Current Weather Card Component */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white p-8 shadow-sm sm:p-10">
                <div className="z-10">
                  <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold tracking-widest text-blue-600">
                    CURRENT WEATHER
                  </span>
                  
                  <div className="mt-8 flex items-start">
                    <h1 className="text-7xl font-black tracking-tighter text-slate-950 sm:text-8xl">
                      18°
                    </h1>
                    <span className="ml-2 mt-2 text-3xl font-bold text-slate-400 sm:text-4xl">
                      {unit}
                    </span>
                  </div>

                  <p className="mt-3 text-xl font-bold text-slate-700 sm:text-2xl">
                    Mostly Sunny
                  </p>
                </div>

                {/* Card Sub-Metrics Footer block */}
                <div className="z-10 mt-12 flex flex-wrap gap-6 border-t border-slate-100 pt-6 text-sm font-semibold text-slate-500">
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-blue-400" /> 12 km/h
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-400" /> 45%
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-400" /> 10 km
                  </div>
                </div>

                {/* Decorative absolute sun element container */}
                <div className="absolute -right-4 top-6 h-44 w-44 opacity-80 sm:opacity-100">
                  <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-amber-400 shadow-xl shadow-amber-300/40" />
                  <div className="absolute bottom-4 right-10 h-20 w-32 rounded-full border border-slate-50/50 bg-white/90 backdrop-blur-sm shadow-md" />
                </div>
              </div>

              {/* ROW 1, COL 2: Today's Scalable Highlights Component */}
              <div>
                <TodayHighlights />
              </div>

              {/* ROW 2, COL 1: Refactored 7-Day Forecast Wrapper Card */}
              <div>
                <ForecastCard />
              </div>

              {/* ROW 2, COL 2: Unified Weather Map Container */}
              <div className="flex flex-col h-full">
                 <h3 className="mb-6 text-xl font-bold text-slate-800">Weather Map</h3>
                 <div className="flex-1 rounded-[32px] bg-[#48b5c9] opacity-90 shadow-sm min-h-[250px] flex items-center justify-center text-white font-bold tracking-widest">
                    [ MAP COMPONENT ]
                 </div>
              </div>

            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
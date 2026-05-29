import { useState } from "react";
import TopBar from "./components/Topbar/TopBar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
// FIX: Imported the new scalable highlights component here
import TodayHighlights from "./components/TodayHighlight/TodayHighlight.jsx"; 
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
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-[300px] lg:shrink-0">
          <Sidebar onCitySelect={handleCitySelect} />
        </div>

        {/* Mobile Sidebar Flyout */}
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
          </aside>
        </div>

        {/* Main Workspace Content Area */}
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

          {/* FIX: Set container to allow scrolling naturally for high density rows */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10">
            
            {/* FIX: Created the split columns layout framework (Left = Weather Card, Right = Highlights) */}
            <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 xl:grid-cols-2">
              
              {/* Current Weather Card (Left Column) */}
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

                {/* Sub-Metrics section within Current Weather Card */}
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

                {/* Decorative Sun/Cloud graphic placement container matching mockup layout */}
                <div className="absolute -right-4 top-6 h-44 w-44 opacity-80 sm:opacity-100">
                  <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-amber-400 shadow-xl shadow-amber-300/40" />
                  <div className="absolute bottom-4 right-10 h-20 w-32 rounded-full border border-slate-50/50 bg-white/90 backdrop-blur-sm shadow-md" />
                </div>
              </div>

              {/* Today's Highlights Component (Right Column) */}
              {/* It maps over metrics dynamically, making additions instantly scalable */}
              <div>
                <TodayHighlights />
              </div>

            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
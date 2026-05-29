import { useState } from "react";
import TopBar from "./components/Topbar/TopBar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";

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
        <div className="hidden lg:block lg:w-[300px] lg:shrink-0">
          <Sidebar onCitySelect={handleCitySelect} />
        </div>

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

          <div className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-8 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Top Bar Test Area
              </p>

              <h2 className="mt-5 text-6xl font-black tracking-tight text-slate-950">
                18° <span className="text-2xl text-slate-400">{unit}</span>
              </h2>

              <p className="mt-3 text-xl font-bold text-slate-600">
                Mostly Sunny
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                If you can see this card with spacing, rounded corners, blue
                buttons, and a proper top bar, Tailwind is now working.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
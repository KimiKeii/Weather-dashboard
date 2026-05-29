import { useState } from "react";
import TopBar from "./components/Topbar/TopBar.jsx";

function App() {
  const [unit, setUnit] = useState("C");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleRefresh() {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  }

  return (
    <main className="min-h-screen bg-[#d8d8d8] px-4 py-6 text-slate-900 md:px-8 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[1500px] overflow-hidden rounded-[34px] bg-[#f5f7fb] shadow-2xl">
        <aside className="hidden w-[280px] shrink-0 border-r border-slate-100 bg-white p-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xl text-white">
              ☁
            </div>

            <h2 className="text-lg font-bold tracking-tight">
              WeatherScope <span className="text-blue-600">Pro</span>
            </h2>
          </div>

          <p className="mt-8 text-sm leading-6 text-slate-400">
            Sidebar placeholder only. The repository owner will replace this
            section.
          </p>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden">
            <aside className="h-full w-[300px] bg-white p-6 shadow-2xl">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="mb-5 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600"
              >
                Close
              </button>

              <p className="text-sm text-slate-500">
                Mobile sidebar placeholder.
              </p>
            </aside>
          </div>
        )}

        <section className="flex min-w-0 flex-1 flex-col">
          <TopBar
            cityName="London"
            countryCode="UK"
            date={new Date()}
            unit={unit}
            onUnitChange={setUnit}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          <div className="flex-1 p-6 md:p-8 lg:p-10">
            <div className="max-w-xl rounded-[28px] bg-white p-8 shadow-sm">
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
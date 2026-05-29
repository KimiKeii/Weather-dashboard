import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";

export default function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 p-6">
        <aside className="hidden md:block w-[300px] shrink-0 rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <Sidebar onCitySelect={setSelectedCity} />
        </aside>

        <main className="flex-1 overflow-auto rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-3xl">
            <div className="mb-6 rounded-[28px] bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                WeatherScope Dashboard
              </p>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">Weather at a glance</h1>
              <p className="mt-2 text-sm text-slate-500">
                Select a saved location from the sidebar or search a new city to keep it in the list.
              </p>
            </div>

            {selectedCity ? (
              <div className="rounded-[28px] bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900">{selectedCity.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{selectedCity.country}</p>
              </div>
            ) : (
              <div className="rounded-[28px] bg-white p-8 shadow-sm">
                <p className="text-sm text-slate-500">Select a city to view details here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

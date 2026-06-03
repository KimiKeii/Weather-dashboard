import { useEffect, useState } from "react";
import { reverseGeocode } from "../../API/weather";

function MenuIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function RefreshIcon({ spinning }) { return <svg className={spinning ? "animate-spin" : ""} width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 11A8.1 8.1 0 0 0 4.5 8.5M4 5V9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 13A8.1 8.1 0 0 0 19.5 15.5M20 19V15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }

function formatTopBarDate(date) {
  const parsedDate = date ? new Date(date) : new Date();
  return parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TopBar({
  cityName = "London",
  countryCode = "UK",
  date = new Date(),
  unit = "C",
  onUnitChange,
  onRefresh,
  isRefreshing = false,
  onOpenSidebar,
}) {
  const [deviceLocation, setDeviceLocation] = useState({ city: "", street: "", status: "Locating device..." });
  const formattedDate = formatTopBarDate(date);

  useEffect(() => {
    let mounted = true;

    if (!navigator?.geolocation) {
      setDeviceLocation({ city: "", street: "", status: "Location unavailable" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const address = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          if (!mounted) return;
          const city = address.city || address.name || "Unknown city";
          const street = address.road || address.neighbourhood || address.suburb || "";
          const status = city ? `${city}${street ? ` · ${street}` : ""}` : "Location unavailable";
          setDeviceLocation({ city, street, status });
        } catch {
          if (!mounted) return;
          setDeviceLocation({ city: "", street: "", status: "Location unavailable" });
        }
      },
      () => {
        if (!mounted) return;
        setDeviceLocation({ city: "", street: "", status: "Location unavailable" });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="flex w-full items-center justify-between bg-white px-6 lg:px-8 py-4">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-600 lg:hidden"
        >
          <MenuIcon />
        </button>

        <div className="min-w-0 flex flex-col">
          <p className="truncate text-2xl font-bold tracking-tight text-slate-900 leading-none ">
            {cityName}, {countryCode}
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-2 leading-none">
            {formattedDate}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-600 break-words whitespace-normal max-w-[360px]">
          <span className="font-semibold text-slate-700">Device location:</span> {deviceLocation.status}
        </div>
        <div className="flex rounded-xl bg-white shadow-sm p-1">
          <button
            type="button"
            onClick={() => onUnitChange("C")}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
              unit === "C" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            °C
          </button>
          <button
            type="button"
            onClick={() => onUnitChange("F")}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
              unit === "F" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            °F
          </button>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-70"
        >
          <RefreshIcon spinning={isRefreshing} />
        </button>
      </div>
    </header>
  );
}

export default TopBar;
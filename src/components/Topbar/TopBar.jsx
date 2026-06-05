import { useEffect, useState } from "react";
import { reverseGeocode } from "../../API/weather";

function MenuIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function RefreshIcon({ spinning }) { return <svg className={spinning ? "animate-spin" : ""} width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 11A8.1 8.1 0 0 0 4.5 8.5M4 5V9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 13A8.1 8.1 0 0 0 19.5 15.5M20 19V15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }

// hardcoded fallback location (Makati City, Philippines) in case geolocation fails or is denied
const BUILDING_ADDRESS = "Unit 6A, Salamin Building, 197 Salcedo, Legaspi Village, Makati City, 1229 Metro Manila";

function formatTopBarAddress(address) {
  return address || BUILDING_ADDRESS;
}

function TopBar({ cityName = "", countryCode = "", unit = "C", onUnitChange, onRefresh, isRefreshing = false, onOpenSidebar, isLocating = false }) {
  const [deviceLocation, setDeviceLocation] = useState({ status: "Locating device..." });

  useEffect(() => {
    if (!navigator?.geolocation) return setDeviceLocation({ status: "Location unavailable" });
    let mounted = true;

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const address = await reverseGeocode(latitude, longitude);
          if (!mounted) return;
          const city = address.city || address.name || "Unknown city";
          const street = address.road || address.neighbourhood || address.suburb || "";
          setDeviceLocation({ status: city ? `${city}${street ? ` · ${street}` : ""}` : "Location unavailable" });
        } catch {
          if (mounted) setDeviceLocation({ status: "Location unavailable" });
        }
      },
      () => { if (mounted) setDeviceLocation({ status: "Location unavailable" }); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );

    return () => { mounted = false; };
  }, []);

  return (
    <header className="flex w-full items-center justify-between bg-white px-6 lg:px-8 py-4">
      <div className="flex min-w-0 items-center gap-4">
        <button type="button" onClick={onOpenSidebar} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-600 lg:hidden">
          <MenuIcon />
        </button>

        <div className="min-w-0 flex flex-col">
          {isLocating ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-48 rounded-lg bg-slate-200 animate-pulse" />
                <div className="h-5 w-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
              </div>
              <p className="text-sm font-semibold text-slate-400 mt-1 leading-none animate-pulse">
                Detecting your location…
              </p>
            </div>
          ) : (
            <>
              <p className="truncate text-2xl font-bold tracking-tight text-slate-900 leading-none">
                {cityName}{countryCode ? `, ${countryCode}` : ""}
              </p>
              <p className="text-sm font-semibold text-slate-700 mt-2 leading-none">
                {formatTopBarAddress("")}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-600 break-words whitespace-normal max-w-[360px]">
          <span className="font-semibold text-slate-700">Device location:</span> {deviceLocation.status}
        </div>

        <div className="flex rounded-xl bg-white shadow-sm p-1">
          <button type="button" onClick={() => onUnitChange("C")} className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${unit === "C" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>°C</button>
          <button type="button" onClick={() => onUnitChange("F")} className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${unit === "F" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>°F</button>
        </div>

        <button type="button" onClick={onRefresh} disabled={isRefreshing} className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-70">
          <RefreshIcon spinning={isRefreshing} />
        </button>
      </div>
    </header>
  );
}

export default TopBar;
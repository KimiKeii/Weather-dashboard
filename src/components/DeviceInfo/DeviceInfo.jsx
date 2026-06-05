import { useEffect, useState } from "react";
import { reverseGeocode } from "../../API/weather";

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" fill="currentColor"/>
    </svg>
  );
}

function BatteryIcon({ level = 0, charging = false }) {
  const fillPercent = Math.max(0, Math.min(1, level)) * 100;
  const fillColor = charging
    ? "#22c55e"
    : fillPercent > 70
      ? "#22c55e"
      : fillPercent > 30
        ? "#f59e0b"
        : "#ef4444";
  const innerWidth = Math.max(2, Math.round((fillPercent / 100) * 24));

  return (
    <svg width="34" height="18" viewBox="0 0 34 18" className="flex-shrink-0">
      <rect x="1" y="2" width="26" height="14" rx="6" ry="6" fill="none" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="28" y="5" width="4" height="8" rx="2" ry="2" fill="#cbd5e1" />
      <rect x="3" y="4" width={innerWidth} height="10" rx="4" ry="4" fill={fillColor} />
      {charging && (
        <path d="M13 5.5L10.5 10H14L12.5 12.5L15.5 8.5H12.5L13 5.5Z" fill="white" />
      )}
    </svg>
  );
}

export default function DeviceInfo({ cityName, countryCode }) {
  const [deviceLocation, setDeviceLocation] = useState({ status: "Locating device..." });
  const [coordinates, setCoordinates] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [batterySupported, setBatterySupported] = useState(true);

  useEffect(() => {
    if (!navigator?.geolocation) return setDeviceLocation({ status: "Location unavailable" });
    let mounted = true;

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          setCoordinates({ lat: latitude.toFixed(4), lon: longitude.toFixed(4) });
          const address = await reverseGeocode(latitude, longitude);
          if (!mounted) return;
          const city = address.city || address.name || "Unknown city";
          const street = address.road || address.neighbourhood || address.suburb || "";
          setDeviceLocation({ 
            status: city ? `${city}${street ? ` · ${street}` : ""}` : "Location unavailable" 
          });
        } catch {
          if (mounted) setDeviceLocation({ status: "Location unavailable" });
        }
      },
      () => { if (mounted) setDeviceLocation({ status: "Location unavailable" }); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!navigator?.getBattery) {
      setBatterySupported(false);
      return;
    }

    let mounted = true;
    let batteryObj = null;
    let syncBattery = () => {};

    navigator.getBattery().then((battery) => {
      if (!mounted) return;
      batteryObj = battery;
      syncBattery = () => {
        if (!mounted) return;
        setBatteryLevel(battery.level);
        setIsCharging(battery.charging);
      };

      syncBattery();
      battery.addEventListener("levelchange", syncBattery);
      battery.addEventListener("chargingchange", syncBattery);
    }).catch(() => {
      if (mounted) setBatterySupported(false);
    });

    return () => {
      mounted = false;
      if (batteryObj) {
        batteryObj.removeEventListener("levelchange", syncBattery);
        batteryObj.removeEventListener("chargingchange", syncBattery);
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-[16px] p-6 shadow-md">
      <div className="space-y-4">
        {/* Device Location */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex-shrink-0 text-blue-500 mt-0.5">
              <LocationIcon />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Device Location</p>
              <p className="text-sm font-semibold text-slate-700 mt-1 truncate">
                {deviceLocation.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2">
            <BatteryIcon level={batteryLevel ?? 0} charging={isCharging} />
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Battery</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {batterySupported
                  ? batteryLevel !== null
                    ? `${Math.round((batteryLevel ?? 0) * 100)}%`
                    : "Loading..."
                  : "Unavailable"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

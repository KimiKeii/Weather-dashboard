import { useEffect, useState } from "react";
import { reverseGeocode } from "../../API/weather";

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" fill="currentColor"/>
    </svg>
  );
}

export default function DeviceInfo({ cityName, countryCode }) {
  const [deviceLocation, setDeviceLocation] = useState({ status: "Locating device..." });
  const [coordinates, setCoordinates] = useState(null);

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

  return (
    <div className="bg-white rounded-[16px] p-6 shadow-md">
      <div className="space-y-4">
        {/* Device Location */}
        <div className="flex items-start gap-3">
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

        {/* Coordinates */}
        {coordinates && (
          <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
            <div className="flex-shrink-0 text-slate-400 mt-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coordinates</p>
              <p className="text-sm font-mono text-slate-600 mt-1">
                {coordinates.lat}° N, {coordinates.lon}° E
              </p>
            </div>
          </div>
        )}

        {/* Selected Location */}
        {cityName && (
          <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
            <div className="flex-shrink-0 text-slate-400 mt-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selected Location</p>
              <p className="text-sm font-semibold text-slate-700 mt-1 truncate">
                {cityName}{countryCode ? ` · ${countryCode}` : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

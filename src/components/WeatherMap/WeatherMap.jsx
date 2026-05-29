import { useEffect, useState } from "react";
import { WEATHER_URL } from "../../api/weather";

function getTileCoordinates(lat, lon, zoom) {
  const latRad = (lat * Math.PI) / 180;
  const n = 2 ** zoom;
  const x = Math.floor(((lon + 180) / 360) * n);
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { x, y };
}

export default function WeatherMap({ location }) {
  const [precipitation, setPrecipitation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    if (!location) { setMapUrl(""); return; }
    const { x, y } = getTileCoordinates(location.lat, location.lon, 6);
    setMapUrl(`https://tile.openstreetmap.org/6/${x}/${y}.png`);
  }, [location]);

  useEffect(() => {
    if (!location) { setPrecipitation(null); return; }
    setLoading(true);
    const params = new URLSearchParams({
      latitude: location.lat,
      longitude: location.lon,
      hourly: "precipitation",
      forecast_days: "1",
      timezone: "auto",
    });
    fetch(`${WEATHER_URL}/forecast?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const values = data.hourly?.precipitation ?? [];
        const nextHours = values.slice(0, 8);
        const max = nextHours.length ? Math.max(...nextHours) : 0;
        setPrecipitation({ values: nextHours, max });
      })
      .catch(() => setPrecipitation(null))
      .finally(() => setLoading(false));
  }, [location]);

  const label = loading
    ? "Loading map..."
    : precipitation
    ? `Precipitation up to ${precipitation.max.toFixed(1)} mm`
    : "No precipitation data";

  return (
    <div className="relative flex h-full flex-col rounded-[32px] bg-[#48b5c9] p-5 shadow-sm">
      <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm">
        <span className="inline-flex h-2 w-2 rounded-full bg-red-500" />
        Live Forecast
      </div>

      <div className="mt-14 flex-1 overflow-hidden rounded-[28px] border border-white/20 shadow-inner p-2">
        <div className="relative h-full w-full overflow-hidden rounded-[20px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: mapUrl
                ? `url(${mapUrl})`
                : "linear-gradient(135deg, #3182ce 0%, #1c7ed6 100%)",
            }}
          />

          <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sky-200/90 shadow-lg" />

          {precipitation?.values.map((value, idx) => {
            const radius = 40 + value * 18 + idx * 10;
            const opacity = Math.min(0.45, 0.16 + value * 0.08);
            return (
              <div
                key={idx}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/40"
                style={{ width: `${radius}px`, height: `${radius}px`, opacity }}
              />
            );
          })}

          {/* <div className="absolute left-5 bottom-5 right-5 rounded-[24px] border border-white/30 bg-white/90 p-4 text-sm text-slate-800 shadow-lg">
            <div className="font-semibold">{location?.name ?? "Map center"}</div>
            <div className="mt-1 text-xs text-slate-500">{label}</div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
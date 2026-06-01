import { useMemo } from "react";

function calcHeatIndex(tempC, rh) {
  if (tempC == null || rh == null) return null;
  const T = tempC * 9 / 5 + 32;
  if (T < 80) return +tempC.toFixed(1);
  const HI =
    -42.379 + 2.04901523 * T + 10.14333127 * rh
    - 0.22475541 * T * rh - 0.00683783 * T * T
    - 0.05481717 * rh * rh + 0.00122874 * T * T * rh
    + 0.00085282 * T * rh * rh - 0.00000199 * T * T * rh * rh;
  return +((HI - 32) * 5 / 9).toFixed(1);
}

export function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export function fmtTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-PH", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export function heatLabel(hi) {
  if (hi == null) return null;
  if (hi >= 54) return { text: "Extreme Danger", color: "#dc2626", bg: "#fee2e2" };
  if (hi >= 41) return { text: "Danger",          color: "#ea580c", bg: "#ffedd5" };
  if (hi >= 32) return { text: "Caution",          color: "#ca8a04", bg: "#fef9c3" };
  if (hi >= 27) return { text: "Take Care",        color: "#2563eb", bg: "#dbeafe" };
  return               { text: "Safe",             color: "#16a34a", bg: "#dcfce7" };
}

export const METRICS = [
  { key: "temperature_2m",       label: "Air Temperature", unit: "°C",   color: "#f97316", icon: "🌡️" },
  { key: "relative_humidity_2m", label: "Humidity",        unit: "%",    color: "#3b82f6", icon: "💧" },
  { key: "surface_pressure",     label: "Air Pressure",    unit: "hPa",  color: "#8b5cf6", icon: "🔵" },
  { key: "precipitation",        label: "Rain Gauge",      unit: "mm",   color: "#06b6d4", icon: "🌧️" },
  { key: "wind_speed_10m",       label: "Wind Speed",      unit: "km/h", color: "#10b981", icon: "💨" },
  { key: "heat_index",           label: "Heat Index",      unit: "°C",   color: "#ef4444", icon: "🔥" },
];

export function useOutlookData(data) {
  const rows = useMemo(() => {
    if (!data?.time) return [];
    return data.time.map((t, i) => {
      const temp = data.temperature_2m?.[i] ?? null;
      const rh   = data.relative_humidity_2m?.[i] ?? null;
      return {
        time:                 t,
        temperature_2m:       temp,
        relative_humidity_2m: rh,
        surface_pressure:     data.surface_pressure?.[i] ?? null,
        precipitation:        data.precipitation?.[i] ?? null,
        wind_speed_10m:       data.wind_speed_10m?.[i] ?? null,
        heat_index:           calcHeatIndex(temp, rh),
      };
    });
  }, [data]);

  const tableRows = useMemo(() => [...rows].reverse(), [rows]);
  const chartData = useMemo(() => rows.map(r => ({ ...r, time: fmtTime(r.time) })), [rows]);
  const latest    = rows[rows.length - 1] ?? {};

  return { rows, tableRows, chartData, latest };
}
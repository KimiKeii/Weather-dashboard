import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ── Heat Index (NOAA Rothfusz) ───────────────────────────────────────────────
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

function heatLabel(hi) {
  if (hi == null) return null;
  if (hi >= 54) return { text: "Extreme Danger", color: "#dc2626", bg: "#fee2e2" };
  if (hi >= 41) return { text: "Danger",          color: "#ea580c", bg: "#ffedd5" };
  if (hi >= 32) return { text: "Caution",          color: "#ca8a04", bg: "#fef9c3" };
  if (hi >= 27) return { text: "Take Care",        color: "#2563eb", bg: "#dbeafe" };
  return               { text: "Safe",             color: "#16a34a", bg: "#dcfce7" };
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}
function fmtTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-PH", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

const METRICS = [
  { key: "temperature_2m",       label: "Air Temperature", unit: "°C",   color: "#f97316", icon: "🌡️" },
  { key: "relative_humidity_2m", label: "Humidity",        unit: "%",    color: "#3b82f6", icon: "💧" },
  { key: "surface_pressure",     label: "Air Pressure",    unit: "hPa",  color: "#8b5cf6", icon: "🔵" },
  { key: "precipitation",        label: "Rain Gauge",      unit: "mm",   color: "#06b6d4", icon: "🌧️" },
  { key: "wind_speed_10m",       label: "Wind Speed",      unit: "km/h", color: "#10b981", icon: "💨" },
  { key: "heat_index",           label: "Heat Index",      unit: "°C",   color: "#ef4444", icon: "🔥" },
];

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
      padding: "8px 12px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,.08)",
    }}>
      <div style={{ color: "#94a3b8", marginBottom: 3, fontSize: 11 }}>{label}</div>
      <div style={{ fontWeight: 700, color: "#0f172a" }}>
        {payload[0].value} <span style={{ color: "#94a3b8", fontWeight: 400 }}>{unit}</span>
      </div>
    </div>
  );
}

function MetricCard({ metric, chartData, latestValue }) {
  const hi = metric.key === "heat_index" ? heatLabel(latestValue) : null;
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "16px 18px",
      border: "1px solid #e8edf3",
      boxShadow: "0 2px 12px rgba(15,23,42,.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 15 }}>{metric.icon}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: ".04em", textTransform: "uppercase" }}>
            {metric.label}
          </span>
        </div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: metric.color,
          background: metric.color + "15", borderRadius: 20,
          padding: "3px 11px", border: `1.5px solid ${metric.color}30`,
        }}>
          {latestValue ?? "—"} {metric.unit}
        </div>
      </div>
      {hi && (
        <div style={{
          display: "inline-block", fontSize: 10, fontWeight: 700,
          color: hi.color, background: hi.bg,
          borderRadius: 20, padding: "2px 9px", marginBottom: 8,
        }}>
          {hi.text}
        </div>
      )}
      <ResponsiveContainer width="100%" height={110}>
        <LineChart data={chartData} margin={{ top: 2, right: 4, left: -28, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#94a3b8" }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 8, fill: "#94a3b8" }} />
          <Tooltip content={<ChartTooltip unit={metric.unit} />} />
          <Line
            type="monotone" dataKey={metric.key}
            stroke={metric.color} strokeWidth={2}
            dot={false} activeDot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DetailedOutlookModal({ data, unit, cityName, country, onClose }) {
  const [tab, setTab] = useState("table");

  // Build rows from Open-Meteo hourly shape
  const rows = useMemo(() => {
    if (!data?.time) return [];
    return data.time.map((t, i) => {
      const temp = data.temperature_2m?.[i] ?? null;
      const rh   = data.relative_humidity_2m?.[i] ?? null;
      return {
        time:                  t,
        temperature_2m:        temp,
        relative_humidity_2m:  rh,
        surface_pressure:      data.surface_pressure?.[i] ?? null,
        precipitation:         data.precipitation?.[i] ?? null,
        wind_speed_10m:        data.wind_speed_10m?.[i] ?? null,
        heat_index:            calcHeatIndex(temp, rh),
      };
    });
  }, [data]);

  const tableRows = useMemo(() => [...rows].reverse(), [rows]);
  const chartData = useMemo(() => rows.map(r => ({ ...r, time: fmtTime(r.time) })), [rows]);
  const latest    = rows[rows.length - 1] ?? {};

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#f1f5f9", border: "1px solid #e2e8f0",
                borderRadius: 10, padding: "6px 14px", cursor: "pointer",
                fontSize: 13, fontWeight: 600, color: "#475569",
                fontFamily: "inherit",
              }}
            >
              ← Back
            </button>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-.4px" }}>
                Detailed Outlook
              </h2>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                {cityName}{country ? `, ${country}` : ""} · Hourly forecast · {rows.length} records
              </p>
            </div>
          </div>
        </div>

        {/* Stat pills */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Temp", value: `${latest.temperature_2m ?? "—"}°C`, color: "#f97316" },
            { label: "Humidity", value: `${latest.relative_humidity_2m ?? "—"}%`, color: "#3b82f6" },
            { label: "Wind", value: `${latest.wind_speed_10m ?? "—"} km/h`, color: "#10b981" },
          ].map(p => (
            <div key={p.label} style={{
              background: "#fff", border: "1px solid #e8edf3",
              borderRadius: 12, padding: "6px 14px", textAlign: "center",
              boxShadow: "0 2px 8px rgba(15,23,42,.05)",
            }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>{p.label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: p.color }}>{p.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: "flex", gap: 4, borderBottom: "2px solid #f1f5f9",
        marginBottom: 20,
      }}>
        {[
          { id: "table",  label: "📋 Tabulated Data" },
          { id: "charts", label: "📈 Graphical View" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 20px", border: "none", background: "none",
              cursor: "pointer", fontSize: 13, fontWeight: 700,
              color: tab === t.id ? "#2563eb" : "#94a3b8",
              borderBottom: `2.5px solid ${tab === t.id ? "#2563eb" : "transparent"}`,
              marginBottom: -2, transition: "color .15s, border-color .15s",
              fontFamily: "inherit",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>

        {/* TABLE */}
        {tab === "table" && (
          <div style={{ borderRadius: 16, border: "1px solid #e8edf3", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Date & Time", "Air Temp (°C)", "Humidity (%)", "Pressure (hPa)", "Rain (mm)", "Wind (km/h)", "Heat Index"].map(h => (
                      <th key={h} style={{
                        padding: "10px 14px", textAlign: "left",
                        fontSize: 10, fontWeight: 700, letterSpacing: ".07em",
                        textTransform: "uppercase", color: "#94a3b8",
                        borderBottom: "1px solid #e8edf3", whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: "center", padding: 48, color: "#cbd5e1", fontStyle: "italic" }}>No data available</td></tr>
                  ) : tableRows.map((r, i) => {
                    const hi    = r.heat_index;
                    const hiLbl = heatLabel(hi);
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #f8fafc", transition: "background .1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8fbff"}
                        onMouseLeave={e => e.currentTarget.style.background = ""}
                      >
                        <td style={{ padding: "9px 14px", color: "#64748b", fontSize: 11, whiteSpace: "nowrap" }}>{fmtDate(r.time)}</td>
                        <td style={{ padding: "9px 14px", fontFamily: "'DM Mono', monospace", fontWeight: 500, color: "#0f172a", whiteSpace: "nowrap" }}>{r.temperature_2m ?? "—"}</td>
                        <td style={{ padding: "9px 14px", fontFamily: "'DM Mono', monospace", fontWeight: 500, color: "#0f172a", whiteSpace: "nowrap" }}>{r.relative_humidity_2m ?? "—"}</td>
                        <td style={{ padding: "9px 14px", fontFamily: "'DM Mono', monospace", fontWeight: 500, color: "#0f172a", whiteSpace: "nowrap" }}>{r.surface_pressure ?? "—"}</td>
                        <td style={{ padding: "9px 14px", fontFamily: "'DM Mono', monospace", fontWeight: 500, color: "#0f172a", whiteSpace: "nowrap" }}>{r.precipitation ?? "—"}</td>
                        <td style={{ padding: "9px 14px", fontFamily: "'DM Mono', monospace", fontWeight: 500, color: "#0f172a", whiteSpace: "nowrap" }}>{r.wind_speed_10m ?? "—"}</td>
                        <td style={{ padding: "9px 14px", whiteSpace: "nowrap" }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, color: "#0f172a" }}>{hi ?? "—"}</span>
                          {hiLbl && (
                            <span style={{
                              marginLeft: 7, fontSize: 10, fontWeight: 700,
                              color: hiLbl.color, background: hiLbl.bg,
                              borderRadius: 20, padding: "2px 8px",
                            }}>{hiLbl.text}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CHARTS */}
        {tab === "charts" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: 14,
          }}>
            {METRICS.map(m => (
              <MetricCard
                key={m.key}
                metric={m}
                chartData={chartData}
                latestValue={latest[m.key]}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
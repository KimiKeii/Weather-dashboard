import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import { useOutlookData, METRICS, heatLabel, fmtDate } from "../../hooks/useOutlookData";
import { useChartHover } from "../../hooks/useChartHover";

function MetricCard({ metric, chartData, latestValue }) {
  const hi = metric.key === "heat_index" ? heatLabel(latestValue) : null;
  const { activePayload, onMouseMove, onMouseLeave } = useChartHover();

  const values = chartData
    .map((item) => item[metric.key])
    .filter((value) => typeof value === "number" && !Number.isNaN(value));
  const minValue = values.length ? Math.min(...values) : null;
  const maxValue = values.length ? Math.max(...values) : null;
  const avgValue = values.length ? +(values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1) : null;
  const trendValue = values.length > 1
    ? values[values.length - 1] > values[0]
      ? "Upward"
      : values[values.length - 1] < values[0]
        ? "Downward"
        : "Stable"
    : "Stable";

  const CustomDot = (props) => {
    const { cx, cy } = props;
    return (
      <circle cx={cx} cy={cy} r={5} fill={metric.color} stroke="#f70000" strokeWidth={2} />
    );
  };

  const TooltipContent = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const point = payload[0];
    return (
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "10px 12px", boxShadow: "0 8px 24px rgba(15,23,42,.12)", fontSize: 14, minWidth: 110 }}>
        <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>{point.payload?.time}</div>
        <div style={{ fontWeight: 700, color: "#0f172a" }}>
          {point.value} <span style={{ color: "#94a3b8", fontWeight: 400 }}>{metric.unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", border: "1px solid #e8edf3", boxShadow: "0 2px 12px rgba(15,23,42,.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "nowrap", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0, overflow: "hidden" }}>
          <span style={{ fontSize: 15, flexShrink: 0 }}>{metric.icon}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#64748b", letterSpacing: ".04em", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{metric.label}</span>
        </div>
        <div style={{ flexShrink: 0, fontSize: 14, fontWeight: 700, color: metric.color, background: metric.color + "15", borderRadius: 20, padding: "3px 11px", border: `1.5px solid ${metric.color}30`, whiteSpace: "nowrap" }}>
          {latestValue ?? "—"} {metric.unit}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        {[
          { label: "Min", value: minValue },
          { label: "Max", value: maxValue },
          { label: "Avg", value: avgValue },
          { label: "Trend", value: trendValue },
        ].map((stat) => (
          <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", border: "1px solid #e8edf0", borderRadius: 16, padding: "5px 10px", fontSize: 12, color: "#475569" }}>
            <span style={{ fontWeight: 700, color: "#334155" }}>{stat.label}</span>
            <span>{stat.value ?? "—"}{stat.label !== "Trend" ? metric.unit : ""}</span>
          </div>
        ))}
      </div>

      {hi && (
        <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: hi.color, background: hi.bg, borderRadius: 20, padding: "2px 9px", marginBottom: 8 }}>
          {hi.text}
        </div>
      )}

      <div style={{ position: "relative", overflow: "visible" }}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 6, right: 20, left: -28, bottom: 0 }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip content={<TooltipContent />} cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Line
              type="monotone"
              dataKey={metric.key}
              stroke={metric.color}
              strokeWidth={2}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
            {activePayload && (
              <ReferenceDot 
                x={activePayload.payload?.time} 
                y={activePayload.value}
                shape={
                  <circle cx={0} cy={0} r={5} fill={metric.color} stroke="#f70000" strokeWidth={2} />
                }
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DetailedOutlookModal({ data, unit, cityName, country, onClose }) {
  const [tab, setTab] = useState("table");
  const { rows, tableRows, chartData, latest } = useOutlookData(data);

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 10, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#475569", fontFamily: "inherit" }}>
            ← Back
          </button>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-.4px" }}>Detailed Outlook</h2>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{cityName}{country ? `, ${country}` : ""} · Hourly forecast · {rows.length} records</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Temp",     value: `${latest.temperature_2m ?? "—"}°C`,     color: "#f97316" },
            { label: "Humidity", value: `${latest.relative_humidity_2m ?? "—"}%`, color: "#3b82f6" },
            { label: "Wind",     value: `${latest.wind_speed_10m ?? "—"} km/h`,   color: "#10b981" },
          ].map(p => (
            <div key={p.label} style={{ background: "#fff", border: "1px solid #e8edf3", borderRadius: 12, padding: "6px 14px", textAlign: "center", boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>{p.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: p.color }}>{p.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "2px solid #f1f5f9", marginBottom: 20 }}>
        {[{ id: "table", label: "📋 Tabulated Data" }, { id: "charts", label: "📈 Graphical View" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, color: tab === t.id ? "#2563eb" : "#94a3b8", borderBottom: `2.5px solid ${tab === t.id ? "#2563eb" : "transparent"}`, marginBottom: -2, transition: "color .15s, border-color .15s", fontFamily: "inherit" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {tab === "table" && (
          <div style={{ borderRadius: 16, border: "1px solid #e8edf3", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Date & Time", "Air Temp (°C)", "Humidity (%)", "Pressure (hPa)", "Rain (mm)", "Wind (km/h)", "Heat Index"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#94a3b8", borderBottom: "1px solid #e8edf3", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: "center", padding: 48, color: "#cbd5e1", fontStyle: "italic" }}>No data available</td></tr>
                  ) : tableRows.map((r, i) => {
                    const hiLbl = heatLabel(r.heat_index);
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #f8fafc", transition: "background .1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8fbff"}
                        onMouseLeave={e => e.currentTarget.style.background = ""}>
                        <td style={{ padding: "9px 14px", color: "#64748b", fontSize: 13, whiteSpace: "nowrap" }}>{fmtDate(r.time)}</td>
                        {[r.temperature_2m, r.relative_humidity_2m, r.surface_pressure, r.precipitation, r.wind_speed_10m].map((val, j) => (
                          <td key={j} style={{ padding: "9px 14px", fontFamily: "'DM Mono', monospace", fontWeight: 500, fontSize: 13, color: "#0f172a", whiteSpace: "nowrap" }}>{val ?? "—"}</td>
                        ))}
                        <td style={{ padding: "9px 14px", whiteSpace: "nowrap" }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, fontSize: 13, color: "#0f172a" }}>{r.heat_index ?? "—"}</span>
                          {hiLbl && <span style={{ marginLeft: 7, fontSize: 12, fontWeight: 700, color: hiLbl.color, background: hiLbl.bg, borderRadius: 20, padding: "2px 8px" }}>{hiLbl.text}</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "charts" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18 }}>
            {METRICS.map(m => <MetricCard key={m.key} metric={m} chartData={chartData} latestValue={latest[m.key]} />)}
          </div>
        )}
      </div>
    </div>
  );
}
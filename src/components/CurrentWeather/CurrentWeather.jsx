import React, { useState } from "react";
import { getWeatherEmoji, getWeatherLabel } from "../../API/weather.js";
import { useWeatherTheme, thunderText } from "../../hooks/useWeatherTheme.js";

function convertCtoF(tempC) {
  return Math.round((tempC * 9) / 5 + 32);
}

function getEmojiForTemp(tempC) {
  if (tempC >= 30) return "☀️";
  if (tempC >= 25) return "☁️";
  if (tempC >= 20) return "🌥️";
  if (tempC >= 15) return "🌦️";
  if (tempC >= 10) return "🌧️";
  if (tempC >= 0)  return "🌨️";
  return "❄️";
}

function getTempPhrase(tempC) {
  if (tempC >= 30) return "Hot";
  if (tempC >= 25) return "Overcast";
  if (tempC >= 20) return "Mostly Sunny";
  if (tempC >= 15) return "Light Rain";
  if (tempC >= 10) return "Showers";
  if (tempC >= 0)  return "Cold";
  return "Freezing";
}

function Drops({ count = 30, theme }) {
  const isSnow = theme === "snowy";
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const left     = Math.random() * 100;
        const delay    = Math.random() * 2;
        const duration = isSnow ? 3 + Math.random() * 4 : 0.6 + Math.random() * 0.6;
        const size     = isSnow ? 4 + Math.random() * 4 : { w: 1.5 + Math.random(), h: 10 + Math.random() * 8 };
        const opacity  = 0.3 + Math.random() * 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "-20px",
              width:  isSnow ? `${size}px` : `${size.w}px`,
              height: isSnow ? `${size}px` : `${size.h}px`,
              borderRadius: isSnow ? "50%" : "2px",
              background: isSnow
                ? "rgba(255,255,255,0.9)"
                : theme === "thunder"
                  ? "rgba(100,120,255,0.7)"
                  : "rgba(80,130,255,0.6)",
              opacity,
              animation: `weatherDrop ${duration}s linear ${delay}s infinite`,
              boxShadow: isSnow ? "0 0 4px rgba(255,255,255,0.6)" : "none",
            }}
          />
        );
      })}
    </>
  );
}

function SunRays() {
  return (
    <div style={{
      position: "absolute", top: "-60px", right: "-60px",
      width: "260px", height: "260px", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,220,80,0.35) 0%, rgba(255,180,0,0.12) 50%, transparent 75%)",
      animation: "sunPulse 3s ease-in-out infinite",
      pointerEvents: "none", zIndex: 1,
    }} />
  );
}

function LightningFlash() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "rgba(200,180,255,0.15)",
      animation: "lightningFlash 3s ease-in-out infinite",
      borderRadius: "inherit", pointerEvents: "none", zIndex: 1,
    }} />
  );
}

function FogLayers() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: "absolute", left: "-10%", width: "120%", height: "28px",
          top: `${25 + i * 22}%`,
          background: "linear-gradient(90deg, transparent, rgba(180,190,210,0.35), rgba(200,210,225,0.45), rgba(180,190,210,0.35), transparent)",
          borderRadius: "50%",
          animation: `fogDrift ${5 + i * 2}s ease-in-out ${i * 1.2}s infinite alternate`,
          filter: "blur(6px)", pointerEvents: "none", zIndex: 1,
        }} />
      ))}
    </>
  );
}

export default function CurrentWeather({ data, unit }) {
  const [manualTempInput, setManualTempInput] = useState("");

  const manualTempValue = parseFloat(manualTempInput);
  const hasManualTemp   = !Number.isNaN(manualTempValue);

  const displayTempValue = hasManualTemp
    ? Math.round(manualTempValue)
    : unit === "F" ? convertCtoF(data.temperature_2m) : Math.round(data.temperature_2m);

  const temperatureForEmoji = hasManualTemp
    ? unit === "F" ? (manualTempValue - 32) * 5 / 9 : manualTempValue
    : data.temperature_2m;

  const emoji         = hasManualTemp ? getEmojiForTemp(temperatureForEmoji) : getWeatherEmoji(data.weathercode);
  const weatherPhrase = hasManualTemp ? getTempPhrase(temperatureForEmoji)   : getWeatherLabel(data.weathercode);

  const { theme, style, isThunder, isRainy, isSnowy, isSunny, isFoggy } = useWeatherTheme(data.weathercode);
  const t = isThunder ? thunderText : null;

  return (
    <>
      <style>{`
        @keyframes weatherDrop {
          0%   { transform: translateY(-20px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(420px); opacity: 0; }
        }
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.12); opacity: 0.75; }
        }
        @keyframes lightningFlash {
          0%, 85%, 100% { opacity: 0; }
          87%  { opacity: 1; }
          89%  { opacity: 0.2; }
          91%  { opacity: 0.9; }
          93%  { opacity: 0; }
        }
        @keyframes fogDrift {
          0%   { transform: translateX(0px); opacity: 0.6; }
          100% { transform: translateX(30px); opacity: 1; }
        }
      `}</style>

      <div
        className="rounded-[32px] shadow-sm flex flex-col justify-between relative overflow-hidden"
        style={{ ...style, minHeight: "340px", padding: "28px 32px 32px" }}
      >
        {/* Background effects */}
        {isRainy   && <Drops count={28} theme={theme} />}
        {isSnowy   && <Drops count={22} theme="snowy" />}
        {isSunny   && <SunRays />}
        {isFoggy   && <FogLayers />}
        {isThunder && <LightningFlash />}

        {/* Top bar */}
        <div className="flex items-center justify-between z-10 relative">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${
            isThunder ? t.tagBg : "bg-white/60 text-blue-600"
          }`}>
            Current Weather
          </span>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 border rounded-xl px-4 py-2 ${
              isThunder ? t.pillBg : "bg-white/60 border-white/80"
            }`}>
              <span className={`font-bold text-lg ${isThunder ? "text-white" : "text-blue-500"}`}>≈</span>
              <span className={`text-sm font-semibold ${isThunder ? "text-white" : "text-slate-700"}`}>{data.windspeed_10m} km/h</span>
            </div>
            <div className={`flex items-center gap-2 border rounded-xl px-4 py-2 ${
              isThunder ? t.pillBg : "bg-white/60 border-white/80"
            }`}>
              <span className="text-lg">💧</span>
              <span className={`text-sm font-semibold ${isThunder ? "text-white" : "text-slate-700"}`}>{data.relativehumidity_2m}%</span>
            </div>
          </div>
        </div>

        {/* Emoji — top right, above the number */}
        <div className="absolute right-8 bottom-16 z-10 select-none" style={{ fontSize: "100px", lineHeight: 1 }}>
          {emoji}
        </div>

        {/* Giant temperature — bleeds out of card intentionally */}
        <div className="relative z-10" style={{ marginTop: "auto", lineHeight: 1 }}>
          {/* °Unit sits top-right of the number */}
          <div className="relative inline-block">
            <span
              className={`font-black tracking-tighter leading-none select-none ${isThunder ? t.tempColor : "text-slate-900"}`}
              style={{ fontSize: "clamp(140px, 22vw, 280px)", display: "block", lineHeight: 0.85 }}
            >
              {displayTempValue}°
            </span>
            {/* Unit label floated top-right of the number block */}
            <span
              className={`absolute font-bold ${isThunder ? t.unitColor : "text-slate-400"}`}
              style={{ fontSize: "28px", top: "12px", right: "-36px" }}
            >
              {unit}
            </span>
          </div>
        </div>

        {/* Weather label — bottom left */}
        <div className="relative z-10 mt-2">
          <span className={`font-black tracking-tight ${isThunder ? t.labelColor : "text-slate-800"}`}
            style={{ fontSize: "clamp(24px, 4vw, 40px)" }}>
            {weatherPhrase}
          </span>
        </div>

      </div>
    </>
  );
}
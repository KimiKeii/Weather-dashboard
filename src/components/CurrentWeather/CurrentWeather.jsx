import React, { useState } from "react";
import { getWeatherEmoji, getWeatherLabel } from "../../API/weather.js";

function convertCtoF(tempC) {
  return Math.round((tempC * 9) / 5 + 32);
}

function getEmojiForTemp(tempC) {
  if (tempC >= 30) return "☀️";
  if (tempC >= 25) return "☁️";
  if (tempC >= 20) return "🌥️";
  if (tempC >= 15) return "🌦️";
  if (tempC >= 10) return "🌧️";
  if (tempC >= 0) return "🌨️";
  return "❄️";
}

function getTempPhrase(tempC) {
  if (tempC >= 30) return "Hot";
  if (tempC >= 25) return "Overcast";
  if (tempC >= 20) return "Mostly Sunny";
  if (tempC >= 15) return "Light Rain";
  if (tempC >= 10) return "Showers";
  if (tempC >= 0) return "Cold";
  return "Freezing";
}

function getWeatherTheme(code) {
  if (code === 0 || code === 1) return "sunny";
  if (code <= 3)                return "cloudy";
  if (code <= 48)               return "foggy";
  if (code <= 67 || (code >= 80 && code <= 82)) return "rainy";
  if (code <= 77 || (code >= 85 && code <= 86)) return "snowy";
  if (code >= 95)               return "thunder";
  return "sunny";
}

// Generates random rain/snow drops
function Drops({ count = 30, theme }) {
  const isSnow = theme === "snowy";
  const drops = Array.from({ length: count }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = isSnow
      ? 3 + Math.random() * 4
      : 0.6 + Math.random() * 0.6;
    const size = isSnow
      ? 4 + Math.random() * 4
      : { w: 1.5 + Math.random(), h: 10 + Math.random() * 8 };
    const opacity = 0.3 + Math.random() * 0.5;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${left}%`,
          top: "-20px",
          width: isSnow ? `${size}px` : `${size.w}px`,
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
  });
  return <>{drops}</>;
}

// Lightning flash overlay for thunder
function LightningFlash() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(200,180,255,0.15)",
        animation: "lightningFlash 3s ease-in-out infinite",
        borderRadius: "inherit",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

// Sun rays for sunny
function SunRays() {
  return (
    <div
      style={{
        position: "absolute",
        top: "-60px",
        right: "-60px",
        width: "260px",
        height: "260px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,220,80,0.35) 0%, rgba(255,180,0,0.12) 50%, transparent 75%)",
        animation: "sunPulse 3s ease-in-out infinite",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

// Fog layers
function FogLayers() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "-10%",
            width: "120%",
            height: "28px",
            top: `${25 + i * 22}%`,
            background:
              "linear-gradient(90deg, transparent, rgba(180,190,210,0.35), rgba(200,210,225,0.45), rgba(180,190,210,0.35), transparent)",
            borderRadius: "50%",
            animation: `fogDrift ${5 + i * 2}s ease-in-out ${i * 1.2}s infinite alternate`,
            filter: "blur(6px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
}

const themeStyles = {
  sunny: {
    background: "linear-gradient(135deg, #fffbe8 0%, #fff3c4 40%, #ffe8a0 100%)",
    border: "1.5px solid rgba(255,210,60,0.18)",
  },
  cloudy: {
    background: "linear-gradient(135deg, #f0f4ff 0%, #e8eef8 50%, #dde5f5 100%)",
    border: "1.5px solid rgba(180,200,240,0.2)",
  },
  foggy: {
    background: "linear-gradient(135deg, #edf0f7 0%, #dfe5f0 50%, #d4dcea 100%)",
    border: "1.5px solid rgba(160,180,210,0.2)",
  },
  rainy: {
    background: "linear-gradient(135deg, #e8f0ff 0%, #d5e3ff 40%, #c8d8ff 100%)",
    border: "1.5px solid rgba(100,140,255,0.18)",
  },
  snowy: {
    background: "linear-gradient(135deg, #f0f8ff 0%, #e4f2ff 50%, #d8eeff 100%)",
    border: "1.5px solid rgba(180,220,255,0.25)",
  },
  thunder: {
    background: "linear-gradient(135deg, #1e1b3a 0%, #2a2550 40%, #1a1a3a 100%)",
    border: "1.5px solid rgba(120,100,255,0.3)",
  },
};

const thunderTextOverride = {
  tagBg: "bg-purple-900/40 text-purple-200",
  pillBg: "bg-white/10 border-white/10 text-white",
  tempColor: "text-white",
  unitColor: "text-purple-300",
  labelColor: "text-purple-200",
  inputBg: "bg-white/10 border-white/20 text-white placeholder-white/40",
  resetColor: "text-purple-300",
  mutedColor: "text-purple-400",
};

export default function CurrentWeather({ data, unit }) {
  const [manualTempInput, setManualTempInput] = useState("");

  const manualTempValue = parseFloat(manualTempInput);
  const hasManualTemp = !Number.isNaN(manualTempValue);

  const displayTempValue = hasManualTemp
    ? Math.round(manualTempValue)
    : unit === "F"
      ? convertCtoF(data.temperature_2m)
      : Math.round(data.temperature_2m);

  const temperatureForEmoji = hasManualTemp
    ? unit === "F" ? (manualTempValue - 32) * 5 / 9 : manualTempValue
    : data.temperature_2m;

  const emoji = hasManualTemp
    ? getEmojiForTemp(temperatureForEmoji)
    : getWeatherEmoji(data.weathercode);

  const weatherPhrase = hasManualTemp
    ? getTempPhrase(temperatureForEmoji)
    : getWeatherLabel(data.weathercode);

  const theme = getWeatherTheme(data.weathercode);
  const isThunder = theme === "thunder";
  const t = isThunder ? thunderTextOverride : null;

  return (
    <>
      {/* Inject keyframes once */}
      <style>{`
        @keyframes weatherDrop {
          0%   { transform: translateY(-20px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(420px); opacity: 0; }
        }
        @keyframes sunPulse {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.12); opacity: 0.75; }
        }
        @keyframes lightningFlash {
          0%, 85%, 100% { opacity: 0; }
          87%           { opacity: 1; }
          89%           { opacity: 0.2; }
          91%           { opacity: 0.9; }
          93%           { opacity: 0; }
        }
        @keyframes fogDrift {
          0%   { transform: translateX(0px);   opacity: 0.6; }
          100% { transform: translateX(30px);  opacity: 1; }
        }
      `}</style>

      <div
        className="rounded-[32px] p-8 shadow-sm flex flex-col justify-between h-full relative overflow-hidden"
        style={themeStyles[theme]}
      >
        {/* Weather background effects */}
        {(theme === "rainy" || theme === "thunder") && <Drops count={28} theme={theme} />}
        {theme === "snowy"   && <Drops count={22} theme={theme} />}
        {theme === "sunny"   && <SunRays />}
        {theme === "foggy"   && <FogLayers />}
        {theme === "thunder" && <LightningFlash />}

        {/* Top Tag */}
        <div className="flex flex-wrap items-center justify-between gap-4 z-10 relative">
          <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${
            isThunder ? t.tagBg : "bg-blue-50 text-blue-600"
          }`}>
            Current Weather
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <div className={`flex items-center gap-2 border rounded-xl px-4 py-2 ${
              isThunder ? t.pillBg : "bg-slate-50 border-slate-100"
            }`}>
              <span className={`font-bold text-lg ${isThunder ? "text-white" : "text-blue-500"}`}>≈</span>
              <span className={`text-sm font-semibold ${isThunder ? "text-white" : "text-slate-700"}`}>{data.windspeed_10m} km/h</span>
            </div>
            <div className={`flex items-center gap-2 border rounded-xl px-4 py-2 ${
              isThunder ? t.pillBg : "bg-slate-50 border-slate-100"
            }`}>
              <span className="text-lg">💧</span>
              <span className={`text-sm font-semibold ${isThunder ? "text-white" : "text-slate-700"}`}>{data.relativehumidity_2m}%</span>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="mt-8 z-10 relative">
          <div className="flex items-start gap-3">
            <h2 className={`text-8xl font-black tracking-tighter leading-none ${isThunder ? t.tempColor : "text-slate-900"}`}>
              {displayTempValue}°
            </h2>
            <span className={`text-3xl font-bold mt-2 ml-1 ${isThunder ? t.unitColor : "text-slate-400"}`}>{unit}</span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xl font-bold ${isThunder ? t.labelColor : "text-slate-700"}`}>{weatherPhrase}</span>
              <span className="text-3xl">{emoji}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className={`text-sm font-medium ${isThunder ? t.mutedColor : "text-slate-500"}`}>Enter temp:</label>
              <input
                type="number"
                value={manualTempInput}
                onChange={(e) => setManualTempInput(e.target.value)}
                placeholder={`${Math.round(unit === "F" ? convertCtoF(data.temperature_2m) : data.temperature_2m)}°`}
                className={`w-24 rounded-xl border px-3 py-2 text-sm focus:outline-none ${
                  isThunder ? t.inputBg : "border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-300"
                }`}
              />
              {hasManualTemp && (
                <button type="button" onClick={() => setManualTempInput("")}
                  className={`text-sm font-semibold ${isThunder ? t.resetColor : "text-blue-600 hover:text-blue-800"}`}>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-500 z-10 relative" />

        {/* Background emoji glow */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 text-[160px] leading-none select-none z-0">
          <div className={`absolute inset-0 blur-3xl opacity-20 rounded-full w-32 h-32 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
            isThunder ? "bg-purple-400" : "bg-yellow-400"
          }`} />
          <span className="relative z-10 drop-shadow-2xl">{emoji}</span>
        </div>
      </div>
    </>
  );
}
import React from "react";
import { getWeatherEmoji, getWeatherLabel } from "../../API/weather.js";

function displayTemp(tempC, unit) {
  if (unit === "F") return Math.round((tempC * 9) / 5 + 32);
  return Math.round(tempC);
}

export default function CurrentWeather({ data, unit }) {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
      {/* Top Tag */}
      <div>
        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
          Current Weather
        </span>
      </div>

      {/* Center Content: Temp & Status */}
      <div className="mt-8 z-10 relative">
        <div className="flex items-start">
          <h2 className="text-8xl font-black tracking-tighter text-slate-900 leading-none">
            {displayTemp(data.temperature_2m, unit)}°
          </h2>
          <span className="text-3xl font-bold text-slate-400 mt-2 ml-1">{unit}</span>
        </div>
        <p className="mt-4 text-xl font-bold text-slate-700">
          {getWeatherLabel(data.weathercode)}
        </p>
      </div>

      {/* Bottom Pills */}
      <div className="mt-8 flex gap-3 z-10 relative">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
          <span className="text-blue-500 font-bold text-lg">≈</span>
          <span className="text-sm font-semibold text-slate-700">{data.windspeed_10m} km/h</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
          <span className="text-blue-500 font-bold text-lg">💧</span>
          <span className="text-sm font-semibold text-slate-700">{data.relativehumidity_2m}%</span>
        </div>
      </div>

      {/* Huge Background Icon with Glow */}
      <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-[160px] leading-none select-none z-0">
        <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full w-32 h-32 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <span className="relative z-10 drop-shadow-2xl">{getWeatherEmoji(data.weathercode)}</span>
      </div>
    </div>
  );
}
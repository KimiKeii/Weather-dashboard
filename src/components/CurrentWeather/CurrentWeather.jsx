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
    ? unit === "F"
      ? (manualTempValue - 32) * 5 / 9
      : manualTempValue
    : data.temperature_2m;
  const emoji = hasManualTemp
    ? getEmojiForTemp(temperatureForEmoji)
    : getWeatherEmoji(data.weathercode);
  const weatherPhrase = hasManualTemp
    ? getTempPhrase(temperatureForEmoji)
    : getWeatherLabel(data.weathercode);

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
      {/* Top Tag */}
    <div className="flex flex-wrap items-center justify-between gap-4">
      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
        Current Weather
      </span>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
          <span className="text-blue-500 font-bold text-lg">≈</span>
          <span className="text-sm font-semibold text-slate-700">{data.windspeed_10m} km/h</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
          <span className="text-blue-500 font-bold text-lg">💧</span>
          <span className="text-sm font-semibold text-slate-700">{data.relativehumidity_2m}%</span>
        </div>
      </div>
    </div>

      {/* Center Content: Temp & Status */}
      <div className="mt-8 z-10 relative">
        <div className="flex items-start gap-3">
          <h2 className="text-8xl font-black tracking-tighter text-slate-900 leading-none">
            {displayTempValue}°
          </h2>
          <span className="text-3xl font-bold text-slate-400 mt-2 ml-1">{unit}</span>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xl font-bold text-slate-700">{weatherPhrase}</span>
            <span className="text-3xl">{emoji}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-slate-500">Enter temp:</label>
            <input
              type="number"
              value={manualTempInput}
              onChange={(e) => setManualTempInput(e.target.value)}
              placeholder={`${Math.round(unit === "F" ? convertCtoF(data.temperature_2m) : data.temperature_2m)}°`}
              className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-300 focus:outline-none"
            />
            {hasManualTemp && (
              <button
                type="button"
                onClick={() => setManualTempInput("")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-slate-500">
       
      </div>

      {/* Huge Background Icon with Glow */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 text-[160px] leading-none select-none z-0">
        <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full w-32 h-32 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <span className="relative z-10 drop-shadow-2xl">{emoji}</span>
      </div>
    </div>
  );
}
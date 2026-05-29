import React from "react";
// Adjust this import path depending on exactly where your weatherApi.js is located
import { getWeatherEmoji, getWeatherLabel, displayTemp } from "/workspaces/Weather-dashboard/src/API/weather.js";

export default function CurrentWeather({ data, unit }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Main Temperature & Condition */}
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
          Current Conditions
        </p>
        <div className="flex items-center gap-4 mt-4">
          <span className="text-7xl">{getWeatherEmoji(data.weathercode)}</span>
          <div>
            <h2 className="text-6xl font-black tracking-tight text-slate-950">
              {displayTemp(data.temperature_2m, unit)}° <span className="text-3xl text-slate-400">{unit}</span>
            </h2>
            <p className="mt-1 text-xl font-bold text-slate-600">
              {getWeatherLabel(data.weathercode)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid w-full grid-cols-2 gap-4 md:w-auto md:min-w-[300px]">
        <div className="rounded-2xl bg-[#f5f7fb] p-4">
          <p className="text-sm font-semibold text-slate-400">Wind</p>
          <p className="text-lg font-bold text-slate-800">{data.windspeed_10m} km/h</p>
        </div>
        <div className="rounded-2xl bg-[#f5f7fb] p-4">
          <p className="text-sm font-semibold text-slate-400">Humidity</p>
          <p className="text-lg font-bold text-slate-800">{data.relativehumidity_2m}%</p>
        </div>
        <div className="rounded-2xl bg-[#f5f7fb] p-4">
          <p className="text-sm font-semibold text-slate-400">Visibility</p>
          <p className="text-lg font-bold text-slate-800">{(data.visibility / 1000).toFixed(1)} km</p>
        </div>
        <div className="rounded-2xl bg-[#f5f7fb] p-4">
          <p className="text-sm font-semibold text-slate-400">UV Index</p>
          <p className="text-lg font-bold text-slate-800">{data.uv_index}</p>
        </div>
      </div>
    </div>
  );
}
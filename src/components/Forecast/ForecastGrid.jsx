import React from "react";
import { getWeatherEmoji, displayTemp } from "../../API/weather";

export default function ForecastGrid({ data, unit }) {
  return (
    /* Changed grid to 4 columns max so the 7 days wrap into 2 rows of squares */
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 h-full">
      {data.time.map((time, index) => {
        const isActive = index === 0;
        
        return (
          <div
            key={time}
            // aspect-square forces the div to be a perfect square regardless of screen size
            className={`aspect-square flex flex-col items-center justify-center rounded-[28px] p-3 transition-all shadow-sm ${
              isActive
                ? "bg-blue-50 border-[2px] border-blue-100" 
                : "bg-white border-[2px] border-transparent hover:border-slate-100"
            }`}
          >
            <span className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
              {new Date(time).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
            
            <span className="text-3xl my-2 drop-shadow-sm">
              {getWeatherEmoji(data.weathercode[index])}
            </span>
            
            <div className="mt-1 text-center">
              <span className={`block text-sm font-black ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                {displayTemp(data.temperature_2m_max[index], unit)}°
              </span>
              <span className={`block text-xs font-bold mt-0.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>
                {displayTemp(data.temperature_2m_min[index], unit)}°
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
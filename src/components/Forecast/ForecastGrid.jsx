import React from "react";
import { getWeatherEmoji, displayTemp } from "../../API/weather";

export default function ForecastGrid({ data, unit }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 h-full">
      {data.time.map((time, index) => {
        // Assume index 0 is today/active
        const isActive = index === 0;
        
        return (
          <div
            key={time}
            className={`flex flex-col items-center justify-center rounded-[24px] p-4 transition-all shadow-sm ${
              isActive
                ? "bg-blue-50 border border-blue-100" 
                : "bg-white border border-transparent"
            }`}
          >
            <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
              {new Date(time).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
            
            <span className="text-3xl my-2">
              {getWeatherEmoji(data.weathercode[index])}
            </span>
            
            <div className="mt-2 text-center">
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
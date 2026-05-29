import React from "react";

export default function ForecastGrid({ forecastData }) {
  return (
    /* The core container layout defining box spacing */
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {forecastData.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`flex flex-col items-center justify-center rounded-3xl p-5 transition-all ${
              item.active
                ? "border-[2px] border-blue-500 bg-blue-50 shadow-sm" 
                : "border-[2px] border-transparent bg-white shadow-sm hover:border-slate-100" 
            }`}
          >
            <span className="mb-3 text-xs font-bold text-slate-400">{item.day}</span>
            <Icon className={`mb-3 h-7 w-7 ${item.iconColor}`} />
            <span className="text-lg font-black text-slate-800">{item.high}</span>
            <span className="text-sm font-bold text-slate-400">{item.low}</span>
          </div>
        );
      })}
    </div>
  );
}
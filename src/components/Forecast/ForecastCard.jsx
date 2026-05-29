import React from "react";
import { Sun, Cloud, CloudRain } from "lucide-react";
import ForecastGrid from "./ForecastGrid.jsx";

const defaultForecastData = [
  { day: "MON", high: "24°", low: "12°", icon: Sun, iconColor: "text-amber-400", active: true },
  { day: "TUE", high: "21°", low: "14°", icon: Cloud, iconColor: "text-slate-400", active: false },
  { day: "WED", high: "18°", low: "15°", icon: CloudRain, iconColor: "text-blue-400", active: false },
  { day: "THU", high: "20°", low: "12°", icon: Cloud, iconColor: "text-slate-400", active: false },
  { day: "FRI", high: "25°", low: "16°", icon: Sun, iconColor: "text-amber-400", active: false },
  { day: "SAT", high: "28°", low: "18°", icon: Sun, iconColor: "text-amber-400", active: false },
  { day: "SUN", high: "26°", low: "17°", icon: Sun, iconColor: "text-amber-400", active: false },
];

export default function ForecastCard() {
  return (
    <div className="flex h-full flex-col">
      {/* Outer Card Layout Control Elements */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">7-Day Forecast</h3>
        <button className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800 hover:underline">
          Detailed Outlook &gt;
        </button>
      </div>
      
      {/* Passing data straight through to the modularized display grid */}
      <ForecastGrid forecastData={defaultForecastData} />
    </div>
  );
}
import React from "react";
import ForecastGrid from "./ForecastGrid.jsx";

export default function ForecastCard({ data, unit }) {
  return (
    <div className="bg-transparent h-full flex flex-col">
      {/* Outer Card Layout Control Elements */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">7-Day Forecast</h3>
        <button className="text-sm font-bold text-blue-600 transition-colors hover:text-blue-800 hover:underline">
          Detailed Outlook &gt;
        </button>
      </div>
      
      {/* Passing live API data through */}
      <ForecastGrid data={data} unit={unit} />
    </div>
  );
}
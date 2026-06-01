import React from "react";
import ForecastGrid from "./ForecastGrid.jsx";

export default function ForecastCard({ data, unit, onOpenOutlook }) {
  return (
    <div className="bg-transparent flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">7-Day Forecast</h3>
        <button
          onClick={onOpenOutlook}
          className="text-sm font-bold text-blue-600 transition-colors hover:text-blue-800 hover:underline"
        >
          Detailed Outlook &gt;
        </button>
      </div>
      <ForecastGrid data={data} unit={unit} />
    </div>
  );
}
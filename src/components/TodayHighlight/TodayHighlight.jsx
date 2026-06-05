import React from 'react';
import { Wind, Droplets, Sun, Eye, Thermometer, Gauge, CloudRain, Flame } from 'lucide-react';

function calcHeatIndex(tempC, rh) {
  if (tempC == null || rh == null) return null;
  const T = tempC * 9 / 5 + 32;
  if (T < 80) return +tempC.toFixed(1);
  const HI =
    -42.379 + 2.04901523 * T + 10.14333127 * rh
    - 0.22475541 * T * rh - 0.00683783 * T * T
    - 0.05481717 * rh * rh + 0.00122874 * T * T * rh
    + 0.00085282 * T * rh * rh - 0.00000199 * T * T * rh * rh;
  return +((HI - 32) * 5 / 9).toFixed(1);
}

function heatLabel(hi) {
  if (hi == null) return { text: "—", color: "text-gray-400" };
  if (hi >= 54) return { text: "Extreme Danger", color: "text-red-600" };
  if (hi >= 41) return { text: "Danger",          color: "text-orange-500" };
  if (hi >= 32) return { text: "Caution",          color: "text-yellow-600" };
  if (hi >= 27) return { text: "Take Care",        color: "text-blue-500" };
  return               { text: "Safe",             color: "text-green-600" };
}

export default function TodayHighlight({ data, hourly }) {
  // Get latest hourly values (last available index)
  const lastIdx = hourly?.time
    ? hourly.time.reduce((best, t, i) =>
        new Date(t) <= new Date() ? i : best, 0)
    : 0;

  const latestTemp = hourly?.temperature_2m?.[lastIdx] ?? null;
  const latestRh   = hourly?.relative_humidity_2m?.[lastIdx] ?? null;
  const latestPres = hourly?.surface_pressure?.[lastIdx] ?? null;
  const latestRain = hourly?.precipitation?.[lastIdx] ?? null;
  const heatIndex  = calcHeatIndex(latestTemp, latestRh);
  const hiLabel    = heatLabel(heatIndex);

  const highlights = [
    {
      icon: Wind,
      title: 'Wind Status',
      value: data.windspeed_10m,
      unit: 'km/h',
      status: 'Current',
      statusType: 'time',
      iconColor: 'text-gray-400',
    },
    {
      icon: Droplets,
      title: 'Humidity',
      value: data.relativehumidity_2m,
      unit: '%',
      status: data.relativehumidity_2m > 60 ? 'High Humidity' : 'Good',
      statusType: 'text',
      iconColor: 'text-blue-400',
    },
    {
      icon: Eye,
      title: 'Visibility',
      value: (data.visibility / 1000).toFixed(1),
      unit: 'km',
      status: 'Current',
      statusType: 'time',
      iconColor: 'text-gray-400',
    },
    {
      icon: Thermometer,
      title: 'Air Temperature',
      value: latestTemp ?? '—',
      unit: '°C',
      status: latestTemp != null
        ? latestTemp >= 35 ? 'Hot' : latestTemp >= 28 ? 'Warm' : 'Cool'
        : '—',
      statusType: 'text',
      iconColor: 'text-orange-400',
    },
    {
      icon: Gauge,
      title: 'Air Pressure',
      value: latestPres ?? '—',
      unit: 'hPa',
      status: latestPres != null
        ? latestPres > 1013 ? 'High Pressure' : 'Low Pressure'
        : '—',
      statusType: 'text',
      iconColor: 'text-purple-400',
    },
    {
      icon: CloudRain,
      title: 'Rain Gauge',
      value: latestRain ?? '—',
      unit: 'mm',
      status: latestRain != null
        ? latestRain === 0 ? 'No Rain' : latestRain < 2.5 ? 'Light Rain' : 'Heavy Rain'
        : '—',
      statusType: 'text',
      iconColor: 'text-cyan-400',
    },
    {
      icon: Sun,
      title: 'UV Index',
      value: data.uv_index,
      unit: 'uv',
      status: data.uv_index > 5 ? 'High UV' : 'Moderate UV',
      statusType: 'text',
      iconColor: 'text-yellow-500',
    },
    {
      icon: Flame,
      title: 'Heat Index',
      value: heatIndex ?? '—',
      unit: '°C',
      status: hiLabel.text,
      statusType: 'text',
      statusColor: hiLabel.color,
      iconColor: 'text-red-400',
    },
  ];

  const dotTitles = ['Humidity', 'UV Index', 'Air Temperature', 'Air Pressure', 'Rain Gauge', 'Heat Index'];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm h-full w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-8">Today's Highlight</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon;
          return (
            <div
              key={index}
              className="bg-gray-50/70 rounded-2xl p-6 flex flex-col justify-between border border-gray-100/50 transition-colors hover:bg-gray-100/70"
            >
              {/* Top Row: Icon and Title */}
              <div className="flex items-center gap-3 text-gray-500 mb-2">
                <Icon className={`w-5 h-5 ${highlight.iconColor}`} />
                <span className="text-sm font-medium">{highlight.title}</span>
              </div>

              {/* Value */}
              <div className="flex items-end gap-1 mb-5">
                <span className="text-2xl font-extrabold text-gray-950">{highlight.value}</span>
                <span className="text-sm text-gray-500 pb-1">{highlight.unit}</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-end gap-1.5 mt-auto">
                {dotTitles.includes(highlight.title) && (
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
                <p className={`text-sm font-medium ${highlight.statusColor ?? (highlight.statusType === 'time' ? 'text-gray-400' : 'text-gray-700')}`}>
                  {highlight.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import React from 'react';
import { Wind, Droplets, Sun, Eye } from 'lucide-react';

export default function TodayHighlight({ data }) {

    // SCALABILITY POINT RETAINED: 
    // The array is now inside the component so it can access the 'data' prop.
    // We dynamically map the API values into your structure.
    const highlights = [
        {
            icon: Wind,
            title: 'Wind Status',
            value: data.windspeed_10m,
            unit: 'km/h',
            status: 'Current',
            statusType: 'time'
        },
        {
            icon: Droplets,
            title: 'Humidity',
            value: data.relativehumidity_2m,
            unit: '%',
            // Added a tiny bit of logic to change status text based on live humidity
            status: data.relativehumidity_2m > 60 ? 'High Humidity' : 'Good',
            statusType: 'text'
        },
        {
            icon: Sun,
            title: 'UV Index',
            value: data.uv_index,
            unit: 'uv',
            // Dynamic text based on UV severity
            status: data.uv_index > 5 ? 'High UV' : 'Moderate UV',
            statusType: 'text'
        },
        {
            icon: Eye,
            title: 'Visibility',
            // Convert meters to kilometers on the fly
            value: (data.visibility / 1000).toFixed(1),
            unit: 'km',
            status: 'Current',
            statusType: 'time'
        },
    ];

    return (
        // Main Container matching image style (shadow, rounded corners, white background)
        <div className="bg-white rounded-3xl p-8 shadow-sm h-full w-full">

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 mb-8">Today's Highlight</h3>

            {/* SCALABILITY POINT: CSS Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Dynamic Mapping Loop */}
                {highlights.map((highlight, index) => {
                    const Icon = highlight.icon;
                    return (
                        <div
                            key={index}
                            className="bg-gray-50/70 rounded-2xl p-6 flex flex-col justify-between border border-gray-100/50 transition-colors hover:bg-gray-100/70"
                        >
                            {/* Top Row: Icon and Title */}
                            <div className="flex items-center gap-3 text-gray-500 mb-2">
                                <Icon className={`w-5 h-5 ${highlight.title === 'UV Index' ? 'text-yellow-500' : 'text-gray-400'}`} />
                                <span className="text-sm font-medium">{highlight.title}</span>
                            </div>

                            {/* Middle Row: Main Value and Unit */}
                            <div className="flex items-end gap-1 mb-5">
                                <span className="text-4xl font-extrabold text-gray-950">{highlight.value}</span>
                                <span className="text-sm text-gray-500 pb-1">{highlight.unit}</span>
                            </div>

                            {/* Bottom Row: Status/Time */}
                            <div className="flex items-center justify-end gap-1.5 mt-auto">
                                {(highlight.title === 'Humidity' || highlight.title === 'UV Index') && (
                                    <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    </div>
                                )}
                                <p className={`text-sm font-medium ${highlight.statusType === 'time' ? 'text-gray-400' : 'text-gray-700'}`}>
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
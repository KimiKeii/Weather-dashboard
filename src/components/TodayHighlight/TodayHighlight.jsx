import React from 'react';
import { Wind, Droplets, Sun, Eye } from 'lucide-react';

/**
 * SCALABILITY POINT:
 * This data array represents the content of the highlight cards.
 * If you want to add a new metric (like "Pressure" or "Air Quality"), 
 * just add another object below following this structure.
 */
const highlights = [
  {
    icon: Wind,
    title: 'Wind Status',
    value: '7.43',
    unit: 'km/h',
    status: '9:00 AM', // In the photo, some have status text, some have time
    statusType: 'time' 
  },
  {
    icon: Droplets,
    title: 'Humidity',
    value: '85',
    unit: '%',
    status: 'Humidity is good',
    statusType: 'text'
  },
  {
    icon: Sun,
    title: 'UV Index',
    value: '4',
    unit: 'uv',
    status: 'Moderate UV',
    statusType: 'text'
  },
  {
    icon: Eye,
    title: 'Visibility',
    value: '5',
    unit: 'km',
    status: '9:00 AM',
    statusType: 'time'
  },
];

export default function TodayHighlight() {
  return (
    // Main Container matching image style (shadow, rounded corners, white background)
    <div className="bg-white rounded-3xl p-8 shadow-sm h-full">
      
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-8">Today's Highlight</h3>
      
      {/* SCALABILITY POINT:
         CSS Grid is used here. 'md:grid-cols-2' means it shows 2 columns initially.
         If you add many cards, you might change this to grid-cols-2 lg:grid-cols-3
         to make better use of space.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Dynamic Mapping Loop */}
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon; // Assign component to capitalized variable for rendering
          return (
            <div 
              key={index} 
              // Sub-card style: light gray background, smaller rounding
              className="bg-gray-50/70 rounded-2xl p-6 flex flex-col justify-between border border-gray-100/50"
            >
              {/* Top Row: Icon and Title */}
              <div className="flex items-center gap-3 text-gray-500 mb-2">
                {/* Specific UV Index icon color matching image if desired */}
                <Icon className={`w-5 h-5 ${highlight.title === 'UV Index' ? 'text-yellow-500' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">{highlight.title}</span>
              </div>
              
              {/* Middle Row: Main Value and Unit */}
              <div className="flex items-end gap-1 mb-5">
                <span className="text-4xl font-extrabold text-gray-950">{highlight.value}</span>
                <span className="text-sm text-gray-500 pb-1">{highlight.unit}</span>
              </div>
              
              {/* Bottom Row: Status/Time (right-aligned in image) */}
              <div className="flex items-center justify-end gap-1.5 mt-auto">
                {/* Visual indicator (orange sun/arrow thing seen in image for some metrics) */}
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
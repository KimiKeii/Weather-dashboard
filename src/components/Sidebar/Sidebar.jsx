import { useState } from "react";
import SearchBar from "./SearchBar";
import LocationCard from "./LocationCard";

const cities = [
  { id: 1, name: "London", country: "United Kingdom", temp: 18, icon: "ti-map-pin" },
  { id: 2, name: "New York", country: "United States", temp: 22, icon: "ti-building-skyscraper" },
  { id: 3, name: "Dubai", country: "UAE", temp: 34, icon: "ti-sun" },
  { id: 4, name: "Tokyo", country: "Japan", temp: 19, icon: "ti-torii" },
];

export default function Sidebar() {
  const [activeCity, setActiveCity] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="flex flex-col w-[220px] h-screen bg-white border-r border-gray-200 px-4 py-5 gap-4">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <i className="ti ti-cloud text-white text-lg" aria-hidden="true" />
        </div>
        <span className="text-sm font-medium text-gray-800">
          WeatherScope <span className="text-blue-500">Pro</span>
        </span>
      </div>

      <SearchBar search={search} onChange={setSearch} />

      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
        Saved locations
      </p>

      <div className="flex flex-col gap-1">
        {filtered.map((city) => (
          <LocationCard
            key={city.id}
            city={city}
            isActive={activeCity === city.id}
            onClick={() => setActiveCity(city.id)}
          />
        ))}
      </div>
    </aside>
  );
}
import { useState, useEffect, useRef } from "react";
import { searchCities } from "../../API/weather";

export default function SearchBar({ onCitySelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const cities = await searchCities(query);
      setResults(cities);
      setLoading(false);
    }, 400);
  }, [query]);

  function handleSelect(city) {
    setQuery("");
    setResults([]);
    onCitySelect(city);
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
        <span className="text-gray-400 text-base">🔍</span>
        <input
          type="text"
          placeholder="Search cities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
        />
        {loading && <span className="text-xs text-gray-400">...</span>}
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          {results.map((city, i) => (
            <div
              key={i}
              onClick={() => handleSelect(city)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
            >
              <p className="font-medium text-gray-800">{city.name}</p>
              <p className="text-[11px] text-gray-400">{city.country}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
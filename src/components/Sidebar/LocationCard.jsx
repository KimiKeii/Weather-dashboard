export default function LocationCard({ city, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150
        ${isActive ? "bg-blue-50" : "hover:bg-gray-100"}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg
        ${isActive ? "bg-blue-100" : "bg-gray-100"}`}>
        {city.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? "text-blue-600" : "text-gray-800"}`}>
          {city.name}
        </p>
        <p className="text-[11px] text-gray-400 truncate">{city.country}</p>
      </div>

      <span className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}>
        {city.temp}°
      </span>
    </div>
  );
}

//hi
export default function SearchBar({ search, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
      <i className="ti ti-search text-gray-400 text-base" aria-hidden="true" />
      <input
        type="text"
        placeholder="Search cities..."
        value={search}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
      />
    </div>
  );
}
function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RefreshIcon({ spinning }) {
  return (
    <svg
      className={spinning ? "animate-spin" : ""}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 11A8.1 8.1 0 0 0 4.5 8.5M4 5V9H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4 13A8.1 8.1 0 0 0 19.5 15.5M20 19V15H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatTopBarDate(date) {
  const parsedDate = date ? new Date(date) : new Date();

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TopBar({
  cityName = "London",
  countryCode = "UK",
  date = new Date(),
  unit = "C",
  onUnitChange,
  onRefresh,
  isRefreshing = false,
  onOpenSidebar,
}) {
  const formattedDate = formatTopBarDate(date);

  return (
    <header className="flex h-[76px] w-full items-center justify-between border-b border-slate-100 bg-white px-5 md:px-8 lg:px-10">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 lg:hidden"
          aria-label="Open sidebar"
        >
          <MenuIcon />
        </button>

        <div className="min-w-0 flex flex-col">
          <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            {cityName}, {countryCode}
          </h1>

          <p className="mt-1 text-xs font-medium text-slate-400 md:text-sm">
            {formattedDate}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => onUnitChange("C")}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              unit === "C"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            °C
          </button>

          <button
            type="button"
            onClick={() => onUnitChange("F")}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              unit === "F"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            °F
          </button>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          aria-label="Refresh weather"
          title="Refresh weather"
        >
          <RefreshIcon spinning={isRefreshing} />
        </button>
      </div>
    </header>
  );
}

export default TopBar;
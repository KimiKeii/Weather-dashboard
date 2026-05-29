import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";

export default function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onCitySelect={setSelectedCity} />

      <main className="flex-1 overflow-auto p-6">
        {selectedCity && (
          <p className="text-sm text-gray-500">
            Selected: {selectedCity.name}, {selectedCity.country}
          </p>
        )}
      </main>
    </div>
  );
}
const GEO_URL = "https://nominatim.openstreetmap.org";
export const WEATHER_URL = "https://api.open-meteo.com/v1";

export async function searchCities(query) {
  const res = await fetch(
    `${GEO_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
    { headers: { "Accept-Language": "en" } }
  );
  const data = await res.json();
  return data.map((place) => ({
    name: place.display_name.split(",")[0],
    country: place.display_name.split(",").slice(-1)[0].trim(),
    lat: parseFloat(place.lat),
    lon: parseFloat(place.lon),
  }));
}

export async function getWeather(lat, lon) {
  const res = await fetch(
    `${WEATHER_URL}/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,windspeed_10m,relativehumidity_2m,weathercode,visibility,uv_index` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
    `&timezone=auto&forecast_days=7`
  );
  return await res.json();
}

export async function reverseGeocode(lat, lon) {
  const res = await fetch(
    `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { "Accept-Language": "en" } }
  );
  const data = await res.json();
  return {
    name: data.address.city || data.address.town || data.address.village,
    country: data.address.country,
  };
}

export function getWeatherEmoji(code) {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code <= 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "❄️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

export function getWeatherLabel(code) {
  if (code === 0) return "Clear Sky";
  if (code <= 2) return "Partly Cloudy";
  if (code <= 3) return "Overcast";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Rain Showers";
  if (code <= 86) return "Snow Showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}
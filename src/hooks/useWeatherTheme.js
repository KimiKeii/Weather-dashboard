import { useMemo } from "react";

function getTheme(code) {
  if (code === 0 || code === 1) return "sunny";
  if (code <= 3)                return "cloudy";
  if (code <= 48)               return "foggy";
  if (code <= 67 || (code >= 80 && code <= 82)) return "rainy";
  if (code <= 77 || (code >= 85 && code <= 86)) return "snowy";
  if (code >= 95)               return "thunder";
  return "sunny";
}

export const themeStyles = {
  sunny: {
    background: "linear-gradient(135deg, #fffbe8 0%, #fff3c4 40%, #ffe8a0 100%)",
    border: "1.5px solid rgba(255,210,60,0.18)",
  },
  cloudy: {
    background: "linear-gradient(135deg, #f0f4ff 0%, #e8eef8 50%, #dde5f5 100%)",
    border: "1.5px solid rgba(180,200,240,0.2)",
  },
  foggy: {
    background: "linear-gradient(135deg, #edf0f7 0%, #dfe5f0 50%, #d4dcea 100%)",
    border: "1.5px solid rgba(160,180,210,0.2)",
  },
  rainy: {
    background: "linear-gradient(135deg, #e8f0ff 0%, #d5e3ff 40%, #c8d8ff 100%)",
    border: "1.5px solid rgba(100,140,255,0.18)",
  },
  snowy: {
    background: "linear-gradient(135deg, #f0f8ff 0%, #e4f2ff 50%, #d8eeff 100%)",
    border: "1.5px solid rgba(180,220,255,0.25)",
  },
  thunder: {
    background: "linear-gradient(135deg, #1e1b3a 0%, #2a2550 40%, #1a1a3a 100%)",
    border: "1.5px solid rgba(120,100,255,0.3)",
  },
};

export const thunderText = {
  tagBg:       "bg-purple-900/40 text-purple-200",
  pillBg:      "bg-white/10 border-white/10 text-white",
  tempColor:   "text-white",
  unitColor:   "text-purple-300",
  labelColor:  "text-purple-200",
  inputBg:     "bg-white/10 border-white/20 text-white placeholder-white/40",
  resetColor:  "text-purple-300",
  mutedColor:  "text-purple-400",
};

export function useWeatherTheme(weathercode) {
  return useMemo(() => {
    const theme = getTheme(weathercode);
    return {
      theme,
      style: themeStyles[theme],
      isThunder: theme === "thunder",
      isRainy:   theme === "rainy" || theme === "thunder",
      isSnowy:   theme === "snowy",
      isSunny:   theme === "sunny",
      isFoggy:   theme === "foggy",
    };
  }, [weathercode]);
}
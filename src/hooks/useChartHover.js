import { useState } from "react";

export function useChartHover() {
  const [activePayload, setActivePayload] = useState(null);
  const [activeX, setActiveX] = useState(null);
  const [activeY, setActiveY] = useState(null);

  const onMouseMove = (state) => {
    if (state?.activeTooltipIndex !== undefined && state?.activePayload?.length) {
      setActivePayload(state.activePayload[0]);
      setActiveX(state.activeCoordinate?.x);
      setActiveY(state.activeCoordinate?.y);
    }
  };

  const onMouseLeave = () => {
    setActivePayload(null);
    setActiveX(null);
    setActiveY(null);
  };

  return { activePayload, activeX, activeY, onMouseMove, onMouseLeave };
}
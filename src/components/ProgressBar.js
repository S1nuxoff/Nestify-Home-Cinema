// src/components/ProgressBar.js

import React, { useState, useRef } from "react";
import { formatTime } from "../utils/timeUtils";

const ProgressBar = ({
  className,
  sliderValue,
  min,
  max,
  gradient,
  onChange,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  currentSec,
  durationSec,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTime, setTooltipTime] = useState(0);
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const sliderRef = useRef();

  const handleInput = (e) => {
    const value = parseFloat(e.target.value);
    const percent = value / 100;
    const time = Math.floor(percent * durationSec);
    setTooltipTime(time);
    setShowTooltip(true);

    // Расчёт позиции для подсказки
    const rect = sliderRef.current.getBoundingClientRect();
    const relativeX = (value / 100) * rect.width;
    setTooltipLeft(relativeX);

    onChange(e); // пробрасываем значение наверх
  };

  const hideTooltip = () => {
    setShowTooltip(false);
  };

  return (
    <div className="progress-bar-container" style={{ position: "relative" }}>
      <input
        ref={sliderRef}
        type="range"
        className={className}
        min={min}
        max={max}
        value={sliderValue}
        onChange={handleInput}
        onMouseDown={(e) => {
          setShowTooltip(true);
          onMouseDown(e);
        }}
        onMouseUp={(e) => {
          hideTooltip();
          onMouseUp(e);
        }}
        onTouchStart={(e) => {
          setShowTooltip(true);
          onTouchStart(e);
        }}
        onTouchEnd={(e) => {
          hideTooltip();
          onTouchEnd(e);
        }}
        style={{ background: gradient }}
      />
      <span className="player-timer">{formatTime(currentSec)}</span>

      {showTooltip && (
        <div
          className="tooltip"
          style={{
            position: "absolute",
            top: "-30px",
            left: tooltipLeft,
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "14px",
            pointerEvents: "none",
          }}
        >
          {formatTime(tooltipTime)}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

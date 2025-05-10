// file: src/components/PlaybackControls.js

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import { ReactComponent as PlayerPlayIcon } from "../assets/icons/player_play.svg";
import { ReactComponent as PlayerPauseIcon } from "../assets/icons/player_pause.svg";
import { ReactComponent as PlayerBackwardIcon } from "../assets/icons/player_backward.svg";
import { ReactComponent as PlayerForwardIcon } from "../assets/icons/player_forward.svg";
import { ReactComponent as PlayerVolumeuIcon } from "../assets/icons/player_volume.svg";
import { ReactComponent as PlayerStop } from "../assets/icons/player_stop.svg";
import kodiWebSocket from "../api/ws/kodiWebSocket";
import "../styles/PlaybackControls.css";

// Функция для форматирования времени
const formatTime = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
};

// Обновлённый компонент ProgressBar с подсказкой времени во время перетаскивания
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

function PlaybackControls() {
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const [playerId, setPlayerId] = useState(null);
  const [currentSec, setCurrentSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const isDraggingRef = useRef(false);
  const sliderRef = useRef(null);
  const min = 0;
  const max = 100;

  // Вычисление градиента для прогресс-бара при изменении sliderValue
  const gradient = `linear-gradient(to right,
  var(--red) 0%,
  var(--red) ${sliderValue}%,
  rgba(217, 217, 217, 50%) ${sliderValue}%,
  rgba(217, 217, 217, 50%)`;

  // Обработчики плеера
  const handlePlayPause = useCallback(() => {
    kodiWebSocket.playPause();
  }, []);

  const handleRewind = useCallback(() => {
    kodiWebSocket.seek(-10);
  }, []);

  const handleForward = useCallback(() => {
    kodiWebSocket.seek(10);
  }, []);

  const handleStop = useCallback(() => {
    kodiWebSocket.stop();
  }, []);

  // Обработчики для прогресс-бара
  const handleSliderChange = useCallback((e) => {
    setSliderValue(parseInt(e.target.value, 10));
  }, []);

  const handleSliderMouseDown = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handleSliderMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    if (playerId !== null && durationSec > 0) {
      const newPositionSec = Math.floor((sliderValue / 100) * durationSec);
      const h = Math.floor(newPositionSec / 3600);
      const m = Math.floor((newPositionSec % 3600) / 60);
      const s = newPositionSec % 60;
      kodiWebSocket.seekAbsolute(h, m, s);
      setCurrentSec(newPositionSec);
    }
  }, [playerId, durationSec, sliderValue]);

  // Обработчик для переключения видимости слайдера громкости
  const handleVolumeIconClick = useCallback(() => {
    setShowVolumeSlider((prev) => !prev);
  }, []);

  // Обработчики для управления громкостью через pointer-события
  const updateVolumeFromPointer = useCallback((e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const newValue = 1 - clickY / rect.height;
    const clamped = Math.max(0, Math.min(newValue, 1));
    const newVolume = Math.round(clamped * 100);
    setVolume(newVolume);
    kodiWebSocket.setVolume(newVolume);
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      e.preventDefault();
      updateVolumeFromPointer(e);
    },
    [updateVolumeFromPointer]
  );

  const handlePointerUpWrapper = useCallback(
    (e) => {
      e.preventDefault();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUpWrapper);
    },
    [handlePointerMove]
  );

  const handlePointerDown = useCallback(
    (e) => {
      e.preventDefault();
      updateVolumeFromPointer(e);
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUpWrapper);
    },
    [updateVolumeFromPointer, handlePointerMove, handlePointerUpWrapper]
  );

  // Инициализация соединения с Kodi и подписка на события
  useEffect(() => {
    kodiWebSocket.init();

    const handlePlayerIdChange = (newPlayerId) => {
      setPlayerId(newPlayerId);
      if (newPlayerId === null) {
        setCurrentSec(0);
        setDurationSec(0);
        setSliderValue(0);
      }
    };

    const handlePlayerProperties = (props) => {
      const { time, totaltime } = props;
      const curSec = time.hours * 3600 + time.minutes * 60 + time.seconds;
      const durSec =
        totaltime.hours * 3600 + totaltime.minutes * 60 + totaltime.seconds;

      setCurrentSec(curSec);
      setDurationSec(durSec);
      if ("speed" in props) setIsPlaying(props.speed !== 0);
      if (!isDraggingRef.current) {
        const newPercent = durSec > 0 ? (curSec / durSec) * 100 : 0;
        setSliderValue(newPercent);
      }
    };

    const handleApplicationProperties = (props) => {
      if (props.volume !== undefined) setVolume(props.volume);
    };

    kodiWebSocket.on("playerIdChange", handlePlayerIdChange);
    kodiWebSocket.on("playerProperties", handlePlayerProperties);
    kodiWebSocket.on("applicationProperties", handleApplicationProperties);

    const interval = setInterval(() => {
      if (kodiWebSocket.playerId === null) {
        kodiWebSocket.requestActivePlayer();
      } else {
        kodiWebSocket.requestPlayerProperties(kodiWebSocket.playerId);
      }
      kodiWebSocket.requestVolume();
    }, 1000);

    return () => {
      clearInterval(interval);
      kodiWebSocket.off("playerIdChange", handlePlayerIdChange);
      kodiWebSocket.off("playerProperties", handlePlayerProperties);
      kodiWebSocket.off("applicationProperties", handleApplicationProperties);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          {showVolumeSlider && (
            <div
              className="custom-volume-container"
              onClick={() => setShowVolumeSlider(false)}
            >
              <div className="tooltip-outside">{Math.round(volume)}%</div>
              <div
                className="slider"
                ref={sliderRef}
                style={{ "--value": volume / 100 }}
                onPointerDown={handlePointerDown}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="slider-track-background"></div>
                <div className="slider-track-bar"></div>
              </div>
            </div>
          )}

          <div className="playback-controls-mobile-container">
            <div className="plater-play-back-mobile">
              <ProgressBar
                className="player-progress-bar-mobile"
                sliderValue={sliderValue}
                min={min}
                max={max}
                gradient={gradient}
                onChange={handleSliderChange}
                onMouseDown={handleSliderMouseDown}
                onMouseUp={handleSliderMouseUp}
                onTouchStart={handleSliderMouseDown}
                onTouchEnd={handleSliderMouseUp}
                currentSec={currentSec}
                durationSec={durationSec}
              />
            </div>
            <div className="player-controls-mobile">
              <PlayerStop
                className="player-icon"
                onClick={handleStop}
                style={{ cursor: "pointer", width: 32, height: 32 }}
              />
              <div className="player-central-controls-mobile">
                <PlayerBackwardIcon
                  onClick={handleRewind}
                  style={{ cursor: "pointer" }}
                />
                {isPlaying ? (
                  <PlayerPauseIcon
                    onClick={handlePlayPause}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <PlayerPlayIcon
                    onClick={handlePlayPause}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <PlayerForwardIcon
                  onClick={handleForward}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <PlayerVolumeuIcon
                onClick={handleVolumeIconClick}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {showVolumeSlider && (
            <div
              className="custom-volume-container"
              onClick={() => setShowVolumeSlider(false)}
            >
              <div className="tooltip-outside">{Math.round(volume)}%</div>
              <div
                className="slider"
                ref={sliderRef}
                style={{ "--value": volume / 100 }}
                onPointerDown={handlePointerDown}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="slider-track-background"></div>
                <div className="slider-track-bar"></div>
              </div>
            </div>
          )}
          <div className="playback-controls-container">
            <div className="player-controls">
              {isPlaying ? (
                <PlayerPauseIcon
                  onClick={handlePlayPause}
                  style={{ cursor: "pointer", width: 48, height: 48 }}
                />
              ) : (
                <PlayerPlayIcon
                  onClick={handlePlayPause}
                  style={{ cursor: "pointer" }}
                />
              )}
              <PlayerStop
                onClick={handleStop}
                style={{ cursor: "pointer", width: 32, height: 32 }}
              />
              <div className="player-rewind-controls">
                <PlayerBackwardIcon
                  onClick={handleRewind}
                  style={{ cursor: "pointer" }}
                />
                <PlayerForwardIcon
                  onClick={handleForward}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="plater-play-back">
                <ProgressBar
                  className="player-progress-bar"
                  sliderValue={sliderValue}
                  min={min}
                  max={max}
                  gradient={gradient}
                  onChange={handleSliderChange}
                  onMouseDown={handleSliderMouseDown}
                  onMouseUp={handleSliderMouseUp}
                  onTouchStart={handleSliderMouseDown}
                  onTouchEnd={handleSliderMouseUp}
                  currentSec={currentSec}
                  durationSec={durationSec}
                />
              </div>
              <PlayerVolumeuIcon
                onClick={handleVolumeIconClick}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default PlaybackControls;

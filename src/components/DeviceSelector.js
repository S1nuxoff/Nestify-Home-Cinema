import React, { useState, useEffect } from "react";
import { ReactComponent as DeviceStatusIcon } from "../assets/icons/device_status.svg";
import { ReactComponent as Arrow } from "../assets/icons/arrow.svg";
import kodiWebSocket from "../kodiWebSocket"; // Импортируем ваш WebSocket
import "../styles/DeviceSelector.css";

function DeviceSelector() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Функция, обрабатывающая изменение статуса подключения
    const handleConnectedChange = (state) => {
      setIsConnected(state);
    };

    // Подписываемся на событие "connected" из kodiWebSocket
    kodiWebSocket.on("connected", handleConnectedChange);

    // При размонтировании убираем подписку
    return () => {
      kodiWebSocket.off("connected", handleConnectedChange);
    };
  }, []);

  return (
    <div className="device-selector-container">
      <DeviceStatusIcon
        className={
          isConnected
            ? "device-selector-device-status-icon" // онлайн
            : "device-selector-device-status-icon-disable" // офлайн
        }
      />
      <span className="device-selector-text">Projector</span>
      <Arrow />
    </div>
  );
}

export default DeviceSelector;

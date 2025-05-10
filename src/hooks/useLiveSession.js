// hooks/useLiveSession.js
import { useState, useEffect } from "react";

const WS_URL = "ws://192.168.15:8000/ws/live_session";

const useLiveSession = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSession(data); // 👈 Прямо то, что пришло от сервера
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onopen = () => console.log("[HomeRezka WS] Connected to live_session");
    ws.onerror = (e) => console.error("[HomeRezka WS] Error", e);
    ws.onclose = () => console.warn("[HomeRezka WS] Disconnected");

    return () => ws.close();
  }, []);
  return session;
};

export default useLiveSession;

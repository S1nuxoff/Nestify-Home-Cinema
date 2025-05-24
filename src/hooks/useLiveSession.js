// hooks/useLiveSession.js
import { useState, useEffect } from "react";
import config from "../core/config";
const useLiveSession = (userId) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!userId) return; // не подключаться без юзера
    const ws = new WebSocket(
      `ws://212.162.155.61:8000/ws/live_session/${userId}`
    );

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSession(data.live_session || null); // сразу достаём только live_session
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onopen = () => console.log("[HomeRezka WS] Connected to live_session");
    ws.onerror = (e) => console.error("[HomeRezka WS] Error", e);
    ws.onclose = () => console.warn("[HomeRezka WS] Disconnected");

    return () => ws.close();
  }, [userId]);

  return session;
};

export default useLiveSession;

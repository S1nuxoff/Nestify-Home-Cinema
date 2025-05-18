import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import config from "../core/config";
import "../styles/Player.css";
import { getProgress, saveProgress } from "../api/hdrezka/progressApi";

export default function Player() {
  /* входные данные */
  const { state } = useLocation();
  const { selectedEpisode, selectedSeason, movieDetails, movie_url } =
    state ?? {};
  const userId = JSON.parse(localStorage.getItem("current_user"))?.id;

  /* refs + state */
  const videoNodeRef = useRef(null); // DOM-<video>
  const playerRef = useRef(null); // video.js Player inst
  const timerRef = useRef(null);
  const [startPos, setStartPos] = useState(null);

  /* 1. GET /progress */
  useEffect(() => {
    if (!movieDetails || !movie_url) return;
    (async () => {
      const { position_seconds } = await getProgress({
        user_id: userId,
        movie_id: movieDetails.id,
        season: selectedSeason ?? null,
        episode: selectedEpisode ?? null,
      });
      setStartPos(position_seconds || 0);
    })();
  }, [userId, movieDetails, movie_url, selectedSeason, selectedEpisode]);

  /* 2. init video.js once */
  useEffect(() => {
    const node = videoNodeRef.current;
    if (!node) return;
    playerRef.current = videojs(node, {
      controls: true,
      preload: "auto",
      autoplay: false,
    });

    return () => {
      playerRef.current?.dispose();
    };
  }, []);

  /* 3. после готовности плеера + позиции — seek + mute + play */
  useEffect(() => {
    const p = playerRef.current;
    if (!p || startPos === null) return;

    const run = () => {
      p.muted(true); // обход autoplay
      p.currentTime(startPos);
      p.play().then(() => setTimeout(() => p.muted(false), 400));
    };

    p.readyState() > 0 ? run() : p.one("loadedmetadata", run);

    /* ── сохранение прогресса ── */
    const save = () =>
      saveProgress({
        user_id: userId,
        movie_id: movieDetails.id,
        position_seconds: Math.floor(p.currentTime()),
        season: selectedSeason ?? null,
        episode: selectedEpisode ?? null,
      });

    p.on("pause", save);
    p.on("seeked", save);
    timerRef.current = setInterval(save, 30_000);

    return () => {
      // 1️⃣ считываем позицию напрямую из DOM-видео,
      //    пока Video.js ещё не уничтожил его
      const rawTime = videoNodeRef.current?.currentTime;
      if (rawTime != null) {
        saveProgress({
          user_id: userId,
          movie_id: movieDetails.id,
          position_seconds: Math.floor(rawTime),
          season: selectedSeason ?? null,
          episode: selectedEpisode ?? null,
        });
      }

      // 2️⃣ снимаем подписки и таймер
      p.off("pause", save);
      p.off("seeked", save);
      clearInterval(timerRef.current);

      // 3️⃣ уничтожаем плеер
      p.dispose();
    };
  }, [startPos]);

  if (!movieDetails || !movie_url) return <p>Дані відсутні…</p>;
  const proxyUrl = `${config.backend_url}/proxy?url=${movie_url}`;

  return (
    <div className="web-player-container">
      <video
        ref={videoNodeRef}
        className="video-js"
        src={proxyUrl}
        playsInline
        controls
      />
    </div>
  );
}

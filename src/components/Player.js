import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PlayerPlaybackControls from "./PlayerPlaybackControls";
import { getWatchHistory } from "../api/htttp/hdrezka";
import { ReactComponent as More } from "../assets/icons/more.svg";
import ContinueWatch from "../components/ContinueWatch";

import "swiper/css";
import "../styles/Player.css";

// src/components/Player.js
import useLiveSession from "../hooks/useLiveSession";

function Player({ onMovieSelect }) {
  const session = useLiveSession();
  const [history, setHistory] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWatchHistory();
        setHistory(data || []); // Устанавливаем все данные, если они есть
      } catch (error) {
        console.error("Error fetching main page data:", error);
      }
    };
    fetchData();
  }, []);
  if (!session || !session.id)
    return (
      <>
        <Swiper
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          slidesPerView={1}
          spaceBetween={10}
          centeredSlides={false}
          className="player-swiper"
          pagination={{
            clickable: true, // делает точки кликабельными
          }}
        >
          {history &&
            history.map((movie, idx) => (
              <SwiperSlide key={`${movie.id}-${idx}`}>
                <ContinueWatch
                  movie={movie}
                  onMovieSelect={onMovieSelect}
                  isActive={idx === activeIndex}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </>
    );
  else
    return (
      <div className="player-container">
        <div className="player-preview-wrapper">
          <div className="preview-overlay"></div>
          <img src={session.image} alt="Preview" className="preview-image" />
        </div>

        <div className="player-content">
          <div className="player-content-top">
            <span className="player-status-text">Now Playing</span>
            <More onClick={() => onMovieSelect(session)} />
          </div>
          <div className="player-content-bottom">
            <div className="player-info" onClick={() => onMovieSelect(session)}>
              <span className="player-title">{session.title}</span>
              <span className="player-sub_title">
                <span className="player-sub_title-origin-name">
                  {session.origin_name}
                </span>
                {session.season_id && session.episode_id && (
                  <span className="player-sub_title-episodes">
                    | Season {session.season_id}, Episode {session.episode_id}{" "}
                  </span>
                )}
              </span>
            </div>
            <PlayerPlaybackControls />
          </div>
        </div>
      </div>
    );
}

export default Player;

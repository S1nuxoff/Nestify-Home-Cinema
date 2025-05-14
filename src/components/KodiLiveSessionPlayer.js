import React from "react";
import PlayerPlaybackControls from "./PlayerPlaybackControls";
import { ReactComponent as More } from "../assets/icons/more.svg";

import "swiper/css";
import "../styles/Player.css";

function KodiLiveSessionPlayer({ session, onMovieSelect }) {
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

export default KodiLiveSessionPlayer;

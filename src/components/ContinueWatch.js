import React, { useState } from "react";
import { ReactComponent as PlayIcon } from "../assets/icons/play.svg";
import { ReactComponent as VolumeMute } from "../assets/icons/volume-mute.svg";
import { ReactComponent as VolumeOne } from "../assets/icons/volume-one.svg";
import ReactPlayer from "react-player/youtube";
import "../styles/Player.css";
import "swiper/css";

function ContinueWatch({ onMovieSelect, movie, isActive }) {
  const [isMuted, setIsMuted] = useState(true); // Состояние для звука
  const [isVisible, setIsVisible] = useState(true); // Состояние для звука
  const toggleMute = () => {
    setIsMuted(!isMuted);
    setIsVisible(!isVisible);
  };

  return (
    <>
      <div className="continue-container">
        <div className="player-preview-wrapper">
          <div className="continue-overlay"></div>

          {movie?.trailer ? (
            isActive && (
              <>
                <div className="continue-volume-btn" onClick={toggleMute}>
                  {isMuted ? (
                    <VolumeMute className="continue-volume-icon" />
                  ) : (
                    <VolumeOne className="continue-volume-icon" />
                  )}
                </div>
                <div className="youtube-player-container">
                  <div
                    className={`youtube-player-overlay ${
                      isVisible ? "" : "hidden"
                    }`}
                  ></div>
                  <ReactPlayer
                    className="youtube-player"
                    loop
                    rel="0"
                    url={movie.trailer}
                    playing={false} // автозапуск: true/false
                    controls={false} // убрать интерфейс
                    muted={isMuted}
                    width="100%"
                    height="100%"
                    volume={0.1}
                    config={{
                      youtube: {
                        playerVars: {
                          autoplay: 1,
                          modestbranding: 1,
                          rel: 0,
                          controls: 0,
                          showinfo: 0,
                          fs: 0,
                          disablekb: 1,
                        },
                      },
                    }}
                  />
                </div>
              </>
            )
          ) : (
            <img src={movie?.image} alt="Preview" className="preview-image" />
          )}
        </div>

        <div className={`continue-content ${isVisible ? "" : "hidden"}`}>
          <div className="continue-content-top">
            <span className="continue-status-text">Continue Watching</span>
            {/* <More onClick={() => onMovieSelect(movie)} /> */}
          </div>
          <span></span>
          <div className="continue-content-bottom">
            <div className="continue-titles">
              <span className="continue-title">{movie?.title}</span>
              <span className="continue-origin_name">
                {movie?.origin_name || movie.title}
              </span>
            </div>
            <div className="continue-info">
              <div className="continue-sub_title">
                {movie?.age && (
                  <span className="continue-sub_age">{movie.age}</span>
                )}
                <span className="continue-sub_title-genre">
                  {movie?.genre[0]}
                </span>

                <div className="continue-sub_title">
                  <span className="continue-sub_title-release_date">
                    {movie?.release_date}
                  </span>

                  <span className="continue-sub_title-duration">
                    {movie?.duration}
                  </span>
                </div>
              </div>
              <span className="continue_description">{movie?.description}</span>
            </div>

            <div
              className="continue__play-button"
              onClick={() => onMovieSelect(movie)}
            >
              <PlayIcon /> Play
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContinueWatch;

import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { ReactComponent as PlayerPlayIcon } from "../assets/icons/player_play.svg";
import { ReactComponent as PlayerPauseIcon } from "../assets/icons/player_pause.svg";
import { ReactComponent as PlayerBackwardIcon } from "../assets/icons/player_backward.svg";
import { ReactComponent as PlayerForwardIcon } from "../assets/icons/player_forward.svg";
import { ReactComponent as PlayerVolumeuIcon } from "../assets/icons/player_volume.svg";
import { ReactComponent as PlayerStop } from "../assets/icons/player_stop.svg";
import "../styles/PlayerPlaybackControls.css";

const formatTime = (sec) => {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

function WebPlayerControls({ url }) {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleRewind = () =>
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  const handleForward = () =>
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  const handleStop = () => setIsPlaying(false);
  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));
  const handleProgress = ({ playedSeconds }) => setPlayed(playedSeconds);
  const handleSeek = (e) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    playerRef.current.seekTo(newTime);
    setPlayed(newTime);
  };

  return (
    <div className="web-player-wrapper">
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        volume={volume}
        width="100%"
        height="100%"
        controls={false}
        onDuration={setDuration}
        onProgress={handleProgress}
      />
      <div className="player-controls-container">
        <div className="seek-section">
          <input
            type="range"
            className="seek-bar"
            min={0}
            max={100}
            value={(played / duration) * 100 || 0}
            onChange={handleSeek}
          />
          <span className="time-label">
            {formatTime(played)} / {formatTime(duration)}
          </span>
        </div>
        <div className="player-controls-items">
          <PlayerStop className="player-icon" onClick={handleStop} />
          <div className="player-controls-center">
            <PlayerBackwardIcon onClick={handleRewind} />
            {isPlaying ? (
              <PlayerPauseIcon onClick={handlePlayPause} />
            ) : (
              <PlayerPlayIcon onClick={handlePlayPause} />
            )}
            <PlayerForwardIcon onClick={handleForward} />
          </div>
          <PlayerVolumeuIcon onClick={() => setShowVolumeSlider((v) => !v)} />
          {showVolumeSlider && (
            <input
              type="range"
              className="volume-slider"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default WebPlayerControls;

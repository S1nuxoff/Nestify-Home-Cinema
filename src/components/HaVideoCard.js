// VideoCard.js
import React from "react";
import "../styles/HaVideoCard.css";

function VideoCard({ movie, onMovieSelect }) {
  return (
    <div
      className="ha-video-card-container"
      onClick={() => onMovieSelect(movie)}
    >
      <div className="ha-video-card-preview-wrapper">
        <div className="ha-video-card-overlay"></div>
        <img src={movie.filmImage} alt="Preview" className="preview-image" />
      </div>
      <div className="ha-video-card-content">
        <span></span>
        <div className="ha-video-card-meta">
          <span className="ha-video-card-title">{movie.filmName}</span>
          <span className="ha-video-card-video-duration">
            {movie.filmDecribe}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;

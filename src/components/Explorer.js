import React, { useState } from "react";
import VideoCard from "./VideoCard";
import "swiper/css";
import "../styles/Explorer.css";

function Explorer({ history, title, Page, onMovieSelect }) {
  const [visibleCount] = useState(100);

  return (
    <div className="explorer-container">
      <span className="row-header-title">{title}</span>
      <div className="explorer-library-grid">
        {Page &&
          Page.slice(0, visibleCount).map((movie) => (
            <VideoCard
              key={movie.id}
              movie={movie}
              onMovieSelect={onMovieSelect}
              type={"explorer-card"}
            />
          ))}
      </div>
    </div>
  );
}

export default Explorer;

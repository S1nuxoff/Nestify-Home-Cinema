// // VideoCard.js
// import React from "react";
// import "../styles/VideoCard.css";

// function VideoCard({ movie, onMovieSelect }) {
//   return (
//     <div className="video-card-wrapper" onClick={() => onMovieSelect(movie)}>
//       <div className="video-card_preview-wrapper">
//         <img
//           src={movie.filmImage}
//           alt="Preview"
//           className="video-card_preview-image"
//         />
//       </div>
//       <div className="video-card-content">
//         <span></span>
//         <div className="video-card-meta">
//           <span className="video-card-title">{movie.filmName}</span>
//           {/* <span className="video-card-video-duration">{movie.filmDecribe}</span> */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VideoCard;

// VideoCard.js
import React from "react";
import "../styles/VideoCard.css";

function VideoCard({ movie, onMovieSelect, type }) {
  return (
    <div className="video-card-container" onClick={() => onMovieSelect(movie)}>
      <div
        className={`video-card-preview-wrapper ${
          type === "history" ? "video-card-preview-wrapper-history" : ""
        }`}
      >
        {/* <div className="video-card-overlay"></div> */}
        <img
          src={movie.filmImage ?? movie.image}
          alt="Preview"
          className="video-card_preview-image"
        />
      </div>

      <div className="video-card-meta">
        <span className="video-card-title">
          {movie.filmName ?? movie.title}
        </span>
        <span className="video-card-video-duration">
          {movie.filmDecribe ?? new Date(movie.updated_at).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default VideoCard;

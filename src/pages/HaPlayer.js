import React from "react";
import KodiLiveSessionPlayer from "../components/KodiLiveSessionPlayer";

function HaPlayer({ onMovieSelect }) {
  return (
    <div>
      <KodiLiveSessionPlayer
        onMovieSelect={onMovieSelect}
      ></KodiLiveSessionPlayer>
    </div>
  );
}

export default HaPlayer;

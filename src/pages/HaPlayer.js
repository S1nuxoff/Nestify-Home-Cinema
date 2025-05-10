import React from "react";
import Player from "../components/Player";

function HaPlayer({ onMovieSelect }) {
  return (
    <div>
      <Player onMovieSelect={onMovieSelect}></Player>
    </div>
  );
}

export default HaPlayer;

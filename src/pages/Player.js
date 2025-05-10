import React from "react";
import ReactPlayer from "react-player";
import "../styles/Player.css";

function Player() {
  return (
    <ReactPlayer
      url="https://stream.voidboost.cc/9287b73bab2a92bdfeed287dd3c99fc3:2025051110:YXFBYlpCRUN4bUsvQ20xZjlZNSs0WWNxRjNzbjZaczU1TTQ4Z0tkTUVWZUpYaXNQS1hmVE8wR0FwYnlualVWQkxMQWc2M04xVW56OW5zay9lR2N3dGc9PQ==/1/2/7/1/1/3/5/h9col.mp4"
      controls
      className="react-player"
    />
  );
}

export default Player;

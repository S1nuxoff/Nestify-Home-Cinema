import React from "react";
import ReactPlayer from "react-player/youtube";

function YouTubePlayer(url) {
  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <ReactPlayer
        loop
        rel="0"
        url={url}
        playing={false} // автозапуск: true/false
        controls={false} // убрать интерфейс
        muted={false}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: -160, left: 0 }}
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
  );
}

export default YouTubePlayer;

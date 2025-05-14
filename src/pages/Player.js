import { useLocation, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import CustomPlayer from "../components/CustomPlayer";
import config from "../core/config";
const Player = () => {
  const { state } = useLocation();
  const { movieId } = useParams();

  const movieDetails = state?.movieDetails;
  const movie_url = state?.movie_url;
  const proxyUrl = `${config.backend_url}/proxy?url=${movie_url}`;
  console.log(movie_url);
  if (!movieDetails || !movie_url) {
    return <p>Дані відсутні. Можливо, сторінку було відкрито напряму.</p>;
  }

  return (
    <div className="web-player-container">
      <ReactPlayer
        url={proxyUrl}
        controls
        playing
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default Player;

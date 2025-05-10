// App.js
import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getWatchHistory } from "./api/htttp/hdrezka";
import useLiveSession from "./hooks/useLiveSession";
import Home from "./pages/Home";
import Series from "./pages/Series";
import Films from "./pages/Films";
import Player from "./pages/Player";
import MoviePopup from "./components/MoviePopup";
import kodiWebSocket from "./api/ws/kodiWebSocket";
import HaPlayer from "./pages/HaPlayer";
import HaSlider from "./pages/HaSlider";
import "./styles/App.css";

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [history, setHistory] = useState([]);
  const session = useLiveSession();
  const continue_movie = history[0];
  const backgroundImage = session?.image || continue_movie?.image;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWatchHistory();
        const firstItem = data?.[0]; // безопасно получаем первый элемент
        setHistory(firstItem ? [firstItem] : []); // оборачиваем в массив, если нужно
      } catch (error) {
        console.error("Error fetching main page data:", error);
      }
    };
    fetchData();
  }, []);

  const location = useLocation();

  useEffect(() => {
    kodiWebSocket.init();
  }, []);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };
  const closePopup = () => {
    setSelectedMovie(null);
  };

  const isHaSliderPage = location.pathname === "/ha";

  return (
    <div style={{ position: "relative", zIndex: 1 }} className="App">
      {backgroundImage && (
        <div
          className="body-backdrop"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      )}
      {isHaSliderPage ? (
        <Routes>
          <Route
            path="/ha"
            element={<HaSlider onMovieSelect={handleMovieSelect} />}
          />
        </Routes>
      ) : (
        // ВАЖНО: оборачиваем два div в общий контейнер
        <div>
          <div>
            {selectedMovie && (
              <MoviePopup movie={selectedMovie} onClose={closePopup} />
            )}
          </div>
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={<Home onMovieSelect={handleMovieSelect} />}
              />
              <Route
                path="/series"
                element={<Series onMovieSelect={handleMovieSelect} />}
              />
              <Route
                path="/films"
                element={<Films onMovieSelect={handleMovieSelect} />}
              />
              <Route
                path="/haplayer"
                element={<HaPlayer onMovieSelect={handleMovieSelect} />}
              />
              <Route path="/player" element={<Player></Player>} />
            </Routes>
            {/* <AnimatePresence>
              {showScrollComponent && !selectedMovie && (
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="scroll-info"
                >
                  <PlaybackControls />
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

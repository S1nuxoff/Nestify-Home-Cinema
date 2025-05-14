import React, { useState, useEffect } from "react";
import Explorer from "../components/Explorer";
import Header from "../components/Header";
import { getPage, search } from "../api/htttp/hdrezka";
import { getWatchHistory } from "../api/htttp/hdrezka";
import KodiLiveSessionPlayer from "../components/KodiLiveSessionPlayer.js";
import useLiveSession from "../hooks/useLiveSession";
import HeroSwiper from "../components/HeroSwiper";
import WatchHistory from "../components/WatchHistory.js";
import MoviePopup from "../components/MoviePopup";
import useMovieDetails from "../hooks/useMovieDetails";
import config from "../core/config.js";

function Home({ currentUser }) {
  const [page, setPage] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const session = useLiveSession();

  const { movieDetails, loading } = useMovieDetails(
    selectedMovie?.filmLink || selectedMovie?.link
  );

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const closePopup = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPage(config.hdrezk_url);
        setPage(data);
      } catch (error) {
        console.error("Error fetching main page data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWatchHistory(currentUser.id);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching main page data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (query) => {
    if (query.trim() === "") {
      try {
        const data = await getPage();
        setPage(data);
      } catch (error) {
        console.error("Error fetching main page data:", error);
      }
    } else {
      try {
        const data = await search(query);
        setPage(data);
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    }
  };

  return (
    <>
      {selectedMovie && (
        <MoviePopup
          loading={loading}
          movieDetails={movieDetails}
          currentUser={currentUser}
          movie={selectedMovie}
          onClose={closePopup}
        />
      )}
      <div className="container">
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          onMovieSelect={handleMovieSelect}
        />
        {!session || !session.id ? (
          <HeroSwiper
            onMovieSelect={handleMovieSelect}
            history={history}
          ></HeroSwiper>
        ) : (
          <KodiLiveSessionPlayer
            session={session}
            history={history}
            currentUser={currentUser}
            onMovieSelect={handleMovieSelect}
          ></KodiLiveSessionPlayer>
        )}
        {history ? (
          <WatchHistory onMovieSelect={handleMovieSelect} history={history} />
        ) : null}

        <Explorer
          history={history}
          currentUser={currentUser}
          Page={page}
          title={"Popular"}
          onMovieSelect={handleMovieSelect}
        />
      </div>
    </>
  );
}

export default Home;

import React, { useState, useEffect } from "react";
import {
  getPage,
  search,
  getCategories,
  getMainPage,
  getWatchHistory,
} from "../api/htttp/hdrezka";
import { getFeatured } from "../api/utils";

import Header from "../components/Header";
import HeroSwiper from "../components/HeroSwiper";
import KodiLiveSessionPlayer from "../components/KodiLiveSessionPlayer";
import WatchHistory from "../components/WatchHistory";
import MovieCardSwiper from "../components/MovieCardSwiper";
import MoviePopup from "../components/MoviePopup";
import CollectionsSwiper from "../components/CollectionsSwiper";
import useLiveSession from "../hooks/useLiveSession";
import useMovieDetails from "../hooks/useMovieDetails";
import Footer from "../components/Footer";

import "../styles/HomePage.css";

function Home({}) {
  /* ───────── state ───────── */
  const [page, setPage] = useState({});
  const [featured, setFeatured] = useState([]); // <-- должно быть массивом

  const [history, setHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  /* ───────── loading flags ───────── */
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  /* ───────── hooks ───────── */

  const { movieDetails, loading: movieLoading } = useMovieDetails(
    selectedMovie?.filmLink || selectedMovie?.link
  );
  const currentUser = JSON.parse(localStorage.getItem("current_user"));
  const session = useLiveSession(Number(currentUser.id));
  /* ───────── handlers ───────── */
  const handleMovieSelect = (movie) => setSelectedMovie(movie);
  const closePopup = () => setSelectedMovie(null);

  const handleSearch = async (query) => {
    try {
      if (query.trim() === "") {
        setIsPageLoading(true);
        setPage(await getPage());
      } else {
        setIsPageLoading(true);
        setPage(await search(query));
      }
    } catch (err) {
      console.error("search error:", err);
    } finally {
      setIsPageLoading(false);
    }
  };

  /* ───────── effects ───────── */
  useEffect(() => {
    (async () => {
      try {
        setPage(await getMainPage());
      } catch (e) {
        console.error("getMainPage error:", e);
      } finally {
        setIsPageLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setCategories((await getCategories()).categories || []);
      } catch (e) {
        console.error("getCategories error:", e);
      } finally {
        setIsCategoriesLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setFeatured(await getFeatured());
      } catch (e) {
        console.error("getMainPage error:", e);
      } finally {
        setIsPageLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setHistory(await getWatchHistory(currentUser.id));
      } catch (e) {
        console.error("getWatchHistory error:", e);
      } finally {
        setIsHistoryLoading(false);
      }
    })();
  }, [currentUser.id]);

  /* ───────── UI ───────── */
  return (
    <>
      {/* задній фон для Hero */}
      {/* {Array.isArray(history) && history.length > 0 && (
        <div
          className="body-backdrop"
          style={{
            backgroundImage: history[activeHeroIdx]?.image
              ? `url(${history[activeHeroIdx].image})`
              : "none",
          }}
        />
      )} */}

      {/* popup з деталями */}
      {selectedMovie && (
        <MoviePopup
          loading={movieLoading}
          movieDetails={movieDetails}
          currentUser={currentUser}
          movie={selectedMovie}
          onClose={closePopup}
        />
      )}

      <div className="container">
        <Header
          categories={categories}
          currentUser={currentUser}
          onSearch={handleSearch}
          onMovieSelect={handleMovieSelect}
        />

        {session ? (
          <KodiLiveSessionPlayer
            session={session}
            history={history}
            currentUser={currentUser}
            onMovieSelect={handleMovieSelect}
          />
        ) : (
          <HeroSwiper
            onMovieSelect={handleMovieSelect}
            featured={featured}
            onActiveIndexChange={setActiveHeroIdx}
          />
        )}

        <div className="home-page-content">
          {!isHistoryLoading &&
            Array.isArray(history) &&
            history.length > 0 && (
              <WatchHistory
                navigate_to="/history"
                onMovieSelect={handleMovieSelect}
                history={history}
              />
            )}

          {!isPageLoading && (
            <>
              <CollectionsSwiper
                navigate_to="/collections"
                title="Переглянути за колекціями"
                data={page.collections}
              />
              <MovieCardSwiper
                navigate_to="/new"
                data={page.newest.items}
                onMovieSelect={handleMovieSelect}
                title="Новинки"
              />

              <MovieCardSwiper
                navigate_to="?filter=popular"
                data={page.popular.items}
                onMovieSelect={handleMovieSelect}
                title="Популярні"
              />
              <MovieCardSwiper
                navigate_to="?filter=watching"
                data={page.watching.items}
                onMovieSelect={handleMovieSelect}
                title="Зараз дивиться"
              />
            </>
          )}

          {isPageLoading && (
            <div className="spinner-wrapper">
              <div className="spinner"></div>
            </div>
          )}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Home;

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPage, getCategories } from "../api/htttp/hdrezka";
import Explorer from "../components/Explorer";
import MoviePopup from "../components/MoviePopup";
import Header from "../components/Header";
import config from "../core/config";
import useMovieDetails from "../hooks/useMovieDetails";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import "../styles/Category.css";
import { ReactComponent as BackIcon } from "../assets/icons/back.svg";
import "../styles/HistoryPage.css";
import { getWatchHistory } from "../api/htttp/hdrezka";

function HistoryPage({}) {
  const [history, setHistory] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const { movieDetails, loading } = useMovieDetails(
    selectedMovie?.filmLink || selectedMovie?.link
  );

  const currentUser = JSON.parse(localStorage.getItem("current_user"));
  useEffect(() => {
    (async () => {
      try {
        setHistory(await getWatchHistory(currentUser.id));
      } catch (e) {
        console.error("getWatchHistory error:", e);
      } finally {
      }
    })();
  }, [currentUser.id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { categories: list = [] } = await getCategories();
        setCategories(list);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);
  console.log(history);
  return (
    <>
      {selectedMovie && (
        <MoviePopup
          loading={loading}
          movieDetails={movieDetails}
          currentUser={currentUser}
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <div className="container">
        <Header
          categories={categories}
          onMovieSelect={setSelectedMovie}
          currentUser={currentUser}
        />
        <>
          <div className="history-page_container">
            <Explorer
              Page={history}
              title={"History"}
              currentUser={currentUser}
              onMovieSelect={setSelectedMovie}
            />
          </div>
        </>
        <Footer />
      </div>
    </>
  );
}

export default HistoryPage;

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

function Category({}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState({ items: [], pages_count: 1 });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const { movieDetails, loading } = useMovieDetails(
    selectedMovie?.filmLink || selectedMovie?.link
  );
  const currentUser = JSON.parse(localStorage.getItem("current_user"));
  // 🎯 шлях на бекенд: після "/category", включаючи page/X/
  const backendPath = location.pathname
    .replace(/^\/category/, "")
    .replace(/\/{2,}/g, "/") // убираем двойные/тройные слэши
    .replace(/\/+$/, ""); // убираем / в конце

  const fullUrl = config.hdrezk_url + backendPath;

  const baseUrl = "/category" + backendPath.replace(/\/page\/\d+\/?$/, "");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPage(fullUrl);
        setPageData(data);
      } catch (err) {
        console.error("Error fetching category page:", err);
      }
    };

    fetchData();
  }, [location.pathname]); // ⬅️ виконується на кожну зміну шляху

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
        <div className="category-content">
          <div className="category-content-top">
            <div className="category-content-title">
              <BackIcon
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />

              <span className="row-header-title">{pageData.title}</span>
            </div>
          </div>

          <Explorer
            Page={pageData.items}
            title={null}
            currentUser={currentUser}
            onMovieSelect={setSelectedMovie}
          />
          <Pagination totalPages={pageData.pages_count} baseUrl={baseUrl} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Category;

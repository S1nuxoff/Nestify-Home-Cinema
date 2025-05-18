import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPage, getCategories } from "../api/htttp/hdrezka";
import Explorer from "../components/Explorer";
import MoviePopup from "../components/MoviePopup";
import Header from "../components/Header";
import config from "../core/config";
import useMovieDetails from "../hooks/useMovieDetails";

function Category({ currentUser }) {
  const location = useLocation();
  const [pageData, setPageData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const { movieDetails, loading } = useMovieDetails(
    selectedMovie?.filmLink || selectedMovie?.link
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const path = location.pathname; // "/category/cartoons/western/"
        const cleanPath = path.replace(/^\/category/, ""); // "/cartoons/western/"
        const fullUrl = config.hdrezk_url + cleanPath;

        const data = await getPage(fullUrl);
        setPageData(data);
      } catch (err) {
        console.error("Error fetching category page:", err);
      }
    };

    fetchData();
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { categories: list = [] } = await getCategories();
        setCategories(list);
      } catch (error) {
        console.error("Error fetching main page data:", error);
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
        <Explorer
          Page={pageData}
          title={null}
          currentUser={currentUser}
          onMovieSelect={setSelectedMovie}
        />
      </div>
    </>
  );
}

export default Category;

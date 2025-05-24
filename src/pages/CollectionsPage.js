import { useEffect, useState } from "react";
import { getCollections, getCategories } from "../api/htttp/hdrezka";
import Explorer from "../components/Explorer";
import MoviePopup from "../components/MoviePopup";
import Header from "../components/Header";
import "../styles/CollectionsPage.css";
import useMovieDetails from "../hooks/useMovieDetails";

import Footer from "../components/Footer";
import "../styles/Category.css";

import CollectionCard from "../components/CollectionCard";

function CollectionsPage() {
  const [visibleCount, setVisibleCount] = useState(20);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const { movieDetails, loading } = useMovieDetails(
    selectedMovie?.filmLink || selectedMovie?.link
  );
  const currentUser = JSON.parse(localStorage.getItem("current_user"));

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getCollections(); // просто массив
        setCollections(list); // сохраняем напрямую
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        setVisibleCount((prev) => prev + 20); // Подгружаем ещё 20
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        <div className="collections-content">
          <div className="collection-container">
            {collections.slice(0, visibleCount).map((collection) => (
              <CollectionCard
                key={collection.filename}
                collection={collection}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default CollectionsPage;

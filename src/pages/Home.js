// HDrezka.js
import React, { useState, useEffect } from "react";
import Explorer from "../components/Explorer";
import HeaderHDrezka from "../components/HeaderHDrezka";
import { getPage, search } from "../api/htttp/hdrezka";
import Player from "../components/Player";

function HDrezka({ onMovieSelect }) {
  const [page, setPage] = useState([]);
  const link = "https://hdrezka.ag/";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPage(link);
        setPage(data);
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
    <div className="container">
      <HeaderHDrezka onSearch={handleSearch} onMovieSelect={onMovieSelect} />
      <Player onMovieSelect={onMovieSelect}></Player>
      <Explorer Page={page} title={"Popular"} onMovieSelect={onMovieSelect} />
    </div>
  );
}

export default HDrezka;

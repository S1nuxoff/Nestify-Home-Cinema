import React, { useState, useEffect } from "react";
import { getWatchHistory } from "../api/htttp/hdrezka";
import VideoCard from "./VideoCard";
import "../styles/Explorer.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

function Explorer({ title, Page, onMovieSelect }) {
  const [history, setHistory] = useState([]);
  // const [visibleCount, setVisibleCount] = useState(20); // 👈 по умолчанию показываем 8
  const [visibleCount] = useState(20); // 👈 по умолчанию показываем 8

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWatchHistory();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching main page data:", error);
      }
    };
    fetchData();
  }, []);

  // const handleLoadMore = () => {
  //   setVisibleCount((prev) => prev + 8);
  // };

  return (
    <div className="explorer-container">
      <div className="explorer_watch-history">
        <span className="row-header-title">History</span>
        <Swiper
          slidesPerView={1.5} // 👈 половина второго слайда будет видна
          spaceBetween={10} // 👈 расстояние между слайдами
          centeredSlides={false}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.2 },
            1280: { slidesPerView: 5.2 },
          }}
          style={{ paddingRight: "40px", marginTop: "24px" }} // 👈 даёт пространство справа
        >
          {history &&
            history.map((movie) => (
              <SwiperSlide key={movie.id}>
                <VideoCard
                  type={"history"}
                  movie={movie}
                  onMovieSelect={onMovieSelect}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      <span className="row-header-title">{title}</span>
      <div className="explorer-library-grid">
        {Page &&
          Page.slice(0, visibleCount).map((movie) => (
            <VideoCard
              key={movie.id}
              movie={movie}
              onMovieSelect={onMovieSelect}
            />
          ))}
      </div>
    </div>
  );
}

export default Explorer;

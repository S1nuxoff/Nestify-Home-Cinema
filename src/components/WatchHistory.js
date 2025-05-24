import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import VideoCard from "./VideoCard";
import { useNavigate } from "react-router-dom";
import "swiper/css";

function WatchHistory({ navigate_to, onMovieSelect, history }) {
  const navigate = useNavigate();

  return (
    <div className="explorer_watch-history">
      <span
        onClick={(e) => {
          e.stopPropagation();
          navigate(`${navigate_to}`);
        }}
        className="row-header-title"
      >
        Історія переглядів
      </span>
      <Swiper
        style={{ marginTop: "20px" }}
        spaceBetween={20}
        slidesPerView="auto"
        breakpoints={{
          0: { slidesPerView: 2.2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
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
  );
}

export default WatchHistory;

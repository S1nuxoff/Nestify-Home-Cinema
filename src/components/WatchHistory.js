import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import VideoCard from "./VideoCard";
import "swiper/css";

function WatchHistory({ onMovieSelect, history }) {
  return (
    <div className="explorer_watch-history">
      <span className="row-header-title">History</span>
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

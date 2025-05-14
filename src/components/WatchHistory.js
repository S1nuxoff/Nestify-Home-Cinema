import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import VideoCard from "./VideoCard";
import "swiper/css";

function WatchHistory({ onMovieSelect, history }) {
  return (
    <div className="explorer_watch-history">
      <span className="row-header-title">History</span>
      <Swiper
        style={{ paddingRight: "40px", marginTop: "24px" }}
        slidesPerView={1.5}
        spaceBetween={10}
        centeredSlides={false}
        breakpoints={{
          480: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4.2 },
          1280: { slidesPerView: 5.2 },
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

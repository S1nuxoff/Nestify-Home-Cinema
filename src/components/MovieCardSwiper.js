import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import VideoCard from "./VideoCard";
import { ReactComponent as ArrowRightIcon } from "../assets/icons/arrow-right.svg";

import "swiper/css";
import "../styles/MovieCardSwiper.css";

function MovieCardSwiper({ onMovieSelect, data, title, navigate_to }) {
  const navigate = useNavigate();

  return (
    <div className="movie_card_swiper-container">
      <div
        className="movie_card_swiper_title-container"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/category${navigate_to}`);
        }}
      >
        <span className="row-header-title">{title}</span>
        <ArrowRightIcon className="arrow-right-icon" />
      </div>

      <Swiper
        style={{ marginTop: "12px" }}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          480: { slidesPerView: 2.2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {data?.map((movie) => (
          <SwiperSlide key={movie.id}>
            <VideoCard movie={movie} onMovieSelect={onMovieSelect} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default MovieCardSwiper;

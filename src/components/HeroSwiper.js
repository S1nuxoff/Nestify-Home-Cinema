import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import ContinueWatch from "../components/ContinueWatch";

function HeroSwiper({ onMovieSelect, history }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Swiper
      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      slidesPerView={1}
      spaceBetween={10}
      centeredSlides={false}
      className="player-swiper"
      pagination={{
        clickable: true, // делает точки кликабельными
      }}
    >
      {history &&
        history.map((movie, idx) => (
          <SwiperSlide key={`${movie.id}-${idx}`}>
            <ContinueWatch
              movie={movie}
              onMovieSelect={onMovieSelect}
              isActive={idx === activeIndex}
            />
          </SwiperSlide>
        ))}
    </Swiper>
  );
}

export default HeroSwiper;

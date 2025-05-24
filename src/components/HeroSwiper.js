import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Featured from "../components/Featured";

function HeroSwiper({ onMovieSelect, featured, onActiveIndexChange }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Swiper
      onSlideChange={(swiper) => {
        setActiveIndex(swiper.activeIndex);
        onActiveIndexChange?.(swiper.activeIndex);
      }}
      slidesPerView={1}
      spaceBetween={10}
      centeredSlides={false}
      className="player-swiper"
      pagination={{
        clickable: true, // делает точки кликабельными
      }}
    >
      {featured &&
        featured.map((movie, idx) => (
          <SwiperSlide key={`${movie.id}-${idx}`}>
            <Featured
              movie={movie}
              onMovieSelect={onMovieSelect}
              isActive={idx === activeIndex}
              resetTrigger={activeIndex}
            />
          </SwiperSlide>
        ))}
    </Swiper>
  );
}

export default HeroSwiper;

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import CollectionCard from "./CollectionCard";
import "swiper/css";
import "../styles/MovieCardSwiper.css";

function CollectionsSwiper({ data, title, navigate_to }) {
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
      </div>

      <Swiper
        style={{ marginTop: "20px" }}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 2.2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {data?.map((collection) => (
          <SwiperSlide key={collection.id}>
            <CollectionCard collection={collection} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default CollectionsSwiper;

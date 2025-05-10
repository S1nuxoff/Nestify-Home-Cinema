import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { getPage } from "../api/htttp/hdrezka";
import HaVideoCard from "../components/HaVideoCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HaSlider.css";

function HaSlider({ onMovieSelect }) {
  const [page, setPage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPage();
        setPage(data);
      } catch (error) {
        console.error("Error fetching main page data:", error);
      }
    };
    fetchData();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // показує 1 картку на екрані
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
  };

  return (
    <div className="page-container">
      <Slider {...settings}>
        {page &&
          page.map((movie) => (
            <div key={movie.id} className="slider-card-wrapper">
              <HaVideoCard
                className="video-card-container-ha"
                movie={movie}
                onMovieSelect={onMovieSelect}
              />
            </div>
          ))}
      </Slider>
    </div>
  );
}

export default HaSlider;

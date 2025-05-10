// src/components/MoviePopup.js
import React, { useState, useEffect } from "react";
import { ReactComponent as StarIcon } from "../assets/icons/star.svg";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";
import { ReactComponent as PlayIcon } from "../assets/icons/play.svg";
import { ReactComponent as DropIcon } from "../assets/icons/drop-down.svg";
import { ReactComponent as VolumeMute } from "../assets/icons/volume-mute.svg";
import { ReactComponent as VolumeOne } from "../assets/icons/volume-one.svg";
import ReactPlayer from "react-player/youtube";
import TranslatorItem from "./TranslatorItem";
import EpisodeSelectorItem from "./EpisodeSelectorItem";
import { SkeletonLine, SkeletonPoster } from "./Skeleton";
import useMovieDetails from "../hooks/useMovieDetails";
import useMovieSource from "../hooks/useMovieSource";
import "../styles/MoviePopup.css";

const MoviePopup = ({ movie, onClose }) => {
  const [selectedTranslatorId, setSelectedTranslatorId] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const toggleMute = () => {
    setIsMuted(!isMuted);
    setIsVisible(!isVisible);
  };
  useEffect(() => {
    if (movie?.translator_id) {
      setSelectedTranslatorId(movie.translator_id);
    }
    if (movie?.season) {
      setSelectedSeason(movie.season);
    }
    if (movie?.episode) {
      setSelectedEpisode(movie.episode);
    }
  }, [movie]);

  useEffect(() => {
    if (movie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [movie]);

  // Загружаем детали фильма через кастомный хук
  const { movieDetails, loading } = useMovieDetails(
    movie?.filmLink || movie?.link
  );

  // По умолчанию выбираем первый сезон, если есть расписание эпизодов
  useEffect(() => {
    if (!loading && movieDetails?.episodes_schedule?.length > 0) {
      setSelectedSeason(movieDetails.episodes_schedule[0].season_number);
    }
  }, [loading, movieDetails]);

  // Получаем функцию для воспроизведения источника через хук
  const { playMovieSource } = useMovieSource();

  const handlePlayUrl = async () => {
    const success = await playMovieSource({
      seasonId: selectedSeason,
      episodeId: selectedEpisode,
      movieId: movieDetails.id,
      translatorId: selectedTranslatorId,
      action: movieDetails.action,
    });
    if (success) {
      setSelectedTranslatorId(null);
      setSelectedSeason(null);
      setSelectedEpisode(null);
      onClose();
      await fetch("http://192.168.0.15:8000/api/v1/session/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieDetails.id,
          position: 0,
          translator_id: selectedTranslatorId,
          season_id: selectedSeason,
          episode_id: selectedEpisode,
        }),
      });
    }
  };

  const toggleSeasonDropdown = () => {
    setIsSeasonDropdownOpen((prev) => !prev);
  };

  const handleSelectSeason = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    setIsSeasonDropdownOpen(false);
    setSelectedEpisode(null);
  };

  const handleSelectEpisode = (episodeNumber) => {
    setSelectedEpisode(episodeNumber);
  };

  if (!movie) return null;
  console.log(movieDetails);
  return (
    <>
      {" "}
      <div className="movie-modal__overlay" onClick={onClose}></div>
      <div className="movie-modal-wrapper" onClick={onClose}>
        <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
          {loading ? (
            <div className="movie-modal__content">
              <button className="movie-modal__close-btn" onClick={onClose}>
                <CloseIcon style={{ cursor: "pointer" }} />
              </button>
              <div className="movie-modal__header">
                <div className="movie-modal__header-details">
                  <SkeletonLine width="60%" height="28px" />
                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "8px" }}
                  >
                    <SkeletonLine width="50%" />
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <SkeletonLine width="133px" height="40px" />
                  </div>
                </div>
                <div className="movie-modal__poster-container">
                  <SkeletonPoster />
                </div>
              </div>
              <div
                className="movie-modal__details"
                style={{ marginTop: "16px" }}
              >
                <div className="movie-modal__details-container">
                  <div className="movie-modal__left">
                    <SkeletonLine width="30%" height="22px" />
                    <SkeletonLine width="100%" height="195px" />
                  </div>
                  <div className="movie-modal__right">
                    <SkeletonLine width="30%" height="22px" />
                    <SkeletonLine width="100%" />
                    <SkeletonLine width="90%" />
                    <SkeletonLine width="80%" />
                    <SkeletonLine width="40%" height="22px" />
                    <div
                      style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
                    >
                      <SkeletonLine width="80px" height="24px" />
                      <SkeletonLine width="80px" height="24px" />
                      <SkeletonLine width="80px" height="24px" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : movieDetails ? (
            <>
              <div className="movie-modal__content">
                <button className="movie-modal__close-btn" onClick={onClose}>
                  <CloseIcon style={{ cursor: "pointer" }} />
                </button>
                <div className="movie-modal__header">
                  <span></span>
                  <div className="movie-modal__header-details">
                    <h1 className="movie-modal__title">{movieDetails.title}</h1>
                    <div className="movie-modal__info">
                      <span className="movie-modal__origin">
                        {movieDetails.origin_name || movieDetails.title}
                      </span>
                      <span className="movie-modal__rating">
                        {Math.round(movieDetails.rate)}
                        <StarIcon />
                      </span>
                      <span className="movie-modal__duration">
                        {movieDetails.duration}
                      </span>
                    </div>
                    <div className="movie-modal__controls">
                      <div
                        className="movie-modal__play-button"
                        onClick={handlePlayUrl}
                      >
                        <PlayIcon /> Play
                      </div>
                      {movieDetails?.trailer && (
                        <div
                          className="movie-modal__continue-volume-btn"
                          onClick={toggleMute}
                        >
                          {isMuted ? (
                            <VolumeMute className="continue-volume-icon" />
                          ) : (
                            <VolumeOne className="continue-volume-icon" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="movie-modal__poster-container">
                    {movieDetails?.trailer ? (
                      <>
                        <div className="movie-modal__youtube-player-container">
                          <div
                            className={`youtube-player-overlay ${
                              isVisible ? "" : "hidden"
                            }`}
                          ></div>
                          <ReactPlayer
                            className="movie-modal__youtube-player"
                            loop
                            rel="0"
                            url={movieDetails.trailer}
                            playing={false} // автозапуск: true/false
                            controls={false} // убрать интерфейс
                            muted={isMuted}
                            width="100%"
                            height="100%"
                            volume={0.1}
                            config={{
                              youtube: {
                                playerVars: {
                                  autoplay: 1,
                                  modestbranding: 1,
                                  rel: 0,
                                  controls: 0,
                                  showinfo: 0,
                                  fs: 0,
                                  disablekb: 1,
                                },
                              },
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <div
                        className="movie-modal__poster-vignette"
                        style={{
                          backgroundImage: `url(${movieDetails.image})`,
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div className="movie-modal__details">
                  <div className="movie-modal__details-container">
                    <div className="movie-modal__details-top">
                      <span className="movie-modal__release-date">
                        {movieDetails.release_date}
                      </span>

                      {movieDetails.age === null ? (
                        <div></div>
                      ) : (
                        <span className="movie-modal__age">
                          {movieDetails.age}
                        </span>
                      )}
                    </div>
                    <div className="movie-modal__description-container">
                      <p className="movie-modal__description">
                        {movieDetails.description}
                      </p>
                      <div className="movie-modal_infotable">
                        <div className="movie-modal__infotable-item">
                          <span className="movie-modal__infotable-lable">
                            Genre:
                          </span>
                          {Array.isArray(movieDetails.genre) ? (
                            movieDetails.genre.length > 1 ? (
                              movieDetails.genre.map((genre, index) => (
                                <span
                                  key={index}
                                  className="movie-modal__infotable-value"
                                >
                                  {genre}
                                  {index < movieDetails.genre.length - 1
                                    ? ", "
                                    : ""}
                                </span>
                              ))
                            ) : (
                              <span className="movie-modal__infotable-value">
                                {movieDetails.genre[0]}
                              </span>
                            )
                          ) : (
                            <span className="movie-modal__infotable-value">
                              {movieDetails.genre}
                            </span>
                          )}
                        </div>
                        <div className="movie-modal__infotable-item">
                          <span className="movie-modal__infotable-lable">
                            Country:
                          </span>
                          {Array.isArray(movieDetails.country) ? (
                            movieDetails.country.length > 1 ? (
                              movieDetails.country.map((country, index) => (
                                <span
                                  key={index}
                                  className="movie-modal__infotable-value"
                                >
                                  {country}
                                  {index < movieDetails.country.length - 1
                                    ? ", "
                                    : ""}
                                </span>
                              ))
                            ) : (
                              <span className="movie-modal__infotable-value">
                                {movieDetails.country[0]}
                              </span>
                            )
                          ) : (
                            <span className="movie-modal__infotable-value">
                              {movieDetails.country}
                            </span>
                          )}
                        </div>
                        <div className="movie-modal__infotable-item">
                          <span className="movie-modal__infotable-lable">
                            Director:
                          </span>
                          {Array.isArray(movieDetails.director) ? (
                            movieDetails.director.length > 1 ? (
                              movieDetails.director.map((director, index) => (
                                <span
                                  key={index}
                                  className="movie-modal__infotable-value"
                                >
                                  {director}
                                  {index < movieDetails.director.length - 1
                                    ? ", "
                                    : ""}
                                </span>
                              ))
                            ) : (
                              <span className="movie-modal__infotable-value">
                                {movieDetails.director[0]}
                              </span>
                            )
                          ) : (
                            <span className="movie-modal__infotable-value">
                              {movieDetails.director}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="movie-modal__translators">
                      <span className="movie-modal__section-title">
                        Sound Tracks
                      </span>
                      <div className="movie-modal__translators-container">
                        {movieDetails.translator_ids.map((translator) => (
                          <TranslatorItem
                            key={translator.id}
                            translator={translator}
                            isSelected={selectedTranslatorId === translator.id}
                            onSelect={setSelectedTranslatorId}
                          />
                        ))}
                      </div>
                    </div>
                    {movieDetails.action === "get_stream" && (
                      <div className="movie-modal__episodes">
                        <div className="movie-modal__season-selector-container">
                          <span className="movie-modal__section-title">
                            Episodes
                          </span>
                          <div
                            className="movie-modal__season-selector"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              className="season-selector__current"
                              onClick={toggleSeasonDropdown}
                            >
                              {selectedSeason
                                ? `Season ${selectedSeason}`
                                : "Select Season"}
                              <DropIcon />
                            </div>
                            {isSeasonDropdownOpen && (
                              <div className="season-selector__list">
                                {movieDetails.episodes_schedule.map(
                                  (season) => (
                                    <div
                                      key={season.season_number}
                                      className="season-selector__item"
                                      onClick={() =>
                                        handleSelectSeason(season.season_number)
                                      }
                                    >
                                      <span className="season-selector__item-title">
                                        Season {season.season_number}
                                      </span>
                                      <span className="season-selector__item-count">
                                        ({season.episodes.length} Episodes)
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="movie-modal__episodes-container">
                          {movieDetails.episodes_schedule
                            .filter(
                              (season) =>
                                season.season_number === selectedSeason
                            )
                            .map((season) =>
                              season.episodes.map((ep) => (
                                <EpisodeSelectorItem
                                  key={ep.episode_id}
                                  episde_date={ep.air_date}
                                  episde_id={ep.episode_number}
                                  episde_title={ep.title}
                                  episde_origin={ep.original_title}
                                  isSelected={
                                    selectedEpisode === ep.episode_number
                                  }
                                  onSelect={handleSelectEpisode}
                                />
                              ))
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Нет данных</p>
          )}
        </div>
      </div>
    </>
    // </div>
  );
};

export default MoviePopup;

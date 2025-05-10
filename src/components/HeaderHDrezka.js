import React from "react";
import { useMediaQuery } from "react-responsive";
import { ReactComponent as Logo } from "../assets/icons/logo.svg";
import { ReactComponent as SettingsIcon } from "../assets/icons/settings.svg";
import HeaderMenu from "./HeaderMenu";
import "../styles/Header.css";
import Search from "./Search";

const HeaderHDrezka = ({ onSearch, onMovieSelect }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 680px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 680px) and (max-width: 1199px)",
  });

  return (
    <header
      className={
        isMobile
          ? "header-mobile"
          : isTablet
          ? "header-tablet"
          : "header-desktop"
      }
    >
      {isMobile ? (
        <div className="header-container">
          <div className="header-top-row">
            <a href="/">
              <Logo className="header-logo" />
            </a>
            <div className="small-40-btn">
              <SettingsIcon />
            </div>
          </div>
          <HeaderMenu />
          <Search onSearch={onSearch} onMovieSelect={onMovieSelect} />
        </div>
      ) : isTablet ? (
        <div className="header-container tablet-layout">
          <div className="header-top-row">
            <a href="/">
              <Logo className="header-logo" />
            </a>
            <Search onSearch={onSearch} onMovieSelect={onMovieSelect} />
            <div className="small-40-btn">
              <SettingsIcon />
            </div>
          </div>
          <HeaderMenu />
        </div>
      ) : (
        <>
          <a href="/">
            <Logo className="header-logo" />
          </a>
          <Search onSearch={onSearch} onMovieSelect={onMovieSelect} />
          <HeaderMenu />

          <div className="small-40-btn">
            <SettingsIcon />
          </div>
        </>
      )}
    </header>
  );
};

export default HeaderHDrezka;

import React, { useState, useRef } from "react";
import { ReactComponent as Logo } from "../assets/icons/logo.svg";
import { ReactComponent as Search } from "../assets/icons/search.svg";
import DeviceSelector from "./DeviceSelector";
import HeaderMenu from "./HeaderMenu";
import "../styles/Header.css";

const HeaderHDrezka = ({ onSearch }) => {
  return (
    <header>
      <a href="/">
        {" "}
        <Logo className="header-logo" />
      </a>
      <HeaderMenu className="header-menu" />

      <div className="header-buttons">
        <DeviceSelector />
      </div>
    </header>
  );
};

export default HeaderHDrezka;

// HeaderMenu.jsx
import React from "react";
import "../styles/HeaderMenu.css";

function HeaderMenu({ onMenuSelect }) {
  return (
    <ul className="header-menu">
      <li
        className="header-menu-item header-menu-items-active"
        onClick={() => onMenuSelect("home")}
      >
        <a href="/">Home</a>
      </li>
      <li className="header-menu-item" onClick={() => onMenuSelect("films")}>
        <a href="/films">Фильмы</a>
      </li>
      <li className="header-menu-item" onClick={() => onMenuSelect("series")}>
        <a href="/series">Сериалы</a>
      </li>
      <li
        className="header-menu-item"
        onClick={() => onMenuSelect("animation")}
      >
        <a href="/hdrezka">Аниме</a>
      </li>
      <li className="header-menu-item" onClick={() => onMenuSelect("cartoons")}>
        <a href="/hdrezka">Мультфильмы</a>
      </li>
    </ul>
  );
}

export default HeaderMenu;

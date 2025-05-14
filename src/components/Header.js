import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { ReactComponent as Logo } from "../assets/icons/logo.svg";
import { ReactComponent as SettingsIcon } from "../assets/icons/settings.svg";
import HeaderMenu from "./HeaderMenu";
import "../styles/Header.css";
import Search from "./Search";
import { getUsers } from "../api/utils";
import { useNavigate } from "react-router-dom";
import config from "../core/config";

const Header = ({ currentUser, onSearch, onMovieSelect }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 680px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 680px) and (max-width: 1199px)",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setAllUsers(data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSwitch = (user) => {
    localStorage.setItem("current_user", JSON.stringify(user));
    window.location.reload(); // перезагрузка
  };

  const handleLogout = () => {
    localStorage.removeItem("current_user");
    navigate("/login");
  };

  const renderUserAvatar = () => (
    <div className="header-user__container" style={{ position: "relative" }}>
      <div
        className="header-user__avatar-container"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <img
          src={`${config.backend_url}${currentUser.avatar_url}`}
          alt="user-avatar"
          className="header-user__avatar"
        />
      </div>

      {isDropdownOpen && (
        <div className="header-user__dropdown under-avatar">
          <div className="dropdown-users-list">
            {allUsers.map((user) => (
              <div
                key={user.id}
                className="dropdown-user"
                onClick={() => handleUserSwitch(user)}
              >
                <img
                  src={`${config.backend_url}${user.avatar_url}`}
                  alt={user.name}
                  className="dropdown-user-avatar"
                />
                <span className="header-dropdown__user-name">{user.name}</span>
              </div>
            ))}
          </div>

          <button
            className="dropdown-button"
            onClick={() => navigate("/settings")}
          >
            Settings
          </button>
          <button className="dropdown-button logout" onClick={handleLogout}>
            Exit
          </button>
        </div>
      )}
    </div>
  );

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
            {renderUserAvatar()}
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
            {renderUserAvatar()}
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
          {renderUserAvatar()}
        </>
      )}
    </header>
  );
};

export default Header;

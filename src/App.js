import React, { useState, useEffect } from "react";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Category from "./pages/Category";
import HistoryPage from "./pages/HistoryPage";
// import Series from "./pages/Series";
// import Films from "./pages/Films";
import Login from "./pages/Login";
import Player from "./pages/Player";
import CreateUser from "./pages/CreateUser";
import kodiWebSocket from "./api/ws/kodiWebSocket";
import CollectionsPage from "./pages/CollectionsPage";
import HaPlayer from "./pages/HaPlayer";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/App.css";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

function App() {
  const currentUser = JSON.parse(localStorage.getItem("current_user"));

  useEffect(() => {
    kodiWebSocket.init();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/player/:movieId"
          element={
            <PrivateRoute>
              <Player />
            </PrivateRoute>
          }
        />
      </Routes>
      <div style={{ position: "relative", zIndex: 1 }} className="App">
        {/* <div className="container"> */}
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home currentUser={currentUser} />
              </PrivateRoute>
            }
          />
          <Route
            path="/movie/:movieId"
            element={
              <PrivateRoute>
                <Home currentUser={currentUser} />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchPage currentUser={currentUser} />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/*"
            element={
              <PrivateRoute>
                <Category currentUser={currentUser} />
              </PrivateRoute>
            }
          />
          <Route
            path="/collections"
            element={
              <PrivateRoute>
                <CollectionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            }
          />
          {/* <Route
              path="/player/:movieId"
              element={
                <PrivateRoute>
                  <Player />
                </PrivateRoute>
              }
            /> */}

          <Route path="/login" element={<Login />} />
          <Route path="/login/create/user" element={<CreateUser />} />
        </Routes>
      </div>
      {/* </div> */}
    </>
  );
}

export default App;

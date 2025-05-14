import React, { useState, useEffect } from "react";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
// import Series from "./pages/Series";
// import Films from "./pages/Films";
import Login from "./pages/Login";
import Player from "./pages/Player";
import CreateUser from "./pages/CreateUser";
import kodiWebSocket from "./api/ws/kodiWebSocket";
import HaPlayer from "./pages/HaPlayer";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/App.css";

function App() {
  const currentUser = JSON.parse(localStorage.getItem("current_user"));

  useEffect(() => {
    kodiWebSocket.init();
  }, []);

  return (
    <div style={{ position: "relative", zIndex: 1 }} className="App">
      <div className="container">
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
            path="/player/:movieId"
            element={
              <PrivateRoute>
                <Player />
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/login/create/user" element={<CreateUser />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

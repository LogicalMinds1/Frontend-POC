import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from './Homepage/Header.js';
import Footer from './Homepage/Fooder.js';
import Login from "../src/Login/MotherLogin.js";
import HomePage from "./Home.js";
import Pregnancypost from "./Component/Pregnancypost.js";
import Pregreportuplode from "./Component/Pregreportuplode.js"

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleSetToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("mother_id");
    }
    setToken(newToken);
  };

  return (
    <Router>
      {token && <Header setToken={handleSetToken} />} {/* Show Header only if logged in */}
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/home" replace /> : <Login setToken={handleSetToken} />}
        />
        <Route
          path="/home"
          element={token ? <HomePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/Pregnancypost"
          element={token ? <Pregnancypost /> : <Navigate to="/" replace />}
        />
        <Route
          path="/PregnancyUpload"
          element={token ? <Pregreportuplode /> : <Navigate to="/" replace />}
        />
      </Routes>
      {token && <Footer />} 
    </Router>
  );
};

export default App;

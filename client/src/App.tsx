import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//redux
import { Provider } from "react-redux";
import store from "redux";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <>
          <Navbar />

          <section className="container">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </section>
        </>
      </Router>
    </Provider>
  );
};

export default App;

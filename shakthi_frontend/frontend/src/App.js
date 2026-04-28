import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

import { LangProvider } from "./context/LangContext"; // ✅ added

import Home from "./pages/Home";
import About from "./pages/About";
import Scanner from "./pages/Scanner";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

const ProtectedScanner = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (!token && !user) return <Navigate to="/register" />;
  if (!token && user) return <Navigate to="/login" />;
  return <Scanner />;
};

function App() {
  return (
    <LangProvider> {/* ✅ wraps everything so all components get lang */}
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/scanner" element={<ProtectedScanner />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </LangProvider>
  );
}

export default App;
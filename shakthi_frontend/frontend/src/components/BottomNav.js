import React from "react";
import { Link, useLocation } from "react-router-dom";

function BottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${isActive("/")}`}>
        <i>🏠</i>
        <span>Home</span>
      </Link>
      <Link to="/about" className={`nav-item ${isActive("/about")}`}>
        <i>ℹ️</i>
        <span>About</span>
      </Link>
      <div className="nav-scanner-container">
        <Link to="/scanner" className="nav-item-scanner">
          <i>🪪</i>
        </Link>
      </div>
      <Link to="/contact" className={`nav-item ${isActive("/contact")}`}>
        <i>📞</i>
        <span>Contact</span>
      </Link>
      <Link to="/login" className={`nav-item ${isActive("/login")}`}>
        <i>👤</i>
        <span>Profile</span>
      </Link>
    </div>
  );
}

export default BottomNav;

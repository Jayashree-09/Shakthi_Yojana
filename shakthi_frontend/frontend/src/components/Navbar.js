import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLangChange = (e) => {
    if (e.target.value !== lang) toggleLang();
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  const links = [
    { to: "/", label: lang === "en" ? "Home" : "ಮುಖಪುಟ" },
    { to: "/about", label: lang === "en" ? "About" : "ಬಗ್ಗೆ" },
    { to: "/scanner", label: lang === "en" ? "Scan Aadhaar" : "ಆಧಾರ್ ಸ್ಕ್ಯಾನ್", cls: "btn-scan" },
    { to: "/contact", label: lang === "en" ? "Contact" : "ಸಂಪರ್ಕ" },
  ];

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">🏛️</div>
          <div>
            <div className="navbar-title">Shakthi Yojana</div>
          </div>
        </Link>

        <ul className="navbar-links">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={`${l.cls || ""} ${isActive(l.to)}`}>
                {l.label}
              </Link>
            </li>
          ))}

          <li>
            <select
              value={lang}
              onChange={handleLangChange}
              className="lang-select"
            >
              <option value="en">🇬🇧 EN</option>
              <option value="kn">🇮🇳 KN</option>
            </select>
          </li>

          {token ? (
            <>
              <li>
                <Link to="/admin" className="nav-admin-link">
                  Admin ↗
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  {lang === "en" ? "Logout" : "ಲಾಗ್ ಔಟ್"}
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="nav-login-link">
                {lang === "en" ? "Login" : "ಲಾಗಿನ್"}
              </Link>
            </li>
          )}
        </ul>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
        {token && <Link to="/admin">Admin Dashboard</Link>}
        <div className="mobile-actions">
           <select value={lang} onChange={handleLangChange} className="lang-select-mobile">
              <option value="en">English</option>
              <option value="kn">ಕನ್ನಡ</option>
           </select>
           {token ? (
             <button onClick={handleLogout} className="btn-logout-mobile">Logout</button>
           ) : (
             <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
           )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
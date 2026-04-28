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

  // ✅ Dropdown handler
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
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">🏛️</div>
          <div>
            <div className="navbar-title">Shakthi Yojana</div>
            <div className="navbar-subtitle">Karnataka Government</div>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar-links">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={`${l.cls || ""} ${isActive(l.to)}`}>
                {l.label}
              </Link>
            </li>
          ))}

          {/* ✅ Language Dropdown */}
          <li>
            <select
              value={lang}
              onChange={handleLangChange}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.35)",
                color: "white",
                padding: "7px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                outline: "none",
                appearance: "none",
                WebkitAppearance: "none",
                paddingRight: "28px",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
              }}
            >
              <option value="en" style={{ background: "#1e3a5f", color: "white" }}>
                🇬🇧 English
              </option>
              <option value="kn" style={{ background: "#1e3a5f", color: "white" }}>
                🇮🇳 ಕನ್ನಡ
              </option>
            </select>
          </li>

          {token ? (
            <>
              <li>
                <Link to="/admin" style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", padding: "8px 14px" }}>
                  Admin ↗
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} style={{ background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}>
                  {lang === "en" ? "Logout" : "ಲಾಗ್ ಔಟ್"}
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", padding: "8px 14px" }}>
                {lang === "en" ? "Login" : "ಲಾಗಿನ್"}
              </Link>
            </li>
          )}
        </ul>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}

        {/* ✅ Mobile Language Dropdown */}
        <div style={{ padding: "4px 0" }}>
          <select
            value={lang}
            onChange={(e) => { handleLangChange(e); setMenuOpen(false); }}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              padding: "12px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              outline: "none",
            }}
          >
            <option value="en" style={{ background: "#1e3a5f", color: "white" }}>🇬🇧 English</option>
            <option value="kn" style={{ background: "#1e3a5f", color: "white" }}>🇮🇳 ಕನ್ನಡ</option>
          </select>
        </div>

        {token ? (
          <button
            onClick={() => { handleLogout(); setMenuOpen(false); }}
            style={{ background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "12px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", textAlign: "left" }}
          >
            {lang === "en" ? "Logout" : "ಲಾಗ್ ಔಟ್"}
          </button>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            {lang === "en" ? "Login" : "ಲಾಗಿನ್"}
          </Link>
        )}
      </div>
    </>
  );
}

export default Navbar;
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="tricolor-bar" />
      <div className="footer-grid">
        <div>
          <h4>Shakthi Yojana</h4>
          <p>A Karnataka Government initiative to empower women through digital Aadhaar-based verification and scheme benefits.</p>
          <p style={{ marginTop: "12px", color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>
            ಶಕ್ತಿ ಯೋಜನೆ — ಕರ್ನಾಟಕ ಸರ್ಕಾರ
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About the Scheme</Link>
          <Link to="/scanner">Aadhaar Scanner</Link>
          <Link to="/contact">Contact & Help</Link>
        </div>

        <div>
          <h4>For Field Workers</h4>
          <Link to="/login">Worker Login</Link>
          <a href="http://localhost:3001" target="_blank" rel="noreferrer">Admin Panel ↗</a>
        </div>

        <div>
          <h4>Contact</h4>
          <p>📞 1800-425-9339 (Toll Free)</p>
          <p>✉️ shakthi@karnataka.gov.in</p>
          <p>🏛️ Vidhana Soudha, Bengaluru</p>
          <p>Karnataka — 560001</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Shakthi Yojana — Government of Karnataka. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
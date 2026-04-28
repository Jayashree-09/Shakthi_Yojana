import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function Home() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScans: 0,
    validScans: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/admin/stats", {   // ✅ FIXED HERE
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data);
      } catch (error) {
        console.log("Stats Error:", error.response?.data || error.message);
      }
    };

    fetchStats();
  }, []);

  const features = [
    { icon: "🪪", title: "Instant Aadhaar Scan", kannada: "ತಕ್ಷಣ ಆಧಾರ್ ಸ್ಕ್ಯಾನ್", desc: "Scan Aadhaar cards using your device camera with OCR technology for instant recognition." },
    { icon: "🔊", title: "Voice Announcement", kannada: "ಧ್ವನಿ ಘೋಷಣೆ", desc: "Automatic voice announcement confirms eligibility — 'This woman belongs to Karnataka, Aadhaar is valid.'" },
    { icon: "✅", title: "Karnataka Verification", kannada: "ಕರ್ನಾಟಕ ಪರಿಶೀಲನೆ", desc: "Instantly verifies if the beneficiary belongs to Karnataka and is eligible for the scheme." },
    { icon: "📊", title: "Real-time Dashboard", kannada: "ನೈಜ-ಸಮಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", desc: "Admin dashboard with live stats, scan logs, and reports for full transparency." },
    { icon: "📱", title: "Mobile Friendly", kannada: "ಮೊಬೈಲ್ ಸ್ನೇಹಿ", desc: "Works on any device — phone, tablet, or computer. No special hardware required." },
    { icon: "🔒", title: "Secure & Private", kannada: "ಸುರಕ್ಷಿತ ಮತ್ತು ಖಾಸಗಿ", desc: "All data is encrypted and securely stored. Compliant with government data standards." },
  ];

  const steps = [
    { n: "1", title: "Open Scanner", kannada: "ಸ್ಕ್ಯಾನರ್ ತೆರೆಯಿರಿ", desc: "Field worker opens the Aadhaar Scanner page on any device." },
    { n: "2", title: "Scan / Enter Aadhaar", kannada: "ಆಧಾರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", desc: "Point camera at the Aadhaar card or enter the number manually." },
    { n: "3", title: "Instant Verification", kannada: "ತಕ್ಷಣ ಪರಿಶೀಲನೆ", desc: "System checks if the person belongs to Karnataka and is registered." },
    { n: "4", title: "Voice Result", kannada: "ಧ್ವನಿ ಫಲಿತಾಂಶ", desc: "Voice announces the result clearly for everyone to hear." },
  ];

  return (
    <>
      <Navbar />
      <div className="page-wrapper">

        {/* HERO */}
        <section className="hero">
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="hero-tricolor" style={{ maxWidth: "200px", margin: "0 auto 32px" }} />
            <div className="hero-badge">
              <span>🏛️</span>
              <span>Karnataka Government Initiative</span>
            </div>
            <h1>
              Shakthi Yojana<br />
              <span>Aadhaar Verification</span>
            </h1>
            <p className="hero-kannada">ಶಕ್ತಿ ಯೋಜನೆ — ಮಹಿಳಾ ಸಬಲೀಕರಣ</p>
            <p className="hero-desc">
              Digital Aadhaar-based verification system for Karnataka's women empowerment scheme.
            </p>
            <div className="hero-buttons">
              <Link to="/scanner" className="btn-primary">🪪 Scan Aadhaar Now</Link>
              <Link to="/about" className="btn-secondary">Learn More →</Link>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="stats-bar" style={{ background: "var(--navy-mid)" }}>
          <div className="stat-item">
            <h3>{stats.totalUsers || "500+"}+</h3>
            <p>Registered Beneficiaries</p>
          </div>
          <div className="stat-item">
            <h3>{stats.totalScans || "1200+"}+</h3>
            <p>Total Scans Done</p>
          </div>
          <div className="stat-item">
            <h3>{stats.validScans || "980+"}+</h3>
            <p>Valid Verifications</p>
          </div>
          <div className="stat-item">
            <h3>31</h3>
            <p>Districts Covered</p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="section">
          <div className="section-title">
            <h2>Why Shakthi Yojana?</h2>
            <p>Modern system for Karnataka field workers</p>
            <div className="divider" />
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>{f.kannada}</p>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Home;
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  const benefits = [
    { icon: "🚌", title: "Free Bus Travel", desc: "Eligible women get free travel on KSRTC buses across Karnataka." },
    { icon: "👩‍⚕️", title: "Healthcare Access", desc: "Priority access to government hospitals and health schemes." },
    { icon: "📚", title: "Education Support", desc: "Educational scholarships and support for women and girls." },
    { icon: "💼", title: "Employment Aid", desc: "Job placement assistance and skill development programs." },
  ];

  const eligibility = [
    "Must be a woman residing in Karnataka",
    "Must have a valid Aadhaar card linked to Karnataka address",
    "Age: 18 years and above",
    "Karnataka state as registered address in Aadhaar",
    "Annual family income within scheme limits",
  ];

  return (
    <>
      <Navbar />
      <div className="page-wrapper">

        {/* About Hero */}
        <div className="about-hero">
          <div className="tricolor-bar" style={{ maxWidth: "160px", margin: "0 auto 28px" }} />
          <h1>About Shakthi Yojana</h1>
          <p style={{ marginTop: "8px" }}>ಶಕ್ತಿ ಯೋಜನೆಯ ಬಗ್ಗೆ — Karnataka's women empowerment scheme</p>
        </div>

        {/* What is it */}
        <div className="section">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "32px", marginBottom: "16px", color: "var(--navy)" }}>
                What is Shakthi Yojana?
              </h2>
              <p style={{ color: "#64748b", lineHeight: "1.8", marginBottom: "14px", fontSize: "15px" }}>
                Shakthi Yojana is a flagship welfare scheme by the Government of Karnataka aimed at empowering women across the state through various benefits and support programs.
              </p>
              <p style={{ color: "#64748b", lineHeight: "1.8", marginBottom: "14px", fontSize: "15px" }}>
                This digital verification system uses Aadhaar cards to quickly confirm eligibility and announce results through voice, making it easy for field workers to verify beneficiaries anywhere.
              </p>
              <p style={{ color: "var(--navy)", fontWeight: "600", fontSize: "15px" }}>
                ಕರ್ನಾಟಕ ಮಹಿಳೆಯರಿಗಾಗಿ ರಾಜ್ಯ ಸರ್ಕಾರದ ಕಲ್ಯಾಣ ಯೋಜನೆ
              </p>
            </div>
            <div style={{ background: "var(--navy)", borderRadius: "20px", padding: "36px", color: "white", border: "2px solid var(--gold)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏛️</div>
              <h3 style={{ color: "var(--gold)", marginBottom: "12px", fontSize: "20px" }}>Government of Karnataka</h3>
              <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: "1.7", fontSize: "14px" }}>
                Launched to ensure that eligible women across all 31 districts of Karnataka receive their entitled benefits quickly and without hassle through a transparent digital system.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div style={{ background: "var(--navy)", padding: "64px 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div className="section-title">
              <h2 style={{ color: "white" }}>Scheme Benefits</h2>
              <p style={{ color: "rgba(255,255,255,0.65)" }}>ಯೋಜನೆಯ ಪ್ರಯೋಜನಗಳು</p>
              <div className="divider" />
            </div>
            <div className="features-grid">
              {benefits.map((b, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>{b.icon}</div>
                  <h3 style={{ color: "var(--gold)", marginBottom: "8px", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600 }}>{b.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", lineHeight: "1.6" }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Eligibility */}
        <div className="section">
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div className="section-title">
              <h2>Eligibility Criteria</h2>
              <p>ಅರ್ಹತಾ ಮಾನದಂಡಗಳು</p>
              <div className="divider" />
            </div>
            <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0" }}>
              {eligibility.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderBottom: i < eligibility.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <div style={{ width: "24px", height: "24px", background: "var(--navy)", color: "var(--gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 }}>
                    ✓
                  </div>
                  <p style={{ color: "#374151", fontSize: "15px", lineHeight: "1.5" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default About;
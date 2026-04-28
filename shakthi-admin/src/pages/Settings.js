import React, { useState } from "react";
import API from "../services/api";

const Settings = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [password, setPassword] = useState({ current: "", newPass: "", confirm: "" });
  const [location, setLocation] = useState(localStorage.getItem("defaultLocation") || "Bengaluru Center");
  const [saved, setSaved] = useState("");

  // ✅ Save default location
  const handleSaveLocation = () => {
    localStorage.setItem("defaultLocation", location);
    setSaved("Default location saved ✅");
    setTimeout(() => setSaved(""), 3000);
  };

  // ✅ Test voice announcement
  const handleTestVoice = () => {
    const text = "This woman belongs to Karnataka. Aadhaar card is valid.";
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px" }}>
      <h2 style={{ marginBottom: "24px" }}>⚙️ Settings</h2>

      {/* ── Admin Info ── */}
      <Section title="👤 Logged In As">
        <InfoRow label="Name" value={user.name || "Admin"} />
        <InfoRow label="Email" value={user.email || "—"} />
        <InfoRow label="Role" value={user.role || "admin"} />
        <InfoRow label="State" value={user.state || "Karnataka"} />
      </Section>

      {/* ── Default Scan Location ── */}
      <Section title="📍 Default Scan Location">
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "10px" }}>
          This location will be pre-filled in the Aadhaar Scanner.
        </p>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Bengaluru Center"
          style={inputStyle}
        />
        <button onClick={handleSaveLocation} style={btnStyle}>
          💾 Save Location
        </button>
        {saved && <p style={{ color: "green", marginTop: "8px" }}>{saved}</p>}
      </Section>

      {/* ── Voice Test ── */}
      <Section title="🔊 Voice Announcement">
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "10px" }}>
          Test how the voice announcement sounds on this device.
        </p>
        <button onClick={handleTestVoice} style={{ ...btnStyle, background: "#6366f1" }}>
          🔊 Play Test Announcement
        </button>
      </Section>

      {/* ── App Info ── */}
      <Section title="ℹ️ App Info">
        <InfoRow label="App Name" value="Shakthi Yojana Admin Panel" />
        <InfoRow label="Version" value="1.0.0" />
        <InfoRow label="Backend" value="http://localhost:5000" />
        <InfoRow label="Purpose" value="Aadhaar Verification — Karnataka Scheme" />
      </Section>
    </div>
  );
};

// ── Reusable Section ──
function Section({ title, children }) {
  return (
    <div style={{
      background: "white", borderRadius: "12px", padding: "20px",
      marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      border: "1px solid #e5e7eb"
    }}>
      <h3 style={{ marginBottom: "16px", color: "#1f2937", fontSize: "16px" }}>{title}</h3>
      {children}
    </div>
  );
}

// ── Reusable Info Row ──
function InfoRow({ label, value }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      padding: "8px 0", borderBottom: "1px solid #f3f4f6"
    }}>
      <span style={{ color: "#6b7280", fontSize: "14px" }}>{label}</span>
      <span style={{ color: "#111827", fontWeight: "500", fontSize: "14px" }}>{value}</span>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px", borderRadius: "8px",
  border: "1px solid #d1d5db", fontSize: "14px",
  marginBottom: "10px", boxSizing: "border-box"
};

const btnStyle = {
  padding: "10px 20px", borderRadius: "8px", border: "none",
  background: "#2563eb", color: "white", cursor: "pointer",
  fontWeight: "600", fontSize: "14px"
};

export default Settings;
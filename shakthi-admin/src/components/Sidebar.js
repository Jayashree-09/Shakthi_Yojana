import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = [
    { to: "/dashboard", label: "📊 Dashboard" },
    { to: "/scanner",   label: "🪪 Aadhaar Scanner" },
    { to: "/users",     label: "👥 Users" },
    { to: "/logs",      label: "📋 Logs" },
    { to: "/reports",   label: "📈 Reports" },
    { to: "/settings",  label: "⚙️ Settings" },
  ];

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "#1f2937",
      color: "white",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}>

      {/* Header */}
      <div style={{
        padding: "16px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "56px",
      }}>
        <span style={{ fontWeight: "700", fontSize: "15px" }}>Admin Panel</span>

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="sidebar-close-btn"
          style={{
            background: "none", border: "none",
            color: "rgba(255,255,255,0.7)", fontSize: "22px",
            cursor: "pointer", lineHeight: 1, padding: "0",
          }}
        >
          ✕
        </button>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              style={{
                display: "block",
                padding: "11px 14px",
                marginBottom: "4px",
                borderRadius: "8px",
                color: active ? "#93c5fd" : "rgba(255,255,255,0.82)",
                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                textDecoration: "none",
                fontWeight: active ? "700" : "400",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 10px 20px" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "11px",
            background: "#dc2626", color: "white",
            border: "none", borderRadius: "8px",
            cursor: "pointer", fontWeight: "600",
            fontSize: "14px",
          }}
        >
          🚪 Logout
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sidebar-close-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
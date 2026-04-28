import React, { useState } from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        height: "100vh",
        width: "220px",
        zIndex: 50,
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
      }}
        className="sidebar-drawer"
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main Content ── */}
      <div className="main-content-area">

        {/* ── Top Navbar with Hamburger ── */}
        <div style={{
          background: "#1f2937",
          color: "white",
          padding: "0 16px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          position: "sticky",
          top: 0,
          zIndex: 30,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}>
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hamburger-btn"
            style={{
              background: "none", border: "none",
              cursor: "pointer", padding: "4px",
              display: "flex", flexDirection: "column",
              gap: "5px",
            }}
          >
            <span style={{ display: "block", width: "22px", height: "2px", background: "white", borderRadius: "2px" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "white", borderRadius: "2px" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "white", borderRadius: "2px" }} />
          </button>

          <span style={{ fontWeight: "700", fontSize: "16px" }}>
            🏛️ Shakthi Yojana Admin
          </span>
        </div>

        {/* ── Page Content ── */}
        <div style={{ padding: "16px", flex: 1 }}>
          {children}
        </div>
      </div>

      <style>{`
        /* Desktop: sidebar always visible */
        @media (min-width: 768px) {
          .sidebar-drawer {
            transform: translateX(0) !important;
            position: fixed !important;
          }
          .main-content-area {
            margin-left: 220px !important;
          }
          .hamburger-btn {
            display: none !important;
          }
        }

        /* Mobile: sidebar hidden by default */
        @media (max-width: 767px) {
          .main-content-area {
            margin-left: 0 !important;
            width: 100% !important;
          }
          .sidebar-drawer {
            width: 240px !important;
          }
        }

        .main-content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}

export default Layout;
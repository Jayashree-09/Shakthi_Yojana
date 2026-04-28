import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalScans: 0, validScans: 0, invalidScans: 0 });

  useEffect(() => {
    API.get("/admin/stats")
      .then((res) => setStats(res.data || {}))
      .catch((err) => console.log("Stats Error:", err));
  }, []);

  const pieData = {
    labels: ["Valid", "Invalid"],
    datasets: [{ data: [stats.validScans, stats.invalidScans], backgroundColor: ["#10b981", "#ef4444"], borderWidth: 1 }],
  };

  const barData = {
    labels: ["Users", "Scans"],
    datasets: [{ label: "System Data", data: [stats.totalUsers, stats.totalScans], backgroundColor: ["#6366f1", "#0ea5e9"] }],
  };

  const cards = [
    { title: "Total Users", value: stats.totalUsers, color: "#6366f1" },
    { title: "Total Scans", value: stats.totalScans, color: "#0ea5e9" },
    { title: "Valid Scans", value: stats.validScans, color: "#10b981" },
    { title: "Invalid Scans", value: stats.invalidScans, color: "#ef4444" },
  ];

  return (
    <div style={{ padding: "4px 0" }}>
      <h2 style={{ marginBottom: "16px", fontSize: "20px" }}>Dashboard</h2>

      {/* Scanner Banner */}
      <div style={{
        background: "linear-gradient(135deg, #2563eb, #1e40af)",
        borderRadius: "12px", padding: "16px 20px",
        marginBottom: "20px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        color: "white", flexWrap: "wrap", gap: "12px",
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "15px" }}>🪪 Ready to Scan Aadhaar?</h3>
          <p style={{ margin: "4px 0 0", opacity: 0.8, fontSize: "13px" }}>
            Verify beneficiaries with voice announcement
          </p>
        </div>
        <button onClick={() => navigate("/scanner")} style={{
          padding: "9px 18px", borderRadius: "8px",
          border: "2px solid white", background: "transparent",
          color: "white", fontWeight: "700", fontSize: "13px",
          cursor: "pointer", whiteSpace: "nowrap",
        }}>
          Open Scanner →
        </button>
      </div>

      {/* Stats Cards — responsive grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: "12px", marginBottom: "24px",
      }}>
        {cards.map((c) => (
          <div key={c.title} style={{
            padding: "18px 14px", borderRadius: "12px",
            textAlign: "center", color: "#fff",
            background: `linear-gradient(135deg, ${c.color}, #111827)`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}>
            <p style={{ fontSize: "26px", fontWeight: "700", margin: "0 0 4px" }}>{c.value}</p>
            <p style={{ fontSize: "12px", opacity: 0.85, margin: 0 }}>{c.title}</p>
          </div>
        ))}
      </div>

      {/* Charts — responsive grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "16px",
      }}>
        <div style={{ padding: "16px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
          <h3 style={{ marginBottom: "12px", fontSize: "15px" }}>Scan Status</h3>
          <Pie data={pieData} />
        </div>
        <div style={{ padding: "16px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
          <h3 style={{ marginBottom: "12px", fontSize: "15px" }}>Users vs Scans</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
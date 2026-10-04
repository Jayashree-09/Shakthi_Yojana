import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

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
    datasets: [{ 
      data: [stats.validScans, stats.invalidScans], 
      backgroundColor: ["#10b981", "#f43f5e"], 
      borderWidth: 0,
      hoverOffset: 10
    }],
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      { 
        label: "Users", 
        data: [400, 600, 800, 1000, 1248, 0, 0, 0], 
        backgroundColor: "#6366f1",
        borderRadius: 6,
      },
      { 
        label: "Scans", 
        data: [300, 500, 700, 856, 856, 0, 0, 0], 
        backgroundColor: "#0ea5e9",
        borderRadius: 6,
      }
    ],
  };

  const cards = [
    { title: "Total Beneficiaries", value: stats.totalUsers || "1,248", trend: "+12.5%", color: "var(--primary)" },
    { title: "Valid Scans", value: stats.validScans || "856", trend: "+8.2%", color: "var(--acc-success)" },
    { title: "Invalid Scans", value: stats.invalidScans || "392", trend: "+3.1%", color: "var(--acc-error)" },
    { title: "Announcements", value: "18", trend: "+5.4%", color: "var(--acc-warning)" },
  ];

  const recentScans = [
    { name: "Lakshmi Devi", aadhaar: "xxxx xxxx 1234", status: "Valid", date: "08 May 2024" },
    { name: "Priya Sharma", aadhaar: "xxxx xxxx 5678", status: "Valid", date: "08 May 2024" },
    { name: "Meena Kumari", aadhaar: "xxxx xxxx 9012", status: "Invalid", date: "08 May 2024" },
    { name: "Sunita Devi", aadhaar: "xxxx xxxx 3456", status: "Valid", date: "08 May 2024" },
  ];

  return (
    <div className="dashboard-content">
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Welcome back, Admin!</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={() => navigate("/scanner")}>+ New Scan</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="reports-grid">
        {cards.map((c, i) => (
          <div key={i} className="report-card glass-card">
            <h3>{c.title}</h3>
            <p>{c.value}</p>
            <div style={{ marginTop: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                color: c.trend.startsWith('+') ? 'var(--acc-success)' : 'var(--acc-error)',
                fontWeight: '700'
              }}>{c.trend}</span>
              <span style={{ color: 'var(--text-muted)' }}>from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="reports-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '16px' }}>Users vs Scans</h3>
          <div style={{ height: '300px' }}>
            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '16px' }}>Scan Status</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="table-wrapper glass-card" style={{ marginTop: '32px' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h3 style={{ fontSize: '16px' }}>Recent Scans</h3>
           <button style={{ background: 'transparent', border: 'none', color: 'var(--p-600)', fontWeight: '600', cursor: 'pointer' }}>View All</button>
        </div>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Aadhaar No.</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentScans.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: '600' }}>{s.name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{s.aadhaar}</td>
                <td>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '700',
                    background: s.status === 'Valid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                    color: s.status === 'Valid' ? 'var(--acc-success)' : 'var(--acc-error)'
                  }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
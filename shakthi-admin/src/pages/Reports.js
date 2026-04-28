import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/universal.css";  // or your css file

const Reports = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/admin/logs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setLogs(res.data.data || []))
      .catch((err) => console.log("Reports Error:", err));

    API.get("/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setStats(res.data || {}))
      .catch((err) => console.log("Stats Error:", err));
  }, []);

  return (
    <div className="reports-container" style={{ padding: "10px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Reports</h2>
        <div style={{ fontSize: "14px", color: "#64748b" }}>{new Date().toLocaleDateString()}</div>
      </div>

      {/* Summary Cards */}
      <div className="reports-grid">
        <ReportCard 
          label="Total Scans" 
          value={stats.totalScans || 0} 
          color="#3b82f6" 
          icon="📊" 
          gradient="linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
          borderColor="#bfdbfe"
        />
        <ReportCard 
          label="Valid Scans" 
          value={stats.validScans || 0} 
          color="#10b981" 
          icon="✅" 
          gradient="linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
          borderColor="#a7f3d0"
        />
        <ReportCard 
          label="Invalid Scans" 
          value={stats.invalidScans || 0} 
          color="#ef4444" 
          icon="❌" 
          gradient="linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)"
          borderColor="#fecaca"
        />
        <ReportCard 
          label="Total Users" 
          value={stats.totalUsers || 0} 
          color="#8b5cf6" 
          icon="👥" 
          gradient="linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)"
          borderColor="#ddd6fe"
        />
      </div>

      {/* Logs Table */}
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", padding: "24px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>Recent Scan Logs</h3>
        <div className="table-wrapper"> 
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ ...th, borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px", borderLeft: "1px solid #e2e8f0" }}>Aadhaar</th>
                <th style={th}>Status</th>
                <th style={th}>Location</th>
                <th style={{ ...th, borderTopRightRadius: "8px", borderBottomRightRadius: "8px", borderRight: "1px solid #e2e8f0" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="table-row-hover">
                    <td style={td}>{log.aadhaarNumber}</td>
                    <td style={td}>
                      <span style={{ 
                        padding: "4px 12px", 
                        borderRadius: "20px", 
                        fontSize: "12px", 
                        fontWeight: "600",
                        textTransform: "uppercase",
                        background: log.status === "valid" ? "#d1fae5" : "#fee2e2",
                        color: log.status === "valid" ? "#065f46" : "#991b1b"
                      }}>
                        {log.status}
                      </span>
                    </td>
                    <td style={td}>{log.location}</td>
                    <td style={td}>{new Date(log.scannedAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No Reports Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .table-row-hover:hover {
          background-color: #f8fafc;
        }
        .table-row-hover td {
          transition: background-color 0.2s;
        }
      `}</style>
    </div>
  );
};

function ReportCard({ label, value, color, icon, gradient, borderColor }) {
  return (
    <div className="report-card" style={{ background: gradient, borderColor: borderColor }}>
      <div className="icon-bg">{icon}</div>
      <h3>{label}</h3>
      <p style={{ color: color }}>{value}</p>
    </div>
  );
}

const th = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "600",
  color: "#64748b",
  borderTop: "1px solid #e2e8f0",
  borderBottom: "1px solid #e2e8f0",
};

const td = {
  padding: "16px",
  fontSize: "14px",
  color: "#334155",
  borderBottom: "1px solid #f1f5f9",
};

export default Reports;

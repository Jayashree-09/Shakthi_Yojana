import React, { useEffect, useState } from "react";
import API from "../services/api";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const fetchLogs = () => {
    const url = status ? `/admin/logs?status=${status}` : "/admin/logs";
    API.get(url)
      .then((res) => setLogs(res.data.data || []))
      .catch((err) => { console.log("Logs Error:", err); setLogs([]); });
  };

  useEffect(() => { fetchLogs(); }, [status]);

  const filteredLogs = logs.filter((log) =>
    log.aadhaarNumber?.includes(search)
  );

  return (
    <div style={{ padding: "4px 0" }}>
      <h2 style={{ marginBottom: "16px", fontSize: "20px" }}>📋 Verification Logs</h2>

      {/* Filters */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "10px",
        marginBottom: "16px", background: "white",
        padding: "14px", borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <input
          type="text"
          placeholder="🔍 Search Aadhaar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: "160px", padding: "10px 12px",
            border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px",
          }}
        />
        <select
          onChange={(e) => setStatus(e.target.value)}
          value={status}
          style={{
            padding: "10px 12px", border: "1px solid #d1d5db",
            borderRadius: "8px", fontSize: "14px", background: "white",
          }}
        >
          <option value="">All Status</option>
          <option value="valid">Valid</option>
          <option value="invalid">Invalid</option>
          <option value="duplicate">Duplicate</option>
          <option value="suspicious">Suspicious</option>
        </select>
      </div>

      {/* Scrollable Table */}
      <div style={{ overflowX: "auto", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", minWidth: "500px", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={th}>Aadhaar</th>
              <th style={th}>Status</th>
              <th style={th}>Location</th>
              <th style={th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={td}>{log.aadhaarNumber}</td>
                  <td style={{
                    ...td,
                    color: log.status === "valid" ? "#16a34a" :
                           log.status === "suspicious" ? "#b45309" :
                           log.status === "duplicate" ? "#92400e" : "#dc2626",
                    fontWeight: "600"
                  }}>
                    {log.status === "valid" ? "✅" : log.status === "suspicious" ? "🔴" : log.status === "duplicate" ? "⚠️" : "❌"} {log.status}
                  </td>
                  <td style={td}>{log.location}</td>
                  <td style={td}>{new Date(log.scannedAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#9ca3af" }}>
                  No Logs Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = { padding: "12px 14px", textAlign: "left", fontWeight: "600", whiteSpace: "nowrap" };
const td = { padding: "12px 14px", whiteSpace: "nowrap" };

export default Logs;
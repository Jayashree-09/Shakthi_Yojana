import React, { useEffect, useState } from "react";
import API from "../services/api";

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get("/verify/logs")
      .then((res) => {
        console.log("Logs API:", res.data); // DEBUG
        setLogs(res.data.data); // ✅ FIX
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Verification Logs</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Aadhaar</th>
            <th>Status</th>
            <th>Location</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log._id}>
                <td>{log.aadhaarNumber}</td>
                <td>{log.status}</td>
                <td>{log.location}</td>
                <td>
                  {new Date(log.scannedAt).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No Logs Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Logs;
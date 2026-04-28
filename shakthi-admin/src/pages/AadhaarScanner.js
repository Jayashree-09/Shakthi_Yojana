import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import API from "../services/api";

function AadhaarScanner() {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [manualAadhaar, setManualAadhaar] = useState("");

  // ✅ FIX 1: Auto-load saved default location from Settings
  const [location, setLocation] = useState(
    localStorage.getItem("defaultLocation") || "Bengaluru Center"
  );

  const [mode, setMode] = useState("camera");
  const [cameraReady, setCameraReady] = useState(false);

  const announce = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) return;
    setScanning(true);
    setResult(null);
    setError("");
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setError("Could not capture image. Please try again.");
        setScanning(false);
        return;
      }
      const blob = await fetch(imageSrc).then((r) => r.blob());
      const formData = new FormData();
      formData.append("aadhaarImage", blob, "aadhaar.jpg");
      formData.append("location", location);
      const res = await API.post("/scan/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      announce(res.data.announcement);
    } catch (err) {
      const msg = err.response?.data?.message || "Could not read Aadhaar from image. Please use manual entry.";
      setError(msg);
      announce("Scan failed. " + msg);
    } finally {
      setScanning(false);
    }
  }, [location]);

  const handleManualScan = async () => {
    if (!manualAadhaar || manualAadhaar.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    setScanning(true);
    setResult(null);
    setError("");
    try {
      const res = await API.post("/scan/manual", { aadhaarNumber: manualAadhaar, location });
      setResult(res.data);
      announce(res.data.announcement);
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed.";
      setError(msg);
      announce("Verification failed. " + msg);
    } finally {
      setScanning(false);
    }
  };

  // ✅ FIX 2: Reset for next scan
  const handleReset = () => {
    setResult(null);
    setError("");
    setManualAadhaar("");
  };

  const isValid = result?.belongsToKarnataka && result?.status === "valid";

  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "6px" }}>🪪 Aadhaar Scanner</h2>
      <p style={{ color: "#6b7280", marginBottom: "20px" }}>
        Scan an Aadhaar card using your camera or enter the number manually.
      </p>

      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["camera", "manual"].map((m) => (
          <button key={m} onClick={() => { setMode(m); handleReset(); }} style={{
            padding: "10px 24px", borderRadius: "8px", border: "none",
            background: mode === m ? "#2563eb" : "#e5e7eb",
            color: mode === m ? "white" : "#374151",
            cursor: "pointer", fontWeight: "600",
          }}>
            {m === "camera" ? "📷 Camera Scan" : "⌨️ Manual Entry"}
          </button>
        ))}
      </div>

      {/* Location */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>📍 Scan Location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter scan location"
          style={inputStyle}
        />
        <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
          💡 Change default location in Settings
        </p>
      </div>

      {/* Camera Mode */}
      {mode === "camera" && (
        <div>
          <div style={{ borderRadius: "12px", overflow: "hidden", border: "2px solid #e5e7eb", marginBottom: "16px", background: "#000" }}>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              onUserMedia={() => setCameraReady(true)}
              onUserMediaError={() => setError("Camera not accessible. Please allow camera permission.")}
              style={{ display: "block" }}
            />
          </div>
          <button onClick={handleCapture} disabled={scanning || !cameraReady} style={actionBtn(scanning || !cameraReady)}>
            {scanning ? "⏳ Scanning..." : "📸 Capture & Scan Aadhaar"}
          </button>
        </div>
      )}

      {/* Manual Mode */}
      {mode === "manual" && (
        <div>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
            Aadhaar Number (12 digits)
          </label>
          <input
            value={manualAadhaar}
            onChange={(e) => setManualAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
            placeholder="e.g. 123456789012"
            maxLength={12}
            style={{ ...inputStyle, fontSize: "18px", letterSpacing: "4px", marginBottom: "14px" }}
          />
          <button onClick={handleManualScan} disabled={scanning} style={actionBtn(scanning)}>
            {scanning ? "⏳ Verifying..." : "🔍 Verify Aadhaar"}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: "20px", padding: "14px", borderRadius: "10px", background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626" }}>
          ❌ {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          marginTop: "20px", padding: "20px", borderRadius: "12px",
          background: isValid ? "#f0fdf4" : "#fef2f2",
          border: `2px solid ${isValid ? "#86efac" : "#fca5a5"}`,
        }}>
          <div style={{ fontSize: "56px", textAlign: "center", marginBottom: "10px" }}>
            {isValid ? "✅" : "❌"}
          </div>
          <h3 style={{ textAlign: "center", color: isValid ? "#16a34a" : "#dc2626", marginBottom: "12px", fontSize: "20px" }}>
            {isValid ? "Valid — Belongs to Karnataka" : "Invalid or Not from Karnataka"}
          </h3>
          <div style={{ background: "white", padding: "14px", borderRadius: "8px", fontSize: "16px", lineHeight: "1.6", color: "#374151", border: "1px solid #e5e7eb", marginBottom: "12px" }}>
            🔊 <em>{result.announcement}</em>
          </div>
          {result.user && (
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "14px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <span><strong>Name:</strong> {result.user.name}</span>
              <span><strong>State:</strong> {result.user.state}</span>
              <span><strong>Aadhaar:</strong> {result.aadhaarNumber}</span>
            </div>
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => announce(result.announcement)} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "#6366f1", color: "white", cursor: "pointer", fontWeight: "600" }}>
              🔁 Replay Voice
            </button>
            <button onClick={handleReset} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "#6b7280", color: "white", cursor: "pointer", fontWeight: "600" }}>
              🔄 Scan Next Person
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", width: "100%", fontSize: "14px", boxSizing: "border-box" };
const actionBtn = (disabled) => ({ width: "100%", padding: "14px", borderRadius: "10px", border: "none", fontSize: "16px", fontWeight: "700", background: disabled ? "#9ca3af" : "#2563eb", color: "white", cursor: disabled ? "not-allowed" : "pointer" });

export default AadhaarScanner;
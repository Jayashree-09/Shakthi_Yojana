import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext"; // ✅ replaced getLang

function Scanner() {
  const webcamRef = useRef(null);
  const autoScanInterval = useRef(null);

  const [mode, setMode] = useState("camera");
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [autoScan, setAutoScan] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [manualAadhaar, setManualAadhaar] = useState("");
  const [location, setLocation] = useState(
    localStorage.getItem("defaultLocation") || "Karnataka"
  );
  const [scanStatus, setScanStatus] = useState("");
  const navigate = useNavigate();
  const { lang } = useLang(); // ✅ global lang — auto updates when toggled

  // ✅ Check login on mount — announce + redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token && !user) {
      const msg = lang === "kn"
        ? "ದಯವಿಟ್ಟು ಮೊದಲು ನೋಂದಣಿ ಮಾಡಿ, ನಂತರ ಲಾಗಿನ್ ಮಾಡಿ ಮತ್ತು ಆಧಾರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ."
        : "Please register first, then login to scan Aadhaar.";
      announce(msg);
      setTimeout(() => navigate("/register"), 3000);
    } else if (!token && user) {
      const msg = lang === "kn"
        ? "ದಯವಿಟ್ಟು ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ, ನಂತರ ಆಧಾರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ."
        : "Please login first to scan Aadhaar.";
      announce(msg);
      setTimeout(() => navigate("/login"), 3000);
    }
  }, []);

  // ✅ Voice announcement — uses global lang automatically
  const announce = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "kn" ? "kn-IN" : "en-IN";
    u.rate = 0.88;
    u.pitch = 1;
    u.volume = 1;
    window.speechSynthesis.speak(u);
  };

  // ✅ Core scan function
  const doScan = useCallback(async () => {
    if (!webcamRef.current || scanning) return;

    setScanning(true);
    setError("");
    setScanStatus("📸 Capturing...");

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setScanStatus("");
        setScanning(false);
        return;
      }

      setScanStatus("🔍 Reading Aadhaar...");
      const blob = await fetch(imageSrc).then((r) => r.blob());
      const fd = new FormData();
      fd.append("aadhaarImage", blob, "aadhaar.jpg");
      fd.append("location", location);

      const res = await API.post("/scan/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
      setScanStatus("");
      announce(res.data.announcement);
      stopAutoScan();

    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (autoScan) {
        setScanStatus("👀 Looking for Aadhaar card...");
      } else {
        setError(msg || "Could not read Aadhaar. Please use Manual Entry.");
        setScanStatus("");
      }
    } finally {
      setScanning(false);
    }
  }, [location, scanning, autoScan, lang]);

  // ✅ Start auto scan
  const startAutoScan = useCallback(() => {
    setAutoScan(true);
    setResult(null);
    setError("");
    setScanStatus("👀 Looking for Aadhaar card...");
    setCountdown(3);

    let count = 3;
    autoScanInterval.current = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        count = 3;
        setCountdown(3);
        doScan();
      }
    }, 1000);
  }, [doScan]);

  // ✅ Stop auto scan
  const stopAutoScan = useCallback(() => {
    setAutoScan(false);
    setScanStatus("");
    setCountdown(0);
    if (autoScanInterval.current) {
      clearInterval(autoScanInterval.current);
      autoScanInterval.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoScanInterval.current) clearInterval(autoScanInterval.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Manual scan
  const handleManual = async () => {
    if (!manualAadhaar || manualAadhaar.length !== 12) {
      setError("Enter a valid 12-digit Aadhaar number.");
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
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError("");
    setManualAadhaar("");
    setScanStatus("");
    stopAutoScan();
  };

  const isValid = result?.belongsToKarnataka && result?.status === "valid";

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="scanner-page">

          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1 style={{ color: "white", fontSize: "clamp(22px,4vw,34px)", marginBottom: "8px" }}>
              🪪 {lang === "kn" ? "ಆಧಾರ್ ಸ್ಕ್ಯಾನರ್" : "Aadhaar Scanner"}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px" }}>
              {lang === "kn"
                ? "ಆಧಾರ್ ಕಾರ್ಡ್ ಪರಿಶೀಲನೆ — ಸ್ವಯಂ ಸ್ಕ್ಯಾನ್ ಅಥವಾ ಹಸ್ತಚಾಲಿತ ನಮೂದು"
                : "ಆಧಾರ್ ಕಾರ್ಡ್ ಪರಿಶೀಲನೆ — Auto scan or enter manually"}
            </p>
          </div>

          <div className="scanner-card">
            <div className="scanner-header">
              <h2>{lang === "kn" ? "ಶಕ್ತಿ ಯೋಜನೆ ಪರಿಶೀಲನೆ" : "Shakthi Yojana Verification"}</h2>
              <p>ಶಕ್ತಿ ಯೋಜನೆ ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆ</p>
            </div>

            <div className="scanner-body">

              {/* Mode Tabs */}
              <div className="mode-tabs">
                <button
                  className={`mode-tab ${mode === "camera" ? "active" : ""}`}
                  onClick={() => { setMode("camera"); reset(); }}
                >
                  📷 {lang === "kn" ? "ಕ್ಯಾಮೆರಾ ಸ್ಕ್ಯಾನ್" : "Camera Scan"}
                </button>
                <button
                  className={`mode-tab ${mode === "manual" ? "active" : ""}`}
                  onClick={() => { setMode("manual"); reset(); stopAutoScan(); }}
                >
                  ⌨️ {lang === "kn" ? "ಹಸ್ತಚಾಲಿತ ನಮೂದು" : "Manual Entry"}
                </button>
              </div>

              {/* Location */}
              <div className="form-group">
                <label>📍 {lang === "kn" ? "ಸ್ಕ್ಯಾನ್ ಸ್ಥಳ" : "Scan Location"}</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={lang === "kn" ? "ಉದಾ: ಬೆಂಗಳೂರು, ಹಾಸನ" : "e.g. Bengaluru, Hassan"}
                />
              </div>

              {/* ── CAMERA MODE ── */}
              {mode === "camera" && (
                <div>
                  <div style={{
                    borderRadius: "12px", overflow: "hidden",
                    border: autoScan ? "3px solid #f59e0b" : "2px solid #e2e8f0",
                    marginBottom: "12px", background: "#000",
                    position: "relative", transition: "border-color 0.3s",
                  }}>
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width="100%"
                      onUserMedia={() => setCameraReady(true)}
                      onUserMediaError={() => setError(
                        lang === "kn"
                          ? "ಕ್ಯಾಮೆರಾ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಅನುಮತಿ ನೀಡಿ ಅಥವಾ ಹಸ್ತಚಾಲಿತ ನಮೂದು ಬಳಸಿ."
                          : "Camera not accessible. Please allow camera permission or use Manual Entry."
                      )}
                      style={{ display: "block" }}
                      videoConstraints={{ facingMode: "environment" }}
                    />

                    {autoScan && (
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        background: "rgba(0,0,0,0.35)", pointerEvents: "none",
                      }}>
                        <div style={{
                          width: "70%", height: "45%",
                          border: "2px dashed #f59e0b", borderRadius: "12px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <p style={{ color: "#f59e0b", fontSize: "13px", fontWeight: "600", textAlign: "center" }}>
                            {lang === "kn" ? "ಆಧಾರ್ ಕಾರ್ಡ್ ಇಲ್ಲಿ ಇಡಿ" : "Place Aadhaar card here"}
                          </p>
                        </div>
                        {countdown > 0 && (
                          <div style={{
                            marginTop: "12px", background: "rgba(245,158,11,0.9)",
                            color: "white", width: "44px", height: "44px",
                            borderRadius: "50%", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            fontSize: "20px", fontWeight: "800",
                          }}>
                            {countdown}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {scanStatus && (
                    <div style={{
                      textAlign: "center", padding: "10px",
                      background: "#fef3c7", borderRadius: "8px",
                      marginBottom: "12px", fontSize: "14px",
                      color: "#92400e", fontWeight: "600",
                    }}>
                      {scanStatus}
                    </div>
                  )}

                  {!result && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      {!autoScan ? (
                        <>
                          <button
                            onClick={startAutoScan}
                            disabled={!cameraReady}
                            style={{
                              flex: 2, padding: "14px", borderRadius: "10px",
                              border: "none", fontSize: "15px", fontWeight: "700",
                              background: !cameraReady ? "#9ca3af" : "#f59e0b",
                              color: "white", cursor: !cameraReady ? "not-allowed" : "pointer",
                            }}
                          >
                            🔄 {lang === "kn" ? "ಸ್ವಯಂ ಸ್ಕ್ಯಾನ್ ಪ್ರಾರಂಭಿಸಿ" : "Start Auto Scan"}
                          </button>
                          <button
                            onClick={doScan}
                            disabled={scanning || !cameraReady}
                            style={{
                              flex: 1, padding: "14px", borderRadius: "10px",
                              border: "none", fontSize: "15px", fontWeight: "700",
                              background: scanning || !cameraReady ? "#9ca3af" : "var(--navy)",
                              color: "var(--gold)", cursor: scanning || !cameraReady ? "not-allowed" : "pointer",
                            }}
                          >
                            {scanning ? "⏳" : "📸"}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={stopAutoScan}
                          style={{
                            flex: 1, padding: "14px", borderRadius: "10px",
                            border: "none", fontSize: "15px", fontWeight: "700",
                            background: "#ef4444", color: "white", cursor: "pointer",
                          }}
                        >
                          ⏹ {lang === "kn" ? "ಸ್ವಯಂ ಸ್ಕ್ಯಾನ್ ನಿಲ್ಲಿಸಿ" : "Stop Auto Scan"}
                        </button>
                      )}
                    </div>
                  )}

                  {!autoScan && !result && (
                    <p style={{ fontSize: "13px", color: "#64748b", marginTop: "10px", textAlign: "center" }}>
                      {lang === "kn"
                        ? "ಕಾರ್ಡ್ ತೋರಿಸಿದಾಗ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಸ್ವಯಂ ಸ್ಕ್ಯಾನ್ ಪ್ರಾರಂಭಿಸಿ ಕ್ಲಿಕ್ ಮಾಡಿ"
                        : "Click Start Auto Scan to automatically scan when card is shown, or 📸 to capture once manually."}
                    </p>
                  )}

                  {autoScan && (
                    <p style={{ fontSize: "13px", color: "#92400e", marginTop: "10px", textAlign: "center", fontWeight: "600" }}>
                      📌 {lang === "kn" ? "ಆಧಾರ್ ಕಾರ್ಡ್ ಅನ್ನು ಚೌಕಟ್ಟಿನೊಳಗೆ ಸಮತಟ್ಟಾಗಿ ಹಿಡಿಯಿರಿ" : "Hold the Aadhaar card flat & steady inside the frame"}
                    </p>
                  )}
                </div>
              )}

              {/* ── MANUAL MODE ── */}
              {mode === "manual" && (
                <div>
                  <div className="form-group">
                    <label>{lang === "kn" ? "ಆಧಾರ್ ಸಂಖ್ಯೆ (12 ಅಂಕಿಗಳು)" : "Aadhaar Number (12 digits)"}</label>
                    <input
                      value={manualAadhaar}
                      onChange={(e) => setManualAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                      placeholder={lang === "kn" ? "12 ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ" : "Enter 12-digit Aadhaar number"}
                      maxLength={12}
                      style={{ fontSize: "20px", letterSpacing: "6px", fontWeight: "600" }}
                    />
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                      {manualAadhaar.length}/12 {lang === "kn" ? "ಅಂಕಿಗಳು ನಮೂದಿಸಲಾಗಿದೆ" : "digits entered"}
                    </p>
                  </div>
                  <button className="form-submit" onClick={handleManual} disabled={scanning}>
                    {scanning
                      ? (lang === "kn" ? "⏳ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ..." : "⏳ Verifying...")
                      : (lang === "kn" ? "🔍 ಆಧಾರ್ ಪರಿಶೀಲಿಸಿ" : "🔍 Verify Aadhaar")}
                  </button>
                </div>
              )}

              {/* ── ERROR ── */}
              {error && (
                <div style={{ marginTop: "16px", padding: "14px", borderRadius: "10px", background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: "14px" }}>
                  ❌ {error}
                </div>
              )}

              {/* ── RESULT ── */}
              {result && (
                <div className={isValid ? "result-valid" : "result-invalid"} style={{ marginTop: "20px" }}>
                  <div className="result-emoji">{isValid ? "✅" : "❌"}</div>

                  <h3 style={{ color: isValid ? "#16a34a" : "#dc2626", fontSize: "20px", marginBottom: "8px" }}>
                    {isValid
                      ? (lang === "kn" ? "ಮಾನ್ಯ — ಕರ್ನಾಟಕಕ್ಕೆ ಸೇರಿದ" : "Valid — Belongs to Karnataka")
                      : (lang === "kn" ? "ಅಮಾನ್ಯ — ಕರ್ನಾಟಕಕ್ಕೆ ಸೇರಿಲ್ಲ" : "Invalid or Not from Karnataka")}
                  </h3>

                  <p style={{ color: isValid ? "#166534" : "#991b1b", fontSize: "13px", marginBottom: "16px" }}>
                    {isValid ? "ಕರ್ನಾಟಕಕ್ಕೆ ಸೇರಿದ — ಮಾನ್ಯ" : "ಅಮಾನ್ಯ — ಕರ್ನಾಟಕಕ್ಕೆ ಸೇರಿಲ್ಲ"}
                  </p>

                  <div style={{ background: "white", padding: "14px 16px", borderRadius: "10px", marginBottom: "14px", border: "1px solid #e2e8f0", textAlign: "left" }}>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", fontWeight: "600", letterSpacing: "0.5px" }}>
                      🔊 {lang === "kn" ? "ಧ್ವನಿ ಘೋಷಣೆ" : "VOICE ANNOUNCEMENT"}
                    </p>
                    <p style={{ fontSize: "15px", color: "#374151", fontStyle: "italic", lineHeight: "1.6" }}>
                      "{result.announcement}"
                    </p>
                  </div>

                  {result.user && (
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "14px", fontSize: "13px" }}>
                      <span style={{ background: "rgba(0,0,0,0.06)", padding: "4px 10px", borderRadius: "20px" }}>👤 {result.user.name}</span>
                      <span style={{ background: "rgba(0,0,0,0.06)", padding: "4px 10px", borderRadius: "20px" }}>📍 {result.user.state}</span>
                      <span style={{ background: "rgba(0,0,0,0.06)", padding: "4px 10px", borderRadius: "20px" }}>🪪 {result.aadhaarNumber}</span>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                      onClick={() => announce(result.announcement)}
                      style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "var(--navy)", color: "var(--gold)", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
                    >
                      🔁 {lang === "kn" ? "ಧ್ವನಿ ಮತ್ತೆ ಕೇಳಿ" : "Replay Voice"}
                    </button>
                    <button
                      onClick={() => { reset(); if (mode === "camera") startAutoScan(); }}
                      style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#16a34a", color: "white", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
                    >
                      ▶ {lang === "kn" ? "ಮುಂದಿನ ವ್ಯಕ್ತಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ" : "Scan Next Person"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: "13px", marginTop: "20px" }}>
            {lang === "kn"
              ? "ತೊಂದರೆ ಇದೆಯೇ? ಹಸ್ತಚಾಲಿತ ನಮೂದು ಬಳಸಿ ಅಥವಾ ನಿಮ್ಮ ಮೇಲ್ವಿಚಾರಕರನ್ನು ಸಂಪರ್ಕಿಸಿ."
              : "Having trouble? Use Manual Entry or contact your supervisor."}
          </p>

        </div>
        <Footer />
      </div>
    </>
  );
}

export default Scanner;









// import React, { useRef, useState, useEffect, useCallback } from "react";
// import Webcam from "react-webcam";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";
// import { useLang } from "../context/LangContext";

// function Scanner() {
//   const webcamRef = useRef(null);
//   const autoScanInterval = useRef(null);

//   const [mode, setMode] = useState("camera");
//   const [cameraReady, setCameraReady] = useState(false);
//   const [scanning, setScanning] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");
//   const [manualAadhaar, setManualAadhaar] = useState("");
//   const [location, setLocation] = useState(
//     localStorage.getItem("defaultLocation") || "Karnataka"
//   );
//   const [scanStatus, setScanStatus] = useState("");
//   const navigate = useNavigate();
//   const { lang } = useLang();

//   // ✅ Check login on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");
//     if (!token && !user) {
//       const msg = lang === "kn"
//         ? "ದಯವಿಟ್ಟು ಮೊದಲು ನೋಂದಣಿ ಮಾಡಿ, ನಂತರ ಲಾಗಿನ್ ಮಾಡಿ ಮತ್ತು ಆಧಾರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ."
//         : "Please register first, then login to scan Aadhaar.";
//       announce(msg);
//       setTimeout(() => navigate("/register"), 3000);
//     } else if (!token && user) {
//       const msg = lang === "kn"
//         ? "ದಯವಿಟ್ಟು ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ, ನಂತರ ಆಧಾರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ."
//         : "Please login first to scan Aadhaar.";
//       announce(msg);
//       setTimeout(() => navigate("/login"), 3000);
//     }
//   }, []);

//   // ✅ Voice announcement
//   const announce = (text) => {
//     if (!text) return;
//     window.speechSynthesis.cancel();
//     const u = new SpeechSynthesisUtterance(text);
//     u.lang = lang === "kn" ? "kn-IN" : "en-IN";
//     u.rate = 0.88;
//     u.pitch = 1;
//     u.volume = 1;
//     window.speechSynthesis.speak(u);
//   };

//   // ✅ Stop auto scan
//   const stopAutoScan = useCallback(() => {
//     setScanStatus("");
//     setCountdown(0);
//     if (autoScanInterval.current) {
//       clearInterval(autoScanInterval.current);
//       autoScanInterval.current = null;
//     }
//   }, []);

//   // ✅ Core scan function
//   const doScan = useCallback(async () => {
//     if (!webcamRef.current || scanning) return;

//     setScanning(true);
//     setError("");
//     setScanStatus(lang === "kn" ? "📸 ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ..." : "📸 Capturing...");

//     try {
//       const imageSrc = webcamRef.current.getScreenshot();
//       if (!imageSrc) {
//         setScanStatus(lang === "kn" ? "👀 ಆಧಾರ್ ಕಾರ್ಡ್ ಹುಡುಕಲಾಗುತ್ತಿದೆ..." : "👀 Looking for Aadhaar card...");
//         setScanning(false);
//         return;
//       }

//       setScanStatus(lang === "kn" ? "🔍 ಆಧಾರ್ ಓದಲಾಗುತ್ತಿದೆ..." : "🔍 Reading Aadhaar...");
//       const blob = await fetch(imageSrc).then((r) => r.blob());
//       const fd = new FormData();
//       fd.append("aadhaarImage", blob, "aadhaar.jpg");
//       fd.append("location", location);

//       const res = await API.post("/scan/image", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setResult(res.data);
//       setScanStatus("");
//       announce(res.data.announcement);
//       stopAutoScan(); // ✅ stop scanning after result

//     } catch (err) {
//       // ✅ Silently retry — don't show error during auto scan
//       setScanStatus(lang === "kn" ? "👀 ಆಧಾರ್ ಕಾರ್ಡ್ ಹುಡುಕಲಾಗುತ್ತಿದೆ..." : "👀 Looking for Aadhaar card...");
//     } finally {
//       setScanning(false);
//     }
//   }, [location, scanning, lang, stopAutoScan]);

//   // ✅ Start auto scan — triggered automatically when camera is ready
//   const startAutoScan = useCallback(() => {
//     if (autoScanInterval.current) return; // already running
//     setResult(null);
//     setError("");
//     setScanStatus(lang === "kn" ? "👀 ಆಧಾರ್ ಕಾರ್ಡ್ ಹುಡುಕಲಾಗುತ್ತಿದೆ..." : "👀 Looking for Aadhaar card...");
//     setCountdown(3);

//     let count = 3;
//     autoScanInterval.current = setInterval(() => {
//       count--;
//       setCountdown(count);
//       if (count <= 0) {
//         count = 3;
//         setCountdown(3);
//         doScan();
//       }
//     }, 1000);
//   }, [doScan, lang]);

//   // ✅ Auto-start scanning when camera becomes ready
//   useEffect(() => {
//     if (cameraReady && mode === "camera" && !result) {
//       startAutoScan();
//     }
//   }, [cameraReady, mode]);

//   // ✅ Auto-start when switching back to camera tab
//   useEffect(() => {
//     if (mode === "camera" && cameraReady && !result) {
//       startAutoScan();
//     }
//     if (mode === "manual") {
//       stopAutoScan();
//     }
//   }, [mode]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (autoScanInterval.current) clearInterval(autoScanInterval.current);
//       window.speechSynthesis.cancel();
//     };
//   }, []);

//   // Manual scan
//   const handleManual = async () => {
//     if (!manualAadhaar || manualAadhaar.length !== 12) {
//       setError(lang === "kn" ? "ದಯವಿಟ್ಟು 12 ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ." : "Enter a valid 12-digit Aadhaar number.");
//       return;
//     }
//     setScanning(true);
//     setResult(null);
//     setError("");
//     try {
//       const res = await API.post("/scan/manual", { aadhaarNumber: manualAadhaar, location });
//       setResult(res.data);
//       announce(res.data.announcement);
//     } catch (err) {
//       setError(err.response?.data?.message || "Verification failed.");
//     } finally {
//       setScanning(false);
//     }
//   };

//   const reset = () => {
//     setResult(null);
//     setError("");
//     setManualAadhaar("");
//     setScanStatus("");
//     stopAutoScan();
//   };

//   const isValid = result?.belongsToKarnataka && result?.status === "valid";

//   return (
//     <>
//       <Navbar />
//       <div className="page-wrapper">
//         <div className="scanner-page">

//           <div style={{ textAlign: "center", marginBottom: "28px" }}>
//             <h1 style={{ color: "white", fontSize: "clamp(22px,4vw,34px)", marginBottom: "8px" }}>
//               🪪 {lang === "kn" ? "ಆಧಾರ್ ಸ್ಕ್ಯಾನರ್" : "Aadhaar Scanner"}
//             </h1>
//             <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px" }}>
//               {lang === "kn"
//                 ? "ಆಧಾರ್ ಕಾರ್ಡ್ ಪರಿಶೀಲನೆ — ಸ್ವಯಂ ಸ್ಕ್ಯಾನ್ ಅಥವಾ ಹಸ್ತಚಾಲಿತ ನಮೂದು"
//                 : "Aadhaar card verification — Auto scan or enter manually"}
//             </p>
//           </div>

//           <div className="scanner-card">
//             <div className="scanner-header">
//               <h2>{lang === "kn" ? "ಶಕ್ತಿ ಯೋಜನೆ ಪರಿಶೀಲನೆ" : "Shakthi Yojana Verification"}</h2>
//               <p>ಶಕ್ತಿ ಯೋಜನೆ ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆ</p>
//             </div>

//             <div className="scanner-body">

//               {/* ── Mode Tabs ── */}
//               <div className="mode-tabs">
//                 <button
//                   className={`mode-tab ${mode === "camera" ? "active" : ""}`}
//                   onClick={() => { setMode("camera"); reset(); }}
//                 >
//                   📷 {lang === "kn" ? "ಕ್ಯಾಮೆರಾ ಸ್ಕ್ಯಾನ್" : "Camera Scan"}
//                 </button>
//                 <button
//                   className={`mode-tab ${mode === "manual" ? "active" : ""}`}
//                   onClick={() => { setMode("manual"); reset(); }}
//                 >
//                   ⌨️ {lang === "kn" ? "ಹಸ್ತಚಾಲಿತ ನಮೂದು" : "Manual Entry"}
//                 </button>
//               </div>

//               {/* Location */}
//               <div className="form-group">
//                 <label>📍 {lang === "kn" ? "ಸ್ಕ್ಯಾನ್ ಸ್ಥಳ" : "Scan Location"}</label>
//                 <input
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   placeholder={lang === "kn" ? "ಉದಾ: ಬೆಂಗಳೂರು, ಹಾಸನ" : "e.g. Bengaluru, Hassan"}
//                 />
//               </div>

//               {/* ── CAMERA MODE ── */}
//               {mode === "camera" && (
//                 <div>
//                   {/* Camera Feed */}
//                   <div style={{
//                     borderRadius: "12px", overflow: "hidden",
//                     border: "3px solid #f59e0b", // ✅ always gold border — always scanning
//                     marginBottom: "12px", background: "#000",
//                     position: "relative", transition: "border-color 0.3s",
//                   }}>
//                     <Webcam
//                       ref={webcamRef}
//                       screenshotFormat="image/jpeg"
//                       width="100%"
//                       onUserMedia={() => setCameraReady(true)}
//                       onUserMediaError={() => setError(
//                         lang === "kn"
//                           ? "ಕ್ಯಾಮೆರಾ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಅನುಮತಿ ನೀಡಿ ಅಥವಾ ಹಸ್ತಚಾಲಿತ ನಮೂದು ಬಳಸಿ."
//                           : "Camera not accessible. Please allow camera permission or use Manual Entry."
//                       )}
//                       style={{ display: "block" }}
//                       videoConstraints={{ facingMode: "environment" }}
//                     />

//                     {/* ✅ Always show scanning overlay — no button needed */}
//                     {!result && (
//                       <div style={{
//                         position: "absolute", inset: 0,
//                         display: "flex", flexDirection: "column",
//                         alignItems: "center", justifyContent: "center",
//                         background: "rgba(0,0,0,0.35)", pointerEvents: "none",
//                       }}>
//                         <div style={{
//                           width: "70%", height: "45%",
//                           border: "2px dashed #f59e0b", borderRadius: "12px",
//                           display: "flex", alignItems: "center", justifyContent: "center",
//                         }}>
//                           <p style={{ color: "#f59e0b", fontSize: "13px", fontWeight: "600", textAlign: "center" }}>
//                             {lang === "kn" ? "ಆಧಾರ್ ಕಾರ್ಡ್ ಇಲ್ಲಿ ಇಡಿ" : "Place Aadhaar card here"}
//                           </p>
//                         </div>
//                         {/* ✅ Countdown */}
//                         {countdown > 0 && (
//                           <div style={{
//                             marginTop: "12px", background: "rgba(245,158,11,0.9)",
//                             color: "white", width: "44px", height: "44px",
//                             borderRadius: "50%", display: "flex",
//                             alignItems: "center", justifyContent: "center",
//                             fontSize: "20px", fontWeight: "800",
//                           }}>
//                             {countdown}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* ✅ Scan status */}
//                   {scanStatus && (
//                     <div style={{
//                       textAlign: "center", padding: "10px",
//                       background: "#fef3c7", borderRadius: "8px",
//                       marginBottom: "12px", fontSize: "14px",
//                       color: "#92400e", fontWeight: "600",
//                     }}>
//                       {scanStatus}
//                     </div>
//                   )}

//                   {/* ✅ Only show Stop button — no Start button needed */}
//                   {!result && cameraReady && (
//                     <button
//                       onClick={() => { stopAutoScan(); setScanStatus(""); }}
//                       style={{
//                         width: "100%", padding: "14px", borderRadius: "10px",
//                         border: "none", fontSize: "15px", fontWeight: "700",
//                         background: "#ef4444", color: "white", cursor: "pointer",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       ⏹ {lang === "kn" ? "ಸ್ಕ್ಯಾನ್ ನಿಲ್ಲಿಸಿ" : "Stop Scanning"}
//                     </button>
//                   )}

//                   {/* ✅ Instruction */}
//                   {!result && (
//                     <p style={{ fontSize: "13px", color: "#92400e", marginTop: "4px", textAlign: "center", fontWeight: "600" }}>
//                       📌 {lang === "kn"
//                         ? "ಆಧಾರ್ ಕಾರ್ಡ್ ಅನ್ನು ಚೌಕಟ್ಟಿನೊಳಗೆ ಸಮತಟ್ಟಾಗಿ ಹಿಡಿಯಿರಿ"
//                         : "Hold the Aadhaar card flat & steady inside the frame"}
//                     </p>
//                   )}

//                   {/* ✅ Scan Again button after result */}
//                   {result && (
//                     <button
//                       onClick={() => { reset(); }}
//                       style={{
//                         width: "100%", padding: "14px", borderRadius: "10px",
//                         border: "none", fontSize: "15px", fontWeight: "700",
//                         background: "#f59e0b", color: "white", cursor: "pointer",
//                         marginTop: "10px",
//                       }}
//                     >
//                       🔄 {lang === "kn" ? "ಮತ್ತೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ" : "Scan Again"}
//                     </button>
//                   )}
//                 </div>
//               )}

//               {/* ── MANUAL MODE ── */}
//               {mode === "manual" && (
//                 <div>
//                   <div className="form-group">
//                     <label>{lang === "kn" ? "ಆಧಾರ್ ಸಂಖ್ಯೆ (12 ಅಂಕಿಗಳು)" : "Aadhaar Number (12 digits)"}</label>
//                     <input
//                       value={manualAadhaar}
//                       onChange={(e) => setManualAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
//                       placeholder={lang === "kn" ? "12 ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ" : "Enter 12-digit Aadhaar number"}
//                       maxLength={12}
//                       style={{ fontSize: "20px", letterSpacing: "6px", fontWeight: "600" }}
//                     />
//                     <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
//                       {manualAadhaar.length}/12 {lang === "kn" ? "ಅಂಕಿಗಳು ನಮೂದಿಸಲಾಗಿದೆ" : "digits entered"}
//                     </p>
//                   </div>
//                   <button className="form-submit" onClick={handleManual} disabled={scanning}>
//                     {scanning
//                       ? (lang === "kn" ? "⏳ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ..." : "⏳ Verifying...")
//                       : (lang === "kn" ? "🔍 ಆಧಾರ್ ಪರಿಶೀಲಿಸಿ" : "🔍 Verify Aadhaar")}
//                   </button>
//                 </div>
//               )}

//               {/* ── ERROR ── */}
//               {error && (
//                 <div style={{ marginTop: "16px", padding: "14px", borderRadius: "10px", background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: "14px" }}>
//                   ❌ {error}
//                 </div>
//               )}

//               {/* ── RESULT ── */}
//               {result && (
//                 <div className={isValid ? "result-valid" : "result-invalid"} style={{ marginTop: "20px" }}>
//                   <div className="result-emoji">{isValid ? "✅" : "❌"}</div>

//                   <h3 style={{ color: isValid ? "#16a34a" : "#dc2626", fontSize: "20px", marginBottom: "8px" }}>
//                     {isValid
//                       ? (lang === "kn" ? "ಮಾನ್ಯ — ಕರ್ನಾಟಕಕ್ಕೆ ಸೇರಿದ" : "Valid — Belongs to Karnataka")
//                       : (lang === "kn" ? "ಅಮಾನ್ಯ — ಕರ್ನಾಟಕಕ್ಕೆ ಸೇರಿಲ್ಲ" : "Invalid or Not from Karnataka")}
//                   </h3>

//                   <p style={{ color: isValid ? "#166534" : "#991b1b", fontSize: "13px", marginBottom: "16px" }}>
//                     {isValid ? "ಕರ್ನಾಟಕಕ್ಕೆ ಸೇರಿದ — ಮಾನ್ಯ" : "ಅಮಾನ್ಯ — ಕರ್ನಾಟಕಕ್ಕೆ ಸೇರಿಲ್ಲ"}
//                   </p>

//                   <div style={{ background: "white", padding: "14px 16px", borderRadius: "10px", marginBottom: "14px", border: "1px solid #e2e8f0", textAlign: "left" }}>
//                     <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", fontWeight: "600", letterSpacing: "0.5px" }}>
//                       🔊 {lang === "kn" ? "ಧ್ವನಿ ಘೋಷಣೆ" : "VOICE ANNOUNCEMENT"}
//                     </p>
//                     <p style={{ fontSize: "15px", color: "#374151", fontStyle: "italic", lineHeight: "1.6" }}>
//                       "{result.announcement}"
//                     </p>
//                   </div>

//                   {result.user && (
//                     <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "14px", fontSize: "13px" }}>
//                       <span style={{ background: "rgba(0,0,0,0.06)", padding: "4px 10px", borderRadius: "20px" }}>👤 {result.user.name}</span>
//                       <span style={{ background: "rgba(0,0,0,0.06)", padding: "4px 10px", borderRadius: "20px" }}>📍 {result.user.state}</span>
//                       <span style={{ background: "rgba(0,0,0,0.06)", padding: "4px 10px", borderRadius: "20px" }}>🪪 {result.aadhaarNumber}</span>
//                     </div>
//                   )}

//                   <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
//                     <button
//                       onClick={() => announce(result.announcement)}
//                       style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "var(--navy)", color: "var(--gold)", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
//                     >
//                       🔁 {lang === "kn" ? "ಧ್ವನಿ ಮತ್ತೆ ಕೇಳಿ" : "Replay Voice"}
//                     </button>
//                     <button
//                       onClick={() => { reset(); }}
//                       style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#16a34a", color: "white", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
//                     >
//                       ▶ {lang === "kn" ? "ಮುಂದಿನ ವ್ಯಕ್ತಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ" : "Scan Next Person"}
//                     </button>
//                   </div>
//                 </div>
//               )}

//             </div>
//           </div>

//           <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: "13px", marginTop: "20px" }}>
//             {lang === "kn"
//               ? "ತೊಂದರೆ ಇದೆಯೇ? ಹಸ್ತಚಾಲಿತ ನಮೂದು ಬಳಸಿ ಅಥವಾ ನಿಮ್ಮ ಮೇಲ್ವಿಚಾರಕರನ್ನು ಸಂಪರ್ಕಿಸಿ."
//               : "Having trouble? Use Manual Entry or contact your supervisor."}
//           </p>

//         </div>
//         <Footer />
//       </div>
//     </>
//   );
// }

// export default Scanner;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useLang } from "../context/LangContext"; // ✅

const T = {
  en: {
    title: "Field Worker Login",
    subtitle: "Shakthi Yojana — Login to scan Aadhaar",
    email: "Email Address",
    password: "Password",
    loginBtn: "🔐 Login",
    loggingIn: "⏳ Logging in...",
    fillAll: "Please enter both email and password.",
    notFoundTitle: "Account Not Found!",
    notFoundMsg: "No account exists with this email. Please register first.",
    notFoundAnnounce: "Account not found. Please register first, then login to scan Aadhaar.",
    registerBtn: "📝 Register Now →",
    wrongPassTitle: "❌ Incorrect Password",
    wrongPassMsg: "The password you entered is wrong. Please try again.",
    wrongPassAnnounce: "Incorrect password. Please try again.",
    noAccount: "Don't have an account yet?",
    registerHere: "📝 Register Here",
    authorized: "🔒 Authorized field workers only",
  },
  kn: {
    title: "ಕ್ಷೇತ್ರ ಕಾರ್ಯಕರ್ತ ಲಾಗಿನ್",
    subtitle: "ಶಕ್ತಿ ಯೋಜನೆ — ಆಧಾರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಲಾಗಿನ್ ಮಾಡಿ",
    email: "ಇಮೇಲ್ ವಿಳಾಸ",
    password: "ಗುಪ್ತಪದ",
    loginBtn: "🔐 ಲಾಗಿನ್",
    loggingIn: "⏳ ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...",
    fillAll: "ದಯವಿಟ್ಟು ಇಮೇಲ್ ಮತ್ತು ಗುಪ್ತಪದ ನಮೂದಿಸಿ.",
    notFoundTitle: "ಖಾತೆ ಕಂಡುಬಂದಿಲ್ಲ!",
    notFoundMsg: "ಈ ಇಮೇಲ್‌ನೊಂದಿಗೆ ಯಾವುದೇ ಖಾತೆ ಇಲ್ಲ. ದಯವಿಟ್ಟು ಮೊದಲು ನೋಂದಣಿ ಮಾಡಿ.",
    notFoundAnnounce: "ಖಾತೆ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೊದಲು ನೋಂದಣಿ ಮಾಡಿ, ನಂತರ ಲಾಗಿನ್ ಮಾಡಿ ಮತ್ತು ಆಧಾರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.",
    registerBtn: "📝 ಈಗ ನೋಂದಣಿ ಮಾಡಿ →",
    wrongPassTitle: "❌ ತಪ್ಪಾದ ಗುಪ್ತಪದ",
    wrongPassMsg: "ನೀವು ನಮೂದಿಸಿದ ಗುಪ್ತಪದ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    wrongPassAnnounce: "ತಪ್ಪಾದ ಗುಪ್ತಪದ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    noAccount: "ಇನ್ನೂ ಖಾತೆ ಇಲ್ಲವೇ?",
    registerHere: "📝 ಇಲ್ಲಿ ನೋಂದಣಿ ಮಾಡಿ",
    authorized: "🔒 ಅಧಿಕೃತ ಕ್ಷೇತ್ರ ಕಾರ್ಯಕರ್ತರು ಮಾತ್ರ",
  },
};

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { lang } = useLang(); // ✅ global lang — auto updates when toggled
  const navigate = useNavigate();
  const t = T[lang]; // ✅ always picks correct language

  const announce = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "kn" ? "kn-IN" : "en-IN";
    u.rate = 0.88;
    u.pitch = 1;
    u.volume = 1;
    window.speechSynthesis.speak(u);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorType("");
    setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setErrorType("other");
      setErrorMsg(t.fillAll);
      return;
    }
    setLoading(true);
    setErrorType("");
    setErrorMsg("");
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/scanner");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      if (msg === "User not found") {
        setErrorType("notFound");
        announce(t.notFoundAnnounce);
      } else if (msg === "Invalid credentials") {
        setErrorType("wrongPassword");
        announce(t.wrongPassAnnounce);
      } else {
        setErrorType("other");
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="login-page">
          <div className="login-card">

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ width: "64px", height: "64px", background: "var(--navy)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 12px", border: "2px solid var(--gold)" }}>
                🏛️
              </div>
              <h2>{t.title}</h2>
              <p className="subtitle">{t.subtitle}</p>
            </div>

            <div className="tricolor-bar" style={{ marginBottom: "22px" }} />

            {errorType === "notFound" && (
              <div style={{ background: "#fef3c7", border: "2px solid #f59e0b", borderRadius: "12px", padding: "18px", marginBottom: "20px", textAlign: "center" }}>
                <p style={{ fontSize: "28px", marginBottom: "8px" }}>🤔</p>
                <p style={{ fontWeight: "700", color: "#92400e", fontSize: "16px", marginBottom: "6px" }}>{t.notFoundTitle}</p>
                <p style={{ color: "#92400e", fontSize: "13px", marginBottom: "14px", lineHeight: "1.5" }}>{t.notFoundMsg}</p>
                <Link to="/register" style={{ display: "inline-block", background: "var(--navy)", color: "var(--gold)", padding: "11px 24px", borderRadius: "8px", fontWeight: "700", textDecoration: "none", fontSize: "14px" }}>
                  {t.registerBtn}
                </Link>
              </div>
            )}

            {errorType === "wrongPassword" && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "10px", padding: "14px", marginBottom: "18px", textAlign: "center" }}>
                <p style={{ fontWeight: "700", color: "#dc2626", fontSize: "15px", marginBottom: "4px" }}>{t.wrongPassTitle}</p>
                <p style={{ color: "#991b1b", fontSize: "13px" }}>{t.wrongPassMsg}</p>
              </div>
            )}

            {errorType === "other" && errorMsg && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "10px", padding: "14px", marginBottom: "18px" }}>
                <p style={{ color: "#dc2626", fontSize: "14px", textAlign: "center" }}>❌ {errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>{t.email}</label>
                <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange}
                  style={{ borderColor: errorType === "notFound" ? "#f59e0b" : undefined }} />
              </div>
              <div className="form-group">
                <label>{t.password}</label>
                <input name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange}
                  style={{ borderColor: errorType === "wrongPassword" ? "#fca5a5" : undefined }} />
              </div>
              <button type="submit" className="form-submit" disabled={loading} style={{ marginTop: "8px" }}>
                {loading ? t.loggingIn : t.loginBtn}
              </button>
            </form>

            <div style={{ marginTop: "20px", padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "10px" }}>{t.noAccount}</p>
              <Link to="/register" style={{ display: "inline-block", background: "var(--navy)", color: "var(--gold)", padding: "10px 24px", borderRadius: "8px", fontWeight: "700", textDecoration: "none", fontSize: "14px" }}>
                {t.registerHere}
              </Link>
            </div>

            <div style={{ marginTop: "14px", textAlign: "center", fontSize: "13px", color: "#94a3b8" }}>
              {t.authorized} &nbsp;|&nbsp; Help: <strong>1800-425-9339</strong>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
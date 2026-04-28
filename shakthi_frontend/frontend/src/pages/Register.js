import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOTP, setDevOTP] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    aadhaarNumber: "",
    state: "Karnataka",
    gender: "female",
    role: "user",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── STEP 1: Submit form
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phoneNumber || !form.password || !form.aadhaarNumber) {
      alert("Please fill all required fields"); return;
    }
    if (!/^\d{10}$/.test(form.phoneNumber)) {
      alert("Please enter a valid 10-digit phone number"); return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match"); return;
    }
    if (form.aadhaarNumber.length !== 12) {
      alert("Aadhaar number must be 12 digits"); return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        aadhaarNumber: form.aadhaarNumber,
        state: form.state,
        gender: form.gender,
        role: form.role,
      });

      console.log("Register response:", res.data);

      setPhone(form.phoneNumber);

      if (res.data.devOTP) {
        setDevOTP(res.data.devOTP);
        setOtp(res.data.devOTP);
      }

      setStep(2);
      startResendTimer();

    } catch (err) {
      console.error("Register error:", err);
      const message = err.response?.data?.message || err.message || "Registration failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { alert("Please enter the 6-digit OTP"); return; }
    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { phoneNumber: phone, otp });
      alert("🎉 Registration Successful! Welcome to Shakthi Yojana. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally { setLoading(false); }
  };

  // ── Resend OTP
  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/resend-otp", { phoneNumber: phone });
      if (res.data.devOTP) {
        setDevOTP(res.data.devOTP);
        setOtp("");
        // setOtp(res.data.devOTP);

      }
      alert("New OTP sent ✅");
      startResendTimer();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    } finally { setLoading(false); }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ────────────────────────────────────────
  // STEP 1 — FORM
  // ────────────────────────────────────────
  if (step === 1) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper">
          <div className="login-page" style={{ alignItems: "flex-start", paddingTop: "40px" }}>
            <div className="login-card" style={{ maxWidth: "520px" }}>

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ width: "60px", height: "60px", background: "var(--navy)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", margin: "0 auto 12px", border: "2px solid var(--gold)" }}>
                  📝
                </div>
                <h2 style={{ fontSize: "24px" }}>Create Account</h2>
                <p className="subtitle">ಖಾತೆ ರಚಿಸಿ — Register for Shakthi Yojana</p>
              </div>

              <div className="tricolor-bar" style={{ marginBottom: "22px" }} />

              <form onSubmit={handleRegister}>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input name="name" placeholder="Your full name" onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input name="email" type="email" placeholder="your@email.com" onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number * (OTP will be sent here)</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ padding: "11px 14px", background: "#f3f4f6", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#374151", whiteSpace: "nowrap", fontWeight: "600" }}>
                      🇮🇳 +91
                    </span>
                    <input
                      name="phoneNumber"
                      placeholder="10-digit mobile number"
                      value={form.phoneNumber}
                      onChange={(e) => setForm({ ...form, phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      maxLength={10}
                      style={{ flex: 1, letterSpacing: "2px", fontSize: "16px", fontWeight: "600" }}
                    />
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                    {form.phoneNumber.length}/10 digits
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label>Password *</label>
                    <input name="password" type="password" placeholder="Min 6 characters" onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password *</label>
                    <input name="confirmPassword" type="password" placeholder="Repeat password" onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Aadhaar Number * (12 digits)</label>
                  <input
                    name="aadhaarNumber"
                    placeholder="e.g. 123456789012"
                    maxLength={12}
                    onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value.replace(/\D/g, "").slice(0, 12) })}
                    value={form.aadhaarNumber}
                    style={{ letterSpacing: "4px", fontSize: "16px", fontWeight: "600" }}
                  />
                  <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "3px" }}>
                    {form.aadhaarNumber.length}/12 digits
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label>State</label>
                    <input name="state" value={form.state} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange}>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select name="role" value={form.role} onChange={handleChange}>
                      <option value="user">User</option>
                      <option value="student">Student</option>
                      <option value="admin">Housewife</option>
                      <option value="admin">Working Women</option>

                    </select>
                  </div>
                </div>

                <button type="submit" className="form-submit" disabled={loading} style={{ marginTop: "8px" }}>
                  {loading ? "⏳ Sending OTP..." : "📱 Register & Send OTP →"}
                </button>
              </form>

              <p style={{ textAlign: "center", marginTop: "18px", fontSize: "14px", color: "#64748b" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "var(--navy)", fontWeight: "700" }}>Login here</Link>
              </p>

            </div>
          </div>
        </div>
      </>
    );
  }

  // ────────────────────────────────────────
  // STEP 2 — OTP
  // ────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="login-page">
          <div className="login-card" style={{ maxWidth: "420px" }}>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "56px", marginBottom: "12px" }}>📱</div>
              <h2 style={{ fontSize: "24px" }}>Verify Your Phone</h2>
              <p className="subtitle">ನಿಮ್ಮ ಫೋನ್ ಪರಿಶೀಲಿಸಿ</p>
            </div>

            <div className="tricolor-bar" style={{ marginBottom: "22px" }} />

            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "14px", marginBottom: "16px", textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "#166534", marginBottom: "4px" }}>OTP sent to:</p>
              <p style={{ fontWeight: "700", color: "var(--navy)", fontSize: "20px", letterSpacing: "2px" }}>
                🇮🇳 +91 {form.email}
              </p>
            </div>

            {/* ✅ Always show OTP during development */}
            {/* {devOTP && (
              <div style={{ background: "#fef3c7", border: "2px solid #f59e0b", borderRadius: "10px", padding: "16px", marginBottom: "16px", textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "#92400e", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  🧪 Testing Mode — Your OTP
                </p>
                <p style={{ fontSize: "36px", fontWeight: "800", color: "#92400e", letterSpacing: "10px", fontFamily: "monospace" }}>
                  {devOTP}
                </p>
                <p style={{ fontSize: "11px", color: "#b45309", marginTop: "6px" }}>
                  This box will be hidden when SMS is working
                </p>
              </div>
            )} */}

            <form onSubmit={handleVerifyOTP}>
              <div className="form-group">
                <label>Enter 6-digit OTP</label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  maxLength={6}
                  style={{ textAlign: "center", fontSize: "28px", letterSpacing: "12px", fontWeight: "700" }}
                />
                <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", textAlign: "center" }}>
                  Valid for 10 minutes
                </p>
              </div>

              <button type="submit" className="form-submit" disabled={loading} style={{ marginTop: "6px" }}>
                {loading ? "⏳ Verifying..." : "✅ Verify & Complete Registration"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "18px" }}>
              {resendTimer > 0 ? (
                <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                  Resend in <strong style={{ color: "var(--navy)" }}>{resendTimer}s</strong>
                </p>
              ) : (
                <button onClick={handleResend} disabled={loading}
                  style={{ background: "none", border: "none", color: "var(--navy)", fontWeight: "700", cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}>
                  🔁 Resend OTP
                </button>
              )}
            </div>

            <button onClick={() => { setStep(1); setDevOTP(""); setOtp(""); }}
              style={{ width: "100%", marginTop: "14px", background: "none", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", cursor: "pointer", fontSize: "13px", color: "#64748b" }}>
              ← Go back
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
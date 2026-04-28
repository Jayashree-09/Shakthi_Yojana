import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/universal.css";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    aadhaarNumber: "",
    state: "Karnataka",
    gender: "female",
    role: "admin", // ✅ admin panel always registers as admin
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── STEP 1: Register → Send OTP
  const handleRegister = async () => {
    if (!form.name || !form.email || !form.phoneNumber || !form.password || !form.aadhaarNumber) {
      alert("Please fill all required fields");
      return;
    }

    if (!/^\d{10}$/.test(form.phoneNumber)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (form.aadhaarNumber.length !== 12) {
      alert("Aadhaar number must be 12 digits");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        aadhaarNumber: form.aadhaarNumber,
        state: form.state,
        gender: form.gender,
        role: form.role,
      });

      setPhone(form.phoneNumber);
      setStep(2);
      startResendTimer();
      alert(`OTP sent to ${form.email} and +91 ${form.phoneNumber} ✅`);

    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/verify-otp", { phoneNumber: phone, otp });
      alert("Registration Successful! ✅ Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      await API.post("/auth/resend-otp", { phoneNumber: phone });
      alert("New OTP sent ✅");
      startResendTimer();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
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

  // ── STEP 1: Registration Form
  if (step === 1) {
    return (
      <div className="register-container">
        <h2>📝 Register</h2>
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>
          Create your Shakthi Yojana Admin account
        </p>

        <input name="name" placeholder="Full Name *" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email *" onChange={handleChange} />

        {/* Phone with +91 */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
          <span style={{
            padding: "10px 12px", background: "#f3f4f6",
            border: "1px solid #d1d5db", borderRadius: "8px",
            fontSize: "14px", color: "#374151", whiteSpace: "nowrap", fontWeight: "600"
          }}>
            🇮🇳 +91
          </span>
          <input
            name="phoneNumber"
            placeholder="Phone Number * (10 digits)"
            onChange={(e) =>
              setForm({ ...form, phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })
            }
            value={form.phoneNumber}
            style={{ flex: 1, marginBottom: "0" }}
          />
        </div>

        {/* Password with eye icon */}
        {/* <div style={{ position: "relative", marginBottom: "10px" }}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password *"
            onChange={handleChange}
            style={{ paddingRight: "44px", width: "100%", marginBottom: "0" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute", right: "12px", top: "50%",
              transform: "translateY(-50%)", background: "none",
              border: "none", cursor: "pointer", fontSize: "18px",
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div> */}


  <div style={{ position: "relative", width: "100%", marginBottom: "12px" }}>
  <input
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="Password *"
    value={form.password}
    onChange={handleChange}
    style={{
      width: "100%",
      height: "40px",
      padding: "0 45px 0 10px",   // space for icon
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      boxSizing: "border-box"
    }}
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "16px"
    }}
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>

        <input
          name="aadhaarNumber"
          placeholder="Aadhaar Number * (12 digits)"
          onChange={(e) =>
            setForm({ ...form, aadhaarNumber: e.target.value.replace(/\D/g, "").slice(0, 12) })
          }
          value={form.aadhaarNumber}
          maxLength={12}
        />

        <input name="state" placeholder="State" value={form.state} onChange={handleChange} />

        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="student">Student</option>
        </select>

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Sending OTP..." : "Register & Send OTP →"}
        </button>

        <p onClick={() => navigate("/login")} style={{ cursor: "pointer", marginTop: "14px" }}>
          Already have an account? Login
        </p>
      </div>
    );
  }

  // ── STEP 2: OTP Verification
  return (
    <div className="register-container">
      <div style={{ textAlign: "center", fontSize: "48px", marginBottom: "8px" }}>📧</div>
      <h2>Verify OTP</h2>

      <p style={{ textAlign: "center", color: "#6b7280", fontSize: "14px", marginBottom: "6px" }}>
        OTP sent to your email and:
      </p>
      <p style={{ textAlign: "center", fontWeight: "700", color: "#2563eb", marginBottom: "20px" }}>
        🇮🇳 +91 {phone}
      </p>

      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        maxLength={6}
        style={{ textAlign: "center", fontSize: "24px", letterSpacing: "10px", fontWeight: "700" }}
      />

      <button onClick={handleVerifyOTP} disabled={loading} style={{ marginTop: "10px" }}>
        {loading ? "Verifying..." : "✅ Verify OTP"}
      </button>

      {/* Resend */}
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        {resendTimer > 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Resend OTP in <strong>{resendTimer}s</strong>
          </p>
        ) : (
          <p
            onClick={handleResendOTP}
            style={{ color: "#2563eb", cursor: "pointer", fontSize: "14px" }}
          >
            🔁 Resend OTP
          </p>
        )}
      </div>

      <p
        onClick={() => setStep(1)}
        style={{ textAlign: "center", color: "#6b7280", cursor: "pointer", fontSize: "13px", marginTop: "10px" }}
      >
        ← Go back
      </p>
    </div>
  );
}

export default Register;
import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/universal.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    API.post("/auth/login", {
      email: email.trim(),       // ✅ FIX
      password: password.trim(), // ✅ FIX
    })
      .then((res) => {
        console.log("Login Response:", res.data);

        // ✅ STORE TOKEN (🔥 MOST IMPORTANT)
        localStorage.setItem("token", res.data.token);

        // optional
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login successful ✅");

        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response?.data?.message || "Login failed");
      });
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
        New user? Register
      </p>
    </div>
  );
}

export default Login;
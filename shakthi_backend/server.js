const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("API KEY:", process.env.FAST2SMS_API_KEY);
console.log("ENV CHECK:", process.env.MONGO_URI);

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.send("Shakthi Yojana Backend is running 🚀");
});

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contentRoutes = require("./routes/contentRoutes");
const scanRoutes = require("./routes/scanRoutes");

// ✅ NEW: Role Routes (ADD THIS)
const roleRoutes = require("./routes/roleRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/scan", scanRoutes);

// ✅ NEW: Enable dynamic roles API
app.use("/api/roles", roleRoutes);

// DB connection
const connectDB = require("./config/db");
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log(
  "ENV CHECK:",
  process.env.MONGO_URI
    ? "MongoDB URI loaded"
    : "MongoDB URI missing"
);

const app = express();

// ==========================================
// CORS CONFIGURATION
// ==========================================

const corsOptions = {
  origin: true,
  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

// ==========================================
// BODY PARSERS
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.send("Shakthi Yojana Backend is running 🚀");
});

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contentRoutes = require("./routes/contentRoutes");
const scanRoutes = require("./routes/scanRoutes");
const roleRoutes = require("./routes/roleRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/roles", roleRoutes);

// ==========================================
// DATABASE
// ==========================================

const connectDB = require("./config/db");

connectDB();

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
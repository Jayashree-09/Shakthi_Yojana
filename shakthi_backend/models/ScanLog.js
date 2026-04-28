const mongoose = require("mongoose");

const scanLogSchema = new mongoose.Schema(
  {
    aadhaarNumber: { type: String, required: true },
    userName: { type: String, default: "Unknown" },
    gender: { type: String, default: "unknown" },
    status: {
      type: String,
      required: true,
    },
    reason: { type: String, default: "" },
    location: { type: String, required: true },
    scannedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "scanlogs", // ✅ IMPORTANT FIX
  }
);

module.exports = mongoose.model("ScanLog", scanLogSchema);
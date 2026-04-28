const ScanLog = require("../models/ScanLog");
const aadhaarService = require("../services/aadhaarService");

// ✅ Check Aadhaar
const checkAadhaar = async (req, res) => {
  try {
    const { aadhaarNumber, location } = req.body;
    if (!aadhaarNumber) {
      return res.status(400).json({ message: "Aadhaar number required" });
    }
    const result = await aadhaarService.verifyAadhaar(aadhaarNumber, location || "Unknown");
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Scan Aadhaar + Save Log
const scanAadhaar = async (req, res) => {
  try {
    const { aadhaarNumber, location } = req.body;
    if (!aadhaarNumber || !location) {
      return res.status(400).json({ message: "Aadhaar number and location required" });
    }
    const result = await aadhaarService.verifyAadhaar(aadhaarNumber, location);
    const log = await ScanLog.create({
      aadhaarNumber,
      userName: result.user?.name || "Unknown",
      gender: result.user?.gender || "unknown",
      status: result.status,
      reason: result.reason || "",
      location,
      scannedAt: new Date(),
    });
    res.json({ success: true, message: "Scan completed", data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Logs — now includes reason, userName, gender
const getLogs = async (req, res) => {
  try {
    const logs = await ScanLog.find().sort({ scannedAt: -1 });
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { checkAadhaar, scanAadhaar, getLogs };
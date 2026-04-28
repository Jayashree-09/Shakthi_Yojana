const express = require("express");
const router = express.Router();

const User = require("../models/User");
const ScanLog = require("../models/ScanLog");
const bcrypt = require("bcryptjs");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// ================= USERS =================

// ✅ Get all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ UPDATE USER
router.put("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, role, state, gender, password } = req.body;

    const updateData = { name, email, role, state, gender };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ DELETE USER
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", data: deletedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= STATS (✅ FIXED ONLY THIS PART) =================

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalScans = await ScanLog.countDocuments();

    // ✅ FIX: case-insensitive matching
    const validScans = await ScanLog.countDocuments({
      status: { $regex: /^valid$/i },
    });

    const invalidScans = await ScanLog.countDocuments({
      status: { $regex: /^invalid$/i },
    });

    res.json({ totalUsers, totalScans, validScans, invalidScans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= LOGS =================

router.get("/logs", protect, adminOnly, async (req, res) => {
  try {
    let { status } = req.query;
    let filter = {};

    if (status && status.trim() !== "") {
      filter.status = status.trim().toLowerCase();
    }

    const logs = await ScanLog.find(filter).sort({ scannedAt: -1 });

    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ DELETE LOG
router.delete("/logs/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedLog = await ScanLog.findByIdAndDelete(req.params.id);

    if (!deletedLog) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json({ message: "Log deleted successfully", data: deletedLog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Role = require("../models/Role");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ➕ Add role (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const role = new Role({ name: req.body.name });
    await role.save();
    res.json(role);
  } catch {
    res.status(400).json({ message: "Role already exists" });
  }
});

// 📥 Get roles (for frontend)
router.get("/", async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
});

module.exports = router;
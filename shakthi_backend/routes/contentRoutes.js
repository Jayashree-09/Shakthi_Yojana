const express = require("express");
const router = express.Router();

const Content = require("../models/Content");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// 🔥 GET CONTENT (Public)
router.get("/:key", async (req, res) => {
  try {
    const content = await Content.findOne({ key: req.params.key });
    res.json(content);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔥 UPDATE CONTENT (Admin only)
router.put("/:key", protect, adminOnly, async (req, res) => {
  try {
    const { value } = req.body;

    const updated = await Content.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true, upsert: true } // create if not exists
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
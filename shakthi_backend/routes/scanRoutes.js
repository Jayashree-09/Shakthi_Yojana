const express = require("express");
const router = express.Router();
const multer = require("multer");
const Tesseract = require("tesseract.js");
const ScanLog = require("../models/ScanLog");
const aadhaarService = require("../services/aadhaarService");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"), false);
  },
});

// ─── Helper: Save scan log ───
const saveScanLog = async (aadhaarNumber, result, location) => {
  await ScanLog.create({
    aadhaarNumber,
    userName: result.user?.name || "Unknown",       // ✅ save name
    gender: result.user?.gender || "unknown",        // ✅ save gender
    status: result.status,
    reason: result.reason || "",                     // ✅ save reason
    location,
    scannedAt: new Date(),
  });
};

// ─── POST /api/scan/image ───
router.post("/image", upload.single("aadhaarImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const location = req.body.location || "Unknown Location";

    console.log("📸 Image received, running OCR...");

    const { data: { text } } = await Tesseract.recognize(req.file.buffer, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(`OCR progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    console.log("OCR Raw Text:\n", text);

    const aadhaarMatch = text.replace(/\s/g, "").match(/\d{12}/);

    if (!aadhaarMatch) {
      return res.status(422).json({
        success: false,
        message: "Could not detect Aadhaar number from image. Please try a clearer photo.",
        ocrText: text,
      });
    }

    const aadhaarNumber = aadhaarMatch[0];
    console.log("✅ Detected Aadhaar:", aadhaarNumber);

    // ✅ Pass location to verifyAadhaar
    const result = await aadhaarService.verifyAadhaar(aadhaarNumber, location);

    // ✅ Save full log
    await saveScanLog(aadhaarNumber, result, location);

    res.json({ success: true, aadhaarNumber, ...result });

  } catch (error) {
    console.error("Scan error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── POST /api/scan/manual ───
router.post("/manual", async (req, res) => {
  try {
    const { aadhaarNumber, location } = req.body;

    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 12-digit Aadhaar number",
      });
    }

    // ✅ Pass location to verifyAadhaar
    const result = await aadhaarService.verifyAadhaar(aadhaarNumber, location || "Manual Entry");

    // ✅ Save full log
    await saveScanLog(aadhaarNumber, result, location || "Manual Entry");

    res.json({ success: true, aadhaarNumber, ...result });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const verificationController = require("../controllers/verificationController");

router.post("/check", verificationController.checkAadhaar);
router.post("/scan", verificationController.scanAadhaar);
router.get("/logs", verificationController.getLogs);

module.exports = router;
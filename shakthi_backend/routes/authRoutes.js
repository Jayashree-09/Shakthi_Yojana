const express = require("express");
const router = express.Router();

const { register, login, verifyOTP, resendOTP } = require("../controllers/authController");

router.post("/register", register);       // Step 1: Send OTP
router.post("/verify-otp", verifyOTP);    // Step 2: Verify OTP → Save user
router.post("/resend-otp", resendOTP);    // Step 3: Resend OTP
router.post("/login", login);

module.exports = router;
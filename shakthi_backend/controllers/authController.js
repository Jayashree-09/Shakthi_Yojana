const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const axios = require("axios");

const otpStore = {};

// ✅ EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ SEND OTP EMAIL
const sendOTPEmail = async (email, name, otp) => {
  try {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "yourgmail@gmail.com") {
      console.log("⚠️ Email not configured. Skipping email.");
      return false;
    }

    await transporter.sendMail({
      from: `"Shakthi Yojana" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Registration - Shakthi Yojana",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#2563eb;text-align:center;">🏛️ Shakthi Yojana</h2>
          <h3 style="text-align:center;">Email Verification</h3>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your OTP for registration is:</p>
          <div style="text-align:center;margin:24px 0;">
            <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#2563eb;background:#eff6ff;padding:16px 24px;border-radius:10px;">
              ${otp}
            </span>
          </div>
          <p style="color:#6b7280;font-size:14px;">This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="color:#6b7280;font-size:14px;">If you did not request this, please ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>
          <p style="color:#9ca3af;font-size:12px;text-align:center;">Shakthi Yojana — Karnataka Government Scheme</p>
        </div>
      `,
    });

    console.log("✅ OTP email sent to:", email);
    return true;
  } catch (err) {
    console.log("❌ OTP email failed:", err.message);
    return false;
  }
};

// ✅ SEND SUCCESS EMAIL
const sendSuccessEmail = async (user) => {
  try {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "yourgmail@gmail.com") {
      console.log("⚠️ Email not configured. Skipping success email.");
      return false;
    }

    await transporter.sendMail({
      from: `"Shakthi Yojana" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Registration Successful - Shakthi Yojana",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#16a34a;text-align:center;">✅ Registration Successful!</h2>
          <h3 style="text-align:center;color:#2563eb;">🏛️ Shakthi Yojana</h3>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your account has been successfully created. Here are your details:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:10px;color:#6b7280;font-size:14px;">Name</td>
              <td style="padding:10px;font-weight:600;">${user.name}</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:10px;color:#6b7280;font-size:14px;">Email</td>
              <td style="padding:10px;font-weight:600;">${user.email}</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:10px;color:#6b7280;font-size:14px;">Phone</td>
              <td style="padding:10px;font-weight:600;">+91 ${user.phoneNumber}</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:10px;color:#6b7280;font-size:14px;">Role</td>
              <td style="padding:10px;font-weight:600;">${user.role}</td>
            </tr>
            <tr>
              <td style="padding:10px;color:#6b7280;font-size:14px;">State</td>
              <td style="padding:10px;font-weight:600;">${user.state}</td>
            </tr>
          </table>
          <div style="text-align:center;margin:24px 0;">
            <a href="http://localhost:3000/login" style="background:#2563eb;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
              Login Now →
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>
          <p style="color:#9ca3af;font-size:12px;text-align:center;">Shakthi Yojana — Karnataka Government Scheme</p>
        </div>
      `,
    });

    console.log("✅ Success email sent to:", user.email);
    return true;
  } catch (err) {
    console.log("❌ Success email failed:", err.message);
    return false;
  }
};

// ✅ SEND SMS
const sendSMS = async (phoneNumber, otp) => {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey || apiKey.trim() === "" || apiKey === "your_fast2sms_api_key_here") {
      console.log(`⚠️ No SMS API key. OTP: ${otp}`);
      return false;
    }

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        variables_values: otp,
        numbers: phoneNumber,
      },
      {
        headers: {
          authorization: apiKey.trim(),
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ SMS sent:", response.data);
    return true;
  } catch (err) {
    console.error("❌ SMS failed:", err.response?.data || err.message);
    return false;
  }
};

// ─────────────────────────────────────────
// STEP 1: REGISTER → Send OTP to SMS + Email
// ─────────────────────────────────────────
const register = async (req, res) => {
  try {
    console.log("📥 Register request:", req.body);

    const { name, email, phoneNumber, password, role, aadhaarNumber, state, gender } = req.body;

    if (!name || !email || !phoneNumber || !password || !aadhaarNumber) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const existingAadhaar = await User.findOne({ aadhaarNumber });
    if (existingAadhaar) {
      return res.status(400).json({ message: "Aadhaar number already registered" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const hashedPassword = await bcrypt.hash(password, 10);

    otpStore[phoneNumber] = {
      otp,
      expiresAt,
      userData: {
        name, email, phoneNumber,
        password: hashedPassword,
        role: role || "user",
        aadhaarNumber,
        state: state || "Karnataka",
        gender: gender || "female",
      },
    };

    // ✅ Send OTP to both SMS and Email
    const smsSent = await sendSMS(phoneNumber, otp);
    const emailSent = await sendOTPEmail(email, name, otp);

    console.log(`📱 OTP for ${phoneNumber}: ${otp}`);
    console.log(`📧 OTP email sent: ${emailSent}`);

    return res.status(200).json({
      success: true,
      message: smsSent
        ? `OTP sent to +91 ${phoneNumber} via SMS and ${email}`
        : `OTP sent to ${email}. Check your email inbox.`,
      phoneNumber,
      email,
      devOTP: otp,
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    return res.status(500).json({ message: err.message || "Server Error" });
  }
};

// ─────────────────────────────────────────
// STEP 2: VERIFY OTP → Save user + Send success email
// ─────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    const record = otpStore[phoneNumber];

    if (!record) {
      return res.status(400).json({ message: "OTP not found. Please register again." });
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[phoneNumber];
      return res.status(400).json({ message: "OTP has expired. Please register again." });
    }

    if (record.otp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // ✅ Save user to DB
    const user = await User.create(record.userData);
    delete otpStore[phoneNumber];
    console.log("✅ User saved:", user.name);

    // ✅ Send success email after registration
    await sendSuccessEmail(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful! A confirmation email has been sent.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        state: user.state,
        gender: user.gender,
      },
    });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err.message);
    return res.status(500).json({ message: err.message || "Server Error" });
  }
};

// ─────────────────────────────────────────
// STEP 3: RESEND OTP
// ─────────────────────────────────────────
const resendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const record = otpStore[phoneNumber];

    if (!record) {
      return res.status(400).json({ message: "Session expired. Please register again." });
    }

    const otp = generateOTP();
    otpStore[phoneNumber].otp = otp;
    otpStore[phoneNumber].expiresAt = Date.now() + 10 * 60 * 1000;

    // ✅ Resend to both SMS and email
    await sendSMS(phoneNumber, otp);
    await sendOTPEmail(record.userData.email, record.userData.name, otp);

    console.log(`📱 Resend OTP for ${phoneNumber}: ${otp}`);

    return res.json({
      success: true,
      message: "New OTP sent to your email.",
      // devOTP: otp,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message || "Server Error" });
  }
};

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        state: user.state,
        gender: user.gender,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    return res.status(500).json({ message: err.message || "Server Error" });
  }
};

module.exports = { register, verifyOTP, resendOTP, login };
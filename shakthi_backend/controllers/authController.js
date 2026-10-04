const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const otpStore = {};

// --------------------------------------------------
// EMAIL TRANSPORTER
// --------------------------------------------------

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true,
  logger: true,
});

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const normalizeAadhaar = (aadhaarNumber) => {
  return aadhaarNumber?.toString().replace(/\D/g, "").slice(0, 12);
};

const normalizeState = (state) => {
  if (!state) return "";

  return state
    .toString()
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalizeGender = (gender) => {
  if (!gender) return "";

  return gender.toString().trim().toLowerCase();
};

// --------------------------------------------------
// SEND OTP EMAIL
// --------------------------------------------------

const sendOTPEmail = async (email, name, otp) => {
  try {
    console.log("📧 Attempting to send OTP email to:", email);

    if (
      !process.env.EMAIL_USER ||
      process.env.EMAIL_USER === "yourgmail@gmail.com"
    ) {
      console.log("⚠️ Email not configured. Skipping email.");
      return false;
    }

    const info = await transporter.sendMail({
      from: `"Shakthi Yojana" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Registration - Shakthi Yojana",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#2563eb;text-align:center;">
            🏛️ Shakthi Yojana
          </h2>

          <h3 style="text-align:center;">
            Email Verification
          </h3>

          <p>Hello <strong>${name}</strong>,</p>

          <p>Your OTP for registration is:</p>

          <div style="text-align:center;margin:24px 0;">
            <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#2563eb;background:#eff6ff;padding:16px 24px;border-radius:10px;">
              ${otp}
            </span>
          </div>

          <p style="color:#6b7280;font-size:14px;">
            This OTP is valid for <strong>10 minutes</strong>.
          </p>

          <p style="color:#6b7280;font-size:14px;">
            If you did not request this, please ignore this email.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>

          <p style="color:#9ca3af;font-size:12px;text-align:center;">
            Shakthi Yojana — Karnataka Government Scheme
          </p>
        </div>
      `,
    });

    console.log("✅ OTP email sent successfully:", info.response);

    return true;
  } catch (err) {
    console.error("❌ OTP email failed:", err);
    return false;
  }
};

// --------------------------------------------------
// SEND SUCCESS EMAIL
// --------------------------------------------------

const sendSuccessEmail = async (user) => {
  try {
    if (
      !process.env.EMAIL_USER ||
      process.env.EMAIL_USER === "yourgmail@gmail.com"
    ) {
      console.log("⚠️ Email not configured. Skipping success email.");
      return false;
    }

    await transporter.sendMail({
      from: `"Shakthi Yojana" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Registration Successful - Shakthi Yojana",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;border:1px solid #e5e7eb;border-radius:12px;">

          <h2 style="color:#16a34a;text-align:center;">
            ✅ Registration Successful!
          </h2>

          <h3 style="text-align:center;color:#2563eb;">
            🏛️ Shakthi Yojana
          </h3>

          <p>Hello <strong>${user.name}</strong>,</p>

          <p>
            Your account has been successfully created.
          </p>

          <table style="width:100%;border-collapse:collapse;margin:16px 0;">

            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:10px;color:#6b7280;">
                Name
              </td>
              <td style="padding:10px;font-weight:600;">
                ${user.name}
              </td>
            </tr>

            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:10px;color:#6b7280;">
                Email
              </td>
              <td style="padding:10px;font-weight:600;">
                ${user.email}
              </td>
            </tr>

            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:10px;color:#6b7280;">
                Phone
              </td>
              <td style="padding:10px;font-weight:600;">
                +91 ${user.phoneNumber}
              </td>
            </tr>

            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:10px;color:#6b7280;">
                Role
              </td>
              <td style="padding:10px;font-weight:600;">
                ${user.role}
              </td>
            </tr>

            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:10px;color:#6b7280;">
                State
              </td>
              <td style="padding:10px;font-weight:600;">
                ${user.state}
              </td>
            </tr>

            <tr>
              <td style="padding:10px;color:#6b7280;">
                Gender
              </td>
              <td style="padding:10px;font-weight:600;">
                ${user.gender}
              </td>
            </tr>

          </table>

          <div style="text-align:center;margin:24px 0;">
            <a
              href="http://localhost:3000/login"
              style="background:#2563eb;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;"
            >
              Login Now →
            </a>
          </div>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>

          <p style="color:#9ca3af;font-size:12px;text-align:center;">
            Shakthi Yojana — Karnataka Government Scheme
          </p>

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

// --------------------------------------------------
// STEP 1: REGISTER → SEND OTP
// --------------------------------------------------

const register = async (req, res) => {
  try {
    console.log("📥 Register request:", req.body);

    const {
      name,
      email,
      phoneNumber,
      password,
      role,
      aadhaarNumber,
      state,
      gender,
    } = req.body;

    // -----------------------------------------------
    // REQUIRED FIELD VALIDATION
    // -----------------------------------------------

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !password ||
      !aadhaarNumber ||
      !state ||
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone number, password, Aadhaar number, state and gender are required.",
      });
    }

    // -----------------------------------------------
    // NORMALIZE DATA
    // -----------------------------------------------

    const cleanAadhaar = normalizeAadhaar(aadhaarNumber);
    const cleanState = normalizeState(state);
    const cleanGender = normalizeGender(gender);

    // -----------------------------------------------
    // VALIDATE PHONE
    // -----------------------------------------------

    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    // -----------------------------------------------
    // VALIDATE AADHAAR FORMAT
    // -----------------------------------------------

    if (!/^\d{12}$/.test(cleanAadhaar)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 12-digit Aadhaar number.",
      });
    }

    // -----------------------------------------------
    // VALIDATE GENDER
    // -----------------------------------------------

    if (!["male", "female", "other"].includes(cleanGender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender selected.",
      });
    }

    // -----------------------------------------------
    // VALIDATE STATE
    // -----------------------------------------------

    const allowedStates = [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Other",
    ];

    if (!allowedStates.includes(cleanState)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid state.",
      });
    }

    // -----------------------------------------------
    // CHECK EMAIL
    // -----------------------------------------------

    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // -----------------------------------------------
    // CHECK PHONE
    // -----------------------------------------------

    const existingPhone = await User.findOne({
      phoneNumber,
    });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered.",
      });
    }

    // -----------------------------------------------
    // CHECK AADHAAR
    // -----------------------------------------------

    const existingAadhaar = await User.findOne({
      aadhaarNumber: cleanAadhaar,
    });

    if (existingAadhaar) {
      return res.status(400).json({
        success: false,
        message:
          "This Aadhaar number is already registered in the Shakthi Yojana application.",
      });
    }

    // -----------------------------------------------
    // CREATE OTP
    // -----------------------------------------------

    const otp = generateOTP();

    const expiresAt = Date.now() + 10 * 60 * 1000;

    const hashedPassword = await bcrypt.hash(password, 10);

    // -----------------------------------------------
    // TEMPORARY REGISTRATION DATA
    // -----------------------------------------------

    otpStore[phoneNumber] = {
      otp,
      expiresAt,

      userData: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phoneNumber,
        password: hashedPassword,
        role: role || "user",
        aadhaarNumber: cleanAadhaar,

        // IMPORTANT:
        // No automatic Karnataka default.
        state: cleanState,

        // IMPORTANT:
        // No automatic female default.
        gender: cleanGender,
      },
    };

    // -----------------------------------------------
    // SEND OTP
    // -----------------------------------------------

    const emailSent = await sendOTPEmail(email, name, otp);

    console.log(`📧 Registration OTP for ${email}: ${otp}`);

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: `OTP sent to ${email}. Check your email inbox.`,
        phoneNumber,
        email,
        devOTP: otp,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to send OTP email. Please check your email configuration.",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};

// --------------------------------------------------
// STEP 2: VERIFY OTP
// --------------------------------------------------

const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });
    }

    const record = otpStore[phoneNumber];

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please register again.",
      });
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[phoneNumber];

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please register again.",
      });
    }

    if (record.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // -----------------------------------------------
    // FINAL DUPLICATE CHECK
    // -----------------------------------------------

    const existingAadhaar = await User.findOne({
      aadhaarNumber: record.userData.aadhaarNumber,
    });

    if (existingAadhaar) {
      delete otpStore[phoneNumber];

      return res.status(400).json({
        success: false,
        message:
          "This Aadhaar number is already registered in the application.",
      });
    }

    // -----------------------------------------------
    // SAVE USER
    // -----------------------------------------------

    const user = await User.create(record.userData);

    delete otpStore[phoneNumber];

    console.log("✅ User saved:", user.name);

    await sendSuccessEmail(user);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful! A confirmation email has been sent.",

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

    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};

// --------------------------------------------------
// STEP 3: RESEND OTP
// --------------------------------------------------

const resendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const record = otpStore[phoneNumber];

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Session expired. Please register again.",
      });
    }

    const otp = generateOTP();

    otpStore[phoneNumber].otp = otp;
    otpStore[phoneNumber].expiresAt =
      Date.now() + 10 * 60 * 1000;

    await sendOTPEmail(
      record.userData.email,
      record.userData.name,
      otp
    );

    console.log(`📱 Resend OTP for ${phoneNumber}: ${otp}`);

    return res.json({
      success: true,
      message: "New OTP sent to your email.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};

// --------------------------------------------------
// LOGIN
// --------------------------------------------------

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "secretkey",
      {
        expiresIn: "1d",
      }
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

    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};

// --------------------------------------------------
// EXPORT
// --------------------------------------------------

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
};
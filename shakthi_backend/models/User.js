const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // ✅ NEW: Phone number field
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "student"],
      default: "user",
    },
    aadhaarNumber: {
      type: String,
      required: true,
      unique: true,
    },
    state: {
      type: String,
      default: "Karnataka",
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "female",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
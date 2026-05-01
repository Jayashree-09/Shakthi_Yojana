const User = require("../models/User");
const ScanLog = require("../models/ScanLog");

// ✅ NEW: Universal Aadhaar normalizer (handles spaces, symbols, OCR noise)
const normalizeAadhaar = (num) =>
  num?.toString().replace(/\D/g, "").slice(0, 12);

exports.verifyAadhaar = async (aadhaarNumber, location = "Unknown") => {
  try {
    // ✅ APPLY NORMALIZATION HERE
    const cleanAadhaar = normalizeAadhaar(aadhaarNumber);

    console.log("=== AADHAAR VERIFICATION ===");
    console.log("Incoming RAW:", aadhaarNumber);
    console.log("Normalized:", cleanAadhaar);

    if (cleanAadhaar.length !== 12) {
      return {
        status: "invalid",
        code: "INVALID_FORMAT",
        belongsToKarnataka: false,
        eligible: false,
        announcement: "Invalid Aadhaar number detected. Please try again.",
        user: null,
      };
    }

    // ✅ ALWAYS MATCH USING CLEAN VALUE
    let user = await User.findOne({
      aadhaarNumber: cleanAadhaar,
    });

    console.log(
      "User found:",
      user
        ? `${user.name} | gender: ${user.gender} | state: ${user.state}`
        : "NOT FOUND"
    );

    // ❌ NOT REGISTERED
    if (!user) {
      return {
        status: "invalid",
        code: "NOT_REGISTERED",
        belongsToKarnataka: false,
        eligible: false,
        announcement:
          "This person is not registered under the Shakthi Yojana scheme.",
        user: null,
      };
    }

    // ✅ GENDER CHECK (unchanged)
    const gender = user.gender?.toLowerCase().trim();
    const isFemale = gender === "female" || gender === "f";

    if (!isFemale) {
      return {
        status: "invalid",
        code: "GENDER_MISMATCH",
        belongsToKarnataka: false,
        eligible: false,
        announcement: `${user.name} is not eligible. This scheme is only for women.`,
        user: {
          name: user.name,
          state: user.state,
          gender: user.gender,
        },
      };
    }

    // ✅ STATE CHECK (unchanged)
    const isKarnataka =
      user.state?.toLowerCase().trim() === "karnataka";

    if (!isKarnataka) {
      return {
        status: "invalid",
        code: "STATE_MISMATCH",
        belongsToKarnataka: false,
        eligible: false,
        announcement: `${user.name} does not belong to Karnataka.`,
        user: {
          name: user.name,
          state: user.state,
          gender: user.gender,
        },
      };
    }

    // ✅ RECENT SCAN CHECK (unchanged logic, but uses clean value)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const recentScan = await ScanLog.findOne({
      aadhaarNumber: cleanAadhaar,
      scannedAt: { $gte: tenMinutesAgo },
    }).sort({ scannedAt: -1 });

    if (recentScan && recentScan.location !== location) {
      return {
        status: "suspicious",
        code: "SUSPICIOUS_LOCATION",
        belongsToKarnataka: true,
        eligible: false,
        announcement: `Warning! ${user.name}'s Aadhaar was recently scanned at ${recentScan.location}.`,
        user: {
          name: user.name,
          state: user.state,
          gender: user.gender,
        },
      };
    }

    // if (recentScan && recentScan.location === location) {
    //   return {
    //     status: "duplicate",
    //     code: "DUPLICATE_SCAN",
    //     belongsToKarnataka: true,
    //     eligible: false,
    //     announcement: `Warning! ${user.name} was already scanned recently.`,
    //     user: {
    //       name: user.name,
    //       state: user.state,
    //       gender: user.gender,
    //     },
    //   };
    // }

    // ✅ FINAL SUCCESS (unchanged)
    // ✅ FINAL SUCCESS (UPDATED ANNOUNCEMENT ONLY)
return {
  status: "valid",
  code: "ELIGIBLE",
  belongsToKarnataka: true,
  eligible: true,
  announcement: `This woman belongs to Karnataka. Aadhaar card is valid. Name: ${user.name}. She is eligible for Shakthi Yojana benefits.`,
  user: {
    name: user.name,
    state: user.state,
    gender: user.gender,
  },
};

  } catch (error) {
    console.error("Error:", error);
    return {
      status: "error",
      code: "SERVER_ERROR",
      belongsToKarnataka: false,
      eligible: false,
      announcement: "Verification failed. Try again.",
      user: null,
    };
  }
};
const User = require("../models/User");
const ScanLog = require("../models/ScanLog");

// --------------------------------------------------
// NORMALIZE AADHAAR
// --------------------------------------------------

const normalizeAadhaar = (num) => {
  if (!num) return "";

  return num
    .toString()
    .replace(/\D/g, "")
    .slice(0, 12);
};

// --------------------------------------------------
// NORMALIZE LOCATION
// --------------------------------------------------

const normalizeLocation = (location) => {
  if (!location) return "Unknown";

  return location.toString().trim();
};

// --------------------------------------------------
// VERIFY AADHAAR
// --------------------------------------------------

exports.verifyAadhaar = async (
  aadhaarNumber,
  location = "Unknown"
) => {
  try {
    const cleanAadhaar = normalizeAadhaar(aadhaarNumber);
    const cleanLocation = normalizeLocation(location);

    console.log("=================================");
    console.log("AADHAAR VERIFICATION");
    console.log("=================================");
    console.log("Incoming RAW:", aadhaarNumber);
    console.log("Normalized:", cleanAadhaar);
    console.log("Location:", cleanLocation);

    // ------------------------------------------------
    // 1. FORMAT VALIDATION
    // ------------------------------------------------

    if (!/^\d{12}$/.test(cleanAadhaar)) {
      return {
        status: "invalid",
        code: "INVALID_FORMAT",

        belongsToKarnataka: false,
        eligible: false,

        announcement:
          "Invalid Aadhaar number detected. Please enter a valid 12-digit Aadhaar number.",

        user: null,
      };
    }

    // ------------------------------------------------
    // 2. FIND APPLICATION REGISTRATION
    // ------------------------------------------------

    const user = await User.findOne({
      aadhaarNumber: cleanAadhaar,
    }).select("-password");

    console.log(
      "Application record:",
      user
        ? `${user.name} | gender=${user.gender} | state=${user.state}`
        : "NOT REGISTERED"
    );

    // ------------------------------------------------
    // 3. NOT REGISTERED
    // ------------------------------------------------

    if (!user) {
      return {
        status: "not_registered",
        code: "NOT_REGISTERED",

        belongsToKarnataka: null,
        eligible: false,

        announcement:
          "This Aadhaar number is not registered in the Shakthi Yojana application. Please complete registration first.",

        user: null,
      };
    }

    // ------------------------------------------------
    // 4. CHECK DATABASE DATA EXISTS
    // ------------------------------------------------

    if (!user.gender || !user.state) {
      return {
        status: "invalid",
        code: "INCOMPLETE_BENEFICIARY_DATA",

        belongsToKarnataka: null,
        eligible: false,

        announcement:
          "Beneficiary information is incomplete. Please update the registration details.",

        user: {
          name: user.name,
          state: user.state || null,
          gender: user.gender || null,
        },
      };
    }

    // ------------------------------------------------
    // 5. GENDER CHECK
    // ------------------------------------------------

    const gender = user.gender.toLowerCase().trim();

    const isFemale = gender === "female";

    if (!isFemale) {
      return {
        status: "not_eligible",
        code: "GENDER_MISMATCH",

        belongsToKarnataka:
          user.state.toLowerCase().trim() === "karnataka",

        eligible: false,

        announcement:
          `${user.name} is not eligible because this Shakthi Yojana application is only for women.`,

        user: {
          name: user.name,
          state: user.state,
          gender: user.gender,
        },
      };
    }

    // ------------------------------------------------
    // 6. STATE CHECK
    // ------------------------------------------------

    const isKarnataka =
      user.state.toLowerCase().trim() === "karnataka";

    if (!isKarnataka) {
      return {
        status: "not_eligible",
        code: "STATE_MISMATCH",

        belongsToKarnataka: false,
        eligible: false,

        announcement:
          `${user.name} does not belong to Karnataka according to the information registered in the application.`,

        user: {
          name: user.name,
          state: user.state,
          gender: user.gender,
        },
      };
    }

    // ------------------------------------------------
    // 7. RECENT SCAN CHECK
    // ------------------------------------------------

    const tenMinutesAgo = new Date(
      Date.now() - 10 * 60 * 1000
    );

    const recentScan = await ScanLog.findOne({
      aadhaarNumber: cleanAadhaar,

      scannedAt: {
        $gte: tenMinutesAgo,
      },
    }).sort({
      scannedAt: -1,
    });

    if (
      recentScan &&
      recentScan.location !== cleanLocation
    ) {
      return {
        status: "suspicious",
        code: "SUSPICIOUS_LOCATION",

        belongsToKarnataka: true,
        eligible: false,

        announcement:
          `Warning! ${user.name}'s Aadhaar was recently scanned at ${recentScan.location}.`,

        user: {
          name: user.name,
          state: user.state,
          gender: user.gender,
        },
      };
    }

    // ------------------------------------------------
    // 8. FINAL APPLICATION ELIGIBILITY
    // ------------------------------------------------

    return {
      status: "valid",

      code: "ELIGIBLE",

      belongsToKarnataka: true,

      eligible: true,

      announcement:
        `This woman is registered as belonging to Karnataka. Name: ${user.name}. She is eligible for Shakthi Yojana benefits.`,

      user: {
        name: user.name,
        state: user.state,
        gender: user.gender,
      },
    };
  } catch (error) {
    console.error(
      "AADHAAR VERIFICATION ERROR:",
      error
    );

    return {
      status: "error",

      code: "SERVER_ERROR",

      belongsToKarnataka: null,

      eligible: false,

      announcement:
        "Verification failed. Please try again.",

      user: null,
    };
  }
};
// const User = require("../models/User");

// exports.verifyAadhaar = async (aadhaarNumber) => {
//   // Simulated check (you can replace with real govt API later)
//   const user = await User.findOne({ aadhaarNumber });
  

//   if (!user) {
//     return { status: "invalid" };
//   }

//   return { status: "valid", user };
// };



// const User = require("../models/User");

// /**
//  * Verifies an Aadhaar number and returns:
//  * - status: "valid" | "invalid"
//  * - belongsToKarnataka: true | false
//  * - announcement: text string for voice reading
//  * - user: user object (if found)
//  */
// exports.verifyAadhaar = async (aadhaarNumber) => {
//   const user = await User.findOne({ aadhaarNumber });

//   if (!user) {
//     return {
//       status: "invalid",
//       belongsToKarnataka: false,
//       announcement: "Aadhaar card is invalid. This person is not registered in the system.",
//     };
//   }

//   const belongsToKarnataka =
//     user.state && user.state.toLowerCase() === "karnataka";

//   // ✅ Gender-aware announcement
//   const pronoun =
//     user.gender === "female"
//       ? "This woman"
//       : user.gender === "male"
//       ? "This man"
//       : "This person";

//   let announcement = "";

//   if (belongsToKarnataka) {
//     announcement = `${pronoun} belongs to Karnataka. Aadhaar card is valid. Name: ${user.name}.`;
//   } else {
//     announcement = `${pronoun} does not belong to Karnataka. ${pronoun} belongs to ${user.state || "an unknown state"}. Aadhaar card is invalid for this scheme.`;
//   }

//   return {
//     status: "valid",
//     belongsToKarnataka,
//     announcement,
//     user: {
//       id: user._id,
//       name: user.name,
//       state: user.state,
//       gender: user.gender,
//     },
//   };
// };












// const User = require("../models/User");
// const ScanLog = require("../models/ScanLog");

// /**
//  * Verifies Aadhaar with full checks:
//  * - Not registered check
//  * - Karnataka eligibility
//  * - Gender check (must be female for Shakthi Yojana)
//  * - Duplicate detection (same Aadhaar scanned before)
//  * - Daily usage limit (max 2 per day)
//  * - Suspicious location detection
//  */
// exports.verifyAadhaar = async (aadhaarNumber, location = "Unknown") => {

//   // ─── STEP 1: Check if user is registered ───
//   const user = await User.findOne({ aadhaarNumber });

//   if (!user) {
//     return {
//       status: "invalid",
//       reason: "not_registered",
//       belongsToKarnataka: false,
//       eligible: false,
//       announcement: "This person is not registered under the Shakthi Yojana scheme. Please register first.",
//       user: null,
//     };
//   }

//   // ─── STEP 2: Check Karnataka ───
//   const belongsToKarnataka = user.state?.toLowerCase() === "karnataka";

//   if (!belongsToKarnataka) {
//     return {
//       status: "invalid",
//       reason: "not_karnataka",
//       belongsToKarnataka: false,
//       eligible: false,
//       announcement: `This person does not belong to Karnataka. They belong to ${user.state || "an unknown state"}. Not eligible for this scheme.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//     };
//   }

//   // ─── STEP 3: Check gender (Shakthi Yojana is for females) ───
//   if (user.gender !== "female") {
//     return {
//       status: "invalid",
//       reason: "gender_mismatch",
//       belongsToKarnataka: true,
//       eligible: false,
//       announcement: `${user.name} is not eligible for Shakthi Yojana. This scheme is only for women.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//     };
//   }

//   // ─── STEP 4: Duplicate detection — scanned before today ───
//   const startOfDay = new Date();
//   startOfDay.setHours(0, 0, 0, 0);

//   const todayScans = await ScanLog.find({
//     aadhaarNumber,
//     scannedAt: { $gte: startOfDay },
//   });

//   // ─── STEP 5: Daily limit check (max 2 per day) ───
//   if (todayScans.length >= 2) {
//     return {
//       status: "limit_exceeded",
//       reason: "daily_limit_exceeded",
//       belongsToKarnataka: true,
//       eligible: false,
//       announcement: `Warning! ${user.name} has already used this benefit ${todayScans.length} times today. Daily limit of 2 exceeded. Possible misuse detected.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//       scanCount: todayScans.length,
//     };
//   }

//   // ─── STEP 6: Suspicious location check ───
//   // If same Aadhaar scanned in different location within last 10 minutes
//   const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
//   const recentScan = await ScanLog.findOne({
//     aadhaarNumber,
//     scannedAt: { $gte: tenMinutesAgo },
//   });

//   if (recentScan && recentScan.location !== location) {
//     return {
//       status: "suspicious",
//       reason: "suspicious_location",
//       belongsToKarnataka: true,
//       eligible: false,
//       announcement: `Warning! Suspicious activity detected. ${user.name}'s Aadhaar was recently scanned at ${recentScan.location} and is now being scanned at ${location}. Please verify identity.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//       previousLocation: recentScan.location,
//     };
//   }

//   // ─── STEP 7: Duplicate scan today (1 time already) ───
//   if (todayScans.length === 1) {
//     return {
//       status: "duplicate",
//       reason: "already_scanned_today",
//       belongsToKarnataka: true,
//       eligible: true, // still eligible but warn
//       announcement: `Note: ${user.name} has already been scanned once today at ${todayScans[0].location}. This is their second scan today.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//       scanCount: todayScans.length,
//     };
//   }

//   // ─── STEP 8: All checks passed — ELIGIBLE ✅ ───
//   return {
//     status: "valid",
//     reason: "eligible",
//     belongsToKarnataka: true,
//     eligible: true,
//     announcement: `This woman belongs to Karnataka. Aadhaar card is valid. Name: ${user.name}. She is eligible for Shakthi Yojana benefits.`,
//     user: { name: user.name, state: user.state, gender: user.gender },
//   };
// };






// const User = require("../models/User");
// const ScanLog = require("../models/ScanLog");

// exports.verifyAadhaar = async (aadhaarNumber, location = "Unknown") => {

//   // ─── STEP 1: Check if user is registered ───
//   const user = await User.findOne({ aadhaarNumber });

//   if (!user) {
//     return {
//       status: "invalid",
//       reason: "not_registered",
//       belongsToKarnataka: false,
//       eligible: false,
//       announcement: "This person is not registered under the Shakthi Yojana scheme. Please register first.",
//       user: null,
//     };
//   }

//   // ─── STEP 2: Check Karnataka ───
//   const belongsToKarnataka = user.state?.toLowerCase() === "karnataka";

//   if (!belongsToKarnataka) {
//     return {
//       status: "invalid",
//       reason: "not_karnataka",
//       belongsToKarnataka: false,
//       eligible: false,
//       announcement: `This person does not belong to Karnataka. They belong to ${user.state || "an unknown state"}. Not eligible for this scheme.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//     };
//   }

//   // ─── STEP 3: Check gender (Shakthi Yojana is for females) ───
//   if (user.gender !== "female") {
//     return {
//       status: "invalid",
//       reason: "gender_mismatch",
//       belongsToKarnataka: true,
//       eligible: false,
//       announcement: `${user.name} is not eligible for Shakthi Yojana. This scheme is only for women.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//     };
//   }

//   // ─── STEP 4: Suspicious location check ───
//   // Same Aadhaar scanned at different location within last 10 minutes
//   const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
//   const recentScan = await ScanLog.findOne({
//     aadhaarNumber,
//     scannedAt: { $gte: tenMinutesAgo },
//   });

//   if (recentScan && recentScan.location !== location) {
//     return {
//       status: "suspicious",
//       reason: "suspicious_location",
//       belongsToKarnataka: true,
//       eligible: false,
//       announcement: `Warning! Suspicious activity detected. ${user.name}'s Aadhaar was recently scanned at ${recentScan.location} and is now being scanned at ${location}. Please verify identity.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//       previousLocation: recentScan.location,
//     };
//   }

//   // ─── STEP 5: All checks passed — ELIGIBLE ✅ ───
//   return {
//     status: "valid",
//     reason: "eligible",
//     belongsToKarnataka: true,
//     eligible: true,
//     announcement: `This woman belongs to Karnataka. Aadhaar card is valid. Name: ${user.name}. She is eligible for Shakthi Yojana benefits.`,
//     user: { name: user.name, state: user.state, gender: user.gender },
//   };
// };










// const User = require("../models/User");
// const ScanLog = require("../models/ScanLog");

// const DAILY_LIMIT = 2;

// exports.verifyAadhaar = async (aadhaarNumber, location = "Unknown") => {

//   // ── STEP 1: Check if Aadhaar is registered ──
//   const user = await User.findOne({ aadhaarNumber });

//   // ✅ Debug log — always print what we found
//   console.log("=== AADHAAR VERIFICATION ===");
//   console.log("Aadhaar:", aadhaarNumber);
//   console.log("User found:", user ? `${user.name} | gender: ${user.gender} | state: ${user.state}` : "NOT FOUND");

//   if (!user) {
//     return {
//       status: "invalid",
//       code: "NOT_REGISTERED",
//       belongsToKarnataka: false,
//       eligible: false,
//       announcement: "This person is not registered under the Shakthi Yojana scheme. Aadhaar number not found in the system.",
//       user: null,
//     };
//   }

//   // ── STEP 2: ✅ Gender check FIRST (scheme is ONLY for women) ──
//   console.log("Gender check:", user.gender);

//   if (user.gender !== "female") {
//     console.log("❌ Gender mismatch — not female");
//     return {
//       status: "invalid",
//       code: "GENDER_MISMATCH",
//       belongsToKarnataka: false,
//       eligible: false,
//       announcement: `${user.name} is not eligible for Shakthi Yojana. This scheme is only for women. This person is registered as ${user.gender}.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//     };
//   }

//   // ── STEP 3: Check Karnataka state ──
//   const isKarnataka = user.state && user.state.toLowerCase() === "karnataka";
//   console.log("Karnataka check:", user.state, "→", isKarnataka);

//   if (!isKarnataka) {
//     return {
//       status: "invalid",
//       code: "STATE_MISMATCH",
//       belongsToKarnataka: false,
//       eligible: false,
//       announcement: `This woman named ${user.name} does not belong to Karnataka. She belongs to ${user.state || "an unknown state"}. Not eligible for this scheme.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//     };
//   }

//   // ── STEP 4: Suspicious location check ──
//   const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
//   const recentScan = await ScanLog.findOne({
//     aadhaarNumber,
//     scannedAt: { $gte: tenMinutesAgo },
//   }).sort({ scannedAt: -1 });

//   if (recentScan && recentScan.location !== location) {
//     return {
//       status: "suspicious",
//       code: "SUSPICIOUS_LOCATION",
//       belongsToKarnataka: true,
//       eligible: false,
//       announcement: `Warning! Suspicious activity detected. ${user.name}'s Aadhaar was recently scanned at ${recentScan.location} and is now being scanned at ${location}. Please verify identity manually.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//       previousLocation: recentScan.location,
//     };
//   }

//   // ── STEP 5: Duplicate scan check ──
//   if (recentScan && recentScan.location === location) {
//     return {
//       status: "duplicate",
//       code: "DUPLICATE_SCAN",
//       belongsToKarnataka: true,
//       eligible: false,
//       announcement: `Warning! This woman named ${user.name} was already scanned recently. Possible duplicate scan. Please verify.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//       lastScannedAt: recentScan.scannedAt,
//     };
//   }

//   // ── STEP 6: Daily limit check ──
//   const todayStart = new Date();
//   todayStart.setHours(0, 0, 0, 0);
//   const todayEnd = new Date();
//   todayEnd.setHours(23, 59, 59, 999);

//   const todayScans = await ScanLog.find({
//     aadhaarNumber,
//     scannedAt: { $gte: todayStart, $lte: todayEnd },
//     status: "valid",
//   });

//   if (todayScans.length >= DAILY_LIMIT) {
//     return {
//       status: "limit_exceeded",
//       code: "DAILY_LIMIT_EXCEEDED",
//       belongsToKarnataka: true,
//       eligible: false,
//       announcement: `Warning! This woman named ${user.name} has already used the benefit ${todayScans.length} times today. Daily limit of ${DAILY_LIMIT} reached. Possible misuse detected.`,
//       user: { name: user.name, state: user.state, gender: user.gender },
//       usageCount: todayScans.length,
//       limit: DAILY_LIMIT,
//     };
//   }

//   // ── STEP 7: All checks passed — ELIGIBLE ✅ ──
//   const usedToday = todayScans.length;
//   const remaining = DAILY_LIMIT - usedToday - 1;

//   console.log("✅ All checks passed — ELIGIBLE");

//   return {
//     status: "valid",
//     code: "ELIGIBLE",
//     belongsToKarnataka: true,
//     eligible: true,
//     announcement: `This woman named ${user.name} belongs to Karnataka. Aadhaar card is valid. She is eligible for Shakthi Yojana benefits. ${remaining > 0 ? `${remaining} benefit remaining today.` : "Last benefit for today."}`,
//     user: { name: user.name, state: user.state, gender: user.gender },
//     usageCount: usedToday + 1,
//     remainingToday: remaining,
//   };
// };










// const User = require("../models/User");
// const ScanLog = require("../models/ScanLog");

// exports.verifyAadhaar = async (aadhaarNumber, location = "Unknown") => {

//   try {
//     // ── STEP 1: Check if Aadhaar is registered ──
//     const user = await User.findOne({ aadhaarNumber });

//     console.log("=== AADHAAR VERIFICATION ===");
//     console.log("Aadhaar:", aadhaarNumber);
//     console.log(
//       "User found:",
//       user
//         ? `${user.name} | gender: ${user.gender} | state: ${user.state}`
//         : "NOT FOUND"
//     );

//     if (!user) {
//       return {
//         status: "invalid",
//         code: "NOT_REGISTERED",
//         belongsToKarnataka: false,
//         eligible: false,
//         announcement:
//           "This person is not registered under the Shakthi Yojana scheme. Aadhaar number not found in the system.",
//         user: null,
//       };
//     }

//     // ── STEP 2: ✅ Gender check (FIXED) ──
//     console.log("RAW gender from DB:", user.gender);

//     const gender = user.gender?.toLowerCase().trim();
//     console.log("Normalized Gender:", gender);

//     const isFemale = gender === "female" || gender === "f";

//     if (!isFemale) {
//       console.log("❌ Gender mismatch — not female");

//       return {
//         status: "invalid",
//         code: "GENDER_MISMATCH",
//         belongsToKarnataka: false,
//         eligible: false,
//         announcement: `${user.name} is not eligible for Shakthi Yojana. This scheme is only for women. This person is registered as ${user.gender}.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//       };
//     }

//     // ── STEP 3: Check Karnataka state ──
//     const isKarnataka =
//       user.state && user.state.toLowerCase().trim() === "karnataka";

//     console.log("Karnataka check:", user.state, "→", isKarnataka);

//     if (!isKarnataka) {
//       return {
//         status: "invalid",
//         code: "STATE_MISMATCH",
//         belongsToKarnataka: false,
//         eligible: false,
//         announcement: `This woman named ${user.name} does not belong to Karnataka. She belongs to ${user.state || "an unknown state"}. Not eligible for this scheme.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//       };
//     }

//     // ── STEP 4: Suspicious location check ──
//     const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

//     const recentScan = await ScanLog.findOne({
//       aadhaarNumber,
//       scannedAt: { $gte: tenMinutesAgo },
//     }).sort({ scannedAt: -1 });

//     if (recentScan && recentScan.location !== location) {
//       return {
//         status: "suspicious",
//         code: "SUSPICIOUS_LOCATION",
//         belongsToKarnataka: true,
//         eligible: false,
//         announcement: `Warning! Suspicious activity detected. ${user.name}'s Aadhaar was recently scanned at ${recentScan.location} and is now being scanned at ${location}. Please verify identity manually.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//         previousLocation: recentScan.location,
//       };
//     }

//     // ── STEP 5: Duplicate scan check ──
//     if (recentScan && recentScan.location === location) {
//       return {
//         status: "duplicate",
//         code: "DUPLICATE_SCAN",
//         belongsToKarnataka: true,
//         eligible: false,
//         announcement: `Warning! This woman named ${user.name} was already scanned recently. Possible duplicate scan. Please verify.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//         lastScannedAt: recentScan.scannedAt,
//       };
//     }

//     // ── STEP 6: ✅ ELIGIBLE (Daily limit removed) ──
//     console.log("✅ All checks passed — ELIGIBLE");

//     return {
//       status: "valid",
//       code: "ELIGIBLE",
//       belongsToKarnataka: true,
//       eligible: true,
//       announcement: `This woman named ${user.name} belongs to Karnataka. Aadhaar card is valid. She is eligible for Shakthi Yojana benefits.`,
//       user: {
//         name: user.name,
//         state: user.state,
//         gender: user.gender,
//       },
//     };

//   } catch (error) {
//     console.error("❌ Error in verifyAadhaar:", error);

//     return {
//       status: "error",
//       code: "SERVER_ERROR",
//       belongsToKarnataka: false,
//       eligible: false,
//       announcement: "Something went wrong during verification. Please try again.",
//       user: null,
//     };
//   }
// };





// const User = require("../models/User");
// const ScanLog = require("../models/ScanLog");

// exports.verifyAadhaar = async (aadhaarNumber, location = "Unknown") => {
//   try {
//     // ✅ CLEAN INPUT (VERY IMPORTANT)
//     const cleanAadhaar = aadhaarNumber.toString().replace(/\D/g, "");

//     console.log("=== AADHAAR VERIFICATION ===");
//     console.log("Incoming Aadhaar:", cleanAadhaar);

//     // ✅ SAFE MATCH
//     const user = await User.findOne({
//       aadhaarNumber: cleanAadhaar
//     });

//     console.log(
//       "User found:",
//       user
//         ? `${user.name} | gender: ${user.gender} | state: ${user.state}`
//         : "NOT FOUND"
//     );

//     // ❌ NOT REGISTERED
//     if (!user) {
//       return {
//         status: "invalid",
//         code: "NOT_REGISTERED",
//         belongsToKarnataka: false,
//         eligible: false,
//         announcement:
//           "This person is not registered under the Shakthi Yojana scheme.",
//         user: null,
//       };
//     }

//     // ✅ GENDER CHECK
//     const gender = user.gender?.toLowerCase().trim();
//     const isFemale = gender === "female" || gender === "f";

//     if (!isFemale) {
//       return {
//         status: "invalid",
//         code: "GENDER_MISMATCH",
//         belongsToKarnataka: false,
//         eligible: false,
//         announcement: `${user.name} is not eligible. This scheme is only for women.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//       };
//     }

//     // ✅ STATE CHECK
//     const isKarnataka =
//       user.state?.toLowerCase().trim() === "karnataka";

//     if (!isKarnataka) {
//       return {
//         status: "invalid",
//         code: "STATE_MISMATCH",
//         belongsToKarnataka: false,
//         eligible: false,
//         announcement: `${user.name} does not belong to Karnataka.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//       };
//     }

//     // ✅ RECENT SCAN CHECK
//     const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

//     const recentScan = await ScanLog.findOne({
//       aadhaarNumber: cleanAadhaar,
//       scannedAt: { $gte: tenMinutesAgo },
//     }).sort({ scannedAt: -1 });

//     if (recentScan && recentScan.location !== location) {
//       return {
//         status: "suspicious",
//         code: "SUSPICIOUS_LOCATION",
//         belongsToKarnataka: true,
//         eligible: false,
//         announcement: `Warning! ${user.name}'s Aadhaar was recently scanned at ${recentScan.location}.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//       };
//     }

//     if (recentScan && recentScan.location === location) {
//       return {
//         status: "duplicate",
//         code: "DUPLICATE_SCAN",
//         belongsToKarnataka: true,
//         eligible: false,
//         announcement: `Warning! ${user.name} was already scanned recently.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//       };
//     }

//     // ✅ FINAL SUCCESS
//     return {
//       status: "valid",
//       code: "ELIGIBLE",
//       belongsToKarnataka: true,
//       eligible: true,
//       announcement: `${user.name} belongs to Karnataka. Aadhaar is valid.`,
//       user: {
//         name: user.name,
//         state: user.state,
//         gender: user.gender,
//       },
//     };

//   } catch (error) {
//     console.error("Error:", error);
//     return {
//       status: "error",
//       code: "SERVER_ERROR",
//       belongsToKarnataka: false,
//       eligible: false,
//       announcement: "Verification failed. Try again.",
//       user: null,
//     };
//   }
// };









// const User = require("../models/User");
// const ScanLog = require("../models/ScanLog");

// exports.verifyAadhaar = async (aadhaarNumber, location = "Unknown") => {
//   try {
//     // ✅ CLEAN INPUT (handles OCR garbage)
//     const cleanAadhaar = aadhaarNumber.toString().replace(/\D/g, "").slice(0, 12);

//     console.log("=== AADHAAR VERIFICATION ===");
//     console.log("Incoming Aadhaar:", cleanAadhaar);

//     if (cleanAadhaar.length !== 12) {
//       return {
//         status: "invalid",
//         code: "INVALID_FORMAT",
//         belongsToKarnataka: false,
//         eligible: false,
//         announcement: "Invalid Aadhaar number detected. Please scan again clearly.",
//         user: null,
//       };
//     }

//     // ✅ FLEXIBLE MATCH (FIX FOR OCR ERRORS)
//     let user = await User.findOne({ aadhaarNumber: cleanAadhaar });

//     // 🔥 fallback: try partial match (last 4 digits)
//     if (!user) {
//       console.log("⚠️ Exact match failed, trying fallback...");

//       const last4 = cleanAadhaar.slice(-4);

//       const possibleUsers = await User.find({
//         aadhaarNumber: { $regex: last4 + "$" }
//       });

//       if (possibleUsers.length === 1) {
//         user = possibleUsers[0];
//         console.log("✅ Fallback match found:", user.name);
//       }
//     }

//     console.log(
//       "User found:",
//       user
//         ? `${user.name} | gender: ${user.gender} | state: ${user.state}`
//         : "NOT FOUND"
//     );

//     // ❌ NOT REGISTERED
//     if (!user) {
//       return {
//         status: "invalid",
//         code: "NOT_REGISTERED",
//         belongsToKarnataka: false,
//         eligible: false,
//         announcement:
//           "This person is not registered under the Shakthi Yojana scheme.",
//         user: null,
//       };
//     }

//     // ✅ GENDER CHECK
//     const gender = user.gender?.toLowerCase().trim();
//     const isFemale = gender === "female" || gender === "f";

//     if (!isFemale) {
//       return {
//         status: "invalid",
//         code: "GENDER_MISMATCH",
//         belongsToKarnataka: false,
//         eligible: false,
//         announcement: `${user.name} is not eligible. This scheme is only for women.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//       };
//     }

//     // ✅ STATE CHECK
//     const isKarnataka =
//       user.state?.toLowerCase().trim() === "karnataka";

//     if (!isKarnataka) {
//       return {
//         status: "invalid",
//         code: "STATE_MISMATCH",
//         belongsToKarnataka: false,
//         eligible: false,
//         announcement: `${user.name} does not belong to Karnataka.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//       };
//     }

//     // ✅ RECENT SCAN CHECK (FIXED: allow valid even if duplicate)
//     const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

//     const recentScan = await ScanLog.findOne({
//       aadhaarNumber: user.aadhaarNumber, // 🔥 use DB value (important fix)
//       scannedAt: { $gte: tenMinutesAgo },
//     }).sort({ scannedAt: -1 });

//     if (recentScan && recentScan.location !== location) {
//       return {
//         status: "suspicious",
//         code: "SUSPICIOUS_LOCATION",
//         belongsToKarnataka: true,
//         eligible: true, // ✅ still eligible
//         announcement: `Warning! ${user.name}'s Aadhaar was recently scanned at ${recentScan.location}.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//       };
//     }

//     if (recentScan && recentScan.location === location) {
//       return {
//         status: "duplicate",
//         code: "DUPLICATE_SCAN",
//         belongsToKarnataka: true,
//         eligible: true, // ✅ IMPORTANT FIX
//         announcement: `${user.name} already scanned recently. But Aadhaar is valid.`,
//         user: {
//           name: user.name,
//           state: user.state,
//           gender: user.gender,
//         },
//       };
//     }

//     // ✅ FINAL SUCCESS
//     return {
//       status: "valid",
//       code: "ELIGIBLE",
//       belongsToKarnataka: true,
//       eligible: true,
//       announcement: `${user.name} belongs to Karnataka. Aadhaar is valid.`,
//       user: {
//         name: user.name,
//         state: user.state,
//         gender: user.gender,
//       },
//     };

//   } catch (error) {
//     console.error("Error:", error);
//     return {
//       status: "error",
//       code: "SERVER_ERROR",
//       belongsToKarnataka: false,
//       eligible: false,
//       announcement: "Verification failed. Try again.",
//       user: null,
//     };
//   }
// };








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
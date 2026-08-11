// ══════════════════════════════════════════════════════════════
// CONSTANTS — Exam Is Near by ArkSetu
// Verified against public/index.html production code on 2026-07-08.
// ══════════════════════════════════════════════════════════════

// ── Admin ──────────────────────────────────────────────────────
export const ADMIN_EMAIL = "ayushmantripathi17@gmail.com";

// ── Firebase Cloud Functions base URL ─────────────────────────
export const CF_BASE = "https://asia-south1-exam-is-near.cloudfunctions.net";

// ── Free-tier daily limits ─────────────────────────────────────
export const FREE_LIMITS = {
  AI_MESSAGES:        10,   // AI tutor messages per day
  FLASHCARD_GENERATE: 3,    // AI flashcard generation requests per day
  QUIZ_GENERATE:      3,    // AI quiz generation requests per day
};

// ── Pro plan pricing (INR) ────────────────────────────────────
export const PLAN_PRICE = {
  MONTHLY: 149,
  ANNUAL:  999,
};

// ── Groq AI ──────────────────────────────────────────────────
export const GROQ_MODEL = "llama-3.3-70b-versatile";

// ── App metadata ──────────────────────────────────────────────
export const APP_NAME      = "Exam Is Near";
export const APP_URL       = "https://exam-is-near.web.app";
export const SUPPORT_EMAIL = "arksetu@gmail.com";

// ══════════════════════════════════════════════════════════════
// NOT CURRENTLY WIRED IN — target design, kept for future migration.
// index.html still uses raw string literals for every localStorage
// key (e.g. localStorage.getItem("activeCourse")), NOT this object.
// Do not assume these are live until storage.js is actually adopted.
// ══════════════════════════════════════════════════════════════
export const STORAGE_KEYS = {
  ACTIVE_COURSE:        "activeCourse",
  CBSE11_STREAM:        "cbse11Stream",
  CBSE12_STREAM:        "cbse12Stream",
  TOPICS:                "topics",
  EXAM_DATES:            "examDates",
  STUDY_LOG:             "studyLog",
  HOURS_TODAY:           "hoursToday",
  MOOD:                  "mood",
  SUBJECT_NOTES:         "subjectNotes",
  ALARMS:                "alarms",
  RINGTONE:              "ringtone",
  POM_SETTINGS:          "pom_settings",
  POM_SESSION_LOG:       "pom_sessionLog",
  POM_SUB_HOURS:         "pom_subHours",
  FLASH_DECKS:           "st_flash_decks",
  QUIZ_LOG:              "quizLog",
  FLASH_LOG:             "flashLog",
  MATERIALS:             "materials",
  PRO_CACHE:             "ein_pro_v2",
  AI_HISTORY:            "aiChatHistory",
  NJ_STATE:              "njState",
  SRS_CARDS:             "srsCards",
  MISTAKES:              "mistakes",
  DIFFICULTY:            "topicDifficulty",
  MOCK_STATE:            "mockState",
  DAILY_COUNTER_PREFIX:  "daily_",
  DRIVE_LINKS:           "driveLinks",
};

// ══════════════════════════════════════════════════════════════
// REMOVED (2026-07-08): CLOUDINARY_CLOUD / CLOUDINARY_UPLOAD_PRESET
// and RZP_KEY_ID were dead code.
//
//  - Cloudinary was fully removed from the app (file storage is now
//    Google Drive link-import only; see initDriveAuth() in index.html,
//    which is now a documented no-op stub). No cloudinary.com
//    reference exists anywhere in production code.
//
//  - The Razorpay Key ID is never hardcoded client-side. index.html's
//    checkout flow reads it from the server response
//    (`key: orderData.keyId`, sourced from Cloud Functions' Secret
//    Manager), which is the correct pattern. A hardcoded RZP_KEY_ID
//    here would only invite drift — and it already had: this file
//    previously listed "rzp_live_SxuJjlQtob9JG2", while
//    functions/index.js separately hardcodes a DIFFERENT live key ID
//    ("rzp_live_Sxwd6qLBExpLGL") for its fetchRazorpayFees stats call.
//    That inconsistency is real and still unresolved — see AUDIT.md.
// ══════════════════════════════════════════════════════════════

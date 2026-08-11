// ══════════════════════════════════════════════════════════════
// CONSTANTS — Exam Is Near by ArkSetu
// Single source of truth for all magic values.
// Import from here everywhere; never hardcode in feature files.
// ══════════════════════════════════════════════════════════════

// ── Admin ──────────────────────────────────────────────────────
export const ADMIN_EMAIL = "ayushmantripathi17@gmail.com";

// ── Firebase Cloud Functions base URL ─────────────────────────
export const CF_BASE = "https://asia-south1-exam-is-near.cloudfunctions.net";

// ── localStorage / IDB key names ──────────────────────────────
// All keys in ONE place — the root cause of most key-mismatch bugs.
export const STORAGE_KEYS = {
  // Core state
  ACTIVE_COURSE:      "activeCourse",
  CBSE12_STREAM:      "cbse12Stream",
  TOPICS:             "topics",
  EXAM_DATES:         "examDates",
  STUDY_LOG:          "studyLog",
  HOURS_TODAY:        "hoursToday",
  MOOD:               "mood",
  SUBJECT_NOTES:      "subjectNotes",

  // Alarms
  ALARMS:             "alarms",
  RINGTONE:           "ringtone",

  // Pomodoro
  POM_SETTINGS:       "pom_settings",
  POM_SESSION_LOG:    "pom_sessionLog",
  POM_SUB_HOURS:      "pom_subHours",

  // Flashcards & Quiz
  FLASH_DECKS:        "st_flash_decks",
  QUIZ_LOG:           "quizLog",
  FLASH_LOG:          "flashLog",

  // Materials
  MATERIALS:          "materials",

  // Pro/subscription cache
  PRO_CACHE:          "ein_pro_v2",

  // AI chat history
  AI_HISTORY:         "aiChatHistory",

  // NEET/JEE hub state
  NJ_STATE:           "njState",

  // SRS (spaced repetition)
  SRS_CARDS:          "srsCards",

  // Mistakes log
  MISTAKES:           "mistakes",

  // Difficulty heatmap
  DIFFICULTY:         "topicDifficulty",

  // Mock test state
  MOCK_STATE:         "mockState",

  // Daily counters (rate limits for free users)
  DAILY_COUNTER_PREFIX: "daily_",

  // Drive links
  DRIVE_LINKS:        "driveLinks",
};

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

// ── Razorpay public key ───────────────────────────────────────
// Secret key NEVER goes in frontend — only in Cloud Functions via Secret Manager
export const RZP_KEY_ID = "rzp_live_SxuJjlQtob9JG2";

// ── Groq AI ──────────────────────────────────────────────────
export const GROQ_MODEL = "llama-3.3-70b-versatile";

// ── Cloudinary ───────────────────────────────────────────────
export const CLOUDINARY_CLOUD = "dxqy8s6mk";
export const CLOUDINARY_UPLOAD_PRESET = "exam_is_near";

// ── App metadata ──────────────────────────────────────────────
export const APP_NAME    = "Exam Is Near";
export const APP_URL     = "https://exam-is-near.web.app";
export const SUPPORT_EMAIL = "arksetu@gmail.com";

// ══════════════════════════════════════════════════════════════
// APP ENTRY POINT — Exam Is Near by ArkSetu
// This file is the single <script type="module"> in index.html.
// It imports and initialises all feature modules in the correct order.
//
// Load order matters:
//   1. Utils (no deps)
//   2. Core: constants → state → firebase → router
//   3. Features: each is self-contained, depends only on core
//   4. UI: render functions call feature APIs
// ══════════════════════════════════════════════════════════════

// ── Utils ──────────────────────────────────────────────────────
// (Imported transitively by core modules — listed here for clarity)

// ── Core ───────────────────────────────────────────────────────
// State initialisation + Firebase/auth + Router
// These are NOT imported as ES modules yet because the existing code
// is written as a single global scope. The src/ files are the
// ORGANISED SOURCE OF TRUTH for reading and future refactoring.
// The actual runtime still loads the monolithic index.html script block
// until a bundler (Vite) is introduced in the next phase.
//
// MIGRATION PLAN:
//   Phase 1 (current): Organised source files in src/ — readable, maintainable
//   Phase 2:           Add Vite, convert src/ files to proper ES modules
//   Phase 3:           index.html becomes a 50-line shell, src/ is the app
//
// This file documents WHAT SHOULD BE the module graph once Phase 2 is done:

/*
import { STORAGE_KEYS, FREE_LIMITS, CF_BASE, ADMIN_EMAIL } from "./utils/constants.js";
import { lsGet, lsSet, idbGet, idbSet, getDailyCounter, incDailyCounter } from "./utils/storage.js";
import { genId, today, esc, safeSet, showToast, sanitizeForFirestore } from "./utils/helpers.js";

import { initState, state, S } from "./core/state.js";
import { initFirebase, googleSignIn, googleSignOut, pushToFirebase, subscribeToFirestore } from "./core/firebase.js";
import { switchView, updatePageMeta } from "./core/router.js";

import { getSubjects, switchCourse, showCourseSelector } from "./features/study/course-data.js";
import { startTimer, pauseTimer, resetTimer } from "./features/study/timer-core.js";
import { checkAlarms, triggerAlarm, dismissAlarm } from "./features/study/alarm.js";
import { renderPomodoro } from "./features/study/pomodoro.js";
import { renderFlashcards, generateFlashcards } from "./features/study/flashcards.js";
import { renderQuiz, startQuiz } from "./features/study/quiz.js";

import { askAI, renderAI, renderAIChat } from "./features/ai/groq.js";

import { isProUser, openProModal, initiateProPayment, initiateYearlyPayment } from "./features/payments/pro.js";

import { renderAnalytics } from "./features/analytics/analytics.js";

import { renderNeetJee } from "./features/neet-jee/hub.js";

import { render } from "./ui/pages/main-render.js";
import { renderAdmin } from "./ui/pages/admin.js";
import { renderProfile } from "./ui/pages/profile.js";
*/

// ── Boot sequence (current monolith — runs after DOM ready) ───
// The actual boot is in the inline <script> at the bottom of index.html.
// It calls: loadAll() → initFirebase() → render()
// See src/core/firebase.js for the full initFirebase implementation.

console.log("[Exam Is Near] App entry point loaded");

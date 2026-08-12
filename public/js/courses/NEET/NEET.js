// ══════════════════════════════════════════════════════════════
// NEET — course ecosystem manifest
// ══════════════════════════════════════════════════════════════
// Phase-1 restructuring only — no loading logic runs from this file yet.
// Phase 2 (lazy loading) replaces this with real dynamic <script> injection
// keyed off the route/activeCourse.
//
// ui/        render-core.js, nav-shortcuts-export.js, render-about.js
// features/  pomodoro-full.js, subjects-profile.js, ai-assistant-view.js,
//            ai-assistant-setup.js, files-materials.js, exam-dates-actions.js,
//            quiz.js, flashcards.js, analytics.js, clock-alarms-timer.js,
//            payments-pro.js, neetjee-hub-data.js, neetjee-features-1to4.js,
//            neetjee-features-5to8.js, neetjee-hub-renderer.js
// core/      ncert-lines.js (NEET_NCERT_LINES)
// Syllabus/  Physics.js, Chemistry.js, Botany.js, Zoology.js
//
// core/, courses/, shared/, utils/ are reserved — nothing NEET-specific
// belongs there today. Global infra stays in top-level public/js/{core,utils}.
const NEET_COURSE_MANIFEST = { id: "neet", label: "NEET UG" };

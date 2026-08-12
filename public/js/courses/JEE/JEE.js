// ══════════════════════════════════════════════════════════════
// JEE — course ecosystem manifest
// ══════════════════════════════════════════════════════════════
// This file does not run any loading logic yet. It's a manifest of what
// belongs to the JEE ecosystem, written during the phase-1 restructuring
// (file/folder split only — see AUDIT.md or the restructuring notes for
// context). Phase 2 (lazy loading) will replace this with real dynamic
// <script> injection keyed off the route/activeCourse.
//
// ui/        render-core.js, nav-shortcuts-export.js, render-about.js
// features/  pomodoro-full.js, subjects-profile.js, ai-assistant-view.js,
//            ai-assistant-setup.js, files-materials.js, exam-dates-actions.js,
//            quiz.js, flashcards.js, analytics.js, clock-alarms-timer.js,
//            payments-pro.js, neetjee-hub-data.js, neetjee-features-1to4.js,
//            neetjee-features-5to8.js, neetjee-hub-renderer.js
// core/      formulas.js (JEE_FORMULAS)
// Syllabus/  Physics.js, Chemistry.js, Mathematics.js
//
// core/, courses/, shared/, utils/ are reserved — nothing JEE-specific
// belongs there today. Global infra (auth, Firebase sync, app state,
// generic helpers/constants) stays in the top-level public/js/{core,utils}
// per the "global infra stays shared" rule.
const JEE_COURSE_MANIFEST = { id: "jee", label: "JEE (Mains & Advanced)" };

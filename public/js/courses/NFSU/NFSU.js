// ══════════════════════════════════════════════════════════════
// NFSU — course ecosystem manifest
// ══════════════════════════════════════════════════════════════
// Phase-1 restructuring only — no loading logic runs from this file yet.
// Phase 2 (lazy loading) replaces this with real dynamic <script> injection
// keyed off the route/activeCourse.
//
// ui/        render-core.js, nav-shortcuts-export.js, render-about.js
// features/  pomodoro-full.js, subjects-profile.js, ai-assistant-view.js,
//            ai-assistant-setup.js, files-materials.js, exam-dates-actions.js,
//            quiz.js, flashcards.js, analytics.js, clock-alarms-timer.js,
//            payments-pro.js
// Semester 1/Syllabus/  Legal Methods, Law of Tort & Consumer Protection,
//                       Law and Literature, Computer Organization & Embedded
//                       Systems, Basic Programming (C), Discrete Mathematics
// Semester 2/Syllabus/  C++, RDBMS, Legal Language, Statistics,
//                       Law & Society, Jurisprudence
// Semester 3/Syllabus/  Law of Crimes I, Constitutional Law I,
//                       Law of Contract I, Family Law I, Web Programming,
//                       Operating System Concepts
//
// core/, courses/, shared/, utils/ are reserved — nothing NFSU-specific
// belongs there today. Global infra stays in top-level public/js/{core,utils}.
const NFSU_COURSE_MANIFEST = { id: "nfsu", label: "NFSU — B.Sc. LL.B. (Hons.)" };

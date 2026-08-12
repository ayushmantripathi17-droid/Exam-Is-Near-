// ══════════════════════════════════════════════════════════════
// CBSE — course ecosystem manifest
// ══════════════════════════════════════════════════════════════
// Phase-1 restructuring only — no loading logic runs from this file yet.
// Phase 2 (lazy loading) replaces this with real dynamic <script> injection
// keyed off the route/activeCourse.
//
// CBSE is one ecosystem covering 3 class levels (not full independent
// sub-ecosystems, per your call): Class 10 (flat), Class 11 and Class 12
// (stream-based — Science PCM/PCB/PCMB, Commerce, Arts). Streams share
// subjects (e.g. Physics is one file, referenced by 3 Class 11 streams),
// so subjects live once per class in Syllabus/, and each class has its
// own streams.js mapping stream -> subject ids.
//
// ui/        render-core.js, nav-shortcuts-export.js, render-about.js
// features/  pomodoro-full.js, subjects-profile.js, ai-assistant-view.js,
//            ai-assistant-setup.js, files-materials.js, exam-dates-actions.js,
//            quiz.js, flashcards.js, analytics.js, clock-alarms-timer.js,
//            payments-pro.js
// Class 10/Syllabus/   Mathematics.js, Science.js, English.js, Social Science.js, Hindi.js
// Class 11/streams.js + Syllabus/ (13 unique subjects)
// Class 12/streams.js + Syllabus/ (13 unique subjects)
//
// core/, courses/, shared/, utils/ are reserved — nothing CBSE-specific
// belongs there today. Global infra stays in top-level public/js/{core,utils}.
const CBSE_COURSE_MANIFEST = { id: "cbse", label: "CBSE" };

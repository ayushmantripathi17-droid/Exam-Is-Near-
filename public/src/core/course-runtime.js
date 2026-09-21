// ══════════════════════════════════════════════════════════════
// COURSE RUNTIME — Exam Is Near by ArkSetu
// ══════════════════════════════════════════════════════════════
// In the original classic-script app, every <script src="/js/..."> tag
// shared ONE global scope. Course-independent code (core/firebase-sync.js,
// core/course-selector.js, shared/groq.js, shared/pro-footer-bar.js,
// ads/ads-display.js) called straight into whichever course's functions
// happened to be loaded (e.g. a bare call to render() or switchView()),
// because only ONE course's features/ui files were ever injected into the
// page at a time (see RESTRUCTURING_NOTES.md).
//
// Real ES modules don't share a global scope, and course-independent code
// can't `import` a specific course's implementation statically — which
// course is active is a *runtime* choice (read from localStorage at
// startup). This object is the replacement mechanism: main.js dynamically
// imports the active course's bundle and copies the relevant bindings in
// here, and every course-independent file that used to call these
// functions/read this state bare now goes through CourseRuntime.<name>
// instead.
//
// Two kinds of entries end up here (see MIGRATION_NOTES.md for the full
// list of which name is which):
//  - "simple": a function (render, switchView, isProUser, ...). Registered
//    once, right after the active course's bundle loads. Never reassigned
//    afterwards.
//  - "full": mutable data that BOTH the active course's own code AND
//    course-independent code (core/firebase-sync.js) read AND write
//    (quizLog, flashLog, pomState, _examDateOverrides, _proStatusCache,
//    aiTyping). For these, the course module itself stores its state here
//    (CourseRuntime.quizLog = ...) instead of in a local module-level
//    variable, so there is exactly one shared copy - never two copies that
//    could silently drift out of sync.
export const CourseRuntime = {};

# Exam Is Near — public/js restructuring (phase 1)

## What this is
A new `public/js/courses/{JEE,NEET,CBSE,NFSU}/` tree, built **additively** alongside
the existing `public/js/{core,data,features,ui,utils}/`. Nothing was deleted, moved,
or modified. `index.html`'s current `<script defer src="/js/...">` tags are
completely untouched — the site behaves exactly as it did before this pass.
130 new files, all syntax-checked with `node --check`.

## What actually changed on disk
Everything is new; nothing existing was edited:

- `public/js/courses/JEE/`, `NEET/`, `CBSE/`, `NFSU/` — each with
  `core/ courses/ features/ shared/ ui/ utils/` + a `<Course>.js` manifest
- `features/` + `ui/` files that branch on course (`render-core.js`,
  `pomodoro-full.js`, `subjects-profile.js`, `ai-assistant-*.js`,
  `files-materials.js`, `exam-dates-actions.js`, `nav-shortcuts-export.js`,
  `render-about.js`) copied into all 4 course folders
- `quiz.js`, `flashcards.js`, `analytics.js`, `clock-alarms-timer.js`,
  `payments-pro.js` also copied into all 4 (per your call) — these currently
  have little-to-no course branching, so the 4 copies start out identical
  and are free to diverge from here
- `neetjee-hub-data.js`, `neetjee-features-1to4.js`, `neetjee-features-5to8.js`,
  `neetjee-hub-renderer.js` copied only into JEE/ and NEET/ (they're
  JEE/NEET-specific by name and content)
- `data/subjects.js` (165KB, all courses combined) split into
  `courses/<Course>/<Semester or Class>/Syllabus/<Subject>.js` — one file
  per subject, syntactically valid, spot-checked
- `JEE_FORMULAS` → `courses/JEE/core/formulas.js`;
  `NEET_NCERT_LINES` → `courses/NEET/core/ncert-lines.js`
- `CBSE/Class 11/streams.js` and `CBSE/Class 12/streams.js` — stream → subject-id
  groupings (Science PCM/PCB/PCMB, Commerce, Arts), since streams share subjects
  rather than owning separate content
- `public/js/core/course-selector.js` — the course-switching engine
  (`COURSE_TREE`, the selector popup UI, `switchCourse`, `getSubjects`, etc.)
  extracted verbatim, kept **global** (not duplicated) since it inherently
  needs to know about every course and touches global app state/Firebase
  directly. Header comment explains it still depends on the old
  `data/subjects.js` globals until phase 2 rewires it
- `public/js/utils/app-constants.js` — `MOODS`, `NOTE_TYPES`, `DAYS`, `MONTHS`
  etc., which were oddly living inside `subjects.js` despite having zero
  course logic

## Stayed global, not duplicated (and why)
- `core/app-state.js`, `core/firebase-sync.js` — duplicating these would
  declare the same top-level `const`/state singleton more than once in the
  same global scope once more than one course's scripts load on a page,
  which throws immediately. Also explicitly your own "auth/Firebase can stay
  shared" rule.
- `utils/constants.js`, `utils/helpers.js`, `ui/ads-display.js` — zero
  course references in any of them.

## What's still open (deliberately not done here)
- **Lazy loading / route-based bundle switching** — doesn't exist anywhere
  in the app today (no bundler, just classic `<script defer>` tags). You
  chose to defer this to phase 2. Until that ships, everything under
  `courses/` is inert — present on disk, not referenced by `index.html`.
- `core/course-selector.js`'s `getSubjects()`/`switchCourse()` still read
  `SUBJECTS_JEE` etc. as bare globals, which only exist while the old
  `data/subjects.js` is loaded. Flagged in-file; rewiring to the new
  per-course modules is phase-2 work once the loader exists.
- `render-core.js` and the other duplicated feature files are byte-identical
  across all 4 courses right now — nothing has been trimmed of other
  courses' branches yet. That's expected for a copy-first pass; each copy
  is now free to diverge.

## Left alone, out of scope
`src/` (dead Vite scaffold, excluded from hosting), `patch/` and
`exam-is-near-patch/` (unrelated old patch bundles), the `.bak-*` files and
`public/js.zip` already sitting in `public/js/`.

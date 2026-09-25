# Migration Notes: `public/js/` → real ES modules under `public/src/`

**Status: converted and building cleanly with Vite. NOT yet tested in a real
browser/Firebase environment — see "What still needs manual QA" at the
bottom before deploying.**

This supersedes `README.md` / `RESTRUCTURING_NOTES.md` for anything about
`src/`. Those documents describe the *old* `src/` folder, which was a
hand-written, never-wired-in scaffold that had drifted from `public/js/`
(see their own "NOT used in production" warnings). That folder has been
**deleted** and replaced by the tree described here, which is a mechanical,
verified conversion of the actual, live `public/js/` code — not a rewrite
from scratch.

## Why this was needed

`public/js/` was ~140 classic `<script defer src="...">` files that all
shared **one global lexical scope** — any file could read or reassign a
bare variable declared in any other file. That only works when every
script tag is present on the page. Real ES modules don't share scope, so a
1:1 "just add `export`/`import`" pass isn't enough on its own; several
patterns needed a real architectural answer (below).

## Tooling used

An automated converter (not in this zip — it was a throwaway build tool,
kept out to avoid confusing this with the app itself) did the heavy
lifting:

1. Parsed every file with `espree`, ran `eslint-scope` analysis to find,
   for every name, every file that reads or writes it.
2. Classified every top-level name into one of four buckets (below).
3. Rewrote every reference precisely by AST node range (not text
   search/replace), so things like a local variable named `db` inside an
   IndexedDB helper were correctly left alone while the *real* shared `db`
   (Firestore handle) was rewritten everywhere.
4. Re-parsed all 140 output files afterward and confirmed **zero
   unresolved references** anywhere in the tree (every bare identifier is
   either a real import, a known browser/CDN global, or a bug — there were
   none left).
5. Verified with a full `vite build` (catches syntax errors + unresolved
   import paths + confirms the dependency/chunk graph is sound).

## The four kinds of top-level bindings

**1. Plain exports (the vast majority — hundreds of names).**
A function or constant declared in one file, only ever *read* from others.
Ordinary `export` / `import`. No behavior change.

**2. Local "wrap" objects — state mutated across files within the same
resolution family.**
Example: `core/app-state.js` declares `let db=null; let auth=null; ...`.
`core/firebase-sync.js` reassigns them (`db = getFirestore(...)`). Real ES
imports are read-only bindings — a different module can't reassign an
imported `let`. Fix: these became properties of one exported object,
`AppStateShared`, e.g. `AppStateShared.db = getFirestore(...)`, and *every*
reference everywhere (including inside `app-state.js` itself) was rewritten
to go through it. Ten such groups exist, all in `core/app-state.js`,
`core/course-selector.js`, and each course's `ai-assistant-setup.js` /
`ai-assistant-view.js` (session/history state private to that course).

**3. `CourseRuntime` — simple (25 names).**
Course-independent files (`core/firebase-sync.js`, `core/course-selector.js`,
`shared/groq.js`, `shared/pro-footer-bar.js`, `ads/ads-display.js`) call
straight into whichever course's code happens to be active — `render()`,
`switchView()`, `isProUser()`, `spawnStars()`, `openProModal()`,
`getSubjectPct()`/`getDaysLeft()`/`getExamDate()`/`getTotalHours()`,
`getAIQuickPrompts()`/`getAIWelcomeCards()`/`renderAIMsgBubble()`,
`loadAdminMaterials()`/`loadSharedFiles()`/`loadTheme()`/
`checkMaintenance()`/`loadAnnouncement()`/`loadUserFiles()`/
`loadExamSchedule()`, `_updatePageMeta()`, `saveFlashDecks()`,
`flashDecks`, `pomState`, `QUIZ_LOG_MAX`, `FLASH_LOG_MAX`. In the original
app this worked because only one course's files were ever injected into
the page (via `document.write`, keyed off `localStorage.activeCourse`) —
whichever one was loaded is just "the" implementation. Real modules can't
statically import "whichever course is active" — that's a runtime choice.
Fix: `main.js` dynamically imports the active course's bundle and copies
its exports onto one shared object, `core/course-runtime.js`'s
`CourseRuntime`. Course-independent files call `CourseRuntime.render()`
etc. Within the *same* course's own files, calls stay plain imports (no
indirection needed there — same reasoning as bucket 1).

**4. `CourseRuntime` — full (5 names: `quizLog`, `flashLog`, `pomState`
override `_examDateOverrides`, `_proStatusCache`, `aiTyping`).**
Same idea as bucket 3, but course-independent code *writes* these too
(`firebase-sync.js` overwrites `quizLog` when Firestore sync completes).
If the course's own file kept a separate local copy, the two could
silently drift out of sync the moment external code reassigns one. So for
these 5, *every* reference anywhere — including inside the declaring
file's own functions — goes through `CourseRuntime.quizLog` etc. There is
exactly one copy, always.

## Other real bugs found and fixed along the way

- **`cbse11Stream` was never declared** in `core/course-selector.js` (its
  sibling `cbse12Stream` was). Worked by accident in the old sloppy-mode
  shared-scope script (assigning to an undeclared bare name silently
  creates a global). Real ES modules are always strict mode — this would
  throw `ReferenceError` on first use. Fixed by adding the missing
  `let cbse11Stream = localStorage.getItem("cbse11Stream") || null;`,
  mirroring `cbse12Stream`.
- **`public/js/utils/app-constants.js`** was a byte-identical dead
  duplicate of `shared/app-constants.js`, explicitly labeled in its own
  header as "additive copy... not wired in yet." Excluded.
- **`public/js/courses/NFSU/Semester 3/Syllabus/Law of Crime I.js`**
  (singular) was a near-duplicate of the real, loaded
  `Law of Crimes I.js` (plural, missing a `"lawRef": true` field). The
  singular file was never referenced by `index.html`. Excluded.
- **`public/js/courses/registry.js`** and all four
  `public/js/courses/<Course>/data.js` files were already-dead, superseded
  by the `Syllabus/` split (per `RESTRUCTURING_NOTES.md`'s own note) and
  not referenced by `index.html`. Excluded.
- **`neetjee-hub-data.js`** (both the JEE and NEET copies) and NEET's
  copies of `neetjee-features-1to4.js` / `neetjee-features-5to8.js` /
  `neetjee-hub-renderer.js` were never loaded — `index.html` always used
  the **JEE** copies regardless of active course (search
  `index.html` history for `neetjee-hub` if you want to double check this
  yourself against the pre-migration file). Excluded; the JEE copies of
  the three live files moved into the global (course-independent) layer
  since that's how they actually behaved.
- **`deferredPrompt`**: used to be a bare `let` in a small inline
  `<script>` in `index.html` (PWA install-prompt handling), read by every
  course's `ai-assistant-view.js`. Moved into a real module,
  `shared/pwa-install.js` (`PwaInstall.deferredPrompt`), imported by both
  `main.js` (which sets it) and the course files (which read it).

## What changed outside `src/`

- **`index.html`**: the ~90 `<script defer src="/js/...">` tags, the
  `document.write` course-family injector, and the small inline
  PWA-install/theme-toggle scripts are all gone, replaced by one line:
  `<script type="module" src="/src/main.js"></script>`. Everything those
  scripts did now happens in `main.js`.
- **`admin.html` / `finance.html`**: their existing
  `<script type="module">` blocks already imported
  `{ today, genId, esc }` from `/js/utils/helpers.js` (that file was
  *already* real ESM, oddly, even before this migration) — just repointed
  to `/src/utils/helpers.js`.
- **`vite.config.js`** (new): multi-page build
  (`index`/`admin`/`finance`/`landing`/`rankJEE`/`rankNEET`/`privacy`/
  `terms`), static assets (`assets/`, `seo/`, icons, `manifest.json`,
  `sw.js`, `robots.txt`, etc.) copied via `vite-plugin-static-copy` since
  they're not part of the module graph. `pro_modal.html` is intentionally
  **not** a build entry — it's a developer reference snippet (invalid
  standalone HTML, was never a deployed page).
- **`package.json`**: `npm run dev` / `npm run build` / `npm run preview`
  now go through Vite. `npm run deploy` runs `vite build` first.
- **`firebase.json`**: `hosting.public` changed from `"public"` to
  `"dist"` — **you must run `npm run build` before every deploy now.**

## How the app boots now (unchanged behavior, different mechanism)

The original boot trigger was a top-level `loadAll();` call sitting at the
bottom of each course's `ui/render-about.js` — it ran as soon as that
script tag loaded. That call is untouched and still sits at the same spot
in the transformed file; it now fires as soon as `main.js` dynamically
imports the active course's bundle (which is early — right after the
static/global-layer imports resolve). `switchCourse()` still doesn't do a
full page reload when crossing course families (e.g. CBSE → JEE) — this
matches the original exactly, and works out because every course's
`features/`+`ui/` files were, at migration time, byte-identical
copy-pasted code (per `RESTRUCTURING_NOTES.md`), so it never actually
mattered which course's copy was active for that code specifically. If the
four courses' feature code is ever de-duplicated/specialized per course in
the future, `switchCourse()` crossing families will need a real reload —
worth keeping in mind, not fixed here since it isn't a regression.

## Verified

- `node` re-parse of all 140 generated files as strict ES modules: **0
  unresolved references** (every bare identifier is either resolved via
  `import`, a `CourseRuntime`/wrap-object property, or a genuine
  browser/CDN global).
- `npm run build` (Vite): succeeds. 169 modules transformed, all static
  assets copied, four separate lazy-loaded chunks for JEE/NEET/CBSE/NFSU
  (confirmed these are only fetched when that course is active, matching
  the original's "only one course's files ever load" design), `admin.html`
  / `finance.html` build to their own chunks correctly.

## What still needs manual QA (not possible in this sandbox — no browser,
no live Firebase project)

1. **Run it for real**: `npm install && npm run build && npm run preview`,
   click through every view (dashboard, subjects, quiz, flashcards,
   pomodoro, analytics, AI assistant, files, sync/auth, admin, finance,
   rank predictors) for at least one course, then switch course and repeat
   the smoke test.
2. **Auth + Firestore sync**: sign in, confirm `db`/`auth`/`currentUser`
   (now `AppStateShared.*`) behave identically — this is the highest-risk
   area since it's the most heavily cross-file-mutated state.
3. **Quiz/flashcard/AI history persistence across a page reload** — these
   now live on `CourseRuntime` instead of a module-local variable;
   behavior should be identical but this is exactly the kind of thing that
   only shows up when you actually click through it.
4. **PWA install button** and **service worker registration** — moved
   from inline `<script>` into `main.js`; confirm the install prompt still
   appears/works.
5. Cross-family course switching (see boot section above) — confirm it
   still "just works" the way it did before.

## Regenerating this migration

The conversion tooling itself wasn't included (it's throwaway build
tooling, not application code), so this migration is a one-way snapshot.
If `public/js/` changes going forward, edit `public/src/` directly (it's
real, readable code now) rather than regenerating.

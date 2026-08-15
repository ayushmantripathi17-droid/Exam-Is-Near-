# Architecture Audit & Module Migration Log
**Date:** 2026-07-08 · **Scope:** `functions/`, `public/index.html`, `public/admin.html`, `public/finance.html`, `src/utils/`

This log records what was actually found and changed. Treat it as the source of truth over any older comments still in the code.

---

## 1. Security fixes (applied)

| # | Finding | Action | Status |
|---|---|---|---|
| 1 | `functions/.env` contained a **live, plaintext Razorpay Key Secret** — a dead leftover file (the app already reads secrets via Firebase Secret Manager / `defineSecret`, not this file). | Deleted `functions/.env`. | ✅ Done. **You still need to rotate this key pair in the Razorpay dashboard** — deleting the file stops it spreading further but does not invalidate the exposed credential. |
| 2 | Two **different live Razorpay Key IDs** exist in the codebase: `rzp_live_SxuJjlQtob9JG2` (was in the deleted `.env`; also was hardcoded in the old `src/utils/constants.js`) vs `rzp_live_Sxwd6qLBExpLGL` (hardcoded in `functions/index.js` line ~669, used only by the `fetchRazorpayFees` stats endpoint). | **Not yet resolved** — flagging for you to confirm which is correct and whether the second is a legitimate secondary key or stale. | ⚠️ Needs your input |
| 3 | `esc()` (HTML-escaping helper) was inconsistent across files: `admin.html`'s version escaped single quotes (`&#39;`), `index.html`'s and `finance.html`'s did not — a minor XSS-hardening gap if that output ever lands inside a single-quoted HTML attribute. | Standardized on the safer (admin.html) version in the new shared `esc()`. | ✅ Done |

## 2. Backend (`functions/index.js`) — reviewed, no changes needed

Already solid: server-side amount verification against Razorpay (never trusts client-sent amount), HMAC signature check on payment verification, per-request auth token verification, admin checks are Auth-token-email-based, Groq proxy has per-UID rate limiting + input sanitization + model allowlist, coupon consumption uses Firestore transactions. Firestore rules independently reviewed and are consistently locked down.

Not changed, but worth deciding on: the in-memory `Map`-based Groq rate limiter resets on Cloud Function cold start / doesn't share state across instances — fine at current scale, a real limit if you scale to multiple concurrent instances.

## 3. Frontend: real ES module migration (Phase 2, step 1)

**Important correction to the original plan:** the top-level `src/` folder (`src/utils/`, `src/core/`, etc.) was **not** an accurate extraction of production code — it was a drafted target design that had already drifted from reality. Example: its `showToast()` used different CSS classes and timing than the real one in `index.html`; its `storage.js` (`lsGet`/`lsSet`/etc.) doesn't correspond to any code actually in use — production still calls raw `localStorage.getItem(...)` with string literals everywhere. Importing `src/` as-is would have introduced real regressions. It was not used as a source; the real implementations were re-extracted directly from `index.html`/`admin.html`/`finance.html` instead.

**Second correction, caught before deploy:** `firebase.json`'s `hosting.public` is `"public"`, and `hosting.ignore` explicitly excludes `"src/**"`. Any client-side `import` from `/src/...` would 404 in production. The real, deployed module layer now lives at **`public/js/utils/`** instead. The top-level `/src/` folder remains a separate, not-yet-wired scaffold for a possible future Vite rewrite — don't confuse the two.

### What moved where

- **New, real, deployed module:** `public/js/utils/helpers.js` — exports `genId`, `today`, `esc`, `showToast`, `isCrawlerUA`, `sanitizeForFirestore`. Every export is the actual verified production implementation (or, for `esc`, the more-correct of two diverging versions — see §1.3).
- **New, real, deployed module:** `public/js/utils/constants.js` — `ADMIN_EMAIL`, `CF_BASE`, `FREE_LIMITS`, `PLAN_PRICE`, `GROQ_MODEL`, app metadata. Dead constants removed (see below). `STORAGE_KEYS` kept but explicitly labeled **not wired in yet** — a real future refactor, not done this session (see §4).
- **Deleted (were unused/inaccurate):** `src/utils/helpers.js`, `src/utils/storage.js`, `src/utils/constants.js` (old versions).
- **`public/index.html`:** added a `<script type="module">` shim in `<head>` that imports the 6 helpers and assigns them to `window` (your app relies on 248 inline `onclick="fn(...)"` HTML attributes, which need global scope — this mirrors the pattern `admin.html` already uses for its own module-to-window exposure). Removed the 6 now-duplicate inline function definitions from the main classic `<script>` block, replacing each with a one-line comment pointing to the shim.
- **`public/admin.html`:** already ran as a single `type="module"` script. Removed its inline `esc`/`today`/`genId` and replaced with a real `import` from `/js/utils/helpers.js`.
- **`public/finance.html`:** same — removed inline `esc`, added `import`.

### Dead code removed from `constants.js`
- `CLOUDINARY_CLOUD` / `CLOUDINARY_UPLOAD_PRESET` — Cloudinary is fully gone from the app; file handling is now Google Drive link-import only (`uploadFileToDrive()`/`ensureDriveFolder()` in `index.html` are now no-op stubs, confirmed via grep — zero `cloudinary.com` references anywhere in production).
- `RZP_KEY_ID` — never actually used client-side. The real checkout flow reads the key ID from the server's `createOrder` response (`key: orderData.keyId`), which is the correct pattern; a hardcoded copy here only invited the drift described in §1.2.

### Verification performed (static only — see limits below)
- `node --check` on every extracted classic `<script>` block in `index.html` (5 blocks, including the 483K-character main block) — all pass.
- `node --check` on both new module files and on the extracted module scripts in `admin.html`/`finance.html` — all pass.
- Grep-confirmed call-site counts for all 6 migrated functions are unchanged before/after (e.g. `showToast(...)` still called 133 times, `esc(...)` still called 123 times in `index.html`).
- Confirmed no other `public/*.html` file duplicates these functions.
- Confirmed module-script execution timing is safe: all 6 functions are only ever called from inside other functions (never at top-level script-parse time), and the earliest real call (`isCrawlerUA()` inside `initFirebase()`) is itself deferred via `setTimeout(...)`, which always runs after module scripts (implicitly deferred) have executed.
- Confirmed CSP (`script-src 'self' 'unsafe-inline' ...`) permits both the inline module shim and the same-origin `/js/utils/helpers.js` fetch.

### What this static verification cannot cover
I have no way to run your live app here — no Firebase Auth session, no Razorpay checkout, no browser. **Before deploying, please at minimum:** `firebase serve`, open the app, and confirm toasts still appear correctly, a couple of `onclick`-driven actions still work (e.g. adding an exam date, opening the AI sidebar), and the admin/finance pages still load and authenticate.

## 4. Explicitly out of scope this session

- **`STORAGE_KEYS` adoption** — replacing ~30+ scattered raw `localStorage.getItem("literalKey")` call sites with the centralized constant. Good future work, meaningfully reduces key-mismatch bug risk (a bug class you've hit before), but touches a lot of call sites in a payments-adjacent app and deserves its own careful, tested pass.
- **Resolving the two-live-Razorpay-key-ID inconsistency** (§1.2) — needs your confirmation on intent before I'd touch it.
- **React/Vite rewrite** — untouched; `src/core/`, `src/features/`, `src/ui/` remain as they were, as a separate future effort.

---

## 6. Phase 2b: full file-split of `index.html` (2026-07-08, later same day)

**What changed:** `public/index.html` went from **10,323 → 1,530 lines**. The ~8,700 lines of inline app logic (previously one giant `<script>` block, 268 functions) were split into **22 real files** under `public/js/`, organized by feature domain (`data/`, `core/`, `features/`, `ui/`), each loaded via an ordered `<script src="...">` tag in the exact original sequence.

### Why this was safe (not just "should be fine")
Classic (non-module) `<script>` tags on one page share a single global lexical environment — this is true whether that code is one inline block or split across many `src=` files, as long as load order is preserved. So this migration required **zero logic changes**, and specifically avoided the risk flagged earlier in §3 about auth/sync variable reassignment (`currentUser`, `db`, `auth`, `syncStatus`): those variables are still declared and reassigned within the same shared global scope as before, just physically located in `core/firebase-sync.js` now instead of inline. Nothing about *when* code runs relative to anything else changed — only which file it's fetched from.

### How it was verified (stronger than the Phase 2 helpers migration — fully mechanical)
1. **Byte-for-byte reconstruction check**: a script sliced `index.html`'s three script blocks at chosen boundaries, wrote each piece to its target file, then concatenated all pieces back together and asserted the result was **character-for-character identical** to the original extracted script content. This isn't circumstantial evidence — it's a guarantee that no line was dropped, duplicated, or altered in the split, by construction.
2. `node --check` passed on all 22 files individually, and on each of the 3 original script groups re-concatenated in their real load order.
3. Re-verified via Python's `html.parser` (not regex) that the resulting `index.html` has exactly the expected 22 `<script src="/js/...">` tags in the exact original order, plus the 2 genuinely-tiny original inline scripts (SW registration, splash timer) untouched.
4. Re-confirmed none of the 22 files call the Phase-2 shimmed helpers (`genId`/`esc`/`showToast`/etc.) at true top-level/parse-time, preserving the same module-shim timing safety established earlier.

### File map (in load order)
```
public/js/data/subjects.js                    — SUBJECTS + all course-set data (JEE/NEET/UPSC/CBSE/NFSU)
public/js/core/app-state.js                   — the `state` object + sync/storage variable declarations
public/js/core/firebase-sync.js               — Firebase init, auth listener, Drive sync, cloud sync
public/js/features/clock-alarms-timer.js      — clock + alarm system
public/js/features/exam-dates-actions.js      — exam date helpers + core UI actions
public/js/ui/render-core.js                   — the main render() dispatcher
public/js/features/files-materials.js         — file manager / study materials
public/js/features/subjects-profile.js        — subject sections + profile rendering
public/js/features/ai-assistant-setup.js      — Groq AI tutor setup/proxy calls
public/js/features/pomodoro-full.js           — full Pomodoro timer feature
public/js/features/flashcards.js              — flashcard decks + SRS
public/js/features/quiz.js                    — quiz mode
public/js/features/analytics.js               — study analytics rendering
public/js/features/ai-assistant-view.js       — AI tutor chat UI
public/js/ui/nav-shortcuts-export.js          — mobile nav drawer + keyboard shortcuts + JSON/PDF export
public/js/ui/render-about.js                  — About/Contact page render
public/js/features/payments-pro.js            — Pro plan / Razorpay checkout flow
public/js/ui/ads-display.js                   — free-tier ad display logic
public/js/features/neetjee-hub-data.js        — NEET/JEE hub: weightage, rank, percentile data
public/js/features/neetjee-features-1to4.js   — Mistake Logbook, Weightage Tracker, Rank Predictor, OMR Sim
public/js/features/neetjee-features-5to8.js   — SRS, Mock Test, Difficulty Heatmap, Percentile Calculator
public/js/features/neetjee-hub-renderer.js    — NEET/JEE hub main renderer
```
(`public/js/utils/helpers.js` and `public/js/utils/constants.js` are from the earlier Phase 2 pass — see §3.)

### Two real config issues this surfaced, and fixed
- **Caching regression risk**: previously, all logic lived inline in `index.html`, which has `Cache-Control: no-cache` — every deploy was instantly live for every user. Externalizing into `.js` files put them under `firebase.json`'s existing `**/*.js` rule (`max-age=31536000, immutable` — 1 year). Fixed by adding a `/js/**`-specific override to `no-cache` in `firebase.json`, so future edits to these files propagate the same way `index.html` always has.
- **Service worker cache**: `sw.js` caches responses independently of HTTP headers via the Cache API, and this codebase already has an established convention of bumping `CACHE_NAME` on structural changes (see the pre-existing "v5 — Admin/finance passthrough fix" version comment). Bumped `CACHE_NAME`/`CACHE_STATIC` from `v5` to `v6` so returning users' service workers evict old cached state after this deploy. **This same discipline applies going forward**: any future edit to a `public/js/**` file should come with a `sw.js` version bump, or returning users' service workers may keep serving the old cached version.

### What this does NOT change
- No function was rewritten, renamed, or had its logic altered — this was a pure move-and-verify operation.
- The 248 inline `onclick="..."` handlers are unaffected — they still resolve via the same shared global scope, exactly as before.
- Real ES modules were still not introduced for this layer (same reasoning as §3: `currentUser`/`db`/`auth`/`syncStatus` reassignment makes that unsafe without live testing). This is file-level organization within the existing classic-script execution model, not a module-system migration.

### What you should still verify locally before deploying
Same as §3's guidance — `firebase serve`, click through the app, confirm toasts/buttons/admin/finance all still work. This change is mechanically low-risk, but "low-risk" isn't "zero-risk" without an actual browser running it.

### One mistake I caught and reverted before finalizing (noting for transparency)
While tidying naming, I initially moved the "Permanent Pro Footer Bar" init code out of `neetjee-hub-data.js` and into `ads-display.js` for cleaner naming. That would have been a **real regression**: the `#pro-footer-bar` `<div>` sits in `index.html` *between* those two `<script src>` tags, so the init code (which does `document.getElementById('pro-footer-bar')` immediately on load) needs to run *after* that div is parsed — which only its original position guaranteed. Caught this by checking actual DOM-element/script-tag ordering before finalizing, reverted it, and re-verified line counts and syntax on both files. `neetjee-hub-data.js`'s name is a little broader than its content now (footer-bar init + hub data), which is a fair trade for not risking a real bug over a cosmetic rename.


## 5. Assumptions made
- Treated `public/` as the sole deployed hosting root, per `firebase.json`.
- Assumed the more-restrictive `esc()` (escaping single quotes) is strictly safe to standardize on everywhere, since it's a superset of escaping — no legitimate call site should depend on single quotes passing through un-escaped.
- Assumed `RESEND_API_KEY=re_dummy` (seen in the now-deleted `.env`) was a placeholder, not a truncated real key — worth a quick confirm on your end.

---

## 7. Session: assets/SEO/ads reorganization + broken-reference fixes (2026-08-15)

**Scope:** `public/index.html`, `public/manifest.json`, `public/sw.js`, `public/sitemap.xml`, `public/rankJEE.html`, `public/rankNEET.html`, 6 per-course `payments-pro.js`/`neetjee-features-1to4.js` files, plus new `public/assets/`, `public/seo/`, `public/ads/` folders. Course-wise JS separation under `public/js/courses/{JEE,NEET,CBSE,NFSU}/` (built in the 2026-08-12 phase-2 wiring pass) was **not restructured** — it was already sound; this pass only lightened `index.html` and organized assets/SEO/ads around it, per explicit instruction not to touch what already works.

### 3 real, currently-live bugs found and fixed (pre-existing, not introduced this session)
| # | Bug | Impact | Fix |
|---|---|---|---|
| 1 | `index.html` loaded `/js/ui/ads-display.js` — but the whole `public/js/ui/` directory was deleted in the second commit (`ac14504`) when its sibling files were superseded by per-course copies; **no replacement was ever created** for this one. | Free-tier ads have not been rendering at all in production. | Recovered the original 20-line file via `git show d4a8a4c:public/js/ui/ads-display.js` (still present in the *first* commit), placed it at `public/ads/ads-display.js`, updated the `<script>` tag. Content is untouched, byte-identical to the original. |
| 2 | `index.html` loaded `/js/courses/jee/rank-data.js` and `/js/courses/neet/rank-data.js` (lowercase) — the real files are at `.../JEE/rank-data.js` / `.../NEET/rank-data.js` (uppercase). Firebase Hosting is case-sensitive. | Both `<script>` tags 404 in production. | Fixed casing in the two `src` attributes. No file moved. |
| 3 | 9 references across `index.html` (2 favicon `<link>`s + 7 SEO/JSON-LD image URLs), `rankJEE.html`, `rankNEET.html` (favicon + OG/Twitter meta + a 28px header `<img>` each), `sitemap.xml` (image sitemap entry), and 2 `neetjee-features-1to4.js` files (a 44px `<img>` in shared UI) all pointed to `/logo_transparent__1_.png` — a file that does not exist anywhere in the repository. | Broken favicon fallback, broken Organization/WebApplication schema image for rich results, broken logo image in 2 standalone pages and 1 shared UI panel. | All 17 occurrences repointed to `/assets/images/logo.png` — see next section; this turned out to be the same asset. |

### Lightened `index.html`: 1,188,627 bytes → 106,540 bytes (91% reduction)
Nearly the entire size was **one 1080×1080 PNG logo, base64-embedded twice** (`<img>` at ~42px and ~24px display size — 404,244 raw bytes each, ~539KB as base64 text, ×2). Since `index.html` is served `Cache-Control: no-cache` (deliberately, per §6), this meant every visitor re-downloaded over a megabyte of duplicate, uncacheable image data on every page load.
- Decoded both instances (confirmed byte-identical, MD5 `6fd560d...`), wrote once to `public/assets/images/logo.png`, replaced both `<img src="data:...">` with `<img src="/assets/images/logo.png">`.
- This file also turned out to be the missing `logo_transparent__1_.png` from bug #3 above — same logo, so no new asset was needed to fix that too.
- The image now falls under `firebase.json`'s existing `**/*.png` rule (`Cache-Control: public, max-age=31536000, immutable`) instead of inheriting `index.html`'s `no-cache`, so it's now actually cacheable across visits.

### Assets moved into `public/assets/`
`apple-touch-icon.png`, `favicon-32.png`, `icon-192.png`, `icon-192-maskable.png`, `icon-512.png`, `icon-512-maskable.png` → `assets/icons/`; `og-image.png`, new `logo.png` → `assets/images/`. Moved with `git mv` to preserve rename history. Every reference updated: `index.html` (`<link>` icons, splash-logo `<img>` + its `onerror` fallback), `manifest.json` (icons array + 2 shortcut icons), and — found only via full-repo grep, not obvious from filenames — 4 `payments-pro.js` files (one per course) that hardcode `icon-192.png` in a `Notification`/share payload.

**Deliberately left at `public/` root, not moved:** `robots.txt`, `sitemap.xml`, `ads.txt`, `manifest.json`, `favicon.ico`, `BingSiteAuth.xml`, `googleec3e31e16694f623.html`. Firebase Hosting serves `public/` as the literal web root with no rewrite for these; search engines, ad networks, and Bing/Google site-verification all expect them at exact top-level URLs (`/robots.txt`, not `/seo/robots.txt`). Moving them would need new `firebase.json` rewrites I have no way to test live — not worth the risk for files that are already perfectly organized by virtue of being tiny, single-purpose, and rarely touched.

### SEO: JSON-LD externalized
The 3 inline `<script type="application/ld+json">` blocks (WebApplication, Organization, SoftwareApplication — 3,600 / 703 / 876 chars) moved to `public/seo/structured-data/{webapplication,organization,softwareapplication}.json`, referenced via `<script type="application/ld+json" src="...">`. All 3 validated as parseable JSON before and after the move. Mandatory in-page metadata (`<title>`, meta description, canonical, OG/Twitter tags, robots meta) was left untouched in `index.html` — it needs to be there for crawlers that don't execute JS/fetch external script `src`.

### Ads: `public/ads/ads-display.js`
See bug #1. This is now the only file in `ads/` — the AdSense loader `<script>` (external, `pagead2.googlesyndication.com`) and the `<ins class="adsbygoogle">` ad-unit markup stay in `index.html`, since they're either external or inherently page markup.

### Config — deliberately not moved
`public/js/utils/constants.js` already holds the genuinely global config (`ADMIN_EMAIL`, `CF_BASE`, `FREE_LIMITS`, `PLAN_PRICE`, `GROQ_MODEL`, `STORAGE_KEYS`). Renaming/moving it to a new `config/` folder would be reorganization for its own sake with real risk (it's loaded as part of the ES-module helper shim described in §3) for no functional gain — it's already correctly separated from course-specific code. Left as-is.

### Explicitly not done, flagged instead of guessed at
- **Per-course lazy-loading for `neetjee-hub-*` / `rank-data.js`**: currently these load unconditionally regardless of active course (JEE copy used as the shared canonical source). Making this conditional on `window.__EIN_COURSE_FAMILY` (the same pattern already used for the main features/ui block) is possible, but `render-core.js` in **all four** course folders — including CBSE and NFSU — contains a `'neetjee'` view-dispatch branch, not just JEE/NEET's. I could not confirm from static analysis alone whether that branch is genuinely unreachable for CBSE/NFSU users (button is hidden, but e.g. a stale `location.hash` could theoretically still trigger it) or an intentional shared code path. Flagging rather than guessing, given this is a payments-adjacent production app I can't test live.
- **`patch/` folder** (`patch/exam-is-near/`, `patch/cloudflare-worker/`): left completely untouched — unclear if still in active use; not part of the Firebase-deployed `public/` tree either way.
- **`public/js/courses/NFSU.zip`** and the two `.bak-20260716-*` files: left in place per your own rule 13 (don't delete without confirming genuinely obsolete) — flagging for your own call.
- **`src/`**: untouched, per §3/§4 above — confirmed still excluded from hosting, still not an accurate reflection of production code.

### Verification performed (static only — same limits as §3/§6 apply)
- `node --check` on all 6 touched/new `.js` files — all pass.
- `manifest.json` and all 3 new `seo/structured-data/*.json` files — parsed successfully as JSON.
- `sitemap.xml` — parsed successfully as XML after edit.
- Re-parsed `index.html` with Python's `html.parser` (not regex) post-edit — no parse errors; script/link/img tag counts consistent with expected (31/15/3).
- Full-repo `grep` sweep confirms zero remaining references to any of the old paths (`/js/ui/ads-display.js`, lowercase `jee/neet` rank-data paths, `logo_transparent__1_.png`, the 7 pre-move icon/image filenames) anywhere outside `.git` history.
- Every local absolute path (`src=`/`href=`) in the rebuilt `index.html` resolves to a real file on disk (scripted check, not manual).
- Extracted logo confirmed byte-identical (MD5) to both original embedded copies before deletion.
- Bumped `sw.js` `CACHE_NAME`/`CACHE_STATIC` (`v7`→`v8` / `v6`→`v7`) per this repo's own established convention for structural changes.

### What this does NOT change
- Course-wise JS separation (`public/js/courses/{JEE,NEET,CBSE,NFSU}/`) — untouched, already correct.
- No `<script>` tag was reordered relative to any other, and none relative to the DOM elements around it — only `src`/`href` attribute values changed, given §6's documented lesson about load-order/DOM-position sensitivity in this file.
- No application logic, function, or behavior was rewritten — this was asset relocation and dangling-reference repair only.

### What you should still verify locally before deploying
Same standing advice as §3/§6: `firebase serve`, then specifically check (1) free-tier ads now actually render (bug #1 fix), (2) the favicon/logo shows correctly in the tab and PWA install prompt, (3) `rankJEE.html`/`rankNEET.html` show the header logo, (4) the "Switch Course" popup and NEET/JEE Hub still work across all 4 courses.

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

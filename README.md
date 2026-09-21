# Exam Is Near — Codebase Guide
**by ArkSetu** · [exam-is-near.web.app](https://exam-is-near.web.app)

> **⚠️ Out of date as of the src/ migration — read [`MIGRATION_NOTES.md`](./MIGRATION_NOTES.md) first.**
> `public/js/` has been replaced by real ES modules in `public/src/`, built
> with Vite (`npm run build`), deployed from `dist/` instead of `public/`
> directly. Everything below describing `public/js/`'s `<script defer>`
> tags and the old `src/` scaffold is historical context for *how the code
> used to be organized*, not how it works now.

---

## Project Structure

```
exam-is-near/
│
├── public/                          ← Firebase Hosting root (the ONLY deployed folder)
│   ├── index.html                   ← App shell — HTML + a small amount of inline
│   │                                   bootstrapping JS. Business logic lives in
│   │                                   public/js/ (see below), loaded via ordered
│   │                                   <script defer src="..."> tags, not inline.
│   ├── admin.html                   ← Admin panel (Google auth gated)
│   ├── finance.html                 ← Finance portal (Google auth + salted PIN gated)
│   ├── landing.html                 ← Public marketing page
│   ├── rankJEE.html                 ← JEE rank predictor (served at /jee/rank)
│   ├── rankNEET.html                ← NEET rank predictor (served at /neet/rank)
│   ├── pro_modal.html               ← Pro upgrade modal (reference copy)
│   ├── privacy.html / terms.html
│   ├── manifest.json                ← PWA manifest
│   ├── sw.js                        ← Service worker (bump CACHE_NAME/CACHE_STATIC
│   │                                   after structural changes — see current values
│   │                                   in the file itself)
│   ├── robots.txt / sitemap.xml / ads.txt / BingSiteAuth.xml / favicon.ico
│   │                                   ← kept at web root; search engines & ad
│   │                                   networks expect exact top-level URLs
│   │
│   ├── assets/
│   │   ├── icons/                   ← PWA icons (192/512, maskable variants, apple-touch)
│   │   └── images/                  ← logo.png, og-image.png
│   │
│   ├── ads/
│   │   └── ads-display.js           ← Free-tier AdSense display logic
│   │
│   ├── seo/
│   │   └── structured-data/         ← JSON-LD schema files (WebApplication,
│   │                                   Organization, SoftwareApplication) — currently
│   │                                   NOT wired into index.html yet; the 3 inline
│   │                                   <script type="application/ld+json"> blocks in
│   │                                   index.html are still the live ones
│   │
│   └── js/                          ← The real, live application code (~150 files)
│       ├── core/                    ← app-state.js, firebase-sync.js, course-selector.js
│       ├── shared/                  ← app-constants.js, pro-footer-bar.js, exam-hub-state.js
│       ├── utils/                   ← constants.js (ADMIN_EMAIL, STORAGE_KEYS, etc.), helpers.js
│       └── courses/
│           ├── JEE/ NEET/ CBSE/ NFSU/   ← per-course syllabi, formulas, and (mostly
│           │                              byte-identical, not yet trimmed) copies of
│           │                              features/ and ui/ — only the ACTIVE course's
│           │                              copy is injected at runtime (see
│           │                              index.html's course-family logic)
│           └── subjects-bridge.js   ← rebuilds legacy SUBJECTS_* globals from the
│                                       per-course tree
│
├── src/                             ← ⚠️ NOT used in production. Explicitly excluded
│   │                                   from Firebase Hosting (firebase.json →
│   │                                   hosting.ignore: "src/**"). This was a drafted
│   │                                   target design for a possible future Vite
│   │                                   rewrite that drifted from what's actually
│   │                                   deployed — its helpers don't match the real
│   │                                   ones in public/js/. Kept as a reference
│   │                                   scaffold for a future rewrite; don't treat
│   │                                   anything in here as describing current behavior.
│   └── (utils/ core/ features/ ui/ app.js)
│
├── patch/                           ← Old patch bundles (exam-is-near/, cloudflare-worker/).
│                                       Not part of the deployed public/ tree either way.
│
├── functions/                       ← Firebase Cloud Functions (Node 22)
│   ├── index.js                     ← createOrder, verifyPayment, checkProStatus,
│   │                                   activateTrial, fetchRazorpayFees, groqProxy, etc.
│   ├── welcome-email.js             ← Resend email on Pro activation
│   └── package.json
│
├── AUDIT.md                         ← Running log of security/structure audit passes —
│                                       read this for the history of what's been found,
│                                       fixed, and deliberately left open
├── RESTRUCTURING_NOTES.md           ← Log of the public/js/courses/ split (phase 1)
├── firebase.json                    ← Hosting config (public: "public"), CSP, COOP headers
├── firestore.rules                  ← Security rules
└── package.json                     ← Root scripts: dev, deploy, deploy:all
```

---

## Deploy Commands

```bash
# Hosting only (most common)
firebase deploy --only hosting

# Functions only
firebase deploy --only functions

# Rules only
firebase deploy --only firestore:rules

# Everything
firebase deploy

# Local dev server
firebase serve --only hosting
```

There is no build step — `public/` is served as-is (classic `<script>` tags, no bundler). There is currently no automated test suite or lint config in this repo; verification is manual (`firebase serve` + click through the app) plus the static checks logged in `AUDIT.md`.

---

## Key Architecture Decisions

### `index.html` is a shell, not a monolith

The original single ~10,300-line `index.html` (one big inline `<script>`, 268 functions) was split into ~150 real files under `public/js/`, loaded via ordered `<script defer src="...">` tags in the exact original sequence. Classic (non-module) `<script>` tags on one page share a single global lexical environment, so this required zero logic changes — behavior is the same as before, just physically split across files. **Load order matters and is deliberate** — see the `MODULE MIGRATION` comments directly in `index.html` before reordering anything.

### Per-course code: shared tree + injected active-course copy

`public/js/courses/{JEE,NEET,CBSE,NFSU}/` holds syllabus/manifest files (uniquely named — all 4 load together, needed for the "Switch Course" popup) and feature/UI files (currently byte-identical across all 4 courses — only the active course's copy is injected via `document.write`, keyed off `localStorage.activeCourse`, because loading more than one course's copy on the same page would double-declare the same top-level `const`/`let` names). See `RESTRUCTURING_NOTES.md` for the full split rationale.

### Storage keys — never hardcode

Centralized in `public/js/utils/constants.js → STORAGE_KEYS`. Study log keys are per-course (`studyLog_jee`, `studyLog_neet`, etc.) to prevent cross-course data bleed. **~30+ call sites still use raw string literals instead of `STORAGE_KEYS`** — known cleanup item, deliberately not done in a drive-by pass since it touches a lot of call sites in a payments-adjacent app (see `AUDIT.md`).

### Pro verification — server-only writes

- Client can **read** `/proUsers/{uid}` (owns doc)
- Client **cannot write** — only Cloud Functions with Admin SDK write Pro status
- `isProUser()` caches the server response for 5 minutes

### COOP header for Google Sign-in

`firebase.json` sets `Cross-Origin-Opener-Policy: same-origin-allow-popups`. Required for `signInWithPopup`. **Do not remove.**

### Admin check

Admin email in `public/js/utils/constants.js → ADMIN_EMAIL`. Firestore rule `isAdmin()` uses the Firebase Auth token — cannot be spoofed from the client.

### Service worker — standalone pages passthrough

`sw.js` never intercepts `admin.html`, `finance.html`, `rankNEET.html`, `rankJEE.html` — these are always fetched fresh from network. Always bump `CACHE_NAME`/`CACHE_STATIC` after structural changes.

---

## Security

### Finance portal (`finance.html`)

- **Layer 1** — Google Sign-in: `user.email === ADMIN_EMAIL` hardcoded check
- **Layer 2** — PIN gate: salted SHA-256 hash (`SHA-256(PIN + SALT)`)
- `noindex` meta prevents Google indexing
- Firebase config hardcoded inline — `__env.js` deleted and blocked in `firebase.json`'s ignore list

### To change the finance PIN

1. Go to [emn178.github.io/online-tools/sha256.html](https://emn178.github.io/online-tools/sha256.html)
2. Type: `yourNewPIN` + `ArkSetu@ExamIsNear#Finance2026$` (no space between them)
3. Copy the hash
4. In `finance.html` replace the `FINANCE_PIN_HASH` value
5. Deploy

### Coupon security

`/coupons/` collection: `allow read: if isAdmin()` — regular users cannot enumerate coupon codes. Cloud Functions validate coupons via Admin SDK (bypasses rules).

### Razorpay

- Public key is **never** hardcoded client-side — `index.html`'s checkout flow reads it from the server response (sourced from Cloud Functions' Secret Manager). Same pattern as a Stripe publishable key, just fetched rather than inlined.
- Secret key lives in Firebase Secret Manager only, read via `defineSecret(...)` in `functions/index.js`.
- Order amount is computed server-side — client sends `plan`, server computes price.
- Payment signature is verified server-side with HMAC-SHA256.
- `fetchRazorpayFees` (admin stats endpoint) previously hardcoded its own separate Razorpay Key ID, inconsistent with the one used for actual checkout — fixed in `AUDIT.md` §9 by having it reuse the same `RZP_KEY_ID` Secret Manager value as checkout. Worth a one-time sanity check that the reported fee figures match your Razorpay dashboard after deploying.

---

## PWA Icons

| File | Use | Size |
|------|-----|------|
| `assets/icons/icon-192.png` | PWA install, Android | 192×192 |
| `assets/icons/icon-192-maskable.png` | Android adaptive icon | 192×192 |
| `assets/icons/icon-512.png` | PWA splash | 512×512 |
| `assets/icons/icon-512-maskable.png` | Android adaptive icon | 512×512 |
| `assets/icons/apple-touch-icon.png` | iOS home screen | 180×180 |
| `favicon.ico` | Browser tab | 16+32px |
| `favicon-32.png` | Google search result | 32×32 |
| `assets/images/og-image.png` | WhatsApp/Twitter/LinkedIn share | 1200×630 |

To update icons: replace the PNG files and deploy. On mobile, uninstall the PWA and reinstall via "Add to Home Screen" to pick up new icons.

---

## Splash Screen

Full-screen animated splash on app load:
- Light `#f5f7ff` background
- Logo animates in with bounce scale
- "ArkSetu" in navy, "Exam Is Near" in orange
- 8 feature pills in solid bright colours
- Shows for a minimum of **2 seconds** then fades out
- Controlled by `window._splashStart` timestamp in `index.html`

---

## Environment Secrets

**Never in frontend code. Never in a `.env` committed to git.**

| Secret | Where |
|--------|-------|
| `RZP_KEY_ID` / `RZP_KEY_SECRET` | Firebase Secret Manager (`defineSecret`) |
| `GROQ_API_KEY` | Firebase Secret Manager |
| `GEMINI_API_KEY` | Firebase Secret Manager |
| `GCP_BILLING_KEY` | Firebase Secret Manager |
| `FINANCE_PIN_SALT` | Hardcoded in `finance.html` only |

---

## Feature Map

| Feature | Source | View name |
|---------|--------|-----------|
| Home / Syllabus | `public/js/courses/<course>/ui/render-core.js` | `dashboard` |
| Pomodoro Timer | `public/js/courses/<course>/features/pomodoro-full.js` | `pomodoro` |
| Flashcards | `public/js/courses/<course>/features/flashcards.js` | `flashcards` |
| Quiz Mode | `public/js/courses/<course>/features/quiz.js` | `quiz` |
| AI Tutor | `public/js/courses/<course>/features/ai-assistant-*.js` | `ai` |
| Analytics | `public/js/courses/<course>/features/analytics.js` | `analytics` |
| Study Materials | `public/js/courses/<course>/features/files-materials.js` | `files` |
| NEET/JEE Hub | `public/js/courses/JEE/features/neetjee-*.js` (canonical copy) | `neetjee` |
| Pro Upgrade | `public/js/courses/<course>/features/payments-pro.js` | modal |
| Admin Panel | `public/admin.html` | standalone |
| Finance Portal | `public/finance.html` | standalone |
| JEE Rank | `public/rankJEE.html` | `/jee/rank` |
| NEET Rank | `public/rankNEET.html` | `/neet/rank` |

`<course>` is whichever of `JEE/NEET/CBSE/NFSU` is active — the actual file loaded depends on `localStorage.activeCourse` at runtime (see `index.html`'s course-family injection block).

---

## Known Issues / Watchlist

See `AUDIT.md` for the full, dated history. Current open items:

- ~30+ raw `localStorage` call sites not yet migrated to the centralized `STORAGE_KEYS` constant.
- The 3 inline JSON-LD blocks in `index.html` could be externalized to the already-created `public/seo/structured-data/*.json` files (SEO-only, not a functional bug).
- `src/` is a drifted, not-live reference scaffold for a possible future Vite rewrite — don't cite it as describing current behavior.
- Always bump `CACHE_NAME`/`CACHE_STATIC` in `sw.js` after major `index.html`/`public/js/` structural changes.

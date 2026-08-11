# Exam Is Near — Codebase Guide
**by ArkSetu** · [exam-is-near.web.app](https://exam-is-near.web.app)

---

## Project Structure

```
exam-is-near/
│
├── public/                          ← Firebase Hosting root (deployed)
│   ├── index.html                   ← App shell (HTML + CSS + all JS inline)
│   ├── admin.html                   ← Admin panel (Google auth gated)
│   ├── finance.html                 ← Finance portal (Google auth + salted PIN gated)
│   ├── landing.html                 ← Public marketing page
│   ├── rankJEE.html                 ← JEE rank predictor (served at /jee/rank)
│   ├── rankNEET.html                ← NEET rank predictor (served at /neet/rank)
│   ├── privacy.html
│   ├── terms.html
│   ├── pro_modal.html               ← Pro upgrade modal (reference)
│   ├── manifest.json                ← PWA manifest (real PNG icons, dark theme)
│   ├── sw.js                        ← Service worker (v5)
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── ads.txt                      ← AdSense verification
│   ├── BingSiteAuth.xml             ← Bing Search Console verification
│   ├── googleec3e31e16694f623.html  ← Google Search Console verification
│   │
│   ├── icon-192.png                 ← PWA icon (white bg)
│   ├── icon-192-maskable.png        ← Android adaptive icon 192px
│   ├── icon-512.png                 ← PWA icon 512px
│   ├── icon-512-maskable.png        ← Android adaptive icon 512px
│   ├── apple-touch-icon.png         ← iOS home screen icon (180px)
│   ├── favicon.ico                  ← Browser tab icon
│   ├── favicon-32.png               ← Google search result icon
│   └── og-image.png                 ← Social share preview (1200×630)
│
├── src/                             ← Organised source (Phase 1: reference)
│   ├── app.js                       ← Entry point + module graph docs
│   │
│   ├── utils/
│   │   ├── constants.js             ← ALL magic values (admin email, keys, limits, LS keys)
│   │   ├── storage.js               ← localStorage / IDB helpers + daily counters
│   │   └── helpers.js               ← Pure utils (esc, safeSet, showToast, genId, today)
│   │
│   ├── core/
│   │   ├── state.js                 ← Global state object + S() setter
│   │   ├── firebase.js              ← Firebase init, auth, Firestore sync, pushToFirebase
│   │   └── router.js                ← switchView(), URL history, page meta updates
│   │
│   └── features/
│       ├── study/
│       │   ├── course-data.js       ← All course syllabi (JEE/NEET/NFSU/CBSE/UPSC)
│       │   ├── timer-core.js        ← startTimer / pauseTimer / resetTimer
│       │   ├── alarm.js             ← Alarm system + ringtones + clock
│       │   ├── pomodoro.js          ← Full Pomodoro feature (state + render)
│       │   ├── flashcards.js        ← Flashcard decks + AI generation
│       │   ├── quiz.js              ← Quiz mode + scoring + review
│       │   └── materials.js         ← User study materials (notes/PDFs)
│       ├── ai/
│       │   ├── groq.js              ← askAI(), chat history, AI message pipeline
│       │   └── ai-render.js         ← AI page render + quick prompts
│       ├── payments/
│       │   └── pro.js               ← isProUser, Razorpay flow, trial, coupon
│       ├── analytics/
│       │   └── analytics.js         ← Study analytics + charts + streak
│       └── neet-jee/
│           └── hub.js               ← NEET/JEE hub: rank predictor, OMR, SRS, weightage
│
├── functions/                       ← Firebase Cloud Functions (Node 22)
│   ├── index.js                     ← createOrder, verifyPayment, checkProStatus,
│   │                                   activateTrial, groqProxy
│   ├── welcome-email.js             ← Resend email on Pro activation
│   └── package.json
│
├── firebase.json                    ← Hosting config (public: "public"), CSP, COOP headers
├── firestore.rules                  ← Security rules
├── .firebaserc                      ← Project: exam-is-near
├── .gitignore
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

---

## Key Architecture Decisions

### Why still a monolith (`index.html`)?

The app is a vanilla JS SPA in a single HTML file. The `src/` directory is **Phase 1** of reorganisation — readable, searchable, maintainable without breaking the running app.

**Phase 2** (next): Add Vite. `index.html` becomes a 50-line shell, `src/` becomes the actual runtime.

### Storage keys — never hardcode

All localStorage keys are in `src/utils/constants.js → STORAGE_KEYS`. Study log keys are per-course (`studyLog_jee`, `studyLog_neet` etc.) to prevent cross-course data bleed. **Always import from constants.js.**

### Study materials — course filtering

`loadAdminMaterials()` filters client-side by `activeCourse` using `.toLowerCase()` comparison. Admin dropdown saves course values in lowercase (`jee`, `neet`, `nfsu`, `cbse10`, `cbse12`, `general`). Materials tagged `general` show for all courses.

### Pro verification — server-only writes

- Client can **read** `/proUsers/{uid}` (owns doc)
- Client **cannot write** — only Cloud Functions with Admin SDK write Pro status
- `isProUser()` caches the server response for 5 minutes

### COOP header for Google Sign-in

`firebase.json` sets `Cross-Origin-Opener-Policy: same-origin-allow-popups`. Required for `signInWithPopup`. **Do not remove.**

### Admin check

Admin email in `src/utils/constants.js → ADMIN_EMAIL`. Firestore rule `isAdmin()` uses Firebase Auth token — cannot be spoofed from client.

### Service worker — standalone pages passthrough

`sw.js` v5 never intercepts `admin.html`, `finance.html`, `rankNEET.html`, `rankJEE.html`. These are always fetched fresh from network. Fallback to `index.html` is disabled for direct `.html` requests. Always bump `CACHE_NAME` version after major changes.

---

## Security

### Finance portal (`finance.html`)

- **Layer 1** — Google Sign-in: `user.email === ADMIN_EMAIL` hardcoded check
- **Layer 2** — PIN gate: salted SHA-256 hash (`SHA-256(PIN + SALT)`)
- `noindex` meta prevents Google indexing
- Firebase config hardcoded inline — `__env.js` deleted and blocked in `firebase.json` ignore list

### To change finance PIN

1. Go to [emn178.github.io/online-tools/sha256.html](https://emn178.github.io/online-tools/sha256.html)
2. Type: `yourNewPIN` + `ArkSetu@ExamIsNear#Finance2026$` (no space between them)
3. Copy the hash
4. In `finance.html` replace `FINANCE_PIN_HASH` value
5. Deploy

### Coupon security

`/coupons/` collection: `allow read: if isAdmin()` — regular users cannot enumerate coupon codes. Cloud Functions validate coupons via Admin SDK (bypasses rules).

### Razorpay

- Public key (`rzp_live_...`) in frontend — safe by design (same as Stripe publishable key)
- Secret key in Firebase Secret Manager only
- Order amount computed server-side — client sends `plan`, server computes price
- Payment signature verified server-side with HMAC-SHA256

---

## PWA Icons

| File | Use | Size |
|------|-----|------|
| `icon-192.png` | PWA install, Android | 192×192 |
| `icon-192-maskable.png` | Android adaptive icon | 192×192 |
| `icon-512.png` | PWA splash | 512×512 |
| `icon-512-maskable.png` | Android adaptive icon | 512×512 |
| `apple-touch-icon.png` | iOS home screen | 180×180 |
| `favicon.ico` | Browser tab | 16+32px |
| `favicon-32.png` | Google search result | 32×32 |
| `og-image.png` | WhatsApp/Twitter/LinkedIn share | 1200×630 |

To update icons: replace the PNG files in `public/` and deploy. On mobile, uninstall PWA and reinstall via "Add to Home Screen".

---

## Splash Screen

Full-screen animated splash on app load:
- Light `#f5f7ff` background
- Logo animates in with bounce scale
- "ArkSetu" in navy, "Exam Is Near" in orange
- 8 feature pills in solid bright colours
- Shows for minimum **2 seconds** then fades out
- Controlled by `window._splashStart` timestamp in `index.html`

---

## Environment Secrets

**Never in frontend code. Never in `.env` committed to git.**

| Secret | Where |
|--------|-------|
| `RZP_KEY_SECRET` | Firebase Secret Manager |
| `GROQ_API_KEY` | Firebase Secret Manager |
| `RESEND_API_KEY` | Firebase Secret Manager |
| `RZP_KEY_ID` | Public — frontend code (safe to expose) |
| `FINANCE_PIN_SALT` | Hardcoded in `finance.html` only |

---

## Feature Map

| Feature | Source file | View name |
|---------|-------------|-----------|
| Home / Syllabus | `src/ui/pages/main-render.js` | `dashboard` |
| Pomodoro Timer | `src/features/study/pomodoro.js` | `pomodoro` |
| Flashcards | `src/features/study/flashcards.js` | `flashcards` |
| Quiz Mode | `src/features/study/quiz.js` | `quiz` |
| AI Tutor | `src/features/ai/groq.js` | `ai` |
| Analytics | `src/features/analytics/analytics.js` | `analytics` |
| Study Materials | `src/features/study/materials.js` | `files` |
| NEET/JEE Hub | `src/features/neet-jee/hub.js` | `neetjee` |
| Profile | `src/ui/pages/profile.js` | `profile` |
| Admin Panel | `public/admin.html` | standalone |
| Finance Portal | `public/finance.html` | standalone |
| JEE Rank | `public/rankJEE.html` | `/jee/rank` |
| NEET Rank | `public/rankNEET.html` | `/neet/rank` |
| Pro Upgrade | `src/features/payments/pro.js` | modal |

---

## Bugs Fixed (this session)

- Study materials showing for all courses → `loadAdminMaterials` filters by `activeCourse`
- Admin dropdown uppercase (`"JEE"`) vs app lowercase (`"jee"`) mismatch → fixed
- Study log bleeding across courses → per-course keys (`studyLog_jee` etc.) in 5 places
- `loadTheme`, `checkMaintenance`, `loadAnnouncement`, `loadExamSchedule` ReferenceErrors → restored
- `admin.html` and `finance.html` loading as `index.html` → SW v5 passthrough fix
- `__env.js` publicly accessible → deleted + blocked in `firebase.json` ignore list
- Finance PIN was unsalted SHA-256 of `1234` → salted hash, not crackable via rainbow tables
- `manifest.json` had 📚 emoji SVG data URIs → real PNG files

---

## Known Issues / Watchlist

- `index.html` is still the runtime monolith — Phase 2 (Vite) will fix this
- `admin.html` references functions from `index.html` scope — keep both in `public/`
- Groq API key proxied through Cloud Functions — never expose directly in frontend
- Always bump `CACHE_NAME` in `sw.js` after major `index.html` changes

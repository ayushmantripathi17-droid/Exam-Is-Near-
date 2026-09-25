# Exam Is Near — no-Blaze backend

Every route from `functions/index.js` (Gen 2 Cloud Functions) ported to Vercel
serverless functions, so nothing needs the Firebase Blaze plan. Firestore,
Auth, and Hosting stay on Firebase (free Spark plan, no billing account).
File storage is Google Drive links (no Storage bucket, no Cloudinary).

## ⚠️ Layout — read before extracting

`api/`, `package.json`, and `vercel.json` live inside **`vercel-backend/`**,
not at this zip's top level. That's deliberate: your frontend project
already has its own root `package.json` (React/Vite/Tailwind/Zustand deps,
with a matching `package-lock.json`). If you extract a second `package.json`
straight into that same root, it silently overwrites yours — Vercel's build
would then `npm install` from a file that only lists `firebase-admin` and
`razorpay`, and your local `npm run dev` would start failing too, since none
of your frontend deps are declared anymore.

**If you already extracted an earlier version flat into your project root
and see a `package.json` dated today sitting next to a much older
`package-lock.json`:** that's this collision. Recover the original with
`git status` then `git checkout -- package.json` (or `git restore
package.json`) if it was tracked — Git still has it even though the file on
disk was replaced.

Going forward, `vercel-backend/` is its own deploy unit: copy that whole
folder in wherever you like (sibling to `public/`, `src/`, `functions/` is
fine) and when you create the Vercel project, set **Root Directory** to
`vercel-backend` in Project Settings. Vercel will then only ever read
`vercel-backend/package.json`, never touching your frontend's.

`functions/` and `src/config/backend.js` don't have this problem — neither
one shares a filename with anything you already have.

## Endpoint map

| Old (Cloud Function)         | New (Vercel)                          |
|-------------------------------|----------------------------------------|
| `createOrder`                 | `POST /api/create-order`              |
| `verifyPayment`                | `POST /api/verify-payment`            |
| `checkProStatus`               | `GET  /api/check-pro-status`          |
| `activateTrial`                | `POST /api/activate-trial`            |
| `groqProxy`                    | `POST /api/groq-proxy`                |
| `fetchRazorpayFees`            | `GET  /api/fetch-razorpay-fees`       |
| `refreshLegalUpdates` (manual) | `POST /api/refresh-legal-updates`     |
| `refreshLegalUpdatesScheduled` | `GET  /api/cron/refresh-legal-updates` (Vercel Cron, see `vercel.json`) |
| `fetchGCPBilling`              | **not ported** — it reads your GCP billing export via BigQuery, which only exists once Blaze + billing export are already on. Meaningless pre-Blaze; re-add as a Firebase function later if you want it. |

Request/response shapes are unchanged — same `Authorization: Bearer <idToken>`
header, same `{ result: ... }` / `{ error: { message } }` bodies, same
`body.data ?? body` unwrapping. So the frontend only needs its request URLs
updated — point them at `src/config/backend.js`'s `get*Url()` functions
instead of hardcoded Cloud Functions URLs, and nothing else about how you
call them changes.

## Deploy

1. `cd vercel-backend && npm install`, then deploy to Vercel (`vercel --prod`
   from inside `vercel-backend/`, or connect the repo in the Vercel
   dashboard with **Root Directory set to `vercel-backend`** — Hobby plan,
   no card).
2. Set every env var from `.env.example`'s Vercel section in the Vercel
   project settings.
3. In `functions/index.js`'s old world, `RZP_KEY_ID`/`RZP_KEY_SECRET`/
   `GROQ_API_KEY`/`GEMINI_API_KEY` were Secret Manager values — here they're
   plain Vercel env vars (Vercel encrypts them at rest; same practical
   security for a project this size).
4. Generate a Firebase service account key (Project Settings → Service
   Accounts) and set it as `FIREBASE_SERVICE_ACCOUNT`.
5. Point Razorpay's webhook (Dashboard → Webhooks, `payment.captured` event)
   at `https://<your-vercel-domain>/api/razorpay-webhook`, and set
   `RAZORPAY_WEBHOOK_SECRET` to match.
6. In your Vite app, set `VITE_VERCEL_API_BASE` to your deployed Vercel
   domain, and update the frontend's fetch calls to use the `get*Url()`
   helpers from `src/config/backend.js` instead of hardcoded
   `https://asia-south1-....cloudfunctions.net/...` URLs.

## Resource links (replaces Firebase Storage / Cloudinary)

Admin panel: paste a normal Drive "Share" link into whatever field used to
trigger a file upload, and store that string directly on the Firestore doc
(e.g. `courses/{id}/resources`). `src/config/backend.js` exports
`toDrivePreviewUrl()` (embed in an `<iframe>` for in-app viewing) and
`toDriveDownloadUrl()` (force download). The Drive file's sharing setting
must be "Anyone with the link" or students signed in as themselves won't be
able to open it.

## `functions/` — kept, dormant, not deployed

`functions/index.js` is your original Cloud Functions file, copied in
unchanged. It stays in the repo but is **not deployed** — don't run
`firebase deploy --only functions` while you're avoiding Blaze, since a
Gen 2 function (`onRequest`/`onCall`/`onSchedule` from `firebase-functions/v2`)
requires the Blaze plan to deploy at all, even at zero usage. Don't delete
this folder; it's the fallback, not dead code.

`functions/package.json` is included so it's deployable exactly as-is —
nothing to rewrite — once you flip Blaze on.

## Moving a feature back to Firebase later

Once Blaze is on at 10k users:
1. `firebase deploy --only functions` from the `functions/` folder above —
   no edits needed, it was never touched.
2. Bind its secrets in Secret Manager (`RZP_KEY_ID`, `RZP_KEY_SECRET`,
   `GROQ_API_KEY`, `GEMINI_API_KEY`, `GCP_BILLING_KEY`) the way it already
   expects via `defineSecret`.
3. Flip the matching env var (`VITE_AI_PROVIDER=firebase` or
   `VITE_PAYMENT_PROVIDER=firebase`) — no other code changes, since
   `backend.js` is the only place that knows which backend is live.

You can flip AI and payments independently, and back and forth, at any
time — both backends stay valid, so this isn't a one-way migration.

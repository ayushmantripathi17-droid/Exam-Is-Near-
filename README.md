# Exam Is Near — admin console & backend fixes

Copy these files into your repo (same relative paths). Overwrites: api/_lib/auth.js, api/_lib/billing.js,
api/create-order.js, api/verify-payment.js, api/razorpay-webhook.js, public/finance.html.
New: api/admin.js, api/_lib/paylog.js, api/_lib/welcome.js, public/console.html.

If you deploy from vercel-backend/, copy api/ there too (and consider deleting the duplicate api/ tree).

Env vars: FIREBASE_SERVICE_ACCOUNT, ALLOWED_ORIGINS (include your console's origin), RZP_KEY_ID, RZP_KEY_SECRET,
RAZORPAY_WEBHOOK_SECRET, optional RESEND_API_KEY / EMAIL_FROM.
Razorpay webhook events: payment.captured, payment.failed -> /api/razorpay-webhook

Check the API base URL in public/console.html (API) and public/finance.html (VERCEL_API).
Console URL after hosting: /console.html

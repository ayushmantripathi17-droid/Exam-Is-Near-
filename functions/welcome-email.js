/**
 * ══════════════════════════════════════════════════════════
 *  Exam Is Near — Welcome Email Function
 *  Triggered automatically after verifyPayment succeeds
 *
 *  Uses Resend (resend.com) — free tier: 3,000 emails/month
 *
 *  SETUP:
 *  1. Sign up at resend.com (free)
 *  2. Add your domain or use onboarding@resend.dev for testing
 *  3. firebase functions:secrets:set RESEND_API_KEY
 *     → paste your Resend API key
 *  4. Add sendWelcomeEmail export to your functions/index.js
 *     (copy the export at the bottom of this file)
 *  5. firebase deploy --only functions
 * ══════════════════════════════════════════════════════════
 */

const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

// ── Triggered whenever a user's Firestore doc changes ──
// Fires when isPro flips from false → true (payment or trial)
exports.sendWelcomeEmail = onDocumentWritten(
  {
    document:  "users/{uid}",
    region:    "asia-south1",
    secrets:   [RESEND_API_KEY],
  },
  async (event) => {
    const before = event.data?.before?.data();
    const after  = event.data?.after?.data();

    // Only send when isPro just became true
    if (after?.isPro !== true || before?.isPro === true) return;

    const uid   = event.params.uid;
    const plan  = after.plan || "monthly";
    const isTrial = plan === "trial";

    // Get user email from Firebase Auth
    let userRecord;
    try {
      userRecord = await admin.auth().getUser(uid);
    } catch (e) {
      console.error("Could not get user record:", e);
      return;
    }

    const email = userRecord.email;
    const name  = userRecord.displayName?.split(" ")[0] || "there";

    if (!email) {
      console.log("No email for uid:", uid);
      return;
    }

    // Build email content
    const subject = isTrial
      ? "🎁 Your 7-day Pro trial has started — Exam Is Near"
      : "⭐ Welcome to Pro — Exam Is Near";

    const expiresDate = after.expiresAt
      ? new Date(after.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : null;

    const htmlBody = buildEmailHtml({ name, plan, isTrial, expiresDate });

    // Send via Resend
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY.value()}`,
          "Content-Type":  "application/json",
        },
        body: JSON.stringify({
          from:    "Exam Is Near <noreply@exam-is-near.web.app>",
          // ↑ Replace with your verified Resend domain email
          // For testing use: onboarding@resend.dev
          to:      [email],
          subject,
          html:    htmlBody,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));
      console.log("Welcome email sent to", email, "| Resend ID:", data.id);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }
  }
);


// ── Email HTML template ──
function buildEmailHtml({ name, plan, isTrial, expiresDate }) {
  const planLabel = isTrial ? "7-Day Free Trial" : plan === "annual" ? "Annual Pro" : "Monthly Pro";
  const heroColor = isTrial ? "#06D6A0" : "#FFE66D";
  const heroText  = isTrial
    ? "Your free trial is live! Explore all Pro features for 7 days — no strings attached."
    : plan === "annual"
      ? "Welcome to Annual Pro! You've saved ₹792 and unlocked everything for a full year."
      : "Welcome to Pro! Every feature is now unlocked. Study smarter from today.";

  const features = [
    ["Unlimited AI Flashcards & Quizzes", "Generate as many as you need"],
    ["Priority AI Tutor", "Faster, deeper responses"],
    ["Ad-Free Experience", "Zero distractions, always"],
    ["Cloud Backup (500 MB)", "Your data is safe"],
    ["PDF Progress Export", "Download your study report"],
    ["Advanced Analytics", "Weekly insights & streaks"],
  ];

  const featureRows = features.map(([f, d]) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1a1a28">
        <span style="color:${heroColor};font-size:13px;margin-right:10px">✦</span>
        <strong style="color:#ccc;font-size:13px">${f}</strong>
        <span style="color:#555;font-size:12px;margin-left:6px">— ${d}</span>
      </td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${planLabel} — Exam Is Near</title>
</head>
<body style="margin:0;padding:0;background:#06060f;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#06060f;padding:32px 16px">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

      <!-- Logo bar -->
      <tr>
        <td style="padding:0 0 24px;text-align:center">
          <span style="font-size:22px;font-weight:800;background:linear-gradient(90deg,#FFE66D,#ffb700);-webkit-background-clip:text;color:#FFE66D">Exam Is Near</span>
          <div style="font-size:10px;color:#333;letter-spacing:3px;margin-top:4px;text-transform:uppercase">by ArkSetu</div>
        </td>
      </tr>

      <!-- Hero card -->
      <tr>
        <td style="background:#0f0f1a;border:1px solid #1e1e2e;border-radius:16px;padding:32px 28px;text-align:center">
          <div style="font-size:40px;margin-bottom:16px">${isTrial ? "🎁" : "⭐"}</div>
          <h1 style="margin:0 0 10px;font-size:22px;font-weight:800;color:#EDE8E0">
            Hi ${name}, ${isTrial ? "your trial is live!" : "welcome to Pro!"}
          </h1>
          <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.7">${heroText}</p>

          ${expiresDate ? `<div style="background:#${isTrial ? "06D6A0" : "FFE66D"}15;border:1px solid #${isTrial ? "06D6A0" : "FFE66D"}30;border-radius:10px;padding:10px 16px;font-size:12px;color:#${isTrial ? "06D6A0" : "FFE66D"};font-weight:600;margin-bottom:24px">
            ${isTrial ? "Trial" : "Subscription"} active until ${expiresDate}
          </div>` : ""}

          <a href="https://exam-is-near.web.app" style="display:inline-block;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#080800;padding:13px 28px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.3px">
            Open Exam Is Near →
          </a>
        </td>
      </tr>

      <!-- Features -->
      <tr>
        <td style="padding:24px 0 0">
          <div style="background:#0c0c18;border:1px solid #1a1a28;border-radius:14px;padding:20px 22px">
            <div style="font-size:10px;color:#333;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px">Everything now unlocked for you</div>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${featureRows}
            </table>
          </div>
        </td>
      </tr>

      <!-- Tips -->
      <tr>
        <td style="padding:20px 0 0">
          <div style="background:#0c0c18;border:1px solid #1a1a28;border-radius:14px;padding:20px 22px">
            <div style="font-size:10px;color:#333;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px">3 things to try first</div>
            <div style="font-size:13px;color:#666;line-height:1.8">
              1. 🃏 Go to <strong style="color:#aaa">Flashcards</strong> → tap "AI Generate" → type any topic<br>
              2. 🤖 Open <strong style="color:#aaa">AI Tutor</strong> → ask it to explain any chapter<br>
              3. 📊 Check <strong style="color:#aaa">Analytics</strong> → see your study heatmap
            </div>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:28px 0 0;text-align:center">
          <div style="font-size:11px;color:#222;line-height:1.8">
            Questions? Reply to this email or write to
            <a href="mailto:arksetu@gmail.com" style="color:#333;text-decoration:none">arksetu@gmail.com</a><br>
            <a href="https://exam-is-near.web.app/terms.html" style="color:#1e1e2e;text-decoration:none">Terms of Service</a>
            &nbsp;·&nbsp;
            <a href="https://exam-is-near.web.app/privacy.html" style="color:#1e1e2e;text-decoration:none">Privacy Policy</a>
            <br><br>
            © 2025 ArkSetu · exam-is-near.web.app
          </div>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

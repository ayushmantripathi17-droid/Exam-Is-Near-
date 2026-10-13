// api/_lib/welcome.js — Vercel replacement for functions/welcome-email.js (a Firestore
// trigger, which needs Blaze). Called from activateProInDB when Pro newly starts.
// Env: RESEND_API_KEY (required to send), EMAIL_FROM (optional; the sender domain must
// be verified in Resend, or use "onboarding@resend.dev" while testing).
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function sendWelcome({ email, displayName, plan, expiresAt }) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !email) return;
  const name = esc((displayName || "").split(" ")[0] || "there");
  const until = new Date(expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(4000),
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Exam Is Near <noreply@exam-is-near.web.app>",
        to: [email],
        subject: plan === "trial" ? "Your Exam Is Near free trial has started 🎉" : "Welcome to Exam Is Near Pro 🎉",
        html: `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto"><h2>Hi ${name}, you're all set!</h2>
<p>Your <b>${esc(plan)}</b> access is active until <b>${esc(until)}</b>. Unlimited AI tutor, all study materials and full analytics are unlocked.</p>
<p>Good luck with the exams — the Exam Is Near team</p></div>`,
      }),
    });
  } catch (e) {
    console.warn("[welcome] email failed:", e.message);
  }
}
module.exports = { sendWelcome };

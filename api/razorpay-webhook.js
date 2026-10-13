// api/razorpay-webhook.js — rewritten.
// Fixes: (1) the old file assigned module.exports.config and then replaced module.exports,
// so bodyParser:false was lost and the raw body could never be read; (2) no idempotency;
// (3) nothing was logged. Env: RAZORPAY_WEBHOOK_SECRET, FIREBASE_SERVICE_ACCOUNT.
// Dashboard events to enable: payment.captured, payment.failed.
const crypto = require("crypto");
const { activateProInDB, db } = require("./_lib/billing");
const { logEvent } = require("./_lib/paylog");

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const raw = await getRawBody(req);
  const sig = String(req.headers["x-razorpay-signature"] || "");
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "").update(raw).digest("hex");
  const ok = sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!ok) {
    await logEvent("fraudAttempts", { reason: "bad webhook signature", ip: req.headers["x-forwarded-for"] || "" });
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  const event = JSON.parse(raw);
  const pay = event.payload?.payment?.entity || {};
  const eventId = req.headers["x-razorpay-event-id"] || `${event.event}_${pay.id || Date.now()}`;
  const evRef = db.collection("webhookEvents").doc(eventId);

  try {
    await evRef.create({ event: event.event, paymentId: pay.id || null, orderId: pay.order_id || null, amount: (pay.amount || 0) / 100, at: Date.now() });
  } catch (e) {
    if (e.code === 6) return res.status(200).json({ received: true, duplicate: true }); // already handled
    console.warn("[webhook] event log failed:", e.message);
  }

  try {
    if (event.event === "payment.failed") {
      await logEvent("paymentFailures", {
        stage: "razorpay", uid: pay.notes?.uid || null, orderId: pay.order_id, paymentId: pay.id,
        error: pay.error_description || pay.error_reason || "payment failed",
      });
    } else if (event.event === "payment.captured" && pay.notes?.uid && pay.notes?.plan) {
      const { uid, plan, couponCode } = pay.notes;
      const cur = (await db.collection("proUsers").doc(uid).get()).data();
      if (cur?.paymentId !== pay.id) { // verify-payment hasn't already done it
        await activateProInDB(uid, {
          plan, amountPaidRupees: Math.round((pay.amount || 0) / 100), couponCode: couponCode || null,
          orderId: pay.order_id, paymentId: pay.id, displayName: "", email: pay.email || "",
        });
        const rec = { uid, plan, orderId: pay.order_id, paymentId: pay.id, amount: Math.round((pay.amount || 0) / 100), source: "webhook" };
        await logEvent("payments", rec, pay.id);
        await logEvent("payment_logs", { ...rec, status: "captured" });
      }
    }
  } catch (e) {
    console.error("[webhook] processing failed:", e.message);
    await evRef.delete().catch(() => {}); // let Razorpay retry
    return res.status(500).json({ error: "processing failed" });
  }
  res.status(200).json({ received: true });
};

module.exports = handler;
module.exports.config = { api: { bodyParser: false } }; // must come AFTER the export above

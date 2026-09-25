// api/razorpay-webhook.js
// Not in the original functions/index.js — added because Pro activation
// otherwise relies entirely on the client calling verify-payment, which
// never fires if the user closes the tab right after paying. This is a
// safety net, not a replacement: set it in Razorpay Dashboard -> Webhooks
// for the "payment.captured" event.
//
// Env vars: RAZORPAY_WEBHOOK_SECRET, FIREBASE_SERVICE_ACCOUNT

const crypto = require("crypto");
const { activateProInDB } = require("./_lib/billing");

// Needs the raw body to verify the HMAC signature, so the default JSON
// parser is disabled for this route.
module.exports.config = {
  api: { bodyParser: false },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers["x-razorpay-signature"];

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    res.status(400).json({ error: "Invalid webhook signature" });
    return;
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const notes = payment.notes || {};

    // Only acts if verify-payment hasn't already activated this order —
    // activateProInDB is a merge-set, so a duplicate call is harmless,
    // it just re-writes the same expiry window.
    if (notes.uid && notes.plan) {
      try {
        await activateProInDB(notes.uid, {
          plan: notes.plan,
          amountPaidRupees: Math.round((payment.amount || 0) / 100),
          couponCode: notes.couponCode || null,
          orderId: payment.order_id,
          paymentId: payment.id,
          displayName: "",
          email: payment.email || "",
        });
      } catch (e) {
        console.error("[razorpay-webhook] activation failed:", e.message);
      }
    }
  }

  res.status(200).json({ received: true });
};

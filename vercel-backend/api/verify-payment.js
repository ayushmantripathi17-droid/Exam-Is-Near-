// api/verify-payment.js — ported from exports.verifyPayment in functions/index.js
// Env vars: RZP_KEY_ID, RZP_KEY_SECRET, FIREBASE_SERVICE_ACCOUNT, ALLOWED_ORIGINS

const { handleCORS } = require("./_lib/cors");
const { verifyToken } = require("./_lib/auth");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { PLAN_PRICE, validateCoupon, computeFinalAmount, activateProInDB, consumeCoupon, getUserMeta } = require("./_lib/billing");

module.exports = async (req, res) => {
  if (handleCORS(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method not allowed" } });
    return;
  }

  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const body = req.body && req.body.data ? req.body.data : req.body || {};
  const { orderId, paymentId, signature, plan, couponCode } = body;

  if (!orderId || !paymentId || !signature || !plan) {
    res.status(400).json({ error: { message: "Missing fields: orderId, paymentId, signature, plan" } });
    return;
  }

  const expectedSig = crypto
    .createHmac("sha256", process.env.RZP_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  if (expectedSig !== signature) {
    res.status(400).json({ error: { message: "Payment signature verification failed." } });
    return;
  }

  // Never trust client-sent amount — fetch ground truth from Razorpay.
  let amountPaidPaise = PLAN_PRICE[plan] || PLAN_PRICE.monthly;
  try {
    const rzp = new Razorpay({ key_id: process.env.RZP_KEY_ID, key_secret: process.env.RZP_KEY_SECRET });
    const payment = await rzp.payments.fetch(paymentId);
    if (payment && typeof payment.amount === "number") {
      amountPaidPaise = payment.amount;
    }
  } catch (e) {
    console.warn("[verifyPayment] Could not fetch Razorpay payment, using coupon fallback:", e.message);
    if (couponCode) {
      try {
        const cr = await validateCoupon(couponCode, plan);
        amountPaidPaise = computeFinalAmount(PLAN_PRICE[plan], cr);
      } catch (_) {
        /* use default */
      }
    }
  }

  const { displayName, email } = await getUserMeta(decoded.uid, decoded.email);

  try {
    const expiresAt = await activateProInDB(decoded.uid, {
      plan,
      amountPaidRupees: Math.round(amountPaidPaise / 100),
      couponCode: couponCode || null,
      orderId,
      paymentId,
      displayName,
      email,
    });

    if (couponCode) {
      try {
        const cr = await validateCoupon(couponCode, plan);
        await consumeCoupon(cr.couponRef, decoded.uid, plan, cr.adminOnly);
      } catch (e) {
        console.warn("[verifyPayment] Coupon consume skipped:", e.message);
      }
    }

    res.status(200).json({ result: { success: true, isPro: true, plan, expiresAt } });
  } catch (e) {
    res.status(500).json({ error: { message: "DB write failed: " + e.message } });
  }
};

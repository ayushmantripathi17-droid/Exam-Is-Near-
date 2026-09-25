// api/create-order.js — ported from exports.createOrder in functions/index.js
// Env vars: RZP_KEY_ID, RZP_KEY_SECRET, FIREBASE_SERVICE_ACCOUNT, ALLOWED_ORIGINS

const { handleCORS } = require("./_lib/cors");
const { verifyToken } = require("./_lib/auth");
const Razorpay = require("razorpay");
const {
  PLAN_PRICE,
  validateCoupon,
  computeFinalAmount,
  activateProInDB,
  consumeCoupon,
  getUserMeta,
  rzpErrMsg,
} = require("./_lib/billing");

module.exports = async (req, res) => {
  if (handleCORS(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method not allowed" } });
    return;
  }

  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const body = req.body && req.body.data ? req.body.data : req.body || {};
  const { plan, couponCode } = body;

  if (!plan || !["monthly", "annual"].includes(plan)) {
    res.status(400).json({ error: { message: `Invalid plan '${plan}'. Must be monthly or annual.` } });
    return;
  }

  const basePaise = PLAN_PRICE[plan];
  let finalPaise = basePaise;
  let couponResult = null;

  if (couponCode) {
    try {
      couponResult = await validateCoupon(couponCode, plan);
      finalPaise = computeFinalAmount(basePaise, couponResult);
    } catch (e) {
      res.status(400).json({ error: { message: e.message } });
      return;
    }
  }

  // 100% off / free coupon: activate Pro directly, skip Razorpay
  if (finalPaise === 0) {
    const { displayName, email } = await getUserMeta(decoded.uid, decoded.email);
    try {
      const expiresAt = await activateProInDB(decoded.uid, {
        plan,
        amountPaidRupees: 0,
        couponCode: couponCode || null,
        orderId: null,
        paymentId: null,
        displayName,
        email,
      });
      if (couponResult) await consumeCoupon(couponResult.couponRef, decoded.uid, plan, couponResult.adminOnly);
      res.status(200).json({
        result: {
          zeroCost: true,
          isPro: true,
          plan,
          expiresAt,
          couponApplied: true,
          discount: couponResult?.discountValue,
        },
      });
    } catch (e) {
      res.status(500).json({ error: { message: "Free activation failed: " + e.message } });
    }
    return;
  }

  const keyId = process.env.RZP_KEY_ID;
  const keySecret = process.env.RZP_KEY_SECRET;
  if (!keyId || !keySecret) {
    res.status(500).json({ error: { message: "Payment gateway not configured. Contact support." } });
    return;
  }

  try {
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
      amount: finalPaise,
      currency: "INR",
      receipt: `ein_${plan}_${Date.now()}`,
      notes: {
        uid: decoded.uid,
        plan,
        app: "exam-is-near",
        couponCode: couponCode || "",
        discountType: couponResult?.discountType || "",
        discountValue: String(couponResult?.discountValue || 0),
      },
    });
    res.status(200).json({
      result: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        couponApplied: !!couponCode,
        discountType: couponResult?.discountType || null,
        discountValue: couponResult?.discountValue || 0,
      },
    });
  } catch (e) {
    res.status(502).json({ error: { message: "Razorpay error: " + rzpErrMsg(e) } });
  }
};

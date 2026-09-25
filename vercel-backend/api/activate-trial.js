// api/activate-trial.js — ported from exports.activateTrial
const { handleCORS } = require("./_lib/cors");
const { verifyToken } = require("./_lib/auth");
const { db, PLAN_DURATION_MS, validateCoupon, consumeCoupon, getUserMeta } = require("./_lib/billing");

module.exports = async (req, res) => {
  if (handleCORS(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method not allowed" } });
    return;
  }

  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const body = req.body && req.body.data ? req.body.data : req.body || {};
  const { couponCode, plan, validateOnly } = body;
  const isCouponGrant = !!couponCode;

  // MODE: validateOnly — dry-run coupon check, no writes
  if (validateOnly === true) {
    if (!couponCode) {
      res.status(400).json({ result: { success: false, message: "No coupon code provided." } });
      return;
    }
    try {
      const proSnap = await db.collection("proUsers").doc(decoded.uid).get();
      if (proSnap.exists) {
        const d = proSnap.data();
        if (d.isPro === true && d.expiresAt > Date.now()) {
          res.status(200).json({
            result: { success: false, alreadyPro: true, message: "You already have an active Pro subscription." },
          });
          return;
        }
      }
    } catch (_) {
      /* non-fatal */
    }

    try {
      const couponResult = await validateCoupon(couponCode, plan || "monthly");
      res.status(200).json({
        result: {
          success: true,
          validateOnly: true,
          discount: couponResult.discountValue,
          discountType: couponResult.discountType,
          isFree: couponResult.isFree,
          couponId: couponResult.couponId,
          plan: plan || "monthly",
        },
      });
    } catch (e) {
      res.status(200).json({ result: { success: false, message: e.message } });
    }
    return;
  }

  // MODE: real activation
  try {
    const ref = db.collection("proUsers").doc(decoded.uid);
    const snap = await ref.get();
    const data = snap.exists ? snap.data() : {};
    const now = Date.now();

    if (data.isPro === true && data.expiresAt > now) {
      res.status(200).json({ result: { success: false, message: "You already have an active Pro subscription." } });
      return;
    }

    if (!isCouponGrant && data.trialUsed === true) {
      res.status(200).json({ result: { success: false, message: "Free trial already used on this account." } });
      return;
    }

    let couponResult = null;
    let grantedPlan;

    if (isCouponGrant) {
      try {
        couponResult = await validateCoupon(couponCode, plan);
      } catch (e) {
        res.status(400).json({ error: { message: e.message } });
        return;
      }
      if (!couponResult.isFree) {
        res.status(400).json({ error: { message: "This coupon is not 100% off. Payment required." } });
        return;
      }
      grantedPlan = ["monthly", "annual"].includes(plan) ? plan : "monthly";
    } else {
      grantedPlan = "trial";
    }

    const { displayName, email } = await getUserMeta(decoded.uid, decoded.email);
    const expiresAt =
      grantedPlan === "trial" ? now + 7 * 24 * 60 * 60 * 1000 : now + (PLAN_DURATION_MS[grantedPlan] || PLAN_DURATION_MS.monthly);

    await ref.set(
      {
        isPro: true,
        plan: grantedPlan,
        planType: grantedPlan,
        trialUsed: !isCouponGrant ? true : data.trialUsed || false,
        couponCode: couponCode || null,
        displayName,
        email,
        amountPaid: 0,
        orderId: null,
        paymentId: null,
        activatedAt: now,
        expiresAt,
        updatedAt: now,
      },
      { merge: true }
    );

    if (couponResult) await consumeCoupon(couponResult.couponRef, decoded.uid, grantedPlan, couponResult.adminOnly);

    res.status(200).json({ result: { success: true, isPro: true, plan: grantedPlan, planType: grantedPlan, expiresAt } });
  } catch (e) {
    res.status(500).json({ error: { message: "Activation failed: " + e.message } });
  }
};

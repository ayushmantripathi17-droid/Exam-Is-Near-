// api/_lib/billing.js
// Ported as-is from functions/index.js: plan pricing, coupon validation
// (percent/flat/expiry/usage-limit/plan-restriction/adminOnly), and the
// single activateProInDB() writer shared by the free-coupon path and the
// paid-payment path so proUsers/{uid} stays consistent either way.

const admin = require("./firebaseAdmin");
const db = admin.firestore();

const PLAN_PRICE = { monthly: 14900, annual: 99900 }; // paise
const PLAN_DURATION_MS = {
  monthly: 32 * 24 * 60 * 60 * 1000,
  annual: 366 * 24 * 60 * 60 * 1000,
};

async function getUserMeta(uid, fallbackEmail) {
  try {
    const rec = await admin.auth().getUser(uid);
    return { displayName: rec.displayName || "", email: rec.email || fallbackEmail || "" };
  } catch (e) {
    return { displayName: "", email: fallbackEmail || "" };
  }
}

// Coupon Firestore fields expected (collection "coupons"):
//   code, active, discount, discountType ("percent"|"flat"), discountValue,
//   expiry ("YYYY-MM-DD"), usesLeft, allowedPlans[], adminOnly
async function validateCoupon(code, requestedPlan) {
  if (!code || typeof code !== "string") throw new Error("No coupon code provided.");
  const clean = code.trim().toUpperCase();

  const snap = await db.collection("coupons").where("code", "==", clean).get();
  if (snap.empty) throw new Error("Invalid coupon code.");

  const activeDocs = snap.docs.filter((d) => d.data().active === true);
  if (!activeDocs.length) throw new Error("This coupon is inactive or has expired.");

  const doc = activeDocs[0];
  const data = doc.data();

  if (data.expiry) {
    const exp = new Date(data.expiry);
    exp.setHours(23, 59, 59, 999);
    if (Date.now() > exp.getTime()) throw new Error("This coupon has expired.");
  }

  if (data.adminOnly !== true) {
    if (typeof data.usesLeft === "number" && data.usesLeft <= 0)
      throw new Error("This coupon has reached its usage limit.");
  }

  if (Array.isArray(data.allowedPlans) && data.allowedPlans.length > 0) {
    if (requestedPlan && !data.allowedPlans.includes(requestedPlan))
      throw new Error(`This coupon is only valid for: ${data.allowedPlans.join(", ")} plan.`);
  }

  const discountType = data.discountType === "flat" ? "flat" : "percent";
  const discountValue =
    typeof data.discountValue === "number"
      ? data.discountValue
      : typeof data.discount === "number"
      ? data.discount
      : 0;

  return {
    discountType,
    discountValue,
    isFree: discountType === "percent" && discountValue >= 100,
    adminOnly: data.adminOnly === true,
    couponId: doc.id,
    couponRef: doc.ref,
    allowedPlans: data.allowedPlans || null,
  };
}

function computeFinalAmount(basePaise, couponResult) {
  if (!couponResult) return basePaise;
  if (couponResult.discountType === "flat") {
    return Math.max(0, basePaise - couponResult.discountValue * 100);
  }
  return Math.max(0, Math.round(basePaise * (1 - couponResult.discountValue / 100)));
}

async function consumeCoupon(couponRef, uid, plan, adminOnly = false) {
  if (adminOnly) return;
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(couponRef);
      if (!snap.exists) return;
      const data = snap.data();
      const newLeft = typeof data.usesLeft === "number" ? Math.max(0, data.usesLeft - 1) : null;
      const update = { lastUsedBy: uid, lastUsedAt: Date.now(), lastUsedPlan: plan };
      if (newLeft !== null) {
        update.usesLeft = newLeft;
        update.active = newLeft > 0;
      }
      tx.update(couponRef, update);
    });
  } catch (e) {
    console.warn("[consumeCoupon] Failed to decrement usesLeft:", e.message);
  }
}

async function activateProInDB(uid, { plan, amountPaidRupees, couponCode, orderId, paymentId, displayName, email }) {
  const now = Date.now();
  const expiresAt = now + (PLAN_DURATION_MS[plan] || PLAN_DURATION_MS.monthly);
  await db.collection("proUsers").doc(uid).set(
    {
      isPro: true,
      plan,
      planType: plan,
      amountPaid: amountPaidRupees,
      couponCode: couponCode || null,
      orderId: orderId || null,
      paymentId: paymentId || null,
      displayName: displayName || "",
      email: email || "",
      activatedAt: now,
      expiresAt,
      updatedAt: now,
    },
    { merge: true }
  );
  return expiresAt;
}

function rzpErrMsg(e) {
  if (e && e.error) {
    const inner = e.error;
    return inner.description || inner.reason || inner.field || JSON.stringify(inner);
  }
  return e.message || String(e);
}

module.exports = {
  db,
  PLAN_PRICE,
  PLAN_DURATION_MS,
  getUserMeta,
  validateCoupon,
  computeFinalAmount,
  consumeCoupon,
  activateProInDB,
  rzpErrMsg,
};

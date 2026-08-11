/**
 * Exam Is Near — Firebase Cloud Functions (Gen 2)
 *
 * Coupon system — all scenarios handled:
 *   - 100% off coupon  → skip Razorpay, activate Pro directly at ₹0
 *   - Partial % off    → create discounted Razorpay order; store actual amount paid
 *   - Flat ₹ off       → supported via coupon.discountType = "flat", coupon.discountValue
 *   - Expiry date      → rejected if past expiry
 *   - Usage limit      → rejected if usesLeft = 0
 *   - Plan restriction → rejected if coupon.allowedPlans doesn't include requested plan
 *
 * Security:
 *   - groqProxy requires Firebase Auth token
 *   - Rate limiting on groqProxy per UID
 *   - Input sanitization on groqProxy messages
 *   - Model locked to allowlist
 */

const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin  = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const fetch  = require("node-fetch");
const { BigQuery } = require("@google-cloud/bigquery");

admin.initializeApp();
const db = admin.firestore();

const RZP_KEY_ID          = defineSecret("RZP_KEY_ID");
const RZP_KEY_SECRET      = defineSecret("RZP_KEY_SECRET");
const GROQ_API_KEY        = defineSecret("GROQ_API_KEY");
const GCP_BILLING_KEY     = defineSecret("GCP_BILLING_KEY");
// Optional — only required if you want live legal news headlines (see refreshLegalUpdates below).
// Get a free key at https://gnews.io or https://newsapi.org, then:
//   firebase functions:secrets:set NEWS_API_KEY
const NEWS_API_KEY        = defineSecret("NEWS_API_KEY");

const ALLOWED_ORIGINS = [
  "https://exam-is-near.web.app",
  "https://exam-is-near.firebaseapp.com",
  "http://localhost:5000",
  "http://localhost:3000",
];

// ── Plan prices in paise ──────────────────────────────────────────────────────
const PLAN_PRICE = { monthly: 14900, annual: 99900 }; // paise
const PLAN_DURATION_MS = {
  monthly: 32  * 24 * 60 * 60 * 1000,
  annual:  366 * 24 * 60 * 60 * 1000,
};

// ── Groq rate limiter (in-memory, resets on instance restart) ─────────────────
const _groqRateLimiter = new Map();
const GROQ_RATE_LIMIT  = 60;
const GROQ_RATE_WINDOW = 60 * 1000;

function checkGroqRateLimit(uid) {
  const now   = Date.now();
  const entry = _groqRateLimiter.get(uid) || { count: 0, windowStart: now };
  if (now - entry.windowStart > GROQ_RATE_WINDOW) {
    _groqRateLimiter.set(uid, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= GROQ_RATE_LIMIT) return false;
  entry.count++;
  _groqRateLimiter.set(uid, entry);
  return true;
}

// ── CORS ──────────────────────────────────────────────────────────────────────
function handleCORS(req, res) {
  const origin = req.headers.origin || "";
  const allow  = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.set("Access-Control-Allow-Origin",  allow);
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");
  if (req.method === "OPTIONS") { res.status(204).send(""); return true; }
  return false;
}

// ── Auth token verification ───────────────────────────────────────────────────
async function verifyToken(req, res) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: { message: "Missing Authorization header" } });
    return null;
  }
  try {
    return await admin.auth().verifyIdToken(authHeader.slice(7));
  } catch (e) {
    res.status(401).json({ error: { message: "Invalid or expired token: " + e.message } });
    return null;
  }
}

function rzpErrMsg(e) {
  if (e && e.error) {
    const inner = e.error;
    return inner.description || inner.reason || inner.field || JSON.stringify(inner);
  }
  return e.message || String(e);
}

// ── getUserMeta: fetch displayName + email from Firebase Auth ─────────────────
async function getUserMeta(uid, fallbackEmail) {
  try {
    const rec = await admin.auth().getUser(uid);
    return { displayName: rec.displayName || "", email: rec.email || fallbackEmail || "" };
  } catch(e) {
    return { displayName: "", email: fallbackEmail || "" };
  }
}

// ── validateCoupon ────────────────────────────────────────────────────────────
// Returns:
//   {
//     discountType:  "percent" | "flat",   // "percent" = % off; "flat" = fixed ₹ off
//     discountValue: number,               // percent: 0-100 | flat: amount in ₹
//     isFree:        boolean,              // true when final price is ₹0
//     couponId:      string,
//     couponRef:     DocumentReference,
//     allowedPlans:  string[] | null,      // null = all plans allowed
//   }
//
// Coupon Firestore fields expected:
//   code         string   — uppercase coupon code
//   active       boolean  — must be true
//   discount     number   — percent off (legacy field, e.g. 100 = 100%)
//   discountType string?  — "percent" (default) or "flat"
//   discountValue number? — if discountType="flat", flat ₹ deduction; else use `discount`
//   expiry       string?  — ISO date string "YYYY-MM-DD"
//   usesLeft     number?  — remaining uses (omit for unlimited)
//   allowedPlans string[]?— e.g. ["annual"] to restrict to annual only
//
async function validateCoupon(code, requestedPlan) {
  if (!code || typeof code !== "string") throw new Error("No coupon code provided.");
  const clean = code.trim().toUpperCase();

  const snap = await db.collection("coupons").where("code", "==", clean).get();
  if (snap.empty) throw new Error("Invalid coupon code.");

  const activeDocs = snap.docs.filter(d => d.data().active === true);
  if (!activeDocs.length) throw new Error("This coupon is inactive or has expired.");

  const doc  = activeDocs[0];
  const data = doc.data();

  // Expiry check
  if (data.expiry) {
    const exp = new Date(data.expiry);
    exp.setHours(23, 59, 59, 999);
    if (Date.now() > exp.getTime()) throw new Error("This coupon has expired.");
  }

  // Usage limit check (adminOnly coupons are exempt — they work forever)
  if (data.adminOnly !== true) {
    if (typeof data.usesLeft === "number" && data.usesLeft <= 0)
      throw new Error("This coupon has reached its usage limit.");
  }

  // Plan restriction check
  if (Array.isArray(data.allowedPlans) && data.allowedPlans.length > 0) {
    if (requestedPlan && !data.allowedPlans.includes(requestedPlan))
      throw new Error(`This coupon is only valid for: ${data.allowedPlans.join(", ")} plan.`);
  }

  // Resolve discount type and value
  const discountType  = data.discountType === "flat" ? "flat" : "percent";
  const discountValue = typeof data.discountValue === "number"
    ? data.discountValue
    : (typeof data.discount === "number" ? data.discount : 0);

  return {
    discountType,
    discountValue,
    isFree:      discountType === "percent" && discountValue >= 100,
    adminOnly:   data.adminOnly === true,   // if true, usesLeft is never decremented
    couponId:    doc.id,
    couponRef:   doc.ref,
    allowedPlans: data.allowedPlans || null,
  };
}

// ── computeFinalAmount ────────────────────────────────────────────────────────
// Returns final amount in paise after applying coupon. Minimum 0.
function computeFinalAmount(basePaise, couponResult) {
  if (!couponResult) return basePaise;
  if (couponResult.discountType === "flat") {
    // Flat ₹ off — convert to paise
    return Math.max(0, basePaise - couponResult.discountValue * 100);
  }
  // Percent off
  return Math.max(0, Math.round(basePaise * (1 - couponResult.discountValue / 100)));
}

// ── consumeCoupon ─────────────────────────────────────────────────────────────
// adminOnly coupons are never consumed — they work unlimited times for the admin.
async function consumeCoupon(couponRef, uid, plan, adminOnly = false) {
  if (adminOnly) {
    console.log(`[consumeCoupon] Skipping consumption — adminOnly coupon used by uid=${uid}`);
    return;
  }
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(couponRef);
      if (!snap.exists) return;
      const data    = snap.data();
      const newLeft = typeof data.usesLeft === "number" ? Math.max(0, data.usesLeft - 1) : null;
      const update  = {
        lastUsedBy:   uid,
        lastUsedAt:   Date.now(),
        lastUsedPlan: plan,
      };
      if (newLeft !== null) {
        update.usesLeft = newLeft;
        update.active   = newLeft > 0;
      }
      tx.update(couponRef, update);
    });
  } catch (e) {
    console.warn("[consumeCoupon] Failed to decrement usesLeft:", e.message);
  }
}

// ── activateProInDB ───────────────────────────────────────────────────────────
// Single function that writes Pro status — used by both createOrder (free)
// and verifyPayment (paid), so the Firestore document is always consistent.
async function activateProInDB(uid, {
  plan, amountPaidRupees, couponCode,
  orderId, paymentId, displayName, email,
}) {
  const now       = Date.now();
  const expiresAt = now + (PLAN_DURATION_MS[plan] || PLAN_DURATION_MS.monthly);
  await db.collection("proUsers").doc(uid).set(
    {
      isPro:       true,
      plan,
      planType:    plan,   // FIX: client reads result.planType from checkProStatus;
                           // admin panel reads pro.plan — write both to stay consistent
      amountPaid:  amountPaidRupees,   // ₹ (not paise), 0 for free coupons
      couponCode:  couponCode || null,
      orderId:     orderId    || null,
      paymentId:   paymentId  || null,
      displayName: displayName || "",
      email:       email || "",
      activatedAt: now,
      expiresAt,
      updatedAt:   now,
    },
    { merge: true }
  );
  return expiresAt;
}

// ══════════════════════════════════════════════════════════════════════════════
// createOrder
// ══════════════════════════════════════════════════════════════════════════════
exports.createOrder = onRequest(
  { secrets: [RZP_KEY_ID, RZP_KEY_SECRET], region: "asia-south1", cors: false },
  async (req, res) => {
    if (handleCORS(req, res)) return;
    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    const body = (req.body && req.body.data) ? req.body.data : (req.body || {});
    const { plan, couponCode } = body;

    if (!plan || !["monthly", "annual"].includes(plan))
      return res.status(400).json({ error: { message: `Invalid plan '${plan}'. Must be monthly or annual.` } });

    const basePaise = PLAN_PRICE[plan];
    let finalPaise  = basePaise;
    let couponResult = null;

    // ── Validate coupon if provided ──
    if (couponCode) {
      try {
        couponResult = await validateCoupon(couponCode, plan);
        finalPaise   = computeFinalAmount(basePaise, couponResult);
        console.log(`[createOrder] Coupon '${couponCode}' (${couponResult.discountType} ${couponResult.discountValue}${couponResult.discountType==="flat"?"₹":"%"}) → ₹${finalPaise/100}`);
      } catch (e) {
        return res.status(400).json({ error: { message: e.message } });
      }
    }

    // ── 100% off / free coupon: activate Pro directly, skip Razorpay ──
    if (finalPaise === 0) {
      const { displayName, email } = await getUserMeta(decoded.uid, decoded.email);
      try {
        const expiresAt = await activateProInDB(decoded.uid, {
          plan, amountPaidRupees: 0,
          couponCode: couponCode || null,
          orderId: null, paymentId: null,
          displayName, email,
        });
        if (couponResult) await consumeCoupon(couponResult.couponRef, decoded.uid, plan, couponResult.adminOnly);
        console.log(`[createOrder] FREE activation uid=${decoded.uid} plan=${plan} coupon=${couponCode}`);
        return res.status(200).json({ result: { zeroCost: true, isPro: true, plan, expiresAt, couponApplied: true, discount: couponResult?.discountValue } });
      } catch (e) {
        return res.status(500).json({ error: { message: "Free activation failed: " + e.message } });
      }
    }

    // ── Paid order: create Razorpay order ──
    const keyId     = RZP_KEY_ID.value();
    const keySecret = RZP_KEY_SECRET.value();
    if (!keyId || !keySecret) {
      console.error("[createOrder] RZP secrets are empty!");
      return res.status(500).json({ error: { message: "Payment gateway not configured. Contact support." } });
    }

    try {
      const rzp   = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const order = await rzp.orders.create({
        amount:   finalPaise,
        currency: "INR",
        receipt:  `ein_${plan}_${Date.now()}`,
        notes: {
          uid:        decoded.uid,
          plan,
          app:        "exam-is-near",
          couponCode: couponCode || "",
          discountType:  couponResult?.discountType  || "",
          discountValue: String(couponResult?.discountValue || 0),
        },
      });
      console.log(`[createOrder] OK uid=${decoded.uid} plan=${plan} orderId=${order.id} amount=₹${finalPaise/100}`);
      return res.status(200).json({
        result: {
          orderId:      order.id,
          amount:       order.amount,
          currency:     order.currency,
          keyId,
          couponApplied: !!couponCode,
          discountType:  couponResult?.discountType  || null,
          discountValue: couponResult?.discountValue || 0,
        }
      });
    } catch (e) {
      const msg = rzpErrMsg(e);
      console.error("[createOrder] Razorpay error:", msg);
      return res.status(502).json({ error: { message: "Razorpay error: " + msg } });
    }
  }
);

// ══════════════════════════════════════════════════════════════════════════════
// verifyPayment
// ══════════════════════════════════════════════════════════════════════════════
exports.verifyPayment = onRequest(
  { secrets: [RZP_KEY_ID, RZP_KEY_SECRET], region: "asia-south1", cors: false },
  async (req, res) => {
    if (handleCORS(req, res)) return;
    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    const body = (req.body && req.body.data) ? req.body.data : (req.body || {});
    const { orderId, paymentId, signature, plan, couponCode } = body;

    if (!orderId || !paymentId || !signature || !plan)
      return res.status(400).json({ error: { message: "Missing fields: orderId, paymentId, signature, plan" } });

    // ── Signature verification ──
    const expectedSig = crypto
      .createHmac("sha256", RZP_KEY_SECRET.value())
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    if (expectedSig !== signature)
      return res.status(400).json({ error: { message: "Payment signature verification failed." } });

    // ── Fetch actual amount charged from Razorpay (ground truth) ──
    // Never trust client-sent amount. Fetch from Razorpay API directly.
    let amountPaidPaise = PLAN_PRICE[plan] || PLAN_PRICE.monthly; // safe fallback
    try {
      const rzp     = new Razorpay({ key_id: RZP_KEY_ID.value(), key_secret: RZP_KEY_SECRET.value() });
      const payment = await rzp.payments.fetch(paymentId);
      if (payment && typeof payment.amount === "number") {
        amountPaidPaise = payment.amount;
        console.log(`[verifyPayment] Razorpay amount: ₹${amountPaidPaise/100} for ${paymentId}`);
      }
    } catch (e) {
      console.warn("[verifyPayment] Could not fetch Razorpay payment, using coupon fallback:", e.message);
      // Fallback: compute from coupon discount if payment fetch fails
      if (couponCode) {
        try {
          const cr = await validateCoupon(couponCode, plan);
          amountPaidPaise = computeFinalAmount(PLAN_PRICE[plan], cr);
        } catch(e2) { /* use default */ }
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

      // Consume coupon after successful payment
      if (couponCode) {
        try {
          const cr = await validateCoupon(couponCode, plan);
          await consumeCoupon(cr.couponRef, decoded.uid, plan, cr.adminOnly);
        } catch (e) {
          console.warn("[verifyPayment] Coupon consume skipped:", e.message);
        }
      }

      console.log(`[verifyPayment] OK uid=${decoded.uid} plan=${plan} paid=₹${amountPaidPaise/100}`);
      return res.status(200).json({ result: { success: true, isPro: true, plan, expiresAt } });
    } catch (e) {
      return res.status(500).json({ error: { message: "DB write failed: " + e.message } });
    }
  }
);

// ══════════════════════════════════════════════════════════════════════════════
// checkProStatus
// ══════════════════════════════════════════════════════════════════════════════
exports.checkProStatus = onRequest(
  { region: "asia-south1", cors: false },
  async (req, res) => {
    if (handleCORS(req, res)) return;
    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    try {
      const snap = await db.collection("proUsers").doc(decoded.uid).get();
      if (!snap.exists)
        return res.status(200).json({ result: { isPro: false, expiresAt: 0, plan: null } });

      const data  = snap.data();
      const now   = Date.now();
      const isPro = data.isPro === true && typeof data.expiresAt === "number" && data.expiresAt > now;

      if (data.isPro === true && data.expiresAt <= now)
        await db.collection("proUsers").doc(decoded.uid).update({ isPro: false });

      return res.status(200).json({
        result: {
          isPro,
          expiresAt: data.expiresAt || 0,
          // FIX: client (isProUser in index.html) reads result.planType to populate
          // _proCache.planType. Previously only 'plan' was returned, so planType was
          // always undefined → admin-granted Pro showed "Go Pro" badge instead of "PRO MEMBER".
          planType: isPro ? (data.planType || data.plan || "monthly") : null,
          plan:     isPro ? (data.plan     || data.planType || "monthly") : null,
        }
      });
    } catch (e) {
      return res.status(500).json({ error: { message: "Status check failed: " + e.message } });
    }
  }
);

exports.activateTrial = onRequest(
  { region: "asia-south1", cors: false },
  async (req, res) => {
    if (handleCORS(req, res)) return;
    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    const body = (req.body && req.body.data) ? req.body.data : (req.body || {});
    const { couponCode, plan, validateOnly } = body;
    const isCouponGrant = !!couponCode;

    // ══════════════════════════════════════════════════════════════════════════
    // MODE: validateOnly — dry-run coupon check, no Firestore writes
    // Called by applyCouponCode() in index.html for UX preview before payment
    // ══════════════════════════════════════════════════════════════════════════
    if (validateOnly === true) {
      if (!couponCode)
        return res.status(400).json({ result: { success: false, message: "No coupon code provided." } });

      // Tell the user if they're already Pro rather than letting it fail silently
      try {
        const proSnap = await db.collection("proUsers").doc(decoded.uid).get();
        if (proSnap.exists) {
          const d = proSnap.data();
          if (d.isPro === true && d.expiresAt > Date.now()) {
            return res.status(200).json({
              result: {
                success:    false,
                alreadyPro: true,
                message:    "You already have an active Pro subscription.",
              }
            });
          }
        }
      } catch (_) { /* non-fatal */ }

      // Validate coupon via Admin SDK (bypasses Firestore rules)
      try {
        const couponResult = await validateCoupon(couponCode, plan || "monthly");
        // Return discount info — nothing is written
        return res.status(200).json({
          result: {
            success:      true,
            validateOnly: true,
            discount:     couponResult.discountValue,
            discountType: couponResult.discountType,
            isFree:       couponResult.isFree,
            couponId:     couponResult.couponId,
            plan:         plan || "monthly",
          }
        });
      } catch (e) {
        return res.status(200).json({ result: { success: false, message: e.message } });
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // MODE: real activation (original flow)
    // ══════════════════════════════════════════════════════════════════════════
    try {
      const ref  = db.collection("proUsers").doc(decoded.uid);
      const snap = await ref.get();
      const data = snap.exists ? snap.data() : {};
      const now  = Date.now();

      if (data.isPro === true && data.expiresAt > now)
        return res.status(200).json({ result: { success: false, message: "You already have an active Pro subscription." } });

      if (!isCouponGrant && data.trialUsed === true)
        return res.status(200).json({ result: { success: false, message: "Free trial already used on this account." } });

      let couponResult = null;
      let grantedPlan;

      if (isCouponGrant) {
        try {
          couponResult = await validateCoupon(couponCode, plan);
        } catch (e) {
          return res.status(400).json({ error: { message: e.message } });
        }
        if (!couponResult.isFree)
          return res.status(400).json({ error: { message: "This coupon is not 100% off. Payment required." } });
        grantedPlan = ["monthly", "annual"].includes(plan) ? plan : "monthly";
      } else {
        grantedPlan = "trial";
      }

      const { displayName, email } = await getUserMeta(decoded.uid, decoded.email);

      // Write Pro record
      const expiresAt = grantedPlan === "trial"
        ? now + 7 * 24 * 60 * 60 * 1000
        : now + (PLAN_DURATION_MS[grantedPlan] || PLAN_DURATION_MS.monthly);

      await ref.set(
        {
          isPro:       true,
          plan:        grantedPlan,
          planType:    grantedPlan,  // FIX: write planType so checkProStatus returns it correctly
          trialUsed:   !isCouponGrant ? true : (data.trialUsed || false),
          couponCode:  couponCode || null,
          displayName, email,
          amountPaid:  0,
          orderId:     null,
          paymentId:   null,
          activatedAt: now,
          expiresAt,
          updatedAt:   now,
        },
        { merge: true }
      );

      if (couponResult) await consumeCoupon(couponResult.couponRef, decoded.uid, grantedPlan, couponResult.adminOnly);

      console.log(`[activateTrial] uid=${decoded.uid} plan=${grantedPlan} coupon=${couponCode || "none"}`);
      return res.status(200).json({
        result: {
          success:  true,
          isPro:    true,
          plan:     grantedPlan,
          planType: grantedPlan,  // FIX: client reads result.planType
          expiresAt,
        }
      });
    } catch (e) {
      return res.status(500).json({ error: { message: "Activation failed: " + e.message } });
    }
  }
);

// ══════════════════════════════════════════════════════════════════════════════
// groqProxy — Secure AI proxy
// ══════════════════════════════════════════════════════════════════════════════
const ALLOWED_GROQ_MODELS = new Set([
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
]);

exports.groqProxy = onRequest(
  { secrets: [GROQ_API_KEY], region: "asia-south1", cors: false, timeoutSeconds: 60 },
  async (req, res) => {
    if (handleCORS(req, res)) return;
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    if (!checkGroqRateLimit(decoded.uid)) {
      console.warn(`[groqProxy] Rate limit hit uid=${decoded.uid}`);
      return res.status(429).json({ error: "Too many requests. Please slow down." });
    }

    const body = req.body || {};
    if (!Array.isArray(body.messages) || !body.messages.length)
      return res.status(400).json({ error: "Invalid request: messages array required" });

    const sanitizedMessages = body.messages
      .filter(m => m && typeof m.role === "string" && typeof m.content === "string")
      .map(m => ({
        role:    ["system", "user", "assistant"].includes(m.role) ? m.role : "user",
        content: String(m.content).slice(0, 16000),
      }));

    if (!sanitizedMessages.length)
      return res.status(400).json({ error: "No valid messages after sanitization" });

    const model = ALLOWED_GROQ_MODELS.has(body.model)
      ? body.model
      : "llama-3.3-70b-versatile";

    const maxTokens = Math.min(
      typeof body.max_tokens === "number" ? body.max_tokens : 800,
      6000
    );

    const key = GROQ_API_KEY.value();
    if (!key) {
      console.error("[groqProxy] GROQ_API_KEY secret is empty");
      return res.status(500).json({ error: "AI service not configured" });
    }

    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({
          model, max_tokens: maxTokens, messages: sanitizedMessages,
          temperature: typeof body.temperature === "number"
            ? Math.min(Math.max(body.temperature, 0), 1)
            : 0.7,
        }),
      });
      const data = await groqRes.json();
      if (!groqRes.ok) {
        console.warn("[groqProxy] Groq error:", groqRes.status, data?.error?.message);
        return res.status(groqRes.status).json({ error: data?.error?.message || "Groq error" });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.error("[groqProxy] Fetch error:", err.message);
      return res.status(500).json({ error: "Proxy network error" });
    }
  }
);
// ══════════════════════════════════════════════════════════════════════════════
// refreshLegalUpdates — Keeps /legal-updates/nfsu fresh for the NFSU AI tutor
//   • Bare-act notes: static list of the biggest recent codification changes
//     (IPC → BNS, CrPC → BNSS, Evidence Act → BSA) plus any hand-edited notes.
//   • News items: latest Indian legal-affairs headlines, if NEWS_API_KEY is set.
//     Without a key, the function still runs and just keeps bareActNotes fresh —
//     it never fails the whole doc write because news fetch failed.
// groq.js reads this doc directly (Firestore read is public per firestore.rules)
// and folds it into the system prompt for nfsu1 / nfsu3 students.
// ══════════════════════════════════════════════════════════════════════════════

// Hand-maintained — update this array whenever a major bare-act change happens.
// Keep entries short; groq.js truncates long context to protect token budget.
const BARE_ACT_NOTES = [
  "IPC 1860 has been replaced by the Bharatiya Nyaya Sanhita (BNS), 2023 — effective 1 July 2024. Map old IPC sections to new BNS sections when answering (e.g. murder: IPC 302 → BNS 103).",
  "CrPC 1973 has been replaced by the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 — effective 1 July 2024.",
  "Indian Evidence Act 1872 has been replaced by the Bharatiya Sakshya Adhiniyam (BSA), 2023 — effective 1 July 2024.",
  "For Sem III syllabus (Law of Crimes I), answer using IPC section numbers as the syllabus prescribes, but always add a one-line note on the corresponding BNS section so the student knows both.",
];

async function buildLegalNewsItems() {
  const key = NEWS_API_KEY.value();
  if (!key) return []; // no key configured — skip silently, bareActNotes still gets written
  try {
    const url = `https://gnews.io/api/v4/search?q=%22Indian%20law%22%20OR%20%22Supreme%20Court%22%20OR%20%22Bharatiya%20Nyaya%20Sanhita%22&lang=en&country=in&max=6&apikey=${key}`;
    const r = await fetch(url);
    if (!r.ok) return [];
    const data = await r.json();
    return (data.articles || []).slice(0, 6).map(a => ({
      title: String(a.title || "").slice(0, 160),
      source: a.source?.name || "",
      publishedAt: a.publishedAt || "",
      url: a.url || "",
    }));
  } catch (err) {
    console.warn("[refreshLegalUpdates] news fetch failed:", err.message);
    return [];
  }
}

async function runLegalUpdatesRefresh() {
  const newsItems = await buildLegalNewsItems();
  await db.collection("legal-updates").doc("nfsu").set({
    bareActNotes: BARE_ACT_NOTES,
    newsItems,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  return { bareActCount: BARE_ACT_NOTES.length, newsCount: newsItems.length };
}

// Runs automatically every day at 06:00 IST
exports.refreshLegalUpdatesScheduled = onSchedule(
  { schedule: "0 6 * * *", timeZone: "Asia/Kolkata", region: "asia-south1", secrets: [NEWS_API_KEY] },
  async () => { await runLegalUpdatesRefresh(); }
);

// Manual trigger — call from the admin panel for an on-demand refresh
exports.refreshLegalUpdates = onCall(
  { region: "asia-south1", secrets: [NEWS_API_KEY] },
  async (req) => {
    if (!req.auth || req.auth.token.email !== "ayushmantripathi17@gmail.com") {
      throw new HttpsError("permission-denied", "Admin only");
    }
    return await runLegalUpdatesRefresh();
  }
);

// ══════════════════════════════════════════════════════════════════════════════
// fetchRazorpayFees — Auto-fetch this month's Razorpay gateway fees
// ══════════════════════════════════════════════════════════════════════════════
const RZP_LIVE_KEY_ID = "rzp_live_Sxwd6qLBExpLGL";
const ADMIN_EMAIL     = "ayushmantripathi17@gmail.com";

exports.fetchRazorpayFees = onCall(
  { secrets: [RZP_KEY_ID, RZP_KEY_SECRET], region: "asia-south1" },
  async (request) => {
    if (!request.auth || request.auth.token.email !== ADMIN_EMAIL)
      throw new HttpsError("permission-denied", "Admins only.");

    const secret      = RZP_KEY_SECRET.value();
    const credentials = Buffer.from(`${RZP_LIVE_KEY_ID}:${secret}`).toString("base64");

    const now  = new Date();
    const from = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);
    const to   = Math.floor(now.getTime() / 1000);

    const [settleRes, payRes] = await Promise.all([
      fetch(`https://api.razorpay.com/v1/settlements?from=${from}&to=${to}&count=100`,
        { headers: { Authorization: `Basic ${credentials}` } }),
      fetch(`https://api.razorpay.com/v1/payments?from=${from}&to=${to}&count=100`,
        { headers: { Authorization: `Basic ${credentials}` } }),
    ]);

    if (!settleRes.ok) {
      const errText = await settleRes.text();
      throw new HttpsError("internal", `Razorpay settlements error ${settleRes.status}: ${errText}`);
    }
    if (!payRes.ok) {
      const errText = await payRes.text();
      throw new HttpsError("internal", `Razorpay payments error ${payRes.status}: ${errText}`);
    }

    const [settleData, payData] = await Promise.all([settleRes.json(), payRes.json()]);

    const captured      = (payData.items || []).filter(p => p.status === "captured");
    const totalCaptured = captured.reduce((s, p) => s + (p.amount || 0), 0) / 100;
    const totalFee      = captured.reduce((s, p) => s + (p.fee   || 0), 0) / 100;
    const totalTax      = captured.reduce((s, p) => s + (p.tax   || 0), 0) / 100;
    const settlements   = (settleData.items || []).length;
    const settled       = (settleData.items || []).reduce((s, i) => s + (i.amount || 0), 0) / 100;
    const month         = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    return { month, totalCaptured, totalFee, totalTax, settled, settlements, txCount: captured.length };
  }
);

// ══════════════════════════════════════════════════════════════════════════════
// fetchGCPBilling — Auto-fetch this month's GCP/Firebase costs from BigQuery
// ══════════════════════════════════════════════════════════════════════════════
const BQ_DATASET  = "gcp_billing_immutable_016BB7_F4A215_042924_asia_south1";
const BQ_PROJECT  = "exam-is-near";

exports.fetchGCPBilling = onCall(
  { secrets: [GCP_BILLING_KEY], region: "asia-south1" },
  async (request) => {
    if (!request.auth || request.auth.token.email !== ADMIN_EMAIL)
      throw new HttpsError("permission-denied", "Admins only.");

    let credentials;
    try { credentials = JSON.parse(GCP_BILLING_KEY.value()); }
    catch (e) { throw new HttpsError("internal", "Invalid GCP_BILLING_KEY format."); }

    const bq        = new BigQuery({ projectId: BQ_PROJECT, credentials });
    const now       = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const firstDay  = `${yearMonth}-01`;

    const query = `
      SELECT ServiceName, SUM(BilledCost) AS total_cost, CurrencyCode
      FROM \`${BQ_PROJECT}.${BQ_DATASET}.focus_v1_0\`
      WHERE DATE(ChargePeriodStart) >= '${firstDay}'
        AND DATE(ChargePeriodStart) < DATE_ADD('${firstDay}', INTERVAL 1 MONTH)
      GROUP BY ServiceName, CurrencyCode
      ORDER BY total_cost DESC
    `;

    try {
      const [rows]   = await bq.query({ query, location: "asia-south1" });
      const services = rows.map(r => ({
        service:  r.ServiceName || "Unknown",
        cost:     parseFloat(r.total_cost || 0),
        currency: r.CurrencyCode || "USD",
      }));
      const totalUSD = services.reduce((s, r) => s + r.cost, 0);
      const USD_TO_INR = 84;
      const totalINR   = Math.round(totalUSD * USD_TO_INR);
      return { month: yearMonth, services, totalUSD, totalINR, rate: USD_TO_INR };
    } catch (err) {
      throw new HttpsError("internal", "BigQuery error: " + err.message);
    }
  }
);

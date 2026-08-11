/**
 * Exam Is Near — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────
 * Replaces SEVEN Firebase Cloud Functions / GCP services with one Worker,
 * routed by path:
 *   (root / no path) → groqProxy       — AI Tutor chat
 *   /checkProStatus  → checkProStatus  — reads a user's Pro subscription
 *   /activateTrial   → activateTrial   — starts a free trial / applies a coupon
 *   /createOrder     → createOrder     — creates a Razorpay order (or free-coupon activates directly)
 *   /verifyPayment   → verifyPayment   — verifies a Razorpay signature server-side, grants Pro
 *   /uploadFile      → uploadFile      — uploads a file to R2 (auth required)
 *   /files/*         → serveFile       — serves a file back out of R2 (public GET, no auth —
 *                                        same trust model as a Firebase Storage download URL)
 *
 * Firestore/Auth themselves are NOT touched — this Worker just talks to
 * Firestore over its REST API (using a Google service-account token it
 * mints itself) instead of using the firebase-admin SDK, which doesn't run
 * on Workers' edge runtime. File storage uses an R2 bucket bound to this
 * Worker instead of Firebase Storage, so none of this requires the Firebase
 * project to be on the Blaze plan.
 *
 * SECRETS (set with `wrangler secret put <NAME>`, never written in this file):
 *   GROQ_API_KEY           — your Groq API key (already set)
 *   FIREBASE_CLIENT_EMAIL  — the "client_email" field from serviceAccountKey.json
 *   FIREBASE_PRIVATE_KEY   — the "private_key" field from serviceAccountKey.json,
 *                            pasted EXACTLY as it appears in the JSON file
 *                            (including the literal \n characters — don't
 *                            convert them to real line breaks yourself)
 *   RZP_KEY_ID             — Razorpay key_id (same one used previously in Cloud Functions)
 *   RZP_KEY_SECRET         — Razorpay key_secret (same one used previously in Cloud Functions)
 *
 * VARS (set in wrangler.toml, not secret):
 *   FIREBASE_PROJECT_ID — e.g. "exam-is-near"
 *
 * BINDINGS (set in wrangler.toml):
 *   FILES_BUCKET — R2 bucket binding for uploaded files
 */

import { jwtVerify, createRemoteJWKSet, SignJWT, importPKCS8 } from 'jose';

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const JWKS = createRemoteJWKSet(new URL(GOOGLE_JWKS_URL));

const ALLOWED_ORIGINS = [
  'https://exam-is-near.web.app',
  'https://exam-is-near.firebaseapp.com',
  'http://localhost:5000',
  'http://localhost:3000',
];

const PLAN_DURATION_MS = {
  monthly: 32 * 24 * 60 * 60 * 1000,
  annual: 366 * 24 * 60 * 60 * 1000,
};
const PLAN_PRICE = { monthly: 14900, annual: 99900 }; // paise — server is the only source of truth for this

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '3600',
  };
}

function jsonRes(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

// ── Firebase ID token verification (same as before) ────────────────────────
async function verifyFirebaseToken(token, projectId) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });
  if (!payload.sub) throw new Error('Token missing subject');
  return payload; // payload.sub === uid, payload.email
}

// ── Google service-account OAuth2 token, minted + cached in this isolate ──
let _cachedToken = null;
let _cachedTokenExpiry = 0;

async function getGoogleAccessToken(env) {
  const now = Date.now();
  if (_cachedToken && now < _cachedTokenExpiry - 60000) return _cachedToken;

  const privateKeyPem = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  const key = await importPKCS8(privateKeyPem, 'RS256');

  const nowSec = Math.floor(now / 1000);
  const jwt = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/identitytoolkit',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(env.FIREBASE_CLIENT_EMAIL)
    .setSubject(env.FIREBASE_CLIENT_EMAIL)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt(nowSec)
    .setExpirationTime(nowSec + 3600)
    .sign(key);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(jwt)}`,
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Failed to mint Google access token: ' + JSON.stringify(data));

  _cachedToken = data.access_token;
  _cachedTokenExpiry = now + data.expires_in * 1000;
  return _cachedToken;
}

// ── Firestore REST helpers ──────────────────────────────────────────────────
function fsValueToJs(v) {
  if (v == null) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return parseInt(v.integerValue, 10);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('mapValue' in v) return fsFieldsToObj(v.mapValue.fields || {});
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fsValueToJs);
  return null;
}
function fsFieldsToObj(fields) {
  const out = {};
  for (const k in fields) out[k] = fsValueToJs(fields[k]);
  return out;
}
function jsValueToFs(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(jsValueToFs) } };
  if (typeof v === 'object') return { mapValue: { fields: jsObjToFsFields(v) } };
  return { nullValue: null };
}
function jsObjToFsFields(obj) {
  const out = {};
  for (const k in obj) out[k] = jsValueToFs(obj[k]);
  return out;
}

function fsBaseUrl(projectId) {
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

async function fsGet(env, token, path) {
  const res = await fetch(`${fsBaseUrl(env.FIREBASE_PROJECT_ID)}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  const data = await res.json();
  if (!res.ok) throw new Error('Firestore get failed: ' + JSON.stringify(data));
  return fsFieldsToObj(data.fields || {});
}

// Merge-set: only touches the top-level fields passed in `obj`, like {merge:true}
async function fsSet(env, token, path, obj) {
  const fieldNames = Object.keys(obj);
  const maskParams = fieldNames.map(f => `updateMask.fieldPaths=${encodeURIComponent(f)}`).join('&');
  const res = await fetch(`${fsBaseUrl(env.FIREBASE_PROJECT_ID)}/${path}?${maskParams}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: jsObjToFsFields(obj) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Firestore set failed: ' + JSON.stringify(data));
  return data;
}

async function fsQueryWhereEqual(env, token, collectionId, field, value) {
  const res = await fetch(`${fsBaseUrl(env.FIREBASE_PROJECT_ID)}:runQuery`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId }],
        where: { fieldFilter: { field: { fieldPath: field }, op: 'EQUAL', value: jsValueToFs(value) } },
      },
    }),
  });
  const rows = await res.json();
  if (!res.ok) throw new Error('Firestore query failed: ' + JSON.stringify(rows));
  return (rows || [])
    .filter(r => r.document)
    .map(r => ({
      id: r.document.name.split('/').pop(),
      path: r.document.name.split('/documents/')[1],
      ...fsFieldsToObj(r.document.fields || {}),
    }));
}

async function getUserMeta(env, token, uid, fallbackEmail) {
  try {
    const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ localId: [uid] }),
    });
    const data = await res.json();
    const rec = data.users && data.users[0];
    return { displayName: rec?.displayName || '', email: rec?.email || fallbackEmail || '' };
  } catch {
    return { displayName: '', email: fallbackEmail || '' };
  }
}

async function validateCoupon(env, token, code, requestedPlan) {
  if (!code || typeof code !== 'string') throw new Error('No coupon code provided.');
  const clean = code.trim().toUpperCase();

  const matches = await fsQueryWhereEqual(env, token, 'coupons', 'code', clean);
  const activeDocs = matches.filter(d => d.active === true);
  if (!activeDocs.length) throw new Error('Invalid or inactive coupon code.');

  const data = activeDocs[0];

  if (data.expiry) {
    const exp = new Date(data.expiry);
    exp.setHours(23, 59, 59, 999);
    if (Date.now() > exp.getTime()) throw new Error('This coupon has expired.');
  }
  if (data.adminOnly !== true) {
    if (typeof data.usesLeft === 'number' && data.usesLeft <= 0)
      throw new Error('This coupon has reached its usage limit.');
  }
  if (Array.isArray(data.allowedPlans) && data.allowedPlans.length > 0) {
    if (requestedPlan && !data.allowedPlans.includes(requestedPlan))
      throw new Error(`This coupon is only valid for: ${data.allowedPlans.join(', ')} plan.`);
  }

  const discountType = data.discountType === 'flat' ? 'flat' : 'percent';
  const discountValue = typeof data.discountValue === 'number' ? data.discountValue : (typeof data.discount === 'number' ? data.discount : 0);

  return {
    discountType, discountValue,
    isFree: discountType === 'percent' && discountValue >= 100,
    adminOnly: data.adminOnly === true,
    couponPath: data.path,
    couponData: data,
  };
}

// Simple (non-transactional) consume — acceptable here since these are
// free/coupon activations, not payment amounts. Small theoretical race
// window on usesLeft under near-simultaneous use of the same limited coupon.
async function consumeCoupon(env, token, couponPath, currentData, uid, plan, adminOnly) {
  if (adminOnly) return;
  try {
    const newLeft = typeof currentData.usesLeft === 'number' ? Math.max(0, currentData.usesLeft - 1) : null;
    const update = { lastUsedBy: uid, lastUsedAt: Date.now(), lastUsedPlan: plan };
    if (newLeft !== null) { update.usesLeft = newLeft; update.active = newLeft > 0; }
    await fsSet(env, token, couponPath, update);
  } catch (e) {
    console.warn('[consumeCoupon] failed:', e.message);
  }
}

// Single function that writes Pro status — used by createOrder (free-coupon path)
// and verifyPayment (paid path), so the Firestore document is always consistent.
// Mirrors the original Cloud Function's activateProInDB exactly, field for field.
async function activateProInDB(env, token, uid, {
  plan, amountPaidRupees, couponCode, orderId, paymentId, displayName, email,
}) {
  const now = Date.now();
  const expiresAt = now + (PLAN_DURATION_MS[plan] || PLAN_DURATION_MS.monthly);
  await fsSet(env, token, `proUsers/${uid}`, {
    isPro: true,
    plan,
    planType: plan,
    amountPaid: amountPaidRupees,
    couponCode: couponCode || null,
    orderId: orderId || null,
    paymentId: paymentId || null,
    displayName: displayName || '',
    email: email || '',
    activatedAt: now,
    expiresAt,
    updatedAt: now,
  });
  return expiresAt;
}

// Final amount in paise after applying a coupon. Minimum 0. Mirrors the
// original Cloud Function's computeFinalAmount.
function computeFinalAmount(basePaise, couponResult) {
  if (!couponResult) return basePaise;
  if (couponResult.discountType === 'flat') return Math.max(0, basePaise - couponResult.discountValue * 100);
  return Math.max(0, Math.round(basePaise * (1 - couponResult.discountValue / 100)));
}

// ── Razorpay REST helpers (no SDK — Workers runtime can't run the Node SDK) ──
function razorpayAuthHeader(env) {
  return 'Basic ' + btoa(`${env.RZP_KEY_ID}:${env.RZP_KEY_SECRET}`);
}

async function razorpayCreateOrder(env, { amount, currency, receipt, notes }) {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: razorpayAuthHeader(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency, receipt, notes }),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.description || data?.error?.reason || JSON.stringify(data);
    throw new Error(msg);
  }
  return data;
}

async function razorpayFetchPayment(env, paymentId) {
  const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: razorpayAuthHeader(env) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.description || 'Could not fetch payment from Razorpay');
  return data;
}

// HMAC-SHA256 signature check via Web Crypto (Workers has no Node "crypto" module).
async function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(`${orderId}|${paymentId}`));
  const expectedHex = [...new Uint8Array(sigBuf)].map(b => b.toString(16).padStart(2, '0')).join('');
  // Constant-time-ish compare
  if (expectedHex.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expectedHex.length; i++) diff |= expectedHex.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

// ── Handlers ─────────────────────────────────────────────────────────────
async function handleGroqProxy(request, env, headers, uid) {
  let body;
  try { body = await request.json(); } catch { return jsonRes({ error: { message: 'Invalid JSON body' } }, 400, headers); }
  if (!env.GROQ_API_KEY) return jsonRes({ error: { message: 'AI service not configured' } }, 500, headers);

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: body.model || 'llama-3.3-70b-versatile',
      max_tokens: Math.min(body.max_tokens || 1000, 4000),
      temperature: body.temperature ?? 0.7,
      messages: body.messages,
    }),
  });
  const data = await groqRes.json();
  return jsonRes(data, groqRes.status, headers);
}

async function handleCheckProStatus(request, env, headers, uid) {
  const token = await getGoogleAccessToken(env);
  const data = await fsGet(env, token, `proUsers/${uid}`);
  if (!data) return jsonRes({ result: { isPro: false, expiresAt: 0, plan: null } }, 200, headers);

  const now = Date.now();
  const isPro = data.isPro === true && typeof data.expiresAt === 'number' && data.expiresAt > now;

  if (data.isPro === true && data.expiresAt <= now) {
    await fsSet(env, token, `proUsers/${uid}`, { isPro: false });
  }

  return jsonRes({
    result: {
      isPro,
      expiresAt: data.expiresAt || 0,
      planType: isPro ? (data.planType || data.plan || 'monthly') : null,
      plan: isPro ? (data.plan || data.planType || 'monthly') : null,
    },
  }, 200, headers);
}

async function handleActivateTrial(request, env, headers, uid, userEmail) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const data = body.data || body || {};
  const { couponCode, plan, validateOnly } = data;
  const isCouponGrant = !!couponCode;
  const token = await getGoogleAccessToken(env);

  if (validateOnly === true) {
    if (!couponCode) return jsonRes({ result: { success: false, message: 'No coupon code provided.' } }, 400, headers);
    try {
      const proData = await fsGet(env, token, `proUsers/${uid}`);
      if (proData && proData.isPro === true && proData.expiresAt > Date.now()) {
        return jsonRes({ result: { success: false, alreadyPro: true, message: 'You already have an active Pro subscription.' } }, 200, headers);
      }
    } catch { /* non-fatal */ }

    try {
      const c = await validateCoupon(env, token, couponCode, plan || 'monthly');
      return jsonRes({ result: { success: true, validateOnly: true, discount: c.discountValue, discountType: c.discountType, isFree: c.isFree, plan: plan || 'monthly' } }, 200, headers);
    } catch (e) {
      return jsonRes({ result: { success: false, message: e.message } }, 200, headers);
    }
  }

  try {
    const existing = (await fsGet(env, token, `proUsers/${uid}`)) || {};
    const now = Date.now();

    if (existing.isPro === true && existing.expiresAt > now)
      return jsonRes({ result: { success: false, message: 'You already have an active Pro subscription.' } }, 200, headers);
    if (!isCouponGrant && existing.trialUsed === true)
      return jsonRes({ result: { success: false, message: 'Free trial already used on this account.' } }, 200, headers);

    let couponResult = null;
    let grantedPlan;

    if (isCouponGrant) {
      try { couponResult = await validateCoupon(env, token, couponCode, plan); }
      catch (e) { return jsonRes({ error: { message: e.message } }, 400, headers); }
      if (!couponResult.isFree) return jsonRes({ error: { message: 'This coupon is not 100% off. Payment required.' } }, 400, headers);
      grantedPlan = ['monthly', 'annual'].includes(plan) ? plan : 'monthly';
    } else {
      grantedPlan = 'trial';
    }

    const { displayName, email } = await getUserMeta(env, token, uid, userEmail);
    const expiresAt = grantedPlan === 'trial' ? now + 7 * 24 * 60 * 60 * 1000 : now + (PLAN_DURATION_MS[grantedPlan] || PLAN_DURATION_MS.monthly);

    await fsSet(env, token, `proUsers/${uid}`, {
      isPro: true, plan: grantedPlan, planType: grantedPlan,
      trialUsed: !isCouponGrant ? true : (existing.trialUsed || false),
      couponCode: couponCode || null, displayName, email,
      amountPaid: 0, orderId: null, paymentId: null,
      activatedAt: now, expiresAt, updatedAt: now,
    });

    if (couponResult) await consumeCoupon(env, token, couponResult.couponPath, couponResult.couponData, uid, grantedPlan, couponResult.adminOnly);

    return jsonRes({ result: { success: true, isPro: true, plan: grantedPlan, planType: grantedPlan, expiresAt } }, 200, headers);
  } catch (e) {
    return jsonRes({ error: { message: 'Activation failed: ' + e.message } }, 500, headers);
  }
}

async function handleCreateOrder(request, env, headers, uid, userEmail) {
  let body;
  try { body = await request.json(); } catch { return jsonRes({ error: { message: 'Invalid JSON body' } }, 400, headers); }
  const data = body.data || body || {};
  const { plan, couponCode } = data;

  if (!plan || !['monthly', 'annual'].includes(plan))
    return jsonRes({ error: { message: `Invalid plan '${plan}'. Must be monthly or annual.` } }, 400, headers);

  const token = await getGoogleAccessToken(env);
  const basePaise = PLAN_PRICE[plan];
  let finalPaise = basePaise;
  let couponResult = null;

  if (couponCode) {
    try {
      couponResult = await validateCoupon(env, token, couponCode, plan);
      finalPaise = computeFinalAmount(basePaise, couponResult);
    } catch (e) {
      return jsonRes({ error: { message: e.message } }, 400, headers);
    }
  }

  // 100% off / free coupon → activate Pro directly, skip Razorpay entirely
  if (finalPaise === 0) {
    try {
      const { displayName, email } = await getUserMeta(env, token, uid, userEmail);
      const expiresAt = await activateProInDB(env, token, uid, {
        plan, amountPaidRupees: 0, couponCode: couponCode || null,
        orderId: null, paymentId: null, displayName, email,
      });
      if (couponResult) await consumeCoupon(env, token, couponResult.couponPath, couponResult.couponData, uid, plan, couponResult.adminOnly);
      return jsonRes({ result: { zeroCost: true, isPro: true, plan, expiresAt, couponApplied: true, discount: couponResult?.discountValue } }, 200, headers);
    } catch (e) {
      return jsonRes({ error: { message: 'Free activation failed: ' + e.message } }, 500, headers);
    }
  }

  // Paid order → create it on Razorpay
  if (!env.RZP_KEY_ID || !env.RZP_KEY_SECRET)
    return jsonRes({ error: { message: 'Payment gateway not configured. Contact support.' } }, 500, headers);

  try {
    const order = await razorpayCreateOrder(env, {
      amount: finalPaise,
      currency: 'INR',
      receipt: `ein_${plan}_${Date.now()}`,
      notes: {
        uid, plan, app: 'exam-is-near',
        couponCode: couponCode || '',
        discountType: couponResult?.discountType || '',
        discountValue: String(couponResult?.discountValue || 0),
      },
    });
    return jsonRes({
      result: {
        orderId: order.id, amount: order.amount, currency: order.currency,
        keyId: env.RZP_KEY_ID,
        couponApplied: !!couponCode,
        discountType: couponResult?.discountType || null,
        discountValue: couponResult?.discountValue || 0,
      },
    }, 200, headers);
  } catch (e) {
    return jsonRes({ error: { message: 'Razorpay error: ' + e.message } }, 502, headers);
  }
}

async function handleVerifyPayment(request, env, headers, uid, userEmail) {
  let body;
  try { body = await request.json(); } catch { return jsonRes({ error: { message: 'Invalid JSON body' } }, 400, headers); }
  const data = body.data || body || {};
  const { orderId, paymentId, signature, plan, couponCode } = data;

  if (!orderId || !paymentId || !signature || !plan)
    return jsonRes({ error: { message: 'Missing fields: orderId, paymentId, signature, plan' } }, 400, headers);

  if (!env.RZP_KEY_SECRET)
    return jsonRes({ error: { message: 'Payment gateway not configured. Contact support.' } }, 500, headers);

  const validSig = await verifyRazorpaySignature(orderId, paymentId, signature, env.RZP_KEY_SECRET);
  if (!validSig) return jsonRes({ error: { message: 'Payment signature verification failed.' } }, 400, headers);

  const token = await getGoogleAccessToken(env);

  // Never trust a client-sent amount — fetch the actual charge from Razorpay.
  let amountPaidPaise = PLAN_PRICE[plan] || PLAN_PRICE.monthly;
  try {
    const payment = await razorpayFetchPayment(env, paymentId);
    if (typeof payment.amount === 'number') amountPaidPaise = payment.amount;
  } catch (e) {
    console.warn('[verifyPayment] Could not fetch Razorpay payment, using coupon fallback:', e.message);
    if (couponCode) {
      try {
        const cr = await validateCoupon(env, token, couponCode, plan);
        amountPaidPaise = computeFinalAmount(PLAN_PRICE[plan], cr);
      } catch { /* use default */ }
    }
  }

  try {
    const { displayName, email } = await getUserMeta(env, token, uid, userEmail);
    const expiresAt = await activateProInDB(env, token, uid, {
      plan, amountPaidRupees: Math.round(amountPaidPaise / 100),
      couponCode: couponCode || null, orderId, paymentId, displayName, email,
    });

    if (couponCode) {
      try {
        const cr = await validateCoupon(env, token, couponCode, plan);
        await consumeCoupon(env, token, cr.couponPath, cr.couponData, uid, plan, cr.adminOnly);
      } catch (e) {
        console.warn('[verifyPayment] Coupon consume skipped:', e.message);
      }
    }

    return jsonRes({ result: { success: true, isPro: true, plan, expiresAt } }, 200, headers);
  } catch (e) {
    return jsonRes({ error: { message: 'DB write failed: ' + e.message } }, 500, headers);
  }
}

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25MB — raise if you need bigger files

function sanitizeFileName(name) {
  return String(name || 'file').replace(/[\/\\?%*:|"<>]/g, '_').slice(0, 200);
}

async function handleUploadFile(request, env, headers, uid) {
  if (!env.FILES_BUCKET) return jsonRes({ error: { message: 'File storage not configured. Contact support.' } }, 500, headers);

  let form;
  try { form = await request.formData(); } catch { return jsonRes({ error: { message: 'Expected multipart/form-data' } }, 400, headers); }

  const file = form.get('file');
  const fileId = form.get('fileId') || crypto.randomUUID();
  if (!file || typeof file === 'string') return jsonRes({ error: { message: 'No file provided' } }, 400, headers);
  if (file.size > MAX_UPLOAD_BYTES) return jsonRes({ error: { message: `File too large — max ${MAX_UPLOAD_BYTES / 1024 / 1024}MB` } }, 413, headers);

  const safeName = sanitizeFileName(form.get('fileName') || file.name);
  const key = `user-files/${uid}/${fileId}_${safeName}`;

  try {
    await env.FILES_BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
    });
  } catch (e) {
    return jsonRes({ error: { message: 'Upload failed: ' + e.message } }, 500, headers);
  }

  const url = new URL(request.url);
  const downloadURL = `${url.origin}/files/${key}`;
  return jsonRes({ result: { downloadURL, key, fileId } }, 200, headers);
}

// Public, unauthenticated — same trust model as a Firebase Storage download
// URL (unguessable path, not access-controlled). No auth header, since plain
// <img src> / <a href> requests from the browser can't attach one.
async function handleServeFile(url, env, corsOrigin) {
  if (!env.FILES_BUCKET) return new Response('File storage not configured', { status: 500 });

  const key = decodeURIComponent(url.pathname.replace(/^\/files\//, ''));
  if (!key) return new Response('Not found', { status: 404 });

  const obj = await env.FILES_BUCKET.get(key);
  if (!obj) return new Response('Not found', { status: 404 });

  const respHeaders = new Headers();
  obj.writeHttpMetadata(respHeaders);
  respHeaders.set('etag', obj.httpEtag);
  respHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
  respHeaders.set('Access-Control-Allow-Origin', corsOrigin);
  return new Response(obj.body, { headers: respHeaders });
}

// ── Router ───────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

    // Public, unauthenticated file serving — must come before the auth gate,
    // since <img src>/<a href> requests can't attach an Authorization header.
    if (request.method === 'GET' && url.pathname.startsWith('/files/')) {
      const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
      try { return await handleServeFile(url, env, allowOrigin); }
      catch (err) { console.error('[worker] serveFile error:', err.message); return new Response('Internal error', { status: 500 }); }
    }

    if (request.method !== 'POST') return jsonRes({ error: 'Method not allowed' }, 405, headers);

    const authHeader = request.headers.get('Authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) return jsonRes({ error: { message: 'Missing Authorization header' } }, 401, headers);

    let uid, email;
    try {
      const payload = await verifyFirebaseToken(idToken, env.FIREBASE_PROJECT_ID);
      uid = payload.sub; email = payload.email;
    } catch (err) {
      console.warn('[auth] Token verification failed:', err.message);
      return jsonRes({ error: { message: 'Invalid or expired token' } }, 401, headers);
    }

    try {
      if (url.pathname === '/checkProStatus') return await handleCheckProStatus(request, env, headers, uid);
      if (url.pathname === '/activateTrial') return await handleActivateTrial(request, env, headers, uid, email);
      if (url.pathname === '/createOrder') return await handleCreateOrder(request, env, headers, uid, email);
      if (url.pathname === '/verifyPayment') return await handleVerifyPayment(request, env, headers, uid, email);
      if (url.pathname === '/uploadFile') return await handleUploadFile(request, env, headers, uid);
      return await handleGroqProxy(request, env, headers, uid); // default: groqProxy (root path)
    } catch (err) {
      console.error('[worker] Unhandled error:', err.message);
      return jsonRes({ error: { message: 'Internal error: ' + err.message } }, 500, headers);
    }
  },
};

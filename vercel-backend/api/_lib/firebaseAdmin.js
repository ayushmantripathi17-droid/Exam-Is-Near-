// api/_lib/firebaseAdmin.js
// Firebase Admin SDK works fine outside Cloud Functions — it talks to
// Firestore/Auth over their REST APIs using a service account, no Blaze
// plan required. This is what makes running Firestore + Auth logic from
// Vercel possible at all.
//
// Env var needed: FIREBASE_SERVICE_ACCOUNT
//   Firebase Console -> Project Settings -> Service Accounts -> Generate
//   new private key. Paste the ENTIRE JSON file content as-is into the
//   Vercel env var (Vercel handles multi-line values fine), or base64
//   it first if you prefer — this loader accepts either.

const admin = require("firebase-admin");

if (!admin.apps.length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT env var is missing");
  }

  const serviceAccount = JSON.parse(
    raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;

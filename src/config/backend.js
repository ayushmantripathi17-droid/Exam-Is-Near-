// src/config/backend.js
// Single switchboard for the services that used to require Cloud Functions
// (Blaze). Flip VITE_AI_PROVIDER / VITE_PAYMENT_PROVIDER from "vercel" to
// "firebase" per-feature once Blaze is enabled at 10k+ users — nothing else
// in the app should hardcode a Cloud Functions or Vercel URL directly.
//
// File storage is NOT a backend concern anymore: no Firebase Storage, no
// Cloudinary. Notes/resources are Google Drive share links, stored as plain
// strings on Firestore docs (Firestore is free on Spark, no billing needed).

const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || "vercel"; // "vercel" | "firebase"
const PAYMENT_PROVIDER = import.meta.env.VITE_PAYMENT_PROVIDER || "vercel"; // "vercel" | "firebase"

const VERCEL_API_BASE = import.meta.env.VITE_VERCEL_API_BASE || ""; // e.g. https://exam-is-near-api.vercel.app
const FIREBASE_FUNCTIONS_BASE = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE || ""; // e.g. https://asia-south1-<project>.cloudfunctions.net

export function getGroqProxyUrl() {
  return AI_PROVIDER === "firebase" ? `${FIREBASE_FUNCTIONS_BASE}/groqProxy` : `${VERCEL_API_BASE}/api/groq-proxy`;
}

export function getCreateOrderUrl() {
  return PAYMENT_PROVIDER === "firebase" ? `${FIREBASE_FUNCTIONS_BASE}/createOrder` : `${VERCEL_API_BASE}/api/create-order`;
}

export function getVerifyPaymentUrl() {
  return PAYMENT_PROVIDER === "firebase" ? `${FIREBASE_FUNCTIONS_BASE}/verifyPayment` : `${VERCEL_API_BASE}/api/verify-payment`;
}

export function getCheckProStatusUrl() {
  return PAYMENT_PROVIDER === "firebase" ? `${FIREBASE_FUNCTIONS_BASE}/checkProStatus` : `${VERCEL_API_BASE}/api/check-pro-status`;
}

export function getActivateTrialUrl() {
  return PAYMENT_PROVIDER === "firebase" ? `${FIREBASE_FUNCTIONS_BASE}/activateTrial` : `${VERCEL_API_BASE}/api/activate-trial`;
}

// --- Google Drive resource links ---------------------------------------
// Admin pastes a normal "Share" link from Drive; these turn it into
// embeddable / direct-download URLs. No upload, no storage bucket, no
// billing — the file just lives in your Drive.

const DRIVE_ID_PATTERNS = [
  /\/file\/d\/([a-zA-Z0-9_-]+)/, // https://drive.google.com/file/d/<id>/view
  /[?&]id=([a-zA-Z0-9_-]+)/, // https://drive.google.com/open?id=<id>
  /\/document\/d\/([a-zA-Z0-9_-]+)/, // Google Docs
];

export function extractDriveFileId(url) {
  if (!url || typeof url !== "string") return null;
  for (const pattern of DRIVE_ID_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function isValidDriveLink(url) {
  return !!extractDriveFileId(url) && /drive\.google\.com|docs\.google\.com/.test(url);
}

// Embeds directly in an <iframe> for in-app preview (PDF, slides, etc.)
export function toDrivePreviewUrl(url) {
  const id = extractDriveFileId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
}

// Forces a direct download rather than opening Drive's viewer
export function toDriveDownloadUrl(url) {
  const id = extractDriveFileId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
}

// IMPORTANT: the Drive file's sharing setting must be "Anyone with the
// link" for these URLs to work for students who aren't signed in as you.

export const backendConfig = { AI_PROVIDER, PAYMENT_PROVIDER };

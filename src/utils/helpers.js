// ══════════════════════════════════════════════════════════════
// UTILS — Exam Is Near by ArkSetu
// Pure helper functions with no side-effects or state.
// ══════════════════════════════════════════════════════════════

// ── ID & date ─────────────────────────────────────────────────
export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function today() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── HTML escaping (prevent XSS in manual innerHTML) ───────────
export function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Safe innerHTML using DOMPurify ────────────────────────────
export function safeSet(el, html) {
  if (!el) return;
  el.innerHTML = window.DOMPurify
    ? DOMPurify.sanitize(html, {
        ALLOWED_URI_REGEXP: /^(?:(?:https?|blob|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      })
    : html;
}

// ── Toast notification ────────────────────────────────────────
export function showToast(msg, type = "info") {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className   = `toast ${type} show`;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 3000);
}

// ── Debounce ──────────────────────────────────────────────────
export function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── Crawler detection (skip Firebase init for bots) ───────────
export function isCrawlerUA() {
  const ua = navigator.userAgent.toLowerCase();
  return /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|sogou|exabot|facebot|ia_archiver|lighthouse|pagespeed|chrome-lighthouse/.test(ua);
}

// ── Format duration from seconds ──────────────────────────────
export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ── Deep clone (safe for plain objects/arrays) ────────────────
export function deepClone(obj) {
  try { return JSON.parse(JSON.stringify(obj)); }
  catch { return obj; }
}

// ── Sanitize object for Firestore (remove undefined/functions) ─
export function sanitizeForFirestore(obj) {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore).filter(v => v !== undefined);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "function" || typeof v === "undefined") continue;
    if (typeof v === "number" && !isFinite(v)) { out[k] = null; continue; }
    out[k] = typeof v === "object" ? sanitizeForFirestore(v) : v;
  }
  return out;
}

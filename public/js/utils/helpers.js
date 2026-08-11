// ══════════════════════════════════════════════════════════════
// HELPERS — Exam Is Near by ArkSetu
// Pure, side-effect-light functions. This is the ACTUAL LIVE
// implementation now wired into public/index.html — every export
// below was extracted verbatim (or reconciled, see esc() note)
// from production, not drafted separately. Keep it that way:
// edit here first, then re-export, don't hand-copy into HTML again.
// ══════════════════════════════════════════════════════════════

// ── ID & date ─────────────────────────────────────────────────
export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function today() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

// ── HTML escaping (prevent XSS in manual innerHTML) ────────────
// NOTE: index.html's version did not escape single quotes; admin.html's
// did (`&#39;`). Standardized on the safer admin.html version here,
// since it closes a real gap when esc() output lands inside a
// single-quoted HTML attribute. Functionally a strict superset —
// safe to swap in without behavior change for existing double-quoted
// usage.
export function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Toast notification ────────────────────────────────────────
// Requires an element with id="toast" and CSS classes .toast / .toast-info
// / .toast-success / etc. + a ".hiding" transition state, as defined in
// src/ui/styles/main.css. Matches index.html's real behavior exactly
// (2400ms display, 320ms exit transition).
export function showToast(msg, type = "info") {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.className = `toast toast-${type} show`;
  setTimeout(() => {
    t.classList.add("hiding");
    setTimeout(() => t.className = "toast", 320);
  }, 2400);
}

// ── Crawler / bot detection (skip heavy Firebase init for bots) ─
// Used to avoid starving Googlebot's render budget with an
// always-open Firestore SDK connection during crawl/render checks.
export function isCrawlerUA() {
  const ua = (navigator.userAgent || "").toLowerCase();
  return /googlebot|google-inspectiontool|googleother|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|applebot|petalbot|semrushbot|ahrefsbot|mj12bot|rogerbot/.test(ua);
}

// ── Sanitize object for Firestore (remove undefined values) ────
// Recursively strips undefined so Firestore never throws
// invalid-argument on writes.
export function sanitizeForFirestore(obj) {
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore).filter(v => v !== undefined);
  if (obj !== null && typeof obj === "object") {
    const out = {};
    for (const k in obj) {
      const v = sanitizeForFirestore(obj[k]);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  return obj === undefined ? null : obj;
}

// ══════════════════════════════════════════════════════════════
// The following were previously listed here as "extracted" but do
// NOT exist anywhere in production (formatDate, safeSet, debounce,
// formatDuration, deepClone). They were aspirational/never adopted.
// Removed rather than left as misleading dead exports. Re-add only
// once actually wired into a real call site.
// ══════════════════════════════════════════════════════════════

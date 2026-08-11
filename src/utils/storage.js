// ══════════════════════════════════════════════════════════════
// STORAGE UTILS — Exam Is Near by ArkSetu
// All localStorage / IndexedDB access goes through here.
// Eliminates key-mismatch bugs by enforcing STORAGE_KEYS usage.
// ══════════════════════════════════════════════════════════════
import { STORAGE_KEYS } from "./constants.js";

// ── localStorage helpers ───────────────────────────────────────
export function lsGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    try { return JSON.parse(raw); } catch { return raw; }
  } catch { return fallback; }
}

export function lsSet(key, value) {
  try {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    return true;
  } catch { return false; }
}

export function lsDel(key) {
  try { localStorage.removeItem(key); return true; }
  catch { return false; }
}

// ── IndexedDB (large quota ~250 MB+) with localStorage fallback ──
const IDB_NAME    = "exam-is-near-db";
const IDB_STORE   = "kv";
const IDB_VERSION = 1;

let _idbPromise = null;
function openIDB() {
  if (_idbPromise) return _idbPromise;
  _idbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = e => e.target.result.createObjectStore(IDB_STORE);
    req.onsuccess       = e => resolve(e.target.result);
    req.onerror         = () => reject(req.error);
  });
  return _idbPromise;
}

export async function idbSet(k, v) {
  try {
    const db  = await openIDB();
    const tx  = db.transaction(IDB_STORE, "readwrite");
    const str = tx.objectStore(IDB_STORE);
    str.put(v, k);
    return new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
  } catch { return lsSet(k, v); } // fallback
}

export async function idbGet(k, fallback = null) {
  try {
    const db  = await openIDB();
    const tx  = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(k);
    return new Promise((res, rej) => {
      req.onsuccess = () => res(req.result !== undefined ? req.result : fallback);
      req.onerror   = () => rej(req.error);
    });
  } catch { return lsGet(k, fallback); } // fallback
}

// ── Daily counter helpers (for free-tier rate limiting) ────────
// Always keyed by STORAGE_KEYS.DAILY_COUNTER_PREFIX + counterName + today's date
// so they auto-reset each day without any manual cleanup needed.
export function getDailyCounter(name) {
  const key = `${STORAGE_KEYS.DAILY_COUNTER_PREFIX}${name}_${_todayStr()}`;
  return lsGet(key, 0);
}

export function incDailyCounter(name) {
  const key   = `${STORAGE_KEYS.DAILY_COUNTER_PREFIX}${name}_${_todayStr()}`;
  const count = lsGet(key, 0) + 1;
  lsSet(key, count);
  return count;
}

export function resetDailyCounter(name) {
  const key = `${STORAGE_KEYS.DAILY_COUNTER_PREFIX}${name}_${_todayStr()}`;
  lsDel(key);
}

function _todayStr() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

// ── Storage quota estimate ─────────────────────────────────────
export async function getStorageEstimate() {
  if (!navigator.storage?.estimate) return null;
  try {
    const { usage, quota } = await navigator.storage.estimate();
    return {
      usedMB:  Math.round(usage  / 1024 / 1024),
      quotaMB: Math.round(quota  / 1024 / 1024),
      pct:     Math.round((usage / quota) * 100),
    };
  } catch { return null; }
}

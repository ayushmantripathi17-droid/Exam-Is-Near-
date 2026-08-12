// ══════════════════════════════════════════════════════════════
// GENERIC APP CONSTANTS — no course logic, stays global
// ══════════════════════════════════════════════════════════════
// Phase-1 restructuring: extracted verbatim from the original
// public/js/data/subjects.js, which contained these alongside course
// data even though they're course-agnostic (moods, note types, calendar
// labels used across every course). The original file remains untouched
// and is still what index.html loads today; this is an additive copy
// for the new structure, not wired in yet.
// ══════════════════════════════════════════════════════════════
const MOODS=["😴","😕","😐","😊","🔥"];
const MOOD_LABELS=["Very Low","Low","Okay","Good","On Fire!"];
const NOTE_TYPES=["📝 Note","💡 Concept","⚠️ Important","🧮 Formula","📋 Definition","❓ Doubt"];
const NOTE_BG={"📝 Note":"#1e1e2e","💡 Concept":"#0f1e0f","⚠️ Important":"#1e0f0f","🧮 Formula":"#0f0f1e","📋 Definition":"#1a0f1a","❓ Doubt":"#1a1a0f"};
const NOTE_ACC={"📝 Note":"#6b6baa","💡 Concept":"#06D6A0","⚠️ Important":"#FF6B35","🧮 Formula":"#4ECDC4","📋 Definition":"#C77DFF","❓ Doubt":"#FFE66D"};
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];

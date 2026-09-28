// ══════════════════════════════════════════════════════════════
// STREAK TRACKER — shared across JEE / NEET / CBSE / NFSU
// The raw day-count streak already lived in each course's
// exam-dates-actions.js (getStreak()). This module adds milestones,
// a "longest streak" stat, and a celebration hook on top of that
// same studyLog data — no new Firestore fields, no new sync logic.
// ══════════════════════════════════════════════════════════════

export const STREAK_MILESTONES = [
  { days: 3,   badge: "🔥",   label: "3-Day Spark" },
  { days: 7,   badge: "🔥🔥",  label: "1-Week Warrior" },
  { days: 14,  badge: "🔥🔥🔥", label: "2-Week Grinder" },
  { days: 30,  badge: "🏅",   label: "30-Day Discipline" },
  { days: 50,  badge: "🥈",   label: "50-Day Veteran" },
  { days: 100, badge: "🥇",   label: "100-Day Legend" },
  { days: 180, badge: "💎",   label: "180-Day Titan" },
  { days: 365, badge: "👑",   label: "1-Year Unstoppable" },
];

/** Current consecutive-day streak from a studyLog object ({date: {hours,...}}). */
export function getCurrentStreak(studyLog){
  let streak = 0; const d = new Date();
  while (streak < 1000){
    const k = d.toISOString().split("T")[0];
    if (studyLog[k]?.hours > 0){ streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}

/** Longest consecutive-day run ever recorded in a studyLog object. */
export function getLongestStreak(studyLog){
  const days = Object.keys(studyLog).filter(k => studyLog[k]?.hours > 0).sort();
  if (!days.length) return 0;
  let longest = 1, run = 1;
  for (let i = 1; i < days.length; i++){
    const diff = Math.round((new Date(days[i]) - new Date(days[i-1])) / 86400000);
    run = diff === 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  }
  return longest;
}

/** Highest milestone reached at or below `streak` days, or null. */
export function getMilestoneForStreak(streak){
  let hit = null;
  for (const m of STREAK_MILESTONES) if (streak >= m.days) hit = m;
  return hit;
}

/**
 * Call with the streak before and after a log action.
 * Returns the milestone object if `afterStreak` just crossed a new
 * threshold that `beforeStreak` hadn't reached yet, else null.
 */
export function checkNewMilestone(beforeStreak, afterStreak){
  return STREAK_MILESTONES.find(m => afterStreak >= m.days && beforeStreak < m.days) || null;
}

/** Compact badge HTML for the current streak — safe to inline in any course's templates. */
export function renderStreakBadge(streak){
  const m = getMilestoneForStreak(streak);
  const icon = m ? m.badge : (streak > 0 ? "🔥" : "💤");
  const title = streak > 0 ? `${streak} day streak${m ? " · " + m.label : ""}` : "No active streak yet";
  return `<div title="${title}" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#141420;border:1px solid #2a2a1a;border-radius:20px;font-size:13px;font-weight:bold;color:#FFE66D">
    <span style="font-size:16px">${icon}</span><span>${streak} day${streak===1?"":"s"}</span>
  </div>`;
}

if (typeof window !== "undefined") {
  Object.assign(window, { STREAK_MILESTONES, getCurrentStreak, getLongestStreak, getMilestoneForStreak, checkNewMilestone, renderStreakBadge });
}

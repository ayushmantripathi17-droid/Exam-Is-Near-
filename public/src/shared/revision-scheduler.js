// ══════════════════════════════════════════════════════════════
// DYNAMIC REVISION SCHEDULER — shared across JEE / NEET
// The SRS deck already tracks due cards (SM-2: dueDate/interval/ease)
// tagged by subject, and Chapter Weightage already has per-subject
// question-count data. This module combines the two so due cards
// surface in priority order instead of insertion order — no new
// fields, no new UI screen, just a smarter sort on data you have.
// ══════════════════════════════════════════════════════════════

/** {SubjectName: [{ch,q,color}]} → {SubjectName: shareOfTotalQuestions 0..1} */
export function getSubjectWeightageShare(weightageData){
  const totals = {};
  let grand = 0;
  Object.entries(weightageData || {}).forEach(([subj, chapters]) => {
    const sum = (chapters || []).reduce((s, c) => s + (c.q || 0), 0);
    totals[subj] = sum;
    grand += sum;
  });
  const share = {};
  Object.keys(totals).forEach(k => { share[k] = grand ? totals[k] / grand : 0; });
  return share;
}

/**
 * Sorts due SRS cards by priority: higher exam-weightage subjects first,
 * weaker recall (low SM-2 ease) pushed up, and cards sitting overdue
 * nudged up too (capped at 7 days so this doesn't just become "oldest first").
 */
export function rankDueCards(dueCards, weightageShare){
  const now = Date.now();
  const fallbackShare = 1 / Math.max(Object.keys(weightageShare || {}).length, 1);
  return [...dueCards]
    .map(card => {
      const share = weightageShare?.[card.sub] ?? fallbackShare;
      const overdueDays = Math.max(0, (now - card.dueDate) / 86400000);
      const weaknessFactor = Math.max(0, 3 - (card.ease ?? 2.5)); // ease ~1.3 (weak) .. 2.5+ (strong)
      const score = share * 100 + weaknessFactor * 20 + Math.min(overdueDays, 7) * 3;
      return { ...card, _priorityScore: score };
    })
    .sort((a, b) => b._priorityScore - a._priorityScore);
}

/** One short phrase explaining why a card is where it is in the queue. */
export function explainPriority(card, weightageShare){
  const share = weightageShare?.[card.sub];
  const bits = [];
  if (share != null){
    if (share >= 0.3) bits.push("high exam weightage");
    else if (share <= 0.12) bits.push("lower exam weightage");
  }
  if ((card.ease ?? 2.5) < 1.8) bits.push("weak recall");
  const overdueDays = Math.max(0, Math.round((Date.now() - card.dueDate) / 86400000));
  if (overdueDays >= 3) bits.push(`${overdueDays}d overdue`);
  return bits.length ? bits.join(" · ") : "due today";
}

if (typeof window !== "undefined") {
  Object.assign(window, { getSubjectWeightageShare, rankDueCards, explainPriority });
}

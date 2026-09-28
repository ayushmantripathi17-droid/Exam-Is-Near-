// ══════════════════════════════════════════════════════════════
// MOCK TEST / QUIZ DIAGNOSTICS — shared across JEE / NEET / CBSE / NFSU
// Classifies each wrong answer in a quiz result as a "silly mistake"
// (an isolated slip in a topic the student is otherwise strong in) or
// a "concept gap" (a pattern — wrong on an easy question, or a topic
// with generally low accuracy). No new data collection required: it
// runs entirely on quizLog entries that already exist.
// ══════════════════════════════════════════════════════════════

/** Per-chapter accuracy map ({ "subjectId|chapter": pct }) built from the full quiz history. */
function buildChapterAccuracyMap(quizLog){
  const map = {};
  (quizLog || []).forEach(entry => {
    if (!entry || !entry.total) return;
    const key = (entry.subject || "?") + "|" + (entry.chapter || "All Chapters");
    if (!map[key]) map[key] = { correctQ: 0, totalQ: 0 };
    map[key].correctQ += entry.score || 0;
    map[key].totalQ += entry.total || 0;
  });
  const pct = {};
  Object.keys(map).forEach(k => { pct[k] = map[k].totalQ ? Math.round((map[k].correctQ / map[k].totalQ) * 100) : 0; });
  return pct;
}

/**
 * Classify every attempted-but-wrong question across a quizLog into
 * "concept-gap" or "silly-mistake". Unattempted (skipped) questions
 * are left out — they're not a mistake type, just a skip.
 * Returns a flat list, most recent first.
 */
export function classifyQuizMistakes(quizLog){
  const accuracyMap = buildChapterAccuracyMap(quizLog);
  const out = [];
  (quizLog || []).forEach(entry => {
    const key = (entry.subject || "?") + "|" + (entry.chapter || "All Chapters");
    const chapterAccuracy = accuracyMap[key] ?? 0;
    (entry.questions || []).forEach(q => {
      if (q.correct || q.userAnswer === null || q.userAnswer === undefined) return; // skip correct / unattempted
      // An easy question missed, or a generally weak chapter (<60% accuracy) → a real gap.
      // A hard/medium question missed in an otherwise-strong chapter (>=60%) → likely a slip.
      let type = "concept-gap";
      if (q.difficulty === "hard" && chapterAccuracy >= 60) type = "silly-mistake";
      else if (q.difficulty === "medium" && chapterAccuracy >= 70) type = "silly-mistake";
      out.push({
        q: q.q, correctAnswerText: q.options?.[q.answer] ?? "", difficulty: q.difficulty || null,
        explanation: q.explanation || "", type, chapterAccuracy,
        subject: entry.subject, subjectName: entry.subjectName, chapter: entry.chapter, date: entry.date
      });
    });
  });
  return out.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/** Simple counts for a summary card. */
export function getMistakeBreakdown(classified){
  const conceptGaps = classified.filter(m => m.type === "concept-gap").length;
  const sillyMistakes = classified.filter(m => m.type === "silly-mistake").length;
  return { conceptGaps, sillyMistakes, total: conceptGaps + sillyMistakes };
}

/**
 * From a batch of newly-classified mistakes (typically just the quiz that
 * was just submitted), build Mistake Logbook entries for the concept-gap
 * ones only — silly mistakes aren't worth a permanent logbook entry.
 * Dedupes against questions already logged (matched on question text).
 */
export function buildAutoLogEntries(classifiedBatch, existingMistakes, examTag){
  const existingQs = new Set((existingMistakes || []).map(m => m.q));
  return classifiedBatch
    .filter(m => m.type === "concept-gap" && !existingQs.has(m.q))
    .map(m => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      q: m.q,
      ans: m.correctAnswerText,
      sub: m.subjectName || m.subject,
      exam: examTag || "neet",
      date: new Date().toLocaleDateString("en-IN"),
      source: "auto-mock" // tags entries this system added, vs manually typed ones
    }));
}

/** Compact badge for a single question in a review view. */
export function renderMistakeTypeBadge(type){
  if (type === "concept-gap") return `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:#2a0a0a;color:#FF6B35;border:1px solid #FF6B3544">🧠 Concept Gap</span>`;
  if (type === "silly-mistake") return `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:#1a1200;color:#FFE66D;border:1px solid #FFE66D44">🤦 Silly Mistake</span>`;
  return "";
}

/** Summary card for analytics: concept gaps vs silly mistakes, with a one-line takeaway. */
export function renderMistakeBreakdownCard(breakdown){
  if (!breakdown.total){
    return `<div class="card" style="margin-bottom:16px">
      <div class="section-label" style="margin-bottom:8px">🔬 Mistake Breakdown</div>
      <div style="font-size:12px;color:#333;text-align:center;padding:12px 0">No wrong answers yet to analyze — keep taking quizzes.</div>
    </div>`;
  }
  const gapPct = Math.round((breakdown.conceptGaps / breakdown.total) * 100);
  const takeaway = gapPct >= 60
    ? "Most misses are concept gaps — worth revisiting fundamentals, not just practicing more."
    : gapPct <= 30
    ? "Most misses are silly mistakes — you know the material, slow down and double-check."
    : "A mix of concept gaps and slips — the Mistake Logbook below has the specifics.";
  return `<div class="card" style="margin-bottom:16px;border-color:#FFE66D22">
    <div class="section-label" style="margin-bottom:12px">🔬 Mistake Breakdown</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <div style="background:#180a0a;border:1px solid #FF6B3522;border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:20px">🧠</div>
        <div style="font-size:16px;font-weight:800;color:#FF6B35">${breakdown.conceptGaps}</div>
        <div style="font-size:10px;color:#555">Concept Gaps</div>
      </div>
      <div style="background:#1a1200;border:1px solid #FFE66D22;border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:20px">🤦</div>
        <div style="font-size:16px;font-weight:800;color:#FFE66D">${breakdown.sillyMistakes}</div>
        <div style="font-size:10px;color:#555">Silly Mistakes</div>
      </div>
    </div>
    <div style="font-size:11px;color:#888;line-height:1.6">${takeaway}</div>
  </div>`;
}

if (typeof window !== "undefined") {
  Object.assign(window, { classifyQuizMistakes, getMistakeBreakdown, buildAutoLogEntries, renderMistakeTypeBadge, renderMistakeBreakdownCard });
}

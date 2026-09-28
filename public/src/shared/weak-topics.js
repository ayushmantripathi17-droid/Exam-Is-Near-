// ══════════════════════════════════════════════════════════════
// WEAK TOPIC DIAGNOSIS — shared across JEE / NEET / CBSE / NFSU
// Aggregates data that already exists (CourseRuntime.quizLog +
// njState.mistakes) into a ranked "what to fix next" list.
// No new Firestore fields, no new sync logic — pure derived view.
// ══════════════════════════════════════════════════════════════

const MIN_ATTEMPTS_TO_SURFACE = 1; // a topic needs at least one quiz attempt to be ranked

/**
 * @param {Array} quizLog   CourseRuntime.quizLog — [{subject, subjectName, chapter, score, total, date}]
 * @param {Array} mistakes  njState.mistakes — [{sub, ...}] (sub is a subject NAME like "Physics")
 * @param {number} limit    max topics to return, ranked weakest first
 */
export function getWeakTopics(quizLog, mistakes, limit = 5){
  const byTopic = {};
  (quizLog || []).forEach(entry => {
    if (!entry || !entry.total) return;
    const key = (entry.subject || "?") + "|" + (entry.chapter || "All Chapters");
    if (!byTopic[key]) byTopic[key] = {
      subject: entry.subject, subjectName: entry.subjectName || entry.subject,
      chapter: entry.chapter || "All Chapters", attempts: 0, totalQ: 0, correctQ: 0, lastDate: entry.date
    };
    const t = byTopic[key];
    t.attempts++;
    t.totalQ += entry.total || 0;
    t.correctQ += entry.score || 0;
    if (new Date(entry.date) > new Date(t.lastDate)) t.lastDate = entry.date;
  });

  const mistakeCounts = {};
  (mistakes || []).forEach(m => { if (m?.sub) mistakeCounts[m.sub] = (mistakeCounts[m.sub] || 0) + 1; });

  const topics = Object.values(byTopic)
    .filter(t => t.attempts >= MIN_ATTEMPTS_TO_SURFACE)
    .map(t => {
      const accuracy = t.totalQ ? Math.round((t.correctQ / t.totalQ) * 100) : 0;
      const mistakeCount = mistakeCounts[t.subjectName] || mistakeCounts[t.subject] || 0;
      // Weaker = lower accuracy, nudged further down by logged mistakes in that subject
      const weaknessScore = (100 - accuracy) + mistakeCount * 3;
      return { ...t, accuracy, mistakeCount, weaknessScore };
    });

  return topics.sort((a, b) => b.weaknessScore - a.weaknessScore).slice(0, limit);
}

/** Turns a weak-topics list into a compact string to feed as AI prompt context. */
export function buildWeakTopicContext(weakTopics){
  if (!weakTopics || !weakTopics.length) return null;
  return weakTopics
    .map(t => `${t.chapter} (${t.subjectName || t.subject}) — ${t.accuracy}% accuracy over ${t.attempts} attempt${t.attempts === 1 ? "" : "s"}${t.mistakeCount ? `, ${t.mistakeCount} logged mistake${t.mistakeCount === 1 ? "" : "s"}` : ""}`)
    .join("; ");
}

/** Compact HTML card: ranked accuracy bars + a "Generate Mock" CTA. Call site wires the button's onclick. */
export function renderWeakTopicsCard(weakTopics, ctaHandler = "startWeakTopicMock()"){
  if (!weakTopics || !weakTopics.length){
    return `<div class="card" style="margin-bottom:16px">
      <div class="section-label" style="margin-bottom:8px">🎯 Focus Areas</div>
      <div style="font-size:12px;color:#333;text-align:center;padding:12px 0">Attempt a few quizzes first — this fills in once you have quiz history.</div>
    </div>`;
  }
  return `<div class="card" style="margin-bottom:16px;border-color:#FFE66D22">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div class="section-label" style="margin-bottom:0">🎯 Focus Areas — Weakest Topics</div>
      <span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:8px;padding:2px 8px;font-weight:700">PRO</span>
    </div>
    ${weakTopics.map(t => {
      const color = t.accuracy >= 70 ? "#06D6A0" : t.accuracy >= 50 ? "#FFE66D" : "#FF6B35";
      return `<div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#ccc;margin-bottom:4px">
          <span>${t.chapter} <span style="color:#555">· ${t.subjectName || t.subject}</span></span>
          <span style="color:${color};font-weight:700">${t.accuracy}%</span>
        </div>
        <div class="pbar"><div class="pfill" style="width:${t.accuracy}%;background:${color}"></div></div>
      </div>`;
    }).join("")}
    <button class="btn-gold" onclick="${ctaHandler}" style="width:100%;padding:10px;margin-top:8px;font-size:13px">🧠 Generate Weak-Topic Mock Test</button>
  </div>`;
}

if (typeof window !== "undefined") {
  Object.assign(window, { getWeakTopics, buildWeakTopicContext, renderWeakTopicsCard });
}

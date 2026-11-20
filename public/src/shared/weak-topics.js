// ══════════════════════════════════════════════════════════════
// WEAK TOPIC DIAGNOSIS — shared across JEE / NEET / CBSE / NFSU
// Aggregates data that already exists (CourseRuntime.quizLog +
// njState.mistakes) into a ranked "what to fix next" list.
// No new Firestore fields, no new sync logic — pure derived view.
// ══════════════════════════════════════════════════════════════

import { esc } from "../utils/helpers.js";

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


// ══════════════════════════════════════════════════════════════
// PRACTICE FOCUS ANALYSIS — subject-wise accuracy + "focus on this next"
// Pure derived view over practice history (CourseRuntime.quizLog).
// ══════════════════════════════════════════════════════════════
const MIN_Q_FOR_RANKING = 5;   // a topic needs at least this many questions answered before we judge it
const STRONG_PCT = 70;         // at/above this we call a topic "strong"

// v2 topic-level analysis: uses the sub-topic tag stored on each practiced question
const MIN_Q_FOR_TOPIC = 2;   // a specific topic needs at least this many questions answered

/** Groups practice history by subject -> chapter, and by specific sub-topic when questions were tagged. */
export function analyzePractice(quizLog){
  const subjects = {};
  (quizLog || []).forEach(e => {
    if (!e || !e.total) return;
    const sid = e.subject || "?";
    const s = subjects[sid] || (subjects[sid] = { id: sid, name: e.subjectName || sid, total: 0, correct: 0, chapters: {}, topics: {} });
    s.total += e.total; s.correct += e.score || 0;
    const ch = e.chapter || "All Chapters";
    const c = s.chapters[ch] || (s.chapters[ch] = { name: ch, total: 0, correct: 0 });
    c.total += e.total; c.correct += e.score || 0;
    (e.questions || []).forEach(q => {
      const tp = q && typeof q.topic === "string" ? q.topic.trim() : "";
      if (!tp) return;
      const key = ch + "||" + tp.toLowerCase();
      const t = s.topics[key] || (s.topics[key] = { name: tp, chapter: ch, total: 0, correct: 0 });
      t.total += 1; if (q.correct) t.correct += 1;
    });
  });
  return Object.values(subjects).map(s => {
    const chapters = Object.values(s.chapters).map(c => ({ ...c, subject: s.id, subjectName: s.name, accuracy: Math.round((c.correct / c.total) * 100) }));
    const topics = Object.values(s.topics).map(t => ({ ...t, subject: s.id, subjectName: s.name, accuracy: Math.round((t.correct / t.total) * 100) }));
    return { ...s, accuracy: Math.round((s.correct / s.total) * 100), chapters, topics };
  });
}

/** Weakest specific topics; falls back to chapters for older practice history that has no topic tags. */
export function getFocusTopics(subjects, limit = 3){
  const rank = (a, b) => a.accuracy - b.accuracy || b.total - a.total;
  const topics = [];
  subjects.forEach(s => s.topics.forEach(t => {
    if (t.total >= MIN_Q_FOR_TOPIC && t.accuracy < STRONG_PCT) topics.push({ ...t, kind: "topic" });
  }));
  if (topics.length) return topics.sort(rank).slice(0, limit);
  const chapters = [];
  subjects.forEach(s => s.chapters.forEach(c => {
    if (c.total >= MIN_Q_FOR_RANKING && c.accuracy < STRONG_PCT) chapters.push({ ...c, chapter: c.name, kind: "chapter" });
  }));
  return chapters.sort(rank).slice(0, limit);
}

/** Card for the Practice screen: what to focus on + per-subject accuracy. */
export function renderFocusAnalysis(quizLog){
  const subjects = analyzePractice(quizLog);
  if (!subjects.length){
    return `<div class="qz-card" style="margin-top:22px">
      <div class="qz-sec" style="margin-bottom:6px"><h3>🎯 Focus Areas</h3></div>
      <div style="font-size:12.5px;color:var(--mute)">Complete a few practice sets — this will show which subjects and topics need more work.</div>
    </div>`;
  }
  const pcOf = p => p >= 70 ? "#06D6A0" : p >= 50 ? "#FFE66D" : "#FF6B35";
  const chLabel = n => n === "All Chapters" ? "Mixed chapters" : n;
  const focus = getFocusTopics(subjects);
  if (typeof window !== "undefined") window.__focusTopics = focus;
  const anyTopics = subjects.some(s => s.topics.length);

  const focusHtml = focus.length ? focus.map((t, i) => {
    const title = t.kind === "topic" ? t.name : chLabel(t.name);
    const where = t.kind === "topic" ? t.subjectName + " · " + chLabel(t.chapter) : t.subjectName;
    return `
    <div class="qz-log" style="margin-bottom:8px"><div class="qz-log-r">
      <div class="qz-log-c" style="color:${pcOf(t.accuracy)};border-color:${pcOf(t.accuracy)}">${t.accuracy}%</div>
      <div style="flex:1;min-width:0">
        <b>${esc(title)}</b>
        <span class="s">${esc(where)} · ${t.correct}/${t.total} correct</span>
      </div>
      <button class="qz-btn" style="padding:7px 12px;font-size:11.5px;color:var(--acc)" onclick="startFocusPractice(${i})">Practice →</button>
    </div></div>`;
  }).join("")
    : `<div style="font-size:12.5px;color:#06D6A0;margin-bottom:6px">🌟 No weak topics right now — everything you've practiced is at ${STRONG_PCT}%+. Try harder chapters or 50-question sets.</div>`;

  const subjHtml = subjects.slice().sort((a, b) => a.accuracy - b.accuracy).map(s => {
    const enough = s.total >= MIN_Q_FOR_RANKING;
    const weakTopic = s.topics.filter(t => t.total >= MIN_Q_FOR_TOPIC).sort((a, b) => a.accuracy - b.accuracy)[0];
    const weakChap = s.chapters.filter(c => c.name !== "All Chapters" && c.total >= MIN_Q_FOR_RANKING).sort((a, b) => a.accuracy - b.accuracy)[0];
    const weakest = weakTopic || weakChap;
    return `<div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--txt);margin-bottom:4px">
        <span><b>${esc(s.name)}</b> <span style="color:var(--mute)">· ${s.total} questions</span></span>
        <span style="color:${enough ? pcOf(s.accuracy) : "var(--mute)"};font-weight:800">${enough ? s.accuracy + "%" : "Need more data"}</span>
      </div>
      <div class="qz-bar" style="margin-bottom:4px"><i style="width:${s.accuracy}%;background:${pcOf(s.accuracy)}"></i></div>
      ${weakest && weakest.accuracy < STRONG_PCT ? `<div style="font-size:11.5px;color:var(--mute)">Weakest: ${esc(weakest.name)} (${weakest.accuracy}%)</div>` : ""}
    </div>`;
  }).join("");

  return `<div class="qz-card" style="margin-top:22px">
    <div class="qz-sec" style="margin-bottom:10px"><h3>🎯 Focus Areas</h3></div>
    <div class="qz-grp" style="margin-top:0">Focus on these first</div>
    ${focusHtml}
    <div class="qz-grp">Subject-wise accuracy</div>
    ${subjHtml}
    <div style="font-size:10.5px;color:var(--mute)">Based on your practice history. Topics need ${MIN_Q_FOR_TOPIC}+ questions to be ranked.${anyTopics ? "" : " Practice a few new sets to see specific topics instead of whole chapters."}</div>
  </div>`;
}

/** Starts a practice set on one of the focus items shown in the card (by index), targeting its specific topic. */
export function startFocusPractice(i){
  const t = (window.__focusTopics || [])[i];
  if (!t || !window.quizState) return;
  window.quizState.subSel = t.subject;
  window.quizState.unitSel = t.chapter === "All Chapters" ? "" : t.chapter;
  window.quizState.focusTopic = t.kind === "topic" ? t.name : "";
  window.startQuiz(window.quizState.unitSel || null, window.quizState.countSel || 15);
}

if (typeof window !== "undefined") {
  Object.assign(window, { getWeakTopics, buildWeakTopicContext, renderWeakTopicsCard, analyzePractice, getFocusTopics, renderFocusAnalysis, startFocusPractice });
}

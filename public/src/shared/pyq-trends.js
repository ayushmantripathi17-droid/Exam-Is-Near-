// ══════════════════════════════════════════════════════════════
// PYQ TREND LOG — shared across JEE / NEET
// Chapter Weightage already shows a 2019–2024 AVERAGE question count
// per chapter (from official answer keys). This module adds a
// year-by-year layer on top: the student logs which chapter a
// question came from as they solve real previous-year papers
// (already sitting in their Materials as PDFs tagged "pyq"), and
// this aggregates it into a personal frequency trend.
//
// Deliberately NOT pre-filled with invented per-year numbers — a
// fabricated trend would be worse than no trend for exam prep.
// Accuracy grows with how much the student (or an admin, in bulk)
// logs.
// ══════════════════════════════════════════════════════════════

/** Aggregates a pyqLog ([{exam,subject,chapter,year}]) into per-chapter frequency + which years. */
export function getPyqTrend(pyqLog, examFilter){
  const byChapter = {};
  (pyqLog || []).forEach(e => {
    if (examFilter && e.exam !== examFilter) return;
    const key = e.subject + "|" + e.chapter;
    if (!byChapter[key]) byChapter[key] = { subject: e.subject, chapter: e.chapter, years: new Set(), count: 0 };
    byChapter[key].years.add(e.year);
    byChapter[key].count++;
  });
  return Object.values(byChapter)
    .map(c => ({ ...c, years: [...c.years].sort((a, b) => b - a) }))
    .sort((a, b) => b.count - a.count);
}

/** Compact HTML: add-entry form + the aggregated trend list so far. */
export function renderPyqTrendSection(pyqLog, examFilter, chaptersBySubject){
  const trend = getPyqTrend(pyqLog, examFilter);
  const subjects = Object.keys(chaptersBySubject || {});
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return `<div class="feat-card" style="margin-bottom:12px;border-color:#4ECDC433">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
      <span style="font-size:16px">📈</span>
      <div style="font-size:13px;font-weight:700;color:#4ECDC4">Your PYQ Trend Log</div>
    </div>
    <div style="font-size:10px;color:#555;margin-bottom:12px;line-height:1.5">Log which chapter each previous-year question came from as you solve papers — this fills in from your own data, not a guess.</div>

    <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
      <select id="pyq-log-subject" onchange="renderPyqChapterOptions()" style="font-size:11px;flex:1;min-width:100px">
        ${subjects.map(s => `<option value="${s}">${s}</option>`).join("")}
      </select>
      <select id="pyq-log-chapter" style="font-size:11px;flex:2;min-width:140px">
        ${(chaptersBySubject[subjects[0]] || []).map(c => `<option value="${c}">${c}</option>`).join("")}
      </select>
      <select id="pyq-log-year" style="font-size:11px;width:80px">
        ${years.map(y => `<option value="${y}">${y}</option>`).join("")}
      </select>
      <button class="btn-gold" onclick="addPyqLogEntry()" style="padding:8px 14px;font-size:11px">+ Log</button>
    </div>

    ${trend.length === 0
      ? `<div style="font-size:11px;color:#333;text-align:center;padding:10px 0;font-style:italic">No entries logged yet — add your first as you go through PYQ papers.</div>`
      : trend.slice(0, 8).map(t => `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #0a0a12">
          <div><div style="font-size:12px;color:#ccc">${t.chapter}</div><div style="font-size:9px;color:#444">${t.subject} · seen in ${t.years.join(", ")}</div></div>
          <div style="font-size:13px;font-weight:800;color:#4ECDC4">${t.count}×</div>
        </div>`).join("")
    }
  </div>`;
}

if (typeof window !== "undefined") {
  Object.assign(window, { getPyqTrend, renderPyqTrendSection });
}

// ══════════════════════════════════════════════════════════════
// ATTEMPT STRATEGY SIMULATOR — shared across JEE / NEET
// NEET and JEE Mains both use +4 for correct, -1 for wrong, 0 for
// unattempted (publicly documented, standard exam format — not
// something that changes year to year). This module doesn't touch
// scoring during the quiz itself; it only simulates what the score
// WOULD have been under different skip strategies, using confidence
// levels the student tagged per question ('sure' | 'unsure' | 'guess').
// ══════════════════════════════════════════════════════════════

export const MARKING_SCHEMES = {
  neet: { correct: 4, wrong: -1, skip: 0 },
  jee:  { correct: 4, wrong: -1, skip: 0 },
};

/**
 * @param {Array} questions   quiz questions, each with `.answer` (correct index)
 * @param {Array} userAnswers per-question selected index (or undefined/null if unattempted)
 * @param {Array} confidence  per-question 'sure'|'unsure'|'guess'
 * @param {string} examTag    'neet' | 'jee'
 */
export function simulateStrategies(questions, userAnswers, confidence, examTag){
  const scheme = MARKING_SCHEMES[examTag] || MARKING_SCHEMES.neet;

  function scoreFor(skipPredicate){
    let score = 0, attempted = 0, correct = 0, wrong = 0, skipped = 0;
    questions.forEach((q, i) => {
      const ua = userAnswers[i];
      const wasAnswered = ua !== null && ua !== undefined;
      const shouldSkip = !wasAnswered || skipPredicate(confidence[i]);
      if (shouldSkip){ skipped++; score += scheme.skip; return; }
      attempted++;
      if (ua === q.answer){ correct++; score += scheme.correct; }
      else { wrong++; score += scheme.wrong; }
    });
    return { score, attempted, correct, wrong, skipped, maxScore: questions.length * scheme.correct };
  }

  const strategies = {
    attemptAll:        { label: "Attempt Everything",        ...scoreFor(() => false) },
    skipGuesses:        { label: "Skip \"Guess\" Answers",     ...scoreFor(c => c === "guess") },
    skipUnsureAndGuess: { label: "Skip Unsure + Guess",        ...scoreFor(c => c === "guess" || c === "unsure") },
  };

  let best = "attemptAll";
  Object.keys(strategies).forEach(k => { if (strategies[k].score > strategies[best].score) best = k; });

  return { strategies, recommended: best, scheme };
}

/** Comparison card for the quiz results screen. */
export function renderStrategyComparisonCard(sim){
  const order = ["attemptAll", "skipGuesses", "skipUnsureAndGuess"];
  return `<div class="card" style="margin-bottom:16px;border-color:#4ECDC433">
    <div class="section-label" style="margin-bottom:4px">🎯 Attempt Strategy — What If?</div>
    <div style="font-size:10px;color:#555;margin-bottom:14px">Same quiz, scored under NEET/JEE marking (+${sim.scheme.correct} / ${sim.scheme.wrong}) if you'd skipped low-confidence answers instead of guessing.</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${order.map(k => {
        const s = sim.strategies[k];
        const isBest = k === sim.recommended;
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:10px;background:${isBest ? "#0a1a1a" : "#0f0f18"};border:1px solid ${isBest ? "#4ECDC455" : "#1e1e2e"}">
          <div>
            <div style="font-size:12px;font-weight:600;color:${isBest ? "#4ECDC4" : "#ccc"}">${isBest ? "⭐ " : ""}${s.label}</div>
            <div style="font-size:10px;color:#555;margin-top:2px">${s.correct}✓ · ${s.wrong}✗ · ${s.skipped} skipped</div>
          </div>
          <div style="font-size:18px;font-weight:800;color:${isBest ? "#4ECDC4" : "#888"}">${s.score}<span style="font-size:10px;color:#444">/${s.maxScore}</span></div>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

/** Small 3-button confidence picker shown after selecting an answer, before it's revealed. */
export function renderConfidencePicker(){
  return `<div style="padding:14px;background:#0a0a12;border-radius:10px;margin-bottom:16px">
    <div style="font-size:12px;color:#888;margin-bottom:10px">How confident were you in that answer?</div>
    <div style="display:flex;gap:8px">
      <button onclick="setConfidence('sure')" style="flex:1;padding:10px;border-radius:8px;border:1px solid #06D6A044;background:#0a1a0a;color:#06D6A0;font-size:12px;font-family:inherit;cursor:pointer">😎 Sure</button>
      <button onclick="setConfidence('unsure')" style="flex:1;padding:10px;border-radius:8px;border:1px solid #FFE66D44;background:#1a1200;color:#FFE66D;font-size:12px;font-family:inherit;cursor:pointer">🤔 Unsure</button>
      <button onclick="setConfidence('guess')" style="flex:1;padding:10px;border-radius:8px;border:1px solid #FF6B3544;background:#2a0a0a;color:#FF6B35;font-size:12px;font-family:inherit;cursor:pointer">🎲 Guess</button>
    </div>
  </div>`;
}

if (typeof window !== "undefined") {
  Object.assign(window, { MARKING_SCHEMES, simulateStrategies, renderStrategyComparisonCard, renderConfidencePicker });
}

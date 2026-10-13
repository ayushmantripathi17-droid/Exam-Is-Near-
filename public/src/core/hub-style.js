// Modern, theme-aware skin for the NEET/JEE Hub tools (Mistakes, Weightage, Rank,
// OMR, SRS, Mock Test, Difficulty, Percentile). Only visual properties are changed.
const css = `
/* readable text for the old hard-coded dim greys (dark theme) */
[data-theme="dark"] [style*=";color:#444"],[data-theme="dark"] [style^="color:#444"]{color:#8a8fa3!important}
[data-theme="dark"] [style*=";color:#333"],[data-theme="dark"] [style^="color:#333"]{color:#7a7f94!important}
[data-theme="dark"] [style*=";color:#2a2a3a"],[data-theme="dark"] [style*=";color:#222"]{color:#6d7287!important}
[data-theme="dark"] [style*=";color:#555"],[data-theme="dark"] [style^="color:#555"]{color:#8f94a8!important}

.exam-section-hdr{gap:14px;margin-bottom:20px}
.exam-icon-wrap{width:46px;height:46px;border-radius:15px;font-size:22px;box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 12%,transparent)}
.feat-card{border-radius:20px;padding:20px;border:1px solid var(--border-2);background:var(--glass-bg,var(--surface));transition:transform .2s,box-shadow .2s,border-color .2s}
.feat-card:hover{transform:translateY(-2px);box-shadow:0 14px 30px -18px rgba(0,0,0,.45)}
[data-theme="light"] .feat-card{box-shadow:0 1px 2px rgba(30,30,60,.06),0 10px 26px -14px rgba(30,30,60,.2)}
.section-label{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--text-5)}

.btn-gold{border-radius:13px;padding:11px 22px;font-weight:800;color:#12100a;box-shadow:0 10px 22px -10px #FFB700aa;transition:transform .2s,box-shadow .2s}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 14px 26px -10px #FFB700cc}
.btn-ghost{border-radius:13px;font-weight:700;transition:.2s}
.btn-ghost:hover{border-color:var(--gold,#FFE66D);transform:translateY(-1px)}
.btn-danger{border-radius:11px;border-color:color-mix(in srgb,#ff5c5c 35%,var(--border-2));color:#e5484d;font-weight:700}
.btn-danger:hover{background:#ff5c5c14;border-color:#ff5c5c}
.pill-btn{padding:8px 15px;border-radius:99px;font-weight:700;font-size:11.5px}
.pill-btn:hover{border-color:var(--gold,#FFE66D);color:var(--text)}

.exam-tabs{gap:6px;padding:5px;border-radius:99px;border:1px solid var(--border-2);background:color-mix(in srgb,var(--text) 5%,transparent)}
.exam-tab{border-radius:99px;font-weight:800;transition:.2s}
.exam-tab.active,.exam-tab.on{box-shadow:0 8px 18px -8px currentColor}

.stat-box{border-radius:16px;border:1px solid var(--border-2);transition:transform .2s}
.stat-box:hover{transform:translateY(-2px)}

.mistake-card{border-radius:18px;padding:16px;transition:transform .2s,box-shadow .2s;animation:eisRise .35s ease both}
.mistake-card:hover{transform:translateY(-2px);box-shadow:0 12px 26px -16px #FF6B35}
[data-theme="light"] .mistake-card{background:#fff6f1;border-color:#ff6b3540}
.mistake-tag{border-radius:99px;padding:3px 10px;font-size:9.5px}
.mistake-q{font-size:13px;color:var(--text-2);line-height:1.65}
.mistake-ans{border-radius:11px;padding:8px 12px;font-size:12px}
[data-theme="light"] .mistake-ans{background:#ecfdf5;color:#047857;border-color:#05966933}

.wtg-row{border-radius:12px;transition:background .15s}
.wtg-row:hover{background:color-mix(in srgb,var(--text) 5%,transparent)}
.wtg-bar{border-radius:99px;overflow:hidden;background:color-mix(in srgb,var(--text) 8%,transparent)}
.wtg-fill{border-radius:99px;transition:width .8s cubic-bezier(.2,.8,.2,1)}

.rank-result,.pct-result{border-radius:22px;border:1px solid var(--border-2);background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--gold,#FFE66D) 14%,transparent),transparent 70%),var(--glass-bg,var(--surface))}
.rank-big,.pct-big{font-weight:800;letter-spacing:-2px;color:var(--gold,#FFE66D)}
.college-chip{border-radius:99px;font-weight:700;transition:.2s}
.college-chip:hover{transform:translateY(-1px)}

.omr-grid{gap:6px}
.omr-q{border-radius:11px;padding:5px 7px;transition:background .15s}
.omr-q:hover{background:color-mix(in srgb,var(--text) 5%,transparent)}
.omr-bubble{width:22px;height:22px;font-size:9px;font-weight:800;color:var(--text-5);transition:transform .15s,background .15s,border-color .15s}
.omr-bubble:hover{transform:scale(1.15)}
.omr-bubble.filled,.omr-bubble.sel,.omr-bubble.on{background:linear-gradient(135deg,#FFE66D,#ffb700);border-color:#ffb700;color:#12100a}

.srs-card-front,.srs-card-back{border-radius:22px;border:1px solid var(--border-2);background:radial-gradient(circle at 50% 0%,color-mix(in srgb,#4ECDC4 14%,transparent),transparent 70%),var(--glass-bg,var(--surface))}
.srs-again,.srs-hard,.srs-good,.srs-easy{border-radius:14px;font-weight:800;transition:transform .2s,box-shadow .2s}
.srs-again:hover,.srs-hard:hover,.srs-good:hover,.srs-easy:hover{transform:translateY(-2px)}
.srs-chip{border-radius:99px;font-weight:700}

.mock-timer{border-radius:99px;font-weight:800;letter-spacing:.5px;font-family:'JetBrains Mono',monospace}
.mock-q-card{border-radius:20px;border:1px solid var(--border-2);background:var(--glass-bg,var(--surface))}
.mock-opt{border-radius:14px;border:1.5px solid var(--border-2);transition:transform .15s,border-color .15s,background .15s}
.mock-opt:hover{transform:translateX(3px);border-color:var(--gold,#FFE66D)}
.mock-opt-letter{border-radius:9px;font-weight:800}

.diff-chip{border-radius:99px;font-weight:700;transition:.2s}
.diff-chip:hover{transform:translateY(-1px)}
.diff-label{font-weight:800}
`;
const st = document.createElement("style");
st.id = "eis-hub-style";
st.textContent = css;
document.head.appendChild(st);

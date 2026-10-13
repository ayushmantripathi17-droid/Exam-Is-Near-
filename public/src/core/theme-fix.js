// Day/Night theme polish: (1) pill-style toggle, (2) light-theme overrides for
// hard-coded dark inline colours used by the render functions, (3) header no
// longer sticks over the page content.
const TXT = { "#EDE8E0": "--text", "#ede8e0": "--text", "#ccc": "--text-2", "#bbb": "--text-3", "#aaa": "--text-3",
  "#888": "--text-4", "#777": "--text-4", "#666": "--text-5", "#555": "--text-6", "#444": "--text-7", "#333": "--text-8", "#d4c8a8": "--text-2" };
const BG = { "#0f0f18": "--surface", "#0a0a12": "--bg-alt", "#08080f": "--bg", "#111": "--surface-4", "#0a0a14": "--bg-alt",
  "#1a1a24": "--surface-3", "#1a1a28": "--surface-3", "#1a1a2a": "--surface-3", "#1e1e1e": "--surface-3", "#222": "--surface-3" };
const BORDER = { "#1e1e2e": "--border", "#2a2a3a": "--border-2", "#222": "--border-2", "#333": "--border-2", "#3a3a4a": "--border-3" };

const ACC = { "#FFE66D": "#b45309", "#06D6A0": "#059669", "#4ECDC4": "#0e8f86", "#C77DFF": "#9333ea", "#FF6B35": "#e2531a" };

function build() {
  const L = '[data-theme="light"] ';
  let css = "";
  for (const [hex, v] of Object.entries(TXT))
    css += `${L}[style*=";color:${hex}"],${L}[style^="color:${hex}"],${L}[style*="; color:${hex}"]{color:var(${v})!important}\n`;
  for (const [hex, v] of Object.entries(BG))
    css += `${L}[style*="background:${hex}"],${L}[style*="background: ${hex}"]{background:var(${v})!important}\n`;
  for (const [hex, v] of Object.entries(BORDER))
    css += `${L}[style*="solid ${hex}"]{border-color:var(${v})!important}\n`;
  for (const [hex, to] of Object.entries(ACC))
    for (const h of [hex, hex.toLowerCase()])
      css += `${L}[style*=";color:${h}"],${L}[style^="color:${h}"],${L}[style*="; color:${h}"]{color:${to}!important}\n`;
  return css;
}

const css = `
.header{position:relative!important}

/* ── Day / Night pill toggle ── */
.theme-toggle{width:68px!important;height:36px!important;border-radius:99px!important;padding:3px!important;font-size:0!important;
  justify-content:flex-start!important;overflow:hidden;bottom:18px;right:18px}
.theme-toggle .tt-ic{position:absolute;top:0;width:34px;height:36px;display:grid;place-items:center;font-size:15px;z-index:2;
  transition:opacity .25s,transform .35s;pointer-events:none}
.theme-toggle .tt-sun{left:1px}.theme-toggle .tt-moon{right:1px}
.theme-toggle .tt-thumb{position:absolute;top:3px;left:3px;width:30px;height:30px;border-radius:50%;z-index:1;
  background:linear-gradient(135deg,#FFE66D,#ffb700);box-shadow:0 3px 10px rgba(255,183,0,.45);
  transition:transform .35s cubic-bezier(.4,1.4,.5,1),background .3s}
[data-theme="dark"] .theme-toggle .tt-thumb{transform:translateX(32px);background:linear-gradient(135deg,#8a8fff,#5a5fd8);box-shadow:0 3px 10px rgba(90,95,216,.5)}
[data-theme="dark"] .theme-toggle .tt-sun{opacity:.45}
[data-theme="light"] .theme-toggle .tt-moon{opacity:.45}
@media(max-width:700px){.theme-toggle{bottom:78px!important;right:14px!important;width:62px!important;height:34px!important}
  .theme-toggle .tt-ic{width:31px;height:34px}.theme-toggle .tt-thumb{width:28px;height:28px}
  [data-theme="dark"] .theme-toggle .tt-thumb{transform:translateX(28px)}}

/* ═══ LIGHT THEME: contrast + depth ═══ */
[data-theme="light"]{--gold:#b45309;--gold-2:#92400e;--glass-bg:rgba(255,255,255,.96);--glass-bg-strong:rgba(255,255,255,.98);--border-2:#c6cde2;--border-3:#b4bcd6;--text-6:#6b7188;--text-7:#7c8296}
[data-theme="light"] .clock-display{color:#b45309;text-shadow:none}
[data-theme="light"] .date-display{color:var(--text-4)}
[data-theme="light"] .header-sub{color:var(--text-4)}
[data-theme="light"] .nav-bar{background:#fff;border-color:var(--border-2);box-shadow:0 6px 20px -12px rgba(30,30,60,.25)}
[data-theme="light"] .nav-pill{color:var(--text-3)}
[data-theme="light"] .nav-pill:hover{color:var(--text)}
[data-theme="light"] .nav-pill.active{color:#1a1200!important;font-weight:800}
[data-theme="light"] .pro-badge{color:#92400e;background:#fff7e0;border-color:#b4530944;box-shadow:none}
[data-theme="light"] :is(.ov-card,.ov-sub,.fm-card,.fm-stat,.fm-drop,.st-unit,.st-head,.al-card,.al-item,.fc-sub,.fc-stat,.fc-log,.qz-card,.qz-log,.an-card,.an-stat,.lg-card,.lg-item,.sy-card,.pf-card,.pf-stat,.ab-card,.pm-card,.hb-f,.hb-hero,.ov-next){box-shadow:0 1px 2px rgba(30,30,60,.06),0 10px 26px -14px rgba(30,30,60,.2)}
[data-theme="light"] :is(.ov-stat,.pm-pre,.lg-mood,.fc-btn,.qz-btn,.al-btn,.pm-btn,.sy-btn,.fm-btn,.ab-btn){box-shadow:0 1px 2px rgba(30,30,60,.05)}
[data-theme="light"] .ov-ring svg circle:first-child{color:rgba(30,30,60,.1)!important}
[data-theme="light"] .ov-day-b,[data-theme="light"] .an-cell,[data-theme="light"] .lg-mood{border-color:var(--border)}
[data-theme="light"] .ov-day-b.on,[data-theme="light"] .an-cell.on{border-color:transparent}

/* ═══ MODERN ICONS ═══ */
.eic{display:inline-flex;width:1.18em;height:1.18em;vertical-align:-.22em;flex-shrink:0;transition:transform .25s cubic-bezier(.3,1.4,.5,1)}
.eic svg{width:100%;height:100%;display:block}
.nav-pill .eic{margin-right:5px;width:1.3em;height:1.3em;vertical-align:-.3em}
.nav-pill:hover .eic{transform:translateY(-2px) scale(1.15) rotate(-6deg)}
.nav-pill.active .eic{animation:eisPop .45s cubic-bezier(.3,1.5,.5,1)}
@keyframes eisPop{0%{transform:scale(.4) rotate(-30deg);opacity:0}100%{transform:none;opacity:1}}
.theme-toggle .tt-ic{color:var(--text-5)}
[data-theme="light"] .theme-toggle .tt-sun{color:#12100a;opacity:1}
[data-theme="dark"] .theme-toggle .tt-moon{color:#fff;opacity:1}
.theme-toggle:hover .tt-thumb{filter:brightness(1.1)}
.empty-state .eic,.fc-empty .e .eic,.qz-empty .e .eic,.al-empty .eic{width:1.1em;height:1.1em;opacity:.55}

/* ═══ ANIMATION ═══ */
@keyframes eisRise{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}
@keyframes eisShimmer{0%{transform:translateX(-120%)}100%{transform:translateX(220%)}}
@keyframes eisGlow{0%,100%{filter:drop-shadow(0 0 6px rgba(255,230,109,.35))}50%{filter:drop-shadow(0 0 16px rgba(255,160,60,.65))}}
body.eis-nav .fade-in>*{animation:eisRise .55s cubic-bezier(.2,.8,.2,1) both}
body.eis-nav .fade-in>*:nth-child(1){animation-delay:.02s}
body.eis-nav .fade-in>*:nth-child(2){animation-delay:.08s}
body.eis-nav .fade-in>*:nth-child(3){animation-delay:.14s}
body.eis-nav .fade-in>*:nth-child(4){animation-delay:.2s}
body.eis-nav .fade-in>*:nth-child(5){animation-delay:.26s}
body.eis-nav .fade-in>*:nth-child(6){animation-delay:.32s}
body.eis-nav .fade-in>*:nth-child(n+7){animation-delay:.38s}
/* card entrance only on navigation (stops flicker while typing / toggling) */
body:not(.eis-nav) :is(.ov-sub,.fm-card,.st-unit,.fc-sub,.lg-item,.hb-f){animation:none!important}
.header img{animation:eisGlow 4s ease-in-out infinite}
.ab-logo img{width:100%;height:100%;object-fit:contain;animation:float 3.2s ease-in-out infinite;filter:drop-shadow(0 6px 14px rgba(255,160,60,.45))}
:is(.ov-bar,.st-bar,.an-bar,.pf-bar,.fc-bar,.qz-bar,.ov-gbar,.st-ubar,.pm-mini,.qz-mini){position:relative;overflow:hidden}
:is(.ov-bar,.st-bar,.an-bar,.pf-bar,.fc-bar,.qz-bar,.ov-gbar,.st-ubar) i{position:relative;overflow:hidden}
:is(.ov-bar,.st-bar,.an-bar,.pf-bar,.fc-bar,.qz-bar,.ov-gbar,.st-ubar) i:after{content:"";position:absolute;inset:0;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent);animation:eisShimmer 2.6s ease-in-out infinite}
.ov-sub-ic,.fc-ic,.hb-ic,.al-ic,.pm-row-ic{transition:transform .3s cubic-bezier(.3,1.4,.5,1)}
.ov-sub:hover .ov-sub-ic,.fc-sub:hover .fc-ic,.hb-f:hover .hb-ic,.al-item:hover .al-ic{transform:scale(1.12) rotate(-6deg)}
button:active:not(:disabled){transform:scale(.97)}
.ov-stat,.an-stat,.pf-stat,.fc-stat{transition:transform .25s,box-shadow .25s}
.ov-stat:hover,.an-stat:hover,.fc-stat:hover{transform:translateY(-3px)}
.ov-ring svg circle:nth-child(2){filter:drop-shadow(0 0 6px rgba(255,160,60,.5))}
@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}

/* ── Light-theme overrides for hard-coded dark inline colours ── */
${build()}
[data-theme="light"] .card,[data-theme="light"] .stat-box{box-shadow:var(--shadow-soft)}
[data-theme="light"] input,[data-theme="light"] select,[data-theme="light"] textarea{color:var(--text)}
`;

const st = document.createElement("style");
st.id = "eis-theme-fix";
st.textContent = css;
document.head.appendChild(st);

// Page-transition trigger: animate content only when the view changes
let _navT;
function pulseNav(){
  document.body.classList.add("eis-nav");
  clearTimeout(_navT);
  _navT = setTimeout(() => document.body.classList.remove("eis-nav"), 1000);
}
document.addEventListener("click", (e) => {
  if (e.target.closest && e.target.closest('[onclick*="switchView"],[onclick*="showCourseSelector"],.nav-pill')) pulseNav();
}, true);
if (document.body) pulseNav(); else document.addEventListener("DOMContentLoaded", pulseNav);

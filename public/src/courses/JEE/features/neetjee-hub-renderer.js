import { CourseSelectorShared } from "../../../core/course-selector.js";
import { njState } from "../../../shared/exam-hub-state.js";
import { renderMistakes, renderOMR, renderRankPredictor, renderWeightage } from "./neetjee-features-1to4.js";
import { getDueSRSCards, renderDifficulty, renderPercentile, renderSRS } from "./neetjee-features-5to8.js";

// ══════════════════════════════════════════════════════════════
// exam: 'neet'=NEET only, 'jee'=JEE only, 'both'=shared
const NJ_FEATURES = [
  {id:'weightage', icon:'📊', label:'Weightage',    desc:'Chapter-wise marks distribution',   color:'#FFE66D', bg:'#1a1200', exam:'both'},
  {id:'rank',      icon:'🎯', label:'Rank Predictor', desc:'NEET AIR & JEE percentile from marks (2025 data)', color:'#06D6A0', bg:'#061208', exam:'neet'},
  {id:'percentile',icon:'⚡', label:'JEE Percentile',desc:'Score to percentile & NIT finder',  color:'#4ECDC4', bg:'#041214', exam:'jee'},
  {id:'omr',       icon:'📋', label:'OMR Sheet',    desc:'Practice marking 45/180 questions',  color:'#FFE66D', bg:'#141000', exam:'both'},
  {id:'mistakes',  icon:'📝', label:'Mistakes',     desc:'Log & review your wrong answers',    color:'#FF6B35', bg:'#150600', exam:'both'},
  {id:'srs',       icon:'🔁', label:'Flashcards+',  desc:'Spaced repetition card review',      color:'#C77DFF', bg:'#110820', exam:'both'},
  {id:'difficulty',icon:'🌡️', label:'Heatmap',     desc:'Rate topics Easy/Medium/Hard',       color:'#FF6B35', bg:'#150800', exam:'both'},
];

function renderNeetJee(){
  // NFSU users should not see this section
  if(CourseSelectorShared.activeCourse === 'nfsu' || CourseSelectorShared.activeCourse === 'nfsu1' || CourseSelectorShared.activeCourse === 'nfsu3' || CourseSelectorShared.activeCourse === 'cbse10' || CourseSelectorShared.activeCourse === 'cbse12' || CourseSelectorShared.activeCourse === null){
    const courseLabel = CourseSelectorShared.activeCourse === 'cbse10' ? 'Class 10' : CourseSelectorShared.activeCourse === 'cbse12' ? 'Class 12' : 'NFSU';
    return `<div class="fade-in" style="text-align:center;padding:48px 20px">
      <div style="font-size:48px;margin-bottom:16px">🎓</div>
      <div style="font-size:18px;font-weight:bold;color:#ccc;margin-bottom:8px">This section is for NEET / JEE</div>
      <div style="font-size:13px;color:#555;margin-bottom:24px;line-height:1.8">You're on the ${courseLabel} course.<br>Switch to NEET or JEE to access these tools.</div>
      <button class="btn-gold" onclick="showCourseSelector()" style="padding:12px 28px">🎯 Switch Course</button>
    </div>`;
  }

  const tab = njState.tab;

  // Auto-set njState.exam from activeCourse for proper defaults
  if(CourseSelectorShared.activeCourse === 'jee') njState.exam = 'jee';
  else if(CourseSelectorShared.activeCourse === 'neet') njState.exam = 'neet';

  if(tab==='mistakes')  return wrapNJ(renderMistakes(), tab);
  if(tab==='weightage') return wrapNJ(renderWeightage(), tab);
  if(tab==='rank')      return wrapNJ(renderRankPredictor(), tab);
  if(tab==='omr')       return wrapNJ(renderOMR(), tab);
  if(tab==='srs')       return wrapNJ(renderSRS(), tab);
  if(tab==='difficulty')return wrapNJ(renderDifficulty(), tab);
  if(tab==='percentile')return wrapNJ(renderPercentile(), tab);

  // Determine which course is active for filtering
  const isJEE  = CourseSelectorShared.activeCourse === 'jee';
  const isNEET = CourseSelectorShared.activeCourse === 'neet';

  // Filter features based on active course
  const visibleFeatures = NJ_FEATURES.filter(f => {
    if(f.exam === 'both') return true;
    if(f.exam === 'neet' && isNEET) return true;
    if(f.exam === 'jee'  && isJEE)  return true;
    // If neither NEET nor JEE course active (e.g. NFSU), show all
    if(!isNEET && !isJEE) return true;
    return false;
  });

  const mkBadge = (id) => {
    if(id==='mistakes') return `<span style="font-size:9px;background:#FF6B3522;color:#FF6B35;border:1px solid #FF6B3333;border-radius:8px;padding:1px 6px;font-weight:700">${njState.mistakes.length}</span>`;
    if(id==='srs') return `<span style="font-size:9px;background:#C77DFF22;color:#C77DFF;border:1px solid #C77DFF33;border-radius:8px;padding:1px 6px;font-weight:700">${getDueSRSCards().length} due</span>`;
    return '';
  };

  // Hero styling based on course
  const heroGrad  = isJEE  ? 'linear-gradient(90deg,#4ECDC4,#06D6A0)'
                  : isNEET ? 'linear-gradient(90deg,#06D6A0,#FFE66D)'
                  :          'linear-gradient(90deg,#FFE66D,#06D6A0)';
  const heroTitle = isJEE  ? '⚡ JEE Hub'
                  : isNEET ? '🩺 NEET Hub'
                  :          'NEET · JEE Hub';
  const heroSub   = isJEE  ? 'Specialised tools for JEE Mains & Advanced preparation'
                  : isNEET ? 'Specialised tools for NEET UG preparation'
                  :          'Specialised tools for medical & engineering exam prep';

  const css=`<style>
.hb{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);max-width:820px;margin:0 auto}
.hb *{box-sizing:border-box}
.hb-hero{position:relative;overflow:hidden;padding:24px 22px;margin-bottom:16px;border-radius:24px;border:1px solid var(--line);background:radial-gradient(circle at 100% 0%,color-mix(in srgb,${isJEE?"#4ECDC4":"#06D6A0"} 22%,transparent),transparent 60%),radial-gradient(circle at 0% 100%,color-mix(in srgb,#FFE66D 12%,transparent),transparent 55%),var(--glass-bg,var(--surf))}
.hb-t{font-size:28px;font-weight:800;letter-spacing:-.8px;background:${heroGrad};-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;line-height:1.1}
.hb-s{font-size:13px;color:var(--mute);margin:8px 0 16px}
.hb-tags{display:flex;gap:8px;flex-wrap:wrap}
.hb-tag{border:1px solid;border-radius:99px;padding:5px 13px;font-size:11.5px;font-weight:800}
.hb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
.hb-f{--c:#FFE66D;position:relative;overflow:hidden;cursor:pointer;padding:18px;border-radius:20px;border:1px solid var(--line);background:radial-gradient(circle at 100% 0%,color-mix(in srgb,var(--c) 16%,transparent),transparent 62%),var(--glass-bg,var(--surf));transition:transform .2s,border-color .2s,box-shadow .2s;animation:hbIn .35s ease both}
.hb-f:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--c) 60%,var(--line));box-shadow:0 14px 30px -14px color-mix(in srgb,var(--c) 60%,transparent)}
@keyframes hbIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.hb-fh{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}
.hb-ic{width:48px;height:48px;border-radius:15px;display:grid;place-items:center;font-size:24px;background:color-mix(in srgb,var(--c) 16%,transparent)}
.hb-f b{display:block;font-size:15px;font-weight:800;color:var(--c);margin-bottom:4px}
.hb-f span.d{font-size:12px;color:var(--mute);line-height:1.55}
.hb-bd{font-size:10px;font-weight:800;border-radius:99px;padding:3px 9px;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);border:1px solid color-mix(in srgb,var(--c) 30%,transparent)}
</style>`;
  const mkBadge2 = (id) => {
    if(id==='mistakes') return `<span class="hb-bd">${njState.mistakes.length}</span>`;
    if(id==='srs') return `<span class="hb-bd">${getDueSRSCards().length} due</span>`;
    return '';
  };
  return `${css}<div class="hb fade-in">
    <div class="hb-hero">
      <div class="hb-t">${heroTitle}</div>
      <div class="hb-s">${heroSub}</div>
      <div class="hb-tags">
        ${isNEET||(!isJEE&&!isNEET)?`<span class="hb-tag" style="color:#06D6A0;border-color:#06D6A055;background:#06D6A014">🩺 NEET 2026</span>`:''}
        ${isJEE||(!isJEE&&!isNEET)?`<span class="hb-tag" style="color:#4ECDC4;border-color:#4ECDC455;background:#4ECDC414">⚡ JEE 2026</span>`:''}
      </div>
    </div>
    <div class="hb-grid">
      ${visibleFeatures.map((f,i)=>`
        <div class="hb-f" style="--c:${f.color};animation-delay:${i*0.05}s" onclick="njState.from='';njState.tab='${f.id}';switchView('neetjee')">
          <div class="hb-fh"><div class="hb-ic">${f.icon}</div>${mkBadge2(f.id)}</div>
          <b>${f.label}</b>
          <span class="d">${f.desc}</span>
        </div>`).join('')}
    </div>
  </div>`;
}


// ══════════════════════════════════════════════════════════════
// Main-page (Overview) toolkit — every hub tool, only for NEET / JEE courses
function renderHubToolkit(){
  const ac = CourseSelectorShared.activeCourse;
  const isJEE = ac === 'jee', isNEET = ac === 'neet';
  if(!isJEE && !isNEET) return '';
  const feats = NJ_FEATURES.filter(f => f.exam === 'both' || (f.exam === 'neet' && isNEET) || (f.exam === 'jee' && isJEE));
  const title = isJEE ? 'JEE Toolkit' : 'NEET Toolkit';
  const accent = isJEE ? '#4ECDC4' : '#06D6A0';
  const badge = (id) => {
    if(id === 'mistakes'){ const n = (njState.mistakes||[]).length; return n ? `<span class="tk-bd">${n} logged</span>` : ''; }
    if(id === 'srs'){ const n = getDueSRSCards().length; return n ? `<span class="tk-bd due">${n} due</span>` : ''; }
    return '';
  };
  const css = `<style>
.tk{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);margin:6px 0 24px}
.tk *{box-sizing:border-box}
.tk-h{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.tk-h h3{margin:0;font-size:16px;font-weight:800;color:var(--txt);letter-spacing:-.3px;display:flex;align-items:center;gap:9px}
.tk-h h3 i{font-style:normal;font-size:10px;font-weight:800;letter-spacing:1px;padding:3px 10px;border-radius:99px;color:${accent};background:color-mix(in srgb,${accent} 14%,transparent);border:1px solid color-mix(in srgb,${accent} 35%,transparent)}
.tk-h p{margin:4px 0 0;font-size:12px;color:var(--mute)}
.tk-all{border:1px solid var(--line);background:var(--surf);color:var(--text-3,#aaa);border-radius:99px;padding:7px 14px;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;transition:.2s}
.tk-all:hover{border-color:${accent};color:var(--txt)}
.tk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}
@media(max-width:520px){.tk-grid{grid-template-columns:1fr 1fr;gap:8px}}
.tk-c{--c:#FFE66D;position:relative;overflow:hidden;cursor:pointer;padding:14px;border-radius:18px;border:1px solid var(--line);background:radial-gradient(circle at 100% 0%,color-mix(in srgb,var(--c) 15%,transparent),transparent 62%),var(--glass-bg,var(--surf));transition:transform .2s,border-color .2s,box-shadow .2s;animation:tkIn .35s ease both}
.tk-c:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--c) 60%,var(--line));box-shadow:0 14px 28px -16px color-mix(in srgb,var(--c) 65%,transparent)}
@keyframes tkIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.tk-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.tk-ic{width:40px;height:40px;border-radius:13px;display:grid;place-items:center;font-size:20px;background:color-mix(in srgb,var(--c) 16%,transparent);transition:transform .3s cubic-bezier(.3,1.4,.5,1)}
.tk-c:hover .tk-ic{transform:scale(1.12) rotate(-6deg)}
.tk-bd{font-size:9.5px;font-weight:800;padding:3px 9px;border-radius:99px;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);border:1px solid color-mix(in srgb,var(--c) 30%,transparent)}
.tk-bd.due{background:#C77DFF22;color:#C77DFF;border-color:#C77DFF44}
.tk-c b{display:block;font-size:13.5px;font-weight:800;color:var(--c);margin-bottom:3px}
.tk-c span.d{display:block;font-size:11px;color:var(--mute);line-height:1.5}
</style>`;
  return `${css}<div class="tk">
    <div class="tk-h">
      <div>
        <h3>${title} <i>${feats.length} TOOLS</i></h3>
        <p>Every exam tool, one tap away.</p>
      </div>
      <button class="tk-all" onclick="njState.from='';njState.tab='home';switchView('neetjee')">Open Hub →</button>
    </div>
    <div class="tk-grid">
      ${feats.map((f,i)=>`
      <div class="tk-c" style="--c:${f.color};animation-delay:${i*0.05}s" onclick="njState.from='dashboard';njState.tab='${f.id}';switchView('neetjee')">
        <div class="tk-top"><div class="tk-ic">${f.icon}</div>${badge(f.id)}</div>
        <b>${f.label}</b>
        <span class="d">${f.desc}</span>
      </div>`).join('')}
    </div>
  </div>`;
}

function wrapNJ(inner, tab){
  const fromDash = njState.from === 'dashboard';
  const go = fromDash
    ? "njState.from='';njState.tab='home';switchView('dashboard')"
    : "history.pushState(null,'',location.href);njState.tab='home';switchView('neetjee')";
  return `<div class="fade-in">
    <button onclick="${go}" style="display:inline-flex;align-items:center;gap:7px;border:1px solid var(--border-2,#2a2a3a);background:var(--surface,#0f0f18);color:var(--text-3,#aaa);padding:9px 15px;border-radius:12px;font-weight:700;font-size:12.5px;font-family:inherit;cursor:pointer;margin-bottom:16px">← Back to ${fromDash?'Overview':'Hub'}</button>
    ${inner}
  </div>`;
}

export { NJ_FEATURES, renderNeetJee, renderHubToolkit, wrapNJ };

if (typeof window !== "undefined") {
  Object.assign(window, { renderHubToolkit, NJ_FEATURES, renderNeetJee, wrapNJ });
}

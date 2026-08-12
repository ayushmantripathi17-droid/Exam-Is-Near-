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
  if(activeCourse === 'nfsu' || activeCourse === 'nfsu1' || activeCourse === 'nfsu3' || activeCourse === 'cbse10' || activeCourse === 'cbse12' || activeCourse === null){
    const courseLabel = activeCourse === 'cbse10' ? 'Class 10' : activeCourse === 'cbse12' ? 'Class 12' : 'NFSU';
    return `<div class="fade-in" style="text-align:center;padding:48px 20px">
      <div style="font-size:48px;margin-bottom:16px">🎓</div>
      <div style="font-size:18px;font-weight:bold;color:#ccc;margin-bottom:8px">This section is for NEET / JEE</div>
      <div style="font-size:13px;color:#555;margin-bottom:24px;line-height:1.8">You're on the ${courseLabel} course.<br>Switch to NEET or JEE to access these tools.</div>
      <button class="btn-gold" onclick="showCourseSelector()" style="padding:12px 28px">🎯 Switch Course</button>
    </div>`;
  }

  const tab = njState.tab;

  // Auto-set njState.exam from activeCourse for proper defaults
  if(activeCourse === 'jee') njState.exam = 'jee';
  else if(activeCourse === 'neet') njState.exam = 'neet';

  if(tab==='mistakes')  return wrapNJ(renderMistakes(), tab);
  if(tab==='weightage') return wrapNJ(renderWeightage(), tab);
  if(tab==='rank')      return wrapNJ(renderRankPredictor(), tab);
  if(tab==='omr')       return wrapNJ(renderOMR(), tab);
  if(tab==='srs')       return wrapNJ(renderSRS(), tab);
  if(tab==='difficulty')return wrapNJ(renderDifficulty(), tab);
  if(tab==='percentile')return wrapNJ(renderPercentile(), tab);

  // Determine which course is active for filtering
  const isJEE  = activeCourse === 'jee';
  const isNEET = activeCourse === 'neet';

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

  return `<div class="fade-in">
    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#0f0f1a,#12101a);border:1px solid #1e1e2e;border-radius:18px;padding:22px;margin-bottom:18px;position:relative;overflow:hidden">
      <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:radial-gradient(circle,#FFE66D08,transparent 70%);pointer-events:none"></div>
      <div style="position:absolute;bottom:-20px;left:-20px;width:100px;height:100px;background:radial-gradient(circle,#06D6A008,transparent 70%);pointer-events:none"></div>
      <div style="font-size:22px;font-weight:800;background:${heroGrad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px">${heroTitle}</div>
      <div style="font-size:12px;color:#444;margin-bottom:16px">${heroSub}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${isNEET||(!isJEE&&!isNEET)?`<div style="background:#06D6A022;border:1px solid #06D6A033;border-radius:8px;padding:6px 12px;font-size:11px;color:#06D6A0;font-weight:600">🩺 NEET 2026</div>`:''}
        ${isJEE||(!isJEE&&!isNEET)?`<div style="background:#4ECDC422;border:1px solid #4ECDC433;border-radius:8px;padding:6px 12px;font-size:11px;color:#4ECDC4;font-weight:600">⚡ JEE 2026</div>`:''}
      </div>
    </div>

    <!-- Feature grid -->
    <div class="grid-2" style="gap:10px">
      ${visibleFeatures.map(f=>`
        <div onclick="njState.tab='${f.id}';switchView('neetjee')"
          style="background:${f.bg};border:1px solid ${f.color}22;border-radius:14px;padding:16px;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden"
          onmouseover="this.style.borderColor='${f.color}55';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.borderColor='${f.color}22';this.style.transform='translateY(0)'">
          <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${f.color}88,transparent)"></div>
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
            <div style="font-size:26px">${f.icon}</div>
            ${mkBadge(f.id)}
          </div>
          <div style="font-size:13px;font-weight:700;color:${f.color};margin-bottom:3px">${f.label}</div>
          <div style="font-size:11px;color:#444;line-height:1.5">${f.desc}</div>
        </div>`).join('')}
    </div>
  </div>`;
}

function wrapNJ(inner, tab){
  return `<div class="fade-in">
    <button onclick="history.pushState(null,'',location.href);njState.tab='home';switchView('neetjee')" style="background:none;border:none;color:#555;font-size:12px;cursor:pointer;padding:0;margin-bottom:14px;display:flex;align-items:center;gap:6px;font-family:inherit;transition:color 0.2s" onmouseover="this.style.color='#ccc'" onmouseout="this.style.color='#555'">
      ← Back to Hub
    </button>
    ${inner}
  </div>`;
}

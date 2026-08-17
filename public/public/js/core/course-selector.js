// ══════════════════════════════════════════════════════════════
// GLOBAL COURSE SELECTOR — orchestrates switching between courses
// ══════════════════════════════════════════════════════════════
// Phase-1 restructuring: extracted verbatim from the original
// public/js/data/subjects.js.
//
// PHASE-2 WIRING: now loaded from index.html (as /js/core/course-selector.js,
// replacing the old /js/courses/registry.js reference) after
// courses/subjects-bridge.js, which supplies SUBJECTS_JEE, SUBJECTS_NEET,
// SUBJECTS_CBSE10, SUBJECTS_NFSU/1/3 and SUBJECT_BY_ID.
//
// This stays GLOBAL, not duplicated per course: it's the mechanism that
// decides which course is active and touches global app state (state.*,
// Firebase sync, view routing) directly, so it inherently needs knowledge
// of every course, not just one.
//
// CBSE11_STREAMS / CBSE12_STREAMS below are the SLIM (id-only) versions —
// full subject content now lives in courses/CBSE/Class 11|12/Syllabus/*.js.
// The SUBJECTS_CBSE11/12 builders further down were still written for the
// pre-split shape (stream.subjects instead of stream.subjectIds), which
// throws as soon as it runs (`x.id` on undefined mid-filter). PATCHED below
// to resolve subjectIds through subjects-bridge.js's SUBJECT_BY_ID instead.
// ══════════════════════════════════════════════════════════════

const CBSE11_STREAMS = {
  "science_pcm": {
    "label": "🔬 Science — PCM (Physics, Chemistry, Maths)",
    "desc": "Physics · Chemistry · Mathematics + English Core",
    "subjectIds": [
      "c11-phy",
      "c11-chem",
      "c11-math",
      "c11-eng"
    ]
  },
  "science_pcb": {
    "label": "🧬 Science — PCB (Physics, Chemistry, Biology)",
    "desc": "Physics · Chemistry · Biology + English Core",
    "subjectIds": [
      "c11-phy",
      "c11-chem",
      "c11-bio",
      "c11-eng"
    ]
  },
  "science_pcmb": {
    "label": "🔭 Science — PCMB (All four)",
    "desc": "Physics · Chemistry · Maths · Biology + English Core",
    "subjectIds": [
      "c11-phy",
      "c11-chem",
      "c11-math",
      "c11-bio",
      "c11-eng"
    ]
  },
  "commerce": {
    "label": "💼 Commerce",
    "desc": "Accountancy · Business Studies · Economics · Maths + English Core",
    "subjectIds": [
      "c11-acc",
      "c11-bs",
      "c11-eco",
      "c11-math",
      "c11-eng"
    ]
  },
  "arts": {
    "label": "🎨 Arts / Humanities",
    "desc": "History · Political Science · Geography · Psychology · Sociology + English Core",
    "subjectIds": [
      "c11-hist",
      "c11-pol",
      "c11-geo",
      "c11-psyc",
      "c11-socio",
      "c11-eng"
    ]
  }
};
const CBSE12_STREAMS = {
  "science_pcm": {
    "label": "🔬 Science — PCM (Physics, Chemistry, Maths)",
    "desc": "Physics · Chemistry · Mathematics + English Core",
    "subjectIds": [
      "c12-phy",
      "c12-chem",
      "c12-math",
      "c12-eng"
    ]
  },
  "science_pcb": {
    "label": "🧬 Science — PCB (Physics, Chemistry, Biology)",
    "desc": "Physics · Chemistry · Biology + English Core",
    "subjectIds": [
      "c12-phy",
      "c12-chem",
      "c12-bio",
      "c12-eng"
    ]
  },
  "science_pcmb": {
    "label": "🔭 Science — PCMB (All four)",
    "desc": "Physics · Chemistry · Maths · Biology + English Core",
    "subjectIds": [
      "c12-phy",
      "c12-chem",
      "c12-math",
      "c12-bio",
      "c12-eng"
    ]
  },
  "commerce": {
    "label": "💼 Commerce",
    "desc": "Accountancy · Business Studies · Economics · Maths + English Core",
    "subjectIds": [
      "c12-acc",
      "c12-bs",
      "c12-eco",
      "c12-math",
      "c12-eng"
    ]
  },
  "arts": {
    "label": "🎨 Arts / Humanities",
    "desc": "History · Political Science · Geography · Psychology · Sociology + English Core",
    "subjectIds": [
      "c12-hist",
      "c12-pol",
      "c12-geo",
      "c12-psyc",
      "c12-socio",
      "c12-eng"
    ]
  }
};

function getCbse11Subjects(){
  // FIX (was returning raw subjectIds strings, not subject objects — every
  // caller expects objects with .id/.units/etc., e.g. getTotalPct()'s
  // s.units.forEach(...) throws "Cannot read properties of undefined
  // (reading 'forEach')" the instant a stream is selected, since a plain
  // string has no .units. Resolve through subjects-bridge.js's
  // _subjectsFromIds()/SUBJECT_BY_ID, same as the SUBJECTS_CBSE11 fallback
  // below already does.
  if(cbse11Stream && CBSE11_STREAMS[cbse11Stream]) return _subjectsFromIds(CBSE11_STREAMS[cbse11Stream].subjectIds);
  return [];
}

function switchCbse11Stream(streamId){
  cbse11Stream = streamId;
  localStorage.setItem("cbse11Stream", streamId);
  activeCourse = 'cbse11';
  localStorage.setItem("activeCourse", "cbse11");
  localStorage.setItem("courseChosen", "1");
  const subs = getCbse11Subjects();
  // FIX: subs is now an array of subject objects (getCbse11Subjects fix
  // above), so activeSubject — which must stay a plain id string, per every
  // s.id===state.activeSubject comparison elsewhere — needs .id here, not
  // the object itself.
  state.activeSubject = subs[0]?.id || "";
  document.getElementById("course-selector-overlay")?.remove();
  showToast("✅ Stream set to " + (CBSE11_STREAMS[streamId]?.label || streamId), "success");
  spawnStars();
  if(state.view === 'neetjee') state.view = 'dashboard';
  clearTimeout(S._timer); S._timer=setTimeout(pushToFirebase,1200);
  switchView(state.view);
}

let cbse12Stream = localStorage.getItem("cbse12Stream") || null;

function getCbse12Subjects(){
  // FIX — see getCbse11Subjects() above; same bug, same fix.
  if(cbse12Stream && CBSE12_STREAMS[cbse12Stream]) return _subjectsFromIds(CBSE12_STREAMS[cbse12Stream].subjectIds);
  return [];
}

function switchCbse12Stream(streamId){
  cbse12Stream = streamId;
  localStorage.setItem("cbse12Stream", streamId);
  activeCourse = 'cbse12';
  localStorage.setItem("activeCourse", "cbse12");
  localStorage.setItem("courseChosen", "1");
  const subs = getCbse12Subjects();
  // FIX — see switchCbse11Stream() above; same reasoning.
  state.activeSubject = subs[0]?.id || "";
  document.getElementById("course-selector-overlay")?.remove();
  showToast("✅ Stream set to " + (CBSE12_STREAMS[streamId]?.label || streamId), "success");
  spawnStars();
  if(state.view === 'neetjee') state.view = 'dashboard';
  clearTimeout(S._timer); S._timer=setTimeout(pushToFirebase,1200);
  switchView(state.view);
}

function renderCbse12StreamSelector(){
  showCourseSelector('cbse');
}

// ── UNIFIED MULTI-STEP COURSE SELECTOR ──────────────────────────────────────
// Step 1: Pick category  (NFSU / CBSE / Competitive)
// Step 2: Pick sub-item  (degree / class / exam)
// Step 3: Pick final     (semester / stream) — only where applicable
// ─────────────────────────────────────────────────────────────────────────────
const COURSE_TREE = [
  {
    id: 'nfsu_group', icon: '🎓', label: 'NFSU',
    desc: 'National Forensic Sciences University',
    children: [
      {
        id: 'nfsu_llb', icon: '⚖️', label: 'B.Sc. LL.B. (Hons.)',
        desc: 'Integrated Law Programme',
        children: [
          { id: 'nfsu3', icon: '3️⃣', label: 'Semester III', desc: 'Law of Crimes · Constitutional Law · Contract · Family Law · Web Programming · OS' },
          { id: 'nfsu',  icon: '2️⃣', label: 'Semester II',  desc: 'C++ · RDBMS · Legal Language · Statistics · Law · Jurisprudence' },
          { id: 'nfsu1', icon: '1️⃣', label: 'Semester I',   desc: 'Legal Methods · Tort & Consumer Law · Computer Organization · C Programming · Discrete Maths' },
        ]
      }
    ]
  },
  {
    id: 'cbse_group', icon: '🏫', label: 'CBSE',
    desc: 'Central Board of Secondary Education',
    children: [
      {
        id: 'cbse10', icon: '📚', label: 'Class 10',
        desc: 'Maths · Science · English · Social Science · Hindi',
        leaf: true
      },
      {
        id: 'cbse11_group', icon: '📗', label: 'Class 11',
        desc: 'Science / Commerce / Arts',
        children: Object.entries(CBSE11_STREAMS).map(([id,s])=>({ id, icon:'📘', label:s.label, desc:s.desc, cbse11stream:true }))
      },
      {
        id: 'cbse12_group', icon: '🎓', label: 'Class 12',
        desc: 'Science / Commerce / Arts',
        children: Object.entries(CBSE12_STREAMS).map(([id,s])=>({ id, icon:'📖', label:s.label, desc:s.desc, cbse12stream:true }))
      }
    ]
  },
  { id: 'jee',  icon: '📐', label: 'JEE (Mains & Advanced)', desc: 'Physics · Chemistry · Mathematics', leaf: true },
  { id: 'neet', icon: '🧬', label: 'NEET UG',               desc: 'Physics · Chemistry · Botany · Zoology', leaf: true },
];

function _csOverlayShell(content, breadcrumb){
  return `<div id="course-selector-overlay" style="position:fixed;inset:0;background:#08080fee;z-index:9990;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);padding:20px">
    <div style="background:#0f0f18;border:1px solid #FFE66D44;border-radius:20px;padding:0;max-width:440px;width:100%;max-height:90vh;display:flex;flex-direction:column;animation:fadeInUp 0.3s ease">
      <div style="padding:22px 24px 16px;border-bottom:1px solid #ffffff08;flex-shrink:0">
        <div style="text-align:center">
          <div style="font-size:32px;margin-bottom:6px">🎯</div>
          <div style="font-size:18px;font-weight:700;color:#FFE66D;margin-bottom:4px">Select Your Course</div>
          <div style="font-size:11px;color:#444;margin-bottom:10px">Choose your exam to get the right subjects & tracking</div>
          ${breadcrumb}
        </div>
      </div>
      <div style="padding:14px 20px;overflow-y:auto;flex:1">${content}</div>
    </div>
  </div>`;
}

function _csBreadcrumb(steps){
  if(!steps.length) return '';
  return `<div style="display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap">
    <span onclick="showCourseSelector()" style="font-size:11px;color:#FFE66D88;cursor:pointer;transition:color 0.15s" onmouseover="this.style.color='#FFE66D'" onmouseout="this.style.color='#FFE66D88'">Home</span>
    ${steps.map((s,i)=>`
      <span style="font-size:11px;color:#333">›</span>
      <span onclick="${s.onclick||''}" style="font-size:11px;color:${i===steps.length-1?'#EDE8E0':'#FFE66D88'};cursor:${s.onclick?'pointer':'default'};transition:color 0.15s"
        ${s.onclick?`onmouseover="this.style.color='#FFE66D'" onmouseout="this.style.color='#FFE66D88'"`:''}>
        ${s.label}
      </span>`).join('')}
  </div>`;
}

function _csBtn(onclick, icon, label, desc, isActive){
  return `<button onclick="${onclick}"
    style="background:${isActive?'#1c1a08':'#0c0c16'};border:1px solid ${isActive?'#FFE66D77':'#ffffff12'};border-radius:12px;padding:13px 16px;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.18s;width:100%;display:flex;align-items:center;gap:13px;position:relative;margin-bottom:8px"
    onmouseover="this.style.background='#13131f';this.style.borderColor='#FFE66D66'"
    onmouseout="this.style.background='${isActive?'#1c1a08':'#0c0c16'}';this.style.borderColor='${isActive?'#FFE66D77':'#ffffff12'}'">
    <span style="font-size:22px;flex-shrink:0">${icon}</span>
    <span style="flex:1;min-width:0">
      <span style="display:block;font-size:13px;font-weight:600;color:#EDE8E0;margin-bottom:2px">${label}</span>
      <span style="display:block;font-size:11px;color:#555;line-height:1.45;white-space:normal">${desc}</span>
    </span>
    ${isActive?`<span style="font-size:9px;color:#FFE66D;background:#FFE66D18;border:1px solid #FFE66D44;border-radius:5px;padding:2px 6px;flex-shrink:0">Active</span>`:`<span style="font-size:14px;color:#333;flex-shrink:0">›</span>`}
  </button>`;
}

function showCourseSelector(groupId, subId){
  document.getElementById('course-selector-overlay')?.remove();
  let html='', breadcrumb='';

  if(!groupId){
    // Step 1 — top-level categories
    breadcrumb = '';
    html = COURSE_TREE.map(g=>g.leaf
      ? _csBtn(`switchCourse('${g.id}')`, g.icon, g.label, g.desc, activeCourse===g.id)
      : _csBtn(`showCourseSelector('${g.id}')`, g.icon, g.label, g.desc, false)
    ).join('');
    html += activeCourse ? `<button onclick="document.getElementById('course-selector-overlay').remove()" style="margin-top:6px;width:100%;background:none;border:1px solid #1e1e1e;color:#444;padding:9px;border-radius:10px;font-family:inherit;cursor:pointer;font-size:12px">Cancel</button>` : '';

  } else if(!subId){
    // Step 2 — children of selected group
    const group = COURSE_TREE.find(g=>g.id===groupId);
    if(!group) return showCourseSelector();
    breadcrumb = _csBreadcrumb([{ label: group.label }]);
    html = group.children.map(child=>{
      if(child.leaf){
        const isActive = activeCourse === child.id;
        return _csBtn(`switchCourse('${child.id}')`, child.icon, child.label, child.desc, isActive);
      }
      return _csBtn(`showCourseSelector('${groupId}','${child.id}')`, child.icon, child.label, child.desc, false);
    }).join('');
    html += `<button onclick="showCourseSelector()" style="margin-top:6px;width:100%;background:none;border:1px solid #1e1e1e;color:#444;padding:9px;border-radius:10px;font-family:inherit;cursor:pointer;font-size:12px">← Back</button>`;

  } else {
    // Step 3 — final options
    const group = COURSE_TREE.find(g=>g.id===groupId);
    const sub = group?.children.find(c=>c.id===subId);
    if(!sub) return showCourseSelector(groupId);
    breadcrumb = _csBreadcrumb([
      { label: group.label, onclick: `showCourseSelector()` },
      { label: sub.label }
    ]);
    html = sub.children.map(item=>{
      const isActive = item.cbse12stream
        ? (activeCourse==='cbse12' && localStorage.getItem('cbse12Stream')===item.id)
        : item.cbse11stream
        ? (activeCourse==='cbse11' && localStorage.getItem('cbse11Stream')===item.id)
        : activeCourse === item.id;
      const action = item.cbse12stream ? `switchCbse12Stream('${item.id}')` : item.cbse11stream ? `switchCbse11Stream('${item.id}')` : `switchCourse('${item.id}')`;
      return _csBtn(action, item.icon, item.label, item.desc, isActive);
    }).join('');
    html += `<button onclick="showCourseSelector('${groupId}')" style="margin-top:6px;width:100%;background:none;border:1px solid #1e1e1e;color:#444;padding:9px;border-radius:10px;font-family:inherit;cursor:pointer;font-size:12px">← Back</button>`;
  }

  document.body.insertAdjacentHTML('beforeend', _csOverlayShell(html, breadcrumb));
}

// Single fallback for when no stream is set (all subjects together)
// PATCHED (phase-2 wiring): stream.subjects no longer exists post-split;
// resolve stream.subjectIds through subjects-bridge.js's SUBJECT_BY_ID.
const SUBJECTS_CBSE11 = Object.values(CBSE11_STREAMS).flatMap(s=>_subjectsFromIds(s.subjectIds)).filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i);
const SUBJECTS_CBSE12 = Object.values(CBSE12_STREAMS).flatMap(s=>_subjectsFromIds(s.subjectIds)).filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i);

const COURSE_SETS = {
  nfsu:    { label:"🎓 NFSU — B.Sc. LL.B. Sem II", subjects: SUBJECTS_NFSU },
  nfsu1:   { label:"🎓 NFSU — B.Sc. LL.B. Sem I", subjects: SUBJECTS_NFSU1 },
  nfsu3:   { label:"🎓 NFSU — B.Sc. LL.B. Sem III", subjects: SUBJECTS_NFSU3 },
  jee:     { label:"📐 JEE (Mains & Advanced)", subjects: SUBJECTS_JEE },
  neet:    { label:"🧬 NEET UG", subjects: SUBJECTS_NEET },
  cbse10:  { label:"📚 CBSE — Class 10", subjects: SUBJECTS_CBSE10 },
  cbse11:  { label:"📗 CBSE — Class 11", subjects: SUBJECTS_CBSE11 },
  cbse12:  { label:"🎓 CBSE — Class 12", subjects: SUBJECTS_CBSE12 },
};

let activeCourse = localStorage.getItem("activeCourse") || null; // null = not selected yet

function getSubjects(){
  if(!activeCourse || activeCourse === "nfsu") return SUBJECTS_NFSU;
  if(activeCourse === "nfsu1") return SUBJECTS_NFSU1;
  if(activeCourse === "nfsu3") return SUBJECTS_NFSU3;
  if(activeCourse === "cbse10") return SUBJECTS_CBSE10;
  if(activeCourse === "cbse11") return getCbse11Subjects().length ? getCbse11Subjects() : SUBJECTS_CBSE11;
  if(activeCourse === "cbse12") return getCbse12Subjects().length ? getCbse12Subjects() : SUBJECTS_CBSE12;
  return COURSE_SETS[activeCourse]?.subjects || SUBJECTS_NFSU;
}

function switchCourse(courseId){
  activeCourse = courseId;
  localStorage.setItem("activeCourse", courseId);
  localStorage.setItem("courseChosen", "1");
  // [FIX] Load per-course studyLog and hoursToday for the new course
  try{ state.studyLog = JSON.parse(localStorage.getItem("studyLog_"+courseId)||"null") || {}; }catch(e){ state.studyLog={}; }
  try{ state.hoursToday = parseFloat(localStorage.getItem("hoursToday_"+courseId)||"0")||0; }catch(e){ state.hoursToday=0; }
  // History API: update URL to /course/<id> and update meta tags
  history.pushState({view: 'course:'+courseId}, '', '/course/'+courseId);
  _updatePageMeta('course:'+courseId);
  // Reset active subject to first subject of new course
  const subs = getSubjects();
  state.activeSubject = subs[0]?.id || "cpp";
  document.getElementById("course-selector-overlay")?.remove();
  // If NFSU/CBSE selected while on neetjee view, go to dashboard
  if((courseId === 'nfsu' || courseId === 'nfsu1' || courseId === 'nfsu3' || courseId === 'cbse10' || courseId === 'cbse11' || courseId === 'cbse12') && state.view === 'neetjee') state.view = 'dashboard';
  // Reload admin materials for the new course
  if(db && currentUser) loadAdminMaterials().then(()=>render());
  clearTimeout(S._timer); S._timer=setTimeout(pushToFirebase,1200);
  switchView(state.view);
  showToast("✅ Course switched to " + COURSE_SETS[courseId]?.label, "success");
  spawnStars();
}

function renderCourseSelector(){ showCourseSelector(); } // legacy alias

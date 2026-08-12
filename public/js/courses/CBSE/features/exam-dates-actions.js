// ══════════════════════════════════════════════════════════════
// FIX: don't hardcode year — infer the nearest upcoming date so this
// works even if exams span a year boundary or the file is reused next semester
function getDaysLeft(examDate){
  if(!examDate||!examDate.trim()) return null;
  const parts=examDate.trim().split(/\s+/);
  const months={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const day=parseInt(parts[0]);
  const mon=parts[1];
  const now=new Date(); now.setHours(0,0,0,0);
  let year=parts[2]?parseInt(parts[2]):now.getFullYear();
  if(isNaN(day)||!months.hasOwnProperty(mon)) return null;
  let d=new Date(year,months[mon],day);
  // If no year given and date passed, try next year
  if(!parts[2]&&d<now) d=new Date(year+1,months[mon],day);
  return Math.ceil((d-now)/86400000);
}
function getSubjectPct(sid){
  const sub=getSubjects().find(s=>s.id===sid);
  if(!sub) return 0;
  let total=0,done=0;
  sub.units.forEach(u=>u.topics.forEach((_,i)=>{total++;if(state.progress[`${sid}-${u.id}-${i}`])done++;}));
  return total?Math.round((done/total)*100):0;
}
function getTotalPct(){
  let total=0,done=0;
  getSubjects().forEach(s=>s.units.forEach(u=>u.topics.forEach((_,i)=>{total++;if(state.progress[`${s.id}-${u.id}-${i}`])done++;})));
  return total?Math.round((done/total)*100):0;
}
function getTotalHours(){return Object.values(state.studyLog).reduce((s,d)=>s+(d.hours||0),0);}
function getStreak(){
  let streak=0;const d=new Date();
  while(streak<366){
    const k=d.toISOString().split("T")[0];
    if(state.studyLog[k]?.hours>0){streak++;d.setDate(d.getDate()-1);}else break;
  }
  return streak;
}

// ── Editable exam dates ──
let _examDateOverrides = JSON.parse(localStorage.getItem('st_examDates')||'{}');
function getExamDate(sid){
  // Fallback chain: personal override > admin-set default (Firestore exam_schedule) > hardcoded subjects.js default
  if(_examDateOverrides[sid]) return _examDateOverrides[sid];
  const adminDefault=(state.examSchedule||[]).find(e=>e.id===sid);
  if(adminDefault && adminDefault.date) return adminDefault.date;
  return getSubjects().find(s=>s.id===sid)?.exam || '';
}
// ── Convert "D Mon" or "D Mon YYYY" (used internally) <-> "YYYY-MM-DD" (native <input type="date">) ──
const _EXAM_MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function _examDateToISO(examStr){
  if(!examStr||!examStr.trim()) return '';
  const months={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const parts=examStr.trim().split(/\s+/);
  const day=parseInt(parts[0]);
  const mon=parts[1];
  if(isNaN(day)||!months.hasOwnProperty(mon)) return '';
  const now=new Date(); now.setHours(0,0,0,0);
  let year=parts[2]?parseInt(parts[2]):now.getFullYear();
  let d=new Date(year,months[mon],day);
  if(!parts[2]&&d<now) d=new Date(year+1,months[mon],day);
  const mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
function _isoToExamDate(iso){
  if(!iso) return '';
  const [y,m,d]=iso.split('-').map(Number);
  if(!y||!m||!d) return '';
  return `${d} ${_EXAM_MONTHS[m-1]} ${y}`;
}
function setExamDate(sid, val){
  _examDateOverrides[sid] = val;
  localStorage.setItem('st_examDates', JSON.stringify(_examDateOverrides));
  render();
  showToast('✅ Exam date updated!','success');
}
// genId, today, esc now provided by src/utils/helpers.js via the module
// shim near the top of <head> (exposed on window). See AUDIT.md.

// showToast now provided by src/utils/helpers.js via the module shim
// near the top of <head> (exposed on window). See AUDIT.md.

// ══════════════════════════════════════════════════════════════
// ACTIONS
// ══════════════════════════════════════════════════════════════
// ── History API: dynamic meta tags per route (SEO) ──
const _pageMeta = {
  dashboard:  { title: 'Dashboard — Exam Is Near', desc: 'Track your study progress, syllabus completion, mood and daily hours. Your personal study overview.' },
  subjects:   { title: 'Study Subjects — Exam Is Near', desc: 'Browse and track chapter-wise progress across all your subjects for JEE, NEET, UPSC and NFSU.' },
  alarms:     { title: 'Study Alarms & Timer — Exam Is Near', desc: 'Set smart study alarms and reminders to stay on schedule for your exam preparation.' },
  files:      { title: 'Study Material — Exam Is Near', desc: 'Manage and access your notes, PDFs and study files synced with Firebase Storage and Google Drive.' },
  pomodoro:   { title: 'Pomodoro Timer — Exam Is Near', desc: 'Boost focus with the Pomodoro technique. Free study timer with session tracking for JEE and NEET prep.' },
  flashcards: { title: 'Flashcards — Exam Is Near', desc: 'Create and review flashcards with spaced repetition (SRS) for long-term retention. Free for JEE, NEET, UPSC students.' },
  quiz:       { title: 'Quiz Mode — Exam Is Near', desc: 'Test yourself with MCQ quiz mode. Instant feedback, quiz logs and review cards for exam preparation.' },
  analytics:  { title: 'Study Analytics — Exam Is Near', desc: 'Visualise your study hours, mood trends and subject-wise progress with detailed analytics and rank predictor.' },
  ai:         { title: 'AI Tutor — Exam Is Near', desc: 'Get instant doubt resolution from an AI tutor powered by Groq LLaMA 3.3. Free AI study assistant for students.' },
  sync:       { title: 'Sync & Account — Exam Is Near', desc: 'Sync your study data across devices with Firebase cloud backup. Sign in with Google.' },
  log:        { title: 'Study Log — Exam Is Near', desc: 'Log your daily study sessions, mood and hours. Build a consistent study habit with the study journal.' },
  about:      { title: 'About — Exam Is Near by ArkSetu', desc: 'Learn about Exam Is Near, a free AI-powered study app by ArkSetu built for Indian students.' },
  profile:    { title: 'Profile — Exam Is Near', desc: 'Manage your Exam Is Near profile, subscription and preferences.' },
  neetjee:    { title: 'NEET / JEE Hub — Exam Is Near', desc: 'Chapter-wise weightage, rank predictor and OMR practice for NEET UG and JEE Mains / Advanced.' },
  rank:       { title: 'Rank Predictor — Exam Is Near', desc: 'Free NEET & JEE Main rank predictor. Updated with NTA 2025 official data and JoSAA 2025 closing ranks. Predict your AIR and colleges instantly.' },
  'course:jee':    { title: 'JEE Preparation — Exam Is Near', desc: 'Free JEE Mains and Advanced study app. Track Maths, Physics and Chemistry with AI tutor, flashcards, quiz mode and rank predictor.' },
  'course:neet':   { title: 'NEET UG Preparation — Exam Is Near', desc: 'Free NEET UG study app. Track Biology, Physics and Chemistry with AI tutor, flashcards, quiz mode and rank predictor.' },
  'course:nfsu':   { title: 'NFSU B.Sc. LL.B. Sem II — Exam Is Near', desc: 'Study companion for NFSU B.Sc. LL.B. Semester II. Track subjects, notes, flashcards and quiz mode for forensic law students.' },
  'course:nfsu1':  { title: 'NFSU B.Sc. LL.B. Sem I — Exam Is Near', desc: 'Study companion for NFSU B.Sc. LL.B. Semester I. Covers Legal Methods, Law of Tort, Computer Organization, C Programming and Discrete Mathematics.' },
  'course:nfsu3':  { title: 'NFSU B.Sc. LL.B. Sem III — Exam Is Near', desc: 'Study companion for NFSU B.Sc. LL.B. Semester III. Covers IPC, Constitutional Law, Contract Law, Family Law, Web Programming and OS Concepts.' },
  'course:cbse10': { title: 'CBSE Class 10 Preparation — Exam Is Near', desc: 'Free CBSE Class 10 board exam study app. Track Maths, Science, English and Social Science with AI tutor and flashcards.' },
  'course:cbse12': { title: 'CBSE Class 12 Preparation — Exam Is Near', desc: 'Free CBSE Class 12 board exam study app. AI tutor, flashcards, quiz mode and syllabus tracker for all streams.' },
};
function _updatePageMeta(v){
  const m = _pageMeta[v] || _pageMeta['course:'+v] || _pageMeta['dashboard'];
  // Title
  document.title = m.title;
  // Meta description
  let md = document.querySelector('meta[name="description"]');
  if(md) md.setAttribute('content', m.desc);
  // OG title + description
  let ogt = document.querySelector('meta[property="og:title"]');
  if(ogt) ogt.setAttribute('content', m.title);
  let ogd = document.querySelector('meta[property="og:description"]');
  if(ogd) ogd.setAttribute('content', m.desc);
  // OG url
  let ogu = document.querySelector('meta[property="og:url"]');
  const slug = v === 'dashboard' ? '' : '/' + v;
  if(ogu) ogu.setAttribute('content', 'https://exam-is-near.web.app' + slug);
  // Twitter
  let twt = document.querySelector('meta[name="twitter:title"]');
  if(twt) twt.setAttribute('content', m.title);
  let twd = document.querySelector('meta[name="twitter:description"]');
  if(twd) twd.setAttribute('content', m.desc);
  // Canonical
  let can = document.querySelector('link[rel="canonical"]');
  const _courseSlug = v.startsWith('course:') ? '/course/' + v.split(':')[1] : slug;
  if(can) can.setAttribute('href', 'https://exam-is-near.web.app' + _courseSlug);
  // OG url for course pages
  if(ogu && v.startsWith('course:')) ogu.setAttribute('content', 'https://exam-is-near.web.app' + _courseSlug);
}

function switchView(v, pushState=true){
  // /rank, /neet/rank, /jee/rank — direct shortcut URLs to rank predictor
  if(v === 'rank' || v === 'rank:neet' || v === 'rank:jee'){
    njState.tab = 'rank';
    if(v === 'rank:neet') njState.exam = 'neet';
    if(v === 'rank:jee')  njState.exam = 'jee';
    v = 'neetjee';
  }
  // [FIX C8] Clean up Pomodoro fullscreen interval on nav away
  if(v !== 'pomodoro' && typeof pomCleanupFS === 'function') pomCleanupFS();
  // History API routing — update URL without page reload
  if(pushState){
    const slug = v === 'dashboard' ? '/' : '/' + v;
    history.pushState({view: v}, '', slug);
  }
  _updatePageMeta(v);
  state.view=v; state.showAddForm=false; state.editingMatId=null;
  // Full-screen immersive mode for AI Assistant (hides header/nav, edge-to-edge on mobile & PC)
  document.body.classList.toggle('ai-fullscreen-view', v === 'ai');
  // Load admin materials when navigating to files view
  if(v === 'files' && db && currentUser) {
    loadAdminMaterials().then(()=>render());
  }
  document.querySelectorAll(".nav-pill").forEach(b=>{
    const fn=b.getAttribute("onclick")||"";
    b.classList.toggle("active",fn.includes("switchView('"+v+"')"));
  });
  // Update NEET/JEE nav pill: hide for NFSU/CBSE, label by course
  const njPill = document.getElementById("neetjee-nav-pill");
  if(njPill){
    if(activeCourse === 'nfsu' || activeCourse === 'nfsu1' || activeCourse === 'nfsu3' || activeCourse === 'cbse10' || activeCourse === 'cbse12' || activeCourse === null){
      njPill.style.display = 'none';
    } else {
      njPill.style.display = '';
      njPill.textContent = activeCourse === 'jee' ? '⚡ JEE' : '🩺 NEET';
    }
    njPill.classList.toggle("active", v === 'neetjee');
  }
  render();
}

function toggleTopic(sid,uid,idx){
  const k=`${sid}-${uid}-${idx}`;
  state.progress[k]=!state.progress[k];
  S("progress",state.progress);
  // star burst on completion
  if(state.progress[k]) spawnStars();
  render();
}

function setActiveSubject(sid){state.activeSubject=sid;render();}
function setMood(m){state.mood=m;S("mood",m);render();}
function setHours(h){state.hoursToday=parseFloat(h);var _hk=activeCourse?"hoursToday_"+activeCourse:"hoursToday";S(_hk,h);const el=document.getElementById("hours-display");if(el)el.textContent=state.hoursToday+"h";}
function saveSubjectNote(sid,text){state.subjectNotes[sid]=text;S("subjectNotes",state.subjectNotes);}

function logToday(){
  state.studyLog[today()]={hours:state.hoursToday,mood:state.mood,subject:state.activeSubject};
  var _lk = activeCourse ? "studyLog_"+activeCourse : "studyLog";
  S(_lk,state.studyLog);
  showToast("✅ Day logged!","success");
  spawnStars();
  render();
}

function setMatFilter(type,val){
  if(type==="sub")state.matSubFilter=state.matSubFilter===val?"all":val;
  else state.matTypeFilter=state.matTypeFilter===val?"all":val;
  render();
}
function searchMats(q){state.matSearch=q;render();}
function showAddForm(){state.showAddForm=true;state.editingMatId=null;state.newMat={subjectId:"cpp",type:"📝 Note",title:"",content:"",tags:""};render();}
function hideAddForm(){state.showAddForm=false;render();}
function updateNewMat(f,v){state.newMat[f]=v;}

function addMaterial(){
  const m=state.newMat;
  const title=document.getElementById("new-title")?.value||m.title;
  const content=document.getElementById("new-content")?.value||m.content;
  const tags=document.getElementById("new-tags")?.value||m.tags;
  const subjectId=document.getElementById("new-sub")?.value||m.subjectId;
  const type=document.getElementById("new-type")?.value||m.type;
  if(!title.trim()||!content.trim()){showToast("⚠️ Fill title and content","alarm");return;}
  const mat={id:genId(),subjectId,type,title,content,tags:tags.split(",").map(t=>t.trim()).filter(Boolean),created:today(),pinned:false};
  state.materials.unshift(mat);
  S("materials",state.materials);
  state.showAddForm=false;
  showToast("✅ Material saved!","success");
  spawnStars();
  render();
}

function deleteMaterial(id){
  if(!confirm("Delete this material?"))return;
  state.materials=state.materials.filter(m=>m.id!==id);
  S("materials",state.materials);
  showToast("🗑️ Deleted","info");
  render();
}

function togglePin(id){
  const m=state.materials.find(m=>m.id===id);
  if(m){m.pinned=!m.pinned;S("materials",state.materials);render();}
}

function startEdit(id){state.editingMatId=id;state.showAddForm=false;render();}
function cancelEdit(){state.editingMatId=null;render();}

function saveEdit(id){
  const title=document.getElementById("edit-title")?.value||"";
  const content=document.getElementById("edit-content")?.value||"";
  const tags=document.getElementById("edit-tags")?.value||"";
  const subjectId=document.getElementById("edit-sub")?.value||"cpp";
  const type=document.getElementById("edit-type")?.value||"📝 Note";
  if(!title.trim()||!content.trim()){showToast("⚠️ Fill title and content","alarm");return;}
  const m=state.materials.find(m=>m.id===id);
  if(m)Object.assign(m,{title,content,subjectId,type,tags:tags.split(",").map(t=>t.trim()).filter(Boolean)});
  S("materials",state.materials);
  state.editingMatId=null;
  showToast("✅ Updated!","success");
  render();
}

// ALARM ACTIONS
function saveNewAlarm(){
  const time=document.getElementById("al-time")?.value||"07:00";
  const label=document.getElementById("al-label")?.value||"Study Time";
  const repeat=document.getElementById("al-repeat")?.checked||false;
  const ringtone=document.getElementById("al-ringtone")?.value||selectedRingtone;
  const alarm={id:genId(),time,label,enabled:true,repeat,days:[],ringtone};
  state.alarms.push(alarm);
  S("alarms",state.alarms);
  showToast("⏰ Alarm set for "+time,"success");
  render();
}

function addPresetAlarms(){
  const PRESET_ALARMS=[
    {time:"05:30",label:"🌅 Early Bird Wake-up"},
    {time:"06:00",label:"🌄 Morning Start"},
    {time:"06:30",label:"☀️ Rise & Shine"},
    {time:"07:00",label:"📚 Morning Study Block"},
    {time:"07:30",label:"⏰ Study Begins"},
    {time:"08:00",label:"📖 Deep Work Session"},
    {time:"08:30",label:"🎯 Focus Block 1"},
    {time:"09:00",label:"📝 C++ / RDBMS Time"},
    {time:"09:30",label:"☕ Short Break"},
    {time:"10:00",label:"📚 Study Block 2"},
    {time:"10:30",label:"🧠 Concepts Review"},
    {time:"11:00",label:"📊 Stats Practice"},
    {time:"11:30",label:"⚖️ Law & Jurisprudence"},
    {time:"12:00",label:"🍽️ Lunch Break"},
    {time:"12:30",label:"😴 Afternoon Nap (20 min)"},
    {time:"13:00",label:"📖 Post-Lunch Study"},
    {time:"13:30",label:"🎯 Focus Block 3"},
    {time:"14:00",label:"📝 Revision Session"},
    {time:"14:30",label:"☕ Tea Break"},
    {time:"15:00",label:"📚 Deep Dive Block"},
    {time:"15:30",label:"🧮 Formula Review"},
    {time:"16:00",label:"📋 Notes Compilation"},
    {time:"16:30",label:"🔔 Hydration Reminder"},
    {time:"17:00",label:"🏃 Exercise / Walk Break"},
    {time:"17:30",label:"📖 Evening Study Start"},
    {time:"18:00",label:"📚 Evening Block 1"},
    {time:"18:30",label:"🎯 Focus Session"},
    {time:"19:00",label:"🍽️ Dinner Time"},
    {time:"19:30",label:"📖 Post-Dinner Study"},
    {time:"20:00",label:"📝 Night Revision"},
    {time:"20:30",label:"🧠 Weak Topics Review"},
    {time:"21:00",label:"📊 Mock Questions"},
    {time:"21:30",label:"☕ Break & Relax"},
    {time:"22:00",label:"📖 Final Study Block"},
    {time:"22:30",label:"✍️ Notes Summary"},
    {time:"23:00",label:"🌙 Wind Down"},
    {time:"23:30",label:"📋 Tomorrow's Plan"},
    {time:"00:00",label:"🛌 Bedtime Reminder"},
    {time:"06:15",label:"🧘 Morning Stretch"},
    {time:"08:45",label:"🔔 Pomodoro Start"},
    {time:"09:15",label:"⏸ Pomodoro Break"},
    {time:"10:15",label:"🔔 Pomodoro 2 Start"},
    {time:"10:45",label:"⏸ Pomodoro 2 Break"},
    {time:"11:15",label:"🔔 Pomodoro 3 Start"},
    {time:"11:45",label:"⏸ Pomodoro 3 Break"},
    {time:"14:15",label:"🔔 Pomodoro 4 Start"},
    {time:"14:45",label:"⏸ Pomodoro 4 Break"},
    {time:"16:15",label:"🔔 Pomodoro 5 Start"},
    {time:"20:15",label:"🔔 Pomodoro 6 Start"},
    {time:"07:45",label:"📱 No Phone — Focus!"},
  ];
  let added=0;
  PRESET_ALARMS.forEach(p=>{
    if(!state.alarms.find(a=>a.time===p.time&&a.label===p.label)){
      state.alarms.push({id:genId(),time:p.time,label:p.label,enabled:true,repeat:true,days:[],ringtone:"classic"});
      added++;
    }
  });
  S("alarms",state.alarms);
  showToast(`✅ ${added} preset alarms added!`,"success");
  spawnStars();
  render();
}

function deleteAlarm(id){
  state.alarms=state.alarms.filter(a=>a.id!==id);
  S("alarms",state.alarms);
  render();
}

function toggleAlarm(id){
  const a=state.alarms.find(a=>a.id===id);
  if(a){a.enabled=!a.enabled;S("alarms",state.alarms);render();}
}

// TIMER ACTIONS
function setTimerMode(mode){
  state.timerMode=mode;
  clearInterval(timerInterval);timerInterval=null;state.timerRunning=false;
  const secs={study:25*60,short:5*60,long:15*60};
  state.timerSeconds=secs[mode];
  render();
}

// ══════════════════════════════════════════════════════════════
// RENDER
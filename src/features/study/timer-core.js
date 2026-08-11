// ══════════════════════════════════════════════════════════════
function startTimer(){
  if(timerInterval) return;
  state.timerRunning=true;
  timerInterval=setInterval(()=>{
    if(state.timerSeconds>0){
      state.timerSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval); timerInterval=null; state.timerRunning=false;
      showToast("🎉 Session complete!","success");
      spawnStars();
      playAlarmSound();
      setTimeout(stopAlarmSound,3000);
    }
  },1000);
  updateTimerDisplay();
}

function pauseTimer(){
  clearInterval(timerInterval); timerInterval=null; state.timerRunning=false;
  updateTimerDisplay();
}

function resetTimer(seconds){
  clearInterval(timerInterval); timerInterval=null; state.timerRunning=false;
  state.timerSeconds=seconds||25*60;
  updateTimerDisplay();
}

// FIX: guard all DOM lookups — these elements only exist on the alarms view,
// so calling updateTimerDisplay() from other views was throwing silently
function updateTimerDisplay(){
  const m=Math.floor(state.timerSeconds/60);
  const s=state.timerSeconds%60;
  const el=document.getElementById("timer-display");
  if(el) el.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  const total=state.timerMode==="study"?25*60:state.timerMode==="short"?5*60:15*60;
  const pct=state.timerSeconds/total;
  const circ=2*Math.PI*54;
  const el2=document.getElementById("timer-ring-fill");
  if(el2) el2.style.strokeDashoffset=circ*(1-pct);
  // Also update document title when timer is running so you can see it in the tab
  if(state.timerRunning && el){
    document.title=`⏱ ${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")} — Exam Is Near`;
  } else {
    document.title="Exam Is Near — Study Smart | by ArkSetu";
  }
}

// ══════════════════════════════════════════════════════════════
// HELPERS
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
  return _examDateOverrides[sid] || (getSubjects().find(s=>s.id===sid)?.exam || '');
}
function setExamDate(sid, val){
  _examDateOverrides[sid] = val;
  localStorage.setItem('st_examDates', JSON.stringify(_examDateOverrides));
  render();
  showToast('✅ Exam date updated!','success');
}
function genId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function today(){return new Date().toISOString().split("T")[0];}
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

function showToast(msg,type="info"){
  const t=document.getElementById("toast");
  t.textContent=msg;
  t.className=`toast toast-${type} show`;
  setTimeout(()=>{t.classList.add("hiding");setTimeout(()=>t.className="toast",320);},2400);
}


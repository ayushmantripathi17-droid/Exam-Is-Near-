// ══════════════════════════════════════════════════════════════
function updateClock(){
  const now=new Date();
  const h=String(now.getHours()).padStart(2,"0");
  const m=String(now.getMinutes()).padStart(2,"0");
  const s=String(now.getSeconds()).padStart(2,"0");
  const el=document.getElementById("live-clock");
  const del=document.getElementById("live-date");
  if(el) el.textContent=`${h}:${m}:${s}`;
  if(del) del.textContent=`${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
}

// ══════════════════════════════════════════════════════════════
// ALARM SYSTEM
// ══════════════════════════════════════════════════════════════
// FIX: alarm check — don't rely on seconds===0 because setInterval(1000) drifts
// and can miss the exact second. Track last-fired time instead.
let _lastAlarmCheck="";
function checkAlarms(){
  const now=new Date();
  const hm=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  if(hm===_lastAlarmCheck) return; // already fired this minute
  const dayIdx=now.getDay();
  state.alarms.forEach(alarm=>{
    if(!alarm.enabled) return;
    if(alarm.time!==hm) return;
    const dayOk=!alarm.repeat || alarm.days.length===0 || alarm.days.includes(dayIdx);
    if(!dayOk) return;
    triggerAlarm(alarm);
  });
  _lastAlarmCheck=hm;
}

function triggerAlarm(alarm){
  document.getElementById("alarm-title").textContent=alarm.label||"Study Time!";
  document.getElementById("alarm-msg").textContent=`Alarm set for ${alarm.time}`;
  document.getElementById("alarm-icon").textContent="⏰";
  document.getElementById("alarm-overlay").classList.add("show");
  if(alarm.ringtone) selectedRingtone=alarm.ringtone;
  playAlarmSound();
  spawnStars();
  // Browser notification
  if(Notification.permission==="granted"){
    try{new Notification("⏰ "+(alarm.label||"Study Time!"),{
      body:"Alarm set for "+alarm.time+" · Exam Is Near",
      icon:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ctext y='52' font-size='52'%3E%E2%8F%B0%3C/text%3E%3C/svg%3E",
      requireInteraction:true
    });}catch(e){}
  }
}

function dismissAlarm(){
  document.getElementById("alarm-overlay").classList.remove("show");
  stopAlarmSound();
}

// ── RINGTONES ─────────────────────────────────────────────────
const RINGTONES=[
  {id:"classic",name:"📯 Classic Bell",desc:"Traditional double-beep"},
  {id:"digital",name:"🔔 Digital Ring",desc:"Sharp digital tone"},
  {id:"chime",name:"🎵 Chime",desc:"Soft melodic chime"},
  {id:"urgent",name:"🚨 Urgent",desc:"Fast warning beeps"},
  {id:"melody",name:"🎶 Study Melody",desc:"Motivating tune"},
  {id:"gentle",name:"🌅 Gentle Wake",desc:"Soft rising tone"},
  {id:"school",name:"🏫 School Bell",desc:"Classic school bell"},
  {id:"digital2",name:"💻 Tech Alert",desc:"Modern tech beep"},
  {id:"zen",name:"🧘 Zen Bowl",desc:"Singing bowl sound"},
  {id:"fanfare",name:"🎺 Fanfare",desc:"Achievement fanfare"},
  {id:"morning",name:"🌄 Morning Bird",desc:"Cheerful chirping"},
  {id:"piano",name:"🎹 Piano Ding",desc:"Soft piano notes"},
  {id:"retro",name:"👾 Retro Game",desc:"8-bit style beeps"},
  {id:"pulse",name:"💓 Pulse",desc:"Rhythmic heartbeat"},
  {id:"cosmic",name:"🌌 Cosmic",desc:"Space-like tones"},
];
let selectedRingtone=localStorage.getItem("st_ringtone")||"classic";

function setRingtone(id){
  selectedRingtone=id;
  localStorage.setItem("st_ringtone",id);
  playAlarmSound();
  render();
}

function playAlarmSound(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const now=ctx.currentTime;
    function beep(freq,start,dur,type="sine",vol=0.4){
      const o=ctx.createOscillator();
      const g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value=freq; o.type=type;
      g.gain.setValueAtTime(0,now+start);
      g.gain.linearRampToValueAtTime(vol,now+start+0.05);
      g.gain.linearRampToValueAtTime(0,now+start+dur);
      o.start(now+start);
      o.stop(now+start+dur+0.05);
    }
    function sweep(f1,f2,start,dur,type="sine",vol=0.35){
      const o=ctx.createOscillator();
      const g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type=type;
      o.frequency.setValueAtTime(f1,now+start);
      o.frequency.linearRampToValueAtTime(f2,now+start+dur);
      g.gain.setValueAtTime(0,now+start);
      g.gain.linearRampToValueAtTime(vol,now+start+0.05);
      g.gain.linearRampToValueAtTime(0,now+start+dur);
      o.start(now+start); o.stop(now+start+dur+0.05);
    }

    const rt=selectedRingtone;

    if(rt==="classic"){
      // Double beep x5
      for(let i=0;i<5;i++){beep(880,i*0.5,0.2);beep(1100,i*0.5+0.22,0.15);}
    } else if(rt==="digital"){
      // Fast digital pulses
      for(let i=0;i<10;i++){beep(1200,i*0.25,0.1,"square",0.3);}
    } else if(rt==="chime"){
      // Soft ascending chime
      [523,659,784,1047,784,659,523].forEach((f,i)=>beep(f,i*0.18,0.25,"sine",0.3));
    } else if(rt==="urgent"){
      // Fast alternating
      for(let i=0;i<14;i++){beep(i%2===0?900:1400,i*0.18,0.12,"sawtooth",0.25);}
    } else if(rt==="melody"){
      // Happy study tune: C E G E C
      const notes=[262,330,392,330,262,330,392,523];
      notes.forEach((f,i)=>beep(f,i*0.22,0.18,"sine",0.35));
    } else if(rt==="gentle"){
      // Rising sweep
      for(let i=0;i<4;i++){sweep(300+i*80,400+i*100,i*0.6,0.5,"sine",0.25);}
    } else if(rt==="school"){
      // School bell simulation
      for(let i=0;i<3;i++){
        beep(800,i*0.7,0.05,"square",0.4);
        sweep(800,600,i*0.7+0.05,0.55,"sine",0.35);
      }
    } else if(rt==="digital2"){
      // Tech alert: ascending triplet
      for(let i=0;i<4;i++){
        [600,900,1200].forEach((f,j)=>beep(f,i*0.45+j*0.1,0.08,"square",0.25));
      }
    } else if(rt==="zen"){
      // Singing bowl — long sustain
      sweep(220,440,0,0.3,"sine",0.15);
      sweep(440,880,0.3,0.5,"sine",0.12);
      sweep(880,440,0.8,1.2,"sine",0.08);
    } else if(rt==="fanfare"){
      [392,523,659,784,659,523,392,784].forEach((f,i)=>beep(f,i*0.15,0.12,"square",0.3));
      beep(1047,8*0.15,0.5,"sine",0.35);
    } else if(rt==="morning"){
      const chirp=(s)=>{sweep(800,1200,s,0.08);sweep(1200,900,s+0.08,0.06);};
      [0,0.2,0.4,0.7,0.9,1.1].forEach(chirp);
    } else if(rt==="piano"){
      [262,294,330,349,392,440,494,523].forEach((f,i)=>{
        beep(f,i*0.2,0.3,"sine",0.3);beep(f*2,i*0.2,0.15,"sine",0.08);
      });
    } else if(rt==="retro"){
      [200,400,300,500,400,600,500,700,800].forEach((f,i)=>beep(f,i*0.12,0.1,"square",0.2));
    } else if(rt==="pulse"){
      for(let i=0;i<8;i++){beep(440,i*0.35,0.1,"sine",0.35);beep(660,i*0.35+0.12,0.08,"sine",0.2);}
    } else if(rt==="cosmic"){
      sweep(100,800,0,1.5,"sine",0.2);sweep(800,200,1.5,1,"sine",0.15);
      [300,600,900,1200].forEach((f,i)=>beep(f,i*0.5,0.3,"sine",0.1));
    } else {
      // Default fallback
      for(let i=0;i<6;i++){beep(880,i*0.4,0.25);beep(1100,i*0.4+0.25,0.15);}
    }
    activeAlarmAudio=ctx;
  }catch(e){}
}

function stopAlarmSound(){
  try{if(activeAlarmAudio)activeAlarmAudio.close();}catch(e){}
  activeAlarmAudio=null;
}

function spawnStars(){
  const icons=["⭐","✨","🌟","💫","🎯","📚"];
  for(let i=0;i<12;i++){
    setTimeout(()=>{
      const s=document.createElement("div");
      s.className="star";
      s.textContent=icons[Math.floor(Math.random()*icons.length)];
      s.style.left=Math.random()*100+"vw";
      s.style.top=Math.random()*60+20+"vh";
      s.style.fontSize=(16+Math.random()*16)+"px";
      s.style.animationDuration=(0.8+Math.random()*0.6)+"s";
      document.body.appendChild(s);
      setTimeout(()=>s.remove(),1400);
    },i*80);
  }
}

// ══════════════════════════════════════════════════════════════
// POMODORO TIMER
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
// POMODORO TIMER — Enhanced by ArkSetu v2
// ══════════════════════════════════════════════════════════════
const POM_PRESETS = [
  {label:"Classic",work:25,short:5,long:15},
  {label:"Short",work:15,short:3,long:10},
  {label:"Deep",work:50,short:10,long:20},
  {label:"Custom",work:25,short:5,long:15},
];
const POM_QUOTES = [
  "Focus is the bridge between setting a goal and achieving it.",
  "Small daily improvements lead to stunning long-term results.",
  "The secret of getting ahead is getting started.",
  "One focused session at a time. You've got this!",
  "Discipline is choosing what you want most over what you want now.",
  "Every expert was once a beginner. Keep going.",
  "The exam is near — but so is your success!",
  "Concentration is the root of all higher abilities.",
];
let pomState={
  running:false, mode:"work", timeLeft:25*60, sessions:0, interval:null,
  subject:"", subjectHours:{}, breakOverlay:false, isFullScreen:false,
  workMins:25, shortBreak:5, longBreak:15, preset:0,
  taskName:"", soundOn:true,
  sessionLog:[], // [{subject,duration,mode,timestamp}]
  quoteIdx:Math.floor(Math.random()*POM_QUOTES.length),
};

// Load saved pomodoro subject hours from localStorage
try{ pomState.subjectHours=JSON.parse(localStorage.getItem("pom_subHours")||"{}"); }catch(e){}
try{ const ps=JSON.parse(localStorage.getItem("pom_settings")||"null"); if(ps){pomState.workMins=ps.workMins||25;pomState.shortBreak=ps.shortBreak||5;pomState.longBreak=ps.longBreak||15;pomState.preset=ps.preset||0;pomState.soundOn=ps.soundOn!==false;} }catch(e){}
try{ pomState.sessionLog=JSON.parse(localStorage.getItem("pom_sessionLog")||"[]"); }catch(e){}

// Keyboard shortcut: Space = start/pause when Pomodoro view is active
document.addEventListener("keydown",(e)=>{
  if(state.view!=="pomodoro") return;
  if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA") return;
  if(e.code==="Space"){e.preventDefault();pomState.running?pomPause():pomStart();}
  if(e.code==="KeyR"&&!e.ctrlKey&&!e.metaKey){e.preventDefault();pomReset();}
});

function pomSaveHours(){ localStorage.setItem("pom_subHours", JSON.stringify(pomState.subjectHours)); S("pomSubjectHours",pomState.subjectHours); }
function pomSaveSettings(){ localStorage.setItem("pom_settings",JSON.stringify({workMins:pomState.workMins,shortBreak:pomState.shortBreak,longBreak:pomState.longBreak,preset:pomState.preset,soundOn:pomState.soundOn})); }
function pomSaveLog(){ try{localStorage.setItem("pom_sessionLog",JSON.stringify(pomState.sessionLog.slice(-50)));}catch(e){} }

function pomSetPreset(idx){
  const p=POM_PRESETS[idx];
  pomState.preset=idx;
  if(idx!==3){ // not custom
    pomState.workMins=p.work; pomState.shortBreak=p.short; pomState.longBreak=p.long;
  }
  pomSaveSettings();
  if(!pomState.running){ pomState.mode="work"; pomState.timeLeft=pomState.workMins*60; }
  render();
}

function pomApplyCustom(){
  const w=parseInt(document.getElementById("pom-custom-work")?.value)||25;
  const s=parseInt(document.getElementById("pom-custom-short")?.value)||5;
  const l=parseInt(document.getElementById("pom-custom-long")?.value)||15;
  pomState.workMins=Math.max(1,Math.min(90,w));
  pomState.shortBreak=Math.max(1,Math.min(30,s));
  pomState.longBreak=Math.max(1,Math.min(60,l));
  pomState.preset=3;
  pomSaveSettings();
  if(!pomState.running){ pomState.mode="work"; pomState.timeLeft=pomState.workMins*60; }
  showToast("✅ Custom timer set!","success");
  render();
}

function pomToggleSound(){
  pomState.soundOn=!pomState.soundOn;
  pomSaveSettings();
  render();
}

function pomStart(){
  if(pomState.running) return;
  if(!pomState.subject){ showToast("⚠️ Please select a subject first!","alarm"); return; }
  pomState.running=true;
  pomState.breakOverlay=false;
  pomState.quoteIdx=Math.floor(Math.random()*POM_QUOTES.length);
  const workTotal=pomState.workMins*60;
  const shortTotal=pomState.shortBreak*60;
  const longTotal=pomState.longBreak*60;
  pomState.interval=setInterval(()=>{
    if(!pomState.running) return;
    pomState.timeLeft--;
    // Track study seconds per subject during work mode
    if(pomState.mode==="work" && pomState.subject){
      pomState.subjectHours[pomState.subject]=(pomState.subjectHours[pomState.subject]||0)+1;
      pomSaveHours();
    }
    if(pomState.timeLeft<=0){
      pomState.running=false;
      clearInterval(pomState.interval);
      if(pomState.mode==="work"){
        pomState.sessions++;
        // Log session
        pomState.sessionLog.push({subject:pomState.subject,duration:workTotal,mode:"work",timestamp:Date.now()});
        pomSaveLog();
        // Every 4 sessions → long break
        const isLong = pomState.sessions % 4 === 0;
        pomState.mode= isLong ? "longbreak" : "break";
        pomState.timeLeft= isLong ? longTotal : shortTotal;
        pomState.breakOverlay=true;
        showToast(isLong?"🎉 4 sessions done! Long break time! 🏆":"✅ Pomodoro done! Break time 🎉","success");
        spawnStars();
        if(pomState.soundOn) pomPlayChime();
        render(); return;
      } else {
        // Log break
        pomState.sessionLog.push({subject:pomState.subject,duration:pomState.mode==="longbreak"?longTotal:shortTotal,mode:pomState.mode,timestamp:Date.now()});
        pomSaveLog();
        pomState.mode="work";
        pomState.timeLeft=workTotal;
        pomState.breakOverlay=false;
        showToast("⏰ Break over! Back to work 💪","info");
        if(pomState.soundOn) pomPlayChime();
        render(); return;
      }
    }
    updatePomDisplay();
  },1000);
  updatePomDisplay();
}

function pomPlayChime(){
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    [523,659,784,1047].forEach((f,i)=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.frequency.value=f; o.type="sine";
      g.gain.setValueAtTime(0,ctx.currentTime+i*0.18);
      g.gain.linearRampToValueAtTime(0.18,ctx.currentTime+i*0.18+0.05);
      g.gain.linearRampToValueAtTime(0,ctx.currentTime+i*0.18+0.32);
      o.start(ctx.currentTime+i*0.18);
      o.stop(ctx.currentTime+i*0.18+0.35);
    });
  }catch(e){}
}

function pomPause(){
  pomState.running=false;
  clearInterval(pomState.interval);
  updatePomDisplay();
}

function pomReset(){
  pomState.running=false;
  clearInterval(pomState.interval);
  pomState.mode="work";
  pomState.timeLeft=pomState.workMins*60;
  pomState.breakOverlay=false;
  updatePomDisplay();
  render();
}

function pomSkipBreak(){
  pomState.running=false;
  clearInterval(pomState.interval);
  pomState.mode="work";
  pomState.timeLeft=pomState.workMins*60;
  pomState.breakOverlay=false;
  showToast("⏭️ Break skipped — back to work!","info");
  render();
}

function pomStartBreak(){
  pomState.breakOverlay=false;
  pomState.running=true;
  const breakSecs=(pomState.mode==="longbreak"?pomState.longBreak:pomState.shortBreak)*60;
  pomState.interval=setInterval(()=>{
    if(!pomState.running) return;
    pomState.timeLeft--;
    if(pomState.timeLeft<=0){
      pomState.running=false;
      clearInterval(pomState.interval);
      pomState.mode="work";
      pomState.timeLeft=pomState.workMins*60;
      pomState.breakOverlay=false;
      showToast("⏰ Break over! Back to work 💪","info");
      if(pomState.soundOn) pomPlayChime();
      render(); return;
    }
    updatePomDisplay();
  },1000);
  updatePomDisplay();
  render();
}

function pomToggleFullScreen(){
  if(!document.fullscreenElement && !document.webkitFullscreenElement){
    // Request fullscreen on the root element so overlays appended to body still show
    (document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen||function(){}).call(document.documentElement);
    pomState.isFullScreen=true;
    // inject fullscreen overlay layer into body (works since we fullscreen documentElement)
    setTimeout(()=>{
      let fs=document.getElementById("pom-fs-overlay");
      if(!fs){
        fs=document.createElement("div");
        fs.id="pom-fs-overlay";
        document.body.appendChild(fs);
      }
      fs.style.cssText="position:fixed;inset:0;background:#08080f;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0";
      pomRenderFSOverlay(fs);
      pomFSInterval=setInterval(()=>pomRenderFSOverlay(fs),500);
    },100);
  } else {
    (document.exitFullscreen||document.webkitExitFullscreen||function(){}).call(document);
    pomState.isFullScreen=false;
    pomCleanupFS();
  }
}

let pomFSInterval=null;
function pomCleanupFS(){
  clearInterval(pomFSInterval);
  const fs=document.getElementById("pom-fs-overlay");
  if(fs) fs.remove();
}

function pomRenderFSOverlay(el){
  const m=Math.floor(pomState.timeLeft/60).toString().padStart(2,"0");
  const s=(pomState.timeLeft%60).toString().padStart(2,"0");
  const subs=getSubjects();
  const activeSub=subs.find(sub=>sub.id===pomState.subject);
  const ringColor=pomState.mode==="work"?"#FFE66D":pomState.mode==="longbreak"?"#C77DFF":"#06D6A0";
  const modeLabel=pomState.mode==="work"?"🍅 Focus Time":pomState.mode==="longbreak"?"🏆 Long Break":"☕ Short Break";
  const statusText=pomState.running?"● RUNNING":pomState.mode==="work"?"READY":"PAUSED";
  el.innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;gap:0;padding:40px">
      <div style="font-size:11px;letter-spacing:4px;color:#555;text-transform:uppercase;margin-bottom:18px">${modeLabel}</div>
      <div style="font-size:min(22vw,260px);font-weight:300;color:${ringColor};font-family:monospace;line-height:1;letter-spacing:4px;text-shadow:0 0 80px ${ringColor}44;user-select:none">${m}:${s}</div>
      <div style="font-size:12px;color:#444;letter-spacing:3px;margin-top:14px">${statusText}</div>
      ${activeSub?`<div style="margin-top:10px;font-size:14px;color:${activeSub.color};font-weight:bold;letter-spacing:1px">${activeSub.icon} ${activeSub.name}</div>`:""}
      ${pomState.taskName?`<div style="margin-top:6px;font-size:12px;color:#555;font-style:italic">${esc(pomState.taskName)}</div>`:""}
      <div style="display:flex;gap:14px;margin-top:36px;flex-wrap:wrap;justify-content:center">
        ${!pomState.running?`<button onclick="pomStart()" style="background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border:none;padding:14px 36px;border-radius:12px;font-size:16px;cursor:pointer;font-weight:bold;letter-spacing:0.5px">&#9654; Start</button>`:""}
        ${pomState.running?`<button onclick="pomPause()" style="background:#1a1a28;border:1px solid #333;color:#ccc;padding:14px 28px;border-radius:12px;font-size:16px;cursor:pointer">&#9646;&#9646; Pause</button>`:""}
        <button onclick="pomReset()" style="background:#1a1a28;border:1px solid #333;color:#ccc;padding:14px 28px;border-radius:12px;font-size:16px;cursor:pointer">&#8635; Reset</button>
        <button onclick="pomToggleFullScreen()" style="background:#1a1a28;border:1px solid #333;color:#666;padding:14px 20px;border-radius:12px;font-size:14px;cursor:pointer">&#10005; Exit</button>
      </div>
      <div style="display:flex;justify-content:center;gap:10px;margin-top:28px">
        ${[1,2,3,4].map(i=>`<div style="width:12px;height:12px;border-radius:50%;background:${i<=(pomState.sessions%4)||(pomState.sessions>0&&pomState.sessions%4===0&&i===4)?'#FFE66D':'#1e1e2e'};box-shadow:${i<=(pomState.sessions%4)||(pomState.sessions>0&&pomState.sessions%4===0&&i===4)?'0 0 8px #FFE66D88':'none'}"></div>`).join("")}
      </div>
      <div style="margin-top:20px;font-size:11px;color:#222;font-style:italic">"${POM_QUOTES[pomState.quoteIdx]}"</div>
    </div>`;
}

// [FIX C9] Handle browser Back inside NEET/JEE hub
window.addEventListener('popstate', ()=>{
  if(state.view === 'neetjee' && njState.tab !== 'home'){
    njState.tab = 'home';
    switchView('neetjee');
  }
});

// Exit full screen on ESC — also clean up overlay
function _pomFSChange(){
  if(!document.fullscreenElement && !document.webkitFullscreenElement){
    pomState.isFullScreen=false;
    pomCleanupFS();
  }
}
document.addEventListener("fullscreenchange",_pomFSChange);
document.addEventListener("webkitfullscreenchange",_pomFSChange);

function pomSetSubject(sid){
  pomState.subject=sid;
  render();
}

function pomGetSubjectHoursFormatted(sid){
  const secs=pomState.subjectHours[sid]||0;
  const h=Math.floor(secs/3600);
  const m=Math.floor((secs%3600)/60);
  if(h>0) return h+"h "+m+"m";
  return m+"m";
}

function pomTotalHoursFormatted(){
  const total=Object.values(pomState.subjectHours).reduce((a,b)=>a+b,0);
  const h=Math.floor(total/3600);
  const m=Math.floor((total%3600)/60);
  if(h>0) return h+"h "+m+"m";
  return m+"m";
}

function updatePomDisplay(){
  const el=document.getElementById("pom-display");
  if(!el) return;
  const m=Math.floor(pomState.timeLeft/60).toString().padStart(2,"0");
  const s=(pomState.timeLeft%60).toString().padStart(2,"0");
  el.textContent=`${m}:${s}`;
  const label=document.getElementById("pom-label");
  if(label) label.textContent=pomState.mode==="work"?"🍅 Focus Time":pomState.mode==="longbreak"?"🏆 Long Break":"☕ Short Break";
  // Update progress ring
  const total=pomState.mode==="work"?pomState.workMins*60:pomState.mode==="longbreak"?pomState.longBreak*60:pomState.shortBreak*60;
  const pct=1-(pomState.timeLeft/total);
  const circ=document.getElementById("pom-ring-fill");
  if(circ){
    const r=90,circumference=2*Math.PI*r;
    circ.style.strokeDasharray=circumference;
    circ.style.strokeDashoffset=circumference*(1-pct);
    circ.style.stroke=pomState.mode==="work"?"#FFE66D":pomState.mode==="longbreak"?"#C77DFF":"#06D6A0";
  }
  const statusEl=document.getElementById("pom-status");
  if(statusEl) statusEl.textContent=pomState.running?"● RUNNING":pomState.mode==="work"?"READY":"PAUSED";
  // Update document title
  if(pomState.running){
    document.title=`⏱ ${m}:${s} ${pomState.mode==="work"?"📚":"☕"} — Exam Is Near`;
  } else {
    document.title="Exam Is Near — Study Smart | by ArkSetu";
  }
}

function renderPomodoro(){
  const m=Math.floor(pomState.timeLeft/60).toString().padStart(2,"0");
  const s=(pomState.timeLeft%60).toString().padStart(2,"0");
  const subs=getSubjects();
  const total=pomState.mode==="work"?pomState.workMins*60:pomState.mode==="longbreak"?pomState.longBreak*60:pomState.shortBreak*60;
  const pct=1-(pomState.timeLeft/total);
  const r=90, circumference=2*Math.PI*r;
  const offset=circumference*(1-pct);
  const ringColor=pomState.mode==="work"?"#FFE66D":pomState.mode==="longbreak"?"#C77DFF":"#06D6A0";
  const activeSub=subs.find(sub=>sub.id===pomState.subject);
  const isLongBreak=pomState.mode==="longbreak";

  // Break overlay
  const breakOverlayHTML=pomState.breakOverlay?`
    <div style="position:fixed;inset:0;background:#00000099;z-index:9998;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)">
      <div style="background:#0f0f18;border:2px solid ${isLongBreak?'#C77DFF':'#06D6A0'};border-radius:20px;padding:40px 32px;text-align:center;max-width:380px;width:92%;animation:fadeInUp 0.3s ease">
        <div style="font-size:60px;margin-bottom:12px;animation:float 2s ease-in-out infinite">${isLongBreak?"🏆":"☕"}</div>
        <div style="font-size:22px;font-weight:bold;color:${isLongBreak?'#C77DFF':'#06D6A0'};margin-bottom:6px">${isLongBreak?"Long Break Earned!":"Session Complete!"}</div>
        <div style="font-size:13px;color:#888;margin-bottom:4px">Session <b style="color:#FFE66D">${pomState.sessions}</b> done${activeSub?" · "+esc(activeSub.icon+" "+activeSub.name):""}</div>
        ${isLongBreak?`<div style="font-size:12px;color:#C77DFF;margin-bottom:4px;font-weight:bold">🎉 4 sessions completed! You've earned a long break!</div>`:""}
        <div style="font-size:13px;color:#555;margin-bottom:28px;line-height:1.8">${isLongBreak?"Enjoy a well-deserved "+pomState.longBreak+"-minute break.":"You've earned a "+pomState.shortBreak+"-minute break.<br>Your brain will thank you!"}</div>
        <div style="font-size:11px;color:#333;font-style:italic;margin-bottom:20px;padding:10px;background:#0a0a12;border-radius:8px">"${POM_QUOTES[pomState.quoteIdx]}"</div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn-gold" onclick="pomStartBreak()" style="padding:13px 26px;font-size:14px">${isLongBreak?"🏆":"☕"} Start Break (${isLongBreak?pomState.longBreak:pomState.shortBreak} min)</button>
          <button class="btn-ghost" onclick="pomSkipBreak()" style="padding:13px 20px;font-size:13px;color:#FF6B35;border-color:#FF6B3544">⏭ Skip Break</button>
        </div>
      </div>
    </div>`:""

  const subjectStats=subs.filter(s=>pomState.subjectHours[s.id]>0).map(s=>`
    <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:#0a0a12;border-radius:8px;border:1px solid #1e1e2e">
      <span style="font-size:18px">${s.icon}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;color:#ccc;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(s.name)}</div>
        <div style="height:3px;background:#111;border-radius:2px;margin-top:5px;overflow:hidden">
          <div style="height:100%;width:${Math.min(100,(pomState.subjectHours[s.id]||0)/3600*20)}%;background:${s.color};border-radius:2px;transition:width 0.5s"></div>
        </div>
      </div>
      <div style="font-size:13px;font-weight:bold;color:${s.color};flex-shrink:0">${pomGetSubjectHoursFormatted(s.id)}</div>
    </div>`).join("");

  // Recent session log (last 5)
  const recentLog = pomState.sessionLog.filter(l=>l.mode==="work").slice(-5).reverse();

  return`${breakOverlayHTML}
  <div id="pom-fullscreen-wrap" style="background:#08080f;min-height:100%">
  <div class="fade-in" style="width:100%;padding:22px 24px 40px">

    <!-- Header row -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:20px;font-weight:bold;letter-spacing:0.3px">🍅 Pomodoro Timer</div>
        <div style="font-size:10px;color:#444;letter-spacing:1.5px;text-transform:uppercase;margin-top:3px">Focus · Flow · Succeed · Exam Is Near</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="font-size:12px;color:#444">Sessions: <span style="color:#06D6A0;font-weight:bold;font-size:15px">${pomState.sessions}</span>${pomState.sessions>0?` &nbsp;·&nbsp; <span style="color:#FFE66D;font-weight:bold">${pomTotalHoursFormatted()}</span> total`:""}</div>
        <button onclick="pomToggleSound()" title="Toggle sound" style="background:#0f0f18;border:1px solid #2a2a3a;color:${pomState.soundOn?'#FFE66D':'#444'};padding:7px 12px;border-radius:10px;font-family:inherit;font-size:13px;cursor:pointer;transition:all 0.2s">${pomState.soundOn?"🔔":"🔕"}</button>
        <button onclick="pomToggleFullScreen()" style="background:#0f0f18;border:1px solid #2a2a3a;color:#888;padding:7px 15px;border-radius:10px;font-family:inherit;font-size:12px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor='#FFE66D';this.style.color='#FFE66D'" onmouseout="this.style.borderColor='#2a2a3a';this.style.color='#888'">⛶ Full Screen</button>
      </div>
    </div>

    <!-- TWO-COLUMN MAIN LAYOUT -->
    <div style="display:grid;grid-template-columns:minmax(280px,420px) 1fr;gap:20px;align-items:start">

      <!-- LEFT: Timer -->
      <div>
        <!-- Preset selector -->
        <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
          ${POM_PRESETS.map((p,i)=>`<button onclick="pomSetPreset(${i})"
            style="flex:1;min-width:60px;padding:7px 4px;border-radius:8px;font-family:inherit;font-size:11px;cursor:pointer;transition:all 0.2s;border:1px solid ${pomState.preset===i?ringColor:'#222'};background:${pomState.preset===i?ringColor+'22':'#0f0f18'};color:${pomState.preset===i?ringColor:'#555'};font-weight:${pomState.preset===i?'bold':'normal'}">
            ${p.label}${i<3?`<div style="font-size:9px;opacity:0.7;margin-top:2px">${p.work}m</div>`:"<div style='font-size:9px;opacity:0.7;margin-top:2px'>Set</div>"}
          </button>`).join("")}
        </div>

        <!-- Custom timer inputs (show when Custom preset selected) -->
        ${pomState.preset===3?`
        <div class="card" style="margin-bottom:14px;padding:14px;border-color:#333">
          <div class="section-label" style="margin-bottom:10px">⚙️ Custom Duration</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px">
            <div><div style="font-size:10px;color:#555;margin-bottom:4px">Work (min)</div><input id="pom-custom-work" type="number" min="1" max="90" value="${pomState.workMins}" style="text-align:center;font-size:14px;font-weight:bold;color:#FFE66D"/></div>
            <div><div style="font-size:10px;color:#555;margin-bottom:4px">Short break</div><input id="pom-custom-short" type="number" min="1" max="30" value="${pomState.shortBreak}" style="text-align:center;font-size:14px;font-weight:bold;color:#06D6A0"/></div>
            <div><div style="font-size:10px;color:#555;margin-bottom:4px">Long break</div><input id="pom-custom-long" type="number" min="1" max="60" value="${pomState.longBreak}" style="text-align:center;font-size:14px;font-weight:bold;color:#C77DFF"/></div>
          </div>
          <button class="btn-gold" onclick="pomApplyCustom()" style="width:100%;padding:9px;font-size:12px">✅ Apply Custom</button>
        </div>`:""}

        <div class="card" style="padding:32px 24px;text-align:center;border-color:${pomState.mode==='work'?'#FFE66D33':pomState.mode==='longbreak'?'#C77DFF33':'#06D6A033'};background:linear-gradient(160deg,#0f0f18,#12121f)">
          <div id="pom-label" style="font-size:11px;color:#888;margin-bottom:18px;letter-spacing:3px;text-transform:uppercase">${pomState.mode==="work"?"🍅 Focus Time":pomState.mode==="longbreak"?"🏆 Long Break":"☕ Short Break"}</div>

          <!-- SVG Ring -->
          <div style="position:relative;display:inline-block;margin-bottom:18px">
            <svg width="240" height="240" viewBox="0 0 260 260" style="transform:rotate(-90deg)">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:${ringColor};stop-opacity:1"/>
                  <stop offset="100%" style="stop-color:${pomState.mode==='work'?'#ff6b35':pomState.mode==='longbreak'?'#a78bfa':'#059669'};stop-opacity:1"/>
                </linearGradient>
              </defs>
              <circle cx="130" cy="130" r="${r+10}" fill="none" stroke="#0d0d18" stroke-width="2"/>
              <circle cx="130" cy="130" r="${r}" fill="none" stroke="#1a1a28" stroke-width="18"/>
              <circle id="pom-ring-fill" cx="130" cy="130" r="${r}" fill="none" stroke="url(#ringGrad)" stroke-width="18"
                stroke-linecap="round"
                style="stroke-dasharray:${circumference};stroke-dashoffset:${offset};transition:stroke-dashoffset 1s linear,stroke 0.5s;filter:drop-shadow(0 0 10px ${ringColor}88)"/>
            </svg>
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
              <div id="pom-display" style="font-size:58px;font-weight:bold;color:${ringColor};font-family:monospace;line-height:1;text-shadow:0 0 30px ${ringColor}55">${m}:${s}</div>
              <div id="pom-status" style="font-size:10px;color:#444;margin-top:6px;letter-spacing:2px">${pomState.running?"● RUNNING":pomState.mode==="work"?"READY":"PAUSED"}</div>
              ${activeSub?`<div style="margin-top:6px;font-size:11px;color:${activeSub.color};font-weight:bold">${activeSub.icon} ${esc(activeSub.name)}</div>`:""}
            </div>
          </div>

          <!-- Task input -->
          <div style="margin-bottom:16px">
            <input placeholder="What are you working on? (optional)" value="${esc(pomState.taskName)}"
              oninput="pomState.taskName=this.value"
              style="text-align:center;font-size:12px;color:#888;background:#0a0a12;border-color:#1e1e2e"/>
          </div>

          <!-- Controls -->
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn-gold" onclick="pomStart()" ${pomState.running?"disabled":""} style="padding:13px 30px;font-size:14px;${pomState.running?'opacity:0.45;cursor:not-allowed':''}">▶ ${pomState.running?"Running…":"Start"}</button>
            <button class="btn-ghost" onclick="pomPause()" style="padding:13px 22px;font-size:14px" title="Pause (Space)">⏸</button>
            <button class="btn-ghost" onclick="pomReset()" style="padding:13px 22px;font-size:14px" title="Reset (R)">↺</button>
          </div>

          <!-- Keyboard hint -->
          <div style="font-size:10px;color:#1e1e2e;margin-top:10px;letter-spacing:1px">SPACE = Start/Pause &nbsp;·&nbsp; R = Reset</div>

          <!-- Session dots -->
          <div style="display:flex;justify-content:center;gap:8px;margin-top:18px">
            ${[1,2,3,4].map(i=>`<div style="width:10px;height:10px;border-radius:50%;background:${i<=(pomState.sessions%4)||(pomState.sessions>0&&pomState.sessions%4===0&&i===4)?'#FFE66D':'#1e1e2e'};transition:background 0.4s;box-shadow:${i<=(pomState.sessions%4)||(pomState.sessions>0&&pomState.sessions%4===0&&i===4)?'0 0 6px #FFE66D88':'none'}"></div>`).join("")}
          </div>
          <div style="font-size:10px;color:#222;margin-top:6px;letter-spacing:1px">4 SESSIONS → LONG BREAK (${pomState.longBreak} min)</div>
        </div>

        <!-- Motivational quote -->
        ${pomState.running?`
        <div style="margin-top:12px;padding:12px 16px;background:#0a0a12;border:1px solid #1a1a28;border-radius:10px;text-align:center">
          <div style="font-size:11px;color:#333;font-style:italic">"${POM_QUOTES[pomState.quoteIdx]}"</div>
        </div>`:""}

        <!-- How it works -->
        <div class="card" style="margin-top:14px">
          <div class="section-label">ℹ️ How It Works</div>
          <div style="font-size:12px;color:#555;line-height:2.1">
            1️⃣ Pick a subject &amp; set a task<br>
            2️⃣ Hit <b style="color:#FFE66D">Start</b> — focus session begins<br>
            3️⃣ Break overlay appears — take it or skip it<br>
            4️⃣ Every <b style="color:#C77DFF">4 sessions</b> = ${pomState.longBreak}-min long break 🏆<br>
            📊 Hours tracked per subject automatically &amp; synced!
          </div>
        </div>
      </div>

      <!-- RIGHT: Subject + Stats -->
      <div style="display:flex;flex-direction:column;gap:14px">

        <!-- Subject Selector -->
        <div class="card" style="border-color:${activeSub?activeSub.color+'55':'#2a2a3a'}">
          <div class="section-label" style="margin-bottom:12px">📚 Choose Subject</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${subs.map(s=>`<button onclick="pomSetSubject('${s.id}')"
              style="background:${pomState.subject===s.id?s.color+'22':'#0a0a12'};border:1px solid ${pomState.subject===s.id?s.color:'#1e1e2e'};color:${pomState.subject===s.id?s.color:'#555'};padding:9px 15px;border-radius:22px;font-family:inherit;font-size:12px;cursor:pointer;transition:all 0.2s;font-weight:${pomState.subject===s.id?'bold':'normal'};box-shadow:${pomState.subject===s.id?'0 0 12px '+s.color+'44':'none'}">
              ${s.icon} ${esc(s.name)}
            </button>`).join("")}
          </div>
          ${activeSub?`<div style="margin-top:14px;padding:10px 14px;background:#0a0a12;border-radius:10px;border:1px solid ${activeSub.color}33;display:flex;align-items:center;justify-content:space-between">
            <div style="font-size:13px;color:${activeSub.color};font-weight:bold">${activeSub.icon} ${esc(activeSub.name)}</div>
            <div style="font-size:12px;color:#FFE66D;font-weight:bold">⏱ ${pomGetSubjectHoursFormatted(activeSub.id)} logged</div>
          </div>`:`<div style="margin-top:12px;font-size:12px;color:#333;text-align:center;padding:8px">← Select a subject to begin</div>`}
        </div>

        <!-- Study Hours per Subject -->
        <div class="card" style="flex:1">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:6px">
            <div class="section-label" style="margin-bottom:0">📊 Study Hours by Subject</div>
            ${Object.keys(pomState.subjectHours).length>0?`<button onclick="if(confirm('Clear all study hour data?')){pomState.subjectHours={};pomSaveHours();render();}" style="background:none;border:1px solid #2a2a3a;color:#444;padding:4px 10px;border-radius:6px;font-family:inherit;font-size:10px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.color='#FF6B35';this.style.borderColor='#FF6B3544'" onmouseout="this.style.color='#444';this.style.borderColor='#2a2a3a'">🗑 Clear</button>`:""}
          </div>
          ${subjectStats?`<div style="display:flex;flex-direction:column;gap:8px">${subjectStats}</div>`
            :`<div style="text-align:center;padding:40px 0;color:#2a2a3a">
              <div style="font-size:36px;margin-bottom:10px">📭</div>
              <div style="font-size:13px">No data yet</div>
              <div style="font-size:11px;margin-top:4px;color:#222">Start a session to track your hours</div>
            </div>`}
          <!-- All subjects summary even if 0 -->
          ${subjectStats?"":subs.map(s=>`
            <div style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:8px;opacity:0.35">
              <span style="font-size:16px">${s.icon}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:11px;color:#555">${esc(s.name)}</div>
                <div style="height:2px;background:#111;border-radius:2px;margin-top:4px"></div>
              </div>
              <div style="font-size:11px;color:#333">0m</div>
            </div>`).join("")}
        </div>

        <!-- Recent session log -->
        ${recentLog.length>0?`
        <div class="card">
          <div class="section-label" style="margin-bottom:10px">🕓 Recent Sessions</div>
          ${recentLog.map(l=>{
            const sub=subs.find(s=>s.id===l.subject);
            const mins=Math.floor(l.duration/60);
            const t=new Date(l.timestamp);
            const timeStr=t.getHours().toString().padStart(2,"0")+":"+t.getMinutes().toString().padStart(2,"0");
            return `<div style="display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:7px;background:#0a0a12;margin-bottom:5px">
              <span style="font-size:14px">${sub?.icon||"📚"}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:11px;color:#aaa;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(sub?.name||l.subject)}</div>
                <div style="font-size:10px;color:#333">${timeStr}</div>
              </div>
              <div style="font-size:11px;font-weight:bold;color:#FFE66D;flex-shrink:0">${mins}m</div>
            </div>`;
          }).join("")}
        </div>`:""}

      </div>

    </div><!-- end grid -->
  </div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════

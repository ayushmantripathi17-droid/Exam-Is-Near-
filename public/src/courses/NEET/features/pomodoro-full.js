import { state } from "../../../core/app-state.js";
import { S } from "../../../core/firebase-sync.js";
import { render } from "../ui/render-core.js";
import { esc, showToast } from "../../../utils/helpers.js";
import { spawnStars } from "./clock-alarms-timer.js";
import { getSubjects } from "../../../core/course-selector.js";
import { njState } from "../../../shared/exam-hub-state.js";
import { switchView } from "./exam-dates-actions.js";

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
    switchView('dashboard', false);
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
  const ringColor2=pomState.mode==="work"?"#ff6b35":pomState.mode==="longbreak"?"#a78bfa":"#059669";
  const activeSub=subs.find(sub=>sub.id===pomState.subject);
  const isLongBreak=pomState.mode==="longbreak";
  const modeLabel=pomState.mode==="work"?"🍅 Focus Time":pomState.mode==="longbreak"?"🏆 Long Break":"☕ Short Break";
  const statusText=pomState.running?"● RUNNING":pomState.mode==="work"?"READY":"PAUSED";
  const dotOn=(i)=>i<=(pomState.sessions%4)||(pomState.sessions>0&&pomState.sessions%4===0&&i===4);

  const breakOverlayHTML=pomState.breakOverlay?`
    <div class="pm-ovl">
      <div class="pm-ovl-box" style="--bc:${isLongBreak?'#C77DFF':'#06D6A0'}">
        <div style="font-size:60px;margin-bottom:12px;animation:float 2s ease-in-out infinite">${isLongBreak?"🏆":"☕"}</div>
        <div style="font-size:22px;font-weight:800;color:var(--bc);margin-bottom:6px">${isLongBreak?"Long Break Earned!":"Session Complete!"}</div>
        <div style="font-size:13px;color:var(--text-4,#888);margin-bottom:4px">Session <b style="color:#FFE66D">${pomState.sessions}</b> done${activeSub?" · "+esc(activeSub.icon+" "+activeSub.name):""}</div>
        ${isLongBreak?`<div style="font-size:12px;color:#C77DFF;margin-bottom:4px;font-weight:700">🎉 4 sessions completed! You've earned a long break!</div>`:""}
        <div style="font-size:13px;color:var(--text-5,#777);margin-bottom:22px;line-height:1.8">${isLongBreak?"Enjoy a well-deserved "+pomState.longBreak+"-minute break.":"You've earned a "+pomState.shortBreak+"-minute break.<br>Your brain will thank you!"}</div>
        <div style="font-size:12px;color:var(--text-5,#777);font-style:italic;margin-bottom:20px;padding:12px;background:color-mix(in srgb,var(--text,#eee) 5%,transparent);border-radius:12px">"${POM_QUOTES[pomState.quoteIdx]}"</div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="pm-btn p" onclick="pomStartBreak()">${isLongBreak?"🏆":"☕"} Start Break (${isLongBreak?pomState.longBreak:pomState.shortBreak} min)</button>
          <button class="pm-btn" onclick="pomSkipBreak()" style="color:#FF6B35;border-color:#FF6B3555">⏭ Skip Break</button>
        </div>
      </div>
    </div>`:"";

  const subjectStats=subs.filter(s=>pomState.subjectHours[s.id]>0).map(s=>`
    <div class="pm-row" style="--c:${s.color}">
      <span class="pm-row-ic">${s.icon}</span>
      <div style="flex:1;min-width:0">
        <div class="pm-row-n">${esc(s.name)}</div>
        <div class="pm-mini"><i style="width:${Math.min(100,(pomState.subjectHours[s.id]||0)/3600*20)}%"></i></div>
      </div>
      <div class="pm-row-v">${pomGetSubjectHoursFormatted(s.id)}</div>
    </div>`).join("");

  const recentLog=pomState.sessionLog.filter(l=>l.mode==="work").slice(-5).reverse();

  const css=`<style>
.pm{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);--rc:${ringColor};width:100%;padding:8px 4px 40px}
.pm *{box-sizing:border-box}
.pm-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:18px}
.pm-h1{font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--txt);line-height:1.1}
.pm-h2{font-size:13px;color:var(--mute);margin-top:6px}
.pm-tools{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:12.5px;color:var(--mute)}
.pm-tools b{font-size:15px}
.pm-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--line);background:var(--surf);color:var(--text-2,#ccc);padding:10px 16px;border-radius:12px;font-weight:700;font-size:13px;font-family:inherit;cursor:pointer;transition:.2s}
.pm-btn:hover{border-color:var(--acc);transform:translateY(-1px)}
.pm-btn.p{background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-color:transparent;box-shadow:0 6px 18px -6px #FFB70088}
.pm-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
.pm-grid{display:grid;grid-template-columns:minmax(300px,440px) 1fr;gap:18px;align-items:start}
@media(max-width:860px){.pm-grid{grid-template-columns:1fr}}
.pm-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:20px;padding:20px}
.pm-lbl{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--mute);margin-bottom:12px}
.pm-presets{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:14px}
.pm-pre{border:1px solid var(--line);background:var(--surf);color:var(--mute);padding:9px 4px;border-radius:12px;font-family:inherit;font-size:11.5px;font-weight:600;cursor:pointer;transition:.2s;text-align:center}
.pm-pre small{display:block;font-size:9.5px;opacity:.7;margin-top:2px}
.pm-pre.on{border-color:var(--rc);color:var(--rc);background:color-mix(in srgb,var(--rc) 14%,var(--surf));font-weight:800}
.pm-timer{text-align:center;padding:26px 20px;border-color:color-mix(in srgb,var(--rc) 35%,var(--line));background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--rc) 14%,transparent),transparent 65%),var(--glass-bg,var(--surf))}
.pm-mode{font-size:11px;letter-spacing:3px;color:var(--text-4,#888);text-transform:uppercase;margin-bottom:14px;font-weight:700}
.pm-ringw{position:relative;display:inline-block;margin-bottom:16px;max-width:100%}
.pm-ringw svg{display:block;max-width:100%;height:auto}
.pm-ringt{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
#pom-display{font-size:56px;font-weight:800;color:var(--rc);font-family:'JetBrains Mono',monospace;line-height:1;letter-spacing:-2px;text-shadow:0 0 30px color-mix(in srgb,var(--rc) 40%,transparent)}
#pom-status{font-size:10px;color:var(--mute);margin-top:8px;letter-spacing:2px;font-weight:700}
.pm-task{width:100%;text-align:center;font-size:13px;border-radius:12px;padding:11px 13px;margin:0 0 16px}
.pm-ctl{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.pm-ctl .pm-btn.p{padding:12px 30px;font-size:14px}
.pm-ctl .pm-btn{padding:12px 20px;font-size:14px}
.pm-hint{font-size:10px;color:var(--text-7,#666);margin-top:12px;letter-spacing:1px}
.pm-dots{display:flex;justify-content:center;gap:8px;margin-top:18px}
.pm-dots i{width:10px;height:10px;border-radius:50%;background:color-mix(in srgb,var(--txt) 12%,transparent);transition:.4s}
.pm-dots i.on{background:#FFE66D;box-shadow:0 0 8px #FFE66D99}
.pm-cap{font-size:10px;color:var(--mute);margin-top:7px;letter-spacing:1px}
.pm-quote{margin-top:12px;padding:12px 16px;border:1px solid var(--line);border-radius:14px;text-align:center;font-size:12px;color:var(--mute);font-style:italic}
.pm-how{margin-top:14px;font-size:12.5px;color:var(--mute);line-height:2}
.pm-how b{color:var(--txt)}
.pm-side{display:flex;flex-direction:column;gap:14px}
.pm-subs{display:flex;flex-wrap:wrap;gap:8px}
.pm-sub{--c:#7C6CF0;border:1px solid var(--line);background:var(--surf);color:var(--mute);padding:9px 14px;border-radius:99px;font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer;transition:.2s}
.pm-sub:hover{color:var(--txt);border-color:var(--c)}
.pm-sub.on{border-color:var(--c);color:var(--c);background:color-mix(in srgb,var(--c) 16%,var(--surf));box-shadow:0 6px 16px -8px var(--c);font-weight:800}
.pm-cur{margin-top:14px;padding:12px 14px;border-radius:14px;border:1px solid color-mix(in srgb,var(--c) 30%,var(--line));background:color-mix(in srgb,var(--c) 8%,transparent);display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.pm-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid var(--line);border-radius:14px;margin-bottom:8px}
.pm-row-ic{font-size:19px}
.pm-row-n{font-size:12.5px;font-weight:700;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pm-mini{height:4px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);margin-top:6px;overflow:hidden}
.pm-mini i{display:block;height:100%;background:var(--c);border-radius:99px;transition:width .5s}
.pm-row-v{font-size:13px;font-weight:800;color:var(--c);flex-shrink:0}
.pm-empty{text-align:center;padding:30px 0;color:var(--mute)}
.pm-empty b{display:block;color:var(--txt);margin:8px 0 3px}
.pm-log{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;background:color-mix(in srgb,var(--txt) 4%,transparent);margin-bottom:6px}
.pm-ovl{position:fixed;inset:0;background:#000000aa;z-index:9998;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)}
.pm-ovl-box{background:var(--surf);border:2px solid var(--bc);border-radius:24px;padding:36px 30px;text-align:center;max-width:400px;width:92%;animation:fadeInUp .3s ease}
</style>`;

  return`${breakOverlayHTML}${css}
  <div id="pom-fullscreen-wrap" style="background:var(--bg);min-height:100%">
  <div class="pm fade-in">

    <div class="pm-head">
      <div>
        <div class="pm-h1">🍅 Pomodoro</div>
        <div class="pm-h2">Focus · Flow · Succeed</div>
      </div>
      <div class="pm-tools">
        <span>Sessions <b style="color:#06D6A0">${pomState.sessions}</b>${pomState.sessions>0?` · <b style="color:var(--gold,#FFE66D)">${pomTotalHoursFormatted()}</b> total`:""}</span>
        <button class="pm-btn" onclick="pomToggleSound()" title="Toggle sound" style="padding:9px 13px;color:${pomState.soundOn?'#FFE66D':'var(--mute)'}">${pomState.soundOn?"🔔":"🔕"}</button>
        <button class="pm-btn" onclick="pomToggleFullScreen()">⛶ Full Screen</button>
      </div>
    </div>

    <div class="pm-grid">
      <div>
        <div class="pm-presets">
          ${POM_PRESETS.map((p,i)=>`<button class="pm-pre ${pomState.preset===i?"on":""}" onclick="pomSetPreset(${i})">${p.label}${i<3?`<small>${p.work}m</small>`:`<small>Set</small>`}</button>`).join("")}
        </div>

        ${pomState.preset===3?`
        <div class="pm-card" style="margin-bottom:14px;padding:16px">
          <div class="pm-lbl">⚙️ CUSTOM DURATION</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
            <div><div style="font-size:10px;color:var(--mute);margin-bottom:5px">Work (min)</div><input id="pom-custom-work" type="number" min="1" max="90" value="${pomState.workMins}" style="text-align:center;font-size:14px;font-weight:800;color:#FFE66D;margin:0"/></div>
            <div><div style="font-size:10px;color:var(--mute);margin-bottom:5px">Short break</div><input id="pom-custom-short" type="number" min="1" max="30" value="${pomState.shortBreak}" style="text-align:center;font-size:14px;font-weight:800;color:#06D6A0;margin:0"/></div>
            <div><div style="font-size:10px;color:var(--mute);margin-bottom:5px">Long break</div><input id="pom-custom-long" type="number" min="1" max="60" value="${pomState.longBreak}" style="text-align:center;font-size:14px;font-weight:800;color:#C77DFF;margin:0"/></div>
          </div>
          <button class="pm-btn p" onclick="pomApplyCustom()" style="width:100%">✅ Apply Custom</button>
        </div>`:""}

        <div class="pm-card pm-timer">
          <div id="pom-label" class="pm-mode">${modeLabel}</div>
          <div class="pm-ringw">
            <svg width="250" height="250" viewBox="0 0 260 260" style="transform:rotate(-90deg)">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:${ringColor};stop-opacity:1"/>
                  <stop offset="100%" style="stop-color:${ringColor2};stop-opacity:1"/>
                </linearGradient>
              </defs>
              <circle cx="130" cy="130" r="${r}" fill="none" stroke="currentColor" style="color:color-mix(in srgb,var(--txt) 9%,transparent)" stroke-width="16"/>
              <circle id="pom-ring-fill" cx="130" cy="130" r="${r}" fill="none" stroke="url(#ringGrad)" stroke-width="16"
                stroke-linecap="round"
                style="stroke-dasharray:${circumference};stroke-dashoffset:${offset};transition:stroke-dashoffset 1s linear,stroke .5s;filter:drop-shadow(0 0 8px ${ringColor}66)"/>
            </svg>
            <div class="pm-ringt">
              <div id="pom-display">${m}:${s}</div>
              <div id="pom-status">${statusText}</div>
              ${activeSub?`<div style="margin-top:8px;font-size:11.5px;color:${activeSub.color};font-weight:700">${activeSub.icon} ${esc(activeSub.name)}</div>`:""}
            </div>
          </div>

          <input class="pm-task" placeholder="What are you working on? (optional)" value="${esc(pomState.taskName)}" oninput="pomState.taskName=this.value"/>

          <div class="pm-ctl">
            <button class="pm-btn p" onclick="pomStart()" ${pomState.running?"disabled":""}>▶ ${pomState.running?"Running…":"Start"}</button>
            <button class="pm-btn" onclick="pomPause()" title="Pause (Space)">⏸</button>
            <button class="pm-btn" onclick="pomReset()" title="Reset (R)">↺</button>
          </div>
          <div class="pm-hint">SPACE = Start/Pause &nbsp;·&nbsp; R = Reset</div>

          <div class="pm-dots">${[1,2,3,4].map(i=>`<i class="${dotOn(i)?"on":""}"></i>`).join("")}</div>
          <div class="pm-cap">4 SESSIONS → LONG BREAK (${pomState.longBreak} min)</div>
        </div>

        ${pomState.running?`<div class="pm-quote">"${POM_QUOTES[pomState.quoteIdx]}"</div>`:""}

        <div class="pm-card" style="margin-top:14px">
          <div class="pm-lbl">ℹ️ HOW IT WORKS</div>
          <div class="pm-how">
            1️⃣ Pick a subject &amp; set a task<br>
            2️⃣ Hit <b>Start</b> — focus session begins<br>
            3️⃣ Break overlay appears — take it or skip it<br>
            4️⃣ Every <b style="color:#C77DFF">4 sessions</b> = ${pomState.longBreak}-min long break 🏆<br>
            📊 Hours tracked per subject automatically &amp; synced!
          </div>
        </div>
      </div>

      <div class="pm-side">
        <div class="pm-card" ${activeSub?`style="border-color:color-mix(in srgb,${activeSub.color} 40%,var(--line))"`:""}>
          <div class="pm-lbl">📚 CHOOSE SUBJECT</div>
          <div class="pm-subs">
            ${subs.map(s=>`<button class="pm-sub ${pomState.subject===s.id?"on":""}" style="--c:${s.color}" onclick="pomSetSubject('${s.id}')">${s.icon} ${esc(s.name)}</button>`).join("")}
          </div>
          ${activeSub?`<div class="pm-cur" style="--c:${activeSub.color}">
            <div style="font-size:13.5px;color:${activeSub.color};font-weight:800">${activeSub.icon} ${esc(activeSub.name)}</div>
            <div style="font-size:12px;color:var(--gold,#FFE66D);font-weight:800">⏱ ${pomGetSubjectHoursFormatted(activeSub.id)} logged</div>
          </div>`:`<div style="margin-top:14px;font-size:12.5px;color:var(--mute);text-align:center">Select a subject to begin</div>`}
        </div>

        <div class="pm-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:6px">
            <div class="pm-lbl" style="margin:0">📊 STUDY HOURS BY SUBJECT</div>
            ${Object.keys(pomState.subjectHours).length>0?`<button class="pm-btn" style="padding:5px 11px;font-size:11px" onclick="if(confirm('Clear all study hour data?')){pomState.subjectHours={};pomSaveHours();render();}">Clear</button>`:""}
          </div>
          ${subjectStats?subjectStats
            :`<div class="pm-empty"><div style="font-size:34px">📭</div><b>No data yet</b><span style="font-size:12px">Start a session to track your hours</span></div>`}
        </div>

        ${recentLog.length>0?`
        <div class="pm-card">
          <div class="pm-lbl">🕓 RECENT SESSIONS</div>
          ${recentLog.map(l=>{
            const sub=subs.find(s=>s.id===l.subject);
            const mins=Math.floor(l.duration/60);
            const t=new Date(l.timestamp);
            const timeStr=t.getHours().toString().padStart(2,"0")+":"+t.getMinutes().toString().padStart(2,"0");
            return `<div class="pm-log">
              <span style="font-size:15px">${sub?.icon||"📚"}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;font-weight:600;color:var(--txt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(sub?.name||l.subject)}</div>
                <div style="font-size:10.5px;color:var(--mute)">${timeStr}</div>
              </div>
              <div style="font-size:12px;font-weight:800;color:var(--gold,#FFE66D)">${mins}m</div>
            </div>`;
          }).join("")}
        </div>`:""}
      </div>
    </div>
  </div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// FLASHCARDS — per-subject individual decks

export { POM_PRESETS, POM_QUOTES, _pomFSChange, pomApplyCustom, pomCleanupFS, pomFSInterval, pomGetSubjectHoursFormatted, pomPause, pomPlayChime, pomRenderFSOverlay, pomReset, pomSaveHours, pomSaveLog, pomSaveSettings, pomSetPreset, pomSetSubject, pomSkipBreak, pomStart, pomStartBreak, pomState, pomToggleFullScreen, pomToggleSound, pomTotalHoursFormatted, renderPomodoro, updatePomDisplay };

if (typeof window !== "undefined") {
  Object.assign(window, { POM_PRESETS, POM_QUOTES, _pomFSChange, pomApplyCustom, pomCleanupFS, pomFSInterval, pomGetSubjectHoursFormatted, pomPause, pomPlayChime, pomRenderFSOverlay, pomReset, pomSaveHours, pomSaveLog, pomSaveSettings, pomSetPreset, pomSetSubject, pomSkipBreak, pomStart, pomStartBreak, pomState, pomToggleFullScreen, pomToggleSound, pomTotalHoursFormatted, renderPomodoro, updatePomDisplay });
}

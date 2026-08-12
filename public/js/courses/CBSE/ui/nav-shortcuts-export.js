// ══════════════════════════════════════════════════════════════
function openNavDrawer(){
  const d=document.getElementById("mobile-nav-drawer");
  if(d){d.classList.add("open");document.body.style.overflow="hidden";}
  // Update active state
  const btns=d.querySelectorAll(".nav-drawer-pill");
  btns.forEach(b=>{
    b.classList.toggle("active",b.onclick&&b.onclick.toString().includes("switchView('"+state.view+"')"));
  });
  // Show NEET/JEE and Admin if applicable
  const njBtn=document.getElementById("mobile-neetjee-btn");
  if(njBtn) njBtn.style.display=(activeCourse&&activeCourse!=='nfsu'&&activeCourse!=='cbse10'&&activeCourse!=='cbse12')?"":"none";
  const admBtn=document.getElementById("mobile-admin-btn");
  if(admBtn) admBtn.style.display=isAdmin()?"":"none";
}
function closeNavDrawer(){
  const d=document.getElementById("mobile-nav-drawer");
  if(d){d.classList.remove("open");document.body.style.overflow="";}
}

// ══════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════════════════════
document.addEventListener("keydown",(e)=>{
  // Don't trigger shortcuts when typing in inputs
  if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA"||e.target.tagName==="SELECT") return;
  // Pomodoro shortcuts (Space, R) are handled in pomodoro view
  if(state.view==="pomodoro"){
    if(e.key===" "){e.preventDefault();pomState.running?pomPause():pomStart();}
    if(e.key.toLowerCase()==="r"&&!e.ctrlKey){e.preventDefault();pomReset();}
  }
  // Global shortcuts
  if(e.ctrlKey||e.metaKey) return; // Don't override browser shortcuts
  const shortcutMap={
    '1':'dashboard','2':'subjects','3':'alarms','4':'pomodoro',
    '5':'flashcards','6':'quiz','7':'ai','8':'analytics',
    'l':'log','f':'files','s':'sync'
  };
  if(shortcutMap[e.key]&&!e.shiftKey){
    e.preventDefault();
    switchView(shortcutMap[e.key]);
  }
  // ? to show shortcuts
  if(e.key==="?"&&e.shiftKey){e.preventDefault();showKeyboardShortcuts();}
});

function showKeyboardShortcuts(){
  const existing=document.getElementById("kbd-shortcuts-modal");
  if(existing){existing.remove();return;}
  const modal=document.createElement("div");
  modal.id="kbd-shortcuts-modal";
  modal.style.cssText="position:fixed;inset:0;background:#00000088;z-index:9996;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)";
  modal.innerHTML=`<div style="background:#0f0f18;border:1px solid #2a2a3a;border-radius:16px;padding:24px;max-width:480px;width:92%;max-height:80vh;overflow-y:auto;animation:fadeInUp 0.2s ease">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="font-size:16px;font-weight:bold;color:#EDE8E0">⌨️ Keyboard Shortcuts</div>
      <button onclick="document.getElementById('kbd-shortcuts-modal').remove()" style="background:none;border:none;color:#666;font-size:18px;cursor:pointer">✕</button>
    </div>
    <div style="font-size:11px;color:#444;letter-spacing:1px;margin-bottom:12px;text-transform:uppercase">Navigation</div>
    ${[['1','Overview / Dashboard'],['2','Study Subjects'],['3','Alarms & Timer'],['4','Pomodoro'],['5','Flashcards'],['6','Quiz Mode'],['7','AI Assistant'],['8','Analytics'],['L','Study Log'],['F','Files'],['S','Sync & Account']].map(([k,l])=>`<div class="kbd-shortcut"><span>${l}</span><kbd class="kbd-key">${k}</kbd></div>`).join("")}
    <div style="font-size:11px;color:#444;letter-spacing:1px;margin:12px 0;text-transform:uppercase">Pomodoro (when on timer page)</div>
    ${[['Space','Start / Pause'],['R','Reset timer']].map(([k,l])=>`<div class="kbd-shortcut"><span>${l}</span><kbd class="kbd-key">${k}</kbd></div>`).join("")}
    <div class="kbd-shortcut" style="margin-top:8px;border-top:1px solid #111;padding-top:10px"><span>Show this panel</span><kbd class="kbd-key">Shift + ?</kbd></div>
  </div>`;
  modal.addEventListener("click",(e)=>{if(e.target===modal)modal.remove();});
  document.body.appendChild(modal);
}

// ══════════════════════════════════════════════════════════════
// EXPORT PROGRESS AS JSON (free) / PDF (Pro only)
// ══════════════════════════════════════════════════════════════
function exportProgressJSON(){
  const data={
    exportedAt:new Date().toISOString(),
    version:"Exam Is Near v15",
    course:activeCourse||"nfsu",
    progress:state.progress,
    studyLog:state.studyLog,
    materials:state.materials.map(m=>({...m,data:undefined})),
    alarms:state.alarms,
    streak:getStreak(),
    totalHours:getTotalHours(),
    subjectProgress:getSubjects().map(s=>({id:s.id,name:s.name,pct:getSubjectPct(s.id)})),
    flashcards:flashDecks,
    njMistakes:njState.mistakes,
    njSRSCards:njState.srsCards,
  };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=`exam-is-near-backup-${today()}.json`;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},100);
  showToast("✅ Progress exported!","success");
}

// ── PRO: Export Progress as PDF ──
async function exportProgressPDF(){
  // Gate: requires Pro, server-verified
  try{
    await verifyProOrThrow("Export as PDF");
  }catch(err){
    if(err.message==="sign_in_required"){
      showToast("⚠️ Please sign in first to use PDF export","alarm");
    } else {
      showToast("⭐ PDF export is a Pro feature","info");
      openProModal();
    }
    return;
  }

  const subjectRows = getSubjects().map(s=>{
    const pct = getSubjectPct(s.id);
    const h = (()=>{
      let hrs=0;
      Object.values(state.studyLog).forEach(log=>{if(log.subject===s.id) hrs+=(log.hours||0);});
      return hrs;
    })();
    return`<tr>
      <td>${s.icon} ${s.name}</td>
      <td>${pct}%</td>
      <td>${h}h</td>
      <td style="background:#f0f0f0;border-radius:4px;overflow:hidden;height:14px;position:relative">
        <div style="position:absolute;top:0;left:0;height:100%;width:${pct}%;background:linear-gradient(90deg,#FFE66D,#ffb700)"></div>
      </td>
    </tr>`;
  }).join("");

  const recentLogs = Object.entries(state.studyLog).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,10);
  const logRows = recentLogs.map(([date,log])=>`<tr><td>${date}</td><td>${log.hours||0}h</td><td>${log.subject||"—"}</td><td>${log.mood?["😴","😫","😐","😊","🔥"][log.mood-1]||"":""}</td></tr>`).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Exam Is Near — Study Report (${today()})</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#111;padding:32px;font-size:13px}
  h1{font-size:22px;font-weight:800;margin-bottom:4px;color:#111}
  .subtitle{font-size:11px;color:#888;margin-bottom:24px}
  .badge{display:inline-block;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#111;border-radius:6px;padding:2px 10px;font-size:10px;font-weight:700;margin-left:8px}
  .section{margin-bottom:24px}
  h2{font-size:14px;font-weight:700;margin-bottom:10px;color:#333;border-bottom:2px solid #eee;padding-bottom:6px}
  .stats{display:flex;gap:16px;margin-bottom:24px}
  .stat{background:#f8f8f8;border-radius:10px;padding:14px 20px;flex:1;text-align:center}
  .stat-val{font-size:24px;font-weight:800;color:#111}
  .stat-lbl{font-size:10px;color:#888;margin-top:2px}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;padding:8px;background:#f0f0f0;font-weight:600;font-size:11px;color:#555}
  td{padding:8px;border-bottom:1px solid #f0f0f0;vertical-align:middle}
  .footer{margin-top:32px;font-size:10px;color:#bbb;text-align:center}
  @media print{body{padding:16px}}
</style>
</head>
<body>
  <h2>📚 Exam Is Near <span class="badge">⭐ PRO</span></h2>
  <div class="subtitle">Study Report — Generated ${new Date().toLocaleDateString('en-IN',{dateStyle:'long'})} · by ArkSetu</div>

  <div class="stats">
    <div class="stat"><div class="stat-val">${getTotalHours()}h</div><div class="stat-lbl">Total Hours</div></div>
    <div class="stat"><div class="stat-val">${getStreak()}</div><div class="stat-lbl">Day Streak 🔥</div></div>
    <div class="stat"><div class="stat-val">${Object.values(state.progress).filter(Boolean).length}</div><div class="stat-lbl">Topics Done</div></div>
    <div class="stat"><div class="stat-val">${getSubjects().length}</div><div class="stat-lbl">Subjects</div></div>
  </div>

  <div class="section">
    <h2>Subject Progress</h2>
    <table>
      <thead><tr><th>Subject</th><th>Progress</th><th>Hours</th><th style="width:40%">Bar</th></tr></thead>
      <tbody>${subjectRows}</tbody>
    </table>
  </div>

  ${recentLogs.length>0?`
  <div class="section">
    <h2>Recent Study Sessions</h2>
    <table>
      <thead><tr><th>Date</th><th>Hours</th><th>Subject</th><th>Mood</th></tr></thead>
      <tbody>${logRows}</tbody>
    </table>
  </div>`:""}

  <div class="footer">Exam Is Near by ArkSetu · exam-is-near.web.app · Pro Member Report</div>
<div class="ai-sidebar-overlay" id="ai-sidebar-overlay" onclick="_closeAISidebarMobile()"></div>
</body>
</html>`;

  // FIX #12: Use Blob + URL.createObjectURL instead of deprecated document.write
  // document.write is injection-prone and triggers parser warnings in modern browsers
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);
  const printWin = window.open(blobUrl, "_blank", "width=800,height=900");
  if(!printWin){ URL.revokeObjectURL(blobUrl); showToast("⚠️ Allow popups to generate PDF","alarm"); return; }
  printWin.addEventListener("load", ()=>{ printWin.print(); URL.revokeObjectURL(blobUrl); }, { once: true });
  // Fallback: revoke after 30s even if load never fires
  setTimeout(()=>URL.revokeObjectURL(blobUrl), 30000);
  showToast("✅ PDF report ready — use 'Save as PDF' in print dialog","success");
}

function importProgressJSON(){
  const inp=document.createElement("input");
  inp.type="file";inp.accept=".json";
  inp.onchange=async(e)=>{
    try{
      const file=e.target.files[0];
      // FIX #10: Reject files larger than 5 MB to prevent DoS via huge JSON
      if(file.size > 5*1024*1024){showToast("⚠️ Backup file too large (max 5 MB)","alarm");return;}
      const text=await file.text();
      const data=JSON.parse(text);
      if(!data.progress&&!data.studyLog){showToast("⚠️ Invalid backup file","alarm");return;}
      if(!confirm("Import will overwrite your current progress, study log, and materials. Continue?")){return;}

      // FIX #10: Validate types and cap array sizes before merging
      if(data.progress && typeof data.progress === "object" && !Array.isArray(data.progress)){
        // Cap object keys to 5000 entries
        const keys=Object.keys(data.progress).slice(0,5000);
        const safe={};keys.forEach(k=>{if(typeof k==="string"&&k.length<100)safe[k]=!!data.progress[k];});
        state.progress=safe;S("progress",safe);
      }
      if(data.studyLog && typeof data.studyLog === "object" && !Array.isArray(data.studyLog)){
        const keys=Object.keys(data.studyLog).slice(0,1000);
        const safe={};keys.forEach(k=>{
          const v=data.studyLog[k];
          if(typeof v==="object"&&v!==null) safe[k]={hours:parseFloat(v.hours)||0,mood:parseInt(v.mood)||3,subject:String(v.subject||"").slice(0,50)};
        });
        state.studyLog=safe;S("studyLog",safe);
      }
      if(Array.isArray(data.materials)){
        const safe=data.materials.slice(0,500).map(m=>({
          id:String(m.id||genId()).slice(0,50),subjectId:String(m.subjectId||"").slice(0,50),
          type:String(m.type||"📝 Note").slice(0,30),title:String(m.title||"").slice(0,200),
          content:String(m.content||"").slice(0,10000),
          tags:Array.isArray(m.tags)?m.tags.slice(0,20).map(t=>String(t).slice(0,50)):[],
          created:String(m.created||today()).slice(0,20),pinned:!!m.pinned
        }));
        state.materials=safe;S("materials",safe);
      }
      if(Array.isArray(data.alarms)){
        const safe=data.alarms.slice(0,100).map(a=>({
          id:String(a.id||genId()).slice(0,50),time:String(a.time||"07:00").slice(0,5),
          label:String(a.label||"Study").slice(0,100),enabled:!!a.enabled,
          repeat:!!a.repeat,days:Array.isArray(a.days)?a.days.slice(0,7).map(Number):[],
          ringtone:String(a.ringtone||"classic").slice(0,30)
        }));
        state.alarms=safe;S("alarms",safe);
      }
      if(data.flashcards && typeof data.flashcards==="object"&&!Array.isArray(data.flashcards)){
        const safe={};Object.keys(data.flashcards).slice(0,50).forEach(k=>{
          if(Array.isArray(data.flashcards[k])){
            safe[k]=data.flashcards[k].slice(0,200).map(c=>({
              front:String(c.front||"").slice(0,500),back:String(c.back||"").slice(0,1000)
            }));
          }
        });
        Object.assign(flashDecks,safe);saveFlashDecks();
      }
      if(Array.isArray(data.njMistakes)){
        njState.mistakes=data.njMistakes.slice(0,500);njSave();
      }
      if(Array.isArray(data.njSRSCards)){
        njState.srsCards=data.njSRSCards.slice(0,500);njSave();
      }
      showToast("✅ Progress imported successfully!","success");
      spawnStars();render();
    }catch(err){showToast("⚠️ Import failed: "+err.message,"alarm");}
  };
  inp.click();
}

// ══════════════════════════════════════════════════════════════
// RENDER ABOUT — About Us & Contact Us (for AdSense compliance)
// ══════════════════════════════════════════════════════════════
// AI STUDY ASSISTANT VIEW
// ══════════════════════════════════════════════════════════════
let aiTyping = false;

// Dynamic quick prompts and welcome cards based on active course
function getAIQuickPrompts(){
  if(activeCourse==='neet') return [
    {icon:"🧬", label:"Cell Biology", prompt:"Explain the cell cycle, mitosis vs meiosis with key NCERT points"},
    {icon:"🫀", label:"Human Physiology", prompt:"Explain the cardiac cycle and blood pressure regulation for NEET"},
    {icon:"⚛️", label:"Physical Chemistry", prompt:"Explain chemical equilibrium, Le Chatelier's principle with examples"},
    {icon:"🌿", label:"Plant Kingdom", prompt:"Compare Bryophyta, Pteridophyta, Gymnosperms and Angiosperms"},
    {icon:"🔬", label:"Genetics", prompt:"Explain Mendel's laws, codominance and sex-linked inheritance"},
    {icon:"💊", label:"Biomolecules", prompt:"List key enzymes, cofactors and metabolic pathways for NEET"},
    {icon:"🌡️", label:"Thermodynamics", prompt:"Explain Hess's law, enthalpy and entropy with numerical examples"},
    {icon:"⚡", label:"Revision Plan", prompt:"Create a 3-hour NEET revision plan covering Biology, Physics and Chemistry"},
  ];
  if(activeCourse==='jee') return [
    {icon:"⚛️", label:"Mechanics", prompt:"Explain Newton's laws, circular motion and work-energy theorem for JEE"},
    {icon:"🔌", label:"Electrostatics", prompt:"Explain Coulomb's law, Gauss's theorem and capacitors for JEE"},
    {icon:"📐", label:"Calculus", prompt:"Explain differentiation and integration techniques for JEE Mains"},
    {icon:"🧪", label:"Organic Chemistry", prompt:"Explain reaction mechanisms: SN1, SN2, addition and elimination"},
    {icon:"📊", label:"Probability", prompt:"Explain probability, Bayes theorem and binomial distribution for JEE"},
    {icon:"🌊", label:"Waves & Optics", prompt:"Explain interference, diffraction and polarization of light for JEE"},
    {icon:"⚗️", label:"Equilibrium", prompt:"Explain chemical equilibrium, Kp, Kc and Le Chatelier's principle"},
    {icon:"⚡", label:"Revision Plan", prompt:"Create a 3-hour JEE revision plan focusing on weak topics"},
  ];
  if(activeCourse==='cbse10') return [
    {icon:"📐", label:"Quadratics", prompt:"Explain quadratic equations — factorisation, formula method, discriminant with examples for CBSE Class 10"},
    {icon:"🔬", label:"Chemical Reactions", prompt:"List and explain the 5 types of chemical reactions for CBSE Class 10 Science"},
    {icon:"💡", label:"Electricity", prompt:"Explain Ohm's Law, series and parallel circuits with formulas for CBSE Class 10"},
    {icon:"🌍", label:"Nationalism", prompt:"Summarise the rise of nationalism in Europe for CBSE Class 10 History"},
    {icon:"🧬", label:"Heredity", prompt:"Explain Mendel's laws of inheritance and sex determination for CBSE Class 10 Biology"},
    {icon:"📖", label:"English Writing", prompt:"Explain formal letter writing format for CBSE Class 10 with a sample complaint letter"},
    {icon:"📊", label:"Statistics", prompt:"Explain mean, median and mode from grouped data with examples for CBSE Class 10"},
    {icon:"⚡", label:"Revision Plan", prompt:"Create a 3-hour CBSE Class 10 revision plan for board exam preparation"},
  ];
  if(activeCourse==='cbse12') return [
    {icon:"📐", label:"Integration", prompt:"Explain integration by parts and substitution method with solved examples for CBSE Class 12"},
    {icon:"⚛️", label:"Semiconductors", prompt:"Explain p-n junction diode, transistor as amplifier and logic gates for CBSE Class 12 Physics"},
    {icon:"🧪", label:"Organic Chemistry", prompt:"Explain reaction mechanisms of alcohols, phenols and aldehydes for CBSE Class 12 Chemistry"},
    {icon:"🧬", label:"Molecular Biology", prompt:"Explain DNA replication, transcription and translation for CBSE Class 12 Biology"},
    {icon:"📊", label:"Macroeconomics", prompt:"Explain national income accounting — methods and concepts for CBSE Class 12 Economics"},
    {icon:"📖", label:"English Literature", prompt:"Summarise the themes and character analysis of 'Deep Water' and 'The Rattrap' for CBSE Class 12"},
    {icon:"🔢", label:"Probability", prompt:"Explain Bayes' theorem and binomial distribution with examples for CBSE Class 12 Maths"},
    {icon:"⚡", label:"Revision Plan", prompt:"Create a 3-hour CBSE Class 12 board exam revision plan covering key chapters"},
  ];
  // Default NFSU
  return [
    {icon:"⌨️", label:"Virtual Functions", prompt:"Explain virtual functions and polymorphism in C++ with examples"},
    {icon:"🗄️", label:"Normalization", prompt:"Explain database normalization 1NF to BCNF with examples"},
    {icon:"⚖️", label:"Legal Maxims", prompt:"List 10 important Latin legal maxims with meanings for exam"},
    {icon:"📊", label:"SQL Joins", prompt:"Explain all types of SQL JOINs with syntax and examples"},
    {icon:"📖", label:"Jurisprudence", prompt:"Explain Hohfeld's analysis of rights and duties"},
    {icon:"📐", label:"Stats Formulas", prompt:"List all key Statistics formulas for mean, SD, correlation and regression"},
    {icon:"🧮", label:"PL/SQL Basics", prompt:"Explain PL/SQL block structure, cursors and triggers with examples"},
    {icon:"⚡", label:"Revision Plan", prompt:"Create a 3-hour power revision plan for my upcoming exams"},
  ];
}
function getAIWelcomeCards(){
  if(activeCourse==='neet') return [
    {icon:"🧬", title:"Biology (NCERT)", desc:"Cell biology, genetics, ecology, human physiology"},
    {icon:"⚛️", title:"Physics", desc:"Mechanics, electrostatics, optics, modern physics"},
    {icon:"🧪", title:"Chemistry", desc:"Organic, inorganic and physical chemistry"},
    {icon:"🔬", title:"Zoology & Botany", desc:"Plant kingdom, animal kingdom, reproduction"},
  ];
  if(activeCourse==='jee') return [
    {icon:"⚛️", title:"Physics", desc:"Mechanics, electrostatics, thermodynamics, optics"},
    {icon:"🧮", title:"Mathematics", desc:"Calculus, algebra, coordinate geometry, probability"},
    {icon:"🧪", title:"Chemistry", desc:"Organic reactions, physical chemistry, periodic table"},
    {icon:"📐", title:"Problem Solving", desc:"JEE Mains & Advanced problem strategies"},
  ];
  if(activeCourse==='cbse10') return [
    {icon:"📐", title:"Mathematics", desc:"Algebra, geometry, trigonometry, statistics"},
    {icon:"🔬", title:"Science", desc:"Physics, Chemistry, Biology — NCERT based"},
    {icon:"🌍", title:"Social Science", desc:"History, Geography, Civics, Economics"},
    {icon:"📖", title:"English & Hindi", desc:"Literature, grammar, writing skills"},
  ];
  if(activeCourse==='cbse12') return [
    {icon:"📐", title:"Mathematics", desc:"Calculus, algebra, vectors, probability"},
    {icon:"⚛️", title:"Physics & Chemistry", desc:"Modern physics, organic chemistry, electrochemistry"},
    {icon:"🧬", title:"Biology / Economics", desc:"Genetics, ecology, macroeconomics, money & banking"},
    {icon:"📖", title:"English Literature", desc:"Flamingo, Vistas, writing skills"},
  ];
  return [
    {icon:"⌨️", title:"C++ & OOP", desc:"Virtual functions, inheritance, polymorphism"},
    {icon:"🗄️", title:"RDBMS & SQL", desc:"Joins, normalization, PL/SQL triggers"},
    {icon:"📖", title:"Law Subjects", desc:"Jurisprudence, legal maxims, Law & Society"},
    {icon:"📊", title:"Statistics", desc:"Hypothesis testing, correlation, regression"},
  ];
}
// Backwards compat
const AI_QUICK_PROMPTS = [];  // unused — getAIQuickPrompts() used instead
const AI_WELCOME_CARDS = []; // unused — getAIWelcomeCards() used instead

function renderAI(){
  const hasHistory = aiHistory.length > 0;
  const subjectCtx = document.getElementById("ai-subject-ctx")?.value || "all";
  // Read pro status from in-memory cache for instant UI (no await needed)
  const proFromCache = !!(_proCache?.isPro);
  
  return`<div class="fade-in ai-container">
    <!-- Header -->
    <div class="ai-header">
      <div>
        <div style="font-size:18px;font-weight:bold;display:flex;align-items:center;gap:10px">
          <span style="background:linear-gradient(135deg,#4ECDC4,#06D6A0);-webkit-background-clip:text;-webkit-text-fill-color:transparent">AI Study Assistant</span>
          <div class="ai-status"><div class="ai-dot ${aiTyping?"thinking":""}"></div><span style="font-size:10px;color:#444;letter-spacing:1px">${aiTyping?"THINKING":"ONLINE"}</span></div>
          ${proFromCache?`<span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:8px;padding:2px 8px;font-weight:700">PRO ⭐</span>`:""}
        </div>
        <div style="font-size:11px;color:#333;margin-top:3px">${proFromCache?"Priority AI · Deeper answers · Longer context · History saved":"Groq LLaMA 3.3 · Upgrade to Pro for priority AI & chat history"}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <select id="ai-subject-ctx" class="ai-subject-select" onchange="render()">
          <option value="all">All Subjects</option>
          ${getSubjects().map(s=>`<option value="${s.id}">${s.icon} ${s.name}</option>`).join("")}
        </select>
        ${hasHistory?`<button class="ai-clear-btn" onclick="aiHistory=[];localStorage.removeItem('ein_ai_chat_history');render()">Clear</button>`:""}
      </div>
    </div>

    <!-- Chat Area -->
    <div class="ai-chat-wrap" id="ai-chat-box">
      ${hasHistory
        ? aiHistory.map((m,i) => renderAIMsgBubble(m,i)).join("")
        : `<div class="ai-welcome">
            <div class="ai-welcome-icon">🤖</div>
            <div>
              <div style="font-size:17px;font-weight:bold;color:#ccc;margin-bottom:6px">Hello! I'm your AI tutor</div>
              <div style="font-size:12px;color:#444;line-height:1.7">Ask me anything about your syllabus.<br>I know your progress and what you need to focus on.</div>
            </div>
            <div class="ai-welcome-grid">
              ${getAIWelcomeCards().map((c,i)=>`<div class="ai-welcome-card" onclick="setWelcomePrompt(${i})">
                <div class="ai-wc-icon">${c.icon}</div>
                <div class="ai-wc-title">${c.title}</div>
                <div class="ai-wc-desc">${c.desc}</div>
              </div>`).join("")}
            </div>
          </div>`
      }
    </div>

    <!-- Input Area -->
    <div class="ai-input-area">
      <div class="ai-chips">
        ${getAIQuickPrompts().map((p,i)=>`<button class="ai-chip" onclick="setQuickPrompt(${i})">${p.icon} ${p.label}</button>`).join("")}
      </div>
      <div class="ai-input-row" style="margin-top:10px">
        <textarea id="ai-input" class="ai-textarea" placeholder="Ask anything about your syllabus…" rows="1"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendAIMessage()}"
          oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,120)+'px'"></textarea>
        <button class="ai-send-btn" id="ai-send-btn" onclick="sendAIMessage()" ${aiTyping||((!proFromCache)&&freeAiMsgCount>=FREE_AI_MSG_LIMIT)?"disabled":""} title="${(!proFromCache)&&freeAiMsgCount>=FREE_AI_MSG_LIMIT?'Free message limit reached — upgrade to Pro':'Send (Enter)'}">
          ${aiTyping?`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#555" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#555" stroke-width="2" stroke-linecap="round"/></svg>`:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
        </button>
      </div>
      <div style="font-size:10px;color:#2a2a3a;margin-top:6px;text-align:center">${proFromCache?"Enter to send · Shift+Enter for new line · Priority AI · Powered by Groq":"Enter to send · Shift+Enter for new line · <span style=\"color:#FFE66D88\">Free: "+(Math.max(0,FREE_AI_MSG_LIMIT-freeAiMsgCount))+" messages left this session</span>"}</div>
    </div>
  </div>`;
}

function renderAIMsgBubble(m, i){
  const isUser = m.role === "user";
  const isThinking = m.text === "⏳ Thinking…";
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2,"0") + ":" + now.getMinutes().toString().padStart(2,"0");
  
  // Format AI response: convert **text** to bold, `code` to code, newlines to <br>
  // SECURITY FIX #6: Run through DOMPurify after markdown conversion to prevent
  // XSS from crafted AI responses exploiting the regex replacements.
  let html = esc(m.text);
  if(!isUser && !isThinking){
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#EDE8E0">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#aaa">$1</em>')
      .replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre>$1</pre>')
      .replace(/\`([^`]+)\`/g, '<code>$1</code>')
      .replace(/^#{1,3}\s(.+)$/gm, '<div style="font-weight:bold;color:#4ECDC4;margin:8px 0 4px">$1</div>')
      .replace(/^[-•]\s(.+)$/gm, '<div style="padding-left:12px;margin:3px 0">• $1</div>')
      .replace(/\n/g, '<br>');
    // Sanitize the generated HTML with DOMPurify (already loaded for docx preview)
    if(window.DOMPurify){
      html = DOMPurify.sanitize(html, {
        ALLOWED_TAGS:['strong','em','pre','code','div','br','span'],
        ALLOWED_ATTR:['style']
      });
    }
  }
  
  if(isThinking) return `<div class="ai-msg-row" style="animation:fadeInUp 0.2s ease">
    <div class="ai-avatar bot">🤖</div>
    <div class="ai-bubble thinking-bubble">
      <div class="ai-typing"><span></span><span></span><span></span></div>
    </div>
  </div>`;
  
  return `<div class="ai-msg-row ${isUser?"user":""}">
    <div class="ai-avatar ${isUser?"user":"bot"}">${isUser?(currentUser?.photoURL?`<img src="${currentUser.photoURL}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" onerror="this.parentElement.textContent='👤'"/>`:"👤"):"🤖"}</div>
    <div>
      <div class="ai-bubble ${isUser?"user":"bot"}">${isThinking?`<div class="ai-typing"><span></span><span></span><span></span></div>`:html}</div>
      <div class="ai-meta">${timeStr}</div>
    </div>
  </div>`;
}
function installPWA(){
  if(!deferredPrompt){showToast("ℹ️ App already installed or not supported","info");return;}
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(r=>{
    if(r.outcome==="accepted") showToast("🎉 App installed!","success");
    deferredPrompt=null;
    document.getElementById("pwa-install-btn").style.display="none";
  });
}

// ══════════════════════════════════════════════════════════════
// MOBILE NAV DRAWER
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
  <h1>📚 Exam Is Near <span class="badge">⭐ PRO</span></h1>
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
// ══════════════════════════════════════════════════════════════
function renderAbout(){
  return`<div class="fade-in">
    <!-- Hero -->
    <div style="text-align:center;padding:28px 16px 20px;margin-bottom:16px;background:linear-gradient(135deg,#0f0f18,#12121e);border:1px solid #1e1e2e;border-radius:16px;position:relative;overflow:hidden">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#FFE66D,#ff6b35,#4ECDC4)"></div>
      <div style="font-size:42px;margin-bottom:10px">📚</div>
      <div style="font-size:22px;font-weight:bold;background:linear-gradient(90deg,#FFE66D,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px">Exam Is Near</div>
      <div style="font-size:12px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">by ArkSetu</div>
      <div style="font-size:11px;color:#444;letter-spacing:1px;margin-bottom:12px">Study Smart · exam-is-near.web.app</div>
      <div style="font-size:12px;color:#777;max-width:500px;margin:0 auto;line-height:1.8">A free, powerful study companion built for students preparing for competitive and academic exams. Track your syllabus, study with Pomodoro, quiz yourself, and get AI-powered help — all in one place.</div>
    </div>

    <!-- About the App -->
    <div class="card" style="margin-bottom:12px">
      <div class="section-label">ℹ️ About Us</div>
      <div style="font-size:13px;color:#888;line-height:2">
        <b style="color:#EDE8E0">Exam Is Near</b> is a free Progressive Web App (PWA) by <b style="color:#FFE66D">ArkSetu</b> designed to help students study smarter, not harder.
      </div>
      <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${[
          {icon:"🍅",label:"Pomodoro Timer",desc:"Focused 25-min study blocks"},
          {icon:"🃏",label:"Flashcards",desc:"Active recall per subject"},
          {icon:"🧠",label:"Quiz Mode",desc:"Test yourself after every topic"},
          {icon:"🤖",label:"AI Assistant",desc:"Instant concept explanations"},
          {icon:"📈",label:"Analytics",desc:"Track your study hours & mood"},
          {icon:"🔄",label:"Cloud Sync",desc:"Sync progress across devices"},
          {icon:"⏰",label:"Smart Alarms",desc:"15 ringtones, repeat schedules"},
          {icon:"📁",label:"File Manager",desc:"Store notes, PDFs & links"},
        ].map(f=>`<div style="background:#0a0a12;border:1px solid #1e1e2e;border-radius:10px;padding:10px 12px;display:flex;gap:10px;align-items:flex-start">
          <span style="font-size:18px">${f.icon}</span>
          <div>
            <div style="font-size:12px;font-weight:bold;color:#ccc">${f.label}</div>
            <div style="font-size:10px;color:#555;margin-top:2px">${f.desc}</div>
          </div>
        </div>`).join("")}
      </div>
    </div>

    <!-- Developer -->
    <div class="card" style="margin-bottom:12px">
      <div class="section-label">🏢 Developed By</div>
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <div style="width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,#FFE66D,#ff6b35);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;font-weight:bold;color:#08080f">AS</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:16px;font-weight:bold;color:#EDE8E0">ArkSetu</div>
          <div style="font-size:11px;color:#555;margin-top:2px">Technology · Education · Innovation</div>
          <div style="font-size:11px;color:#444;margin-top:4px;line-height:1.7">Exam Is Near is proudly developed and maintained by ArkSetu — building smart, accessible tools for students everywhere.</div>
        </div>
      </div>
      <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
        <a href="https://exam-is-near.web.app" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:6px;background:#0a0a12;border:1px solid #4ECDC433;border-radius:8px;padding:8px 14px;text-decoration:none;color:#4ECDC4;font-size:11px;transition:all 0.2s" onmouseover="this.style.borderColor='#4ECDC4'" onmouseout="this.style.borderColor='#4ECDC433'">🌐 exam-is-near.web.app</a>
      </div>
    </div>

    <!-- Contact Us -->
    <div class="card" style="margin-bottom:12px;border-color:#4ECDC433">
      <div class="section-label">📬 Contact Us</div>
      <div style="font-size:12px;color:#777;line-height:1.9;margin-bottom:14px">
        Have a question, found a bug, or want to suggest a feature? We'd love to hear from you. Reach out via any of the channels below and we'll get back to you as soon as possible.
      </div>
      ${[
        {icon:"🌐",label:"Website",val:"exam-is-near.web.app",href:"https://exam-is-near.web.app",color:"#4ECDC4"},
        {icon:"🏢",label:"Developer",val:"ArkSetu",href:"https://exam-is-near.web.app",color:"#FFE66D"},
        {icon:"📧",label:"Email Us",val:"arksetu@gmail.com",href:"mailto:arksetu@gmail.com",color:"#06D6A0"},
        {icon:"🐛",label:"Bug Report",val:"arksetu@gmail.com",href:"mailto:arksetu@gmail.com?subject=Bug Report — Exam Is Near",color:"#ff6b35"},
        {icon:"💡",label:"Feature Request",val:"arksetu@gmail.com",href:"mailto:arksetu@gmail.com?subject=Feature Request — Exam Is Near",color:"#a78bfa"},
      ].map(c=>`<a href="${c.href}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:#0a0a12;border:1px solid #1e1e2e;border-radius:9px;text-decoration:none;margin-bottom:7px;transition:all 0.2s" onmouseover="this.style.borderColor='${c.color}55'" onmouseout="this.style.borderColor='#1e1e2e'">
        <span style="font-size:18px;flex-shrink:0">${c.icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:10px;color:#555;letter-spacing:1px;text-transform:uppercase">${c.label}</div>
          <div style="font-size:11px;color:${c.color};margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.val}</div>
        </div>
        <span style="color:#333;font-size:12px">→</span>
      </a>`).join("")}
    </div>

    <!-- Privacy & AdSense note -->
    <div class="card" style="margin-bottom:12px;border-color:#2a2a3a">
      <div class="section-label">🔒 Privacy & Ads</div>
      <div style="font-size:11px;color:#555;line-height:2">
        • All study data (progress, notes, flashcards) is stored locally on your device or in your own Google account via Firebase.<br>
        • We do not sell or share your personal data with third parties.<br>
        • This site uses <b style="color:#888">Google AdSense</b> to display ads that help keep the app free for everyone.<br>
        • Ads are served by Google and follow <a href="https://policies.google.com/privacy" target="_blank" style="color:#4ECDC4">Google's Privacy Policy</a>.<br>
        • You can manage ad personalisation via <a href="https://adssettings.google.com" target="_blank" style="color:#4ECDC4">Google Ad Settings</a>.
      </div>
    </div>

    <!-- Version -->
    <div class="card" style="border-color:#FFE66D22">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <div>
          <div style="font-size:11px;color:#555;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Version Info</div>
          <div style="font-size:13px;font-weight:bold;color:#FFE66D">Exam Is Near · Study Smart v16</div>
          <div style="font-size:10px;color:#555;margin-top:1px;letter-spacing:1px">by ArkSetu</div>
          <div style="font-size:10px;color:#444;margin-top:3px">© 2025–2026 ArkSetu. All rights reserved.</div>
        </div>
        <button class="btn-ghost" onclick="switchView('sync')" style="font-size:11px">🔄 Sync Settings</button>
      </div>
    </div>

    <!-- ── PRO PLAN CARD ── -->
    <div class="card" style="margin-top:12px;border-color:#FFE66D33;background:linear-gradient(135deg,#12100a,#0f0f18)">
      <div class="section-label">⭐ Upgrade to Pro</div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:16px">
        <div style="flex:1;min-width:180px">
          <div style="font-size:15px;font-weight:700;color:#FFE66D;margin-bottom:8px">Exam Is Near Pro</div>
          <div style="font-size:12px;color:#666;line-height:2">Unlock AI chat history, unlimited flashcards, cloud backup, advanced analytics, ad-free experience and PDF exports — for less than a cup of chai per day.</div>
        </div>
        <div style="text-align:center;flex-shrink:0;padding:4px">
          <div style="font-size:28px;font-weight:800;color:#FFE66D;font-family:'JetBrains Mono',monospace">₹149<span style="font-size:12px;color:#555;font-weight:400;font-family:'Inter',inherit">/mo</span></div>
          <div style="font-size:10px;color:#444;margin-bottom:12px">≈ ₹5/day</div>
          <button class="btn-gold" onclick="openProModal()" style="padding:10px 20px;font-size:13px;font-weight:700">⭐ Go Pro</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
        ${["🤖 AI Chat History","📚 Unlimited Flashcards","☁️ 25GB Cloud Backup","📈 Advanced Analytics","🚫 Ad-Free Experience","📤 Export as PDF","⚡ Priority AI Tutor","🔔 Early Feature Access"].map(f=>`
          <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:#666;padding:6px 4px">
            <span style="color:#06D6A0;font-size:11px;flex-shrink:0">✓</span>${f}
          </div>`).join("")}
      </div>
    </div>

    <!-- Privacy Policy link -->
    <div style="text-align:center;margin-top:16px">
      <a href="privacy.html" target="_blank" rel="noopener" style="font-size:11px;color:#333;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#666'" onmouseout="this.style.color='#333'">🔒 Privacy Policy</a>
      <span style="color:#1e1e2e;margin:0 8px">·</span>
      <a href="https://adssettings.google.com" target="_blank" rel="noopener" style="font-size:11px;color:#333;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#666'" onmouseout="this.style.color='#333'">Ad Settings</a>
    </div>

  </div>`;
}

// ── INIT ──
// Clear stale flashcards from localStorage (they had no subject context)
localStorage.removeItem("st_flashcards");
loadAll();  // async - calls render() internally
checkShareLinkOnLoad();
// Show course selector if no course explicitly chosen yet
// Clear stale activeCourse if it was set by old code (not by switchCourse)
const _courseChosen = localStorage.getItem("courseChosen");
if(!activeCourse || !_courseChosen){ 
  activeCourse = null;
  setTimeout(()=>showCourseSelector(), 900); 
}
// Request notification permission for alarms
if("Notification" in window && Notification.permission==="default"){
  setTimeout(()=>Notification.requestPermission(),2000);
}

// Clock — every second
setInterval(()=>{updateClock();checkAlarms();},1000);
updateClock();


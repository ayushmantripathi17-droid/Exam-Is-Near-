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
  if(activeCourse==='nfsu1') return [
    {icon:"⚖️", label:"Legal Methods", prompt:"Explain sources of law, precedent and statutory interpretation for Legal Methods"},
    {icon:"🤕", label:"Law of Tort", prompt:"Explain negligence, strict liability and general defenses in Law of Tort"},
    {icon:"🛒", label:"Consumer Protection", prompt:"Explain key provisions of the Consumer Protection Act with recent case examples"},
    {icon:"📖", label:"Law & Literature", prompt:"Explain the interdisciplinary approach of Law and Literature with examples"},
    {icon:"💻", label:"Computer Organization", prompt:"Explain computer organization basics: CPU, memory hierarchy, embedded systems"},
    {icon:"🧮", label:"C Programming", prompt:"Explain pointers, arrays and structures in C with code examples"},
    {icon:"📊", label:"Discrete Maths", prompt:"Explain set theory, relations and graph theory basics for Discrete Mathematics"},
    {icon:"📰", label:"Legal News", prompt:"Summarise the most important recent Indian legal news relevant to a first-year law student"},
  ];
  if(activeCourse==='nfsu3') return [
    {icon:"⚖️", label:"IPC → BNS", prompt:"Explain the key sections of Law of Crimes I (IPC) and their corresponding Bharatiya Nyaya Sanhita (BNS) sections"},
    {icon:"🏛️", label:"Article 14", prompt:"Explain Article 14 — Right to Equality, Rule of Law and Doctrine of Reasonable Classification with case law"},
    {icon:"📜", label:"Offer & Acceptance", prompt:"Explain offer, acceptance and revocation in Law of Contract I with landmark case laws"},
    {icon:"👨‍👩‍👧", label:"Family Law I", prompt:"Explain the essentials of a valid Hindu marriage and grounds for divorce under Family Law I"},
    {icon:"🌐", label:"Web Programming", prompt:"Explain how to connect PHP with MySQL and perform CRUD operations"},
    {icon:"🖥️", label:"OS Concepts", prompt:"Explain process scheduling algorithms and memory management in Operating Systems"},
    {icon:"📘", label:"Latest Bare Act", prompt:"What are the latest bare act changes I should know for Law of Crimes I, Constitutional Law and Contract Law this semester?"},
    {icon:"📰", label:"Legal News", prompt:"Summarise this week's most important Indian legal news relevant to a Sem III B.Sc. LL.B. student"},
  ];
  // NFSU Sem II — cpp, rdbms, legal (Legal Language), stats, laws (Law & Society), juris (Jurisprudence)
  if(activeCourse==='nfsu') return [
    {icon:"⌨️", label:"Virtual Functions", prompt:"Explain virtual functions and polymorphism in C++ with examples"},
    {icon:"🗄️", label:"Normalization", prompt:"Explain database normalization 1NF to BCNF with examples"},
    {icon:"✍️", label:"Legal Language", prompt:"Explain common legal maxims like factum valet, mens rea, actus reus and ubi jus ibi remedium"},
    {icon:"📊", label:"SQL Joins", prompt:"Explain all types of SQL JOINs with syntax and examples"},
    {icon:"⚖️", label:"Law & Society", prompt:"Explain Durkheim, Weber and Maine's theories on law and society"},
    {icon:"📖", label:"Jurisprudence", prompt:"Explain Hohfeld's analysis of rights and duties, and the schools of jurisprudence"},
    {icon:"📐", label:"Stats Formulas", prompt:"List all key Statistics formulas for mean, SD, correlation and regression"},
    {icon:"📘", label:"Bare Act & News", prompt:"What are the latest bare act amendments and recent legal news relevant to a Sem II B.Sc. LL.B. student?"},
  ];
  // Fallback (no course selected)
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
  if(activeCourse==='nfsu1') return [
    {icon:"⚖️", title:"Legal Methods & Tort", desc:"Sources of law, precedent, negligence, strict liability"},
    {icon:"🛒", title:"Consumer Protection", desc:"Consumer Protection Act, unfair trade practices"},
    {icon:"💻", title:"Computer & C", desc:"Computer organization, embedded systems, C programming"},
    {icon:"📊", title:"Discrete Maths", desc:"Set theory, relations, graph theory"},
  ];
  if(activeCourse==='nfsu3') return [
    {icon:"⚖️", title:"Law of Crimes I", desc:"IPC → BNS mapping, mens rea, offences against body & property"},
    {icon:"🏛️", title:"Constitutional Law I", desc:"Fundamental Rights, DPSP, writs, PIL"},
    {icon:"📜", title:"Contract & Family Law", desc:"Offer, acceptance, remedies, Hindu marriage & divorce"},
    {icon:"📘", title:"Bare Act & Legal News", desc:"Latest amendments (BNS/BNSS/BSA) and current legal developments"},
  ];
  if(activeCourse==='nfsu') return [
    {icon:"⌨️", title:"C++ & OOP", desc:"Virtual functions, inheritance, polymorphism"},
    {icon:"🗄️", title:"RDBMS & SQL", desc:"Joins, normalization, PL/SQL triggers"},
    {icon:"⚖️", title:"Legal Language & Law & Society", desc:"Legal maxims, drafting, sociology of law"},
    {icon:"📘", title:"Jurisprudence & Bare Act", desc:"Schools of jurisprudence, Statistics, latest legal news"},
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

// ── AI SESSION MANAGEMENT ──────────────────────────────────────
const AI_SESSIONS_KEY = 'ein_ai_sessions';
const AI_SESSION_MAX = 30;
let _aiSessions = [];       // [{id, title, ts, messages:[]}]
let _aiActiveSession = null; // id of active session
let _aiSidebarOpen = true;

function _aiLoadSessions(){
  try{ _aiSessions = JSON.parse(localStorage.getItem(AI_SESSIONS_KEY)||'[]'); }catch(e){ _aiSessions=[]; }
}
function _aiSaveSessions(){
  try{ localStorage.setItem(AI_SESSIONS_KEY, JSON.stringify(_aiSessions.slice(0, AI_SESSION_MAX))); }catch(e){}
}
function _aiSessionTitle(msgs){
  const first = msgs.find(m=>m.role==='user');
  if(!first) return 'New chat';
  return first.text.replace(/<[^>]+>/g,'').trim().slice(0,42) || 'New chat';
}
function aiNewChat(){
  _aiLoadSessions();
  const id = 'sess_'+Date.now();
  _aiActiveSession = id;
  aiHistory = [];
  const sess = {id, title:'New chat', ts: Date.now(), messages:[]};
  _aiSessions.unshift(sess);
  _aiSaveSessions();

  // In-place update — no full re-render flash
  const chatBox = document.getElementById('ai-chat-box');
  const topbarTitle = document.querySelector('.ai-topbar-title');
  const clearBtn = document.querySelector('.ai-clear-btn');
  const hintEl = document.querySelector('.ai-hint');

  if(chatBox){
    // Render welcome/empty state instead of wiping to blank
    chatBox.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:#333;text-align:center;padding:32px 24px">'
      +'<div style="font-size:36px;opacity:0.3">🤖</div>'
      +'<div style="font-size:14px;font-weight:600;color:#444">New conversation</div>'
      +'<div style="font-size:12px;color:#2a2a3a;line-height:1.6">Ask me anything about your syllabus,<br>concepts, or exam strategy.</div>'
      +'</div>';
  }
  if(topbarTitle) topbarTitle.textContent = 'AI Study Assistant';
  if(clearBtn) clearBtn.remove();

  // Refresh session list in sidebar
  const sessListEl = document.querySelector('.ai-sessions-list');
  if(sessListEl){
    const proFromCache = !!(_proCache?.isPro);
    // rebuild sessions HTML inline (same logic as renderAI)
    const today = new Date(); today.setHours(0,0,0,0);
    const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
    const week = new Date(today); week.setDate(today.getDate()-7);
    const grouped = {Today:[], Yesterday:[], 'This week':[], Older:[]};
    _aiSessions.forEach(s=>{
      const d=new Date(s.ts); d.setHours(0,0,0,0);
      if(d>=today) grouped.Today.push(s);
      else if(d>=yesterday) grouped.Yesterday.push(s);
      else if(d>=week) grouped['This week'].push(s);
      else grouped.Older.push(s);
    });
    let sessHtml='';
    for(const [label,items] of Object.entries(grouped)){
      if(!items.length) continue;
      sessHtml+='<div class="ai-sidebar-label">'+label+'</div>';
      sessHtml+=items.map(s=>'<div class="ai-session-item'+(_aiActiveSession===s.id?' active':'')+'" onclick="aiLoadSession(\''+s.id+'\')">'+'<span class="ai-session-title">'+esc(s.title)+'</span>'+'<span class="ai-session-meta">'+_aiRelTime(s.ts)+'</span>'+'<button class="ai-session-del" onclick="aiDeleteSession(\''+s.id+'\',event)" title="Delete">✕</button>'+'</div>').join('');
    }
    sessListEl.innerHTML = sessHtml || '<div style="padding:20px 14px;font-size:11px;color:#222;text-align:center;line-height:1.6">No conversations yet.<br>Start a new chat!</div>';
  }

  // On mobile, close sidebar after starting new chat
  if(window.innerWidth<=700) _closeAISidebarMobile();

  setTimeout(()=>{ const ta=document.getElementById('ai-input'); if(ta){ta.value='';ta.style.height='auto';ta.focus();} },50);
}
function aiLoadSession(id){
  _aiLoadSessions();
  const sess = _aiSessions.find(s=>s.id===id);
  if(!sess) return;
  _aiActiveSession = id;
  aiHistory = sess.messages.map(m=>({...m}));
  render();
  setTimeout(()=>{ const box=document.getElementById('ai-chat-box'); if(box) box.scrollTop=box.scrollHeight; },60);
  // On mobile, close sidebar after selecting session
  if(window.innerWidth<=700) _closeAISidebarMobile();
}
function aiDeleteSession(id, e){
  if(e){e.stopPropagation();e.preventDefault();}
  _aiLoadSessions();
  _aiSessions = _aiSessions.filter(s=>s.id!==id);
  _aiSaveSessions();
  if(_aiActiveSession===id){ _aiActiveSession=null; aiHistory=[]; }
  render();
}
function _aiPersistCurrentSession(){
  if(!_aiActiveSession) return;
  _aiLoadSessions();
  const idx = _aiSessions.findIndex(s=>s.id===_aiActiveSession);
  if(idx<0){
    _aiSessions.unshift({id:_aiActiveSession,title:_aiSessionTitle(aiHistory),ts:Date.now(),messages:[...aiHistory]});
  } else {
    _aiSessions[idx].messages = [...aiHistory];
    _aiSessions[idx].title = _aiSessionTitle(aiHistory);
    _aiSessions[idx].ts = Date.now();
  }
  _aiSaveSessions();
}
function aiToggleSidebar(){
  _aiSidebarOpen=!_aiSidebarOpen;
  const sb=document.getElementById('ai-sidebar');
  const isMobile=window.innerWidth<=700;
  if(sb){
    if(isMobile){
      sb.classList.toggle('mobile-open',_aiSidebarOpen);
      sb.classList.remove('collapsed');
    } else {
      sb.classList.toggle('collapsed',!_aiSidebarOpen);
    }
  }
  const btn=document.getElementById('ai-toggle-btn');
  if(btn) btn.innerHTML = _aiSidebarOpen ? _aiToggleIconOpen() : _aiToggleIconClosed();
  const ov=document.getElementById('ai-sidebar-overlay');
  if(ov && isMobile) ov.classList.toggle('visible',_aiSidebarOpen);
}
function _closeAISidebarMobile(){
  if(window.innerWidth>700) return;
  _aiSidebarOpen=false;
  const sb=document.getElementById('ai-sidebar');
  if(sb){ sb.classList.remove('mobile-open'); sb.classList.add('collapsed'); }
  const btn=document.getElementById('ai-toggle-btn');
  if(btn) btn.innerHTML=_aiToggleIconClosed();
  const ov=document.getElementById('ai-sidebar-overlay');
  if(ov) ov.classList.remove('visible');
}
function _aiToggleIconOpen(){
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="1.5"/></svg>';
}
function _aiToggleIconClosed(){
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="1.5" opacity="0.3"/></svg>';
}
function _aiRelTime(ts){
  const diff = Date.now()-ts;
  if(diff<60000) return 'now';
  if(diff<3600000) return Math.floor(diff/60000)+'m';
  if(diff<86400000) return Math.floor(diff/3600000)+'h';
  return Math.floor(diff/86400000)+'d';
}

function renderAI(){
  _aiLoadSessions();
  const hasHistory = aiHistory.length > 0;
  const proFromCache = !!(_proCache?.isPro);
  const sidebarCollapsed = !_aiSidebarOpen;
  const userName = currentUser?.displayName?.split(' ')[0] || 'there';

  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  const week = new Date(today); week.setDate(today.getDate()-7);
  const grouped = {Today:[], Yesterday:[], 'This week':[], Older:[]};
  _aiSessions.forEach(s=>{
    const d=new Date(s.ts); d.setHours(0,0,0,0);
    if(d>=today) grouped.Today.push(s);
    else if(d>=yesterday) grouped.Yesterday.push(s);
    else if(d>=week) grouped['This week'].push(s);
    else grouped.Older.push(s);
  });

  const sessHtml = Object.entries(grouped).map(([label,items])=>{
    if(!items.length) return '';
    return '<div class="ai-sidebar-label">'+label+'</div>'+
      items.map(s=>'<div class="ai-session-item'+(_aiActiveSession===s.id?' active':'')+'" onclick="aiLoadSession(\''+s.id+'\')">'+
        '<span class="ai-sess-icon">\uD83D\uDCAC</span>'+
        '<span class="ai-sess-title">'+esc(s.title)+'</span>'+
        '<span class="ai-sess-time">'+_aiRelTime(s.ts)+'</span>'+
        '<button class="ai-sess-del" onclick="aiDeleteSession(\''+s.id+'\',event)" title="Delete">\u2715</button>'+
        '</div>').join('');
  }).join('');

  const subSel = '<select id="ai-subject-ctx" class="ai-subject-select" onchange="render()"><option value="all">All subjects</option>'+
    getSubjects().map(s=>'<option value="'+s.id+'">'+s.icon+' '+s.name+'</option>').join('')+'</select>';

  const quickChips = getAIQuickPrompts().map((p,i)=>'<button class="ai-chip" onclick="setQuickPrompt('+i+')">'+p.icon+' '+p.label+'</button>').join('');

  const welcomeCards = getAIWelcomeCards().map((c,i)=>
    '<div class="ai-welcome-card" onclick="setWelcomePrompt('+i+')">'+
    '<div class="ai-wc-icon">'+c.icon+'</div>'+
    '<div class="ai-wc-title">'+c.title+'</div>'+
    '<div class="ai-wc-desc">'+c.desc+'</div></div>').join('');

  const msgs = hasHistory
    ? aiHistory.map((m,i)=>renderAIMsgBubble(m,i)).join('')
    : '<div class="ai-welcome">'+
        '<div class="ai-welcome-logo">\u2736</div>'+
        '<div><div style="font-size:20px;font-weight:700;color:#ccc;margin-bottom:6px">Hello, '+esc(userName)+'</div>'+
        '<div style="font-size:13px;color:#333;line-height:1.7">What would you like to study today?</div></div>'+
        '<div class="ai-welcome-grid">'+welcomeCards+'</div>'+
        '</div>';

  const sendBtn = '<button class="ai-send-btn" id="ai-send-btn" onclick="sendAIMessage()" '+(aiTyping||((!proFromCache)&&freeAiMsgCount>=FREE_AI_MSG_LIMIT)?'disabled':'')+'>'+
    (aiTyping
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#555" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#555" stroke-width="2" stroke-linecap="round"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>')+
    '</button>';

  const hint = proFromCache
    ? 'Enter to send \u00B7 Shift+Enter for new line \u00B7 Claude AI'
    : 'Enter to send \u00B7 <span style="color:#FFE66D66">Free: '+Math.max(0,FREE_AI_MSG_LIMIT-freeAiMsgCount)+' messages left</span> \u00B7 <span style="color:#4ECDC466;cursor:pointer" onclick="showProModal()">Upgrade \u2197</span>';

  return '<div class="fade-in ai-page">'+
    '<div class="ai-sidebar'+(sidebarCollapsed?' collapsed':'')+'" id="ai-sidebar">'+
      '<div class="ai-sidebar-top">'+
        '<button class="ai-new-chat-btn" onclick="aiNewChat()">'+
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'+
          'New chat</button></div>'+
      '<div class="ai-sessions-list">'+(_aiSessions.length ? sessHtml : '<div style="padding:20px 14px;font-size:11px;color:#222;text-align:center;line-height:1.6">No conversations yet.<br>Start a new chat!</div>')+'</div>'+
      '<div class="ai-sidebar-bottom">'+
        '<div class="ai-model-badge">'+
          '<div class="ai-model-dot'+(aiTyping?' thinking':'')+'"></div>'+
          '<span>'+(proFromCache?'Claude \u00B7 Pro priority':'Claude AI \u00B7 Free tier')+'</span>'+
        '</div></div>'+
    '</div>'+
    '<div class="ai-main">'+
      '<div class="ai-topbar">'+
        '<button class="ai-back-btn" onclick="switchView(\'dashboard\')" title="Back to Dashboard">'+
          '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
        '</button>'+
        '<button class="ai-toggle-btn" id="ai-toggle-btn" onclick="aiToggleSidebar()" title="Toggle history">'+
          (_aiSidebarOpen ? _aiToggleIconOpen() : _aiToggleIconClosed())+
        '</button>'+
        '<div class="ai-topbar-title">'+(hasHistory ? esc(_aiSessionTitle(aiHistory)) : 'AI Study Assistant')+'</div>'+
        '<div class="ai-topbar-actions">'+
          (proFromCache?'<span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:6px;padding:2px 8px;font-weight:700">PRO \u2B50</span>':'')+
          subSel+
          (hasHistory?'<button class="ai-clear-btn" onclick="aiHistory=[];_aiPersistCurrentSession();render()">Clear</button>':'')+
        '</div>'+
      '</div>'+
      '<div class="ai-chat-wrap" id="ai-chat-box">'+msgs+'</div>'+
      '<div class="ai-input-area">'+
        '<div class="ai-input-box">'+
          '<textarea id="ai-input" class="ai-textarea" placeholder="Message AI tutor\u2026" rows="1"'+
            ' onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();sendAIMessage()}"'+
            ' oninput="this.style.height=\'auto\';this.style.height=Math.min(this.scrollHeight,140)+\'px\'"></textarea>'+
          '<div class="ai-input-footer">'+
            '<div class="ai-chips">'+quickChips+'</div>'+
            sendBtn+
          '</div>'+
        '</div>'+
        '<div class="ai-hint">'+hint+'</div>'+
      '</div>'+
    '</div>'+
  '</div>';
}

function renderAIMsgBubble(m, i){
  const isUser = m.role === 'user';
  const isThinking = m.text === '\u23F3 Thinking\u2026';
  const timeStr = m.ts ? new Date(m.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '';

  let html = esc(m.text);
  if(!isUser && !isThinking){
    html = html
      .replace(/\*\*(.*?)\*\*/g,'<strong style="color:#EDE8E0">$1</strong>')
      .replace(/\*(.*?)\*/g,'<em style="color:#aaa">$1</em>')
      .replace(/```([\s\S]*?)```/g,'<pre>$1</pre>')
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/^#{1,3}\s(.+)$/gm,'<div style="font-weight:bold;color:#4ECDC4;margin:10px 0 4px">$1</div>')
      .replace(/^[-\u2022]\s(.+)$/gm,'<div style="padding-left:14px;margin:3px 0">\u2022 $1</div>')
      .replace(/\n/g,'<br>');
    if(window.DOMPurify){
      html = DOMPurify.sanitize(html,{ALLOWED_TAGS:['strong','em','pre','code','div','br','span'],ALLOWED_ATTR:['style']});
    }
  }

  if(isThinking) return '<div class="ai-msg-row" style="animation:fadeInUp 0.2s ease">'+
    '<div class="ai-avatar bot" style="font-size:13px">\u2736</div>'+
    '<div class="ai-bubble-wrap"><div class="ai-sender-name">AI Tutor</div>'+
    '<div class="ai-bubble bot thinking-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div></div></div>';

  const userAvatar = isUser
    ? (currentUser?.photoURL
        ? '<img src="'+currentUser.photoURL+'" style="width:100%;height:100%;border-radius:8px;object-fit:cover" onerror="this.parentElement.textContent=\'&#128100;\'">'
        : '&#128100;')
    : '\u2736';

  return '<div class="ai-msg-row '+(isUser?'user':'')+'">'+
    '<div class="ai-avatar '+(isUser?'user':'bot')+'">'+userAvatar+'</div>'+
    '<div class="ai-bubble-wrap">'+
      '<div class="ai-sender-name">'+(isUser?(currentUser?.displayName?.split(' ')[0]||'You'):'AI Tutor')+'</div>'+
      '<div class="ai-bubble '+(isUser?'user':'bot')+'">'+html+'</div>'+
      '<div class="ai-meta">'+timeStr+'</div>'+
    '</div></div>';
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
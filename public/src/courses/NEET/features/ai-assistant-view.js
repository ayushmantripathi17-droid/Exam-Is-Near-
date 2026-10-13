import { CourseRuntime } from "../../../core/course-runtime.js";
import { CourseSelectorShared, getSubjects } from "../../../core/course-selector.js";
import { AiAssistantSetupShared, FREE_AI_MSG_LIMIT, freeAiMsgCount } from "./ai-assistant-setup.js";
import { _proCache } from "./payments-pro.js";
import { esc, showToast } from "../../../utils/helpers.js";
import { render } from "../ui/render-core.js";
import { AppStateShared } from "../../../core/app-state.js";
import { PwaInstall } from "../../../shared/pwa-install.js";

export const AiAssistantViewShared = {};
// ══════════════════════════════════════════════════════════════
CourseRuntime.aiTyping = false;

// Dynamic quick prompts and welcome cards based on active course
function getAIQuickPrompts(){
  if(CourseSelectorShared.activeCourse==='neet') return [
    {icon:"🧬", label:"Cell Biology", prompt:"Explain the cell cycle, mitosis vs meiosis with key NCERT points"},
    {icon:"🫀", label:"Human Physiology", prompt:"Explain the cardiac cycle and blood pressure regulation for NEET"},
    {icon:"⚛️", label:"Physical Chemistry", prompt:"Explain chemical equilibrium, Le Chatelier's principle with examples"},
    {icon:"🌿", label:"Plant Kingdom", prompt:"Compare Bryophyta, Pteridophyta, Gymnosperms and Angiosperms"},
    {icon:"🔬", label:"Genetics", prompt:"Explain Mendel's laws, codominance and sex-linked inheritance"},
    {icon:"💊", label:"Biomolecules", prompt:"List key enzymes, cofactors and metabolic pathways for NEET"},
    {icon:"🌡️", label:"Thermodynamics", prompt:"Explain Hess's law, enthalpy and entropy with numerical examples"},
    {icon:"⚡", label:"Revision Plan", prompt:"Create a 3-hour NEET revision plan covering Biology, Physics and Chemistry"},
  ];
  if(CourseSelectorShared.activeCourse==='jee') return [
    {icon:"⚛️", label:"Mechanics", prompt:"Explain Newton's laws, circular motion and work-energy theorem for JEE"},
    {icon:"🔌", label:"Electrostatics", prompt:"Explain Coulomb's law, Gauss's theorem and capacitors for JEE"},
    {icon:"📐", label:"Calculus", prompt:"Explain differentiation and integration techniques for JEE Mains"},
    {icon:"🧪", label:"Organic Chemistry", prompt:"Explain reaction mechanisms: SN1, SN2, addition and elimination"},
    {icon:"📊", label:"Probability", prompt:"Explain probability, Bayes theorem and binomial distribution for JEE"},
    {icon:"🌊", label:"Waves & Optics", prompt:"Explain interference, diffraction and polarization of light for JEE"},
    {icon:"⚗️", label:"Equilibrium", prompt:"Explain chemical equilibrium, Kp, Kc and Le Chatelier's principle"},
    {icon:"⚡", label:"Revision Plan", prompt:"Create a 3-hour JEE revision plan focusing on weak topics"},
  ];
  if(CourseSelectorShared.activeCourse==='cbse10') return [
    {icon:"📐", label:"Quadratics", prompt:"Explain quadratic equations — factorisation, formula method, discriminant with examples for CBSE Class 10"},
    {icon:"🔬", label:"Chemical Reactions", prompt:"List and explain the 5 types of chemical reactions for CBSE Class 10 Science"},
    {icon:"💡", label:"Electricity", prompt:"Explain Ohm's Law, series and parallel circuits with formulas for CBSE Class 10"},
    {icon:"🌍", label:"Nationalism", prompt:"Summarise the rise of nationalism in Europe for CBSE Class 10 History"},
    {icon:"🧬", label:"Heredity", prompt:"Explain Mendel's laws of inheritance and sex determination for CBSE Class 10 Biology"},
    {icon:"📖", label:"English Writing", prompt:"Explain formal letter writing format for CBSE Class 10 with a sample complaint letter"},
    {icon:"📊", label:"Statistics", prompt:"Explain mean, median and mode from grouped data with examples for CBSE Class 10"},
    {icon:"⚡", label:"Revision Plan", prompt:"Create a 3-hour CBSE Class 10 revision plan for board exam preparation"},
  ];
  if(CourseSelectorShared.activeCourse==='cbse12') return [
    {icon:"📐", label:"Integration", prompt:"Explain integration by parts and substitution method with solved examples for CBSE Class 12"},
    {icon:"⚛️", label:"Semiconductors", prompt:"Explain p-n junction diode, transistor as amplifier and logic gates for CBSE Class 12 Physics"},
    {icon:"🧪", label:"Organic Chemistry", prompt:"Explain reaction mechanisms of alcohols, phenols and aldehydes for CBSE Class 12 Chemistry"},
    {icon:"🧬", label:"Molecular Biology", prompt:"Explain DNA replication, transcription and translation for CBSE Class 12 Biology"},
    {icon:"📊", label:"Macroeconomics", prompt:"Explain national income accounting — methods and concepts for CBSE Class 12 Economics"},
    {icon:"📖", label:"English Literature", prompt:"Summarise the themes and character analysis of 'Deep Water' and 'The Rattrap' for CBSE Class 12"},
    {icon:"🔢", label:"Probability", prompt:"Explain Bayes' theorem and binomial distribution with examples for CBSE Class 12 Maths"},
    {icon:"⚡", label:"Revision Plan", prompt:"Create a 3-hour CBSE Class 12 board exam revision plan covering key chapters"},
  ];
  if(CourseSelectorShared.activeCourse==='nfsu1') return [
    {icon:"⚖️", label:"Legal Methods", prompt:"Explain sources of law, precedent and statutory interpretation for Legal Methods"},
    {icon:"🤕", label:"Law of Tort", prompt:"Explain negligence, strict liability and general defenses in Law of Tort"},
    {icon:"🛒", label:"Consumer Protection", prompt:"Explain key provisions of the Consumer Protection Act with recent case examples"},
    {icon:"📖", label:"Law & Literature", prompt:"Explain the interdisciplinary approach of Law and Literature with examples"},
    {icon:"💻", label:"Computer Organization", prompt:"Explain computer organization basics: CPU, memory hierarchy, embedded systems"},
    {icon:"🧮", label:"C Programming", prompt:"Explain pointers, arrays and structures in C with code examples"},
    {icon:"📊", label:"Discrete Maths", prompt:"Explain set theory, relations and graph theory basics for Discrete Mathematics"},
    {icon:"📰", label:"Legal News", prompt:"Summarise the most important recent Indian legal news relevant to a first-year law student"},
  ];
  if(CourseSelectorShared.activeCourse==='nfsu3') return [
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
  if(CourseSelectorShared.activeCourse==='nfsu') return [
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
  if(CourseSelectorShared.activeCourse==='neet') return [
    {icon:"🧬", title:"Biology (NCERT)", desc:"Cell biology, genetics, ecology, human physiology"},
    {icon:"⚛️", title:"Physics", desc:"Mechanics, electrostatics, optics, modern physics"},
    {icon:"🧪", title:"Chemistry", desc:"Organic, inorganic and physical chemistry"},
    {icon:"🔬", title:"Zoology & Botany", desc:"Plant kingdom, animal kingdom, reproduction"},
  ];
  if(CourseSelectorShared.activeCourse==='jee') return [
    {icon:"⚛️", title:"Physics", desc:"Mechanics, electrostatics, thermodynamics, optics"},
    {icon:"🧮", title:"Mathematics", desc:"Calculus, algebra, coordinate geometry, probability"},
    {icon:"🧪", title:"Chemistry", desc:"Organic reactions, physical chemistry, periodic table"},
    {icon:"📐", title:"Problem Solving", desc:"JEE Mains & Advanced problem strategies"},
  ];
  if(CourseSelectorShared.activeCourse==='cbse10') return [
    {icon:"📐", title:"Mathematics", desc:"Algebra, geometry, trigonometry, statistics"},
    {icon:"🔬", title:"Science", desc:"Physics, Chemistry, Biology — NCERT based"},
    {icon:"🌍", title:"Social Science", desc:"History, Geography, Civics, Economics"},
    {icon:"📖", title:"English & Hindi", desc:"Literature, grammar, writing skills"},
  ];
  if(CourseSelectorShared.activeCourse==='cbse12') return [
    {icon:"📐", title:"Mathematics", desc:"Calculus, algebra, vectors, probability"},
    {icon:"⚛️", title:"Physics & Chemistry", desc:"Modern physics, organic chemistry, electrochemistry"},
    {icon:"🧬", title:"Biology / Economics", desc:"Genetics, ecology, macroeconomics, money & banking"},
    {icon:"📖", title:"English Literature", desc:"Flamingo, Vistas, writing skills"},
  ];
  if(CourseSelectorShared.activeCourse==='nfsu1') return [
    {icon:"⚖️", title:"Legal Methods & Tort", desc:"Sources of law, precedent, negligence, strict liability"},
    {icon:"🛒", title:"Consumer Protection", desc:"Consumer Protection Act, unfair trade practices"},
    {icon:"💻", title:"Computer & C", desc:"Computer organization, embedded systems, C programming"},
    {icon:"📊", title:"Discrete Maths", desc:"Set theory, relations, graph theory"},
  ];
  if(CourseSelectorShared.activeCourse==='nfsu3') return [
    {icon:"⚖️", title:"Law of Crimes I", desc:"IPC → BNS mapping, mens rea, offences against body & property"},
    {icon:"🏛️", title:"Constitutional Law I", desc:"Fundamental Rights, DPSP, writs, PIL"},
    {icon:"📜", title:"Contract & Family Law", desc:"Offer, acceptance, remedies, Hindu marriage & divorce"},
    {icon:"📘", title:"Bare Act & Legal News", desc:"Latest amendments (BNS/BNSS/BSA) and current legal developments"},
  ];
  if(CourseSelectorShared.activeCourse==='nfsu') return [
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
AiAssistantViewShared._aiActiveSession = null; // id of active session
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

const _AI_SPARK='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/></svg>';
const _AI_CHAT='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
const _AI_COPY='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
AiAssistantViewShared.subjectCtx = 'all';

function _aiSessionsHtml(){
  if(!_aiSessions.length) return '<div class="ai-empty-sess">No conversations yet.<br>Start a new chat!</div>';
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
  return Object.entries(grouped).map(([label,items])=>{
    if(!items.length) return '';
    return '<div class="ai-sidebar-label">'+label+'</div>'+
      items.map(s=>'<div class="ai-session-item'+(AiAssistantViewShared._aiActiveSession===s.id?' active':'')+'" onclick="aiLoadSession(\''+s.id+'\')">'+
        '<span class="ai-sess-icon">'+_AI_CHAT+'</span>'+
        '<span class="ai-sess-title">'+esc(s.title)+'</span>'+
        '<span class="ai-sess-time">'+_aiRelTime(s.ts)+'</span>'+
        '<button class="ai-sess-del" onclick="aiDeleteSession(\''+s.id+'\',event)" title="Delete">\u2715</button>'+
        '</div>').join('');
  }).join('');
}

function _aiWelcomeHtml(){
  const userName = AppStateShared.currentUser?.displayName?.split(' ')[0] || 'there';
  const cards = getAIWelcomeCards().map((c,i)=>
    '<div class="ai-welcome-card" onclick="setWelcomePrompt('+i+')">'+
    '<div class="ai-wc-icon">'+c.icon+'</div>'+
    '<div class="ai-wc-title">'+esc(c.title)+'</div>'+
    '<div class="ai-wc-desc">'+esc(c.desc)+'</div></div>').join('');
  return '<div class="ai-welcome">'+
    '<div class="ai-welcome-logo">'+_AI_SPARK.replace('width="16" height="16"','width="30" height="30"')+'</div>'+
    '<div><div class="ai-welcome-h">Hello, '+esc(userName)+'</div>'+
    '<div class="ai-welcome-s">What would you like to study today?</div></div>'+
    '<div class="ai-welcome-grid">'+cards+'</div></div>';
}

function aiSetCtx(v){ AiAssistantViewShared.subjectCtx = v || 'all'; }
function aiClearChat(){
  AiAssistantSetupShared.aiHistory = [];
  _aiPersistCurrentSession();
  render();
}
function aiCopyMsg(i){
  const m = AiAssistantSetupShared.aiHistory[i];
  if(!m) return;
  const done = ()=>showToast('Copied to clipboard','success');
  try{
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(m.text).then(done,()=>showToast('Could not copy','alarm')); }
    else{ const ta=document.createElement('textarea'); ta.value=m.text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); done(); }
  }catch(e){ showToast('Could not copy','alarm'); }
}

// Safe mini-markdown → HTML (input is escaped first)
function _aiMd(raw){
  let t = esc(String(raw==null?'':raw));
  const blocks=[], codes=[];
  t = t.replace(/```[a-zA-Z0-9+#-]*\n?([\s\S]*?)```/g,(m,code)=>{ blocks.push('<pre><code>'+code.replace(/\n$/,'')+'</code></pre>'); return '\u0000B'+(blocks.length-1)+'\u0000'; });
  t = t.replace(/`([^`\n]+)`/g,(m,c)=>{ codes.push('<code>'+c+'</code>'); return '\u0000C'+(codes.length-1)+'\u0000'; });
  t = t.replace(/\*\*([^*\n]+?)\*\*/g,'<strong>$1</strong>')
       .replace(/(^|[^*\w])\*(?=\S)([^*\n]*?\S)\*(?!\*)/g,'$1<em>$2</em>');
  const out=[]; let list=null;
  const close=()=>{ if(list){ out.push('</'+list+'>'); list=null; } };
  t.split('\n').forEach(ln=>{
    let m;
    if(/^\u0000B\d+\u0000$/.test(ln.trim())){ close(); out.push(ln.trim()); }
    else if((m=ln.match(/^\s{0,3}#{1,4}\s+(.+)$/))){ close(); out.push('<div class="ai-h">'+m[1]+'</div>'); }
    else if((m=ln.match(/^\s*[-*\u2022]\s+(.+)$/))){ if(list!=='ul'){ close(); out.push('<ul>'); list='ul'; } out.push('<li>'+m[1]+'</li>'); }
    else if((m=ln.match(/^\s*(\d+)[.)]\s+(.+)$/))){ if(list!=='ol'){ close(); out.push('<ol>'); list='ol'; } out.push('<li>'+m[2]+'</li>'); }
    else if((m=ln.match(/^&gt;\s?(.*)$/))){ close(); out.push('<blockquote>'+m[1]+'</blockquote>'); }
    else if(!ln.trim()){ close(); }
    else{ close(); out.push('<p>'+ln+'</p>'); }
  });
  close();
  let html = out.join('').replace(/\u0000C(\d+)\u0000/g,(m,i)=>codes[+i]).replace(/\u0000B(\d+)\u0000/g,(m,i)=>blocks[+i]);
  if(window.DOMPurify){
    html = DOMPurify.sanitize(html,{ALLOWED_TAGS:['strong','em','pre','code','div','br','span','p','ul','ol','li','blockquote'],ALLOWED_ATTR:['class']});
  }
  return html;
}

function _aiPruneEmpty(){
  _aiLoadSessions();   // always start from what is actually stored
  const keep = _aiSessions.filter(s => (s.messages && s.messages.length) || s.id === AiAssistantViewShared._aiActiveSession);
  if(keep.length !== _aiSessions.length){ _aiSessions = keep; _aiSaveSessions(); }
}
function aiNewChat(){
  _aiPruneEmpty();
  // Already on an empty chat? Just refocus instead of adding another one.
  if(AiAssistantViewShared._aiActiveSession && AiAssistantSetupShared.aiHistory.length===0 && _aiSessions.some(s=>s.id===AiAssistantViewShared._aiActiveSession)){
    const ta0=document.getElementById('ai-input'); if(ta0) ta0.focus();
    if(window.innerWidth<=700) _closeAISidebarMobile();
    return;
  }
  const id = 'sess_'+Date.now();
  AiAssistantViewShared._aiActiveSession = id;
  AiAssistantSetupShared.aiHistory = [];
  const sess = {id, title:'New chat', ts: Date.now(), messages:[]};
  _aiSessions.unshift(sess);
  _aiSaveSessions();

  // In-place update — no full re-render flash
  const chatBox = document.getElementById('ai-chat-box');
  const topbarTitle = document.querySelector('.ai-topbar-title');
  const clearBtn = document.querySelector('.ai-clear-btn');
  const hintEl = document.querySelector('.ai-hint');

  if(chatBox){
    chatBox.innerHTML = _aiWelcomeHtml();
  }
  if(topbarTitle) topbarTitle.textContent = 'AI Study Assistant';
  if(clearBtn) clearBtn.remove();

  // Refresh session list in sidebar
  const sessListEl = document.querySelector('.ai-sessions-list');
  if(sessListEl) sessListEl.innerHTML = _aiSessionsHtml();

  // On mobile, close sidebar after starting new chat
  if(window.innerWidth<=700) _closeAISidebarMobile();

  setTimeout(()=>{ const ta=document.getElementById('ai-input'); if(ta){ta.value='';ta.style.height='auto';ta.focus();} },50);
}
function aiLoadSession(id){
  _aiLoadSessions();
  const sess = _aiSessions.find(s=>s.id===id);
  if(!sess) return;
  AiAssistantViewShared._aiActiveSession = id;
  AiAssistantSetupShared.aiHistory = sess.messages.map(m=>({...m}));
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
  if(AiAssistantViewShared._aiActiveSession===id){ AiAssistantViewShared._aiActiveSession=null; AiAssistantSetupShared.aiHistory=[]; }
  render();
}
function _aiPersistCurrentSession(){
  if(!AiAssistantViewShared._aiActiveSession) return;
  _aiLoadSessions();
  const idx = _aiSessions.findIndex(s=>s.id===AiAssistantViewShared._aiActiveSession);
  if(idx<0){
    _aiSessions.unshift({id:AiAssistantViewShared._aiActiveSession,title:_aiSessionTitle(AiAssistantSetupShared.aiHistory),ts:Date.now(),messages:[...AiAssistantSetupShared.aiHistory]});
  } else {
    _aiSessions[idx].messages = [...AiAssistantSetupShared.aiHistory];
    _aiSessions[idx].title = _aiSessionTitle(AiAssistantSetupShared.aiHistory);
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
  _aiPruneEmpty();
  const hasHistory = AiAssistantSetupShared.aiHistory.length > 0;
  const proFromCache = !!(_proCache?.isPro);
  const sidebarCollapsed = !_aiSidebarOpen;

  const ctx = AiAssistantViewShared.subjectCtx || 'all';
  const subSel = '<select id="ai-subject-ctx" class="ai-subject-select" onchange="aiSetCtx(this.value)"><option value="all">All subjects</option>'+
    getSubjects().map(s=>'<option value="'+s.id+'"'+(ctx===s.id?' selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select>';

  const quickChips = getAIQuickPrompts().map((p,i)=>'<button class="ai-chip" onclick="setQuickPrompt('+i+')">'+p.icon+' '+esc(p.label)+'</button>').join('');

  const msgs = hasHistory
    ? AiAssistantSetupShared.aiHistory.map((m,i)=>renderAIMsgBubble(m,i)).join('')
    : _aiWelcomeHtml();

  const blocked = CourseRuntime.aiTyping||((!proFromCache)&&freeAiMsgCount>=FREE_AI_MSG_LIMIT);
  const sendBtn = '<button class="ai-send-btn" id="ai-send-btn" onclick="sendAIMessage()" '+(blocked?'disabled':'')+' title="Send">'+
    (CourseRuntime.aiTyping
      ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9" opacity=".35"/><path d="M12 3a9 9 0 0 1 9 9"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur=".9s" repeatCount="indefinite"/></path></svg>'
      : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>')+
    '</button>';

  const hint = proFromCache
    ? 'Enter to send \u00B7 Shift+Enter for new line'
    : 'Enter to send \u00B7 <span class="ai-hint-free">'+Math.max(0,FREE_AI_MSG_LIMIT-freeAiMsgCount)+' free messages left</span> \u00B7 <span class="ai-hint-up" onclick="openProModal()">Upgrade</span>';

  return '<div class="fade-in ai-page">'+
    '<div class="ai-sidebar-overlay" id="ai-sidebar-overlay" onclick="aiToggleSidebar()"></div>'+
    '<div class="ai-sidebar'+(sidebarCollapsed?' collapsed':'')+'" id="ai-sidebar">'+
      '<div class="ai-sidebar-top">'+
        '<button class="ai-new-chat-btn" onclick="aiNewChat()">'+
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'+
          'New chat</button></div>'+
      '<div class="ai-sessions-list">'+_aiSessionsHtml()+'</div>'+
      '<div class="ai-sidebar-bottom">'+
        '<div class="ai-model-badge">'+
          '<div class="ai-model-dot'+(CourseRuntime.aiTyping?' thinking':'')+'"></div>'+
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
        '<div class="ai-topbar-title">'+(hasHistory ? esc(_aiSessionTitle(AiAssistantSetupShared.aiHistory)) : 'AI Study Assistant')+'</div>'+
        '<div class="ai-topbar-actions">'+
          (proFromCache?'<span class="ai-pro-badge">PRO</span>':'')+
          subSel+
          (hasHistory?'<button class="ai-clear-btn" onclick="aiClearChat()">Clear</button>':'')+
        '</div>'+
      '</div>'+
      '<div class="ai-chat-wrap" id="ai-chat-box">'+msgs+'</div>'+
      '<div class="ai-input-area">'+
        '<div class="ai-chips">'+quickChips+'</div>'+
        '<div class="ai-input-box">'+
          '<textarea id="ai-input" class="ai-textarea" placeholder="Ask your AI tutor anything\u2026" rows="1"'+
            ' onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();sendAIMessage()}"'+
            ' oninput="this.style.height=\'auto\';this.style.height=Math.min(this.scrollHeight,150)+\'px\'"></textarea>'+
          sendBtn+
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

  if(isThinking) return '<div class="ai-msg-row">'+
    '<div class="ai-avatar bot">'+_AI_SPARK+'</div>'+
    '<div class="ai-bubble-wrap"><div class="ai-sender-name">AI Tutor</div>'+
    '<div class="ai-bubble bot thinking-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div></div></div>';

  const html = isUser ? esc(m.text).replace(/\n/g,'<br>') : _aiMd(m.text);
  const userAvatar = isUser
    ? (AppStateShared.currentUser?.photoURL
        ? '<img src="'+esc(AppStateShared.currentUser.photoURL)+'" alt="" onerror="this.parentElement.textContent=\'\'">'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>')
    : _AI_SPARK;
  const name = isUser ? (AppStateShared.currentUser?.displayName?.split(' ')[0]||'You') : 'AI Tutor';

  return '<div class="ai-msg-row '+(isUser?'user':'')+'">'+
    '<div class="ai-avatar '+(isUser?'user':'bot')+'">'+userAvatar+'</div>'+
    '<div class="ai-bubble-wrap">'+
      '<div class="ai-sender-name">'+esc(name)+'</div>'+
      '<div class="ai-bubble '+(isUser?'user':'bot')+'">'+html+'</div>'+
      '<div class="ai-meta">'+timeStr+(isUser?'':'<button class="ai-copy" onclick="aiCopyMsg('+i+')" title="Copy">'+_AI_COPY+' Copy</button>')+'</div>'+
    '</div></div>';
}

function installPWA(){
  if(!PwaInstall.deferredPrompt){showToast("ℹ️ App already installed or not supported","info");return;}
  PwaInstall.deferredPrompt.prompt();
  PwaInstall.deferredPrompt.userChoice.then(r=>{
    if(r.outcome==="accepted") showToast("🎉 App installed!","success");
    PwaInstall.deferredPrompt=null;
    document.getElementById("pwa-install-btn").style.display="none";
  });
}

// ══════════════════════════════════════════════════════════════
// MOBILE NAV DRAWER

export { AI_QUICK_PROMPTS, AI_SESSIONS_KEY, AI_SESSION_MAX, AI_WELCOME_CARDS, _aiLoadSessions, _aiPersistCurrentSession, _aiRelTime, _aiSaveSessions, _aiSessionTitle, _aiSessions, _aiSidebarOpen, _aiToggleIconClosed, _aiToggleIconOpen, _closeAISidebarMobile, aiDeleteSession, aiLoadSession, aiNewChat, aiToggleSidebar, getAIQuickPrompts, getAIWelcomeCards, installPWA, renderAI, renderAIMsgBubble, aiClearChat, aiSetCtx, aiCopyMsg, _aiSessionsHtml, _aiWelcomeHtml, _aiMd };

if (typeof window !== "undefined") {
  Object.assign(window, { AI_QUICK_PROMPTS, AI_SESSIONS_KEY, AI_SESSION_MAX, AI_WELCOME_CARDS, _aiLoadSessions, _aiPersistCurrentSession, _aiRelTime, _aiSaveSessions, _aiSessionTitle, _aiSessions, _aiSidebarOpen, _aiToggleIconClosed, _aiToggleIconOpen, _closeAISidebarMobile, aiDeleteSession, aiLoadSession, aiNewChat, aiToggleSidebar, getAIQuickPrompts, getAIWelcomeCards, installPWA, renderAI, renderAIMsgBubble, aiClearChat, aiSetCtx, aiCopyMsg, _aiSessionsHtml, _aiWelcomeHtml, _aiMd });
}

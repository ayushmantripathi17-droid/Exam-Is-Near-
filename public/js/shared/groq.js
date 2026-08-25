// GEMINI AI STUDY ASSISTANT
// ══════════════════════════════════════════════════════════════
// SECURITY: API key removed from frontend. All AI calls go through
// the Firebase Cloud Function proxy (functions/index.js → groqProxy).
// The key lives only in Firebase Secret Manager.
const GROQ_PROXY_URL = "https://asia-south1-exam-is-near.cloudfunctions.net/groqProxy";
// Model IDs must match ALLOWED_GROQ_MODELS in functions/index.js exactly,
// or the proxy silently falls back to claude-sonnet-4-6 for everyone.
const GROQ_MODEL_PRO  = "claude-sonnet-4-6";         // Pro users — best quality
const GROQ_MODEL_FREE = "claude-haiku-4-5-20251001"; // Free users — fast/cheap
let aiHistory = [];

// ── Free tier limits ──
const FREE_AI_MSG_LIMIT  = 5;   // AI chat messages per session for free users
const FREE_QUIZ_LIMIT    = 3;   // Quiz attempts per session for free users
// [FIX C3] Daily-reset counters: reset when calendar date changes
const _freeCounterDay = () => new Date().toISOString().split('T')[0];
function _initDailyCounter(key){
  try{
    const stored = JSON.parse(localStorage.getItem(key)||'null');
    if(stored && stored.day === _freeCounterDay()) return stored.count;
  }catch(e){}
  return 0;
}
function _incDailyCounter(key){
  const day = _freeCounterDay();
  try{
    const stored = JSON.parse(localStorage.getItem(key)||'null');
    const count = (stored && stored.day===day ? stored.count : 0) + 1;
    localStorage.setItem(key, JSON.stringify({day, count}));
    return count;
  }catch(e){ return 1; }
}
let freeAiMsgCount  = _initDailyCounter('ein_free_ai_day');   // resets daily
let freeQuizCount   = _initDailyCounter('ein_free_quiz_day');  // resets daily

// ── PRO: AI Chat History persistence ──
const AI_HISTORY_KEY = "ein_ai_chat_history";
const AI_HISTORY_MAX = 120; // messages stored for Pro

async function loadAIChatHistory(){
  try{
    const pro = await isProUser();
    if(!pro) return;
    const saved = localStorage.getItem(AI_HISTORY_KEY);
    if(saved){
      const parsed = JSON.parse(saved);
      if(Array.isArray(parsed) && parsed.length > 0){
        aiHistory = parsed;
        renderAIChat();
      }
    }
  }catch(e){}
}

async function saveAIChatHistory(){
  try{
    const pro = await isProUser();
    if(!pro) return;
    // Keep only last AI_HISTORY_MAX messages to stay within localStorage quota
    const toSave = aiHistory.slice(-AI_HISTORY_MAX);
    localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(toSave));
  }catch(e){}
}

async function askAI(prompt, isJson = false, systemOverride = null) {
  try {
    const pro = await isProUser();
    _proStatusCache = pro;
    const maxTokens = isJson ? 6000 : (pro ? 3000 : 800);
    const sysContent = isJson
      ? "You are an expert JEE/NEET/competitive exam question generator trained on NTA-level content. Respond ONLY with a valid raw JSON array. No markdown, no backticks, no preamble, no explanation. Start your response with [ and end with ]. Each question must be challenging, application-based, and exam-ready — never trivial. Include numerical problems, assertion-reasoning, multi-concept questions, and common exam traps. Always provide a concise explanation field."
      : systemOverride
        ? systemOverride
        : pro
          ? "You are an expert AI study tutor. Give thorough, deeply explained answers with examples, mnemonics, and exam tips. Use **bold** for key terms, bullet points for lists, numbered steps for procedures. End with an encouraging line."
          : "You are a concise study assistant. Answer clearly and briefly.";

    // SECURITY: Request proxied through Cloud Function — key never in client code
    // SECURITY FIX #8: Attach Firebase Auth token so proxy rejects unauthenticated calls
    // FIX: Wait for auth to resolve if currentUser is null (race condition on page load)
    const authHeaders = { "Content-Type": "application/json" };
    let resolvedUser = currentUser;
    if (!resolvedUser && auth) {
      try {
        resolvedUser = await new Promise((resolve) => {
          const unsub = auth.onAuthStateChanged(u => { unsub(); resolve(u); });
          setTimeout(() => resolve(null), 3000); // 3s timeout fallback
        });
      } catch(e) { /* ignore */ }
    }
    if (resolvedUser) {
      try {
        const idToken = await resolvedUser.getIdToken();
        authHeaders["Authorization"] = "Bearer " + idToken;
      } catch(tokenErr) { /* non-fatal — proxy will reject if token required */ }
    }
    const res = await fetch(GROQ_PROXY_URL, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        model: pro ? GROQ_MODEL_PRO : GROQ_MODEL_FREE,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: sysContent },
          { role: "user", content: prompt }
        ],
        temperature: isJson ? 0.1 : (pro ? 0.65 : 0.7)
      })
    });
    if (!res.ok){
      const err = await res.text().catch(()=>"");
      return "⚠️ AI Error " + res.status + (err?": "+err.slice(0,120):"");
    }
    const data = await res.json();
    return data.choices[0]?.message?.content || "No response.";
  } catch (e) { return "⚠️ Network error: " + e.message; }
}

function setQuickPrompt(index){
  const p = getAIQuickPrompts()[index];
  if(!p) return;
  const input = document.getElementById('ai-input');
  if(!input) return;
  input.value = p.prompt;
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  sendAIMessage();
}

function setWelcomePrompt(index){
  const c = getAIWelcomeCards()[index];
  if(!c) return;
  const input = document.getElementById('ai-input');
  if(!input) return;
  input.value = 'Tell me about ' + c.title;
  sendAIMessage();
}

async function sendAIMessage(){
  const input=document.getElementById("ai-input");
  if(!input) return;
  const msg=input.value.trim();
  if(!msg||aiTyping) return;

  // ── PRO GATE: Free users limited to FREE_AI_MSG_LIMIT messages per session ──
  const _proForAI = await isProUser();
  if(!_proForAI){
    if(freeAiMsgCount >= FREE_AI_MSG_LIMIT){
      showToast("⭐ Free limit reached ("+FREE_AI_MSG_LIMIT+" messages). Upgrade to Pro for unlimited AI chat!","alarm");
      openProModal();
      return;
    }
    freeAiMsgCount = _incDailyCounter('ein_free_ai_day');
  }

  input.value="";
  input.style.height="auto";
  aiTyping=true;
  aiHistory.push({role:"user",text:msg});
  aiHistory.push({role:"ai",text:"⏳ Thinking…"});
  renderAIChat();
  const box=document.getElementById("ai-chat-box");
  if(box) box.scrollTop=box.scrollHeight;

  // Build rich context-aware prompt
  const ctxEl=document.getElementById("ai-subject-ctx");
  const ctxSub=ctxEl?.value||"all";
  const ctxSubName=ctxSub==="all"?"all subjects":(getSubjects().find(s=>s.id===ctxSub)?.name||ctxSub);
  const subjects=getSubjects().map(s=>s.name).join(", ");
  const subProgress=getSubjects().map(s=>s.name+":"+getSubjectPct(s.id)+"%").join(", ");
  const courseLabel = activeCourse==='neet'?'NEET UG aspirant':activeCourse==='jee'?'JEE (Mains & Advanced) aspirant':activeCourse==='nfsu'?'B.Sc. LL.B. student at NFSU':activeCourse==='nfsu1'?'B.Sc. LL.B. (Hons.) Sem I student at NFSU':activeCourse==='nfsu3'?'B.Sc. LL.B. Sem III student at NFSU':activeCourse==='cbse10'?'CBSE Class 10 student':activeCourse==='cbse12'?('CBSE Class 12 '+( CBSE12_STREAMS[cbse12Stream]?.label?.split('—')[1]?.trim()||'student') +' student'):'student';
  const courseExtra = activeCourse==='neet'?' Focus on Biology, Physics, Chemistry NCERT concepts.':activeCourse==='jee'?' Focus on Maths, Physics, Chemistry problem solving and formulas.':activeCourse==='nfsu'?' Focus on law, technology, and forensic science subjects.':activeCourse==='nfsu1'?' Focus on NFSU Sem I subjects: Legal Methods, Law of Tort and Consumer Protection Laws, Law and Literature, Fundamentals of Computer Organization & Embedded Systems, Basic Programming Concepts Using C, and Discrete Mathematics.':activeCourse==='nfsu3'?' Focus on NFSU Sem III subjects: Law of Crimes I (IPC), Constitutional Law I, Law of Contract I, Family Law I, Web Programming (HTML, JS, PHP, MySQL), and Operating System Concepts (Linux, memory, processes).':activeCourse==='cbse10'?' Focus on CBSE Class 10 curriculum — Maths, Science, English, Social Science.':activeCourse==='cbse12'?(' Focus on CBSE Class 12 board exam for '+(CBSE12_STREAMS[cbse12Stream]?.desc||'the selected stream')+'. Give NCERT-focused answers.'):'';
  const sysPrompt=`You are an expert AI study tutor for a ${courseLabel}. Subjects: ${subjects}. Exams start in ${getDaysLeft(getExamDate(getSubjects()[0]?.id)||'')||'a few'} days. Student progress: ${subProgress}. Hours studied: ${getTotalHours()}h. Current focus: ${ctxSubName}.${courseExtra}\nRules: Be concise yet thorough. Use **bold** for key terms. Use bullet points for lists. Use \`code\` for code snippets. Use numbered steps for procedures. Always end with a 1-line encouragement.`;

  const reply = await askAI(msg, false, sysPrompt);
  aiTyping=false;
  aiHistory[aiHistory.length-1]={role:"ai",text:reply};
  renderAIChat();
  saveAIChatHistory(); // PRO: persist history
  if(box) box.scrollTop=box.scrollHeight;
}

function renderAIChat(){
  const box=document.getElementById("ai-chat-box");
  if(!box) return;
  if(aiHistory.length===0){render();return;}
  // Append only the last message (for performance)
  const lastMsg = aiHistory[aiHistory.length-1];
  const idx = aiHistory.length-1;
  // Re-render all for simplicity
  box.innerHTML = aiHistory.map((m,i) => renderAIMsgBubble(m,i)).join("");
  // Update send button state
  const btn = document.getElementById("ai-send-btn");
  if(btn) btn.disabled = aiTyping;
  // Update dot
  const dot = document.querySelector(".ai-dot");
  if(dot){dot.className="ai-dot"+(aiTyping?" thinking":"");}
}

async function generateQuizFromAI(subject, count){
  const n = parseInt(count)||15;
  showToast("🧠 Generating "+n+"-question quiz…","info");
  const isJEE  = activeCourse === 'jee';
  const isNEET = activeCourse === 'neet';
  const isCBSE10  = activeCourse === 'cbse10';
  const isCBSE12  = activeCourse === 'cbse12';

  // Exam-level difficulty configuration
  const examCtx = isNEET ? 'NEET UG (NTA)'
    : isJEE   ? 'JEE Mains & Advanced (NTA)'
    : isCBSE10 ? 'CBSE Class 10 board exam'
    : isCBSE12 ? 'CBSE Class 12 board exam'
    : 'university entrance exam';

  // Pick a mix of JEE/NEET specific question types for competitive exams
  const jeeNeetTypes = [
    "numerical/calculation-based (require substituting values and computing)",
    "assertion-reasoning (Statement I & Statement II pattern, NTA format)",
    "application-based (multi-concept, requires analysis not just recall)",
    "exception/odd-one-out (test conceptual clarity)",
    "match the column / statement-based",
    "graph/data interpretation (describe a graph scenario in text)",
    "common exam traps and misconceptions students get wrong",
    "NCERT exemplar difficulty level",
    "previous year JEE/NEET pattern questions",
    "conceptual (why/how — not definition-based)"
  ];
  const cbseTypes = [
    "NCERT textbook application", "value-based", "case study based",
    "graph and diagram interpretation", "assertion-reasoning", "multi-step problems"
  ];
  const types = (isJEE || isNEET)
    ? jeeNeetTypes
    : cbseTypes;

  // Pick 3 random question type flavors to mix in this quiz
  const shuffle = arr => [...arr].sort(()=>Math.random()-0.5);
  const chosenTypes = shuffle(types).slice(0,3).join('; ');

  // Difficulty distribution
  const diffDist = (isJEE||isNEET)
    ? `25% easy (confidence builders), 50% medium (application), 25% hard (advanced multi-step)`
    : `40% easy, 40% medium, 20% hard`;

  const prompt = `Generate exactly ${n} unique, high-quality multiple-choice questions on the topic: "${subject}" for ${examCtx} aspirants.

DIFFICULTY: ${diffDist}
QUESTION TYPES TO INCLUDE: ${chosenTypes}
STYLE RULES:
- Questions must be exam-level: no trivial definitions, no direct NCERT lifts unless twisted with application
- Include numerical problems where relevant (give values in the question, compute answer in options)
- Options must be plausible distractors — avoid obviously wrong choices
- Cover different aspects of the topic — do not repeat similar concepts
- For NEET: prioritise Biology (60%), Physics (20%), Chemistry (20%) weighting if topic spans multiple subjects
- For JEE: include formula derivation, dimensional analysis, and multi-step reasoning
- Each explanation must be ≤ 2 sentences, sharp, pointing out WHY the wrong options fail

OUTPUT FORMAT — ONLY a raw JSON array, nothing else:
[{"q":"question text","options":["A. ...","B. ...","C. ...","D. ..."],"answer":0,"explanation":"Why correct + why distractors fail","difficulty":"easy|medium|hard"}]
where "answer" is 0-based index of correct option.
Output all ${n} questions. Do not truncate.`;
  const resp = await askAI(prompt, true);
  // Guard: if AI returned an error string, don't try to parse
  if(!resp || typeof resp !== 'string' || resp.startsWith('⚠️') || resp.startsWith('No response')){
    showToast("⚠️ Quiz generation failed: " + (resp||"No response"), "alarm");
    return null;
  }
  try{
    // Strip any accidental markdown fences
    const cleaned = resp.replace(/```json|```/gi,'').trim();
    const match = cleaned.match(/\[[\s\S]*\]/);
    if(!match) return null;
    const qs = JSON.parse(match[0]);
    if(!Array.isArray(qs) || qs.length === 0) return null;
    // Validate each question has required fields (explanation & difficulty are optional bonuses)
    const valid = qs.filter(q => q.q && Array.isArray(q.options) && q.options.length >= 2 && typeof q.answer === 'number');
    if(valid.length === 0) return null;
    return valid.sort(()=>Math.random()-0.5).slice(0,n);
  }catch(e){
    showToast("⚠️ Could not parse quiz response. Try again.", "alarm");
    return null;
  }
}

// ══════════════════════════════════════════════════════════════

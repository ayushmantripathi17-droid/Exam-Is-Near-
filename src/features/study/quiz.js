// ══════════════════════════════════════════════════════════════
// QUIZ MODE
// ══════════════════════════════════════════════════════════════
let quizState={questions:[],current:0,selected:null,score:0,done:false,generating:false,subSel:'',unitSel:'',countSel:'15',showHistory:false,doneFilter:'All',reviewFilter:'All',reviewId:null,openReviewId:null};
let _proStatusCache = false; // updated by isProUser calls, used in sync renders

// ── PRO: Quiz & Flashcard logs ──
let quizLog = JSON.parse(localStorage.getItem('ein_quiz_log')||'[]');
let flashLog = JSON.parse(localStorage.getItem('ein_flash_log')||'[]');
const QUIZ_LOG_MAX  = 100;
const FLASH_LOG_MAX = 100;

function toggleQuizReview(id){
  quizState.openReviewId = (quizState.openReviewId===id ? null : id);
  quizState.reviewFilter = 'All';
  render();
}

function saveQuizLog(){
  localStorage.setItem('ein_quiz_log', JSON.stringify(quizLog.slice(-QUIZ_LOG_MAX)));
  if(!_firestoreUpdating){ clearTimeout(S._timer); S._timer = setTimeout(pushToFirebase, 1200); }
}
function saveFlashLog(){
  localStorage.setItem('ein_flash_log', JSON.stringify(flashLog.slice(-FLASH_LOG_MAX)));
  if(!_firestoreUpdating){ clearTimeout(S._timer); S._timer = setTimeout(pushToFirebase, 1200); }
}

async function startQuiz(unitName, qCount){
  const sub=quizState.subSel||"";
  if(!sub){showToast("⚠️ Please select a subject first","alarm");return;}

  // ── PRO GATE: Free users limited to FREE_QUIZ_LIMIT quiz attempts per session ──
  const _proForQuiz = await isProUser();
  if(!_proForQuiz){
    if(freeQuizCount >= FREE_QUIZ_LIMIT){
      showToast("⭐ Free limit reached ("+FREE_QUIZ_LIMIT+" quizzes). Upgrade to Pro for unlimited quizzes!","alarm");
      openProModal();
      return;
    }
    freeQuizCount = _incDailyCounter('ein_free_quiz_day');
  }

  // ── PRO GATE: 50-question quizzes are Pro only ──
  const _proForCount = await isProUser();
  const requestedQ = parseInt(qCount)||15;
  const numQ = _proForCount ? requestedQ : Math.min(requestedQ, 20);
  if(!_proForCount && requestedQ > 20){
    showToast("⭐ 50-question quizzes are Pro only. Generating 20 Qs instead — upgrade to Pro!","alarm");
    openProModal();
  }

  const subName=getSubjects().find(s=>s.id===sub)?.name||sub;
  const chapterCtx = unitName ? unitName+" ("+subName+")" : subName;
  quizState.generating=true;
  render();
  const questions=await generateQuizFromAI(chapterCtx, numQ);
  if(!questions){quizState.generating=false;render();return;}
  quizState.questions=questions;
  quizState.current=0;
  quizState.selected=null;
  quizState.score=0;
  quizState.done=false;
  quizState.generating=false;
  quizState.userAnswers=[];
  render();
  showToast("🧠 "+numQ+"-Q quiz ready"+(unitName?" · "+unitName:"")+"! Good luck!","success");
}

function selectAnswer(idx){
  if(quizState.selected!==null) return;
  quizState.selected=idx;
  if(!quizState.questions[quizState.current]) return;
  if(idx===quizState.questions[quizState.current].answer) quizState.score++;
  // Track user answer for log review
  if(!quizState.userAnswers) quizState.userAnswers=[];
  quizState.userAnswers[quizState.current]=idx;
  render();
}

function nextQuestion(){
  if(quizState.current<quizState.questions.length-1){
    quizState.current++;
    quizState.selected=null;
    render();
  } else {
    quizState.done=true;
    render();
    if(quizState.score===quizState.questions.length) spawnStars();
    // ── PRO: Save quiz result to log ──
    isProUser().then(pro=>{
      if(!pro) return;
      const sub = quizState.subSel||"";
      const subName = getSubjects().find(s=>s.id===sub)?.name||sub;
      quizLog.unshift({
        id: Date.now(),
        subject: sub,
        subjectName: subName,
        chapter: quizState.unitSel||"All Chapters",
        score: quizState.score,
        total: quizState.questions.length,
        pct: Math.round(quizState.score/quizState.questions.length*100),
        date: new Date().toISOString(),
        questions: quizState.questions.map((q,i)=>({
          q: q.q,
          options: q.options,
          answer: q.answer,
          userAnswer: (quizState.userAnswers||[])[i]??null,
          correct: (quizState.userAnswers||[])[i]===q.answer,
          difficulty: q.difficulty||null,
          explanation: q.explanation||""
        }))
      });
      saveQuizLog();
    });
  }
}

function renderQuiz(){
  const q=quizState.questions[quizState.current];
  // ── Full-page Question Review (from log) ──
  if(quizState.reviewId){
    const reviewEntry = quizLog.find(e=>e.id===quizState.reviewId)||null;
    if(reviewEntry){

      const qs = reviewEntry.questions||[];
      const correct = qs.filter(q=>q.correct).length;
      const wrong = qs.filter(q=>!q.correct && q.userAnswer!==null).length;
      const skipped = qs.filter(q=>q.userAnswer===null).length;
      const pctColor = reviewEntry.pct>=70?"#06D6A0":reviewEntry.pct>=50?"#FFE66D":"#FF6B35";
      return `<div class="fade-in">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
          <button class="btn-ghost" onclick="quizState.reviewId=null;render()" style="font-size:12px;padding:6px 12px">← Logs</button>
          <div>
            <div style="font-size:16px;font-weight:bold;color:#EDE8E0">${esc(reviewEntry.subjectName)} — ${esc(reviewEntry.chapter)}</div>
            <div style="font-size:11px;color:#555">${new Date(reviewEntry.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
          </div>
        </div>

        <!-- Score Summary Bar -->
        <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:14px;padding:18px;margin-bottom:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-size:28px;font-weight:800;color:${pctColor}">${reviewEntry.pct}%</div>
            <div style="text-align:right">
              <div style="font-size:13px;color:#ccc">${reviewEntry.score}/${reviewEntry.total} correct</div>
              <div style="font-size:11px;color:#555">${reviewEntry.total}-question quiz</div>
            </div>
          </div>
          <div style="height:6px;background:#111;border-radius:3px;overflow:hidden;margin-bottom:12px">
            <div style="height:100%;background:${pctColor};width:${reviewEntry.pct}%;border-radius:3px;transition:width 0.5s"></div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <span style="font-size:11px;background:#0a2a0a;border:1px solid #06D6A044;color:#06D6A0;border-radius:8px;padding:4px 12px">✅ ${correct} Correct</span>
            <span style="font-size:11px;background:#2a0a0a;border:1px solid #FF6B3544;color:#FF6B35;border-radius:8px;padding:4px 12px">❌ ${wrong} Wrong</span>
            ${skipped?`<span style="font-size:11px;background:#1a1a0a;border:1px solid #55555544;color:#555;border-radius:8px;padding:4px 12px">⬜ ${skipped} Skipped</span>`:''}
          </div>
        </div>

        <!-- Filter tabs -->
        <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
          ${['All','Correct','Wrong'].map(f=>`
            <button onclick="quizState.reviewFilter='${f}';render()" style="font-size:11px;padding:5px 14px;border-radius:20px;border:1px solid ${(quizState.reviewFilter||'All')===f?'#FFE66D':'#222'};background:${(quizState.reviewFilter||'All')===f?'#FFE66D22':'transparent'};color:${(quizState.reviewFilter||'All')===f?'#FFE66D':'#555'};cursor:pointer;font-family:inherit">${f}</button>
          `).join('')}
        </div>

        <!-- Question List -->
        <div style="display:flex;flex-direction:column;gap:12px">
          ${qs.filter(q=>{
            const f=quizState.reviewFilter||'All';
            if(f==='Correct') return q.correct;
            if(f==='Wrong') return !q.correct;
            return true;
          }).map((q,i)=>{
            const realIdx = qs.indexOf(q);
            const isCorrect = q.correct;
            const borderColor = isCorrect?"#06D6A044":"#FF6B3544";
            const bgColor = isCorrect?"#0a1a0a":"#1a0a0a";
            const diffColor = q.difficulty==='hard'?"#FF6B35":q.difficulty==='medium'?"#FFE66D":"#06D6A0";
            return `<div style="background:${bgColor};border:1px solid ${borderColor};border-radius:12px;padding:16px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px">
                <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
                  <span style="font-size:11px;background:#111;border-radius:6px;padding:2px 8px;color:#555">Q${realIdx+1}</span>
                  ${q.difficulty?`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;background:#111;color:${diffColor}">${q.difficulty==='hard'?"🔴 Hard":q.difficulty==='medium'?"🟡 Med":"🟢 Easy"}</span>`:''}
                </div>
                <span style="font-size:14px">${isCorrect?"✅":"❌"}</span>
              </div>
              <div style="font-size:13px;color:#EDE8E0;line-height:1.6;margin-bottom:12px">${esc(q.q)}</div>
              ${(q.options||[]).length>0 ? (q.options||[]).map((opt,oi)=>{
                const isAnswer = oi===q.answer;
                const isUser = oi===q.userAnswer;
                let bg="#0f0f18",border="#1e1e2e",color="#666",icon="";
                if(isAnswer){bg="#0a2a0a";border="#06D6A0";color="#06D6A0";icon="✓ ";}
                if(isUser&&!isAnswer){bg="#2a0a0a";border="#FF6B35";color="#FF6B35";icon="✗ ";}
                return `<div style="background:${bg};border:1px solid ${border};color:${color};padding:8px 12px;border-radius:8px;font-size:12px;margin-bottom:6px;line-height:1.4">${icon}${String.fromCharCode(65+oi)}. ${esc(opt)}</div>`;
              }).join('') : `<div style="font-size:11px;color:#444;font-style:italic;padding:6px 0">Options not stored for this entry — only new quizzes log full options</div>`}
              ${q.explanation?`<div style="margin-top:10px;padding:10px 12px;background:#08080f;border-left:3px solid #FFE66D44;border-radius:0 8px 8px 0;font-size:12px;color:#888;line-height:1.6">💡 ${esc(q.explanation)}</div>`:''}
            </div>`;
          }).join('')}
        </div>
      </div>`;

    }
  }


  return`<div class="fade-in">
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
      <div style="font-size:18px;font-weight:bold">🧠 AI Quiz</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <select style="font-size:11px;padding:6px" onchange="quizState.subSel=this.value;quizState.unitSel='';render()">
          <option value="">— Select Subject —</option>
          ${getSubjects().map(s=>`<option value="${s.id}" ${quizState.subSel===s.id?"selected":""}>${s.icon} ${s.name}</option>`).join("")}
        </select>
        <select style="font-size:11px;padding:6px" onchange="quizState.unitSel=this.value">
          <option value="">All Chapters</option>
          ${(getSubjects().find(s=>s.id===quizState.subSel)?.units||[]).map(u=>`<option value="${esc(u.name)}" ${quizState.unitSel===esc(u.name)?"selected":""}>${esc(u.name)}</option>`).join("")}
        </select>
        <select style="font-size:11px;padding:6px" onchange="quizState.countSel=this.value">
          ${["10","15","20","50"].map(n=>`<option value="${n}" ${(quizState.countSel||"15")===n?"selected":""}>${n} Questions${n==="50"?" ⭐ Pro":""}</option>`).join("")}
        </select>
        <button class="btn-gold" onclick="startQuiz(quizState.unitSel||null, quizState.countSel||15)" ${quizState.generating||!quizState.subSel?"disabled":""}>
          ${quizState.generating?"⏳ Generating…":"✨ Start Quiz"}
        </button>
      </div>
    </div>
    ${quizState.questions.length===0?`
      <div class="empty-state">
        <div style="font-size:48px;margin-bottom:12px">🧠</div>
        <div style="font-size:14px;margin-bottom:6px">AI-Powered Quiz</div>
        <div style="font-size:12px;color:#444">Select a subject and click "Start Quiz" to test yourself!</div>
        ${_proStatusCache?"":"<div style='margin-top:10px;font-size:11px;color:#FFE66D88;background:#1a1200;border:1px solid #FFE66D22;border-radius:8px;padding:6px 12px;display:inline-block'>Free: "+Math.max(0,FREE_QUIZ_LIMIT-freeQuizCount)+" quiz attempts left this session · <span style='color:#FFE66D;cursor:pointer' onclick='openProModal()'>Go Pro for unlimited ⭐</span></div>"}
      </div>`:quizState.done?`
      <div>
        <!-- ── Score Card ── -->
        <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:16px;padding:28px;text-align:center;margin-bottom:16px">
          <div style="font-size:48px;margin-bottom:12px">${quizState.score===quizState.questions.length?"🏆":quizState.score>=quizState.questions.length*0.7?"🎯":"📊"}</div>
          <div style="font-size:22px;font-weight:bold;color:#FFE66D;margin-bottom:6px">Quiz Complete!</div>
          <div style="font-size:40px;font-weight:800;color:#EDE8E0;margin-bottom:2px">${quizState.score}<span style="font-size:20px;color:#444">/${quizState.questions.length}</span></div>
          <div style="font-size:13px;color:#555;margin-bottom:14px">${Math.round(quizState.score/quizState.questions.length*100)}% accuracy</div>
          <!-- Progress bar -->
          <div style="height:6px;background:#111;border-radius:3px;overflow:hidden;margin-bottom:14px">
            <div style="height:100%;width:${Math.round(quizState.score/quizState.questions.length*100)}%;background:${quizState.score/quizState.questions.length>=0.7?"#06D6A0":quizState.score/quizState.questions.length>=0.5?"#FFE66D":"#FF6B35"};border-radius:3px;transition:width 0.5s"></div>
          </div>
          <!-- Stat pills -->
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:16px">
            <span style="font-size:11px;background:#0a2a0a;border:1px solid #06D6A044;color:#06D6A0;border-radius:8px;padding:4px 12px">✅ ${quizState.score} Correct</span>
            <span style="font-size:11px;background:#2a0a0a;border:1px solid #FF6B3544;color:#FF6B35;border-radius:8px;padding:4px 12px">❌ ${quizState.questions.length-quizState.score} Wrong</span>
            ${(()=>{
              const qs=quizState.questions;
              const hard=qs.filter(q=>q.difficulty==='hard').length;
              const med=qs.filter(q=>q.difficulty==='medium').length;
              const easy=qs.filter(q=>q.difficulty==='easy').length;
              return [
                easy?`<span style="font-size:11px;background:#0a1a0a;border:1px solid #06D6A044;color:#06D6A088;border-radius:8px;padding:4px 12px">🟢 ${easy} Easy</span>`:'',
                med?`<span style="font-size:11px;background:#1a1200;border:1px solid #FFE66D44;color:#FFE66D88;border-radius:8px;padding:4px 12px">🟡 ${med} Med</span>`:'',
                hard?`<span style="font-size:11px;background:#2a0a0a;border:1px solid #FF6B3544;color:#FF6B3588;border-radius:8px;padding:4px 12px">🔴 ${hard} Hard</span>`:'',
              ].join('');
            })()}
          </div>
          <div style="font-size:13px;color:#888;margin-bottom:20px">${quizState.score===quizState.questions.length?"Perfect score! You're exam-ready 🌟":quizState.score>=Math.ceil(quizState.questions.length*0.7)?"Good job! Review the ones you missed 💪":quizState.score>=Math.ceil(quizState.questions.length*0.5)?"Keep going — revise the concepts and retry 📚":"Focus on fundamentals and reattempt 🔁"}</div>
          <button class="btn-gold" onclick="startQuiz(quizState.unitSel||null, quizState.countSel||15)" style="padding:12px 32px">🔁 Try Again</button>
        </div>

        <!-- ── Inline Question Review ── -->
        <div style="margin-bottom:12px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="font-size:14px;font-weight:700;color:#EDE8E0">Question Review</div>
            <div style="display:flex;gap:6px">
              ${['All','Correct','Wrong'].map(f=>`
                <button onclick="quizState.doneFilter='${f}';render()" style="font-size:10px;padding:4px 10px;border-radius:12px;border:1px solid ${(quizState.doneFilter||'All')===f?'#FFE66D':'#222'};background:${(quizState.doneFilter||'All')===f?'#FFE66D22':'transparent'};color:${(quizState.doneFilter||'All')===f?'#FFE66D':'#555'};cursor:pointer;font-family:inherit">${f}</button>
              `).join('')}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${quizState.questions.filter((q,i)=>{
              const ua=(quizState.userAnswers||[])[i];
              const correct=ua===q.answer;
              const f=quizState.doneFilter||'All';
              if(f==='Correct') return correct;
              if(f==='Wrong') return !correct;
              return true;
            }).map((q,fi)=>{
              const realIdx=quizState.questions.indexOf(q);
              const ua=(quizState.userAnswers||[])[realIdx];
              const correct=ua===q.answer;
              const diffColor=q.difficulty==='hard'?"#FF6B35":q.difficulty==='medium'?"#FFE66D":"#06D6A0";
              return `<div style="background:${correct?"#0a1a0a":"#1a0a0a"};border:1px solid ${correct?"#06D6A033":"#FF6B3533"};border-radius:12px;padding:14px 16px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                  <span style="font-size:10px;background:#111;color:#555;padding:2px 8px;border-radius:6px">Q${realIdx+1}</span>
                  ${q.difficulty?`<span style="font-size:10px;font-weight:700;color:${diffColor}">${q.difficulty==='hard'?"🔴 Hard":q.difficulty==='medium'?"🟡 Medium":"🟢 Easy"}</span>`:''}
                  <span style="margin-left:auto;font-size:13px">${correct?"✅":"❌"}</span>
                </div>
                <div style="font-size:13px;color:#EDE8E0;line-height:1.6;margin-bottom:12px;font-weight:500">${esc(q.q)}</div>
                <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:${q.explanation?'10px':'0'}">
                  ${q.options.map((opt,oi)=>{
                    const isAns=oi===q.answer;
                    const isUser=oi===ua;
                    let bg="#0f0f18",border="#1e1e2e",color="#555",prefix="";
                    if(isAns){bg="#0a2a0a";border="#06D6A0";color="#06D6A0";prefix="✓ ";}
                    if(isUser&&!isAns){bg="#2a0a0a";border="#FF6B35";color="#FF6B35";prefix="✗ ";}
                    return `<div style="background:${bg};border:1px solid ${border};color:${color};padding:8px 12px;border-radius:8px;font-size:12px;line-height:1.4">${prefix}<b>${String.fromCharCode(65+oi)}.</b> ${esc(opt)}</div>`;
                  }).join('')}
                </div>
                ${q.explanation?`<div style="padding:10px 12px;background:#08080f;border-left:3px solid #FFE66D44;border-radius:0 8px 8px 0;font-size:12px;color:#888;line-height:1.6;margin-top:8px">💡 ${esc(q.explanation)}</div>`:''}
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>`:`
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <span style="font-size:12px;color:#444">Question ${quizState.current+1}/${quizState.questions.length}</span>
          <div style="display:flex;align-items:center;gap:8px">
            ${q.difficulty?`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:${q.difficulty==='hard'?"#2a0a0a":q.difficulty==='medium'?"#1a1200":"#0a1a0a"};color:${q.difficulty==='hard'?"#FF6B35":q.difficulty==='medium'?"#FFE66D":"#06D6A0"};border:1px solid ${q.difficulty==='hard'?"#FF6B3544":q.difficulty==='medium'?"#FFE66D44":"#06D6A044"}">${q.difficulty==='hard'?"🔴 Hard":q.difficulty==='medium'?"🟡 Medium":"🟢 Easy"}</span>`:""}
            <span style="font-size:12px;color:#06D6A0">Score: ${quizState.score}</span>
          </div>
        </div>
        <div style="font-size:15px;font-weight:bold;margin-bottom:20px;line-height:1.5">${esc(q.q)}</div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
          ${q.options.map((opt,i)=>{
            let bg="#0f0f18",border="#222",color="#aaa";
            if(quizState.selected!==null){
              if(i===q.answer){bg="#0a2a0a";border="#06D6A0";color="#06D6A0";}
              else if(i===quizState.selected&&i!==q.answer){bg="#2a0a0a";border="#FF6B35";color="#FF6B35";}
            }
            return`<button onclick="selectAnswer(${i})" style="background:${bg};border:1px solid ${border};color:${color};
              padding:12px 16px;border-radius:10px;text-align:left;font-family:inherit;font-size:13px;cursor:pointer;transition:all 0.2s">
              ${String.fromCharCode(65+i)}. ${esc(opt)}</button>`;
          }).join("")}
        </div>
        ${quizState.selected!==null?`
          <div style="padding:14px;background:#0a0a12;border-radius:10px;margin-bottom:16px;border-left:3px solid ${quizState.selected===q.answer?"#06D6A0":"#FF6B35"}">
            <div style="font-size:13px;font-weight:700;color:${quizState.selected===q.answer?"#06D6A0":"#FF6B35"};margin-bottom:6px">
              ${quizState.selected===q.answer?"✅ Correct!":"❌ Incorrect — Correct: "+String.fromCharCode(65+q.answer)+". "+esc(q.options[q.answer])}
            </div>
            ${q.explanation?`<div style="font-size:12px;color:#aaa;line-height:1.6;margin-bottom:6px">💡 <b>Explanation:</b> ${esc(q.explanation)}</div>`:""}
            ${q.difficulty?`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:${q.difficulty==='hard'?"#2a0a0a":q.difficulty==='medium'?"#1a1200":"#0a1a0a"};color:${q.difficulty==='hard'?"#FF6B35":q.difficulty==='medium'?"#FFE66D":"#06D6A0"};border:1px solid ${q.difficulty==='hard'?"#FF6B3544":q.difficulty==='medium'?"#FFE66D44":"#06D6A044"};text-transform:uppercase;letter-spacing:0.5px">${q.difficulty==='hard'?"🔴 Hard":q.difficulty==='medium'?"🟡 Medium":"🟢 Easy"}</span>`:""}
          </div>
          <button class="btn-gold" onclick="nextQuestion()" style="width:100%">${quizState.current<quizState.questions.length-1?"Next Question →":"See Results 🏆"}</button>`:""}
      </div>`}

    <!-- ── PRO: Quiz Logs below quiz ── -->
    ${_proStatusCache && quizLog.length>0 ? `
    <div style="margin-top:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:14px;font-weight:700;color:#EDE8E0">📋 Quiz Logs</div>
        <button onclick="if(confirm('Clear all quiz logs?')){quizLog=[];saveQuizLog();render();}" style="background:none;border:none;font-size:11px;color:#FF6B3566;cursor:pointer;font-family:inherit">🗑️ Clear</button>
      </div>
      <!-- Chapter-wise grouped — filtered to current course subjects -->
      ${(()=>{
        const courseSubjectIds = new Set(getSubjects().map(s=>s.id));
        const filteredLog = quizLog.filter(e=>courseSubjectIds.has(e.subject));
        // [FIX C10] Distinguish 'no stream selected' from 'no logs'
        if(filteredLog.length===0){
          if(activeCourse==='cbse12' && !cbse12Stream)
            return '<div style="font-size:12px;color:#FFE66D88;padding:8px 0">Select your Class 12 stream first to see quiz logs.</div>';
          return '<div style="font-size:12px;color:#444;font-style:italic;padding:8px 0">No quiz logs for this course yet.</div>';
        }
        const grouped={};
        filteredLog.forEach(e=>{
          const k=e.subjectName||e.subject||"Unknown";
          if(!grouped[k]) grouped[k]=[];
          grouped[k].push(e);
        });
        return Object.entries(grouped).map(([subj,entries])=>`
          <div style="margin-bottom:16px">
            <div style="font-size:10px;font-weight:700;color:#FFE66D99;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">${esc(subj)}</div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${entries.map(entry=>{
                const pc=entry.pct>=70?"#06D6A0":entry.pct>=50?"#FFE66D":"#FF6B35";
                const hasQ=(entry.questions||[]).length>0;
                return `<div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:10px">
                  <div style="flex-shrink:0;width:40px;height:40px;border-radius:50%;border:2px solid ${pc};display:flex;align-items:center;justify-content:center">
                    <span style="font-size:11px;font-weight:800;color:${pc}">${entry.pct}%</span>
                  </div>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:12px;font-weight:600;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(entry.chapter)}</div>
                    <div style="font-size:10px;color:#555;margin-top:2px"><span style="color:#06D6A0">${entry.score}</span>/${entry.total} · ${new Date(entry.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
                    <div style="height:2px;background:#111;border-radius:1px;margin-top:5px;overflow:hidden"><div style="height:100%;background:${pc};width:${entry.pct}%;border-radius:1px"></div></div>
                  </div>
                  ${hasQ?`<button onclick="toggleQuizReview(${entry.id})" style="flex-shrink:0;background:${quizState.openReviewId===entry.id?'#FFE66D22':'#FFE66D11'};border:1px solid #FFE66D33;color:#FFE66D;font-size:10px;padding:5px 10px;border-radius:8px;cursor:pointer;font-family:inherit">${quizState.openReviewId===entry.id?'▲ Close':'Review →'}</button>`:''}
                </div>
                ${quizState.openReviewId===entry.id ? `
                <div style="margin-top:10px;border-top:1px solid #1e1e2e;padding-top:12px">
                  <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
                    ${['All','Correct','Wrong'].map(f=>`
                      <button onclick="quizState.reviewFilter='${f}';render()" style="font-size:10px;padding:3px 10px;border-radius:10px;border:1px solid ${(quizState.reviewFilter||'All')===f?'#FFE66D':'#222'};background:${(quizState.reviewFilter||'All')===f?'#FFE66D22':'transparent'};color:${(quizState.reviewFilter||'All')===f?'#FFE66D':'#555'};cursor:pointer;font-family:inherit">${f}</button>
                    `).join('')}
                  </div>
                  <div style="display:flex;flex-direction:column;gap:8px">
                    ${(entry.questions||[]).filter(q=>{
                      const f=quizState.reviewFilter||'All';
                      if(f==='Correct') return q.correct;
                      if(f==='Wrong') return !q.correct;
                      return true;
                    }).map((q,qi)=>{
                      const realIdx=(entry.questions||[]).indexOf(q);
                      const diffColor=q.difficulty==='hard'?"#FF6B35":q.difficulty==='medium'?"#FFE66D":"#06D6A0";
                      return `<div style="background:${q.correct?"#0a1a0a":"#1a0a0a"};border:1px solid ${q.correct?"#06D6A022":"#FF6B3522"};border-radius:10px;padding:12px">
                        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                          <span style="font-size:10px;background:#111;color:#555;padding:2px 7px;border-radius:5px">Q${realIdx+1}</span>
                          ${q.difficulty?`<span style="font-size:10px;color:${diffColor}">${q.difficulty==='hard'?"🔴 Hard":q.difficulty==='medium'?"🟡 Medium":"🟢 Easy"}</span>`:''}
                          <span style="margin-left:auto">${q.correct?"✅":"❌"}</span>
                        </div>
                        <div style="font-size:12px;color:#EDE8E0;line-height:1.6;margin-bottom:10px;font-weight:500">${esc(q.q)}</div>
                        <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:${q.explanation?'8px':'0'}">
                          ${(q.options||[]).length>0 ? (q.options||[]).map((opt,oi)=>{
                            const isAns=oi===q.answer;
                            const isUser=oi===q.userAnswer;
                            let bg="#0f0f18",border="#1e1e2e",col="#555",pre="";
                            if(isAns){bg="#0a2a0a";border="#06D6A0";col="#06D6A0";pre="✓ ";}
                            if(isUser&&!isAns){bg="#2a0a0a";border="#FF6B35";col="#FF6B35";pre="✗ ";}
                            return `<div style="background:${bg};border:1px solid ${border};color:${col};padding:7px 10px;border-radius:7px;font-size:11px;line-height:1.4">${pre}<b>${String.fromCharCode(65+oi)}.</b> ${esc(opt)}</div>`;
                          }).join('') : `<div style="font-size:10px;color:#444;font-style:italic">Options not stored — only new quizzes show full options</div>`}
                        </div>
                        ${q.explanation?`<div style="padding:8px 10px;background:#08080f;border-left:2px solid #FFE66D33;border-radius:0 6px 6px 0;font-size:11px;color:#888;line-height:1.5;margin-top:6px">💡 ${esc(q.explanation)}</div>`:''}
                      </div>`;
                    }).join('')}
                  </div>
                </div>` : ''}
                `;
              }).join('')}
            </div>
          </div>
        `).join('');
      })()}
    </div>` : ''}
  </div>`;
}


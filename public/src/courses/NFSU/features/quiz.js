import { CourseRuntime } from "../../../core/course-runtime.js";
import { render } from "../ui/render-core.js";
import { S, _firestoreUpdating, pushToFirebase } from "../../../core/firebase-sync.js";
import { esc, showToast } from "../../../utils/helpers.js";
import { isProUser, openProModal } from "./payments-pro.js";
import { AiAssistantSetupShared, FREE_QUIZ_LIMIT, _incDailyCounter, generateQuizFromAI } from "./ai-assistant-setup.js";
import { CourseSelectorShared, getSubjects } from "../../../core/course-selector.js";
import { spawnStars } from "./clock-alarms-timer.js";

// ══════════════════════════════════════════════════════════════
let quizState={questions:[],current:0,selected:null,score:0,done:false,generating:false,subSel:'',unitSel:'',countSel:'15',showHistory:false,doneFilter:'All',reviewFilter:'All',reviewId:null,openReviewId:null};
CourseRuntime._proStatusCache = false; // updated by isProUser calls, used in sync renders

// ── PRO: Quiz & Flashcard logs ──
CourseRuntime.quizLog = JSON.parse(localStorage.getItem('ein_quiz_log')||'[]');
CourseRuntime.flashLog = JSON.parse(localStorage.getItem('ein_flash_log')||'[]');
const QUIZ_LOG_MAX  = 100;
const FLASH_LOG_MAX = 100;

function toggleQuizReview(id){
  quizState.openReviewId = (quizState.openReviewId===id ? null : id);
  quizState.reviewFilter = 'All';
  render();
}

function saveQuizLog(){
  localStorage.setItem('ein_quiz_log', JSON.stringify(CourseRuntime.quizLog.slice(-QUIZ_LOG_MAX)));
  if(!_firestoreUpdating){ clearTimeout(S._timer); S._timer = setTimeout(pushToFirebase, 1200); }
}
function saveFlashLog(){
  localStorage.setItem('ein_flash_log', JSON.stringify(CourseRuntime.flashLog.slice(-FLASH_LOG_MAX)));
  if(!_firestoreUpdating){ clearTimeout(S._timer); S._timer = setTimeout(pushToFirebase, 1200); }
}

async function startQuiz(unitName, qCount){
  const sub=quizState.subSel||"";
  if(!sub){showToast("⚠️ Please select a subject first","alarm");return;}

  // ── PRO GATE: Free users limited to FREE_QUIZ_LIMIT quiz attempts per session ──
  const _proForQuiz = await isProUser();
  if(!_proForQuiz){
    if(AiAssistantSetupShared.freeQuizCount >= FREE_QUIZ_LIMIT){
      showToast("⭐ Free limit reached ("+FREE_QUIZ_LIMIT+" quizzes). Upgrade to Pro for unlimited quizzes!","alarm");
      openProModal();
      return;
    }
    AiAssistantSetupShared.freeQuizCount = _incDailyCounter('ein_free_quiz_day');
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
      CourseRuntime.quizLog.unshift({
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
  const css=`<style>
.qz{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:860px;margin:0 auto}
.qz *{box-sizing:border-box}
.qz-h1{font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--txt);line-height:1.1}
.qz-h2{font-size:13px;color:var(--mute);margin:6px 0 16px}
.qz-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:20px;padding:20px}
.qz-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--line);background:var(--surf);color:var(--text-2,#ccc);padding:10px 16px;border-radius:12px;font-weight:700;font-size:12.5px;font-family:inherit;cursor:pointer;transition:.2s}
.qz-btn:hover{border-color:var(--acc);transform:translateY(-1px)}
.qz-btn.p{background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-color:transparent;box-shadow:0 6px 18px -6px #FFB70088}
.qz-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.qz-setup{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;align-items:end;margin-bottom:18px}
.qz-setup label{display:block;font-size:10px;font-weight:800;letter-spacing:1.4px;color:var(--mute);margin-bottom:6px}
.qz-setup select{width:100%;margin:0;border-radius:12px;padding:11px 12px;font-size:12.5px}
.qz-setup .qz-btn{padding:12px 18px;font-size:13.5px}
.qz-empty{text-align:center;padding:48px 16px;border:1.5px dashed var(--line);border-radius:20px}
.qz-empty .e{font-size:50px;margin-bottom:8px}
.qz-empty b{display:block;font-size:16px;color:var(--txt);margin-bottom:5px}
.qz-empty p{font-size:12.5px;color:var(--mute);margin:0}
.qz-free{margin-top:14px;font-size:11.5px;color:var(--acc);background:color-mix(in srgb,var(--acc) 10%,transparent);border:1px solid color-mix(in srgb,var(--acc) 25%,transparent);border-radius:99px;padding:6px 14px;display:inline-block}
.qz-free span{font-weight:800;cursor:pointer}
.qz-prog{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--mute);font-weight:600;margin-bottom:8px}
.qz-prog b{color:var(--txt)}
.qz-bar{height:6px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);overflow:hidden;margin-bottom:18px}
.qz-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#FFE66D,#FF6B35);transition:width .4s}
.qz-q{font-size:18px;font-weight:700;line-height:1.55;color:var(--txt);margin-bottom:18px}
.qz-opts{display:grid;gap:10px;margin-bottom:18px}
.qz-opt{display:flex;align-items:flex-start;gap:12px;text-align:left;border:1.5px solid var(--line);background:var(--surf);color:var(--text-2,#ccc);padding:13px 15px;border-radius:14px;font-family:inherit;font-size:13.5px;line-height:1.45;cursor:pointer;transition:.18s}
.qz-opt:hover:not(:disabled){border-color:var(--acc);transform:translateX(2px)}
.qz-opt .l{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;flex-shrink:0;font-size:12px;font-weight:800;background:color-mix(in srgb,var(--txt) 8%,transparent);color:var(--mute)}
.qz-opt.ok{border-color:#06D6A0;background:color-mix(in srgb,#06D6A0 12%,var(--surf));color:#06D6A0}
.qz-opt.ok .l{background:#06D6A0;color:#08120e}
.qz-opt.bad{border-color:#FF6B35;background:color-mix(in srgb,#FF6B35 12%,var(--surf));color:#FF6B35}
.qz-opt.bad .l{background:#FF6B35;color:#fff}
.qz-fb{padding:14px 16px;border-radius:14px;margin-bottom:16px;border-left:4px solid var(--c);background:color-mix(in srgb,var(--c) 8%,transparent)}
.qz-fb b{display:block;color:var(--c);font-size:13.5px;margin-bottom:6px}
.qz-fb p{margin:0 0 6px;font-size:12.5px;color:var(--text-3,#aaa);line-height:1.6}
.qz-diff{font-size:10px;font-weight:800;padding:3px 10px;border-radius:99px;border:1px solid;display:inline-block}
.qz-score{text-align:center;padding:30px 22px;margin-bottom:18px}
.qz-score .big{font-size:52px;font-weight:800;letter-spacing:-2px;color:var(--txt);line-height:1}
.qz-score .big small{font-size:22px;color:var(--mute);letter-spacing:0}
.qz-pills{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:14px 0}
.qz-pill{font-size:11.5px;font-weight:700;border-radius:99px;padding:5px 13px;border:1px solid;background:transparent}
.qz-sec{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:0 0 12px}
.qz-sec h3{margin:0;font-size:16px;font-weight:800;color:var(--txt);letter-spacing:-.3px}
.qz-tabs{display:flex;gap:6px}
.qz-tab{font-size:11.5px;font-weight:700;padding:6px 13px;border-radius:99px;border:1px solid var(--line);background:transparent;color:var(--mute);cursor:pointer;font-family:inherit;transition:.2s}
.qz-tab.on{border-color:var(--acc);color:var(--acc);background:color-mix(in srgb,var(--acc) 12%,transparent)}
.qz-rv{border:1px solid;border-radius:16px;padding:15px 16px;margin-bottom:10px}
.qz-rv-h{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.qz-tag{font-size:10.5px;font-weight:800;background:color-mix(in srgb,var(--txt) 8%,transparent);color:var(--mute);padding:2px 9px;border-radius:99px}
.qz-rv-q{font-size:13.5px;color:var(--txt);line-height:1.6;margin-bottom:12px;font-weight:600}
.qz-ro{padding:9px 12px;border-radius:10px;font-size:12.5px;line-height:1.45;margin-bottom:6px;border:1px solid var(--line);color:var(--mute)}
.qz-ro.ok{border-color:#06D6A0;background:color-mix(in srgb,#06D6A0 12%,transparent);color:#06D6A0}
.qz-ro.bad{border-color:#FF6B35;background:color-mix(in srgb,#FF6B35 12%,transparent);color:#FF6B35}
.qz-ex{margin-top:10px;padding:10px 13px;border-left:3px solid color-mix(in srgb,var(--acc) 50%,transparent);border-radius:0 10px 10px 0;background:color-mix(in srgb,var(--txt) 4%,transparent);font-size:12.5px;color:var(--text-4,#888);line-height:1.6}
.qz-grp{font-size:11px;font-weight:800;color:var(--acc);letter-spacing:1.4px;text-transform:uppercase;margin:16px 0 8px 2px}
.qz-log{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:16px;padding:12px 14px;margin-bottom:8px}
.qz-log-r{display:flex;align-items:center;gap:12px}
.qz-log-c{width:44px;height:44px;border-radius:50%;border:2.5px solid;display:grid;place-items:center;font-size:11px;font-weight:800;flex-shrink:0}
.qz-log b{display:block;font-size:13px;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.qz-log span.s{font-size:11px;color:var(--mute)}
.qz-mini{height:3px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);margin-top:6px;overflow:hidden}
.qz-mini i{display:block;height:100%;border-radius:99px}
@media(max-width:520px){.qz-q{font-size:16px}.qz-score .big{font-size:42px}}
</style>`;

  const diffCol=(d)=>d==='hard'?"#FF6B35":d==='medium'?"#FFE66D":"#06D6A0";
  const diffLbl=(d,short)=>d==='hard'?"🔴 Hard":d==='medium'?(short?"🟡 Med":"🟡 Medium"):"🟢 Easy";
  const pcOf=(p)=>p>=70?"#06D6A0":p>=50?"#FFE66D":"#FF6B35";
  const tabs=(key)=>['All','Correct','Wrong'].map(f=>`<button class="qz-tab ${(quizState[key]||'All')===f?'on':''}" onclick="quizState.${key}='${f}';render()">${f}</button>`).join('');
  const reviewCard=(qq,idx,ua,correct)=>{
    const col=correct?"#06D6A0":"#FF6B35";
    const opts=(qq.options||[]).length>0?(qq.options||[]).map((opt,oi)=>{
      const isAns=oi===qq.answer, isUser=oi===ua;
      const cls=isAns?"ok":(isUser?"bad":"");
      const pre=isAns?"✓ ":(isUser?"✗ ":"");
      return `<div class="qz-ro ${cls}">${pre}<b>${String.fromCharCode(65+oi)}.</b> ${esc(opt)}</div>`;
    }).join(''):`<div style="font-size:11.5px;color:var(--mute);font-style:italic">Options not stored for this entry — only new quizzes log full options</div>`;
    return `<div class="qz-rv" style="border-color:color-mix(in srgb,${col} 35%,var(--line));background:color-mix(in srgb,${col} 6%,transparent)">
      <div class="qz-rv-h">
        <span class="qz-tag">Q${idx+1}</span>
        ${qq.difficulty?`<span style="font-size:10.5px;font-weight:800;color:${diffCol(qq.difficulty)}">${diffLbl(qq.difficulty)}</span>`:''}
        <span style="margin-left:auto;font-size:14px">${correct?"✅":"❌"}</span>
      </div>
      <div class="qz-rv-q">${esc(qq.q)}</div>
      ${opts}
      ${qq.explanation?`<div class="qz-ex">💡 ${esc(qq.explanation)}</div>`:''}
    </div>`;
  };

  // ── Full-page Question Review (from log) ──
  if(quizState.reviewId){
    const reviewEntry = CourseRuntime.quizLog.find(e=>e.id===quizState.reviewId)||null;
    if(reviewEntry){
      const qs = reviewEntry.questions||[];
      const correct = qs.filter(q=>q.correct).length;
      const wrong = qs.filter(q=>!q.correct && q.userAnswer!==null).length;
      const skipped = qs.filter(q=>q.userAnswer===null).length;
      const pctColor = pcOf(reviewEntry.pct);
      return `${css}<div class="qz fade-in">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;flex-wrap:wrap">
          <button class="qz-btn" onclick="quizState.reviewId=null;render()">← Logs</button>
          <div>
            <div style="font-size:17px;font-weight:800;color:var(--txt)">${esc(reviewEntry.subjectName)} — ${esc(reviewEntry.chapter)}</div>
            <div style="font-size:11.5px;color:var(--mute)">${new Date(reviewEntry.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
          </div>
        </div>
        <div class="qz-card" style="margin-bottom:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-size:34px;font-weight:800;letter-spacing:-1px;color:${pctColor}">${reviewEntry.pct}%</div>
            <div style="text-align:right">
              <div style="font-size:13.5px;color:var(--text-2,#ccc);font-weight:700">${reviewEntry.score}/${reviewEntry.total} correct</div>
              <div style="font-size:11.5px;color:var(--mute)">${reviewEntry.total}-question quiz</div>
            </div>
          </div>
          <div class="qz-bar" style="margin-bottom:12px"><i style="width:${reviewEntry.pct}%;background:${pctColor}"></i></div>
          <div class="qz-pills" style="justify-content:flex-start;margin:0">
            <span class="qz-pill" style="color:#06D6A0;border-color:#06D6A055">✅ ${correct} Correct</span>
            <span class="qz-pill" style="color:#FF6B35;border-color:#FF6B3555">❌ ${wrong} Wrong</span>
            ${skipped?`<span class="qz-pill" style="color:var(--mute);border-color:var(--line)">⬜ ${skipped} Skipped</span>`:''}
          </div>
        </div>
        <div class="qz-tabs" style="margin-bottom:14px">${tabs('reviewFilter')}</div>
        ${qs.filter(q=>{
          const f=quizState.reviewFilter||'All';
          if(f==='Correct') return q.correct;
          if(f==='Wrong') return !q.correct;
          return true;
        }).map(q=>reviewCard(q,qs.indexOf(q),q.userAnswer,q.correct)).join('')}
      </div>`;
    }
  }

  const total=quizState.questions.length;
  const subOpts=getSubjects().map(s=>`<option value="${s.id}" ${quizState.subSel===s.id?"selected":""}>${s.icon} ${s.name}</option>`).join("");
  const unitOpts=(getSubjects().find(s=>s.id===quizState.subSel)?.units||[]).map(u=>`<option value="${esc(u.name)}" ${quizState.unitSel===esc(u.name)?"selected":""}>${esc(u.name)}</option>`).join("");
  const cntOpts=["10","15","20","50"].map(n=>`<option value="${n}" ${(quizState.countSel||"15")===n?"selected":""}>${n} Questions${n==="50"?" ⭐ Pro":""}</option>`).join("");

  let body="";
  if(total===0){
    body=`<div class="qz-empty">
        <div class="e">🧠</div><b>AI-Powered Quiz</b>
        <p>Select a subject and click "Start Quiz" to test yourself!</p>
        ${CourseRuntime._proStatusCache?"":"<div class='qz-free'>Free: "+Math.max(0,FREE_QUIZ_LIMIT-AiAssistantSetupShared.freeQuizCount)+" quiz attempts left this session · <span onclick='openProModal()'>Go Pro for unlimited ⭐</span></div>"}
      </div>`;
  } else if(quizState.done){
    const ratio=quizState.score/total;
    const pctN=Math.round(ratio*100);
    const qs=quizState.questions;
    const hard=qs.filter(x=>x.difficulty==='hard').length, med=qs.filter(x=>x.difficulty==='medium').length, easy=qs.filter(x=>x.difficulty==='easy').length;
    body=`<div>
        <div class="qz-card qz-score">
          <div style="font-size:50px;margin-bottom:8px">${quizState.score===total?"🏆":ratio>=0.7?"🎯":"📊"}</div>
          <div style="font-size:20px;font-weight:800;color:var(--acc);margin-bottom:8px">Quiz Complete!</div>
          <div class="big">${quizState.score}<small>/${total}</small></div>
          <div style="font-size:13px;color:var(--mute);margin:4px 0 14px">${pctN}% accuracy</div>
          <div class="qz-bar" style="margin-bottom:14px"><i style="width:${pctN}%;background:${ratio>=0.7?"#06D6A0":ratio>=0.5?"#FFE66D":"#FF6B35"}"></i></div>
          <div class="qz-pills">
            <span class="qz-pill" style="color:#06D6A0;border-color:#06D6A055">✅ ${quizState.score} Correct</span>
            <span class="qz-pill" style="color:#FF6B35;border-color:#FF6B3555">❌ ${total-quizState.score} Wrong</span>
            ${easy?`<span class="qz-pill" style="color:#06D6A0;border-color:#06D6A033">🟢 ${easy} Easy</span>`:''}
            ${med?`<span class="qz-pill" style="color:#FFE66D;border-color:#FFE66D44">🟡 ${med} Med</span>`:''}
            ${hard?`<span class="qz-pill" style="color:#FF6B35;border-color:#FF6B3544">🔴 ${hard} Hard</span>`:''}
          </div>
          <div style="font-size:13.5px;color:var(--text-4,#888);margin-bottom:20px">${quizState.score===total?"Perfect score! You're exam-ready 🌟":quizState.score>=Math.ceil(total*0.7)?"Good job! Review the ones you missed 💪":quizState.score>=Math.ceil(total*0.5)?"Keep going — revise the concepts and retry 📚":"Focus on fundamentals and reattempt 🔁"}</div>
          <button class="qz-btn p" onclick="startQuiz(quizState.unitSel||null, quizState.countSel||15)" style="padding:12px 32px;font-size:14px">🔁 Try Again</button>
        </div>
        <div class="qz-sec"><h3>Question Review</h3><div class="qz-tabs">${tabs('doneFilter')}</div></div>
        ${qs.filter((qq,i)=>{
          const correct=(quizState.userAnswers||[])[i]===qq.answer;
          const f=quizState.doneFilter||'All';
          if(f==='Correct') return correct;
          if(f==='Wrong') return !correct;
          return true;
        }).map(qq=>{
          const ri=qs.indexOf(qq);
          const ua=(quizState.userAnswers||[])[ri];
          return reviewCard(qq,ri,ua,ua===qq.answer);
        }).join('')}
      </div>`;
  } else {
    const dc=q.difficulty?diffCol(q.difficulty):"";
    const ans=quizState.selected!==null;
    const right=quizState.selected===q.answer;
    body=`<div class="qz-card">
        <div class="qz-prog"><span>Question <b>${quizState.current+1}</b> / ${total}</span><span style="color:#06D6A0">Score: ${quizState.score}</span></div>
        <div class="qz-bar"><i style="width:${Math.round((quizState.current+(ans?1:0))/total*100)}%"></i></div>
        ${q.difficulty?`<div style="margin-bottom:12px"><span class="qz-diff" style="color:${dc};border-color:${dc}55;background:${dc}14">${diffLbl(q.difficulty)}</span></div>`:""}
        <div class="qz-q">${esc(q.q)}</div>
        <div class="qz-opts">
          ${q.options.map((opt,i)=>{
            let cls="";
            if(ans){ if(i===q.answer) cls="ok"; else if(i===quizState.selected) cls="bad"; }
            return `<button class="qz-opt ${cls}" onclick="selectAnswer(${i})" ${ans?"disabled":""}><span class="l">${String.fromCharCode(65+i)}</span><span>${esc(opt)}</span></button>`;
          }).join("")}
        </div>
        ${ans?`
          <div class="qz-fb" style="--c:${right?"#06D6A0":"#FF6B35"}">
            <b>${right?"✅ Correct!":"❌ Incorrect — Correct: "+String.fromCharCode(65+q.answer)+". "+esc(q.options[q.answer])}</b>
            ${q.explanation?`<p>💡 <b>Explanation:</b> ${esc(q.explanation)}</p>`:""}
          </div>
          <button class="qz-btn p" onclick="nextQuestion()" style="width:100%;padding:13px;font-size:14px">${quizState.current<total-1?"Next Question →":"See Results 🏆"}</button>`:""}
      </div>`;
  }

  // ── PRO: Quiz Logs ──
  let logsHtml="";
  if(CourseRuntime._proStatusCache && CourseRuntime.quizLog.length>0){
    const courseSubjectIds = new Set(getSubjects().map(s=>s.id));
    const filteredLog = CourseRuntime.quizLog.filter(e=>courseSubjectIds.has(e.subject));
    let inner="";
    if(filteredLog.length===0){
      if(CourseSelectorShared.activeCourse==='cbse11' && !CourseSelectorShared.cbse11Stream)
        inner='<div style="font-size:12.5px;color:var(--acc);padding:8px 0">Select your Class 11 stream first to see quiz logs.</div>';
      else if(CourseSelectorShared.activeCourse==='cbse12' && !CourseSelectorShared.cbse12Stream)
        inner='<div style="font-size:12.5px;color:var(--acc);padding:8px 0">Select your Class 12 stream first to see quiz logs.</div>';
      else inner='<div style="font-size:12.5px;color:var(--mute);font-style:italic;padding:8px 0">No quiz logs for this course yet.</div>';
    } else {
      const grouped={};
      filteredLog.forEach(e=>{
        const k=e.subjectName||e.subject||"Unknown";
        if(!grouped[k]) grouped[k]=[];
        grouped[k].push(e);
      });
      inner=Object.entries(grouped).map(([subj,entries])=>`
        <div class="qz-grp">${esc(subj)}</div>
        ${entries.map(entry=>{
          const pc=pcOf(entry.pct);
          const hasQ=(entry.questions||[]).length>0;
          const open=quizState.openReviewId===entry.id;
          return `<div class="qz-log">
            <div class="qz-log-r">
              <div class="qz-log-c" style="color:${pc};border-color:${pc}">${entry.pct}%</div>
              <div style="flex:1;min-width:0">
                <b>${esc(entry.chapter)}</b>
                <span class="s"><span style="color:#06D6A0;font-weight:700">${entry.score}</span>/${entry.total} · ${new Date(entry.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                <div class="qz-mini"><i style="width:${entry.pct}%;background:${pc}"></i></div>
              </div>
              ${hasQ?`<button class="qz-btn" style="padding:7px 12px;font-size:11.5px;color:var(--acc)" onclick="toggleQuizReview(${entry.id})">${open?'▲ Close':'Review →'}</button>`:''}
            </div>
            ${open?`
            <div style="margin-top:12px;border-top:1px solid var(--line);padding-top:12px">
              <div class="qz-tabs" style="margin-bottom:10px">${tabs('reviewFilter')}</div>
              ${(entry.questions||[]).filter(qq=>{
                const f=quizState.reviewFilter||'All';
                if(f==='Correct') return qq.correct;
                if(f==='Wrong') return !qq.correct;
                return true;
              }).map(qq=>reviewCard(qq,(entry.questions||[]).indexOf(qq),qq.userAnswer,qq.correct)).join('')}
            </div>`:''}
          </div>`;
        }).join('')}
      `).join('');
    }
    logsHtml=`<div style="margin-top:26px">
      <div class="qz-sec">
        <h3>📋 Quiz Logs</h3>
        <button class="qz-btn" style="padding:6px 12px;font-size:11.5px" onclick="if(confirm('Clear all quiz logs?')){quizLog=[];saveQuizLog();render();}">🗑️ Clear</button>
      </div>
      ${inner}
    </div>`;
  }

  return `${css}<div class="qz fade-in">
    <div class="qz-h1">🧠 AI Quiz</div>
    <div class="qz-h2">Test yourself chapter by chapter with AI-generated questions.</div>
    <div class="qz-setup">
      <div><label>SUBJECT</label><select onchange="quizState.subSel=this.value;quizState.unitSel='';render()"><option value="">— Select Subject —</option>${subOpts}</select></div>
      <div><label>CHAPTER</label><select onchange="quizState.unitSel=this.value"><option value="">All Chapters</option>${unitOpts}</select></div>
      <div><label>QUESTIONS</label><select onchange="quizState.countSel=this.value">${cntOpts}</select></div>
      <button class="qz-btn p" onclick="startQuiz(quizState.unitSel||null, quizState.countSel||15)" ${quizState.generating||!quizState.subSel?"disabled":""}>${quizState.generating?"⏳ Generating…":"✨ Start Quiz"}</button>
    </div>
    ${body}
    ${logsHtml}
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// ANALYTICS

export { FLASH_LOG_MAX, QUIZ_LOG_MAX, nextQuestion, quizState, renderQuiz, saveFlashLog, saveQuizLog, selectAnswer, startQuiz, toggleQuizReview };

if (typeof window !== "undefined") {
  Object.assign(window, { FLASH_LOG_MAX, QUIZ_LOG_MAX, nextQuestion, quizState, renderQuiz, saveFlashLog, saveQuizLog, selectAnswer, startQuiz, toggleQuizReview });
}

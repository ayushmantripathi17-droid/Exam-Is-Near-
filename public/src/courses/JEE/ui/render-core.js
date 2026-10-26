import { renderFiles } from "../features/files-materials.js";
import { renderAbout } from "./render-about.js";
import { renderPomodoro } from "../features/pomodoro-full.js";
import { renderFlashcards } from "../features/flashcards.js";
import { renderQuiz } from "../features/quiz.js";
import { renderAnalytics } from "../features/analytics.js";
import { renderAI } from "../features/ai-assistant-view.js";
import { renderFolderPicker, renderProfile, renderSectionModal, renderSubjectSectionTabs } from "../features/subjects-profile.js";
import { renderNeetJee, renderHubToolkit } from "../features/neetjee-hub-renderer.js";
import { AppStateShared, state } from "../../../core/app-state.js";
import { RINGTONES, selectedRingtone, updateTimerDisplay } from "../features/clock-alarms-timer.js";
import { loadAIChatHistory } from "../features/ai-assistant-setup.js";
import { updateDriveBadge, updateSyncBadge, updateUserBadge } from "../../../core/firebase-sync.js";
import { esc, today } from "../../../utils/helpers.js";
import { CBSE11_STREAMS, CBSE12_STREAMS, CourseSelectorShared, getSubjects } from "../../../core/course-selector.js";
import { _examDateToISO, getDaysLeft, getExamDate, getStreak, getSubjectPct, getTotalHours, getTotalPct } from "../features/exam-dates-actions.js";
import { MOODS, MOOD_LABELS } from "../../../shared/app-constants.js";

// ══════════════════════════════════════════════════════════════
// Debounce render: all rapid consecutive calls collapse into one DOM update.
// Prevents 5+ repaints on login (onAuthStateChanged + loadSharedFiles + loadAdminMaterials
// + loadAdminNotes + onSnapshot all used to call render() independently).
let _renderTimer=null;
let _renderResolvers=[];
function render(){
  return new Promise(res=>{
    _renderResolvers.push(res);
    if(_renderTimer) clearTimeout(_renderTimer);
    _renderTimer=setTimeout(async()=>{
      _renderTimer=null;
      const resolvers=[..._renderResolvers];
      _renderResolvers=[];
      await _doRender();
      resolvers.forEach(r=>r());
    }, 50);
  });
}
async function _doRender(){
  // Fade out splash screen smoothly
  const sl=document.getElementById('static-landing');
  // Minimum 1s splash display, then fade out over 0.5s
  if(sl){
    const _splashShown = window._splashStart || Date.now();
    const _elapsed = Date.now() - _splashShown;
    const _delay = Math.max(0, 2000 - _elapsed);
    setTimeout(()=>{ sl.classList.add('hidden'); setTimeout(()=>{ sl.style.display='none'; },500); }, _delay);
  }
  const c=document.getElementById("main-content");
  const views={dashboard:renderDashboard,subjects:renderSubjects,alarms:renderAlarms,files:renderFiles,sync:renderSync,log:renderLog,about:renderAbout,pomodoro:renderPomodoro,flashcards:renderFlashcards,quiz:renderQuiz,analytics:renderAnalytics,ai:renderAI,profile:renderProfile,neetjee:renderNeetJee};
  if(!c) return;
  const fn=views[state.view]||renderDashboard;
  try{
    const result = fn();
    // Handle async render functions (analytics, profile)
    c.innerHTML = (result instanceof Promise) ? await result : result;
  }catch(err){
    console.error("[render] Error in view '"+state.view+"':", err);
    c.innerHTML = `<div class="fade-in" style="text-align:center;padding:48px 20px">
      <div style="font-size:48px;margin-bottom:16px">⚠️</div>
      <div style="font-size:16px;font-weight:bold;color:#FF6B35;margin-bottom:8px">Something went wrong</div>
      <div style="font-size:12px;color:#555;margin-bottom:20px">${err.message||'Unknown error'}</div>
      <button class="btn-gold" onclick="switchView('dashboard')" style="padding:10px 24px">← Go to Dashboard</button>
    </div>`;
  }
  if(state.view==="alarms") updateTimerDisplay();
  if(state.view==="ai") loadAIChatHistory();
  updateSyncBadge();
  updateDriveBadge();
  updateUserBadge();
}

// ── RENDER SYNC ───────────────────────────────────────────────
function renderSync(){
  const statusMap={
    offline:{icon:"🔴",text:"Not signed in",color:"#888",desc:"Sign in with Google to sync your data across all devices."},
    connecting:{icon:"🟡",text:"Connecting…",color:"#FFE66D",desc:"Establishing secure connection…"},
    synced:{icon:"🟢",text:"Synced",color:"#06D6A0",desc:"Your data is syncing in real-time across all devices!"},
    error:{icon:"🔴",text:"Connection error",color:"#FF6B35",desc:"Sync error — likely a Firestore rules issue. See help below."},
  };
  const s=statusMap[AppStateShared.syncStatus]||statusMap.offline;

  const userCard=AppStateShared.currentUser?`
    <div class="sy-card sy-user">
      <img src="${AppStateShared.currentUser.photoURL||''}" onerror="this.style.display='none'" class="sy-av"/>
      <div style="flex:1;min-width:0">
        <b>${esc(AppStateShared.currentUser.displayName||"User")}</b>
        <span>UID: ${AppStateShared.syncUserId?.slice(0,16)||"—"}…</span>
      </div>
      <button class="sy-btn d" onclick="googleSignOut()">Sign Out</button>
    </div>`:`
    <div class="sy-card" style="text-align:center;padding:32px 20px">
      <div style="font-size:46px;margin-bottom:12px">🔐</div>
      <div style="font-size:17px;font-weight:800;color:var(--txt);margin-bottom:8px">Sign in to sync your data</div>
      <div style="font-size:12.5px;color:var(--mute);margin-bottom:22px;line-height:1.7">Use the same Google account on any device.<br>Your progress will appear instantly everywhere.</div>
      <button class="sy-g" onclick="googleSignIn()"><span>G</span> Sign in with Google</button>
      <div style="font-size:11px;color:var(--mute);margin-top:16px">Free · Secure · Works on mobile + PC</div>
    </div>`;

  const css=`<style>
.sy{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:760px;margin:0 auto}
.sy *{box-sizing:border-box}
.sy-h1{font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--txt);line-height:1.1}
.sy-h2{font-size:13px;color:var(--mute);margin:6px 0 18px}
.sy-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:20px;padding:20px;margin-bottom:14px}
.sy-lbl{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--mute);margin-bottom:12px}
.sy-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--line);background:var(--surf);color:var(--text-2,#ccc);padding:10px 16px;border-radius:12px;font-weight:700;font-size:12.5px;font-family:inherit;cursor:pointer;transition:.2s;white-space:nowrap}
.sy-btn:hover{border-color:var(--acc);transform:translateY(-1px)}
.sy-btn.p{background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-color:transparent;box-shadow:0 6px 18px -6px #FFB70088}
.sy-btn.d{color:#FF6B35;border-color:#FF6B3544}
.sy-btn.d:hover{background:#FF6B3514;border-color:#FF6B35}
.sy-status{text-align:center;background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--c) 18%,transparent),transparent 65%),var(--glass-bg,var(--surf));border-color:color-mix(in srgb,var(--c) 30%,var(--line))}
.sy-status .ic{font-size:38px;margin-bottom:8px}
.sy-status b{display:block;font-size:18px;font-weight:800;color:var(--c);margin-bottom:4px}
.sy-status p{margin:0;font-size:12.5px;color:var(--mute)}
.sy-row{display:flex;gap:8px;justify-content:center;margin-top:14px;flex-wrap:wrap}
.sy-user{display:flex;align-items:center;gap:14px}
.sy-av{width:54px;height:54px;border-radius:50%;border:3px solid #06D6A0;flex-shrink:0;object-fit:cover}
.sy-user b{display:block;font-size:15px;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sy-user span{font-size:10.5px;color:var(--mute)}
.sy-g{border:none;background:linear-gradient(135deg,#4285F4,#34A853);color:#fff;padding:14px 28px;border-radius:14px;font-family:inherit;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 8px 24px -8px #4285F4aa;transition:.2s}
.sy-g:hover{transform:translateY(-2px)}
.sy-g span{margin-right:8px;background:#fff;color:#4285F4;width:22px;height:22px;border-radius:50%;display:inline-grid;place-items:center;font-size:13px}
.sy-ch{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.sy-ci{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;font-size:22px;background:color-mix(in srgb,#4ECDC4 16%,transparent);flex-shrink:0}
.sy-ch b{display:block;font-size:14.5px;color:var(--txt)}
.sy-ch span{font-size:11.5px;color:var(--mute)}
.sy-p{font-size:12.5px;color:var(--mute);line-height:1.75;margin:0 0 14px}
.sy-f{display:grid;gap:8px}
.sy-f2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
@media(max-width:520px){.sy-f2{grid-template-columns:1fr}}
.sy-f input,.sy-f select{margin:0;width:100%;border-radius:12px;padding:11px 13px;font-size:12.5px}
.sy-f3{display:flex;gap:8px}
.sy-list{font-size:13px;color:var(--text-3,#aaa);line-height:2.1}
.sy-err{border-color:#FF6B3544}
.sy-err h4{margin:0 0 10px;font-size:13.5px;color:#FF6B35}
.sy-box{background:color-mix(in srgb,var(--txt) 5%,transparent);border-radius:12px;padding:12px;margin:10px 0;font-size:12px;color:var(--text-4,#888);line-height:2}
.sy-box a{color:#4ECDC4}
.sy-box pre{background:color-mix(in srgb,var(--txt) 7%,transparent);padding:10px;border-radius:9px;margin-top:6px;color:#06D6A0;font-size:10.5px;white-space:pre-wrap}
.sy-ver{display:flex;align-items:center;gap:12px;margin-top:14px;padding-top:14px;border-top:1px solid var(--line)}
</style>`;

  return`${css}<div class="sy fade-in">
    <div class="sy-h1">🔄 Sync &amp; Account</div>
    <div class="sy-h2">Sign in with Google to sync across phone and PC.</div>

    <div class="sy-card sy-status" style="--c:${s.color}">
      <div class="ic">${s.icon}</div>
      <b>${s.text}</b>
      <p>${s.desc}</p>
      <div class="sy-row">
        <button class="sy-btn p" onclick="pushToFirebase().then(()=>showToast('✅ Data synced to cloud!','success')).catch(e=>showToast('⚠️ Sync failed: '+e.message,'alarm'))">⬆ Sync Now</button>
        ${AppStateShared.currentUser?`<button class="sy-btn" onclick="subscribeToFirestore().then(()=>showToast('✅ Pulled latest data!','success'))">⬇ Pull Latest</button>`:''}
      </div>
    </div>

    ${userCard}

    <div class="sy-card">
      <div class="sy-ch"><div class="sy-ci">📎</div><div><b>Import from Google Drive</b><span>Paste a Drive share link to add it to your Files</span></div></div>
      <p class="sy-p">Share a file from Google Drive → copy the link → paste it here. It will appear in your Files tab under the subject you choose.</p>
      <div class="sy-f">
        <div class="sy-f2">
          <input id="sync-drive-name" placeholder="File name (e.g. C++ Notes.pdf)"/>
          <select id="sync-drive-sub">${getSubjects().map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join("")}</select>
        </div>
        <div class="sy-f3">
          <input id="sync-drive-url" placeholder="https://drive.google.com/file/d/..." style="flex:1"/>
          <button class="sy-btn p" onclick="addDriveLinkFromSync()">+ Add</button>
        </div>
      </div>
    </div>

    ${AppStateShared.syncStatus==="error"?`
    <div class="sy-card sy-err">
      <h4>🔧 How to Fix Sync Error</h4>
      <div style="font-size:12px;color:var(--text-4,#888);line-height:1.9">This is usually caused by <b style="color:var(--txt)">Firestore Security Rules</b> blocking your account. Fix it in <b>2 minutes:</b></div>
      <div class="sy-box">
        1. Open <a href="https://console.firebase.google.com/project/exam-is-near/firestore/rules" target="_blank">Firebase Console → Firestore → Rules</a><br>
        2. Replace the rules with:<br>
        <pre>rules_version = '2';
service cloud.firestore {
  match /databases/\${database}/documents {
    match /study_tracker/\${userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /shared-files/\${docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /user-files/\${userId}/files/\${fileId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/\${userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /coupons/\${couponId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    match /study-materials/\${docId} {
      allow read: if true;
      allow write: if false;
    }
    match /subscriptions/\${userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;
    }
  }
}</pre>
        3. Click <b style="color:var(--acc)">Publish</b> and refresh this page
      </div>
      <button class="sy-btn" onclick="subscribeToFirestore().then(()=>showToast('Retrying sync…','info'))">🔄 Retry Now</button>
      <button class="sy-btn d" onclick="googleSignOut().then(()=>setTimeout(googleSignIn,800))" style="margin-left:6px">↺ Sign out &amp; back in</button>
    </div>`:""}

    <div class="sy-card">
      <div class="sy-lbl">HOW IT WORKS</div>
      <div class="sy-list">
        🔐 Sign in with Google once on each device<br>
        📱 Study on phone → data saves to your account<br>
        💻 Open on laptop → same data appears instantly<br>
        🔄 Real-time sync — no manual export needed<br>
        🆓 Completely free with Firebase
      </div>
    </div>

    <div class="sy-card">
      <div class="sy-ch"><div class="sy-ci">🔗</div><div><b>Share Link Sync</b><span>Share your progress via a link — no account needed</span></div></div>
      <p class="sy-p">Generate a share link → send to anyone → they open it and import your data. Great for syncing between devices without Google, or sharing with classmates.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px">
        <button class="sy-btn p" onclick="generateShareLink()">🔗 Generate Share Link</button>
        <button class="sy-btn" onclick="document.getElementById('import-link-input').style.display='flex'">📥 Paste a Link</button>
      </div>
      <div id="import-link-input" style="display:none;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        <input id="share-link-paste" placeholder="Paste share link or ?import=... here" style="flex:1;font-size:12.5px;margin:0;border-radius:12px"/>
        <button class="sy-btn p" onclick="handlePastedShareLink()">Import</button>
      </div>
      <textarea id="share-link-display" style="display:none;font-size:10.5px;color:#4ECDC4;border:1px solid #4ECDC444;border-radius:12px;padding:10px;width:100%;height:72px;resize:none;margin-top:4px" placeholder="Share link will appear here..." readonly onclick="this.select()"></textarea>
    </div>

    <div class="sy-card">
      <div class="sy-lbl">📦 VERSION INFO</div>
      <div class="sy-list">
        <b style="color:var(--acc)">Exam Is Near</b> · Study Smart v15 · by ArkSetu<br>
        ✅ IndexedDB file storage<br>
        ✅ 15 alarm ringtones · 50 preset alarms<br>
        ✅ Pomodoro, Flashcards, Quiz, Analytics<br>
        ✅ AI Study Assistant (Gemini)<br>
        ✅ Link-based data sharing<br>
        ✅ Google Firebase real-time sync<br>
        ✅ Google Drive link import<br>
        ✅ Browser push notifications
      </div>
      <div class="sy-ver">
        <div style="font-size:30px">👨‍💻</div>
        <div>
          <div style="font-size:13.5px;font-weight:800;color:var(--acc)">Ayushman Tripathi</div>
          <div style="font-size:11.5px;color:var(--mute)">Developer · B.Sc. LL.B. · Exam Is Near by ArkSetu</div>
        </div>
      </div>
    </div>
  </div>`;
}

// ── DASHBOARD ────────────────────────────────────────────────
function renderDashboard(){
  const pct=getTotalPct();
  const circ=2*Math.PI*54;
  const offset=circ*(1-pct/100);
  const subs=getSubjects();
  const dl=(id)=>getDaysLeft(getExamDate(id));
  const nextExam=subs.filter(s=>dl(s.id)!==null&&dl(s.id)>=0).slice().sort((a,b)=>dl(a.id)-dl(b.id))[0]||null;
  const activeAlarms=state.alarms.filter(a=>a.enabled).length;
  const streak=getStreak();
  const dailyGoal=parseFloat(localStorage.getItem('st_dailyGoal')||'6');
  const todayHours=state.hoursToday||0;
  const goalPct=Math.min(100,Math.round((todayHours/dailyGoal)*100));

  const subCards=subs.map((s,i)=>{
    const examD=getExamDate(s.id);
    const p=getSubjectPct(s.id),days=dl(s.id);
    const mc=state.materials.filter(m=>m.subjectId===s.id).length;
    const urgent=days!==null&&days<=2, soon=days!==null&&days<=5;
    const dCol=urgent?"#ff5c5c":soon?"#FF6B35":"var(--text-5,#777)";
    const dText=days===null?"":days<=0?"Today!":days===1?"Tomorrow":days+"d left";
    return `<div class="ov-sub" style="--c:${s.color};animation-delay:${Math.min(i,12)*0.04}s" onclick="setActiveSubject('${s.id}');switchView('subjects')">
      <div class="ov-sub-top">
        <div class="ov-sub-ic">${s.icon}</div>
        <div class="ov-sub-nm">
          <b>${esc(s.name)}</b>
          <span>${mc} material${mc!==1?"s":""} · ${esc(s.code)}</span>
        </div>
        <div class="ov-sub-pct">${p}<small>%</small></div>
      </div>
      <div class="ov-bar"><i style="width:${Math.max(p,2)}%"></i></div>
      <div class="ov-sub-ft">
        <span>${esc(examD||"No exam date")}</span>
        ${dText?`<em style="color:${dCol};border-color:${dCol}">${dText}</em>`:""}
      </div>
    </div>`;
  }).join("");

  const streakBar=Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-6+i);
    const k=d.toISOString().split('T')[0];
    const has=state.studyLog[k]?.hours>0;
    const isToday=k===today();
    return `<div class="ov-day" title="${k}">
      <div class="ov-day-b ${has?"on":""} ${isToday?"now":""}"></div>
      <span class="${isToday?"now":""}">${d.toLocaleDateString('en',{weekday:'narrow'})}</span>
    </div>`;
  }).join('');

  const nd=nextExam?dl(nextExam.id):null;
  const nextCard=nextExam?`
    <div class="ov-next" style="--c:${nextExam.color}">
      <div class="ov-lbl">NEXT EXAM</div>
      <div class="ov-next-n"><b>${nd!==null?nd:"–"}</b><span>${nd===1?"day":"days"}</span></div>
      <div class="ov-next-s"><span class="float-anim" style="display:inline-block">${nextExam.icon}</span> ${esc(nextExam.name)}</div>
      <div class="ov-next-d">${esc(getExamDate(nextExam.id))}</div>
    </div>`:"";

  const css=`<style>
.ov{--r:18px;--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:1000px;margin:0 auto}
.ov *{box-sizing:border-box}
.ov-head{margin-bottom:18px}
.ov-h1{font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--txt);line-height:1.1}
.ov-h2{font-size:13px;color:var(--mute);margin-top:6px}
.ov-lbl{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--mute)}
.ov-top{display:grid;grid-template-columns:1fr;gap:14px;margin-bottom:14px}
.ov-top.has-next{grid-template-columns:1.6fr 1fr}
@media(max-width:720px){.ov-top.has-next{grid-template-columns:1fr}}
.ov-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:var(--r);padding:20px;position:relative;overflow:hidden}
.ov-hero{display:flex;gap:22px;align-items:center;flex-wrap:wrap;background:radial-gradient(circle at 0% 0%,color-mix(in srgb,var(--acc) 12%,transparent),transparent 55%),var(--glass-bg,var(--surf))}
.ov-ring{position:relative;width:130px;height:130px;flex-shrink:0}
.ov-ring svg{transform:rotate(-90deg);display:block}
.ov-ring-t{position:absolute;inset:0;display:grid;place-content:center;text-align:center}
.ov-ring-t b{font-size:28px;font-weight:800;color:var(--acc);letter-spacing:-1px;line-height:1}
.ov-ring-t span{font-size:9px;color:var(--mute);letter-spacing:1.5px;margin-top:4px}
.ov-hero-r{flex:1;min-width:200px}
.ov-hero-t{font-size:19px;font-weight:800;color:var(--txt)}
.ov-hero-s{font-size:12.5px;color:var(--mute);margin:5px 0 14px;line-height:1.5}
.ov-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ov-stat{background:color-mix(in srgb,var(--txt) 4%,transparent);border:1px solid var(--line);border-radius:14px;padding:11px 12px}
.ov-stat b{display:block;font-size:19px;font-weight:800;color:var(--txt);letter-spacing:-.5px}
.ov-stat span{font-size:10px;color:var(--mute);letter-spacing:.5px}
.ov-next{--c:#FF6B35;background:radial-gradient(circle at 100% 0%,color-mix(in srgb,var(--c) 22%,transparent),transparent 65%),var(--glass-bg,var(--surf));border:1px solid color-mix(in srgb,var(--c) 40%,var(--line));border-radius:var(--r);padding:20px;display:flex;flex-direction:column;justify-content:center;gap:4px}
.ov-next-n{display:flex;align-items:baseline;gap:8px;margin-top:4px}
.ov-next-n b{font-size:56px;font-weight:800;line-height:1;letter-spacing:-3px;color:var(--c)}
.ov-next-n span{font-size:14px;color:var(--mute);font-weight:600}
.ov-next-s{font-size:15px;font-weight:700;color:var(--txt);margin-top:6px}
.ov-next-d{font-size:12px;color:var(--mute)}
.ov-goal{margin-bottom:22px}
.ov-goal-h{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:16px}
.ov-goal-t{font-size:15px;font-weight:800;color:var(--txt);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ov-badge{font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;border:1px solid}
.ov-goal-s{font-size:11.5px;color:var(--mute);margin-top:3px}
.ov-goal-n{text-align:right}
.ov-goal-n b{font-size:20px;font-weight:800;letter-spacing:-.5px}
.ov-goal-n span{display:block;font-size:10px;color:var(--mute);letter-spacing:.5px}
.ov-days{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:16px}
.ov-day{text-align:center}
.ov-day-b{height:36px;border-radius:10px;background:color-mix(in srgb,var(--txt) 6%,transparent);border:1px solid transparent;transition:.3s}
.ov-day-b.on{background:linear-gradient(160deg,#FFE66D,#ffb700);box-shadow:0 6px 14px -6px #FFB700aa}
.ov-day-b.now{border-color:var(--acc)}
.ov-day span{display:block;font-size:10px;color:var(--mute);margin-top:6px;font-weight:600}
.ov-day span.now{color:var(--acc)}
.ov-gbar{height:7px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);overflow:hidden}
.ov-gbar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#06D6A0,#FFE66D);transition:width .8s cubic-bezier(.4,0,.2,1)}
.ov-goal-f{display:flex;justify-content:space-between;align-items:center;margin-top:9px;font-size:11.5px;color:var(--mute)}
.ov-edit{background:none;border:1px solid var(--line);color:var(--mute);border-radius:10px;padding:6px 11px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;transition:.2s}
.ov-edit:hover{color:var(--acc);border-color:var(--acc)}
.ov-sec{display:flex;align-items:center;justify-content:space-between;margin:0 0 12px}
.ov-sec h3{margin:0;font-size:16px;font-weight:800;color:var(--txt);letter-spacing:-.3px}
.ov-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px}
.ov-sub{--c:#7C6CF0;background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:var(--r);padding:16px;cursor:pointer;transition:transform .2s,border-color .2s,box-shadow .2s;animation:ovIn .35s ease both}
.ov-sub:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--c) 60%,var(--line));box-shadow:0 14px 30px -14px color-mix(in srgb,var(--c) 60%,transparent)}
@keyframes ovIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.ov-sub-top{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.ov-sub-ic{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-size:21px;background:color-mix(in srgb,var(--c) 16%,transparent);flex-shrink:0}
.ov-sub-nm{flex:1;min-width:0}
.ov-sub-nm b{display:block;font-size:14px;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ov-sub-nm span{font-size:11px;color:var(--mute)}
.ov-sub-pct{font-size:26px;font-weight:800;color:var(--c);letter-spacing:-1px}
.ov-sub-pct small{font-size:13px;margin-left:1px}
.ov-bar{height:6px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);overflow:hidden}
.ov-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,color-mix(in srgb,var(--c) 60%,transparent),var(--c));transition:width .8s ease}
.ov-sub-ft{display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:11px;color:var(--mute)}
.ov-sub-ft em{font-style:normal;font-weight:700;font-size:10.5px;padding:2px 9px;border-radius:99px;border:1px solid}
</style>`;

  return `${css}<div class="ov fade-in">
    <div class="ov-head">
      <div class="ov-h1">Overview</div>
      <div class="ov-h2">Your progress, streak and upcoming exams at a glance.</div>
    </div>

    <div class="ov-top ${nextExam?"has-next":""}">
      <div class="ov-card ov-hero">
        <div class="ov-ring">
          <svg width="130" height="130">
            <circle cx="65" cy="65" r="54" fill="none" stroke="currentColor" style="color:color-mix(in srgb,var(--txt) 9%,transparent)" stroke-width="10"/>
            <circle cx="65" cy="65" r="54" fill="none" stroke="url(#ovGrad)" stroke-width="10"
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round" style="transition:stroke-dashoffset 1s ease"/>
            <defs><linearGradient id="ovGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#FFE66D"/><stop offset="100%" stop-color="#FF6B35"/></linearGradient></defs>
          </svg>
          <div class="ov-ring-t"><b>${pct}%</b><span>COMPLETE</span></div>
        </div>
        <div class="ov-hero-r">
          <div class="ov-hero-t">Keep grinding! 💪</div>
          <div class="ov-hero-s">${nextExam?"Next: "+esc(nextExam.name)+(nd!==null?" in "+nd+"d":""):"No exams set"} · ${activeAlarms} active alarm${activeAlarms!==1?"s":""}</div>
          <div class="ov-stats">
            ${[["⏱️",getTotalHours()+"h","Logged"],["🔥",streak+"d","Streak"],["📁",state.files.length,"Files"]].map(([ic,v,l])=>`<div class="ov-stat"><b>${ic} ${v}</b><span>${l}</span></div>`).join("")}
          </div>
        </div>
      </div>
      ${nextCard}
    </div>

    <div class="ov-card ov-goal">
      <div class="ov-goal-h">
        <div>
          <div class="ov-goal-t">🔥 ${streak}-Day Streak
            ${streak>=7?'<span class="ov-badge" style="color:#FFE66D;border-color:#FFE66D44;background:#FFE66D14">🏆 Week!</span>':''}
            ${streak>=30?'<span class="ov-badge" style="color:#C77DFF;border-color:#C77DFF44;background:#C77DFF14">🌟 Month!</span>':''}
          </div>
          <div class="ov-goal-s">Study every day to keep your streak alive</div>
        </div>
        <div class="ov-goal-n">
          <b style="color:${goalPct>=100?'#06D6A0':'var(--gold,#FFE66D)'}">${todayHours}h <span style="display:inline;font-size:14px;color:var(--text-5,#777);font-weight:600">/ ${dailyGoal}h</span></b>
          <span>TODAY'S GOAL</span>
        </div>
      </div>
      <div class="ov-days">${streakBar}</div>
      <div class="ov-gbar"><i style="width:${goalPct}%"></i></div>
      <div class="ov-goal-f">
        <span>${goalPct>=100?'✅ Goal reached!':'Keep going…'}</span>
        <button class="ov-edit" onclick="(function(){const g=prompt('Set daily study goal (hours):','${dailyGoal}');if(g&&!isNaN(g)&&parseFloat(g)>0){localStorage.setItem('st_dailyGoal',parseFloat(g));render();}})()">✏️ Edit goal</button>
      </div>
    </div>

    ${renderHubToolkit()}
    <div class="ov-sec"><h3>Subject Progress</h3></div>
    <div class="ov-grid">${subCards}</div>
  </div>`;
}

// ── SUBJECTS VIEW ─────────────────────────────────────────────────
function renderSubjects(){
  const _subs=getSubjects();
  let sub=_subs.find(s=>s.id===state.activeSubject);
  // Guard: if activeSubject doesn't exist in current course, fall back to first
  if(!sub){ sub=_subs[0]; if(sub) state.activeSubject=sub.id; }
  if(!sub){
    if(CourseSelectorShared.activeCourse === 'cbse11' && !CourseSelectorShared.cbse11Stream){
      return `<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📗</div><div style="margin-bottom:8px">Select your Class 11 stream to load subjects.</div><button class="btn-gold" onclick="showCourseSelector('cbse_group','cbse11_group')" style="margin-top:16px;padding:10px 24px">🔬 Choose Stream</button></div>`;
    }
    if(CourseSelectorShared.activeCourse === 'cbse12' && !CourseSelectorShared.cbse12Stream){
      return `<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">🎓</div><div style="margin-bottom:8px">Select your Class 12 stream to load subjects.</div><button class="btn-gold" onclick="showCourseSelector('cbse_group','cbse12_group')" style="margin-top:16px;padding:10px 24px">🔬 Choose Stream</button></div>`;
    }
    return `<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📚</div><div>No subjects found. Please select a course.</div><button class="btn-gold" onclick="showCourseSelector()" style="margin-top:16px;padding:10px 24px">🎯 Select Course</button></div>`;
  }
  const pct=getSubjectPct(sub.id);

  const subBtns=getSubjects().map(s=>`<button class="st-chip ${s.id===state.activeSubject?"on":""}" style="--c:${s.color}" onclick="setActiveSubject('${s.id}')"><span class="st-chip-ic">${s.icon}</span> ${esc(s.name)}</button>`).join("");

  const _dlv=getDaysLeft(getExamDate(sub.id));
  const _dlCol=_dlv===null?"":_dlv<=3?"#FF6B35":_dlv<=7?"#FFE66D":"#06D6A0";
  const unitCards=sub.units.map((unit,ui)=>{
    const done=unit.topics.filter((_,i)=>state.progress[`${sub.id}-${unit.id}-${i}`]).length;
    const total=unit.topics.length;
    const up=total?Math.round(done/total*100):0;
    const topics=unit.topics.map((topic,idx)=>{
      const k=`${sub.id}-${unit.id}-${idx}`;
      const isDone=!!state.progress[k];
      return `<div class="st-topic ${isDone?"done":""}" onclick="toggleTopic('${sub.id}','${unit.id}',${idx})">
        <span class="st-cb">${isDone?"✓":""}</span>
        <span class="st-tn">${esc(topic)}</span>
      </div>`;
    }).join("");
    return `<div class="st-unit" style="animation-delay:${Math.min(ui,10)*0.05}s">
      <div class="st-unit-h">
        <div class="st-unit-n">${esc(unit.name)}</div>
        <div class="st-unit-c">${done===total&&total?`<span class="float-anim" style="display:inline-block">🏆</span> `:""}${done}/${total}</div>
      </div>
      <div class="st-ubar"><i style="width:${up}%"></i></div>
      <div class="st-topics">${topics}</div>
    </div>`;
  }).join("");

  const stCss=`<style>
.st{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:880px;margin:0 auto}
.st *{box-sizing:border-box}
.st-chips{display:flex;flex-wrap:wrap;gap:8px}
.st-chip{--c:#7C6CF0;display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);background:var(--surf);color:var(--mute);padding:9px 14px;border-radius:99px;font-weight:600;font-size:12.5px;font-family:inherit;cursor:pointer;transition:.2s;white-space:nowrap}
.st-chip:hover{color:var(--txt);border-color:var(--c)}
.st-chip.on{background:color-mix(in srgb,var(--c) 18%,var(--surf));color:var(--c);border-color:var(--c);box-shadow:0 6px 18px -8px var(--c)}
.st-head{position:relative;background:radial-gradient(circle at 100% 0%,color-mix(in srgb,var(--c) 22%,transparent),transparent 60%),var(--glass-bg,var(--surf));border:1px solid color-mix(in srgb,var(--c) 35%,var(--line));border-radius:20px;padding:20px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap}
.st-head-l{display:flex;align-items:center;gap:14px;min-width:0}
.st-head-ic{width:54px;height:54px;border-radius:16px;display:grid;place-items:center;font-size:28px;background:color-mix(in srgb,var(--c) 18%,transparent);flex-shrink:0}
.st-head-n{font-size:22px;font-weight:800;letter-spacing:-.4px;color:var(--txt);line-height:1.15}
.st-head-e{font-size:11.5px;color:var(--mute);margin-top:6px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.st-head-e input{background:var(--surface-3,#1a1a24);border:1px solid var(--line);border-radius:8px;padding:4px 8px;font-size:11.5px;color:var(--c);font-family:inherit;width:auto}
.st-head-e b{font-weight:700}
.st-head-r{display:flex;align-items:center;gap:14px}
.st-head-p{font-size:40px;font-weight:800;letter-spacing:-2px;color:var(--c);line-height:1}
.st-head-p small{font-size:18px;margin-left:1px}
.st-add{background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border:none;border-radius:11px;padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 6px 16px -6px #FFB70088;transition:.2s}
.st-add:hover{transform:translateY(-1px)}
.st-bar{width:100%;height:7px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);overflow:hidden}
.st-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,color-mix(in srgb,var(--c) 55%,transparent),var(--c));transition:width .8s ease}
.st-unit{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:18px;padding:16px;margin-bottom:12px;animation:stIn .35s ease both}
@keyframes stIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.st-unit-h{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}
.st-unit-n{font-weight:700;font-size:14.5px;color:var(--txt)}
.st-unit-c{font-size:12px;font-weight:700;color:var(--c);background:color-mix(in srgb,var(--c) 14%,transparent);padding:3px 10px;border-radius:99px;white-space:nowrap}
.st-ubar{height:4px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);overflow:hidden;margin-bottom:10px}
.st-ubar i{display:block;height:100%;background:var(--c);border-radius:99px;transition:width .5s ease}
.st-topics{display:grid;gap:2px}
.st-topic{display:flex;align-items:center;gap:11px;padding:9px 10px;border-radius:11px;cursor:pointer;transition:background .15s}
.st-topic:hover{background:color-mix(in srgb,var(--c) 9%,transparent)}
.st-cb{width:20px;height:20px;border-radius:7px;border:1.5px solid var(--border-3,#444);display:grid;place-items:center;font-size:12px;font-weight:800;color:#12100a;flex-shrink:0;transition:.2s}
.st-topic.done .st-cb{background:var(--c);border-color:var(--c)}
.st-tn{font-size:13.5px;color:var(--text-2,#ccc);line-height:1.4;transition:.2s}
.st-topic.done .st-tn{color:var(--text-6,#666);text-decoration:line-through}
.st .card{border-radius:18px}
.st textarea{border-radius:12px}
@media(max-width:520px){.st-head-p{font-size:32px}.st-head-n{font-size:19px}}
</style>`;

  // ── FORMULAS PANEL (JEE) ──
  let formulasPanel = "";
  if(sub.formulas){
    const fTopics = Object.keys(sub.formulas);
    const selF = state["formulaTab_"+sub.id] || fTopics[0];
    const fList = (sub.formulas[selF]||[]).map(f=>`
      <div style="display:flex;align-items:flex-start;gap:8px;padding:7px 10px;background:#0a0a14;border:1px solid #1e1e2e;border-radius:8px;margin-bottom:6px">
        <span style="color:${sub.color};font-size:14px;flex-shrink:0;margin-top:1px">∫</span>
        <span style="font-size:12px;color:#d4c8a8;font-family:monospace;line-height:1.6">${esc(f)}</span>
      </div>`).join("");
    const fTabs = fTopics.map(t=>`<button onclick="state['formulaTab_${sub.id}']='${esc(t)}';render()" style="background:${t===selF?sub.color:"#0a0a14"};color:${t===selF?"#08080f":"#666"};border:1px solid ${t===selF?sub.color:"#1e1e2e"};border-radius:20px;padding:5px 11px;font-size:10px;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all 0.2s">${esc(t)}</button>`).join("");
    formulasPanel = `<div class="card" style="margin-top:14px;border-color:${sub.color}33">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">🧮</span>
        <div style="font-size:14px;font-weight:bold;color:${sub.color}">Key Formulas</div>
        <span style="font-size:10px;color:#444;background:#1a1a2a;padding:2px 8px;border-radius:10px">JEE Quick Reference</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${fTabs}</div>
      ${fList}
    </div>`;
  }

  // ── NCERT IMPORTANT LINES PANEL (NEET) ──
  let ncertPanel = "";
  if(sub.ncert){
    const nTopics = Object.keys(sub.ncert);
    const selN = state["ncertTab_"+sub.id] || nTopics[0];
    const nList = (sub.ncert[selN]||[]).map(line=>`
      <div style="display:flex;align-items:flex-start;gap:8px;padding:8px 10px;background:#0a0a14;border-left:2px solid ${sub.color};border-radius:0 8px 8px 0;margin-bottom:6px">
        <span style="color:${sub.color};font-size:13px;flex-shrink:0;margin-top:2px">📌</span>
        <span style="font-size:12px;color:#d4c8a8;line-height:1.65">${esc(line)}</span>
      </div>`).join("");
    const nTabs = nTopics.map(t=>`<button onclick="state['ncertTab_${sub.id}']='${esc(t)}';render()" style="background:${t===selN?sub.color:"#0a0a14"};color:${t===selN?"#08080f":"#666"};border:1px solid ${t===selN?sub.color:"#1e1e2e"};border-radius:20px;padding:5px 11px;font-size:10px;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all 0.2s">${esc(t)}</button>`).join("");
    ncertPanel = `<div class="card" style="margin-top:14px;border-color:${sub.color}33">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">📖</span>
        <div style="font-size:14px;font-weight:bold;color:${sub.color}">NCERT Important Lines</div>
        <span style="font-size:10px;color:#444;background:#1a1a2a;padding:2px 8px;border-radius:10px">High-Yield for NEET</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${nTabs}</div>
      ${nList}
    </div>`;
  }

  return `${stCss}<div class="st fade-in" style="--c:${sub.color}">
    <div class="flex-wrap st-chips" style="margin-bottom:16px">${subBtns}${CourseSelectorShared.activeCourse==='cbse11'?`<button onclick="showCourseSelector('cbse_group','cbse11_group')" style="background:#FFE66D22;border:1px solid #FFE66D44;color:#FFE66D;border-radius:20px;padding:6px 13px;font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s" title="Change stream">🔄 ${CBSE11_STREAMS[CourseSelectorShared.cbse11Stream]?.label?.split('—')[0]?.trim()||'Change Stream'}</button>`:''}${CourseSelectorShared.activeCourse==='cbse12'?`<button onclick="showCourseSelector('cbse_group','cbse12_group')" style="background:#FFE66D22;border:1px solid #FFE66D44;color:#FFE66D;border-radius:20px;padding:6px 13px;font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s" title="Change stream">🔄 ${CBSE12_STREAMS[CourseSelectorShared.cbse12Stream]?.label?.split('—')[0]?.trim()||'Change Stream'}</button>`:''}</div>
    <div class="st-head" style="--c:${sub.color}">
      <div class="st-head-l">
        <div class="st-head-ic">${sub.icon}</div>
        <div>
          <div class="st-head-n">${esc(sub.name)}</div>
          <div class="st-head-e">
            Exam
            <input type="date" value="${_examDateToISO(getExamDate(sub.id))}" onchange="setExamDate('${sub.id}', _isoToExamDate(this.value))" title="Set your exam date"/>
            ${_dlv!==null?`<b style="color:${_dlCol}">${_dlv} days left</b>`:''}
          </div>
        </div>
      </div>
      <div class="st-head-r">
        <div class="st-head-p">${pct}<small>%</small></div>
        <button class="st-add" onclick="state.newMat.subjectId='${sub.id}';switchView('files');setTimeout(()=>showAddForm(),50)">+ Add Note</button>
      </div>
      <div class="st-bar"><i style="width:${pct}%"></i></div>
    </div>
    ${unitCards}
    ${formulasPanel}
    ${ncertPanel}
    <div class="card" style="margin-top:8px">
      <div class="section-label">📝 Quick Notes — ${esc(sub.name)}</div>
      <textarea rows="4" placeholder="Doubts, key points, formulas to remember..." oninput="saveSubjectNote('${sub.id}',this.value)">${esc(state.subjectNotes[sub.id]||"")}</textarea>
    </div>
    <div class="card" style="margin-top:12px">
      <div style="font-size:14px;font-weight:bold;margin-bottom:4px">📂 Subject Resources</div>
      <div style="font-size:11px;color:#555;margin-bottom:16px">Question Papers · Notes · Study Materials · YouTube Playlists</div>
      ${renderSubjectSectionTabs(sub)}
    </div>
  </div>
  ${renderSectionModal()}
  ${renderFolderPicker()}
  `;
}

// ── MATERIALS ────────────────────────────────────────────────


// ── ALARMS ───────────────────────────────────────────────────
function renderAlarms(){
  const timerTotal=state.timerMode==="study"?25*60:state.timerMode==="short"?5*60:15*60;
  const timerPct=state.timerSeconds/timerTotal;
  const circ=2*Math.PI*54;
  const offset=circ*(1-timerPct);
  const timerMin=Math.floor(state.timerSeconds/60);
  const timerSec=state.timerSeconds%60;
  const notifOn=typeof Notification!=='undefined'&&Notification.permission==='granted';

  const alarmList=state.alarms.length===0?`<div class="al-empty"><div style="font-size:44px;margin-bottom:8px">⏰</div><b>No alarms set yet</b><span>Create one above or add the 50 smart presets.</span></div>`:
    `<div class="al-list">${state.alarms.map(a=>`
      <div class="al-item ${a.enabled?"on":""} alarm-item ${a.enabled?"active-alarm":""}">
        <div class="al-ic">${a.enabled?"⏰":"🔕"}</div>
        <div class="al-info">
          <div class="al-time">${esc(a.time)}</div>
          <div class="al-lbl">${esc(a.label)}${a.repeat?" · Repeats":""}${a.ringtone?" · "+RINGTONES.find(r=>r.id===a.ringtone)?.name.split(" ")[0]:""}</div>
        </div>
        <button class="alarm-toggle ${a.enabled?"on":""}" onclick="toggleAlarm('${a.id}')" title="${a.enabled?"Disable":"Enable"}"></button>
        <button class="al-del" onclick="deleteAlarm('${a.id}')" title="Delete">🗑️</button>
      </div>`).join("")}</div>`;

  const css=`<style>
.al{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:1000px;margin:0 auto}
.al *{box-sizing:border-box}
.al-h1{font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--txt);line-height:1.1}
.al-h2{font-size:13px;color:var(--mute);margin:6px 0 18px}
.al-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:20px;padding:20px}
.al-lbl-s{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--mute);margin-bottom:12px}
.al-top{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
@media(max-width:760px){.al-top{grid-template-columns:1fr}}
.al-timer{text-align:center;background:radial-gradient(circle at 50% 0%,color-mix(in srgb,#FF6B35 18%,transparent),transparent 65%),var(--glass-bg,var(--surf))}
.al-seg{display:inline-flex;gap:4px;padding:4px;border-radius:99px;background:color-mix(in srgb,var(--txt) 6%,transparent);border:1px solid var(--line);margin-bottom:18px}
.al-seg button{border:none;background:none;color:var(--mute);padding:8px 14px;border-radius:99px;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;transition:.2s}
.al-seg button.on{background:#FF6B35;color:#fff;box-shadow:0 6px 16px -6px #FF6B35}
.al-ring{position:relative;width:170px;height:170px;margin:0 auto 18px}
.al-ring svg{transform:rotate(-90deg);display:block}
.al-ring-t{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.al-ring-t #timer-display{font-size:36px;font-weight:800;color:#FF6B35;font-family:'JetBrains Mono',monospace;letter-spacing:-1px}
.al-ring-t span{font-size:10px;letter-spacing:2px;color:var(--mute);margin-top:2px}
.al-btns{display:flex;justify-content:center;gap:10px}
.al-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--line);background:var(--surf);color:var(--text-2,#ccc);padding:11px 18px;border-radius:12px;font-weight:700;font-size:13px;font-family:inherit;cursor:pointer;transition:.2s}
.al-btn:hover{border-color:var(--acc);transform:translateY(-1px)}
.al-btn.p{background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-color:transparent;box-shadow:0 6px 18px -6px #FFB70088;padding:11px 26px}
.al-form{display:grid;gap:12px}
.al-form label{display:block;font-size:10px;font-weight:800;letter-spacing:1.4px;color:var(--mute);margin-bottom:6px}
.al-row2{display:grid;grid-template-columns:1fr 1.4fr;gap:10px}
.al-form input:not([type=checkbox]),.al-form select{width:100%;margin:0;border-radius:12px;padding:11px 13px}
.al-chk{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--text-3,#aaa);cursor:pointer}
.al-chk input{width:auto!important;accent-color:#FFE66D}
.al-tiles{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:22px}
@media(max-width:760px){.al-tiles{grid-template-columns:1fr}}
.al-tile{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:16px 18px}
.al-tile b{display:block;font-size:13.5px;color:var(--txt)}
.al-tile span{font-size:11.5px;color:var(--mute);line-height:1.4}
.al-sec{display:flex;align-items:center;justify-content:space-between;margin:0 0 12px}
.al-sec h3{margin:0;font-size:16px;font-weight:800;color:var(--txt);letter-spacing:-.3px}
.al-count{font-size:12px;font-weight:700;color:var(--acc);background:color-mix(in srgb,var(--acc) 14%,transparent);padding:3px 11px;border-radius:99px}
.al-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}
.al-item{display:flex;align-items:center;gap:13px;padding:14px 16px;background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:16px;transition:.2s}
.al-item.on{border-color:color-mix(in srgb,var(--acc) 40%,var(--line))}
.al-item:hover{transform:translateY(-2px)}
.al-ic{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-size:20px;background:color-mix(in srgb,var(--txt) 6%,transparent);flex-shrink:0}
.al-item.on .al-ic{background:color-mix(in srgb,var(--acc) 16%,transparent)}
.al-info{flex:1;min-width:0}
.al-time{font-size:22px;font-weight:800;font-family:'JetBrains Mono',monospace;letter-spacing:-.5px;color:var(--mute)}
.al-item.on .al-time{color:var(--acc)}
.al-lbl{font-size:11.5px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.al-del{background:none;border:none;cursor:pointer;font-size:15px;opacity:.55;padding:6px;border-radius:8px;transition:.2s}
.al-del:hover{opacity:1;background:#ff5c5c18}
.al-empty{text-align:center;padding:40px 16px;border:1.5px dashed var(--line);border-radius:18px;color:var(--mute)}
.al-empty b{display:block;color:var(--txt);font-size:15px;margin-bottom:4px}
.al-empty span{font-size:12.5px}
</style>`;

  return`${css}<div class="al fade-in">
    <div class="al-h1">Alarms & Timer</div>
    <div class="al-h2">Focus sessions and daily study reminders.</div>

    <div class="al-top">
      <div class="al-card al-timer">
        <div class="al-lbl-s">🍅 POMODORO TIMER</div>
        <div class="al-seg">
          ${[["study","25 min","🎯"],["short","5 min","☕"],["long","15 min","🧘"]].map(([m,l,ic])=>`<button class="${state.timerMode===m?"on":""}" onclick="setTimerMode('${m}')">${ic} ${l}</button>`).join("")}
        </div>
        <div class="al-ring">
          <svg width="170" height="170" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="54" fill="none" stroke="currentColor" style="color:color-mix(in srgb,var(--txt) 9%,transparent)" stroke-width="8"/>
            <circle id="timer-ring-fill" cx="70" cy="70" r="54" fill="none" stroke="#FF6B35" stroke-width="8"
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round" class="timer-ring"/>
          </svg>
          <div class="al-ring-t">
            <div id="timer-display" style="${state.timerRunning?"animation:countdownPulse 1s ease-in-out infinite":""}">${String(timerMin).padStart(2,"0")}:${String(timerSec).padStart(2,"0")}</div>
            <span>${state.timerMode==="study"?"FOCUS":state.timerMode==="short"?"BREAK":"LONG BREAK"}</span>
          </div>
        </div>
        <div class="al-btns">
          ${!state.timerRunning
            ?`<button class="al-btn p" onclick="startTimer()">▶ Start</button>`
            :`<button class="al-btn" onclick="pauseTimer()">⏸ Pause</button>`}
          <button class="al-btn" onclick="resetTimer(${timerTotal})">↺ Reset</button>
        </div>
      </div>

      <div class="al-card">
        <div class="al-lbl-s">⏰ SET NEW ALARM</div>
        <div class="al-form">
          <div class="al-row2">
            <div><label>TIME</label><input type="time" id="al-time" value="07:00"/></div>
            <div><label>LABEL</label><input id="al-label" placeholder="Morning Study, Break, etc." value="Study Time"/></div>
          </div>
          <div>
            <label>RINGTONE</label>
            <select id="al-ringtone" onchange="setRingtone(this.value)" style="font-size:12.5px">
              ${RINGTONES.map(r=>`<option value="${r.id}" ${selectedRingtone===r.id?"selected":""}>${r.name} — ${r.desc}</option>`).join("")}
            </select>
          </div>
          <label class="al-chk" for="al-repeat" style="margin:0;font-size:13px;letter-spacing:0;font-weight:500"><input type="checkbox" id="al-repeat"/> Repeat daily</label>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="al-btn p" onclick="saveNewAlarm()">+ Set Alarm</button>
            <button class="al-btn" onclick="setRingtone(document.getElementById('al-ringtone').value)">🔔 Preview Sound</button>
          </div>
        </div>
      </div>
    </div>

    <div class="al-tiles">
      <div class="al-card al-tile">
        <div><b style="color:#4ECDC4">🔔 Browser Notifications</b><span>Get a popup even when the app is in the background</span></div>
        <button class="al-btn" onclick="
          if(!('Notification' in window)){showToast('⚠️ Notifications not supported on this browser','alarm');return;}
          Notification.requestPermission().then(p=>{
            if(p==='granted') showToast('✅ Notifications enabled!','success');
            else showToast('⚠️ Notifications blocked. Allow in browser settings.','alarm');
            render();
          })">${notifOn?'✅ Notifications On':'Enable'}</button>
      </div>
      <div class="al-card al-tile">
        <div><b style="color:var(--gold,#FFE66D)">⏰ 50 Smart Study Alarms</b><span>Ready-made daily schedule with Pomodoro, breaks &amp; bedtime</span></div>
        <button class="al-btn p" style="padding:10px 16px" onclick="if(confirm('Add 50 preset study alarms to your schedule?'))addPresetAlarms()">+ Add 50</button>
      </div>
    </div>

    <div class="al-sec"><h3>Your Alarms</h3><span class="al-count">${state.alarms.length}</span></div>
    ${alarmList}

    <div style="margin-top:18px;text-align:center">
      <button class="al-btn" onclick="triggerAlarm({label:'Test Alarm',time:'Now'})">🔔 Test Alarm Sound</button>
    </div>
  </div>`;
}

// ── LOG ───────────────────────────────────────────────────────
function renderLog(){
  const subsAll=getSubjects();
  const moodBtns=MOODS.map((m,i)=>`<button class="lg-mood ${state.mood===i?"sel":""} mood-btn" onclick="setMood(${i})">${m}</button>`).join("");
  const subBtns=subsAll.map(s=>`<button class="lg-sub ${s.id===state.activeSubject?"on":""}" style="--c:${s.color}" onclick="state.activeSubject='${s.id}';render()">${s.icon} ${esc(s.name)}</button>`).join("");
  const entries=Object.entries(state.studyLog).sort((a,b)=>b[0].localeCompare(a[0]));
  const history=entries.slice(0,14).map(([date,data],i)=>{
    const sub=subsAll.find(s=>s.id===data.subject);
    return`<div class="lg-item" style="--c:${sub?.color||"#777"};animation-delay:${i*0.04}s">
      <div class="lg-mo">${MOODS[data.mood??3]}</div>
      <div style="flex:1;min-width:0">
        <b>${date===today()?"Today ✦":date}</b>
        <span>${sub?.icon||""} ${esc(sub?.name||"—")}</span>
      </div>
      <div class="lg-h">${data.hours}<small>h</small></div>
    </div>`;
  }).join("");

  const css=`<style>
.lg{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:720px;margin:0 auto}
.lg *{box-sizing:border-box}
.lg-h1{font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--txt);line-height:1.1}
.lg-h2{font-size:13px;color:var(--mute);margin:6px 0 18px}
.lg-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:20px;padding:20px;margin-bottom:14px}
.lg-lbl{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--mute);margin-bottom:14px}
.lg-moods{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.lg-mood{border:1.5px solid var(--line);background:var(--surf);border-radius:16px;padding:12px 0;font-size:26px;cursor:pointer;transition:.2s;font-family:inherit}
.lg-mood:hover{transform:translateY(-2px);border-color:var(--acc)}
.lg-mood.sel{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 14%,var(--surf));transform:scale(1.06);box-shadow:0 8px 20px -10px var(--acc)}
.lg-ml{font-size:12.5px;color:var(--text-4,#888);margin-top:12px;text-align:center;font-weight:600}
.lg-hours{display:flex;align-items:center;gap:16px}
.lg-hours input[type=range]{flex:1;margin:0;accent-color:#FFE66D}
.lg-hv{font-size:34px;font-weight:800;color:var(--acc);letter-spacing:-1.5px;min-width:70px;text-align:right;line-height:1}
.lg-subs{display:flex;flex-wrap:wrap;gap:8px}
.lg-sub{--c:#7C6CF0;border:1px solid var(--line);background:var(--surf);color:var(--mute);padding:9px 14px;border-radius:99px;font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer;transition:.2s}
.lg-sub:hover{color:var(--txt);border-color:var(--c)}
.lg-sub.on{border-color:var(--c);color:var(--c);background:color-mix(in srgb,var(--c) 16%,var(--surf));font-weight:800;box-shadow:0 6px 16px -8px var(--c)}
.lg-save{width:100%;border:none;border-radius:16px;padding:15px;font-size:15px;font-weight:800;font-family:inherit;cursor:pointer;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;box-shadow:0 10px 24px -10px #FFB700aa;transition:.2s;margin-bottom:26px}
.lg-save:hover{transform:translateY(-2px)}
.lg-sec{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.lg-sec h3{margin:0;font-size:16px;font-weight:800;color:var(--txt);letter-spacing:-.3px}
.lg-item{--c:#777;display:flex;align-items:center;gap:14px;padding:13px 16px;background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-left:3px solid var(--c);border-radius:16px;margin-bottom:8px;animation:lgIn .3s ease both;transition:transform .2s}
.lg-item:hover{transform:translateX(3px)}
@keyframes lgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.lg-mo{font-size:26px}
.lg-item b{display:block;font-size:13.5px;color:var(--txt)}
.lg-item span{font-size:11.5px;color:var(--c);font-weight:600}
.lg-h{font-size:24px;font-weight:800;color:var(--acc);letter-spacing:-1px}
.lg-h small{font-size:13px}
.lg-empty{text-align:center;padding:36px 16px;border:1.5px dashed var(--line);border-radius:18px;color:var(--mute);font-size:13px}
</style>`;

  return`${css}<div class="lg fade-in">
    <div class="lg-h1">📝 Daily Study Log</div>
    <div class="lg-h2">Track your mood and hours to build your streak.</div>

    <div class="lg-card">
      <div class="lg-lbl">HOW ARE YOU FEELING TODAY?</div>
      <div class="lg-moods">${moodBtns}</div>
      <div class="lg-ml">${MOOD_LABELS[state.mood]}</div>
    </div>

    <div class="lg-card">
      <div class="lg-lbl">HOURS STUDIED TODAY</div>
      <div class="lg-hours">
        <input type="range" min="0" max="12" step="0.5" value="${state.hoursToday}" oninput="setHours(this.value)"/>
        <span id="hours-display" class="lg-hv">${state.hoursToday}h</span>
      </div>
    </div>

    <div class="lg-card">
      <div class="lg-lbl">MAIN SUBJECT TODAY</div>
      <div class="lg-subs">${subBtns}</div>
    </div>

    <button class="lg-save" onclick="logToday()">💾 Save Today's Log</button>

    <div class="lg-sec"><h3>Study History</h3></div>
    ${entries.length===0?`<div class="lg-empty">No logs yet. Start studying! 💪</div>`:history}
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// FILE FUNCTIONS

export { _doRender, _renderResolvers, _renderTimer, render, renderAlarms, renderDashboard, renderLog, renderSubjects, renderSync };

if (typeof window !== "undefined") {
  Object.assign(window, { _doRender, _renderResolvers, _renderTimer, render, renderAlarms, renderDashboard, renderLog, renderSubjects, renderSync });
}

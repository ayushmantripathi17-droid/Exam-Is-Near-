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
    offline:{icon:"🔴",text:"Not signed in",color:"#666",desc:"Sign in with Google to sync your data across all devices."},
    connecting:{icon:"🟡",text:"Connecting…",color:"#FFE66D",desc:"Establishing secure connection…"},
    synced:{icon:"🟢",text:"Synced",color:"#06D6A0",desc:"Your data is syncing in real-time across all devices!"},
    error:{icon:"🔴",text:"Connection error",color:"#FF6B35",desc:"Sync error — likely a Firestore rules issue. See help below."},
  };
  const s=statusMap[syncStatus]||statusMap.offline;

  const userCard=currentUser?`
    <div class="card" style="margin-bottom:16px;display:flex;align-items:center;gap:16px;padding:20px">
      <img src="${currentUser.photoURL||''}" onerror="this.style.display='none'" style="width:54px;height:54px;border-radius:50%;border:3px solid #06D6A0;flex-shrink:0"/>
      <div style="flex:1;min-width:0">
        <div style="font-size:15px;font-weight:bold;color:#ccc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(currentUser.displayName||"User")}</div>
        <div style="font-size:10px;color:#333;margin-top:3px">UID: ${syncUserId?.slice(0,16)||"—"}…</div>
      </div>
      <button class="btn-danger" onclick="googleSignOut()" style="flex-shrink:0">Sign Out</button>
    </div>`:`
    <div class="card" style="margin-bottom:16px;text-align:center;padding:32px">
      <div style="font-size:48px;margin-bottom:14px">🔐</div>
      <div style="font-size:16px;font-weight:bold;color:#ccc;margin-bottom:8px">Sign in to sync your data</div>
      <div style="font-size:12px;color:#555;margin-bottom:22px;line-height:1.7">Use the same Google account on any device.<br>Your progress will appear instantly everywhere.</div>
      <button onclick="googleSignIn()" style="background:linear-gradient(135deg,#4285F4,#34A853);border:none;color:#fff;padding:14px 28px;border-radius:12px;font-family:inherit;font-size:14px;cursor:pointer;font-weight:bold;letter-spacing:0.5px;box-shadow:0 4px 20px #4285F444;transition:all 0.25s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
        <span style="margin-right:8px">G</span> Sign in with Google
      </button>
      <div style="font-size:11px;color:#333;margin-top:16px">Free · Secure · Works on mobile + PC</div>
    </div>`;

  return`<div class="fade-in">
    <div style="font-size:18px;font-weight:bold;margin-bottom:6px">🔄 Sync & Account</div>
    <div style="font-size:12px;color:#555;margin-bottom:20px">Sign in with Google to sync across phone and PC</div>

    <!-- Status -->
    <div class="card card-glow" style="--glow-color:${s.color}22;margin-bottom:16px;text-align:center;padding:20px">
      <div style="font-size:36px;margin-bottom:8px">${s.icon}</div>
      <div style="font-size:16px;font-weight:bold;color:${s.color};margin-bottom:4px">${s.text}</div>
      <div style="font-size:12px;color:#555">${s.desc}</div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap">
        <button class="btn-gold" onclick="pushToFirebase().then(()=>showToast('✅ Data synced to cloud!','success')).catch(e=>showToast('⚠️ Sync failed: '+e.message,'alarm'))" style="font-size:12px;padding:9px 18px">⬆ Sync Now</button>
        ${currentUser?`<button class="btn-ghost" onclick="subscribeToFirestore().then(()=>showToast('✅ Pulled latest data!','success'))" style="font-size:12px">⬇ Pull Latest</button>`:''}
      </div>
    </div>

    <!-- User / Sign-in card -->
    ${userCard}

    <!-- Google Drive Link Import -->
    <div class="card" style="margin-bottom:16px;border-color:#4ECDC433">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <span style="font-size:24px">📎</span>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:bold;color:#ccc">Import from Google Drive</div>
          <div style="font-size:11px;color:#555">Paste a Drive share link to add it to your Files</div>
        </div>
      </div>
      <div style="font-size:12px;color:#555;margin-bottom:12px;line-height:1.7">
        Share a file from Google Drive → copy the link → paste it here. It will appear in your Files tab under the subject you choose.
      </div>
      <div style="display:grid;gap:8px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <input id="sync-drive-name" placeholder="File name (e.g. C++ Notes.pdf)" style="margin:0;font-size:12px"/>
          <select id="sync-drive-sub" style="margin:0;font-size:12px">${getSubjects().map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join("")}</select>
        </div>
        <div style="display:flex;gap:8px">
          <input id="sync-drive-url" placeholder="https://drive.google.com/file/d/..." style="flex:1;margin:0;font-size:12px"/>
          <button class="btn-gold" onclick="addDriveLinkFromSync()" style="padding:10px 16px;white-space:nowrap;font-size:12px">+ Add</button>
        </div>
      </div>
    </div>

    <!-- Firestore fix guide (shown only on error) -->
    ${syncStatus==="error"?`
    <div class="card" style="margin-bottom:16px;border-color:#FF6B3533">
      <div style="font-size:12px;font-weight:bold;color:#FF6B35;margin-bottom:10px">🔧 How to Fix Sync Error</div>
      <div style="font-size:11px;color:#888;line-height:2">
        This is usually caused by <b style="color:#ccc">Firestore Security Rules</b> blocking your account.<br>
        Fix it in <b>2 minutes:</b>
      </div>
      <div style="background:#0a0a12;border-radius:8px;padding:12px;margin:10px 0;font-size:11px;color:#888;line-height:2">
        1. Open <a href="https://console.firebase.google.com/project/exam-is-near/firestore/rules" target="_blank" style="color:#4ECDC4">Firebase Console → Firestore → Rules</a><br>
        2. Replace the rules with:<br>
        <pre style="background:#111;padding:8px;border-radius:6px;margin-top:6px;color:#06D6A0;font-size:10px;white-space:pre-wrap">rules_version = '2';
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
        3. Click <b style="color:#FFE66D">Publish</b> and refresh this page
      </div>
      <button class="btn-ghost" onclick="subscribeToFirestore().then(()=>showToast('Retrying sync…','info'))" style="font-size:11px;margin-right:8px">🔄 Retry Now</button>
      <button onclick="googleSignOut().then(()=>setTimeout(googleSignIn,800))" style="background:#1a0f00;border:1px solid #FF6B3533;color:#FF6B35;padding:8px 14px;border-radius:8px;font-size:11px;font-family:inherit;cursor:pointer">↺ Sign out & back in</button>
    </div>`:""}

    <!-- How it works -->
    <div class="card" style="margin-bottom:16px">
      <div style="font-size:11px;color:#444;letter-spacing:1px;margin-bottom:10px">HOW IT WORKS</div>
      <div style="font-size:12px;color:#555;line-height:2">
        🔐 Sign in with Google once on each device<br>
        📱 Study on phone → data saves to your account<br>
        💻 Open on laptop → same data appears instantly<br>
        🔄 Real-time sync — no manual export needed<br>
        🆓 Completely free with Firebase
      </div>
    </div>

    <!-- Link-based Sync -->
    <div class="card" style="margin-bottom:16px;border-color:#4ECDC444">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <span style="font-size:22px">🔗</span>
        <div>
          <div style="font-size:14px;font-weight:bold;color:#ccc">Share Link Sync</div>
          <div style="font-size:11px;color:#555">Share your progress via a link — no account needed</div>
        </div>
      </div>
      <div style="font-size:12px;color:#555;margin-bottom:14px;line-height:1.8">
        Generate a share link → send to anyone → they open it and import your data. Great for syncing between devices without Google, or sharing with classmates.
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px">
        <button class="btn-gold" onclick="generateShareLink()" style="font-size:12px;padding:9px 18px">🔗 Generate Share Link</button>
        <button class="btn-ghost" onclick="document.getElementById('import-link-input').style.display='flex'" style="font-size:12px">📥 Paste a Link</button>
      </div>
      <div id="import-link-input" style="display:none;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        <input id="share-link-paste" placeholder="Paste share link or ?import=... here" style="flex:1;font-size:12px"/>
        <button class="btn-gold" onclick="handlePastedShareLink()" style="font-size:12px;padding:9px 16px">Import</button>
      </div>
      <textarea id="share-link-display" style="display:none;font-size:10px;color:#4ECDC4;background:#0a0a18;border:1px solid #4ECDC433;border-radius:8px;padding:10px;width:100%;height:72px;resize:none;margin-top:4px" placeholder="Share link will appear here..." readonly onclick="this.select()"></textarea>
    </div>

    <!-- App Config (moved to Admin Panel) -->

    <!-- Version Info -->
    <div class="card" style="margin-top:16px;border-color:#FFE66D22">
      <div style="font-size:11px;color:#444;letter-spacing:1px;margin-bottom:10px">📦 VERSION INFO</div>
      <div style="font-size:12px;color:#555;line-height:2">
        <b style="color:#FFE66D">Exam Is Near</b> · Study Smart v15 · by ArkSetu<br>
        ✅ IndexedDB file storage<br>
        ✅ 15 alarm ringtones · 50 preset alarms<br>
        ✅ Pomodoro, Flashcards, Quiz, Analytics<br>
        ✅ AI Study Assistant (Gemini)<br>
        ✅ Link-based data sharing<br>
        ✅ Google Firebase real-time sync<br>
        ✅ Google Drive link import<br>
        ✅ Browser push notifications<br>
      </div>
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid #1e1e2e;display:flex;align-items:center;gap:10px">
        <div style="font-size:28px">👨‍💻</div>
        <div>
          <div style="font-size:13px;font-weight:bold;color:#FFE66D">Ayushman Tripathi</div>
          <div style="font-size:11px;color:#555">Developer · B.Sc. LL.B. · Exam Is Near by ArkSetu</div>
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
  const nextExam=getSubjects().filter(s=>getDaysLeft(getExamDate(s.id))!==null&&getDaysLeft(getExamDate(s.id))>=0).slice().sort((a,b)=>getDaysLeft(getExamDate(a.id))-getDaysLeft(getExamDate(b.id)))[0]||null;

  const subCards=getSubjects().map((s,i)=>{
    const examD=getExamDate(s.id);
    const p=getSubjectPct(s.id),days=getDaysLeft(examD);
    const mc=state.materials.filter(m=>m.subjectId===s.id).length;
    const dColor=days!==null&&days<=2?"#ff5555":days!==null&&days<=5?"#FF6B35":"#555";
    const dText=days===null?"":days<=0?"🚨 Today!":days===1?"Tomorrow!":days+"d left";
    return `<div class="card" style="cursor:pointer;animation:fadeInUp 0.3s ease ${i*0.06}s both" onclick="setActiveSubject('${s.id}');switchView('subjects')" style="--glow:${s.color}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:20px">${s.icon}</span>
          <div>
            <div style="font-weight:bold;font-size:14px">${esc(s.name)}</div>
            <div style="font-size:10px;color:#444">${mc} material${mc!==1?"s":""} · ${esc(s.code)}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:14px">
          <div style="font-size:10px;color:${dColor};text-align:right">${dText}${dText?'<br>':''}${dText?'<span style="color:#333">'+esc(examD)+'</span>':esc(examD)}</div>
          <div style="font-size:24px;font-weight:bold;color:${s.color}">${p}%</div>
        </div>
      </div>
      <div class="pbar" style="--glow:${s.color}"><div class="pfill" style="width:${p}%;background:linear-gradient(90deg,${s.color}aa,${s.color})"></div></div>
    </div>`;
  }).join("");

  const nextExamBox=nextExam?`
    <div style="background:linear-gradient(135deg,#1a0f00,#0f0f18);border:1px solid #FF6B3544;border-radius:12px;padding:16px;margin-bottom:16px;display:flex;align-items:center;gap:14px">
      <div style="font-size:32px" class="float-anim">${nextExam.icon}</div>
      <div style="flex:1">
        <div style="font-size:10px;color:#FF6B35;letter-spacing:2px;text-transform:uppercase">Next Exam</div>
        <div style="font-size:16px;font-weight:bold">${esc(nextExam.name)}</div>
        <div style="font-size:12px;color:#666">${esc(getExamDate(nextExam.id))}${getDaysLeft(getExamDate(nextExam.id))!==null?' · '+getDaysLeft(getExamDate(nextExam.id))+' days away':''}</div>
      </div>
      ${getDaysLeft(getExamDate(nextExam.id))!==null?`<div style="font-size:36px;font-weight:bold;color:#FF6B35">${getDaysLeft(getExamDate(nextExam.id))}d</div>`:''}
    </div>`:"";

  // ── Daily Goal & Study Streak ──
  const streak = getStreak();
  const todayLogged = !!state.studyLog[today()];
  const dailyGoal = parseFloat(localStorage.getItem('st_dailyGoal')||'6');
  const todayHours = state.hoursToday || 0;
  const goalPct = Math.min(100, Math.round((todayHours/dailyGoal)*100));
  const streakBar = Array.from({length:7},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-6+i);
    const k = d.toISOString().split('T')[0];
    const has = state.studyLog[k]?.hours > 0;
    const isToday = k === today();
    return `<div title="${k}" style="flex:1;height:32px;border-radius:5px;background:${has?'#FFE66D':(isToday?'#2a2a1a':'#1a1a24')};border:1px solid ${isToday?'#FFE66D44':'transparent'};transition:all 0.3s;position:relative">
      ${isToday?`<div style="position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);font-size:8px;color:#555;white-space:nowrap">Today</div>`:''}
    </div>`;
  }).join('');

  const streakGoalCard = `<div class="card" style="margin-bottom:16px;padding:16px;border-color:#FFE66D22">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="font-size:13px;font-weight:bold;color:#EDE8E0;display:flex;align-items:center;gap:8px">
          🔥 ${streak}-Day Streak
          ${streak>=7?'<span style="font-size:10px;background:#FFE66D22;color:#FFE66D;border:1px solid #FFE66D33;padding:1px 8px;border-radius:10px">🏆 Week!</span>':''}
          ${streak>=30?'<span style="font-size:10px;background:#C77DFF22;color:#C77DFF;border:1px solid #C77DFF33;padding:1px 8px;border-radius:10px">🌟 Month!</span>':''}
        </div>
        <div style="font-size:10px;color:#444;margin-top:2px">Study every day to keep your streak alive</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;color:#555">Today's goal</div>
        <div style="font-size:13px;font-weight:bold;color:${goalPct>=100?'#06D6A0':'#FFE66D'}">${todayHours}h / ${dailyGoal}h</div>
      </div>
    </div>
    <!-- 7-day streak dots -->
    <div style="display:flex;gap:4px;margin-bottom:20px">${streakBar}</div>
    <!-- Daily goal progress -->
    <div style="height:5px;background:#1a1a24;border-radius:3px;overflow:hidden">
      <div style="height:100%;width:${goalPct}%;background:linear-gradient(90deg,#06D6A0,#FFE66D);border-radius:3px;transition:width 0.8s cubic-bezier(0.4,0,0.2,1)"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:6px">
      <div style="font-size:10px;color:#444">${goalPct>=100?'✅ Goal reached!':'Keep going…'}</div>
      <button onclick="(function(){const g=prompt('Set daily study goal (hours):','${dailyGoal}');if(g&&!isNaN(g)&&parseFloat(g)>0){localStorage.setItem('st_dailyGoal',parseFloat(g));render();}})()" style="background:none;border:none;color:#444;font-size:10px;cursor:pointer;font-family:inherit">✏️ Edit goal</button>
    </div>
  </div>`;

  return `<div class="fade-in">
    ${nextExamBox}
    ${streakGoalCard}
    <div style="display:flex;gap:20px;margin-bottom:24px;align-items:center;flex-wrap:wrap">
      <div class="ring-container" style="animation:ringPulse 2s ease-in-out infinite">
        <svg width="130" height="130" style="transform:rotate(-90deg)">
          <circle cx="65" cy="65" r="54" fill="none" stroke="#1a1a24" stroke-width="9"/>
          <circle cx="65" cy="65" r="54" fill="none" stroke="url(#ringGrad)" stroke-width="9"
            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
            stroke-linecap="round" style="transition:stroke-dashoffset 1s ease"/>
          <defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFE66D"/><stop offset="100%" stop-color="#FF6B35"/>
          </linearGradient></defs>
        </svg>
        <div class="ring-text">
          <div style="font-size:26px;font-weight:bold;color:#FFE66D">${pct}%</div>
          <div style="font-size:9px;color:#555;letter-spacing:1px">COMPLETE</div>
        </div>
      </div>
      <div style="flex:1;min-width:200px">
        <div style="font-size:20px;font-weight:bold;margin-bottom:4px">Keep grinding! 💪</div>
        <div style="font-size:13px;color:#555;margin-bottom:14px">${nextExam?'Next: '+esc(nextExam.name)+(getDaysLeft(getExamDate(nextExam.id))!==null?' in '+getDaysLeft(getExamDate(nextExam.id))+'d':''):'No exams set'} · ${state.alarms.filter(a=>a.enabled).length} active alarm${state.alarms.filter(a=>a.enabled).length!==1?"s":""}</div>
        <div class="grid-3">
          ${[["⏱️",getTotalHours()+"h","Logged"],["🔥",streak+" days","Streak"],["📁",state.files.length,"Files"]].map(([ic,v,l])=>`
          <div class="stat-box"><div style="font-size:18px">${ic}</div><div style="font-size:20px;font-weight:bold;color:#EDE8E0;margin:4px 0">${v}</div><div style="font-size:9px;color:#444;letter-spacing:1px">${l}</div></div>`).join("")}
        </div>
      </div>
    </div>
    <div class="section-label">Subject Progress</div>
    ${subCards}
  </div>`;
}

// ── SUBJECTS VIEW ─────────────────────────────────────────────────
function renderSubjects(){
  const _subs=getSubjects();
  let sub=_subs.find(s=>s.id===state.activeSubject);
  // Guard: if activeSubject doesn't exist in current course, fall back to first
  if(!sub){ sub=_subs[0]; if(sub) state.activeSubject=sub.id; }
  if(!sub){
    if(activeCourse === 'cbse11' && !cbse11Stream){
      return `<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📗</div><div style="margin-bottom:8px">Select your Class 11 stream to load subjects.</div><button class="btn-gold" onclick="showCourseSelector('cbse_group','cbse11_group')" style="margin-top:16px;padding:10px 24px">🔬 Choose Stream</button></div>`;
    }
    if(activeCourse === 'cbse12' && !cbse12Stream){
      return `<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">🎓</div><div style="margin-bottom:8px">Select your Class 12 stream to load subjects.</div><button class="btn-gold" onclick="showCourseSelector('cbse_group','cbse12_group')" style="margin-top:16px;padding:10px 24px">🔬 Choose Stream</button></div>`;
    }
    return `<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📚</div><div>No subjects found. Please select a course.</div><button class="btn-gold" onclick="showCourseSelector()" style="margin-top:16px;padding:10px 24px">🎯 Select Course</button></div>`;
  }
  const pct=getSubjectPct(sub.id);

  const subBtns=getSubjects().map(s=>`
    <button class="pill-btn ${s.id===state.activeSubject?"active-sub":""}" onclick="setActiveSubject('${s.id}')"
      style="background:${s.id===state.activeSubject?s.color:"#0f0f18"};color:${s.id===state.activeSubject?"#08080f":"#666"};border-color:${s.id===state.activeSubject?s.color:"#222"};font-weight:${s.id===state.activeSubject?"bold":"normal"}">
      ${s.icon} ${esc(s.name)}</button>`).join("");

  const unitCards=sub.units.map((unit,ui)=>{
    const done=unit.topics.filter((_,i)=>state.progress[`${sub.id}-${unit.id}-${i}`]).length;
    const topics=unit.topics.map((topic,idx)=>{
      const k=`${sub.id}-${unit.id}-${idx}`;
      const isDone=!!state.progress[k];
      const refKey = sub.lawRef ? topicRefKey(sub.id,unit.id,idx) : null;
      const refOpen = sub.lawRef && refOpenTopic===refKey;
      return `<div class="topic-row" onclick="toggleTopic('${sub.id}','${unit.id}',${idx})" style="--acc:${sub.color}">
        <div class="cb ${isDone?"done":""}">${isDone?"✓":""}</div>
        <span style="font-size:13px;color:${isDone?"#444":"#bbb"};text-decoration:${isDone?"line-through":"none"};transition:all 0.3s;flex:1">${esc(topic)}</span>
        ${isDone?`<span style="margin-right:${sub.lawRef?"4px":"0"};font-size:10px;color:${sub.color}">✓</span>`:""}
        ${sub.lawRef?`<div style="font-size:11px;color:var(--text-muted,#555);padding:4px 6px;border-radius:6px;transition:transform .2s;transform:rotate(${refOpen?90:0}deg);color:${refOpen?"#FFE66D":"var(--text-muted,#555)"}" onclick="event.stopPropagation();toggleTopicRefExpand('${sub.id}','${unit.id}',${idx})">▸</div>`:""}
      </div>${sub.lawRef?renderTopicRefPanel(sub,unit,idx):""}`;
    }).join("");
    return `<div class="card" style="animation:fadeInUp 0.3s ease ${ui*0.08}s both">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="font-weight:bold;font-size:14px">${esc(unit.name)}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="font-size:12px;color:${sub.color}">${done}/${unit.topics.length}</div>
          ${done===unit.topics.length?`<span style="font-size:14px" class="float-anim">🏆</span>`:""}
        </div>
      </div>
      ${topics}
    </div>`;
  }).join("");

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

  return `<div class="fade-in">
    <div class="flex-wrap" style="margin-bottom:20px">${subBtns}${activeCourse==='cbse11'?`<button onclick="showCourseSelector('cbse_group','cbse11_group')" style="background:#FFE66D22;border:1px solid #FFE66D44;color:#FFE66D;border-radius:20px;padding:6px 13px;font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s" title="Change stream">🔄 ${CBSE11_STREAMS[cbse11Stream]?.label?.split('—')[0]?.trim()||'Change Stream'}</button>`:''}${activeCourse==='cbse12'?`<button onclick="showCourseSelector('cbse_group','cbse12_group')" style="background:#FFE66D22;border:1px solid #FFE66D44;color:#FFE66D;border-radius:20px;padding:6px 13px;font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s" title="Change stream">🔄 ${CBSE12_STREAMS[cbse12Stream]?.label?.split('—')[0]?.trim()||'Change Stream'}</button>`:''}</div>
    <div class="card card-glow" style="--glow-color:${sub.color}33;margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:22px;font-weight:bold">${sub.icon} ${esc(sub.name)}</div>
          <div style="font-size:11px;color:#555;margin-top:3px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          Exam:
          <input type="date" value="${_examDateToISO(getExamDate(sub.id))}" onchange="setExamDate('${sub.id}', _isoToExamDate(this.value))"
            style="background:#1a1a2a;border:1px solid #2a2a3a;border-radius:6px;padding:2px 7px;font-size:11px;color:${sub.color};font-family:inherit;color-scheme:dark"
            title="Set your exam date"/>
          ${getDaysLeft(getExamDate(sub.id))!==null?' <span style="color:'+(getDaysLeft(getExamDate(sub.id))<=3?'#FF6B35':getDaysLeft(getExamDate(sub.id))<=7?'#FFE66D':'#06D6A0')+'">'+getDaysLeft(getExamDate(sub.id))+' days left</span>':''}
        </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:34px;font-weight:bold;color:${sub.color}">${pct}%</div>
          <button class="btn-ghost" style="font-size:11px;margin-top:4px" onclick="state.newMat.subjectId='${sub.id}';switchView('files');setTimeout(()=>showAddForm(),50)">+ Add Note</button>
        </div>
      </div>
      <div class="pbar"><div class="pfill" style="width:${pct}%;background:linear-gradient(90deg,${sub.color}88,${sub.color})"></div></div>
    </div>
    ${sub.lawRef?renderTopicRefModeSwitch():""}
    ${unitCards}
    ${sub.lawRef?renderSubjectPyqAccordion(sub):""}
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

  const alarmList=state.alarms.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">⏰</div><div>No alarms set yet</div></div>`:
    state.alarms.map(a=>`
      <div class="alarm-item ${a.enabled?"active-alarm":""}">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:22px">${a.enabled?"⏰":"🔕"}</span>
          <div>
            <div style="font-size:18px;font-weight:bold;color:${a.enabled?"#FFE66D":"#555"};font-family:monospace">${esc(a.time)}</div>
            <div style="font-size:11px;color:#555">${esc(a.label)}${a.repeat?" · Repeats":""}${a.ringtone?" · "+RINGTONES.find(r=>r.id===a.ringtone)?.name.split(" ")[0]:""}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <button class="alarm-toggle ${a.enabled?"on":""}" onclick="toggleAlarm('${a.id}')" title="${a.enabled?"Disable":"Enable"}"></button>
          <button class="icon-btn" onclick="deleteAlarm('${a.id}')" style="color:#663333">🗑️</button>
        </div>
      </div>`).join("");

  return`<div class="fade-in">
    <!-- POMODORO TIMER -->
    <div class="card card-glow" style="--glow-color:#FF6B3522;margin-bottom:20px;text-align:center">
      <div style="font-size:11px;letter-spacing:2px;color:#555;text-transform:uppercase;margin-bottom:16px">🍅 Pomodoro Timer</div>
      <div style="display:flex;justify-content:center;gap:8px;margin-bottom:20px">
        ${[["study","25 min","🎯"],["short","5 min","☕"],["long","15 min","🧘"]].map(([m,l,ic])=>`
          <button class="pill-btn" onclick="setTimerMode('${m}')"
            style="background:${state.timerMode===m?"#FF6B35":"#0f0f18"};color:${state.timerMode===m?"#fff":"#666"};border-color:${state.timerMode===m?"#FF6B35":"#222"}">
            ${ic} ${l}</button>`).join("")}
      </div>
      <div style="position:relative;width:140px;height:140px;margin:0 auto 20px">
        <svg width="140" height="140" style="transform:rotate(-90deg)">
          <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a24" stroke-width="8"/>
          <circle id="timer-ring-fill" cx="70" cy="70" r="54" fill="none" stroke="#FF6B35" stroke-width="8"
            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
            stroke-linecap="round" class="timer-ring"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div id="timer-display" style="font-size:30px;font-weight:bold;color:#FF6B35;font-family:'JetBrains Mono',monospace;${state.timerRunning?"animation:countdownPulse 1s ease-in-out infinite":""}">${String(timerMin).padStart(2,"0")}:${String(timerSec).padStart(2,"0")}</div>
          <div style="font-size:10px;color:#555">${state.timerMode==="study"?"FOCUS":state.timerMode==="short"?"BREAK":"LONG BREAK"}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:center;gap:10px">
        ${!state.timerRunning
          ?`<button class="btn-gold" onclick="startTimer()" style="padding:10px 28px">▶ Start</button>`
          :`<button class="btn-ghost" onclick="pauseTimer()">⏸ Pause</button>`}
        <button class="btn-ghost" onclick="resetTimer(${timerTotal})">↺ Reset</button>
      </div>
    </div>

    <!-- ADD ALARM -->
    <div class="card" style="margin-bottom:20px">
      <div class="section-label">⏰ Set New Alarm</div>
      <div class="grid-2" style="margin-bottom:12px">
        <div>
          <div style="font-size:10px;color:#555;margin-bottom:6px">TIME</div>
          <input type="time" id="al-time" value="07:00"/>
        </div>
        <div>
          <div style="font-size:10px;color:#555;margin-bottom:6px">LABEL</div>
          <input id="al-label" placeholder="Morning Study, Break, etc." value="Study Time"/>
        </div>
      </div>
      <div style="margin-bottom:12px">
        <div style="font-size:10px;color:#555;margin-bottom:6px">RINGTONE</div>
        <select id="al-ringtone" onchange="setRingtone(this.value)" style="font-size:12px">
          ${RINGTONES.map(r=>`<option value="${r.id}" ${selectedRingtone===r.id?"selected":""}>${r.name} — ${r.desc}</option>`).join("")}
        </select>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <input type="checkbox" id="al-repeat" style="width:auto;accent-color:#FFE66D"/>
        <label for="al-repeat" style="font-size:13px;color:#888;cursor:pointer">Repeat daily</label>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn-gold" onclick="saveNewAlarm()">+ Set Alarm</button>
        <button class="btn-ghost" onclick="setRingtone(document.getElementById('al-ringtone').value)" style="font-size:12px">🔔 Preview Sound</button>
      </div>
    </div>

    <!-- NOTIFICATION PERMISSION -->
    <div class="card" style="margin-bottom:16px;border-color:#4ECDC433">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div>
          <div style="font-size:13px;font-weight:bold;color:#4ECDC4">🔔 Browser Notifications</div>
          <div style="font-size:11px;color:#555;margin-top:2px">Get a popup notification even when app is in background</div>
        </div>
        <button class="btn-ghost" style="font-size:12px" onclick="
          if(!('Notification' in window)){showToast('⚠️ Notifications not supported on this browser','alarm');return;}
          Notification.requestPermission().then(p=>{
            if(p==='granted') showToast('✅ Notifications enabled!','success');
            else showToast('⚠️ Notifications blocked. Allow in browser settings.','alarm');
            render();
          })">
          ${typeof Notification!=='undefined'&&Notification.permission==='granted'?'✅ Notifications On':'Enable Notifications'}
        </button>
      </div>
    </div>

    <!-- PRESET 50 ALARMS -->
    <div class="card" style="margin-bottom:16px;border-color:#FFE66D33">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div>
          <div style="font-size:13px;font-weight:bold;color:#FFE66D">⏰ 50 Smart Study Alarms</div>
          <div style="font-size:11px;color:#555;margin-top:2px">Pre-built daily schedule with Pomodoro, breaks & bedtime</div>
        </div>
        <button class="btn-gold" style="font-size:12px;padding:8px 16px" onclick="if(confirm('Add 50 preset study alarms to your schedule?'))addPresetAlarms()">+ Add 50 Presets</button>
      </div>
    </div>

    <!-- ALARM LIST -->
    <div class="section-label">Your Alarms (${state.alarms.length})</div>
    ${alarmList}

    <!-- TEST ALARM -->
    <div style="margin-top:16px;text-align:center">
      <button class="btn-ghost" onclick="triggerAlarm({label:'Test Alarm',time:'Now'})" style="font-size:12px">🔔 Test Alarm Sound</button>
    </div>
  </div>`;
}

// ── LOG ───────────────────────────────────────────────────────
function renderLog(){
  const moodBtns=MOODS.map((m,i)=>`<button class="mood-btn ${state.mood===i?"sel":""}" onclick="setMood(${i})">${m}</button>`).join("");
  const subBtns=getSubjects().map(s=>`
    <button class="pill-btn" onclick="state.activeSubject='${s.id}';render()"
      style="background:${s.id===state.activeSubject?s.color:"#141420"};color:${s.id===state.activeSubject?"#08080f":"#666"};border-color:${s.id===state.activeSubject?s.color:"#222"};font-weight:${s.id===state.activeSubject?"bold":"normal"}">
      ${s.icon} ${esc(s.name)}</button>`).join("");

  const history=Object.entries(state.studyLog).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,14).map(([date,data],i)=>{
    const sub=getSubjects().find(s=>s.id===data.subject);
    return`<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#0f0f18;border:1px solid #1e1e2e;border-radius:10px;margin-bottom:8px;animation:fadeInUp 0.3s ease ${i*0.05}s both;transition:all 0.2s" onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='#1e1e2e'">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:24px">${MOODS[data.mood??3]}</span>
        <div>
          <div style="font-size:13px;color:#ccc">${date===today()?"Today ✦":date}</div>
          <div style="font-size:11px;color:${sub?.color||"#555"}">${sub?.icon||""} ${esc(sub?.name||"—")}</div>
        </div>
      </div>
      <div style="font-size:22px;font-weight:bold;color:#FFE66D">${data.hours}h</div>
    </div>`;
  }).join("");

  return`<div class="fade-in">
    <div style="font-size:18px;font-weight:bold;margin-bottom:20px">📝 Daily Study Log</div>
    <div class="card" style="margin-bottom:14px">
      <div class="section-label">HOW ARE YOU FEELING TODAY?</div>
      <div style="display:flex;gap:8px;margin-bottom:6px">${moodBtns}</div>
      <div style="font-size:12px;color:#555;margin-top:4px">${MOOD_LABELS[state.mood]}</div>
    </div>
    <div class="card" style="margin-bottom:14px">
      <div class="section-label">HOURS STUDIED TODAY</div>
      <div style="display:flex;align-items:center;gap:16px">
        <input type="range" min="0" max="12" step="0.5" value="${state.hoursToday}" oninput="setHours(this.value)" style="flex:1"/>
        <span id="hours-display" style="font-size:28px;font-weight:bold;color:#FFE66D;min-width:56px;text-shadow:0 0 20px #FFE66D44">${state.hoursToday}h</span>
      </div>
    </div>
    <div class="card" style="margin-bottom:14px">
      <div class="section-label">MAIN SUBJECT TODAY</div>
      <div class="flex-wrap">${subBtns}</div>
    </div>
    <button class="btn-gold" style="width:100%;padding:14px;font-size:15px;margin-bottom:28px" onclick="logToday()">💾 Save Today's Log</button>
    <div class="section-label">Study History</div>
    ${Object.keys(state.studyLog).length===0
      ?`<div style="color:#333;text-align:center;padding:32px;font-size:13px">No logs yet. Start studying! 💪</div>`
      :history}
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// FILE FUNCTIONS
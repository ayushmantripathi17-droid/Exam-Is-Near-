// ══════════════════════════════════════════════════════════════
// RENDER
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
  // Hide static landing screen once JS app takes over
  const sl=document.getElementById('static-landing');
  if(sl) sl.style.display='none';
  const c=document.getElementById("main-content");
  const views={dashboard:renderDashboard,subjects:renderSubjects,alarms:renderAlarms,files:renderFiles,sync:renderSync,log:renderLog,about:renderAbout,pomodoro:renderPomodoro,flashcards:renderFlashcards,quiz:renderQuiz,analytics:renderAnalytics,ai:renderAI,profile:renderProfile,admin:renderAdmin,neetjee:renderNeetJee};
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
        <div style="font-size:11px;color:#555;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(currentUser.email||"")}</div>
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
  const nextExam=getSubjects().filter(s=>getDaysLeft(s.exam)!==null&&getDaysLeft(s.exam)>=0).slice().sort((a,b)=>getDaysLeft(a.exam)-getDaysLeft(b.exam))[0]||null;

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
        <div style="font-size:12px;color:#666">${esc(nextExam.exam)}${getDaysLeft(nextExam.exam)!==null?' · '+getDaysLeft(nextExam.exam)+' days away':''}</div>
      </div>
      ${getDaysLeft(nextExam.exam)!==null?`<div style="font-size:36px;font-weight:bold;color:#FF6B35">${getDaysLeft(nextExam.exam)}d</div>`:''}
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
      return `<div class="topic-row" onclick="toggleTopic('${sub.id}','${unit.id}',${idx})" style="--acc:${sub.color}">
        <div class="cb ${isDone?"done":""}">${isDone?"✓":""}</div>
        <span style="font-size:13px;color:${isDone?"#444":"#bbb"};text-decoration:${isDone?"line-through":"none"};transition:all 0.3s">${esc(topic)}</span>
        ${isDone?`<span style="margin-left:auto;font-size:10px;color:${sub.color}">✓</span>`:""}
      </div>`;
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
    <div class="flex-wrap" style="margin-bottom:20px">${subBtns}${activeCourse==='cbse12'?`<button onclick="showCourseSelector('cbse_group','cbse12_group')" style="background:#FFE66D22;border:1px solid #FFE66D44;color:#FFE66D;border-radius:20px;padding:6px 13px;font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s" title="Change stream">🔄 ${CBSE12_STREAMS[cbse12Stream]?.label?.split('—')[0]?.trim()||'Change Stream'}</button>`:''}</div>
    <div class="card card-glow" style="--glow-color:${sub.color}33;margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:22px;font-weight:bold">${sub.icon} ${esc(sub.name)}</div>
          <div style="font-size:11px;color:#555;margin-top:3px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          Exam:
          <input value="${esc(getExamDate(sub.id))}" onchange="setExamDate('${sub.id}',this.value)"
            style="background:#1a1a2a;border:1px solid #2a2a3a;border-radius:6px;padding:2px 7px;font-size:11px;color:${sub.color};width:90px;font-family:inherit"
            title="Click to edit exam date (e.g. 18 May)"/>
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
// ══════════════════════════════════════════════════════════════
function getFileIcon(type,name){
  if(!type&&!name) return "📄";
  const ext=(name||"").split(".").pop().toLowerCase();
  if(type==="drive-folder") return "📁";
  if(type==="drive-link") return "📎";
  if(type.includes("pdf")||ext==="pdf") return "📕";
  if(type.includes("image")||["jpg","jpeg","png","gif","webp"].includes(ext)) return "🖼️";
  if(type.includes("spreadsheet")||["xlsx","xls","csv"].includes(ext)) return "📊";
  if(type.includes("word")||ext==="docx") return "📘";
  if(type.includes("presentation")||ext==="pptx") return "📙";
  if(type.includes("text")||ext==="txt") return "📄";
  if(type.includes("video")||["mp4","mov"].includes(ext)) return "🎬";
  if(type.includes("audio")||["mp3","wav"].includes(ext)) return "🎵";
  if(ext==="zip"||ext==="rar") return "🗜️";
  return "📁";
}

function formatSize(bytes){
  if(bytes<1024) return bytes+"B";
  if(bytes<1024*1024) return (bytes/1024).toFixed(1)+"KB";
  return (bytes/(1024*1024)).toFixed(1)+"MB";
}

function getStorageUsedMB(){
  // Legacy function - kept for compat. Now using IndexedDB
  try{
    const fileBytes=state.files.reduce((s,f)=>s+(f.size||0),0);
    return (fileBytes/(1024*1024)).toFixed(1);
  }catch(e){return 0;}
}



async function loadAdminMaterials(){
  if(!db) return;
  try{
    const {collection, getDocs, query, orderBy}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const q=query(collection(db,"study-materials"),orderBy("createdAt","desc"));
    const snap=await getDocs(q);
    const adminMats=[];
    snap.forEach(d=>{
      const m=d.data();
      adminMats.push({
        id:"admin_"+d.id,
        name:m.title||m.fileName||"Untitled",
        fileName:m.fileName||"",
        type:m.type||"",
        size:0,
        created:m.createdAt?new Date(m.createdAt).toLocaleDateString():"",
        downloadURL:m.url||null,
        subjectId:m.course||m.subject||"general",
        note:m.description||"",
        proOnly:!!m.proOnly,
        shared:true,
        adminMaterial:true
      });
    });
    // Remove old admin materials, then add fresh ones
    state.files=state.files.filter(f=>!f.adminMaterial);
    state.files=[...adminMats,...state.files];
    // No render() here — debounced render() in callers handles it
  }catch(e){console.warn("loadAdminMaterials error:",e);}
}


async function loadSharedFiles(){
  if(!db) return; // works even without login — Firestore public read
  try{
    const {collection, getDocs, query, orderBy}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const q=query(collection(db,"shared-files"),orderBy("created","desc"));
    const snap=await getDocs(q);
    const sharedFiles=[];
    snap.forEach(doc=>{
      const d=doc.data();
      // Always refresh shared files from Firestore (admin may have updated)
      if(!state.files.find(f=>f.id===doc.id && f.shared)){
        // Ensure drive folder links have correct fields
        const fileEntry={...d, id:doc.id, shared:true};
        if(fileEntry.type==="drive-folder"){
          fileEntry.isDriveLink=true;
          fileEntry.driveLink=fileEntry.driveLink||fileEntry.downloadURL||fileEntry.url||"";
        }
        sharedFiles.push(fileEntry);
      }
    });
    if(sharedFiles.length>0){
      // Replace old shared files with fresh ones from Firestore
      state.files=[...sharedFiles,...state.files.filter(f=>!f.shared)];
      // No render() here — debounced render() in callers handles it
    }
  }catch(e){console.warn("loadSharedFiles error:",e);}
}

// Load this signed-in user's own uploaded files from Firestore
async function loadUserFiles(){
  if(!db||!currentUser) return;
  try{
    const {collection,getDocs,query,orderBy}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const q=query(
      collection(db,"user-files",currentUser.uid,"files"),
      orderBy("created","desc")
    );
    const snap=await getDocs(q);
    const cloudFiles=[];
    snap.forEach(d=>{ cloudFiles.push({...d.data(),id:d.id,synced:true}); });
    // Cloud is authoritative: merge cloud files in, keep local-only (browser-only) files
    const localOnly=state.files.filter(f=>!f.shared&&!f.adminMaterial&&!cloudFiles.find(c=>c.id===f.id));
    const shared=state.files.filter(f=>f.shared||f.adminMaterial);
    state.files=[...shared,...cloudFiles,...localOnly];
    idbSet("files",state.files.map(f=>({...f,data:null}))).catch(()=>{});
    LS("files",state.files.map(f=>({...f,data:null})));
    // No render() here — caller renders after this resolves
  }catch(e){console.warn("loadUserFiles error:",e);}
}

async function deleteUserFileFromCloud(id){
  if(!db||!currentUser) return;
  try{
    const {doc,deleteDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await deleteDoc(doc(db,"user-files",currentUser.uid,"files",id));
  }catch(e){console.warn("deleteUserFile error:",e);}
}

async function handleFileSelect(files){
  const sid=document.getElementById("file-sub-select")?.value||"cpp";

  // ── Storage strategy: Free → Firebase Storage, Pro → Google Drive ──
  const pro = await isProUser();
  const FREE_FILE_LIMIT = 5;

  for(const file of Array.from(files)){
    if(file.size>15*1024*1024*1024){showToast("⚠️ "+file.name+" exceeds 15GB limit","alarm");continue;}

    if(!pro && state.files.filter(f=>!f.adminFile && !f.shared).length >= FREE_FILE_LIMIT){
      showToast("⭐ Free plan allows up to "+FREE_FILE_LIMIT+" files. Upgrade to Pro for Google Drive storage!","alarm");
      openProModal();
      break;
    }

    const fileObj={
      id:genId(), name:file.name, size:file.size,
      type:file.type, subjectId:sid,
      created:today(), note:"",
      uploadedBy:currentUser?.displayName||"You",
      ownerId:currentUser?.uid||null,
      shared:false
    };

    if(pro){
      // PRO: Upload to Google Drive via API
      showToast("☁️ Uploading "+file.name+" to Google Drive…","info");
      try{
        const token=await getGoogleAccessToken();
        if(!token) throw new Error("Not signed in with Google");

        // 1. Create file metadata
        const meta={name:file.name,mimeType:file.type||"application/octet-stream"};
        const form=new FormData();
        form.append("metadata",new Blob([JSON.stringify(meta)],{type:"application/json"}));
        form.append("file",file);

        const res=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink",{
          method:"POST",
          headers:{Authorization:"Bearer "+token},
          body:form
        });
        if(!res.ok) throw new Error("Drive upload failed: "+res.status);
        const driveFile=await res.json();

        // 2. Make file publicly readable
        await fetch(`https://www.googleapis.com/drive/v3/files/${driveFile.id}/permissions`,{
          method:"POST",
          headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
          body:JSON.stringify({role:"reader",type:"anyone"})
        });

        fileObj.downloadURL=`https://drive.google.com/uc?export=download&id=${driveFile.id}`;
        fileObj.driveId=driveFile.id;
        fileObj.driveViewURL=driveFile.webViewLink;
        fileObj.storage="gdrive";

        if(db && currentUser){
          const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          await setDoc(doc(db,"user-files",currentUser.uid,"files",fileObj.id), fileObj);
        }
        state.files.unshift(fileObj);
        LS("files", state.files.map(f=>({...f,data:null})));
        idbSet("files", state.files.map(f=>({...f,data:null}))).catch(()=>{});
        showToast("✅ "+file.name+" uploaded to Google Drive 🚗","success");
        spawnStars(); render(); continue;
      }catch(err){
        console.warn("Google Drive upload failed:",err);
        showToast("⚠️ Google Drive upload failed — saving to Firebase Storage","alarm");
      }
    }

    // FREE (or Pro fallback): Upload to Firebase Storage
    if(storage && currentUser){
      showToast("☁️ Uploading "+file.name+"…","info");
      try{
        const {ref,uploadBytesResumable,getDownloadURL}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js");
        const path=`user-files/${currentUser.uid}/${fileObj.id}_${file.name}`;
        const sRef=ref(storage,path);
        const url=await new Promise((resolve,reject)=>{
          const task=uploadBytesResumable(sRef,file);
          task.on("state_changed",
            snap=>{const pct=Math.round(snap.bytesTransferred/snap.totalBytes*100);if(pct>0&&pct<100)showToast("☁️ "+file.name+" — "+pct+"%","info");},
            reject,
            async()=>resolve(await getDownloadURL(task.snapshot.ref))
          );
        });
        fileObj.downloadURL=url;
        fileObj.storage="firebase";
        fileObj.synced=true;

        if(db){
          const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          await setDoc(doc(db,"user-files",currentUser.uid,"files",fileObj.id), fileObj);
        }
        state.files.unshift(fileObj);
        LS("files", state.files.map(f=>({...f,data:null})));
        idbSet("files", state.files.map(f=>({...f,data:null}))).catch(()=>{});
        showToast("✅ "+file.name+" uploaded ☁️","success");
        spawnStars(); render(); continue;
      }catch(err){
        console.warn("Firebase Storage upload failed:",err);
        showToast("⚠️ Cloud upload failed — saving locally","alarm");
      }
    }

    // Last resort: local browser storage
    const reader=new FileReader();
    reader.onload=e=>{
      fileObj.data=e.target.result;
      state.files.unshift(fileObj);
      try{S("files",state.files);}catch(err2){
        state.files[0].data=null;
        state.files[0].note="⚠️ File too large to store offline.";
        try{S("files",state.files);}catch(e2){state.files.shift();}
        showToast("⚠️ Storage full — metadata only","alarm");
        render(); return;
      }
      showToast("📁 "+file.name+" saved locally · Sign in to enable cloud backup","info");
      spawnStars(); render();
    };
    reader.readAsDataURL(file);
  }
}

function handleFolderSelect(files){
  const allFiles=Array.from(files).filter(f=>{
    // Skip hidden/system files (e.g. .DS_Store)
    const name=f.name||"";
    return !name.startsWith(".");
  });
  if(allFiles.length===0){showToast("⚠️ No valid files found in folder","alarm");return;}
  // Show how many files were detected
  showToast("📂 Loading "+allFiles.length+" file(s) from folder…","info");
  handleFileSelect(allFiles);
}

function deleteFile(id){
  if(!confirm("Delete this file?")) return;
  const f=state.files.find(f=>f.id===id);
  state.files=state.files.filter(f=>f.id!==id);
  S("files",state.files);
  // Also remove from Firestore if it was a synced user file
  if(f && f.synced && !f.shared) deleteUserFileFromCloud(id);
  showToast("🗑️ File deleted","info");
  render();
}

function updateFileNote(id,note){
  const f=state.files.find(f=>f.id===id);
  if(f){f.note=note;S("files",state.files);}
}

function updateFileSubject(id,sid){
  const f=state.files.find(f=>f.id===id);
  if(f){f.subjectId=sid;S("files",state.files);render();}
}

function openPreview(id){
  const f=state.files.find(f=>f.id===id);
  if(!f) return;
  if(!f.data && !f.downloadURL){showToast("⚠️ File data not available","alarm");return;}

  // Open in browser's native viewer
  if(f.downloadURL||f.driveViewURL){
    let url=f.driveViewURL||f.downloadURL;
    window.open(url,"_blank");
    return;
  }
  const overlay=document.getElementById("preview-overlay");
  document.getElementById("preview-name").textContent=f.name;
  document.getElementById("preview-meta").textContent=formatSize(f.size)+" · Uploaded "+f.created;
  const body=document.getElementById("preview-body");
  const sub=getSubjects().find(s=>s.id===f.subjectId);

  // Download button
  const dlBtn=document.getElementById("preview-download");
  const fileURL=f.downloadURL||f.data;
  dlBtn.onclick=()=>{
    const a=document.createElement("a");
    a.href=fileURL; a.download=f.name; a.target="_blank"; a.click();
  };

  const refName=f.fileName||f.name;
  // Also try extracting extension from the downloadURL itself (Firebase Storage paths contain filename)
  const urlExt=f.downloadURL?(f.downloadURL.split("?")[0].split(".").pop()||"").toLowerCase():"";
  const ext0=([refName.split(".").pop()||""].map(e=>e.toLowerCase())[0]==="notes"||!refName.includes("."))?urlExt:(refName.split(".").pop()||"").toLowerCase();
  // Admin type field mapping: "pdf"/"pyq" → pdf, "notes" with docx url → docx
  const adminTypePDF=["pdf","pyq"].includes(f.type);
  const adminTypeDoc=f.type==="notes";
  if(f.type.includes("image")||["jpg","jpeg","png","gif","webp"].includes(ext0)){
    body.innerHTML=`<img src="${fileURL}" style="max-width:100%;max-height:65vh;border-radius:8px;object-fit:contain"/>`;
  } else if(f.type.includes("pdf")||ext0==="pdf"||adminTypePDF||urlExt==="pdf"){
    // Render PDF using PDF.js — fetch the file as ArrayBuffer to bypass iframe/CORS restrictions
    body.innerHTML=`
      <div id="pdf-loading" style="text-align:center;padding:40px;color:#888">
        <div style="font-size:32px;margin-bottom:12px">⏳</div>
        <div>Loading PDF...</div>
      </div>
      <div id="pdf-canvas-container" style="overflow-y:auto;max-height:65vh;background:#1a1a2e;border-radius:8px;display:none;padding:8px"></div>
      <div id="pdf-error" style="display:none;text-align:center;padding:32px">
        <div style="font-size:48px;margin-bottom:12px">📄</div>
        <div style="color:#ccc;font-weight:bold;margin-bottom:8px">${esc(f.name)}</div>
        <div style="color:#888;font-size:13px;margin-bottom:16px">Preview unavailable in browser.</div>
        <button onclick="window.open('${fileURL}','_blank')" style="background:#4ECDC4;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer;margin-right:8px">↗ Open in New Tab</button>
      </div>`;
    renderPDFPreview(fileURL, f.name);
  } else if(f.type.includes("text")||f.name.endsWith(".txt")||f.name.endsWith(".csv")){
    // Decode text
    try{
      const base64=f.data.split(",")[1];
      const text=atob(base64);
      body.innerHTML=`<pre style="font-size:12px;color:#aaa;text-align:left;white-space:pre-wrap;max-height:65vh;overflow:auto;padding:16px;background:#0a0a12;border-radius:8px;width:100%">${esc(text.slice(0,8000))}${text.length>8000?"...(truncated)":""}</pre>`;
    }catch(e){body.innerHTML=`<div style="color:#888">Cannot preview this file type.<br>Click Download to open it.</div>`;}
  } else {
    const icon=getFileIcon(f.type,f.name);
    const ext=ext0;
    const officeExts=["doc","docx","ppt","pptx","xls","xlsx"];
    if((ext==="docx"||urlExt==="docx"||adminTypeDoc) && f.downloadURL){
      body.innerHTML=`<div id="docx-loading" style="text-align:center;padding:40px;color:#888">
        <div style="font-size:32px;margin-bottom:12px">⏳</div>
        <div>Loading document...</div>
      </div>
      <div id="docx-content" style="display:none;text-align:left;max-height:65vh;overflow:auto;background:#fff;color:#222;padding:24px 28px;border-radius:8px;font-size:14px;line-height:1.6"></div>
      <div id="docx-error" style="display:none;text-align:center;padding:32px">
        <div style="font-size:48px;margin-bottom:12px">${icon}</div>
        <div style="color:#ccc;font-weight:bold;margin-bottom:8px">${esc(f.name)}</div>
        <div style="color:#888;font-size:13px;margin-bottom:16px">Couldn't render this document.</div>
        <button onclick="window.open('${fileURL}','_blank')" style="background:#4ECDC4;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer">↗ Open in New Tab</button>
      </div>`;
    renderDocxPreview(fileURL);
    } else if((["pptx","ppt","xlsx","xls"].includes(ext)||["pptx","ppt","xlsx","xls"].includes(urlExt)) && f.downloadURL){
      body.innerHTML=`<div style="text-align:center">
        <iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(f.downloadURL)}" style="width:100%;height:65vh;border:none;border-radius:8px;background:#fff" frameborder="0"></iframe>
      </div>`;
    } else {
      let openURL=fileURL;
      let openLabel="↗ Open in New Tab";
      if(officeExts.includes(ext) && f.downloadURL){
        openURL=`https://docs.google.com/viewer?url=${encodeURIComponent(f.downloadURL)}&embedded=true`;
        openLabel="↗ Open in Viewer";
      }
      body.innerHTML=`<div style="text-align:center;padding:32px">
        <div style="font-size:80px;margin-bottom:16px">${icon}</div>
        <div style="font-size:16px;font-weight:bold;color:#ccc;margin-bottom:8px">${esc(f.name)}</div>
        <div style="font-size:13px;color:#555;margin-bottom:20px">${formatSize(f.size)} · ${f.type||"Unknown type"}</div>
        <div style="font-size:12px;color:#444;margin-bottom:16px">Preview not available in browser.</div>
        <button onclick="window.open('${openURL}','_blank')" style="background:#4ECDC4;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer">${openLabel}</button>
      </div>`;
    }
  }
  overlay.classList.add("show");
}

function closePreview(){
  document.getElementById("preview-overlay").classList.remove("show");
  document.getElementById("preview-body").innerHTML="";
}

async function getGoogleAccessToken(){
  try{
    const {GoogleAuthProvider,signInWithPopup}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    const provider=new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/drive.file");
    const result=await signInWithPopup(auth,provider);
    const credential=GoogleAuthProvider.credentialFromResult(result);
    return credential?.accessToken||null;
  }catch(e){
    console.warn("Google Drive auth failed:",e);
    return null;
  }
}

async function renderDocxPreview(fileURL){
  const loading=document.getElementById("docx-loading");
  const content=document.getElementById("docx-content");
  const errorEl=document.getElementById("docx-error");
  try{
    if(!window.mammoth){
      await new Promise((resolve,reject)=>{
        const s=document.createElement("script");
        s.src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
        s.onload=resolve; s.onerror=reject;
        document.head.appendChild(s);
      });
    }
    let arrayBuffer;
    if(fileURL.startsWith("data:")){
      const base64=fileURL.split(",")[1];
      const bin=atob(base64);
      const bytes=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
      arrayBuffer=bytes.buffer;
    } else {
      const resp=await fetch(fileURL);
      if(!resp.ok) throw new Error("fetch failed");
      arrayBuffer=await resp.arrayBuffer();
    }
    const result=await window.mammoth.convertToHtml({arrayBuffer});
    // SECURITY: sanitize docx-converted HTML before injecting into DOM
    const rawHtml = result.value || "<p style='color:#888'>No content found.</p>";
    const safeHtml = window.DOMPurify ? DOMPurify.sanitize(rawHtml, {USE_PROFILES:{html:true}}) : rawHtml;
    content.innerHTML=safeHtml;
    loading.style.display="none";
    content.style.display="block";
  }catch(e){
    loading.style.display="none";
    errorEl.style.display="block";
  }
}

async function renderPDFPreview(fileURL, fileName){
  // [FIX C11] Dynamically load PDF.js if not already present
  if(!window.pdfjsLib){
    await new Promise((res, rej)=>{
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload = ()=>{ window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; res(); };
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  // original body below
  try{
    // Dynamically load PDF.js from CDN
    if(!window.pdfjsLib){
      await new Promise((resolve,reject)=>{
        const s=document.createElement("script");
        s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        s.onload=resolve; s.onerror=reject;
        document.head.appendChild(s);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc=
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }

    // Load PDF — try fetch first (works for same-origin + CORS-enabled URLs),
    // fall back to passing URL directly to PDF.js
    let pdfLoadParam;
    if(fileURL.startsWith("http")){
      try{
        const resp=await fetch(fileURL,{mode:"cors"});
        if(resp.ok){
          pdfLoadParam={data:await resp.arrayBuffer()};
        } else {
          pdfLoadParam={url:fileURL};
        }
      }catch(e){
        // CORS fetch failed — pass URL directly to PDF.js which uses its own fetch
        pdfLoadParam={url:fileURL};
      }
    } else {
      // Base64 data URL
      const base64=fileURL.split(",")[1];
      const binary=atob(base64);
      const arr=new Uint8Array(binary.length);
      for(let i=0;i<binary.length;i++) arr[i]=binary.charCodeAt(i);
      pdfLoadParam={data:arr};
    }

    const pdf=await window.pdfjsLib.getDocument(pdfLoadParam).promise;
    const container=document.getElementById("pdf-canvas-container");
    const loading=document.getElementById("pdf-loading");
    if(!container||!loading) return; // preview closed

    loading.style.display="none";
    container.style.display="block";
    container.innerHTML=`<div style="font-size:11px;color:#555;text-align:right;margin-bottom:6px;padding:0 4px">${pdf.numPages} page${pdf.numPages>1?"s":""}</div>`;

    // Render all pages (cap at 20 for performance)
    const maxPages=Math.min(pdf.numPages,20);
    for(let pageNum=1;pageNum<=maxPages;pageNum++){
      const page=await pdf.getPage(pageNum);
      const viewport=page.getViewport({scale:1.4});
      const canvas=document.createElement("canvas");
      canvas.width=viewport.width;
      canvas.height=viewport.height;
      canvas.style.cssText="display:block;width:100%;margin-bottom:6px;border-radius:4px;background:#fff";
      container.appendChild(canvas);
      await page.render({canvasContext:canvas.getContext("2d"),viewport}).promise;
    }
    if(pdf.numPages>20){
      const note=document.createElement("div");
      note.style.cssText="text-align:center;color:#888;font-size:12px;padding:12px";
      note.textContent=`Showing first 20 of ${pdf.numPages} pages. Click Open in New Tab to view all.`;
      container.appendChild(note);
    }
    // Add open-in-new-tab button at bottom
    const openBtn=document.createElement("div");
    openBtn.style.cssText="text-align:center;padding:12px 0";
    openBtn.innerHTML=`<button onclick="window.open('${fileURL}','_blank')" style="background:none;border:1px solid #4ECDC433;color:#4ECDC4;padding:8px 18px;border-radius:8px;font-family:inherit;font-size:12px;cursor:pointer">↗ Open in New Tab</button>`;
    container.appendChild(openBtn);
  }catch(err){
    const loading=document.getElementById("pdf-loading");
    const errDiv=document.getElementById("pdf-error");
    if(loading) loading.style.display="none";
    if(errDiv) errDiv.style.display="block";
    console.warn("PDF render error:",err);
  }
}

// ── RENDER FILES ─────────────────────────────────────────────
async function renderFiles(){
  const pro = await isProUser();
  const filtered=state.files.filter(f=>{
    if(state.fileSubFilter!=="all"&&f.subjectId!==state.fileSubFilter) return false;
    if(state.fileSearch){const q=state.fileSearch.toLowerCase();if(!f.name.toLowerCase().includes(q)&&!(f.note||"").toLowerCase().includes(q)) return false;}
    return true;
  });

  // Estimate storage used
  const filesSizeBytes=state.files.reduce((s,f)=>s+(f.size||0),0);
  const usedMB=(filesSizeBytes/(1024*1024)).toFixed(1);
  const limitMB=pro?25*1024:200; // Pro: 25GB; Free: ~200MB local limit
  const usedPct=Math.min(100,Math.round((filesSizeBytes/(1024*1024*limitMB))*100));
  const storageColor=usedPct>80?"#FF6B35":usedPct>60?"#FFE66D":"#06D6A0";

  // Pro cloud storage banner vs Free local banner
  const storageBanner = pro
    ? `<div style="background:#061208;border:1px solid #06D6A022;border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
        <span style="font-size:18px">☁️</span>
        <div style="flex:1">
          <div style="font-size:11px;font-weight:700;color:#06D6A0">25 GB Cloud Storage — PRO ⭐</div>
          <div style="font-size:10px;color:#444">Files synced to cloud · ${usedMB} MB used</div>
          <div class="storage-bar" style="margin-top:6px"><div class="storage-fill" style="width:${usedPct}%;background:${storageColor}"></div></div>
        </div>
      </div>`
    : `<div onclick="openProModal()" style="background:#120f00;border:1px solid #FFE66D22;border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;cursor:pointer" onmouseover="this.style.borderColor='#FFE66D44'" onmouseout="this.style.borderColor='#FFE66D22'">
        <span style="font-size:18px">📁</span>
        <div style="flex:1">
          <div style="font-size:11px;font-weight:700;color:#FFE66D">Local Storage Only <span style="font-size:9px;background:#1a1a2a;color:#555;border-radius:6px;padding:1px 7px;margin-left:4px">FREE</span></div>
          <div style="font-size:10px;color:#444">Up to 5 files · ${usedMB} MB used · <span style="color:#FFE66D">Upgrade for 25 GB cloud ☁️</span></div>
          <div class="storage-bar" style="margin-top:6px"><div class="storage-fill" style="width:${Math.min(100,(state.files.length/5)*100)}%;background:#FFE66D"></div></div>
          <div style="font-size:9px;color:#444;margin-top:3px">${state.files.length}/5 files used</div>
        </div>
        <div style="font-size:11px;font-weight:700;color:#FFE66D;flex-shrink:0">Get Pro →</div>
      </div>`;


  const subFilterBtns=`<div class="flex-wrap" style="margin-bottom:16px">
    <button class="pill-btn" onclick="state.fileSubFilter='all';render()" style="background:${state.fileSubFilter==="all"?"#FFE66D":"#0f0f18"};color:${state.fileSubFilter==="all"?"#08080f":"#666"};border-color:${state.fileSubFilter==="all"?"#FFE66D":"#222"}">📁 All</button>
    ${getSubjects().map(s=>`<button class="pill-btn" onclick="state.fileSubFilter='${s.id}';render()" style="background:${s.id===state.fileSubFilter?s.color:"#0f0f18"};color:${s.id===state.fileSubFilter?"#08080f":"#666"};border-color:${s.id===state.fileSubFilter?s.color:"#222"}">${s.icon} ${esc(s.name)}</button>`).join("")}
  </div>`;

  const fileCards=filtered.length===0?`
    <div class="empty-state">
      <div style="font-size:48px;margin-bottom:14px">📂</div>
      <div style="font-size:14px;margin-bottom:6px">No files here yet</div>
      <div style="font-size:12px;color:#444">Upload PDFs, images, notes or spreadsheets above</div>
    </div>`:
    `<div class="file-grid">${filtered.map((f,i)=>{
      const icon=getFileIcon(f.type,f.name);
      const sub=getSubjects().find(s=>s.id===f.subjectId);
      const isImg=f.type&&f.type.includes("image")&&f.data;
      return`<div class="file-card" style="animation:fadeInUp 0.3s ease ${i*0.04}s both">
        <div onclick="openPreview('${f.id}')">
          ${isImg
            ?`<img src="${f.data}" class="file-thumb" alt="${esc(f.name)}"/>`
            :`<div class="file-thumb-placeholder" style="background:linear-gradient(135deg,${sub?.color||"#222"}22,#0a0a18)">${icon}</div>`}
        </div>
        <div class="file-info">
          <div class="file-name" title="${esc(f.name)}">${esc(f.name)}</div>
          <div class="file-meta">${formatSize(f.size)} · <span style="color:${sub?.color||"#444"}">${sub?.icon||""} ${esc(sub?.name||"")}</span></div>
          <div class="file-meta" style="margin-top:2px">${f.created}</div>
          <div style="margin-top:4px;font-size:10px">
            ${(f.isDriveLink||f.type==="drive-folder")
              ?`<a href="${esc(f.driveLink||f.downloadURL||f.url||"")}" target="_blank" onclick="event.stopPropagation()" style="color:#4ECDC4;text-decoration:none;display:inline-flex;align-items:center;gap:4px;background:#0a1a1a;border:1px solid #4ECDC433;padding:3px 8px;border-radius:6px">📁 Open Drive Folder ↗</a>`
              :f.shared&&f.downloadURL
                ?`<span style="color:#06D6A0">☁️ Shared</span> <a href="${esc(f.downloadURL)}" target="_blank" onclick="event.stopPropagation()" style="color:#4ECDC4;text-decoration:none">↗ Open</a>`
              :f.downloadURL&&f.synced
                ?`<span style="color:#06D6A0">🔄 Synced</span> <a href="${esc(f.downloadURL)}" target="_blank" onclick="event.stopPropagation()" style="color:#4ECDC4;text-decoration:none">↗ Open</a>`
              :f.downloadURL
                ?`<span style="color:#06D6A0">☁️ Cloud</span> <a href="${esc(f.downloadURL)}" target="_blank" onclick="event.stopPropagation()" style="color:#4ECDC4;text-decoration:none">↗ Open</a>`
              :f.data
                ?`<span style="color:#FF6B35">⚠️ Browser only</span>`
                :`<span style="color:#333">—</span>`}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
            ${(f.isDriveLink||f.type==="drive-folder")
              ?`<a href="${esc(f.driveLink||f.downloadURL||"")}" target="_blank" onclick="event.stopPropagation()" style="background:none;border:1px solid #4ECDC433;color:#4ECDC4;padding:4px 10px;border-radius:6px;font-size:10px;text-decoration:none">↗ Open</a>`
              :`<button onclick="openPreview('${f.id}')" style="background:none;border:1px solid #2a2a3a;color:#888;padding:4px 10px;border-radius:6px;font-family:inherit;font-size:10px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor='#555'" onmouseout="this.style.borderColor='#2a2a3a'">👁 View</button>`}
            ${f.adminMaterial?"":`<button onclick="deleteFile('${f.id}')" style="background:none;border:none;color:#553333;cursor:pointer;font-size:16px;padding:2px 6px;border-radius:4px;transition:all 0.2s" onmouseover="this.style.color='#cc5555'" onmouseout="this.style.color='#553333'">🗑️</button>`}
          </div>
        </div>
      </div>`;
    }).join("")}</div>`;

  return`<div class="fade-in">
    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:18px;font-weight:bold">📁 Study Material</div>
        <div style="font-size:11px;color:#444;margin-top:2px">${state.files.length} file${state.files.length!==1?"s":""} · ${usedMB} MB used · ${pro?"☁️ Cloud storage":"📁 Local · max 5 files"}</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-gold" onclick="document.getElementById('file-input').click()">⬆ Upload Files</button>
        <button class="btn-ghost" onclick="document.getElementById('folder-input').click()" style="font-size:12px">📁 Upload Folder</button>
      </div>
    </div>

    <!-- Storage meter -->
    ${storageBanner}

    <!-- Drive link import -->
    <div class="card" style="margin-bottom:14px;border-color:#4ECDC433">
      <div style="font-size:13px;font-weight:bold;color:#4ECDC4;margin-bottom:10px">📎 Import from Google Drive</div>
      <div style="font-size:12px;color:#555;margin-bottom:12px">Paste a Google Drive share link — accessible on any device.</div>
      <div style="display:grid;gap:8px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <input id="drive-link-name" placeholder="File name (e.g. C++ Notes.pdf)" style="margin:0;font-size:12px"/>
          <select id="drive-link-sub" style="margin:0;font-size:12px">${getSubjects().map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join("")}</select>
        </div>
        <div style="display:flex;gap:8px">
          <input id="drive-link-input" placeholder="https://drive.google.com/file/d/..." style="flex:1;margin:0;font-size:12px"/>
          <button class="btn-gold" onclick="addDriveLink()" style="padding:10px 16px;white-space:nowrap;font-size:12px">+ Add</button>
        </div>
      </div>
    </div>

    <!-- Drop zone -->
    <div class="drop-zone" id="drop-zone"
      ondragover="event.preventDefault();this.classList.add('drag-over')"
      ondragleave="this.classList.remove('drag-over')"
      ondrop="event.preventDefault();this.classList.remove('drag-over');handleFileSelect(event.dataTransfer.files)">
      <div style="font-size:42px;margin-bottom:12px">📂</div>
      <div style="font-size:15px;font-weight:bold;color:#ccc;margin-bottom:6px">Drop files here or click to browse</div>
      <div style="font-size:12px;color:#444;margin-bottom:14px">PDF, Images, Excel, Word, CSV, TXT · ${pro?"Uploaded to cloud · Synced across all devices ☁️":"Saved locally · Upgrade to Pro for cloud backup ☁️"}</div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:14px">
        <button class="btn-gold" onclick="event.stopPropagation();document.getElementById('file-input').click()" style="padding:9px 18px;font-size:12px">📄 Upload Files</button>
        <button class="btn-ghost" onclick="event.stopPropagation();document.getElementById('folder-input').click()" style="padding:9px 18px;font-size:12px">📁 Upload Folder</button>
      </div>
      <div style="margin-top:4px;display:flex;align-items:center;gap:10px;justify-content:center;flex-wrap:wrap">
        <div style="font-size:11px;color:#333">Assign to subject:</div>
        <select id="file-sub-select" onclick="event.stopPropagation()" style="width:auto;padding:6px 10px;font-size:12px">
          ${getSubjects().map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join("")}
        </select>
      </div>
    </div>

    <!-- Filters + Search -->
    <div style="margin:18px 0 10px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <input placeholder="🔍 Search files..." oninput="state.fileSearch=this.value;render()" value="${esc(state.fileSearch)}" style="max-width:220px;padding:8px 12px;font-size:12px"/>
    </div>
    ${subFilterBtns}

    <!-- Supported formats info -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      ${[["📕","PDF"],["🖼️","Images"],["📊","Excel/CSV"],["📘","Word"],["📙","PPT"],["📄","Text"]].map(([ic,lb])=>`
        <div style="background:#111;border:1px solid #1e1e2e;border-radius:8px;padding:5px 10px;font-size:11px;color:#555">${ic} ${lb}</div>`).join("")}
    </div>

    <!-- File cards -->
    ${fileCards}

    <!-- Sync status info -->
    <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:12px;padding:16px;margin-top:16px">
      <div style="font-size:11px;color:#444;letter-spacing:1px;margin-bottom:12px">☁️ FILE SYNC</div>
      ${currentUser
        ? `<div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:22px;flex-shrink:0">✅</span>
            <div style="font-size:12px;color:#888;line-height:1.9">
              Files you upload are synced to your account via <b style="color:#06D6A0">Firebase</b>.<br>
              Sign in on any device — your files will appear automatically. <b style="color:#EDE8E0">No browser limits.</b>
            </div>
           </div>`
        : `<div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:22px;flex-shrink:0">⚠️</span>
            <div>
              <div style="font-size:12px;color:#888;line-height:1.9;margin-bottom:10px">
                Files are stored locally but <b style="color:#FF6B35">not synced across devices</b> until you sign in.<br>
                Sign in with Google to link your uploads to your account.
              </div>
              <button onclick="googleSignIn()" style="background:linear-gradient(135deg,#4285F4,#34A853);border:none;color:#fff;padding:8px 18px;border-radius:8px;font-family:inherit;font-size:12px;cursor:pointer;font-weight:bold">
                🔐 Sign in to sync files
              </button>
            </div>
           </div>`}
    </div>
  </div>`;
}

// ── EXPORT / IMPORT ──────────────────────────────────────────
function exportData(){
  const data={
    progress:state.progress, studyLog:state.studyLog,
    mood:state.mood, hoursToday:state.hoursToday,
    subjectNotes:state.subjectNotes, materials:state.materials,
    alarms:state.alarms, exportedAt:new Date().toISOString()
  };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`studytracker_backup_${today()}.json`; a.click();
  URL.revokeObjectURL(url);
  showToast("✅ Data exported!","success");
}

function importData(input){
  const file=input.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const data=JSON.parse(e.target.result);
      mergeImportData(data);
    }catch(err){showToast("⚠️ Invalid backup file","alarm");}
  };
  reader.readAsText(file);
  input.value="";
}

function mergeImportData(data){
  if(data.progress) state.progress=data.progress;
  if(data.studyLog) state.studyLog=data.studyLog;
  if(data.mood!==undefined) state.mood=data.mood;
  if(data.hoursToday!==undefined) state.hoursToday=data.hoursToday;
  if(data.subjectNotes) state.subjectNotes=data.subjectNotes;
  if(data.materials) state.materials=data.materials;
  if(data.alarms) state.alarms=data.alarms;
  if(data.subjectSections) state.subjectSections=data.subjectSections;
  if(data.appConfig) state.appConfig=data.appConfig;
  ["progress","studyLog","mood","hoursToday","subjectNotes","materials","alarms","subjectSections","appConfig"].forEach(k=>LS(k,state[k]));
  pushToFirebase();
  applyAppConfig();
  showToast("✅ Data imported successfully!","success");
  spawnStars();
  render();
}

// ── LINK-BASED SYNC ───────────────────────────────────────────
// Encodes non-file state as a compressed base64 URL parameter.
// Recipient opens the link → auto-prompts to import.

function generateShareLink(){
  try{
    const data={
      progress:state.progress,
      studyLog:state.studyLog,
      mood:state.mood,
      hoursToday:state.hoursToday,
      subjectNotes:state.subjectNotes,
      materials:state.materials,
      alarms:state.alarms,
      subjectSections:state.subjectSections,
      appConfig:state.appConfig||{},
      sharedBy:currentUser?.displayName||"A friend",
      sharedAt:new Date().toISOString(),
      version:14
    };
    const json=JSON.stringify(data);
    const b64=btoa(unescape(encodeURIComponent(json)));
    const url=window.location.href.split("?")[0]+"?import="+b64;
    if(url.length>2000){
      // Too large for URL — truncate materials to avoid issues
      data.materials=data.materials.slice(0,20);
      const json2=JSON.stringify(data);
      const b642=btoa(unescape(encodeURIComponent(json2)));
      const url2=window.location.href.split("?")[0]+"?import="+b642;
      copyToClipboard(url2);
      showToast("🔗 Share link copied! (materials trimmed for URL limit)","success");
    } else {
      copyToClipboard(url);
      showToast("🔗 Share link copied to clipboard!","success");
    }
  }catch(e){
    showToast("⚠️ Could not generate share link: "+e.message,"alarm");
  }
}

function copyToClipboard(text){
  if(navigator.clipboard){
    navigator.clipboard.writeText(text).catch(()=>{
      const ta=document.createElement("textarea");
      ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();
    });
  } else {
    const ta=document.createElement("textarea");
    ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();
  }
  // Show link in a modal-ish dialog too
  const linkEl=document.getElementById("share-link-display");
  if(linkEl){linkEl.value=text;linkEl.style.display="block";}
}

function importFromShareLink(b64){
  try{
    const json=decodeURIComponent(escape(atob(b64)));
    const data=JSON.parse(json);
    if(confirm(`Import study data shared by "${data.sharedBy||"Someone"}" on ${data.sharedAt?new Date(data.sharedAt).toLocaleDateString():"unknown date"}?\n\nThis will merge with your existing data.`)){
      mergeImportData(data);
      // Clean the URL
      window.history.replaceState({},"",window.location.pathname);
    }
  }catch(e){
    showToast("⚠️ Invalid share link","alarm");
  }
}

// Check for ?import= on startup
function checkShareLinkOnLoad(){
  const params=new URLSearchParams(window.location.search);
  const importData=params.get("import");
  if(importData){
    // Delay until UI is ready
    setTimeout(()=>importFromShareLink(importData),800);
  }
}

function handlePastedShareLink(){
  const input=document.getElementById("share-link-paste");
  if(!input) return;
  let val=input.value.trim();
  // Accept full URL or just the base64 param
  const match=val.match(/[?&]import=([^&]+)/);
  if(match) val=match[1];
  if(!val){showToast("⚠️ Paste a valid share link","alarm");return;}
  importFromShareLink(val);
}

function saveAppConfig(){
  const name=document.getElementById("cfg-name")?.value.trim()||"Exam Is Near by ArkSetu";
  const subtitle=document.getElementById("cfg-subtitle")?.value.trim()||"Study Smart";
  state.appConfig={name,subtitle};
  S("appConfig",state.appConfig);
  applyAppConfig();
  showToast("✅ App config saved!","success");
  render();
}



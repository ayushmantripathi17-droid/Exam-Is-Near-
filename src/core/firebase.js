// ── IndexedDB Storage (large quota ~250MB+) with localStorage fallback ──
let _idb=null;
function openIDB(){
  if(_idb) return Promise.resolve(_idb);
  return new Promise((res,rej)=>{
    const req=indexedDB.open("StudyTrackerDB",2);
    req.onupgradeneeded=e=>{
      const db=e.target.result;
      if(!db.objectStoreNames.contains("kv")) db.createObjectStore("kv");
    };
    req.onsuccess=e=>{_idb=e.target.result;res(_idb);};
    req.onerror=()=>rej(req.error);
  });
}
async function idbSet(k,v){
  try{
    const db=await openIDB();
    return new Promise((res,rej)=>{
      const tx=db.transaction("kv","readwrite");
      tx.objectStore("kv").put(v,k);
      tx.oncomplete=()=>res(true);
      tx.onerror=()=>rej(tx.error);
    });
  }catch(e){
    // Fallback to localStorage
    try{localStorage.setItem("st_"+k,JSON.stringify(v));}catch(le){}
    return false;
  }
}
async function idbGet(k,d){
  try{
    const db=await openIDB();
    return new Promise((res)=>{
      const tx=db.transaction("kv","readonly");
      const req=tx.objectStore("kv").get(k);
      req.onsuccess=()=>res(req.result!==undefined?req.result:d);
      req.onerror=()=>res(d);
    });
  }catch(e){
    // Fallback to localStorage
    try{const v=localStorage.getItem("st_"+k);return v?JSON.parse(v):d;}catch(le){return d;}
  }
}
// Synchronous fallback for legacy code
const LS=(k,v)=>{
  idbSet(k,v).catch(()=>{});
  // Also keep small non-file keys in localStorage for instant startup
  if(k!=="files"){
    try{localStorage.setItem("st_"+k,JSON.stringify(v));}catch(e){}
  }
};
const LL=(k,d)=>{
  // Try localStorage first for fast startup (non-file keys)
  if(k!=="files"){
    try{const v=localStorage.getItem("st_"+k);if(v) return JSON.parse(v);}catch(e){}
  }
  return d; // async load handles files
};
// Storage usage (IndexedDB has no easy size API, show estimate)
async function getStorageEstimate(){
  if(navigator.storage&&navigator.storage.estimate){
    const est=await navigator.storage.estimate();
    return {used:(est.usage||0),quota:(est.quota||0)};
  }
  return {used:0,quota:25*1024*1024*1024};
}

// ── Firebase config (hardcoded) ──
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAzd_5MxraedOo_3OuczMdNOvtOk-JRQBo",
  authDomain: "exam-is-near.web.app",
  projectId: "exam-is-near",
  storageBucket: "exam-is-near.firebasestorage.app",
  messagingSenderId: "568104262716",
  appId: "1:568104262716:web:5cfb621349b5e234be7739",
  measurementId: "G-11ZEWC8D9Q"
};

// Skips non-critical Firestore reads for search-engine/link-preview bots.
// Even one-time getDocs() calls open a persistent "Listen/channel" stream
// on the full Firestore SDK that never closes on its own — this eats
// Googlebot's render budget and can starve other resources (fonts, og-image)
// from completing within its crawl window. Real visitors are unaffected.
function isCrawlerUA(){
  const ua=(navigator.userAgent||"").toLowerCase();
  // google-inspectiontool = Search Console's "Test Live URL" / Rich Result Test —
  // a separate UA from the regular Googlebot indexing crawler, easy to miss.
  return /googlebot|google-inspectiontool|googleother|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|applebot|petalbot|semrushbot|ahrefsbot|mj12bot|rogerbot/.test(ua);
}

async function initFirebase(){
  // FIX: Firebase SDK loads from gstatic CDN. In sandboxed environments
  // (claude.ai preview, strict CSP, offline) the fetch fails with a network
  // error. That is NOT a sync error -- stay "offline" silently.
  try{
    const {initializeApp,getApps}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const {getFirestore}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const {getAuth,GoogleAuthProvider,signInWithPopup,signInWithRedirect,getRedirectResult,signOut,onAuthStateChanged}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    const {getStorage}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js");

    let app;
    if(getApps().length===0) app=initializeApp(FIREBASE_CONFIG);
    else app=getApps()[0];

    db=getFirestore(app);
    auth=getAuth(app);
    storage=getStorage(app);

    // Handle redirect sign-in result (fires after page reload from signInWithRedirect)
    try{
      const redirectResult=await getRedirectResult(auth);
      if(redirectResult?.user){
        showToast("✅ Signed in as "+redirectResult.user.displayName,"success");
        spawnStars();
      }
    }catch(e){
      if(e.code==="auth/unauthorized-domain") showUnauthorizedDomainModal();
      else if(e.code!=="auth/no-current-user") console.error("Redirect sign-in error:",e);
    }

    // Load shared files for ALL users (signed in or not) — skipped for
    // crawlers, see isCrawlerUA() above.
    if(!isCrawlerUA()){
      setTimeout(()=>loadSharedFiles(),800);
      setTimeout(()=>loadAdminMaterials(),850);
      setTimeout(()=>loadAdminLinks(),1000);
      setTimeout(()=>loadAdminYouTube(),1100);
      setTimeout(()=>loadTheme(),900);
      setTimeout(()=>{checkMaintenance();loadAnnouncement();},1200);
    }

    onAuthStateChanged(auth, user=>{
      if(user){
        currentUser=user;
        syncUserId=user.uid;
        localStorage.setItem("st_userId", user.uid);
        syncStatus="connecting";
        updateSyncBadge();
        updateUserBadge();
        subscribeToFirestore();
        loadSharedFiles(); // reload after login to get latest
        loadAdminMaterials();
        loadAdminNotes();
        if(typeof loadStudyMaterials === 'function') loadStudyMaterials(); // [FIX C6]
        loadUserFiles();  // load this user's own cloud files
        loadExamSchedule();
        render();
      } else {
        currentUser=null;
        syncUserId=null;
        syncStatus="offline";
        if(unsubscribeFn){unsubscribeFn();unsubscribeFn=null;}
        updateSyncBadge();
        updateUserBadge();
        render();
      }
    });

    return true;
  }catch(e){
    syncStatus="offline";
    updateSyncBadge();
    updateUserBadge();
    return false;
  }
}

async function googleSignIn(){
  if(!auth){
    showToast("⏳ Auth loading, retrying…","info");
    await new Promise(r=>setTimeout(r,1500));
    if(!auth){showToast("⚠️ Firebase not ready. Check internet connection.","alarm");return;}
  }
  try{
    const {GoogleAuthProvider,signInWithPopup}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    const provider=new GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");
    provider.setCustomParameters({prompt:"select_account"});
    showToast("🔄 Opening Google sign-in…","info");
    const result=await signInWithPopup(auth, provider);
    if(result?.user){
      showToast("✅ Signed in as "+result.user.displayName,"success");
      spawnStars();
    }
  }catch(e){
    if(e.code==="auth/popup-blocked"){
      showToast("⚠️ Popup blocked — allow popups for this site in your browser","alarm");
    } else if(e.code==="auth/cancelled-popup-request"||e.code==="auth/popup-closed-by-user"){
      showToast("ℹ️ Sign-in cancelled","info");
    } else if(e.code==="auth/unauthorized-domain"){
      showUnauthorizedDomainModal();
    } else if(e.code==="auth/network-request-failed"){
      showToast("⚠️ Network error — check your internet connection","alarm");
    } else {
      showToast("⚠️ Sign-in failed: "+(e.message||e.code),"alarm");
      console.error("Sign-in error:",e);
    }
  }
}

function showUnauthorizedDomainModal(){
  const domain=location.hostname||"this domain";
  const existing=document.getElementById("auth-domain-modal");
  if(existing) existing.remove();
  const modal=document.createElement("div");
  modal.id="auth-domain-modal";
  modal.style.cssText="position:fixed;inset:0;background:#00000099;z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)";
  modal.innerHTML=`<div style="background:#0f0f18;border:1px solid #FF6B3566;border-radius:16px;padding:28px;max-width:500px;width:92%;font-family:inherit">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font-size:32px">🔒</span>
      <div>
        <div style="font-size:16px;font-weight:bold;color:#FF6B35">Domain Not Authorised</div>
        <div style="font-size:11px;color:#555;margin-top:2px">Firebase sign-in is blocked on this domain</div>
      </div>
    </div>
    <div style="font-size:13px;color:#888;margin-bottom:16px;line-height:1.8">
      The current domain <code style="background:#1a1a2a;padding:2px 8px;border-radius:4px;color:#4ECDC4;font-size:12px">${domain}</code> is not added to Firebase's Authorised Domains list.
    </div>
    <div style="background:#0a0a12;border:1px solid #1e1e2e;border-radius:10px;padding:14px;margin-bottom:16px">
      <div style="font-size:11px;color:#FFE66D;font-weight:bold;letter-spacing:1px;margin-bottom:10px">HOW TO FIX (one-time setup)</div>
      <div style="font-size:12px;color:#888;line-height:2">
        1. Go to <a href="https://console.firebase.google.com" target="_blank" style="color:#4ECDC4">console.firebase.google.com</a><br>
        2. Open your project <b style="color:#ccc">exam-is-near</b><br>
        3. Go to <b style="color:#ccc">Authentication → Settings → Authorised Domains</b><br>
        4. Click <b style="color:#ccc">Add Domain</b> and enter: <code style="background:#1a1a2a;padding:2px 8px;border-radius:4px;color:#06D6A0">${domain}</code><br>
        5. Save and refresh this page
      </div>
    </div>
    <div style="display:flex;gap:10px">
      <a href="https://console.firebase.google.com/project/exam-is-near/authentication/settings" target="_blank"
        style="flex:1;background:linear-gradient(135deg,#4285F4,#34A853);border:none;color:#fff;padding:11px 0;border-radius:10px;font-family:inherit;font-size:13px;cursor:pointer;font-weight:bold;text-align:center;text-decoration:none;display:block">
        🔗 Open Firebase Console
      </a>
      <button onclick="document.getElementById('auth-domain-modal').remove()"
        style="background:none;border:1px solid #333;color:#888;padding:11px 18px;border-radius:10px;font-family:inherit;font-size:13px;cursor:pointer">
        Close
      </button>
    </div>
  </div>`;
  document.body.appendChild(modal);
}

async function googleSignOut(){
  try{
    const {signOut}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    await signOut(auth);
    showToast("👋 Signed out","info");
    render();
  }catch(e){
    showToast("⚠️ Sign-out failed: "+e.message,"alarm");
  }
}

async function subscribeToFirestore(){
  if(!db||!syncUserId) return;
  try{
    const {doc,onSnapshot}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const docRef=doc(db,"study_tracker",syncUserId);
    if(unsubscribeFn) unsubscribeFn();
    unsubscribeFn=onSnapshot(docRef,
      async snap=>{
        if(snap.exists()){
          _firestoreUpdating = true; // suppress S() → pushToFirebase during remote apply
          const remote=snap.data();
          const keys=["progress","studyLog","mood","hoursToday","subjectNotes","materials","alarms",
                      "pomSubjectHours","examDateOverrides",
                      "subjectSections","activeSectionTab","subjectDriveFolders",
                      "activeCourse","dailyGoal","pomSettings","pomSessionLog",
                      "njMistakes","njSRSCards","njDiffMap",
                      "appConfig","cbse12Stream","courseChosen","flashDecks",
                      "quizLog","flashLog"];
          keys.forEach(k=>{
            if(remote[k]===undefined) return;
            if(k==="pomSubjectHours")        { pomState.subjectHours=remote[k]; }
            else if(k==="examDateOverrides") { _examDateOverrides=remote[k]; localStorage.setItem('st_examDates',JSON.stringify(remote[k])); }
            else if(k==="activeCourse")      { if(remote[k] && remote[k]!==activeCourse){ activeCourse=remote[k]; localStorage.setItem('activeCourse',remote[k]); const _s=getSubjects(); if(!_s.find(s=>s.id===state.activeSubject)&&_s[0]) state.activeSubject=_s[0].id; } }
            else if(k==="dailyGoal")         { localStorage.setItem('st_dailyGoal',remote[k]); }
            else if(k==="pomSettings")       { const ps=remote[k]; pomState.workMins=ps.workMins||25; pomState.shortBreak=ps.shortBreak||5; pomState.longBreak=ps.longBreak||15; pomState.soundOn=ps.soundOn!==false; localStorage.setItem('pom_settings',JSON.stringify(ps)); }
            else if(k==="pomSessionLog")     { pomState.sessionLog=remote[k]; localStorage.setItem('pom_sessionLog',JSON.stringify(remote[k])); }
            else if(k==="njMistakes")        { njState.mistakes=remote[k]; localStorage.setItem('ein_nj',JSON.stringify({mistakes:njState.mistakes,srsCards:njState.srsCards,diffMap:njState.diffMap})); }
            else if(k==="njSRSCards")        { njState.srsCards=remote[k]; localStorage.setItem('ein_nj',JSON.stringify({mistakes:njState.mistakes,srsCards:njState.srsCards,diffMap:njState.diffMap})); }
            else if(k==="njDiffMap")         { njState.diffMap=remote[k]; localStorage.setItem('ein_nj',JSON.stringify({mistakes:njState.mistakes,srsCards:njState.srsCards,diffMap:njState.diffMap})); }
            else if(k==="appConfig")         { if(remote[k]&&Object.keys(remote[k]).length){ state.appConfig=remote[k]; LS('appConfig',remote[k]); applyAppConfig(); } }
            else if(k==="cbse12Stream")      { if(remote[k]){ cbse12Stream=remote[k]; localStorage.setItem('cbse12Stream',remote[k]); } }
            else if(k==="courseChosen")      { if(remote[k]) localStorage.setItem('courseChosen',remote[k]); }
            else if(k==="flashDecks")        { if(remote[k]&&typeof remote[k]==='object'){ Object.assign(flashDecks,remote[k]); saveFlashDecks(); } }
            else if(k==="quizLog")           { if(Array.isArray(remote[k])){ quizLog=remote[k]; localStorage.setItem('ein_quiz_log',JSON.stringify(quizLog)); } }
            else if(k==="flashLog")          { if(Array.isArray(remote[k])){ flashLog=remote[k]; localStorage.setItem('ein_flash_log',JSON.stringify(flashLog)); } }
            else                             { state[k]=remote[k]; }
          });
          syncStatus="synced";
          updateSyncBadge();
          await loadUserFiles(); // load files first, then single render below
          render();
          _firestoreUpdating = false; // re-enable S() → pushToFirebase
        } else {
          // No doc yet — push local data to Firestore
          pushToFirebase();
        }
      },
      err=>{
        console.error("[Sync] Firestore snapshot error:",err.code,err.message);
        syncStatus="error";
        updateSyncBadge();
        // Auto-retry after 8s for transient errors
        if(err.code!=="permission-denied"){
          setTimeout(()=>{ if(currentUser) subscribeToFirestore(); }, 8000);
        }
      }
    );
  }catch(e){
    console.error("[Sync] subscribeToFirestore exception:",e);
    syncStatus="error"; updateSyncBadge();
  }
}

// Recursively remove undefined values so Firestore never throws invalid-argument
function sanitizeForFirestore(obj){
  if(Array.isArray(obj)) return obj.map(sanitizeForFirestore).filter(v=>v!==undefined);
  if(obj!==null && typeof obj==='object'){
    const out={};
    for(const k in obj){
      const v=sanitizeForFirestore(obj[k]);
      if(v!==undefined) out[k]=v;
    }
    return out;
  }
  return obj===undefined ? null : obj;
}

async function pushToFirebase(){
  if(!db||!syncUserId) return;
  if(pushToFirebase._inProgress) return;  // prevent concurrent pushes
  pushToFirebase._inProgress=true;
  try{
    const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const raw={
      // core keys
      progress:state.progress, studyLog:state.studyLog,
      mood:state.mood, hoursToday:state.hoursToday,
      subjectNotes:state.subjectNotes,
      materials:state.materials.map(m=>{const c={...m};delete c.data;if(c.content) c.content=c.content.slice(0,8000);return c;}),
      flashDecks:flashDecks||{},
      alarms:state.alarms, pomSubjectHours:pomState.subjectHours,
      examDateOverrides:_examDateOverrides,
      // subject sections & folders
      subjectSections:state.subjectSections||{},
      activeSectionTab:state.activeSectionTab||{},
      subjectDriveFolders:state.subjectDriveFolders||{},
      // course & goal
      activeCourse:activeCourse||null,
      dailyGoal:parseFloat(localStorage.getItem('st_dailyGoal')||'6'),
      // pomodoro
      pomSettings:{workMins:pomState.workMins||25,shortBreak:pomState.shortBreak||5,longBreak:pomState.longBreak||15,soundOn:pomState.soundOn!==false},
      pomSessionLog:(pomState.sessionLog||[]).slice(-50),
      // NEET/JEE tools
      njMistakes:njState.mistakes||[],
      njSRSCards:njState.srsCards||[],
      njDiffMap:njState.diffMap||{},
      // app config & course setup
      appConfig:state.appConfig||{},
      cbse12Stream:localStorage.getItem('cbse12Stream')||null,
      courseChosen:localStorage.getItem('courseChosen')||null,
      // Pro logs
      quizLog:(quizLog||[]).slice(-QUIZ_LOG_MAX),
      flashLog:(flashLog||[]).slice(-FLASH_LOG_MAX),
      updatedAt:Date.now()
    };
    const data=sanitizeForFirestore(raw);
    await setDoc(doc(db,"study_tracker",syncUserId),data);
    syncStatus="synced";
    updateSyncBadge();
  }catch(e){
    console.error("[Sync] pushToFirebase error:",e.code,e.message);
    syncStatus="error";
    updateSyncBadge();
    // Auto-retry on transient errors
    if(e.code!=="permission-denied"){
      setTimeout(()=>{ if(db&&syncUserId) pushToFirebase(); }, 5000);
    }
  }finally{
    pushToFirebase._inProgress=false;
  }
}

// Unified save — local + cloud
// _firestoreUpdating: true while onSnapshot is applying remote data.
// Prevents S() from re-pushing to Firestore and causing an infinite loop.
let _firestoreUpdating = false;

function S(k,v){
  LS(k,v);
  if(_firestoreUpdating) return; // skip push — data came FROM Firestore
  clearTimeout(S._timer);
  S._timer=setTimeout(pushToFirebase,1200);
}

function updateSyncBadge(){
  const el=document.getElementById("sync-badge");
  if(!el) return;
  const map={
    offline:{icon:"☁️",text:"Sign in to sync",color:"#555"},
    connecting:{icon:"🟡",text:"Connecting…",color:"#FFE66D"},
    synced:{icon:"🟢",text:"Synced",color:"#06D6A0"},
    error:{icon:"🔴",text:"Sync Error",color:"#FF6B35"},
  };
  const s=map[syncStatus]||map.offline;
  el.innerHTML=`<span style="color:${s.color};font-size:11px;cursor:pointer" onclick="switchView('sync')">${s.icon} ${s.text}</span>`;
}

function updateUserBadge(){
  const el=document.getElementById("user-badge");
  if(!el) return;
  // Show/hide admin pill based on admin status
  const adminPill=document.getElementById("admin-nav-pill");
  if(adminPill) adminPill.style.display=isAdmin()?"":"none";
  if(currentUser){
    el.innerHTML=`<div style="display:flex;align-items:center;gap:6px;cursor:pointer" onclick="switchView('sync')">
      <img src="${currentUser.photoURL||''}" onerror="this.style.display='none'" style="width:26px;height:26px;border-radius:50%;border:2px solid #06D6A0"/>
      <span style="font-size:11px;color:#06D6A0;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(currentUser.displayName||currentUser.email)}</span>
    </div>`;
  } else {
    el.innerHTML=`<button onclick="googleSignIn()" style="background:linear-gradient(135deg,#4285F4,#34A853);border:none;color:#fff;padding:6px 14px;border-radius:20px;font-size:11px;font-family:inherit;cursor:pointer;font-weight:bold;letter-spacing:0.3px">🔐 Sign in with Google</button>`;
  }
}

async function loadAll(){
  // Load small/fast keys from localStorage synchronously
  state.progress=LL("progress",{});
  state.studyLog=LL("studyLog",{});
  state.mood=LL("mood",3);
  state.hoursToday=LL("hoursToday",0);
  state.subjectNotes=LL("subjectNotes",{});
  state.materials=LL("materials",[]);
  state.alarms=LL("alarms",[]);
  state.subjectSections=LL("subjectSections",{});
  state.activeSectionTab=LL("activeSectionTab",{});
  state.subjectDriveFolders=LL("subjectDriveFolders",{});
  state.appConfig=LL("appConfig",{name:"Exam Is Near by ArkSetu",subtitle:"Study Smart"});
  state.adminYouTube=LL("adminYouTube",[]);
  // Load pomSubjectHours
  try{ const ph=LL("pomSubjectHours",null); if(ph) pomState.subjectHours=ph; }catch(e){}
  // Load files from IndexedDB (larger quota)
  try{
    const idbFiles=await idbGet("files",[]);
    state.files=Array.isArray(idbFiles)?idbFiles:LL("files",[]);
  }catch(e){state.files=LL("files",[]);}
  // Update app name from config
  applyAppConfig();
  // Init Firebase + Auth
  setTimeout(()=>initFirebase(),400);
  // History API routing: read URL path on load
  const _routeMap = {
    '/': 'dashboard', '/dashboard': 'dashboard',
    '/subjects': 'subjects', '/alarms': 'alarms',
    '/files': 'files', '/pomodoro': 'pomodoro',
    '/flashcards': 'flashcards', '/quiz': 'quiz',
    '/analytics': 'analytics', '/ai': 'ai',
    '/sync': 'sync', '/log': 'log',
    '/about': 'about', '/profile': 'profile',
    '/neetjee': 'neetjee', '/admin': 'admin',
    '/course/jee': 'course:jee', '/course/neet': 'course:neet',
    '/course/nfsu': 'course:nfsu', '/course/nfsu1': 'course:nfsu1',
    '/course/nfsu3': 'course:nfsu3',
    '/course/cbse10': 'course:cbse10', '/course/cbse12': 'course:cbse12'
  };
  const _initView = _routeMap[window.location.pathname] || state.view || 'dashboard';
  // Handle course deep-links: /course/jee → switchCourse('jee') then go to dashboard
  if(_initView && _initView.startsWith('course:')){
    const _cid = _initView.split(':')[1];
    if(typeof switchCourse === 'function') switchCourse(_cid);
    history.replaceState({view:'dashboard'}, '', '/');
  } else {
    switchView(_initView, false);
    const _initSlug = _initView === 'dashboard' ? '/' : '/' + _initView;
    history.replaceState({view: _initView}, '', _initSlug);
  }
  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    const v = (e.state && e.state.view) || _routeMap[window.location.pathname] || 'dashboard';
    if(v && v.startsWith('course:')){
      const _cid = v.split(':')[1];
      if(typeof switchCourse === 'function') switchCourse(_cid);
    } else {
      switchView(v, false);
    }
  });
}

function applyAppConfig(){
  const cfg=state.appConfig||{};
  const subtitle=document.getElementById("app-subtitle");
  const title=document.getElementById("app-title");
  if(subtitle&&cfg.subtitle) subtitle.textContent=cfg.subtitle;
  if(title&&cfg.name) title.textContent=(cfg.name||"Exam Is Near by ArkSetu")+" ✦";
  document.title=(cfg.name||"Exam Is Near")+" — Study Smart | by ArkSetu";
}


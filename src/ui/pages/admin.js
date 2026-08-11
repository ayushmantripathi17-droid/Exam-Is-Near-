// ══════════════════════════════════════════════════════════════
// SUBJECT SECTION FUNCTIONS
// ══════════════════════════════════════════════════════════════
function getSubjectSection(sid){
  if(!state.subjectSections[sid]) state.subjectSections[sid]={qp:[],notes:[],materials:[],playlists:[]};
  return state.subjectSections[sid];
}

function getActiveTab(sid){ return state.activeSectionTab[sid]||"qp"; }

function setActiveTab(sid,tab){
  state.activeSectionTab[sid]=tab;
  LS("activeSectionTab",state.activeSectionTab);
  render();
}

function openSectionModal(sid,tab){
  state.showSectionModal={subjectId:sid,tab};
  state.newSectionItem={title:"",url:"",description:"",year:"",subjectId:sid,tab};
  render();
}

function closeSectionModal(){state.showSectionModal=null;render();}

function saveSectionItem(){
  const m=state.showSectionModal;
  if(!m) return;
  const title=document.getElementById("sec-title")?.value||"";
  const url=document.getElementById("sec-url")?.value||"";
  const desc=document.getElementById("sec-desc")?.value||"";
  const year=document.getElementById("sec-year")?.value||"";
  if(!title.trim()){showToast("⚠️ Title is required","alarm");return;}
  const sec=getSubjectSection(m.subjectId);
  const item={id:genId(),title,url,description:desc,year,created:today()};
  sec[m.tab].unshift(item);
  S("subjectSections",state.subjectSections);
  state.showSectionModal=null;
  showToast("✅ Added!","success");
  spawnStars();
  render();
}

function deleteSectionItem(sid,tab,id){
  if(!confirm("Delete this item?")) return;
  const sec=getSubjectSection(sid);
  sec[tab]=sec[tab].filter(i=>i.id!==id);
  S("subjectSections",state.subjectSections);
  showToast("🗑️ Deleted","info");
  render();
}

// ── DRIVE FOLDER PICKER ──────────────────────────────────────
async function openFolderPicker(sid){
  if(driveStatus!=="ready"){
    showToast("⚠️ Connect Google Drive first (Sync tab)","alarm");
    return;
  }
  state.driveFolderPickerFor=sid;
  state.showFolderPicker=true;
  state.availableDriveFolders=[];
  render();
  await loadDriveFolders();
}

function closeFolderPicker(){
  state.showFolderPicker=false;
  state.driveFolderPickerFor=null;
  render();
}

async function loadDriveFolders(){
  if(!driveAccessToken) return;
  try{
    const q=encodeURIComponent("mimeType='application/vnd.google-apps.folder' and trashed=false");
    const res=await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=50`,{
      headers:{Authorization:"Bearer "+driveAccessToken}
    });
    const data=await res.json();
    state.availableDriveFolders=data.files||[];
    render();
  }catch(e){
    showToast("⚠️ Could not load Drive folders","alarm");
    state.availableDriveFolders=[];
    render();
  }
}

async function selectDriveFolder(folderId,folderName){
  const sid=state.driveFolderPickerFor;
  if(!sid) return;
  state.subjectDriveFolders[sid]={folderId,folderName};
  LS("subjectDriveFolders",state.subjectDriveFolders);
  state.showFolderPicker=false;
  state.driveFolderPickerFor=null;
  showToast(`📁 "${folderName}" linked to ${getSubjects().find(s=>s.id===sid)?.name||sid}`,"success");
  render();
}

async function createDriveFolderForSubject(sid){
  if(!driveAccessToken||!driveFolderId) return;
  const sub=getSubjects().find(s=>s.id===sid);
  if(!sub) return;
  const folderName=`NFSU-${sub.name}`;
  try{
    const cr=await fetch("https://www.googleapis.com/drive/v3/files",{
      method:"POST",
      headers:{Authorization:"Bearer "+driveAccessToken,"Content-Type":"application/json"},
      body:JSON.stringify({name:folderName,mimeType:"application/vnd.google-apps.folder",parents:[driveFolderId]})
    });
    const fd=await cr.json();
    state.subjectDriveFolders[sid]={folderId:fd.id,folderName};
    LS("subjectDriveFolders",state.subjectDriveFolders);
    showToast(`📁 Created "${folderName}" in Drive`,"success");
    state.showFolderPicker=false;
    state.driveFolderPickerFor=null;
    render();
  }catch(e){showToast("⚠️ Could not create folder","alarm");}
}

// ── RENDER SUBJECT SECTIONS ──────────────────────────────────
function renderSubjectSectionTabs(sub){
  const sid=sub.id;
  const tab=getActiveTab(sid);
  const sec=getSubjectSection(sid);
  const driveFolder=state.subjectDriveFolders[sid];

  const tabDefs=[
    {key:"qp",icon:"📄",label:"Question Papers"},
    {key:"notes",icon:"📝",label:"Notes"},
    {key:"materials",icon:"📦",label:"Materials"},
    {key:"playlists",icon:"▶️",label:"YouTube"},
  ];

  const tabBar=`<div class="sub-tab-bar">
    ${tabDefs.map(t=>`<button class="sub-tab ${tab===t.key?"active":""}"
      onclick="setActiveTab('${sid}','${t.key}')"
      style="${tab===t.key?`background:${sub.color};`:""}">
      ${t.icon} ${t.label}
      <sup style="font-size:9px;opacity:0.7">${sec[t.key]?.length||0}</sup>
    </button>`).join("")}
  </div>`;

  const driveFolderChip=driveFolder
    ?`<div class="drive-folder-chip" onclick="openFolderPicker('${sid}')">📁 ${esc(driveFolder.folderName)} <span style="font-size:9px;opacity:0.6">change</span></div>`
    :`<button class="drive-folder-chip" style="color:#555;border-color:#1e1e2e" onclick="openFolderPicker('${sid}')">📁 Link Drive Folder</button>`;

  let content="";
  if(tab==="qp"){
    const items=sec.qp||[];
    content=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:13px;color:#555">${items.length} question paper${items.length!==1?"s":""}</div>
        <button class="btn-gold" style="font-size:12px;padding:8px 16px" onclick="openSectionModal('${sid}','qp')">+ Add Paper</button>
      </div>
      ${items.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📄</div><div>No question papers yet</div><div style="font-size:12px;color:#444;margin-top:4px">Add previous year papers, sample papers</div></div>`
      :items.map(item=>`<div class="qp-card" onclick="${item.url?`window.open('${esc(item.url)}','_blank')`:"void(0)"}">
        <div style="font-size:28px">📄</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:bold;font-size:14px;color:#EDE8E0">${esc(item.title)}</div>
          ${item.year?`<div style="font-size:11px;color:#555;margin-top:2px">Year: ${esc(item.year)}</div>`:""}
          ${item.description?`<div style="font-size:12px;color:#666;margin-top:4px">${esc(item.description)}</div>`:""}
          ${item.url?`<div style="font-size:10px;color:#4ECDC4;margin-top:4px">🔗 ${esc(item.url.slice(0,50))}${item.url.length>50?"...":""}</div>`:""}
        </div>
        <button onclick="event.stopPropagation();deleteSectionItem('${sid}','qp','${item.id}')" class="icon-btn" style="color:#553333">🗑️</button>
      </div>`).join("")}`;
  } else if(tab==="notes"){
    const items=sec.notes||[];
    content=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:13px;color:#555">${items.length} note${items.length!==1?"s":""}</div>
        <button class="btn-gold" style="font-size:12px;padding:8px 16px" onclick="openSectionModal('${sid}','notes')">+ Add Note</button>
      </div>
      ${items.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📝</div><div>No notes yet</div></div>`
      :items.map(item=>`<div class="sec-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <div style="font-weight:bold;font-size:14px;color:#EDE8E0;margin-bottom:6px">${esc(item.title)}</div>
            ${item.description?`<div style="font-size:13px;color:#888;line-height:1.7;white-space:pre-wrap">${esc(item.description)}</div>`:""}
            ${item.url?`<a href="${esc(item.url)}" target="_blank" style="display:inline-block;margin-top:8px;font-size:11px;color:#4ECDC4;text-decoration:none">🔗 Open Link</a>`:""}
            <div style="font-size:10px;color:#2e2e3e;margin-top:8px">${item.created}</div>
          </div>
          <button onclick="deleteSectionItem('${sid}','notes','${item.id}')" class="icon-btn" style="color:#553333">🗑️</button>
        </div>
      </div>`).join("")}`;
  } else if(tab==="materials"){
    const items=sec.materials||[];
    content=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:13px;color:#555">${items.length} material${items.length!==1?"s":""}</div>
        <button class="btn-gold" style="font-size:12px;padding:8px 16px" onclick="openSectionModal('${sid}','materials')">+ Add Material</button>
      </div>
      ${items.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📦</div><div>No study materials yet</div><div style="font-size:12px;color:#444;margin-top:4px">Add reference books, slides, handouts</div></div>`
      :items.map(item=>`<div class="sec-card" onclick="${item.url?`window.open('${esc(item.url)}','_blank')`:"void(0)"}" style="cursor:${item.url?"pointer":"default"}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <div style="font-weight:bold;font-size:14px;color:#EDE8E0;margin-bottom:4px">${esc(item.title)}</div>
            ${item.description?`<div style="font-size:12px;color:#888;margin-top:4px">${esc(item.description)}</div>`:""}
            ${item.url?`<div style="font-size:10px;color:#4ECDC4;margin-top:6px">🔗 ${esc(item.url.slice(0,60))}${item.url.length>60?"...":""}</div>`:""}
            <div style="font-size:10px;color:#2e2e3e;margin-top:6px">${item.created}</div>
          </div>
          <button onclick="event.stopPropagation();deleteSectionItem('${sid}','materials','${item.id}')" class="icon-btn" style="color:#553333">🗑️</button>
        </div>
      </div>`).join("")}`;
  } else if(tab==="playlists"){
    const items=sec.playlists||[];
    content=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:13px;color:#555">${items.length} playlist${items.length!==1?"s":""}</div>
        <button class="btn-gold" style="font-size:12px;padding:8px 16px" onclick="openSectionModal('${sid}','playlists')">+ Add Playlist</button>
      </div>
      ${items.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">▶️</div><div>No YouTube playlists yet</div><div style="font-size:12px;color:#444;margin-top:4px">Add video lectures, tutorial series</div></div>`
      :items.map(item=>{
        const ytId=item.url?(item.url.match(/[?&]v=([^&]+)/)?.[1]||item.url.match(/youtu\.be\/([^?]+)/)?.[1]||item.url.match(/list=([^&]+)/)?.[1]||null):null;
        const thumb=ytId?`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`:null;
        return`<div class="yt-card">
          <div class="yt-thumb" onclick="${item.url?`window.open('${esc(item.url)}','_blank')`:"void(0)"}">
            ${thumb?`<img src="${thumb}" alt="thumb" onerror="this.parentElement.innerHTML='▶️'"/>`:"▶️"}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:bold;font-size:13px;color:#EDE8E0;margin-bottom:4px">${esc(item.title)}</div>
            ${item.description?`<div style="font-size:12px;color:#888;margin-bottom:6px">${esc(item.description)}</div>`:""}
            ${item.url?`<a href="${esc(item.url)}" target="_blank" style="display:inline-block;background:#FF0000;color:#fff;font-size:11px;padding:4px 12px;border-radius:12px;text-decoration:none;font-weight:bold">▶ Watch on YouTube</a>`:""}
          </div>
          <button onclick="deleteSectionItem('${sid}','playlists','${item.id}')" class="icon-btn" style="color:#553333">🗑️</button>
        </div>`;
      }).join("")}`;
  }

  return `${tabBar}
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      ${driveFolderChip}
    </div>
    ${content}`;
}

// ── SECTION MODAL RENDER ─────────────────────────────────────
function renderSectionModal(){
  const m=state.showSectionModal;
  if(!m) return "";
  const sub=getSubjects().find(s=>s.id===m.subjectId);
  const tabLabels={qp:"Question Paper",notes:"Note",materials:"Study Material",playlists:"YouTube Playlist"};
  const isYt=m.tab==="playlists";
  const isQP=m.tab==="qp";
  return`<div class="modal-overlay show" onclick="if(event.target===this)closeSectionModal()">
    <div class="modal-box fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <div style="font-size:15px;font-weight:bold;color:#EDE8E0">Add ${tabLabels[m.tab]||"Item"}</div>
          <div style="font-size:11px;color:${sub?.color||"#555"};margin-top:2px">${sub?.icon||""} ${esc(sub?.name||"")}</div>
        </div>
        <button class="icon-btn" onclick="closeSectionModal()" style="font-size:18px;color:#666">✕</button>
      </div>
      <div style="margin-bottom:12px">
        <div class="section-label">TITLE *</div>
        <input id="sec-title" placeholder="${isYt?'Playlist or channel name':isQP?'e.g. 2024 Exam Paper':'Title'}"/>
      </div>
      <div style="margin-bottom:12px">
        <div class="section-label">${isYt?'YOUTUBE URL':'LINK / URL'} ${isYt?'*':''}</div>
        <input id="sec-url" placeholder="${isYt?'https://youtube.com/playlist?list=... or youtu.be/...':'https://drive.google.com/... or any link (optional)'}"/>
      </div>
      ${isQP?`<div style="margin-bottom:12px"><div class="section-label">YEAR / SEMESTER</div><input id="sec-year" placeholder="e.g. 2024, Sem II"/></div>`:`<input id="sec-year" style="display:none"/>`}
      <div style="margin-bottom:20px">
        <div class="section-label">DESCRIPTION / NOTES</div>
        <textarea id="sec-desc" rows="3" placeholder="${isYt?'Topics covered, duration...':'Additional notes (optional)'}"></textarea>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn-gold" onclick="saveSectionItem()" style="flex:1">💾 Save</button>
        <button class="btn-ghost" onclick="closeSectionModal()">Cancel</button>
      </div>
    </div>
  </div>`;
}

// ── FOLDER PICKER RENDER ─────────────────────────────────────
function renderFolderPicker(){
  if(!state.showFolderPicker) return "";
  const sid=state.driveFolderPickerFor;
  const sub=getSubjects().find(s=>s.id===sid);
  const folders=state.availableDriveFolders;
  return`<div class="modal-overlay show" onclick="if(event.target===this)closeFolderPicker()">
    <div class="modal-box fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <div style="font-size:15px;font-weight:bold;color:#EDE8E0">📁 Link Drive Folder</div>
          <div style="font-size:11px;color:${sub?.color||"#555"};margin-top:2px">For ${sub?.icon||""} ${esc(sub?.name||"")}</div>
        </div>
        <button class="icon-btn" onclick="closeFolderPicker()" style="font-size:18px;color:#666">✕</button>
      </div>
      <button class="add-sec-btn" onclick="createDriveFolderForSubject('${sid}')">
        ✨ Auto-create "NFSU-${esc(sub?.name||sid)}" folder in Drive
      </button>
      <div style="font-size:11px;color:#444;text-align:center;margin:10px 0">— or pick an existing folder —</div>
      ${folders.length===0
        ?`<div style="text-align:center;padding:24px;color:#333"><div style="font-size:30px;margin-bottom:10px">🔄</div>Loading your Drive folders…</div>`
        :folders.map(f=>`<div class="folder-picker-item ${state.subjectDriveFolders[sid]?.folderId===f.id?"selected":""}" onclick="selectDriveFolder('${f.id}','${esc(f.name)}')">
          <span style="font-size:20px">📁</span>
          <div style="flex:1"><div style="font-size:13px;color:#ccc">${esc(f.name)}</div></div>
          ${state.subjectDriveFolders[sid]?.folderId===f.id?`<span style="color:#06D6A0;font-size:16px">✓</span>`:""}
        </div>`).join("")}
    </div>
  </div>`;
}


// ══════════════════════════════════════════════════════════════
// ADMIN CONFIG & PANEL
// ══════════════════════════════════════════════════════════════
// SECURITY NOTE #11: isAdmin() here is a UI-layer check only (controls what the
// admin UI renders). All actual write operations are enforced server-side by
// Firestore Security Rules (firestore.rules → isAdmin() checks token.email).
// The email check below cannot be spoofed for write ops — Firestore rules
// independently verify the Firebase Auth token on every write.
const _ADMIN_PARTS = ["ayushmantripathi17", "gmail.com"];
function isAdmin(){ return !!(currentUser && currentUser.email === _ADMIN_PARTS.join("@")); }

// ─── Shared admin state ───────────────────────────────────────
let _adminCoupons = [];
let _adminLeaderboard = [];
let _adminUserFeed = [];

// ══════════════════════════════════════════════════════════════
// 1. ANNOUNCEMENTS
// ══════════════════════════════════════════════════════════════
async function adminPublishAnnouncement(){
  if(!isAdmin()) return;
  const title=(document.getElementById("ann-title")?.value||"").trim();
  const body=(document.getElementById("ann-body")?.value||"").trim();
  const showPopup=document.getElementById("ann-popup")?.checked;
  if(!title||!body){showToast("⚠️ Fill title and message","alarm");return;}
  const ann={id:genId(),title,body,showPopup:!!showPopup,created:today(),createdAt:Date.now()};
  if(db){
    try{
      const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await setDoc(doc(db,"announcements","current"),ann);
      showToast("📢 Announcement published to all users!","success");spawnStars();
      ["ann-title","ann-body"].forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});
    }catch(e){showToast("⚠️ "+e.message,"alarm");}
  }
}
async function adminClearAnnouncement(){
  if(!isAdmin()||!confirm("Remove current announcement?")) return;
  if(db){
    try{
      const {doc,deleteDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await deleteDoc(doc(db,"announcements","current"));
      const _annBanner=document.getElementById("announce-banner"); if(_annBanner)_annBanner.style.display="none";
      showToast("🗑️ Announcement cleared","info");
    }catch(e){showToast("⚠️ "+e.message,"alarm");}
  }
}
async function loadAnnouncement(){
  if(!db) return;
  try{
    const {doc,getDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDoc(doc(db,"announcements","current"));
    if(snap.exists()){
      const ann=snap.data();
      const banner=document.getElementById("announce-banner");
      if(banner){document.getElementById("announce-banner-text").textContent="📢 "+ann.title+": "+ann.body;banner.style.display="flex";}
      if(ann.showPopup&&!localStorage.getItem("ann_seen_"+ann.id)){
        document.getElementById("announce-popup-title").textContent=ann.title;
        document.getElementById("announce-popup-body").textContent=ann.body;
        document.getElementById("announce-popup").style.display="flex";
        localStorage.setItem("ann_seen_"+ann.id,"1");
      }
    }
  }catch(e){}
}

// ══════════════════════════════════════════════════════════════
// 2. PUBLISH NOTE FOR ALL USERS
// ══════════════════════════════════════════════════════════════
async function adminUploadNote(){
  if(!isAdmin()){showToast("🔒 Admin only","alarm");return;}
  const title=(document.getElementById("adm-title")?.value||"").trim();
  const content=(document.getElementById("adm-content")?.value||"").trim();
  const subjectId=document.getElementById("adm-sub")?.value||"cpp";
  const type=document.getElementById("adm-type")?.value||"📝 Note";
  const tags=(document.getElementById("adm-tags")?.value||"").split(",").map(t=>t.trim()).filter(Boolean);
  if(!title||!content){showToast("⚠️ Title and content required","alarm");return;}
  const note={id:genId(),title,content,subjectId,type,tags,created:today(),
    uploadedBy:currentUser.displayName||"Admin",pinned:false,adminNote:true};
  if(db){
    try{
      const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await setDoc(doc(db,"admin-notes",note.id),note);
      state.materials.unshift(note);
      showToast("📤 Note published to all users!","success");spawnStars();
      ["adm-title","adm-content","adm-tags"].forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});
      render();
    }catch(e){showToast("⚠️ "+e.message,"alarm");}
  }
}
function adminEditNote(id){
  const n=state.materials.find(m=>m.id===id);
  if(!n) return;
  const newContent=prompt("Edit content:",n.content);
  if(newContent===null) return;   // cancelled
  if(!newContent.trim()){showToast("⚠️ Content cannot be empty","alarm");return;}
  n.content=newContent.trim();
  n.updatedAt=Date.now();
  if(db) import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js")
    .then(({doc,setDoc})=>setDoc(doc(db,"admin-notes",id),n,{merge:true}).catch(e=>showToast("⚠️ "+e.message,"alarm")));
  showToast("✏️ Note updated","success");render();
}
async function loadAdminNotes(){
  if(!db||!currentUser) return;
  try{
    const {collection,getDocs,query,orderBy}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const q=query(collection(db,"admin-notes"),orderBy("created","desc"));
    const snap=await getDocs(q);
    const adminNotes=[];
    snap.forEach(d=>{
      const note=d.data();
      if(!state.materials.find(m=>m.id===d.id)) adminNotes.push({...note,id:d.id});
    });
    if(adminNotes.length>0){
      state.materials=[...adminNotes,...state.materials.filter(m=>!m.adminNote)];
      // No render() here — debounced render() in callers handles it
    }
  }catch(e){}
}

// ══════════════════════════════════════════════════════════════
// 3. YOUTUBE PUBLISHER
// ══════════════════════════════════════════════════════════════
function getYouTubeId(url){
  if(!url) return null;
  // Handles: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
async function adminPublishYouTube(){
  if(!isAdmin()){showToast("🔒 Admin only","alarm");return;}
  const titleEl=document.getElementById("adm-yt-title");
  const urlEl=document.getElementById("adm-yt-url");
  const descEl=document.getElementById("adm-yt-desc");
  const subjectId=document.getElementById("adm-yt-sub")?.value||"cpp";
  const title=(titleEl?.value||"").trim();
  const url=(urlEl?.value||"").trim();
  const desc=(descEl?.value||"").trim();
  if(!title){showToast("⚠️ Enter a video title","alarm");titleEl?.focus();return;}
  if(!url||(!url.includes("youtube.com")&&!url.includes("youtu.be"))){showToast("⚠️ Enter a valid YouTube link","alarm");urlEl?.focus();return;}
  const vid={id:genId(),title,url,desc,subjectId,created:today(),publishedBy:currentUser?.displayName||"Admin"};
  if(!state.adminYouTube) state.adminYouTube=[];
  state.adminYouTube.unshift(vid);
  LS("adminYouTube",state.adminYouTube);
  if(db){
    try{
      const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await setDoc(doc(db,"youtube-links",vid.id),vid);
      showToast("▶️ Video published to all users!","success");spawnStars();
    }catch(e){showToast("⚠️ "+e.message,"alarm");}
  }
  render();
  setTimeout(()=>{if(titleEl)titleEl.value="";if(urlEl)urlEl.value="";if(descEl)descEl.value="";},150);
}
async function adminDeleteYouTube(id){
  if(!isAdmin()) return;
  if(!confirm("Remove this video for all users?")) return;
  state.adminYouTube=(state.adminYouTube||[]).filter(v=>v.id!==id);
  LS("adminYouTube",state.adminYouTube);
  if(db){
    try{const {doc,deleteDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");await deleteDoc(doc(db,"youtube-links",id));}catch(e){}
  }
  showToast("🗑️ Video removed","info");render();
}
async function loadAdminYouTube(){
  if(!db) return;
  try{
    const {collection,getDocs,query,orderBy}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const q=query(collection(db,"youtube-links"),orderBy("created","desc"));
    const snap=await getDocs(q);
    state.adminYouTube=[];
    snap.forEach(d=>state.adminYouTube.push(d.data()));
    if(state.adminYouTube.length) render();
  }catch(e){}
}

// ══════════════════════════════════════════════════════════════
// 4. SHARED FILE UPLOAD (Firestore)
// ══════════════════════════════════════════════════════════════
const SKIP_FILES=["desktop.ini","thumbs.db",".ds_store",".gitignore",".gitkeep","__macosx"];
function isSystemFile(name){ const low=name.toLowerCase(); return low.startsWith(".")||SKIP_FILES.includes(low)||low.startsWith("~$"); }
function adminHandleFolderSelect(files){
  const valid=Array.from(files).filter(f=>!isSystemFile(f.name));
  if(!valid.length){showToast("⚠️ No valid files in folder","alarm");return;}
  showToast("📂 "+valid.length+" file(s) queued…","info");
  adminHandleFiles(valid);
}
async function adminHandleFiles(files){
  if(!isAdmin()){showToast("🔒 Admin only","alarm");return;}
  const sid=document.getElementById("adm-file-sub")?.value||"cpp";
  // FIX #3: Firestore documents are limited to ~1 MB. Base64 encoding inflates by ~33%,
  // so cap individual files at 700 KB raw to stay safely under the limit.
  const MAX_FILE_SIZE = 700 * 1024; // 700 KB
  const fileArr=Array.from(files).filter(f=>!isSystemFile(f.name));
  if(!fileArr.length){showToast("⚠️ No uploadable files","alarm");return;}
  // Warn about oversized files upfront
  const oversized = fileArr.filter(f=>f.size > MAX_FILE_SIZE);
  if(oversized.length){showToast(`⚠️ ${oversized.length} file(s) exceed 700 KB and will be skipped (Firestore limit). Use Firebase Storage for large files.`,"alarm");}
  const validArr = fileArr.filter(f=>f.size <= MAX_FILE_SIZE);
  if(!validArr.length){showToast("⚠️ All files exceed 700 KB limit","alarm");return;}
  const progressMap={};
  validArr.forEach(f=>{progressMap[f.name]={status:"⏳ Waiting…",done:false,ok:false,skipped:false};});
  function updateList(){
    const el=document.getElementById("adm-upload-list");
    if(!el) return;
    const total=validArr.length,done=Object.values(progressMap).filter(p=>p.done||p.skipped).length;
    const ok=Object.values(progressMap).filter(p=>p.ok).length,failed=Object.values(progressMap).filter(p=>p.done&&!p.ok&&!p.skipped).length;
    el.innerHTML=`<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:11px;color:#888;margin-bottom:4px">
      <span>${done<total?`Uploading ${done}/${total}…`:"All done"}</span>
      <span>${ok>0?`<span style="color:#06D6A0">${ok} ✅</span> `:""}${failed>0?`<span style="color:#FF6B35">${failed} ⚠️</span>`:""}</span></div>
      <div style="height:6px;background:#1a1a24;border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${total?Math.round((done/total)*100):0}%;background:linear-gradient(90deg,#06D6A0,#4ECDC4);border-radius:3px;transition:width 0.3s ease"></div>
      </div></div>
    ${Object.entries(progressMap).map(([name,p])=>{
      const icon=p.ok?"✅":p.skipped?"⏭️":p.done?"⚠️":"⏳";
      const border=p.ok?"#06D6A022":p.done&&!p.ok?"#FF6B3522":"#1e1e2e";
      return`<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#0a0a12;border:1px solid ${border};border-radius:8px;margin-bottom:4px">
        <span style="font-size:14px">${icon}</span>
        <div style="flex:1;min-width:0"><div style="font-size:11px;color:#ccc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(name)}</div>
        <div style="font-size:10px;color:#888;margin-top:1px">${p.status}</div></div></div>`;
    }).join("")}`;
  }
  updateList();
  let successCount=0;
  for(let i=0;i<validArr.length;i+=2){
    const batch=validArr.slice(i,i+2);
    await Promise.all(batch.map(async file=>{
      progressMap[file.name].status="📖 Reading…";updateList();
      const fileObj={id:genId(),name:file.name,size:file.size,type:file.type||"application/octet-stream",
        subjectId:sid,created:today(),note:"📤 Admin upload",uploadedBy:currentUser?.displayName||"Admin",shared:true,adminFile:true};
      try{
        // Read file as base64 data URL
        const dataURL=await new Promise((res,rej)=>{
          const r=new FileReader();
          r.onload=()=>res(r.result);
          r.onerror=()=>rej(new Error("Read failed"));
          r.readAsDataURL(file);
        });
        progressMap[file.name].status="☁️ Saving…";updateList();
        fileObj.data=dataURL;fileObj.downloadURL=null;
        if(db){try{const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");await setDoc(doc(db,"shared-files",fileObj.id),fileObj);}catch(fe){}}
        state.files.unshift(fileObj);LS("files",state.files.map(f=>({...f,data:null})));
        progressMap[file.name]={status:"✅ Shared!",done:true,ok:true};successCount++;
      }catch(err){
        progressMap[file.name]={status:"⚠️ "+err.message,done:true,ok:false};
      }
      updateList();
    }));
  }
  if(successCount>0){showToast(`✅ ${successCount} file(s) shared with all users!`,"success");spawnStars();}
}

// ══════════════════════════════════════════════════════════════
// 5. RESOURCE LINK MANAGER
// ══════════════════════════════════════════════════════════════
async function adminAddLink(){
  if(!isAdmin()) return;
  const label=(document.getElementById("link-label")?.value||"").trim();
  const url=(document.getElementById("link-url")?.value||"").trim();
  const icon=document.getElementById("link-icon")?.value||"🔗";
  if(!label||!url){showToast("⚠️ Fill label and URL","alarm");return;}
  if(db){
    try{
      const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const id=genId();
      await setDoc(doc(db,"links",id),{id,label,url,icon,created:today()});
      state.adminLinks.push({id,label,url,icon,created:today()});
      showToast("🔗 Link added!","success");
      ["link-label","link-url"].forEach(i=>{const el=document.getElementById(i);if(el)el.value="";});
      render();
    }catch(e){showToast("⚠️ "+e.message,"alarm");}
  }
}
async function adminDeleteLink(id){
  if(!isAdmin()) return;
  if(db){try{const {doc,deleteDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");await deleteDoc(doc(db,"links",id));}catch(e){}}
  state.adminLinks=state.adminLinks.filter(l=>l.id!==id);
  showToast("🗑️ Link removed","info");render();
}
async function loadAdminLinks(){
  if(!db) return;
  try{
    const {collection,getDocs}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDocs(collection(db,"links"));
    state.adminLinks=[];snap.forEach(d=>state.adminLinks.push(d.data()));
    if(state.adminLinks.length) render();
  }catch(e){ state.adminLinks=[]; }
}

// ══════════════════════════════════════════════════════════════
// 6. THEME CONTROL
// ══════════════════════════════════════════════════════════════
function applyTheme(cfg){
  if(!cfg) return;
  if(cfg.accent) document.documentElement.style.setProperty("--acc",cfg.accent);
  // Update all title elements robustly
  ["app-title","app-title-mobile"].forEach(tid=>{
    const el=document.getElementById(tid);
    if(el&&cfg.icon){
      // Preserve any child elements (e.g. pro badge spans) — only update text node
      const textNode=[...el.childNodes].find(n=>n.nodeType===3);
      if(textNode) textNode.textContent="Exam Is Near by ArkSetu "+(cfg.icon||"✦");
    }
  });
}
async function adminSaveTheme(){
  if(!isAdmin()) return;
  const accent=document.getElementById("cfg-accent")?.value||"#FFE66D";
  const icon=document.getElementById("cfg-icon")?.value?.trim()||"✦";
  const cfg={...(state.appConfig||{}),accent,icon};
  state.appConfig=cfg;LS("appConfig",cfg);applyTheme(cfg);
  if(db){
    try{const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await setDoc(doc(db,"config","theme"),cfg);showToast("🎨 Theme saved for all users!","success");spawnStars();}
    catch(e){showToast("Saved locally","info");}
  }
}
async function loadTheme(){
  if(!db) return;
  try{const {doc,getDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDoc(doc(db,"config","theme"));
    if(snap.exists()){state.appConfig={...(state.appConfig||{}),...snap.data()};applyTheme(state.appConfig);}
  }catch(e){}
}

// ══════════════════════════════════════════════════════════════
// 7. EXAM SCHEDULE SETTER
// ══════════════════════════════════════════════════════════════
async function adminSaveExamSchedule(){
  if(!isAdmin()) return;
  const schedule={};
  getSubjects().forEach(s=>{const v=document.getElementById("exam-date-"+s.id)?.value?.trim();if(v)schedule[s.id]=v;});
  if(db){
    try{const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await setDoc(doc(db,"config","examSchedule"),{schedule,updated:Date.now()});
      showToast("📅 Exam schedule updated for all users!","success");spawnStars();}
    catch(e){showToast("⚠️ "+e.message,"alarm");}
  }
}
async function loadExamSchedule(){
  if(!db) return;
  try{
    const {doc,getDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDoc(doc(db,"config","examSchedule"));
    if(snap.exists()){
      const {schedule}=snap.data();
      // Store in _examDateOverrides so dates persist and don't mutate shared objects
      Object.entries(schedule).forEach(([sid,date])=>{
        if(date && !_examDateOverrides[sid]) _examDateOverrides[sid]=date;
      });
      localStorage.setItem('st_examDates',JSON.stringify(_examDateOverrides));
    }
  }catch(e){}
}

// ══════════════════════════════════════════════════════════════
// 8. MAINTENANCE MODE
// ══════════════════════════════════════════════════════════════
async function adminToggleMaintenance(){
  if(!isAdmin()) return;
  if(!db){showToast("⚠️ Firebase not connected","alarm");return;}
  const msg=(document.getElementById("maint-msg")?.value||"").trim()||"We'll be back shortly.";
  if(db){
    try{const {doc,getDoc,setDoc,deleteDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const snap=await getDoc(doc(db,"config","maintenance"));
      if(snap.exists()&&snap.data().active){await deleteDoc(doc(db,"config","maintenance"));showToast("✅ Maintenance mode OFF","success");}
      else{await setDoc(doc(db,"config","maintenance"),{active:true,msg,updated:Date.now()});showToast("🔧 Maintenance mode ON — users see overlay","info");}
    }catch(e){showToast("⚠️ "+e.message,"alarm");}
  }
}
async function checkMaintenance(){
  if(!db||isAdmin()) return;
  try{const {doc,getDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDoc(doc(db,"config","maintenance"));
    if(snap.exists()&&snap.data().active){
      document.getElementById("maintenance-msg").textContent=snap.data().msg||"We'll be back shortly.";
      document.getElementById("maintenance-overlay").style.display="flex";
    }
  }catch(e){}
}

// ══════════════════════════════════════════════════════════════
// 9. PLATFORM ANALYTICS
// ══════════════════════════════════════════════════════════════
async function loadPlatformAnalytics(){
  if(!isAdmin()||!db) return;
  const el=document.getElementById("adm-analytics");
  if(!el) return;
  el.innerHTML="<div style='color:#555;font-size:12px;padding:12px'>⏳ Loading analytics…</div>";
  try{
    const {collection,getDocs}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDocs(collection(db,"study_tracker"));
    let totalUsers=0,totalHours=0,proCount=0;const subCounts={};
    getSubjects().forEach(s=>subCounts[s.id]=0);
    snap.forEach(d=>{
      totalUsers++;
      const data=d.data();
      if(data.studyLog) Object.values(data.studyLog).forEach(log=>{totalHours+=(log.hours||0);});
      if(data.progress) Object.entries(data.progress).forEach(([sid,p])=>{if(subCounts[sid]!==undefined) subCounts[sid]+=(p.done||[]).length;});
    });
    // Count Pro users from users collection
    try{
      const uSnap=await getDocs(collection(db,"users"));
      uSnap.forEach(d=>{ if(d.data().pro?.active) proCount++; });
    }catch(pe){}
    const topSubs=Object.entries(subCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
    el.innerHTML=`
      <div class="grid-3" style="gap:8px;margin-bottom:14px">
        ${[["👥","Total Users",totalUsers],["⏱️","Total Hours",Math.round(totalHours)+"h"],["⭐","Pro Users",proCount||"0"]].map(([ic,label,val])=>`
          <div style="background:#0a0a12;border:1px solid #1e1e2e;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">${ic}</div>
            <div style="font-size:18px;font-weight:bold;color:#FFE66D">${val}</div>
            <div style="font-size:10px;color:#444;margin-top:2px">${label}</div>
          </div>`).join("")}
      </div>
      <div style="font-size:11px;font-weight:bold;color:#555;letter-spacing:1px;margin-bottom:8px">TOP SUBJECTS BY TOPICS COMPLETED</div>
      ${topSubs.map(([sid,count])=>{
        const sub=getSubjects().find(s=>s.id===sid);
        const max=topSubs[0][1]||1;
        return`<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px">
          <div style="width:80px;font-size:11px;color:#888;text-align:right;flex-shrink:0">${sub?.name||sid}</div>
          <div style="flex:1;background:#111;border-radius:4px;height:8px;overflow:hidden">
            <div style="width:${Math.round((count/max)*100)}%;height:100%;background:linear-gradient(90deg,#FFE66D,#FF6B35);border-radius:4px;transition:width 0.5s ease"></div>
          </div>
          <div style="font-size:11px;color:#555;width:30px;text-align:left">${count}</div>
        </div>`;
      }).join("")}`;
  }catch(e){el.innerHTML="<div style='color:#555;font-size:12px;padding:12px'>⚠️ Could not load analytics</div>";}
}

// ══════════════════════════════════════════════════════════════
// 10. BACKUP & RESTORE
// ══════════════════════════════════════════════════════════════
function adminExportData(){
  const data={
    progress:state.progress, studyLog:state.studyLog, mood:state.mood,
    subjectNotes:state.subjectNotes, materials:state.materials,
    alarms:state.alarms, appConfig:state.appConfig,
    adminYouTube:state.adminYouTube, adminLinks:state.adminLinks,
    exportedAt:new Date().toISOString(), exportedBy:currentUser?.email||"admin"
  };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="arksetu-backup-"+today()+".json";
  a.click();
  showToast("💾 Backup downloaded!","success");
}
function adminImportData(input){
  const file=input.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const data=JSON.parse(e.target.result);
      if(!confirm("This will overwrite current data. Continue?")) return;
      if(data.progress) state.progress=data.progress;
      if(data.studyLog) state.studyLog=data.studyLog;
      if(data.materials) state.materials=data.materials;
      if(data.alarms) state.alarms=data.alarms;
      if(data.appConfig){state.appConfig=data.appConfig;applyTheme(data.appConfig);}
      if(data.adminYouTube) state.adminYouTube=data.adminYouTube;
      if(data.adminLinks) state.adminLinks=data.adminLinks;
      S("progress",state.progress);S("studyLog",state.studyLog);
      S("materials",state.materials);S("alarms",state.alarms);
      showToast("✅ Data imported and synced!","success");spawnStars();render();
    }catch(err){showToast("⚠️ Invalid backup file","alarm");}
  };
  reader.readAsText(file);
}

// ══════════════════════════════════════════════════════════════
// 11. AI PROMPT TUNING (per-subject system prompt)
// ══════════════════════════════════════════════════════════════
async function adminSaveAIPrompt(){
  if(!isAdmin()) return;
  const subjectId=document.getElementById("ai-prompt-sub")?.value||"cpp";
  const prompt=(document.getElementById("ai-prompt-text")?.value||"").trim();
  if(!prompt){showToast("⚠️ Enter a prompt","alarm");return;}
  const prompts=JSON.parse(localStorage.getItem("admin_ai_prompts")||"{}");
  prompts[subjectId]=prompt;
  localStorage.setItem("admin_ai_prompts",JSON.stringify(prompts));
  if(db){
    try{const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await setDoc(doc(db,"config","aiPrompts"),{prompts,updated:Date.now()});
      showToast("🤖 AI prompt saved for "+getSubjects().find(s=>s.id===subjectId)?.name+"!","success");}
    catch(e){showToast("Saved locally","info");}
  }
}
function getAdminAIPrompt(subjectId){
  try{const prompts=JSON.parse(localStorage.getItem("admin_ai_prompts")||"{}");return prompts[subjectId]||"";}catch(e){return "";}
}

// ══════════════════════════════════════════════════════════════
// 12. BATCH QUIZ PUBLISHER
// ══════════════════════════════════════════════════════════════
async function adminPublishQuizBank(){
  if(!isAdmin()) return;
  const subjectId=document.getElementById("quiz-bank-sub")?.value||"cpp";
  const raw=(document.getElementById("quiz-bank-json")?.value||"").trim();
  if(!raw){showToast("⚠️ Paste a JSON question bank","alarm");return;}
  let questions;
  try{questions=JSON.parse(raw);}catch(e){showToast("⚠️ Invalid JSON — check format","alarm");return;}
  if(!Array.isArray(questions)||!questions.length){showToast("⚠️ JSON must be an array of questions","alarm");return;}
  // Normalise field names: support both "ans" and "answer" from pasted JSON
  questions = questions.map(q=>({...q, answer: q.answer!==undefined?q.answer:(q.ans!==undefined?q.ans:0)}));
  const bank={id:genId(),subjectId,questions,published:today(),publishedBy:currentUser?.displayName||"Admin",count:questions.length};
  if(db){
    try{const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await setDoc(doc(db,"quiz-banks",bank.id),bank);
      showToast(`✅ ${questions.length} questions published!`,"success");spawnStars();
      document.getElementById("quiz-bank-json").value="";
    }catch(e){showToast("⚠️ "+e.message,"alarm");}
  }
}

// ══════════════════════════════════════════════════════════════
// 13. USER NOTES FEED (anonymised)
// ══════════════════════════════════════════════════════════════
async function loadUserNotesFeed(){
  if(!isAdmin()||!db) return;
  const el=document.getElementById("adm-feed");
  if(!el) return;
  el.innerHTML="<div style='color:#555;font-size:12px;padding:12px'>⏳ Loading recent notes…</div>";
  try{
    const {collection,getDocs,query,orderBy,limit}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDocs(collection(db,"study_tracker"));
    const allNotes=[];
    snap.forEach(d=>{
      const data=d.data();
      if(data.materials&&Array.isArray(data.materials)){
        data.materials.filter(m=>!m.adminNote).forEach(m=>{
          allNotes.push({title:m.title,type:m.type,subjectId:m.subjectId,created:m.created});
        });
      }
    });
    allNotes.sort((a,b)=>b.created>a.created?1:-1);
    const recent=allNotes.slice(0,20);
    if(!recent.length){el.innerHTML="<div style='color:#333;font-size:12px;text-align:center;padding:20px'>No user notes yet</div>";return;}
    const subMap={};getSubjects().forEach(s=>subMap[s.id]=s.name);
    el.innerHTML=recent.map(n=>`
      <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:#0a0a12;border:1px solid #1e1e2e;border-radius:8px;margin-bottom:6px">
        <div style="font-size:16px">${n.type?.split(" ")[0]||"📝"}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;color:#ccc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(n.title)}</div>
          <div style="font-size:10px;color:#444">${subMap[n.subjectId]||n.subjectId} · ${n.created}</div>
        </div>
      </div>`).join("");
  }catch(e){el.innerHTML="<div style='color:#555;font-size:12px;padding:12px'>⚠️ Could not load feed</div>";}
}

// ══════════════════════════════════════════════════════════════
// 14. LEADERBOARD CONTROL
// ══════════════════════════════════════════════════════════════
async function adminToggleLeaderboard(){
  if(!isAdmin()) return;
  const anonymous=document.getElementById("lb-anonymous")?.checked!==false;
  const limit=parseInt(document.getElementById("lb-limit")?.value||"10");
  if(db){
    try{const {doc,getDoc,setDoc,deleteDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const snap=await getDoc(doc(db,"config","leaderboard"));
      if(snap.exists()&&snap.data().enabled){
        await deleteDoc(doc(db,"config","leaderboard"));
        showToast("🏆 Leaderboard turned OFF","info");
      }else{
        await setDoc(doc(db,"config","leaderboard"),{enabled:true,anonymous,limit,updated:Date.now()});
        showToast("🏆 Leaderboard is now LIVE for all users!","success");spawnStars();
      }
    }catch(e){showToast("⚠️ "+e.message,"alarm");}
  }
}
async function adminLoadLeaderboard(){
  if(!isAdmin()||!db) return;
  const el=document.getElementById("adm-leaderboard-preview");
  if(!el) return;
  el.innerHTML="<div style='color:#555;font-size:11px'>⏳ Loading…</div>";
  try{
    const {collection,getDocs}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDocs(collection(db,"study_tracker"));
    const users=[];
    snap.forEach(d=>{
      const data=d.data();
      const hours=Object.values(data.studyLog||{}).reduce((s,l)=>s+(l.hours||0),0);
      users.push({hours:Math.round(hours*10)/10,uid:d.id.slice(0,8)+"…"});
    });
    users.sort((a,b)=>b.hours-a.hours);
    const medals=["🥇","🥈","🥉"];
    el.innerHTML=users.slice(0,10).map((u,i)=>`
      <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#0a0a12;border:1px solid #1e1e2e;border-radius:8px;margin-bottom:5px">
        <span style="font-size:14px;width:20px;text-align:center">${medals[i]||"#"+(i+1)}</span>
        <div style="flex:1;font-size:11px;color:#888">Anonymous user ${u.uid}</div>
        <div style="font-size:12px;font-weight:bold;color:#FFE66D">${u.hours}h</div>
      </div>`).join("")||"<div style='color:#333;font-size:11px;text-align:center;padding:12px'>No data yet</div>";
  }catch(e){el.innerHTML="<div style='color:#555;font-size:11px'>⚠️ Error loading</div>";}
}

// ══════════════════════════════════════════════════════════════
// 15. COUPON CODE MANAGER
// ══════════════════════════════════════════════════════════════
async function adminCreateCoupon(){
  if(!isAdmin()) return;
  const code=(document.getElementById("coupon-code")?.value||"").trim().toUpperCase();
  const discount=parseInt(document.getElementById("coupon-discount")?.value||"0");
  const uses=parseInt(document.getElementById("coupon-uses")?.value||"100");
  const expiry=document.getElementById("coupon-expiry")?.value||"";
  if(!code){showToast("⚠️ Enter a coupon code","alarm");return;}
  if(!discount||discount<1||discount>100){showToast("⚠️ Discount must be 1-100%","alarm");return;}
  const coupon={id:genId(),code,discount,uses,usesLeft:uses,expiry:expiry||null,created:today(),createdBy:currentUser?.displayName||"Admin",active:true};
  if(db){
    try{const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await setDoc(doc(db,"coupons",coupon.id),coupon);
      _adminCoupons.unshift(coupon);
      showToast(`🎟️ Coupon "${code}" created!`,"success");spawnStars();
      ["coupon-code","coupon-discount","coupon-uses","coupon-expiry"].forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});
      render();
    }catch(e){showToast("⚠️ "+e.message,"alarm");}
  }
}
async function adminLoadCoupons(){
  if(!isAdmin()||!db) return;
  try{const {collection,getDocs}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDocs(collection(db,"coupons"));
    _adminCoupons=[];snap.forEach(d=>_adminCoupons.push(d.data()));
    _adminCoupons.sort((a,b)=>b.created>a.created?-1:1);
    render();
  }catch(e){}
}
async function adminDeleteCoupon(id){
  if(!isAdmin()) return;
  if(!confirm("Deactivate this coupon?")) return;
  if(db){try{const {doc,deleteDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");await deleteDoc(doc(db,"coupons",id));}catch(e){}}
  _adminCoupons=_adminCoupons.filter(c=>c.id!==id);
  showToast("🗑️ Coupon removed","info");render();
}

// ══════════════════════════════════════════════════════════════
// SHARED FILE HELPERS (used across admin + sync tab)
// ══════════════════════════════════════════════════════════════
async function adminDeleteSharedFile(id){
  if(!isAdmin()){showToast("🔒 Admin only","alarm");return;}
  if(!confirm("Delete this shared file for all users?")) return;
  state.files=state.files.filter(f=>f.id!==id);
  LS("files",state.files);
  if(db){try{const {doc,deleteDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");await deleteDoc(doc(db,"shared-files",id));}catch(e){}}
  showToast("🗑️ Shared file deleted","info");render();
}
async function adminPinFile(id){
  if(!isAdmin()) return;
  const f=state.files.find(f=>f.id===id);
  if(!f) return;
  f.pinned=!f.pinned;
  if(db){try{const {doc,updateDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");await updateDoc(doc(db,"shared-files",id),{pinned:f.pinned});}catch(e){}}
  render();
}

// ══════════════════════════════════════════════════════════════
// DRIVE LINK HELPERS
// ══════════════════════════════════════════════════════════════
function loadGISScript(){ return Promise.resolve(); }
function admDriveTab(){}
function admDriveAutoDetect(){}
function admUpdatePreview(){}
async function adminAddDriveLink(){
  if(!isAdmin()){showToast("🔒 Admin only","alarm");return;}
  const name=(document.getElementById("adm-dl-name")?.value||"").trim();
  const url=(document.getElementById("adm-dl-url")?.value||"").trim();
  if(!name){showToast("⚠️ Enter a display name","alarm");return;}
  if(!url||!url.includes("drive.google")){showToast("⚠️ Must be a Google Drive link","alarm");return;}
  const isFolder=url.includes("/drive/folders/");
  const fileObj={id:genId(),name:(isFolder?"📁 ":"📄 ")+name,size:0,type:isFolder?"drive-folder":"drive-link",
    subjectId:document.getElementById("adm-dl-sub")?.value||"cpp",created:today(),
    note:isFolder?"📁 Google Drive Folder":"📎 Google Drive File",
    uploadedBy:currentUser?.displayName||"Admin",driveLink:url,isDriveLink:true,shared:true,adminFile:true,downloadURL:url};
  state.files.unshift(fileObj);LS("files",state.files);
  if(db){try{const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");await setDoc(doc(db,"shared-files",fileObj.id),fileObj);}catch(e){}}
  showToast("✅ Drive link shared with all users!","success");spawnStars();render();
  ["adm-dl-name","adm-dl-url"].forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});
}



function renderAdmin(){
  if(!currentUser) return `<div class="fade-in"><div class="empty-state" style="padding-top:60px">
    <div style="font-size:48px;margin-bottom:12px">🔒</div>
    <div style="font-size:16px;font-weight:bold">Sign in Required</div>
    <button onclick="googleSignIn()" style="margin-top:20px;background:linear-gradient(135deg,#4285F4,#34A853);border:none;color:#fff;padding:12px 24px;border-radius:12px;font-family:inherit;font-size:14px;cursor:pointer;font-weight:bold">Sign in with Google</button>
  </div></div>`;
  if(!isAdmin()) return `<div class="fade-in"><div class="empty-state" style="padding-top:60px">
    <div style="font-size:48px;margin-bottom:12px">🔒</div>
    <div style="font-size:16px;font-weight:bold;color:#FF6B35">Admin Access Only</div>
    <div style="font-size:12px;color:#555;margin-top:8px">Restricted to site administrator</div>
  </div></div>`;
  const adminNotes=(state.materials||[]).filter(m=>m.adminNote);
  const sharedFiles=(state.files||[]).filter(f=>f.adminFile||f.shared);
  return `<div class="fade-in">
    <!-- Header -->
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <div style="font-size:28px">🔑</div>
      <div>
        <div style="font-size:20px;font-weight:bold;background:linear-gradient(90deg,#FFE66D,#FF6B35);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Admin Panel</div>
        <div style="font-size:11px;color:#444">ArkSetu · ${esc(currentUser.displayName||"Admin")} · ${esc(currentUser.email||"")}</div>
      </div>
    </div>

    <!-- ① ANNOUNCEMENTS -->
    <div class="card" style="margin-bottom:14px;border-color:#FFE66D44">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">📢</span>
        <div style="font-size:14px;font-weight:bold;color:#FFE66D">Announcements</div>
      </div>
      <input id="ann-title" placeholder="Title e.g. Exam postponed" style="margin-bottom:8px"/>
      <textarea id="ann-body" rows="3" placeholder="Full announcement message…" style="margin-bottom:8px"></textarea>
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#888;margin-bottom:12px;cursor:pointer">
        <input type="checkbox" id="ann-popup" style="width:auto"/> Show as popup on next visit
      </label>
      <div style="display:flex;gap:8px">
        <button class="btn-gold" onclick="adminPublishAnnouncement()" style="padding:9px 18px;font-size:12px">📢 Publish</button>
        <button class="btn-ghost" onclick="adminClearAnnouncement()" style="font-size:12px">🗑️ Clear</button>
      </div>
    </div>

    <!-- ② PUBLISH NOTE -->
    <div class="card" style="margin-bottom:14px;border-color:#4ECDC444">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">📤</span>
        <div style="font-size:14px;font-weight:bold;color:#4ECDC4">Publish Note for All Users</div>
      </div>
      <div class="grid-2" style="margin-bottom:10px">
        <div><div class="section-label">SUBJECT</div>
          <select id="adm-sub">${getSubjects().map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join("")}</select></div>
        <div><div class="section-label">TYPE</div>
          <select id="adm-type">${NOTE_TYPES.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join("")}</select></div>
      </div>
      <input id="adm-title" placeholder="Title *" style="margin-bottom:8px"/>
      <textarea id="adm-content" rows="4" placeholder="Content *" style="margin-bottom:8px"></textarea>
      <input id="adm-tags" placeholder="Tags: unit3, exam (comma separated)" style="margin-bottom:12px"/>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn-gold" onclick="adminUploadNote()" style="padding:10px 22px">📤 Publish</button>
        <span style="font-size:11px;color:#444">${adminNotes.length} note(s) published</span>
      </div>
      ${adminNotes.length>0?`<div style="margin-top:12px;border-top:1px solid #1e1e2e;padding-top:12px">
        ${adminNotes.slice(0,5).map(n=>`<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#0a0a12;border:1px solid #1e1e2e;border-radius:8px;margin-bottom:5px">
          <div style="flex:1;min-width:0">
            <div style="font-size:11px;font-weight:bold;color:#FFE66D;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(n.title)}</div>
            <div style="font-size:10px;color:#444">${n.type} · ${getSubjects().find(s=>s.id===n.subjectId)?.name||n.subjectId}</div>
          </div>
          <button onclick="adminEditNote('${n.id}')" class="icon-btn">✏️</button>
          <button onclick="deleteMaterial('${n.id}')" class="icon-btn" style="color:#663333">🗑️</button>
        </div>`).join("")}
      </div>`:""}
    </div>

    <!-- ③ YOUTUBE PUBLISHER -->
    <div class="card" style="margin-bottom:14px;border-color:#FF000044">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">▶️</span>
        <div style="font-size:14px;font-weight:bold;color:#FF4444">YouTube Publisher</div>
      </div>
      <div class="grid-2" style="margin-bottom:10px">
        <div><div class="section-label">SUBJECT</div>
          <select id="adm-yt-sub">${getSubjects().map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join("")}</select></div>
        <div><div class="section-label">VIDEO TITLE</div>
          <input id="adm-yt-title" placeholder="e.g. Newton's Laws Full Lecture"/></div>
      </div>
      <input id="adm-yt-url" placeholder="https://youtu.be/… or youtube.com/watch?v=…" style="margin-bottom:8px"/>
      <input id="adm-yt-desc" placeholder="Short description (optional)" style="margin-bottom:12px"/>
      <button onclick="adminPublishYouTube()" style="background:linear-gradient(135deg,#FF0000,#cc0000);border:none;color:#fff;padding:10px 22px;border-radius:10px;font-family:inherit;font-size:12px;cursor:pointer;font-weight:bold">▶️ Publish Video</button>
      ${(state.adminYouTube||[]).length>0?`<div style="margin-top:12px;border-top:1px solid #1e1e2e;padding-top:10px">
        ${(state.adminYouTube||[]).slice(0,4).map(v=>{
          const ytId=getYouTubeId(v.url);
          return`<div style="display:flex;align-items:center;gap:10px;padding:8px;background:#0f0f18;border:1px solid #FF000033;border-radius:10px;margin-bottom:6px">
            <div style="width:64px;height:44px;border-radius:6px;background:#1a0a0a;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;cursor:pointer" onclick="window.open('${esc(v.url)}','_blank')">
              ${ytId?`<img src="https://img.youtube.com/vi/${ytId}/mqdefault.jpg" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='▶️'"/>`:"▶️"}
            </div>
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;font-weight:bold;color:#ccc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(v.title)}</div>
              <div style="font-size:10px;color:#555">${getSubjects().find(s=>s.id===v.subjectId)?.name||v.subjectId} · ${v.created}</div>
            </div>
            <button onclick="adminDeleteYouTube('${v.id}')" class="icon-btn" style="color:#663333">🗑️</button>
          </div>`;
        }).join("")}
      </div>`:""}
    </div>

    <!-- ④ FILE UPLOAD -->
    <div class="card" style="margin-bottom:14px;border-color:#06D6A044">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">📁</span>
        <div style="font-size:14px;font-weight:bold;color:#06D6A0">Shared File Upload</div>
      </div>
      <input type="file" id="adm-file-input" multiple accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.xlsx,.xls,.csv,.txt,.docx,.pptx,.mp4,.mp3,.zip" style="display:none" onchange="adminHandleFiles(this.files)"/>
      <input type="file" id="adm-folder-input" webkitdirectory mozdirectory multiple style="display:none" onchange="adminHandleFolderSelect(this.files)"/>
      <div class="section-label">SUBJECT</div>
      <select id="adm-file-sub" style="margin-bottom:10px">${getSubjects().map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join("")}</select>
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <button class="btn-gold" onclick="document.getElementById('adm-file-input').click()" style="flex:1;padding:9px;font-size:12px">📄 Upload Files</button>
        <button class="btn-ghost" onclick="document.getElementById('adm-folder-input').click()" style="flex:1;padding:9px;font-size:12px">📁 Upload Folder</button>
      </div>
      <div style="border:2px dashed #06D6A044;border-radius:10px;padding:16px;text-align:center;cursor:pointer;background:#040a06;margin-bottom:10px"
        ondragover="event.preventDefault();this.style.borderColor='#06D6A0'" ondragleave="this.style.borderColor='#06D6A044'"
        ondrop="event.preventDefault();this.style.borderColor='#06D6A044';adminHandleFiles(event.dataTransfer.files)"
        onclick="document.getElementById('adm-file-input').click()">
        <div style="font-size:24px">📂</div><div style="font-size:12px;color:#555">Drop files here or click to upload</div>
      </div>
      <div id="adm-upload-list"></div>
      ${sharedFiles.length>0?`<div style="margin-top:10px;font-size:11px;color:#444">${sharedFiles.length} file(s) shared with all users</div>`:""}
    </div>

    <!-- ⑤ RESOURCE LINK MANAGER -->
    <div class="card" style="margin-bottom:14px;border-color:#4ECDC444">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">🔗</span>
        <div style="font-size:14px;font-weight:bold;color:#4ECDC4">Resource Link Manager</div>
      </div>
      <div class="grid-2" style="gap:8px;margin-bottom:8px">
        <input id="link-icon" placeholder="Icon e.g. 📄" style="font-size:12px"/>
        <input id="link-label" placeholder="Label e.g. PYQ 2023" style="font-size:12px"/>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <input id="link-url" placeholder="https://…" style="flex:1;font-size:12px"/>
        <button class="btn-gold" onclick="adminAddLink()" style="padding:9px 16px;font-size:12px;white-space:nowrap">+ Add</button>
      </div>
      ${(state.adminLinks||[]).length>0?`
        <div style="border-top:1px solid #1e1e2e;padding-top:10px">
          ${(state.adminLinks||[]).map(l=>`<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#0a0a12;border:1px solid #1e1e2e;border-radius:8px;margin-bottom:5px">
            <span style="font-size:16px">${l.icon||"🔗"}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;color:#ccc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(l.label)}</div>
              <div style="font-size:10px;color:#444;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(l.url)}</div>
            </div>
            <a href="${esc(l.url)}" target="_blank" style="font-size:10px;color:#4ECDC4;padding:3px 7px;border:1px solid #4ECDC444;border-radius:6px;text-decoration:none">↗</a>
            <button onclick="adminDeleteLink('${l.id}')" class="icon-btn" style="color:#663333">🗑️</button>
          </div>`).join("")}
        </div>`:`<div style="font-size:12px;color:#333;text-align:center;padding:10px">No links added yet</div>`}
    </div>

    <!-- ⑥ THEME CONTROL -->
    <div class="card" style="margin-bottom:14px;border-color:#C77DFF44">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">🎨</span>
        <div style="font-size:14px;font-weight:bold;color:#C77DFF">Theme Control</div>
      </div>
      <div class="grid-2" style="gap:8px;margin-bottom:12px">
        <div>
          <div class="section-label">ACCENT COLOUR</div>
          <div style="display:flex;gap:8px;align-items:center">
            <input type="color" id="cfg-accent" value="${esc(state.appConfig?.accent||'#FFE66D')}" style="width:44px;height:36px;padding:2px;border-radius:8px;cursor:pointer;flex-shrink:0"/>
            <span style="font-size:11px;color:#555">Tap to change</span>
          </div>
        </div>
        <div>
          <div class="section-label">APP ICON</div>
          <input id="cfg-icon" placeholder="✦ emoji or symbol" value="${esc(state.appConfig?.icon||'✦')}" style="font-size:18px"/>
        </div>
      </div>
      <button class="btn-gold" onclick="adminSaveTheme()" style="padding:9px 20px;font-size:12px">🎨 Apply Theme for All Users</button>
    </div>

    <!-- ⑦ EXAM SCHEDULE SETTER -->
    <div class="card" style="margin-bottom:14px;border-color:#FF6B3544">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">📅</span>
        <div style="font-size:14px;font-weight:bold;color:#FF6B35">Exam Schedule Setter</div>
      </div>
      <div style="font-size:11px;color:#555;margin-bottom:12px">Overrides individual user exam dates for all accounts</div>
      ${getSubjects().map(s=>`<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="font-size:16px;width:24px">${s.icon}</span>
        <span style="font-size:12px;color:#888;flex:1">${esc(s.name)}</span>
        <input type="text" id="exam-date-${s.id}" value="${getExamDate(s.id)||''}" placeholder="e.g. 18 May 2026" style="width:160px;font-size:12px"/>
      </div>`).join("")}
      <button class="btn-gold" onclick="adminSaveExamSchedule()" style="margin-top:8px;padding:9px 20px;font-size:12px">📅 Save Schedule</button>
    </div>

    <!-- ⑧ MAINTENANCE MODE -->
    <div class="card" style="margin-bottom:14px;border-color:#FF6B3533">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="font-size:18px">🔧</span>
        <div style="font-size:14px;font-weight:bold;color:#FF6B35">Maintenance Mode</div>
      </div>
      <div style="font-size:11px;color:#555;margin-bottom:10px">When ON, non-admin users see a maintenance overlay and cannot use the app</div>
      <input id="maint-msg" placeholder="Message e.g. Back in 10 mins 🔧" style="font-size:12px;margin-bottom:10px"/>
      <button onclick="adminToggleMaintenance()" style="background:linear-gradient(135deg,#FF6B35,#cc3300);border:none;color:#fff;padding:10px 18px;border-radius:10px;font-family:inherit;font-size:12px;cursor:pointer;font-weight:bold">🔧 Toggle Maintenance</button>
    </div>

    <!-- ⑨ PLATFORM ANALYTICS -->
    <div class="card" style="margin-bottom:14px;border-color:#06D6A033">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">📊</span>
          <div style="font-size:14px;font-weight:bold;color:#06D6A0">Platform Analytics</div>
        </div>
        <button class="btn-ghost" onclick="loadPlatformAnalytics()" style="font-size:11px;padding:6px 12px">🔄 Refresh</button>
      </div>
      <div id="adm-analytics">
        <div style="font-size:12px;color:#333;text-align:center;padding:20px">Click Refresh to load analytics</div>
      </div>
    </div>

    <!-- ⑩ BACKUP & RESTORE -->
    <div class="card" style="margin-bottom:14px;border-color:#C77DFF33">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">💾</span>
        <div style="font-size:14px;font-weight:bold;color:#C77DFF">Backup & Restore</div>
      </div>
      <div style="font-size:11px;color:#555;margin-bottom:12px">Export your full app state as JSON. Import to restore or migrate to another Firebase project.</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-gold" onclick="adminExportData()" style="padding:9px 18px;font-size:12px">⬇ Export Backup</button>
        <button class="btn-ghost" onclick="document.getElementById('admin-import-input').click()" style="font-size:12px">⬆ Import Backup</button>
        <input type="file" id="admin-import-input" accept=".json" style="display:none" onchange="adminImportData(this)"/>
      </div>
    </div>

    <!-- ⑪ AI PROMPT TUNING -->
    <div class="card" style="margin-bottom:14px;border-color:#FFE66D33">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">🤖</span>
        <div style="font-size:14px;font-weight:bold;color:#FFE66D">AI Prompt Tuning</div>
      </div>
      <div style="font-size:11px;color:#555;margin-bottom:12px">Customise the AI assistant's system prompt per subject — tailor its tone, exam focus, and personality.</div>
      <div class="section-label">SUBJECT</div>
      <select id="ai-prompt-sub" style="margin-bottom:10px" onchange="(()=>{const prompts=JSON.parse(localStorage.getItem('admin_ai_prompts')||'{}');const el=document.getElementById('ai-prompt-text');if(el)el.value=prompts[this.value]||'';})()">
        ${getSubjects().map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join("")}
      </select>
      <textarea id="ai-prompt-text" rows="5" placeholder="You are an expert ${"{subject}"} tutor helping a NEET 2026 student. Be concise, exam-focused, use bullet points. Always end with a quick memory tip." style="margin-bottom:10px;font-size:12px"></textarea>
      <button class="btn-gold" onclick="adminSaveAIPrompt()" style="padding:9px 18px;font-size:12px">🤖 Save Prompt</button>
    </div>

    <!-- ⑫ BATCH QUIZ PUBLISHER -->
    <div class="card" style="margin-bottom:14px;border-color:#4ECDC433">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">📝</span>
        <div style="font-size:14px;font-weight:bold;color:#4ECDC4">Batch Quiz Publisher</div>
      </div>
      <div style="font-size:11px;color:#555;margin-bottom:10px">Paste a JSON array of questions to publish a quiz bank for all users. Format: <code style="background:#1a1a2a;padding:1px 6px;border-radius:4px;color:#4ECDC4;font-size:10px">[{"q":"…","options":["A","B","C","D"],"answer":0,"explanation":"…"}]</code></div>
      <div class="section-label">SUBJECT</div>
      <select id="quiz-bank-sub" style="margin-bottom:10px">${getSubjects().map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join("")}</select>
      <textarea id="quiz-bank-json" rows="6" placeholder='[{"q":"What is Newton's 1st law?","options":["Inertia","Momentum","Gravity","None"],"answer":0,"explanation":"Objects at rest stay at rest…"}]' style="font-size:11px;margin-bottom:10px;font-family:'JetBrains Mono',monospace"></textarea>
      <button class="btn-gold" onclick="adminPublishQuizBank()" style="padding:9px 18px;font-size:12px">📝 Publish Quiz Bank</button>
    </div>

    <!-- ⑬ USER NOTES FEED -->
    <div class="card" style="margin-bottom:14px;border-color:#FF6B3533">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">👥</span>
          <div style="font-size:14px;font-weight:bold;color:#FF6B35">User Notes Feed</div>
        </div>
        <button class="btn-ghost" onclick="loadUserNotesFeed()" style="font-size:11px;padding:6px 12px">🔄 Load</button>
      </div>
      <div style="font-size:11px;color:#555;margin-bottom:10px">Anonymised view of recent notes created by users — spot syllabus gaps and popular topics.</div>
      <div id="adm-feed"><div style="font-size:12px;color:#333;text-align:center;padding:16px">Click Load to see recent user notes</div></div>
    </div>

    <!-- ⑭ LEADERBOARD CONTROL -->
    <div class="card" style="margin-bottom:14px;border-color:#FFE66D33">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">🏆</span>
        <div style="font-size:14px;font-weight:bold;color:#FFE66D">Leaderboard Control</div>
      </div>
      <div style="font-size:11px;color:#555;margin-bottom:12px">Toggle a global study-hours leaderboard visible to all users. Preview who's on top before enabling.</div>
      <div class="grid-2" style="gap:8px;margin-bottom:12px">
        <div>
          <div class="section-label">SHOW TOP</div>
          <select id="lb-limit" style="font-size:12px">
            <option value="5">Top 5</option><option value="10" selected>Top 10</option><option value="20">Top 20</option>
          </select>
        </div>
        <div style="display:flex;align-items:flex-end;padding-bottom:2px">
          <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#888;cursor:pointer">
            <input type="checkbox" id="lb-anonymous" checked style="width:auto"/> Show anonymously
          </label>
        </div>
      </div>
      <div id="adm-leaderboard-preview" style="margin-bottom:12px">
        <div style="font-size:11px;color:#333;text-align:center;padding:10px">Click Load Preview to see current leaderboard</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn-ghost" onclick="adminLoadLeaderboard()" style="font-size:11px;padding:7px 14px">👁 Load Preview</button>
        <button class="btn-gold" onclick="adminToggleLeaderboard()" style="padding:9px 18px;font-size:12px">🏆 Toggle Leaderboard</button>
      </div>
    </div>

    <!-- ⑮ COUPON CODE MANAGER -->
    <div class="card" style="margin-bottom:14px;border-color:#06D6A033">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">🎟️</span>
        <div style="font-size:14px;font-weight:bold;color:#06D6A0">Coupon Code Manager</div>
      </div>
      <div style="font-size:11px;color:#555;margin-bottom:12px">Create discount codes for Pro subscriptions — perfect for giveaways, partnerships, and campaigns.</div>
      <div class="grid-2" style="gap:8px;margin-bottom:8px">
        <div><div class="section-label">CODE</div>
          <input id="coupon-code" placeholder="NEET50" style="font-size:12px;font-family:'JetBrains Mono',monospace;text-transform:uppercase"/></div>
        <div><div class="section-label">DISCOUNT %</div>
          <input id="coupon-discount" type="number" min="1" max="100" placeholder="50" style="font-size:12px"/></div>
      </div>
      <div class="grid-2" style="gap:8px;margin-bottom:12px">
        <div><div class="section-label">MAX USES</div>
          <input id="coupon-uses" type="number" min="1" placeholder="100" style="font-size:12px"/></div>
        <div><div class="section-label">EXPIRY DATE</div>
          <input id="coupon-expiry" type="date" style="font-size:12px"/></div>
      </div>
      <button class="btn-gold" onclick="adminCreateCoupon()" style="padding:9px 18px;font-size:12px;margin-bottom:14px">🎟️ Create Coupon</button>
      ${_adminCoupons.length>0?`<div style="border-top:1px solid #1e1e2e;padding-top:10px">
        <div style="font-size:11px;color:#444;font-weight:bold;letter-spacing:1px;margin-bottom:8px">ACTIVE COUPONS</div>
        ${_adminCoupons.map(c=>`<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:#0a0a12;border:1px solid #06D6A022;border-radius:8px;margin-bottom:6px">
          <code style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#06D6A0;font-weight:bold">${esc(c.code)}</code>
          <span style="font-size:10px;background:#FFE66D22;color:#FFE66D;padding:2px 7px;border-radius:6px">${c.discount}% OFF</span>
          <div style="flex:1;font-size:10px;color:#444">${c.usesLeft||c.uses} uses left${c.expiry?" · exp "+c.expiry:""}</div>
          <button onclick="adminDeleteCoupon('${c.id}')" class="icon-btn" style="color:#663333">🗑️</button>
        </div>`).join("")}
      </div>`:
      `<div style="font-size:11px;color:#333;text-align:center;padding:8px">No coupons yet — <button onclick="adminLoadCoupons()" style="background:none;border:none;color:#06D6A0;cursor:pointer;font-family:inherit;font-size:11px">Load existing</button></div>`}
    </div>

  </div>`;
}

// ── PROFILE PAGE ──────────────────────────────────────────────

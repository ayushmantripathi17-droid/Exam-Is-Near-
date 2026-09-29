import { AppStateShared, state } from "../../../core/app-state.js";
import { LS, S, driveAccessToken, driveFolderId, driveStatus } from "../../../core/firebase-sync.js";
import { render } from "../ui/render-core.js";
import { esc, genId, showToast, today } from "../../../utils/helpers.js";
import { spawnStars } from "./clock-alarms-timer.js";
import { getSubjects } from "../../../core/course-selector.js";
import { _proCache, isProUser, openProModal } from "./payments-pro.js";
import { getDaysLeft, getExamDate, getStreak, getSubjectPct, getTotalHours, getTotalPct } from "./exam-dates-actions.js";
import { askAI } from "./ai-assistant-setup.js";

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
async function renderProfile(){
  const pro = await isProUser();
  const pct=getTotalPct();
  const totalHours=getTotalHours();
  const streak=getStreak();
  const subProgress=getSubjects().map(s=>({...s,pct:getSubjectPct(s.id)}));
  const badges=[];
  if(pct>=100) badges.push({icon:"🏆",name:"Perfect Score",desc:"100% done"});
  if(pct>=75) badges.push({icon:"⭐",name:"Star Student",desc:"75%+ done"});
  if(pct>=50) badges.push({icon:"📚",name:"Halfway Hero",desc:"50%+ done"});
  if(streak>=7) badges.push({icon:"🔥",name:"Week Warrior",desc:"7-day streak"});
  if(streak>=3) badges.push({icon:"✨",name:"On a Roll",desc:"3-day streak"});
  if(totalHours>=20) badges.push({icon:"⏰",name:"Time Investor",desc:"20+ hours"});
  if(totalHours>=5) badges.push({icon:"💪",name:"Getting Started",desc:"5+ hours"});
  if(state.files.length>=5) badges.push({icon:"📁",name:"File Hoarder",desc:"5+ files"});
  if(state.materials.length>=10) badges.push({icon:"🗂️",name:"Note Taker",desc:"10+ notes"});
  if(badges.length===0) badges.push({icon:"🌱",name:"Beginner",desc:"Just started!"});
  let rank="🌱 Seedling";
  if(pct>=80) rank="🏆 Champion";
  else if(pct>=60) rank="⭐ Scholar";
  else if(pct>=40) rank="📚 Student";
  else if(pct>=20) rank="🌿 Learner";

  const nextExam=getSubjects().filter(s=>getDaysLeft(getExamDate(s.id))!==null&&getDaysLeft(getExamDate(s.id))>=0).slice().sort((a,b)=>getDaysLeft(getExamDate(a.id))-getDaysLeft(getExamDate(b.id)))[0]||null;

  const proCache=_proCache||{};
  const proExpiresAt=proCache.expiresAt||0;
  const planType=proCache.planType||"monthly";
  const proExpiryStr=proExpiresAt>0?new Date(proExpiresAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—";
  const memberSince=AppStateShared.currentUser?.metadata?.creationTime
    ? new Date(AppStateShared.currentUser.metadata.creationTime).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})
    : null;

  const css=`<style>
.pf{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:760px;margin:0 auto}
.pf *{box-sizing:border-box}
.pf-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:20px;padding:20px;margin-bottom:14px}
.pf-card.click{cursor:pointer;transition:.2s}
.pf-card.click:hover{transform:translateY(-2px);border-color:var(--acc)}
.pf-lbl{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--mute)}
.pf-ch{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:14px}
.pf-more{font-size:11.5px;color:var(--mute);font-weight:600}
.pf-hero{position:relative;overflow:hidden;background:radial-gradient(circle at 0% 0%,color-mix(in srgb,var(--acc) 16%,transparent),transparent 60%),var(--glass-bg,var(--surf));border-color:color-mix(in srgb,var(--acc) 25%,var(--line))}
.pf-id{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.pf-avw{position:relative;flex-shrink:0}
.pf-av{width:80px;height:80px;border-radius:50%;border:3px solid var(--acc);object-fit:cover;display:block;background:var(--surface-3,#1a1a24)}
.pf-avb{position:absolute;bottom:-3px;right:-3px;background:var(--acc);color:#12100a;border-radius:50%;width:26px;height:26px;display:grid;place-items:center;font-size:13px;border:2px solid var(--bg,#08080f)}
.pf-nm{font-size:22px;font-weight:800;letter-spacing:-.4px;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pf-ms{font-size:10.5px;color:var(--mute);margin-top:4px;letter-spacing:.5px;font-weight:600}
.pf-rank{display:inline-block;margin-top:10px;background:color-mix(in srgb,var(--acc) 14%,transparent);border:1px solid color-mix(in srgb,var(--acc) 35%,transparent);color:var(--acc);padding:4px 12px;border-radius:99px;font-size:11px;font-weight:800}
.pf-sub{display:flex;justify-content:space-between;align-items:center;gap:12px}
.pf-sub b{display:block;font-size:17px;font-weight:800}
.pf-sub span{font-size:12px;color:var(--mute)}
.pf-sub .ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:20px;flex-shrink:0}
.pf-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
@media(max-width:520px){.pf-stats{gap:8px}}
.pf-stat{--c:#FFE66D;background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:18px;padding:16px 8px;text-align:center;cursor:pointer;transition:.2s;position:relative;overflow:hidden}
.pf-stat:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--c) 16%,transparent),transparent 70%)}
.pf-stat>*{position:relative}
.pf-stat:hover{transform:translateY(-2px)}
.pf-stat .ic{font-size:22px}
.pf-stat b{display:block;font-size:24px;font-weight:800;color:var(--c);letter-spacing:-1px;margin:6px 0 2px}
.pf-stat span{font-size:9.5px;color:var(--mute);letter-spacing:1px;font-weight:700}
.pf-ai{border-color:color-mix(in srgb,#4ECDC4 30%,var(--line))}
.pf-ai-t{font-size:12.5px;font-weight:800;color:#4ECDC4;letter-spacing:.5px;display:flex;align-items:center;gap:8px}
.pf-tag{font-size:9px;font-weight:800;background:color-mix(in srgb,var(--txt) 10%,transparent);color:var(--mute);border-radius:99px;padding:2px 8px}
.pf-ai-b{font-size:13px;color:var(--text-3,#aaa);line-height:1.75;padding:14px;background:color-mix(in srgb,var(--txt) 4%,transparent);border-radius:14px}
.pf-next{display:flex;align-items:center;gap:16px}
.pf-next .ic{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:28px;background:color-mix(in srgb,#FF6B35 14%,transparent);flex-shrink:0}
.pf-next b{display:block;font-size:15.5px;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pf-next span{font-size:11.5px;color:var(--mute)}
.pf-days{text-align:right;flex-shrink:0}
.pf-days b{font-size:36px;font-weight:800;color:#FF6B35;letter-spacing:-2px;line-height:1}
.pf-days small{display:block;font-size:9.5px;color:var(--mute);letter-spacing:1px;font-weight:700;margin-top:2px}
.pf-row{margin-bottom:14px}
.pf-row:last-child{margin:0}
.pf-row-h{display:flex;justify-content:space-between;font-size:13px;margin-bottom:7px;color:var(--text-2,#ccc);font-weight:600}
.pf-row-h b{color:var(--c);font-weight:800}
.pf-bar{height:7px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);overflow:hidden}
.pf-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,color-mix(in srgb,var(--c) 55%,transparent),var(--c))}
.pf-badges{display:grid;grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:10px}
.pf-badge{text-align:center;padding:14px 8px;border-radius:16px;border:1px solid var(--line);background:color-mix(in srgb,var(--txt) 4%,transparent)}
.pf-badge .i{font-size:28px;margin-bottom:6px}
.pf-badge b{display:block;font-size:11px;color:var(--txt);line-height:1.3}
.pf-badge span{font-size:9.5px;color:var(--mute)}
.pf-out{width:100%;padding:13px;border-radius:14px;border:1px solid #FF6B3544;background:transparent;color:#FF6B35;font-weight:800;font-size:13px;font-family:inherit;cursor:pointer;transition:.2s}
.pf-out:hover{background:#FF6B3514;border-color:#FF6B35}
.pf-g{border:none;background:linear-gradient(135deg,#4285F4,#34A853);color:#fff;padding:14px 28px;border-radius:14px;font-family:inherit;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 8px 24px -8px #4285F4aa}
</style>`;

  if(!AppStateShared.currentUser) return `${css}<div class="pf fade-in">
    <div class="pf-card" style="text-align:center;padding:52px 20px">
      <div style="font-size:64px;margin-bottom:14px">👤</div>
      <div style="font-size:22px;font-weight:800;color:var(--txt);margin-bottom:8px">Your Study Profile</div>
      <div style="font-size:13px;color:var(--mute);margin-bottom:24px">Sign in to see personalised stats, achievements &amp; AI insights</div>
      <button class="pf-g" onclick="googleSignIn()">🔐 Sign in with Google</button>
    </div>
  </div>`;

  return `${css}<div class="pf fade-in">

    <div class="pf-card pf-hero">
      <div class="pf-id">
        <div class="pf-avw">
          <img class="pf-av" src="${esc(AppStateShared.currentUser.photoURL||"")}" onerror="this.style.display='none'"/>
          <div class="pf-avb">${pct>=80?"🏆":pct>=50?"⭐":"📚"}</div>
        </div>
        <div style="flex:1;min-width:0">
          <div class="pf-nm">${esc(AppStateShared.currentUser.displayName||"Student")}</div>
          ${memberSince?`<div class="pf-ms">MEMBER SINCE ${memberSince.toUpperCase()}</div>`:""}
          <span class="pf-rank">${rank}</span>
        </div>
      </div>
    </div>

    <div class="pf-card ${pro?"":"click"}" onclick="${pro?"":"openProModal()"}" ${pro?`style="border-color:color-mix(in srgb,var(--acc) 35%,var(--line))"`:""}>
      <div class="pf-sub">
        <div>
          <div class="pf-lbl" style="margin-bottom:6px">SUBSCRIPTION</div>
          <b style="color:${pro?"var(--acc)":"var(--txt)"}">${pro?"Pro Plan":"Free Plan"}</b>
          <span>${pro?`<span style="text-transform:capitalize">${esc(planType)}</span> · Renews ${proExpiryStr}`:"Tap to unlock Pro features →"}</span>
        </div>
        <div class="ic" style="${pro?"background:linear-gradient(135deg,#FFE66D,#ffb700)":"background:color-mix(in srgb,var(--txt) 8%,transparent)"}">${pro?"⭐":"🔒"}</div>
      </div>
    </div>

    <div class="pf-stats">
      ${[["📊",pct+"%","COMPLETED","analytics","#FFE66D"],["⏱️",totalHours+"h","HOURS LOGGED","log","#06D6A0"],["🔥",streak+"d","DAY STREAK","log","#FF6B35"]].map(([ic,v,l,view,c])=>`
      <div class="pf-stat" style="--c:${c}" onclick="switchView('${view}')"><span class="ic">${ic}</span><b>${v}</b><span>${l}</span></div>`).join("")}
    </div>

    <div class="pf-card pf-ai click" onclick="${pro?"generateProfileInsight()":"openProModal()"}">
      <div class="pf-ch" style="margin-bottom:12px">
        <div class="pf-ai-t">✨ AI STUDY INSIGHTS ${pro?"":`<span class="pf-tag">PRO</span>`}</div>
        <span class="pf-more" style="color:#4ECDC4">${pro?"Tap to refresh →":"Upgrade →"}</span>
      </div>
      <div id="profile-insight" class="pf-ai-b">
        ${pro
          ? (pct>=80?"🔥 Excellent! You're well-prepared. Focus on weak spots and do timed mock tests.":
             pct>=50?"📈 Good progress! Keep consistent — daily small sessions beat cramming.":
             "💪 Start with your nearest exam subject. Every topic checked builds momentum!")
          : `<span style="color:var(--mute)">Unlock AI-powered personalised study insights tailored to your progress and upcoming exams.</span>`}
      </div>
    </div>

    ${nextExam?`<div class="pf-card click" onclick="switchView('subjects')" style="border-color:color-mix(in srgb,#FF6B35 30%,var(--line))">
      <div class="pf-lbl" style="margin-bottom:12px">NEXT EXAM</div>
      <div class="pf-next">
        <div class="ic">${nextExam.icon}</div>
        <div style="flex:1;min-width:0"><b>${esc(nextExam.name)}</b><span>${esc(getExamDate(nextExam.id))}</span></div>
        ${getDaysLeft(getExamDate(nextExam.id))!==null?`<div class="pf-days"><b>${getDaysLeft(getExamDate(nextExam.id))}</b><small>DAYS LEFT</small></div>`:""}
      </div>
    </div>`:""}

    <div class="pf-card click" onclick="switchView('subjects')">
      <div class="pf-ch"><div class="pf-lbl">SUBJECT PROGRESS</div><span class="pf-more">View all →</span></div>
      ${subProgress.map(s=>`<div class="pf-row" style="--c:${s.color}">
        <div class="pf-row-h"><span>${s.icon} ${esc(s.name)}</span><b>${s.pct}%</b></div>
        <div class="pf-bar"><i style="width:${s.pct}%"></i></div>
      </div>`).join("")}
    </div>

    <div class="pf-card click" onclick="switchView('analytics')">
      <div class="pf-ch"><div class="pf-lbl">ACHIEVEMENTS</div><span class="pf-more">${badges.length} earned</span></div>
      <div class="pf-badges">
        ${badges.map(b=>`<div class="pf-badge"><div class="i">${b.icon}</div><b>${b.name}</b><span>${b.desc}</span></div>`).join("")}
      </div>
    </div>

    <button class="pf-out" onclick="googleSignOut()">Sign Out</button>
  </div>`;
}


async function generateProfileInsight(){
  const el=document.getElementById("profile-insight");
  if(!el) return;

  // ── PRO GATE: AI insights are a Pro feature ──
  const _proForInsight = await isProUser();
  if(!_proForInsight){
    showToast("⭐ AI Insights require Pro — upgrade to unlock!","info");
    openProModal();
    return;
  }

  el.textContent="⏳ Generating AI insights…";
  const subInfo=getSubjects().map(s=>s.name+":"+getSubjectPct(s.id)+"%").join(", ");
  const prompt=`Student has: ${subInfo}. Total study hours: ${getTotalHours()}. Streak: ${getStreak()} days. Exams start 18 May 2026. Give 2-3 short, specific, encouraging study tips. Max 60 words.`;
  const reply=await askAI(prompt);
  if(el) el.textContent=reply;
}
// ══════════════════════════════════════════════════════════════
// INIT

export { closeFolderPicker, closeSectionModal, createDriveFolderForSubject, deleteSectionItem, generateProfileInsight, getActiveTab, getSubjectSection, loadDriveFolders, openFolderPicker, openSectionModal, renderFolderPicker, renderProfile, renderSectionModal, renderSubjectSectionTabs, saveSectionItem, selectDriveFolder, setActiveTab };

if (typeof window !== "undefined") {
  Object.assign(window, { closeFolderPicker, closeSectionModal, createDriveFolderForSubject, deleteSectionItem, generateProfileInsight, getActiveTab, getSubjectSection, loadDriveFolders, openFolderPicker, openSectionModal, renderFolderPicker, renderProfile, renderSectionModal, renderSubjectSectionTabs, saveSectionItem, selectDriveFolder, setActiveTab });
}

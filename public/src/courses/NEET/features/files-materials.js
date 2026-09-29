import { AppStateShared, state } from "../../../core/app-state.js";
import { CourseSelectorShared, getSubjects } from "../../../core/course-selector.js";
import { render } from "../ui/render-core.js";
import { LS, S, applyAppConfig, idbSet, pushToFirebase } from "../../../core/firebase-sync.js";
import { isProUser, openProModal } from "./payments-pro.js";
import { esc, genId, showToast, today } from "../../../utils/helpers.js";
import { spawnStars } from "./clock-alarms-timer.js";

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
  if(!AppStateShared.db) return;
  try{
    const {collection, getDocs, query, orderBy}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const course = CourseSelectorShared.activeCourse || null;
    if(!course) return;
    // Fetch all, filter client-side — no composite index needed.
    // Case-insensitive match handles both old uppercase ("JEE") and new lowercase ("jee") values.
    const q=query(collection(AppStateShared.db,"study-materials"),orderBy("createdAt","desc"));
    const snap=await getDocs(q);
    const adminMats=[];
    // The admin "Study Material" publish form saves the subject as a plain
    // display name (e.g. "Operating System Concepts"), but the student-side
    // filter pills are built from getSubjects(), whose .id is a slug
    // (e.g. "s3-os"). Resolve name -> id here so the two actually match —
    // otherwise every subject filter except "All" silently shows nothing.
    const knownSubs=(typeof getSubjects==="function")?getSubjects():[];
    const resolveSubjectId=(rawSubject,fallback)=>{
      const raw=(rawSubject||"").trim();
      if(!raw) return fallback;
      const match=knownSubs.find(s=>
        s.id===raw || (s.name||"").trim().toLowerCase()===raw.toLowerCase()
      );
      return match?match.id:raw; // fall back to raw value if no match found
    };
    snap.forEach(d=>{
      const m=d.data();
      const docCourse=(m.course||"").toLowerCase();
      // Include if matches active course OR is tagged "general" (show for all courses)
      if(docCourse!==course && docCourse!=="general") return;
      adminMats.push({
        id:"admin_"+d.id,
        name:m.title||m.fileName||"Untitled",
        fileName:m.fileName||"",
        type:m.type||"",
        size:0,
        created:m.createdAt?new Date(m.createdAt).toLocaleDateString():"",
        downloadURL:m.url||null,
        subjectId:resolveSubjectId(m.subject,m.course||"general"),
        course:m.course||"",
        note:m.description||"",
        proOnly:!!m.proOnly,
        isQuestionPaper:!!m.isQuestionPaper,
        shared:true,
        adminMaterial:true
      });
    });
    state.files=state.files.filter(f=>!f.adminMaterial);
    state.files=[...adminMats,...state.files];
  }catch(e){console.warn("loadAdminMaterials error:",e);}
}


// ── loadTheme: fetch admin-set theme overrides from Firestore app_config doc ──
async function loadTheme(){
  if(!AppStateShared.db) return;
  try{
    const {doc,getDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDoc(doc(AppStateShared.db,"app_config","theme"));
    if(snap.exists()){
      const d=snap.data();
      // Apply any CSS variable overrides stored by admin
      if(d.primaryColor) document.documentElement.style.setProperty('--accent',d.primaryColor);
      if(d.accentColor)  document.documentElement.style.setProperty('--gold',d.accentColor);
    }
  }catch(e){console.warn("loadTheme error:",e);}
}

// ── checkMaintenance: show maintenance overlay if admin has enabled it ──
async function checkMaintenance(){
  if(!AppStateShared.db) return;
  try{
    const {doc,getDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDoc(doc(AppStateShared.db,"app_config","maintenance"));
    if(snap.exists()&&snap.data().enabled){
      const overlay=document.getElementById("maintenance-overlay");
      const msgEl=document.getElementById("maintenance-msg");
      if(overlay){
        if(msgEl&&snap.data().message) msgEl.textContent=snap.data().message;
        overlay.style.display="flex";
      }
    }
  }catch(e){console.warn("checkMaintenance error:",e);}
}

// ── loadAnnouncement: show banner/popup if admin has set an active announcement ──
async function loadAnnouncement(){
  if(!AppStateShared.db) return;
  try{
    const {doc,getDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDoc(doc(AppStateShared.db,"app_config","announcement"));
    if(!snap.exists()) return;
    const d=snap.data();
    if(!d.active) return;
    // Banner
    const banner=document.getElementById("announce-banner");
    const bannerText=document.getElementById("announce-banner-text");
    if(banner&&bannerText&&d.bannerText){
      bannerText.textContent=d.bannerText;
      banner.style.display="flex";
    }
    // Popup (only once per session)
    if(d.popupTitle&&!sessionStorage.getItem("ann_seen_"+d.id)){
      const popup=document.getElementById("announce-popup");
      const popupTitle=document.getElementById("announce-popup-title");
      const popupBody=document.getElementById("announce-popup-body");
      if(popup&&popupTitle&&popupBody){
        popupTitle.textContent=d.popupTitle;
        popupBody.textContent=d.popupBody||"";
        popup.style.display="flex";
        if(d.id) sessionStorage.setItem("ann_seen_"+d.id,"1");
      }
    }
  }catch(e){console.warn("loadAnnouncement error:",e);}
}

// ── loadExamSchedule: load upcoming exam dates from Firestore for the dashboard ──
async function loadExamSchedule(){
  if(!AppStateShared.db) return;
  try{
    const {collection,getDocs,query,orderBy}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const q=query(collection(AppStateShared.db,"exam_schedule"),orderBy("date","asc"));
    const snap=await getDocs(q);
    const schedule=[];
    snap.forEach(d=>schedule.push({id:d.id,...d.data()}));
    if(schedule.length){
      state.examSchedule=schedule;
      render(); // re-render dashboard to show updated countdown
    }
  }catch(e){console.warn("loadExamSchedule error:",e);}
}

async function loadSharedFiles(){
  if(!AppStateShared.db) return; // works even without login — Firestore public read
  try{
    const {collection, getDocs, query, orderBy}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const q=query(collection(AppStateShared.db,"shared-files"),orderBy("created","desc"));
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
  if(!AppStateShared.db||!AppStateShared.currentUser) return;
  try{
    const {collection,getDocs,query,orderBy}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const q=query(
      collection(AppStateShared.db,"user-files",AppStateShared.currentUser.uid,"files"),
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
  if(!AppStateShared.db||!AppStateShared.currentUser) return;
  try{
    const {doc,deleteDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await deleteDoc(doc(AppStateShared.db,"user-files",AppStateShared.currentUser.uid,"files",id));
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
      uploadedBy:AppStateShared.currentUser?.displayName||"You",
      ownerId:AppStateShared.currentUser?.uid||null,
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

        if(AppStateShared.db && AppStateShared.currentUser){
          const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          await setDoc(doc(AppStateShared.db,"user-files",AppStateShared.currentUser.uid,"files",fileObj.id), fileObj);
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
    if(AppStateShared.storage && AppStateShared.currentUser){
      showToast("☁️ Uploading "+file.name+"…","info");
      try{
        const {ref,uploadBytesResumable,getDownloadURL}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js");
        const path=`user-files/${AppStateShared.currentUser.uid}/${fileObj.id}_${file.name}`;
        const sRef=ref(AppStateShared.storage,path);
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

        if(AppStateShared.db){
          const {doc,setDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          await setDoc(doc(AppStateShared.db,"user-files",AppStateShared.currentUser.uid,"files",fileObj.id), fileObj);
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

async function deleteAllUserFiles(){
  const userFiles=state.files.filter(f=>!f.adminMaterial);
  if(userFiles.length===0){showToast("No files to delete","info");return;}
  if(!confirm(`Delete all ${userFiles.length} file(s)? This cannot be undone.`)) return;
  // Delete from Firestore cloud for synced files
  for(const f of userFiles){
    if(f.synced && !f.shared){
      try{ await deleteUserFileFromCloud(f.id); }catch(e){}
    }
  }
  // Remove all user files, keep admin materials
  state.files=state.files.filter(f=>f.adminMaterial);
  S("files",state.files);
  showToast(`🗑️ Deleted ${userFiles.length} file(s)`,"info");
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
    const result=await signInWithPopup(AppStateShared.auth,provider);
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
  const subs = getSubjects();
  const filtered=state.files.filter(f=>{
    if(state.fileSubFilter!=="all"&&f.subjectId!==state.fileSubFilter) return false;
    if(state.fileQPOnly&&!f.isQuestionPaper) return false;
    if(state.fileSearch){const q=state.fileSearch.toLowerCase();if(!f.name.toLowerCase().includes(q)&&!(f.note||"").toLowerCase().includes(q)) return false;}
    return true;
  });

  const filesSizeBytes=state.files.reduce((s,f)=>s+(f.size||0),0);
  const usedMB=(filesSizeBytes/(1024*1024)).toFixed(1);
  const limitMB=pro?25*1024:200;
  const usedPct=pro
    ? Math.min(100,Math.round((filesSizeBytes/(1024*1024*limitMB))*100))
    : Math.min(100,Math.round((state.files.filter(f=>!f.adminMaterial).length/5)*100));
  const barColor=usedPct>80?"#FF6B35":usedPct>60?"#FFE66D":"#06D6A0";
  const myCount=state.files.filter(f=>!f.adminMaterial).length;
  const qpCount=state.files.filter(f=>f.isQuestionPaper).length;

  const svg=(d)=>`<svg class="fm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I={
    up:svg('<path d="M12 16V4m0 0-4 4m4-4 4 4"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>'),
    folder:svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
    search:svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    link:svg('<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>'),
    eye:svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    ext:svg('<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    trash:svg('<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12"/><path d="M9 7V4h6v3"/>'),
    cloud:svg('<path d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9.5a4.5 4.5 0 0 1-.5 8.5z"/>'),
    chev:svg('<path d="m6 9 6 6 6-6"/>')
  };

  const statusOf=(f)=>{
    if(f.isDriveLink||f.type==="drive-folder") return {c:"#4ECDC4",t:"Google Drive"};
    if(f.shared&&f.downloadURL) return {c:"#06D6A0",t:"Shared"};
    if(f.downloadURL&&f.synced) return {c:"#06D6A0",t:"Synced"};
    if(f.downloadURL) return {c:"#06D6A0",t:"Cloud"};
    if(f.data) return {c:"#FF6B35",t:"This device only"};
    return {c:"var(--text-7,#666)",t:"—"};
  };

  const chips=`
    <button class="fm-chip ${state.fileSubFilter==="all"?"on":""}" onclick="state.fileSubFilter='all';render()">All <b>${state.files.length}</b></button>
    ${subs.map(s=>{
      const n=state.files.filter(f=>f.subjectId===s.id).length;
      const on=s.id===state.fileSubFilter;
      return`<button class="fm-chip ${on?"on":""}" style="--c:${s.color}" onclick="state.fileSubFilter='${s.id}';render()"><span class="fm-dot"></span>${s.icon} ${esc(s.name)}${n?` <b>${n}</b>`:""}</button>`;
    }).join("")}`;

  const cards=filtered.length===0?`
    <div class="fm-empty">
      <div class="fm-empty-ic">📂</div>
      <div class="fm-empty-t">${state.files.length?"No matching files":"Your library is empty"}</div>
      <div class="fm-empty-s">${state.files.length?"Try a different search or filter.":"Upload PDFs, notes, images or add a Google Drive link."}</div>
      ${state.files.length?"":`<button class="fm-btn fm-primary" onclick="document.getElementById('file-input').click()">${I.up} Upload your first file</button>`}
    </div>`:
    `<div class="fm-grid">${filtered.map((f,i)=>{
      const icon=getFileIcon(f.type,f.name);
      const sub=subs.find(s=>s.id===f.subjectId);
      const col=sub?.color||"#7C6CF0";
      const isImg=f.type&&f.type.includes("image")&&f.data;
      const isDrive=(f.isDriveLink||f.type==="drive-folder");
      const st=statusOf(f);
      const ext=(f.name||"").split(".").pop().toUpperCase();
      const extLabel=isDrive?(f.type==="drive-folder"?"FOLDER":"DRIVE"):(ext&&ext.length<=5&&ext!==(f.name||"").toUpperCase()?ext:"FILE");
      const href=esc(f.driveLink||f.downloadURL||f.url||"");
      return`<div class="fm-card" style="--c:${col};animation-delay:${Math.min(i,12)*0.03}s">
        <div class="fm-thumb" onclick="${isDrive?`window.open('${href}','_blank')`:`openPreview('${f.id}')`}">
          ${isImg?`<img src="${f.data}" alt="${esc(f.name)}"/>`:`<span class="fm-thumb-ic">${icon}</span>`}
          <span class="fm-ext">${extLabel}</span>
          ${f.isQuestionPaper?`<span class="fm-qp">Question Paper</span>`:""}
          ${f.proOnly?`<span class="fm-pro">PRO</span>`:""}
        </div>
        <div class="fm-body">
          <div class="fm-name" title="${esc(f.name)}">${esc(f.name)}</div>
          <div class="fm-sub"><span class="fm-dot"></span>${esc(sub?.name||"General")}</div>
          <div class="fm-meta">${f.size?formatSize(f.size)+" · ":""}${f.created||""}</div>
          <div class="fm-status" style="color:${st.c}"><span class="fm-pulse" style="background:${st.c}"></span>${st.t}</div>
          <div class="fm-actions">
            ${isDrive
              ?`<a class="fm-btn fm-sm fm-primary" href="${href}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${I.ext} Open</a>`
              :`<button class="fm-btn fm-sm fm-primary" onclick="openPreview('${f.id}')">${I.eye} View</button>`}
            ${!isDrive&&f.downloadURL?`<a class="fm-btn fm-sm fm-icon" href="${esc(f.downloadURL)}" target="_blank" rel="noopener" title="Open in new tab" onclick="event.stopPropagation()">${I.ext}</a>`:""}
            ${f.adminMaterial?"":`<button class="fm-btn fm-sm fm-icon fm-danger" title="Delete" onclick="deleteFile('${f.id}')">${I.trash}</button>`}
          </div>
        </div>
      </div>`;
    }).join("")}</div>`;

  const css=`<style>
.fm{--fm-r:16px;--fm-line:var(--border-2,#2a2a3a);--fm-surf:var(--surface,#0f0f18);--fm-txt:var(--text-2,#ccc);--fm-mute:var(--text-5,#777);--fm-acc:var(--gold,#FFE66D);max-width:1100px;margin:0 auto}
.fm *{box-sizing:border-box}
.fm-i{width:16px;height:16px;flex-shrink:0}
.fm-hero{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:18px}
.fm-title{font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--text,#eee);line-height:1.1}
.fm-sub-h{font-size:13px;color:var(--fm-mute);margin-top:6px}
.fm-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--fm-line);background:var(--fm-surf);color:var(--fm-txt);padding:10px 16px;border-radius:12px;font-weight:600;font-size:13px;line-height:1;font-family:inherit;cursor:pointer;text-decoration:none;transition:transform .15s,border-color .2s,background .2s,box-shadow .2s}
.fm-btn:hover{border-color:var(--fm-acc);transform:translateY(-1px)}
.fm-primary{background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-color:transparent;box-shadow:0 6px 18px -6px #FFB70088}
.fm-primary:hover{box-shadow:0 10px 24px -6px #FFB700aa;border-color:transparent}
.fm-sm{padding:8px 12px;font-size:12px;border-radius:10px}
.fm-icon{padding:8px;width:34px;flex:0 0 34px}
.fm-danger:hover{color:#ff5c5c;border-color:#ff5c5c66;background:#ff5c5c14}
.fm-row{display:flex;gap:8px;flex-wrap:wrap}
.fm-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px}
.fm-stat{background:var(--glass-bg,var(--fm-surf));border:1px solid var(--fm-line);border-radius:var(--fm-r);padding:14px 16px}
.fm-stat b{display:block;font-size:22px;font-weight:800;color:var(--text,#eee);letter-spacing:-.5px}
.fm-stat span{font-size:11px;color:var(--fm-mute);letter-spacing:.4px}
.fm-store{grid-column:span 2}
@media(max-width:520px){.fm-store{grid-column:span 1}}
.fm-bar{height:6px;border-radius:99px;background:var(--surface-3,#1c1c28);overflow:hidden;margin-top:10px}
.fm-bar i{display:block;height:100%;border-radius:99px;transition:width .6s ease}
.fm-store a{color:var(--fm-acc);cursor:pointer;font-weight:700}
.fm-drop{border:1.5px dashed var(--fm-line);border-radius:var(--fm-r);padding:22px 18px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:var(--bg-alt,transparent);cursor:pointer;transition:.25s;margin-bottom:12px}
.fm-drop:hover,.fm-drop.drag-over{border-color:var(--fm-acc);background:color-mix(in srgb,var(--fm-acc) 8%,var(--fm-surf));box-shadow:0 0 0 4px color-mix(in srgb,var(--fm-acc) 10%,transparent)}
.fm-drop-ic{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,var(--fm-acc) 16%,transparent);color:var(--fm-acc)}
.fm-drop-ic .fm-i{width:22px;height:22px}
.fm-drop-t{font-weight:700;color:var(--text,#eee);font-size:14px}
.fm-drop-s{font-size:12px;color:var(--fm-mute);margin-top:3px}
.fm-drop-r{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.fm select,.fm input{background:var(--fm-surf);color:var(--fm-txt);border:1px solid var(--fm-line);border-radius:10px;padding:9px 12px;font:inherit;font-size:12.5px;outline:none;margin:0;width:auto;transition:border-color .2s}
.fm select:focus,.fm input:focus{border-color:var(--fm-acc)}
.fm details{border:1px solid var(--fm-line);border-radius:var(--fm-r);background:var(--glass-bg,var(--fm-surf));margin-bottom:18px;overflow:hidden}
.fm summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:13px 16px;font-weight:700;font-size:13px;color:var(--fm-txt)}
.fm summary::-webkit-details-marker{display:none}
.fm summary .fm-i:last-child{margin-left:auto;transition:transform .2s}
.fm details[open] summary .fm-i:last-child{transform:rotate(180deg)}
.fm-drive{padding:0 16px 16px;display:grid;gap:8px}
.fm-drive .fm-r2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fm-drive .fm-r3{display:flex;gap:8px}
.fm-drive input,.fm-drive select{width:100%}
@media(max-width:520px){.fm-drive .fm-r2{grid-template-columns:1fr}.fm-drive .fm-r3{flex-direction:column}}
.fm-tools{padding:8px 0 10px;display:grid;gap:10px}
.fm-search{position:relative}
.fm-search .fm-i{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--fm-mute)}
.fm-search input{width:100%;padding:12px 14px 12px 38px;border-radius:14px;font-size:13.5px}
.fm-chips{display:flex;flex-wrap:wrap;gap:8px}
.fm-chip{--c:var(--fm-acc);flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;border:1px solid var(--fm-line);background:var(--fm-surf);color:var(--fm-mute);padding:8px 13px;border-radius:99px;font-weight:600;font-size:12px;line-height:1;font-family:inherit;cursor:pointer;transition:.2s;white-space:nowrap}
.fm-chip b{font-size:10px;opacity:.7;background:color-mix(in srgb,currentColor 14%,transparent);padding:2px 6px;border-radius:99px}
.fm-chip:hover{color:var(--fm-txt);border-color:var(--c)}
.fm-chip.on{background:color-mix(in srgb,var(--c) 18%,var(--fm-surf));color:var(--c);border-color:var(--c)}
.fm-chip .fm-dot{display:none}
.fm-qp-btn.on{--c:#FF6B35}
.fm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;margin-top:6px}
@media(max-width:520px){.fm-grid{grid-template-columns:1fr 1fr;gap:10px}}
.fm-card{--c:#7C6CF0;background:var(--glass-bg,var(--fm-surf));border:1px solid var(--fm-line);border-radius:var(--fm-r);overflow:hidden;display:flex;flex-direction:column;transition:transform .2s,border-color .2s,box-shadow .2s;animation:fmIn .35s ease both}
.fm-card:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--c) 60%,var(--fm-line));box-shadow:0 14px 30px -14px color-mix(in srgb,var(--c) 55%,transparent)}
@keyframes fmIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.fm-thumb{position:relative;height:118px;display:grid;place-items:center;cursor:pointer;overflow:hidden;background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--c) 28%,transparent),transparent 70%),linear-gradient(160deg,color-mix(in srgb,var(--c) 10%,var(--fm-surf)),var(--fm-surf))}
.fm-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fm-thumb-ic{font-size:46px;filter:drop-shadow(0 6px 10px #0006);transition:transform .25s}
.fm-card:hover .fm-thumb-ic{transform:scale(1.08) rotate(-3deg)}
.fm-ext{position:absolute;left:10px;bottom:10px;font-size:9.5px;font-weight:800;letter-spacing:.8px;padding:3px 7px;border-radius:6px;background:#000a;color:#fff;backdrop-filter:blur(6px)}
.fm-qp,.fm-pro{position:absolute;top:10px;right:10px;font-size:9px;font-weight:800;letter-spacing:.5px;padding:3px 8px;border-radius:99px;text-transform:uppercase}
.fm-qp{background:#FF6B35;color:#fff}
.fm-pro{background:linear-gradient(135deg,#FFE66D,#ffb700);color:#1a1300;top:auto;bottom:10px;right:10px}
.fm-body{padding:12px 13px 13px;display:flex;flex-direction:column;gap:5px;flex:1}
.fm-name{font-size:13px;font-weight:700;color:var(--text,#eee);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.3;min-height:2.6em}
.fm-sub{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--c);font-weight:600}
.fm-dot{width:7px;height:7px;border-radius:50%;background:var(--c,currentColor);display:inline-block}
.fm-meta{font-size:10.5px;color:var(--fm-mute)}
.fm-status{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:600}
.fm-pulse{width:6px;height:6px;border-radius:50%}
.fm-actions{display:flex;gap:6px;margin-top:auto;padding-top:8px}
.fm-actions .fm-primary{flex:1}
.fm-empty{text-align:center;padding:56px 16px;border:1.5px dashed var(--fm-line);border-radius:var(--fm-r);margin-top:8px}
.fm-empty-ic{font-size:52px;margin-bottom:10px}
.fm-empty-t{font-size:16px;font-weight:700;color:var(--text,#eee)}
.fm-empty-s{font-size:12.5px;color:var(--fm-mute);margin:6px 0 16px}
.fm-sync{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:22px;padding:14px 16px;border:1px solid var(--fm-line);border-radius:var(--fm-r);background:var(--glass-bg,var(--fm-surf));font-size:12px;color:var(--fm-mute);line-height:1.6}
.fm-sync .fm-i{width:20px;height:20px}
.fm-sync button{margin-left:auto;background:linear-gradient(135deg,#4285F4,#34A853);border:none;color:#fff;padding:9px 16px;border-radius:10px;font-weight:700;font-size:12px;font-family:inherit;cursor:pointer}
</style>`;

  return`${css}<div class="fm fade-in">
    <div class="fm-hero">
      <div>
        <div class="fm-title">Study Material</div>
        <div class="fm-sub-h">Notes, PDFs and question papers — all in one place.</div>
      </div>
      <div class="fm-row">
        <button class="fm-btn fm-primary" onclick="document.getElementById('file-input').click()">${I.up} Upload</button>
        <button class="fm-btn" onclick="document.getElementById('folder-input').click()">${I.folder} Folder</button>
        ${myCount>0?`<button class="fm-btn fm-danger" onclick="deleteAllUserFiles()">${I.trash} Delete all</button>`:""}
      </div>
    </div>

    <div class="fm-stats">
      <div class="fm-stat"><b>${state.files.length}</b><span>TOTAL FILES</span></div>
      <div class="fm-stat"><b>${qpCount}</b><span>QUESTION PAPERS</span></div>
      <div class="fm-stat fm-store" ${pro?"":`onclick="openProModal()" style="cursor:pointer"`}>
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
          <b style="font-size:15px">${pro?"☁️ 25 GB Cloud · PRO":"📁 Free · local storage"}</b>
          <span>${pro?`${usedMB} MB used`:`${myCount}/5 files`}</span>
        </div>
        <div class="fm-bar"><i style="width:${Math.max(usedPct,2)}%;background:${barColor}"></i></div>
        ${pro?"":`<span style="display:block;margin-top:8px"><a>Upgrade for 25 GB cloud sync →</a></span>`}
      </div>
    </div>

    <div class="fm-drop" id="drop-zone"
      onclick="document.getElementById('file-input').click()"
      ondragover="event.preventDefault();this.classList.add('drag-over')"
      ondragleave="this.classList.remove('drag-over')"
      ondrop="event.preventDefault();this.classList.remove('drag-over');handleFileSelect(event.dataTransfer.files)">
      <div class="fm-drop-ic">${I.up}</div>
      <div>
        <div class="fm-drop-t">Drop files here or click to browse</div>
        <div class="fm-drop-s">PDF, images, Word, Excel, PPT, TXT · ${pro?"Synced to cloud ☁️":"Saved on this device"}</div>
      </div>
      <div class="fm-drop-r" onclick="event.stopPropagation()">
        <span style="font-size:11.5px;color:var(--fm-mute)">Add to</span>
        <select id="file-sub-select">${subs.map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join("")}</select>
      </div>
    </div>

    <details>
      <summary><span style="color:#4ECDC4;display:flex">${I.link}</span> Import from Google Drive ${I.chev}</summary>
      <div class="fm-drive">
        <div style="font-size:12px;color:var(--fm-mute)">Paste a Drive share link — works on any device.</div>
        <div class="fm-r2">
          <input id="drive-link-name" placeholder="File name (e.g. C++ Notes.pdf)"/>
          <select id="drive-link-sub">${subs.map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join("")}</select>
        </div>
        <div class="fm-r3">
          <input id="drive-link-input" placeholder="https://drive.google.com/file/d/..." style="flex:1"/>
          <button class="fm-btn fm-primary" onclick="addDriveLink()">+ Add link</button>
        </div>
      </div>
    </details>

    <div class="fm-tools">
      <div class="fm-search">${I.search}<input id="file-search" placeholder="Search files and notes…" value="${esc(state.fileSearch||"")}"
        oninput="state.fileSearch=this.value;render();setTimeout(()=>{const e=document.getElementById('file-search');if(e){e.focus();e.setSelectionRange(e.value.length,e.value.length)}},60)"/></div>
      <div class="fm-chips">
        <button class="fm-chip fm-qp-btn ${state.fileQPOnly?"on":""}" onclick="state.fileQPOnly=!state.fileQPOnly;render()">📋 Question Papers</button>
        ${chips}
      </div>
    </div>

    ${cards}

    <div class="fm-sync">
      ${AppStateShared.currentUser
        ? `<span style="color:#06D6A0;display:flex">${I.cloud}</span><div>Signed in — your uploads sync to your account and appear on every device.</div>`
        : `<span style="color:#FF6B35;display:flex">${I.cloud}</span><div>Files are stored on this device only. Sign in to sync them across devices.</div><button onclick="googleSignIn()">Sign in with Google</button>`}
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
      sharedBy:AppStateShared.currentUser?.displayName||"A friend",
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


// ══════════════════════════════════════════════════════════════
// SUBJECT SECTION FUNCTIONS

export { checkMaintenance, checkShareLinkOnLoad, closePreview, copyToClipboard, deleteAllUserFiles, deleteFile, deleteUserFileFromCloud, exportData, formatSize, generateShareLink, getFileIcon, getGoogleAccessToken, getStorageUsedMB, handleFileSelect, handleFolderSelect, handlePastedShareLink, importData, importFromShareLink, loadAdminMaterials, loadAnnouncement, loadExamSchedule, loadSharedFiles, loadTheme, loadUserFiles, mergeImportData, openPreview, renderDocxPreview, renderFiles, renderPDFPreview, saveAppConfig, updateFileNote, updateFileSubject };

if (typeof window !== "undefined") {
  Object.assign(window, { checkMaintenance, checkShareLinkOnLoad, closePreview, copyToClipboard, deleteAllUserFiles, deleteFile, deleteUserFileFromCloud, exportData, formatSize, generateShareLink, getFileIcon, getGoogleAccessToken, getStorageUsedMB, handleFileSelect, handleFolderSelect, handlePastedShareLink, importData, importFromShareLink, loadAdminMaterials, loadAnnouncement, loadExamSchedule, loadSharedFiles, loadTheme, loadUserFiles, mergeImportData, openPreview, renderDocxPreview, renderFiles, renderPDFPreview, saveAppConfig, updateFileNote, updateFileSubject });
}

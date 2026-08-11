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
    const course = activeCourse || null;
    if(!course) return;
    // Fetch all, filter client-side — no composite index needed.
    // Case-insensitive match handles both old uppercase ("JEE") and new lowercase ("jee") values.
    const q=query(collection(db,"study-materials"),orderBy("createdAt","desc"));
    const snap=await getDocs(q);
    const adminMats=[];
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
        subjectId:m.subject||m.course||"general",
        course:m.course||"",
        note:m.description||"",
        proOnly:!!m.proOnly,
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
  if(!db) return;
  try{
    const {doc,getDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDoc(doc(db,"app_config","theme"));
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
  if(!db) return;
  try{
    const {doc,getDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDoc(doc(db,"app_config","maintenance"));
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
  if(!db) return;
  try{
    const {doc,getDoc}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap=await getDoc(doc(db,"app_config","announcement"));
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
  if(!db) return;
  try{
    const {collection,getDocs,query,orderBy}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const q=query(collection(db,"exam_schedule"),orderBy("date","asc"));
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
        ${state.files.filter(f=>!f.adminMaterial).length>0?`<button onclick="deleteAllUserFiles()" style="background:none;border:1px solid #553333;color:#cc5555;padding:8px 14px;border-radius:10px;font-family:inherit;font-size:12px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor='#cc5555';this.style.background='#1a0808'" onmouseout="this.style.borderColor='#553333';this.style.background='none'">🗑️ Delete All</button>`:""}
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


// ══════════════════════════════════════════════════════════════
// SUBJECT SECTION FUNCTIONS
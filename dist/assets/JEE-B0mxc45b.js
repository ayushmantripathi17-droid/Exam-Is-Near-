import{C as e,D as t,E as n,O as r,S as i,T as a,_ as o,a as s,b as c,c as l,d as u,f as d,h as f,i as p,k as m,l as h,m as g,n as ee,o as te,p as _,r as ne,s as re,t as ie,u as v,v as ae,w as oe,x as se,y as ce}from"./pwa-install-CEqJ_ziW.js";import{n as y,o as b,r as x,s as S,t as C}from"./preload-helper-CzmPsGiR.js";function le(e,t){if(!e&&!t)return`📄`;let n=(t||``).split(`.`).pop().toLowerCase();return e===`drive-folder`?`📁`:e===`drive-link`?`📎`:e.includes(`pdf`)||n===`pdf`?`📕`:e.includes(`image`)||[`jpg`,`jpeg`,`png`,`gif`,`webp`].includes(n)?`🖼️`:e.includes(`spreadsheet`)||[`xlsx`,`xls`,`csv`].includes(n)?`📊`:e.includes(`word`)||n===`docx`?`📘`:e.includes(`presentation`)||n===`pptx`?`📙`:e.includes(`text`)||n===`txt`?`📄`:e.includes(`video`)||[`mp4`,`mov`].includes(n)?`🎬`:e.includes(`audio`)||[`mp3`,`wav`].includes(n)?`🎵`:n===`zip`||n===`rar`?`🗜️`:`📁`}function ue(e){return e<1024?e+`B`:e<1048576?(e/1024).toFixed(1)+`KB`:(e/1048576).toFixed(1)+`MB`}function de(){try{return(r.files.reduce((e,t)=>e+(t.size||0),0)/1048576).toFixed(1)}catch{return 0}}async function fe(){if(n.db)try{let{collection:e,getDocs:t,query:i,orderBy:a}=await C(async()=>{let{collection:e,getDocs:t,query:n,orderBy:r}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{collection:e,getDocs:t,query:n,orderBy:r}},[]),o=h.activeCourse||null;if(!o)return;let s=await t(i(e(n.db,`study-materials`),a(`createdAt`,`desc`))),c=[];s.forEach(e=>{let t=e.data(),n=(t.course||``).toLowerCase();if(n!==o&&n!==`general`)return;let r=typeof v==`function`?v():[];c.push({id:`admin_`+e.id,name:t.title||t.fileName||`Untitled`,fileName:t.fileName||``,type:t.type||``,size:0,created:t.createdAt?new Date(t.createdAt).toLocaleDateString():``,downloadURL:t.url||null,subjectId:((e,t)=>{let n=(e||``).trim();if(!n)return t;let i=r.find(e=>e.id===n||(e.name||``).trim().toLowerCase()===n.toLowerCase());return i?i.id:n})(t.subject,t.course||`general`),course:t.course||``,note:t.description||``,proOnly:!!t.proOnly,isQuestionPaper:!!t.isQuestionPaper,shared:!0,adminMaterial:!0})}),r.files=r.files.filter(e=>!e.adminMaterial),r.files=[...c,...r.files]}catch(e){console.warn(`loadAdminMaterials error:`,e)}}async function pe(){if(n.db)try{let{doc:e,getDoc:t}=await C(async()=>{let{doc:e,getDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,getDoc:t}},[]),r=await t(e(n.db,`app_config`,`theme`));if(r.exists()){let e=r.data();e.primaryColor&&document.documentElement.style.setProperty(`--accent`,e.primaryColor),e.accentColor&&document.documentElement.style.setProperty(`--gold`,e.accentColor)}}catch(e){console.warn(`loadTheme error:`,e)}}async function me(){if(n.db)try{let{doc:e,getDoc:t}=await C(async()=>{let{doc:e,getDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,getDoc:t}},[]),r=await t(e(n.db,`app_config`,`maintenance`));if(r.exists()&&r.data().enabled){let e=document.getElementById(`maintenance-overlay`),t=document.getElementById(`maintenance-msg`);e&&(t&&r.data().message&&(t.textContent=r.data().message),e.style.display=`flex`)}}catch(e){console.warn(`checkMaintenance error:`,e)}}async function he(){if(n.db)try{let{doc:e,getDoc:t}=await C(async()=>{let{doc:e,getDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,getDoc:t}},[]),r=await t(e(n.db,`app_config`,`announcement`));if(!r.exists())return;let i=r.data();if(!i.active)return;let a=document.getElementById(`announce-banner`),o=document.getElementById(`announce-banner-text`);if(a&&o&&i.bannerText&&(o.textContent=i.bannerText,a.style.display=`flex`),i.popupTitle&&!sessionStorage.getItem(`ann_seen_`+i.id)){let e=document.getElementById(`announce-popup`),t=document.getElementById(`announce-popup-title`),n=document.getElementById(`announce-popup-body`);e&&t&&n&&(t.textContent=i.popupTitle,n.textContent=i.popupBody||``,e.style.display=`flex`,i.id&&sessionStorage.setItem(`ann_seen_`+i.id,`1`))}}catch(e){console.warn(`loadAnnouncement error:`,e)}}async function ge(){if(n.db)try{let{collection:e,getDocs:t,query:i,orderBy:a}=await C(async()=>{let{collection:e,getDocs:t,query:n,orderBy:r}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{collection:e,getDocs:t,query:n,orderBy:r}},[]),o=await t(i(e(n.db,`exam_schedule`),a(`date`,`asc`))),s=[];o.forEach(e=>s.push({id:e.id,...e.data()})),s.length&&(r.examSchedule=s,B())}catch(e){console.warn(`loadExamSchedule error:`,e)}}async function _e(){if(n.db)try{let{collection:e,getDocs:t,query:i,orderBy:a}=await C(async()=>{let{collection:e,getDocs:t,query:n,orderBy:r}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{collection:e,getDocs:t,query:n,orderBy:r}},[]),o=await t(i(e(n.db,`shared-files`),a(`created`,`desc`))),s=[];o.forEach(e=>{let t=e.data();if(!r.files.find(t=>t.id===e.id&&t.shared)){let n={...t,id:e.id,shared:!0};n.type===`drive-folder`&&(n.isDriveLink=!0,n.driveLink=n.driveLink||n.downloadURL||n.url||``),s.push(n)}}),s.length>0&&(r.files=[...s,...r.files.filter(e=>!e.shared)])}catch(e){console.warn(`loadSharedFiles error:`,e)}}async function ve(){if(n.db&&n.currentUser)try{let{collection:e,getDocs:t,query:i,orderBy:a}=await C(async()=>{let{collection:e,getDocs:t,query:n,orderBy:r}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{collection:e,getDocs:t,query:n,orderBy:r}},[]),o=await t(i(e(n.db,`user-files`,n.currentUser.uid,`files`),a(`created`,`desc`))),s=[];o.forEach(e=>{s.push({...e.data(),id:e.id,synced:!0})});let c=r.files.filter(e=>!e.shared&&!e.adminMaterial&&!s.find(t=>t.id===e.id)),l=r.files.filter(e=>e.shared||e.adminMaterial);r.files=[...l,...s,...c],ae(`files`,r.files.map(e=>({...e,data:null}))).catch(()=>{}),d(`files`,r.files.map(e=>({...e,data:null})))}catch(e){console.warn(`loadUserFiles error:`,e)}}async function ye(e){if(n.db&&n.currentUser)try{let{doc:t,deleteDoc:r}=await C(async()=>{let{doc:e,deleteDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,deleteDoc:t}},[]);await r(t(n.db,`user-files`,n.currentUser.uid,`files`,e))}catch(e){console.warn(`deleteUserFile error:`,e)}}async function be(e){let t=document.getElementById(`file-sub-select`)?.value||`cpp`,i=await Y();for(let a of Array.from(e)){if(a.size>16106127360){b(`⚠️ `+a.name+` exceeds 15GB limit`,`alarm`);continue}if(!i&&r.files.filter(e=>!e.adminFile&&!e.shared).length>=5){b(`⭐ Free plan allows up to 5 files. Upgrade to Pro for Google Drive storage!`,`alarm`),G();break}let e={id:x(),name:a.name,size:a.size,type:a.type,subjectId:t,created:S(),note:``,uploadedBy:n.currentUser?.displayName||`You`,ownerId:n.currentUser?.uid||null,shared:!1};if(i){b(`☁️ Uploading `+a.name+` to Google Drive…`,`info`);try{let t=await Oe();if(!t)throw Error(`Not signed in with Google`);let i={name:a.name,mimeType:a.type||`application/octet-stream`},o=new FormData;o.append(`metadata`,new Blob([JSON.stringify(i)],{type:`application/json`})),o.append(`file`,a);let s=await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink`,{method:`POST`,headers:{Authorization:`Bearer `+t},body:o});if(!s.ok)throw Error(`Drive upload failed: `+s.status);let c=await s.json();if(await fetch(`https://www.googleapis.com/drive/v3/files/${c.id}/permissions`,{method:`POST`,headers:{Authorization:`Bearer `+t,"Content-Type":`application/json`},body:JSON.stringify({role:`reader`,type:`anyone`})}),e.downloadURL=`https://drive.google.com/uc?export=download&id=${c.id}`,e.driveId=c.id,e.driveViewURL=c.webViewLink,e.storage=`gdrive`,n.db&&n.currentUser){let{doc:t,setDoc:r}=await C(async()=>{let{doc:e,setDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,setDoc:t}},[]);await r(t(n.db,`user-files`,n.currentUser.uid,`files`,e.id),e)}r.files.unshift(e),d(`files`,r.files.map(e=>({...e,data:null}))),ae(`files`,r.files.map(e=>({...e,data:null}))).catch(()=>{}),b(`✅ `+a.name+` uploaded to Google Drive 🚗`,`success`),H(),B();continue}catch(e){console.warn(`Google Drive upload failed:`,e),b(`⚠️ Google Drive upload failed — saving to Firebase Storage`,`alarm`)}}if(n.storage&&n.currentUser){b(`☁️ Uploading `+a.name+`…`,`info`);try{let{ref:t,uploadBytesResumable:i,getDownloadURL:o}=await C(async()=>{let{ref:e,uploadBytesResumable:t,getDownloadURL:n}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js`);return{ref:e,uploadBytesResumable:t,getDownloadURL:n}},[]),s=`user-files/${n.currentUser.uid}/${e.id}_${a.name}`,c=t(n.storage,s);if(e.downloadURL=await new Promise((e,t)=>{let n=i(c,a);n.on(`state_changed`,e=>{let t=Math.round(e.bytesTransferred/e.totalBytes*100);t>0&&t<100&&b(`☁️ `+a.name+` — `+t+`%`,`info`)},t,async()=>e(await o(n.snapshot.ref)))}),e.storage=`firebase`,e.synced=!0,n.db){let{doc:t,setDoc:r}=await C(async()=>{let{doc:e,setDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,setDoc:t}},[]);await r(t(n.db,`user-files`,n.currentUser.uid,`files`,e.id),e)}r.files.unshift(e),d(`files`,r.files.map(e=>({...e,data:null}))),ae(`files`,r.files.map(e=>({...e,data:null}))).catch(()=>{}),b(`✅ `+a.name+` uploaded ☁️`,`success`),H(),B();continue}catch(e){console.warn(`Firebase Storage upload failed:`,e),b(`⚠️ Cloud upload failed — saving locally`,`alarm`)}}let o=new FileReader;o.onload=t=>{e.data=t.target.result,r.files.unshift(e);try{_(`files`,r.files)}catch{r.files[0].data=null,r.files[0].note=`⚠️ File too large to store offline.`;try{_(`files`,r.files)}catch{r.files.shift()}b(`⚠️ Storage full — metadata only`,`alarm`),B();return}b(`📁 `+a.name+` saved locally · Sign in to enable cloud backup`,`info`),H(),B()},o.readAsDataURL(a)}}function xe(e){let t=Array.from(e).filter(e=>!(e.name||``).startsWith(`.`));if(t.length===0){b(`⚠️ No valid files found in folder`,`alarm`);return}b(`📂 Loading `+t.length+` file(s) from folder…`,`info`),be(t)}function Se(e){if(!confirm(`Delete this file?`))return;let t=r.files.find(t=>t.id===e);r.files=r.files.filter(t=>t.id!==e),_(`files`,r.files),t&&t.synced&&!t.shared&&ye(e),b(`🗑️ File deleted`,`info`),B()}async function Ce(){let e=r.files.filter(e=>!e.adminMaterial);if(e.length===0){b(`No files to delete`,`info`);return}if(confirm(`Delete all ${e.length} file(s)? This cannot be undone.`)){for(let t of e)if(t.synced&&!t.shared)try{await ye(t.id)}catch{}r.files=r.files.filter(e=>e.adminMaterial),_(`files`,r.files),b(`🗑️ Deleted ${e.length} file(s)`,`info`),B()}}function we(e,t){let n=r.files.find(t=>t.id===e);n&&(n.note=t,_(`files`,r.files))}function Te(e,t){let n=r.files.find(t=>t.id===e);n&&(n.subjectId=t,_(`files`,r.files),B())}function Ee(e){let t=r.files.find(t=>t.id===e);if(!t)return;if(!t.data&&!t.downloadURL){b(`⚠️ File data not available`,`alarm`);return}if(t.downloadURL||t.driveViewURL){let e=t.driveViewURL||t.downloadURL;window.open(e,`_blank`);return}let n=document.getElementById(`preview-overlay`);document.getElementById(`preview-name`).textContent=t.name,document.getElementById(`preview-meta`).textContent=ue(t.size)+` · Uploaded `+t.created;let i=document.getElementById(`preview-body`);v().find(e=>e.id===t.subjectId);let a=document.getElementById(`preview-download`),o=t.downloadURL||t.data;a.onclick=()=>{let e=document.createElement(`a`);e.href=o,e.download=t.name,e.target=`_blank`,e.click()};let s=t.fileName||t.name,c=t.downloadURL?(t.downloadURL.split(`?`)[0].split(`.`).pop()||``).toLowerCase():``,l=[s.split(`.`).pop()||``].map(e=>e.toLowerCase())[0]===`notes`||!s.includes(`.`)?c:(s.split(`.`).pop()||``).toLowerCase(),u=[`pdf`,`pyq`].includes(t.type),d=t.type===`notes`;if(t.type.includes(`image`)||[`jpg`,`jpeg`,`png`,`gif`,`webp`].includes(l))i.innerHTML=`<img src="${o}" style="max-width:100%;max-height:65vh;border-radius:8px;object-fit:contain"/>`;else if(t.type.includes(`pdf`)||l===`pdf`||u||c===`pdf`)i.innerHTML=`
      <div id="pdf-loading" style="text-align:center;padding:40px;color:#888">
        <div style="font-size:32px;margin-bottom:12px">⏳</div>
        <div>Loading PDF...</div>
      </div>
      <div id="pdf-canvas-container" style="overflow-y:auto;max-height:65vh;background:#1a1a2e;border-radius:8px;display:none;padding:8px"></div>
      <div id="pdf-error" style="display:none;text-align:center;padding:32px">
        <div style="font-size:48px;margin-bottom:12px">📄</div>
        <div style="color:#ccc;font-weight:bold;margin-bottom:8px">${y(t.name)}</div>
        <div style="color:#888;font-size:13px;margin-bottom:16px">Preview unavailable in browser.</div>
        <button onclick="window.open('${o}','_blank')" style="background:#4ECDC4;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer;margin-right:8px">↗ Open in New Tab</button>
      </div>`,Ae(o,t.name);else if(t.type.includes(`text`)||t.name.endsWith(`.txt`)||t.name.endsWith(`.csv`))try{let e=t.data.split(`,`)[1],n=atob(e);i.innerHTML=`<pre style="font-size:12px;color:#aaa;text-align:left;white-space:pre-wrap;max-height:65vh;overflow:auto;padding:16px;background:#0a0a12;border-radius:8px;width:100%">${y(n.slice(0,8e3))}${n.length>8e3?`...(truncated)`:``}</pre>`}catch{i.innerHTML=`<div style="color:#888">Cannot preview this file type.<br>Click Download to open it.</div>`}else{let e=le(t.type,t.name),n=l,r=[`doc`,`docx`,`ppt`,`pptx`,`xls`,`xlsx`];if((n===`docx`||c===`docx`||d)&&t.downloadURL)i.innerHTML=`<div id="docx-loading" style="text-align:center;padding:40px;color:#888">
        <div style="font-size:32px;margin-bottom:12px">⏳</div>
        <div>Loading document...</div>
      </div>
      <div id="docx-content" style="display:none;text-align:left;max-height:65vh;overflow:auto;background:#fff;color:#222;padding:24px 28px;border-radius:8px;font-size:14px;line-height:1.6"></div>
      <div id="docx-error" style="display:none;text-align:center;padding:32px">
        <div style="font-size:48px;margin-bottom:12px">${e}</div>
        <div style="color:#ccc;font-weight:bold;margin-bottom:8px">${y(t.name)}</div>
        <div style="color:#888;font-size:13px;margin-bottom:16px">Couldn't render this document.</div>
        <button onclick="window.open('${o}','_blank')" style="background:#4ECDC4;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer">↗ Open in New Tab</button>
      </div>`,ke(o);else if(([`pptx`,`ppt`,`xlsx`,`xls`].includes(n)||[`pptx`,`ppt`,`xlsx`,`xls`].includes(c))&&t.downloadURL)i.innerHTML=`<div style="text-align:center">
        <iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(t.downloadURL)}" style="width:100%;height:65vh;border:none;border-radius:8px;background:#fff" frameborder="0"></iframe>
      </div>`;else{let a=o,s=`↗ Open in New Tab`;r.includes(n)&&t.downloadURL&&(a=`https://docs.google.com/viewer?url=${encodeURIComponent(t.downloadURL)}&embedded=true`,s=`↗ Open in Viewer`),i.innerHTML=`<div style="text-align:center;padding:32px">
        <div style="font-size:80px;margin-bottom:16px">${e}</div>
        <div style="font-size:16px;font-weight:bold;color:#ccc;margin-bottom:8px">${y(t.name)}</div>
        <div style="font-size:13px;color:#555;margin-bottom:20px">${ue(t.size)} · ${t.type||`Unknown type`}</div>
        <div style="font-size:12px;color:#444;margin-bottom:16px">Preview not available in browser.</div>
        <button onclick="window.open('${a}','_blank')" style="background:#4ECDC4;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer">${s}</button>
      </div>`}}n.classList.add(`show`)}function De(){document.getElementById(`preview-overlay`).classList.remove(`show`),document.getElementById(`preview-body`).innerHTML=``}async function Oe(){try{let{GoogleAuthProvider:e,signInWithPopup:t}=await C(async()=>{let{GoogleAuthProvider:e,signInWithPopup:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js`);return{GoogleAuthProvider:e,signInWithPopup:t}},[]),r=new e;r.addScope(`https://www.googleapis.com/auth/drive.file`);let i=await t(n.auth,r);return e.credentialFromResult(i)?.accessToken||null}catch(e){return console.warn(`Google Drive auth failed:`,e),null}}async function ke(e){let t=document.getElementById(`docx-loading`),n=document.getElementById(`docx-content`),r=document.getElementById(`docx-error`);try{window.mammoth||await new Promise((e,t)=>{let n=document.createElement(`script`);n.src=`https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js`,n.onload=e,n.onerror=t,document.head.appendChild(n)});let r;if(e.startsWith(`data:`)){let t=e.split(`,`)[1],n=atob(t),i=new Uint8Array(n.length);for(let e=0;e<n.length;e++)i[e]=n.charCodeAt(e);r=i.buffer}else{let t=await fetch(e);if(!t.ok)throw Error(`fetch failed`);r=await t.arrayBuffer()}let i=(await window.mammoth.convertToHtml({arrayBuffer:r})).value||`<p style='color:#888'>No content found.</p>`;n.innerHTML=window.DOMPurify?DOMPurify.sanitize(i,{USE_PROFILES:{html:!0}}):i,t.style.display=`none`,n.style.display=`block`}catch{t.style.display=`none`,r.style.display=`block`}}async function Ae(e,t){window.pdfjsLib||await new Promise((e,t)=>{let n=document.createElement(`script`);n.src=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`,n.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`,e()},n.onerror=t,document.head.appendChild(n)});try{window.pdfjsLib||(await new Promise((e,t)=>{let n=document.createElement(`script`);n.src=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`,n.onload=e,n.onerror=t,document.head.appendChild(n)}),window.pdfjsLib.GlobalWorkerOptions.workerSrc=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`);let t;if(e.startsWith(`http`))try{let n=await fetch(e,{mode:`cors`});t=n.ok?{data:await n.arrayBuffer()}:{url:e}}catch{t={url:e}}else{let n=e.split(`,`)[1],r=atob(n),i=new Uint8Array(r.length);for(let e=0;e<r.length;e++)i[e]=r.charCodeAt(e);t={data:i}}let n=await window.pdfjsLib.getDocument(t).promise,r=document.getElementById(`pdf-canvas-container`),i=document.getElementById(`pdf-loading`);if(!r||!i)return;i.style.display=`none`,r.style.display=`block`,r.innerHTML=`<div style="font-size:11px;color:#555;text-align:right;margin-bottom:6px;padding:0 4px">${n.numPages} page${n.numPages>1?`s`:``}</div>`;let a=Math.min(n.numPages,20);for(let e=1;e<=a;e++){let t=await n.getPage(e),i=t.getViewport({scale:1.4}),a=document.createElement(`canvas`);a.width=i.width,a.height=i.height,a.style.cssText=`display:block;width:100%;margin-bottom:6px;border-radius:4px;background:#fff`,r.appendChild(a),await t.render({canvasContext:a.getContext(`2d`),viewport:i}).promise}if(n.numPages>20){let e=document.createElement(`div`);e.style.cssText=`text-align:center;color:#888;font-size:12px;padding:12px`,e.textContent=`Showing first 20 of ${n.numPages} pages. Click Open in New Tab to view all.`,r.appendChild(e)}let o=document.createElement(`div`);o.style.cssText=`text-align:center;padding:12px 0`,o.innerHTML=`<button onclick="window.open('${e}','_blank')" style="background:none;border:1px solid #4ECDC433;color:#4ECDC4;padding:8px 18px;border-radius:8px;font-family:inherit;font-size:12px;cursor:pointer">↗ Open in New Tab</button>`,r.appendChild(o)}catch(e){let t=document.getElementById(`pdf-loading`),n=document.getElementById(`pdf-error`);t&&(t.style.display=`none`),n&&(n.style.display=`block`),console.warn(`PDF render error:`,e)}}async function je(){let e=await Y(),t=v(),i=r.files.filter(e=>{if(r.fileSubFilter!==`all`&&e.subjectId!==r.fileSubFilter||r.fileQPOnly&&!e.isQuestionPaper)return!1;if(r.fileSearch){let t=r.fileSearch.toLowerCase();if(!e.name.toLowerCase().includes(t)&&!(e.note||``).toLowerCase().includes(t))return!1}return!0}),a=r.files.reduce((e,t)=>e+(t.size||0),0),o=(a/1048576).toFixed(1),s=e?Math.min(100,Math.round(a/(1048576*(e?25600:200))*100)):Math.min(100,Math.round(r.files.filter(e=>!e.adminMaterial).length/5*100)),c=s>80?`#FF6B35`:s>60?`#FFE66D`:`#06D6A0`,l=r.files.filter(e=>!e.adminMaterial).length,u=r.files.filter(e=>e.isQuestionPaper).length,d=e=>`<svg class="fm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,f={up:d(`<path d="M12 16V4m0 0-4 4m4-4 4 4"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>`),folder:d(`<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`),search:d(`<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`),link:d(`<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>`),eye:d(`<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`),ext:d(`<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>`),trash:d(`<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12"/><path d="M9 7V4h6v3"/>`),cloud:d(`<path d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9.5a4.5 4.5 0 0 1-.5 8.5z"/>`),chev:d(`<path d="m6 9 6 6 6-6"/>`)},p=e=>e.isDriveLink||e.type===`drive-folder`?{c:`#4ECDC4`,t:`Google Drive`}:e.shared&&e.downloadURL?{c:`#06D6A0`,t:`Shared`}:e.downloadURL&&e.synced?{c:`#06D6A0`,t:`Synced`}:e.downloadURL?{c:`#06D6A0`,t:`Cloud`}:e.data?{c:`#FF6B35`,t:`This device only`}:{c:`var(--text-7,#666)`,t:`—`},m=`
    <button class="fm-chip ${r.fileSubFilter===`all`?`on`:``}" onclick="state.fileSubFilter='all';render()">All <b>${r.files.length}</b></button>
    ${t.map(e=>{let t=r.files.filter(t=>t.subjectId===e.id).length;return`<button class="fm-chip ${e.id===r.fileSubFilter?`on`:``}" style="--c:${e.color}" onclick="state.fileSubFilter='${e.id}';render()"><span class="fm-dot"></span>${e.icon} ${y(e.name)}${t?` <b>${t}</b>`:``}</button>`}).join(``)}`,h=i.length===0?`
    <div class="fm-empty">
      <div class="fm-empty-ic">📂</div>
      <div class="fm-empty-t">${r.files.length?`No matching files`:`Your library is empty`}</div>
      <div class="fm-empty-s">${r.files.length?`Try a different search or filter.`:`Upload PDFs, notes, images or add a Google Drive link.`}</div>
      ${r.files.length?``:`<button class="fm-btn fm-primary" onclick="document.getElementById('file-input').click()">${f.up} Upload your first file</button>`}
    </div>`:`<div class="fm-grid">${i.map((e,n)=>{let r=le(e.type,e.name),i=t.find(t=>t.id===e.subjectId),a=i?.color||`#7C6CF0`,o=e.type&&e.type.includes(`image`)&&e.data,s=e.isDriveLink||e.type===`drive-folder`,c=p(e),l=(e.name||``).split(`.`).pop().toUpperCase(),u=s?e.type===`drive-folder`?`FOLDER`:`DRIVE`:l&&l.length<=5&&l!==(e.name||``).toUpperCase()?l:`FILE`,d=y(e.driveLink||e.downloadURL||e.url||``);return`<div class="fm-card" style="--c:${a};animation-delay:${Math.min(n,12)*.03}s">
        <div class="fm-thumb" onclick="${s?`window.open('${d}','_blank')`:`openPreview('${e.id}')`}">
          ${o?`<img src="${e.data}" alt="${y(e.name)}"/>`:`<span class="fm-thumb-ic">${r}</span>`}
          <span class="fm-ext">${u}</span>
          ${e.isQuestionPaper?`<span class="fm-qp">Question Paper</span>`:``}
          ${e.proOnly?`<span class="fm-pro">PRO</span>`:``}
        </div>
        <div class="fm-body">
          <div class="fm-name" title="${y(e.name)}">${y(e.name)}</div>
          <div class="fm-sub"><span class="fm-dot"></span>${y(i?.name||`General`)}</div>
          <div class="fm-meta">${e.size?ue(e.size)+` · `:``}${e.created||``}</div>
          <div class="fm-status" style="color:${c.c}"><span class="fm-pulse" style="background:${c.c}"></span>${c.t}</div>
          <div class="fm-actions">
            ${s?`<a class="fm-btn fm-sm fm-primary" href="${d}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${f.ext} Open</a>`:`<button class="fm-btn fm-sm fm-primary" onclick="openPreview('${e.id}')">${f.eye} View</button>`}
            ${!s&&e.downloadURL?`<a class="fm-btn fm-sm fm-icon" href="${y(e.downloadURL)}" target="_blank" rel="noopener" title="Open in new tab" onclick="event.stopPropagation()">${f.ext}</a>`:``}
            ${e.adminMaterial?``:`<button class="fm-btn fm-sm fm-icon fm-danger" title="Delete" onclick="deleteFile('${e.id}')">${f.trash}</button>`}
          </div>
        </div>
      </div>`}).join(``)}</div>`;return`<style>
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
</style><div class="fm fade-in">
    <div class="fm-hero">
      <div>
        <div class="fm-title">Study Material</div>
        <div class="fm-sub-h">Notes, PDFs and question papers — all in one place.</div>
      </div>
      <div class="fm-row">
        <button class="fm-btn fm-primary" onclick="document.getElementById('file-input').click()">${f.up} Upload</button>
        <button class="fm-btn" onclick="document.getElementById('folder-input').click()">${f.folder} Folder</button>
        ${l>0?`<button class="fm-btn fm-danger" onclick="deleteAllUserFiles()">${f.trash} Delete all</button>`:``}
      </div>
    </div>

    <div class="fm-stats">
      <div class="fm-stat"><b>${r.files.length}</b><span>TOTAL FILES</span></div>
      <div class="fm-stat"><b>${u}</b><span>QUESTION PAPERS</span></div>
      <div class="fm-stat fm-store" ${e?``:`onclick="openProModal()" style="cursor:pointer"`}>
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
          <b style="font-size:15px">${e?`☁️ 25 GB Cloud · PRO`:`📁 Free · local storage`}</b>
          <span>${e?`${o} MB used`:`${l}/5 files`}</span>
        </div>
        <div class="fm-bar"><i style="width:${Math.max(s,2)}%;background:${c}"></i></div>
        ${e?``:`<span style="display:block;margin-top:8px"><a>Upgrade for 25 GB cloud sync →</a></span>`}
      </div>
    </div>

    <div class="fm-drop" id="drop-zone"
      onclick="document.getElementById('file-input').click()"
      ondragover="event.preventDefault();this.classList.add('drag-over')"
      ondragleave="this.classList.remove('drag-over')"
      ondrop="event.preventDefault();this.classList.remove('drag-over');handleFileSelect(event.dataTransfer.files)">
      <div class="fm-drop-ic">${f.up}</div>
      <div>
        <div class="fm-drop-t">Drop files here or click to browse</div>
        <div class="fm-drop-s">PDF, images, Word, Excel, PPT, TXT · ${e?`Synced to cloud ☁️`:`Saved on this device`}</div>
      </div>
      <div class="fm-drop-r" onclick="event.stopPropagation()">
        <span style="font-size:11.5px;color:var(--fm-mute)">Add to</span>
        <select id="file-sub-select">${t.map(e=>`<option value="${e.id}">${e.icon} ${y(e.name)}</option>`).join(``)}</select>
      </div>
    </div>

    <details>
      <summary><span style="color:#4ECDC4;display:flex">${f.link}</span> Import from Google Drive ${f.chev}</summary>
      <div class="fm-drive">
        <div style="font-size:12px;color:var(--fm-mute)">Paste a Drive share link — works on any device.</div>
        <div class="fm-r2">
          <input id="drive-link-name" placeholder="File name (e.g. C++ Notes.pdf)"/>
          <select id="drive-link-sub">${t.map(e=>`<option value="${e.id}">${e.icon} ${y(e.name)}</option>`).join(``)}</select>
        </div>
        <div class="fm-r3">
          <input id="drive-link-input" placeholder="https://drive.google.com/file/d/..." style="flex:1"/>
          <button class="fm-btn fm-primary" onclick="addDriveLink()">+ Add link</button>
        </div>
      </div>
    </details>

    <div class="fm-tools">
      <div class="fm-search">${f.search}<input id="file-search" placeholder="Search files and notes…" value="${y(r.fileSearch||``)}"
        oninput="state.fileSearch=this.value;render();setTimeout(()=>{const e=document.getElementById('file-search');if(e){e.focus();e.setSelectionRange(e.value.length,e.value.length)}},60)"/></div>
      <div class="fm-chips">
        <button class="fm-chip fm-qp-btn ${r.fileQPOnly?`on`:``}" onclick="state.fileQPOnly=!state.fileQPOnly;render()">📋 Question Papers</button>
        ${m}
      </div>
    </div>

    ${h}

    <div class="fm-sync">
      ${n.currentUser?`<span style="color:#06D6A0;display:flex">${f.cloud}</span><div>Signed in — your uploads sync to your account and appear on every device.</div>`:`<span style="color:#FF6B35;display:flex">${f.cloud}</span><div>Files are stored on this device only. Sign in to sync them across devices.</div><button onclick="googleSignIn()">Sign in with Google</button>`}
    </div>
  </div>`}function Me(){let e={progress:r.progress,studyLog:r.studyLog,mood:r.mood,hoursToday:r.hoursToday,subjectNotes:r.subjectNotes,materials:r.materials,alarms:r.alarms,exportedAt:new Date().toISOString()},t=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),n=URL.createObjectURL(t),i=document.createElement(`a`);i.href=n,i.download=`studytracker_backup_${S()}.json`,i.click(),URL.revokeObjectURL(n),b(`✅ Data exported!`,`success`)}function Ne(e){let t=e.files[0];if(!t)return;let n=new FileReader;n.onload=e=>{try{Pe(JSON.parse(e.target.result))}catch{b(`⚠️ Invalid backup file`,`alarm`)}},n.readAsText(t),e.value=``}function Pe(e){e.progress&&(r.progress=e.progress),e.studyLog&&(r.studyLog=e.studyLog),e.mood!==void 0&&(r.mood=e.mood),e.hoursToday!==void 0&&(r.hoursToday=e.hoursToday),e.subjectNotes&&(r.subjectNotes=e.subjectNotes),e.materials&&(r.materials=e.materials),e.alarms&&(r.alarms=e.alarms),e.subjectSections&&(r.subjectSections=e.subjectSections),e.appConfig&&(r.appConfig=e.appConfig),[`progress`,`studyLog`,`mood`,`hoursToday`,`subjectNotes`,`materials`,`alarms`,`subjectSections`,`appConfig`].forEach(e=>d(e,r[e])),c(),f(),b(`✅ Data imported successfully!`,`success`),H(),B()}function Fe(){try{let e={progress:r.progress,studyLog:r.studyLog,mood:r.mood,hoursToday:r.hoursToday,subjectNotes:r.subjectNotes,materials:r.materials,alarms:r.alarms,subjectSections:r.subjectSections,appConfig:r.appConfig||{},sharedBy:n.currentUser?.displayName||`A friend`,sharedAt:new Date().toISOString(),version:14},t=JSON.stringify(e),i=btoa(unescape(encodeURIComponent(t))),a=window.location.href.split(`?`)[0]+`?import=`+i;if(a.length>2e3){e.materials=e.materials.slice(0,20);let t=JSON.stringify(e),n=btoa(unescape(encodeURIComponent(t)));Ie(window.location.href.split(`?`)[0]+`?import=`+n),b(`🔗 Share link copied! (materials trimmed for URL limit)`,`success`)}else Ie(a),b(`🔗 Share link copied to clipboard!`,`success`)}catch(e){b(`⚠️ Could not generate share link: `+e.message,`alarm`)}}function Ie(e){if(navigator.clipboard)navigator.clipboard.writeText(e).catch(()=>{let t=document.createElement(`textarea`);t.value=e,document.body.appendChild(t),t.select(),document.execCommand(`copy`),t.remove()});else{let t=document.createElement(`textarea`);t.value=e,document.body.appendChild(t),t.select(),document.execCommand(`copy`),t.remove()}let t=document.getElementById(`share-link-display`);t&&(t.value=e,t.style.display=`block`)}function Le(e){try{let t=decodeURIComponent(escape(atob(e))),n=JSON.parse(t);confirm(`Import study data shared by "${n.sharedBy||`Someone`}" on ${n.sharedAt?new Date(n.sharedAt).toLocaleDateString():`unknown date`}?\n\nThis will merge with your existing data.`)&&(Pe(n),window.history.replaceState({},``,window.location.pathname))}catch{b(`⚠️ Invalid share link`,`alarm`)}}function Re(){let e=new URLSearchParams(window.location.search).get(`import`);e&&setTimeout(()=>Le(e),800)}function ze(){let e=document.getElementById(`share-link-paste`);if(!e)return;let t=e.value.trim(),n=t.match(/[?&]import=([^&]+)/);if(n&&(t=n[1]),!t){b(`⚠️ Paste a valid share link`,`alarm`);return}Le(t)}function Be(){let e=document.getElementById(`cfg-name`)?.value.trim()||`Exam Is Near by ArkSetu`,t=document.getElementById(`cfg-subtitle`)?.value.trim()||`Study Smart`;r.appConfig={name:e,subtitle:t},_(`appConfig`,r.appConfig),f(),b(`✅ App config saved!`,`success`),B()}typeof window<`u`&&Object.assign(window,{checkMaintenance:me,checkShareLinkOnLoad:Re,closePreview:De,copyToClipboard:Ie,deleteAllUserFiles:Ce,deleteFile:Se,deleteUserFileFromCloud:ye,exportData:Me,formatSize:ue,generateShareLink:Fe,getFileIcon:le,getGoogleAccessToken:Oe,getStorageUsedMB:de,handleFileSelect:be,handleFolderSelect:xe,handlePastedShareLink:ze,importData:Ne,importFromShareLink:Le,loadAdminMaterials:fe,loadAnnouncement:he,loadExamSchedule:ge,loadSharedFiles:_e,loadTheme:pe,loadUserFiles:ve,mergeImportData:Pe,openPreview:Ee,renderDocxPreview:ke,renderFiles:je,renderPDFPreview:Ae,saveAppConfig:Be,updateFileNote:we,updateFileSubject:Te});function Ve(){return`<style>
.ab{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:760px;margin:0 auto}
.ab *{box-sizing:border-box}
.ab-hero{position:relative;overflow:hidden;text-align:center;padding:38px 20px 30px;margin-bottom:14px;border-radius:24px;border:1px solid var(--line);background:radial-gradient(circle at 50% 0%,color-mix(in srgb,#FF6B35 20%,transparent),transparent 65%),radial-gradient(circle at 0% 100%,color-mix(in srgb,#4ECDC4 14%,transparent),transparent 55%),var(--glass-bg,var(--surf))}
.ab-hero:before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#FFE66D,#ff6b35,#4ECDC4)}
.ab-logo{width:72px;height:72px;margin:0 auto 14px;border-radius:22px;display:grid;place-items:center;font-size:36px;background:color-mix(in srgb,var(--acc) 14%,transparent);border:1px solid color-mix(in srgb,var(--acc) 30%,transparent)}
.ab-t{font-size:30px;font-weight:800;letter-spacing:-1px;background:linear-gradient(90deg,#FFE66D,#ff6b35);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;line-height:1.1}
.ab-by{font-size:11px;color:var(--mute);letter-spacing:3px;text-transform:uppercase;margin:8px 0 12px;font-weight:700}
.ab-d{font-size:13.5px;color:var(--text-3,#aaa);line-height:1.8;max-width:440px;margin:0 auto}
.ab-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:20px;padding:20px;margin-bottom:14px}
.ab-lbl{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--mute);margin-bottom:12px}
.ab-p{font-size:12.5px;color:var(--mute);line-height:1.8;margin:0 0 14px}
.ab-cg{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:560px){.ab-cg{grid-template-columns:1fr}}
.ab-c{--c:#4ECDC4;display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--line);border-radius:15px;text-decoration:none;background:color-mix(in srgb,var(--txt) 3%,transparent);transition:.2s}
.ab-c:hover{border-color:var(--c);transform:translateY(-2px);box-shadow:0 10px 24px -14px var(--c)}
.ab-c .i{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:18px;background:color-mix(in srgb,var(--c) 14%,transparent);flex-shrink:0}
.ab-c b{display:block;font-size:10px;color:var(--mute);letter-spacing:1px;text-transform:uppercase;font-weight:700}
.ab-c span{display:block;font-size:12px;color:var(--c);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600}
.ab-c em{margin-left:auto;font-style:normal;color:var(--mute)}
.ab-pv{font-size:12.5px;color:var(--mute);line-height:2}
.ab-pv a{color:#4ECDC4}
.ab-v{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.ab-v b{display:block;font-size:14px;color:var(--acc)}
.ab-v span{font-size:11px;color:var(--mute)}
.ab-btn{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);background:var(--surf);color:var(--text-2,#ccc);padding:10px 16px;border-radius:12px;font-weight:700;font-size:12.5px;font-family:inherit;cursor:pointer;transition:.2s}
.ab-btn:hover{border-color:var(--acc)}
.ab-pro{border-color:color-mix(in srgb,var(--acc) 35%,var(--line));background:radial-gradient(circle at 100% 0%,color-mix(in srgb,var(--acc) 14%,transparent),transparent 60%),var(--glass-bg,var(--surf))}
.ab-pro-h{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:16px}
.ab-pro-h b{display:block;font-size:17px;color:var(--acc);margin-bottom:6px}
.ab-pro-h p{margin:0;font-size:12.5px;color:var(--mute);line-height:1.8;max-width:340px}
.ab-price{text-align:center;flex-shrink:0}
.ab-price .n{font-size:32px;font-weight:800;color:var(--acc);font-family:'JetBrains Mono',monospace;letter-spacing:-1.5px;line-height:1}
.ab-price .n small{font-size:12px;color:var(--mute);font-weight:500;font-family:inherit;letter-spacing:0}
.ab-price .d{font-size:10.5px;color:var(--mute);margin:3px 0 12px}
.ab-go{border:none;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;padding:11px 24px;border-radius:12px;font-weight:800;font-size:13px;font-family:inherit;cursor:pointer;box-shadow:0 8px 20px -8px #FFB700aa;transition:.2s}
.ab-go:hover{transform:translateY(-2px)}
.ab-f{display:grid;grid-template-columns:1fr 1fr;gap:2px 10px}
@media(max-width:480px){.ab-f{grid-template-columns:1fr}}
.ab-f div{display:flex;align-items:center;gap:9px;font-size:12px;color:var(--text-3,#aaa);padding:7px 2px}
.ab-f i{font-style:normal;color:#06D6A0;font-weight:800}
.ab-foot{text-align:center;margin-top:18px;font-size:11.5px}
.ab-foot a{color:var(--mute);text-decoration:none}
.ab-foot a:hover{color:var(--txt)}
.ab-foot span{color:var(--line);margin:0 8px}
</style><div class="ab fade-in">
    <div class="ab-hero">
      <div class="ab-logo">📚</div>
      <div class="ab-t">Exam Is Near</div>
      <div class="ab-by">by ArkSetu</div>
      <div class="ab-d">A free AI-powered study companion for JEE, NEET, CBSE, UPSC, CLAT, and NFSU students.</div>
    </div>

    <div class="ab-card">
      <div class="ab-lbl">📬 CONTACT US</div>
      <p class="ab-p">Found a bug or want to suggest a feature? Reach out — we reply fast.</p>
      <div class="ab-cg">
        ${[{icon:`🌐`,label:`Website`,val:`exam-is-near.web.app`,href:`https://exam-is-near.web.app`,color:`#4ECDC4`},{icon:`📧`,label:`Email`,val:`arksetu@gmail.com`,href:`mailto:arksetu@gmail.com`,color:`#06D6A0`},{icon:`🐛`,label:`Bug Report`,val:`arksetu@gmail.com`,href:`mailto:arksetu@gmail.com?subject=Bug Report — Exam Is Near`,color:`#ff6b35`},{icon:`💡`,label:`Feature Request`,val:`arksetu@gmail.com`,href:`mailto:arksetu@gmail.com?subject=Feature Request — Exam Is Near`,color:`#a78bfa`}].map(e=>`<a class="ab-c" style="--c:${e.color}" href="${e.href}" target="_blank" rel="noopener">
          <span class="i">${e.icon}</span>
          <div style="flex:1;min-width:0"><b>${e.label}</b><span>${e.val}</span></div>
          <em>→</em>
        </a>`).join(``)}
      </div>
    </div>

    <div class="ab-card ab-pro">
      <div class="ab-lbl">⭐ UPGRADE TO PRO</div>
      <div class="ab-pro-h">
        <div>
          <b>Exam Is Near Pro</b>
          <p>Unlock AI chat history, unlimited flashcards, cloud backup, advanced analytics, ad-free experience and PDF exports — for less than a cup of chai per day.</p>
        </div>
        <div class="ab-price">
          <div class="n">₹149<small>/mo</small></div>
          <div class="d">≈ ₹5/day</div>
          <button class="ab-go" onclick="openProModal()">⭐ Go Pro</button>
        </div>
      </div>
      <div class="ab-f">${[`🤖 AI Chat History`,`📚 Unlimited Flashcards`,`☁️ 25GB Cloud Backup`,`📈 Advanced Analytics`,`🚫 Ad-Free Experience`,`📤 Export as PDF`,`⚡ Priority AI Tutor`,`🔔 Early Feature Access`].map(e=>`<div><i>✓</i>${e}</div>`).join(``)}</div>
    </div>

    <div class="ab-card">
      <div class="ab-lbl">🔒 PRIVACY &amp; ADS</div>
      <div class="ab-pv">
        • Study data is stored locally on your device or in your Google account via Firebase.<br>
        • We do not sell or share your personal data with third parties.<br>
        • This app uses <b style="color:var(--text-3,#aaa)">Google AdSense</b> to keep it free for everyone.<br>
        • <a href="https://policies.google.com/privacy" target="_blank">Google's Privacy Policy</a> &nbsp;·&nbsp; <a href="https://adssettings.google.com" target="_blank">Manage Ad Settings</a>
      </div>
    </div>

    <div class="ab-card">
      <div class="ab-v">
        <div><b>Exam Is Near · Study Smart v16</b><span>© 2025–2026 ArkSetu. All rights reserved.</span></div>
        <button class="ab-btn" onclick="switchView('sync')">🔄 Sync Settings</button>
      </div>
    </div>

    <div class="ab-foot">
      <a href="privacy.html" target="_blank" rel="noopener">🔒 Privacy Policy</a><span>·</span><a href="https://adssettings.google.com" target="_blank" rel="noopener">Ad Settings</a>
    </div>
  </div>`}localStorage.removeItem(`st_flashcards`),ce(),Re();var He=localStorage.getItem(`courseChosen`);(!h.activeCourse||!He)&&(h.activeCourse=null,setTimeout(()=>u(),900)),`Notification`in window&&Notification.permission==="default"&&setTimeout(()=>Notification.requestPermission(),2e3),setInterval(()=>{er(),nr()},1e3),er(),typeof window<`u`&&Object.assign(window,{_courseChosen:He,renderAbout:Ve});function w(e){if(!e||!e.trim())return null;let t=e.trim().split(/\s+/),n={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11},r=parseInt(t[0]),i=t[1],a=new Date;a.setHours(0,0,0,0);let o=t[2]?parseInt(t[2]):a.getFullYear();if(isNaN(r)||!n.hasOwnProperty(i))return null;let s=new Date(o,n[i],r);return!t[2]&&s<a&&(s=new Date(o+1,n[i],r)),Math.ceil((s-a)/864e5)}function T(e){let t=v().find(t=>t.id===e);if(!t)return 0;let n=0,i=0;return t.units.forEach(t=>t.topics.forEach((a,o)=>{n++,r.progress[`${e}-${t.id}-${o}`]&&i++})),n?Math.round(i/n*100):0}function Ue(){let e=0,t=0;return v().forEach(n=>n.units.forEach(i=>i.topics.forEach((a,o)=>{e++,r.progress[`${n.id}-${i.id}-${o}`]&&t++}))),e?Math.round(t/e*100):0}function E(){return Object.values(r.studyLog).reduce((e,t)=>e+(t.hours||0),0)}function D(){let e=0,t=new Date;for(;e<366;){let n=t.toISOString().split(`T`)[0];if(r.studyLog[n]?.hours>0)e++,t.setDate(t.getDate()-1);else break}return e}m._examDateOverrides=JSON.parse(localStorage.getItem(`st_examDates`)||`{}`);function O(e){if(m._examDateOverrides[e])return m._examDateOverrides[e];let t=(r.examSchedule||[]).find(t=>t.id===e);return t&&t.date?t.date:v().find(t=>t.id===e)?.exam||``}var We=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`];function Ge(e){if(!e||!e.trim())return``;let t={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11},n=e.trim().split(/\s+/),r=parseInt(n[0]),i=n[1];if(isNaN(r)||!t.hasOwnProperty(i))return``;let a=new Date;a.setHours(0,0,0,0);let o=n[2]?parseInt(n[2]):a.getFullYear(),s=new Date(o,t[i],r);!n[2]&&s<a&&(s=new Date(o+1,t[i],r));let c=String(s.getMonth()+1).padStart(2,`0`),l=String(s.getDate()).padStart(2,`0`);return`${s.getFullYear()}-${c}-${l}`}function Ke(e){if(!e)return``;let[t,n,r]=e.split(`-`).map(Number);return!t||!n||!r?``:`${r} ${We[n-1]} ${t}`}function qe(e,t){m._examDateOverrides[e]=t,localStorage.setItem(`st_examDates`,JSON.stringify(m._examDateOverrides)),B(),b(`✅ Exam date updated!`,`success`)}var Je={dashboard:{title:`Dashboard — Exam Is Near`,desc:`Track your study progress, syllabus completion, mood and daily hours. Your personal study overview.`},subjects:{title:`Study Subjects — Exam Is Near`,desc:`Browse and track chapter-wise progress across all your subjects for JEE, NEET, UPSC and NFSU.`},alarms:{title:`Study Alarms & Timer — Exam Is Near`,desc:`Set smart study alarms and reminders to stay on schedule for your exam preparation.`},files:{title:`Study Material — Exam Is Near`,desc:`Manage and access your notes, PDFs and study files synced with Firebase Storage and Google Drive.`},pomodoro:{title:`Pomodoro Timer — Exam Is Near`,desc:`Boost focus with the Pomodoro technique. Free study timer with session tracking for JEE and NEET prep.`},flashcards:{title:`Flashcards — Exam Is Near`,desc:`Create and review flashcards with spaced repetition (SRS) for long-term retention. Free for JEE, NEET, UPSC students.`},quiz:{title:`Quiz Mode — Exam Is Near`,desc:`Test yourself with MCQ quiz mode. Instant feedback, quiz logs and review cards for exam preparation.`},analytics:{title:`Study Analytics — Exam Is Near`,desc:`Visualise your study hours, mood trends and subject-wise progress with detailed analytics and rank predictor.`},ai:{title:`AI Tutor — Exam Is Near`,desc:`Get instant doubt resolution from an AI tutor powered by Groq LLaMA 3.3. Free AI study assistant for students.`},sync:{title:`Sync & Account — Exam Is Near`,desc:`Sync your study data across devices with Firebase cloud backup. Sign in with Google.`},log:{title:`Study Log — Exam Is Near`,desc:`Log your daily study sessions, mood and hours. Build a consistent study habit with the study journal.`},about:{title:`About — Exam Is Near by ArkSetu`,desc:`Learn about Exam Is Near, a free AI-powered study app by ArkSetu built for Indian students.`},profile:{title:`Profile — Exam Is Near`,desc:`Manage your Exam Is Near profile, subscription and preferences.`},neetjee:{title:`NEET / JEE Hub — Exam Is Near`,desc:`Chapter-wise weightage, rank predictor and OMR practice for NEET UG and JEE Mains / Advanced.`},rank:{title:`Rank Predictor — Exam Is Near`,desc:`Free NEET & JEE Main rank predictor. Updated with NTA 2025 official data and JoSAA 2025 closing ranks. Predict your AIR and colleges instantly.`},"course:jee":{title:`JEE Preparation — Exam Is Near`,desc:`Free JEE Mains and Advanced study app. Track Maths, Physics and Chemistry with AI tutor, flashcards, quiz mode and rank predictor.`},"course:neet":{title:`NEET UG Preparation — Exam Is Near`,desc:`Free NEET UG study app. Track Biology, Physics and Chemistry with AI tutor, flashcards, quiz mode and rank predictor.`},"course:nfsu":{title:`NFSU B.Sc. LL.B. Sem II — Exam Is Near`,desc:`Study companion for NFSU B.Sc. LL.B. Semester II. Track subjects, notes, flashcards and quiz mode for forensic law students.`},"course:nfsu1":{title:`NFSU B.Sc. LL.B. Sem I — Exam Is Near`,desc:`Study companion for NFSU B.Sc. LL.B. Semester I. Covers Legal Methods, Law of Tort, Computer Organization, C Programming and Discrete Mathematics.`},"course:nfsu3":{title:`NFSU B.Sc. LL.B. Sem III — Exam Is Near`,desc:`Study companion for NFSU B.Sc. LL.B. Semester III. Covers IPC, Constitutional Law, Contract Law, Family Law, Web Programming and OS Concepts.`},"course:cbse10":{title:`CBSE Class 10 Preparation — Exam Is Near`,desc:`Free CBSE Class 10 board exam study app. Track Maths, Science, English and Social Science with AI tutor and flashcards.`},"course:cbse12":{title:`CBSE Class 12 Preparation — Exam Is Near`,desc:`Free CBSE Class 12 board exam study app. AI tutor, flashcards, quiz mode and syllabus tracker for all streams.`}};function Ye(e){let t=Je[e]||Je[`course:`+e]||Je.dashboard;document.title=t.title;let n=document.querySelector(`meta[name="description"]`);n&&n.setAttribute(`content`,t.desc);let r=document.querySelector(`meta[property="og:title"]`);r&&r.setAttribute(`content`,t.title);let i=document.querySelector(`meta[property="og:description"]`);i&&i.setAttribute(`content`,t.desc);let a=document.querySelector(`meta[property="og:url"]`),o=e===`dashboard`?``:`/`+e;a&&a.setAttribute(`content`,`https://exam-is-near.web.app`+o);let s=document.querySelector(`meta[name="twitter:title"]`);s&&s.setAttribute(`content`,t.title);let c=document.querySelector(`meta[name="twitter:description"]`);c&&c.setAttribute(`content`,t.desc);let l=document.querySelector(`link[rel="canonical"]`),u=e.startsWith(`course:`)?`/course/`+e.split(`:`)[1]:o;l&&l.setAttribute(`href`,`https://exam-is-near.web.app`+u),a&&e.startsWith(`course:`)&&a.setAttribute(`content`,`https://exam-is-near.web.app`+u)}function Xe(e,t=!0){if((e===`rank`||e===`rank:neet`||e===`rank:jee`)&&(a.tab=`rank`,e===`rank:neet`&&(a.exam=`neet`),e===`rank:jee`&&(a.exam=`jee`),e=`neetjee`),e!==`pomodoro`&&typeof Pt==`function`&&Pt(),t){let t=e===`dashboard`?`/`:`/`+e;history.pushState({view:e},``,t)}Ye(e),r.view=e,r.showAddForm=!1,r.editingMatId=null,document.body.classList.toggle(`ai-fullscreen-view`,e===`ai`),e===`files`&&n.db&&n.currentUser&&fe().then(()=>B()),document.querySelectorAll(`.nav-pill`).forEach(t=>{let n=t.getAttribute(`onclick`)||``;t.classList.toggle(`active`,n.includes(`switchView('`+e+`')`))});let i=document.getElementById(`neetjee-nav-pill`);i&&(h.activeCourse===`nfsu`||h.activeCourse===`nfsu1`||h.activeCourse===`nfsu3`||h.activeCourse===`cbse10`||h.activeCourse===`cbse12`||h.activeCourse===null?i.style.display=`none`:(i.style.display=``,i.textContent=h.activeCourse===`jee`?`⚡ JEE`:`🩺 NEET`),i.classList.toggle(`active`,e===`neetjee`)),B()}function Ze(e,t,n){let i=`${e}-${t}-${n}`;r.progress[i]=!r.progress[i],_(`progress`,r.progress),r.progress[i]&&H(),B()}function Qe(e){r.activeSubject=e,B()}function $e(e){r.mood=e,_(`mood`,e),B()}function et(e){r.hoursToday=parseFloat(e);var t=h.activeCourse?`hoursToday_`+h.activeCourse:`hoursToday`;_(t,e);let n=document.getElementById(`hours-display`);n&&(n.textContent=r.hoursToday+`h`)}function tt(e,t){r.subjectNotes[e]=t,_(`subjectNotes`,r.subjectNotes)}function nt(){r.studyLog[S()]={hours:r.hoursToday,mood:r.mood,subject:r.activeSubject};var e=h.activeCourse?`studyLog_`+h.activeCourse:`studyLog`;_(e,r.studyLog),b(`✅ Day logged!`,`success`),H(),B()}function rt(e,t){e===`sub`?r.matSubFilter=r.matSubFilter===t?`all`:t:r.matTypeFilter=r.matTypeFilter===t?`all`:t,B()}function it(e){r.matSearch=e,B()}function at(){r.showAddForm=!0,r.editingMatId=null,r.newMat={subjectId:`cpp`,type:`📝 Note`,title:``,content:``,tags:``},B()}function ot(){r.showAddForm=!1,B()}function st(e,t){r.newMat[e]=t}function ct(){let e=r.newMat,t=document.getElementById(`new-title`)?.value||e.title,n=document.getElementById(`new-content`)?.value||e.content,i=document.getElementById(`new-tags`)?.value||e.tags,a=document.getElementById(`new-sub`)?.value||e.subjectId,o=document.getElementById(`new-type`)?.value||e.type;if(!t.trim()||!n.trim()){b(`⚠️ Fill title and content`,`alarm`);return}let s={id:x(),subjectId:a,type:o,title:t,content:n,tags:i.split(`,`).map(e=>e.trim()).filter(Boolean),created:S(),pinned:!1};r.materials.unshift(s),_(`materials`,r.materials),r.showAddForm=!1,b(`✅ Material saved!`,`success`),H(),B()}function lt(e){confirm(`Delete this material?`)&&(r.materials=r.materials.filter(t=>t.id!==e),_(`materials`,r.materials),b(`🗑️ Deleted`,`info`),B())}function ut(e){let t=r.materials.find(t=>t.id===e);t&&(t.pinned=!t.pinned,_(`materials`,r.materials),B())}function dt(e){r.editingMatId=e,r.showAddForm=!1,B()}function ft(){r.editingMatId=null,B()}function pt(e){let t=document.getElementById(`edit-title`)?.value||``,n=document.getElementById(`edit-content`)?.value||``,i=document.getElementById(`edit-tags`)?.value||``,a=document.getElementById(`edit-sub`)?.value||`cpp`,o=document.getElementById(`edit-type`)?.value||`📝 Note`;if(!t.trim()||!n.trim()){b(`⚠️ Fill title and content`,`alarm`);return}let s=r.materials.find(t=>t.id===e);s&&Object.assign(s,{title:t,content:n,subjectId:a,type:o,tags:i.split(`,`).map(e=>e.trim()).filter(Boolean)}),_(`materials`,r.materials),r.editingMatId=null,b(`✅ Updated!`,`success`),B()}function mt(){let e=document.getElementById(`al-time`)?.value||`07:00`,t=document.getElementById(`al-label`)?.value||`Study Time`,n=document.getElementById(`al-repeat`)?.checked||!1,i=document.getElementById(`al-ringtone`)?.value||V,a={id:x(),time:e,label:t,enabled:!0,repeat:n,days:[],ringtone:i};r.alarms.push(a),_(`alarms`,r.alarms),b(`⏰ Alarm set for `+e,`success`),B()}function ht(){let e=[{time:`05:30`,label:`🌅 Early Bird Wake-up`},{time:`06:00`,label:`🌄 Morning Start`},{time:`06:30`,label:`☀️ Rise & Shine`},{time:`07:00`,label:`📚 Morning Study Block`},{time:`07:30`,label:`⏰ Study Begins`},{time:`08:00`,label:`📖 Deep Work Session`},{time:`08:30`,label:`🎯 Focus Block 1`},{time:`09:00`,label:`📝 C++ / RDBMS Time`},{time:`09:30`,label:`☕ Short Break`},{time:`10:00`,label:`📚 Study Block 2`},{time:`10:30`,label:`🧠 Concepts Review`},{time:`11:00`,label:`📊 Stats Practice`},{time:`11:30`,label:`⚖️ Law & Jurisprudence`},{time:`12:00`,label:`🍽️ Lunch Break`},{time:`12:30`,label:`😴 Afternoon Nap (20 min)`},{time:`13:00`,label:`📖 Post-Lunch Study`},{time:`13:30`,label:`🎯 Focus Block 3`},{time:`14:00`,label:`📝 Revision Session`},{time:`14:30`,label:`☕ Tea Break`},{time:`15:00`,label:`📚 Deep Dive Block`},{time:`15:30`,label:`🧮 Formula Review`},{time:`16:00`,label:`📋 Notes Compilation`},{time:`16:30`,label:`🔔 Hydration Reminder`},{time:`17:00`,label:`🏃 Exercise / Walk Break`},{time:`17:30`,label:`📖 Evening Study Start`},{time:`18:00`,label:`📚 Evening Block 1`},{time:`18:30`,label:`🎯 Focus Session`},{time:`19:00`,label:`🍽️ Dinner Time`},{time:`19:30`,label:`📖 Post-Dinner Study`},{time:`20:00`,label:`📝 Night Revision`},{time:`20:30`,label:`🧠 Weak Topics Review`},{time:`21:00`,label:`📊 Mock Questions`},{time:`21:30`,label:`☕ Break & Relax`},{time:`22:00`,label:`📖 Final Study Block`},{time:`22:30`,label:`✍️ Notes Summary`},{time:`23:00`,label:`🌙 Wind Down`},{time:`23:30`,label:`📋 Tomorrow's Plan`},{time:`00:00`,label:`🛌 Bedtime Reminder`},{time:`06:15`,label:`🧘 Morning Stretch`},{time:`08:45`,label:`🔔 Pomodoro Start`},{time:`09:15`,label:`⏸ Pomodoro Break`},{time:`10:15`,label:`🔔 Pomodoro 2 Start`},{time:`10:45`,label:`⏸ Pomodoro 2 Break`},{time:`11:15`,label:`🔔 Pomodoro 3 Start`},{time:`11:45`,label:`⏸ Pomodoro 3 Break`},{time:`14:15`,label:`🔔 Pomodoro 4 Start`},{time:`14:45`,label:`⏸ Pomodoro 4 Break`},{time:`16:15`,label:`🔔 Pomodoro 5 Start`},{time:`20:15`,label:`🔔 Pomodoro 6 Start`},{time:`07:45`,label:`📱 No Phone — Focus!`}],t=0;e.forEach(e=>{r.alarms.find(t=>t.time===e.time&&t.label===e.label)||(r.alarms.push({id:x(),time:e.time,label:e.label,enabled:!0,repeat:!0,days:[],ringtone:`classic`}),t++)}),_(`alarms`,r.alarms),b(`✅ ${t} preset alarms added!`,`success`),H(),B()}function gt(e){r.alarms=r.alarms.filter(t=>t.id!==e),_(`alarms`,r.alarms),B()}function _t(e){let t=r.alarms.find(t=>t.id===e);t&&(t.enabled=!t.enabled,_(`alarms`,r.alarms),B())}function vt(e){r.timerMode=e,clearInterval(n.timerInterval),n.timerInterval=null,r.timerRunning=!1,r.timerSeconds={study:1500,short:300,long:900}[e],B()}typeof window<`u`&&Object.assign(window,{_EXAM_MONTHS:We,_examDateToISO:Ge,_isoToExamDate:Ke,_pageMeta:Je,_updatePageMeta:Ye,addMaterial:ct,addPresetAlarms:ht,cancelEdit:ft,deleteAlarm:gt,deleteMaterial:lt,getDaysLeft:w,getExamDate:O,getStreak:D,getSubjectPct:T,getTotalHours:E,getTotalPct:Ue,hideAddForm:ot,logToday:nt,saveEdit:pt,saveNewAlarm:mt,saveSubjectNote:tt,searchMats:it,setActiveSubject:Qe,setExamDate:qe,setHours:et,setMatFilter:rt,setMood:$e,setTimerMode:vt,showAddForm:at,startEdit:dt,switchView:Xe,toggleAlarm:_t,togglePin:ut,toggleTopic:Ze,updateNewMat:st});var yt=[{label:`Classic`,work:25,short:5,long:15},{label:`Short`,work:15,short:3,long:10},{label:`Deep`,work:50,short:10,long:20},{label:`Custom`,work:25,short:5,long:15}],k=[`Focus is the bridge between setting a goal and achieving it.`,`Small daily improvements lead to stunning long-term results.`,`The secret of getting ahead is getting started.`,`One focused session at a time. You've got this!`,`Discipline is choosing what you want most over what you want now.`,`Every expert was once a beginner. Keep going.`,`The exam is near — but so is your success!`,`Concentration is the root of all higher abilities.`],A={running:!1,mode:`work`,timeLeft:1500,sessions:0,interval:null,subject:``,subjectHours:{},breakOverlay:!1,isFullScreen:!1,workMins:25,shortBreak:5,longBreak:15,preset:0,taskName:``,soundOn:!0,sessionLog:[],quoteIdx:Math.floor(Math.random()*k.length)};try{A.subjectHours=JSON.parse(localStorage.getItem(`pom_subHours`)||`{}`)}catch{}try{let e=JSON.parse(localStorage.getItem(`pom_settings`)||`null`);e&&(A.workMins=e.workMins||25,A.shortBreak=e.shortBreak||5,A.longBreak=e.longBreak||15,A.preset=e.preset||0,A.soundOn=e.soundOn!==!1)}catch{}try{A.sessionLog=JSON.parse(localStorage.getItem(`pom_sessionLog`)||`[]`)}catch{}document.addEventListener(`keydown`,e=>{r.view===`pomodoro`&&e.target.tagName!==`INPUT`&&e.target.tagName!==`TEXTAREA`&&(e.code===`Space`&&(e.preventDefault(),A.running?Ot():Et()),e.code===`KeyR`&&!e.ctrlKey&&!e.metaKey&&(e.preventDefault(),kt()))});function bt(){localStorage.setItem(`pom_subHours`,JSON.stringify(A.subjectHours)),_(`pomSubjectHours`,A.subjectHours)}function xt(){localStorage.setItem(`pom_settings`,JSON.stringify({workMins:A.workMins,shortBreak:A.shortBreak,longBreak:A.longBreak,preset:A.preset,soundOn:A.soundOn}))}function St(){try{localStorage.setItem(`pom_sessionLog`,JSON.stringify(A.sessionLog.slice(-50)))}catch{}}function Ct(e){let t=yt[e];A.preset=e,e!==3&&(A.workMins=t.work,A.shortBreak=t.short,A.longBreak=t.long),xt(),A.running||(A.mode=`work`,A.timeLeft=A.workMins*60),B()}function wt(){let e=parseInt(document.getElementById(`pom-custom-work`)?.value)||25,t=parseInt(document.getElementById(`pom-custom-short`)?.value)||5,n=parseInt(document.getElementById(`pom-custom-long`)?.value)||15;A.workMins=Math.max(1,Math.min(90,e)),A.shortBreak=Math.max(1,Math.min(30,t)),A.longBreak=Math.max(1,Math.min(60,n)),A.preset=3,xt(),A.running||(A.mode=`work`,A.timeLeft=A.workMins*60),b(`✅ Custom timer set!`,`success`),B()}function Tt(){A.soundOn=!A.soundOn,xt(),B()}function Et(){if(A.running)return;if(!A.subject){b(`⚠️ Please select a subject first!`,`alarm`);return}A.running=!0,A.breakOverlay=!1,A.quoteIdx=Math.floor(Math.random()*k.length);let e=A.workMins*60,t=A.shortBreak*60,n=A.longBreak*60;A.interval=setInterval(()=>{if(A.running){if(A.timeLeft--,A.mode===`work`&&A.subject&&(A.subjectHours[A.subject]=(A.subjectHours[A.subject]||0)+1,bt()),A.timeLeft<=0){if(A.running=!1,clearInterval(A.interval),A.mode===`work`){A.sessions++,A.sessionLog.push({subject:A.subject,duration:e,mode:`work`,timestamp:Date.now()}),St();let r=A.sessions%4==0;A.mode=r?`longbreak`:`break`,A.timeLeft=r?n:t,A.breakOverlay=!0,b(r?`🎉 4 sessions done! Long break time! 🏆`:`✅ Pomodoro done! Break time 🎉`,`success`),H(),A.soundOn&&Dt(),B();return}A.sessionLog.push({subject:A.subject,duration:A.mode===`longbreak`?n:t,mode:A.mode,timestamp:Date.now()}),St(),A.mode=`work`,A.timeLeft=e,A.breakOverlay=!1,b(`⏰ Break over! Back to work 💪`,`info`),A.soundOn&&Dt(),B();return}j()}},1e3),j()}function Dt(){try{let e=new(window.AudioContext||window.webkitAudioContext);[523,659,784,1047].forEach((t,n)=>{let r=e.createOscillator(),i=e.createGain();r.connect(i),i.connect(e.destination),r.frequency.value=t,r.type=`sine`,i.gain.setValueAtTime(0,e.currentTime+n*.18),i.gain.linearRampToValueAtTime(.18,e.currentTime+n*.18+.05),i.gain.linearRampToValueAtTime(0,e.currentTime+n*.18+.32),r.start(e.currentTime+n*.18),r.stop(e.currentTime+n*.18+.35)})}catch{}}function Ot(){A.running=!1,clearInterval(A.interval),j()}function kt(){A.running=!1,clearInterval(A.interval),A.mode=`work`,A.timeLeft=A.workMins*60,A.breakOverlay=!1,j(),B()}function At(){A.running=!1,clearInterval(A.interval),A.mode=`work`,A.timeLeft=A.workMins*60,A.breakOverlay=!1,b(`⏭️ Break skipped — back to work!`,`info`),B()}function jt(){A.breakOverlay=!1,A.running=!0,(A.mode===`longbreak`?A.longBreak:A.shortBreak)*60,A.interval=setInterval(()=>{if(A.running){if(A.timeLeft--,A.timeLeft<=0){A.running=!1,clearInterval(A.interval),A.mode=`work`,A.timeLeft=A.workMins*60,A.breakOverlay=!1,b(`⏰ Break over! Back to work 💪`,`info`),A.soundOn&&Dt(),B();return}j()}},1e3),j(),B()}function Mt(){!document.fullscreenElement&&!document.webkitFullscreenElement?((document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen||function(){}).call(document.documentElement),A.isFullScreen=!0,setTimeout(()=>{let e=document.getElementById(`pom-fs-overlay`);e||(e=document.createElement(`div`),e.id=`pom-fs-overlay`,document.body.appendChild(e)),e.style.cssText=`position:fixed;inset:0;background:#08080f;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0`,Ft(e),Nt=setInterval(()=>Ft(e),500)},100)):((document.exitFullscreen||document.webkitExitFullscreen||function(){}).call(document),A.isFullScreen=!1,Pt())}var Nt=null;function Pt(){clearInterval(Nt);let e=document.getElementById(`pom-fs-overlay`);e&&e.remove()}function Ft(e){let t=Math.floor(A.timeLeft/60).toString().padStart(2,`0`),n=(A.timeLeft%60).toString().padStart(2,`0`),r=v().find(e=>e.id===A.subject),i=A.mode===`work`?`#FFE66D`:A.mode===`longbreak`?`#C77DFF`:`#06D6A0`;e.innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;gap:0;padding:40px">
      <div style="font-size:11px;letter-spacing:4px;color:#555;text-transform:uppercase;margin-bottom:18px">${A.mode===`work`?`🍅 Focus Time`:A.mode===`longbreak`?`🏆 Long Break`:`☕ Short Break`}</div>
      <div style="font-size:min(22vw,260px);font-weight:300;color:${i};font-family:monospace;line-height:1;letter-spacing:4px;text-shadow:0 0 80px ${i}44;user-select:none">${t}:${n}</div>
      <div style="font-size:12px;color:#444;letter-spacing:3px;margin-top:14px">${A.running?`● RUNNING`:A.mode===`work`?`READY`:`PAUSED`}</div>
      ${r?`<div style="margin-top:10px;font-size:14px;color:${r.color};font-weight:bold;letter-spacing:1px">${r.icon} ${r.name}</div>`:``}
      ${A.taskName?`<div style="margin-top:6px;font-size:12px;color:#555;font-style:italic">${y(A.taskName)}</div>`:``}
      <div style="display:flex;gap:14px;margin-top:36px;flex-wrap:wrap;justify-content:center">
        ${A.running?``:`<button onclick="pomStart()" style="background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border:none;padding:14px 36px;border-radius:12px;font-size:16px;cursor:pointer;font-weight:bold;letter-spacing:0.5px">&#9654; Start</button>`}
        ${A.running?`<button onclick="pomPause()" style="background:#1a1a28;border:1px solid #333;color:#ccc;padding:14px 28px;border-radius:12px;font-size:16px;cursor:pointer">&#9646;&#9646; Pause</button>`:``}
        <button onclick="pomReset()" style="background:#1a1a28;border:1px solid #333;color:#ccc;padding:14px 28px;border-radius:12px;font-size:16px;cursor:pointer">&#8635; Reset</button>
        <button onclick="pomToggleFullScreen()" style="background:#1a1a28;border:1px solid #333;color:#666;padding:14px 20px;border-radius:12px;font-size:14px;cursor:pointer">&#10005; Exit</button>
      </div>
      <div style="display:flex;justify-content:center;gap:10px;margin-top:28px">
        ${[1,2,3,4].map(e=>`<div style="width:12px;height:12px;border-radius:50%;background:${e<=A.sessions%4||A.sessions>0&&A.sessions%4==0&&e===4?`#FFE66D`:`#1e1e2e`};box-shadow:${e<=A.sessions%4||A.sessions>0&&A.sessions%4==0&&e===4?`0 0 8px #FFE66D88`:`none`}"></div>`).join(``)}
      </div>
      <div style="margin-top:20px;font-size:11px;color:#222;font-style:italic">"${k[A.quoteIdx]}"</div>
    </div>`}window.addEventListener(`popstate`,()=>{r.view===`neetjee`&&a.tab!==`home`&&(a.tab=`home`,Xe(`neetjee`))});function It(){!document.fullscreenElement&&!document.webkitFullscreenElement&&(A.isFullScreen=!1,Pt())}document.addEventListener(`fullscreenchange`,It),document.addEventListener(`webkitfullscreenchange`,It);function Lt(e){A.subject=e,B()}function Rt(e){let t=A.subjectHours[e]||0,n=Math.floor(t/3600),r=Math.floor(t%3600/60);return n>0?n+`h `+r+`m`:r+`m`}function zt(){let e=Object.values(A.subjectHours).reduce((e,t)=>e+t,0),t=Math.floor(e/3600),n=Math.floor(e%3600/60);return t>0?t+`h `+n+`m`:n+`m`}function j(){let e=document.getElementById(`pom-display`);if(!e)return;let t=Math.floor(A.timeLeft/60).toString().padStart(2,`0`),n=(A.timeLeft%60).toString().padStart(2,`0`);e.textContent=`${t}:${n}`;let r=document.getElementById(`pom-label`);r&&(r.textContent=A.mode===`work`?`🍅 Focus Time`:A.mode===`longbreak`?`🏆 Long Break`:`☕ Short Break`);let i=A.mode===`work`?A.workMins*60:A.mode===`longbreak`?A.longBreak*60:A.shortBreak*60,a=1-A.timeLeft/i,o=document.getElementById(`pom-ring-fill`);if(o){let e=2*Math.PI*90;o.style.strokeDasharray=e,o.style.strokeDashoffset=e*(1-a),o.style.stroke=A.mode===`work`?`#FFE66D`:A.mode===`longbreak`?`#C77DFF`:`#06D6A0`}let s=document.getElementById(`pom-status`);s&&(s.textContent=A.running?`● RUNNING`:A.mode===`work`?`READY`:`PAUSED`),A.running?document.title=`⏱ ${t}:${n} ${A.mode===`work`?`📚`:`☕`} — Exam Is Near`:document.title=`Exam Is Near — Study Smart | by ArkSetu`}function Bt(){let e=Math.floor(A.timeLeft/60).toString().padStart(2,`0`),t=(A.timeLeft%60).toString().padStart(2,`0`),n=v(),r=A.mode===`work`?A.workMins*60:A.mode===`longbreak`?A.longBreak*60:A.shortBreak*60,i=1-A.timeLeft/r,a=2*Math.PI*90,o=a*(1-i),s=A.mode===`work`?`#FFE66D`:A.mode===`longbreak`?`#C77DFF`:`#06D6A0`,c=A.mode===`work`?`#ff6b35`:A.mode===`longbreak`?`#a78bfa`:`#059669`,l=n.find(e=>e.id===A.subject),u=A.mode===`longbreak`,d=A.mode===`work`?`🍅 Focus Time`:A.mode===`longbreak`?`🏆 Long Break`:`☕ Short Break`,f=A.running?`● RUNNING`:A.mode===`work`?`READY`:`PAUSED`,p=e=>e<=A.sessions%4||A.sessions>0&&A.sessions%4==0&&e===4,m=A.breakOverlay?`
    <div class="pm-ovl">
      <div class="pm-ovl-box" style="--bc:${u?`#C77DFF`:`#06D6A0`}">
        <div style="font-size:60px;margin-bottom:12px;animation:float 2s ease-in-out infinite">${u?`🏆`:`☕`}</div>
        <div style="font-size:22px;font-weight:800;color:var(--bc);margin-bottom:6px">${u?`Long Break Earned!`:`Session Complete!`}</div>
        <div style="font-size:13px;color:var(--text-4,#888);margin-bottom:4px">Session <b style="color:#FFE66D">${A.sessions}</b> done${l?` · `+y(l.icon+` `+l.name):``}</div>
        ${u?`<div style="font-size:12px;color:#C77DFF;margin-bottom:4px;font-weight:700">🎉 4 sessions completed! You've earned a long break!</div>`:``}
        <div style="font-size:13px;color:var(--text-5,#777);margin-bottom:22px;line-height:1.8">${u?`Enjoy a well-deserved `+A.longBreak+`-minute break.`:`You've earned a `+A.shortBreak+`-minute break.<br>Your brain will thank you!`}</div>
        <div style="font-size:12px;color:var(--text-5,#777);font-style:italic;margin-bottom:20px;padding:12px;background:color-mix(in srgb,var(--text,#eee) 5%,transparent);border-radius:12px">"${k[A.quoteIdx]}"</div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="pm-btn p" onclick="pomStartBreak()">${u?`🏆`:`☕`} Start Break (${u?A.longBreak:A.shortBreak} min)</button>
          <button class="pm-btn" onclick="pomSkipBreak()" style="color:#FF6B35;border-color:#FF6B3555">⏭ Skip Break</button>
        </div>
      </div>
    </div>`:``,h=n.filter(e=>A.subjectHours[e.id]>0).map(e=>`
    <div class="pm-row" style="--c:${e.color}">
      <span class="pm-row-ic">${e.icon}</span>
      <div style="flex:1;min-width:0">
        <div class="pm-row-n">${y(e.name)}</div>
        <div class="pm-mini"><i style="width:${Math.min(100,(A.subjectHours[e.id]||0)/3600*20)}%"></i></div>
      </div>
      <div class="pm-row-v">${Rt(e.id)}</div>
    </div>`).join(``),g=A.sessionLog.filter(e=>e.mode===`work`).slice(-5).reverse();return`${m}${`<style>
.pm{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);--rc:${s};width:100%;padding:8px 4px 40px}
.pm *{box-sizing:border-box}
.pm-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:18px}
.pm-h1{font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--txt);line-height:1.1}
.pm-h2{font-size:13px;color:var(--mute);margin-top:6px}
.pm-tools{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:12.5px;color:var(--mute)}
.pm-tools b{font-size:15px}
.pm-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--line);background:var(--surf);color:var(--text-2,#ccc);padding:10px 16px;border-radius:12px;font-weight:700;font-size:13px;font-family:inherit;cursor:pointer;transition:.2s}
.pm-btn:hover{border-color:var(--acc);transform:translateY(-1px)}
.pm-btn.p{background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-color:transparent;box-shadow:0 6px 18px -6px #FFB70088}
.pm-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
.pm-grid{display:grid;grid-template-columns:minmax(300px,440px) 1fr;gap:18px;align-items:start}
@media(max-width:860px){.pm-grid{grid-template-columns:1fr}}
.pm-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:20px;padding:20px}
.pm-lbl{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--mute);margin-bottom:12px}
.pm-presets{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:14px}
.pm-pre{border:1px solid var(--line);background:var(--surf);color:var(--mute);padding:9px 4px;border-radius:12px;font-family:inherit;font-size:11.5px;font-weight:600;cursor:pointer;transition:.2s;text-align:center}
.pm-pre small{display:block;font-size:9.5px;opacity:.7;margin-top:2px}
.pm-pre.on{border-color:var(--rc);color:var(--rc);background:color-mix(in srgb,var(--rc) 14%,var(--surf));font-weight:800}
.pm-timer{text-align:center;padding:26px 20px;border-color:color-mix(in srgb,var(--rc) 35%,var(--line));background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--rc) 14%,transparent),transparent 65%),var(--glass-bg,var(--surf))}
.pm-mode{font-size:11px;letter-spacing:3px;color:var(--text-4,#888);text-transform:uppercase;margin-bottom:14px;font-weight:700}
.pm-ringw{position:relative;display:inline-block;margin-bottom:16px;max-width:100%}
.pm-ringw svg{display:block;max-width:100%;height:auto}
.pm-ringt{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
#pom-display{font-size:56px;font-weight:800;color:var(--rc);font-family:'JetBrains Mono',monospace;line-height:1;letter-spacing:-2px;text-shadow:0 0 30px color-mix(in srgb,var(--rc) 40%,transparent)}
#pom-status{font-size:10px;color:var(--mute);margin-top:8px;letter-spacing:2px;font-weight:700}
.pm-task{width:100%;text-align:center;font-size:13px;border-radius:12px;padding:11px 13px;margin:0 0 16px}
.pm-ctl{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.pm-ctl .pm-btn.p{padding:12px 30px;font-size:14px}
.pm-ctl .pm-btn{padding:12px 20px;font-size:14px}
.pm-hint{font-size:10px;color:var(--text-7,#666);margin-top:12px;letter-spacing:1px}
.pm-dots{display:flex;justify-content:center;gap:8px;margin-top:18px}
.pm-dots i{width:10px;height:10px;border-radius:50%;background:color-mix(in srgb,var(--txt) 12%,transparent);transition:.4s}
.pm-dots i.on{background:#FFE66D;box-shadow:0 0 8px #FFE66D99}
.pm-cap{font-size:10px;color:var(--mute);margin-top:7px;letter-spacing:1px}
.pm-quote{margin-top:12px;padding:12px 16px;border:1px solid var(--line);border-radius:14px;text-align:center;font-size:12px;color:var(--mute);font-style:italic}
.pm-how{margin-top:14px;font-size:12.5px;color:var(--mute);line-height:2}
.pm-how b{color:var(--txt)}
.pm-side{display:flex;flex-direction:column;gap:14px}
.pm-subs{display:flex;flex-wrap:wrap;gap:8px}
.pm-sub{--c:#7C6CF0;border:1px solid var(--line);background:var(--surf);color:var(--mute);padding:9px 14px;border-radius:99px;font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer;transition:.2s}
.pm-sub:hover{color:var(--txt);border-color:var(--c)}
.pm-sub.on{border-color:var(--c);color:var(--c);background:color-mix(in srgb,var(--c) 16%,var(--surf));box-shadow:0 6px 16px -8px var(--c);font-weight:800}
.pm-cur{margin-top:14px;padding:12px 14px;border-radius:14px;border:1px solid color-mix(in srgb,var(--c) 30%,var(--line));background:color-mix(in srgb,var(--c) 8%,transparent);display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.pm-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid var(--line);border-radius:14px;margin-bottom:8px}
.pm-row-ic{font-size:19px}
.pm-row-n{font-size:12.5px;font-weight:700;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pm-mini{height:4px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);margin-top:6px;overflow:hidden}
.pm-mini i{display:block;height:100%;background:var(--c);border-radius:99px;transition:width .5s}
.pm-row-v{font-size:13px;font-weight:800;color:var(--c);flex-shrink:0}
.pm-empty{text-align:center;padding:30px 0;color:var(--mute)}
.pm-empty b{display:block;color:var(--txt);margin:8px 0 3px}
.pm-log{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;background:color-mix(in srgb,var(--txt) 4%,transparent);margin-bottom:6px}
.pm-ovl{position:fixed;inset:0;background:#000000aa;z-index:9998;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)}
.pm-ovl-box{background:var(--surf);border:2px solid var(--bc);border-radius:24px;padding:36px 30px;text-align:center;max-width:400px;width:92%;animation:fadeInUp .3s ease}
</style>`}
  <div id="pom-fullscreen-wrap" style="background:var(--bg);min-height:100%">
  <div class="pm fade-in">

    <div class="pm-head">
      <div>
        <div class="pm-h1">🍅 Pomodoro</div>
        <div class="pm-h2">Focus · Flow · Succeed</div>
      </div>
      <div class="pm-tools">
        <span>Sessions <b style="color:#06D6A0">${A.sessions}</b>${A.sessions>0?` · <b style="color:var(--gold,#FFE66D)">${zt()}</b> total`:``}</span>
        <button class="pm-btn" onclick="pomToggleSound()" title="Toggle sound" style="padding:9px 13px;color:${A.soundOn?`#FFE66D`:`var(--mute)`}">${A.soundOn?`🔔`:`🔕`}</button>
        <button class="pm-btn" onclick="pomToggleFullScreen()">⛶ Full Screen</button>
      </div>
    </div>

    <div class="pm-grid">
      <div>
        <div class="pm-presets">
          ${yt.map((e,t)=>`<button class="pm-pre ${A.preset===t?`on`:``}" onclick="pomSetPreset(${t})">${e.label}${t<3?`<small>${e.work}m</small>`:`<small>Set</small>`}</button>`).join(``)}
        </div>

        ${A.preset===3?`
        <div class="pm-card" style="margin-bottom:14px;padding:16px">
          <div class="pm-lbl">⚙️ CUSTOM DURATION</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
            <div><div style="font-size:10px;color:var(--mute);margin-bottom:5px">Work (min)</div><input id="pom-custom-work" type="number" min="1" max="90" value="${A.workMins}" style="text-align:center;font-size:14px;font-weight:800;color:#FFE66D;margin:0"/></div>
            <div><div style="font-size:10px;color:var(--mute);margin-bottom:5px">Short break</div><input id="pom-custom-short" type="number" min="1" max="30" value="${A.shortBreak}" style="text-align:center;font-size:14px;font-weight:800;color:#06D6A0;margin:0"/></div>
            <div><div style="font-size:10px;color:var(--mute);margin-bottom:5px">Long break</div><input id="pom-custom-long" type="number" min="1" max="60" value="${A.longBreak}" style="text-align:center;font-size:14px;font-weight:800;color:#C77DFF;margin:0"/></div>
          </div>
          <button class="pm-btn p" onclick="pomApplyCustom()" style="width:100%">✅ Apply Custom</button>
        </div>`:``}

        <div class="pm-card pm-timer">
          <div id="pom-label" class="pm-mode">${d}</div>
          <div class="pm-ringw">
            <svg width="250" height="250" viewBox="0 0 260 260" style="transform:rotate(-90deg)">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:${s};stop-opacity:1"/>
                  <stop offset="100%" style="stop-color:${c};stop-opacity:1"/>
                </linearGradient>
              </defs>
              <circle cx="130" cy="130" r="90" fill="none" stroke="currentColor" style="color:color-mix(in srgb,var(--txt) 9%,transparent)" stroke-width="16"/>
              <circle id="pom-ring-fill" cx="130" cy="130" r="90" fill="none" stroke="url(#ringGrad)" stroke-width="16"
                stroke-linecap="round"
                style="stroke-dasharray:${a};stroke-dashoffset:${o};transition:stroke-dashoffset 1s linear,stroke .5s;filter:drop-shadow(0 0 8px ${s}66)"/>
            </svg>
            <div class="pm-ringt">
              <div id="pom-display">${e}:${t}</div>
              <div id="pom-status">${f}</div>
              ${l?`<div style="margin-top:8px;font-size:11.5px;color:${l.color};font-weight:700">${l.icon} ${y(l.name)}</div>`:``}
            </div>
          </div>

          <input class="pm-task" placeholder="What are you working on? (optional)" value="${y(A.taskName)}" oninput="pomState.taskName=this.value"/>

          <div class="pm-ctl">
            <button class="pm-btn p" onclick="pomStart()" ${A.running?`disabled`:``}>▶ ${A.running?`Running…`:`Start`}</button>
            <button class="pm-btn" onclick="pomPause()" title="Pause (Space)">⏸</button>
            <button class="pm-btn" onclick="pomReset()" title="Reset (R)">↺</button>
          </div>
          <div class="pm-hint">SPACE = Start/Pause &nbsp;·&nbsp; R = Reset</div>

          <div class="pm-dots">${[1,2,3,4].map(e=>`<i class="${p(e)?`on`:``}"></i>`).join(``)}</div>
          <div class="pm-cap">4 SESSIONS → LONG BREAK (${A.longBreak} min)</div>
        </div>

        ${A.running?`<div class="pm-quote">"${k[A.quoteIdx]}"</div>`:``}

        <div class="pm-card" style="margin-top:14px">
          <div class="pm-lbl">ℹ️ HOW IT WORKS</div>
          <div class="pm-how">
            1️⃣ Pick a subject &amp; set a task<br>
            2️⃣ Hit <b>Start</b> — focus session begins<br>
            3️⃣ Break overlay appears — take it or skip it<br>
            4️⃣ Every <b style="color:#C77DFF">4 sessions</b> = ${A.longBreak}-min long break 🏆<br>
            📊 Hours tracked per subject automatically &amp; synced!
          </div>
        </div>
      </div>

      <div class="pm-side">
        <div class="pm-card" ${l?`style="border-color:color-mix(in srgb,${l.color} 40%,var(--line))"`:``}>
          <div class="pm-lbl">📚 CHOOSE SUBJECT</div>
          <div class="pm-subs">
            ${n.map(e=>`<button class="pm-sub ${A.subject===e.id?`on`:``}" style="--c:${e.color}" onclick="pomSetSubject('${e.id}')">${e.icon} ${y(e.name)}</button>`).join(``)}
          </div>
          ${l?`<div class="pm-cur" style="--c:${l.color}">
            <div style="font-size:13.5px;color:${l.color};font-weight:800">${l.icon} ${y(l.name)}</div>
            <div style="font-size:12px;color:var(--gold,#FFE66D);font-weight:800">⏱ ${Rt(l.id)} logged</div>
          </div>`:`<div style="margin-top:14px;font-size:12.5px;color:var(--mute);text-align:center">Select a subject to begin</div>`}
        </div>

        <div class="pm-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:6px">
            <div class="pm-lbl" style="margin:0">📊 STUDY HOURS BY SUBJECT</div>
            ${Object.keys(A.subjectHours).length>0?`<button class="pm-btn" style="padding:5px 11px;font-size:11px" onclick="if(confirm('Clear all study hour data?')){pomState.subjectHours={};pomSaveHours();render();}">Clear</button>`:``}
          </div>
          ${h||`<div class="pm-empty"><div style="font-size:34px">📭</div><b>No data yet</b><span style="font-size:12px">Start a session to track your hours</span></div>`}
        </div>

        ${g.length>0?`
        <div class="pm-card">
          <div class="pm-lbl">🕓 RECENT SESSIONS</div>
          ${g.map(e=>{let t=n.find(t=>t.id===e.subject),r=Math.floor(e.duration/60),i=new Date(e.timestamp),a=i.getHours().toString().padStart(2,`0`)+`:`+i.getMinutes().toString().padStart(2,`0`);return`<div class="pm-log">
              <span style="font-size:15px">${t?.icon||`📚`}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;font-weight:600;color:var(--txt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${y(t?.name||e.subject)}</div>
                <div style="font-size:10.5px;color:var(--mute)">${a}</div>
              </div>
              <div style="font-size:12px;font-weight:800;color:var(--gold,#FFE66D)">${r}m</div>
            </div>`}).join(``)}
        </div>`:``}
      </div>
    </div>
  </div>
  </div>`}typeof window<`u`&&Object.assign(window,{POM_PRESETS:yt,POM_QUOTES:k,_pomFSChange:It,pomApplyCustom:wt,pomCleanupFS:Pt,pomFSInterval:Nt,pomGetSubjectHoursFormatted:Rt,pomPause:Ot,pomPlayChime:Dt,pomRenderFSOverlay:Ft,pomReset:kt,pomSaveHours:bt,pomSaveLog:St,pomSaveSettings:xt,pomSetPreset:Ct,pomSetSubject:Lt,pomSkipBreak:At,pomStart:Et,pomStartBreak:jt,pomState:A,pomToggleFullScreen:Mt,pomToggleSound:Tt,pomTotalHoursFormatted:zt,renderPomodoro:Bt,updatePomDisplay:j});var M={questions:[],current:0,selected:null,score:0,done:!1,generating:!1,subSel:``,unitSel:``,countSel:`15`,showHistory:!1,doneFilter:`All`,reviewFilter:`All`,reviewId:null,openReviewId:null};m._proStatusCache=!1,m.quizLog=JSON.parse(localStorage.getItem(`ein_quiz_log`)||`[]`),m.flashLog=JSON.parse(localStorage.getItem(`ein_flash_log`)||`[]`);var Vt=100,Ht=100;function Ut(e){M.openReviewId=M.openReviewId===e?null:e,M.reviewFilter=`All`,B()}function Wt(){localStorage.setItem(`ein_quiz_log`,JSON.stringify(m.quizLog.slice(-100))),g||(clearTimeout(_._timer),_._timer=setTimeout(c,1200))}function Gt(){localStorage.setItem(`ein_flash_log`,JSON.stringify(m.flashLog.slice(-100))),g||(clearTimeout(_._timer),_._timer=setTimeout(c,1200))}async function Kt(e,t){let n=M.subSel||``;if(!n){b(`⚠️ Please select a subject first`,`alarm`);return}if(!await Y()){if($.freeQuizCount>=3){b(`⭐ Free limit reached (3 quizzes). Upgrade to Pro for unlimited quizzes!`,`alarm`),G();return}$.freeQuizCount=jr(`ein_free_quiz_day`)}let r=await Y(),i=parseInt(t)||15,a=r?i:Math.min(i,20);!r&&i>20&&(b(`⭐ 50-question quizzes are Pro only. Generating 20 Qs instead — upgrade to Pro!`,`alarm`),G());let o=v().find(e=>e.id===n)?.name||n,s=e?e+` (`+o+`)`:o;M.generating=!0,B();let c=await Hr(s,a);if(!c){M.generating=!1,B();return}M.questions=c,M.current=0,M.selected=null,M.score=0,M.done=!1,M.generating=!1,M.userAnswers=[],B(),b(`🧠 `+a+`-Q quiz ready`+(e?` · `+e:``)+`! Good luck!`,`success`)}function qt(e){M.selected===null&&(M.selected=e,M.questions[M.current]&&(e===M.questions[M.current].answer&&M.score++,M.userAnswers||=[],M.userAnswers[M.current]=e,B()))}function Jt(){M.current<M.questions.length-1?(M.current++,M.selected=null,B()):(M.done=!0,B(),M.score===M.questions.length&&H(),Y().then(e=>{if(!e)return;let t=M.subSel||``,n=v().find(e=>e.id===t)?.name||t;m.quizLog.unshift({id:Date.now(),subject:t,subjectName:n,chapter:M.unitSel||`All Chapters`,score:M.score,total:M.questions.length,pct:Math.round(M.score/M.questions.length*100),date:new Date().toISOString(),questions:M.questions.map((e,t)=>({q:e.q,options:e.options,answer:e.answer,userAnswer:(M.userAnswers||[])[t]??null,correct:(M.userAnswers||[])[t]===e.answer,difficulty:e.difficulty||null,explanation:e.explanation||``}))}),Wt()}))}function Yt(){let e=M.questions[M.current],t=`<style>
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
</style>`,n=e=>e===`hard`?`#FF6B35`:e===`medium`?`#FFE66D`:`#06D6A0`,r=(e,t)=>e===`hard`?`🔴 Hard`:e===`medium`?t?`🟡 Med`:`🟡 Medium`:`🟢 Easy`,i=e=>e>=70?`#06D6A0`:e>=50?`#FFE66D`:`#FF6B35`,a=e=>[`All`,`Correct`,`Wrong`].map(t=>`<button class="qz-tab ${(M[e]||`All`)===t?`on`:``}" onclick="quizState.${e}='${t}';render()">${t}</button>`).join(``),o=(e,t,i,a)=>{let o=a?`#06D6A0`:`#FF6B35`,s=(e.options||[]).length>0?(e.options||[]).map((t,n)=>{let r=n===e.answer,a=n===i;return`<div class="qz-ro ${r?`ok`:a?`bad`:``}">${r?`✓ `:a?`✗ `:``}<b>${String.fromCharCode(65+n)}.</b> ${y(t)}</div>`}).join(``):`<div style="font-size:11.5px;color:var(--mute);font-style:italic">Options not stored for this entry — only new quizzes log full options</div>`;return`<div class="qz-rv" style="border-color:color-mix(in srgb,${o} 35%,var(--line));background:color-mix(in srgb,${o} 6%,transparent)">
      <div class="qz-rv-h">
        <span class="qz-tag">Q${t+1}</span>
        ${e.difficulty?`<span style="font-size:10.5px;font-weight:800;color:${n(e.difficulty)}">${r(e.difficulty)}</span>`:``}
        <span style="margin-left:auto;font-size:14px">${a?`✅`:`❌`}</span>
      </div>
      <div class="qz-rv-q">${y(e.q)}</div>
      ${s}
      ${e.explanation?`<div class="qz-ex">💡 ${y(e.explanation)}</div>`:``}
    </div>`};if(M.reviewId){let e=m.quizLog.find(e=>e.id===M.reviewId)||null;if(e){let n=e.questions||[],r=n.filter(e=>e.correct).length,s=n.filter(e=>!e.correct&&e.userAnswer!==null).length,c=n.filter(e=>e.userAnswer===null).length,l=i(e.pct);return`${t}<div class="qz fade-in">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;flex-wrap:wrap">
          <button class="qz-btn" onclick="quizState.reviewId=null;render()">← Logs</button>
          <div>
            <div style="font-size:17px;font-weight:800;color:var(--txt)">${y(e.subjectName)} — ${y(e.chapter)}</div>
            <div style="font-size:11.5px;color:var(--mute)">${new Date(e.date).toLocaleDateString(`en-IN`,{weekday:`short`,day:`numeric`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`})}</div>
          </div>
        </div>
        <div class="qz-card" style="margin-bottom:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-size:34px;font-weight:800;letter-spacing:-1px;color:${l}">${e.pct}%</div>
            <div style="text-align:right">
              <div style="font-size:13.5px;color:var(--text-2,#ccc);font-weight:700">${e.score}/${e.total} correct</div>
              <div style="font-size:11.5px;color:var(--mute)">${e.total}-question quiz</div>
            </div>
          </div>
          <div class="qz-bar" style="margin-bottom:12px"><i style="width:${e.pct}%;background:${l}"></i></div>
          <div class="qz-pills" style="justify-content:flex-start;margin:0">
            <span class="qz-pill" style="color:#06D6A0;border-color:#06D6A055">✅ ${r} Correct</span>
            <span class="qz-pill" style="color:#FF6B35;border-color:#FF6B3555">❌ ${s} Wrong</span>
            ${c?`<span class="qz-pill" style="color:var(--mute);border-color:var(--line)">⬜ ${c} Skipped</span>`:``}
          </div>
        </div>
        <div class="qz-tabs" style="margin-bottom:14px">${a(`reviewFilter`)}</div>
        ${n.filter(e=>{let t=M.reviewFilter||`All`;return t===`Correct`?e.correct:t!==`Wrong`||!e.correct}).map(e=>o(e,n.indexOf(e),e.userAnswer,e.correct)).join(``)}
      </div>`}}let s=M.questions.length,c=v().map(e=>`<option value="${e.id}" ${M.subSel===e.id?`selected`:``}>${e.icon} ${e.name}</option>`).join(``),l=(v().find(e=>e.id===M.subSel)?.units||[]).map(e=>`<option value="${y(e.name)}" ${M.unitSel===y(e.name)?`selected`:``}>${y(e.name)}</option>`).join(``),u=[`10`,`15`,`20`,`50`].map(e=>`<option value="${e}" ${(M.countSel||`15`)===e?`selected`:``}>${e} Questions${e===`50`?` ⭐ Pro`:``}</option>`).join(``),d=``;if(s===0)d=`<div class="qz-empty">
        <div class="e">🧠</div><b>AI-Powered Quiz</b>
        <p>Select a subject and click "Start Quiz" to test yourself!</p>
        ${m._proStatusCache?``:`<div class='qz-free'>Free: `+Math.max(0,3-$.freeQuizCount)+` quiz attempts left this session · <span onclick='openProModal()'>Go Pro for unlimited ⭐</span></div>`}
      </div>`;else if(M.done){let e=M.score/s,t=Math.round(e*100),n=M.questions,r=n.filter(e=>e.difficulty===`hard`).length,i=n.filter(e=>e.difficulty===`medium`).length,c=n.filter(e=>e.difficulty===`easy`).length;d=`<div>
        <div class="qz-card qz-score">
          <div style="font-size:50px;margin-bottom:8px">${M.score===s?`🏆`:e>=.7?`🎯`:`📊`}</div>
          <div style="font-size:20px;font-weight:800;color:var(--acc);margin-bottom:8px">Quiz Complete!</div>
          <div class="big">${M.score}<small>/${s}</small></div>
          <div style="font-size:13px;color:var(--mute);margin:4px 0 14px">${t}% accuracy</div>
          <div class="qz-bar" style="margin-bottom:14px"><i style="width:${t}%;background:${e>=.7?`#06D6A0`:e>=.5?`#FFE66D`:`#FF6B35`}"></i></div>
          <div class="qz-pills">
            <span class="qz-pill" style="color:#06D6A0;border-color:#06D6A055">✅ ${M.score} Correct</span>
            <span class="qz-pill" style="color:#FF6B35;border-color:#FF6B3555">❌ ${s-M.score} Wrong</span>
            ${c?`<span class="qz-pill" style="color:#06D6A0;border-color:#06D6A033">🟢 ${c} Easy</span>`:``}
            ${i?`<span class="qz-pill" style="color:#FFE66D;border-color:#FFE66D44">🟡 ${i} Med</span>`:``}
            ${r?`<span class="qz-pill" style="color:#FF6B35;border-color:#FF6B3544">🔴 ${r} Hard</span>`:``}
          </div>
          <div style="font-size:13.5px;color:var(--text-4,#888);margin-bottom:20px">${M.score===s?`Perfect score! You're exam-ready 🌟`:M.score>=Math.ceil(s*.7)?`Good job! Review the ones you missed 💪`:M.score>=Math.ceil(s*.5)?`Keep going — revise the concepts and retry 📚`:`Focus on fundamentals and reattempt 🔁`}</div>
          <button class="qz-btn p" onclick="startQuiz(quizState.unitSel||null, quizState.countSel||15)" style="padding:12px 32px;font-size:14px">🔁 Try Again</button>
        </div>
        <div class="qz-sec"><h3>Question Review</h3><div class="qz-tabs">${a(`doneFilter`)}</div></div>
        ${n.filter((e,t)=>{let n=(M.userAnswers||[])[t]===e.answer,r=M.doneFilter||`All`;return r===`Correct`?n:r!==`Wrong`||!n}).map(e=>{let t=n.indexOf(e),r=(M.userAnswers||[])[t];return o(e,t,r,r===e.answer)}).join(``)}
      </div>`}else{let t=e.difficulty?n(e.difficulty):``,i=M.selected!==null,a=M.selected===e.answer;d=`<div class="qz-card">
        <div class="qz-prog"><span>Question <b>${M.current+1}</b> / ${s}</span><span style="color:#06D6A0">Score: ${M.score}</span></div>
        <div class="qz-bar"><i style="width:${Math.round((M.current+ +!!i)/s*100)}%"></i></div>
        ${e.difficulty?`<div style="margin-bottom:12px"><span class="qz-diff" style="color:${t};border-color:${t}55;background:${t}14">${r(e.difficulty)}</span></div>`:``}
        <div class="qz-q">${y(e.q)}</div>
        <div class="qz-opts">
          ${e.options.map((t,n)=>{let r=``;return i&&(n===e.answer?r=`ok`:n===M.selected&&(r=`bad`)),`<button class="qz-opt ${r}" onclick="selectAnswer(${n})" ${i?`disabled`:``}><span class="l">${String.fromCharCode(65+n)}</span><span>${y(t)}</span></button>`}).join(``)}
        </div>
        ${i?`
          <div class="qz-fb" style="--c:${a?`#06D6A0`:`#FF6B35`}">
            <b>${a?`✅ Correct!`:`❌ Incorrect — Correct: `+String.fromCharCode(65+e.answer)+`. `+y(e.options[e.answer])}</b>
            ${e.explanation?`<p>💡 <b>Explanation:</b> ${y(e.explanation)}</p>`:``}
          </div>
          <button class="qz-btn p" onclick="nextQuestion()" style="width:100%;padding:13px;font-size:14px">${M.current<s-1?`Next Question →`:`See Results 🏆`}</button>`:``}
      </div>`}let f=``;if(m._proStatusCache&&m.quizLog.length>0){let e=new Set(v().map(e=>e.id)),t=m.quizLog.filter(t=>e.has(t.subject)),n=``;if(t.length===0)n=h.activeCourse===`cbse11`&&!h.cbse11Stream?`<div style="font-size:12.5px;color:var(--acc);padding:8px 0">Select your Class 11 stream first to see quiz logs.</div>`:h.activeCourse===`cbse12`&&!h.cbse12Stream?`<div style="font-size:12.5px;color:var(--acc);padding:8px 0">Select your Class 12 stream first to see quiz logs.</div>`:`<div style="font-size:12.5px;color:var(--mute);font-style:italic;padding:8px 0">No quiz logs for this course yet.</div>`;else{let e={};t.forEach(t=>{let n=t.subjectName||t.subject||`Unknown`;e[n]||(e[n]=[]),e[n].push(t)}),n=Object.entries(e).map(([e,t])=>`
        <div class="qz-grp">${y(e)}</div>
        ${t.map(e=>{let t=i(e.pct),n=(e.questions||[]).length>0,r=M.openReviewId===e.id;return`<div class="qz-log">
            <div class="qz-log-r">
              <div class="qz-log-c" style="color:${t};border-color:${t}">${e.pct}%</div>
              <div style="flex:1;min-width:0">
                <b>${y(e.chapter)}</b>
                <span class="s"><span style="color:#06D6A0;font-weight:700">${e.score}</span>/${e.total} · ${new Date(e.date).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`})}</span>
                <div class="qz-mini"><i style="width:${e.pct}%;background:${t}"></i></div>
              </div>
              ${n?`<button class="qz-btn" style="padding:7px 12px;font-size:11.5px;color:var(--acc)" onclick="toggleQuizReview(${e.id})">${r?`▲ Close`:`Review →`}</button>`:``}
            </div>
            ${r?`
            <div style="margin-top:12px;border-top:1px solid var(--line);padding-top:12px">
              <div class="qz-tabs" style="margin-bottom:10px">${a(`reviewFilter`)}</div>
              ${(e.questions||[]).filter(e=>{let t=M.reviewFilter||`All`;return t===`Correct`?e.correct:t!==`Wrong`||!e.correct}).map(t=>o(t,(e.questions||[]).indexOf(t),t.userAnswer,t.correct)).join(``)}
            </div>`:``}
          </div>`}).join(``)}
      `).join(``)}f=`<div style="margin-top:26px">
      <div class="qz-sec">
        <h3>📋 Quiz Logs</h3>
        <button class="qz-btn" style="padding:6px 12px;font-size:11.5px" onclick="if(confirm('Clear all quiz logs?')){quizLog=[];saveQuizLog();render();}">🗑️ Clear</button>
      </div>
      ${n}
    </div>`}return`${t}<div class="qz fade-in">
    <div class="qz-h1">🧠 AI Quiz</div>
    <div class="qz-h2">Test yourself chapter by chapter with AI-generated questions.</div>
    <div class="qz-setup">
      <div><label>SUBJECT</label><select onchange="quizState.subSel=this.value;quizState.unitSel='';render()"><option value="">— Select Subject —</option>${c}</select></div>
      <div><label>CHAPTER</label><select onchange="quizState.unitSel=this.value"><option value="">All Chapters</option>${l}</select></div>
      <div><label>QUESTIONS</label><select onchange="quizState.countSel=this.value">${u}</select></div>
      <button class="qz-btn p" onclick="startQuiz(quizState.unitSel||null, quizState.countSel||15)" ${M.generating||!M.subSel?`disabled`:``}>${M.generating?`⏳ Generating…`:`✨ Start Quiz`}</button>
    </div>
    ${d}
    ${f}
  </div>`}typeof window<`u`&&Object.assign(window,{FLASH_LOG_MAX:100,QUIZ_LOG_MAX:100,nextQuestion:Jt,quizState:M,renderQuiz:Yt,saveFlashLog:Gt,saveQuizLog:Wt,selectAnswer:qt,startQuiz:Kt,toggleQuizReview:Ut});var N=JSON.parse(localStorage.getItem(`st_flash_decks`)||`{}`),P={activeSub:``,current:0,flipped:!1,generating:!1,mode:`select`,showHistory:!1};function Xt(){localStorage.setItem(`st_flash_decks`,JSON.stringify(N)),g||(clearTimeout(_._timer),_._timer=setTimeout(c,1200))}function Zt(){return N[P.activeSub]||[]}function Qt(e){e&&(P.activeSub=e,P.current=0,P.flipped=!1,P.mode=`deck`,B())}function $t(){P.mode=`select`,P.activeSub=``,B()}function en(){let e=document.getElementById(`chapter-picker-overlay`);e&&e.remove();let t=v().find(e=>e.id===P.activeSub);if(!t)return;let n=document.createElement(`div`);n.id=`chapter-picker-overlay`,n.style.cssText=`position:fixed;inset:0;background:#00000088;z-index:9999;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px)`,n.innerHTML=`
    <div style="background:#0f0f18;border-radius:20px 20px 0 0;width:100%;max-width:560px;padding:24px;border:1px solid #2a2a3a;border-bottom:none;animation:slideUp 0.25s ease">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        <div>
          <div style="font-size:15px;font-weight:bold;color:#EDE8E0">📖 Choose Chapter</div>
          <div style="font-size:11px;color:#555;margin-top:2px">${y(t.name)} · AI generates 12 cards per chapter</div>
        </div>
        <button onclick="document.getElementById('chapter-picker-overlay').remove()" style="background:none;border:1px solid #2a2a3a;color:#555;padding:6px 12px;border-radius:8px;font-family:inherit;cursor:pointer;font-size:12px">✕ Close</button>
      </div>
      <button onclick="document.getElementById('chapter-picker-overlay').remove();generateFlashcards()" style="display:flex;align-items:center;gap:12px;width:100%;background:#1a1200;border:1px solid #FFE66D33;border-radius:12px;padding:14px 16px;cursor:pointer;font-family:inherit;margin-bottom:10px;transition:all 0.2s" onmouseover="this.style.borderColor='#FFE66D88'" onmouseout="this.style.borderColor='#FFE66D33'">
        <span style="font-size:22px">📚</span>
        <div style="text-align:left">
          <div style="font-size:13px;font-weight:bold;color:#FFE66D">All Chapters (Mixed)</div>
          <div style="font-size:10px;color:#555;margin-top:2px">Random mix from all units</div>
        </div>
        <span style="margin-left:auto;color:#FFE66D;font-size:14px">→</span>
      </button>
      ${(t.units||[]).map((e,n)=>`
      <button onclick="document.getElementById('chapter-picker-overlay').remove();generateFlashcards('`+y(e.name)+`')" style="display:flex;align-items:center;gap:12px;width:100%;background:#0f0f18;border:1px solid #${[`FF6B35`,`4ECDC4`,`FFE66D`,`06D6A0`][n%4]}22;border-radius:12px;padding:14px 16px;cursor:pointer;font-family:inherit;margin-bottom:8px;transition:all 0.2s" onmouseover="this.style.borderColor='#${[`FF6B35`,`4ECDC4`,`FFE66D`,`06D6A0`][n%4]}66'" onmouseout="this.style.borderColor='#${[`FF6B35`,`4ECDC4`,`FFE66D`,`06D6A0`][n%4]}22'">
        <span style="font-size:20px">${t.icon}</span>
        <div style="text-align:left;flex:1;min-width:0">
          <div style="font-size:12px;font-weight:bold;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Chapter ${n+1}: `+y(e.name)+`</div>
          <div style="font-size:10px;color:#555;margin-top:2px">`+(e.topics||[]).slice(0,2).map(e=>y(e)).join(` · `)+`</div>
        </div>
        <span style="color:#555;font-size:12px;flex-shrink:0">→</span>
      </button>`).join(``)}
    </div>`,n.addEventListener(`click`,e=>{e.target===n&&n.remove()}),document.body.appendChild(n)}async function tn(e){let t=P.activeSub||document.getElementById(`flash-sub-select`)?.value||``;if(!t){b(`Please select a subject first`,`alarm`);return}if(!await Y()&&Object.values(N).reduce((e,t)=>e+(t||[]).length,0)>=50){b(`⭐ Free limit reached (50 cards). Upgrade to Pro for unlimited flashcards!`,`alarm`),G();return}let n=v().find(e=>e.id===t)?.name||t,r=e?e+` (`+n+`)`:n;P.generating=!0,P.activeSub=t,P.mode=`deck`,B(),b(`Generating flashcards for `+r+`…`,`info`);let i=[`key definitions`,`important formulas`,`core concepts`,`exam traps`,`theory vs application`,`worked examples`],a=i[Math.floor(Math.random()*i.length)],o=await Lr(`Create `+(await Y()?20:12)+` unique flashcards for `+r+` covering `+a+` for university exam revision. Format as JSON array: [{"front":"term or question","back":"definition or answer"}]. Return ONLY the raw JSON array, no markdown, no backticks.`,!0);try{let i=o.match(/\[[\s\S]*\]/),a=i?JSON.parse(i[0]):null;if(!a)throw Error(`fail`);N[t]=a,P.current=0,P.flipped=!1,Xt(),await Y()&&(m.flashLog.unshift({id:Date.now(),subject:t,subjectName:n,chapter:e||`All Chapters`,cards:a.length,date:new Date().toISOString()}),Gt()),b(a.length+` fresh cards generated for `+r+`!`,`success`),H()}catch{b(`Could not generate flashcards`,`alarm`)}P.generating=!1,B()}function nn(){P.activeSub&&confirm(`Clear all cards for this subject?`)&&(delete N[P.activeSub],Xt(),P.current=0,P.flipped=!1,B())}function rn(){P.flipped=!P.flipped,B()}function an(){let e=Zt();P.current=(P.current+1)%e.length,P.flipped=!1,B()}function on(){let e=Zt();P.current=(P.current-1+e.length)%e.length,P.flipped=!1,B()}function sn(){let e=Zt();e.splice(P.current,1),N[P.activeSub]=e,Xt(),P.current=Math.min(P.current,e.length-1),P.flipped=!1,B()}function cn(){let e=v(),t=`<style>
.fc{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:900px;margin:0 auto}
.fc *{box-sizing:border-box}
.fc-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:18px}
.fc-h1{font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--txt);line-height:1.1}
.fc-h2{font-size:13px;color:var(--mute);margin-top:6px}
.fc-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--line);background:var(--surf);color:var(--text-2,#ccc);padding:10px 16px;border-radius:12px;font-weight:700;font-size:12.5px;font-family:inherit;cursor:pointer;transition:.2s}
.fc-btn:hover{border-color:var(--acc);transform:translateY(-1px)}
.fc-btn.p{background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-color:transparent;box-shadow:0 6px 18px -6px #FFB70088}
.fc-btn.d:hover{color:#ff5c5c;border-color:#ff5c5c66;background:#ff5c5c14}
.fc-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.fc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.fc-sub{--c:#7C6CF0;background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:18px;padding:16px;cursor:pointer;transition:transform .2s,border-color .2s,box-shadow .2s;animation:fcIn .35s ease both}
.fc-sub:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--c) 60%,var(--line));box-shadow:0 14px 30px -14px color-mix(in srgb,var(--c) 60%,transparent)}
@keyframes fcIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.fc-sub-top{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.fc-ic{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;font-size:22px;background:color-mix(in srgb,var(--c) 16%,transparent);flex-shrink:0}
.fc-sub b{display:block;font-size:14px;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fc-sub span{font-size:11.5px;color:var(--mute)}
.fc-cnt{margin-left:auto;font-size:22px;font-weight:800;color:var(--c);letter-spacing:-1px}
.fc-bar{height:5px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);overflow:hidden}
.fc-bar i{display:block;height:100%;border-radius:99px;background:var(--c);transition:width .5s}
.fc-bar.big{height:6px;margin-bottom:18px}
.fc-bar.big i{background:linear-gradient(90deg,color-mix(in srgb,var(--c) 55%,transparent),var(--c))}
.fc-bar-t{display:flex;justify-content:space-between;font-size:11.5px;color:var(--mute);margin-bottom:8px;font-weight:600}
.fc-bar-t b{color:var(--txt)}
.fc-back{display:flex;align-items:center;gap:12px;margin-bottom:18px;flex-wrap:wrap}
.fc-back .n{flex:1;min-width:120px}
.fc-back .n b{display:block;font-size:17px;color:var(--txt);font-weight:800}
.fc-back .n span{font-size:11.5px;color:var(--mute)}
.fc-card{--c:#FFE66D;position:relative;min-height:280px;display:flex;align-items:center;justify-content:center;text-align:center;padding:36px 28px;border-radius:24px;cursor:pointer;margin-bottom:18px;
  border:1.5px solid color-mix(in srgb,var(--c) 45%,var(--line));
  background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--c) 14%,transparent),transparent 70%),var(--glass-bg,var(--surf));
  box-shadow:0 20px 40px -24px color-mix(in srgb,var(--c) 50%,transparent);animation:fcFlip .35s ease both;transition:border-color .3s}
.fc-card.a{--c:#06D6A0}
@keyframes fcFlip{from{opacity:.4;transform:rotateX(-14deg) scale(.97)}to{opacity:1;transform:none}}
.fc-tag{position:absolute;top:16px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:800;letter-spacing:2px;color:var(--c);background:color-mix(in srgb,var(--c) 14%,transparent);padding:4px 12px;border-radius:99px;white-space:nowrap}
.fc-txt{font-size:20px;line-height:1.65;color:var(--txt);font-weight:600;margin-top:14px}
.fc-nav{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.fc-nav .fc-btn{padding:12px 22px;font-size:13.5px}
.fc-hint{text-align:center;margin-top:14px;font-size:11px;color:var(--mute)}
.fc-empty{text-align:center;padding:52px 16px;border:1.5px dashed var(--line);border-radius:20px}
.fc-empty .e{font-size:50px;margin-bottom:10px}
.fc-empty b{display:block;font-size:16px;color:var(--txt);margin-bottom:6px}
.fc-empty p{font-size:12.5px;color:var(--mute);margin:0 0 18px}
.fc-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px}
.fc-stat{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:16px;padding:14px;text-align:center}
.fc-stat b{display:block;font-size:24px;font-weight:800;letter-spacing:-.5px}
.fc-stat span{font-size:10.5px;color:var(--mute);letter-spacing:.5px}
.fc-grp{font-size:11px;font-weight:800;color:var(--acc);letter-spacing:1.4px;text-transform:uppercase;margin:0 0 10px 2px}
.fc-log{display:flex;align-items:center;gap:13px;padding:13px 15px;background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:16px;margin-bottom:8px}
.fc-log-ic{width:46px;height:46px;border-radius:13px;background:color-mix(in srgb,var(--acc) 14%,transparent);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;font-size:14px}
.fc-log-ic small{font-size:9.5px;color:var(--acc);font-weight:800}
.fc-log b{display:block;font-size:13.5px;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fc-log span{font-size:11.5px;color:var(--mute)}
@media(max-width:520px){.fc-txt{font-size:17px}.fc-card{min-height:240px;padding:34px 18px}}
</style>`;if(P.showHistory){let e={};return m.flashLog.forEach(t=>{let n=t.subjectName||t.subject||`Unknown`;e[n]||(e[n]={subject:n,entries:[]}),e[n].entries.push(t)}),`${t}<div class="fc fade-in">
      <div class="fc-head">
        <div style="display:flex;align-items:center;gap:12px">
          <button class="fc-btn" onclick="flashState.showHistory=false;render()">← Back</button>
          <div class="fc-h1" style="font-size:22px">📋 Flashcard Logs</div>
        </div>
        ${m.flashLog.length>0?`<button class="fc-btn d" onclick="if(confirm('Clear flashcard logs?')){flashLog=[];saveFlashLog();render();}">🗑️ Clear</button>`:``}
      </div>
      ${m.flashLog.length===0?`<div class="fc-empty"><div class="e">🃏</div><b>No flashcard logs yet</b><p>Generate flashcards and your sessions will appear here</p></div>`:`
      <div class="fc-stats">
        <div class="fc-stat"><b style="color:#FFE66D">${m.flashLog.length}</b><span>SESSIONS</span></div>
        <div class="fc-stat"><b style="color:#06D6A0">${m.flashLog.reduce((e,t)=>e+(t.cards||0),0)}</b><span>TOTAL CARDS</span></div>
        <div class="fc-stat"><b style="color:#A78BFA">${Object.keys(e).length}</b><span>SUBJECTS</span></div>
      </div>
      ${Object.values(e).map(e=>`
        <div style="margin-bottom:20px">
          <div class="fc-grp">${y(e.subject)}</div>
          ${e.entries.map(e=>`
            <div class="fc-log">
              <div class="fc-log-ic">🃏<small>${e.cards}</small></div>
              <div style="flex:1;min-width:0">
                <b>${y(e.chapter)}</b>
                <span>${e.cards} cards · ${new Date(e.date).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`})} · ${new Date(e.date).toLocaleTimeString(`en-IN`,{hour:`2-digit`,minute:`2-digit`})}</span>
              </div>
              <button class="fc-btn p" style="padding:8px 14px;font-size:12px" onclick="flashSelectSubject('${e.subject}');flashState.showHistory=false;">Study →</button>
            </div>`).join(``)}
        </div>`).join(``)}
      `}
    </div>`}if(P.mode===`select`||!P.activeSub)return`${t}<div class="fc fade-in">
      <div class="fc-head">
        <div>
          <div class="fc-h1">🃏 Flashcards</div>
          <div class="fc-h2">Pick a subject to review or generate AI cards.</div>
        </div>
        ${m._proStatusCache?`<button class="fc-btn" onclick="flashState.showHistory=true;render()">📋 Logs (${m.flashLog.length})</button>`:``}
      </div>
      <div class="fc-grid">
        ${e.map((e,t)=>{let n=(N[e.id]||[]).length;return`<div class="fc-sub" style="--c:${e.color};animation-delay:${Math.min(t,12)*.04}s" onclick="flashSelectSubject('${e.id}')">
            <div class="fc-sub-top">
              <div class="fc-ic">${e.icon}</div>
              <div style="min-width:0;flex:1"><b>${y(e.name)}</b><span>${n>0?n+` cards`:`No cards yet`}</span></div>
              ${n>0?`<div class="fc-cnt">${n}</div>`:``}
            </div>
            <div class="fc-bar"><i style="width:${n>0?Math.min(100,n*8):0}%"></i></div>
          </div>`}).join(``)}
      </div>
    </div>`;let n=e.find(e=>e.id===P.activeSub),r=Zt(),i=r[P.current],a=r.length?Math.round((P.current+1)/r.length*100):0,o=n?.color||`#FFE66D`;return`${t}<div class="fc fade-in" style="--c:${o}">
    <div class="fc-back">
      <button class="fc-btn" onclick="flashBack()">← All</button>
      <div class="fc-ic" style="--c:${o}">${n?.icon||`🃏`}</div>
      <div class="n"><b>${y(n?.name||``)}</b><span>${r.length} cards total</span></div>
      <button class="fc-btn p" onclick="openChapterPicker()" ${P.generating?`disabled`:``}>${P.generating?`⏳ Generating…`:`✨ Choose Chapter`}</button>
      ${r.length>0?`<button class="fc-btn d" onclick="clearSubjectDeck()">🗑️ Clear</button>`:``}
    </div>

    ${r.length===0?`
      <div class="fc-empty">
        <div class="e">🃏</div>
        <b>No cards for ${y(n?.name||``)} yet</b>
        <p>Generate 12 AI flashcards instantly — all chapters or chapter-wise</p>
        <button class="fc-btn p" onclick="openChapterPicker()" ${P.generating?`disabled`:``} style="padding:12px 24px;font-size:13.5px">${P.generating?`⏳ Generating…`:`✨ Choose Chapter to Generate`}</button>
      </div>`:`
      <div class="fc-bar-t"><span>Card <b>${P.current+1}</b> / ${r.length}</span><span>${a}% through deck</span></div>
      <div class="fc-bar big" style="--c:${o}"><i style="width:${a}%"></i></div>
      <div class="fc-card ${P.flipped?`a`:``}" style="${P.flipped?`--c:`+o:``}" onclick="flipCard()">
        <div class="fc-tag">${P.flipped?`✅ ANSWER`:`❓ QUESTION · TAP TO FLIP`}</div>
        <div class="fc-txt">${y(i?P.flipped?i.back:i.front:``)}</div>
      </div>
      <div class="fc-nav">
        <button class="fc-btn" onclick="prevCard()">← Prev</button>
        <button class="fc-btn d" onclick="deleteFlashcard()" title="Delete card">🗑️</button>
        <button class="fc-btn p" onclick="nextCard()">Next →</button>
      </div>
      <div class="fc-hint">Tap the card to flip · delete removes this card</div>
    `}
  </div>`}typeof window<`u`&&Object.assign(window,{clearSubjectDeck:nn,deleteFlashcard:sn,flashBack:$t,flashDecks:N,flashSelectSubject:Qt,flashState:P,flipCard:rn,generateFlashcards:tn,getActiveDeck:Zt,nextCard:an,openChapterPicker:en,prevCard:on,renderFlashcards:cn,saveFlashDecks:Xt});async function ln(){let e=E(),t=D(),n=v(),i={};n.forEach(e=>{i[e.id]=0}),Object.values(r.studyLog).forEach(e=>{e.subject&&i[e.subject]!==void 0&&(i[e.subject]+=e.hours||0)});let a=Math.max(...Object.values(i),1),o=(()=>{let e=[];for(let t=29;t>=0;t--){let n=new Date;n.setDate(n.getDate()-t);let i=n.toISOString().split(`T`)[0],a=r.studyLog[i]?.hours||0,o=Math.min(1,a/4),s=i===S();e.push(`<div class="an-cell ${a>0?`on`:``} ${s?`now`:``}" title="${i}: ${a}h studied" style="${a>0?`background:rgba(255,230,109,${.25+o*.75})`:``}">${a>0?a+`h`:n.getDate()}</div>`)}return e.join(``)})(),s=await Y(),c=`<span class="an-pro">PRO</span>`,l=``;if(s){let e=Object.entries(r.studyLog).sort((e,t)=>e[0].localeCompare(t[0])),a=[{label:`This week`,h:0},{label:`Last week`,h:0},{label:`2 weeks ago`,h:0},{label:`3 weeks ago`,h:0}],o=new Date;e.forEach(([e,t])=>{let n=new Date(e),r=Math.floor((o-n)/864e5),i=Math.floor(r/7);i>=0&&i<4&&(a[i].h+=t.hours||0)});let s=Math.max(...a.map(e=>e.h),1),u=`
    <div class="an-card">
      <div class="an-ch"><div class="an-lbl">📅 WEEKLY REPORT</div>${c}</div>
      <div class="an-bars">
        ${a.slice().reverse().map(e=>{let t=Math.round(e.h/s*100);return`<div class="an-bcol">
            <div class="an-bv">${Math.round(e.h*10)/10}h</div>
            <div class="an-btrack"><i style="height:${Math.max(t,4)}%"></i></div>
            <div class="an-bl">${e.label}</div>
          </div>`}).join(``)}
      </div>
    </div>`,d=[{days:3,icon:`🌱`,label:`Getting Started`,color:`#06D6A0`},{days:7,icon:`🔥`,label:`One Week Warrior`,color:`#FF6B35`},{days:14,icon:`⚡`,label:`Fortnight Focus`,color:`#FFE66D`},{days:30,icon:`🏆`,label:`Monthly Master`,color:`#C77DFF`},{days:60,icon:`👑`,label:`Study King`,color:`#4ECDC4`}],f=d.filter(e=>t>=e.days),p=d.find(e=>t<e.days),m=`
    <div class="an-card">
      <div class="an-ch"><div class="an-lbl">🏅 STREAK AWARDS</div>${c}</div>
      ${f.length===0?`<div class="an-muted" style="text-align:center;padding:12px 0">Keep studying! First award at a 3-day streak 🌱</div>`:`<div class="an-awards">${f.map(e=>`<div class="an-award" style="--c:${e.color}">
            <span style="font-size:22px">${e.icon}</span>
            <div><b>${e.label}</b><span>${e.days}+ day streak</span></div>
          </div>`).join(``)}</div>`}
      ${p?`<div class="an-muted" style="margin-top:12px">Next: ${p.icon} ${p.label} at ${p.days} days — <b style="color:var(--txt)">${p.days-t}</b> to go</div>`:``}
    </div>`,h=n.map(e=>({s:e,pct:T(e.id)}));h.sort((e,t)=>e.pct-t.pct);let g=h[0],ee=h[h.length-1],te=n.map(e=>{let t=i[e.id]||0,n=T(e.id);return{s:e,h:t,pct:n,eff:t>0?Math.round(n/Math.max(t,.1)*10)/10:0}}).filter(e=>e.h>0).sort((e,t)=>t.eff-e.eff);l=`<div class="an-two">${u}${m}</div>${ee&&g?`
    <div class="an-card">
      <div class="an-ch"><div class="an-lbl">🔍 SUBJECT INSIGHTS</div>${c}</div>
      <div class="an-ins">
        <div class="an-in" style="--c:#06D6A0"><span class="ic">${ee.s.icon}</span><em>Strongest</em><small>${y(ee.s.name)}</small><b>${ee.pct}%</b></div>
        <div class="an-in" style="--c:#FF6B35"><span class="ic">${g.s.icon}</span><em>Needs Focus</em><small>${y(g.s.name)}</small><b>${g.pct}%</b></div>
      </div>
      ${te.length>0?`
      <div class="an-lbl" style="margin:16px 0 10px">EFFICIENCY · % GAINED PER HOUR</div>
      ${te.map(e=>`<div class="an-eff"><span>${e.s.icon} ${y(e.s.name)}</span><b style="color:${e.eff>=5?`#06D6A0`:e.eff>=2?`#FFE66D`:`#FF6B35`}">${e.eff}%/hr</b></div>`).join(``)}`:``}
    </div>`:``}`}let u=s?``:`
  <div class="an-lock" onclick="openProModal()">
    <div style="font-size:34px">📊</div>
    <div style="flex:1;min-width:0">
      <b>Advanced Analytics</b>
      <span>Weekly reports · Streak awards · Subject insights · Efficiency scores</span>
    </div>
    <div class="an-up">Upgrade ⭐</div>
  </div>`,d=Math.round(e/Math.max(Object.keys(r.studyLog).length,1)*10)/10;return`<style>
.an{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:1000px;margin:0 auto}
.an *{box-sizing:border-box}
.an-h1{font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--txt);line-height:1.1}
.an-h2{font-size:13px;color:var(--mute);margin:6px 0 18px}
.an-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
@media(max-width:560px){.an-stats{gap:8px}}
.an-stat{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:18px;padding:16px;position:relative;overflow:hidden}
.an-stat:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 100% 0%,color-mix(in srgb,var(--c) 18%,transparent),transparent 60%)}
.an-stat>*{position:relative}
.an-stat .ic{font-size:22px}
.an-stat b{display:block;font-size:26px;font-weight:800;letter-spacing:-1px;color:var(--c);margin:6px 0 2px;line-height:1}
.an-stat span{font-size:10.5px;color:var(--mute);letter-spacing:.6px;font-weight:600}
.an-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:20px;padding:20px;margin-bottom:14px}
.an-ch{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.an-lbl{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--mute)}
.an-pro{font-size:9px;font-weight:800;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-radius:99px;padding:3px 10px}
.an-muted{font-size:12px;color:var(--mute)}
.an-two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:760px){.an-two{grid-template-columns:1fr;gap:0}}
.an-two .an-card{margin-bottom:14px}
.an-bars{display:flex;align-items:flex-end;gap:12px;height:130px}
.an-bcol{flex:1;height:100%;display:flex;flex-direction:column;align-items:center;gap:6px}
.an-bv{font-size:11px;font-weight:800;color:var(--acc)}
.an-btrack{flex:1;width:100%;border-radius:10px;background:color-mix(in srgb,var(--txt) 7%,transparent);display:flex;align-items:flex-end;overflow:hidden}
.an-btrack i{display:block;width:100%;border-radius:10px;background:linear-gradient(0deg,#FF6B35,#FFE66D);transition:height .6s}
.an-bl{font-size:9.5px;color:var(--mute);text-align:center;font-weight:600}
.an-awards{display:flex;flex-wrap:wrap;gap:8px}
.an-award{display:flex;align-items:center;gap:10px;padding:9px 13px;border-radius:14px;border:1px solid color-mix(in srgb,var(--c) 35%,var(--line));background:color-mix(in srgb,var(--c) 10%,transparent)}
.an-award b{display:block;font-size:12px;color:var(--c)}
.an-award span{font-size:10px;color:var(--mute)}
.an-ins{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.an-in{--c:#06D6A0;text-align:center;padding:14px;border-radius:16px;border:1px solid color-mix(in srgb,var(--c) 30%,var(--line));background:color-mix(in srgb,var(--c) 8%,transparent)}
.an-in .ic{font-size:24px;display:block}
.an-in em{display:block;font-style:normal;font-size:11.5px;font-weight:800;color:var(--c);margin-top:5px}
.an-in small{display:block;font-size:11px;color:var(--mute);margin:2px 0 4px}
.an-in b{font-size:22px;font-weight:800;color:var(--c);letter-spacing:-.5px}
.an-eff{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;padding:7px 0;border-bottom:1px solid var(--line);color:var(--text-3,#aaa)}
.an-eff:last-child{border:none}
.an-eff b{font-family:'JetBrains Mono',monospace}
.an-lock{display:flex;align-items:center;gap:14px;padding:18px 20px;margin-bottom:14px;border-radius:20px;cursor:pointer;border:1px solid color-mix(in srgb,var(--acc) 35%,var(--line));background:radial-gradient(circle at 0% 0%,color-mix(in srgb,var(--acc) 14%,transparent),transparent 60%),var(--glass-bg,var(--surf));transition:.2s}
.an-lock:hover{transform:translateY(-2px)}
.an-lock b{display:block;font-size:14px;color:var(--acc);margin-bottom:3px}
.an-lock span{font-size:11.5px;color:var(--mute);line-height:1.6}
.an-up{background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-radius:11px;padding:8px 15px;font-size:12px;font-weight:800;flex-shrink:0;box-shadow:0 6px 16px -6px #FFB70088}
.an-row{margin-bottom:14px}
.an-row:last-child{margin:0}
.an-row-h{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;margin-bottom:7px;color:var(--text-2,#ccc);font-weight:600}
.an-row-h b{color:var(--c);font-weight:800}
.an-bar{height:7px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);overflow:hidden}
.an-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,color-mix(in srgb,var(--c) 55%,transparent),var(--c));transition:width .8s}
.an-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:760px){.an-grid2{grid-template-columns:1fr;gap:0}}
.an-heat{display:grid;grid-template-columns:repeat(10,1fr);gap:5px}
@media(max-width:480px){.an-heat{grid-template-columns:repeat(6,1fr)}}
.an-cell{aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:700;color:var(--text-7,#666);background:color-mix(in srgb,var(--txt) 6%,transparent);border:1px solid transparent}
.an-cell.on{color:#1a1200}
.an-cell.now{border-color:var(--acc)}
</style><div class="an fade-in">
    <div class="an-h1">📈 Study Analytics</div>
    <div class="an-h2">Hours, streaks and progress across your subjects.</div>

    <div class="an-stats">
      ${[[`⏱️`,e+`h`,`TOTAL HOURS`,`#FFE66D`],[`🔥`,t+` days`,`CURRENT STREAK`,`#FF6B35`],[`📊`,d+`h`,`DAILY AVG`,`#06D6A0`]].map(([e,t,n,r])=>`
      <div class="an-stat" style="--c:${r}"><span class="ic">${e}</span><b>${t}</b><span>${n}</span></div>`).join(``)}
    </div>

    ${l}
    ${u}

    <div class="an-grid2">
      <div class="an-card">
        <div class="an-lbl" style="margin-bottom:14px">HOURS PER SUBJECT</div>
        ${n.map(e=>{let t=i[e.id]||0,n=Math.round(t/a*100);return`<div class="an-row" style="--c:${e.color}">
            <div class="an-row-h"><span>${e.icon} ${y(e.name)}</span><b>${Math.round(t*10)/10}h</b></div>
            <div class="an-bar"><i style="width:${n}%"></i></div>
          </div>`}).join(``)}
      </div>
      <div class="an-card">
        <div class="an-lbl" style="margin-bottom:14px">OVERALL PROGRESS</div>
        ${n.map(e=>{let t=T(e.id);return`<div class="an-row" style="--c:${e.color}">
            <div class="an-row-h"><span>${e.icon} ${y(e.name)}</span><b>${t}%</b></div>
            <div class="an-bar"><i style="width:${t}%"></i></div>
          </div>`}).join(``)}
      </div>
    </div>

    <div class="an-card">
      <div class="an-ch"><div class="an-lbl" style="margin:0">LAST 30 DAYS</div><div class="an-muted">Each cell = 1 day · colour = hours studied</div></div>
      <div class="an-heat">${o}</div>
    </div>
  </div>`}typeof window<`u`&&Object.assign(window,{renderAnalytics:ln});var F={};m.aiTyping=!1;function un(){return h.activeCourse===`neet`?[{icon:`🧬`,label:`Cell Biology`,prompt:`Explain the cell cycle, mitosis vs meiosis with key NCERT points`},{icon:`🫀`,label:`Human Physiology`,prompt:`Explain the cardiac cycle and blood pressure regulation for NEET`},{icon:`⚛️`,label:`Physical Chemistry`,prompt:`Explain chemical equilibrium, Le Chatelier's principle with examples`},{icon:`🌿`,label:`Plant Kingdom`,prompt:`Compare Bryophyta, Pteridophyta, Gymnosperms and Angiosperms`},{icon:`🔬`,label:`Genetics`,prompt:`Explain Mendel's laws, codominance and sex-linked inheritance`},{icon:`💊`,label:`Biomolecules`,prompt:`List key enzymes, cofactors and metabolic pathways for NEET`},{icon:`🌡️`,label:`Thermodynamics`,prompt:`Explain Hess's law, enthalpy and entropy with numerical examples`},{icon:`⚡`,label:`Revision Plan`,prompt:`Create a 3-hour NEET revision plan covering Biology, Physics and Chemistry`}]:h.activeCourse===`jee`?[{icon:`⚛️`,label:`Mechanics`,prompt:`Explain Newton's laws, circular motion and work-energy theorem for JEE`},{icon:`🔌`,label:`Electrostatics`,prompt:`Explain Coulomb's law, Gauss's theorem and capacitors for JEE`},{icon:`📐`,label:`Calculus`,prompt:`Explain differentiation and integration techniques for JEE Mains`},{icon:`🧪`,label:`Organic Chemistry`,prompt:`Explain reaction mechanisms: SN1, SN2, addition and elimination`},{icon:`📊`,label:`Probability`,prompt:`Explain probability, Bayes theorem and binomial distribution for JEE`},{icon:`🌊`,label:`Waves & Optics`,prompt:`Explain interference, diffraction and polarization of light for JEE`},{icon:`⚗️`,label:`Equilibrium`,prompt:`Explain chemical equilibrium, Kp, Kc and Le Chatelier's principle`},{icon:`⚡`,label:`Revision Plan`,prompt:`Create a 3-hour JEE revision plan focusing on weak topics`}]:h.activeCourse===`cbse10`?[{icon:`📐`,label:`Quadratics`,prompt:`Explain quadratic equations — factorisation, formula method, discriminant with examples for CBSE Class 10`},{icon:`🔬`,label:`Chemical Reactions`,prompt:`List and explain the 5 types of chemical reactions for CBSE Class 10 Science`},{icon:`💡`,label:`Electricity`,prompt:`Explain Ohm's Law, series and parallel circuits with formulas for CBSE Class 10`},{icon:`🌍`,label:`Nationalism`,prompt:`Summarise the rise of nationalism in Europe for CBSE Class 10 History`},{icon:`🧬`,label:`Heredity`,prompt:`Explain Mendel's laws of inheritance and sex determination for CBSE Class 10 Biology`},{icon:`📖`,label:`English Writing`,prompt:`Explain formal letter writing format for CBSE Class 10 with a sample complaint letter`},{icon:`📊`,label:`Statistics`,prompt:`Explain mean, median and mode from grouped data with examples for CBSE Class 10`},{icon:`⚡`,label:`Revision Plan`,prompt:`Create a 3-hour CBSE Class 10 revision plan for board exam preparation`}]:h.activeCourse===`cbse12`?[{icon:`📐`,label:`Integration`,prompt:`Explain integration by parts and substitution method with solved examples for CBSE Class 12`},{icon:`⚛️`,label:`Semiconductors`,prompt:`Explain p-n junction diode, transistor as amplifier and logic gates for CBSE Class 12 Physics`},{icon:`🧪`,label:`Organic Chemistry`,prompt:`Explain reaction mechanisms of alcohols, phenols and aldehydes for CBSE Class 12 Chemistry`},{icon:`🧬`,label:`Molecular Biology`,prompt:`Explain DNA replication, transcription and translation for CBSE Class 12 Biology`},{icon:`📊`,label:`Macroeconomics`,prompt:`Explain national income accounting — methods and concepts for CBSE Class 12 Economics`},{icon:`📖`,label:`English Literature`,prompt:`Summarise the themes and character analysis of 'Deep Water' and 'The Rattrap' for CBSE Class 12`},{icon:`🔢`,label:`Probability`,prompt:`Explain Bayes' theorem and binomial distribution with examples for CBSE Class 12 Maths`},{icon:`⚡`,label:`Revision Plan`,prompt:`Create a 3-hour CBSE Class 12 board exam revision plan covering key chapters`}]:h.activeCourse===`nfsu1`?[{icon:`⚖️`,label:`Legal Methods`,prompt:`Explain sources of law, precedent and statutory interpretation for Legal Methods`},{icon:`🤕`,label:`Law of Tort`,prompt:`Explain negligence, strict liability and general defenses in Law of Tort`},{icon:`🛒`,label:`Consumer Protection`,prompt:`Explain key provisions of the Consumer Protection Act with recent case examples`},{icon:`📖`,label:`Law & Literature`,prompt:`Explain the interdisciplinary approach of Law and Literature with examples`},{icon:`💻`,label:`Computer Organization`,prompt:`Explain computer organization basics: CPU, memory hierarchy, embedded systems`},{icon:`🧮`,label:`C Programming`,prompt:`Explain pointers, arrays and structures in C with code examples`},{icon:`📊`,label:`Discrete Maths`,prompt:`Explain set theory, relations and graph theory basics for Discrete Mathematics`},{icon:`📰`,label:`Legal News`,prompt:`Summarise the most important recent Indian legal news relevant to a first-year law student`}]:h.activeCourse===`nfsu3`?[{icon:`⚖️`,label:`IPC → BNS`,prompt:`Explain the key sections of Law of Crimes I (IPC) and their corresponding Bharatiya Nyaya Sanhita (BNS) sections`},{icon:`🏛️`,label:`Article 14`,prompt:`Explain Article 14 — Right to Equality, Rule of Law and Doctrine of Reasonable Classification with case law`},{icon:`📜`,label:`Offer & Acceptance`,prompt:`Explain offer, acceptance and revocation in Law of Contract I with landmark case laws`},{icon:`👨‍👩‍👧`,label:`Family Law I`,prompt:`Explain the essentials of a valid Hindu marriage and grounds for divorce under Family Law I`},{icon:`🌐`,label:`Web Programming`,prompt:`Explain how to connect PHP with MySQL and perform CRUD operations`},{icon:`🖥️`,label:`OS Concepts`,prompt:`Explain process scheduling algorithms and memory management in Operating Systems`},{icon:`📘`,label:`Latest Bare Act`,prompt:`What are the latest bare act changes I should know for Law of Crimes I, Constitutional Law and Contract Law this semester?`},{icon:`📰`,label:`Legal News`,prompt:`Summarise this week's most important Indian legal news relevant to a Sem III B.Sc. LL.B. student`}]:h.activeCourse===`nfsu`?[{icon:`⌨️`,label:`Virtual Functions`,prompt:`Explain virtual functions and polymorphism in C++ with examples`},{icon:`🗄️`,label:`Normalization`,prompt:`Explain database normalization 1NF to BCNF with examples`},{icon:`✍️`,label:`Legal Language`,prompt:`Explain common legal maxims like factum valet, mens rea, actus reus and ubi jus ibi remedium`},{icon:`📊`,label:`SQL Joins`,prompt:`Explain all types of SQL JOINs with syntax and examples`},{icon:`⚖️`,label:`Law & Society`,prompt:`Explain Durkheim, Weber and Maine's theories on law and society`},{icon:`📖`,label:`Jurisprudence`,prompt:`Explain Hohfeld's analysis of rights and duties, and the schools of jurisprudence`},{icon:`📐`,label:`Stats Formulas`,prompt:`List all key Statistics formulas for mean, SD, correlation and regression`},{icon:`📘`,label:`Bare Act & News`,prompt:`What are the latest bare act amendments and recent legal news relevant to a Sem II B.Sc. LL.B. student?`}]:[{icon:`⌨️`,label:`Virtual Functions`,prompt:`Explain virtual functions and polymorphism in C++ with examples`},{icon:`🗄️`,label:`Normalization`,prompt:`Explain database normalization 1NF to BCNF with examples`},{icon:`⚖️`,label:`Legal Maxims`,prompt:`List 10 important Latin legal maxims with meanings for exam`},{icon:`📊`,label:`SQL Joins`,prompt:`Explain all types of SQL JOINs with syntax and examples`},{icon:`📖`,label:`Jurisprudence`,prompt:`Explain Hohfeld's analysis of rights and duties`},{icon:`📐`,label:`Stats Formulas`,prompt:`List all key Statistics formulas for mean, SD, correlation and regression`},{icon:`🧮`,label:`PL/SQL Basics`,prompt:`Explain PL/SQL block structure, cursors and triggers with examples`},{icon:`⚡`,label:`Revision Plan`,prompt:`Create a 3-hour power revision plan for my upcoming exams`}]}function dn(){return h.activeCourse===`neet`?[{icon:`🧬`,title:`Biology (NCERT)`,desc:`Cell biology, genetics, ecology, human physiology`},{icon:`⚛️`,title:`Physics`,desc:`Mechanics, electrostatics, optics, modern physics`},{icon:`🧪`,title:`Chemistry`,desc:`Organic, inorganic and physical chemistry`},{icon:`🔬`,title:`Zoology & Botany`,desc:`Plant kingdom, animal kingdom, reproduction`}]:h.activeCourse===`jee`?[{icon:`⚛️`,title:`Physics`,desc:`Mechanics, electrostatics, thermodynamics, optics`},{icon:`🧮`,title:`Mathematics`,desc:`Calculus, algebra, coordinate geometry, probability`},{icon:`🧪`,title:`Chemistry`,desc:`Organic reactions, physical chemistry, periodic table`},{icon:`📐`,title:`Problem Solving`,desc:`JEE Mains & Advanced problem strategies`}]:h.activeCourse===`cbse10`?[{icon:`📐`,title:`Mathematics`,desc:`Algebra, geometry, trigonometry, statistics`},{icon:`🔬`,title:`Science`,desc:`Physics, Chemistry, Biology — NCERT based`},{icon:`🌍`,title:`Social Science`,desc:`History, Geography, Civics, Economics`},{icon:`📖`,title:`English & Hindi`,desc:`Literature, grammar, writing skills`}]:h.activeCourse===`cbse12`?[{icon:`📐`,title:`Mathematics`,desc:`Calculus, algebra, vectors, probability`},{icon:`⚛️`,title:`Physics & Chemistry`,desc:`Modern physics, organic chemistry, electrochemistry`},{icon:`🧬`,title:`Biology / Economics`,desc:`Genetics, ecology, macroeconomics, money & banking`},{icon:`📖`,title:`English Literature`,desc:`Flamingo, Vistas, writing skills`}]:h.activeCourse===`nfsu1`?[{icon:`⚖️`,title:`Legal Methods & Tort`,desc:`Sources of law, precedent, negligence, strict liability`},{icon:`🛒`,title:`Consumer Protection`,desc:`Consumer Protection Act, unfair trade practices`},{icon:`💻`,title:`Computer & C`,desc:`Computer organization, embedded systems, C programming`},{icon:`📊`,title:`Discrete Maths`,desc:`Set theory, relations, graph theory`}]:h.activeCourse===`nfsu3`?[{icon:`⚖️`,title:`Law of Crimes I`,desc:`IPC → BNS mapping, mens rea, offences against body & property`},{icon:`🏛️`,title:`Constitutional Law I`,desc:`Fundamental Rights, DPSP, writs, PIL`},{icon:`📜`,title:`Contract & Family Law`,desc:`Offer, acceptance, remedies, Hindu marriage & divorce`},{icon:`📘`,title:`Bare Act & Legal News`,desc:`Latest amendments (BNS/BNSS/BSA) and current legal developments`}]:h.activeCourse===`nfsu`?[{icon:`⌨️`,title:`C++ & OOP`,desc:`Virtual functions, inheritance, polymorphism`},{icon:`🗄️`,title:`RDBMS & SQL`,desc:`Joins, normalization, PL/SQL triggers`},{icon:`⚖️`,title:`Legal Language & Law & Society`,desc:`Legal maxims, drafting, sociology of law`},{icon:`📘`,title:`Jurisprudence & Bare Act`,desc:`Schools of jurisprudence, Statistics, latest legal news`}]:[{icon:`⌨️`,title:`C++ & OOP`,desc:`Virtual functions, inheritance, polymorphism`},{icon:`🗄️`,title:`RDBMS & SQL`,desc:`Joins, normalization, PL/SQL triggers`},{icon:`📖`,title:`Law Subjects`,desc:`Jurisprudence, legal maxims, Law & Society`},{icon:`📊`,title:`Statistics`,desc:`Hypothesis testing, correlation, regression`}]}var fn=[],pn=[],mn=`ein_ai_sessions`,hn=30,I=[];F._aiActiveSession=null;var L=!0;function R(){try{I=JSON.parse(localStorage.getItem(`ein_ai_sessions`)||`[]`)}catch{I=[]}}function z(){try{localStorage.setItem(mn,JSON.stringify(I.slice(0,30)))}catch{}}function gn(e){let t=e.find(e=>e.role===`user`);return t&&t.text.replace(/<[^>]+>/g,``).trim().slice(0,42)||`New chat`}function _n(){R();let e=`sess_`+Date.now();F._aiActiveSession=e,$.aiHistory=[];let t={id:e,title:`New chat`,ts:Date.now(),messages:[]};I.unshift(t),z();let n=document.getElementById(`ai-chat-box`),r=document.querySelector(`.ai-topbar-title`),i=document.querySelector(`.ai-clear-btn`);document.querySelector(`.ai-hint`),n&&(n.innerHTML=`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:#333;text-align:center;padding:32px 24px"><div style="font-size:36px;opacity:0.3">🤖</div><div style="font-size:14px;font-weight:600;color:#444">New conversation</div><div style="font-size:12px;color:#2a2a3a;line-height:1.6">Ask me anything about your syllabus,<br>concepts, or exam strategy.</div></div>`),r&&(r.textContent=`AI Study Assistant`),i&&i.remove();let a=document.querySelector(`.ai-sessions-list`);if(a){J?.isPro;let e=new Date;e.setHours(0,0,0,0);let t=new Date(e);t.setDate(e.getDate()-1);let n=new Date(e);n.setDate(e.getDate()-7);let r={Today:[],Yesterday:[],"This week":[],Older:[]};I.forEach(i=>{let a=new Date(i.ts);a.setHours(0,0,0,0),a>=e?r.Today.push(i):a>=t?r.Yesterday.push(i):a>=n?r[`This week`].push(i):r.Older.push(i)});let i=``;for(let[e,t]of Object.entries(r))t.length&&(i+=`<div class="ai-sidebar-label">`+e+`</div>`,i+=t.map(e=>`<div class="ai-session-item`+(F._aiActiveSession===e.id?` active`:``)+`" onclick="aiLoadSession('`+e.id+`')"><span class="ai-session-title">`+y(e.title)+`</span><span class="ai-session-meta">`+Tn(e.ts)+`</span><button class="ai-session-del" onclick="aiDeleteSession('`+e.id+`',event)" title="Delete">✕</button></div>`).join(``));a.innerHTML=i||`<div style="padding:20px 14px;font-size:11px;color:#222;text-align:center;line-height:1.6">No conversations yet.<br>Start a new chat!</div>`}window.innerWidth<=700&&Sn(),setTimeout(()=>{let e=document.getElementById(`ai-input`);e&&(e.value=``,e.style.height=`auto`,e.focus())},50)}function vn(e){R();let t=I.find(t=>t.id===e);t&&(F._aiActiveSession=e,$.aiHistory=t.messages.map(e=>({...e})),B(),setTimeout(()=>{let e=document.getElementById(`ai-chat-box`);e&&(e.scrollTop=e.scrollHeight)},60),window.innerWidth<=700&&Sn())}function yn(e,t){t&&(t.stopPropagation(),t.preventDefault()),R(),I=I.filter(t=>t.id!==e),z(),F._aiActiveSession===e&&(F._aiActiveSession=null,$.aiHistory=[]),B()}function bn(){if(!F._aiActiveSession)return;R();let e=I.findIndex(e=>e.id===F._aiActiveSession);e<0?I.unshift({id:F._aiActiveSession,title:gn($.aiHistory),ts:Date.now(),messages:[...$.aiHistory]}):(I[e].messages=[...$.aiHistory],I[e].title=gn($.aiHistory),I[e].ts=Date.now()),z()}function xn(){L=!L;let e=document.getElementById(`ai-sidebar`),t=window.innerWidth<=700;e&&(t?(e.classList.toggle(`mobile-open`,L),e.classList.remove(`collapsed`)):e.classList.toggle(`collapsed`,!L));let n=document.getElementById(`ai-toggle-btn`);n&&(n.innerHTML=L?Cn():wn());let r=document.getElementById(`ai-sidebar-overlay`);r&&t&&r.classList.toggle(`visible`,L)}function Sn(){if(window.innerWidth>700)return;L=!1;let e=document.getElementById(`ai-sidebar`);e&&(e.classList.remove(`mobile-open`),e.classList.add(`collapsed`));let t=document.getElementById(`ai-toggle-btn`);t&&(t.innerHTML=wn());let n=document.getElementById(`ai-sidebar-overlay`);n&&n.classList.remove(`visible`)}function Cn(){return`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="1.5"/></svg>`}function wn(){return`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="1.5" opacity="0.3"/></svg>`}function Tn(e){let t=Date.now()-e;return t<6e4?`now`:t<36e5?Math.floor(t/6e4)+`m`:t<864e5?Math.floor(t/36e5)+`h`:Math.floor(t/864e5)+`d`}function En(){R();let e=$.aiHistory.length>0,t=!!J?.isPro,r=!L,i=n.currentUser?.displayName?.split(` `)[0]||`there`,a=new Date;a.setHours(0,0,0,0);let o=new Date(a);o.setDate(a.getDate()-1);let s=new Date(a);s.setDate(a.getDate()-7);let c={Today:[],Yesterday:[],"This week":[],Older:[]};I.forEach(e=>{let t=new Date(e.ts);t.setHours(0,0,0,0),t>=a?c.Today.push(e):t>=o?c.Yesterday.push(e):t>=s?c[`This week`].push(e):c.Older.push(e)});let l=Object.entries(c).map(([e,t])=>t.length?`<div class="ai-sidebar-label">`+e+`</div>`+t.map(e=>`<div class="ai-session-item`+(F._aiActiveSession===e.id?` active`:``)+`" onclick="aiLoadSession('`+e.id+`')"><span class="ai-sess-icon">💬</span><span class="ai-sess-title">`+y(e.title)+`</span><span class="ai-sess-time">`+Tn(e.ts)+`</span><button class="ai-sess-del" onclick="aiDeleteSession('`+e.id+`',event)" title="Delete">✕</button></div>`).join(``):``).join(``),u=`<select id="ai-subject-ctx" class="ai-subject-select" onchange="render()"><option value="all">All subjects</option>`+v().map(e=>`<option value="`+e.id+`">`+e.icon+` `+e.name+`</option>`).join(``)+`</select>`,d=un().map((e,t)=>`<button class="ai-chip" onclick="setQuickPrompt(`+t+`)">`+e.icon+` `+e.label+`</button>`).join(``),f=dn().map((e,t)=>`<div class="ai-welcome-card" onclick="setWelcomePrompt(`+t+`)"><div class="ai-wc-icon">`+e.icon+`</div><div class="ai-wc-title">`+e.title+`</div><div class="ai-wc-desc">`+e.desc+`</div></div>`).join(``),p=e?$.aiHistory.map((e,t)=>Dn(e,t)).join(``):`<div class="ai-welcome"><div class="ai-welcome-logo">✶</div><div><div style="font-size:20px;font-weight:700;color:#ccc;margin-bottom:6px">Hello, `+y(i)+`</div><div style="font-size:13px;color:#333;line-height:1.7">What would you like to study today?</div></div><div class="ai-welcome-grid">`+f+`</div></div>`,h=`<button class="ai-send-btn" id="ai-send-btn" onclick="sendAIMessage()" `+(m.aiTyping||!t&&Mr>=5?`disabled`:``)+`>`+(m.aiTyping?`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#555" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#555" stroke-width="2" stroke-linecap="round"/></svg>`:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`)+`</button>`,g=t?`Enter to send · Shift+Enter for new line · Claude AI`:`Enter to send · <span style="color:#FFE66D66">Free: `+Math.max(0,5-Mr)+` messages left</span> · <span style="color:#4ECDC466;cursor:pointer" onclick="showProModal()">Upgrade ↗</span>`;return`<div class="fade-in ai-page"><div class="ai-sidebar`+(r?` collapsed`:``)+`" id="ai-sidebar"><div class="ai-sidebar-top"><button class="ai-new-chat-btn" onclick="aiNewChat()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>New chat</button></div><div class="ai-sessions-list">`+(I.length?l:`<div style="padding:20px 14px;font-size:11px;color:#222;text-align:center;line-height:1.6">No conversations yet.<br>Start a new chat!</div>`)+`</div><div class="ai-sidebar-bottom"><div class="ai-model-badge"><div class="ai-model-dot`+(m.aiTyping?` thinking`:``)+`"></div><span>`+(t?`Claude · Pro priority`:`Claude AI · Free tier`)+`</span></div></div></div><div class="ai-main"><div class="ai-topbar"><button class="ai-back-btn" onclick="switchView('dashboard')" title="Back to Dashboard"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="ai-toggle-btn" id="ai-toggle-btn" onclick="aiToggleSidebar()" title="Toggle history">`+(L?Cn():wn())+`</button><div class="ai-topbar-title">`+(e?y(gn($.aiHistory)):`AI Study Assistant`)+`</div><div class="ai-topbar-actions">`+(t?`<span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:6px;padding:2px 8px;font-weight:700">PRO ⭐</span>`:``)+u+(e?`<button class="ai-clear-btn" onclick="aiHistory=[];_aiPersistCurrentSession();render()">Clear</button>`:``)+`</div></div><div class="ai-chat-wrap" id="ai-chat-box">`+p+`</div><div class="ai-input-area"><div class="ai-input-box"><textarea id="ai-input" class="ai-textarea" placeholder="Message AI tutor…" rows="1" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendAIMessage()}" oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,140)+'px'"></textarea><div class="ai-input-footer"><div class="ai-chips">`+d+`</div>`+h+`</div></div><div class="ai-hint">`+g+`</div></div></div></div>`}function Dn(e,t){let r=e.role===`user`,i=e.text===`⏳ Thinking…`,a=e.ts?new Date(e.ts).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}):``,o=y(e.text);if(!r&&!i&&(o=o.replace(/\*\*(.*?)\*\*/g,`<strong style="color:#EDE8E0">$1</strong>`).replace(/\*(.*?)\*/g,`<em style="color:#aaa">$1</em>`).replace(/```([\s\S]*?)```/g,`<pre>$1</pre>`).replace(/`([^`]+)`/g,`<code>$1</code>`).replace(/^#{1,3}\s(.+)$/gm,`<div style="font-weight:bold;color:#4ECDC4;margin:10px 0 4px">$1</div>`).replace(/^[-\u2022]\s(.+)$/gm,`<div style="padding-left:14px;margin:3px 0">• $1</div>`).replace(/\n/g,`<br>`),window.DOMPurify&&(o=DOMPurify.sanitize(o,{ALLOWED_TAGS:[`strong`,`em`,`pre`,`code`,`div`,`br`,`span`],ALLOWED_ATTR:[`style`]}))),i)return`<div class="ai-msg-row" style="animation:fadeInUp 0.2s ease"><div class="ai-avatar bot" style="font-size:13px">✶</div><div class="ai-bubble-wrap"><div class="ai-sender-name">AI Tutor</div><div class="ai-bubble bot thinking-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div></div></div>`;let s=r?n.currentUser?.photoURL?`<img src="`+n.currentUser.photoURL+`" style="width:100%;height:100%;border-radius:8px;object-fit:cover" onerror="this.parentElement.textContent='&#128100;'">`:`&#128100;`:`✶`;return`<div class="ai-msg-row `+(r?`user`:``)+`"><div class="ai-avatar `+(r?`user`:`bot`)+`">`+s+`</div><div class="ai-bubble-wrap"><div class="ai-sender-name">`+(r?n.currentUser?.displayName?.split(` `)[0]||`You`:`AI Tutor`)+`</div><div class="ai-bubble `+(r?`user`:`bot`)+`">`+o+`</div><div class="ai-meta">`+a+`</div></div></div>`}function On(){if(!ie.deferredPrompt){b(`ℹ️ App already installed or not supported`,`info`);return}ie.deferredPrompt.prompt(),ie.deferredPrompt.userChoice.then(e=>{e.outcome===`accepted`&&b(`🎉 App installed!`,`success`),ie.deferredPrompt=null,document.getElementById(`pwa-install-btn`).style.display=`none`})}typeof window<`u`&&Object.assign(window,{AI_QUICK_PROMPTS:fn,AI_SESSIONS_KEY:mn,AI_SESSION_MAX:30,AI_WELCOME_CARDS:pn,_aiLoadSessions:R,_aiPersistCurrentSession:bn,_aiRelTime:Tn,_aiSaveSessions:z,_aiSessionTitle:gn,_aiSessions:I,_aiSidebarOpen:L,_aiToggleIconClosed:wn,_aiToggleIconOpen:Cn,_closeAISidebarMobile:Sn,aiDeleteSession:yn,aiLoadSession:vn,aiNewChat:_n,aiToggleSidebar:xn,getAIQuickPrompts:un,getAIWelcomeCards:dn,installPWA:On,renderAI:En,renderAIMsgBubble:Dn});function kn(e){return r.subjectSections[e]||(r.subjectSections[e]={qp:[],notes:[],materials:[],playlists:[]}),r.subjectSections[e]}function An(e){return r.activeSectionTab[e]||`qp`}function jn(e,t){r.activeSectionTab[e]=t,d(`activeSectionTab`,r.activeSectionTab),B()}function Mn(e,t){r.showSectionModal={subjectId:e,tab:t},r.newSectionItem={title:``,url:``,description:``,year:``,subjectId:e,tab:t},B()}function Nn(){r.showSectionModal=null,B()}function Pn(){let e=r.showSectionModal;if(!e)return;let t=document.getElementById(`sec-title`)?.value||``,n=document.getElementById(`sec-url`)?.value||``,i=document.getElementById(`sec-desc`)?.value||``,a=document.getElementById(`sec-year`)?.value||``;if(!t.trim()){b(`⚠️ Title is required`,`alarm`);return}let o=kn(e.subjectId),s={id:x(),title:t,url:n,description:i,year:a,created:S()};o[e.tab].unshift(s),_(`subjectSections`,r.subjectSections),r.showSectionModal=null,b(`✅ Added!`,`success`),H(),B()}function Fn(e,t,n){if(!confirm(`Delete this item?`))return;let i=kn(e);i[t]=i[t].filter(e=>e.id!==n),_(`subjectSections`,r.subjectSections),b(`🗑️ Deleted`,`info`),B()}async function In(e){b(`⚠️ Connect Google Drive first (Sync tab)`,`alarm`)}function Ln(){r.showFolderPicker=!1,r.driveFolderPickerFor=null,B()}async function Rn(){}async function zn(e,t){let n=r.driveFolderPickerFor;n&&(r.subjectDriveFolders[n]={folderId:e,folderName:t},d(`subjectDriveFolders`,r.subjectDriveFolders),r.showFolderPicker=!1,r.driveFolderPickerFor=null,b(`📁 "${t}" linked to ${v().find(e=>e.id===n)?.name||n}`,`success`),B())}async function Bn(e){}function Vn(e){let t=e.id,n=An(t),i=kn(t),a=r.subjectDriveFolders[t],o=`<div class="sub-tab-bar">
    ${[{key:`qp`,icon:`📄`,label:`Question Papers`},{key:`notes`,icon:`📝`,label:`Notes`},{key:`materials`,icon:`📦`,label:`Materials`},{key:`playlists`,icon:`▶️`,label:`YouTube`}].map(r=>`<button class="sub-tab ${n===r.key?`active`:``}"
      onclick="setActiveTab('${t}','${r.key}')"
      style="${n===r.key?`background:${e.color};`:``}">
      ${r.icon} ${r.label}
      <sup style="font-size:9px;opacity:0.7">${i[r.key]?.length||0}</sup>
    </button>`).join(``)}
  </div>`,s=a?`<div class="drive-folder-chip" onclick="openFolderPicker('${t}')">📁 ${y(a.folderName)} <span style="font-size:9px;opacity:0.6">change</span></div>`:`<button class="drive-folder-chip" style="color:#555;border-color:#1e1e2e" onclick="openFolderPicker('${t}')">📁 Link Drive Folder</button>`,c=``;if(n===`qp`){let e=i.qp||[];c=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:13px;color:#555">${e.length} question paper${e.length===1?``:`s`}</div>
        <button class="btn-gold" style="font-size:12px;padding:8px 16px" onclick="openSectionModal('${t}','qp')">+ Add Paper</button>
      </div>
      ${e.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📄</div><div>No question papers yet</div><div style="font-size:12px;color:#444;margin-top:4px">Add previous year papers, sample papers</div></div>`:e.map(e=>`<div class="qp-card" onclick="${e.url?`window.open('${y(e.url)}','_blank')`:`void(0)`}">
        <div style="font-size:28px">📄</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:bold;font-size:14px;color:#EDE8E0">${y(e.title)}</div>
          ${e.year?`<div style="font-size:11px;color:#555;margin-top:2px">Year: ${y(e.year)}</div>`:``}
          ${e.description?`<div style="font-size:12px;color:#666;margin-top:4px">${y(e.description)}</div>`:``}
          ${e.url?`<div style="font-size:10px;color:#4ECDC4;margin-top:4px">🔗 ${y(e.url.slice(0,50))}${e.url.length>50?`...`:``}</div>`:``}
        </div>
        <button onclick="event.stopPropagation();deleteSectionItem('${t}','qp','${e.id}')" class="icon-btn" style="color:#553333">🗑️</button>
      </div>`).join(``)}`}else if(n===`notes`){let e=i.notes||[];c=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:13px;color:#555">${e.length} note${e.length===1?``:`s`}</div>
        <button class="btn-gold" style="font-size:12px;padding:8px 16px" onclick="openSectionModal('${t}','notes')">+ Add Note</button>
      </div>
      ${e.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📝</div><div>No notes yet</div></div>`:e.map(e=>`<div class="sec-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <div style="font-weight:bold;font-size:14px;color:#EDE8E0;margin-bottom:6px">${y(e.title)}</div>
            ${e.description?`<div style="font-size:13px;color:#888;line-height:1.7;white-space:pre-wrap">${y(e.description)}</div>`:``}
            ${e.url?`<a href="${y(e.url)}" target="_blank" style="display:inline-block;margin-top:8px;font-size:11px;color:#4ECDC4;text-decoration:none">🔗 Open Link</a>`:``}
            <div style="font-size:10px;color:#2e2e3e;margin-top:8px">${e.created}</div>
          </div>
          <button onclick="deleteSectionItem('${t}','notes','${e.id}')" class="icon-btn" style="color:#553333">🗑️</button>
        </div>
      </div>`).join(``)}`}else if(n===`materials`){let e=i.materials||[];c=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:13px;color:#555">${e.length} material${e.length===1?``:`s`}</div>
        <button class="btn-gold" style="font-size:12px;padding:8px 16px" onclick="openSectionModal('${t}','materials')">+ Add Material</button>
      </div>
      ${e.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📦</div><div>No study materials yet</div><div style="font-size:12px;color:#444;margin-top:4px">Add reference books, slides, handouts</div></div>`:e.map(e=>`<div class="sec-card" onclick="${e.url?`window.open('${y(e.url)}','_blank')`:`void(0)`}" style="cursor:${e.url?`pointer`:`default`}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <div style="font-weight:bold;font-size:14px;color:#EDE8E0;margin-bottom:4px">${y(e.title)}</div>
            ${e.description?`<div style="font-size:12px;color:#888;margin-top:4px">${y(e.description)}</div>`:``}
            ${e.url?`<div style="font-size:10px;color:#4ECDC4;margin-top:6px">🔗 ${y(e.url.slice(0,60))}${e.url.length>60?`...`:``}</div>`:``}
            <div style="font-size:10px;color:#2e2e3e;margin-top:6px">${e.created}</div>
          </div>
          <button onclick="event.stopPropagation();deleteSectionItem('${t}','materials','${e.id}')" class="icon-btn" style="color:#553333">🗑️</button>
        </div>
      </div>`).join(``)}`}else if(n===`playlists`){let e=i.playlists||[];c=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:13px;color:#555">${e.length} playlist${e.length===1?``:`s`}</div>
        <button class="btn-gold" style="font-size:12px;padding:8px 16px" onclick="openSectionModal('${t}','playlists')">+ Add Playlist</button>
      </div>
      ${e.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">▶️</div><div>No YouTube playlists yet</div><div style="font-size:12px;color:#444;margin-top:4px">Add video lectures, tutorial series</div></div>`:e.map(e=>{let n=e.url&&(e.url.match(/[?&]v=([^&]+)/)?.[1]||e.url.match(/youtu\.be\/([^?]+)/)?.[1]||e.url.match(/list=([^&]+)/)?.[1])||null,r=n?`https://img.youtube.com/vi/${n}/mqdefault.jpg`:null;return`<div class="yt-card">
          <div class="yt-thumb" onclick="${e.url?`window.open('${y(e.url)}','_blank')`:`void(0)`}">
            ${r?`<img src="${r}" alt="thumb" onerror="this.parentElement.innerHTML='▶️'"/>`:`▶️`}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:bold;font-size:13px;color:#EDE8E0;margin-bottom:4px">${y(e.title)}</div>
            ${e.description?`<div style="font-size:12px;color:#888;margin-bottom:6px">${y(e.description)}</div>`:``}
            ${e.url?`<a href="${y(e.url)}" target="_blank" style="display:inline-block;background:#FF0000;color:#fff;font-size:11px;padding:4px 12px;border-radius:12px;text-decoration:none;font-weight:bold">▶ Watch on YouTube</a>`:``}
          </div>
          <button onclick="deleteSectionItem('${t}','playlists','${e.id}')" class="icon-btn" style="color:#553333">🗑️</button>
        </div>`}).join(``)}`}return`${o}
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      ${s}
    </div>
    ${c}`}function Hn(){let e=r.showSectionModal;if(!e)return``;let t=v().find(t=>t.id===e.subjectId),n={qp:`Question Paper`,notes:`Note`,materials:`Study Material`,playlists:`YouTube Playlist`},i=e.tab===`playlists`,a=e.tab===`qp`;return`<div class="modal-overlay show" onclick="if(event.target===this)closeSectionModal()">
    <div class="modal-box fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <div style="font-size:15px;font-weight:bold;color:#EDE8E0">Add ${n[e.tab]||`Item`}</div>
          <div style="font-size:11px;color:${t?.color||`#555`};margin-top:2px">${t?.icon||``} ${y(t?.name||``)}</div>
        </div>
        <button class="icon-btn" onclick="closeSectionModal()" style="font-size:18px;color:#666">✕</button>
      </div>
      <div style="margin-bottom:12px">
        <div class="section-label">TITLE *</div>
        <input id="sec-title" placeholder="${i?`Playlist or channel name`:a?`e.g. 2024 Exam Paper`:`Title`}"/>
      </div>
      <div style="margin-bottom:12px">
        <div class="section-label">${i?`YOUTUBE URL`:`LINK / URL`} ${i?`*`:``}</div>
        <input id="sec-url" placeholder="${i?`https://youtube.com/playlist?list=... or youtu.be/...`:`https://drive.google.com/... or any link (optional)`}"/>
      </div>
      ${a?`<div style="margin-bottom:12px"><div class="section-label">YEAR / SEMESTER</div><input id="sec-year" placeholder="e.g. 2024, Sem II"/></div>`:`<input id="sec-year" style="display:none"/>`}
      <div style="margin-bottom:20px">
        <div class="section-label">DESCRIPTION / NOTES</div>
        <textarea id="sec-desc" rows="3" placeholder="${i?`Topics covered, duration...`:`Additional notes (optional)`}"></textarea>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn-gold" onclick="saveSectionItem()" style="flex:1">💾 Save</button>
        <button class="btn-ghost" onclick="closeSectionModal()">Cancel</button>
      </div>
    </div>
  </div>`}function Un(){if(!r.showFolderPicker)return``;let e=r.driveFolderPickerFor,t=v().find(t=>t.id===e),n=r.availableDriveFolders;return`<div class="modal-overlay show" onclick="if(event.target===this)closeFolderPicker()">
    <div class="modal-box fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <div style="font-size:15px;font-weight:bold;color:#EDE8E0">📁 Link Drive Folder</div>
          <div style="font-size:11px;color:${t?.color||`#555`};margin-top:2px">For ${t?.icon||``} ${y(t?.name||``)}</div>
        </div>
        <button class="icon-btn" onclick="closeFolderPicker()" style="font-size:18px;color:#666">✕</button>
      </div>
      <button class="add-sec-btn" onclick="createDriveFolderForSubject('${e}')">
        ✨ Auto-create "NFSU-${y(t?.name||e)}" folder in Drive
      </button>
      <div style="font-size:11px;color:#444;text-align:center;margin:10px 0">— or pick an existing folder —</div>
      ${n.length===0?`<div style="text-align:center;padding:24px;color:#333"><div style="font-size:30px;margin-bottom:10px">🔄</div>Loading your Drive folders…</div>`:n.map(t=>`<div class="folder-picker-item ${r.subjectDriveFolders[e]?.folderId===t.id?`selected`:``}" onclick="selectDriveFolder('${t.id}','${y(t.name)}')">
          <span style="font-size:20px">📁</span>
          <div style="flex:1"><div style="font-size:13px;color:#ccc">${y(t.name)}</div></div>
          ${r.subjectDriveFolders[e]?.folderId===t.id?`<span style="color:#06D6A0;font-size:16px">✓</span>`:``}
        </div>`).join(``)}
    </div>
  </div>`}async function Wn(){let e=await Y(),t=Ue(),i=E(),a=D(),o=v().map(e=>({...e,pct:T(e.id)})),s=[];t>=100&&s.push({icon:`🏆`,name:`Perfect Score`,desc:`100% done`}),t>=75&&s.push({icon:`⭐`,name:`Star Student`,desc:`75%+ done`}),t>=50&&s.push({icon:`📚`,name:`Halfway Hero`,desc:`50%+ done`}),a>=7&&s.push({icon:`🔥`,name:`Week Warrior`,desc:`7-day streak`}),a>=3&&s.push({icon:`✨`,name:`On a Roll`,desc:`3-day streak`}),i>=20&&s.push({icon:`⏰`,name:`Time Investor`,desc:`20+ hours`}),i>=5&&s.push({icon:`💪`,name:`Getting Started`,desc:`5+ hours`}),r.files.length>=5&&s.push({icon:`📁`,name:`File Hoarder`,desc:`5+ files`}),r.materials.length>=10&&s.push({icon:`🗂️`,name:`Note Taker`,desc:`10+ notes`}),s.length===0&&s.push({icon:`🌱`,name:`Beginner`,desc:`Just started!`});let c=`🌱 Seedling`;t>=80?c=`🏆 Champion`:t>=60?c=`⭐ Scholar`:t>=40?c=`📚 Student`:t>=20&&(c=`🌿 Learner`);let l=v().filter(e=>w(O(e.id))!==null&&w(O(e.id))>=0).slice().sort((e,t)=>w(O(e.id))-w(O(t.id)))[0]||null,u=J||{},d=u.expiresAt||0,f=u.planType||`monthly`,p=d>0?new Date(d).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`}):`—`,m=n.currentUser?.metadata?.creationTime?new Date(n.currentUser.metadata.creationTime).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`}):null,h=`<style>
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
</style>`;return n.currentUser?`${h}<div class="pf fade-in">

    <div class="pf-card pf-hero">
      <div class="pf-id">
        <div class="pf-avw">
          <img class="pf-av" src="${y(n.currentUser.photoURL||``)}" onerror="this.style.display='none'"/>
          <div class="pf-avb">${t>=80?`🏆`:t>=50?`⭐`:`📚`}</div>
        </div>
        <div style="flex:1;min-width:0">
          <div class="pf-nm">${y(n.currentUser.displayName||`Student`)}</div>
          ${m?`<div class="pf-ms">MEMBER SINCE ${m.toUpperCase()}</div>`:``}
          <span class="pf-rank">${c}</span>
        </div>
      </div>
    </div>

    <div class="pf-card ${e?``:`click`}" onclick="${e?``:`openProModal()`}" ${e?`style="border-color:color-mix(in srgb,var(--acc) 35%,var(--line))"`:``}>
      <div class="pf-sub">
        <div>
          <div class="pf-lbl" style="margin-bottom:6px">SUBSCRIPTION</div>
          <b style="color:${e?`var(--acc)`:`var(--txt)`}">${e?`Pro Plan`:`Free Plan`}</b>
          <span>${e?`<span style="text-transform:capitalize">${y(f)}</span> · Renews ${p}`:`Tap to unlock Pro features →`}</span>
        </div>
        <div class="ic" style="${e?`background:linear-gradient(135deg,#FFE66D,#ffb700)`:`background:color-mix(in srgb,var(--txt) 8%,transparent)`}">${e?`⭐`:`🔒`}</div>
      </div>
    </div>

    <div class="pf-stats">
      ${[[`📊`,t+`%`,`COMPLETED`,`analytics`,`#FFE66D`],[`⏱️`,i+`h`,`HOURS LOGGED`,`log`,`#06D6A0`],[`🔥`,a+`d`,`DAY STREAK`,`log`,`#FF6B35`]].map(([e,t,n,r,i])=>`
      <div class="pf-stat" style="--c:${i}" onclick="switchView('${r}')"><span class="ic">${e}</span><b>${t}</b><span>${n}</span></div>`).join(``)}
    </div>

    <div class="pf-card pf-ai click" onclick="${e?`generateProfileInsight()`:`openProModal()`}">
      <div class="pf-ch" style="margin-bottom:12px">
        <div class="pf-ai-t">✨ AI STUDY INSIGHTS ${e?``:`<span class="pf-tag">PRO</span>`}</div>
        <span class="pf-more" style="color:#4ECDC4">${e?`Tap to refresh →`:`Upgrade →`}</span>
      </div>
      <div id="profile-insight" class="pf-ai-b">
        ${e?t>=80?`🔥 Excellent! You're well-prepared. Focus on weak spots and do timed mock tests.`:t>=50?`📈 Good progress! Keep consistent — daily small sessions beat cramming.`:`💪 Start with your nearest exam subject. Every topic checked builds momentum!`:`<span style="color:var(--mute)">Unlock AI-powered personalised study insights tailored to your progress and upcoming exams.</span>`}
      </div>
    </div>

    ${l?`<div class="pf-card click" onclick="switchView('subjects')" style="border-color:color-mix(in srgb,#FF6B35 30%,var(--line))">
      <div class="pf-lbl" style="margin-bottom:12px">NEXT EXAM</div>
      <div class="pf-next">
        <div class="ic">${l.icon}</div>
        <div style="flex:1;min-width:0"><b>${y(l.name)}</b><span>${y(O(l.id))}</span></div>
        ${w(O(l.id))===null?``:`<div class="pf-days"><b>${w(O(l.id))}</b><small>DAYS LEFT</small></div>`}
      </div>
    </div>`:``}

    <div class="pf-card click" onclick="switchView('subjects')">
      <div class="pf-ch"><div class="pf-lbl">SUBJECT PROGRESS</div><span class="pf-more">View all →</span></div>
      ${o.map(e=>`<div class="pf-row" style="--c:${e.color}">
        <div class="pf-row-h"><span>${e.icon} ${y(e.name)}</span><b>${e.pct}%</b></div>
        <div class="pf-bar"><i style="width:${e.pct}%"></i></div>
      </div>`).join(``)}
    </div>

    <div class="pf-card click" onclick="switchView('analytics')">
      <div class="pf-ch"><div class="pf-lbl">ACHIEVEMENTS</div><span class="pf-more">${s.length} earned</span></div>
      <div class="pf-badges">
        ${s.map(e=>`<div class="pf-badge"><div class="i">${e.icon}</div><b>${e.name}</b><span>${e.desc}</span></div>`).join(``)}
      </div>
    </div>

    <button class="pf-out" onclick="googleSignOut()">Sign Out</button>
  </div>`:`${h}<div class="pf fade-in">
    <div class="pf-card" style="text-align:center;padding:52px 20px">
      <div style="font-size:64px;margin-bottom:14px">👤</div>
      <div style="font-size:22px;font-weight:800;color:var(--txt);margin-bottom:8px">Your Study Profile</div>
      <div style="font-size:13px;color:var(--mute);margin-bottom:24px">Sign in to see personalised stats, achievements &amp; AI insights</div>
      <button class="pf-g" onclick="googleSignIn()">🔐 Sign in with Google</button>
    </div>
  </div>`}async function Gn(){let e=document.getElementById(`profile-insight`);if(!e)return;if(!await Y()){b(`⭐ AI Insights require Pro — upgrade to unlock!`,`info`),G();return}e.textContent=`⏳ Generating AI insights…`;let t=await Lr(`Student has: ${v().map(e=>e.name+`:`+T(e.id)+`%`).join(`, `)}. Total study hours: ${E()}. Streak: ${D()} days. Exams start 18 May 2026. Give 2-3 short, specific, encouraging study tips. Max 60 words.`);e&&(e.textContent=t)}typeof window<`u`&&Object.assign(window,{closeFolderPicker:Ln,closeSectionModal:Nn,createDriveFolderForSubject:Bn,deleteSectionItem:Fn,generateProfileInsight:Gn,getActiveTab:An,getSubjectSection:kn,loadDriveFolders:Rn,openFolderPicker:In,openSectionModal:Mn,renderFolderPicker:Un,renderProfile:Wn,renderSectionModal:Hn,renderSubjectSectionTabs:Vn,saveSectionItem:Pn,selectDriveFolder:zn,setActiveTab:jn});var Kn=null,qn=[];function B(){return new Promise(e=>{qn.push(e),Kn&&clearTimeout(Kn),Kn=setTimeout(async()=>{Kn=null;let e=[...qn];qn=[],await Jn(),e.forEach(e=>e())},50)})}async function Jn(){let t=document.getElementById(`static-landing`);if(t){let e=window._splashStart||Date.now(),n=Date.now()-e,r=Math.max(0,2e3-n);setTimeout(()=>{t.classList.add(`hidden`),setTimeout(()=>{t.style.display=`none`},500)},r)}let n=document.getElementById(`main-content`),a={dashboard:Xn,subjects:Zn,alarms:Qn,files:je,sync:Yn,log:$n,about:Ve,pomodoro:Bt,flashcards:cn,quiz:Yt,analytics:ln,ai:En,profile:Wn,neetjee:te};if(!n)return;let o=a[r.view]||Xn;try{let e=o();n.innerHTML=e instanceof Promise?await e:e}catch(e){console.error(`[render] Error in view '`+r.view+`':`,e),n.innerHTML=`<div class="fade-in" style="text-align:center;padding:48px 20px">
      <div style="font-size:48px;margin-bottom:16px">⚠️</div>
      <div style="font-size:16px;font-weight:bold;color:#FF6B35;margin-bottom:8px">Something went wrong</div>
      <div style="font-size:12px;color:#555;margin-bottom:20px">${e.message||`Unknown error`}</div>
      <button class="btn-gold" onclick="switchView('dashboard')" style="padding:10px 24px">← Go to Dashboard</button>
    </div>`}r.view===`alarms`&&U(),r.view===`ai`&&Fr(),i(),se(),e()}function Yn(){let e={offline:{icon:`🔴`,text:`Not signed in`,color:`#888`,desc:`Sign in with Google to sync your data across all devices.`},connecting:{icon:`🟡`,text:`Connecting…`,color:`#FFE66D`,desc:`Establishing secure connection…`},synced:{icon:`🟢`,text:`Synced`,color:`#06D6A0`,desc:`Your data is syncing in real-time across all devices!`},error:{icon:`🔴`,text:`Connection error`,color:`#FF6B35`,desc:`Sync error — likely a Firestore rules issue. See help below.`}},t=e[n.syncStatus]||e.offline,r=n.currentUser?`
    <div class="sy-card sy-user">
      <img src="${n.currentUser.photoURL||``}" onerror="this.style.display='none'" class="sy-av"/>
      <div style="flex:1;min-width:0">
        <b>${y(n.currentUser.displayName||`User`)}</b>
        <span>UID: ${n.syncUserId?.slice(0,16)||`—`}…</span>
      </div>
      <button class="sy-btn d" onclick="googleSignOut()">Sign Out</button>
    </div>`:`
    <div class="sy-card" style="text-align:center;padding:32px 20px">
      <div style="font-size:46px;margin-bottom:12px">🔐</div>
      <div style="font-size:17px;font-weight:800;color:var(--txt);margin-bottom:8px">Sign in to sync your data</div>
      <div style="font-size:12.5px;color:var(--mute);margin-bottom:22px;line-height:1.7">Use the same Google account on any device.<br>Your progress will appear instantly everywhere.</div>
      <button class="sy-g" onclick="googleSignIn()"><span>G</span> Sign in with Google</button>
      <div style="font-size:11px;color:var(--mute);margin-top:16px">Free · Secure · Works on mobile + PC</div>
    </div>`;return`<style>
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
</style><div class="sy fade-in">
    <div class="sy-h1">🔄 Sync &amp; Account</div>
    <div class="sy-h2">Sign in with Google to sync across phone and PC.</div>

    <div class="sy-card sy-status" style="--c:${t.color}">
      <div class="ic">${t.icon}</div>
      <b>${t.text}</b>
      <p>${t.desc}</p>
      <div class="sy-row">
        <button class="sy-btn p" onclick="pushToFirebase().then(()=>showToast('✅ Data synced to cloud!','success')).catch(e=>showToast('⚠️ Sync failed: '+e.message,'alarm'))">⬆ Sync Now</button>
        ${n.currentUser?`<button class="sy-btn" onclick="subscribeToFirestore().then(()=>showToast('✅ Pulled latest data!','success'))">⬇ Pull Latest</button>`:``}
      </div>
    </div>

    ${r}

    <div class="sy-card">
      <div class="sy-ch"><div class="sy-ci">📎</div><div><b>Import from Google Drive</b><span>Paste a Drive share link to add it to your Files</span></div></div>
      <p class="sy-p">Share a file from Google Drive → copy the link → paste it here. It will appear in your Files tab under the subject you choose.</p>
      <div class="sy-f">
        <div class="sy-f2">
          <input id="sync-drive-name" placeholder="File name (e.g. C++ Notes.pdf)"/>
          <select id="sync-drive-sub">${v().map(e=>`<option value="${e.id}">${e.icon} ${y(e.name)}</option>`).join(``)}</select>
        </div>
        <div class="sy-f3">
          <input id="sync-drive-url" placeholder="https://drive.google.com/file/d/..." style="flex:1"/>
          <button class="sy-btn p" onclick="addDriveLinkFromSync()">+ Add</button>
        </div>
      </div>
    </div>

    ${n.syncStatus===`error`?`
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
    </div>`:``}

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
  </div>`}function Xn(){let e=Ue(),t=2*Math.PI*54,n=t*(1-e/100),i=v(),a=e=>w(O(e)),o=i.filter(e=>a(e.id)!==null&&a(e.id)>=0).slice().sort((e,t)=>a(e.id)-a(t.id))[0]||null,s=r.alarms.filter(e=>e.enabled).length,c=D(),l=parseFloat(localStorage.getItem(`st_dailyGoal`)||`6`),u=r.hoursToday||0,d=Math.min(100,Math.round(u/l*100)),f=i.map((e,t)=>{let n=O(e.id),i=T(e.id),o=a(e.id),s=r.materials.filter(t=>t.subjectId===e.id).length,c=o!==null&&o<=2?`#ff5c5c`:o!==null&&o<=5?`#FF6B35`:`var(--text-5,#777)`,l=o===null?``:o<=0?`Today!`:o===1?`Tomorrow`:o+`d left`;return`<div class="ov-sub" style="--c:${e.color};animation-delay:${Math.min(t,12)*.04}s" onclick="setActiveSubject('${e.id}');switchView('subjects')">
      <div class="ov-sub-top">
        <div class="ov-sub-ic">${e.icon}</div>
        <div class="ov-sub-nm">
          <b>${y(e.name)}</b>
          <span>${s} material${s===1?``:`s`} · ${y(e.code)}</span>
        </div>
        <div class="ov-sub-pct">${i}<small>%</small></div>
      </div>
      <div class="ov-bar"><i style="width:${Math.max(i,2)}%"></i></div>
      <div class="ov-sub-ft">
        <span>${y(n||`No exam date`)}</span>
        ${l?`<em style="color:${c};border-color:${c}">${l}</em>`:``}
      </div>
    </div>`}).join(``),p=Array.from({length:7},(e,t)=>{let n=new Date;n.setDate(n.getDate()-6+t);let i=n.toISOString().split(`T`)[0],a=r.studyLog[i]?.hours>0,o=i===S();return`<div class="ov-day" title="${i}">
      <div class="ov-day-b ${a?`on`:``} ${o?`now`:``}"></div>
      <span class="${o?`now`:``}">${n.toLocaleDateString(`en`,{weekday:`narrow`})}</span>
    </div>`}).join(``),m=o?a(o.id):null,h=o?`
    <div class="ov-next" style="--c:${o.color}">
      <div class="ov-lbl">NEXT EXAM</div>
      <div class="ov-next-n"><b>${m===null?`–`:m}</b><span>${m===1?`day`:`days`}</span></div>
      <div class="ov-next-s"><span class="float-anim" style="display:inline-block">${o.icon}</span> ${y(o.name)}</div>
      <div class="ov-next-d">${y(O(o.id))}</div>
    </div>`:``;return`<style>
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
</style><div class="ov fade-in">
    <div class="ov-head">
      <div class="ov-h1">Overview</div>
      <div class="ov-h2">Your progress, streak and upcoming exams at a glance.</div>
    </div>

    <div class="ov-top ${o?`has-next`:``}">
      <div class="ov-card ov-hero">
        <div class="ov-ring">
          <svg width="130" height="130">
            <circle cx="65" cy="65" r="54" fill="none" stroke="currentColor" style="color:color-mix(in srgb,var(--txt) 9%,transparent)" stroke-width="10"/>
            <circle cx="65" cy="65" r="54" fill="none" stroke="url(#ovGrad)" stroke-width="10"
              stroke-dasharray="${t}" stroke-dashoffset="${n}" stroke-linecap="round" style="transition:stroke-dashoffset 1s ease"/>
            <defs><linearGradient id="ovGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#FFE66D"/><stop offset="100%" stop-color="#FF6B35"/></linearGradient></defs>
          </svg>
          <div class="ov-ring-t"><b>${e}%</b><span>COMPLETE</span></div>
        </div>
        <div class="ov-hero-r">
          <div class="ov-hero-t">Keep grinding! 💪</div>
          <div class="ov-hero-s">${o?`Next: `+y(o.name)+(m===null?``:` in `+m+`d`):`No exams set`} · ${s} active alarm${s===1?``:`s`}</div>
          <div class="ov-stats">
            ${[[`⏱️`,E()+`h`,`Logged`],[`🔥`,c+`d`,`Streak`],[`📁`,r.files.length,`Files`]].map(([e,t,n])=>`<div class="ov-stat"><b>${e} ${t}</b><span>${n}</span></div>`).join(``)}
          </div>
        </div>
      </div>
      ${h}
    </div>

    <div class="ov-card ov-goal">
      <div class="ov-goal-h">
        <div>
          <div class="ov-goal-t">🔥 ${c}-Day Streak
            ${c>=7?`<span class="ov-badge" style="color:#FFE66D;border-color:#FFE66D44;background:#FFE66D14">🏆 Week!</span>`:``}
            ${c>=30?`<span class="ov-badge" style="color:#C77DFF;border-color:#C77DFF44;background:#C77DFF14">🌟 Month!</span>`:``}
          </div>
          <div class="ov-goal-s">Study every day to keep your streak alive</div>
        </div>
        <div class="ov-goal-n">
          <b style="color:${d>=100?`#06D6A0`:`var(--gold,#FFE66D)`}">${u}h <span style="display:inline;font-size:14px;color:var(--text-5,#777);font-weight:600">/ ${l}h</span></b>
          <span>TODAY'S GOAL</span>
        </div>
      </div>
      <div class="ov-days">${p}</div>
      <div class="ov-gbar"><i style="width:${d}%"></i></div>
      <div class="ov-goal-f">
        <span>${d>=100?`✅ Goal reached!`:`Keep going…`}</span>
        <button class="ov-edit" onclick="(function(){const g=prompt('Set daily study goal (hours):','${l}');if(g&&!isNaN(g)&&parseFloat(g)>0){localStorage.setItem('st_dailyGoal',parseFloat(g));render();}})()">✏️ Edit goal</button>
      </div>
    </div>

    <div class="ov-sec"><h3>Subject Progress</h3></div>
    <div class="ov-grid">${f}</div>
  </div>`}function Zn(){let e=v(),t=e.find(e=>e.id===r.activeSubject);if(t||(t=e[0],t&&(r.activeSubject=t.id)),!t)return h.activeCourse===`cbse11`&&!h.cbse11Stream?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📗</div><div style="margin-bottom:8px">Select your Class 11 stream to load subjects.</div><button class="btn-gold" onclick="showCourseSelector('cbse_group','cbse11_group')" style="margin-top:16px;padding:10px 24px">🔬 Choose Stream</button></div>`:h.activeCourse===`cbse12`&&!h.cbse12Stream?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">🎓</div><div style="margin-bottom:8px">Select your Class 12 stream to load subjects.</div><button class="btn-gold" onclick="showCourseSelector('cbse_group','cbse12_group')" style="margin-top:16px;padding:10px 24px">🔬 Choose Stream</button></div>`:`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📚</div><div>No subjects found. Please select a course.</div><button class="btn-gold" onclick="showCourseSelector()" style="margin-top:16px;padding:10px 24px">🎯 Select Course</button></div>`;let n=T(t.id),i=v().map(e=>`<button class="st-chip ${e.id===r.activeSubject?`on`:``}" style="--c:${e.color}" onclick="setActiveSubject('${e.id}')"><span class="st-chip-ic">${e.icon}</span> ${y(e.name)}</button>`).join(``),a=w(O(t.id)),o=a===null?``:a<=3?`#FF6B35`:a<=7?`#FFE66D`:`#06D6A0`,s=t.units.map((e,n)=>{let i=e.topics.filter((n,i)=>r.progress[`${t.id}-${e.id}-${i}`]).length,a=e.topics.length,o=a?Math.round(i/a*100):0,s=e.topics.map((n,i)=>{let a=`${t.id}-${e.id}-${i}`,o=!!r.progress[a];return`<div class="st-topic ${o?`done`:``}" onclick="toggleTopic('${t.id}','${e.id}',${i})">
        <span class="st-cb">${o?`✓`:``}</span>
        <span class="st-tn">${y(n)}</span>
      </div>`}).join(``);return`<div class="st-unit" style="animation-delay:${Math.min(n,10)*.05}s">
      <div class="st-unit-h">
        <div class="st-unit-n">${y(e.name)}</div>
        <div class="st-unit-c">${i===a&&a?`<span class="float-anim" style="display:inline-block">🏆</span> `:``}${i}/${a}</div>
      </div>
      <div class="st-ubar"><i style="width:${o}%"></i></div>
      <div class="st-topics">${s}</div>
    </div>`}).join(``),c=``;if(t.formulas){let e=Object.keys(t.formulas),n=r[`formulaTab_`+t.id]||e[0],i=(t.formulas[n]||[]).map(e=>`
      <div style="display:flex;align-items:flex-start;gap:8px;padding:7px 10px;background:#0a0a14;border:1px solid #1e1e2e;border-radius:8px;margin-bottom:6px">
        <span style="color:${t.color};font-size:14px;flex-shrink:0;margin-top:1px">∫</span>
        <span style="font-size:12px;color:#d4c8a8;font-family:monospace;line-height:1.6">${y(e)}</span>
      </div>`).join(``),a=e.map(e=>`<button onclick="state['formulaTab_${t.id}']='${y(e)}';render()" style="background:${e===n?t.color:`#0a0a14`};color:${e===n?`#08080f`:`#666`};border:1px solid ${e===n?t.color:`#1e1e2e`};border-radius:20px;padding:5px 11px;font-size:10px;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all 0.2s">${y(e)}</button>`).join(``);c=`<div class="card" style="margin-top:14px;border-color:${t.color}33">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">🧮</span>
        <div style="font-size:14px;font-weight:bold;color:${t.color}">Key Formulas</div>
        <span style="font-size:10px;color:#444;background:#1a1a2a;padding:2px 8px;border-radius:10px">JEE Quick Reference</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${a}</div>
      ${i}
    </div>`}let u=``;if(t.ncert){let e=Object.keys(t.ncert),n=r[`ncertTab_`+t.id]||e[0],i=(t.ncert[n]||[]).map(e=>`
      <div style="display:flex;align-items:flex-start;gap:8px;padding:8px 10px;background:#0a0a14;border-left:2px solid ${t.color};border-radius:0 8px 8px 0;margin-bottom:6px">
        <span style="color:${t.color};font-size:13px;flex-shrink:0;margin-top:2px">📌</span>
        <span style="font-size:12px;color:#d4c8a8;line-height:1.65">${y(e)}</span>
      </div>`).join(``),a=e.map(e=>`<button onclick="state['ncertTab_${t.id}']='${y(e)}';render()" style="background:${e===n?t.color:`#0a0a14`};color:${e===n?`#08080f`:`#666`};border:1px solid ${e===n?t.color:`#1e1e2e`};border-radius:20px;padding:5px 11px;font-size:10px;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all 0.2s">${y(e)}</button>`).join(``);u=`<div class="card" style="margin-top:14px;border-color:${t.color}33">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">📖</span>
        <div style="font-size:14px;font-weight:bold;color:${t.color}">NCERT Important Lines</div>
        <span style="font-size:10px;color:#444;background:#1a1a2a;padding:2px 8px;border-radius:10px">High-Yield for NEET</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${a}</div>
      ${i}
    </div>`}return`<style>
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
</style><div class="st fade-in" style="--c:${t.color}">
    <div class="flex-wrap st-chips" style="margin-bottom:16px">${i}${h.activeCourse===`cbse11`?`<button onclick="showCourseSelector('cbse_group','cbse11_group')" style="background:#FFE66D22;border:1px solid #FFE66D44;color:#FFE66D;border-radius:20px;padding:6px 13px;font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s" title="Change stream">🔄 ${re[h.cbse11Stream]?.label?.split(`—`)[0]?.trim()||`Change Stream`}</button>`:``}${h.activeCourse===`cbse12`?`<button onclick="showCourseSelector('cbse_group','cbse12_group')" style="background:#FFE66D22;border:1px solid #FFE66D44;color:#FFE66D;border-radius:20px;padding:6px 13px;font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s" title="Change stream">🔄 ${l[h.cbse12Stream]?.label?.split(`—`)[0]?.trim()||`Change Stream`}</button>`:``}</div>
    <div class="st-head" style="--c:${t.color}">
      <div class="st-head-l">
        <div class="st-head-ic">${t.icon}</div>
        <div>
          <div class="st-head-n">${y(t.name)}</div>
          <div class="st-head-e">
            Exam
            <input type="date" value="${Ge(O(t.id))}" onchange="setExamDate('${t.id}', _isoToExamDate(this.value))" title="Set your exam date"/>
            ${a===null?``:`<b style="color:${o}">${a} days left</b>`}
          </div>
        </div>
      </div>
      <div class="st-head-r">
        <div class="st-head-p">${n}<small>%</small></div>
        <button class="st-add" onclick="state.newMat.subjectId='${t.id}';switchView('files');setTimeout(()=>showAddForm(),50)">+ Add Note</button>
      </div>
      <div class="st-bar"><i style="width:${n}%"></i></div>
    </div>
    ${s}
    ${c}
    ${u}
    <div class="card" style="margin-top:8px">
      <div class="section-label">📝 Quick Notes — ${y(t.name)}</div>
      <textarea rows="4" placeholder="Doubts, key points, formulas to remember..." oninput="saveSubjectNote('${t.id}',this.value)">${y(r.subjectNotes[t.id]||``)}</textarea>
    </div>
    <div class="card" style="margin-top:12px">
      <div style="font-size:14px;font-weight:bold;margin-bottom:4px">📂 Subject Resources</div>
      <div style="font-size:11px;color:#555;margin-bottom:16px">Question Papers · Notes · Study Materials · YouTube Playlists</div>
      ${Vn(t)}
    </div>
  </div>
  ${Hn()}
  ${Un()}
  `}function Qn(){let e=r.timerMode===`study`?1500:r.timerMode===`short`?300:900,t=r.timerSeconds/e,n=2*Math.PI*54,i=n*(1-t),a=Math.floor(r.timerSeconds/60),o=r.timerSeconds%60,s=typeof Notification<`u`&&Notification.permission===`granted`,c=r.alarms.length===0?`<div class="al-empty"><div style="font-size:44px;margin-bottom:8px">⏰</div><b>No alarms set yet</b><span>Create one above or add the 50 smart presets.</span></div>`:`<div class="al-list">${r.alarms.map(e=>`
      <div class="al-item ${e.enabled?`on`:``} alarm-item ${e.enabled?`active-alarm`:``}">
        <div class="al-ic">${e.enabled?`⏰`:`🔕`}</div>
        <div class="al-info">
          <div class="al-time">${y(e.time)}</div>
          <div class="al-lbl">${y(e.label)}${e.repeat?` · Repeats`:``}${e.ringtone?` · `+ar.find(t=>t.id===e.ringtone)?.name.split(` `)[0]:``}</div>
        </div>
        <button class="alarm-toggle ${e.enabled?`on`:``}" onclick="toggleAlarm('${e.id}')" title="${e.enabled?`Disable`:`Enable`}"></button>
        <button class="al-del" onclick="deleteAlarm('${e.id}')" title="Delete">🗑️</button>
      </div>`).join(``)}</div>`;return`<style>
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
</style><div class="al fade-in">
    <div class="al-h1">Alarms & Timer</div>
    <div class="al-h2">Focus sessions and daily study reminders.</div>

    <div class="al-top">
      <div class="al-card al-timer">
        <div class="al-lbl-s">🍅 POMODORO TIMER</div>
        <div class="al-seg">
          ${[[`study`,`25 min`,`🎯`],[`short`,`5 min`,`☕`],[`long`,`15 min`,`🧘`]].map(([e,t,n])=>`<button class="${r.timerMode===e?`on`:``}" onclick="setTimerMode('${e}')">${n} ${t}</button>`).join(``)}
        </div>
        <div class="al-ring">
          <svg width="170" height="170" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="54" fill="none" stroke="currentColor" style="color:color-mix(in srgb,var(--txt) 9%,transparent)" stroke-width="8"/>
            <circle id="timer-ring-fill" cx="70" cy="70" r="54" fill="none" stroke="#FF6B35" stroke-width="8"
              stroke-dasharray="${n}" stroke-dashoffset="${i}" stroke-linecap="round" class="timer-ring"/>
          </svg>
          <div class="al-ring-t">
            <div id="timer-display" style="${r.timerRunning?`animation:countdownPulse 1s ease-in-out infinite`:``}">${String(a).padStart(2,`0`)}:${String(o).padStart(2,`0`)}</div>
            <span>${r.timerMode===`study`?`FOCUS`:r.timerMode===`short`?`BREAK`:`LONG BREAK`}</span>
          </div>
        </div>
        <div class="al-btns">
          ${r.timerRunning?`<button class="al-btn" onclick="pauseTimer()">⏸ Pause</button>`:`<button class="al-btn p" onclick="startTimer()">▶ Start</button>`}
          <button class="al-btn" onclick="resetTimer(${e})">↺ Reset</button>
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
              ${ar.map(e=>`<option value="${e.id}" ${V===e.id?`selected`:``}>${e.name} — ${e.desc}</option>`).join(``)}
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
          })">${s?`✅ Notifications On`:`Enable`}</button>
      </div>
      <div class="al-card al-tile">
        <div><b style="color:var(--gold,#FFE66D)">⏰ 50 Smart Study Alarms</b><span>Ready-made daily schedule with Pomodoro, breaks &amp; bedtime</span></div>
        <button class="al-btn p" style="padding:10px 16px" onclick="if(confirm('Add 50 preset study alarms to your schedule?'))addPresetAlarms()">+ Add 50</button>
      </div>
    </div>

    <div class="al-sec"><h3>Your Alarms</h3><span class="al-count">${r.alarms.length}</span></div>
    ${c}

    <div style="margin-top:18px;text-align:center">
      <button class="al-btn" onclick="triggerAlarm({label:'Test Alarm',time:'Now'})">🔔 Test Alarm Sound</button>
    </div>
  </div>`}function $n(){let e=v(),t=p.map((e,t)=>`<button class="lg-mood ${r.mood===t?`sel`:``} mood-btn" onclick="setMood(${t})">${e}</button>`).join(``),n=e.map(e=>`<button class="lg-sub ${e.id===r.activeSubject?`on`:``}" style="--c:${e.color}" onclick="state.activeSubject='${e.id}';render()">${e.icon} ${y(e.name)}</button>`).join(``),i=Object.entries(r.studyLog).sort((e,t)=>t[0].localeCompare(e[0])),a=i.slice(0,14).map(([t,n],r)=>{let i=e.find(e=>e.id===n.subject);return`<div class="lg-item" style="--c:${i?.color||`#777`};animation-delay:${r*.04}s">
      <div class="lg-mo">${p[n.mood??3]}</div>
      <div style="flex:1;min-width:0">
        <b>${t===S()?`Today ✦`:t}</b>
        <span>${i?.icon||``} ${y(i?.name||`—`)}</span>
      </div>
      <div class="lg-h">${n.hours}<small>h</small></div>
    </div>`}).join(``);return`<style>
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
</style><div class="lg fade-in">
    <div class="lg-h1">📝 Daily Study Log</div>
    <div class="lg-h2">Track your mood and hours to build your streak.</div>

    <div class="lg-card">
      <div class="lg-lbl">HOW ARE YOU FEELING TODAY?</div>
      <div class="lg-moods">${t}</div>
      <div class="lg-ml">${s[r.mood]}</div>
    </div>

    <div class="lg-card">
      <div class="lg-lbl">HOURS STUDIED TODAY</div>
      <div class="lg-hours">
        <input type="range" min="0" max="12" step="0.5" value="${r.hoursToday}" oninput="setHours(this.value)"/>
        <span id="hours-display" class="lg-hv">${r.hoursToday}h</span>
      </div>
    </div>

    <div class="lg-card">
      <div class="lg-lbl">MAIN SUBJECT TODAY</div>
      <div class="lg-subs">${n}</div>
    </div>

    <button class="lg-save" onclick="logToday()">💾 Save Today's Log</button>

    <div class="lg-sec"><h3>Study History</h3></div>
    ${i.length===0?`<div class="lg-empty">No logs yet. Start studying! 💪</div>`:a}
  </div>`}typeof window<`u`&&Object.assign(window,{_doRender:Jn,_renderResolvers:qn,_renderTimer:Kn,render:B,renderAlarms:Qn,renderDashboard:Xn,renderLog:$n,renderSubjects:Zn,renderSync:Yn});function er(){let e=new Date,t=String(e.getHours()).padStart(2,`0`),n=String(e.getMinutes()).padStart(2,`0`),r=String(e.getSeconds()).padStart(2,`0`),i=document.getElementById(`live-clock`),a=document.getElementById(`live-date`);i&&(i.textContent=`${t}:${n}:${r}`),a&&(a.textContent=`${ee[e.getDay()]}, ${e.getDate()} ${ne[e.getMonth()]} ${e.getFullYear()}`)}var tr=``;function nr(){let e=new Date,t=`${String(e.getHours()).padStart(2,`0`)}:${String(e.getMinutes()).padStart(2,`0`)}`;if(t===tr)return;let n=e.getDay();r.alarms.forEach(e=>{e.enabled&&e.time===t&&(!e.repeat||e.days.length===0||e.days.includes(n))&&rr(e)}),tr=t}function rr(e){if(document.getElementById(`alarm-title`).textContent=e.label||`Study Time!`,document.getElementById(`alarm-msg`).textContent=`Alarm set for ${e.time}`,document.getElementById(`alarm-icon`).textContent=`⏰`,document.getElementById(`alarm-overlay`).classList.add(`show`),e.ringtone&&(V=e.ringtone),sr(),H(),Notification.permission===`granted`)try{new Notification(`⏰ `+(e.label||`Study Time!`),{body:`Alarm set for `+e.time+` · Exam Is Near`,icon:`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ctext y='52' font-size='52'%3E%E2%8F%B0%3C/text%3E%3C/svg%3E`,requireInteraction:!0})}catch{}}function ir(){document.getElementById(`alarm-overlay`).classList.remove(`show`),cr()}var ar=[{id:`classic`,name:`📯 Classic Bell`,desc:`Traditional double-beep`},{id:`digital`,name:`🔔 Digital Ring`,desc:`Sharp digital tone`},{id:`chime`,name:`🎵 Chime`,desc:`Soft melodic chime`},{id:`urgent`,name:`🚨 Urgent`,desc:`Fast warning beeps`},{id:`melody`,name:`🎶 Study Melody`,desc:`Motivating tune`},{id:`gentle`,name:`🌅 Gentle Wake`,desc:`Soft rising tone`},{id:`school`,name:`🏫 School Bell`,desc:`Classic school bell`},{id:`digital2`,name:`💻 Tech Alert`,desc:`Modern tech beep`},{id:`zen`,name:`🧘 Zen Bowl`,desc:`Singing bowl sound`},{id:`fanfare`,name:`🎺 Fanfare`,desc:`Achievement fanfare`},{id:`morning`,name:`🌄 Morning Bird`,desc:`Cheerful chirping`},{id:`piano`,name:`🎹 Piano Ding`,desc:`Soft piano notes`},{id:`retro`,name:`👾 Retro Game`,desc:`8-bit style beeps`},{id:`pulse`,name:`💓 Pulse`,desc:`Rhythmic heartbeat`},{id:`cosmic`,name:`🌌 Cosmic`,desc:`Space-like tones`}],V=localStorage.getItem(`st_ringtone`)||`classic`;function or(e){V=e,localStorage.setItem(`st_ringtone`,e),sr(),B()}function sr(){try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.currentTime;function r(n,r,i,a=`sine`,o=.4){let s=e.createOscillator(),c=e.createGain();s.connect(c),c.connect(e.destination),s.frequency.value=n,s.type=a,c.gain.setValueAtTime(0,t+r),c.gain.linearRampToValueAtTime(o,t+r+.05),c.gain.linearRampToValueAtTime(0,t+r+i),s.start(t+r),s.stop(t+r+i+.05)}function i(n,r,i,a,o=`sine`,s=.35){let c=e.createOscillator(),l=e.createGain();c.connect(l),l.connect(e.destination),c.type=o,c.frequency.setValueAtTime(n,t+i),c.frequency.linearRampToValueAtTime(r,t+i+a),l.gain.setValueAtTime(0,t+i),l.gain.linearRampToValueAtTime(s,t+i+.05),l.gain.linearRampToValueAtTime(0,t+i+a),c.start(t+i),c.stop(t+i+a+.05)}let a=V;if(a===`classic`)for(let e=0;e<5;e++)r(880,e*.5,.2),r(1100,e*.5+.22,.15);else if(a===`digital`)for(let e=0;e<10;e++)r(1200,e*.25,.1,`square`,.3);else if(a===`chime`)[523,659,784,1047,784,659,523].forEach((e,t)=>r(e,t*.18,.25,`sine`,.3));else if(a===`urgent`)for(let e=0;e<14;e++)r(e%2==0?900:1400,e*.18,.12,`sawtooth`,.25);else if(a===`melody`)[262,330,392,330,262,330,392,523].forEach((e,t)=>r(e,t*.22,.18,`sine`,.35));else if(a===`gentle`)for(let e=0;e<4;e++)i(300+e*80,400+e*100,e*.6,.5,`sine`,.25);else if(a===`school`)for(let e=0;e<3;e++)r(800,e*.7,.05,`square`,.4),i(800,600,e*.7+.05,.55,`sine`,.35);else if(a===`digital2`)for(let e=0;e<4;e++)[600,900,1200].forEach((t,n)=>r(t,e*.45+n*.1,.08,`square`,.25));else if(a===`zen`)i(220,440,0,.3,`sine`,.15),i(440,880,.3,.5,`sine`,.12),i(880,440,.8,1.2,`sine`,.08);else if(a===`fanfare`)[392,523,659,784,659,523,392,784].forEach((e,t)=>r(e,t*.15,.12,`square`,.3)),r(1047,1.2,.5,`sine`,.35);else if(a===`morning`)[0,.2,.4,.7,.9,1.1].forEach(e=>{i(800,1200,e,.08),i(1200,900,e+.08,.06)});else if(a===`piano`)[262,294,330,349,392,440,494,523].forEach((e,t)=>{r(e,t*.2,.3,`sine`,.3),r(e*2,t*.2,.15,`sine`,.08)});else if(a===`retro`)[200,400,300,500,400,600,500,700,800].forEach((e,t)=>r(e,t*.12,.1,`square`,.2));else if(a===`pulse`)for(let e=0;e<8;e++)r(440,e*.35,.1,`sine`,.35),r(660,e*.35+.12,.08,`sine`,.2);else if(a===`cosmic`)i(100,800,0,1.5,`sine`,.2),i(800,200,1.5,1,`sine`,.15),[300,600,900,1200].forEach((e,t)=>r(e,t*.5,.3,`sine`,.1));else for(let e=0;e<6;e++)r(880,e*.4,.25),r(1100,e*.4+.25,.15);n.activeAlarmAudio=e}catch{}}function cr(){try{n.activeAlarmAudio&&n.activeAlarmAudio.close()}catch{}n.activeAlarmAudio=null}function H(){let e=[`⭐`,`✨`,`🌟`,`💫`,`🎯`,`📚`];for(let t=0;t<12;t++)setTimeout(()=>{let t=document.createElement(`div`);t.className=`star`,t.textContent=e[Math.floor(Math.random()*e.length)],t.style.left=Math.random()*100+`vw`,t.style.top=Math.random()*60+20+`vh`,t.style.fontSize=16+Math.random()*16+`px`,t.style.animationDuration=.8+Math.random()*.6+`s`,document.body.appendChild(t),setTimeout(()=>t.remove(),1400)},t*80)}function lr(){n.timerInterval||(r.timerRunning=!0,n.timerInterval=setInterval(()=>{r.timerSeconds>0?(r.timerSeconds--,U()):(clearInterval(n.timerInterval),n.timerInterval=null,r.timerRunning=!1,b(`🎉 Session complete!`,`success`),H(),sr(),setTimeout(cr,3e3))},1e3),U())}function ur(){clearInterval(n.timerInterval),n.timerInterval=null,r.timerRunning=!1,U()}function dr(e){clearInterval(n.timerInterval),n.timerInterval=null,r.timerRunning=!1,r.timerSeconds=e||1500,U()}function U(){let e=Math.floor(r.timerSeconds/60),t=r.timerSeconds%60,n=document.getElementById(`timer-display`);n&&(n.textContent=`${String(e).padStart(2,`0`)}:${String(t).padStart(2,`0`)}`);let i=r.timerMode===`study`?1500:r.timerMode===`short`?300:900,a=r.timerSeconds/i,o=2*Math.PI*54,s=document.getElementById(`timer-ring-fill`);s&&(s.style.strokeDashoffset=o*(1-a)),r.timerRunning&&n?document.title=`⏱ ${String(e).padStart(2,`0`)}:${String(t).padStart(2,`0`)} — Exam Is Near`:document.title=`Exam Is Near — Study Smart | by ArkSetu`}typeof window<`u`&&Object.assign(window,{RINGTONES:ar,_lastAlarmCheck:tr,checkAlarms:nr,dismissAlarm:ir,pauseTimer:ur,playAlarmSound:sr,resetTimer:dr,selectedRingtone:V,setRingtone:or,spawnStars:H,startTimer:lr,stopAlarmSound:cr,triggerAlarm:rr,updateClock:er,updateTimerDisplay:U});var fr=149,W=null;function pr(){W=null;let e=document.getElementById(`pm-coupon-msg`);e&&(e.textContent=``,e.style.color=``),document.getElementById(`pm-monthly-label`).innerHTML=`⭐ Get Pro — ₹149/month →`,document.getElementById(`pm-annual-label`).innerHTML=`🏆 Annual Plan — ₹999/year &nbsp;·&nbsp; Save ₹792`}function G(){pr();let e=document.getElementById(`pm-coupon-input`);e&&(e.value=``),document.getElementById(`pro-upgrade-modal`).classList.add(`show`),document.body.style.overflow=`hidden`}async function mr(){let e=document.getElementById(`pm-coupon-input`),t=document.getElementById(`pm-coupon-btn`),r=document.getElementById(`pm-coupon-msg`),i=(e?.value||``).trim().toUpperCase();if(!i){r.textContent=`⚠️ Enter a coupon code`,r.style.color=`#FFE66D`;return}if(!n.currentUser){r.textContent=`⚠️ Please sign in first to apply a coupon.`,r.style.color=`#FFE66D`;return}t.textContent=`Checking…`,t.disabled=!0,r.textContent=``,r.style.color=``;try{let e=await n.currentUser.getIdToken(!0),a=await fetch(q.activateTrial,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+e},body:JSON.stringify({data:{uid:n.currentUser.uid,couponCode:i,plan:`monthly`,validateOnly:!0}})});if(!a.ok)throw Error(`Server error (`+a.status+`). Please try again.`);let o=await a.json(),s=o.result||o;if(!s.success&&!s.discount){r.textContent=`❌ `+(s.message||`Invalid or expired coupon code.`),r.style.color=`#ff6b6b`,W=null,t.textContent=`Apply`,t.disabled=!1,s.alreadyPro&&(Q(),Z());return}let c=s.discount||100;if(W={code:i,discount:c,id:s.couponId||i},s.success&&s.expiresAt&&!s.validateOnly){J={isPro:!0,expiresAt:s.expiresAt,checkedAt:Date.now(),planType:`monthly`},localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:s.expiresAt,cachedAt:Date.now(),planType:`monthly`})),r.textContent=`🎉 100% coupon applied! Pro activated.`,r.style.color=`#06D6A0`,t.textContent=`Activated ✓`,t.style.color=`#06D6A0`,t.disabled=!1,H(),X(),Q(),Z(),B();return}let l=Math.round(14900*(1-c/100)),u=Math.round(99900*(1-c/100)),d=`₹`+(l/100).toLocaleString(`en-IN`),f=`₹`+(u/100).toLocaleString(`en-IN`);r.textContent=`✅ ${c}% off applied! Prices updated below.`,r.style.color=`#06D6A0`,document.getElementById(`pm-monthly-label`).innerHTML=`⭐ Get Pro — <s style="opacity:0.5">₹149</s> ${d}/month →`,document.getElementById(`pm-annual-label`).innerHTML=`🏆 Annual Plan — <s style="opacity:0.5">₹999</s> ${f}/year`,t.textContent=`Applied ✓`,t.style.color=`#06D6A0`,t.disabled=!1}catch(e){console.error(`[EIN] Coupon validation error:`,e),r.textContent=`⚠️ Error: `+(e.message||String(e)),r.style.color=`#FFE66D`,t.textContent=`Apply`,t.disabled=!1}}var K=`ein_pro_cache`,q={checkProStatus:`https://exam-is-near.vercel.app/api/check-pro-status`,createOrder:`https://exam-is-near.vercel.app/api/create-order`,verifyPayment:`https://exam-is-near.vercel.app/api/verify-payment`,activateTrial:`https://exam-is-near.vercel.app/api/activate-trial`},hr=`https://exam-is-near.vercel.app/api`,J=null;async function Y({forceRefresh:e=!1}={}){if(!e&&J&&J.checkedAt&&Date.now()-J.checkedAt<3e5)return J.isPro;if(!n.currentUser){try{let e=JSON.parse(localStorage.getItem(`ein_pro_cache`)||`null`);if(e&&e.active===!0&&typeof e.expiresAt==`number`&&e.expiresAt>Date.now())return J={isPro:!0,expiresAt:e.expiresAt,checkedAt:Date.now(),planType:e.planType||`monthly`},!0}catch{}return J={isPro:!1,expiresAt:0,checkedAt:Date.now()},!1}try{let t=await n.currentUser.getIdToken(e),r=await fetch(q.checkProStatus,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+t},body:JSON.stringify({data:{}})});if(!r.ok)throw Error(`Server returned `+r.status);let i=await r.json(),a=i.result||i,o=!!a.isPro;if(J={isPro:o,expiresAt:a.expiresAt||0,checkedAt:Date.now(),planType:a.planType||`monthly`},o)m._proStatusCache=!0,localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:a.expiresAt,cachedAt:Date.now(),planType:a.planType||`monthly`}));else{m._proStatusCache=!1;let e=JSON.parse(localStorage.getItem(`ein_pro_cache`)||`null`);e&&e.active&&(console.warn(`[EIN] Pro tamper detected: localStorage claimed Pro but server denied. Purging.`),localStorage.removeItem(K))}return o}catch(e){console.warn(`[EIN] Pro check network error, using local fallback:`,e.message);try{let e=JSON.parse(localStorage.getItem(`ein_pro_cache`)||`null`);if(e&&e.cachedAt&&Date.now()-e.cachedAt<36e5&&e.active===!0&&typeof e.expiresAt==`number`&&e.expiresAt>Date.now())return J={isPro:!0,expiresAt:e.expiresAt,checkedAt:Date.now()-24e4,planType:e.planType||`monthly`},!0}catch{}return J={isPro:!1,expiresAt:0,checkedAt:Date.now()},!1}}async function gr(e){if(!n.currentUser)throw Error(`sign_in_required`);if(!await Y({forceRefresh:!0}))throw Error(`pro_required:`+e);return!0}function X(){document.getElementById(`pro-upgrade-modal`).classList.remove(`show`),document.body.style.overflow=``}document.addEventListener(`DOMContentLoaded`,()=>{let e=document.getElementById(`pro-upgrade-modal`);e&&e.addEventListener(`click`,e=>{e.target===e.currentTarget&&X()})});async function _r(e){return await Y()?!0:(G(),e&&b(`⭐ `+e+` requires Pro`,`info`),!1)}async function vr(){return typeof Razorpay<`u`||new Promise((e,t)=>{let n=document.createElement(`script`);n.src=`https://checkout.razorpay.com/v1/checkout.js`,n.onload=()=>e(!0),n.onerror=()=>t(Error(`Failed to load payment gateway`)),document.head.appendChild(n)})}async function yr(e){b(`🔄 Activating coupon...`,`info`);try{let t=await n.currentUser.getIdToken(!0),r=await fetch(q.activateTrial,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+t},body:JSON.stringify({data:{uid:n.currentUser.uid,couponCode:W?.code||``,plan:e}})});if(!r.ok)throw Error(`Activation failed (`+r.status+`)`);let i=await r.json(),a=i.result||i;if(!a.success)throw Error(a.message||`Activation declined`);J={isPro:!0,expiresAt:a.expiresAt,checkedAt:Date.now(),planType:e},localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:a.expiresAt,cachedAt:Date.now(),planType:e})),b(`🎉 100% coupon applied! Pro activated for free.`,`success`),H(),H(),X(),Q(),Z(),B()}catch(e){b(`❌ Coupon activation failed: `+(e.message||`Please try again`),`alarm`),console.error(`[EIN] Free coupon activation error:`,e),/already have an active Pro subscription/i.test(e.message||``)&&await Y({forceRefresh:!0})&&(Q(),Z(),B())}}async function br(){if(!n.currentUser){b(`🔐 Please sign in with Google first`,`info`),o();return}if(await Y()){b(`⭐ You're already on Pro!`,`success`),X();return}let e=W?W.discount:0;if(e>=100){await yr(`monthly`);return}try{await vr()}catch{b(`❌ Could not load payment gateway. Check your internet.`,`alarm`);return}await Cr({plan:`monthly`,amount:Math.round(14900*(1-e/100)),description:`Pro Plan — 1 Month`,couponCode:W?.code||null})}async function xr(){if(!n.currentUser){b(`🔐 Please sign in with Google first`,`info`),o();return}if(await Y()){b(`⭐ You're already on Pro!`,`success`),X();return}let e=W?W.discount:0;if(e>=100){await yr(`annual`);return}try{await vr()}catch{b(`❌ Could not load payment gateway. Check your internet.`,`alarm`);return}await Cr({plan:`annual`,amount:Math.round(99900*(1-e/100)),description:`Pro Annual Plan — ₹999/year`,couponCode:W?.code||null})}async function Sr(){if(!n.currentUser){b(`🔐 Please sign in with Google first to start your trial`,`info`),o();return}if(await Y()){b(`⭐ You're already on Pro!`,`success`),X();return}b(`🔄 Activating trial...`,`info`);try{let e=await n.currentUser.getIdToken(!0),t=await fetch(q.activateTrial,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+e},body:JSON.stringify({data:{uid:n.currentUser.uid}})});if(!t.ok)throw Error(`Trial activation failed (`+t.status+`)`);let r=await t.json(),i=r.result||r;if(!i.success)throw Error(i.message||`Trial activation declined`);J={isPro:!0,expiresAt:i.expiresAt,checkedAt:Date.now(),planType:`trial`},localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:i.expiresAt,cachedAt:Date.now(),planType:`trial`})),b(`🎁 7-day Pro trial activated! Enjoy all features.`,`success`),H(),X(),Q(),Z(),B()}catch(e){b(`❌ Trial activation failed: `+(e.message||`Please try again`),`alarm`),console.error(`[EIN] Trial activation error:`,e),/already have an active Pro subscription/i.test(e.message||``)&&await Y({forceRefresh:!0})&&(Q(),Z(),B())}}async function Cr({plan:e,amount:t,description:r,couponCode:i=null}){let a=document.getElementById(`pm-monthly-btn`),o=a?a.innerHTML:``;a&&(a.disabled=!0,a.innerHTML=`⏳ Creating order...`,a.style.opacity=`0.7`);let s;try{let r=await n.currentUser.getIdToken(!0),a=await(await fetch(q.createOrder,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+r},body:JSON.stringify({data:{email:n.currentUser.email||``,name:n.currentUser.displayName||``,plan:e,amount:t,couponCode:i}})})).json();if(a.error){let e=typeof a.error==`string`?a.error:a.error.message||a.error.description||JSON.stringify(a.error);throw Error(e||`Order creation failed`)}s=a.result||a}catch(e){b(`❌ `+(e.message||`Order creation failed`),`alarm`),a&&(a.disabled=!1,a.innerHTML=o,a.style.opacity=`1`);return}if(a&&(a.disabled=!1,a.innerHTML=o,a.style.opacity=`1`),s.zeroCost){J={isPro:!0,expiresAt:s.expiresAt,checkedAt:Date.now(),planType:e},localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:s.expiresAt,cachedAt:Date.now(),planType:e})),b(`🎉 100% coupon applied! Pro activated — ₹0 charged.`,`success`),H(),H(),X(),Q(),Z(),B();return}let c={key:s.keyId,amount:s.amount||t,currency:s.currency||`INR`,order_id:s.orderId,name:`Exam Is Near`,description:r,image:`https://exam-is-near.web.app/assets/icons/icon-192.png`,prefill:{name:n.currentUser.displayName||``,email:n.currentUser.email||``},notes:{uid:n.currentUser.uid,plan:e},theme:{color:`#FFE66D`},handler:async function(t){await wr(t,e,i)},modal:{ondismiss:()=>{b(`Payment cancelled`,`info`)}}};try{let e=new Razorpay(c);e.on(`payment.failed`,e=>{b(`⚠️ Payment failed: `+e.error.description,`alarm`)}),e.open()}catch(e){b(`❌ Could not open payment window: `+e.message,`alarm`)}}async function wr(e,t,r=null){b(`🔄 Verifying payment...`,`info`);try{let i=await n.currentUser.getIdToken(!0),a=await(await fetch(q.verifyPayment,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+i},body:JSON.stringify({data:{orderId:e.razorpay_order_id,paymentId:e.razorpay_payment_id,signature:e.razorpay_signature,plan:t,couponCode:r||null}})})).json(),o=a.result||a;if(o.success)J={isPro:!0,expiresAt:o.expiresAt,checkedAt:Date.now(),planType:t},localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:o.expiresAt,cachedAt:Date.now(),planType:t})),b(t===`annual`?`🎉 Welcome to Pro Annual! You saved ₹792!`:`🎉 Welcome to Pro! All features unlocked.`,`success`),H(),H(),X(),Q(),Z(),B();else throw Error(o.message||`Verification returned false`)}catch(t){let n=e.razorpay_payment_id;b(`⚠️ Verification error. Save this ID and contact support: `+n,`alarm`),console.error(`[EIN] Payment verify failed:`,t,`Payment ID:`,n)}}function Z(){let e=document.getElementById(`ad-unit-bottom`);e&&(e.style.display=`none`)}async function Q(){let e=await Y({forceRefresh:!0});[`pro-header-badge`,`go-pro-header-btn`].forEach(e=>{let t=document.getElementById(e);t&&t.remove()});let t=document.getElementById(`sync-badge`);if(t&&t.parentNode){if(e){let e=document.createElement(`div`);e.id=`pro-header-badge`,e.className=`pro-badge`,e.style.cssText=`margin-top:5px;cursor:default`,e.innerHTML=`⭐ PRO MEMBER`,e.title=`You have an active Pro subscription — verified server-side`,t.parentNode.insertBefore(e,t.nextSibling)}else{let e=document.createElement(`button`);e.id=`go-pro-header-btn`,e.style.cssText=`margin-top:5px;background:linear-gradient(135deg,#1a1200,#120e00);border:1px solid #FFE66D33;border-radius:12px;color:#FFE66D;padding:4px 11px;font-size:10px;font-family:'Inter',inherit;cursor:pointer;font-weight:700;letter-spacing:0.5px;display:block;transition:all 0.2s`,e.innerHTML=`⭐ Go Pro · ₹149/mo`,e.onclick=G,e.onmouseover=()=>{e.style.borderColor=`#FFE66D66`,e.style.background=`linear-gradient(135deg,#201800,#181000)`},e.onmouseout=()=>{e.style.borderColor=`#FFE66D33`,e.style.background=`linear-gradient(135deg,#1a1200,#120e00)`},t.parentNode.insertBefore(e,t.nextSibling)}}}setTimeout(Q,1200),typeof window<`u`&&Object.assign(window,{CF_BASE:hr,CF_URLS:q,PRO_KEY:K,PRO_PRICE_INR:149,_activateFreeCoupon:yr,_activeCoupon:W,_hideAdsForPro:Z,_launchRazorpay:Cr,_loadRazorpay:vr,_proCache:J,_resetCouponState:pr,_updateProHeaderUI:Q,_verifyAndGrantPro:wr,applyCouponCode:mr,closeProModal:X,initiateProPayment:br,initiateTrialPayment:Sr,initiateYearlyPayment:xr,isProUser:Y,openProModal:G,requirePro:_r,verifyProOrThrow:gr});var $={},Tr=`https://exam-is-near.vercel.app/api/groq-proxy`,Er=`llama-3.3-70b-versatile`;$.aiHistory=[];var Dr=5,Or=3,kr=()=>new Date().toISOString().split(`T`)[0];function Ar(e){try{let t=JSON.parse(localStorage.getItem(e)||`null`);if(t&&t.day===kr())return t.count}catch{}return 0}function jr(e){let t=kr();try{let n=JSON.parse(localStorage.getItem(e)||`null`),r=(n&&n.day===t?n.count:0)+1;return localStorage.setItem(e,JSON.stringify({day:t,count:r})),r}catch{return 1}}var Mr=Ar(`ein_free_ai_day`);$.freeQuizCount=Ar(`ein_free_quiz_day`);var Nr=`ein_ai_chat_history`,Pr=120;async function Fr(){try{if(!await Y())return;let e=localStorage.getItem(Nr);if(e){let t=JSON.parse(e);Array.isArray(t)&&t.length>0&&($.aiHistory=t,Vr())}}catch{}}async function Ir(){try{if(!await Y())return;let e=$.aiHistory.slice(-120);localStorage.setItem(Nr,JSON.stringify(e))}catch{}}async function Lr(e,t=!1,r=null){try{let i=await Y();m._proStatusCache=i;let a=t?6e3:i?3e3:800,o=t?`You are an expert JEE/NEET/competitive exam question generator trained on NTA-level content. Respond ONLY with a valid raw JSON array. No markdown, no backticks, no preamble, no explanation. Start your response with [ and end with ]. Each question must be challenging, application-based, and exam-ready — never trivial. Include numerical problems, assertion-reasoning, multi-concept questions, and common exam traps. Always provide a concise explanation field.`:r||(i?`You are an expert AI study tutor. Give thorough, deeply explained answers with examples, mnemonics, and exam tips. Use **bold** for key terms, bullet points for lists, numbered steps for procedures. End with an encouraging line.`:`You are a concise study assistant. Answer clearly and briefly.`),s={"Content-Type":`application/json`},c=n.currentUser;if(!c&&n.auth)try{c=await new Promise(e=>{let t=n.auth.onAuthStateChanged(n=>{t(),e(n)});setTimeout(()=>e(null),3e3)})}catch{}if(c)try{s.Authorization=`Bearer `+await c.getIdToken()}catch{}let l=await fetch(Tr,{method:`POST`,headers:s,body:JSON.stringify({model:Er,max_tokens:a,messages:[{role:`system`,content:o},{role:`user`,content:e}],temperature:t?.1:i?.65:.7})});if(!l.ok){let e=await l.text().catch(()=>``);return`⚠️ AI Error `+l.status+(e?`: `+e.slice(0,120):``)}return(await l.json()).choices[0]?.message?.content||`No response.`}catch(e){return`⚠️ Network error: `+e.message}}function Rr(e){let t=un()[e];if(!t)return;let n=document.getElementById(`ai-input`);n&&(n.value=t.prompt,n.style.height=`auto`,n.style.height=Math.min(n.scrollHeight,120)+`px`,Br())}function zr(e){let t=dn()[e];if(!t)return;let n=document.getElementById(`ai-input`);n&&(n.value=`Tell me about `+t.title,Br())}async function Br(){let e=document.getElementById(`ai-input`);if(!e)return;let t=e.value.trim();if(!t||m.aiTyping)return;if(!await Y()){if(Mr>=5){b(`⭐ Free limit reached (5 messages). Upgrade to Pro for unlimited AI chat!`,`alarm`),G();return}Mr=jr(`ein_free_ai_day`)}if(e.value=``,e.style.height=`auto`,!F._aiActiveSession){let e=`sess_`+Date.now();F._aiActiveSession=e,R(),I.unshift({id:e,title:`New chat`,ts:Date.now(),messages:[]}),z()}m.aiTyping=!0,$.aiHistory.push({role:`user`,text:t,ts:Date.now()}),$.aiHistory.push({role:`ai`,text:`⏳ Thinking…`,ts:Date.now()}),Vr();let n=document.getElementById(`ai-chat-box`);n&&(n.scrollTop=n.scrollHeight);let r=document.getElementById(`ai-subject-ctx`)?.value||`all`,i=r===`all`?`all subjects`:v().find(e=>e.id===r)?.name||r,a=v().map(e=>e.name).join(`, `),o=v().map(e=>e.name+`:`+T(e.id)+`%`).join(`, `),s=h.activeCourse===`neet`?`NEET UG aspirant`:h.activeCourse===`jee`?`JEE (Mains & Advanced) aspirant`:h.activeCourse===`nfsu`?`B.Sc. LL.B. student at NFSU`:h.activeCourse===`nfsu1`?`B.Sc. LL.B. (Hons.) Sem I student at NFSU`:h.activeCourse===`nfsu3`?`B.Sc. LL.B. Sem III student at NFSU`:h.activeCourse===`cbse10`?`CBSE Class 10 student`:h.activeCourse===`cbse11`?`CBSE Class 11 `+(re[h.cbse11Stream]?.label?.split(`—`)[1]?.trim()||`student`)+` student`:h.activeCourse===`cbse12`?`CBSE Class 12 `+(l[h.cbse12Stream]?.label?.split(`—`)[1]?.trim()||`student`)+` student`:`student`,c=h.activeCourse===`neet`?` Focus on Biology, Physics, Chemistry NCERT concepts.`:h.activeCourse===`jee`?` Focus on Maths, Physics, Chemistry problem solving and formulas.`:h.activeCourse===`nfsu`?` Focus on law, technology, and forensic science subjects.`:h.activeCourse===`nfsu1`?` Focus on NFSU Sem I subjects: Legal Methods, Law of Tort and Consumer Protection Laws, Law and Literature, Fundamentals of Computer Organization & Embedded Systems, Basic Programming Concepts Using C, and Discrete Mathematics.`:h.activeCourse===`nfsu3`?` Focus on NFSU Sem III subjects: Law of Crimes I (IPC), Constitutional Law I, Law of Contract I, Family Law I, Web Programming (HTML, JS, PHP, MySQL), and Operating System Concepts (Linux, memory, processes).`:h.activeCourse===`cbse10`?` Focus on CBSE Class 10 curriculum — Maths, Science, English, Social Science.`:h.activeCourse===`cbse11`?` Focus on CBSE Class 11 curriculum for `+(re[h.cbse11Stream]?.desc||`the selected stream`)+`. Give NCERT-focused answers.`:h.activeCourse===`cbse12`?` Focus on CBSE Class 12 board exam for `+(l[h.cbse12Stream]?.desc||`the selected stream`)+`. Give NCERT-focused answers.`:``,u=await Lr(t,!1,`You are an expert AI study tutor for a ${s}. Subjects: ${a}. Exams start in ${w(O(v()[0]?.id)||``)||`a few`} days. Student progress: ${o}. Hours studied: ${E()}h. Current focus: ${i}.${c}\nRules: Be concise yet thorough. Use **bold** for key terms. Use bullet points for lists. Use \`code\` for code snippets. Use numbered steps for procedures. Always end with a 1-line encouragement.`);m.aiTyping=!1,$.aiHistory[$.aiHistory.length-1]={role:`ai`,text:u},$.aiHistory[$.aiHistory.length-1].ts=Date.now(),Vr(),bn(),Ir(),n&&(n.scrollTop=n.scrollHeight)}function Vr(){let e=document.getElementById(`ai-chat-box`);if(!e)return;if($.aiHistory.length===0){B();return}$.aiHistory[$.aiHistory.length-1],$.aiHistory.length-1,e.innerHTML=$.aiHistory.map((e,t)=>Dn(e,t)).join(``);let t=document.getElementById(`ai-send-btn`);t&&(t.disabled=m.aiTyping),document.querySelectorAll(`.ai-dot,.ai-model-dot`).forEach(e=>{e.className=(e.classList.contains(`ai-model-dot`)?`ai-model-dot`:`ai-dot`)+(m.aiTyping?` thinking`:``)});let n=document.querySelector(`.ai-topbar-title`);n&&$.aiHistory.length>0&&(n.textContent=gn($.aiHistory))}async function Hr(e,t){let n=parseInt(t)||15;b(`🧠 Generating `+n+`-question quiz…`,`info`);let r=h.activeCourse===`jee`,i=h.activeCourse===`neet`,a=h.activeCourse===`cbse10`,o=h.activeCourse===`cbse12`,s=i?`NEET UG (NTA)`:r?`JEE Mains & Advanced (NTA)`:a?`CBSE Class 10 board exam`:o?`CBSE Class 12 board exam`:`university entrance exam`,c=(e=>[...e].sort(()=>Math.random()-.5))(r||i?[`numerical/calculation-based (require substituting values and computing)`,`assertion-reasoning (Statement I & Statement II pattern, NTA format)`,`application-based (multi-concept, requires analysis not just recall)`,`exception/odd-one-out (test conceptual clarity)`,`match the column / statement-based`,`graph/data interpretation (describe a graph scenario in text)`,`common exam traps and misconceptions students get wrong`,`NCERT exemplar difficulty level`,`previous year JEE/NEET pattern questions`,`conceptual (why/how — not definition-based)`]:[`NCERT textbook application`,`value-based`,`case study based`,`graph and diagram interpretation`,`assertion-reasoning`,`multi-step problems`]).slice(0,3).join(`; `),l=await Lr(`Generate exactly ${n} unique, high-quality multiple-choice questions on the topic: "${e}" for ${s} aspirants.

DIFFICULTY: ${r||i?`25% easy (confidence builders), 50% medium (application), 25% hard (advanced multi-step)`:`40% easy, 40% medium, 20% hard`}
QUESTION TYPES TO INCLUDE: ${c}
STYLE RULES:
- Questions must be exam-level: no trivial definitions, no direct NCERT lifts unless twisted with application
- Include numerical problems where relevant (give values in the question, compute answer in options)
- Options must be plausible distractors — avoid obviously wrong choices
- Cover different aspects of the topic — do not repeat similar concepts
- For NEET: prioritise Biology (60%), Physics (20%), Chemistry (20%) weighting if topic spans multiple subjects
- For JEE: include formula derivation, dimensional analysis, and multi-step reasoning
- Each explanation must be ≤ 2 sentences, sharp, pointing out WHY the wrong options fail

OUTPUT FORMAT — ONLY a raw JSON array, nothing else:
[{"q":"question text","options":["A. ...","B. ...","C. ...","D. ..."],"answer":0,"explanation":"Why correct + why distractors fail","difficulty":"easy|medium|hard"}]
where "answer" is 0-based index of correct option.
Output all ${n} questions. Do not truncate.`,!0);if(!l||typeof l!=`string`||l.startsWith(`⚠️`)||l.startsWith(`No response`))return b(`⚠️ Quiz generation failed: `+(l||`No response`),`alarm`),null;try{let e=l.replace(/```json|```/gi,``).trim().match(/\[[\s\S]*\]/);if(!e)return null;let t=JSON.parse(e[0]);if(!Array.isArray(t)||t.length===0)return null;let r=t.filter(e=>e.q&&Array.isArray(e.options)&&e.options.length>=2&&typeof e.answer==`number`);return r.length===0?null:r.sort(()=>Math.random()-.5).slice(0,n)}catch{return b(`⚠️ Could not parse quiz response. Try again.`,`alarm`),null}}typeof window<`u`&&Object.assign(window,{AI_HISTORY_KEY:Nr,AI_HISTORY_MAX:120,FREE_AI_MSG_LIMIT:5,FREE_QUIZ_LIMIT:3,GROQ_MODEL:Er,GROQ_PROXY_URL:Tr,_freeCounterDay:kr,_incDailyCounter:jr,_initDailyCounter:Ar,askAI:Lr,freeAiMsgCount:Mr,generateQuizFromAI:Hr,loadAIChatHistory:Fr,renderAIChat:Vr,saveAIChatHistory:Ir,sendAIMessage:Br,setQuickPrompt:Rr,setWelcomePrompt:zr});function Ur(){let e=document.getElementById(`mobile-nav-drawer`);e&&(e.classList.add(`open`),document.body.style.overflow=`hidden`),e.querySelectorAll(`.nav-drawer-pill`).forEach(e=>{e.classList.toggle(`active`,e.onclick&&e.onclick.toString().includes(`switchView('`+r.view+`')`))});let n=document.getElementById(`mobile-neetjee-btn`);n&&(n.style.display=h.activeCourse&&h.activeCourse!==`nfsu`&&h.activeCourse!==`cbse10`&&h.activeCourse!==`cbse12`?``:`none`);let i=document.getElementById(`mobile-admin-btn`);i&&(i.style.display=t()?``:`none`)}function Wr(){let e=document.getElementById(`mobile-nav-drawer`);e&&(e.classList.remove(`open`),document.body.style.overflow=``)}document.addEventListener(`keydown`,e=>{if(e.target.tagName===`INPUT`||e.target.tagName===`TEXTAREA`||e.target.tagName===`SELECT`||(r.view===`pomodoro`&&(e.key===` `&&(e.preventDefault(),A.running?Ot():Et()),e.key.toLowerCase()===`r`&&!e.ctrlKey&&(e.preventDefault(),kt())),e.ctrlKey||e.metaKey))return;let t={1:`dashboard`,2:`subjects`,3:`alarms`,4:`pomodoro`,5:`flashcards`,6:`quiz`,7:`ai`,8:`analytics`,l:`log`,f:`files`,s:`sync`};t[e.key]&&!e.shiftKey&&(e.preventDefault(),Xe(t[e.key])),e.key===`?`&&e.shiftKey&&(e.preventDefault(),Gr())});function Gr(){let e=document.getElementById(`kbd-shortcuts-modal`);if(e){e.remove();return}let t=document.createElement(`div`);t.id=`kbd-shortcuts-modal`,t.style.cssText=`position:fixed;inset:0;background:#00000088;z-index:9996;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)`,t.innerHTML=`<div style="background:#0f0f18;border:1px solid #2a2a3a;border-radius:16px;padding:24px;max-width:480px;width:92%;max-height:80vh;overflow-y:auto;animation:fadeInUp 0.2s ease">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="font-size:16px;font-weight:bold;color:#EDE8E0">⌨️ Keyboard Shortcuts</div>
      <button onclick="document.getElementById('kbd-shortcuts-modal').remove()" style="background:none;border:none;color:#666;font-size:18px;cursor:pointer">✕</button>
    </div>
    <div style="font-size:11px;color:#444;letter-spacing:1px;margin-bottom:12px;text-transform:uppercase">Navigation</div>
    ${[[`1`,`Overview / Dashboard`],[`2`,`Study Subjects`],[`3`,`Alarms & Timer`],[`4`,`Pomodoro`],[`5`,`Flashcards`],[`6`,`Quiz Mode`],[`7`,`AI Assistant`],[`8`,`Analytics`],[`L`,`Study Log`],[`F`,`Files`],[`S`,`Sync & Account`]].map(([e,t])=>`<div class="kbd-shortcut"><span>${t}</span><kbd class="kbd-key">${e}</kbd></div>`).join(``)}
    <div style="font-size:11px;color:#444;letter-spacing:1px;margin:12px 0;text-transform:uppercase">Pomodoro (when on timer page)</div>
    ${[[`Space`,`Start / Pause`],[`R`,`Reset timer`]].map(([e,t])=>`<div class="kbd-shortcut"><span>${t}</span><kbd class="kbd-key">${e}</kbd></div>`).join(``)}
    <div class="kbd-shortcut" style="margin-top:8px;border-top:1px solid #111;padding-top:10px"><span>Show this panel</span><kbd class="kbd-key">Shift + ?</kbd></div>
  </div>`,t.addEventListener(`click`,e=>{e.target===t&&t.remove()}),document.body.appendChild(t)}function Kr(){let e={exportedAt:new Date().toISOString(),version:`Exam Is Near v15`,course:h.activeCourse||`nfsu`,progress:r.progress,studyLog:r.studyLog,materials:r.materials.map(e=>({...e,data:void 0})),alarms:r.alarms,streak:D(),totalHours:E(),subjectProgress:v().map(e=>({id:e.id,name:e.name,pct:T(e.id)})),flashcards:N,njMistakes:a.mistakes,njSRSCards:a.srsCards},t=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),n=URL.createObjectURL(t),i=document.createElement(`a`);i.href=n,i.download=`exam-is-near-backup-${S()}.json`,document.body.appendChild(i),i.click(),setTimeout(()=>{URL.revokeObjectURL(n),i.remove()},100),b(`✅ Progress exported!`,`success`)}async function qr(){try{await gr(`Export as PDF`)}catch(e){e.message===`sign_in_required`?b(`⚠️ Please sign in first to use PDF export`,`alarm`):(b(`⭐ PDF export is a Pro feature`,`info`),G());return}let e=v().map(e=>{let t=T(e.id),n=(()=>{let t=0;return Object.values(r.studyLog).forEach(n=>{n.subject===e.id&&(t+=n.hours||0)}),t})();return`<tr>
      <td>${e.icon} ${e.name}</td>
      <td>${t}%</td>
      <td>${n}h</td>
      <td style="background:#f0f0f0;border-radius:4px;overflow:hidden;height:14px;position:relative">
        <div style="position:absolute;top:0;left:0;height:100%;width:${t}%;background:linear-gradient(90deg,#FFE66D,#ffb700)"></div>
      </td>
    </tr>`}).join(``),t=Object.entries(r.studyLog).sort((e,t)=>t[0].localeCompare(e[0])).slice(0,10),n=t.map(([e,t])=>`<tr><td>${e}</td><td>${t.hours||0}h</td><td>${t.subject||`—`}</td><td>${t.mood&&[`😴`,`😫`,`😐`,`😊`,`🔥`][t.mood-1]||``}</td></tr>`).join(``),i=`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Exam Is Near — Study Report (${S()})</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#111;padding:32px;font-size:13px}
  h1{font-size:22px;font-weight:800;margin-bottom:4px;color:#111}
  .subtitle{font-size:11px;color:#888;margin-bottom:24px}
  .badge{display:inline-block;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#111;border-radius:6px;padding:2px 10px;font-size:10px;font-weight:700;margin-left:8px}
  .section{margin-bottom:24px}
  h2{font-size:14px;font-weight:700;margin-bottom:10px;color:#333;border-bottom:2px solid #eee;padding-bottom:6px}
  .stats{display:flex;gap:16px;margin-bottom:24px}
  .stat{background:#f8f8f8;border-radius:10px;padding:14px 20px;flex:1;text-align:center}
  .stat-val{font-size:24px;font-weight:800;color:#111}
  .stat-lbl{font-size:10px;color:#888;margin-top:2px}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;padding:8px;background:#f0f0f0;font-weight:600;font-size:11px;color:#555}
  td{padding:8px;border-bottom:1px solid #f0f0f0;vertical-align:middle}
  .footer{margin-top:32px;font-size:10px;color:#bbb;text-align:center}
  @media print{body{padding:16px}}
</style>
</head>
<body>
  <h2>📚 Exam Is Near <span class="badge">⭐ PRO</span></h2>
  <div class="subtitle">Study Report — Generated ${new Date().toLocaleDateString(`en-IN`,{dateStyle:`long`})} · by ArkSetu</div>

  <div class="stats">
    <div class="stat"><div class="stat-val">${E()}h</div><div class="stat-lbl">Total Hours</div></div>
    <div class="stat"><div class="stat-val">${D()}</div><div class="stat-lbl">Day Streak 🔥</div></div>
    <div class="stat"><div class="stat-val">${Object.values(r.progress).filter(Boolean).length}</div><div class="stat-lbl">Topics Done</div></div>
    <div class="stat"><div class="stat-val">${v().length}</div><div class="stat-lbl">Subjects</div></div>
  </div>

  <div class="section">
    <h2>Subject Progress</h2>
    <table>
      <thead><tr><th>Subject</th><th>Progress</th><th>Hours</th><th style="width:40%">Bar</th></tr></thead>
      <tbody>${e}</tbody>
    </table>
  </div>

  ${t.length>0?`
  <div class="section">
    <h2>Recent Study Sessions</h2>
    <table>
      <thead><tr><th>Date</th><th>Hours</th><th>Subject</th><th>Mood</th></tr></thead>
      <tbody>${n}</tbody>
    </table>
  </div>`:``}

  <div class="footer">Exam Is Near by ArkSetu · exam-is-near.web.app · Pro Member Report</div>
<div class="ai-sidebar-overlay" id="ai-sidebar-overlay" onclick="_closeAISidebarMobile()"></div>
</body>
</html>`,a=new Blob([i],{type:`text/html;charset=utf-8`}),o=URL.createObjectURL(a),s=window.open(o,`_blank`,`width=800,height=900`);if(!s){URL.revokeObjectURL(o),b(`⚠️ Allow popups to generate PDF`,`alarm`);return}s.addEventListener(`load`,()=>{s.print(),URL.revokeObjectURL(o)},{once:!0}),setTimeout(()=>URL.revokeObjectURL(o),3e4),b(`✅ PDF report ready — use 'Save as PDF' in print dialog`,`success`)}function Jr(){let e=document.createElement(`input`);e.type=`file`,e.accept=`.json`,e.onchange=async e=>{try{let t=e.target.files[0];if(t.size>5242880){b(`⚠️ Backup file too large (max 5 MB)`,`alarm`);return}let n=await t.text(),i=JSON.parse(n);if(!i.progress&&!i.studyLog){b(`⚠️ Invalid backup file`,`alarm`);return}if(!confirm(`Import will overwrite your current progress, study log, and materials. Continue?`))return;if(i.progress&&typeof i.progress==`object`&&!Array.isArray(i.progress)){let e=Object.keys(i.progress).slice(0,5e3),t={};e.forEach(e=>{typeof e==`string`&&e.length<100&&(t[e]=!!i.progress[e])}),r.progress=t,_(`progress`,t)}if(i.studyLog&&typeof i.studyLog==`object`&&!Array.isArray(i.studyLog)){let e=Object.keys(i.studyLog).slice(0,1e3),t={};e.forEach(e=>{let n=i.studyLog[e];typeof n==`object`&&n&&(t[e]={hours:parseFloat(n.hours)||0,mood:parseInt(n.mood)||3,subject:String(n.subject||``).slice(0,50)})}),r.studyLog=t,_(`studyLog`,t)}if(Array.isArray(i.materials)){let e=i.materials.slice(0,500).map(e=>({id:String(e.id||x()).slice(0,50),subjectId:String(e.subjectId||``).slice(0,50),type:String(e.type||`📝 Note`).slice(0,30),title:String(e.title||``).slice(0,200),content:String(e.content||``).slice(0,1e4),tags:Array.isArray(e.tags)?e.tags.slice(0,20).map(e=>String(e).slice(0,50)):[],created:String(e.created||S()).slice(0,20),pinned:!!e.pinned}));r.materials=e,_(`materials`,e)}if(Array.isArray(i.alarms)){let e=i.alarms.slice(0,100).map(e=>({id:String(e.id||x()).slice(0,50),time:String(e.time||`07:00`).slice(0,5),label:String(e.label||`Study`).slice(0,100),enabled:!!e.enabled,repeat:!!e.repeat,days:Array.isArray(e.days)?e.days.slice(0,7).map(Number):[],ringtone:String(e.ringtone||`classic`).slice(0,30)}));r.alarms=e,_(`alarms`,e)}if(i.flashcards&&typeof i.flashcards==`object`&&!Array.isArray(i.flashcards)){let e={};Object.keys(i.flashcards).slice(0,50).forEach(t=>{Array.isArray(i.flashcards[t])&&(e[t]=i.flashcards[t].slice(0,200).map(e=>({front:String(e.front||``).slice(0,500),back:String(e.back||``).slice(0,1e3)})))}),Object.assign(N,e),Xt()}Array.isArray(i.njMistakes)&&(a.mistakes=i.njMistakes.slice(0,500),oe()),Array.isArray(i.njSRSCards)&&(a.srsCards=i.njSRSCards.slice(0,500),oe()),b(`✅ Progress imported successfully!`,`success`),H(),B()}catch(e){b(`⚠️ Import failed: `+e.message,`alarm`)}},e.click()}typeof window<`u`&&Object.assign(window,{closeNavDrawer:Wr,exportProgressJSON:Kr,exportProgressPDF:qr,importProgressJSON:Jr,openNavDrawer:Ur,showKeyboardShortcuts:Gr});export{Nr as AI_HISTORY_KEY,Pr as AI_HISTORY_MAX,fn as AI_QUICK_PROMPTS,mn as AI_SESSIONS_KEY,hn as AI_SESSION_MAX,pn as AI_WELCOME_CARDS,$ as AiAssistantSetupShared,F as AiAssistantViewShared,hr as CF_BASE,q as CF_URLS,Ht as FLASH_LOG_MAX,Dr as FREE_AI_MSG_LIMIT,Or as FREE_QUIZ_LIMIT,Er as GROQ_MODEL,Tr as GROQ_PROXY_URL,yt as POM_PRESETS,k as POM_QUOTES,K as PRO_KEY,fr as PRO_PRICE_INR,Vt as QUIZ_LOG_MAX,ar as RINGTONES,We as _EXAM_MONTHS,yr as _activateFreeCoupon,W as _activeCoupon,R as _aiLoadSessions,bn as _aiPersistCurrentSession,Tn as _aiRelTime,z as _aiSaveSessions,gn as _aiSessionTitle,I as _aiSessions,L as _aiSidebarOpen,wn as _aiToggleIconClosed,Cn as _aiToggleIconOpen,Sn as _closeAISidebarMobile,He as _courseChosen,Jn as _doRender,Ge as _examDateToISO,kr as _freeCounterDay,Z as _hideAdsForPro,jr as _incDailyCounter,Ar as _initDailyCounter,Ke as _isoToExamDate,tr as _lastAlarmCheck,Cr as _launchRazorpay,vr as _loadRazorpay,Je as _pageMeta,It as _pomFSChange,J as _proCache,qn as _renderResolvers,Kn as _renderTimer,pr as _resetCouponState,Ye as _updatePageMeta,Q as _updateProHeaderUI,wr as _verifyAndGrantPro,ct as addMaterial,ht as addPresetAlarms,yn as aiDeleteSession,vn as aiLoadSession,_n as aiNewChat,xn as aiToggleSidebar,mr as applyCouponCode,Lr as askAI,ft as cancelEdit,nr as checkAlarms,me as checkMaintenance,Re as checkShareLinkOnLoad,nn as clearSubjectDeck,Ln as closeFolderPicker,Wr as closeNavDrawer,De as closePreview,X as closeProModal,Nn as closeSectionModal,Ie as copyToClipboard,Bn as createDriveFolderForSubject,gt as deleteAlarm,Ce as deleteAllUserFiles,Se as deleteFile,sn as deleteFlashcard,lt as deleteMaterial,Fn as deleteSectionItem,ye as deleteUserFileFromCloud,ir as dismissAlarm,Me as exportData,Kr as exportProgressJSON,qr as exportProgressPDF,$t as flashBack,N as flashDecks,Qt as flashSelectSubject,P as flashState,rn as flipCard,ue as formatSize,Mr as freeAiMsgCount,tn as generateFlashcards,Gn as generateProfileInsight,Hr as generateQuizFromAI,Fe as generateShareLink,un as getAIQuickPrompts,dn as getAIWelcomeCards,Zt as getActiveDeck,An as getActiveTab,w as getDaysLeft,O as getExamDate,le as getFileIcon,Oe as getGoogleAccessToken,de as getStorageUsedMB,D as getStreak,T as getSubjectPct,kn as getSubjectSection,E as getTotalHours,Ue as getTotalPct,be as handleFileSelect,xe as handleFolderSelect,ze as handlePastedShareLink,ot as hideAddForm,Ne as importData,Le as importFromShareLink,Jr as importProgressJSON,br as initiateProPayment,Sr as initiateTrialPayment,xr as initiateYearlyPayment,On as installPWA,Y as isProUser,Fr as loadAIChatHistory,fe as loadAdminMaterials,he as loadAnnouncement,Rn as loadDriveFolders,ge as loadExamSchedule,_e as loadSharedFiles,pe as loadTheme,ve as loadUserFiles,nt as logToday,Pe as mergeImportData,an as nextCard,Jt as nextQuestion,en as openChapterPicker,In as openFolderPicker,Ur as openNavDrawer,Ee as openPreview,G as openProModal,Mn as openSectionModal,ur as pauseTimer,sr as playAlarmSound,wt as pomApplyCustom,Pt as pomCleanupFS,Nt as pomFSInterval,Rt as pomGetSubjectHoursFormatted,Ot as pomPause,Dt as pomPlayChime,Ft as pomRenderFSOverlay,kt as pomReset,bt as pomSaveHours,St as pomSaveLog,xt as pomSaveSettings,Ct as pomSetPreset,Lt as pomSetSubject,At as pomSkipBreak,Et as pomStart,jt as pomStartBreak,A as pomState,Mt as pomToggleFullScreen,Tt as pomToggleSound,zt as pomTotalHoursFormatted,on as prevCard,M as quizState,B as render,En as renderAI,Vr as renderAIChat,Dn as renderAIMsgBubble,Ve as renderAbout,Qn as renderAlarms,ln as renderAnalytics,Xn as renderDashboard,ke as renderDocxPreview,je as renderFiles,cn as renderFlashcards,Un as renderFolderPicker,$n as renderLog,Ae as renderPDFPreview,Bt as renderPomodoro,Wn as renderProfile,Yt as renderQuiz,Hn as renderSectionModal,Vn as renderSubjectSectionTabs,Zn as renderSubjects,Yn as renderSync,_r as requirePro,dr as resetTimer,Ir as saveAIChatHistory,Be as saveAppConfig,pt as saveEdit,Xt as saveFlashDecks,Gt as saveFlashLog,mt as saveNewAlarm,Wt as saveQuizLog,Pn as saveSectionItem,tt as saveSubjectNote,it as searchMats,qt as selectAnswer,zn as selectDriveFolder,V as selectedRingtone,Br as sendAIMessage,Qe as setActiveSubject,jn as setActiveTab,qe as setExamDate,et as setHours,rt as setMatFilter,$e as setMood,Rr as setQuickPrompt,or as setRingtone,vt as setTimerMode,zr as setWelcomePrompt,at as showAddForm,Gr as showKeyboardShortcuts,H as spawnStars,dt as startEdit,Kt as startQuiz,lr as startTimer,cr as stopAlarmSound,Xe as switchView,_t as toggleAlarm,ut as togglePin,Ut as toggleQuizReview,Ze as toggleTopic,rr as triggerAlarm,er as updateClock,we as updateFileNote,Te as updateFileSubject,st as updateNewMat,j as updatePomDisplay,U as updateTimerDisplay,gr as verifyProOrThrow};
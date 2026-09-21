import{C as e,D as t,E as n,O as r,S as i,T as a,_ as o,a as s,b as c,c as l,d as u,f as d,h as f,i as p,k as m,l as h,m as ee,n as te,o as ne,p as g,r as re,s as ie,t as ae,u as _,v as oe,w as se,x as ce,y as le}from"./pwa-install-DbfJoaI0.js";import{n as v,o as y,r as b,s as x,t as S}from"./preload-helper-BKR1dAv2.js";function ue(e,t){if(!e&&!t)return`📄`;let n=(t||``).split(`.`).pop().toLowerCase();return e===`drive-folder`?`📁`:e===`drive-link`?`📎`:e.includes(`pdf`)||n===`pdf`?`📕`:e.includes(`image`)||[`jpg`,`jpeg`,`png`,`gif`,`webp`].includes(n)?`🖼️`:e.includes(`spreadsheet`)||[`xlsx`,`xls`,`csv`].includes(n)?`📊`:e.includes(`word`)||n===`docx`?`📘`:e.includes(`presentation`)||n===`pptx`?`📙`:e.includes(`text`)||n===`txt`?`📄`:e.includes(`video`)||[`mp4`,`mov`].includes(n)?`🎬`:e.includes(`audio`)||[`mp3`,`wav`].includes(n)?`🎵`:n===`zip`||n===`rar`?`🗜️`:`📁`}function de(e){return e<1024?e+`B`:e<1048576?(e/1024).toFixed(1)+`KB`:(e/1048576).toFixed(1)+`MB`}function fe(){try{return(r.files.reduce((e,t)=>e+(t.size||0),0)/1048576).toFixed(1)}catch{return 0}}async function pe(){if(n.db)try{let{collection:e,getDocs:t,query:i,orderBy:a}=await S(async()=>{let{collection:e,getDocs:t,query:n,orderBy:r}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{collection:e,getDocs:t,query:n,orderBy:r}},[]),o=h.activeCourse||null;if(!o)return;let s=await t(i(e(n.db,`study-materials`),a(`createdAt`,`desc`))),c=[];s.forEach(e=>{let t=e.data(),n=(t.course||``).toLowerCase();if(n!==o&&n!==`general`)return;let r=typeof _==`function`?_():[];c.push({id:`admin_`+e.id,name:t.title||t.fileName||`Untitled`,fileName:t.fileName||``,type:t.type||``,size:0,created:t.createdAt?new Date(t.createdAt).toLocaleDateString():``,downloadURL:t.url||null,subjectId:((e,t)=>{let n=(e||``).trim();if(!n)return t;let i=r.find(e=>e.id===n||(e.name||``).trim().toLowerCase()===n.toLowerCase());return i?i.id:n})(t.subject,t.course||`general`),course:t.course||``,note:t.description||``,proOnly:!!t.proOnly,isQuestionPaper:!!t.isQuestionPaper,shared:!0,adminMaterial:!0})}),r.files=r.files.filter(e=>!e.adminMaterial),r.files=[...c,...r.files]}catch(e){console.warn(`loadAdminMaterials error:`,e)}}async function me(){if(n.db)try{let{doc:e,getDoc:t}=await S(async()=>{let{doc:e,getDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,getDoc:t}},[]),r=await t(e(n.db,`app_config`,`theme`));if(r.exists()){let e=r.data();e.primaryColor&&document.documentElement.style.setProperty(`--accent`,e.primaryColor),e.accentColor&&document.documentElement.style.setProperty(`--gold`,e.accentColor)}}catch(e){console.warn(`loadTheme error:`,e)}}async function he(){if(n.db)try{let{doc:e,getDoc:t}=await S(async()=>{let{doc:e,getDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,getDoc:t}},[]),r=await t(e(n.db,`app_config`,`maintenance`));if(r.exists()&&r.data().enabled){let e=document.getElementById(`maintenance-overlay`),t=document.getElementById(`maintenance-msg`);e&&(t&&r.data().message&&(t.textContent=r.data().message),e.style.display=`flex`)}}catch(e){console.warn(`checkMaintenance error:`,e)}}async function ge(){if(n.db)try{let{doc:e,getDoc:t}=await S(async()=>{let{doc:e,getDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,getDoc:t}},[]),r=await t(e(n.db,`app_config`,`announcement`));if(!r.exists())return;let i=r.data();if(!i.active)return;let a=document.getElementById(`announce-banner`),o=document.getElementById(`announce-banner-text`);if(a&&o&&i.bannerText&&(o.textContent=i.bannerText,a.style.display=`flex`),i.popupTitle&&!sessionStorage.getItem(`ann_seen_`+i.id)){let e=document.getElementById(`announce-popup`),t=document.getElementById(`announce-popup-title`),n=document.getElementById(`announce-popup-body`);e&&t&&n&&(t.textContent=i.popupTitle,n.textContent=i.popupBody||``,e.style.display=`flex`,i.id&&sessionStorage.setItem(`ann_seen_`+i.id,`1`))}}catch(e){console.warn(`loadAnnouncement error:`,e)}}async function _e(){if(n.db)try{let{collection:e,getDocs:t,query:i,orderBy:a}=await S(async()=>{let{collection:e,getDocs:t,query:n,orderBy:r}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{collection:e,getDocs:t,query:n,orderBy:r}},[]),o=await t(i(e(n.db,`exam_schedule`),a(`date`,`asc`))),s=[];o.forEach(e=>s.push({id:e.id,...e.data()})),s.length&&(r.examSchedule=s,B())}catch(e){console.warn(`loadExamSchedule error:`,e)}}async function ve(){if(n.db)try{let{collection:e,getDocs:t,query:i,orderBy:a}=await S(async()=>{let{collection:e,getDocs:t,query:n,orderBy:r}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{collection:e,getDocs:t,query:n,orderBy:r}},[]),o=await t(i(e(n.db,`shared-files`),a(`created`,`desc`))),s=[];o.forEach(e=>{let t=e.data();if(!r.files.find(t=>t.id===e.id&&t.shared)){let n={...t,id:e.id,shared:!0};n.type===`drive-folder`&&(n.isDriveLink=!0,n.driveLink=n.driveLink||n.downloadURL||n.url||``),s.push(n)}}),s.length>0&&(r.files=[...s,...r.files.filter(e=>!e.shared)])}catch(e){console.warn(`loadSharedFiles error:`,e)}}async function ye(){if(!(!n.db||!n.currentUser))try{let{collection:e,getDocs:t,query:i,orderBy:a}=await S(async()=>{let{collection:e,getDocs:t,query:n,orderBy:r}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{collection:e,getDocs:t,query:n,orderBy:r}},[]),o=await t(i(e(n.db,`user-files`,n.currentUser.uid,`files`),a(`created`,`desc`))),s=[];o.forEach(e=>{s.push({...e.data(),id:e.id,synced:!0})});let c=r.files.filter(e=>!e.shared&&!e.adminMaterial&&!s.find(t=>t.id===e.id)),l=r.files.filter(e=>e.shared||e.adminMaterial);r.files=[...l,...s,...c],oe(`files`,r.files.map(e=>({...e,data:null}))).catch(()=>{}),d(`files`,r.files.map(e=>({...e,data:null})))}catch(e){console.warn(`loadUserFiles error:`,e)}}async function be(e){if(!(!n.db||!n.currentUser))try{let{doc:t,deleteDoc:r}=await S(async()=>{let{doc:e,deleteDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,deleteDoc:t}},[]);await r(t(n.db,`user-files`,n.currentUser.uid,`files`,e))}catch(e){console.warn(`deleteUserFile error:`,e)}}async function xe(e){let t=document.getElementById(`file-sub-select`)?.value||`cpp`,i=await Y();for(let a of Array.from(e)){if(a.size>16106127360){y(`⚠️ `+a.name+` exceeds 15GB limit`,`alarm`);continue}if(!i&&r.files.filter(e=>!e.adminFile&&!e.shared).length>=5){y(`⭐ Free plan allows up to 5 files. Upgrade to Pro for Google Drive storage!`,`alarm`),G();break}let e={id:b(),name:a.name,size:a.size,type:a.type,subjectId:t,created:x(),note:``,uploadedBy:n.currentUser?.displayName||`You`,ownerId:n.currentUser?.uid||null,shared:!1};if(i){y(`☁️ Uploading `+a.name+` to Google Drive…`,`info`);try{let t=await ke();if(!t)throw Error(`Not signed in with Google`);let i={name:a.name,mimeType:a.type||`application/octet-stream`},o=new FormData;o.append(`metadata`,new Blob([JSON.stringify(i)],{type:`application/json`})),o.append(`file`,a);let s=await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink`,{method:`POST`,headers:{Authorization:`Bearer `+t},body:o});if(!s.ok)throw Error(`Drive upload failed: `+s.status);let c=await s.json();if(await fetch(`https://www.googleapis.com/drive/v3/files/${c.id}/permissions`,{method:`POST`,headers:{Authorization:`Bearer `+t,"Content-Type":`application/json`},body:JSON.stringify({role:`reader`,type:`anyone`})}),e.downloadURL=`https://drive.google.com/uc?export=download&id=${c.id}`,e.driveId=c.id,e.driveViewURL=c.webViewLink,e.storage=`gdrive`,n.db&&n.currentUser){let{doc:t,setDoc:r}=await S(async()=>{let{doc:e,setDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,setDoc:t}},[]);await r(t(n.db,`user-files`,n.currentUser.uid,`files`,e.id),e)}r.files.unshift(e),d(`files`,r.files.map(e=>({...e,data:null}))),oe(`files`,r.files.map(e=>({...e,data:null}))).catch(()=>{}),y(`✅ `+a.name+` uploaded to Google Drive 🚗`,`success`),H(),B();continue}catch(e){console.warn(`Google Drive upload failed:`,e),y(`⚠️ Google Drive upload failed — saving to Firebase Storage`,`alarm`)}}if(n.storage&&n.currentUser){y(`☁️ Uploading `+a.name+`…`,`info`);try{let{ref:t,uploadBytesResumable:i,getDownloadURL:o}=await S(async()=>{let{ref:e,uploadBytesResumable:t,getDownloadURL:n}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js`);return{ref:e,uploadBytesResumable:t,getDownloadURL:n}},[]),s=`user-files/${n.currentUser.uid}/${e.id}_${a.name}`,c=t(n.storage,s);if(e.downloadURL=await new Promise((e,t)=>{let n=i(c,a);n.on(`state_changed`,e=>{let t=Math.round(e.bytesTransferred/e.totalBytes*100);t>0&&t<100&&y(`☁️ `+a.name+` — `+t+`%`,`info`)},t,async()=>e(await o(n.snapshot.ref)))}),e.storage=`firebase`,e.synced=!0,n.db){let{doc:t,setDoc:r}=await S(async()=>{let{doc:e,setDoc:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`);return{doc:e,setDoc:t}},[]);await r(t(n.db,`user-files`,n.currentUser.uid,`files`,e.id),e)}r.files.unshift(e),d(`files`,r.files.map(e=>({...e,data:null}))),oe(`files`,r.files.map(e=>({...e,data:null}))).catch(()=>{}),y(`✅ `+a.name+` uploaded ☁️`,`success`),H(),B();continue}catch(e){console.warn(`Firebase Storage upload failed:`,e),y(`⚠️ Cloud upload failed — saving locally`,`alarm`)}}let o=new FileReader;o.onload=t=>{e.data=t.target.result,r.files.unshift(e);try{g(`files`,r.files)}catch{r.files[0].data=null,r.files[0].note=`⚠️ File too large to store offline.`;try{g(`files`,r.files)}catch{r.files.shift()}y(`⚠️ Storage full — metadata only`,`alarm`),B();return}y(`📁 `+a.name+` saved locally · Sign in to enable cloud backup`,`info`),H(),B()},o.readAsDataURL(a)}}function Se(e){let t=Array.from(e).filter(e=>!(e.name||``).startsWith(`.`));if(t.length===0){y(`⚠️ No valid files found in folder`,`alarm`);return}y(`📂 Loading `+t.length+` file(s) from folder…`,`info`),xe(t)}function Ce(e){if(!confirm(`Delete this file?`))return;let t=r.files.find(t=>t.id===e);r.files=r.files.filter(t=>t.id!==e),g(`files`,r.files),t&&t.synced&&!t.shared&&be(e),y(`🗑️ File deleted`,`info`),B()}async function we(){let e=r.files.filter(e=>!e.adminMaterial);if(e.length===0){y(`No files to delete`,`info`);return}if(confirm(`Delete all ${e.length} file(s)? This cannot be undone.`)){for(let t of e)if(t.synced&&!t.shared)try{await be(t.id)}catch{}r.files=r.files.filter(e=>e.adminMaterial),g(`files`,r.files),y(`🗑️ Deleted ${e.length} file(s)`,`info`),B()}}function Te(e,t){let n=r.files.find(t=>t.id===e);n&&(n.note=t,g(`files`,r.files))}function Ee(e,t){let n=r.files.find(t=>t.id===e);n&&(n.subjectId=t,g(`files`,r.files),B())}function De(e){let t=r.files.find(t=>t.id===e);if(!t)return;if(!t.data&&!t.downloadURL){y(`⚠️ File data not available`,`alarm`);return}if(t.downloadURL||t.driveViewURL){let e=t.driveViewURL||t.downloadURL;window.open(e,`_blank`);return}let n=document.getElementById(`preview-overlay`);document.getElementById(`preview-name`).textContent=t.name,document.getElementById(`preview-meta`).textContent=de(t.size)+` · Uploaded `+t.created;let i=document.getElementById(`preview-body`);_().find(e=>e.id===t.subjectId);let a=document.getElementById(`preview-download`),o=t.downloadURL||t.data;a.onclick=()=>{let e=document.createElement(`a`);e.href=o,e.download=t.name,e.target=`_blank`,e.click()};let s=t.fileName||t.name,c=t.downloadURL?(t.downloadURL.split(`?`)[0].split(`.`).pop()||``).toLowerCase():``,l=[s.split(`.`).pop()||``].map(e=>e.toLowerCase())[0]===`notes`||!s.includes(`.`)?c:(s.split(`.`).pop()||``).toLowerCase(),u=[`pdf`,`pyq`].includes(t.type),d=t.type===`notes`;if(t.type.includes(`image`)||[`jpg`,`jpeg`,`png`,`gif`,`webp`].includes(l))i.innerHTML=`<img src="${o}" style="max-width:100%;max-height:65vh;border-radius:8px;object-fit:contain"/>`;else if(t.type.includes(`pdf`)||l===`pdf`||u||c===`pdf`)i.innerHTML=`
      <div id="pdf-loading" style="text-align:center;padding:40px;color:#888">
        <div style="font-size:32px;margin-bottom:12px">⏳</div>
        <div>Loading PDF...</div>
      </div>
      <div id="pdf-canvas-container" style="overflow-y:auto;max-height:65vh;background:#1a1a2e;border-radius:8px;display:none;padding:8px"></div>
      <div id="pdf-error" style="display:none;text-align:center;padding:32px">
        <div style="font-size:48px;margin-bottom:12px">📄</div>
        <div style="color:#ccc;font-weight:bold;margin-bottom:8px">${v(t.name)}</div>
        <div style="color:#888;font-size:13px;margin-bottom:16px">Preview unavailable in browser.</div>
        <button onclick="window.open('${o}','_blank')" style="background:#4ECDC4;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer;margin-right:8px">↗ Open in New Tab</button>
      </div>`,je(o,t.name);else if(t.type.includes(`text`)||t.name.endsWith(`.txt`)||t.name.endsWith(`.csv`))try{let e=t.data.split(`,`)[1],n=atob(e);i.innerHTML=`<pre style="font-size:12px;color:#aaa;text-align:left;white-space:pre-wrap;max-height:65vh;overflow:auto;padding:16px;background:#0a0a12;border-radius:8px;width:100%">${v(n.slice(0,8e3))}${n.length>8e3?`...(truncated)`:``}</pre>`}catch{i.innerHTML=`<div style="color:#888">Cannot preview this file type.<br>Click Download to open it.</div>`}else{let e=ue(t.type,t.name),n=l,r=[`doc`,`docx`,`ppt`,`pptx`,`xls`,`xlsx`];if((n===`docx`||c===`docx`||d)&&t.downloadURL)i.innerHTML=`<div id="docx-loading" style="text-align:center;padding:40px;color:#888">
        <div style="font-size:32px;margin-bottom:12px">⏳</div>
        <div>Loading document...</div>
      </div>
      <div id="docx-content" style="display:none;text-align:left;max-height:65vh;overflow:auto;background:#fff;color:#222;padding:24px 28px;border-radius:8px;font-size:14px;line-height:1.6"></div>
      <div id="docx-error" style="display:none;text-align:center;padding:32px">
        <div style="font-size:48px;margin-bottom:12px">${e}</div>
        <div style="color:#ccc;font-weight:bold;margin-bottom:8px">${v(t.name)}</div>
        <div style="color:#888;font-size:13px;margin-bottom:16px">Couldn't render this document.</div>
        <button onclick="window.open('${o}','_blank')" style="background:#4ECDC4;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer">↗ Open in New Tab</button>
      </div>`,Ae(o);else if(([`pptx`,`ppt`,`xlsx`,`xls`].includes(n)||[`pptx`,`ppt`,`xlsx`,`xls`].includes(c))&&t.downloadURL)i.innerHTML=`<div style="text-align:center">
        <iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(t.downloadURL)}" style="width:100%;height:65vh;border:none;border-radius:8px;background:#fff" frameborder="0"></iframe>
      </div>`;else{let a=o,s=`↗ Open in New Tab`;r.includes(n)&&t.downloadURL&&(a=`https://docs.google.com/viewer?url=${encodeURIComponent(t.downloadURL)}&embedded=true`,s=`↗ Open in Viewer`),i.innerHTML=`<div style="text-align:center;padding:32px">
        <div style="font-size:80px;margin-bottom:16px">${e}</div>
        <div style="font-size:16px;font-weight:bold;color:#ccc;margin-bottom:8px">${v(t.name)}</div>
        <div style="font-size:13px;color:#555;margin-bottom:20px">${de(t.size)} · ${t.type||`Unknown type`}</div>
        <div style="font-size:12px;color:#444;margin-bottom:16px">Preview not available in browser.</div>
        <button onclick="window.open('${a}','_blank')" style="background:#4ECDC4;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer">${s}</button>
      </div>`}}n.classList.add(`show`)}function Oe(){document.getElementById(`preview-overlay`).classList.remove(`show`),document.getElementById(`preview-body`).innerHTML=``}async function ke(){try{let{GoogleAuthProvider:e,signInWithPopup:t}=await S(async()=>{let{GoogleAuthProvider:e,signInWithPopup:t}=await import(`https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js`);return{GoogleAuthProvider:e,signInWithPopup:t}},[]),r=new e;r.addScope(`https://www.googleapis.com/auth/drive.file`);let i=await t(n.auth,r);return e.credentialFromResult(i)?.accessToken||null}catch(e){return console.warn(`Google Drive auth failed:`,e),null}}async function Ae(e){let t=document.getElementById(`docx-loading`),n=document.getElementById(`docx-content`),r=document.getElementById(`docx-error`);try{window.mammoth||await new Promise((e,t)=>{let n=document.createElement(`script`);n.src=`https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js`,n.onload=e,n.onerror=t,document.head.appendChild(n)});let r;if(e.startsWith(`data:`)){let t=e.split(`,`)[1],n=atob(t),i=new Uint8Array(n.length);for(let e=0;e<n.length;e++)i[e]=n.charCodeAt(e);r=i.buffer}else{let t=await fetch(e);if(!t.ok)throw Error(`fetch failed`);r=await t.arrayBuffer()}let i=(await window.mammoth.convertToHtml({arrayBuffer:r})).value||`<p style='color:#888'>No content found.</p>`;n.innerHTML=window.DOMPurify?DOMPurify.sanitize(i,{USE_PROFILES:{html:!0}}):i,t.style.display=`none`,n.style.display=`block`}catch{t.style.display=`none`,r.style.display=`block`}}async function je(e,t){window.pdfjsLib||await new Promise((e,t)=>{let n=document.createElement(`script`);n.src=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`,n.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`,e()},n.onerror=t,document.head.appendChild(n)});try{window.pdfjsLib||(await new Promise((e,t)=>{let n=document.createElement(`script`);n.src=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`,n.onload=e,n.onerror=t,document.head.appendChild(n)}),window.pdfjsLib.GlobalWorkerOptions.workerSrc=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`);let t;if(e.startsWith(`http`))try{let n=await fetch(e,{mode:`cors`});t=n.ok?{data:await n.arrayBuffer()}:{url:e}}catch{t={url:e}}else{let n=e.split(`,`)[1],r=atob(n),i=new Uint8Array(r.length);for(let e=0;e<r.length;e++)i[e]=r.charCodeAt(e);t={data:i}}let n=await window.pdfjsLib.getDocument(t).promise,r=document.getElementById(`pdf-canvas-container`),i=document.getElementById(`pdf-loading`);if(!r||!i)return;i.style.display=`none`,r.style.display=`block`,r.innerHTML=`<div style="font-size:11px;color:#555;text-align:right;margin-bottom:6px;padding:0 4px">${n.numPages} page${n.numPages>1?`s`:``}</div>`;let a=Math.min(n.numPages,20);for(let e=1;e<=a;e++){let t=await n.getPage(e),i=t.getViewport({scale:1.4}),a=document.createElement(`canvas`);a.width=i.width,a.height=i.height,a.style.cssText=`display:block;width:100%;margin-bottom:6px;border-radius:4px;background:#fff`,r.appendChild(a),await t.render({canvasContext:a.getContext(`2d`),viewport:i}).promise}if(n.numPages>20){let e=document.createElement(`div`);e.style.cssText=`text-align:center;color:#888;font-size:12px;padding:12px`,e.textContent=`Showing first 20 of ${n.numPages} pages. Click Open in New Tab to view all.`,r.appendChild(e)}let o=document.createElement(`div`);o.style.cssText=`text-align:center;padding:12px 0`,o.innerHTML=`<button onclick="window.open('${e}','_blank')" style="background:none;border:1px solid #4ECDC433;color:#4ECDC4;padding:8px 18px;border-radius:8px;font-family:inherit;font-size:12px;cursor:pointer">↗ Open in New Tab</button>`,r.appendChild(o)}catch(e){let t=document.getElementById(`pdf-loading`),n=document.getElementById(`pdf-error`);t&&(t.style.display=`none`),n&&(n.style.display=`block`),console.warn(`PDF render error:`,e)}}async function Me(){let e=await Y(),t=r.files.filter(e=>{if(r.fileSubFilter!==`all`&&e.subjectId!==r.fileSubFilter||r.fileQPOnly&&!e.isQuestionPaper)return!1;if(r.fileSearch){let t=r.fileSearch.toLowerCase();if(!e.name.toLowerCase().includes(t)&&!(e.note||``).toLowerCase().includes(t))return!1}return!0}),i=r.files.reduce((e,t)=>e+(t.size||0),0),a=(i/1048576).toFixed(1),o=Math.min(100,Math.round(i/(1048576*(e?25600:200))*100)),s=e?`<div style="background:#061208;border:1px solid #06D6A022;border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
        <span style="font-size:18px">☁️</span>
        <div style="flex:1">
          <div style="font-size:11px;font-weight:700;color:#06D6A0">25 GB Cloud Storage — PRO ⭐</div>
          <div style="font-size:10px;color:#444">Files synced to cloud · ${a} MB used</div>
          <div class="storage-bar" style="margin-top:6px"><div class="storage-fill" style="width:${o}%;background:${o>80?`#FF6B35`:o>60?`#FFE66D`:`#06D6A0`}"></div></div>
        </div>
      </div>`:`<div onclick="openProModal()" style="background:#120f00;border:1px solid #FFE66D22;border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;cursor:pointer" onmouseover="this.style.borderColor='#FFE66D44'" onmouseout="this.style.borderColor='#FFE66D22'">
        <span style="font-size:18px">📁</span>
        <div style="flex:1">
          <div style="font-size:11px;font-weight:700;color:#FFE66D">Local Storage Only <span style="font-size:9px;background:#1a1a2a;color:#555;border-radius:6px;padding:1px 7px;margin-left:4px">FREE</span></div>
          <div style="font-size:10px;color:#444">Up to 5 files · ${a} MB used · <span style="color:#FFE66D">Upgrade for 25 GB cloud ☁️</span></div>
          <div class="storage-bar" style="margin-top:6px"><div class="storage-fill" style="width:${Math.min(100,r.files.length/5*100)}%;background:#FFE66D"></div></div>
          <div style="font-size:9px;color:#444;margin-top:3px">${r.files.length}/5 files used</div>
        </div>
        <div style="font-size:11px;font-weight:700;color:#FFE66D;flex-shrink:0">Get Pro →</div>
      </div>`,c=`<div class="flex-wrap" style="margin-bottom:16px">
    <button class="pill-btn" onclick="state.fileSubFilter='all';render()" style="background:${r.fileSubFilter===`all`?`#FFE66D`:`#0f0f18`};color:${r.fileSubFilter===`all`?`#08080f`:`#666`};border-color:${r.fileSubFilter===`all`?`#FFE66D`:`#222`}">📁 All</button>
    <button class="pill-btn" onclick="state.fileQPOnly=!state.fileQPOnly;render()" style="background:${r.fileQPOnly?`#FF6B35`:`#0f0f18`};color:${r.fileQPOnly?`#08080f`:`#666`};border-color:${r.fileQPOnly?`#FF6B35`:`#222`}">📋 Question Papers${r.fileQPOnly?` ✓`:``}</button>
    ${_().map(e=>`<button class="pill-btn" onclick="state.fileSubFilter='${e.id}';render()" style="background:${e.id===r.fileSubFilter?e.color:`#0f0f18`};color:${e.id===r.fileSubFilter?`#08080f`:`#666`};border-color:${e.id===r.fileSubFilter?e.color:`#222`}">${e.icon} ${v(e.name)}</button>`).join(``)}
  </div>`,l=t.length===0?`
    <div class="empty-state">
      <div style="font-size:48px;margin-bottom:14px">📂</div>
      <div style="font-size:14px;margin-bottom:6px">No files here yet</div>
      <div style="font-size:12px;color:#444">Upload PDFs, images, notes or spreadsheets above</div>
    </div>`:`<div class="file-grid">${t.map((e,t)=>{let n=ue(e.type,e.name),r=_().find(t=>t.id===e.subjectId),i=e.type&&e.type.includes(`image`)&&e.data;return`<div class="file-card" style="animation:fadeInUp 0.3s ease ${t*.04}s both">
        <div onclick="openPreview('${e.id}')">
          ${i?`<img src="${e.data}" class="file-thumb" alt="${v(e.name)}"/>`:`<div class="file-thumb-placeholder" style="background:linear-gradient(135deg,${r?.color||`#222`}22,#0a0a18)">${n}</div>`}
        </div>
        <div class="file-info">
          ${e.isQuestionPaper?`<div style="display:inline-block;font-size:9px;font-weight:700;color:#FF6B35;background:#FF6B3522;border:1px solid #FF6B3555;border-radius:5px;padding:2px 6px;margin-bottom:4px">📋 QUESTION PAPER</div>`:``}
          <div class="file-name" title="${v(e.name)}">${v(e.name)}</div>
          <div class="file-meta">${de(e.size)} · <span style="color:${r?.color||`#444`}">${r?.icon||``} ${v(r?.name||``)}</span></div>
          <div class="file-meta" style="margin-top:2px">${e.created}</div>
          <div style="margin-top:4px;font-size:10px">
            ${e.isDriveLink||e.type===`drive-folder`?`<a href="${v(e.driveLink||e.downloadURL||e.url||``)}" target="_blank" onclick="event.stopPropagation()" style="color:#4ECDC4;text-decoration:none;display:inline-flex;align-items:center;gap:4px;background:#0a1a1a;border:1px solid #4ECDC433;padding:3px 8px;border-radius:6px">📁 Open Drive Folder ↗</a>`:e.shared&&e.downloadURL?`<span style="color:#06D6A0">☁️ Shared</span> <a href="${v(e.downloadURL)}" target="_blank" onclick="event.stopPropagation()" style="color:#4ECDC4;text-decoration:none">↗ Open</a>`:e.downloadURL&&e.synced?`<span style="color:#06D6A0">🔄 Synced</span> <a href="${v(e.downloadURL)}" target="_blank" onclick="event.stopPropagation()" style="color:#4ECDC4;text-decoration:none">↗ Open</a>`:e.downloadURL?`<span style="color:#06D6A0">☁️ Cloud</span> <a href="${v(e.downloadURL)}" target="_blank" onclick="event.stopPropagation()" style="color:#4ECDC4;text-decoration:none">↗ Open</a>`:e.data?`<span style="color:#FF6B35">⚠️ Browser only</span>`:`<span style="color:#333">—</span>`}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
            ${e.isDriveLink||e.type===`drive-folder`?`<a href="${v(e.driveLink||e.downloadURL||``)}" target="_blank" onclick="event.stopPropagation()" style="background:none;border:1px solid #4ECDC433;color:#4ECDC4;padding:4px 10px;border-radius:6px;font-size:10px;text-decoration:none">↗ Open</a>`:`<button onclick="openPreview('${e.id}')" style="background:none;border:1px solid #2a2a3a;color:#888;padding:4px 10px;border-radius:6px;font-family:inherit;font-size:10px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor='#555'" onmouseout="this.style.borderColor='#2a2a3a'">👁 View</button>`}
            ${e.adminMaterial?``:`<button onclick="deleteFile('${e.id}')" style="background:none;border:none;color:#553333;cursor:pointer;font-size:16px;padding:2px 6px;border-radius:4px;transition:all 0.2s" onmouseover="this.style.color='#cc5555'" onmouseout="this.style.color='#553333'">🗑️</button>`}
          </div>
        </div>
      </div>`}).join(``)}</div>`;return`<div class="fade-in">
    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:18px;font-weight:bold">📁 Study Material</div>
        <div style="font-size:11px;color:#444;margin-top:2px">${r.files.length} file${r.files.length===1?``:`s`} · ${a} MB used · ${e?`☁️ Cloud storage`:`📁 Local · max 5 files`}</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-gold" onclick="document.getElementById('file-input').click()">⬆ Upload Files</button>
        <button class="btn-ghost" onclick="document.getElementById('folder-input').click()" style="font-size:12px">📁 Upload Folder</button>
        ${r.files.filter(e=>!e.adminMaterial).length>0?`<button onclick="deleteAllUserFiles()" style="background:none;border:1px solid #553333;color:#cc5555;padding:8px 14px;border-radius:10px;font-family:inherit;font-size:12px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor='#cc5555';this.style.background='#1a0808'" onmouseout="this.style.borderColor='#553333';this.style.background='none'">🗑️ Delete All</button>`:``}
      </div>
    </div>

    <!-- Storage meter -->
    ${s}

    <!-- Drive link import -->
    <div class="card" style="margin-bottom:14px;border-color:#4ECDC433">
      <div style="font-size:13px;font-weight:bold;color:#4ECDC4;margin-bottom:10px">📎 Import from Google Drive</div>
      <div style="font-size:12px;color:#555;margin-bottom:12px">Paste a Google Drive share link — accessible on any device.</div>
      <div style="display:grid;gap:8px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <input id="drive-link-name" placeholder="File name (e.g. C++ Notes.pdf)" style="margin:0;font-size:12px"/>
          <select id="drive-link-sub" style="margin:0;font-size:12px">${_().map(e=>`<option value="${e.id}">${e.icon} ${v(e.name)}</option>`).join(``)}</select>
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
      <div style="font-size:12px;color:#444;margin-bottom:14px">PDF, Images, Excel, Word, CSV, TXT · ${e?`Uploaded to cloud · Synced across all devices ☁️`:`Saved locally · Upgrade to Pro for cloud backup ☁️`}</div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:14px">
        <button class="btn-gold" onclick="event.stopPropagation();document.getElementById('file-input').click()" style="padding:9px 18px;font-size:12px">📄 Upload Files</button>
        <button class="btn-ghost" onclick="event.stopPropagation();document.getElementById('folder-input').click()" style="padding:9px 18px;font-size:12px">📁 Upload Folder</button>
      </div>
      <div style="margin-top:4px;display:flex;align-items:center;gap:10px;justify-content:center;flex-wrap:wrap">
        <div style="font-size:11px;color:#333">Assign to subject:</div>
        <select id="file-sub-select" onclick="event.stopPropagation()" style="width:auto;padding:6px 10px;font-size:12px">
          ${_().map(e=>`<option value="${e.id}">${e.icon} ${v(e.name)}</option>`).join(``)}
        </select>
      </div>
    </div>

    <!-- Filters + Search -->
    <div style="margin:18px 0 10px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <input placeholder="🔍 Search files..." oninput="state.fileSearch=this.value;render()" value="${v(r.fileSearch)}" style="max-width:220px;padding:8px 12px;font-size:12px"/>
    </div>
    ${c}

    <!-- Supported formats info -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      ${[[`📕`,`PDF`],[`🖼️`,`Images`],[`📊`,`Excel/CSV`],[`📘`,`Word`],[`📙`,`PPT`],[`📄`,`Text`]].map(([e,t])=>`
        <div style="background:#111;border:1px solid #1e1e2e;border-radius:8px;padding:5px 10px;font-size:11px;color:#555">${e} ${t}</div>`).join(``)}
    </div>

    <!-- File cards -->
    ${l}

    <!-- Sync status info -->
    <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:12px;padding:16px;margin-top:16px">
      <div style="font-size:11px;color:#444;letter-spacing:1px;margin-bottom:12px">☁️ FILE SYNC</div>
      ${n.currentUser?`<div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:22px;flex-shrink:0">✅</span>
            <div style="font-size:12px;color:#888;line-height:1.9">
              Files you upload are synced to your account via <b style="color:#06D6A0">Firebase</b>.<br>
              Sign in on any device — your files will appear automatically. <b style="color:#EDE8E0">No browser limits.</b>
            </div>
           </div>`:`<div style="display:flex;align-items:flex-start;gap:10px">
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
  </div>`}function Ne(){let e={progress:r.progress,studyLog:r.studyLog,mood:r.mood,hoursToday:r.hoursToday,subjectNotes:r.subjectNotes,materials:r.materials,alarms:r.alarms,exportedAt:new Date().toISOString()},t=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),n=URL.createObjectURL(t),i=document.createElement(`a`);i.href=n,i.download=`studytracker_backup_${x()}.json`,i.click(),URL.revokeObjectURL(n),y(`✅ Data exported!`,`success`)}function Pe(e){let t=e.files[0];if(!t)return;let n=new FileReader;n.onload=e=>{try{Fe(JSON.parse(e.target.result))}catch{y(`⚠️ Invalid backup file`,`alarm`)}},n.readAsText(t),e.value=``}function Fe(e){e.progress&&(r.progress=e.progress),e.studyLog&&(r.studyLog=e.studyLog),e.mood!==void 0&&(r.mood=e.mood),e.hoursToday!==void 0&&(r.hoursToday=e.hoursToday),e.subjectNotes&&(r.subjectNotes=e.subjectNotes),e.materials&&(r.materials=e.materials),e.alarms&&(r.alarms=e.alarms),e.subjectSections&&(r.subjectSections=e.subjectSections),e.appConfig&&(r.appConfig=e.appConfig),[`progress`,`studyLog`,`mood`,`hoursToday`,`subjectNotes`,`materials`,`alarms`,`subjectSections`,`appConfig`].forEach(e=>d(e,r[e])),c(),f(),y(`✅ Data imported successfully!`,`success`),H(),B()}function Ie(){try{let e={progress:r.progress,studyLog:r.studyLog,mood:r.mood,hoursToday:r.hoursToday,subjectNotes:r.subjectNotes,materials:r.materials,alarms:r.alarms,subjectSections:r.subjectSections,appConfig:r.appConfig||{},sharedBy:n.currentUser?.displayName||`A friend`,sharedAt:new Date().toISOString(),version:14},t=JSON.stringify(e),i=btoa(unescape(encodeURIComponent(t))),a=window.location.href.split(`?`)[0]+`?import=`+i;if(a.length>2e3){e.materials=e.materials.slice(0,20);let t=JSON.stringify(e),n=btoa(unescape(encodeURIComponent(t)));Le(window.location.href.split(`?`)[0]+`?import=`+n),y(`🔗 Share link copied! (materials trimmed for URL limit)`,`success`)}else Le(a),y(`🔗 Share link copied to clipboard!`,`success`)}catch(e){y(`⚠️ Could not generate share link: `+e.message,`alarm`)}}function Le(e){if(navigator.clipboard)navigator.clipboard.writeText(e).catch(()=>{let t=document.createElement(`textarea`);t.value=e,document.body.appendChild(t),t.select(),document.execCommand(`copy`),t.remove()});else{let t=document.createElement(`textarea`);t.value=e,document.body.appendChild(t),t.select(),document.execCommand(`copy`),t.remove()}let t=document.getElementById(`share-link-display`);t&&(t.value=e,t.style.display=`block`)}function Re(e){try{let t=decodeURIComponent(escape(atob(e))),n=JSON.parse(t);confirm(`Import study data shared by "${n.sharedBy||`Someone`}" on ${n.sharedAt?new Date(n.sharedAt).toLocaleDateString():`unknown date`}?\n\nThis will merge with your existing data.`)&&(Fe(n),window.history.replaceState({},``,window.location.pathname))}catch{y(`⚠️ Invalid share link`,`alarm`)}}function ze(){let e=new URLSearchParams(window.location.search).get(`import`);e&&setTimeout(()=>Re(e),800)}function Be(){let e=document.getElementById(`share-link-paste`);if(!e)return;let t=e.value.trim(),n=t.match(/[?&]import=([^&]+)/);if(n&&(t=n[1]),!t){y(`⚠️ Paste a valid share link`,`alarm`);return}Re(t)}function Ve(){let e=document.getElementById(`cfg-name`)?.value.trim()||`Exam Is Near by ArkSetu`,t=document.getElementById(`cfg-subtitle`)?.value.trim()||`Study Smart`;r.appConfig={name:e,subtitle:t},g(`appConfig`,r.appConfig),f(),y(`✅ App config saved!`,`success`),B()}typeof window<`u`&&Object.assign(window,{checkMaintenance:he,checkShareLinkOnLoad:ze,closePreview:Oe,copyToClipboard:Le,deleteAllUserFiles:we,deleteFile:Ce,deleteUserFileFromCloud:be,exportData:Ne,formatSize:de,generateShareLink:Ie,getFileIcon:ue,getGoogleAccessToken:ke,getStorageUsedMB:fe,handleFileSelect:xe,handleFolderSelect:Se,handlePastedShareLink:Be,importData:Pe,importFromShareLink:Re,loadAdminMaterials:pe,loadAnnouncement:ge,loadExamSchedule:_e,loadSharedFiles:ve,loadTheme:me,loadUserFiles:ye,mergeImportData:Fe,openPreview:De,renderDocxPreview:Ae,renderFiles:Me,renderPDFPreview:je,saveAppConfig:Ve,updateFileNote:Te,updateFileSubject:Ee});function He(){return`<div class="fade-in">
    <!-- Hero -->
    <div style="text-align:center;padding:28px 16px 20px;margin-bottom:16px;background:linear-gradient(135deg,#0f0f18,#12121e);border:1px solid #1e1e2e;border-radius:16px;position:relative;overflow:hidden">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#FFE66D,#ff6b35,#4ECDC4)"></div>
      <div style="font-size:42px;margin-bottom:10px">📚</div>
      <div style="font-size:22px;font-weight:bold;background:linear-gradient(90deg,#FFE66D,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px">Exam Is Near</div>
      <div style="font-size:12px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">by ArkSetu</div>
      <div style="font-size:12px;color:#444;line-height:1.8;max-width:420px;margin:0 auto">A free AI-powered study companion for JEE, NEET, CBSE, UPSC, CLAT, and NFSU students.</div>
    </div>

    <!-- Contact Us -->
    <div class="card" style="margin-bottom:12px;border-color:#4ECDC433">
      <div class="section-label">📬 Contact Us</div>
      <div style="font-size:12px;color:#777;line-height:1.9;margin-bottom:14px">
        Found a bug or want to suggest a feature? Reach out — we reply fast.
      </div>
      ${[{icon:`🌐`,label:`Website`,val:`exam-is-near.web.app`,href:`https://exam-is-near.web.app`,color:`#4ECDC4`},{icon:`📧`,label:`Email`,val:`arksetu@gmail.com`,href:`mailto:arksetu@gmail.com`,color:`#06D6A0`},{icon:`🐛`,label:`Bug Report`,val:`arksetu@gmail.com`,href:`mailto:arksetu@gmail.com?subject=Bug Report — Exam Is Near`,color:`#ff6b35`},{icon:`💡`,label:`Feature Request`,val:`arksetu@gmail.com`,href:`mailto:arksetu@gmail.com?subject=Feature Request — Exam Is Near`,color:`#a78bfa`}].map(e=>`<a href="${e.href}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:#0a0a12;border:1px solid #1e1e2e;border-radius:9px;text-decoration:none;margin-bottom:7px;transition:all 0.2s" onmouseover="this.style.borderColor='${e.color}55'" onmouseout="this.style.borderColor='#1e1e2e'">
        <span style="font-size:18px;flex-shrink:0">${e.icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:10px;color:#555;letter-spacing:1px;text-transform:uppercase">${e.label}</div>
          <div style="font-size:11px;color:${e.color};margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.val}</div>
        </div>
        <span style="color:#333;font-size:12px">→</span>
      </a>`).join(``)}
    </div>

    <!-- Privacy & AdSense note -->
    <div class="card" style="margin-bottom:12px;border-color:#2a2a3a">
      <div class="section-label">🔒 Privacy & Ads</div>
      <div style="font-size:11px;color:#555;line-height:2">
        • Study data is stored locally on your device or in your Google account via Firebase.<br>
        • We do not sell or share your personal data with third parties.<br>
        • This app uses <b style="color:#888">Google AdSense</b> to keep it free for everyone.<br>
        • <a href="https://policies.google.com/privacy" target="_blank" style="color:#4ECDC4">Google's Privacy Policy</a> &nbsp;·&nbsp; <a href="https://adssettings.google.com" target="_blank" style="color:#4ECDC4">Manage Ad Settings</a>
      </div>
    </div>

    <!-- Version -->
    <div class="card" style="margin-bottom:12px;border-color:#FFE66D22">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <div>
          <div style="font-size:13px;font-weight:bold;color:#FFE66D">Exam Is Near · Study Smart v16</div>
          <div style="font-size:10px;color:#444;margin-top:3px">© 2025–2026 ArkSetu. All rights reserved.</div>
        </div>
        <button class="btn-ghost" onclick="switchView('sync')" style="font-size:11px">🔄 Sync Settings</button>
      </div>
    </div>

    <!-- ── PRO PLAN CARD ── -->
    <div class="card" style="margin-top:12px;border-color:#FFE66D33;background:linear-gradient(135deg,#12100a,#0f0f18)">
      <div class="section-label">⭐ Upgrade to Pro</div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:16px">
        <div style="flex:1;min-width:180px">
          <div style="font-size:15px;font-weight:700;color:#FFE66D;margin-bottom:8px">Exam Is Near Pro</div>
          <div style="font-size:12px;color:#666;line-height:2">Unlock AI chat history, unlimited flashcards, cloud backup, advanced analytics, ad-free experience and PDF exports — for less than a cup of chai per day.</div>
        </div>
        <div style="text-align:center;flex-shrink:0;padding:4px">
          <div style="font-size:28px;font-weight:800;color:#FFE66D;font-family:'JetBrains Mono',monospace">₹149<span style="font-size:12px;color:#555;font-weight:400;font-family:'Inter',inherit">/mo</span></div>
          <div style="font-size:10px;color:#444;margin-bottom:12px">≈ ₹5/day</div>
          <button class="btn-gold" onclick="openProModal()" style="padding:10px 20px;font-size:13px;font-weight:700">⭐ Go Pro</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
        ${[`🤖 AI Chat History`,`📚 Unlimited Flashcards`,`☁️ 25GB Cloud Backup`,`📈 Advanced Analytics`,`🚫 Ad-Free Experience`,`📤 Export as PDF`,`⚡ Priority AI Tutor`,`🔔 Early Feature Access`].map(e=>`
          <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:#666;padding:6px 4px">
            <span style="color:#06D6A0;font-size:11px;flex-shrink:0">✓</span>${e}
          </div>`).join(``)}
      </div>
    </div>

    <!-- Privacy Policy link -->
    <div style="text-align:center;margin-top:16px">
      <a href="privacy.html" target="_blank" rel="noopener" style="font-size:11px;color:#333;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#666'" onmouseout="this.style.color='#333'">🔒 Privacy Policy</a>
      <span style="color:#1e1e2e;margin:0 8px">·</span>
      <a href="https://adssettings.google.com" target="_blank" rel="noopener" style="font-size:11px;color:#333;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#666'" onmouseout="this.style.color='#333'">Ad Settings</a>
    </div>

  </div>`}localStorage.removeItem(`st_flashcards`),le(),ze();var Ue=localStorage.getItem(`courseChosen`);(!h.activeCourse||!Ue)&&(h.activeCourse=null,setTimeout(()=>u(),900)),`Notification`in window&&Notification.permission==="default"&&setTimeout(()=>Notification.requestPermission(),2e3),setInterval(()=>{er(),nr()},1e3),er(),typeof window<`u`&&Object.assign(window,{_courseChosen:Ue,renderAbout:He});function C(e){if(!e||!e.trim())return null;let t=e.trim().split(/\s+/),n={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11},r=parseInt(t[0]),i=t[1],a=new Date;a.setHours(0,0,0,0);let o=t[2]?parseInt(t[2]):a.getFullYear();if(isNaN(r)||!n.hasOwnProperty(i))return null;let s=new Date(o,n[i],r);return!t[2]&&s<a&&(s=new Date(o+1,n[i],r)),Math.ceil((s-a)/864e5)}function w(e){let t=_().find(t=>t.id===e);if(!t)return 0;let n=0,i=0;return t.units.forEach(t=>t.topics.forEach((a,o)=>{n++,r.progress[`${e}-${t.id}-${o}`]&&i++})),n?Math.round(i/n*100):0}function We(){let e=0,t=0;return _().forEach(n=>n.units.forEach(i=>i.topics.forEach((a,o)=>{e++,r.progress[`${n.id}-${i.id}-${o}`]&&t++}))),e?Math.round(t/e*100):0}function T(){return Object.values(r.studyLog).reduce((e,t)=>e+(t.hours||0),0)}function E(){let e=0,t=new Date;for(;e<366;){let n=t.toISOString().split(`T`)[0];if(r.studyLog[n]?.hours>0)e++,t.setDate(t.getDate()-1);else break}return e}m._examDateOverrides=JSON.parse(localStorage.getItem(`st_examDates`)||`{}`);function D(e){if(m._examDateOverrides[e])return m._examDateOverrides[e];let t=(r.examSchedule||[]).find(t=>t.id===e);return t&&t.date?t.date:_().find(t=>t.id===e)?.exam||``}var Ge=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`];function Ke(e){if(!e||!e.trim())return``;let t={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11},n=e.trim().split(/\s+/),r=parseInt(n[0]),i=n[1];if(isNaN(r)||!t.hasOwnProperty(i))return``;let a=new Date;a.setHours(0,0,0,0);let o=n[2]?parseInt(n[2]):a.getFullYear(),s=new Date(o,t[i],r);!n[2]&&s<a&&(s=new Date(o+1,t[i],r));let c=String(s.getMonth()+1).padStart(2,`0`),l=String(s.getDate()).padStart(2,`0`);return`${s.getFullYear()}-${c}-${l}`}function qe(e){if(!e)return``;let[t,n,r]=e.split(`-`).map(Number);return!t||!n||!r?``:`${r} ${Ge[n-1]} ${t}`}function Je(e,t){m._examDateOverrides[e]=t,localStorage.setItem(`st_examDates`,JSON.stringify(m._examDateOverrides)),B(),y(`✅ Exam date updated!`,`success`)}var Ye={dashboard:{title:`Dashboard — Exam Is Near`,desc:`Track your study progress, syllabus completion, mood and daily hours. Your personal study overview.`},subjects:{title:`Study Subjects — Exam Is Near`,desc:`Browse and track chapter-wise progress across all your subjects for JEE, NEET, UPSC and NFSU.`},alarms:{title:`Study Alarms & Timer — Exam Is Near`,desc:`Set smart study alarms and reminders to stay on schedule for your exam preparation.`},files:{title:`Study Material — Exam Is Near`,desc:`Manage and access your notes, PDFs and study files synced with Firebase Storage and Google Drive.`},pomodoro:{title:`Pomodoro Timer — Exam Is Near`,desc:`Boost focus with the Pomodoro technique. Free study timer with session tracking for JEE and NEET prep.`},flashcards:{title:`Flashcards — Exam Is Near`,desc:`Create and review flashcards with spaced repetition (SRS) for long-term retention. Free for JEE, NEET, UPSC students.`},quiz:{title:`Quiz Mode — Exam Is Near`,desc:`Test yourself with MCQ quiz mode. Instant feedback, quiz logs and review cards for exam preparation.`},analytics:{title:`Study Analytics — Exam Is Near`,desc:`Visualise your study hours, mood trends and subject-wise progress with detailed analytics and rank predictor.`},ai:{title:`AI Tutor — Exam Is Near`,desc:`Get instant doubt resolution from an AI tutor powered by Groq LLaMA 3.3. Free AI study assistant for students.`},sync:{title:`Sync & Account — Exam Is Near`,desc:`Sync your study data across devices with Firebase cloud backup. Sign in with Google.`},log:{title:`Study Log — Exam Is Near`,desc:`Log your daily study sessions, mood and hours. Build a consistent study habit with the study journal.`},about:{title:`About — Exam Is Near by ArkSetu`,desc:`Learn about Exam Is Near, a free AI-powered study app by ArkSetu built for Indian students.`},profile:{title:`Profile — Exam Is Near`,desc:`Manage your Exam Is Near profile, subscription and preferences.`},neetjee:{title:`NEET / JEE Hub — Exam Is Near`,desc:`Chapter-wise weightage, rank predictor and OMR practice for NEET UG and JEE Mains / Advanced.`},rank:{title:`Rank Predictor — Exam Is Near`,desc:`Free NEET & JEE Main rank predictor. Updated with NTA 2025 official data and JoSAA 2025 closing ranks. Predict your AIR and colleges instantly.`},"course:jee":{title:`JEE Preparation — Exam Is Near`,desc:`Free JEE Mains and Advanced study app. Track Maths, Physics and Chemistry with AI tutor, flashcards, quiz mode and rank predictor.`},"course:neet":{title:`NEET UG Preparation — Exam Is Near`,desc:`Free NEET UG study app. Track Biology, Physics and Chemistry with AI tutor, flashcards, quiz mode and rank predictor.`},"course:nfsu":{title:`NFSU B.Sc. LL.B. Sem II — Exam Is Near`,desc:`Study companion for NFSU B.Sc. LL.B. Semester II. Track subjects, notes, flashcards and quiz mode for forensic law students.`},"course:nfsu1":{title:`NFSU B.Sc. LL.B. Sem I — Exam Is Near`,desc:`Study companion for NFSU B.Sc. LL.B. Semester I. Covers Legal Methods, Law of Tort, Computer Organization, C Programming and Discrete Mathematics.`},"course:nfsu3":{title:`NFSU B.Sc. LL.B. Sem III — Exam Is Near`,desc:`Study companion for NFSU B.Sc. LL.B. Semester III. Covers IPC, Constitutional Law, Contract Law, Family Law, Web Programming and OS Concepts.`},"course:cbse10":{title:`CBSE Class 10 Preparation — Exam Is Near`,desc:`Free CBSE Class 10 board exam study app. Track Maths, Science, English and Social Science with AI tutor and flashcards.`},"course:cbse12":{title:`CBSE Class 12 Preparation — Exam Is Near`,desc:`Free CBSE Class 12 board exam study app. AI tutor, flashcards, quiz mode and syllabus tracker for all streams.`}};function Xe(e){let t=Ye[e]||Ye[`course:`+e]||Ye.dashboard;document.title=t.title;let n=document.querySelector(`meta[name="description"]`);n&&n.setAttribute(`content`,t.desc);let r=document.querySelector(`meta[property="og:title"]`);r&&r.setAttribute(`content`,t.title);let i=document.querySelector(`meta[property="og:description"]`);i&&i.setAttribute(`content`,t.desc);let a=document.querySelector(`meta[property="og:url"]`),o=e===`dashboard`?``:`/`+e;a&&a.setAttribute(`content`,`https://exam-is-near.web.app`+o);let s=document.querySelector(`meta[name="twitter:title"]`);s&&s.setAttribute(`content`,t.title);let c=document.querySelector(`meta[name="twitter:description"]`);c&&c.setAttribute(`content`,t.desc);let l=document.querySelector(`link[rel="canonical"]`),u=e.startsWith(`course:`)?`/course/`+e.split(`:`)[1]:o;l&&l.setAttribute(`href`,`https://exam-is-near.web.app`+u),a&&e.startsWith(`course:`)&&a.setAttribute(`content`,`https://exam-is-near.web.app`+u)}function Ze(e,t=!0){if((e===`rank`||e===`rank:neet`||e===`rank:jee`)&&(a.tab=`rank`,e===`rank:neet`&&(a.exam=`neet`),e===`rank:jee`&&(a.exam=`jee`),e=`neetjee`),e!==`pomodoro`&&typeof Ft==`function`&&Ft(),t){let t=e===`dashboard`?`/`:`/`+e;history.pushState({view:e},``,t)}Xe(e),r.view=e,r.showAddForm=!1,r.editingMatId=null,document.body.classList.toggle(`ai-fullscreen-view`,e===`ai`),e===`files`&&n.db&&n.currentUser&&pe().then(()=>B()),document.querySelectorAll(`.nav-pill`).forEach(t=>{let n=t.getAttribute(`onclick`)||``;t.classList.toggle(`active`,n.includes(`switchView('`+e+`')`))});let i=document.getElementById(`neetjee-nav-pill`);i&&(h.activeCourse===`nfsu`||h.activeCourse===`nfsu1`||h.activeCourse===`nfsu3`||h.activeCourse===`cbse10`||h.activeCourse===`cbse12`||h.activeCourse===null?i.style.display=`none`:(i.style.display=``,i.textContent=h.activeCourse===`jee`?`⚡ JEE`:`🩺 NEET`),i.classList.toggle(`active`,e===`neetjee`)),B()}function Qe(e,t,n){let i=`${e}-${t}-${n}`;r.progress[i]=!r.progress[i],g(`progress`,r.progress),r.progress[i]&&H(),B()}function $e(e){r.activeSubject=e,B()}function et(e){r.mood=e,g(`mood`,e),B()}function tt(e){r.hoursToday=parseFloat(e);var t=h.activeCourse?`hoursToday_`+h.activeCourse:`hoursToday`;g(t,e);let n=document.getElementById(`hours-display`);n&&(n.textContent=r.hoursToday+`h`)}function nt(e,t){r.subjectNotes[e]=t,g(`subjectNotes`,r.subjectNotes)}function rt(){r.studyLog[x()]={hours:r.hoursToday,mood:r.mood,subject:r.activeSubject};var e=h.activeCourse?`studyLog_`+h.activeCourse:`studyLog`;g(e,r.studyLog),y(`✅ Day logged!`,`success`),H(),B()}function it(e,t){e===`sub`?r.matSubFilter=r.matSubFilter===t?`all`:t:r.matTypeFilter=r.matTypeFilter===t?`all`:t,B()}function at(e){r.matSearch=e,B()}function ot(){r.showAddForm=!0,r.editingMatId=null,r.newMat={subjectId:`cpp`,type:`📝 Note`,title:``,content:``,tags:``},B()}function st(){r.showAddForm=!1,B()}function ct(e,t){r.newMat[e]=t}function lt(){let e=r.newMat,t=document.getElementById(`new-title`)?.value||e.title,n=document.getElementById(`new-content`)?.value||e.content,i=document.getElementById(`new-tags`)?.value||e.tags,a=document.getElementById(`new-sub`)?.value||e.subjectId,o=document.getElementById(`new-type`)?.value||e.type;if(!t.trim()||!n.trim()){y(`⚠️ Fill title and content`,`alarm`);return}let s={id:b(),subjectId:a,type:o,title:t,content:n,tags:i.split(`,`).map(e=>e.trim()).filter(Boolean),created:x(),pinned:!1};r.materials.unshift(s),g(`materials`,r.materials),r.showAddForm=!1,y(`✅ Material saved!`,`success`),H(),B()}function ut(e){confirm(`Delete this material?`)&&(r.materials=r.materials.filter(t=>t.id!==e),g(`materials`,r.materials),y(`🗑️ Deleted`,`info`),B())}function dt(e){let t=r.materials.find(t=>t.id===e);t&&(t.pinned=!t.pinned,g(`materials`,r.materials),B())}function ft(e){r.editingMatId=e,r.showAddForm=!1,B()}function pt(){r.editingMatId=null,B()}function mt(e){let t=document.getElementById(`edit-title`)?.value||``,n=document.getElementById(`edit-content`)?.value||``,i=document.getElementById(`edit-tags`)?.value||``,a=document.getElementById(`edit-sub`)?.value||`cpp`,o=document.getElementById(`edit-type`)?.value||`📝 Note`;if(!t.trim()||!n.trim()){y(`⚠️ Fill title and content`,`alarm`);return}let s=r.materials.find(t=>t.id===e);s&&Object.assign(s,{title:t,content:n,subjectId:a,type:o,tags:i.split(`,`).map(e=>e.trim()).filter(Boolean)}),g(`materials`,r.materials),r.editingMatId=null,y(`✅ Updated!`,`success`),B()}function ht(){let e=document.getElementById(`al-time`)?.value||`07:00`,t=document.getElementById(`al-label`)?.value||`Study Time`,n=document.getElementById(`al-repeat`)?.checked||!1,i=document.getElementById(`al-ringtone`)?.value||V,a={id:b(),time:e,label:t,enabled:!0,repeat:n,days:[],ringtone:i};r.alarms.push(a),g(`alarms`,r.alarms),y(`⏰ Alarm set for `+e,`success`),B()}function gt(){let e=[{time:`05:30`,label:`🌅 Early Bird Wake-up`},{time:`06:00`,label:`🌄 Morning Start`},{time:`06:30`,label:`☀️ Rise & Shine`},{time:`07:00`,label:`📚 Morning Study Block`},{time:`07:30`,label:`⏰ Study Begins`},{time:`08:00`,label:`📖 Deep Work Session`},{time:`08:30`,label:`🎯 Focus Block 1`},{time:`09:00`,label:`📝 C++ / RDBMS Time`},{time:`09:30`,label:`☕ Short Break`},{time:`10:00`,label:`📚 Study Block 2`},{time:`10:30`,label:`🧠 Concepts Review`},{time:`11:00`,label:`📊 Stats Practice`},{time:`11:30`,label:`⚖️ Law & Jurisprudence`},{time:`12:00`,label:`🍽️ Lunch Break`},{time:`12:30`,label:`😴 Afternoon Nap (20 min)`},{time:`13:00`,label:`📖 Post-Lunch Study`},{time:`13:30`,label:`🎯 Focus Block 3`},{time:`14:00`,label:`📝 Revision Session`},{time:`14:30`,label:`☕ Tea Break`},{time:`15:00`,label:`📚 Deep Dive Block`},{time:`15:30`,label:`🧮 Formula Review`},{time:`16:00`,label:`📋 Notes Compilation`},{time:`16:30`,label:`🔔 Hydration Reminder`},{time:`17:00`,label:`🏃 Exercise / Walk Break`},{time:`17:30`,label:`📖 Evening Study Start`},{time:`18:00`,label:`📚 Evening Block 1`},{time:`18:30`,label:`🎯 Focus Session`},{time:`19:00`,label:`🍽️ Dinner Time`},{time:`19:30`,label:`📖 Post-Dinner Study`},{time:`20:00`,label:`📝 Night Revision`},{time:`20:30`,label:`🧠 Weak Topics Review`},{time:`21:00`,label:`📊 Mock Questions`},{time:`21:30`,label:`☕ Break & Relax`},{time:`22:00`,label:`📖 Final Study Block`},{time:`22:30`,label:`✍️ Notes Summary`},{time:`23:00`,label:`🌙 Wind Down`},{time:`23:30`,label:`📋 Tomorrow's Plan`},{time:`00:00`,label:`🛌 Bedtime Reminder`},{time:`06:15`,label:`🧘 Morning Stretch`},{time:`08:45`,label:`🔔 Pomodoro Start`},{time:`09:15`,label:`⏸ Pomodoro Break`},{time:`10:15`,label:`🔔 Pomodoro 2 Start`},{time:`10:45`,label:`⏸ Pomodoro 2 Break`},{time:`11:15`,label:`🔔 Pomodoro 3 Start`},{time:`11:45`,label:`⏸ Pomodoro 3 Break`},{time:`14:15`,label:`🔔 Pomodoro 4 Start`},{time:`14:45`,label:`⏸ Pomodoro 4 Break`},{time:`16:15`,label:`🔔 Pomodoro 5 Start`},{time:`20:15`,label:`🔔 Pomodoro 6 Start`},{time:`07:45`,label:`📱 No Phone — Focus!`}],t=0;e.forEach(e=>{r.alarms.find(t=>t.time===e.time&&t.label===e.label)||(r.alarms.push({id:b(),time:e.time,label:e.label,enabled:!0,repeat:!0,days:[],ringtone:`classic`}),t++)}),g(`alarms`,r.alarms),y(`✅ ${t} preset alarms added!`,`success`),H(),B()}function _t(e){r.alarms=r.alarms.filter(t=>t.id!==e),g(`alarms`,r.alarms),B()}function vt(e){let t=r.alarms.find(t=>t.id===e);t&&(t.enabled=!t.enabled,g(`alarms`,r.alarms),B())}function yt(e){r.timerMode=e,clearInterval(n.timerInterval),n.timerInterval=null,r.timerRunning=!1,r.timerSeconds={study:1500,short:300,long:900}[e],B()}typeof window<`u`&&Object.assign(window,{_EXAM_MONTHS:Ge,_examDateToISO:Ke,_isoToExamDate:qe,_pageMeta:Ye,_updatePageMeta:Xe,addMaterial:lt,addPresetAlarms:gt,cancelEdit:pt,deleteAlarm:_t,deleteMaterial:ut,getDaysLeft:C,getExamDate:D,getStreak:E,getSubjectPct:w,getTotalHours:T,getTotalPct:We,hideAddForm:st,logToday:rt,saveEdit:mt,saveNewAlarm:ht,saveSubjectNote:nt,searchMats:at,setActiveSubject:$e,setExamDate:Je,setHours:tt,setMatFilter:it,setMood:et,setTimerMode:yt,showAddForm:ot,startEdit:ft,switchView:Ze,toggleAlarm:vt,togglePin:dt,toggleTopic:Qe,updateNewMat:ct});var bt=[{label:`Classic`,work:25,short:5,long:15},{label:`Short`,work:15,short:3,long:10},{label:`Deep`,work:50,short:10,long:20},{label:`Custom`,work:25,short:5,long:15}],O=[`Focus is the bridge between setting a goal and achieving it.`,`Small daily improvements lead to stunning long-term results.`,`The secret of getting ahead is getting started.`,`One focused session at a time. You've got this!`,`Discipline is choosing what you want most over what you want now.`,`Every expert was once a beginner. Keep going.`,`The exam is near — but so is your success!`,`Concentration is the root of all higher abilities.`],k={running:!1,mode:`work`,timeLeft:1500,sessions:0,interval:null,subject:``,subjectHours:{},breakOverlay:!1,isFullScreen:!1,workMins:25,shortBreak:5,longBreak:15,preset:0,taskName:``,soundOn:!0,sessionLog:[],quoteIdx:Math.floor(Math.random()*O.length)};try{k.subjectHours=JSON.parse(localStorage.getItem(`pom_subHours`)||`{}`)}catch{}try{let e=JSON.parse(localStorage.getItem(`pom_settings`)||`null`);e&&(k.workMins=e.workMins||25,k.shortBreak=e.shortBreak||5,k.longBreak=e.longBreak||15,k.preset=e.preset||0,k.soundOn=e.soundOn!==!1)}catch{}try{k.sessionLog=JSON.parse(localStorage.getItem(`pom_sessionLog`)||`[]`)}catch{}document.addEventListener(`keydown`,e=>{r.view===`pomodoro`&&e.target.tagName!==`INPUT`&&e.target.tagName!==`TEXTAREA`&&(e.code===`Space`&&(e.preventDefault(),k.running?kt():Dt()),e.code===`KeyR`&&!e.ctrlKey&&!e.metaKey&&(e.preventDefault(),At()))});function xt(){localStorage.setItem(`pom_subHours`,JSON.stringify(k.subjectHours)),g(`pomSubjectHours`,k.subjectHours)}function St(){localStorage.setItem(`pom_settings`,JSON.stringify({workMins:k.workMins,shortBreak:k.shortBreak,longBreak:k.longBreak,preset:k.preset,soundOn:k.soundOn}))}function Ct(){try{localStorage.setItem(`pom_sessionLog`,JSON.stringify(k.sessionLog.slice(-50)))}catch{}}function wt(e){let t=bt[e];k.preset=e,e!==3&&(k.workMins=t.work,k.shortBreak=t.short,k.longBreak=t.long),St(),k.running||(k.mode=`work`,k.timeLeft=k.workMins*60),B()}function Tt(){let e=parseInt(document.getElementById(`pom-custom-work`)?.value)||25,t=parseInt(document.getElementById(`pom-custom-short`)?.value)||5,n=parseInt(document.getElementById(`pom-custom-long`)?.value)||15;k.workMins=Math.max(1,Math.min(90,e)),k.shortBreak=Math.max(1,Math.min(30,t)),k.longBreak=Math.max(1,Math.min(60,n)),k.preset=3,St(),k.running||(k.mode=`work`,k.timeLeft=k.workMins*60),y(`✅ Custom timer set!`,`success`),B()}function Et(){k.soundOn=!k.soundOn,St(),B()}function Dt(){if(k.running)return;if(!k.subject){y(`⚠️ Please select a subject first!`,`alarm`);return}k.running=!0,k.breakOverlay=!1,k.quoteIdx=Math.floor(Math.random()*O.length);let e=k.workMins*60,t=k.shortBreak*60,n=k.longBreak*60;k.interval=setInterval(()=>{if(k.running){if(k.timeLeft--,k.mode===`work`&&k.subject&&(k.subjectHours[k.subject]=(k.subjectHours[k.subject]||0)+1,xt()),k.timeLeft<=0){if(k.running=!1,clearInterval(k.interval),k.mode===`work`){k.sessions++,k.sessionLog.push({subject:k.subject,duration:e,mode:`work`,timestamp:Date.now()}),Ct();let r=k.sessions%4==0;k.mode=r?`longbreak`:`break`,k.timeLeft=r?n:t,k.breakOverlay=!0,y(r?`🎉 4 sessions done! Long break time! 🏆`:`✅ Pomodoro done! Break time 🎉`,`success`),H(),k.soundOn&&Ot(),B();return}k.sessionLog.push({subject:k.subject,duration:k.mode===`longbreak`?n:t,mode:k.mode,timestamp:Date.now()}),Ct(),k.mode=`work`,k.timeLeft=e,k.breakOverlay=!1,y(`⏰ Break over! Back to work 💪`,`info`),k.soundOn&&Ot(),B();return}A()}},1e3),A()}function Ot(){try{let e=new(window.AudioContext||window.webkitAudioContext);[523,659,784,1047].forEach((t,n)=>{let r=e.createOscillator(),i=e.createGain();r.connect(i),i.connect(e.destination),r.frequency.value=t,r.type=`sine`,i.gain.setValueAtTime(0,e.currentTime+n*.18),i.gain.linearRampToValueAtTime(.18,e.currentTime+n*.18+.05),i.gain.linearRampToValueAtTime(0,e.currentTime+n*.18+.32),r.start(e.currentTime+n*.18),r.stop(e.currentTime+n*.18+.35)})}catch{}}function kt(){k.running=!1,clearInterval(k.interval),A()}function At(){k.running=!1,clearInterval(k.interval),k.mode=`work`,k.timeLeft=k.workMins*60,k.breakOverlay=!1,A(),B()}function jt(){k.running=!1,clearInterval(k.interval),k.mode=`work`,k.timeLeft=k.workMins*60,k.breakOverlay=!1,y(`⏭️ Break skipped — back to work!`,`info`),B()}function Mt(){k.breakOverlay=!1,k.running=!0,(k.mode===`longbreak`?k.longBreak:k.shortBreak)*60,k.interval=setInterval(()=>{if(k.running){if(k.timeLeft--,k.timeLeft<=0){k.running=!1,clearInterval(k.interval),k.mode=`work`,k.timeLeft=k.workMins*60,k.breakOverlay=!1,y(`⏰ Break over! Back to work 💪`,`info`),k.soundOn&&Ot(),B();return}A()}},1e3),A(),B()}function Nt(){!document.fullscreenElement&&!document.webkitFullscreenElement?((document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen||function(){}).call(document.documentElement),k.isFullScreen=!0,setTimeout(()=>{let e=document.getElementById(`pom-fs-overlay`);e||(e=document.createElement(`div`),e.id=`pom-fs-overlay`,document.body.appendChild(e)),e.style.cssText=`position:fixed;inset:0;background:#08080f;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0`,It(e),Pt=setInterval(()=>It(e),500)},100)):((document.exitFullscreen||document.webkitExitFullscreen||function(){}).call(document),k.isFullScreen=!1,Ft())}var Pt=null;function Ft(){clearInterval(Pt);let e=document.getElementById(`pom-fs-overlay`);e&&e.remove()}function It(e){let t=Math.floor(k.timeLeft/60).toString().padStart(2,`0`),n=(k.timeLeft%60).toString().padStart(2,`0`),r=_().find(e=>e.id===k.subject),i=k.mode===`work`?`#FFE66D`:k.mode===`longbreak`?`#C77DFF`:`#06D6A0`;e.innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;gap:0;padding:40px">
      <div style="font-size:11px;letter-spacing:4px;color:#555;text-transform:uppercase;margin-bottom:18px">${k.mode===`work`?`🍅 Focus Time`:k.mode===`longbreak`?`🏆 Long Break`:`☕ Short Break`}</div>
      <div style="font-size:min(22vw,260px);font-weight:300;color:${i};font-family:monospace;line-height:1;letter-spacing:4px;text-shadow:0 0 80px ${i}44;user-select:none">${t}:${n}</div>
      <div style="font-size:12px;color:#444;letter-spacing:3px;margin-top:14px">${k.running?`● RUNNING`:k.mode===`work`?`READY`:`PAUSED`}</div>
      ${r?`<div style="margin-top:10px;font-size:14px;color:${r.color};font-weight:bold;letter-spacing:1px">${r.icon} ${r.name}</div>`:``}
      ${k.taskName?`<div style="margin-top:6px;font-size:12px;color:#555;font-style:italic">${v(k.taskName)}</div>`:``}
      <div style="display:flex;gap:14px;margin-top:36px;flex-wrap:wrap;justify-content:center">
        ${k.running?``:`<button onclick="pomStart()" style="background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border:none;padding:14px 36px;border-radius:12px;font-size:16px;cursor:pointer;font-weight:bold;letter-spacing:0.5px">&#9654; Start</button>`}
        ${k.running?`<button onclick="pomPause()" style="background:#1a1a28;border:1px solid #333;color:#ccc;padding:14px 28px;border-radius:12px;font-size:16px;cursor:pointer">&#9646;&#9646; Pause</button>`:``}
        <button onclick="pomReset()" style="background:#1a1a28;border:1px solid #333;color:#ccc;padding:14px 28px;border-radius:12px;font-size:16px;cursor:pointer">&#8635; Reset</button>
        <button onclick="pomToggleFullScreen()" style="background:#1a1a28;border:1px solid #333;color:#666;padding:14px 20px;border-radius:12px;font-size:14px;cursor:pointer">&#10005; Exit</button>
      </div>
      <div style="display:flex;justify-content:center;gap:10px;margin-top:28px">
        ${[1,2,3,4].map(e=>`<div style="width:12px;height:12px;border-radius:50%;background:${e<=k.sessions%4||k.sessions>0&&k.sessions%4==0&&e===4?`#FFE66D`:`#1e1e2e`};box-shadow:${e<=k.sessions%4||k.sessions>0&&k.sessions%4==0&&e===4?`0 0 8px #FFE66D88`:`none`}"></div>`).join(``)}
      </div>
      <div style="margin-top:20px;font-size:11px;color:#222;font-style:italic">"${O[k.quoteIdx]}"</div>
    </div>`}window.addEventListener(`popstate`,()=>{r.view===`neetjee`&&a.tab!==`home`&&(a.tab=`home`,Ze(`neetjee`))});function Lt(){!document.fullscreenElement&&!document.webkitFullscreenElement&&(k.isFullScreen=!1,Ft())}document.addEventListener(`fullscreenchange`,Lt),document.addEventListener(`webkitfullscreenchange`,Lt);function Rt(e){k.subject=e,B()}function zt(e){let t=k.subjectHours[e]||0,n=Math.floor(t/3600),r=Math.floor(t%3600/60);return n>0?n+`h `+r+`m`:r+`m`}function Bt(){let e=Object.values(k.subjectHours).reduce((e,t)=>e+t,0),t=Math.floor(e/3600),n=Math.floor(e%3600/60);return t>0?t+`h `+n+`m`:n+`m`}function A(){let e=document.getElementById(`pom-display`);if(!e)return;let t=Math.floor(k.timeLeft/60).toString().padStart(2,`0`),n=(k.timeLeft%60).toString().padStart(2,`0`);e.textContent=`${t}:${n}`;let r=document.getElementById(`pom-label`);r&&(r.textContent=k.mode===`work`?`🍅 Focus Time`:k.mode===`longbreak`?`🏆 Long Break`:`☕ Short Break`);let i=k.mode===`work`?k.workMins*60:k.mode===`longbreak`?k.longBreak*60:k.shortBreak*60,a=1-k.timeLeft/i,o=document.getElementById(`pom-ring-fill`);if(o){let e=2*Math.PI*90;o.style.strokeDasharray=e,o.style.strokeDashoffset=e*(1-a),o.style.stroke=k.mode===`work`?`#FFE66D`:k.mode===`longbreak`?`#C77DFF`:`#06D6A0`}let s=document.getElementById(`pom-status`);s&&(s.textContent=k.running?`● RUNNING`:k.mode===`work`?`READY`:`PAUSED`),k.running?document.title=`⏱ ${t}:${n} ${k.mode===`work`?`📚`:`☕`} — Exam Is Near`:document.title=`Exam Is Near — Study Smart | by ArkSetu`}function Vt(){let e=Math.floor(k.timeLeft/60).toString().padStart(2,`0`),t=(k.timeLeft%60).toString().padStart(2,`0`),n=_(),r=k.mode===`work`?k.workMins*60:k.mode===`longbreak`?k.longBreak*60:k.shortBreak*60,i=1-k.timeLeft/r,a=2*Math.PI*90,o=a*(1-i),s=k.mode===`work`?`#FFE66D`:k.mode===`longbreak`?`#C77DFF`:`#06D6A0`,c=n.find(e=>e.id===k.subject),l=k.mode===`longbreak`,u=k.breakOverlay?`
    <div style="position:fixed;inset:0;background:#00000099;z-index:9998;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)">
      <div style="background:#0f0f18;border:2px solid ${l?`#C77DFF`:`#06D6A0`};border-radius:20px;padding:40px 32px;text-align:center;max-width:380px;width:92%;animation:fadeInUp 0.3s ease">
        <div style="font-size:60px;margin-bottom:12px;animation:float 2s ease-in-out infinite">${l?`🏆`:`☕`}</div>
        <div style="font-size:22px;font-weight:bold;color:${l?`#C77DFF`:`#06D6A0`};margin-bottom:6px">${l?`Long Break Earned!`:`Session Complete!`}</div>
        <div style="font-size:13px;color:#888;margin-bottom:4px">Session <b style="color:#FFE66D">${k.sessions}</b> done${c?` · `+v(c.icon+` `+c.name):``}</div>
        ${l?`<div style="font-size:12px;color:#C77DFF;margin-bottom:4px;font-weight:bold">🎉 4 sessions completed! You've earned a long break!</div>`:``}
        <div style="font-size:13px;color:#555;margin-bottom:28px;line-height:1.8">${l?`Enjoy a well-deserved `+k.longBreak+`-minute break.`:`You've earned a `+k.shortBreak+`-minute break.<br>Your brain will thank you!`}</div>
        <div style="font-size:11px;color:#333;font-style:italic;margin-bottom:20px;padding:10px;background:#0a0a12;border-radius:8px">"${O[k.quoteIdx]}"</div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn-gold" onclick="pomStartBreak()" style="padding:13px 26px;font-size:14px">${l?`🏆`:`☕`} Start Break (${l?k.longBreak:k.shortBreak} min)</button>
          <button class="btn-ghost" onclick="pomSkipBreak()" style="padding:13px 20px;font-size:13px;color:#FF6B35;border-color:#FF6B3544">⏭ Skip Break</button>
        </div>
      </div>
    </div>`:``,d=n.filter(e=>k.subjectHours[e.id]>0).map(e=>`
    <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:#0a0a12;border-radius:8px;border:1px solid #1e1e2e">
      <span style="font-size:18px">${e.icon}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;color:#ccc;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${v(e.name)}</div>
        <div style="height:3px;background:#111;border-radius:2px;margin-top:5px;overflow:hidden">
          <div style="height:100%;width:${Math.min(100,(k.subjectHours[e.id]||0)/3600*20)}%;background:${e.color};border-radius:2px;transition:width 0.5s"></div>
        </div>
      </div>
      <div style="font-size:13px;font-weight:bold;color:${e.color};flex-shrink:0">${zt(e.id)}</div>
    </div>`).join(``),f=k.sessionLog.filter(e=>e.mode===`work`).slice(-5).reverse();return`${u}
  <div id="pom-fullscreen-wrap" style="background:#08080f;min-height:100%">
  <div class="fade-in" style="width:100%;padding:22px 24px 40px">

    <!-- Header row -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:20px;font-weight:bold;letter-spacing:0.3px">🍅 Pomodoro Timer</div>
        <div style="font-size:10px;color:#444;letter-spacing:1.5px;text-transform:uppercase;margin-top:3px">Focus · Flow · Succeed · Exam Is Near</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="font-size:12px;color:#444">Sessions: <span style="color:#06D6A0;font-weight:bold;font-size:15px">${k.sessions}</span>${k.sessions>0?` &nbsp;·&nbsp; <span style="color:#FFE66D;font-weight:bold">${Bt()}</span> total`:``}</div>
        <button onclick="pomToggleSound()" title="Toggle sound" style="background:#0f0f18;border:1px solid #2a2a3a;color:${k.soundOn?`#FFE66D`:`#444`};padding:7px 12px;border-radius:10px;font-family:inherit;font-size:13px;cursor:pointer;transition:all 0.2s">${k.soundOn?`🔔`:`🔕`}</button>
        <button onclick="pomToggleFullScreen()" style="background:#0f0f18;border:1px solid #2a2a3a;color:#888;padding:7px 15px;border-radius:10px;font-family:inherit;font-size:12px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor='#FFE66D';this.style.color='#FFE66D'" onmouseout="this.style.borderColor='#2a2a3a';this.style.color='#888'">⛶ Full Screen</button>
      </div>
    </div>

    <!-- TWO-COLUMN MAIN LAYOUT -->
    <div style="display:grid;grid-template-columns:minmax(280px,420px) 1fr;gap:20px;align-items:start">

      <!-- LEFT: Timer -->
      <div>
        <!-- Preset selector -->
        <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
          ${bt.map((e,t)=>`<button onclick="pomSetPreset(${t})"
            style="flex:1;min-width:60px;padding:7px 4px;border-radius:8px;font-family:inherit;font-size:11px;cursor:pointer;transition:all 0.2s;border:1px solid ${k.preset===t?s:`#222`};background:${k.preset===t?s+`22`:`#0f0f18`};color:${k.preset===t?s:`#555`};font-weight:${k.preset===t?`bold`:`normal`}">
            ${e.label}${t<3?`<div style="font-size:9px;opacity:0.7;margin-top:2px">${e.work}m</div>`:`<div style='font-size:9px;opacity:0.7;margin-top:2px'>Set</div>`}
          </button>`).join(``)}
        </div>

        <!-- Custom timer inputs (show when Custom preset selected) -->
        ${k.preset===3?`
        <div class="card" style="margin-bottom:14px;padding:14px;border-color:#333">
          <div class="section-label" style="margin-bottom:10px">⚙️ Custom Duration</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px">
            <div><div style="font-size:10px;color:#555;margin-bottom:4px">Work (min)</div><input id="pom-custom-work" type="number" min="1" max="90" value="${k.workMins}" style="text-align:center;font-size:14px;font-weight:bold;color:#FFE66D"/></div>
            <div><div style="font-size:10px;color:#555;margin-bottom:4px">Short break</div><input id="pom-custom-short" type="number" min="1" max="30" value="${k.shortBreak}" style="text-align:center;font-size:14px;font-weight:bold;color:#06D6A0"/></div>
            <div><div style="font-size:10px;color:#555;margin-bottom:4px">Long break</div><input id="pom-custom-long" type="number" min="1" max="60" value="${k.longBreak}" style="text-align:center;font-size:14px;font-weight:bold;color:#C77DFF"/></div>
          </div>
          <button class="btn-gold" onclick="pomApplyCustom()" style="width:100%;padding:9px;font-size:12px">✅ Apply Custom</button>
        </div>`:``}

        <div class="card" style="padding:32px 24px;text-align:center;border-color:${k.mode===`work`?`#FFE66D33`:k.mode===`longbreak`?`#C77DFF33`:`#06D6A033`};background:linear-gradient(160deg,#0f0f18,#12121f)">
          <div id="pom-label" style="font-size:11px;color:#888;margin-bottom:18px;letter-spacing:3px;text-transform:uppercase">${k.mode===`work`?`🍅 Focus Time`:k.mode===`longbreak`?`🏆 Long Break`:`☕ Short Break`}</div>

          <!-- SVG Ring -->
          <div style="position:relative;display:inline-block;margin-bottom:18px">
            <svg width="240" height="240" viewBox="0 0 260 260" style="transform:rotate(-90deg)">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:${s};stop-opacity:1"/>
                  <stop offset="100%" style="stop-color:${k.mode===`work`?`#ff6b35`:k.mode===`longbreak`?`#a78bfa`:`#059669`};stop-opacity:1"/>
                </linearGradient>
              </defs>
              <circle cx="130" cy="130" r="100" fill="none" stroke="#0d0d18" stroke-width="2"/>
              <circle cx="130" cy="130" r="90" fill="none" stroke="#1a1a28" stroke-width="18"/>
              <circle id="pom-ring-fill" cx="130" cy="130" r="90" fill="none" stroke="url(#ringGrad)" stroke-width="18"
                stroke-linecap="round"
                style="stroke-dasharray:${a};stroke-dashoffset:${o};transition:stroke-dashoffset 1s linear,stroke 0.5s;filter:drop-shadow(0 0 10px ${s}88)"/>
            </svg>
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
              <div id="pom-display" style="font-size:58px;font-weight:bold;color:${s};font-family:monospace;line-height:1;text-shadow:0 0 30px ${s}55">${e}:${t}</div>
              <div id="pom-status" style="font-size:10px;color:#444;margin-top:6px;letter-spacing:2px">${k.running?`● RUNNING`:k.mode===`work`?`READY`:`PAUSED`}</div>
              ${c?`<div style="margin-top:6px;font-size:11px;color:${c.color};font-weight:bold">${c.icon} ${v(c.name)}</div>`:``}
            </div>
          </div>

          <!-- Task input -->
          <div style="margin-bottom:16px">
            <input placeholder="What are you working on? (optional)" value="${v(k.taskName)}"
              oninput="pomState.taskName=this.value"
              style="text-align:center;font-size:12px;color:#888;background:#0a0a12;border-color:#1e1e2e"/>
          </div>

          <!-- Controls -->
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn-gold" onclick="pomStart()" ${k.running?`disabled`:``} style="padding:13px 30px;font-size:14px;${k.running?`opacity:0.45;cursor:not-allowed`:``}">▶ ${k.running?`Running…`:`Start`}</button>
            <button class="btn-ghost" onclick="pomPause()" style="padding:13px 22px;font-size:14px" title="Pause (Space)">⏸</button>
            <button class="btn-ghost" onclick="pomReset()" style="padding:13px 22px;font-size:14px" title="Reset (R)">↺</button>
          </div>

          <!-- Keyboard hint -->
          <div style="font-size:10px;color:#1e1e2e;margin-top:10px;letter-spacing:1px">SPACE = Start/Pause &nbsp;·&nbsp; R = Reset</div>

          <!-- Session dots -->
          <div style="display:flex;justify-content:center;gap:8px;margin-top:18px">
            ${[1,2,3,4].map(e=>`<div style="width:10px;height:10px;border-radius:50%;background:${e<=k.sessions%4||k.sessions>0&&k.sessions%4==0&&e===4?`#FFE66D`:`#1e1e2e`};transition:background 0.4s;box-shadow:${e<=k.sessions%4||k.sessions>0&&k.sessions%4==0&&e===4?`0 0 6px #FFE66D88`:`none`}"></div>`).join(``)}
          </div>
          <div style="font-size:10px;color:#222;margin-top:6px;letter-spacing:1px">4 SESSIONS → LONG BREAK (${k.longBreak} min)</div>
        </div>

        <!-- Motivational quote -->
        ${k.running?`
        <div style="margin-top:12px;padding:12px 16px;background:#0a0a12;border:1px solid #1a1a28;border-radius:10px;text-align:center">
          <div style="font-size:11px;color:#333;font-style:italic">"${O[k.quoteIdx]}"</div>
        </div>`:``}

        <!-- How it works -->
        <div class="card" style="margin-top:14px">
          <div class="section-label">ℹ️ How It Works</div>
          <div style="font-size:12px;color:#555;line-height:2.1">
            1️⃣ Pick a subject &amp; set a task<br>
            2️⃣ Hit <b style="color:#FFE66D">Start</b> — focus session begins<br>
            3️⃣ Break overlay appears — take it or skip it<br>
            4️⃣ Every <b style="color:#C77DFF">4 sessions</b> = ${k.longBreak}-min long break 🏆<br>
            📊 Hours tracked per subject automatically &amp; synced!
          </div>
        </div>
      </div>

      <!-- RIGHT: Subject + Stats -->
      <div style="display:flex;flex-direction:column;gap:14px">

        <!-- Subject Selector -->
        <div class="card" style="border-color:${c?c.color+`55`:`#2a2a3a`}">
          <div class="section-label" style="margin-bottom:12px">📚 Choose Subject</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${n.map(e=>`<button onclick="pomSetSubject('${e.id}')"
              style="background:${k.subject===e.id?e.color+`22`:`#0a0a12`};border:1px solid ${k.subject===e.id?e.color:`#1e1e2e`};color:${k.subject===e.id?e.color:`#555`};padding:9px 15px;border-radius:22px;font-family:inherit;font-size:12px;cursor:pointer;transition:all 0.2s;font-weight:${k.subject===e.id?`bold`:`normal`};box-shadow:${k.subject===e.id?`0 0 12px `+e.color+`44`:`none`}">
              ${e.icon} ${v(e.name)}
            </button>`).join(``)}
          </div>
          ${c?`<div style="margin-top:14px;padding:10px 14px;background:#0a0a12;border-radius:10px;border:1px solid ${c.color}33;display:flex;align-items:center;justify-content:space-between">
            <div style="font-size:13px;color:${c.color};font-weight:bold">${c.icon} ${v(c.name)}</div>
            <div style="font-size:12px;color:#FFE66D;font-weight:bold">⏱ ${zt(c.id)} logged</div>
          </div>`:`<div style="margin-top:12px;font-size:12px;color:#333;text-align:center;padding:8px">← Select a subject to begin</div>`}
        </div>

        <!-- Study Hours per Subject -->
        <div class="card" style="flex:1">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:6px">
            <div class="section-label" style="margin-bottom:0">📊 Study Hours by Subject</div>
            ${Object.keys(k.subjectHours).length>0?`<button onclick="if(confirm('Clear all study hour data?')){pomState.subjectHours={};pomSaveHours();render();}" style="background:none;border:1px solid #2a2a3a;color:#444;padding:4px 10px;border-radius:6px;font-family:inherit;font-size:10px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.color='#FF6B35';this.style.borderColor='#FF6B3544'" onmouseout="this.style.color='#444';this.style.borderColor='#2a2a3a'">🗑 Clear</button>`:``}
          </div>
          ${d?`<div style="display:flex;flex-direction:column;gap:8px">${d}</div>`:`<div style="text-align:center;padding:40px 0;color:#2a2a3a">
              <div style="font-size:36px;margin-bottom:10px">📭</div>
              <div style="font-size:13px">No data yet</div>
              <div style="font-size:11px;margin-top:4px;color:#222">Start a session to track your hours</div>
            </div>`}
          <!-- All subjects summary even if 0 -->
          ${d?``:n.map(e=>`
            <div style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:8px;opacity:0.35">
              <span style="font-size:16px">${e.icon}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:11px;color:#555">${v(e.name)}</div>
                <div style="height:2px;background:#111;border-radius:2px;margin-top:4px"></div>
              </div>
              <div style="font-size:11px;color:#333">0m</div>
            </div>`).join(``)}
        </div>

        <!-- Recent session log -->
        ${f.length>0?`
        <div class="card">
          <div class="section-label" style="margin-bottom:10px">🕓 Recent Sessions</div>
          ${f.map(e=>{let t=n.find(t=>t.id===e.subject),r=Math.floor(e.duration/60),i=new Date(e.timestamp),a=i.getHours().toString().padStart(2,`0`)+`:`+i.getMinutes().toString().padStart(2,`0`);return`<div style="display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:7px;background:#0a0a12;margin-bottom:5px">
              <span style="font-size:14px">${t?.icon||`📚`}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:11px;color:#aaa;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${v(t?.name||e.subject)}</div>
                <div style="font-size:10px;color:#333">${a}</div>
              </div>
              <div style="font-size:11px;font-weight:bold;color:#FFE66D;flex-shrink:0">${r}m</div>
            </div>`}).join(``)}
        </div>`:``}

      </div>

    </div><!-- end grid -->
  </div>
  </div>`}typeof window<`u`&&Object.assign(window,{POM_PRESETS:bt,POM_QUOTES:O,_pomFSChange:Lt,pomApplyCustom:Tt,pomCleanupFS:Ft,pomFSInterval:Pt,pomGetSubjectHoursFormatted:zt,pomPause:kt,pomPlayChime:Ot,pomRenderFSOverlay:It,pomReset:At,pomSaveHours:xt,pomSaveLog:Ct,pomSaveSettings:St,pomSetPreset:wt,pomSetSubject:Rt,pomSkipBreak:jt,pomStart:Dt,pomStartBreak:Mt,pomState:k,pomToggleFullScreen:Nt,pomToggleSound:Et,pomTotalHoursFormatted:Bt,renderPomodoro:Vt,updatePomDisplay:A});var j={questions:[],current:0,selected:null,score:0,done:!1,generating:!1,subSel:``,unitSel:``,countSel:`15`,showHistory:!1,doneFilter:`All`,reviewFilter:`All`,reviewId:null,openReviewId:null};m._proStatusCache=!1,m.quizLog=JSON.parse(localStorage.getItem(`ein_quiz_log`)||`[]`),m.flashLog=JSON.parse(localStorage.getItem(`ein_flash_log`)||`[]`);var Ht=100,Ut=100;function Wt(e){j.openReviewId=j.openReviewId===e?null:e,j.reviewFilter=`All`,B()}function Gt(){localStorage.setItem(`ein_quiz_log`,JSON.stringify(m.quizLog.slice(-100))),ee||(clearTimeout(g._timer),g._timer=setTimeout(c,1200))}function Kt(){localStorage.setItem(`ein_flash_log`,JSON.stringify(m.flashLog.slice(-100))),ee||(clearTimeout(g._timer),g._timer=setTimeout(c,1200))}async function qt(e,t){let n=j.subSel||``;if(!n){y(`⚠️ Please select a subject first`,`alarm`);return}if(!await Y()){if($.freeQuizCount>=3){y(`⭐ Free limit reached (3 quizzes). Upgrade to Pro for unlimited quizzes!`,`alarm`),G();return}$.freeQuizCount=jr(`ein_free_quiz_day`)}let r=await Y(),i=parseInt(t)||15,a=r?i:Math.min(i,20);!r&&i>20&&(y(`⭐ 50-question quizzes are Pro only. Generating 20 Qs instead — upgrade to Pro!`,`alarm`),G());let o=_().find(e=>e.id===n)?.name||n,s=e?e+` (`+o+`)`:o;j.generating=!0,B();let c=await Hr(s,a);if(!c){j.generating=!1,B();return}j.questions=c,j.current=0,j.selected=null,j.score=0,j.done=!1,j.generating=!1,j.userAnswers=[],B(),y(`🧠 `+a+`-Q quiz ready`+(e?` · `+e:``)+`! Good luck!`,`success`)}function Jt(e){j.selected===null&&(j.selected=e,j.questions[j.current]&&(e===j.questions[j.current].answer&&j.score++,j.userAnswers||=[],j.userAnswers[j.current]=e,B()))}function Yt(){j.current<j.questions.length-1?(j.current++,j.selected=null,B()):(j.done=!0,B(),j.score===j.questions.length&&H(),Y().then(e=>{if(!e)return;let t=j.subSel||``,n=_().find(e=>e.id===t)?.name||t;m.quizLog.unshift({id:Date.now(),subject:t,subjectName:n,chapter:j.unitSel||`All Chapters`,score:j.score,total:j.questions.length,pct:Math.round(j.score/j.questions.length*100),date:new Date().toISOString(),questions:j.questions.map((e,t)=>({q:e.q,options:e.options,answer:e.answer,userAnswer:(j.userAnswers||[])[t]??null,correct:(j.userAnswers||[])[t]===e.answer,difficulty:e.difficulty||null,explanation:e.explanation||``}))}),Gt()}))}function Xt(){let e=j.questions[j.current];if(j.reviewId){let e=m.quizLog.find(e=>e.id===j.reviewId)||null;if(e){let t=e.questions||[],n=t.filter(e=>e.correct).length,r=t.filter(e=>!e.correct&&e.userAnswer!==null).length,i=t.filter(e=>e.userAnswer===null).length,a=e.pct>=70?`#06D6A0`:e.pct>=50?`#FFE66D`:`#FF6B35`;return`<div class="fade-in">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
          <button class="btn-ghost" onclick="quizState.reviewId=null;render()" style="font-size:12px;padding:6px 12px">← Logs</button>
          <div>
            <div style="font-size:16px;font-weight:bold;color:#EDE8E0">${v(e.subjectName)} — ${v(e.chapter)}</div>
            <div style="font-size:11px;color:#555">${new Date(e.date).toLocaleDateString(`en-IN`,{weekday:`short`,day:`numeric`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`})}</div>
          </div>
        </div>

        <!-- Score Summary Bar -->
        <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:14px;padding:18px;margin-bottom:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-size:28px;font-weight:800;color:${a}">${e.pct}%</div>
            <div style="text-align:right">
              <div style="font-size:13px;color:#ccc">${e.score}/${e.total} correct</div>
              <div style="font-size:11px;color:#555">${e.total}-question quiz</div>
            </div>
          </div>
          <div style="height:6px;background:#111;border-radius:3px;overflow:hidden;margin-bottom:12px">
            <div style="height:100%;background:${a};width:${e.pct}%;border-radius:3px;transition:width 0.5s"></div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <span style="font-size:11px;background:#0a2a0a;border:1px solid #06D6A044;color:#06D6A0;border-radius:8px;padding:4px 12px">✅ ${n} Correct</span>
            <span style="font-size:11px;background:#2a0a0a;border:1px solid #FF6B3544;color:#FF6B35;border-radius:8px;padding:4px 12px">❌ ${r} Wrong</span>
            ${i?`<span style="font-size:11px;background:#1a1a0a;border:1px solid #55555544;color:#555;border-radius:8px;padding:4px 12px">⬜ ${i} Skipped</span>`:``}
          </div>
        </div>

        <!-- Filter tabs -->
        <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
          ${[`All`,`Correct`,`Wrong`].map(e=>`
            <button onclick="quizState.reviewFilter='${e}';render()" style="font-size:11px;padding:5px 14px;border-radius:20px;border:1px solid ${(j.reviewFilter||`All`)===e?`#FFE66D`:`#222`};background:${(j.reviewFilter||`All`)===e?`#FFE66D22`:`transparent`};color:${(j.reviewFilter||`All`)===e?`#FFE66D`:`#555`};cursor:pointer;font-family:inherit">${e}</button>
          `).join(``)}
        </div>

        <!-- Question List -->
        <div style="display:flex;flex-direction:column;gap:12px">
          ${t.filter(e=>{let t=j.reviewFilter||`All`;return t===`Correct`?e.correct:t!==`Wrong`||!e.correct}).map((e,n)=>{let r=t.indexOf(e),i=e.correct,a=i?`#06D6A044`:`#FF6B3544`,o=i?`#0a1a0a`:`#1a0a0a`,s=e.difficulty===`hard`?`#FF6B35`:e.difficulty===`medium`?`#FFE66D`:`#06D6A0`;return`<div style="background:${o};border:1px solid ${a};border-radius:12px;padding:16px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px">
                <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
                  <span style="font-size:11px;background:#111;border-radius:6px;padding:2px 8px;color:#555">Q${r+1}</span>
                  ${e.difficulty?`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;background:#111;color:${s}">${e.difficulty===`hard`?`🔴 Hard`:e.difficulty===`medium`?`🟡 Med`:`🟢 Easy`}</span>`:``}
                </div>
                <span style="font-size:14px">${i?`✅`:`❌`}</span>
              </div>
              <div style="font-size:13px;color:#EDE8E0;line-height:1.6;margin-bottom:12px">${v(e.q)}</div>
              ${(e.options||[]).length>0?(e.options||[]).map((t,n)=>{let r=n===e.answer,i=n===e.userAnswer,a=`#0f0f18`,o=`#1e1e2e`,s=`#666`,c=``;return r&&(a=`#0a2a0a`,o=`#06D6A0`,s=`#06D6A0`,c=`✓ `),i&&!r&&(a=`#2a0a0a`,o=`#FF6B35`,s=`#FF6B35`,c=`✗ `),`<div style="background:${a};border:1px solid ${o};color:${s};padding:8px 12px;border-radius:8px;font-size:12px;margin-bottom:6px;line-height:1.4">${c}${String.fromCharCode(65+n)}. ${v(t)}</div>`}).join(``):`<div style="font-size:11px;color:#444;font-style:italic;padding:6px 0">Options not stored for this entry — only new quizzes log full options</div>`}
              ${e.explanation?`<div style="margin-top:10px;padding:10px 12px;background:#08080f;border-left:3px solid #FFE66D44;border-radius:0 8px 8px 0;font-size:12px;color:#888;line-height:1.6">💡 ${v(e.explanation)}</div>`:``}
            </div>`}).join(``)}
        </div>
      </div>`}}return`<div class="fade-in">
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
      <div style="font-size:18px;font-weight:bold">🧠 AI Quiz</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <select style="font-size:11px;padding:6px" onchange="quizState.subSel=this.value;quizState.unitSel='';render()">
          <option value="">— Select Subject —</option>
          ${_().map(e=>`<option value="${e.id}" ${j.subSel===e.id?`selected`:``}>${e.icon} ${e.name}</option>`).join(``)}
        </select>
        <select style="font-size:11px;padding:6px" onchange="quizState.unitSel=this.value">
          <option value="">All Chapters</option>
          ${(_().find(e=>e.id===j.subSel)?.units||[]).map(e=>`<option value="${v(e.name)}" ${j.unitSel===v(e.name)?`selected`:``}>${v(e.name)}</option>`).join(``)}
        </select>
        <select style="font-size:11px;padding:6px" onchange="quizState.countSel=this.value">
          ${[`10`,`15`,`20`,`50`].map(e=>`<option value="${e}" ${(j.countSel||`15`)===e?`selected`:``}>${e} Questions${e===`50`?` ⭐ Pro`:``}</option>`).join(``)}
        </select>
        <button class="btn-gold" onclick="startQuiz(quizState.unitSel||null, quizState.countSel||15)" ${j.generating||!j.subSel?`disabled`:``}>
          ${j.generating?`⏳ Generating…`:`✨ Start Quiz`}
        </button>
      </div>
    </div>
    ${j.questions.length===0?`
      <div class="empty-state">
        <div style="font-size:48px;margin-bottom:12px">🧠</div>
        <div style="font-size:14px;margin-bottom:6px">AI-Powered Quiz</div>
        <div style="font-size:12px;color:#444">Select a subject and click "Start Quiz" to test yourself!</div>
        ${m._proStatusCache?``:`<div style='margin-top:10px;font-size:11px;color:#FFE66D88;background:#1a1200;border:1px solid #FFE66D22;border-radius:8px;padding:6px 12px;display:inline-block'>Free: `+Math.max(0,3-$.freeQuizCount)+` quiz attempts left this session · <span style='color:#FFE66D;cursor:pointer' onclick='openProModal()'>Go Pro for unlimited ⭐</span></div>`}
      </div>`:j.done?`
      <div>
        <!-- ── Score Card ── -->
        <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:16px;padding:28px;text-align:center;margin-bottom:16px">
          <div style="font-size:48px;margin-bottom:12px">${j.score===j.questions.length?`🏆`:j.score>=j.questions.length*.7?`🎯`:`📊`}</div>
          <div style="font-size:22px;font-weight:bold;color:#FFE66D;margin-bottom:6px">Quiz Complete!</div>
          <div style="font-size:40px;font-weight:800;color:#EDE8E0;margin-bottom:2px">${j.score}<span style="font-size:20px;color:#444">/${j.questions.length}</span></div>
          <div style="font-size:13px;color:#555;margin-bottom:14px">${Math.round(j.score/j.questions.length*100)}% accuracy</div>
          <!-- Progress bar -->
          <div style="height:6px;background:#111;border-radius:3px;overflow:hidden;margin-bottom:14px">
            <div style="height:100%;width:${Math.round(j.score/j.questions.length*100)}%;background:${j.score/j.questions.length>=.7?`#06D6A0`:j.score/j.questions.length>=.5?`#FFE66D`:`#FF6B35`};border-radius:3px;transition:width 0.5s"></div>
          </div>
          <!-- Stat pills -->
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:16px">
            <span style="font-size:11px;background:#0a2a0a;border:1px solid #06D6A044;color:#06D6A0;border-radius:8px;padding:4px 12px">✅ ${j.score} Correct</span>
            <span style="font-size:11px;background:#2a0a0a;border:1px solid #FF6B3544;color:#FF6B35;border-radius:8px;padding:4px 12px">❌ ${j.questions.length-j.score} Wrong</span>
            ${(()=>{let e=j.questions,t=e.filter(e=>e.difficulty===`hard`).length,n=e.filter(e=>e.difficulty===`medium`).length,r=e.filter(e=>e.difficulty===`easy`).length;return[r?`<span style="font-size:11px;background:#0a1a0a;border:1px solid #06D6A044;color:#06D6A088;border-radius:8px;padding:4px 12px">🟢 ${r} Easy</span>`:``,n?`<span style="font-size:11px;background:#1a1200;border:1px solid #FFE66D44;color:#FFE66D88;border-radius:8px;padding:4px 12px">🟡 ${n} Med</span>`:``,t?`<span style="font-size:11px;background:#2a0a0a;border:1px solid #FF6B3544;color:#FF6B3588;border-radius:8px;padding:4px 12px">🔴 ${t} Hard</span>`:``].join(``)})()}
          </div>
          <div style="font-size:13px;color:#888;margin-bottom:20px">${j.score===j.questions.length?`Perfect score! You're exam-ready 🌟`:j.score>=Math.ceil(j.questions.length*.7)?`Good job! Review the ones you missed 💪`:j.score>=Math.ceil(j.questions.length*.5)?`Keep going — revise the concepts and retry 📚`:`Focus on fundamentals and reattempt 🔁`}</div>
          <button class="btn-gold" onclick="startQuiz(quizState.unitSel||null, quizState.countSel||15)" style="padding:12px 32px">🔁 Try Again</button>
        </div>

        <!-- ── Inline Question Review ── -->
        <div style="margin-bottom:12px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="font-size:14px;font-weight:700;color:#EDE8E0">Question Review</div>
            <div style="display:flex;gap:6px">
              ${[`All`,`Correct`,`Wrong`].map(e=>`
                <button onclick="quizState.doneFilter='${e}';render()" style="font-size:10px;padding:4px 10px;border-radius:12px;border:1px solid ${(j.doneFilter||`All`)===e?`#FFE66D`:`#222`};background:${(j.doneFilter||`All`)===e?`#FFE66D22`:`transparent`};color:${(j.doneFilter||`All`)===e?`#FFE66D`:`#555`};cursor:pointer;font-family:inherit">${e}</button>
              `).join(``)}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${j.questions.filter((e,t)=>{let n=(j.userAnswers||[])[t]===e.answer,r=j.doneFilter||`All`;return r===`Correct`?n:r!==`Wrong`||!n}).map((e,t)=>{let n=j.questions.indexOf(e),r=(j.userAnswers||[])[n],i=r===e.answer,a=e.difficulty===`hard`?`#FF6B35`:e.difficulty===`medium`?`#FFE66D`:`#06D6A0`;return`<div style="background:${i?`#0a1a0a`:`#1a0a0a`};border:1px solid ${i?`#06D6A033`:`#FF6B3533`};border-radius:12px;padding:14px 16px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                  <span style="font-size:10px;background:#111;color:#555;padding:2px 8px;border-radius:6px">Q${n+1}</span>
                  ${e.difficulty?`<span style="font-size:10px;font-weight:700;color:${a}">${e.difficulty===`hard`?`🔴 Hard`:e.difficulty===`medium`?`🟡 Medium`:`🟢 Easy`}</span>`:``}
                  <span style="margin-left:auto;font-size:13px">${i?`✅`:`❌`}</span>
                </div>
                <div style="font-size:13px;color:#EDE8E0;line-height:1.6;margin-bottom:12px;font-weight:500">${v(e.q)}</div>
                <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:${e.explanation?`10px`:`0`}">
                  ${e.options.map((t,n)=>{let i=n===e.answer,a=n===r,o=`#0f0f18`,s=`#1e1e2e`,c=`#555`,l=``;return i&&(o=`#0a2a0a`,s=`#06D6A0`,c=`#06D6A0`,l=`✓ `),a&&!i&&(o=`#2a0a0a`,s=`#FF6B35`,c=`#FF6B35`,l=`✗ `),`<div style="background:${o};border:1px solid ${s};color:${c};padding:8px 12px;border-radius:8px;font-size:12px;line-height:1.4">${l}<b>${String.fromCharCode(65+n)}.</b> ${v(t)}</div>`}).join(``)}
                </div>
                ${e.explanation?`<div style="padding:10px 12px;background:#08080f;border-left:3px solid #FFE66D44;border-radius:0 8px 8px 0;font-size:12px;color:#888;line-height:1.6;margin-top:8px">💡 ${v(e.explanation)}</div>`:``}
              </div>`}).join(``)}
          </div>
        </div>
      </div>`:`
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <span style="font-size:12px;color:#444">Question ${j.current+1}/${j.questions.length}</span>
          <div style="display:flex;align-items:center;gap:8px">
            ${e.difficulty?`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:${e.difficulty===`hard`?`#2a0a0a`:e.difficulty===`medium`?`#1a1200`:`#0a1a0a`};color:${e.difficulty===`hard`?`#FF6B35`:e.difficulty===`medium`?`#FFE66D`:`#06D6A0`};border:1px solid ${e.difficulty===`hard`?`#FF6B3544`:e.difficulty===`medium`?`#FFE66D44`:`#06D6A044`}">${e.difficulty===`hard`?`🔴 Hard`:e.difficulty===`medium`?`🟡 Medium`:`🟢 Easy`}</span>`:``}
            <span style="font-size:12px;color:#06D6A0">Score: ${j.score}</span>
          </div>
        </div>
        <div style="font-size:15px;font-weight:bold;margin-bottom:20px;line-height:1.5">${v(e.q)}</div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
          ${e.options.map((t,n)=>{let r=`#0f0f18`,i=`#222`,a=`#aaa`;return j.selected!==null&&(n===e.answer?(r=`#0a2a0a`,i=`#06D6A0`,a=`#06D6A0`):n===j.selected&&n!==e.answer&&(r=`#2a0a0a`,i=`#FF6B35`,a=`#FF6B35`)),`<button onclick="selectAnswer(${n})" style="background:${r};border:1px solid ${i};color:${a};
              padding:12px 16px;border-radius:10px;text-align:left;font-family:inherit;font-size:13px;cursor:pointer;transition:all 0.2s">
              ${String.fromCharCode(65+n)}. ${v(t)}</button>`}).join(``)}
        </div>
        ${j.selected===null?``:`
          <div style="padding:14px;background:#0a0a12;border-radius:10px;margin-bottom:16px;border-left:3px solid ${j.selected===e.answer?`#06D6A0`:`#FF6B35`}">
            <div style="font-size:13px;font-weight:700;color:${j.selected===e.answer?`#06D6A0`:`#FF6B35`};margin-bottom:6px">
              ${j.selected===e.answer?`✅ Correct!`:`❌ Incorrect — Correct: `+String.fromCharCode(65+e.answer)+`. `+v(e.options[e.answer])}
            </div>
            ${e.explanation?`<div style="font-size:12px;color:#aaa;line-height:1.6;margin-bottom:6px">💡 <b>Explanation:</b> ${v(e.explanation)}</div>`:``}
            ${e.difficulty?`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:${e.difficulty===`hard`?`#2a0a0a`:e.difficulty===`medium`?`#1a1200`:`#0a1a0a`};color:${e.difficulty===`hard`?`#FF6B35`:e.difficulty===`medium`?`#FFE66D`:`#06D6A0`};border:1px solid ${e.difficulty===`hard`?`#FF6B3544`:e.difficulty===`medium`?`#FFE66D44`:`#06D6A044`};text-transform:uppercase;letter-spacing:0.5px">${e.difficulty===`hard`?`🔴 Hard`:e.difficulty===`medium`?`🟡 Medium`:`🟢 Easy`}</span>`:``}
          </div>
          <button class="btn-gold" onclick="nextQuestion()" style="width:100%">${j.current<j.questions.length-1?`Next Question →`:`See Results 🏆`}</button>`}
      </div>`}

    <!-- ── PRO: Quiz Logs below quiz ── -->
    ${m._proStatusCache&&m.quizLog.length>0?`
    <div style="margin-top:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:14px;font-weight:700;color:#EDE8E0">📋 Quiz Logs</div>
        <button onclick="if(confirm('Clear all quiz logs?')){quizLog=[];saveQuizLog();render();}" style="background:none;border:none;font-size:11px;color:#FF6B3566;cursor:pointer;font-family:inherit">🗑️ Clear</button>
      </div>
      <!-- Chapter-wise grouped — filtered to current course subjects -->
      ${(()=>{let e=new Set(_().map(e=>e.id)),t=m.quizLog.filter(t=>e.has(t.subject));if(t.length===0)return h.activeCourse===`cbse11`&&!h.cbse11Stream?`<div style="font-size:12px;color:#FFE66D88;padding:8px 0">Select your Class 11 stream first to see quiz logs.</div>`:h.activeCourse===`cbse12`&&!h.cbse12Stream?`<div style="font-size:12px;color:#FFE66D88;padding:8px 0">Select your Class 12 stream first to see quiz logs.</div>`:`<div style="font-size:12px;color:#444;font-style:italic;padding:8px 0">No quiz logs for this course yet.</div>`;let n={};return t.forEach(e=>{let t=e.subjectName||e.subject||`Unknown`;n[t]||(n[t]=[]),n[t].push(e)}),Object.entries(n).map(([e,t])=>`
          <div style="margin-bottom:16px">
            <div style="font-size:10px;font-weight:700;color:#FFE66D99;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">${v(e)}</div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${t.map(e=>{let t=e.pct>=70?`#06D6A0`:e.pct>=50?`#FFE66D`:`#FF6B35`,n=(e.questions||[]).length>0;return`<div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:10px">
                  <div style="flex-shrink:0;width:40px;height:40px;border-radius:50%;border:2px solid ${t};display:flex;align-items:center;justify-content:center">
                    <span style="font-size:11px;font-weight:800;color:${t}">${e.pct}%</span>
                  </div>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:12px;font-weight:600;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${v(e.chapter)}</div>
                    <div style="font-size:10px;color:#555;margin-top:2px"><span style="color:#06D6A0">${e.score}</span>/${e.total} · ${new Date(e.date).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`})}</div>
                    <div style="height:2px;background:#111;border-radius:1px;margin-top:5px;overflow:hidden"><div style="height:100%;background:${t};width:${e.pct}%;border-radius:1px"></div></div>
                  </div>
                  ${n?`<button onclick="toggleQuizReview(${e.id})" style="flex-shrink:0;background:${j.openReviewId===e.id?`#FFE66D22`:`#FFE66D11`};border:1px solid #FFE66D33;color:#FFE66D;font-size:10px;padding:5px 10px;border-radius:8px;cursor:pointer;font-family:inherit">${j.openReviewId===e.id?`▲ Close`:`Review →`}</button>`:``}
                </div>
                ${j.openReviewId===e.id?`
                <div style="margin-top:10px;border-top:1px solid #1e1e2e;padding-top:12px">
                  <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
                    ${[`All`,`Correct`,`Wrong`].map(e=>`
                      <button onclick="quizState.reviewFilter='${e}';render()" style="font-size:10px;padding:3px 10px;border-radius:10px;border:1px solid ${(j.reviewFilter||`All`)===e?`#FFE66D`:`#222`};background:${(j.reviewFilter||`All`)===e?`#FFE66D22`:`transparent`};color:${(j.reviewFilter||`All`)===e?`#FFE66D`:`#555`};cursor:pointer;font-family:inherit">${e}</button>
                    `).join(``)}
                  </div>
                  <div style="display:flex;flex-direction:column;gap:8px">
                    ${(e.questions||[]).filter(e=>{let t=j.reviewFilter||`All`;return t===`Correct`?e.correct:t!==`Wrong`||!e.correct}).map((t,n)=>{let r=(e.questions||[]).indexOf(t),i=t.difficulty===`hard`?`#FF6B35`:t.difficulty===`medium`?`#FFE66D`:`#06D6A0`;return`<div style="background:${t.correct?`#0a1a0a`:`#1a0a0a`};border:1px solid ${t.correct?`#06D6A022`:`#FF6B3522`};border-radius:10px;padding:12px">
                        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                          <span style="font-size:10px;background:#111;color:#555;padding:2px 7px;border-radius:5px">Q${r+1}</span>
                          ${t.difficulty?`<span style="font-size:10px;color:${i}">${t.difficulty===`hard`?`🔴 Hard`:t.difficulty===`medium`?`🟡 Medium`:`🟢 Easy`}</span>`:``}
                          <span style="margin-left:auto">${t.correct?`✅`:`❌`}</span>
                        </div>
                        <div style="font-size:12px;color:#EDE8E0;line-height:1.6;margin-bottom:10px;font-weight:500">${v(t.q)}</div>
                        <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:${t.explanation?`8px`:`0`}">
                          ${(t.options||[]).length>0?(t.options||[]).map((e,n)=>{let r=n===t.answer,i=n===t.userAnswer,a=`#0f0f18`,o=`#1e1e2e`,s=`#555`,c=``;return r&&(a=`#0a2a0a`,o=`#06D6A0`,s=`#06D6A0`,c=`✓ `),i&&!r&&(a=`#2a0a0a`,o=`#FF6B35`,s=`#FF6B35`,c=`✗ `),`<div style="background:${a};border:1px solid ${o};color:${s};padding:7px 10px;border-radius:7px;font-size:11px;line-height:1.4">${c}<b>${String.fromCharCode(65+n)}.</b> ${v(e)}</div>`}).join(``):`<div style="font-size:10px;color:#444;font-style:italic">Options not stored — only new quizzes show full options</div>`}
                        </div>
                        ${t.explanation?`<div style="padding:8px 10px;background:#08080f;border-left:2px solid #FFE66D33;border-radius:0 6px 6px 0;font-size:11px;color:#888;line-height:1.5;margin-top:6px">💡 ${v(t.explanation)}</div>`:``}
                      </div>`}).join(``)}
                  </div>
                </div>`:``}
                `}).join(``)}
            </div>
          </div>
        `).join(``)})()}
    </div>`:``}
  </div>`}typeof window<`u`&&Object.assign(window,{FLASH_LOG_MAX:100,QUIZ_LOG_MAX:100,nextQuestion:Yt,quizState:j,renderQuiz:Xt,saveFlashLog:Kt,saveQuizLog:Gt,selectAnswer:Jt,startQuiz:qt,toggleQuizReview:Wt});var M=JSON.parse(localStorage.getItem(`st_flash_decks`)||`{}`),N={activeSub:``,current:0,flipped:!1,generating:!1,mode:`select`,showHistory:!1};function P(){localStorage.setItem(`st_flash_decks`,JSON.stringify(M)),ee||(clearTimeout(g._timer),g._timer=setTimeout(c,1200))}function Zt(){return M[N.activeSub]||[]}function Qt(e){e&&(N.activeSub=e,N.current=0,N.flipped=!1,N.mode=`deck`,B())}function $t(){N.mode=`select`,N.activeSub=``,B()}function en(){let e=document.getElementById(`chapter-picker-overlay`);e&&e.remove();let t=_().find(e=>e.id===N.activeSub);if(!t)return;let n=document.createElement(`div`);n.id=`chapter-picker-overlay`,n.style.cssText=`position:fixed;inset:0;background:#00000088;z-index:9999;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px)`,n.innerHTML=`
    <div style="background:#0f0f18;border-radius:20px 20px 0 0;width:100%;max-width:560px;padding:24px;border:1px solid #2a2a3a;border-bottom:none;animation:slideUp 0.25s ease">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        <div>
          <div style="font-size:15px;font-weight:bold;color:#EDE8E0">📖 Choose Chapter</div>
          <div style="font-size:11px;color:#555;margin-top:2px">${v(t.name)} · AI generates 12 cards per chapter</div>
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
      <button onclick="document.getElementById('chapter-picker-overlay').remove();generateFlashcards('`+v(e.name)+`')" style="display:flex;align-items:center;gap:12px;width:100%;background:#0f0f18;border:1px solid #${[`FF6B35`,`4ECDC4`,`FFE66D`,`06D6A0`][n%4]}22;border-radius:12px;padding:14px 16px;cursor:pointer;font-family:inherit;margin-bottom:8px;transition:all 0.2s" onmouseover="this.style.borderColor='#${[`FF6B35`,`4ECDC4`,`FFE66D`,`06D6A0`][n%4]}66'" onmouseout="this.style.borderColor='#${[`FF6B35`,`4ECDC4`,`FFE66D`,`06D6A0`][n%4]}22'">
        <span style="font-size:20px">${t.icon}</span>
        <div style="text-align:left;flex:1;min-width:0">
          <div style="font-size:12px;font-weight:bold;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Chapter ${n+1}: `+v(e.name)+`</div>
          <div style="font-size:10px;color:#555;margin-top:2px">`+(e.topics||[]).slice(0,2).map(e=>v(e)).join(` · `)+`</div>
        </div>
        <span style="color:#555;font-size:12px;flex-shrink:0">→</span>
      </button>`).join(``)}
    </div>`,n.addEventListener(`click`,e=>{e.target===n&&n.remove()}),document.body.appendChild(n)}async function tn(e){let t=N.activeSub||document.getElementById(`flash-sub-select`)?.value||``;if(!t){y(`Please select a subject first`,`alarm`);return}if(!await Y()&&Object.values(M).reduce((e,t)=>e+(t||[]).length,0)>=50){y(`⭐ Free limit reached (50 cards). Upgrade to Pro for unlimited flashcards!`,`alarm`),G();return}let n=_().find(e=>e.id===t)?.name||t,r=e?e+` (`+n+`)`:n;N.generating=!0,N.activeSub=t,N.mode=`deck`,B(),y(`Generating flashcards for `+r+`…`,`info`);let i=[`key definitions`,`important formulas`,`core concepts`,`exam traps`,`theory vs application`,`worked examples`],a=i[Math.floor(Math.random()*i.length)],o=await Lr(`Create `+(await Y()?20:12)+` unique flashcards for `+r+` covering `+a+` for university exam revision. Format as JSON array: [{"front":"term or question","back":"definition or answer"}]. Return ONLY the raw JSON array, no markdown, no backticks.`,!0);try{let i=o.match(/\[[\s\S]*\]/),a=i?JSON.parse(i[0]):null;if(!a)throw Error(`fail`);M[t]=a,N.current=0,N.flipped=!1,P(),await Y()&&(m.flashLog.unshift({id:Date.now(),subject:t,subjectName:n,chapter:e||`All Chapters`,cards:a.length,date:new Date().toISOString()}),Kt()),y(a.length+` fresh cards generated for `+r+`!`,`success`),H()}catch{y(`Could not generate flashcards`,`alarm`)}N.generating=!1,B()}function nn(){!N.activeSub||!confirm(`Clear all cards for this subject?`)||(delete M[N.activeSub],P(),N.current=0,N.flipped=!1,B())}function rn(){N.flipped=!N.flipped,B()}function an(){let e=Zt();N.current=(N.current+1)%e.length,N.flipped=!1,B()}function on(){let e=Zt();N.current=(N.current-1+e.length)%e.length,N.flipped=!1,B()}function sn(){let e=Zt();e.splice(N.current,1),M[N.activeSub]=e,P(),N.current=Math.min(N.current,e.length-1),N.flipped=!1,B()}function cn(){let e=_();if(N.showHistory){let e={};return m.flashLog.forEach(t=>{let n=t.subjectName||t.subject||`Unknown`;e[n]||(e[n]={subject:n,entries:[]}),e[n].entries.push(t)}),`<div class="fade-in">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
        <div style="display:flex;align-items:center;gap:10px">
          <button class="btn-ghost" onclick="flashState.showHistory=false;render()" style="font-size:12px;padding:6px 12px">← Back</button>
          <div style="font-size:18px;font-weight:bold">📋 Flashcard Logs</div>
        </div>
        ${m.flashLog.length>0?`<button onclick="if(confirm('Clear flashcard logs?')){flashLog=[];saveFlashLog();render();}" style="background:none;border:none;font-size:11px;color:#FF6B3588;cursor:pointer;font-family:inherit">🗑️ Clear</button>`:``}
      </div>

      ${m.flashLog.length===0?`<div class="empty-state">
        <div style="font-size:48px;margin-bottom:12px">🃏</div>
        <div style="font-size:14px;margin-bottom:6px">No flashcard logs yet</div>
        <div style="font-size:12px;color:#444">Generate flashcards and your sessions will appear here</div>
      </div>`:`

      <!-- Stats strip -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px">
        <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:20px;font-weight:800;color:#FFE66D">${m.flashLog.length}</div>
          <div style="font-size:10px;color:#555;margin-top:2px">Sessions</div>
        </div>
        <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:20px;font-weight:800;color:#06D6A0">${m.flashLog.reduce((e,t)=>e+(t.cards||0),0)}</div>
          <div style="font-size:10px;color:#555;margin-top:2px">Total Cards</div>
        </div>
        <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:20px;font-weight:800;color:#A78BFA">${Object.keys(e).length}</div>
          <div style="font-size:10px;color:#555;margin-top:2px">Subjects</div>
        </div>
      </div>

      <!-- Chapter-wise grouped -->
      ${Object.values(e).map(e=>`
        <div style="margin-bottom:20px">
          <div style="font-size:12px;font-weight:700;color:#FFE66D;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;padding-left:2px">${v(e.subject)}</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${e.entries.map(e=>`
              <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px">
                <div style="flex-shrink:0;width:44px;height:44px;border-radius:10px;background:#1a1200;border:1px solid #FFE66D33;display:flex;flex-direction:column;align-items:center;justify-content:center">
                  <span style="font-size:14px">🃏</span>
                  <span style="font-size:9px;color:#FFE66D;font-weight:700">${e.cards}</span>
                </div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:600;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${v(e.chapter)}</div>
                  <div style="font-size:11px;color:#555;margin-top:2px">
                    ${e.cards} cards generated ·
                    ${new Date(e.date).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`})}
                    <span style="color:#444"> · ${new Date(e.date).toLocaleTimeString(`en-IN`,{hour:`2-digit`,minute:`2-digit`})}</span>
                  </div>
                </div>
                <button onclick="flashSelectSubject('${e.subject}');flashState.showHistory=false;" style="flex-shrink:0;background:#FFE66D11;border:1px solid #FFE66D33;color:#FFE66D;font-size:11px;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit">Study →</button>
              </div>
            `).join(``)}
          </div>
        </div>
      `).join(``)}
      `}
    </div>`}if(N.mode===`select`||!N.activeSub)return`<div class="fade-in">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <div style="font-size:18px;font-weight:bold">🃏 Flashcards</div>
        ${m._proStatusCache?`<button class="btn-ghost" onclick="flashState.showHistory=true;render()" style="font-size:11px;padding:5px 12px">📋 Logs (${m.flashLog.length})</button>`:``}
      </div>
      <div style="font-size:12px;color:#555;margin-bottom:20px">Select a subject to view or generate cards</div>
      <div class="grid-2">
        ${e.map(e=>{let t=(M[e.id]||[]).length;return`<div class="card" style="cursor:pointer;border-color:${e.color}33;transition:border-color 0.2s"
            onclick="flashSelectSubject('${e.id}')"
            onmouseover="this.style.borderColor='${e.color}99'"
            onmouseout="this.style.borderColor='${e.color}33'">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
              <span style="font-size:26px">${e.icon}</span>
              <div>
                <div style="font-size:13px;font-weight:bold;color:#ccc">${v(e.name)}</div>
                <div style="font-size:11px;color:#555">${t>0?t+` cards`:`No cards yet`}</div>
              </div>
            </div>
            <div style="height:3px;background:#111;border-radius:2px;overflow:hidden">
              <div style="height:100%;background:${e.color};width:${t>0?Math.min(100,t*8)+`%`:`0%`};border-radius:2px"></div>
            </div>
          </div>`}).join(``)}
      </div>
    </div>`;let t=e.find(e=>e.id===N.activeSub),n=Zt(),r=n[N.current],i=n.length?Math.round((N.current+1)/n.length*100):0;return`<div class="fade-in">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap">
      <button class="btn-ghost" onclick="flashBack()" style="font-size:12px;padding:6px 12px">← All</button>
      <span style="font-size:18px">${t?.icon||`🃏`}</span>
      <div style="flex:1;min-width:80px">
        <div style="font-size:15px;font-weight:bold;color:#ccc">${v(t?.name||``)}</div>
        <div style="font-size:11px;color:#555">${n.length} cards total</div>
      </div>
      <button class="btn-gold" onclick="openChapterPicker()" ${N.generating?`disabled`:``} style="font-size:11px;padding:7px 14px">
        ${N.generating?`⏳ Generating…`:`✨ Choose Chapter`}
      </button>
      ${n.length>0?`<button class="btn-ghost" onclick="clearSubjectDeck()" style="font-size:11px;color:#FF6B35;padding:7px 10px">🗑️ Clear</button>`:``}
    </div>

    ${n.length===0?`
      <div class="empty-state">
        <div style="font-size:48px;margin-bottom:12px">🃏</div>
        <div style="font-size:14px;margin-bottom:6px">No cards for ${v(t?.name||``)} yet</div>
        <div style="font-size:12px;color:#444;margin-bottom:16px">Generate 12 AI flashcards instantly — all chapters or chapter-wise</div>
        <button class="btn-gold" onclick="openChapterPicker()" ${N.generating?`disabled`:``} style="font-size:13px;padding:12px 24px">
          ${N.generating?`⏳ Generating…`:`✨ Choose Chapter to Generate`}
        </button>
      </div>`:`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:11px;color:#444">
        <span>Card ${N.current+1} / ${n.length}</span>
        <span>${i}% through deck</span>
      </div>
      <div style="height:3px;background:#111;border-radius:2px;margin-bottom:16px;overflow:hidden">
        <div style="height:100%;background:${t?.color||`#FFE66D`};width:${i}%;transition:width 0.3s;border-radius:2px"></div>
      </div>
      <div onclick="flipCard()" style="cursor:pointer;min-height:220px;display:flex;align-items:center;justify-content:center;
        background:${N.flipped?`#0d1a0d`:`#13131f`};
        border:2px solid ${N.flipped?t?.color||`#06D6A0`:`#FFE66D44`};
        border-radius:16px;padding:32px;margin-bottom:20px;transition:all 0.3s;text-align:center">
        <div>
          <div style="font-size:10px;letter-spacing:2px;margin-bottom:14px;color:${N.flipped?t?.color||`#06D6A0`:`#555`}">
            ${N.flipped?`✅ ANSWER`:`❓ QUESTION — tap to flip`}
          </div>
          <div style="font-size:17px;color:${N.flipped?t?.color||`#06D6A0`:`#FFE66D`};line-height:1.7">
            ${v(r?N.flipped?r.back:r.front:``)}
          </div>
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center">
        <button class="btn-ghost" onclick="prevCard()" style="padding:10px 22px">← Prev</button>
        <button class="btn-ghost" onclick="deleteFlashcard()" style="color:#FF6B35;padding:10px 14px" title="Delete card">🗑️</button>
        <button class="btn-gold" onclick="nextCard()" style="padding:10px 22px">Next →</button>
      </div>
      <div style="text-align:center;margin-top:12px;font-size:10px;color:#222">tap card to flip · swipe or use buttons · delete removes this card</div>
    `}
  </div>`}typeof window<`u`&&Object.assign(window,{clearSubjectDeck:nn,deleteFlashcard:sn,flashBack:$t,flashDecks:M,flashSelectSubject:Qt,flashState:N,flipCard:rn,generateFlashcards:tn,getActiveDeck:Zt,nextCard:an,openChapterPicker:en,prevCard:on,renderFlashcards:cn,saveFlashDecks:P});async function ln(){let e=T(),t=E();Object.entries(r.studyLog).sort((e,t)=>e[0].localeCompare(t[0])).slice(-14);let n={};_().forEach(e=>{n[e.id]=0}),Object.values(r.studyLog).forEach(e=>{e.subject&&n[e.subject]!==void 0&&(n[e.subject]+=e.hours||0)});let i=Math.max(...Object.values(n),1),a=(()=>{let e=[];for(let t=29;t>=0;t--){let n=new Date;n.setDate(n.getDate()-t);let i=n.toISOString().split(`T`)[0],a=r.studyLog[i]?.hours||0,o=Math.min(1,a/4),s=i===x(),c=a===0?s?`#1a1a0a`:`#0f0f18`:`rgba(255,230,109,${.2+o*.8})`,l=n.getDate();e.push(`<div title="${i}: ${a}h studied" style="width:min(28px,calc((100vw - 80px)/30));height:min(28px,calc((100vw - 80px)/30));min-width:18px;background:${c};border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:7px;color:${a>0?`#1a1200`:`#2a2a35`};border:${s?`1px solid #FFE66D88`:`1px solid #1e1e2e`};flex-shrink:0">${a>0?a+`h`:l}</div>`)}return e.join(``)})(),o=await Y(),s=``;if(o){let e=Object.entries(r.studyLog).sort((e,t)=>e[0].localeCompare(t[0])),i=[{label:`This week`,h:0},{label:`Last week`,h:0},{label:`2 weeks ago`,h:0},{label:`3 weeks ago`,h:0}],a=new Date;e.forEach(([e,t])=>{let n=new Date(e),r=Math.floor((a-n)/864e5),o=Math.floor(r/7);o<4&&(i[o].h+=t.hours||0)});let o=Math.max(...i.map(e=>e.h),1);s=`
    <div class="card" style="margin-bottom:16px;border-color:#FFE66D22">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div class="section-label" style="margin-bottom:0">📅 Weekly Report</div>
        <span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:8px;padding:2px 8px;font-weight:700">PRO</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:10px;height:80px">
        ${i.reverse().map(e=>{let t=Math.round(e.h/o*100);return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
            <div style="font-size:10px;color:#FFE66D;font-weight:700">${e.h}h</div>
            <div style="width:100%;background:#1a1a24;border-radius:4px;height:50px;display:flex;align-items:flex-end">
              <div style="width:100%;height:${Math.max(t,4)}%;background:linear-gradient(0deg,#FFE66D88,#FFE66D44);border-radius:4px;transition:height 0.5s"></div>
            </div>
            <div style="font-size:8px;color:#444;text-align:center">${e.label}</div>
          </div>`}).join(``)}
      </div>
    </div>`;let c=[{days:3,icon:`🌱`,label:`Getting Started`,color:`#06D6A0`},{days:7,icon:`🔥`,label:`One Week Warrior`,color:`#FF6B35`},{days:14,icon:`⚡`,label:`Fortnight Focus`,color:`#FFE66D`},{days:30,icon:`🏆`,label:`Monthly Master`,color:`#C77DFF`},{days:60,icon:`👑`,label:`Study King`,color:`#4ECDC4`}],l=c.filter(e=>t>=e.days),u=c.find(e=>t<e.days);s+=`
    <div class="card" style="margin-bottom:16px;border-color:#FFE66D22">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div class="section-label" style="margin-bottom:0">🏅 Streak Awards</div>
        <span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:8px;padding:2px 8px;font-weight:700">PRO</span>
      </div>
      ${l.length===0?`<div style="font-size:12px;color:#333;text-align:center;padding:12px 0">Keep studying! First award at 3-day streak 🌱</div>`:`<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
          ${l.map(e=>`<div style="background:${e.color}15;border:1px solid ${e.color}33;border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:8px">
            <span style="font-size:20px">${e.icon}</span>
            <div><div style="font-size:11px;font-weight:700;color:${e.color}">${e.label}</div><div style="font-size:9px;color:#444">${e.days}+ day streak</div></div>
          </div>`).join(``)}
        </div>`}
      ${u?`<div style="font-size:11px;color:#444">Next: ${u.icon} ${u.label} at ${u.days} days — ${u.days-t} to go</div>`:``}
    </div>`;let d=_().map(e=>({s:e,pct:w(e.id)}));d.sort((e,t)=>e.pct-t.pct);let f=d[0],p=d[d.length-1],m=_().map(e=>{let t=n[e.id]||0,r=w(e.id);return{s:e,h:t,pct:r,eff:t>0?Math.round(r/Math.max(t,.1)*10)/10:0}}).filter(e=>e.h>0).sort((e,t)=>t.eff-e.eff);s+=`
    <div class="card" style="margin-bottom:16px;border-color:#FFE66D22">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div class="section-label" style="margin-bottom:0">🔍 Subject Insights</div>
        <span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:8px;padding:2px 8px;font-weight:700">PRO</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div style="background:#0a180a;border:1px solid #06D6A022;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:20px">${p.s.icon}</div>
          <div style="font-size:11px;font-weight:700;color:#06D6A0;margin-top:4px">Strongest</div>
          <div style="font-size:10px;color:#555">${p.s.name}</div>
          <div style="font-size:16px;font-weight:800;color:#06D6A0">${p.pct}%</div>
        </div>
        <div style="background:#180a0a;border:1px solid #FF6B3522;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:20px">${f.s.icon}</div>
          <div style="font-size:11px;font-weight:700;color:#FF6B35;margin-top:4px">Needs Focus</div>
          <div style="font-size:10px;color:#555">${f.s.name}</div>
          <div style="font-size:16px;font-weight:800;color:#FF6B35">${f.pct}%</div>
        </div>
      </div>
      ${m.length>0?`
      <div style="font-size:10px;color:#444;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">Efficiency (% gained per hour)</div>
      ${m.map(e=>`<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-bottom:6px">
        <span style="color:#888">${e.s.icon} ${e.s.name}</span>
        <span style="color:${e.eff>=5?`#06D6A0`:e.eff>=2?`#FFE66D`:`#FF6B35`};font-weight:700;font-family:'JetBrains Mono',monospace">${e.eff}%/hr</span>
      </div>`).join(``)}`:``}
    </div>`}let c=o?``:`
  <div class="card" style="margin-bottom:16px;border-color:#FFE66D33;background:linear-gradient(135deg,#12100a,#0f0f18);cursor:pointer" onclick="openProModal()">
    <div style="display:flex;align-items:center;gap:14px;padding:4px 0">
      <div style="font-size:32px">📊</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:700;color:#FFE66D;margin-bottom:3px">Advanced Analytics</div>
        <div style="font-size:11px;color:#555;line-height:1.7">Weekly reports · Streak awards · Subject insights · Efficiency scores</div>
      </div>
      <div style="background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:8px;padding:6px 14px;font-size:11px;font-weight:800;flex-shrink:0">Upgrade ⭐</div>
    </div>
  </div>`;return`<div class="fade-in">
    <div style="font-size:18px;font-weight:bold;margin-bottom:20px">📈 Study Analytics</div>

    <div class="grid-3" style="margin-bottom:20px">
      ${[[`⏱️`,e+`h`,`Total Hours`],[`🔥`,t+` days`,`Current Streak`],[`📊`,Math.round(e/Math.max(Object.keys(r.studyLog).length,1)*10)/10+`h`,`Daily Avg`]].map(([e,t,n])=>`
      <div class="stat-box"><div style="font-size:22px">${e}</div><div style="font-size:20px;font-weight:bold;color:#FFE66D;margin:4px 0">${t}</div><div style="font-size:10px;color:#444">${n}</div></div>`).join(``)}
    </div>

    ${s}
    ${c}

    <div class="card" style="margin-bottom:16px">
      <div class="section-label" style="margin-bottom:12px">Hours per Subject</div>
      ${_().map(e=>{let t=n[e.id]||0,r=Math.round(t/i*100);return`<div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span>${e.icon} ${e.name}</span><span style="color:${e.color}">${t}h</span>
          </div>
          <div class="pbar"><div class="pfill" style="width:${r}%;background:${e.color}"></div></div>
        </div>`}).join(``)}
    </div>

    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div class="section-label" style="margin-bottom:0">Last 30 Days</div>
        <div style="font-size:10px;color:#444">Each cell = 1 day · colour = hours studied</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:3px;min-height:28px">${a||`<div style='color:#333;font-size:12px;padding:8px'>Log your study hours daily to see the heatmap!</div>`}</div>
    </div>

    <div class="card">
      <div class="section-label" style="margin-bottom:12px">Overall Progress</div>
      ${_().map(e=>{let t=w(e.id);return`<div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span>${e.icon} ${e.name}</span><span style="color:${e.color}">${t}%</span>
          </div>
          <div class="pbar"><div class="pfill" style="width:${t}%;background:linear-gradient(90deg,${e.color}88,${e.color})"></div></div>
        </div>`}).join(``)}
    </div>
  </div>`}typeof window<`u`&&Object.assign(window,{renderAnalytics:ln});var F={};m.aiTyping=!1;function un(){return h.activeCourse===`neet`?[{icon:`🧬`,label:`Cell Biology`,prompt:`Explain the cell cycle, mitosis vs meiosis with key NCERT points`},{icon:`🫀`,label:`Human Physiology`,prompt:`Explain the cardiac cycle and blood pressure regulation for NEET`},{icon:`⚛️`,label:`Physical Chemistry`,prompt:`Explain chemical equilibrium, Le Chatelier's principle with examples`},{icon:`🌿`,label:`Plant Kingdom`,prompt:`Compare Bryophyta, Pteridophyta, Gymnosperms and Angiosperms`},{icon:`🔬`,label:`Genetics`,prompt:`Explain Mendel's laws, codominance and sex-linked inheritance`},{icon:`💊`,label:`Biomolecules`,prompt:`List key enzymes, cofactors and metabolic pathways for NEET`},{icon:`🌡️`,label:`Thermodynamics`,prompt:`Explain Hess's law, enthalpy and entropy with numerical examples`},{icon:`⚡`,label:`Revision Plan`,prompt:`Create a 3-hour NEET revision plan covering Biology, Physics and Chemistry`}]:h.activeCourse===`jee`?[{icon:`⚛️`,label:`Mechanics`,prompt:`Explain Newton's laws, circular motion and work-energy theorem for JEE`},{icon:`🔌`,label:`Electrostatics`,prompt:`Explain Coulomb's law, Gauss's theorem and capacitors for JEE`},{icon:`📐`,label:`Calculus`,prompt:`Explain differentiation and integration techniques for JEE Mains`},{icon:`🧪`,label:`Organic Chemistry`,prompt:`Explain reaction mechanisms: SN1, SN2, addition and elimination`},{icon:`📊`,label:`Probability`,prompt:`Explain probability, Bayes theorem and binomial distribution for JEE`},{icon:`🌊`,label:`Waves & Optics`,prompt:`Explain interference, diffraction and polarization of light for JEE`},{icon:`⚗️`,label:`Equilibrium`,prompt:`Explain chemical equilibrium, Kp, Kc and Le Chatelier's principle`},{icon:`⚡`,label:`Revision Plan`,prompt:`Create a 3-hour JEE revision plan focusing on weak topics`}]:h.activeCourse===`cbse10`?[{icon:`📐`,label:`Quadratics`,prompt:`Explain quadratic equations — factorisation, formula method, discriminant with examples for CBSE Class 10`},{icon:`🔬`,label:`Chemical Reactions`,prompt:`List and explain the 5 types of chemical reactions for CBSE Class 10 Science`},{icon:`💡`,label:`Electricity`,prompt:`Explain Ohm's Law, series and parallel circuits with formulas for CBSE Class 10`},{icon:`🌍`,label:`Nationalism`,prompt:`Summarise the rise of nationalism in Europe for CBSE Class 10 History`},{icon:`🧬`,label:`Heredity`,prompt:`Explain Mendel's laws of inheritance and sex determination for CBSE Class 10 Biology`},{icon:`📖`,label:`English Writing`,prompt:`Explain formal letter writing format for CBSE Class 10 with a sample complaint letter`},{icon:`📊`,label:`Statistics`,prompt:`Explain mean, median and mode from grouped data with examples for CBSE Class 10`},{icon:`⚡`,label:`Revision Plan`,prompt:`Create a 3-hour CBSE Class 10 revision plan for board exam preparation`}]:h.activeCourse===`cbse12`?[{icon:`📐`,label:`Integration`,prompt:`Explain integration by parts and substitution method with solved examples for CBSE Class 12`},{icon:`⚛️`,label:`Semiconductors`,prompt:`Explain p-n junction diode, transistor as amplifier and logic gates for CBSE Class 12 Physics`},{icon:`🧪`,label:`Organic Chemistry`,prompt:`Explain reaction mechanisms of alcohols, phenols and aldehydes for CBSE Class 12 Chemistry`},{icon:`🧬`,label:`Molecular Biology`,prompt:`Explain DNA replication, transcription and translation for CBSE Class 12 Biology`},{icon:`📊`,label:`Macroeconomics`,prompt:`Explain national income accounting — methods and concepts for CBSE Class 12 Economics`},{icon:`📖`,label:`English Literature`,prompt:`Summarise the themes and character analysis of 'Deep Water' and 'The Rattrap' for CBSE Class 12`},{icon:`🔢`,label:`Probability`,prompt:`Explain Bayes' theorem and binomial distribution with examples for CBSE Class 12 Maths`},{icon:`⚡`,label:`Revision Plan`,prompt:`Create a 3-hour CBSE Class 12 board exam revision plan covering key chapters`}]:h.activeCourse===`nfsu1`?[{icon:`⚖️`,label:`Legal Methods`,prompt:`Explain sources of law, precedent and statutory interpretation for Legal Methods`},{icon:`🤕`,label:`Law of Tort`,prompt:`Explain negligence, strict liability and general defenses in Law of Tort`},{icon:`🛒`,label:`Consumer Protection`,prompt:`Explain key provisions of the Consumer Protection Act with recent case examples`},{icon:`📖`,label:`Law & Literature`,prompt:`Explain the interdisciplinary approach of Law and Literature with examples`},{icon:`💻`,label:`Computer Organization`,prompt:`Explain computer organization basics: CPU, memory hierarchy, embedded systems`},{icon:`🧮`,label:`C Programming`,prompt:`Explain pointers, arrays and structures in C with code examples`},{icon:`📊`,label:`Discrete Maths`,prompt:`Explain set theory, relations and graph theory basics for Discrete Mathematics`},{icon:`📰`,label:`Legal News`,prompt:`Summarise the most important recent Indian legal news relevant to a first-year law student`}]:h.activeCourse===`nfsu3`?[{icon:`⚖️`,label:`IPC → BNS`,prompt:`Explain the key sections of Law of Crimes I (IPC) and their corresponding Bharatiya Nyaya Sanhita (BNS) sections`},{icon:`🏛️`,label:`Article 14`,prompt:`Explain Article 14 — Right to Equality, Rule of Law and Doctrine of Reasonable Classification with case law`},{icon:`📜`,label:`Offer & Acceptance`,prompt:`Explain offer, acceptance and revocation in Law of Contract I with landmark case laws`},{icon:`👨‍👩‍👧`,label:`Family Law I`,prompt:`Explain the essentials of a valid Hindu marriage and grounds for divorce under Family Law I`},{icon:`🌐`,label:`Web Programming`,prompt:`Explain how to connect PHP with MySQL and perform CRUD operations`},{icon:`🖥️`,label:`OS Concepts`,prompt:`Explain process scheduling algorithms and memory management in Operating Systems`},{icon:`📘`,label:`Latest Bare Act`,prompt:`What are the latest bare act changes I should know for Law of Crimes I, Constitutional Law and Contract Law this semester?`},{icon:`📰`,label:`Legal News`,prompt:`Summarise this week's most important Indian legal news relevant to a Sem III B.Sc. LL.B. student`}]:h.activeCourse===`nfsu`?[{icon:`⌨️`,label:`Virtual Functions`,prompt:`Explain virtual functions and polymorphism in C++ with examples`},{icon:`🗄️`,label:`Normalization`,prompt:`Explain database normalization 1NF to BCNF with examples`},{icon:`✍️`,label:`Legal Language`,prompt:`Explain common legal maxims like factum valet, mens rea, actus reus and ubi jus ibi remedium`},{icon:`📊`,label:`SQL Joins`,prompt:`Explain all types of SQL JOINs with syntax and examples`},{icon:`⚖️`,label:`Law & Society`,prompt:`Explain Durkheim, Weber and Maine's theories on law and society`},{icon:`📖`,label:`Jurisprudence`,prompt:`Explain Hohfeld's analysis of rights and duties, and the schools of jurisprudence`},{icon:`📐`,label:`Stats Formulas`,prompt:`List all key Statistics formulas for mean, SD, correlation and regression`},{icon:`📘`,label:`Bare Act & News`,prompt:`What are the latest bare act amendments and recent legal news relevant to a Sem II B.Sc. LL.B. student?`}]:[{icon:`⌨️`,label:`Virtual Functions`,prompt:`Explain virtual functions and polymorphism in C++ with examples`},{icon:`🗄️`,label:`Normalization`,prompt:`Explain database normalization 1NF to BCNF with examples`},{icon:`⚖️`,label:`Legal Maxims`,prompt:`List 10 important Latin legal maxims with meanings for exam`},{icon:`📊`,label:`SQL Joins`,prompt:`Explain all types of SQL JOINs with syntax and examples`},{icon:`📖`,label:`Jurisprudence`,prompt:`Explain Hohfeld's analysis of rights and duties`},{icon:`📐`,label:`Stats Formulas`,prompt:`List all key Statistics formulas for mean, SD, correlation and regression`},{icon:`🧮`,label:`PL/SQL Basics`,prompt:`Explain PL/SQL block structure, cursors and triggers with examples`},{icon:`⚡`,label:`Revision Plan`,prompt:`Create a 3-hour power revision plan for my upcoming exams`}]}function dn(){return h.activeCourse===`neet`?[{icon:`🧬`,title:`Biology (NCERT)`,desc:`Cell biology, genetics, ecology, human physiology`},{icon:`⚛️`,title:`Physics`,desc:`Mechanics, electrostatics, optics, modern physics`},{icon:`🧪`,title:`Chemistry`,desc:`Organic, inorganic and physical chemistry`},{icon:`🔬`,title:`Zoology & Botany`,desc:`Plant kingdom, animal kingdom, reproduction`}]:h.activeCourse===`jee`?[{icon:`⚛️`,title:`Physics`,desc:`Mechanics, electrostatics, thermodynamics, optics`},{icon:`🧮`,title:`Mathematics`,desc:`Calculus, algebra, coordinate geometry, probability`},{icon:`🧪`,title:`Chemistry`,desc:`Organic reactions, physical chemistry, periodic table`},{icon:`📐`,title:`Problem Solving`,desc:`JEE Mains & Advanced problem strategies`}]:h.activeCourse===`cbse10`?[{icon:`📐`,title:`Mathematics`,desc:`Algebra, geometry, trigonometry, statistics`},{icon:`🔬`,title:`Science`,desc:`Physics, Chemistry, Biology — NCERT based`},{icon:`🌍`,title:`Social Science`,desc:`History, Geography, Civics, Economics`},{icon:`📖`,title:`English & Hindi`,desc:`Literature, grammar, writing skills`}]:h.activeCourse===`cbse12`?[{icon:`📐`,title:`Mathematics`,desc:`Calculus, algebra, vectors, probability`},{icon:`⚛️`,title:`Physics & Chemistry`,desc:`Modern physics, organic chemistry, electrochemistry`},{icon:`🧬`,title:`Biology / Economics`,desc:`Genetics, ecology, macroeconomics, money & banking`},{icon:`📖`,title:`English Literature`,desc:`Flamingo, Vistas, writing skills`}]:h.activeCourse===`nfsu1`?[{icon:`⚖️`,title:`Legal Methods & Tort`,desc:`Sources of law, precedent, negligence, strict liability`},{icon:`🛒`,title:`Consumer Protection`,desc:`Consumer Protection Act, unfair trade practices`},{icon:`💻`,title:`Computer & C`,desc:`Computer organization, embedded systems, C programming`},{icon:`📊`,title:`Discrete Maths`,desc:`Set theory, relations, graph theory`}]:h.activeCourse===`nfsu3`?[{icon:`⚖️`,title:`Law of Crimes I`,desc:`IPC → BNS mapping, mens rea, offences against body & property`},{icon:`🏛️`,title:`Constitutional Law I`,desc:`Fundamental Rights, DPSP, writs, PIL`},{icon:`📜`,title:`Contract & Family Law`,desc:`Offer, acceptance, remedies, Hindu marriage & divorce`},{icon:`📘`,title:`Bare Act & Legal News`,desc:`Latest amendments (BNS/BNSS/BSA) and current legal developments`}]:h.activeCourse===`nfsu`?[{icon:`⌨️`,title:`C++ & OOP`,desc:`Virtual functions, inheritance, polymorphism`},{icon:`🗄️`,title:`RDBMS & SQL`,desc:`Joins, normalization, PL/SQL triggers`},{icon:`⚖️`,title:`Legal Language & Law & Society`,desc:`Legal maxims, drafting, sociology of law`},{icon:`📘`,title:`Jurisprudence & Bare Act`,desc:`Schools of jurisprudence, Statistics, latest legal news`}]:[{icon:`⌨️`,title:`C++ & OOP`,desc:`Virtual functions, inheritance, polymorphism`},{icon:`🗄️`,title:`RDBMS & SQL`,desc:`Joins, normalization, PL/SQL triggers`},{icon:`📖`,title:`Law Subjects`,desc:`Jurisprudence, legal maxims, Law & Society`},{icon:`📊`,title:`Statistics`,desc:`Hypothesis testing, correlation, regression`}]}var fn=[],pn=[],mn=`ein_ai_sessions`,hn=30,I=[];F._aiActiveSession=null;var L=!0;function R(){try{I=JSON.parse(localStorage.getItem(`ein_ai_sessions`)||`[]`)}catch{I=[]}}function gn(){try{localStorage.setItem(mn,JSON.stringify(I.slice(0,30)))}catch{}}function _n(e){let t=e.find(e=>e.role===`user`);return t&&t.text.replace(/<[^>]+>/g,``).trim().slice(0,42)||`New chat`}function vn(){R();let e=`sess_`+Date.now();F._aiActiveSession=e,$.aiHistory=[];let t={id:e,title:`New chat`,ts:Date.now(),messages:[]};I.unshift(t),gn();let n=document.getElementById(`ai-chat-box`),r=document.querySelector(`.ai-topbar-title`),i=document.querySelector(`.ai-clear-btn`);document.querySelector(`.ai-hint`),n&&(n.innerHTML=`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:#333;text-align:center;padding:32px 24px"><div style="font-size:36px;opacity:0.3">🤖</div><div style="font-size:14px;font-weight:600;color:#444">New conversation</div><div style="font-size:12px;color:#2a2a3a;line-height:1.6">Ask me anything about your syllabus,<br>concepts, or exam strategy.</div></div>`),r&&(r.textContent=`AI Study Assistant`),i&&i.remove();let a=document.querySelector(`.ai-sessions-list`);if(a){J?.isPro;let e=new Date;e.setHours(0,0,0,0);let t=new Date(e);t.setDate(e.getDate()-1);let n=new Date(e);n.setDate(e.getDate()-7);let r={Today:[],Yesterday:[],"This week":[],Older:[]};I.forEach(i=>{let a=new Date(i.ts);a.setHours(0,0,0,0),a>=e?r.Today.push(i):a>=t?r.Yesterday.push(i):a>=n?r[`This week`].push(i):r.Older.push(i)});let i=``;for(let[e,t]of Object.entries(r))t.length&&(i+=`<div class="ai-sidebar-label">`+e+`</div>`,i+=t.map(e=>`<div class="ai-session-item`+(F._aiActiveSession===e.id?` active`:``)+`" onclick="aiLoadSession('`+e.id+`')"><span class="ai-session-title">`+v(e.title)+`</span><span class="ai-session-meta">`+En(e.ts)+`</span><button class="ai-session-del" onclick="aiDeleteSession('`+e.id+`',event)" title="Delete">✕</button></div>`).join(``));a.innerHTML=i||`<div style="padding:20px 14px;font-size:11px;color:#222;text-align:center;line-height:1.6">No conversations yet.<br>Start a new chat!</div>`}window.innerWidth<=700&&Cn(),setTimeout(()=>{let e=document.getElementById(`ai-input`);e&&(e.value=``,e.style.height=`auto`,e.focus())},50)}function yn(e){R();let t=I.find(t=>t.id===e);t&&(F._aiActiveSession=e,$.aiHistory=t.messages.map(e=>({...e})),B(),setTimeout(()=>{let e=document.getElementById(`ai-chat-box`);e&&(e.scrollTop=e.scrollHeight)},60),window.innerWidth<=700&&Cn())}function bn(e,t){t&&(t.stopPropagation(),t.preventDefault()),R(),I=I.filter(t=>t.id!==e),gn(),F._aiActiveSession===e&&(F._aiActiveSession=null,$.aiHistory=[]),B()}function xn(){if(!F._aiActiveSession)return;R();let e=I.findIndex(e=>e.id===F._aiActiveSession);e<0?I.unshift({id:F._aiActiveSession,title:_n($.aiHistory),ts:Date.now(),messages:[...$.aiHistory]}):(I[e].messages=[...$.aiHistory],I[e].title=_n($.aiHistory),I[e].ts=Date.now()),gn()}function Sn(){L=!L;let e=document.getElementById(`ai-sidebar`),t=window.innerWidth<=700;e&&(t?(e.classList.toggle(`mobile-open`,L),e.classList.remove(`collapsed`)):e.classList.toggle(`collapsed`,!L));let n=document.getElementById(`ai-toggle-btn`);n&&(n.innerHTML=L?wn():Tn());let r=document.getElementById(`ai-sidebar-overlay`);r&&t&&r.classList.toggle(`visible`,L)}function Cn(){if(window.innerWidth>700)return;L=!1;let e=document.getElementById(`ai-sidebar`);e&&(e.classList.remove(`mobile-open`),e.classList.add(`collapsed`));let t=document.getElementById(`ai-toggle-btn`);t&&(t.innerHTML=Tn());let n=document.getElementById(`ai-sidebar-overlay`);n&&n.classList.remove(`visible`)}function wn(){return`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="1.5"/></svg>`}function Tn(){return`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="1.5" opacity="0.3"/></svg>`}function En(e){let t=Date.now()-e;return t<6e4?`now`:t<36e5?Math.floor(t/6e4)+`m`:t<864e5?Math.floor(t/36e5)+`h`:Math.floor(t/864e5)+`d`}function Dn(){R();let e=$.aiHistory.length>0,t=!!J?.isPro,r=!L,i=n.currentUser?.displayName?.split(` `)[0]||`there`,a=new Date;a.setHours(0,0,0,0);let o=new Date(a);o.setDate(a.getDate()-1);let s=new Date(a);s.setDate(a.getDate()-7);let c={Today:[],Yesterday:[],"This week":[],Older:[]};I.forEach(e=>{let t=new Date(e.ts);t.setHours(0,0,0,0),t>=a?c.Today.push(e):t>=o?c.Yesterday.push(e):t>=s?c[`This week`].push(e):c.Older.push(e)});let l=Object.entries(c).map(([e,t])=>t.length?`<div class="ai-sidebar-label">`+e+`</div>`+t.map(e=>`<div class="ai-session-item`+(F._aiActiveSession===e.id?` active`:``)+`" onclick="aiLoadSession('`+e.id+`')"><span class="ai-sess-icon">💬</span><span class="ai-sess-title">`+v(e.title)+`</span><span class="ai-sess-time">`+En(e.ts)+`</span><button class="ai-sess-del" onclick="aiDeleteSession('`+e.id+`',event)" title="Delete">✕</button></div>`).join(``):``).join(``),u=`<select id="ai-subject-ctx" class="ai-subject-select" onchange="render()"><option value="all">All subjects</option>`+_().map(e=>`<option value="`+e.id+`">`+e.icon+` `+e.name+`</option>`).join(``)+`</select>`,d=un().map((e,t)=>`<button class="ai-chip" onclick="setQuickPrompt(`+t+`)">`+e.icon+` `+e.label+`</button>`).join(``),f=dn().map((e,t)=>`<div class="ai-welcome-card" onclick="setWelcomePrompt(`+t+`)"><div class="ai-wc-icon">`+e.icon+`</div><div class="ai-wc-title">`+e.title+`</div><div class="ai-wc-desc">`+e.desc+`</div></div>`).join(``),p=e?$.aiHistory.map((e,t)=>On(e,t)).join(``):`<div class="ai-welcome"><div class="ai-welcome-logo">✶</div><div><div style="font-size:20px;font-weight:700;color:#ccc;margin-bottom:6px">Hello, `+v(i)+`</div><div style="font-size:13px;color:#333;line-height:1.7">What would you like to study today?</div></div><div class="ai-welcome-grid">`+f+`</div></div>`,h=`<button class="ai-send-btn" id="ai-send-btn" onclick="sendAIMessage()" `+(m.aiTyping||!t&&Mr>=5?`disabled`:``)+`>`+(m.aiTyping?`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#555" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#555" stroke-width="2" stroke-linecap="round"/></svg>`:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`)+`</button>`,ee=t?`Enter to send · Shift+Enter for new line · Claude AI`:`Enter to send · <span style="color:#FFE66D66">Free: `+Math.max(0,5-Mr)+` messages left</span> · <span style="color:#4ECDC466;cursor:pointer" onclick="showProModal()">Upgrade ↗</span>`;return`<div class="fade-in ai-page"><div class="ai-sidebar`+(r?` collapsed`:``)+`" id="ai-sidebar"><div class="ai-sidebar-top"><button class="ai-new-chat-btn" onclick="aiNewChat()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>New chat</button></div><div class="ai-sessions-list">`+(I.length?l:`<div style="padding:20px 14px;font-size:11px;color:#222;text-align:center;line-height:1.6">No conversations yet.<br>Start a new chat!</div>`)+`</div><div class="ai-sidebar-bottom"><div class="ai-model-badge"><div class="ai-model-dot`+(m.aiTyping?` thinking`:``)+`"></div><span>`+(t?`Claude · Pro priority`:`Claude AI · Free tier`)+`</span></div></div></div><div class="ai-main"><div class="ai-topbar"><button class="ai-back-btn" onclick="switchView('dashboard')" title="Back to Dashboard"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="ai-toggle-btn" id="ai-toggle-btn" onclick="aiToggleSidebar()" title="Toggle history">`+(L?wn():Tn())+`</button><div class="ai-topbar-title">`+(e?v(_n($.aiHistory)):`AI Study Assistant`)+`</div><div class="ai-topbar-actions">`+(t?`<span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:6px;padding:2px 8px;font-weight:700">PRO ⭐</span>`:``)+u+(e?`<button class="ai-clear-btn" onclick="aiHistory=[];_aiPersistCurrentSession();render()">Clear</button>`:``)+`</div></div><div class="ai-chat-wrap" id="ai-chat-box">`+p+`</div><div class="ai-input-area"><div class="ai-input-box"><textarea id="ai-input" class="ai-textarea" placeholder="Message AI tutor…" rows="1" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendAIMessage()}" oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,140)+'px'"></textarea><div class="ai-input-footer"><div class="ai-chips">`+d+`</div>`+h+`</div></div><div class="ai-hint">`+ee+`</div></div></div></div>`}function On(e,t){let r=e.role===`user`,i=e.text===`⏳ Thinking…`,a=e.ts?new Date(e.ts).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}):``,o=v(e.text);if(!r&&!i&&(o=o.replace(/\*\*(.*?)\*\*/g,`<strong style="color:#EDE8E0">$1</strong>`).replace(/\*(.*?)\*/g,`<em style="color:#aaa">$1</em>`).replace(/```([\s\S]*?)```/g,`<pre>$1</pre>`).replace(/`([^`]+)`/g,`<code>$1</code>`).replace(/^#{1,3}\s(.+)$/gm,`<div style="font-weight:bold;color:#4ECDC4;margin:10px 0 4px">$1</div>`).replace(/^[-\u2022]\s(.+)$/gm,`<div style="padding-left:14px;margin:3px 0">• $1</div>`).replace(/\n/g,`<br>`),window.DOMPurify&&(o=DOMPurify.sanitize(o,{ALLOWED_TAGS:[`strong`,`em`,`pre`,`code`,`div`,`br`,`span`],ALLOWED_ATTR:[`style`]}))),i)return`<div class="ai-msg-row" style="animation:fadeInUp 0.2s ease"><div class="ai-avatar bot" style="font-size:13px">✶</div><div class="ai-bubble-wrap"><div class="ai-sender-name">AI Tutor</div><div class="ai-bubble bot thinking-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div></div></div>`;let s=r?n.currentUser?.photoURL?`<img src="`+n.currentUser.photoURL+`" style="width:100%;height:100%;border-radius:8px;object-fit:cover" onerror="this.parentElement.textContent='&#128100;'">`:`&#128100;`:`✶`;return`<div class="ai-msg-row `+(r?`user`:``)+`"><div class="ai-avatar `+(r?`user`:`bot`)+`">`+s+`</div><div class="ai-bubble-wrap"><div class="ai-sender-name">`+(r?n.currentUser?.displayName?.split(` `)[0]||`You`:`AI Tutor`)+`</div><div class="ai-bubble `+(r?`user`:`bot`)+`">`+o+`</div><div class="ai-meta">`+a+`</div></div></div>`}function kn(){if(!ae.deferredPrompt){y(`ℹ️ App already installed or not supported`,`info`);return}ae.deferredPrompt.prompt(),ae.deferredPrompt.userChoice.then(e=>{e.outcome===`accepted`&&y(`🎉 App installed!`,`success`),ae.deferredPrompt=null,document.getElementById(`pwa-install-btn`).style.display=`none`})}typeof window<`u`&&Object.assign(window,{AI_QUICK_PROMPTS:fn,AI_SESSIONS_KEY:mn,AI_SESSION_MAX:30,AI_WELCOME_CARDS:pn,_aiLoadSessions:R,_aiPersistCurrentSession:xn,_aiRelTime:En,_aiSaveSessions:gn,_aiSessionTitle:_n,_aiSessions:I,_aiSidebarOpen:L,_aiToggleIconClosed:Tn,_aiToggleIconOpen:wn,_closeAISidebarMobile:Cn,aiDeleteSession:bn,aiLoadSession:yn,aiNewChat:vn,aiToggleSidebar:Sn,getAIQuickPrompts:un,getAIWelcomeCards:dn,installPWA:kn,renderAI:Dn,renderAIMsgBubble:On});function An(e){return r.subjectSections[e]||(r.subjectSections[e]={qp:[],notes:[],materials:[],playlists:[]}),r.subjectSections[e]}function jn(e){return r.activeSectionTab[e]||`qp`}function Mn(e,t){r.activeSectionTab[e]=t,d(`activeSectionTab`,r.activeSectionTab),B()}function Nn(e,t){r.showSectionModal={subjectId:e,tab:t},r.newSectionItem={title:``,url:``,description:``,year:``,subjectId:e,tab:t},B()}function Pn(){r.showSectionModal=null,B()}function Fn(){let e=r.showSectionModal;if(!e)return;let t=document.getElementById(`sec-title`)?.value||``,n=document.getElementById(`sec-url`)?.value||``,i=document.getElementById(`sec-desc`)?.value||``,a=document.getElementById(`sec-year`)?.value||``;if(!t.trim()){y(`⚠️ Title is required`,`alarm`);return}let o=An(e.subjectId),s={id:b(),title:t,url:n,description:i,year:a,created:x()};o[e.tab].unshift(s),g(`subjectSections`,r.subjectSections),r.showSectionModal=null,y(`✅ Added!`,`success`),H(),B()}function In(e,t,n){if(!confirm(`Delete this item?`))return;let i=An(e);i[t]=i[t].filter(e=>e.id!==n),g(`subjectSections`,r.subjectSections),y(`🗑️ Deleted`,`info`),B()}async function Ln(e){y(`⚠️ Connect Google Drive first (Sync tab)`,`alarm`)}function Rn(){r.showFolderPicker=!1,r.driveFolderPickerFor=null,B()}async function zn(){}async function Bn(e,t){let n=r.driveFolderPickerFor;n&&(r.subjectDriveFolders[n]={folderId:e,folderName:t},d(`subjectDriveFolders`,r.subjectDriveFolders),r.showFolderPicker=!1,r.driveFolderPickerFor=null,y(`📁 "${t}" linked to ${_().find(e=>e.id===n)?.name||n}`,`success`),B())}async function Vn(e){}function Hn(e){let t=e.id,n=jn(t),i=An(t),a=r.subjectDriveFolders[t],o=`<div class="sub-tab-bar">
    ${[{key:`qp`,icon:`📄`,label:`Question Papers`},{key:`notes`,icon:`📝`,label:`Notes`},{key:`materials`,icon:`📦`,label:`Materials`},{key:`playlists`,icon:`▶️`,label:`YouTube`}].map(r=>`<button class="sub-tab ${n===r.key?`active`:``}"
      onclick="setActiveTab('${t}','${r.key}')"
      style="${n===r.key?`background:${e.color};`:``}">
      ${r.icon} ${r.label}
      <sup style="font-size:9px;opacity:0.7">${i[r.key]?.length||0}</sup>
    </button>`).join(``)}
  </div>`,s=a?`<div class="drive-folder-chip" onclick="openFolderPicker('${t}')">📁 ${v(a.folderName)} <span style="font-size:9px;opacity:0.6">change</span></div>`:`<button class="drive-folder-chip" style="color:#555;border-color:#1e1e2e" onclick="openFolderPicker('${t}')">📁 Link Drive Folder</button>`,c=``;if(n===`qp`){let e=i.qp||[];c=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:13px;color:#555">${e.length} question paper${e.length===1?``:`s`}</div>
        <button class="btn-gold" style="font-size:12px;padding:8px 16px" onclick="openSectionModal('${t}','qp')">+ Add Paper</button>
      </div>
      ${e.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📄</div><div>No question papers yet</div><div style="font-size:12px;color:#444;margin-top:4px">Add previous year papers, sample papers</div></div>`:e.map(e=>`<div class="qp-card" onclick="${e.url?`window.open('${v(e.url)}','_blank')`:`void(0)`}">
        <div style="font-size:28px">📄</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:bold;font-size:14px;color:#EDE8E0">${v(e.title)}</div>
          ${e.year?`<div style="font-size:11px;color:#555;margin-top:2px">Year: ${v(e.year)}</div>`:``}
          ${e.description?`<div style="font-size:12px;color:#666;margin-top:4px">${v(e.description)}</div>`:``}
          ${e.url?`<div style="font-size:10px;color:#4ECDC4;margin-top:4px">🔗 ${v(e.url.slice(0,50))}${e.url.length>50?`...`:``}</div>`:``}
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
            <div style="font-weight:bold;font-size:14px;color:#EDE8E0;margin-bottom:6px">${v(e.title)}</div>
            ${e.description?`<div style="font-size:13px;color:#888;line-height:1.7;white-space:pre-wrap">${v(e.description)}</div>`:``}
            ${e.url?`<a href="${v(e.url)}" target="_blank" style="display:inline-block;margin-top:8px;font-size:11px;color:#4ECDC4;text-decoration:none">🔗 Open Link</a>`:``}
            <div style="font-size:10px;color:#2e2e3e;margin-top:8px">${e.created}</div>
          </div>
          <button onclick="deleteSectionItem('${t}','notes','${e.id}')" class="icon-btn" style="color:#553333">🗑️</button>
        </div>
      </div>`).join(``)}`}else if(n===`materials`){let e=i.materials||[];c=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:13px;color:#555">${e.length} material${e.length===1?``:`s`}</div>
        <button class="btn-gold" style="font-size:12px;padding:8px 16px" onclick="openSectionModal('${t}','materials')">+ Add Material</button>
      </div>
      ${e.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📦</div><div>No study materials yet</div><div style="font-size:12px;color:#444;margin-top:4px">Add reference books, slides, handouts</div></div>`:e.map(e=>`<div class="sec-card" onclick="${e.url?`window.open('${v(e.url)}','_blank')`:`void(0)`}" style="cursor:${e.url?`pointer`:`default`}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <div style="font-weight:bold;font-size:14px;color:#EDE8E0;margin-bottom:4px">${v(e.title)}</div>
            ${e.description?`<div style="font-size:12px;color:#888;margin-top:4px">${v(e.description)}</div>`:``}
            ${e.url?`<div style="font-size:10px;color:#4ECDC4;margin-top:6px">🔗 ${v(e.url.slice(0,60))}${e.url.length>60?`...`:``}</div>`:``}
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
          <div class="yt-thumb" onclick="${e.url?`window.open('${v(e.url)}','_blank')`:`void(0)`}">
            ${r?`<img src="${r}" alt="thumb" onerror="this.parentElement.innerHTML='▶️'"/>`:`▶️`}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:bold;font-size:13px;color:#EDE8E0;margin-bottom:4px">${v(e.title)}</div>
            ${e.description?`<div style="font-size:12px;color:#888;margin-bottom:6px">${v(e.description)}</div>`:``}
            ${e.url?`<a href="${v(e.url)}" target="_blank" style="display:inline-block;background:#FF0000;color:#fff;font-size:11px;padding:4px 12px;border-radius:12px;text-decoration:none;font-weight:bold">▶ Watch on YouTube</a>`:``}
          </div>
          <button onclick="deleteSectionItem('${t}','playlists','${e.id}')" class="icon-btn" style="color:#553333">🗑️</button>
        </div>`}).join(``)}`}return`${o}
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      ${s}
    </div>
    ${c}`}function Un(){let e=r.showSectionModal;if(!e)return``;let t=_().find(t=>t.id===e.subjectId),n={qp:`Question Paper`,notes:`Note`,materials:`Study Material`,playlists:`YouTube Playlist`},i=e.tab===`playlists`,a=e.tab===`qp`;return`<div class="modal-overlay show" onclick="if(event.target===this)closeSectionModal()">
    <div class="modal-box fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <div style="font-size:15px;font-weight:bold;color:#EDE8E0">Add ${n[e.tab]||`Item`}</div>
          <div style="font-size:11px;color:${t?.color||`#555`};margin-top:2px">${t?.icon||``} ${v(t?.name||``)}</div>
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
  </div>`}function Wn(){if(!r.showFolderPicker)return``;let e=r.driveFolderPickerFor,t=_().find(t=>t.id===e),n=r.availableDriveFolders;return`<div class="modal-overlay show" onclick="if(event.target===this)closeFolderPicker()">
    <div class="modal-box fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div>
          <div style="font-size:15px;font-weight:bold;color:#EDE8E0">📁 Link Drive Folder</div>
          <div style="font-size:11px;color:${t?.color||`#555`};margin-top:2px">For ${t?.icon||``} ${v(t?.name||``)}</div>
        </div>
        <button class="icon-btn" onclick="closeFolderPicker()" style="font-size:18px;color:#666">✕</button>
      </div>
      <button class="add-sec-btn" onclick="createDriveFolderForSubject('${e}')">
        ✨ Auto-create "NFSU-${v(t?.name||e)}" folder in Drive
      </button>
      <div style="font-size:11px;color:#444;text-align:center;margin:10px 0">— or pick an existing folder —</div>
      ${n.length===0?`<div style="text-align:center;padding:24px;color:#333"><div style="font-size:30px;margin-bottom:10px">🔄</div>Loading your Drive folders…</div>`:n.map(t=>`<div class="folder-picker-item ${r.subjectDriveFolders[e]?.folderId===t.id?`selected`:``}" onclick="selectDriveFolder('${t.id}','${v(t.name)}')">
          <span style="font-size:20px">📁</span>
          <div style="flex:1"><div style="font-size:13px;color:#ccc">${v(t.name)}</div></div>
          ${r.subjectDriveFolders[e]?.folderId===t.id?`<span style="color:#06D6A0;font-size:16px">✓</span>`:``}
        </div>`).join(``)}
    </div>
  </div>`}async function Gn(){let e=await Y(),t=We(),i=T(),a=E(),o=_().map(e=>({...e,pct:w(e.id)})),s=[];t>=100&&s.push({icon:`🏆`,name:`Perfect Score`,desc:`100% done`}),t>=75&&s.push({icon:`⭐`,name:`Star Student`,desc:`75%+ done`}),t>=50&&s.push({icon:`📚`,name:`Halfway Hero`,desc:`50%+ done`}),a>=7&&s.push({icon:`🔥`,name:`Week Warrior`,desc:`7-day streak`}),a>=3&&s.push({icon:`✨`,name:`On a Roll`,desc:`3-day streak`}),i>=20&&s.push({icon:`⏰`,name:`Time Investor`,desc:`20+ hours`}),i>=5&&s.push({icon:`💪`,name:`Getting Started`,desc:`5+ hours`}),r.files.length>=5&&s.push({icon:`📁`,name:`File Hoarder`,desc:`5+ files`}),r.materials.length>=10&&s.push({icon:`🗂️`,name:`Note Taker`,desc:`10+ notes`}),s.length===0&&s.push({icon:`🌱`,name:`Beginner`,desc:`Just started!`});let c=`🌱 Seedling`;t>=80?c=`🏆 Champion`:t>=60?c=`⭐ Scholar`:t>=40?c=`📚 Student`:t>=20&&(c=`🌿 Learner`);let l=_().filter(e=>C(D(e.id))!==null&&C(D(e.id))>=0).slice().sort((e,t)=>C(D(e.id))-C(D(t.id)))[0]||null,u=J||{},d=u.expiresAt||0,f=u.planType||`monthly`,p=d>0?new Date(d).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`}):`—`,m=n.currentUser?.metadata?.creationTime?new Date(n.currentUser.metadata.creationTime).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`}):null;return n.currentUser?`<div class="fade-in">

    <!-- ── Identity Card (non-clickable, it's the hero) ── -->
    <div class="card" style="margin-bottom:16px;border-color:#FFE66D22;padding:24px 20px">
      <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
        <div style="position:relative;flex-shrink:0">
          <img src="${v(n.currentUser.photoURL||``)}" onerror="this.style.display='none'" style="width:72px;height:72px;border-radius:50%;border:2px solid #FFE66D44;object-fit:cover"/>
          <div style="position:absolute;bottom:-4px;right:-4px;background:#FFE66D;color:#08080f;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px">${t>=80?`🏆`:t>=50?`⭐`:`📚`}</div>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:20px;font-weight:700;letter-spacing:-0.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${v(n.currentUser.displayName||`Student`)}</div>
          ${m?`<div style="font-size:10px;color:#3a3a4a;margin-top:3px;letter-spacing:0.3px">MEMBER SINCE ${m.toUpperCase()}</div>`:``}
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <span style="background:#FFE66D14;border:1px solid #FFE66D33;color:#FFE66D;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:0.5px">${c}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Subscription ── -->
    <div class="card" onclick="${e?``:`openProModal()`}" style="margin-bottom:16px;border-color:${e?`#FFE66D22`:`#2a2a3a`};cursor:${e?`default`:`pointer`}">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:11px;color:#444;letter-spacing:1px;font-weight:600;margin-bottom:5px">SUBSCRIPTION</div>
          <div style="font-size:15px;font-weight:700;color:${e?`#FFE66D`:`#ccc`}">${e?`Pro Plan`:`Free Plan`}</div>
          <div style="font-size:11px;color:#555;margin-top:3px">${e?`<span style="text-transform:capitalize">${v(f)}</span> · Renews ${p}`:`Tap to unlock Pro features →`}</div>
        </div>
        ${e?`<div style="width:36px;height:36px;background:linear-gradient(135deg,#FFE66D,#ffb700);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">⭐</div>`:`<div style="width:36px;height:36px;background:#1a1a2a;border:1px solid #2e2e4e;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🔒</div>`}
      </div>
    </div>

    <!-- ── Stats Row (clickable → analytics) ── -->
    <div class="grid-3" style="margin-bottom:16px">
      ${[[`📊`,t+`%`,`Completed`,`analytics`],[`⏱️`,i+`h`,`Hours Logged`,`log`],[`🔥`,a+`d`,`Day Streak`,`log`]].map(([e,t,n,r])=>`
      <div class="stat-box" style="padding:18px 10px;cursor:pointer" onclick="switchView('${r}')">
        <div style="font-size:22px;margin-bottom:6px">${e}</div>
        <div style="font-size:22px;font-weight:700;color:#FFE66D;margin-bottom:4px">${t}</div>
        <div style="font-size:9px;color:#444;letter-spacing:1px;text-transform:uppercase">${n}</div>
      </div>`).join(``)}
    </div>

    <!-- ── AI Study Insights ── -->
    <div class="card" onclick="${e?`generateProfileInsight()`:`openProModal()`}" style="margin-bottom:16px;border-color:#4ECDC422;cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="font-size:13px;font-weight:700;color:#4ECDC4;letter-spacing:0.3px">AI STUDY INSIGHTS</div>
          ${e?``:`<span style="font-size:9px;background:#1a1a2a;color:#555;border-radius:6px;padding:1px 7px;font-weight:700">PRO</span>`}
        </div>
        <span style="font-size:11px;color:#4ECDC466">${e?`Tap to refresh →`:`Upgrade →`}</span>
      </div>
      <div id="profile-insight" style="font-size:13px;color:#888;line-height:1.7;padding:12px;background:#0a0a12;border-radius:8px">
        ${e?t>=80?`🔥 Excellent! You're well-prepared. Focus on weak spots and do timed mock tests.`:t>=50?`📈 Good progress! Keep consistent — daily small sessions beat cramming.`:`💪 Start with your nearest exam subject. Every topic checked builds momentum!`:`<span style="color:#3a3a4a">Unlock AI-powered personalised study insights tailored to your progress and upcoming exams.</span>`}
      </div>
    </div>

    <!-- ── Next Exam Countdown ── -->
    ${l?`<div class="card" onclick="switchView('subjects')" style="margin-bottom:16px;border-color:#FF6B3522;cursor:pointer">
      <div style="font-size:11px;color:#444;letter-spacing:1px;font-weight:600;margin-bottom:12px">NEXT EXAM</div>
      <div style="display:flex;align-items:center;gap:16px">
        <div style="font-size:32px;line-height:1">${l.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${v(l.name)}</div>
          <div style="font-size:11px;color:#555;margin-top:3px">${v(D(l.id))}</div>
        </div>
        ${C(D(l.id))===null?``:`<div style="text-align:right;flex-shrink:0">
          <div style="font-size:30px;font-weight:700;color:#FF6B35;line-height:1">${C(D(l.id))}</div>
          <div style="font-size:9px;color:#555;letter-spacing:1px;text-transform:uppercase">days left</div>
        </div>`}
      </div>
    </div>`:``}

    <!-- ── Subject Progress ── -->
    <div class="card" onclick="switchView('subjects')" style="margin-bottom:16px;cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:11px;color:#444;letter-spacing:1px;font-weight:600">SUBJECT PROGRESS</div>
        <span style="font-size:11px;color:#444">View all →</span>
      </div>
      ${o.map(e=>`<div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:5px">
          <span style="font-size:13px">${e.icon} ${e.name}</span>
          <span style="font-size:12px;color:${e.color};font-weight:700">${e.pct}%</span>
        </div>
        <div class="pbar"><div class="pfill" style="width:${e.pct}%;background:linear-gradient(90deg,${e.color}66,${e.color})"></div></div>
      </div>`).join(``)}
    </div>

    <!-- ── Achievements ── -->
    <div class="card" onclick="switchView('analytics')" style="margin-bottom:16px;cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:11px;color:#444;letter-spacing:1px;font-weight:600">ACHIEVEMENTS</div>
        <span style="font-size:10px;color:#444">${s.length} earned</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${s.map(e=>`<div style="background:#111122;border:1px solid #1e1e2e;border-radius:10px;padding:10px 12px;text-align:center;min-width:82px">
          <div style="font-size:24px;margin-bottom:5px">${e.icon}</div>
          <div style="font-size:10px;font-weight:700;color:#ccc;line-height:1.3">${e.name}</div>
          <div style="font-size:9px;color:#3a3a4a;margin-top:2px">${e.desc}</div>
        </div>`).join(``)}
      </div>
    </div>

    <!-- ── Sign Out ── -->
    <button class="btn-danger" onclick="googleSignOut()" style="width:100%;padding:12px;margin-bottom:4px;font-size:13px;letter-spacing:0.3px">Sign Out</button>
  </div>`:`<div class="fade-in">
    <div class="card" style="text-align:center;padding:48px 20px">
      <div style="font-size:64px;margin-bottom:16px">👤</div>
      <div style="font-size:20px;font-weight:bold;color:#ccc;margin-bottom:8px">Your Study Profile</div>
      <div style="font-size:13px;color:#555;margin-bottom:24px">Sign in to see personalised stats, achievements & AI insights</div>
      <button onclick="googleSignIn()" style="background:linear-gradient(135deg,#4285F4,#34A853);border:none;color:#fff;padding:14px 28px;border-radius:12px;font-family:inherit;font-size:14px;cursor:pointer;font-weight:bold">🔐 Sign in with Google</button>
    </div>
    </div>`}async function Kn(){let e=document.getElementById(`profile-insight`);if(!e)return;if(!await Y()){y(`⭐ AI Insights require Pro — upgrade to unlock!`,`info`),G();return}e.textContent=`⏳ Generating AI insights…`;let t=await Lr(`Student has: ${_().map(e=>e.name+`:`+w(e.id)+`%`).join(`, `)}. Total study hours: ${T()}. Streak: ${E()} days. Exams start 18 May 2026. Give 2-3 short, specific, encouraging study tips. Max 60 words.`);e&&(e.textContent=t)}typeof window<`u`&&Object.assign(window,{closeFolderPicker:Rn,closeSectionModal:Pn,createDriveFolderForSubject:Vn,deleteSectionItem:In,generateProfileInsight:Kn,getActiveTab:jn,getSubjectSection:An,loadDriveFolders:zn,openFolderPicker:Ln,openSectionModal:Nn,renderFolderPicker:Wn,renderProfile:Gn,renderSectionModal:Un,renderSubjectSectionTabs:Hn,saveSectionItem:Fn,selectDriveFolder:Bn,setActiveTab:Mn});var z=null,qn=[];function B(){return new Promise(e=>{qn.push(e),z&&clearTimeout(z),z=setTimeout(async()=>{z=null;let e=[...qn];qn=[],await Jn(),e.forEach(e=>e())},50)})}async function Jn(){let t=document.getElementById(`static-landing`);if(t){let e=window._splashStart||Date.now(),n=Date.now()-e,r=Math.max(0,2e3-n);setTimeout(()=>{t.classList.add(`hidden`),setTimeout(()=>{t.style.display=`none`},500)},r)}let n=document.getElementById(`main-content`),a={dashboard:Xn,subjects:Zn,alarms:Qn,files:Me,sync:Yn,log:$n,about:He,pomodoro:Vt,flashcards:cn,quiz:Xt,analytics:ln,ai:Dn,profile:Gn,neetjee:ne};if(!n)return;let o=a[r.view]||Xn;try{let e=o();n.innerHTML=e instanceof Promise?await e:e}catch(e){console.error(`[render] Error in view '`+r.view+`':`,e),n.innerHTML=`<div class="fade-in" style="text-align:center;padding:48px 20px">
      <div style="font-size:48px;margin-bottom:16px">⚠️</div>
      <div style="font-size:16px;font-weight:bold;color:#FF6B35;margin-bottom:8px">Something went wrong</div>
      <div style="font-size:12px;color:#555;margin-bottom:20px">${e.message||`Unknown error`}</div>
      <button class="btn-gold" onclick="switchView('dashboard')" style="padding:10px 24px">← Go to Dashboard</button>
    </div>`}r.view===`alarms`&&U(),r.view===`ai`&&Fr(),i(),ce(),e()}function Yn(){let e={offline:{icon:`🔴`,text:`Not signed in`,color:`#666`,desc:`Sign in with Google to sync your data across all devices.`},connecting:{icon:`🟡`,text:`Connecting…`,color:`#FFE66D`,desc:`Establishing secure connection…`},synced:{icon:`🟢`,text:`Synced`,color:`#06D6A0`,desc:`Your data is syncing in real-time across all devices!`},error:{icon:`🔴`,text:`Connection error`,color:`#FF6B35`,desc:`Sync error — likely a Firestore rules issue. See help below.`}},t=e[n.syncStatus]||e.offline,r=n.currentUser?`
    <div class="card" style="margin-bottom:16px;display:flex;align-items:center;gap:16px;padding:20px">
      <img src="${n.currentUser.photoURL||``}" onerror="this.style.display='none'" style="width:54px;height:54px;border-radius:50%;border:3px solid #06D6A0;flex-shrink:0"/>
      <div style="flex:1;min-width:0">
        <div style="font-size:15px;font-weight:bold;color:#ccc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${v(n.currentUser.displayName||`User`)}</div>
        <div style="font-size:10px;color:#333;margin-top:3px">UID: ${n.syncUserId?.slice(0,16)||`—`}…</div>
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
    </div>`;return`<div class="fade-in">
    <div style="font-size:18px;font-weight:bold;margin-bottom:6px">🔄 Sync & Account</div>
    <div style="font-size:12px;color:#555;margin-bottom:20px">Sign in with Google to sync across phone and PC</div>

    <!-- Status -->
    <div class="card card-glow" style="--glow-color:${t.color}22;margin-bottom:16px;text-align:center;padding:20px">
      <div style="font-size:36px;margin-bottom:8px">${t.icon}</div>
      <div style="font-size:16px;font-weight:bold;color:${t.color};margin-bottom:4px">${t.text}</div>
      <div style="font-size:12px;color:#555">${t.desc}</div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap">
        <button class="btn-gold" onclick="pushToFirebase().then(()=>showToast('✅ Data synced to cloud!','success')).catch(e=>showToast('⚠️ Sync failed: '+e.message,'alarm'))" style="font-size:12px;padding:9px 18px">⬆ Sync Now</button>
        ${n.currentUser?`<button class="btn-ghost" onclick="subscribeToFirestore().then(()=>showToast('✅ Pulled latest data!','success'))" style="font-size:12px">⬇ Pull Latest</button>`:``}
      </div>
    </div>

    <!-- User / Sign-in card -->
    ${r}

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
          <select id="sync-drive-sub" style="margin:0;font-size:12px">${_().map(e=>`<option value="${e.id}">${e.icon} ${v(e.name)}</option>`).join(``)}</select>
        </div>
        <div style="display:flex;gap:8px">
          <input id="sync-drive-url" placeholder="https://drive.google.com/file/d/..." style="flex:1;margin:0;font-size:12px"/>
          <button class="btn-gold" onclick="addDriveLinkFromSync()" style="padding:10px 16px;white-space:nowrap;font-size:12px">+ Add</button>
        </div>
      </div>
    </div>

    <!-- Firestore fix guide (shown only on error) -->
    ${n.syncStatus===`error`?`
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
    </div>`:``}

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
  </div>`}function Xn(){let e=We(),t=2*Math.PI*54,n=t*(1-e/100),i=_().filter(e=>C(D(e.id))!==null&&C(D(e.id))>=0).slice().sort((e,t)=>C(D(e.id))-C(D(t.id)))[0]||null,a=_().map((e,t)=>{let n=D(e.id),i=w(e.id),a=C(n),o=r.materials.filter(t=>t.subjectId===e.id).length,s=a!==null&&a<=2?`#ff5555`:a!==null&&a<=5?`#FF6B35`:`#555`,c=a===null?``:a<=0?`🚨 Today!`:a===1?`Tomorrow!`:a+`d left`;return`<div class="card" style="cursor:pointer;animation:fadeInUp 0.3s ease ${t*.06}s both" onclick="setActiveSubject('${e.id}');switchView('subjects')" style="--glow:${e.color}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:20px">${e.icon}</span>
          <div>
            <div style="font-weight:bold;font-size:14px">${v(e.name)}</div>
            <div style="font-size:10px;color:#444">${o} material${o===1?``:`s`} · ${v(e.code)}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:14px">
          <div style="font-size:10px;color:${s};text-align:right">${c}${c?`<br>`:``}${c?`<span style="color:#333">`+v(n)+`</span>`:v(n)}</div>
          <div style="font-size:24px;font-weight:bold;color:${e.color}">${i}%</div>
        </div>
      </div>
      <div class="pbar" style="--glow:${e.color}"><div class="pfill" style="width:${i}%;background:linear-gradient(90deg,${e.color}aa,${e.color})"></div></div>
    </div>`}).join(``),o=i?`
    <div style="background:linear-gradient(135deg,#1a0f00,#0f0f18);border:1px solid #FF6B3544;border-radius:12px;padding:16px;margin-bottom:16px;display:flex;align-items:center;gap:14px">
      <div style="font-size:32px" class="float-anim">${i.icon}</div>
      <div style="flex:1">
        <div style="font-size:10px;color:#FF6B35;letter-spacing:2px;text-transform:uppercase">Next Exam</div>
        <div style="font-size:16px;font-weight:bold">${v(i.name)}</div>
        <div style="font-size:12px;color:#666">${v(D(i.id))}${C(D(i.id))===null?``:` · `+C(D(i.id))+` days away`}</div>
      </div>
      ${C(D(i.id))===null?``:`<div style="font-size:36px;font-weight:bold;color:#FF6B35">${C(D(i.id))}d</div>`}
    </div>`:``,s=E();r.studyLog[x()];let c=parseFloat(localStorage.getItem(`st_dailyGoal`)||`6`),l=r.hoursToday||0,u=Math.min(100,Math.round(l/c*100)),d=Array.from({length:7},(e,t)=>{let n=new Date;n.setDate(n.getDate()-6+t);let i=n.toISOString().split(`T`)[0],a=r.studyLog[i]?.hours>0,o=i===x();return`<div title="${i}" style="flex:1;height:32px;border-radius:5px;background:${a?`#FFE66D`:o?`#2a2a1a`:`#1a1a24`};border:1px solid ${o?`#FFE66D44`:`transparent`};transition:all 0.3s;position:relative">
      ${o?`<div style="position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);font-size:8px;color:#555;white-space:nowrap">Today</div>`:``}
    </div>`}).join(``);return`<div class="fade-in">
    ${o}
    ${`<div class="card" style="margin-bottom:16px;padding:16px;border-color:#FFE66D22">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="font-size:13px;font-weight:bold;color:#EDE8E0;display:flex;align-items:center;gap:8px">
          🔥 ${s}-Day Streak
          ${s>=7?`<span style="font-size:10px;background:#FFE66D22;color:#FFE66D;border:1px solid #FFE66D33;padding:1px 8px;border-radius:10px">🏆 Week!</span>`:``}
          ${s>=30?`<span style="font-size:10px;background:#C77DFF22;color:#C77DFF;border:1px solid #C77DFF33;padding:1px 8px;border-radius:10px">🌟 Month!</span>`:``}
        </div>
        <div style="font-size:10px;color:#444;margin-top:2px">Study every day to keep your streak alive</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;color:#555">Today's goal</div>
        <div style="font-size:13px;font-weight:bold;color:${u>=100?`#06D6A0`:`#FFE66D`}">${l}h / ${c}h</div>
      </div>
    </div>
    <!-- 7-day streak dots -->
    <div style="display:flex;gap:4px;margin-bottom:20px">${d}</div>
    <!-- Daily goal progress -->
    <div style="height:5px;background:#1a1a24;border-radius:3px;overflow:hidden">
      <div style="height:100%;width:${u}%;background:linear-gradient(90deg,#06D6A0,#FFE66D);border-radius:3px;transition:width 0.8s cubic-bezier(0.4,0,0.2,1)"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:6px">
      <div style="font-size:10px;color:#444">${u>=100?`✅ Goal reached!`:`Keep going…`}</div>
      <button onclick="(function(){const g=prompt('Set daily study goal (hours):','${c}');if(g&&!isNaN(g)&&parseFloat(g)>0){localStorage.setItem('st_dailyGoal',parseFloat(g));render();}})()" style="background:none;border:none;color:#444;font-size:10px;cursor:pointer;font-family:inherit">✏️ Edit goal</button>
    </div>
  </div>`}
    <div style="display:flex;gap:20px;margin-bottom:24px;align-items:center;flex-wrap:wrap">
      <div class="ring-container" style="animation:ringPulse 2s ease-in-out infinite">
        <svg width="130" height="130" style="transform:rotate(-90deg)">
          <circle cx="65" cy="65" r="54" fill="none" stroke="#1a1a24" stroke-width="9"/>
          <circle cx="65" cy="65" r="54" fill="none" stroke="url(#ringGrad)" stroke-width="9"
            stroke-dasharray="${t}" stroke-dashoffset="${n}"
            stroke-linecap="round" style="transition:stroke-dashoffset 1s ease"/>
          <defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFE66D"/><stop offset="100%" stop-color="#FF6B35"/>
          </linearGradient></defs>
        </svg>
        <div class="ring-text">
          <div style="font-size:26px;font-weight:bold;color:#FFE66D">${e}%</div>
          <div style="font-size:9px;color:#555;letter-spacing:1px">COMPLETE</div>
        </div>
      </div>
      <div style="flex:1;min-width:200px">
        <div style="font-size:20px;font-weight:bold;margin-bottom:4px">Keep grinding! 💪</div>
        <div style="font-size:13px;color:#555;margin-bottom:14px">${i?`Next: `+v(i.name)+(C(D(i.id))===null?``:` in `+C(D(i.id))+`d`):`No exams set`} · ${r.alarms.filter(e=>e.enabled).length} active alarm${r.alarms.filter(e=>e.enabled).length===1?``:`s`}</div>
        <div class="grid-3">
          ${[[`⏱️`,T()+`h`,`Logged`],[`🔥`,s+` days`,`Streak`],[`📁`,r.files.length,`Files`]].map(([e,t,n])=>`
          <div class="stat-box"><div style="font-size:18px">${e}</div><div style="font-size:20px;font-weight:bold;color:#EDE8E0;margin:4px 0">${t}</div><div style="font-size:9px;color:#444;letter-spacing:1px">${n}</div></div>`).join(``)}
        </div>
      </div>
    </div>
    <div class="section-label">Subject Progress</div>
    ${a}
  </div>`}function Zn(){let e=_(),t=e.find(e=>e.id===r.activeSubject);if(t||(t=e[0],t&&(r.activeSubject=t.id)),!t)return h.activeCourse===`cbse11`&&!h.cbse11Stream?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📗</div><div style="margin-bottom:8px">Select your Class 11 stream to load subjects.</div><button class="btn-gold" onclick="showCourseSelector('cbse_group','cbse11_group')" style="margin-top:16px;padding:10px 24px">🔬 Choose Stream</button></div>`:h.activeCourse===`cbse12`&&!h.cbse12Stream?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">🎓</div><div style="margin-bottom:8px">Select your Class 12 stream to load subjects.</div><button class="btn-gold" onclick="showCourseSelector('cbse_group','cbse12_group')" style="margin-top:16px;padding:10px 24px">🔬 Choose Stream</button></div>`:`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">📚</div><div>No subjects found. Please select a course.</div><button class="btn-gold" onclick="showCourseSelector()" style="margin-top:16px;padding:10px 24px">🎯 Select Course</button></div>`;let n=w(t.id),i=_().map(e=>`
    <button class="pill-btn ${e.id===r.activeSubject?`active-sub`:``}" onclick="setActiveSubject('${e.id}')"
      style="background:${e.id===r.activeSubject?e.color:`#0f0f18`};color:${e.id===r.activeSubject?`#08080f`:`#666`};border-color:${e.id===r.activeSubject?e.color:`#222`};font-weight:${e.id===r.activeSubject?`bold`:`normal`}">
      ${e.icon} ${v(e.name)}</button>`).join(``),a=t.units.map((e,n)=>{let i=e.topics.filter((n,i)=>r.progress[`${t.id}-${e.id}-${i}`]).length,a=e.topics.map((n,i)=>{let a=`${t.id}-${e.id}-${i}`,o=!!r.progress[a];return`<div class="topic-row" onclick="toggleTopic('${t.id}','${e.id}',${i})" style="--acc:${t.color}">
        <div class="cb ${o?`done`:``}">${o?`✓`:``}</div>
        <span style="font-size:13px;color:${o?`#444`:`#bbb`};text-decoration:${o?`line-through`:`none`};transition:all 0.3s">${v(n)}</span>
        ${o?`<span style="margin-left:auto;font-size:10px;color:${t.color}">✓</span>`:``}
      </div>`}).join(``);return`<div class="card" style="animation:fadeInUp 0.3s ease ${n*.08}s both">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="font-weight:bold;font-size:14px">${v(e.name)}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="font-size:12px;color:${t.color}">${i}/${e.topics.length}</div>
          ${i===e.topics.length?`<span style="font-size:14px" class="float-anim">🏆</span>`:``}
        </div>
      </div>
      ${a}
    </div>`}).join(``),o=``;if(t.formulas){let e=Object.keys(t.formulas),n=r[`formulaTab_`+t.id]||e[0],i=(t.formulas[n]||[]).map(e=>`
      <div style="display:flex;align-items:flex-start;gap:8px;padding:7px 10px;background:#0a0a14;border:1px solid #1e1e2e;border-radius:8px;margin-bottom:6px">
        <span style="color:${t.color};font-size:14px;flex-shrink:0;margin-top:1px">∫</span>
        <span style="font-size:12px;color:#d4c8a8;font-family:monospace;line-height:1.6">${v(e)}</span>
      </div>`).join(``),a=e.map(e=>`<button onclick="state['formulaTab_${t.id}']='${v(e)}';render()" style="background:${e===n?t.color:`#0a0a14`};color:${e===n?`#08080f`:`#666`};border:1px solid ${e===n?t.color:`#1e1e2e`};border-radius:20px;padding:5px 11px;font-size:10px;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all 0.2s">${v(e)}</button>`).join(``);o=`<div class="card" style="margin-top:14px;border-color:${t.color}33">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">🧮</span>
        <div style="font-size:14px;font-weight:bold;color:${t.color}">Key Formulas</div>
        <span style="font-size:10px;color:#444;background:#1a1a2a;padding:2px 8px;border-radius:10px">JEE Quick Reference</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${a}</div>
      ${i}
    </div>`}let s=``;if(t.ncert){let e=Object.keys(t.ncert),n=r[`ncertTab_`+t.id]||e[0],i=(t.ncert[n]||[]).map(e=>`
      <div style="display:flex;align-items:flex-start;gap:8px;padding:8px 10px;background:#0a0a14;border-left:2px solid ${t.color};border-radius:0 8px 8px 0;margin-bottom:6px">
        <span style="color:${t.color};font-size:13px;flex-shrink:0;margin-top:2px">📌</span>
        <span style="font-size:12px;color:#d4c8a8;line-height:1.65">${v(e)}</span>
      </div>`).join(``),a=e.map(e=>`<button onclick="state['ncertTab_${t.id}']='${v(e)}';render()" style="background:${e===n?t.color:`#0a0a14`};color:${e===n?`#08080f`:`#666`};border:1px solid ${e===n?t.color:`#1e1e2e`};border-radius:20px;padding:5px 11px;font-size:10px;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all 0.2s">${v(e)}</button>`).join(``);s=`<div class="card" style="margin-top:14px;border-color:${t.color}33">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:18px">📖</span>
        <div style="font-size:14px;font-weight:bold;color:${t.color}">NCERT Important Lines</div>
        <span style="font-size:10px;color:#444;background:#1a1a2a;padding:2px 8px;border-radius:10px">High-Yield for NEET</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${a}</div>
      ${i}
    </div>`}return`<div class="fade-in">
    <div class="flex-wrap" style="margin-bottom:20px">${i}${h.activeCourse===`cbse11`?`<button onclick="showCourseSelector('cbse_group','cbse11_group')" style="background:#FFE66D22;border:1px solid #FFE66D44;color:#FFE66D;border-radius:20px;padding:6px 13px;font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s" title="Change stream">🔄 ${ie[h.cbse11Stream]?.label?.split(`—`)[0]?.trim()||`Change Stream`}</button>`:``}${h.activeCourse===`cbse12`?`<button onclick="showCourseSelector('cbse_group','cbse12_group')" style="background:#FFE66D22;border:1px solid #FFE66D44;color:#FFE66D;border-radius:20px;padding:6px 13px;font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s" title="Change stream">🔄 ${l[h.cbse12Stream]?.label?.split(`—`)[0]?.trim()||`Change Stream`}</button>`:``}</div>
    <div class="card card-glow" style="--glow-color:${t.color}33;margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:22px;font-weight:bold">${t.icon} ${v(t.name)}</div>
          <div style="font-size:11px;color:#555;margin-top:3px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          Exam:
          <input type="date" value="${Ke(D(t.id))}" onchange="setExamDate('${t.id}', _isoToExamDate(this.value))"
            style="background:#1a1a2a;border:1px solid #2a2a3a;border-radius:6px;padding:2px 7px;font-size:11px;color:${t.color};font-family:inherit;color-scheme:dark"
            title="Set your exam date"/>
          ${C(D(t.id))===null?``:` <span style="color:`+(C(D(t.id))<=3?`#FF6B35`:C(D(t.id))<=7?`#FFE66D`:`#06D6A0`)+`">`+C(D(t.id))+` days left</span>`}
        </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:34px;font-weight:bold;color:${t.color}">${n}%</div>
          <button class="btn-ghost" style="font-size:11px;margin-top:4px" onclick="state.newMat.subjectId='${t.id}';switchView('files');setTimeout(()=>showAddForm(),50)">+ Add Note</button>
        </div>
      </div>
      <div class="pbar"><div class="pfill" style="width:${n}%;background:linear-gradient(90deg,${t.color}88,${t.color})"></div></div>
    </div>
    ${a}
    ${o}
    ${s}
    <div class="card" style="margin-top:8px">
      <div class="section-label">📝 Quick Notes — ${v(t.name)}</div>
      <textarea rows="4" placeholder="Doubts, key points, formulas to remember..." oninput="saveSubjectNote('${t.id}',this.value)">${v(r.subjectNotes[t.id]||``)}</textarea>
    </div>
    <div class="card" style="margin-top:12px">
      <div style="font-size:14px;font-weight:bold;margin-bottom:4px">📂 Subject Resources</div>
      <div style="font-size:11px;color:#555;margin-bottom:16px">Question Papers · Notes · Study Materials · YouTube Playlists</div>
      ${Hn(t)}
    </div>
  </div>
  ${Un()}
  ${Wn()}
  `}function Qn(){let e=r.timerMode===`study`?1500:r.timerMode===`short`?300:900,t=r.timerSeconds/e,n=2*Math.PI*54,i=n*(1-t),a=Math.floor(r.timerSeconds/60),o=r.timerSeconds%60,s=r.alarms.length===0?`<div class="empty-state"><div style="font-size:36px;margin-bottom:10px">⏰</div><div>No alarms set yet</div></div>`:r.alarms.map(e=>`
      <div class="alarm-item ${e.enabled?`active-alarm`:``}">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:22px">${e.enabled?`⏰`:`🔕`}</span>
          <div>
            <div style="font-size:18px;font-weight:bold;color:${e.enabled?`#FFE66D`:`#555`};font-family:monospace">${v(e.time)}</div>
            <div style="font-size:11px;color:#555">${v(e.label)}${e.repeat?` · Repeats`:``}${e.ringtone?` · `+ar.find(t=>t.id===e.ringtone)?.name.split(` `)[0]:``}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <button class="alarm-toggle ${e.enabled?`on`:``}" onclick="toggleAlarm('${e.id}')" title="${e.enabled?`Disable`:`Enable`}"></button>
          <button class="icon-btn" onclick="deleteAlarm('${e.id}')" style="color:#663333">🗑️</button>
        </div>
      </div>`).join(``);return`<div class="fade-in">
    <!-- POMODORO TIMER -->
    <div class="card card-glow" style="--glow-color:#FF6B3522;margin-bottom:20px;text-align:center">
      <div style="font-size:11px;letter-spacing:2px;color:#555;text-transform:uppercase;margin-bottom:16px">🍅 Pomodoro Timer</div>
      <div style="display:flex;justify-content:center;gap:8px;margin-bottom:20px">
        ${[[`study`,`25 min`,`🎯`],[`short`,`5 min`,`☕`],[`long`,`15 min`,`🧘`]].map(([e,t,n])=>`
          <button class="pill-btn" onclick="setTimerMode('${e}')"
            style="background:${r.timerMode===e?`#FF6B35`:`#0f0f18`};color:${r.timerMode===e?`#fff`:`#666`};border-color:${r.timerMode===e?`#FF6B35`:`#222`}">
            ${n} ${t}</button>`).join(``)}
      </div>
      <div style="position:relative;width:140px;height:140px;margin:0 auto 20px">
        <svg width="140" height="140" style="transform:rotate(-90deg)">
          <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a24" stroke-width="8"/>
          <circle id="timer-ring-fill" cx="70" cy="70" r="54" fill="none" stroke="#FF6B35" stroke-width="8"
            stroke-dasharray="${n}" stroke-dashoffset="${i}"
            stroke-linecap="round" class="timer-ring"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div id="timer-display" style="font-size:30px;font-weight:bold;color:#FF6B35;font-family:'JetBrains Mono',monospace;${r.timerRunning?`animation:countdownPulse 1s ease-in-out infinite`:``}">${String(a).padStart(2,`0`)}:${String(o).padStart(2,`0`)}</div>
          <div style="font-size:10px;color:#555">${r.timerMode===`study`?`FOCUS`:r.timerMode===`short`?`BREAK`:`LONG BREAK`}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:center;gap:10px">
        ${r.timerRunning?`<button class="btn-ghost" onclick="pauseTimer()">⏸ Pause</button>`:`<button class="btn-gold" onclick="startTimer()" style="padding:10px 28px">▶ Start</button>`}
        <button class="btn-ghost" onclick="resetTimer(${e})">↺ Reset</button>
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
          ${ar.map(e=>`<option value="${e.id}" ${V===e.id?`selected`:``}>${e.name} — ${e.desc}</option>`).join(``)}
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
          ${typeof Notification<`u`&&Notification.permission===`granted`?`✅ Notifications On`:`Enable Notifications`}
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
    <div class="section-label">Your Alarms (${r.alarms.length})</div>
    ${s}

    <!-- TEST ALARM -->
    <div style="margin-top:16px;text-align:center">
      <button class="btn-ghost" onclick="triggerAlarm({label:'Test Alarm',time:'Now'})" style="font-size:12px">🔔 Test Alarm Sound</button>
    </div>
  </div>`}function $n(){let e=p.map((e,t)=>`<button class="mood-btn ${r.mood===t?`sel`:``}" onclick="setMood(${t})">${e}</button>`).join(``),t=_().map(e=>`
    <button class="pill-btn" onclick="state.activeSubject='${e.id}';render()"
      style="background:${e.id===r.activeSubject?e.color:`#141420`};color:${e.id===r.activeSubject?`#08080f`:`#666`};border-color:${e.id===r.activeSubject?e.color:`#222`};font-weight:${e.id===r.activeSubject?`bold`:`normal`}">
      ${e.icon} ${v(e.name)}</button>`).join(``),n=Object.entries(r.studyLog).sort((e,t)=>t[0].localeCompare(e[0])).slice(0,14).map(([e,t],n)=>{let r=_().find(e=>e.id===t.subject);return`<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#0f0f18;border:1px solid #1e1e2e;border-radius:10px;margin-bottom:8px;animation:fadeInUp 0.3s ease ${n*.05}s both;transition:all 0.2s" onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='#1e1e2e'">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:24px">${p[t.mood??3]}</span>
        <div>
          <div style="font-size:13px;color:#ccc">${e===x()?`Today ✦`:e}</div>
          <div style="font-size:11px;color:${r?.color||`#555`}">${r?.icon||``} ${v(r?.name||`—`)}</div>
        </div>
      </div>
      <div style="font-size:22px;font-weight:bold;color:#FFE66D">${t.hours}h</div>
    </div>`}).join(``);return`<div class="fade-in">
    <div style="font-size:18px;font-weight:bold;margin-bottom:20px">📝 Daily Study Log</div>
    <div class="card" style="margin-bottom:14px">
      <div class="section-label">HOW ARE YOU FEELING TODAY?</div>
      <div style="display:flex;gap:8px;margin-bottom:6px">${e}</div>
      <div style="font-size:12px;color:#555;margin-top:4px">${s[r.mood]}</div>
    </div>
    <div class="card" style="margin-bottom:14px">
      <div class="section-label">HOURS STUDIED TODAY</div>
      <div style="display:flex;align-items:center;gap:16px">
        <input type="range" min="0" max="12" step="0.5" value="${r.hoursToday}" oninput="setHours(this.value)" style="flex:1"/>
        <span id="hours-display" style="font-size:28px;font-weight:bold;color:#FFE66D;min-width:56px;text-shadow:0 0 20px #FFE66D44">${r.hoursToday}h</span>
      </div>
    </div>
    <div class="card" style="margin-bottom:14px">
      <div class="section-label">MAIN SUBJECT TODAY</div>
      <div class="flex-wrap">${t}</div>
    </div>
    <button class="btn-gold" style="width:100%;padding:14px;font-size:15px;margin-bottom:28px" onclick="logToday()">💾 Save Today's Log</button>
    <div class="section-label">Study History</div>
    ${Object.keys(r.studyLog).length===0?`<div style="color:#333;text-align:center;padding:32px;font-size:13px">No logs yet. Start studying! 💪</div>`:n}
  </div>`}typeof window<`u`&&Object.assign(window,{_doRender:Jn,_renderResolvers:qn,_renderTimer:z,render:B,renderAlarms:Qn,renderDashboard:Xn,renderLog:$n,renderSubjects:Zn,renderSync:Yn});function er(){let e=new Date,t=String(e.getHours()).padStart(2,`0`),n=String(e.getMinutes()).padStart(2,`0`),r=String(e.getSeconds()).padStart(2,`0`),i=document.getElementById(`live-clock`),a=document.getElementById(`live-date`);i&&(i.textContent=`${t}:${n}:${r}`),a&&(a.textContent=`${te[e.getDay()]}, ${e.getDate()} ${re[e.getMonth()]} ${e.getFullYear()}`)}var tr=``;function nr(){let e=new Date,t=`${String(e.getHours()).padStart(2,`0`)}:${String(e.getMinutes()).padStart(2,`0`)}`;if(t===tr)return;let n=e.getDay();r.alarms.forEach(e=>{e.enabled&&e.time===t&&(!e.repeat||e.days.length===0||e.days.includes(n))&&rr(e)}),tr=t}function rr(e){if(document.getElementById(`alarm-title`).textContent=e.label||`Study Time!`,document.getElementById(`alarm-msg`).textContent=`Alarm set for ${e.time}`,document.getElementById(`alarm-icon`).textContent=`⏰`,document.getElementById(`alarm-overlay`).classList.add(`show`),e.ringtone&&(V=e.ringtone),sr(),H(),Notification.permission===`granted`)try{new Notification(`⏰ `+(e.label||`Study Time!`),{body:`Alarm set for `+e.time+` · Exam Is Near`,icon:`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ctext y='52' font-size='52'%3E%E2%8F%B0%3C/text%3E%3C/svg%3E`,requireInteraction:!0})}catch{}}function ir(){document.getElementById(`alarm-overlay`).classList.remove(`show`),cr()}var ar=[{id:`classic`,name:`📯 Classic Bell`,desc:`Traditional double-beep`},{id:`digital`,name:`🔔 Digital Ring`,desc:`Sharp digital tone`},{id:`chime`,name:`🎵 Chime`,desc:`Soft melodic chime`},{id:`urgent`,name:`🚨 Urgent`,desc:`Fast warning beeps`},{id:`melody`,name:`🎶 Study Melody`,desc:`Motivating tune`},{id:`gentle`,name:`🌅 Gentle Wake`,desc:`Soft rising tone`},{id:`school`,name:`🏫 School Bell`,desc:`Classic school bell`},{id:`digital2`,name:`💻 Tech Alert`,desc:`Modern tech beep`},{id:`zen`,name:`🧘 Zen Bowl`,desc:`Singing bowl sound`},{id:`fanfare`,name:`🎺 Fanfare`,desc:`Achievement fanfare`},{id:`morning`,name:`🌄 Morning Bird`,desc:`Cheerful chirping`},{id:`piano`,name:`🎹 Piano Ding`,desc:`Soft piano notes`},{id:`retro`,name:`👾 Retro Game`,desc:`8-bit style beeps`},{id:`pulse`,name:`💓 Pulse`,desc:`Rhythmic heartbeat`},{id:`cosmic`,name:`🌌 Cosmic`,desc:`Space-like tones`}],V=localStorage.getItem(`st_ringtone`)||`classic`;function or(e){V=e,localStorage.setItem(`st_ringtone`,e),sr(),B()}function sr(){try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.currentTime;function r(n,r,i,a=`sine`,o=.4){let s=e.createOscillator(),c=e.createGain();s.connect(c),c.connect(e.destination),s.frequency.value=n,s.type=a,c.gain.setValueAtTime(0,t+r),c.gain.linearRampToValueAtTime(o,t+r+.05),c.gain.linearRampToValueAtTime(0,t+r+i),s.start(t+r),s.stop(t+r+i+.05)}function i(n,r,i,a,o=`sine`,s=.35){let c=e.createOscillator(),l=e.createGain();c.connect(l),l.connect(e.destination),c.type=o,c.frequency.setValueAtTime(n,t+i),c.frequency.linearRampToValueAtTime(r,t+i+a),l.gain.setValueAtTime(0,t+i),l.gain.linearRampToValueAtTime(s,t+i+.05),l.gain.linearRampToValueAtTime(0,t+i+a),c.start(t+i),c.stop(t+i+a+.05)}let a=V;if(a===`classic`)for(let e=0;e<5;e++)r(880,e*.5,.2),r(1100,e*.5+.22,.15);else if(a===`digital`)for(let e=0;e<10;e++)r(1200,e*.25,.1,`square`,.3);else if(a===`chime`)[523,659,784,1047,784,659,523].forEach((e,t)=>r(e,t*.18,.25,`sine`,.3));else if(a===`urgent`)for(let e=0;e<14;e++)r(e%2==0?900:1400,e*.18,.12,`sawtooth`,.25);else if(a===`melody`)[262,330,392,330,262,330,392,523].forEach((e,t)=>r(e,t*.22,.18,`sine`,.35));else if(a===`gentle`)for(let e=0;e<4;e++)i(300+e*80,400+e*100,e*.6,.5,`sine`,.25);else if(a===`school`)for(let e=0;e<3;e++)r(800,e*.7,.05,`square`,.4),i(800,600,e*.7+.05,.55,`sine`,.35);else if(a===`digital2`)for(let e=0;e<4;e++)[600,900,1200].forEach((t,n)=>r(t,e*.45+n*.1,.08,`square`,.25));else if(a===`zen`)i(220,440,0,.3,`sine`,.15),i(440,880,.3,.5,`sine`,.12),i(880,440,.8,1.2,`sine`,.08);else if(a===`fanfare`)[392,523,659,784,659,523,392,784].forEach((e,t)=>r(e,t*.15,.12,`square`,.3)),r(1047,1.2,.5,`sine`,.35);else if(a===`morning`)[0,.2,.4,.7,.9,1.1].forEach(e=>{i(800,1200,e,.08),i(1200,900,e+.08,.06)});else if(a===`piano`)[262,294,330,349,392,440,494,523].forEach((e,t)=>{r(e,t*.2,.3,`sine`,.3),r(e*2,t*.2,.15,`sine`,.08)});else if(a===`retro`)[200,400,300,500,400,600,500,700,800].forEach((e,t)=>r(e,t*.12,.1,`square`,.2));else if(a===`pulse`)for(let e=0;e<8;e++)r(440,e*.35,.1,`sine`,.35),r(660,e*.35+.12,.08,`sine`,.2);else if(a===`cosmic`)i(100,800,0,1.5,`sine`,.2),i(800,200,1.5,1,`sine`,.15),[300,600,900,1200].forEach((e,t)=>r(e,t*.5,.3,`sine`,.1));else for(let e=0;e<6;e++)r(880,e*.4,.25),r(1100,e*.4+.25,.15);n.activeAlarmAudio=e}catch{}}function cr(){try{n.activeAlarmAudio&&n.activeAlarmAudio.close()}catch{}n.activeAlarmAudio=null}function H(){let e=[`⭐`,`✨`,`🌟`,`💫`,`🎯`,`📚`];for(let t=0;t<12;t++)setTimeout(()=>{let t=document.createElement(`div`);t.className=`star`,t.textContent=e[Math.floor(Math.random()*e.length)],t.style.left=Math.random()*100+`vw`,t.style.top=Math.random()*60+20+`vh`,t.style.fontSize=16+Math.random()*16+`px`,t.style.animationDuration=.8+Math.random()*.6+`s`,document.body.appendChild(t),setTimeout(()=>t.remove(),1400)},t*80)}function lr(){n.timerInterval||(r.timerRunning=!0,n.timerInterval=setInterval(()=>{r.timerSeconds>0?(r.timerSeconds--,U()):(clearInterval(n.timerInterval),n.timerInterval=null,r.timerRunning=!1,y(`🎉 Session complete!`,`success`),H(),sr(),setTimeout(cr,3e3))},1e3),U())}function ur(){clearInterval(n.timerInterval),n.timerInterval=null,r.timerRunning=!1,U()}function dr(e){clearInterval(n.timerInterval),n.timerInterval=null,r.timerRunning=!1,r.timerSeconds=e||1500,U()}function U(){let e=Math.floor(r.timerSeconds/60),t=r.timerSeconds%60,n=document.getElementById(`timer-display`);n&&(n.textContent=`${String(e).padStart(2,`0`)}:${String(t).padStart(2,`0`)}`);let i=r.timerMode===`study`?1500:r.timerMode===`short`?300:900,a=r.timerSeconds/i,o=2*Math.PI*54,s=document.getElementById(`timer-ring-fill`);s&&(s.style.strokeDashoffset=o*(1-a)),r.timerRunning&&n?document.title=`⏱ ${String(e).padStart(2,`0`)}:${String(t).padStart(2,`0`)} — Exam Is Near`:document.title=`Exam Is Near — Study Smart | by ArkSetu`}typeof window<`u`&&Object.assign(window,{RINGTONES:ar,_lastAlarmCheck:tr,checkAlarms:nr,dismissAlarm:ir,pauseTimer:ur,playAlarmSound:sr,resetTimer:dr,selectedRingtone:V,setRingtone:or,spawnStars:H,startTimer:lr,stopAlarmSound:cr,triggerAlarm:rr,updateClock:er,updateTimerDisplay:U});var fr=149,W=null;function pr(){W=null;let e=document.getElementById(`pm-coupon-msg`);e&&(e.textContent=``,e.style.color=``),document.getElementById(`pm-monthly-label`).innerHTML=`⭐ Get Pro — ₹149/month →`,document.getElementById(`pm-annual-label`).innerHTML=`🏆 Annual Plan — ₹999/year &nbsp;·&nbsp; Save ₹792`}function G(){pr();let e=document.getElementById(`pm-coupon-input`);e&&(e.value=``),document.getElementById(`pro-upgrade-modal`).classList.add(`show`),document.body.style.overflow=`hidden`}async function mr(){let e=document.getElementById(`pm-coupon-input`),t=document.getElementById(`pm-coupon-btn`),r=document.getElementById(`pm-coupon-msg`),i=(e?.value||``).trim().toUpperCase();if(!i){r.textContent=`⚠️ Enter a coupon code`,r.style.color=`#FFE66D`;return}if(!n.currentUser){r.textContent=`⚠️ Please sign in first to apply a coupon.`,r.style.color=`#FFE66D`;return}t.textContent=`Checking…`,t.disabled=!0,r.textContent=``,r.style.color=``;try{let e=await n.currentUser.getIdToken(!0),a=await fetch(q.activateTrial,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+e},body:JSON.stringify({data:{uid:n.currentUser.uid,couponCode:i,plan:`monthly`,validateOnly:!0}})});if(!a.ok)throw Error(`Server error (`+a.status+`). Please try again.`);let o=await a.json(),s=o.result||o;if(!s.success&&!s.discount){r.textContent=`❌ `+(s.message||`Invalid or expired coupon code.`),r.style.color=`#ff6b6b`,W=null,t.textContent=`Apply`,t.disabled=!1,s.alreadyPro&&(Q(),Z());return}let c=s.discount||100;if(W={code:i,discount:c,id:s.couponId||i},s.success&&s.expiresAt&&!s.validateOnly){J={isPro:!0,expiresAt:s.expiresAt,checkedAt:Date.now(),planType:`monthly`},localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:s.expiresAt,cachedAt:Date.now(),planType:`monthly`})),r.textContent=`🎉 100% coupon applied! Pro activated.`,r.style.color=`#06D6A0`,t.textContent=`Activated ✓`,t.style.color=`#06D6A0`,t.disabled=!1,H(),X(),Q(),Z(),B();return}let l=Math.round(14900*(1-c/100)),u=Math.round(99900*(1-c/100)),d=`₹`+(l/100).toLocaleString(`en-IN`),f=`₹`+(u/100).toLocaleString(`en-IN`);r.textContent=`✅ ${c}% off applied! Prices updated below.`,r.style.color=`#06D6A0`,document.getElementById(`pm-monthly-label`).innerHTML=`⭐ Get Pro — <s style="opacity:0.5">₹149</s> ${d}/month →`,document.getElementById(`pm-annual-label`).innerHTML=`🏆 Annual Plan — <s style="opacity:0.5">₹999</s> ${f}/year`,t.textContent=`Applied ✓`,t.style.color=`#06D6A0`,t.disabled=!1}catch(e){console.error(`[EIN] Coupon validation error:`,e),r.textContent=`⚠️ Error: `+(e.message||String(e)),r.style.color=`#FFE66D`,t.textContent=`Apply`,t.disabled=!1}}var K=`ein_pro_cache`,q={checkProStatus:`https://checkprostatus-pfdempligq-el.a.run.app`,createOrder:`https://createorder-pfdempligq-el.a.run.app`,verifyPayment:`https://verifypayment-pfdempligq-el.a.run.app`,activateTrial:`https://activatetrial-pfdempligq-el.a.run.app`},hr=`https://asia-south1-exam-is-near.cloudfunctions.net`,J=null;async function Y({forceRefresh:e=!1}={}){if(!e&&J&&J.checkedAt&&Date.now()-J.checkedAt<3e5)return J.isPro;if(!n.currentUser){try{let e=JSON.parse(localStorage.getItem(`ein_pro_cache`)||`null`);if(e&&e.active===!0&&typeof e.expiresAt==`number`&&e.expiresAt>Date.now())return J={isPro:!0,expiresAt:e.expiresAt,checkedAt:Date.now(),planType:e.planType||`monthly`},!0}catch{}return J={isPro:!1,expiresAt:0,checkedAt:Date.now()},!1}try{let t=await n.currentUser.getIdToken(e),r=await fetch(q.checkProStatus,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+t},body:JSON.stringify({data:{}})});if(!r.ok)throw Error(`Server returned `+r.status);let i=await r.json(),a=i.result||i,o=!!a.isPro;if(J={isPro:o,expiresAt:a.expiresAt||0,checkedAt:Date.now(),planType:a.planType||`monthly`},o)m._proStatusCache=!0,localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:a.expiresAt,cachedAt:Date.now(),planType:a.planType||`monthly`}));else{m._proStatusCache=!1;let e=JSON.parse(localStorage.getItem(`ein_pro_cache`)||`null`);e&&e.active&&(console.warn(`[EIN] Pro tamper detected: localStorage claimed Pro but server denied. Purging.`),localStorage.removeItem(K))}return o}catch(e){console.warn(`[EIN] Pro check network error, using local fallback:`,e.message);try{let e=JSON.parse(localStorage.getItem(`ein_pro_cache`)||`null`);if(e&&e.cachedAt&&Date.now()-e.cachedAt<36e5&&e.active===!0&&typeof e.expiresAt==`number`&&e.expiresAt>Date.now())return J={isPro:!0,expiresAt:e.expiresAt,checkedAt:Date.now()-24e4,planType:e.planType||`monthly`},!0}catch{}return J={isPro:!1,expiresAt:0,checkedAt:Date.now()},!1}}async function gr(e){if(!n.currentUser)throw Error(`sign_in_required`);if(!await Y({forceRefresh:!0}))throw Error(`pro_required:`+e);return!0}function X(){document.getElementById(`pro-upgrade-modal`).classList.remove(`show`),document.body.style.overflow=``}document.addEventListener(`DOMContentLoaded`,()=>{let e=document.getElementById(`pro-upgrade-modal`);e&&e.addEventListener(`click`,e=>{e.target===e.currentTarget&&X()})});async function _r(e){return await Y()?!0:(G(),e&&y(`⭐ `+e+` requires Pro`,`info`),!1)}async function vr(){return typeof Razorpay<`u`||new Promise((e,t)=>{let n=document.createElement(`script`);n.src=`https://checkout.razorpay.com/v1/checkout.js`,n.onload=()=>e(!0),n.onerror=()=>t(Error(`Failed to load payment gateway`)),document.head.appendChild(n)})}async function yr(e){y(`🔄 Activating coupon...`,`info`);try{let t=await n.currentUser.getIdToken(!0),r=await fetch(q.activateTrial,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+t},body:JSON.stringify({data:{uid:n.currentUser.uid,couponCode:W?.code||``,plan:e}})});if(!r.ok)throw Error(`Activation failed (`+r.status+`)`);let i=await r.json(),a=i.result||i;if(!a.success)throw Error(a.message||`Activation declined`);J={isPro:!0,expiresAt:a.expiresAt,checkedAt:Date.now(),planType:e},localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:a.expiresAt,cachedAt:Date.now(),planType:e})),y(`🎉 100% coupon applied! Pro activated for free.`,`success`),H(),H(),X(),Q(),Z(),B()}catch(e){y(`❌ Coupon activation failed: `+(e.message||`Please try again`),`alarm`),console.error(`[EIN] Free coupon activation error:`,e),/already have an active Pro subscription/i.test(e.message||``)&&await Y({forceRefresh:!0})&&(Q(),Z(),B())}}async function br(){if(!n.currentUser){y(`🔐 Please sign in with Google first`,`info`),o();return}if(await Y()){y(`⭐ You're already on Pro!`,`success`),X();return}let e=W?W.discount:0;if(e>=100){await yr(`monthly`);return}try{await vr()}catch{y(`❌ Could not load payment gateway. Check your internet.`,`alarm`);return}await Cr({plan:`monthly`,amount:Math.round(14900*(1-e/100)),description:`Pro Plan — 1 Month`,couponCode:W?.code||null})}async function xr(){if(!n.currentUser){y(`🔐 Please sign in with Google first`,`info`),o();return}if(await Y()){y(`⭐ You're already on Pro!`,`success`),X();return}let e=W?W.discount:0;if(e>=100){await yr(`annual`);return}try{await vr()}catch{y(`❌ Could not load payment gateway. Check your internet.`,`alarm`);return}await Cr({plan:`annual`,amount:Math.round(99900*(1-e/100)),description:`Pro Annual Plan — ₹999/year`,couponCode:W?.code||null})}async function Sr(){if(!n.currentUser){y(`🔐 Please sign in with Google first to start your trial`,`info`),o();return}if(await Y()){y(`⭐ You're already on Pro!`,`success`),X();return}y(`🔄 Activating trial...`,`info`);try{let e=await n.currentUser.getIdToken(!0),t=await fetch(q.activateTrial,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+e},body:JSON.stringify({data:{uid:n.currentUser.uid}})});if(!t.ok)throw Error(`Trial activation failed (`+t.status+`)`);let r=await t.json(),i=r.result||r;if(!i.success)throw Error(i.message||`Trial activation declined`);J={isPro:!0,expiresAt:i.expiresAt,checkedAt:Date.now(),planType:`trial`},localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:i.expiresAt,cachedAt:Date.now(),planType:`trial`})),y(`🎁 7-day Pro trial activated! Enjoy all features.`,`success`),H(),X(),Q(),Z(),B()}catch(e){y(`❌ Trial activation failed: `+(e.message||`Please try again`),`alarm`),console.error(`[EIN] Trial activation error:`,e),/already have an active Pro subscription/i.test(e.message||``)&&await Y({forceRefresh:!0})&&(Q(),Z(),B())}}async function Cr({plan:e,amount:t,description:r,couponCode:i=null}){let a=document.getElementById(`pm-monthly-btn`),o=a?a.innerHTML:``;a&&(a.disabled=!0,a.innerHTML=`⏳ Creating order...`,a.style.opacity=`0.7`);let s;try{let r=await n.currentUser.getIdToken(!0),a=await(await fetch(q.createOrder,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+r},body:JSON.stringify({data:{email:n.currentUser.email||``,name:n.currentUser.displayName||``,plan:e,amount:t,couponCode:i}})})).json();if(a.error){let e=typeof a.error==`string`?a.error:a.error.message||a.error.description||JSON.stringify(a.error);throw Error(e||`Order creation failed`)}s=a.result||a}catch(e){y(`❌ `+(e.message||`Order creation failed`),`alarm`),a&&(a.disabled=!1,a.innerHTML=o,a.style.opacity=`1`);return}if(a&&(a.disabled=!1,a.innerHTML=o,a.style.opacity=`1`),s.zeroCost){J={isPro:!0,expiresAt:s.expiresAt,checkedAt:Date.now(),planType:e},localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:s.expiresAt,cachedAt:Date.now(),planType:e})),y(`🎉 100% coupon applied! Pro activated — ₹0 charged.`,`success`),H(),H(),X(),Q(),Z(),B();return}let c={key:s.keyId,amount:s.amount||t,currency:s.currency||`INR`,order_id:s.orderId,name:`Exam Is Near`,description:r,image:`https://exam-is-near.web.app/assets/icons/icon-192.png`,prefill:{name:n.currentUser.displayName||``,email:n.currentUser.email||``},notes:{uid:n.currentUser.uid,plan:e},theme:{color:`#FFE66D`},handler:async function(t){await wr(t,e,i)},modal:{ondismiss:()=>{y(`Payment cancelled`,`info`)}}};try{let e=new Razorpay(c);e.on(`payment.failed`,e=>{y(`⚠️ Payment failed: `+e.error.description,`alarm`)}),e.open()}catch(e){y(`❌ Could not open payment window: `+e.message,`alarm`)}}async function wr(e,t,r=null){y(`🔄 Verifying payment...`,`info`);try{let i=await n.currentUser.getIdToken(!0),a=await(await fetch(q.verifyPayment,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+i},body:JSON.stringify({data:{orderId:e.razorpay_order_id,paymentId:e.razorpay_payment_id,signature:e.razorpay_signature,plan:t,couponCode:r||null}})})).json(),o=a.result||a;if(o.success)J={isPro:!0,expiresAt:o.expiresAt,checkedAt:Date.now(),planType:t},localStorage.setItem(K,JSON.stringify({active:!0,expiresAt:o.expiresAt,cachedAt:Date.now(),planType:t})),y(t===`annual`?`🎉 Welcome to Pro Annual! You saved ₹792!`:`🎉 Welcome to Pro! All features unlocked.`,`success`),H(),H(),X(),Q(),Z(),B();else throw Error(o.message||`Verification returned false`)}catch(t){let n=e.razorpay_payment_id;y(`⚠️ Verification error. Save this ID and contact support: `+n,`alarm`),console.error(`[EIN] Payment verify failed:`,t,`Payment ID:`,n)}}function Z(){let e=document.getElementById(`ad-unit-bottom`);e&&(e.style.display=`none`)}async function Q(){let e=await Y({forceRefresh:!0});[`pro-header-badge`,`go-pro-header-btn`].forEach(e=>{let t=document.getElementById(e);t&&t.remove()});let t=document.getElementById(`sync-badge`);if(!(!t||!t.parentNode)){if(e){let e=document.createElement(`div`);e.id=`pro-header-badge`,e.className=`pro-badge`,e.style.cssText=`margin-top:5px;cursor:default`,e.innerHTML=`⭐ PRO MEMBER`,e.title=`You have an active Pro subscription — verified server-side`,t.parentNode.insertBefore(e,t.nextSibling)}else{let e=document.createElement(`button`);e.id=`go-pro-header-btn`,e.style.cssText=`margin-top:5px;background:linear-gradient(135deg,#1a1200,#120e00);border:1px solid #FFE66D33;border-radius:12px;color:#FFE66D;padding:4px 11px;font-size:10px;font-family:'Inter',inherit;cursor:pointer;font-weight:700;letter-spacing:0.5px;display:block;transition:all 0.2s`,e.innerHTML=`⭐ Go Pro · ₹149/mo`,e.onclick=G,e.onmouseover=()=>{e.style.borderColor=`#FFE66D66`,e.style.background=`linear-gradient(135deg,#201800,#181000)`},e.onmouseout=()=>{e.style.borderColor=`#FFE66D33`,e.style.background=`linear-gradient(135deg,#1a1200,#120e00)`},t.parentNode.insertBefore(e,t.nextSibling)}}}setTimeout(Q,1200),typeof window<`u`&&Object.assign(window,{CF_BASE:hr,CF_URLS:q,PRO_KEY:K,PRO_PRICE_INR:149,_activateFreeCoupon:yr,_activeCoupon:W,_hideAdsForPro:Z,_launchRazorpay:Cr,_loadRazorpay:vr,_proCache:J,_resetCouponState:pr,_updateProHeaderUI:Q,_verifyAndGrantPro:wr,applyCouponCode:mr,closeProModal:X,initiateProPayment:br,initiateTrialPayment:Sr,initiateYearlyPayment:xr,isProUser:Y,openProModal:G,requirePro:_r,verifyProOrThrow:gr});var $={},Tr=`https://asia-south1-exam-is-near.cloudfunctions.net/groqProxy`,Er=`llama-3.3-70b-versatile`;$.aiHistory=[];var Dr=5,Or=3,kr=()=>new Date().toISOString().split(`T`)[0];function Ar(e){try{let t=JSON.parse(localStorage.getItem(e)||`null`);if(t&&t.day===kr())return t.count}catch{}return 0}function jr(e){let t=kr();try{let n=JSON.parse(localStorage.getItem(e)||`null`),r=(n&&n.day===t?n.count:0)+1;return localStorage.setItem(e,JSON.stringify({day:t,count:r})),r}catch{return 1}}var Mr=Ar(`ein_free_ai_day`);$.freeQuizCount=Ar(`ein_free_quiz_day`);var Nr=`ein_ai_chat_history`,Pr=120;async function Fr(){try{if(!await Y())return;let e=localStorage.getItem(Nr);if(e){let t=JSON.parse(e);Array.isArray(t)&&t.length>0&&($.aiHistory=t,Vr())}}catch{}}async function Ir(){try{if(!await Y())return;let e=$.aiHistory.slice(-120);localStorage.setItem(Nr,JSON.stringify(e))}catch{}}async function Lr(e,t=!1,r=null){try{let i=await Y();m._proStatusCache=i;let a=t?6e3:i?3e3:800,o=t?`You are an expert JEE/NEET/competitive exam question generator trained on NTA-level content. Respond ONLY with a valid raw JSON array. No markdown, no backticks, no preamble, no explanation. Start your response with [ and end with ]. Each question must be challenging, application-based, and exam-ready — never trivial. Include numerical problems, assertion-reasoning, multi-concept questions, and common exam traps. Always provide a concise explanation field.`:r||(i?`You are an expert AI study tutor. Give thorough, deeply explained answers with examples, mnemonics, and exam tips. Use **bold** for key terms, bullet points for lists, numbered steps for procedures. End with an encouraging line.`:`You are a concise study assistant. Answer clearly and briefly.`),s={"Content-Type":`application/json`},c=n.currentUser;if(!c&&n.auth)try{c=await new Promise(e=>{let t=n.auth.onAuthStateChanged(n=>{t(),e(n)});setTimeout(()=>e(null),3e3)})}catch{}if(c)try{s.Authorization=`Bearer `+await c.getIdToken()}catch{}let l=await fetch(Tr,{method:`POST`,headers:s,body:JSON.stringify({model:Er,max_tokens:a,messages:[{role:`system`,content:o},{role:`user`,content:e}],temperature:t?.1:i?.65:.7})});if(!l.ok){let e=await l.text().catch(()=>``);return`⚠️ AI Error `+l.status+(e?`: `+e.slice(0,120):``)}return(await l.json()).choices[0]?.message?.content||`No response.`}catch(e){return`⚠️ Network error: `+e.message}}function Rr(e){let t=un()[e];if(!t)return;let n=document.getElementById(`ai-input`);n&&(n.value=t.prompt,n.style.height=`auto`,n.style.height=Math.min(n.scrollHeight,120)+`px`,Br())}function zr(e){let t=dn()[e];if(!t)return;let n=document.getElementById(`ai-input`);n&&(n.value=`Tell me about `+t.title,Br())}async function Br(){let e=document.getElementById(`ai-input`);if(!e)return;let t=e.value.trim();if(!t||m.aiTyping)return;if(!await Y()){if(Mr>=5){y(`⭐ Free limit reached (5 messages). Upgrade to Pro for unlimited AI chat!`,`alarm`),G();return}Mr=jr(`ein_free_ai_day`)}if(e.value=``,e.style.height=`auto`,!F._aiActiveSession){let e=`sess_`+Date.now();F._aiActiveSession=e,R(),I.unshift({id:e,title:`New chat`,ts:Date.now(),messages:[]}),gn()}m.aiTyping=!0,$.aiHistory.push({role:`user`,text:t,ts:Date.now()}),$.aiHistory.push({role:`ai`,text:`⏳ Thinking…`,ts:Date.now()}),Vr();let n=document.getElementById(`ai-chat-box`);n&&(n.scrollTop=n.scrollHeight);let r=document.getElementById(`ai-subject-ctx`)?.value||`all`,i=r===`all`?`all subjects`:_().find(e=>e.id===r)?.name||r,a=_().map(e=>e.name).join(`, `),o=_().map(e=>e.name+`:`+w(e.id)+`%`).join(`, `),s=h.activeCourse===`neet`?`NEET UG aspirant`:h.activeCourse===`jee`?`JEE (Mains & Advanced) aspirant`:h.activeCourse===`nfsu`?`B.Sc. LL.B. student at NFSU`:h.activeCourse===`nfsu1`?`B.Sc. LL.B. (Hons.) Sem I student at NFSU`:h.activeCourse===`nfsu3`?`B.Sc. LL.B. Sem III student at NFSU`:h.activeCourse===`cbse10`?`CBSE Class 10 student`:h.activeCourse===`cbse11`?`CBSE Class 11 `+(ie[h.cbse11Stream]?.label?.split(`—`)[1]?.trim()||`student`)+` student`:h.activeCourse===`cbse12`?`CBSE Class 12 `+(l[h.cbse12Stream]?.label?.split(`—`)[1]?.trim()||`student`)+` student`:`student`,c=h.activeCourse===`neet`?` Focus on Biology, Physics, Chemistry NCERT concepts.`:h.activeCourse===`jee`?` Focus on Maths, Physics, Chemistry problem solving and formulas.`:h.activeCourse===`nfsu`?` Focus on law, technology, and forensic science subjects.`:h.activeCourse===`nfsu1`?` Focus on NFSU Sem I subjects: Legal Methods, Law of Tort and Consumer Protection Laws, Law and Literature, Fundamentals of Computer Organization & Embedded Systems, Basic Programming Concepts Using C, and Discrete Mathematics.`:h.activeCourse===`nfsu3`?` Focus on NFSU Sem III subjects: Law of Crimes I (IPC), Constitutional Law I, Law of Contract I, Family Law I, Web Programming (HTML, JS, PHP, MySQL), and Operating System Concepts (Linux, memory, processes).`:h.activeCourse===`cbse10`?` Focus on CBSE Class 10 curriculum — Maths, Science, English, Social Science.`:h.activeCourse===`cbse11`?` Focus on CBSE Class 11 curriculum for `+(ie[h.cbse11Stream]?.desc||`the selected stream`)+`. Give NCERT-focused answers.`:h.activeCourse===`cbse12`?` Focus on CBSE Class 12 board exam for `+(l[h.cbse12Stream]?.desc||`the selected stream`)+`. Give NCERT-focused answers.`:``,u=await Lr(t,!1,`You are an expert AI study tutor for a ${s}. Subjects: ${a}. Exams start in ${C(D(_()[0]?.id)||``)||`a few`} days. Student progress: ${o}. Hours studied: ${T()}h. Current focus: ${i}.${c}\nRules: Be concise yet thorough. Use **bold** for key terms. Use bullet points for lists. Use \`code\` for code snippets. Use numbered steps for procedures. Always end with a 1-line encouragement.`);m.aiTyping=!1,$.aiHistory[$.aiHistory.length-1]={role:`ai`,text:u},$.aiHistory[$.aiHistory.length-1].ts=Date.now(),Vr(),xn(),Ir(),n&&(n.scrollTop=n.scrollHeight)}function Vr(){let e=document.getElementById(`ai-chat-box`);if(!e)return;if($.aiHistory.length===0){B();return}$.aiHistory[$.aiHistory.length-1],$.aiHistory.length-1,e.innerHTML=$.aiHistory.map((e,t)=>On(e,t)).join(``);let t=document.getElementById(`ai-send-btn`);t&&(t.disabled=m.aiTyping),document.querySelectorAll(`.ai-dot,.ai-model-dot`).forEach(e=>{e.className=(e.classList.contains(`ai-model-dot`)?`ai-model-dot`:`ai-dot`)+(m.aiTyping?` thinking`:``)});let n=document.querySelector(`.ai-topbar-title`);n&&$.aiHistory.length>0&&(n.textContent=_n($.aiHistory))}async function Hr(e,t){let n=parseInt(t)||15;y(`🧠 Generating `+n+`-question quiz…`,`info`);let r=h.activeCourse===`jee`,i=h.activeCourse===`neet`,a=h.activeCourse===`cbse10`,o=h.activeCourse===`cbse12`,s=i?`NEET UG (NTA)`:r?`JEE Mains & Advanced (NTA)`:a?`CBSE Class 10 board exam`:o?`CBSE Class 12 board exam`:`university entrance exam`,c=(e=>[...e].sort(()=>Math.random()-.5))(r||i?[`numerical/calculation-based (require substituting values and computing)`,`assertion-reasoning (Statement I & Statement II pattern, NTA format)`,`application-based (multi-concept, requires analysis not just recall)`,`exception/odd-one-out (test conceptual clarity)`,`match the column / statement-based`,`graph/data interpretation (describe a graph scenario in text)`,`common exam traps and misconceptions students get wrong`,`NCERT exemplar difficulty level`,`previous year JEE/NEET pattern questions`,`conceptual (why/how — not definition-based)`]:[`NCERT textbook application`,`value-based`,`case study based`,`graph and diagram interpretation`,`assertion-reasoning`,`multi-step problems`]).slice(0,3).join(`; `),l=await Lr(`Generate exactly ${n} unique, high-quality multiple-choice questions on the topic: "${e}" for ${s} aspirants.

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
Output all ${n} questions. Do not truncate.`,!0);if(!l||typeof l!=`string`||l.startsWith(`⚠️`)||l.startsWith(`No response`))return y(`⚠️ Quiz generation failed: `+(l||`No response`),`alarm`),null;try{let e=l.replace(/```json|```/gi,``).trim().match(/\[[\s\S]*\]/);if(!e)return null;let t=JSON.parse(e[0]);if(!Array.isArray(t)||t.length===0)return null;let r=t.filter(e=>e.q&&Array.isArray(e.options)&&e.options.length>=2&&typeof e.answer==`number`);return r.length===0?null:r.sort(()=>Math.random()-.5).slice(0,n)}catch{return y(`⚠️ Could not parse quiz response. Try again.`,`alarm`),null}}typeof window<`u`&&Object.assign(window,{AI_HISTORY_KEY:Nr,AI_HISTORY_MAX:120,FREE_AI_MSG_LIMIT:5,FREE_QUIZ_LIMIT:3,GROQ_MODEL:Er,GROQ_PROXY_URL:Tr,_freeCounterDay:kr,_incDailyCounter:jr,_initDailyCounter:Ar,askAI:Lr,freeAiMsgCount:Mr,generateQuizFromAI:Hr,loadAIChatHistory:Fr,renderAIChat:Vr,saveAIChatHistory:Ir,sendAIMessage:Br,setQuickPrompt:Rr,setWelcomePrompt:zr});function Ur(){let e=document.getElementById(`mobile-nav-drawer`);e&&(e.classList.add(`open`),document.body.style.overflow=`hidden`),e.querySelectorAll(`.nav-drawer-pill`).forEach(e=>{e.classList.toggle(`active`,e.onclick&&e.onclick.toString().includes(`switchView('`+r.view+`')`))});let n=document.getElementById(`mobile-neetjee-btn`);n&&(n.style.display=h.activeCourse&&h.activeCourse!==`nfsu`&&h.activeCourse!==`cbse10`&&h.activeCourse!==`cbse12`?``:`none`);let i=document.getElementById(`mobile-admin-btn`);i&&(i.style.display=t()?``:`none`)}function Wr(){let e=document.getElementById(`mobile-nav-drawer`);e&&(e.classList.remove(`open`),document.body.style.overflow=``)}document.addEventListener(`keydown`,e=>{if(e.target.tagName===`INPUT`||e.target.tagName===`TEXTAREA`||e.target.tagName===`SELECT`||(r.view===`pomodoro`&&(e.key===` `&&(e.preventDefault(),k.running?kt():Dt()),e.key.toLowerCase()===`r`&&!e.ctrlKey&&(e.preventDefault(),At())),e.ctrlKey||e.metaKey))return;let t={1:`dashboard`,2:`subjects`,3:`alarms`,4:`pomodoro`,5:`flashcards`,6:`quiz`,7:`ai`,8:`analytics`,l:`log`,f:`files`,s:`sync`};t[e.key]&&!e.shiftKey&&(e.preventDefault(),Ze(t[e.key])),e.key===`?`&&e.shiftKey&&(e.preventDefault(),Gr())});function Gr(){let e=document.getElementById(`kbd-shortcuts-modal`);if(e){e.remove();return}let t=document.createElement(`div`);t.id=`kbd-shortcuts-modal`,t.style.cssText=`position:fixed;inset:0;background:#00000088;z-index:9996;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)`,t.innerHTML=`<div style="background:#0f0f18;border:1px solid #2a2a3a;border-radius:16px;padding:24px;max-width:480px;width:92%;max-height:80vh;overflow-y:auto;animation:fadeInUp 0.2s ease">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="font-size:16px;font-weight:bold;color:#EDE8E0">⌨️ Keyboard Shortcuts</div>
      <button onclick="document.getElementById('kbd-shortcuts-modal').remove()" style="background:none;border:none;color:#666;font-size:18px;cursor:pointer">✕</button>
    </div>
    <div style="font-size:11px;color:#444;letter-spacing:1px;margin-bottom:12px;text-transform:uppercase">Navigation</div>
    ${[[`1`,`Overview / Dashboard`],[`2`,`Study Subjects`],[`3`,`Alarms & Timer`],[`4`,`Pomodoro`],[`5`,`Flashcards`],[`6`,`Quiz Mode`],[`7`,`AI Assistant`],[`8`,`Analytics`],[`L`,`Study Log`],[`F`,`Files`],[`S`,`Sync & Account`]].map(([e,t])=>`<div class="kbd-shortcut"><span>${t}</span><kbd class="kbd-key">${e}</kbd></div>`).join(``)}
    <div style="font-size:11px;color:#444;letter-spacing:1px;margin:12px 0;text-transform:uppercase">Pomodoro (when on timer page)</div>
    ${[[`Space`,`Start / Pause`],[`R`,`Reset timer`]].map(([e,t])=>`<div class="kbd-shortcut"><span>${t}</span><kbd class="kbd-key">${e}</kbd></div>`).join(``)}
    <div class="kbd-shortcut" style="margin-top:8px;border-top:1px solid #111;padding-top:10px"><span>Show this panel</span><kbd class="kbd-key">Shift + ?</kbd></div>
  </div>`,t.addEventListener(`click`,e=>{e.target===t&&t.remove()}),document.body.appendChild(t)}function Kr(){let e={exportedAt:new Date().toISOString(),version:`Exam Is Near v15`,course:h.activeCourse||`nfsu`,progress:r.progress,studyLog:r.studyLog,materials:r.materials.map(e=>({...e,data:void 0})),alarms:r.alarms,streak:E(),totalHours:T(),subjectProgress:_().map(e=>({id:e.id,name:e.name,pct:w(e.id)})),flashcards:M,njMistakes:a.mistakes,njSRSCards:a.srsCards},t=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),n=URL.createObjectURL(t),i=document.createElement(`a`);i.href=n,i.download=`exam-is-near-backup-${x()}.json`,document.body.appendChild(i),i.click(),setTimeout(()=>{URL.revokeObjectURL(n),i.remove()},100),y(`✅ Progress exported!`,`success`)}async function qr(){try{await gr(`Export as PDF`)}catch(e){e.message===`sign_in_required`?y(`⚠️ Please sign in first to use PDF export`,`alarm`):(y(`⭐ PDF export is a Pro feature`,`info`),G());return}let e=_().map(e=>{let t=w(e.id),n=(()=>{let t=0;return Object.values(r.studyLog).forEach(n=>{n.subject===e.id&&(t+=n.hours||0)}),t})();return`<tr>
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
<title>Exam Is Near — Study Report (${x()})</title>
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
    <div class="stat"><div class="stat-val">${T()}h</div><div class="stat-lbl">Total Hours</div></div>
    <div class="stat"><div class="stat-val">${E()}</div><div class="stat-lbl">Day Streak 🔥</div></div>
    <div class="stat"><div class="stat-val">${Object.values(r.progress).filter(Boolean).length}</div><div class="stat-lbl">Topics Done</div></div>
    <div class="stat"><div class="stat-val">${_().length}</div><div class="stat-lbl">Subjects</div></div>
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
</html>`,a=new Blob([i],{type:`text/html;charset=utf-8`}),o=URL.createObjectURL(a),s=window.open(o,`_blank`,`width=800,height=900`);if(!s){URL.revokeObjectURL(o),y(`⚠️ Allow popups to generate PDF`,`alarm`);return}s.addEventListener(`load`,()=>{s.print(),URL.revokeObjectURL(o)},{once:!0}),setTimeout(()=>URL.revokeObjectURL(o),3e4),y(`✅ PDF report ready — use 'Save as PDF' in print dialog`,`success`)}function Jr(){let e=document.createElement(`input`);e.type=`file`,e.accept=`.json`,e.onchange=async e=>{try{let t=e.target.files[0];if(t.size>5242880){y(`⚠️ Backup file too large (max 5 MB)`,`alarm`);return}let n=await t.text(),i=JSON.parse(n);if(!i.progress&&!i.studyLog){y(`⚠️ Invalid backup file`,`alarm`);return}if(!confirm(`Import will overwrite your current progress, study log, and materials. Continue?`))return;if(i.progress&&typeof i.progress==`object`&&!Array.isArray(i.progress)){let e=Object.keys(i.progress).slice(0,5e3),t={};e.forEach(e=>{typeof e==`string`&&e.length<100&&(t[e]=!!i.progress[e])}),r.progress=t,g(`progress`,t)}if(i.studyLog&&typeof i.studyLog==`object`&&!Array.isArray(i.studyLog)){let e=Object.keys(i.studyLog).slice(0,1e3),t={};e.forEach(e=>{let n=i.studyLog[e];typeof n==`object`&&n&&(t[e]={hours:parseFloat(n.hours)||0,mood:parseInt(n.mood)||3,subject:String(n.subject||``).slice(0,50)})}),r.studyLog=t,g(`studyLog`,t)}if(Array.isArray(i.materials)){let e=i.materials.slice(0,500).map(e=>({id:String(e.id||b()).slice(0,50),subjectId:String(e.subjectId||``).slice(0,50),type:String(e.type||`📝 Note`).slice(0,30),title:String(e.title||``).slice(0,200),content:String(e.content||``).slice(0,1e4),tags:Array.isArray(e.tags)?e.tags.slice(0,20).map(e=>String(e).slice(0,50)):[],created:String(e.created||x()).slice(0,20),pinned:!!e.pinned}));r.materials=e,g(`materials`,e)}if(Array.isArray(i.alarms)){let e=i.alarms.slice(0,100).map(e=>({id:String(e.id||b()).slice(0,50),time:String(e.time||`07:00`).slice(0,5),label:String(e.label||`Study`).slice(0,100),enabled:!!e.enabled,repeat:!!e.repeat,days:Array.isArray(e.days)?e.days.slice(0,7).map(Number):[],ringtone:String(e.ringtone||`classic`).slice(0,30)}));r.alarms=e,g(`alarms`,e)}if(i.flashcards&&typeof i.flashcards==`object`&&!Array.isArray(i.flashcards)){let e={};Object.keys(i.flashcards).slice(0,50).forEach(t=>{Array.isArray(i.flashcards[t])&&(e[t]=i.flashcards[t].slice(0,200).map(e=>({front:String(e.front||``).slice(0,500),back:String(e.back||``).slice(0,1e3)})))}),Object.assign(M,e),P()}Array.isArray(i.njMistakes)&&(a.mistakes=i.njMistakes.slice(0,500),se()),Array.isArray(i.njSRSCards)&&(a.srsCards=i.njSRSCards.slice(0,500),se()),y(`✅ Progress imported successfully!`,`success`),H(),B()}catch(e){y(`⚠️ Import failed: `+e.message,`alarm`)}},e.click()}typeof window<`u`&&Object.assign(window,{closeNavDrawer:Wr,exportProgressJSON:Kr,exportProgressPDF:qr,importProgressJSON:Jr,openNavDrawer:Ur,showKeyboardShortcuts:Gr});export{Nr as AI_HISTORY_KEY,Pr as AI_HISTORY_MAX,fn as AI_QUICK_PROMPTS,mn as AI_SESSIONS_KEY,hn as AI_SESSION_MAX,pn as AI_WELCOME_CARDS,$ as AiAssistantSetupShared,F as AiAssistantViewShared,hr as CF_BASE,q as CF_URLS,Ut as FLASH_LOG_MAX,Dr as FREE_AI_MSG_LIMIT,Or as FREE_QUIZ_LIMIT,Er as GROQ_MODEL,Tr as GROQ_PROXY_URL,bt as POM_PRESETS,O as POM_QUOTES,K as PRO_KEY,fr as PRO_PRICE_INR,Ht as QUIZ_LOG_MAX,ar as RINGTONES,Ge as _EXAM_MONTHS,yr as _activateFreeCoupon,W as _activeCoupon,R as _aiLoadSessions,xn as _aiPersistCurrentSession,En as _aiRelTime,gn as _aiSaveSessions,_n as _aiSessionTitle,I as _aiSessions,L as _aiSidebarOpen,Tn as _aiToggleIconClosed,wn as _aiToggleIconOpen,Cn as _closeAISidebarMobile,Ue as _courseChosen,Jn as _doRender,Ke as _examDateToISO,kr as _freeCounterDay,Z as _hideAdsForPro,jr as _incDailyCounter,Ar as _initDailyCounter,qe as _isoToExamDate,tr as _lastAlarmCheck,Cr as _launchRazorpay,vr as _loadRazorpay,Ye as _pageMeta,Lt as _pomFSChange,J as _proCache,qn as _renderResolvers,z as _renderTimer,pr as _resetCouponState,Xe as _updatePageMeta,Q as _updateProHeaderUI,wr as _verifyAndGrantPro,lt as addMaterial,gt as addPresetAlarms,bn as aiDeleteSession,yn as aiLoadSession,vn as aiNewChat,Sn as aiToggleSidebar,mr as applyCouponCode,Lr as askAI,pt as cancelEdit,nr as checkAlarms,he as checkMaintenance,ze as checkShareLinkOnLoad,nn as clearSubjectDeck,Rn as closeFolderPicker,Wr as closeNavDrawer,Oe as closePreview,X as closeProModal,Pn as closeSectionModal,Le as copyToClipboard,Vn as createDriveFolderForSubject,_t as deleteAlarm,we as deleteAllUserFiles,Ce as deleteFile,sn as deleteFlashcard,ut as deleteMaterial,In as deleteSectionItem,be as deleteUserFileFromCloud,ir as dismissAlarm,Ne as exportData,Kr as exportProgressJSON,qr as exportProgressPDF,$t as flashBack,M as flashDecks,Qt as flashSelectSubject,N as flashState,rn as flipCard,de as formatSize,Mr as freeAiMsgCount,tn as generateFlashcards,Kn as generateProfileInsight,Hr as generateQuizFromAI,Ie as generateShareLink,un as getAIQuickPrompts,dn as getAIWelcomeCards,Zt as getActiveDeck,jn as getActiveTab,C as getDaysLeft,D as getExamDate,ue as getFileIcon,ke as getGoogleAccessToken,fe as getStorageUsedMB,E as getStreak,w as getSubjectPct,An as getSubjectSection,T as getTotalHours,We as getTotalPct,xe as handleFileSelect,Se as handleFolderSelect,Be as handlePastedShareLink,st as hideAddForm,Pe as importData,Re as importFromShareLink,Jr as importProgressJSON,br as initiateProPayment,Sr as initiateTrialPayment,xr as initiateYearlyPayment,kn as installPWA,Y as isProUser,Fr as loadAIChatHistory,pe as loadAdminMaterials,ge as loadAnnouncement,zn as loadDriveFolders,_e as loadExamSchedule,ve as loadSharedFiles,me as loadTheme,ye as loadUserFiles,rt as logToday,Fe as mergeImportData,an as nextCard,Yt as nextQuestion,en as openChapterPicker,Ln as openFolderPicker,Ur as openNavDrawer,De as openPreview,G as openProModal,Nn as openSectionModal,ur as pauseTimer,sr as playAlarmSound,Tt as pomApplyCustom,Ft as pomCleanupFS,Pt as pomFSInterval,zt as pomGetSubjectHoursFormatted,kt as pomPause,Ot as pomPlayChime,It as pomRenderFSOverlay,At as pomReset,xt as pomSaveHours,Ct as pomSaveLog,St as pomSaveSettings,wt as pomSetPreset,Rt as pomSetSubject,jt as pomSkipBreak,Dt as pomStart,Mt as pomStartBreak,k as pomState,Nt as pomToggleFullScreen,Et as pomToggleSound,Bt as pomTotalHoursFormatted,on as prevCard,j as quizState,B as render,Dn as renderAI,Vr as renderAIChat,On as renderAIMsgBubble,He as renderAbout,Qn as renderAlarms,ln as renderAnalytics,Xn as renderDashboard,Ae as renderDocxPreview,Me as renderFiles,cn as renderFlashcards,Wn as renderFolderPicker,$n as renderLog,je as renderPDFPreview,Vt as renderPomodoro,Gn as renderProfile,Xt as renderQuiz,Un as renderSectionModal,Hn as renderSubjectSectionTabs,Zn as renderSubjects,Yn as renderSync,_r as requirePro,dr as resetTimer,Ir as saveAIChatHistory,Ve as saveAppConfig,mt as saveEdit,P as saveFlashDecks,Kt as saveFlashLog,ht as saveNewAlarm,Gt as saveQuizLog,Fn as saveSectionItem,nt as saveSubjectNote,at as searchMats,Jt as selectAnswer,Bn as selectDriveFolder,V as selectedRingtone,Br as sendAIMessage,$e as setActiveSubject,Mn as setActiveTab,Je as setExamDate,tt as setHours,it as setMatFilter,et as setMood,Rr as setQuickPrompt,or as setRingtone,yt as setTimerMode,zr as setWelcomePrompt,ot as showAddForm,Gr as showKeyboardShortcuts,H as spawnStars,ft as startEdit,qt as startQuiz,lr as startTimer,cr as stopAlarmSound,Ze as switchView,vt as toggleAlarm,dt as togglePin,Wt as toggleQuizReview,Qe as toggleTopic,rr as triggerAlarm,er as updateClock,Te as updateFileNote,Ee as updateFileSubject,ct as updateNewMat,A as updatePomDisplay,U as updateTimerDisplay,gr as verifyProOrThrow};
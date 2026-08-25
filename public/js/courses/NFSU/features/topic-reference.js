// ══════════════════════════════════════════════════════════════
// TOPIC REFERENCE — chapter/topic-wise Caselaws, Act sections,
// Definitions + Notes-uploaded button + admin-uploaded PYQ accordion
// ══════════════════════════════════════════════════════════════
// Scope: only rendered for subjects flagged `lawRef:true` in data.js —
// now set on every law subject across all 3 semesters:
//  Sem 1: Legal Methods, Law of Tort, Law and Literature
//  Sem 2: Legal Language, Law & Society, Jurisprudence
//         (flagged on both the legacy flat `SUBJECTS` array and
//          `SUBJECTS_NFSU2` — data.js currently defines Sem 2 subjects
//          twice under different consts; both are patched so the
//          feature shows regardless of which one is live)
//  Sem 3: Law of Crimes I, Constitutional Law I, Law of Contract I,
//         Family Law I
// STEM subjects (C, C++, RDBMS, Statistics, Computer Organization,
// Web Programming, OS, Discrete Math) are untouched.
//
// CURATED CONTENT FILES (load these 3 BEFORE this file):
//   features/reference-caselaws.js, features/reference-definitions.js,
//   features/reference-bareacts.js — each independently optional per
//   topic; see getCuratedRef() below for how they're merged.
//
// THEMING: uses CSS custom properties (--card-bg, --text-primary,
// --text-muted, --border-color, --panel-bg) with dark-theme hex
// fallbacks, so if the app's existing design-token system defines
// these vars for light mode, this panel themes automatically.
// If your token names differ, just rename the var() first args below.

// ── State ──
let topicRefMode = localStorage.getItem("st_topicRefMode") || "curated"; // 'curated' | 'ai'
let refOpenTopic = null;          // currently expanded topic key, or null
let refNotesOpen = {};            // { topicKey: bool }
let refPyqOpen = {};              // { subjectId: bool }
let refSubTab = {};                // { topicKey: 'explain' | 'case' } — which tab is showing
let refAiCache = JSON.parse(localStorage.getItem("st_topicRefAiCache") || "{}"); // { topicKey: {...} }
let refAiLoading = {};            // { topicKey: bool }

function saveRefAiCache(){
  localStorage.setItem("st_topicRefAiCache", JSON.stringify(refAiCache));
  if(!_firestoreUpdating && typeof pushToFirebase === "function"){
    clearTimeout(refAiCache._timer);
    refAiCache._timer = setTimeout(pushToFirebase, 1200);
  }
}

function topicRefKey(subId, unitId, idx){ return `${subId}:${unitId}:${idx}`; }

// ── Curated content now lives in 3 separate files, loaded before this one ──
//   features/reference-caselaws.js   → CURATED_CASELAWS[key]   = [{name,cite,facts,holding}]
//   features/reference-definitions.js → CURATED_DEFINITIONS[key] = {items:[{term,def}], examTip}
//   features/reference-bareacts.js   → CURATED_BAREACTS[key]   = ["Act — Section", ...]
// This function reassembles them into the shape renderRefSubTabs() expects.
// A topic with entries in some files but not others still renders correctly —
// each block is independently optional.
function getCuratedRef(key){
  const caselaws = (typeof CURATED_CASELAWS !== "undefined") ? CURATED_CASELAWS[key] : null;
  const defs = (typeof CURATED_DEFINITIONS !== "undefined") ? CURATED_DEFINITIONS[key] : null;
  const acts = (typeof CURATED_BAREACTS !== "undefined") ? CURATED_BAREACTS[key] : null;
  if(!caselaws && !defs && !acts) return null;
  return {
    caselaws: caselaws || [],
    definitions: defs?.items || [],
    acts: acts || [],
    notes: defs?.examTip || ""
  };
}

function aiGenerateTopicRef(sub, unit, topic){
  return `Generate a detailed legal reference panel for law students revising "${esc(topic)}" (Unit: ${esc(unit.name)}, Subject: ${esc(sub.name)}, ${esc(sub.code||"")}).
Return ONLY a raw JSON object, no markdown, no backticks, in this exact shape:
{"caselaws":[{"name":"...","cite":"...","facts":"2-4 sentence descriptive summary of the facts","holding":"2-4 sentence descriptive summary of the judgment/held, and why it matters for this topic"}],"acts":["Act name — Section ref"],"definitions":[{"term":"...","def":"..."}],"notes":"1-2 sentence exam tip"}
Include at least 3 real, correctly-cited Indian caselaws (or foundational English precedents where Indian law is derived from them). Facts and holding must each be genuinely descriptive, not one-liners.`;
}

async function generateTopicRef(subId, unitId, idx){
  const key = topicRefKey(subId, unitId, idx);
  const _subs = getSubjects();
  const sub = _subs.find(s=>s.id===subId);
  const unit = sub?.units.find(u=>u.id===unitId);
  const topic = unit?.topics[idx];
  if(!sub || !unit || topic===undefined) return;

  refAiLoading[key] = true;
  render();
  try{
    const prompt = aiGenerateTopicRef(sub, unit, typeof topic==="string"?topic:topic.name||"");
    const resp = await askAI(prompt, true,
      "You are a precise Indian legal reference generator for law students. Only cite real, verifiable caselaws and statute sections. If unsure of an exact citation, say so rather than inventing one. Respond ONLY with raw JSON, no markdown.");
    const match = resp.match(/\{[\s\S]*\}/);
    const data = match ? JSON.parse(match[0]) : null;
    if(!data) throw new Error("AI reference generation failed");
    refAiCache[key] = data;
    saveRefAiCache();
  }catch(e){
    console.warn("generateTopicRef error:", e);
    showToast("⚠️ Couldn't generate reference — try again", "alarm");
  }finally{
    refAiLoading[key] = false;
    render();
  }
}

function setTopicRefMode(m){
  topicRefMode = m;
  localStorage.setItem("st_topicRefMode", m);
  render();
}

function toggleTopicRefExpand(subId, unitId, idx){
  const key = topicRefKey(subId, unitId, idx);
  refOpenTopic = (refOpenTopic === key) ? null : key;
  render();
}

function toggleTopicRefNotes(key){
  refNotesOpen[key] = !refNotesOpen[key];
  render();
}

function toggleSubjectPyq(subId){
  refPyqOpen[subId] = !refPyqOpen[subId];
  render();
}

function setRefSubTab(key, tab){
  refSubTab[key] = tab;
  render();
}

// ── Renderers ──

function renderTopicRefModeSwitch(){
  return `<div style="display:flex;gap:6px;background:var(--card-bg,#0f0f18);border:1px solid var(--border-color,#2a2a3a);border-radius:14px;padding:4px;margin-bottom:14px">
    <button onclick="setTopicRefMode('curated')" style="flex:1;text-align:center;padding:9px 8px;border-radius:10px;cursor:pointer;font-size:11px;font-weight:bold;border:none;font-family:inherit;transition:all .2s;background:${topicRefMode==='curated'?'#06D6A0':'transparent'};color:${topicRefMode==='curated'?'#08080f':'var(--text-muted,#666)'}">📗 Hand-curated</button>
    <button onclick="setTopicRefMode('ai')" style="flex:1;text-align:center;padding:9px 8px;border-radius:10px;cursor:pointer;font-size:11px;font-weight:bold;border:none;font-family:inherit;transition:all .2s;background:${topicRefMode==='ai'?'#FFE66D':'transparent'};color:${topicRefMode==='ai'?'#08080f':'var(--text-muted,#666)'}">✨ AI Generate</button>
  </div>`;
}

function renderTopicRefNotesButton(key, subId){
  const files = (state.files||[]).filter(f=>f.subjectId===subId);
  const open = !!refNotesOpen[key];
  let html = `<div style="margin-bottom:10px">
    <button onclick="toggleTopicRefNotes('${key}')" style="display:flex;align-items:center;gap:5px;background:#0a1a1a;border:1px solid #4ECDC4;color:#4ECDC4;padding:6px 11px;border-radius:8px;font-size:11px;cursor:pointer;font-family:inherit;font-weight:bold">
      📎 Uploaded notes <span style="background:#4ECDC4;color:#08080f;padding:1px 6px;border-radius:10px;font-size:9px;margin-left:2px">${files.length}</span>
    </button>
  </div>`;
  if(open){
    if(files.length){
      html += `<div style="margin-bottom:12px;padding:10px;background:var(--card-bg,#0f0f18);border:1px solid #4ECDC4;border-radius:10px">
        ${files.slice(0,8).map(f=>{
          const icon = getFileIcon(f.type,f.name);
          return `<div style="display:flex;align-items:center;gap:8px;padding:7px 6px;border-radius:6px" onclick="openPreview('${f.id}')">
            <div style="font-size:16px;flex-shrink:0">${icon}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;color:var(--text-primary,#EDE8E0);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(f.name)}</div>
              <div style="font-size:9px;color:var(--text-muted,#555)">${formatSize(f.size||0)} · ${esc(f.created||"")}</div>
            </div>
          </div>`;
        }).join("")}
        <div style="text-align:center;margin-top:6px"><button class="btn-ghost" style="font-size:10px" onclick="state.newMat.subjectId='${subId}';switchView('files');setTimeout(()=>showAddForm(),50)">+ Upload note for this subject</button></div>
      </div>`;
    }else{
      html += `<div style="margin-bottom:12px;padding:14px;text-align:center;background:var(--card-bg,#0f0f18);border:1px solid #4ECDC4;border-radius:10px;font-size:11px;color:var(--text-muted,#555)">
        No notes uploaded for this subject yet.
        <div style="margin-top:6px"><button class="btn-ghost" style="font-size:10px" onclick="state.newMat.subjectId='${subId}';switchView('files');setTimeout(()=>showAddForm(),50)">+ Upload one</button></div>
      </div>`;
    }
  }
  return html;
}

function renderExplanationBlock(data){
  let html = "";
  if(data.acts?.length){
    html += `<div style="margin-bottom:12px"><div style="font-size:10px;letter-spacing:1px;color:#FF6B35;text-transform:uppercase;margin-bottom:6px;font-weight:bold">📜 Relevant Act / Sections</div>`;
    data.acts.forEach(a=>{
      html += `<span style="display:inline-block;background:#1a1200;border:1px solid #FF6B3544;color:#FF6B35;padding:3px 8px;border-radius:6px;font-size:10px;font-family:monospace;margin:2px 4px 2px 0">${esc(a)}</span>`;
    });
    html += `</div>`;
  }
  if(data.definitions?.length){
    html += `<div style="margin-bottom:12px"><div style="font-size:10px;letter-spacing:1px;color:#06D6A0;text-transform:uppercase;margin-bottom:6px;font-weight:bold">🔑 Key Definitions</div>`;
    data.definitions.forEach(d=>{
      html += `<div style="color:var(--text-dim,#bbb);font-size:11px;margin-bottom:4px;line-height:1.4"><b style="color:var(--text-primary,#EDE8E0)">${esc(d.term)}:</b> ${esc(d.def)}</div>`;
    });
    html += `</div>`;
  }
  if(data.notes){
    html += `<div><div style="font-size:10px;letter-spacing:1px;color:#FFE66D;text-transform:uppercase;margin-bottom:6px;font-weight:bold">💡 Exam Notes</div><div style="color:var(--text-dim,#999);font-size:11px;line-height:1.5">${esc(data.notes)}</div></div>`;
  }
  if(!html){
    html = `<div style="color:var(--text-muted,#555);font-size:11px;text-align:center;padding:8px">No bare act / explanation added yet for this topic.</div>`;
  }
  return html;
}

function renderCaseLawBlock(data){
  if(!data.caselaws?.length){
    return `<div style="color:var(--text-muted,#555);font-size:11px;text-align:center;padding:8px">No case law added yet for this topic.</div>`;
  }
  let html = `<div style="font-size:10px;letter-spacing:1px;color:#C77DFF;text-transform:uppercase;margin-bottom:6px;font-weight:bold">⚖️ Related Caselaws (${data.caselaws.length})</div>`;
  data.caselaws.forEach(c=>{
    html += `<div style="margin-bottom:10px;padding:10px 12px;background:var(--card-bg,#0f0f18);border:1px solid var(--border-color,#1e1e2e);border-left:2px solid #C77DFF;border-radius:0 8px 8px 0">
      <div style="color:var(--text-primary,#EDE8E0);font-weight:bold;font-size:12px">${esc(c.name)}</div>
      <div style="color:var(--text-muted,#555);font-size:10px;font-family:monospace;margin-bottom:6px">${esc(c.cite||"")}</div>
      <div style="font-size:9px;letter-spacing:0.5px;color:#5B9BD5;text-transform:uppercase;font-weight:bold;margin-bottom:2px">Facts</div>
      <div style="color:var(--text-dim,#aaa);font-size:11px;line-height:1.55">${esc(c.facts||"")}</div>
      <div style="font-size:9px;letter-spacing:0.5px;color:#06D6A0;text-transform:uppercase;font-weight:bold;margin-top:6px;margin-bottom:2px">Judgment / Held</div>
      <div style="color:var(--text-dim,#aaa);font-size:11px;line-height:1.55">${esc(c.holding||"")}</div>
    </div>`;
  });
  return html;
}

function renderRefSubTabs(key, data){
  const tab = refSubTab[key] || "explain";
  const explainCount = (data.acts?.length||0) + (data.definitions?.length||0);
  const caseCount = data.caselaws?.length || 0;
  return `<div style="display:flex;gap:6px;margin-bottom:10px">
    <button onclick="setRefSubTab('${key}','explain')" style="flex:1;text-align:center;padding:7px 6px;border-radius:8px;cursor:pointer;font-size:10px;font-weight:bold;border:1px solid ${tab==='explain'?'#06D6A0':'var(--border-color,#2a2a3a)'};font-family:inherit;background:${tab==='explain'?'#06D6A01a':'transparent'};color:${tab==='explain'?'#06D6A0':'var(--text-muted,#666)'}">📜 Bare Act & Explanation${explainCount?` (${explainCount})`:''}</button>
    <button onclick="setRefSubTab('${key}','case')" style="flex:1;text-align:center;padding:7px 6px;border-radius:8px;cursor:pointer;font-size:10px;font-weight:bold;border:1px solid ${tab==='case'?'#C77DFF':'var(--border-color,#2a2a3a)'};font-family:inherit;background:${tab==='case'?'#C77DFF1a':'transparent'};color:${tab==='case'?'#C77DFF':'var(--text-muted,#666)'}">⚖️ Case Law${caseCount?` (${caseCount})`:''}</button>
  </div>
  ${tab==='explain' ? renderExplanationBlock(data) : renderCaseLawBlock(data)}`;
}

function renderTopicRefPanel(sub, unit, idx){
  const key = topicRefKey(sub.id, unit.id, idx);
  if(refOpenTopic !== key) return "";

  const notesBtn = renderTopicRefNotesButton(key, sub.id);
  let body = "";

  if(topicRefMode === "curated"){
    const data = getCuratedRef(key);
    body = data
      ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:9px;color:#06D6A0;background:#06D6A014;border:1px solid #06D6A033;padding:2px 7px;border-radius:20px;margin-bottom:8px">📗 Curated</span>${renderRefSubTabs(key, data)}`
      : `<div style="color:var(--text-muted,#555);font-size:11px;text-align:center;padding:8px">No curated reference added yet for this topic. Try ✨ AI Generate instead.</div>`;
  }else{
    if(refAiLoading[key]){
      body = `<div style="display:flex;align-items:center;gap:8px;justify-content:center;padding:16px 0;color:var(--text-muted,#666);font-size:11px"><span class="spinner-inline"></span> Generating reference…</div>`;
    }else if(refAiCache[key]){
      body = `<span style="display:inline-flex;align-items:center;gap:4px;font-size:9px;color:#FFE66D;background:#FFE66D14;border:1px solid #FFE66D33;padding:2px 7px;border-radius:20px;margin-bottom:8px">✨ AI-generated · cached</span>${renderRefSubTabs(key, refAiCache[key])}<div style="margin-top:10px;padding:8px 10px;background:#FF6B3510;border:1px solid #FF6B3533;border-radius:8px;font-size:10px;color:#e69a7a;line-height:1.4">⚠️ AI-generated — verify citations, facts and sections before using in an exam answer.</div>`;
    }else{
      body = `<div style="text-align:center;padding:14px 4px">
        <button onclick="generateTopicRef('${sub.id}','${unit.id}',${idx})" style="background:#FFE66D;color:#08080f;border:none;padding:8px 16px;border-radius:20px;font-size:11px;font-weight:bold;cursor:pointer;font-family:inherit">✨ Generate reference</button>
        <div style="font-size:10px;color:var(--text-muted,#555);margin-top:6px">3+ descriptive caselaws · Act sections · Definitions — cached after first generation</div>
      </div>`;
    }
  }

  return `<div style="margin:2px 4px 10px 30px;padding:12px 14px;background:var(--panel-bg,#0a0a14);border:1px solid var(--border-color,#2a2a3a);border-left:2px solid #FFE66D;border-radius:0 10px 10px 0;font-size:12px;animation:fadeInUp 0.2s ease">
    ${notesBtn}${body}
  </div>`;
}

// ── Admin-uploaded PYQ accordion (reuses state.files / admin materials) ──
function renderSubjectPyqAccordion(sub){
  if(!sub.lawRef) return "";
  const pyqFiles = (state.files||[]).filter(f=>
    f.subjectId===sub.id && f.adminMaterial &&
    (!f.category || f.category==="pyq" || /pyq|previous.?year/i.test(f.name||""))
  );
  const open = !!refPyqOpen[sub.id];

  return `<div class="card" style="margin-top:14px;padding:0;overflow:hidden">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:14px;cursor:pointer" onclick="toggleSubjectPyq('${sub.id}')">
      <div style="font-weight:bold;font-size:13px;display:flex;align-items:center;gap:8px;color:var(--text-primary,#EDE8E0)">📝 Subject PYQs <span style="font-size:10px;color:var(--text-muted,#555);background:var(--border-color,#1a1a2a);padding:2px 8px;border-radius:10px">${pyqFiles.length} file${pyqFiles.length===1?"":"s"}</span></div>
      <div style="font-size:11px;color:var(--text-muted,#555);transition:transform .2s;transform:rotate(${open?90:0}deg)">▸</div>
    </div>
    ${open?`<div style="padding:0 14px 14px">
      <div style="font-size:10px;color:var(--text-muted,#555);margin-bottom:8px;display:flex;align-items:center;gap:5px">🔒 Uploaded by admin — students can view/download only</div>
      ${pyqFiles.length ? pyqFiles.map(f=>`
        <div style="display:flex;align-items:center;gap:10px;padding:9px 8px;border-top:1px solid var(--border-color,#1e1e2e)">
          <div style="width:32px;height:32px;border-radius:8px;background:#C77DFF14;border:1px solid #C77DFF33;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">${getFileIcon(f.type,f.name)}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;color:var(--text-primary,#EDE8E0);font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(f.name)}</div>
            <div style="font-size:10px;color:var(--text-muted,#555);margin-top:1px">${f.created?esc(f.created)+" · ":""}Admin</div>
          </div>
          ${f.downloadURL?`<a href="${esc(f.downloadURL)}" target="_blank" onclick="event.stopPropagation()" style="margin-left:auto;font-size:10px;color:#C77DFF;text-decoration:none;flex-shrink:0;font-weight:700;background:#C77DFF14;border:1px solid #C77DFF33;padding:4px 9px;border-radius:6px">↗ View</a>`:""}
        </div>`).join("")
        : `<div style="text-align:center;padding:14px 0;font-size:11px;color:var(--text-muted,#555)">No PYQs uploaded for this subject yet — check back after your admin uploads them.</div>`}
    </div>`:""}
  </div>`;
}

// Small inline spinner style (safe to append once)
(function injectRefSpinnerStyle(){
  if(document.getElementById("topic-ref-spinner-style")) return;
  const s = document.createElement("style");
  s.id = "topic-ref-spinner-style";
  s.textContent = `.spinner-inline{width:12px;height:12px;border:2px solid var(--border-color,#333);border-top-color:#FFE66D;border-radius:50%;display:inline-block;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}`;
  document.head.appendChild(s);
})();

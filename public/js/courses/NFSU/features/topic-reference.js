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

// ── Seed curated content (hand-written, high-yield topics only) ──
// Populate more entries here over time — empty topics fall back to
// the "no curated reference yet" state and can still use AI mode.
const CURATED_TOPIC_REFS = {
  "s3-crimes:u1:6": {
    caselaws: [
      { name:"K.M. Nanavati v. State of Maharashtra", cite:"AIR 1962 SC 605",
        facts:"Naval Commander K.M. Nanavati shot and killed his wife's lover, Prem Ahuja, after his wife confessed to the affair. He claimed the killing occurred in a sudden fit of passion after confronting Ahuja and demanding to know if he would marry his wife and take responsibility for their children.",
        holding:"The Supreme Court held that the gap between the confession and the shooting — Nanavati dropped his family at a cinema, went to his ship for a pistol, then drove to Ahuja's house — showed a 'cooling-off' period, so the act was not committed in the heat of the moment. This is the standard case for testing mens rea against a claimed loss of self-control, and for how courts assess 'grave and sudden provocation'." },
      { name:"State of Maharashtra v. M.H. George", cite:"AIR 1965 SC 722",
        facts:"George, a foreign national in transit through Bombay, was found carrying gold in violation of the Foreign Exchange Regulation Act. He argued he had no knowledge of the specific Indian regulation and so lacked mens rea, believing he was merely in transit and not subject to Indian customs law.",
        holding:"The Court held that for certain regulatory/economic offences, the statute can impose strict liability — the prosecution need not prove mens rea where the legislature's object (protecting the economy) requires strict enforcement. The go-to case for the exception to the general mens rea requirement." },
      { name:"R v. Prince (widely cited in Indian jurisprudence)", cite:"(1875) LR 2 CCR 154",
        facts:"Prince took an unmarried girl under 16 out of her father's possession without consent, honestly and reasonably believing she was 18 based on her appearance and her own statement.",
        holding:"The court held Prince guilty regardless of his honest belief about her age, because the underlying act was itself wrongful — moral involuntariness does not excuse liability where part of the actus reus is a strict-liability element. Used alongside BNS provisions on offences against children to explain why mistake of fact is a narrower defense than most students assume." }
    ],
    acts: ["BNS — Section 3(5) (common intention)", "BNS — Sections 14–44 (General Exceptions)"],
    definitions: [
      { term:"Mens Rea", def:"The mental element of a crime — a guilty mind, intention, knowledge, or recklessness as to the criminal act." },
      { term:"Actus Reus", def:"The physical/conduct element of a crime — the wrongful act or omission itself." },
      { term:"Strict Liability", def:"Liability imposed without requiring proof of mens rea, typically for regulatory or public-welfare offences." }
    ],
    notes: "Structure your answer as actus reus + mens rea + absence of a valid general exception. Nanavati is your best case for provocation/cooling-off; George is your best case for strict liability."
  },
  "s1-tort:u2:1": {
    caselaws: [
      { name:"Donoghue v. Stevenson", cite:"[1932] AC 562 (House of Lords, foundational — widely applied in India)",
        facts:"Mrs Donoghue drank ginger beer from an opaque bottle bought for her by a friend. A decomposed snail was found in the bottle after she had consumed part of it, and she became ill. She could not sue the manufacturer in contract since she was not the buyer.",
        holding:"Lord Atkin established the 'neighbour principle' — a manufacturer owes a duty of care to the final consumer, regardless of privity of contract, if it's reasonably foreseeable that a lack of care could injure them. This is the origin case for the modern law of negligence and is cited in nearly every Indian negligence judgment as the foundation of 'duty of care'." },
      { name:"Municipal Corporation of Delhi v. Subhagwanti", cite:"AIR 1966 SC 1750",
        facts:"A clock tower in Chandni Chowk, Delhi, which was over 80 years old and in a dilapidated condition, collapsed and killed several people. The Municipal Corporation, responsible for its maintenance, claimed it had no specific knowledge the structure was about to fall.",
        holding:"The Supreme Court applied the doctrine of res ipsa loquitur ('the thing speaks for itself') — since a properly maintained structure does not collapse without negligence, the burden shifted to the Corporation to prove it was not negligent, which it failed to do. Key Indian case for res ipsa loquitur and municipal/occupier liability." },
      { name:"Rylands v. Fletcher", cite:"(1868) LR 3 HL 330 (foundational — basis for Indian strict/absolute liability)",
        facts:"Fletcher had a reservoir built on his land to supply water to his mill. Unknown to him, the contractors failed to properly seal disused mine shafts beneath it, and water escaped into Rylands' neighbouring coal mine, causing extensive damage.",
        holding:"The House of Lords held that a person who brings something onto their land likely to cause harm if it escapes is strictly liable for the damage if it does escape, regardless of negligence. This is the origin of 'strict liability', later expanded by the Indian Supreme Court in M.C. Mehta v. Union of India (1987) into 'absolute liability' with no exceptions, for hazardous industries." }
    ],
    acts: ["Consumer Protection Act, 2019 — S.2(34) 'product liability'", "Motor Vehicles Act, 1988 — S.166 (compensation claims)"],
    definitions: [
      { term:"Duty of Care", def:"A legal obligation requiring a person to avoid acts/omissions that could reasonably be foreseen to injure others." },
      { term:"Res Ipsa Loquitur", def:"'The thing speaks for itself' — an evidentiary rule allowing negligence to be inferred from the mere occurrence of an accident, shifting the burden of proof to the defendant." },
      { term:"Strict/Absolute Liability", def:"Liability for harm caused by inherently hazardous activities, imposed without needing to prove negligence and (for absolute liability) without any defenses." }
    ],
    notes: "Pair Donoghue (duty of care origin) with Subhagwanti (res ipsa loquitur in India) for any negligence question. Rylands v. Fletcher → M.C. Mehta is the standard progression for a strict vs absolute liability comparison."
  },
  "juris:u2:1": {
    caselaws: [
      { name:"Kesavananda Bharati v. State of Kerala", cite:"AIR 1973 SC 1461",
        facts:"The petitioner, head of a religious mutt in Kerala, challenged land reform legislation restricting the mutt's ability to manage its properties. Heard by a 13-judge bench, the case became the vehicle for a larger question: whether Parliament's power to amend the Constitution under Article 368 was unlimited, following the earlier Golaknath ruling that fundamental rights could not be amended at all.",
        holding:"The Court held Parliament has wide power to amend the Constitution, including fundamental rights, but this power cannot alter the Constitution's 'basic structure' (rule of law, judicial review, federalism, separation of powers). Used to show the limits of pure command-theory positivism — a sovereign's command is itself subject to a higher constraining principle, which Austin's model struggles to explain." },
      { name:"A.K. Gopalan v. State of Madras", cite:"AIR 1950 SC 27",
        facts:"Gopalan, detained under the Preventive Detention Act, 1950, challenged his detention as violating personal liberty under Article 21, arguing 'procedure established by law' should require a fair, just and reasonable procedure, similar to 'due process' under the US Constitution.",
        holding:"The Court took a narrow, literal (positivist) view — 'procedure established by law' meant any procedure enacted by a validly passed statute, regardless of fairness. A textbook illustration of analytical positivism: validity traced to the correctly-enacted rule, not its moral content. Later overturned in Maneka Gandhi v. Union of India (1978), often cited as the shift from strict positivism toward natural-law reasoning in Indian constitutional interpretation." },
      { name:"Naz Foundation v. Govt. of NCT of Delhi", cite:"160 (2009) DLT 277",
        facts:"An NGO challenged Section 377 IPC, which criminalised 'carnal intercourse against the order of nature', arguing it violated dignity, privacy and equality. The provision had existed since the colonial-era IPC and was formally valid purely as a 'correctly enacted' rule.",
        holding:"The Delhi High Court read down Section 377 to decriminalise consensual adult same-sex conduct, relying on constitutional morality rather than mere pedigree of the rule. Shows Hart's 'rule of recognition' tested against a formally valid but substantively contested rule, and sociological/natural-law reasoning displacing pure positivist validity (culminating in Navtej Singh Johar, 2018)." }
    ],
    acts: ["Constitution — Art. 13", "Constitution — Art. 368", "General Clauses Act, 1897 — S.3(29) 'law'"],
    definitions: [
      { term:"Command Theory (Austin)", def:"Law = command of a sovereign, backed by a sanction, habitually obeyed by the bulk of society." },
      { term:"Grundnorm (Kelsen)", def:"The basic norm from which all other legal norms derive their validity, in a hierarchical 'Stufenbau' (step-structure) system." },
      { term:"Rule of Recognition (Hart)", def:"A secondary rule that identifies which primary rules count as valid law within a given legal system." }
    ],
    notes: "Always pair Austin's command theory with Hart's critique — habitual obedience isn't legal obligation, and Austin can't explain continuing laws or power-conferring rules. Kesavananda is your go-to case for positivism's limits against constitutional supremacy."
  }
};

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

function renderRefContentBlock(data){
  let html = "";
  if(data.caselaws?.length){
    html += `<div style="margin-bottom:12px"><div style="font-size:10px;letter-spacing:1px;color:#C77DFF;text-transform:uppercase;margin-bottom:6px;font-weight:bold">⚖️ Related Caselaws (${data.caselaws.length})</div>`;
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
    html += `</div>`;
  }
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
  return html;
}

function renderTopicRefPanel(sub, unit, idx){
  const key = topicRefKey(sub.id, unit.id, idx);
  if(refOpenTopic !== key) return "";

  const notesBtn = renderTopicRefNotesButton(key, sub.id);
  let body = "";

  if(topicRefMode === "curated"){
    const data = CURATED_TOPIC_REFS[key];
    body = data
      ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:9px;color:#06D6A0;background:#06D6A014;border:1px solid #06D6A033;padding:2px 7px;border-radius:20px;margin-bottom:8px">📗 Curated</span>${renderRefContentBlock(data)}`
      : `<div style="color:var(--text-muted,#555);font-size:11px;text-align:center;padding:8px">No curated reference added yet for this topic. Try ✨ AI Generate instead.</div>`;
  }else{
    if(refAiLoading[key]){
      body = `<div style="display:flex;align-items:center;gap:8px;justify-content:center;padding:16px 0;color:var(--text-muted,#666);font-size:11px"><span class="spinner-inline"></span> Generating reference…</div>`;
    }else if(refAiCache[key]){
      body = `<span style="display:inline-flex;align-items:center;gap:4px;font-size:9px;color:#FFE66D;background:#FFE66D14;border:1px solid #FFE66D33;padding:2px 7px;border-radius:20px;margin-bottom:8px">✨ AI-generated · cached</span>${renderRefContentBlock(refAiCache[key])}<div style="margin-top:10px;padding:8px 10px;background:#FF6B3510;border:1px solid #FF6B3533;border-radius:8px;font-size:10px;color:#e69a7a;line-height:1.4">⚠️ AI-generated — verify citations, facts and sections before using in an exam answer.</div>`;
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

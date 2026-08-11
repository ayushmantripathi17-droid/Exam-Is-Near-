// FLASHCARDS — per-subject individual decks
// ══════════════════════════════════════════════════════════════

let flashDecks = JSON.parse(localStorage.getItem("st_flash_decks")||"{}");
let flashState = {activeSub:"", current:0, flipped:false, generating:false, mode:"select", showHistory:false};

function saveFlashDecks(){ localStorage.setItem("st_flash_decks", JSON.stringify(flashDecks)); if(!_firestoreUpdating){ clearTimeout(S._timer); S._timer=setTimeout(pushToFirebase,1200); } }
function getActiveDeck(){ return flashDecks[flashState.activeSub]||[]; }

function flashSelectSubject(sub){
  if(!sub) return;
  flashState.activeSub=sub; flashState.current=0; flashState.flipped=false; flashState.mode="deck";
  render();
}
function flashBack(){ flashState.mode="select"; flashState.activeSub=""; render(); }

function openChapterPicker(){
  const existing = document.getElementById("chapter-picker-overlay");
  if(existing) existing.remove();
  const sub = getSubjects().find(s=>s.id===flashState.activeSub);
  if(!sub) return;
  const overlay = document.createElement("div");
  overlay.id = "chapter-picker-overlay";
  overlay.style.cssText = "position:fixed;inset:0;background:#00000088;z-index:9999;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px)";
  overlay.innerHTML = `
    <div style="background:#0f0f18;border-radius:20px 20px 0 0;width:100%;max-width:560px;padding:24px;border:1px solid #2a2a3a;border-bottom:none;animation:slideUp 0.25s ease">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        <div>
          <div style="font-size:15px;font-weight:bold;color:#EDE8E0">📖 Choose Chapter</div>
          <div style="font-size:11px;color:#555;margin-top:2px">${esc(sub.name)} · AI generates 12 cards per chapter</div>
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
      ${(sub.units||[]).map((u,i)=>`
      <button onclick="document.getElementById('chapter-picker-overlay').remove();generateFlashcards('`+esc(u.name)+`')" style="display:flex;align-items:center;gap:12px;width:100%;background:#0f0f18;border:1px solid #${['FF6B35','4ECDC4','FFE66D','06D6A0'][i%4]}22;border-radius:12px;padding:14px 16px;cursor:pointer;font-family:inherit;margin-bottom:8px;transition:all 0.2s" onmouseover="this.style.borderColor='#${['FF6B35','4ECDC4','FFE66D','06D6A0'][i%4]}66'" onmouseout="this.style.borderColor='#${['FF6B35','4ECDC4','FFE66D','06D6A0'][i%4]}22'">
        <span style="font-size:20px">${sub.icon}</span>
        <div style="text-align:left;flex:1;min-width:0">
          <div style="font-size:12px;font-weight:bold;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Chapter ${i+1}: `+esc(u.name)+`</div>
          <div style="font-size:10px;color:#555;margin-top:2px">`+(u.topics||[]).slice(0,2).map(t=>esc(t)).join(' · ')+`</div>
        </div>
        <span style="color:#555;font-size:12px;flex-shrink:0">→</span>
      </button>`).join('')}
    </div>`;
  overlay.addEventListener("click", e=>{ if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

async function generateFlashcards(unitName){
  const sub=flashState.activeSub||document.getElementById("flash-sub-select")?.value||"";
  if(!sub){showToast("Please select a subject first","alarm");return;}

  // ── PRO GATE: Free users capped at 50 total cards ──
  const pro = await isProUser();
  if(!pro){
    const totalCards = Object.values(flashDecks).reduce((sum, deck) => sum + (deck||[]).length, 0);
    if(totalCards >= 50){
      showToast("⭐ Free limit reached (50 cards). Upgrade to Pro for unlimited flashcards!","alarm");
      openProModal();
      return;
    }
  }

  const subObj=getSubjects().find(s=>s.id===sub);
  const subName=subObj?.name||sub;
  const chapterCtx = unitName ? unitName+" ("+subName+")" : subName;
  flashState.generating=true; flashState.activeSub=sub; flashState.mode="deck";
  render();
  showToast("Generating flashcards for "+chapterCtx+"…","info");
  const seeds=["key definitions","important formulas","core concepts","exam traps","theory vs application","worked examples"];
  const seed=seeds[Math.floor(Math.random()*seeds.length)];
  const flashPro = await isProUser();
  const flashCount = flashPro ? 20 : 12;
  const prompt="Create "+flashCount+" unique flashcards for "+chapterCtx+" covering "+seed+" for university exam revision. Format as JSON array: [{\"front\":\"term or question\",\"back\":\"definition or answer\"}]. Return ONLY the raw JSON array, no markdown, no backticks.";
  const resp=await askAI(prompt,true);
  try{
    const match=resp.match(/\[[\s\S]*\]/);
    const cards=match?JSON.parse(match[0]):null;
    if(!cards) throw new Error("fail");
    // Always fresh — replace deck entirely (never append old stale cards)
    flashDecks[sub] = cards;
    flashState.current=0; flashState.flipped=false;
    saveFlashDecks();
    // ── PRO: Save flashcard session log ──
    const _proLog = await isProUser();
    if(_proLog){
      flashLog.unshift({
        id: Date.now(),
        subject: sub,
        subjectName: subName,
        chapter: unitName||"All Chapters",
        cards: cards.length,
        date: new Date().toISOString()
      });
      saveFlashLog();
    }
    showToast(cards.length+" fresh cards generated for "+chapterCtx+"!","success");
    spawnStars();
  }catch(e){showToast("Could not generate flashcards","alarm");}
  flashState.generating=false; render();
}

function clearSubjectDeck(){
  if(!flashState.activeSub||!confirm("Clear all cards for this subject?")) return;
  delete flashDecks[flashState.activeSub];
  saveFlashDecks(); flashState.current=0; flashState.flipped=false; render();
}
function flipCard(){flashState.flipped=!flashState.flipped;render();}
function nextCard(){const d=getActiveDeck();flashState.current=(flashState.current+1)%d.length;flashState.flipped=false;render();}
function prevCard(){const d=getActiveDeck();flashState.current=(flashState.current-1+d.length)%d.length;flashState.flipped=false;render();}
function deleteFlashcard(){
  const d=getActiveDeck();
  d.splice(flashState.current,1);
  flashDecks[flashState.activeSub]=d;
  saveFlashDecks();
  flashState.current=Math.min(flashState.current,d.length-1);
  flashState.flipped=false; render();
}

function renderFlashcards(){
  const subs=getSubjects();

  // ── Flashcard History: chapter-wise grouped ──
  if(flashState.showHistory){
    // Group by subject
    const fGrouped = {};
    flashLog.forEach(entry=>{
      const key = entry.subjectName||entry.subject||"Unknown";
      if(!fGrouped[key]) fGrouped[key]={subject:key,entries:[]};
      fGrouped[key].entries.push(entry);
    });

    return `<div class="fade-in">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
        <div style="display:flex;align-items:center;gap:10px">
          <button class="btn-ghost" onclick="flashState.showHistory=false;render()" style="font-size:12px;padding:6px 12px">← Back</button>
          <div style="font-size:18px;font-weight:bold">📋 Flashcard Logs</div>
        </div>
        ${flashLog.length>0?`<button onclick="if(confirm('Clear flashcard logs?')){flashLog=[];saveFlashLog();render();}" style="background:none;border:none;font-size:11px;color:#FF6B3588;cursor:pointer;font-family:inherit">🗑️ Clear</button>`:''}
      </div>

      ${flashLog.length===0?`<div class="empty-state">
        <div style="font-size:48px;margin-bottom:12px">🃏</div>
        <div style="font-size:14px;margin-bottom:6px">No flashcard logs yet</div>
        <div style="font-size:12px;color:#444">Generate flashcards and your sessions will appear here</div>
      </div>`:`

      <!-- Stats strip -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px">
        <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:20px;font-weight:800;color:#FFE66D">${flashLog.length}</div>
          <div style="font-size:10px;color:#555;margin-top:2px">Sessions</div>
        </div>
        <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:20px;font-weight:800;color:#06D6A0">${flashLog.reduce((s,e)=>s+(e.cards||0),0)}</div>
          <div style="font-size:10px;color:#555;margin-top:2px">Total Cards</div>
        </div>
        <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:20px;font-weight:800;color:#A78BFA">${Object.keys(fGrouped).length}</div>
          <div style="font-size:10px;color:#555;margin-top:2px">Subjects</div>
        </div>
      </div>

      <!-- Chapter-wise grouped -->
      ${Object.values(fGrouped).map(group=>`
        <div style="margin-bottom:20px">
          <div style="font-size:12px;font-weight:700;color:#FFE66D;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;padding-left:2px">${esc(group.subject)}</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${group.entries.map(entry=>`
              <div style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px">
                <div style="flex-shrink:0;width:44px;height:44px;border-radius:10px;background:#1a1200;border:1px solid #FFE66D33;display:flex;flex-direction:column;align-items:center;justify-content:center">
                  <span style="font-size:14px">🃏</span>
                  <span style="font-size:9px;color:#FFE66D;font-weight:700">${entry.cards}</span>
                </div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:600;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(entry.chapter)}</div>
                  <div style="font-size:11px;color:#555;margin-top:2px">
                    ${entry.cards} cards generated ·
                    ${new Date(entry.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                    <span style="color:#444"> · ${new Date(entry.date).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
                  </div>
                </div>
                <button onclick="flashSelectSubject('${entry.subject}');flashState.showHistory=false;" style="flex-shrink:0;background:#FFE66D11;border:1px solid #FFE66D33;color:#FFE66D;font-size:11px;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit">Study →</button>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
      `}
    </div>`;
  }

  if(flashState.mode==="select"||!flashState.activeSub){
    return `<div class="fade-in">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <div style="font-size:18px;font-weight:bold">🃏 Flashcards</div>
        ${_proStatusCache?`<button class="btn-ghost" onclick="flashState.showHistory=true;render()" style="font-size:11px;padding:5px 12px">📋 Logs (${flashLog.length})</button>`:''}
      </div>
      <div style="font-size:12px;color:#555;margin-bottom:20px">Select a subject to view or generate cards</div>
      <div class="grid-2">
        ${subs.map(s=>{
          const count=(flashDecks[s.id]||[]).length;
          return `<div class="card" style="cursor:pointer;border-color:${s.color}33;transition:border-color 0.2s"
            onclick="flashSelectSubject('${s.id}')"
            onmouseover="this.style.borderColor='${s.color}99'"
            onmouseout="this.style.borderColor='${s.color}33'">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
              <span style="font-size:26px">${s.icon}</span>
              <div>
                <div style="font-size:13px;font-weight:bold;color:#ccc">${esc(s.name)}</div>
                <div style="font-size:11px;color:#555">${count>0?count+" cards":"No cards yet"}</div>
              </div>
            </div>
            <div style="height:3px;background:#111;border-radius:2px;overflow:hidden">
              <div style="height:100%;background:${s.color};width:${count>0?Math.min(100,count*8)+"%" :"0%"};border-radius:2px"></div>
            </div>
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  const sub=subs.find(s=>s.id===flashState.activeSub);
  const deck=getActiveDeck();
  const card=deck[flashState.current];
  const pct=deck.length?Math.round(((flashState.current+1)/deck.length)*100):0;

  return `<div class="fade-in">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap">
      <button class="btn-ghost" onclick="flashBack()" style="font-size:12px;padding:6px 12px">← All</button>
      <span style="font-size:18px">${sub?.icon||"🃏"}</span>
      <div style="flex:1;min-width:80px">
        <div style="font-size:15px;font-weight:bold;color:#ccc">${esc(sub?.name||"")}</div>
        <div style="font-size:11px;color:#555">${deck.length} cards total</div>
      </div>
      <button class="btn-gold" onclick="openChapterPicker()" ${flashState.generating?"disabled":""} style="font-size:11px;padding:7px 14px">
        ${flashState.generating?"⏳ Generating…":"✨ Choose Chapter"}
      </button>
      ${deck.length>0?`<button class="btn-ghost" onclick="clearSubjectDeck()" style="font-size:11px;color:#FF6B35;padding:7px 10px">🗑️ Clear</button>`:""}
    </div>

    ${deck.length===0?`
      <div class="empty-state">
        <div style="font-size:48px;margin-bottom:12px">🃏</div>
        <div style="font-size:14px;margin-bottom:6px">No cards for ${esc(sub?.name||"")} yet</div>
        <div style="font-size:12px;color:#444;margin-bottom:16px">Generate 12 AI flashcards instantly — all chapters or chapter-wise</div>
        <button class="btn-gold" onclick="openChapterPicker()" ${flashState.generating?"disabled":""} style="font-size:13px;padding:12px 24px">
          ${flashState.generating?"⏳ Generating…":"✨ Choose Chapter to Generate"}
        </button>
      </div>`:`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:11px;color:#444">
        <span>Card ${flashState.current+1} / ${deck.length}</span>
        <span>${pct}% through deck</span>
      </div>
      <div style="height:3px;background:#111;border-radius:2px;margin-bottom:16px;overflow:hidden">
        <div style="height:100%;background:${sub?.color||"#FFE66D"};width:${pct}%;transition:width 0.3s;border-radius:2px"></div>
      </div>
      <div onclick="flipCard()" style="cursor:pointer;min-height:220px;display:flex;align-items:center;justify-content:center;
        background:${flashState.flipped?"#0d1a0d":"#13131f"};
        border:2px solid ${flashState.flipped?sub?.color||"#06D6A0":"#FFE66D44"};
        border-radius:16px;padding:32px;margin-bottom:20px;transition:all 0.3s;text-align:center">
        <div>
          <div style="font-size:10px;letter-spacing:2px;margin-bottom:14px;color:${flashState.flipped?sub?.color||"#06D6A0":"#555"}">
            ${flashState.flipped?"✅ ANSWER":"❓ QUESTION — tap to flip"}
          </div>
          <div style="font-size:17px;color:${flashState.flipped?sub?.color||"#06D6A0":"#FFE66D"};line-height:1.7">
            ${esc(card?(flashState.flipped?card.back:card.front):"")}
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
  </div>`;
}


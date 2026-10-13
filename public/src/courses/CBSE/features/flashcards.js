import { CourseRuntime } from "../../../core/course-runtime.js";
import { S, _firestoreUpdating, pushToFirebase } from "../../../core/firebase-sync.js";
import { render } from "../ui/render-core.js";
import { getSubjects } from "../../../core/course-selector.js";
import { esc, showToast } from "../../../utils/helpers.js";
import { isProUser, openProModal } from "./payments-pro.js";
import { askAI } from "./ai-assistant-setup.js";
import { saveFlashLog } from "./quiz.js";
import { spawnStars } from "./clock-alarms-timer.js";

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
      CourseRuntime.flashLog.unshift({
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
  const css=`<style>
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
</style>`;

  // ── History ──
  if(flashState.showHistory){
    const fGrouped = {};
    CourseRuntime.flashLog.forEach(entry=>{
      const key = entry.subjectName||entry.subject||"Unknown";
      if(!fGrouped[key]) fGrouped[key]={subject:key,entries:[]};
      fGrouped[key].entries.push(entry);
    });
    return `${css}<div class="fc fade-in">
      <div class="fc-head">
        <div style="display:flex;align-items:center;gap:12px">
          <button class="fc-btn" onclick="flashState.showHistory=false;render()">← Back</button>
          <div class="fc-h1" style="font-size:22px">📋 Flashcard Logs</div>
        </div>
        ${CourseRuntime.flashLog.length>0?`<button class="fc-btn d" onclick="clearFlashLog()">🗑️ Clear</button>`:''}
      </div>
      ${CourseRuntime.flashLog.length===0?`<div class="fc-empty"><div class="e">🃏</div><b>No flashcard logs yet</b><p>Generate flashcards and your sessions will appear here</p></div>`:`
      <div class="fc-stats">
        <div class="fc-stat"><b style="color:#FFE66D">${CourseRuntime.flashLog.length}</b><span>SESSIONS</span></div>
        <div class="fc-stat"><b style="color:#06D6A0">${CourseRuntime.flashLog.reduce((s,e)=>s+(e.cards||0),0)}</b><span>TOTAL CARDS</span></div>
        <div class="fc-stat"><b style="color:#A78BFA">${Object.keys(fGrouped).length}</b><span>SUBJECTS</span></div>
      </div>
      ${Object.values(fGrouped).map(group=>`
        <div style="margin-bottom:20px">
          <div class="fc-grp">${esc(group.subject)}</div>
          ${group.entries.map(entry=>`
            <div class="fc-log">
              <div class="fc-log-ic">🃏<small>${entry.cards}</small></div>
              <div style="flex:1;min-width:0">
                <b>${esc(entry.chapter)}</b>
                <span>${entry.cards} cards · ${new Date(entry.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})} · ${new Date(entry.date).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
              <button class="fc-btn p" style="padding:8px 14px;font-size:12px" onclick="flashSelectSubject('${entry.subject}');flashState.showHistory=false;">Study →</button>
            </div>`).join('')}
        </div>`).join('')}
      `}
    </div>`;
  }

  // ── Subject select ──
  if(flashState.mode==="select"||!flashState.activeSub){
    return `${css}<div class="fc fade-in">
      <div class="fc-head">
        <div>
          <div class="fc-h1">🃏 Flashcards</div>
          <div class="fc-h2">Pick a subject to review or generate AI cards.</div>
        </div>
        ${CourseRuntime._proStatusCache?`<button class="fc-btn" onclick="flashState.showHistory=true;render()">📋 Logs (${CourseRuntime.flashLog.length})</button>`:''}
      </div>
      <div class="fc-grid">
        ${subs.map((s,i)=>{
          const count=(flashDecks[s.id]||[]).length;
          return `<div class="fc-sub" style="--c:${s.color};animation-delay:${Math.min(i,12)*0.04}s" onclick="flashSelectSubject('${s.id}')">
            <div class="fc-sub-top">
              <div class="fc-ic">${s.icon}</div>
              <div style="min-width:0;flex:1"><b>${esc(s.name)}</b><span>${count>0?count+" cards":"No cards yet"}</span></div>
              ${count>0?`<div class="fc-cnt">${count}</div>`:""}
            </div>
            <div class="fc-bar"><i style="width:${count>0?Math.min(100,count*8):0}%"></i></div>
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  // ── Deck view ──
  const sub=subs.find(s=>s.id===flashState.activeSub);
  const deck=getActiveDeck();
  const card=deck[flashState.current];
  const pct=deck.length?Math.round(((flashState.current+1)/deck.length)*100):0;
  const col=sub?.color||"#FFE66D";

  return `${css}<div class="fc fade-in" style="--c:${col}">
    <div class="fc-back">
      <button class="fc-btn" onclick="flashBack()">← All</button>
      <div class="fc-ic" style="--c:${col}">${sub?.icon||"🃏"}</div>
      <div class="n"><b>${esc(sub?.name||"")}</b><span>${deck.length} cards total</span></div>
      <button class="fc-btn p" onclick="openChapterPicker()" ${flashState.generating?"disabled":""}>${flashState.generating?"⏳ Generating…":"✨ Choose Chapter"}</button>
      ${deck.length>0?`<button class="fc-btn d" onclick="clearSubjectDeck()">🗑️ Clear</button>`:""}
    </div>

    ${deck.length===0?`
      <div class="fc-empty">
        <div class="e">🃏</div>
        <b>No cards for ${esc(sub?.name||"")} yet</b>
        <p>Generate 12 AI flashcards instantly — all chapters or chapter-wise</p>
        <button class="fc-btn p" onclick="openChapterPicker()" ${flashState.generating?"disabled":""} style="padding:12px 24px;font-size:13.5px">${flashState.generating?"⏳ Generating…":"✨ Choose Chapter to Generate"}</button>
      </div>`:`
      <div class="fc-bar-t"><span>Card <b>${flashState.current+1}</b> / ${deck.length}</span><span>${pct}% through deck</span></div>
      <div class="fc-bar big" style="--c:${col}"><i style="width:${pct}%"></i></div>
      <div class="fc-card ${flashState.flipped?"a":""}" style="${flashState.flipped?"--c:"+col:""}" onclick="flipCard()">
        <div class="fc-tag">${flashState.flipped?"✅ ANSWER":"❓ QUESTION · TAP TO FLIP"}</div>
        <div class="fc-txt">${esc(card?(flashState.flipped?card.back:card.front):"")}</div>
      </div>
      <div class="fc-nav">
        <button class="fc-btn" onclick="prevCard()">← Prev</button>
        <button class="fc-btn d" onclick="deleteFlashcard()" title="Delete card">🗑️</button>
        <button class="fc-btn p" onclick="nextCard()">Next →</button>
      </div>
      <div class="fc-hint">Tap the card to flip · delete removes this card</div>
    `}
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// QUIZ MODE

export { clearSubjectDeck, deleteFlashcard, flashBack, flashDecks, flashSelectSubject, flashState, flipCard, generateFlashcards, getActiveDeck, nextCard, openChapterPicker, prevCard, renderFlashcards, saveFlashDecks };

if (typeof window !== "undefined") {
  Object.assign(window, { clearSubjectDeck, deleteFlashcard, flashBack, flashDecks, flashSelectSubject, flashState, flipCard, generateFlashcards, getActiveDeck, nextCard, openChapterPicker, prevCard, renderFlashcards, saveFlashDecks });
}

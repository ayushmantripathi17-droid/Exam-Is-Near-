
function addMistake(){
  const q = (document.getElementById('mk-q')?.value||'').trim();
  const ans = (document.getElementById('mk-ans')?.value||'').trim();
  const sub = document.getElementById('mk-sub')?.value||'Physics';
  const exam = document.getElementById('mk-exam')?.value||'neet';
  if(!q){showToast('⚠️ Enter the question','alarm');return;}
  njState.mistakes.unshift({id:Date.now(),q,ans,sub,exam,date:new Date().toLocaleDateString('en-IN')});
  njSave();
  document.getElementById('mk-q').value='';
  document.getElementById('mk-ans').value='';
  showToast('📝 Mistake logged!','success');
  switchView('neetjee');
}
 
function deleteMistake(id){
  njState.mistakes = njState.mistakes.filter(m=>m.id!==id);
  njSave(); switchView('neetjee');
}
 
function renderMistakes(){
  const subs = ['all','Physics','Chemistry','Biology','Maths'];
  const sub = njState.mistakeSubject;
  const list = njState.mistakes.filter(m=>sub==='all'||m.sub===sub);
  const subColors = {Physics:'#4ECDC4',Chemistry:'#FFE66D',Biology:'#06D6A0',Maths:'#C77DFF'};
 
  return `<div>
    <div class="exam-section-hdr">
      <div class="exam-icon-wrap" style="background:#FF6B3522">📝</div>
      <div><div style="font-size:17px;font-weight:800;color:#EDE8E0">Mistake Logbook</div>
        <div style="font-size:11px;color:#444">${njState.mistakes.length} mistakes logged · Review before exam</div></div>
    </div>
 
    <!-- Add mistake form -->
    <div class="feat-card shared" style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;color:#C77DFF;margin-bottom:12px;letter-spacing:0.5px">➕ LOG A MISTAKE</div>
      <div class="grid-2" style="gap:8px;margin-bottom:8px">
        <select id="mk-exam" style="font-size:12px"><option value="neet">NEET</option><option value="jee">JEE</option></select>
        <select id="mk-sub" style="font-size:12px">
          <option>Physics</option><option>Chemistry</option><option>Biology</option><option>Maths</option>
        </select>
      </div>
      <textarea id="mk-q" rows="2" placeholder="Paste the question or describe what you got wrong…" style="font-size:12px;margin-bottom:8px"></textarea>
      <input id="mk-ans" placeholder="Correct answer / what to remember" style="font-size:12px;margin-bottom:12px"/>
      <button class="btn-gold" onclick="addMistake()" style="width:100%;padding:10px">📝 Log Mistake</button>
    </div>
 
    <!-- Filter -->
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
      ${subs.map(s=>`<button onclick="njState.mistakeSubject='${s}';switchView('neetjee')" class="pill-btn" style="${sub===s?'background:'+((subColors[s]||'#C77DFF'))+'22;border-color:'+(subColors[s]||'#C77DFF')+'44;color:'+(subColors[s]||'#C77DFF'):''}">${s==='all'?'All':s} ${s==='all'?'('+njState.mistakes.length+')':''}</button>`).join('')}
    </div>
 
    <!-- Mistakes list -->
    ${list.length===0
      ?`<div style="text-align:center;padding:32px;color:#333;font-size:13px">No mistakes logged yet. Start adding them! 💪</div>`
      :list.map(m=>`<div class="mistake-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <span class="mistake-tag" style="background:${(subColors[m.sub]||'#C77DFF')}22;color:${(subColors[m.sub]||'#C77DFF')};border:1px solid ${(subColors[m.sub]||'#C77DFF')}33">${m.sub} · ${m.exam?.toUpperCase()}</span>
            <span style="font-size:10px;color:#333">${m.date}</span>
          </div>
          <div class="mistake-q">${esc(m.q)}</div>
          ${m.ans?`<div class="mistake-ans">✅ ${esc(m.ans)}</div>`:''}
          <div style="display:flex;gap:8px;margin-top:10px">
            <button onclick="addToSRS('${m.id}')" class="pill-btn" style="font-size:10px;color:#4ECDC4;border-color:#4ECDC433">🔁 Add to SRS</button>
            <button onclick="deleteMistake('${m.id}')" class="btn-danger" style="font-size:11px;padding:4px 10px;margin-left:auto">🗑️</button>
          </div>
        </div>`).join('')}
  </div>`;
}
 
// ══════════════════════════════════════════════════════════════
// FEATURE 2: CHAPTER WEIGHTAGE TRACKER
// ══════════════════════════════════════════════════════════════
function renderWeightage(){
  // Auto-sync with active course
  if(activeCourse === 'jee' && njState.exam !== 'jee') njState.exam = 'jee';
  else if(activeCourse === 'neet' && njState.exam !== 'neet') njState.exam = 'neet';
  const exam = njState.exam;
  const data = exam==='neet' ? NEET_WEIGHTAGE : JEE_WEIGHTAGE;
  const subjects = Object.keys(data);
  const maxQ = Math.max(...subjects.flatMap(s=>data[s].map(c=>c.q)));
 
  return `<div>
    <div class="exam-section-hdr">
      <div class="exam-icon-wrap" style="background:${exam==='neet'?'#06D6A022':'#4ECDC422'}">📊</div>
      <div><div style="font-size:17px;font-weight:800;color:#EDE8E0">Chapter Weightage</div>
        <div style="font-size:11px;color:#444">${exam==='neet'?'NEET 2019–2024':'JEE Mains 2020–2024'} average questions per chapter</div></div>
    </div>
 
    ${(!activeCourse || activeCourse==='nfsu') ? `<div class="exam-tabs">
      <button class="exam-tab neet ${exam==='neet'?'active':''}" onclick="njState.exam='neet';switchView('neetjee')">🩺 NEET</button>
      <button class="exam-tab jee ${exam==='jee'?'active':''}" onclick="njState.exam='jee';switchView('neetjee')">⚡ JEE</button>
    </div>` : ''}
 
    ${subjects.map(subj=>`
      <div class="feat-card ${exam}" style="margin-bottom:12px">
        <div style="font-size:13px;font-weight:700;color:#EDE8E0;margin-bottom:14px;display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">${subj==='Biology'?'🧬':subj==='Chemistry'?'⚗️':subj==='Maths'?'📐':'⚡'}</span>
          ${subj}
          <span style="margin-left:auto;font-size:10px;color:#444;font-weight:500">${data[subj].reduce((s,c)=>s+c.q,0)} questions total</span>
        </div>
        ${data[subj].map(ch=>{
          const pct = Math.round(ch.q/maxQ*100);
          return `<div class="wtg-row">
            <div class="wtg-chapter">${ch.ch}</div>
            <div class="wtg-bar"><div class="wtg-fill" style="width:${pct}%;background:${ch.color}"></div></div>
            <div class="wtg-count">${ch.q}Q</div>
          </div>`;
        }).join('')}
      </div>`).join('')}
    <div style="font-size:10px;color:#333;text-align:center;padding:8px 0">Data based on official answer keys · Use as a guide, not a guarantee</div>
  </div>`;
}
 
// ══════════════════════════════════════════════════════════════
// FEATURE 3: RANK PREDICTOR — Updated June 2026
// Data: NTA NEET 2025 official + JoSAA 2025 Round 6 closing ranks
// ══════════════════════════════════════════════════════════════
function renderRankPredictor(){
  // Auto-sync exam tab with active course
  if(activeCourse === 'jee' && njState.exam !== 'jee') njState.exam = 'jee';
  else if(activeCourse === 'neet' && njState.exam !== 'neet') njState.exam = 'neet';
 
  const exam = njState.exam;
  const score = parseInt(njState.rankScore)||0;
  const cat = njState.rankCat;
  const hasScore = njState.rankScore !== '' && njState.rankScore !== null;
 
  let resultHtml = '';
  const maxScore = exam==='neet' ? 720 : 300;
  const scoreVal = parseInt(njState.rankScore);
  const scoreExceeded = njState.rankScore !== '' && !isNaN(scoreVal) && scoreVal > maxScore;
 
  if(scoreExceeded){
    resultHtml = `<div style="margin-top:12px;background:#1a0a0a;border:1px solid #ff6b3566;border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:22px;margin-bottom:6px">⚠️</div>
      <div style="font-size:13px;font-weight:700;color:#ff6b35">Score exceeds maximum!</div>
      <div style="font-size:11px;color:#666;margin-top:4px">${exam==='neet'?'NEET':'JEE Main'} maximum is <b style="color:#FFE66D">${maxScore}</b>. Please enter a valid score.</div>
    </div>`;
  } else if(hasScore && score > 0){
    if(exam==='neet'){
      const display = getNeetRankDisplay(score, cat);
      const tier = getNeetColleges(score);
      const pct = Math.round((score/720)*100*10)/10;
      // Qualifying status — 2025 qualifying cutoff pattern; NTA hasn't
      // published the exact 2026 qualifying marks yet
      const qualGeneral = score >= 137; // ~50th percentile General, 2025 pattern
      const qualOBC = score >= 108;     // ~40th percentile OBC/SC/ST, 2025 pattern
      const qualifies = cat==='general' ? qualGeneral : qualOBC;
      resultHtml = `<div class="rank-result" style="text-align:left">
        <div style="text-align:center;margin-bottom:16px">
          <div style="font-size:10px;color:#444;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px">${display.catLabel}</div>
          <div class="rank-big">${display.airRange}</div>
          <div class="rank-label">${pct}% of max marks</div>
          <div style="font-size:10px;margin-top:6px;color:${display.confirmed?'#06D6A0':'#FFE66D'}">${display.confirmed?'✅ Confirmed from NTA\'s official Re-NEET 2026 result':'⚠️ Estimated from 2025 pattern — NTA hasn\'t published 2026 data for this range yet'}</div>
        </div>
        <div style="margin:14px 0;height:1px;background:#1e1e2e"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
          <div style="background:#0a0a12;border:1px solid ${qualifies?'#06D6A033':'#ff6b3533'};border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:18px;margin-bottom:4px">${qualifies?'✅':'❌'}</div>
            <div style="font-size:10px;color:#555;letter-spacing:0.5px">NEET 2026 QUALIFYING</div>
            <div style="font-size:11px;color:${qualifies?'#06D6A0':'#ff6b35'};font-weight:600;margin-top:2px">${qualifies?'Likely qualified':'Below cutoff est.'}</div>
          </div>
          <div style="background:#0a0a12;border:1px solid #4ECDC433;border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:18px;margin-bottom:4px">🎓</div>
            <div style="font-size:10px;color:#555;letter-spacing:0.5px">COUNSELLING</div>
            <div style="font-size:11px;color:#4ECDC4;font-weight:600;margin-top:2px">${score>=620?'AIQ + State':'State quota focus'}</div>
          </div>
        </div>
        <div style="font-size:10px;color:#444;margin-bottom:8px;letter-spacing:1px;text-transform:uppercase">Govt. colleges in reach — MCC AIQ 2024–25 cutoffs</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${tier.colleges.map(c=>`<span class="college-chip">🏥 ${c}</span>`).join('')}
        </div>
        ${cat!=='general'?`<div style="margin-top:12px;padding:8px 12px;background:#0a0a12;border:1px solid #FFE66D22;border-radius:8px;font-size:10px;color:#666;line-height:1.7">
          💡 Category rank shown. General AIR range: <b style="color:#888">${getNeetRankDisplay(score,'general').airRange}</b>. Reserved category seats are allocated from category rank, not AIR.
        </div>`:''}
      </div>`;
    } else {
      // JEE Main
      const data = getJeePercentile(score);
      const colleges = getJeeCollege(data.pct);
      const fmt = n => n>=1e5?(n/1e5).toFixed(1)+'L':n>=1e3?Math.round(n/1e3)+'K':n;
      const qualifies2026 = data.pct >= 93.4123; // JEE Main 2026 General cutoff
      resultHtml = `<div class="pct-result" style="text-align:left">
        <div style="text-align:center;margin-bottom:16px">
          <div style="font-size:10px;color:#4ECDC466;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px">Estimated JEE Main Percentile</div>
          <div class="pct-big">${data.pct}</div>
          <div style="font-size:12px;color:#4ECDC4;margin-top:6px;font-weight:600">AIR range: ${data.rank}</div>
          <div style="font-size:10px;color:#444;margin-top:3px">approx AIR ~${fmt(data.airEst)} · JoSAA 2025 baseline</div>
        </div>
        <div style="margin:14px 0;height:1px;background:#1e1e2e"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
          <div style="background:#0a0a12;border:1px solid ${qualifies2026?'#06D6A033':'#ff6b3533'};border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:18px;margin-bottom:4px">${qualifies2026?'✅':'❌'}</div>
            <div style="font-size:10px;color:#555;letter-spacing:0.5px">JoSAA ELIGIBLE</div>
            <div style="font-size:11px;color:${qualifies2026?'#06D6A0':'#ff6b35'};font-weight:600;margin-top:2px">${qualifies2026?'NIT/IIIT access':'Below 93.4% cutoff'}</div>
          </div>
          <div style="background:#0a0a12;border:1px solid #4ECDC433;border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:18px;margin-bottom:4px">⚡</div>
            <div style="font-size:10px;color:#555;letter-spacing:0.5px">JEE ADVANCED</div>
            <div style="font-size:11px;color:#4ECDC4;font-weight:600;margin-top:2px">${data.pct>=99.4?'Top 2.5L — eligible':'Not in top 2.5L'}</div>
          </div>
        </div>
        <div style="font-size:10px;color:#444;margin-bottom:8px;letter-spacing:1px;text-transform:uppercase">Govt. colleges in reach — JoSAA 2024–25 closing ranks</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${colleges.map(c=>`<span class="college-chip" style="border-color:#4ECDC433;color:#4ECDC4">🏛 ${c}</span>`).join('')}
        </div>
        ${data.pct>=99.4?`<div style="margin-top:10px;padding:8px 12px;background:#0a0a12;border:1px solid #FFE66D22;border-radius:8px;font-size:10px;color:#666;line-height:1.7">
          ⭐ Top 2.5L qualifier — eligible for JEE Advanced. IIT admission requires separate Advanced exam.
        </div>`:''}
      </div>`;
    }
  }
 
  // maxScore already declared above for validation
 
  return `<div>
    <div class="exam-section-hdr">
      <div class="exam-icon-wrap" style="background:${exam==='neet'?'#06D6A022':'#4ECDC422'}">🎯</div>
      <div><div style="font-size:17px;font-weight:800;color:#EDE8E0">Rank Predictor</div>
        <div style="font-size:11px;color:#444">Top ranks confirmed from Re-NEET 2026 result · rest based on 2025 pattern</div></div>
    </div>
 
    ${(!activeCourse || activeCourse==='nfsu') ? `<div class="exam-tabs">
      <button class="exam-tab neet ${exam==='neet'?'active':''}" onclick="njState.exam='neet';njState.rankScore='';switchView('neetjee')">🩺 NEET (720)</button>
      <button class="exam-tab jee ${exam==='jee'?'active':''}" onclick="njState.exam='jee';njState.rankScore='';switchView('neetjee')">⚡ JEE Mains (300)</button>
    </div>` : ''}
 
    <div class="feat-card ${exam}">
      <div style="margin-bottom:14px">
        <div class="section-label">YOUR SCORE (out of ${maxScore})</div>
        <input type="number" id="rank-score" min="0" max="${maxScore}" placeholder="e.g. ${exam==='neet'?'620':'200'}"
          value="${njState.rankScore}"
          oninput="njState.rankScore=this.value;if(parseInt(this.value)>${maxScore}){this.style.borderColor='#ff6b3566';this.style.color='#ff6b35';}else{this.style.borderColor='#FFE66D33';this.style.color='#FFE66D';}"
          style="font-size:24px;font-weight:800;font-family:'JetBrains Mono',monospace;text-align:center;color:${scoreExceeded?'#ff6b35':'#FFE66D'};background:#0a0a12;border-color:${scoreExceeded?'#ff6b3566':'#FFE66D33'};letter-spacing:2px"/>
      </div>
      ${exam==='neet'?`<div style="margin-bottom:14px">
        <div class="section-label">CATEGORY</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${[['general','General'],['obc','OBC-NCL'],['sc','SC'],['st','ST']].map(([v,l])=>`
            <button onclick="njState.rankCat='${v}';switchView('neetjee')" class="pill-btn" style="${cat===v?'background:#FFE66D22;border-color:#FFE66D44;color:#FFE66D':''}">${l}</button>`).join('')}
        </div>
      </div>`:''}
      <button class="btn-gold" onclick="njState.rankScore=document.getElementById('rank-score').value;switchView('neetjee')" style="width:100%;padding:11px;font-size:14px">🎯 Predict My Rank</button>
    </div>
 
    ${resultHtml}
 
    <div style="margin-top:12px;padding:10px 14px;background:#0a0a12;border:1px solid #1e1e2e;border-radius:10px;font-size:10px;color:#333;line-height:1.8">
      ⚠️ Estimates based on NTA NEET 2025 official rank data &amp; JoSAA 2025 Round 6 closing ranks (June 2026). Actual 2026 ranks depend on paper difficulty, number of candidates, and normalization. Accuracy: ±10–20% for mid-range scores. Always verify at ntaresults.nic.in &amp; josaa.nic.in.
    </div>
 
    <div id="rank-pwa-banner" style="margin-top:14px;background:linear-gradient(135deg,#0d1a12,#0a1020);border:1px solid #06D6A044;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:14px">
      <img src="/assets/images/logo.png" style="width:44px;height:44px;border-radius:10px;flex-shrink:0" alt="ArkSetu"/>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:700;color:#EDE8E0">ArkSetu — Exam Is Near</div>
        <div style="font-size:10px;color:#555;margin-top:2px">AI tutor · Flashcards · Mock tests · Rank predictor</div>
        <div style="font-size:10px;color:#06D6A0;margin-top:2px;font-weight:600">Free · Works offline · No ads on Pro</div>
      </div>
      <button onclick="installPWA()" style="flex-shrink:0;background:linear-gradient(135deg,#06D6A0,#059669);border:none;color:#fff;padding:8px 14px;border-radius:10px;font-size:11px;font-family:inherit;cursor:pointer;font-weight:700;white-space:nowrap">📲 Install</button>
    </div>
  </div>`;
}
 
// ══════════════════════════════════════════════════════════════
// FEATURE 4: OMR SIMULATOR
// ══════════════════════════════════════════════════════════════
function fillOMR(qNum, opt){
  if(njState.omrMode==='review') return;
  njState.omrAnswers[qNum] = njState.omrAnswers[qNum]===opt ? null : opt;
  // Re-render just the bubble row for performance
  const row = document.getElementById(`omr-q-${qNum}`);
  if(row){
    const opts=['A','B','C','D'];
    row.querySelector('.omr-opts').innerHTML = opts.map(o=>`
      <div class="omr-bubble ${njState.omrAnswers[qNum]===o?'filled':''}" onclick="fillOMR(${qNum},'${o}')">${o}</div>`).join('');
  }
}
 
function omrScore(){
  const total = njState.omrSize;
  let correct=0,wrong=0,unattempted=0;
  for(let i=1;i<=total;i++){
    const ans = njState.omrAnswers[i];
    const correct_ans = njState.omrCorrect[i];
    if(!ans){ unattempted++; }
    else if(!correct_ans){ correct++; } // no key set, count as attempt
    else if(ans===correct_ans){ correct++; }
    else { wrong++; }
  }
  const score = (correct*4) - wrong;
  const max = total*4;
  showToast(`📊 Score: ${score}/${max} · Correct: ${correct} · Wrong: ${wrong} · Skip: ${unattempted}`,'info');
  njState.omrMode='review';
  switchView('neetjee');
}
 
function renderOMR(){
  const total = njState.omrSize;
  const attempted = Object.values(njState.omrAnswers).filter(Boolean).length;
  const opts = ['A','B','C','D'];
 
  return `<div>
    <div class="exam-section-hdr">
      <div class="exam-icon-wrap" style="background:#FFE66D22">📋</div>
      <div><div style="font-size:17px;font-weight:800;color:#EDE8E0">OMR Simulator</div>
        <div style="font-size:11px;color:#444">Practice marking — ${attempted}/${total} filled · −1 for wrong</div></div>
    </div>
 
    <!-- Controls -->
    <div class="feat-card" style="margin-bottom:12px">
      <div class="grid-2" style="gap:8px;align-items:center">
        <div>
          <div class="section-label">QUESTIONS</div>
          <div style="display:flex;gap:6px">
            ${[45,90,120,180,200].map(n=>`<button onclick="njState.omrSize=${n};njState.omrAnswers={};njState.omrMode='practice';switchView('neetjee')" class="pill-btn" style="font-size:10px;padding:4px 8px;${njState.omrSize===n?'background:#FFE66D22;border-color:#FFE66D44;color:#FFE66D':''}">${n}</button>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;align-items:center">
          ${njState.omrMode==='review'
            ?`<button onclick="njState.omrAnswers={};njState.omrMode='practice';switchView('neetjee')" class="btn-ghost" style="font-size:12px">🔄 Reset</button>`
            :`<button onclick="omrScore()" class="btn-gold" style="padding:8px 16px;font-size:12px">📊 Score It</button>`}
        </div>
      </div>
    </div>
 
    <!-- OMR Sheet -->
    <div class="feat-card" style="padding:12px">
      <div class="omr-grid">
        ${Array.from({length:total},(_,i)=>{
          const n = i+1;
          const ans = njState.omrAnswers[n];
          return `<div class="omr-q" id="omr-q-${n}">
            <div class="omr-q-num">${n}</div>
            <div class="omr-opts">
              ${opts.map(o=>`<div class="omr-bubble ${ans===o?'filled':''}" onclick="fillOMR(${n},'${o}')">${o}</div>`).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}
 
// ══════════════════════════════════════════════════════════════
// FEATURE 5: SPACED REPETITION (SRS)
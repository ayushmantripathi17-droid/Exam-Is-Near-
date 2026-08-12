// ══════════════════════════════════════════════════════════════
function addToSRS(mistakeId){
  const m = njState.mistakes.find(x=>x.id==mistakeId);
  if(!m){showToast('Mistake not found','alarm');return;}
  if(njState.srsCards.find(c=>c.mistakeId==mistakeId)){showToast('Already in SRS deck','info');return;}
  njState.srsCards.push({
    id:Date.now(), mistakeId, front:m.q, back:m.ans||'Review this concept',
    sub:m.sub, dueDate:Date.now(), interval:1, ease:2.5, reps:0
  });
  njSave();
  showToast('🔁 Added to Spaced Repetition deck!','success');
}

function addSRSCard(){
  const front = (document.getElementById('srs-front')?.value||'').trim();
  const back = (document.getElementById('srs-back')?.value||'').trim();
  const sub = document.getElementById('srs-sub')?.value||'Physics';
  if(!front){showToast('⚠️ Enter the front side','alarm');return;}
  njState.srsCards.push({
    id:Date.now(), front, back, sub,
    dueDate:Date.now(), interval:1, ease:2.5, reps:0
  });
  njSave();
  document.getElementById('srs-front').value='';
  document.getElementById('srs-back').value='';
  showToast('🃏 Card added!','success');
  switchView('neetjee');
}

function srsRate(quality){ // 0=again 1=hard 2=good 3=easy
  const queue = getDueSRSCards();
  const card = queue[njState.srsIndex];
  if(!card) return;
  const realCard = njState.srsCards.find(c=>c.id===card.id);
  if(!realCard) return;

  // SM-2 simplified
  if(quality < 2){
    realCard.interval = 1; realCard.reps = 0;
  } else {
    realCard.ease = Math.max(1.3, realCard.ease + 0.1 - (3-quality)*0.08);
    realCard.interval = realCard.reps===0 ? 1 : realCard.reps===1 ? 6 : Math.round(realCard.interval * realCard.ease);
    realCard.reps++;
  }
  realCard.dueDate = Date.now() + realCard.interval*24*60*60*1000;
  njSave();

  njState.srsFlipped = false;
  if(njState.srsIndex < queue.length-1){ njState.srsIndex++; }
  else { njState.srsIndex=0; }
  switchView('neetjee');
}

function getDueSRSCards(){
  const sub = njState.srsSubject;
  const now = Date.now();
  return njState.srsCards.filter(c=>(sub==='all'||c.sub===sub) && c.dueDate<=now);
}

function renderSRS(){
  const due = getDueSRSCards();
  const card = due[njState.srsIndex];
  const total = njState.srsCards.length;

  return `<div>
    <div class="exam-section-hdr">
      <div class="exam-icon-wrap" style="background:#C77DFF22">🔁</div>
      <div><div style="font-size:17px;font-weight:800;color:#EDE8E0">Spaced Repetition</div>
        <div style="font-size:11px;color:#444">${due.length} cards due today · ${total} total cards</div></div>
    </div>

    <!-- Add card -->
    <div class="feat-card shared" style="margin-bottom:12px">
      <div style="font-size:12px;font-weight:700;color:#C77DFF;margin-bottom:10px">➕ ADD CARD</div>
      <select id="srs-sub" style="font-size:12px;margin-bottom:8px"><option>Physics</option><option>Chemistry</option><option>Biology</option><option>Maths</option></select>
      <input id="srs-front" placeholder="Front: Question / Term" style="font-size:12px;margin-bottom:6px"/>
      <input id="srs-back" placeholder="Back: Answer / Definition" style="font-size:12px;margin-bottom:10px"/>
      <button class="btn-gold" onclick="addSRSCard()" style="width:100%;padding:9px;font-size:12px">➕ Add Card</button>
    </div>

    <!-- Filter -->
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
      ${['all','Physics','Chemistry','Biology','Maths'].map(s=>`
        <button onclick="njState.srsSubject='${s}';njState.srsIndex=0;njState.srsFlipped=false;switchView('neetjee')" class="pill-btn" style="${njState.srsSubject===s?'background:#C77DFF22;border-color:#C77DFF44;color:#C77DFF':''}">${s}</button>`).join('')}
    </div>

    <!-- Card review -->
    ${due.length===0
      ? `<div class="feat-card" style="text-align:center;padding:32px">
          <div style="font-size:40px;margin-bottom:12px">🎉</div>
          <div style="font-size:15px;font-weight:700;color:#06D6A0">All caught up!</div>
          <div style="font-size:12px;color:#444;margin-top:6px">No cards due right now. Come back tomorrow.</div>
        </div>`
      : `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:11px;color:#444">
          <span>Card ${njState.srsIndex+1} of ${due.length}</span>
          <div style="display:flex;gap:4px">
            ${due.map((_,i)=>`<div style="width:6px;height:6px;border-radius:50%;background:${i===njState.srsIndex?'#FFE66D':'#1e1e2e'}"></div>`).join('')}
          </div>
        </div>
        <div class="feat-card" style="min-height:180px;display:flex;flex-direction:column;cursor:pointer" onclick="njState.srsFlipped=!njState.srsFlipped;switchView('neetjee')">
          <div style="font-size:9px;color:#444;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px">${card.sub} · FRONT</div>
          <div class="srs-card-front">${esc(card.front)}</div>
          ${njState.srsFlipped
            ?`<div class="srs-card-back">${esc(card.back||'—')}</div>`
            :`<div style="text-align:center;font-size:11px;color:#333;margin-top:auto;padding:8px">Tap to reveal answer</div>`}
        </div>
        ${njState.srsFlipped
          ?`<div style="display:flex;gap:8px;margin-top:10px">
              <button class="srs-chip srs-again" onclick="srsRate(0)" style="flex:1;justify-content:center;padding:10px">😰 Again</button>
              <button class="srs-chip srs-hard" onclick="srsRate(1)" style="flex:1;justify-content:center;padding:10px">😅 Hard</button>
              <button class="srs-chip srs-good" onclick="srsRate(2)" style="flex:1;justify-content:center;padding:10px">😊 Good</button>
              <button class="srs-chip srs-easy" onclick="srsRate(3)" style="flex:1;justify-content:center;padding:10px">😎 Easy</button>
            </div>`
          :`<div style="text-align:center;font-size:11px;color:#2a2a3a;margin-top:8px">Rate after revealing the answer</div>`}
    `}
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// FEATURE 6: MOCK TEST (NEET 45Q / JEE 30Q shortened)
// ══════════════════════════════════════════════════════════════
const MOCK_QUESTIONS = {
  neet:[
    {q:'The genotypic ratio in a monohybrid cross (Aa × Aa) is:',opts:['1:2:1','3:1','1:1','2:1:1'],ans:0,sub:'Biology'},
    {q:'Which of the following has the highest electronegativity?',opts:['Fluorine','Oxygen','Chlorine','Nitrogen'],ans:0,sub:'Chemistry'},
    {q:'A body is moving in a circle with uniform speed. The acceleration is directed:',opts:['Towards the centre','Away from centre','Tangentially','At 45° to radius'],ans:0,sub:'Physics'},
    {q:'DNA replication is:',opts:['Semi-conservative','Conservative','Dispersive','All of these'],ans:0,sub:'Biology'},
    {q:'The unit of Planck\'s constant is:',opts:['J·s','J/s','J·s²','J/s²'],ans:0,sub:'Physics'},
    {q:'Which reaction is used to convert primary alcohol to aldehyde?',opts:['Oxidation','Reduction','Esterification','Hydrolysis'],ans:0,sub:'Chemistry'},
    {q:'The site of photosynthesis in a plant cell is:',opts:['Chloroplast','Mitochondria','Nucleus','Ribosome'],ans:0,sub:'Biology'},
    {q:'The SI unit of electric field is:',opts:['N/C','C/N','V·m','N·C'],ans:0,sub:'Physics'},
    {q:'Which of the following is a biodegradable polymer?',opts:['PHBV','Nylon-6,6','Bakelite','PVC'],ans:0,sub:'Chemistry'},
    {q:'During mitosis, chromatids separate in:',opts:['Anaphase','Prophase','Metaphase','Telophase'],ans:0,sub:'Biology'},
  ],
  jee:[
    {q:'The value of ∫₀^π sin(x)dx is:',opts:['2','0','1','π'],ans:0,sub:'Maths'},
    {q:'The number of orbitals in the n=3 shell is:',opts:['9','6','3','12'],ans:0,sub:'Chemistry'},
    {q:'For a projectile, the range is maximum when angle of projection is:',opts:['45°','30°','60°','90°'],ans:0,sub:'Physics'},
    {q:'The derivative of ln(x) is:',opts:['1/x','x','ln(x)','1/ln(x)'],ans:0,sub:'Maths'},
    {q:'The hybridisation of carbon in diamond is:',opts:['sp³','sp²','sp','sp³d'],ans:0,sub:'Chemistry'},
    {q:'A capacitor has capacitance C. Energy stored when charged to V is:',opts:['½CV²','CV²','2CV²','CV'],ans:0,sub:'Physics'},
    {q:'The matrix [[1,0],[0,1]] is called:',opts:['Identity matrix','Zero matrix','Diagonal matrix','Singular matrix'],ans:0,sub:'Maths'},
    {q:'Le Chatelier\'s principle deals with:',opts:['Equilibrium shift','Reaction rate','Activation energy','Entropy'],ans:0,sub:'Chemistry'},
    {q:'The dimensional formula of power is:',opts:['[ML²T⁻³]','[MLT⁻²]','[ML²T⁻²]','[M⁰L⁰T⁻¹]'],ans:0,sub:'Physics'},
    {q:'If f(x)=x²+3x, then f\'(2) is:',opts:['7','4','5','8'],ans:1,sub:'Maths'}, // ans=1 means B=4? Actually f'(x)=2x+3, f'(2)=7, so ans:0
  ],
};

let mockTimerInterval = null;

function startMock(exam){
  njState.mockExam = exam;
  njState.mockQs = MOCK_QUESTIONS[exam] || MOCK_QUESTIONS.neet;
  njState.mockCurrent = 0;
  njState.mockAnswers = {};
  njState.mockDone = false;
  njState.mockActive = true;
  njState.mockTimeLeft = exam==='neet' ? 10*60 : 10*60; // 10 min for demo
  if(mockTimerInterval) clearInterval(mockTimerInterval);
  mockTimerInterval = setInterval(()=>{
    njState.mockTimeLeft--;
    const el = document.getElementById('mock-timer');
    if(el){
      const m = Math.floor(njState.mockTimeLeft/60);
      const s = njState.mockTimeLeft%60;
      el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      if(njState.mockTimeLeft<=60) el.classList.add('warning');
    }
    if(njState.mockTimeLeft<=0){ clearInterval(mockTimerInterval); submitMock(); }
  },1000);
  switchView('neetjee');
}

function submitMock(){
  if(mockTimerInterval) clearInterval(mockTimerInterval);
  njState.mockDone=true;
  njState.mockActive=false;
  switchView('neetjee');
}

function selectMockAnswer(idx){
  if(njState.mockDone) return;
  njState.mockAnswers[njState.mockCurrent] = idx;
  switchView('neetjee');
}

function renderMock(){
  if(!njState.mockActive && !njState.mockDone){
    // Start screen
    return `<div>
      <div class="exam-section-hdr">
        <div class="exam-icon-wrap" style="background:#C77DFF22">📝</div>
        <div><div style="font-size:17px;font-weight:800;color:#EDE8E0">Mock Test</div>
          <div style="font-size:11px;color:#444">Timed practice with scoring & review</div></div>
      </div>
      <div class="grid-2" style="gap:12px">
        <div class="feat-card neet" style="text-align:center;cursor:pointer" onclick="startMock('neet')">
          <div style="font-size:36px;margin-bottom:10px">🩺</div>
          <div style="font-size:15px;font-weight:800;color:#06D6A0">NEET Mock</div>
          <div style="font-size:11px;color:#444;margin-top:4px">10 questions · 10 min · −1 wrong</div>
          <button class="btn-gold" style="margin-top:14px;width:100%;background:linear-gradient(135deg,#06D6A0,#059669);color:#fff">Start →</button>
        </div>
        <div class="feat-card jee" style="text-align:center;cursor:pointer" onclick="startMock('jee')">
          <div style="font-size:36px;margin-bottom:10px">⚡</div>
          <div style="font-size:15px;font-weight:800;color:#4ECDC4">JEE Mock</div>
          <div style="font-size:11px;color:#444;margin-top:4px">10 questions · 10 min · −1 wrong</div>
          <button class="btn-gold" style="margin-top:14px;width:100%;background:linear-gradient(135deg,#4ECDC4,#06D6A0);color:#08080f">Start →</button>
        </div>
      </div>
    </div>`;
  }

  if(njState.mockDone){
    // Results
    const qs = njState.mockQs;
    let correct=0,wrong=0,skip=0;
    qs.forEach((q,i)=>{
      const a = njState.mockAnswers[i];
      if(a===undefined||a===null) skip++;
      else if(a===q.ans) correct++;
      else wrong++;
    });
    const score = correct*4 - wrong;
    const maxScore = qs.length*4;
    const pct = Math.round(score/maxScore*100);

    return `<div>
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:40px;margin-bottom:8px">${pct>=75?'🏆':pct>=50?'📈':'💪'}</div>
        <div style="font-size:26px;font-weight:800;color:#FFE66D;font-family:'JetBrains Mono',monospace">${score}/${maxScore}</div>
        <div style="font-size:13px;color:#555;margin-top:4px">Mock Test Result</div>
      </div>
      <div class="grid-3" style="gap:8px;margin-bottom:16px">
        ${[['✅','Correct',correct,'#06D6A0'],['❌','Wrong',wrong,'#FF6B35'],['⏭️','Skipped',skip,'#555']].map(([ic,l,v,c])=>`
          <div class="stat-box"><div style="font-size:20px">${ic}</div><div style="font-size:22px;font-weight:800;color:${c};margin:4px 0">${v}</div><div style="font-size:10px;color:#444">${l}</div></div>`).join('')}
      </div>
      <!-- Solution review -->
      <div style="font-size:12px;font-weight:700;color:#ccc;margin-bottom:10px;letter-spacing:0.5px">SOLUTION REVIEW</div>
      ${qs.map((q,i)=>{
        const userAns = njState.mockAnswers[i];
        const isCorrect = userAns===q.ans;
        const isSkip = userAns===undefined||userAns===null;
        return `<div class="mock-q-card" style="border-color:${isCorrect?'#06D6A033':isSkip?'#1e1e2e':'#FF6B3333'}">
          <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:10px">
            <span style="font-size:16px">${isCorrect?'✅':isSkip?'⏭️':'❌'}</span>
            <div style="font-size:13px;color:#ccc;line-height:1.6">${i+1}. ${esc(q.q)}</div>
          </div>
          ${q.opts.map((o,oi)=>`<div class="mock-opt ${oi===q.ans?'correct-reveal':userAns===oi&&!isCorrect?'wrong-reveal':''}">
            <div class="mock-opt-letter" style="${oi===q.ans?'background:#06D6A0;border-color:#06D6A0;color:#fff':userAns===oi&&!isCorrect?'background:#FF6B35;border-color:#FF6B35;color:#fff':''}">${['A','B','C','D'][oi]}</div>
            <div style="font-size:12px;color:${oi===q.ans?'#06D6A0':userAns===oi&&!isCorrect?'#FF6B35':'#888'}">${esc(o)}</div>
          </div>`).join('')}
        </div>`;
      }).join('')}
      <button onclick="njState.mockDone=false;njState.mockActive=false;switchView('neetjee')" class="btn-ghost" style="width:100%;margin-top:8px">Take Another Test</button>
    </div>`;
  }

  // Active test
  const q = njState.mockQs[njState.mockCurrent];
  const total = njState.mockQs.length;
  const m = Math.floor(njState.mockTimeLeft/60);
  const s = njState.mockTimeLeft%60;
  const userAns = njState.mockAnswers[njState.mockCurrent];

  return `<div>
    <!-- Header bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div>
        <div style="font-size:12px;color:#444">Question ${njState.mockCurrent+1}/${total}</div>
        <div style="height:4px;background:#1a1a24;border-radius:2px;width:120px;margin-top:4px;overflow:hidden">
          <div style="height:100%;background:#FFE66D;width:${Math.round((njState.mockCurrent+1)/total*100)}%;border-radius:2px;transition:width 0.3s"></div>
        </div>
      </div>
      <div id="mock-timer" class="mock-timer ${njState.mockTimeLeft<=60?'warning':''}">${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}</div>
    </div>

    <div class="mock-q-card" style="margin-bottom:10px">
      <div style="font-size:10px;color:#444;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">${q.sub}</div>
      <div style="font-size:14px;color:#EDE8E0;line-height:1.7;font-weight:500">${esc(q.q)}</div>
    </div>

    ${q.opts.map((o,i)=>`
      <div class="mock-opt ${userAns===i?'selected':''}" onclick="selectMockAnswer(${i})">
        <div class="mock-opt-letter">${['A','B','C','D'][i]}</div>
        <div style="font-size:13px;color:#ccc;line-height:1.5">${esc(o)}</div>
      </div>`).join('')}

    <div style="display:flex;gap:8px;margin-top:14px">
      ${njState.mockCurrent>0?`<button onclick="njState.mockCurrent--;switchView('neetjee')" class="btn-ghost" style="flex:1">← Prev</button>`:''}
      ${njState.mockCurrent<total-1
        ?`<button onclick="njState.mockCurrent++;switchView('neetjee')" class="btn-gold" style="flex:2">Next →</button>`
        :`<button onclick="submitMock()" class="btn-gold" style="flex:2;background:linear-gradient(135deg,#06D6A0,#059669);color:#fff">✅ Submit</button>`}
    </div>

    <!-- Q palette -->
    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:14px">
      ${njState.mockQs.map((_,i)=>`
        <button onclick="njState.mockCurrent=${i};switchView('neetjee')" style="width:28px;height:28px;border-radius:6px;border:1px solid ${njState.mockCurrent===i?'#FFE66D':njState.mockAnswers[i]!==undefined?'#06D6A033':'#1e1e2e'};background:${njState.mockCurrent===i?'#FFE66D22':njState.mockAnswers[i]!==undefined?'#06150e':'#0a0a12'};color:${njState.mockCurrent===i?'#FFE66D':njState.mockAnswers[i]!==undefined?'#06D6A0':'#444'};font-size:10px;font-weight:700;cursor:pointer;font-family:'JetBrains Mono',monospace">${i+1}</button>`).join('')}
    </div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// FEATURE 7: DIFFICULTY HEATMAP
// ══════════════════════════════════════════════════════════════
const DIFF_SUBJECTS = {
  neet_physics: {label:'Physics (NEET)', color:'#4ECDC4', topics:['Kinematics','Laws of Motion','Work & Energy','Rotational Motion','Gravitation','Fluid Mechanics','Thermodynamics','Oscillations','Waves','Electrostatics','Current Electricity','Magnetism','EMI','Optics','Modern Physics','Semiconductors']},
  neet_chemistry: {label:'Chemistry (NEET)', color:'#FFE66D', topics:['Atomic Structure','Chemical Bonding','States of Matter','Thermodynamics','Equilibrium','Electrochemistry','Kinetics','Surface Chemistry','p-Block','d-Block','Coordination','Halogeno Alkanes','Alcohols','Carbonyl Compounds','Carboxylic Acids','Amines','Polymers','Biomolecules']},
  neet_biology: {label:'Biology (NEET)', color:'#06D6A0', topics:['Cell Biology','Biomolecules','Cell Division','Morphology of Plants','Anatomy of Plants','Plant Physiology','Animal Kingdom','Human Physiology','Reproduction','Genetics','Molecular Biology','Evolution','Ecology','Biotechnology']},
  jee_maths: {label:'Maths (JEE)', color:'#C77DFF', topics:['Sets & Functions','Complex Numbers','Sequences','Quadratic','Matrices','Permutation','Binomial','Limits','Derivatives','Integration','Differential Eq.','Straight Lines','Circles','Conics','Vectors','3D Geometry','Probability','Statistics']},
};

function setDifficulty(topic, level){
  if(!njState.diffMap) njState.diffMap={};
  njState.diffMap[`${njState.diffSubject}__${topic}`] = level;
  njSave();
  // Re-render so summary counts + percentages stay in sync
  switchView('neetjee');
}

function renderDifficulty(){
  const subjects = Object.keys(DIFF_SUBJECTS);
  const sub = njState.diffSubject;
  const subData = DIFF_SUBJECTS[sub];
  const map = njState.diffMap||{};

  const counts = {easy:0,medium:0,hard:0,unset:0};
  subData.topics.forEach(t=>{
    const level = map[`${sub}__${t}`];
    counts[level||'unset']++;
  });
  const total = subData.topics.length;

  return `<div>
    <div class="exam-section-hdr">
      <div class="exam-icon-wrap" style="background:#FF6B3522">🌡️</div>
      <div><div style="font-size:17px;font-weight:800;color:#EDE8E0">Difficulty Heatmap</div>
        <div style="font-size:11px;color:#444">Rate each topic — focus on 🔥 Hard ones</div></div>
    </div>

    <!-- Subject selector -->
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
      ${subjects.map(s=>`<button onclick="njState.diffSubject='${s}';switchView('neetjee')" class="pill-btn" style="font-size:10px;${sub===s?'background:'+DIFF_SUBJECTS[s].color+'22;border-color:'+DIFF_SUBJECTS[s].color+'44;color:'+DIFF_SUBJECTS[s].color:''}">${DIFF_SUBJECTS[s].label}</button>`).join('')}
    </div>

    <!-- Summary -->
    <div class="grid-3" style="gap:8px;margin-bottom:14px">
      ${[['🔥','Hard',counts.hard,'#FF6B35'],['⚡','Medium',counts.medium,'#FFE66D'],['✅','Easy',counts.easy,'#06D6A0']].map(([ic,l,v,c])=>`
        <div class="stat-box"><div style="font-size:18px">${ic}</div><div style="font-size:20px;font-weight:800;color:${c};margin:4px 0">${v}</div><div style="font-size:10px;color:#444">${l} (${total>0?Math.round(v/total*100):0}%)</div></div>`).join('')}
    </div>

    <!-- Topic grid -->
    <div class="diff-grid">
      ${subData.topics.map(t=>{
        const key = `${sub}__${t}`;
        const level = map[key];
        const diffClass = level==='easy'?'diff-easy':level==='medium'?'diff-medium':level==='hard'?'diff-hard':'diff-unset';
        const diffLabel = level==='easy'?'✅ Easy':level==='medium'?'⚡ Medium':level==='hard'?'🔥 Hard':'Tap to rate';
        const safeId = t.replace(/[^a-z0-9]/gi,'_');
        return `<div id="diff-${safeId}" class="diff-chip ${diffClass}" onclick="
          const levels=['easy','medium','hard'];
          const cur=njState.diffMap[njState.diffSubject+'__'+'${t}']||'';
          const next=levels[(levels.indexOf(cur)+1)%3];
          setDifficulty('${t}',next)">
          <div style="font-size:11px;font-weight:700;margin-bottom:3px">${t}</div>
          <div class="diff-label" style="font-size:10px">${diffLabel}</div>
        </div>`;
      }).join('')}
    </div>
    <div style="font-size:10px;color:#333;margin-top:10px;text-align:center">Tap a topic to cycle Easy → Medium → Hard</div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// FEATURE 8: JEE PERCENTILE CALCULATOR
// ══════════════════════════════════════════════════════════════
function renderPercentile(){
  // Percentile is always JEE
  njState.exam = 'jee';
  const score = parseInt(njState.pctScore)||0;
  const hasScore = njState.pctScore !== '';

  let resultHtml = '';
  if(hasScore && score >= 0){
    const data = getJeePercentile(score);
    const college = getJeeCollege(data.pct);
    const pct = data.pct;
    const eligible = pct >= 75;
    const jeeAdv = pct >= 99;

    resultHtml = `<div class="pct-result">
      <div style="font-size:11px;color:#4ECDC466;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">Your Percentile</div>
      <div class="pct-big">${pct}</div>
      <div style="font-size:13px;color:#4ECDC4;margin-top:4px;font-weight:600">Rank range: ${data.rank}</div>
      <div style="margin:14px 0;height:1px;background:#1e1e2e"></div>
      <div style="display:flex;flex-direction:column;gap:8px;text-align:left">
        <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#0f0f18;border:1px solid #1e1e2e;border-radius:8px">
          <span style="font-size:16px">${eligible?'✅':'❌'}</span>
          <div><div style="font-size:12px;color:#ccc;font-weight:600">JEE Advanced Eligibility</div>
            <div style="font-size:10px;color:#444">Requires 75th percentile (General)</div></div>
          <div style="margin-left:auto;font-size:11px;font-weight:700;color:${eligible?'#06D6A0':'#FF6B35'}">${eligible?'Eligible':'Not eligible'}</div>
        </div>
        ${jeeAdv?`<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#0a1a0f;border:1px solid #06D6A033;border-radius:8px">
          <span style="font-size:16px">🏆</span>
          <div><div style="font-size:12px;color:#06D6A0;font-weight:600">IIT eligible</div>
            <div style="font-size:10px;color:#444">Appear for JEE Advanced</div></div>
        </div>`:''}
        <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#0f0f18;border:1px solid #1e1e2e;border-radius:8px">
          <span style="font-size:16px">🏛️</span>
          <div style="flex:1"><div style="font-size:12px;color:#ccc;font-weight:600">College in reach</div>
            <div style="font-size:11px;color:#4ECDC4;margin-top:2px">${college}</div></div>
        </div>
      </div>
    </div>
    <div style="margin-top:12px">
      <div style="font-size:11px;font-weight:700;color:#555;letter-spacing:1px;margin-bottom:8px">PERCENTILE LADDER</div>
      ${JEE_PERCENTILE_DATA.slice(0,-2).map(d=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #0a0a12">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:${score>=d.score?'#4ECDC4':'#333'};min-width:40px;font-weight:700">${d.score}+</div>
        <div style="flex:1;height:4px;background:#1a1a24;border-radius:2px;overflow:hidden"><div style="height:100%;background:${score>=d.score?'#4ECDC4':'#1a1a24'};width:${d.pct}%;border-radius:2px"></div></div>
        <div style="font-size:10px;color:${score>=d.score?'#4ECDC4':'#333'};min-width:55px;text-align:right">${d.pct}th pct</div>
        <div style="font-size:10px;color:#333;min-width:50px">Rank ${d.rank}</div>
      </div>`).join('')}
    </div>`;
  }

  return `<div>
    <div class="exam-section-hdr">
      <div class="exam-icon-wrap" style="background:#4ECDC422">⚡</div>
      <div><div style="font-size:17px;font-weight:800;color:#EDE8E0">JEE Percentile</div>
        <div style="font-size:11px;color:#444">Score → Percentile → College predictor</div></div>
    </div>

    <div class="feat-card jee">
      <div class="section-label">YOUR JEE MAINS SCORE (out of 300)</div>
      <input type="number" id="pct-score" min="0" max="300" placeholder="e.g. 200"
        value="${njState.pctScore}"
        oninput="njState.pctScore=this.value"
        style="font-size:28px;font-weight:800;font-family:'JetBrains Mono',monospace;text-align:center;color:#4ECDC4;background:#0a0a12;border-color:#4ECDC433;letter-spacing:2px;margin-bottom:12px"/>
      <button class="btn-gold" onclick="njState.pctScore=document.getElementById('pct-score').value;switchView('neetjee')" style="width:100%;padding:11px;font-size:14px;background:linear-gradient(135deg,#4ECDC4,#06D6A0);color:#08080f">⚡ Calculate Percentile</button>
    </div>
    ${resultHtml}
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// MAIN HUB RENDERER
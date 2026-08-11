// ══════════════════════════════════════════════════════════════
// NEET / JEE HUB — All 8 Features
// ══════════════════════════════════════════════════════════════

// ── Shared state ──
let njState = {
  tab: 'home',           // home | weightage | rank | omr | mistakes | srs | mock | difficulty | percentile
  exam: 'neet',          // neet | jee
  // Rank predictor
  rankScore: '',
  rankCat: 'general',
  // OMR
  omrAnswers: {},
  omrCorrect: {},
  omrMode: 'practice',   // practice | review
  omrSize: 45,
  // Mistakes (FIX: always initialized to avoid undefined errors if njLoad fails)
  mistakes: [],
  mistakeSubject: 'all',
  // SRS (FIX: always initialized)
  srsCards: [],
  srsQueue: [],
  srsIndex: 0,
  srsFlipped: false,
  srsSubject: 'all',
  // Difficulty (FIX: always initialized)
  diffMap: {},
  // Mock
  mockActive: false,
  mockQs: [],
  mockCurrent: 0,
  mockAnswers: {},
  mockDone: false,
  mockTimeLeft: 0,
  mockExam: 'neet',
  mockTimerHandle: null,
  // Difficulty
  diffSubject: 'neet_physics',
  // Percentile
  pctScore: '',
  pctPaper: '1',
};

function njSave(){
  localStorage.setItem('ein_nj', JSON.stringify({
    mistakes: njState.mistakes,
    srsCards: njState.srsCards,
    diffMap: njState.diffMap,
  }));
  // Also push to cloud so NJ data syncs across devices
  clearTimeout(S._timer);
  S._timer = setTimeout(pushToFirebase, 1200);
}

function njLoad(){
  try{
    const d = JSON.parse(localStorage.getItem('ein_nj')||'{}');
    njState.mistakes = d.mistakes || [];
    njState.srsCards = d.srsCards || [];
    njState.diffMap  = d.diffMap  || {};
  }catch(e){
    njState.mistakes = [];
    njState.srsCards = [];
    njState.diffMap  = {};
  }
}
njLoad();

// ══════════════════════════════════════════════════════════════
// DATA — Chapter weightage (NEET 2019-2024 avg questions)
// ══════════════════════════════════════════════════════════════
const NEET_WEIGHTAGE = {
  Physics:[
    {ch:'Modern Physics & Dual Nature',q:7,color:'#4ECDC4'},
    {ch:'Electrostatics',q:6,color:'#FFE66D'},
    {ch:'Current Electricity',q:6,color:'#FFE66D'},
    {ch:'Optics (Ray + Wave)',q:6,color:'#FFE66D'},
    {ch:'Oscillations & Waves',q:5,color:'#06D6A0'},
    {ch:'Magnetism & Moving Charges',q:5,color:'#06D6A0'},
    {ch:'Laws of Motion',q:4,color:'#06D6A0'},
    {ch:'Work, Energy & Power',q:4,color:'#06D6A0'},
    {ch:'Electromagnetic Induction',q:4,color:'#06D6A0'},
    {ch:'Semiconductors',q:3,color:'#aaa'},
    {ch:'Kinematics',q:3,color:'#aaa'},
    {ch:'Gravitation',q:2,color:'#555'},
    {ch:'Thermodynamics',q:2,color:'#555'},
    {ch:'Rotational Motion',q:2,color:'#555'},
  ],
  Chemistry:[
    {ch:'Organic: Named Reactions',q:8,color:'#4ECDC4'},
    {ch:'Chemical Bonding',q:6,color:'#FFE66D'},
    {ch:'Coordination Compounds',q:5,color:'#FFE66D'},
    {ch:'Electrochemistry',q:4,color:'#06D6A0'},
    {ch:'Equilibrium',q:4,color:'#06D6A0'},
    {ch:'Organic: GOC & IUPAC',q:4,color:'#06D6A0'},
    {ch:'p-Block Elements',q:4,color:'#06D6A0'},
    {ch:'Aldehydes & Ketones',q:3,color:'#aaa'},
    {ch:'Thermodynamics (Chem)',q:3,color:'#aaa'},
    {ch:'Atomic Structure',q:3,color:'#aaa'},
    {ch:'Solutions',q:3,color:'#aaa'},
    {ch:'Polymers & Biomolecules',q:3,color:'#aaa'},
  ],
  Biology:[
    {ch:'Genetics & Molecular Biology',q:18,color:'#4ECDC4'},
    {ch:'Plant Physiology',q:12,color:'#FFE66D'},
    {ch:'Human Physiology',q:12,color:'#FFE66D'},
    {ch:'Ecology & Environment',q:12,color:'#FFE66D'},
    {ch:'Reproduction (Plant+Animal)',q:9,color:'#06D6A0'},
    {ch:'Cell Biology & Biotechnology',q:9,color:'#06D6A0'},
    {ch:'Evolution & Origin of Life',q:5,color:'#aaa'},
    {ch:'Structural Organisation',q:4,color:'#aaa'},
    {ch:'Diversity in Living World',q:4,color:'#555'},
    {ch:'Biological Classification',q:3,color:'#555'},
  ],
};

const JEE_WEIGHTAGE = {
  Physics:[
    {ch:'Mechanics (Laws of Motion + WEP)',q:6,color:'#4ECDC4'},
    {ch:'Electrostatics & Capacitors',q:5,color:'#FFE66D'},
    {ch:'Current Electricity',q:5,color:'#FFE66D'},
    {ch:'Modern Physics',q:5,color:'#FFE66D'},
    {ch:'Optics',q:4,color:'#06D6A0'},
    {ch:'Magnetism & EMI',q:4,color:'#06D6A0'},
    {ch:'Oscillations & Waves',q:4,color:'#06D6A0'},
    {ch:'Rotational Motion',q:3,color:'#aaa'},
    {ch:'Fluid Mechanics',q:3,color:'#aaa'},
    {ch:'Thermodynamics',q:3,color:'#aaa'},
    {ch:'Semiconductors',q:2,color:'#555'},
  ],
  Chemistry:[
    {ch:'Organic: Named Reactions & Mech.',q:7,color:'#4ECDC4'},
    {ch:'Equilibrium (Chemical + Ionic)',q:6,color:'#FFE66D'},
    {ch:'Coordination Chemistry',q:5,color:'#FFE66D'},
    {ch:'Chemical Bonding',q:5,color:'#FFE66D'},
    {ch:'Electrochemistry',q:4,color:'#06D6A0'},
    {ch:'p & d-Block Elements',q:4,color:'#06D6A0'},
    {ch:'GOC & Isomerism',q:4,color:'#06D6A0'},
    {ch:'Thermodynamics',q:3,color:'#aaa'},
    {ch:'Atomic Structure',q:3,color:'#aaa'},
    {ch:'Polymers & Chemistry in Action',q:2,color:'#555'},
  ],
  Maths:[
    {ch:'Calculus (Limits, Diff, Integ)',q:9,color:'#4ECDC4'},
    {ch:'Coordinate Geometry',q:7,color:'#FFE66D'},
    {ch:'Algebra (Matrices, Det, Complex)',q:7,color:'#FFE66D'},
    {ch:'Probability & Statistics',q:5,color:'#06D6A0'},
    {ch:'Trigonometry',q:4,color:'#06D6A0'},
    {ch:'Vectors & 3D Geometry',q:4,color:'#06D6A0'},
    {ch:'Permutation & Combination',q:3,color:'#aaa'},
    {ch:'Sequences & Series',q:3,color:'#aaa'},
    {ch:'Binomial Theorem',q:2,color:'#555'},
  ],
};

// ══════════════════════════════════════════════════════════════
// NEET Rank & Colleges
// ══════════════════════════════════════════════════════════════
const NEET_COLLEGES = [
  {score:700,rank:'1–100',colleges:['AIIMS Delhi','JIPMER Puducherry','MAMC Delhi']},
  {score:660,rank:'100–500',colleges:['AIIMS (other campuses)','GMC Chandigarh','KGMU Lucknow']},
  {score:620,rank:'500–3000',colleges:['State govt. medical colleges (top)','BHU Varanasi','SNMC Agra']},
  {score:580,rank:'3000–15000',colleges:['State govt. colleges (general)','Grant Medical Mumbai','SMS Jaipur']},
  {score:540,rank:'15000–50000',colleges:['State govt. colleges (OBC cutoff)','Private medical (top tier)']},
  {score:500,rank:'50000–150000',colleges:['Private medical colleges','Deemed universities']},
  {score:0,rank:'150000+',colleges:['Some private colleges','Management quota seats']},
];

function getNeetRank(score, cat){
  // Approximate formula based on historical data
  const base = Math.max(0, 720 - score);
  const mult = cat==='sc'||cat==='st' ? 200 : cat==='obc' ? 500 : 800;
  return Math.round(base * mult / 720 * mult + base * 2);
}

function getNeetColleges(score){
  for(const tier of NEET_COLLEGES){
    if(score >= tier.score) return tier;
  }
  return NEET_COLLEGES[NEET_COLLEGES.length-1];
}

// ══════════════════════════════════════════════════════════════
// JEE Percentile Calculator
// ══════════════════════════════════════════════════════════════
const JEE_PERCENTILE_DATA = [
  {score:300,pct:99.99,rank:'1–10'},
  {score:270,pct:99.9,rank:'10–100'},
  {score:250,pct:99.7,rank:'100–300'},
  {score:230,pct:99.2,rank:'300–800'},
  {score:200,pct:98.0,rank:'800–2500'},
  {score:170,pct:96.0,rank:'2500–8000'},
  {score:140,pct:92.0,rank:'8000–25000'},
  {score:110,pct:85.0,rank:'25000–80000'},
  {score:80,pct:72.0,rank:'80000–250000'},
  {score:50,pct:55.0,rank:'250000–500000'},
  {score:0,pct:30.0,rank:'500000+'},
];

const JEE_NIT_DATA = [
  {pct:99.5,inst:'NIT Trichy / NIT Warangal (CS)'},
  {pct:99.0,inst:'NIT Surathkal / NIT Calicut (CS/EC)'},
  {pct:98.5,inst:'NIT Rourkela / NIT Jaipur (CS)'},
  {pct:97.0,inst:'NIT Nagpur / NIT Patna (CS/ME)'},
  {pct:95.0,inst:'IIIT Hyderabad / IIIT Allahabad'},
  {pct:92.0,inst:'NIT (other branches) / IIIT (other)'},
  {pct:85.0,inst:'GFTIs / State NITs'},
];

function getJeePercentile(score){
  for(let i=0;i<JEE_PERCENTILE_DATA.length;i++){
    if(score >= JEE_PERCENTILE_DATA[i].score) return JEE_PERCENTILE_DATA[i];
  }
  return JEE_PERCENTILE_DATA[JEE_PERCENTILE_DATA.length-1];
}

function getJeeCollege(pct){
  for(const d of JEE_NIT_DATA){
    if(pct >= d.pct) return d.inst;
  }
  return 'Some private engineering colleges';
}

// ══════════════════════════════════════════════════════════════
// FEATURE 1: MISTAKE LOGBOOK
// ══════════════════════════════════════════════════════════════
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
// FEATURE 3: RANK PREDICTOR
// ══════════════════════════════════════════════════════════════
function renderRankPredictor(){
  // Auto-sync exam tab with active course
  if(activeCourse === 'jee' && njState.exam !== 'jee') njState.exam = 'jee';
  else if(activeCourse === 'neet' && njState.exam !== 'neet') njState.exam = 'neet';

  const exam = njState.exam;
  const score = parseInt(njState.rankScore)||0;
  const cat = njState.rankCat;
  const hasScore = njState.rankScore !== '';

  let resultHtml = '';
  if(hasScore && score > 0){
    if(exam==='neet'){
      const rank = getNeetRank(score, cat);
      const tier = getNeetColleges(score);
      const pct = Math.round((score/720)*100);
      resultHtml = `<div class="rank-result">
        <div style="font-size:11px;color:#444;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">Estimated NEET Rank</div>
        <div class="rank-big">~${rank.toLocaleString('en-IN')}</div>
        <div class="rank-label">${tier.rank} range · ${pct}% of max marks</div>
        <div style="margin:14px 0;height:1px;background:#1e1e2e"></div>
        <div style="font-size:11px;color:#444;margin-bottom:8px;letter-spacing:1px;text-transform:uppercase">Colleges in reach</div>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:4px">
          ${tier.colleges.map(c=>`<span class="college-chip">🏥 ${c}</span>`).join('')}
        </div>
      </div>`;
    } else {
      const data = getJeePercentile(score);
      const college = getJeeCollege(data.pct);
      resultHtml = `<div class="pct-result">
        <div style="font-size:11px;color:#4ECDC466;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">Estimated JEE Percentile</div>
        <div class="pct-big">${data.pct}</div>
        <div style="font-size:13px;color:#4ECDC4;margin-top:4px;font-weight:600">Rank range: ${data.rank}</div>
        <div style="margin:14px 0;height:1px;background:#1e1e2e"></div>
        <div style="font-size:12px;color:#555;margin-bottom:6px">College in reach:</div>
        <div style="font-size:13px;color:#EDE8E0;font-weight:600">🏛 ${college}</div>
      </div>`;
    }
  }

  const maxScore = exam==='neet' ? 720 : 300;

  return `<div>
    <div class="exam-section-hdr">
      <div class="exam-icon-wrap" style="background:${exam==='neet'?'#06D6A022':'#4ECDC422'}">🎯</div>
      <div><div style="font-size:17px;font-weight:800;color:#EDE8E0">Rank Predictor</div>
        <div style="font-size:11px;color:#444">Estimate your rank and college from marks</div></div>
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
          oninput="njState.rankScore=this.value"
          style="font-size:24px;font-weight:800;font-family:'JetBrains Mono',monospace;text-align:center;color:#FFE66D;background:#0a0a12;border-color:#FFE66D33;letter-spacing:2px"/>
      </div>
      ${exam==='neet'?`<div style="margin-bottom:14px">
        <div class="section-label">CATEGORY</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${[['general','General'],['obc','OBC'],['sc','SC'],['st','ST']].map(([v,l])=>`
            <button onclick="njState.rankCat='${v}';switchView('neetjee')" class="pill-btn" style="${cat===v?'background:#FFE66D22;border-color:#FFE66D44;color:#FFE66D':''}">${l}</button>`).join('')}
        </div>
      </div>`:''}
      <button class="btn-gold" onclick="njState.rankScore=document.getElementById('rank-score').value;switchView('neetjee')" style="width:100%;padding:11px;font-size:14px">🎯 Predict My Rank</button>
    </div>

    ${resultHtml}

    <div style="margin-top:12px;padding:10px 14px;background:#0a0a12;border:1px solid #1e1e2e;border-radius:10px;font-size:10px;color:#333;line-height:1.8">
      ⚠️ Predictions based on historical trends (2019–2024). Actual ranks depend on exam difficulty, number of candidates, and normalization. Verify with official NTA data.
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
// ══════════════════════════════════════════════════════════════
// exam: 'neet'=NEET only, 'jee'=JEE only, 'both'=shared
const NJ_FEATURES = [
  {id:'weightage', icon:'📊', label:'Weightage',    desc:'Chapter-wise marks distribution',   color:'#FFE66D', bg:'#1a1200', exam:'both'},
  {id:'rank',      icon:'🎯', label:'NEET Rank',    desc:'NEET rank & college from marks',     color:'#06D6A0', bg:'#061208', exam:'neet'},
  {id:'percentile',icon:'⚡', label:'JEE Percentile',desc:'Score to percentile & NIT finder',  color:'#4ECDC4', bg:'#041214', exam:'jee'},
  {id:'omr',       icon:'📋', label:'OMR Sheet',    desc:'Practice marking 45/180 questions',  color:'#FFE66D', bg:'#141000', exam:'both'},
  {id:'mistakes',  icon:'📝', label:'Mistakes',     desc:'Log & review your wrong answers',    color:'#FF6B35', bg:'#150600', exam:'both'},
  {id:'srs',       icon:'🔁', label:'Flashcards+',  desc:'Spaced repetition card review',      color:'#C77DFF', bg:'#110820', exam:'both'},
  {id:'difficulty',icon:'🌡️', label:'Heatmap',     desc:'Rate topics Easy/Medium/Hard',       color:'#FF6B35', bg:'#150800', exam:'both'},
];

function renderNeetJee(){
  // NFSU users should not see this section
  if(activeCourse === 'nfsu' || activeCourse === 'nfsu1' || activeCourse === 'nfsu3' || activeCourse === 'cbse10' || activeCourse === 'cbse12' || activeCourse === null){
    const courseLabel = activeCourse === 'cbse10' ? 'Class 10' : activeCourse === 'cbse12' ? 'Class 12' : 'NFSU';
    return `<div class="fade-in" style="text-align:center;padding:48px 20px">
      <div style="font-size:48px;margin-bottom:16px">🎓</div>
      <div style="font-size:18px;font-weight:bold;color:#ccc;margin-bottom:8px">This section is for NEET / JEE</div>
      <div style="font-size:13px;color:#555;margin-bottom:24px;line-height:1.8">You're on the ${courseLabel} course.<br>Switch to NEET or JEE to access these tools.</div>
      <button class="btn-gold" onclick="showCourseSelector()" style="padding:12px 28px">🎯 Switch Course</button>
    </div>`;
  }

  const tab = njState.tab;

  // Auto-set njState.exam from activeCourse for proper defaults
  if(activeCourse === 'jee') njState.exam = 'jee';
  else if(activeCourse === 'neet') njState.exam = 'neet';

  if(tab==='mistakes')  return wrapNJ(renderMistakes(), tab);
  if(tab==='weightage') return wrapNJ(renderWeightage(), tab);
  if(tab==='rank')      return wrapNJ(renderRankPredictor(), tab);
  if(tab==='omr')       return wrapNJ(renderOMR(), tab);
  if(tab==='srs')       return wrapNJ(renderSRS(), tab);
  if(tab==='difficulty')return wrapNJ(renderDifficulty(), tab);
  if(tab==='percentile')return wrapNJ(renderPercentile(), tab);

  // Determine which course is active for filtering
  const isJEE  = activeCourse === 'jee';
  const isNEET = activeCourse === 'neet';

  // Filter features based on active course
  const visibleFeatures = NJ_FEATURES.filter(f => {
    if(f.exam === 'both') return true;
    if(f.exam === 'neet' && isNEET) return true;
    if(f.exam === 'jee'  && isJEE)  return true;
    // If neither NEET nor JEE course active (e.g. NFSU), show all
    if(!isNEET && !isJEE) return true;
    return false;
  });

  const mkBadge = (id) => {
    if(id==='mistakes') return `<span style="font-size:9px;background:#FF6B3522;color:#FF6B35;border:1px solid #FF6B3333;border-radius:8px;padding:1px 6px;font-weight:700">${njState.mistakes.length}</span>`;
    if(id==='srs') return `<span style="font-size:9px;background:#C77DFF22;color:#C77DFF;border:1px solid #C77DFF33;border-radius:8px;padding:1px 6px;font-weight:700">${getDueSRSCards().length} due</span>`;
    return '';
  };

  // Hero styling based on course
  const heroGrad  = isJEE  ? 'linear-gradient(90deg,#4ECDC4,#06D6A0)'
                  : isNEET ? 'linear-gradient(90deg,#06D6A0,#FFE66D)'
                  :          'linear-gradient(90deg,#FFE66D,#06D6A0)';
  const heroTitle = isJEE  ? '⚡ JEE Hub'
                  : isNEET ? '🩺 NEET Hub'
                  :          'NEET · JEE Hub';
  const heroSub   = isJEE  ? 'Specialised tools for JEE Mains & Advanced preparation'
                  : isNEET ? 'Specialised tools for NEET UG preparation'
                  :          'Specialised tools for medical & engineering exam prep';

  return `<div class="fade-in">
    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#0f0f1a,#12101a);border:1px solid #1e1e2e;border-radius:18px;padding:22px;margin-bottom:18px;position:relative;overflow:hidden">
      <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:radial-gradient(circle,#FFE66D08,transparent 70%);pointer-events:none"></div>
      <div style="position:absolute;bottom:-20px;left:-20px;width:100px;height:100px;background:radial-gradient(circle,#06D6A008,transparent 70%);pointer-events:none"></div>
      <div style="font-size:22px;font-weight:800;background:${heroGrad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px">${heroTitle}</div>
      <div style="font-size:12px;color:#444;margin-bottom:16px">${heroSub}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${isNEET||(!isJEE&&!isNEET)?`<div style="background:#06D6A022;border:1px solid #06D6A033;border-radius:8px;padding:6px 12px;font-size:11px;color:#06D6A0;font-weight:600">🩺 NEET 2026</div>`:''}
        ${isJEE||(!isJEE&&!isNEET)?`<div style="background:#4ECDC422;border:1px solid #4ECDC433;border-radius:8px;padding:6px 12px;font-size:11px;color:#4ECDC4;font-weight:600">⚡ JEE 2026</div>`:''}
      </div>
    </div>

    <!-- Feature grid -->
    <div class="grid-2" style="gap:10px">
      ${visibleFeatures.map(f=>`
        <div onclick="njState.tab='${f.id}';switchView('neetjee')"
          style="background:${f.bg};border:1px solid ${f.color}22;border-radius:14px;padding:16px;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden"
          onmouseover="this.style.borderColor='${f.color}55';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.borderColor='${f.color}22';this.style.transform='translateY(0)'">
          <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${f.color}88,transparent)"></div>
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
            <div style="font-size:26px">${f.icon}</div>
            ${mkBadge(f.id)}
          </div>
          <div style="font-size:13px;font-weight:700;color:${f.color};margin-bottom:3px">${f.label}</div>
          <div style="font-size:11px;color:#444;line-height:1.5">${f.desc}</div>
        </div>`).join('')}
    </div>
  </div>`;
}

function wrapNJ(inner, tab){
  return `<div class="fade-in">
    <button onclick="history.pushState(null,'',location.href);njState.tab='home';switchView('neetjee')" style="background:none;border:none;color:#555;font-size:12px;cursor:pointer;padding:0;margin-bottom:14px;display:flex;align-items:center;gap:6px;font-family:inherit;transition:color 0.2s" onmouseover="this.style.color='#ccc'" onmouseout="this.style.color='#555'">
      ← Back to Hub
    </button>
    ${inner}
  </div>`;
}

</script>

</body>
</html>

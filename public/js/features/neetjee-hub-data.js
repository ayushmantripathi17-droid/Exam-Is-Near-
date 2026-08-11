// ── Permanent Pro Footer Bar ──
(async function _initProBar(){
  const bar = document.getElementById('pro-footer-bar');
  if(!bar) return;

  // Check session-storage dismiss (hides for current session only)
  const dismissed = sessionStorage.getItem('ein_probar_dismissed');

  async function refreshBar(){
    try{
      const pro = await isProUser();
      if(pro){
        // Pro user — hide bar permanently, remove body padding
        bar.classList.add('hidden');
        document.body.classList.remove('has-pro-bar');
      } else if(!dismissed){
        bar.classList.remove('hidden');
        document.body.classList.add('has-pro-bar');
      }
    }catch(e){
      // On error, keep bar hidden to avoid layout jank
    }
  }

  // Initial check after app loads
  setTimeout(refreshBar, 1800);

  // Re-check whenever Pro modal closes (user may have just paid)
  const origClose = window.closeProModal;
  window.closeProModal = function(){
    if(origClose) origClose();
    setTimeout(refreshBar, 800);
  };
})();

function _dismissProBar(){
  const bar = document.getElementById('pro-footer-bar');
  if(bar){
    bar.style.animation = 'none';
    bar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    bar.style.transform = 'translateY(100%)';
    bar.style.opacity = '0';
    setTimeout(()=>{ bar.classList.add('hidden'); }, 320);
  }
  document.body.classList.remove('has-pro-bar');
  // Dismiss for this session only — reappears on next visit
  sessionStorage.setItem('ein_probar_dismissed', '1');
}


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
// ══════════════════════════════════════════════════════════════
// NEET Rank & Colleges — Updated 17 Jul 2026
// Top band CONFIRMED from NTA's official Re-NEET UG 2026 result
// (declared 16 Jul 2026): AIR 1 = 715 marks; 19 candidates above 700;
// 138 candidates above 690. Everything below 690 is NOT yet published
// by NTA for 2026 — shown as a 2025-pattern estimate until it is.
// Source: NTA NEET 2025 result PDF + JoSAA/MCC 2025 counselling data
// ~24 lakh candidates appeared NEET 2025
// ══════════════════════════════════════════════════════════════

// Maps score → {airLow, airHigh} for General category (AIR, ~24L candidates)
const NEET_RANK_TABLE = [
  {score:701,airLow:1,    airHigh:19,   confirmed:true},
  {score:691,airLow:20,   airHigh:138,  confirmed:true},
  {score:680,airLow:139,  airHigh:700,  confirmed:false},
  {score:670,airLow:700,  airHigh:1500, confirmed:false},
  {score:660,airLow:1500, airHigh:3000, confirmed:false},
  {score:650,airLow:3000, airHigh:5500, confirmed:false},
  {score:640,airLow:5500, airHigh:9000, confirmed:false},
  {score:630,airLow:9000, airHigh:14000,confirmed:false},
  {score:620,airLow:14000,airHigh:20000,confirmed:false},
  {score:600,airLow:20000,airHigh:35000,confirmed:false},
  {score:580,airLow:35000,airHigh:60000,confirmed:false},
  {score:550,airLow:60000,airHigh:1e5,  confirmed:false},
  {score:520,airLow:1e5,  airHigh:1.6e5,confirmed:false},
  {score:500,airLow:1.6e5,airHigh:2.2e5,confirmed:false},
  {score:470,airLow:2.2e5,airHigh:3e5,  confirmed:false},
  {score:440,airLow:3e5,  airHigh:4e5,  confirmed:false},
  {score:400,airLow:4e5,  airHigh:5.5e5,confirmed:false},
  {score:360,airLow:5.5e5,airHigh:7e5,  confirmed:false},
  {score:300,airLow:7e5,  airHigh:10e5, confirmed:false},
  {score:0,  airLow:10e5, airHigh:14e5, confirmed:false},
];

// Category rank multipliers — reserved category ranks are proportional
// (SC ~15% seats, ST ~7.5%, OBC-NCL ~27% of total seats)
const NEET_CAT_FACTOR = {general:1.0, obc:0.28, sc:0.155, st:0.075, ews:0.1};

function getNeetRank(score, cat){
  const row = NEET_RANK_TABLE.find(r => score >= r.score) || NEET_RANK_TABLE[NEET_RANK_TABLE.length-1];
  const factor = NEET_CAT_FACTOR[cat] || 1.0;
  if(cat === 'general'){
    // Return midpoint of AIR range as a number
    return Math.round((row.airLow + row.airHigh) / 2);
  }
  // For reserved categories, return category rank (not AIR)
  const catMid = Math.round(((row.airLow + row.airHigh) / 2) * factor);
  return Math.max(1, catMid);
}

// Returns {rankRange, airRange, label} for display
function getNeetRankDisplay(score, cat){
  const row = NEET_RANK_TABLE.find(r => score >= r.score) || NEET_RANK_TABLE[NEET_RANK_TABLE.length-1];
  const factor = NEET_CAT_FACTOR[cat] || 1.0;
  const fmt = n => n >= 1e5 ? (n/1e5).toFixed(1)+'L' : n >= 1e3 ? Math.round(n/1e3)+'K' : n;
  if(cat === 'general'){
    return {
      airRange: `${fmt(row.airLow)} – ${fmt(row.airHigh)}`,
      catLabel: 'AIR (General)',
      confirmed: row.confirmed,
    };
  }
  const catLow = Math.max(1, Math.round(row.airLow * factor));
  const catHigh = Math.max(1, Math.round(row.airHigh * factor));
  const label = cat==='obc'?'OBC-NCL Category Rank':cat==='sc'?'SC Category Rank':cat==='st'?'ST Category Rank':'EWS Category Rank';
  return {
    airRange: `${fmt(catLow)} – ${fmt(catHigh)}`,
    catLabel: label,
    confirmed: row.confirmed,
  };
}

// College cutoffs — MCC AIQ 2024 & 2025 counselling data (GOVT/CENTRAL only, no private)
// Sources: MCC NEET UG 2024-25 Round 1-3 allotment data, NTA official result PDFs
const NEET_COLLEGES = [
  {score:710, rank:'Top 10 AIR',
    colleges:[
      'AIIMS New Delhi — MBBS (AIQ closing AIR ~1–10)',
      'JIPMER Puducherry — MBBS (AIQ closing AIR ~1–50)',
    ]
  },
  {score:680, rank:'AIR ~300–700',
    colleges:[
      'AIIMS Jodhpur — MBBS (AIQ closing AIR ~250–450)',
      'AIIMS Bhopal — MBBS (AIQ closing AIR ~300–500)',
      'AIIMS Bhubaneswar — MBBS (AIQ closing AIR ~400–600)',
      'AIIMS Rishikesh — MBBS (AIQ closing AIR ~350–550)',
      'AIIMS Patna — MBBS (AIQ closing AIR ~450–700)',
      'MAMC New Delhi — MBBS (AIQ closing AIR ~500–700)',
    ]
  },
  {score:660, rank:'AIR ~1.5K–3K',
    colleges:[
      'VMMC & Safdarjung Hospital New Delhi (AIQ closing AIR ~800–1,500)',
      'KGMU Lucknow — MBBS (AIQ closing AIR ~1,200–2,000)',
      'GMC Chandigarh — MBBS (AIQ closing AIR ~1,000–1,800)',
      'AIIMS Nagpur — MBBS (AIQ closing AIR ~1,200–2,500)',
      'AIIMS Raipur — MBBS (AIQ closing AIR ~1,000–2,000)',
      'Govt. Medical College Thiruvananthapuram (state AIQ ~1,500–3,000)',
    ]
  },
  {score:640, rank:'AIR ~5.5K–9K',
    colleges:[
      'BHU IMS Varanasi — MBBS (AIQ closing AIR ~3,000–6,000)',
      'SNMC Agra — MBBS (AIQ closing AIR ~5,000–8,000)',
      'Grant Medical College Mumbai (AIQ closing AIR ~5,500–8,500)',
      'Govt. Medical College Nagpur (AIQ closing AIR ~5,000–9,000)',
      'Pt. B.D. Sharma PGIMS Rohtak (AIQ closing AIR ~4,500–7,500)',
      'Madras Medical College Chennai (AIQ closing AIR ~6,000–9,000)',
      'Seth G.S. Medical College Mumbai (AIQ closing AIR ~5,500–8,000)',
    ]
  },
  {score:620, rank:'AIR ~14K–20K',
    colleges:[
      'SMS Medical College Jaipur (AIQ closing AIR ~12,000–18,000)',
      'Govt. Medical College Amritsar (AIQ closing AIR ~14,000–20,000)',
      'R.N.T. Medical College Udaipur (AIQ closing AIR ~15,000–22,000)',
      'Govt. Medical College Thrissur (AIQ closing AIR ~13,000–19,000)',
      'Osmania Medical College Hyderabad (AIQ closing AIR ~12,000–18,000)',
      'Govt. Medical College Kozhikode (AIQ closing AIR ~14,000–20,000)',
      'KGMC Shivpuri / Govt. Bundelkhand MC (AIQ closing AIR ~16,000–22,000)',
    ]
  },
  {score:590, rank:'AIR ~35K–60K',
    colleges:[
      'Govt. Medical College Aurangabad (AIQ closing AIR ~30,000–50,000)',
      'Govt. Medical College Surat (AIQ closing AIR ~35,000–55,000)',
      'Govt. Medical College Baroda Vadodara (AIQ closing AIR ~30,000–45,000)',
      'Govt. Kilpauk Medical College Chennai (AIQ closing AIR ~35,000–60,000)',
      'Govt. Medical College Nanded (AIQ closing AIR ~40,000–60,000)',
      'Govt. Dental College Hyderabad (BDS AIQ closing AIR ~45,000–60,000)',
      'Govt. Dental College Thiruvananthapuram (BDS AIQ closing AIR ~40,000–55,000)',
    ]
  },
  {score:550, rank:'AIR ~60K–1L',
    colleges:[
      'Govt. Medical College Ratlam / Mandsaur MP (state seats, AIR ~60K–85K)',
      'Govt. Medical College Rajnandgaon CG (state seats)',
      'Central Govt. BDS colleges — most seats via AIQ (AIR ~60K–1L)',
      'Govt. AYUSH colleges — BAMS / BHMS / BUMS (AIQ quota)',
    ]
  },
  {score:0, rank:'AIR 2.2L+',
    colleges:[
      'State govt. MBBS colleges — SC/ST/OBC category seats only',
      'Govt. BAMS colleges — Ayurvedic (state quota)',
      'Govt. BHMS colleges — Homeopathy (state quota)',
      'Govt. BUMS colleges — Unani (state quota)',
      'Govt. BDS colleges — Dental SC/ST category seats',
    ]
  },
];

function getNeetColleges(score){
  for(const tier of NEET_COLLEGES){
    if(score >= tier.score) return tier;
  }
  return NEET_COLLEGES[NEET_COLLEGES.length-1];
}

// ══════════════════════════════════════════════════════════════
// JEE Main — Score → Percentile → Rank (June 2026 update)
// Source: NTA JEE Main 2025 session data + JoSAA 2025 Round 6
// ~15.5 lakh unique candidates, ~11L in each session
// 99 percentile ≈ AIR 8K–10K  |  99.9 ≈ AIR ~1K–1.5K
// ══════════════════════════════════════════════════════════════
const JEE_PERCENTILE_DATA = [
  {score:290, pct:99.99, rank:'1–150',       airEst:75},
  {score:265, pct:99.9,  rank:'150–1,500',   airEst:800},
  {score:250, pct:99.7,  rank:'1,500–4,600', airEst:3000},
  {score:230, pct:99.4,  rank:'4,600–9,300', airEst:7000},
  {score:210, pct:99.0,  rank:'9,300–15,500',airEst:12000},
  {score:190, pct:98.5,  rank:'15K–23K',     airEst:19000},
  {score:175, pct:98.0,  rank:'23K–31K',     airEst:27000},
  {score:160, pct:97.5,  rank:'31K–39K',     airEst:35000},
  {score:145, pct:96.5,  rank:'39K–54K',     airEst:46000},
  {score:130, pct:95.0,  rank:'54K–78K',     airEst:66000},
  {score:115, pct:93.0,  rank:'78K–1.1L',    airEst:93000},
  {score:100, pct:90.0,  rank:'1.1L–1.6L',   airEst:130000},
  {score:80,  pct:85.0,  rank:'1.6L–2.3L',   airEst:195000},
  {score:60,  pct:75.0,  rank:'2.3L–3.9L',   airEst:310000},
  {score:40,  pct:60.0,  rank:'3.9L–6.2L',   airEst:500000},
  {score:0,   pct:30.0,  rank:'6.2L+',       airEst:800000},
];

// JoSAA 2024 & 2025 Round 6 General-OS closing ranks (GOVT colleges only — NITs, IIITs, GFTIs)
// Source: JoSAA official allotment data 2024 & 2025
const JEE_NIT_DATA = [
  {pct:99.9,
    inst:[
      'NIT Trichy — CSE (Gen OS closing ~500–700)',
      'NIT Warangal — CSE (Gen OS closing ~500–750)',
      'IIIT Hyderabad — CSE (Gen OS closing ~200–400)',
    ]
  },
  {pct:99.7,
    inst:[
      'NIT Surathkal — CSE (Gen OS closing ~1,000–1,800)',
      'NIT Calicut — CSE (Gen OS closing ~1,200–2,000)',
      'NIT Rourkela — CSE (Gen OS closing ~1,500–2,500)',
      'NIT Warangal — ECE (Gen OS closing ~1,500–2,500)',
      'IIIT Delhi — CSE (Gen OS closing ~1,000–2,000)',
    ]
  },
  {pct:99.4,
    inst:[
      'NIT Jaipur — CSE (Gen OS closing ~2,500–5,000)',
      'NIT Nagpur — CSE (Gen OS closing ~3,000–5,500)',
      'NIT Allahabad — CSE (Gen OS closing ~2,000–4,000)',
      'NIT Trichy — ECE (Gen OS closing ~2,500–4,500)',
      'IIIT Allahabad — CSE (Gen OS closing ~2,500–5,000)',
      'IIIT Gwalior — CSE (Gen OS closing ~3,000–5,500)',
    ]
  },
  {pct:99.0,
    inst:[
      'NIT Jaipur — ECE / Mechanical (Gen OS closing ~5,000–10,000)',
      'NIT Patna — CSE (Gen OS closing ~5,000–9,000)',
      'NIT Surat — CSE (Gen OS closing ~6,000–10,000)',
      'NIT Hamirpur — CSE (Gen OS closing ~5,500–9,500)',
      'IIIT Jabalpur — CSE (Gen OS closing ~6,000–10,000)',
      'IIIT Kancheepuram — CSE (Gen OS closing ~5,000–9,000)',
    ]
  },
  {pct:98.0,
    inst:[
      'NIT Patna — ECE / Mechanical (Gen OS closing ~10,000–20,000)',
      'NIT Srinagar — CSE (Gen OS closing ~10,000–18,000)',
      'NIT Agartala — CSE (Gen OS closing ~12,000–20,000)',
      'IIIT Lucknow — CSE (Gen OS closing ~10,000–18,000)',
      'IIIT Vadodara — CSE (Gen OS closing ~11,000–20,000)',
      'IIIT Una — CSE (Gen OS closing ~12,000–22,000)',
    ]
  },
  {pct:96.5,
    inst:[
      'NIT Mizoram / NIT Meghalaya / NIT Sikkim — CSE (Gen OS ~20,000–40,000)',
      'NIT Calicut / Surathkal — Civil / Mechanical (Gen OS ~20,000–38,000)',
      'IIIT Kota / IIIT Manipur — CSE (Gen OS ~22,000–40,000)',
      'IIIT Agartala / IIIT Srirangam — CSE (Gen OS ~25,000–40,000)',
      'NIT Arunachal / NIT Manipur — all branches (Gen OS ~25,000–45,000)',
    ]
  },
  {pct:93.4,
    inst:[
      'JoSAA 2026 qualifying cutoff — NIT / IIIT / GFTI eligibility',
      'GFTI: Assam University, Tezpur — all branches (Gen OS ~40,000–1L)',
      'GFTI: BIT Mesra Ranchi — all branches (Gen OS ~40,000–80,000)',
      'GFTI: IIEST Shibpur — all branches (Gen OS ~35,000–80,000)',
      'GFTI: NIFFT Ranchi / GSITS Indore (Gen OS ~50,000–1L)',
    ]
  },
  {pct:90.0,
    inst:[
      'GFTIs: J.K. Institute Allahabad / School of Planning & Architecture Delhi',
      'GFTIs: Sant Longowal Institute of Engg. & Tech. (SLIET)',
      'Lower-tier NITs — Civil/Mining/Metallurgy (Gen OS ~1L–1.6L)',
      'IIIT (newer campuses) — non-CS branches (Gen OS ~1L–1.5L)',
    ]
  },
  {pct:75.0,
    inst:[
      'State govt. engineering colleges (via JEE Main score, state counselling)',
      'GFTIs with higher closing ranks (Gen OS ~1.6L+)',
    ]
  },
];

function getJeePercentile(score){
  for(let i=0;i<JEE_PERCENTILE_DATA.length;i++){
    if(score >= JEE_PERCENTILE_DATA[i].score) return JEE_PERCENTILE_DATA[i];
  }
  return JEE_PERCENTILE_DATA[JEE_PERCENTILE_DATA.length-1];
}

function getJeeCollege(pct){
  for(const d of JEE_NIT_DATA){
    if(pct >= d.pct) return Array.isArray(d.inst) ? d.inst : [d.inst];
  }
  return ['State engineering colleges via JEE score (state counselling)'];
}

// ══════════════════════════════════════════════════════════════
// FEATURE 1: MISTAKE LOGBOOK
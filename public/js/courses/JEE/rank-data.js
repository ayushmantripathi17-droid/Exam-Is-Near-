// JEE rank predictor — percentile bands, NIT/college cutoffs.
// Split out of the former public/js/features/neetjee-hub-data.js during the course-isolation refactor.
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

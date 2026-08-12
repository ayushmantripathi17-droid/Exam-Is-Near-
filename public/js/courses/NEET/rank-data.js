// NEET rank predictor — chapter weightage, AIR rank table, college cutoffs.
// Split out of the former public/js/features/neetjee-hub-data.js during the course-isolation refactor.
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

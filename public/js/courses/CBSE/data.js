// CBSE — Class 10/11/12 subject data, stream selection, and derived subject lists.
// Split out of the former public/js/data/subjects.js during the course-isolation refactor.
// ══════════════════════════════════════════════════════════════
// CBSE CLASS 10 SUBJECTS
// ══════════════════════════════════════════════════════════════
const SUBJECTS_CBSE10 = [
  {id:"c10-math",name:"Mathematics",code:"CBSE 10",exam:"Mar 2026",color:"#FFE66D",icon:"📐",units:[
    {id:"u1",name:"Number Systems & Algebra",topics:["Real Numbers: Euclid's Division Lemma, Fundamental Theorem of Arithmetic","Irrational Numbers: Proof of irrationality of √2, √3","Polynomials: Zeros of polynomial, Relationship between zeros & coefficients","Pair of Linear Equations: Graphical & Algebraic methods (substitution, elimination, cross-multiplication)","Quadratic Equations: Factorisation, Completing the square, Quadratic formula, Discriminant","Arithmetic Progressions: nth term, Sum of n terms, Applications"]},
    {id:"u2",name:"Coordinate Geometry & Geometry",topics:["Coordinate Geometry: Distance formula, Section formula, Area of triangle","Triangles: Similarity criteria (AA, SAS, SSS), Basic Proportionality Theorem, Pythagoras Theorem","Circles: Tangent to a circle, Number of tangents from external point","Constructions: Division of line segment, Tangents to a circle"]},
    {id:"u3",name:"Trigonometry & Mensuration",topics:["Introduction to Trigonometry: Trigonometric ratios, Complementary angles, Trigonometric identities","Heights & Distances: Angle of elevation, Angle of depression, Applications","Areas Related to Circles: Perimeter & Area of circle, Sector, Segment","Surface Areas & Volumes: Combination of solids, Conversion of solids, Frustum of cone"]},
    {id:"u4",name:"Statistics & Probability",topics:["Statistics: Mean by direct, assumed mean & step-deviation methods","Median: Cumulative frequency, Ogive","Mode: Modal class","Probability: Classical definition, Simple problems on single events"]},
  ]},
  {id:"c10-sci",name:"Science",code:"CBSE 10",exam:"Mar 2026",color:"#06D6A0",icon:"🔬",units:[
    {id:"u1",name:"Physics",topics:["Light: Reflection (spherical mirrors, mirror formula), Refraction (Snell's law, lens formula, power)","Human Eye: Structure, Defects of vision and corrections, Dispersion, Scattering","Electricity: Ohm's Law, Resistance (series & parallel), Heating effect (Joule's law), Power","Magnetic Effects: Magnetic field lines, Force on conductor, Fleming's rules, Electric motor, Electromagnetic induction, AC vs DC, Generator"]},
    {id:"u2",name:"Chemistry",topics:["Chemical Reactions: Types (combination, decomposition, displacement, double displacement, oxidation-reduction)","Acids, Bases & Salts: Properties, pH, Neutralisation, Common salts (NaOH, NaHCO₃, Na₂CO₃, Bleaching powder, Plaster of Paris)","Metals & Non-metals: Properties, Reactivity series, Extraction (corrosion)","Carbon Compounds: Covalent bonding, Homologous series, Nomenclature, Functional groups, Ethanol & Ethanoic acid, Soaps & Detergents","Periodic Classification: Mendeleev's periodic table, Modern periodic law, Trends in properties"]},
    {id:"u3",name:"Biology",topics:["Life Processes: Nutrition (autotrophic & heterotrophic), Respiration (aerobic & anaerobic), Transportation (heart, blood, lymph, stomata, xylem, phloem), Excretion (kidney, dialysis, plants)","Control & Coordination: Nervous system (reflex arc, brain, spinal cord), Chemical coordination (hormones — adrenaline, insulin, thyroxin, growth hormone)","How do Organisms Reproduce: Asexual (fission, budding, spore formation, vegetative), Sexual (flowers, pollination, fertilisation, human reproduction)","Heredity & Evolution: Mendelian inheritance, Sex determination, Acquired vs inherited traits, Evolution (speciation, homologous & analogous organs, fossils)","Our Environment: Food chains, Ozone layer, Management of garbage, Ecosystems","Management of Natural Resources: Conservation of forests, water management, coal & petroleum, stakeholders"]},
  ]},
  {id:"c10-eng",name:"English",code:"CBSE 10",exam:"Mar 2026",color:"#C77DFF",icon:"📖",units:[
    {id:"u1",name:"First Flight — Prose",topics:["A Letter to God","Nelson Mandela: Long Walk to Freedom","Two Stories about Flying (His First Flight / Black Aeroplane)","From the Diary of Anne Frank","The Hundred Dresses I & II","Glimpses of India (Baker from Goa / Coorg / Tea from Assam)","Madam Rides the Bus","The Sermon at Benares","The Proposal (Play)"]},
    {id:"u2",name:"First Flight — Poetry",topics:["Dust of Snow","Fire and Ice","A Tiger in the Zoo","How to Tell Wild Animals","The Ball Poem","Amanda","Animals","The Trees","Fog","The Tale of Custard the Dragon","For Anne Gregory"]},
    {id:"u3",name:"Footprints without Feet — Supplementary",topics:["A Triumph of Surgery","The Thief's Story","The Midnight Visitor","A Question of Trust","Footprints without Feet","The Making of a Scientist","The Necklace","The Hack Driver","Bholi","The Book That Saved the Earth"]},
    {id:"u4",name:"Writing & Grammar",topics:["Formal Letter Writing: Complaint, Enquiry, Application","Analytical Paragraph & Diary Entry","Notice Writing","Tenses: Present, Past, Future (all forms)","Modals, Determiners, Subject-Verb Agreement","Active & Passive Voice","Reported Speech (Direct to Indirect)","Editing & Omission Exercises"]},
  ]},
  {id:"c10-sst",name:"Social Science",code:"CBSE 10",exam:"Mar 2026",color:"#FF6B35",icon:"🌍",units:[
    {id:"u1",name:"History — India & Contemporary World II",topics:["The Rise of Nationalism in Europe (Frederic Sorrieu, Unification of Germany & Italy)","Nationalism in India (Non-Cooperation, Civil Disobedience, Simon Commission, Round Table)","The Making of a Global World (Silk Routes, Great Depression)","The Age of Industrialisation (Factory system, Britain & India)","Print Culture and the Modern World (Gutenberg, Indian print culture)"]},
    {id:"u2",name:"Geography — Contemporary India II",topics:["Resources & Development (Soil types, Land degradation, Conservation)","Forest & Wildlife Resources (Types of forests, Conservation, Biosphere reserves)","Water Resources (Rivers, Dams, Rainwater harvesting)","Agriculture (Types, Crops, Green Revolution, Food security)","Minerals & Energy Resources (Types, Distribution, Conservation)","Manufacturing Industries (Agro, Mineral, Chemical, IT)","Lifelines of National Economy (Transport, Communication, Trade)"]},
    {id:"u3",name:"Political Science — Democratic Politics II",topics:["Power Sharing (Belgium & Sri Lanka models)","Federalism (Indian federalism, Decentralisation)","Gender, Religion & Caste (Social divisions in democracy)","Political Parties (Functions, Types, Challenges, Reform)","Outcomes of Democracy (Features, Challenges, Deepening democracy)"]},
    {id:"u4",name:"Economics — Understanding Economic Development",topics:["Development (National income, Per capita income, HDI)","Sectors of the Indian Economy (Primary, Secondary, Tertiary; Organised vs Unorganised)","Money and Credit (Formal & Informal credit, Self-Help Groups)","Globalisation and the Indian Economy (MNCs, WTO, Impacts)","Consumer Rights (Rights, COPRA, Consumer Court)"]},
  ]},
  {id:"c10-hindi",name:"Hindi",code:"CBSE 10",exam:"Mar 2026",color:"#4ECDC4",icon:"🇮🇳",units:[
    {id:"u1",name:"क्षितिज — गद्य खंड",topics:["नेताजी का चश्मा — स्वयं प्रकाश","बालगोबिन भगत — रामवृक्ष बेनीपुरी","लखनवी अंदाज़ — यशपाल","एही ठैयाँ झुलनी हेरानी हो रामा — शिवप्रसाद मिश्र रुद्र","नौबतखाने में इबादत — यतींद्र मिश्र","संस्कृति — भदंत आनंद कौसल्यायन","माता का आँचल — शिवपूजन सहाय","जॉर्ज पंचम की नाक — कमलेश्वर"]},
    {id:"u2",name:"क्षितिज — काव्य खंड",topics:["सूरदास — पद","तुलसीदास — राम-लक्ष्मण-परशुराम संवाद","देव — सवैया और कवित्त","जयशंकर प्रसाद — आत्मकथ्य","सूर्यकांत त्रिपाठी निराला — उत्साह, अट नहीं रही है","नागार्जुन — यह दंतुरित मुसकान, फसल","गिरिजाकुमार माथुर — छाया मत छूना","ऋतुराज — कन्यादान","मंगलेश डबराल — संगतकार"]},
    {id:"u3",name:"कृतिका — पूरक पाठ्यपुस्तक",topics:["माता का आँचल","जॉर्ज पंचम की नाक","साना-साना हाथ जोड़ि...","एही ठैयाँ झुलनी हेरानी हो रामा","मैं क्यों लिखता हूँ"]},
    {id:"u4",name:"व्याकरण और लेखन",topics:["पद परिचय (संज्ञा, सर्वनाम, विशेषण, क्रिया, अव्यय)","वाच्य (कर्तृवाच्य, कर्मवाच्य, भाववाच्य)","रस (श्रृंगार, वीर, करुण, हास्य, रौद्र, शांत)","अलंकार (उपमा, रूपक, उत्प्रेक्षा, मानवीकरण, अतिशयोक्ति)","निबंध लेखन, पत्र लेखन, अनुच्छेद लेखन"]},
  ]},
];

// ══════════════════════════════════════════════════════════════
// CBSE CLASS 12 — STREAM-BASED SUBJECTS
// ══════════════════════════════════════════════════════════════
// Shared subjects across streams
const _C12_MATH = {id:"c12-math",name:"Mathematics",code:"CBSE 12",exam:"Mar 2026",color:"#FFE66D",icon:"📐",units:[
  {id:"u1",name:"Relations, Functions & Algebra",topics:["Relations & Functions: Types, Composition, Inverse","Inverse Trigonometric Functions: Principal value, Properties","Matrices: Types, Operations, Transpose, Symmetric, Skew-symmetric","Determinants: Properties, Cofactors, Adjoint, Inverse, Area of triangle","Linear Programming: Graphical method, Corner point theorem, Feasibility region"]},
  {id:"u2",name:"Calculus",topics:["Continuity & Differentiability: Composite, Implicit, Inverse functions","Differentiation: Logarithmic, Parametric, Second-order derivatives, Rolle's Theorem, LMVT","Applications of Derivatives: Rate of change, Increasing/Decreasing, Tangents & Normals, Maxima & Minima","Integrals: Substitution, Partial fractions, Integration by parts, Definite integrals (properties, King's)","Applications of Integrals: Area bounded by curves","Differential Equations: Order, Degree, Variable separable, Homogeneous, Linear ODE"]},
  {id:"u3",name:"Vectors & 3D Geometry",topics:["Vectors: Addition, Dot product, Cross product, Scalar triple product","3D Geometry: Direction cosines & ratios, Equation of line (vector & Cartesian)","Planes: Equation, Distance of a point, Angle between planes, Skew lines"]},
  {id:"u4",name:"Probability",topics:["Conditional Probability, Multiplication theorem, Independence of Events","Bayes' Theorem: Total probability, Posterior probability","Random Variables: Discrete distribution, Mean, Variance","Binomial Distribution: Mean=np, Variance=npq, Applications"]},
]};
const _C12_PHY = {id:"c12-phy",name:"Physics",code:"CBSE 12",exam:"Mar 2026",color:"#FF6B35",icon:"⚛️",units:[
  {id:"u1",name:"Electrostatics & Current Electricity",topics:["Electric Charges & Fields: Coulomb's law, Gauss's law, Dipole","Electrostatic Potential & Capacitance: Parallel plate, Dielectric, Series & Parallel","Current Electricity: Ohm's law, Kirchhoff's laws, Wheatstone bridge, Potentiometer"]},
  {id:"u2",name:"Magnetic Effects & EMI",topics:["Moving Charges & Magnetism: Biot-Savart, Ampere's law, Force on conductor, Galvanometer","Magnetism & Matter: Earth's magnetism, Diamagnetic, Paramagnetic, Ferromagnetic","Electromagnetic Induction: Faraday's & Lenz's law, Motional EMF, Self & Mutual inductance","AC Circuits: Phasor diagrams, LCR resonance, Quality factor, Transformers"]},
  {id:"u3",name:"Optics & Dual Nature",topics:["Ray Optics: Lens formula, Lens maker's equation, Prism, Optical instruments","Wave Optics: Huygens' principle, Interference (YDSE), Diffraction, Polarisation","Dual Nature: Photoelectric effect (Einstein), de Broglie, Davisson-Germer experiment"]},
  {id:"u4",name:"Modern Physics",topics:["Atoms: Bohr's model, Energy levels, Hydrogen spectrum","Nuclei: Mass defect, Binding energy, Radioactivity (α,β,γ), Half-life, Fission & Fusion","Semiconductor Electronics: p-n junction, Diode, Zener, LED, Transistor (CE amplifier), Logic gates","Communication Systems: Modulation (AM, FM), Bandwidth, Propagation of EM waves"]},
]};
const _C12_CHEM = {id:"c12-chem",name:"Chemistry",code:"CBSE 12",exam:"Mar 2026",color:"#4ECDC4",icon:"🧪",units:[
  {id:"u1",name:"Physical Chemistry",topics:["Solutions: Raoult's law, Colligative properties, Van't Hoff factor","Electrochemistry: Conductance, Nernst equation, Batteries, Faraday's laws","Chemical Kinetics: Rate law, Order, Arrhenius equation, Activation energy","Surface Chemistry: Adsorption, Catalysis, Colloids, Emulsions"]},
  {id:"u2",name:"Inorganic Chemistry",topics:["Metallurgy: Ores, Extraction, Refining methods","p-Block Elements (15-18): Properties, Allotropes, Key compounds","d & f-Block Elements: Transition metals, K₂Cr₂O₇, KMnO₄; Lanthanides & Actinides","Coordination Compounds: IUPAC, VBT, CFT, Isomerism, Colour & magnetism"]},
  {id:"u3",name:"Organic Chemistry",topics:["Haloalkanes & Haloarenes: SN1, SN2 mechanisms, Optical isomerism","Alcohols, Phenols & Ethers: Acidity comparison, Key reactions","Aldehydes, Ketones & Carboxylic Acids: Nucleophilic addition, Aldol, Cannizzaro","Amines: Basicity, Diazonium salt reactions"]},
  {id:"u4",name:"Biomolecules & Everyday Chemistry",topics:["Biomolecules: Carbohydrates, Proteins (structure, denaturation), Nucleic acids","Polymers: Addition, Condensation; Nylon-6,6, Polyester, Bakelite, Rubber","Chemistry in Everyday Life: Drugs (analgesics, antibiotics, antacids), Cleansing agents"]},
]};
const _C12_BIO = {id:"c12-bio",name:"Biology",code:"CBSE 12",exam:"Mar 2026",color:"#06D6A0",icon:"🧬",units:[
  {id:"u1",name:"Reproduction",topics:["Reproduction in Organisms: Asexual & Sexual reproduction life cycles","Sexual Reproduction in Flowering Plants: Microsporogenesis, Megasporogenesis, Double fertilisation, Apomixis","Human Reproduction: Gametogenesis, Menstrual cycle, Embryonic development, Parturition, Lactation","Reproductive Health: STDs, Contraceptives, MTP, Amniocentesis, ART (IVF, ZIFT, GIFT)"]},
  {id:"u2",name:"Genetics & Evolution",topics:["Inheritance & Variation: Mendel's laws, Incomplete dominance, Codominance, Multiple alleles, Chromosomal theory","Molecular Basis: DNA structure, Replication (semi-conservative), Transcription, Genetic code, Translation, Lac operon, HGP, DNA fingerprinting","Evolution: Origin of life, Darwin, Modern Synthetic Theory, Hardy-Weinberg, Human evolution"]},
  {id:"u3",name:"Biology in Human Welfare & Biotechnology",topics:["Human Health & Disease: Innate & Acquired immunity, Vaccines, Cancer, AIDS, Drug abuse","Food Production: Plant breeding (HYV), Tissue culture, Animal husbandry, SCP","Microbes: Sewage treatment, Biogas, Biocontrol, Biofertilisers","Biotechnology: rDNA, PCR, ELISA, GM crops (Bt cotton, Golden rice), Gene therapy, Biosafety"]},
  {id:"u4",name:"Ecology",topics:["Organisms & Populations: Niche, Population growth (J & S curves), Population interactions","Ecosystem: Food chains, Energy flow, 10% law, Biogeochemical cycles, Succession","Biodiversity: Types, Hotspots, Conservation (in-situ & ex-situ)","Environmental Issues: Pollution, Biomagnification, Ozone depletion, Global warming, Chipko movement"]},
]};
const _C12_ENG = {id:"c12-eng",name:"English Core",code:"CBSE 12",exam:"Mar 2026",color:"#C77DFF",icon:"📖",units:[
  {id:"u1",name:"Flamingo — Prose",topics:["The Last Lesson — Alphonse Daudet","Lost Spring — Anees Jung","Deep Water — William Douglas","The Rattrap — Selma Lagerlöf","Indigo — Louis Fischer","Poets and Pancakes — Asokamitran","The Interview","Going Places — A.R. Barton"]},
  {id:"u2",name:"Flamingo — Poetry",topics:["My Mother at Sixty-six — Kamala Das","An Elementary School Classroom in a Slum — Stephen Spender","Keeping Quiet — Pablo Neruda","A Thing of Beauty — John Keats","A Roadside Stand — Robert Frost","Aunt Jennifer's Tigers — Adrienne Rich"]},
  {id:"u3",name:"Vistas — Supplementary",topics:["The Third Level — Jack Finney","The Tiger King — Kalki","Journey to the End of the Earth — Tishani Doshi","The Enemy — Pearl S. Buck","Should Wizard Hit Mommy?","On the Face of It — Susan Hill","Evans Tries an O-level — Colin Dexter","Memories of Childhood — Zitkala-Sa / Bama"]},
  {id:"u4",name:"Writing Skills & Grammar",topics:["Notice / Advertisement / Poster Writing","Formal Letter Writing: Complaint, Enquiry, Job application with bio-data","Report Writing & Article Writing, Speech & Debate","Grammar: Tenses, Modals, Voice, Narration, Clauses, Prepositions"]},
]};
const _C12_ECO = {id:"c12-eco",name:"Economics",code:"CBSE 12",exam:"Mar 2026",color:"#FF6B35",icon:"📊",units:[
  {id:"u1",name:"Introductory Microeconomics",topics:["Introduction: Basic problems, PPC, Opportunity cost","Consumer Equilibrium: Utility analysis (MU), Indifference curve, Budget line","Demand: Law of demand, Determinants, Elasticity (price, income, cross)","Production & Costs: Production function, Returns to a factor, TC/TVC/TFC/AC/MC","Revenue: TR, AR, MR concepts","Market Forms: Perfect competition, Monopoly, Monopolistic competition, Oligopoly; Equilibrium of firm"]},
  {id:"u2",name:"Introductory Macroeconomics",topics:["National Income: Circular flow, GDP/GNP/NDP/NNP, Methods (Value added, Income, Expenditure)","Money & Banking: Functions of money, Commercial banks (credit creation), RBI, Monetary policy","Income & Employment: AD-AS, Consumption function, Multiplier, Inflationary & Deflationary gap","Government Budget: Revenue vs Capital, Fiscal deficit, Revenue deficit, Primary deficit","Balance of Payments: Current & Capital account, Exchange rate, Devaluation"]},
]};
const _C12_ACC = {id:"c12-acc",name:"Accountancy",code:"CBSE 12",exam:"Mar 2026",color:"#FFE66D",icon:"🧾",units:[
  {id:"u1",name:"Partnership Accounts",topics:["Partnership: Fundamentals, Fixed vs Fluctuating capital","Goodwill: Meaning, Nature, Factors, Methods of valuation (Average Profit, Super Profit, Capitalisation)","Admission of Partner: Adjustment of capital, New profit sharing ratio, Sacrificing ratio, Revaluation","Retirement / Death of Partner: Gaining ratio, Adjustment of capital, Executors account"]},
  {id:"u2",name:"Reconstitution & Dissolution",topics:["Change in Profit Sharing Ratio: Revaluation, Capital adjustment","Dissolution of Partnership: Settlement of accounts, Realisation account, Piecemeal distribution","Company Accounts: Issue of shares (at par, premium, discount), Forfeiture, Reissue","Debentures: Issue, Redemption (out of profits, sinking fund, purchase in open market)"]},
  {id:"u3",name:"Financial Statements Analysis",topics:["Financial Statements: P&L account, Balance sheet — meaning, objectives, limitations","Tools of Analysis: Comparative statements, Common size statements","Ratio Analysis: Liquidity (Current, Quick), Solvency (Debt-Equity, Interest Coverage), Profitability (GP, NP, Return on Investment), Activity (Inventory, Debtors, Creditors turnover)"]},
  {id:"u4",name:"Cash Flow Statement",topics:["Cash Flow Statement: Objectives, Benefits, Limitations","Operating Activities: Indirect method adjustments","Investing Activities: Purchase/sale of assets","Financing Activities: Issue of shares, Debentures, Dividends paid","Preparation of complete Cash Flow Statement (AS-3)"]},
]};
const _C12_BS = {id:"c12-bs",name:"Business Studies",code:"CBSE 12",exam:"Mar 2026",color:"#06D6A0",icon:"💼",units:[
  {id:"u1",name:"Nature & Principles of Management",topics:["Nature of Management: Concept, Importance, Functions, Levels of management","Principles of Management: Fayol's 14 principles, Taylor's Scientific Management — principles & techniques","Business Environment: Concept, Dimensions (PESTLE), Demonetisation, Privatisation, Globalisation impact"]},
  {id:"u2",name:"Planning & Organising",topics:["Planning: Concept, Features, Importance, Limitations, Process, Types of plans (Objectives, Strategy, Policy, Procedure, Method, Rule, Budget, Programme)","Organising: Concept, Importance, Process, Formal & Informal organisation, Delegation, Decentralisation","Organisation Structure: Functional, Divisional, Formal vs Informal — merits & demerits"]},
  {id:"u3",name:"Staffing, Directing & Controlling",topics:["Staffing: Concept, Need, Process — Recruitment, Selection, Training & Development","Directing: Concept, Elements — Supervision, Motivation (Maslow, Financial & Non-financial incentives), Leadership (styles), Communication (formal & informal, barriers)","Controlling: Concept, Importance, Steps in control process, Relationship with planning"]},
  {id:"u4",name:"Financial & Marketing Management",topics:["Financial Management: Financial decisions — Financing, Investment, Dividend; Financial Planning, Capital structure, Fixed & Working capital","Financial Markets: Money market (instruments), Capital market (primary & secondary, stock exchange, SEBI)","Marketing Management: Concept, Functions, Marketing mix (4Ps), Product life cycle, Branding, Packaging, Channels of distribution","Consumer Protection: Consumer rights, COPRA, Consumer courts, Consumer awareness"]},
]};
const _C12_HIST = {id:"c12-hist",name:"History",code:"CBSE 12",exam:"Mar 2026",color:"#FF6B35",icon:"🏛️",units:[
  {id:"u1",name:"Early India",topics:["Bricks, Beads & Bones: Harappan Civilisation — urbanism, economy, society, decline","Kings, Farmers & Towns: Early states & economies (600 BCE – 600 CE)","Kinship, Caste & Class: Early societies — Mahabharata, social order","Thinkers, Beliefs & Buildings: Buddhism, Jainism, Bhakti-Sufi traditions, temple architecture"]},
  {id:"u2",name:"Medieval India",topics:["Through the Eyes of Travellers: Al-Biruni, Ibn Battuta, Francois Bernier — perceptions of society","Bhakti-Sufi Traditions: Religious reforms, Kabir, Mirabai, Guru Nanak","An Imperial Capital: Vijayanagara empire — architecture, society, economy","Peasants, Zamindars & the State: Agrarian society under Mughal Empire"]},
  {id:"u3",name:"Mughal Empire & Colonial India",topics:["Kings and Chronicles: Mughal court, Administrative system, Ain-i-Akbari","Colonialism & Countryside: Settlements, change in agrarian relations (Bengal, Deccan)","Rebels & the Raj: Revolt of 1857 — causes, spread, aftermath","Colonial Cities: Urbanisation, architecture, public space"]},
  {id:"u4",name:"Freedom Struggle & Constitution",topics:["Mahatma Gandhi & the Nationalist Movement: Civil Disobedience, Quit India, Partition","Understanding Partition: Communalism, violence, displacement","Framing the Constitution: Constituent Assembly debates, Fundamental Rights, Directive Principles"]},
]};
const _C12_POL = {id:"c12-pol",name:"Political Science",code:"CBSE 12",exam:"Mar 2026",color:"#4ECDC4",icon:"🗳️",units:[
  {id:"u1",name:"Contemporary World Politics",topics:["The Cold War Era: Bipolarity, Arms race, Non-Aligned Movement, End of Cold War","The End of Bipolarity: Soviet disintegration, New Russian Republic, Challenges of transition","US Hegemony: US dominance, Resistance to hegemony, India-US relations","Alternative Centres of Power: European Union, ASEAN, China's rise"]},
  {id:"u2",name:"Contemporary World Politics II",topics:["South Asia & Contemporary World: SAARC, Conflicts & cooperation in South Asia","International Organisations: UN, reform of UN, Other organisations (IMF, World Bank, WTO)","Security in Contemporary World: Traditional & non-traditional security, Terrorism, Human security","Environment & Natural Resources: Global commons, Agenda 21, India's stand","Globalisation: Debate on globalisation, India & globalisation"]},
  {id:"u3",name:"Politics in India since Independence",topics:["Challenges of Nation Building: Partition, Integration of princely states, Reorganisation of states","Era of One-Party Dominance: Congress dominance, Electoral competition, Nature of Congress dominance","Politics of Planned Development: Land reform, Green Revolution, India's development model"]},
  {id:"u4",name:"Indian Politics since 1970s",topics:["India's External Relations: Relations with China, Pakistan, USA, USSR","Crisis of the Constitutional Order: Emergency, 1975, Lessons of Emergency","Rise of New Social Movements: Farmer movements, Women's movement, Anti-liquor movement","Recent Developments in Indian Politics: Coalition era, BJP rise, Regional parties, Issues of governance"]},
]};
const _C12_GEO = {id:"c12-geo",name:"Geography",code:"CBSE 12",exam:"Mar 2026",color:"#06D6A0",icon:"🌍",units:[
  {id:"u1",name:"Human Geography — Fundamentals",topics:["Human Geography: Nature & Scope, Fields of human geography","People: Population distribution, density, growth, composition","Human Development: Concept, HDI, levels of human development"]},
  {id:"u2",name:"Human Activities & Settlements",topics:["Primary Activities: Gathering, Pastoralism, Mining, Agriculture (subsistence, commercial, plantation)","Secondary Activities: Manufacturing — types, factors of location, major industries","Tertiary & Quaternary Activities: Trade, Transport, Communication, Services","Transport & Communication: Roads, Railways, Airways, Waterways, Pipelines, Internet","International Trade: Basis, Volume, Direction, WTO","Human Settlements: Rural (types), Urban (growth, problems, urbanisation)"]},
  {id:"u3",name:"India — People & Economy I",topics:["Population: Distribution, density, growth, composition (rural-urban, age-sex structure), Migration, NPP 2000","Human Settlements: Rural, Urban, Smart Cities","Land Resources: Land use, Degradation, Conservation","Water Resources: Distribution, Availability, Conservation, Rainwater harvesting","Mineral & Energy Resources: Distribution, Conservation, Non-conventional energy"]},
  {id:"u4",name:"India — People & Economy II",topics:["Agriculture: Cropping patterns, Major crops, Organic farming, Food security, Green Revolution","Manufacturing Industries: Agro-based, Mineral-based, Chemical, Consumer goods, IT","Planning & Sustainable Development: Regional imbalances, Sustainable development, Backward regions","Transport, Communication & Trade: Road, Rail, Air, Water; Communication; International trade","Geographical Perspective on Selected Issues: Land degradation, Water scarcity, Urban waste"]},
]};
const _C12_PSYC = {id:"c12-psyc",name:"Psychology",code:"CBSE 12",exam:"Mar 2026",color:"#C77DFF",icon:"🧠",units:[
  {id:"u1",name:"Intelligence, Personality & Self",topics:["Variations in Psychological Attributes: Theories of intelligence (Gardner, Sternberg), Assessment","Self & Personality: Self concept, Theories of personality (Freud, Rogers, Bandura, Trait theories), Assessment methods (Rorschach, TAT, self report)","Meeting Life Challenges: Stress — nature, sources, effects, coping strategies, promotion of well-being"]},
  {id:"u2",name:"Psychological Disorders & Therapy",topics:["Psychological Disorders: Concept, Classification (DSM-5), Types (Anxiety, OCD, PTSD, Somatic, Dissociative, Depressive, Schizophrenia, Substance use)","Therapeutic Approaches: Psychotherapy (psychodynamic, behavioural, cognitive, humanistic), Biomedical, Alternative therapies, Rehabilitation"]},
  {id:"u3",name:"Social & Applied Psychology",topics:["Attitude & Social Cognition: Attitudes — formation, measurement, change, prejudice, stereotypes, social cognition","Social Influence: Conformity, compliance, obedience; Social loafing; Group dynamics; De-individuation","Interpersonal Relations: Attraction, Prosocial behaviour, Aggression, Conflict, Cooperation"]},
  {id:"u4",name:"Applied Psychology",topics:["Environment & Psychology: Human-environment interaction, Environmental stress, Pro-environmental behaviour","Psychology & Life: Work, Health, Sports, Media — application of psychology","Developing Psychological Skills: Observation, Interview, Counselling, Communication"]},
]};
const _C12_SOCIO = {id:"c12-socio",name:"Sociology",code:"CBSE 12",exam:"Mar 2026",color:"#FF6B35",icon:"👥",units:[
  {id:"u1",name:"Indian Society",topics:["Introducing Indian Society: Colonial impact, demography, structure","Social Institutions: Family, Kinship, Marriage — diversity and change","Social Stratification: Caste & Class in India, Untouchability","Tribal Societies: Diversity, Marginalization, Development issues"]},
  {id:"u2",name:"Change & Development in India",topics:["Structural Change: Colonialism, Industrialisation, Urbanisation","Cultural Change: Modernisation, Westernisation, Sanskritisation","Change & Development in Rural Society: Land reforms, Green Revolution, Agrarian distress","Change & Development in Industrial Society: Industrialisation, Labour movements, Deindustrialisation"]},
  {id:"u3",name:"Social Movements & Issues",topics:["Social Movements in India: Peasant, Women, Dalit, Environmental movements, Regionalism","Mass Media & Communications: Nature, ownership, impact on society","Social Movements: New social movements — characteristics, significance"]},
  {id:"u4",name:"Current Social Issues",topics:["Communalism, Secularism & Nationalism: Meanings, Communal violence, Secularism in India","Demography: Population growth, Fertility, Mortality, Migration, Urbanisation trends","Social exclusion, Rights-Based Movements, Globalisation & Social Change"]},
]};

// Stream-based subject packs
const CBSE12_STREAMS = {
  science_pcm: {
    label: "🔬 Science — PCM (Physics, Chemistry, Maths)",
    desc: "Physics · Chemistry · Mathematics + English Core",
    subjects: [_C12_PHY, _C12_CHEM, _C12_MATH, _C12_ENG],
  },
  science_pcb: {
    label: "🧬 Science — PCB (Physics, Chemistry, Biology)",
    desc: "Physics · Chemistry · Biology + English Core",
    subjects: [_C12_PHY, _C12_CHEM, _C12_BIO, _C12_ENG],
  },
  science_pcmb: {
    label: "🔭 Science — PCMB (All four)",
    desc: "Physics · Chemistry · Maths · Biology + English Core",
    subjects: [_C12_PHY, _C12_CHEM, _C12_MATH, _C12_BIO, _C12_ENG],
  },
  commerce: {
    label: "💼 Commerce",
    desc: "Accountancy · Business Studies · Economics · Maths + English Core",
    subjects: [_C12_ACC, _C12_BS, _C12_ECO, _C12_MATH, _C12_ENG],
  },
  arts: {
    label: "🎨 Arts / Humanities",
    desc: "History · Political Science · Geography · Psychology · Sociology + English Core",
    subjects: [_C12_HIST, _C12_POL, _C12_GEO, _C12_PSYC, _C12_SOCIO, _C12_ENG],
  },
};

// ══════════════════════════════════════════════════════════════
// CBSE CLASS 11 — STREAM-BASED SUBJECTS
// ══════════════════════════════════════════════════════════════
const _C11_MATH = {id:"c11-math",name:"Mathematics",code:"CBSE 11",exam:"Mar 2027",color:"#FFE66D",icon:"📐",units:[
  {id:"u1",name:"Sets, Functions & Algebra",topics:["Sets: Types, Venn diagrams, Union, Intersection, Complement","Relations & Functions: Cartesian product, Domain, Range, Types of functions","Trigonometric Functions: Angles, Identities, Trigonometric equations","Complex Numbers & Quadratic Equations: Algebra of complex numbers, Argand plane, Quadratic equations with complex roots","Linear Inequalities: Algebraic & graphical solutions","Permutations & Combinations: Fundamental principle of counting, nPr, nCr","Binomial Theorem: Expansion, General term, Middle term","Sequences & Series: AP, GP, Special sums (Σn, Σn², Σn³)"]},
  {id:"u2",name:"Coordinate Geometry",topics:["Straight Lines: Slope, Various forms of equation, Distance of a point from a line","Conic Sections: Circle, Parabola, Ellipse, Hyperbola — standard equations","Introduction to 3D Geometry: Coordinate axes & planes, Distance between two points, Section formula"]},
  {id:"u3",name:"Calculus",topics:["Limits: Algebra of limits, Limits of trigonometric functions","Derivatives: First principle, Derivatives of polynomial & trigonometric functions"]},
  {id:"u4",name:"Statistics & Probability",topics:["Statistics: Measures of dispersion — Range, Mean deviation, Variance, Standard deviation","Probability: Random experiments, Events, Axiomatic approach, Addition theorem"]},
]};
const _C11_PHY = {id:"c11-phy",name:"Physics",code:"CBSE 11",exam:"Mar 2027",color:"#FF6B35",icon:"⚛️",units:[
  {id:"u1",name:"Units, Measurement & Kinematics",topics:["Units & Measurement: SI units, Dimensional analysis, Significant figures, Error analysis","Motion in a Straight Line: Position, Velocity, Acceleration, Kinematic equations, Relative velocity","Motion in a Plane: Vectors, Projectile motion, Circular motion"]},
  {id:"u2",name:"Laws of Motion & Work-Energy",topics:["Laws of Motion: Newton's laws, Friction, Circular motion dynamics","Work, Energy & Power: Work-energy theorem, Conservation of energy, Collisions (elastic/inelastic)","System of Particles & Rotational Motion: Centre of mass, Torque, Angular momentum, Moment of inertia","Gravitation: Kepler's laws, Universal law of gravitation, Escape velocity, Satellites"]},
  {id:"u3",name:"Properties of Matter & Thermodynamics",topics:["Mechanical Properties of Solids: Stress-strain, Young's modulus, Bulk & Shear modulus","Mechanical Properties of Fluids: Pascal's law, Bernoulli's theorem, Viscosity, Surface tension","Thermal Properties of Matter: Heat, Temperature scales, Calorimetry, Thermal expansion, Conduction/Convection/Radiation","Thermodynamics: Zeroth/First/Second law, Isothermal & Adiabatic processes, Carnot engine"]},
  {id:"u4",name:"Kinetic Theory & Waves",topics:["Kinetic Theory of Gases: Assumptions, Pressure of gas, Degrees of freedom, Mean free path","Oscillations: SHM, Simple pendulum, Energy in SHM, Damped & Forced oscillations","Waves: Wave motion, Speed of wave, Principle of superposition, Standing waves, Beats, Doppler effect"]},
]};
const _C11_CHEM = {id:"c11-chem",name:"Chemistry",code:"CBSE 11",exam:"Mar 2027",color:"#4ECDC4",icon:"🧪",units:[
  {id:"u1",name:"Basic Concepts & Atomic Structure",topics:["Some Basic Concepts of Chemistry: Mole concept, Stoichiometry, Empirical & Molecular formula","Structure of Atom: Bohr model, Quantum numbers, Aufbau principle, Hund's rule, Electronic configuration","Classification of Elements & Periodicity: Modern periodic law, Periodic trends (atomic radius, IE, EA, electronegativity)"]},
  {id:"u2",name:"Bonding & Equilibrium",topics:["Chemical Bonding & Molecular Structure: Ionic & Covalent bond, VSEPR theory, Hybridisation, Molecular orbital theory","Chemical Thermodynamics: System & surroundings, Enthalpy, Hess's law, Gibbs energy, Spontaneity","Equilibrium: Chemical equilibrium, Le Chatelier's principle, Ionic equilibrium, pH, Buffer solutions, Ksp"]},
  {id:"u3",name:"Redox & Elements",topics:["Redox Reactions: Oxidation number, Balancing redox equations","Hydrogen: Position in periodic table, Hydrides, Water, Hydrogen peroxide","s-Block Elements: Alkali & Alkaline earth metals — properties, compounds","p-Block Elements (Group 13 & 14): Boron family, Carbon family — properties, anomalous behaviour"]},
  {id:"u4",name:"Organic Chemistry",topics:["Organic Chemistry — Basic Principles: IUPAC nomenclature, Isomerism, Fission of bonds, Electronic effects (inductive, resonance)","Hydrocarbons: Alkanes, Alkenes, Alkynes — preparation & properties, Aromatic hydrocarbons, Benzene, Directive influence of substituents"]},
]};
const _C11_BIO = {id:"c11-bio",name:"Biology",code:"CBSE 11",exam:"Mar 2027",color:"#06D6A0",icon:"🧬",units:[
  {id:"u1",name:"Diversity of Living World",topics:["The Living World: Characteristics, Taxonomy, Nomenclature, Systems of classification","Biological Classification: Five Kingdom system, Monera, Protista, Fungi, Viruses & Lichens","Plant Kingdom: Algae, Bryophytes, Pteridophytes, Gymnosperms, Angiosperms","Animal Kingdom: Classification basis, Non-chordates to Chordates (major phyla)"]},
  {id:"u2",name:"Structural Organisation",topics:["Morphology of Flowering Plants: Root, Stem, Leaf, Inflorescence, Flower, Fruit, Seed","Anatomy of Flowering Plants: Tissues, Tissue systems, Secondary growth","Structural Organisation in Animals: Animal tissues, Frog — morphology & anatomy","Cell — The Unit of Life: Cell theory, Prokaryotic & Eukaryotic cell, Cell organelles","Biomolecules: Carbohydrates, Proteins, Lipids, Nucleic acids, Enzymes","Cell Cycle & Cell Division: Mitosis, Meiosis"]},
  {id:"u3",name:"Plant Physiology",topics:["Transport in Plants: Diffusion, Osmosis, Plant-water relations, Long distance transport of water","Mineral Nutrition: Essential minerals, Deficiency symptoms, Nitrogen fixation","Photosynthesis: Light & dark reactions, C3 & C4 pathway, Photorespiration","Respiration in Plants: Glycolysis, Fermentation, Krebs cycle, Electron transport chain","Plant Growth & Development: Phases of growth, Plant hormones, Photoperiodism, Vernalisation"]},
  {id:"u4",name:"Human Physiology",topics:["Digestion & Absorption: Alimentary canal, Digestive glands, Digestion of nutrients","Breathing & Exchange of Gases: Respiratory organs, Mechanism of breathing, Transport of gases","Body Fluids & Circulation: Blood, Composition, Heart, Cardiac cycle, ECG","Excretory Products & their Elimination: Nephron, Urine formation, Regulation of kidney function","Locomotion & Movement: Skeletal system, Types of movement, Muscle contraction","Neural Control & Coordination: Neuron, Reflex action, Brain, Sense organs","Chemical Coordination & Integration: Endocrine glands, Hormones & their functions"]},
]};
const _C11_ENG = {id:"c11-eng",name:"English Core",code:"CBSE 11",exam:"Mar 2027",color:"#C77DFF",icon:"📖",units:[
  {id:"u1",name:"Hornbill — Prose",topics:["The Portrait of a Lady — Khushwant Singh","We're Not Afraid to Die… — Gordon Cook & Alan East","Discovering Tut: the Saga Continues","Landscape of the Soul — Nathalie Trouveroy","The Ailing Planet — Nani Palkhivala","The Browning Version — Terence Rattigan","The Adventure — Jayant Narlikar","Silk Road — Nick Middleton"]},
  {id:"u2",name:"Hornbill — Poetry",topics:["A Photograph — Shirley Toulson","The Laburnum Top — Ted Hughes","The Voice of the Rain — Walt Whitman","Childhood — Markus Natten","Father to Son — Elizabeth Jennings"]},
  {id:"u3",name:"Snapshots — Supplementary",topics:["The Summer of the Beautiful White Horse","The Address","Ranga's Marriage","Albert Einstein at School","Mother's Day","Birth","The Tale of Melon City"]},
  {id:"u4",name:"Writing Skills & Grammar",topics:["Note Making & Summarising","Notice, Advertisement & Poster Writing","Formal Letter Writing: Complaint, Enquiry, Placing order","Business & Official Letters","Grammar: Tenses, Subject-Verb Agreement, Determiners, Modals, Reported speech"]},
]};
const _C11_ECO = {id:"c11-eco",name:"Economics",code:"CBSE 11",exam:"Mar 2027",color:"#FF6B35",icon:"📊",units:[
  {id:"u1",name:"Statistics for Economics I",topics:["Introduction: Meaning & scope of Economics, Statistics as a discipline","Collection, Organisation & Presentation of Data: Census & Sample methods, Sampling, Classification, Frequency distribution","Diagrammatic & Graphic Presentation: Bar diagrams, Pie charts, Histogram, Ogive, Frequency polygon"]},
  {id:"u2",name:"Statistics for Economics II",topics:["Measures of Central Tendency: Mean, Median, Mode","Measures of Dispersion: Range, Quartile deviation, Mean deviation, Standard deviation","Correlation: Meaning, Scatter diagram, Karl Pearson's coefficient, Spearman's rank correlation","Index Numbers: Meaning, Types, Construction, Uses; Inflation & Index numbers"]},
  {id:"u3",name:"Indian Economic Development I",topics:["Indian Economy on the Eve of Independence: Colonial economic policies, Agriculture, Industry","Indian Economy 1950–1990: Planning objectives, Agricultural & Industrial policy, Trade policy (import substitution)","Liberalisation, Privatisation & Globalisation: Economic reforms since 1991, NEP 1991"]},
  {id:"u4",name:"Indian Economic Development II",topics:["Poverty: Concept, Measures, Poverty alleviation programmes","Human Capital Formation: Sources, Education & Health as investment, Government policy","Rural Development: Credit, Marketing, Diversification, Organic farming","Employment: Growth, Informalisation, Unemployment types","Infrastructure: Energy & Health","Environment & Sustainable Development: Sustainability concept, Green GDP"]},
]};
const _C11_ACC = {id:"c11-acc",name:"Accountancy",code:"CBSE 11",exam:"Mar 2027",color:"#FFE66D",icon:"🧾",units:[
  {id:"u1",name:"Introduction & Theory Base",topics:["Introduction to Accounting: Meaning, Objectives, Users, Qualitative characteristics","Theory Base of Accounting: GAAP, Accounting concepts & conventions, Accounting Standards, IFRS basics","Bases of Accounting: Cash basis vs Accrual basis"]},
  {id:"u2",name:"Recording of Transactions",topics:["Origin of Transactions: Source documents, Vouchers","Journal: Rules of debit & credit, Journal entries, Compound entries","Ledger: Posting, Balancing of accounts","Cash Book & Subsidiary Books: Simple, Double, Triple column cash book, Petty cash book"]},
  {id:"u3",name:"Trial Balance, Bank Reconciliation & Depreciation",topics:["Bank Reconciliation Statement: Causes of difference, Preparation","Trial Balance: Objectives, Preparation, Errors — types & rectification","Depreciation: Methods (Straight line, Written down value), Provisions & Reserves"]},
  {id:"u4",name:"Financial Statements",topics:["Bills of Exchange: Meaning, Parties, Honour & Dishonour","Financial Statements of Sole Proprietorship: Trading & P&L Account, Balance Sheet","Adjustments: Closing stock, Outstanding & Prepaid expenses, Accrued income, Bad debts, Depreciation adjustments","Accounts from Incomplete Records: Statement of affairs, Single entry system basics"]},
]};
const _C11_BS = {id:"c11-bs",name:"Business Studies",code:"CBSE 11",exam:"Mar 2027",color:"#06D6A0",icon:"💼",units:[
  {id:"u1",name:"Foundations of Business",topics:["Business, Trade & Commerce: Concept, Characteristics, Objectives, Economic vs Non-economic activities","Forms of Business Organisation: Sole proprietorship, Partnership, Joint Hindu Family, Cooperative societies","Private, Public & Global Enterprises: Companies — types, Formation; Public sector enterprises; Global/MNC"]},
  {id:"u2",name:"Business Services & Trade",topics:["Business Services: Banking services, Insurance (principles, types), Postal & warehousing services","Emerging Modes of Business: E-business, Outsourcing, BPO/KPO","Social Responsibility & Business Ethics: CSR, Business ethics, Environmental protection"]},
  {id:"u3",name:"Business Finance & Small Business",topics:["Sources of Business Finance: Owners' funds, Borrowed funds, Trade credit, Public deposits","Small Business & Entrepreneurship: Role in India, Government schemes (MSME), Rural & Cottage industries","Internal Trade: Wholesale & Retail trade, Types of retailers, GST basics"]},
  {id:"u4",name:"International Business",topics:["International Business: Meaning, Scope, Difference from domestic business","International Trade Documents: Indent, Letter of credit, Bill of lading, Certificate of origin","EXIM Procedures: Export & Import procedure basics","World Trade Organisation: Objectives, Functions"]},
]};
const _C11_HIST = {id:"c11-hist",name:"History",code:"CBSE 11",exam:"Mar 2027",color:"#FF6B35",icon:"🏛️",units:[
  {id:"u1",name:"Early Societies",topics:["From the Beginning of Time: Human evolution, Early hunter-gatherer societies","Writing & City Life: Mesopotamian civilisation, Cuneiform script, Urban centres"]},
  {id:"u2",name:"Empires & Medieval Societies",topics:["An Empire Across Three Continents: Roman Empire — administration, economy, culture","Nomadic Empires: Mongols — Genghis Khan, Administration, Trade networks","The Three Orders: Feudal Europe — clergy, nobility, peasantry","Changing Cultural Traditions: Renaissance — art, science, humanism"]},
  {id:"u3",name:"Colonialism & Confrontations",topics:["Confrontation of Cultures: European voyages, Colonisation of the Americas","The Industrial Revolution: Causes, Technological changes, Social impact","Displacing Indigenous Peoples: Settler colonialism — North America, Australia"]},
  {id:"u4",name:"Modernisation",topics:["Paths to Modernisation: Comparison of China & Japan — Meiji Restoration, Chinese Revolution"]},
]};
const _C11_POL = {id:"c11-pol",name:"Political Science",code:"CBSE 11",exam:"Mar 2027",color:"#4ECDC4",icon:"🗳️",units:[
  {id:"u1",name:"Constitution: Why & How",topics:["Constitution — Why & How: Need for a constitution, Constituent Assembly, Preamble","Rights in the Indian Constitution: Fundamental Rights, Directive Principles, Fundamental Duties","Election & Representation: Election Commission, First-past-the-post, Representation of interests"]},
  {id:"u2",name:"Executive, Legislature & Judiciary",topics:["Executive: President, Prime Minister, Council of Ministers","Legislature: Parliament — Lok Sabha, Rajya Sabha, Law-making process","Judiciary: Supreme Court, High Courts, Judicial review, PIL","Federalism: Union-State relations, Local self-government (Panchayati Raj)"]},
  {id:"u3",name:"Political Theory",topics:["Political Theory: Meaning, Freedom, Concept of liberty","Equality: Types — political, economic, social; Ways to promote equality","Social Justice: Concept, Rawls' theory of justice","Rights: Legal & moral rights, Human rights"]},
  {id:"u4",name:"Political Concepts",topics:["Citizenship: Full & equal membership, Global citizenship","Nationalism: Nation vs Nation-state, National self-determination","Secularism: Western vs Indian model of secularism"]},
]};
const _C11_GEO = {id:"c11-geo",name:"Geography",code:"CBSE 11",exam:"Mar 2027",color:"#06D6A0",icon:"🌍",units:[
  {id:"u1",name:"Physical Geography — Earth & Landforms",topics:["Geography as a Discipline: Nature, Scope, Branches","The Origin & Evolution of the Earth: Big Bang theory, Interior of the Earth, Earth's layers","Interior of the Earth: Earthquakes, Volcanoes, Distribution","Distribution of Oceans & Continents: Continental drift, Plate tectonics","Minerals & Rocks: Types of rocks — Igneous, Sedimentary, Metamorphic","Geomorphic Processes: Weathering, Mass wasting, Erosion","Landforms & their Evolution: Fluvial, Aeolian, Glacial, Karst landforms"]},
  {id:"u2",name:"Physical Geography — Climate & Water",topics:["Atmosphere: Composition, Structure, Temperature, Pressure belts, Winds","Water in the Atmosphere: Humidity, Precipitation, Cloud types","World Climate & Climate Change: Koeppen classification, Greenhouse effect, Global warming","Water (Oceans): Ocean relief, Temperature, Salinity, Ocean currents, Tides","Life on the Earth: Biosphere, Ecosystem, Biodiversity"]},
  {id:"u3",name:"India — Physical Environment",topics:["India — Location: Physiographic divisions — Himalayas, Northern Plains, Peninsular Plateau, Coastal Plains, Islands","Drainage System: Himalayan & Peninsular rivers, River basins","Climate: Monsoon mechanism, Seasons, Climatic regions","Natural Vegetation: Types of forests, Wildlife conservation","Soils: Types — Alluvial, Black, Red, Laterite; Soil erosion & conservation","Natural Hazards & Disasters: Floods, Droughts, Earthquakes, Landslides — causes & management"]},
  {id:"u4",name:"Practical Work in Geography",topics:["Introduction to Maps: Scale, Map projections basics","Topographical Maps: Reading & interpretation","Introduction to Remote Sensing, GPS & GIS basics"]},
]};
const _C11_PSYC = {id:"c11-psyc",name:"Psychology",code:"CBSE 11",exam:"Mar 2027",color:"#C77DFF",icon:"🧠",units:[
  {id:"u1",name:"Foundations of Psychology",topics:["What is Psychology: Nature, Branches, Application in everyday life","Methods of Enquiry: Observation, Experimental, Case study, Survey methods","The Bases of Human Behaviour: Nervous system, Endocrine system, Heredity vs environment"]},
  {id:"u2",name:"Development & Perception",topics:["Human Development: Stages, Domains — physical, cognitive, social","Sensory, Attentional & Perceptual Processes: Sensation, Attention, Perceptual organisation, Illusions"]},
  {id:"u3",name:"Learning & Memory",topics:["Learning: Classical & Operant conditioning, Observational learning, Skill learning","Human Memory: Encoding, Storage, Retrieval, Forgetting, Memory improvement techniques"]},
  {id:"u4",name:"Thinking & Motivation",topics:["Thinking: Concept formation, Reasoning, Problem solving, Decision making, Creativity","Motivation & Emotion: Types of motives, Maslow's hierarchy, Emotional experience & expression"]},
]};
const _C11_SOCIO = {id:"c11-socio",name:"Sociology",code:"CBSE 11",exam:"Mar 2027",color:"#FF6B35",icon:"👥",units:[
  {id:"u1",name:"Introducing Sociology",topics:["Sociology & Society: Emergence, Scope, Relationship with other social sciences","Terms, Concepts & their Use: Social groups, Status, Role, Norms, Values","Understanding Social Institutions: Family, Marriage, Kinship, Economic & Political institutions"]},
  {id:"u2",name:"Culture & Socialisation",topics:["Culture & Socialisation: Meaning of culture, Agencies of socialisation — family, peer, media","Doing Sociology: Research process — hypothesis, data collection, fieldwork"]},
  {id:"u3",name:"Understanding Society",topics:["Social Structure, Stratification & Social Processes: Caste, Class, Gender-based stratification","Social Change: Sources of social change — technology, education, law"]},
  {id:"u4",name:"Environment & Society",topics:["Environment & Society: Ecological issues, Sustainable development, Environmental movements in India","Western Social Thinkers: Basic ideas of Comte, Marx, Durkheim, Weber (introductory)"]},
]};

// Stream-based subject packs — Class 11
const CBSE11_STREAMS = {
  science_pcm: {
    label: "🔬 Science — PCM (Physics, Chemistry, Maths)",
    desc: "Physics · Chemistry · Mathematics + English Core",
    subjects: [_C11_PHY, _C11_CHEM, _C11_MATH, _C11_ENG],
  },
  science_pcb: {
    label: "🧬 Science — PCB (Physics, Chemistry, Biology)",
    desc: "Physics · Chemistry · Biology + English Core",
    subjects: [_C11_PHY, _C11_CHEM, _C11_BIO, _C11_ENG],
  },
  science_pcmb: {
    label: "🔭 Science — PCMB (All four)",
    desc: "Physics · Chemistry · Maths · Biology + English Core",
    subjects: [_C11_PHY, _C11_CHEM, _C11_MATH, _C11_BIO, _C11_ENG],
  },
  commerce: {
    label: "💼 Commerce",
    desc: "Accountancy · Business Studies · Economics · Maths + English Core",
    subjects: [_C11_ACC, _C11_BS, _C11_ECO, _C11_MATH, _C11_ENG],
  },
  arts: {
    label: "🎨 Arts / Humanities",
    desc: "History · Political Science · Geography · Psychology · Sociology + English Core",
    subjects: [_C11_HIST, _C11_POL, _C11_GEO, _C11_PSYC, _C11_SOCIO, _C11_ENG],
  },
};

// Active stream (stored in localStorage)
let cbse11Stream = localStorage.getItem("cbse11Stream") || null;

// Returns subjects for cbse11 based on selected stream
function getCbse11Subjects(){
  if(cbse11Stream && CBSE11_STREAMS[cbse11Stream]) return CBSE11_STREAMS[cbse11Stream].subjects;
  return []; // No stream selected yet
}

function switchCbse11Stream(streamId){
  cbse11Stream = streamId;
  localStorage.setItem("cbse11Stream", streamId);
  activeCourse = 'cbse11';
  localStorage.setItem("activeCourse", "cbse11");
  localStorage.setItem("courseChosen", "1");
  const subs = getCbse11Subjects();
  state.activeSubject = subs[0]?.id || "";
  document.getElementById("course-selector-overlay")?.remove();
  showToast("✅ Stream set to " + (CBSE11_STREAMS[streamId]?.label || streamId), "success");
  spawnStars();
  if(state.view === 'neetjee') state.view = 'dashboard';
  clearTimeout(S._timer); S._timer=setTimeout(pushToFirebase,1200);
  switchView(state.view);
}

// Active stream (stored in localStorage)
let cbse12Stream = localStorage.getItem("cbse12Stream") || null;

// Returns subjects for cbse12 based on selected stream
function getCbse12Subjects(){
  if(cbse12Stream && CBSE12_STREAMS[cbse12Stream]) return CBSE12_STREAMS[cbse12Stream].subjects;
  return []; // No stream selected yet
}

function switchCbse12Stream(streamId){
  cbse12Stream = streamId;
  localStorage.setItem("cbse12Stream", streamId);
  // Also set activeCourse = cbse12 and persist
  activeCourse = 'cbse12';
  localStorage.setItem("activeCourse", "cbse12");
  localStorage.setItem("courseChosen", "1");
  const subs = getCbse12Subjects();
  state.activeSubject = subs[0]?.id || "";
  document.getElementById("course-selector-overlay")?.remove();
  showToast("✅ Stream set to " + (CBSE12_STREAMS[streamId]?.label || streamId), "success");
  spawnStars();
  if(state.view === 'neetjee') state.view = 'dashboard';
  clearTimeout(S._timer); S._timer=setTimeout(pushToFirebase,1200);
  switchView(state.view);
}

function renderCbse12StreamSelector(){
  // kept for any legacy calls — now routes through the unified selector
  showCourseSelector('cbse');
}


// Single fallback for when no stream is set (all subjects together)
const SUBJECTS_CBSE11 = Object.values(CBSE11_STREAMS).flatMap(s=>s.subjects).filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i);
const SUBJECTS_CBSE12 = Object.values(CBSE12_STREAMS).flatMap(s=>s.subjects).filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i);

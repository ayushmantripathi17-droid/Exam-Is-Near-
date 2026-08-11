// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const SUBJECTS = [
  {id:"cpp",name:"C++",code:"SLBSL-S2-P4",exam:"18 May",color:"#FF6B35",icon:"⌨️",units:[
    {id:"u1",name:"OOP Concepts & Basics",topics:["OOP vs Procedural","C++ basics, I/O","Data types, variables","Control structures"]},
    {id:"u2",name:"Functions & Classes",topics:["Function overloading","Inline & friend functions","Classes & Objects","Access specifiers, 'this' pointer"]},
    {id:"u3",name:"Inheritance & Polymorphism",topics:["Types of inheritance","Virtual functions","Polymorphism","Operator overloading"]},
    {id:"u4",name:"Constructors & File Handling",topics:["Constructors & Destructors","Order of invocation","File management","Exception handling"]},
  ]},
  {id:"rdbms",name:"RDBMS",code:"SLBSL-S2-P5",exam:"19 May",color:"#4ECDC4",icon:"🗄️",units:[
    {id:"u1",name:"DBMS Overview & SQL",topics:["DBMS basics & Codd's rules","Normalization (1NF-BCNF)","SQL vs SQL*Plus","SQL commands & datatypes"]},
    {id:"u2",name:"Tables, DML & Joins",topics:["DDL: CREATE, ALTER, DROP","DML: INSERT, UPDATE, DELETE","SELECT, WHERE, GROUP BY, HAVING","JOINs, subquery, UNION, INTERSECT"]},
    {id:"u3",name:"Oracle Objects & Functions",topics:["Views, Sequences, Synonyms","Numeric & Character functions","Date functions","Aggregate functions"]},
    {id:"u4",name:"PL/SQL",topics:["PL/SQL block structure","Variables & data types","Cursors (implicit/explicit)","Procedures, Functions, Triggers"]},
  ]},
  {id:"legal",name:"Legal Language",code:"SLBSL-S2-P1",exam:"20 May",color:"#A8DADC",icon:"✍️",units:[
    {id:"u1",name:"Common Errors in English",topics:["Tense errors","Subject-verb agreement","Noun-pronoun agreement","Misplaced modifiers & prepositions"]},
    {id:"u2",name:"Vocabulary Building",topics:["Word formation processes","Prefixes & suffixes","Synonyms & antonyms","Idioms & phrases"]},
    {id:"u3",name:"Drafting & Writing Skills",topics:["Essay writing on legal topics","Cover letter & resume","Notice, Agenda, Minutes","Email & Memorandum"]},
    {id:"u4",name:"Legal Language & Maxims",topics:["Legal terms (factum valet, mens rea)","Maxims: actus reus, nemo dat","Maxims: ignorantia legis, pacta sunt servanda","Maxims: ubi jus ibi remedium, prima facie"]},
  ]},
  {id:"stats",name:"Statistics",code:"SLBSL-S2-P6",exam:"21 May",color:"#FFE66D",icon:"📊",units:[
    {id:"u1",name:"Intro & Central Tendency",topics:["Data collection & frequency distribution","Bar, Pie, Histogram, Ogive","Mean (individual, discrete, continuous)","Median & Mode"]},
    {id:"u2",name:"Dispersion & SD",topics:["Range, Quartile deviation","Mean deviation (MD)","Variance & Standard Deviation","Coefficient of Variation"]},
    {id:"u3",name:"Correlation & Regression",topics:["Pearson's correlation coefficient","Rank correlation","Regression lines & coefficients","Sampling theory & types"]},
    {id:"u4",name:"Probability & Hypothesis",topics:["Classical & relative probability","Bayes' theorem","T-test, F-test, Z-test, Chi-square","ANOVA"]},
  ]},
  {id:"laws",name:"Law & Society",code:"SLBSL-S2-P2",exam:"22 May",color:"#C77DFF",icon:"⚖️",units:[
    {id:"u1",name:"Intro to Sociology of Law",topics:["Meanings: Sociology, Law & Society","Different legal systems","British-Indian legal system"]},
    {id:"u2",name:"Law in Social Context",topics:["Durkheim, Weber, Maine theories","Sources of law","Law as mirror/social construct"]},
    {id:"u3",name:"Who Makes the Law?",topics:["Social stratification: caste, class, gender","Conflict & Neo-Marxist theories","Analysis of law as social system"]},
    {id:"u4",name:"Indian Society & Policy",topics:["Reservation: SC/ST/OBC/Women","Social inclusion & exclusion","Child & women labour laws","Atrocities against women"]},
  ]},
  {id:"juris",name:"Jurisprudence",code:"SLBSL-S2-P3",exam:"25 May",color:"#06D6A0",icon:"📖",units:[
    {id:"u1",name:"Introduction",topics:["Meaning, nature & scope","Jurisprudence & Legal Theory","Kinds of law","Sources: Constitution, Custom, Precedent"]},
    {id:"u2",name:"Schools of Jurisprudence",topics:["Natural School (Ancient, Classical, Modern)","Analytical: Austin, Bentham, Kelsen, HLA Hart","Historical: Savigny, Maine","Sociological: Pound, Ihering | Realism"]},
    {id:"u3",name:"Concepts: Rights & Person",topics:["Rights: Hohfeld's analysis","Rights & Duty correlation","Natural & Juristic Person","Theories of Corporate Personality"]},
    {id:"u4",name:"Possession, Ownership & Property",topics:["Possession: kinds & modes","Ownership: Gandhian concept","Property: nature & rights","Theories: Locke, Hegel, Kant"]},
  ]},
];

// ══════════════════════════════════════════════════════════════
// COURSE SETS — JEE / NEET / UPSC / NFSU
// ══════════════════════════════════════════════════════════════
// ── JEE KEY FORMULAS ──
const JEE_FORMULAS = {
  "jee-phy": {
    "Kinematics":["v = u + at","s = ut + ½at²","v² = u² + 2as","Range R = u²sin2θ/g","Max Height H = u²sin²θ/2g","Time of flight T = 2usinθ/g"],
    "Laws of Motion":["F = ma","Impulse J = FΔt = Δp","Friction f = μN","Centripetal a = v²/r = ω²r"],
    "Work, Energy & Power":["W = Fs·cosθ","KE = ½mv²","PE = mgh","Power P = W/t = Fv","Conservation: KE + PE = const"],
    "Rotational Motion":["τ = Iα","L = Iω","KE_rot = ½Iω²","I(ring) = MR²","I(disc) = ½MR²","I(sphere) = 2/5·MR²","Parallel axis: I = I_cm + Md²"],
    "Gravitation":["F = Gm₁m₂/r²","g = GM/R²","Escape v = √(2gR)","Orbital v = √(GM/r)","T² ∝ r³ (Kepler's 3rd)"],
    "Simple Harmonic Motion":["x = A·sin(ωt + φ)","ω = 2π/T = √(k/m)","T(pendulum) = 2π√(L/g)","v_max = Aω","a_max = Aω²"],
    "Waves & Sound":["v = fλ","v_sound = √(γP/ρ)","Beat freq = |f₁ - f₂|","Doppler: f' = f·(v±v_o)/(v∓v_s)"],
    "Heat & Thermodynamics":["PV = nRT","ΔU = Q - W","W = PΔV (isobaric)","Efficiency η = 1 - T₂/T₁","Q = mcΔT"],
    "Electrostatics":["F = kq₁q₂/r²","E = kq/r²","V = kq/r","C = Q/V","C_parallel plate = ε₀A/d","U = ½CV² = Q²/2C"],
    "Current Electricity":["V = IR","P = VI = I²R = V²/R","R_series = R₁+R₂+...","1/R_parallel = 1/R₁+1/R₂+...","EMF: ε = V + Ir"],
    "Magnetic Effects":["F = qv×B","F = BIL","r = mv/qB","B_solenoid = μ₀nI","B_long wire = μ₀I/2πr"],
    "Electromagnetic Induction":["EMF = -dΦ/dt","Φ = B·A·cosθ","EMF_motional = BLv","Self ind: V = L·dI/dt"],
    "Alternating Currents":["X_L = ωL","X_C = 1/ωC","Z = √(R²+(X_L-X_C)²)","Resonance: ω₀ = 1/√(LC)","P = V_rms·I_rms·cosφ"],
    "Ray Optics":["1/v - 1/u = 1/f","Magnification m = v/u","Lens maker: 1/f = (n-1)(1/R₁-1/R₂)","Snell's: n₁sinθ₁ = n₂sinθ₂","TIR: sinC = 1/n"],
    "Wave Optics":["Fringe width β = λD/d","Condition bright: Δ = nλ","Condition dark: Δ = (2n-1)λ/2","Resolving power: θ = 1.22λ/d"],
    "Dual Nature & Atoms":["E = hf = hc/λ","KE_max = hf - φ","λ_deBroglie = h/mv","E_n = -13.6/n² eV (H-atom)","r_n = 0.529n² Å"],
    "Nuclei & Semiconductors":["E = mc²","t₁/₂ = 0.693/λ","N = N₀e^(-λt)","BE/nucleon peaks at Fe-56"],
  },
  "jee-chem": {
    "Mole Concept":["Moles = mass/M","PV = nRT","Normality = Molarity × n-factor","Molality = moles solute/kg solvent","Mole fraction x_A = n_A/(n_A+n_B)"],
    "Atomic Structure":["E_n = -13.6/n² eV","r_n = 0.529n² Å","λ = h/mv (de Broglie)","Δx·Δp ≥ h/4π (Heisenberg)","Max e⁻ in shell = 2n²"],
    "Chemical Bonding":["Formal charge = V - L - B/2","Bond order = (bonding - antibonding)/2","Dipole μ = q·d"],
    "Thermodynamics":["ΔG = ΔH - TΔS","ΔG = -RT·lnK","ΔH_rxn = ΣΔH_f(products) - ΣΔH_f(reactants)","Hess's Law: ΔH is path-independent"],
    "Equilibrium":["Kp = Kc(RT)^Δn","ΔG° = -RT·lnK","pH = -log[H⁺]","pH + pOH = 14","Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA])"],
    "Electrochemistry":["E°_cell = E°_cathode - E°_anode","ΔG° = -nFE°","Nernst: E = E° - (RT/nF)lnQ","Faraday's: m = (M·I·t)/(n·F)"],
    "Chemical Kinetics":["Rate = k[A]^m[B]^n","t₁/₂ (1st order) = 0.693/k","k = Ae^(-Ea/RT) (Arrhenius)","Integrated 1st order: ln[A] = ln[A₀] - kt"],
    "Solutions":["π = iCRT (osmotic pressure)","ΔT_b = i·K_b·m","ΔT_f = i·K_f·m","Raoult's: p_A = x_A·p°_A","van't Hoff factor i = 1 + α(n-1)"],
  },
  "jee-math": {
    "Complex Numbers":["z = a+ib, |z| = √(a²+b²)","z̄ = a-ib","|z₁z₂| = |z₁||z₂|","e^(iθ) = cosθ + i·sinθ (Euler's)","Roots of unity: z^n = 1"],
    "Quadratic Equations":["x = (-b ± √(b²-4ac))/2a","Sum of roots = -b/a","Product of roots = c/a","Discriminant D = b²-4ac"],
    "Sequences & Series":["AP: a_n = a+(n-1)d, S_n = n/2(2a+(n-1)d)","GP: a_n = ar^(n-1), S_n = a(1-rⁿ)/(1-r)","Sum of n²: n(n+1)(2n+1)/6","Sum of n³: [n(n+1)/2]²"],
    "Binomial Theorem":["(a+b)^n = Σ C(n,r)·a^(n-r)·b^r","T_(r+1) = C(n,r)·a^(n-r)·b^r","Middle term: T_(n/2+1) when n is even"],
    "Matrices & Determinants":["det(AB) = det(A)·det(B)","A⁻¹ = adj(A)/det(A)","Cramer's rule for system Ax = B","Rank of matrix"],
    "Limits & Continuity":["lim(sinx/x) = 1 as x→0","lim((1+1/n)^n) = e","L'Hôpital: 0/0 or ∞/∞ forms","Chain rule: dy/dx = dy/du · du/dx"],
    "Differentiation":["d/dx(xⁿ) = nxⁿ⁻¹","d/dx(eˣ) = eˣ","d/dx(lnx) = 1/x","d/dx(sinx) = cosx","Product: (uv)' = u'v + uv'","Quotient: (u/v)' = (u'v-uv')/v²"],
    "Integration":["∫xⁿdx = xⁿ⁺¹/(n+1)+C","∫eˣdx = eˣ+C","∫sinx dx = -cosx+C","∫1/x dx = ln|x|+C","Integration by parts: ∫u·dv = uv - ∫v·du"],
    "Applications of Derivatives":["Maxima/Minima: f'(x)=0, check f''(x)","Rate of change: dy/dt = (dy/dx)·(dx/dt)","Tangent slope = f'(a) at x=a"],
    "Differential Equations":["Separable: f(y)dy = g(x)dx","Linear: dy/dx + P(x)y = Q(x)","IF = e^(∫P dx)","Solution: y·IF = ∫Q·IF dx"],
    "Coordinate Geometry":["Distance = √((x₂-x₁)²+(y₂-y₁)²)","Slope m = (y₂-y₁)/(x₂-x₁)","Circle: (x-h)²+(y-k)² = r²","Parabola: y² = 4ax","Ellipse: x²/a²+y²/b² = 1"],
    "3D Geometry":["Direction cosines: l²+m²+n² = 1","Distance between parallel planes: |d₁-d₂|/√(a²+b²+c²)","Angle between lines: cosθ = |l₁l₂+m₁m₂+n₁n₂|"],
    "Vectors":["|a×b| = |a||b|sinθ","a·b = |a||b|cosθ","Volume of parallelepiped = a·(b×c)","Unit vector â = a/|a|"],
    "Probability":["P(A∪B) = P(A)+P(B)-P(A∩B)","Bayes: P(A|B) = P(B|A)P(A)/P(B)","Binomial: P(x=r) = C(n,r)·p^r·q^(n-r)","E(X) = np, Var = npq"],
    "Trigonometry":["sin²θ+cos²θ = 1","sin(A±B) = sinAcosB ± cosAsinB","cos2θ = 1-2sin²θ = 2cos²θ-1","sinC+sinD = 2sin((C+D)/2)cos((C-D)/2)"],
  }
};

// ── NEET NCERT IMPORTANT LINES ──
const NEET_NCERT_LINES = {
  "neet-bot": {
    "Living World":["'Living organisms are self-replicating, evolving and self-regulating interactive systems capable of responding to external stimuli' — NCERT","Metabolism is the sum total of all chemical reactions occurring in the body","Cellular organisation is the defining feature of life","Reproduction is not essential for an individual organism's survival but is necessary for species continuity"],
    "Biological Classification":["R.H. Whittaker (1969) proposed the Five Kingdom Classification","Monera have prokaryotic cell organisation — no membrane-bound nucleus","Fungi have cell walls made of chitin","Viruses are non-cellular organisms — acellular obligate intracellular parasites","Viroids have free RNA without protein coat — cause potato spindle tuber disease"],
    "Plant Kingdom":["Algae are chlorophyll-bearing simple, thalloid, autotrophic and largely aquatic organisms","Bryophytes are called 'amphibians of plant kingdom'","Pteridophytes are first terrestrial plants with vascular tissue","Gymnosperms produce naked seeds — not enclosed in fruits","Angiosperms have seeds enclosed within fruits — most evolved plant group"],
    "Animal Kingdom":["Notochord, dorsal hollow nerve cord and pharyngeal gill slits are chordate characters","Porifera — pore-bearing animals, cellular level of organisation, canal system present","Coelenterata — tissue level of organisation, diploblastic body, cnidoblasts present","Platyhelminthes — flatworms, triploblastic acoelomate, flame cells for excretion","Nematoda — pseudocoelomate, body wall only has longitudinal muscles","Annelida — true coelom, metamerism (segmentation), closed circulatory system"],
    "Morphology of Flowering Plants":["Root, stem, leaf, flower, fruit and seed are the parts of a flowering plant","Tap root is modification for storage in carrot, turnip and sweet potato","Phylloclade is modification of stem in Opuntia (photosynthesis)","Leaf modifications: tendrils (Lathyrus), spines (Argemone), bladder (Utricularia)","Cymose inflorescence — main axis terminates in a flower","Racemose inflorescence — main axis does not terminate in a flower"],
    "Anatomy of Flowering Plants":["Meristematic tissue — cells are actively dividing, no intercellular spaces","Permanent tissue — simple (parenchyma, collenchyma, sclerenchyma) and complex (xylem, phloem)","Xylem — conducts water and minerals upward, dead at maturity (except xylem parenchyma)","Phloem — translocates food, sieve tubes are living but lack nucleus","Annual rings are formed by seasonal activity of vascular cambium"],
    "Cell: Unit of Life":["Cell theory: Schleiden, Schwann (1839) — all organisms made of cells; Virchow added 'Omnis cellula e cellula'","Prokaryotic cell — no membrane-bound nucleus, 70S ribosomes","Eukaryotic cell — membrane-bound nucleus, 80S ribosomes (70S in mitochondria/chloroplast)","Fluid mosaic model of cell membrane — proposed by Singer & Nicolson (1972)","Mitochondria — powerhouse of cell, has its own DNA and ribosomes"],
    "Biomolecules":["Carbohydrates provide energy — 4 kcal/g","Fats provide more energy — 9 kcal/g","Enzymes are biological catalysts — mostly proteins","Km (Michaelis constant) represents the affinity of enzyme for substrate","Competitive inhibition — inhibitor resembles substrate; Non-competitive — inhibitor binds elsewhere"],
    "Cell Cycle & Division":["G1, S, G2, M are phases of cell cycle","S phase — DNA replication occurs","Mitosis maintains chromosome number; Meiosis halves it","Crossing over during Prophase I of Meiosis — pachytene sub-stage","Chiasmata — point of crossing over visible during diplotene"],
    "Transport in Plants":["Water potential (ψ) = osmotic potential + pressure potential","Plasmolysis — loss of water from cell; flaccid condition","Apoplast pathway — through cell wall; Symplast — through protoplasm","Transpiration pull — main driving force for ascent of sap","Guttation — loss of water in liquid form through hydathodes"],
    "Photosynthesis":["Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂","Light reactions occur in thylakoid membrane; Dark reactions in stroma","PS I (P700) and PS II (P680) — two photosystems","Calvin cycle (C3 plants) — CO₂ fixation by RuBisCO; first product 3-PGA","C4 plants (Maize, Sugarcane) — primary CO₂ acceptor is PEP; first product OAA","CAM plants fix CO₂ at night — Stomata open at night"],
    "Respiration":["Glycolysis occurs in cytoplasm — Embden-Meyerhof-Parnas (EMP) pathway","Krebs cycle (TCA) occurs in mitochondrial matrix","1 glucose → 36-38 ATP (aerobic)","Fermentation produces only 2 ATP — anaerobic respiration","RQ (Respiratory Quotient) = CO₂ evolved / O₂ consumed; RQ = 1 for carbohydrates"],
    "Plant Growth & Development":["Auxin — promotes cell elongation, apical dominance, inhibits lateral bud","Gibberellin — promotes internodal elongation, seed germination, fruit development","Cytokinin — promotes cell division, delays senescence (Richmond-Lang effect)","Ethylene — promotes fruit ripening, senescence; gaseous hormone","ABA — 'stress hormone', promotes dormancy, stomatal closure"],
  },
  "neet-zoo": {
    "Human Physiology":["Digestion: mouth → oesophagus → stomach → small intestine → large intestine","HCl in stomach — activates pepsinogen to pepsin, kills bacteria","Trypsin, chymotrypsin from pancreas (proteases)","Absorption mainly in small intestine — villi increase surface area","Breathing rate = 12-16 times/min; TV = 500 mL; VC = 4500 mL","Haemoglobin — 4 polypeptide chains, each with haem group carrying O₂","Bohr effect — CO₂ decreases O₂ affinity of Hb","Heart is myogenic — SA node is pacemaker; AV node is pace setter","Blood pressure: 120/80 mmHg (systolic/diastolic)","Cardiac output = Stroke volume × Heart rate = 5 L/min","Nephron is structural and functional unit of kidney","GFR = 125 mL/min = 180 L/day; Urine output = 1.5 L/day","Juxtaglomerular cells secrete Renin → RAAS pathway","ADH (vasopressin) — increases water reabsorption in DCT and collecting duct","Neuron — structural and functional unit of nervous system","Synapse — junction between two neurons; neurotransmitters cross synaptic cleft","RMP = -70 mV; Action potential = +40 mV","Saltatory conduction in myelinated nerve — impulse jumps between nodes of Ranvier"],
    "Reproduction":["Spermatogenesis — in seminiferous tubules; sperms mature in epididymis","Testosterone — secreted by Leydig (interstitial) cells","Oogenesis — begins before birth; primary oocyte arrested in Prophase I","LH surge triggers ovulation (around 14th day of 28-day cycle)","Fertilisation occurs in Fallopian tube (Ampullary-isthmic junction)","Implantation — blastocyst implants in uterine wall on ~7th day after fertilisation","HCG (Human Chorionic Gonadotropin) — secreted by trophoblast; basis of pregnancy test","Parturition — triggered by oxytocin; process of giving birth","Colostrum — first milk; rich in antibodies (IgA)"],
    "Genetics & Evolution":["Mendel's Laws — Law of Dominance, Law of Segregation, Law of Independent Assortment","Incomplete dominance — neither allele is dominant; F1 is intermediate","Codominance — both alleles expressed equally (ABO blood groups)","Multiple allelism — more than 2 alleles for a gene (I^A, I^B, i for ABO)","Sex determination in humans: XX female, XY male (chromosomal sex)","Haemophilia — X-linked recessive disorder; colour blindness — X-linked","Thalassaemia — autosomal recessive disorder","Down's syndrome — trisomy 21 (47 chromosomes)","DNA structure — double helix by Watson & Crick (1953)","Chargaff's rules: A=T, G=C; (A+G)=(T+C)","DNA replication is semi-conservative — proved by Meselson & Stahl","Transcription: DNA → mRNA; Translation: mRNA → Protein","Lac operon — Jacob & Monod; inducible operon in E. coli","Hardy-Weinberg principle — allele frequencies remain constant in ideal population","Genetic drift — change in allele frequency by chance in small populations"],
    "Human Health & Disease":["Immunity — Innate (non-specific) and Acquired (specific)","B-lymphocytes — humoral immunity (antibodies); T-lymphocytes — cell-mediated","Memory cells — responsible for secondary immune response (faster, stronger)","Malaria — caused by Plasmodium; transmitted by female Anopheles mosquito","Dengue — caused by dengue virus; transmitted by Aedes aegypti","HIV — attacks helper T-cells (CD4 cells); causes AIDS","Cancer — uncontrolled cell division; Proto-oncogenes can become oncogenes","Carcinogens — agents causing cancer (physical, chemical, biological)"],
    "Biotechnology":["Recombinant DNA technology — tools: restriction enzymes, ligase, vectors","EcoRI cuts at 5'-GAATTC-3' — a restriction enzyme","Plasmid is commonly used as vector in gene cloning","PCR (Polymerase Chain Reaction) — amplifies specific DNA sequences","Gel electrophoresis — separates DNA fragments by size","Bt toxin — from Bacillus thuringiensis; Bt crops (Bt cotton) are pest resistant","Golden Rice — genetically modified to produce β-carotene (Vitamin A)","HGP (Human Genome Project) — completed 2003; 3164.7 Mb DNA, ~30,000 genes","DNA fingerprinting — uses VNTR/STR sequences; developed by Alec Jeffreys"],
    "Ecology":["Population density — number of individuals per unit area","Natality, mortality, immigration, emigration determine population growth","Logistic growth — S-shaped (sigmoid) curve; r_max at N = K/2 (carrying capacity)","Exponential growth — J-shaped curve; occurs when resources are unlimited","Food chain — energy transfer: Producer → Herbivore → Carnivore → Top carnivore","10% law (Lindeman) — only 10% energy transferred between trophic levels","Biomagnification — increase of toxicants at successive trophic levels","Biodiversity — genetic, species and ecosystem diversity","Hotspots — 34 biodiversity hotspots in world; India has 4 (Himalayas, Western Ghats, Indo-Burma, Sundaland)","Ex-situ conservation — zoos, botanical gardens, gene banks; In-situ — national parks, biosphere reserves"],
  },
  "neet-phy": {
    "Units & Measurement":["SI system has 7 base units: m, kg, s, A, K, mol, cd","Significant figures — all certain digits + one uncertain digit","Dimensional analysis — used to check equations and derive formulae","Least count of vernier caliper = 1 MSD - 1 VSD","Least count of screw gauge = Pitch / Number of divisions on circular scale"],
    "Kinematics":["Distance is scalar; Displacement is vector","Speed is scalar; Velocity is vector","Uniform acceleration: v = u + at; s = ut + ½at²","Projectile motion — horizontal velocity constant; vertical motion under gravity","Relative velocity of A w.r.t. B = v_A - v_B"],
    "Laws of Motion":["Newton's 1st Law — Law of Inertia; body continues in state of rest/uniform motion unless external force acts","Newton's 2nd Law — F = ma (rate of change of momentum)","Newton's 3rd Law — every action has equal and opposite reaction","Friction force f ≤ μN; Static friction > Kinetic friction","Banking angle: tanθ = v²/rg"],
    "Electrostatics":["Coulomb's law — force ∝ q₁q₂/r² (in vacuum)","Electric field lines start from + charge and end at - charge","Gauss's theorem — total electric flux = q/ε₀","Capacitance of parallel plate capacitor C = ε₀A/d","Energy stored in capacitor U = ½CV² = Q²/2C"],
    "Atoms & Nuclei":["Rutherford's model — nucleus is tiny, dense; electrons orbit around it","Bohr model — electrons in fixed orbits; energy emitted when electron falls to lower orbit","Energy of hydrogen atom: E_n = -13.6/n² eV","Nuclear radius: R = R₀A^(1/3), R₀ = 1.2 fm","Binding energy per nucleon is maximum for Fe-56 (most stable nucleus)","α, β, γ rays differ in charge, mass and penetrating power"],
  },
  "neet-chem": {
    "Basic Concepts":["Atoms are the smallest particles of an element that retain chemical properties","Avogadro's number N_A = 6.022 × 10²³ mol⁻¹","Molar mass in grams contains 6.022 × 10²³ particles","Law of conservation of mass — mass is neither created nor destroyed","Law of definite proportions — a compound always has same elements in same mass ratio"],
    "Atomic Structure":["Rutherford's model — most of atom is empty space; nucleus is dense and positively charged","Bohr's model — electrons revolve in fixed orbits; energy is quantised","de Broglie hypothesis — matter has wave nature; λ = h/mv","Heisenberg's uncertainty principle — Δx·Δp ≥ h/4π","Aufbau principle: fill orbitals in order of increasing energy","Hund's rule: orbitals of same energy filled singly before pairing","Pauli's exclusion principle: no two electrons have same set of 4 quantum numbers"],
    "Chemical Bonding":["Ionic bond — complete transfer of electrons; high melting point","Covalent bond — sharing of electrons; can be polar or non-polar","VSEPR theory — lone pairs repel more than bond pairs","sp³ hybridisation: tetrahedral (109.5°); sp²: trigonal planar (120°); sp: linear (180°)","Hydrogen bonding — strongest in HF, then H₂O, then NH₃","Van der Waals forces — weakest intermolecular forces"],
    "Equilibrium":["Law of mass action — rate ∝ product of concentrations raised to power of stoichiometric coefficients","Le Chatelier's principle — if stress is applied, equilibrium shifts to relieve stress","Ka × Kb = Kw = 10⁻¹⁴ at 25°C","Buffer solution resists change in pH","Solubility product Ksp = [M^(n+)]^m × [X^(n-)]^n"],
    "Organic Chemistry":["Hybridisation determines shape and bond angles","Inductive effect is transmitted through sigma bonds; decreases with distance","Resonance stabilises benzene and carboxylate ions","Markovnikov's rule — in HX addition, H goes to C with more H atoms","Peroxide effect reverses Markovnikov's rule (anti-Markovnikov)","Elimination reaction follows Saytzeff's rule — more substituted alkene predominates"],
  }
};

const SUBJECTS_JEE = [
  {id:"jee-phy",name:"Physics",code:"JEE",exam:"Apr 2026",color:"#FF6B35",icon:"⚛️",units:[
    {id:"ch1", name:"Units, Dimensions & Errors",        topics:["SI Units & Fundamental Quantities","Dimensional Analysis & Applications","Significant Figures & Rounding","Errors: Absolute, Relative, Percentage","Propagation of Errors in Calculations"]},
    {id:"ch2", name:"Kinematics",                         topics:["Distance vs Displacement, Speed vs Velocity","Uniform & Non-Uniform Motion (1D)","Equations of Motion (v, u, a, s, t)","Motion Under Gravity — Free Fall","Projectile Motion — Range, Height, Time","Relative Motion in 1D & 2D","Circular Motion — Angular Velocity, Centripetal Acceleration"]},
    {id:"ch3", name:"Laws of Motion",                     topics:["Newton's 1st Law — Inertia & Frames","Newton's 2nd Law — F = ma, Impulse","Newton's 3rd Law — Action-Reaction Pairs","Free Body Diagrams & Constraint Equations","Static & Kinetic Friction, Angle of Friction","Circular Motion on Banked Roads","Pseudo Force in Non-Inertial Frames"]},
    {id:"ch4", name:"Work, Energy & Power",               topics:["Work Done by Constant & Variable Force","Work-Energy Theorem","Kinetic Energy & Potential Energy","Conservative & Non-Conservative Forces","Mechanical Energy Conservation","Power — Average & Instantaneous","Collisions — Elastic & Inelastic (1D & 2D)"]},
    {id:"ch5", name:"Rotational Motion",                  topics:["Centre of Mass & its Motion","Torque & Couple","Moment of Inertia — Definition & Calculation","Theorems: Parallel Axis & Perpendicular Axis","Angular Momentum & its Conservation","Rolling Without Slipping","Rotational KE & Work Done by Torque"]},
    {id:"ch6", name:"Gravitation",                        topics:["Newton's Law of Gravitation","Variation of g with Height, Depth & Latitude","Gravitational Field & Potential","Escape Velocity & Orbital Velocity","Kepler's Three Laws of Planetary Motion","Geostationary & Polar Satellites","Gravitational Binding Energy"]},
    {id:"ch7", name:"Properties of Matter",               topics:["Elasticity — Stress, Strain, Young's Modulus","Bulk Modulus & Modulus of Rigidity","Fluid Pressure — Pascal's Law","Archimedes' Principle & Buoyancy","Viscosity — Stokes' Law, Terminal Velocity","Bernoulli's Theorem & Applications","Surface Tension — Drops, Bubbles, Capillarity"]},
    {id:"ch8", name:"Thermodynamics",                     topics:["Thermal Expansion — Linear, Area, Volume","Calorimetry — Specific & Latent Heat","Heat Transfer — Conduction, Convection, Radiation","Zeroth & First Law of Thermodynamics","Isothermal, Adiabatic, Isochoric, Isobaric Processes","Second Law — Carnot Engine & Efficiency","Kinetic Theory of Gases — vrms, KE, Degrees of Freedom"]},
    {id:"ch9", name:"Simple Harmonic Motion",             topics:["Definition — Restoring Force, Amplitude, Phase","SHM of Spring-Mass System","Simple Pendulum & Compound Pendulum","Energy in SHM — KE, PE, Total","Damped & Forced Oscillations (Conceptual)","Resonance Condition"]},
    {id:"ch10",name:"Waves",                              topics:["Types — Transverse & Longitudinal Waves","Wave Equation — Speed, Frequency, Wavelength","Superposition Principle","Standing Waves — Nodes & Antinodes","Vibration in Strings — Harmonics & Overtones","Vibration in Open & Closed Pipes","Beats & Doppler Effect"]},
    {id:"ch11",name:"Electrostatics",                     topics:["Coulomb's Law & Superposition","Electric Field — Point Charge, Dipole, Continuous Charge","Gauss's Law & Applications (Sphere, Cylinder, Plane)","Electric Potential & Potential Energy","Equipotential Surfaces","Capacitors — Parallel Plate, Series & Parallel","Dielectric, Polarisation & Energy Stored"]},
    {id:"ch12",name:"Current Electricity",                topics:["Drift Velocity & Ohm's Law","Resistance & Resistivity — Temperature Dependence","Kirchhoff's Current & Voltage Laws","Wheatstone Bridge & Metre Bridge","Potentiometer — emf & Internal Resistance","Cells in Series & Parallel","Heating Effect — Joule's Law, Power"]},
    {id:"ch13",name:"Magnetic Effects of Current",        topics:["Biot-Savart Law — Straight Wire, Circular Loop","Ampere's Circuital Law","Force on Moving Charge — Lorentz Force","Force Between Parallel Conductors","Torque on Current Loop in Magnetic Field","Moving Coil Galvanometer","Earth's Magnetism & Magnetic Materials"]},
    {id:"ch14",name:"Electromagnetic Induction & AC",     topics:["Faraday's Law & Lenz's Law","Motional EMF & Eddy Currents","Self Inductance & Mutual Inductance","AC Circuits — Peak, RMS, Phase","LR, LC, LCR Circuits & Resonance","Power Factor & Wattless Current","Transformer — Ideal & Real"]},
    {id:"ch15",name:"Optics",                             topics:["Reflection — Plane & Spherical Mirrors","Refraction — Snell's Law, Critical Angle, TIR","Lenses — Thin Lens Formula, Lens Maker's Equation","Prism — Deviation, Dispersion, Rainbow","Optical Instruments — Microscope, Telescope","Wave Optics — Huygens' Principle","YDSE — Fringe Width, Coherence","Diffraction & Polarisation"]},
    {id:"ch16",name:"Modern Physics",                     topics:["Photoelectric Effect — Einstein's Equation, Work Function","de Broglie Hypothesis & Matter Waves","Bohr's Model — Energy Levels, Hydrogen Spectrum","X-Rays — Characteristic & Continuous","Nuclear Structure — Mass Defect, Binding Energy","Radioactivity — α, β, γ Decay, Half-life","Nuclear Fission & Fusion","Semiconductors — p-n Junction, Diode, LED, Zener","Logic Gates — AND, OR, NOT, NAND, NOR"]},
  ],formulas:JEE_FORMULAS["jee-phy"]},

  {id:"jee-chem",name:"Chemistry",code:"JEE",exam:"Apr 2026",color:"#4ECDC4",icon:"🧪",units:[
    {id:"ch1", name:"Mole Concept & Stoichiometry",       topics:["Atomic & Molecular Mass, Mole Definition","Empirical & Molecular Formula","Balancing Chemical Equations","Limiting Reagent & Percentage Yield","Concentration Terms — Molarity, Molality, Normality","Equivalent Concept & n-factor"]},
    {id:"ch2", name:"Atomic Structure",                   topics:["Dalton's Atomic Theory & its Limitations","Bohr's Model — Radius, Velocity, Energy","Quantum Mechanical Model — Schrödinger Equation (concept)","Quantum Numbers — n, l, m, s","Shapes of Orbitals — s, p, d, f","Electronic Configuration — Aufbau, Pauli, Hund's Rule","Stability of Half-filled & Fully-filled Orbitals"]},
    {id:"ch3", name:"Chemical Bonding",                   topics:["Ionic Bond — Lattice Enthalpy, Born-Haber Cycle","Covalent Bond — Lewis Structure, Formal Charge","VSEPR Theory — Geometry & Shape","Valence Bond Theory — Hybridisation (sp, sp², sp³, sp³d, sp³d²)","Molecular Orbital Theory — Bond Order, Magnetic Properties","Hydrogen Bond — Inter & Intramolecular","Fajan's Rules & Polarisation"]},
    {id:"ch4", name:"States of Matter",                   topics:["Gas Laws — Boyle's, Charles', Gay-Lussac's","Ideal Gas Equation & Dalton's Law","Kinetic Theory — vrms, vavg, vmp","Real Gases — van der Waals Equation","Liquefaction of Gases & Critical Constants","Liquid State — Surface Tension, Viscosity"]},
    {id:"ch5", name:"Thermodynamics",                     topics:["System, Surroundings, State Functions","First Law — Internal Energy, Enthalpy, Hess's Law","Enthalpies — Formation, Combustion, Bond, Neutralisation","Second Law — Entropy & Spontaneity","Gibbs Free Energy — ΔG = ΔH − TΔS","Third Law of Thermodynamics (concept)"]},
    {id:"ch6", name:"Equilibrium",                        topics:["Law of Mass Action — Kc & Kp","Relationship between Kc, Kp & Q","Le Chatelier's Principle & Applications","Ionic Equilibrium — Arrhenius, Brønsted-Lowry, Lewis","pH Scale — Strong & Weak Acids/Bases","Buffer Solutions — Henderson-Hasselbalch","Solubility Product (Ksp) & Common Ion Effect"]},
    {id:"ch7", name:"Redox & Electrochemistry",           topics:["Oxidation Number Rules","Balancing Redox — Half-Reaction Method","Galvanic Cell — EMF, Salt Bridge, Cell Notation","Nernst Equation & Equilibrium Constant","Kohlrausch's Law & Conductance","Faraday's Laws of Electrolysis","Batteries, Fuel Cells & Corrosion"]},
    {id:"ch8", name:"Chemical Kinetics",                  topics:["Rate of Reaction — Average & Instantaneous","Rate Law & Rate Constant","Order & Molecularity of Reactions","Integrated Rate Laws — Zero, 1st, 2nd Order","Half-life of Reactions","Arrhenius Equation — Activation Energy, Frequency Factor","Collision Theory & Transition State Theory"]},
    {id:"ch9", name:"Solutions",                          topics:["Types of Solutions & Concentration Terms","Raoult's Law & Vapour Pressure Lowering","Ideal & Non-Ideal Solutions, Azeotropes","Colligative Properties — Elevation in BP, Depression in FP","Osmotic Pressure — van't Hoff Equation","Abnormal Molar Mass & van't Hoff Factor"]},
    {id:"ch10",name:"Periodic Table & s-block",           topics:["Modern Periodic Law & Periodic Trends","Atomic Radius, Ionic Radius, IE, EA, Electronegativity","Anomalous Properties of 2nd Period Elements","s-block — Group 1 (Alkali Metals): Li, Na, K","s-block — Group 2 (Alkaline Earth Metals): Mg, Ca","Important Compounds — NaOH, Na₂CO₃, NaHCO₃, CaCO₃, CaO"]},
    {id:"ch11",name:"p-block Elements",                   topics:["Group 13 — Boron Family: B, Al; Borax, Boron Hydrides","Group 14 — Carbon Family: Allotropes of C, CO, CO₂, SiO₂","Group 15 — Nitrogen Family: N₂, NH₃, HNO₃, Phosphorus Allotropes","Group 16 — Oxygen Family: O₃, SO₂, SO₃, H₂SO₄","Group 17 — Halogens: HX acids, Interhalogen Compounds","Group 18 — Noble Gases: Properties & Compounds of Xe"]},
    {id:"ch12",name:"d & f Block & Coordination Compounds",topics:["d-block — Electronic Configuration, Variable Valency","Colour, Magnetic Properties & Catalytic Activity","Important Compounds: K₂Cr₂O₇, KMnO₄","f-block — Lanthanoids & Actinoids (overview)","Coordination Compounds — IUPAC Nomenclature, Ligands","VBT & Crystal Field Theory (CFT)","Isomerism in Coordination Compounds"]},
    {id:"ch13",name:"Basic Organic Chemistry",            topics:["Tetravalency of Carbon & Hybridisation","IUPAC Nomenclature — Alkanes, Alkenes, Alkynes, Functional Groups","Isomerism — Structural, Geometrical, Optical","Electronic Effects — Inductive, Resonance, Hyperconjugation","Reaction Mechanisms — Homolytic & Heterolytic Fission","Intermediates — Carbocations, Carbanions, Free Radicals","Aromaticity — Hückel's Rule"]},
    {id:"ch14",name:"Hydrocarbons",                       topics:["Alkanes — Conformations (Newman Projection), Halogenation","Alkenes — Markovnikov's Rule, Addition Reactions, Ozonolysis","Alkynes — Acidic Nature, Addition of H₂, HX, H₂O","Benzene — Resonance, EAS (Nitration, Halogenation, Sulfonation, Friedel-Crafts)","Directive Influence of Substituents"]},
    {id:"ch15",name:"Functional Group Organic Chemistry",  topics:["Haloalkanes & Haloarenes — SN1, SN2, Elimination","Alcohols & Phenols — Preparation, Reactions, Acidic Nature","Ethers — Williamson Synthesis, Cleavage","Aldehydes & Ketones — Nucleophilic Addition, Aldol, Cannizzaro","Carboxylic Acids — Acidity, Esterification, Derivatives","Amines — Basicity, Preparation, Diazonium Salts","Biomolecules — Carbohydrates, Proteins, Nucleic Acids, Vitamins","Polymers — Addition & Condensation Polymers"]},
  ],formulas:JEE_FORMULAS["jee-chem"]},

  {id:"jee-math",name:"Mathematics",code:"JEE",exam:"Apr 2026",color:"#FFE66D",icon:"📐",units:[
    {id:"ch1", name:"Sets, Relations & Functions",        topics:["Sets — Types, Union, Intersection, Complement, Venn Diagrams","Ordered Pairs & Cartesian Product","Relations — Domain, Range, Types of Relations","Functions — One-One, Onto, Bijective","Composition of Functions & Inverse","Even, Odd, Periodic, Modulus Functions"]},
    {id:"ch2", name:"Complex Numbers",                    topics:["Definition — Real & Imaginary Part","Algebra of Complex Numbers — Addition, Multiplication","Argand Plane — Modulus & Argument","Polar Form & Euler's Form","De Moivre's Theorem","Cube Roots of Unity","Complex Equations & Locus Problems"]},
    {id:"ch3", name:"Quadratic Equations",                topics:["Standard Form & Discriminant","Nature of Roots (Real, Equal, Imaginary)","Vieta's Formulas — Sum & Product of Roots","Formation of Quadratic Equation","Conditions for Common Roots","Maximum & Minimum of Quadratic Expressions","Equations Reducible to Quadratic Form"]},
    {id:"ch4", name:"Sequences & Series",                 topics:["Arithmetic Progression — nth Term, Sum","Geometric Progression — nth Term, Sum, Sum to Infinity","Harmonic Progression & HM","AM-GM-HM Inequality","Arithmetico-Geometric Progression (AGP)","Sigma Notation & Standard Summations","Special Series — Squares, Cubes"]},
    {id:"ch5", name:"Permutations & Combinations",        topics:["Fundamental Principle of Counting","Factorial Notation","Permutations — nPr, Circular, Repeated Objects","Combinations — nCr & Properties","Selection with Constraints (at least, at most)","Division into Groups","Derangements (concept)"]},
    {id:"ch6", name:"Binomial Theorem",                   topics:["Binomial Theorem for Positive Integer","General Term & Middle Term","Independent Term & Coefficient","Properties of Binomial Coefficients","Multinomial Theorem (concept)","Applications in Approximations"]},
    {id:"ch7", name:"Matrices & Determinants",            topics:["Types of Matrices — Row, Column, Square, Diagonal, Identity","Matrix Operations — Addition, Scalar Multiplication, Product","Transpose, Symmetric & Skew-Symmetric","Determinant — Expansion by Cofactors","Properties of Determinants","Adjoint & Inverse of a Matrix","System of Linear Equations — Cramer's Rule, Matrix Method"]},
    {id:"ch8", name:"Straight Lines & Circles",           topics:["Slope, Various Forms of Equation of a Line","Angle Between Lines, Perpendicular Distance","Family of Lines, Concurrent Lines","Circle — Standard & General Equation","Equation of Tangent & Normal to Circle","Chord of Contact & Chord with Midpoint","Family of Circles, Radical Axis"]},
    {id:"ch9", name:"Conic Sections",                     topics:["Parabola — Standard Forms, Tangent, Normal, Chord","Ellipse — Standard Form, Eccentricity, Tangent, Normal","Hyperbola — Standard Form, Asymptotes, Conjugate","Parametric Equations of Conics","Properties: Focal Chord, Director Circle","Subtangent & Subnormal"]},
    {id:"ch10",name:"Trigonometry",                       topics:["Measurement of Angles — Degrees & Radians","Trigonometric Ratios & Identities","Compound, Multiple & Sub-Multiple Angles","Transformation Formulas — Sum to Product, Product to Sum","Trigonometric Equations — General Solutions","Inverse Trigonometric Functions & Properties","Properties of Triangles — Sine Rule, Cosine Rule, Area"]},
    {id:"ch11",name:"Vectors & 3D Geometry",              topics:["Vectors — Types, Addition, Scalar Multiplication","Dot Product & Cross Product","Scalar Triple Product & Vector Triple Product","Direction Cosines & Direction Ratios","Equation of Line in 3D — Symmetric & Vector Form","Equation of Plane — Various Forms","Distance — Point to Line, Point to Plane, Between Parallel Planes","Skew Lines & Angle Between Line & Plane"]},
    {id:"ch12",name:"Limits, Continuity & Differentiability",topics:["Concept of Limit — Left Hand, Right Hand","Standard Limits & L'Hôpital's Rule","Continuity at a Point & on an Interval","Differentiability & Relation with Continuity","Derivatives — First Principles, Product, Quotient, Chain Rule","Implicit, Parametric & Logarithmic Differentiation","Higher Order Derivatives"]},
    {id:"ch13",name:"Applications of Derivatives",        topics:["Tangents & Normals to a Curve","Rate of Change of Quantities","Rolle's Theorem & LMVT","Increasing & Decreasing Functions","Maxima & Minima — First & Second Derivative Test","Approximations using Differentials","Curve Sketching (basics)"]},
    {id:"ch14",name:"Indefinite & Definite Integration",  topics:["Standard Integrals & Basic Rules","Integration by Substitution","Integration by Parts — ILATE Rule","Integration by Partial Fractions","Special Integrals — √(a²−x²), √(a²+x²)","Definite Integrals — Properties, King's Property","Definite Integrals as Limit of Sum","Area Under Curves — Between Two Curves"]},
    {id:"ch15",name:"Differential Equations",             topics:["Order & Degree of Differential Equations","Formation of Differential Equations","Variable Separable Method","Homogeneous Differential Equations","Linear First Order ODE — Integrating Factor","Exact Differential Equations (concept)"]},
    {id:"ch16",name:"Probability & Statistics",           topics:["Classical Probability & Axiomatic Approach","Conditional Probability & Independence","Multiplication Theorem & Bayes' Theorem","Random Variables & Probability Distributions","Binomial Distribution — Mean & Variance","Mean, Median, Mode","Variance & Standard Deviation","Correlation & Regression (basic)"]},
  ],formulas:JEE_FORMULAS["jee-math"]},
];

const SUBJECTS_NEET = [
  {id:"neet-phy",name:"Physics",code:"NEET",exam:"May 2026",color:"#FF6B35",icon:"⚛️",units:[
    {id:"ch1", name:"Physical World & Measurement",    topics:["Physical World & Scope of Physics","Units — SI System, Fundamental & Derived Units","Dimensions & Dimensional Analysis","Significant Figures & Rounding Rules","Errors — Absolute, Relative, Percentage","Propagation of Errors"]},
    {id:"ch2", name:"Kinematics",                      topics:["Distance & Displacement, Speed & Velocity","Uniform & Non-Uniform Motion","Equations of Motion (v = u+at, s = ut+½at²)","Motion Under Gravity — Free Fall, Vertical Throw","Relative Velocity in 1D & 2D","Projectile Motion — Range, Max Height, Time of Flight","Uniform Circular Motion — Centripetal Acceleration"]},
    {id:"ch3", name:"Laws of Motion",                  topics:["Newton's First Law — Inertia & Frames of Reference","Newton's Second Law — F = ma, Impulse-Momentum","Newton's Third Law — Action-Reaction","Free Body Diagrams & Equilibrium","Static & Kinetic Friction, Angle of Friction","Motion on Inclined Plane","Circular Motion — Banking, Centripetal Force"]},
    {id:"ch4", name:"Work, Energy & Power",            topics:["Work Done by Constant & Variable Force","Work-Energy Theorem","Kinetic Energy & Potential Energy","Conservative & Non-Conservative Forces","Conservation of Mechanical Energy","Power — Average & Instantaneous","Elastic & Inelastic Collisions in 1D & 2D"]},
    {id:"ch5", name:"Motion of System of Particles & Rigid Body",topics:["Centre of Mass — Position & Motion","Conservation of Linear Momentum","Torque & Couple","Moment of Inertia — Definition","Theorems: Parallel Axis & Perpendicular Axis","Angular Momentum & its Conservation","Rolling Motion — Pure Rolling Condition"]},
    {id:"ch6", name:"Gravitation",                     topics:["Newton's Universal Law of Gravitation","Acceleration due to Gravity — g at Surface","Variation of g with Height & Depth","Gravitational Field & Potential","Escape Velocity & Orbital Velocity","Kepler's Three Laws of Planetary Motion","Satellites — Geostationary & Polar Orbits"]},
    {id:"ch7", name:"Properties of Bulk Matter",       topics:["Elasticity — Stress, Strain, Hooke's Law","Young's Modulus, Bulk Modulus, Shear Modulus","Pressure in Fluids — Pascal's Law","Archimedes' Principle & Buoyancy","Viscosity — Stokes' Law, Terminal Velocity","Streamline & Turbulent Flow, Reynolds Number","Bernoulli's Theorem & Applications","Surface Tension — Drops, Bubbles, Capillary Rise"]},
    {id:"ch8", name:"Thermodynamics",                  topics:["Thermal Equilibrium & Zeroth Law","First Law of Thermodynamics — Work & Heat","Isothermal, Adiabatic, Isochoric, Isobaric Processes","Second Law — Heat Engine, Refrigerator","Carnot Engine & Efficiency","Thermal Expansion — Linear, Area, Volume","Calorimetry — Specific Heat, Latent Heat","Heat Transfer — Conduction, Convection, Radiation, Newton's Law of Cooling"]},
    {id:"ch9", name:"Behaviour of Perfect Gas & Kinetic Theory",topics:["Perfect Gas Equation & Gas Laws","Kinetic Theory Assumptions","Pressure of an Ideal Gas","Kinetic Interpretation of Temperature","RMS, Average & Most Probable Speed","Degrees of Freedom & Law of Equipartition","Mean Free Path"]},
    {id:"ch10",name:"Oscillations & Waves",            topics:["Periodic Motion — Period, Frequency, Displacement","Simple Harmonic Motion — Definition, Equation","SHM of Spring-Mass System","Simple Pendulum — Time Period","Energy in SHM","Damped & Forced Oscillations (Resonance)","Transverse & Longitudinal Waves","Speed of Wave — String & Sound","Superposition — Interference, Standing Waves","Vibrations in Strings & Organ Pipes","Doppler Effect"]},
    {id:"ch11",name:"Electrostatics",                  topics:["Electric Charge — Conservation & Quantisation","Coulomb's Law & Superposition","Electric Field — Point Charge, Dipole","Gauss's Law & Applications","Electric Potential & Potential Energy","Equipotential Surfaces","Capacitors — Parallel Plate, Dielectric","Energy Stored in Capacitor"]},
    {id:"ch12",name:"Current Electricity",             topics:["Electric Current & Drift Velocity","Ohm's Law & Resistance, Resistivity","Temperature Dependence of Resistance","Kirchhoff's Current & Voltage Laws","Wheatstone Bridge & Metre Bridge","Potentiometer — emf & Internal Resistance","Cells in Series & Parallel","Heating Effect — Joule's Law"]},
    {id:"ch13",name:"Magnetic Effects of Current & Magnetism",topics:["Biot-Savart Law — Applications","Ampere's Circuital Law","Lorentz Force on Moving Charge","Force on Current-Carrying Conductor","Torque on Current Loop — Galvanometer","Bar Magnet — Dipole Moment, Field Lines","Earth's Magnetism — Declination, Dip, Intensity","Para, Dia & Ferromagnetic Materials"]},
    {id:"ch14",name:"Electromagnetic Induction & AC",  topics:["Faraday's Law & Lenz's Law","Motional EMF & Eddy Currents","Self Inductance & Mutual Inductance","AC Voltage — Peak & RMS Values","LR, LC, LCR Circuits","Resonance in LCR Circuit","Power in AC Circuits — Power Factor","Transformer — Ideal & Losses"]},
    {id:"ch15",name:"Electromagnetic Waves",           topics:["Displacement Current (Maxwell)","Electromagnetic Spectrum — Radio to Gamma","Properties of EM Waves","Speed of Light in Vacuum"]},
    {id:"ch16",name:"Optics",                          topics:["Reflection — Plane & Spherical Mirrors (Mirror Formula)","Refraction — Snell's Law, Critical Angle, TIR","Lenses — Thin Lens Formula, Lens Maker's Equation, Power","Prism — Deviation & Dispersion","Microscope & Telescope","Wave Optics — Huygens' Principle","YDSE — Fringe Width, Coherence","Diffraction — Single Slit","Polarisation — Malus's Law, Brewster's Angle"]},
    {id:"ch17",name:"Dual Nature of Radiation & Matter",topics:["Photoelectric Effect — Einstein's Equation","Work Function & Threshold Frequency","de Broglie Hypothesis","Heisenberg Uncertainty Principle","Davisson-Germer Experiment"]},
    {id:"ch18",name:"Atoms & Nuclei",                  topics:["Rutherford's Nuclear Model","Bohr's Model — Radius, Velocity, Energy Levels","Hydrogen Spectrum — Series (Lyman, Balmer, etc.)","Nuclear Composition — Z, A, Isotopes","Mass Defect & Binding Energy","Radioactivity — α, β, γ Decay","Half-life, Mean Life & Decay Law","Nuclear Fission & Fusion"]},
    {id:"ch19",name:"Electronic Devices",              topics:["Energy Bands — Conductor, Semiconductor, Insulator","p-type & n-type Semiconductors","p-n Junction Diode — I-V Characteristics","Rectifier — Half Wave & Full Wave","Zener Diode — Voltage Regulation","LED, Photodiode & Solar Cell","Junction Transistor (concept)","Logic Gates — AND, OR, NOT, NAND, NOR"]},
  ],ncert:NEET_NCERT_LINES["neet-phy"]},

  {id:"neet-chem",name:"Chemistry",code:"NEET",exam:"May 2026",color:"#4ECDC4",icon:"🧪",units:[
    {id:"ch1", name:"Some Basic Concepts of Chemistry",topics:["Laws of Chemical Combination","Dalton's Atomic Theory","Atomic & Molecular Mass, Mole Concept","Empirical & Molecular Formula","Stoichiometry & Limiting Reagent","Concentration Terms — Molarity, Molality"]},
    {id:"ch2", name:"Structure of Atom",               topics:["Subatomic Particles — Electron, Proton, Neutron","Bohr's Model — Radii, Velocity, Energy","Quantum Mechanical Model (concept)","Quantum Numbers — n, l, m, s","Shapes of Orbitals — s, p, d","Electronic Configuration — Aufbau, Pauli, Hund's Rule","Stability of Half-filled & Fully-filled Orbitals"]},
    {id:"ch3", name:"Classification of Elements & Periodicity",topics:["Modern Periodic Law & Periodic Table","s, p, d, f Block Classification","Periodic Trends — Atomic Radius, Ionic Radius","Ionisation Enthalpy, Electron Gain Enthalpy","Electronegativity","Anomalous Behaviour of 2nd Period Elements"]},
    {id:"ch4", name:"Chemical Bonding & Molecular Structure",topics:["Ionic Bond — Lattice Enthalpy, Born-Haber Cycle","Covalent Bond — Lewis Structures, Formal Charge","VSEPR Theory — Shapes of Molecules","Valence Bond Theory & Hybridisation (sp, sp², sp³)","Molecular Orbital Theory — Bond Order, Magnetism","Hydrogen Bonding — Inter & Intramolecular","Fajan's Rules & Polarisation"]},
    {id:"ch5", name:"States of Matter",                topics:["Gas Laws — Boyle's, Charles', Gay-Lussac's","Ideal Gas Equation & Dalton's Law","Kinetic Theory — vrms, vavg, vmp","Real Gases — van der Waals Equation","Liquefaction & Critical Constants","Liquid State — Surface Tension, Viscosity"]},
    {id:"ch6", name:"Thermodynamics",                  topics:["System, Surroundings, State Functions","First Law — Internal Energy, Enthalpy","Hess's Law & Standard Enthalpies","Spontaneity — Entropy & Second Law","Gibbs Free Energy — ΔG = ΔH − TΔS","Third Law of Thermodynamics"]},
    {id:"ch7", name:"Equilibrium",                     topics:["Law of Mass Action — Kc & Kp","Relationship between Kc, Kp & Q","Le Chatelier's Principle","Ionic Equilibrium — Acids, Bases (Arrhenius, Brønsted-Lowry)","pH Scale & pH Calculations","Buffer Solutions — Henderson-Hasselbalch Equation","Solubility Product (Ksp) & Common Ion Effect"]},
    {id:"ch8", name:"Redox Reactions",                 topics:["Oxidation Number Rules & Assignment","Identifying Oxidising & Reducing Agents","Balancing Redox Reactions — Half-Reaction Method","Disproportionation Reactions"]},
    {id:"ch9", name:"Hydrogen",                        topics:["Position of Hydrogen in Periodic Table","Isotopes of Hydrogen — Protium, Deuterium, Tritium","Preparation & Properties of Hydrogen","Water — Structure, Hard & Soft Water","Hydrogen Peroxide — Structure, Preparation, Reactions","Hydrides — Ionic, Covalent, Metallic"]},
    {id:"ch10",name:"s-Block Elements",                topics:["Group 1 — Alkali Metals: Li, Na, K, Rb, Cs","Anomalous Behaviour of Lithium","Important Compounds — NaOH, Na₂CO₃, NaHCO₃","Group 2 — Alkaline Earth Metals: Mg, Ca, Ba","Important Compounds — CaO, Ca(OH)₂, CaCO₃, Plaster of Paris","Biological Importance of Na, K, Mg, Ca"]},
    {id:"ch11",name:"p-Block Elements (Groups 13–14)",  topics:["Group 13 — Boron Family: Electronic Config, Trends","Boron: Borax, Boranes, Boric Acid","Aluminium: Reactions, Alums","Group 14 — Carbon Family: Electronic Config, Trends","Allotropes of Carbon — Diamond, Graphite, Fullerene","CO, CO₂, SiO₂, Silicones, Silicates"]},
    {id:"ch12",name:"p-Block Elements (Groups 15–18)",  topics:["Group 15 — Nitrogen Family: N₂, NH₃, HNO₃","Phosphorus — Allotropes, Oxoacids","Group 16 — Oxygen Family: O₃, SO₂, SO₃, H₂SO₄","Group 17 — Halogens: HX acids, Interhalogen Compounds","Bleaching Powder & Iodine Importance","Group 18 — Noble Gases: Properties & Compounds of Xe"]},
    {id:"ch13",name:"d & f Block Elements",            topics:["d-Block — Electronic Configuration, Variable Valency","Colour & Magnetic Properties of Transition Metals","Catalytic & Complex-forming Properties","Important Compounds — K₂Cr₂O₇, KMnO₄","f-Block — Lanthanoids & Actinoids Overview","Lanthanoid Contraction & its Consequences"]},
    {id:"ch14",name:"Coordination Compounds",          topics:["Werner's Theory & Coordination Number","Types of Ligands — Mono, Bi, Poly, Ambidentate","IUPAC Nomenclature of Coordination Compounds","Isomerism — Structural & Stereoisomerism","Valence Bond Theory (VBT)","Crystal Field Theory (CFT) — Basics","Colour, Magnetic Properties & Stability","Biological Importance — Haemoglobin, Chlorophyll"]},
    {id:"ch15",name:"Haloalkanes & Haloarenes",        topics:["Classification & Nomenclature","Nature of C–X Bond","Preparation Methods","SN1 & SN2 Mechanisms — Stereochemistry","Elimination Reactions (E1, E2)","Uses — Chloroform, DDT, Freons"]},
    {id:"ch16",name:"Alcohols, Phenols & Ethers",      topics:["Classification & Nomenclature","Preparation of Alcohols & Phenols","Physical & Chemical Properties","Acidic Nature — Alcohols vs Phenols","Reactions of Phenol — Electrophilic Substitution","Ethers — Williamson Synthesis, Reactions"]},
    {id:"ch17",name:"Aldehydes, Ketones & Carboxylic Acids",topics:["Nomenclature & Structure","Preparation of Aldehydes & Ketones","Nucleophilic Addition — Cyanohydrin, Grignard","Aldol Condensation & Cannizzaro Reaction","Clemmensen & Wolff-Kishner Reduction","Carboxylic Acids — Preparation, Acidic Nature","Reactions — Esterification, Decarboxylation"]},
    {id:"ch18",name:"Amines & Biomolecules",           topics:["Classification & Nomenclature of Amines","Basicity of Amines","Preparation & Chemical Properties","Diazonium Salts & Coupling Reactions","Carbohydrates — Mono, Di, Polysaccharides","Proteins — Amino Acids, Peptide Bond, Structure Levels","Nucleic Acids — DNA & RNA Structure","Vitamins, Hormones & Enzymes (overview)"]},
    {id:"ch19",name:"Polymers & Chemistry in Everyday Life",topics:["Classification of Polymers","Addition Polymers — Polyethylene, Teflon, PVC","Condensation Polymers — Nylon, Dacron, Bakelite","Natural & Synthetic Rubber","Drugs — Analgesics, Antiseptics, Antibiotics","Artificial Sweeteners, Antacids, Food Preservatives","Soaps & Detergents — Cleansing Action"]},
    {id:"ch20",name:"Environmental & Practical Chemistry",topics:["Environmental Chemistry — Atmospheric Zones","Air Pollution — Oxides of N & S, Smog, Acid Rain","Water Pollution — BOD, Heavy Metals","Soil Pollution & Green Chemistry","Salt Analysis — Cation & Anion Identification","Titrimetry — Acid-Base, Redox Titrations","Functional Group Detection — Lassaigne's Test"]},
  ],ncert:NEET_NCERT_LINES["neet-chem"]},

  {id:"neet-bot",name:"Botany",code:"NEET",exam:"May 2026",color:"#06D6A0",icon:"🌿",units:[
    {id:"ch1", name:"The Living World",                topics:["Characteristics of Living Organisms","Diversity in the Living World — Biodiversity","Taxonomic Categories — Species to Kingdom","Taxonomical Aids — Herbarium, Botanical Gardens, Museums"]},
    {id:"ch2", name:"Biological Classification",       topics:["Five Kingdom Classification (Whittaker)","Kingdom Monera — Bacteria, Mycoplasma, Archaebacteria","Kingdom Protista — Chrysophytes, Dinoflagellates, Euglenoids, Slime Moulds","Kingdom Fungi — Phycomycetes, Ascomycetes, Basidiomycetes, Deuteromycetes","Lichens & Viroids & Viruses"]},
    {id:"ch3", name:"Plant Kingdom",                   topics:["Algae — Green, Red, Brown; Economic Importance","Bryophytes — Liverworts, Mosses; Alternation of Generations","Pteridophytes — Club Mosses, Ferns; Sporophyte Dominance","Gymnosperms — Cycas, Pinus; Naked Seeds","Angiosperms — Monocots & Dicots","Plant Life Cycles & Alternation of Generations"]},
    {id:"ch4", name:"Animal Kingdom",                  topics:["Basis of Classification — Symmetry, Coelom, Segmentation","Non-Chordates: Porifera, Coelenterata, Platyhelminthes, Aschelminthes, Annelida, Arthropoda, Mollusca, Echinodermata","Chordates: Protochordata, Cyclostomata, Chondrichthyes, Osteichthyes, Amphibia, Reptilia, Aves, Mammalia"]},
    {id:"ch5", name:"Morphology of Flowering Plants",  topics:["Root — Modifications (Storage, Climbing, Respiratory)","Stem — Modifications (Underground, Aerial, Sub-aerial)","Leaf — Types, Venation, Phyllotaxy, Modifications","Inflorescence — Racemose vs Cymose","Flower — Perianth, Calyx, Corolla, Androecium, Gynoecium","Floral Formula & Floral Diagram","Fruit — True vs False; Seed — Monocot & Dicot","Families — Fabaceae, Solanaceae, Liliaceae"]},
    {id:"ch6", name:"Anatomy of Flowering Plants",     topics:["Meristematic Tissue — Apical, Lateral, Intercalary","Simple Permanent Tissue — Parenchyma, Collenchyma, Sclerenchyma","Complex Permanent Tissue — Xylem & Phloem","Dicot Root, Monocot Root — Internal Structure","Dicot Stem, Monocot Stem — Internal Structure","Dicot Leaf, Monocot Leaf — Internal Structure","Secondary Growth — Vascular & Cork Cambium, Annual Rings"]},
    {id:"ch7", name:"Structural Organisation in Animals",topics:["Types of Animal Tissues — Epithelial, Connective, Muscular, Neural","Organ & Organ System Concept","Cockroach — Morphology, Anatomy (Digestive, Circulatory, Nervous, Reproductive)","Earthworm — Morphology, Anatomy","Frog — Morphology, Anatomy"]},
    {id:"ch8", name:"Cell: Unit of Life",              topics:["Cell Theory — Schleiden, Schwann, Virchow","Prokaryotic Cell — Bacterial Cell Structure","Eukaryotic Cell — Ultrastructure","Cell Membrane — Fluid Mosaic Model","Cell Wall, Endomembrane System (ER, Golgi)","Mitochondria & Plastids — Structure & Function","Ribosomes, Centrosome, Vacuole, Cilia, Flagella","Nucleus — Nuclear Envelope, Chromatin, Nucleolus"]},
    {id:"ch9", name:"Biomolecules",                    topics:["Carbohydrates — Monosaccharides, Disaccharides, Polysaccharides","Proteins — Amino Acids, Peptide Bonds, Primary to Quaternary Structure","Lipids — Fats, Oils, Waxes, Phospholipids","Nucleic Acids — DNA & RNA Structure","Enzymes — Classification, Active Site, Michaelis-Menten Kinetics","Factors Affecting Enzyme Activity — pH, Temperature, Inhibitors"]},
    {id:"ch10",name:"Cell Cycle & Cell Division",      topics:["Cell Cycle — G1, S, G2, M Phase","Mitosis — Prophase, Metaphase, Anaphase, Telophase","Cytokinesis — Animal vs Plant Cell","Meiosis I — Leptotene, Zygotene, Pachytene (Crossing Over), Diplotene, Diakinesis","Meiosis II — Similar to Mitosis","Significance of Mitosis & Meiosis"]},
    {id:"ch11",name:"Transport in Plants",             topics:["Means of Transport — Diffusion, Osmosis, Active Transport","Water Potential — Solute Potential, Pressure Potential","Osmosis — Endosmosis, Exosmosis, Plasmolysis","Apoplast & Symplast Pathways","Ascent of Sap — Cohesion-Tension Theory","Transpiration — Stomatal, Cuticular, Lenticular","Translocation of Solutes — Pressure Flow Hypothesis"]},
    {id:"ch12",name:"Mineral Nutrition",               topics:["Essential Mineral Elements — Criteria","Macro & Micro Nutrients — Functions & Deficiency Symptoms","Nitrogen Metabolism — Nitrogen Fixation, Ammonification, Nitrification","Symbiotic Nitrogen Fixation — Rhizobium & Root Nodules","Insectivorous Plants — Nepenthes, Drosera"]},
    {id:"ch13",name:"Photosynthesis",                  topics:["Site of Photosynthesis — Chloroplast Structure","Photosynthetic Pigments — Chl a, Chl b, Carotenoids","Light Reactions — Photosystems I & II, Z-scheme","Cyclic & Non-cyclic Photophosphorylation","Dark Reactions — Calvin Cycle (C3), RuBisCO","C4 Pathway — Hatch & Slack, Bundle Sheath Cells","CAM Plants","Photorespiration & Factors Affecting Photosynthesis"]},
    {id:"ch14",name:"Respiration in Plants",           topics:["Aerobic vs Anaerobic Respiration","Glycolysis — Steps, Products, ATP Yield","Fermentation — Alcoholic & Lactic Acid","Krebs Cycle (TCA) — Steps & Products","Electron Transport Chain & Oxidative Phosphorylation","ATP Yield — Total Accounting (36–38 ATP)","Respiratory Quotient (RQ)","Amphibolic Nature of Respiration"]},
    {id:"ch15",name:"Plant Growth & Development",      topics:["Growth — Characteristics, Phases (Lag, Log, Stationary)","Plant Growth Regulators — Auxin, Gibberellin, Cytokinin","Ethylene — Gaseous Hormone, Fruit Ripening","Abscisic Acid (ABA) — Stress Hormone, Seed Dormancy","Photoperiodism — SDP, LDP, Day-neutral Plants","Vernalisation — Cold-induced Flowering","Seed Dormancy & Germination"]},
  ],ncert:NEET_NCERT_LINES["neet-bot"]},

  {id:"neet-zoo",name:"Zoology",code:"NEET",exam:"May 2026",color:"#C77DFF",icon:"🧬",units:[
    {id:"ch1", name:"Digestion & Absorption",          topics:["Human Digestive System — GI Tract Anatomy","Histology of Gut Wall","Digestive Glands — Salivary, Gastric, Intestinal, Liver, Pancreas","Enzymes — Pepsin, Trypsin, Amylase, Lipase","Digestion of Carbohydrates, Proteins, Fats","Absorption — Small Intestine Mechanisms","Disorders — Constipation, Jaundice, Vomiting"]},
    {id:"ch2", name:"Breathing & Exchange of Gases",   topics:["Respiratory Organs — Gills, Tracheae, Lungs","Human Respiratory System — Anatomy","Mechanism of Breathing — Inspiration & Expiration","Respiratory Volumes — TV, IRV, ERV, RV, VC, TLC","Exchange of Gases — Partial Pressures","Transport of O₂ — Oxyhaemoglobin Dissociation Curve, Bohr Effect","Transport of CO₂ — Carbamino, Bicarbonate","Disorders — Asthma, Emphysema, Occupational Hazards"]},
    {id:"ch3", name:"Body Fluids & Circulation",       topics:["Blood — Composition, Plasma, Formed Elements","Blood Groups — ABO System, Rh Factor","Blood Coagulation — Steps","Lymph & Its Functions","Human Heart — Structure, Chambers, Valves","Cardiac Cycle — Systole, Diastole, Cardiac Output","ECG — P, Q, R, S, T Waves","Blood Pressure & Pulse","Double Circulation — Pulmonary & Systemic","Disorders — Hypertension, CHD, Angina, Heart Failure"]},
    {id:"ch4", name:"Excretory Products & Elimination",topics:["Modes of Excretion — Ammonotelism, Ureotelism, Uricotelism","Human Excretory System — Kidneys, Ureters, Bladder","Nephron — Structure (Bowman's Capsule, PCT, Loop of Henle, DCT)","Urine Formation — Filtration (GFR), Reabsorption, Secretion","Regulation — RAAS, ADH (Antidiuretic Hormone), ANF","Counter-Current Mechanism — Concentration of Urine","Role of Other Organs — Skin, Lungs, Liver","Disorders — Uraemia, Renal Calculi, Glomerulonephritis, Dialysis"]},
    {id:"ch5", name:"Locomotion & Movement",           topics:["Types of Movement — Amoeboid, Ciliary, Muscular","Muscle Types — Skeletal, Smooth, Cardiac","Ultrastructure of Skeletal Muscle — Sarcomere","Mechanism of Contraction — Sliding Filament Theory","Actin-Myosin Cross Bridge Cycle","Skeletal System — Axial & Appendicular Skeleton","Joints — Fibrous, Cartilaginous, Synovial","Disorders — Arthritis, Osteoporosis, Gout, Myasthenia Gravis"]},
    {id:"ch6", name:"Neural Control & Coordination",   topics:["Neuron — Structure, Types","Nerve Impulse — Resting Membrane Potential, Action Potential","Synapse — Chemical & Electrical, Neurotransmitters","CNS — Brain (Forebrain, Midbrain, Hindbrain), Spinal Cord","PNS — Somatic & Autonomic Nervous System","Reflex Arc & Reflex Action","Sense Organs — Eye (Structure & Vision), Ear (Structure & Hearing)"]},
    {id:"ch7", name:"Chemical Coordination & Integration",topics:["Endocrine Glands vs Exocrine Glands","Hypothalamus — Releasing & Inhibiting Hormones","Pituitary — Anterior (GH, TSH, ACTH, FSH, LH, Prolactin) & Posterior (ADH, Oxytocin)","Pineal Gland — Melatonin","Thyroid — T3, T4, Calcitonin; Disorders — Goitre, Cretinism","Parathyroid — PTH, Calcium Regulation","Adrenal — Cortex (Glucocorticoids, Mineralocorticoids) & Medulla (Adrenaline)","Pancreas — Insulin & Glucagon; Diabetes Mellitus","Gonads — Testosterone, Oestrogen, Progesterone","Thymus — Thymosins, Immune Function"]},
    {id:"ch8", name:"Reproduction in Organisms",       topics:["Types of Reproduction — Asexual & Sexual","Asexual — Binary Fission, Budding, Fragmentation, Vegetative Propagation","Sexual Reproduction — Pre-fertilisation, Fertilisation, Post-fertilisation Events","Significance of Sexual Reproduction"]},
    {id:"ch9", name:"Sexual Reproduction in Flowering Plants",topics:["Stamen & Pollen — Microsporogenesis","Pistil & Ovule — Megasporogenesis","Pollination — Self & Cross-Pollination, Agents","Pollen-Pistil Interaction & Recognition","Double Fertilisation — Syngamy & Triple Fusion","Post-Fertilisation — Endosperm & Embryo Development","Seed & Fruit Development","Apomixis & Polyembryony"]},
    {id:"ch10",name:"Human Reproduction",              topics:["Male Reproductive System — Testis, Epididymis, Vas Deferens, Accessory Glands","Spermatogenesis — Stages & Hormonal Control","Female Reproductive System — Ovary, Fallopian Tube, Uterus","Oogenesis — Stages & Hormonal Control","Menstrual Cycle — Follicular, Ovulatory, Luteal Phases","Fertilisation & Implantation","Embryo Development — Cleavage to Blastocyst","Placenta — Structure & Functions","Parturition (Oxytocin) & Lactation (Prolactin)"]},
    {id:"ch11",name:"Reproductive Health",             topics:["Reproductive Health — Definition & Problems","STDs — Gonorrhoea, Syphilis, AIDS, Hepatitis B","Birth Control Methods — Barrier, Oral Pills, IUDs, Surgical","Medical Termination of Pregnancy (MTP)","Amniocentesis — Sex Determination (Legal Issues)","Infertility — Causes & Treatments","Assisted Reproductive Technologies — IVF, ZIFT, GIFT, ET","Population Control Programmes in India"]},
    {id:"ch12",name:"Heredity & Variation",            topics:["Mendel's Laws — Dominance, Segregation, Independent Assortment","Monohybrid & Dihybrid Cross, Test Cross","Incomplete Dominance & Codominance","Multiple Alleles — ABO Blood Groups","Pleiotropy & Polygenic Inheritance","Chromosome Theory of Inheritance — Morgan's Work","Linked Genes & Crossing Over — Recombination Frequency","Sex Determination — XX/XY, ZW/ZZ, XO Systems","Sex-linked Inheritance — Haemophilia, Colour Blindness","Pedigree Analysis — Autosomal & X-linked Traits","Chromosomal Disorders — Down's, Turner's, Klinefelter's Syndromes"]},
    {id:"ch13",name:"Molecular Basis of Inheritance",  topics:["DNA as Genetic Material — Griffith, Hershey-Chase Experiments","DNA Structure — Watson & Crick Double Helix (1953), Chargaff's Rules","DNA Packaging — Histone Proteins, Nucleosome, Chromatin","DNA Replication — Semi-Conservative (Meselson & Stahl)","Transcription — mRNA Synthesis, Promoter, Template Strand","Genetic Code — Triplet, Degenerate, Universal, Start & Stop Codons","Translation — Ribosomes, tRNA (Adaptor), Aminoacyl-tRNA","Regulation of Gene Expression — Lac Operon (Jacob & Monod)","Human Genome Project — Salient Features","DNA Fingerprinting — VNTR, Applications"]},
    {id:"ch14",name:"Evolution",                       topics:["Origin of Life — Chemical Evolution, Miller-Urey Experiment","Theory of Biological Evolution — Lamarck, Darwin","Natural Selection — Types (Stabilising, Directional, Disruptive)","Modern Synthetic Theory (Neo-Darwinism)","Mechanisms — Mutation, Recombination, Genetic Drift, Gene Flow","Hardy-Weinberg Principle & Equilibrium","Adaptive Radiation — Darwin's Finches, Australian Marsupials","Human Evolution — Dryopithecus to Homo sapiens"]},
    {id:"ch15",name:"Human Health & Disease",          topics:["Common Diseases — Typhoid, Pneumonia, Common Cold, Malaria, Amoebiasis, Ringworm","Immunity — Innate & Acquired (Active & Passive)","Immune System — B & T Lymphocytes, Antibodies (IgG, IgM, IgA, IgE, IgD)","Vaccination & Immunisation","AIDS — HIV Structure, Transmission, ART","Cancer — Benign vs Malignant, Carcinogens, Oncogenes, Metastasis","Drugs & Alcohol Abuse — Opioids, Cannabinoids, Barbiturates"]},
    {id:"ch16",name:"Strategies for Enhancement in Food Production",topics:["Plant Breeding — Steps: Collection, Hybridisation, Selection, Release","Hybridisation & Heterosis","Biofortification — Golden Rice, Iron-rich Maize","SCP (Single Cell Protein) — Spirulina","Tissue Culture — Totipotency, Micropropagation, Somatic Hybridisation"]},
    {id:"ch17",name:"Microbes in Human Welfare",       topics:["Microbes in Household Products — Curd, Bread, Idli","Industrial Microbiology — Beverages, Antibiotics (Penicillin), Chemicals","Microbes in Sewage Treatment — BOD, Activated Sludge","Biogas Production — Methanogens","Biocontrol Agents — Bt Toxin, Baculoviruses, Trichoderma","Biofertilisers — Rhizobium, Azotobacter, Mycorrhiza, Cyanobacteria"]},
    {id:"ch18",name:"Biotechnology & Applications",    topics:["Principles — Restriction Enzymes (EcoRI), Ligase, Vectors (Plasmid, Phage)","Recombinant DNA Technology — Steps","PCR — Polymerase Chain Reaction","Gel Electrophoresis","Transgenic Animals — Human Insulin, Bt Crops (cry genes), Golden Rice","Gene Therapy — ADA Deficiency","Molecular Diagnosis — ELISA, PCR in Diagnosis","Biosafety — Biopiracy, IPR, Ethical Issues"]},
    {id:"ch19",name:"Organisms & Populations",         topics:["Ecology — Definition, Levels of Organisation","Abiotic Factors — Temperature, Water, Light, Soil","Biotic Interactions — Mutualism, Commensalism, Parasitism, Predation, Competition, Amensalism","Population Attributes — Natality, Mortality, Age Distribution","Population Growth — Exponential (J-curve) & Logistic (S-curve)","Life History Variation — r & K Strategy","Population Interactions — Examples"]},
    {id:"ch20",name:"Ecosystem, Biodiversity & Conservation",topics:["Ecosystem — Structure, Productivity, Decomposition","Food Chain & Food Web, Trophic Levels","Energy Flow — 10% Law (Lindeman), Ecological Pyramids","Biogeochemical Cycles — C, N, P Cycles","Ecosystem Services & Stability","Biodiversity — Types: Genetic, Species, Ecosystem","Patterns — Latitudinal Gradient, Species-Area Relationship","Loss of Biodiversity — Extinction, Habitat Loss","Conservation — In-situ (National Parks, Sanctuaries, Biosphere Reserves) & Ex-situ (Zoos, Seed Banks)","Environmental Issues — Deforestation, Ozone Depletion, Global Warming, Biomagnification"]},
  ],ncert:NEET_NCERT_LINES["neet-zoo"]},
];

const SUBJECTS_NFSU = SUBJECTS; // already defined above

// ══════════════════════════════════════════════════════════════
// NFSU B.Sc. LL.B. — SEMESTER 1 SUBJECTS
// ══════════════════════════════════════════════════════════════
const SUBJECTS_NFSU1 = [
  {id:"s1-legal",name:"Legal Methods",code:"SLBSL-S1-P1",exam:"",color:"#FFD23F",icon:"📚",units:[
    {id:"u1",name:"Nature of Law",topics:[
      "Meaning, Nature, Scope and Development of Law",
      "Functions of Law — Regulation of Conduct, Remedies, Policies and Social Engineering",
      "Law and Society — Social, Political and Economic aspects of law",
      "Classification of Law: Public-Private, Criminal-Civil, Substantive-Procedural, Municipal-International",
      "Common Law and Civil Law",
    ]},
    {id:"u2",name:"Sources of Law",topics:[
      "Formal and Informal Sources — Material and Historical",
      "Statutes — Types and Functions, Internal and External Aids, Parts of Statutes",
      "Case Laws/Precedents — Parts of Precedents, Majority-Minority judgments",
      "Religion, Conventions, Opinions as source of law",
      "Textbooks and E-Library Sources",
      "Materials to Statutes — Parliamentary Debates and Discussions, Commission Reports",
    ]},
    {id:"u3",name:"Legal Systems",topics:[
      "Major Legal Systems of the World — Common Law and Civil Law",
      "Romano-Germanic Family, Religious Legal System",
      "Structure of Indian Legal System",
      "Constitution, Hierarchy of Courts and Jurisdiction",
      "Administration of Justice — Law and Justice",
    ]},
    {id:"u4",name:"Legal Research",topics:[
      "Legal Research — Meaning, Objectives and Approaches",
      "Nature of Research — Doctrinal, Non-Doctrinal, Legal, Interdisciplinary Research",
      "Methodology — Tools and Techniques, Data Sampling, Data Process and Interpretation of Data",
      "E-sources — Use of Westlaw, Hein Online, LexisNexis, Taxmann, Indlaw and Manupatra — Articles and Case on electronic mode",
      "Mode of Citation and Bibliography",
    ]},
  ]},
  {id:"s1-tort",name:"Law of Tort and Consumer Protection Laws",code:"SLBSL-S1-P2",exam:"",color:"#FF6B35",icon:"⚖️",units:[
    {id:"u1",name:"Introduction",topics:[
      "Introduction to Torts — Meaning, Definitions, Aim and Scope",
      "Nature of Torts: Tort as distinguished from Crime, Contract, Breach of Trust & Quasi Contract; Law of tort vs. Law of torts",
      "General Principles of Tort Liability — Elements of Torts, Principles of Liability, Essential Conditions of Liability, Standing",
      "Justifications in Torts — Volenti Non-Fit Injuria, Necessity, Plaintiff's default, Act of god, Inevitable accident, Private defense, Statutory authority, Judicial and quasi-judicial acts, Parental and quasi-parental authority",
    ]},
    {id:"u2",name:"Principles of Liability and Specific Torts",topics:[
      "Vicarious Liability, Strict and Absolute Liability",
      "Negligence: Basic Concept, Duty of Care — Essentials, Breach of Duty, Damages, Contributory Negligence",
      "Nuisance: Definition, Essentials, Types",
      "Assault, Battery, False Imprisonment, Malicious Prosecution",
    ]},
    {id:"u3",name:"Specific Torts",topics:[
      "Defamation: Definition, Elements, Libel and Slander, Innuendo, Defenses and Remedies",
      "Trespass: Meaning, Defenses, Remedies, Trespass to goods by Conversion",
      "Cyber Torts: Meaning and Scope, Stalking, Breach of Privacy, Defamation; Remedies",
      "Doctrine of Sovereign Immunity and its Relevance in India",
    ]},
    {id:"u4",name:"Consumer Protection and MV Act",topics:[
      "Consumer Protection Act 2019 — Introduction, Concept of Consumer, Goods and Services",
      "Liability under the Act, Redressal mechanism",
      "Motor Vehicles Act 1988 — Introduction, Aim and Overview; Licensing, Registration",
      "Offences, Penalties and Procedures",
    ]},
  ]},
  {id:"s1-literature",name:"Law and Literature",code:"SLBSL-S1-P3",exam:"",color:"#C77DFF",icon:"📖",units:[
    {id:"u1",name:"Poetry",topics:[
      "\"The Unknown Citizen\" by W.H. Auden",
      "\"Mind Without Fear\" by Rabindranath Tagore",
      "Mending Wall by Robert Frost",
      "\"The Constable Calls\" by Seamus Heaney",
      "Stopping by Woods on a Snowy Evening by Robert Frost",
      "The Mountain and the Squirrel by Ralph Waldo Emerson",
      "Indian Weavers by Sarojini Naidu",
    ]},
    {id:"u2",name:"Prose: Masters of English Prose",topics:[
      "Of Friendship — Francis Bacon",
      "Too Dear! — Leo Tolstoy",
      "Forgetting — Robert Lynd",
      "The Proposal — Anton Chekhov",
      "The Five Functions of the Lawyer by Arthur T. Vanderbilt",
      "The Idea that Have Harmed the Mankind by Bertrand Russell",
      "Advice to a Young Man Interested in Going into Law by Felix Frankfurter",
    ]},
    {id:"u3",name:"Drama and Performance",topics:[
      "The Court Scene (Act IV, Scene I) in The Merchant of Venice",
      "All My Sons by Arthur Miller",
    ]},
    {id:"u4",name:"Book Review",topics:[
      "The Trial by Franz Kafka",
      "The Law and the Lawyers by M.K. Gandhi",
      "Animal Farm by George Orwell",
      "To Kill a Mockingbird by Harper Lee",
    ]},
  ]},
  {id:"s1-compcore",name:"Fundamentals of Computer Organization & Embedded Systems",code:"SLBSL-S1-P4",exam:"",color:"#4ECDC4",icon:"💻",units:[
    {id:"u1",name:"Basics of Computers; Boolean Algebra and Logic Circuits",topics:[
      "Computer, Data Processing, Characteristics of Computer, History of Computer, Computer Generations",
      "Basic Organization of Computer, Number System (Decimal, Binary, Octal, Hexadecimal), Basic Binary Arithmetic",
      "Introduction to Computer Code (ASCII, BCD, EBCDIC, UNICODE)",
      "Boolean Algebra: Fundamental Concepts, Boolean Functions, Logic Gates (AND, OR, NOT), Universal Gates (NAND, NOR), Exclusive Gates (EX-OR, EX-NOR)",
      "Combinational Circuits (Half Adder, Full Adder), Flip Flops (SR, D, JK, T), Registers, Decoders, Multiplexers",
    ]},
    {id:"u2",name:"I/O Organization, Processor and Memory",topics:[
      "Introduction to I/O Devices, Accessing I/O Devices, Interrupts, Bus Structure and Operation",
      "Basic Processor and Memory Architecture of Computer System, Instruction Set",
      "Introduction to Commonly Used Registers, Types of Processor",
      "Main Memory, RAM, ROM, Brief Introduction of Primary and Secondary Storage Devices and its Types",
    ]},
    {id:"u3",name:"Embedded Systems and Operating System",topics:[
      "Introduction to Embedded System, Examples of Embedded Systems",
      "Microcontroller Chips for Embedded Applications, A Simple Microcontroller (Parallel I/O Interface, Serial I/O Interface)",
      "Sensors and Actuators, Design Issues",
      "Define Operating System, Types of OS, Basic Terminologies of OS, Basic Commands of DOS",
    ]},
    {id:"u4",name:"Office Automation Fundamentals",topics:[
      "Introducing MS-Word — Creating and Formatting Text Documents, Mail Merge, Page Setup, Creating Tables",
      "Introducing MS-Excel — Formatting Workbook, Conditional Formatting, Sorting Data, Filtering Data, Creating Charts, Basic Functions and Formulae",
      "Introducing MS-PowerPoint — Creating Presentation, Enhancing Presentation Using Multimedia",
      "Introducing MS-Access — Creating Database, Working with Tables, Queries, Forms and Reports",
    ]},
  ]},
  {id:"s1-c",name:"Basic Programming Concepts Using C",code:"SLBSL-S1-P5",exam:"",color:"#06D6A0",icon:"🖥️",units:[
    {id:"u1",name:"Pre-Programming Techniques & Getting Started with C",topics:[
      "Introduction to Machine Level Language, Assembly Language, Higher Level Language, Limitations and Features",
      "Classification of Computer Language — Procedural Language and Non-Procedural Language",
      "Tools and Techniques of Problem Analysis: Algorithm Development, Flow-Chart, Examples",
      "Basic Structure of C, Executing a C Program, Character Set & C Tokens",
      "Identifiers & Keywords, Data Types, Constants and Variables, Type Casting, Comments",
    ]},
    {id:"u2",name:"Operators, Expressions and Control Structures",topics:[
      "Types of Operators and Expressions, Precedence and Associativity",
      "Console Based I/O and Related Built-in I/O Function, Concept of Header File",
      "Decision Making and Loop Control Structure: if, if-else, nested if-else, switch-case, while, do-while, for, nested loop",
      "Jumping Statements: break, continue, goto",
    ]},
    {id:"u3",name:"Array, Pointer and Strings",topics:[
      "Array: One and Two-Dimensional Arrays, Initialization and Working with Array, Introduction to Multidimensional Arrays",
      "Pointer: Introduction to Pointer, Array of Pointers, Pointer to Array, Pointer to Function",
      "Character Arrays and Strings: Initialization and Working with String, String Handling Functions",
    ]},
    {id:"u4",name:"Functions, Structure, Union and File Handling",topics:[
      "Functions: Type of Function, Standard Library Function, User Defined Function, Categories of UDF",
      "Recursion, Nesting Function, Variable Scope, Visibility and Lifetime in Function, Call by Value, Call by Reference, Storage Classes",
      "Structure and Union: Defining Structure, Declaration and Initialization of Structure Variables, Accessing Structure Members, Pointer to Structure, Introduction to Union",
      "File Handling: Introduction, Concept of File Management, Defining File and its Operations, File Functions — fopen(), fclose(), fprintf(), fscanf(), getc(), getw(), putc(), putw()",
    ]},
  ]},
  {id:"s1-discmath",name:"Discrete Mathematics",code:"SLBSL-S1-P6",exam:"",color:"#A8DADC",icon:"🔢",units:[
    {id:"u1",name:"Set Theory & Progressions",topics:[
      "Set Theory: Basic Concepts of Set Theory, Method of Representation of a Set, Operations on Sets & its Properties",
      "De Morgan's Laws with Logical Proof, Difference of Two Sets, Cartesian Products, Typical Examples",
      "Arithmetic & Geometric Progression: Sequence, Series, Arithmetic Progression (Definition & Nth term, Sum of n terms)",
      "Geometric Progression (Definition & Nth term, Sum of n terms), Harmonic Progression, Relation between AM, GM, HM, Examples",
    ]},
    {id:"u2",name:"Matrices and Determinants",topics:[
      "Introduction, Different Types of Matrix (Square, Column, Row, Diagonal, Unit, Null Matrix)",
      "Transpose of Matrix, Addition, Subtraction & Multiplication of Two Matrices, Adjoint of a Square Matrix, Inverse of Matrix",
      "Determinant: Introduction, 2×2, 3×3 Order Determinant",
      "Cramer's Method for Solving Linear Equations (Two and Three Variables), Properties of Determinants, Examples",
    ]},
    {id:"u3",name:"Propositional and Predicate Logic",topics:[
      "Propositional Logic: Definition, Statements & Notation, Truth Values, Connectives, Statement Formulas & Truth Tables",
      "Well-formed Formulas, Tautologies, Equivalence of Formulas, Duality Law, Tautological Implications, Examples",
      "Predicate Logic: Definition of Predicates, Statement Functions, Variables, Quantifiers, Predicate Formulas",
      "Free & Bound Variables, The Universe of Discourse, Valid Formulas & Equivalences, Examples",
    ]},
    {id:"u4",name:"Relations and Functions",topics:[
      "Functions: Definition and Introduction, Range, Image, Co-domain, Value of Function, Composition of Function",
      "Inverse Function, Plain and One-to-One, Onto Function, The Pigeon-Hole Principle",
      "Relations: Definition, Binary Relation, Representation, Domain, Range, Universal Relation, Void Relation",
      "Union, Intersection and Complement Operations on Relations; Properties: Reflexive, Symmetric, Transitive, Anti-symmetric",
      "Relation Matrix and Graph of a Relation; Partition and Covering of a Set, Equivalence Relation, Equivalence Classes",
      "Compatibility Relation, Maximum Compatibility Block, Composite Relation, Converse of a Relation, Transitive Closure of a Relation in Set X",
    ]},
  ]},
];

// ══════════════════════════════════════════════════════════════
// NFSU B.Sc. LL.B. — SEMESTER 3 SUBJECTS
// ══════════════════════════════════════════════════════════════
const SUBJECTS_NFSU3 = [
  {id:"s3-crimes",name:"Law of Crimes I",code:"SLBSL-S3-P1",exam:"",color:"#FF6B35",icon:"⚖️",units:[
    {id:"u1",name:"Introduction to Crime & Punishment",topics:[
      "Nature & definition of crime",
      "Constituent elements of crime",
      "Extent & application of IPC; Structure of IPC",
      "General Explanations: Mistake, Ignorantia facti excusat, Ignorantia juris, Accident, Infancy, Insanity, Intoxication, Consent",
      "Punishments: Fine, Imprisonment (Simple, Rigorous, Solitary), Life, Capital Punishment, Punishment for abetment & harboring",
      "General Exceptions (Chapter IV); Private Defense (Sec. 96–106)",
      "Principle of Mens Rea & Strict Liability",
    ]},
    {id:"u2",name:"Criminal Conspiracy & Offences Against State",topics:[
      "Definition, Punishment, Offences against the State",
      "Waging War, Sedition, Responsibility of public servant",
      "Offences relating to Army, Navy & Air force",
      "Unlawful assembly, Rioting, Assaulting/obstructing public servant",
      "Provocation & communal enmity, Affray",
      "Offence of abetment (Chapter V)",
      "Group liability, Joint liability (Sec. 34), Vicarious liability (Sec. 141–149)",
    ]},
    {id:"u3",name:"Offences Relating to Human Body",topics:[
      "Culpable homicide & murder (Sec. 299–302, 304 read with Sec. 8–11, 21, 32, 33, 39, 52)",
      "Specific exceptions to Sec. 300; General & Partial Defenses",
      "Homicide by Rash or Negligent Act not amounting to Culpable Homicide (Sec. 304A)",
      "Kidnapping & abduction (Sec. 359–363 read with Sec. 18, 82, 83, 90)",
      "Sexual Offences — Rape (Sec. 375, 376, 376A-E read with Sec. 90)",
      "Unnatural Offences (Sec. 377); POCSO Act, 2012",
      "Assault/Criminal force to women (Sec. 354); Sexual Harassment, Disrobing, Voyeurism, Stalking (Sec. 354A-D, 509)",
    ]},
    {id:"u4",name:"Offences Relating to Property & Other Offences",topics:[
      "Theft, Extortion, Robbery, Dacoity (Sec. 378, 379, 383, 384, 390, 391 read with Sec. 22–25, 27, 29, 30, 44)",
      "Criminal Misappropriation, Criminal Breach of trust & Cheating (Sec. 403–405, 415–416, 420 read with Sec. 29–30)",
      "Receiving Stolen Property, Trespass, Forgery",
      "Falsification of accounts, Defamation, Criminal Intimidation",
      "Insult & Annoyance, Attempt to commit offence (Sec. 511, 307, 309)",
    ]},
  ]},
  {id:"s3-const",name:"Constitutional Law I",code:"SLBSL-S3-P2",exam:"",color:"#4ECDC4",icon:"🏛️",units:[
    {id:"u1",name:"Introduction to Indian Constitution & Citizenship",topics:[
      "Making of the Constitution: Government of India Act 1935, Constituent Assembly",
      "Sources of Indian Constitution",
      "Nature of Indian Constitution: Unitary or Federal",
      "Salient Features of Indian Constitution",
      "Citizenship (Articles 5–11): Meaning, Nature, Kinds; Difference between Citizenship & Nationality",
    ]},
    {id:"u2",name:"Fundamental Rights: Right to Equality (Art. 12–18)",topics:[
      "Meaning of Fundamental Rights; Difference between Human Rights & Fundamental Rights",
      "Article 12 — Meaning & Definition of State; Concept of Other Authorities (leading cases)",
      "Article 13 — Doctrine of Eclipse, Severability, Waiver",
      "Article 14 — Right to Equality, Rule of Law, Doctrine of Reasonable Classification",
      "Article 15 — Prohibition of Discrimination (religion, race, caste, sex, place of birth); Mandal Commission case",
      "Article 16 — Equality of Opportunity in Public Employment; Protective Discrimination doctrine",
      "Article 17 — Abolition of Untouchability; Article 18 — Abolition of Titles",
    ]},
    {id:"u3",name:"Fundamental Rights: Freedoms & Right against Exploitation (Art. 19–24)",topics:[
      "Article 19 — Right to Freedoms: speech & expression, association, movement, residence, trade & profession",
      "Reasonable restrictions on freedoms; Article 20 — Protection in respect of conviction of offences",
      "Article 21 — Right to Life and Personal Liberty; Article 21A — Right to Education",
      "Article 22 — Protection against arrest and Detention",
      "Article 23 — Prohibition of trafficking; Article 24 — Prohibition of Employment of children",
    ]},
    {id:"u4",name:"Fundamental Rights: Religion, Culture & Remedies (Art. 25–32 & 226)",topics:[
      "Articles 25–28 — Right to Freedom of Religion",
      "Articles 29 & 30 — Cultural & Educational Rights",
      "Article 32 — Right to Constitutional Remedies; Judicial Review; Judicial Activism",
      "Public Interest Litigation — Meaning, Concept, Reasons for growth, Relevance in modern times",
      "Article 226 — High Court writs",
    ]},
    {id:"u5",name:"Directive Principles & Fundamental Duties (Art. 36–51A)",topics:[
      "Articles 36–51 — Directive Principles of State Policy: Nature & Justifiability",
      "Inter-relationship between Fundamental Rights & Directive Principles",
      "Enforceability of Directive Principles",
      "Article 51A — Fundamental Duties",
    ]},
  ]},
  {id:"s3-contract",name:"Law of Contract I",code:"SLBSL-S3-P3",exam:"",color:"#06D6A0",icon:"📜",units:[
    {id:"u1",name:"Formation of Contract",topics:[
      "Meaning, Nature & Scope of Contract",
      "Offer/Proposal: Definition, Communication, Revocation, General & Specific Offer, Invitation to Treat",
      "Acceptance: Definition, Communication, Revocation, Tenders/Auctions",
      "Effect of Void, Voidable, Valid, Illegal, Unlawful Agreements",
      "Case Laws: Felthouse v. Bindley, Carlill v. Carbolic Smoke Balls Company, Hyde v. Wrench, Lalman Shukla v. Gauri Dutt",
    ]},
    {id:"u2",name:"Consideration & Capacity",topics:[
      "Consideration: Definition, Kinds, Essentials, Privity of Contract",
      "Capacity to Enter into a Contract; Minor's Position, Nature/Effect of Minor's Agreements",
      "Case Laws: Mohori Bibee v. Damodar Ghose",
      "Mistake; Unlawful Consideration & Object",
      "Case Laws: Raffles vs Wichelhaus, Chikkam Ammiraju & Ors. v. Chikkam Seshamma & Anr",
      "Lingo Bhimrao Naik v. Dattatrya Shripad Jamadagni, Bimla Bai vs Shankarlal, Bisset Wilkinson, Dularia Devi v. Janardan Singh",
    ]},
    {id:"u3",name:"Validity, Discharge & Performance of Contract",topics:[
      "Free Consent: Coercion, Undue Influence, Misrepresentation, Fraud, Mistake",
      "Unlawful Consideration & Object; Discharge of Contracts",
      "Performance, Impossibility of Performance & Frustration",
      "Breach: Anticipatory & Present",
      "Case Laws: Raffles vs Wichelhaus, Chikkam Ammiraju, Lingo Bhimrao Naik v. Dattatrya Shripad Jamadagni",
    ]},
    {id:"u4",name:"Remedies & Quasi Contracts",topics:[
      "Breach & Remedies: Damages — Kinds, Quantum Meruit",
      "Quasi Contracts",
      "Case Laws: Cutter v. Powell [1795], Ritchie v. Atkinson (1808), Bolton v. Mahedeva [1972], Sumpter v. Hedges (1898)",
    ]},
  ]},
  {id:"s3-family",name:"Family Law I",code:"SLBSL-S3-P4",exam:"",color:"#C77DFF",icon:"👨‍👩‍👧",units:[
    {id:"u1",name:"Introduction to Personal Laws",topics:[
      "Historical development of Hindu Law",
      "Sources of Hindu Law — Ancient Sources: Shrutis & Smritis, Commentaries & Digest, Custom; Modern Sources: Judicial Decisions, Legislations, Equity, Justice & Good Conscience",
      "Sources of Muslim Law — Primary: Quran, Sunnat, Ahadis, Ijma, Qiyas; Secondary: Custom, Judicial Decision, Legislation, Equity, Justice & Good Conscience",
      "Schools of Hindu Law & Muslim Law",
    ]},
    {id:"u2",name:"Marriage Under Personal Laws",topics:[
      "Nature, Definition & Forms of Marriage",
      "Conditions for validity of Marriage; Registration of Marriage",
      "Marriage Ceremonies & proof of Marriage; Degree of Prohibited relationship & Sapinda relationship",
      "Void & Voidable Marriages",
      "Definition, Nature & Scope of Muslim Marriage (Nikah); Capacity to marry under Muslim Law",
      "Classification of Muslim Marriage; Essential Conditions of Muslim Marriage",
      "Dower/Mahr — Concept & Kinds",
    ]},
    {id:"u3",name:"Divorce & Dissolution Under Personal Laws",topics:[
      "Matrimonial Remedies under Hindu Law: Restitution of Conjugal Rights, Judicial Separation, Nullity of Marriage",
      "Divorce under Hindu Law: Grounds for divorce, Irretrievable breakdown theory",
      "Muslim Divorce: Talaq (Ahsan, Hasan, Bid'ah), Ila, Zihar, Khula, Mubarat",
      "Dissolution of Muslim Marriage under Muslim Women (Protection of Rights on Divorce) Act",
    ]},
    {id:"u4",name:"Maintenance, Adoption & Guardianship",topics:[
      "Maintenance under Hindu Law & Muslim Law",
      "Adoption: Hindu Adoptions & Maintenance Act, 1956 — essentials, who can adopt/be adopted, effects",
      "Guardianship: Hindu Minority & Guardianship Act, 1956; Types of guardians",
      "Guardianship under Muslim Law",
      "Child custody principles & welfare of the child",
    ]},
  ]},
  {id:"s3-web",name:"Web Programming",code:"SLBSL-S3-P5",exam:"",color:"#FFE66D",icon:"🌐",units:[
    {id:"u1",name:"Introduction to WEB, HTML & Advanced HTML5",topics:[
      "Basics of WWW, HTTP & HTTPS protocol: Request and Response",
      "Web browser, Introduction to web server, Client-Server architecture",
      "Fundamentals of HTML: Basic Tags & Attributes, Formatting Tags, List tags, Link tag",
      "Adding image, table, frame, forms",
      "HTML5 Document structure: section, article, aside, header, footer, nav, dialog, figure",
      "HTML5 Attributes of web form: datetime, date, month, week, time, number, range, email, url, Audio, Video",
    ]},
    {id:"u2",name:"JavaScript & CSS",topics:[
      "Introduction to JavaScript: variables, operators, conditional statements, loops, break & continue",
      "Dialog boxes, Array, UDF, Built-in functions (String, math, date, array)",
      "Events: onclick, ondblclick, onmouseover, onmouseout, onkeypress, onkeyup, onblur, onfocus, onload, onchange, onsubmit, onreset",
      "Form validation",
      "Style sheets: Need for CSS, Introduction to CSS, basic syntax & structure",
      "Using CSS: background images, colors & properties, manipulating texts, fonts, borders & boxes, margins, padding, lists, positioning",
    ]},
    {id:"u3",name:"PHP Basics",topics:[
      "Introduction to PHP; PHP configuration in Apache & IIS web server",
      "PHP variables, GET & POST method, PHP operators",
      "Conditional & looping structure, array",
      "User-Defined Function: Argument, default argument, variable function, variable-length argument function (func_num_args, func_get_arg, func_get_args)",
      "Built-in functions: String, math, date, array, Misc",
      "File handling",
    ]},
    {id:"u4",name:"PHP with MySQL",topics:[
      "Working with MySQL: SQL DML statements (Insert, update, delete, select)",
      "PHP-MySQLi connectivity; PHP-MySQLi Functions",
      "mysqli_connect, mysqli_close, mysqli_error, mysqli_errno, mysqli_select_db, ysqli_query",
      "mysqli_fetch_array, mysqli_num_rows, mysqli_affected_rows, mysqli_fetch_assoc, mysqli_fetch_field",
      "mysqli_fetch_object, mysqli_fetch_row, mysqli_insert_id, mysqli_num_fields, mysqli_data_seek",
    ]},
  ]},
  {id:"s3-os",name:"Operating System Concepts",code:"SLBSL-S3-P6",exam:"",color:"#A8DADC",icon:"💻",units:[
    {id:"u1",name:"Introduction to OS & Memory Management",topics:[
      "What is Operating System? Types: batch system, time sharing, distributed, real time system",
      "Memory Management: Basic memory organization, single user contiguous scheme",
      "Fixed & dynamic partition, allocation & deallocation methods",
      "Concept of paging, page fault, fragmentation, segmentation",
      "Page replacement algorithms: FIFO, LRU",
      "Process concept, process states, process control block",
      "Scheduling criteria, process scheduling policies: FCFS, SJF, RR",
      "Concept of thread, switching",
    ]},
    {id:"u2",name:"Deadlock, Process Synchronization & I/O Management",topics:[
      "What is deadlock? Cases for deadlock, conditions for deadlock",
      "Deadlock detection & recovery; deadlock prevention & avoidance",
      "Parallel processing, multiprocessing configurations",
      "Process synchronization, race condition, critical section, Semaphore",
      "IPC problems: producer-consumer/reader-writer problem, dining philosopher problem",
      "Principles of I/O devices, device controller, management of I/O request",
      "Device handler seek strategies/disk scheduling algorithms: FCFS, SSTF, Elevator",
    ]},
    {id:"u3",name:"Linux/Unix Commands & Shell Programming",topics:[
      "What is kernel, shell?",
      "General purpose utility commands: cal, date, echo, bc, who, uname, tty, ps, kill, man, banner, passwd, clear, history",
      "File management commands: ls, cd, mkdir, rmdir, pwd, touch, file, cp, mv, rm, cat, more, head, tail",
      "vi editor, File permission commands, File system commands",
      "Shell scripting: variables, decision making (if-then-else, case), loops (while, until, for), functions",
    ]},
  ]},
];

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

// ── UNIFIED MULTI-STEP COURSE SELECTOR ──────────────────────────────────────
// Step 1: Pick category  (NFSU / CBSE / Competitive)
// Step 2: Pick sub-item  (degree / class / exam)
// Step 3: Pick final     (semester / stream) — only where applicable
// ─────────────────────────────────────────────────────────────────────────────
const COURSE_TREE = [
  {
    id: 'nfsu_group', icon: '🎓', label: 'NFSU',
    desc: 'National Forensic Sciences University',
    children: [
      {
        id: 'nfsu_llb', icon: '⚖️', label: 'B.Sc. LL.B. (Hons.)',
        desc: 'Integrated Law Programme',
        children: [
          { id: 'nfsu3', icon: '3️⃣', label: 'Semester III', desc: 'Law of Crimes · Constitutional Law · Contract · Family Law · Web Programming · OS' },
          { id: 'nfsu',  icon: '2️⃣', label: 'Semester II',  desc: 'C++ · RDBMS · Legal Language · Statistics · Law · Jurisprudence' },
          { id: 'nfsu1', icon: '1️⃣', label: 'Semester I',   desc: 'Legal Methods · Tort & Consumer Law · Computer Organization · C Programming · Discrete Maths' },
        ]
      }
    ]
  },
  {
    id: 'cbse_group', icon: '🏫', label: 'CBSE',
    desc: 'Central Board of Secondary Education',
    children: [
      {
        id: 'cbse10', icon: '📚', label: 'Class 10',
        desc: 'Maths · Science · English · Social Science · Hindi',
        leaf: true
      },
      {
        id: 'cbse12_group', icon: '🎓', label: 'Class 12',
        desc: 'Science / Commerce / Arts',
        children: Object.entries(CBSE12_STREAMS).map(([id,s])=>({ id, icon:'📖', label:s.label, desc:s.desc, cbse12stream:true }))
      }
    ]
  },
  { id: 'jee',  icon: '📐', label: 'JEE (Mains & Advanced)', desc: 'Physics · Chemistry · Mathematics', leaf: true },
  { id: 'neet', icon: '🧬', label: 'NEET UG',               desc: 'Physics · Chemistry · Botany · Zoology', leaf: true },
];

function _csOverlayShell(content, breadcrumb){
  return `<div id="course-selector-overlay" style="position:fixed;inset:0;background:#08080fee;z-index:9990;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);padding:20px">
    <div style="background:#0f0f18;border:1px solid #FFE66D44;border-radius:20px;padding:0;max-width:440px;width:100%;max-height:90vh;display:flex;flex-direction:column;animation:fadeInUp 0.3s ease">
      <div style="padding:22px 24px 16px;border-bottom:1px solid #ffffff08;flex-shrink:0">
        <div style="text-align:center">
          <div style="font-size:32px;margin-bottom:6px">🎯</div>
          <div style="font-size:18px;font-weight:700;color:#FFE66D;margin-bottom:4px">Select Your Course</div>
          <div style="font-size:11px;color:#444;margin-bottom:10px">Choose your exam to get the right subjects & tracking</div>
          ${breadcrumb}
        </div>
      </div>
      <div style="padding:14px 20px;overflow-y:auto;flex:1">${content}</div>
    </div>
  </div>`;
}

function _csBreadcrumb(steps){
  if(!steps.length) return '';
  return `<div style="display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap">
    <span onclick="showCourseSelector()" style="font-size:11px;color:#FFE66D88;cursor:pointer;transition:color 0.15s" onmouseover="this.style.color='#FFE66D'" onmouseout="this.style.color='#FFE66D88'">Home</span>
    ${steps.map((s,i)=>`
      <span style="font-size:11px;color:#333">›</span>
      <span onclick="${s.onclick||''}" style="font-size:11px;color:${i===steps.length-1?'#EDE8E0':'#FFE66D88'};cursor:${s.onclick?'pointer':'default'};transition:color 0.15s"
        ${s.onclick?`onmouseover="this.style.color='#FFE66D'" onmouseout="this.style.color='#FFE66D88'"`:''}>
        ${s.label}
      </span>`).join('')}
  </div>`;
}

function _csBtn(onclick, icon, label, desc, isActive){
  return `<button onclick="${onclick}"
    style="background:${isActive?'#1c1a08':'#0c0c16'};border:1px solid ${isActive?'#FFE66D77':'#ffffff12'};border-radius:12px;padding:13px 16px;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.18s;width:100%;display:flex;align-items:center;gap:13px;position:relative;margin-bottom:8px"
    onmouseover="this.style.background='#13131f';this.style.borderColor='#FFE66D66'"
    onmouseout="this.style.background='${isActive?'#1c1a08':'#0c0c16'}';this.style.borderColor='${isActive?'#FFE66D77':'#ffffff12'}'">
    <span style="font-size:22px;flex-shrink:0">${icon}</span>
    <span style="flex:1;min-width:0">
      <span style="display:block;font-size:13px;font-weight:600;color:#EDE8E0;margin-bottom:2px">${label}</span>
      <span style="display:block;font-size:11px;color:#555;line-height:1.45;white-space:normal">${desc}</span>
    </span>
    ${isActive?`<span style="font-size:9px;color:#FFE66D;background:#FFE66D18;border:1px solid #FFE66D44;border-radius:5px;padding:2px 6px;flex-shrink:0">Active</span>`:`<span style="font-size:14px;color:#333;flex-shrink:0">›</span>`}
  </button>`;
}

function showCourseSelector(groupId, subId){
  document.getElementById('course-selector-overlay')?.remove();
  let html='', breadcrumb='';

  if(!groupId){
    // Step 1 — top-level categories
    breadcrumb = '';
    html = COURSE_TREE.map(g=>g.leaf
      ? _csBtn(`switchCourse('${g.id}')`, g.icon, g.label, g.desc, activeCourse===g.id)
      : _csBtn(`showCourseSelector('${g.id}')`, g.icon, g.label, g.desc, false)
    ).join('');
    html += activeCourse ? `<button onclick="document.getElementById('course-selector-overlay').remove()" style="margin-top:6px;width:100%;background:none;border:1px solid #1e1e1e;color:#444;padding:9px;border-radius:10px;font-family:inherit;cursor:pointer;font-size:12px">Cancel</button>` : '';

  } else if(!subId){
    // Step 2 — children of selected group
    const group = COURSE_TREE.find(g=>g.id===groupId);
    if(!group) return showCourseSelector();
    breadcrumb = _csBreadcrumb([{ label: group.label }]);
    html = group.children.map(child=>{
      if(child.leaf){
        const isActive = activeCourse === child.id;
        return _csBtn(`switchCourse('${child.id}')`, child.icon, child.label, child.desc, isActive);
      }
      return _csBtn(`showCourseSelector('${groupId}','${child.id}')`, child.icon, child.label, child.desc, false);
    }).join('');
    html += `<button onclick="showCourseSelector()" style="margin-top:6px;width:100%;background:none;border:1px solid #1e1e1e;color:#444;padding:9px;border-radius:10px;font-family:inherit;cursor:pointer;font-size:12px">← Back</button>`;

  } else {
    // Step 3 — final options
    const group = COURSE_TREE.find(g=>g.id===groupId);
    const sub = group?.children.find(c=>c.id===subId);
    if(!sub) return showCourseSelector(groupId);
    breadcrumb = _csBreadcrumb([
      { label: group.label, onclick: `showCourseSelector()` },
      { label: sub.label }
    ]);
    html = sub.children.map(item=>{
      const isActive = item.cbse12stream
        ? (activeCourse==='cbse12' && localStorage.getItem('cbse12Stream')===item.id)
        : activeCourse === item.id;
      const action = item.cbse12stream ? `switchCbse12Stream('${item.id}')` : `switchCourse('${item.id}')`;
      return _csBtn(action, item.icon, item.label, item.desc, isActive);
    }).join('');
    html += `<button onclick="showCourseSelector('${groupId}')" style="margin-top:6px;width:100%;background:none;border:1px solid #1e1e1e;color:#444;padding:9px;border-radius:10px;font-family:inherit;cursor:pointer;font-size:12px">← Back</button>`;
  }

  document.body.insertAdjacentHTML('beforeend', _csOverlayShell(html, breadcrumb));
}

// Single fallback for when no stream is set (all subjects together)
const SUBJECTS_CBSE12 = Object.values(CBSE12_STREAMS).flatMap(s=>s.subjects).filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i);

const COURSE_SETS = {
  nfsu:    { label:"🎓 NFSU — B.Sc. LL.B. Sem II", subjects: SUBJECTS_NFSU },
  nfsu1:   { label:"🎓 NFSU — B.Sc. LL.B. Sem I", subjects: SUBJECTS_NFSU1 },
  nfsu3:   { label:"🎓 NFSU — B.Sc. LL.B. Sem III", subjects: SUBJECTS_NFSU3 },
  jee:     { label:"📐 JEE (Mains & Advanced)", subjects: SUBJECTS_JEE },
  neet:    { label:"🧬 NEET UG", subjects: SUBJECTS_NEET },
  cbse10:  { label:"📚 CBSE — Class 10", subjects: SUBJECTS_CBSE10 },
  cbse12:  { label:"🎓 CBSE — Class 12", subjects: SUBJECTS_CBSE12 },
};

let activeCourse = localStorage.getItem("activeCourse") || null; // null = not selected yet

function getSubjects(){
  if(!activeCourse || activeCourse === "nfsu") return SUBJECTS_NFSU;
  if(activeCourse === "nfsu1") return SUBJECTS_NFSU1;
  if(activeCourse === "nfsu3") return SUBJECTS_NFSU3;
  if(activeCourse === "cbse10") return SUBJECTS_CBSE10;
  if(activeCourse === "cbse12") return getCbse12Subjects().length ? getCbse12Subjects() : SUBJECTS_CBSE12;
  return COURSE_SETS[activeCourse]?.subjects || SUBJECTS_NFSU;
}

function switchCourse(courseId){
  activeCourse = courseId;
  localStorage.setItem("activeCourse", courseId);
  localStorage.setItem("courseChosen", "1");
  // History API: update URL to /course/<id> and update meta tags
  history.pushState({view: 'course:'+courseId}, '', '/course/'+courseId);
  _updatePageMeta('course:'+courseId);
  // Reset active subject to first subject of new course
  const subs = getSubjects();
  state.activeSubject = subs[0]?.id || "cpp";
  document.getElementById("course-selector-overlay")?.remove();
  // If NFSU/CBSE selected while on neetjee view, go to dashboard
  if((courseId === 'nfsu' || courseId === 'nfsu1' || courseId === 'nfsu3' || courseId === 'cbse10' || courseId === 'cbse12') && state.view === 'neetjee') state.view = 'dashboard';
  clearTimeout(S._timer); S._timer=setTimeout(pushToFirebase,1200);
  switchView(state.view);
  showToast("✅ Course switched to " + COURSE_SETS[courseId]?.label, "success");
  spawnStars();
}

function renderCourseSelector(){ showCourseSelector(); } // legacy alias

const MOODS=["😴","😕","😐","😊","🔥"];
const MOOD_LABELS=["Very Low","Low","Okay","Good","On Fire!"];
const NOTE_TYPES=["📝 Note","💡 Concept","⚠️ Important","🧮 Formula","📋 Definition","❓ Doubt"];
const NOTE_BG={"📝 Note":"#1e1e2e","💡 Concept":"#0f1e0f","⚠️ Important":"#1e0f0f","🧮 Formula":"#0f0f1e","📋 Definition":"#1a0f1a","❓ Doubt":"#1a1a0f"};
const NOTE_ACC={"📝 Note":"#6b6baa","💡 Concept":"#06D6A0","⚠️ Important":"#FF6B35","🧮 Formula":"#4ECDC4","📋 Definition":"#C77DFF","❓ Doubt":"#FFE66D"};
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];


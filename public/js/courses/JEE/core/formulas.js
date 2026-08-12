// Auto-split from the original public/js/data/subjects.js
const JEE_FORMULAS = {
  "jee-phy": {
    "Kinematics": [
      "v = u + at",
      "s = ut + ½at²",
      "v² = u² + 2as",
      "Range R = u²sin2θ/g",
      "Max Height H = u²sin²θ/2g",
      "Time of flight T = 2usinθ/g"
    ],
    "Laws of Motion": [
      "F = ma",
      "Impulse J = FΔt = Δp",
      "Friction f = μN",
      "Centripetal a = v²/r = ω²r"
    ],
    "Work, Energy & Power": [
      "W = Fs·cosθ",
      "KE = ½mv²",
      "PE = mgh",
      "Power P = W/t = Fv",
      "Conservation: KE + PE = const"
    ],
    "Rotational Motion": [
      "τ = Iα",
      "L = Iω",
      "KE_rot = ½Iω²",
      "I(ring) = MR²",
      "I(disc) = ½MR²",
      "I(sphere) = 2/5·MR²",
      "Parallel axis: I = I_cm + Md²"
    ],
    "Gravitation": [
      "F = Gm₁m₂/r²",
      "g = GM/R²",
      "Escape v = √(2gR)",
      "Orbital v = √(GM/r)",
      "T² ∝ r³ (Kepler's 3rd)"
    ],
    "Simple Harmonic Motion": [
      "x = A·sin(ωt + φ)",
      "ω = 2π/T = √(k/m)",
      "T(pendulum) = 2π√(L/g)",
      "v_max = Aω",
      "a_max = Aω²"
    ],
    "Waves & Sound": [
      "v = fλ",
      "v_sound = √(γP/ρ)",
      "Beat freq = |f₁ - f₂|",
      "Doppler: f' = f·(v±v_o)/(v∓v_s)"
    ],
    "Heat & Thermodynamics": [
      "PV = nRT",
      "ΔU = Q - W",
      "W = PΔV (isobaric)",
      "Efficiency η = 1 - T₂/T₁",
      "Q = mcΔT"
    ],
    "Electrostatics": [
      "F = kq₁q₂/r²",
      "E = kq/r²",
      "V = kq/r",
      "C = Q/V",
      "C_parallel plate = ε₀A/d",
      "U = ½CV² = Q²/2C"
    ],
    "Current Electricity": [
      "V = IR",
      "P = VI = I²R = V²/R",
      "R_series = R₁+R₂+...",
      "1/R_parallel = 1/R₁+1/R₂+...",
      "EMF: ε = V + Ir"
    ],
    "Magnetic Effects": [
      "F = qv×B",
      "F = BIL",
      "r = mv/qB",
      "B_solenoid = μ₀nI",
      "B_long wire = μ₀I/2πr"
    ],
    "Electromagnetic Induction": [
      "EMF = -dΦ/dt",
      "Φ = B·A·cosθ",
      "EMF_motional = BLv",
      "Self ind: V = L·dI/dt"
    ],
    "Alternating Currents": [
      "X_L = ωL",
      "X_C = 1/ωC",
      "Z = √(R²+(X_L-X_C)²)",
      "Resonance: ω₀ = 1/√(LC)",
      "P = V_rms·I_rms·cosφ"
    ],
    "Ray Optics": [
      "1/v - 1/u = 1/f",
      "Magnification m = v/u",
      "Lens maker: 1/f = (n-1)(1/R₁-1/R₂)",
      "Snell's: n₁sinθ₁ = n₂sinθ₂",
      "TIR: sinC = 1/n"
    ],
    "Wave Optics": [
      "Fringe width β = λD/d",
      "Condition bright: Δ = nλ",
      "Condition dark: Δ = (2n-1)λ/2",
      "Resolving power: θ = 1.22λ/d"
    ],
    "Dual Nature & Atoms": [
      "E = hf = hc/λ",
      "KE_max = hf - φ",
      "λ_deBroglie = h/mv",
      "E_n = -13.6/n² eV (H-atom)",
      "r_n = 0.529n² Å"
    ],
    "Nuclei & Semiconductors": [
      "E = mc²",
      "t₁/₂ = 0.693/λ",
      "N = N₀e^(-λt)",
      "BE/nucleon peaks at Fe-56"
    ]
  },
  "jee-chem": {
    "Mole Concept": [
      "Moles = mass/M",
      "PV = nRT",
      "Normality = Molarity × n-factor",
      "Molality = moles solute/kg solvent",
      "Mole fraction x_A = n_A/(n_A+n_B)"
    ],
    "Atomic Structure": [
      "E_n = -13.6/n² eV",
      "r_n = 0.529n² Å",
      "λ = h/mv (de Broglie)",
      "Δx·Δp ≥ h/4π (Heisenberg)",
      "Max e⁻ in shell = 2n²"
    ],
    "Chemical Bonding": [
      "Formal charge = V - L - B/2",
      "Bond order = (bonding - antibonding)/2",
      "Dipole μ = q·d"
    ],
    "Thermodynamics": [
      "ΔG = ΔH - TΔS",
      "ΔG = -RT·lnK",
      "ΔH_rxn = ΣΔH_f(products) - ΣΔH_f(reactants)",
      "Hess's Law: ΔH is path-independent"
    ],
    "Equilibrium": [
      "Kp = Kc(RT)^Δn",
      "ΔG° = -RT·lnK",
      "pH = -log[H⁺]",
      "pH + pOH = 14",
      "Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA])"
    ],
    "Electrochemistry": [
      "E°_cell = E°_cathode - E°_anode",
      "ΔG° = -nFE°",
      "Nernst: E = E° - (RT/nF)lnQ",
      "Faraday's: m = (M·I·t)/(n·F)"
    ],
    "Chemical Kinetics": [
      "Rate = k[A]^m[B]^n",
      "t₁/₂ (1st order) = 0.693/k",
      "k = Ae^(-Ea/RT) (Arrhenius)",
      "Integrated 1st order: ln[A] = ln[A₀] - kt"
    ],
    "Solutions": [
      "π = iCRT (osmotic pressure)",
      "ΔT_b = i·K_b·m",
      "ΔT_f = i·K_f·m",
      "Raoult's: p_A = x_A·p°_A",
      "van't Hoff factor i = 1 + α(n-1)"
    ]
  },
  "jee-math": {
    "Complex Numbers": [
      "z = a+ib, |z| = √(a²+b²)",
      "z̄ = a-ib",
      "|z₁z₂| = |z₁||z₂|",
      "e^(iθ) = cosθ + i·sinθ (Euler's)",
      "Roots of unity: z^n = 1"
    ],
    "Quadratic Equations": [
      "x = (-b ± √(b²-4ac))/2a",
      "Sum of roots = -b/a",
      "Product of roots = c/a",
      "Discriminant D = b²-4ac"
    ],
    "Sequences & Series": [
      "AP: a_n = a+(n-1)d, S_n = n/2(2a+(n-1)d)",
      "GP: a_n = ar^(n-1), S_n = a(1-rⁿ)/(1-r)",
      "Sum of n²: n(n+1)(2n+1)/6",
      "Sum of n³: [n(n+1)/2]²"
    ],
    "Binomial Theorem": [
      "(a+b)^n = Σ C(n,r)·a^(n-r)·b^r",
      "T_(r+1) = C(n,r)·a^(n-r)·b^r",
      "Middle term: T_(n/2+1) when n is even"
    ],
    "Matrices & Determinants": [
      "det(AB) = det(A)·det(B)",
      "A⁻¹ = adj(A)/det(A)",
      "Cramer's rule for system Ax = B",
      "Rank of matrix"
    ],
    "Limits & Continuity": [
      "lim(sinx/x) = 1 as x→0",
      "lim((1+1/n)^n) = e",
      "L'Hôpital: 0/0 or ∞/∞ forms",
      "Chain rule: dy/dx = dy/du · du/dx"
    ],
    "Differentiation": [
      "d/dx(xⁿ) = nxⁿ⁻¹",
      "d/dx(eˣ) = eˣ",
      "d/dx(lnx) = 1/x",
      "d/dx(sinx) = cosx",
      "Product: (uv)' = u'v + uv'",
      "Quotient: (u/v)' = (u'v-uv')/v²"
    ],
    "Integration": [
      "∫xⁿdx = xⁿ⁺¹/(n+1)+C",
      "∫eˣdx = eˣ+C",
      "∫sinx dx = -cosx+C",
      "∫1/x dx = ln|x|+C",
      "Integration by parts: ∫u·dv = uv - ∫v·du"
    ],
    "Applications of Derivatives": [
      "Maxima/Minima: f'(x)=0, check f''(x)",
      "Rate of change: dy/dt = (dy/dx)·(dx/dt)",
      "Tangent slope = f'(a) at x=a"
    ],
    "Differential Equations": [
      "Separable: f(y)dy = g(x)dx",
      "Linear: dy/dx + P(x)y = Q(x)",
      "IF = e^(∫P dx)",
      "Solution: y·IF = ∫Q·IF dx"
    ],
    "Coordinate Geometry": [
      "Distance = √((x₂-x₁)²+(y₂-y₁)²)",
      "Slope m = (y₂-y₁)/(x₂-x₁)",
      "Circle: (x-h)²+(y-k)² = r²",
      "Parabola: y² = 4ax",
      "Ellipse: x²/a²+y²/b² = 1"
    ],
    "3D Geometry": [
      "Direction cosines: l²+m²+n² = 1",
      "Distance between parallel planes: |d₁-d₂|/√(a²+b²+c²)",
      "Angle between lines: cosθ = |l₁l₂+m₁m₂+n₁n₂|"
    ],
    "Vectors": [
      "|a×b| = |a||b|sinθ",
      "a·b = |a||b|cosθ",
      "Volume of parallelepiped = a·(b×c)",
      "Unit vector â = a/|a|"
    ],
    "Probability": [
      "P(A∪B) = P(A)+P(B)-P(A∩B)",
      "Bayes: P(A|B) = P(B|A)P(A)/P(B)",
      "Binomial: P(x=r) = C(n,r)·p^r·q^(n-r)",
      "E(X) = np, Var = npq"
    ],
    "Trigonometry": [
      "sin²θ+cos²θ = 1",
      "sin(A±B) = sinAcosB ± cosAsinB",
      "cos2θ = 1-2sin²θ = 2cos²θ-1",
      "sinC+sinD = 2sin((C+D)/2)cos((C-D)/2)"
    ]
  }
};

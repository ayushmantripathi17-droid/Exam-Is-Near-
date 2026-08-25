// ══════════════════════════════════════════════════════════════
// CURATED DEFINITIONS — key legal terms + what a specific
// section/article states, keyed by "subjectId:unitId:topicIndex"
// ══════════════════════════════════════════════════════════════
// Each entry: { items:[{term,def}], examTip:"..." }
// `examTip` is optional. Topics without an entry fall back to the
// "no curated reference yet" state, same as reference-caselaws.js.

const CURATED_DEFINITIONS = {
  "s3-crimes:u1:6": {
    items: [
      { term:"Mens Rea", def:"The mental element of a crime — a guilty mind, intention, knowledge, or recklessness as to the criminal act." },
      { term:"Actus Reus", def:"The physical/conduct element of a crime — the wrongful act or omission itself." },
      { term:"Strict Liability", def:"Liability imposed without requiring proof of mens rea, typically for regulatory or public-welfare offences." },
      { term:"BNS Section 3(5)", def:"Codifies common intention — when several persons act in furtherance of a shared criminal intention, each is liable for the act as if done by them alone." }
    ],
    examTip: "Structure your answer as actus reus + mens rea + absence of a valid general exception. Nanavati is your best case for provocation/cooling-off; George is your best case for strict liability."
  },
  "s1-tort:u2:1": {
    items: [
      { term:"Duty of Care", def:"A legal obligation requiring a person to avoid acts/omissions that could reasonably be foreseen to injure others." },
      { term:"Res Ipsa Loquitur", def:"'The thing speaks for itself' — an evidentiary rule allowing negligence to be inferred from the mere occurrence of an accident, shifting the burden of proof to the defendant." },
      { term:"Strict/Absolute Liability", def:"Liability for harm caused by inherently hazardous activities, imposed without needing to prove negligence and (for absolute liability) without any defenses." },
      { term:"Consumer Protection Act, 2019 — S.2(34)", def:"Defines 'product liability' — a manufacturer, seller, or service provider's responsibility to compensate for harm caused by a defective product or deficient service." }
    ],
    examTip: "Pair Donoghue (duty of care origin) with Subhagwanti (res ipsa loquitur in India) for any negligence question. Rylands v. Fletcher → M.C. Mehta is the standard progression for a strict vs absolute liability comparison."
  },
  "s1-tort:u1:0": {
    items: [
      { term:"Tort (Salmond)", def:"A civil wrong for which the remedy is an action for unliquidated damages, and which is not exclusively the breach of a contract, trust, or other purely equitable obligation." },
      { term:"Tort (Winfield)", def:"Tortious liability arises from breach of a duty primarily fixed by law — this duty is towards persons generally, and its breach is redressible by an action for unliquidated damages." }
    ]
  },
  "s1-tort:u1:1": {
    items: [
      { term:"Tort vs Crime", def:"A tort is a private wrong redressed by compensation to the victim; a crime is a public wrong prosecuted by the State and punished, though the same act can be both (e.g. assault)." },
      { term:"Tort vs Contract", def:"Tortious duties are imposed by law and owed to persons generally; contractual duties are voluntarily agreed and owed only to the other contracting party." },
      { term:"Law of Tort vs Law of Torts", def:"'Law of Tort' (Winfield's view) treats all injuries as tortious unless justified — a general principle of liability; 'Law of Torts' (Salmond's view) treats liability as arising only from specific, named torts (a pigeon-hole approach)." }
    ]
  },
  "s1-tort:u1:2": {
    items: [
      { term:"Injuria Sine Damno", def:"Violation of a legal right without actual damage — still actionable, since the law presumes damage from the infringement of a right (see Ashby v. White)." },
      { term:"Damnum Sine Injuria", def:"Actual damage/loss without violation of any legal right — NOT actionable (e.g. lawful business competition causing a rival financial loss)." },
      { term:"Ubi Jus Ibi Remedium", def:"'Where there is a right, there is a remedy' — the principle that a legally recognised right must have a corresponding legal remedy if violated." }
    ],
    examTip: "This topic is almost always tested as a distinguish-with-examples question — pair Ashby v. White (injuria sine damno) against the Gloucester Grammar School Case (damnum sine injuria)."
  },
  "s1-tort:u1:3": {
    items: [
      { term:"Volenti Non Fit Injuria", def:"'To a willing person, no injury is done' — a defence where the plaintiff voluntarily and knowingly consented to the risk of harm." },
      { term:"Act of God (Vis Major)", def:"An extraordinary natural event that could not have been anticipated or prevented by reasonable human foresight — a defence excusing liability." },
      { term:"Inevitable Accident", def:"An event that could not have been foreseen or avoided despite the exercise of reasonable care and skill." },
      { term:"Private Defense", def:"Reasonable force used to protect oneself, another, or property from imminent unlawful harm — a recognised justification limiting tort liability." }
    ]
  },
  "s1-tort:u2:0": {
    items: [
      { term:"Vicarious Liability", def:"Liability imposed on one person (typically an employer) for the tort committed by another (typically an employee) due to their relationship, provided the act was within the course of employment." },
      { term:"Strict Liability", def:"Liability for harm caused by inherently hazardous activity, imposed without needing to prove negligence, but subject to defences (act of a stranger, plaintiff's default, statutory authority)." },
      { term:"Absolute Liability", def:"An Indian variant of strict liability (from M.C. Mehta v. Union of India) with no exceptions at all — hazardous industries are liable for any harm from their operations, regardless of precautions taken." },
      { term:"Sovereign vs Non-Sovereign Functions", def:"A function is sovereign if it can only be performed by the State (e.g. defence, police powers of arrest); non-sovereign functions are those any private employer could also perform (e.g. running a transport fleet) — this distinction historically determined whether the State could claim immunity." }
    ],
    examTip: "Use Vidyawati (non-sovereign, State liable) against Kasturilal (sovereign, State not liable) as your compare-and-contrast pair for any vicarious liability/sovereign immunity question."
  },
  "s1-tort:u2:2": {
    items: [
      { term:"Nuisance (Salmond)", def:"Causing or allowing the escape of any deleterious thing from one's land, or unreasonable interference with another's use or enjoyment of land." },
      { term:"Private Nuisance", def:"Unlawful interference with a person's use or enjoyment of land, or of some right connected with it, actionable by the affected individual." },
      { term:"Public Nuisance", def:"An act or omission that causes inconvenience or damage to the public generally, or to a class of persons who come in contact with it — ordinarily actionable only by the State/Attorney-General, unless an individual suffers special damage." }
    ]
  },
  "s1-tort:u2:3": {
    items: [
      { term:"False Imprisonment", def:"Total restraint of a person's liberty without lawful justification, even for a short duration, without requiring actual physical bonds." },
      { term:"Assault", def:"An act that causes another person to reasonably apprehend imminent, unlawful physical contact/harm." },
      { term:"Battery", def:"The actual, unlawful application of physical force to another person, however slight." },
      { term:"Malicious Prosecution", def:"Initiating criminal proceedings against someone without reasonable/probable cause and with malice, which terminate in the person's favour, causing them damage." }
    ]
  },
  "s1-tort:u3:0": {
    items: [
      { term:"Defamation", def:"A false statement, published to a third party, that injures a person's reputation in the eyes of right-thinking members of society." },
      { term:"Libel", def:"Defamation in a permanent/written form (e.g. print, writing, pictures) — actionable per se under Indian civil law, without proof of actual damage." },
      { term:"Slander", def:"Defamation in a transient/spoken form — generally requires proof of actual (special) damage to be actionable, except in certain recognised categories." },
      { term:"Innuendo", def:"A statement that appears innocent on its face but carries a defamatory meaning when understood with extrinsic facts known to the reader/listener." }
    ]
  },
  "s1-tort:u3:1": {
    items: [
      { term:"Trespass to Land", def:"Direct and unlawful interference with another's possession of land, without their consent — actionable even without proof of actual damage." },
      { term:"Trespass to Goods", def:"Direct and unlawful interference with another's possession of movable property." },
      { term:"Conversion", def:"Dealing with another's goods in a manner inconsistent with their rights, amounting to a denial of, or serious interference with, their ownership/possession." }
    ]
  },
  "s1-tort:u3:2": {
    items: [
      { term:"Cyber Stalking", def:"Repeated, unwanted online monitoring, tracking, or contact directed at a person, causing fear or distress — actionable both as a tort and as an offence under the IT Act." },
      { term:"Breach of Privacy (Digital)", def:"Unauthorised collection, use, or disclosure of a person's personal data or private information online." },
      { term:"Cyber Defamation", def:"Publishing false, damaging statements about a person through digital media (social media, email, websites), attracting the same defamation principles as traditional media, with wider and faster reach." }
    ],
    examTip: "Tie any privacy-related cyber tort answer to Justice K.S. Puttaswamy v. Union of India (2017), which recognised privacy as a fundamental right under Article 21 — even though that case is primarily constitutional law, examiners often expect the cross-reference here."
  },
  "s1-tort:u3:3": {
    items: [
      { term:"Doctrine of Sovereign Immunity", def:"The traditional common-law principle ('the King can do no wrong') that the State cannot be sued for torts committed in the exercise of its sovereign functions." },
      { term:"Article 300", def:"Provides that the Government of India/States may sue and be sued, continuing (with modification) the pre-Constitution position on governmental liability." }
    ],
    examTip: "Trace the doctrine's arc: Vidyawati (1962, State liable — non-sovereign function) → Kasturilal (1965, State not liable — sovereign function) → N. Nagendra Rao v. State of A.P. (1994, doctrine significantly narrowed) — examiners like this progression."
  },
  "s1-tort:u4:0": {
    items: [
      { term:"Consumer (CPA 2019, S.2(7))", def:"A person who buys goods or hires/avails services for consideration, but does not include someone who obtains goods for resale or commercial purposes." },
      { term:"Goods (CPA 2019)", def:"Every kind of movable property, as defined broadly to include products bought for personal use or consumption." },
      { term:"Service (CPA 2019, S.2(42))", def:"Any activity made available to potential users for consideration — including housing construction, banking, insurance, transport, etc. — excluding services rendered free of charge or under a contract of personal service." }
    ]
  },
  "s1-tort:u4:1": {
    items: [
      { term:"Deficiency in Service", def:"Any fault, imperfection, shortcoming, or inadequacy in the quality, nature, or manner of performance of a service, required to be maintained by law or contract." },
      { term:"Redressal Mechanism (3-tier)", def:"District Consumer Disputes Redressal Commission → State Commission → National Commission, based on the value of goods/services and compensation claimed." }
    ]
  },
  "s1-tort:u4:2": {
    items: [
      { term:"Driving Licence", def:"Statutory authorisation under the Motor Vehicles Act, 1988 required to drive a motor vehicle in a public place, without which driving is an offence." },
      { term:"Registration of Motor Vehicle", def:"Mandatory recording of a vehicle with the registering authority before it can be driven in a public place, evidenced by a Registration Certificate." }
    ]
  },
  "s1-tort:u4:3": {
    items: [
      { term:"Compensation under the MV Act", def:"Claims for death/injury from motor accidents are adjudicated by Motor Accident Claims Tribunals (MACT), applying principles of 'just compensation' rather than strict tort-law causation rules." },
      { term:"No-Fault Liability (S.140/S.164 MV Act)", def:"Allows a claimant to recover a fixed minimum compensation for death or permanent disablement from a motor accident without having to prove the driver's negligence or fault." }
    ]
  },
  "laws:u1:0": {
    items: [
      { term:"Sociology of Law", def:"The study of law as a social phenomenon — how law is created, how it functions in society, and how social forces shape and are shaped by legal rules." },
      { term:"Law & Society (relationship)", def:"The reciprocal view that law both reflects existing social norms and actively shapes social behaviour and values over time." }
    ]
  },
  "laws:u1:1": {
    items: [
      { term:"Common Law System", def:"A legal system built primarily on judicial precedent, followed in India, England and most Commonwealth countries." },
      { term:"Civil Law System", def:"A legal system built primarily on comprehensive written codes, followed in continental Europe." },
      { term:"Religious Legal Systems", def:"Systems where religious texts and doctrine are a primary source of law, e.g. Islamic law, classical Hindu law." }
    ]
  },
  "laws:u1:2": {
    items: [
      { term:"British-Indian Legal System", def:"India's modern legal system evolved from British colonial administration — the common law tradition, codified statutes (IPC, CPC, Evidence Act) and hierarchy of courts were introduced under British rule and substantially retained post-Independence." },
      { term:"Doctrine of Continuity", def:"Pre-Constitution laws continue in force after Independence/the Constitution's commencement unless expressly repealed or inconsistent with the Constitution (Article 372)." }
    ]
  },
  "laws:u2:0": {
    items: [
      { term:"Durkheim's View of Law", def:"Emile Durkheim saw law as reflecting a society's form of 'social solidarity' — repressive/criminal law in mechanically-solidary (traditional) societies, restitutive/civil law in organically-solidary (modern, interdependent) societies." },
      { term:"Weber's View of Law", def:"Max Weber emphasised the rationalisation of law — the shift from arbitrary, personalised justice toward formal, predictable, rule-bound legal systems as a feature of modern bureaucratic society." },
      { term:"Maine's View of Law ('Status to Contract')", def:"Sir Henry Maine argued that the progress of societies is marked by a movement from law based on fixed social status (family, caste) to law based on freely negotiated individual contract." }
    ],
    examTip: "This topic is almost always tested as a compare-the-theorists question — keep one keyword per theorist ready: Durkheim = solidarity, Weber = rationalisation, Maine = status to contract."
  },
  "laws:u2:1": {
    items: [
      { term:"Formal Sources of Law", def:"The source from which a rule derives its binding force/validity — for a positivist, the will of the sovereign/state." },
      { term:"Material Sources of Law", def:"The source of a rule's actual content, such as custom, precedent, or legislation." }
    ]
  },
  "laws:u3:0": {
    items: [
      { term:"Social Stratification", def:"The hierarchical arrangement of individuals into social classes/strata based on factors like caste, class, wealth, and gender, which can shape access to legal rights and remedies in practice." },
      { term:"Intersectionality", def:"The idea that overlapping social categories (e.g. caste, class, and gender together) compound disadvantage in ways not captured by looking at any single category alone." }
    ]
  },
  "laws:u3:1": {
    items: [
      { term:"Conflict Theory of Law", def:"The view (rooted in Marx) that law is a tool used by dominant social/economic groups to maintain their power and control over subordinate groups, rather than a neutral arbiter of justice." },
      { term:"Neo-Marxist Legal Theory", def:"Builds on classical Marxist theory but gives more weight to law's relative autonomy — law can still serve dominant class interests overall while occasionally producing genuinely progressive outcomes." }
    ]
  },
  "laws:u3:2": {
    items: [
      { term:"Law as a Social System (Systems Theory)", def:"Views law as a self-referential subsystem of society (associated with theorists like Niklas Luhmann) that operates by its own internal logic of 'legal/illegal', while still interacting with and being influenced by other social subsystems." }
    ]
  },
  "laws:u4:1": {
    items: [
      { term:"Social Inclusion", def:"Policies and processes aimed at ensuring marginalised or disadvantaged groups have equal access to opportunities, resources, and participation in society." },
      { term:"Social Exclusion", def:"The systemic denial of access to rights, resources, and participation to particular groups, often based on caste, religion, gender, or economic status." }
    ]
  },
  "juris:u1:0": {
    items: [
      { term:"Jurisprudence", def:"The systematic study and philosophy of law — its nature, sources, purpose, and the concepts underlying legal systems, rather than the study of any one branch of substantive law." },
      { term:"Scope of Jurisprudence", def:"Covers analysis of legal concepts (rights, duties, ownership, personality), theories about law's nature and purpose, and law's relationship with morality, society, and justice." }
    ]
  },
  "juris:u1:1": {
    items: [
      { term:"Legal Theory", def:"The broader philosophical study of what law is and why it has authority — jurisprudence is often used interchangeably with legal theory, though some reserve 'legal theory' for more overtly philosophical inquiry." },
      { term:"Normative vs Descriptive Jurisprudence", def:"Normative jurisprudence asks what law ought to be; descriptive (analytical) jurisprudence studies what law actually is, without evaluating its moral worth." }
    ]
  },
  "juris:u1:2": {
    items: [
      { term:"Municipal Law", def:"The internal/domestic law of a state, as opposed to international law governing relations between states." },
      { term:"Public Law vs Private Law", def:"Public law governs the relationship between the state and individuals; private law governs relationships between individuals." },
      { term:"Substantive vs Procedural Law", def:"Substantive law defines rights and duties; procedural law lays down the process for enforcing them." }
    ]
  },
  "juris:u1:3": {
    items: [
      { term:"Constitution as a Source", def:"The Constitution is the grundnorm/foundational source of law in India — all other laws derive their validity from it and must be consistent with it." },
      { term:"Custom as a Source", def:"A long-established, continuous, and reasonable practice recognised by a community as binding, historically one of the oldest sources of law." },
      { term:"Precedent as a Source", def:"Judicial decisions that bind future courts (Article 141 for Supreme Court decisions), developing law incrementally through case-by-case reasoning." }
    ]
  },
  "juris:u2:2": {
    items: [
      { term:"Historical School (Savigny)", def:"Friedrich Carl von Savigny argued law is not consciously created but grows organically from a people's 'Volksgeist' (spirit of the people) — customs and traditions, not legislative will, are law's true source." },
      { term:"Historical School (Maine)", def:"Sir Henry Maine traced legal development through stages, famously summarising social/legal progress as a movement 'from Status to Contract' — from fixed birth-based obligations to freely negotiated ones." }
    ],
    examTip: "Contrast this with the Analytical School (law = sovereign command, deliberately made) — Historical School treats law as found/discovered from custom, not made."
  },
  "juris:u3:0": {
    items: [
      { term:"Hohfeld's Analytical Scheme", def:"Wesley Hohfeld broke 'rights' into four precise pairs of correlatives/opposites: right–duty, privilege(liberty)–no-right, power–liability, and immunity–disability, to remove ambiguity in how lawyers use the word 'right'." },
      { term:"Claim-Right", def:"A right in the strict Hohfeldian sense, correlating with someone else's duty — e.g. my right to be paid correlates with your duty to pay me." }
    ]
  },
  "juris:u3:1": {
    items: [
      { term:"Rights-Duty Correlativity", def:"The principle that every legal right necessarily implies a corresponding duty on someone else — a right without any correlative duty is not a legal right in the strict sense." }
    ]
  },
  "juris:u4:0": {
    items: [
      { term:"Possession", def:"De facto physical control over a thing, combined with the intention to hold it as one's own (animus possidendi) — distinct from ownership, which is the legal right recognised by law." },
      { term:"Corpus and Animus", def:"Savigny's two elements of possession: corpus (physical control/detention) and animus (the mental intention to possess as owner)." },
      { term:"Kinds of Possession", def:"Includes corporeal/incorporeal possession, mediate/immediate possession (through an agent vs directly), and de facto/de jure possession." }
    ]
  },
  "juris:u4:1": {
    items: [
      { term:"Gandhian Concept of Ownership (Trusteeship)", def:"Mahatma Gandhi's theory that wealthy individuals should hold their property as trustees for society's benefit, using it for the common good rather than purely for personal gain — an ethical rather than strictly legal theory of ownership." }
    ]
  },
  "juris:u4:2": {
    items: [
      { term:"Property", def:"Legally recognised rights over a thing, giving the holder control, use, and the power to exclude others — property is the bundle of rights, not merely the physical object itself." },
      { term:"Corporeal vs Incorporeal Property", def:"Corporeal property is a right over a tangible/physical object; incorporeal property is a right over something intangible (e.g. a patent, copyright, or debt)." }
    ]
  },
  "juris:u4:3": {
    items: [
      { term:"Locke's Labour Theory", def:"John Locke argued property rights originate from mixing one's labour with unowned natural resources — you own what you have worked to produce or improve." },
      { term:"Hegel's Personality Theory", def:"G.W.F. Hegel viewed property as an extension of a person's will and personality into the external world — owning things is how individuals actualise their freedom." },
      { term:"Kant's Theory", def:"Immanuel Kant grounded property in rational will and mutual recognition — property rights are justified because rational agents can consistently will a system where possession is respected by all." }
    ]
  },
  "legal:u4:0": {
    items: [
      { term:"Factum Valet Quod Fieri Non Debuit", def:"'What ought not to be done, becomes valid when done' — a fact accomplished cannot be undone by law merely because the process leading to it was irregular; used mainly in personal law to validate an irregularly performed ceremony/act after the fact." },
      { term:"Mens Rea", def:"'Guilty mind' — the mental element of a crime: intention, knowledge, or recklessness as to the criminal act." }
    ]
  },
  "legal:u4:1": {
    items: [
      { term:"Actus Reus", def:"'Guilty act' — the physical/conduct element of a crime, as opposed to the mental state (mens rea) behind it." },
      { term:"Nemo Dat Quod Non Habet", def:"'No one gives what they do not have' — a seller cannot transfer better title/ownership in goods than they themselves possess." }
    ]
  },
  "legal:u4:2": {
    items: [
      { term:"Ignorantia Juris Non Excusat", def:"'Ignorance of law is no excuse' — a person cannot escape liability by claiming they didn't know the law prohibited their conduct." },
      { term:"Pacta Sunt Servanda", def:"'Agreements must be kept' — the foundational principle of contract law that valid promises/agreements are binding and must be honoured." }
    ]
  },
  "legal:u4:3": {
    items: [
      { term:"Ubi Jus Ibi Remedium", def:"'Where there is a right, there is a remedy' — every legal right must have a corresponding legal remedy available if it is violated (see Ashby v. White)." },
      { term:"Prima Facie", def:"'At first sight/appearance' — a case that appears, on initial examination of the evidence, to be sufficient to establish a fact or claim unless disproved." }
    ],
    examTip: "Ashby v. White is the direct source case for ubi jus ibi remedium — always cite it if this maxim comes up."
  },
  "s3-crimes:u1:0": {
    items: [
      { term:"Crime", def:"An act or omission prohibited by law and punishable by the State, involving a public wrong against society, not just a private wrong against an individual." },
      { term:"Crime vs Tort/Civil Wrong", def:"A crime is prosecuted by the State and punished; a tort/civil wrong is a private matter redressed by the injured party through compensation, though a single act (e.g. assault) can be both." }
    ]
  },
  "s3-crimes:u1:1": {
    items: [
      { term:"Actus Reus", def:"The physical/conduct element of a crime — the wrongful act or omission itself." },
      { term:"Mens Rea", def:"The mental element of a crime — intention, knowledge, or recklessness as to the criminal act." },
      { term:"Concurrence", def:"The requirement that actus reus and mens rea must coincide in time — the guilty act and guilty mind must occur together for criminal liability, subject to exceptions like continuing acts." }
    ]
  },
  "s3-crimes:u1:2": {
    items: [
      { term:"Territorial Application of BNS", def:"The BNS applies to the whole of India, and (as with the IPC before it) extends to offences committed by Indian citizens even outside India, and on Indian-registered ships/aircraft." },
      { term:"Structure of BNS", def:"Organised into chapters covering general explanations, punishments, general exceptions, and then substantive offences grouped by subject-matter (offences against the State, human body, property, etc.), broadly restructuring but substantially retaining the IPC's scheme." }
    ]
  },
  "s3-crimes:u1:3": {
    items: [
      { term:"General Explanations (BNS Section 3)", def:"Defines foundational terms used throughout the Code — e.g. 'act', 'omission', 'gender', 'person', 'dishonestly', 'fraudulently' — and clarifies principles like common intention (S.3(5))." },
      { term:"Common Intention (S.3(5))", def:"When several persons act in furtherance of a shared criminal intention, each is liable for the act as if they alone had done it — group liability based on a shared plan." }
    ]
  },
  "s3-crimes:u1:4": {
    items: [
      { term:"Death Penalty", def:"The most severe punishment, reserved (per Bachan Singh v. State of Punjab, 1980) for the 'rarest of rare' cases." },
      { term:"Imprisonment for Life", def:"Imprisonment for the remainder of the convict's natural life, subject to remission rules." },
      { term:"Rigorous vs Simple Imprisonment", def:"Rigorous imprisonment involves hard labour; simple imprisonment does not." },
      { term:"Fine and Forfeiture", def:"Monetary punishment, and forfeiture is the confiscation of property connected to the offence." }
    ]
  },
  "s3-crimes:u2:2": {
    items: [
      { term:"Unlawful Assembly", def:"An assembly of five or more persons with a common object to commit an offence such as force, intimidation, or resistance to law enforcement." },
      { term:"Rioting", def:"The use of force or violence by an unlawful assembly or any of its members in pursuance of their common object." },
      { term:"Affray", def:"Fighting by two or more persons in a public place in a manner that disturbs public peace." }
    ]
  },
  "s3-crimes:u3:0": {
    items: [
      { term:"Rape (BNS successor to IPC S.375-376)", def:"Non-consensual sexual intercourse, or intercourse obtained through coercion, fraud, or with a person incapable of giving valid consent (e.g. due to age or unsoundness of mind)." },
      { term:"Consent (in sexual offences)", def:"Must be an unequivocal, voluntary agreement, communicated through words/gestures — consent obtained through fear, fraud, or from a minor is not valid consent in law." }
    ],
    examTip: "Cross-reference Independent Thought v. Union of India (2017), which struck down the marital rape exception as applied to wives under 18, if the question touches consent and age together."
  },
  "s3-crimes:u3:2": {
    items: [
      { term:"Miscarriage (Causing)", def:"Voluntarily causing a woman with child to miscarry, an offence unless done in good faith to save the woman's life — reflects the tension between bodily autonomy and protection of prenatal life in Indian criminal law." },
      { term:"Medical Termination of Pregnancy Act, 1971 (context)", def:"Provides lawful exceptions permitting termination of pregnancy under specified conditions, operating alongside the BNS's general prohibition on causing miscarriage." }
    ]
  },
  "s3-crimes:u3:5": {
    items: [
      { term:"Hurt", def:"Causing bodily pain, disease, or infirmity to another person." },
      { term:"Grievous Hurt", def:"A more serious category of hurt, specifically listed (e.g. emasculation, permanent loss of sight/hearing, fracture, dislocation) and attracting enhanced punishment." }
    ]
  },
  "s3-crimes:u3:6": {
    items: [
      { term:"Criminal Force", def:"Intentionally using force on another person without consent, to commit an offence or with intent to cause fear, injury, or annoyance." },
      { term:"Assault", def:"A gesture or preparation that causes another person to reasonably apprehend imminent criminal force, without requiring actual physical contact." }
    ]
  },
  "s3-crimes:u4:1": {
    items: [
      { term:"Extortion", def:"Intentionally putting a person in fear of injury, to dishonestly induce them to deliver property or valuable security." }
    ]
  },
  "s3-crimes:u4:2": {
    items: [
      { term:"Robbery", def:"Theft or extortion committed with the additional element of force, fear, or hurt used to accomplish it." },
      { term:"Dacoity", def:"Robbery committed by five or more persons acting together — an aggravated form of robbery." }
    ]
  },
  "s3-crimes:u4:3": {
    items: [
      { term:"Criminal Misappropriation", def:"Dishonestly using or converting movable property for one's own use, where the property came into one's possession lawfully or by chance (e.g. finding lost property), unlike theft which requires taking from another's possession." }
    ]
  },
  "s3-crimes:u4:4": {
    items: [
      { term:"Criminal Breach of Trust", def:"Dishonestly misappropriating property that was entrusted to a person (e.g. an agent, employee, or trustee), in violation of the trust reposed in them — distinguished from theft by the element of lawful entrustment." }
    ]
  },
  "s3-crimes:u4:5": {
    items: [
      { term:"Receiving Stolen Property", def:"Dishonestly receiving or retaining property known or believed to be stolen — a separate offence from the original theft, aimed at those who deal in stolen goods." }
    ]
  },
  "s3-crimes:u4:6": {
    items: [
      { term:"Cheating", def:"Dishonestly or fraudulently inducing a person to deliver property, or to do/omit something they would not otherwise have done, by deception." }
    ],
    examTip: "The key distinguishing feature from a simple civil contract breach is dishonest inducement at the time of the promise — a genuine promise later broken is a civil matter, not cheating."
  },
  "s3-crimes:u4:7": {
    items: [
      { term:"Mischief", def:"Causing wrongful loss or damage to property, with intent to cause such loss/damage or with knowledge that it is likely." }
    ]
  },
  "s3-crimes:u4:8": {
    items: [
      { term:"Criminal Trespass", def:"Entering property in another's possession with intent to commit an offence, intimidate, insult, or annoy, or lawfully entering but unlawfully remaining with such intent." },
      { term:"House-Trespass / House-Breaking", def:"Aggravated forms of criminal trespass specifically involving entry into a building used as a human dwelling, attracting enhanced punishment." }
    ]
  },
  "s3-const:u1:0": {
    items: [
      { term:"Government of India Act, 1935", def:"The pre-independence British statute that provided much of the structural framework (federal scheme, provincial autonomy, government machinery) later adapted into the Indian Constitution." },
      { term:"Constituent Assembly", def:"The body elected to draft India's Constitution, functioning from December 1946 to November 1949, chaired by Dr. Rajendra Prasad, with Dr. B.R. Ambedkar heading the Drafting Committee." }
    ]
  },
  "s3-const:u1:1": {
    items: [
      { term:"Sources of the Indian Constitution", def:"Drew on multiple sources — the Government of India Act 1935 (federal structure), the UK Constitution (parliamentary system), the US Constitution (fundamental rights, judicial review), Ireland (Directive Principles), and others." }
    ]
  },
  "s3-const:u1:3": {
    items: [
      { term:"Salient Features", def:"Includes a lengthy written Constitution, federal structure with unitary bias, parliamentary form of government, fundamental rights, directive principles, an independent judiciary, and a secular, democratic republic." }
    ]
  },
  "s3-const:u1:4": {
    items: [
      { term:"Citizenship (Articles 5–11)", def:"The Constitution provides for a single, uniform citizenship for the whole of India (unlike the dual citizenship of some federations), with rules for citizenship at commencement and Parliament empowered to legislate further via the Citizenship Act, 1955." },
      { term:"Citizenship vs Nationality", def:"Nationality is a broader sociological/international-law concept of belonging to a nation; citizenship is the specific legal status conferring rights and duties (like voting, holding office) within a particular state." }
    ]
  },
  "s3-const:u2:0": {
    items: [
      { term:"Fundamental Rights", def:"Basic rights guaranteed under Part III of the Constitution, enforceable directly against the State through courts (Articles 32/226)." },
      { term:"Human Rights vs Fundamental Rights", def:"Human rights are universal moral entitlements recognised internationally regardless of citizenship; fundamental rights are the specific subset made legally enforceable within a country's constitution." }
    ]
  },
  "s3-const:u2:3": {
    items: [
      { term:"Article 14", def:"Guarantees equality before law and equal protection of laws to all persons within India's territory." },
      { term:"Rule of Law", def:"The principle that everyone, including the government, is subject to and accountable under the law — no one is above it." },
      { term:"Doctrine of Reasonable Classification", def:"Article 14 permits classification for legislative purposes if it is based on an intelligible differentia and has a rational nexus to the object sought to be achieved — arbitrary or unreasonable classification is unconstitutional." }
    ],
    examTip: "The classic case for the reasonable classification test is State of West Bengal v. Anwar Ali Sarkar (1952) — cite it if you need a case for this exact topic."
  },
  "s3-const:u2:5": {
    items: [
      { term:"Article 16", def:"Guarantees equality of opportunity in matters of public employment, while permitting reservation for backward classes under Article 16(4)." },
      { term:"Protective Discrimination", def:"The doctrine that treating unequal groups differently (e.g. reservation for historically disadvantaged groups) can itself be necessary to achieve real, substantive equality rather than just formal equality." }
    ]
  },
  "s3-const:u2:6": {
    items: [
      { term:"Article 17", def:"Abolishes 'untouchability' in any form and forbids its practice, made further enforceable through the Protection of Civil Rights Act, 1955." },
      { term:"Article 18", def:"Abolishes titles (other than military/academic distinctions) to prevent the creation of an artificial aristocratic class." }
    ]
  },
  "s3-const:u3:1": {
    items: [
      { term:"Reasonable Restrictions", def:"Article 19(2)-(6) permit the State to impose reasonable restrictions on the Article 19(1) freedoms on specified grounds (e.g. security of the State, public order, decency, morality) — restrictions must be proportionate, not arbitrary." },
      { term:"Article 20", def:"Protects against ex-post-facto laws (punishment under a law not in force when the act was committed), double jeopardy (being punished twice for the same offence), and self-incrimination (being compelled to be a witness against oneself)." }
    ]
  },
  "s3-const:u4:0": {
    items: [
      { term:"Article 25", def:"Guarantees freedom of conscience and the right to freely profess, practise, and propagate religion, subject to public order, morality, health, and other Part III rights." },
      { term:"Articles 26–28", def:"Cover the right of religious denominations to manage their own affairs (Art.26), freedom from religious taxation (Art.27), and freedom from compulsory religious instruction in State-funded educational institutions (Art.28)." }
    ],
    examTip: "Bijoe Emmanuel v. State of Kerala (1986) — students expelled for not singing the national anthem on religious grounds — is the classic case for freedom of conscience under Article 25; cite it if this topic needs a case."
  },
  "s3-const:u4:1": {
    items: [
      { term:"Article 29", def:"Protects the right of any citizen group with a distinct language, script or culture to conserve it, and prohibits denial of admission to State educational institutions on grounds of religion, race, caste or language." },
      { term:"Article 30", def:"Gives religious and linguistic minorities the right to establish and administer educational institutions of their choice." }
    ]
  },
  "s3-const:u5:0": {
    items: [
      { term:"Directive Principles of State Policy", def:"Guidelines in Part IV (Articles 36–51) directing the State toward social and economic policy goals (e.g. welfare, equal pay, environment) — not directly enforceable in court, but 'fundamental in the governance of the country'." },
      { term:"Non-Justiciability", def:"DPSPs cannot be enforced by courts the way Fundamental Rights can — no writ can compel the State to implement a Directive Principle directly." }
    ]
  },
  "s3-const:u5:2": {
    items: [
      { term:"Enforceability through Legislation", def:"While not directly enforceable, many DPSPs have been implemented through ordinary legislation (e.g. minimum wage laws, environmental protection statutes), which then become fully enforceable as law." }
    ]
  },
  "s3-const:u5:3": {
    items: [
      { term:"Article 51A", def:"Added by the 42nd Amendment (1976), lists Fundamental Duties of citizens (e.g. respecting the Constitution, protecting the environment, promoting harmony) — like DPSPs, generally non-justiciable but morally/constitutionally significant." }
    ]
  },
  "s3-contract:u1:0": {
    items: [
      { term:"Contract (S.2(h), Indian Contract Act)", def:"An agreement enforceable by law." },
      { term:"Agreement (S.2(e))", def:"Every promise and every set of promises forming the consideration for each other." }
    ]
  },
  "s3-contract:u1:1": {
    items: [
      { term:"Offer/Proposal (S.2(a))", def:"When one person signifies to another their willingness to do or abstain from doing something, with a view to obtaining the other's assent, they are said to make a proposal." },
      { term:"Invitation to Treat", def:"An invitation to others to make an offer (e.g. goods displayed in a shop window, an advertisement for tenders) — distinct from an offer itself, since it isn't capable of being 'accepted' to form a contract." },
      { term:"General vs Specific Offer", def:"A general offer is made to the public at large, acceptable by anyone who fulfils its terms (see Carlill); a specific offer is made to a particular person or group, acceptable only by them." }
    ]
  },
  "s3-contract:u1:2": {
    items: [
      { term:"Acceptance (S.2(b))", def:"When the person to whom a proposal is made signifies their assent, the proposal is said to be accepted." },
      { term:"Communication of Acceptance", def:"Acceptance must generally be communicated to the offeror to complete the contract; silence alone does not amount to acceptance (see Felthouse v. Bindley)." },
      { term:"Revocation of Offer/Acceptance", def:"An offer can be revoked any time before acceptance is communicated (S.5); an acceptance can similarly be revoked before it reaches the offeror." }
    ]
  },
  "s3-contract:u1:3": {
    items: [
      { term:"Void Agreement (S.2(g))", def:"An agreement not enforceable by law at all — has no legal effect from the start." },
      { term:"Voidable Contract (S.2(i))", def:"An agreement enforceable by law at the option of one or more parties, but not at the option of the other(s) — e.g. contracts induced by coercion or fraud." },
      { term:"Valid Contract", def:"An agreement satisfying all essential elements (offer, acceptance, consideration, capacity, free consent, lawful object) and fully enforceable." },
      { term:"Illegal Agreement", def:"An agreement forbidden by law — not merely unenforceable, but actively prohibited, often also attracting penal consequences." }
    ]
  },
  "s3-contract:u2:0": {
    items: [
      { term:"Consideration (S.2(d))", def:"When at the desire of the promisor, the promisee (or any other person) has done or abstained from doing something, or promises to do so — the price paid for a promise." },
      { term:"Privity of Contract", def:"The doctrine that only parties to a contract can sue or be sued on it — a person who is not a party generally cannot enforce it, even if the contract was made for their benefit (subject to recognised exceptions)." }
    ]
  },
  "s3-contract:u2:1": {
    items: [
      { term:"Capacity to Contract (S.11)", def:"A person is competent to contract if they are of the age of majority (18), of sound mind, and not disqualified by any law they are subject to." },
      { term:"Minor's Agreement", def:"Void ab initio (Mohori Bibee) — a minor cannot be bound by a contract even if they received a benefit under it, though a contract can validly be entered into for a minor's benefit by a guardian in some circumstances." }
    ]
  },
  "s3-contract:u2:3": {
    items: [
      { term:"Mistake (Bilateral)", def:"Both parties are mistaken about the same fundamental fact — can render the agreement void (S.20)." },
      { term:"Mistake (Unilateral)", def:"Only one party is mistaken — generally does not affect contract validity, except in specific circumstances (e.g. mistake as to identity or the fundamental nature of the document signed)." },
      { term:"Unlawful Consideration/Object (S.23)", def:"Consideration or object is unlawful if forbidden by law, defeats the provisions of any law, is fraudulent, involves injury to person/property, or is regarded as immoral/opposed to public policy — such agreements are void." }
    ]
  },
  "s3-contract:u3:0": {
    items: [
      { term:"Free Consent (S.14)", def:"Consent is free when not caused by coercion, undue influence, fraud, misrepresentation, or mistake." },
      { term:"Coercion (S.15)", def:"Committing or threatening an act forbidden by the Penal Code, or unlawfully detaining/threatening to detain property, to induce a person to enter an agreement." },
      { term:"Undue Influence (S.16)", def:"Where a relationship exists such that one party can dominate the will of the other, and uses that position to obtain an unfair advantage." },
      { term:"Fraud (S.17)", def:"A false representation made knowingly, or without belief in its truth, or recklessly, with intent to deceive and induce a party to enter the contract." },
      { term:"Misrepresentation (S.18)", def:"An innocent (non-fraudulent) false statement of fact made without intent to deceive, which nonetheless induces the other party to enter the contract." }
    ]
  },
  "s3-contract:u3:1": {
    items: [
      { term:"Discharge of Contract", def:"The termination of contractual obligations, occurring by performance, agreement, breach, impossibility (frustration), or operation of law." }
    ]
  },
  "s3-contract:u3:2": {
    items: [
      { term:"Performance", def:"Fulfilling the obligations undertaken under a contract, discharging the parties from further liability." },
      { term:"Doctrine of Frustration (S.56)", def:"A contract becomes void if, after it is made, an act becomes impossible or unlawful due to an event the promisor could not prevent — the parties are excused from further performance." }
    ]
  },
  "s3-contract:u3:3": {
    items: [
      { term:"Anticipatory Breach", def:"Occurs when a party, before the time for performance arrives, refuses to perform or disables themselves from performing — the other party may treat the contract as ended immediately and sue for damages." },
      { term:"Present/Actual Breach", def:"Occurs when a party fails to perform their obligation at the time performance is actually due." }
    ]
  },
  "s3-contract:u4:0": {
    items: [
      { term:"Damages", def:"Monetary compensation awarded for loss caused by breach of contract — aims to put the injured party in the position they would have been in had the contract been performed." },
      { term:"Quantum Meruit", def:"'As much as earned' — a claim allowing a party who has partly performed to recover the reasonable value of work actually done, typically where the original contract has been discharged and full contractual payment isn't available." }
    ]
  },
  "s3-contract:u4:1": {
    items: [
      { term:"Quasi Contract", def:"Obligations imposed by law (not by agreement) to prevent unjust enrichment — e.g. where one party has been unjustly benefited at another's expense, the law creates an obligation to compensate, as if a contract existed (Sections 68–72, Indian Contract Act)." }
    ]
  },
  "s3-family:u1:0": {
    items: [
      { term:"Historical Development of Hindu Law", def:"Evolved from ancient religious texts through medieval commentaries to modern statutory codification (the Hindu Code Bills of the 1950s — Marriage, Succession, Minority & Guardianship, and Adoption & Maintenance Acts)." }
    ]
  },
  "s3-family:u1:1": {
    items: [
      { term:"Shruti", def:"'That which is heard' — the Vedas, considered the most authoritative ancient source of Hindu law, believed to be divine revelation." },
      { term:"Smriti", def:"'That which is remembered' — texts composed by ancient sages (e.g. Manusmriti) elaborating and interpreting the Vedas into practical legal/social rules." },
      { term:"Custom (as a source)", def:"Long-established, continuous, certain, and reasonable practices recognised as binding within a community, often overriding textual law in matters like marriage and inheritance among certain groups." }
    ]
  },
  "s3-family:u1:2": {
    items: [
      { term:"Quran", def:"The primary and most authoritative source of Muslim law, containing God's revealed commands." },
      { term:"Sunnat/Hadith", def:"The practices, sayings, and conduct of Prophet Muhammad, serving as the second primary source explaining and supplementing the Quran." },
      { term:"Ijma", def:"Consensus of Islamic jurists on a point of law not directly addressed by the Quran or Sunnat." },
      { term:"Qiyas", def:"Analogical reasoning — extending an established rule to a new, similar situation not directly covered by the primary sources." }
    ]
  },
  "s3-family:u1:3": {
    items: [
      { term:"Schools of Hindu Law", def:"Primarily the Mitakshara school (followed across most of India, emphasising the right by birth in ancestral property) and the Dayabhaga school (followed in Bengal/Assam, emphasising inheritance only on the owner's death)." },
      { term:"Schools of Muslim Law", def:"Primarily Sunni (with four sub-schools: Hanafi, Maliki, Shafi'i, Hanbali — Hanafi is most followed in India) and Shia (with sub-schools like Ithna Ashari), differing on points of interpretation and jurisprudential method." }
    ]
  },
  "s3-family:u2:0": {
    items: [
      { term:"Marriage (Hindu Law)", def:"Traditionally viewed as a sacrament (samskara) rather than a mere contract, though modern statutory law has introduced contractual elements like conditions for validity and grounds for divorce." },
      { term:"Marriage (Muslim Law — Nikah)", def:"A civil contract (not a sacrament) with defined essential elements — offer (ijab), acceptance (qubul), and mahr (dower) — though it also carries religious and social significance." }
    ]
  },
  "s3-family:u2:2": {
    items: [
      { term:"Saptapadi", def:"The essential Hindu marriage ceremony of taking seven steps together around the sacred fire — where this ceremony is the parties' recognised custom, marriage is treated as complete only when saptapadi is performed." },
      { term:"Sapinda Relationship", def:"A degree of blood relationship within which marriage is prohibited under Hindu law (S.3(f), Hindu Marriage Act), extending to specified generations through both parents." },
      { term:"Degrees of Prohibited Relationship", def:"Specific familial relationships (S.3(g)) within which marriage is barred, distinct from but overlapping with sapinda relationships." }
    ]
  },
  "s3-family:u2:3": {
    items: [
      { term:"Void Marriage (S.11, HMA)", def:"A marriage that is invalid from the outset — e.g. where either party had a living spouse at the time (bigamy), or the parties are within prohibited/sapinda relationships without a permitting custom." },
      { term:"Voidable Marriage (S.12, HMA)", def:"A marriage valid until annulled by a court at the instance of one party — e.g. on grounds of impotence, absence of valid consent, or concealment of pre-marriage pregnancy by another man." }
    ]
  },
  "s3-family:u2:4": {
    items: [
      { term:"Nikah", def:"The Muslim marriage contract, requiring offer and acceptance made in the presence of witnesses, along with an agreed mahr (dower)." },
      { term:"Capacity to Marry (Muslim Law)", def:"Requires the parties to have attained puberty (presumed at 15, absent evidence otherwise) and be of sound mind; a guardian may contract marriage on behalf of a minor, subject to the minor's 'option of puberty' to repudiate it later." }
    ]
  },
  "s3-family:u2:5": {
    items: [
      { term:"Sahih (Valid) Marriage", def:"A Muslim marriage satisfying all essential conditions with no impediments." },
      { term:"Batil (Void) Marriage", def:"A Muslim marriage with a permanent impediment (e.g. marrying within prohibited degrees) — void from the start, with no legal effect." },
      { term:"Fasid (Irregular) Marriage", def:"A Muslim marriage with a removable/temporary impediment (e.g. absence of witnesses, or marrying a fifth wife) — not void, but irregular until the defect is cured or the marriage is terminated." }
    ]
  },
  "s3-family:u2:6": {
    items: [
      { term:"Mahr/Dower", def:"A sum of money or property the husband is obligated to give the wife as a mark of respect, a core essential of a valid Muslim marriage — belongs absolutely to the wife." },
      { term:"Prompt (Muajjal) Dower", def:"Payable immediately on demand by the wife, typically at the time of marriage or whenever she asks for it before consummation." },
      { term:"Deferred (Muwajjal) Dower", def:"Payable only on the dissolution of marriage (by death or divorce), or another agreed future event." }
    ]
  },
  "s3-family:u3:0": {
    items: [
      { term:"Restitution of Conjugal Rights (S.9, HMA)", def:"Allows a spouse who has been deserted without reasonable excuse by the other to seek a court decree directing the other spouse to resume cohabitation." },
      { term:"Judicial Separation (S.10, HMA)", def:"A decree relieving spouses of the obligation to cohabit, without formally dissolving the marriage — often a precursor step before divorce." },
      { term:"Nullity of Marriage", def:"A court declaration that a marriage was void or voidable, effectively treating it (for void marriages) as if it never legally existed." }
    ]
  },
  "s3-family:u4:1": {
    items: [
      { term:"Adoption (HAMA, 1956)", def:"A legal process by which a Hindu adoptive parent takes a child as their own, with the adopted child then treated as a natural-born child of the adoptive family for most legal purposes." },
      { term:"Who May Adopt", def:"Any Hindu male/female of sound mind, who is a major, and (if married) generally requires the spouse's consent, subject to conditions under the Act." }
    ]
  },
  "s3-family:u4:3": {
    items: [
      { term:"Guardianship under Muslim Law", def:"Distinguishes guardianship of the person (custody/hizanat, typically the mother's right for young children) from guardianship of property (typically the father or his executor), unlike Hindu law's more unified concept of natural guardianship." }
    ]
  },
  "s3-family:u4:4": {
    items: [
      { term:"Welfare of the Child (Paramount Consideration)", def:"The overriding principle in all custody disputes — courts prioritise the child's physical, educational, and emotional wellbeing over either parent's individual legal right to custody." },
      { term:"Custody vs Guardianship", def:"Custody concerns day-to-day care and upbringing of the child; guardianship is the broader legal responsibility for the child's person and property, and the two can be held by different people." }
    ]
  },
  // ── Gap-fill: topics that had caselaw + bare act tags but no definitions yet ──
  "s1-legal:u2:1": {
    items: [
      { term:"Internal Aids to Interpretation", def:"Aids found within the statute itself — preamble, title, definition/interpretation clauses, marginal notes, illustrations, and schedules." },
      { term:"External Aids to Interpretation", def:"Aids found outside the statute — parliamentary debates, Law Commission reports, dictionaries, earlier/repealed statutes on the same subject, and foreign judgments." },
      { term:"Mischief Rule", def:"An interpretive approach asking what defect the statute was meant to cure, and construing it to suppress that mischief and advance the remedy (from Heydon's Case)." }
    ]
  },
  "juris:u2:0": {
    items: [
      { term:"Natural Law (Jus Naturale)", def:"The theory that certain laws are derived from nature/reason/morality and exist independent of human enactment — a 'higher law' against which man-made law can be judged." },
      { term:"Ancient Natural Law", def:"Rooted in Greek/Roman philosophy (Aristotle, Cicero) — natural law as universal reason (logos) governing both nature and human affairs." },
      { term:"Modern Natural Law (Revival)", def:"20th-century natural law thinking (e.g. Lon Fuller's 'inner morality of law') responding to the horrors of Nazi-era positivist law, arguing law must meet a moral threshold to count as valid law at all." }
    ]
  },
  "juris:u2:3": {
    items: [
      { term:"Sociological Jurisprudence (Pound)", def:"Roscoe Pound's approach studying law's actual social effects and treating it as a tool for 'social engineering' — balancing individual, public, and social interests." },
      { term:"Interessenjurisprudenz (Ihering)", def:"Rudolf von Ihering's 'jurisprudence of interests' — law exists to protect and reconcile competing social interests, not to serve abstract logical consistency." },
      { term:"Legal Realism", def:"The school (largely American) treating law as what courts actually do in practice, rather than the formal rules on paper — emphasising judicial behaviour and outcomes over doctrine." }
    ]
  },
  "juris:u3:2": {
    items: [
      { term:"Natural Person", def:"A human being recognised by law as capable of holding rights and duties." },
      { term:"Juristic Person", def:"An entity other than a human being (e.g. a corporation, deity, or registered society) that the law treats as capable of holding rights and duties, through legal fiction." },
      { term:"Legal Fiction Theory", def:"The view that juristic personality is an artificial creation of law — attributed to an entity for legal/administrative convenience, not because it is literally a person." }
    ]
  },
  "juris:u3:3": {
    items: [
      { term:"Fiction Theory", def:"A corporation has no real existence of its own — its 'personality' is a pure legal fiction created by the State for convenience (associated with Savigny)." },
      { term:"Realist Theory", def:"A corporation has a real, factual existence as a group entity with its own will, distinct from a mere fiction (associated with Gierke)." },
      { term:"Concession Theory", def:"A corporation's legal personality exists only because the State chooses to 'concede'/grant it — without State recognition, no corporate personality arises." }
    ]
  },
  "laws:u2:2": {
    items: [
      { term:"Law as a Mirror of Society", def:"The view that legal rules reflect the values, morality, and power structures of the society that produced them at a given time." },
      { term:"Law as a Social Construct", def:"The idea that legal categories and rules are not natural/inevitable but actively built and reshaped by social processes, and can therefore be reshaped as social values change." }
    ]
  },
  "laws:u4:0": {
    items: [
      { term:"Reservation", def:"A constitutionally sanctioned policy setting aside a percentage of seats/posts for historically disadvantaged groups (SC/ST/OBC/EWS) to ensure adequate representation." },
      { term:"Creamy Layer", def:"The relatively advanced/well-off section within an otherwise backward class, excluded from reservation benefits meant for the genuinely disadvantaged." }
    ]
  },
  "laws:u4:2": {
    items: [
      { term:"Child Labour", def:"Employment of children below the legally permitted age, particularly in hazardous occupations, prohibited under Article 24 and the Child Labour (Prohibition and Regulation) Act, 1986." },
      { term:"Forced/Bonded Labour", def:"Labour extracted through compulsion, debt bondage, or economic desperation rather than genuine free choice — prohibited under Article 23." }
    ]
  },
  "laws:u4:3": {
    items: [
      { term:"Domestic Violence", def:"Physical, emotional, sexual, or economic abuse within a domestic/family relationship, addressed in India through the Protection of Women from Domestic Violence Act, 2005." },
      { term:"Dowry", def:"Property or valuable security given or demanded in connection with a marriage — prohibited under the Dowry Prohibition Act, 1961, and linked to specific criminal offences (dowry death, cruelty) under the BNS." }
    ]
  },
  "s3-const:u1:2": {
    items: [
      { term:"Federal System", def:"A system where power is constitutionally divided between a central/national government and constituent states, each supreme within its own sphere." },
      { term:"Unitary System", def:"A system where all governmental power is concentrated in a single central authority, with any regional units existing only by its delegation." },
      { term:"Quasi-Federal", def:"India's actual structure — federal in form (division of powers, written Constitution) but with a strong unitary bias (single citizenship, residuary powers with the Centre, Article 356)." }
    ]
  },
  "s3-const:u2:1": {
    items: [
      { term:"State (Article 12)", def:"Includes the Government and Parliament of India, State legislatures/governments, local authorities, and 'other authorities' within India's territory — the entities against whom fundamental rights can be enforced." },
      { term:"Instrumentality or Agency Test", def:"The test (from Ramana Shetty, refined in Ajay Hasia and Pradeep Kumar Biswas) asking whether a body is functionally an extension of government — based on financial, functional, and administrative control." },
      { term:"Other Authorities", def:"Bodies not formally part of government but brought within Article 12 because of deep government control — e.g. statutory corporations, government companies." }
    ]
  },
  "s3-const:u2:2": {
    items: [
      { term:"Doctrine of Eclipse", def:"A pre-Constitution law inconsistent with fundamental rights is not void but merely dormant/unenforceable ('eclipsed'), and can revive if the inconsistency is later removed." },
      { term:"Void Ab Initio", def:"Void from the very moment of enactment — the status of a post-Constitution law inconsistent with fundamental rights, which cannot be revived even if the inconsistency is later removed." },
      { term:"Prospective Operation of Article 13(1)", def:"Article 13(1) only invalidates inconsistent pre-Constitution laws from the date the Constitution commenced — it doesn't retrospectively erase actions validly taken under that law before that date." }
    ]
  },
  "s3-const:u2:4": {
    items: [
      { term:"Reservation (Articles 15/16)", def:"Constitutionally permitted special provisions for socially/educationally backward classes and SC/ST in education (Art.15) and public employment (Art.16), as an exception to formal equality." },
      { term:"Creamy Layer", def:"The relatively advanced members of a backward class, excluded from reservation benefits to ensure they reach the genuinely disadvantaged." },
      { term:"50% Ceiling", def:"The general rule (from Indra Sawhney) that total reservations should not exceed 50% of available seats/posts, except in extraordinary circumstances." }
    ]
  },
  "s3-const:u3:0": {
    items: [
      { term:"Freedom of Speech and Expression (Art.19(1)(a))", def:"Includes the right to express oneself through any medium, and — per Romesh Thappar — the right to circulate what is published." },
      { term:"Reasonable Restrictions (Art.19(2))", def:"Specific, listed grounds (security of the State, public order, decency, defamation, etc.) on which the State may restrict free speech — restrictions must fit within these grounds and be proportionate." },
      { term:"Prior Restraint", def:"Government action preventing speech/publication before it occurs (e.g. censorship), generally viewed with the highest suspicion under Article 19(1)(a)." }
    ]
  },
  "s3-const:u3:2": {
    items: [
      { term:"Right to Life and Personal Liberty (Art.21)", def:"Guarantees no person shall be deprived of life or personal liberty except according to procedure established by law — now read expansively to include livelihood, dignity, privacy, and more." },
      { term:"Procedure Established by Law", def:"India's original (narrower) textual standard for Article 21, later reinterpreted in Maneka Gandhi to require the procedure itself be fair, just and reasonable." },
      { term:"Golden Triangle", def:"The interlinked reading of Articles 14, 19 and 21 (from Maneka Gandhi) — a law affecting personal liberty must satisfy all three, not be tested against each in isolation." }
    ]
  },
  "s3-const:u3:3": {
    items: [
      { term:"Protection Against Arrest and Detention (Art.22)", def:"Guarantees a person arrested must be informed of grounds, allowed to consult a lawyer, and produced before a magistrate within 24 hours — subject to a distinct, more permissive regime for preventive detention." },
      { term:"Preventive Detention", def:"Detention without trial, based on the executive's assessment that a person's future conduct threatens public order/security — permitted under Article 22(3)-(7), subject to safeguards like an Advisory Board review." }
    ]
  },
  "s3-const:u3:4": {
    items: [
      { term:"Forced Labour (Art.23)", def:"Prohibits traffic in human beings and forced/begar labour — now read (per PUDR) to include even paying below minimum wage where the worker had no real economic choice." },
      { term:"Child Labour (Art.24)", def:"Prohibits employing children below 14 in factories, mines, or other hazardous employment." }
    ]
  },
  "s3-const:u4:2": {
    items: [
      { term:"Judicial Review", def:"The power of courts to examine the constitutionality of legislative and executive action, and strike down what violates the Constitution." },
      { term:"Basic Structure Doctrine", def:"The principle (from Kesavananda Bharati) that certain core features of the Constitution — including judicial review — cannot be amended away by Parliament under Article 368." }
    ]
  },
  "s3-const:u4:3": {
    items: [
      { term:"Public Interest Litigation (PIL)", def:"Litigation brought not for a personal grievance but in the interest of the public or a disadvantaged group, with relaxed standing rules allowing a public-spirited person to approach the court on their behalf." },
      { term:"Locus Standi", def:"The traditional requirement that only a person personally/directly affected can sue — significantly relaxed by the Supreme Court to enable PIL." },
      { term:"Epistolary Jurisdiction", def:"The Supreme Court's practice of treating even an informal letter addressed to a judge as a formal writ petition, pioneered to make justice accessible to those who cannot litigate conventionally." }
    ]
  },
  "s3-const:u4:4": {
    items: [
      { term:"Writ Jurisdiction (Art.226)", def:"Empowers High Courts to issue writs (habeas corpus, mandamus, certiorari, prohibition, quo warranto) for enforcement of fundamental rights and 'for any other purpose' — broader than the Supreme Court's Article 32." },
      { term:"Certiorari", def:"A writ quashing a decision made without jurisdiction, in excess of jurisdiction, or containing an error of law apparent on the face of the record." },
      { term:"Mandamus", def:"A writ commanding a public authority to perform a public duty it has failed or refused to perform." }
    ]
  },
  "s3-const:u5:1": {
    items: [
      { term:"Directive Principles of State Policy (DPSP)", def:"Non-justiciable guidelines in Part IV directing State policy toward social/economic welfare goals." },
      { term:"Harmonious Construction", def:"The interpretive principle (applied in Minerva Mills) that Fundamental Rights and Directive Principles must be read together in balance, neither swallowing the other entirely." }
    ]
  },
  "s3-contract:u1:4": {
    items: [
      { term:"Offer/Proposal", def:"A clear signal of willingness to do or abstain from something, made to obtain the other party's assent (S.2(a), Indian Contract Act)." },
      { term:"Acceptance", def:"Unqualified assent to a proposal's exact terms, generally requiring communication to the offeror to complete the contract." },
      { term:"Communication of Acceptance", def:"Acceptance must ordinarily be actually communicated — silence alone (Felthouse v. Bindley) is not enough, and an offeror cannot force acceptance by decreeing silence will count as assent." }
    ]
  },
  "s3-contract:u2:2": {
    items: [
      { term:"Capacity to Contract (S.11)", def:"A person is competent to contract if of the age of majority, of sound mind, and not disqualified by any law they're subject to." },
      { term:"Minor's Agreement", def:"Void ab initio under Indian law (Mohori Bibee) — a minor cannot be held to an ordinary contract even if they received a benefit under it." },
      { term:"Necessaries Exception", def:"A minor can still be liable to pay a reasonable price for genuine necessaries actually needed at the time (S.68), though not for goods merely suited to their social station in general (Nash v. Inman)." }
    ]
  },
  "s3-contract:u2:4": {
    items: [
      { term:"Mistake of Fact (Bilateral)", def:"Both parties are mistaken about the same fundamental fact essential to the contract — can render the agreement void (S.20)." },
      { term:"Mistake as to Identity", def:"Where a party intends to contract only with a specific person and is deceived about who they're actually dealing with, there is no genuine consensus ad idem, and the resulting contract is void (Cundy v. Lindsay)." },
      { term:"Coercion (S.15)", def:"Committing or threatening an act forbidden by law, or unlawfully detaining/threatening to detain property, to induce agreement — includes even a threat of suicide (Chikkam Ammiraju)." }
    ]
  },
  "s3-contract:u2:5": {
    items: [
      { term:"Misrepresentation (S.18)", def:"An innocent (non-fraudulent) false statement of fact, made without intent to deceive, that induces the other party to contract." },
      { term:"Fraud (S.17)", def:"A false statement made knowingly, without belief in its truth, or recklessly, with intent to deceive." },
      { term:"Opinion vs Statement of Fact", def:"An honestly held opinion (Bisset v. Wilkinson) is not actionable misrepresentation, but where the speaker has superior knowledge of facts contradicting their 'opinion' (Smith v. Land), it can be treated as a misrepresentation of fact." }
    ]
  },
  "s3-contract:u3:4": {
    items: [
      { term:"Free Consent (S.14)", def:"Consent not caused by coercion, undue influence, fraud, misrepresentation, or mistake." },
      { term:"Undue Influence (S.16)", def:"Where one party, in a position to dominate the will of the other due to their relationship, uses that position to obtain an unfair advantage — can be presumed from certain relationships of trust (Allcard v. Skinner)." }
    ]
  },
  "s3-contract:u4:2": {
    items: [
      { term:"Entire Contract", def:"A contract requiring complete performance as a condition precedent to any payment — partial performance, however substantial, earns nothing (Cutter v. Powell)." },
      { term:"Substantial Performance", def:"A doctrine allowing recovery (minus the cost of defects) where performance is essentially complete with only minor defects — but not where defects go to the very core of what was promised (Bolton v. Mahadeva)." },
      { term:"Quantum Meruit", def:"'As much as earned' — a claim to recover the reasonable value of work actually done, typically where the original contract has been discharged." }
    ]
  },
  "s3-crimes:u1:5": {
    items: [
      { term:"Insanity Defence (M'Naghten Rule)", def:"A general exception applying where, due to unsoundness of mind, the accused did not know the nature and quality of the act, or that it was wrong." },
      { term:"Right of Private Defence", def:"The right to use reasonable force to protect oneself, another, or property from imminent unlawful harm — can extend even to causing death where there's reasonable apprehension of death or grievous hurt (Darshan Singh)." },
      { term:"Mistake of Fact", def:"An honest and reasonable belief in a mistaken fact that, if true, would have made the act innocent — excuses liability (State of Orissa v. Ram Bahadur Thapa)." }
    ]
  },
  "s3-crimes:u2:0": {
    items: [
      { term:"Criminal Conspiracy", def:"An agreement between two or more persons to commit an illegal act, or a legal act by illegal means — the agreement itself is the offence, regardless of whether the planned act is carried out." },
      { term:"Circumstantial Evidence of Conspiracy", def:"Since conspiracies are typically hatched in secrecy, courts may infer the existence of an agreement from conduct and surrounding circumstances rather than requiring direct proof of an explicit pact." }
    ]
  },
  "s3-crimes:u2:1": {
    items: [
      { term:"Sedition", def:"Speech or conduct inciting hatred, contempt, or disaffection toward government, narrowly construed (Kedar Nath Singh) to require actual incitement to violence or public disorder, not mere criticism." },
      { term:"Public Order", def:"The absence of disturbance affecting the even flow of community life — restrictions on speech justified on this ground must show a real, proximate link to disorder, not just the content being provocative." }
    ]
  },
  "s3-crimes:u3:1": {
    items: [
      { term:"Bigamy", def:"Contracting a second marriage while a valid first marriage subsists, without the first being lawfully dissolved — an offence under the BNS." },
      { term:"Solemnization", def:"The actual performance of a marriage's essential ceremonies (e.g. saptapadi for Hindus) — a bigamy conviction requires proof the second 'marriage' was validly solemnized, not merely claimed (Bhaurao Shankar Lokhande)." }
    ]
  },
  "s3-crimes:u3:3": {
    items: [
      { term:"Offences Against Children", def:"A category of offences (kidnapping, sexual offences, trafficking) attracting enhanced protection given children's vulnerability and inability to give valid legal consent." },
      { term:"Age of Consent", def:"The age below which a person is legally deemed incapable of giving valid consent to sexual activity — currently 18 in India, applicable regardless of marital status (Independent Thought v. UOI)." }
    ]
  },
  "s3-crimes:u3:4": {
    items: [
      { term:"Murder", def:"Culpable homicide committed with intention to cause death, or intention to cause a bodily injury objectively sufficient in the ordinary course of nature to cause death (Virsa Singh's four-fold test), or certain other aggravated states of mind." },
      { term:"Culpable Homicide Not Amounting to Murder", def:"A lesser category where death is caused with intention/knowledge likely to cause death, but without the specific aggravating factors that elevate it to murder (Reg v. Govinda)." },
      { term:"Grave and Sudden Provocation", def:"A partial defence reducing murder to culpable homicide where the accused acted in the heat of the moment after serious provocation — lost if there was a 'cooling-off' period before the act (Nanavati)." }
    ]
  },
  "s3-crimes:u4:0": {
    items: [
      { term:"Theft", def:"Dishonestly taking movable property out of another's possession without consent — complete the moment the property is moved, regardless of whether it is later returned (Pyare Lal Bhargava, K.N. Mehra)." },
      { term:"Dishonest Intention", def:"Intention to cause wrongful gain to oneself or wrongful loss to another — under Indian law, unlike English larceny, doesn't require an intention to permanently deprive the owner." },
      { term:"Claim of Right", def:"A genuine, good-faith belief that one is legally entitled to take the property negates dishonest intention and defeats a theft charge (Ram Ratan v. State of Bihar)." }
    ]
  },
  "s3-family:u2:1": {
    items: [
      { term:"Registration of Marriage", def:"Recording a marriage with the state registrar — evidentiary proof of the marriage, not a precondition for its validity under personal law (Seema v. Ashwani Kumar)." },
      { term:"Solemnization", def:"The actual performance of a marriage's essential ceremonies — a marriage is only validly 'solemnized', and thus provable/registrable, if these were genuinely carried out (Bhaurao Shankar Lokhande)." }
    ]
  },
  "s3-family:u3:1": {
    items: [
      { term:"Irretrievable Breakdown of Marriage", def:"A marriage that has broken down completely and permanently with no possibility of reconciliation — not yet a standalone statutory ground under the Hindu Marriage Act, but courts (and the SC via Article 142) increasingly grant divorce on facts amounting to this (Naveen Kohli)." },
      { term:"Mental Cruelty (S.13(1)(ia))", def:"Sustained conduct causing mental pain and suffering such that the parties cannot reasonably be expected to live together — assessed cumulatively, not through isolated incidents (Samar Ghosh, V. Bhagat)." }
    ]
  },
  "s3-family:u3:2": {
    items: [
      { term:"Talaq", def:"The general term for a Muslim husband's unilateral pronouncement of divorce." },
      { term:"Talaq-e-Biddat (Triple Talaq)", def:"Instant, irrevocable divorce by pronouncing 'talaq' three times in one sitting, without reconciliation attempts — held unconstitutional in Shayara Bano (2017)." },
      { term:"Valid Pronouncement Requirement", def:"Per Shamim Ara, a talaq must be actually, provably pronounced (not merely pleaded in court papers) and should follow reasonable cause and reconciliation attempts." }
    ]
  },
  "s3-family:u3:3": {
    items: [
      { term:"Maintenance", def:"Financial support one spouse/family member is legally obligated to provide another who cannot support themselves." },
      { term:"Iddat", def:"The waiting period (roughly three menstrual cycles or three lunar months) a Muslim woman observes after divorce or her husband's death, historically marking the limit of the husband's maintenance obligation under classical Muslim law." }
    ]
  },
  "s3-family:u4:0": {
    items: [
      { term:"Reasonable and Fair Provision (S.3, 1986 Act)", def:"The Muslim Women (Protection of Rights on Divorce) Act, 1986's requirement that a husband provide for his divorced wife's future within the iddat period — interpreted (Danial Latifi) to mean provision sufficient for her whole remaining life if she doesn't remarry, not just three months." }
    ]
  },
  "s3-family:u4:2": {
    items: [
      { term:"Natural Guardian", def:"A guardian recognised by law by virtue of their relationship to the minor (typically a parent) without needing court appointment." },
      { term:"'After' Reinterpreted", def:"In Section 6(a), Hindu Minority and Guardianship Act, the word 'after' (the father) was reinterpreted by Githa Hariharan to mean 'in the absence of', allowing mothers to act as natural guardian even while the father is alive in appropriate circumstances." }
    ]
  },
  "s1-legal:u1:1": {
    items: [
      { term:"Social Engineering (Roscoe Pound)", def:"The theory that law's function is to balance competing individual and social interests, actively shaping society rather than merely reflecting it." },
      { term:"Article 141", def:"Declares that the law laid down by the Supreme Court is binding on all courts within the territory of India." },
      { term:"Public Interest Litigation (PIL)", def:"A petition filed in the interest of the public/a disadvantaged class, relaxing the usual rule that only an aggrieved party can approach the court, typically under Article 32 (SC) or 226 (HC)." }
    ],
    examTip: "Vishaka is the go-to answer whenever a question asks for an example of the 'social engineering'/gap-filling function of law — courts creating a binding framework where the legislature hadn't yet acted."
  },
  "s1-legal:u2:2": {
    items: [
      { term:"Ratio Decidendi", def:"The binding legal principle or reasoning that was necessary for the court's decision — the only part of a judgment that creates precedent." },
      { term:"Obiter Dicta", def:"Observations or remarks made 'by the way' in a judgment that were not necessary to the decision — persuasive at most, never binding." },
      { term:"Per Incuriam", def:"A decision given 'through lack of care' — in ignorance of a binding statute or precedent — and therefore not binding on future courts." },
      { term:"Sub Silentio", def:"A point of law that was assumed but never argued or decided in a case; because it was never actually considered, it is not treated as binding precedent." }
    ],
    examTip: "For any 'doctrine of precedent' question, structure your answer as: ratio vs obiter → per incuriam exception → sub silentio exception, and use Gurnam Kaur as your case for all three."
  },
  "s1-legal:u3:3": {
    items: [
      { term:"Judicial Review", def:"The power of courts to examine the constitutionality of legislative and executive action, and to strike down what violates the Constitution." },
      { term:"Basic Structure Doctrine", def:"The principle (from Kesavananda Bharati) that certain core features of the Constitution — including judicial review — cannot be amended away by Parliament." },
      { term:"Article 226", def:"Empowers High Courts to issue writs for enforcement of fundamental rights and 'for any other purpose', broader than the Supreme Court's Article 32 writ jurisdiction." }
    ],
    examTip: "L. Chandra Kumar is your case whenever a question links judicial review + basic structure + hierarchy of courts — Tribunals can decide first, but a High Court Division Bench must remain the checkpoint before the Supreme Court."
  },
  "s1-legal:u1:0": {
    items: [
      { term:"Law", def:"A system of rules, backed by the authority of the state, that regulates human conduct and is enforceable through institutions like courts." },
      { term:"Natural Law", def:"The theory that law derives its validity from inherent moral principles, discoverable through reason, independent of state enactment." },
      { term:"Positive Law", def:"Law as it actually exists — validly enacted by a recognised authority — regardless of whether it is morally 'good' (contrasted with natural law)." }
    ]
  },
  "s1-legal:u1:2": {
    items: [
      { term:"Law as an Instrument of Social Control", def:"The view (Roscoe Pound, sociological jurisprudence) that law's primary purpose is to regulate behaviour and balance competing interests within society." },
      { term:"Sociological Jurisprudence", def:"A school of legal thought studying law as a social phenomenon — its actual effects on society, rather than pure logical/formal analysis of legal rules." }
    ]
  },
  "s1-legal:u1:3": {
    items: [
      { term:"Public Law", def:"Law governing the relationship between the state and individuals — e.g. constitutional law, administrative law, criminal law." },
      { term:"Private Law", def:"Law governing relationships between private individuals — e.g. contract, tort, property law." },
      { term:"Substantive Law", def:"Law that defines rights, duties and liabilities (e.g. what constitutes a crime)." },
      { term:"Procedural Law", def:"Law that lays down the process for enforcing substantive rights (e.g. how a case is filed and tried)." }
    ],
    examTip: "This topic is almost always tested as a compare-and-contrast — practice writing quick definitions with one Indian statute as an example for each pair (substantive: BNS; procedural: BNSS)."
  },
  "s1-legal:u1:4": {
    items: [
      { term:"Common Law System", def:"A legal system (originating in England, followed in India) built primarily on judicial precedent and case law, alongside statutes." },
      { term:"Civil Law System", def:"A legal system (originating in continental Europe) built primarily on comprehensive written codes, with judicial decisions playing a secondary, non-binding role." },
      { term:"Stare Decisis", def:"'To stand by things decided' — the doctrine that courts should follow precedents set by earlier decisions in similar cases." }
    ]
  },
  "s1-legal:u2:0": {
    items: [
      { term:"Formal Sources", def:"The source from which a rule of law derives its force and validity — for a positivist, the will of the state." },
      { term:"Material Sources", def:"The source from which the actual content (as opposed to the validity) of a legal rule is drawn — e.g. custom, judicial precedent, professional opinion." },
      { term:"Historical Sources", def:"Origins that influenced a rule's development but are not themselves recognised as legally authoritative today (Salmond's distinction from 'legal' sources)." }
    ]
  },
  "s1-legal:u2:3": {
    items: [
      { term:"Custom", def:"A long-established practice, recognised as having the force of law within a community, historically one of the oldest sources of law." },
      { term:"Religion as a Source of Law", def:"In India, personal laws (marriage, succession, adoption) for various communities remain substantially derived from religious texts and custom, though increasingly codified." },
      { term:"Juristic Opinion", def:"The writings and commentaries of legal scholars, which carry persuasive (not binding) authority when courts interpret ambiguous law." }
    ],
    examTip: "When answering on religion/custom as a source, cite a codification example — Hindu Marriage Act, 1955 codifies what was earlier uncodified religious/customary law."
  },
  "s1-legal:u2:4": {
    items: [
      { term:"Persuasive Authority of Textbooks", def:"Leading textbooks and commentaries (e.g. by eminent jurists) are not binding but are frequently cited by courts as persuasive material when interpreting unsettled points of law." }
    ]
  },
  "s1-legal:u2:5": {
    items: [
      { term:"Parliamentary Debates (Hansard/Lok Sabha–Rajya Sabha Debates)", def:"Records of legislative discussion, usable as an external aid to resolve genuine ambiguity about legislative intent, though not to override clear statutory text." },
      { term:"Statement of Objects and Reasons", def:"A note accompanying a Bill explaining why it was introduced — used as an external aid to understand the mischief a statute was meant to address." },
      { term:"Law Commission Reports", def:"Reports of the Law Commission of India recommending legal reform, often cited by courts to understand the background and purpose of resulting legislation." }
    ]
  },
  "s1-legal:u3:0": {
    items: [
      { term:"Common Law Family", def:"Legal systems (England, India, USA, etc.) built on precedent-based, case-driven development of law alongside statute." },
      { term:"Civil Law Family", def:"Legal systems (France, Germany, most of continental Europe) built on comprehensive codified statutes, with limited role for judicial precedent." }
    ]
  },
  "s1-legal:u3:1": {
    items: [
      { term:"Romano-Germanic Family", def:"The civil law tradition tracing its roots to Roman law and later German legal scholarship, characterised by comprehensive codes (e.g. the French Civil Code)." },
      { term:"Religious Legal Systems", def:"Legal systems where religious texts and doctrine are a primary source of law — e.g. Islamic law (Sharia), Hindu law in its classical (uncodified) form." }
    ]
  },
  "s1-legal:u3:2": {
    items: [
      { term:"Unified Judiciary", def:"India follows a single integrated court hierarchy (Supreme Court → High Courts → subordinate courts) applying both central and state law, unlike a dual federal/state court system." },
      { term:"Doctrine of Precedent in India", def:"Under Article 141, Supreme Court decisions bind all courts in India; High Court decisions bind subordinate courts within that state." }
    ],
    examTip: "Pair this with L. Chandra Kumar (under 'Hierarchy of Courts' topic) if the question also touches judicial review or tribunals."
  },
  "s1-legal:u3:4": {
    items: [
      { term:"Administration of Justice (Salmond)", def:"The state's maintenance of right and law through the exercise of its coercive power via courts, replacing private vengeance/self-help." },
      { term:"Natural Justice", def:"Fundamental procedural fairness principles — audi alteram partem (right to be heard) and nemo judex in causa sua (no one should be a judge in their own cause)." }
    ]
  },
  "s1-legal:u4:0": {
    items: [
      { term:"Legal Research", def:"Systematic investigation into legal principles, rules, and their application, aimed at finding, analysing, or critiquing the law." }
    ]
  },
  "s1-legal:u4:1": {
    items: [
      { term:"Doctrinal Research", def:"'Black-letter law' research — analysing statutes, cases and legal principles through library-based study, without fieldwork." },
      { term:"Non-Doctrinal (Empirical) Research", def:"Research studying law's actual real-world impact and operation, using field methods like surveys and interviews." },
      { term:"Socio-Legal Research", def:"Research examining the relationship between law and society, often combining doctrinal analysis with empirical/sociological methods." }
    ]
  },
  "s1-legal:u4:2": {
    items: [
      { term:"Sampling", def:"Selecting a representative subset of a population for empirical legal research, when studying the entire population isn't feasible." },
      { term:"Data Interpretation", def:"The stage of research where collected data is analysed to draw conclusions relevant to the research question/hypothesis." }
    ]
  },
  "s1-legal:u4:3": {
    items: [
      { term:"Manupatra / SCC Online / Indian Kanoon", def:"Indian legal databases providing access to case law, statutes and commentary — Indian Kanoon is free/open-access, Manupatra and SCC Online are subscription-based." },
      { term:"Westlaw / HeinOnline / LexisNexis", def:"International legal research databases, useful for comparative law, foreign case law, and academic journal articles." }
    ]
  },
  "s1-legal:u4:4": {
    items: [
      { term:"Legal Citation", def:"A standardised reference to a legal source (case, statute, article) allowing it to be located precisely — e.g. 'AIR 1997 SC 3011' identifies a specific reported judgment." },
      { term:"Bibliography", def:"A list of all sources consulted in preparing a piece of legal writing, distinct from citations which reference sources actually relied upon within the text." }
    ]
  },
  "juris:u2:1": {
    items: [
      { term:"Command Theory (Austin)", def:"Law = command of a sovereign, backed by a sanction, habitually obeyed by the bulk of society." },
      { term:"Grundnorm (Kelsen)", def:"The basic norm from which all other legal norms derive their validity, in a hierarchical 'Stufenbau' (step-structure) system." },
      { term:"Rule of Recognition (Hart)", def:"A secondary rule that identifies which primary rules count as valid law within a given legal system." },
      { term:"Article 368", def:"Grants Parliament the power to amend the Constitution, subject to the 'basic structure' limitation established in Kesavananda Bharati." }
    ],
    examTip: "Always pair Austin's command theory with Hart's critique — habitual obedience isn't legal obligation, and Austin can't explain continuing laws or power-conferring rules. Kesavananda is your go-to case for positivism's limits against constitutional supremacy."
  }
};

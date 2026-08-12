// NFSU — B.Sc. LL.B. subject data (all 3 semesters).
// Split out of the former public/js/data/subjects.js during the course-isolation refactor.
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


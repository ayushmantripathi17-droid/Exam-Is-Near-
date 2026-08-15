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

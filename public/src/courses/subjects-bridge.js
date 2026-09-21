import { SUBJECT_JEE_PHY } from "./JEE/Syllabus/Physics.js";
import { SUBJECT_JEE_CHEM } from "./JEE/Syllabus/Chemistry.js";
import { SUBJECT_JEE_MATH } from "./JEE/Syllabus/Mathematics.js";
import { SUBJECT_NEET_PHY } from "./NEET/Syllabus/Physics.js";
import { SUBJECT_NEET_CHEM } from "./NEET/Syllabus/Chemistry.js";
import { SUBJECT_NEET_BOT } from "./NEET/Syllabus/Botany.js";
import { SUBJECT_NEET_ZOO } from "./NEET/Syllabus/Zoology.js";
import { SUBJECT_C10_MATH } from "./CBSE/Class 10/Syllabus/Mathematics.js";
import { SUBJECT_C10_SCI } from "./CBSE/Class 10/Syllabus/Science.js";
import { SUBJECT_C10_ENG } from "./CBSE/Class 10/Syllabus/English.js";
import { SUBJECT_C10_SST } from "./CBSE/Class 10/Syllabus/Social Science.js";
import { SUBJECT_C10_HINDI } from "./CBSE/Class 10/Syllabus/Hindi.js";
import { SUBJECT_CPP } from "./NFSU/Semester 2/Syllabus/C++.js";
import { SUBJECT_RDBMS } from "./NFSU/Semester 2/Syllabus/RDBMS.js";
import { SUBJECT_STATS } from "./NFSU/Semester 2/Syllabus/Statistics.js";
import { SUBJECT_LEGAL } from "./NFSU/Semester 2/Syllabus/Legal Language.js";
import { SUBJECT_LAWS } from "./NFSU/Semester 2/Syllabus/Law & Society.js";
import { SUBJECT_JURIS } from "./NFSU/Semester 2/Syllabus/Jurisprudence.js";
import { SUBJECT_S1_C } from "./NFSU/Semester 1/Syllabus/Basic Programming Concepts Using C.js";
import { SUBJECT_S1_DISCMATH } from "./NFSU/Semester 1/Syllabus/Discrete Mathematics.js";
import { SUBJECT_S1_COMPCORE } from "./NFSU/Semester 1/Syllabus/Fundamentals of Computer Organization & Embedded Systems.js";
import { SUBJECT_S1_LEGAL } from "./NFSU/Semester 1/Syllabus/Legal Methods.js";
import { SUBJECT_S1_TORT } from "./NFSU/Semester 1/Syllabus/Law of Tort and Consumer Protection Laws.js";
import { SUBJECT_S1_LITERATURE } from "./NFSU/Semester 1/Syllabus/Law and Literature.js";
import { SUBJECT_S3_CONST } from "./NFSU/Semester 3/Syllabus/Constitutional Law I.js";
import { SUBJECT_S3_CRIMES } from "./NFSU/Semester 3/Syllabus/Law of Crimes I.js";
import { SUBJECT_S3_CONTRACT } from "./NFSU/Semester 3/Syllabus/Law of Contract I.js";
import { SUBJECT_S3_FAMILY } from "./NFSU/Semester 3/Syllabus/Family Law I.js";
import { SUBJECT_S3_OS } from "./NFSU/Semester 3/Syllabus/Operating System Concepts.js";
import { SUBJECT_S3_WEB } from "./NFSU/Semester 3/Syllabus/Web Programming.js";
import { SUBJECT_C11_ACC } from "./CBSE/Class 11/Syllabus/Accountancy.js";
import { SUBJECT_C11_BIO } from "./CBSE/Class 11/Syllabus/Biology.js";
import { SUBJECT_C11_BS } from "./CBSE/Class 11/Syllabus/Business Studies.js";
import { SUBJECT_C11_CHEM } from "./CBSE/Class 11/Syllabus/Chemistry.js";
import { SUBJECT_C11_ECO } from "./CBSE/Class 11/Syllabus/Economics.js";
import { SUBJECT_C11_ENG } from "./CBSE/Class 11/Syllabus/English Core.js";
import { SUBJECT_C11_GEO } from "./CBSE/Class 11/Syllabus/Geography.js";
import { SUBJECT_C11_HIST } from "./CBSE/Class 11/Syllabus/History.js";
import { SUBJECT_C11_MATH } from "./CBSE/Class 11/Syllabus/Mathematics.js";
import { SUBJECT_C11_PHY } from "./CBSE/Class 11/Syllabus/Physics.js";
import { SUBJECT_C11_POL } from "./CBSE/Class 11/Syllabus/Political Science.js";
import { SUBJECT_C11_PSYC } from "./CBSE/Class 11/Syllabus/Psychology.js";
import { SUBJECT_C11_SOCIO } from "./CBSE/Class 11/Syllabus/Sociology.js";
import { SUBJECT_C12_ACC } from "./CBSE/Class 12/Syllabus/Accountancy.js";
import { SUBJECT_C12_BIO } from "./CBSE/Class 12/Syllabus/Biology.js";
import { SUBJECT_C12_BS } from "./CBSE/Class 12/Syllabus/Business Studies.js";
import { SUBJECT_C12_CHEM } from "./CBSE/Class 12/Syllabus/Chemistry.js";
import { SUBJECT_C12_ECO } from "./CBSE/Class 12/Syllabus/Economics.js";
import { SUBJECT_C12_ENG } from "./CBSE/Class 12/Syllabus/English Core.js";
import { SUBJECT_C12_GEO } from "./CBSE/Class 12/Syllabus/Geography.js";
import { SUBJECT_C12_HIST } from "./CBSE/Class 12/Syllabus/History.js";
import { SUBJECT_C12_MATH } from "./CBSE/Class 12/Syllabus/Mathematics.js";
import { SUBJECT_C12_PHY } from "./CBSE/Class 12/Syllabus/Physics.js";
import { SUBJECT_C12_POL } from "./CBSE/Class 12/Syllabus/Political Science.js";
import { SUBJECT_C12_PSYC } from "./CBSE/Class 12/Syllabus/Psychology.js";
import { SUBJECT_C12_SOCIO } from "./CBSE/Class 12/Syllabus/Sociology.js";

// ══════════════════════════════════════════════════════════════
// SUBJECTS BRIDGE — phase 2 wiring (new file, not from the phase-1 zip)
// ══════════════════════════════════════════════════════════════
// The phase-1 split turned the old single `SUBJECTS_JEE` / `SUBJECTS_CBSE10`
// etc. arrays into one const per subject (SUBJECT_JEE_PHY, SUBJECT_C10_MATH,
// ...). Nothing rebuilt the aggregate arrays that core/course-selector.js,
// core/app-state.js and the feature files all still read directly. This file
// does that rebuild. It must load AFTER every courses/<COURSE>/.../Syllabus
// (and streams.js) file, and BEFORE core/course-selector.js.
//
// It also exposes SUBJECT_BY_ID, a flat id -> subject-object lookup, which
// core/course-selector.js's CBSE11/12 aggregation needs (see the patch note
// in that file) since CBSE11_STREAMS/CBSE12_STREAMS only carry subjectIds,
// not subject objects, post-split.
// ══════════════════════════════════════════════════════════════

const SUBJECTS_JEE = [SUBJECT_JEE_PHY, SUBJECT_JEE_CHEM, SUBJECT_JEE_MATH];

const SUBJECTS_NEET = [SUBJECT_NEET_PHY, SUBJECT_NEET_CHEM, SUBJECT_NEET_BOT, SUBJECT_NEET_ZOO];

const SUBJECTS_CBSE10 = [SUBJECT_C10_MATH, SUBJECT_C10_SCI, SUBJECT_C10_ENG, SUBJECT_C10_SST, SUBJECT_C10_HINDI];

// NFSU "nfsu" (no suffix) = Semester II, per the existing COURSE_SETS label
// ("NFSU — B.Sc. LL.B. Sem II") and switchCourse()'s "cpp" fallback subject id.
const SUBJECTS_NFSU  = [SUBJECT_CPP, SUBJECT_RDBMS, SUBJECT_STATS, SUBJECT_LEGAL, SUBJECT_LAWS, SUBJECT_JURIS];
const SUBJECTS_NFSU1 = [SUBJECT_S1_C, SUBJECT_S1_DISCMATH, SUBJECT_S1_COMPCORE, SUBJECT_S1_LEGAL, SUBJECT_S1_TORT, SUBJECT_S1_LITERATURE];
const SUBJECTS_NFSU3 = [SUBJECT_S3_CONST, SUBJECT_S3_CRIMES, SUBJECT_S3_CONTRACT, SUBJECT_S3_FAMILY, SUBJECT_S3_OS, SUBJECT_S3_WEB];

// CBSE 11/12 don't have single "all subjects" lists of their own — they're
// stream-based (see CBSE11_STREAMS/CBSE12_STREAMS in course-selector.js).
// SUBJECT_BY_ID lets course-selector.js resolve a stream's subjectIds back
// into subject objects without every file needing its own giant switch.
const SUBJECT_BY_ID = {};
[
  ...SUBJECTS_JEE, ...SUBJECTS_NEET, ...SUBJECTS_CBSE10,
  ...SUBJECTS_NFSU, ...SUBJECTS_NFSU1, ...SUBJECTS_NFSU3,
  SUBJECT_C11_ACC, SUBJECT_C11_BIO, SUBJECT_C11_BS, SUBJECT_C11_CHEM, SUBJECT_C11_ECO,
  SUBJECT_C11_ENG, SUBJECT_C11_GEO, SUBJECT_C11_HIST, SUBJECT_C11_MATH, SUBJECT_C11_PHY,
  SUBJECT_C11_POL, SUBJECT_C11_PSYC, SUBJECT_C11_SOCIO,
  SUBJECT_C12_ACC, SUBJECT_C12_BIO, SUBJECT_C12_BS, SUBJECT_C12_CHEM, SUBJECT_C12_ECO,
  SUBJECT_C12_ENG, SUBJECT_C12_GEO, SUBJECT_C12_HIST, SUBJECT_C12_MATH, SUBJECT_C12_PHY,
  SUBJECT_C12_POL, SUBJECT_C12_PSYC, SUBJECT_C12_SOCIO,
].forEach(s => { if (s && s.id) SUBJECT_BY_ID[s.id] = s; });

function _subjectsFromIds(ids){
  return (ids || []).map(id => SUBJECT_BY_ID[id]).filter(Boolean);
}


export { SUBJECTS_CBSE10, SUBJECTS_JEE, SUBJECTS_NEET, SUBJECTS_NFSU, SUBJECTS_NFSU1, SUBJECTS_NFSU3, SUBJECT_BY_ID, _subjectsFromIds };

if (typeof window !== "undefined") {
  Object.assign(window, { SUBJECTS_CBSE10, SUBJECTS_JEE, SUBJECTS_NEET, SUBJECTS_NFSU, SUBJECTS_NFSU1, SUBJECTS_NFSU3, SUBJECT_BY_ID, _subjectsFromIds });
}

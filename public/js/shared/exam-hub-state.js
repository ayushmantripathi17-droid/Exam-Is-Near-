// Shared JEE/NEET exam-hub state (rank predictor, mistakes, SRS, mock, difficulty, percentile tabs).
// Kept shared rather than duplicated per course: it's generically parameterized by njState.exam
// ('neet' | 'jee'), matching the app's own COURSE_SETS/getSubjects() dispatch pattern.
// Split out of the former public/js/features/neetjee-hub-data.js during the course-isolation refactor.

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

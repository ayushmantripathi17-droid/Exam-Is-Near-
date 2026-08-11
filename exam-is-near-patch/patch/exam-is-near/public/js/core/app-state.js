// ══════════════════════════════════════════════════════════════
let state={
  view:"dashboard", activeSubject:"cpp",
  progress:{}, studyLog:{}, mood:3, hoursToday:0,
  subjectNotes:{}, materials:[],
  alarms:[], // [{id,time,label,enabled,days:[],repeat}]
  files:[], // [{id,name,size,type,subjectId,data,created,note}]

  subjectSections:{}, // {subjectId: {qp:[],notes:[],materials:[],playlists:[]}}
  activeSectionTab:{}, // {subjectId: 'qp'|'notes'|'materials'|'playlists'}
  subjectDriveFolders:{}, // {subjectId: {folderId, folderName}}
  showSectionModal:null, // {subjectId, tab, mode:'add'|null}
  newSectionItem:{title:'',url:'',description:'',year:'',subjectId:'',tab:''},
  driveFolderPickerFor:null, // subjectId currently picking folder for
  availableDriveFolders:[], // list from drive
  showFolderPicker:false,
  fileSubFilter:"all", fileSearch:"",
  previewFile:null,
  timerRunning:false, timerSeconds:25*60, timerMode:"study",
  matSubFilter:"all", matTypeFilter:"all", matSearch:"",
  showAddForm:false, editingMatId:null,
  newMat:{subjectId:"cpp",type:"📝 Note",title:"",content:"",tags:""},
  newAlarm:{time:"07:00",label:"Study Time",repeat:false,days:[]},
  adminLinks:[],
  adminYouTube:[],
  examSchedule:[], // admin-set default exam dates from Firestore 'exam_schedule' collection: [{id:subjectId, date:"D Mon YYYY", courseId, subjectName}]
};

let timerInterval=null;
let alarmCheckInterval=null;
let activeAlarmAudio=null;

// ══════════════════════════════════════════════════════════════
// SYNC & STORAGE
// ══════════════════════════════════════════════════════════════
let db=null;
let auth=null;
let storage=null;
let currentUser=null;
function isAdmin(){
  return !!(currentUser && currentUser.email === 'ayushmantripathi17@gmail.com');
}
let syncUserId=null;
let syncStatus="offline";
let unsubscribeFn=null;


// ══════════════════════════════════════════════════════════════
// GOOGLE DRIVE SYNC
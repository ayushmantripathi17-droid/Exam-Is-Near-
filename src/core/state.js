// ══════════════════════════════════════════════════════════════
// STATE
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
let syncUserId=null;
let syncStatus="offline";
let unsubscribeFn=null;


// ══════════════════════════════════════════════════════════════
// GOOGLE DRIVE SYNC
// ══════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
// GOOGLE DRIVE — Link import only (Drive sync removed)
// ══════════════════════════════════════════════════════════════
const DRIVE_SCOPES="";
let driveAccessToken=null,driveTokenClient=null,driveFolderId=null;
let driveStatus="disconnected",driveUploadQueue=[],driveUploading=false,driveClientId="";

function loadGISScript(){return Promise.resolve();}
async function initDriveAuth(){}
function disconnectDrive(){render();}
function updateDriveBadge(){const el=document.getElementById("drive-badge");if(el)el.innerHTML="";}
async function ensureDriveFolder(){return null;}
async function uploadFileToDrive(){return false;}
function queueDriveUpload(){}
async function processUploadQueue(){}
async function manualDriveSync(){showToast("ℹ️ Use Drive link import in the Files tab","info");}

function addDriveLink(){
  const url=document.getElementById("drive-link-input")?.value?.trim();
  const subjectId=document.getElementById("drive-link-sub")?.value||"cpp";
  const name=document.getElementById("drive-link-name")?.value?.trim()||"Drive File";
  if(!url||!url.includes("drive.google")){showToast("⚠️ Enter a valid Google Drive link","alarm");return;}
  const fileObj={id:genId(),name,size:0,type:"drive-link",subjectId,data:null,driveLink:url,created:today(),note:"📎 Google Drive",isDriveLink:true};
  state.files.unshift(fileObj);
  S("files",state.files);
  showToast("✅ Drive link added!","success");
  spawnStars();
  render();
}

function addDriveLinkFromSync(){
  const url=document.getElementById("sync-drive-url")?.value?.trim();
  const subjectId=document.getElementById("sync-drive-sub")?.value||"cpp";
  const name=document.getElementById("sync-drive-name")?.value?.trim()||"Drive File";
  if(!url||!url.includes("drive.google")){showToast("⚠️ Enter a valid Google Drive link","alarm");return;}
  const fileObj={id:genId(),name,size:0,type:"drive-link",subjectId,data:null,driveLink:url,created:today(),note:"📎 Google Drive",isDriveLink:true};
  state.files.unshift(fileObj);
  S("files",state.files);
  showToast("✅ Drive link added to Files!","success");
  spawnStars();
  switchView("files");
}

// FIX: localStorage quota is ~5MB total. Base64 files easily exceed this.
// Separate files from other state so file quota errors don't corrupt progress/notes/etc.

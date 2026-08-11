async function renderProfile(){
  const pro = await isProUser();
  const pct=getTotalPct();
  const totalHours=getTotalHours();
  const streak=getStreak();
  const subProgress=getSubjects().map(s=>({...s,pct:getSubjectPct(s.id)}));
  const badges=[];
  if(pct>=100) badges.push({icon:"🏆",name:"Perfect Score",desc:"100% done"});
  if(pct>=75) badges.push({icon:"⭐",name:"Star Student",desc:"75%+ done"});
  if(pct>=50) badges.push({icon:"📚",name:"Halfway Hero",desc:"50%+ done"});
  if(streak>=7) badges.push({icon:"🔥",name:"Week Warrior",desc:"7-day streak"});
  if(streak>=3) badges.push({icon:"✨",name:"On a Roll",desc:"3-day streak"});
  if(totalHours>=20) badges.push({icon:"⏰",name:"Time Investor",desc:"20+ hours"});
  if(totalHours>=5) badges.push({icon:"💪",name:"Getting Started",desc:"5+ hours"});
  if(state.files.length>=5) badges.push({icon:"📁",name:"File Hoarder",desc:"5+ files"});
  if(state.materials.length>=10) badges.push({icon:"🗂️",name:"Note Taker",desc:"10+ notes"});
  if(badges.length===0) badges.push({icon:"🌱",name:"Beginner",desc:"Just started!"});
  let rank="🌱 Seedling";
  if(pct>=80) rank="🏆 Champion";
  else if(pct>=60) rank="⭐ Scholar";
  else if(pct>=40) rank="📚 Student";
  else if(pct>=20) rank="🌿 Learner";

  // Next upcoming exam
  const nextExam=getSubjects().filter(s=>getDaysLeft(getExamDate(s.id))!==null&&getDaysLeft(getExamDate(s.id))>=0).slice().sort((a,b)=>getDaysLeft(getExamDate(a.id))-getDaysLeft(getExamDate(b.id)))[0]||null;

  // Pro status details
  const proCache=_proCache||{};
  const proExpiresAt=proCache.expiresAt||0;
  const planType=proCache.planType||"monthly";
  const proExpiryStr=proExpiresAt>0?new Date(proExpiresAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—";

  // Member since
  const memberSince=currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})
    : null;

  if(!currentUser) return `<div class="fade-in">
    <div class="card" style="text-align:center;padding:48px 20px">
      <div style="font-size:64px;margin-bottom:16px">👤</div>
      <div style="font-size:20px;font-weight:bold;color:#ccc;margin-bottom:8px">Your Study Profile</div>
      <div style="font-size:13px;color:#555;margin-bottom:24px">Sign in to see personalised stats, achievements & AI insights</div>
      <button onclick="googleSignIn()" style="background:linear-gradient(135deg,#4285F4,#34A853);border:none;color:#fff;padding:14px 28px;border-radius:12px;font-family:inherit;font-size:14px;cursor:pointer;font-weight:bold">🔐 Sign in with Google</button>
    </div>
    </div>`;
  return `<div class="fade-in">

    <!-- ── Identity Card (non-clickable, it's the hero) ── -->
    <div class="card" style="margin-bottom:16px;border-color:#FFE66D22;padding:24px 20px">
      <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
        <div style="position:relative;flex-shrink:0">
          <img src="${esc(currentUser.photoURL||"")}" onerror="this.style.display='none'" style="width:72px;height:72px;border-radius:50%;border:2px solid #FFE66D44;object-fit:cover"/>
          <div style="position:absolute;bottom:-4px;right:-4px;background:#FFE66D;color:#08080f;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px">${pct>=80?"🏆":pct>=50?"⭐":"📚"}</div>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:20px;font-weight:700;letter-spacing:-0.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(currentUser.displayName||"Student")}</div>
          <div style="font-size:12px;color:#555;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(currentUser.email||"")}</div>
          ${memberSince?`<div style="font-size:10px;color:#3a3a4a;margin-top:3px;letter-spacing:0.3px">MEMBER SINCE ${memberSince.toUpperCase()}</div>`:""}
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <span style="background:#FFE66D14;border:1px solid #FFE66D33;color:#FFE66D;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:0.5px">${rank}</span>
            ${isAdmin()?`<span style="background:#FF6B3514;border:1px solid #FF6B3533;color:#FF6B35;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:0.5px">ADMIN</span>`:""}
          </div>
        </div>
      </div>
    </div>

    <!-- ── Subscription ── -->
    <div class="card" onclick="${pro?"":"openProModal()"}" style="margin-bottom:16px;border-color:${pro?"#FFE66D22":"#2a2a3a"};cursor:${pro?"default":"pointer"}">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:11px;color:#444;letter-spacing:1px;font-weight:600;margin-bottom:5px">SUBSCRIPTION</div>
          <div style="font-size:15px;font-weight:700;color:${pro?"#FFE66D":"#ccc"}">${pro?"Pro Plan":"Free Plan"}</div>
          <div style="font-size:11px;color:#555;margin-top:3px">${pro?`<span style="text-transform:capitalize">${esc(planType)}</span> · Renews ${proExpiryStr}`:"Tap to unlock Pro features →"}</div>
        </div>
        ${pro
          ? `<div style="width:36px;height:36px;background:linear-gradient(135deg,#FFE66D,#ffb700);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">⭐</div>`
          : `<div style="width:36px;height:36px;background:#1a1a2a;border:1px solid #2e2e4e;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🔒</div>`}
      </div>
    </div>

    <!-- ── Stats Row (clickable → analytics) ── -->
    <div class="grid-3" style="margin-bottom:16px">
      ${[["📊",pct+"%","Completed","analytics"],["⏱️",totalHours+"h","Hours Logged","log"],["🔥",streak+"d","Day Streak","log"]].map(([ic,v,l,view])=>`
      <div class="stat-box" style="padding:18px 10px;cursor:pointer" onclick="switchView('${view}')">
        <div style="font-size:22px;margin-bottom:6px">${ic}</div>
        <div style="font-size:22px;font-weight:700;color:#FFE66D;margin-bottom:4px">${v}</div>
        <div style="font-size:9px;color:#444;letter-spacing:1px;text-transform:uppercase">${l}</div>
      </div>`).join("")}
    </div>

    <!-- ── AI Study Insights ── -->
    <div class="card" onclick="${pro?"generateProfileInsight()":"openProModal()"}" style="margin-bottom:16px;border-color:#4ECDC422;cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="font-size:13px;font-weight:700;color:#4ECDC4;letter-spacing:0.3px">AI STUDY INSIGHTS</div>
          ${pro?"":`<span style="font-size:9px;background:#1a1a2a;color:#555;border-radius:6px;padding:1px 7px;font-weight:700">PRO</span>`}
        </div>
        <span style="font-size:11px;color:#4ECDC466">${pro?"Tap to refresh →":"Upgrade →"}</span>
      </div>
      <div id="profile-insight" style="font-size:13px;color:#888;line-height:1.7;padding:12px;background:#0a0a12;border-radius:8px">
        ${pro
          ? (pct>=80?"🔥 Excellent! You're well-prepared. Focus on weak spots and do timed mock tests.":
             pct>=50?"📈 Good progress! Keep consistent — daily small sessions beat cramming.":
             "💪 Start with your nearest exam subject. Every topic checked builds momentum!")
          : `<span style="color:#3a3a4a">Unlock AI-powered personalised study insights tailored to your progress and upcoming exams.</span>`}
      </div>
    </div>

    <!-- ── Next Exam Countdown ── -->
    ${nextExam?`<div class="card" onclick="switchView('subjects')" style="margin-bottom:16px;border-color:#FF6B3522;cursor:pointer">
      <div style="font-size:11px;color:#444;letter-spacing:1px;font-weight:600;margin-bottom:12px">NEXT EXAM</div>
      <div style="display:flex;align-items:center;gap:16px">
        <div style="font-size:32px;line-height:1">${nextExam.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(nextExam.name)}</div>
          <div style="font-size:11px;color:#555;margin-top:3px">${esc(getExamDate(nextExam.id))}</div>
        </div>
        ${getDaysLeft(getExamDate(nextExam.id))!==null?`<div style="text-align:right;flex-shrink:0">
          <div style="font-size:30px;font-weight:700;color:#FF6B35;line-height:1">${getDaysLeft(getExamDate(nextExam.id))}</div>
          <div style="font-size:9px;color:#555;letter-spacing:1px;text-transform:uppercase">days left</div>
        </div>`:""}
      </div>
    </div>`:""}

    <!-- ── Subject Progress ── -->
    <div class="card" onclick="switchView('subjects')" style="margin-bottom:16px;cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:11px;color:#444;letter-spacing:1px;font-weight:600">SUBJECT PROGRESS</div>
        <span style="font-size:11px;color:#444">View all →</span>
      </div>
      ${subProgress.map(s=>`<div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:5px">
          <span style="font-size:13px">${s.icon} ${s.name}</span>
          <span style="font-size:12px;color:${s.color};font-weight:700">${s.pct}%</span>
        </div>
        <div class="pbar"><div class="pfill" style="width:${s.pct}%;background:linear-gradient(90deg,${s.color}66,${s.color})"></div></div>
      </div>`).join("")}
    </div>

    <!-- ── Achievements ── -->
    <div class="card" onclick="switchView('analytics')" style="margin-bottom:16px;cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:11px;color:#444;letter-spacing:1px;font-weight:600">ACHIEVEMENTS</div>
        <span style="font-size:10px;color:#444">${badges.length} earned</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${badges.map(b=>`<div style="background:#111122;border:1px solid #1e1e2e;border-radius:10px;padding:10px 12px;text-align:center;min-width:82px">
          <div style="font-size:24px;margin-bottom:5px">${b.icon}</div>
          <div style="font-size:10px;font-weight:700;color:#ccc;line-height:1.3">${b.name}</div>
          <div style="font-size:9px;color:#3a3a4a;margin-top:2px">${b.desc}</div>
        </div>`).join("")}
      </div>
    </div>

    <!-- ── Sign Out ── -->
    <button class="btn-danger" onclick="googleSignOut()" style="width:100%;padding:12px;margin-bottom:4px;font-size:13px;letter-spacing:0.3px">Sign Out</button>
  </div>`;
}



async function generateProfileInsight(){
  const el=document.getElementById("profile-insight");
  if(!el) return;

  // ── PRO GATE: AI insights are a Pro feature ──
  const _proForInsight = await isProUser();
  if(!_proForInsight){
    showToast("⭐ AI Insights require Pro — upgrade to unlock!","info");
    openProModal();
    return;
  }

  el.textContent="⏳ Generating AI insights…";
  const subInfo=getSubjects().map(s=>s.name+":"+getSubjectPct(s.id)+"%").join(", ");
  const prompt=`Student has: ${subInfo}. Total study hours: ${getTotalHours()}. Streak: ${getStreak()} days. Exams start 18 May 2026. Give 2-3 short, specific, encouraging study tips. Max 60 words.`;
  const reply=await askAI(prompt);
  if(el) el.textContent=reply;
}
// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════

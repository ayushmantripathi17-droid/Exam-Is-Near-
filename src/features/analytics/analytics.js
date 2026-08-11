// ══════════════════════════════════════════════════════════════
// ANALYTICS
// ══════════════════════════════════════════════════════════════
async function renderAnalytics(){
  const totalHours=getTotalHours();
  const streak=getStreak();
  const logs=Object.entries(state.studyLog).sort((a,b)=>a[0].localeCompare(b[0])).slice(-14);

  // Hours per subject
  const subHours={};
  getSubjects().forEach(s=>{subHours[s.id]=0;});
  Object.values(state.studyLog).forEach(log=>{
    if(log.subject&&subHours[log.subject]!==undefined) subHours[log.subject]+=(log.hours||0);
  });
  const maxH=Math.max(...Object.values(subHours),1);

  // Last 30 days heatmap — generate for every day regardless of log
  const heatmap=(()=>{
    const cells=[];
    for(let i=29;i>=0;i--){
      const d=new Date(); d.setDate(d.getDate()-i);
      const k=d.toISOString().split("T")[0];
      const h=(state.studyLog[k]?.hours)||0;
      const intensity=Math.min(1,h/4);
      const isToday=k===today();
      const color=h===0?(isToday?"#1a1a0a":"#0f0f18"):`rgba(255,230,109,${0.2+intensity*0.8})`;
      const day=d.getDate();
      cells.push(`<div title="${k}: ${h}h studied" style="width:min(28px,calc((100vw - 80px)/30));height:min(28px,calc((100vw - 80px)/30));min-width:18px;background:${color};border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:7px;color:${h>0?"#1a1200":"#2a2a35"};border:${isToday?"1px solid #FFE66D88":"1px solid #1e1e2e"};flex-shrink:0">${h>0?h+"h":day}</div>`);
    }
    return cells.join("");
  })();

  // ── PRO: Advanced analytics data ──
  const pro = await isProUser();

  // Weekly breakdown (last 4 weeks)
  let weeklyHtml = "";
  if(pro){
    const allLogs = Object.entries(state.studyLog).sort((a,b)=>a[0].localeCompare(b[0]));
    const weeks = [{label:"This week",h:0},{label:"Last week",h:0},{label:"2 weeks ago",h:0},{label:"3 weeks ago",h:0}];
    const now = new Date(); const msDay=86400000;
    allLogs.forEach(([date,log])=>{
      const d = new Date(date);
      const daysAgo = Math.floor((now - d)/msDay);
      const weekIdx = Math.floor(daysAgo/7);
      if(weekIdx < 4) weeks[weekIdx].h += (log.hours||0);
    });
    const maxW = Math.max(...weeks.map(w=>w.h), 1);
    weeklyHtml = `
    <div class="card" style="margin-bottom:16px;border-color:#FFE66D22">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div class="section-label" style="margin-bottom:0">📅 Weekly Report</div>
        <span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:8px;padding:2px 8px;font-weight:700">PRO</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:10px;height:80px">
        ${weeks.reverse().map(w=>{
          const pct=Math.round((w.h/maxW)*100);
          return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
            <div style="font-size:10px;color:#FFE66D;font-weight:700">${w.h}h</div>
            <div style="width:100%;background:#1a1a24;border-radius:4px;height:50px;display:flex;align-items:flex-end">
              <div style="width:100%;height:${Math.max(pct,4)}%;background:linear-gradient(0deg,#FFE66D88,#FFE66D44);border-radius:4px;transition:height 0.5s"></div>
            </div>
            <div style="font-size:8px;color:#444;text-align:center">${w.label}</div>
          </div>`;
        }).join("")}
      </div>
    </div>`;

    // Streak awards
    const streakAwards = [
      {days:3,icon:"🌱",label:"Getting Started",color:"#06D6A0"},
      {days:7,icon:"🔥",label:"One Week Warrior",color:"#FF6B35"},
      {days:14,icon:"⚡",label:"Fortnight Focus",color:"#FFE66D"},
      {days:30,icon:"🏆",label:"Monthly Master",color:"#C77DFF"},
      {days:60,icon:"👑",label:"Study King",color:"#4ECDC4"},
    ];
    const earnedAwards = streakAwards.filter(a=>streak>=a.days);
    const nextAward = streakAwards.find(a=>streak<a.days);
    weeklyHtml += `
    <div class="card" style="margin-bottom:16px;border-color:#FFE66D22">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div class="section-label" style="margin-bottom:0">🏅 Streak Awards</div>
        <span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:8px;padding:2px 8px;font-weight:700">PRO</span>
      </div>
      ${earnedAwards.length===0
        ? `<div style="font-size:12px;color:#333;text-align:center;padding:12px 0">Keep studying! First award at 3-day streak 🌱</div>`
        : `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
          ${earnedAwards.map(a=>`<div style="background:${a.color}15;border:1px solid ${a.color}33;border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:8px">
            <span style="font-size:20px">${a.icon}</span>
            <div><div style="font-size:11px;font-weight:700;color:${a.color}">${a.label}</div><div style="font-size:9px;color:#444">${a.days}+ day streak</div></div>
          </div>`).join("")}
        </div>`
      }
      ${nextAward?`<div style="font-size:11px;color:#444">Next: ${nextAward.icon} ${nextAward.label} at ${nextAward.days} days — ${nextAward.days-streak} to go</div>`:""}
    </div>`;

    // Weak subject insight
    const subPcts = getSubjects().map(s=>({s,pct:getSubjectPct(s.id)}));
    subPcts.sort((a,b)=>a.pct-b.pct);
    const weakest = subPcts[0];
    const strongest = subPcts[subPcts.length-1];
    // Efficiency score: hours studied vs progress gained
    const effScores = getSubjects().map(s=>{
      const h = subHours[s.id]||0;
      const pct = getSubjectPct(s.id);
      const eff = h>0 ? Math.round((pct/Math.max(h,0.1))*10)/10 : 0;
      return{s,h,pct,eff};
    }).filter(x=>x.h>0).sort((a,b)=>b.eff-a.eff);

    weeklyHtml += `
    <div class="card" style="margin-bottom:16px;border-color:#FFE66D22">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div class="section-label" style="margin-bottom:0">🔍 Subject Insights</div>
        <span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:8px;padding:2px 8px;font-weight:700">PRO</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div style="background:#0a180a;border:1px solid #06D6A022;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:20px">${strongest.s.icon}</div>
          <div style="font-size:11px;font-weight:700;color:#06D6A0;margin-top:4px">Strongest</div>
          <div style="font-size:10px;color:#555">${strongest.s.name}</div>
          <div style="font-size:16px;font-weight:800;color:#06D6A0">${strongest.pct}%</div>
        </div>
        <div style="background:#180a0a;border:1px solid #FF6B3522;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:20px">${weakest.s.icon}</div>
          <div style="font-size:11px;font-weight:700;color:#FF6B35;margin-top:4px">Needs Focus</div>
          <div style="font-size:10px;color:#555">${weakest.s.name}</div>
          <div style="font-size:16px;font-weight:800;color:#FF6B35">${weakest.pct}%</div>
        </div>
      </div>
      ${effScores.length>0?`
      <div style="font-size:10px;color:#444;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">Efficiency (% gained per hour)</div>
      ${effScores.map(x=>`<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-bottom:6px">
        <span style="color:#888">${x.s.icon} ${x.s.name}</span>
        <span style="color:${x.eff>=5?'#06D6A0':x.eff>=2?'#FFE66D':'#FF6B35'};font-weight:700;font-family:'JetBrains Mono',monospace">${x.eff}%/hr</span>
      </div>`).join("")}`:""}
    </div>`;
  }

  // Pro lock teaser if free user
  const proLockedHtml = !pro ? `
  <div class="card" style="margin-bottom:16px;border-color:#FFE66D33;background:linear-gradient(135deg,#12100a,#0f0f18);cursor:pointer" onclick="openProModal()">
    <div style="display:flex;align-items:center;gap:14px;padding:4px 0">
      <div style="font-size:32px">📊</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:700;color:#FFE66D;margin-bottom:3px">Advanced Analytics</div>
        <div style="font-size:11px;color:#555;line-height:1.7">Weekly reports · Streak awards · Subject insights · Efficiency scores</div>
      </div>
      <div style="background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:8px;padding:6px 14px;font-size:11px;font-weight:800;flex-shrink:0">Upgrade ⭐</div>
    </div>
  </div>` : "";

  return`<div class="fade-in">
    <div style="font-size:18px;font-weight:bold;margin-bottom:20px">📈 Study Analytics</div>

    <div class="grid-3" style="margin-bottom:20px">
      ${[["⏱️",totalHours+"h","Total Hours"],["🔥",streak+" days","Current Streak"],["📊",Math.round(totalHours/Math.max(Object.keys(state.studyLog).length,1)*10)/10+"h","Daily Avg"]].map(([ic,v,l])=>`
      <div class="stat-box"><div style="font-size:22px">${ic}</div><div style="font-size:20px;font-weight:bold;color:#FFE66D;margin:4px 0">${v}</div><div style="font-size:10px;color:#444">${l}</div></div>`).join("")}
    </div>

    ${weeklyHtml}
    ${proLockedHtml}

    <div class="card" style="margin-bottom:16px">
      <div class="section-label" style="margin-bottom:12px">Hours per Subject</div>
      ${getSubjects().map(s=>{
        const h=subHours[s.id]||0;
        const pct=Math.round((h/maxH)*100);
        return`<div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span>${s.icon} ${s.name}</span><span style="color:${s.color}">${h}h</span>
          </div>
          <div class="pbar"><div class="pfill" style="width:${pct}%;background:${s.color}"></div></div>
        </div>`;
      }).join("")}
    </div>

    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div class="section-label" style="margin-bottom:0">Last 30 Days</div>
        <div style="font-size:10px;color:#444">Each cell = 1 day · colour = hours studied</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:3px;min-height:28px">${heatmap||"<div style='color:#333;font-size:12px;padding:8px'>Log your study hours daily to see the heatmap!</div>"}</div>
    </div>

    <div class="card">
      <div class="section-label" style="margin-bottom:12px">Overall Progress</div>
      ${getSubjects().map(s=>{
        const pct=getSubjectPct(s.id);
        return`<div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span>${s.icon} ${s.name}</span><span style="color:${s.color}">${pct}%</span>
          </div>
          <div class="pbar"><div class="pfill" style="width:${pct}%;background:linear-gradient(90deg,${s.color}88,${s.color})"></div></div>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}


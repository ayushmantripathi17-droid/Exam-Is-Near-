import { getStreak, getSubjectPct, getTotalHours } from "./exam-dates-actions.js";
import { state } from "../../../core/app-state.js";
import { getSubjects } from "../../../core/course-selector.js";
import { today, esc } from "../../../utils/helpers.js";
import { isProUser } from "./payments-pro.js";

// ══════════════════════════════════════════════════════════════
async function renderAnalytics(){
  const totalHours=getTotalHours();
  const streak=getStreak();
  const subs=getSubjects();

  const subHours={};
  subs.forEach(s=>{subHours[s.id]=0;});
  Object.values(state.studyLog).forEach(log=>{
    if(log.subject&&subHours[log.subject]!==undefined) subHours[log.subject]+=(log.hours||0);
  });
  const maxH=Math.max(...Object.values(subHours),1);

  const heatmap=(()=>{
    const cells=[];
    for(let i=29;i>=0;i--){
      const d=new Date(); d.setDate(d.getDate()-i);
      const k=d.toISOString().split("T")[0];
      const h=(state.studyLog[k]?.hours)||0;
      const intensity=Math.min(1,h/4);
      const isToday=k===today();
      cells.push(`<div class="an-cell ${h>0?"on":""} ${isToday?"now":""}" title="${k}: ${h}h studied" style="${h>0?`background:rgba(255,230,109,${0.25+intensity*0.75})`:""}">${h>0?h+"h":d.getDate()}</div>`);
    }
    return cells.join("");
  })();

  const pro = await isProUser();
  const proBadge=`<span class="an-pro">PRO</span>`;
  let proHtml="";
  if(pro){
    const allLogs = Object.entries(state.studyLog).sort((a,b)=>a[0].localeCompare(b[0]));
    const weeks = [{label:"This week",h:0},{label:"Last week",h:0},{label:"2 weeks ago",h:0},{label:"3 weeks ago",h:0}];
    const now = new Date(); const msDay=86400000;
    allLogs.forEach(([date,log])=>{
      const d = new Date(date);
      const daysAgo = Math.floor((now - d)/msDay);
      const weekIdx = Math.floor(daysAgo/7);
      if(weekIdx >= 0 && weekIdx < 4) weeks[weekIdx].h += (log.hours||0);
    });
    const maxW = Math.max(...weeks.map(w=>w.h), 1);
    const weeklyHtml = `
    <div class="an-card">
      <div class="an-ch"><div class="an-lbl">📅 WEEKLY REPORT</div>${proBadge}</div>
      <div class="an-bars">
        ${weeks.slice().reverse().map(w=>{
          const pct=Math.round((w.h/maxW)*100);
          return`<div class="an-bcol">
            <div class="an-bv">${Math.round(w.h*10)/10}h</div>
            <div class="an-btrack"><i style="height:${Math.max(pct,4)}%"></i></div>
            <div class="an-bl">${w.label}</div>
          </div>`;
        }).join("")}
      </div>
    </div>`;

    const streakAwards = [
      {days:3,icon:"🌱",label:"Getting Started",color:"#06D6A0"},
      {days:7,icon:"🔥",label:"One Week Warrior",color:"#FF6B35"},
      {days:14,icon:"⚡",label:"Fortnight Focus",color:"#FFE66D"},
      {days:30,icon:"🏆",label:"Monthly Master",color:"#C77DFF"},
      {days:60,icon:"👑",label:"Study King",color:"#4ECDC4"},
    ];
    const earnedAwards = streakAwards.filter(a=>streak>=a.days);
    const nextAward = streakAwards.find(a=>streak<a.days);
    const awardsHtml = `
    <div class="an-card">
      <div class="an-ch"><div class="an-lbl">🏅 STREAK AWARDS</div>${proBadge}</div>
      ${earnedAwards.length===0
        ? `<div class="an-muted" style="text-align:center;padding:12px 0">Keep studying! First award at a 3-day streak 🌱</div>`
        : `<div class="an-awards">${earnedAwards.map(a=>`<div class="an-award" style="--c:${a.color}">
            <span style="font-size:22px">${a.icon}</span>
            <div><b>${a.label}</b><span>${a.days}+ day streak</span></div>
          </div>`).join("")}</div>`}
      ${nextAward?`<div class="an-muted" style="margin-top:12px">Next: ${nextAward.icon} ${nextAward.label} at ${nextAward.days} days — <b style="color:var(--txt)">${nextAward.days-streak}</b> to go</div>`:""}
    </div>`;

    const subPcts = subs.map(s=>({s,pct:getSubjectPct(s.id)}));
    subPcts.sort((a,b)=>a.pct-b.pct);
    const weakest = subPcts[0];
    const strongest = subPcts[subPcts.length-1];
    const effScores = subs.map(s=>{
      const h = subHours[s.id]||0;
      const pct = getSubjectPct(s.id);
      const eff = h>0 ? Math.round((pct/Math.max(h,0.1))*10)/10 : 0;
      return{s,h,pct,eff};
    }).filter(x=>x.h>0).sort((a,b)=>b.eff-a.eff);

    const insightsHtml = strongest&&weakest?`
    <div class="an-card">
      <div class="an-ch"><div class="an-lbl">🔍 SUBJECT INSIGHTS</div>${proBadge}</div>
      <div class="an-ins">
        <div class="an-in" style="--c:#06D6A0"><span class="ic">${strongest.s.icon}</span><em>Strongest</em><small>${esc(strongest.s.name)}</small><b>${strongest.pct}%</b></div>
        <div class="an-in" style="--c:#FF6B35"><span class="ic">${weakest.s.icon}</span><em>Needs Focus</em><small>${esc(weakest.s.name)}</small><b>${weakest.pct}%</b></div>
      </div>
      ${effScores.length>0?`
      <div class="an-lbl" style="margin:16px 0 10px">EFFICIENCY · % GAINED PER HOUR</div>
      ${effScores.map(x=>`<div class="an-eff"><span>${x.s.icon} ${esc(x.s.name)}</span><b style="color:${x.eff>=5?'#06D6A0':x.eff>=2?'#FFE66D':'#FF6B35'}">${x.eff}%/hr</b></div>`).join("")}`:""}
    </div>`:"";
    proHtml=`<div class="an-two">${weeklyHtml}${awardsHtml}</div>${insightsHtml}`;
  }

  const proLockedHtml = !pro ? `
  <div class="an-lock" onclick="openProModal()">
    <div style="font-size:34px">📊</div>
    <div style="flex:1;min-width:0">
      <b>Advanced Analytics</b>
      <span>Weekly reports · Streak awards · Subject insights · Efficiency scores</span>
    </div>
    <div class="an-up">Upgrade ⭐</div>
  </div>` : "";

  const css=`<style>
.an{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:1000px;margin:0 auto}
.an *{box-sizing:border-box}
.an-h1{font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--txt);line-height:1.1}
.an-h2{font-size:13px;color:var(--mute);margin:6px 0 18px}
.an-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
@media(max-width:560px){.an-stats{gap:8px}}
.an-stat{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:18px;padding:16px;position:relative;overflow:hidden}
.an-stat:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 100% 0%,color-mix(in srgb,var(--c) 18%,transparent),transparent 60%)}
.an-stat>*{position:relative}
.an-stat .ic{font-size:22px}
.an-stat b{display:block;font-size:26px;font-weight:800;letter-spacing:-1px;color:var(--c);margin:6px 0 2px;line-height:1}
.an-stat span{font-size:10.5px;color:var(--mute);letter-spacing:.6px;font-weight:600}
.an-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:20px;padding:20px;margin-bottom:14px}
.an-ch{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.an-lbl{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--mute)}
.an-pro{font-size:9px;font-weight:800;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-radius:99px;padding:3px 10px}
.an-muted{font-size:12px;color:var(--mute)}
.an-two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:760px){.an-two{grid-template-columns:1fr;gap:0}}
.an-two .an-card{margin-bottom:14px}
.an-bars{display:flex;align-items:flex-end;gap:12px;height:130px}
.an-bcol{flex:1;height:100%;display:flex;flex-direction:column;align-items:center;gap:6px}
.an-bv{font-size:11px;font-weight:800;color:var(--acc)}
.an-btrack{flex:1;width:100%;border-radius:10px;background:color-mix(in srgb,var(--txt) 7%,transparent);display:flex;align-items:flex-end;overflow:hidden}
.an-btrack i{display:block;width:100%;border-radius:10px;background:linear-gradient(0deg,#FF6B35,#FFE66D);transition:height .6s}
.an-bl{font-size:9.5px;color:var(--mute);text-align:center;font-weight:600}
.an-awards{display:flex;flex-wrap:wrap;gap:8px}
.an-award{display:flex;align-items:center;gap:10px;padding:9px 13px;border-radius:14px;border:1px solid color-mix(in srgb,var(--c) 35%,var(--line));background:color-mix(in srgb,var(--c) 10%,transparent)}
.an-award b{display:block;font-size:12px;color:var(--c)}
.an-award span{font-size:10px;color:var(--mute)}
.an-ins{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.an-in{--c:#06D6A0;text-align:center;padding:14px;border-radius:16px;border:1px solid color-mix(in srgb,var(--c) 30%,var(--line));background:color-mix(in srgb,var(--c) 8%,transparent)}
.an-in .ic{font-size:24px;display:block}
.an-in em{display:block;font-style:normal;font-size:11.5px;font-weight:800;color:var(--c);margin-top:5px}
.an-in small{display:block;font-size:11px;color:var(--mute);margin:2px 0 4px}
.an-in b{font-size:22px;font-weight:800;color:var(--c);letter-spacing:-.5px}
.an-eff{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;padding:7px 0;border-bottom:1px solid var(--line);color:var(--text-3,#aaa)}
.an-eff:last-child{border:none}
.an-eff b{font-family:'JetBrains Mono',monospace}
.an-lock{display:flex;align-items:center;gap:14px;padding:18px 20px;margin-bottom:14px;border-radius:20px;cursor:pointer;border:1px solid color-mix(in srgb,var(--acc) 35%,var(--line));background:radial-gradient(circle at 0% 0%,color-mix(in srgb,var(--acc) 14%,transparent),transparent 60%),var(--glass-bg,var(--surf));transition:.2s}
.an-lock:hover{transform:translateY(-2px)}
.an-lock b{display:block;font-size:14px;color:var(--acc);margin-bottom:3px}
.an-lock span{font-size:11.5px;color:var(--mute);line-height:1.6}
.an-up{background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-radius:11px;padding:8px 15px;font-size:12px;font-weight:800;flex-shrink:0;box-shadow:0 6px 16px -6px #FFB70088}
.an-row{margin-bottom:14px}
.an-row:last-child{margin:0}
.an-row-h{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;margin-bottom:7px;color:var(--text-2,#ccc);font-weight:600}
.an-row-h b{color:var(--c);font-weight:800}
.an-bar{height:7px;border-radius:99px;background:color-mix(in srgb,var(--txt) 8%,transparent);overflow:hidden}
.an-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,color-mix(in srgb,var(--c) 55%,transparent),var(--c));transition:width .8s}
.an-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:760px){.an-grid2{grid-template-columns:1fr;gap:0}}
.an-heat{display:grid;grid-template-columns:repeat(10,1fr);gap:5px}
@media(max-width:480px){.an-heat{grid-template-columns:repeat(6,1fr)}}
.an-cell{aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:700;color:var(--text-7,#666);background:color-mix(in srgb,var(--txt) 6%,transparent);border:1px solid transparent}
.an-cell.on{color:#1a1200}
.an-cell.now{border-color:var(--acc)}
</style>`;

  const avg=Math.round(totalHours/Math.max(Object.keys(state.studyLog).length,1)*10)/10;
  return`${css}<div class="an fade-in">
    <div class="an-h1">📈 Study Analytics</div>
    <div class="an-h2">Hours, streaks and progress across your subjects.</div>

    <div class="an-stats">
      ${[["⏱️",totalHours+"h","TOTAL HOURS","#FFE66D"],["🔥",streak+" days","CURRENT STREAK","#FF6B35"],["📊",avg+"h","DAILY AVG","#06D6A0"]].map(([ic,v,l,c])=>`
      <div class="an-stat" style="--c:${c}"><span class="ic">${ic}</span><b>${v}</b><span>${l}</span></div>`).join("")}
    </div>

    ${proHtml}
    ${proLockedHtml}

    <div class="an-grid2">
      <div class="an-card">
        <div class="an-lbl" style="margin-bottom:14px">HOURS PER SUBJECT</div>
        ${subs.map(s=>{
          const h=subHours[s.id]||0;
          const pct=Math.round((h/maxH)*100);
          return`<div class="an-row" style="--c:${s.color}">
            <div class="an-row-h"><span>${s.icon} ${esc(s.name)}</span><b>${Math.round(h*10)/10}h</b></div>
            <div class="an-bar"><i style="width:${pct}%"></i></div>
          </div>`;
        }).join("")}
      </div>
      <div class="an-card">
        <div class="an-lbl" style="margin-bottom:14px">OVERALL PROGRESS</div>
        ${subs.map(s=>{
          const pct=getSubjectPct(s.id);
          return`<div class="an-row" style="--c:${s.color}">
            <div class="an-row-h"><span>${s.icon} ${esc(s.name)}</span><b>${pct}%</b></div>
            <div class="an-bar"><i style="width:${pct}%"></i></div>
          </div>`;
        }).join("")}
      </div>
    </div>

    <div class="an-card">
      <div class="an-ch"><div class="an-lbl" style="margin:0">LAST 30 DAYS</div><div class="an-muted">Each cell = 1 day · colour = hours studied</div></div>
      <div class="an-heat">${heatmap}</div>
    </div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// AI STUDY ASSISTANT VIEW

export { renderAnalytics };

if (typeof window !== "undefined") {
  Object.assign(window, { renderAnalytics });
}

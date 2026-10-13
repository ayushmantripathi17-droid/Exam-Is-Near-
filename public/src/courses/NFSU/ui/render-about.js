import { loadAll } from "../../../core/firebase-sync.js";
import { checkShareLinkOnLoad } from "../features/files-materials.js";
import { CourseSelectorShared, showCourseSelector } from "../../../core/course-selector.js";
import { checkAlarms, updateClock } from "../features/clock-alarms-timer.js";

// ══════════════════════════════════════════════════════════════
function renderAbout(){
  const contacts=[
    {icon:"🌐",label:"Website",val:"exam-is-near.web.app",href:"https://exam-is-near.web.app",color:"#4ECDC4"},
    {icon:"📧",label:"Email",val:"arksetu@gmail.com",href:"mailto:arksetu@gmail.com",color:"#06D6A0"},
    {icon:"🐛",label:"Bug Report",val:"arksetu@gmail.com",href:"mailto:arksetu@gmail.com?subject=Bug Report — Exam Is Near",color:"#ff6b35"},
    {icon:"💡",label:"Feature Request",val:"arksetu@gmail.com",href:"mailto:arksetu@gmail.com?subject=Feature Request — Exam Is Near",color:"#a78bfa"},
  ];
  const feats=["🤖 AI Chat History","📚 Unlimited Flashcards","☁️ 25GB Cloud Backup","📈 Advanced Analytics","🚫 Ad-Free Experience","📤 Export as PDF","⚡ Priority AI Tutor","🔔 Early Feature Access"];
  const css=`<style>
.ab{--line:var(--border-2,#2a2a3a);--surf:var(--surface,#0f0f18);--mute:var(--text-5,#777);--txt:var(--text,#eee);--acc:var(--gold,#FFE66D);max-width:760px;margin:0 auto}
.ab *{box-sizing:border-box}
.ab-hero{position:relative;overflow:hidden;text-align:center;padding:38px 20px 30px;margin-bottom:14px;border-radius:24px;border:1px solid var(--line);background:radial-gradient(circle at 50% 0%,color-mix(in srgb,#FF6B35 20%,transparent),transparent 65%),radial-gradient(circle at 0% 100%,color-mix(in srgb,#4ECDC4 14%,transparent),transparent 55%),var(--glass-bg,var(--surf))}
.ab-hero:before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#FFE66D,#ff6b35,#4ECDC4)}
.ab-logo{width:92px;height:92px;margin:0 auto 14px;display:grid;place-items:center;font-size:44px}
.ab-t{font-size:30px;font-weight:800;letter-spacing:-1px;background:linear-gradient(90deg,#FFE66D,#ff6b35);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;line-height:1.1}
.ab-by{font-size:11px;color:var(--mute);letter-spacing:3px;text-transform:uppercase;margin:8px 0 12px;font-weight:700}
.ab-d{font-size:13.5px;color:var(--text-3,#aaa);line-height:1.8;max-width:440px;margin:0 auto}
.ab-card{background:var(--glass-bg,var(--surf));border:1px solid var(--line);border-radius:20px;padding:20px;margin-bottom:14px}
.ab-lbl{font-size:10px;font-weight:800;letter-spacing:1.6px;color:var(--mute);margin-bottom:12px}
.ab-p{font-size:12.5px;color:var(--mute);line-height:1.8;margin:0 0 14px}
.ab-cg{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:560px){.ab-cg{grid-template-columns:1fr}}
.ab-c{--c:#4ECDC4;display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--line);border-radius:15px;text-decoration:none;background:color-mix(in srgb,var(--txt) 3%,transparent);transition:.2s}
.ab-c:hover{border-color:var(--c);transform:translateY(-2px);box-shadow:0 10px 24px -14px var(--c)}
.ab-c .i{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:18px;background:color-mix(in srgb,var(--c) 14%,transparent);flex-shrink:0}
.ab-c b{display:block;font-size:10px;color:var(--mute);letter-spacing:1px;text-transform:uppercase;font-weight:700}
.ab-c span{display:block;font-size:12px;color:var(--c);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600}
.ab-c em{margin-left:auto;font-style:normal;color:var(--mute)}
.ab-pv{font-size:12.5px;color:var(--mute);line-height:2}
.ab-pv a{color:#4ECDC4}
.ab-v{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.ab-v b{display:block;font-size:14px;color:var(--acc)}
.ab-v span{font-size:11px;color:var(--mute)}
.ab-btn{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);background:var(--surf);color:var(--text-2,#ccc);padding:10px 16px;border-radius:12px;font-weight:700;font-size:12.5px;font-family:inherit;cursor:pointer;transition:.2s}
.ab-btn:hover{border-color:var(--acc)}
.ab-pro{border-color:color-mix(in srgb,var(--acc) 35%,var(--line));background:radial-gradient(circle at 100% 0%,color-mix(in srgb,var(--acc) 14%,transparent),transparent 60%),var(--glass-bg,var(--surf))}
.ab-pro-h{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:16px}
.ab-pro-h b{display:block;font-size:17px;color:var(--acc);margin-bottom:6px}
.ab-pro-h p{margin:0;font-size:12.5px;color:var(--mute);line-height:1.8;max-width:340px}
.ab-price{text-align:center;flex-shrink:0}
.ab-price .n{font-size:32px;font-weight:800;color:var(--acc);font-family:'JetBrains Mono',monospace;letter-spacing:-1.5px;line-height:1}
.ab-price .n small{font-size:12px;color:var(--mute);font-weight:500;font-family:inherit;letter-spacing:0}
.ab-price .d{font-size:10.5px;color:var(--mute);margin:3px 0 12px}
.ab-go{border:none;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;padding:11px 24px;border-radius:12px;font-weight:800;font-size:13px;font-family:inherit;cursor:pointer;box-shadow:0 8px 20px -8px #FFB700aa;transition:.2s}
.ab-go:hover{transform:translateY(-2px)}
.ab-f{display:grid;grid-template-columns:1fr 1fr;gap:2px 10px}
@media(max-width:480px){.ab-f{grid-template-columns:1fr}}
.ab-f div{display:flex;align-items:center;gap:9px;font-size:12px;color:var(--text-3,#aaa);padding:7px 2px}
.ab-f i{font-style:normal;color:#06D6A0;font-weight:800}
.ab-foot{text-align:center;margin-top:18px;font-size:11.5px}
.ab-foot a{color:var(--mute);text-decoration:none}
.ab-foot a:hover{color:var(--txt)}
.ab-foot span{color:var(--line);margin:0 8px}
</style>`;
  return`${css}<div class="ab fade-in">
    <div class="ab-hero">
      <div class="ab-logo">${(()=>{const l=document.querySelector(".header img");return l&&l.src?`<img src="${l.src}" alt="Exam Is Near logo"/>`:"📚";})()}</div>
      <div class="ab-t">Exam Is Near</div>
      <div class="ab-by">by ArkSetu</div>
      <div class="ab-d">A free AI-powered study companion for JEE, NEET, CBSE, UPSC, CLAT, and NFSU students.</div>
    </div>

    <div class="ab-card">
      <div class="ab-lbl">📬 CONTACT US</div>
      <p class="ab-p">Found a bug or want to suggest a feature? Reach out — we reply fast.</p>
      <div class="ab-cg">
        ${contacts.map(c=>`<a class="ab-c" style="--c:${c.color}" href="${c.href}" target="_blank" rel="noopener">
          <span class="i">${c.icon}</span>
          <div style="flex:1;min-width:0"><b>${c.label}</b><span>${c.val}</span></div>
          <em>→</em>
        </a>`).join("")}
      </div>
    </div>

    <div class="ab-card ab-pro">
      <div class="ab-lbl">⭐ UPGRADE TO PRO</div>
      <div class="ab-pro-h">
        <div>
          <b>Exam Is Near Pro</b>
          <p>Unlock AI chat history, unlimited flashcards, cloud backup, advanced analytics, ad-free experience and PDF exports — for less than a cup of chai per day.</p>
        </div>
        <div class="ab-price">
          <div class="n">₹149<small>/mo</small></div>
          <div class="d">≈ ₹5/day</div>
          <button class="ab-go" onclick="openProModal()">⭐ Go Pro</button>
        </div>
      </div>
      <div class="ab-f">${feats.map(f=>`<div><i>✓</i>${f}</div>`).join("")}</div>
    </div>

    <div class="ab-card">
      <div class="ab-lbl">🔒 PRIVACY &amp; ADS</div>
      <div class="ab-pv">
        • Study data is stored locally on your device or in your Google account via Firebase.<br>
        • We do not sell or share your personal data with third parties.<br>
        • This app uses <b style="color:var(--text-3,#aaa)">Google AdSense</b> to keep it free for everyone.<br>
        • <a href="https://policies.google.com/privacy" target="_blank">Google's Privacy Policy</a> &nbsp;·&nbsp; <a href="https://adssettings.google.com" target="_blank">Manage Ad Settings</a>
      </div>
    </div>

    <div class="ab-card">
      <div class="ab-v">
        <div><b>Exam Is Near · Study Smart v16</b><span>© 2025–2026 ArkSetu. All rights reserved.</span></div>
        <button class="ab-btn" onclick="switchView('sync')">🔄 Sync Settings</button>
      </div>
    </div>

    <div class="ab-foot">
      <a href="privacy.html" target="_blank" rel="noopener">🔒 Privacy Policy</a><span>·</span><a href="https://adssettings.google.com" target="_blank" rel="noopener">Ad Settings</a>
    </div>
  </div>`;
}

// ── INIT ──
// Clear stale flashcards from localStorage (they had no subject context)
localStorage.removeItem("st_flashcards");
loadAll();  // async - calls render() internally
checkShareLinkOnLoad();
// Show course selector if no course explicitly chosen yet
// Clear stale activeCourse if it was set by old code (not by switchCourse)
const _courseChosen = localStorage.getItem("courseChosen");
if(!CourseSelectorShared.activeCourse || !_courseChosen){ 
  CourseSelectorShared.activeCourse = null;
  setTimeout(()=>showCourseSelector(), 900); 
}
// Request notification permission for alarms
if("Notification" in window && Notification.permission==="default"){
  setTimeout(()=>Notification.requestPermission(),2000);
}

// Clock — every second
setInterval(()=>{updateClock();checkAlarms();},1000);
updateClock();

// ══════════════════════════════════════════════════════════════
// PRO PLAN SYSTEM — by ArkSetu (Secure Server-Verified v2)

export { _courseChosen, renderAbout };

if (typeof window !== "undefined") {
  Object.assign(window, { _courseChosen, renderAbout });
}

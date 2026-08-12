// ══════════════════════════════════════════════════════════════
function renderAbout(){
  return`<div class="fade-in">
    <!-- Hero -->
    <div style="text-align:center;padding:28px 16px 20px;margin-bottom:16px;background:linear-gradient(135deg,#0f0f18,#12121e);border:1px solid #1e1e2e;border-radius:16px;position:relative;overflow:hidden">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#FFE66D,#ff6b35,#4ECDC4)"></div>
      <div style="font-size:42px;margin-bottom:10px">📚</div>
      <div style="font-size:22px;font-weight:bold;background:linear-gradient(90deg,#FFE66D,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px">Exam Is Near</div>
      <div style="font-size:12px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">by ArkSetu</div>
      <div style="font-size:12px;color:#444;line-height:1.8;max-width:420px;margin:0 auto">A free AI-powered study companion for JEE, NEET, CBSE, UPSC, CLAT, and NFSU students.</div>
    </div>

    <!-- Contact Us -->
    <div class="card" style="margin-bottom:12px;border-color:#4ECDC433">
      <div class="section-label">📬 Contact Us</div>
      <div style="font-size:12px;color:#777;line-height:1.9;margin-bottom:14px">
        Found a bug or want to suggest a feature? Reach out — we reply fast.
      </div>
      ${[
        {icon:"🌐",label:"Website",val:"exam-is-near.web.app",href:"https://exam-is-near.web.app",color:"#4ECDC4"},
        {icon:"📧",label:"Email",val:"arksetu@gmail.com",href:"mailto:arksetu@gmail.com",color:"#06D6A0"},
        {icon:"🐛",label:"Bug Report",val:"arksetu@gmail.com",href:"mailto:arksetu@gmail.com?subject=Bug Report — Exam Is Near",color:"#ff6b35"},
        {icon:"💡",label:"Feature Request",val:"arksetu@gmail.com",href:"mailto:arksetu@gmail.com?subject=Feature Request — Exam Is Near",color:"#a78bfa"},
      ].map(c=>`<a href="${c.href}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:#0a0a12;border:1px solid #1e1e2e;border-radius:9px;text-decoration:none;margin-bottom:7px;transition:all 0.2s" onmouseover="this.style.borderColor='${c.color}55'" onmouseout="this.style.borderColor='#1e1e2e'">
        <span style="font-size:18px;flex-shrink:0">${c.icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:10px;color:#555;letter-spacing:1px;text-transform:uppercase">${c.label}</div>
          <div style="font-size:11px;color:${c.color};margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.val}</div>
        </div>
        <span style="color:#333;font-size:12px">→</span>
      </a>`).join("")}
    </div>

    <!-- Privacy & AdSense note -->
    <div class="card" style="margin-bottom:12px;border-color:#2a2a3a">
      <div class="section-label">🔒 Privacy & Ads</div>
      <div style="font-size:11px;color:#555;line-height:2">
        • Study data is stored locally on your device or in your Google account via Firebase.<br>
        • We do not sell or share your personal data with third parties.<br>
        • This app uses <b style="color:#888">Google AdSense</b> to keep it free for everyone.<br>
        • <a href="https://policies.google.com/privacy" target="_blank" style="color:#4ECDC4">Google's Privacy Policy</a> &nbsp;·&nbsp; <a href="https://adssettings.google.com" target="_blank" style="color:#4ECDC4">Manage Ad Settings</a>
      </div>
    </div>

    <!-- Version -->
    <div class="card" style="margin-bottom:12px;border-color:#FFE66D22">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <div>
          <div style="font-size:13px;font-weight:bold;color:#FFE66D">Exam Is Near · Study Smart v16</div>
          <div style="font-size:10px;color:#444;margin-top:3px">© 2025–2026 ArkSetu. All rights reserved.</div>
        </div>
        <button class="btn-ghost" onclick="switchView('sync')" style="font-size:11px">🔄 Sync Settings</button>
      </div>
    </div>

    <!-- ── PRO PLAN CARD ── -->
    <div class="card" style="margin-top:12px;border-color:#FFE66D33;background:linear-gradient(135deg,#12100a,#0f0f18)">
      <div class="section-label">⭐ Upgrade to Pro</div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:16px">
        <div style="flex:1;min-width:180px">
          <div style="font-size:15px;font-weight:700;color:#FFE66D;margin-bottom:8px">Exam Is Near Pro</div>
          <div style="font-size:12px;color:#666;line-height:2">Unlock AI chat history, unlimited flashcards, cloud backup, advanced analytics, ad-free experience and PDF exports — for less than a cup of chai per day.</div>
        </div>
        <div style="text-align:center;flex-shrink:0;padding:4px">
          <div style="font-size:28px;font-weight:800;color:#FFE66D;font-family:'JetBrains Mono',monospace">₹149<span style="font-size:12px;color:#555;font-weight:400;font-family:'Inter',inherit">/mo</span></div>
          <div style="font-size:10px;color:#444;margin-bottom:12px">≈ ₹5/day</div>
          <button class="btn-gold" onclick="openProModal()" style="padding:10px 20px;font-size:13px;font-weight:700">⭐ Go Pro</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
        ${["🤖 AI Chat History","📚 Unlimited Flashcards","☁️ 25GB Cloud Backup","📈 Advanced Analytics","🚫 Ad-Free Experience","📤 Export as PDF","⚡ Priority AI Tutor","🔔 Early Feature Access"].map(f=>`
          <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:#666;padding:6px 4px">
            <span style="color:#06D6A0;font-size:11px;flex-shrink:0">✓</span>${f}
          </div>`).join("")}
      </div>
    </div>

    <!-- Privacy Policy link -->
    <div style="text-align:center;margin-top:16px">
      <a href="privacy.html" target="_blank" rel="noopener" style="font-size:11px;color:#333;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#666'" onmouseout="this.style.color='#333'">🔒 Privacy Policy</a>
      <span style="color:#1e1e2e;margin:0 8px">·</span>
      <a href="https://adssettings.google.com" target="_blank" rel="noopener" style="font-size:11px;color:#333;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#666'" onmouseout="this.style.color='#333'">Ad Settings</a>
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
if(!activeCourse || !_courseChosen){ 
  activeCourse = null;
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
// Day/Night theme polish: (1) pill-style toggle, (2) light-theme overrides for
// hard-coded dark inline colours used by the render functions, (3) header no
// longer sticks over the page content.
const TXT = { "#EDE8E0": "--text", "#ede8e0": "--text", "#ccc": "--text-2", "#bbb": "--text-3", "#aaa": "--text-3",
  "#888": "--text-4", "#777": "--text-4", "#666": "--text-5", "#555": "--text-6", "#444": "--text-7", "#333": "--text-8", "#d4c8a8": "--text-2" };
const BG = { "#0f0f18": "--surface", "#0a0a12": "--bg-alt", "#08080f": "--bg", "#111": "--surface-4", "#0a0a14": "--bg-alt",
  "#1a1a24": "--surface-3", "#1a1a28": "--surface-3", "#1a1a2a": "--surface-3", "#1e1e1e": "--surface-3", "#222": "--surface-3" };
const BORDER = { "#1e1e2e": "--border", "#2a2a3a": "--border-2", "#222": "--border-2", "#333": "--border-2", "#3a3a4a": "--border-3" };

function build() {
  const L = '[data-theme="light"] ';
  let css = "";
  for (const [hex, v] of Object.entries(TXT))
    css += `${L}[style*=";color:${hex}"],${L}[style^="color:${hex}"],${L}[style*="; color:${hex}"]{color:var(${v})!important}\n`;
  for (const [hex, v] of Object.entries(BG))
    css += `${L}[style*="background:${hex}"],${L}[style*="background: ${hex}"]{background:var(${v})!important}\n`;
  for (const [hex, v] of Object.entries(BORDER))
    css += `${L}[style*="solid ${hex}"]{border-color:var(${v})!important}\n`;
  return css;
}

const css = `
.header{position:relative!important}

/* ── Day / Night pill toggle ── */
.theme-toggle{width:68px!important;height:36px!important;border-radius:99px!important;padding:3px!important;font-size:0!important;
  justify-content:flex-start!important;overflow:hidden;bottom:18px;right:18px}
.theme-toggle .tt-ic{position:absolute;top:0;width:34px;height:36px;display:grid;place-items:center;font-size:15px;z-index:2;
  transition:opacity .25s,transform .35s;pointer-events:none}
.theme-toggle .tt-sun{left:1px}.theme-toggle .tt-moon{right:1px}
.theme-toggle .tt-thumb{position:absolute;top:3px;left:3px;width:30px;height:30px;border-radius:50%;z-index:1;
  background:linear-gradient(135deg,#FFE66D,#ffb700);box-shadow:0 3px 10px rgba(255,183,0,.45);
  transition:transform .35s cubic-bezier(.4,1.4,.5,1),background .3s}
[data-theme="dark"] .theme-toggle .tt-thumb{transform:translateX(32px);background:linear-gradient(135deg,#8a8fff,#5a5fd8);box-shadow:0 3px 10px rgba(90,95,216,.5)}
[data-theme="dark"] .theme-toggle .tt-sun{opacity:.45}
[data-theme="light"] .theme-toggle .tt-moon{opacity:.45}
@media(max-width:700px){.theme-toggle{bottom:78px!important;right:14px!important;width:62px!important;height:34px!important}
  .theme-toggle .tt-ic{width:31px;height:34px}.theme-toggle .tt-thumb{width:28px;height:28px}
  [data-theme="dark"] .theme-toggle .tt-thumb{transform:translateX(28px)}}

/* ── AI Assistant polish (theme-aware, better contrast) ── */
.ai-sidebar{border-right:1px solid var(--border-2)}
.ai-new-chat-btn{border-radius:14px;padding:11px 14px;font-weight:700;font-size:12.5px;color:var(--text-2);background:color-mix(in srgb,var(--text) 4%,transparent)}
.ai-new-chat-btn:hover{color:var(--text)}
.ai-sidebar-label{color:var(--text-6);font-weight:800;letter-spacing:1.4px}
.ai-session-item{border-radius:12px;padding:9px 11px}
.ai-sess-title{color:var(--text-4)}
.ai-sess-time{color:var(--text-6)}
.ai-model-badge{color:var(--text-5);border:1px solid var(--border-2);border-radius:12px}
.ai-topbar{border-bottom:1px solid var(--border-2)}
.ai-topbar-title{color:var(--text);font-weight:800;font-size:15px}
.ai-back-btn,.ai-toggle-btn{color:var(--text-5)}
.ai-clear-btn{color:var(--text-5);border-color:var(--border-2);border-radius:99px}
.ai-subject-select{border-radius:99px;padding:6px 12px;background:var(--surface)}
.ai-chat-wrap{padding:24px 18px}
.ai-avatar{width:32px;height:32px;border-radius:11px;font-size:15px}
.ai-bubble.bot{color:var(--text-2);font-size:14px;line-height:1.75}
.ai-bubble.user{background:linear-gradient(135deg,color-mix(in srgb,#FFE66D 18%,var(--surface)),var(--surface-3));border:1px solid color-mix(in srgb,#FFE66D 25%,var(--border-2));color:var(--text);border-radius:20px 20px 6px 20px}
.ai-sender-name{color:var(--text-5)}
.ai-msg-row.user .ai-sender-name{color:var(--text-5)}
.ai-meta{color:var(--text-6)}
.ai-input-area{border-top:1px solid var(--border-2);padding:14px 18px 16px}
.ai-input-box{border-radius:22px;background:var(--surface);box-shadow:var(--shadow-soft)}
.ai-input-box:focus-within{border-color:#4ECDC4;box-shadow:0 0 0 4px color-mix(in srgb,#4ECDC4 14%,transparent)}
.ai-chip{color:var(--text-5);border-radius:99px;padding:5px 12px;font-weight:600}
.ai-send-btn{width:38px;height:38px;border-radius:13px;box-shadow:0 8px 18px -8px #06D6A0}
.ai-hint{color:var(--text-6)}
.ai-welcome-logo{width:64px;height:64px;border-radius:20px;font-size:30px}
.ai-welcome-grid{max-width:520px;gap:10px}
.ai-welcome-card{border-radius:18px;padding:16px;background:var(--glass-bg,var(--surface));border:1px solid var(--border-2)}
.ai-welcome-card:hover{border-color:#4ECDC4;box-shadow:0 14px 28px -16px #4ECDC4}
.ai-wc-icon{font-size:22px;margin-bottom:8px}
.ai-wc-title{color:var(--text);font-size:13px;font-weight:800}
.ai-wc-desc{color:var(--text-5);font-size:11.5px;line-height:1.5}
@media(max-width:560px){.ai-welcome-grid{grid-template-columns:1fr}}

/* ── Light-theme overrides for hard-coded dark inline colours ── */
${build()}
[data-theme="light"] .card,[data-theme="light"] .stat-box{box-shadow:var(--shadow-soft)}
[data-theme="light"] input,[data-theme="light"] select,[data-theme="light"] textarea{color:var(--text)}
`;

const st = document.createElement("style");
st.id = "eis-theme-fix";
st.textContent = css;
document.head.appendChild(st);

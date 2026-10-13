// Self-contained, theme-aware styles for the AI Study Assistant page.
const css = `
.ai-page{display:flex;height:100vh;height:100dvh;min-height:500px;overflow:hidden;background:var(--bg)}
body.ai-fullscreen-view{overflow:hidden}
body.ai-fullscreen-view .header{display:none}
body.ai-fullscreen-view #main-content.container{max-width:none;margin:0;padding:0;width:100%}
body.ai-fullscreen-view #mobile-nav-drawer{top:0}
body.ai-fullscreen-view #pro-footer-bar,body.ai-fullscreen-view #ad-unit-bottom,body.ai-fullscreen-view footer.site-footer{display:none!important}
body.ai-fullscreen-view .theme-toggle{bottom:112px!important;right:18px!important;transform:scale(.88);transform-origin:bottom right}

/* ── Sidebar ── */
.ai-sidebar{width:272px;min-width:272px;background:var(--surface);border-right:1px solid var(--border-2);display:flex;flex-direction:column;overflow:hidden;transition:width .25s ease,min-width .25s ease}
.ai-sidebar.collapsed{width:0;min-width:0;border-right:none}
.ai-sidebar-top{padding:14px 12px 6px;flex-shrink:0}
.ai-new-chat-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:9px;padding:12px;border-radius:14px;border:none;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;font-family:inherit;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 10px 22px -10px #FFB700aa;transition:transform .2s,box-shadow .2s}
.ai-new-chat-btn:hover{transform:translateY(-1px);box-shadow:0 14px 26px -10px #FFB700cc}
.ai-sidebar-label{font-size:10px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:var(--text-6);padding:14px 10px 6px}
.ai-sessions-list{flex:1;overflow-y:auto;padding:0 10px 12px}
.ai-sessions-list::-webkit-scrollbar,.ai-chat-wrap::-webkit-scrollbar{width:5px}
.ai-sessions-list::-webkit-scrollbar-thumb,.ai-chat-wrap::-webkit-scrollbar-thumb{background:var(--border-2);border-radius:99px}
.ai-session-item{display:flex;align-items:center;gap:9px;padding:10px 11px;border-radius:12px;cursor:pointer;margin-bottom:3px;border:1px solid transparent;transition:background .15s,border-color .15s}
.ai-session-item:hover{background:color-mix(in srgb,var(--text) 5%,transparent)}
.ai-session-item.active{background:color-mix(in srgb,#4ECDC4 13%,var(--surface));border-color:color-mix(in srgb,#4ECDC4 38%,var(--border-2))}
.ai-sess-icon{display:flex;color:var(--text-6);flex-shrink:0}
.ai-session-item.active .ai-sess-icon{color:#4ECDC4}
.ai-sess-title{flex:1;min-width:0;font-size:12.5px;font-weight:600;line-height:1.35;color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ai-session-item.active .ai-sess-title{color:var(--text)}
.ai-sess-time{font-size:10px;color:var(--text-6);flex-shrink:0}
.ai-sess-del{width:22px;height:22px;display:grid;place-items:center;padding:0;border:none;background:none;color:var(--text-6);border-radius:7px;font-size:11px;font-family:inherit;cursor:pointer;opacity:0;transition:.15s;flex-shrink:0}
.ai-session-item:hover .ai-sess-del{opacity:1}
@media(hover:none){.ai-sess-del{opacity:.75}}
.ai-sess-del:hover{background:#ff5c5c22;color:#ff5c5c}
.ai-empty-sess{padding:28px 14px;font-size:12px;color:var(--text-6);text-align:center;line-height:1.7}
.ai-sidebar-bottom{padding:12px;border-top:1px solid var(--border-2);flex-shrink:0}
.ai-model-badge{display:flex;align-items:center;gap:9px;font-size:11px;font-weight:600;color:var(--text-4);padding:10px 12px;border-radius:12px;border:1px solid var(--border-2);background:color-mix(in srgb,var(--text) 3%,transparent)}
.ai-model-dot{width:7px;height:7px;border-radius:50%;background:#06D6A0;box-shadow:0 0 0 3px #06D6A02a;animation:pulse 2s ease-in-out infinite;flex-shrink:0}
.ai-model-dot.thinking{background:#FFE66D;box-shadow:0 0 0 3px #FFE66D2a}

/* ── Main / topbar ── */
.ai-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;background:var(--bg)}
.ai-topbar{display:flex;align-items:center;gap:8px;padding:12px 18px;border-bottom:1px solid var(--border-2);flex-shrink:0;background:var(--surface)}
.ai-back-btn,.ai-toggle-btn{width:34px;height:34px;display:grid;place-items:center;border:none;background:none;color:var(--text-5);cursor:pointer;border-radius:10px;transition:.15s;flex-shrink:0;padding:0}
.ai-back-btn:hover,.ai-toggle-btn:hover{background:color-mix(in srgb,var(--text) 7%,transparent);color:var(--text)}
.ai-topbar-title{flex:1;min-width:0;font-size:15px;font-weight:800;letter-spacing:-.2px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ai-topbar-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
.ai-pro-badge{display:inline-flex;align-items:center;white-space:nowrap;font-size:10px;font-weight:800;letter-spacing:.8px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#12100a;border-radius:99px;padding:4px 11px}
.ai-subject-select{background:var(--bg);border:1px solid var(--border-2);color:var(--text-2);padding:8px 12px;border-radius:99px;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;outline:none;max-width:200px;margin:0;width:auto}
.ai-subject-select:focus{border-color:#4ECDC4}
.ai-clear-btn{background:none;border:1px solid var(--border-2);color:var(--text-5);padding:7px 14px;border-radius:99px;font-size:11.5px;font-weight:700;font-family:inherit;cursor:pointer;transition:.15s}
.ai-clear-btn:hover{color:#ff5c5c;border-color:#ff5c5c66;background:#ff5c5c14}

/* ── Chat ── */
.ai-chat-wrap{flex:1;overflow-y:auto;padding:26px 18px;display:flex;flex-direction:column;scroll-behavior:smooth}
.ai-msg-row{display:flex;align-items:flex-start;gap:12px;width:100%;max-width:820px;margin:0 auto 20px;animation:fadeInUp .25s ease}
.ai-msg-row.user{flex-direction:row-reverse}
.ai-avatar{width:34px;height:34px;border-radius:12px;flex-shrink:0;display:grid;place-items:center;overflow:hidden}
.ai-avatar.bot{background:linear-gradient(135deg,#4ECDC4,#06D6A0);color:#fff;box-shadow:0 8px 18px -8px #06D6A0}
.ai-avatar.user{background:color-mix(in srgb,var(--text) 8%,transparent);color:var(--text-4);border:1px solid var(--border-2)}
.ai-avatar img{width:100%;height:100%;object-fit:cover}
.ai-bubble-wrap{flex:1;min-width:0;max-width:700px}
.ai-msg-row.user .ai-bubble-wrap{display:flex;flex-direction:column;align-items:flex-end}
.ai-sender-name{font-size:11px;font-weight:800;letter-spacing:.4px;color:var(--text-5);margin-bottom:5px}
.ai-bubble{font-size:14px;line-height:1.75;word-break:break-word;color:var(--text-2)}
.ai-bubble.bot{padding:2px 0}
.ai-bubble.user{padding:12px 17px;border-radius:20px 20px 6px 20px;max-width:90%;color:var(--text);background:linear-gradient(135deg,color-mix(in srgb,#FFE66D 20%,var(--surface)),var(--surface));border:1px solid color-mix(in srgb,#FFE66D 28%,var(--border-2))}
.ai-bubble p{margin:0 0 9px}
.ai-bubble p:last-child{margin-bottom:0}
.ai-bubble strong{color:var(--text);font-weight:800}
.ai-bubble em{color:var(--text-3)}
.ai-bubble .ai-h{font-weight:800;font-size:14.5px;color:#4ECDC4;margin:14px 0 6px}
.ai-bubble ul,.ai-bubble ol{margin:6px 0 10px;padding-left:22px}
.ai-bubble li{margin:3px 0}
.ai-bubble blockquote{margin:8px 0;padding:8px 14px;border-left:3px solid #4ECDC4;border-radius:0 10px 10px 0;background:color-mix(in srgb,#4ECDC4 8%,transparent);color:var(--text-3)}
.ai-bubble code{font-family:'JetBrains Mono',monospace;font-size:12.5px;background:color-mix(in srgb,var(--text) 8%,transparent);color:#0e8f86;padding:2px 7px;border-radius:7px}
[data-theme="dark"] .ai-bubble code{color:#4ECDC4}
.ai-bubble pre{margin:10px 0;padding:14px 16px;overflow-x:auto;border-radius:14px;background:var(--surface);border:1px solid var(--border-2)}
.ai-bubble pre code{background:none;padding:0;color:var(--text-2);font-size:12.5px;line-height:1.65}
.ai-meta{display:flex;align-items:center;gap:10px;font-size:10.5px;color:var(--text-6);margin-top:6px}
.ai-copy{display:inline-flex;align-items:center;gap:5px;border:none;background:none;color:var(--text-6);font-size:11px;font-weight:700;font-family:inherit;cursor:pointer;padding:3px 8px;border-radius:8px;opacity:0;transition:.15s}
.ai-msg-row:hover .ai-copy{opacity:1}
@media(hover:none){.ai-copy{opacity:.8}}
.ai-copy:hover{background:color-mix(in srgb,var(--text) 8%,transparent);color:var(--text)}
.ai-typing{display:flex;gap:5px;padding:10px 0;align-items:center}
.ai-typing span{width:7px;height:7px;border-radius:50%;background:#4ECDC4;animation:aiDot 1.2s ease-in-out infinite}
.ai-typing span:nth-child(2){animation-delay:.18s}
.ai-typing span:nth-child(3){animation-delay:.36s}
@keyframes aiDot{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-5px);opacity:1}}

/* ── Welcome ── */
.ai-welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;text-align:center;padding:36px 20px;gap:22px}
.ai-welcome-logo{width:68px;height:68px;border-radius:22px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#4ECDC4,#06D6A0);box-shadow:0 18px 36px -14px #06D6A0;animation:float 3.2s ease-in-out infinite}
.ai-welcome-h{font-size:26px;font-weight:800;letter-spacing:-.6px;color:var(--text)}
.ai-welcome-s{font-size:13.5px;color:var(--text-5);margin-top:6px}
.ai-welcome-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;max-width:560px}
.ai-welcome-card{text-align:left;cursor:pointer;padding:16px;border-radius:18px;background:var(--glass-bg,var(--surface));border:1px solid var(--border-2);transition:transform .2s,border-color .2s,box-shadow .2s}
.ai-welcome-card:hover{transform:translateY(-3px);border-color:#4ECDC4;box-shadow:0 16px 30px -18px #4ECDC4}
.ai-wc-icon{font-size:22px;margin-bottom:8px}
.ai-wc-title{font-size:13px;font-weight:800;color:var(--text);margin-bottom:3px}
.ai-wc-desc{font-size:11.5px;color:var(--text-5);line-height:1.5}

/* ── Input ── */
.ai-input-area{flex-shrink:0;padding:10px 18px 14px;background:linear-gradient(0deg,var(--bg) 70%,transparent)}
.ai-chips{display:flex;gap:7px;overflow-x:auto;max-width:860px;margin:0 auto 10px;padding:0 44px 2px 0;scrollbar-width:none;-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 44px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 44px),transparent)}
.ai-chips::-webkit-scrollbar{display:none}
.ai-chip{flex:0 0 auto;border:1px solid var(--border-2);background:var(--surface);color:var(--text-4);padding:7px 13px;border-radius:99px;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;white-space:nowrap;transition:.18s}
.ai-chip:hover{border-color:#4ECDC4;color:#0e8f86;background:color-mix(in srgb,#4ECDC4 10%,var(--surface))}
[data-theme="dark"] .ai-chip:hover{color:#4ECDC4}
.ai-input-box{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:flex-end;gap:10px;max-width:860px;margin:0 auto;padding:8px 8px 8px 18px;border-radius:24px;background:var(--surface);border:1.5px solid var(--border-2);box-shadow:0 10px 30px -18px rgba(0,0,0,.45);transition:border-color .2s,box-shadow .2s}
.ai-input-box:focus-within{border-color:#4ECDC4;box-shadow:0 0 0 4px color-mix(in srgb,#4ECDC4 16%,transparent)}
.ai-input-area .ai-input-box textarea.ai-textarea{height:26px;min-height:26px;max-height:150px;overflow-y:auto;rows:1}
.ai-textarea{flex:1 1 auto;width:auto;height:auto;min-width:0;background:transparent;border:none;outline:none;color:var(--text);font-family:inherit;font-size:14px;line-height:1.55;padding:9px 0;resize:none;max-height:150px;min-height:24px;margin:0;box-sizing:border-box}
.ai-textarea::placeholder{color:var(--text-6)}
.ai-send-btn{align-self:flex-end;width:42px;height:42px;border-radius:15px;border:none;display:grid;place-items:center;cursor:pointer;flex-shrink:0;color:#fff;background:linear-gradient(135deg,#4ECDC4,#06D6A0);box-shadow:0 10px 20px -10px #06D6A0;transition:transform .2s,box-shadow .2s}
.ai-send-btn:hover:not(:disabled){transform:scale(1.07)}
.ai-send-btn:disabled{background:color-mix(in srgb,var(--text) 10%,transparent);color:var(--text-6);box-shadow:none;cursor:not-allowed}
.ai-hint{text-align:center;font-size:10.5px;color:var(--text-6);margin-top:8px}
.ai-hint-free{color:var(--gold,#b45309);font-weight:700}
.ai-hint-up{color:#0e8f86;font-weight:800;cursor:pointer}
[data-theme="dark"] .ai-hint-up{color:#4ECDC4}

/* ── Mobile ── */
.ai-sidebar-overlay{display:none;position:fixed;inset:0;z-index:349;background:#00000088;backdrop-filter:blur(3px)}
@media(max-width:700px){
  .ai-sidebar{position:fixed;left:0;top:0;bottom:0;z-index:350;width:86vw;max-width:320px;min-width:0;transform:translateX(-100%);transition:transform .25s ease;box-shadow:0 0 40px #0008}
  .ai-sidebar.mobile-open{transform:translateX(0)}
  .ai-sidebar.collapsed{transform:translateX(-100%);width:86vw}
  .ai-sidebar-overlay.visible{display:block}
  .ai-topbar{padding:10px;gap:4px}
  .ai-topbar-title{font-size:13.5px}
  .ai-subject-select{max-width:108px;padding:7px 9px;font-size:11px}
  .ai-chat-wrap{padding:16px 10px}
  .ai-input-area{padding:8px 10px 12px}
  .ai-welcome-grid{grid-template-columns:1fr}
  .ai-welcome-h{font-size:22px}
  .ai-bubble.user{max-width:96%}
  body.ai-fullscreen-view .theme-toggle{display:none}
}
`;
const st = document.createElement("style");
st.id = "eis-ai-style";
st.textContent = css;
document.head.appendChild(st);

// Desktop: let the mouse wheel scroll the suggestion chips sideways
document.addEventListener("wheel", (e) => {
  const el = e.target.closest && e.target.closest(".ai-chips");
  if (!el || el.scrollWidth <= el.clientWidth) return;
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { el.scrollLeft += e.deltaY; e.preventDefault(); }
}, { passive: false });

// Modern line icons: swaps decorative emoji in rendered text for crisp SVG icons
// (theme-aware via currentColor). Emoji with meaning (✅ ❌ 🟢 🔴 …) and
// subject icons coming from course data are left untouched.
const P = {
  book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  bookopen:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  timer:'<circle cx="12" cy="14" r="8"/><path d="M12 14l3-3M9 2h6M12 2v4"/>',
  alarm:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M5 3 2 6M22 6l-3-3"/>',
  flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  layers:'<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/>',
  brain:'<path d="M9.5 2A2.5 2.5 0 0 0 7 4.5 2.5 2.5 0 0 0 4.5 7 2.5 2.5 0 0 0 3 9.5c0 1 .5 1.8 1.2 2.3A3 3 0 0 0 4 14a3 3 0 0 0 2.2 2.9A2.5 2.5 0 0 0 9 19.5 2.5 2.5 0 0 0 12 22V2z"/><path d="M14.5 2A2.5 2.5 0 0 1 17 4.5 2.5 2.5 0 0 1 19.5 7 2.5 2.5 0 0 1 21 9.5c0 1-.5 1.8-1.2 2.3A3 3 0 0 1 20 14a3 3 0 0 1-2.2 2.9A2.5 2.5 0 0 1 15 19.5 2.5 2.5 0 0 1 12 22"/>',
  trend:'<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V5M9 14h.01M15 14h.01M2 14h2M20 14h2"/><circle cx="12" cy="4" r="1"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  note:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  chart:'<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
  stopwatch:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4M10 2h4"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2-1.1.6-2 2-2 3.8M14 14.7V17c0 .6.5 1 1 1.2 1.1.6 2 2 2 3.8"/><path d="M18 2H6v7a6 6 0 0 0 12 0z"/>',
  star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  belloff:'<path d="M8.7 3A6 6 0 0 1 18 8c0 2.7.4 4.6.9 6M17 17H3s3-2 3-9c0-.5.1-1 .2-1.5"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0M2 2l20 20"/>',
  clipboard:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  bug:'<path d="m8 2 1.9 1.9M16 2l-1.9 1.9M9 7.1V6a3 3 0 0 1 6 0v1.1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6zM12 20v-9M6.5 13H2M17.5 13H22M6 17l-3 2M18 17l3 2M6 9 3 7M18 9l3-2"/>',
  bulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5a6 6 0 0 0-12 0c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
  trash:'<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
  sparkles:'<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/><path d="M19 3v4M17 5h4"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  coffee:'<path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v3M10 2v3M14 2v3"/>',
  leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10zM2 21c0-3 1.9-5.5 5-7"/>',
  steth:'<path d="M5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
  calc:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
  pin:'<path d="M12 17v5M9 10.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.2V17h14v-1.8a2 2 0 0 0-1.1-1.8l-1.8-.9a2 2 0 0 1-1.1-1.8V6a3 3 0 0 0 1-2H8a3 3 0 0 0 1 2z"/>',
  cap:'<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  pencil:'<path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  clip:'<path d="m21.4 11-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  dumbbell:'<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
  crown:'<path d="m2 20 2-12 5 5 3-8 3 8 5-5 2 12z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  fileText:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  send:'<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1z"/>',
};
// emoji → icon name
const MAP = {
  '📚':'book','📖':'bookopen','🍅':'timer','⏰':'alarm','🔥':'flame','🃏':'layers','🧠':'brain','📈':'trend','🤖':'bot',
  '🔄':'refresh','📝':'note','ℹ':'info','👤':'user','⚡':'zap','📊':'chart','⏱':'stopwatch','📁':'folder','📂':'folder',
  '🗂':'folder','📅':'calendar','🏆':'trophy','⭐':'star','🔔':'bell','🔕':'belloff','📋':'clipboard','🔒':'lock','🔐':'lock',
  '🌐':'globe','📧':'mail','📬':'mail','🐛':'bug','💡':'bulb','🗑':'trash','✨':'sparkles','🎯':'target','☕':'coffee',
  '🧘':'leaf','🌱':'leaf','🌿':'leaf','🩺':'steth','🧮':'calc','📌':'pin','🎓':'cap','💾':'save','✏':'pencil','🔗':'link',
  '📎':'clip','🔍':'search','💪':'dumbbell','👑':'crown','☀':'sun','🌙':'moon','📄':'fileText','🖼':'image','📤':'send',
  '📭':'inbox','📥':'inbox',
};
const keys = Object.keys(MAP).sort((a, b) => b.length - a.length);
const RE = new RegExp('(' + keys.join('|') + ')\\uFE0F?', 'g');
const SKIP = 'script,style,textarea,input,option,select,svg,code,pre,title,noscript,[contenteditable="true"]';

function svg(name) {
  return '<span class="eic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + P[name] + '</svg></span>';
}

function swapText(node) {
  const v = node.nodeValue;
  if (!v) return;
  RE.lastIndex = 0;
  if (!RE.test(v)) return;
  RE.lastIndex = 0;
  const frag = document.createDocumentFragment();
  let last = 0, m;
  while ((m = RE.exec(v))) {
    if (m.index > last) frag.appendChild(document.createTextNode(v.slice(last, m.index)));
    const name = MAP[m[1]];
    const tpl = document.createElement('template');
    tpl.innerHTML = svg(name);
    frag.appendChild(tpl.content.firstChild);
    last = m.index + m[0].length;
  }
  if (last < v.length) frag.appendChild(document.createTextNode(v.slice(last)));
  node.parentNode.replaceChild(frag, node);
}

function process(root) {
  if (!root) return;
  if (root.nodeType === 3) {
    if (root.parentElement && !root.parentElement.closest(SKIP)) swapText(root);
    return;
  }
  if (root.nodeType !== 1 || root.closest(SKIP)) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const list = [];
  let n;
  while ((n = w.nextNode())) {
    if (n.nodeValue && n.parentElement && !n.parentElement.closest(SKIP)) list.push(n);
  }
  list.forEach(swapText);
}

function start() {
  const body = document.body;
  if (!body) return;
  const opts = { childList: true, subtree: true };
  const mo = new MutationObserver((muts) => {
    mo.disconnect();
    try {
      for (const m of muts) m.addedNodes.forEach(process);
    } finally {
      mo.observe(body, opts);
    }
  });
  process(body);
  mo.observe(body, opts);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();

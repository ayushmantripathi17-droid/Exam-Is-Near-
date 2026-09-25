// ══════════════════════════════════════════════════════════════
// PWA INSTALL — Exam Is Near by ArkSetu
// ══════════════════════════════════════════════════════════════
// In the original index.html, `deferredPrompt` was a bare `let` in a small
// inline <script> block (PWA install-prompt handling), read directly by
// each course's features/ai-assistant-view.js (installPWA()) thanks to the
// shared classic-script global scope. Moved here so both main.js (which
// sets it) and the course feature files (which read/clear it) have a real
// module to import instead of relying on an implicit global.
export const PwaInstall = { deferredPrompt: null };

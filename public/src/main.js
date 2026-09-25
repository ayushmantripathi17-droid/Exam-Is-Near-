// ══════════════════════════════════════════════════════════════
// APP ENTRY — Exam Is Near by ArkSetu
// ══════════════════════════════════════════════════════════════
// This is the single <script type="module" src="/src/main.js"> in
// index.html. It replaces:
//   - ~90 individual <script defer src="/js/..."> tags (now real
//     ES module imports below - see MIGRATION_NOTES.md for why bare
//     "side-effect" imports are used instead of relying purely on the
//     dependency graph: a few files have no other importer but still
//     need to run, e.g. ads/ads-display.js).
//   - the course-family document.write() injector (now a real
//     dynamic import() of the active course's bundle, see below).
//   - index.html's small remaining inline <script> blocks for the PWA
//     install prompt and the dark/light theme toggle (moved here so
//     they're real, testable module code instead of inline HTML script).
//
// Load order: ES modules resolve their OWN dependency order from each
// file's real `import` statements (that's the whole point of this
// migration) - so the order of the bare imports below does NOT matter
// for correctness, unlike the original <script defer> tag order.
// ══════════════════════════════════════════════════════════════

import "./ads/ads-display.js";
import "./core/app-state.js";
import "./core/course-selector.js";
import "./core/firebase-sync.js";
import "./courses/CBSE/CBSE.js";
import "./courses/CBSE/Class 10/Syllabus/English.js";
import "./courses/CBSE/Class 10/Syllabus/Hindi.js";
import "./courses/CBSE/Class 10/Syllabus/Mathematics.js";
import "./courses/CBSE/Class 10/Syllabus/Science.js";
import "./courses/CBSE/Class 10/Syllabus/Social Science.js";
import "./courses/CBSE/Class 11/Syllabus/Accountancy.js";
import "./courses/CBSE/Class 11/Syllabus/Biology.js";
import "./courses/CBSE/Class 11/Syllabus/Business Studies.js";
import "./courses/CBSE/Class 11/Syllabus/Chemistry.js";
import "./courses/CBSE/Class 11/Syllabus/Economics.js";
import "./courses/CBSE/Class 11/Syllabus/English Core.js";
import "./courses/CBSE/Class 11/Syllabus/Geography.js";
import "./courses/CBSE/Class 11/Syllabus/History.js";
import "./courses/CBSE/Class 11/Syllabus/Mathematics.js";
import "./courses/CBSE/Class 11/Syllabus/Physics.js";
import "./courses/CBSE/Class 11/Syllabus/Political Science.js";
import "./courses/CBSE/Class 11/Syllabus/Psychology.js";
import "./courses/CBSE/Class 11/Syllabus/Sociology.js";
import "./courses/CBSE/Class 11/streams.js";
import "./courses/CBSE/Class 12/Syllabus/Accountancy.js";
import "./courses/CBSE/Class 12/Syllabus/Biology.js";
import "./courses/CBSE/Class 12/Syllabus/Business Studies.js";
import "./courses/CBSE/Class 12/Syllabus/Chemistry.js";
import "./courses/CBSE/Class 12/Syllabus/Economics.js";
import "./courses/CBSE/Class 12/Syllabus/English Core.js";
import "./courses/CBSE/Class 12/Syllabus/Geography.js";
import "./courses/CBSE/Class 12/Syllabus/History.js";
import "./courses/CBSE/Class 12/Syllabus/Mathematics.js";
import "./courses/CBSE/Class 12/Syllabus/Physics.js";
import "./courses/CBSE/Class 12/Syllabus/Political Science.js";
import "./courses/CBSE/Class 12/Syllabus/Psychology.js";
import "./courses/CBSE/Class 12/Syllabus/Sociology.js";
import "./courses/CBSE/Class 12/streams.js";
import "./courses/JEE/JEE.js";
import "./courses/JEE/Syllabus/Chemistry.js";
import "./courses/JEE/Syllabus/Mathematics.js";
import "./courses/JEE/Syllabus/Physics.js";
import "./courses/JEE/core/formulas.js";
import "./courses/JEE/features/neetjee-features-1to4.js";
import "./courses/JEE/features/neetjee-features-5to8.js";
import "./courses/JEE/features/neetjee-hub-renderer.js";
import "./courses/JEE/rank-data.js";
import "./courses/NEET/NEET.js";
import "./courses/NEET/Syllabus/Botany.js";
import "./courses/NEET/Syllabus/Chemistry.js";
import "./courses/NEET/Syllabus/Physics.js";
import "./courses/NEET/Syllabus/Zoology.js";
import "./courses/NEET/core/ncert-lines.js";
import "./courses/NEET/rank-data.js";
import "./courses/NFSU/NFSU.js";
import "./courses/NFSU/Semester 1/Syllabus/Basic Programming Concepts Using C.js";
import "./courses/NFSU/Semester 1/Syllabus/Discrete Mathematics.js";
import "./courses/NFSU/Semester 1/Syllabus/Fundamentals of Computer Organization & Embedded Systems.js";
import "./courses/NFSU/Semester 1/Syllabus/Law and Literature.js";
import "./courses/NFSU/Semester 1/Syllabus/Law of Tort and Consumer Protection Laws.js";
import "./courses/NFSU/Semester 1/Syllabus/Legal Methods.js";
import "./courses/NFSU/Semester 2/Syllabus/C++.js";
import "./courses/NFSU/Semester 2/Syllabus/Jurisprudence.js";
import "./courses/NFSU/Semester 2/Syllabus/Law & Society.js";
import "./courses/NFSU/Semester 2/Syllabus/Legal Language.js";
import "./courses/NFSU/Semester 2/Syllabus/RDBMS.js";
import "./courses/NFSU/Semester 2/Syllabus/Statistics.js";
import "./courses/NFSU/Semester 3/Syllabus/Constitutional Law I.js";
import "./courses/NFSU/Semester 3/Syllabus/Family Law I.js";
import "./courses/NFSU/Semester 3/Syllabus/Law of Contract I.js";
import "./courses/NFSU/Semester 3/Syllabus/Law of Crimes I.js";
import "./courses/NFSU/Semester 3/Syllabus/Operating System Concepts.js";
import "./courses/NFSU/Semester 3/Syllabus/Web Programming.js";
import "./courses/subjects-bridge.js";
import "./shared/app-constants.js";
import "./shared/exam-hub-state.js";
import "./shared/groq.js";
import "./shared/pro-footer-bar.js";
import "./utils/constants.js";
import "./utils/helpers.js";

import { CourseRuntime } from "./core/course-runtime.js";
import { PwaInstall } from "./shared/pwa-install.js";
import { genId, today, esc, showToast, isCrawlerUA, sanitizeForFirestore } from "./utils/helpers.js";
Object.assign(window, { genId, today, esc, showToast, isCrawlerUA, sanitizeForFirestore });

// ── Service worker registration (unchanged from the original inline script) ──
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(() => {}).catch(() => {});
  });
}

// ── PWA install prompt (was a bare `let deferredPrompt` in index.html) ──
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  PwaInstall.deferredPrompt = e;
  setTimeout(() => {
    const btn = document.getElementById("pwa-install-btn");
    if (btn) btn.style.display = "block";
  }, 2000);
});

// ── Theme toggle (was an inline IIFE at the bottom of index.html) ──
const THEME_META_COLOR = { dark: "#08080f", light: "#f2f3fa" };
function paintThemeIcon() {
  const btn = document.getElementById("theme-toggle-btn");
  if (!btn) return;
  const t = document.documentElement.getAttribute("data-theme") || "dark";
  btn.textContent = t === "dark" ? "🌙" : "☀️";
}
window.__toggleTheme = function () {
  const cur = document.documentElement.getAttribute("data-theme") || "dark";
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem("eis_theme", next); } catch (e) {}
  const mc = document.querySelector('meta[name="theme-color"]');
  if (mc) mc.setAttribute("content", THEME_META_COLOR[next]);
  paintThemeIcon();
};
document.addEventListener("DOMContentLoaded", paintThemeIcon);
paintThemeIcon();

// ── Active course: dynamically import ONLY that course's bundle ──
// (mirrors the original document.write() injector's family mapping in
// index.html exactly - see MIGRATION_NOTES.md)
const _ac = localStorage.getItem("activeCourse");
const _family =
  _ac === "jee" ? "JEE" :
  _ac === "neet" ? "NEET" :
  (_ac === "cbse10" || _ac === "cbse11" || _ac === "cbse12") ? "CBSE" :
  "NFSU";

const _courseModules = {
  JEE: () => import("./courses/JEE/index.js"),
  NEET: () => import("./courses/NEET/index.js"),
  CBSE: () => import("./courses/CBSE/index.js"),
  NFSU: () => import("./courses/NFSU/index.js"),
};

const courseModule = await _courseModules[_family]();
// Registers every export of the active course's bundle (functions like
// render/switchView/isProUser/..., plus a few small shared-state objects)
// onto the single shared CourseRuntime registry - see core/course-runtime.js.
Object.assign(CourseRuntime, courseModule);

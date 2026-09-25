// api/_lib/legalUpdates.js — ported from the BARE_ACT_NOTES block in functions/index.js
// Hand-maintained — update this array whenever a major bare-act change happens.
const admin = require("./firebaseAdmin");
const db = admin.firestore();

const BARE_ACT_NOTES = [
  "IPC 1860 has been replaced by the Bharatiya Nyaya Sanhita (BNS), 2023 — effective 1 July 2024. Map old IPC sections to new BNS sections when answering (e.g. murder: IPC 302 → BNS 103).",
  "CrPC 1973 has been replaced by the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 — effective 1 July 2024.",
  "Indian Evidence Act 1872 has been replaced by the Bharatiya Sakshya Adhiniyam (BSA), 2023 — effective 1 July 2024.",
  "For Sem III syllabus (Law of Crimes I), answer using IPC section numbers as the syllabus prescribes, but always add a one-line note on the corresponding BNS section so the student knows both.",
];

async function runLegalUpdatesRefresh() {
  const newsItems = []; // news-fetch feature removed — no NEWS_API_KEY dependency
  await db.collection("legal-updates").doc("nfsu").set(
    {
      bareActNotes: BARE_ACT_NOTES,
      newsItems,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  return { bareActCount: BARE_ACT_NOTES.length, newsCount: newsItems.length };
}

module.exports = { runLegalUpdatesRefresh, BARE_ACT_NOTES };

// api/cron/refresh-legal-updates.js — ported from exports.refreshLegalUpdatesScheduled
// Triggered by Vercel Cron (see vercel.json), daily at 00:30 UTC = 06:00 IST.
//
// Vercel automatically sends `Authorization: Bearer <CRON_SECRET>` on cron
// invocations when the CRON_SECRET env var is set — this checks it so the
// endpoint can't be triggered by anyone who finds the URL.

const { runLegalUpdatesRefresh } = require("../_lib/legalUpdates");

module.exports = async (req, res) => {
  const auth = req.headers.authorization || "";
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const result = await runLegalUpdatesRefresh();
    res.status(200).json({ result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

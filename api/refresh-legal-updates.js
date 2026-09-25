// api/refresh-legal-updates.js — ported from exports.refreshLegalUpdates (manual trigger)
const { handleCORS } = require("./_lib/cors");
const { verifyToken } = require("./_lib/auth");
const { runLegalUpdatesRefresh } = require("./_lib/legalUpdates");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ayushmantripathi17@gmail.com";

module.exports = async (req, res) => {
  if (handleCORS(req, res)) return;

  const decoded = await verifyToken(req, res);
  if (!decoded) return;
  if (decoded.email !== ADMIN_EMAIL) {
    res.status(403).json({ error: { message: "Admin only" } });
    return;
  }

  try {
    const result = await runLegalUpdatesRefresh();
    res.status(200).json({ result });
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
};

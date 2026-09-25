// api/check-pro-status.js — ported from exports.checkProStatus
const { handleCORS } = require("./_lib/cors");
const { verifyToken } = require("./_lib/auth");
const { db } = require("./_lib/billing");

module.exports = async (req, res) => {
  if (handleCORS(req, res)) return;

  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  try {
    const snap = await db.collection("proUsers").doc(decoded.uid).get();
    if (!snap.exists) {
      res.status(200).json({ result: { isPro: false, expiresAt: 0, plan: null } });
      return;
    }

    const data = snap.data();
    const now = Date.now();
    const isPro = data.isPro === true && typeof data.expiresAt === "number" && data.expiresAt > now;

    if (data.isPro === true && data.expiresAt <= now) {
      await db.collection("proUsers").doc(decoded.uid).update({ isPro: false });
    }

    res.status(200).json({
      result: {
        isPro,
        expiresAt: data.expiresAt || 0,
        planType: isPro ? data.planType || data.plan || "monthly" : null,
        plan: isPro ? data.plan || data.planType || "monthly" : null,
      },
    });
  } catch (e) {
    res.status(500).json({ error: { message: "Status check failed: " + e.message } });
  }
};

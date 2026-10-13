// api/_lib/auth.js — patched: checkRevoked=true makes Firebase reject tokens of
// disabled (banned) or revoked users, so a ban now actually blocks payments, trial
// activation and the AI proxy instead of only being a flag nobody reads.
const admin = require("./firebaseAdmin");

async function verifyToken(req, res) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: { message: "Missing Authorization header" } });
    return null;
  }
  try {
    return await admin.auth().verifyIdToken(authHeader.slice(7), true);
  } catch (e) {
    const banned = e.code === "auth/user-disabled" || e.code === "auth/id-token-revoked";
    res.status(banned ? 403 : 401).json({
      error: { message: banned ? "This account has been suspended." : "Invalid or expired token: " + e.message },
    });
    return null;
  }
}

module.exports = { verifyToken };

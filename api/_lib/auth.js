// api/_lib/auth.js
const admin = require("./firebaseAdmin");

async function verifyToken(req, res) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: { message: "Missing Authorization header" } });
    return null;
  }
  try {
    return await admin.auth().verifyIdToken(authHeader.slice(7));
  } catch (e) {
    res.status(401).json({ error: { message: "Invalid or expired token: " + e.message } });
    return null;
  }
}

module.exports = { verifyToken };

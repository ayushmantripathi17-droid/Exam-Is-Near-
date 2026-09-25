// api/fetch-razorpay-fees.js — ported from exports.fetchRazorpayFees
// Env vars: RZP_KEY_ID, RZP_KEY_SECRET, ADMIN_EMAIL, FIREBASE_SERVICE_ACCOUNT

const { handleCORS } = require("./_lib/cors");
const { verifyToken } = require("./_lib/auth");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ayushmantripathi17@gmail.com";

module.exports = async (req, res) => {
  if (handleCORS(req, res)) return;

  const decoded = await verifyToken(req, res);
  if (!decoded) return;
  if (decoded.email !== ADMIN_EMAIL) {
    res.status(403).json({ error: { message: "Admins only." } });
    return;
  }

  const keyId = process.env.RZP_KEY_ID;
  const secret = process.env.RZP_KEY_SECRET;
  const credentials = Buffer.from(`${keyId}:${secret}`).toString("base64");

  const now = new Date();
  const from = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);
  const to = Math.floor(now.getTime() / 1000);

  try {
    const [settleRes, payRes] = await Promise.all([
      fetch(`https://api.razorpay.com/v1/settlements?from=${from}&to=${to}&count=100`, {
        headers: { Authorization: `Basic ${credentials}` },
      }),
      fetch(`https://api.razorpay.com/v1/payments?from=${from}&to=${to}&count=100`, {
        headers: { Authorization: `Basic ${credentials}` },
      }),
    ]);

    if (!settleRes.ok) {
      res.status(502).json({ error: { message: `Razorpay settlements error ${settleRes.status}: ${await settleRes.text()}` } });
      return;
    }
    if (!payRes.ok) {
      res.status(502).json({ error: { message: `Razorpay payments error ${payRes.status}: ${await payRes.text()}` } });
      return;
    }

    const [settleData, payData] = await Promise.all([settleRes.json(), payRes.json()]);

    const captured = (payData.items || []).filter((p) => p.status === "captured");
    const totalCaptured = captured.reduce((s, p) => s + (p.amount || 0), 0) / 100;
    const totalFee = captured.reduce((s, p) => s + (p.fee || 0), 0) / 100;
    const totalTax = captured.reduce((s, p) => s + (p.tax || 0), 0) / 100;
    const settlements = (settleData.items || []).length;
    const settled = (settleData.items || []).reduce((s, i) => s + (i.amount || 0), 0) / 100;
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    res.status(200).json({
      result: { month, totalCaptured, totalFee, totalTax, settled, settlements, txCount: captured.length },
    });
  } catch (e) {
    res.status(500).json({ error: { message: "Razorpay fees fetch failed: " + e.message } });
  }
};

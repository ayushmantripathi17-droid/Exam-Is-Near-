// api/_lib/paylog.js — fills the collections the admin Logs page and finance.html read
// (pendingOrders, payments, payment_logs, paymentFailures, fraudAttempts, webhookEvents),
// which no code was writing. Never throws: logging must not break a payment.
const admin = require("./firebaseAdmin");
const db = admin.firestore();

async function logEvent(collection, data, id) {
  try {
    const ref = id ? db.collection(collection).doc(id) : db.collection(collection).doc();
    await ref.set({ ...data, at: Date.now() }, { merge: true });
  } catch (e) {
    console.warn("[paylog]", collection, e.message);
  }
}
module.exports = { logEvent };

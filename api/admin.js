// api/admin.js — one serverless function that powers the admin console.
// POST /api/admin  { action, ...params }   Authorization: Bearer <Firebase ID token>
// Single router on purpose: Vercel Hobby allows only 12 functions per deploy.
//
// Why this exists: the old panel wrote straight to Firestore from the browser, so it
// could not touch Firebase Auth (disable / delete accounts, list real users), could not
// honour team roles (rules only let the super admin write), and ban flags were never
// enforced. The Admin SDK here fixes all three.

const admin = require("./_lib/firebaseAdmin");
const { handleCORS } = require("./_lib/cors");
const { verifyToken } = require("./_lib/auth");

const db = admin.firestore();
const SUPER = (process.env.ADMIN_EMAIL || "ayushmantripathi17@gmail.com").toLowerCase();
const DAY = 86400000;
const PLAN_DAYS = { monthly: 32, annual: 366 };

// role -> allowed actions. "content" role has no user-data access by design.
const READ = ["whoami", "stats", "listUsers", "getUser", "audit"];
const CONTENT = ["whoami", "getContent", "setAnnouncement", "clearAnnouncement", "saveExamDate", "deleteExamDate", "saveMaterial", "deleteMaterial"];
const ADMIN = [...READ, ...CONTENT, "setBan", "grantPro", "revokePro", "resetStudy", "setMaintenance", "payments", "logs", "listCoupons"];
const PERMS = {
  content: CONTENT,
  support: [...READ, "setBan"],
  admin: ADMIN,
  super: [...ADMIN, "deleteUser", "saveCoupon", "toggleCoupon", "deleteCoupon"],
};

async function roleOf(decoded) {
  const email = (decoded.email || "").toLowerCase();
  if (!email || decoded.email_verified === false) return null;
  if (email === SUPER) return "super";
  const snap = await db.collection("adminRoles").doc(email.replace(/\./g, "_")).get();
  const d = snap.exists ? snap.data() : null;
  return d && d.active === true && PERMS[d.role] ? d.role : null;
}

const fail = (code, message) => Object.assign(new Error(message), { code });
const uidOf = (p) => {
  if (typeof p.uid !== "string" || !p.uid || p.uid.length > 128) throw fail(400, "Valid uid required.");
  return p.uid;
};

async function audit(by, action, uid, details, target) {
  await db.collection("admin_audit").doc(`${Date.now()}_${Math.random().toString(36).slice(2, 6)}`).set({
    action, targetUid: uid || null, targetEmail: target?.email || "—", targetName: target?.displayName || "—",
    details: details || "", byEmail: by.email, byName: by.name || "Admin", at: Date.now(),
  });
}

function shape(rec, pro) {
  const now = Date.now();
  const active = !!pro && pro.isPro === true && pro.expiresAt > now;
  return {
    uid: rec.uid, email: rec.email || "", name: rec.displayName || "", photo: rec.photoURL || "",
    disabled: !!rec.disabled, created: rec.metadata.creationTime, lastLogin: rec.metadata.lastSignInTime,
    isPro: active, plan: active ? pro.plan || pro.planType : null, expiresAt: pro?.expiresAt || 0,
    manual: !!pro?.grantedManually,
  };
}

const actions = {
  async stats() {
    let total = 0, disabled = 0, week = 0, token;
    for (let i = 0; i < 20; i++) { // cap: 20k users scanned, keeps it inside the 30s limit
      const page = await admin.auth().listUsers(1000, token);
      page.users.forEach((u) => {
        total++;
        if (u.disabled) disabled++;
        if (Date.now() - Date.parse(u.metadata.creationTime) < 7 * DAY) week++;
      });
      token = page.pageToken;
      if (!token) break;
    }
    const pro = (await db.collection("proUsers").get()).docs.map((d) => d.data());
    const live = pro.filter((p) => p.isPro === true && p.expiresAt > Date.now());
    return {
      total, disabled, newThisWeek: week, truncated: !!token,
      activePro: live.length, paidPro: live.filter((p) => !p.grantedManually && p.amountPaid > 0).length,
      revenue: pro.reduce((s, p) => s + (p.amountPaid || 0), 0),
    };
  },

  async listUsers(p) {
    let recs = [], next = null;
    const q = typeof p.query === "string" ? p.query.trim() : "";
    if (q) {
      try { recs = [await (q.includes("@") ? admin.auth().getUserByEmail(q) : admin.auth().getUser(q))]; }
      catch (e) { recs = []; }
    } else {
      const page = await admin.auth().listUsers(50, p.pageToken || undefined);
      recs = page.users; next = page.pageToken || null;
    }
    const snaps = recs.length ? await db.getAll(...recs.map((r) => db.collection("proUsers").doc(r.uid))) : [];
    return { users: recs.map((r, i) => shape(r, snaps[i].exists ? snaps[i].data() : null)), nextPageToken: next };
  },

  async getUser(p) {
    const uid = uidOf(p);
    const rec = await admin.auth().getUser(uid).catch(() => { throw fail(404, "User not found."); });
    const [pro, u, st] = await db.getAll(
      db.collection("proUsers").doc(uid), db.collection("users").doc(uid), db.collection("study_tracker").doc(uid));
    const ud = u.exists ? u.data() : {}, sd = st.exists ? st.data() : {};
    return {
      ...shape(rec, pro.exists ? pro.data() : null),
      providers: rec.providerData.map((x) => x.providerId),
      banned: ud.banned === true, banReason: ud.banReason || "", bannedBy: ud.bannedBy || "",
      streak: sd.streak || 0, totalHours: sd.totalHours || 0, trialUsed: ud.trialUsed === true || pro.data()?.trialUsed === true,
    };
  },

  async setBan(p, by) {
    const uid = uidOf(p), banned = p.banned === true;
    const rec = await admin.auth().getUser(uid).catch(() => { throw fail(404, "User not found."); });
    if ((rec.email || "").toLowerCase() === SUPER) throw fail(400, "The super admin cannot be banned.");
    await admin.auth().updateUser(uid, { disabled: banned });
    if (banned) await admin.auth().revokeRefreshTokens(uid);
    const reason = String(p.reason || "Admin action").slice(0, 300);
    await db.collection("users").doc(uid).set(
      { banned, bannedAt: banned ? Date.now() : null, bannedBy: banned ? by.email : null, banReason: banned ? reason : null },
      { merge: true });
    await audit(by, banned ? "ban" : "unban", uid, banned ? reason : "", rec);
    return { uid, banned };
  },

  async grantPro(p, by) {
    const uid = uidOf(p), plan = p.plan;
    if (!PLAN_DAYS[plan]) throw fail(400, "plan must be monthly or annual.");
    const days = p.days === undefined ? PLAN_DAYS[plan] : Number(p.days);
    if (!Number.isInteger(days) || days < 1 || days > 3650) throw fail(400, "days must be 1-3650.");
    const rec = await admin.auth().getUser(uid).catch(() => { throw fail(404, "User not found."); });
    const ref = db.collection("proUsers").doc(uid), now = Date.now();
    const cur = (await ref.get()).data();
    const base = cur?.isPro === true && cur.expiresAt > now ? cur.expiresAt : now; // extend, never shorten
    const expiresAt = base + days * DAY;
    const data = {
      isPro: true, plan, planType: plan, activatedAt: now, expiresAt, grantedManually: true,
      grantedBy: by.email, amountPaid: cur?.amountPaid || 0, email: rec.email || "", displayName: rec.displayName || "", updatedAt: now,
    };
    await Promise.all([
      ref.set(data, { merge: true }),
      db.collection("users").doc(uid).set({ pro: data }, { merge: true }),
      db.collection("free_grants").doc(`${uid}_${now}`).set({ uid, plan, days, expiresAt, grantedBy: by.email, grantedAt: now }),
    ]);
    await audit(by, "grant_pro", uid, `${plan} +${days}d (free)`, rec);
    return { uid, expiresAt };
  },

  async revokePro(p, by) {
    const uid = uidOf(p), now = Date.now();
    const rec = await admin.auth().getUser(uid).catch(() => { throw fail(404, "User not found."); });
    await Promise.all([
      db.collection("proUsers").doc(uid).set({ isPro: false, expiresAt: now, revokedAt: now, revokedBy: by.email, updatedAt: now }, { merge: true }),
      db.collection("users").doc(uid).set({ pro: { isPro: false, expiresAt: now } }, { merge: true }),
    ]);
    await audit(by, "revoke_pro", uid, "", rec);
    return { uid };
  },

  async resetStudy(p, by) {
    const uid = uidOf(p);
    const rec = await admin.auth().getUser(uid).catch(() => { throw fail(404, "User not found."); });
    await db.collection("study_tracker").doc(uid).set(
      { studyLog: {}, streak: 0, totalHours: 0, progress: {}, resetAt: Date.now(), resetBy: by.email }, { merge: true });
    await audit(by, "reset_study", uid, "", rec);
    return { uid };
  },

  // Super admin only. Unlike the old panel, this removes the Auth account (so the user
  // cannot just sign back in) and the whole users/{uid} subtree, not just top-level docs.
  async deleteUser(p, by) {
    const uid = uidOf(p);
    const rec = await admin.auth().getUser(uid).catch(() => { throw fail(404, "User not found."); });
    if ((rec.email || "").toLowerCase() === SUPER) throw fail(400, "The super admin cannot be deleted.");
    if (p.confirmEmail !== rec.email) throw fail(400, "confirmEmail must match the user's email.");
    await admin.auth().deleteUser(uid);
    await Promise.all([
      db.recursiveDelete(db.collection("users").doc(uid)),
      db.recursiveDelete(db.collection("user-files").doc(uid)),
      db.collection("study_tracker").doc(uid).delete(),
      db.collection("proUsers").doc(uid).delete(),
    ]);
    await audit(by, "delete_user", uid, "Auth account + all user data removed", rec);
    return { uid };
  },

  async whoami() { return {}; },

  // ── Payments & logs ────────────────────────────────────────────────────────
  async payments() {
    const docs = (await db.collection("proUsers").get()).docs.map((d) => d.data());
    const by = {};
    docs.filter((p) => p.amountPaid > 0 && p.activatedAt).forEach((p) => {
      const m = new Date(p.activatedAt).toISOString().slice(0, 7);
      by[m] = by[m] || { month: m, amount: 0, count: 0 };
      by[m].amount += p.amountPaid; by[m].count++;
    });
    return { months: Object.values(by).sort((a, b) => a.month.localeCompare(b.month)).slice(-12) };
  },

  async logs(p) {
    const kinds = ["payments", "payment_logs", "pendingOrders", "paymentFailures", "fraudAttempts", "webhookEvents"];
    if (!kinds.includes(p.kind)) throw fail(400, "Unknown log kind.");
    const snap = await db.collection(p.kind).orderBy("at", "desc").limit(60).get();
    return { entries: snap.docs.map((d) => d.data()) };
  },

  // ── Coupons (super admin writes; shape matches api/_lib/billing.js validateCoupon) ──
  async listCoupons() {
    const snap = await db.collection("coupons").get();
    return { coupons: snap.docs.map((d) => ({ ...d.data(), id: d.id })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)) };
  },
  async saveCoupon(p, by) {
    const code = String(p.code || "").trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,30}$/.test(code)) throw fail(400, "Code: 3-30 chars, A-Z 0-9 _ -");
    const type = p.discountType === "flat" ? "flat" : "percent", value = Number(p.discountValue);
    if (!(value > 0) || (type === "percent" && value > 100)) throw fail(400, "Invalid discount value.");
    const uses = Number.isInteger(Number(p.uses)) && Number(p.uses) > 0 ? Number(p.uses) : 100;
    if (p.expiry && !/^\d{4}-\d{2}-\d{2}$/.test(p.expiry)) throw fail(400, "Expiry must be YYYY-MM-DD.");
    if (!(await db.collection("coupons").where("code", "==", code).limit(1).get()).empty) throw fail(409, "Coupon code already exists.");
    const ref = db.collection("coupons").doc();
    await ref.set({
      id: ref.id, code, discountType: type, discountValue: value, discount: type === "percent" ? value : 0,
      uses, usesLeft: uses, expiry: p.expiry || null, active: true, createdBy: by.email, createdAt: Date.now(),
      created: new Date().toISOString().slice(0, 10),
    });
    await audit(by, "create_coupon", null, `${code} ${type === "flat" ? "₹" + value : value + "%"} x${uses}`);
    return { id: ref.id };
  },
  async toggleCoupon(p, by) {
    if (typeof p.id !== "string" || !p.id) throw fail(400, "id required.");
    await db.collection("coupons").doc(p.id).update({ active: p.active === true });
    await audit(by, p.active === true ? "enable_coupon" : "disable_coupon", null, p.id);
    return {};
  },
  async deleteCoupon(p, by) {
    if (typeof p.id !== "string" || !p.id) throw fail(400, "id required.");
    await db.collection("coupons").doc(p.id).delete();
    await audit(by, "delete_coupon", null, p.id);
    return {};
  },

  // ── Content. Writes to app_config/*, which is what the app actually reads (the old
  //    admin panel wrote config/maintenance + announcements/current, which nothing read). ──
  async getContent() {
    const [a, m, ex, mat] = await Promise.all([
      db.collection("app_config").doc("announcement").get(), db.collection("app_config").doc("maintenance").get(),
      db.collection("exam_schedule").get(), db.collection("study-materials").orderBy("createdAt", "desc").limit(100).get()]);
    return {
      announcement: a.data() || {}, maintenance: m.data() || {},
      examDates: ex.docs.map((d) => d.data()), materials: mat.docs.map((d) => d.data()),
    };
  },
  async setAnnouncement(p, by) {
    const t = (k, n) => String(p[k] || "").trim().slice(0, n);
    const d = { active: true, id: String(Date.now()), bannerText: t("bannerText", 200), popupTitle: t("popupTitle", 100), popupBody: t("popupBody", 600), updatedAt: Date.now(), updatedBy: by.email };
    if (!d.bannerText && !d.popupTitle) throw fail(400, "Add banner text or a popup title.");
    await db.collection("app_config").doc("announcement").set(d);
    await audit(by, "announcement", null, d.bannerText || d.popupTitle);
    return {};
  },
  async clearAnnouncement(p, by) {
    await db.collection("app_config").doc("announcement").set({ active: false, updatedAt: Date.now(), updatedBy: by.email }, { merge: true });
    await audit(by, "announcement_clear", null, "");
    return {};
  },
  async setMaintenance(p, by) {
    const enabled = p.enabled === true, message = String(p.message || "").slice(0, 300);
    await db.collection("app_config").doc("maintenance").set({ enabled, message, updatedAt: Date.now(), updatedBy: by.email });
    await audit(by, enabled ? "maintenance_on" : "maintenance_off", null, message);
    return {};
  },
  async saveExamDate(p, by) {
    const id = String(p.subjectId || "").trim();
    if (!/^[\w.-]{1,80}$/.test(id) || !p.date || !p.subjectName) throw fail(400, "subjectId, subjectName and date required.");
    await db.collection("exam_schedule").doc(id).set({
      id, courseId: String(p.courseId || "").slice(0, 40), subjectName: String(p.subjectName).slice(0, 100), date: String(p.date).slice(0, 40), updatedAt: Date.now() });
    await audit(by, "exam_date", null, `${p.subjectName}: ${p.date}`);
    return {};
  },
  async deleteExamDate(p, by) {
    if (typeof p.id !== "string" || !p.id) throw fail(400, "id required.");
    await db.collection("exam_schedule").doc(p.id).delete();
    await audit(by, "exam_date_delete", null, p.id);
    return {};
  },
  async saveMaterial(p, by) {
    const t = (k, n) => String(p[k] || "").trim().slice(0, n);
    if (!t("title", 150) || !/^https:\/\//.test(t("url", 1000))) throw fail(400, "title and an https:// url are required.");
    const id = `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    await db.collection("study-materials").doc(id).set({
      id, course: t("course", 40), title: t("title", 150), subject: t("subject", 100), type: t("type", 20) || "link", url: t("url", 1000),
      description: t("description", 400) || null, proOnly: p.proOnly === true, isQuestionPaper: p.isQuestionPaper === true, createdAt: Date.now(), createdBy: by.email });
    await audit(by, "material_add", null, t("title", 150));
    return { id };
  },
  async deleteMaterial(p, by) {
    if (typeof p.id !== "string" || !p.id) throw fail(400, "id required.");
    await db.collection("study-materials").doc(p.id).delete();
    await audit(by, "material_delete", null, p.id);
    return {};
  },

  async audit(p) {
    const n = Math.min(Math.max(parseInt(p.limit, 10) || 100, 1), 300);
    const snap = await db.collection("admin_audit").orderBy("at", "desc").limit(n).get();
    return { entries: snap.docs.map((d) => d.data()) };
  },
};

module.exports = async (req, res) => {
  if (handleCORS(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: { message: "Method not allowed" } });

  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  try {
    const body = req.body && req.body.data ? req.body.data : req.body || {};
    const role = await roleOf(decoded);
    if (!role) return res.status(403).json({ error: { message: "Admin access required." } });
    if (!Object.hasOwn(actions, body.action) || !PERMS[role].includes(body.action))
      return res.status(403).json({ error: { message: `Your role (${role}) cannot run '${body.action}'.` } });

    const by = { email: decoded.email, name: decoded.name };
    const result = await actions[body.action](body, by);
    res.status(200).json({ result: { ...result, _role: role, _perms: PERMS[role] } });
  } catch (e) {
    res.status(e.code >= 400 && e.code < 500 ? e.code : 500).json({ error: { message: e.message } });
  }
};

// ═══════════════════════════════════════════════════════════════════
// ArkSetu Control Room — shared Firebase + auth core
// Imported by both admin.html and finance.html so the project config
// and role-check logic live in exactly one place.
// ═══════════════════════════════════════════════════════════════════

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAzd_5MxraedOo_3OuczMdNOvtOk-JRQBo",
  authDomain:        "exam-is-near.firebaseapp.com",
  projectId:         "exam-is-near",
  storageBucket:     "exam-is-near.firebasestorage.app",
  messagingSenderId: "568104262716",
  appId:             "1:568104262716:web:5cfb621349b5e234be7739"
};

export const ADMIN_EMAIL = ["ayushmantripathi17", "gmail.com"].join("@");
export const PRO_MONTHLY = 149;
export const PRO_ANNUAL  = 999;

const {
  initializeApp, getApps
} = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
const {
  getFirestore, collection, getDocs, getDoc, doc, setDoc, addDoc,
  deleteDoc, query, orderBy, limit, where, serverTimestamp
} = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
const {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  getRedirectResult, signOut, onAuthStateChanged
} = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
const {
  getStorage, ref: storageRef, uploadBytesResumable, getDownloadURL, deleteObject
} = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js");

const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);

export const db      = getFirestore(app);
export const auth    = getAuth(app);
export const storage = getStorage(app);

export const fs = {
  collection, getDocs, getDoc, doc, setDoc, addDoc, deleteDoc,
  query, orderBy, limit, where, serverTimestamp,
};
export const storageFns = { storageRef, uploadBytesResumable, getDownloadURL, deleteObject };
export const authFns = { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged };

/**
 * Role check against Firestore `adminRoles` collection. Super admin
 * (ADMIN_EMAIL) always passes; everyone else needs an active doc
 * keyed by their email (dots replaced with underscores).
 * Returns 'super' | 'admin' | 'support' | 'content' | null.
 */
export async function checkAccess(user) {
  if (!user || !user.email) return null;
  if (user.email === ADMIN_EMAIL) return "super";
  try {
    const roleDoc = await getDoc(doc(db, "adminRoles", user.email.replace(/\./g, "_")));
    if (roleDoc.exists() && roleDoc.data().active === true) {
      return roleDoc.data().role || "content";
    }
  } catch (e) {
    console.warn("[auth] role check failed:", e);
  }
  return null;
}

/**
 * Wires up the whole auth-gate flow for a page. Call once on load.
 * onReady(user, role) fires after a successful, authorised sign-in;
 * the auth-gate is hidden and #app shown automatically.
 * requireRole: if set (e.g. 'super'), only that role may enter —
 * used by finance.html, which is super-admin only.
 */
export function initAuthGate({ onReady, requireRole = null } = {}) {
  const gate   = document.getElementById("auth-gate");
  const errEl  = document.getElementById("auth-error");
  const appEl  = document.getElementById("app");

  function showError(msg) {
    if (!errEl) return;
    errEl.style.display = "block";
    errEl.textContent = "⚠️ " + msg;
  }

  window.signInAdmin = async function () {
    errEl && (errEl.style.display = "none");
    const provider = new authFns.GoogleAuthProvider();
    try {
      await authFns.signInWithPopup(auth, provider);
    } catch (e) {
      if (e?.code === "auth/popup-blocked" || e?.code === "auth/cancelled-popup-request") {
        await authFns.signInWithRedirect(auth, provider);
      } else {
        showError(e.message || "Sign-in failed");
      }
    }
  };

  window.signOutAdmin = async function () {
    await authFns.signOut(auth);
    location.reload();
  };

  authFns.onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try { await user.reload(); await user.getIdToken(true); } catch (_) {}
    user = auth.currentUser;

    if (!user.email) {
      const providerEmail = user.providerData?.[0]?.email || null;
      if (providerEmail) {
        Object.defineProperty(user, "email", { value: providerEmail, writable: true });
      } else {
        await authFns.signOut(auth);
        showError("Could not read email from this Google account. Use a standard Gmail account.");
        return;
      }
    }

    const role = await checkAccess(user);
    if (!role || (requireRole && role !== requireRole)) {
      await authFns.signOut(auth);
      showError(
        requireRole
          ? user.email + " — finance is super-admin only."
          : user.email + " — not authorised. Contact super admin."
      );
      return;
    }

    gate && (gate.style.display = "none");
    appEl && (appEl.style.display = "block");
    onReady && onReady(user, role);
  });
}

/** Small toast helper, shared look across both pages. */
export function toast(msg, type = "") {
  let el = document.getElementById("__toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "__toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.className = "toast " + type;
  el.textContent = msg;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 3200);
}

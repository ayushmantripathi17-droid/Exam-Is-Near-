// Pro status is stored in Firestore via Cloud Functions.
// Client can only READ — never write — Pro status.
// ══════════════════════════════════════════════════════════════
const PRO_PRICE_INR = 149;
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// COUPON CODE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
let _activeCoupon = null; // { code, discount, id } or null

function _resetCouponState(){
  _activeCoupon = null;
  const msg = document.getElementById("pm-coupon-msg");
  if(msg){ msg.textContent=""; msg.style.color=""; }
  document.getElementById("pm-monthly-label").innerHTML = "⭐ Get Pro — ₹149/month →";
  document.getElementById("pm-annual-label").innerHTML  = "🏆 Annual Plan — ₹999/year &nbsp;·&nbsp; Save ₹792";
}

// Reset coupon state whenever the modal is opened
function openProModal(){
  _resetCouponState();
  const inp = document.getElementById("pm-coupon-input");
  if(inp) inp.value = "";
  document.getElementById("pro-upgrade-modal").classList.add("show");
  document.body.style.overflow = "hidden";
}

async function applyCouponCode(){
  const inp = document.getElementById("pm-coupon-input");
  const btn = document.getElementById("pm-coupon-btn");
  const msg = document.getElementById("pm-coupon-msg");
  const code = (inp?.value||"").trim().toUpperCase();
  if(!code){ msg.textContent="⚠️ Enter a coupon code"; msg.style.color="#FFE66D"; return; }

  // FIX: Firestore coupons collection is admin-read-only (by design — security rule).
  // Validation must go server-side via Cloud Function, never via client SDK query.
  // We now call the existing activateTrial CF with validate:true (dry-run flag) so the
  // server checks the code, returns discount %, and does NOT activate Pro yet.
  if(!currentUser){
    msg.textContent = "⚠️ Please sign in first to apply a coupon.";
    msg.style.color = "#FFE66D";
    return;
  }

  btn.textContent="Checking…"; btn.disabled=true;
  msg.textContent=""; msg.style.color="";

  try{
    const token = await currentUser.getIdToken(true);
    const res = await fetch(CF_URLS.activateTrial, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ data: { uid: currentUser.uid, couponCode: code, plan: "monthly", validateOnly: true } })
    });

    if(!res.ok) throw new Error("Server error (" + res.status + "). Please try again.");
    const json = await res.json();
    const result = json.result || json;

    // Server returned an error (invalid/expired/used up coupon)
    if(!result.success && !result.discount){
      msg.textContent = "❌ " + (result.message || "Invalid or expired coupon code.");
      msg.style.color = "#ff6b6b";
      _activeCoupon = null;
      btn.textContent="Apply"; btn.disabled=false;
      // FIX: server just confirmed this account is already Pro — the header badge
      // may still be showing "Go Pro" from a stale check at page load. Force a
      // refresh so it flips to "PRO MEMBER" instead of staying wrong until reload.
      if(result.alreadyPro){
        _updateProHeaderUI();
        _hideAdsForPro();
      }
      return;
    }

    // Server validated — store discount from server response
    const d = result.discount || 100; // default 100% if server activated directly
    _activeCoupon = { code, discount: d, id: result.couponId || code };

    // If the CF doesn't support validateOnly yet and activated immediately (100% coupon)
    if(result.success && result.expiresAt && !result.validateOnly){
      _proCache = { isPro: true, expiresAt: result.expiresAt, checkedAt: Date.now(), planType: "monthly" };
      localStorage.setItem(PRO_KEY, JSON.stringify({ active: true, expiresAt: result.expiresAt, cachedAt: Date.now(), planType: "monthly" }));
      msg.textContent = "🎉 100% coupon applied! Pro activated.";
      msg.style.color = "#06D6A0";
      btn.textContent="Activated ✓"; btn.style.color="#06D6A0"; btn.disabled=false;
      spawnStars();
      closeProModal();
      _updateProHeaderUI();
      _hideAdsForPro();
      render();
      return;
    }

    const newMonthly = Math.round(14900 * (1 - d/100));
    const newAnnual  = Math.round(99900 * (1 - d/100));
    const fmtM = "₹" + (newMonthly/100).toLocaleString("en-IN");
    const fmtA = "₹" + (newAnnual/100).toLocaleString("en-IN");

    msg.textContent = `✅ ${d}% off applied! Prices updated below.`;
    msg.style.color = "#06D6A0";
    document.getElementById("pm-monthly-label").innerHTML =
      `⭐ Get Pro — <s style="opacity:0.5">₹149</s> ${fmtM}/month →`;
    document.getElementById("pm-annual-label").innerHTML  =
      `🏆 Annual Plan — <s style="opacity:0.5">₹999</s> ${fmtA}/year`;
    btn.textContent="Applied ✓"; btn.style.color="#06D6A0"; btn.disabled=false;

  }catch(err){
    console.error("[EIN] Coupon validation error:", err);
    msg.textContent = "⚠️ Error: " + (err.message || String(err));
    msg.style.color = "#FFE66D";
    btn.textContent="Apply"; btn.disabled=false;
  }
}

// PRO STATUS SYSTEM — Security notes:
//
//  • localStorage is used ONLY as an offline-fallback read-through cache.
//    It is never the authoritative source of truth.
//  • Every session with a signed-in user triggers a server check via
//    Firebase Cloud Function (checkProStatus), which validates the user's
//    Firestore subscription document. The server sets an HttpOnly cookie for
//    future SSR validation if needed.
//  • The in-memory _proCache TTL is 5 minutes max. Sensitive feature gates
//    (PDF export, AI tutor) call verifyProOrThrow() which forces a fresh
//    server check, bypassing the cache entirely.
//  • initiateTrialPayment() and initiateYearlyPayment() now route through
//    the same server-verified flow as monthly payments — NO localStorage-only
//    grants. Trial activation creates a Firestore document server-side.
//  • The ad-hide gate reads from isProUser() (server-verified), not
//    localStorage directly.
//  • Tamper detection: on page load, if localStorage shows Pro but the server
//    disagrees, the local cache is purged and a warning is logged.
// ─────────────────────────────────────────────────────────────────────────────
const PRO_KEY = "ein_pro_cache";
// Cloud Function base URLs (2nd-gen Cloud Run endpoints)
const CF_URLS = {
  checkProStatus: "https://checkprostatus-pfdempligq-el.a.run.app",
  createOrder:    "https://createorder-pfdempligq-el.a.run.app",
  verifyPayment:  "https://verifypayment-pfdempligq-el.a.run.app",
  activateTrial:  "https://activatetrial-pfdempligq-el.a.run.app",
};
// Legacy alias kept for any references still using CF_BASE + "/endpoint"
const CF_BASE = "https://asia-south1-exam-is-near.cloudfunctions.net";

// In-memory cache { isPro, expiresAt, checkedAt, planType }
let _proCache = null;

// ── Core: authoritative Pro status check ──
async function isProUser({ forceRefresh = false } = {}){
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  if(!forceRefresh && _proCache && _proCache.checkedAt && Date.now() - _proCache.checkedAt < CACHE_TTL){
    return _proCache.isPro;
  }
  // Not signed in → use local cache only as read-through (offline support)
  if(!currentUser){
    try{
      const d = JSON.parse(localStorage.getItem(PRO_KEY)||"null");
      // Require both active flag AND non-expired timestamp
      if(d && d.active === true && typeof d.expiresAt === "number" && d.expiresAt > Date.now()){
        _proCache = { isPro: true, expiresAt: d.expiresAt, checkedAt: Date.now(), planType: d.planType||"monthly" };
        return true;
      }
    }catch(e){}
    _proCache = { isPro: false, expiresAt: 0, checkedAt: Date.now() };
    return false;
  }
  // Signed in → always verify with server
  try{
    const token = await currentUser.getIdToken(/* forceRefresh */ forceRefresh);
    const res = await fetch(CF_URLS.checkProStatus, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ data: {} })
    });
    if(!res.ok) throw new Error("Server returned " + res.status);
    const json = await res.json();
    const result = json.result || json;
    const serverIsPro = !!result.isPro;
    _proCache = { isPro: serverIsPro, expiresAt: result.expiresAt||0, checkedAt: Date.now(), planType: result.planType||"monthly" };

    if(serverIsPro){
      _proStatusCache = true;
      // Write back to localStorage as offline fallback (not source of truth)
      localStorage.setItem(PRO_KEY, JSON.stringify({ active: true, expiresAt: result.expiresAt, cachedAt: Date.now(), planType: result.planType||"monthly" }));
    } else {
      _proStatusCache = false;
      // ── Tamper detection: local said Pro but server says Free → purge ──
      const local = JSON.parse(localStorage.getItem(PRO_KEY)||"null");
      if(local && local.active){
        console.warn("[EIN] Pro tamper detected: localStorage claimed Pro but server denied. Purging.");
        localStorage.removeItem(PRO_KEY);
      }
    }
    return serverIsPro;
  }catch(e){
    // FIX #7: Network error — allow localStorage fallback ONLY within a 1-hour grace window
    // from the last successful server-verified check. Prevents indefinite offline Pro abuse.
    console.warn("[EIN] Pro check network error, using local fallback:", e.message);
    try{
      const d = JSON.parse(localStorage.getItem(PRO_KEY)||"null");
      const ONE_HOUR = 60 * 60 * 1000;
      const withinGrace = d && d.cachedAt && (Date.now() - d.cachedAt) < ONE_HOUR;
      if(withinGrace && d.active === true && typeof d.expiresAt === "number" && d.expiresAt > Date.now()){
        // Mark cache as nearly-stale (1 min TTL) so the next successful connectivity
        // immediately re-verifies with the server
        _proCache = { isPro: true, expiresAt: d.expiresAt, checkedAt: Date.now() - 4 * 60 * 1000, planType: d.planType||"monthly" };
        return true;
      }
    }catch(ex){}
    _proCache = { isPro: false, expiresAt: 0, checkedAt: Date.now() };
    return false;
  }
}

// ── Sensitive gate: forces a fresh server check — use for AI/PDF/export ──
async function verifyProOrThrow(featureName){
  if(!currentUser) throw new Error("sign_in_required");
  const fresh = await isProUser({ forceRefresh: true });
  if(!fresh) throw new Error("pro_required:" + featureName);
  return true;
}

// openProModal defined earlier (with coupon reset) — do not redeclare here
function closeProModal(){
  document.getElementById("pro-upgrade-modal").classList.remove("show");
  document.body.style.overflow = "";
}
// Attach modal backdrop-click listener after DOM is ready
document.addEventListener("DOMContentLoaded", ()=>{
  const modal = document.getElementById("pro-upgrade-modal");
  if(modal) modal.addEventListener("click", e=>{
    if(e.target === e.currentTarget) closeProModal();
  });
});

// ── UI Gate: returns true if allowed, false + opens modal if not ──
async function requirePro(featureName){
  const pro = await isProUser();
  if(pro) return true;
  openProModal();
  if(featureName) showToast("⭐ " + featureName + " requires Pro","info");
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT FLOWS — All three paths route through server-verified grant
// ─────────────────────────────────────────────────────────────────────────────

async function _loadRazorpay(){
  if(typeof Razorpay !== "undefined") return true;
  return new Promise((resolve, reject)=>{
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = ()=> resolve(true);
    s.onerror = ()=> reject(new Error("Failed to load payment gateway"));
    document.head.appendChild(s);
  });
}

// ── Shared: activate Pro free via 100% coupon (no payment needed) ──
async function _activateFreeCoupon(plan){
  showToast("🔄 Activating coupon...", "info");
  try{
    const token = await currentUser.getIdToken(true);
    const res = await fetch(CF_URLS.activateTrial, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ data: { uid: currentUser.uid, couponCode: _activeCoupon?.code||"", plan } })
    });
    if(!res.ok) throw new Error("Activation failed ("+res.status+")");
    const json = await res.json();
    const result = json.result || json;
    if(!result.success) throw new Error(result.message || "Activation declined");
    _proCache = { isPro: true, expiresAt: result.expiresAt, checkedAt: Date.now(), planType: plan };
    localStorage.setItem(PRO_KEY, JSON.stringify({ active: true, expiresAt: result.expiresAt, cachedAt: Date.now(), planType: plan }));
    showToast("🎉 100% coupon applied! Pro activated for free.", "success");
    spawnStars(); spawnStars();
    closeProModal();
    _updateProHeaderUI();
    _hideAdsForPro();
    render();
  }catch(err){
    showToast("❌ Coupon activation failed: " + (err.message||"Please try again"), "alarm");
    console.error("[EIN] Free coupon activation error:", err);
    if(/already have an active Pro subscription/i.test(err.message||"")){
      const fresh = await isProUser({ forceRefresh: true });
      if(fresh){ _updateProHeaderUI(); _hideAdsForPro(); render(); }
    }
  }
}

// ── Monthly Payment ──
async function initiateProPayment(){
  if(!currentUser){ showToast("🔐 Please sign in with Google first","info"); googleSignIn(); return; }
  const already = await isProUser();
  if(already){ showToast("⭐ You're already on Pro!","success"); closeProModal(); return; }
  const discount = _activeCoupon ? _activeCoupon.discount : 0;
  if(discount >= 100){ await _activateFreeCoupon("monthly"); return; }
  try{ await _loadRazorpay(); } catch(e){ showToast("❌ Could not load payment gateway. Check your internet.","alarm"); return; }
  const amount = Math.round(14900 * (1 - discount/100));
  await _launchRazorpay({ plan: "monthly", amount, description: "Pro Plan — 1 Month", couponCode: _activeCoupon?.code||null });
}

// ── Annual Payment — now server-verified like monthly ──
async function initiateYearlyPayment(){
  if(!currentUser){ showToast("🔐 Please sign in with Google first","info"); googleSignIn(); return; }
  const already = await isProUser();
  if(already){ showToast("⭐ You're already on Pro!","success"); closeProModal(); return; }
  const discount = _activeCoupon ? _activeCoupon.discount : 0;
  if(discount >= 100){ await _activateFreeCoupon("annual"); return; }
  try{ await _loadRazorpay(); } catch(e){ showToast("❌ Could not load payment gateway. Check your internet.","alarm"); return; }
  const amount = Math.round(99900 * (1 - discount/100));
  await _launchRazorpay({ plan: "annual", amount, description: "Pro Annual Plan — ₹999/year", couponCode: _activeCoupon?.code||null });
}

// ── 7-Day Trial — activates via server, not localStorage ──
async function initiateTrialPayment(){
  if(!currentUser){ showToast("🔐 Please sign in with Google first to start your trial","info"); googleSignIn(); return; }
  const already = await isProUser();
  if(already){ showToast("⭐ You're already on Pro!","success"); closeProModal(); return; }
  showToast("🔄 Activating trial...","info");
  try{
    const token = await currentUser.getIdToken(true);
    const res = await fetch(CF_URLS.activateTrial, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ data: { uid: currentUser.uid } })
    });
    if(!res.ok) throw new Error("Trial activation failed ("+res.status+")");
    const json = await res.json();
    const result = json.result || json;
    if(!result.success) throw new Error(result.message || "Trial activation declined");
    // Server granted trial → update cache from server response
    _proCache = { isPro: true, expiresAt: result.expiresAt, checkedAt: Date.now(), planType: "trial" };
    localStorage.setItem(PRO_KEY, JSON.stringify({ active: true, expiresAt: result.expiresAt, cachedAt: Date.now(), planType: "trial" }));
    showToast("🎁 7-day Pro trial activated! Enjoy all features.","success");
    spawnStars();
    closeProModal();
    _updateProHeaderUI();
    _hideAdsForPro();
    render();
  }catch(err){
    showToast("❌ Trial activation failed: " + (err.message||"Please try again"),"alarm");
    console.error("[EIN] Trial activation error:", err);
    // FIX: the initial isProUser() check above uses the 5-min client cache, which can
    // be stale. If the server just rejected this because the account is ALREADY Pro,
    // that stale cache is what let us get this far — force a fresh check now so the
    // header badge flips from "Go Pro" to "PRO MEMBER" without needing a page reload.
    if(/already have an active Pro subscription/i.test(err.message||"")){
      const fresh = await isProUser({ forceRefresh: true });
      if(fresh){ _updateProHeaderUI(); _hideAdsForPro(); render(); }
    }
  }
}

async function _launchRazorpay({ plan, amount, description, couponCode=null }){
  const btn = document.getElementById("pm-monthly-btn");
  const origText = btn ? btn.innerHTML : "";
  if(btn){ btn.disabled=true; btn.innerHTML="⏳ Creating order..."; btn.style.opacity="0.7"; }

  let orderData;
  try{
    const token = await currentUser.getIdToken(/* forceRefresh */ true);
    const res = await fetch(CF_URLS.createOrder, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ data: { email: currentUser.email||"", name: currentUser.displayName||"", plan, amount, couponCode } })
    });
    const json = await res.json();
    if(json.error){ const _em = typeof json.error === "string" ? json.error : (json.error.message || json.error.description || JSON.stringify(json.error)); throw new Error(_em || "Order creation failed"); }
    orderData = json.result || json;
  }catch(err){
    showToast("❌ " + (err.message||"Order creation failed"),"alarm");
    if(btn){ btn.disabled=false; btn.innerHTML=origText; btn.style.opacity="1"; }
    return;
  }
  if(btn){ btn.disabled=false; btn.innerHTML=origText; btn.style.opacity="1"; }

  // ── 100% coupon: server already activated Pro, no Razorpay needed ──
  if(orderData.zeroCost){
    _proCache = { isPro: true, expiresAt: orderData.expiresAt, checkedAt: Date.now(), planType: plan };
    localStorage.setItem(PRO_KEY, JSON.stringify({ active: true, expiresAt: orderData.expiresAt, cachedAt: Date.now(), planType: plan }));
    showToast("🎉 100% coupon applied! Pro activated — ₹0 charged.", "success");
    spawnStars(); spawnStars();
    closeProModal();
    _updateProHeaderUI();
    _hideAdsForPro();
    render();
    return;
  }

  const options = {
    key:         orderData.keyId,
    amount:      orderData.amount || amount,
    currency:    orderData.currency || "INR",
    order_id:    orderData.orderId,
    name:        "Exam Is Near",
    description,
    image:       "https://exam-is-near.web.app/assets/icons/icon-192.png",
    prefill:     { name: currentUser.displayName||"", email: currentUser.email||"" },
    notes:       { uid: currentUser.uid, plan },
    theme:       { color: "#FFE66D" },
    handler: async function(response){ await _verifyAndGrantPro(response, plan, couponCode); },
    modal: { ondismiss: ()=>{ showToast("Payment cancelled","info"); } }
  };
  try{
    const rzp = new Razorpay(options);
    rzp.on("payment.failed", r=>{ showToast("⚠️ Payment failed: "+r.error.description,"alarm"); });
    rzp.open();
  }catch(e){ showToast("❌ Could not open payment window: "+e.message,"alarm"); }
}

// ── Server-side signature verification — single source of truth for both plans ──
async function _verifyAndGrantPro(razorpayResponse, plan, couponCode=null){
  showToast("🔄 Verifying payment...","info");
  try{
    const token = await currentUser.getIdToken(true);
    const res = await fetch(CF_URLS.verifyPayment, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ data: {
        orderId:   razorpayResponse.razorpay_order_id,
        paymentId: razorpayResponse.razorpay_payment_id,
        signature: razorpayResponse.razorpay_signature,
        plan,
        couponCode: couponCode || null,
      }})
    });
    const json = await res.json();
    const result = json.result || json;
    if(result.success){
      // Server confirmed → update cache from authoritative server response
      _proCache = { isPro: true, expiresAt: result.expiresAt, checkedAt: Date.now(), planType: plan };
      localStorage.setItem(PRO_KEY, JSON.stringify({ active: true, expiresAt: result.expiresAt, cachedAt: Date.now(), planType: plan }));
      const msg = plan === "annual" ? "🎉 Welcome to Pro Annual! You saved ₹792!" : "🎉 Welcome to Pro! All features unlocked.";
      showToast(msg, "success");
      spawnStars(); spawnStars();
      closeProModal();
      _updateProHeaderUI();
      _hideAdsForPro();
      render();
    } else {
      throw new Error(result.message || "Verification returned false");
    }
  }catch(err){
    const payId = razorpayResponse.razorpay_payment_id;
    showToast("⚠️ Verification error. Save this ID and contact support: "+payId,"alarm");
    console.error("[EIN] Payment verify failed:", err, "Payment ID:", payId);
  }
}

// ── Hide ads once Pro is confirmed ──
function _hideAdsForPro(){
  const adUnit = document.getElementById("ad-unit-bottom");
  if(adUnit) adUnit.style.display = "none";
}

// ── Header UI for Pro badge / Go Pro button ──
async function _updateProHeaderUI(){
  // forceRefresh: true — always hit the server so the badge reflects admin grants
  // and coupon activations immediately without waiting for the 5-min cache to expire
  const isPro = await isProUser({ forceRefresh: true });
  ["pro-header-badge","go-pro-header-btn"].forEach(id=>{ const el=document.getElementById(id); if(el) el.remove(); });
  const anchor = document.getElementById("sync-badge");
  if(!anchor || !anchor.parentNode) return;
  if(isPro){
    const badge = document.createElement("div");
    badge.id = "pro-header-badge";
    badge.className = "pro-badge";
    badge.style.cssText = "margin-top:5px;cursor:default";
    badge.innerHTML = "⭐ PRO MEMBER";
    badge.title = "You have an active Pro subscription — verified server-side";
    anchor.parentNode.insertBefore(badge, anchor.nextSibling);
  } else {
    const btn = document.createElement("button");
    btn.id = "go-pro-header-btn";
    btn.style.cssText = "margin-top:5px;background:linear-gradient(135deg,#1a1200,#120e00);border:1px solid #FFE66D33;border-radius:12px;color:#FFE66D;padding:4px 11px;font-size:10px;font-family:'Inter',inherit;cursor:pointer;font-weight:700;letter-spacing:0.5px;display:block;transition:all 0.2s";
    btn.innerHTML = "⭐ Go Pro · ₹149/mo";
    btn.onclick = openProModal;
    btn.onmouseover = ()=>{ btn.style.borderColor="#FFE66D66"; btn.style.background="linear-gradient(135deg,#201800,#181000)"; };
    btn.onmouseout  = ()=>{ btn.style.borderColor="#FFE66D33"; btn.style.background="linear-gradient(135deg,#1a1200,#120e00)"; };
    anchor.parentNode.insertBefore(btn, anchor.nextSibling);
  }
}

// Run after DOM is fully ready
setTimeout(_updateProHeaderUI, 1200);
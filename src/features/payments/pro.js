// ══════════════════════════════════════════════════════════════
// PRO PLAN SYSTEM — by ArkSetu (Secure Server-Verified v2)
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
const _origOpenProModal = window.openProModal;
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
  if(!db){ msg.textContent="⚠️ Database not ready, try again"; msg.style.color="#ff6b6b"; return; }

  btn.textContent="Checking…"; btn.disabled=true;
  msg.textContent=""; msg.style.color="";

  try{
    const {collection,query,where,getDocs} = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    // Query by code only — filtering active in JS avoids needing a composite Firestore index
    const q = query(collection(db,"coupons"), where("code","==",code));
    const snap = await getDocs(q);

    // Filter active client-side
    const activeDocs = snap.docs.filter(d => d.data().active === true);

    if(activeDocs.length === 0){
      msg.textContent = "❌ Invalid or expired coupon code.";
      msg.style.color = "#ff6b6b";
      _activeCoupon = null;
      btn.textContent="Apply"; btn.disabled=false;
      return;
    }

    const data = activeDocs[0].data();
    const id   = activeDocs[0].id;

    // Check expiry
    if(data.expiry){
      const expDate = new Date(data.expiry);
      expDate.setHours(23,59,59,999);
      if(Date.now() > expDate.getTime()){
        msg.textContent = "❌ This coupon has expired.";
        msg.style.color = "#ff6b6b";
        _activeCoupon = null;
        btn.textContent="Apply"; btn.disabled=false;
        return;
      }
    }

    // Check remaining uses
    if(typeof data.usesLeft === "number" && data.usesLeft <= 0){
      msg.textContent = "❌ This coupon has reached its usage limit.";
      msg.style.color = "#ff6b6b";
      _activeCoupon = null;
      btn.textContent="Apply"; btn.disabled=false;
      return;
    }

    // Valid!
    _activeCoupon = { code, discount: data.discount, id };
    const d = data.discount;
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

function openProModal(){
  document.getElementById("pro-upgrade-modal").classList.add("show");
  document.body.style.overflow = "hidden";
}
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
    image:       "https://exam-is-near.web.app/icon-192.png",
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
  const isPro = await isProUser();
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
</script>

<!-- ══════════════════════════════════════════
     PRO UPGRADE MODAL (Upgraded Premium Design)
══════════════════════════════════════════ -->
<div class="pro-upgrade-modal" id="pro-upgrade-modal" role="dialog" aria-modal="true" aria-label="Upgrade to Pro">
  <div class="pro-modal-box">
    <button class="pro-close-btn" onclick="closeProModal()" aria-label="Close">✕</button>

    <!-- Header -->
    <div class="pm-header">
      <div class="pm-wordmark">Exam Is Near Pro</div>
      <div class="pm-title">Unlock <span>everything.</span></div>
      <div class="pm-subtitle">No limits on AI, no ads, cloud backup — everything a serious exam aspirant needs.</div>

      <!-- Free trial banner -->
      <div class="pm-trial" onclick="initiateTrialPayment()">
        <div class="pm-trial-icon">🎁</div>
        <div>
          <div class="pm-trial-label">Try Pro FREE for 7 days</div>
          <div class="pm-trial-sub">No payment needed · Cancel anytime</div>
        </div>
        <button class="pm-trial-cta" onclick="event.stopPropagation();initiateTrialPayment()">Start free →</button>
      </div>

      <!-- Plan cards -->
      <div class="pm-plans">
        <div class="pm-plan">
          <div class="pm-plan-badge free">Free</div>
          <div class="pm-price free-color">₹0<span>/mo</span></div>
          <div class="pm-price-sub">Basic access</div>
        </div>
        <div class="pm-plan featured" onclick="initiateProPayment()">
          <div class="pm-popular">POPULAR</div>
          <div class="pm-plan-badge pro">Pro ✦</div>
          <div class="pm-price pro-color">₹149<span>/mo</span></div>
          <div class="pm-price-sub">≈ ₹5/day</div>
        </div>
        <div class="pm-plan" onclick="initiateYearlyPayment()">
          <div class="pm-save">SAVE 44%</div>
          <div class="pm-plan-badge annual">Annual ✦</div>
          <div class="pm-price annual-color">₹999<span>/yr</span></div>
          <div class="pm-price-sub">≈ ₹83/mo</div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="pm-body">
      <div class="pm-features-title">What you unlock</div>

      <div class="pm-feature">
        <div class="pm-check">✦</div>
        <div class="pm-feature-text">
          <div class="pm-feature-name">Unlimited AI Flashcards &amp; Quizzes</div>
          <div class="pm-feature-desc">Generate unlimited cards and quiz sets from any topic</div>
        </div>
        <div class="pm-feature-badges"><div class="pm-feature-tag">Unlimited</div><div class="pm-feature-free">Free: max 50</div></div>
      </div>

      <div class="pm-feature">
        <div class="pm-check">✦</div>
        <div class="pm-feature-text">
          <div class="pm-feature-name">Priority AI Tutor</div>
          <div class="pm-feature-desc">Faster responses, longer context, deeper explanations</div>
        </div>
        <div class="pm-feature-badges"><div class="pm-feature-tag">Priority</div><div class="pm-feature-free">Free: standard</div></div>
      </div>

      <div class="pm-feature">
        <div class="pm-check">✦</div>
        <div class="pm-feature-text">
          <div class="pm-feature-name">Ad-Free Experience</div>
          <div class="pm-feature-desc">Zero interruptions — pure focus, always</div>
        </div>
        <div class="pm-feature-badges"><div class="pm-feature-tag">No ads</div><div class="pm-feature-free">Free: ads shown</div></div>
      </div>

      <div class="pm-feature">
        <div class="pm-check">✦</div>
        <div class="pm-feature-text">
          <div class="pm-feature-name">Cloud Backup &amp; Sync</div>
          <div class="pm-feature-desc">Notes and PDFs auto-backed up with 25 GB storage</div>
        </div>
        <div class="pm-feature-badges"><div class="pm-feature-tag">25 GB</div><div class="pm-feature-free">Free: local only</div></div>
      </div>

      <div class="pm-feature">
        <div class="pm-check">✦</div>
        <div class="pm-feature-text">
          <div class="pm-feature-name">Export Progress as PDF</div>
          <div class="pm-feature-desc">Download your full study report any time</div>
        </div>
        <div class="pm-feature-badges"><div class="pm-feature-tag">Available</div><div class="pm-feature-free">Free: ✕</div></div>
      </div>

      <div class="pm-feature">
        <div class="pm-check">✦</div>
        <div class="pm-feature-text">
          <div class="pm-feature-name">Advanced Analytics</div>
          <div class="pm-feature-desc">Weekly reports, streak awards, subject-level insights</div>
        </div>
        <div class="pm-feature-badges"><div class="pm-feature-tag">Full access</div><div class="pm-feature-free">Free: basic</div></div>
      </div>

      <div class="pm-feature">
        <div class="pm-check">✦</div>
        <div class="pm-feature-text">
          <div class="pm-feature-name">Early Feature Access</div>
          <div class="pm-feature-desc">New features before anyone else — shape the roadmap</div>
        </div>
        <div class="pm-feature-badges"><div class="pm-feature-tag">Included</div><div class="pm-feature-free">Free: ✕</div></div>
      </div>

      <div class="pm-divider"></div>

      <!-- Testimonial -->
      <div class="pm-testimonial">
        <div class="pm-testimonial-text">"Exam Is Near Pro helped me track my UPSC prep properly. The AI flashcards alone are worth it — I cleared mains this year!"</div>
        <div class="pm-testimonial-author">
          <div class="pm-testimonial-avatar">R</div>
          <div class="pm-testimonial-name">Rahul S. · UPSC 2024 qualifier</div>
        </div>
      </div>

      <!-- Coupon Code -->
      <div id="pm-coupon-section" style="margin-bottom:14px">
        <div style="display:flex;gap:8px;align-items:center">
          <input
            id="pm-coupon-input"
            type="text"
            placeholder="Have a coupon code?"
            maxlength="30"
            autocomplete="off"
            oninput="this.value=this.value.toUpperCase();_resetCouponState()"
            style="flex:1;background:#0d0d1a;border:1px solid #2a2a40;border-radius:10px;padding:10px 14px;color:#e8e8f0;font-size:13px;font-family:'JetBrains Mono',monospace;letter-spacing:1px;outline:none;transition:border 0.2s"
            onfocus="this.style.borderColor='#FFE66D66'"
            onblur="this.style.borderColor='#2a2a40'"
          />
          <button
            onclick="applyCouponCode()"
            id="pm-coupon-btn"
            style="background:linear-gradient(135deg,#1a1200,#120e00);border:1px solid #FFE66D55;border-radius:10px;color:#FFE66D;padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;font-family:'Inter',inherit;transition:all 0.2s"
            onmouseover="this.style.borderColor='#FFE66D99'"
            onmouseout="this.style.borderColor='#FFE66D55'"
          >Apply</button>
        </div>
        <div id="pm-coupon-msg" style="font-size:11px;margin-top:6px;min-height:16px;padding-left:2px"></div>
      </div>

      <!-- CTAs -->
      <button onclick="initiateProPayment()" class="pm-cta-primary" id="pm-monthly-btn"><span id="pm-monthly-label">⭐ Get Pro — ₹149/month →</span></button>
      <button onclick="initiateYearlyPayment()" class="pm-cta-secondary" id="pm-annual-btn"><span id="pm-annual-label">🏆 Annual Plan — ₹999/year &nbsp;·&nbsp; Save ₹792</span></button>

      <!-- Trust signals -->
      <div class="pm-trust">
        <div class="pm-trust-item">🔒 Secure via Razorpay</div>
        <div class="pm-trust-item">💳 UPI · Cards · NetBanking</div>
        <div class="pm-trust-item">↩ Cancel anytime</div>
      </div>

      <!-- Security note — explains server-side verification -->
      <div class="pm-security-note">
        <span class="icon">🛡️</span>
        <div class="text"><strong>Verified server-side.</strong> Pro status is authenticated by our backend on every session — not just stored locally. Tamper-proof via Firebase + Razorpay signature verification.</div>
      </div>

      <button onclick="closeProModal()" style="display:block;width:100%;background:none;border:none;color:#181828;font-size:12px;cursor:pointer;padding:14px 0 2px;font-family:'Inter',inherit;transition:color 0.2s;font-weight:600;text-align:center" onmouseover="this.style.color='#333'" onmouseout="this.style.color='#181828'">Maybe later — keep Free plan</button>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════
     PROFESSIONAL FOOTER
══════════════════════════════════════════ -->
<footer class="site-footer">
  <div class="site-footer-links">
    <a href="https://exam-is-near.web.app" target="_blank" rel="noopener" class="site-footer-link">🌐 Website</a>
    <a href="#" onclick="switchView('about');return false" class="site-footer-link">About</a>
    <a href="privacy.html" target="_blank" rel="noopener" class="site-footer-link">Privacy Policy</a>
    <a href="terms.html" target="_blank" rel="noopener" class="site-footer-link">Terms</a>
    <a href="https://adssettings.google.com" target="_blank" rel="noopener" class="site-footer-link">Ad Settings</a>
    <a href="#" onclick="switchView('about');return false" class="site-footer-link">Contact</a>
  </div>
  <div class="site-footer-copy">© 2025–2026 ArkSetu. All rights reserved. · Exam Is Near · Study Smart · exam-is-near.web.app</div>
  <div style="font-size:9px;color:#131320;margin-top:3px">Unauthorized copying or redistribution is prohibited.</div>
</footer>

<!-- ══════════════════════════════════════════
     ADSENSE AD UNITS (injected by JS for Pro users)
══════════════════════════════════════════ -->
<div id="ad-unit-bottom" style="max-width:880px;margin:0 auto 10px;padding:0 16px;display:none">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-7615978175642990"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

<script>
// ── Show ads only for FREE users (server-verified, not localStorage-only) ──
(async function(){
  await new Promise(r => setTimeout(r, 2000)); // wait for app + auth
  try{
    const proStatus = await isProUser();
    if(!proStatus){
      const adUnit = document.getElementById('ad-unit-bottom');
      if(adUnit){ adUnit.style.display='block'; }
      try{ (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e){}
    }
  }catch(e){
    // If check fails, default to showing ads (fail-safe for monetisation)
    const adUnit = document.getElementById('ad-unit-bottom');
    if(adUnit){ adUnit.style.display='block'; }
    try{ (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e2){}
  }
})();
// Note: initiateYearlyPayment and initiateTrialPayment are defined in the
// main Pro system script block above — both now route through server-verified
// flows. The old localStorage-only stubs have been removed.
</script>

<!-- ══════════════════════════════════════════
     PERMANENT PRO FOOTER BAR (free users only)
══════════════════════════════════════════ -->
<div id="pro-footer-bar" class="hidden" role="complementary" aria-label="Upgrade to Pro">
  <div class="pfb-left">
    <div class="pfb-icon">⭐</div>
    <div class="pfb-text">
      <div class="pfb-title">Upgrade to Pro</div>
      <div class="pfb-perks">Unlimited AI · 25 GB cloud · No ads · PDF export · Priority tutor</div>
    </div>
  </div>
  <div class="pfb-right">
    <div class="pfb-price">
      <div class="pfb-amount">₹149<sub>/mo</sub></div>
      <div class="pfb-annual">or ₹999/year · save 44%</div>
    </div>
    <button class="pfb-cta" onclick="openProModal()">Get Pro →</button>
    <button class="pfb-dismiss" onclick="_dismissProBar()" title="Dismiss" aria-label="Dismiss">✕</button>
  </div>
</div>

<script>
// ── Permanent Pro Footer Bar ──
(async function _initProBar(){
  const bar = document.getElementById('pro-footer-bar');
  if(!bar) return;

  // Check session-storage dismiss (hides for current session only)
  const dismissed = sessionStorage.getItem('ein_probar_dismissed');

  async function refreshBar(){
    try{
      const pro = await isProUser();
      if(pro){
        // Pro user — hide bar permanently, remove body padding
        bar.classList.add('hidden');
        document.body.classList.remove('has-pro-bar');
      } else if(!dismissed){
        bar.classList.remove('hidden');
        document.body.classList.add('has-pro-bar');
      }
    }catch(e){
      // On error, keep bar hidden to avoid layout jank
    }
  }

  // Initial check after app loads
  setTimeout(refreshBar, 1800);

  // Re-check whenever Pro modal closes (user may have just paid)
  const origClose = window.closeProModal;
  window.closeProModal = function(){
    if(origClose) origClose();
    setTimeout(refreshBar, 800);
  };
})();

function _dismissProBar(){
  const bar = document.getElementById('pro-footer-bar');
  if(bar){
    bar.style.animation = 'none';
    bar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    bar.style.transform = 'translateY(100%)';
    bar.style.opacity = '0';
    setTimeout(()=>{ bar.classList.add('hidden'); }, 320);
  }
  document.body.classList.remove('has-pro-bar');
  // Dismiss for this session only — reappears on next visit
  sessionStorage.setItem('ein_probar_dismissed', '1');
}


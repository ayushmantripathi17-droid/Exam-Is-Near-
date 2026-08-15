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

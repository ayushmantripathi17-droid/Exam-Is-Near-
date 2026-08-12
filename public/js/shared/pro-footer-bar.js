// Permanent Pro-tier footer bar — shared UI, not course-specific.
// Split out of the former public/js/features/neetjee-hub-data.js during the course-isolation refactor.
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

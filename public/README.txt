ArkSetu — "Something went wrong / Cannot read properties of undefined
(reading 'forEach')" fix
════════════════════════════════════════════════════════════════════

WHAT WAS WRONG
After picking a CBSE Class 11 or 12 stream (e.g. "Science — PCMB"), the
Overview page crashed. getCbse11Subjects()/getCbse12Subjects() in
core/course-selector.js were returning raw subject-ID strings (like
"c12-phy") instead of full subject objects. The dashboard's getTotalPct()
then did s.units.forEach(...) on those strings — and a string has no
.units — which threw "Cannot read properties of undefined (reading
'forEach')".

THE FIX
Both functions now resolve those IDs into real subject objects via the
existing _subjectsFromIds() helper (the same one SUBJECTS_CBSE11/12
already used), and switchCbse11Stream()/switchCbse12Stream() were updated
to read .id off the resolved object when setting the active subject.

Only one file changed: public/js/core/course-selector.js

HOW TO APPLY
Extract this zip at the ROOT of your project (the folder that contains
your "public" folder) and let it overwrite the existing file at:
  public/js/core/course-selector.js
Then commit and redeploy as usual.

Note: this file lives outside the CBSE folder you originally sent over —
it's shared code used by all four courses (CBSE/JEE/NEET/NFSU), so this
same fix also prevents the identical crash for CBSE Class 11 users.

import{n as e}from"./preload-helper-CzmPsGiR.js";var t=1;function n(e,n,r=5){let i={};(e||[]).forEach(e=>{if(!e||!e.total)return;let t=(e.subject||`?`)+`|`+(e.chapter||`All Chapters`);i[t]||(i[t]={subject:e.subject,subjectName:e.subjectName||e.subject,chapter:e.chapter||`All Chapters`,attempts:0,totalQ:0,correctQ:0,lastDate:e.date});let n=i[t];n.attempts++,n.totalQ+=e.total||0,n.correctQ+=e.score||0,new Date(e.date)>new Date(n.lastDate)&&(n.lastDate=e.date)});let a={};return(n||[]).forEach(e=>{e?.sub&&(a[e.sub]=(a[e.sub]||0)+1)}),Object.values(i).filter(e=>e.attempts>=t).map(e=>{let t=e.totalQ?Math.round(e.correctQ/e.totalQ*100):0,n=a[e.subjectName]||a[e.subject]||0,r=100-t+n*3;return{...e,accuracy:t,mistakeCount:n,weaknessScore:r}}).sort((e,t)=>t.weaknessScore-e.weaknessScore).slice(0,r)}function r(e){return!e||!e.length?null:e.map(e=>`${e.chapter} (${e.subjectName||e.subject}) — ${e.accuracy}% accuracy over ${e.attempts} attempt${e.attempts===1?``:`s`}${e.mistakeCount?`, ${e.mistakeCount} logged mistake${e.mistakeCount===1?``:`s`}`:``}`).join(`; `)}function i(e,t=`startWeakTopicMock()`){return!e||!e.length?`<div class="card" style="margin-bottom:16px">
      <div class="section-label" style="margin-bottom:8px">🎯 Focus Areas</div>
      <div style="font-size:12px;color:#333;text-align:center;padding:12px 0">Attempt a few quizzes first — this fills in once you have quiz history.</div>
    </div>`:`<div class="card" style="margin-bottom:16px;border-color:#FFE66D22">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div class="section-label" style="margin-bottom:0">🎯 Focus Areas — Weakest Topics</div>
      <span style="font-size:9px;background:linear-gradient(135deg,#FFE66D,#ffb700);color:#08080f;border-radius:8px;padding:2px 8px;font-weight:700">PRO</span>
    </div>
    ${e.map(e=>{let t=e.accuracy>=70?`#06D6A0`:e.accuracy>=50?`#FFE66D`:`#FF6B35`;return`<div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#ccc;margin-bottom:4px">
          <span>${e.chapter} <span style="color:#555">· ${e.subjectName||e.subject}</span></span>
          <span style="color:${t};font-weight:700">${e.accuracy}%</span>
        </div>
        <div class="pbar"><div class="pfill" style="width:${e.accuracy}%;background:${t}"></div></div>
      </div>`}).join(``)}
    <button class="btn-gold" onclick="${t}" style="width:100%;padding:10px;margin-top:8px;font-size:13px">🧠 Generate Weak-Topic Mock Test</button>
  </div>`}var a=5,o=70,s=2;function c(e){let t={};return(e||[]).forEach(e=>{if(!e||!e.total)return;let n=e.subject||`?`,r=t[n]||(t[n]={id:n,name:e.subjectName||n,total:0,correct:0,chapters:{},topics:{}});r.total+=e.total,r.correct+=e.score||0;let i=e.chapter||`All Chapters`,a=r.chapters[i]||(r.chapters[i]={name:i,total:0,correct:0});a.total+=e.total,a.correct+=e.score||0,(e.questions||[]).forEach(e=>{let t=e&&typeof e.topic==`string`?e.topic.trim():``;if(!t)return;let n=i+`||`+t.toLowerCase(),a=r.topics[n]||(r.topics[n]={name:t,chapter:i,total:0,correct:0});a.total+=1,e.correct&&(a.correct+=1)})}),Object.values(t).map(e=>{let t=Object.values(e.chapters).map(t=>({...t,subject:e.id,subjectName:e.name,accuracy:Math.round(t.correct/t.total*100)})),n=Object.values(e.topics).map(t=>({...t,subject:e.id,subjectName:e.name,accuracy:Math.round(t.correct/t.total*100)}));return{...e,accuracy:Math.round(e.correct/e.total*100),chapters:t,topics:n}})}function l(e,t=3){let n=(e,t)=>e.accuracy-t.accuracy||t.total-e.total,r=[];if(e.forEach(e=>e.topics.forEach(e=>{e.total>=s&&e.accuracy<o&&r.push({...e,kind:`topic`})})),r.length)return r.sort(n).slice(0,t);let i=[];return e.forEach(e=>e.chapters.forEach(e=>{e.total>=a&&e.accuracy<o&&i.push({...e,chapter:e.name,kind:`chapter`})})),i.sort(n).slice(0,t)}function u(t){let n=c(t);if(!n.length)return`<div class="qz-card" style="margin-top:22px">
      <div class="qz-sec" style="margin-bottom:6px"><h3>🎯 Focus Areas</h3></div>
      <div style="font-size:12.5px;color:var(--mute)">Complete a few practice sets — this will show which subjects and topics need more work.</div>
    </div>`;let r=e=>e>=70?`#06D6A0`:e>=50?`#FFE66D`:`#FF6B35`,i=e=>e===`All Chapters`?`Mixed chapters`:e,u=l(n);typeof window<`u`&&(window.__focusTopics=u);let d=n.some(e=>e.topics.length);return`<div class="qz-card" style="margin-top:22px">
    <div class="qz-sec" style="margin-bottom:10px"><h3>🎯 Focus Areas</h3></div>
    <div class="qz-grp" style="margin-top:0">Focus on these first</div>
    ${u.length?u.map((t,n)=>{let a=t.kind===`topic`?t.name:i(t.name),o=t.kind===`topic`?t.subjectName+` · `+i(t.chapter):t.subjectName;return`
    <div class="qz-log" style="margin-bottom:8px"><div class="qz-log-r">
      <div class="qz-log-c" style="color:${r(t.accuracy)};border-color:${r(t.accuracy)}">${t.accuracy}%</div>
      <div style="flex:1;min-width:0">
        <b>${e(a)}</b>
        <span class="s">${e(o)} · ${t.correct}/${t.total} correct</span>
      </div>
      <button class="qz-btn" style="padding:7px 12px;font-size:11.5px;color:var(--acc)" onclick="startFocusPractice(${n})">Practice →</button>
    </div></div>`}).join(``):`<div style="font-size:12.5px;color:#06D6A0;margin-bottom:6px">🌟 No weak topics right now — everything you've practiced is at ${o}%+. Try harder chapters or 50-question sets.</div>`}
    <div class="qz-grp">Subject-wise accuracy</div>
    ${n.slice().sort((e,t)=>e.accuracy-t.accuracy).map(t=>{let n=t.total>=a,i=t.topics.filter(e=>e.total>=s).sort((e,t)=>e.accuracy-t.accuracy)[0],c=t.chapters.filter(e=>e.name!==`All Chapters`&&e.total>=a).sort((e,t)=>e.accuracy-t.accuracy)[0],l=i||c;return`<div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--txt);margin-bottom:4px">
        <span><b>${e(t.name)}</b> <span style="color:var(--mute)">· ${t.total} questions</span></span>
        <span style="color:${n?r(t.accuracy):`var(--mute)`};font-weight:800">${n?t.accuracy+`%`:`Need more data`}</span>
      </div>
      <div class="qz-bar" style="margin-bottom:4px"><i style="width:${t.accuracy}%;background:${r(t.accuracy)}"></i></div>
      ${l&&l.accuracy<o?`<div style="font-size:11.5px;color:var(--mute)">Weakest: ${e(l.name)} (${l.accuracy}%)</div>`:``}
    </div>`}).join(``)}
    <div style="font-size:10.5px;color:var(--mute)">Based on your practice history. Topics need ${s}+ questions to be ranked.${d?``:` Practice a few new sets to see specific topics instead of whole chapters.`}</div>
  </div>`}function d(e){let t=(window.__focusTopics||[])[e];t&&window.quizState&&(window.quizState.subSel=t.subject,window.quizState.unitSel=t.chapter===`All Chapters`?``:t.chapter,window.quizState.focusTopic=t.kind===`topic`?t.name:``,window.startQuiz(window.quizState.unitSel||null,window.quizState.countSel||15))}typeof window<`u`&&Object.assign(window,{getWeakTopics:n,buildWeakTopicContext:r,renderWeakTopicsCard:i,analyzePractice:c,getFocusTopics:l,renderFocusAnalysis:u,startFocusPractice:d});export{u as t};
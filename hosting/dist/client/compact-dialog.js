(function(root){
'use strict';
const api={};root.MaisonCompactDialog=api;
if(typeof module!=='undefined')module.exports=api;
if(!root.document)return;
const dialog=document.querySelector('#dialog'),content=document.querySelector('#dialogContent');
let queued=false;
// Keep a stable exit outside the fitted content. No pagination or DOM replacement:
// buttons retain their event handlers when the window is resized or refitted.
const footer=document.createElement('div');footer.className='dialog-footer';
const resume=document.createElement('button');resume.type='button';resume.className='primary';
resume.textContent='Continuer la simulation →';resume.onclick=()=>root.closeDialog(true);
footer.append(resume);dialog.append(footer);
function fit(){
 queued=false;if(!dialog.open||!content.children.length)return;
 content.querySelectorAll('[data-modal-off]').forEach(el=>el.removeAttribute('data-modal-off'));
 content.style.zoom='1';
 // Required choices keep their own action buttons; ordinary information menus always have an exit.
 footer.hidden=!!content.querySelector('.journey-dialog,#livePause,#resumeOutcome,#continueWeek,#wakeContinue,#startLife,#performShow,#returnFromShow,#closeShowMemory,[data-week-choice]');
 const height=Math.max(150,(root.visualViewport?.height||root.innerHeight)-32);
 dialog.style.setProperty('--dialog-height',height+'px');
 const style=getComputedStyle(dialog),padding=(parseFloat(style.paddingTop)||0)+(parseFloat(style.paddingBottom)||0);
 const available=Math.max(60,height-padding-(footer.hidden?0:footer.getBoundingClientRect().height)-12);
 const natural=content.getBoundingClientRect().height;
 if(natural>available)content.style.zoom=String(available/natural);
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(fit);}
api.schedule=schedule;
new MutationObserver(schedule).observe(content,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
root.addEventListener('resize',schedule);root.visualViewport?.addEventListener('resize',schedule);
content.addEventListener('load',schedule,true);
})(globalThis);

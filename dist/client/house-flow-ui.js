'use strict';
(function(){
let owner=null,timer=null,active=null;
const duration=n=>n>=60?Math.floor(n/60)+' h'+(n%60?' '+n%60:''):n+' min';
function people(ids){return `<div class="activity-people">${ids.map(id=>{const p=state.people.find(p=>p.id===id);return p?`<span title="${I.esc(p.instrument)}">${I.icons[p.instrument]||'♪'} ${I.esc(p.name)}</span>`:'';}).join('')}</div>`;}
function renderGroups(){
 const el=$('#groupActivities');if(!el)return;
 if(window.homeOpen||!saved){el.hidden=true;return;}
 const data=MaisonGroupActivity.snapshot(state);el.hidden=!data.running.length&&!data.waiting.length;
 el.innerHTML=`${data.running.length?'<h2>Ensemble en ce moment</h2>':''}${(window.MaisonPages?.slice('activities',data.running,data.waiting.length?1:2)||data.running).map(a=>{const song=M.song(state,a.songId);return `<article class="group-activity"><strong>${I.esc(a.title)}</strong>${song?`<div class="activity-song">${I.songTitle(song)}</div>`:''}${people(a.people)}<div class="activity-time"><span>${a.progress} %</span><span>Encore ${duration(a.remaining)}</span></div><progress max="100" value="${a.progress}" aria-label="${I.esc(a.title)} : ${a.progress} %"></progress><small>Durée : ${duration(a.duration)} · temps de jeu</small></article>`;}).join('')}${window.MaisonPages?.nav('activities')||''}${data.waiting.length?`<h3>En attente · ${data.waiting.length}</h3>${(window.MaisonPages?.slice('waiting',data.waiting,2)||data.waiting).map(a=>{const song=M.song(state,a.songId);return `<article class="group-waiting"><strong>${data.waiting.indexOf(a)+1}. ${I.esc(a.title)}</strong>${song?`<div class="activity-song">${I.songTitle(song)}</div>`:''}${people(a.people)}<p>${I.esc(a.reason)}</p></article>`;}).join('')}${window.MaisonPages?.nav('waiting')||''}`:''}`;
 window.MaisonPages?.bind(el,renderGroups);
}
function dismiss(id){
 if(active!==id)return;
 clearTimeout(timer);timer=null;active=null;$('#influenceNotice').hidden=true;notify();
}
function notify(){
 const el=$('#influenceNotice');if(!el)return;
 if(owner!==state){clearTimeout(timer);timer=null;active=null;el.hidden=true;owner=state;}
 if(active||window.homeOpen||$('#dialog').open||T.busy(state)||W.isNight(state))return;
 const moment=state.music.moments.find(m=>!m.seen&&D.isTransient(m));if(!moment)return;
 active=moment.id;el.innerHTML=`<button id="closeInfluenceNotice" class="notice-close" type="button" aria-label="Fermer la notification" title="Fermer">×</button><span class="influence-mark">↗</span><div><strong>${I.esc(moment.title)}</strong>${people(moment.accepted?.length?moment.accepted.map(p=>p.id):moment.people||(moment.personId?[moment.personId]:[]))}${moment.songId&&M.song(state,moment.songId)?`<div class="activity-song">${I.songTitle(M.song(state,moment.songId))}</div>`:''}<p>${I.esc(moment.body)}</p></div>`;el.hidden=false;
 D.acknowledge(state,moment.id);save();
 $('#closeInfluenceNotice').onclick=()=>dismiss(moment.id);
 timer=setTimeout(()=>dismiss(moment.id),5000);
}
window.MaisonHouseFlowUI={render(){renderGroups();notify();}};
})();

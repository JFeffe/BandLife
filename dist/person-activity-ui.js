'use strict';
(function(){
let opened=null,owner=null;
const esc=I.esc;
function view(id){return MaisonPersonActivity.snapshot(state,id);}
function compact(p){const a=view(p.id),c=a.current,d=a.direction,w=a.waiting;return `<span class="personal-stack"><span class="personal-current">${d?.active?'✓ Aucune activité prioritaire':`${c.people.length>1?'♬':'▶'} ${c.travel?'En route · ':''}${esc(c.title)}`}</span>${!d?.active?`<span class="personal-progress" role="progressbar" aria-label="Progression de ${esc(c.title)}" aria-valuenow="${c.progress}" aria-valuemin="0" aria-valuemax="100"><i style="width:${c.progress}%"></i></span>`:'<span class="personal-progress-spacer"></span>'}<span class="personal-next">${w.length?`◷ ${esc(w[0].title)}${w.length>1?` · +${w.length-1}`:''}`:a.refusal?'Refus · '+esc(a.refusal.reason):'Aucune invitation en attente'}</span><span class="personal-direction ${d?.active?'active':''}">${d?`${d.active?'▶':'☀'} ${esc(d.title)} · ${d.hour} → ${clock(d.until)}`:'↝ Libre de ses envies'}</span></span>`;}
function close(){opened=null;const el=$('#rosterExpansion');if(el)el.hidden=true;document.querySelectorAll('#roster .roster-item').forEach(b=>b.setAttribute('aria-expanded','false'));}
function render(){
 const el=$('#rosterExpansion');if(!el)return;
 if(owner!==state){owner=state;opened=null;}
 if(!opened||window.homeOpen||$('#dialog').open){el.hidden=true;return;}
 const p=state.people.find(p=>p.id===opened),a=p&&view(opened);if(!a){close();return;}
 const c=a.current,d=a.direction,scroll=el.querySelector('.stack-details')?.scrollTop||0;
 const song=id=>{const x=M.song(state,id);return x?`<span class="stack-song">${I.songTitle(x)}</span>`:'';};
 const people=c.people.map(id=>state.people.find(p=>p.id===id)).filter(Boolean).map(p=>`${I.icons[p.instrument]||'♪'} ${esc(p.name)}`).join(' · ');
 el.hidden=false;el.innerHTML=`<div class="stack-heading"><strong>${I.icons[p.instrument]||'♪'} ${esc(p.name)} · ses activités</strong><button type="button" id="closeRosterExpansion" aria-label="Fermer les activités">×</button></div><div class="stack-details">${!d?.active?`<section class="stack-now"><small>EN COURS${c.travel?' · EN DÉPLACEMENT':''}</small><strong>${esc(c.title)}</strong>${song(c.songId)}<p>${people} · ${esc(H.rooms[c.room]?.label||'En sortie')}</p><progress max="100" value="${c.progress}"></progress><small>${c.progress} % · encore ${c.remaining} min de jeu</small></section>`:''}${a.waiting.map((o,i)=>`<section class="stack-wait"><small>${i+1} · ${o.invitation?'INVITATION EN ATTENTE':'REPRISE PRIORITAIRE'}</small><strong>${esc(o.title)}</strong>${song(o.songId)}<p>${esc(o.reason)}</p><small>${o.invitation?'Acceptera ou refusera quand l’invitation pourra être envoyée.':'Déjà acceptée : reprendra sans nouveau vote de participation.'}</small></section>`).join('')}${d?`<section class="stack-background"><small>DIRECTION DE ${d.hour.toUpperCase()} · JUSQU’À ${clock(d.until)}</small><strong>${esc(d.title)} ${d.active?'· En cours':''}</strong>${song(d.songId)}${d.active?`<p>${people}</p>`:''}<p>${d.future?'Disponible à 10 h, après les reprises prioritaires.':d.active?'Suit la direction acceptée.':"Reste disponible après les activités prioritaires, selon son énergie et la disponibilité de la pièce."}</p></section>`:'<p class="stack-free">Aucune direction active : suit ses propres envies.</p>'}${a.refusal?`<p class="stack-refusal">Dernier refus · ${esc(a.refusal.reason)}</p>`:''}</div><button type="button" id="stackPersonSheet">Ouvrir sa fiche complète ↗</button>`;
 el.querySelector('.stack-details').scrollTop=scroll;$('#closeRosterExpansion').onclick=close;$('#stackPersonSheet').onclick=()=>{const id=opened;close();showPerson(id);};
 document.querySelectorAll('#roster .roster-item').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.id===opened)));
}
function toggle(id){if(opened===id){close();return;}owner=state;opened=id;render();}
document.addEventListener('click',e=>{if(opened&&!e.target.closest('#rosterExpansion')&&!e.target.closest('#roster .roster-item'))close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened){const id=opened;close();document.querySelector(`#roster .roster-item[data-id="${id}"]`)?.focus();}});
window.MaisonPersonActivityUI={compact,render,toggle,close};
})();

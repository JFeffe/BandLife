'use strict';
(function(){
const E=MaisonHouseEvents,esc=I.esc;let owner=null,key='';
function portraits(ids){return `<div class="house-event-people">${ids.map(id=>state.people.find(p=>p.id===id)).filter(Boolean).map(p=>`<span>${I.portrait(p)}<strong>${esc(p.name)}</strong><small>${p.traits.map(esc).join(' · ')}</small></span>`).join('')}</div>`;}
function history(){
 const records=E.init(state).history.slice(0,4);
 openDialog(`<section class="house-event-sheet"><span class="eyebrow">LES SOUVENIRS DE LA MAISON</span><h2>La vie du groupe.</h2>${records.length?records.map(r=>`<article class="house-event-memory"><small>S${r.week} · ${r.status==='resolved'?'Choix partagé':r.status==='skipped'?'Laissé passer':'Moment passé'}</small><strong>${esc(r.title)}</strong><p>${esc(r.choice)}</p>${r.effects.map(x=>`<small>${esc(x)}</small>`).join('')}</article>`).join(''):'<p>Pas encore de souvenir. De temps à autre, les personnalités et les liens du groupe feront naître un choix facultatif.</p>'}<button id="houseEventBack">Retour à la maison</button></section>`);
 $('#houseEventBack').onclick=()=>closeDialog();
}
function result(r){
 openDialog(`<section class="house-event-sheet"><span class="eyebrow">UN MOMENT PARTAGÉ · S${r.week}</span><h2>${esc(r.title)}</h2>${portraits(r.people)}<p>${esc(r.choice)}</p><ul class="house-event-effects">${r.effects.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><button id="houseEventBack" class="primary">Retour à la maison</button></section>`);
 $('#houseEventBack').onclick=()=>closeDialog();
}
function open(){
 const e=E.pending(state);if(!e)return history();
 const enabled=E.available(state),choices=E.choices(state,e);
 openDialog(`<section class="house-event-sheet"><span class="eyebrow">VIE DU GROUPE · CHOIX FACULTATIF</span><h2>${esc(e.title)}</h2>${portraits(e.people)}<p>${esc(e.body)}</p>${enabled?'':'<p class="hint">Ce moment attendra la fin du choix en cours ou du concert.</p>'}<div class="house-event-choices">${choices.map(c=>`<button data-house-choice="${c.id}" ${enabled?'':'disabled'}><strong>${esc(c.label)}</strong>${E.preview(state,c).map(x=>`<span>${esc(x)}</span>`).join('')}</button>`).join('')}</div><p class="tiny">Disponible jusqu’au début de S${e.expiresWeek}. Aucun malus si tu laisses passer. Les musiciens poursuivent leurs activités.</p><div class="house-event-actions"><button id="houseEventLater">Plus tard</button><button id="houseEventSkip" ${enabled?'':'disabled'}>Laisser passer</button><button id="houseEventHistory" class="quiet">Souvenirs récents ↗</button></div></section>`);
 $('#dialogContent').querySelectorAll('[data-house-choice]').forEach(b=>b.onclick=()=>{const r=E.resolve(state,e.id,b.dataset.houseChoice);if(!r)return;save();result(r);render();});
 $('#houseEventLater').onclick=()=>closeDialog();
 $('#houseEventSkip').onclick=()=>{if(!E.skip(state,e.id))return;save();closeDialog();render();};
 $('#houseEventHistory').onclick=history;
}
function renderPanel(){
 const h=E.init(state),e=E.pending(state),panel=$('#houseLifePanel');if(!panel)return;
 const next=JSON.stringify([e?.id,e?.title,h.history[0]?.id,h.history[0]?.status]);if(owner===state&&key===next)return;owner=state;key=next;
 panel.innerHTML=`<button id="openHouseEvent" class="house-life-button ${e?'has-event':''}"><span>♡ Vie du groupe ${e?'<b>1 choix</b>':''}</span>${e?`<strong>${esc(e.title)} ↗</strong>`:'<small>Souvenirs et petits moments ↗</small>'}</button>`;
 $('#openHouseEvent').onclick=open;
}
window.MaisonHouseEventsUI={render:renderPanel,open,history};renderPanel();
})();

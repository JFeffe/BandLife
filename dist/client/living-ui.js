(function(){
'use strict';
let owner=null;const sprites=new Map();
function render(){if(owner!==state){for(const v of sprites.values())v.el.remove();sprites.clear();owner=state;}
 const e=state.journey?.encounter,actors=[...(state.partyVisitors||[])];if(e&&['visiting','decision','leaving'].includes(e.phase))actors.push(Object.assign(e,{id:'trial-visitor',name:e.candidate.name,color:e.candidate.color,skin:e.candidate.skin,hair:e.candidate.hair,targetRoom:e.room,leaving:e.phase==='leaving'}));
 const ids=new Set(actors.map(a=>a.id));for(const [id,v] of sprites)if(!ids.has(id)){if(id==='trial-visitor'&&e?.phase==='joined'){const pos=positions[e.candidate.id];if(pos){pos.x=v.actor.x;pos.y=v.actor.y;}}v.el.remove();sprites.delete(id);}
 for(const a of actors){let v=sprites.get(a.id);if(!v){const el=document.createElement('div');el.className='person house-visitor';el.style.cssText=`--c:${a.color};--skin:${a.skin};--hair:${a.hair}`;el.innerHTML='<span class="legs"></span><span class="body"></span><span class="head"></span><span class="name"></span><img class="held-instrument" alt="">';$('#characters').append(el);a.x=H.ENTRY[0];a.y=H.ENTRY[1];v={el,actor:a,room:'outside',queue:[]};sprites.set(a.id,v);}v.actor=a;
 v.el.querySelector('.name').innerHTML=(a.id==='trial-visitor'?I.icons[a.candidate.instrument]+' ':'♪ ')+I.esc(a.name)+(a.id==='trial-visitor'?' · Essai':'');
 const img=v.el.querySelector('img');img.hidden=a.action!=='practice';if(a.candidate)img.src=I.instrumentAsset(a.candidate.instrument);
 const room=a.leaving?'outside':a.targetRoom;if(v.room!==room){const dest=room==='outside'?H.ENTRY:H.rooms[room].slots[actors.indexOf(a)%H.rooms[room].slots.length];v.queue=H.path(v.room,room,dest);v.room=room;}
 }
}
function frame(dt){for(const v of sprites.values()){if(!running&&!v.actor.leaving)continue;let budget=dt*220*(running?speed:1);while(v.queue.length&&budget>0){const [x,y]=v.queue[0],a=v.actor,dx=x-a.x,dy=y-a.y,d=Math.hypot(dx,dy);if(d<=budget){a.x=x;a.y=y;v.queue.shift();budget-=d;}else{a.x+=dx/d*budget;a.y+=dy/d*budget;budget=0;}}v.el.style.left=v.actor.x/H.WIDTH*100+'%';v.el.style.top=v.actor.y/H.HEIGHT*100+'%';v.el.classList.toggle('moving',!!v.queue.length);v.el.hidden=v.actor.leaving&&!v.queue.length;if(v.el.hidden&&v.actor.phase==='leaving'){v.actor.phase='declined';save();}}}
function invite(p){openDialog(`<h2>Une invitation de ${I.esc(p.name)}</h2><p>Accès à sa chambre uniquement.</p><div class="choice-row">${state.partyVisitors.filter(v=>!v.leaving).map(v=>`<button data-invite-guest="${v.id}">${I.esc(v.name)}</button>`).join('')}</div>`);document.querySelectorAll('[data-invite-guest]').forEach(b=>b.onclick=()=>{MaisonLiving.invite(state,p.id,b.dataset.inviteGuest);save();closeDialog(true);render();});}window.MaisonLivingUI={render,frame,invite};
})();

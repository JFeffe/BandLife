// Original BandLive UI connected through its existing concert callbacks.
let bridge,live;
const notice=message=>{const el=document.querySelector('#moduleNotice');el.textContent=message;setTimeout(()=>{if(el.textContent===message)el.textContent='';},4500);};
try{
 bridge=parent.MaisonLiveUI.connect(window);
 document.querySelector('#maisonPause').onclick=()=>{live?.leave();bridge.pause();};
 const {createBandLiveModule}=await import('./bandlive-view.mjs?v=0.8.15');
 live=createBandLiveModule({getWorld:()=>bridge.world,onOpen:()=>live.refresh(),onReturn:()=>{live.leave();bridge.returnHome();},onDisable:()=>bridge.pause(),canStart:()=>true,notify:notice,getReducedEffects:bridge.reduced,getPlan:()=>({groupId:'maison'}),onConcertUpdate:()=>bridge.update(),onConcertCancel:()=>{live.leave();bridge.pause();}});
 live.refresh();bridge.ready();
 document.addEventListener('click',event=>{if(event.target.closest('[data-group-select],[data-person]'))notice(bridge.world.people.map(p=>`${p.name} : ${Math.round(p.needs.energy)}/100 énergie`).join(' · '));});
 addEventListener('pagehide',()=>live.leave());
}catch(error){bridge?.error(error.message);if(!bridge)notice('Ouvre le concert depuis la maison.');}

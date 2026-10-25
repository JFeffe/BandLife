// Same BandLive renderer; commands are validated by the cooperative server.
let bridge,live;
const notice=message=>{const el=document.querySelector('#moduleNotice');el.textContent=message;setTimeout(()=>{if(el.textContent===message)el.textContent='';},4500);};
try{
 bridge=parent.MaisonCoopLive.connect(window);
 const {createBandLiveModule}=await import('./bandlive-view.mjs?v=0.8.15');
 live=createBandLiveModule({getWorld:()=>bridge.world,onOpen:()=>live.refresh(),onReturn:()=>bridge.returnHome(),onDisable:()=>bridge.returnHome(),canStart:()=>true,notify:notice,getPlan:()=>({groupId:'maison'}),onCommand:command=>bridge.command(command),onConcertCancel:()=>bridge.returnHome()});
 bridge.subscribe(()=>live.refresh());live.refresh();bridge.ready();
 document.querySelector('#maisonPause').onclick=()=>notice('La partie est sauvegardée automatiquement. Tu peux revenir dans ce quartier après avoir fermé l’onglet.');
 addEventListener('pagehide',()=>live.leave());
}catch(error){notice('La scène ne peut pas s’ouvrir : '+error.message);bridge?.notify(error.message);}

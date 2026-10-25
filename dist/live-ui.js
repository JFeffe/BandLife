'use strict';
(function(root){
let overlay=null,frame=null,projection=null;
function hide(){if(!overlay)return;overlay.remove();overlay=null;frame=null;projection=null;document.body.classList.remove('concert-open');}
function pause(){if(!overlay)return;save();hide();render();setRunning(false);$('#resumeShow')?.focus();}
function returnHome(){if(!state.tour?.active)return;if(state.tour.active.phase!=='result'){pause();return;}if(!T.beginReturn(state))return;save();hide();render();}
root.MaisonLiveUI={
 isOpen:()=>!!overlay,
 open(){
  const a=state.tour?.active;if(!a||a.phase!=='stage'||overlay)return;
  T.startLive(state);projection=root.MaisonShowAdapter.world(state);save();setRunning(false);if($('#dialog').open)closeDialog(false);
  overlay=document.createElement('section');overlay.className='concert-module';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','BandLive · le concert');
  overlay.innerHTML='<div class="concert-loading" role="status">La scène se prépare…</div><button type="button" class="concert-emergency-close">Fermer · reprendre plus tard</button><iframe title="BandLive · module de Simon" src="show-module/maison.html?v=20" allow="autoplay; fullscreen"></iframe>';
  frame=overlay.querySelector('iframe');overlay.querySelector('button').onclick=pause;document.body.append(overlay);document.body.classList.add('concert-open');
 },
 connect(caller){
  if(!overlay||caller!==frame.contentWindow)throw Error('Concert fermé.');
  return {world:projection,reduced:()=>root.matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('reduced-motion'),
   update(){if(!projection||!state.tour?.active)return;root.MaisonShowAdapter.update(state,projection);save();},
   ready(){if(!overlay)return;overlay.classList.add('ready');frame.focus();},
   notify(message){toast(message);},pause,returnHome,
   error(message){if(!overlay)return;overlay.classList.remove('ready');overlay.querySelector('.concert-loading').textContent='Le module n’a pas pu démarrer. Ta partie est conservée. '+message;}
  };
 },
 reset:hide
};
})(window);

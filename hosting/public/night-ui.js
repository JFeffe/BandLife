'use strict';
(function(){
let nightKey=null,settled=0;
function begin(outcome){accumulator=0;nightKey=null;settled=0;dialogWasRunning=true;if($('#dialog').open)closeDialog();render();setRunning(true);if(outcome)toast(outcome.title+' · Les dormeurs regagnent leur chambre, puis la nuit accélère.');}
function pace(dt){const night=state.calendar.night;if(!night){nightKey=null;settled=0;return {rate:speed,walk:speed};}if(nightKey!==night.startTick){nightKey=night.startTick;settled=0;}if(running&&!document.hidden)settled+=dt;const walking=Object.values(positions).some(p=>p.queue.length);if(walking||settled<.8)return {rate:0,walk:1.5};return {rate:32,walk:1.5};}
window.MaisonNightUI={begin,pace};
})();

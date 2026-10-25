'use strict';
// Deterministic playtesting through normal decisions and the real concert engine.
// This is a greedy test player, not a measurement of human win rates.
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js');
require('../dist/house.js');const W=require('../dist/weeks.js');require('../dist/bandlive.js');
const T=require('../dist/shows.js');require('../dist/morale.js');require('../dist/activities.js');
require('../dist/goals.js');const J=require('../dist/journey.js');require('../dist/living.js');require('../dist/house-events.js');
function run({seed=35,count=3,route='cards',stopAct=4,resistance=null,onDeparture=null,houseEvents=false}={}){
 const initialSeed=seed,random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296),originalRandom=Math.random;
 Math.random=random;
 try{
  let s=S.create(count),steps=0;const shows=[],attempted=new Map();
  while(s.journey.status==='active'&&s.journey.act<stopAct&&steps++<30000){
   const a=s.tour.active;
   if(a?.phase==='departing'){
    if(resistance)s.journey.selected.resistance=resistance[s.journey.act][s.journey.stage];
    onDeparture?.(s);T.arriveAtVenue(s);continue;
   }
   if(a?.phase==='stage'){
    const ready=a.songs.length,level=Math.max(0,...a.songs.map(x=>M.qualityLevel(x.quality)));
    T.autoShow(s);shows.push({act:s.journey.act+1,week:a.week,route:s.journey.selected.id,people:s.people.length,ready,level,deck:a.deck.length,played:a.result.songs.length,turns:a.result.turns,outcome:a.result.outcome,contract:J.assess(s,a),score:a.result.score,energy:Math.round(s.people.reduce((n,p)=>n+p.energy,0)/s.people.length)});continue;
   }
   if(a?.phase==='result'){T.beginReturn(s);continue;}
   if(a?.phase==='returning'){T.arriveHome(s);continue;}
   if(s.calendar.wake){W.acknowledgeWake(s);continue;}
   if(J.blocked(s)){
    if(s.journey.pendingArc)J.acknowledgeArc(s);
    else if(s.journey.pendingReward){J.claimCard(s,s.people[shows.length%s.people.length].id);J.acknowledgeWriting(s);}
    else if(['offered','decision'].includes(s.journey.encounter?.phase)){
     const e=s.journey.encounter;J.meetingChoice(s,route==='recruit'?(e.phase==='offered'?'trial':e.verdict.band&&e.verdict.candidate?'join':'decline'):'decline');
    }else{
     const options=J.options(s),preferred=route==='recruit'?'meeting':route==='writing'?'composition':'card';
     const o=options.find(o=>o.reward===preferred)||options.find(o=>['exchange','card'].includes(o.reward))||options[0];
     if(!J.choose(s,o.id))throw Error('Route stalled at '+s.tick);
    }
    continue;
   }
   const reward=s.music.pending[0];
   if(reward){const choice=M.eventChoices(s,reward)[0];if(choice)D.resolveEvent(s,reward.id,choice.id,reward.rewardMode==='replace'?0:'add',random);}
   if(houseEvents&&globalThis.MaisonHouseEvents?.pending(s)){
    const e=globalThis.MaisonHouseEvents.pending(s),options=globalThis.MaisonHouseEvents.choices(s,e);
    if(options.length)globalThis.MaisonHouseEvents.resolve(s,e.id,options[0].id);
   }
   if(s.calendar.pending){const e=s.calendar.pending;W.choose(s,e.phase==='morning'?(e.rehearsalId?'rehearse':'write'):e.phase==='evening'?'quiet':'sleep',random);continue;}
   if(!T.busy(s)&&W.minute(s)>=600&&W.minute(s)<1020&&!s.music.session){
    const x=s.music.songs.find(x=>x.adopted&&!M.ready(x)&&!x.archived)||s.music.songs.find(x=>M.canTrial(s,x))||s.music.songs.find(x=>M.canRevise(x));
    if(x&&s.tick-(attempted.get(x.id)??-99)>=12&&!s.music.orders.some(o=>o.songId===x.id&&['waiting','running'].includes(o.status))){attempted.set(x.id,s.tick);D.submit(s,{type:x.adopted?'practice':M.canTrial(s,x)?'trial':'revise',songId:x.id},random);}
   }
   const before=s.tick;S.step(s,random);if(s.tick!==before+1)throw Error('Unresolved choice at '+s.tick);
  }
  if(steps>=30000)throw Error('Run did not finish');
  return {seed:initialSeed,count,route,status:s.journey.status,act:s.journey.act+1,chances:s.journey.chances,shows,state:s};
 }finally{Math.random=originalRandom;}
}
if(require.main===module){
 const seeds=[7,35,91],routes=['cards','writing','recruit'];
 const runs=[];for(const route of routes)for(const seed of seeds){const {state,...result}=run({seed,route});runs.push(result);}
 console.log(JSON.stringify(runs,null,2));
}
module.exports={run};

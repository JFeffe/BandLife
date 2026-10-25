'use strict';
// A chronological run: no clock jumps, injected songs, forced votes or concert results.
const assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js');
require('../dist/house.js');const W=require('../dist/weeks.js');require('../dist/bandlive.js');
const T=require('../dist/shows.js');require('../dist/morale.js');require('../dist/activities.js');
require('../dist/goals.js');const J=require('../dist/journey.js');require('../dist/living.js');
let seed=35;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const originalRandom=Math.random;Math.random=random;
let s=S.create(),steps=0;const report=[],attempted=new Map();
try{
 while(s.journey.status==='active'&&s.journey.act===0&&steps++<10000){
  const a=s.tour.active;
  if(a?.phase==='departing'){T.arriveAtVenue(s);continue;}
  if(a?.phase==='stage'){T.autoShow(s);report.push({week:a.week,ready:a.songs.length,outcome:a.result.outcome,played:a.result.songs.length,score:a.result.score});continue;}
  if(a?.phase==='result'){T.beginReturn(s);continue;}
  if(a?.phase==='returning'){T.arriveHome(s);continue;}
  if(s.calendar.wake){W.acknowledgeWake(s);continue;}
  if(J.blocked(s)){
   if(s.journey.pendingReward){J.claimCard(s,s.people[0].id);J.acknowledgeWriting(s);}
   else if(s.journey.encounter)J.meetingChoice(s,'decline');
   else assert(J.choose(s,['radio','electric','headliner'][s.journey.stage]));
   continue;
  }
  const reward=s.music.pending[0];
  if(reward){const choice=M.eventChoices(s,reward)[0];if(choice)D.resolveEvent(s,reward.id,choice.id,'add',random);}
  if(s.calendar.pending){
   const e=s.calendar.pending;
   W.choose(s,e.phase==='morning'?(e.rehearsalId?'rehearse':'write'):e.phase==='evening'?'quiet':'sleep',random);
   continue;
  }
  if(!T.busy(s)&&W.minute(s)>=600&&W.minute(s)<1020&&!s.music.session){
   const x=s.music.songs.find(x=>x.adopted&&!M.ready(x)&&!x.archived)||s.music.songs.find(x=>M.canTrial(s,x))||s.music.songs.find(x=>M.canRevise(x));
   if(x&&s.tick-(attempted.get(x.id)??-99)>=12&&!s.music.orders.some(o=>o.songId===x.id&&['waiting','running'].includes(o.status))){
    attempted.set(x.id,s.tick);D.submit(s,{type:x.adopted?'practice':M.canTrial(s,x)?'trial':'revise',songId:x.id},random);
   }
  }
  const before=s.tick;S.step(s,random);assert.equal(s.tick,before+1,'A resolved player choice must permit time to advance');
  // Reload once during ordinary play, retaining the same deterministic RNG stream.
  if(s.tick===700){s=JSON.parse(JSON.stringify(s));M.init(s,true);D.init(s);W.init(s,true);T.init(s);J.init(s);}
 }
 console.log('Chronological playthrough:',JSON.stringify(report));
 assert(steps<10000,'No stalled choices');assert(report.some(x=>x.week===17),'Reach the local finale on schedule');
 assert(report.every(x=>x.ready>0),'Prepare actual songs before every departure');
 assert.equal(s.journey.history.length,report.length);
 assert(s.journey.act===1||s.journey.status==='lost','Resolve the first act through actual show outcomes');
 console.log('PASS chronological house-to-finale run, real composition/adoption/rehearsal, nights, save reload, concert simulation and return rewards.');
}finally{Math.random=originalRandom;}

'use strict';
const assert=require('node:assert/strict'),{run}=require('../scripts/campaign-lab.cjs');
const S=globalThis.MaisonSim,J=globalThis.MaisonJourney;
for(let act=0;act<4;act++){
 const routes=J.acts[act].stages.flat();assert(routes.every(x=>x.resistance>=20&&x.resistance<=200));
 if(act)assert(Math.min(...routes.map(x=>x.resistance))>J.acts[act-1].stages[2][0].resistance,'Each act begins above the previous finale');
}
const runs=[];for(const route of ['cards','writing','recruit'])for(const seed of [7,35,91])runs.push(run({route,seed}));
assert(runs.every(r=>r.status==='won'),'The three preparation/reward routes can reach the world victory');
assert(runs.every(r=>r.shows.length===12));assert(runs.every(r=>r.shows.every(x=>x.contract)));
assert(runs.filter(r=>r.route==='writing').every(r=>r.shows.find(x=>x.route==='authors').contract),'An early audience victory no longer penalizes a prepared author set');
const average=act=>{const a=runs.flatMap(r=>r.shows).filter(x=>x.act===act);return a.reduce((n,x)=>n+x.turns,0)/a.length;};
assert(average(4)>average(1)+2,'Later shows should require substantially more play');
// Controlled counterfactual: keep all ready-song counts, decks and actual preparation,
// but give each departure after Act 1 beginner song capacities (3 turns / 2 energy).
const control=run({seed:35,onDeparture:s=>{if(s.journey.act)for(const x of s.tour.active.songs)Object.assign(x,{turns:3,energyPerTurn:2,quality:7});}});
assert.equal(control.status,'lost');assert(control.shows.some(x=>x.act>=3&&x.outcome==='lost'));
const withEvents=run({seed:35,route:'recruit',houseEvents:true});assert.equal(withEvents.status,'won');
assert(withEvents.state.houseEvents.serial>=3);assert(withEvents.state.houseEvents.history.some(x=>x.status==='resolved'));
assert(withEvents.state.music.pending.every(x=>x.type==='reward'),'House stories do not reintroduce routine action occasions');
console.log('PASS nine chronological four-act runs, all reward routes, later-show pressure, beginner-capacity control and optional events in a full campaign.');
// Already accepted contracts are save-owned, even after a rebalance.
const s=S.create();Object.assign(s.journey,{act:3,stage:2});J.choose(s,'world-final');
s.journey.selected.resistance=110;const saved=JSON.stringify(s.journey.selected);J.init(s);
assert.equal(JSON.stringify(s.journey.selected),saved);assert.equal(J.options(s)[0].resistance,110);
const clone=JSON.parse(JSON.stringify(s));J.init(clone);assert.equal(JSON.stringify(clone.journey.selected),saved);
Object.assign(s.journey,{act:0,stage:1,selected:{id:'authors',name:'Contrat déjà choisi',act:0,week:16,minSongs:2,resistance:50,styles:['Indie','Folk'],fans:6,reward:'composition'}});
assert.equal(J.options(s).find(x=>x.id==='authors').minSongs,2);
console.log('PASS chosen legacy contracts, announced difficulty and saved shows are preserved.');

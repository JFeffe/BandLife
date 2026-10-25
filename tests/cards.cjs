const assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js'),C=require('../dist/cards.js');
const ref=require('./fixtures/bandlive-cards.json');
// Independent, pinned GitHub source: all 25 card definitions and three instrument choices.
for(const key of Object.keys(C.INSTRUMENTS)){
 const p={instrument:C.INSTRUMENTS[key]};C.initPerson(p);
 assert.deepEqual(p.deck,['note','note',key+'-special']);
 assert.deepEqual(C.choices(p),['special','new1','new2'].map(k=>key+'-'+k));
 for(const [id,expected] of [['note',ref.NOTE],[key+'-special',ref.SPECIALS[key]],[key+'-new1',ref.NEW_SPECIALS[key][0]],[key+'-new2',ref.NEW_SPECIALS[key][1]]]){
  for(const [field,value] of Object.entries(expected))assert.deepEqual(C.CARDS[id][field],value,`${id}.${field}`);
 }
}
// Exact energy boundaries; direct, AoE, tempo-consuming, and deferred power effects.
for(const [energy,penalty] of [[0,3],[30,3],[31,2],[60,2],[61,0],[100,0]]){
 assert.equal(C.penalty(energy),penalty);
 assert.equal(C.effects('note',energy).power,6-penalty);
 assert.equal(C.effects('voice-special',energy).power,5-penalty);
 assert.equal(C.effects('guitar-special',energy,{tempo:7}).power,15-penalty);
 assert.equal(C.effects('guitar-special',energy,{tempo:7}).tempoSpent,7);
 assert.equal(C.effects('keys-special',energy).power,Math.max(0,2-penalty));
 assert.equal(C.effects('keys-special',energy).tempo,2);
 assert.equal(C.effects('bass-special',energy).boost,3-penalty);
 assert.equal(C.effects('bass-special',energy).tempo,1);
 assert.equal(C.effects('bass-new2',energy).relayBoost,4-penalty);
 assert.equal(C.effects('bass-new2',energy).draw,1);
 assert.equal(C.effects('drums-special',energy).cost,1);
 assert(!Object.hasOwn(C.effects('drums-special',energy),'power'));
}
assert.equal(C.effects('guitar-new1',31,{tempo:4}).power,6);
assert.equal(C.effects('sax-new2',30,{tempo:6}).power,4);
assert.equal(C.effects('sax-new2',30,{tempo:6}).tempoSpent,4);
assert.equal(C.effects('sax-new1',30,{tempo:3}).draw,1);
assert.equal(C.effects('percussion-new1',0,{personId:'a',previousPersonId:'b'}).tempo,4);
assert.equal(C.effects('trumpet-new1',0,{neighborConquered:true}).tempo,3);
assert.equal(C.effects('percussion-new2',0,{conquered:true}).tempo,3);
// Real group adoption queues one independent addition per author, even with a full queue.
const s=S.create(6);s.music.songs=[];s.music.pending=[];
for(let i=0;i<6;i++)M.queue(s,{type:'reward',personId:s.people[i].id,songId:'previous-'+i,title:'Older reward'});
const ids=s.people.map(p=>p.id),x=M.newSong(s,ids,'Indie',()=>0,{progress:80});
assert(M.requestTrial(s,x.id,()=>0));s.tick=s.music.session.ends;M.step(s,()=>0);assert(x.adopted);
const rewards=s.music.pending.filter(e=>e.songId===x.id&&e.rewardSource==='adoption');assert.equal(rewards.length,6);
for(const e of rewards){
 const p=s.people.find(p=>p.id===e.personId),choices=M.eventChoices(s,e);assert.equal(choices.filter(c=>c.id.startsWith('card:')).length,3);
 assert(!M.resolveEvent(s,e.id,choices[0].id,0)); // Adoption is an addition, not replacement.
 const before=p.deck.length;assert.equal(M.resolveEvent(s,e.id,choices[1].id,'add').status,'applied');assert.equal(p.deck.length,before+1);
 assert.equal(p.deck.at(-1),choices[1].id.slice(5));assert(!M.resolveEvent(s,e.id,choices[1].id,'add'));assert.equal(x.cardRewards[p.id],'claimed');
}
assert.equal(s.music.pending.filter(e=>e.type==='reward').length,6); // Previous rewards not evicted.
// A normal event supports exact-slot replacement or addition, including duplicates.
const p=s.people[0],e=s.music.pending.find(e=>e.personId===p.id),choice=M.eventChoices(s,e)[2].id,before=[...p.deck];
assert(!M.resolveEvent(s,e.id,choice,-1));assert(!M.resolveEvent(s,e.id,choice,999));assert(s.music.pending.includes(e));
M.resolveEvent(s,e.id,choice,1);assert.equal(p.deck.length,before.length);assert.equal(p.deck[0],before[0]);assert.equal(p.deck[1],choice.slice(5));assert.equal(p.deck[2],before[2]);
M.queue(s,{type:'reward',songId:x.id,personId:p.id,rewardSource:'event'});const added=s.music.pending.find(e=>e.rewardSource==='event');M.resolveEvent(s,added.id,M.eventChoices(s,added)[0].id,'add');assert.equal(p.deck.length,5);
const deck=C.concertDeck(s);assert.equal(deck.length,s.people.reduce((n,p)=>n+p.deck.length,0));assert.equal(new Set(deck.map(c=>c.uid)).size,deck.length);assert.equal(deck.filter(c=>c.personId===p.id).length,5);
const round=JSON.parse(JSON.stringify(s));M.init(round,true);assert.deepEqual(round.people.map(p=>p.deck),s.people.map(p=>p.deck));assert.deepEqual(round.music.pending,s.music.pending);assert.deepEqual(round.music.songs[0].cardRewards,x.cardRewards);
// Legacy default shrinks once, while customized decks retain their size and a backup.
const legacy={instrument:'Basse',deck:['play','play','play','pulse','accent']};C.initPerson(legacy);assert.deepEqual(legacy.deck,['note','note','bass-special']);
const custom={instrument:'Chant',deck:['play','precision','play','accent','chorus']};C.initPerson(custom);assert.equal(custom.deck.length,5);assert.equal(custom.deck[1],'voice-new1');assert.equal(custom.deck[4],'voice-new2');assert.equal(custom.legacyDeck[1],'precision');const snapshot=JSON.stringify(custom);C.initPerson(custom);assert.equal(JSON.stringify(custom),snapshot);
// Actual departure freezes owner-specific energy with the complete deck; song cost stays independent.
require('../dist/house.js');const W=require('../dist/weeks.js'),T=require('../dist/shows.js');const live=S.create();live.tick=7*144+18;live.people[0].energy=30;live.people[1].energy=60;live.people[2].energy=61;T.ensureDue(live);assert.equal(live.tour.active.phase,'departing');assert.equal(live.tour.active.deck.length,9);
const cards=live.tour.active.deck;assert.equal(T.cardEffects(live,cards[0].uid).power,3);assert.equal(T.cardEffects(live,cards[3].uid).power,4);assert.equal(T.cardEffects(live,cards[6].uid).power,6);
live.people[0].energy=100;assert.equal(T.cardEffects(live,cards[0].uid).power,3);assert.equal(T.cardEffects(live,cards[0].uid).cost,1);
const saved=JSON.parse(JSON.stringify(live));M.init(saved,true);T.init(saved);assert.deepEqual(saved.tour.active.deck,cards);
console.log('PASS BandLive parity (25 cards), 8 starter decks, fatigue boundaries/effects, six author rewards, no lost/duplicate rewards, additions/replacements, legacy saves and shared concert deck.');

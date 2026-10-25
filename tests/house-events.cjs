'use strict';
const assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js');require('../dist/decisions.js');require('../dist/house.js');
const W=require('../dist/weeks.js'),T=require('../dist/shows.js');require('../dist/morale.js');require('../dist/activities.js');
const J=require('../dist/journey.js'),E=require('../dist/house-events.js');
function evening(){const s=S.create();J.choose(s,'radio');s.tick=198;s.calendar.pending=null;return s;}
let s=evening();s.relations['lea:max']=-4;const clock=s.tick,orders=JSON.stringify(s.music.orders),jobs=s.people.map(p=>[p.action,p.room,p.remaining,p.sessionUntil]);
E.tick(s);let e=E.pending(s);assert.equal(e.kind,'tension');assert.equal(e.week,2);assert.equal(s.tick,clock);assert.equal(W.blocked(s),false);
const saved=JSON.stringify(s);E.tick(s);assert.equal(JSON.stringify(s),saved,'No repeat event on the next render/tick');
const choices=E.choices(s);assert.equal(choices.length,2);assert(E.preview(s,choices[0]).some(x=>x.includes('relation +2')));
s=JSON.parse(saved);E.init(s);assert.equal(JSON.stringify(s),saved,'Saved pending choice and cadence remain exact');
const outcome=E.resolve(s,e.id,'listen');assert(outcome);assert.equal(S.affinity(s,'lea','max'),-2);assert.equal(s.people[0].morale,62);
assert.equal(JSON.stringify(s.music.orders),orders);assert.deepEqual(s.people.map(p=>[p.action,p.room,p.remaining,p.sessionUntil]),jobs);
const once=JSON.stringify(s);assert.equal(E.resolve(s,e.id,'listen'),null);assert.equal(E.skip(s,e.id),false);assert.equal(JSON.stringify(s),once);
for(let t=199;t<500;t++){s.tick=t;E.tick(s);}assert.equal(s.houseEvents.serial,1,'At most one situation every three weeks');
s=evening();E.tick(s);e=E.pending(s);assert.equal(e.kind,'quiet');const subject=s.people.find(p=>p.id===e.people[0]);
const morale=subject.morale;assert(E.resolve(s,e.id,'space'));assert.equal(subject.morale,morale+5);
s=evening();E.tick(s);e=E.pending(s);const before=s.people.map(p=>p.morale);assert(E.skip(s,e.id));assert.deepEqual(s.people.map(p=>p.morale),before);assert.equal(s.houseEvents.history[0].status,'skipped');
s=evening();E.tick(s);e=E.pending(s);s.tick=(e.expiresWeek-1)*144;assert.equal(E.pending(s),null);assert.equal(E.resolve(s,e.id,'space'),null);E.tick(s);assert.equal(s.houseEvents.history[0].status,'expired');
console.log('PASS contextual events, nonblocking cadence, real morale/relations, saved choices, expiry/skip without penalty and exactly-once resolution.');

function idea(){const s=evening();s.people.forEach(p=>{p.morale=80;p.energy=80;});s.people[1].interests.push('Indie');s.relations['lea:max']=3;E.tick(s);assert.equal(E.pending(s).kind,'idea');return s;}
s=idea();e=E.pending(s);const x=M.song(s,e.songId),author=s.people.find(p=>p.id===e.people[0]);const progress=x.progress,authors=[...x.authors],decks=JSON.stringify(s.people.map(p=>p.deck));
assert(E.resolve(s,e.id,'motif'));assert.equal(x.progress,progress,'The choice itself does not perform work');assert.deepEqual(x.authors,authors);assert.equal(JSON.stringify(s.people.map(p=>p.deck)),decks);
const reload=JSON.parse(JSON.stringify(s)),ref=JSON.parse(JSON.stringify(s));delete ref.houseEvents.inspiration[x.id];
const rp=reload.people.find(p=>p.id===author.id),fp=ref.people.find(p=>p.id===author.id);rp.action=fp.action='compose';rp.projectId=fp.projectId=x.id;
M.finish(reload,rp,()=>.5);M.finish(ref,fp,()=>.5);assert.equal(M.song(reload,x.id).progress-M.song(ref,x.id).progress,8);assert(!reload.houseEvents.inspiration[x.id]);
M.finish(reload,rp,()=>.5);M.finish(ref,fp,()=>.5);assert.equal(M.song(reload,x.id).progress-M.song(ref,x.id).progress,8,'No second bonus');
s=idea();e=E.pending(s);M.song(s,e.songId).adopted=true;assert(!E.choices(s,e).some(x=>x.id==='motif'));assert.equal(E.resolve(s,e.id,'motif'),null);assert(E.resolve(s,e.id,'confidence'));
s=idea();e=E.pending(s);E.resolve(s,e.id,'motif');const b=s.houseEvents.inspiration[e.songId];s.tick=(b.expiresWeek-1)*144;E.tick(s);assert(!s.houseEvents.inspiration[e.songId]);
s=idea();e=E.pending(s);E.resolve(s,e.id,'motif');const borrowed=s.people.find(p=>p.id!==e.people[0]);assert.equal(E.consumeInspiration(s,borrowed,M.song(s,e.songId)),0);assert(s.houseEvents.inspiration[e.songId]);
console.log('PASS inspiration waits for the named author, preserves credits/decks/quality, expires safely and survives reload without replay.');

s=evening();s.calendar.pending={id:'appointment'};E.tick(s);e=E.pending(s);assert(e);assert.equal(E.resolve(s,e.id,'space'),null);assert.equal(E.skip(s,e.id),false);s.calendar.pending=null;
s.tour.active={phase:'packing',songs:[],week:2};assert.equal(E.resolve(s,e.id,'space'),null);s.tour.active=null;s.tick=240;assert.equal(E.resolve(s,e.id,'space'),null,'No choice during sleep');
s=evening();s.tour.active={phase:'packing',songs:[],week:2};E.tick(s);assert.equal(E.pending(s),null);s.tour.active=null;s.tour.recoveryUntil=s.tick+5;E.tick(s);assert.equal(E.pending(s),null);
s=evening();delete s.houseEvents;const previous=JSON.stringify({people:s.people,music:s.music,journey:s.journey});E.init(s);assert.equal(JSON.stringify({people:s.people,music:s.music,journey:s.journey}),previous);
s=evening();E.tick(s);e=E.pending(s);s.people=s.people.filter(p=>p.id!==e.people[0]);assert.equal(E.pending(s),null);assert.equal(E.resolve(s,e.id,'space'),null);E.tick(s);assert.equal(s.houseEvents.history[0].status,'expired');
console.log('PASS weekly choices/concerts/nights take priority, return evening remains calm, missing participants and legacy saves are safe.');

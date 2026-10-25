const assert=require('node:assert/strict');
const N=require('../dist/names.js'),S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js'),H=require('../dist/house.js'),W=require('../dist/weeks.js');require('../dist/shows.js');require('../dist/morale.js');require('../dist/activities.js');require('../dist/goals.js');const C=require('../dist/casting.js');
const namesState={music:{songs:[]}};
for(const genre of M.GENRES){assert(N.genres[genre].titles.length>=40);for(let i=0;i<330;i++)N.song(namesState,genre,()=>0);}
assert.equal(new Set(namesState.music.usedTitles.map(N.key)).size,2640);
const savedNames=JSON.parse(JSON.stringify(namesState));const next=N.song(savedNames,'Indie',()=>0);assert(!namesState.music.usedTitles.includes(next));
for(const gender of ['female','male']){const names=[];for(let i=0;i<215;i++)names.push(N.musician(names,gender,()=>0));assert.equal(new Set(names.map(N.key)).size,215);}
for(const rng of [()=>0,()=>.999,()=>.5])for(let trio=0;trio<4;trio++){
 const draft=C.draft(trio,rng);assert.equal(new Set(draft.map(p=>N.key(p.name))).size,3);
 for(let i=0;i<30;i++){draft[1]=C.profile(draft[1].id,draft[1].instrument,rng,draft.map(p=>p.name));assert.equal(new Set(draft.map(p=>N.key(p.name))).size,3);}
 const s=C.create(draft,0),a=S.candidates(s),b=S.candidates(s);assert.deepEqual(a,b);
 const round=JSON.parse(JSON.stringify(s));assert.deepEqual(S.candidates(round),a);
 for(const p of a)assert(S.recruit(s,p.id));assert.equal(new Set(s.people.map(p=>N.key(p.name))).size,6);
}
let s=S.create();const initial=s.music.songs[0],title=initial.title;initial.voteCount=1;assert(M.scrap(s,initial.id));const replacement=M.newSong(s,['lea'],'Indie',()=>0,{title});assert.notEqual(replacement.title,title);
s.people[1].name=s.people[0].name;s.music.songs[1].title=s.music.songs[0].title;M.init(s,true);assert.equal(new Set(s.people.map(p=>N.key(p.name))).size,3);assert.equal(new Set(s.music.songs.map(x=>N.key(x.title))).size,s.music.songs.length);const stable=JSON.stringify(s);M.init(s,true);assert.equal(JSON.stringify(s),stable);
console.log('PASS 2,640 unique titles across eight genres, exhausted banks, saved/deleted titles, 430 distinct-name draws, all trios/rerolls/recruits and duplicate-save repair.');
function setup(progress=80){const s=S.create();s.calendar.baseMinutes=600;s.calendar.nextAt=1020;s.music.pending=[];s.people.forEach(p=>{p.playerActionUntil=0;p.sessionUntil=0;p.energy=90;});const x=s.music.songs[0];x.progress=progress;M.queue(s,{type:'demo',songId:x.id,title:'Une chanson à faire entendre'});return {s,x,e:{id:'removed-demo'}};}
for(const status of ['running','refused','waiting']){
 const {s,x,e}=setup();if(status==='waiting')s.people[0].playerActionUntil=4;
 let calls=0;const rng=()=>{calls++;return status==='refused'?1:0;};
 const o=D.submit(s,{type:'trial',songId:x.id},rng);assert.equal(o.status,status);assert(!s.music.pending.some(q=>q.id===e.id));
 const draws=calls,count=s.music.orders.length;assert.equal(D.submit(s,{type:'trial',songId:x.id,people:s.people.map(p=>p.id)},rng),o);assert.equal(calls,draws);assert.equal(s.music.orders.length,count);
 assert.equal(M.resolveEvent(s,e.id,'trial',undefined,rng),false);
 const round=JSON.parse(JSON.stringify(s));M.init(round,true);assert(!round.music.pending.some(q=>q.id===e.id));
 if(status==='refused'){s.tick=10;s.people.forEach(p=>p.playerActionUntil=0);assert.equal(D.submit(s,{type:'trial',songId:x.id},()=>0).status,'running');}
 if(status==='waiting'){s.tick=4;D.step(s,()=>0);assert.equal(s.music.session.songId,x.id);assert.equal(s.music.moments.filter(m=>m.orderId===o.id).length,1);D.acknowledgeOrder(s,o.id);assert(s.music.moments.find(m=>m.orderId===o.id).seen);}
}
// Reverse route: event first, then repertoire; only one invitation and result.
({s}=setup());let x=s.music.songs[0],e=s.music.pending[0];assert.equal(M.resolveEvent(s,'removed-demo','trial',undefined,()=>0),false);const first=D.submit(s,{type:'trial',songId:x.id},()=>0);assert.equal(D.submit(s,{type:'trial',songId:x.id},()=>1),first);assert.equal(s.music.orders.length,1);assert.equal(s.music.pending.length,0);
// Rehearsals consume only the matching adoption occasion, never author rewards.
s=S.create();x=s.music.songs[0];x.adopted=true;x.progress=100;M.queue(s,{type:'adopted',songId:x.id});M.queue(s,{type:'reward',songId:x.id,personId:'lea',rewardSource:'adoption'});D.submit(s,{type:'practice',songId:x.id},()=>0);assert(!s.music.pending.some(e=>e.type==='adopted'));assert(s.music.pending.some(e=>e.type==='reward'));
// Calendar and autonomous trials also retire the occasion. Blocked choices do not.
({s,x,e}=setup());assert(M.sessionFromIntent(s,x.id,s.people.map(p=>p.id)));assert(!s.music.pending.some(q=>q.id===e.id));
({s,x,e}=setup(100));const blocked=D.submit(s,{type:'polish',songId:x.id},()=>0);assert.equal(blocked.status,'blocked');assert(!s.music.pending.some(q=>q.type!=='reward'));
// A second genuine rejection must remain distinct; repeated lifecycle emissions must not.
s=S.create();x=s.music.songs[0];const m=D.notice(s,{kind:'composition',songId:x.id,title:'Née'});D.acknowledge(s,m.id);assert.equal(D.notice(s,{kind:'composition',songId:x.id,title:'Née'}),m);assert.equal(s.music.moments.length,1);
D.notice(s,{kind:'rejection',songId:x.id,title:'Premier refus',body:'Une seconde chance'});D.notice(s,{kind:'rejection',songId:x.id,title:'Deuxième refus',body:'Aux archives'});assert.equal(s.music.moments.length,3);
s.music.moments.push({...m,id:'legacy-duplicate',seen:false});D.init(s);assert.equal(s.music.moments.length,3);assert(s.music.moments[0].seen);
console.log('PASS cross-menu occasion consumption, no duplicate submissions/random draws, deferred/refused/blocked cases, calendar trials, card reward preservation and exactly-once moments.');
// Occasions now contain only deck rewards, including migrated saves.
s=S.create();const deckBefore=JSON.stringify(s.people.map(p=>p.deck));
for(const type of ['demo','adopted','routine','night','influence','duo','tension'])M.queue(s,{type,songId:s.music.songs[0].id,personId:'lea'});
assert.equal(s.music.pending.length,0);
M.queue(s,{type:'reward',personId:'lea',songId:s.music.songs[0].id,rewardSource:'adoption',rewardMode:'add'});const reward=s.music.pending[0];
s.music.pending.push({id:'legacy-demo',type:'demo',songId:s.music.songs[0].id},{id:'legacy-routine',type:'routine'});
D.notice(s,{kind:'adoption',songId:s.music.songs[0].id,title:'Une adoption importante'});const moments=JSON.stringify(s.music.moments);
M.init(s,true);assert.deepEqual(s.music.pending.map(e=>e.id),[reward.id]);assert.equal(JSON.stringify(s.people.map(p=>p.deck)),deckBefore);assert.equal(JSON.stringify(s.music.moments),moments);
s.music.pending.push({id:'stale-action',type:'routine'});assert.equal(M.resolveEvent(s,'stale-action','coffee',null,()=>0),false);assert.deepEqual(s.music.pending.map(e=>e.id),[reward.id]);
console.log('PASS reward-only occasions, saved legacy cleanup, stale action rejection and preserved decks/adoption notices/reward identity.');

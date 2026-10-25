const assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js'),H=require('../dist/house.js'),W=require('../dist/weeks.js'),T=require('../dist/shows.js'),R=require('../dist/morale.js'),A=require('../dist/activities.js'),G=require('../dist/group-activity.js');
function calm(count=3){const s=S.create(count);s.tick=12;s.calendar.nextAt=1020;s.people.forEach(p=>{p.action='rest';p.room=p.bedroomId;p.energy=80;});return s;}
let s=calm(6),x=s.music.songs[0];x.progress=80;
let calls=0;assert(M.requestTrial(s,x.id,()=>calls++<4?0:1));
let view=G.snapshot(s);assert.equal(view.running.length,1);assert.equal(view.running[0].people.length,4);assert.equal(view.running[0].progress,0);assert.equal(view.running[0].duration,90);
s.tick+=4;view=G.snapshot(s);assert.equal(view.running[0].progress,44);assert.equal(view.running[0].remaining,50);
assert(!view.running[0].people.includes(s.people[5].id));assert.deepEqual(G.snapshot(JSON.parse(JSON.stringify(s))),view);
const o=D.submit(s,{type:'jam',title:'La prochaine jam'});assert.equal(o.status,'waiting');
const solo=D.submit(s,{type:'compose',personId:s.people[5].id,title:'Écrire seul',genre:'Jazz'});assert.equal(solo.status,'waiting');
view=G.snapshot(s);assert.equal(view.waiting.length,1);assert.equal(view.waiting[0].id,o.id);assert.equal(view.waiting[0].people.length,6);assert(view.waiting[0].reason);
D.cancel(s,o.id);assert.equal(G.snapshot(s).waiting.length,0);
s=calm();A.register(s,'party',[s.people[0].id]);assert.equal(G.snapshot(s).running.length,0);
s.people.slice(0,2).forEach(p=>S.start(s,p,'party'));A.register(s,'party',s.people.slice(0,2).map(p=>p.id));assert.equal(G.snapshot(s).running[0].people.length,2);
s=calm();x=M.newSong(s,s.people.slice(0,2).map(p=>p.id),'Jazz',()=>0);s.people.slice(0,2).forEach(p=>S.start(s,p,'compose'));assert.equal(G.snapshot(s).running[0].songId,x.id);s.people[1].projectId=null;assert.equal(G.snapshot(s).running.length,0);
// A calendar practice invitation without the required majority isn't a pending trial.
s=calm(6);x=s.music.songs[0];x.progress=80;s.calendar.focus={action:'practice',songId:x.id,until:42,people:s.people.slice(0,2).map(p=>p.id)};s.people.slice(0,2).forEach(p=>p.intent={action:'practice',applied:false});assert.equal(G.snapshot(s).waiting.length,0);
console.log('PASS collective activity timers, actual participants, coauthors, waiting orders, cancellations, saves and exclusion of solo actions/insufficient trials.');
// Readiness gives no second reward, including after save migration.
s=calm();x=s.music.songs[0];x.progress=80;assert(M.requestTrial(s,x.id,()=>0));s.tick=s.music.session.ends;M.step(s,()=>0);assert(x.adopted);const rewards=s.music.pending.filter(e=>e.rewardSource==='adoption');assert.equal(rewards.length,1);
x.progress=100;x.preparation=99;s.tick=x.retryAt+1;assert(M.requestPractice(s,x.id,()=>0));s.tick=s.music.session.ends;M.step(s,()=>0);assert(M.ready(x));assert.equal(s.music.pending.filter(e=>e.type==='reward').length,1);
s.music.pending.push({id:'legacy-ready',type:'reward',songId:x.id,personId:x.authors[0],title:'Une nouvelle façon de jouer'});const decks=JSON.stringify(s.people.map(p=>p.deck));M.init(s,true);assert(!s.music.pending.some(e=>e.id==='legacy-ready'));assert.equal(s.music.pending.filter(e=>e.rewardSource==='adoption').length,1);assert.equal(JSON.stringify(s.people.map(p=>p.deck)),decks);
console.log('PASS reward only on adoption, no readiness reward, obsolete pending rewards removed without touching decks or adoption rewards.');
// A party costs energy and improves mood even for a consenting solitary musician.
s=calm();const p=s.people[2];p.action='party';p.room='salon';p.remaining=1;p.travel=0;const energy=p.energy,morale=p.morale;S.step(s,()=>.5);assert(p.energy<energy);assert(p.morale>morale);
// Saved v20 stage shows migrate to 22:00; recovery lasts until the midnight decision.
s=calm();s.tick=7*144+18;T.ensureDue(s);T.arriveAtVenue(s);T.autoShow(s);s.tour.active.endTick=7*144+60;delete s.tour.returnHour;T.init(s);assert.equal(s.tour.active.endTick,7*144+84);const finalEnergy=s.people.map(p=>p.energy);T.beginReturn(s);assert.equal(W.minute(s),1320);T.arriveHome(s);for(let i=0;i<3;i++)S.step(s,()=>0);assert.deepEqual(s.people.map(p=>p.energy),finalEnergy);assert(s.people.every(p=>['rest','talk'].includes(p.action)));assert.equal(W.minute(s),1350);W.choose(s,'month-write',()=>0);
const queued=D.submit(s,{type:'jam',title:'Jam après le show'});assert.equal(queued.status,'waiting');assert.match(queued.reason,/repos/);
for(let i=0;i<9;i++){S.step(s,()=>0);assert(s.people.every(p=>['rest','talk'].includes(p.action)));}assert.equal(s.calendar.pending.phase,'midnight');assert.equal(queued.status,'waiting');
console.log('PASS party morale/energy, saved-show return at 22:00, energy retained through unpacking and peaceful recovery until midnight.');
// The pending rail uses the very same oldest-first view as the resolver.
s=calm(6);s.people.forEach(p=>p.playerActionUntil=100);
const first=D.submit(s,{type:'jam',title:'Première invitation'});
const second=D.submit(s,{type:'coffee',title:'Deuxième invitation'});
s.tick++;
const third=D.submit(s,{type:'duo',people:s.people.slice(0,2).map(p=>p.id),genre:'Jazz',title:'Troisième invitation'});
assert.deepEqual(D.ordered(s).map(o=>o.id),[first.id,second.id,third.id]);
assert.deepEqual(G.snapshot(s).waiting.map(o=>o.id),[first.id,second.id,third.id]);
assert.deepEqual(G.snapshot(JSON.parse(JSON.stringify(s))).waiting.map(o=>o.id),[first.id,second.id,third.id]);
D.cancel(s,second.id);assert.deepEqual(G.snapshot(s).waiting.map(o=>o.id),[first.id,third.id]);
// A separate calendar invitation belongs at its creation time, not always last.
s.calendar.focus={action:'party',label:'Soirée prévue',started:-1,until:200,people:s.people.map(p=>p.id)};
s.people.forEach(p=>p.intent={action:'party',applied:false});
assert.equal(G.snapshot(s).waiting[0].id,'focus');
console.log('PASS chronological pending order, same-tick submissions, append-last, cancellation, saves and calendar ordering.');

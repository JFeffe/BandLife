const assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js'),H=require('../dist/house.js'),W=require('../dist/weeks.js'),T=require('../dist/shows.js');require('../dist/activities.js');require('../dist/group-activity.js');const P=require('../dist/person-activity.js');
let s=S.create(6),p=s.people[0];s.tick=12;s.calendar.nextAt=1020;s.calendar.pending={id:'morning',phase:'morning',week:1};W.choose(s,'write',()=>0);
S.start(s,p,'compose');p.travel=0;let v=P.snapshot(s,p.id);assert(v.direction.active);assert.equal(v.direction.hour,'10 h');assert.equal(v.direction.title,'Composer');
const x=s.music.songs[1];x.progress=100;x.adopted=true;assert(M.requestPractice(s,x.id,()=>0));v=P.snapshot(s,p.id);assert.equal(v.current.title,'Répétition');assert.equal(v.current.songId,x.id);assert.equal(v.current.people.length,6);assert(!v.direction.active);assert.equal(v.direction.action,'compose');
const first=D.submit(s,{type:'suggest',people:[p.id],action:'talk',title:'Discuter'}),second=D.submit(s,{type:'suggest',people:[p.id],action:'rest',title:'Récupérer'});v=P.snapshot(s,p.id);assert.deepEqual(v.waiting.map(o=>o.id),[first.id,second.id]);assert(v.waiting.every(o=>o.invitation&&o.reason));assert.equal(P.snapshot(s,s.people[1].id).waiting.length,0);
D.cancel(s,first.id);assert.deepEqual(P.snapshot(s,p.id).waiting.map(o=>o.id),[second.id]);
s.music.session=null;s.sharedActivities=[];p.sessionUntil=0;p.playerActionUntil=0;S.start(s,p,'compose');p.travel=0;assert(P.snapshot(s,p.id).direction.active);
s.tick=p.intent.until;assert.equal(P.snapshot(s,p.id).direction,null);
// Refusing a direction never creates a false background activity.
s=S.create();s.tick=12;s.calendar.nextAt=1020;s.calendar.pending={id:'decline',phase:'morning',week:1};W.choose(s,'write',()=>1);assert(s.people.every(p=>!P.snapshot(s,p.id).direction));
// Night and the show take precedence over stale daytime intentions.
s.calendar.night={wakeTick:s.tick+48};p=s.people[0];p.sleeping=true;p.intent={action:'compose',until:s.tick+100,startTick:0};assert.equal(P.snapshot(s,p.id).current.title,'Dort');assert.equal(P.snapshot(s,p.id).direction,null);
console.log('PASS personal stack: actual session/song/participants, progress, oldest-first individual invitations, cancellations, direction deduplication, expiration, refusal and sleep.');
// The late party exists only after this week's explicit 17 h party choice.
for(const choice of ['party','jam','quiet']){
 s=S.create();s.tick=54;s.calendar.pending={id:'evening',phase:'evening',week:1,personId:s.people[0].id};W.choose(s,choice,()=>0);
 s.tick=96;s.calendar.pending={id:'midnight',phase:'midnight',week:1,personId:s.people[0].id};
 assert.equal(W.choices(s).some(c=>c.id==='afterparty'),choice==='party');
 if(choice!=='party')assert.equal(W.choose(s,'afterparty',()=>0),null);
}
s.calendar.history=[{week:0,phase:'evening',title:'Faire la fête à la maison'}];assert(!W.choices(s).some(c=>c.id==='afterparty'));
s.calendar.history=[{week:1,phase:'evening',title:'Faire la fête à la maison'}];assert(W.choices(s).some(c=>c.id==='afterparty'));
// A saved obsolete monthly choice no longer pauses a returning band.
s=S.create();s.tick=7*144+87;s.calendar.pending={phase:'month',week:8};s.calendar.monthFocus={action:'compose'};T.init(s);assert.equal(s.calendar.pending,null);assert(!s.calendar.monthFocus);assert(!W.blocked(s));
console.log('PASS party gate, previous-week exclusion, legacy party history and retired postshow-choice migration.');

const assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js'),H=require('../dist/house.js'),W=require('../dist/weeks.js');require('../dist/activities.js');require('../dist/group-activity.js');const P=require('../dist/person-activity.js');
const yes=()=>0;
function step(s,n){for(let i=0;i<n;i++)S.step(s,yes);}
function late(){const s=S.create();s.tick=51;s.calendar.nextAt=1020;s.people.forEach(p=>{p.energy=90;p.waking=false;});return s;}
let s=late(),song=s.music.songs[0];song.progress=90;
const o=D.submit(s,{type:'trial',songId:song.id},yes);assert.equal(o.status,'running');step(s,3);assert.equal(W.minute(s),1020);assert.equal(s.music.session,null);assert.equal(o.status,'waiting');assert(o.suspended);assert.equal(song.voteCount,0);
const frozen=s.calendar.paused.find(a=>a.session);assert.equal(frozen.remaining,6);const ids=frozen.session.participants;assert(P.snapshot(s,ids[0]).waiting.some(a=>!a.invitation));
W.choose(s,'party',yes);assert(s.people.every(p=>p.action==='party'));step(s,42);assert.equal(song.voteCount,0);W.choose(s,'sleep',yes);
s=JSON.parse(JSON.stringify(s));M.init(s);W.init(s);W.skipNight(s,yes);W.acknowledgeWake(s);song=s.music.songs.find(x=>x.id===song.id);
const progress=s.music.songs.map(x=>x.progress);step(s,11);assert.equal(W.minute(s),590);assert(s.people.every(p=>['rest','talk'].includes(p.action)));assert.equal(s.music.session,null);assert.deepEqual(s.music.songs.map(x=>x.progress),progress);assert.equal(song.voteCount,0);
step(s,1);assert.equal(s.calendar.pending.phase,'morning');W.choose(s,'write',yes);assert(s.music.session);assert.deepEqual(s.music.session.participants,ids);assert(s.people.every(p=>p.action==='practice'));assert(s.people.every(p=>!p.intent.applied));
const end=s.music.session.ends;step(s,end-s.tick);assert.equal(song.voteCount,1);assert.equal(s.music.session,null);assert(s.people.every(p=>p.intent.applied));assert.equal(s.music.orders.find(x=>x.id===o.id).status,'applied');
// A promised solo composition resumes before the 10 h direction, without applying its effect at 17 h.
s=late();const p=s.people[0];S.start(s,p,'compose');p.travel=0;p.remaining=8;p.actionEnds=s.tick+8;p.playerActionUntil=p.actionEnds;const projectId=M.findProject(s,p).id,before=M.song(s,projectId).progress;step(s,3);assert.equal(M.findProject(s,p).progress,before);W.choose(s,'quiet',yes);step(s,42);W.choose(s,'sleep',yes);W.skipNight(s,yes);W.acknowledgeWake(s);step(s,12);W.choose(s,'talk',yes);assert.equal(p.action,'compose');assert(!p.intent.applied);const until=p.playerActionUntil;step(s,until-s.tick);assert(M.song(s,projectId).progress>before);assert(p.intent.applied);
// UI proposals made before 10 h wait; coffee/rest stay available.
s=S.create();const gate=D.preflight(s,{type:'continue',songId:s.music.songs[0].id});assert.equal(gate.status,'waiting');assert(gate.reason.includes('10 h'));assert.equal(D.preflight(s,{type:'coffee'}).status,'ready');step(s,11);assert(s.people.every(p=>['rest','talk'].includes(p.action)));
console.log('PASS 17 h freeze, preserved session/vote/participants, save/load, night skip, quiet 8–10 h, priority over morning choice, solo continuation and morning proposal gates.');
// Morning coffee stays active instead of being re-queued each tick.
s=S.create();s.tick=10;s.calendar.nextAt=600;const coffee=D.submit(s,{type:'coffee'},yes);assert.equal(coffee.status,'applied');step(s,1);assert.equal((s.calendar.paused||[]).length,0);assert(s.people.every(p=>p.action==='talk'));step(s,1);assert.equal(s.calendar.pending.phase,'morning');
// A show has priority over saved work; the work survives until the next working morning.
const T=require('../dist/shows.js');s=late();song=s.music.songs[0];song.progress=90;D.submit(s,{type:'trial',songId:song.id},yes);step(s,3);const saved=s.calendar.paused[0];s.tick=7*144;s.calendar.pending=null;s.calendar.nextAt=7*1440+600;assert(T.ensureDue(s));assert(T.busy(s));W.resumeWork(s);assert(s.calendar.paused.includes(saved));assert.equal(s.music.session,null);
step(s,18);assert.equal(s.tour.active.phase,'departing');T.arriveAtVenue(s);T.autoShow(s);T.beginReturn(s);T.arriveHome(s);step(s,3);W.resumeWork(s);assert(s.calendar.paused.includes(saved));step(s,9);W.choose(s,'sleep',yes);W.skipNight(s,yes);W.acknowledgeWake(s);step(s,12);W.choose(s,'write',yes);assert(s.music.session);assert.equal(s.music.session.songId,song.id);
console.log('PASS morning coffee uninterrupted, show priority and deferred work retained through show return/night until the next 10 h.');

// Completing the same song overnight must not start an unrelated new composition on resume.
s=late();const author=s.people[0];S.start(s,author,'compose');author.travel=0;author.remaining=8;step(s,3);const composition=s.calendar.paused.find(a=>a.songId===author.projectId&&!a.session);assert(composition);M.song(s,composition.songId).progress=100;s.tick=156;s.calendar.pending=null;W.resumeWork(s);assert(!s.calendar.paused.includes(composition));

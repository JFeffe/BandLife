const assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js'),W=require('../dist/weeks.js');
function create(){const s=S.create(6);s.music.songs=[];s.music.pending=[];s.music.moments=[];s.people.forEach(p=>{p.energy=1;p.morale=1;p.traits=['Paresseux','Solitaire'];delete p.projectId;});return s;}
// Even exhausted coauthors accept while other musicians remain free to decline.
let s=create(),x=M.newSong(s,s.people.slice(0,2).map(p=>p.id),'Jazz',()=>0,{progress:80});
assert(!M.requestTrial(s,x.id,()=>1));assert.deepEqual(s.lastResponses.accepted.map(p=>p.id),x.authors);
assert.equal(s.lastResponses.refused.length,4);assert.equal(x.voteCount,0);assert.equal(x.votes.length,0);
s.tick+=10;assert(M.requestTrial(s,x.id,()=>0));s.tick=s.music.session.ends;M.step(s,()=>1);
assert(x.votes.filter(v=>x.authors.includes(v.id)).every(v=>v.yes));assert(x.votes.filter(v=>!x.authors.includes(v.id)).every(v=>!v.yes));assert(!x.adopted);
// An authors' majority guarantees adoption after a completed trial, not before.
s=create();x=M.newSong(s,s.people.slice(0,4).map(p=>p.id),'Jazz',()=>0,{progress:80});
assert(M.requestTrial(s,x.id,()=>1));assert.equal(s.music.session.participants.length,4);assert(!x.adopted);
s.tick=s.music.session.ends;M.step(s,()=>1);assert(x.adopted);assert.equal(x.votes.filter(v=>v.yes).length,4);
// Calendar invitation uses the same author guarantee, including low energy.
s=create();x=M.newSong(s,s.people.slice(0,4).map(p=>p.id),'Jazz',()=>0,{progress:80});
s.tick=12;s.calendar.nextAt=1020;s.calendar.pending={id:'author-test',phase:'morning',week:1,rehearsalId:x.id};
const result=W.choose(s,'rehearse',()=>1);assert.equal(result.accepted.length,4);assert.equal(result.refused.length,2);
W.afterStep(s,()=>1);assert(s.music.session);assert.deepEqual(s.music.session.participants,x.authors);
console.log('PASS author support: exhausted coauthors, nonauthor refusals, majority gate, post-trial vote and calendar route.');

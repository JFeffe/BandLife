'use strict';
const assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js');require('../dist/decisions.js');require('../dist/house.js');
const W=require('../dist/weeks.js'),T=require('../dist/shows.js'),J=require('../dist/journey.js'),P=require('../dist/show-preparation.js');
let s=S.create();assert.equal(P.project(s).selected,false);J.choose(s,'radio');
const before=JSON.stringify(s),p=P.project(s);assert.equal(JSON.stringify(s),before,'Projection cannot mutate saves');
assert.equal(p.minimum,1);assert.equal(p.complete,false);assert.equal(p.weeks,7);assert.equal(p.candidates.length,2);
const ready=(genre='Indie')=>{const x=M.newSong(s,[s.people[0].id],genre,()=>.5,{progress:100});Object.assign(x,{adopted:true,preparation:100});return x;};
const x=ready();assert(P.project(s).complete);assert.equal(P.project(s).matching,0,'Public preferences are not a requirement');
x.preparation=80;assert(!P.project(s).complete,'Recruitment loss must reopen preparation');assert.equal(P.project(s).candidates[0].id,x.id);
x.preparation=100;x.progress=99;assert(!P.project(s).complete,'Both writing and preparation must reach 100%');
x.progress=100;x.archived=true;assert(!P.project(s).complete);assert(!P.project(s).candidates.some(c=>c.id===x.id));x.archived=false;
Object.assign(s.journey,{stage:1,selected:null,nextWeek:16});assert(J.choose(s,'authors'));
assert.equal(P.project(s).minimum,2);assert(!P.project(s).complete);ready('Folk');
assert(P.project(s).complete);assert.equal(s.journey.selected.minReady,2);
// Selected legacy contracts keep their original terms.
s.journey.selected.minSongs=2;assert.match(P.project(s).onStage.join(' '),/Jouer au moins 2/);
// Preparation alone cannot satisfy the on-stage two-song condition.
assert(J.requirements(s,{week:16,songs:T.setlist(s),result:{songs:[x]}}).some(t=>t.includes('Jouer 2')));
Object.assign(s.journey,{act:2,stage:2,selected:null,nextWeek:51});assert(J.choose(s,'international-final'));
s.music.songs.forEach(x=>{if(M.ready(x))x.genre='Indie';});ready('Indie');
let q=P.project(s);assert.equal(q.checks[0].ok,true);assert.equal(q.checks[1].ok,false);assert.equal(q.complete,false);
const folk=M.newSong(s,[s.people[0].id],'Folk',()=>.5,{progress:80});assert.equal(P.project(s).candidates[0].id,folk.id,'Prioritize missing styles');
Object.assign(folk,{progress:100,adopted:true,preparation:100});assert(P.project(s).complete);
const carried=T.setlist(s).map(x=>({...x}));s.tour.active={phase:'stage',week:51,songs:carried};
s.music.songs.forEach(x=>x.preparation=0);assert(P.project(s).complete,'Once departed use the actual carried setlist');assert(P.project(s).locked);
s.tour.active.phase='packing';assert(!P.project(s).complete);assert(!P.project(s).locked);
s.tour.active=null;s.tick=(51-1)*144;assert.equal(P.project(s).weeks,0);assert.match(P.project(s).deadline,/cette semaine/);
console.log('PASS preparation matches departure eligibility, adoption/writing/rehearsal, recruitment, stage-only contracts, diversity, priorities and carried setlists.');

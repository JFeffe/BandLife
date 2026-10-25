const assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js'),H=require('../dist/house.js'),W=require('../dist/weeks.js'),T=require('../dist/shows.js'),B=require('../dist/bandlive.js');require('../dist/morale.js');
function venue(count=3){const s=S.create(count);s.music.songs=[];for(let i=0;i<3;i++){const x=M.newSong(s,[s.people[0].id],M.GENRES[i],()=>0,{progress:100});Object.assign(x,{adopted:true,progress:100,preparation:100,turns:6-i,energyPerTurn:5-i,quality:100-i*15});}s.people.forEach(p=>p.energy=61);s.tick=7*144+18;T.ensureDue(s);T.arriveAtVenue(s);return s;}
// Consent to try is separate from the post-session adoption vote.
for(const count of [3,4,5,6])for(const via of ['invitation','intent']){
 const s=S.create(count);s.music.songs=[];const x=M.newSong(s,[s.people[0].id],'Indie',()=>0,{progress:80});const needed=Math.floor(count/2)+1;
 for(let yes=0;yes<needed;yes++){s.tick+=10;let n=0;assert.equal(via==='invitation'?M.requestTrial(s,x.id,()=>n++<yes?0:.999):M.sessionFromIntent(s,x.id,s.people.slice(0,yes).map(p=>p.id)),false);assert.equal(s.music.session,null);assert.equal(x.voteCount,0);assert.equal(x.votes.length,0);assert(!M.canRevise(x));assert(!x.adopted);s.tick+=10;assert(M.canTrial(s,x));}
 let n=0;assert(via==='invitation'?M.requestTrial(s,x.id,()=>n++<needed?0:.999):M.sessionFromIntent(s,x.id,s.people.slice(0,needed).map(p=>p.id)));assert.equal(s.music.session.participants.length,needed);
}
console.log('PASS essais : majorité stricte de 3 à 6 musiciens, invitations et intentions, aucun vote/retravail après invitation insuffisante.');
let s=venue(6);s.people[0].deck.push('guitar-new1','guitar-new2');s.tour.active.deck=M.cards.concertDeck(s);const g=T.startLive(s);assert.equal(g.cards.length,s.people.reduce((n,p)=>n+p.deck.length,0));assert.equal(g.cards.length,20);assert.equal(g.songs.length,3);assert.deepEqual(g.fans.map(f=>f.favorite),s.tour.active.audience.map(f=>f.genre));assert.equal(T.startLive(s),g);assert(!T.perform(s));
assert(T.liveAction(s,'song',g.songs[0].id).ok);assert.equal(g.energy,5);assert.equal(B.passageTurns(g),6);
const note=g.cards.find(c=>c.kind==='note'),actor=g.actors.find(a=>a.id===note.actorId),fan=g.fans[0];fan.intent='bored';fan.favorite='Pop';
for(const [energy,power] of [[100,6],[61,6],[60,4],[31,4],[30,3],[0,3]]){actor.needs.energy=energy;assert.equal(B.powerAgainst(g,note,fan),power);}
actor.needs.energy=61;g.deck.push(...g.hand.splice(0));g.deck.splice(g.deck.indexOf(note.id),1);g.hand.push(note.id);
const saved=JSON.stringify(g);assert(B.previewCard(g,note.id,fan.id).ok);assert.equal(JSON.stringify(g),saved);
assert(T.liveAction(s,'card',note.id,fan.id).ok);assert.equal(g.energy,4);assert.equal(actor.needs.energy,59);assert.equal(s.people.find(p=>p.id===actor.id).energy,59);assert.equal(B.powerAgainst(g,note,fan),4);const snap=JSON.stringify(g);assert(!T.liveAction(s,'card',note.id,fan.id).ok);assert.equal(JSON.stringify(g),snap);
assert.deepEqual(B.restoreBandLive(JSON.parse(JSON.stringify(g))),g);const beforeTurn=g.actors.map(a=>a.needs.energy);assert(T.liveAction(s,'turn').ok);assert.equal(g.energy,5);assert.deepEqual(g.actors.map(a=>a.needs.energy),beforeTurn.map(e=>e-1));
const reloaded=JSON.parse(JSON.stringify(s));H.init(reloaded);W.init(reloaded,true);T.init(reloaded);assert.deepEqual(T.startLive(reloaded),g);assert.deepEqual(reloaded.people.map(p=>p.energy),s.people.map(p=>p.energy));
T.autoShow(s);T.autoShow(reloaded);assert.deepEqual(reloaded.tour.active.result,s.tour.active.result);assert(!T.autoShow(s));assert.equal(s.tour.active.result.mode,'bandlive');assert(!s.tour.active.result.placeholder);assert(s.tour.active.result.people.every(p=>p.energyAfter<=p.energyBefore));const energy=s.people.map(p=>p.energy);assert(T.beginReturn(s));assert.deepEqual(s.people.map(p=>p.energy),energy);assert(T.arriveHome(s));for(let i=0;i<3;i++)S.step(s,()=>.4);assert.deepEqual(s.people.map(p=>p.energy),energy);assert.equal(s.tour.completed.length,1);assert(!T.perform(s));
console.log('PASS vrai concert, decks variables, toutes les chansons prêtes, public annoncé, fatigue dynamique, reprise exacte et énergie conservée après trajet/rangement.');
// Every instrument, special and song-energy boundary survives mid-show saves.
for(const instrument of Object.values(M.cards.INSTRUMENTS))for(const energyPerTurn of [2,5]){
 s=venue();s.people.forEach(p=>{p.instrument=instrument;p.deck=['note',...M.cards.choices(p)];p.energy=30;});s.tour.active.deck=M.cards.concertDeck(s);s.tour.active.songs.forEach(x=>{x.turns=6;x.energyPerTurn=energyPerTurn;});const game=T.startLive(s);
 B.simulateBandLive(game,()=>{assert.deepEqual(B.restoreBandLive(JSON.parse(JSON.stringify(game))),game);assert(game.energy>=0&&game.energy<=energyPerTurn);});assert(['won','lost'].includes(game.phase));assert(game.actors.every(a=>a.needs.energy>=0&&a.needs.energy<=30));assert(T.perform(s));
}
console.log('PASS huit instruments, nouvelles spéciales, réactions/foule, chansons de six tours et 2/5 énergie, rechargement après chaque action.');

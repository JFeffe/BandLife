const assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js');require('../dist/decisions.js');
let seed=731;const rng=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
for(const count of [3,6]){
 const s=S.create(count),actions=new Set(),types=new Set();
 for(let i=0;i<2000;i++){
  S.step(s,rng);
  for(const p of s.people){assert(Number.isFinite(p.energy)&&p.energy>=0&&p.energy<=100);assert.equal(p.traits.length,3);assert(p.interests.length<=2);assert(S.ACTIONS[p.action]);assert.equal(p.deck.length,3);assert(M.GENRES.includes(p.style));actions.add(p.action);}
  s.logs.forEach(l=>types.add(l.type));assert(s.logs.length<=70);assert(s.music.pending.length<=6);
  for(const x of s.music.songs){assert(x.progress>=0&&x.progress<=100);assert(x.preparation>=0&&x.preparation<=100);assert(x.quality>=0&&x.quality<=100);assert(x.authors.length>=1);if(x.progress===100)assert.equal(x.turns+x.energyPerTurn,M.qualityLevel(x.quality)+4);if(M.ready(x))assert(x.adopted&&x.progress===100&&x.preparation===100);}
  const rejected=s.music.songs.find(x=>M.canRevise(x));if(rejected&&!s.music.session)M.revise(s,rejected.id);
  const x=s.music.songs.find(x=>M.canTrial(s,x));if(x)M.requestTrial(s,x.id,rng);
  const e=s.music.pending[0];if(e){const choices=M.eventChoices(s,e);const c=choices.find(c=>c.id==='later'||c.id==='skip')||choices[0];M.resolveEvent(s,e.id,c.id,c.id.startsWith('card:')?0:null,rng);}
 }
 assert.equal(actions.size,5);assert(s.music.songs.some(x=>x.progress===100));assert(s.music.songs.some(M.ready));assert.equal(Object.keys(s.relations).length,count*(count-1)/2);assert(types.has('social'));assert(types.has('tension'));assert(types.has('influence'));
 console.log(`PASS ${count} habitants / 2000 pas : ${s.music.songs.length} projets, ${s.music.songs.filter(M.ready).length} chansons prêtes, cinq activités, énergie bornée, trois traits, trois cartes.`);
}
const s=S.create();for(const id of ['noe','sacha','zoe'])assert(S.recruit(s,id));assert(!S.recruit(s,'zoe'));assert.equal(s.people.length,6);assert(s.people.every(p=>p.deck.length===3));
assert(S.event(s,'jam',()=>0));assert(!S.event(s,'coffee'));assert(s.people.every(p=>p.action==='jam'));for(let i=0;i<12;i++)S.step(s,rng);assert(S.event(s,'coffee',()=>0));
const a=S.create();assert(S.suggest(a,'lea','jam','max',()=>0));assert.equal(a.people[0].action,'jam');assert.equal(a.people[1].action,'jam');assert(!S.suggest(a,'lea','rest'));
const b=S.create();S.suggest(b,'lea','jam',null,()=>.999);assert.equal(b.people[0].action,'practice');
const reloaded=JSON.parse(JSON.stringify(s));M.init(reloaded,true);S.step(reloaded,rng);assert.equal(reloaded.people.length,6);
console.log('PASS invitations, capacité, choix individuels, refus, délais et sérialisation.');

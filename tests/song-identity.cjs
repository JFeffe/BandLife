const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),I=require('../dist/identity.js'),H=require('../dist/house.js');require('../dist/decisions.js');require('../dist/weeks.js');require('../dist/shows.js');
assert.equal(new Set(M.GENRES.map(g=>I.genreIcons[g].path)).size,8);
for(const genre of M.GENRES){assert(I.genreIcon(genre).includes('Style : '+genre));assert(I.songTitle({title:'Ma chanson',genre}).includes('Ma chanson'));}
const state=S.create(6),song=state.music.songs[0];song.progress=100;song.title='Riffs <forts> & [calmes]';
assert(I.songTitle(song).includes('&lt;forts&gt;'));assert(!I.songTitle(song).includes('<forts>'));
const narrative=I.songText(state,'On joue « '+song.title+' » ensemble.');assert(narrative.includes('genre-icon'));assert(narrative.includes('&lt;forts&gt;'));assert.equal((narrative.match(/genre-icon/g)||[]).length,1);
assert(I.context(state,{songId:song.id}).includes('genre-icon'));
const elements={garageInstruments:{innerHTML:''},garageSong:{innerHTML:'',hidden:true}};
const ctx={state,S,M,I,H,$:selector=>elements[selector.slice(1)],window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/garage-ui.js','utf8'),ctx);
assert(M.requestTrial(state,song.id,()=>0));state.people.forEach(p=>p.travel=0);
ctx.window.MaisonGarageUI.render();assert(!elements.garageSong.hidden);assert(elements.garageSong.innerHTML.includes('Essai'));assert.equal((elements.garageSong.innerHTML.match(/song-title-text/g)||[]).length,1);assert.equal((elements.garageSong.innerHTML.match(/genre-icon/g)||[]).length,1);
state.music.session.kind='practice';ctx.window.MaisonGarageUI.render();assert(elements.garageSong.innerHTML.includes('Répétition'));
state.people.forEach(p=>p.travel=3);ctx.window.MaisonGarageUI.render();assert(elements.garageSong.hidden);assert.equal(elements.garageSong.innerHTML,'');
state.people.forEach(p=>p.travel=0);state.music.session=null;ctx.window.MaisonGarageUI.render();assert(elements.garageSong.hidden);
assert(!fs.readFileSync('dist/app.js','utf8').includes('song-overhead'));
console.log('PASS huit styles distincts, titres et texte échappés, une seule étiquette pour six musiciens, essai/répétition et retrait en fin de séance.');

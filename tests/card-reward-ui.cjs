// Production reward UI handlers on a DOM adapter; not browser geometry verification.
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js'),I=require('../dist/identity.js');
const state=S.create(),els=new Map(),buttons=new Map();let opens=0,outcome=null;
class Element{
 constructor(id){this.id=id;this.value='';this.hidden=false;this.style={};this.dataset={};this.classList={toggle(){}};this.attrs={};this._html='';}
 setAttribute(k,v){this.attrs[k]=v;}
 set innerHTML(html){this._html=html;for(const [tag,id] of html.matchAll(/<[^>]*id="([\w-]+)"[^>]*>/g)){const el=new Element(id);el.hidden=/\bhidden\b/.test(tag);els.set(id,el);}for(const [,id,options] of html.matchAll(/<select id="([\w-]+)">([\s\S]*?)<\/select>/g)){els.get(id).value=options.match(/value="([^"]*)"/)?.[1]||'';}for(const [,key,val] of html.matchAll(/data-([\w-]+)="([^"]+)"/g)){const el=new Element(val),prop=key.replace(/-([a-z])/g,(_,x)=>x.toUpperCase());el.dataset[prop]=val;buttons.set(key+':'+val,el);}}
 get innerHTML(){return this._html;}
 querySelectorAll(sel){const key=sel.match(/^\[data-([\w-]+)\]$/)?.[1];return key?[...buttons].filter(([k])=>k.startsWith(key+':')&&this._html.includes('data-'+key+'="'+k.slice(key.length+1)+'"')).map(([,v])=>v):[];}
}
const $=sel=>{const id=sel.slice(1);if(!els.has(id))els.set(id,new Element(id));return els.get(id);};
const ctx={state,S,M,D,I,$,window:{MaisonDecisionsUI:{showOutcome:o=>outcome=o}},document:{querySelectorAll:sel=>$('#dialogContent').querySelectorAll(sel)},openDialog:html=>{opens++;buttons.clear();$('#dialogContent').innerHTML=html;},render:()=>{},save:()=>{},toast:()=>{},avatar:I.portrait};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/music-ui.js','utf8'),ctx);
function offer(source='ready'){
 M.queue(state,{type:'reward',personId:state.people[0].id,rewardSource:source,rewardMode:source==='adoption'?'add':undefined,songId:state.music.songs[0].id,title:'Reward',body:'Body'});
 const e=state.music.pending.find(e=>e.rewardSource===source);ctx.window.MaisonMusicUI.showStory(e.id);return e;
}
let e=offer('adoption'),before=[...state.people[0].deck];
assert.equal($('#dialogContent').querySelectorAll('[data-reward-card]').length,3);assert(!$('#dialogContent').innerHTML.includes('value="replace"'));assert($('#dialogContent').innerHTML.includes('musician-portrait'));assert($('#dialogContent').innerHTML.includes('genre-icon'));assert.equal($('#rewardMode').value,'add');assert($('#rewardSlotLabel').hidden);
// Closing and reopening does not consume a reward; all choices remain on one sheet.
ctx.window.MaisonMusicUI.showStory(e.id);assert.deepEqual(state.people[0].deck,before);assert(state.music.pending.includes(e));
const at=opens,options=$('#dialogContent').querySelectorAll('[data-reward-card]');options[2].onclick();assert.equal(opens,at);assert($('#rewardCurrentDeck').hidden);$('#toggleRewardDeck').onclick();assert(!$('#rewardCurrentDeck').hidden);assert.equal($('#toggleRewardDeck').attrs['aria-expanded'],'true');assert.equal(opens,at);assert($('#dialogContent').innerHTML.includes('×2'));assert.match($('#dialogContent').innerHTML,/class="card-cost"[^>]*>\d<\/span>/);assert(!$('#dialogContent').innerHTML.includes(' ϟ</span>'));assert($('#dialogContent').innerHTML.includes('reward-context'));assert(!$('#dialogContent').innerHTML.includes('popup-subjects'));$('#toggleRewardDeck').onclick();assert($('#rewardCurrentDeck').hidden);const commit=$('#confirmReward').onclick;commit();commit();assert.equal(state.people[0].deck.length,4);assert.equal(state.people[0].deck.at(-1),options[2].dataset.rewardCard.slice(5));assert.equal(outcome.status,'applied');assert(!state.music.pending.includes(e));
e=offer();before=[...state.people[0].deck];$('#rewardMode').value='replace';$('#rewardMode').onchange();assert(!$('#rewardSlotLabel').hidden);$('#rewardSlot').value='1';$('#rewardSlot').onchange();const chosen=$('#dialogContent').querySelectorAll('[data-reward-card]')[1];chosen.onclick();assert.match($('#confirmReward').textContent,/remplacement/);$('#confirmReward').onclick();assert.equal(state.people[0].deck.length,before.length);assert.equal(state.people[0].deck[1],chosen.dataset.rewardCard.slice(5));assert.equal(state.people[0].deck[0],before[0]);
e=offer();const length=state.people[0].deck.length;$('#confirmReward').onclick();assert.equal(state.people[0].deck.length,length+1);
e=offer();const keep=[...state.people[0].deck];$('#skipReward').onclick();assert.deepEqual(state.people[0].deck,keep);assert(!state.music.pending.includes(e));
console.log('PASS one-sheet reward UI: three instrument choices, author/song identity, add/replace preview, exact slot, defer, skip and double-click guard.');
// Exercise the actual repertoire and occasion buttons, including retained stale handlers.
let outcomes=0;ctx.window.MaisonDecisionsUI.showOutcome=o=>{outcome=o;outcomes++;};
for(const scenario of ['running','waiting','refused']){
 state.tick+=20;state.music.session=null;state.music.pending=[];state.music.orders=[];
 state.people.forEach(p=>{p.playerActionUntil=0;p.sessionUntil=0;p.energy=90;});
 const x=M.newSong(state,['lea'],'Indie',()=>0,{progress:80});
 M.queue(state,{type:'demo',songId:x.id,title:'Une chanson à faire entendre'});const event={id:'removed-demo'};
 const beforeOpen=opens;ctx.window.MaisonMusicUI.showStory(event.id);assert.equal(opens,beforeOpen);const stale=()=>ctx.window.MaisonMusicUI.showStory(event.id);
 if(scenario==='waiting')state.people[0].playerActionUntil=state.tick+5;
 ctx.D={...D,submit:(s,r)=>D.submit(s,r,()=>scenario==='refused'?1:0)};
 ctx.window.MaisonMusicUI.render();const click=$('#songCards').querySelectorAll('[data-trial]').find(b=>b.dataset.trial===x.id).onclick;
 const count=outcomes;click();click();stale();stale();assert.equal(outcomes,count+1);assert.equal(outcome.status,scenario);assert.equal(state.music.orders.length,1);assert(!state.music.pending.some(e=>e.id===event.id));
 ctx.window.MaisonMusicUI.render();assert($('#storyBanner').hidden);
}
console.log('PASS real repertoire buttons, stale occasion buttons and double clicks: one outcome, one order, no remaining occasion in running/waiting/refused cases.');

// New reward attention persists without rebuilding/restarting on each simulation render.
state.music.pending=[];ctx.window.MaisonMusicUI.render();assert($('#storyBanner').hidden);
M.queue(state,{type:'reward',rewardSource:'adoption',rewardMode:'add',personId:state.people[1].id,songId:state.music.songs[0].id,title:'Carte'});
ctx.window.MaisonMusicUI.render();assert(!$('#storyBanner').hidden);assert.match($('#storyBanner').innerHTML,/NOUVELLE CARTE DISPONIBLE/);assert.match($('#storyBanner').innerHTML,/occasion-cards/);assert($('#storyBanner').innerHTML.includes(state.people[1].name));
const originalButton=$('#openStory'),openCount=opens;for(let i=0;i<20;i++)ctx.window.MaisonMusicUI.render();assert.equal($('#openStory'),originalButton);assert.equal(opens,openCount);originalButton.onclick();assert.equal(opens,openCount+1);
M.queue(state,{type:'reward',rewardSource:'adoption',personId:state.people[2].id,songId:state.music.songs[0].id,title:'Autre carte'});ctx.window.MaisonMusicUI.render();assert.match($('#storyBanner').innerHTML,/2 CARTES À CHOISIR/);
state.music.pending=[];ctx.window.MaisonMusicUI.render();assert($('#storyBanner').hidden);
console.log('PASS reward banner: visible author/CTA, stable animation DOM across ticks, multiple rewards and no unsolicited modal.');

M.queue(state,{type:'reward',rewardSource:'journey',rewardMode:'replace',journeyId:'masterclass-test',personId:state.people[0].id,title:'Masterclasse'});
const masterclass=state.music.pending.at(-1),masterDeck=[...state.people[0].deck];
ctx.window.MaisonMusicUI.showStory(masterclass.id);
assert.equal($('#rewardMode').value,'replace');
assert(!$('#dialogContent').innerHTML.includes('value="add"'));
assert(!$('#rewardSlotLabel').hidden);
$('#rewardSlot').value='0';$('#rewardSlot').onchange();
const special=$('#dialogContent').querySelectorAll('[data-reward-card]')[0];special.onclick();
assert.match($('#confirmReward').textContent,/remplacement/);
$('#confirmReward').onclick();
assert.equal(state.people[0].deck.length,masterDeck.length);
assert.equal(state.people[0].deck[0],special.dataset.rewardCard.slice(5));
assert.deepEqual(state.people[0].deck.slice(1),masterDeck.slice(1));
assert(!state.music.pending.includes(masterclass));
console.log('PASS masterclass UI: replace-only mode starts correctly, previews the slot and preserves deck size.');

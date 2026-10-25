// Functional DOM adapter: production UI handlers and routes, not browser layout QA.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js'),I=require('../dist/identity.js'),H=require('../dist/house.js'),W=require('../dist/weeks.js'),T=require('../dist/shows.js'),R=require('../dist/morale.js');
const els=new Map();
class Element{
 constructor(id){this.id=id;this.open=false;this.hidden=false;this.handlers={};this.style={setProperty(){}};this.dataset={};this.attributes={};this._html='';this.children=new Map();this.scrollTop=0;this.classes=new Set();this.classList={add:x=>this.classes.add(x),remove:x=>this.classes.delete(x),toggle:(x,v)=>v?this.classes.add(x):this.classes.delete(x)};}
 set innerHTML(html){this._html=html;this.children.clear();for(const [,id] of html.matchAll(/id="([\w-]+)"/g))els.set(id,new Element(id));}
 get innerHTML(){return this._html;}
 querySelectorAll(selector){const match=selector.match(/^\[([\w-]+)\]$/);if(!match)return [];const attr=match[1],key=attr.replace(/^data-/,'').replace(/-([a-z])/g,(_,x)=>x.toUpperCase());return [...this._html.matchAll(new RegExp(attr+'="([^\"]+)"','g'))].map(([,value])=>{if(!this.children.has(attr+value)){const el=new Element(attr+value);el.dataset[key]=value;this.children.set(attr+value,el);}return this.children.get(attr+value);});}
 querySelector(selector){if(selector==='.rail-scroll'){if(!this.children.has(selector))this.children.set(selector,new Element(selector));return this.children.get(selector);}return null;}
 setAttribute(k,v){this.attributes[k]=v;}focus(){this.focused=true;}addEventListener(k,v){this.handlers[k]=v;}showModal(){this.open=true;}close(){this.open=false;this.handlers.close?.();}
}
for(const id of ['dialog','dialogContent','closeDialog','songbook','musiciansPanel','schedulePanel','showVan','tourBanner','jam','coffee','newComposition','invite','map','weekPanel','characters'])els.set(id,new Element(id));
const tabs=['repertoire','musicians','schedule'].map(id=>{const el=new Element(id);el.dataset.railTab=id;return el;}),panels=['songbook','musiciansPanel','schedulePanel'].map((id,i)=>{const el=els.get(id);el.dataset.railPanel=tabs[i].dataset.railTab;return el;});
const $=sel=>els.get(sel.slice(1));
const ctx={S,M,D,I,H,W,T,R,MaisonShows:T,state:S.create(6),$,window:{matchMedia:()=>({matches:false})},document:{hidden:false,querySelectorAll:sel=>sel==='[data-rail-tab]'?tabs:sel==='[data-rail-panel]'?panels:[]},positions:{},running:false,dialogWasRunning:false,dialogOnClose:null,save:()=>{},toast:()=>{},activity:()=> 'Pratique',actionIcon:{practice:'♫',rest:'☾',compose:'✎',talk:'☕'},avatar:I.portrait,showPerson:id=>ctx.openedPerson=id,setRunning:v=>ctx.running=v&&!W.blocked(ctx.state)};
ctx.render=()=>{ctx.window.MaisonRailUI?.render();ctx.window.MaisonTourUI?.render();ctx.window.MaisonWeeksUI?.render();};vm.createContext(ctx);
const app=fs.readFileSync('dist/app.js','utf8');vm.runInContext(app.split('\n').find(l=>l.startsWith('function openDialog(')),ctx);vm.runInContext(app.split('\n').find(l=>l.startsWith('function closeDialog(')),ctx);vm.runInContext(app.split('\n').find(l=>l.startsWith("$('#closeDialog').onclick")),ctx);
function run(file){vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),ctx);}
function place(){ctx.positions={};for(const p of ctx.state.people){const [x,y]=H.position(ctx.state,p);ctx.positions[p.id]={x,y,room:p.room,queue:[],el:new Element(p.id)};}}
place();run('rail-ui.js');run('tour-ui.js');run('weeks-ui.js');
assert.equal(tabs[0].attributes['aria-selected'],'true');assert.equal(panels[0].hidden,false);assert(panels[1].hidden&&panels[2].hidden);
tabs[2].onclick();assert(!panels[2].hidden);assert(panels[0].hidden&&panels[1].hidden);assert.match(panels[2].innerHTML,/Semaine 1/);for(const m of [1,2,3])assert(panels[2].innerHTML.includes('<h3>Mois '+m+'</h3>'));assert.match(panels[2].innerHTML,/S12/);assert.match(panels[2].innerHTML,/PROCHAIN SPECTACLE/);assert.match(panels[2].innerHTML,/jour\(s\) simulé/);const calendarBefore=panels[2].innerHTML;ctx.window.MaisonRailUI.render();assert.equal(panels[2].innerHTML,calendarBefore);assert(!panels[2].innerHTML.includes('<h3>Mois 4</h3>'));
tabs[2].onkeydown({key:'ArrowLeft',preventDefault(){}});assert.equal(tabs[1].attributes['aria-selected'],'true');assert(tabs[1].focused);const people=panels[1].querySelectorAll('[data-open-person]');assert.equal(people.length,6);people[1].onclick();assert.equal(ctx.openedPerson,'max');
console.log('PASS onglets exclusifs, navigation clavier, semaine actuelle + deux mois suivants et ouverture des fiches.');

ctx.state.tick=7*144;ctx.state.calendar.nextAt=7*1440+600;T.ensureDue(ctx.state);place();ctx.running=true;tabs[2].onclick();ctx.render();assert.match(panels[2].innerHTML,/Voir le show/);assert(!$('#dialog').open);assert.equal(ctx.state.tour.active.phase,'preparing');assert(ctx.running);assert(!$('#invite').disabled);
for(let i=0;i<6;i++){S.step(ctx.state,()=>.4);ctx.render();}assert.equal(ctx.state.tour.active.phase,'coffee');assert(ctx.state.people.every(p=>p.room==='kitchen'));assert.match($('#tourBanner').innerHTML,/café ensemble/);assert(ctx.running);
for(let i=0;i<6;i++){S.step(ctx.state,()=>.4);ctx.render();}assert.equal(ctx.state.tour.active.phase,'packing');assert(!$('#dialog').open);assert(!ctx.state.calendar.pending);assert.match($('#tourBanner').innerHTML,/prépare les instruments/);
for(let i=0;i<6;i++){S.step(ctx.state,()=>.4);ctx.render();}assert.equal(ctx.state.tour.active.phase,'departing');assert(!ctx.running);assert(!$('#tourBanner').hidden);assert(!$('#showVan').hidden);assert(ctx.positions.lea.queue.some(([x,y])=>x===H.GARAGE_EXIT[0]&&y===H.GARAGE_EXIT[1]));
const tick=ctx.state.tick;ctx.window.MaisonTourUI.frame(.1);assert.equal(ctx.state.tour.active.phase,'departing');assert(!ctx.state.calendar.pending);
for(let i=0;i<100&&ctx.state.tour.active.phase==='departing';i++)ctx.window.MaisonTourUI.frame(.1);
assert.equal(ctx.state.tour.active.phase,'stage');assert.equal(ctx.state.tick,tick);assert($('#dialog').open);assert($('#performShow'));assert(Object.values(ctx.positions).every(p=>p.el.style.opacity==='0'));assert(!ctx.state.calendar.pending);
$('#performShow').onclick();assert.equal(ctx.state.tour.active.result.outcome,'cancelled');assert.equal(ctx.state.tour.active.phase,'result');$('#returnFromShow').onclick();assert(!ctx.state.calendar.pending);assert.equal(ctx.state.tour.active.phase,'returning');assert.equal(W.minute(ctx.state),1320);assert(!$('#dialog').open);assert(Object.values(ctx.positions).every(p=>p.el.style.opacity==='1'));
// Reload a returning save: characters begin outside and walk back to the garage.
ctx.state=JSON.parse(JSON.stringify(ctx.state));place();run('tour-ui.js');assert.equal(ctx.positions.lea.y,770);assert(ctx.positions.lea.queue.some(([x,y])=>x===H.GARAGE_EXIT[0]&&y===H.GARAGE_EXIT[1]));ctx.window.MaisonTourUI.frame(.1);assert(!ctx.state.calendar.pending);
for(let i=0;i<100&&ctx.state.tour.active.phase==='returning';i++)ctx.window.MaisonTourUI.frame(.1);
assert.equal(ctx.state.tour.active.phase,'unpacking');assert(!ctx.state.calendar.pending);assert(!$('#dialog').open);assert(ctx.running);assert.match($('#tourBanner').innerHTML,/range les instruments/);
for(let i=0;i<3;i++){S.step(ctx.state,()=>.4);ctx.render();}assert(!T.busy(ctx.state));assert.equal(ctx.state.tour.completed.length,1);assert.equal(ctx.state.calendar.pending,null);assert(!$('#dialog').open);assert(ctx.running);assert($('#showVan').hidden);
console.log('PASS retour à 22 h, rangement puis soirée libre sans choix supplémentaire.');
// The real music UI filters ready songs out of Adopted, exposes the new capacities,
// and the sidebar opens the actual five-card deck for the selected musician.
for(const id of ['storyBanner','songMetrics','songTotals','songCards','sessionStatus'])els.set(id,new Element(id));
const filters=['projects','trial','adopted','ready'].map(songFilter=>{const el=new Element(songFilter);el.dataset.songFilter=songFilter;return el;});const priorQuery=ctx.document.querySelectorAll;ctx.document.querySelectorAll=sel=>sel==='[data-song-filter]'?filters:priorQuery(sel);
ctx.state.music.songs=[];const preparing=M.newSong(ctx.state,['lea'],'Jazz',()=>.5,{progress:100,title:'Encore au garage'}),ready=M.newSong(ctx.state,['max'],'Punk',()=>.1,{progress:100,title:'Prête au concert'});Object.assign(preparing,{adopted:true,preparation:40});Object.assign(ready,{adopted:true,preparation:100});run('music-ui.js');filters.find(x=>x.dataset.songFilter==='adopted').onclick();assert($('#songCards').innerHTML.includes(preparing.title));assert(!$('#songCards').innerHTML.includes(ready.title));filters.find(x=>x.dataset.songFilter==='ready').onclick();assert($('#songCards').innerHTML.includes(ready.title));assert(!$('#songCards').innerHTML.includes(preparing.title));assert($('#songCards').innerHTML.includes('énergie/tour'));assert($('#songCards').innerHTML.includes('Niv.'));
ctx.window.MaisonMusicUI.showSong(ready.id);assert($('#dialogContent').innerHTML.includes('énergie/tour'));assert($('#dialogContent').innerHTML.includes('Budget'));$('#dialog').close();
tabs[1].onclick();assert.equal(panels[1].querySelectorAll('[data-open-deck]').length,0);assert.equal(panels[1].querySelectorAll('[data-open-person]').length,6);assert(!panels[1].innerHTML.includes('Ses cartes'));assert(panels[1].innerHTML.includes('Moral'));

for(const id of ['residents','count','roster',...Array.from({length:6},(_,i)=>'bedroomNames'+(i+1)),...Array.from({length:6},(_,i)=>'secondBed'+(i+1))])els.set(id,new Element(id));ctx.selected='lea';ctx.bindPerson=()=>{};vm.runInContext(app.split('\n').find(l=>l.startsWith('function renderRoster(')),ctx);vm.runInContext('renderRoster()',ctx);assert.equal(($('#roster').innerHTML.match(/♥ Moral/g)||[]).length,6);assert.equal(($('#roster').innerHTML.match(/ϟ Énergie/g)||[]).length,6);
R.change(ctx.state,ctx.state.people[0],5,'Une bonne idée à partager');const profile=I.moraleDetails(ctx.state.people[0]);for(const range of ['1–20','21–40','41–60','61–80','81–100'])assert(profile.includes(range));assert(profile.includes('Une bonne idée à partager'));assert(profile.includes('restent à définir'));
console.log('PASS chansons adoptées/prêtes exclusives, capacité et qualité dans les cartes/fiches, accès aux fiches sans raccourci redondant, énergie+moral sous les six musiciens et cinq paliers expliqués.');

// Rejected song actions are available on its card; scrap removes it from every song list.
const originalRender=ctx.render;ctx.render=()=>{originalRender();ctx.window.MaisonMusicUI.render();};ctx.state=S.create();ctx.state.music.songs=[];const rejected=M.newSong(ctx.state,['lea'],'Indie',()=>0,{progress:80,title:'À laisser partir'});rejected.voteCount=1;rejected.votes=[{id:'lea',yes:false,reason:'Pas encore.'}];ctx.window.MaisonMusicUI.resetView();ctx.window.MaisonMusicUI.render();assert($('#songCards').querySelectorAll('[data-rework]').length===1);const scrap=$('#songCards').querySelectorAll('[data-scrap]')[0];assert(scrap);scrap.onclick();assert($('#dialogContent').innerHTML.includes('Scrapper la toune ?'));$('#confirmScrap').onclick();assert(!M.song(ctx.state,rejected.id));assert(!$('#songCards').innerHTML.includes(rejected.title));
console.log('PASS options de réécriture et scrap sur la chanson, confirmation puis retrait du répertoire.');
// Right-side lists expose every record without page controls, preserving details.
ctx.window.MaisonPages=require('../dist/viewport.js');ctx.state=S.create(6);tabs[1].onclick();
let buttons=panels[1].querySelectorAll('[data-open-person]');assert.equal(buttons.length,6);
assert(!panels[1].innerHTML.includes('data-list-page'));
buttons[5].onclick();assert.equal(ctx.openedPerson,ctx.state.people[5].id);
ctx.state.music.songs=[];
for(let i=0;i<7;i++){const x=M.newSong(ctx.state,['lea'],'Jazz',()=>.5,{progress:100});x.adopted=true;x.preparation=100;}
filters.find(b=>b.dataset.songFilter==='ready').onclick();
$('#songCards').scrollTop=150;ctx.window.MaisonMusicUI.render();assert.equal($('#songCards').scrollTop,150);
buttons=$('#songCards').querySelectorAll('[data-details]');assert.equal(buttons.length,7);
assert(!$('#songCards').innerHTML.includes('data-list-page'));
buttons[6].onclick();assert($('#dialog').open);assert($('#dialogContent').innerHTML.includes(M.song(ctx.state,buttons[6].dataset.details).title));$('#dialog').close();
console.log('PASS scrollable right panels: all six musicians and seven songs present, scroll position preserved, detail actions functional.');

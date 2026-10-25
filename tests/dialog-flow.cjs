// Executes the production dialog controller and feedback UI against a small DOM adapter.
// This checks pause/queue behavior; it is not browser layout verification.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js'),I=require('../dist/identity.js'),W=require('../dist/weeks.js'),H=require('../dist/house.js'),T=require('../dist/shows.js');
require('../dist/activities.js');const GA=require('../dist/group-activity.js');
const s=S.create(),els=new Map();let noticeTimer=null,noticeDelay=0;
class Element{constructor(id){this.id=id;this.open=false;this.handlers={};this.hidden=false;this._html='';this.onclick=null;this.style={};}set innerHTML(v){this._html=v;for(const [,id] of v.matchAll(/id="([\w-]+)"/g))els.set(id,new Element(id));}get innerHTML(){return this._html;}querySelectorAll(){return [];}addEventListener(type,fn){this.handlers[type]=fn;}showModal(){this.open=true;}close(){this.open=false;this.handlers.close?.();}}
for(const id of ['dialog','dialogContent','closeDialog','decisionTracker','groupMoments','influenceNotice','groupActivities'])els.set(id,new Element(id));
const $=sel=>els.get(sel.slice(1))||null;
const ctx={saved:true,MaisonGroupActivity:GA,setTimeout:(fn,ms)=>{noticeTimer=fn;noticeDelay=ms;return 1;},clearTimeout:()=>{noticeTimer=null;},state:s,S,M,D,I,W,H,T,$,window:{},document:{hidden:false,querySelectorAll:()=>[]},running:true,dialogWasRunning:false,dialogOnClose:null,positions:{},accumulator:0,performance:{now:()=>0},requestAnimationFrame:()=>{},speed:6,clock:()=> '10:00',day:()=>1,save:()=>{},avatar:()=>'',setRunning:v=>{ctx.running=v;},render:()=>ctx.window.MaisonDecisionsUI.render()};vm.createContext(ctx);
const app=fs.readFileSync('dist/app.js','utf8');vm.runInContext(app.split('\n').find(l=>l.startsWith('function openDialog(')),ctx);vm.runInContext(app.split('\n').find(l=>l.startsWith('function closeDialog(')),ctx);vm.runInContext(app.split('\n').find(l=>l.startsWith("$('#closeDialog').onclick")),ctx);vm.runInContext(fs.readFileSync('dist/house-flow-ui.js','utf8'),ctx);vm.runInContext(fs.readFileSync('dist/decisions-ui.js','utf8'),ctx);
D.notice(s,{kind:'adoption',title:'Adoptée',body:'Deux voix',votes:[{id:'lea',yes:true,reason:'Oui'},{id:'max',yes:true,reason:'Oui'},{id:'ines',yes:false,reason:'Non'}],consequences:['Au répertoire.']});ctx.window.MaisonDecisionsUI.render();assert($ ('#dialog').open);assert(!ctx.running);assert($ ('#dialogContent').innerHTML.includes('Au répertoire.'));assert($ ('#dialogContent').innerHTML.includes('Défavorable'));$ ('#resumeOutcome').onclick();assert(ctx.running);assert(s.music.moments[0].seen);assert(!$ ('#dialog').open);
// The actual rework dialog must expose signed decreases, increases and a zero level gain.
s.tick+=2;D.notice(s,{kind:'rework',title:'Seconde version',body:'Même niveau',rework:{before:{level:4,turns:3,energyPerTurn:5},after:{level:4,turns:4,energyPerTurn:4}},consequences:['Une seule chance.']});ctx.window.MaisonDecisionsUI.render();assert.match($('#dialogContent').innerHTML,/rework-comparison/);assert.match($('#dialogContent').innerHTML,/>\+0</);assert.match($('#dialogContent').innerHTML,/>\+1</);assert.match($('#dialogContent').innerHTML,/>-1</);$('#resumeOutcome').onclick();assert(s.music.moments.at(-1).seen);
// No takeover of an existing choice dialog.
vm.runInContext("openDialog('<h2>Mon choix de carte</h2>')",ctx);D.notice(s,{kind:'influence',title:'Autre moment',body:'Nouveau goût',consequences:['Jazz']});ctx.window.MaisonDecisionsUI.render();assert($ ('#dialogContent').innerHTML.includes('Mon choix de carte'));$ ('#dialog').close();assert(!$ ('#dialog').open);s.tick+=2;ctx.window.MaisonDecisionsUI.render();assert(!$ ('#dialog').open);assert(ctx.running);assert.match($('#influenceNotice').innerHTML,/Autre moment/);assert.equal($('#influenceNotice').hidden,false);assert.equal(noticeDelay,5000);assert(s.music.moments.every(m=>m.seen));D.notice(s,{kind:'influence',title:'Une seconde influence',body:'Autre découverte'});ctx.window.MaisonDecisionsUI.render();assert.match($('#influenceNotice').innerHTML,/Autre moment/);noticeTimer();assert.match($('#influenceNotice').innerHTML,/Une seconde influence/);assert(ctx.running);assert.equal(noticeDelay,5000);noticeTimer();assert($('#influenceNotice').hidden);ctx.window.MaisonDecisionsUI.render();assert($('#influenceNotice').hidden);
// Production animation loop must stop advancing ticks when a notice opens,
// even if the accumulated high-speed time contains multiple steps.
ctx.S={...S,step:state=>{state.tick++;D.notice(state,{kind:'ready',title:'Prête',body:'Fini',consequences:['5 tours']});}};s.tick+=2;ctx.running=true;ctx.accumulator=5;vm.runInContext(app.split('\n').find(l=>l.startsWith('let last=performance.now();function frame(')),ctx);const before=s.tick;vm.runInContext('frame(100)',ctx);assert.equal(s.tick,before+1);assert(!ctx.running);assert($ ('#dialog').open);
console.log('PASS contrôleur UI : popup avec votes, pause automatique, acquittement, reprise et fermeture, aucune interruption d’un choix ouvert, arrêt immédiat du temps accéléré.');
// Song identity and individual refusal explanations use the same actual musician.
const song=M.newSong(s,['lea'],'Indie',()=>0,{progress:80});
assert(I.context(s,{songId:song.id}).includes(song.title));
assert(I.context(s,{songId:song.id}).includes('Léa'));
assert(I.context(s,{type:'jam',status:'waiting'}).includes('Inès'));
const denied=I.response(s,{id:'max',yes:false,reason:'Trop fatigué pour répéter.'});
assert(denied.includes('musician-portrait'));assert(denied.includes('Max'));assert(denied.includes('Pourquoi :'));assert(denied.includes('Trop fatigué pour répéter.'));
// The new-game button delegates to the transactional trio wizard (tested separately).
ctx.S=S;ctx.window.MaisonDecisionsUI=null;$('#dialog').close();
els.set('characters',new Element('characters'));ctx.render=()=>{};
let wizardOpened=0;ctx.window.MaisonStartUI={newGame:()=>wizardOpened++};
vm.runInContext(app.split('\n').find(l=>l.startsWith('function newGameDialog(')),ctx);
vm.runInContext('newGameDialog()',ctx);assert.equal(wizardOpened,1);
console.log('PASS identités chanson/musiciens, raison associée au refus et accès au nouvel assistant de création.');
// Scheduled-choice UI uses the same production dialog controller.
Element.prototype.classList={toggle(){}};
Element.prototype.querySelectorAll=function(selector){if(selector!=='[data-week-choice]')return [];return [...this._html.matchAll(/data-week-choice="([\w-]+)"/g)].map(([,id])=>{let el=els.get('choice-'+id);if(!el){el={dataset:{weekChoice:id}};els.set('choice-'+id,el);}return el;});};
for(const id of ['weekPanel','map','eventHint','pause','houseState','runningDot']){const el=new Element(id);el.setAttribute=()=>{};els.set(id,el);}
ctx.state=S.create();ctx.positions={};ctx.toast=()=>{};ctx.day=t=>W.week(ctx.state,t);ctx.clock=t=>String(Math.floor(W.total(ctx.state,t)/60)%24)+':00';
vm.runInContext(app.split('\n').find(l=>l.startsWith('function setRunning(')),ctx);
vm.runInContext(fs.readFileSync('dist/weeks-ui.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('dist/night-ui.js','utf8'),ctx);
ctx.render=()=>ctx.window.MaisonWeeksUI.render();
for(let i=0;i<12;i++)S.step(ctx.state,()=>.4);ctx.render();assert($ ('#dialog').open);assert($ ('#dialogContent').innerHTML.includes('10 h'));
$ ('#dialog').close();assert(!ctx.running);assert(ctx.state.calendar.pending);vm.runInContext('setRunning(true)',ctx);assert(!ctx.running);$ ('#openWeek').onclick();
els.get('choice-write').onclick();assert(!ctx.state.calendar.pending);assert($ ('#dialogContent').innerHTML.includes('Leur réponse'));$ ('#continueWeek').onclick();assert(ctx.running);
for(let i=0;i<42;i++)S.step(ctx.state,()=>.4);ctx.render();els.get('choice-quiet').onclick();$ ('#continueWeek').onclick();
for(let i=0;i<42;i++)S.step(ctx.state,()=>.4);ctx.render();assert($ ('#dialogContent').innerHTML.includes('Ce qui s’est passé'));els.get('choice-sleep').onclick();assert(!$ ('#dialog').open);assert(ctx.running);assert.equal(ctx.state.tick,96);assert(ctx.state.people.every(p=>p.room===p.bedroomId));assert.equal(ctx.window.MaisonNightUI.pace(.1).rate,0);assert.equal(ctx.window.MaisonNightUI.pace(1).rate,32);for(let i=0;i<48;i++)S.step(ctx.state,()=>.4);ctx.render();assert.equal(ctx.state.tick,144);assert(ctx.state.calendar.wake);assert($ ('#dialogContent').innerHTML.includes('La maison rouvre les yeux'));assert($ ('#dialogContent').innerHTML.includes('8 h de sommeil'));$ ('#wakeContinue').onclick();assert(!ctx.state.calendar.wake);assert(ctx.state.calendar.lastWake);assert(ctx.running);
console.log('PASS UI calendrier : fermeture sans avancer, réouverture, cartes 10/17/0 h, coucher visible, nuit accélérée, bilan à 8 h et reprise.');
// Writing is committed once, even for a full house or repeated activation.
for(const count of [3,6])for(const accept of [true,false]){
 ctx.state=S.create(count);ctx.window.MaisonWeeksUI.resetView();
 for(let i=0;i<12;i++)S.step(ctx.state,()=>.4);ctx.render();
 assert.match($('#dialogContent').innerHTML,/data-dialog-layout="single"/);
 assert.equal($('#dialogContent').querySelectorAll('[data-week-choice]').length,3);
 const choose=els.get('choice-write').onclick,originalW=ctx.W;
 // Keep one consenting musician busy to verify the waiting feedback survives compacting.
 ctx.state.people[0].sessionUntil=ctx.state.tick+6;
 ctx.W={...W,choose:(state,id)=>W.choose(state,id,()=>accept?0:1)};
 const history=ctx.state.calendar.history.length;
 choose();choose();ctx.W=originalW;ctx.render();
 assert.equal(ctx.state.calendar.pending,null);
 assert.equal(ctx.state.calendar.history.length,history+1);
 assert.equal(ctx.state.calendar.history[0][accept?'accepted':'refused'].length,count);
 assert.match($('#dialogContent').innerHTML,/CHOIX ENREGISTRÉ/);
 assert.match($('#dialogContent').innerHTML,/data-dialog-layout="single"/);
 assert.equal($('#dialogContent').querySelectorAll('[data-week-choice]').length,0);
 assert.equal(($('#dialogContent').innerHTML.match(/class="week-response /g)||[]).length,count);
 if(accept)assert.match($('#dialogContent').innerHTML,/En attente/);
 else assert.match($('#dialogContent').innerHTML,/Refuse/);
 $('#continueWeek').onclick();ctx.render();assert(ctx.running);assert(!$('#dialog').open);
}
console.log('PASS Écrire : 3/6 musiciens, acceptation/refus, attente visible, choix unique, confirmation sur une page et reprise sans retour au menu.');
// Browser close events are asynchronous. Acknowledge before that event and never
// let a stale close event consume a newly opened dialog's callback.
ctx.state=S.create(6);ctx.state.tick=20;ctx.state.calendar.nextAt=1020;
ctx.render=()=>ctx.window.MaisonDecisionsUI.render();
vm.runInContext(fs.readFileSync('dist/decisions-ui.js','utf8'),ctx);
const syncClose=Element.prototype.close,closeEvents=[];
Element.prototype.close=function(){this.open=false;closeEvents.push(()=>this.handlers.close?.());};
const firstSong=ctx.state.music.songs[0];firstSong.progress=99;
ctx.state.people[0].action='compose';M.finish(ctx.state,ctx.state.people[0],()=>.5);ctx.render();
assert(!$('#dialog').open);assert(D.isTransient(ctx.state.music.moments.find(m=>m.kind==='composition')));D.acknowledge(ctx.state,ctx.state.music.moments.find(m=>m.kind==='composition').id);D.notice(ctx.state,{kind:'ready',title:'Chanson prête'});ctx.render();
const notice=ctx.state.music.moments.find(m=>m.kind==='ready');
$('#resumeOutcome').onclick();assert(notice.seen);assert(!$('#dialog').open);assert(ctx.running);
ctx.render();assert(!$('#dialog').open);
let freshClosed=0;ctx.freshClose=()=>freshClosed++;
vm.runInContext("openDialog('<h2>Une autre fiche</h2>',freshClose)",ctx);
closeEvents.shift()();assert.equal(freshClosed,0);assert($('#dialog').open);assert(!ctx.running);
vm.runInContext('closeDialog(true)',ctx);assert.equal(freshClosed,1);closeEvents.shift()();assert.equal(freshClosed,1);assert(ctx.running);
// Real song proposals in each outcome state can be dismissed without restarting them.
for(const kind of ['running','refused','waiting','blocked']){
 ctx.state=S.create(6);ctx.state.tick=20;ctx.state.calendar.nextAt=1020;
 const song=ctx.state.music.songs[0];song.progress=kind==='waiting'?50:100;
 if(kind==='blocked')song.adopted=true;
 const result=D.submit(ctx.state,{type:'trial',songId:song.id},()=>kind==='refused'?1:0);
 assert.equal(result.status,kind);ctx.window.MaisonDecisionsUI.showOutcome(result);
 const count=ctx.state.music.orders.length;
 $('#resumeOutcome').onclick();assert(!$('#dialog').open);assert(ctx.running);
 closeEvents.shift()();ctx.render();assert(!$('#dialog').open);assert.equal(ctx.state.music.orders.length,count);
}
// A queued second moment waits; it remains available and is acknowledged only once.
ctx.state=S.create();ctx.state.tick=20;ctx.state.calendar.nextAt=1020;
D.notice(ctx.state,{kind:'ready',title:'Première chanson',consequences:[]});
D.notice(ctx.state,{kind:'ready',title:'Autre chanson prête',consequences:[]});ctx.render();
$('#resumeOutcome').onclick();closeEvents.shift()();ctx.render();assert(!$('#dialog').open);assert(ctx.running);
S.step(ctx.state,()=>.4);ctx.render();assert(!$('#dialog').open);
S.step(ctx.state,()=>.4);ctx.render();assert($('#dialog').open);assert.match($('#dialogContent').innerHTML,/Autre chanson prête/);
$('#resumeOutcome').onclick();closeEvents.shift()();assert(ctx.state.music.moments.every(m=>m.seen));
Element.prototype.close=syncClose;
console.log('PASS fermeture native différée : naissance de chanson, proposition acceptée/refusée/en attente/bloquée, protection du nouveau menu et notifications espacées sans boucle.');
// Replacing a moment with another sheet commits its acknowledgement once.
ctx.state=S.create();ctx.state.tick=20;ctx.state.calendar.nextAt=1020;ctx.render=()=>ctx.window.MaisonDecisionsUI.render();
const replaced=D.notice(ctx.state,{kind:'ready',songId:ctx.state.music.songs[0].id,title:'Moment remplacé'});ctx.render();assert($('#dialog').open);
vm.runInContext("openDialog('<h2>Fiche consultée</h2>')",ctx);assert(replaced.seen);vm.runInContext('closeDialog(true)',ctx);ctx.state.tick+=3;ctx.render();assert(!$('#dialog').open);assert(ctx.running);
// A manually inspected deferred result does not then reopen as an automatic moment.
const orderMoment=D.notice(ctx.state,{kind:'order',orderId:'deferred-manual',title:'Résultat en attente'});
ctx.window.MaisonDecisionsUI.showOutcome({id:'deferred-manual',type:'jam',title:'Jam',status:'applied',reason:'Invitation envoyée.',accepted:[],refused:[]});$('#resumeOutcome').onclick();assert(orderMoment.seen);ctx.state.tick+=3;ctx.render();assert(!$('#dialog').open);assert(ctx.running);
console.log('PASS remplacement de fenêtre et résultat différé consulté manuellement : aucun deuxième popup automatique.');
// Full personal sheet opens on double activation and retains functional tabs/actions.
Element.prototype.querySelectorAll=function(selector){const match=selector.match(/^\[([\w-]+)\]$/);if(!match)return [];const attr=match[1],key=attr.replace(/^data-/,'').replace(/-([a-z])/g,(_,c)=>c.toUpperCase());return [...this._html.matchAll(new RegExp(attr+'="([^\"]+)"','g'))].map(([,value])=>{const id=attr+':'+value;let el=els.get(id);if(!el){el=new Element(id);el.dataset={[key]:value};el.setAttribute=()=>{};els.set(id,el);}return el;});};
els.set('openSelected',new Element('openSelected'));ctx.rooms=H.rooms;ctx.actionIcon={compose:'✎',rest:'☾',practice:'♫',jam:'♪',party:'✦',talk:'☕'};ctx.selected='lea';ctx.performance.now=()=>1000;ctx.state=S.create();ctx.render=()=>{};
vm.runInContext(app.slice(app.indexOf('let lastPersonClick='),app.indexOf('function renderLogs(')),ctx);
vm.runInContext("personClick('lea')",ctx);assert(!$ ('#dialog').open);ctx.performance.now=()=>1200;vm.runInContext("personClick('lea')",ctx);assert($ ('#dialog').open);assert($ ('#dialogContent').innerHTML.includes('Sa personnalité'));assert($ ('#dialogContent').innerHTML.includes('Chambre 1'));assert($ ('#dialogContent').innerHTML.includes('Ses compositions'));assert($ ('#dialogContent').innerHTML.includes('Son paquet'));
$('#dialogContent').querySelectorAll('[data-person-tab]').find(x=>x.dataset.personTab==='music').onclick();assert.equal($('#dialogContent').querySelectorAll('[data-person-panel]').find(x=>x.dataset.personPanel==='music').hidden,false);assert.equal($('#dialogContent').querySelectorAll('[data-person-panel]').find(x=>x.dataset.personPanel==='portrait').hidden,true);
assert(!$('#dialogContent').innerHTML.includes('personSuggest'));assert(!$('#dialogContent').innerHTML.includes('personCards'));assert(!$('#dialogContent').innerHTML.includes('Lui souffler'));assert.equal(($('#dialogContent').innerHTML.match(/class="sheet-deck"/g)||[]).length,1);

const musicUI=fs.readFileSync('dist/music-ui.js','utf8');ctx.esc=I.esc;vm.runInContext(musicUI.split('\n').find(l=>l.startsWith('function status(')),ctx);vm.runInContext(musicUI.split('\n').find(l=>l.startsWith('function songCard(')),ctx);const card=ctx.state.music.songs[0];ctx.card=card;assert(vm.runInContext('songCard(card)',ctx).includes('status-writing'));card.progress=80;assert(vm.runInContext('songCard(card)',ctx).includes('status-trial'));card.adopted=true;assert(vm.runInContext('songCard(card)',ctx).includes('status-adopted'));card.progress=100;card.preparation=100;card.turns=4;assert(vm.runInContext('songCard(card)',ctx).includes('status-ready'));
console.log('PASS fiche détaillée au double-clic, onglets, paquet conservé sans suggestions directes et statuts compacts du répertoire.');
// Deferred trial startup uses the transparent banner; only its later decision pauses.
vm.runInContext('closeDialog(true)',ctx);
ctx.state=S.create();ctx.state.tick=20;ctx.state.calendar.nextAt=1020;ctx.running=true;
const deferredSong=ctx.state.music.songs[0];deferredSong.progress=50;
const deferredTrial=D.submit(ctx.state,{type:'trial',songId:deferredSong.id},()=>0);
assert.equal(deferredTrial.status,'waiting');deferredSong.progress=80;
D.step(ctx.state,()=>0);assert.equal(deferredTrial.status,'running');
const startNotice=ctx.state.music.moments.find(m=>m.orderId===deferredTrial.id);
assert(D.isTransient(startNotice));ctx.window.MaisonDecisionsUI.render();
assert(!$('#dialog').open);assert(ctx.running);assert.equal(noticeDelay,5000);
assert.match($('#influenceNotice').innerHTML,/Ta proposition démarre/);
assert($('#influenceNotice').innerHTML.includes(deferredSong.title));
assert($('#influenceNotice').innerHTML.includes(ctx.state.people[0].name));
assert(startNotice.seen);noticeTimer();ctx.window.MaisonDecisionsUI.render();
assert($('#influenceNotice').hidden);assert(!$('#dialog').open);
// Existing saves with the old title are classified the same way.
D.notice(ctx.state,{kind:'order',orderId:'legacy-start',title:'Ta proposition commence',body:'Ancien démarrage'});
ctx.window.MaisonDecisionsUI.render();assert(!$('#dialog').open);assert(ctx.running);
assert.match($('#influenceNotice').innerHTML,/Ancien démarrage/);noticeTimer();
D.notice(ctx.state,{kind:'rejection',title:'Le groupe refuse la chanson',body:'Décision importante',consequences:[]});
ctx.state.tick+=3;ctx.window.MaisonDecisionsUI.render();assert($('#dialog').open);assert(!ctx.running);
$('#resumeOutcome').onclick();
console.log('PASS transparent five-second startup, song/participants, no pause or replay, legacy save and important decisions retained.');
// Dismiss notices without pausing; an old timeout must not close the next notice.
ctx.state=S.create();ctx.state.tick=20;ctx.state.calendar.nextAt=1020;ctx.running=true;
D.notice(ctx.state,{kind:'influence',title:'À fermer',body:'Première notification'});
D.notice(ctx.state,{kind:'influence',title:'La suivante',body:'Deuxième notification'});
ctx.window.MaisonDecisionsUI.render();const staleTimer=noticeTimer;
assert.match($('#influenceNotice').innerHTML,/aria-label="Fermer la notification"/);
$('#closeInfluenceNotice').onclick();assert(ctx.running);assert(!$('#dialog').open);
assert.match($('#influenceNotice').innerHTML,/La suivante/);assert(!$('#influenceNotice').hidden);
staleTimer();assert(!$('#influenceNotice').hidden);assert.match($('#influenceNotice').innerHTML,/La suivante/);
$('#closeInfluenceNotice').onclick();assert($('#influenceNotice').hidden);assert.equal(noticeTimer,null);
ctx.window.MaisonDecisionsUI.render();assert($('#influenceNotice').hidden);assert(ctx.running);
assert(ctx.state.music.moments.every(m=>m.seen));
console.log('PASS close button, no pause, cleared timer, queued notices, stale timer guard and no replay.');

// Functional DOM adapter for the real imported UI, not a browser/WebGL test.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const S=require('../dist/sim.js'),M=require('../dist/music.js');require('../dist/decisions.js');require('../dist/house.js');const W=require('../dist/weeks.js'),T=require('../dist/shows.js'),B=require('../dist/bandlive.js'),A=require('../dist/show-adapter.js');require('../dist/morale.js');
function venue(){const s=S.create(6);s.music.songs=[];const x=M.newSong(s,['lea'],'Indie',()=>0,{progress:100,title:'La chanson de la maison'});Object.assign(x,{adopted:true,preparation:100,turns:6,energyPerTurn:5});s.people[0].deck.push('guitar-new1');s.tick=7*144+18;T.ensureDue(s);T.arriveAtVenue(s);T.startLive(s);return s;}
class Element{
 constructor(id='',isRoot=false){this.id=id;this.isRoot=isRoot;this.children=new Map();this.dataset={};this.style={setProperty(){},removeProperty(){}};this.handlers={};this.attributes={};this.hidden=false;this.innerHTML='';this.classes=new Set();this.classList={add:x=>this.classes.add(x),remove:x=>this.classes.delete(x),contains:x=>this.classes.has(x),toggle:(x,b)=>b?this.classes.add(x):this.classes.delete(x)};this.contentWindow={};}
 setAttribute(k,v){this.attributes[k]=v;}removeAttribute(k){delete this.attributes[k];}append(){}replaceChildren(){}insertAdjacentHTML(){}remove(){this.removed=true;}focus(){}scrollIntoView(){}getBoundingClientRect(){return {top:0,left:0,width:800,height:600,right:800,bottom:600};}
 querySelector(sel){if(this.isRoot)return this.geometry&&sel==='.bl-world'?this.geometry:null;if(!this.children.has(sel))this.children.set(sel,new Element(sel));return this.children.get(sel);}
 querySelectorAll(){return [];}closest(){return null;}contains(){return false;}matches(){return false;}
 addEventListener(type,fn){(this.handlers[type]??=[]).push(fn);}
 async emit(type,event){for(const fn of this.handlers[type]||[])await fn(event);}
}
(async()=>{
 let s=venue(),projection=A.world(s),updates=0,returns=0,paused=0;
 const root=new Element('bandlive-view',true),nav=new Element('bandlive-nav'),toggle=new Element('bandlive-enabled'),body=new Element('body'),nodes={'#bandlive-view':root,'#bandlive-nav':nav,'#bandlive-enabled':toggle};
 global.document={body,querySelector:sel=>nodes[sel]||null,createElement:tag=>new Element(tag),createElementNS:()=>new Element(),addEventListener(){},activeElement:null};global.window={addEventListener(){}};global.localStorage={getItem:()=>null,setItem(){}};global.ResizeObserver=class{observe(){}};global.innerHeight=900;global.innerWidth=1400;global.CSS={escape:x=>x};global.matchMedia=()=>({matches:true});let clock=0,frames=[];global.performance={now:()=>clock};global.requestAnimationFrame=fn=>{frames.push(fn);return frames.length;};global.cancelAnimationFrame=()=>{};
 const {createBandLiveModule}=await import('../dist/show-module/bandlive-view.mjs?v=0.8.15');
 const live=createBandLiveModule({getWorld:()=>projection,onOpen(){},onReturn(){returns++;assert(T.beginReturn(s));},onDisable(){},canStart:()=>true,notify:message=>{throw Error(message);},getReducedEffects:()=>true,getPlan:()=>({groupId:'maison'}),onConcertUpdate(){root.geometry=null;updates++;A.update(s,projection);},onConcertCancel(){paused++;}});
 live.refresh();assert.match(root.innerHTML,/bl-minuit/);assert.match(root.innerHTML,/bl-resource-dock/);assert.match(root.innerHTML,/La chanson de la maison/);assert.match(root.innerHTML,/5 énergie\/tour/);assert.equal(projection.performance.bandLive.game,s.tour.active.live);assert.equal(projection.people.length,6);assert.equal(projection.performance.bandLive.game.cards.length,19);
 const click=async(id,dataset={})=>{const target={id,dataset,closest:sel=>sel==='[data-bl-style]'?null:target};await root.emit('click',{target});};
 await click('',{blSong:s.tour.active.songs[0].id});assert.equal(s.tour.active.live.energy,5);assert.match(root.innerHTML,/aria-valuemax="5"/);assert.match(root.innerHTML,/bl-hand/);assert.match(root.innerHTML,/draggable="true"/);assert.match(root.innerHTML,/bl-end/);
 const g=s.tour.active.live,note=g.hand.find(id=>B.cardById(g,id).kind==='note');await click('',{blCard:note});root.geometry=new Element();await click('',{blTarget:g.fans[0].id});assert.equal(g.played,1);const actor=g.actors.find(a=>a.id===B.cardById(g,note).actorId);assert.equal(s.people.find(p=>p.id===actor.id).energy,actor.needs.energy);clock+=10000;for(const fn of frames.splice(0))fn();
 const saved=JSON.stringify(g);await click('bl-cancel');assert.equal(paused,1);assert.equal(JSON.stringify(g),saved);live.refresh();assert.equal(JSON.stringify(g),saved);
 await click('bl-end');clock+=10000;for(const fn of frames.splice(0))fn();await click('bl-simulate');assert.equal(s.tour.active.phase,'result');assert.match(root.innerHTML,/BILAN DU SPECTACLE/);assert.match(root.innerHTML,/Retour à la maison · 22 h/);assert.equal(projection.performance.result.score,s.tour.active.result.score);const energy=s.people.map(p=>p.energy);const result=JSON.stringify(s.tour.active.result);A.update(s,projection);assert.equal(JSON.stringify(s.tour.active.result),result);await click('bl-return');assert.equal(returns,1);assert.equal(s.tour.active.phase,'returning');assert.deepEqual(s.people.map(p=>p.energy),energy);assert(updates>4);live.leave();
 console.log('PASS original Simon UI handlers: song/cards/targets, personal energy, pause, end turn, simulation, report and return through host callbacks.');
 // Cooperative controls submit commands without mutating the server projection or solo storage.
 const coopRoot=new Element('coop-view',true);nodes['#bandlive-view']=coopRoot;
 const coopState=venue();B.chooseSong(coopState.tour.active.live,coopState.tour.active.songs[0].id);coopState.tour.active.live.cooperative=true;
 const coopWorld=A.world(coopState),commands=[],snapshot=JSON.stringify(coopWorld.performance.bandLive.game);
 global.localStorage={getItem(){throw Error('Coop read solo storage');},setItem(){throw Error('Coop wrote solo storage');}};
 const coopUI=createBandLiveModule({getWorld:()=>coopWorld,onOpen(){},onReturn(){},onDisable(){},canStart:()=>true,notify:m=>{throw Error(m);},onCommand:c=>commands.push(c)});
 coopUI.refresh();assert.match(coopRoot.innerHTML,/Ton passage · coop/);assert(!coopRoot.innerHTML.includes('id="bl-simulate"'));
 const coopClick=async(id,dataset={})=>{const target={id,dataset,closest:sel=>sel==='[data-bl-style]'?null:target};await coopRoot.emit('click',{target});};
 const cg=coopWorld.performance.bandLive.game,cn=cg.hand.find(id=>B.cardById(cg,id).kind==='note');await coopClick('',{blCard:cn});coopRoot.geometry=new Element();await coopClick('',{blTarget:cg.fans[0].id});await coopClick('bl-end');
 assert.deepEqual(commands.map(c=>c.action),['card','end']);assert.equal(commands[0].cardId,cn);assert.equal(JSON.stringify(cg),snapshot);coopUI.leave();nodes['#bandlive-view']=root;
 console.log('PASS cooperative UI commands preserve the authoritative projection and never access solo saves.');
 // Renderer, interactions and CSS must remain upstream, not be reconstructed.
 const dir=path.join(__dirname,'../vendor/simon'),out=path.join(__dirname,'../dist/show-module');
 const patched=new Set(['bandlive.mjs','bandlive-cards.mjs','bandlive-view.mjs','bandlive-resources.mjs','person-card.mjs']);
 for(const file of fs.readdirSync(dir).filter(f=>/\.(mjs|css)$/.test(f)&&!patched.has(f)))assert.equal(fs.readFileSync(path.join(out,file),'utf8'),fs.readFileSync(path.join(dir,file),'utf8'),file+' changed');
 for(const file of fs.readdirSync(out).filter(f=>f.endsWith('.mjs'))){const code=fs.readFileSync(path.join(out,file),'utf8');for(const match of code.matchAll(/(?:from\s*|import\(\s*)['"]\.\/([^'"]+)['"]/g))assert(fs.existsSync(path.join(out,match[1].split('?')[0])),match[1]);}
 assert.match(fs.readFileSync(path.join(out,'bandlive-stage.mjs'),'utf8'),/import\('\.\/bandlive-minuit-renderer/);assert.match(fs.readFileSync(path.join(out,'bandlive-minuit-renderer.mjs'),'utf8'),/WebGLRenderer/);
 console.log('PASS original renderer/CSS/interaction modules preserved byte-for-byte; all static/dynamic imports packaged locally.');
 // Test the house overlay and its shared-state bridge separately.
 s=venue();const hostBody=new Element(),dialog={open:false},resume=new Element('resumeShow');let lastOverlay,saves=0;
 const ctx={state:s,T,save:()=>saves++,setRunning(){},render(){},closeDialog(){},toast(){},$:sel=>sel==='#dialog'?dialog:resume,document:{body:hostBody,createElement(){return lastOverlay=new Element();}},window:{MaisonShowAdapter:A,matchMedia:()=>({matches:false})}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/live-ui.js','utf8'),ctx);
 const ui=ctx.window.MaisonLiveUI;ui.open();assert(ui.isOpen());const bridge=ui.connect(lastOverlay.querySelector('iframe').contentWindow);assert.equal(bridge.world.performance.bandLive.game,s.tour.active.live);bridge.ready();assert(lastOverlay.classes.has('ready'));bridge.pause();assert(!ui.isOpen());assert.equal(s.tour.active.phase,'stage');ui.open();assert(ui.isOpen());const finalBridge=ui.connect(lastOverlay.querySelector('iframe').contentWindow);T.autoShow(s);finalBridge.update();finalBridge.returnHome();assert(!ui.isOpen());assert.equal(s.tour.active.phase,'returning');assert(saves>=4);
 console.log('PASS full-screen module host: open, connect, close/reopen and return without resetting the show.');
})().catch(error=>{console.error(error);process.exitCode=1;});

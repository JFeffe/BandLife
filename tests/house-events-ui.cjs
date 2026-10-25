'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const S=require('../dist/sim.js');require('../dist/music.js');require('../dist/decisions.js');require('../dist/house.js');require('../dist/weeks.js');require('../dist/shows.js');require('../dist/morale.js');const I=require('../dist/identity.js'),J=require('../dist/journey.js'),E=require('../dist/house-events.js');
const els=new Map();
class Element{
 constructor(){this.open=false;this.dataset={};this.children=new Map();this.handlers={};this.html='';this.writes=0;}
 set innerHTML(v){this.html=v;this.writes++;this.children.clear();for(const [,id] of v.matchAll(/id="([\w-]+)"/g))els.set(id,new Element());}
 get innerHTML(){return this.html;}
 querySelectorAll(selector){const attr=selector.slice(1,-1),key=attr.replace('data-','').replace(/-([a-z])/g,(_,x)=>x.toUpperCase());return [...this.html.matchAll(new RegExp(attr+'="([^\"]+)"','g'))].map(([,v])=>{if(!this.children.has(v)){const el=new Element();el.dataset[key]=v;this.children.set(v,el);}return this.children.get(v);});}
}
for(const id of ['houseLifePanel','dialogContent','dialog'])els.set(id,new Element());
const s=S.create();J.choose(s,'radio');s.tick=198;E.tick(s);
let saves=0,opens=0,running=true;
const ctx={MaisonHouseEvents:E,I,state:s,window:{},$:sel=>els.get(sel.slice(1)),save:()=>saves++,openDialog:html=>{opens++;running=false;els.get('dialog').open=true;els.get('dialogContent').innerHTML=html;},closeDialog:()=>{els.get('dialog').open=false;running=true;}};
ctx.render=()=>ctx.window.MaisonHouseEventsUI.render();vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/house-events-ui.js','utf8'),ctx);
assert.equal(opens,0);assert(running);assert.match(els.get('houseLifePanel').innerHTML,/1 choix/);
const writes=els.get('houseLifePanel').writes;ctx.render();ctx.render();assert.equal(els.get('houseLifePanel').writes,writes,'Stable banner between frames');
els.get('openHouseEvent').onclick();assert.equal(opens,1);assert(!running);assert.match(els.get('dialogContent').innerHTML,/Aucun malus/);assert.equal(els.get('dialogContent').querySelectorAll('[data-house-choice]').length,2);
const id=E.pending(s).id;els.get('houseEventLater').onclick();assert(E.pending(s));assert.equal(E.pending(s).id,id);assert(running);
els.get('openHouseEvent').onclick();const choice=els.get('dialogContent').querySelectorAll('[data-house-choice]')[0];choice.onclick();assert.equal(saves,1);assert.equal(E.pending(s),null);assert.match(els.get('dialogContent').innerHTML,/moral \+5/);
choice.onclick();assert.equal(saves,1,'A stale button cannot apply the reward twice');
els.get('houseEventBack').onclick();els.get('openHouseEvent').onclick();assert.match(els.get('dialogContent').innerHTML,/LES SOUVENIRS/);assert.match(els.get('dialogContent').innerHTML,/Respecter son besoin de calme/);
console.log('PASS optional stable banner, no automatic pause/dialog, concrete effect previews, defer, real choice, history and stale-click protection.');

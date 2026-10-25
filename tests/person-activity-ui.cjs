const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const S=require('../dist/sim.js'),M=require('../dist/music.js'),D=require('../dist/decisions.js'),H=require('../dist/house.js'),W=require('../dist/weeks.js'),T=require('../dist/shows.js'),I=require('../dist/identity.js');require('../dist/activities.js');require('../dist/group-activity.js');const P=require('../dist/person-activity.js');
const els=new Map(),events={};
class Element{constructor(){this.hidden=true;this.open=false;this.scrollTop=0;this.attrs={};this.details={scrollTop:0};}set innerHTML(value){this.html=value;this.details={scrollTop:0};for(const [,id] of value.matchAll(/id="([^"]+)"/g))els.set(id,new Element());}get innerHTML(){return this.html;}querySelector(){return this.details;}setAttribute(k,v){this.attrs[k]=v;}}
const s=S.create(),buttons=s.people.map(p=>{const b=new Element();b.dataset={id:p.id};b.focus=()=>b.focused=true;return b;});
for(const id of ['dialog','rosterExpansion'])els.set(id,new Element());
const ctx={state:s,MaisonPersonActivity:P,M,I,H,clock:()=> '17:00',window:{homeOpen:false},$:q=>els.get(q.slice(1)),document:{querySelectorAll:()=>buttons,querySelector:q=>buttons.find(b=>q.includes(b.dataset.id)),addEventListener:(type,fn)=>events[type]=fn},showPerson:id=>ctx.profile=id};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/person-activity-ui.js','utf8'),ctx);
const UI=ctx.window.MaisonPersonActivityUI,el=els.get('rosterExpansion');
UI.toggle(s.people[0].id);assert(!el.hidden);assert.equal(buttons[0].attrs['aria-expanded'],'true');assert.match(el.innerHTML,/ses activités/);
el.details.scrollTop=34;UI.render();assert.equal(el.details.scrollTop,34);assert(!el.hidden);
events.click({target:{closest:selector=>selector==='#rosterExpansion'?el:null}});assert(!el.hidden);
events.click({target:{closest:()=>null}});assert(el.hidden);
UI.toggle(s.people[1].id);events.keydown({key:'Escape'});assert(el.hidden);assert(buttons[1].focused);
UI.toggle(s.people[0].id);els.get('stackPersonSheet').onclick();assert.equal(ctx.profile,s.people[0].id);assert(el.hidden);
UI.toggle(s.people[0].id);els.get('closeRosterExpansion').onclick();assert(el.hidden);
UI.toggle(s.people[0].id);ctx.state=S.create();UI.render();assert(el.hidden);
assert.match(UI.compact(ctx.state.people[0]),/personal-direction/);
console.log('PASS actual expansion handlers: open/toggle, outside click, Escape and focus, full profile, close, live scroll retention and new-game reset.');

// Real fitter, measured-height doubles: this is not browser layout verification.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
let frame,resize,observe,rawHeight=780,removed=0,hasAction=false,closed=0;
const created=[];
const content={children:[{}],style:{zoom:'1'},querySelector:()=>hasAction?{}:null,querySelectorAll:()=>[{removeAttribute(){removed++;}}],getBoundingClientRect:()=>({height:rawHeight*Number(content.style.zoom)}),addEventListener(){}};
const dialog={open:true,style:{setProperty(){}},append(){}};
const context={closeDialog:run=>{assert(run);closed++;},document:{querySelector:s=>s==='#dialog'?dialog:content,createElement:tag=>{const el={tag,hidden:false,append(){},getBoundingClientRect:()=>({height:50})};created.push(el);return el;}},innerHeight:600,getComputedStyle:()=>({paddingTop:'22',paddingBottom:'18'}),requestAnimationFrame:f=>{frame=f;},MutationObserver:class{constructor(f){observe=f;}observe(){}},addEventListener:(event,f)=>{resize=f;}};
vm.createContext(context);vm.runInContext(fs.readFileSync('dist/compact-dialog.js','utf8'),context);
assert.deepEqual(created.map(e=>e.tag),['div','button']); // No pagination navigation exists.
const [footer,button]=created;
context.MaisonCompactDialog.schedule();frame();
assert(!footer.hidden);assert.equal(removed,1);assert(Number(content.style.zoom)<1);assert(content.getBoundingClientRect().height<=466.01);
button.onclick();assert.equal(closed,1);
// A new song notice or confirmation uses its existing resume action, without another footer.
hasAction=true;rawHeight=900;observe();frame();assert(footer.hidden);assert(content.getBoundingClientRect().height<=516.01);
// Refitting does not replace content or bind a new handler.
const handler=button.onclick;rawHeight=200;observe();frame();assert.equal(content.style.zoom,'1');
hasAction=false;context.innerHeight=400;resize();frame();assert(!footer.hidden);assert.equal(button.onclick,handler);button.onclick();assert.equal(closed,2);
assert(content.getBoundingClientRect().height<=266.01);
console.log('PASS toutes les fenêtres sur une page, fermeture commune, conservation des boutons, contenu adapté après mutation/redimensionnement.');

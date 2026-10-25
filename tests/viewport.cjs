const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const P=require('../dist/viewport.js');
const items=Array.from({length:37},(_,id)=>({id}));
let reached=[];
for(let page=0;page<19;page++){
 const visible=P.slice('queue',items,2);reached.push(...visible.map(x=>x.id));
 assert(visible.length<=2);assert(P.nav('queue').includes('/ 37'));P.move('queue',1);
}
assert.deepEqual(reached,items.map(x=>x.id));
assert.deepEqual(P.slice('queue',items.slice(0,3),2).map(x=>x.id),[2]);
P.move('queue',-1);assert.deepEqual(P.slice('queue',items,2).map(x=>x.id),[0,1]);
assert.equal(P.slice('empty',[],2).length,0);assert.equal(P.nav('empty'),'');
assert.deepEqual(items.map(x=>x.id),Array.from({length:37},(_,i)=>i));
// Real paging controls invoke one render and clamp at either end.
let rendered=0;const button={dataset:{listPage:'queue',direction:'1'},disabled:false};
P.bind({querySelectorAll:()=>[button]},()=>rendered++);button.onclick();assert.equal(rendered,1);
assert.deepEqual(P.slice('queue',items,2).map(x=>x.id),[2,3]);
button.disabled=true;button.onclick();assert.equal(rendered,1);
// Exercise the actual sizing routine at desktop/laptop/narrow viewport dimensions.
// This validates geometry and fit arithmetic, not browser-computed CSS.
for(const [width,height] of [[1920,1080],[1366,768],[1280,720],[1024,768],[390,844]]){
 const screen={style:{}},left={style:{},scrollHeight:810,parentElement:{clientHeight:736}},nav={offsetHeight:28};
 const list={style:{},scrollHeight:480,getClientRects:()=>[{}],parentElement:{clientHeight:330,querySelector:()=>nav}};
 const start={style:{},scrollHeight:920,getClientRects:()=>[{}]};
 const ctx={innerWidth:width,innerHeight:height,globalThis:null,document:{querySelector:q=>q==='.house-screen'?screen:q==='.left-content'?left:start,querySelectorAll:()=>[list],addEventListener(){}},addEventListener(){},getComputedStyle:()=>({paddingTop:'8px',paddingBottom:'8px'}),queueMicrotask:fn=>{ctx.microtasks.push(fn);},microtasks:[],requestAnimationFrame:()=>{throw new Error('Fitting must not wait for the next animation frame');}};
 ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/viewport.js','utf8'),ctx);
 ctx.MaisonViewport.schedule();ctx.MaisonViewport.schedule();assert.equal(ctx.microtasks.length,1);ctx.microtasks.shift()();
 const scale=Number(screen.style.transform.match(/scale\((.*)\)/)[1]);
 assert(Math.abs(parseFloat(screen.style.width)*scale-width)<.01);
 assert(Math.abs(parseFloat(screen.style.height)*scale-height)<.01);
 assert(left.scrollHeight*left.style.zoom<=736);
 assert(list.scrollHeight*list.style.zoom+28+8+16<=330);
 assert(start.scrollHeight*start.style.zoom<=height-40);
 // Repeated simulation renders replace the list at its default size. Fit all
 // of them in a microtask before the simulated paint, never in a later frame.
 const expected=list.style.zoom;
 for(let tick=0;tick<30;tick++){
  list.style.zoom=1;ctx.MaisonViewport.schedule();ctx.MaisonViewport.schedule();
  assert.equal(ctx.microtasks.length,1);ctx.microtasks.shift()();
  assert.equal(list.style.zoom,expected);assert(list.style.zoom<1);
 }
}
console.log('PASS all paginated records reachable in order, navigation, deletion/clamping and viewport fitting arithmetic at five screen sizes.');

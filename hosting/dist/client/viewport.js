'use strict';
(function(root){
 const pages=new Map();let owner=null;
 function slice(key,items,size){
  if(typeof state!=='undefined'&&owner!==state){pages.clear();owner=state;}
  const page=pages.get(key)||{index:0};
  page.size=Math.max(1,size);page.total=items.length;page.count=Math.ceil(items.length/page.size);
  page.index=Math.max(0,Math.min(page.index,Math.max(0,page.count-1)));pages.set(key,page);
  return items.slice(page.index*page.size,(page.index+1)*page.size);
 }
 function nav(key){const p=pages.get(key);if(!p||p.count<2)return '';return `<nav class="list-pages" aria-label="Parcourir la liste"><button data-list-page="${key}" data-direction="-1" aria-label="Éléments précédents" ${p.index===0?'disabled':''}>‹</button><span>${p.index*p.size+1}–${Math.min(p.total,(p.index+1)*p.size)} / ${p.total}</span><button data-list-page="${key}" data-direction="1" aria-label="Éléments suivants" ${p.index===p.count-1?'disabled':''}>›</button></nav>`;}
 function move(key,direction){const p=pages.get(key);if(p)p.index=Math.max(0,Math.min(p.count-1,p.index+direction));}
 function bind(el,render){el.querySelectorAll('[data-list-page]').forEach(b=>b.onclick=()=>{if(b.disabled)return;move(b.dataset.listPage,Number(b.dataset.direction));render();root.MaisonViewport?.schedule();});root.MaisonViewport?.schedule();}
 root.MaisonPages={slice,nav,bind,move};
 if(typeof module!=='undefined')module.exports=root.MaisonPages;
 if(typeof document==='undefined')return;
 let pending=false;
 function fit(content,available){if(!content||available<=0)return;content.style.zoom=1;const natural=content.scrollHeight;content.style.zoom=natural>available?Math.max(.1,(available-2)/natural):1;}
 function layout(){
  pending=false;const start=document.querySelector('#startScreen .start-inner');if(start&&start.getClientRects().length)fit(start,innerHeight-40);const screen=document.querySelector('.house-screen');if(!screen)return;
  const scale=Math.min(1,innerWidth/1100,innerHeight/760);
  screen.style.width=innerWidth/scale+'px';screen.style.height=innerHeight/scale+'px';screen.style.transform=`scale(${scale})`;
  const left=document.querySelector('.left-content');if(left)fit(left,left.parentElement.clientHeight);
  for(const el of document.querySelectorAll('.activity-content .page-items')){
   if(!el.getClientRects().length)continue;
   const box=el.parentElement,nav=box.querySelector('.list-pages'),style=getComputedStyle(box);
   const available=box.clientHeight-parseFloat(style.paddingTop||0)-parseFloat(style.paddingBottom||0)-(nav?nav.offsetHeight+8:0);
   fit(el,available);
  }
 }
 // Simulation renders inside requestAnimationFrame. Scheduling another frame leaves
 // rebuilt panels at zoom 1 for one paint. A microtask fits the complete render
 // before that same paint, coalescing all panel updates without visible resets.
 function schedule(){if(!pending){pending=true;queueMicrotask(layout);}}
 root.MaisonViewport={schedule};
 addEventListener('resize',schedule);
 document.addEventListener('toggle',schedule,true);
 document.addEventListener('click',schedule);
 document.addEventListener('DOMContentLoaded',schedule);
})(globalThis);

'use strict';
// Short press feedback. Native focus and keyboard activation remain unchanged.
document.addEventListener('pointerdown',e=>{const button=e.target.closest('button');if(!button||button.disabled||button.classList.contains('person')||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=button.getBoundingClientRect(),wave=document.createElement('span');wave.className='click-wave';wave.setAttribute('aria-hidden','true');wave.style.left=e.clientX-r.left+'px';wave.style.top=e.clientY-r.top+'px';button.append(wave);setTimeout(()=>wave.remove(),550);});

(function(root){
'use strict';
const labels=['Fragile','Simple','Prometteuse','Solide','Accrocheuse','Remarquable','Exceptionnelle'];
const preferences={Indie:'balanced',Punk:'energy',Folk:'turns','Métal':'energy',Jazz:'turns','Électro':'energy',Ska:'balanced',Pop:'balanced'};
const preferenceNames={balanced:'Équilibré',energy:'Énergie',turns:'Durée'};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const level=q=>Math.min(7,Math.floor(clamp(Number(q)||0,0,100)/15)+1);
function seed(x){let h=2166136261;for(const c of [x.id,x.title,x.genre].join('|')){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0)/4294967296;}
function profile(x){const tier=level(x.quality),budget=tier+4,preference=preferences[x.genre]||'balanced',roll=Number.isFinite(x.arrangementRoll)?clamp(x.arrangementRoll,0,.999999999):seed(x);const variants=[];for(let turns=3;turns<=6;turns++){const energy=budget-turns;if(energy<2||energy>5)continue;const weight=preference==='energy'?Math.pow(4,energy-2):preference==='turns'?Math.pow(4,turns-3):Math.abs((turns-3)-(energy-2))<=1?6:1;variants.push({turns,energyPerTurn:energy,weight});}let n=roll*variants.reduce((sum,x)=>sum+x.weight,0),chosen=variants.at(-1);for(const v of variants){n-=v.weight;if(n<0){chosen=v;break;}}return {level:tier,label:labels[tier-1],budget,turns:chosen.turns,energyPerTurn:chosen.energyPerTurn,preference,preferenceLabel:preferenceNames[preference],provisional:!!x.reworkPending};}
function update(x){if(!Number.isFinite(x.arrangementRoll))x.arrangementRoll=seed(x);const p=profile(x);x.turns=p.turns;x.energyPerTurn=p.energyPerTurn;x.qualityTier=p.level;x.arrangementVersion=1;return p;}
function text(x){const p=profile(x);return `Niv. ${p.level}/7 · ${p.turns} tours · ${p.energyPerTurn} énergie/tour${p.provisional?' · provisoire':''}`;}
root.MaisonSongQuality={level,labels,preferences,preferenceNames,profile,update,text};if(typeof module!=='undefined')module.exports=root.MaisonSongQuality;
})(typeof globalThis!=='undefined'?globalThis:this);

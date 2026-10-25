(function(root){
'use strict';
// Read-only projection of the same songs and contracts used at departure.
function project(s){
 const M=root.MaisonMusic,W=root.MaisonWeeks,o=s.journey?.selected,a=s.tour?.active;
 const songs=s.music.songs.filter(x=>!x.archived),locked=!!a&&!['preparing','coffee','packing'].includes(a.phase);
 const ready=locked?a.songs:songs.filter(M.ready),styles=[...new Set(ready.map(x=>x.genre))];
 const minimum=Math.max(1,o?.minReady||0,o?.minSongs||0),checks=[];
 checks.push({id:'songs',ok:ready.length>=minimum,label:`Chansons prêtes : ${ready.length} / ${minimum} minimum`,detail:ready.length>=minimum?'Terminées, adoptées et préparées à 100 %.':`Encore ${minimum-ready.length} à terminer, faire adopter ou répéter.`});
 if(o?.readyStyles)checks.push({id:'styles',ok:styles.length>=o.readyStyles,label:`Styles prêts : ${styles.length} / ${o.readyStyles} minimum`,detail:styles.length?styles.join(' · '):'Préparer des chansons de styles différents.'});
 const missingStyles=!!o?.readyStyles&&styles.length<o.readyStyles;
 const candidates=songs.filter(x=>!M.ready(x)).map(x=>{
  let label,rank;
  const session=s.music.session?.songId===x.id?s.music.session:null;
  const order=s.music.orders?.find(q=>q.songId===x.id&&['waiting','running'].includes(q.status));
  if(x.adopted){rank=0;label=x.progress<100?`Terminer l’écriture · ${Math.round(x.progress)} %`:`Répéter · préparation ${x.preparation} %`;}
  else if(x.reworkPending){rank=3;label=`Terminer la réécriture · ${Math.round(x.progress)} %`;}
  else if(x.voteCount&&!x.reworkResult){rank=4;label='Retravailler après le refus du groupe';}
  else if(x.progress>=80){rank=1;label='Proposer un essai au groupe';}
  else{rank=2;label=`Poursuivre l’écriture · ${Math.round(x.progress)} %` ;}
  if(session)label=session.kind==='trial'?'Essai en cours · vote à venir':`Répétition en cours · ${x.preparation} %`;
  else if(order)label=order.suspended?'Séance suspendue · reprise à 10 h':order.status==='waiting'?'Invitation en attente':'Activité en cours';
  return {id:x.id,title:x.title,genre:x.genre,label,detail:order?.reason||'',rank,progress:x.adopted?x.preparation:x.progress,newStyle:missingStyles&&!styles.includes(x.genre)};
 }).sort((a,b)=>Number(b.newStyle)-Number(a.newStyle)||a.rank-b.rank||b.progress-a.progress);
 const complete=checks.every(x=>x.ok),week=W.week(s),next=o?.week??s.journey?.nextWeek??root.MaisonShows.nextShowWeek(s);
 return {selected:!!o,active:!!a,locked,phase:a?.phase,ready,styles,minimum,checks,complete,candidates:candidates.slice(0,3),candidateCount:candidates.length,
  weeks:Math.max(0,next-week),deadline:a?'Journée de concert · départ à 11 h':next===week?'Concert cette semaine · départ à 11 h':`À préparer avant S${next} · départ à 11 h`,
  onStage:o?[`Conquérir les ${o.fans} spectateurs.`,...(o.minSongs?[`Jouer au moins ${o.minSongs} chansons différentes pendant le concert.`]:[])]:[],
  matching:ready.filter(x=>o?.styles.includes(x.genre)).length};
}
root.MaisonShowPreparation={project};if(typeof module!=='undefined')module.exports=root.MaisonShowPreparation;
})(globalThis);

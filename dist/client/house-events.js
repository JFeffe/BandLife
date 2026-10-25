(function(root){
'use strict';
const S=()=>root.MaisonSim,M=()=>root.MaisonMusic,W=()=>root.MaisonWeeks,R=()=>root.MaisonMorale;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),pair=(a,b)=>[a,b].sort().join(':');
const person=(s,id)=>s.people.find(p=>p.id===id),song=(s,id)=>s.music.songs.find(x=>x.id===id);
function init(s){
 s.houseEvents??={version:1,nextWeek:Math.max(2,W().week(s)),serial:0,pending:null,history:[],lastKinds:{},inspiration:{}};
 return s.houseEvents;
}
function valid(s,e){return !!e&&['tension','idea','quiet'].includes(e.kind)&&e.people.every(id=>person(s,id))&&W().week(s)<e.expiresWeek;}
function pending(s){const e=s.houseEvents?.pending;return valid(s,e)?e:null;}
function available(s){return !(root.MaisonShows?.busy(s)||W().isNight(s)||W().blocked(s)||s.journey?.status&&s.journey.status!=='active');}
function remember(s,e,status,choice,effects=[]){const h=init(s);h.history.unshift({id:e.id,week:W().week(s),kind:e.kind,title:e.title,people:[...e.people],status,choice,effects});h.history=h.history.slice(0,8);h.pending=null;}
function candidates(s){
 const events=[],pairs=[];for(let i=0;i<s.people.length;i++)for(let j=i+1;j<s.people.length;j++)pairs.push([s.people[i],s.people[j]]);
 const tense=pairs.filter(([a,b])=>S().affinity(s,a.id,b.id)<=-2).sort((a,b)=>S().affinity(s,a[0].id,a[1].id)-S().affinity(s,b[0].id,b[1].id))[0];
 if(tense){const [a,b]=tense;events.push({kind:'tension',people:[a.id,b.id],title:'Deux façons de faire',body:`${a.name} et ${b.name} ne trouvent plus le même rythme. Leurs derniers échanges ont laissé des tensions. Un peu d’écoute ou du recul ?`});}
 const quiet=s.people.filter(p=>(S().has(p,'solitaire')||S().has(p,'sensible'))&&(p.morale<=60||p.energy<40)).sort((a,b)=>a.morale-b.morale||a.energy-b.energy)[0];
 if(quiet){const friend=s.people.filter(p=>p.id!==quiet.id).sort((a,b)=>S().affinity(s,quiet.id,b.id)-S().affinity(s,quiet.id,a.id))[0];if(friend)events.push({kind:'quiet',people:[quiet.id,friend.id],title:'Un peu d’espace',body:`${quiet.name}, ${S().has(quiet,'solitaire')?'plutôt solitaire':'sensible à l’ambiance'}, semble avoir besoin de souffler. ${friend.name} hésite entre un mot de soutien et lui laisser du calme.`});}
 for(const x of s.music.songs){
  if(x.archived||x.adopted||x.progress>=100||x.voteCount&&!x.reworkPending)continue;
  const author=x.authors.map(id=>person(s,id)).find(p=>p&&(S().has(p,'créati')||S().has(p,'minutieu')));
  if(!author)continue;
  const friend=s.people.find(p=>p.id!==author.id&&S().affinity(s,author.id,p.id)>=2&&(p.style===x.genre||p.interests.includes(x.genre)||S().has(p,'bienveillant')));
  if(friend){events.push({kind:'idea',people:[author.id,friend.id],songId:x.id,title:'Une idée qui circule',body:`${friend.name} a un motif à partager avec ${author.name} pour « ${x.title} ». Leur bonne entente peut nourrir l’écriture, ou simplement lui redonner confiance.`});break;}
 }
 return events;
}
function tick(s){
 const h=init(s),week=W().week(s),minute=W().minute(s);
 for(const [id,b] of Object.entries(h.inspiration)){const x=song(s,id);if(week>=b.expiresWeek||!x||x.archived||x.adopted||x.progress>=100)delete h.inspiration[id];}
 if(h.pending&&!valid(s,h.pending))remember(s,h.pending,'expired','Le moment est passé, sans conséquence.');
 if(h.pending||week<h.nextWeek||minute<1020||minute>=1320||root.MaisonShows?.busy(s)||s.tour?.recoveryUntil>s.tick||s.calendar.wake||s.journey?.status&&s.journey.status!=='active')return;
 const e=candidates(s).filter(e=>week-(h.lastKinds[e.kind]??-99)>=6).sort((a,b)=>(h.lastKinds[a.kind]??-99)-(h.lastKinds[b.kind]??-99))[0];
 if(!e)return;
 h.pending={...e,id:'house-'+(++h.serial),week,expiresWeek:week+2};h.lastKinds[e.kind]=week;h.nextWeek=week+3;
 S().log(s,e.title,e.body+' Un choix facultatif est disponible dans Vie du groupe.','social');
}
function choices(s,e=pending(s)){
 if(!valid(s,e))return [];
 const [a,b]=e.people,options=[];
 if(e.kind==='tension'){
  options.push({id:'listen',label:'Faire place aux deux points de vue',relation:[a,b,2],morale:[[a,2],[b,2]]});
  options.push({id:'space',label:'Laisser retomber la pression',morale:[[a,4],[b,4]]});
 }else if(e.kind==='quiet'){
  options.push({id:'space',label:'Respecter son besoin de calme',morale:[[a,5]]});
  options.push({id:'support',label:'Laisser un mot de soutien',relation:[a,b,2],morale:[[a,2],[b,2]]});
 }else{
  const x=song(s,e.songId);
  if(x&&!x.archived&&!x.adopted&&x.progress<100&&(!x.voteCount||x.reworkPending)&&x.authors.includes(a)&&!s.houseEvents?.inspiration[x.id])options.push({id:'motif',label:'Accueillir le motif proposé',relation:[a,b,1],inspiration:{songId:x.id,personId:a,amount:8,expiresWeek:W().week(s)+3}});
  options.push({id:'confidence',label:'Encourager son idée personnelle',morale:[[a,5],[b,2]]});
 }
 return options;
}
function preview(s,c){
 const lines=[];
 for(const [id,n] of c.morale||[]){const p=person(s,id);lines.push(`${p.name} : moral +${clamp(p.morale+n,1,100)-p.morale}.`);}
 if(c.relation){const [a,b,n]=c.relation,v=S().affinity(s,a,b);lines.push(`${person(s,a).name} ↔ ${person(s,b).name} : relation +${clamp(v+n,-8,12)-v}.`);}
 if(c.inspiration){const b=c.inspiration;lines.push(`« ${song(s,b.songId).title} » : +${b.amount} points d’écriture lors du prochain travail de ${person(s,b.personId).name} (maximum 100 %), avant S${b.expiresWeek}.`);}
 return lines;
}
function resolve(s,id,choice){
 const e=pending(s);if(!e||e.id!==id||!available(s))return null;
 const c=choices(s,e).find(c=>c.id===choice);if(!c)return null;
 const h=init(s),effects=preview(s,c);
 for(const [id,n] of c.morale||[])R().change(s,person(s,id),n,e.title,{key:e.id+'-'+id,once:true});
 if(c.relation){const [a,b,n]=c.relation;s.relations[pair(a,b)]=clamp(S().affinity(s,a,b)+n,-8,12);}
 if(c.inspiration)h.inspiration[c.inspiration.songId]={...c.inspiration,source:e.id};
 remember(s,e,'resolved',c.label,effects);S().log(s,e.title,c.label+' · '+effects.join(' '),'social');
 return h.history[0];
}
function skip(s,id){const e=pending(s);if(!e||e.id!==id||!available(s))return false;remember(s,e,'skipped','Laisser passer, sans conséquence.');return true;}
function consumeInspiration(s,p,x){
 const h=s.houseEvents,b=h?.inspiration[x.id];
 if(!b||b.personId!==p.id||W().week(s)>=b.expiresWeek||x.archived||x.adopted||x.progress>=100||!x.authors.includes(p.id))return 0;
 delete h.inspiration[x.id];S().log(s,'Le motif trouve sa place',`${p.name} s’appuie sur l’idée partagée pour avancer « ${x.title} ».`,'music');return b.amount;
}
root.MaisonHouseEvents={init,pending,available,candidates,tick,choices,preview,resolve,skip,consumeInspiration};if(typeof module!=='undefined')module.exports=root.MaisonHouseEvents;
})(globalThis);

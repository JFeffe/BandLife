'use strict';
// Commands are synchronous and resolved against one canonical server-owned room.
const R=()=>globalThis,copy=x=>structuredClone(x);
const fail=message=>{throw Object.assign(new Error(message),{status:409});};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function random(seed){let n=seed>>>0;return()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);}
function band(name,trio,seed,seat){
 const {MaisonSim:S,MaisonMusic:M,MaisonCasting:C}=R(),rng=random(seed);
 const s=S.create(3,C.draft(trio,rng));s.music.songs=[];s.music.pending=[];s.music.moments=[];s.calendar={focus:{until:Number.MAX_SAFE_INTEGER}};
 const song=M.newSong(s,[s.people[0].id],s.people[0].style,rng,{progress:100});
 Object.assign(song,{adopted:true,preparation:30,quality:22,arrangementRoll:.5});M.updatePerformance(song);
 M.newSong(s,[s.people[1].id],s.people[1].style,rng,{progress:45});
 s.people.forEach(p=>{p.energy=90;p.room='salon';p.action='rest';p.remaining=1;delete p.projectId;});
 return {name,seat,state:s,plan:null,ready:false,selectedSong:null,rewardClaimed:false};
}
function create(name,trio,seed){return {version:1,week:7,checkpoint:0,nextShow:8,phase:'lobby',epoch:0,revision:0,seed,players:[band(name,trio,seed,0),null],concert:null,history:[],log:['Deux maisons, une scène. Préparez votre concert de voisinage.']};}
function join(room,name,trio){if(room.players[1])fail('Les deux maisons sont déjà occupées.');room.players[1]=band(name,trio,room.seed^0x1367abcd,1);room.phase='house';room.epoch++;}
function prepared(player){return player.state.music.songs.filter(R().MaisonMusic.ready);}
function plan(room,seat,action,songId){
 if(room.phase!=='house')fail('La préparation est terminée.');const p=room.players[seat];if(p.ready)fail('Annule ton état prêt avant de changer ton programme.');
 if(!['practice','compose','trial','rest'].includes(action))fail('Activité inconnue.');
 const x=R().MaisonMusic.song(p.state,songId);
 if(action!=='rest'&&(!x||x.archived))fail('Choisis une chanson disponible.');
 if(action==='practice'&&(!x.adopted||R().MaisonMusic.ready(x)))fail('Choisis une chanson adoptée à préparer.');
 if(action==='compose'&&x.progress>=100)fail('Cette composition est déjà terminée.');
 if(action==='trial'&&(x.adopted||x.progress<80))fail('La chanson doit être écrite à 80 % avant son essai.');
 p.plan={action,songId:action==='rest'?null:songId};
 p.state.people.forEach(q=>{q.room=action==='practice'||action==='trial'?'garage':action==='compose'?'studio':'salon';q.action=action==='compose'?'compose':action==='rest'?'rest':'practice';});
}
function applyPlan(room,p){
 const {MaisonMusic:M}=R(),s=p.state,a=p.plan,x=M.song(s,a.songId),rng=random(room.seed+room.epoch*131+p.seat);
 if(a.action==='practice'||a.action==='trial'){
  if(s.people.filter(q=>q.energy>=20).length<2)fail(p.name+' a besoin de repos avant de répéter.');
  if(!M.sessionFromIntent(s,x.id,s.people.map(q=>q.id)))fail('Cette séance ne peut pas commencer.');
  s.tick=s.music.session.ends;M.step(s,()=>0);
 }else if(a.action==='compose'){
  for(const id of x.authors){const q=s.people.find(q=>q.id===id);q.projectId=x.id;q.action='compose';for(let i=0;i<3&&x.progress<100;i++)M.finish(s,q,rng);q.energy=clamp(q.energy-12,0,100);}
 }else s.people.forEach(q=>q.energy=clamp(q.energy+25,0,100));
 p.ready=false;p.plan=null;
}
function advanceHouse(room){
 room.players.forEach(p=>applyPlan(room,p));room.checkpoint++;room.epoch++;
 if(room.checkpoint===3){room.checkpoint=0;room.week++;room.players.forEach(p=>p.state.people.forEach(q=>q.energy=clamp(q.energy+30,0,100)));
  if(room.week>=room.nextShow&&room.players.every(p=>prepared(p).length)){room.phase='setlist';room.players.forEach(p=>{p.selectedSong=null;p.rewardClaimed=false;});room.log.push('Les deux groupes sont prêts : choisissez une chanson chacun.');}
  else if(room.week>=room.nextShow)room.log.push('Le concert attend : chaque groupe doit avoir une chanson prête.');
 }
}
const contextKeys=['hand','deck','discard','rng','energy','boost','relayBoosts','songId','section'];
function loadContext(c,seat){const x=c.contexts[seat];for(const k of contextKeys)c.game[k]=copy(x[k]);c.game.phase=c.phase==='won'||c.phase==='lost'?c.phase:'play';return c.game;}
function saveContext(c,seat){for(const k of contextKeys)c.contexts[seat][k]=copy(c.game[k]);}
function startConcert(room){
 const B=R().MaisonBandLive,M=R().MaisonMusic,people=[],songs=[];
 for(const p of room.players){const chosen=prepared(p).find(x=>x.id===p.selectedSong);if(!chosen)fail('Une chanson prête est requise dans chaque maison.');songs.push({...copy(chosen),id:p.seat+':'+chosen.id,style:chosen.genre});for(const q of p.state.people)people.push({id:p.seat+':'+q.id,name:q.name,instrument:M.cards.instrumentKey(q),genre:q.style,color:q.color,identity:q.identity||{},needs:{energy:q.energy},bandLiveDeck:q.deck.map(id=>id==='note'?'note':id.split('-').at(-1))});}
 const g=B.createBandLive({people,songs,seed:room.seed+room.week,groupId:'maison',groupName:room.players.map(p=>p.name).join(' + '),audienceSize:12,audienceRules:{styles:[...new Set(songs.map(s=>s.style))],resistancePercent:95},freeSetlist:true});
 g.turn=1;g.phase='play';g.usedSongs=songs.map(s=>s.id);g.cooperative=true;
 const c=room.concert={game:g,phase:'play',round:1,done:[false,false],aim:[null,null],contexts:songs.map((song,i)=>({hand:[],deck:g.deck.filter(id=>id.startsWith(i+':')),discard:[],rng:(room.seed+i+1)>>>0,energy:0,boost:0,relayBoosts:[],songId:song.id,section:1,finished:false}))};
 B.resetCoopReactions(g);for(let i=0;i<2;i++){loadContext(c,i);B.drawCoopHand(g);saveContext(c,i);}room.phase='concert';room.epoch++;
}
function settle(room){const c=room.concert;if(c.game.phase==='won')c.phase='won';if(!['won','lost'].includes(c.phase))return;room.phase='result';room.epoch++;
 for(const p of room.players){for(const q of p.state.people)q.energy=c.game.actors.find(a=>a.id===p.seat+':'+q.id).needs.energy;p.ready=false;}
 room.history.push({week:room.week,outcome:c.phase});room.history=room.history.slice(-30);room.log.push(c.phase==='won'?'Victoire commune ! Une carte pour chaque groupe.':'Le public résiste. Préparez ensemble la prochaine tentative.');
}
function nextRound(room){
 const c=room.concert,B=R().MaisonBandLive,active=c.contexts.flatMap((x,i)=>x.finished?[]:c.game.actors.filter(a=>a.id.startsWith(i+':')).map(a=>a.id));
 const finalSongs=c.contexts.filter(x=>!x.finished&&x.section>=c.game.songs.find(s=>s.id===x.songId).turns).map(x=>c.game.songs.find(s=>s.id===x.songId));
 c.contexts.forEach(x=>{x.discard.push(...x.hand);x.hand=[];x.boost=0;x.relayBoosts=[];});
 c.game.phase='play';B.resolveCoopRound(c.game,finalSongs,active);if(c.game.phase==='won'){c.phase='won';settle(room);return;}
 c.contexts.forEach(x=>{if(finalSongs.some(s=>s.id===x.songId))x.finished=true;});
 if(c.contexts.every(x=>x.finished)){c.phase='lost';settle(room);return;}
 c.round++;c.game.turn=c.round;B.resetCoopReactions(c.game);c.aim=[null,null];
 for(let i=0;i<2;i++){const x=c.contexts[i];c.done[i]=x.finished;if(!x.finished){x.section++;loadContext(c,i);B.drawCoopHand(c.game);saveContext(c,i);}}
 room.epoch++;
}
function command(room,seat,input){
 const p=room.players[seat];if(!p)fail('Maison inconnue.');const a=input.action;
 if(a==='plan'){plan(room,seat,input.activity,input.songId);}
 else if(a==='ready'){
  if(room.phase!=='house')fail('Ce rendez-vous est terminé.');if(!p.plan)fail('Choisis une activité avant de te déclarer prêt.');p.ready=!!input.ready;if(room.players.every(q=>q?.ready))advanceHouse(room);
 }else if(a==='song'){
  if(room.phase!=='setlist')fail('La sélection est terminée.');if(!prepared(p).some(s=>s.id===input.songId))fail('Choisis une chanson prête.');p.selectedSong=input.songId;if(room.players.every(q=>q.selectedSong))startConcert(room);
 }else if(a==='card'||a==='end'||a==='aim'){
  if(room.phase!=='concert'||room.concert.phase!=='play')fail('Ce concert est terminé.');const c=room.concert;
  if(c.done[seat])fail('Ton groupe attend le prochain tour.');
  if(a==='aim'){if(input.targetId&&!c.game.fans.some(f=>f.id===input.targetId&&f.hp>0))fail('Cible indisponible.');c.aim[seat]=input.targetId||null;}
  else if(a==='end'){c.done[seat]=true;c.aim[seat]=null;if(c.done.every(Boolean))nextRound(room);}
  else{const g=loadContext(c,seat);if(!g.hand.includes(input.cardId))fail('Cette carte ne fait pas partie de ta main.');const result=R().MaisonBandLive.playCard(g,input.cardId,input.targetId,{secondTargetId:input.secondTargetId,discardId:input.discardId});if(!result.ok)fail(result.message);saveContext(c,seat);c.aim[seat]=null;settle(room);}
 }else if(a==='reward'){
  if(room.phase!=='result'||room.concert.phase!=='won'||p.rewardClaimed)fail('Récompense indisponible.');const q=p.state.people.find(q=>q.id===input.personId);if(!q)fail('Choisis un musicien de ton groupe.');const choices=R().MaisonMusic.cards.choices(q);if(!choices.includes(input.cardId))fail('Choisis une de ses cartes spéciales.');q.deck.push(input.cardId);p.rewardClaimed=true;
 }else if(a==='return'){
  if(room.phase!=='result')fail('Le concert n’est pas terminé.');if(room.concert.phase==='won'&&!p.rewardClaimed)fail('Choisis ta récompense avant de rentrer.');p.ready=true;
  if(room.players.every(q=>q.ready)){room.phase='house';room.week++;room.nextShow=room.week+3;room.checkpoint=0;room.epoch++;room.concert=null;room.players.forEach(q=>{q.ready=false;q.plan=null;q.selectedSong=null;q.state.people.forEach(m=>{m.room='salon';m.action='rest';});});}
 }else fail('Commande inconnue.');
 room.log=room.log.slice(-12);return room;
}
function view(room,seat){
 const v=copy(room);v.seat=seat;
 if(v.concert){const c=v.concert,g=loadContext(c,seat);g.cooperative=true;g.coopSeat=seat;g.phase=c.phase;g.section=c.contexts[seat].section;g.usedSongs=[g.songId];if(c.done[seat]){g.hand=[];g.energy=0;}c.projection=g;delete c.contexts;delete c.game;}
 return v;
}
module.exports={create,join,command,view,prepared};

(function(root){
'use strict';
const W=()=>root.MaisonWeeks,S=()=>root.MaisonSim,M=()=>root.MaisonMusic;
const show=(id,name,icon,styles,fans,resistance,reward,extra={})=>({id,name,icon,styles,fans,resistance,reward,...extra,challenge:`Conquérir les ${fans} spectateurs.${extra.minSongs?' Jouer au moins '+extra.minSongs+' chansons différentes.':''}${extra.minReady?' Préparer au moins '+extra.minReady+' chansons avant le départ.':''}${extra.readyStyles?' Le répertoire prêt doit couvrir '+extra.readyStyles+' styles.':''}`});
const acts=[
 {name:'Scène locale',short:'Locale',title:'Sortir du garage',stages:[
  [show('discovery','Le club des découvertes','✦',['Indie','Pop'],4,45,'meeting'),show('radio','La session radio','◉',['Jazz','Folk'],4,50,'card')],
  [show('authors','La soirée des auteurs','✎',['Indie','Folk'],6,50,'composition',{minReady:2}),show('electric','Les nuits électriques','ϟ',['Punk','Métal'],6,55,'card')],
  [show('headliner','La première partie décisive','★',['Pop','Jazz','Indie'],8,65,'arc')]
 ]},
 {name:'Scène nationale',short:'Nationale',title:'Prendre la route',stages:[
  [show('campus','La tournée des campus','✦',['Indie','Ska'],6,80,'meeting'),show('national-radio','Les sessions nationales','◉',['Pop','Folk'],6,85,'exchange')],
  [show('songwriters','Les rencontres de la chanson','✎',['Folk','Jazz'],7,95,'composition',{minReady:3}),show('national-nights','Le circuit électrique','ϟ',['Métal','Électro'],7,100,'card')],
  [show('national-final','La grande scène nationale','★',['Pop','Indie','Ska'],8,115,'arc',{minReady:3})]
 ]},
 {name:'Scène internationale',short:'Internationale',title:'Au-delà des frontières',stages:[
  [show('crossroads','Le festival des croisements','✦',['Ska','Jazz','Électro'],7,120,'meeting'),show('live-session','La session à l’étranger','◉',['Folk','Pop'],7,125,'exchange')],
  [show('artist-residency','Les nuits d’auteurs','✎',['Indie','Folk','Jazz'],8,135,'composition',{minReady:3,readyStyles:2}),show('continental','Le circuit des capitales','ϟ',['Punk','Métal','Électro'],8,140,'card')],
  [show('international-final','La tête d’affiche internationale','★',['Jazz','Pop','Électro'],8,155,'arc',{minReady:3,readyStyles:2})]
 ]},
 {name:'Scène mondiale',short:'Mondiale',title:'Faire le tour du monde',stages:[
  [show('world-collab','Les rencontres sans frontières','✦',['Ska','Folk','Jazz'],8,165,'meeting'),show('world-broadcast','La session mondiale','◉',['Pop','Indie'],8,170,'exchange')],
  [show('world-authors','Le grand rendez-vous des auteurs','✎',['Jazz','Folk','Indie'],8,180,'composition',{minReady:4,readyStyles:2}),show('world-electric','La nuit des grandes scènes','ϟ',['Électro','Métal','Punk'],8,185,'card')],
  [show('world-final','Le concert des horizons','★',['Pop','Jazz','Électro'],8,200,'victory',{minReady:4,readyStyles:2})]
 ]}
];
const stages=acts[0].stages;
function refreshCandidate(s){const j=s.journey,people=S().candidates(s),unused=people.filter(p=>!j.metCandidates.includes(p.id));const pool=unused.length?unused:people,c=pool.find(p=>!s.people.some(q=>q.instrument===p.instrument))||pool[0];j.candidate=c?JSON.parse(JSON.stringify(c)):null;}
function nextAct(s,week,migrated=false){const j=s.journey,completed=j.act;j.act++;j.stage=0;j.status='active';j.chances=Math.min(3,j.chances+1);j.selected=null;j.firstWeek=Math.max(week+8,W().week(s)+(W().minute(s)>480?1:0));j.nextWeek=j.firstWeek;j.actStarts[j.act]=j.firstWeek;j.pendingArc={id:'act-'+completed,completedAct:completed,nextAct:j.act,week,chances:j.chances,migrated};refreshCandidate(s);}
function init(s){
 if(s.journey){const j=s.journey;
  if((j.version||1)<2&&j.stage===2&&j.status==='active'&&!s.tour?.active&&!j.history.some(h=>h.stage===2)){const prior=j.history.findLast(h=>h.stage===1);if(prior){j.nextWeek=Math.max(prior.week+1,W().week(s)+(W().minute(s)>480?1:0));if(j.selected)j.selected.week=j.nextWeek;}}
  if((j.version||1)<3){j.act??=0;j.actStarts??=[j.firstWeek];j.metCandidates??=[];j.pendingArc??=null;j.history.forEach(h=>h.act??=0);if(j.selected){const definition=acts[j.act].stages[j.stage].find(o=>o.id===j.selected.id);if(definition){Object.assign(j.selected,definition);j.selected.act=j.act;j.selected.rewardDescription=rewardText(j.selected);}}j.version=3;if(j.status==='won'&&j.act===0){nextAct(s,j.history.at(-1)?.week||j.nextWeek-1,true);j.routeReadyAt=Math.max(s.tick,j.routeReadyAt||0);}}
  return j;
 }
 const next=root.MaisonShows.nextShowWeek(s),first=s.tour.active?next+8:next;
 s.journey={version:3,status:'active',act:0,stage:0,chances:3,firstWeek:first,actStarts:[first],nextWeek:first,selected:null,history:[],pendingReward:null,pendingArc:null,encounter:null,writingBonus:0,metCandidates:[],routeReadyAt:s.tour.active?s.tour.active.endTick+60:s.tick};refreshCandidate(s);return s.journey;
}
function currentAct(s){return acts[s.journey?.act||0];}
function stageWeek(s,index,actIndex=s.journey?.act||0){const j=init(s);if(actIndex===j.act&&index===j.stage)return j.nextWeek;const record=j.history.findLast(h=>(h.act||0)===actIndex&&h.stage===index);if(record)return record.week;const first=j.actStarts[actIndex]??j.firstWeek+(actIndex-j.act)*17;return first+(index===2?9:index*8);}
function options(s,index=s.journey?.stage||0,actIndex=s.journey?.act||0){const j=init(s);return (acts[actIndex]?.stages[index]||[]).map(o=>actIndex===j.act&&index===j.stage&&j.selected?.id===o.id?JSON.parse(JSON.stringify(j.selected)):({...o,act:actIndex,reward:o.reward==='meeting'&&(s.people.length>=6||!j.candidate)?'card':o.reward,candidate:o.reward==='meeting'&&s.people.length<6&&actIndex===j.act?j.candidate:null}));}
function rewardText(o){if(o.reward==='meeting')return `Rencontre avec ${o.candidate?.name||'un musicien'} · ${o.candidate?.instrument||'instrument à découvrir'} · essai d’une semaine.`;if(o.reward==='card')return 'Ajouter 1 carte spéciale parmi 3, au musicien de votre choix.';if(o.reward==='exchange')return 'Masterclasse : remplacer 1 carte par une des 3 spéciales de son instrument, sans agrandir le paquet.';if(o.reward==='composition')return 'Résidence d’écriture : la prochaine nouvelle composition gagne +1 niveau (maximum 7).';if(o.reward==='victory')return 'Reconnaissance mondiale : victoire de la partie.';return `Accès à la ${acts[Math.min(3,(o.act||0)+1)].name.toLowerCase()} et +1 chance (maximum 3).`;}
function outstanding(s){const j=s.journey;return j.pendingReward||j.pendingArc||['offered','decision'].includes(j.encounter?.phase);}
function choose(s,id){const j=init(s);if(j.status!=='active'||s.tick<j.routeReadyAt||j.selected||root.MaisonShows.busy(s)||outstanding(s))return false;const o=options(s).find(o=>o.id===id);if(!o)return false;j.selected=JSON.parse(JSON.stringify(o));j.selected.week=j.nextWeek;j.selected.rewardDescription=rewardText(o);S().log(s,'La prochaine destination',`${o.name} · semaine ${j.nextWeek}. Réussite : ${rewardText(o)}`,'event');return true;}
function destination(s,week){return s.journey?.selected?.week===week?s.journey.selected:null;}
function scheduled(s,week){const j=s.journey;return j&&j.status==='active'&&week===j.nextWeek&&!!j.selected;}
function rewardTime(s){const j=s.journey;return s.tick>=j.routeReadyAt&&!root.MaisonShows.busy(s)&&!W().isNight(s)&&!s.calendar.wake&&!(s.tour.recoveryUntil>s.tick);}
function needsChoice(s){const j=s.journey;return j?.status==='active'&&!j.selected&&!outstanding(s)&&rewardTime(s);}
function blocked(s){const j=s.journey;return !!j&&(j.encounter?.phase==='decision'||j.status!=='active'||needsChoice(s)||!!(outstanding(s)&&rewardTime(s)));}
function requirements(s,a){const o=destination(s,a.week),ready=a.songs||a.result?.songs||[],played=a.result?.songs||[];if(!o)return [];const missing=[];if(o.minSongs&&new Set(played.map(x=>x.id)).size<o.minSongs)missing.push(`Jouer ${o.minSongs} chansons différentes.`);if(o.minReady&&ready.length<o.minReady)missing.push(`Préparer ${o.minReady} chansons avant le départ.`);if(o.readyStyles&&new Set(ready.map(x=>x.genre)).size<o.readyStyles)missing.push(`Préparer un répertoire couvrant ${o.readyStyles} styles.`);return missing;}
function assess(s,a){return !!destination(s,a.week)&&a.result.outcome==='won'&&!requirements(s,a).length;}
function previewResult(s,a){const o=destination(s,a.week);if(!o)return;const success=assess(s,a);a.result.effects.push(success?'Parcours réussi · '+o.rewardDescription:'Parcours échoué · aucune récompense, une chance sera perdue au retour.');if(!success&&a.result.outcome==='won'){a.result.title='Le contrat n’est pas rempli';a.result.body+=' '+requirements(s,a).join(' ');}}
function finishShow(s,a){const j=s.journey,o=destination(s,a.week);if(!j||!o||j.history.some(x=>x.id===a.id))return;const success=assess(s,a),missing=requirements(s,a);const record={id:a.id,act:j.act,week:a.week,stage:j.stage,destination:JSON.parse(JSON.stringify(o)),success,reward:success?o.rewardDescription:'Récompense non obtenue.',songs:a.result.songs.map(x=>x.title),score:a.result.score};j.history.push(record);
 if(!success)j.chances--;j.selected=null;j.nextWeek=a.week+(j.stage>=1?1:8);j.routeReadyAt=s.tick+Math.ceil((1920-W().minute(s))%1440/10);
 if(success&&['card','exchange'].includes(o.reward))j.pendingReward={id:a.id,kind:o.reward,title:o.reward==='exchange'?'Masterclasse · '+o.name:o.name};
 if(success&&o.reward==='composition'){j.writingBonus++;j.pendingReward={id:a.id,kind:'composition',title:'Résidence d’écriture · '+o.name};}
 if(success&&o.reward==='meeting'){j.encounter={id:a.id,phase:'offered',candidate:JSON.parse(JSON.stringify(o.candidate)),contacts:{},lastContact:{}};if(!j.metCandidates.includes(o.candidate.id))j.metCandidates.push(o.candidate.id);}
 if(j.chances<=0)j.status='lost';else if(j.stage===2&&success){if(j.act===acts.length-1)j.status='won';else nextAct(s,a.week);}else if(j.stage<2)j.stage++;
 a.result.journey={success,chances:j.chances,act:j.act,reward:record.reward};S().log(s,success?'Une étape réussie':'Une chance en moins',success?record.reward:`${j.chances}/3 chances restantes. ${missing.join(' ')}`,'event');
}
function acknowledgeArc(s){const j=init(s);if(!j.pendingArc||!rewardTime(s))return false;j.pendingArc=null;return true;}
function acknowledgeWriting(s){const j=init(s);if(j.pendingReward?.kind!=='composition'||!rewardTime(s))return false;j.pendingReward=null;return true;}
function claimCard(s,id){const j=s.journey,p=s.people.find(p=>p.id===id);if(!j?.pendingReward||!['card','exchange'].includes(j.pendingReward.kind)||!p)return false;const r=j.pendingReward;M().queue(s,{type:'reward',rewardSource:'journey',rewardMode:r.kind==='exchange'?'replace':'add',personId:p.id,title:r.title,body:'La récompense annoncée pour ce show réussi.',journeyId:r.id});if(!s.music.pending.some(e=>e.journeyId===r.id))return false;j.pendingReward=null;return true;}
function consumeWriting(s,x){const j=s.journey;if(!j?.writingBonus)return;j.writingBonus--;const before=M().qualityLevel(x.quality);x.quality=Math.min(100,x.quality+15);M().updatePerformance(x);x.journeyBonus={before,after:M().qualityLevel(x.quality)};root.MaisonDecisions.notice(s,{kind:'journey-composition',songId:x.id,title:'La résidence d’écriture porte ses fruits',body:`« ${x.title} » commence au niveau ${x.journeyBonus.after}/7.`,consequences:[`Qualité ${before} → ${x.journeyBonus.after}. Le bonus annoncé est consommé une seule fois.`]});}
function meetingChoice(s,choice){const e=s.journey?.encounter;if(!e||!['offered','decision'].includes(e.phase))return false;if(choice==='decline'){e.phase='leaving';e.leaveAt=s.tick+5;return true;}if(e.phase==='offered'&&choice==='trial'&&s.people.length<6){e.phase='visiting';e.started=s.tick;e.until=s.tick+Math.ceil((1440-W().minute(s))/10);e.room='kitchen';e.x=410;e.y=790;S().log(s,'Une semaine pour se découvrir',`${e.candidate.name} passe à la maison pour échanger et jammer. La décision se prendra après une semaine d’essai.`,'arrival');return true;}
if(e.phase==='decision'&&choice==='join'){if(!e.verdict.band||!e.verdict.candidate||s.people.length>=6)return false;e.phase='joining';const ok=S().recruit(s,e.candidate.id);e.phase=ok?'joined':'decision';if(ok){for(const [id,score] of Object.entries(e.contacts))s.relations[[id,e.candidate.id].sort().join(':')]=Math.min(5,score);S().log(s,'Une place dans le groupe',`${e.candidate.name} rejoint officiellement le collectif après l’essai.`,'arrival');}return ok;}return false;}
function canRecruit(s,id){return !s.journey||s.journey.encounter?.phase==='joining'&&s.journey.encounter.candidate.id===id;}
function tick(s){const e=s.journey?.encounter;if(!e||e.phase!=='visiting')return;e.room=W().minute(s)<600?'kitchen':W().minute(s)<1020?'garage':'salon';if(root.MaisonShows.busy(s))return;if(s.music.session){e.room='garage';e.action='practice';e.songId=s.music.session.songId;}else{e.action=W().minute(s)<600?'talk':s.calendar.focus?.action==='party'?'party':'talk';if(e.action==='party')e.room='kitchen';delete e.songId;}
for(const p of s.people)if(p.room===e.room&&!p.travel&&(e.lastContact[p.id]??-99)<=s.tick-6){e.lastContact[p.id]=s.tick;e.contacts[p.id]=Math.min(6,(e.contacts[p.id]||0)+1);}
if(s.tick<e.until)return;const c=e.candidate;e.votes=s.people.map(p=>{const contact=e.contacts[p.id]||0,likes=p.style===c.style||p.interests.includes(c.style),yes=contact>=2||likes||S().has(p,'sociable');return {id:p.id,yes,reason:contact>=2?'Les moments partagés ont créé un lien.':likes?'Une affinité musicale nous rapproche.':yes?'Envie de faire une place à cette personnalité.':'Pas encore assez de complicité pendant cet essai.'};});const yes=e.votes.filter(v=>v.yes).length;e.verdict={band:yes>s.people.length/2,candidate:Object.values(e.contacts).reduce((a,b)=>a+b,0)>=3||s.people.some(p=>p.style===c.style)};e.phase='decision';}
root.MaisonJourney={acts,currentAct,requirements,acknowledgeArc,acknowledgeWriting,assess,previewResult,stages,init,stageWeek,options,rewardText,choose,destination,scheduled,needsChoice,blocked,finishShow,claimCard,consumeWriting,meetingChoice,canRecruit,tick};if(typeof module!=='undefined')module.exports=root.MaisonJourney;
})(globalThis);

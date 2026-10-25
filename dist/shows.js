(function(root){
'use strict';
const B=()=>root.MaisonBandLive||(typeof require==='function'?require('./bandlive.js'):null);
const W=()=>root.MaisonWeeks,S=()=>root.MaisonSim,M=()=>root.MaisonMusic;
const month=s=>Math.ceil(W().week(s)/4);
const weekInMonth=s=>(W().week(s)-1)%4+1;
const homePhases=['preparing','coffee','packing','unpacking'];
const busy=s=>!!s.tour?.active;
const blocking=s=>busy(s)&&!homePhases.includes(s.tour.active.phase);
const isShowWeek=s=>scheduled(s,W().week(s))&&!completed(s,W().week(s));
const atHour=(s,h)=>(Math.floor((W().total(s)-480)/1440)*1440+h*60-s.calendar.baseMinutes)/10;
const activity=s=>({preparing:'Se prépare pour le show',coffee:'Prend un café avec le groupe',packing:'Prépare son instrument',departing:'Part au show',stage:'Au show',result:'Au show',returning:'Rentre du show',unpacking:'Range son instrument'}[s.tour?.active?.phase]||'');
function init(s){
 const week=W().week(s),minute=W().minute(s);
 if(!s.tour)s.tour={version:4,firstShowWeek:Math.max(8,Math.ceil(week/8)*8+(week%8===0&&minute!==480?8:0)),active:null,completed:[]};
 if(s.tour.version<4){
  const a=s.tour.active;
  if(a&&s.tour.version<2){a.endTick=Math.max(s.tick,atHour(s,22));a.departTick=atHour(s,11);}
  s.tour.firstShowWeek=a?(Math.floor(a.week/8)+1)*8:Math.max(8,Math.ceil(week/8)*8+(week%8===0&&minute!==480?8:0));
  if(s.guidance&&!s.guidance.done.includes('ready')&&!s.tour.completed.length)s.guidance.deadlineWeek=a?.week||s.tour.firstShowWeek;
  for(const record of s.tour.completed)record.week??=record.month*4;
  s.tour.version=4;
  const pending=s.calendar?.pending;if(pending?.phase==='month'){pending.fromWeek=pending.week+1;pending.toWeek=nextShowWeek(s);pending.title='Les instruments sont rangés · quel cap jusqu’au prochain show ?';}
  delete s.tour.firstShowMonth;
 }
 if(s.tour.returnHour!==22){const a=s.tour.active;if(a&&!['returning','unpacking'].includes(a.phase))a.endTick=Math.max(s.tick,((a.week-1)*1440+1320-s.calendar.baseMinutes)/10);s.tour.returnHour=22;}
 if(s.calendar?.pending?.phase==='month'){s.calendar.pending=null;if(W().isNight(s))s.calendar.nextAt=Math.floor(W().total(s)/1440)*1440;s.tour.recoveryUntil=s.tick+Math.ceil((1440-W().minute(s))%1440/10);}
 if(s.calendar)delete s.calendar.monthFocus;
 s.tour.audienceSeed??=Math.floor(Math.random()*2147483647)+1;
 if(s.tour.active)s.tour.active.forecast??=forecast(s,s.tour.active.week);
 return s;
}
function scheduled(s,week){if(s.journey)return root.MaisonJourney.scheduled(s,week);return week%8===0&&week>=(s.tour?.firstShowWeek||8);}
function completed(s,week){return s.tour?.completed.find(x=>x.week===week);}
function nextShowWeek(s){if(s.journey&&!s.tour?.active)return s.journey.nextWeek;if(s.tour?.active)return s.tour.active.week;let week=Math.max(W().week(s),s.tour?.firstShowWeek||8);week=Math.ceil(week/8)*8;while(completed(s,week)||week===W().week(s)&&(W().minute(s)>=1080||W().isNight(s)))week+=8;return week;}
function audienceRandom(s,week,salt=0){let n=((s.tour?.audienceSeed||1)^Math.imul(week,2654435761)^salt)>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
function forecast(s,week){const route=root.MaisonJourney?.destination(s,week);if(route)return {week,styles:[...route.styles],label:route.name,uncertainty:'Affinités annoncées · quelques goûts restent inconnus.'};const random=audienceRandom(s,week),styles=[...M().GENRES];for(let i=styles.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[styles[i],styles[j]]=[styles[j],styles[i]];}const count=1+Math.floor(random()*3);return {week,styles:styles.slice(0,count),label:count===1?'Public plutôt '+styles[0]:count===2?'Deux grandes affinités':'Public éclectique',uncertainty:'Tendances estimées · une partie du public reste inconnue.'};}
function audience(s,week){const f=forecast(s,week),random=audienceRandom(s,week,1979);return Array.from({length:root.MaisonJourney?.destination(s,week)?.fans||8},(_,i)=>({id:'spectator-'+i,genre:random()<.72?f.styles[Math.floor(random()*f.styles.length)]:M().GENRES[Math.floor(random()*M().GENRES.length)]}));}
function setlist(s){return s.music.songs.filter(M().ready).sort((a,b)=>b.quality-a.quality||b.turns-a.turns);}
function eligibility(s){init(s);return {ok:false,reason:busy(s)?activity(s)+'.':isShowWeek(s)?'Journée de show : préparation dès 8 h, café ensemble, départ à 11 h et retour à 22 h.':'Shows ordinaires tous les deux mois; finale la semaine suivant le deuxième show. Départ à 11 h, retour à 22 h.'};}
function homePhase(s,phase){const a=s.tour.active;a.phase=phase;s.people.forEach(p=>{if(p.bathroom){p.bathroom.room=phase==='preparing'?root.MaisonHouse.bedroom(p):phase==='coffee'?'kitchen':'garage';return;}p.sleeping=false;p.room=phase==='preparing'?root.MaisonHouse.bedroom(p):phase==='coffee'?'kitchen':'garage';p.action=phase==='preparing'?'rest':phase==='coffee'?'talk':'practice';p.travel=0;p.remaining=3;});}
function prepare(s){
 const a=s.tour.active={id:'show-week-'+W().week(s),month:month(s),week:W().week(s),phase:'preparing',departTick:atHour(s,11),endTick:atHour(s,22),automatic:true,forecast:forecast(s,W().week(s)),people:s.people.map(p=>p.id),songs:[],result:null};
 // Promises already in progress are explicitly interrupted; waiting invitations remain queued.
 for(const o of s.music.orders.filter(o=>o.status==='running')){o.status='cancelled';o.reason='Activité interrompue par la journée de show. Les progrès déjà acquis sont conservés.';o.updated=s.tick;}
 if(s.music.session)S().log(s,'Le garage se prépare au départ','La séance est interrompue pour la journée de show. Les progrès déjà acquis sont conservés.','music');
 s.music.session=null;s.sharedActivities=[];s.calendar.focus=null;s.calendar.pending=null;
 s.calendar.nextAt=Math.floor((W().total(s)-480)/1440)*1440+1440;
 s.people.forEach(p=>{p.sessionUntil=0;p.sessionSong=null;p.playerActionUntil=0;p.nightAction=null;delete p.intent;delete p.nightPlan;});
 homePhase(s,'preparing');
 S().log(s,'C’est la semaine du show !','Préparation au réveil, café ensemble à 9 h, instruments à 10 h et départ groupé à 11 h. Retour prévu à 22 h.','event');
 return a;
}
function begin(s){const a=s.tour?.active;if(!a||!['preparing','coffee','packing'].includes(a.phase)||s.tick<a.departTick)return false;a.phase='departing';a.departedAt=s.tick;a.audience=audience(s,a.week);a.deck=M().cards.concertDeck(s,a.people);a.songs=setlist(s).map(x=>({id:x.id,title:x.title,genre:x.genre,turns:x.turns,energyPerTurn:x.energyPerTurn,quality:x.quality,arrangementRoll:x.arrangementRoll,progress:100}));s.people.forEach(p=>p.travel=0);S().log(s,'Tout le monde est prêt !',`Le groupe part ensemble au show de la semaine ${a.week}. Retour à 22 h.`,'event');return a;}
function ensureDue(s){init(s);if(busy(s))return true;if(!isShowWeek(s)||W().minute(s)<480||W().minute(s)>=1080||s.calendar.night)return false;prepare(s);advanceMorning(s);return true;}
function advanceMorning(s){const a=s.tour.active;if(!a)return;if(s.tick>=a.departTick){begin(s);return;}const phase=W().minute(s)>=600?'packing':W().minute(s)>=540?'coffee':'preparing';if(a.phase!==phase){homePhase(s,phase);S().log(s,phase==='coffee'?'Un dernier café ensemble':'Les étuis s’ouvrent',phase==='coffee'?'Les musiciens se retrouvent dans la cuisine avant de prendre la route.':'Tout le groupe rejoint le garage pour préparer les instruments.','home');}}
function interceptStep(s,rng=Math.random){if(!ensureDue(s))return false;const a=s.tour.active;if(['preparing','coffee','packing'].includes(a.phase))advanceMorning(s);else if(a.phase==='unpacking'&&s.tick>=a.unpackUntil)finishHome(s,rng);return true;}
function arriveAtVenue(s){const a=s.tour?.active;if(!a||a.phase!=='departing')return false;a.deck??=M().cards.concertDeck(s,a.people);a.phase='stage';return true;}
function cardEffects(s,uid,context={}){const a=s.tour?.active,card=a?.deck?.find(c=>c.uid===uid);const energy=a?.live?.actors.find(p=>p.id===card?.personId)?.needs.energy??card?.energy;return card?M().cards.effects(card.cardId,energy,{...context,personId:card.personId}):null;}
function startLive(s){
 const a=s.tour?.active;if(!a||a.phase!=='stage'||!a.songs.length)return null;if(a.live){a.live.actors.forEach(p=>p.maisonProfile=true);return a.live;}
 a.deck??=M().cards.concertDeck(s,a.people);a.energyBefore=Object.fromEntries(a.people.map(id=>[id,s.people.find(p=>p.id===id).energy]));
 const people=a.people.map((id,index)=>{const p=s.people.find(p=>p.id===id);return {id:p.id,name:p.name,instrument:M().cards.instrumentKey(p),genre:p.style,color:p.color||'#a795c8',identity:p.identity||{accessory:['hair','glasses','cap'][index%3],movement:S().has(p,'spontan')?'flamboyant':S().has(p,'solitaire')?'shy':'calm'},personality:{},skill:0,needs:{energy:p.energy},bandLiveDeck:a.deck.filter(c=>c.personId===id).map(c=>c.cardId==='note'?'note':c.cardId.split('-').at(-1))};});
 const seed=((s.tour.audienceSeed||1)^Math.imul(a.week,2654435761))>>>0;
 a.live=B().createBandLive({people,groupId:'maison',groupName:'La Maison des Accords',songs:a.songs.map(x=>({...x,style:x.genre})),seed,audienceSize:root.MaisonJourney?.destination(s,a.week)?.fans||8,audienceRules:{styles:[...M().GENRES],resistancePercent:root.MaisonJourney?.destination(s,a.week)?.resistance||65},freeSetlist:true});
 a.audience??=audience(s,a.week);a.live.fans.forEach((f,i)=>f.favorite=a.audience[i].genre);a.live.actors.forEach(p=>p.maisonProfile=true);return a.live;
}
function syncEnergy(s){const a=s.tour?.active;if(!a?.live)return;for(const actor of a.live.actors){const p=s.people.find(p=>p.id===actor.id);if(p)p.energy=actor.needs.energy;}}
function commitLiveUpdate(s){const a=s.tour?.active;if(!a?.live)return false;syncEnergy(s);if(a.phase==='stage'&&['won','lost'].includes(a.live.phase))return perform(s);return true;}
function liveAction(s,action,...args){const a=s.tour?.active;if(!a||a.phase!=='stage')return {ok:false,message:'Aucun concert en cours.'};const game=startLive(s);if(!game)return {ok:false,message:'Aucune chanson prête.'};const fn={song:B().chooseSong,card:B().playCard,turn:B().endTurn}[action];if(!fn)return {ok:false,message:'Action inconnue.'};const result=fn(game,...args);if(result.ok){syncEnergy(s);if(['won','lost'].includes(game.phase))perform(s);}return result;}
function autoShow(s){const a=s.tour?.active;if(!a||a.phase!=='stage')return false;const game=startLive(s);if(game){B().simulateBandLive(game);syncEnergy(s);}return perform(s);}
function perform(s){
 const a=s.tour?.active;if(!a||a.phase!=='stage')return false;const game=a.live;if(a.songs.length&&(!game||!['won','lost'].includes(game.phase)))return false;syncEnergy(s);
 const conquered=game?.fans.filter(f=>f.hp===0).length||0,total=game?.fans.length||0,score=game?Math.round(100*game.fans.reduce((n,f)=>n+1-f.hp/f.max,0)/total):0;
 a.result={mode:'bandlive',outcome:game?.phase||'cancelled',title:!game?'Pas de chanson prête':game.phase==='won'?'Le public est conquis !':'Le groupe a donné son show',body:game?`${conquered}/${total} spectateurs conquis · accueil ${score}/100. La fatigue du concert accompagne les musiciens à la maison.`:'Sans chanson prête, le groupe ne monte pas sur scène. Retour à la maison pour préparer le prochain show.',score,conquered,total,forecast:a.forecast,audience:game?structuredClone(game.fans):a.audience||[],deck:structuredClone(a.deck||[]),songs:game?game.usedSongs.map(id=>({...a.songs.find(x=>x.id===id)})):[],turns:game?.turn||0,people:a.people.map(id=>{const p=s.people.find(p=>p.id===id);return {id,energyBefore:a.energyBefore?.[id]??p.energy,energyAfter:p.energy};}),effects:game?[`${game.played} cartes jouées en ${game.turn} tours.`, 'Fatigue : −2 par carte pour son auteur, −1 par musicien en fin de tour.']:[]};
 root.MaisonJourney?.previewResult(s,a);a.phase='result';S().log(s,a.result.title,a.result.body,'event');return a.result;
}
function beginReturn(s){const a=s.tour?.active;if(!a||a.phase!=='result')return false;a.phase='returning';s.tick=Math.max(s.tick,a.endTick);s.people.forEach(p=>{p.room='garage';p.action='practice';p.travel=0;p.remaining=3;});return true;}
function arriveHome(s){const a=s.tour?.active;if(!a||a.phase!=='returning')return false;s.tick=Math.max(s.tick,a.endTick);s.calendar.nextAt=Math.floor(W().total(s)/1440)*1440+(W().isNight(s)?0:1440);s.calendar.focus=null;homePhase(s,'unpacking');a.unpackUntil=s.tick+3;S().log(s,'De retour à la maison','Il est temps de ranger les instruments au garage, puis chacun retrouvera sa soirée.','home');return true;}
function finishHome(s,rng=Math.random){const a=s.tour?.active;if(!a||a.phase!=='unpacking')return false;root.MaisonJourney?.finishShow(s,a);const record={id:a.id,month:a.month,week:a.week,tick:s.tick,result:a.result,forecast:a.forecast};s.tour.completed.push(record);s.tour.active=null;s.tour.recoveryUntil=s.tick+Math.ceil((1440-W().minute(s))%1440/10);s.sharedActivities=[];s.people.forEach(p=>{delete p.intent;S().start(s,p,S().choose(s,p,rng));});s.calendar.pending=null;delete s.calendar.monthFocus;S().log(s,'La soirée leur appartient','Les instruments sont rangés. Place au repos et aux discussions jusqu’au bilan habituel de minuit.','home');return record;}
// Kept as inert compatibility hooks for old UI references; no postshow choices.
function monthChoices(){return [];}
function chooseMonth(){return null;}
root.MaisonShows={commitLiveUpdate,startLive,liveAction,autoShow,nextShowWeek,forecast,cardEffects,init,month,weekInMonth,busy,blocking,activity,isShowWeek,interceptStep,scheduled,completed,setlist,eligibility,begin,ensureDue,arriveAtVenue,perform,beginReturn,arriveHome,monthChoices,chooseMonth};if(typeof module!=='undefined')module.exports=root.MaisonShows;
})(typeof globalThis!=='undefined'?globalThis:this);

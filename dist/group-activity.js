(function(root){
'use strict';
const titles={party:'Fête au salon',jam:'Jam au garage',talk:'Discussion ensemble',practice:'Pratique ensemble',compose:'Composition en commun'};
function snapshot(s){
 const running=[],waiting=[],known=new Set();
 const valid=ids=>[...new Set(ids||[])].filter(id=>s.people.some(p=>p.id===id));
 function add(item){
  const people=valid(item.people);if(people.length<2)return;
  const started=item.started??s.tick,until=Math.max(started+1,item.until??s.tick+1);
  running.push({...item,people,started,until,progress:Math.max(0,Math.min(100,Math.round((s.tick-started)/(until-started)*100))),remaining:Math.max(0,until-s.tick)*10,duration:(until-started)*10});
  people.forEach(id=>known.add(id));
 }
 const outing=s.tour?.active;
 if(outing&&['preparing','coffee','packing','unpacking'].includes(outing.phase)){
  const duration=outing.phase==='unpacking'?3:6;
  const until=outing.phase==='unpacking'?outing.unpackUntil:outing.departTick-({preparing:12,coffee:6,packing:0}[outing.phase]);
  add({title:root.MaisonShows.activity(s),people:outing.people,started:until-duration,until});
 }
 if(root.MaisonWeeks?.isNight(s)&&s.calendar.night){
  const people=s.people.filter(p=>!p.sleeping&&p.nightAction==='party').map(p=>p.id);
  add({title:'Fête jusqu’au matin',people,started:s.calendar.night.startTick,until:s.calendar.night.wakeTick});
 }
 if(!root.MaisonShows?.busy(s)&&!root.MaisonWeeks?.isNight(s)){
  for(const r of root.MaisonActivities.reservations(s)){
   const people=r.people.filter(id=>{const p=s.people.find(p=>p.id===id);return p&&p.action===r.action&&(p.room===r.room||r.action==='party'&&p.room==='kitchen');});
   add({...r,people,title:r.songId?(r.kind==='trial'?'Essai de chanson':'Répétition du répertoire'):titles[r.action]});
  }
  // Coauthors actually working on the same song, not unrelated solo compositions.
  for(const song of s.music.songs){
   const people=s.people.filter(p=>!known.has(p.id)&&p.action==='compose'&&p.projectId===song.id&&song.authors.includes(p.id)&&!p.sleeping&&song.progress<100);
   if(people.length>=2)add({title:titles.compose,action:'compose',songId:song.id,people:people.map(p=>p.id),started:Math.max(...people.map(p=>p.actionStarted??s.tick)),until:Math.min(...people.map(p=>s.tick+(p.travel||0)+(p.remaining||1)))});
  }
  for(const action of ['talk','jam','party']){
   const locations=action==='talk'?['kitchen','salon','patio']:[root.MaisonSim.ACTIONS[action].room];
   for(const room of locations){const people=s.people.filter(p=>!known.has(p.id)&&p.action===action&&!p.sleeping&&(p.room===room||action==='party'&&p.room==='kitchen'));
    if(people.length>=2)add({title:room==='patio'?'Discussion au patio':titles[action],action,room,people:people.map(p=>p.id),started:Math.max(...people.map(p=>p.actionStarted??s.tick)),until:Math.min(...people.map(p=>s.tick+(p.travel||0)+(p.remaining||1)))});
   }
  }
 }
 for(const o of root.MaisonDecisions.ordered(s)){
  if(o.status!=='waiting'||o.suspended||!['trial','practice','jam','coffee','duo','compose','continue','polish','revise','explore','suggest'].includes(o.type))continue;
  const song=s.music.songs.find(x=>x.id===o.songId);
  const all=['trial','practice'].includes(o.type)||['jam','coffee'].includes(o.type)&&o.eventType!=='tension';
  const people=valid(all?s.people.map(p=>p.id):o.people||o.ids||(o.personId?[o.personId]:song?.authors));
  if(people.length<2)continue;
  const gate=root.MaisonDecisions.preflight(s,o);
  waiting.push({created:o.created,id:o.id,title:o.title,people,songId:o.songId,reason:gate.reason||o.reason});
 }
 // Calendar invitations are separate from explicit player orders.
 const f=s.calendar?.focus;
 if(f&&f.until>s.tick&&!f.future&&['party','jam','talk','practice'].includes(f.action)){
  const people=valid(f.people).filter(id=>{const p=s.people.find(p=>p.id===id);return p.intent?.action===f.action;});
  const active=running.some(r=>r.songId&&r.songId===f.songId||!f.songId&&r.action===f.action);
  const song=s.music.songs.find(x=>x.id===f.songId);
  const blocked=people.some(id=>{const p=s.people.find(p=>p.id===id);return !p.intent.applied||p.playerActionUntil>s.tick;});
  const minimum=f.songId&&song&&!song.adopted?root.MaisonMusic.trialMinimum(s):2;
  if(people.length>=minimum&&!active&&(blocked||f.songId&&song&&!root.MaisonMusic.ready(song)&&!f.trialAttempted))waiting.push({created:f.started??s.tick,id:'focus',title:f.label,people,songId:f.songId,reason:root.MaisonShows?.busy(s)?'Après le retour du show.':'Attend la disponibilité des volontaires ou du garage.'});
 }
 // Stable sorting preserves submission order for actions created in the same tick.
 waiting.unshift(...(root.MaisonWeeks?.pausedView(s)||[]).filter(a=>a.people.length>=2));
 waiting.sort((a,b)=>Number(!!b.priority)-Number(!!a.priority)||(a.created??0)-(b.created??0));
 return {running,waiting};
}
root.MaisonGroupActivity={snapshot};if(typeof module!=='undefined')module.exports=root.MaisonGroupActivity;
})(globalThis);

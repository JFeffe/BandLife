(function(root){
'use strict';
const names={toilet:'Toilettes',compose:'Composer',practice:'Répétition',jam:'Jam',talk:'Discussion',party:'Faire la fête',rest:'Repos'};
function snapshot(s,id){
 const p=s.people.find(p=>p.id===id);if(!p)return null;
 const intent=p.intent&&p.intent.until>s.tick?p.intent:null;
 const ss=s.music.session,session=ss?.participants.includes(id)?ss:null;
 const group=root.MaisonGroupActivity?.snapshot(s).running.find(a=>a.people.includes(id));
 const busy=!!s.tour?.active,night=!!s.calendar?.night;
 const action=p.sleeping?'sleep':p.action;
 const started=session?.started??group?.started??p.actionStarted??s.tick;
 const until=p.sleeping?s.calendar.night?.wakeTick:session?.ends??group?.until??p.actionEnds??s.tick+(p.travel||0)+(p.remaining||0);
 const songId=session?.songId??group?.songId??(action==='compose'?root.MaisonMusic.findProject(s,p)?.id:null);
 const current={title:busy?root.MaisonShows.activity(s):p.sleeping?'Dort':session?(session.kind==='trial'?'Essai de chanson':'Répétition'):p.room==='patio'&&['rest','talk'].includes(action)?(action==='rest'?'Détente au patio':'Discussion au patio'):names[action]||'Activité libre',action,songId,people:group?.people||session?.participants||[id],room:p.room,travel:p.travel>0,remaining:Math.max(0,(until||s.tick)-s.tick)*10,progress:Math.max(0,Math.min(100,Math.round((s.tick-started)/Math.max(1,(until||s.tick+1)-started)*100)))};
 const waiting=root.MaisonDecisions.ordered(s).filter(o=>o.status==='waiting'&&!o.suspended).filter(o=>{
  if(['trial','practice','rest'].includes(o.type)||['jam','coffee'].includes(o.type)&&o.eventType!=='tension')return true;
  const song=s.music.songs.find(x=>x.id===o.songId);
  return (o.people||o.ids||(o.personId?[o.personId]:song?.authors)||[]).includes(id);
 }).map(o=>({id:o.id,title:o.title,songId:o.songId,reason:root.MaisonDecisions.preflight(s,o).reason||o.reason,invitation:true}));
 waiting.unshift(...(root.MaisonWeeks?.pausedView(s)||[]).filter(a=>a.people.includes(id)));
 let direction=null;
 if(intent&&!night&&!busy){
  const phase=intent.phase||s.calendar.focus?.phase;
  const hour=phase==='morning'?'10 h':phase==='evening'?'17 h':intent.startTick>s.tick?'Demain':'8 h';
  const promised=p.playerActionUntil>s.tick;
  const active=action===intent.action&&!session&&!promised&&!p.travel&&intent.startTick<=s.tick;
  direction={title:names[intent.action]||intent.label,label:intent.label,action:intent.action,songId:intent.songId||(intent.action==='compose'?root.MaisonMusic.findProject(s,p)?.id:null),hour,until:intent.until,active,future:intent.startTick>s.tick};
 }
 return {current,waiting,direction,refusal:p.lastResponse&&!p.lastResponse.accepted?p.lastResponse:null};
}
root.MaisonPersonActivity={snapshot};if(typeof module!=='undefined')module.exports=root.MaisonPersonActivity;
})(globalThis);

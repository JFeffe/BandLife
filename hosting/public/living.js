(function(root){
'use strict';
const W=()=>root.MaisonWeeks,H=()=>root.MaisonHouse;
function tick(s){
 if(['preparing','coffee'].includes(s.tour?.active?.phase))for(const p of s.people)bathroomStep(s,p);const e=s.journey?.encounter;
 const partying=!root.MaisonShows?.busy(s)&&s.people.filter(p=>p.action==='party'&&!p.sleeping).length>=2;
 if(partying&&!s.partyVisitors?.some(v=>!v.leaving)){s.partyVisitors=Array.from({length:5},(_,i)=>({id:'guest-'+i,name:['Camille','Alex','Lou','Charlie','Dominique'][i],color:['#9c8065','#737e9c','#b47c79','#80966a','#c3a064'][i],skin:'#deb591',hair:'#514138',x:410,y:790,room:'outside',targetRoom:['salon','patio','kitchen','kitchen','salon'][i],arrivedAt:s.tick}));}
 for(const [i,v] of (s.partyVisitors||[]).entries()){if(!partying)v.leaving=true;if(v.invitedBy&&!v.leaving){v.targetRoom=H().bedroom(s.people.find(p=>p.id===v.invitedBy));continue;}if(!v.leaving&&s.tick>=v.arrivedAt+5&&s.tick%8===i)v.targetRoom=['salon','patio','kitchen','studio','garage'][(Math.floor(s.tick/8)+i)%5];}
}
function bathroomStep(s,p){
 const minute=W().minute(s),week=W().week(s);
 if(p.bathroom){if(p.travel>0){p.travel--;return true;}if(--p.remaining>0)return true;const old=p.bathroom;p.bathroom=null;Object.assign(p,old);p.travel=4;p.toiletWeek=week;return true;}
 if(minute<480||minute>=600||p.toiletWeek===week||p.sessionUntil>s.tick||p.sleeping||s.people.some(q=>q.bathroom))return false;
 p.bathroom={action:p.action,room:p.room,remaining:p.remaining};p.action='toilet';p.room='toilet';p.travel=0;p.remaining=1;p.actionStarted=s.tick;p.actionEnds=s.tick+3;return true;
}
root.MaisonSim.ACTIONS.toilet={label:'Aux toilettes',noun:'Aller aux toilettes',room:'toilet',cost:0,duration:1};
root.MaisonLiving={tick,bathroomStep,invite(s,personId,guestId){const p=s.people.find(p=>p.id===personId),v=s.partyVisitors?.find(v=>v.id===guestId&&!v.leaving);if(!p||!v)return false;v.invitedBy=p.id;v.targetRoom=H().bedroom(p);root.MaisonSim.start(s,p,'rest');p.room=H().bedroom(p);return true;}};if(typeof module!=='undefined')module.exports=root.MaisonLiving;
})(globalThis);

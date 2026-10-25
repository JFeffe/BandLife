(function(root){
'use strict';
// Host-owned save; only the live game object is shared with Simon's UI.
function world(s){
 const a=s.tour?.active,g=a?.live;if(!g)throw Error('Aucun concert à relier.');
 const songs=a.songs.map(x=>{const original=s.music.songs.find(y=>y.id===x.id);return {...x,ownerGroupId:'maison',authors:original?.authors||[],authorNames:Object.fromEntries(s.people.map(p=>[p.id,p.name]))};});
 const group={id:'maison',name:g.groupName,genre:s.people[0].style,members:[...a.people],archivedAt:null,state:'active',repertoire:songs.map(x=>({songId:x.id,active:true,mastery:100}))};
 const opportunity={id:a.id,name:root.MaisonJourney?.destination(s,a.week)?.name||'Show de la semaine '+a.week,venue:'garage',crowd:g.fans.length,styles:a.forecast.styles,organizer:{exigence:30},slots:[]};
 const result=a.result||{score:0};
 const show={id:a.id,groupId:'maison',groupName:g.groupName,opportunityId:a.id,opportunityName:opportunity.name,sourceOpportunity:opportunity,role:'Concert de la maison',preview:false,status:a.result?'finished':'playing',applied:!!a.result,actors:g.actors,result,bandLive:{game:g}};
 const showHistory=a.result?[{id:a.id,result,musicianEffects:a.result.people.map(p=>({...p,name:s.people.find(x=>x.id===p.id)?.name||p.id})),individualXp:[]}]:[];
 return {playerId:s.playerId||s.people[0].id,people:g.actors,groups:[group],songs,performance:show,showEventId:a.id,season:{opportunities:[opportunity]},eventArchive:[],bookings:[],showHistory};
}
function update(s,projection){root.MaisonShows.commitLiveUpdate(s);Object.assign(projection,world(s));return projection;}
root.MaisonShowAdapter={world,update};if(typeof module!=='undefined')module.exports=root.MaisonShowAdapter;
})(globalThis);

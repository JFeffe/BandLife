(function(root){
'use strict';
const WIDTH=1200,HEIGHT=800,HALL=240,ENTRY=[410,790],GARAGE_EXIT=[1030,685];
// Door anchors and corridor nodes follow the same geometry as the SVG floor plan.
const rooms={
 salon:{door:[445,580],anchor:'salonSide',slots:[[530,395],[665,420],[550,535],[680,560],[610,590],[700,340]],label:'Salon'},
 kitchen:{door:[850,225],anchor:'kitchenHall',slots:[[795,125],[955,130],[875,180],[1030,150],[1120,190],[975,190]],label:'Cuisine'},
 studio:{door:[825,265],anchor:'studioHall',slots:[[795,390],[850,425],[795,480],[850,525],[795,570],[850,590]],label:'Studio'},
 garage:{door:[1030,265],anchor:'garageHall',slots:[[1090,375],[960,415],[1020,485],[1110,530],[960,585],[1060,600]],label:'Garage'},
 patio:{door:[600,225],anchor:'salonHall',slots:[[505,115],[560,135],[630,100],[680,150],[620,185],[505,185]],label:'Extérieur · Patio'},
 toilet:{door:[505,645],anchor:'salonInside',slots:[[505,690]],label:'Toilettes'}
};
const nodes={leftTop:[60,240],rightTop:[410,240],leftBottom:[60,710],rightBottom:[410,685],entryHall:[410,710],outside:ENTRY,
 salonHall:[600,240],studioHall:[825,240],kitchenHall:[850,240],garageHall:[1030,240],salonSide:[410,580],salonInside:[505,610]};
const links=[['leftTop','rightTop'],['rightTop','salonHall'],['salonHall','studioHall'],['studioHall','kitchenHall'],['kitchenHall','garageHall'],['right1','salonSide'],['salonSide','right2'],['salon','salonInside'],['leftBottom','entryHall'],['rightBottom','entryHall'],['entryHall','outside']];
for(let row=0;row<3;row++)for(let col=0;col<2;col++){
 const id='bedroom'+(row*2+col+1),y=260+row*140,side=col?'right':'left',anchor=side+row;
 rooms[id]={door:[col?378:90,y+80],anchor,slots:[[col?325:180,y+85]],label:'Chambre '+(row*2+col+1)};
 nodes[anchor]=[col?410:60,y+80];links.push([row?side+(row-1):side+'Top',anchor]);if(row===2)links.push([anchor,side+'Bottom']);
}
for(const [id,r] of Object.entries(rooms)){nodes[id]=r.door;links.push([id,r.anchor]);}
function lightPhase(minute){return minute<480?'night':minute<600?'morning':minute<1020?'day':'evening';}
const bedroom=p=>p.bedroomId||'bedroom1';
function init(s){const migrate=o=>{if(!o)return;if(o.room==='dining')o.room='kitchen';if(o.targetRoom==='dining')o.targetRoom='kitchen';};for(const p of s.people){migrate(p);migrate(p.bathroom);}for(const e of s.calendar?.night?.people||[])migrate(e.resume);for(const a of s.sharedActivities||[])migrate(a);for(const v of s.partyVisitors||[])migrate(v);migrate(s.journey?.encounter);s.people.forEach((p,i)=>{p.bedroomId='bedroom'+(i+1);if(p.room?.startsWith('bedroom')||!rooms[p.room])p.room=bedroom(p);});for(const e of s.calendar?.night?.people||[]){const p=s.people.find(p=>p.id===e.id);if(p&&e.resume?.room==='bedroom')e.resume.room=bedroom(p);}return s;}
function occupants(s,id){return s.people.filter(p=>bedroom(p)===id);}
function garageLayout(s){const spots=[[1090,375,-9],[960,415,12],[1020,485,-8],[1110,530,-16],[960,585,14],[1060,600,-9]],rank={Batterie:0,Percussions:1,Clavier:2,Chant:3,Basse:4,Guitare:5,Saxophone:6,Trompette:7};return s.people.slice().sort((a,b)=>(rank[a.instrument]??8)-(rank[b.instrument]??8)||s.people.indexOf(a)-s.people.indexOf(b)).map((p,i)=>({id:p.id,x:spots[i][0],y:spots[i][1],angle:spots[i][2]}));}
function position(s,p){if(p.room==='garage'){const v=garageLayout(s).find(v=>v.id===p.id);if(v)return [v.x,v.y];}const r=rooms[p.room]||rooms[bedroom(p)];const i=p.room.startsWith('bedroom')?occupants(s,p.room).findIndex(q=>q.id===p.id):s.people.findIndex(q=>q.id===p.id);return r.slots[Math.max(0,i)%r.slots.length];}
function path(from,to,destination){
 from=from==='dining'?'kitchen':from;to=to==='dining'?'kitchen':to;
 if(from===to||!nodes[from]||!nodes[to])return [destination];
 const distances={[from]:0},previous={},pending=new Set(Object.keys(nodes));
 while(pending.size){const u=[...pending].reduce((a,b)=>(distances[a]??Infinity)<(distances[b]??Infinity)?a:b);if(!Number.isFinite(distances[u]))break;pending.delete(u);if(u===to)break;
 for(const edge of links){const v=edge[0]===u?edge[1]:edge[1]===u?edge[0]:null;if(!v||!pending.has(v))continue;const d=distances[u]+Math.hypot(nodes[u][0]-nodes[v][0],nodes[u][1]-nodes[v][1]);if(d<(distances[v]??Infinity)){distances[v]=d;previous[v]=u;}}}
 const ids=[to];while(ids[0]!==from){const prev=previous[ids[0]];if(!prev)return [destination];ids.unshift(prev);}
 return [...ids.map(id=>nodes[id].slice()),destination];
}
// The band loads through the wide garage door; visitors use the front entrance.
function tourPath(room,destination,returning=false){const threshold=[1030,640],inside=room==='garage'?[threshold]:path(room,'garage',threshold),out=[GARAGE_EXIT.slice(),[1030,770]];
 return returning?[...out.slice().reverse(),...inside.slice().reverse(),destination]:[...inside,...out,destination];}
root.MaisonHouse={WIDTH,HEIGHT,HALL,ENTRY,GARAGE_EXIT,nodes,links,tourPath,rooms,bedroom,init,occupants,position,path,garageLayout,lightPhase};if(typeof module!=='undefined')module.exports=root.MaisonHouse;
})(typeof globalThis!=='undefined'?globalThis:this);

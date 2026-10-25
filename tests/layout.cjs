const assert=require('node:assert/strict');
const H=require('../dist/house.js');
// Every room-to-room path must use a connected corridor, with no unrelated room shortcuts.
const ids=Object.keys(H.rooms), pointKey=p=>p.join(',');
const edges=new Set(H.links.flatMap(([a,b])=>[pointKey(H.nodes[a])+'|'+pointKey(H.nodes[b]),pointKey(H.nodes[b])+'|'+pointKey(H.nodes[a])]));
for(const from of [...ids,'outside'])for(const to of [...ids,'outside']){
 if(from===to)continue;
 const end=to==='outside'?H.ENTRY:H.rooms[to].slots[0],path=H.path(from,to,end);
 assert.deepEqual(path[0],H.nodes[from]);assert.deepEqual(path.at(-1),end);
 for(let i=1;i<path.length-1;i++)assert(edges.has(pointKey(path[i-1])+'|'+pointKey(path[i])),`${from} → ${to}: disconnected segment`);
 for(const third of ids.filter(x=>x!==from&&x!==to&&!(x==='salon'&&[from,to].includes('toilet'))))assert(!path.slice(1,-2).some(p=>pointKey(p)===pointKey(H.rooms[third].door)),`Shortcut through ${third}`);
}
for(const id of ids){
 const away=H.tourPath(id,[975,770]),home=H.tourPath(id,H.rooms[id].slots[0],true);
 assert(away.some(p=>pointKey(p)===pointKey(H.GARAGE_EXIT)));assert(home.some(p=>pointKey(p)===pointKey(H.GARAGE_EXIT)));
 assert.deepEqual(home.at(-1),H.rooms[id].slots[0]);
}
const stations=H.garageLayout({people:Array.from({length:6},(_,i)=>({id:i,instrument:['Batterie','Clavier','Chant','Basse','Guitare','Saxophone'][i]}))});
assert.equal(new Set(stations.map(p=>p.x+','+p.y)).size,6);
assert(stations.every(p=>p.x-47>=900&&p.x+47<=1170&&p.y-40>=270&&p.y+70<=680));
console.log('PASS plan: all room and visitor routes use connected doors, no private room shortcuts; six instrument spaces, garage departure and return.');
// Toilets have no hall shortcut: visitors and residents must cross the salon.
assert.equal(H.rooms.toilet.anchor,'salonInside');
assert(H.path('bedroom1','toilet',H.rooms.toilet.slots[0]).some(p=>pointKey(p)===pointKey(H.rooms.salon.door)));
assert(!H.rooms.dining);assert.equal(H.rooms.kitchen.label,'Cuisine');assert.equal(H.rooms.patio.label,'Extérieur · Patio');
const old={people:[{id:'a',room:'dining',bathroom:{room:'dining'}}],calendar:{night:{people:[{id:'a',resume:{room:'dining'}}]}},partyVisitors:[{room:'dining',targetRoom:'dining'}],sharedActivities:[{room:'dining'}],journey:{encounter:{room:'dining'}}};H.init(old);assert.equal(old.people[0].room,'kitchen');assert.equal(old.people[0].bathroom.room,'kitchen');assert.equal(old.calendar.night.people[0].resume.room,'kitchen');assert.equal(old.partyVisitors[0].targetRoom,'kitchen');assert.equal(old.journey.encounter.room,'kitchen');
console.log('PASS toilet access through salon, patio door, unified kitchen and saved dining locations migrated.');

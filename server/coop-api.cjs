'use strict';
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const error=(message,status)=>Object.assign(new Error(message),{status});
const digest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),x=>x.toString(16).padStart(2,'0')).join('');
const code=()=>Array.from(crypto.getRandomValues(new Uint8Array(8)),x=>alphabet[x%alphabet.length]).join('');
const cleanName=x=>typeof x==='string'?x.trim().slice(0,32):'';
function handler(core,store){return async request=>{
 try{
  const url=new URL(request.url),parts=url.pathname.split('/').filter(Boolean).slice(2);
  if(!['GET','POST'].includes(request.method))return json({error:'Méthode indisponible.'},405);
  const origin=request.headers.get('origin');if(origin&&origin!==url.origin)throw error('Origine refusée.',403);
  const raw=request.method==='POST'?await request.text():'';if(raw.length>4096)throw error('Commande trop volumineuse.',413);
  let input={};try{if(raw)input=JSON.parse(raw);}catch{throw error('Commande invalide.',400);}if(!input||typeof input!=='object'||Array.isArray(input))throw error('Commande invalide.',400);
  const token=request.headers.get('authorization')?.replace(/^Bearer /,'');if(!/^[a-f0-9]{64}$/.test(token||''))throw error('Rejoins une maison pour continuer.',401);
  const owner=await digest(token),now=Date.now();
  if(parts[0]==='create'&&request.method==='POST'){
   const name=cleanName(input.name);if(!name||!Number.isInteger(input.trio)||input.trio<0||input.trio>3)throw error('Choisis un nom et un trio.',400);
   // Retrying a lost create response resumes the same room, not a second room.
   const previous=await store.findOwner(owner);if(previous)return json({code:previous.code,...core.view(previous.room,0)});
   for(let i=0;i<4;i++){const id=code(),room=core.create(name,input.trio,crypto.getRandomValues(new Uint32Array(1))[0]);const record={code:id,owners:[owner,null],room,receipts:[],created:now,updated:now};if(await store.insert(record))return json({code:id,...core.view(room,0)},201);}
   throw error('Réessaie la création dans un instant.',503);
  }
  const id=parts[0]?.toUpperCase();if(!/^[A-HJ-NP-Z2-9]{8}$/.test(id||''))throw error('Code de session invalide.',404);
  for(let attempt=0;attempt<6;attempt++){
   const record=await store.get(id);if(!record)throw error('Session introuvable.',404);let seat=record.owners.indexOf(owner);
   if(request.method==='GET'){if(seat<0)throw error('Tu ne fais pas partie de cette session.',403);return json({code:id,...core.view(record.room,seat)});}
   const oldRevision=record.room.revision;
   if(parts[1]==='join'){
    if(seat>=0)return json({code:id,...core.view(record.room,seat)});
    const name=cleanName(input.name);if(!name||!Number.isInteger(input.trio)||input.trio<0||input.trio>3)throw error('Choisis un nom et un trio.',400);
    core.join(record.room,name,input.trio);record.owners[1]=owner;seat=1;
   }else if(parts[1]==='command'){
    if(seat<0)throw error('Tu ne fais pas partie de cette session.',403);
    if(!/^[a-zA-Z0-9-]{16,64}$/.test(input.commandId||''))throw error('Identifiant de commande invalide.',400);
    if(record.receipts.includes(seat+':'+input.commandId))return json({code:id,...core.view(record.room,seat)});
    if(input.epoch!==record.room.epoch)throw error('Le tour a changé. La partie a été actualisée; refais ton choix.',409);
    core.command(record.room,seat,input);record.receipts.push(seat+':'+input.commandId);record.receipts=record.receipts.slice(-128);
   }else throw error('Action introuvable.',404);
   record.room.revision++;record.updated=now;
   if(await store.save(record,oldRevision))return json({code:id,...core.view(record.room,seat)});
  }
  throw error('La session est occupée. Réessaie dans un instant.',409);
 }catch(e){return json({error:e.status?e.message:'La session est momentanément indisponible.'},e.status||503);}
};}
function d1Store(db){
 const decode=row=>row?JSON.parse(row.payload):null;
 return {
  async get(id){return decode(await db.prepare('SELECT payload FROM coop_rooms WHERE code = ?').bind(id).first());},
  async findOwner(owner){return decode(await db.prepare('SELECT payload FROM coop_rooms WHERE creator = ?').bind(owner).first());},
  async insert(r){try{const result=await db.prepare('INSERT OR IGNORE INTO coop_rooms (code, creator, revision, payload, updated) VALUES (?, ?, ?, ?, ?)').bind(r.code,r.owners[0],r.room.revision,JSON.stringify(r),r.updated).run();return result.meta.changes===1;}catch{throw error('Impossible de sauvegarder la session.',503);}},
  async save(r,old){const result=await db.prepare('UPDATE coop_rooms SET revision = ?, payload = ?, updated = ? WHERE code = ? AND revision = ?').bind(r.room.revision,JSON.stringify(r),r.updated,r.code,old).run();return result.meta.changes===1;}
 };
}
module.exports={handler,d1Store};

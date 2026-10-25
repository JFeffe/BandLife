(function(root){
'use strict';
// BandLive_fix_12-10-26 @ 1a87519f7714ad97e9c77e272d9b308ab9585450.
const INSTRUMENTS = Object.freeze({guitar:'Guitare',drums:'Batterie',bass:'Basse',voice:'Chant',keys:'Clavier',sax:'Saxophone',trumpet:'Trompette',percussion:'Percussions'});
const SPECIALS = Object.freeze(Object.fromEntries(Object.entries({
  guitar:{name:'Solo',cost:2,target:'single',power:8,useTempo:true,solo:true,description:'8 puissance + tout le tempo sur un spectateur. Consomme le tempo.'},
  drums:{name:'Pulsation',cost:1,target:'audience',tempo:4,description:'+4 tempo.'},
  bass:{name:'Soutien',cost:0,target:'audience',tempo:1,boost:3,description:'+1 tempo. +3 puissance à la prochaine carte de puissance du tour.'},
  voice:{name:'Refrain',cost:2,target:'audience',power:5,description:'5 puissance sur tous les spectateurs.'},
  keys:{name:'Accord',cost:1,target:'audience',power:2,tempo:2,description:'+2 tempo. 2 puissance sur tous les spectateurs.'},
  sax:{name:'Improvisation',cost:2,target:'audience',power:0,useTempo:true,description:'Tout le tempo en puissance sur chaque spectateur. Consomme le tempo.'},
  trumpet:{name:'Fanfare',cost:0,target:'audience',tempo:2,description:'+2 tempo.'},
  percussion:{name:'Roulement',cost:1,target:'audience',tempo:1,boost:5,description:'+1 tempo. +5 puissance à la prochaine carte de puissance du tour.'},
}).map(([key,value])=>[key,Object.freeze(value)])));
const NOTE = Object.freeze({name:'Note',cost:1,target:'single',power:6,description:'6 puissance sur un spectateur.'});

const NEW_SPECIALS = Object.freeze({
  guitar:[{name:'Riff soutenu',cost:1,target:'single',power:5,tempoThreshold:4,thresholdPower:3,description:'5 puissance. +3 à partir de 4 tempo, sans le consommer.'},{name:'Accord explosif',cost:2,target:'single',power:8,consumeTempo:4,tempoMultiplier:2,description:'8 puissance. Consomme jusqu’à 4 tempo : +2 puissance par tempo consommé.'}],
  drums:[{name:'Mise en place',cost:1,target:'audience',tempo:3,draw:1,description:'+3 tempo. Pioche 1 carte.'},{name:'Frappe motrice',cost:1,target:'single',power:3,tempo:2,description:'3 puissance sur un spectateur. +2 tempo.'}],
  bass:[{name:'Groove stable',cost:1,target:'single',shape:'row',tempo:2,noBoredom:true,description:'+2 tempo. Empêche l’ennui de la rangée ciblée ce tour.'},{name:'Passage de relais',cost:1,target:'audience',relayBoost:4,draw:1,description:'Pioche 1 carte. +4 puissance à la prochaine carte de puissance d’un autre musicien ce tour.'}],
  voice:[{name:'Refrain entraînant',cost:1,target:'single',shape:'row',power:3,tempoThreshold:4,thresholdPower:2,description:'3 puissance sur une rangée. 5 à partir de 4 tempo, sans le consommer.'},{name:'Point culminant',cost:2,target:'audience',power:3,consumeTempo:3,description:'3 puissance sur tout le public. Consomme jusqu’à 3 tempo : +1 puissance par tempo consommé sur chaque cible.'}],
  keys:[{name:'Accord préparatoire',cost:1,target:'audience',tempo:2,draw:1,description:'+2 tempo. Pioche 1 carte.'},{name:'Harmonie expansive',cost:1,target:'single',shape:'row',power:3,consumeTempo:2,description:'3 puissance sur une rangée. Consomme jusqu’à 2 tempo : +1 puissance par tempo consommé sur chaque cible.'}],
  sax:[{name:'Phrase prolongée',cost:1,target:'single',power:5,tempoThreshold:3,thresholdDraw:1,description:'5 puissance. À partir de 3 tempo : pioche 1 carte, sans consommer le tempo.'},{name:'Écho mélodique',cost:2,target:'single',twoTargets:true,power:3,consumeTempo:4,description:'3 puissance sur 2 spectateurs distincts. Consomme jusqu’à 4 tempo une seule fois et ajoute cette quantité sur chaque cible.'}],
  trumpet:[{name:'Éclat cuivré',cost:1,target:'single',power:4,tempo:1,neighborTempo:2,description:'4 puissance et +1 tempo. Si un voisin immédiat est déjà conquis : +3 tempo au lieu de +1.'},{name:'Ralliement',cost:1,target:'single',shape:'row',tempo:2,turnStyle:true,description:'+2 tempo. Une rangée adopte le style de la chanson jusqu’à la fin du tour.'}],
  percussion:[{name:'Cadence croisée',cost:1,target:'audience',tempo:2,alternateTempo:2,description:'+2 tempo. +4 à la place si la carte précédente de ce tour vient d’un autre musicien.'},{name:'Frappe syncopée',cost:1,target:'single',power:4,tempo:1,tempoOnConquest:2,tempoCap:2,description:'4 puissance et +1 tempo. Si cette carte conquiert sa cible : +2 tempo supplémentaires.'}],
});

const instrumentKey=p=>Object.keys(INSTRUMENTS).find(k=>INSTRUMENTS[k]===(typeof p==='string'?p:p.instrument))||'guitar';
const CARDS={note:{...NOTE,text:NOTE.description}};
for(const key of Object.keys(INSTRUMENTS))for(const [kind,d] of [['special',SPECIALS[key]],['new1',NEW_SPECIALS[key][0]],['new2',NEW_SPECIALS[key][1]]])CARDS[key+'-'+kind]={...d,text:d.description,instrument:INSTRUMENTS[key],kind};
const starter=p=>['note','note',instrumentKey(p)+'-special'];
const choices=p=>['special','new1','new2'].map(k=>instrumentKey(p)+'-'+k);
function initPerson(p){
 if(!Array.isArray(p.deck)){p.deck=starter(p);p.deckVersion=2;return;}
 if(p.deckVersion===2)return;
 const old=['play','play','play',['Batterie','Basse','Percussions'].includes(p.instrument)?'pulse':'accent','accent'];
 if(JSON.stringify(p.deck)===JSON.stringify(old))p.deck=starter(p);
 else {p.legacyDeck=[...p.deck];p.deck=p.deck.map(id=>CARDS[id]?id:id==='play'?'note':instrumentKey(p)+'-'+(['duet','precision','groove'].includes(id)?'new1':['spark','chorus'].includes(id)?'new2':'special'));}
 p.deckVersion=2;
}
const penalty=energy=>Math.round(energy)>60?0:Math.round(energy)>30?2:3;
const power=(amount,energy)=>Math.max(0,amount-penalty(energy));
// Pure preview/resolution values: personal energy never pays card costs.
function effects(id,energy,context={}){
 const c=CARDS[id];if(!c)return null;
 const tempo=Math.max(0,context.tempo||0),spent=c.useTempo?tempo:Math.min(tempo,c.consumeTempo||0);
 const meets=tempo>=(c.tempoThreshold??Infinity);
 const out={cost:c.cost,target:c.target,shape:c.shape,twoTargets:!!c.twoTargets,tempoSpent:spent,tempo:c.tempo||0,draw:(c.draw||0)+(meets?(c.thresholdDraw||0):0),powerPenalty:penalty(energy)};
 if(Object.hasOwn(c,'power'))out.power=power(c.power+spent*(c.tempoMultiplier||1)+(meets?(c.thresholdPower||0):0),energy);
 if(c.boost)out.boost=power(c.boost,energy);
 if(c.relayBoost)out.relayBoost=power(c.relayBoost,energy);
 if(c.alternateTempo&&context.previousPersonId&&context.previousPersonId!==context.personId)out.tempo+=c.alternateTempo;
 if(c.neighborTempo&&context.neighborConquered)out.tempo+=c.neighborTempo;
 if(c.tempoOnConquest&&context.conquered)out.tempo+=Math.min(c.tempoOnConquest,c.tempoCap??Infinity);
 for(const key of ['noBoredom','turnStyle','solo'])if(c[key])out[key]=true;
 return out;
}
function concertDeck(s,ids=s.people.map(p=>p.id)){
 return ids.flatMap(id=>{const p=s.people.find(p=>p.id===id);if(!p)return [];initPerson(p);return p.deck.map((cardId,index)=>({uid:id+'-card-'+index,personId:id,cardId,instrument:p.instrument,energy:p.energy,powerPenalty:penalty(p.energy)}));});
}
root.MaisonCards={CARDS,INSTRUMENTS,starter,choices,initPerson,penalty,power,effects,concertDeck,instrumentKey};
if(typeof module!=='undefined')module.exports=root.MaisonCards;
})(typeof globalThis!=='undefined'?globalThis:this);

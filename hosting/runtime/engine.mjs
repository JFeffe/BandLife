(function(root){
'use strict';
const list=s=>s.split('|');
// Curated titles first; grammar-safe genre-specific combinations extend each bank.
const genres={
 Indie:{titles:list('Les fenêtres ouvertes|La lumière du salon|Nos chemins croisés|Les murs se souviennent|La ville à voix basse|Des fleurs dans le béton|La couleur des dimanches|Les trains que je regarde|Une chambre à Montréal|Nos rendez-vous manqués|Les oiseaux du balcon|La saison des détours|Des photos sans légende|Les voisins du troisième|Le goût des jours ordinaires|Un été dans tes poches|Les ombres de septembre|Ce qui reste au matin|Le bruit des clés|Les silences entre nous|La maison de travers|Des vélos sous la pluie|Le dernier appartement|Le ciel de la ruelle|Nos petites fugues|Le cinéma fermé|À deux stations de toi|Les heures suspendues|Les cartes postales oubliées|Le vent dans les rideaux|Les promesses du mercredi|Le café refroidit|Tous les chemins du retour|Les toits de notre enfance|Un jardin sur le toit|La douceur du désordre|Les lumières d’en face|Ce quartier nous ressemble|Les lettres sans adresse|Un peu plus loin qu’hier'),heads:list('Les lumières|Les souvenirs|Les ombres|Les fenêtres|Les détours|Les silences|Les couleurs|Les promesses|Les oiseaux|Les reflets|Les saisons|Les échos|Les secrets|Les visages|Les traces|Les rêves'),tails:list('de septembre|du dernier métro|de notre quartier|du dimanche soir|de la rue déserte|de ton absence|du vieux cinéma|de nos vingt ans|du balcon bleu|de la ville endormie|des étés perdus|du premier appartement|de la cour intérieure|des jours de pluie|de la maison vide|du matin gris')},
 Punk:{titles:list('Pas de permission|On ferme pas nos gueules|Le dernier avertissement|Vos règles, nos ruines|Béton et colère|Rien à vendre|Les murs vont tomber|Brûler le formulaire|Pas dans vos rangs|Le quartier se relève|Un loyer de trop|Les poings dans les poches|Aucune marche arrière|On reste dehors|La sirène du patron|Travaille et tais-toi|Pas de couronne|La rue nous appartient|Le bruit des bottes|Nos rêves en grève|Refus d’obéir|Les dents du système|Le réveil à cinq heures|Pas votre avenir|Les vitrines mentent|Une chaise pour personne|Le prix du silence|On coupe le courant|Jamais à genoux|Trop jeunes pour se taire|Le conseil des exclus|Faites place au vacarme|La rage au ventre|Le sourire obligatoire|Un autre mur de briques|La ville sous contrat|On n’a plus rien à perdre|La fête des indésirables|Le refus collectif|Demain sans patron'),heads:list('La rage|Le refus|La grève|Le vacarme|La révolte|Le réveil|Le cri|La revanche|La colère|Le sabotage|Le soulèvement|Le fracas|La résistance|Le départ|Le scandale|La mutinerie'),tails:list('des oubliés|du dernier quartier|des nuits sans repos|des portes fermées|des mains sales|des rues barrées|des jours sans salaire|des voix interdites|des enfants du béton|des matins de grève|des promesses creuses|des lendemains vendus|des poings levés|des ateliers vides|des rêves confisqués|des voisins expulsés')},
 Folk:{titles:list('Le chemin des érables|La rivière nous ramène|La maison de mon père|Le vieux pont de bois|Le dernier feu de camp|La chanson du facteur|Les bottes près du poêle|Le pain du dimanche|Quand reviendront les oies|Au bout du rang|La lettre de Madeleine|Les saisons de grand-mère|Le violon du grenier|Le retour des pêcheurs|Le vent de Gaspésie|Trois pommes dans un sac|Le train de six heures|La grange et les étoiles|Une place à la table|Le printemps après toi|Les enfants du moulin|La couverture de laine|Le sentier des bleuets|La dernière traversée|Les noms gravés dans l’arbre|Le jardin de ma mère|La terre sous les ongles|Un banc près du fleuve|La berceuse du retour|Le vieux chien du voisin|Les lumières du village|Les souliers de voyage|Le fil des générations|La pluie sur la tôle|Le café du terminus|Les mains de mon grand-père|L’ombre du clocher|La route des récoltes|L’hiver dans la vallée|Ce que raconte la rivière'),heads:list('La ballade|La berceuse|La chanson|La légende|Le souvenir|Le chemin|Le silence|La veillée|Le murmure|Le retour|La lumière|Le secret|Le refrain|La mémoire|Le voyage|La complainte'),tails:list('du vieux moulin|des grands érables|de la rivière claire|du village oublié|de la maison de pierre|des collines du Nord|du dernier hiver|de la grange rouge|des longues traversées|du jardin sauvage|de la terre promise|des pêcheurs du matin|des chemins de campagne|du feu qui s’éteint|des étoiles de novembre|du pont de bois')},
 Métal:{titles:list('La couronne de cendres|Les forges de l’abîme|Le règne des ombres|La dernière sentinelle|Les portes du néant|Le serment des exilés|La marche des titans|L’autel du silence|Sous un ciel de fer|Le dragon sans royaume|Les chaînes du trône|La cathédrale brisée|Le réveil des géants|L’armée de poussière|Les larmes de l’acier|Le pacte de minuit|La mer des damnés|La chute du soleil|Les gardiens du gouffre|La nuit des comètes|Le temple effondré|La voix du tonnerre|Les braises du monde|Le dernier rempart|Les rois sans visage|La prophétie des ruines|L’horizon dévoré|Le sang des étoiles|La montagne de verre|Les cavaliers de l’orage|Le tombeau des empires|Les racines du chaos|Le marteau du destin|La lune de cuivre|Le souffle des profondeurs|La citadelle noire|Les héritiers du vide|Le chant des Valkyries|La saison des monstres|Les ailes de l’éclipse'),heads:list('Le règne|La chute|Le serment|La couronne|La marche|Le réveil|Le tombeau|La forge|Le souffle|La vengeance|Le temple|La mémoire|Le dernier cri|Le pacte|La procession|La légende'),tails:list('des titans|de l’abîme|des rois déchus|du soleil noir|des empires perdus|du dragon de fer|des ombres anciennes|des gardiens du Nord|des cavaliers de cendre|du dernier oracle|des étoiles mortes|des armées du vide|du tonnerre éternel|des montagnes brisées|de la lune rouge|des sentinelles oubliées')},
 Jazz:{titles:list('Minuit sur Saint-Denis|Le dernier verre bleu|Septième étage|La pluie en contretemps|Le chat du pianiste|Trois heures avant l’aube|Une table près de la scène|Le saxophone du dimanche|Ballade pour un taxi|La fumée et le velours|Le sourire du bassiste|Le café des insomniaques|Une valse pour Alice|Les pavés après la pluie|La lune en sourdine|Le swing des escaliers|Deux accords de trop|La dame au manteau rouge|Le boulevard des notes bleues|Une chaise au premier rang|Les ombres du quartet|Le pas du funambule|La nuit sur le fleuve|Un billet pour Harlem|Le mystère du deuxième couplet|La dernière note du bar|Quatre mesures de silence|Un dimanche en trio|Le vinyle du vieux voisin|La fenêtre du club|Six cordes pour une étoile|Le bal des lampadaires|Une conversation sans mots|Le temps d’un solo|Le parapluie oublié|Un blues pour le matin|Le piano de la gare|Les mains du batteur|La rue des accords perdus|La dernière danse du sax'),heads:list('Un blues|Une valse|Une ballade|Un swing|Un nocturne|Un prélude|Une improvisation|Une mélodie|Un refrain|Un solo|Un interlude|Une variation|Une sérénade|Un détour|Une conversation|Un adagio'),tails:list('pour le dernier métro|pour un matin de pluie|pour les oiseaux de nuit|pour la dame en bleu|pour un piano oublié|pour le port endormi|pour un taxi jaune|pour les amants du dimanche|pour le vieux quartier|pour les toits de Paris|pour une étoile filante|pour le café désert|pour un balcon fleuri|pour les passants pressés|pour le club de minuit|pour une nuit sans fin')},
 Électro:{titles:list('Circuit de minuit|Les néons respirent|Fréquence fantôme|Dernier signal|La ville en pixels|Pulsation orbitale|Après la dernière rave|Mémoire synthétique|Contact numérique|Les satellites dansent|Le cœur de la machine|Minuit en boucle|Signal perdu|Les ondes du sommeil|La nuit magnétique|L’horizon analogique|Le rêve des automates|Sous les lasers bleus|La fréquence des corps|Connexion nocturne|Le silence des serveurs|Les miroirs de chrome|Le dernier oscillateur|Les anges du réseau|Au-delà du filtre|La gravité des basses|La dérive des néons|Le tunnel des impulsions|Soleil binaire|Les fantômes du dancefloor|Une boucle pour demain|La mémoire du synthé|Le radar des rêves|Le pouls des villes|La danse des diodes|Le ciel cathodique|Les lignes de fuite|Le circuit des étoiles|La nuit hors réseau|Réveil en stéréo'),heads:list('Fréquence|Pulsation|Mémoire|Dérive|Connexion|Transmission|Vibration|Séquence|Résonance|Impulsion|Constellation|Synchronisation|Illusion|Dimension|Radiation|Projection'),tails:list('nocturne|magnétique|orbitale|numérique|analogique|infinie|fantôme|souterraine|ultraviolette|binaire|synthétique|cosmique|parallèle|électrique|chromatique|interstellaire')},
 Ska:{titles:list('Le dernier bus danse|Les bretelles du dimanche|Le quartier en contretemps|Soleil sur le trottoir|Les cuivres du marché|Le bal des chaussures trouées|Une bière et des soucis|La fanfare des voisins|Le sourire du contrôleur|Les factures attendront|On danse à l’arrêt rouge|Le grand détour du facteur|La fête au coin de la rue|Les copains du terminus|Un parapluie pour deux|Le groove du dépanneur|Le costume à carreaux|La rue fait des claquettes|La trompette de neuf heures|Les vacances sans valise|La panne du réveil|Le café des pieds légers|Pas de drame aujourd’hui|Les vélos du dimanche|Les petits rois du balcon|Une révolution en sandales|Le dernier métro sourit|La boîte à bonnes nouvelles|Le soleil dans les flaques|La danse du chômeur|Le patron est en retard|Le cirque du quotidien|Les poches pleines de confettis|La marche des chaussettes|Le concert des casseroles|Le bonheur à crédit|La fête sans invitation|Le trottoir nous attend|Le retour des jours légers|La fanfare du lundi'),heads:list('Le bal|La danse|La fanfare|Le sourire|Le groove|La parade|Le swing|La fête|Le refrain|La tournée|La revanche|Le défilé|Le grand retour|La rumba|Le carnaval|La chanson'),tails:list('des voisins|du dernier bus|des souliers troués|des jours de paie|du marché du samedi|des copains du quartier|des matins sans réveil|des poches vides|du vieux dépanneur|des vacances improvisées|des chapeaux à carreaux|du boulevard ensoleillé|des heures de pointe|des petits bonheurs|des terrasses bondées|des lendemains légers')},
 Pop:{titles:list('Encore un refrain|Tout recommence|Danser jusqu’au matin|Ton nom sur mon écran|Le cœur en été|Juste toi et moi|On se retrouve ce soir|La chanson dans ma tête|Une seconde chance|Les étoiles dans tes yeux|Reste encore un peu|Les nuits avec toi|Jamais trop tard|La vie en couleurs|Le premier rendez-vous|Sous les lumières de la ville|La dernière chanson d’amour|Un message à minuit|Le soleil après l’orage|Les battements de nous|Tout ce qu’on peut devenir|Le sourire qui me manque|Ce soir on oublie tout|Deux billets pour demain|La photo dans mon téléphone|Les vacances avec toi|Je te reconnaîtrais partout|Le monde peut attendre|Des kilomètres de bisous|Notre été sans fin|Les mots que je gardais|Mon cœur fait du bruit|À la même heure demain|La piste est à nous|J’ai gardé ta place|On ira voir la mer|Les couleurs de ton rire|Le dernier slow|Plus près de toi|On n’a pas fini de rêver'),heads:list('Le parfum|Le souvenir|La promesse|La couleur|Le vertige|La magie|Le sourire|La lumière|Le secret|La douceur|Le rythme|La mélodie|Le frisson|Le refrain|L’étincelle|La chaleur'),tails:list('de notre été|du premier baiser|de tes messages|des nuits avec toi|de nos retrouvailles|de ce soir|du dernier slow|des jours heureux|de ton sourire|de notre histoire|des vacances à deux|de ce rendez-vous|de nos rêves|du cœur qui bat|des étoiles de juillet|de demain ensemble')}
};
const female=list('Adèle|Adriana|Agathe|Aïcha|Albane|Alexandra|Alice|Alicia|Alix|Alma|Amanda|Amandine|Amélia|Amélie|Anaïs|Anastasia|Andréa|Angèle|Anna|Annabelle|Anne|Ariane|Ariel|Aude|Audrey|Aurélie|Aurora|Ava|Béatrice|Bérénice|Blanche|Camille|Candice|Carla|Carmen|Caroline|Cassandre|Catherine|Céleste|Célia|Céline|Charlotte|Chloé|Clara|Clarisse|Claudia|Clémence|Cléo|Coline|Coralie|Dahlia|Daphné|Delphine|Diane|Éléa|Éléonore|Éliana|Élisa|Élisabeth|Élise|Ella|Élodie|Éloïse|Émilie|Emma|Emmy|Erin|Estelle|Eva|Ève|Fabienne|Fanny|Fatima|Félicie|Flavie|Flora|Florence|Frédérique|Gabrielle|Gaëlle|Geneviève|Hana|Héloïse|Iris|Isabelle|Jade|Jeanne|Jenna|Jessica|Joëlle|Johanna|Joséphine|Julia|Juliette|Justine|Karine|Kenza|Kim|Lana|Laura|Laurence|Laurie|Léa|Leïla|Léna|Léonie|Lila|Lilia|Lily|Lisa|Lise|Livia|Lou|Louane|Louise|Lucie|Lucille|Luna|Lydia|Maëlle|Maeva|Magalie|Maïa|Maïlys|Manon|Margaux|Margot|Marianne|Marie|Marilou|Marina|Marion|Mathilde|Maya|Mélanie|Mélina|Mélissa|Mia|Mila|Mireille|Mona|Myriam|Nadia|Naïma|Naomi|Natacha|Nathalie|Nina|Noémie|Nora|Océane|Olivia|Ophélie|Paola|Pauline|Pénélope|Romy|Rose|Rosalie|Roxane|Salomé|Samira|Sandra|Sara|Sarah|Sasha|Selma|Sofia|Solène|Sonia|Stella|Suzanne|Sylvie|Tania|Tess|Valentine|Valérie|Vanessa|Véronique|Victoire|Violette|Viviane|Yasmine|Yuna|Zoé|Inès');
const male=list('Aaron|Abel|Adam|Adrien|Aimé|Alain|Alban|Albert|Alex|Alexandre|Alexis|Alfred|Ali|Aloïs|Amaury|Amine|Anatole|André|Anthony|Antoine|Antonin|Armand|Arthur|Augustin|Aurélien|Axel|Baptiste|Basile|Benjamin|Benoît|Boris|Brice|Bruno|Cédric|Charles|Charlie|Christian|Clément|Colin|Corentin|Damien|Daniel|Dante|David|Denis|Dimitri|Dorian|Édouard|Élie|Élias|Elliot|Éloi|Émile|Émilien|Emmanuel|Éric|Ernest|Esteban|Étienne|Ethan|Fabien|Félix|Ferdinand|Florian|Francis|François|Gabriel|Gaël|Gaspard|Gauthier|Geoffrey|Gérald|Germain|Grégoire|Guillaume|Gustave|Hadrien|Hakim|Henri|Hugo|Idriss|Ilan|Ilyes|Isaac|Ismaël|Ivan|Jacques|Jamal|James|Jérémy|Jérôme|Joachim|Joël|Johan|Jonathan|Jordan|Joseph|Joshua|Jules|Julien|Justin|Karim|Kevin|Lamine|Laurent|Léandre|Lenny|Léo|Léon|Léonard|Liam|Lionel|Loïc|Logan|Lorenzo|Louis|Loup|Luc|Lucas|Lucien|Ludovic|Maël|Malik|Manuel|Marc|Marceau|Marco|Marius|Martin|Mathéo|Mathias|Mathieu|Matthieu|Max|Maxence|Maxime|Mehdi|Michaël|Michel|Milan|Milo|Mohamed|Morgan|Nassim|Nathan|Nicolas|Nils|Noa|Noah|Noé|Nolan|Octave|Olivier|Oscar|Owen|Pablo|Pascal|Patrice|Paul|Philippe|Pierre|Quentin|Rafael|Raphaël|Rémi|Renaud|Richard|Robin|Romain|Ronan|Ruben|Sacha|Salim|Sam|Samuel|Sébastien|Simon|Sofiane|Stéphane|Sylvain|Théo|Théodore|Thomas|Timéo|Timothée|Tom|Tristan|Valentin|Victor|Vincent|William|Xavier|Yanis|Yann|Yannick|Yohan|Youssef|Zacharie');
const surnames=list('Beaulieu|Bélanger|Bernier|Bouchard|Boucher|Caron|Charbonneau|Charpentier|Chevalier|Cloutier|Côté|Deschamps|Desjardins|Dubé|Dubois|Dufour|Dumont|Dupont|Fournier|Gagné|Gagnon|Gauthier|Girard|Gravel|Guérin|Hamel|Lacroix|Lambert|Lavoie|Leblanc|Leclerc|Lefebvre|Lemieux|Lévesque|Marchand|Martel|Mercier|Moreau|Morin|Nadeau|Pelletier|Perrin|Picard|Poirier|Renaud|Richard|Robert|Roy|Simard|Tremblay|Valois|Vasseur|Villeneuve');
const key=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
function unique(candidates,used,rng=Math.random){const start=Math.min(candidates.length-1,Math.max(0,Math.floor(rng()*candidates.length)));for(let i=0;i<candidates.length;i++){const name=candidates[(start+i)%candidates.length];if(!used.has(key(name)))return name;}return null;}
const banks=Object.fromEntries(Object.entries(genres).map(([genre,b])=>[genre,[...b.titles,...b.heads.flatMap(h=>b.tails.map(t=>h+' '+t))]]));
function song(s,genre,rng=Math.random,preferred){s.music.usedTitles??=[];const used=new Set([...s.music.usedTitles,...s.music.songs.map(x=>x.title)].map(key));let title=preferred&&!used.has(key(preferred))?preferred:unique(banks[genre]||banks.Indie,used,rng);if(!title){const base=(banks[genre]||banks.Indie)[0];let n=2;while(used.has(key(base+' · Chapitre '+n)))n++;title=base+' · Chapitre '+n;}s.music.usedTitles.push(title);return title;}
function musician(usedNames=[],gender='female',rng=Math.random){const used=new Set(usedNames.map(key)),first=gender==='female'?female:male;let name=unique(first,used,rng);if(!name)name=unique(first.flatMap(f=>surnames.map(s=>f+' '+s)),used,rng);if(!name){let n=2;while(used.has(key(first[0]+' '+surnames[0]+' '+n)))n++;name=first[0]+' '+surnames[0]+' '+n;}return name;}
function migrate(s){
 s.music.usedTitles??=[];const seen=new Set();
 for(const x of s.music.songs){if(seen.has(key(x.title)))x.title=song(s,x.genre,()=>0);seen.add(key(x.title));}
 s.music.usedTitles=[...new Set([...s.music.usedTitles,...s.music.songs.map(x=>x.title)])];
 const people=[];for(const p of s.people){if(people.some(n=>key(n)===key(p.name)))p.name=musician(people,p.gender||'female',()=>0);people.push(p.name);}
}
root.MaisonNames={genres,banks,female,male,key,song,musician,migrate};
})(globalThis);

(function(root){
'use strict';
const N=root.MaisonNames||null;
const PEOPLE=[
{id:'lea',name:'Léa',instrument:'Guitare',icon:'♬',color:'#bd663f',skin:'#efbd95',hair:'#493127',traits:['Ambitieuse','Minutieuse','Sociable'],style:'Indie',want:'Terminer une chanson'},
{id:'max',name:'Max',instrument:'Clavier',icon:'♮',color:'#6c8272',skin:'#c68c68',hair:'#342f2b',traits:['Créatif','Paresseux','Sociable'],style:'Jazz',want:'Trouver une nouvelle idée'},
{id:'ines',name:'Inès',instrument:'Chant',icon:'♪',color:'#81769c',skin:'#a96c4e',hair:'#242727',traits:['Créative','Solitaire','Sensible'],style:'Pop',want:'Composer au calme'},
{id:'noe',name:'Noé',instrument:'Batterie',icon:'♫',color:'#bf9854',skin:'#e0ad7e',hair:'#5c4034',traits:['Énergique','Spontané','Sociable'],style:'Ska',want:'Rencontrer des partenaires'},
{id:'sacha',name:'Sacha',instrument:'Basse',icon:'♭',color:'#638897',skin:'#c79476',hair:'#262a2c',traits:['Minutieux','Solitaire','Bienveillant'],style:'Jazz',want:'Trouver le bon groove'},
{id:'zoe',name:'Zoé',instrument:'Saxophone',icon:'♬',color:'#aa7180',skin:'#f0c19a',hair:'#884f2c',traits:['Ambitieuse','Spontanée','Sensible'],style:'Pop',want:'Faire vibrer le garage'}];
const TRAITS={Ambitieuse:'Privilégie les morceaux et les répétitions. Se frustre quand une séance manque de rigueur.',Minutieuse:'Fait avancer davantage les morceaux, mais prend plus de temps.',Minutieux:'Fait avancer davantage les morceaux, mais prend plus de temps.',Sociable:'Recherche les activités partagées et accepte plus facilement les invitations.',Créatif:'Trouve davantage d’idées en composant ou en improvisant.',Créative:'Trouve davantage d’idées en composant ou en improvisant.',Paresseux:'Préfère se détendre aux exercices et écourte parfois une répétition.',Solitaire:'Compose volontiers seul et préfère les duos aux grandes jams.',Sensible:'Les tensions pèsent plus longtemps; une rencontre positive redonne de l’inspiration.',Énergique:'Dépense moins d’énergie pendant les activités.',Spontané:'Privilégie les jams et accepte plus facilement les propositions.',Spontanée:'Privilégie les jams et accepte plus facilement les propositions.',Bienveillant:'Apaise les tensions lors des rencontres.'};
const ACTIONS={party:{label:'Fait la fête',noun:'Faire la fête',room:'salon',cost:6,duration:4},compose:{label:'Compose',noun:'Composer',room:'studio',cost:7,duration:5},practice:{label:'Répète',noun:'Répéter',room:'garage',cost:9,duration:5},jam:{label:'Improvise',noun:'Faire une jam',room:'garage',cost:8,duration:4},talk:{label:'Discute',noun:'Partager un café',room:'kitchen',cost:2,duration:3},rest:{label:'Se détend',noun:'Se reposer',room:'salon',cost:-18,duration:4}};
const has=(p,t)=>p.traits.some(v=>v.toLowerCase().startsWith(t));
const key=(a,b)=>[a,b].sort().join(':');
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function create(count=3,profiles=null){let s={version:1,tick:0,people:(profiles||PEOPLE.slice(0,count)).map((p,i)=>({...p,traits:[...p.traits],energy:85-i*8,room:['garage','salon','studio'][i%3],action:['practice','rest','compose'][i%3],remaining:3+i%3,mood:null,moodUntil:0,influences:{},interests:[],suggestUntil:0})),relations:{},logs:[],project:0,songs:0,nextEvent:0,lastInteractions:{},serial:0};if(root.MaisonMusic)root.MaisonMusic.init(s);root.MaisonHouse?.init(s);if(root.MaisonWeeks)root.MaisonWeeks.init(s);root.MaisonShows?.init(s);root.MaisonMorale?.init(s);root.MaisonJourney?.init(s);root.MaisonHouseEvents?.init(s);log(s,'La porte est ouverte',`${count} musiciens s’installent. Leurs premières habitudes prennent forme.`,'home');return s;}
function log(s,title,body,type='story'){s.logs.unshift({id:++s.serial,tick:s.tick,title,body,type});s.logs=s.logs.slice(0,70);}
function affinity(s,a,b){return s.relations[key(a,b)]||0;}
function relationLabel(v){return v<=-3?'Tension':v>=7?'Complicité':v>=2?'Bonne entente':'Se découvrent';}
function mood(s,p,m){p.mood=m;p.moodUntil=s.tick+(has(p,'sensible')&&m==='Frustré' ? 12:8);}
function choose(s,p,rng){if(root.MaisonWeeks?.quietMorning(s))return p.energy<35||rng()<.4?'rest':'talk';if(s.tour?.recoveryUntil>s.tick)return p.energy<35||has(p,'solitaire')||rng()<.65?'rest':'talk';const weights={party:0,compose:2,practice:2,jam:2,talk:1.5,rest:1};if(has(p,'créati'))weights.compose+=4;if(has(p,'ambitie')){weights.practice+=3;weights.compose+=2;}if(has(p,'minutieu'))weights.compose+=2;if(has(p,'sociable')){weights.talk+=3;weights.jam+=2;}if(has(p,'solitaire')){weights.compose+=3;weights.talk=.5;weights.jam=.7;}if(has(p,'paresseux')){weights.rest+=4;weights.practice=.4;}if(has(p,'spontan'))weights.jam+=4;if(p.sessionUntil>s.tick)return p.action;if(p.energy<35)weights.rest+=16;if(p.energy>90)weights.rest=.1;if(p.mood==='Inspiré')weights.compose+=5;if(p.mood==='Frustré')weights.rest+=5;
// The current desire nudges choices without overriding personality.
if(/chanson|Composer|idée/.test(p.want))weights.compose+=2;if(/partenaires/.test(p.want))weights.talk+=3;if(/groove|garage|Partager/.test(p.want))weights.jam+=2;
for(const other of s.people){if(other.id===p.id)continue;const rel=affinity(s,p.id,other.id);if(rel>=2&&['jam','talk'].includes(other.action))weights[other.action]+=2;if(other.action==='jam'&&p.interests.includes(other.style))weights.jam+=2;if(rel<=-3&&other.room==='garage')weights.jam*=.6;}
root.MaisonMorale?.bias(s,p,weights);root.MaisonWeeks?.bias(s,p,weights);if(p.mood==='Fatigué')weights.rest+=10;let n=rng()*Object.values(weights).reduce((a,b)=>a+b,0);for(const a in weights){if(weights[a]<=0)continue;n-=weights[a];if(n<=0)return a;}return 'rest';}
function start(s,p,a){delete p.waking;const h=(root.MaisonWeeks?root.MaisonWeeks.total(s):540+s.tick*10)/60%24;let destination=a==='rest'&&(has(p,'solitaire')||h>=22||h<7)?(root.MaisonHouse?.bedroom(p)||'bedroom'):ACTIONS[a].room;if(['talk','rest'].includes(a)&&h>=8&&h<22&&!destination.startsWith('bedroom')){const places=a==='talk'?['kitchen','patio','salon']:['salon','patio','kitchen'];destination=places[(Math.floor(s.tick/12)+Math.floor(s.people.indexOf(p)/2))%places.length];}if(a==='party'&&h>=10&&h<22&&s.people.indexOf(p)%2===1)destination='kitchen';const routed=root.MaisonActivities?.route(s,p,a,destination);if(routed){a=routed.action;destination=routed.destination;}p.travel=p.room!==destination?4:0;p.action=a;p.room=destination;p.remaining=ACTIONS[a].duration+(has(p,'minutieu')&&a==='compose'?1:0);p.actionStarted=s.tick;p.actionEnds=s.tick+p.travel+p.remaining;}
function finish(s,p,rng){const a=p.action;let cost=ACTIONS[a].cost;if(has(p,'énergique')&&cost>0)cost*=.7;p.energy=clamp(p.energy-cost,0,100);root.MaisonMorale?.activity(s,p,a);if(root.MaisonMusic)root.MaisonMusic.finish(s,p,rng);if(a==='rest')mood(s,p,'Détendu');}
function interact(s,a,b,rng){const k=key(a.id,b.id);if((s.lastInteractions[k]??-99)>s.tick-5)return;if(a.travel>0||b.travel>0)return;if(a.room!==b.room||!['garage','kitchen','salon','patio'].includes(a.room))return;s.lastInteractions[k]=s.tick;
const structured=(a.action==='practice'||b.action==='practice');const mismatch=structured&&((has(a,'ambitie')&&has(b,'paresseux'))||(has(b,'ambitie')&&has(a,'paresseux'))||(has(a,'minutieu')&&has(b,'spontan'))||(has(b,'minutieu')&&has(a,'spontan')));
const kindness=has(a,'bienveillant')||has(b,'bienveillant');const negative=mismatch&&!kindness&&rng()<.58;const delta=negative?-2:1;s.relations[k]=clamp(affinity(s,a.id,b.id)+delta,-8,12);
root.MaisonMorale?.social(s,a,b,negative);if(negative){mood(s,a,'Frustré');mood(s,b,'Frustré');log(s,'Pas tout à fait le même rythme',`${a.name} et ${b.name} s’agacent : l’un veut une répétition structurée, l’autre préfère la liberté.`,'tension');return;}
const titles=a.action==='party'&&b.action==='party'?['La fête les rapproche','Un rire partagé au salon']:a.room==='garage'?['Ça commence à sonner','Un bon échange musical']:a.room==='kitchen'?['Autour d’un café','La conversation s’installe']:a.room==='patio'?['Un moment au grand air','Une discussion sur le patio']:['Un moment tranquille','Le salon les rapproche'];
log(s,titles[Math.floor(rng()*titles.length)],`${a.name} et ${b.name} ${a.room==='garage'?'trouvent un terrain d’entente en jouant':a.room==='kitchen'?'échangent leurs idées et leurs envies':'décompressent ensemble'}.${kindness?' L’écoute apaise les tensions.':''}`,'social');
if(kindness){a.mood=null;b.mood=null;}else if(a.room==='garage'){mood(s,a,'Inspiré');mood(s,b,'Inspiré');}
if(a.room==='garage'&&affinity(s,a.id,b.id)>=2){for(const [listener,source] of [[a,b],[b,a]]){if(listener.style===source.style||listener.interests.includes(source.style)||listener.interests.length>=2)continue;listener.influences[source.style]=(listener.influences[source.style]||0)+1;if(listener.influences[source.style]>=3){listener.interests.push(source.style);if(root.MaisonDecisions)root.MaisonDecisions.notice(s,{kind:'influence',people:[listener.id,source.id],title:'Une influence qui s’installe',body:`En jouant avec ${source.name}, ${listener.name} prend goût au ${source.style}.`,consequences:['Ce genre fait désormais partie de ses intérêts musicaux.','Cette nouvelle affinité peut orienter ses prochaines collaborations.']});log(s,'Une influence qui reste',`À force de jouer avec ${source.name}, ${listener.name} prend goût au ${source.style.toLowerCase()}.`,'influence');}}}
}
function step(s,rng=Math.random){if(root.MaisonWeeks?.blocked(s))return s;s.tick++;root.MaisonJourney?.tick(s);root.MaisonLiving?.tick(s);root.MaisonHouseEvents?.tick(s);if(root.MaisonWeeks?.interceptStep(s,rng))return s;for(const p of s.people){if(root.MaisonLiving?.bathroomStep(s,p))continue;if(p.waking){delete p.waking;start(s,p,choose(s,p,rng));continue;}if(p.mood&&p.moodUntil<=s.tick)p.mood=null;if(p.travel>0){p.travel--;continue;}if(p.sessionUntil>s.tick)continue;p.remaining--;if(p.remaining<=0){finish(s,p,rng);start(s,p,p.energy<18?'rest':choose(s,p,rng));}}root.MaisonActivities?.enforce(s);for(let i=0;i<s.people.length;i++)for(let j=i+1;j<s.people.length;j++)interact(s,s.people[i],s.people[j],rng);if(root.MaisonMusic)root.MaisonMusic.step(s,rng);root.MaisonWeeks?.afterStep(s,rng);return s;}
function suggest(s,id,action,partnerId,rng=Math.random){const p=s.people.find(p=>p.id===id);if(!p||!ACTIONS[action]||p.suggestUntil>s.tick||p.sessionUntil>s.tick)return false;const partner=s.people.find(p=>p.id===partnerId&&p.id!==id&&!(p.sessionUntil>s.tick));const targets=partner?[p,partner]:[p];s.lastResponses={accepted:[],refused:[]};for(const x of targets){x.suggestUntil=s.tick+3;let chance=.72+(root.MaisonMorale?.willingness(x,action)||0);if(has(x,'sociable')&&['talk','jam'].includes(action))chance+=.2;if(has(x,'spontan'))chance+=.12;if(has(x,'solitaire')&&['talk','jam'].includes(action))chance-=.2;if(has(x,'paresseux')&&action==='practice')chance-=.35;if(x.energy<30&&action!=='rest')chance-=.5;if(action==='rest'&&x.energy<50)chance=1;if(rng()<clamp(chance,.1,1)){start(s,x,action);s.lastResponses.accepted.push({id:x.id,reason:'Accepte cette proposition.'});log(s,'Une proposition acceptée',`${x.name} accepte de ${ACTIONS[action].noun.toLowerCase()}${partner?' avec '+(x.id===p.id?partner.name:p.name):''}.`,'choice');}else{s.lastResponses.refused.push({id:x.id,reason:x.energy<30?'Son énergie est basse; préfère récupérer.':x.morale<=40?'Son moral est bas; préfère suivre une envie réconfortante.':has(x,'solitaire')?'Préfère un moment de solitude.':has(x,'paresseux')?'Préfère une activité moins exigeante.':'Préfère poursuivre son activité actuelle.'});log(s,'À sa façon',`${x.name} préfère continuer : ${x.energy<30?'la fatigue se fait sentir':has(x,'solitaire')?'un peu de solitude lui fait du bien':has(x,'paresseux')?'pas envie de se mettre au travail tout de suite':'ce n’est pas son envie du moment'}.`,'choice');}}root.MaisonActivities?.register(s,action,s.lastResponses.accepted.map(x=>x.id));return true;}
function event(s,type,rng=Math.random){if(s.nextEvent>s.tick||s.music?.session)return false;s.nextEvent=s.tick+12;s.lastResponses={accepted:[],refused:[]};const a=type==='jam'?'jam':'talk';log(s,type==='jam'?'Le garage est ouvert !':'Le café est servi',type==='jam'?'Une invitation à improviser circule dans la maison. Chacun choisit de venir.':'Une occasion de se retrouver dans la cuisine.','event');for(const p of s.people){let c=has(p,'sociable')?.95:has(p,'solitaire')?.45:.75;if(p.energy<25)c=.2;c=clamp(c+(root.MaisonMorale?.willingness(p,a)||0),.1,.98);if(rng()<c){start(s,p,a);s.lastResponses.accepted.push({id:p.id,reason:'Accepte de rejoindre le groupe.'});log(s,'Présent !',`${p.name} rejoint ${type==='jam'?'la jam au garage':'le café collectif'}.`,'choice');}else {s.lastResponses.refused.push({id:p.id,reason:p.energy<25?'Son énergie est basse; préfère récupérer.':has(p,'solitaire')?'Préfère rester au calme.':'Préfère poursuivre son activité actuelle.'});log(s,'Une prochaine fois',`${p.name} préfère ${p.energy<25?'récupérer':'poursuivre son activité'}.`,'choice');}}root.MaisonActivities?.register(s,a,s.lastResponses.accepted.map(x=>x.id));return true;}
function recruit(s,id){if(root.MaisonJourney&&!root.MaisonJourney.canRecruit(s,id))return false;if(root.MaisonShows?.busy(s))return false;if(s.people.length>=6||s.people.some(p=>p.id===id))return false;const p=candidates(s).find(p=>p.id===id);if(!p)return false;s.people.push({...p,traits:[...p.traits],energy:90,room:'kitchen',action:'talk',remaining:5,mood:'Curieux',moodUntil:s.tick+8,influences:{},interests:[],suggestUntil:0});if(root.MaisonMusic)root.MaisonMusic.initPerson(s.people.at(-1));root.MaisonMorale?.initPerson(s.people.at(-1));root.MaisonHouse?.init(s);root.MaisonWeeks?.onRecruit(s,s.people.at(-1));s.people.at(-1).newMember=true;for(const x of s.music.songs)if(x.adopted&&!x.archived){x.preparation=Math.max(0,x.preparation-20);x.readyNotified=false;}if(root.MaisonDecisions)root.MaisonDecisions.notice(s,{kind:'arrival',personId:p.id,title:`${p.name} rejoint le collectif`,body:`La maison accueille un nouveau membre : ${p.instrument}, univers ${p.style}.`,consequences:[`${s.people.length} musiciens vivent maintenant sous ce toit.`, 'Chansons adoptées : −20 points de préparation. Le nouveau membre accepte les répétitions.']});log(s,'Une nouvelle clé de la maison',`${p.name} arrive avec son univers ${p.style.toLowerCase()} et son instrument : ${p.instrument.toLowerCase()}.`,'arrival');return true;}
function candidates(s){s.recruitCandidates??=[];const used=[...s.people,...s.recruitCandidates].map(p=>p.name);for(const original of PEOPLE){if(s.people.some(p=>p.id===original.id)||s.recruitCandidates.some(p=>p.id===original.id))continue;const gender=original.id==='zoe'||original.id==='lea'||original.id==='ines'?'female':'male';const p={...original,traits:[...original.traits],gender,name:N.musician(used,gender)};s.recruitCandidates.push(p);used.push(p.name);}return s.recruitCandidates.filter(p=>!s.people.some(q=>q.id===p.id));}
root.MaisonSim={candidates,PEOPLE,TRAITS,ACTIONS,create,step,choose,suggest,event,recruit,affinity,relationLabel,start,log,mood,has,interact};

})(typeof globalThis!=='undefined'?globalThis:this);

(function(root){
'use strict';
const labels=['Fragile','Simple','Prometteuse','Solide','Accrocheuse','Remarquable','Exceptionnelle'];
const preferences={Indie:'balanced',Punk:'energy',Folk:'turns','Métal':'energy',Jazz:'turns','Électro':'energy',Ska:'balanced',Pop:'balanced'};
const preferenceNames={balanced:'Équilibré',energy:'Énergie',turns:'Durée'};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const level=q=>Math.min(7,Math.floor(clamp(Number(q)||0,0,100)/15)+1);
function seed(x){let h=2166136261;for(const c of [x.id,x.title,x.genre].join('|')){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0)/4294967296;}
function profile(x){const tier=level(x.quality),budget=tier+4,preference=preferences[x.genre]||'balanced',roll=Number.isFinite(x.arrangementRoll)?clamp(x.arrangementRoll,0,.999999999):seed(x);const variants=[];for(let turns=3;turns<=6;turns++){const energy=budget-turns;if(energy<2||energy>5)continue;const weight=preference==='energy'?Math.pow(4,energy-2):preference==='turns'?Math.pow(4,turns-3):Math.abs((turns-3)-(energy-2))<=1?6:1;variants.push({turns,energyPerTurn:energy,weight});}let n=roll*variants.reduce((sum,x)=>sum+x.weight,0),chosen=variants.at(-1);for(const v of variants){n-=v.weight;if(n<0){chosen=v;break;}}return {level:tier,label:labels[tier-1],budget,turns:chosen.turns,energyPerTurn:chosen.energyPerTurn,preference,preferenceLabel:preferenceNames[preference],provisional:!!x.reworkPending};}
function update(x){if(!Number.isFinite(x.arrangementRoll))x.arrangementRoll=seed(x);const p=profile(x);x.turns=p.turns;x.energyPerTurn=p.energyPerTurn;x.qualityTier=p.level;x.arrangementVersion=1;return p;}
function text(x){const p=profile(x);return `Niv. ${p.level}/7 · ${p.turns} tours · ${p.energyPerTurn} énergie/tour${p.provisional?' · provisoire':''}`;}
root.MaisonSongQuality={level,labels,preferences,preferenceNames,profile,update,text};
})(typeof globalThis!=='undefined'?globalThis:this);

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

})(typeof globalThis!=='undefined'?globalThis:this);

(function(root){
'use strict';
const Q=root.MaisonSongQuality||null;
const GENRES=['Indie','Punk','Folk','Métal','Jazz','Électro','Ska','Pop'];
const C=root.MaisonCards||null;
const CARDS=C.CARDS;
const N=root.MaisonNames||null;
const S=()=>root.MaisonSim,clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),genre=x=>({Rock:'Indie',Soul:'Pop',Funk:'Ska'})[x]||x;
function initPerson(p){root.MaisonMorale?.initPerson(p);p.style=genre(p.style);p.interests=[...new Set((p.interests||[]).map(genre))];p.influences=Object.fromEntries(Object.entries(p.influences||{}).map(([k,v])=>[genre(k),v]));C.initPerson(p);}
function init(s,migrate=false){s.people.forEach(initPerson);if(s.music){s.music.pending=s.music.pending.filter(e=>!(e.type==='reward'&&(['preparation','ready'].includes(e.rewardSource)||!e.rewardSource&&e.title==='Une nouvelle façon de jouer')));s.music.songs.forEach(x=>{Q.update(x);x.voteCount??=x.votes?.length?1:0;if(x.revision>0&&!Object.hasOwn(x,'reworkUsed')){x.reworkUsed=true;if(!x.adopted){const snapshot={...Q.profile(x)};if(x.progress<100)x.reworkPending=snapshot;else x.reworkResult={before:snapshot,after:snapshot,legacy:true};}}});for(const p of s.people)if(!p.completedCompositions)p.completedCompositions=s.music.songs.filter(x=>x.progress===100&&x.authors.includes(p.id)&&x.contributions?.[p.id]).map(x=>x.id);s.version=2;N.migrate(s);if(root.MaisonDecisions)root.MaisonDecisions.init(s);reconcileOccasions(s);return s;}s.music={songs:[],nextId:1,session:null,pending:[],history:[],nextStory:s.tick+12,storyIndex:0,lastReward:-1000,legacySongs:migrate?(Number(s.songs)||0):0};s.version=2;if(root.MaisonDecisions)root.MaisonDecisions.init(s);if(migrate){if(s.project>0){newSong(s,s.people.map(p=>p.id),s.people[0].style,()=>.5,{progress:Math.min(99,s.project),title:'Les fenêtres ouvertes'});}S().log(s,'Un vrai carnet de chansons',`Les projets ont maintenant leurs auteurs et leur préparation.${s.music.legacySongs?' Les '+s.music.legacySongs+' anciennes compositions restent comptées dans l’historique.':''}`,'song');}else{newSong(s,[s.people[0].id],s.people[0].style,()=>.5,{progress:28});newSong(s,[s.people[2].id],s.people[2].style,()=>.65,{progress:12});}s.people.forEach(p=>p.completedCompositions??=[]);delete s.project;delete s.songs;return s;}
function composer(p){const n=(p.completedCompositions||[]).length;return n>=12?{name:'Accompli',min:4,max:6}:n>=7?{name:'Confirmé',min:3,max:5}:n>=3?{name:'En progrès',min:2,max:3}:{name:'Débutant',min:1,max:2};}
function initialQuality(s,ids,rng){const profiles=ids.map(id=>composer(s.people.find(p=>p.id===id)));const c=profiles.sort((a,b)=>b.min-a.min)[0];const level=c.name==='Débutant'?(rng()<.8?1:2):c.name==='Accompli'&&rng()<.05?7:c.min+Math.min(c.max-c.min,Math.floor(rng()*(c.max-c.min+1)));return (level-1)*15+7;}
function canRevise(x){return !!x&&!x.archived&&!x.adopted&&x.voteCount===1&&!x.reworkUsed;}
function credit(s,x){for(const id of x.authors){const p=s.people.find(p=>p.id===id);if(!p||!x.contributions[id])continue;p.completedCompositions??=[];if(!p.completedCompositions.includes(x.id))p.completedCompositions.push(x.id);}}
function finishRework(s,x,rng){const before=x.reworkPending;const level=Math.min(7,before.level+Math.min(2,Math.floor(rng()*3)));x.quality=(level-1)*15+7;x.arrangementRoll=rng();Q.update(x);delete x.reworkPending;const after=Q.profile(x);x.reworkResult={before,after,tick:s.tick};const sign=n=>(n>=0?'+':'')+n;root.MaisonDecisions?.notice(s,{kind:'rework',songId:x.id,title:'La seconde version est terminée',body:`« ${x.title} » : ${sign(after.level-before.level)} niveau de qualité.`,rework:x.reworkResult,consequences:[`${before.turns} → ${after.turns} tours (${sign(after.turns-before.turns)}).`,`${before.energyPerTurn} → ${after.energyPerTurn} énergie par tour (${sign(after.energyPerTurn-before.energyPerTurn)}).`,'Cette chanson a utilisé sa seule réécriture. Un deuxième refus la retirera du collectif; les auteurs conserveront leur composition.']});}
function qualityLabel(q){return Q.labels[Q.level(q)-1];}
function duration(q){return Q.profile({quality:q,genre:"Indie",arrangementRoll:.5,progress:100}).turns;}
function song(s,id){return s.music.songs.find(x=>x.id===id);}
function ready(x){return !x.archived&&!!x.adopted&&x.progress===100&&x.preparation===100;}
function authors(s,x){return x.authors.map(id=>s.people.find(p=>p.id===id)?.name||id).join(' & ');}
function signature(s,x){return [Math.floor(x.progress),Math.floor(x.quality),x.revision,s.people.map(p=>p.id).join(',')].join(':');}
function canTrial(s,x){return !!x&&!x.archived&&!x.reworkPending&&(!(x.voteCount>=1)||!!x.reworkResult)&&!x.adopted&&x.progress>=80&&!s.music.session&&!root.MaisonWeeks?.isNight(s)&&(x.retryAt||0)<=s.tick&&x.lastVoteSignature!==signature(s,x);}
function newSong(s,ids,type,rng=Math.random,options={}){const unique=[...new Set(ids)].filter(id=>s.people.some(p=>p.id===id));if(!unique.length||!GENRES.includes(type))return null;const id='song-'+s.music.nextId++;const x={id,title:'',genre:type,authors:unique,progress:options.progress||0,quality:initialQuality(s,unique,rng),turns:null,adopted:false,preparation:0,revision:0,voteCount:0,reworkUsed:false,votes:[],created:s.tick,contributions:{},trialNotified:false,readyNotified:false};x.arrangementRoll=rng();x.title=N.song(s,type,rng,options.title);Q.update(x);s.music.songs.push(x);root.MaisonJourney?.consumeWriting(s,x);unique.forEach(id=>s.people.find(p=>p.id===id).projectId=x.id);return x;}
function findProject(s,p){let x=song(s,p.projectId);if(x&&!x.archived&&(!x.voteCount||x.adopted||x.reworkPending)&&x.progress<100&&x.authors.includes(p.id))return x;x=s.music.songs.find(x=>!x.archived&&(!x.voteCount||x.adopted||x.reworkPending)&&x.progress<100&&x.authors.includes(p.id));return x;}
function work(s,p,rng){let x=findProject(s,p);if(!x){if(root.MaisonDecisions?.reserved(s,p.id))return;if(s.music.songs.filter(x=>!x.archived&&(!x.voteCount||x.adopted||x.reworkPending)&&x.progress<100).length>=6||s.music.songs.length>=120)return;x=newSong(s,[p.id],p.style,rng);S().log(s,'Une nouvelle page',`${p.name} commence « ${x.title} », une composition ${x.genre}.`,'music');}const n=(S().has(p,'créati')?12:8)+(S().has(p,'minutieu')?2:0)+(p.mood==='Inspiré'?3:0)+(root.MaisonHouseEvents?.consumeInspiration(s,p,x)||0);x.progress=clamp(x.progress+n,0,100);x.contributions[p.id]=(x.contributions[p.id]||0)+1;Q.update(x);root.MaisonMorale?.composing(s,p,x);S().log(s,'La chanson avance',`${p.name} travaille sur « ${x.title} » (${Math.round(x.progress)} %).`,'music');if(rng()<.4)S().mood(s,p,'Inspiré');if(x.progress>=80&&!x.trialNotified){x.trialNotified=true;queue(s,{type:'demo',songId:x.id,title:'Une chanson à faire entendre',body:`« ${x.title} » a dépassé 80 %. Ses auteurs aimeraient savoir si le groupe veut la jouer.`});}if(x.progress===100){if(x.reworkPending){finishRework(s,x,rng);credit(s,x);checkReady(s,x);return;}credit(s,x);x.quality=Math.round(x.quality);Q.update(x);root.MaisonMorale?.songEvent(s,x,'composition');root.MaisonDecisions?.notice(s,{kind:'composition',songId:x.id,title:'Une chanson vient de naître',body:`${authors(s,x)} termine${x.authors.length>1?'nt':''} « ${x.title} ».`,consequences:[`${qualityLabel(x.quality)} · ${Q.text(x)}.`,x.adopted?'Le groupe a déjà adopté cette chanson. Il reste à la préparer.':'La composition est terminée; le groupe peut maintenant choisir de l’adopter.']});S().log(s,'La composition est terminée',`« ${x.title} » : ${qualityLabel(x.quality)} · ${Q.text(x)}. Les répétitions préparent le groupe sans changer ces valeurs.`,'song');checkReady(s,x);}}
function finish(s,p,rng){if(p.action==='compose')work(s,p,rng);if(p.action==='jam'){const partner=s.people.find(q=>q.id!==p.id&&q.action==='jam'&&q.room==='garage'&&!q.travel&&S().affinity(s,p.id,q.id)>=2);if(partner&&!root.MaisonDecisions?.reserved(s,p.id)&&!root.MaisonDecisions?.reserved(s,partner.id)&&!findProject(s,p)&&!findProject(s,partner)&&rng()<.25&&s.music.songs.filter(x=>!x.archived&&(!x.voteCount||x.adopted||x.reworkPending)&&x.progress<100).length<6){const x=newSong(s,[p.id,partner.id],p.style,rng,{progress:15});root.MaisonDecisions?.notice(s,{kind:'duo',songId:x.id,title:'Une collaboration prend forme',body:`${p.name} et ${partner.name} commencent « ${x.title} » ensemble.`,consequences:['Les deux musiciens sont crédités comme compositeurs.','Leurs contributions feront avancer un même projet.']});S().log(s,'Une idée à deux',`${p.name} et ${partner.name} font naître « ${x.title} » pendant la jam.`,'song');}}}
function reconcileOccasions(s,order=null){
 if(order?.type==='trial'&&order.status!=='blocked'){const x=song(s,order.songId);if(x)x.trialNotified=true;}
 // Occasions are reserved for deck rewards. Song actions remain in the repertoire.
 s.music.pending=s.music.pending.filter(e=>e.type==='reward');
}

function queue(s,event){if(event.type!=='reward')return;if(s.music.pending.some(e=>e.type===event.type&&e.songId===event.songId&&e.personId===event.personId&&e.rewardSource===event.rewardSource&&e.journeyId===event.journeyId))return;if(s.music.pending.length>=6){const expendable=s.music.pending.findIndex(e=>['routine','night','influence','duo','tension'].includes(e.type));if(expendable>=0)s.music.pending.splice(expendable,1);else if(event.type!=='reward')return;}const item={...event,id:'event-'+(++s.serial),created:s.tick};if(event.type==='reward')s.music.pending.splice(s.music.pending.filter(e=>e.type==='reward').length,0,item);else s.music.pending.push(item);reconcileOccasions(s);}
function adoptionRewards(s,x){x.cardRewards??={};for(const id of x.authors){if(x.cardRewards[id])continue;const p=s.people.find(p=>p.id===id);if(!p)continue;queue(s,{type:'reward',rewardSource:'adoption',rewardMode:'add',personId:id,songId:x.id,title:'Une chanson adoptée, une nouvelle carte',body:`${p.name} peut ajouter une carte à son paquet pour l’adoption de « ${x.title} ».`});x.cardRewards[id]='offered';}}

function acceptance(p,a){if(p.newMember&&a==='practice')return 1;let c=.75+(root.MaisonMorale?.willingness(p,a)||0);if(S().has(p,'sociable'))c+=.15;if(S().has(p,'solitaire'))c-=.12;if(S().has(p,'paresseux')&&a==='practice')c-=.25;if(p.energy<25)c-=.5;return clamp(c,.12,.98);}
const trialMinimum=s=>Math.floor(s.people.length/2)+1;
function beginSession(s,x,kind,rng){if(s.music.session||!x)return false;if(kind==='trial'&&!canTrial(s,x))return false;if(kind==='practice'&&(!x.adopted||ready(x)||(x.retryAt||0)>s.tick))return false;s.lastResponses={accepted:[],refused:[]};const participants=[];for(const p of s.people){if(rng()<acceptance(p,'practice')||kind==='trial'&&x.authors.includes(p.id)){participants.push(p.id);s.lastResponses.accepted.push({id:p.id,reason:kind==='trial'&&x.authors.includes(p.id)?'Auteur : souhaite faire essayer sa chanson.':'Accepte de participer à la séance.'});}else {s.lastResponses.refused.push({id:p.id,reason:p.energy<25?'Son énergie est basse; préfère se reposer.':p.morale<=40?'Manque d’élan pour cette séance; préfère se ressourcer.':S().has(p,'paresseux')?'Une répétition structurée ne lui fait pas envie.':S().has(p,'solitaire')?'Préfère travailler au calme.':'Préfère poursuivre son activité actuelle.'});S().log(s,'Une séance sans lui ou elle',`${p.name} décline l’invitation pour « ${x.title} ».`,'choice');}}x.retryAt=s.tick+8;if(participants.length<(kind==='trial'?trialMinimum(s):2)){S().log(s,'Il manque du monde',`${participants.length} volontaire(s) sur ${s.people.length}. Il en faut ${kind==='trial'?trialMinimum(s):2} pour ${kind==='trial'?'essayer':'répéter'} « ${x.title} ». Aucun essai ni vote : la proposition pourra être renouvelée.`,'choice');return false;}return launchSession(s,x,kind,participants);}
function launchSession(s,x,kind,participants){const ends=s.tick+9;s.music.session={songId:x.id,kind,participants,started:s.tick,ends};if(kind==='trial')x.proposedAt??=s.tick;for(const id of participants){const p=s.people.find(p=>p.id===id);S().start(s,p,'practice');p.sessionUntil=ends;p.sessionSong=x.id;}reconcileOccasions(s);root.MaisonActivities?.enforce(s);S().log(s,kind==='trial'?'Une chanson à l’essai':'Répétition du répertoire',`${participants.map(id=>s.people.find(p=>p.id===id).name).join(', ')} rejoignent le garage pour « ${x.title} ».`,'music');return true;}
function sessionFromIntent(s,id,ids){const x=song(s,id),participants=[...new Set(ids)].filter(id=>s.people.some(p=>p.id===id));if(s.music.session||!x||participants.length<(x.adopted?2:trialMinimum(s))||ready(x)||!x.adopted&&!canTrial(s,x))return false;x.retryAt=s.tick+18;return launchSession(s,x,x.adopted?'practice':'trial',participants);}
function requestTrial(s,id,rng=Math.random){return beginSession(s,song(s,id),'trial',rng);}
function requestPractice(s,id,rng=Math.random){return beginSession(s,song(s,id),'practice',rng);}
function vote(s,x,participants,rng){x.votes=s.people.map(p=>{if(x.authors.includes(p.id))return {id:p.id,yes:true,reason:'Auteur : je veux conserver notre chanson dans le groupe.'};if(!participants.includes(p.id))return {id:p.id,yes:false,absent:true,reason:'Absent de l’essai : ne se prononce pas.'};const author=x.authors.includes(p.id),likes=p.style===x.genre||p.interests.includes(x.genre);const affinity=x.authors.reduce((n,id)=>n+(id===p.id?0:S().affinity(s,p.id,id)),0)/x.authors.length;let chance=.38+x.quality/250+(author?.22:0)+(likes?.2:0)+clamp(affinity*.015,-.1,.1);if(S().has(p,'minutieu')&&x.quality<50)chance-=.13;if(S().has(p,'créati'))chance+=.06;const yes=rng()<clamp(chance,.1,.98);let reason=yes?(author?'Je veux qu’on fasse vivre notre idée.':likes?'Ce style me parle, je suis partant.':x.quality>=65?'Le morceau a quelque chose. Essayons !':'Je veux voir ce qu’on peut en faire ensemble.'):(S().has(p,'minutieu')&&x.quality<50?'Il faut encore affiner la composition.':!likes?'Ce n’est pas encore la direction qui me parle.':'Je ne suis pas convaincu par cette version.');return {id:p.id,yes,reason};});const votes=x.votes.filter(v=>v.yes).length;x.voteCount=(x.voteCount||0)+1;x.adopted=votes>s.people.length/2;if(!x.adopted&&x.voteCount>=2){x.archived=true;s.music.pending=s.music.pending.filter(e=>e.songId!==x.id);for(const p of s.people)if(p.projectId===x.id)delete p.projectId;}root.MaisonMorale?.songEvent(s,x,x.adopted?'adoption':'rejection');x.lastVoteSignature=signature(s,x);x.retryAt=s.tick+12;S().log(s,x.adopted?'Adoptée par le groupe !':'Le groupe hésite encore',`« ${x.title} » : ${votes} avis favorables sur ${s.people.length}. ${x.adopted?'Elle entre au répertoire; reste à la préparer.':x.archived?'Deuxième refus : elle rejoint les archives de ses auteurs.':'Les auteurs peuvent la retravailler une seule fois avant un nouvel essai.'}`,'song');root.MaisonDecisions?.notice(s,{kind:x.adopted?'adoption':'rejection',songId:x.id,title:x.adopted?'Le groupe adopte cette chanson':x.archived?'La chanson quitte le collectif':'La chanson n’est pas adoptée',body:`« ${x.title} » recueille ${votes} avis favorables sur ${s.people.length}. Il en fallait ${Math.floor(s.people.length/2)+1}.`,votes:JSON.parse(JSON.stringify(x.votes)),consequences:x.adopted?['Elle entre officiellement au répertoire du groupe. Chaque auteur peut ajouter une carte parmi les trois spéciales de son instrument.',x.progress<100?'Les auteurs doivent encore terminer l’écriture.':'La composition est terminée.', 'Les répétitions vont préparer le groupe à la jouer.']:['Elle reste dans le carnet de ses auteurs; elle n’entre pas au répertoire.', x.archived?'Deux refus : elle est archivée dans les compositions personnelles de ses auteurs, qui en gardent les droits.':'Une seule réécriture est disponible, avec un gain de 0 à 2 niveaux et une nouvelle répartition tours / énergie.','Aucun nouvel essai n’est programmé automatiquement.']});if(x.adopted){adoptionRewards(s,x);x.preparation=Math.max(x.preparation,10);queue(s,{type:'adopted',songId:x.id,title:'Une place dans le répertoire',body:`Le groupe adopte « ${x.title} ». Comment accompagner ses premiers pas ?`});}}
function checkReady(s,x){if(ready(x)&&!x.readyNotified){x.readyNotified=true;x.readyAt=s.tick;root.MaisonMorale?.songEvent(s,x,'ready',s.people.map(p=>p.id));root.MaisonDecisions?.notice(s,{kind:'ready',songId:x.id,title:'Le groupe est prêt à la jouer',body:`« ${x.title} » est terminée et préparée à 100 %.`,consequences:[`${Q.text(x)} : les répétitions ne changent ni les tours ni l’énergie.`, 'Cette chanson fait maintenant partie du répertoire prêt pour la scène.']});S().log(s,'Prête pour la scène',`« ${x.title} » est terminée et préparée à 100 %. ${Q.text(x)}.`,'song');}}
function resolveSession(s,rng){const ss=s.music.session,x=song(s,ss.songId);const people=ss.participants.map(id=>s.people.find(p=>p.id===id));people.forEach(p=>{p.energy=clamp(p.energy-9,0,100);p.sessionUntil=0;p.sessionSong=null;p.remaining=3;});if(ss.kind==='trial')vote(s,x,ss.participants,rng);else{const count=ss.participants.length;const turns=x.turns||duration(x.quality);const gain=Math.max(5,Math.round(({3:35,4:28,5:23,6:20}[turns])*count/s.people.length));x.preparation=clamp(x.preparation+gain,0,100);S().log(s,'Le groupe trouve ses repères',`« ${x.title} » : préparation à ${x.preparation} %. ${count===s.people.length?'Tout le groupe était présent.':'La séance avance moins vite avec des absents.'}`,'music');for(const p of people)root.MaisonMorale?.activity(s,p,'practice');checkReady(s,x);}s.music.session=null;root.MaisonDecisions?.completeSession(s,ss,x);}
function startComposition(s,ids,type,rng=Math.random){if(s.music.session)return null;if(!GENRES.includes(type)||!ids.length)return null;const people=ids.map(id=>s.people.find(p=>p.id===id)).filter(Boolean);if(people.some(p=>findProject(s,p))){S().log(s,'Un carnet déjà bien rempli','Les musiciens préfèrent terminer leur projet en cours avant d’en ouvrir un autre.','choice');return null;}s.lastResponses={accepted:[],refused:[]};const yes=people.filter(p=>{const ok=rng()<acceptance(p,'compose');s.lastResponses[ok?'accepted':'refused'].push({id:p.id,reason:ok?'Accepte de commencer cette composition.':p.energy<25?'Son énergie est basse; préfère récupérer.':'N’a pas envie de commencer un projet maintenant.'});return ok;});if(!yes.length){S().log(s,'L’idée attendra','Personne ne souhaite commencer cette composition pour le moment.','choice');return null;}const x=newSong(s,yes.map(p=>p.id),type,rng);yes.forEach(p=>S().start(s,p,'compose'));S().log(s,'Une idée lancée',`${authors(s,x)} commence${yes.length>1?'nt':''} « ${x.title} » (${type}).${yes.length<people.length?' Certains préfèrent poursuivre leurs activités.':''}`,'music');return x;}
function continueSong(s,id,rng=Math.random){const x=song(s,id);if(!x||x.archived||x.voteCount&&!x.adopted&&!x.reworkPending||x.progress>=100||s.music.session)return false;s.lastResponses={accepted:[],refused:[]};let n=0;x.authors.forEach(id=>{const p=s.people.find(p=>p.id===id);if(rng()<acceptance(p,'compose')){p.projectId=x.id;S().start(s,p,'compose');n++;s.lastResponses.accepted.push({id:p.id,reason:'Reprend le travail sur la chanson.'});}else s.lastResponses.refused.push({id:p.id,reason:p.energy<25?'Son énergie est basse; préfère se reposer.':'Préfère reprendre la composition plus tard.'});});S().log(s,n?'Les auteurs s’y remettent':'Pas tout de suite',n?`${authors(s,x)} reprennent « ${x.title} ».`:`Les auteurs de « ${x.title} » préfèrent attendre.`,'choice');return n>0;}
function revise(s,id,participants=null){const x=song(s,id);if(!canRevise(x)||s.music.session)return false;x.reworkPending={...Q.profile(x)};x.reworkUsed=true;x.progress=80;x.revision++;(participants||x.authors).forEach(id=>{const p=s.people.find(p=>p.id===id);if(p)p.projectId=x.id;});S().log(s,'Une seconde chance',`Les auteurs retravaillent « ${x.title} ». Le résultat comparé sera annoncé à 100 %.`,'music');return true;}
function requestRevision(s,id,rng=Math.random){const x=song(s,id);if(!canRevise(x)||s.music.session)return false;s.lastResponses={accepted:[],refused:[]};for(const id of x.authors){const p=s.people.find(p=>p.id===id);if(!p)continue;const yes=rng()<acceptance(p,'compose');s.lastResponses[yes?'accepted':'refused'].push({id,reason:yes?'Accepte de retravailler cette chanson.':p.energy<25?'Trop fatigué pour reprendre cette chanson maintenant.':'Ne souhaite pas retravailler cette chanson pour le moment.'});}x.reworkOffered=true;x.reworkAutonomyAt=s.tick+18;const ids=s.lastResponses.accepted.map(p=>p.id);if(!ids.length)return false;if(!revise(s,id,ids))return false;ids.forEach(id=>S().start(s,s.people.find(p=>p.id===id),'compose'));return true;}
function autonomousRevision(s,rng){if(s.music.session||root.MaisonWeeks?.isNight(s)||root.MaisonShows?.busy(s))return;for(const x of s.music.songs){if(!canRevise(x)||!x.reworkOffered||x.reworkAutonomyAt>s.tick)continue;x.reworkAutonomyAt=s.tick+18;const p=s.people.find(p=>x.authors.includes(p.id)&&p.energy>=35&&!(p.playerActionUntil>s.tick)&&!findProject(s,p)&&!root.MaisonDecisions?.reserved(s,p.id)&&!root.MaisonActivities?.reservations(s).some(a=>a.people.includes(p.id)));if(!p||rng()>=.2)continue;if(revise(s,x.id,[p.id])){S().start(s,p,'compose');root.MaisonDecisions?.notice(s,{kind:'rework-start',songId:x.id,personId:p.id,title:'L’envie de reprendre cette chanson',body:`${p.name} décide de retravailler « ${x.title} » après avoir laissé mûrir l’idée.`,consequences:['La seule réécriture commence maintenant.','Son résultat sera comparé à la première version une fois terminée.']});break;}}}
function canScrap(x){return !!x&&!x.archived&&!x.adopted&&(x.progress>=80||(x.voteCount||0)>0);}
function scrap(s,id){const x=song(s,id);if(!canScrap(x)||s.music.session?.songId===id)return false;x.archived=true;x.scrapped=true;s.music.pending=s.music.pending.filter(e=>e.songId!==id);s.music.moments=s.music.moments.filter(e=>e.songId!==id);for(const o of s.music.orders)if(o.songId===id&&['waiting','running'].includes(o.status)){o.status='cancelled';delete o.suspended;o.reason='Chanson archivée chez ses auteurs.';}for(const p of s.people){if(p.projectId===id)delete p.projectId;if(p.intent?.songId===id)delete p.intent;if(p.nightPlan?.songId===id)delete p.nightPlan;}if(s.calendar){if(s.calendar.focus?.songId===id)s.calendar.focus=null;s.calendar.paused=(s.calendar.paused||[]).filter(a=>a.songId!==id);for(const key of ['songId','rehearsalId'])if(s.calendar.pending?.[key]===id)delete s.calendar.pending[key];}S().log(s,'Une page tournée',`« ${x.title} » est abandonnée. Elle reste dans le carnet personnel de ses auteurs, mais quitte le répertoire collectif et ne pourra plus être proposée.`,'choice');return true;}
function eventChoices(s,e){if(e.type==='reward'){const p=s.people.find(p=>p.id===e.personId);if(!p)return [];return C.choices(p).map(id=>({id:'card:'+id,title:CARDS[id].name,text:CARDS[id].text,cost:CARDS[id].cost})).concat({id:'skip',title:'Conserver mon paquet',text:'Ne pas prendre de carte.'});}
if(e.type==='demo')return [{id:'trial',title:'Faisons-la entendre',text:'Inviter le groupe au garage pour un essai et un vote.'},{id:'polish',title:'Peaufiner d’abord',text:'Proposer aux auteurs de terminer l’écriture, si elle est encore en cours.'},{id:'later',title:'La laisser respirer',text:'Conserver le projet pour une prochaine séance.'}];
if(e.type==='adopted')return [{id:'practice',title:'Trouver nos repères',text:'Proposer une répétition de cette chanson.'},{id:'inspire',title:'Célébrer l’idée',text:'Les auteurs gagnent un moment d’inspiration.'},{id:'later',title:'Prendre notre temps',text:'La chanson reste au répertoire, sans nouvelle activité.'}];
if(e.type==='tension')return [{id:'coffee',title:'En parler au calme',text:'Un café pour les deux musiciens : leur relation s’apaise.'},{id:'rest',title:'Un peu d’espace',text:'Les musiciens concernés prennent une pause et récupèrent.'},{id:'later',title:'Les laisser faire',text:'Observer comment leur relation évolue naturellement.'}];
if(e.type==='duo')return [{id:'duo',title:'Écrire à deux',text:'Proposer un nouveau projet commun si leurs carnets le permettent.'},{id:'jam',title:'Jouer sans objectif',text:'Proposer une jam aux deux complices.'},{id:'later',title:'Laisser mûrir',text:'Pas de nouvelle activité pour le moment.'}];
if(e.type==='night')return [{id:'inspire',title:'Noter la mélodie',text:'Le musicien retrouve de l’inspiration pour sa composition.'},{id:'rest',title:'Dormir dessus',text:'Une pause pour récupérer avant de reprendre.'},{id:'jam',title:'La partager',text:'Proposer une jam; chacun reste libre de venir.'}];
if(e.type==='influence')return [{id:'explore',title:'Explorer ce style',text:'Proposer une composition dans le nouveau genre, si le musicien n’a pas de projet en cours.'},{id:'jam',title:'Le jouer ensemble',text:'Proposer une jam autour de cette découverte.'},{id:'later',title:'Écouter encore',text:'Laisser cette influence s’installer sans intervention.'}];
return [{id:'jam',title:'Ouvrir le garage',text:'Proposer une jam pour se retrouver.'},{id:'coffee',title:'Un café ensemble',text:'Proposer un moment de discussion dans la cuisine.'},{id:'rest',title:'Une pause bienvenue',text:'Inviter les plus fatigués à récupérer.'}];}
function resolveEvent(s,id,choice,slot=null,rng=Math.random){return root.MaisonDecisions.resolveEvent(s,id,choice,slot,rng);}
function step(s,rng){reconcileOccasions(s);if(s.music.session&&s.tick>=s.music.session.ends)resolveSession(s,rng);root.MaisonDecisions?.step(s,rng);if(s.tour?.recoveryUntil>s.tick||root.MaisonWeeks?.quietMorning(s))return;autonomousRevision(s,rng);
// Collective rehearsals happen on their own, but adoption remains a visible player opportunity.
if((!s.calendar?.focus||s.calendar.focus.until<=s.tick)&&!s.music.session&&!s.people.some(p=>p.playerActionUntil>s.tick)&&!root.MaisonDecisions?.hasDueOrder(s)&&s.tick%12===0){const x=s.music.songs.find(x=>x.adopted&&x.progress===100&&!ready(x));if(x&&s.people.filter(p=>p.energy>30).length>=2)requestPractice(s,x.id,rng);}
if(s.calendar)return;
if(s.tick<s.music.nextStory||s.music.pending.length)return;s.music.nextStory=s.tick+30;const pairs=[];for(let i=0;i<s.people.length;i++)for(let j=i+1;j<s.people.length;j++)pairs.push([s.people[i],s.people[j]]);const tense=pairs.find(([a,b])=>S().affinity(s,a.id,b.id)<=-3),duo=pairs.find(([a,b])=>S().affinity(s,a.id,b.id)>=4&&!findProject(s,a)&&!findProject(s,b));const inspired=s.people.find(p=>p.interests.length&&!findProject(s,p));const h=(540+s.tick*10)/60%24;let e;if(tense)e={type:'tension',people:tense.map(p=>p.id),title:'Deux façons de faire',body:`${tense[0].name} et ${tense[1].name} n’arrivent plus à se mettre au même rythme. Comment leur donner un peu d’espace ?`};else if(duo)e={type:'duo',people:duo.map(p=>p.id),title:'Et si on écrivait ensemble ?',body:`${duo[0].name} et ${duo[1].name} se comprennent de mieux en mieux. Une idée de duo fait son chemin.`};else if(inspired)e={type:'influence',personId:inspired.id,genre:inspired.interests[0],title:'Une nouvelle couleur',body:`${inspired.name} découvre le ${inspired.interests[0]}. Cette influence pourrait devenir une chanson.`};else if(h>=22||h<6){const p=s.people.find(p=>S().has(p,'créati'))||s.people[0];e={type:'night',personId:p.id,title:'Une mélodie après minuit',body:`${p.name} a une idée alors que la maison ralentit. Comment accueillir cette idée ?`};}else e={type:'routine',title:s.music.storyIndex++%2?'Une porte ouverte sur la journée':'On change un peu de rythme ?',body:'Entre les projets personnels et les habitudes, une occasion de réunir la maison se présente.'};queue(s,e);}
root.MaisonMusic={reconcileOccasions,trialMinimum,GENRES,CARDS,cards:C,composer,canRevise,requestRevision,canScrap,scrap,performance:Q.profile,performanceText:Q.text,qualityLevel:Q.level,updatePerformance:Q.update,stylePreferences:Q.preferences,preferenceNames:Q.preferenceNames,init,initPerson,finish,step,newSong,findProject,qualityLabel,duration,song,ready,authors,canTrial,requestTrial,requestPractice,startComposition,continueSong,revise,eventChoices,resolveEvent,queue,signature,sessionFromIntent};

})(typeof globalThis!=='undefined'?globalThis:this);

(function(root){
'use strict';
const M=()=>root.MaisonMusic,S=()=>root.MaisonSim;
const labels={trial:'Faire essayer la chanson',practice:'Répéter la chanson',polish:'Peaufiner la composition',continue:'Reprendre la composition',revise:'Retravailler la chanson',compose:'Commencer une composition',duo:'Écrire à deux',explore:'Explorer un nouveau genre',jam:'Proposer une jam',coffee:'Partager un café',rest:'Prendre une pause',inspire:'Noter cette inspiration',later:'Laisser mûrir',skip:'Garder son paquet',suggest:'Proposer une activité'};
function momentKey(item){if(item.orderId)return 'order:'+item.orderId;if(item.songId&&['composition','ready','adoption','duo','rework','rework-start'].includes(item.kind))return item.kind+':'+item.songId;if(item.songId&&item.kind==='rejection')return 'rejection:'+item.songId+':'+item.title+':'+item.body;if(item.kind==='arrival'&&item.personId)return 'arrival:'+item.personId;return null;}
function init(s){s.music.orders??=[];s.music.moments??=[];s.music.decisionVersion=2;const unique=new Map();s.music.moments=s.music.moments.filter(m=>{const key=momentKey(m);if(!key)return true;const prior=unique.get(key);if(prior){prior.seen=prior.seen||m.seen;return false;}unique.set(key,m);return true;});}
function notice(s,item){init(s);const key=momentKey(item),existing=key&&s.music.moments.find(m=>momentKey(m)===key);if(existing)return existing;const moment={...item,id:'moment-'+(++s.serial),tick:s.tick,seen:false};s.music.moments.push(moment);if(s.music.moments.length>80){const i=s.music.moments.findIndex(m=>m.seen);if(i>=0)s.music.moments.splice(i,1);}return moment;}
function acknowledge(s,id){const m=s.music.moments.find(x=>x.id===id);if(m)m.seen=true;}
function acknowledgeOrder(s,id){for(const m of s.music.moments)if(m.orderId===id)m.seen=true;}
function participants(s,r){const x=M().song(s,r.songId);const ids=r.people||r.ids||(r.personId?[r.personId]:x?x.authors:s.people.map(p=>p.id));return [...new Set(ids)].map(id=>s.people.find(p=>p.id===id)).filter(Boolean);}
// Orders are stored newest first; both execution and presentation use this view.
function ordered(s){return (s.music.orders||[]).slice().reverse();}
function isTransient(m){return m.kind==='composition'||m.kind==='influence'||m.presentation==='toast'||m.kind==='order'&&['Ta proposition démarre','Ta proposition commence'].includes(m.title);}
function isDone(o){return !['waiting','running'].includes(o.status);}
function preflight(s,r){if(r.suspended)return {status:'waiting',reason:'Séance suspendue : reprise prioritaire à 10 h, avec la progression conservée.'};if(root.MaisonShows?.busy(s))return {status:'blocked',reason:'Le groupe est au show. Propose cette activité après son retour.'};const x=M().song(s,r.songId),people=participants(s,r);const k=r.type;if(!labels[k]&&!k.startsWith('card:'))return {status:'blocked',reason:'Cette proposition n’est pas reconnue.'};
if(k.startsWith('card:')){const p=people[0];return !p||!M().CARDS[k.slice(5)]||(r.cardMode!=='add'&&(!Number.isInteger(r.slot)||r.slot<0||r.slot>=p.deck.length))?{status:'blocked',reason:'Choisis un emplacement valide dans le paquet.'}:{status:'ready'};}
if(['later','skip','inspire'].includes(k))return {status:'ready'};

if(s.tour?.recoveryUntil>s.tick&&!['rest','coffee'].includes(k))return {status:'waiting',reason:'Après le show, place au repos. Cette proposition attendra 10 h.',until:s.tour.recoveryUntil+60};
if(root.MaisonWeeks?.isNight(s))return {status:'waiting',reason:'La maison dort. Cette invitation sera envoyée à partir de 10 h. Seuls les choix de minuit permettent de veiller.',until:(s.calendar.night?.wakeTick||s.tick+Math.ceil((480-root.MaisonWeeks.minute(s))/10))+12};
if(['trial','practice','polish','continue','revise'].includes(k)&&!x)return {status:'blocked',reason:'Cette chanson n’existe plus.'};
if(x?.archived)return {status:'blocked',reason:'Cette chanson est archivée chez ses auteurs et ne peut plus être proposée au groupe.'};
if(k==='trial'){if(x.reworkPending||x.voteCount>=1&&!x.reworkResult)return {status:'blocked',reason:'Termine la seule réécriture de cette chanson avant le second essai.'};if(x.adopted)return {status:'blocked',reason:'La chanson est déjà adoptée. Tu peux proposer une répétition.'};if(x.lastVoteSignature===M().signature(s,x))return {status:'blocked',reason:'Le groupe a déjà voté sur cette version. Retravaille la chanson avant un nouvel essai.'};if(x.progress<80)return {status:'waiting',reason:`La composition est à ${Math.round(x.progress)} %. L’invitation sera envoyée à 80 %.`};}
if(k==='practice'){if(!x.adopted)return {status:'blocked',reason:'Le groupe doit d’abord adopter cette chanson.'};if(M().ready(x))return {status:'blocked',reason:'Cette chanson est déjà prête à être jouée.'};}
if(k==='continue'&&x.progress===100)return {status:'blocked',reason:'L’écriture est déjà terminée. Une réécriture est possible depuis la fiche.'};
if(k==='revise'&&!M().canRevise(x))return {status:'blocked',reason:'La réécriture est possible une seule fois, après le premier refus et avant adoption.'};
if(['continue','polish'].includes(k)&&(x.progress===100||x.voteCount&&!x.adopted&&!x.reworkPending))return {status:'blocked',reason:'Choisis la seconde chance après un refus. Une chanson adoptée conserve sa qualité.'};
if(root.MaisonWeeks?.quietMorning(s)&&!['rest','coffee'].includes(k))return {status:'waiting',reason:'Matinée tranquille : repos et café jusqu’à 10 h.',until:s.tick+Math.ceil((600-root.MaisonWeeks.minute(s))/10)};
if(people.some(p=>root.MaisonWeeks?.pausedFor(s,p.id))&&root.MaisonWeeks.minute(s)>=600&&root.MaisonWeeks.minute(s)<1020)return {status:'waiting',reason:'Une activité suspendue doit reprendre en priorité.'};
const intendedAction=({trial:'practice',practice:'practice',compose:'compose',duo:'compose',explore:'compose',continue:'compose',polish:'compose',revise:'compose',jam:'jam',coffee:'talk',rest:'rest'})[k]||(k==='suggest'?r.action:null);
const room=intendedAction&&S().ACTIONS[intendedAction]?.room;
const reservation=root.MaisonActivities?.reservations(s).find(a=>!a.songId&&(a.room===room||people.some(p=>a.people.includes(p.id))));
if(reservation)return {status:'waiting',reason:'Une activité commune occupe déjà ces musiciens ou cette pièce. La proposition attend sa fin.',until:reservation.until};
if(s.music.session){const ss=s.music.session,name=M().song(s,ss.songId)?.title||'une chanson';return {status:'waiting',reason:`Le garage est occupé par « ${name} ». La proposition sera envoyée après la séance.`,until:ss.ends};}
if(['trial','practice'].includes(k)&&x.retryAt>s.tick)return {status:'waiting',reason:'Les musiciens viennent de recevoir une invitation pour cette chanson. Un court délai est nécessaire.',until:x.retryAt};
if(['jam','coffee'].includes(k)&&r.eventType!=='tension'&&s.nextEvent>s.tick)return {status:'waiting',reason:'Une rencontre vient d’être proposée. Laissons ce moment se terminer avant d’en lancer une autre.',until:s.nextEvent};
const engaged=['jam','coffee','trial','practice','rest'].includes(k)&&r.eventType!=='tension'?s.people:people;const occupiedUntil=Math.max(0,...engaged.map(p=>p.playerActionUntil||0));if(occupiedUntil>s.tick)return {status:'waiting',reason:'Les musiciens terminent une activité que tu as déjà proposée. La prochaine invitation suivra.',until:occupiedUntil};
if(['compose','duo','explore'].includes(k)){if(!people.length||!M().GENRES.includes(r.genre||people[0].style))return {status:'blocked',reason:'Il manque un auteur ou un genre valide.'};const busy=people.filter(p=>M().findProject(s,p));if(busy.length)return {status:'waiting',reason:`${busy.map(p=>p.name).join(', ')} ${busy.length>1?'ont':'a'} encore une chanson en cours. La proposition sera envoyée après la fin de leur écriture.`};}
if(k==='suggest'){if(!people.length||!S().ACTIONS[r.action])return {status:'blocked',reason:'Cette activité ou ce musicien n’est plus disponible.'};const until=Math.max(...people.map(p=>Math.max(p.sessionUntil||0,p.suggestUntil||0)));if(until>s.tick)return {status:'waiting',reason:'Ces musiciens sont encore occupés ou viennent de recevoir une proposition.',until};}
return {status:'ready'};}
function setResponses(o,s){o.accepted=JSON.parse(JSON.stringify(s.lastResponses?.accepted||[]));o.refused=JSON.parse(JSON.stringify(s.lastResponses?.refused||[]));}
function execute(s,o,rng){s.lastResponses={accepted:[],refused:[]};const x=M().song(s,o.songId),people=participants(s,o),k=o.type;let ok=false;
o.status='applied';o.updated=s.tick;o.until=null;
if(k==='trial'||k==='practice'){ok=(k==='trial'?M().requestTrial:M().requestPractice)(s,o.songId,rng);setResponses(o,s);if(ok){o.status='running';s.music.session.orderId=o.id;o.reason=k==='trial'?'L’essai commence au garage. Le vote d’adoption aura lieu à la fin de la séance.':'La répétition commence au garage. La préparation augmentera à la fin de la séance.';o.until=s.music.session.ends;}else {o.status='refused';o.reason=`Seulement ${o.accepted.length} musicien${o.accepted.length>1?'s':''} a${o.accepted.length>1?'ont':''} accepté. Il en faut ${k==='trial'?M().trialMinimum(s):2}. ${k==='trial'?'Aucun essai ni vote : la chanson reste à proposer, sans réécriture.':'Aucune répétition n’a démarré.'} Tu peux proposer une nouvelle séance plus tard.`;}}
else if(['compose','duo','explore'].includes(k)){const created=M().startComposition(s,people.map(p=>p.id),o.genre||people[0].style,rng);setResponses(o,s);o.status=created?'applied':'refused';if(created)o.songId=created.id;o.reason=created?`« ${created.title} » commence avec ${M().authors(s,created)}. ${o.refused.length?'Les autres musiciens sollicités ont décliné.':''}`:'Personne n’a accepté de commencer ce projet. Rien n’a été créé; aucune relance automatique n’est prévue.';}
else if(k==='revise'){ok=M().requestRevision(s,x.id,rng);setResponses(o,s);o.status=ok?'applied':'refused';o.reason=ok?'Les volontaires commencent la seule réécriture à 80 %. Le résultat comparé sera annoncé à 100 %.':'Les auteurs déclinent pour le moment. La seconde chance reste disponible. Tu peux reproposer, scrapper la chanson ou les laisser décider de la reprendre plus tard.';}
else if(['continue','polish'].includes(k)){ok=M().continueSong(s,x.id,rng);setResponses(o,s);o.status=ok?'applied':'refused';o.reason=ok?`${o.accepted.length} auteur(s) reprennent l’écriture.`:'Les auteurs ne reprennent pas l’écriture maintenant. Aucune invitation n’est en attente.';}
else if(k==='suggest'){S().suggest(s,people[0].id,o.action,people[1]?.id,rng);setResponses(o,s);o.status=o.accepted.length?'applied':'refused';o.reason=o.accepted.length?`${o.accepted.length} musicien${o.accepted.length>1?'s ont':' a'} accepté cette activité.`:'La proposition a été refusée. Aucune activité ne démarrera automatiquement.';}
else if(k==='jam'||k==='coffee'){if(o.eventType==='tension'&&k==='coffee'){const [a,b]=people;if(a&&b){const key=[a.id,b.id].sort().join(':');s.relations[key]=Math.min(12,(s.relations[key]||0)+2);people.forEach(p=>{p.mood=null;S().start(s,p,'talk');});o.accepted=people.map(p=>({id:p.id,reason:'Prend un moment pour échanger au calme.'}));o.reason=`${a.name} et ${b.name} discutent. Leur relation s’apaise (+2) et la frustration retombe.`;}else{o.status='blocked';o.reason='Les personnes concernées ne sont plus disponibles.';}}else{S().event(s,k==='jam'?'jam':'coffee',rng);setResponses(o,s);o.status=o.accepted.length?'applied':'refused';o.reason=o.accepted.length?`${o.accepted.length} musicien${o.accepted.length>1?'s rejoignent':' rejoint'} ${k==='jam'?'le garage':'la cuisine'}. ${o.refused.length?'Les autres poursuivent leur journée.':''}`:'Personne n’a accepté l’invitation. Aucune rencontre n’a démarré; elle ne sera pas relancée automatiquement.';}}
else if(k==='rest'){people.forEach(p=>{S().start(s,p,'rest');p.energy=Math.min(100,p.energy+8);});o.accepted=people.map(p=>({id:p.id,reason:'Prend une pause et récupère 8 énergie.'}));o.reason='La pause commence. Les musiciens concernés récupèrent immédiatement 8 énergie.';}
else if(k==='inspire'){people.forEach(p=>S().mood(s,p,'Inspiré'));o.accepted=people.map(p=>({id:p.id,reason:'Gagne temporairement l’état Inspiré.'}));o.reason='L’inspiration est appliquée immédiatement. Elle aidera leur prochaine composition; aucune activité supplémentaire n’est programmée.';}
else if(k.startsWith('card:')){const p=people[0],old=p.deck[o.slot],card=k.slice(5);if(o.cardMode==='add')p.deck.push(card);else p.deck[o.slot]=card;o.reason=(o.cardMode==='add'?`${p.name} ajoute « ${M().CARDS[card].name} » à son paquet.`:`${p.name} remplace « ${M().CARDS[old].name} » par « ${M().CARDS[card].name} ».`)+` Son paquet compte maintenant ${p.deck.length} cartes, toutes réunies dans la pioche commune du concert.`;}
else {o.reason=k==='skip'?'Le paquet est conservé tel quel. Aucune carte n’a été remplacée.':'Tu laisses la situation évoluer. Aucune activité n’est mise en attente.';}
if(o.status==='applied'&&['compose','duo','explore','continue','polish','revise','suggest','jam','coffee','rest'].includes(k)){for(const a of o.accepted){const p=s.people.find(p=>p.id===a.id);p.playerActionUntil=s.tick+(p.travel||0)+(p.remaining||0);}}
for(const a of o.accepted||[]){const p=s.people.find(p=>p.id===a.id);if(p)p.lastResponse={accepted:true,reason:a.reason,title:o.title,tick:s.tick};}for(const a of o.refused||[]){const p=s.people.find(p=>p.id===a.id);if(p)p.lastResponse={accepted:false,reason:a.reason,title:o.title,tick:s.tick};}
M().reconcileOccasions(s,o);S().log(s,o.status==='refused'?'Proposition refusée':o.status==='running'?'Proposition en cours':'Choix résolu',`${o.title} — ${o.reason}`,'choice');return o;}
function orderKey(r){const kind=r.type==='polish'?'continue':r.type;if(['trial','practice','continue','revise'].includes(kind))return kind+'|'+r.songId;return [kind,r.songId||'',r.action||'',(r.people||r.ids||[r.personId||'']).slice().sort().join(','),r.genre||'',r.type.startsWith('card:')||['skip','later','inspire'].includes(r.type)?r.eventId||'':''].join('|');}
function submit(s,request,rng=Math.random){init(s);const key=orderKey(request),existing=s.music.orders.find(o=>(!isDone(o)||o.created===s.tick)&&orderKey(o)===key);if(existing){s.music.lastSubmission={id:existing.id,duplicate:true};M().reconcileOccasions(s,existing);return existing;}const ss=s.music.session;if(ss&&ss.songId===request.songId&&ss.kind===request.type){const active={...request,id:ss.orderId||'session-'+ss.started,status:'running',until:ss.ends,people:ss.participants};s.music.lastSubmission={id:active.id,duplicate:true};return active;}s.music.lastSubmission=null;const o={...request,id:'order-'+(++s.serial),key,title:request.title||labels[request.type]||'Faire évoluer le paquet',created:s.tick,updated:s.tick,status:'waiting',reason:'',accepted:[],refused:[]};const gate=preflight(s,o);o.status=gate.status;o.reason=gate.reason||'';o.until=gate.until||null;if(gate.status==='ready')execute(s,o,rng);if(gate.status==='waiting')S().log(s,'Proposition mise en attente',`${o.title} — ${o.reason}`,'choice');s.music.orders.unshift(o);M().reconcileOccasions(s,o);while(s.music.orders.length>32){const index=s.music.orders.findLastIndex(isDone);if(index<0)break;s.music.orders.splice(index,1);}return o;}
function resolveEvent(s,id,choice,slot,rng=Math.random){M().reconcileOccasions(s);const e=s.music.pending.find(e=>e.id===id),c=e&&M().eventChoices(s,e).find(c=>c.id===choice);if(!e||!c)return false;const cardMode=slot==='add'?'add':'replace';if(choice.startsWith('card:')){const p=s.people.find(p=>p.id===e.personId);if(!p||e.rewardMode==='add'&&cardMode!=='add'||e.rewardMode==='replace'&&cardMode!=='replace'||cardMode==='replace'&&(!Number.isInteger(slot)||slot<0||slot>=p.deck.length))return false;}
const o=submit(s,{type:choice,eventId:id,eventType:e.type,songId:e.songId,personId:e.personId,people:e.people,genre:e.genre,title:c.title,slot,cardMode},rng);if(o.status==='blocked')return o;s.music.pending=s.music.pending.filter(e=>e.id!==id);if(e.rewardSource==='adoption'){const x=M().song(s,e.songId);if(x){x.cardRewards??={};x.cardRewards[e.personId]=choice==='skip'?'declined':'claimed';}}s.music.history.unshift({type:e.type,choice,personId:e.personId,songId:e.songId,cardMode,tick:s.tick,orderId:o.id,status:o.status});s.music.history=s.music.history.slice(0,30);s.music.nextStory=Math.max(s.music.nextStory,s.tick+20);return o;}

function cancel(s,id){const o=s.music.orders.find(o=>o.id===id);if(!o||o.status!=='waiting'||o.suspended)return false;o.status='cancelled';o.reason='Tu as annulé cette proposition avant son démarrage. Aucun effet n’a été appliqué.';o.updated=s.tick;S().log(s,'Proposition annulée',o.title,'choice');return true;}
function reserved(s,id){return (s.music.orders||[]).some(o=>o.status==='waiting'&&['compose','duo','explore'].includes(o.type)&&participants(s,o).some(p=>p.id===id));}
function hasDueOrder(s){return (s.music.orders||[]).some(o=>o.status==='waiting'&&preflight(s,o).status==='ready');}
function step(s,rng){init(s);for(const o of ordered(s)){if(o.status!=='waiting')continue;const gate=preflight(s,o);o.reason=gate.reason||'';o.until=gate.until||null;if(gate.status==='waiting')continue;if(gate.status==='blocked'){o.status='blocked';o.updated=s.tick;}else execute(s,o,rng);notice(s,{kind:'order',presentation:o.status==='running'?'toast':'dialog',orderId:o.id,songId:o.songId,people:o.people,personId:o.personId,title:o.status==='running'?'Ta proposition démarre':o.status==='refused'?'La proposition a été refusée':o.status==='blocked'?'La situation a changé':'Ta proposition a été réalisée',body:o.title,consequences:[o.reason],accepted:o.accepted,refused:o.refused});}}
function completeSession(s,ss,x){const o=(s.music.orders||[]).find(o=>o.id===ss.orderId);if(!o)return;o.status='applied';o.updated=s.tick;o.until=null;o.reason=ss.kind==='trial'?`L’essai est terminé. ${x.adopted?'Le groupe adopte la chanson.':'Le groupe ne l’adopte pas.'}`:`La répétition est terminée. Préparation de « ${x.title} » : ${x.preparation} %.`;}
root.MaisonDecisions={init,notice,acknowledge,acknowledgeOrder,preflight,submit,resolveEvent,cancel,reserved,hasDueOrder,step,completeSession,isDone,ordered,isTransient};
})(typeof globalThis!=='undefined'?globalThis:this);

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
root.MaisonHouse={WIDTH,HEIGHT,HALL,ENTRY,GARAGE_EXIT,nodes,links,tourPath,rooms,bedroom,init,occupants,position,path,garageLayout,lightPhase};
})(typeof globalThis!=='undefined'?globalThis:this);

(function(root){
'use strict';
const S=()=>root.MaisonSim;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const stages=[{min:1,max:20,label:'Abattu',tone:'very-low'},{min:21,max:40,label:'Découragé',tone:'low'},{min:41,max:60,label:'Stable',tone:'steady'},{min:61,max:80,label:'Motivé',tone:'high'},{min:81,max:100,label:'Enthousiaste',tone:'very-high'}];
function initPerson(p){p.morale=clamp(Math.round(Number.isFinite(p.morale)?p.morale:60),1,100);p.moraleHistory??=[];p.moraleMilestones??={};}
function init(s){s.people.forEach(initPerson);return s;}
function stage(p){const value=clamp(Math.round(Number.isFinite(p.morale)?p.morale:60),1,100);return {...stages[Math.floor((value-1)/20)],value,index:Math.floor((value-1)/20)};}
const week=s=>root.MaisonWeeks?root.MaisonWeeks.week(s):Math.floor(s.tick/144)+1;
function change(s,p,amount,reason,{key='moment',once=false,routine=false}={}){initPerson(p);if(once&&p.moraleMilestones[key])return 0;const w=week(s);if(!p.moraleBudget||p.moraleBudget.week!==w)p.moraleBudget={week:w,gain:0,loss:0,counts:{}};const b=p.moraleBudget;if(routine){if((b.counts[key]||0)>=2)return 0;const left=6-(amount>0?b.gain:b.loss);if(left<=0)return 0;amount=Math.sign(amount)*Math.min(Math.abs(amount),left);b.counts[key]=(b.counts[key]||0)+1;}
 const before=p.morale;p.morale=clamp(Math.round(p.morale+amount),1,100);const delta=p.morale-before;if(once)p.moraleMilestones[key]=true;if(!delta)return 0;if(routine)b[delta>0?'gain':'loss']+=Math.abs(delta);p.moraleHistory.unshift({tick:s.tick,week:w,delta,reason,value:p.morale});p.moraleHistory=p.moraleHistory.slice(0,8);return delta;}
function activity(s,p,action){const has=t=>S().has(p,t);let n=0,reason='';if(action==='rest'){n=has('solitaire')||has('paresseux')?3:1;reason=has('solitaire')?'Un moment au calme lui fait du bien.':'Une pause bienvenue.';}else if(action==='party'){n=has('sociable')?3:has('spontan')?2:1;reason='Un bon moment à faire la fête.';}else if(action==='jam'){n=has('spontan')?3:2;reason='Le plaisir de jouer librement.';}else if(action==='practice'){n=has('paresseux')?-1:has('ambitie')||has('minutieu')?2:1;reason=n<0?'Les exercices répétés lui pèsent.':'Le travail de son instrument lui donne confiance.';}if(n)change(s,p,n,reason,{key:'activity-'+action,routine:true});if(p.energy<20&&action!=='rest')change(s,p,has('sensible')?-3:-2,'Continuer en étant épuisé lui pèse.',{key:'exhaustion',routine:true});}
function composing(s,p,x){change(s,p,S().has(p,'créati')?3:2,`Son idée avance dans « ${x.title} ».`,{key:'composition-work',routine:true});}
function social(s,a,b,negative){for(const [p,other] of [[a,b],[b,a]])change(s,p,negative?(S().has(p,'sensible')?-5:-3):(S().has(p,'sociable')?3:1),negative?`Une tension avec ${other.name} l’affecte.`:`Un échange agréable avec ${other.name}.`,{key:negative?'conflict':'social',routine:true});}
function songEvent(s,x,kind,ids=x.authors){const amount={composition:4,adoption:8,rejection:-4,ready:4}[kind],reason={composition:`A terminé « ${x.title} ».`,adoption:`Sa chanson « ${x.title} » a été adoptée.`,rejection:`Le groupe n’a pas adopté « ${x.title} ».`,ready:`« ${x.title} » est prête pour la scène.`}[kind];for(const id of ids){const p=s.people.find(p=>p.id===id);if(p)change(s,p,kind==='rejection'&&S().has(p,'sensible')?-6:amount,reason,{key:kind+'-'+x.id,once:true});}}
function willingness(p,action){const st=stage(p);if(st.index<2&&(action==='rest'||action==='talk'&&S().has(p,'sociable')||action==='compose'&&(S().has(p,'solitaire')||S().has(p,'créati'))))return .08;return (st.index-2)*.04;}
function bias(s,p,weights){if(stage(p).index<2){const comfort=S().has(p,'solitaire')?'compose':S().has(p,'sociable')?'talk':'rest';weights[comfort]=(weights[comfort]||0)+4;}else if(stage(p).index>=3){weights.jam+=1;weights.compose+=1;}}
function wake(s,people){for(const r of people){const p=s.people.find(p=>p.id===r.id);if(!p)continue;if(r.awakeHours>=3)change(s,p,-3,'Une nuit trop courte affecte son moral.',{key:'short-night-'+week(s),once:true});else if(r.sleepHours>=6){const delta=clamp(60-p.morale,-2,2);change(s,p,delta,'Avec le repos, les émotions de la veille s’apaisent.',{key:'wake-'+week(s),once:true});}}}
root.MaisonMorale={init,initPerson,stage,stages,change,activity,composing,social,songEvent,willingness,bias,wake};
})(typeof globalThis!=='undefined'?globalThis:this);

(function(root){
'use strict';
const N=root.MaisonNames||null;
const trios=[{name:'Le garage électrique',note:'Une voix, des riffs et du rythme.',instruments:['Chant','Guitare','Batterie']},{name:'Les mélodies du salon',note:'Une voix portée par les touches et le tempo.',instruments:['Chant','Clavier','Batterie']},{name:'Le moteur à trois',note:'Cordes, basses et batterie en conversation.',instruments:['Guitare','Basse','Batterie']},{name:'La maison cuivrée',note:'Du souffle, des couleurs et des percussions.',instruments:['Saxophone','Trompette','Percussions']}];
const pick=(xs,rng)=>xs[Math.min(xs.length-1,Math.floor(rng()*xs.length))];
function profile(id,instrument,rng=Math.random,usedNames=[]){const gender=rng()<.5?'female':'male';const traits=[pick(['Créatif','Minutieux','Spontané'],rng),pick(['Sociable','Solitaire','Bienveillant'],rng),pick(['Ambitieuse','Paresseux','Sensible','Énergique'],rng)];return {id,instrument,gender,name:N.musician(usedNames,gender,rng),traits,color:pick(['#bd663f','#6c8272','#81769c','#bf9854','#638897','#aa7180'],rng),skin:pick(['#efbd95','#c68c68','#a96c4e','#784e3c','#f0c19a'],rng),hair:pick(['#493127','#242727','#884f2c','#bca471','#604a69'],rng),style:pick(['Indie','Jazz','Pop','Folk','Ska','Punk'],rng),want:pick(['Terminer une chanson','Trouver une nouvelle idée','Faire vibrer le garage','Rencontrer des partenaires'],rng)};}
function draft(index,rng=Math.random){const profiles=[];for(const instrument of trios[index].instruments)profiles.push(profile(root.MaisonSim.PEOPLE[profiles.length].id,instrument,rng,profiles.map(p=>p.name)));return profiles;}
function create(profiles,selected){const s=root.MaisonSim.create(3,profiles);s.playerId=profiles[selected].id;for(const p of s.people){p.room=p.bedroomId;p.action='rest';p.remaining=1;p.waking=true;}root.MaisonGoals.init(s);return s;}
root.MaisonCasting={trios,profile,draft,create};
})(globalThis);

// Generated by scripts/build-bandlive.cjs; provenance: vendor/simon/UPSTREAM.md
(function(root){'use strict';const modules={};
modules["bandlive-reactions"]=(()=>{
// Reaction RNG is independent of card draws and world simulation.
const REACTIONS=Object.freeze({
  bored:{name:'Ennui 3',icon:'☾',value:3,description:'En fin de tour : perd 3 conquête, sauf protection. Reste si aucune conquête ne peut être perdue.'},
  attentive:{name:'Attentif',description:'La prochaine carte de puissance qui le touche reçoit +3 puissance contre lui.'},
  distracted:{name:'Distrait',description:'La prochaine carte de puissance qui le touche reçoit −3 puissance contre lui, minimum 0.'},
  rhythm:{name:'Attend du rythme',icon:'♫',description:'3 tempo réellement gagnés ce tour → +3 conquête immédiatement. Une fois par tour.'},
  variety:{name:'Veut de la variété',description:'Quand un deuxième musicien différent le touche avec une carte de puissance dans le même tour, cette carte reçoit +3 puissance contre lui.'},
  following:{name:'Se laisse entraîner',icon:'↗',description:'Un voisin immédiat conquis → +3 conquête immédiatement. Une fois par tour.'},
});
function clearReactionProgress(fan){fan.reactionActors=[];fan.reactionTempo=0;fan.reactionNeighbor=false;}
function rerollReaction(game,fan){
  const choices=Object.keys(REACTIONS).filter(key=>key!==fan.intent);
  game.reactionRng=(Math.imul(1664525,game.reactionRng)+1013904223)>>>0;
  fan.intent=choices[Math.floor(game.reactionRng/4294967296*choices.length)];clearReactionProgress(fan);
}
function initializeReactions(game,version=2){
  game.reactionVersion=version;game.reactionRng=(game.seed^0x51a7c3d9)>>>0;
  if(version>=2)game.fans.forEach(f=>f.reactionUsed=false);
  game.fans.forEach(fan=>{fan.intent=null;rerollReaction(game,fan);});
}
function reactionPower(game,fan,actorId){
  if(!game.reactionVersion||fan.reactionUsed)return 0;
  return fan.intent==='attentive'?3:fan.intent==='distracted'?-3:fan.intent==='variety'&&fan.reactionActors.some(id=>id!==actorId)?3:0;
}
function hitReaction(game,fan,actorId){
  if(!game.reactionVersion||fan.reactionUsed)return false;
  if(['attentive','distracted'].includes(fan.intent))return true;
  if(fan.intent!=='variety')return false;
  const triggered=fan.reactionActors.some(id=>id!==actorId);
  if(!fan.reactionActors.includes(actorId))fan.reactionActors.push(actorId);
  return triggered;
}
function reactionText(game,fan){
  if(!game.reactionVersion)return fan.intent==='solo'?'Attend un Solo':'S’ennuie · −3 conquête';
  if(fan.reactionUsed)return '';
  const r=REACTIONS[fan.intent];
  return r.name+(['attentive','distracted'].includes(fan.intent)?(fan.intent==='attentive'?' +3':' −3'):fan.intent==='rhythm'?` · ${Math.min(3,fan.reactionTempo)}/3`:fan.intent==='variety'?` · ${Math.min(1,fan.reactionActors.length)}/2`:'');
}


return {REACTIONS,clearReactionProgress,rerollReaction,initializeReactions,reactionPower,hitReaction,reactionText};})();
modules["song-rules"]=(()=>{
// A composition has a fixed length, not an experience level. Missing values
// keep legacy songs at three turns without rerolling saves or consuming RNG.
const songTurns = song => song?.turns ?? 3;
// Presentation only: derive from the saved score, including legacy songs.
const SONG_QUALITY_TIERS = Object.freeze([
  Object.freeze({id:'rough',label:'Bancale',min:0,max:25}),
  Object.freeze({id:'modest',label:'Modeste',min:25,max:50}),
  Object.freeze({id:'catchy',label:'Accrocheuse',min:50,max:80}),
  Object.freeze({id:'hit',label:'Hit',min:80,max:100}),
]);
function songQualityTier(song) {
  const quality=Number.isFinite(song?.quality)?song.quality:0;
  return SONG_QUALITY_TIERS.findLast(t=>quality>=t.min)||SONG_QUALITY_TIERS[0];
}
function songQualityHTML(song) {
  const tier=songQualityTier(song);
  return `<span class="song-quality song-quality-${tier.id}" title="Qualité de composition : ${tier.min} à ${tier.max}${tier.max===100?' inclus':' exclu'}/100. Catégorie descriptive, sans bonus BandLive.">${tier.label}</span>`;
}
function compositionTurns(quality, random) {
  const q = Math.max(0, Math.min(100, quality)) / 100;
  const draw = random();
  return draw < .1 + .5 * q ? 5 : draw < .4 + .5 * q ? 4 : 3;
}


return {songTurns,SONG_QUALITY_TIERS,songQualityTier,songQualityHTML,compositionTurns};})();
modules["bandlive-cards"]=(()=>{
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
const CARD_KINDS=Object.freeze(['note','special','new1','new2']);
const starterDeck=()=>['note','note','special'];
const specialChoices=instrument=>['special','new1','new2'].map(kind=>({kind,...definitionFor(instrument,kind)}));
function definitionFor(instrument,kind){return kind==='note'?NOTE:kind==='special'?SPECIALS[instrument]:NEW_SPECIALS[instrument]?.[kind==='new1'?0:kind==='new2'?1:-1];}
function validateDeck(deck){if(!Array.isArray(deck)||deck.length<1||deck.some(k=>!CARD_KINDS.includes(k)))throw Error('Deck BandLive invalide.');return deck;}
function validatePersonDecks(person){
  if(person.bandLiveDecks===undefined)return;
  const decks=person.bandLiveDecks;
  if(!decks||typeof decks!=='object'||Array.isArray(decks)||Object.keys(decks).some(k=>!Object.hasOwn(INSTRUMENTS,k)))throw Error('Collection de decks BandLive invalide.');
  Object.values(decks).forEach(validateDeck);
}
function musicianDeck(person,instrument=person.instrument){
  if(!Object.hasOwn(INSTRUMENTS,instrument))throw Error('Instrument BandLive invalide.');
  validatePersonDecks(person);
  return [...validateDeck(person.bandLiveDecks?.[instrument]||starterDeck())];
}
function rememberInstrumentDeck(person,instrument=person.instrument){
  const deck=musicianDeck(person,instrument);person.bandLiveDecks??={};person.bandLiveDecks[instrument]=deck;return deck;
}
function changeBandLiveInstrument(person,instrument){
  if(!Object.hasOwn(INSTRUMENTS,instrument))throw Error('Instrument BandLive invalide.');
  rememberInstrumentDeck(person);rememberInstrumentDeck(person,instrument);person.instrument=instrument;
}


return {INSTRUMENTS,SPECIALS,NOTE,NEW_SPECIALS,CARD_KINDS,starterDeck,specialChoices,definitionFor,validateDeck,validatePersonDecks,musicianDeck,rememberInstrumentDeck,changeBandLiveInstrument};})();
modules["bandlive"]=(()=>{
const {REACTIONS,initializeReactions,clearReactionProgress,rerollReaction,reactionPower,hitReaction}=modules["bandlive-reactions"];
const {songTurns}=modules["song-rules"];
// BandLive keeps its own RNG and decks. Concert outcomes are connected separately.
const RULES = Object.freeze({minMembers:2,maxMembers:24,minAudience:3,maxAudience:12,energy:3,hand:5,turns:6,songTurns:3,tempoMax:10,finale:3,boredom:3,styleBonus:2,soloBonus:3});
const STYLES = Object.freeze(['Indie','Punk','Folk','Métal','Jazz','Électro','Ska','Pop']);
const {INSTRUMENTS,SPECIALS,NOTE,definitionFor,musicianDeck,validateDeck}=modules["bandlive-cards"];


const CONQUEST_EFFECTS = Object.freeze({
  shock:{name:'Onde de choc',icon:'✺',description:'3 puissance aux voisins immédiats (gauche, droite, devant et derrière).'},
  wave:{name:'Vague d’enthousiasme',icon:'↔',description:'2 puissance aux autres spectateurs de la même rangée.'},
  pierce:{name:'Percée dans la foule',icon:'↓',description:'4 puissance derrière, dans la même colonne. Continue si la cible est conquise ; traverse les spectateurs déjà conquis.'},
  spotlight:{name:'Sous les projecteurs',icon:'✦',description:'Les voisins immédiats subissent +2 puissance par carte jusqu’à la fin du tour. Non cumulable.'},
  chorus:{name:'Chœur du public',icon:'♫',description:'Les autres spectateurs de la rangée adoptent le style de la chanson actuelle jusqu’à sa fin.'},
});
function conquestLabel(game,fan){const e=CONQUEST_EFFECTS[fan.effect];return e?(game.conquestVersion>=2?`${fan.effect==='spotlight'?'Projecteur':e.name} ${fan.effectValue}`:e.name):'';}
function conquestDescription(game,fan){
  if(game.conquestVersion!==2)return CONQUEST_EFFECTS[fan.effect]?.description||'';
  return fan.effect==='shock'?`${fan.effectValue} puissance à chaque voisin immédiat.`:fan.effect==='spotlight'?`Voisins immédiats : +${fan.effectValue} puissance par carte jusqu’à la fin du tour. Non cumulable; la valeur la plus forte reste.`:`${fan.effectValue} voisin(s) adoptent le style de la toune jusqu’à sa fin. Priorité aux voisins non conquis d’un autre style, dans l’ordre de la grille.`;
}
const audienceColumns=game=>game.gridColumns??(game.conquestVersion?Math.min(4,game.fans.length):game.fans.length>6?Math.ceil(game.fans.length/2):game.fans.length);
const favoriteStyle=fan=>fan.turnStyle||fan.chorusStyle||fan.favorite;
// Board positions are independent of screen size and never collapse after a conquest.
function conquestTargets(game,fan){
  if(!game.conquestVersion)return [];
  const index=game.fans.indexOf(fan),cols=audienceColumns(game),row=Math.floor(index/cols),col=index%cols;
  if(index<0)return [];
  if(game.conquestVersion>=2){
    const neighbors=game.fans.filter((f,i)=>f!==fan&&f.hp>0&&Math.abs(Math.floor(i/cols)-row)+Math.abs(i%cols-col)===1);
    return fan.effect==='chorus'?neighbors.filter(f=>favoriteStyle(f)!==currentSong(game)?.style).slice(0,fan.effectValue):neighbors;
  }
  if(fan.effect==='pierce'){
    const targets=[];
    for(let i=index+cols;i<game.fans.length;i+=cols){const f=game.fans[i];if(f.hp===0)continue;targets.push(f);if(f.hp>4)break;}
    return targets;
  }
  return game.fans.filter((f,i)=>f!==fan&&f.hp>0&&(['wave','chorus'].includes(fan.effect)?Math.floor(i/cols)===row:Math.abs(Math.floor(i/cols)-row)+Math.abs(i%cols-col)===1));
}
function assignConquestEffects(game,version=2){
  // A separate seeded shuffle leaves the card draw and world RNG unchanged.
  const rng={rng:(game.seed^0x9e3779b9)>>>0},keys=shuffle(rng,version>=2?['shock','spotlight','chorus']:Object.keys(CONQUEST_EFFECTS));
  const effects=shuffle(rng,Array.from({length:game.fans.length},(_,i)=>keys[i%keys.length]));
  game.conquestVersion=version;
  game.fans.forEach((fan,i)=>{fan.effect=effects[i];if(version>=2)fan.effectValue=fan.effect==='shock'?2+Math.floor(random(rng)*4):1+Math.floor(random(rng)*(fan.effect==='chorus'?2:3));});
}

function random(game) {
  game.rng=(Math.imul(1664525,game.rng)+1013904223)>>>0;
  return game.rng/4294967296;
}
function shuffle(game,items) {
  for(let i=items.length-1;i>0;i--){const j=Math.floor(random(game)*(i+1));[items[i],items[j]]=[items[j],items[i]];}
  return items;
}
function log(game,message){game.logs.push(message);}
function cardDefinition(card){return definitionFor(card.instrument,card.kind);}
function cardById(game,id){return game.cards.find(card=>card.id===id);}

const AUDIENCE=[
  ['Lou',24,'#c798ac','hair'],['Pat',20,'#d6b15a','glasses'],['Kim',25,'#78a89b','cap'],
  ['Max',24,'#a88dc6','cap'],['Sacha',20,'#d18e71','hair'],['Nico',25,'#88a6ce','glasses'],
  ['Charlie',24,'#b5b477','hair'],['Alex',20,'#c78296','cap'],['Jo',25,'#86b6a0','glasses'],
  ['Mika',24,'#cda763','glasses'],['Cam',20,'#aa91b7','hair'],['Jules',25,'#7ba6af','cap'],
];
function createAudience(songs,count,rules=null){
  const styles=rules?.styles||[...new Set(songs.map(song=>song.style))];
  return AUDIENCE.slice(0,count).map(([name,base,color,accessory],i)=>({
    id:`f${i}`,name,max:Math.round(base*(rules?.resistancePercent||100)/100),hp:Math.round(base*(rules?.resistancePercent||100)/100),favorite:rules?styles[i%styles.length]:i<3?(songs[i===0?0:1]||songs[0]).style:styles[(i-3)%styles.length],
    color,identity:{accessory},intent:i%2?'solo':'bored',
  }));
}

function createBandLive(options) { return createGame(options,RULES.maxMembers); }
function createGame({people,groupId=null,groupName='Le band du quartier',songs,seed=2040,audienceSize=RULES.minAudience,audienceRules=null,songOrder=null,conquestEffects=true,freeSetlist=false,persistentReactions=true,rulesVersion=2},memberLimit) {
  if(!Array.isArray(people)||people.length<RULES.minMembers||people.length>memberLimit||people.some(p=>!p||typeof p.id!=='string'||!p.id||typeof p.name!=='string'||!SPECIALS[p.instrument])||new Set(people.map(p=>p.id)).size!==people.length)throw Error('Choisis de deux à vingt-quatre musiciens du groupe.');
  if(!Array.isArray(songs)||!songs.length||new Set(songs.map(s=>s.id)).size!==songs.length||songs.some(s=>!s||!s.id||!s.title||!s.style||(s.turns!==undefined&&![3,4,5,6].includes(s.turns)||s.energyPerTurn!==undefined&&![2,3,4,5].includes(s.energyPerTurn))))throw Error('Choisis une chanson du répertoire.');
  if(groupId!==null&&(typeof groupId!=='string'||!groupId))throw Error('Groupe invalide.');
  if(!Number.isInteger(audienceSize)||audienceSize<RULES.minAudience||audienceSize>RULES.maxAudience)throw Error('Choisis de trois à douze spectateurs.');
  if(audienceRules&&(!Array.isArray(audienceRules.styles)||!audienceRules.styles.length||new Set(audienceRules.styles).size!==audienceRules.styles.length||audienceRules.styles.some(s=>!STYLES.includes(s))||!Number.isInteger(audienceRules.resistancePercent)||audienceRules.resistancePercent<20||audienceRules.resistancePercent>200))throw Error('Public BandLive invalide.');
  if(songOrder&&(!Array.isArray(songOrder)||songOrder.length!==2||songOrder.some(id=>!songs.some(s=>s.id===id))))throw Error('La setlist BandLive doit prévoir deux passages.');
  const actors=people.map(p=>({id:p.id,name:p.name,instrument:p.instrument,bandLiveDeck:[...validateDeck(p.bandLiveDeck||musicianDeck(p))],genre:p.genre,color:p.color,identity:structuredClone(p.identity||{}),personality:structuredClone(p.personality||{}),skill:p.skills?.[p.instrument]??p.skill??0,...(p.xp!==undefined?{xp:p.xp}:{}),needs:structuredClone(p.needs||{}),exaltation:p.exaltation??p.emotions?.exaltation??0,distress:p.distress??p.emotions?.distress??0}));
  const cards=actors.flatMap(actor=>actor.bandLiveDeck.map((kind,i)=>({id:`${actor.id}:${i}`,actorId:actor.id,instrument:actor.instrument,kind})));
  const game={version:songs.some(s=>s.turns!==undefined)?4:audienceRules||songOrder?3:2,seed:seed>>>0,rng:seed>>>0,groupId,groupName,actors,cards,songs:structuredClone(songs),usedSongs:[],songId:null,phase:'choose',turn:0,section:0,energy:3,tempo:0,boost:0,hand:[],deck:cards.map(c=>c.id),discard:[],played:0,logs:['Le band prend la scène. Choisis la première chanson.'],events:[],fans:createAudience(songs,audienceSize,audienceRules)};
  if(freeSetlist){if(songOrder)throw Error('Le choix libre ne peut pas imposer un ordre.');game.freeSetlist=true;}
  if(game.version>=3){game.audienceRules=structuredClone(audienceRules);game.songOrder=songOrder&&[...songOrder];}
  shuffle(game,game.deck);
  // Preserve ENCORE's varied opening hand, without looping for a two-person band.
  if(actors.length>=3)for(let tries=0;tries<100&&new Set(game.deck.slice(-5).map(id=>cardById(game,id).actorId)).size<3;tries++)shuffle(game,game.deck);
  if(conquestEffects)assignConquestEffects(game,rulesVersion);
  if(rulesVersion>=2)game.gridColumns=audienceSize>8?Math.ceil(audienceSize/2):Math.min(4,audienceSize);
  if(persistentReactions)initializeReactions(game,rulesVersion);
  return game;
}
const passageTurns=game=>game.version>=4?songTurns(currentSong(game)):RULES.songTurns;
function totalTurns(game){
  if(game.cooperative)return songTurns(currentSong(game));
  if(game.version<4)return RULES.turns;
  const ids=game.songOrder||game.usedSongs,used=ids.reduce((n,id)=>n+songTurns(game.songs.find(s=>s.id===id)),0);
  const remaining=2-ids.length;
  if(!remaining)return used;
  const lengths=availableSongs(game).map(songTurns).sort((a,b)=>b-a);
  return used+(game.songs.length===1?remaining*lengths[0]:lengths.slice(0,remaining).reduce((n,x)=>n+x,0));
}
const sectionName=game=>game.section===passageTurns(game)?'Finale':game.section===1?'Couplet':`Refrain ${game.section-1}`;
function currentSong(game){return game.songs.find(song=>song.id===game.songId);}
function availableSongs(game){return game.songs.filter(song=>game.songOrder?song.id===game.songOrder[game.usedSongs.length]:game.songs.length===1||!game.usedSongs.includes(song.id));}
function draw(game,count) {
  for(let i=0;i<count;i++){
    if(!game.deck.length)game.deck=shuffle(game,game.discard.splice(0));
    if(game.deck.length)game.hand.push(game.deck.pop());
  }
}
function startTurn(game) {
  game.phase='play';game.turn++;game.section++;game.energy=currentSong(game).energyPerTurn??RULES.energy;game.boost=0;
  if(game.reactionVersion)game.fans.forEach(f=>{if(game.reactionVersion>=2&&f.reactionUsed&&f.hp>0)rerollReaction(game,f);clearReactionProgress(f);if(game.reactionVersion>=2)f.reactionUsed=false;});
  else game.fans.forEach((fan,i)=>fan.intent=(game.turn+i)%2?'bored':'solo');
  game.relayBoosts=[];
  draw(game,RULES.hand);
  log(game,`Tour ${game.turn} · ${currentSong(game).title} · ${sectionName(game)}.`);
}
function chooseSong(game,id) {
  if(game.phase!=='choose'||!availableSongs(game).some(song=>song.id===id))return {ok:false,message:'Cette chanson ne peut pas être choisie.'};
  game.fans.forEach(fan=>{delete fan.chorusStyle;delete fan.spotlight;delete fan.turnStyle;delete fan.noBoredom;});
  game.songId=id;game.usedSongs.push(id);game.section=0;
  if(game.turn)game.tempo=Math.max(0,game.tempo-2);
  startTurn(game);
  return {ok:true};
}
function canPlay(game,id) {
  const card=cardById(game,id);
  return !!card&&game.phase==='play'&&game.hand.includes(id)&&game.energy>=cardDefinition(card).cost&&(!cardDefinition(card).discard||game.hand.length>1)&&(!cardDefinition(card).twoTargets||game.fans.filter(f=>f.hp>0).length>=2)&&(!cardDefinition(card).oncePerTurn||!game.events.some(e=>e.type==='card'&&e.turn===game.turn&&e.cardId===id));
}
const alternates=(game,card)=>{const prev=game.events.findLast(e=>e.type==='card'&&e.turn===game.turn);return !!prev&&prev.actorId!==card.actorId;};
function neighboring(game,a,b){const n=audienceColumns(game),i=game.fans.indexOf(a),j=game.fans.indexOf(b);return Math.abs(Math.floor(i/n)-Math.floor(j/n))+Math.abs(i%n-j%n)===1;}
function cardTargets(game,card,fan,second){
  const d=cardDefinition(card),alive=game.fans.filter(f=>f.hp>0),i=game.fans.indexOf(fan),cols=audienceColumns(game);
  if(d.target==='audience')return alive;
  if(!fan||fan.hp===0)return [];
  if(d.twoTargets)return [fan,second].filter(Boolean);
  if(d.shape==='row')return alive.filter(f=>Math.floor(game.fans.indexOf(f)/cols)===Math.floor(i/cols));
  if(d.shape==='sides')return [fan,...alive.filter(f=>f!==fan&&Math.floor(game.fans.indexOf(f)/cols)===Math.floor(i/cols)&&Math.abs(game.fans.indexOf(f)-i)===1)];
  if(d.shape==='behind'){for(let j=i+cols;j<game.fans.length;j+=cols)if(game.fans[j].hp>0)return [fan,game.fans[j]];}
  return [fan];
}
const fatigue=energy=>Math.round(energy??100)>60?0:Math.round(energy??100)>30?2:3;
const cardFatigue=(game,card)=>fatigue(game.actors.find(a=>a.id===card.actorId)?.needs.energy);
function powerAgainst(game,card,fan,base=cardDefinition(card).power) {
  const d=cardDefinition(card);
  if(!Object.hasOwn(d,'power'))return 0;
  return Math.max(0,base-cardFatigue(game,card)+(d.useTempo?game.tempo:0)+(d.consumeTempo?Math.min(game.tempo,d.consumeTempo)*(d.tempoMultiplier||1):0)+game.boost+(game.relayBoosts||[]).filter(b=>b.actorId!==card.actorId).reduce((n,b)=>n+b.power,0)+(favoriteStyle(fan)===currentSong(game)?.style?RULES.styleBonus:0)+(fan.spotlight?(typeof fan.spotlight==='number'?fan.spotlight:2):0)+(d.solo&&fan.intent==='solo'?RULES.soloBonus:0)+(alternates(game,card)?d.alternatePower||0:0)+(game.tempo>=d.tempoThreshold?d.thresholdPower||0:0)+(d.conqueredNeighborPower&&game.fans.some(f=>f.hp===0&&neighboring(game,fan,f))?d.conqueredNeighborPower:0)+reactionPower(game,fan,card.actorId));
}
function triggerReaction(game,fan,queue){
  if(fan.hp===0||fan.reactionUsed)return;
  fan.reactionUsed=true;
  const before=fan.hp;fan.hp=Math.max(0,fan.hp-3);
  game.events.push({id:game.events.length+1,type:'reaction',turn:game.turn,fanId:fan.id,name:REACTIONS[fan.intent].name,hits:[{id:fan.id,before,after:fan.hp,gain:before-fan.hp,power:3}]});
  log(game,`${fan.name} · ${REACTIONS[fan.intent].name} : +${before-fan.hp} conquête.`);
  conquer(game,fan,queue);
}
function conquer(game,fan,queue) {
  if(fan.hp!==0||fan.conquered)return;
  fan.conquered=true;log(game,`${fan.name} est conquis !`);
  if(game.conquestVersion)queue.push(fan);
  if(game.reactionVersion)for(const other of game.fans)if(other.hp>0&&other.intent==='following'&&neighboring(game,fan,other)){
    other.reactionNeighbor=true;
    if(game.reactionVersion>=2)triggerReaction(game,other,queue);
  }
}
function resolveConquests(game,queue){
  const events=[];
  for(let i=0;i<queue.length;i++){
    const fan=queue[i],effect=CONQUEST_EFFECTS[fan.effect],targets=conquestTargets(game,fan),hits=[];
    for(const target of targets){
      if(['shock','wave','pierce'].includes(fan.effect)){
        const power=fan.effectValue||{shock:3,wave:2,pierce:4}[fan.effect],before=target.hp;
        target.hp=Math.max(0,before-power);hits.push({id:target.id,before,after:target.hp,gain:before-target.hp,power});conquer(game,target,queue);
      }else if(fan.effect==='spotlight')target.spotlight=game.conquestVersion>=2?Math.max(Number(target.spotlight)||0,fan.effectValue):true;
      else if(fan.effect==='chorus')target.chorusStyle=currentSong(game).style;
    }
    const event={id:game.events.length+1,type:'conquest',turn:game.turn,fanId:fan.id,name:conquestLabel(game,fan),effect:fan.effect,targets:targets.map(f=>f.id),hits};
    game.events.push(event);events.push(event);
    log(game,`${fan.name} · ${effect.name} : ${targets.length?targets.map(f=>f.name).join(', '):'aucune cible restante'}.`);
  }
  return events;
}
// Use the real resolver on a copy so previews include chains and never consume resources.
function previewCard(game,id,targetId=null,options={}){
  const after=structuredClone(game),result=playCard(after,id,targetId,options);
  return result.ok?{...result,game:after}:result;
}
function checkVictory(game) {
  if(game.fans.every(fan=>fan.hp===0)){game.phase='won';log(game,'Tout le public est conquis. Show réussi !');return true;}
  return false;
}
function playCard(game,id,targetId=null,{secondTargetId=null,discardId=null}={}) {
  if(!canPlay(game,id))return {ok:false,message:'Cette carte ne peut pas être jouée : vérifie ta main et ton énergie.'};
  const card=cardById(game,id),d=cardDefinition(card),fan=game.fans.find(f=>f.id===targetId),second=game.fans.find(f=>f.id===secondTargetId);
  if(d.target==='single'&&(!fan||fan.hp===0))return {ok:false,message:'Choisis un spectateur encore à conquérir.'};
  if(d.twoTargets&&(!second||second===fan||second.hp===0))return {ok:false,message:'Choisis deux spectateurs distincts encore à conquérir.'};
  if(d.discard&&(!game.hand.includes(discardId)||discardId===id))return {ok:false,message:'Choisis une autre carte de ta main à défausser.'};
  const powerCard=Object.hasOwn(d,'power'),targets=cardTargets(game,card,fan,second),alternate=alternates(game,card),threshold=game.tempo>=d.tempoThreshold,neighbor=fan&&game.fans.some(f=>f.hp===0&&neighboring(game,fan,f)),triggered=[];
  const eventStart=game.events.length,tempoBefore=game.tempo;
  // Snapshot every target before effects, resource consumption or conquest chains.
  const planned=powerCard?targets.map((f,i)=>({id:f.id,power:powerAgainst(game,card,f,i>0&&d.secondaryPower!==undefined?d.secondaryPower:d.power)})):[],queue=[],hits=[];
  game.energy-=d.cost;game.hand.splice(game.hand.indexOf(id),1);game.discard.push(id);game.played++;
  if(d.discard){game.hand.splice(game.hand.indexOf(discardId),1);game.discard.push(discardId);}
  for(const hit of planned){
    const f=game.fans.find(f=>f.id===hit.id),strikes=d.strikes||1;
    if(hitReaction(game,f,card.actorId)){triggered.push(f);if(game.reactionVersion>=2){f.reactionUsed=true;game.events.push({id:game.events.length+1,type:'reaction',turn:game.turn,fanId:f.id,name:REACTIONS[f.intent].name,hits:[]});}}
    for(let n=0;n<strikes&&f.hp>0;n++){
      const power=Math.floor(hit.power/strikes)+(n<hit.power%strikes?1:0),before=f.hp;
      f.hp=Math.max(0,f.hp-power);hits.push({id:f.id,before,after:f.hp,gain:before-f.hp,power});conquer(game,f,queue);
    }
  }
  const directConquests=new Set(hits.filter(h=>h.after===0).map(h=>h.id)).size;
  if(powerCard){game.relayBoosts=(game.relayBoosts||[]).filter(b=>b.actorId===card.actorId);game.boost=0;if(d.useTempo)game.tempo=0;else if(d.consumeTempo)game.tempo=Math.max(0,game.tempo-d.consumeTempo);}
  const tempo=(d.tempo||0)+(neighbor?d.neighborTempo||0:0)+(alternate?d.alternateTempo||0:0)+Math.min(d.tempoCap||0,directConquests*(d.tempoOnConquest||0));
  const gained=Math.min(RULES.tempoMax-game.tempo,tempo);
  game.tempo+=gained;
  if(game.reactionVersion)for(const f of game.fans)if(f.hp>0&&f.intent==='rhythm'&&!f.reactionUsed){f.reactionTempo=Math.min(3,f.reactionTempo+gained);if(game.reactionVersion>=2&&f.reactionTempo>=3)triggerReaction(game,f,queue);}
  if(d.boost)game.boost+=Math.max(0,d.boost-cardFatigue(game,card));
  if(d.relayBoost){game.relayBoosts??=[];game.relayBoosts.push({actorId:card.actorId,power:Math.max(0,d.relayBoost-cardFatigue(game,card))});}
  for(const f of targets.filter(f=>f.hp>0)){if(d.turnStyle)f.turnStyle=currentSong(game).style;if(d.noBoredom)f.noBoredom=true;}
  // Draw before resolving chains: their conquests never award the card's rewards.
  draw(game,(d.draw||0)+(threshold?d.thresholdDraw||0:0)+(directConquests?d.drawOnConquest||0:0));
  const event={id:game.events.length+1,type:'card',turn:game.turn,cardId:id,actorId:card.actorId,name:d.name,hits,tempo:game.tempo,tempoGain:gained,tempoSpent:tempoBefore+gained-game.tempo,boostGain:(d.boost||0)+(d.relayBoost||0),boost:game.boost,...(discardId?{discardId}:{}),...(secondTargetId?{secondTargetId}:{})};
  game.events.push(event);log(game,`${d.name} · ${INSTRUMENTS[card.instrument]}${hits.length?' : '+hits.map(h=>`${game.fans.find(f=>f.id===h.id).name} +${h.gain} conquête`).join(', '):''}.`);
  resolveConquests(game,queue);
  const effects=game.events.slice(eventStart).filter(e=>e!==event);
  for(const f of triggered){log(game,`${f.name} · ${REACTIONS[f.intent].name} déclenché.`);if(f.hp>0&&game.reactionVersion===1)rerollReaction(game,f);}
  const actor=game.actors.find(a=>a.id===card.actorId);actor.needs.energy=Math.max(0,(actor.needs.energy??100)-2);
  checkVictory(game);
  return {ok:true,event,effects};
}
function endTurn(game) {
  if(game.phase!=='play')return {ok:false,message:'Le tour est déjà terminé.'};
  game.actors.forEach(a=>a.needs.energy=Math.max(0,(a.needs.energy??100)-1));
  game.discard.push(...game.hand.splice(0));game.boost=0;game.relayBoosts=[];
  if(game.section===passageTurns(game)){
    const queue=[];
    const hits=game.fans.filter(f=>f.hp>0).map(f=>{const before=f.hp;f.hp=Math.max(0,f.hp-RULES.finale);conquer(game,f,queue);return {id:f.id,before,after:f.hp,gain:before-f.hp,power:RULES.finale};});
    game.events.push({id:game.events.length+1,type:'finale',turn:game.turn,hits});
    log(game,'Finale : 3 puissance sur tout le public.');
    resolveConquests(game,queue);
    game.fans.forEach(fan=>{delete fan.chorusStyle;delete fan.spotlight;delete fan.turnStyle;});
    if(checkVictory(game))return {ok:true};
  }
  game.fans.forEach(fan=>{delete fan.spotlight;});
  if(game.reactionVersion){
    const triggered=new Set();
    // One trigger per spectator in this end-of-turn batch. Chains may satisfy
    // an existing neighbour reaction, but never a freshly rerolled one.
    for(let pass=0;pass<game.fans.length;pass++){
      const queue=[];let changed=false;
      for(const fan of game.fans){
        if(fan.hp===0||triggered.has(fan.id)||fan.reactionUsed)continue;
        const bored=fan.intent==='bored'&&!fan.noBoredom&&fan.hp<fan.max;
        const gain=game.reactionVersion===1&&(fan.intent==='rhythm'&&fan.reactionTempo>=3||fan.intent==='following'&&fan.reactionNeighbor);
        if(!bored&&!gain)continue;
        const before=fan.hp;fan.hp=bored?Math.min(fan.max,fan.hp+(REACTIONS.bored.value||3)):Math.max(0,fan.hp-3);
        triggered.add(fan.id);if(game.reactionVersion>=2)fan.reactionUsed=true;changed=true;
        game.events.push({id:game.events.length+1,type:'reaction',turn:game.turn,fanId:fan.id,name:REACTIONS[fan.intent].name,hits:[{id:fan.id,before,after:fan.hp,gain:before-fan.hp,power:bored?-3:3}]});
        log(game,`${fan.name} · ${REACTIONS[fan.intent].name} : ${bored?'−':'+'}${Math.abs(before-fan.hp)} conquête.`);
        conquer(game,fan,queue);
      }
      resolveConquests(game,queue);if(!changed)break;
    }
    for(const fan of game.fans)if(game.reactionVersion===1&&triggered.has(fan.id)&&fan.hp>0)rerollReaction(game,fan);
  }else {for(const fan of game.fans)if(fan.hp>0&&fan.intent==='bored'&&!fan.noBoredom){fan.hp=Math.min(fan.max,fan.hp+RULES.boredom);log(game,`${fan.name} s’ennuie : −3 conquête.`);}}
  game.fans.forEach(fan=>{delete fan.turnStyle;delete fan.noBoredom;});
  if(checkVictory(game))return {ok:true};
  if(game.usedSongs.length===2&&game.section===passageTurns(game)){game.phase='lost';log(game,'Fin du show. Il reste du public à conquérir.');}
  else if(game.section===passageTurns(game)){game.phase='choose';log(game,'Choisis la chanson du deuxième passage. Son départ retire 2 tempo.');}
  else startTurn(game);
  return {ok:true};
}

function restoreBandLive(input) {
  const fail=()=>{throw Error('Répétition BandLive invalide.');};
  if(!input||![1,2,3,4].includes(input.version)||!['choose','play','won','lost'].includes(input.phase)||!Array.isArray(input.actors)||!Array.isArray(input.songs))fail();
  const game=structuredClone(input);
  if(game.version>=2&&!game.conquestVersion&&!game.reactionVersion&&game.actors.length>6)fail();
  const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
  if(game.actors.some(a=>!a||!object(a.identity)||!object(a.personality)||!object(a.needs)||!Number.isFinite(a.needs.energy)||a.needs.energy<0||a.needs.energy>100||!Number.isFinite(a.skill)||typeof a.genre!=='string'||typeof a.color!=='string'))fail();
  for(const actor of game.actors)if(actor.bandLiveDeck!==undefined)validateDeck(actor.bandLiveDeck);
  // Older rehearsals could have more than six musicians. Keep their snapshots
  // playable without permitting oversized new formations.
  if(game.version>=2&&game.groupId!==null&&(typeof game.groupId!=='string'||!game.groupId))fail();
  if(game.version>=3&&(!Object.hasOwn(game,'audienceRules')||!Object.hasOwn(game,'songOrder')))fail();
  const expected=createGame({people:game.actors,groupId:game.groupId,groupName:game.groupName,songs:game.songs,seed:game.seed,audienceRules:game.audienceRules,songOrder:game.songOrder},game.version===1?24:RULES.maxMembers).cards;
  if(!Number.isInteger(game.seed)||game.seed<0||game.seed>4294967295||!Number.isInteger(game.rng)||game.rng<0||game.rng>4294967295||typeof game.groupName!=='string'||!Number.isInteger(game.played)||game.played<0||game.played>500)fail();
  if(!Number.isInteger(game.turn)||game.turn<0||game.turn>(game.version>=4?12:6)||!Number.isInteger(game.section)||game.section<0||game.section>(game.version>=4?6:3))fail();
  if(!Number.isInteger(game.energy)||game.energy<0||game.energy>5||!Number.isInteger(game.tempo)||game.tempo<0||game.tempo>10||!Number.isInteger(game.boost)||game.boost<0||game.boost>500)fail();
  if(!Array.isArray(game.cards)||JSON.stringify(game.cards)!==JSON.stringify(expected)||!Array.isArray(game.deck)||!Array.isArray(game.hand)||!Array.isArray(game.discard)||game.hand.length>expected.length)fail();
  const all=[...game.deck,...game.hand,...game.discard],ids=new Set(expected.map(c=>c.id));
  if(all.length!==ids.size||new Set(all).size!==all.length||all.some(id=>!ids.has(id)))fail();
  if(!Array.isArray(game.usedSongs)||!game.songOrder&&game.songs.length>1&&new Set(game.usedSongs).size!==game.usedSongs.length||game.usedSongs.some((id,i)=>!game.songs.some(s=>s.id===id)||game.songOrder&&id!==game.songOrder[i])||game.usedSongs.length>2||game.songId!==null&&!game.usedSongs.includes(game.songId))fail();
  const lengths=game.usedSongs.map(id=>game.version>=4?songTurns(game.songs.find(s=>s.id===id)):3);
  if(game.songs.some(s=>(s.turns!==undefined&&![3,4,5,6].includes(s.turns)||s.energyPerTurn!==undefined&&![2,3,4,5].includes(s.energyPerTurn))))fail();
  if(game.turn===0&&(game.phase!=='choose'||game.section!==0||game.usedSongs.length||game.songId!==null))fail();
  if(game.turn>0&&(!lengths.length||game.songId!==game.usedSongs.at(-1)||game.section<1||game.section>lengths.at(-1)||game.turn!==lengths.slice(0,-1).reduce((n,x)=>n+x,0)+game.section))fail();
  if(game.phase==='choose'&&game.turn>0&&(lengths.length!==1||game.section!==lengths[0]))fail();
  if(game.phase==='play'&&(!currentSong(game)||game.turn<1||game.section<1)||game.phase==='lost'&&(game.usedSongs.length!==2||game.section!==lengths.at(-1)))fail();
  if(!Array.isArray(game.fans)||game.fans.length<RULES.minAudience||game.fans.length>RULES.maxAudience||new Set(game.fans.map(f=>f?.id)).size!==game.fans.length||game.fans.some(f=>!f||typeof f.id!=='string'||!f.id||typeof f.name!=='string'||!Number.isInteger(f.max)||f.max<1||f.max>1000||!Number.isInteger(f.hp)||f.hp<0||f.hp>f.max||!(game.reactionVersion?Object.keys(REACTIONS):['bored','solo']).includes(f.intent)||!(game.audienceRules?.styles||game.songs.map(s=>s.style)).includes(f.favorite)||!!f.conquered!==(f.hp===0)))fail();
  if(game.gridColumns!==undefined&&(!Number.isInteger(game.gridColumns)||game.gridColumns<3||game.gridColumns>6||game.gridColumns>game.fans.length))fail();
  for(const f of game.fans){if(f.turnStyle!==undefined&&(game.turn===0||game.phase==='choose'||f.turnStyle!==currentSong(game)?.style)||f.noBoredom!==undefined&&(f.noBoredom!==true||game.turn===0||game.phase==='choose'))fail();}
  if(game.reactionVersion!==undefined&&![1,2].includes(game.reactionVersion))fail();
  if(game.reactionVersion){
    if(!Number.isInteger(game.reactionRng)||game.reactionRng<0||game.reactionRng>4294967295)fail();
    for(const f of game.fans)if(!Array.isArray(f.reactionActors)||f.reactionActors.length>game.actors.length||new Set(f.reactionActors).size!==f.reactionActors.length||f.reactionActors.some(id=>!game.actors.some(a=>a.id===id))||!Number.isInteger(f.reactionTempo)||f.reactionTempo<0||f.reactionTempo>3||typeof f.reactionNeighbor!=='boolean')fail();
  }
  if(game.relayBoosts!==undefined&&(!Array.isArray(game.relayBoosts)||game.relayBoosts.length>500||game.relayBoosts.some(b=>!b||!game.actors.some(a=>a.id===b.actorId)||!Number.isInteger(b.power)||b.power<0||b.power>4)))fail();
  if(game.initialFanHp!==undefined&&(!Array.isArray(game.initialFanHp)||game.initialFanHp.length!==game.fans.length||game.initialFanHp.some((hp,i)=>!Number.isInteger(hp)||hp<1||hp>game.fans[i].max)))fail();
  if(game.freeSetlist!==undefined&&(game.freeSetlist!==true||game.songOrder!==null||game.version<3))fail();
  if(game.conquestVersion!==undefined&&![1,2].includes(game.conquestVersion))fail();
  for(const fan of game.fans){
    if(game.conquestVersion){
      if(!Object.hasOwn(CONQUEST_EFFECTS,fan.effect)||fan.spotlight!==undefined&&fan.spotlight!==true&&!(game.conquestVersion>=2&&[1,2,3].includes(fan.spotlight))||fan.chorusStyle!==undefined&&(game.turn===0||fan.chorusStyle!==currentSong(game)?.style))fail();
      if((game.phase==='choose'||game.turn===0)&&(fan.spotlight!==undefined||fan.chorusStyle!==undefined))fail();
    }else if(fan.effect!==undefined||fan.spotlight!==undefined||fan.chorusStyle!==undefined)fail();
  }
  if(game.reactionVersion>=2&&game.fans.some(f=>typeof f.reactionUsed!=='boolean'))fail();
  if(game.conquestVersion>=2&&game.fans.some(f=>!['shock','spotlight','chorus'].includes(f.effect)||!Number.isInteger(f.effectValue)||f.effectValue<1||f.effectValue>(f.effect==='chorus'?2:f.effect==='spotlight'?3:5)))fail();
  if((game.phase==='won')!==game.fans.every(f=>f.hp===0)||!Array.isArray(game.logs)||game.logs.length>1000||game.logs.some(line=>typeof line!=='string')||!Array.isArray(game.events)||game.events.length>500)fail();
  return game;
}


function resolveCoopRound(game,finalSongs,activeIds) {
  if(game.phase!=='play')return {ok:false,message:'Le tour est déjà terminé.'};
  game.actors.filter(a=>activeIds.includes(a.id)).forEach(a=>a.needs.energy=Math.max(0,(a.needs.energy??100)-1));
  game.boost=0;game.relayBoosts=[];
  for(const song of finalSongs){game.songId=song.id;
    const queue=[];
    const hits=game.fans.filter(f=>f.hp>0).map(f=>{const before=f.hp;f.hp=Math.max(0,f.hp-RULES.finale);conquer(game,f,queue);return {id:f.id,before,after:f.hp,gain:before-f.hp,power:RULES.finale};});
    game.events.push({id:game.events.length+1,type:'finale',turn:game.turn,hits});
    log(game,'Finale : 3 puissance sur tout le public.');
    resolveConquests(game,queue);
    game.fans.forEach(fan=>{delete fan.chorusStyle;delete fan.spotlight;delete fan.turnStyle;});
    if(checkVictory(game))return {ok:true};
  }
  game.fans.forEach(fan=>{delete fan.spotlight;});
  if(game.reactionVersion){
    const triggered=new Set();
    // One trigger per spectator in this end-of-turn batch. Chains may satisfy
    // an existing neighbour reaction, but never a freshly rerolled one.
    for(let pass=0;pass<game.fans.length;pass++){
      const queue=[];let changed=false;
      for(const fan of game.fans){
        if(fan.hp===0||triggered.has(fan.id)||fan.reactionUsed)continue;
        const bored=fan.intent==='bored'&&!fan.noBoredom&&fan.hp<fan.max;
        const gain=game.reactionVersion===1&&(fan.intent==='rhythm'&&fan.reactionTempo>=3||fan.intent==='following'&&fan.reactionNeighbor);
        if(!bored&&!gain)continue;
        const before=fan.hp;fan.hp=bored?Math.min(fan.max,fan.hp+(REACTIONS.bored.value||3)):Math.max(0,fan.hp-3);
        triggered.add(fan.id);if(game.reactionVersion>=2)fan.reactionUsed=true;changed=true;
        game.events.push({id:game.events.length+1,type:'reaction',turn:game.turn,fanId:fan.id,name:REACTIONS[fan.intent].name,hits:[{id:fan.id,before,after:fan.hp,gain:before-fan.hp,power:bored?-3:3}]});
        log(game,`${fan.name} · ${REACTIONS[fan.intent].name} : ${bored?'−':'+'}${Math.abs(before-fan.hp)} conquête.`);
        conquer(game,fan,queue);
      }
      resolveConquests(game,queue);if(!changed)break;
    }
    for(const fan of game.fans)if(game.reactionVersion===1&&triggered.has(fan.id)&&fan.hp>0)rerollReaction(game,fan);
  }else {for(const fan of game.fans)if(fan.hp>0&&fan.intent==='bored'&&!fan.noBoredom){fan.hp=Math.min(fan.max,fan.hp+RULES.boredom);log(game,`${fan.name} s’ennuie : −3 conquête.`);}}
  game.fans.forEach(fan=>{delete fan.turnStyle;delete fan.noBoredom;});
  if(checkVictory(game))return {ok:true};
  return {ok:true};
}
function drawCoopHand(game){game.energy=currentSong(game).energyPerTurn??RULES.energy;game.boost=0;game.relayBoosts=[];draw(game,RULES.hand);}
function resetCoopReactions(game){if(game.reactionVersion)game.fans.forEach(f=>{if(game.reactionVersion>=2&&f.reactionUsed&&f.hp>0)rerollReaction(game,f);clearReactionProgress(f);if(game.reactionVersion>=2)f.reactionUsed=false;});}

return {RULES,STYLES,CONQUEST_EFFECTS,conquestLabel,conquestDescription,audienceColumns,favoriteStyle,conquestTargets,cardDefinition,cardById,createBandLive,passageTurns,totalTurns,sectionName,currentSong,availableSongs,chooseSong,canPlay,cardTargets,powerAgainst,previewCard,playCard,endTurn,restoreBandLive,resolveCoopRound,drawCoopHand,resetCoopReactions,INSTRUMENTS,SPECIALS,NOTE};})();
modules["bandlive-auto"]=(()=>{
const {songTurns}=modules["song-rules"];
const {availableSongs,chooseSong,canPlay,cardById,cardDefinition,previewCard,playCard,endTurn}=modules["bandlive"];

// Duration first, then the share of the venue audience with a matching style.
function rankShowSongs(songs,styles=[]){
  const affinity=s=>styles.filter(style=>style===s.style).length;
  return songs.map((song,index)=>({song,index})).sort((a,b)=>songTurns(b.song)-songTurns(a.song)||affinity(b.song)-affinity(a.song)||a.index-b.index).map(x=>x.song);
}
function shortlistShowSongs(songs,styles=[]){return songs.length>6?rankShowSongs(songs,styles).slice(0,6):songs;}

// Use the real resolver, including two-target cards, row effects and conquest
// chains. Deterministic greedy play; it does not guarantee a successful show.
function chooseAutomaticMove(game){
  let best=null;const alive=game.fans.filter(f=>f.hp>0);
  for(const id of game.hand){
    if(!canPlay(game,id))continue;
    const d=cardDefinition(cardById(game,id));
    for(const target of d.target==='single'?alive:[null]){
      for(const second of d.twoTargets?alive.filter(f=>f!==target):[null]){
        for(const discardId of d.discard?game.hand.filter(x=>x!==id):[null]){
          const options={...(second?{secondTargetId:second.id}:{}),...(discardId?{discardId}:{})};
          const result=previewCard(game,id,target?.id,options);if(!result.ok)continue;
          const next=result.game;
          const power=game.fans.reduce((n,f,i)=>n+f.hp-next.fans[i].hp+(f.hp>0&&next.fans[i].hp===0?5:0),0);
          const support=Math.max(0,next.tempo-game.tempo)*1.6+Math.max(0,next.boost-game.boost)*1.4+(d.relayBoost||0)+Math.max(0,next.hand.length-game.hand.length+1)*2+(d.noBoredom?2:0)+(d.turnStyle?2:0);
          const score=(power+support)/(d.cost+.65);
          if(score>0&&(!best||score>best.score))best={id,targetId:target?.id,options,score};
        }
      }
    }
  }
  return best;
}
function simulateBandLive(game,onStep=()=>{}){
  let guard=0;
  while(!['won','lost'].includes(game.phase)){
    if(++guard>500)throw Error('La simulation a dépassé sa limite d’actions.');
    if(game.phase==='choose'){
      const songs=rankShowSongs(availableSongs(game),game.fans.filter(f=>f.hp>0).map(f=>f.favorite));
      if(!songs.length)throw Error('Aucune chanson disponible.');
      chooseSong(game,songs[0].id);
    }else{
      const move=chooseAutomaticMove(game);
      if(move)playCard(game,move.id,move.targetId,move.options);else endTurn(game);
    }
    onStep();
  }
  return game;
}


return {rankShowSongs,shortlistShowSongs,chooseAutomaticMove,simulateBandLive};})();
root.MaisonBandLive={...modules['bandlive'],...modules['bandlive-auto'],...modules['bandlive-reactions']};
})(globalThis);

const core=(()=>{
'use strict';
// Commands are synchronous and resolved against one canonical server-owned room.
const R=()=>globalThis,copy=x=>structuredClone(x);
const fail=message=>{throw Object.assign(new Error(message),{status:409});};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function random(seed){let n=seed>>>0;return()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);}
function band(name,trio,seed,seat){
 const {MaisonSim:S,MaisonMusic:M,MaisonCasting:C}=R(),rng=random(seed);
 const s=S.create(3,C.draft(trio,rng));s.music.songs=[];s.music.pending=[];s.music.moments=[];s.calendar={focus:{until:Number.MAX_SAFE_INTEGER}};
 const song=M.newSong(s,[s.people[0].id],s.people[0].style,rng,{progress:100});
 Object.assign(song,{adopted:true,preparation:30,quality:22,arrangementRoll:.5});M.updatePerformance(song);
 M.newSong(s,[s.people[1].id],s.people[1].style,rng,{progress:45});
 s.people.forEach(p=>{p.energy=90;p.room='salon';p.action='rest';p.remaining=1;delete p.projectId;});
 return {name,seat,state:s,plan:null,ready:false,selectedSong:null,rewardClaimed:false};
}
function create(name,trio,seed){return {version:1,week:7,checkpoint:0,nextShow:8,phase:'lobby',epoch:0,revision:0,seed,players:[band(name,trio,seed,0),null],concert:null,history:[],log:['Deux maisons, une scène. Préparez votre concert de voisinage.']};}
function join(room,name,trio){if(room.players[1])fail('Les deux maisons sont déjà occupées.');room.players[1]=band(name,trio,room.seed^0x1367abcd,1);room.phase='house';room.epoch++;}
function prepared(player){return player.state.music.songs.filter(R().MaisonMusic.ready);}
function plan(room,seat,action,songId){
 if(room.phase!=='house')fail('La préparation est terminée.');const p=room.players[seat];if(p.ready)fail('Annule ton état prêt avant de changer ton programme.');
 if(!['practice','compose','trial','rest'].includes(action))fail('Activité inconnue.');
 const x=R().MaisonMusic.song(p.state,songId);
 if(action!=='rest'&&(!x||x.archived))fail('Choisis une chanson disponible.');
 if(action==='practice'&&(!x.adopted||R().MaisonMusic.ready(x)))fail('Choisis une chanson adoptée à préparer.');
 if(action==='compose'&&x.progress>=100)fail('Cette composition est déjà terminée.');
 if(action==='trial'&&(x.adopted||x.progress<80))fail('La chanson doit être écrite à 80 % avant son essai.');
 p.plan={action,songId:action==='rest'?null:songId};
 p.state.people.forEach(q=>{q.room=action==='practice'||action==='trial'?'garage':action==='compose'?'studio':'salon';q.action=action==='compose'?'compose':action==='rest'?'rest':'practice';});
}
function applyPlan(room,p){
 const {MaisonMusic:M}=R(),s=p.state,a=p.plan,x=M.song(s,a.songId),rng=random(room.seed+room.epoch*131+p.seat);
 if(a.action==='practice'||a.action==='trial'){
  if(s.people.filter(q=>q.energy>=20).length<2)fail(p.name+' a besoin de repos avant de répéter.');
  if(!M.sessionFromIntent(s,x.id,s.people.map(q=>q.id)))fail('Cette séance ne peut pas commencer.');
  s.tick=s.music.session.ends;M.step(s,()=>0);
 }else if(a.action==='compose'){
  for(const id of x.authors){const q=s.people.find(q=>q.id===id);q.projectId=x.id;q.action='compose';for(let i=0;i<3&&x.progress<100;i++)M.finish(s,q,rng);q.energy=clamp(q.energy-12,0,100);}
 }else s.people.forEach(q=>q.energy=clamp(q.energy+25,0,100));
 p.ready=false;p.plan=null;
}
function advanceHouse(room){
 room.players.forEach(p=>applyPlan(room,p));room.checkpoint++;room.epoch++;
 if(room.checkpoint===3){room.checkpoint=0;room.week++;room.players.forEach(p=>p.state.people.forEach(q=>q.energy=clamp(q.energy+30,0,100)));
  if(room.week>=room.nextShow&&room.players.every(p=>prepared(p).length)){room.phase='setlist';room.players.forEach(p=>{p.selectedSong=null;p.rewardClaimed=false;});room.log.push('Les deux groupes sont prêts : choisissez une chanson chacun.');}
  else if(room.week>=room.nextShow)room.log.push('Le concert attend : chaque groupe doit avoir une chanson prête.');
 }
}
const contextKeys=['hand','deck','discard','rng','energy','boost','relayBoosts','songId','section'];
function loadContext(c,seat){const x=c.contexts[seat];for(const k of contextKeys)c.game[k]=copy(x[k]);c.game.phase=c.phase==='won'||c.phase==='lost'?c.phase:'play';return c.game;}
function saveContext(c,seat){for(const k of contextKeys)c.contexts[seat][k]=copy(c.game[k]);}
function startConcert(room){
 const B=R().MaisonBandLive,M=R().MaisonMusic,people=[],songs=[];
 for(const p of room.players){const chosen=prepared(p).find(x=>x.id===p.selectedSong);if(!chosen)fail('Une chanson prête est requise dans chaque maison.');songs.push({...copy(chosen),id:p.seat+':'+chosen.id,style:chosen.genre});for(const q of p.state.people)people.push({id:p.seat+':'+q.id,name:q.name,instrument:M.cards.instrumentKey(q),genre:q.style,color:q.color,identity:q.identity||{},needs:{energy:q.energy},bandLiveDeck:q.deck.map(id=>id==='note'?'note':id.split('-').at(-1))});}
 const g=B.createBandLive({people,songs,seed:room.seed+room.week,groupId:'maison',groupName:room.players.map(p=>p.name).join(' + '),audienceSize:12,audienceRules:{styles:[...new Set(songs.map(s=>s.style))],resistancePercent:95},freeSetlist:true});
 g.turn=1;g.phase='play';g.usedSongs=songs.map(s=>s.id);g.cooperative=true;
 const c=room.concert={game:g,phase:'play',round:1,done:[false,false],aim:[null,null],contexts:songs.map((song,i)=>({hand:[],deck:g.deck.filter(id=>id.startsWith(i+':')),discard:[],rng:(room.seed+i+1)>>>0,energy:0,boost:0,relayBoosts:[],songId:song.id,section:1,finished:false}))};
 B.resetCoopReactions(g);for(let i=0;i<2;i++){loadContext(c,i);B.drawCoopHand(g);saveContext(c,i);}room.phase='concert';room.epoch++;
}
function settle(room){const c=room.concert;if(c.game.phase==='won')c.phase='won';if(!['won','lost'].includes(c.phase))return;room.phase='result';room.epoch++;
 for(const p of room.players){for(const q of p.state.people)q.energy=c.game.actors.find(a=>a.id===p.seat+':'+q.id).needs.energy;p.ready=false;}
 room.history.push({week:room.week,outcome:c.phase});room.history=room.history.slice(-30);room.log.push(c.phase==='won'?'Victoire commune ! Une carte pour chaque groupe.':'Le public résiste. Préparez ensemble la prochaine tentative.');
}
function nextRound(room){
 const c=room.concert,B=R().MaisonBandLive,active=c.contexts.flatMap((x,i)=>x.finished?[]:c.game.actors.filter(a=>a.id.startsWith(i+':')).map(a=>a.id));
 const finalSongs=c.contexts.filter(x=>!x.finished&&x.section>=c.game.songs.find(s=>s.id===x.songId).turns).map(x=>c.game.songs.find(s=>s.id===x.songId));
 c.contexts.forEach(x=>{x.discard.push(...x.hand);x.hand=[];x.boost=0;x.relayBoosts=[];});
 c.game.phase='play';B.resolveCoopRound(c.game,finalSongs,active);if(c.game.phase==='won'){c.phase='won';settle(room);return;}
 c.contexts.forEach(x=>{if(finalSongs.some(s=>s.id===x.songId))x.finished=true;});
 if(c.contexts.every(x=>x.finished)){c.phase='lost';settle(room);return;}
 c.round++;c.game.turn=c.round;B.resetCoopReactions(c.game);c.aim=[null,null];
 for(let i=0;i<2;i++){const x=c.contexts[i];c.done[i]=x.finished;if(!x.finished){x.section++;loadContext(c,i);B.drawCoopHand(c.game);saveContext(c,i);}}
 room.epoch++;
}
function command(room,seat,input){
 const p=room.players[seat];if(!p)fail('Maison inconnue.');const a=input.action;
 if(a==='plan'){plan(room,seat,input.activity,input.songId);}
 else if(a==='ready'){
  if(room.phase!=='house')fail('Ce rendez-vous est terminé.');if(!p.plan)fail('Choisis une activité avant de te déclarer prêt.');p.ready=!!input.ready;if(room.players.every(q=>q?.ready))advanceHouse(room);
 }else if(a==='song'){
  if(room.phase!=='setlist')fail('La sélection est terminée.');if(!prepared(p).some(s=>s.id===input.songId))fail('Choisis une chanson prête.');p.selectedSong=input.songId;if(room.players.every(q=>q.selectedSong))startConcert(room);
 }else if(a==='card'||a==='end'||a==='aim'){
  if(room.phase!=='concert'||room.concert.phase!=='play')fail('Ce concert est terminé.');const c=room.concert;
  if(c.done[seat])fail('Ton groupe attend le prochain tour.');
  if(a==='aim'){if(input.targetId&&!c.game.fans.some(f=>f.id===input.targetId&&f.hp>0))fail('Cible indisponible.');c.aim[seat]=input.targetId||null;}
  else if(a==='end'){c.done[seat]=true;c.aim[seat]=null;if(c.done.every(Boolean))nextRound(room);}
  else{const g=loadContext(c,seat);if(!g.hand.includes(input.cardId))fail('Cette carte ne fait pas partie de ta main.');const result=R().MaisonBandLive.playCard(g,input.cardId,input.targetId,{secondTargetId:input.secondTargetId,discardId:input.discardId});if(!result.ok)fail(result.message);saveContext(c,seat);c.aim[seat]=null;settle(room);}
 }else if(a==='reward'){
  if(room.phase!=='result'||room.concert.phase!=='won'||p.rewardClaimed)fail('Récompense indisponible.');const q=p.state.people.find(q=>q.id===input.personId);if(!q)fail('Choisis un musicien de ton groupe.');const choices=R().MaisonMusic.cards.choices(q);if(!choices.includes(input.cardId))fail('Choisis une de ses cartes spéciales.');q.deck.push(input.cardId);p.rewardClaimed=true;
 }else if(a==='return'){
  if(room.phase!=='result')fail('Le concert n’est pas terminé.');if(room.concert.phase==='won'&&!p.rewardClaimed)fail('Choisis ta récompense avant de rentrer.');p.ready=true;
  if(room.players.every(q=>q.ready)){room.phase='house';room.week++;room.nextShow=room.week+3;room.checkpoint=0;room.epoch++;room.concert=null;room.players.forEach(q=>{q.ready=false;q.plan=null;q.selectedSong=null;q.state.people.forEach(m=>{m.room='salon';m.action='rest';});});}
 }else fail('Commande inconnue.');
 room.log=room.log.slice(-12);return room;
}
function view(room,seat){
 const v=copy(room);v.seat=seat;
 if(v.concert){const c=v.concert,g=loadContext(c,seat);g.cooperative=true;g.coopSeat=seat;g.phase=c.phase;g.section=c.contexts[seat].section;g.usedSongs=[g.songId];if(c.done[seat]){g.hand=[];g.energy=0;}c.projection=g;delete c.contexts;delete c.game;}
 return v;
}
return {create,join,command,view,prepared};

})();
export default core;

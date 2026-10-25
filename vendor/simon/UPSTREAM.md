# BandLive original de Simon

Source : https://github.com/jutrasimon/garage-vivant
Version **0.8.15**, branche `main`, commit
`016df228552f1ae841e037090d6c0088f7f29a21`, du 14 octobre 2026.
Cette version correspond à la capture fournie par l’utilisateur. Le fork
JFeffe utilisé en v19 était antérieur et n’était pas cette refonte.

Les sources mjs/css sont conservées ici sans modification. Elles comprennent
la scène WebGL, les personnages et instruments, les mains sous les musiciens,
le drag/drop souris/tactile, les aperçus, les réactions, les animations, les
sons et l’éditeur de disposition.

`node scripts/build-bandlive.cjs` copie le module dans `dist/show-module`, puis
applique les adaptations déclarées dans ce script. Toutes les feuilles de
style, le renderer et les interactions restent ceux de Simon. La maison
utilise un bundle synchrone du même moteur adapté.

Raccordements : decks variables (2 Notes + 1 spéciale au départ), 3–6 tours et
2–5 énergie de carte selon la chanson, fatigue personnelle et malus déjà
définis dans la maison, sauvegardes compatibles et libellés de retour.
`show-adapter.js` projette les musiciens, chansons prêtes et préférences du
public dans le format attendu. Le quartier de Garage vivant n’est pas simulé.

Les nouvelles règles du public et la grille sont celles de la version 0.8.15.
Un show commencé conserve cartes, conquête, RNG, chansons, réactions et énergie.
Les résultats sont appliqués une seule fois; l’énergie reste identique pendant
le trajet et le rangement à la maison.

Prototype 41 : le build ajoute une résolution commune des fins de tour, des mains indépendantes et un callback réseau optionnel dans la vue. Les commandes coop passent par `server/coop-core.cjs`; `coop-entry.mjs` relie le même renderer au serveur. Les feuilles de style, les interactions et le renderer amont restent intacts.

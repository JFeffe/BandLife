# BandLive, intégré à La Maison des Accords

Source : https://github.com/JFeffe/garage-vivant
Branche la plus récente vérifiée le 18 octobre 2026 : `experiment/public-en-pack`.
Commit : `b31dcf82fdaca589ea86cd5990c2ddc0f7b33233` (14 octobre 2026).

Les six fichiers mjs de ce dossier sont conservés tels que récupérés. Le moteur,
les cartes, les réactions persistantes, la physique de foule et la simulation
automatique viennent de BandLive. L’interface est adaptée à la maison.

`node scripts/build-bandlive.cjs` produit le bundle autonome `dist/bandlive.js`.
Les adaptations explicites dans ce script remplacent les règles de l’autre jeu :

- 2 Notes + 1 spéciale au départ, paquets persistants de tailles variables ;
- chansons de 3 à 6 tours, 2 à 5 points d’énergie de carte par tour ;
- fatigue : −2 énergie personnelle par carte jouée pour son auteur, −1 pour
  chaque musicien à chaque fin de tour ; aucune énergie personnelle n’est
  utilisée pour payer les cartes ;
- malus de puissance selon l’énergie actuelle : 61–100 : 0, 31–60 : −2,
  0–30 : −3. Les bonus de puissance de soutien sont aussi concernés. Les
  réactions du public et les effets de conquête gardent leurs règles ;
- validation des sauvegardes adaptée aux nouvelles bornes et à la pioche bonus.

L’adaptateur `shows.js` relie les identités, chansons prêtes, decks et tendances
du public. Deux passages maximum, comme BandLive ; une seule chanson prête
peut être rejouée au deuxième passage. Victoire anticipée si toute la foule est
conquise. Sans chanson prête, la sortie est annulée sans résultat fictif.
Le jeu et sa pioche sont sauvegardés après chaque action. L’énergie finale est
copiée vers les résidents, puis conservée pendant le trajet et le rangement.

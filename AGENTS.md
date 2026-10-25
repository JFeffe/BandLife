# BandLife — consignes de maintenance

## Projet
- Dépôt public autorisé par le propriétaire : https://github.com/JFeffe/BandLife, branche `main`.
- Jeu existant : https://la-maison-des-accords.docile-hero-2836.chatgpt.site.
- Conserver l’identité `.openai/hosting.json`, les sauvegardes et les permissions du site.
- Le propriétaire demande de mettre à jour GitHub et le lien jouable à chaque version livrée. Cette autorisation de publication du projet persiste; ne pas la redemander sans changement matériel de portée.

## Avant de modifier
- Lire les dernières sources et l’état distant de GitHub et du site; ne pas écraser les contributions distantes.
- Dans un checkout Sites, conserver sa liaison de publication. GitHub est une destination distincte : ne pas remplacer silencieusement la configuration du dépôt Sites.
- Préserver le style visuel de la maison et le module de concert original de Simon.
- `vendor/` conserve les sources amont. Les adaptations du concert passent par `scripts/build-bandlive.cjs` et les adaptateurs maison; consulter les fichiers `UPSTREAM.md`.

## Vérification et livraison
1. Modifier le jeu dans `dist/` et les tests pertinents. Exécuter `npm test` (Node.js 22+; aucune dépendance à installer).
2. Si l’intégration BandLive change, reconstruire avec `npm run build:bandlive` et vérifier les sorties.
3. Mettre à jour le README, la version et les notes utiles. Garder le lien jouable visible en tête.
4. Publier les sources, ressources, tests, documentation et fichiers générés nécessaires dans `JFeffe/BandLife`, sans forcer ni écraser un historique distant inattendu.
5. Publier le même contenu jouable sur le site existant via le workflow Sites disponible. Un push GitHub ne remplace pas cette étape.
6. Vérifier le commit distant et le succès du déploiement, puis fournir les deux liens au propriétaire. Signaler clairement toute publication partielle ou bloquée.

Ne pas publier de secrets, jetons, fichiers `.env`, sauvegardes personnelles, archives temporaires ou données de session. Ne pas ajouter une licence aux sources d’autrui sans vérifier leurs conditions.

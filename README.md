# Band Life

**[▶ Jouer à la version actuelle](https://la-maison-des-accords.docile-hero-2836.chatgpt.site)** · **Prototype 40** · [Dépôt GitHub](https://github.com/JFeffe/BandLife)

Simulation d’un groupe de musiciens : vie dans la maison, composition, répétitions et concerts BandLive. Le parcours comporte quatre actes, de la scène locale à la reconnaissance mondiale.

Le lien ci-dessus correspond au jeu publié sur Sites et conserve ses permissions actuelles : il peut demander une connexion ChatGPT autorisée. Le dépôt GitHub est public; le jeu hébergé n’est pas automatiquement rendu public par ce dépôt. Les sauvegardes restent dans le navigateur, sans serveur de données.

## Lancer le projet

Le jeu est autonome et déjà prêt dans `dist/`. Avec Python 3 :

```sh
git clone https://github.com/JFeffe/BandLife.git
cd BandLife
python -m http.server 8000 --directory dist
```

Ouvrir `http://localhost:8000`. Utiliser un serveur HTTP plutôt qu’ouvrir `index.html` directement, notamment pour les modules du concert.

## Tests et reconstruction

Node.js 22 ou plus récent, sans installation de dépendances :

```sh
npm test
npm run build:bandlive
```

`npm test` exécute les 37 suites de régression et renvoie une erreur si l’une échoue. GitHub Actions les exécute aussi sur chaque push et pull request. `npm run test:campaign` produit le détail JSON de neuf campagnes chronologiques reproductibles. `build:bandlive` reconstruit uniquement le module de concert à partir des sources conservées dans `vendor/simon/`.

## Contenu et mises à jour

- `dist/` : jeu complet prêt à héberger, images SVG et module BandLive intégré.
- `vendor/` : sources originales des modules intégrés et leurs références `UPSTREAM.md`.
- `scripts/` : reconstruction et lanceur de tests.
- `tests/` : tests des mécaniques, sauvegardes, interface et concerts.
- `.openai/hosting.json` : identité du site existant et dossier à publier.
- `AGENTS.md` : consignes de maintenance et publication.

À chaque version livrée, mettre à jour ce dépôt et publier le jeu sur le même lien. Les deux publications sont distinctes : un push GitHub seul ne déploie pas le site ChatGPT. Vérifier chacune avant d’annoncer la mise à jour. Ne jamais inclure d’identifiants, de sauvegardes personnelles ou de fichiers temporaires. Les références et attributions des modules externes restent dans `vendor/`.

## Prototype 40 — scrapper sans perdre sa composition

Dans « Le répertoire → À essayer », chaque chanson non adoptée propose **Scrapper**, même avant son premier vote. Après confirmation, elle quitte toutes les listes collectives, mais reste consultable dans la fiche Musique de chacun de ses auteurs, avec la mention « Scrappée · conservée ici ». Elle ne peut plus être proposée, répétée ou retravaillée. Ses crédits et ses caractéristiques restent conservés dans les sauvegardes.

Les invitations, intentions et reprises suspendues associées sont annulées. Une chanson en cours d’essai ne peut pas être scrappée avant la fin de la séance. Le wiki et les confirmations expliquent ce comportement, qui remplace l’ancienne suppression définitive.

Validation : 37 suites de régression; essai réel dans le navigateur du retrait depuis « À essayer », puis de la consultation dans la fiche de l’auteur. Aucun changement au module de concert.

## Prototype 39 — Band Life, concerts et répétitions

Le jeu s’appelle **Band Life** dans l’accueil, l’en-tête, les concerts et les titres de page. L’identité du site, son adresse et les clés de sauvegarde restent stables pour conserver les parties existantes.

- Deux spectateurs supplémentaires par destination : publics de 6 à 10 personnes. Résistance individuelle inchangée; les contrats déjà choisis conservent leur public.
- Finale d’acte quatre semaines après le deuxième show : S8, S16, S20 pour l’acte local. Une nouvelle tentative de finale laisse aussi quatre semaines. Les finales futures des sauvegardes sont reportées, sans déplacer un concert en cours.
- Répétition avec tout le groupe : +35 / +28 / +23 / +20 points de préparation pour une chanson de 3 / 4 / 5 / 6 tours (environ 40 % de mieux). Les absences réduisent toujours le gain; la préparation plafonne à 100 %.
- Reconstruction BandLive compatible avec les fins de ligne Windows; sources amont et rendu original préservés.

Validation : 37 suites de régression, dont neuf campagnes complètes gagnées par les trois parcours de récompenses, les migrations de finales, les concerts en cours et les gains réels de répétition. Le contrôle avec chansons débutantes échoue toujours dans les actes avancés.

## Prototype 38 — les semaines à venir, sans espace perdu

La barre retire son bloc « La maison », l’indicateur d’état et le nombre de musiciens. Les horaires occupent une zone plus étroite. La frise commence toujours par la semaine actuelle, en bleu avec le repère « ici », puis affiche les semaines à venir : douze sur écran large, huit ou six selon la place disponible. Les concerts sont signalés en doré; les étapes déjà passées ne restent plus dans le résumé. Le nom de la scène ouvre toujours les destinations.

Validation : 37 suites, dont le décalage de la frise, l’absence de semaines passées, les reports de finale et les changements d’acte. Vérification dans le navigateur aux largeurs étroite et de référence : barre de 62 px, sans débordement ni erreur console. Les sauvegardes et la simulation restent compatibles.

## Prototype 37 — les dates dans la barre de la maison

La barre de la maison affiche la scène actuelle, le compte à rebours du concert et les trois dates clés de l’acte, avec l’étape en cours mise en évidence. Le bouton « Parcours » a été retiré : le nom de la scène ouvre les destinations, récompenses et rencontres. Les trois mois de calendrier et les étapes en colonne quittent l’onglet de droite, qui conserve la préparation du concert et l’historique.

La barre reste sur deux lignes : 63 px de haut pour une largeur de 1 007 px, et 69 px dans la disposition étroite testée, sans débordement. Les dates suivent les changements d’acte et les nouvelles tentatives de finale. Validation : 37 suites, navigation réelle depuis la barre, reprise d’une sauvegarde et vérification visuelle aux deux largeurs; aucune erreur console.

## Prototype 36 — progression et vie du groupe

Les publics deviennent plus résistants après l’acte local : 80–115 au national, 120–155 à l’international, puis 165–200 au mondial. La soirée des auteurs demande désormais deux chansons prêtes au départ : conquérir le public dès le premier morceau ne fait plus perdre le contrat. Les destinations déjà acceptées et les concerts sauvegardés gardent leurs conditions. Les récompenses et le module de concert original sont conservés.

Un panneau **Vie du groupe** propose trois types de moments facultatifs selon les personnalités et les liens réels : une tension entre musiciens, une idée partagée sur une composition, ou un besoin de calme. Chaque réponse annonce ses effets sur le moral, la relation ou l’écriture. L’idée partagée apporte jusqu’à 8 points lors du prochain travail de l’auteur sur cette chanson, avant l’expiration annoncée. Au maximum un événement toutes les trois semaines, à partir de S2; aucun malus si on le laisse passer, aucune fenêtre ni pause automatique. Les souvenirs et les choix en attente persistent dans la sauvegarde. Ces moments n’ajoutent pas d’occasions d’activité ni de cartes.

Validation : 37 suites, dont neuf campagnes complètes (trois graines × trois parcours privilégiant cartes, écriture ou rencontres), exécutées par un joueur automatisé avec les décisions et le moteur réels. Ces neuf groupes préparés gagnent les douze concerts. Les concerts mondiaux prennent en moyenne 6,81 tours contre 4,22 avant ajustement; 18 sur 27 utilisent deux morceaux, contre 2 auparavant. Le contrôle qui conserve les capacités de chansons débutantes après l’acte local perd, tandis que le groupe qui progresse gagne. Ce petit échantillon déterministe mesure la progression de ces stratégies, pas le taux de victoire des joueurs. Les tests couvrent aussi les événements dans une campagne complète, leurs sauvegardes, délais et effets appliqués une seule fois.

Vérification dans le navigateur : progression jusqu’à S3, apparition naturelle d’une idée partagée, aperçu des effets, réponse, puis rechargement et consultation du souvenir sauvegardé. Aucune erreur console observée.

## Prototype 35 — préparer le prochain concert

Le panneau **Parcours** compare maintenant le répertoire prêt au minimum nécessaire : chansons terminées, adoptées et préparées à 100 %, et diversité de styles lorsque le contrat l’exige. Il indique les chansons à avancer en priorité, leur prochaine étape et les invitations déjà en attente; un clic ouvre leur fiche habituelle. Les exigences à accomplir sur scène restent distinctes : conquérir le public et, selon le contrat, jouer plusieurs chansons différentes. Les goûts annoncés du public sont des conseils, pas des conditions supplémentaires. Le jour du show, le panneau affiche le répertoire réellement emporté après le départ.

Validation : 34 suites de régression. Une partie automatisée chronologique, avec les décisions et le moteur du jeu, atteint la finale locale sans injecter de chansons prêtes ni forcer les votes ou les résultats : S8, 2 chansons prêtes; S16 et S17, 5 chansons prêtes; trois concerts gagnés par le simulateur BandLive. Le scénario inclut les nuits, le rechargement d’une sauvegarde et les récompenses au retour. Il couvre une trajectoire déterministe, sans conclure à l’équilibrage général de la campagne. Vérification complémentaire dans le navigateur : création d’un trio, choix de destination, composition, reprise de sauvegarde, panneau Parcours et ouverture des fiches de chansons. Les concerts de cette partie automatisée ne sont pas joués manuellement à l’écran.

## Historique technique — prototype 34

Independent browser-local simulation. Static assets live in `dist/`. No server data or external runtime dependencies. The existing private Site identity lives in `.openai/hosting.json`.

## Prototype 34 — four-act journey and announced reward events

The campaign now runs through local, national, international and worldwide scenes, each with two branching shows and a final one week later. Ordinary shows remain eight weeks apart. Each route declares the public, resistance, repertoire requirements and reward before commitment. A cleared act restores one chance (cap three) and opens the next; only the worldwide finale wins the campaign. Three unmitigated losses still end a run. Act transitions resume after the free return evening and night. Existing local-win saves continue into Act 2 with their band, songs and decks preserved.

New show rewards include masterclasses (replace-only card choices), writing residencies (+1 level on a future composition), further musician encounters and additional cards. Distinct deferred rewards are keyed per show. Future acts can be previewed but cannot be selected early. The kitchen counter is in the upper-right corner; the table and activity positions leave it accessible.

## Prototype 33 — taller house, patio and finale timing

The house uses the full panel height; a translucent single-row roster overlays the foreground and selection uses blue. The kitchen and dining area are one room. Musicians can rest and socialize on the accessible patio; group reservations still take priority. Toilets are entered through the living room, which now opens to the side corridor. Legacy dining locations migrate to the kitchen. The first final show is one week after stage two (S8 → S16 → S17); ordinary shows keep eight weeks; failed-final retries occur the following week. Existing unplayed finales migrate without scheduling a show in the past.

## Prototype 32 — sketch layout, original visual style

The native pastel SVG house now follows the supplied plan: six private bedrooms in two columns on the left, central living room, narrow studio and garage on the right, kitchen/dining above, and a backyard pool/terrace. Existing textures, palette, furniture vocabulary and character sprites are preserved. Door-aware corridor routes connect every room. Visitors use the front entrance; the band loads instruments through the garage door into the relocated driveway. Camera, lighting and song overlay follow the new geometry. No simulation rules changed.

## Prototype 31 — house camera and compact request feedback

Mouse wheel zooms around the cursor (55–250%); left-button drag pans the entire scene, including musicians and instruments. A fenced lot, trees, street and partial neighbours appear when zooming out. Camera controls provide zoom buttons and a home reset. Dragging suppresses accidental character clicks while ordinary double-clicks remain available. Camera movement is visual only and works while paused.

The right tab is now “Parcour”, with a smaller upcoming-show card. Waiting requests use a compact sheet: status, song, wait reason, cancel and resume. Repeated running/waiting requests show a short nonblocking notice without creating an order, rerolling consent or reopening a modal. Active sessions started by weekly intentions are also detected.

Validation: regression suites pass, including cursor-centred zoom and bounds, active-session/waiting-order deduplication and compact feedback handlers. Browser QA exercised the wheel, left drag, reset and neighbourhood view with no app console errors.

## Prototype 30 — a busier house and midnight recruitment

Six individual bedrooms replace shared rooms, with migration of existing assignments. The kitchen now adjoins a dining room used for parties, rest and conversation; a separate WC has a once-per-week morning routine, including show mornings. Party guests arrive, circulate and leave as cosmetic actors, without deck/stat effects. Private bedroom access requires an invitation through the musician profile.

The recruitment visitor walks through common rooms, follows active rehearsals with their instrument, and receives a decision at midnight before the night choice. Joining assigns a private room, guarantees practice acceptance and subtracts 20 preparation points from each adopted song. Declining animates departure. Ready songs therefore return to the adopted filter. Original show instruments travel with every musician, including drums, and disappear from the garage while away.

The calendar emphasizes the next venue, weeks/simulated days remaining, reward and three route steps; three months use compact week cells. Musician activity cards stay on one row. Repertoire songs show author portraits. Composition completion uses the existing dismissible five-second notification instead of a modal.

Validation: all regression suites plus the living-house suite pass. Coverage includes six bedroom assignments, WC visits on ordinary/show weeks, midnight decision precedence, repertoire preparation loss, guaranteed practice, party-only visuals and explicit bedroom invitations. Browser QA checks the house layout, author portraits, compact roster and calendar.

## Prototype 29 — preannounced routes and first roguelike arc

The first playable arc, “Sortir du garage”, has two branching stages and a major show. Destinations announce their audience, success condition and reward before selection. Concerts remain eight weeks apart. The real BandLive integration receives destination crowd size/styles/resistance; Simon’s vendor module is unchanged. The authors’ show requires two distinct songs as well as a conquered audience. Rewards are committed once on return: an existing special card choice, +1 quality level on the next new composition, or a recruitment encounter.

Recruitment is now earned through the route. A separate visitor spends one simulation week in the house; shared-room contacts and musical affinities determine the group’s strict-majority vote and candidate consent. Only an approved encounter can add the musician, their instrument and deck. Full groups receive a card alternative. Three failed contracts end the run; the major show may be retried while chances remain. The finale stops simulation and shows a run summary. National/international/world arcs are clearly marked as future content.

Save migration preserves prior concert history and an already active show. Route choices, rewards, trials and outcomes persist. Browser QA verifies new-game route selection, the compact route dialog, the calendar reward preview and continued simulation. Engine regressions cover actual concert handoff, objectives, reward idempotency, recruitment consent, composition boosts, victory/loss and migration.

## Prototype 28 — card-only occasions and visible reward cues

Occasions now retain only deck rewards. Trial, rehearsal, composition and other routine action occasions are no longer generated; legacy non-card occasions are removed when loading or reconciling the state. Repertoire actions, existing activity orders, important moments and adoption card rewards remain intact. Stale non-card occasion handlers cannot execute a removed action.

The compact right-rail reward banner uses a gold treatment, a small animated card fan, a clear musician/instrument identity and a prominent card-choice button. A finite glow/shine marks arrival, while the banner retains its contrast until resolved. Stable DOM across simulation ticks prevents repeated entrance animations. Multiple rewards show their count. System and in-game reduced-motion settings disable animations. The banner does not pause the simulation or automatically open a dialog.

Validation: all 26 suites pass, including reward-only migration, stale action rejection, preserved decks/rewards/moments, real card-choice handlers and stable banner DOM across repeated renders. Browser visual verification remains unavailable.

## Prototype 27 — suspend work at 17:00 and resume at 10:00

At 17:00 the simulation snapshots ongoing solo/group work and removes active sessions, reservations and participant locks before offering the evening choice. Saved work retains the song, participants and remaining time. It resumes at 10:00 ahead of the newly accepted direction, without another participation roll. Suspended sessions appear as priority continuations in group and musician queues, not as invitations awaiting consent. Evening work still follows the evening choice; unfinished promised work at bedtime also waits for 10:00.

The 08:00–10:00 interval is reserved for rest and coffee/socializing. Musical proposals wait until 10:00, while morning coffee remains available. Travel back to work is accounted for before session completion. Shows take precedence, preserving suspended work for the next working morning. An overnight-completed composition is removed from its continuation queue. Paused work survives save/load and accelerated nights.

Validation: all 26 regression suites pass; dedicated boundary tests cover 17:00 suspension without ghost progress/votes, retained participants, morning routines, continuation priority, solo work, save/load, night skip, coffee and show postponement. Existing activity fixtures now exercise work during working hours. Browser visual verification remains unavailable.

## Prototype 26 — compact musician activity stacks

Musician cards retain a compact fixed height with energy/morale, current activity and progress, the next pending invitation with an additional-count badge, and the accepted weekly direction pinned below. Clicking opens an upward overlay with the full ordered queue, songs, participants and waiting reasons. Outside click, Escape and the close button dismiss it without pausing; the full profile remains accessible. Current activity and an active matching direction are not duplicated.

Extending the party is available only after choosing the house party at 17:00 in the same week. Returning from a show now leads to quiet recovery and the usual midnight choice, without the former monthly-direction interruption. Legacy saves with that interruption migrate to the normal flow, including late returns after midnight.

Validation: all 25 regression suites pass, including personal activity projection, queue ordering, overlay interactions, party eligibility, legacy saves and post-show midnight handling. Browser visual verification remains unavailable.

## Prototype 25 — author support and reorganized house controls

Authors always accept invitations to try their own unadopted song, including the weekly direction route and low energy/morale. At the adoption vote every author still in the group votes yes. Other members retain their independent responses and a trial still requires a strict majority before it starts. Rehearsal of an already adopted song keeps its previous acceptance rules.

The weekly rhythm, upcoming choices, time markers and history/night buttons now share the house toolbar. The right rail starts higher, with natural-size scrollable repertoire, musician and calendar content rather than paginated or auto-shrunk content. Song scroll position survives simulation updates. The activity journal opens from the header next to Moments; the bottom drawer and footer are removed. Save failures remain visible in a header alert.

Validation: 23 regression suites pass, including exhausted coauthors, majority gates, nonauthor refusals, adoption voting, weekly trial invitations, scroll retention and access to all right-panel records. Markup checks confirm toolbar/header placement and footer removal. Browser visual verification remains unavailable.

## Prototype 24 — stable panel sizing and dismissible notices

Panel fitting now runs in a coalesced microtask before the same browser paint as a simulation render. Previously, rebuilding a panel removed its fitted zoom and a second animation-frame callback restored it only on the next frame, causing repeated full-size flashes. The existing viewport limits and list navigation remain in use.

Transparent influence and action-start notices have a keyboard-accessible close button. Closing acknowledges no extra event, never changes simulation speed/pause, clears the five-second timer and advances any queued notice. Stale timer callbacks cannot dismiss a newer notice.

Validation covers repeated panel replacement and before-paint sizing across five viewport sizes, plus manual dismissal, timer cancellation, queued notices and stale callbacks. Browser visual verification is unavailable in this environment.

## Prototype 23 — chronological queue and single-screen house

The pending rail and proposal history now use the resolver's oldest-first order. Same-tick submissions retain insertion order, new actions appear last, and calendar invitations are merged by creation time. Unavailable invitations still wait for their existing eligibility conditions; no new global blocking rule is introduced.

Deferred session starts use the same translucent five-second notice as influences, including song identity and actual participants. They acknowledge once without pausing. Legacy saved start notices are also classified as transient. Refusals, adoption and other consequential decisions retain their modal feedback.

The house occupies a bounded viewport with compact controls, a house-first layout, six visible resident summaries and an overlay journal. Long repertoire, musician, activity and journal lists use previous/next controls with range counts instead of scrollbars. Panel contents fit their available height; the calendar retains the current and next two months. Small viewports scale the house canvas to fit, so text is smaller there. The home screen and existing single-page dialogs also fit their available height.

Validation: all 22 suites pass. New checks cover queue insertion/same-tick order, cancellation/save restoration, five-second nonblocking starts, legacy notices, all paginated records and functional detail buttons, plus fitting arithmetic at five viewport sizes. Static asset references and JavaScript syntax pass. These are functional/DOM and arithmetic checks; browser visual verification remains unavailable.

## Prototype 22 — genre-aware names and single-resolution occasions

`names.js` supplies 2,361 distinct song titles across eight genres: 40 hand-written titles per genre plus grammar-safe thematic combinations. A saved used-title registry prevents reuse across songs, archives and subsequently scrapped compositions; exhausted banks use unique chapter extensions. Name comparisons ignore accents, case and punctuation. Existing unique names are retained; duplicate names in loaded saves are repaired without changing song or musician IDs.

Musician creation now draws from 186 feminine and 198 masculine first names. Drafts and rerolls exclude the other musicians' names. Recruitment candidates are generated once per save, have distinct names and retain their displayed identity when recruited. Surname combinations provide a fallback if a first-name bank is exhausted.

Repertoire actions and occasion cards now reconcile through the same decision state. A trial or rehearsal consumes its matching occasion even when it is deferred or declined, and calendar/automatic sessions also remove obsolete occasions. Adoption card rewards are preserved. Canonical intent keys prevent cross-menu duplicates and repeated clicks in the same simulation tick; subsequent legitimate retries remain possible. Song action buttons and occasion handlers reject stale repeated activations.

Important moments deduplicate by lifecycle identity, preserving distinct first/second rejections. Replacing a sheet commits its previous acknowledgement. Manually opening a deferred action's result acknowledges the corresponding automatic notice when dismissed, preventing a second popup for the same result. Migration collapses legacy duplicate moments without reopening ones already read.

Validation: 21 suites pass, including 2,640 title draws across exhausted banks, 430 name draws, all trios, repeated rerolls, recruitment/save identity, scrapped-title retention, direct/event/calendar trial routes, waiting/refused/blocked outcomes, actual UI double-click and stale-handler regressions, delayed native dialog close events and manually reviewed action results. Browser visual verification remains unavailable.

## Prototype 21 — uninterrupted influences and collective activity tracking

Influence milestones appear in a translucent notice above the house for five real seconds. They never open an automatic modal or pause simulation. Concurrent influences queue sequentially, and acknowledged notices remain in the group history. New-game state resets the transient notice queue.

Objectives now sit at the top of the left rail. A second panel displays current collective activities with actual participants, instrument icons, song identity when relevant, elapsed progress and remaining game time. Separate compact cards show queued group invitations and their blocking reasons. Solo work and insufficient trial invitations are excluded. Session/focus start times persist, including suspended sessions across the night; co-composition requires actual coauthors working on the same project.

Shows return at 22:00, unpack until 22:30, then musicians rest in their rooms or socialize quietly until the midnight choice. The end-of-show energy stays unchanged through travel and unpacking. Pending work waits for the next morning and autonomous revisions/rehearsals are suppressed during recovery. Existing shows still at the venue migrate to the new return time; already returning or unpacking saves are preserved.

Party participants gain morale according to their traits, within existing routine caps, and retain the existing energy cost. Consenting solitary musicians now gain a small morale benefit too. Preparing a song to 100% no longer offers a card. Unclaimed legacy preparation rewards are removed when loading, while adoption rewards and acquired cards remain intact.

Validation covers five-second sequential notices without pause/replay, collective timers and waiting invitations, actual participation, save compatibility, reward lifecycle, party effects, show return at 22:00 and quiet recovery. All regression suites and syntax checks pass before publication. Browser visual verification remains unavailable.

## Prototype 20 — Simon's complete BandLive module

The concert now embeds the original Garage vivant v0.8.15 interface from `jutrasimon/garage-vivant`, main commit `016df228552f1ae841e037090d6c0088f7f29a21`. The previous custom concert interface has been removed. Original scene rendering, instruments, musician hands, targeting, drag-and-drop, animations, audience rules and concert report are retained. Source files are pinned unchanged in `vendor/simon/`; `UPSTREAM.md` records the integration boundary. An isolated same-origin frame prevents house styles from changing the concert scene.

`show-adapter.js` projects the current house group, ready songs and show into the original module's expected data shape. Both interfaces share the same saved live game. The house retains ownership of musicians, variable decks, song capacities and personal energy; the original module owns concert interaction and rendering. Closing preserves the show for resumption. Returning after the original report starts the house's existing travel/unpacking sequence with each musician's remaining energy.

`scripts/build-bandlive.cjs` copies the original modules and applies explicit integration patches: starter/variable decks, song turns and energy, personal fatigue, house return/save labels and resource-meter capacities. It builds the same adapted core for house persistence and the original ES-module UI. Upstream XP and world progression are not introduced into the house simulation.

Validation includes the original module's actual card/target/turn/report callbacks, host open/pause/resume/return, shared saves and energy, byte-for-byte preservation of unpatched upstream modules/CSS, and local module-import resolution. The full regression suite and syntax checks run before publication. Browser visual verification remains unavailable; DOM adapter tests do not validate WebGL rendering or layout.

## Prototype 19 — live concert state and invitation majority

Song trials require a strict majority to accept the invitation before the trial starts. Insufficient attendance does not reject the song or unlock reworking, and it may be proposed again later. A real concert engine replaced the placeholder outing, with shared musician decks, ready songs, dynamic personal energy, saved progress and energy retained on returning home. This version's custom concert UI and older experimental source have been superseded by prototype 20 above.

## Prototype 18 — compact calendar, one show every two months

Four week cells again sit side by side in each month. The current month and two following months remain visible in the calendar panel. Likely audience styles (one to three genre icons/names) and the unknown-public indicator are placed below the relevant month and in the upcoming-show summary, outside the narrow week cells.

Shows now occupy the final week of months 2, 4, 6… (weeks 8, 16, 24…). Departure/return behavior and stable audience forecasts are unchanged. Schedule version 4 migrates v17 saves, preserving active outings, completed history and audience seeds; no overdue morning show is injected. An unfinished first-show goal is postponed when the player has not yet attended a show. Post-show directions run until the next scheduled show, normally eight weeks. Help and wiki reflect the new cadence.

Validation: 17 suites pass, including three shows over 24 weeks with three or six residents, migration from fortnightly scheduling and preservation of a week-2 show already in progress. JavaScript syntax checks pass. Browser visual verification remains unavailable.

## Prototype 17 — clear card costs and fortnightly shows

Reward cards display integer energy costs only (0, 1 or 2), with accessible cost labels and tooltips. The previous lightning character was ambiguous at small sizes. Musician identity and song identity/capacities share a compact header. “Voir mon paquet” expands all current card types and copy counts in the same sheet; toggling preserves the selected reward, add/replace mode and slot. The existing fit-to-viewport behavior and continue button remain.

Shows now occur in even-numbered weeks (2, 4, 6…), with four weeks per month. Identifiers, completed-history lookup and calendar entries are keyed by week, so two shows in the same month do not collide. The existing 08/09/10/11/18/18:30 preparation/travel/return flow is retained. Returning sets a direction for the following two weeks. Tutorial deadlines, help and wiki follow the new schedule. Legacy saves preserve completed and active shows; a newly scheduled show is not injected retrospectively into an afternoon or night.

Each save has a persisted audience seed. Calendar hints deterministically expose one to three likely genre preferences per show, genre icons and an explicit unknown-public indicator. They stay stable across render and reload. Departure creates eight audience preference records biased toward the advertised styles, with room for other tastes, and saves them with the outing. This is preparatory audience data; spectator card gameplay remains unimplemented.

Validation: 17 suites pass. Tests cover 12 outings over 24 weeks for both three and six residents, two unique outings in month 1, active/history migration, stable 1–3 genre forecasts, retained reward selection while inspecting the current deck, integer costs and compact subject markup. Browser visual verification is unavailable.

## Prototype 16 — BandLive cards and concert preparation

Card names, costs, descriptions and structured effects were verified through GitHub in `JFeffe/garage-vivant`, branch `BandLive_fix_12-10-26`, commit `1a87519f7714ad97e9c77e272d9b308ab9585450`, file `dist/bandlive-cards.mjs`. The same 25 definitions are also present on `experiment/public-en-pack` (its additional proximity rendering is outside this scope). `tests/fixtures/bandlive-cards.json` pins the verified source for parity checks. `dist/cards.js` adapts this catalogue to the house's French instrument identifiers.

New and recruited musicians start with two Notes (1 energy, 6 power on one spectator) and one instrument special. Default legacy five-card decks migrate once to the new three-card start. Customized legacy decks keep their size: Notes remain Notes, old support/accent cards map to the instrument special, old reward cards map to its two variants. The original list is retained as `legacyDeck`. New-format decks, including earned cards and duplicates, persist unchanged.

A successful adoption queues a separate addition-only reward for every author, with three instrument specials to choose from. Rewards are tracked on the song, survive closing/reloading and are not evicted by a full event queue. The adoption notice links directly to each author's pending reward. Other existing preparation rewards permit either adding a card or replacing an exact slot. Three choices, transaction mode and replacement selector share a single dialog. Confirmation is guarded against duplicate activation; declining is explicit. Deck displays group identical copies and show the actual total and card energy costs.

At departure, the complete combined deck is snapshotted with a unique card instance, its musician and personal energy. There is no equal-size requirement or trimming. The concert sheet shows the total, each contribution and penalty. Card evaluation is exposed by `MaisonShows.cardEffects`: displayed personal energy 61–100 has no penalty, 31–60 subtracts 2 from each power effect, 0–30 subtracts 3. Power floors at zero. Apply the penalty once to a card's final direct power per target, and to its deferred power boosts; do not reduce tempo, draws, card costs or other effects. Song energy per turn remains the payment resource. Home energy behavior is unchanged.

The concert remains the existing animated outing placeholder: this version prepares and previews the deck and effect values, without adding spectator combat or automatically applying concert results. The discussed moral cards are not introduced in this change.

Validation: 17 Node suites pass, including all 25 source definitions, eight starting instruments, fatigue boundaries, a six-author adoption with a full queue, add/replace/skip transactions, duplicate protection, save migration, shared-deck snapshots and production single-sheet reward UI handlers. JavaScript syntax and local asset references are checked. Browser rendering remains unverified because the supported browser skill is unavailable.

## Prototype 11 — compact dialogs and a visible night

The bass icon is a local blue, mirrored SVG. All eight instruments have local vector illustrations, used as equipment in the garage and held by playing musicians where appropriate. Garage stations follow an irregular layout for up to six residents; no visible instrument/name captions remain in the room. Character nameplates contain only name and instrument icon. Stations and movement destinations share the same layout, including after recruitment.

Dialogs use smaller spacing, portraits and type, with viewport-aware pages for long content instead of scrolling. Existing handlers and forms remain in the DOM across pages. Nested sheets and lists are split as needed; previous/next controls remain visible. No browser visual QA is available in this environment; this is covered by structure, pagination partitioning and controller tests, not a rendered-browser inspection.

The All repertoire filter and direct Jam/Coffee buttons have been removed. Repertoire starts on Writing; social activities remain available through events and musician proposals.

After the midnight choice, the choice dialog closes and residents visibly walk to their bedrooms (volunteers may still stay awake). Only once walking finishes does the real night simulation accelerate at 32×. It stops at 08:00 for the night summary; residents then leave from their actual night rooms. Wake origins are saved so reloading a wake summary preserves the departure animation. Day speed is unchanged.

Rework proposals first ask each author. If all decline, no revision or second chance is consumed; the player can ask again or a free author may later choose to resume autonomously, announced in a popup. Partial acceptance starts work for consenting authors. Rejected song cards and sheets have a Scrap action with a concise in-game confirmation: it removes the song from all group/personal composition lists, cancels pending song invitations, clears project references, and prevents future trials. Already earned composer experience is retained. Un-scrapped second rejections retain the previously established archive behavior.

Validation: `tests/refinement.cjs` checks refusal/consent, autonomous retry, exact-once rework, definitive scrap and persistence, night pacing, pagination partitioning and instrument/markup invariants. Existing controller checks cover midnight-to-wake behavior and the real scrap button flow. All SVGs, local asset references and script syntax are checked before publication.

## Current gameplay — prototype 10

The home screen offers Continue, New game, Settings and Wiki. New games select one of four instrument trios, then the player's musician, with profile/appearance rerolls. Only final confirmation replaces the browser save. Player identity is persisted; all musicians remain autonomous. Sound and reduced-motion preferences are local. Existing saves and current Site access are preserved.

A composition can be proposed at 80%. A real nine-tick trial ends in a strict majority vote of all residents. First rejection unlocks one rework: write the second version from 80% to 100%, then gain 0–2 quality levels, capped at 7, with a newly sampled style-weighted arrangement. Its mandatory popup compares levels, turns and energy with signed deltas, including zero. Second rejection archives the song in its authors' personal composition records; rights and credits remain. Adoption locks quality and capacities, including during the final 20% of writing. Rehearsal changes preparation only. A ready song has writing and preparation at 100%.

Quality has seven levels, with `turns + energy/turn = level + 4`, turns 3–6, energy 2–5. A new beginner song is level 1 (80%) or 2 (20%). Composer milestones count unique completed songs with actual writing contributions: 0–2 credits Débutant (1–2), 3–6 En progrès (2–3), 7–11 Confirmé (3–5), 12+ Accompli (4–6, 5% chance of 7). Coauthor credit requires actual contribution; reworking the same song never grants another credit. The most experienced contributing author profile sets the initial potential of a new co-composition. Existing song qualities are retained.

The garage displays one instrument station per resident, with six positions. Character labels include instruments and real session song titles. Collective trials, rehearsals, jams, conversations and parties reserve their rooms for participants; outsiders move to their assigned bedrooms. Conflicting invitations wait until the shared activity ends. Night sleep and show routines remain separate.

The nonmodal objective panel follows 80% writing, a real proposal, conditional rework after rejection, then a song ready before the first show. Completion opens the panel, crosses out the completed task and plays a short optional synthesized chime. It never pauses the simulation. Missing the first-show deadline does not deadlock the guide. Show gameplay and multiplayer remain future work.

New modules: `casting.js`, `start-ui.js`, `activities.js`, `garage-ui.js`, `goals.js`, `guidance-ui.js`, `evolution.css`. Run all `tests/*.cjs` with Node. `evolution.cjs` covers lifecycle, capacity redistribution, experience, cast/save consistency, six slots, room exclusivity and tutorial. `start-ui.cjs` executes production home/wizard/settings/wiki, garage and objective handlers through a small DOM adapter. Dialog checks verify signed rework tables. Browser visual QA is unavailable in this environment; handler and structural checks are not a rendered-browser inspection.

## Files and checks

- `dist/sim.js`: residents, movement destinations, interactions and basic activity selection.
- `dist/music.js`: compositions, adoption, rehearsal sessions, stories, decks and save migration.
- `dist/app.js`: house UI, clock, persistence and dialogs.
- `dist/music-ui.js`: songbook, votes, event cards and deck inspection.
- `tests/simulation.cjs`: 2000-tick simulations at three and six residents, recruitment, activity and persistence invariants.
- `tests/music.cjs`: song thresholds, voting, refusal/revision, mastery/duration, coauthorship, genres, card transactions and migration.

Run `node tests/simulation.cjs` and `node tests/music.cjs`. JS syntax and HTML asset/ID checks were also completed. Browser visual QA was unavailable in this environment; the layout has responsive rules but has not been visually verified in-browser for this revision.

## Prototype 03 — visible decisions and real waiting orders

Important milestones (adoption or rejection with a vote snapshot, completed compositions, stage readiness, new members, lasting musical influences and spontaneous duos) create persistent notifications. The UI automatically pauses and opens one notification at a time, preserving an existing choice dialog. Acknowledged notifications remain available from “Moments du groupe”. High-speed simulation stops immediately after the tick that opens a notification.

Every player choice now produces a structured outcome: waiting, running, applied, refused, blocked or cancelled. Acceptance/refusal responses are recorded per musician. Waiting is a real persisted queue: it waits for the garage/session, invitation cooldown, earlier requested activity or unfinished coauthors’ projects. It sends invitations exactly once once eligible. Refusals terminate the order; they are never retried silently. Pending orders can be cancelled, duplicate active orders are deduplicated, and automated rehearsals respect ongoing player-requested activities. Reopening a saved game retains both orders and unread moments without replaying old milestones.

Additional modules: `dist/decisions.js` (orders/outcomes/moments) and `dist/decisions-ui.js` (follow-up panel, popups and history).

Additional checks: `node tests/decisions.cjs` covers deferred execution, no early random draws, exact-once behavior, cancellation, vote snapshots, coauthor reservations, explicit refusal and save migration. `node tests/dialog-flow.cjs` executes the production dialog controller and feedback UI with a small DOM adapter to check modal priority and pause/resume; this is not visual browser verification.

## Prototype 04 — new game and visible identities

A header “Nouvelle partie” button opens the three/six musician selector, with a cancel option that preserves the current session. Starting resets the saved game, playback speed and song filter. Existing saves remain compatible.

`dist/identity.js` supplies shared illustrated portraits, song panels with record icons, and individual decision/vote rows. Popups highlight the relevant song title and people. Each refusal displays its reason alongside that musician; the latest declined invitation also appears briefly in the roster and stays on the profile until a subsequent accepted invitation replaces it. No acceptance probabilities changed.

The dialog regression checks cover cancellation, both new-game sizes and identity/reason markup; decision checks cover refusal persistence and replacement by an acceptance. Browser visual QA remains unavailable in this environment.

## Prototype 05 — condensed weeks, intentions and sleep

Each 8:00–08:00 cycle represents one week. New games begin at 08:00; older saves preserve their clock offset, songs, characters and orders. Calendar state and unresolved choices persist with the existing local save.

- At 10:00, one event offers composition, practice (a real song trial/rehearsal where available) or discussion until 17:00.
- At 17:00, the evening options encourage a party, a jam or rest until midnight.
- At midnight, a concrete summary precedes choices for tomorrow, sleep, overnight composition or an afterparty. Sleep begins only after this choice.
- Each musician responds independently. Accepted intentions bias subsequent activities; promised activities and existing sessions finish first. Refusals retain their explanation. Practice intentions only launch collective sessions with at least two available volunteers; ordinary practice without a repertoire song does not fabricate preparation progress.
- Sleeping musicians recover energy from midnight until 08:00. Accepted night activities consume energy and actually compose or develop relationships. Exhausted musicians go to bed. “Passer à 8 h” executes the same simulation steps as observing the night. The wake-up summary reports actual sleep, energy and song/relationship changes.
- Ongoing rehearsals and promised activities pause for sleep and resume after waking. Ordinary night invitations wait for daytime availability. Closing an unresolved calendar event leaves time paused; its button and the play control reopen it.

`dist/weeks.js` owns the calendar, persistent intentions, night simulation and summaries. `dist/weeks-ui.js` supplies the timeline, event cards, recent choices and wake-up panels. Random routine event cards are replaced by the fixed schedule; song and deck opportunities remain available, and important milestones still have popups. Shows remain outside this prototype.

Checks: `node tests/weeks.cjs` verifies clock boundaries, blocking/exact-once choices, reloads, old-save migration, refusal/availability, actual rehearsal/adoption, night-skip equivalence, sleep/energy, overnight work, next-day intentions and 12-week simulations at 3 and 6 residents. `tests/dialog-flow.cjs` also checks the production calendar dialog handlers through choosing, closing, reopening, skipping and waking. These are functional checks with a minimal DOM adapter, not visual browser QA; the supported browser tool is unavailable here.

## Prototype 06 — house-first dashboard and personal rooms

The desktop screen now prioritizes the enlarged house alongside a compact, scrollable song repertoire. Clock/playback live in the header; resident cards show current activity, energy and recent refusal reasons. The week schedule is compact, while the journal and detailed order tracking live in an expandable activity drawer. Small screens stack the same panels without fixed desktop sizing.

The repertoire exposes writing, trial, rework, adopted, active-session and ready states, with separate writing/preparation meters, duration and direct contextual actions. Detailed musician sheets open by double-clicking a map character or resident card, by Enter on those controls, or using the selected musician’s explicit sheet button. Portrait, Music and Relationships tabs contain existing gameplay information and preserve activity suggestions.

`dist/house.js` defines the expanded 1200×800 floor plan and central-corridor routes. Four bedrooms are assigned in joining order: the first four residents have their own room, the fifth shares room 1 and the sixth shares room 2. Assignments remain stable as residents arrive. Legacy single-bedroom locations and saved night-resume destinations migrate to the assigned room. Sleeping and solitary/nighttime rest use these rooms; shared-room occupants have distinct map positions.

`dist/dashboard.css` adds translucent textured surfaces, compact layouts, hover/press feedback and reduced-motion support. `dist/interactions.js` provides brief pointer press ripples. All art remains local SVG/CSS; no external assets or fonts are required.

Validation: existing simulation/music/decisions/week checks pass. `tests/house.cjs` covers occupancy at 3/4/5/6 musicians, recruitment, migration, assigned sleep/rest and map paths. `tests/dialog-flow.cjs` also exercises musician double activation, personal tabs, duo suggestions and compact song status markup. Static asset/unique-ID checks pass. Browser layout inspection is unavailable in this environment; these checks do not claim visual verification.


## Prototype 07 — sidebar tabs, upcoming months and shows

The right column has keyboard-accessible Repertoire, Musicians and Upcoming weeks tabs. The musician list links to the existing detailed sheets. The schedule pins the current week and shows the current month plus the next two, with four weeks per numbered month. Two free months alternate with a third month ending in a show (weeks 12, 24, etc.). Existing saves keep their progress and only schedule future shows.

During the last week of a show month, players can leave early once their current choice or rehearsal finishes. This explicitly closes that week. Otherwise the group leaves automatically at midnight, before the normal bedtime event; an unfinished late rehearsal is cancelled with an explanation. Every resident walks through the house exit toward the instrument van. The concert currently uses a simple automatic resolution with up to two ready songs, chosen by quality, and the group's energy; it is not the future card-based show engine. With no ready song, the group improvises a short appearance. Energy decreases by 12, and a prepared set gives each pair a small relationship gain; song preparation and duration are unchanged.

After the concert summary, residents visibly walk back into the house. Only once everyone is home does the next-month direction appear. Musicians independently accept or refuse a composition, practice or social focus. This modest activity bias lasts four weeks from the next wake-up; daily intentions take precedence. The ordinary midnight sleep/wake loop then resumes. Show phases, results, completed-show history and monthly directions persist without replaying effects after reload. Reduced-motion preference shortens the travel animations.

New modules: `dist/shows.js`, `dist/rail-ui.js`, `dist/tour-ui.js`, `dist/tour.css`.

Validation: all prior regression checks pass. `node tests/shows.cjs` covers month boundaries, migration, both departure modes, interruption, every persisted phase, exact-once results, monthly choices and 24-week simulations at 3 and 6 residents. `node tests/tour-ui.cjs` executes production tabs, keyboard navigation, calendar horizon, departure/show/return handlers, progressive movement routes and a reloaded return through the month-choice popup using a small DOM adapter. Syntax, asset and HTML identity checks pass. Browser visual QA remains unavailable; no in-browser visual inspection is claimed.


## Prototype 08 — a whole show day

The right-column tabs now sit immediately above their content, below the common week/event panels.

The final week of a show month follows a dedicated day: wake and get ready in assigned bedrooms at 08:00, gather for coffee in the kitchen at 09:00, prepare instruments in the garage at 10:00, and leave together at 11:00. The usual 10:00 and 17:00 choices are replaced by this show-day routine. Time advances normally during the preparation stages, with pause/speed controls and character movement; show travel and concert dialogs hold simulation time. Already running promises are explicitly interrupted for the show; queued invitations remain queued. Preparations do not fabricate song progress or duplicate rehearsal effects.

After the existing automatic concert and its summary, the return animation happens at 18:00 and leads everyone into the garage. Instrument storage takes thirty simulated minutes. The next-month direction is then chosen and the group resumes autonomous evening activities. This direction starts at 08:00 the next week and lasts four weeks. The ordinary midnight choices and sleep still occur; returning no longer ends the week or triggers bedtime. Existing in-progress concerts resume without rewinding the saved clock, and already elapsed show days are not replayed on migration.

Validation: all eight functional test scripts and JS syntax/static asset checks pass. Revised show tests cover the 08/09/10/11/18/18:30 stages, wake-up integration, regular midnight bedtime, all saved phases, migration from the old midnight show, and two complete show cycles with 3 and 6 residents. UI-handler tests cover the automatic morning, animated exit/entry, instrument storage, the following-month popup and evening resumption. The supported browser tool remains unavailable; no browser layout inspection was performed. Morale is proposed for discussion only and is not implemented in this version.


## Prototype 09 — morale and song capacities

Musicians now have one persistent morale value, bounded to 1–100 and starting at 60. The five stages are Abattu (1–20), Découragé (21–40), Stable (41–60), Motivé (61–80), and Enthousiaste (81–100). Each resident's bottom card shows energy and morale with numbers. The right-hand musician cards and the personal sheet have direct deck buttons. Detailed sheets show all five morale ranges and the last five changes with their actual reasons; eight changes are stored.

`dist/morale.js` links morale to real activity completion, social interactions, composition milestones, adoption/rejection, readiness and nights. Traits alter outcomes: sociable musicians enjoy parties/conversations, solitary musicians benefit from quiet and dislike parties, sensitive musicians react more to conflict/rejection, creative musicians enjoy composition, and meticulous/ambitious musicians enjoy practice. Routine gains and losses are each capped at 6 per week, with at most two applications of the same routine category; unique song milestones cannot be farmed by revising the same song. Good sleep gently settles morale toward 60, while a short night costs morale. Low morale mildly encourages comforting activities; invitation willingness changes by at most eight percentage points. Future show bonuses/maluses are deliberately left undefined.

`dist/song-quality.js` supplies seven quality levels and stable style-weighted arrangements. Score ranges 0–14, 15–29, 30–44, 45–59, 60–74, 75–89 and 90–100 yield budgets 5–11. A budget is the sum of 3–6 turns and 2–5 energy per turn. All 16 feasible combinations can occur. Punk, Métal and Électro prefer energy; Folk and Jazz prefer duration; Indie, Ska and Pop prefer balanced development from the minimum capacities. A persisted roll selects the arrangement and is not rerolled during rendering, rehearsal or reload. Writing/revision can alter quality and therefore the budget; values remain labelled provisional until writing finishes. Legacy songs receive a deterministic arrangement while keeping progress, preparation, authors, adoption and quality.

Song cards, personal song lists, song-detail dialogs, contextual song identities and show programs expose level, turns and energy per turn. The Adopted filter/count excludes ready songs; the Ready filter remains their dedicated home.

Shows are explicitly a placeholder outing. Preparation, coffee, the 11:00 departure, 18:00 animated return, instrument storage and free evening remain. The placeholder does not fabricate a concert outcome or apply show energy costs, relationship gains or morale effects. Song energy/turn and morale-based show rules are prepared for the eventual playable show, not applied in the house.

Validation: all ten regression scripts pass. `tests/quality.cjs` exhaustively checks score/style/sample combinations, all valid capacity pairs, quality thresholds, statistical style preferences and stable migration. `tests/morale.cjs` checks exact stage boundaries, trait responses, repeat limits, milestones, history/persistence, real composition/vote hooks and observed/skipped night equivalence. Updated show checks cover morale-enabled 24-week cycles and placeholder non-effects. Production UI handler tests verify exclusive adopted/ready filters, capacity displays, per-musician deck buttons, six bottom-row morale/energy readouts and stage/history markup. JavaScript syntax and HTML asset/ARIA checks pass. Browser layout verification remains unavailable in this environment.

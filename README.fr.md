# Pratique au travail

Un petit prototype public de ParalleX Labs Inc. Exercez-vous à faire le point sur un projet ou à rédiger un courriel pour déplacer une réunion. Chaque scénario comprend trois étapes en français et en anglais. Vous pouvez choisir séparément la langue de l’interface et celle de la pratique.

Il s’agit d’une démonstration. Elle ne revendique aucun lien avec un programme gouvernemental, un test, un niveau, un client, un résultat ou une certification. Les noms et les situations sont inventés. Le français utilise le vouvoiement; l’anglais adopte un ton professionnel neutre.

## Utilisation

Ouvrez `index.html` dans un navigateur récent. Aucun serveur, aucune installation, aucune dépendance et aucune compilation ne sont nécessaires. Vous pouvez aussi lancer `python3 -m http.server 8000` depuis ce dossier, puis ouvrir `http://localhost:8000`. Les mêmes fichiers fonctionnent sur GitHub Pages. Pour utiliser le flux de publication fourni, choisissez GitHub Actions comme source de Pages dans les paramètres du dépôt.

## Pratique et rétroaction

Choisissez un scénario et une langue de pratique. Lisez la situation dans l’autre langue et la tâche dans la langue pratiquée. Rédigez une réponse, puis vérifiez-la. Une réponse type s’affiche après la première tentative non vide ou sur demande. Chaque étape comprend des expressions à utiliser, une règle de registre et un conseil.

- Les expressions sont repérées comme des mots ou groupes de mots entiers, sans tenir compte des majuscules ni des accents. Les espaces supplémentaires et les apostrophes courbes sont acceptés. Les différences d’accents sont signalées. Une formulation équivalente peut ne pas être repérée.
- En français, la vérification du registre signale tu, toi, ton, ta et tes. En anglais, elle signale hey, yo, gonna, wanna, dude et lol. Le contexte, y compris les citations, n’est pas interprété.
- À l’étape de la salutation du courriel, la première ligne non vide doit commencer par Bonjour ou Bonsoir en français; Hello, Dear, Good morning ou Good afternoon en anglais.
- À l’étape de la conclusion, les deux dernières lignes non vides sont vérifiées pour repérer Cordialement, Bien à vous, Bonne journée ou Merci en français; Kind regards, Best regards, Regards, Thank you ou Thanks en anglais. Aucune vérification de salutation ou de conclusion ne s’applique à l’étape du milieu.
- Un texte de moins de 8 mots donne lieu à une suggestion de réponse plus complète. Au-delà de 100 mots, une réponse plus courte est suggérée. Ces conseils ne sont pas des règles de rédaction au travail.

Le prototype ne vérifie ni la grammaire, ni le sens, ni l’exactitude des faits. Il ne peut pas déterminer si vous avez réellement proposé deux créneaux ou accompli la tâche. Comparez votre texte avec la réponse type. Plusieurs réponses peuvent convenir. Aucune note et aucun niveau de langue ne sont attribués.

## Confidentialité et progression

Rien ne quitte le navigateur. Il n’y a aucune ressource distante, aucun compte, aucun témoin et aucune mesure d’audience. La correction orthographique est désactivée dans le champ de réponse. Vos textes restent uniquement dans la mémoire de la page. Ils disparaissent au rechargement, à la fermeture ou à l’effacement de la progression.

Seules vos appréciations sont enregistrées dans localStorage, sous une seule clé : `workplace-practice.progress.v1`. La progression est distincte pour chaque scénario et langue de pratique. Elle ne mesure pas l’apprentissage. Les versions locale et hébergée ont des stockages distincts. Le navigateur peut aussi limiter le stockage des fichiers locaux.

L’exportation produit un fichier JSON contenant uniquement la version et les appréciations. Il n’y a pas de fonction d’importation. Le bouton d’effacement supprime la clé et réinitialise la séance. Si le stockage est indisponible, la pratique et l’exportation de la séance restent possibles. Un message indique qu’une copie déjà enregistrée ne peut pas être supprimée tant que le stockage est inaccessible. La page ne supprime aucune autre donnée du navigateur.

## Accessibilité

La page vise les WCAG 2.2 AA : commandes sémantiques, champs étiquetés, focus visible, indications textuelles en plus des couleurs, région de rétroaction annoncée poliment, navigation au clavier, respect de la préférence de mouvement réduit et mise en page adaptée à une largeur de 320 px. Le focus passe au titre de l’étape lors de la navigation. Les langues de l’interface et de la pratique sont indiquées dans le balisage. Cet objectif ne constitue pas une certification. Une révision avant publication devrait inclure des essais avec des technologies d’assistance et une vérification des contrastes.

## Fichiers et vérifications

La logique modifiable se trouve dans les modules ES de `js/`. Les textes bilingues se trouvent dans `i18n/` et `data/scenarios/`. Le fichier `js/content.js` reprend les textes pour les modules. Le fichier `js/offline.js`, inclus dans le dépôt, reprend la même logique et les mêmes textes sans importation ni chargement de données pendant l’utilisation. Il permet l’ouverture directe du fichier, qui restreint autrement les importations de modules. Aucune compilation n’est nécessaire pour utiliser la page.

Après avoir modifié les sources ou les textes, lancez `node scripts/sync-offline.js` pour actualiser les deux copies incluses. Lancez `npm test` avec Node 22. Les tests vérifient la concordance des copies, les expressions et les accents, le registre, les règles du courriel, les limites de longueur, les traductions, les scénarios, les erreurs de stockage et l’absence de communications réseau. Ils utilisent seulement `node:test` et les modules intégrés. Le flux de publication vérifie les tests et la ponctuation avant de publier les fichiers publics de la branche main. Le propriétaire doit vérifier les paramètres du dépôt et le déploiement.

## Contenu et licences

French not yet reviewed by a professional translator.

French not yet reviewed by a professional translator.

Le code est sous licence Apache-2.0; consultez LICENSE. Le texte des scénarios dans `data/scenarios/` et ses copies intégrées sont sous licence Creative Commons Attribution 4.0 International (CC BY 4.0). Pour réutiliser ces textes, mentionnez Amir Daneshpajouh, ParalleX Labs Inc., et indiquez les modifications. Consultez CONTENT_LICENSE.md et CITATION.cff.

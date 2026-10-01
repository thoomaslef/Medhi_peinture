# Medhi Peinture — site vitrine

Site vitrine statique pour une micro-entreprise de peinture et de pose de sol à Caen.
HTML, CSS et JavaScript simples : pas de framework, pas d'étape de compilation, aucune dépendance externe.

## Structure

```
index.html                 Accueil
prestations.html           Peinture intérieure, extérieure, pose de sol + FAQ
realisations.html          Galerie filtrable avec visionneuse
zone-intervention.html     Carte schématique + liste des communes
contact.html               Téléphone cliquable + formulaire de devis
mentions-legales.html      Mentions légales et données personnelles (obligatoire)
404.html                   Page d'erreur (utilisée par GitHub Pages / Netlify)
assets/css/style.css       Toute la mise en forme (couleurs en haut du fichier)
assets/js/main.js          Menu mobile, galerie, formulaire
assets/img/                Logo, images, photos de réalisations
robots.txt, sitemap.xml    Référencement
```

## Voir le site en local

Double-cliquer sur `index.html` suffit. Pour un rendu identique à la mise en ligne :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## À remplacer avant la mise en ligne

Le texte provisoire est volontairement repérable. Avec la fonction « Rechercher / remplacer dans les fichiers »
de votre éditeur (VS Code : `Ctrl+Maj+H`), remplacez dans **tous les fichiers** :

| Chercher | Remplacer par |
| --- | --- |
| `06 00 00 00 00` | le numéro affiché, ex. `06 12 34 56 78` |
| `+33600000000` | le même numéro au format international, ex. `+33612345678` (liens cliquables) |
| `contact@exemple.fr` | l'adresse e-mail réelle |
| `https://www.exemple.fr` | l'adresse du site une fois en ligne (`sitemap.xml`, `robots.txt`, balises de partage) |
| `[000 000 000 00000]` | le numéro SIRET |

Puis cherchez le caractère `[` : chaque texte entre crochets est à compléter ou à vérifier
(années d'expérience, assurance, délais, mentions légales, etc.).

À relire aussi, car ce sont des engagements affichés sur le site :

- « Devis sous 48 h », horaires (lundi–vendredi 8 h – 18 h), rayon de 30 km, « déplacement offert » ;
- la liste des communes dans `zone-intervention.html` ;
- les données structurées pour Google en haut de `index.html` (bloc `application/ld+json`) ;
- la page `mentions-legales.html`, à compléter entièrement (SIRET, assurance, médiateur de la consommation, hébergeur).

## Remplacer les images

Les visuels actuels sont des illustrations provisoires au format SVG.

1. Placer les photos dans `assets/img/realisations/` (format `.jpg` ou `.webp`).
2. Les redimensionner à environ **1600 px de large** et les compresser sous **300 Ko**
   (par exemple avec [squoosh.app](https://squoosh.app)), au format paysage 4:3 de préférence.
3. Dans `realisations.html`, pour chaque photo, modifier :
   - le `href` du lien **et** le `src` de l'image (même fichier) ;
   - le texte `alt` (description de la photo, utile pour Google et l'accessibilité) ;
   - le titre, la commune et `data-category` (`peinture-interieure`, `peinture-exterieure` ou `pose-de-sol`).
4. Pour ajouter une photo, dupliquer un bloc `<li class="gallery__item">…</li>`.
5. Supprimer le paragraphe « Les visuels ci-dessus sont provisoires… » en bas de la galerie.

Autres images : `assets/img/hero.svg` (grande image de l'accueil), `assets/img/portrait.svg` (photo de Medhi,
format carré) et les trois images de la page Prestations. Pensez à mettre à jour le `src` quand l'extension change.

## Activer le formulaire de devis

Un site statique ne peut pas envoyer d'e-mail tout seul. En attendant, le formulaire ouvre la messagerie
du visiteur avec la demande pré-remplie (vers `contact@exemple.fr`).

Pour recevoir les demandes directement par e-mail avec [Formspree](https://formspree.io) (offre gratuite) :

1. Créer un compte, puis un nouveau formulaire : Formspree fournit une adresse du type `https://formspree.io/f/abcdwxyz`.
2. Dans `contact.html`, remplacer `https://formspree.io/f/VOTRE_ID_FORMSPREE` par cette adresse.
3. Envoyer une demande de test et la valider dans l'e-mail de confirmation de Formspree.

Le champ anti-spam invisible (`_gotcha`) et l'objet de l'e-mail (`_subject`) sont déjà en place.
Astuce : un lien vers `contact.html?prestation=pose-de-sol#devis` pré-sélectionne la prestation.

## Mettre en ligne

**GitHub Pages (gratuit)** : dans le dépôt GitHub, *Settings → Pages → Build and deployment*,
choisir *Deploy from a branch*, branche `main`, dossier `/ (root)`. Le site est publié en quelques minutes.
Un nom de domaine personnalisé (ex. `medhi-peinture.fr`) peut être ajouté dans ce même écran.

Le site fonctionne aussi tel quel sur Netlify, OVH, o2switch ou tout hébergement classique :
il suffit d'envoyer les fichiers.

Après la mise en ligne : créer une **fiche Google Business Profile** (indispensable pour apparaître sur Google Maps
quand on cherche « peintre Caen ») et y mettre le lien du site.

## Personnaliser les couleurs

Les couleurs sont définies en haut de `assets/css/style.css` (bloc `:root`) :
`--c-primary` (bleu ardoise) et `--c-accent` (ocre). Modifier ces valeurs met à jour tout le site.

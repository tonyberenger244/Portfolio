# Portfolio — Votre Nom

Portfolio personnel **one-page** conçu en **HTML, CSS et JavaScript natifs** — sans framework,
sans étape de build, sans dépendance npm. Il est prêt à être personnalisé, puis déployé tel quel
sur GitHub Pages, Netlify ou Vercel.

Développeur ciblé : **MEARN Stack** (MongoDB, Express, Angular, React, Node.js) & **mobile**
(Flutter, React Native).

![Aperçu du portfolio](assets/preview.jpg)

---

## 1. Ce que contient le site

| Section | Contenu |
| --- | --- |
| **Hero** | Photo, nom, rôles animés, disponibilité, boutons projet / CV, réseaux |
| **Bandeau** | Technologies qui défilent (marquee) |
| **À propos** | Présentation + 4 compteurs animés |
| **Compétences** | 4 cartes (Frontend, Backend, Mobile, Outils) avec barres de niveau |
| **Projets** | 6 réalisations filtrables (Tous / Web / Mobile) |
| **Parcours** | Frise chronologique d'expérience |
| **Contact** | Coordonnées + formulaire validé en JavaScript |
| **Footer** | Navigation, réseaux, mentions |

### Fonctionnalités

- **Thème clair / sombre** avec mémorisation (`localStorage`) et respect du réglage système.
- **Responsive** du mobile au grand écran, menu plein écran sur mobile.
- **Animations sobres** : apparition au scroll, compteurs, texte dactylographié, survols.
- **Accessibilité** : structure sémantique, lien d'évitement, focus visible, `aria-*`,
  respect de `prefers-reduced-motion`, contrastes travaillés.
- **Zéro dépendance** : aucune librairie, aucun build. Seules les polices sont chargées
  depuis Google Fonts (facultatif, des polices système prennent le relais hors ligne).
- **SEO de base** : titre, description, Open Graph, données structurées `Person`.

---

## 2. Structure du projet

```
portfolio/
├── index.html                 # Toute la structure et le contenu
├── css/
│   └── style.css              # Design, thèmes, responsive, animations
├── js/
│   └── main.js                # Interactions (thème, menu, filtres, formulaire…)
├── assets/
│   ├── photo.svg              # ← votre portrait (à remplacer)
│   ├── favicon.svg            # Icône d'onglet
│   ├── apple-touch-icon.png   # Icône iOS (180 × 180)
│   ├── og-image.png           # Aperçu pour les partages (1200 × 630)
│   ├── preview.jpg            # Capture utilisée dans ce README
│   ├── CV.pdf                 # CV de démonstration (à remplacer)
│   ├── project-novashop.svg
│   ├── project-devboard.svg
│   ├── project-insight.svg
│   ├── project-payflow.svg
│   ├── project-pulse.svg
│   └── project-kwikdelivery.svg
└── README.md
```

---

## 3. Personnalisation en 10 minutes

### 3.1 Votre nom

Recherchez **`Votre Nom`** dans `index.html` (titre, header, hero, footer) et remplacez-le.
Pensez aussi à `Votre&nbsp;Nom` (avec l'espace insécable) dans le header, le hero et le footer.

Dans `<head>`, mettez à jour :

```html
<title>Prénom Nom — Développeur MEARN & Mobile (Flutter / React Native)</title>
<meta name="description" content="…">
<meta property="og:title" content="…">
<meta property="og:description" content="…">
```

### 3.2 Votre photo ⚠️

Le fichier `assets/photo.svg` est une **illustration de remplacement**. Pour mettre votre photo :

1. Déposez votre photo dans `assets/` (idéalement **portrait**, ratio 4:5, largeur ≥ 800 px,
   format `.jpg` ou `.webp` optimisé).
2. Dans `index.html`, modifiez la balise du hero :

```html
<img src="assets/photo.jpg" alt="Portrait de Prénom Nom" width="560" height="700">
```

3. Régénérez ensuite `assets/og-image.png` (capture 1200 × 630 de la page d'accueil) pour
   que les partages sur les réseaux affichent votre visage et votre nom.

Le cadre photo a une forme organique animée : si le cadrage ne vous plaît pas, ajustez
`object-position` sur `.hero__photo img` dans `css/style.css`.

### 3.3 Vos projets

Chaque projet est un bloc `<article class="project" data-category="web|mobile">`.
Pour en ajouter un :

1. Copiez un `<article>` existant.
2. Changez `data-category` (`web` ou `mobile`) pour le filtrage.
3. Remplacez l'image, le titre, l'année, la description et les tags.
4. Remplacez les `href="#"` des boutons par les vraies URL, puis **supprimez l'attribut
   `data-placeholder`** (sinon un message de démonstration s'affiche au clic).

Pour ajouter une catégorie de filtre, ajoutez un bouton dans `.filters` :

```html
<button type="button" class="filter" data-filter="design" aria-pressed="false">Design</button>
```

Les visuels de projets sont des SVG générés pour la démo : remplacez-les par des captures
d'écran réelles (ratio 4:3, ~1200 × 900 px) pour un rendu plus convaincant.

### 3.4 Vos liens et votre e-mail

- **Réseaux** : dans le header/footer (`hero` + `footer`), remplacez
  `https://github.com/`, `https://www.linkedin.com/` et `https://x.com/`.
- **E-mail** : l'adresse `contact@votrenom.dev` apparaît dans la section contact et le footer.
  Le formulaire lit automatiquement la première adresse `mailto:` de la page : **il suffit de
  la modifier dans le HTML**. Une seule source de vérité.
- **CV** : remplacez `assets/CV.pdf` par votre CV, ou retirez le bouton
  « Télécharger mon CV » dans le hero.

### 3.5 Chiffres et compétences

Dans `index.html` :

- Compteurs : `<span data-count="5">5</span>` — changez la valeur (`data-count` et le texte).
- Barres : `aria-valuenow="95"` et `style="--level:95%"` — les deux doivent être cohérents.
- Textes de la frise et de la section « À propos ».

### 3.6 Couleurs et polices

Tout est centralisé en haut de `css/style.css` :

```css
:root {
  --brand: #7c5cff;     /* violet */
  --brand-2: #22d3ee;   /* cyan */
  --brand-3: #34d399;   /* vert */
  --gradient: linear-gradient(120deg, #8b6bff 0%, #22d3ee 55%, #34d399 100%);
  --font-body: "Inter", sans-serif;
  --font-display: "Space Grotesk", sans-serif;
}
```

Modifiez ces variables : tout le site (boutons, titres, barres, lueurs) suit.
Le thème clair possède ses propres valeurs dans le bloc `[data-theme="light"]`.

### 3.7 Formulaire de contact

Par défaut, le formulaire **ouvre le logiciel de messagerie** du visiteur avec le message
pré-rempli (`mailto:`). C'est volontaire : cela fonctionne sans backend.

Pour recevoir les messages directement dans votre boîte mail, sans ouvrir de client mail :

- **Formspree** : créez un formulaire, puis dans `js/main.js`, remplacez la fin du `submit`
  par un `fetch` vers votre endpoint (`https://formspree.io/f/VOTRE_ID`).
- **EmailJS**, **Netlify Forms** ou une petite **API Node/Express** fonctionnent aussi.

Pensez à ajouter une protection anti-spam (honeypot ou captcha) si vous passez par un backend.

---

## 4. Tester en local

Le site fonctionne en ouvrant simplement `index.html`, mais un petit serveur local est
préférable (chemins, CV, futur backend) :

```bash
# Python 3
python3 -m http.server 8000

# ou Node.js
npx serve .
```

Puis ouvrez <http://localhost:8000>.

---

## 5. Mettre en ligne

### GitHub Pages (gratuit)

```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/VOTRE_DEPOT.git
git push -u origin main
```

Puis **Settings → Pages → Deploy from a branch → main / root**.
Le site sera disponible sur `https://VOTRE_COMPTE.github.io/VOTRE_DEPOT/`.

> Les chemins du projet sont **relatifs** (`assets/…`, `css/…`, `js/…`), il fonctionne donc
> aussi dans un sous-dossier.

### Netlify / Vercel

Glissez-déposez le dossier complet sur Netlify, ou importez le dépôt sur Vercel :
aucune commande de build n'est nécessaire (site statique).

### Nom de domaine

Ajoutez un fichier `CNAME` contenant votre domaine (GitHub Pages) ou configurez le domaine
dans l'interface de l'hébergeur, puis mettez à jour `og:url` dans le `<head>`.

---

## 6. Détails techniques

- **Aucune dépendance** : HTML/CSS/JS natifs, chargés directement.
- **Cache / performance** : images SVG légères, `loading="lazy"` sur les projets,
  `fetchpriority="high"` sur le portrait, animations en `transform` / `opacity`.
- **Thème** : appliqué avant le premier rendu par un script inline dans `<head>` (pas de flash).
- **Animations** : désactivées si `prefers-reduced-motion: reduce`.
- **Compatibilité** : navigateurs modernes (Chrome, Edge, Firefox, Safari récents).
- **Impression** : une feuille de style dédiée masque la navigation et les formulaires.

---

## 7. Pistes d'évolution

- [ ] Brancher le formulaire sur Formspree / EmailJS et ajouter un anti-spam.
- [ ] Créer une page détail par projet (`projet-novashop.html`) avec captures et étude de cas.
- [ ] Ajouter un blog ou des notes techniques (Markdown → HTML).
- [ ] Version anglaise (bascule FR/EN).
- [ ] Ajouter une section « Services » et des témoignages clients.
- [ ] Régénérer `assets/og-image.png` (1200 × 630) après avoir mis votre nom et votre photo.
- [ ] Tests Lighthouse et optimisation des polices (auto-hébergement).

---

## 8. Licence

Le code est libre d'utilisation pour votre portfolio personnel. Pensez simplement à remplacer
les contenus de démonstration (nom, photo, projets, CV) avant publication.

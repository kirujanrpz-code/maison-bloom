/* =========================================================
   CATALOGUE MAISON BLOOM
   ---------------------------------------------------------
   Pour mettre à jour le catalogue, il suffit de modifier
   la liste ci-dessous :
   - photos : mettre les fichiers dans le dossier "images/catalogue/"
     (format vertical, 900 × 1200 px conseillé) puis lister leurs noms
     sous la forme "catalogue/nom.webp" (la 1re = photo principale).
     Liste vide [] = affiche « Photo à venir ».
   - couleurs : couleurs dominantes de la création (Rose, Blanc, Rouge,
     Pastel, Doré, Noir, Bleu, Violet). Elles servent au « compositeur » de l'accueil.
   - prix   : laisser "" pour afficher « Prix sur devis »,
     ou écrire par ex. "45 €" pour afficher « À partir de 45 € ».
========================================================= */
const CATALOGUE = [
  /* ---------- BOUQUETS ---------- */
  {
    ref: "MB-B01",
    couleurs: ["Rose", "Blanc"],
    categorie: "bouquet",
    nom: "Bouquet Make-up",
    description: "Bouquet avec vos produits préférés.",
    details: ["Produits au choix", "Fleurs faites main ou naturelles", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-make-up.webp"],
  },
  {
    ref: "MB-B03",
    couleurs: ["Blanc", "Doré"],
    categorie: "bouquet",
    nom: "Composition florale",
    description: "Arrangement floral pour émerveiller vos cadeaux.",
    details: ["Arrangement floral", "Cadeau au choix", "Personnalisable"],
    prix: "",
    photos: ["catalogue/composition-florale.webp"],
  },

  {
    ref: "MB-B04",
    couleurs: ["Noir", "Doré"],
    categorie: "bouquet",
    nom: "Bouquet peluche noir et jaune",
    description: "Une peluche entourée de lys noirs, gris et jaunes faits main, sur emballage noir mat.",
    details: ["Peluche incluse", "Fleurs faites main en tiges chenille", "Emballage noir mat et ruban doré", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-peluche-noir-jaune-photo.webp"],
  },
  {
    ref: "MB-B05",
    couleurs: ["Bleu", "Noir"],
    categorie: "bouquet",
    nom: "Bouquet peluche bleu",
    description: "Une peluche au milieu de fleurs bleues faites main, perlées, sur emballage noir.",
    details: ["Peluche incluse", "Fleurs faites main en tiges chenille", "Perles décoratives", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-peluche-bleu.webp"],
  },
  {
    ref: "MB-B06",
    couleurs: ["Rouge", "Bleu", "Noir"],
    categorie: "bouquet",
    nom: "Bouquet peluche rouge et bleu",
    description: "Une peluche, des lys rouges et bleus faits main et une toile tressée, sur emballage noir.",
    details: ["Peluche incluse", "Fleurs faites main en tiges chenille", "Emballage noir mat", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-peluche-rouge-bleu-photo.webp"],
  },
  {
    ref: "MB-B07",
    couleurs: ["Rose", "Blanc", "Pastel"],
    categorie: "bouquet",
    nom: "Bouquet création",
    description: "Une peluche douce entourée de lys roses et ivoire faits main, sur emballage beige.",
    details: ["Peluche incluse", "Fleurs faites main en tiges chenille", "Ruban satin et perle", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-peluche-rose-poudre.webp"],
  },
  {
    ref: "MB-B08",
    couleurs: ["Rouge", "Violet", "Blanc"],
    categorie: "bouquet",
    nom: "Bouquet de tulipes bordeaux et prune",
    description: "Des tulipes bordeaux et prune faites main, avec petites fleurs blanches, sur emballage blanc.",
    details: ["Fleurs faites main en tiges chenille", "Nœud et perle", "Emballage blanc", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-tulipes-bordeaux.webp"],
  },
  {
    ref: "MB-B09",
    couleurs: ["Bleu", "Blanc"],
    categorie: "bouquet",
    nom: "Bouquet de lys bleus",
    description: "Des lys bleus faits main et des petites fleurs blanches, dans un emballage bleu ciel.",
    details: ["Fleurs faites main en tiges chenille", "Ruban satin bleu nuit", "Emballage bleu ciel", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-lys-bleus-photo.webp"],
  },
  {
    ref: "MB-B10",
    couleurs: ["Violet", "Noir"],
    categorie: "bouquet",
    nom: "Bouquet de lys lilas",
    description: "Des lys et des roses lilas faits main, avec un cœur, sur emballage noir.",
    details: ["Fleurs faites main en tiges chenille", "Cœur décoratif", "Emballage noir et ruban doré", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-lys-lilas.webp"],
  },
  {
    ref: "MB-B11",
    couleurs: ["Rouge", "Noir", "Doré"],
    categorie: "bouquet",
    nom: "Bouquet cœur de roses rouges",
    description: "Des roses rouges et du gypsophile disposés en cœur, sur emballage noir et or.",
    details: ["Roses naturelles", "Gypsophile", "Emballage noir bordé d'or", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-coeur-roses-photo.webp"],
  },
  {
    ref: "MB-B12",
    couleurs: ["Rouge", "Rose"],
    categorie: "bouquet",
    nom: "Bouquet fleurs fraîches éclatant",
    description: "Roses rouges, lys, dahlias et gypsophile rouge réunis dans un emballage rose.",
    details: ["Fleurs naturelles", "Décorations scintillantes", "Emballage rose et ruban blanc", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-fleurs-fraiches.webp"],
  },
  {
    ref: "MB-B13",
    couleurs: ["Rose", "Blanc", "Doré"],
    categorie: "bouquet",
    nom: "Bouquet parure de bijoux",
    description: "Une parure de bijoux présentée sur satin, entourée de roses roses et pêche.",
    details: ["Bijoux de votre choix", "Roses naturelles et gypsophile", "Présentoir en satin", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-parure-bijoux-photo.webp"],
  },
  {
    ref: "MB-B14",
    couleurs: ["Rose", "Blanc", "Pastel"],
    categorie: "bouquet",
    nom: "Bouquet écrin corail",
    description: "Un écrin à bijou au cœur d'une couronne de fleurs blanches et lilas faites main.",
    details: ["Bijou de votre choix", "Fleurs faites main en tiges chenille", "Petit mot personnalisé", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-ecrin-corail.webp"],
  },
  {
    ref: "MB-B15",
    couleurs: ["Rose", "Blanc", "Pastel"],
    categorie: "bouquet",
    nom: "Bouquet écrin pastel",
    description: "Un écrin à bijou entouré de lys et de roses blanches et roses faits main.",
    details: ["Bijou de votre choix", "Fleurs faites main en tiges chenille", "Emballage rose", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-ecrin-pastel.webp"],
  },
  {
    ref: "MB-B16",
    couleurs: ["Blanc", "Doré"],
    categorie: "bouquet",
    nom: "Box personnalisé",
    description: "Un cadeau de votre choix au centre d'un bouquet ivoire fait main, perlé.",
    details: ["Cadeau de votre choix", "Fleurs faites main en tiges chenille", "Perles et ruban doré", "Personnalisable"],
    prix: "",
    photos: ["catalogue/bouquet-ivoire-ecouteurs.webp"],
  },
  {
    ref: "MB-B17",
    couleurs: ["Rose", "Bleu", "Pastel"],
    categorie: "bouquet",
    nom: "Cadre bouquet Love",
    description: "Un bouquet en cœur fait main, présenté dans un cadre en bois à poser.",
    details: ["Fleurs faites main en tiges chenille", "Cadre en bois", "Mot inscrit au choix", "Personnalisable"],
    prix: "",
    photos: ["catalogue/cadre-bouquet-love-photo.webp"],
  },
  {
    ref: "MB-B18",
    couleurs: ["Rouge", "Noir", "Doré", "Blanc"],
    categorie: "bouquet",
    nom: "Bouquet personnalisé",
    description: "Des roses rouges en satin, une initiale en petites roses blanches et une couronne dorée.",
    details: ["Roses en satin", "Initiale de votre choix", "Couronne dorée", "Emballage noir bordé d'or"],
    prix: "",
    photos: ["catalogue/bouquet-roses-satin-initiale-photo.webp"],
  },

  /* ---------- COFFRETS & PANIERS ---------- */
  {
    ref: "MB-C01",
    couleurs: ["Rose", "Doré", "Pastel"],
    categorie: "coffret",
    nom: "Coffret anniversaire",
    description: "Composition personnalisée avec fleurs et des cadeaux de votre choix.",
    details: ["Cadeaux au choix", "Fleurs", "Personnalisable"],
    prix: "",
    photos: ["catalogue/coffret-anniversaire-photo.webp"],
  },
  {
    ref: "MB-C02",
    couleurs: ["Rose", "Doré", "Blanc"],
    categorie: "coffret",
    nom: "Boîte cadeau",
    description: "Une création élégante avec parfum et montre.",
    details: ["Parfum", "Montre", "Fleurs"],
    prix: "",
    photos: ["catalogue/boite-cadeau.webp"],
  },
  {
    ref: "MB-C03",
    couleurs: ["Pastel", "Rose", "Doré"],
    categorie: "coffret",
    nom: "Panier soins de cheveux",
    description: "Un coffret raffiné avec des produits de soins et fleurs.",
    details: ["Produits de soins", "Fleurs", "Personnalisable"],
    prix: "",
    photos: ["catalogue/panier-soins-cheveux.webp"],
  },
  {
    ref: "MB-C04",
    couleurs: ["Rouge", "Noir", "Blanc"],
    categorie: "coffret",
    nom: "Coffret sac à main",
    description: "Un coffret élégant pour présenter votre sac.",
    details: ["Sac à main", "Fleurs", "Présentation élégante"],
    prix: "",
    photos: ["catalogue/coffret-sac-a-main-photo.webp"],
  },
  {
    ref: "MB-C05",
    couleurs: ["Rose", "Noir", "Blanc"],
    categorie: "coffret",
    nom: "Box transparent",
    description: "Une vitrine transparente qui met en scène vos cadeaux, entourés de fleurs et de gypsophile.",
    details: ["Cadeaux de votre choix", "Fleurs et gypsophile", "Vitrine transparente et ruban", "Personnalisable"],
    prix: "",
    photos: ["catalogue/box-transparent.webp"],
  },
  {
    ref: "MB-C06",
    couleurs: ["Rouge", "Blanc"],
    categorie: "coffret",
    nom: "Coffret sac et roses rouges",
    description: "Un sac à main posé sur un lit de roses rouges et de gypsophile, avec ruban personnalisé.",
    details: ["Sac de votre choix", "Roses naturelles et gypsophile", "Ruban avec texte au choix", "Boîte rouge à poignées"],
    prix: "",
    photos: ["catalogue/coffret-sac-roses-rouges.webp"],
  },
  {
    ref: "MB-C07",
    couleurs: ["Blanc", "Rose", "Pastel"],
    categorie: "coffret",
    nom: "Coffret beauté sauge",
    description: "Une boîte vert sauge garnie de soins, de pivoines et de gypsophile.",
    details: ["Soins de votre choix", "Fleurs artificielles et gypsophile", "Ruban satin blanc", "Personnalisable"],
    prix: "",
    photos: ["catalogue/coffret-beaute-sauge-photo.webp"],
  },
  {
    ref: "MB-C08",
    couleurs: ["Rose", "Blanc", "Noir"],
    categorie: "coffret",
    nom: "Vitrine montre et roses",
    description: "Une montre présentée dans une vitrine transparente, au milieu de roses et de gypsophile.",
    details: ["Montre de votre choix", "Roses et gypsophile", "Vitrine transparente", "Personnalisable"],
    prix: "",
    photos: ["catalogue/vitrine-montre-roses-photo.webp"],
  },
  {
    ref: "MB-C09",
    couleurs: ["Rouge", "Blanc"],
    categorie: "coffret",
    nom: "Coffret parfum rouge",
    description: "Un parfum et ses soins assortis, présentés avec des roses rouges et du gypsophile.",
    details: ["Parfum et soins de votre choix", "Roses et gypsophile", "Ruban doré", "Personnalisable"],
    prix: "",
    photos: ["catalogue/coffret-parfum-rouge.webp"],
  },
  {
    ref: "MB-C10",
    couleurs: ["Rouge", "Doré", "Blanc"],
    categorie: "coffret",
    nom: "Panier anniversaire rouge",
    description: "Un panier tressé garni de soins et de maquillage, de roses rouges et d'un « Happy Birthday » doré.",
    details: ["Produits de votre choix", "Roses et gypsophile", "Décoration anniversaire", "Personnalisable"],
    prix: "",
    photos: ["catalogue/panier-anniversaire-rouge.webp"],
  },
  {
    ref: "MB-C11",
    couleurs: ["Rose", "Blanc", "Doré"],
    categorie: "coffret",
    nom: "Panier personnalisé",
    description: "Un panier blanc garni de maquillage de votre choix, de roses roses et ivoire et d'un nœud satin.",
    details: ["Maquillage de votre choix", "Roses naturelles", "Nœud satin rose", "Personnalisable"],
    prix: "",
    photos: ["catalogue/panier-make-up-rose.webp"],
  },
];

const CATEGORIES = {
  bouquet: { titre: "Bouquets", intro: "Bouquets faits avec fleurs faites main ou naturelles, accompagnés de cadeaux personnalisés." },
  coffret: { titre: "Coffrets & paniers", intro: "Coffrets, boîtes et paniers cadeaux garnis de créations florales et de cadeaux de votre choix." },
};

/* =========================================================
   AFFICHAGE (pas besoin de modifier en dessous)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const prixTxt = (p) => (p ? `À partir de ${esc(p)}` : "Prix sur devis");
  const photoTag = (file, alt, cls = "") =>
    file
      ? `<img src="images/${esc(file)}" alt="${esc(alt)}" loading="lazy" class="${cls}">`
      : `<span class="ph-empty ${cls}"><svg class="ic"><use href="#i-flower"/></svg>Photo à venir</span>`;

  const root = $("#catalogue-root");
  if (!root) return; // page sans catalogue (ex. accueil) : seules les données servent

  // ---------- Construction des sections ----------
  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const items = CATALOGUE.filter((i) => i.categorie === key);
    if (!items.length) return;
    const sec = document.createElement("section");
    sec.className = "cat-section";
    sec.dataset.cat = key;
    sec.id = "cat-" + key;
    sec.innerHTML = `
      <header class="cat-head" data-reveal>
        <div>
          <span class="eyebrow">${items.length} création${items.length > 1 ? "s" : ""}</span>
          <h2>${esc(cat.titre)}</h2>
        </div>
        <p>${esc(cat.intro)}</p>
      </header>
      <div class="cat-grid">
        ${items.map((it, n) => `
          <article class="cat-card" data-reveal style="--d:${(n % 3) * 0.08}s">
            <button class="cat-media" data-ref="${esc(it.ref)}" aria-label="Voir ${esc(it.nom)}">
              ${photoTag(it.photos[0], it.nom)}
              ${it.photos.length > 1 ? `<span class="cat-photos">${it.photos.length} photos</span>` : ""}
              <span class="cat-view">Voir la création</span>
            </button>
            <div class="cat-body">
              <div class="cat-meta"><span class="cat-ref">${esc(it.ref)}</span><span class="cat-price">${prixTxt(it.prix)}</span></div>
              <h3>${esc(it.nom)}</h3>
              <p>${esc(it.description)}</p>
              <div class="cat-actions">
                <button class="btn btn-outline btn-sm" data-ref="${esc(it.ref)}">Détails</button>
                <a href="index.html#contact" class="btn btn-primary btn-sm" data-order="${esc(it.nom)} (${esc(it.ref)})">Commander</a>
              </div>
            </div>
          </article>`).join("")}
      </div>`;
    root.appendChild(sec);
  });

  // ---------- Compteurs des filtres ----------
  $$(".cat-filter button").forEach((b) => {
    const f = b.dataset.filter;
    const n = f === "all" ? CATALOGUE.length : CATALOGUE.filter((i) => i.categorie === f).length;
    const c = $(".count", b);
    if (c) c.textContent = n;
  });

  // ---------- Filtres ----------
  $$(".cat-filter button").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".cat-filter button").forEach((b) => { b.classList.toggle("active", b === btn); b.setAttribute("aria-pressed", String(b === btn)); });
      const f = btn.dataset.filter;
      $$(".cat-section").forEach((s) => {
        const show = f === "all" || s.dataset.cat === f;
        s.hidden = !show;
        if (show) $$("[data-reveal]", s).forEach((el) => el.classList.add("in"));
      });
    });
  });

  // ---------- Commander : pré-remplit le formulaire de contact ----------
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-order]");
    if (!a) return;
    try { sessionStorage.setItem("mb-creation", a.dataset.order); } catch (err) {}
  });

  // ---------- Fiche détaillée ----------
  const modal = $("#cat-modal");
  let lastFocus = null;
  let cur = null;
  let photoIdx = 0;

  const showPhoto = (i) => {
    photoIdx = i;
    const main = $(".cm-main", modal);
    main.innerHTML = photoTag(cur.photos[i], cur.nom);
    $$(".cm-thumbs button", modal).forEach((t, k) => t.classList.toggle("active", k === i));
  };

  const open = (ref) => {
    cur = CATALOGUE.find((i) => i.ref === ref);
    if (!cur) return;
    lastFocus = document.activeElement;
    $(".cm-cat", modal).textContent = CATEGORIES[cur.categorie].titre;
    $(".cm-ref", modal).textContent = cur.ref;
    $(".cm-title", modal).textContent = cur.nom;
    $(".cm-desc", modal).textContent = cur.description;
    $(".cm-price", modal).textContent = prixTxt(cur.prix);
    $(".cm-details", modal).innerHTML = cur.details.map((d) => `<li><svg class="ic"><use href="#i-check"/></svg>${esc(d)}</li>`).join("");
    $(".cm-order", modal).dataset.order = `${cur.nom} (${cur.ref})`;
    const thumbs = $(".cm-thumbs", modal);
    thumbs.innerHTML = cur.photos.length > 1
      ? cur.photos.map((p, k) => `<button aria-label="Photo ${k + 1}"><img src="images/${esc(p)}" alt=""></button>`).join("")
      : "";
    $$("button", thumbs).forEach((b, k) => b.addEventListener("click", () => showPhoto(k)));
    showPhoto(0);
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("open"));
    document.body.style.overflow = "hidden";
    $(".cm-close", modal).focus();
  };
  const close = () => {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => (modal.hidden = true), 300);
    if (lastFocus) lastFocus.focus();
  };

  root.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-ref]");
    if (b) open(b.dataset.ref);
  });
  $(".cm-close", modal).addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") close();
    if (cur && cur.photos.length > 1) {
      if (e.key === "ArrowRight") showPhoto((photoIdx + 1) % cur.photos.length);
      if (e.key === "ArrowLeft") showPhoto((photoIdx - 1 + cur.photos.length) % cur.photos.length);
    }
  });

  // ---------- Apparition au scroll des cartes générées ----------
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els = $$("[data-reveal]", root);
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
  } else els.forEach((el) => el.classList.add("in"));
});

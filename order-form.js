/* =========================================================
   FORMULAIRE DE COMMANDE GUIDÉ — Maison Bloom
   4 étapes : Création → Détails → Réception → Coordonnées
   Les demandes sont enregistrées via MBStore (orders-store.js).
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form || !window.MBStore) return;

  const $ = (s, el = form) => el.querySelector(s);
  const $$ = (s, el = form) => [...el.querySelectorAll(s)];
  const msg = document.getElementById("form-message");
  const btnPrev = $("#btn-prev"), btnNext = $("#btn-next"), btnSend = $("#btn-send");
  const IDF = ["75", "77", "78", "91", "92", "93", "94", "95"];
  const MAX_PHOTOS = 3;
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Compte Instagram : accepte « @nom », « nom » ou un lien instagram.com/nom ; rendu sous la forme « @nom »
  const normInsta = (v) => {
    const s = String(v || "").trim()
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
      .replace(/[/?#].*$/, "")
      .replace(/^@+/, "")
      .toLowerCase();
    return s ? "@" + s : "";
  };
  // Règles Instagram : lettres, chiffres, points et tirets bas (30 max), pas de point au début, à la fin ni doublé
  const instaOk = (v) => {
    const h = normInsta(v);
    return /^@[a-z0-9._]{1,30}$/.test(h) && h[1] !== "." && !h.endsWith(".") && !h.includes("..");
  };

  let step = 1;
  let photos = []; // { dataUrl, blob }

  /* ---------- Liste des modèles (depuis catalogue.js) ---------- */
  const sel = form.creation;
  if (typeof CATALOGUE !== "undefined") {
    [["bouquet", "Bouquets"], ["coffret", "Coffrets & paniers"]].forEach(([k, label]) => {
      const og = document.createElement("optgroup");
      og.label = label;
      CATALOGUE.filter((i) => i.categorie === k).forEach((i) => {
        const o = document.createElement("option");
        o.value = o.textContent = `${i.nom} (${i.ref})`;
        og.appendChild(o);
      });
      sel.appendChild(og);
    });
  }
  try {
    const pick = sessionStorage.getItem("mb-creation");
    if (pick) {
      if ([...sel.options].some((o) => o.value === pick)) sel.value = pick;
      sessionStorage.removeItem("mb-creation");
    }
  } catch (e) {}

  /* ---------- Aperçu du modèle choisi (photo à côté de la liste) ---------- */
  const champModele = sel.closest(".field");
  const choix = document.createElement("div");
  choix.className = "modele-choix";
  champModele.before(choix);
  const apercu = document.createElement("figure");
  apercu.className = "modele-apercu";
  apercu.setAttribute("aria-live", "polite");
  choix.append(apercu, champModele);

  const modeleChoisi = () =>
    typeof CATALOGUE === "undefined" ? null : CATALOGUE.find((i) => `${i.nom} (${i.ref})` === sel.value) || null;

  function majApercu() {
    const m = modeleChoisi();
    const photo = m && m.photos && m.photos[0] ? "images/" + m.photos[0] : "images/logo-rond.png";
    const legende = m
      ? `<strong>${esc(m.nom)}</strong><small>${esc(m.description || "")}</small><span class="modele-prix">${m.prix ? "À partir de " + esc(m.prix) : "Prix sur devis"}</span>`
      : `<strong>Création sur mesure</strong><small>Décrivez votre idée à l'étape suivante, ou ajoutez des photos d'inspiration.</small>`;
    apercu.classList.toggle("sur-mesure", !m);
    apercu.innerHTML = `<span class="modele-img"><img src="${esc(photo)}" alt="${esc(m ? m.nom : "Maison Bloom")}" width="400" height="500"></span><figcaption>${legende}</figcaption>`;
  }
  sel.addEventListener("change", majApercu);
  majApercu();

  // Date minimum = aujourd'hui
  const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
  form.wanted_date.min = t.toISOString().slice(0, 10);

  /* ---------- Affichage des étapes ---------- */
  const isQuestion = () => form.type.value === "question";

  function show(n, scroll = true) {
    step = n;
    const q = isQuestion();
    $$(".order-only").forEach((el) => (el.hidden = q));
    $$(".question-only").forEach((el) => (el.hidden = !q));
    $$(".fstep").forEach((fs) => {
      const s = Number(fs.dataset.step);
      fs.hidden = q ? s !== 4 : s !== n;
    });
    $$(".progress li").forEach((li, i) => {
      li.classList.toggle("active", i + 1 === n);
      li.classList.toggle("done", i + 1 < n);
    });
    btnPrev.hidden = q || n === 1;
    btnNext.hidden = q || n === 4;
    btnSend.hidden = !q && n !== 4;
    if (n === 4 && !q) buildRecap();
    msg.textContent = ""; msg.className = "form-message";
    if (scroll) {
      const top = form.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.5) window.scrollBy({ top: top - 100, behavior: "smooth" });
    }
    const first = $(`.fstep[data-step="${q ? 4 : n}"] input:not([type=hidden]), .fstep[data-step="${q ? 4 : n}"] select`);
    if (scroll && first && window.matchMedia("(pointer: fine)").matches) first.focus({ preventScroll: true });
  }
  $$('input[name="type"]').forEach((r) => r.addEventListener("change", () => show(isQuestion() ? 4 : 1, false)));

  /* ---------- Validation ---------- */
  const radioVal = (name) => { const r = form.querySelector(`input[name="${name}"]:checked`); return r ? r.value : ""; };
  const checkVals = (name) => $$(`input[name="${name}"]:checked`).map((c) => c.value);
  const mark = (el, bad) => { el.classList.toggle("invalid", bad); return bad; };

  function validate(n) {
    let errors = [];
    if (isQuestion()) n = 4;
    if (n === 1) {
      $$(".fstep[data-step='1'] .group[data-required]").forEach((g) => {
        if (mark(g, !radioVal(g.dataset.required))) errors.push(g.dataset.required);
      });
    }
    if (n === 3) {
      const g = $(".fstep[data-step='3'] .group[data-required]");
      if (mark(g, !radioVal("reception"))) errors.push("reception");
      if (mark(form.wanted_date.closest(".field"), !form.wanted_date.value)) errors.push("date");
      if (mark(form.zip.closest(".field"), !/^\d{5}$/.test(form.zip.value.trim()))) errors.push("zip");
      if (mark(form.city.closest(".field"), !form.city.value.trim())) errors.push("city");
    }
    if (n === 4) {
      if (mark(form.name.closest(".field"), !form.name.value.trim())) errors.push("name");
      if (mark(form.instagram.closest(".field"), !instaOk(form.instagram.value))) errors.push("instagram");
      if (isQuestion() && mark(form.question.closest(".field"), !form.question.value.trim())) errors.push("question");
      if (mark(form.consent.closest(".consent"), !form.consent.checked)) errors.push("consent");
    }
    if (errors.length) {
      msg.className = "form-message err";
      msg.textContent =
        errors.includes("consent") && errors.length === 1 ? "Merci d'accepter l'utilisation de vos informations." :
        errors.includes("instagram") && errors.length === 1 ? "Indiquez votre compte Instagram, par exemple @prenom.nom." :
        "Merci de compléter les champs obligatoires (*).";
      const firstBad = $(".invalid:not([hidden])");
      if (firstBad) firstBad.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    return errors.length === 0;
  }

  // Retire l'erreur dès que l'on corrige
  form.addEventListener("input", (e) => {
    const box = e.target.closest(".field, .group, .consent");
    if (box) box.classList.remove("invalid");
  });

  // Avertissement : main propre hors Île-de-France
  const zipWarn = document.createElement("p");
  zipWarn.className = "hint warn"; zipWarn.hidden = true;
  zipWarn.textContent = "La remise en main propre est proposée en Île-de-France. Pour une autre région, choisissez l'envoi postal.";
  $(".form-row-cp").after(zipWarn);
  const checkZone = () => {
    const z = form.zip.value.trim();
    zipWarn.hidden = !(radioVal("reception") === "main_propre" && /^\d{5}$/.test(z) && !IDF.includes(z.slice(0, 2)));
  };
  form.zip.addEventListener("input", checkZone);
  $$('input[name="reception"]').forEach((r) => r.addEventListener("change", checkZone));

  btnNext.addEventListener("click", () => { if (validate(step)) show(step + 1); });
  btnPrev.addEventListener("click", () => show(step - 1));

  /* ---------- Photos d'inspiration ---------- */
  const thumbs = $("#thumbs");
  const input = $("#f-photos");
  const dz = $("#dropzone");

  // Réduit la photo (900 px max, JPEG) pour un envoi rapide
  const compress = (file) => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 900 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      const dataUrl = c.toDataURL("image/jpeg", 0.72);
      c.toBlob((blob) => resolve({ dataUrl, blob }), "image/jpeg", 0.72);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image illisible")); };
    img.src = url;
  });

  async function addFiles(files) {
    const list = [...files].filter((f) => f.type.startsWith("image/"));
    for (const f of list) {
      if (photos.length >= MAX_PHOTOS) break;
      if (f.size > 15 * 1024 * 1024) continue;
      try { photos.push(await compress(f)); } catch (e) { console.warn(e); }
    }
    renderThumbs();
    input.value = "";
  }
  function renderThumbs() {
    thumbs.innerHTML = photos.map((p, i) =>
      `<figure><img src="${p.dataUrl}" alt="Photo d'inspiration ${i + 1}"><button type="button" data-i="${i}" aria-label="Retirer la photo ${i + 1}">×</button></figure>`).join("");
    dz.classList.toggle("full", photos.length >= MAX_PHOTOS);
  }
  input.addEventListener("change", () => addFiles(input.files));
  thumbs.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (b) { photos.splice(Number(b.dataset.i), 1); renderThumbs(); }
  });
  ["dragenter", "dragover"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("drag"); }));
  ["dragleave", "drop"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("drag"); }));
  dz.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

  /* ---------- Récapitulatif ---------- */
  function collect() {
    const q = isQuestion();
    return {
      type: form.type.value,
      name: form.name.value, instagram: normInsta(form.instagram.value), phone: "",
      contact_pref: "instagram",
      creation: q ? "" : sel.value,
      occasion: q ? "" : radioVal("occasion"),
      budget: q ? "" : radioVal("budget"),
      flowers: q ? "" : radioVal("flowers"),
      colors: q ? "" : checkVals("colors").join(", "),
      gifts: q ? "" : form.gifts.value,
      gifts_by: q ? "" : radioVal("gifts_by"),
      inscription: q ? "" : form.inscription.value,
      reception: q ? "" : radioVal("reception"),
      wanted_date: q ? "" : form.wanted_date.value,
      date_flexible: q ? false : form.date_flexible.checked,
      zip: q ? "" : form.zip.value, city: q ? "" : form.city.value,
      message: q ? form.question.value : form.message.value,
    };
  }
  const GBY = { maison_bloom: "Maison Bloom s'en occupe", client: "Fournis par le client", a_voir: "À voir ensemble" };

  function buildRecap() {
    const d = collect();
    const date = d.wanted_date ? new Date(d.wanted_date + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "";
    const rows = [
      [1, "Modèle", d.creation], [1, "Occasion", d.occasion], [1, "Budget", d.budget],
      [1, "Fleurs", d.flowers], [1, "Couleurs", d.colors],
      [2, "Cadeaux", d.gifts + (d.gifts_by ? ` (${GBY[d.gifts_by]})` : "")], [2, "Texte", d.inscription],
      [2, "Photos", photos.length ? `${photos.length} photo${photos.length > 1 ? "s" : ""}` : ""],
      [3, "Réception", d.reception === "envoi" ? "Envoi postal" : "Main propre"],
      [3, "Date", date + (d.date_flexible ? " (flexible)" : "")], [3, "Lieu", `${d.zip} ${d.city}`],
    ].filter((r) => String(r[2]).trim());
    $("#recap").innerHTML = `
      <p class="recap-title">Récapitulatif de votre demande</p>
      <dl>${rows.map(([s, k, v]) => `<dt>${k}</dt><dd>${esc(v)} <button type="button" class="recap-edit" data-go="${s}">Modifier</button></dd>`).join("")}</dl>`;
  }
  $("#recap").addEventListener("click", (e) => { const b = e.target.closest("[data-go]"); if (b) show(Number(b.dataset.go)); });

  /* ---------- Mode démonstration : la demande n'est PAS transmise ----------
     Tant que config.js n'est pas rempli, rien n'arrive chez Maison Bloom.
     On le dit clairement et on donne au client de quoi envoyer sa demande
     lui-même en message privé sur Instagram (récapitulatif à copier). */
  const INSTAGRAM_DM = "https://www.instagram.com/maison.bloom.fr/";
  const INSTAGRAM = "@maison.bloom.fr";
  function texteRecap(d, nbPhotos) {
    if (d.type === "question") return `Question pour Maison Bloom\nDe : ${d.name} (${d.instagram}${d.phone ? ", " + d.phone : ""})\n\n${d.message}`;
    const date = d.wanted_date ? new Date(d.wanted_date + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";
    const commande = [
      "Demande de commande — Maison Bloom",
      `Modèle : ${d.creation}`,
      d.occasion && `Occasion : ${d.occasion}`,
      d.budget && `Budget : ${d.budget}`,
      d.flowers && `Fleurs : ${d.flowers}`,
      d.colors && `Couleurs : ${d.colors}`,
      d.gifts && `Cadeaux à inclure : ${d.gifts}${d.gifts_by ? ` (${GBY[d.gifts_by]})` : ""}`,
      d.inscription && `Texte à inscrire : « ${d.inscription} »`,
      d.reception && `Réception : ${d.reception === "envoi" ? "Envoi postal" : "Remise en main propre"}`,
      date && `Date souhaitée : ${date}${d.date_flexible ? " (flexible)" : ""}`,
      (d.zip || d.city) && `Lieu : ${d.zip} ${d.city}`.trim(),
      nbPhotos && `Photos d'inspiration : ${nbPhotos} (à envoyer dans le message Instagram)`,
      d.message && `Précisions : ${d.message}`,
    ];
    const client = [`Nom : ${d.name}`, `Instagram : ${d.instagram}`, d.phone && `Téléphone : ${d.phone}`];
    return commande.filter(Boolean).join("\n") + "\n\n" + client.filter(Boolean).join("\n");
  }

  function afficherDemo(d, nbPhotos, echec = false) {
    const recap = texteRecap(d, nbPhotos);
    msg.className = "form-message demo";
    msg.innerHTML = `
      <span class="demo-titre">${echec ? "L'envoi automatique n'a pas abouti." : "Votre demande n'a pas encore été transmise."}</span>
      <span class="demo-texte">${echec ? "Vos réponses sont conservées ci-dessous, rien n'est perdu." : "Ce site est en version de démonstration : l'envoi automatique n'est pas encore activé."}
        Pour que Maison Bloom reçoive votre demande, copiez le récapitulatif ci-dessous et envoyez-le en
        <strong>message privé sur Instagram</strong> à <strong class="demo-email">${esc(INSTAGRAM)}</strong>.</span>
      <textarea class="demo-recap" id="demo-recap" readonly rows="8" aria-label="Récapitulatif de votre demande">${esc(recap)}</textarea>
      <span class="demo-actions">
        <button type="button" class="btn btn-primary btn-sm" id="demo-copier">Copier le récapitulatif</button>
        <a class="btn btn-outline btn-sm" href="${esc(INSTAGRAM_DM)}" target="_blank" rel="noopener">Ouvrir Instagram</a>
      </span>
      <span class="demo-etat" id="demo-etat" aria-live="polite"></span>`;
    const zone = document.getElementById("demo-recap");
    document.getElementById("demo-copier").addEventListener("click", async () => {
      const etat = document.getElementById("demo-etat");
      try {
        await navigator.clipboard.writeText(recap);
        etat.textContent = "Récapitulatif copié. Collez-le dans votre message Instagram à @maison.bloom.fr.";
      } catch (err) {
        zone.focus(); zone.select();
        etat.textContent = "Copie automatique impossible : le texte est sélectionné, utilisez Ctrl+C (ou Copier sur mobile).";
      }
    });
  }

  /* ---------- Envoi ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // robot détecté
    if (!isQuestion() && step !== 4) { if (validate(step)) show(step + 1); return; }
    if (!validate(4)) return;

    btnSend.disabled = true;
    msg.className = "form-message";
    msg.textContent = "Envoi en cours...";
    const donnees = collect();
    const nbPhotos = photos.length;
    // Alerte e-mail à Maison Bloom (EmailJS). Ne bloque jamais l'enregistrement.
    const alerteMail = () => {
      const c = window.MB_CONFIG || {};
      if (!window.emailjs || !c.EMAILJS_PUBLIC_KEY || window.MBStore.mode === "demo") return Promise.reject(new Error("emailjs indisponible"));
      const q = donnees.type === "question";
      return window.emailjs.send(c.EMAILJS_SERVICE, c.EMAILJS_TEMPLATE, {
        name: `${donnees.name} (${donnees.instagram})`,
        email: "",
        subject: q ? `Nouvelle question de ${donnees.name}` : `Nouvelle commande : ${donnees.creation}, pour le ${donnees.wanted_date ? new Date(donnees.wanted_date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "date à définir"}`,
        message: texteRecap(donnees, nbPhotos) + (nbPhotos ? "\n\nLes photos d'inspiration sont visibles dans l'espace admin." : "") + "\n\nRépondre au client sur Instagram : https://www.instagram.com/" + donnees.instagram.replace(/^@/, "") + "/",
      }, { publicKey: c.EMAILJS_PUBLIC_KEY });
    };
    let enregistre = false;
    try {
      await window.MBStore.create(donnees, photos);
      enregistre = true;
      alerteMail().catch((er) => console.warn("Alerte e-mail non envoyée", er));
      form.reset();
      photos = []; renderThumbs();
      show(isQuestion() ? 4 : 1, false);
      if (window.MBStore.mode === "demo") {
        afficherDemo(donnees, nbPhotos);
      } else {
        msg.className = "form-message ok";
        msg.textContent = "Merci ! Votre demande est bien enregistrée. Maison Bloom revient vers vous rapidement pour confirmer les détails et le prix.";
        document.dispatchEvent(new CustomEvent("mb:sent"));
      }
      msg.scrollIntoView({ block: "center", behavior: "smooth" });
    } catch (err) {
      console.error(err);
      // Base indisponible : l'e-mail sert de secours. S'il échoue aussi, le visiteur garde son récapitulatif pour Instagram.
      let parMail = false;
      if (!enregistre) { try { await alerteMail(); parMail = true; } catch (e2) { console.warn(e2); } }
      if (parMail) {
        form.reset(); photos = []; renderThumbs(); show(isQuestion() ? 4 : 1, false);
        msg.className = "form-message ok";
        msg.textContent = "Merci ! Votre demande est bien transmise. Maison Bloom revient vers vous rapidement sur Instagram.";
        document.dispatchEvent(new CustomEvent("mb:sent"));
      } else {
        afficherDemo(donnees, nbPhotos, true);
      }
      msg.scrollIntoView({ block: "center", behavior: "smooth" });
    } finally {
      btnSend.disabled = false;
    }
  });

  // Prévenir dès le départ en mode démonstration
  if (window.MBStore.mode === "demo") {
    const note = document.createElement("p");
    note.className = "hint demo-avis";
    note.textContent = "Site en version de démonstration : l'envoi automatique n'est pas encore activé. À la fin, nous vous donnerons un récapitulatif à envoyer en message privé sur Instagram.";
    $(".form-nav").before(note);
  }

  show(1, false);
});

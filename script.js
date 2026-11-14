/* =========================================================
   MAISON BLOOM — Interactions communes à toutes les pages
   (menu, en-tête, scène d'accueil, galerie, fiche création,
    prestations, barre mobile). Le formulaire : order-form.js
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const data = typeof CATALOGUE !== "undefined" ? CATALOGUE : [];
  const cats = typeof CATEGORIES !== "undefined" ? CATEGORIES : {};
  const prixTxt = (p) => (p ? `À partir de ${p}` : "Prix sur devis");
  const label = (it) => `${it.nom} (${it.ref})`;

  /* ========== LOGO À L'OUVERTURE ========== */
  const splash = $("#splash");
  if (splash && !document.documentElement.classList.contains("seen")) {
    const t0 = performance.now();
    const hide = () => setTimeout(() => {
      splash.classList.add("done");
      try { sessionStorage.setItem("mbSeen", "1"); } catch (e) {}
    }, Math.max(0, (reduceMotion ? 300 : 1100) - (performance.now() - t0)));
    if (document.readyState === "complete") hide(); else window.addEventListener("load", hide, { once: true });
    setTimeout(() => splash.classList.add("done"), 3500); // sécurité si une image tarde
  }

  /* ========== MENU MOBILE ========== */
  const menuBtn = $("#menu-btn");
  const nav = $("#nav-menu");
  const setMenu = (open) => {
    if (!nav || !menuBtn) return;
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    document.body.classList.toggle("no-scroll", open);
  };
  if (nav && menuBtn) {
    $$("ul a", nav).forEach((a, i) => a.style.setProperty("--i", i));
    menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false); });
  }

  /* ========== EN-TÊTE + BOUTON HAUT ========== */
  const header = $("#header");
  const topBtn = $("#top-button");
  const fixedHeader = header && header.classList.contains("scrolled"); // pages légales : toujours opaque
  const onScroll = () => {
    const y = window.scrollY;
    if (header && !fixedHeader) header.classList.toggle("scrolled", y > 24);
    if (topBtn) topBtn.classList.toggle("visible", y > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ========== LIEN ACTIF DANS LE MENU ========== */
  const links = $$('.nav a[href^="#"]:not(.btn)');
  if (links.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("section[id]").forEach((s) => spy.observe(s));
  }

  /* ========== COMMANDER UNE CRÉATION PRÉCISE ==========
     Tout élément portant data-order="Nom (RÉF)" pré-remplit le formulaire. */
  const form = $("#contact-form");
  const pickCreation = (value, extra = {}) => {
    if (!form || !form.creation) return;
    const commande = form.querySelector('input[name="type"][value="commande"]');
    if (commande && !commande.checked) { commande.checked = true; commande.dispatchEvent(new Event("change", { bubbles: true })); }
    if ([...form.creation.options].some((o) => o.value === value)) {
      form.creation.value = value;
      form.creation.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (extra.occasion) {
      const r = [...form.querySelectorAll('input[name="occasion"]')].find((i) => i.value === extra.occasion);
      if (r) { r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); }
    }
    if (extra.colors) {
      form.querySelectorAll('input[name="colors"]').forEach((c) => { c.checked = extra.colors.includes(c.value); });
    }
    const apercu = $(".modele-apercu", form);
    if (apercu) { apercu.classList.remove("flash"); void apercu.offsetWidth; apercu.classList.add("flash"); }
  };
  if (form) {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-order]");
      if (!a || !a.dataset.order) return;
      closeSheet();
      pickCreation(a.dataset.order, a.mbExtra ? a.mbExtra() : {});
    });
  }

  /* ========== SCÈNE D'ACCUEIL ========== */
  const stage = $("#stage");
  if (stage) {
    const imgs = $$(".stage-frame img", stage);
    const items = imgs.map((img) => data.find((i) => i.ref === img.dataset.ref)).filter(Boolean);
    const word = $(".stage-word", stage);
    const thumbs = $(".stage-thumbs", stage);
    const count = $(".stage-count", stage);
    let cur = 0;

    if (items.length === imgs.length && items.length) {
      thumbs.innerHTML = items.map((it, k) =>
        `<button type="button" aria-label="Voir ${esc(it.nom)}"><img src="images/${esc(it.photos[0])}" alt="" loading="lazy" width="112" height="140"></button>`).join("");
      const tbtns = $$("button", thumbs);

      const show = (n, dir = 1) => {
        const next = (n + items.length) % items.length;
        const it = items[next];
        imgs.forEach((img, k) => {
          if (k === next) img.style.setProperty("--from", `${dir * 28}px`);
          img.classList.toggle("active", k === next);
        });
        tbtns.forEach((b, k) => b.setAttribute("aria-current", String(k === next)));
        const amb = imgs[next].dataset.amb;
        if (amb) document.documentElement.style.setProperty("--amb", amb);
        $(".stage-name", stage).textContent = it.nom;
        $(".stage-desc", stage).textContent = it.description;
        count.textContent = `${next + 1} / ${items.length}`;
        $(".stage-order", stage).dataset.order = label(it);
        const w = it.nom.split(" ")[0];
        if (word.textContent !== w) {
          word.classList.add("swap");
          setTimeout(() => { word.textContent = w; word.classList.remove("swap"); }, reduceMotion ? 0 : 300);
        }
        cur = next;
      };
      tbtns.forEach((b, k) => b.addEventListener("click", () => show(k, k >= cur ? 1 : -1)));
      $(".stage-prev", stage).addEventListener("click", () => show(cur - 1, -1));
      $(".stage-next", stage).addEventListener("click", () => show(cur + 1, 1));
      stage.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") show(cur - 1, -1);
        if (e.key === "ArrowRight") show(cur + 1, 1);
      });
      // Glisser la photo (doigt ou souris) : elle suit le geste, puis passe à la suivante
      const frame = $(".stage-frame", stage);
      let drag = null;
      frame.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        drag = { x: e.clientX, y: e.clientY, img: imgs[cur], lock: null, dx: 0 };
      });
      window.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.lock && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) drag.lock = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (drag.lock !== "x") return;
        drag.dx = dx;
        frame.classList.add("dragging");
        drag.img.style.transition = "none";
        drag.img.style.transform = `translateX(${dx}px) rotate(${(dx / 28).toFixed(2)}deg)`;
      });
      const endDrag = () => {
        if (!drag) return;
        const { img, dx, lock } = drag;
        drag = null;
        frame.classList.remove("dragging");
        img.style.transition = ""; img.style.transform = "";
        if (lock === "x" && Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      };
      window.addEventListener("pointerup", endDrag);
      window.addEventListener("pointercancel", endDrag);
      show(0);
    }
  }

  /* ========== GALERIE DES CRÉATIONS (générée depuis catalogue.js) ========== */
  const rail = $("#rail");
  if (rail && data.length) {
    const end = $(".rail-end", rail);
    const cards = data.map((it) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "rail-card";
      b.dataset.ref = it.ref;
      b.dataset.cat = it.categorie;
      b.setAttribute("aria-label", `${it.nom} : voir la fiche`);
      b.innerHTML = `
        <span class="tile">${it.photos[0]
          ? `<img src="images/${esc(it.photos[0])}" alt="${esc(it.nom)}" loading="lazy" width="640" height="800">`
          : `<span class="ph-empty"><svg class="ic"><use href="#i-flower"/></svg>Photo à venir</span>`}
          <span class="tile-more" aria-hidden="true"><svg class="ic"><use href="#i-plus"/></svg></span></span>
        <span class="rail-meta"><span>${esc((cats[it.categorie] || {}).titre || "")}</span><span>${esc(prixTxt(it.prix))}</span></span>
        <strong class="rail-name">${esc(it.nom)}</strong>
        <p>${esc(it.description)}</p>`;
      b.addEventListener("click", () => openSheet(it.ref));
      rail.insertBefore(b, end);
      return b;
    });

    rail.scrollLeft = 0;

    // Filtres
    const fbtns = $$("#filter button");
    fbtns.forEach((btn) => {
      const f = btn.dataset.filter;
      const c = $(".count", btn);
      if (c) c.textContent = f === "all" ? data.length : data.filter((i) => i.categorie === f).length;
      btn.addEventListener("click", () => {
        fbtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        cards.forEach((card) => { card.hidden = !(f === "all" || card.dataset.cat === f); });
        rail.scrollTo({ left: 0, behavior: reduceMotion ? "auto" : "smooth" });
        updateRail();
      });
    });

    // Flèches + barre d'avancement
    const prev = $("#rail-prev"), next = $("#rail-next"), bar = $("#rail-progress i");
    const step = () => { const c = cards.find((x) => !x.hidden); return c ? c.getBoundingClientRect().width + 20 : 320; };
    function updateRail() {
      const max = rail.scrollWidth - rail.clientWidth;
      const p = max > 0 ? rail.scrollLeft / max : 1;
      if (bar) bar.style.transform = `scaleX(${Math.max(0.12, rail.clientWidth / rail.scrollWidth + p * (1 - rail.clientWidth / rail.scrollWidth)).toFixed(3)})`;
      if (prev) prev.disabled = rail.scrollLeft < 8;
      if (next) next.disabled = rail.scrollLeft > max - 8;
    }
    if (prev) prev.addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }));
    if (next) next.addEventListener("click", () => rail.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }));
    rail.addEventListener("scroll", updateRail, { passive: true });
    window.addEventListener("resize", updateRail);
    updateRail();
  }

  /* ========== FICHE CRÉATION (accueil) ==========
     Sur la page catalogue, c'est catalogue.js qui gère la fiche. */
  const sheet = $("#cat-modal");
  const sheetHere = sheet && !$("#catalogue-root");
  let lastFocus = null;
  let sheetRef = null;
  const sheetList = () => { const v = $$(".rail-card").filter((c) => !c.hidden).map((c) => c.dataset.ref); return v.length ? v : data.map((i) => i.ref); };
  const sheetGo = (d) => { const l = sheetList(); const i = l.indexOf(sheetRef); openSheet(l[(i + d + l.length) % l.length], true); };
  function openSheet(ref, swap = false) {
    const it = data.find((i) => i.ref === ref);
    if (!sheetHere || !it) return;
    if (!swap) lastFocus = document.activeElement;
    sheetRef = ref;
    const l = sheetList();
    $(".cm-count", sheet).textContent = `${l.indexOf(ref) + 1} / ${l.length}`;
    $(".cm-main", sheet).classList.remove("zoomed");
    $(".cm-cat", sheet).textContent = (cats[it.categorie] || {}).titre || "";
    $(".cm-ref", sheet).textContent = it.ref;
    $(".cm-title", sheet).textContent = it.nom;
    $(".cm-desc", sheet).textContent = it.description;
    $(".cm-price", sheet).textContent = prixTxt(it.prix);
    $(".cm-details", sheet).innerHTML = it.details.map((d) => `<li><svg class="ic"><use href="#i-check"/></svg>${esc(d)}</li>`).join("");
    $(".cm-main", sheet).innerHTML = it.photos[0] ? `<img src="images/${esc(it.photos[0])}" alt="${esc(it.nom)}">` : "";
    $(".cm-order", sheet).dataset.order = label(it);
    if (swap) return;
    sheet.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add("open")));
    document.body.classList.add("no-scroll");
    $(".cm-close", sheet).focus();
  }
  function closeSheet() {
    if (!sheetHere || sheet.hidden) return;
    sheet.classList.remove("open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => { sheet.hidden = true; }, reduceMotion ? 0 : 320);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  if (sheetHere) {
    $(".cm-close", sheet).addEventListener("click", closeSheet);
    $(".cm-prev", sheet).addEventListener("click", () => sheetGo(-1));
    $(".cm-next", sheet).addEventListener("click", () => sheetGo(1));
    // Loupe : toucher la photo pour zoomer, bouger pour explorer, toucher à nouveau pour revenir
    const main = $(".cm-main", sheet);
    let sw = null;
    const aim = (e) => {
      const r = main.getBoundingClientRect(); const img = $("img", main);
      if (img) img.style.transformOrigin = `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}% ${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`;
    };
    main.addEventListener("pointerdown", (e) => { sw = { x: e.clientX, y: e.clientY, moved: false }; });
    main.addEventListener("pointermove", (e) => {
      if (sw && (Math.abs(e.clientX - sw.x) > 10 || Math.abs(e.clientY - sw.y) > 10)) sw.moved = true;
      if (main.classList.contains("zoomed")) aim(e);
    });
    main.addEventListener("pointerup", (e) => {
      if (!sw) return;
      const dx = e.clientX - sw.x, dy = e.clientY - sw.y, moved = sw.moved; sw = null;
      if (main.classList.contains("zoomed")) { if (!moved) main.classList.remove("zoomed"); return; }
      if (moved && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) return sheetGo(dx < 0 ? 1 : -1);
      if (!moved) { aim(e); main.classList.add("zoomed"); }
    });
    main.addEventListener("pointercancel", () => { sw = null; });
    sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });
    document.addEventListener("keydown", (e) => {
      if (sheet.hidden) return;
      if (e.key === "Escape") closeSheet();
      if (e.key === "ArrowLeft") sheetGo(-1);
      if (e.key === "ArrowRight") sheetGo(1);
      if (e.key === "Tab") { // garde le focus dans la fiche
        const f = $$("button, a[href]", sheet);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ========== PRESTATIONS : la photo suit la ligne survolée ou touchée ========== */
  const svcs = $$(".svc");
  if (svcs.length) {
    const previews = $$(".svc-preview img");
    const setSvc = (n) => {
      svcs.forEach((s, k) => { s.classList.toggle("active", k === n); s.setAttribute("aria-pressed", String(k === n)); });
      previews.forEach((p, k) => p.classList.toggle("active", k === n));
    };
    svcs.forEach((s, k) => {
      s.addEventListener("mouseenter", () => setSvc(k));
      s.addEventListener("focus", () => setSvc(k));
      s.addEventListener("click", () => setSvc(k));
    });
  }

  /* ========== BARRE MOBILE « COMMANDER » ========== */
  const mbar = $("#mbar");
  const hero = $(".hero");
  const contact = $("#contact");
  if (mbar && hero && contact && "IntersectionObserver" in window) {
    document.body.classList.add("has-mbar");
    let pastHero = false, inContact = false;
    const sync = () => mbar.classList.toggle("show", pastHero && !inContact);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; sync(); }, { threshold: 0.15 }).observe(hero);
    new IntersectionObserver(([e]) => { inContact = e.isIntersecting; sync(); }, { threshold: 0.05 }).observe(contact);
  }

  /* ========== COMPOSITEUR : la création la plus proche de l'idée du visiteur ==========
     Compare les réponses aux champs « categorie » et « couleurs » de catalogue.js. */
  const composer = $("#composer");
  if (composer && data.length) {
    const img = $("#composer-img"), go = $("#composer-go"), custom = $("#composer-custom");
    const answers = () => ({
      type: (composer.querySelector('input[name="c-type"]:checked') || {}).value || "",
      colors: $$('input[name="c-color"]:checked', composer).map((i) => i.value),
      occasion: (composer.querySelector('input[name="c-occasion"]:checked') || {}).value || "",
    });
    let shown = null;
    const update = () => {
      const a = answers();
      const score = (it) => (a.type && it.categorie === a.type ? 3 : 0) + a.colors.filter((c) => (it.couleurs || []).includes(c)).length;
      const best = data.slice().sort((x, y) => score(y) - score(x))[0];
      const common = a.colors.filter((c) => (best.couleurs || []).includes(c));
      $(".composer-name", composer).textContent = best.nom;
      $(".composer-why", composer).textContent = common.length
        ? `${best.description} On y retrouve vos couleurs : ${common.join(", ").toLowerCase()}.`
        : best.description;
      go.dataset.order = label(best);
      if (shown !== best.ref) {
        shown = best.ref;
        img.classList.add("swap");
        setTimeout(() => { img.src = "images/" + best.photos[0]; img.alt = best.nom; img.classList.remove("swap"); }, reduceMotion ? 0 : 220);
      }
    };
    const extra = () => { const a = answers(); return { occasion: a.occasion, colors: a.colors }; };
    go.mbExtra = extra; custom.mbExtra = extra;
    composer.addEventListener("change", update);
    update();
  }

  /* ========== PROFONDEUR AU DÉFILEMENT + ÉTAPES QUI S'ALLUMENT ========== */
  const pEls = reduceMotion ? [] : $$("[data-parallax]");
  const stepsEl = $("#steps");
  const stepEls = stepsEl ? $$(".step", stepsEl) : [];
  let ticking = false;
  const frameTick = () => {
    ticking = false;
    const vh = window.innerHeight;
    pEls.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      el.style.setProperty("--py", `${((r.top + r.height / 2 - vh / 2) * Number(el.dataset.parallax)).toFixed(1)}px`);
    });
    if (stepsEl) {
      const r = stepsEl.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.3)));
      stepsEl.style.setProperty("--p", p.toFixed(3));
      stepEls.forEach((st, i) => st.classList.toggle("reached", p > 0.02 && p >= i / stepEls.length));
    }
  };
  if (pEls.length || stepsEl) {
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(frameTick); } }, { passive: true });
    window.addEventListener("resize", frameTick);
    frameTick();
  }

  /* ========== PLUIE DE PÉTALES quand une demande est bien enregistrée ========== */
  document.addEventListener("mb:sent", () => {
    if (reduceMotion) return;
    const cv = document.createElement("canvas");
    cv.className = "petals"; cv.setAttribute("aria-hidden", "true");
    document.body.appendChild(cv);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = (cv.width = window.innerWidth * dpr), H = (cv.height = window.innerHeight * dpr);
    const ctx = cv.getContext("2d");
    const colors = ["#B88A98", "#EBD6D8", "#7B3A4A", "#F1C9D0", "#ffffff"];
    const ps = Array.from({ length: 70 }, () => ({
      x: Math.random() * W, y: -Math.random() * H * 0.6, r: (6 + Math.random() * 9) * dpr,
      vy: (1.6 + Math.random() * 2.6) * dpr, vx: (Math.random() - 0.5) * 1.6 * dpr,
      a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.12, c: colors[(Math.random() * colors.length) | 0],
    }));
    const t0 = performance.now();
    (function draw(t) {
      const k = (t - t0) / 4200;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = k > 0.75 ? Math.max(0, 1 - (k - 0.75) * 4) : 1;
      ps.forEach((p) => {
        p.x += p.vx + Math.sin(p.a) * 0.8 * dpr; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.28); ctx.fill(); ctx.restore();
      });
      if (k < 1) requestAnimationFrame(draw); else cv.remove();
    })(t0);
  });

  /* ========== ANNÉE DU PIED DE PAGE ========== */
  const year = $("#footer-year");
  if (year) year.textContent = `© ${new Date().getFullYear()} Maison Bloom - Tous droits réservés.`;
});

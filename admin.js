/* =========================================================
   ESPACE ADMIN — Maison Bloom
========================================================= */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const S = window.MBStore;
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const fmtDate = (iso) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  const fmtDateTime = (iso) => new Date(iso).toLocaleString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  const fmtDay = (d) => (d ? new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }) : "—");
  const daysUntil = (d) => { if (!d) return null; const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((new Date(d + "T00:00:00") - t) / 864e5); };
  const shortReception = { main_propre: "Main propre", envoi: "Envoi postal" };

  // Informations à redemander au client avant de valider une commande
  function missing(o) {
    if (o.type === "question") return [];
    const m = [];
    if (!o.occasion) m.push("occasion");
    if (!o.budget) m.push("budget");
    if (!o.flowers) m.push("type de fleurs");
    if (!o.colors) m.push("couleurs");
    if (o.gifts && !o.gifts_by) m.push("qui fournit les produits");
    if (!o.reception) m.push("mode de réception");
    if (!o.wanted_date) m.push("date");
    if (!o.zip || !o.city) m.push("ville");
    if ((o.contact_pref === "telephone" || o.contact_pref === "whatsapp") && !o.phone) m.push("téléphone");
    return m;
  }
  const longDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // Récapitulatif texte (pour e-mail, WhatsApp, SMS)
  function recapText(o) {
    if (o.type === "question") return `Demande ${o.ref}\n${o.message}`;
    const L = [
      `Commande ${o.ref} - Maison Bloom`,
      `Modèle : ${o.creation || "—"}`,
      o.occasion && `Occasion : ${o.occasion}`,
      o.budget && `Budget : ${o.budget}`,
      o.flowers && `Fleurs : ${o.flowers}`,
      o.colors && `Couleurs : ${o.colors}`,
      o.gifts && `Cadeaux à inclure : ${o.gifts}${o.gifts_by ? ` (${S.GIFTS_BY[o.gifts_by]})` : ""}`,
      o.inscription && `Texte à inscrire : « ${o.inscription} »`,
      o.reception && `Réception : ${S.RECEPTION[o.reception]}`,
      o.wanted_date && `Date : ${longDate(o.wanted_date)}${o.date_flexible ? " (flexible)" : ""}`,
      (o.zip || o.city) && `Lieu : ${o.zip} ${o.city}`.trim(),
      o.message && `Précisions : ${o.message}`,
    ];
    return L.filter(Boolean).join("\n");
  }

  let orders = [];
  let filter = { status: "all", type: "all", q: "" };
  let current = null;

  /* ---------- Toast ---------- */
  let toastT;
  const toast = (txt) => {
    const t = $("#toast");
    t.textContent = txt; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2400);
  };

  /* ---------- Connexion ---------- */
  async function boot() {
    $("#tb-mode").textContent = S.mode === "demo" ? "Démo" : "En ligne";
    $("#tb-mode").classList.toggle("live", S.mode !== "demo");
    let ok = false;
    try { ok = await S.session(); } catch (e) { console.error(e); }
    ok ? showApp() : showLogin();
  }
  function showLogin() {
    $("#app").hidden = true;
    $("#login").hidden = false;
    $("#login-form").hidden = S.mode === "demo";
    $("#login-demo").hidden = S.mode !== "demo";
  }
  async function showApp() {
    $("#login").hidden = true;
    $("#app").hidden = false;
    $("#btn-reset").hidden = S.mode !== "demo";
    const h = new Date().getHours();
    $("#dash-hello").textContent = (h < 18 ? "Bonjour" : "Bonsoir") + " · " + new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    await load();
  }

  $("#demo-enter").addEventListener("click", async () => { await S.signIn(); showApp(); });
  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("button", e.target); btn.disabled = true;
    $("#login-msg").textContent = "";
    const r = await S.signIn($("#l-email").value.trim(), $("#l-pass").value);
    btn.disabled = false;
    if (r.ok) { $("#l-pass").value = ""; showApp(); } else $("#login-msg").textContent = r.error;
  });
  $("#btn-logout").addEventListener("click", async () => { await S.signOut(); closeDrawer(); showLogin(); });

  /* ---------- Données ---------- */
  async function load() {
    try {
      orders = await S.list();
    } catch (e) {
      console.error(e);
      toast("Impossible de charger les commandes.");
      orders = [];
    }
    render();
    if (current) {
      const fresh = orders.find((o) => o.id === current.id);
      fresh ? fillDrawer(fresh) : closeDrawer();
    }
  }
  $("#btn-refresh").addEventListener("click", async () => { await load(); toast("Liste actualisée"); });
  $("#btn-reset").addEventListener("click", async () => { await S.reset(); closeDrawer(); await load(); toast("Démo réinitialisée"); });

  // Démo : si une commande est passée dans un autre onglet, on l'affiche
  window.addEventListener("storage", (e) => { if (e.key === "mb-orders-v2" && !$("#app").hidden) load(); });
  // Production : actualisation automatique toutes les 60 secondes
  if (S.mode !== "demo") setInterval(() => { if (!$("#app").hidden && !document.hidden) load(); }, 60000);

  /* ---------- Affichage ---------- */
  function render() {
    // compteurs
    const count = (st) => orders.filter((o) => o.status === st).length;
    Object.keys(S.STATUTS).forEach((st) => {
      $$(`[data-n="${st}"]`).forEach((el) => (el.textContent = count(st)));
      $$(`[data-c="${st}"]`).forEach((el) => (el.textContent = count(st) || ""));
    });
    $$('[data-c="all"]').forEach((el) => (el.textContent = orders.length));

    // filtres
    const q = filter.q.toLowerCase();
    const list = orders.filter((o) =>
      (filter.status === "all" || o.status === filter.status) &&
      (filter.type === "all" || o.type === filter.type) &&
      (!q || [o.ref, o.name, o.instagram, o.email, o.phone, o.creation, o.occasion, o.city, o.zip, o.gifts, o.inscription, o.message].join(" ").toLowerCase().includes(q))
    );

    $("#rows").innerHTML = list.map((o) => {
      const dd = daysUntil(o.wanted_date);
      const urgent = dd !== null && dd >= 0 && dd <= 3 && !["livree", "annulee"].includes(o.status);
      return `
      <tr data-id="${o.id}" tabindex="0" class="${o.status === "nouvelle" ? "is-new" : ""}">
        <td data-l="N°"><span class="ref">${esc(o.ref)}</span>${o.type === "question" ? '<span class="chip-q">Question</span>' : ""}</td>
        <td data-l="Reçue le">${fmtDate(o.created_at)}</td>
        <td data-l="Client"><strong>${esc(o.name)}</strong><small>${esc(o.instagram || o.email)}</small></td>
        <td data-l="Création">${o.type === "question" ? `<span class="muted">${esc(o.message.slice(0, 60))}${o.message.length > 60 ? "…" : ""}</span>` : `${esc(o.creation || "—")}${o.occasion ? `<small>${esc(o.occasion)}${o.photos && o.photos.length ? ` · ${o.photos.length} photo${o.photos.length > 1 ? "s" : ""}` : ""}</small>` : ""}`}${missing(o).length ? `<span class="chip-miss" title="Informations manquantes : ${esc(missing(o).join(", "))}">${missing(o).length} info${missing(o).length > 1 ? "s" : ""} manquante${missing(o).length > 1 ? "s" : ""}</span>` : ""}</td>
        <td data-l="Budget">${esc(o.budget || "—")}</td>
        <td data-l="Réception">${esc(shortReception[o.reception] || "—")}</td>
        <td data-l="Pour le">${o.wanted_date ? `<span class="${urgent ? "urgent" : ""}">${fmtDay(o.wanted_date)}${urgent ? (dd === 0 ? " · aujourd'hui" : ` · J-${dd}`) : ""}</span>` : "—"}</td>
        <td data-l="Statut"><span class="badge b-${o.status}">${esc(S.STATUTS[o.status])}</span></td>
      </tr>`;
    }).join("");
    $("#empty").hidden = list.length > 0;
    $("#orders").hidden = list.length === 0;

    // états actifs
    $$("#tabs button").forEach((b) => b.classList.toggle("active", b.dataset.status === filter.status));
    $$(".stat").forEach((b) => b.classList.toggle("active", b.dataset.status === filter.status));
  }

  $$("#tabs button, .stat").forEach((b) => b.addEventListener("click", () => {
    filter.status = b.classList.contains("stat") && filter.status === b.dataset.status ? "all" : b.dataset.status;
    render();
  }));
  $("#f-type").addEventListener("change", (e) => { filter.type = e.target.value; render(); });
  $("#q").addEventListener("input", (e) => { filter.q = e.target.value.trim(); render(); });

  const openFromRow = (tr) => { const o = orders.find((x) => x.id === Number(tr.dataset.id)); if (o) openDrawer(o); };
  $("#rows").addEventListener("click", (e) => { const tr = e.target.closest("tr"); if (tr) openFromRow(tr); });
  $("#rows").addEventListener("keydown", (e) => { if (e.key === "Enter") { const tr = e.target.closest("tr"); if (tr) openFromRow(tr); } });

  /* ---------- Fiche commande ---------- */
  const drawer = $("#drawer");
  let lastFocus = null;

  function fillDrawer(o) {
    current = o;
    $("#d-type").textContent = o.type === "question" ? "Question" : "Commande";
    $("#d-ref").textContent = o.ref;
    $("#d-date").textContent = "Reçue le " + fmtDateTime(o.created_at);
    $("#d-name").textContent = o.name;
    $("#d-email").textContent = o.instagram || o.email;
    $("#d-contact-ic use").setAttribute("href", o.instagram ? "#i-instagram" : "#i-mail");
    $("#d-phone").textContent = o.phone || "";
    $("#d-phone-line").hidden = !o.phone;
    $("#d-pref").textContent = o.contact_pref ? "Préfère être recontacté(e) par " + ({ instagram: "message privé Instagram", email: "e-mail", telephone: "téléphone", whatsapp: "WhatsApp" }[o.contact_pref] || "") : "";
    $("#d-pref").hidden = !o.contact_pref;
    const isQ = o.type === "question";
    ["#d-order-block", "#d-perso-block", "#d-reception-block"].forEach((id) => ($(id).hidden = isQ));
    const grid = (rows) => rows.map(([k, v]) => `<dt>${k}</dt><dd>${v ? esc(v) : '<span class="d-empty">Non précisé</span>'}</dd>`).join("");
    if (!isQ) {
      $("#d-creation-grid").innerHTML = grid([["Modèle", o.creation], ["Occasion", o.occasion], ["Budget", o.budget], ["Fleurs", o.flowers], ["Couleurs", o.colors]]);
      $("#d-perso-grid").innerHTML = grid([["Cadeaux à inclure", o.gifts], ["Fournis par", o.gifts ? S.GIFTS_BY[o.gifts_by] : ""], ["Texte à inscrire", o.inscription ? `« ${o.inscription} »` : ""]]);
      $("#d-reception-grid").innerHTML = grid([["Mode", S.RECEPTION[o.reception]], ["Date", o.wanted_date ? longDate(o.wanted_date) + (o.date_flexible ? " · flexible" : "") : ""], ["Lieu", `${o.zip || ""} ${o.city || ""}`.trim()]]);
    }
    const miss = missing(o);
    $("#d-missing").hidden = !miss.length;
    $("#d-missing").innerHTML = miss.length ? `<strong>À confirmer avec le client :</strong> ${esc(miss.join(", "))}.` : "";
    $("#d-message-title").textContent = isQ ? "Question du client" : "Précisions du client";
    $("#d-message-block").hidden = !o.message;
    $("#d-message").textContent = o.message;
    const ph = $("#d-photos");
    ph.innerHTML = "";
    if (!isQ && o.photos && o.photos.length) {
      ph.innerHTML = '<p class="d-sub">Photos d\'inspiration</p><div class="d-ph-list">' + o.photos.map(() => '<span class="d-ph-load"></span>').join("") + "</div>";
      S.photoUrls(o).then((urls) => {
        if (current !== o) return;
        $(".d-ph-list", ph).innerHTML = urls.map((u, i) => `<button class="d-ph" data-src="${esc(u)}" aria-label="Agrandir la photo ${i + 1}"><img src="${esc(u)}" alt=""></button>`).join("");
      });
    }
    $("#d-note").value = o.note || "";
    $("#d-saved").textContent = "";
    $("#d-status").innerHTML = Object.entries(S.STATUTS).map(([k, v]) =>
      `<button class="st st-${k} ${o.status === k ? "active" : ""}" data-st="${k}">${esc(v)}</button>`).join("");
    const subject = encodeURIComponent(`Votre ${o.type === "question" ? "demande" : "commande"} ${o.ref} - Maison Bloom`);
    const body = encodeURIComponent(o.type === "question"
      ? `Bonjour ${o.name},\n\nMerci pour votre message.\n\n\n\nMaison Bloom`
      : `Bonjour ${o.name},\n\nMerci pour votre commande ! Voici le récapitulatif de votre demande :\n\n${recapText(o)}\n\n${miss.length ? "Pour finaliser, pourriez-vous me préciser : " + miss.join(", ") + " ?\n\n" : ""}Prix : \nAcompte : \n\nMaison Bloom`);
    if (o.instagram) {
      // Instagram ne permet pas de préremplir un message : on copie le récapitulatif avant d'ouvrir la conversation
      $("#d-reply").href = `https://www.instagram.com/${encodeURIComponent(o.instagram.slice(1))}/`;
      $("#d-reply-txt").textContent = "Répondre sur Instagram";
      $("#d-reply use").setAttribute("href", "#i-instagram");
    } else {
      $("#d-reply").href = `mailto:${encodeURIComponent(o.email)}?subject=${subject}&body=${body}`;
      $("#d-reply-txt").textContent = "Répondre par e-mail";
      $("#d-reply use").setAttribute("href", "#i-mail");
    }
    $("#d-confirm").hidden = true;
  }
  function openDrawer(o) {
    lastFocus = document.activeElement;
    fillDrawer(o);
    $("#drawer-bg").hidden = false;
    requestAnimationFrame(() => { drawer.classList.add("open"); $("#drawer-bg").classList.add("open"); });
    drawer.setAttribute("aria-hidden", "false"); drawer.inert = false;
    document.body.style.overflow = "hidden";
    $("#d-close").focus();
  }
  function closeDrawer() {
    if (!drawer.classList.contains("open")) { current = null; return; }
    drawer.classList.remove("open"); $("#drawer-bg").classList.remove("open");
    drawer.setAttribute("aria-hidden", "true"); drawer.inert = true;
    document.body.style.overflow = "";
    setTimeout(() => ($("#drawer-bg").hidden = true), 300);
    current = null;
    if (lastFocus) lastFocus.focus();
  }
  $("#d-close").addEventListener("click", closeDrawer);
  $("#drawer-bg").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const pv = $("#photo-view");
    if (!pv.hidden) pv.hidden = true; else closeDrawer();
  });

  // Changement de statut
  $("#d-status").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-st]");
    if (!b || !current || b.dataset.st === current.status) return;
    const st = b.dataset.st;
    try {
      await S.update(current.id, { status: st });
      current.status = st;
      const o = orders.find((x) => x.id === current.id); if (o) o.status = st;
      fillDrawer(current); render();
      toast(`${current.ref} : ${S.STATUTS[st]}`);
    } catch (err) { console.error(err); toast("Erreur : statut non modifié."); }
  });

  // Note interne (enregistrement automatique)
  let noteT;
  $("#d-note").addEventListener("input", (e) => {
    if (!current) return;
    const id = current.id, val = e.target.value;
    $("#d-saved").textContent = "…";
    clearTimeout(noteT);
    noteT = setTimeout(async () => {
      try {
        await S.update(id, { note: val });
        const o = orders.find((x) => x.id === id); if (o) o.note = val;
        $("#d-saved").textContent = "Note enregistrée";
      } catch (err) { console.error(err); $("#d-saved").textContent = "Erreur d'enregistrement"; }
    }, 600);
  });

  // Copier e-mail / téléphone
  $$(".d-copy").forEach((b) => b.addEventListener("click", async () => {
    const txt = $("#" + b.dataset.copy).textContent;
    try { await navigator.clipboard.writeText(txt); toast("Copié : " + txt); }
    catch (e) { toast("Copie impossible, sélectionnez le texte."); }
  }));

  // Suppression
  $("#d-delete").addEventListener("click", () => ($("#d-confirm").hidden = false));
  $("#d-cancel").addEventListener("click", () => ($("#d-confirm").hidden = true));
  $("#d-confirm-yes").addEventListener("click", async () => {
    if (!current) return;
    const r = current.ref;
    try { await S.remove(current.id, current.photos || []); closeDrawer(); await load(); toast(`${r} supprimée`); }
    catch (e) { console.error(e); toast("Erreur : suppression impossible."); }
  });

  // Copier le récapitulatif
  $("#d-copy-recap").addEventListener("click", async () => {
    if (!current) return;
    try { await navigator.clipboard.writeText(recapText(current)); toast("Récapitulatif copié"); }
    catch (e) { toast("Copie impossible sur cet appareil."); }
  });

  // Agrandir une photo d'inspiration
  const pv = $("#photo-view");
  $("#d-photos").addEventListener("click", (e) => {
    const b = e.target.closest(".d-ph");
    if (!b) return;
    $("img", pv).src = b.dataset.src; pv.hidden = false;
  });
  pv.addEventListener("click", () => (pv.hidden = true));

  boot();
})();

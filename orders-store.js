/* =========================================================
   STOCKAGE DES COMMANDES — Maison Bloom
   Un seul endroit qui sait où sont rangées les commandes :
   - mode "demo"     : dans le navigateur (localStorage)
   - mode "supabase" : dans la base de données Supabase
   Le site et l'espace admin utilisent uniquement MBStore.
========================================================= */
(function () {
  const cfg = window.MB_CONFIG || {};
  const MODE = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY ? "supabase" : "demo";
  const KEY = "mb-orders-v2";

  const STATUTS = {
    nouvelle: "Nouvelle",
    en_cours: "En préparation",
    prete: "Prête",
    livree: "Livrée",
    annulee: "Annulée",
  };
  const RECEPTION = {
    main_propre: "Remise en main propre (Île-de-France)",
    envoi: "Envoi postal (toute la France)",
  };

  const GIFTS_BY = { maison_bloom: "Maison Bloom s'en occupe", client: "Fournis par le client", a_voir: "À voir ensemble" };
  const CONTACT = { instagram: "Instagram", email: "E-mail", telephone: "Téléphone", whatsapp: "WhatsApp" };

  const ref = (id) => "CMD-" + String(id).padStart(4, "0");
  const clean = (v, max) => String(v == null ? "" : v).trim().slice(0, max);

  // Garde uniquement les champs autorisés, avec une longueur maximale
  function sanitize(o) {
    const pick = (v, list) => (list.includes(v) ? v : "");
    return {
      type: o.type === "question" ? "question" : "commande",
      name: clean(o.name, 80),
      email: clean(o.email, 120),
      instagram: /^@[a-z0-9._]{1,30}$/.test(clean(o.instagram, 31)) ? clean(o.instagram, 31) : "",
      phone: clean(o.phone, 30),
      contact_pref: pick(o.contact_pref, ["instagram", "email", "telephone", "whatsapp"]),
      creation: clean(o.creation, 120),
      occasion: clean(o.occasion, 60),
      budget: clean(o.budget, 40),
      flowers: clean(o.flowers, 40),
      colors: clean(o.colors, 120),
      gifts: clean(o.gifts, 600),
      gifts_by: pick(o.gifts_by, ["maison_bloom", "client", "a_voir"]),
      inscription: clean(o.inscription, 120),
      reception: pick(o.reception, ["main_propre", "envoi"]),
      wanted_date: /^\d{4}-\d{2}-\d{2}$/.test(o.wanted_date || "") ? o.wanted_date : null,
      date_flexible: !!o.date_flexible,
      zip: /^\d{5}$/.test(clean(o.zip, 5)) ? clean(o.zip, 5) : "",
      city: clean(o.city, 80),
      message: clean(o.message, 2000),
    };
  }

  /* ---------------- MODE DÉMO (navigateur) ---------------- */
  let memory = null; // secours si le stockage du navigateur est indisponible
  const readLocal = () => {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; }
    catch (e) { return memory; }
  };
  const writeLocal = (list) => {
    memory = list;
    try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch (e) { return false; }
  };

  // Commandes fictives pour la démonstration (aucune vraie donnée personnelle)
  function demoSeed() {
    const d = (days, h = 10) => { const x = new Date(); x.setDate(x.getDate() - days); x.setHours(h, 12, 0, 0); return x.toISOString(); };
    const f = (days) => { const x = new Date(); x.setDate(x.getDate() + days); return x.toISOString().slice(0, 10); };
    const base = { phone: "", contact_pref: "email", occasion: "", budget: "", flowers: "", colors: "", gifts: "", gifts_by: "", inscription: "", reception: "", wanted_date: null, date_flexible: false, zip: "", city: "", message: "", note: "", photos: [] };
    return [
      { ...base, id: 1, created_at: d(12, 14), type: "commande", status: "livree", name: "Client Démo 1", email: "client1@exemple.fr", phone: "06 00 00 00 01", contact_pref: "whatsapp", creation: "Coffret anniversaire (MB-C01)", occasion: "Anniversaire", budget: "80 à 120 €", flowers: "Artificielles", colors: "Rose, Doré", gifts: "Bougie, coffret de soins, 2 billets de 50 €", gifts_by: "maison_bloom", inscription: "Joyeux 18 ans Léa", reception: "main_propre", wanted_date: f(-5), zip: "93100", city: "Montreuil", message: "Avec ballons chiffres 1 et 8 si possible.", note: "Payé 110 €. Remis le samedi." },
      { ...base, id: 2, created_at: d(7, 18), type: "commande", status: "prete", name: "Client Démo 2", email: "client2@exemple.fr", creation: "Bouquet de lys bleus (MB-B09)", occasion: "Naissance", budget: "50 à 80 €", flowers: "Faites main", colors: "Bleu, Blanc", gifts: "Peluche ours blanc", gifts_by: "maison_bloom", inscription: "Bienvenue Noah", reception: "envoi", wanted_date: f(2), date_flexible: true, zip: "69003", city: "Lyon", note: "Colis à déposer mardi." },
      { ...base, id: 3, created_at: d(4, 11), type: "commande", status: "en_cours", name: "Client Démo 3", email: "client3@exemple.fr", phone: "06 00 00 00 03", contact_pref: "telephone", creation: "Bouquet Make-up (MB-B01)", occasion: "Anniversaire", budget: "80 à 120 €", flowers: "Naturelles", colors: "Rose, Pastel", gifts: "Palette de fards, rouge à lèvres nude, mascara", gifts_by: "client", reception: "main_propre", wanted_date: f(6), zip: "75011", city: "Paris", message: "Je dépose les produits la semaine prochaine." },
      { ...base, id: 4, created_at: d(2, 9), type: "question", status: "nouvelle", name: "Client Démo 4", instagram: "@client.demo4", contact_pref: "instagram", message: "Bonjour, livrez-vous dans le Val-d'Oise ?" },
      { ...base, id: 5, created_at: d(1, 20), type: "commande", status: "nouvelle", name: "Client Démo 5", email: "client5@exemple.fr", phone: "06 00 00 00 05", contact_pref: "whatsapp", creation: "Coffret vitrine (MB-C05)", occasion: "Fête des mères", budget: "120 à 200 €", flowers: "Artificielles", colors: "Rose, Blanc", gifts: "Produits Rituals (crème, gel douche, parfum d'intérieur)", gifts_by: "maison_bloom", inscription: "Pour la meilleure des mamans", reception: "main_propre", wanted_date: f(10), zip: "94200", city: "Ivry-sur-Seine" },
      { ...base, id: 6, created_at: d(0, 8), type: "commande", status: "nouvelle", name: "Client Démo 6", instagram: "@client.demo6", contact_pref: "instagram", creation: "Création sur mesure", occasion: "Mariage", budget: "À définir ensemble", gifts: "Bouteille de champagne", reception: "envoi", wanted_date: f(14), zip: "33000", city: "Bordeaux", message: "Panier cadeau pour un anniversaire de mariage." },
    ].map((o) => ({ ...o, ref: ref(o.id) }));
  }

  const demo = {
    async list() {
      let l = readLocal();
      if (!l) { l = demoSeed(); writeLocal(l); }
      return l.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
    },
    async create(o, photos = []) {
      const l = readLocal() || demoSeed();
      const id = l.reduce((m, x) => Math.max(m, x.id), 0) + 1;
      const row = { ...sanitize(o), id, ref: ref(id), created_at: new Date().toISOString(), status: "nouvelle", note: "",
        photos: photos.slice(0, 3).map((p) => p.dataUrl) };
      l.push(row);
      if (!writeLocal(l)) { row.photos = []; writeLocal(l); } // stockage plein : on garde la commande sans photos
      return row;
    },
    async photoUrls(o) { return o.photos || []; },
    async update(id, patch) {
      const l = readLocal() || [];
      const i = l.findIndex((x) => x.id === id);
      if (i > -1) { l[i] = { ...l[i], ...patch }; writeLocal(l); return l[i]; }
    },
    async remove(id) { writeLocal((readLocal() || []).filter((x) => x.id !== id)); },
    async reset() { writeLocal(demoSeed()); },
    async session() { try { return sessionStorage.getItem("mb-admin-demo") === "1"; } catch (e) { return true; } },
    async signIn() { try { sessionStorage.setItem("mb-admin-demo", "1"); } catch (e) {} return { ok: true }; },
    async signOut() { try { sessionStorage.removeItem("mb-admin-demo"); } catch (e) {} },
  };

  /* ---------------- MODE PRODUCTION (Supabase) ---------------- */
  let client = null;
  function loadSupabase() {
    if (client) return Promise.resolve(client);
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js";
      s.onload = () => { client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY); resolve(client); };
      s.onerror = () => reject(new Error("Impossible de charger Supabase"));
      document.head.appendChild(s);
    });
  }
  const withRef = (r) => ({ ...r, ref: ref(r.id) });

  const supa = {
    async list() {
      const c = await loadSupabase();
      const { data, error } = await c.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(withRef);
    },
    async create(o, photos = []) {
      const c = await loadSupabase();
      // 1) Photos d'inspiration -> dossier privé "inspirations" (le public peut déposer, pas lire)
      const paths = [];
      const folder = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
      for (const [i, p] of photos.slice(0, 3).entries()) {
        const path = `${folder}/${i + 1}.jpg`;
        const { error } = await c.storage.from("inspirations").upload(path, p.blob, { contentType: "image/jpeg" });
        if (!error) paths.push(path);
      }
      // 2) Commande. Le public peut seulement AJOUTER (pas relire) : pas de .select()
      const { error } = await c.from("orders").insert({ ...sanitize(o), photos: paths });
      if (error) throw error;
      return { ok: true };
    },
    async photoUrls(o) {
      if (!o.photos || !o.photos.length) return [];
      const c = await loadSupabase();
      const { data, error } = await c.storage.from("inspirations").createSignedUrls(o.photos, 3600);
      return error ? [] : data.map((d) => d.signedUrl).filter(Boolean);
    },
    async update(id, patch) {
      const c = await loadSupabase();
      const { error } = await c.from("orders").update(patch).eq("id", id);
      if (error) throw error;
    },
    async remove(id, photos = []) {
      const c = await loadSupabase();
      if (photos.length) await c.storage.from("inspirations").remove(photos);
      const { error } = await c.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    async reset() {},
    async session() {
      const c = await loadSupabase();
      const { data } = await c.auth.getSession();
      return !!data.session;
    },
    async signIn(email, password) {
      const c = await loadSupabase();
      const { error } = await c.auth.signInWithPassword({ email, password });
      return error ? { ok: false, error: "E-mail ou mot de passe incorrect." } : { ok: true };
    },
    async signOut() { const c = await loadSupabase(); await c.auth.signOut(); },
  };

  window.MBStore = { mode: MODE, STATUTS, RECEPTION, GIFTS_BY, CONTACT, ...(MODE === "supabase" ? supa : demo) };
})();

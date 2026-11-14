/* =========================================================
   CONFIGURATION MAISON BLOOM
   ---------------------------------------------------------
   Laissez ces deux valeurs VIDES  -> mode DÉMO
     (les commandes sont gardées dans le navigateur uniquement).
   Remplissez-les                  -> mode PRODUCTION
     (les commandes sont enregistrées dans Supabase et
      l'espace admin demande une vraie connexion).

   Où les trouver : Supabase > Project Settings > API
   - SUPABASE_URL      = "Project URL"
   - SUPABASE_ANON_KEY = clé "anon public"
   La clé "anon" peut être publique : la sécurité est assurée
   par les règles RLS (voir supabase/schema.sql).
   ⚠️ Ne mettez JAMAIS la clé "service_role" ici.
========================================================= */
window.MB_CONFIG = {
  SUPABASE_URL: "https://raopwggqyarqzrqfqnmf.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_o4t3rZP67Ycd6T1XH-KzbA_nnueFYq_", // clé publique (publishable), faite pour être visible

  /* Alerte e-mail à chaque demande, via le compte EmailJS de Maison Bloom
     (le même que l'ancien site). Valeurs publiques, faites pour être visibles.
     Pour changer l'adresse qui reçoit les alertes : emailjs.com > Email Templates. */
  EMAILJS_PUBLIC_KEY: "f9p2Tz6H-4TvJic2G",
  EMAILJS_SERVICE: "service_iihmg93",
  EMAILJS_TEMPLATE: "template_0428i45",
};

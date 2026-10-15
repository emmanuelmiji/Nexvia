// Nexvia RDC – API des comptes, des commerces, des abonnements et de l'administration.
// Les routes /api/vue et /api/demande (statistiques anonymes) restent dans leurs propres fichiers.
import * as C from "../_lib/core.js";
const { json, refuse, texte, lireJson, PLANS } = C;

export async function onRequest({ request, env }) {
  try { return await router(request, env); }
  catch (e) {
    if (e instanceof C.Erreur) return json({ ok: false, erreur: e.message }, e.status);
    console.error("nexvia-api", e && e.stack || e);
    return json({ ok: false, erreur: "Erreur du serveur. Réessayez dans un instant." }, 500);
  }
}

const exigerUser = async (request, env) => { const u = await C.utilisateur(request, env); if (!u) refuse("Connexion requise.", 401); return u; };
const exigerAdmin = async (request, env) => { const u = await exigerUser(request, env); if (!u.admin) refuse("Accès réservé à l'administrateur.", 403); return u; };
const ent = v => { const n = Number(v); if (!Number.isInteger(n) || n < 1) refuse("Identifiant invalide."); return n; };
const pub = u => u && { id: u.id, email: u.email, nom: u.nom, type: u.type, admin: !!u.admin };

async function router(request, env) {
  const url = new URL(request.url), m = request.method;
  const chemin = url.pathname.replace(/^\/api\//, "").replace(/\/+$/, "");
  if (m === "POST") {
    if (request.headers.get("x-nx") !== "1") refuse("Requête refusée.", 403);
    const o = request.headers.get("origin"); if (o && o !== url.origin) refuse("Requête refusée.", 403);
  }
  const ctx = { request, env, url, ip: request.headers.get("cf-connecting-ip") || "local" };
  let mph = chemin.match(/^photo\/(\d+)$/);
  if (m === "GET" && mph) return lirePhoto(ctx, Number(mph[1]));
  const h = ROUTES[m + " " + chemin];
  if (!h) refuse("Introuvable.", 404);
  return h(ctx);
}

const ROUTES = {
  "GET plans": async () => json({ ok: true, plans: PLANS, total_avec_frais: C.TOTAL_AVEC_FRAIS, duree_jours: C.DUREE_JOURS, categories: C.CATEGORIES }),
  "POST auth/inscription": inscription,
  "POST auth/connexion": connexion,
  "POST auth/deconnexion": async ({ request, env }) => { await C.finSession(request, env); return json({ ok: true }, 200, { "set-cookie": C.cookieVide() }); },
  "GET auth/moi": moi,
  "GET commerce/etat": etatCommerce,
  "POST commerce/marque": creerMarque,
  "POST commerce/formule": choisirFormule,
  "POST commerce/adresse": sauverAdresse,
  "POST commerce/adresse/supprimer": supprimerAdresse,
  "POST commerce/photo": ajouterPhoto,
  "POST commerce/photo/supprimer": supprimerPhoto,
  "POST commerce/paiement": demanderPaiement,
  "GET admin/file": fileAdmin,
  "POST admin/marque": adminMarque,
  "POST admin/adresse": adminAdresse,
  "POST admin/activer": adminActiver,
  "POST admin/rejeter": adminRejeter,
  "POST admin/import": adminImport,
  "POST admin/motdepasse": adminMotDePasse,
  "GET public/commerces": publicCommerces,
};

// ---------- comptes ----------
async function moi({ request, env }) {
  const u = await C.utilisateur(request, env);
  if (!u) return json({ ok: true, utilisateur: null });
  const m = await marqueDe(await C.base(env), u.id);
  return json({ ok: true, utilisateur: { ...pub(u), commerce: m ? m.nom : null, commerce_statut: m ? m.statut : null, plan: m ? C.planEffectif(m) : null } });
}
async function inscription({ request, env, ip }) {
  const b = await lireJson(request);
  const email = texte(b.email, 120, true, "e-mail").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) refuse("Adresse e-mail invalide.");
  const mdp = String(b.mot_de_passe || "");
  if (mdp.length < 8 || mdp.length > 100) refuse("Le mot de passe doit contenir au moins 8 caractères.");
  const nom = texte(b.nom, 80, true, "nom"), tel = texte(b.tel, 30);
  const type = b.type === "commerce" ? "commerce" : "utilisateur";
  if (!(await C.limiter(env, "ins:" + ip, 5, 3600))) refuse("Trop de tentatives. Réessayez plus tard.", 429);
  const db = await C.base(env);
  if (await db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first()) refuse("Un compte existe déjà avec cette adresse e-mail.", 409);
  const sel = C.nouveauSel(), hash = await C.hacherMdp(mdp, sel);
  const r = await db.prepare("INSERT INTO users (email, nom, tel, type, pass_hash, pass_salt, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(email, nom, tel, type, hash, sel, new Date().toISOString()).run();
  const cookie = await C.ouvrirSession(env, r.meta.last_row_id);
  const u = { id: r.meta.last_row_id, email, nom, type, admin: C.adminsDe(env).includes(email) };
  return json({ ok: true, utilisateur: u }, 200, { "set-cookie": cookie });
}
async function connexion({ request, env, ip }) {
  const b = await lireJson(request);
  const email = texte(b.email, 120, true, "e-mail").toLowerCase(), mdp = String(b.mot_de_passe || "");
  if (!(await C.limiter(env, "log:" + ip + ":" + email, 8, 900))) refuse("Trop de tentatives. Réessayez dans 15 minutes.", 429);
  const db = await C.base(env);
  const u = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  if (!u || !(await C.mdpValide(mdp, u))) refuse("E-mail ou mot de passe incorrect.", 401);
  const cookie = await C.ouvrirSession(env, u.id);
  u.admin = C.adminsDe(env).includes(email);
  return json({ ok: true, utilisateur: pub(u) }, 200, { "set-cookie": cookie });
}

// ---------- espace commerce ----------
async function marqueDe(db, userId) { return db.prepare("SELECT * FROM marques WHERE owner_id = ?").bind(userId).first(); }
async function etatCommerce({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env);
  const marque = await marqueDe(db, user.id);
  if (!marque) return json({ ok: true, utilisateur: pub(user), marque: null, adresses: [], demandes: [], plans: PLANS, total_avec_frais: C.TOTAL_AVEC_FRAIS, whatsapp: C.WHATSAPP });
  const plan = C.planEffectif(marque);
  const adresses = (await db.prepare("SELECT * FROM adresses WHERE marque_id = ? ORDER BY id").bind(marque.id).all()).results || [];
  const phs = (await db.prepare("SELECT p.id, p.adresse_id FROM photos p JOIN adresses a ON a.id = p.adresse_id WHERE a.marque_id = ? ORDER BY p.id").bind(marque.id).all()).results || [];
  for (const a of adresses) a.photos = phs.filter(p => p.adresse_id === a.id).map(p => p.id);
  const demandes = (await db.prepare("SELECT id, plan, ref, statut, motif, created_at, traite_at FROM demandes_paiement WHERE marque_id = ? ORDER BY id DESC LIMIT 20").bind(marque.id).all()).results || [];
  return json({ ok: true, utilisateur: pub(user), marque: { ...marque, plan_effectif: plan, plan_edition: C.planEdition(marque) }, adresses, demandes, plans: PLANS, total_avec_frais: C.TOTAL_AVEC_FRAIS, whatsapp: C.WHATSAPP });
}
async function creerMarque({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env);
  const b = await lireJson(request), nom = texte(b.nom, 100, true, "nom du commerce ou de la marque");
  if (await marqueDe(db, user.id)) refuse("Vous avez déjà un commerce enregistré sur ce compte.", 409);
  const voulu = PLANS[b.plan] ? b.plan : "gratuit";
  await db.batch([
    db.prepare("INSERT INTO marques (owner_id, nom, plan_souhaite, created_at) VALUES (?, ?, ?, ?)").bind(user.id, nom, voulu, new Date().toISOString()),
    db.prepare("UPDATE users SET type = 'commerce' WHERE id = ?").bind(user.id),
  ]);
  return json({ ok: true });
}
async function choisirFormule({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env), marque = await marqueDe(db, user.id);
  if (!marque) refuse("Créez d'abord votre commerce.", 409);
  const b = await lireJson(request); if (!PLANS[b.plan]) refuse("Choisissez une formule.");
  await db.prepare("UPDATE marques SET plan_souhaite = ? WHERE id = ?").bind(b.plan, marque.id).run();
  return json({ ok: true });
}
const nombreOuNull = (v, min, max) => { if (v === "" || v == null) return null; const n = Number(v); return Number.isFinite(n) && n >= min && n <= max ? n : null; };
async function sauverAdresse({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env);
  const marque = await marqueDe(db, user.id); if (!marque) refuse("Créez d'abord votre commerce.", 409);
  const plan = PLANS[C.planEdition(marque)];
  const b = await lireJson(request);
  const champs = {
    nom: texte(b.nom, 100, true, "nom de l'adresse"),
    categorie: C.CATEGORIES.includes(b.categorie) ? b.categorie : "autre",
    commune: texte(b.commune, 60),
    adresse: texte(b.adresse, 200, true, "adresse"),
    tel: texte(b.tel, 30, true, "téléphone"),
    horaires: texte(b.horaires, 300),
    description: texte(b.description, 600),
    menu: texte(b.menu, 3000),
    lat: nombreOuNull(b.lat, -90, 90), lng: nombreOuNull(b.lng, -180, 180),
    lieu_existant: texte(b.lieu_existant, 120),
  };
  const chiffres = champs.tel.replace(/\D/g, "");
  if (chiffres.length < 9 || chiffres.length > 15) refuse("Numéro de téléphone invalide.");
  if (b.id) {
    const a = await db.prepare("SELECT * FROM adresses WHERE id = ? AND marque_id = ?").bind(ent(b.id), marque.id).first();
    if (!a) refuse("Adresse introuvable.", 404);
    if (champs.horaires !== (a.horaires || "") && !plan.horaires) refuse("Modifier les horaires demande l'abonnement Standard ou Premium.", 403);
    let menuNb = a.menu_nb, menuMois = a.menu_mois;
    if (champs.menu !== (a.menu || "")) {
      if (plan.menu === 0) refuse("Le menu / la liste de services demande l'abonnement Standard ou Premium.", 403);
      const mois = new Date().toISOString().slice(0, 7);
      if (menuMois !== mois) { menuMois = mois; menuNb = 0; }
      if (menuNb >= plan.menu) refuse("Limite atteinte : " + plan.menu + " modification(s) du menu par mois avec la formule " + plan.nom + ".", 403);
      menuNb++;
    }
    let statut = a.statut, code = a.code, verif = a.tel_verifie;
    if (a.statut === "validee" && (champs.nom !== a.nom || champs.adresse !== a.adresse || champs.tel !== a.tel)) { statut = "en_attente"; code = C.codeVerif(); verif = 0; }
    await db.prepare("UPDATE adresses SET nom=?, categorie=?, commune=?, adresse=?, tel=?, horaires=?, description=?, menu=?, lat=?, lng=?, lieu_existant=?, statut=?, code=?, tel_verifie=?, menu_mois=?, menu_nb=? WHERE id=?")
      .bind(champs.nom, champs.categorie, champs.commune, champs.adresse, champs.tel, champs.horaires, champs.description, champs.menu, champs.lat, champs.lng, champs.lieu_existant, statut, code, verif, menuMois, menuNb, a.id).run();
    return json({ ok: true, id: a.id, statut });
  }
  const n = (await db.prepare("SELECT COUNT(*) AS n FROM adresses WHERE marque_id = ? AND statut != 'refusee'").bind(marque.id).first()).n;
  if (n >= plan.adresses) refuse("La formule " + plan.nom + " permet " + plan.adresses + " adresse" + (plan.adresses > 1 ? "s" : "") + ". Passez à une formule supérieure pour en ajouter.", 403);
  if (champs.menu && plan.menu === 0) refuse("Le menu / la liste de services demande l'abonnement Standard ou Premium.", 403);
  const r = await db.prepare("INSERT INTO adresses (marque_id, nom, categorie, commune, adresse, tel, horaires, description, menu, lat, lng, lieu_existant, code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(marque.id, champs.nom, champs.categorie, champs.commune, champs.adresse, champs.tel, champs.horaires, champs.description, champs.menu, champs.lat, champs.lng, champs.lieu_existant, C.codeVerif(), new Date().toISOString()).run();
  return json({ ok: true, id: r.meta.last_row_id, statut: "en_attente" });
}
async function supprimerAdresse({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env), marque = await marqueDe(db, user.id);
  const b = await lireJson(request);
  const a = marque && await db.prepare("SELECT id FROM adresses WHERE id = ? AND marque_id = ?").bind(ent(b.id), marque.id).first();
  if (!a) refuse("Adresse introuvable.", 404);
  await db.batch([db.prepare("DELETE FROM photos WHERE adresse_id = ?").bind(a.id), db.prepare("DELETE FROM adresses WHERE id = ?").bind(a.id)]);
  return json({ ok: true });
}

// ---------- photos (réduites côté navigateur, stockées dans la base) ----------
const MIMES = { "image/jpeg": "/9j/", "image/png": "iVBOR", "image/webp": "UklGR" };
async function ajouterPhoto({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env), marque = await marqueDe(db, user.id);
  if (!marque) refuse("Créez d'abord votre commerce.", 409);
  const b = await lireJson(request, 330000);
  const a = await db.prepare("SELECT id FROM adresses WHERE id = ? AND marque_id = ?").bind(ent(b.adresse_id), marque.id).first();
  if (!a) refuse("Adresse introuvable.", 404);
  const mime = String(b.mime || ""), data = String(b.data || "");
  if (!MIMES[mime] || !data.startsWith(MIMES[mime]) || !/^[A-Za-z0-9+/=]+$/.test(data)) refuse("Image non acceptée (JPEG, PNG ou WebP).");
  if (data.length > 260000) refuse("Image trop lourde. Elle est normalement réduite automatiquement : réessayez avec une autre photo.", 413);
  const plan = PLANS[C.planEdition(marque)];
  const n = (await db.prepare("SELECT COUNT(*) AS n FROM photos WHERE adresse_id = ?").bind(a.id).first()).n;
  if (n >= plan.photos) refuse("La formule " + plan.nom + " permet " + plan.photos + " photo" + (plan.photos > 1 ? "s" : "") + " par adresse.", 403);
  const r = await db.prepare("INSERT INTO photos (adresse_id, mime, data, created_at) VALUES (?, ?, ?, ?)").bind(a.id, mime, data, new Date().toISOString()).run();
  return json({ ok: true, id: r.meta.last_row_id });
}
async function supprimerPhoto({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env), marque = await marqueDe(db, user.id);
  const b = await lireJson(request);
  const p = marque && await db.prepare("SELECT p.id FROM photos p JOIN adresses a ON a.id = p.adresse_id WHERE p.id = ? AND a.marque_id = ?").bind(ent(b.id), marque.id).first();
  if (!p) refuse("Photo introuvable.", 404);
  await db.prepare("DELETE FROM photos WHERE id = ?").bind(p.id).run();
  return json({ ok: true });
}
async function lirePhoto({ request, env }, id) {
  const db = await C.base(env);
  const p = await db.prepare("SELECT p.mime, p.data, a.statut, a.marque_id FROM photos p JOIN adresses a ON a.id = p.adresse_id WHERE p.id = ?").bind(id).first();
  if (!p) refuse("Introuvable.", 404);
  let publique = p.statut === "validee";
  if (!publique) {
    const u = await C.utilisateur(request, env);
    const marque = u && await marqueDe(db, u.id);
    if (!u || !(u.admin || (marque && marque.id === p.marque_id))) refuse("Introuvable.", 404);
  }
  const bin = atob(p.data), octets = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) octets[i] = bin.charCodeAt(i);
  return new Response(octets, { headers: { "content-type": p.mime, "cache-control": publique ? "public, max-age=3600" : "private, no-store", "x-content-type-options": "nosniff" } });
}

// ---------- paiement : le commerce saisit sa référence ----------
async function demanderPaiement({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env), marque = await marqueDe(db, user.id);
  if (!marque) refuse("Créez d'abord votre commerce.", 409);
  const b = await lireJson(request);
  const plan = b.plan === "premium" ? "premium" : b.plan === "standard" ? "standard" : refuse("Choisissez une formule.");
  const ref = C.normaliserRef(b.ref);
  if (!C.REF_VALIDE.test(ref)) refuse("Référence invalide. Elle ressemble à ZOLA-QR-123456 : vous la trouverez à la fin du paiement et dans l'e-mail envoyé par Zola (pensez à vérifier les spams).");
  if (!(await C.limiter(env, "pay:" + user.id, 20, 86400))) refuse("Trop de tentatives aujourd'hui. Contactez le service client.", 429);
  const enCours = (await db.prepare("SELECT COUNT(*) AS n FROM demandes_paiement WHERE marque_id = ? AND statut IN ('en_attente','a_verifier')").bind(marque.id).first()).n;
  if (enCours >= 3) refuse("Vous avez déjà plusieurs paiements en cours de vérification. Contactez le service client.", 429);
  if (await db.prepare("SELECT id FROM demandes_paiement WHERE ref = ?").bind(ref).first()) refuse("Cette référence a déjà été utilisée.", 409);
  const r = await db.prepare("INSERT INTO demandes_paiement (marque_id, user_id, plan, ref, created_at) VALUES (?, ?, ?, ?, ?)").bind(marque.id, user.id, plan, ref, new Date().toISOString()).run();
  await C.rapprocher(env, false);
  const d = await db.prepare("SELECT statut, motif FROM demandes_paiement WHERE id = ?").bind(r.meta.last_row_id).first();
  return json({ ok: true, statut: d.statut });
}

// ---------- administration ----------
async function fileAdmin({ request, env }) {
  await exigerAdmin(request, env);
  const db = await C.base(env), tout = async (sql, ...p) => (await db.prepare(sql).bind(...p).all()).results || [];
  const [marques, adresses, averifier, attente, imports, stats] = await Promise.all([
    tout("SELECT m.id, m.nom, m.plan_souhaite, m.created_at, u.email, u.nom AS user_nom, u.tel AS user_tel FROM marques m JOIN users u ON u.id = m.owner_id WHERE m.statut = 'en_attente' ORDER BY m.id"),
    tout("SELECT a.id, a.nom, a.categorie, a.commune, a.adresse, a.tel, a.code, a.tel_verifie, a.lieu_existant, a.horaires, a.description, a.menu, a.created_at, m.nom AS marque_nom, m.statut AS marque_statut, m.plan_souhaite, m.plan, m.plan_fin, u.email, u.tel AS user_tel FROM adresses a JOIN marques m ON m.id = a.marque_id JOIN users u ON u.id = m.owner_id WHERE a.statut = 'en_attente' ORDER BY a.id LIMIT 60"),
    tout("SELECT d.id, d.plan, d.ref, d.motif, d.created_at, d.tentatives, m.nom AS marque_nom, u.email, u.tel AS user_tel FROM demandes_paiement d JOIN marques m ON m.id = d.marque_id JOIN users u ON u.id = d.user_id WHERE d.statut = 'a_verifier' ORDER BY d.id"),
    tout("SELECT d.id, d.plan, d.ref, d.motif, d.created_at, d.tentatives, m.nom AS marque_nom, u.email FROM demandes_paiement d JOIN marques m ON m.id = d.marque_id JOIN users u ON u.id = d.user_id WHERE d.statut = 'en_attente' ORDER BY d.id"),
    tout("SELECT * FROM imports ORDER BY id DESC LIMIT 5"),
    db.prepare("SELECT (SELECT COUNT(*) FROM users) AS comptes, (SELECT COUNT(*) FROM marques) AS marques, (SELECT COUNT(*) FROM adresses WHERE statut = 'validee') AS adresses_validees, (SELECT COUNT(*) FROM marques WHERE plan != 'gratuit' AND plan_fin > ?) AS abonnes").bind(new Date().toISOString()).first(),
  ]);
  if (adresses.length) {
    const ph = await tout("SELECT id, adresse_id FROM photos WHERE adresse_id IN (" + adresses.map(() => "?").join(",") + ") ORDER BY id", ...adresses.map(a => a.id));
    for (const a of adresses) { a.photos = ph.filter(p => p.adresse_id === a.id).map(p => p.id); a.plan_effectif = C.planEffectif(a); }
  }
  return json({ ok: true, marques, adresses, a_verifier: averifier, en_attente: attente, imports, stats, whatsapp: C.WHATSAPP });
}
async function adminMarque({ request, env }) {
  await exigerAdmin(request, env); const db = await C.base(env), b = await lireJson(request);
  const statut = b.action === "valider" ? "validee" : b.action === "refuser" ? "refusee" : refuse("Action inconnue.");
  const r = await db.prepare("UPDATE marques SET statut = ?, note = ? WHERE id = ?").bind(statut, texte(b.note, 300), ent(b.id)).run();
  if (!r.meta.changes) refuse("Introuvable.", 404);
  return json({ ok: true });
}
async function adminAdresse({ request, env }) {
  await exigerAdmin(request, env); const db = await C.base(env), b = await lireJson(request);
  let r;
  if (b.action === "tel_ok") r = await db.prepare("UPDATE adresses SET tel_verifie = 1 WHERE id = ?").bind(ent(b.id)).run();
  else if (b.action === "valider") r = await db.prepare("UPDATE adresses SET statut = 'validee', tel_verifie = 1, note = ? WHERE id = ?").bind(texte(b.note, 300), ent(b.id)).run();
  else if (b.action === "refuser") r = await db.prepare("UPDATE adresses SET statut = 'refusee', note = ? WHERE id = ?").bind(texte(b.note, 300), ent(b.id)).run();
  else refuse("Action inconnue.");
  if (!r.meta.changes) refuse("Introuvable.", 404);
  return json({ ok: true });
}
async function adminActiver({ request, env }) {
  await exigerAdmin(request, env); const db = await C.base(env), b = await lireJson(request);
  const d = await db.prepare("SELECT * FROM demandes_paiement WHERE id = ? AND statut IN ('en_attente','a_verifier')").bind(ent(b.demande_id)).first();
  if (!d) refuse("Demande introuvable ou déjà traitée.", 404);
  const m = await db.prepare("SELECT * FROM marques WHERE id = ?").bind(d.marque_id).first(), now = new Date();
  await db.batch([
    db.prepare("UPDATE marques SET plan = ?, plan_fin = ? WHERE id = ?").bind(d.plan, C.nouvelleFin(m, d.plan, now), d.marque_id),
    db.prepare("UPDATE demandes_paiement SET statut = 'active', motif = 'Activée manuellement', traite_at = ? WHERE id = ?").bind(now.toISOString(), d.id),
  ]);
  return json({ ok: true });
}
async function adminRejeter({ request, env }) {
  await exigerAdmin(request, env); const db = await C.base(env), b = await lireJson(request);
  const r = await db.prepare("UPDATE demandes_paiement SET statut = 'rejetee', motif = ?, traite_at = ? WHERE id = ? AND statut IN ('en_attente','a_verifier')").bind(texte(b.note, 300) || "Rejetée", new Date().toISOString(), ent(b.demande_id)).run();
  if (!r.meta.changes) refuse("Demande introuvable ou déjà traitée.", 404);
  return json({ ok: true });
}
async function adminImport({ request, env }) {
  const admin = await exigerAdmin(request, env);
  const b = await lireJson(request, 2200000);
  return json({ ok: true, ...(await C.importerEtRapprocher(env, b.csv, admin.id)) });
}
async function adminMotDePasse({ request, env }) {
  await exigerAdmin(request, env); const db = await C.base(env), b = await lireJson(request);
  const email = texte(b.email, 120, true, "e-mail").toLowerCase();
  const u = await db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (!u) refuse("Aucun compte avec cet e-mail.", 404);
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const tmp = [...crypto.getRandomValues(new Uint8Array(10))].map(x => alphabet[x % alphabet.length]).join("");
  const sel = C.nouveauSel(), hash = await C.hacherMdp(tmp, sel);
  await db.batch([db.prepare("UPDATE users SET pass_hash = ?, pass_salt = ? WHERE id = ?").bind(hash, sel, u.id), db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(u.id)]);
  return json({ ok: true, mot_de_passe_temporaire: tmp });
}

// ---------- données publiques pour l'application (badge, photos, menu, placement) ----------
async function publicCommerces({ env }) {
  const db = await C.base(env), now = new Date();
  const rows = (await db.prepare("SELECT a.*, m.plan, m.plan_fin, m.id AS mid FROM adresses a JOIN marques m ON m.id = a.marque_id WHERE a.statut = 'validee' AND m.statut = 'validee' ORDER BY a.marque_id, a.id LIMIT 1000").all()).results || [];
  const phs = (await db.prepare("SELECT p.id, p.adresse_id FROM photos p JOIN adresses a ON a.id = p.adresse_id WHERE a.statut = 'validee' ORDER BY p.id").all()).results || [];
  const parMarque = {}, sortie = [];
  for (const a of rows) {
    const nom = C.planEffectif({ plan: a.plan, plan_fin: a.plan_fin }, now), p = PLANS[nom];
    parMarque[a.mid] = (parMarque[a.mid] || 0) + 1;
    if (parMarque[a.mid] > p.adresses) continue; // au-delà du quota de la formule actuelle
    const photos = phs.filter(x => x.adresse_id === a.id).slice(0, p.photos).map(x => x.id);
    sortie.push({ id: a.id, nom: a.nom, categorie: a.categorie, commune: a.commune, adresse: a.adresse, tel: a.tel, horaires: a.horaires, description: a.description, menu: p.menu ? a.menu : "", lat: a.lat, lng: a.lng, lieu_existant: a.lieu_existant, formule: nom, badge: p.badge, whatsapp: p.whatsapp, haut: p.haut, photos });
  }
  return new Response(JSON.stringify({ ok: true, commerces: sortie }), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300" } });
}

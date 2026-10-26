// Nexvia RDC – API des comptes, des commerces, des abonnements et de l'administration.
// Les routes /api/vue et /api/demande (statistiques anonymes) restent dans leurs propres fichiers.
import * as C from "../_lib/core.js";
import * as Mail from "../_lib/courriel.js";
import * as WA from "../_lib/whatsapp.js";
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
const pub = u => u && { id: u.id, email: u.email, nom: u.nom, type: u.type, identifiant: u.identifiant || null, admin: !!u.admin };

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
  "POST auth/inscription/demande": inscription,
  "POST auth/inscription/confirmer": inscriptionConfirmer,
  "POST auth/connexion": connexion,
  "POST auth/connexion/confirmer": connexionConfirmer,
  "POST auth/code/renvoyer": codeRenvoyer,
  "POST auth/motdepasse": changerMotDePasse,
  "POST admin/test-mail": adminTestMail,
  "GET admin/comptes": adminComptes,
  "POST admin/bannir": adminBannir,
  "POST admin/debannir": adminDebannir,
  "POST admin/supprimer": adminSupprimer,
  "POST admin/recuperation/envoyer": recupEnvoyer,
  "POST admin/recuperation/confirmer": recupConfirmer,
  "POST admin/reclamation": adminReclamation,
  "POST auth/reclamation": reclamationUtilisateur,
  "POST auth/deconnexion": async ({ request, env }) => { await C.finSession(request, env); return json({ ok: true }, 200, { "set-cookie": C.cookieVide() }); },
  "GET auth/moi": moi,
  "GET commerce/etat": etatCommerce,
  "POST commerce/marque": creerMarque,
  "POST commerce/formule": choisirFormule,
  "POST commerce/essai": demarrerEssai,
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
  "GET admin/wa": waListe,
  "GET admin/wa/conv": waConversation,
  "POST admin/wa/repondre": waRepondre,
  "POST admin/wa/statut": waStatut,
};

// ---------- comptes ----------
async function moi({ request, env }) {
  const u = await C.utilisateur(request, env);
  if (!u) return json({ ok: true, utilisateur: null });
  const m = await marqueDe(await C.base(env), u.id);
  return json({ ok: true, utilisateur: { ...pub(u), commerce: m ? m.nom : null, commerce_statut: m ? m.statut : null, plan: m ? C.planEffectif(m) : null } });
}
// --- vérification par e-mail : un code à 6 chiffres, valable 10 minutes, 5 essais, renvoi toutes les 60 s ---
const VALIDITE = 600000, ESSAIS_MAX = 5, ATTENTE_RENVOI = 60000, ENVOIS_MAX = 5;
const masquer = e => { const [l, d] = e.split("@"); return l.slice(0, Math.min(2, l.length)) + "•••@" + d; };
function nouveauCode() { for (;;) { const n = crypto.getRandomValues(new Uint32Array(1))[0]; if (n < 4290000000) return String(n % 1000000).padStart(6, "0"); } }
async function envoyerCode(env, db, { id, email, but, donnees }) {
  const code = nouveauCode(), now = Date.now();
  await db.prepare("DELETE FROM verifs WHERE expire < ?").bind(now - 3600000).run();
  try { await Mail.envoyerCourriel(env, email, "Votre code Nexvia RDC : " + code, Mail.texteCode(code, but)); }
  catch (e) { console.error("nexvia-mail", e && e.message || e); refuse("L'e-mail n'a pas pu être envoyé. Vérifiez l'adresse puis réessayez dans un instant.", 502); }
  const hash = await C.sha256hex(id + ":" + code);
  await db.prepare("INSERT INTO verifs (id, email, but, code_hash, donnees, expire, envoye) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(id, email, but, hash, JSON.stringify(donnees || {}), now + VALIDITE, now).run();
  return { ok: true, etape: "code", vid: id, email_masque: masquer(email), valide_minutes: 10, renvoi_secondes: ATTENTE_RENVOI / 1000 };
}
const nouvelId = () => [...crypto.getRandomValues(new Uint8Array(18))].map(b => b.toString(16).padStart(2, "0")).join("");
async function controlerCode(env, db, b, but) {
  const vid = String(b.vid || ""), code = String(b.code || "").replace(/\s+/g, "");
  if (!/^[0-9a-f]{36}$/.test(vid)) refuse("Demande introuvable. Recommencez.", 404);
  const v = await db.prepare("SELECT * FROM verifs WHERE id = ? AND but = ?").bind(vid, but).first();
  if (!v) refuse("Demande introuvable ou déjà utilisée. Recommencez.", 404);
  if (Date.now() > v.expire) { await db.prepare("DELETE FROM verifs WHERE id = ?").bind(vid).run(); refuse("Ce code a expiré. Demandez-en un nouveau.", 410); }
  if (v.essais >= ESSAIS_MAX) { await db.prepare("DELETE FROM verifs WHERE id = ?").bind(vid).run(); refuse("Trop d'essais. Recommencez pour recevoir un nouveau code.", 429); }
  if (!/^\d{6}$/.test(code)) refuse("Le code contient 6 chiffres.");
  if ((await C.sha256hex(vid + ":" + code)) !== v.code_hash) {
    await db.prepare("UPDATE verifs SET essais = essais + 1 WHERE id = ?").bind(vid).run();
    const reste = ESSAIS_MAX - v.essais - 1;
    refuse(reste > 0 ? "Code incorrect. Il vous reste " + reste + " essai" + (reste > 1 ? "s" : "") + "." : "Code incorrect. Recommencez pour recevoir un nouveau code.", 400);
  }
  await db.prepare("DELETE FROM verifs WHERE id = ?").bind(vid).run();    // un code ne sert qu'une fois
  return { ...v, donnees: JSON.parse(v.donnees || "{}") };
}
async function inscription({ request, env, ip }) {
  const b = await lireJson(request);
  const ve = Mail.verifierEmail(b.email); if (ve.erreur) refuse(ve.erreur);
  const email = ve.email, nom = texte(b.nom, 80, true, "nom"), tel = texte(b.tel, 30);
  const mdp = String(b.mot_de_passe || "");
  if (b.confirmation !== undefined && String(b.confirmation) !== mdp) refuse("Les deux mots de passe ne sont pas identiques.");
  const pb = Mail.verifierMotDePasse(mdp, { email, nom }); if (pb) refuse(pb);
  const type = b.type === "commerce" ? "commerce" : "utilisateur";
  if (!Mail.mailConfigure(env)) refuse("La vérification par e-mail n'est pas encore activée sur Nexvia. L'inscription est momentanément fermée, réessayez bientôt.", 503);
  if (!(await C.limiter(env, "ins:" + ip, 8, 3600)) || !(await C.limiter(env, "insmail:" + email, 5, 3600))) refuse("Trop de tentatives. Réessayez plus tard.", 429);
  const db = await C.base(env);
  if (await db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first()) refuse("Un compte existe déjà avec cette adresse e-mail. Connectez-vous.", 409);
  if (!(await Mail.domaineAccepteLesMails(ve.domaine, env))) refuse("Le domaine « " + ve.domaine + " » ne semble pas pouvoir recevoir d'e-mails. Vérifiez l'adresse.");
  const sel = C.nouveauSel(), hash = await C.hacherMdp(mdp, sel);
  return json(await envoyerCode(env, db, { id: nouvelId(), email, but: "inscription", donnees: { nom, tel, type, hash, sel } }));
}
async function inscriptionConfirmer({ request, env, ip }) {
  const b = await lireJson(request);
  if (!(await C.limiter(env, "cod:" + ip, 40, 900))) refuse("Trop de tentatives. Réessayez plus tard.", 429);
  const db = await C.base(env), v = await controlerCode(env, db, b, "inscription"), d = v.donnees;
  if (await db.prepare("SELECT id FROM users WHERE email = ?").bind(v.email).first()) refuse("Un compte existe déjà avec cette adresse e-mail. Connectez-vous.", 409);
  let r, ident;
  for (let i = 0; ; i++) {
    ident = C.nouvelIdentifiant();
    try { r = await db.prepare("INSERT INTO users (email, nom, tel, type, pass_hash, pass_salt, identifiant, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(v.email, d.nom, d.tel, d.type, d.hash, d.sel, ident, new Date().toISOString()).run(); break; }
    catch (e) { if (i >= 3 || !/identifiant/i.test(String(e && e.message))) throw e; }
  }
  const cookie = await C.ouvrirSession(env, r.meta.last_row_id);
  return json({ ok: true, utilisateur: { id: r.meta.last_row_id, email: v.email, nom: d.nom, type: d.type, identifiant: ident, admin: C.adminsDe(env).includes(v.email) } }, 200, { "set-cookie": cookie });
}
async function connexion({ request, env, ip }) {
  const b = await lireJson(request);
  const email = texte(b.email, 120, true, "e-mail").toLowerCase(), mdp = String(b.mot_de_passe || "");
  if (!(await C.limiter(env, "log:" + ip + ":" + email, 8, 900))) refuse("Trop de tentatives. Réessayez dans 15 minutes.", 429);
  const db = await C.base(env);
  const u = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  if (!u || !(await C.mdpValide(mdp, u))) refuse("E-mail ou mot de passe incorrect.", 401);
  await leverBans(db);
  const ban = await infosBan(db, u.id); if (ban) return json({ ok: true, etape: "banni", ...ban });
  if (env.COMPTE_DEMO_EMAIL && email === String(env.COMPTE_DEMO_EMAIL).trim().toLowerCase() && !C.adminsDe(env).includes(email)) { const cookieDemo = await C.ouvrirSession(env, u.id); u.admin = false; return json({ ok: true, utilisateur: pub(u) }, 200, { "set-cookie": cookieDemo }); }
  // Le mot de passe est bon : si l'envoi d'e-mails est actif, on exige le code reçu par e-mail.
  // (Tant que l'envoi n'est pas configuré, la connexion reste directe, pour ne jamais enfermer l'administrateur dehors.)
  if (Mail.mailConfigure(env)) {
    if (!(await C.limiter(env, "logmail:" + email, 6, 3600))) refuse("Trop de codes demandés pour cette adresse. Réessayez plus tard.", 429);
    return json(await envoyerCode(env, db, { id: nouvelId(), email, but: "connexion", donnees: { uid: u.id } }));
  }
  const cookie = await C.ouvrirSession(env, u.id);
  u.admin = C.adminsDe(env).includes(email);
  return json({ ok: true, utilisateur: pub(u) }, 200, { "set-cookie": cookie });
}
async function connexionConfirmer({ request, env, ip }) {
  const b = await lireJson(request);
  if (!(await C.limiter(env, "cod:" + ip, 40, 900))) refuse("Trop de tentatives. Réessayez plus tard.", 429);
  const db = await C.base(env), v = await controlerCode(env, db, b, "connexion");
  const u = await db.prepare("SELECT * FROM users WHERE id = ? AND email = ?").bind(v.donnees.uid, v.email).first();
  if (!u) refuse("Compte introuvable.", 404);
  await leverBans(db); if (await infosBan(db, u.id)) refuse("Ce compte est suspendu.", 403);
  const cookie = await C.ouvrirSession(env, u.id);
  u.admin = C.adminsDe(env).includes(v.email);
  return json({ ok: true, utilisateur: pub(u) }, 200, { "set-cookie": cookie });
}
async function changerMotDePasse({ request, env, ip }) {
  const u = await exigerUser(request, env), b = await lireJson(request), db = await C.base(env);
  if (!(await C.limiter(env, "mdp:" + u.id, 8, 900))) refuse("Trop de tentatives. Réessayez dans 15 minutes.", 429);
  const ligne = await db.prepare("SELECT * FROM users WHERE id = ?").bind(u.id).first();
  if (!(await C.mdpValide(String(b.ancien || ""), ligne))) refuse("Le mot de passe actuel est incorrect.", 401);
  const nouveau = String(b.nouveau || "");
  if (b.confirmation !== undefined && String(b.confirmation) !== nouveau) refuse("Les deux mots de passe ne sont pas identiques.");
  const pb = Mail.verifierMotDePasse(nouveau, { email: u.email, nom: u.nom }); if (pb) refuse(pb);
  const sel = C.nouveauSel(), hash = await C.hacherMdp(nouveau, sel);
  const jeton = (request.headers.get("cookie") || "").match(/(?:^|; )nx_s=([^;]+)/);
  await db.batch([db.prepare("UPDATE users SET pass_hash = ?, pass_salt = ? WHERE id = ?").bind(hash, sel, u.id), db.prepare("DELETE FROM sessions WHERE user_id = ? AND token_hash != ?").bind(u.id, jeton ? await C.sha256hex(jeton[1]) : "")]);
  return json({ ok: true });
}
async function codeRenvoyer({ request, env, ip }) {
  const b = await lireJson(request), vid = String(b.vid || "");
  if (!(await C.limiter(env, "ren:" + ip, 15, 3600))) refuse("Trop de tentatives. Réessayez plus tard.", 429);
  const db = await C.base(env);
  const v = /^[0-9a-f]{36}$/.test(vid) ? await db.prepare("SELECT * FROM verifs WHERE id = ?").bind(vid).first() : null;
  if (!v) refuse("Demande introuvable. Recommencez.", 404);
  const now = Date.now();
  if (now - v.envoye < ATTENTE_RENVOI) refuse("Patientez " + Math.ceil((ATTENTE_RENVOI - (now - v.envoye)) / 1000) + " secondes avant de redemander un code.", 429);
  if (v.envois >= ENVOIS_MAX) { await db.prepare("DELETE FROM verifs WHERE id = ?").bind(vid).run(); refuse("Trop de codes envoyés. Recommencez depuis le début.", 429); }
  const code = nouveauCode();
  try { await Mail.envoyerCourriel(env, v.email, "Votre code Nexvia RDC : " + code, Mail.texteCode(code, v.but)); }
  catch (e) { console.error("nexvia-mail", e && e.message || e); refuse("L'e-mail n'a pas pu être envoyé. Réessayez dans un instant.", 502); }
  await db.prepare("UPDATE verifs SET code_hash = ?, essais = 0, envois = envois + 1, expire = ?, envoye = ? WHERE id = ?").bind(await C.sha256hex(vid + ":" + code), now + VALIDITE, now, vid).run();
  return json({ ok: true, etape: "code", vid, email_masque: masquer(v.email), valide_minutes: 10, renvoi_secondes: ATTENTE_RENVOI / 1000 });
}
async function adminTestMail({ request, env }) {
  const u = await exigerAdmin(request, env);
  if (!Mail.mailConfigure(env)) refuse("L'envoi d'e-mails n'est pas configuré (MAIL_UTILISATEUR et MAIL_MOT_DE_PASSE manquent).", 503);
  if (!(await C.limiter(env, "testmail:" + u.id, 5, 3600))) refuse("Trop d'essais. Réessayez plus tard.", 429);
  try { await Mail.envoyerCourriel(env, u.email, "Test d'envoi Nexvia RDC", Mail.texteCode("123456", "inscription").replace("Voici votre code pour créer votre compte Nexvia RDC :", "Ceci est un e-mail de test (le code ci-dessous est fictif) :")); }
  catch (e) { refuse("Échec de l'envoi : " + String(e && e.message || e).slice(0, 200), 502); }
  return json({ ok: true, envoye_a: u.email });
}

// ---------- espace commerce ----------
async function marqueDe(db, userId) { return db.prepare("SELECT * FROM marques WHERE owner_id = ?").bind(userId).first(); }
const STAT_ACTIONS = ["vue", "appel", "wa", "itin", "fav"];
async function etatCommerce({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env);
  const marque = await marqueDe(db, user.id);
  if (!marque) return json({ ok: true, utilisateur: pub(user), marque: null, adresses: [], demandes: [], plans: PLANS, essai_jours: C.ESSAI_JOURS, total_avec_frais: C.TOTAL_AVEC_FRAIS, whatsapp: C.WHATSAPP });
  const plan = C.planEffectif(marque);
  const adresses = (await db.prepare("SELECT * FROM adresses WHERE marque_id = ? ORDER BY id").bind(marque.id).all()).results || [];
  const phs = (await db.prepare("SELECT p.id, p.adresse_id, p.type FROM photos p JOIN adresses a ON a.id = p.adresse_id WHERE a.marque_id = ? ORDER BY p.id").bind(marque.id).all()).results || [];
  for (const a of adresses) { a.photos = phs.filter(p => p.adresse_id === a.id && p.type !== "menu").map(p => p.id); a.menu_photos = phs.filter(p => p.adresse_id === a.id && p.type === "menu").map(p => p.id); }
  const demandes = (await db.prepare("SELECT id, plan, ref, statut, motif, created_at, traite_at FROM demandes_paiement WHERE marque_id = ? ORDER BY id DESC LIMIT 20").bind(marque.id).all()).results || [];
  if (PLANS[plan].stats && env.DEMANDES) {            // statistiques de vues et d'appels (Premium)
    const d = new Date(), moisA = d.toISOString().slice(0, 7), moisP = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1)).toISOString().slice(0, 7);
    try {   // les statistiques sont un bonus : si le stockage ne répond pas, la page du compte s'affiche quand même
    await Promise.all(adresses.filter(a => a.statut === "validee").map(async a => {
      const lire = async suf => parseInt((await env.DEMANDES.get("lieu:adr-" + a.id + suf)) || "0", 10) || 0;
      const une = async m => { const o = {}; await Promise.all(STAT_ACTIONS.map(async k => { o[k] = await lire(":" + k + (m ? ":" + m : "")); })); return o; };
      const [ce, prec] = await Promise.all([une(moisA), une(moisP)]);
      a.stats = { ce_mois: ce, mois_dernier: prec };
    }));
    } catch (e) { adresses.forEach(a => { delete a.stats; }); }
  }
  return json({ ok: true, utilisateur: pub(user), marque: { ...marque, plan_effectif: plan, plan_edition: C.planEdition(marque), attente_paiement: C.attentePaiement(marque), en_essai: C.enEssai(marque), essai_disponible: !marque.essai_at, jours_restants: C.joursRestants(marque) }, adresses, demandes, plans: PLANS, essai_jours: C.ESSAI_JOURS, total_avec_frais: C.TOTAL_AVEC_FRAIS, whatsapp: C.WHATSAPP });
}
async function creerMarque({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env);
  const b = await lireJson(request), nom = texte(b.nom, 100, true, "nom de l'adresse");
  if (await marqueDe(db, user.id)) refuse("Vous avez déjà un espace enregistré sur ce compte.", 409);
  const voulu = PLANS[b.plan] ? b.plan : "gratuit";
  await db.batch([
    db.prepare("INSERT INTO marques (owner_id, nom, plan_souhaite, created_at) VALUES (?, ?, ?, ?)").bind(user.id, nom, voulu, new Date().toISOString()),
    db.prepare("UPDATE users SET type = 'commerce' WHERE id = ?").bind(user.id),
  ]);
  return json({ ok: true });
}
async function choisirFormule({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env), marque = await marqueDe(db, user.id);
  if (!marque) refuse("Ajoutez d'abord votre adresse.", 409);
  const b = await lireJson(request); if (!PLANS[b.plan]) refuse("Choisissez une formule.");
  await db.prepare("UPDATE marques SET plan_souhaite = ? WHERE id = ?").bind(b.plan, marque.id).run();
  return json({ ok: true });
}
// Mois d'essai gratuit : active Standard ou Premium pendant ESSAI_JOURS jours, une seule fois par compte et par numéro de téléphone.
async function demarrerEssai({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env), marque = await marqueDe(db, user.id);
  if (!marque) refuse("Ajoutez d'abord votre adresse.", 409);
  const b = await lireJson(request);
  if (b.plan !== "standard" && b.plan !== "premium") refuse("L'essai gratuit est disponible pour Standard et Premium.");
  if (marque.essai_at) refuse("Vous avez déjà profité de votre mois d'essai.", 409);
  if (C.planEffectif(marque) !== "gratuit") refuse("Vous avez déjà une formule active.", 409);
  const fin3 = String(user.tel || "").replace(/\D/g, "").slice(-9);
  if (fin3.length === 9) {
    const autres = (await db.prepare("SELECT u.tel FROM marques m JOIN users u ON u.id = m.owner_id WHERE m.essai_at IS NOT NULL AND m.id != ?").bind(marque.id).all()).results || [];
    if (autres.some(x => String(x.tel || "").replace(/\D/g, "").slice(-9) === fin3)) refuse("Un essai gratuit a déjà été utilisé avec ce numéro de téléphone.", 409);
  }
  const now = new Date(), fin = new Date(now.getTime() + C.ESSAI_JOURS * 86400000).toISOString();
  await db.prepare("UPDATE marques SET plan = ?, plan_fin = ?, plan_souhaite = ?, essai_at = ?, essai_fin = ? WHERE id = ? AND essai_at IS NULL").bind(b.plan, fin, b.plan, now.toISOString(), fin, marque.id).run();
  return json({ ok: true, plan: b.plan, fin });
}
const nombreOuNull = (v, min, max) => { if (v === "" || v == null) return null; const n = Number(v); return Number.isFinite(n) && n >= min && n <= max ? n : null; };
async function sauverAdresse({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env);
  const marque = await marqueDe(db, user.id); if (!marque) refuse("Ajoutez d'abord votre adresse.", 409);
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
    menu: "", // le menu se publie maintenant en photos (voir /api/commerce/photo, type « menu »)
    lat: nombreOuNull(b.lat, -90, 90), lng: nombreOuNull(b.lng, -180, 180),
    lieu_existant: texte(b.lieu_existant, 120),
  };
  const chiffres = champs.tel.replace(/\D/g, "");
  if (chiffres.length < 9 || chiffres.length > 15) refuse("Numéro de téléphone invalide.");
  if (b.id) {
    const a = await db.prepare("SELECT * FROM adresses WHERE id = ? AND marque_id = ?").bind(ent(b.id), marque.id).first();
    if (!a) refuse("Adresse introuvable.", 404);
    champs.menu = a.menu || "";
    if (champs.commune !== (a.commune || "") && !C.COMMUNES_OUVERTES.includes(champs.commune)) refuse(champs.commune ? C.MSG_COMMUNE : "Choisissez la commune de votre adresse.");
    if (champs.horaires !== (a.horaires || "") && champs.horaires && !C.horairesValides(champs.horaires)) refuse("Horaires non reconnus : utilisez le sélecteur d'horaires.");
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
  if (C.attentePaiement(marque)) refuse("Payez d'abord votre formule " + PLANS[marque.plan_souhaite].nom + " pour remplir votre fiche. Vous pouvez aussi choisir la formule Gratuit.", 402);
  const n = (await db.prepare("SELECT COUNT(*) AS n FROM adresses WHERE marque_id = ? AND statut != 'refusee'").bind(marque.id).first()).n;
  if (n >= plan.adresses) refuse("La formule " + plan.nom + " permet " + plan.adresses + " adresse" + (plan.adresses > 1 ? "s" : "") + ". Passez à une formule supérieure pour en ajouter.", 403);
  if (!C.COMMUNES_OUVERTES.includes(champs.commune)) refuse(champs.commune ? C.MSG_COMMUNE : "Choisissez la commune de votre adresse.");
  if (champs.horaires && !C.horairesValides(champs.horaires)) refuse("Horaires non reconnus : utilisez le sélecteur d'horaires.");
  const r = await db.prepare("INSERT INTO adresses (marque_id, nom, categorie, commune, adresse, tel, horaires, description, menu, lat, lng, lieu_existant, code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(marque.id, champs.nom, champs.categorie, champs.commune, champs.adresse, champs.tel, champs.horaires, champs.description, champs.menu, champs.lat, champs.lng, champs.lieu_existant, C.codeVerif(), new Date().toISOString()).run();
  // nom provisoire (formule payée avant la fiche) : le nom de la première adresse le remplace
  if (n === 0 && (marque.nom === "Mon espace" || marque.nom === String(user.nom || "").trim())) await db.prepare("UPDATE marques SET nom = ? WHERE id = ?").bind(champs.nom, marque.id).run();
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
  if (!marque) refuse("Ajoutez d'abord votre adresse.", 409);
  const b = await lireJson(request, 330000);
  const a = await db.prepare("SELECT id FROM adresses WHERE id = ? AND marque_id = ?").bind(ent(b.adresse_id), marque.id).first();
  if (!a) refuse("Adresse introuvable.", 404);
  const mime = String(b.mime || ""), data = String(b.data || "");
  if (!MIMES[mime] || !data.startsWith(MIMES[mime]) || !/^[A-Za-z0-9+/=]+$/.test(data)) refuse("Image non acceptée (JPEG, PNG ou WebP).");
  if (data.length > 260000) refuse("Image trop lourde. Elle est normalement réduite automatiquement : réessayez avec une autre photo.", 413);
  const plan = PLANS[C.planEdition(marque)], type = b.type === "menu" ? "menu" : "lieu";
  const n = (await db.prepare("SELECT COUNT(*) AS n FROM photos WHERE adresse_id = ? AND type = ?").bind(a.id, type).first()).n;
  if (type === "menu") {
    if (!plan.menu_photos) refuse("Le menu en photos demande l'abonnement Standard ou Premium.", 403);
    if (n >= plan.menu_photos) refuse("La formule " + plan.nom + " permet " + plan.menu_photos + " photos de menu par adresse.", 403);
  } else if (n >= plan.photos) refuse("La formule " + plan.nom + " permet " + plan.photos + " photo" + (plan.photos > 1 ? "s" : "") + " par adresse.", 403);
  const r = await db.prepare("INSERT INTO photos (adresse_id, mime, data, type, created_at) VALUES (?, ?, ?, ?, ?)").bind(a.id, mime, data, type, new Date().toISOString()).run();
  return json({ ok: true, id: r.meta.last_row_id });
}
async function supprimerPhoto({ request, env }) {
  const user = await exigerUser(request, env), db = await C.base(env), marque = await marqueDe(db, user.id);
  const b = await lireJson(request);
  const p = marque && await db.prepare("SELECT p.id, p.type, a.id AS aid, a.menu_mois, a.menu_nb FROM photos p JOIN adresses a ON a.id = p.adresse_id WHERE p.id = ? AND a.marque_id = ?").bind(ent(b.id), marque.id).first();
  if (!p) refuse("Photo introuvable.", 404);
  if (p.type === "menu") {
    // Remplacer une photo du menu compte pour une modification (Standard : 2 par mois, Premium : illimité). Ajouter une photo est libre.
    const plan = PLANS[C.planEdition(marque)], mois = new Date().toISOString().slice(0, 7);
    let nb = p.menu_mois === mois ? (p.menu_nb || 0) : 0;
    if (plan.menu < 9999) {
      if (nb >= plan.menu) refuse("Limite atteinte : " + plan.menu + " modification(s) du menu par mois avec la formule " + plan.nom + ". Réessayez le mois prochain ou passez à Premium.", 403);
      nb++;
    }
    await db.prepare("UPDATE adresses SET menu_mois = ?, menu_nb = ? WHERE id = ?").bind(mois, nb, p.aid).run();
  }
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
  if (!marque) refuse("Ajoutez d'abord votre adresse.", 409);
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
  const adminsF = C.adminsDe(env);
  const [marques, adresses, averifier, attente, imports, stats] = await Promise.all([
    tout("SELECT m.id, m.nom, m.plan_souhaite, m.created_at, u.email, u.nom AS user_nom, u.tel AS user_tel FROM marques m JOIN users u ON u.id = m.owner_id WHERE m.statut = 'en_attente' AND NOT (m.plan_souhaite IN ('standard','premium') AND m.plan = 'gratuit' AND m.plan_fin IS NULL) ORDER BY m.id"),
    tout("SELECT a.id, a.nom, a.categorie, a.commune, a.adresse, a.tel, a.code, a.tel_verifie, a.lieu_existant, a.horaires, a.description, a.menu, a.created_at, m.nom AS marque_nom, m.statut AS marque_statut, m.plan_souhaite, m.plan, m.plan_fin, m.essai_fin, u.email, u.tel AS user_tel FROM adresses a JOIN marques m ON m.id = a.marque_id JOIN users u ON u.id = m.owner_id WHERE a.statut = 'en_attente' AND NOT (m.plan_souhaite IN ('standard','premium') AND m.plan = 'gratuit' AND m.plan_fin IS NULL) ORDER BY a.id LIMIT 60"),
    tout("SELECT d.id, d.plan, d.ref, d.motif, d.created_at, d.tentatives, m.nom AS marque_nom, u.email, u.tel AS user_tel FROM demandes_paiement d JOIN marques m ON m.id = d.marque_id JOIN users u ON u.id = d.user_id WHERE d.statut = 'a_verifier' ORDER BY d.id"),
    tout("SELECT d.id, d.plan, d.ref, d.motif, d.created_at, d.tentatives, m.nom AS marque_nom, u.email FROM demandes_paiement d JOIN marques m ON m.id = d.marque_id JOIN users u ON u.id = d.user_id WHERE d.statut = 'en_attente' ORDER BY d.id"),
    tout("SELECT * FROM imports ORDER BY id DESC LIMIT 5"),
    db.prepare("SELECT (SELECT COUNT(*) FROM users WHERE 1 = 1" + (adminsF.length ? " AND lower(email) NOT IN (" + adminsF.map(() => "?").join(",") + ")" : "") + ") AS comptes, (SELECT COUNT(*) FROM reclamations WHERE statut = 'en_attente') AS reclamations, (SELECT COUNT(*) FROM marques) AS marques, (SELECT COUNT(*) FROM adresses WHERE statut = 'validee') AS adresses_validees, (SELECT COUNT(*) FROM marques WHERE plan != 'gratuit' AND plan_fin > ? AND (essai_fin IS NULL OR plan_fin != essai_fin)) AS abonnes, (SELECT COUNT(*) FROM marques WHERE essai_fin IS NOT NULL AND plan_fin = essai_fin AND plan_fin > ?) AS essais_en_cours").bind(...adminsF, new Date().toISOString(), new Date().toISOString()).first(),
  ]);
  if (adresses.length) {
    const ph = await tout("SELECT id, adresse_id, type FROM photos WHERE adresse_id IN (" + adresses.map(() => "?").join(",") + ") ORDER BY id", ...adresses.map(a => a.id));
    for (const a of adresses) { a.photos = ph.filter(p => p.adresse_id === a.id && p.type !== "menu").map(p => p.id); a.menu_photos = ph.filter(p => p.adresse_id === a.id && p.type === "menu").map(p => p.id); a.plan_effectif = C.planEffectif(a); a.en_essai = C.enEssai(a); }
  }
  const waN = (await db.prepare("SELECT COUNT(*) AS n FROM wa_conversations WHERE statut = 'a_traiter'").first()).n;
  // Abonnements actifs et revenu mensuel estimé (prix des formules × abonnés actifs, hors frais de transaction)
  const abos = { standard: 0, premium: 0 };
  for (const m of await tout("SELECT plan, plan_fin, essai_fin FROM marques WHERE plan != 'gratuit'")) { if (C.enEssai(m)) continue; const pe = C.planEffectif(m); if (abos[pe] !== undefined) abos[pe]++; }
  const revenu = Math.round((abos.standard * PLANS.standard.prix + abos.premium * PLANS.premium.prix) * 100) / 100;
  const debutJour = new Date(); debutJour.setUTCHours(0, 0, 0, 0);
  const waJour = { ia: (await db.prepare("SELECT COUNT(*) AS n FROM wa_messages WHERE role = 'ia' AND created_at >= ?").bind(debutJour.toISOString()).first()).n, clients: (await db.prepare("SELECT COUNT(*) AS n FROM wa_messages WHERE role = 'client' AND created_at >= ?").bind(debutJour.toISOString()).first()).n, plafond: Number(env.WA_MAX_IA_JOUR) || 300 };
  return json({ ok: true, abonnements: { ...abos, revenu }, wa_jour: waJour, marques, adresses, a_verifier: averifier, en_attente: attente, imports, stats, whatsapp: C.WHATSAPP, mail_configure: Mail.mailConfigure(env), wa_a_traiter: waN, wa_configure: !!(env.WA_TOKEN && env.WA_PHONE_ID && env.WA_APP_SECRET && env.WA_VERIFY_TOKEN), wa_ia: !!env.ANTHROPIC_API_KEY && String(env.WA_IA_ACTIVE) !== "0" });
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
// --- sanctions : bannissement (définitif ou pour une durée), suppression, réclamations ---
const JOURNAL = (db, u, action, motif, jusqua, par) => db.prepare("INSERT INTO sanctions (user_id, email, nom, action, motif, jusqua, par, at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(u.id, u.email, u.nom || "", action, motif || "", jusqua || null, par, new Date().toISOString());
async function leverBans(db) { await db.prepare("UPDATE users SET banni = 0, banni_motif = NULL, banni_at = NULL, banni_jusqua = NULL WHERE banni = 1 AND banni_jusqua IS NOT NULL AND banni_jusqua <= ?").bind(new Date().toISOString()).run(); }
async function infosBan(db, uid) {
  const u = await db.prepare("SELECT banni, banni_motif, banni_at, banni_jusqua FROM users WHERE id = ?").bind(uid).first();
  if (!u || !u.banni) return null;
  const r = await db.prepare("SELECT statut, reponse FROM reclamations WHERE user_id = ? AND created_at >= ? ORDER BY id DESC LIMIT 1").bind(uid, u.banni_at || "").first();
  return { motif: u.banni_motif || "", jusqua: u.banni_jusqua || null, definitif: !u.banni_jusqua, reclamation: r ? { statut: r.statut, reponse: r.reponse || "" } : null, peut_reclamer: !r };
}
async function reclamationUtilisateur({ request, env, ip }) {
  const b = await lireJson(request);
  const email = texte(b.email, 120, true, "e-mail").toLowerCase(), mdp = String(b.mot_de_passe || ""), message = texte(b.message, 1000, true, "message");
  if (message.length < 10) refuse("Expliquez votre situation en quelques phrases (10 caractères minimum).");
  if (!(await C.limiter(env, "log:" + ip + ":" + email, 8, 900))) refuse("Trop de tentatives. Réessayez dans 15 minutes.", 429);
  const db = await C.base(env); await leverBans(db);
  const u = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  if (!u || !(await C.mdpValide(mdp, u))) refuse("E-mail ou mot de passe incorrect.", 401);
  const ban = await infosBan(db, u.id); if (!ban) refuse("Ce compte n'est pas suspendu.", 400);
  if (!ban.peut_reclamer) refuse("Vous avez déjà envoyé une réclamation pour cette suspension.", 409);
  await db.prepare("INSERT INTO reclamations (user_id, message, created_at) VALUES (?, ?, ?)").bind(u.id, message, new Date().toISOString()).run();
  return json({ ok: true });
}
async function adminComptes({ request, env, url }) {
  await exigerAdmin(request, env); const db = await C.base(env); await leverBans(db);
  const q = String(url.searchParams.get("q") || "").trim().toLowerCase().slice(0, 80).replace(/[%_\\]/g, "");
  const filtre = url.searchParams.get("banni") === "1" ? " AND u.banni = 1" : url.searchParams.get("reclam") === "1" ? " AND EXISTS (SELECT 1 FROM reclamations r WHERE r.user_id = u.id AND r.statut = 'en_attente')" : "";
  const like = "%" + q + "%", admins = C.adminsDe(env), sansAdmins = admins.length ? " AND lower(u.email) NOT IN (" + admins.map(() => "?").join(",") + ")" : "";
  const lignes = (await db.prepare("SELECT u.id, u.email, u.nom, u.tel, u.type, u.identifiant, u.banni, u.banni_motif, u.banni_at, u.banni_jusqua, u.created_at, m.nom AS commerce, (SELECT r.id FROM reclamations r WHERE r.user_id = u.id AND r.statut = 'en_attente' ORDER BY r.id DESC LIMIT 1) AS rec_id, (SELECT r.message FROM reclamations r WHERE r.user_id = u.id AND r.statut = 'en_attente' ORDER BY r.id DESC LIMIT 1) AS rec_message FROM users u LEFT JOIN marques m ON m.owner_id = u.id WHERE (lower(u.email) LIKE ? OR lower(u.nom) LIKE ? OR lower(IFNULL(m.nom, '')) LIKE ? OR u.identifiant LIKE ?)" + sansAdmins + filtre + " ORDER BY (rec_id IS NOT NULL) DESC, u.banni DESC, u.id DESC LIMIT 30").bind(like, like, like, like.toUpperCase(), ...admins).all()).results || [];
  const journal = (await db.prepare("SELECT id, user_id, email, nom, action, motif, jusqua, par, at FROM sanctions ORDER BY id DESC LIMIT 25").all()).results || [];
  return json({ ok: true, comptes: lignes, journal });
}
async function cibleModeration(env, db, moi, id) {
  const cible = await db.prepare("SELECT id, email, nom FROM users WHERE id = ?").bind(id).first();
  if (!cible) refuse("Compte introuvable.", 404);
  if (cible.id === moi.id || C.adminsDe(env).includes(String(cible.email).toLowerCase())) refuse("Un compte administrateur ne peut pas être sanctionné.", 403);
  return cible;
}
const motifRequis = v => { const m = texte(v, 300, true, "raison"); if (m.length < 3) refuse("Indiquez ce que la personne a fait (raison obligatoire)."); return m; };
async function adminBannir({ request, env }) {
  const moi = await exigerAdmin(request, env), db = await C.base(env), b = await lireJson(request), id = ent(b.id);
  const cible = await cibleModeration(env, db, moi, id), motif = motifRequis(b.motif);
  const jours = Number(b.jours || 0); if (jours && ![1, 7, 30, 90].includes(jours)) refuse("Durée invalide.");
  const now = new Date(), jusqua = jours ? new Date(now.getTime() + jours * 86400000).toISOString() : null;
  await db.batch([db.prepare("UPDATE users SET banni = 1, banni_motif = ?, banni_at = ?, banni_jusqua = ? WHERE id = ?").bind(motif, now.toISOString(), jusqua, id), db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id), JOURNAL(db, cible, "ban", motif, jusqua, moi.email)]);
  return json({ ok: true, jusqua });
}
async function adminDebannir({ request, env }) {
  const moi = await exigerAdmin(request, env), db = await C.base(env), b = await lireJson(request), id = ent(b.id);
  const cible = await db.prepare("SELECT id, email, nom FROM users WHERE id = ?").bind(id).first(); if (!cible) refuse("Compte introuvable.", 404);
  await db.batch([db.prepare("UPDATE users SET banni = 0, banni_motif = NULL, banni_at = NULL, banni_jusqua = NULL WHERE id = ?").bind(id), db.prepare("UPDATE reclamations SET statut = 'acceptee', traite_at = ? WHERE user_id = ? AND statut = 'en_attente'").bind(new Date().toISOString(), id), JOURNAL(db, cible, "deban", "", null, moi.email)]);
  return json({ ok: true });
}
async function adminReclamation({ request, env }) {
  const moi = await exigerAdmin(request, env), db = await C.base(env), b = await lireJson(request);
  const r = await db.prepare("SELECT * FROM reclamations WHERE id = ? AND statut = 'en_attente'").bind(ent(b.id)).first(); if (!r) refuse("Réclamation introuvable ou déjà traitée.", 404);
  const cible = await db.prepare("SELECT id, email, nom FROM users WHERE id = ?").bind(r.user_id).first();
  const reponse = texte(b.reponse, 300), maintenant = new Date().toISOString();
  if (b.decision === "accepter") {
    await db.batch([db.prepare("UPDATE users SET banni = 0, banni_motif = NULL, banni_at = NULL, banni_jusqua = NULL WHERE id = ?").bind(r.user_id), db.prepare("UPDATE reclamations SET statut = 'acceptee', reponse = ?, traite_at = ? WHERE id = ?").bind(reponse, maintenant, r.id), JOURNAL(db, cible, "reclamation_acceptee", reponse, null, moi.email)]);
  } else if (b.decision === "refuser") {
    if (reponse.length < 3) refuse("Écrivez une courte réponse : la personne la verra.");
    await db.batch([db.prepare("UPDATE reclamations SET statut = 'refusee', reponse = ?, traite_at = ? WHERE id = ?").bind(reponse, maintenant, r.id), JOURNAL(db, cible, "reclamation_refusee", reponse, null, moi.email)]);
  } else refuse("Décision inconnue.");
  return json({ ok: true });
}
async function adminSupprimer({ request, env }) {
  const moi = await exigerAdmin(request, env), db = await C.base(env), b = await lireJson(request), id = ent(b.id);
  const cible = await cibleModeration(env, db, moi, id), motif = motifRequis(b.motif);
  await db.batch([
    JOURNAL(db, cible, "suppression", motif, null, moi.email),
    db.prepare("DELETE FROM photos WHERE adresse_id IN (SELECT a.id FROM adresses a JOIN marques m ON m.id = a.marque_id WHERE m.owner_id = ?)").bind(id),
    db.prepare("DELETE FROM adresses WHERE marque_id IN (SELECT id FROM marques WHERE owner_id = ?)").bind(id),
    db.prepare("DELETE FROM demandes_paiement WHERE user_id = ?").bind(id),
    db.prepare("DELETE FROM marques WHERE owner_id = ?").bind(id),
    db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id),
    db.prepare("DELETE FROM reclamations WHERE user_id = ?").bind(id),
    db.prepare("DELETE FROM verifs WHERE email = ?").bind(cible.email),
    db.prepare("DELETE FROM users WHERE id = ?").bind(id)]);
  return json({ ok: true });
}
// --- récupération de compte : l'admin saisit l'identifiant, un code part vers l'e-mail du compte, la personne le lui donne ---
async function recupEnvoyer({ request, env }) {
  const moi = await exigerAdmin(request, env), db = await C.base(env), b = await lireJson(request);
  const q = texte(b.q, 120, true, "identifiant").trim();
  let lignes;
  if (/^nx-/i.test(q)) lignes = (await db.prepare("SELECT id, email, nom, identifiant FROM users WHERE identifiant = ?").bind(q.toUpperCase()).all()).results || [];
  else if (q.includes("@")) lignes = (await db.prepare("SELECT id, email, nom, identifiant FROM users WHERE email = ?").bind(q.toLowerCase()).all()).results || [];
  else lignes = (await db.prepare("SELECT id, email, nom, identifiant FROM users WHERE lower(nom) = ? LIMIT 5").bind(q.toLowerCase()).all()).results || [];
  if (!lignes.length) refuse("Aucun compte trouvé avec « " + q + " ».", 404);
  if (lignes.length > 1) refuse("Plusieurs comptes portent ce pseudo. Demandez à la personne son identifiant (NX-…), visible dans « Mon compte ».");
  const u = lignes[0];
  if (C.adminsDe(env).includes(String(u.email).toLowerCase())) refuse("Un compte administrateur ne se récupère pas ici.", 403);
  if (!Mail.mailConfigure(env)) refuse("L'envoi d'e-mails n'est pas configuré.", 503);
  if (!(await C.limiter(env, "recup:" + moi.id, 15, 3600)) || !(await C.limiter(env, "recupu:" + u.id, 4, 3600))) refuse("Trop de codes envoyés pour ce compte. Réessayez plus tard.", 429);
  const r = await envoyerCode(env, db, { id: nouvelId(), email: u.email, but: "recuperation", donnees: { uid: u.id } });
  return json({ ...r, nom: u.nom, identifiant: u.identifiant });
}
async function recupConfirmer({ request, env }) {
  const moi = await exigerAdmin(request, env), db = await C.base(env), b = await lireJson(request);
  const v = await controlerCode(env, db, b, "recuperation");
  const u = await db.prepare("SELECT id, email, nom, tel, type, identifiant, banni FROM users WHERE id = ?").bind(v.donnees.uid).first(); if (!u) refuse("Compte introuvable.", 404);
  const m = await marqueDe(db, u.id);
  await JOURNAL(db, u, "recuperation", "Identité confirmée par code e-mail", null, moi.email).run();
  return json({ ok: true, compte: { ...u, commerce: m ? m.nom : null, commerce_statut: m ? m.statut : null, plan: m ? C.planEffectif(m) : null } });
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
  const rows = (await db.prepare("SELECT a.*, m.plan, m.plan_fin, m.id AS mid FROM adresses a JOIN marques m ON m.id = a.marque_id WHERE a.statut = 'validee' AND m.statut = 'validee' AND m.owner_id NOT IN (SELECT id FROM users WHERE banni = 1 AND (banni_jusqua IS NULL OR banni_jusqua > '"+new Date().toISOString()+"')) ORDER BY a.marque_id, a.id LIMIT 1000").all()).results || [];
  const phs = (await db.prepare("SELECT p.id, p.adresse_id, p.type FROM photos p JOIN adresses a ON a.id = p.adresse_id WHERE a.statut = 'validee' ORDER BY p.id").all()).results || [];
  const parMarque = {}, sortie = [];
  for (const a of rows) {
    const nom = C.planEffectif({ plan: a.plan, plan_fin: a.plan_fin }, now), p = PLANS[nom];
    parMarque[a.mid] = (parMarque[a.mid] || 0) + 1;
    if (parMarque[a.mid] > p.adresses) continue; // au-delà du quota de la formule actuelle
    const photos = phs.filter(x => x.adresse_id === a.id && x.type !== "menu").slice(0, p.photos).map(x => x.id);
    const menu_photos = phs.filter(x => x.adresse_id === a.id && x.type === "menu").slice(0, p.menu_photos).map(x => x.id);
    sortie.push({ id: a.id, nom: a.nom, categorie: a.categorie, commune: a.commune, adresse: a.adresse, tel: a.tel, horaires: a.horaires, description: a.description, lat: a.lat, lng: a.lng, lieu_existant: a.lieu_existant, formule: nom, badge: p.badge, whatsapp: p.whatsapp, haut: p.haut, photos, menu_photos });
  }
  return new Response(JSON.stringify({ ok: true, commerces: sortie }), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300" } });
}

// ---------- messages WhatsApp : conversations passées à un agent ----------
async function waListe({ request, env, url }) {
  await exigerAdmin(request, env); const db = await C.base(env);
  const f = url.searchParams.get("statut"), statut = ["a_traiter", "traite", "ia"].includes(f) ? f : null;
  const lignes = (await db.prepare("SELECT c.id, c.phone, c.nom, c.statut, c.categorie, c.resume, c.non_lu, c.dernier_msg_at, c.dernier_client_at, (SELECT texte FROM wa_messages m WHERE m.conv_id = c.id ORDER BY m.id DESC LIMIT 1) AS dernier FROM wa_conversations c" + (statut ? " WHERE c.statut = ?" : "") + " ORDER BY CASE c.statut WHEN 'a_traiter' THEN 0 ELSE 1 END, c.dernier_msg_at DESC LIMIT 80").bind(...(statut ? [statut] : [])).all()).results || [];
  const nb = (await db.prepare("SELECT statut, COUNT(*) AS n FROM wa_conversations GROUP BY statut").all()).results || [];
  const journal = (await db.prepare("SELECT at, genre, detail FROM wa_journal ORDER BY id DESC LIMIT 8").all()).results || [];
  return json({ ok: true, journal, conversations: lignes.map(l => ({ ...l, libelle: WA.CATEGORIES[l.categorie] || null })), compte: Object.fromEntries(nb.map(x => [x.statut, x.n])) });
}
async function waConversation({ request, env, url }) {
  await exigerAdmin(request, env); const db = await C.base(env), id = ent(url.searchParams.get("id"));
  const c = await db.prepare("SELECT * FROM wa_conversations WHERE id = ?").bind(id).first();
  if (!c) refuse("Conversation introuvable.", 404);
  const messages = (await db.prepare("SELECT id, role, texte, created_at FROM wa_messages WHERE conv_id = ? ORDER BY id DESC LIMIT 120").bind(id).all()).results.reverse();
  await db.prepare("UPDATE wa_conversations SET non_lu = 0 WHERE id = ?").bind(id).run();
  const fenetre = c.dernier_client_at ? Date.now() - Date.parse(c.dernier_client_at) < 24 * 3600e3 : false;   // WhatsApp n'autorise une réponse libre que 24 h après le dernier message du client
  return json({ ok: true, conversation: { ...c, libelle: WA.CATEGORIES[c.categorie] || null }, messages, fenetre_ouverte: fenetre });
}
async function waRepondre({ request, env }) {
  await exigerAdmin(request, env); const db = await C.base(env), b = await lireJson(request, 6000);
  const id = ent(b.id), t = texte(b.texte, 1500, true, "message");
  const c = await db.prepare("SELECT * FROM wa_conversations WHERE id = ?").bind(id).first();
  if (!c) refuse("Conversation introuvable.", 404);
  if (!c.dernier_client_at || Date.now() - Date.parse(c.dernier_client_at) >= 24 * 3600e3) refuse("WhatsApp n'autorise une réponse libre que dans les 24 heures qui suivent le dernier message de la personne. Contactez-la autrement (appel ou SMS).", 409);
  try { await WA.envoyerWhatsApp(env, c.phone, t); }
  catch (e) { console.error("nexvia-wa-envoi", e && e.message || e); refuse("Le message n'a pas pu être envoyé : " + String(e && e.message || e).slice(0, 160), 502); }
  const now = new Date().toISOString();
  await db.prepare("INSERT INTO wa_messages (conv_id, role, texte, created_at) VALUES (?, 'agent', ?, ?)").bind(id, t, now).run();
  await db.prepare("UPDATE wa_conversations SET dernier_msg_at = ?, non_lu = 0 WHERE id = ?").bind(now, id).run();
  return json({ ok: true });
}
async function waStatut({ request, env }) {
  await exigerAdmin(request, env); const db = await C.base(env), b = await lireJson(request);
  const statut = ["traite", "ia", "a_traiter"].includes(b.statut) ? b.statut : refuse("Statut inconnu.");
  const r = await db.prepare("UPDATE wa_conversations SET statut = ?, alerte_envoyee = ?, traite_at = ?, non_lu = 0 WHERE id = ?").bind(statut, statut === "a_traiter" ? 1 : 0, statut === "traite" ? new Date().toISOString() : null, ent(b.id)).run();
  if (!r.meta.changes) refuse("Conversation introuvable.", 404);
  return json({ ok: true });
}

// Nexvia RDC – bibliothèque commune : base D1, comptes, règles d'abonnement, rapprochement des paiements Zola.
// Aucune donnée secrète ici. Les adresses de l'administrateur viennent de la variable ADMIN_EMAILS (Cloudflare).

export const PLANS = {
  gratuit:  { nom: "Gratuit",  prix: 0,    adresses: 1, photos: 1,  menu: 0,    menu_photos: 0,  horaires: false, badge: false, whatsapp: false, haut: false, stats: false },
  standard: { nom: "Standard", prix: 3.30, adresses: 2, photos: 5,  menu: 2,    menu_photos: 3,  horaires: true,  badge: true,  whatsapp: true,  haut: false, stats: false },
  premium:  { nom: "Premium",  prix: 5.30, adresses: 6, photos: 15, menu: 9999, menu_photos: 10, horaires: true,  badge: true,  whatsapp: true,  haut: true,  stats: true },
};
// Totaux relevés sur la page de paiement Zola (frais ajoutés au client, environ 9,5 %). À confirmer avec Zola.
export const TOTAL_AVEC_FRAIS = { standard: 3.61, premium: 5.80 };
export const WHATSAPP = "243862675126";
export const DUREE_JOURS = 30;
// Communes ouvertes aux commerces (les autres sont affichées « bientôt »).
export const COMMUNES_OUVERTES = ["Gombe"];
// Horaires : uniquement le format produit par le sélecteur (« Lun–Sam 08:00–20:00 · Dim fermé » ou « 24h/24 »), jamais du texte libre.
const J = "(?:Lun|Mar|Mer|Jeu|Ven|Sam|Dim)", T = "(?:(?:[01]\\d|2[0-3]):[0-5]\\d|24:00)", SEG = J + "(?:–" + J + ")? (?:" + T + "–" + T + "|fermé)";
const RE_HORAIRES = new RegExp("^(?:24h/24|" + SEG + "(?: · " + SEG + "){0,6})$");
export const horairesValides = h => typeof h === "string" && h.length <= 140 && RE_HORAIRES.test(h);
export const CATEGORIES = ["restaurant", "pharmacie", "banque", "hotel", "bar", "ecole", "distributeur", "station-service", "autre"];

// ---------- réponses ----------
export const json = (obj, status = 200, extra = {}) => new Response(JSON.stringify(obj), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff", ...extra },
});
export class Erreur extends Error { constructor(message, status = 400) { super(message); this.status = status; } }
export const refuse = (message, status = 400) => { throw new Erreur(message, status); };

export async function lireJson(request, maxCar = 20000) {
  const t = await request.text();
  if (t.length > maxCar) refuse("Données trop volumineuses.", 413);
  try { return JSON.parse(t || "{}"); } catch (e) { return refuse("Données invalides."); }
}
export const texte = (v, max, requis = false, nom = "champ") => {
  const s = (v == null ? "" : String(v)).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim();
  if (requis && !s) refuse("Le champ « " + nom + " » est obligatoire.");
  if (s.length > max) refuse("Le champ « " + nom + " » est trop long (" + max + " caractères maximum).");
  return s;
};

// ---------- base de données ----------
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, nom TEXT, tel TEXT, type TEXT NOT NULL DEFAULT 'utilisateur', pass_hash TEXT NOT NULL, pass_salt TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS essais (cle TEXT NOT NULL, ts INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_essais ON essais (cle, ts)`,
  `CREATE TABLE IF NOT EXISTS marques (id INTEGER PRIMARY KEY AUTOINCREMENT, owner_id INTEGER NOT NULL UNIQUE, nom TEXT NOT NULL, statut TEXT NOT NULL DEFAULT 'en_attente', plan TEXT NOT NULL DEFAULT 'gratuit', plan_fin TEXT, note TEXT, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS adresses (id INTEGER PRIMARY KEY AUTOINCREMENT, marque_id INTEGER NOT NULL, nom TEXT NOT NULL, categorie TEXT, commune TEXT, adresse TEXT NOT NULL, tel TEXT NOT NULL, horaires TEXT, description TEXT, menu TEXT, lat REAL, lng REAL, lieu_existant TEXT, statut TEXT NOT NULL DEFAULT 'en_attente', code TEXT NOT NULL, tel_verifie INTEGER NOT NULL DEFAULT 0, menu_mois TEXT, menu_nb INTEGER NOT NULL DEFAULT 0, note TEXT, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_adresses_marque ON adresses (marque_id)`,
  `CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT, adresse_id INTEGER NOT NULL, mime TEXT NOT NULL, data TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_photos_adresse ON photos (adresse_id)`,
  `CREATE TABLE IF NOT EXISTS demandes_paiement (id INTEGER PRIMARY KEY AUTOINCREMENT, marque_id INTEGER NOT NULL, user_id INTEGER NOT NULL, plan TEXT NOT NULL, ref TEXT NOT NULL UNIQUE, statut TEXT NOT NULL DEFAULT 'en_attente', tentatives INTEGER NOT NULL DEFAULT 0, motif TEXT, created_at TEXT NOT NULL, traite_at TEXT)`,
  `CREATE INDEX IF NOT EXISTS idx_demandes_marque ON demandes_paiement (marque_id)`,
  `CREATE TABLE IF NOT EXISTS zola_paiements (ref TEXT PRIMARY KEY, date TEXT, montant REAL, devise TEXT, statut TEXT, operateur TEXT, beneficiaire TEXT, settle_montant REAL, settle_statut TEXT, maj TEXT)`,
  `CREATE TABLE IF NOT EXISTS verifs (id TEXT PRIMARY KEY, email TEXT NOT NULL, but TEXT NOT NULL, code_hash TEXT NOT NULL, donnees TEXT, essais INTEGER NOT NULL DEFAULT 0, envois INTEGER NOT NULL DEFAULT 1, expire INTEGER NOT NULL, envoye INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS sanctions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, email TEXT, nom TEXT, action TEXT NOT NULL, motif TEXT, jusqua TEXT, par TEXT, at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS reclamations (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, message TEXT NOT NULL, statut TEXT NOT NULL DEFAULT 'en_attente', reponse TEXT, created_at TEXT NOT NULL, traite_at TEXT)`,
  `CREATE INDEX IF NOT EXISTS idx_reclam_user ON reclamations (user_id)`,
  `CREATE TABLE IF NOT EXISTS imports (id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT NOT NULL, lignes INTEGER NOT NULL, activees INTEGER NOT NULL, a_verifier INTEGER NOT NULL, par INTEGER)`,
];
let schemaPret = null;
// Ajouts de colonnes sur une base déjà créée (sans effet si la colonne existe déjà).
const migrer = env => async () => {
  for (const sql of ["ALTER TABLE marques ADD COLUMN plan_souhaite TEXT", "ALTER TABLE photos ADD COLUMN type TEXT NOT NULL DEFAULT 'lieu'", "ALTER TABLE users ADD COLUMN banni INTEGER NOT NULL DEFAULT 0", "ALTER TABLE users ADD COLUMN banni_motif TEXT", "ALTER TABLE users ADD COLUMN banni_at TEXT", "ALTER TABLE users ADD COLUMN banni_jusqua TEXT", "ALTER TABLE users ADD COLUMN identifiant TEXT"]) {
    try { await env.DB.prepare(sql).run(); }
    catch (e) { if (!/duplicate column/i.test(String(e && (e.message || e)))) throw e; }
  }
  await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_identifiant ON users (identifiant)").run();
  for (let tour = 0; tour < 5; tour++) {            // identifiant pour les comptes créés avant cette mise à jour
    const sans = (await env.DB.prepare("SELECT id FROM users WHERE identifiant IS NULL LIMIT 300").all()).results || [];
    if (!sans.length) break;
    await env.DB.batch(sans.map(u => env.DB.prepare("UPDATE users SET identifiant = ? WHERE id = ?").bind(nouvelIdentifiant(), u.id)));
  }
};
// Identifiant public d'un compte (ex. NX-4F7K2M) : sans lettres ambiguës, à donner à l'équipe pour être aidé.
export function nouvelIdentifiant() {
  const al = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; const o = crypto.getRandomValues(new Uint8Array(6));
  return "NX-" + [...o].map(x => al[x % al.length]).join("");
}
export function base(env) {
  if (!env.DB) refuse("La base de données n'est pas encore configurée.", 503);
  if (!schemaPret) schemaPret = env.DB.batch(SCHEMA.map(s => env.DB.prepare(s))).then(migrer(env)).catch(e => { schemaPret = null; throw e; });
  return schemaPret.then(() => env.DB);
}

// ---------- sécurité : mots de passe, sessions ----------
const enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const sha256hex = async s => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));
export async function hacherMdp(mdp, sel) {
  const cle = await crypto.subtle.importKey("raw", enc.encode(mdp), "PBKDF2", false, ["deriveBits"]);
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(sel), iterations: 100000 }, cle, 256));
}
export const nouveauSel = () => hex(crypto.getRandomValues(new Uint8Array(16)));
const egal = (a, b) => { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; };
export const mdpValide = async (mdp, user) => egal(await hacherMdp(mdp, user.pass_salt), user.pass_hash);

const COOKIE = "nx_s";
export async function ouvrirSession(env, userId) {
  const db = await base(env);
  const jeton = b64u(crypto.getRandomValues(new Uint8Array(32)));
  const fin = new Date(Date.now() + 30 * 86400000).toISOString();
  await db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").bind(await sha256hex(jeton), userId, fin).run();
  return `${COOKIE}=${jeton}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`;
}
export const cookieVide = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
const lireCookie = request => { const m = (request.headers.get("cookie") || "").match(new RegExp("(?:^|; )" + COOKIE + "=([^;]+)")); return m ? m[1] : null; };
export const adminsDe = env => String(env.ADMIN_EMAILS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
export async function utilisateur(request, env) {
  const jeton = lireCookie(request);
  if (!jeton) return null;
  const db = await base(env);
  const u = await db.prepare("SELECT u.id, u.email, u.nom, u.tel, u.type, u.identifiant FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ? AND u.banni = 0").bind(await sha256hex(jeton), new Date().toISOString()).first();
  if (!u) return null;
  u.admin = adminsDe(env).includes(String(u.email).toLowerCase());
  return u;
}
export async function finSession(request, env) {
  const jeton = lireCookie(request);
  if (jeton) { const db = await base(env); await db.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256hex(jeton)).run(); }
}
export async function limiter(env, cle, max, fenetreSec) {
  const db = await base(env), maintenant = Date.now(), depuis = maintenant - fenetreSec * 1000;
  const r = await db.prepare("SELECT COUNT(*) AS n FROM essais WHERE cle = ? AND ts > ?").bind(cle, depuis).first();
  if (r && r.n >= max) return false;
  await db.prepare("INSERT INTO essais (cle, ts) VALUES (?, ?)").bind(cle, maintenant).run();
  if (Math.random() < 0.05) await db.prepare("DELETE FROM essais WHERE ts < ?").bind(maintenant - 86400000).run();
  return true;
}
export const codeVerif = () => "NX-" + String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");

// ---------- règles d'abonnement ----------
export function planEffectif(marque, maintenant = new Date()) {
  if (marque && marque.plan && marque.plan !== "gratuit" && PLANS[marque.plan] && marque.plan_fin && new Date(marque.plan_fin) > maintenant) return marque.plan;
  return "gratuit";
}
// Formule utilisée pour remplir la fiche : la plus haute entre l'abonnement actif et la formule choisie à l'inscription.
// Elle ne sert qu'aux limites de saisie ; l'affichage public suit toujours l'abonnement réellement payé (planEffectif).
const RANG = { gratuit: 0, standard: 1, premium: 2 };
export function planEdition(marque, maintenant = new Date()) {
  const eff = planEffectif(marque, maintenant), voulu = marque && PLANS[marque.plan_souhaite] ? marque.plan_souhaite : "gratuit";
  return RANG[voulu] > RANG[eff] ? voulu : eff;
}
export function nouvelleFin(marque, plan, maintenant = new Date()) {
  let base = maintenant;
  if (marque.plan === plan && marque.plan_fin && new Date(marque.plan_fin) > maintenant) base = new Date(marque.plan_fin);
  return new Date(base.getTime() + DUREE_JOURS * 86400000).toISOString();
}

// ---------- références de paiement ----------
export function normaliserRef(s) {
  return String(s == null ? "" : s).toUpperCase().replace(/[‐-―−]/g, "-").replace(/\s+/g, "").replace(/^SETTLE_/, "");
}
export const REF_VALIDE = /^ZOLA-[A-Z0-9-]{3,40}$/;
export const norm = s => String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

// ---------- lecture du CSV Zola ----------
export function lireCSV(texte) {
  texte = String(texte || "").replace(/^﻿/, "");
  const premiere = texte.split(/\r?\n/, 1)[0] || "";
  const sep = (premiere.match(/;/g) || []).length > (premiere.match(/,/g) || []).length ? ";" : ",";
  const lignes = []; let champ = "", ligne = [], guillemets = false;
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (guillemets) {
      if (c === '"') { if (texte[i + 1] === '"') { champ += '"'; i++; } else guillemets = false; } else champ += c;
    } else if (c === '"') guillemets = true;
    else if (c === sep) { ligne.push(champ); champ = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && texte[i + 1] === "\n") i++; ligne.push(champ); champ = ""; if (ligne.some(x => x !== "")) lignes.push(ligne); ligne = []; }
    else champ += c;
  }
  ligne.push(champ); if (ligne.some(x => x !== "")) lignes.push(ligne);
  return lignes;
}
const nombre = v => { let s = String(v == null ? "" : v).trim().replace(/\s/g, ""); if (!s) return null; if (s.includes(",") && !s.includes(".")) s = s.replace(",", "."); const n = parseFloat(s); return Number.isFinite(n) ? n : null; };
const dateIso = v => { const m = String(v || "").trim().match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/); return m ? `${m[3]}-${m[2]}-${m[1]}T${m[4] || "00"}:${m[5] || "00"}:${m[6] || "00"}` : String(v || "").trim(); };
export function analyserCSV(texteCsv) {
  const l = lireCSV(texteCsv);
  if (l.length < 2) refuse("Le fichier est vide ou illisible.");
  const ent = l[0].map(norm), idx = nom => ent.indexOf(nom);
  const c = { date: idx("date"), type: idx("type"), benef: idx("beneficiaire"), op: idx("operateur"), montant: idx("montant"), devise: idx("devise"), statut: idx("statut"), ref: idx("reference") };
  if (c.type < 0 || c.montant < 0 || c.statut < 0 || c.ref < 0) refuse("Format inattendu : colonnes attendues Date, Type, Bénéficiaire, Opérateur, Montant, Devise, Statut, Référence.");
  const paiements = [], reversements = [];
  for (const r of l.slice(1)) {
    const ref = String(r[c.ref] || "").trim().toUpperCase();
    if (!ref) continue;
    const ligne = { date: c.date >= 0 ? dateIso(r[c.date]) : "", montant: nombre(r[c.montant]), devise: c.devise >= 0 ? String(r[c.devise] || "").trim().toUpperCase() : "", statut: String(r[c.statut] || "").trim(), operateur: c.op >= 0 ? String(r[c.op] || "").trim() : "", benef: c.benef >= 0 ? String(r[c.benef] || "").trim() : "" };
    if (ref.startsWith("SETTLE_")) reversements.push({ ref: normaliserRef(ref), ...ligne });
    else if (norm(r[c.type]).includes("paiement")) paiements.push({ ref: normaliserRef(ref), ...ligne });
  }
  return { paiements, reversements, lignes: l.length - 1 };
}

// ---------- décision pour une demande de paiement (fonction pure, testée) ----------
const OK = ["succes", "confirme", "success", "reussi", "reussie"], ECHEC = ["echoue", "echec", "failed", "annule", "refuse", "rejete"];
export function evaluer(plan, z) {
  const p = PLANS[plan];
  if (!p || !z || z.statut == null) return { action: "attendre", motif: "Référence introuvable dans l'historique." };
  const st = norm(z.statut);
  if (ECHEC.includes(st)) return { action: "verifier", motif: "Le paiement a échoué (statut « " + z.statut + " »)." };
  if (!OK.includes(st)) return { action: "attendre", motif: "Paiement pas encore confirmé (statut « " + z.statut + " »)." };
  if (String(z.devise || "").toUpperCase() !== "USD") return { action: "verifier", motif: "Devise non acceptée (" + (z.devise || "inconnue") + ") : seul le dollar est accepté." };
  if (z.settle_statut == null || !OK.includes(norm(z.settle_statut))) return { action: "attendre", motif: "Reversement correspondant pas encore trouvé." };
  if (z.settle_montant == null || z.settle_montant + 0.005 < p.prix) return { action: "verifier", motif: "Montant reçu (" + z.settle_montant + " $) inférieur au prix de la formule " + p.nom + " (" + p.prix.toFixed(2) + " $)." };
  return { action: "activer", motif: "" };
}

// ---------- import du CSV + rapprochement ----------
export async function importerEtRapprocher(env, texteCsv, parUserId) {
  const db = await base(env);
  const { paiements, reversements, lignes } = analyserCSV(texteCsv);
  const maintenant = new Date().toISOString();
  const ups = [];
  for (const p of paiements) ups.push(db.prepare(`INSERT INTO zola_paiements (ref, date, montant, devise, statut, operateur, beneficiaire, maj) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(ref) DO UPDATE SET date = excluded.date, montant = excluded.montant, devise = excluded.devise, statut = excluded.statut, operateur = excluded.operateur, beneficiaire = excluded.beneficiaire, maj = excluded.maj`).bind(p.ref, p.date, p.montant, p.devise, p.statut, p.operateur, p.benef, maintenant));
  for (const r of reversements) ups.push(db.prepare(`INSERT INTO zola_paiements (ref, settle_montant, settle_statut, maj) VALUES (?, ?, ?, ?)
    ON CONFLICT(ref) DO UPDATE SET settle_montant = excluded.settle_montant, settle_statut = excluded.settle_statut, maj = excluded.maj`).bind(r.ref, r.montant, r.statut, maintenant));
  for (let i = 0; i < ups.length; i += 400) await db.batch(ups.slice(i, i + 400));
  const bilan = await rapprocher(env, true);
  await db.prepare("INSERT INTO imports (ts, lignes, activees, a_verifier, par) VALUES (?, ?, ?, ?, ?)").bind(maintenant, lignes, bilan.activees, bilan.a_verifier, parUserId || null).run();
  return { lignes, paiements: paiements.length, reversements: reversements.length, ...bilan };
}

// compter = true : un passage d'import, donc une tentative de plus pour les demandes encore introuvables.
// Peu de requêtes à la base : tout est lu d'un coup, décidé en mémoire, puis écrit en un lot (limite de l'offre gratuite).
export async function rapprocher(env, compter) {
  const db = await base(env);
  const dems = (await db.prepare("SELECT d.*, m.plan AS m_plan, m.plan_fin AS m_fin FROM demandes_paiement d JOIN marques m ON m.id = d.marque_id WHERE d.statut IN ('en_attente','a_verifier') ORDER BY d.id").all()).results || [];
  if (!dems.length) return { activees: 0, a_verifier: 0 };
  const zmap = {};
  for (let i = 0; i < dems.length; i += 90) {
    const lot = dems.slice(i, i + 90);
    const rows = (await db.prepare("SELECT * FROM zola_paiements WHERE ref IN (" + lot.map(() => "?").join(",") + ")").bind(...lot.map(d => d.ref)).all()).results || [];
    for (const z of rows) zmap[z.ref] = z;
  }
  const marques = {};
  for (const d of dems) if (!marques[d.marque_id]) marques[d.marque_id] = { id: d.marque_id, plan: d.m_plan, plan_fin: d.m_fin };
  const maintenant = new Date(), ts = maintenant.toISOString(), ordres = [];
  let activees = 0, a_verifier = 0;
  for (const d of dems) {
    const ev = evaluer(d.plan, zmap[d.ref]);
    if (ev.action === "activer") {
      const m = marques[d.marque_id], fin = nouvelleFin(m, d.plan, maintenant);
      m.plan = d.plan; m.plan_fin = fin;
      ordres.push(db.prepare("UPDATE marques SET plan = ?, plan_fin = ? WHERE id = ?").bind(d.plan, fin, d.marque_id));
      ordres.push(db.prepare("UPDATE demandes_paiement SET statut = 'active', motif = NULL, traite_at = ? WHERE id = ?").bind(ts, d.id));
      activees++;
    } else if (ev.action === "verifier") {
      if (d.statut !== "a_verifier" || d.motif !== ev.motif) ordres.push(db.prepare("UPDATE demandes_paiement SET statut = 'a_verifier', motif = ? WHERE id = ?").bind(ev.motif, d.id));
      a_verifier++;
    } else if (d.statut === "en_attente") {
      const t = d.tentatives + (compter ? 1 : 0);
      if (t >= 2) { ordres.push(db.prepare("UPDATE demandes_paiement SET statut = 'a_verifier', tentatives = ?, motif = ? WHERE id = ?").bind(t, ev.motif, d.id)); a_verifier++; }
      else if (t !== d.tentatives || d.motif !== ev.motif) ordres.push(db.prepare("UPDATE demandes_paiement SET tentatives = ?, motif = ? WHERE id = ?").bind(t, ev.motif, d.id));
    } else a_verifier++;
  }
  for (let i = 0; i < ordres.length; i += 400) await db.batch(ordres.slice(i, i + 400));
  return { activees, a_verifier };
}

export function messageWhatsApp(texteMsg) { return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texteMsg); }

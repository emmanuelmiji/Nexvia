// Nexvia RDC – e-mails automatiques (codes de vérification) et règles sur l'adresse e-mail et le mot de passe.
// Envoi : SMTP de Gmail (smtp.gmail.com, port 465) avec le compte du projet et un « mot de passe d'application ».
// Variables Cloudflare à définir : MAIL_UTILISATEUR (l'adresse Gmail) et MAIL_MOT_DE_PASSE (le mot de passe d'application, en secret).

const enc = new TextEncoder(), dec = new TextDecoder();
export const mailConfigure = env => !!(env.__mail || (env.MAIL_UTILISATEUR && env.MAIL_MOT_DE_PASSE));

// ---------- encodage ----------
function b64octets(octets) { let s = ""; for (let i = 0; i < octets.length; i += 0x8000) s += String.fromCharCode.apply(null, octets.subarray(i, i + 0x8000)); return btoa(s); }
const b64 = texte => b64octets(enc.encode(texte));
const b64lignes = texte => b64(texte).replace(/(.{76})/g, "$1\r\n");

export function construireMessage({ de, nomDe, a, sujet, texte }) {
  return [
    "From: =?UTF-8?B?" + b64(nomDe) + "?= <" + de + ">",
    "To: <" + a + ">",
    "Subject: =?UTF-8?B?" + b64(sujet) + "?=",
    "Date: " + new Date().toUTCString(),
    "Message-ID: <" + crypto.randomUUID() + "@nexvia-rdc.pages.dev>",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "Auto-Submitted: auto-generated",
    "X-Auto-Response-Suppress: All",
    "",
    b64lignes(texte),
  ].join("\r\n");
}

// ---------- client SMTP minimal (connexion TLS directe) ----------
async function ouvrirSocket(env, hote, port) {
  if (env.__connect) return env.__connect(hote, port);                    // utilisé par les tests
  const { connect } = await import("cloudflare:sockets");
  return connect({ hostname: hote, port }, { secureTransport: "on", allowHalfOpen: false });
}
async function smtp(env, de, a, message) {
  const sock = await ouvrirSocket(env, env.__smtpHote || "smtp.gmail.com", env.__smtpPort || 465);
  const lecteur = sock.readable.getReader(), ecrivain = sock.writable.getWriter();
  let tampon = "";
  const lireReponse = async () => {
    for (;;) {
      const lignes = tampon.split("\r\n");
      for (let i = 0; i < lignes.length - 1; i++) {
        if (/^\d{3}( |$)/.test(lignes[i])) { tampon = lignes.slice(i + 1).join("\r\n"); return { code: Number(lignes[i].slice(0, 3)), texte: lignes.slice(0, i + 1).join(" | ") }; }
      }
      const { value, done } = await lecteur.read();
      if (done) throw new Error("connexion SMTP fermée par le serveur");
      tampon += dec.decode(value, { stream: true });
    }
  };
  const dire = async (ligne, attendus) => {
    await ecrivain.write(enc.encode(ligne + "\r\n"));
    const r = await lireReponse();
    if (!attendus.includes(r.code)) throw new Error("SMTP " + r.code + " : " + r.texte.slice(0, 160));
    return r;
  };
  try {
    const accueil = await lireReponse(); if (accueil.code !== 220) throw new Error("SMTP accueil " + accueil.code);
    await dire("EHLO nexvia-rdc.pages.dev", [250]);
    await dire("AUTH LOGIN", [334]); await dire(b64(env.MAIL_UTILISATEUR || "test"), [334]); await dire(b64(env.MAIL_MOT_DE_PASSE || "test"), [235]);
    await dire("MAIL FROM:<" + de + ">", [250]); await dire("RCPT TO:<" + a + ">", [250, 251]); await dire("DATA", [354]);
    await ecrivain.write(enc.encode(message.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..") + "\r\n.\r\n"));
    const fin = await lireReponse(); if (fin.code !== 250) throw new Error("SMTP envoi " + fin.code + " : " + fin.texte.slice(0, 160));
    try { await dire("QUIT", [221]); } catch (e) { /* sans importance */ }
  } finally { try { lecteur.releaseLock(); ecrivain.releaseLock(); await sock.close(); } catch (e) { /* idem */ } }
}
export async function envoyerCourriel(env, a, sujet, texte) {
  if (env.__mail) return env.__mail({ a, sujet, texte });                 // utilisé par les tests
  if (!mailConfigure(env)) throw new Error("envoi d'e-mails non configuré");
  const de = String(env.MAIL_UTILISATEUR).trim();
  const message = construireMessage({ de, nomDe: "Nexvia RDC", a, sujet, texte });
  await Promise.race([smtp(env, de, a, message), new Promise((_, rej) => setTimeout(() => rej(new Error("délai dépassé pendant l'envoi")), 15000))]);
}
export const texteCode = (code, but) => [
  "Bonjour,", "",
  but === "connexion" ? "Voici votre code pour vous connecter à Nexvia RDC :" : but === "recuperation" ? "L'équipe Nexvia RDC a lancé la récupération de votre compte. Voici le code à lui communiquer, uniquement si c'est bien vous qui avez demandé de l'aide :" : "Voici votre code pour créer votre compte Nexvia RDC :", "",
  "    " + code, "",
  "Il est valable 10 minutes. Ne le communiquez à personne : l'équipe Nexvia RDC ne vous le demandera jamais.", "",
  "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.", "",
  "—", "Ceci est un message automatique envoyé par un robot. Merci de ne pas y répondre.", "Nexvia RDC · Kinshasa, République démocratique du Congo",
].join("\n");

// ---------- adresse e-mail ----------
const FAUTES = { "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "gnail.com": "gmail.com", "gmaill.com": "gmail.com", "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gmail.om": "gmail.com", "gmil.com": "gmail.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.con": "yahoo.com", "yahoo.co": "yahoo.com", "yahou.com": "yahoo.com", "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.con": "hotmail.com", "outlok.com": "outlook.com", "outlook.con": "outlook.com", "outloook.com": "outlook.com" };
const JETABLES = new Set(["mailinator.com", "yopmail.com", "yopmail.fr", "guerrillamail.com", "guerrillamail.net", "10minutemail.com", "tempmail.com", "temp-mail.org", "trashmail.com", "sharklasers.com", "getnada.com", "dispostable.com", "maildrop.cc", "throwawaymail.com", "fakeinbox.com", "mintemail.com", "mohmal.com", "emailondeck.com", "tempail.com", "tmpmail.org", "discard.email", "tempr.email", "mail.tm", "moakt.com"]);
export function verifierEmail(brut) {
  const email = String(brut || "").trim().toLowerCase();
  if (!email) return { erreur: "Saisissez votre adresse e-mail." };
  if (email.length > 120 || !/^[a-z0-9][a-z0-9._%+-]{0,63}@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(email) || email.includes("..") || email.split("@")[0].endsWith("."))
    return { erreur: "Cette adresse e-mail n'est pas valide. Exemple : prenom@gmail.com" };
  const [local, domaine] = email.split("@");
  if (FAUTES[domaine]) return { erreur: "Vouliez-vous dire " + local + "@" + FAUTES[domaine] + " ? Vérifiez l'adresse." };
  if (JETABLES.has(domaine)) return { erreur: "Les adresses e-mail temporaires ne sont pas acceptées. Utilisez votre vraie adresse (Gmail, Yahoo, Outlook…)." };
  return { email, domaine };
}
// Le domaine sait-il recevoir des e-mails ? (requête DNS « MX » ; en cas de doute on laisse passer : l'envoi du code fera la vraie vérification)
export async function domaineAccepteLesMails(domaine, env) {
  if (env.__sansMX) return true;
  const demander = async type => {
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 2500);
    try { const r = await fetch("https://cloudflare-dns.com/dns-query?name=" + encodeURIComponent(domaine) + "&type=" + type, { headers: { accept: "application/dns-json" }, signal: ctl.signal }); return r.ok ? await r.json() : null; }
    finally { clearTimeout(t); }
  };
  try {
    const mx = await demander("MX"); if (!mx) return true;
    if (mx.Status === 3) return false;                                    // le domaine n'existe pas
    const reponses = (mx.Answer || []).filter(x => x.type === 15);
    if (reponses.length) return !reponses.every(x => /^\d+\s+\.?$/.test(String(x.data)));   // « MX nul » = n'accepte aucun e-mail
    const a = await demander("A"); return !a || (a.Answer || []).some(x => x.type === 1);   // sans MX : accepté seulement s'il a une adresse
  } catch (e) { return true; }
}

// ---------- mot de passe ----------
const MDP_FAIBLES = new Set(["motdepasse", "motdepasse1", "motdepasse12", "motdepasse123", "password", "password1", "password123", "12345678", "123456789", "1234567890", "azerty123", "azerty1234", "azertyuiop", "azertyuiop1", "qwerty123", "qwertyuiop", "abcd1234", "abc12345", "azerty12", "kinshasa1", "kinshasa123", "nexvia123", "nexvia2026", "congo123", "congo2026", "rdcongo1", "iloveyou1", "admin1234", "bonjour123", "bonjour1"]);
export function verifierMotDePasse(mdp, { email, nom } = {}) {
  mdp = String(mdp || "");
  if (mdp.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
  if (mdp.length > 100) return "Le mot de passe est trop long (100 caractères maximum).";
  if (!/[A-Za-zÀ-ÿ]/.test(mdp)) return "Le mot de passe doit contenir au moins une lettre.";
  if (!/\d/.test(mdp)) return "Le mot de passe doit contenir au moins un chiffre.";
  if (/^(.)\1+$/.test(mdp)) return "Ce mot de passe est trop simple.";
  const bas = mdp.toLowerCase();
  if (MDP_FAIBLES.has(bas)) return "Ce mot de passe est trop courant. Choisissez-en un moins facile à deviner.";
  const local = String(email || "").split("@")[0].toLowerCase();
  if (local.length >= 4 && bas.includes(local)) return "Le mot de passe ne doit pas contenir votre adresse e-mail.";
  for (const m of String(nom || "").toLowerCase().split(/[^a-zà-ÿ]+/)) if (m.length >= 4 && bas.includes(m)) return "Le mot de passe ne doit pas contenir votre nom.";
  return null;
}

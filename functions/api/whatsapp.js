// Nexvia RDC – point d'entrée du robot WhatsApp (webhook de l'API WhatsApp Business de Meta).
// GET : vérification demandée par Meta au moment de la configuration. POST : messages reçus (signés par Meta).
import * as W from "../_lib/whatsapp.js";

const noter = (env, genre, detail) => W.journaliser(env, genre, detail);
const resume = p => { try { let m = 0, st = 0; for (const e of p.entry || []) for (const c of e.changes || []) { m += (c.value && c.value.messages || []).length; st += (c.value && c.value.statuses || []).length; } return m + " message(s), " + st + " statut(s)"; } catch (e) { return "?"; } };

const rep = (corps, status = 200) => new Response(corps, { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });

export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  if (u.searchParams.get("hub.mode") === "subscribe") {
    if (env.WA_VERIFY_TOKEN && u.searchParams.get("hub.verify_token") === env.WA_VERIFY_TOKEN) { await noter(env, "verif_ok", "Meta a vérifié le webhook"); return rep(u.searchParams.get("hub.challenge") || ""); }
    await noter(env, "verif_refusee", env.WA_VERIFY_TOKEN ? "mauvais jeton de vérification" : "WA_VERIFY_TOKEN absent de Cloudflare");
  }
  return rep("Refusé", 403);
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  if (!env.WA_APP_SECRET) { await noter(env, "post_sans_secret", "WA_APP_SECRET absent de Cloudflare"); return rep("Non configuré", 503); }                 // jamais de traitement sans signature
  const octets = new Uint8Array(await request.arrayBuffer());
  if (octets.length > 300000) { await noter(env, "post_trop_gros", octets.length + " octets"); return rep("Trop volumineux", 413); }
  if (!(await W.signatureValide(octets, request.headers.get("x-hub-signature-256"), env.WA_APP_SECRET))) { await noter(env, "post_signature_invalide", "la clé secrète WA_APP_SECRET ne correspond pas à celle de Meta"); return rep("Signature invalide", 401); }
  let payload; try { payload = JSON.parse(new TextDecoder().decode(octets)); } catch (e) { return rep("ok"); }
  await noter(env, "post_ok", resume(payload));
  const travail = W.traiterPayload(env, payload).catch(async e => { console.error("nexvia-wa", e && e.stack || e); await noter(env, "erreur_traitement", e && e.message || e); });
  if (typeof ctx.waitUntil === "function") ctx.waitUntil(travail); else await travail;   // on répond vite à Meta, le travail continue
  return rep("ok");
}

export const onRequest = () => rep("Méthode non autorisée", 405);

// Nexvia RDC – point d'entrée du robot WhatsApp (webhook de l'API WhatsApp Business de Meta).
// GET : vérification demandée par Meta au moment de la configuration. POST : messages reçus (signés par Meta).
import * as W from "../_lib/whatsapp.js";

const rep = (corps, status = 200) => new Response(corps, { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });

export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  if (u.searchParams.get("hub.mode") === "subscribe" && env.WA_VERIFY_TOKEN && u.searchParams.get("hub.verify_token") === env.WA_VERIFY_TOKEN)
    return rep(u.searchParams.get("hub.challenge") || "");
  return rep("Refusé", 403);
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  if (!env.WA_APP_SECRET) return rep("Non configuré", 503);                 // jamais de traitement sans signature
  const octets = new Uint8Array(await request.arrayBuffer());
  if (octets.length > 300000) return rep("Trop volumineux", 413);
  if (!(await W.signatureValide(octets, request.headers.get("x-hub-signature-256"), env.WA_APP_SECRET))) return rep("Signature invalide", 401);
  let payload; try { payload = JSON.parse(new TextDecoder().decode(octets)); } catch (e) { return rep("ok"); }
  const travail = W.traiterPayload(env, payload).catch(e => console.error("nexvia-wa", e && e.stack || e));
  if (typeof ctx.waitUntil === "function") ctx.waitUntil(travail); else await travail;   // on répond vite à Meta, le travail continue
  return rep("ok");
}

export const onRequest = () => rep("Méthode non autorisée", 405);

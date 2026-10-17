// Nexvia – compteurs anonymes par lieu (aucune donnée personnelle) : fiche ouverte, appel, WhatsApp, itinéraire, favori.
const ACTIONS = ["vue", "appel", "wa", "itin", "fav"];
const rep = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
export async function onRequestPost({ request, env }) {
  if (!env.DEMANDES) return rep({ ok: false }, 503);
  const origine = request.headers.get("Origin");
  if (origine && origine !== new URL(request.url).origin) return rep({ ok: false }, 403);
  let c; try { c = await request.json(); } catch (e) { return rep({ ok: false }, 400); }
  const id = c && c.id, action = c && c.action;
  if (typeof id !== "string" || id.length < 3 || id.length > 120 || !/^[\p{L}\p{N}_\- ]+$/u.test(id) || !ACTIONS.includes(action)) return rep({ ok: false }, 400);
  const cle = "lieu:" + id + ":" + action;
  const n = parseInt((await env.DEMANDES.get(cle)) || "0", 10) + 1;
  await env.DEMANDES.put(cle, String(n));
  // Adresses de commerçants (id « adr-12 ») : on garde aussi un compteur par mois, pour les statistiques Premium.
  if (/^adr-\d+$/.test(id)) {
    const mois = new Date().toISOString().slice(0, 7), cm = cle + ":" + mois;
    await env.DEMANDES.put(cm, String(parseInt((await env.DEMANDES.get(cm)) || "0", 10) + 1), { expirationTtl: 60 * 60 * 24 * 400 });
  }
  return rep({ ok: true });
}
export const onRequest = () => rep({ ok: false }, 405);

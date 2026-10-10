// Nexvia – enregistre une demande de commune (un compteur par commune, aucune donnée personnelle).
const COMMUNES = ["Bandalungwa","Barumbu","Bumbu","Kalamu","Kasa-Vubu","Kimbanseke","Kinshasa","Kintambo","Kisenso","Lemba","Limete","Lingwala","Makala","Maluku","Masina","Matete","Mont-Ngafula","Ndjili","Ngaba","Ngaliema","Ngiri-Ngiri","Nsele","Selembao","Autre ville du Congo"];
const rep = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
export async function onRequestPost({ request, env }) {
  if (!env.DEMANDES) return rep({ ok: false, erreur: "stockage non configuré" }, 503);
  const origine = request.headers.get("Origin");
  if (origine && origine !== new URL(request.url).origin) return rep({ ok: false }, 403);
  let corps; try { corps = await request.json(); } catch (e) { return rep({ ok: false }, 400); }
  const commune = corps && corps.commune;
  if (typeof commune !== "string" || !COMMUNES.includes(commune)) return rep({ ok: false }, 400);
  const cle = "commune:" + commune;
  const n = parseInt((await env.DEMANDES.get(cle)) || "0", 10) + 1;
  await env.DEMANDES.put(cle, String(n));
  return rep({ ok: true });
}
export const onRequest = () => rep({ ok: false }, 405);

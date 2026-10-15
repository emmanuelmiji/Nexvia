// Nexvia RDC – outils communs des pages compte, tarifs, espace commerce et administration.
// Tout contenu venant du serveur est inséré avec textContent (jamais innerHTML) : pas de faille d'injection.
window.NX = (function () {
  const CFG = {
    ZOLA_LIEN: "https://zolamoneytrans.com/smart_pay.html?to=nEDXgnNkGQRmXSGvrK9hgbEqPGp2", // lien de paiement du marchand
    WHATSAPP: "243862675126",
  };
  async function api(methode, chemin, corps) {
    const opt = { method: methode, headers: { "content-type": "application/json" }, credentials: "same-origin" };
    if (methode === "POST") { opt.headers["x-nx"] = "1"; opt.body = JSON.stringify(corps || {}); }
    let r, d = null;
    try { r = await fetch("/api/" + chemin, opt); } catch (e) { const er = new Error("Pas de connexion. Vérifiez votre réseau et réessayez."); er.status = 0; throw er; }
    try { d = await r.json(); } catch (e) {}
    if (!r.ok || !d || d.ok === false) { const er = new Error((d && d.erreur) || "Une erreur est survenue."); er.status = r.status; throw er; }
    return d;
  }
  // h("div", {class:"x", onclick:fn}, "texte", autreNoeud)
  function h(tag, attrs, ...enfants) {
    const e = document.createElement(tag);
    for (const k in (attrs || {})) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
      else if (k === "class") e.className = v;
      else if (v === true) e.setAttribute(k, "");
      else e.setAttribute(k, v);
    }
    for (const c of enfants.flat(Infinity)) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(String(c))); }
    return e;
  }
  function vider(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  let tt;
  function toast(msg, mauvais) {
    let t = document.getElementById("toast"); if (!t) { t = h("div", { id: "toast" }); document.body.append(t); }
    t.textContent = msg; t.className = mauvais ? "bad" : ""; t.style.display = "block"; clearTimeout(tt); tt = setTimeout(() => { t.style.display = "none"; }, 4200);
  }
  const wa = (texte, numero) => "https://wa.me/" + (numero || CFG.WHATSAPP) + "?text=" + encodeURIComponent(texte);
  const chiffres = s => String(s || "").replace(/\D/g, "");
  function date(iso) { if (!iso) return ""; const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); }
  const dollars = n => (Math.round(n * 100) / 100).toFixed(2).replace(".", ",") + " $";
  function entete(utilisateur) {
    const nav = h("nav", {}, h("a", { href: "/" }, "Carte"), h("a", { href: "/tarifs/" }, "Tarifs"));
    if (utilisateur) {
      nav.append(h("a", { href: "/commerce/" }, "Mon commerce"));
      if (utilisateur.admin) nav.append(h("a", { href: "/admin/" }, "Admin"));
      nav.append(h("a", { href: "/compte/" }, "Mon compte"));
    } else nav.append(h("a", { href: "/compte/" }, "Connexion"));
    return h("header", { class: "nx" }, h("a", { class: "marque", href: "/" }, "Nexvia ", h("b", {}, "RDC")), nav);
  }
  async function moi() { try { return (await api("GET", "auth/moi")).utilisateur; } catch (e) { return null; } }
  // Réduit une photo dans le navigateur (≈ 900 px, JPEG) avant l'envoi : rapide sur 4G et peu coûteux à stocker.
  function reduirePhoto(fichier, max = 900, qualite = 0.72) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(fichier), img = new Image();
      img.onload = () => {
        let { width: w, height: hh } = img; const k = Math.min(1, max / Math.max(w, hh)); w = Math.round(w * k); hh = Math.round(hh * k);
        const c = document.createElement("canvas"); c.width = w; c.height = hh; c.getContext("2d").drawImage(img, 0, 0, w, hh); URL.revokeObjectURL(url);
        const d = c.toDataURL("image/jpeg", qualite); res({ mime: "image/jpeg", data: d.split(",")[1] });
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("Cette image ne peut pas être lue.")); };
      img.src = url;
    });
  }
  return { CFG, api, h, vider, toast, wa, chiffres, date, dollars, entete, moi, reduirePhoto };
})();

// Nexvia RDC – outils communs des pages compte, tarifs, espace commerce et administration.
// Tout contenu venant du serveur est inséré avec textContent (jamais innerHTML) : pas de faille d'injection.
window.NX = (function () {
  const CFG = {
    ZOLA_LIEN: "https://zolamoneytrans.com/smart_pay.html?to=nEDXgnNkGQRmXSGvrK9hgbEqPGp2", // lien de paiement du marchand
    WHATSAPP: "243841385686",
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
      nav.append(h("a", { href: "/commerce/" }, "Mon espace", utilisateur.plan ? [" ", couronne(utilisateur.plan, 14)] : null));
      if (utilisateur.admin) nav.append(h("a", { href: "/admin/" }, "Admin"));
      nav.append(h("a", { href: "/compte/" }, "Mon compte"));
    } else nav.append(h("a", { href: "/compte/" }, "Connexion"));
    return h("header", { class: "nx" }, h("a", { class: "marque", href: "/" }, drapeau(26), " Nexvia ", h("b", {}, "RDC")), nav);
  }
  // Petite couronne (SVG) : grise pour Standard, dorée pour Premium.
  function couronne(plan, px) {
    if (plan !== "standard" && plan !== "premium") return null;
    const ns = "http://www.w3.org/2000/svg", s = document.createElementNS(ns, "svg"), p = document.createElementNS(ns, "path");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("width", px || 18); s.setAttribute("height", px || 18); s.setAttribute("class", "couronne " + plan); s.setAttribute("aria-label", "Formule " + plan);
    p.setAttribute("d", "M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z"); p.setAttribute("fill", "currentColor"); s.append(p); return s;
  }
  // ---------- touches du pays : drapeau et étoile ----------
  const NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs, ...enf) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); enf.forEach(x => e.append(x)); return e; }
  const ETOILE = "0,-10 2.25,-3.09 9.51,-3.09 3.63,1.18 5.88,8.09 0,3.82 -5.88,8.09 -3.63,1.18 -9.51,-3.09 -2.25,-3.09";
  function drapeau(largeur) {
    const w = largeur || 30, s = svg("svg", { width: w, height: Math.round(w * 2 / 3), viewBox: "0 0 60 40", "aria-hidden": "true", class: "drapeau" });
    s.append(svg("rect", { width: 60, height: 40, fill: "#0a8fe8" }), svg("line", { x1: -4, y1: 44, x2: 64, y2: -4, stroke: "#f7d618", "stroke-width": 13 }), svg("line", { x1: -4, y1: 44, x2: 64, y2: -4, stroke: "#ce1021", "stroke-width": 8 }),
      svg("g", { transform: "translate(11,11) scale(.62)" }, svg("polygon", { points: ETOILE, fill: "#f7d618" })));
    return s;
  }
  function etoile(px) { const s = svg("svg", { width: px || 14, height: px || 14, viewBox: "-11 -11 22 22", "aria-hidden": "true", class: "etoile" }); s.append(svg("polygon", { points: ETOILE, fill: "#f7d618" })); return s; }

  // ---------- horaires : sélecteur (jamais de texte libre) ----------
  const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"], JOURS_LONGS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const HEURES = []; for (let i = 0; i < 24; i++) for (const m of ["00", "30"]) HEURES.push(String(i).padStart(2, "0") + ":" + m);
  const FINS = HEURES.slice(1).concat(["24:00"]);
  const hlib = t => t === "24:00" ? "24h00 (minuit)" : t.replace(":", "h");
  const memeJour = (a, b) => a.ouvert === b.ouvert && (!a.ouvert || (a.de === b.de && a.a === b.a));
  function horairesTexte(m) {
    if (m.every(j => j.ouvert && j.de === "00:00" && j.a === "24:00")) return "24h/24";
    const seg = []; let i = 0;
    while (i < 7) { let j = i; while (j + 1 < 7 && memeJour(m[j + 1], m[i])) j++; seg.push((i === j ? JOURS[i] : JOURS[i] + "–" + JOURS[j]) + " " + (m[i].ouvert ? m[i].de + "–" + m[i].a : "fermé")); i = j + 1; }
    return seg.join(" · ");
  }
  function horairesLire(txt) {
    const m = JOURS.map(() => ({ ouvert: false, de: "08:00", a: "18:00" })); txt = String(txt || "").trim();
    if (txt === "24h/24") return m.map(() => ({ ouvert: true, de: "00:00", a: "24:00" }));
    if (!txt) return null; let vu = 0;
    for (const part of txt.split(" · ")) {
      const r = part.match(/^(Lun|Mar|Mer|Jeu|Ven|Sam|Dim)(?:–(Lun|Mar|Mer|Jeu|Ven|Sam|Dim))? (?:(\d\d:\d\d)–(\d\d:\d\d)|fermé)$/); if (!r) return null;
      const i = JOURS.indexOf(r[1]), j = r[2] ? JOURS.indexOf(r[2]) : i; if (j < i) return null;
      for (let k = i; k <= j; k++) { m[k] = r[3] ? { ouvert: true, de: r[3], a: r[4] } : { ouvert: false, de: "08:00", a: "18:00" }; vu++; }
    }
    return vu ? m : null;
  }
  // Affichage lisible : « Lun–Sam 08h00–18h00 » (une ligne par groupe de jours)
  const horairesJolis = txt => String(txt || "").split(" · ").filter(Boolean).map(x => x.replace(/(\d\d):(\d\d)/g, "$1h$2"));
  function horaires(initial) {
    let m = horairesLire(initial) || JOURS.map((_, i) => ({ ouvert: i < 6, de: "08:00", a: "18:00" })), perso = false;
    const racine = h("div", { class: "hor" });
    const ouverts = () => m.filter(j => j.ouvert), ref = () => ouverts()[0] || { de: "08:00", a: "18:00" };
    const uniforme = () => { const o = ouverts(); return o.every(j => memeJour(j, o[0])); };
    const choisir = jours => { const r = ref(); m = JOURS.map((_, i) => ({ ouvert: jours.includes(i), de: r.de, a: r.a })); };
    const motif = () => m.map(j => j.ouvert ? 1 : 0).join("");
    const select = (val, liste, fn, desactive) => { const s = h("select", { disabled: desactive || false }, liste.map(t => h("option", { value: t, selected: t === val }, hlib(t)))); s.addEventListener("change", () => fn(s.value)); return s; };
    function dessiner() {
      vider(racine);
      const chips = [["Lun–Sam", [0, 1, 2, 3, 4, 5]], ["Lun–Ven", [0, 1, 2, 3, 4]], ["Tous les jours", [0, 1, 2, 3, 4, 5, 6]]];
      const tout24 = m.every(j => j.ouvert && j.de === "00:00" && j.a === "24:00");
      racine.append(h("div", { class: "chips" },
        chips.map(([t, js]) => h("button", { type: "button", class: "chip" + (!perso && !tout24 && motif() === JOURS.map((_, i) => js.includes(i) ? 1 : 0).join("") ? " on" : ""), onclick: () => { choisir(js); perso = false; dessiner(); } }, t)),
        h("button", { type: "button", class: "chip" + (tout24 ? " on" : ""), onclick: () => { m = JOURS.map(() => ({ ouvert: true, de: "00:00", a: "24:00" })); perso = false; dessiner(); } }, "24h/24"),
        h("button", { type: "button", class: "chip" + (perso || !uniforme() ? " on" : ""), onclick: () => { perso = !perso; dessiner(); } }, "Personnaliser")));
      if (perso || !uniforme()) {
        racine.append(h("div", { class: "jours" }, m.map((j, i) => h("div", { class: "jour" + (j.ouvert ? "" : " ferme") },
          h("label", { class: "oui" }, h("input", { type: "checkbox", checked: j.ouvert, onchange: ev => { j.ouvert = ev.target.checked; dessiner(); } }), h("span", {}, JOURS_LONGS[i])),
          j.ouvert ? h("div", { class: "plage" }, select(j.de, HEURES, v => { j.de = v; dessiner(); }), h("span", {}, "à"), select(j.a, FINS, v => { j.a = v; dessiner(); })) : h("span", { class: "muted" }, "Fermé")))));
      } else if (!tout24) {
        const r = ref();
        racine.append(h("div", { class: "plage grand" }, h("label", {}, "Ouvre à", select(r.de, HEURES, v => { ouverts().forEach(j => { j.de = v; }); dessiner(); })), h("label", {}, "Ferme à", select(r.a, FINS, v => { ouverts().forEach(j => { j.a = v; }); dessiner(); }))));
      }
      racine.append(h("div", { class: "resume" }, h("b", {}, "Affichage : "), horairesJolis(horairesTexte(m)).join(" · ")));
    }
    dessiner();
    const erreur = () => { const o = ouverts(); if (!o.length) return "Choisissez au moins un jour d'ouverture."; if (o.some(j => j.de === j.a)) return "L'heure d'ouverture et de fermeture doivent être différentes."; return null; };
    return { el: racine, valeur: () => horairesTexte(m), erreur };
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
  return { CFG, api, h, vider, toast, wa, chiffres, date, dollars, entete, moi, reduirePhoto, couronne, drapeau, etoile, horaires, horairesJolis };
})();

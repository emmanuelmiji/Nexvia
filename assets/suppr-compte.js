/* Nexvia RDC - suppression de compte (exigence App Store 5.1.1(v)). Bouton visible seulement si connecte. */
(function () {
  "use strict";
  var ID = "nx-suppr";
  function el(tag, css, txt) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (txt) e.textContent = txt; return e; }
  function monter() {
    if (document.getElementById(ID)) return;
    var boite = el("div", "max-width:520px;margin:28px auto 40px;padding:0 16px;text-align:center;font-family:inherit");
    boite.id = ID;
    var lien = el("button", "background:none;border:0;color:#fff;text-decoration:underline;opacity:.85;font:inherit;font-size:14px;cursor:pointer;padding:10px", "Supprimer mon compte");
    lien.type = "button";
    var panneau = el("div", "display:none;margin-top:12px;background:#fff;color:#1b2a41;border-radius:14px;padding:18px;text-align:left;box-shadow:0 6px 24px rgba(0,0,0,.25)");
    panneau.appendChild(el("strong", "display:block;font-size:16px;margin-bottom:6px", "Supprimer définitivement mon compte"));
    panneau.appendChild(el("p", "font-size:14px;line-height:1.4;margin:0 0 10px", "Votre compte, vos adresses et vos photos seront effacés. Cette action est irréversible. Saisissez votre mot de passe pour confirmer."));
    var champ = el("input", "width:100%;box-sizing:border-box;padding:12px;border:1px solid #c5cedb;border-radius:10px;font-size:16px;margin-bottom:10px");
    champ.type = "password"; champ.autocomplete = "current-password"; champ.placeholder = "Mot de passe";
    var msg = el("div", "font-size:14px;min-height:18px;margin-bottom:8px;color:#b00020");
    var ok = el("button", "background:#c62828;color:#fff;border:0;border-radius:10px;padding:12px 16px;font-size:15px;font-weight:700;cursor:pointer;margin-right:8px", "Supprimer définitivement");
    ok.type = "button";
    var non = el("button", "background:#e8edf4;color:#1b2a41;border:0;border-radius:10px;padding:12px 16px;font-size:15px;cursor:pointer", "Annuler");
    non.type = "button";
    panneau.appendChild(champ); panneau.appendChild(msg); panneau.appendChild(ok); panneau.appendChild(non);
    boite.appendChild(lien); boite.appendChild(panneau);
    lien.addEventListener("click", function () { panneau.style.display = "block"; lien.style.display = "none"; champ.focus(); });
    non.addEventListener("click", function () { panneau.style.display = "none"; lien.style.display = ""; champ.value = ""; msg.textContent = ""; });
    ok.addEventListener("click", function () {
      if (!champ.value) { msg.textContent = "Saisissez votre mot de passe."; return; }
      ok.disabled = true; msg.style.color = "#1b2a41"; msg.textContent = "Suppression en cours…";
      fetch("/api/auth/supprimer", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json", "x-nx": "1" }, body: JSON.stringify({ mdp: champ.value }) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { r: r, j: j }; }); })
        .then(function (x) {
          if (x.r.ok && x.j && x.j.ok) {
            msg.style.color = "#1b7f3b"; msg.textContent = "Votre compte a été supprimé.";
            setTimeout(function () { location.href = "/"; }, 1500);
          } else {
            ok.disabled = false; msg.style.color = "#b00020";
            msg.textContent = (x.j && (x.j.erreur || x.j.error || x.j.message)) || "Suppression impossible. Réessayez ou écrivez à contact@nexviardc.com.";
          }
        })
        .catch(function () { ok.disabled = false; msg.style.color = "#b00020"; msg.textContent = "Connexion impossible. Réessayez."; });
    });
    (document.getElementById("app") || document.body).appendChild(boite);
  }
  function verifier() {
    fetch("/api/auth/moi", { credentials: "same-origin" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var present = document.getElementById(ID);
        if (j && j.utilisateur) { if (!present) monter(); } else if (present) { present.remove(); }
      }).catch(function () {});
  }
  var t;
  function plan() { clearTimeout(t); t = setTimeout(verifier, 400); }
  new MutationObserver(function (m) {
    for (var i = 0; i < m.length; i++) { if (m[i].target && m[i].target.closest && m[i].target.closest("#" + ID)) return; }
    plan();
  }).observe(document.body, { childList: true, subtree: true });
  plan();
})();

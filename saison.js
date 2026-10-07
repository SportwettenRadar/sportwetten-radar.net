/* =====================================================================
   SAISONKALENDER
   Werte = durchschnittliche Anzahl Spiele pro Monat in den Ligen der
   Live-Wetten-Weissliste (Stand Oktober 2026), Saisons 2024/25 und
   2025/26, ohne WM/EM. Europa aus Spielplaenen (openfootball), J1 League
   ab 2026/27 im neuen August-bis-Juni-Rhythmus, Superettan geschaetzt.
   Suedamerika-Ligen nicht gezaehlt: Anstoss fast nur nachts, ausserhalb
   des Versandfensters 8-23 Uhr.

   Normalerweise musst du hier NICHTS aendern. Einmal pro Saison (August)
   nur die Laenderspiel-Termine in der Fussnote (index.html, #saison)
   aktualisieren.
   ===================================================================== */
window.SAISON = [
  { k: "Jan", n: "Januar",    spiele: 304, lsp: false, note: "Bis etwa Mitte Januar Winterpause in den meisten unserer Ligen, danach wieder volle Spieltage." },
  { k: "Feb", n: "Februar",   spiele: 354, lsp: false, note: "Alle Ligen laufen, dazu die K.-o.-Runden der Champions League." },
  { k: "Mär", n: "März",      spiele: 346, lsp: true,  note: "Alle Ligen laufen. Ende März ruht der Ligabetrieb gut eine Woche wegen Länderspielen." },
  { k: "Apr", n: "April",     spiele: 374, lsp: false, note: "Der spielreichste Monat des Jahres: Saisonendspurt in ganz Europa." },
  { k: "Mai", n: "Mai",       spiele: 344, lsp: false, note: "Saisonfinale, in vielen Ligen mit Play-offs und Relegation bis Ende Mai." },
  { k: "Jun", n: "Juni",      spiele: 32,  lsp: true,  note: "Sommerpause in Europa. Live-Wetten gibt es nur vereinzelt, etwa aus Schweden." },
  { k: "Jul", n: "Juli",      spiele: 38,  lsp: false, note: "Sommerpause in Europa, nur vereinzelt Live-Wetten. Die ersten Ligen starten Anfang August." },
  { k: "Aug", n: "August",    spiele: 330, lsp: false, note: "Saisonstart: die Niederlande ab Anfang August, die meisten Ligen bis Ende August." },
  { k: "Sep", n: "September", spiele: 362, lsp: true,  note: "Alle Ligen laufen. Ab etwa dem 20. beginnt die lange Länderspielpause (gut zwei Wochen)." },
  { k: "Okt", n: "Oktober",   spiele: 354, lsp: true,  note: "Die Länderspielpause endet Anfang Oktober, danach wieder volle Spieltage." },
  { k: "Nov", n: "November",  spiele: 364, lsp: true,  note: "Alle Ligen laufen. Mitte November ruht der Ligabetrieb gut eine Woche wegen Länderspielen." },
  { k: "Dez", n: "Dezember",  spiele: 302, lsp: false, note: "Volle Spieltage bis kurz vor Weihnachten, danach Winterpause in den meisten unserer Ligen." }
];

(function () {
  var root = document.querySelector("[data-saison]");
  if (!root || !window.SAISON) return;
  var plot = root.querySelector("[data-s-plot]");
  var axis = root.querySelector("[data-s-axis]");
  var det = root.querySelector("[data-s-detail]");
  var data = window.SAISON;
  var max = Math.max.apply(null, data.map(function (m) { return m.spiele; }));

  function tier(v) { return v >= 340 ? "h" : v < 100 ? "n" : "m"; }
  var TIER = { h: "Hochsaison", m: "Normal", n: "Ruhig" };

  function show(i) {
    var m = data[i], t = tier(m.spiele);
    det.innerHTML =
      '<span class="s-d-name">' + m.n + '</span>' +
      '<span class="s-d-tier s-' + t + '">' + TIER[t] + '</span>' +
      '<span class="s-d-count">Ø ' + m.spiele + ' Spiele</span>' +
      '<p>' + m.note + '</p>';
    var bars = plot.children;
    for (var j = 0; j < bars.length; j++) bars[j].classList.toggle("is-active", j === i);
  }

  data.forEach(function (m, i) {
    var t = tier(m.spiele);
    var h = Math.max(2, (m.spiele / max) * 100);
    var b = document.createElement("button");
    b.type = "button";
    b.className = "s-bar s-" + t;
    b.setAttribute("aria-label", m.n + ": " + TIER[t] + ", durchschnittlich " + m.spiele + " Spiele");
    b.innerHTML = '<span style="height:' + h.toFixed(1) + '%"></span>';
    b.addEventListener("mouseenter", function () { show(i); });
    b.addEventListener("focus", function () { show(i); });
    b.addEventListener("click", function () { show(i); });
    plot.appendChild(b);
    axis.insertAdjacentHTML("beforeend",
      '<div>' + m.k + (m.lsp ? '<i class="s-lsp" title="Länderspielpause"></i>' : '') + '</div>');
  });

  show(new Date().getMonth()); // aktueller Monat vorausgewählt
})();

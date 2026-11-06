/* Trackrecord — liest window.TRACKRECORD (Monate), window.TRACKRECORD_JAHRE (Kalenderjahre)
   und window.TRACKRECORD_TAGE (kumulierte Einsätze je Tag, je Jahr bei 0 beginnend) aus trackrecord-daten.js.
   Anzeige-Regeln: Monate zeigen Wetten, Treffer (mit Prozent) und Ø-Quote. Einsätze und Rendite gibt es nur im Jahr,
   und erst ab 100 Live-Wetten (die Daten dafür kommen als null, solange das Jahr darunter liegt).
   Startseite und Übersicht: Jahr + Monatstabelle. Monatsseiten: <div data-tr data-tr-monat="JJJJ-MM">.
   Diese Datei muss für neue Monate nicht angefasst werden. */
(function () {
  var root = document.querySelector("[data-tr]");
  if (!root) return;
  var body = root.querySelector("[data-tr-body]") || root;

  var MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
    "August", "September", "Oktober", "November", "Dezember"];
  function fussnote(series) {
    var rr = series.filter(function (x) { return x.rr; });
    /* Komplett als Testphase gerechneter Zeitraum (z. B. September): Zeitraum der ganzen Testphase nennen */
    if (rr.length && rr.length === series.length) rr = tage.filter(function (x) { return x.rr; });
    var von = rr.length ? rr[0].d : "2026-09-01", bis = rr.length ? rr[rr.length - 1].d : "2026-10-10";
    return "* " + dm(von) + "–" + dm(bis) + ": Testphase, mit den Regeln vom 11.10.2026 berechnet.";
  }
  var PFLICHT = "Alle Zahlen gelten bei gleichem Einsatz auf jede Live-Wette. Verlustserien gehören dazu.";
  var QUOTE_DEF = "Ø-Quote: Durchschnitt der Quoten aller gesetzten Live-Wetten im Zeitraum.";
  var HINWEIS = "Einsätze und Rendite weisen wir je Kalenderjahr aus, sobald 100 Live-Wetten vorliegen. " +
    "Für Tage, Wochen und Monate nicht, weil kurze Zeiträume stark vom Zufall abhängen.";

  var data = (window.TRACKRECORD || [])
    .filter(function (m) { return m && /^\d{4}-\d{2}$/.test(m.monat); })
    .sort(function (a, b) { return a.monat < b.monat ? -1 : 1; });
  var tage = (window.TRACKRECORD_TAGE || []).slice().sort(function (a, b) { return a.d < b.d ? -1 : 1; });
  var jahre = (window.TRACKRECORD_JAHRE || []).slice().sort(function (a, b) { return a.jahr - b.jahr; });

  if (!data.length) {
    body.innerHTML = '<p class="trk-empty">Der erste Monatsbericht erscheint am 1. des kommenden Monats.</p>';
    return;
  }

  function de(n, k) { return n.toLocaleString("de-DE", { minimumFractionDigits: k, maximumFractionDigits: k }); }
  function signed(n, k) { return n > 0 ? "+" + de(n, k) : n < 0 ? "−" + de(Math.abs(n), k) : de(0, k); }
  function monthName(key) { var p = key.split("-"); return MONATE[parseInt(p[1], 10) - 1] + " " + p[0]; }
  function dm(iso) { var p = iso.split("-"); return p[2] + "." + p[1] + "."; }
  function dmy(iso) { return dm(iso) + iso.slice(0, 4); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function isNum(x) { return typeof x === "number"; }

  /* Kennzahlen klein unter der Kurve: Wetten, Treffer, Ø-Quote; Einsätze und Rendite nur, wenn mitgegeben (Jahr ab 100 Wetten) */
  function nums(L) {
    var q = L.wetten > 0 ? L.treffer / L.wetten * 100 : 0;
    return '<dl class="trk-nums">' +
      '<div><dt>Wetten</dt><dd>' + L.wetten + '</dd></div>' +
      '<div><dt>Treffer</dt><dd>' + L.treffer + ' <small>(' + de(q, 1) + ' %)</small></dd></div>' +
      (isNum(L.quote) ? '<div><dt>Ø-Quote</dt><dd>' + de(L.quote, 2) + '</dd></div>' : '') +
      (isNum(L.gewinn) ? '<div><dt>Einsätze</dt><dd>' + signed(L.gewinn, 1) + '</dd></div>' : '') +
      (isNum(L.rendite) ? '<div><dt>Rendite</dt><dd>' + signed(L.rendite, 1) + ' %</dd></div>' : '') +
    '</dl>';
  }

  /* Die große Kurve (nur Jahr, nur ab 100 Wetten): kumulierte Einsätze je Tag, Skala am rechten Rand, Nulllinie gestrichelt,
     letzter Wert als Punkt mit Beschriftung, Bereich ab Livestart hinterlegt. */
  function chart(series, label, W) {
    if (series.length < 2) return "";
    var H = W < 520 ? 300 : Math.round(W * 0.46);
    var L = 12, R = 46, T = 20, B = 32, n = series.length;
    var vals = series.map(function (s) { return s.g; });
    var lo = Math.min(0, Math.min.apply(null, vals)), hi = Math.max(0, Math.max.apply(null, vals));
    var pad = Math.max(1, (hi - lo) * 0.1); lo -= pad; hi += pad;
    function X(i) { return L + i / (n - 1) * (W - L - R); }
    function Y(v) { return T + (1 - (v - lo) / (hi - lo)) * (H - T - B); }
    var span = hi - lo, step = span > 30 ? 10 : span > 14 ? 5 : span > 7 ? 2 : 1, g = "";
    for (var v = Math.ceil(lo / step) * step; v <= hi; v += step) {
      if (v === 0) continue;
      g += '<line class="trk-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/>' +
           '<text class="trk-ax" x="' + (W - R + 8) + '" y="' + (Y(v) + 4).toFixed(1) + '">' + signed(v, 0) + '</text>';
    }
    var li = -1;
    for (var i = 0; i < n; i++) { if (!series[i].rr) { li = i; break; } }
    if (li > 0) {
      g += '<rect class="trk-live" x="' + X(li - 0.5).toFixed(1) + '" y="' + T + '" width="' + (W - R - X(li - 0.5)).toFixed(1) + '" height="' + (H - T - B) + '"/>' +
           '<text class="trk-ax trk-ax--live" x="' + (X(li - 0.5) + 8).toFixed(1) + '" y="' + (T + 14) + '">live</text>';
    } else if (li === 0) {
      g += '<text class="trk-ax trk-ax--live" x="' + (L + 8) + '" y="' + (T + 14) + '">live</text>';
    }
    g += '<line class="trk-zero" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(0).toFixed(1) + '" y2="' + Y(0).toFixed(1) + '"/>' +
         '<text class="trk-ax" x="' + (W - R + 8) + '" y="' + (Y(0) + 4).toFixed(1) + '">0</text>';
    g += '<polyline class="trk-curve" points="' + series.map(function (s, k) { return X(k).toFixed(1) + "," + Y(s.g).toFixed(1); }).join(" ") + '"/>';
    var last = series[n - 1], lx = X(n - 1), ly = Y(last.g);
    g += '<circle class="trk-dot" cx="' + lx.toFixed(1) + '" cy="' + ly.toFixed(1) + '" r="6"/>' +
         '<text class="trk-end" x="' + (lx - 12).toFixed(1) + '" y="' + Math.min(ly + 28, H - B - 8).toFixed(1) + '" text-anchor="end">' + signed(last.g, 1) + ' Einsätze</text>';
    var marks = [0];
    for (var k = 1; k < n - 4; k++) if (series[k].d.slice(8) === "01") marks.push(k);
    marks.push(n - 1);
    marks.forEach(function (k, idx) {
      g += '<text class="trk-ax" x="' + (k === n - 1 ? W - R : X(k)).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="' + (idx === 0 ? "start" : k === n - 1 ? "end" : "middle") + '">' + dm(series[k].d) + '</text>';
    });
    g += '<g class="trk-cur" style="display:none"><line class="trk-cursor" y1="' + T + '" y2="' + (H - B) + '"/><circle class="trk-dot" r="4.5"/><text class="trk-tip"></text></g>';
    return '<svg class="trk-svg" viewBox="0 0 ' + W + ' ' + H + '" height="' + H + '" role="img" aria-label="' + esc(label) + '" data-w="' + W + '">' + g + '</svg>';
  }

  /* Tooltip beim Darüberfahren: Datum und Stand */
  function bindCursor(series) {
    var svg = body.querySelector(".trk-svg");
    if (!svg) return;
    var W = parseFloat(svg.getAttribute("data-w")), H = parseFloat(svg.getAttribute("height")), n = series.length;
    var L = 12, R = 46, T = 20, B = 32;
    var vals = series.map(function (s) { return s.g; });
    var lo = Math.min(0, Math.min.apply(null, vals)), hi = Math.max(0, Math.max.apply(null, vals));
    var pad = Math.max(1, (hi - lo) * 0.1); lo -= pad; hi += pad;
    function X(i) { return L + i / (n - 1) * (W - L - R); }
    function Y(v) { return T + (1 - (v - lo) / (hi - lo)) * (H - T - B); }
    var c = svg.querySelector(".trk-cur"), cl = c.querySelector("line"), cc = c.querySelector("circle"), ct = c.querySelector("text");
    svg.onpointermove = function (ev) {
      var r = svg.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width * W;
      var k = Math.max(0, Math.min(n - 1, Math.round((x - L) / (W - L - R) * (n - 1))));
      c.style.display = "";
      cl.setAttribute("x1", X(k)); cl.setAttribute("x2", X(k)); cc.setAttribute("cx", X(k)); cc.setAttribute("cy", Y(series[k].g));
      ct.textContent = dm(series[k].d) + "  " + signed(series[k].g, 1);
      var right = k > n * 0.7;
      ct.setAttribute("text-anchor", right ? "end" : "start"); ct.setAttribute("x", X(k) + (right ? -8 : 8)); ct.setAttribute("y", T + 30);
    };
    svg.onpointerleave = function () { c.style.display = "none"; };
  }

  /* Monatstabelle: Wetten, Treffer (mit Prozent), Ø-Quote (nur, wenn mindestens ein Monat sie hat) */
  function table(activeKey) {
    var mitQuote = data.some(function (m) { return isNum(m.live.quote); });
    var rows = data.slice().reverse().map(function (m) {
      var L = m.live, q = L.wetten > 0 ? L.treffer / L.wetten * 100 : 0;
      var mn = monthName(m.monat);
      if ((body.clientWidth || 640) < 480) mn = MONATE[parseInt(m.monat.slice(5), 10) - 1].slice(0, 3) + " " + m.monat.slice(2, 4);
      var name = mn + (m.rueckrechnung ? "*" : "");
      var cls = m.monat === activeKey ? ' class="is-active"' : "";
      return '<tr' + cls + '><th scope="row"><a href="monatsbericht-' + m.monat + '.html">' + name + '</a></th>' +
        '<td>' + L.wetten + '</td><td>' + L.treffer + ' (' + de(q, 1) + ' %)</td>' +
        (mitQuote ? '<td>' + (isNum(L.quote) ? de(L.quote, 2) : "–") + '</td>' : '') + '</tr>';
    }).join("");
    return '<div class="trk-table-wrap"><table class="trk-table"><thead><tr><th>Monat</th><th>Wetten</th><th>Treffer</th>' +
      (mitQuote ? '<th>Ø-Quote</th>' : '') + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  var active = null; /* null = neuestes Jahr, sonst Jahreszahl als Text (Reiter auf der Startseite) */

  function tabs(fixed) {
    if (fixed || jahre.length < 2) return "";
    var cur = active || String(jahre[jahre.length - 1].jahr);
    return '<div class="trk-tabs" role="group" aria-label="Zeitraum"><div class="trk-tabs-months">' +
      jahre.slice().reverse().map(function (j) {
        return '<button type="button" class="trk-tab" data-k="' + j.jahr + '" aria-pressed="' + (cur === String(j.jahr) ? "true" : "false") + '">Jahr ' + j.jahr + '</button>';
      }).join("") + '</div></div>';
  }

  function render() {
    var fixed = root.getAttribute("data-tr-monat");
    var W = Math.max(300, Math.min(960, body.clientWidth - 32 || 900));
    var hero, star, notes = "", key = null, fnSeries;
    if (fixed) {
      var m = data.filter(function (x) { return x.monat === fixed; })[0] || data[data.length - 1];
      key = m.monat; star = !!m.rueckrechnung;
      fnSeries = tage.filter(function (t) { return t.d.slice(0, 7) === key; });
      hero = '<section class="trk-hero"><div class="trk-hero-head"><span class="trk-hero-title">' + monthName(key) + (star ? '<sup class="trk-star">*</sup>' : '') + '</span></div>' +
        nums(m.live) + '</section>';
    } else {
      var J = jahre.filter(function (x) { return String(x.jahr) === (active || String(jahre[jahre.length - 1].jahr)); })[0] || jahre[jahre.length - 1];
      if (!J) {
        hero = "";
        star = data.some(function (x) { return x.rueckrechnung; });
        fnSeries = [];
      } else {
        var series = tage.filter(function (t) { return t.d.slice(0, 4) === String(J.jahr); });
        star = !!J.rueckrechnung;
        fnSeries = series;
        var ab = J.ab.slice(5) === "01-01" ? "" : " · ab " + dm(J.ab);
        var freigabe = isNum(J.gewinn) && isNum(J.rendite);
        hero = '<section class="trk-hero"><div class="trk-hero-head"><span class="trk-hero-title">Jahr ' + J.jahr + ab + ' · Stand ' + dmy(J.stand) +
          (star ? '<sup class="trk-star">*</sup>' : '') + '</span>' +
          (freigabe && series.length > 1 ? '<span class="trk-hero-sub">Kumulierte Einsätze je Tag</span>' : '') + '</div>' +
          (freigabe ? chart(series, "Kumulierte Einsätze je Tag im Jahr " + J.jahr + ", Stand " + signed(J.gewinn, 1), W) : '') +
          nums({ wetten: J.wetten, treffer: J.treffer, quote: J.quote, gewinn: freigabe ? J.gewinn : null, rendite: freigabe ? J.rendite : null }) +
          (freigabe ? '' : '<p class="trk-foot">Einsätze und Rendite folgen, sobald das Jahr 100 Live-Wetten hat.</p>') + '</section>';
        notes = series;
      }
    }
    body.innerHTML =
      tabs(!!fixed) + hero + table(key) +
      (star ? '<p class="trk-foot">' + fussnote(fnSeries || []) + '</p>' : '') +
      '<p class="trk-foot">' + QUOTE_DEF + '</p>' +
      '<p class="trk-foot">' + HINWEIS + '</p>' +
      '<p class="trk-foot">' + PFLICHT + '</p>' +
      '<p class="trk-foot">18+ · Keine Gewinngarantie</p>';
    if (notes && notes.length > 1) bindCursor(notes);
    Array.prototype.forEach.call(body.querySelectorAll(".trk-tab"), function (b) {
      b.addEventListener("click", function () { active = b.getAttribute("data-k") || null; render(); });
    });
  }
  render();
  var rt, lastW = body.clientWidth;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (Math.abs(body.clientWidth - lastW) > 20) { lastW = body.clientWidth; render(); } }, 150);
  });
})();

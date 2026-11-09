/* Trackrecord — liest window.TRACKRECORD (Monate), window.TRACKRECORD_JAHRE (Kalenderjahre)
   und window.TRACKRECORD_TAGE (kumulierte Trefferquote in % je Tag, je Jahr neu beginnend) aus trackrecord-daten.js.
   Anzeige-Regeln: Monate zeigen Wetten, Treffer (mit Prozent) und Ø-Quote. Einsätze und Rendite gibt es auf der Homepage nicht.
   Die Jahreskurve (Trefferquote mit Break-even) erscheint erst ab 100 Live-Wetten im Jahr.
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
    var von = jahre.length ? jahre[0].ab : "2026-09-01", bis = rr.length ? rr[rr.length - 1].d : "2026-10-10";
    return "* " + dm(von) + "–" + dm(bis) + ": Testphase, mit den Regeln vom 11.10.2026 berechnet.";
  }
  var PFLICHT = "Alle Zahlen gelten bei gleichem Einsatz auf jede Live-Wette. Verlustserien gehören dazu.";
  var QUOTE_DEF = "Ø-Quote: Durchschnitt der Quoten aller gesetzten Live-Wetten im Zeitraum.";
  var BREAKEVEN = "Break-even: Ab dieser Trefferquote (100 ÷ Ø-Quote) gleichen Treffer und Fehlschläge sich aus.";
  var HINWEIS = "Einsätze und Rendite zeigen wir hier nicht. Wir weisen sie je Kalenderjahr in unseren Telegram-Kanälen aus, sobald 100 Live-Wetten vorliegen.";

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

  /* Kennzahlen klein unter der Kurve: Wetten, Treffer (mit Prozent), Ø-Quote. Einsätze und Rendite gibt es hier nicht (nur in Telegram). */
  function nums(L) {
    var q = L.wetten > 0 ? L.treffer / L.wetten * 100 : 0;
    return '<dl class="trk-nums">' +
      '<div><dt>Wetten</dt><dd>' + L.wetten + '</dd></div>' +
      '<div><dt>Treffer</dt><dd>' + L.treffer + ' <small>(' + de(q, 1) + ' %)</small></dd></div>' +
      (isNum(L.quote) ? '<div><dt>Ø-Quote</dt><dd>' + de(L.quote, 2) + '</dd></div>' : '') +
    '</dl>';
  }

  /* Skala der Jahreskurve: Trefferquote in %, auf 5-%-Schritte gerundet, die Gewinnschwelle (100 ÷ Ø-Quote) liegt immer im Bild */
  function scale(series, be) {
    var vals = series.map(function (s) { return s.q; });
    if (isNum(be)) vals.push(be);
    var lo = Math.floor((Math.min.apply(null, vals) - 2) / 5) * 5, hi = Math.ceil((Math.max.apply(null, vals) + 2) / 5) * 5;
    return { lo: lo, hi: hi };
  }

  /* Die große Kurve (nur Jahr, nur ab 100 Wetten): kumulierte Trefferquote je Tag, Skala am rechten Rand,
     Gewinnschwelle (100 ÷ Ø-Quote) gestrichelt, letzter Wert als Punkt mit Beschriftung, Bereich ab Livestart hinterlegt. */
  function chart(series, label, W, be, wetten, treffer) {
    if (series.length < 2) return "";
    var H = W < 520 ? 300 : Math.round(W * 0.46);
    var L = 12, R = 84, T = 20, B = 32, n = series.length;
    var sc = scale(series, be), lo = sc.lo, hi = sc.hi;
    function X(i) { return L + i / (n - 1) * (W - L - R); }
    function Y(v) { return T + (1 - (v - lo) / (hi - lo)) * (H - T - B); }
    var g = "";
    for (var v = lo; v <= hi; v += 5) {
      g += '<line class="trk-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/>' +
           '<text class="trk-ax" x="' + (W - R + 8) + '" y="' + (Y(v) + 4).toFixed(1) + '">' + v + ' %</text>';
    }
    var li = -1;
    for (var i = 0; i < n; i++) { if (!series[i].rr) { li = i; break; } }
    if (li > 0) {
      g += '<rect class="trk-live" x="' + X(li - 0.5).toFixed(1) + '" y="' + T + '" width="' + (W - R - X(li - 0.5)).toFixed(1) + '" height="' + (H - T - B) + '"/>' +
           '<text class="trk-ax trk-ax--live" x="' + (X(li - 0.5) + 8).toFixed(1) + '" y="' + (T + 14) + '">live</text>';
    } else if (li === 0) {
      g += '<text class="trk-ax trk-ax--live" x="' + (L + 8) + '" y="' + (T + 14) + '">live</text>';
    }
    if (isNum(be)) {
      g += '<line class="trk-zero" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(be).toFixed(1) + '" y2="' + Y(be).toFixed(1) + '"/>' +
           '<text class="trk-ax" x="' + (W - R + 8) + '" y="' + (Y(be) + 16).toFixed(1) + '">Break-even</text>';
    }
    g += '<polyline class="trk-curve" points="' + series.map(function (s, k) { return X(k).toFixed(1) + "," + Y(s.q).toFixed(1); }).join(" ") + '"/>';
    var last = series[n - 1], lx = X(n - 1), ly = Y(last.q);
    g += '<circle class="trk-dot" cx="' + lx.toFixed(1) + '" cy="' + ly.toFixed(1) + '" r="6"/>' +
         '<text class="trk-end" x="' + (lx - 12).toFixed(1) + '" y="' + Math.min(Math.max(ly, isNum(be) ? Y(be) : ly) + 28, H - B - 8).toFixed(1) + '" text-anchor="end">' +
         de(last.q, 1) + ' % (' + treffer + ' von ' + wetten + ')</text>';
    var marks = [0];
    for (var k = 1; k < n - 8; k++) if (series[k].d.slice(8) === "01") marks.push(k);
    marks.push(n - 1);
    marks.forEach(function (k, idx) {
      g += '<text class="trk-ax" x="' + (k === n - 1 ? W - R : X(k)).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="' + (idx === 0 ? "start" : k === n - 1 ? "end" : "middle") + '">' + dm(series[k].d) + '</text>';
    });
    g += '<g class="trk-cur" style="display:none"><line class="trk-cursor" y1="' + T + '" y2="' + (H - B) + '"/><circle class="trk-dot" r="4.5"/><text class="trk-tip"></text></g>';
    return '<svg class="trk-svg" viewBox="0 0 ' + W + ' ' + H + '" height="' + H + '" role="img" aria-label="' + esc(label) + '" data-w="' + W + '">' + g + '</svg>';
  }

  /* Tooltip beim Darüberfahren: Datum und Stand */
  function bindCursor(series, be) {
    var svg = body.querySelector(".trk-svg");
    if (!svg) return;
    var W = parseFloat(svg.getAttribute("data-w")), H = parseFloat(svg.getAttribute("height")), n = series.length;
    var L = 12, R = 84, T = 20, B = 32;
    var sc = scale(series, be), lo = sc.lo, hi = sc.hi;
    function X(i) { return L + i / (n - 1) * (W - L - R); }
    function Y(v) { return T + (1 - (v - lo) / (hi - lo)) * (H - T - B); }
    var c = svg.querySelector(".trk-cur"), cl = c.querySelector("line"), cc = c.querySelector("circle"), ct = c.querySelector("text");
    svg.onpointermove = function (ev) {
      var r = svg.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width * W;
      var k = Math.max(0, Math.min(n - 1, Math.round((x - L) / (W - L - R) * (n - 1))));
      c.style.display = "";
      cl.setAttribute("x1", X(k)); cl.setAttribute("x2", X(k)); cc.setAttribute("cx", X(k)); cc.setAttribute("cy", Y(series[k].q));
      ct.textContent = dm(series[k].d) + "  " + de(series[k].q, 1) + " %";
      var right = k > n * 0.7;
      ct.setAttribute("text-anchor", right ? "end" : "start"); ct.setAttribute("x", X(k) + (right ? -8 : 8)); ct.setAttribute("y", T + 30);
    };
    svg.onpointerleave = function () { c.style.display = "none"; };
  }

  /* Monatstabelle: Wetten, Treffer (mit Prozent), Ø-Quote (nur, wenn mindestens ein Monat sie hat) */
  function table(activeKey, mitVs) {
    var mitQuote = data.some(function (m) { return isNum(m.live.quote); });
    var rows = data.slice().reverse().map(function (m) {
      var L = m.live, q = L.wetten > 0 ? L.treffer / L.wetten * 100 : 0;
      var mn = monthName(m.monat);
      if ((body.clientWidth || 640) < 480) mn = MONATE[parseInt(m.monat.slice(5), 10) - 1].slice(0, 3) + " " + m.monat.slice(2, 4);
      var name = mn + (m.rueckrechnung ? "*" : "");
      var cls = m.monat === activeKey ? ' class="is-active"' : "";
      return '<tr' + cls + '><th scope="row"><a href="monatsbericht-' + m.monat + '.html">' + name + '</a></th>' +
        '<td>' + L.wetten + '</td><td>' + L.treffer + ' (' + de(q, 1) + ' %)</td>' +
        (mitQuote ? '<td>' + (isNum(L.quote) ? de(L.quote, 2) : "–") + '</td>' : '') +
        (mitVs ? '<td>' + (isNum(L.verlustserie) ? L.verlustserie : "–") + '</td>' : '') + '</tr>';
    }).join("");
    return '<div class="trk-table-wrap"><table class="trk-table"><thead><tr><th>Monat</th><th>Wetten</th><th>Treffer</th>' +
      (mitQuote ? '<th>Ø-Quote</th>' : '') + (mitVs ? '<th>Verlustserie</th>' : '') + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
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
    var liste = root.hasAttribute("data-tr-liste");
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
        var freigabe = series.length > 1;
        var be = isNum(J.quote) && J.quote > 0 ? 100 / J.quote : null;
        hero = '<section class="trk-hero"><div class="trk-hero-head"><span class="trk-hero-title">Jahr ' + J.jahr + ab + ' · Stand ' + dmy(J.stand) +
          (star ? '<sup class="trk-star">*</sup>' : '') + '</span>' +
          (freigabe ? '<span class="trk-hero-sub">Trefferquote kumuliert' + (be ? ' · Break-even ' + de(be, 1) + ' % bei Ø-Quote ' + de(J.quote, 2) : '') + '</span>' : '') + '</div>' +
          (freigabe ? chart(series, "Kumulierte Trefferquote je Tag im Jahr " + J.jahr + ", Stand " + de(series[series.length - 1].q, 1) + " Prozent", W, be, J.wetten, J.treffer) : '') +
          nums({ wetten: J.wetten, treffer: J.treffer, quote: J.quote }) +
          (freigabe ? '' : '<p class="trk-foot">Die Jahreskurve folgt, sobald das Jahr 100 Live-Wetten hat.</p>') + '</section>';
        notes = series;
      }
    }
    if (liste) {
      /* Archiv: nur die Monatstabelle (mit längster Verlustserie), ohne Jahreskurve */
      hero = ""; star = data.some(function (x) { return x.rueckrechnung; }); fnSeries = tage;
    }
    body.innerHTML =
      (liste ? "" : tabs(!!fixed)) + hero +
      (liste ? table(null, true) : fixed ? table(key) : '<p class="trk-more"><a class="tr-alle" href="monatsberichte.html">Alle Monatsberichte ansehen →</a></p>') +
      (star ? '<p class="trk-foot">' + fussnote(fnSeries || []) + '</p>' : '') +
      '<p class="trk-foot">' + QUOTE_DEF + '</p>' +
      (!fixed && !liste ? '<p class="trk-foot">' + BREAKEVEN + '</p>' : '') +
      '<p class="trk-foot">' + HINWEIS + '</p>' +
      '<p class="trk-foot">' + PFLICHT + '</p>' +
      '<p class="trk-foot">18+ · Keine Gewinngarantie</p>';
    if (notes && notes.length > 1) bindCursor(notes, (J && isNum(J.quote) && J.quote > 0) ? 100 / J.quote : null);
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

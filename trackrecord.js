/* Trackrecord — liest window.TRACKRECORD (Monate), window.TRACKRECORD_TAGE (kumulierte Einsätze je Tag)
   und window.TRACKRECORD_START (Stand seit Start) aus trackrecord-daten.js.
   Startseite: Gesamtbilanz seit Start. Monatsseiten: <div data-tr data-tr-monat="JJJJ-MM">.
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
    return "* " + dm(von) + "–" + dm(bis) + ": Testphase, mit den heutigen Regeln berechnet.";
  }
  var PFLICHT = "Alle Zahlen gelten bei gleichem Einsatz auf jede Live-Wette. Verlustserien gehören dazu.";

  var data = (window.TRACKRECORD || [])
    .filter(function (m) { return m && /^\d{4}-\d{2}$/.test(m.monat); })
    .sort(function (a, b) { return a.monat < b.monat ? -1 : 1; });
  var tage = (window.TRACKRECORD_TAGE || []).slice().sort(function (a, b) { return a.d < b.d ? -1 : 1; });

  if (!data.length) {
    body.innerHTML = '<p class="trk-empty">Der erste Monatsbericht erscheint am 1. des kommenden Monats.</p>';
    return;
  }

  function de(n, k) { return n.toLocaleString("de-DE", { minimumFractionDigits: k, maximumFractionDigits: k }); }
  function signed(n, k) { return n > 0 ? "+" + de(n, k) : n < 0 ? "−" + de(Math.abs(n), k) : de(0, k); }
  function gewinn(L) { return (typeof L.gewinn === "number") ? L.gewinn : Math.round(L.rendite * L.wetten) / 100; }
  function monthName(key) { var p = key.split("-"); return MONATE[parseInt(p[1], 10) - 1] + " " + p[0]; }
  function dm(iso) { var p = iso.split("-"); return p[2] + "." + p[1] + "."; }
  function dmy(iso) { return dm(iso) + iso.slice(0, 4); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  /* Kennzahlen klein unter der Kurve: Wetten, Treffer, Einsätze, Rendite */
  function nums(L) {
    var q = L.wetten > 0 ? L.treffer / L.wetten * 100 : 0;
    return '<dl class="trk-nums">' +
      '<div><dt>Wetten</dt><dd>' + L.wetten + '</dd></div>' +
      '<div><dt>Treffer</dt><dd>' + L.treffer + ' <small>(' + de(q, 1) + ' %)</small></dd></div>' +
      '<div><dt>Einsätze</dt><dd>' + signed(gewinn(L), 1) + '</dd></div>' +
      '<div><dt>Rendite</dt><dd>' + signed(L.rendite, 1) + ' %</dd></div>' +
    '</dl>';
  }

  /* Die große Kurve: kumulierte Einsätze je Tag, Skala am rechten Rand, Nulllinie gestrichelt,
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

  /* Monatstabelle */
  function table(activeKey) {
    var rows = data.slice().reverse().map(function (m) {
      var L = m.live, q = L.wetten > 0 ? L.treffer / L.wetten * 100 : 0;
      var mn = monthName(m.monat);
      if ((body.clientWidth || 640) < 480) mn = MONATE[parseInt(m.monat.slice(5), 10) - 1].slice(0, 3) + " " + m.monat.slice(2, 4);
      var name = mn + (m.rueckrechnung ? "*" : "");
      var cls = m.monat === activeKey ? ' class="is-active"' : "";
      return '<tr' + cls + '><th scope="row"><a href="monatsbericht-' + m.monat + '.html">' + name + '</a></th>' +
        '<td>' + L.wetten + '</td><td>' + L.treffer + ' (' + de(q, 1) + ' %)</td><td>' + signed(gewinn(L), 1) + '</td><td>' + signed(L.rendite, 1) + ' %</td></tr>';
    }).join("");
    return '<div class="trk-table-wrap"><table class="trk-table"><thead><tr><th>Monat</th><th>Wetten</th><th>Treffer</th><th>Einsätze</th><th>Rendite</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  var active = null; /* null = seit Start, sonst "JJJJ-MM" (Reiter auf der Startseite) */

  function tabs(fixed) {
    if (fixed) return "";
    var items = [{ k: "", t: "Seit Start" }].concat(data.slice().reverse().map(function (m) { return { k: m.monat, t: monthName(m.monat) }; }));
    return '<div class="trk-tabs" role="group" aria-label="Zeitraum">' + items.map(function (i) {
      return '<button type="button" class="trk-tab" data-k="' + i.k + '" aria-pressed="' + ((active || "") === i.k ? "true" : "false") + '">' + i.t + '</button>';
    }).join("") + '</div>';
  }

  function render() {
    var fixed = root.getAttribute("data-tr-monat");
    var key = fixed || active;
    var L, series, star, title, label;
    var W = Math.max(300, Math.min(960, body.clientWidth - 32 || 900));
    if (key) {
      var m = data.filter(function (x) { return x.monat === key; })[0] || data[data.length - 1];
      key = m.monat; L = m.live;
      var prev = 0, days = tage.filter(function (t) { return t.d.slice(0, 7) === key; });
      tage.forEach(function (t) { if (t.d.slice(0, 7) < key) prev = t.g; });
      series = days.map(function (t) { return { d: t.d, g: Math.round((t.g - prev) * 10) / 10, rr: !!t.rr }; });
      star = !!m.rueckrechnung;
      title = monthName(key);
      label = "Kumulierte Einsätze je Tag im " + monthName(key) + ", Stand " + signed(gewinn(L), 1);
    } else {
      var S = window.TRACKRECORD_START, w = 0, t = 0, gw = 0;
      if (S) { L = { wetten: S.wetten, treffer: S.treffer, rendite: S.rendite, gewinn: S.gewinn }; }
      else {
        data.forEach(function (x) { w += x.live.wetten; t += x.live.treffer; gw += gewinn(x.live); });
        gw = Math.round(gw * 10) / 10;
        L = { wetten: w, treffer: t, gewinn: gw, rendite: w ? Math.round(gw / w * 1000) / 10 : 0 };
      }
      series = tage.map(function (x) { return { d: x.d, g: x.g, rr: !!x.rr }; });
      star = data.some(function (x) { return x.rueckrechnung; }) || series.some(function (x) { return x.rr; });
      var first = series.length ? series[0].d : (data[0].monat + "-01");
      var stand = (S && S.stand) || (series.length ? series[series.length - 1].d : "");
      title = "Seit " + dmy(first) + (stand ? " · Stand " + dmy(stand) : "");
      label = "Kumulierte Einsätze je Tag seit " + dmy(first) + ", Stand " + signed(gewinn(L), 1);
    }
    body.innerHTML =
      tabs(!!fixed) +
      '<section class="trk-hero"><div class="trk-hero-head"><span class="trk-hero-title">' + title + (star ? '<sup class="trk-star">*</sup>' : '') + '</span>' +
        (series.length > 1 ? '<span class="trk-hero-sub">Kumulierte Einsätze je Tag</span>' : '') + '</div>' +
        chart(series, label, W) + nums(L) + '</section>' +
      table(key) +
      (star ? '<p class="trk-foot">' + fussnote(series) + '</p>' : '') +
      '<p class="trk-foot">' + PFLICHT + '</p>' +
      '<p class="trk-foot">18+ · Keine Gewinngarantie</p>';
    bindCursor(series);
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

/* Trackrecord-Slideshow — liest window.TRACKRECORD aus trackrecord-daten.js.
   Diese Datei muss für neue Monate nicht angefasst werden. */
(function () {
  var root = document.querySelector("[data-tr]");
  if (!root) return;

  var body = root.querySelector("[data-tr-body]");
  var nameEl = root.querySelector("[data-tr-name]");
  var prevBtn = root.querySelector("[data-tr-prev]");
  var nextBtn = root.querySelector("[data-tr-next]");
  var dotsEl = root.querySelector("[data-tr-dots]");

  var MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
    "August", "September", "Oktober", "November", "Dezember"];

  // Älteste zuerst sortieren, damit "←" in die Vergangenheit führt.
  var data = (window.TRACKRECORD || [])
    .filter(function (m) { return m && /^\d{4}-\d{2}$/.test(m.monat); })
    .sort(function (a, b) { return a.monat < b.monat ? -1 : 1; });

  if (!data.length) {
    body.innerHTML = '<p class="tr-empty">Der erste Monatsbericht erscheint am 1. des kommenden Monats.</p>';
    nameEl.textContent = "—";
    prevBtn.disabled = nextBtn.disabled = true;
    return;
  }

  // Jahre: Summe der Monatsberichte eines Kalenderjahres. Ein neues Jahr erscheint erst mit seinem ersten Monatsbericht.
  function sumYear(y, list) {
    var wetten = 0, treffer = 0, gewinn = 0, tipps = 0, etreffer = 0, best = null, worst = null, rr = [];
    list.forEach(function (m) {
      var L = m.live || {}, E = m.einzelspiele || {};
      var g = (typeof L.gewinn === "number") ? L.gewinn : Math.round(L.rendite * L.wetten) / 100;
      wetten += L.wetten; treffer += L.treffer; gewinn += g;
      tipps += E.tipps || 0; etreffer += E.treffer || 0;
      if (typeof L.besterTag === "number") best = best === null ? L.besterTag : Math.max(best, L.besterTag);
      if (typeof L.schlechtesterTag === "number") worst = worst === null ? L.schlechtesterTag : Math.min(worst, L.schlechtesterTag);
      if (m.rueckrechnung) rr.push(m.monat);
    });
    gewinn = Math.round(gewinn * 10) / 10;
    var first = list[0].monat;
    var fm = parseInt(first.split("-")[1], 10);
    return {
      jahr: y,
      name: y + (fm > 1 ? " (seit 1. " + MONATE[fm - 1] + ")" : ""),
      anzahl: list.length,
      rueckMonate: rr,
      live: { wetten: wetten, treffer: treffer, gewinn: gewinn, rendite: wetten ? Math.round(gewinn / wetten * 1000) / 10 : 0,
              besterTag: best, schlechtesterTag: worst },
      einzelspiele: { tipps: tipps, treffer: etreffer }
    };
  }
  var years = [];
  (function () {
    var byYear = {};
    data.forEach(function (m) { var y = m.monat.slice(0, 4); (byYear[y] = byYear[y] || []).push(m); });
    Object.keys(byYear).sort().forEach(function (y) { years.push(sumYear(y, byYear[y])); });
  })();
  var modeBtns = root.querySelectorAll("[data-tr-mode]");
  var labelEl = root.querySelector("[data-tr-label]");
  var mode = "monat";
  var monthIdx = data.length - 1; // neuester Monat mit Bericht
    var yearIdx = years.length - 1;
  var idx = monthIdx;
  var set = data;


  function monthName(key) {
    var p = key.split("-");
    return MONATE[parseInt(p[1], 10) - 1] + " " + p[0];
  }
  function de(n, digits) {
    return n.toLocaleString("de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }
  function signed(n, digits) {
    if (n > 0) return "+" + de(n, digits);
    if (n < 0) return "−" + de(Math.abs(n), digits);
    return de(0, digits);
  }
  function pct(hit, total) {
    return total > 0 ? (hit / total) * 100 : 0;
  }
  /* Ampel für Rendite und Gewinn: grün ab +3 %, gelb zwischen -3 % und +3 %, rot ab -3 % */
  function ampel(rendite) {
    return rendite >= 3 ? "is-pos" : rendite > -3 ? "is-mid" : "is-neg";
  }
  function tone(n) {
    return n > 0 ? "is-pos" : n < 0 ? "is-neg" : "";
  }
  function bar(p) {
    return '<div class="tr-bar" aria-hidden="true"><span style="width:' + Math.max(0, Math.min(100, p)).toFixed(1) + '%"></span></div>';
  }

  function rowsHtml(L) {
    var r = "";
    if (L.verlustserie != null) r += '<div><dt>Längste Verlustserie</dt><dd>' + L.verlustserie + ' in Folge</dd></div>';
    if (L.rueckgang != null) r += '<div><dt>Größter Rückgang</dt><dd class="' + tone(L.rueckgang) + '">' + signed(L.rueckgang, 1) + ' Einsätze</dd></div>';
    if (L.besterTag != null) r += '<div><dt>Bester Tag</dt><dd class="' + tone(L.besterTag) + '">' + signed(L.besterTag, 1) + ' Einsätze</dd></div>';
    if (L.schlechtesterTag != null) r += '<div><dt>Schlechtester Tag</dt><dd class="' + tone(L.schlechtesterTag) + '">' + signed(L.schlechtesterTag, 1) + ' Einsätze</dd></div>';
    return r ? '<dl class="tr-rows">' + r + '</dl>' : '';
  }

  function render() {
    var m = set[idx];
    var isY = mode === "jahr";
    var per = isY ? "im Jahr" : "im Monat";
    var L = m.live || {};
    var E = m.einzelspiele || {};
    var lp = pct(L.treffer, L.wetten);
    var ep = pct(E.treffer, E.tipps);

    nameEl.textContent = isY ? m.name : monthName(m.monat);
    if (labelEl) labelEl.textContent = isY ? "Jahresbericht" : "Monatsbericht";
    prevBtn.setAttribute("aria-label", isY ? "Vorheriges Jahr" : "Vorheriger Monat");
    nextBtn.setAttribute("aria-label", isY ? "Nächstes Jahr" : "Nächster Monat");

    /* Gewinn in Einsätzen: aus dem Feld gewinn, sonst Rendite × Anzahl Live-Wetten (Einheitseinsatz) */
    var G = (typeof L.gewinn === "number") ? L.gewinn : Math.round(L.rendite * L.wetten) / 100;
    body.innerHTML =
      '<div class="tr-grid">' +
        '<article class="tr-panel">' +
          '<div class="tr-panel-head"><span class="tr-kicker">Kernangebot</span><h3>Live-Wetten' + ((isY ? m.rueckMonate.length : m.rueckrechnung) ? '<sup class="tr-star">*</sup>' : '') + '</h3></div>' +
          '<div class="tr-kpis tr-kpis--3">' +
            '<div class="tr-kpi">' +
              '<span class="tr-kpi-label">Trefferquote</span>' +
              '<span class="tr-kpi-value">' + de(lp, 1) + '<small>%</small></span>' +
              '<span class="tr-kpi-sub">' + L.treffer + ' von ' + L.wetten + ' Live-Wetten</span>' +
              bar(lp) +
            '</div>' +
            '<div class="tr-kpi">' +
              '<span class="tr-kpi-label">Rendite</span>' +
              '<span class="tr-kpi-value ' + ampel(L.rendite) + '">' + signed(L.rendite, 1) + '<small>%</small></span>' +
              '<span class="tr-kpi-sub">' + per + '</span>' +
            '</div>' +
            '<div class="tr-kpi">' +
              '<span class="tr-kpi-label">Gewinn</span>' +
              '<span class="tr-kpi-value ' + ampel(L.rendite) + '">' + signed(G, 1) + '<small>Einsätze</small></span>' +
              '<span class="tr-kpi-sub">' + per + '</span>' +
            '</div>' +
          '</div>' +
          rowsHtml(L) +
        '</article>' +
        '<article class="tr-panel">' +
          '<div class="tr-panel-head"><span class="tr-kicker">Bis zu 5 pro Tag</span><h3>Einzelspiele zum Kombinieren</h3></div>' +
          '<div class="tr-kpis tr-kpis--single">' +
            '<div class="tr-kpi">' +
              '<span class="tr-kpi-label">Trefferquote</span>' +
              '<span class="tr-kpi-value">' + de(ep, 1) + '<small>%</small></span>' +
              '<span class="tr-kpi-sub">' + E.treffer + ' von ' + E.tipps + ' Tipps</span>' +
              bar(ep) +
            '</div>' +
          '</div>' +
        '</article>' +
      '</div>' +
      (!isY && m.rueckrechnung ? '<p class="tr-foot">' + (m.rueckrechnungText || '* Rückrechnung mit den Einstellungen vom 11.10.2026') + '</p>' : '') +
      (isY && m.rueckMonate.length ? '<p class="tr-foot">* Enthält rückgerechnete Zeiträume (' + m.rueckMonate.map(monthName).join(", ") + '); die genauen Zeiträume stehen beim jeweiligen Monat.</p>' : '') +
      (isY ? '<p class="tr-foot">Das Jahr ist die Summe der Monatsberichte. Längste Verlustserie und größter Rückgang weisen wir nur je Monat aus. Ein neues Jahr erscheint hier mit seinem ersten Monatsbericht.</p>' : '');

    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === set.length - 1;

    var dots = dotsEl.children;
    for (var i = 0; i < dots.length; i++) {
      dots[i].setAttribute("aria-selected", i === idx ? "true" : "false");
      dots[i].tabIndex = i === idx ? 0 : -1;
    }
  }

  function go(i) {
    if (i < 0 || i >= set.length || i === idx) return;
    idx = i;
    if (mode === "monat") monthIdx = i; else yearIdx = i;
    body.classList.remove("is-in");
    void body.offsetWidth; // Animation neu starten
    body.classList.add("is-in");
    render();
  }

  function buildDots() {
    dotsEl.innerHTML = "";
    if (set.length > 1) {
      root.classList.remove("is-single");
      set.forEach(function (m, i) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "tr-dot";
        d.setAttribute("role", "tab");
        d.setAttribute("aria-label", mode === "jahr" ? m.name : monthName(m.monat));
        d.addEventListener("click", function () { go(i); });
        dotsEl.appendChild(d);
      });
    } else {
      root.classList.add("is-single");
    }
  }

  function showMode(next) {
    mode = next;
    for (var i = 0; i < modeBtns.length; i++)
      modeBtns[i].setAttribute("aria-pressed", modeBtns[i].getAttribute("data-tr-mode") === mode ? "true" : "false");
    if (mode === "jahr") {
      set = years; idx = yearIdx;
    } else {
      set = data; idx = monthIdx;
    }
    buildDots();
    render();
  }
  for (var k = 0; k < modeBtns.length; k++) {
    (function (b) { b.addEventListener("click", function () { showMode(b.getAttribute("data-tr-mode")); }); })(modeBtns[k]);
  }
  buildDots();

  prevBtn.addEventListener("click", function () { go(idx - 1); });
  nextBtn.addEventListener("click", function () { go(idx + 1); });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { go(idx - 1); }
    if (e.key === "ArrowRight") { go(idx + 1); }
  });

  // Wischen auf dem Handy
  var x0 = null;
  body.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  body.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) go(dx > 0 ? idx - 1 : idx + 1);
    x0 = null;
  }, { passive: true });

  render();
})();

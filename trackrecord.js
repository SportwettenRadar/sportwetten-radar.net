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

  // Wochen (Mo bis So, volle 7 Tage) gehören zu dem Monat, in dem die meisten ihrer Tage liegen (Feld "monat").
  // Quelle: window.TRACKRECORD_WOCHEN
  var allWeeks = (window.TRACKRECORD_WOCHEN || [])
    .filter(function (w) { return w && /^\d{4}-\d{2}$/.test(w.monat) && /^\d{4}-\d{2}-\d{2}$/.test(w.von) && /^\d{4}-\d{2}-\d{2}$/.test(w.bis); })
    .sort(function (a, b) { return a.von < b.von ? -1 : 1; });
  // Monate, für die schon Wochen, aber noch kein Monatsbericht vorliegt (laufender Monat), kommen dazu.
  var haveKeys = {};
  data.forEach(function (m) { haveKeys[m.monat] = true; });
  allWeeks.forEach(function (w) {
    if (!haveKeys[w.monat]) { haveKeys[w.monat] = true; data.push({ monat: w.monat, keinBericht: true }); }
  });
  data.sort(function (a, b) { return a.monat < b.monat ? -1 : 1; });
  var modeBtns = root.querySelectorAll("[data-tr-mode]");
  var labelEl = root.querySelector("[data-tr-label]");
  var mode = "monat";
  var monthIdx = data.length - 1;
  for (var q = data.length - 1; q >= 0; q--) { if (!data[q].keinBericht) { monthIdx = q; break; } } // neuester Monat mit Bericht
  var weeks = [];
  var idx = monthIdx;
  var set = data;

  function dm(s) { var p = s.split("-"); return parseInt(p[2], 10) + "." + parseInt(p[1], 10) + "."; }
  function weekName(w) { return dm(w.von) + " bis " + dm(w.bis); }

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
    var isW = mode === "woche";
    if (m.keinBericht && !isW) {
      nameEl.textContent = monthName(m.monat);
      if (labelEl) labelEl.textContent = "Monatsbericht";
      body.innerHTML = '<p class="tr-empty">Der Monatsbericht für ' + monthName(m.monat) + ' erscheint am 1. des Folgemonats. Die Wochenwerte findest du schon unter „Woche“.</p>';
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === set.length - 1;
      var dd = dotsEl.children;
      for (var j = 0; j < dd.length; j++) { dd[j].setAttribute("aria-selected", j === idx ? "true" : "false"); dd[j].tabIndex = j === idx ? 0 : -1; }
      return;
    }
    var per = isW ? "in der Woche" : "im Monat";
    var L = m.live || {};
    var E = m.einzelspiele || {};
    var lp = pct(L.treffer, L.wetten);
    var ep = pct(E.treffer, E.tipps);

    nameEl.textContent = isW ? weekName(m) : monthName(m.monat);
    if (labelEl) labelEl.textContent = isW ? "Wochenbericht · " + monthName(m.monat) : "Monatsbericht";

    /* Gewinn in Einsätzen: aus dem Feld gewinn, sonst Rendite × Anzahl Live-Wetten (Einheitseinsatz) */
    var G = (typeof L.gewinn === "number") ? L.gewinn : Math.round(L.rendite * L.wetten) / 100;
    body.innerHTML =
      '<div class="tr-grid">' +
        '<article class="tr-panel">' +
          '<div class="tr-panel-head"><span class="tr-kicker">Kernangebot</span><h3>Live-Wetten' + (m.rueckrechnung ? '<sup class="tr-star">*</sup>' : '') + '</h3></div>' +
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
      (m.rueckrechnung ? '<p class="tr-foot">* Rückrechnung mit den aktuellen Einstellungen</p>' : '') +
      (isW && idx === 0 && window.TRACKRECORD_WOCHEN_HINWEIS ? '<p class="tr-foot">' + window.TRACKRECORD_WOCHEN_HINWEIS + '</p>' : '') +
      (isW ? '<p class="tr-foot">Wochen laufen von Montag bis Sonntag und zählen zu dem Monat, in dem die meisten ihrer Tage liegen. Die Summe der Wochen kann deshalb vom Monatswert abweichen.</p>' : '');

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
    if (mode === "monat") monthIdx = i;
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
        d.setAttribute("aria-label", mode === "woche" ? weekName(m) : monthName(m.monat));
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
    if (mode === "woche") {
      // Woche öffnet immer mit der neuesten Woche; "←" führt durch alle Wochen zurück, auch über Monatsgrenzen.
      if (!allWeeks.length) {
        set = []; idx = 0;
        nameEl.textContent = monthName(data[monthIdx].monat);
        if (labelEl) labelEl.textContent = "Wochenbericht";
        body.innerHTML = '<p class="tr-empty">' + (window.TRACKRECORD_WOCHEN_HINWEIS || "Es liegen noch keine Wochenwerte vor.") + '</p>';
        prevBtn.disabled = nextBtn.disabled = true;
        dotsEl.innerHTML = "";
        return;
      }
      set = allWeeks; idx = allWeeks.length - 1;
    } else {
      set = data; idx = monthIdx;
    }
    buildDots();
    render();
  }
  for (var k = 0; k < modeBtns.length; k++) {
    (function (b) { b.addEventListener("click", function () { showMode(b.getAttribute("data-tr-mode")); }); })(modeBtns[k]);
  }
  if (!allWeeks.length) root.classList.add("no-weeks");
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

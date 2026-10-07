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

  var idx = data.length - 1; // neuester Monat

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
  function tone(n) {
    return n > 0 ? "is-pos" : n < 0 ? "is-neg" : "";
  }
  function bar(p) {
    return '<div class="tr-bar" aria-hidden="true"><span style="width:' + Math.max(0, Math.min(100, p)).toFixed(1) + '%"></span></div>';
  }

  function render() {
    var m = data[idx];
    var L = m.live || {};
    var E = m.einzelspiele || {};
    var lp = pct(L.treffer, L.wetten);
    var ep = pct(E.treffer, E.tipps);

    nameEl.textContent = monthName(m.monat);

    body.innerHTML =
      '<div class="tr-grid">' +
        '<article class="tr-panel">' +
          '<div class="tr-panel-head"><span class="tr-kicker">Kernangebot</span><h3>Live-Wetten</h3></div>' +
          '<div class="tr-kpis">' +
            '<div class="tr-kpi">' +
              '<span class="tr-kpi-label">Trefferquote</span>' +
              '<span class="tr-kpi-value">' + de(lp, 1) + '<small>%</small></span>' +
              '<span class="tr-kpi-sub">' + L.treffer + ' von ' + L.wetten + ' Live-Wetten</span>' +
              bar(lp) +
            '</div>' +
            '<div class="tr-kpi">' +
              '<span class="tr-kpi-label">Rendite</span>' +
              '<span class="tr-kpi-value ' + tone(L.rendite) + '">' + signed(L.rendite, 1) + '<small>%</small></span>' +
              '<span class="tr-kpi-sub">im Monat</span>' +
            '</div>' +
          '</div>' +
          '<dl class="tr-rows">' +
            '<div><dt>Längste Verlustserie</dt><dd>' + L.verlustserie + ' in Folge</dd></div>' +
            '<div><dt>Größter Rückgang</dt><dd class="' + tone(L.rueckgang) + '">' + signed(L.rueckgang, 1) + ' Einsätze</dd></div>' +
            '<div><dt>Bester Tag</dt><dd class="' + tone(L.besterTag) + '">' + signed(L.besterTag, 1) + ' Einsätze</dd></div>' +
            '<div><dt>Schlechtester Tag</dt><dd class="' + tone(L.schlechtesterTag) + '">' + signed(L.schlechtesterTag, 1) + ' Einsätze</dd></div>' +
          '</dl>' +
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
      '</div>';

    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === data.length - 1;

    var dots = dotsEl.children;
    for (var i = 0; i < dots.length; i++) {
      dots[i].setAttribute("aria-selected", i === idx ? "true" : "false");
      dots[i].tabIndex = i === idx ? 0 : -1;
    }
  }

  function go(i) {
    if (i < 0 || i >= data.length || i === idx) return;
    idx = i;
    body.classList.remove("is-in");
    void body.offsetWidth; // Animation neu starten
    body.classList.add("is-in");
    render();
  }

  // Punkte nur bei mehr als einem Monat
  if (data.length > 1) {
    data.forEach(function (m, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "tr-dot";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", monthName(m.monat));
      d.addEventListener("click", function () { go(i); });
      dotsEl.appendChild(d);
    });
  } else {
    root.classList.add("is-single");
  }

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

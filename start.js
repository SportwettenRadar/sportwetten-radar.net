/* Umschaltung zum Verkaufsstart: ab 08.01.2027, 0:00 Uhr (Berlin) werden die
   Warteliste-Knöpfe zu „Jetzt Mitglied werden“ (Bot-Link, Buchung per /abo).
   Am 08.01.2027 fest in den HTML-Code übernehmen und diese Datei entfernen. */
(function () {
  if (Date.now() < Date.UTC(2027, 0, 7, 23, 0, 0)) return;
  document.querySelectorAll(".cta-start").forEach(function (a) {
    a.href = a.getAttribute("data-after-href");
    a.textContent = a.getAttribute("data-after-text");
  });
  document.querySelectorAll(".cta-hint, .promo-howto").forEach(function (e) {
    e.textContent = e.getAttribute("data-after");
  });
  document.querySelectorAll(".pre-start").forEach(function (e) { e.hidden = true; });
})();

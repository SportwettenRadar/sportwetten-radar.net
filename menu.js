/* Menü-Knopf oben links: zeigt die Footer-Spalten (Produkt, Wissen, Rechtliches, Kontakt) als Dropdown.
   Inhalt wird aus dem Footer übernommen, damit beide immer gleich sind. */
(function () {
  var btn = document.querySelector(".nav-menu-btn");
  var panel = document.getElementById("site-menu");
  var grid = document.querySelector("footer .footer-grid");
  if (!btn || !panel || !grid) return;

  var inner = document.createElement("div");
  inner.className = "wrap site-menu-grid";
  Array.prototype.slice.call(grid.children).forEach(function (col) {
    inner.appendChild(col.cloneNode(true));
  });
  panel.appendChild(inner);

  function setOpen(open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    panel.hidden = !open;
    document.documentElement.classList.toggle("menu-open", open);
  }
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    setOpen(panel.hidden);
  });
  panel.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", function (e) {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) { setOpen(false); btn.focus(); }
  });
})();

/* „Nach oben“-Knopf: erscheint nach etwas Scrollen */
(function () {
  var b = document.createElement("button");
  b.type = "button";
  b.className = "to-top";
  b.setAttribute("aria-label", "Nach oben");
  b.innerHTML = '<span aria-hidden="true">↑</span>';
  b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  document.body.appendChild(b);
  function check() { b.classList.toggle("show", window.scrollY > 900); }
  window.addEventListener("scroll", check, { passive: true });
  check();
})();

/* Aktiven Bereich in der oberen Leiste markieren (nur Abschnitte dieser Seite) */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!links.length || !("IntersectionObserver" in window)) return;
  var map = {};
  links.forEach(function (a) {
    var s = document.getElementById(a.getAttribute("href").slice(1));
    if (s) map[s.id] = a;
  });
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove("active"); a.removeAttribute("aria-current"); });
      var a = map[en.target.id];
      if (a) { a.classList.add("active"); a.setAttribute("aria-current", "true"); }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(map).forEach(function (id) { obs.observe(document.getElementById(id)); });
})();

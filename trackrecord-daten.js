/* =====================================================================
   TRACKRECORD-DATEN  —  wird von tools/auto_ergebnisse.py aus daten/ergebnisse.json
   (und daten/signale.json für die Ø-Quote) geschrieben. Nicht von Hand ändern.

   Anzeige-Regeln (Daniel, 06.11.2026):
   - Tage, Wochen, Monate: Wetten, Treffer (mit Prozent) und Ø-Quote. KEINE Einsätze, KEINE Rendite.
   - Einsätze und Rendite nur je Kalenderjahr (TRACKRECORD_JAHRE) und erst ab 100 Live-Wetten im Jahr.
   - Ø-Quote = Durchschnitt der Quoten aller gesetzten Live-Wetten des Zeitraums.
   ===================================================================== */

window.TRACKRECORD = [

  {
    monat: "2026-10",
    rueckrechnung: true,
    live: {
      wetten: 247,
      treffer: 154,
      verlustserie: 5,
      quote: 1.57
    },
    einzelspiele: {
      tipps: 141,
      treffer: 111
    }
  },

  {
    monat: "2026-09",
    rueckrechnung: true,
    live: {
      wetten: 104,
      treffer: 73,
      verlustserie: 3,
      quote: 1.6
    },
    einzelspiele: {
      tipps: 49,
      treffer: 39
    }
  }

];

/* Wochen (Mo–So). Der Monat ist der Mehrheitsmonat der Woche. */
window.TRACKRECORD_WOCHEN = [
  {
    monat: "2026-09",
    von: "2026-08-31",
    bis: "2026-09-06",
    rueckrechnung: true,
    live: {
      wetten: 23,
      treffer: 15,
      verlustserie: 2,
      quote: 1.6
    },
    einzelspiele: {
      tipps: 0,
      treffer: 0
    }
  },
  {
    monat: "2026-09",
    von: "2026-09-07",
    bis: "2026-09-13",
    rueckrechnung: true,
    live: {
      wetten: 41,
      treffer: 29,
      verlustserie: 3,
      quote: 1.6
    },
    einzelspiele: {
      tipps: 0,
      treffer: 0
    }
  },
  {
    monat: "2026-09",
    von: "2026-09-14",
    bis: "2026-09-20",
    rueckrechnung: true,
    live: {
      wetten: 38,
      treffer: 27,
      verlustserie: 2,
      quote: 1.59
    },
    einzelspiele: {
      tipps: 29,
      treffer: 21
    }
  },
  {
    monat: "2026-09",
    von: "2026-09-21",
    bis: "2026-09-27",
    rueckrechnung: true,
    live: {
      wetten: 2,
      treffer: 2,
      verlustserie: 0,
      quote: 1.64
    },
    einzelspiele: {
      tipps: 15,
      treffer: 14
    }
  },
  {
    monat: "2026-10",
    von: "2026-09-28",
    bis: "2026-10-04",
    rueckrechnung: true,
    live: {
      wetten: 2,
      treffer: 2,
      verlustserie: 0,
      quote: 1.58
    },
    einzelspiele: {
      tipps: 21,
      treffer: 17
    }
  },
  {
    monat: "2026-10",
    von: "2026-10-05",
    bis: "2026-10-11",
    rueckrechnung: true,
    live: {
      wetten: 42,
      treffer: 29,
      verlustserie: 3,
      quote: 1.57
    },
    einzelspiele: {
      tipps: 27,
      treffer: 22
    }
  },
  {
    monat: "2026-10",
    von: "2026-10-12",
    bis: "2026-10-18",
    live: {
      wetten: 75,
      treffer: 42,
      verlustserie: 5,
      quote: 1.58
    },
    einzelspiele: {
      tipps: 34,
      treffer: 27
    }
  },
  {
    monat: "2026-10",
    von: "2026-10-19",
    bis: "2026-10-25",
    live: {
      wetten: 71,
      treffer: 47,
      verlustserie: 4,
      quote: 1.57
    },
    einzelspiele: {
      tipps: 34,
      treffer: 27
    }
  },
  {
    monat: "2026-10",
    von: "2026-10-26",
    bis: "2026-11-01",
    live: {
      wetten: 67,
      treffer: 39,
      verlustserie: 5,
      quote: 1.57
    },
    einzelspiele: {
      tipps: 35,
      treffer: 26
    }
  }
];

/* Hinweis, wenn für einen Monat keine Wochenwerte angezeigt werden können. */
window.TRACKRECORD_WOCHEN_HINWEIS = "Wochenwerte veröffentlichen wir ab dem 5. Oktober 2026. Frühere Werte stammen aus anderen Bot-Einstellungen und sind nicht vergleichbar. Für frühere Monate zeigen wir den Monatsbericht.";

/* Kurve: kumulierte Einsätze je Tag, je Kalenderjahr bei 0 beginnend (d = Datum, g = Stand am Tagesende, rr = nur Logik für Fußnote/Hinterlegung).
   Ein Jahr erscheint erst ab 100 Live-Wetten. */
window.TRACKRECORD_TAGE = [
  {"d": "2026-09-01", "g": 0.0, "rr": true},
  {"d": "2026-09-02", "g": 1.7, "rr": true},
  {"d": "2026-09-03", "g": 1.8, "rr": true},
  {"d": "2026-09-04", "g": 3.5, "rr": true},
  {"d": "2026-09-05", "g": 3.5, "rr": true},
  {"d": "2026-09-06", "g": 0.9, "rr": true},
  {"d": "2026-09-07", "g": 5.0, "rr": true},
  {"d": "2026-09-08", "g": 5.0, "rr": true},
  {"d": "2026-09-09", "g": 4.2, "rr": true},
  {"d": "2026-09-10", "g": 4.2, "rr": true},
  {"d": "2026-09-11", "g": 6.6, "rr": true},
  {"d": "2026-09-12", "g": 8.6, "rr": true},
  {"d": "2026-09-13", "g": 6.4, "rr": true},
  {"d": "2026-09-14", "g": 6.4, "rr": true},
  {"d": "2026-09-15", "g": 5.4, "rr": true},
  {"d": "2026-09-16", "g": 6.0, "rr": true},
  {"d": "2026-09-17", "g": 6.0, "rr": true},
  {"d": "2026-09-18", "g": 6.3, "rr": true},
  {"d": "2026-09-19", "g": 8.9, "rr": true},
  {"d": "2026-09-20", "g": 11.4, "rr": true},
  {"d": "2026-09-21", "g": 11.4, "rr": true},
  {"d": "2026-09-22", "g": 11.4, "rr": true},
  {"d": "2026-09-23", "g": 11.4, "rr": true},
  {"d": "2026-09-24", "g": 11.4, "rr": true},
  {"d": "2026-09-25", "g": 12.1, "rr": true},
  {"d": "2026-09-26", "g": 12.7, "rr": true},
  {"d": "2026-09-27", "g": 12.7, "rr": true},
  {"d": "2026-09-28", "g": 12.7, "rr": true},
  {"d": "2026-09-29", "g": 12.7, "rr": true},
  {"d": "2026-09-30", "g": 12.7, "rr": true},
  {"d": "2026-10-01", "g": 12.7, "rr": true},
  {"d": "2026-10-02", "g": 12.7, "rr": true},
  {"d": "2026-10-03", "g": 13.8, "rr": true},
  {"d": "2026-10-04", "g": 13.8, "rr": true},
  {"d": "2026-10-05", "g": 13.8, "rr": true},
  {"d": "2026-10-06", "g": 13.8, "rr": true},
  {"d": "2026-10-07", "g": 13.8, "rr": true},
  {"d": "2026-10-08", "g": 13.8, "rr": true},
  {"d": "2026-10-09", "g": 12.1, "rr": true},
  {"d": "2026-10-10", "g": 14.6, "rr": true},
  {"d": "2026-10-11", "g": 17.4, "rr": false},
  {"d": "2026-10-12", "g": 16.4, "rr": false},
  {"d": "2026-10-13", "g": 19.5, "rr": false},
  {"d": "2026-10-14", "g": 17.5, "rr": false},
  {"d": "2026-10-15", "g": 17.2, "rr": false},
  {"d": "2026-10-16", "g": 18.3, "rr": false},
  {"d": "2026-10-17", "g": 14.5, "rr": false},
  {"d": "2026-10-18", "g": 9.0, "rr": false},
  {"d": "2026-10-19", "g": 8.6, "rr": false},
  {"d": "2026-10-20", "g": 9.3, "rr": false},
  {"d": "2026-10-21", "g": 10.1, "rr": false},
  {"d": "2026-10-22", "g": 11.5, "rr": false},
  {"d": "2026-10-23", "g": 10.8, "rr": false},
  {"d": "2026-10-24", "g": 8.9, "rr": false},
  {"d": "2026-10-25", "g": 11.7, "rr": false},
  {"d": "2026-10-26", "g": 12.2, "rr": false},
  {"d": "2026-10-27", "g": 14.8, "rr": false},
  {"d": "2026-10-28", "g": 14.6, "rr": false},
  {"d": "2026-10-29", "g": 15.9, "rr": false},
  {"d": "2026-10-30", "g": 15.2, "rr": false},
  {"d": "2026-10-31", "g": 8.2, "rr": false},
  {"d": "2026-11-01", "g": 6.1, "rr": false},
  {"d": "2026-11-02", "g": 5.3, "rr": false},
  {"d": "2026-11-03", "g": 4.4, "rr": false},
  {"d": "2026-11-04", "g": 4.8, "rr": false},
  {"d": "2026-11-05", "g": 3.8, "rr": false},
  {"d": "2026-11-06", "g": 2.1, "rr": false}
];

/* Kalenderjahre: Wetten, Treffer, Ø-Quote; gewinn (Einsätze) und rendite sind null, solange das Jahr unter 100 Live-Wetten hat. */
window.TRACKRECORD_JAHRE = [
  {"jahr": 2026, "ab": "2026-09-01", "stand": "2026-11-06", "wetten": 380, "treffer": 242, "quote": 1.58, "gewinn": 2.1, "rendite": 0.6, "rueckrechnung": true}
];

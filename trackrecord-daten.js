/* =====================================================================
   TRACKRECORD-DATEN  —  wird von tools/auto_ergebnisse.py aus daten/ergebnisse.json
   (und daten/signale.json für die Ø-Quote) geschrieben. Nicht von Hand ändern.

   Anzeige-Regeln (Daniel, 06.11.2026):
   - Tage, Wochen, Monate: Wetten, Treffer (mit Prozent) und Ø-Quote. KEINE Einsätze, KEINE Rendite.
   - Einsätze und Rendite stehen NICHT auf der Homepage (nur in den Telegram-Kanälen, je Kalenderjahr ab 100 Live-Wetten).
   - Jahreskurve: kumulierte Trefferquote je Tag, erst ab 100 Live-Wetten im Jahr, Beginn ab 20 Wetten (Entscheidung 09.11.2026).
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
  },
  {
    monat: "2026-11",
    von: "2026-11-02",
    bis: "2026-11-08",
    live: {
      wetten: 58,
      treffer: 37,
      quote: 1.46,
      verlustserie: 2
    },
    einzelspiele: {
      tipps: 35,
      treffer: 26
    }
  }
];

/* Hinweis, wenn für einen Monat keine Wochenwerte angezeigt werden können. */
window.TRACKRECORD_WOCHEN_HINWEIS = "Wochenwerte veröffentlichen wir ab dem 5. Oktober 2026. Frühere Werte stammen aus anderen Bot-Einstellungen und sind nicht vergleichbar. Für frühere Monate zeigen wir den Monatsbericht.";

/* Kurve: kumulierte Trefferquote in % je Tag, je Kalenderjahr neu beginnend (d = Datum, q = Stand am Tagesende, rr = nur Logik für Fußnote/Hinterlegung).
   Ein Jahr erscheint erst ab 100 Live-Wetten. */
window.TRACKRECORD_TAGE = [
  {"d": "2026-09-06", "q": 65.2, "rr": true},
  {"d": "2026-09-07", "q": 73.3, "rr": true},
  {"d": "2026-09-08", "q": 73.3, "rr": true},
  {"d": "2026-09-09", "q": 70.6, "rr": true},
  {"d": "2026-09-10", "q": 70.6, "rr": true},
  {"d": "2026-09-11", "q": 73.2, "rr": true},
  {"d": "2026-09-12", "q": 73.1, "rr": true},
  {"d": "2026-09-13", "q": 68.8, "rr": true},
  {"d": "2026-09-14", "q": 68.8, "rr": true},
  {"d": "2026-09-15", "q": 67.7, "rr": true},
  {"d": "2026-09-16", "q": 68.2, "rr": true},
  {"d": "2026-09-17", "q": 68.2, "rr": true},
  {"d": "2026-09-18", "q": 68.1, "rr": true},
  {"d": "2026-09-19", "q": 68.9, "rr": true},
  {"d": "2026-09-20", "q": 69.6, "rr": true},
  {"d": "2026-09-21", "q": 69.6, "rr": true},
  {"d": "2026-09-22", "q": 69.6, "rr": true},
  {"d": "2026-09-23", "q": 69.6, "rr": true},
  {"d": "2026-09-24", "q": 69.6, "rr": true},
  {"d": "2026-09-25", "q": 69.9, "rr": true},
  {"d": "2026-09-26", "q": 70.2, "rr": true},
  {"d": "2026-09-27", "q": 70.2, "rr": true},
  {"d": "2026-09-28", "q": 70.2, "rr": true},
  {"d": "2026-09-29", "q": 70.2, "rr": true},
  {"d": "2026-09-30", "q": 70.2, "rr": true},
  {"d": "2026-10-01", "q": 70.2, "rr": true},
  {"d": "2026-10-02", "q": 70.2, "rr": true},
  {"d": "2026-10-03", "q": 70.8, "rr": true},
  {"d": "2026-10-04", "q": 70.8, "rr": true},
  {"d": "2026-10-05", "q": 70.8, "rr": true},
  {"d": "2026-10-06", "q": 70.8, "rr": true},
  {"d": "2026-10-07", "q": 70.8, "rr": true},
  {"d": "2026-10-08", "q": 70.8, "rr": true},
  {"d": "2026-10-09", "q": 69.3, "rr": true},
  {"d": "2026-10-10", "q": 69.7, "rr": true},
  {"d": "2026-10-11", "q": 70.3, "rr": false},
  {"d": "2026-10-12", "q": 69.8, "rr": false},
  {"d": "2026-10-13", "q": 70.7, "rr": false},
  {"d": "2026-10-14", "q": 69.8, "rr": false},
  {"d": "2026-10-15", "q": 69.2, "rr": false},
  {"d": "2026-10-16", "q": 69.2, "rr": false},
  {"d": "2026-10-17", "q": 67.3, "rr": false},
  {"d": "2026-10-18", "q": 65.5, "rr": false},
  {"d": "2026-10-19", "q": 65.4, "rr": false},
  {"d": "2026-10-20", "q": 65.5, "rr": false},
  {"d": "2026-10-21", "q": 65.7, "rr": false},
  {"d": "2026-10-22", "q": 66.0, "rr": false},
  {"d": "2026-10-23", "q": 65.7, "rr": false},
  {"d": "2026-10-24", "q": 65.1, "rr": false},
  {"d": "2026-10-25", "q": 65.6, "rr": false},
  {"d": "2026-10-26", "q": 65.8, "rr": false},
  {"d": "2026-10-27", "q": 66.2, "rr": false},
  {"d": "2026-10-28", "q": 66.1, "rr": false},
  {"d": "2026-10-29", "q": 66.3, "rr": false},
  {"d": "2026-10-30", "q": 66.1, "rr": false},
  {"d": "2026-10-31", "q": 64.7, "rr": false},
  {"d": "2026-11-01", "q": 64.3, "rr": false},
  {"d": "2026-11-02", "q": 64.1, "rr": false},
  {"d": "2026-11-03", "q": 64.0, "rr": false},
  {"d": "2026-11-04", "q": 64.1, "rr": false},
  {"d": "2026-11-05", "q": 63.9, "rr": false},
  {"d": "2026-11-06", "q": 63.7, "rr": false},
  {"d": "2026-11-07", "q": 63.4, "rr": false},
  {"d": "2026-11-08", "q": 64.2, "rr": false},
  {"d": "2026-11-09", "q": 64.1, "rr": false},
  {"d": "2026-11-10", "q": 64.2, "rr": false},
  {"d": "2026-11-11", "q": 64.2, "rr": false},
  {"d": "2026-11-12", "q": 64.3, "rr": false},
  {"d": "2026-11-13", "q": 64.2, "rr": false}
];

/* Kalenderjahre: Wetten, Treffer, Ø-Quote; keine Einsätze/Rendite. */
window.TRACKRECORD_JAHRE = [
  {"jahr": 2026, "ab": "2026-09-01", "stand": "2026-11-13", "wetten": 425, "treffer": 273, "quote": 1.56, "rueckrechnung": true}
];

/* =====================================================================
   TRACKRECORD-DATEN  —  die einzige Datei, die du jeden Monat änderst
   =====================================================================

   SO PFLEGST DU EINEN NEUEN MONAT (ca. 3 Minuten, am 1. jedes Monats):

   1. Monatsbericht im Telegram-Kanal öffnen.
   2. Den Block unten "VORLAGE" kopieren und OBEN in die Liste einfügen
      (direkt unter "window.TRACKRECORD = [") — neuester Monat steht oben.
   3. Die Zahlen aus dem Monatsbericht abtippen:

        Monatsbericht                          ->  Feld hier
        ---------------------------------------------------------------
        Live-Wetten: 177                       ->  wetten: 177
        Treffer: 126 (71,2 %)                  ->  treffer: 126
        Rendite: +13,8 %                       ->  rendite: 13.8
        (Gewinn in Einsätzen rechnet die Seite selbst: Rendite × Live-Wetten.
         Steht er im Bericht genauer, optional: gewinn: 24.4)
        Längste Verlustserie: 4 in Folge       ->  verlustserie: 4
        Größter Rückgang: -4,9 Einsätze        ->  rueckgang: -4.9
        Bester Tag: +5,3 Einsätze              ->  besterTag: 5.3
        Schlechtester Tag: -2,2 Einsätze       ->  schlechtesterTag: -2.2
        Einzelspiele Tipps: 49                 ->  tipps: 49
        Einzelspiele Treffer: 39 (79,6 %)      ->  treffer: 39

      WICHTIG:
      - Dezimalzahlen mit PUNKT, nicht mit Komma (13.8 statt 13,8).
      - Minuszeichen als normales "-" tippen.
      - Prozentwerte NICHT eintragen — die Seite rechnet sie selbst aus
        Treffer / Anzahl aus. Weicht das Ergebnis vom Bericht ab, ist
        beim Abtippen ein Fehler passiert.
      - Jeder Monatsblock endet mit "}," (Komma nicht vergessen).
      - Optional: Die Zeile "rueckrechnung: true," ist nur eine Markierung (Logik). Sie zeigt den Stern am Monat
        und die eine Fußnote unter der Auswertung. Der Text steht in trackrecord.js und wird nie je Monat geändert.

   4. Datei speichern und bei GitHub hochladen
      (Repository -> "Add file" -> "Upload files" -> diese Datei ablegen
      -> "Commit changes"). Nach 1–2 Minuten ist der Monat online.

   VORLAGE (kopieren, nicht hier ändern):

  {
    monat: "2026-10",
    live: {
      wetten: 0,
      treffer: 0,
      rendite: 0.0,
      verlustserie: 0,
      rueckgang: 0.0,
      besterTag: 0.0,
      schlechtesterTag: 0.0
    },
    einzelspiele: {
      tipps: 0,
      treffer: 0
    }
  },

   ===================================================================== */

window.TRACKRECORD = [

  {
    monat: "2026-10",
    rueckrechnung: true,
    live: {
      wetten: 247,
      treffer: 154,
      rendite: -1.8,
      gewinn: -4.5,
      verlustserie: 5,
      rueckgang: -12.3,
      besterTag: 3.1,
      schlechtesterTag: -7
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
      rendite: 12.2,
      verlustserie: 3,
      rueckgang: -5,
      besterTag: 4.1,
      schlechtesterTag: -2.7,
      gewinn: 12.7
    },
    einzelspiele: {
      tipps: 49,
      treffer: 39
    }
  }

];

/* Wochen. Volle Wochen Montag bis Sonntag. Jede Woche gehört zu dem Monat, in dem die meisten ihrer 7 Tage liegen ("monat").
   Beispiel: 28.9. bis 4.10. gehört zum Oktober (4 von 7 Tage). Die Summe der Wochen kann deshalb vom Monat abweichen.
   Tage vor dem 11.10.2026 mit rueckrechnung: true markieren (nur Logik).
   Pflichtfelder: monat, von, bis, live.wetten, live.treffer, live.rendite, einzelspiele.tipps, einzelspiele.treffer.
   Rendite in Prozent bei gleichem Einsatz je Wette; der Gewinn in Einsätzen wird daraus berechnet (oder als live.gewinn eintragen).
   Verlustserie, rueckgang, besterTag, schlechtesterTag sind optional. */
window.TRACKRECORD_WOCHEN = [
  {
    monat: "2026-09",
    von: "2026-08-31",
    bis: "2026-09-06",
    rueckrechnung: true,
    live: {
      wetten: 23,
      treffer: 15,
      rendite: 3.8,
      gewinn: 0.9,
      verlustserie: 2,
      rueckgang: -3.5,
      besterTag: 1.7,
      schlechtesterTag: -2.7
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
      rendite: 13.3,
      gewinn: 5.5,
      verlustserie: 3,
      rueckgang: -4.2,
      besterTag: 4.1,
      schlechtesterTag: -2.3
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
      rendite: 13.3,
      gewinn: 5,
      verlustserie: 2,
      rueckgang: -2.4,
      besterTag: 2.6,
      schlechtesterTag: -1
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
      rendite: 63.8,
      gewinn: 1.3,
      verlustserie: 0,
      rueckgang: 0,
      besterTag: 0.7,
      schlechtesterTag: 0.6
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
      rendite: 57.5,
      gewinn: 1.2,
      verlustserie: 0,
      rueckgang: 0,
      besterTag: 1.2,
      schlechtesterTag: 1.2
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
      rendite: 8.5,
      gewinn: 3.6,
      verlustserie: 3,
      rueckgang: -3.3,
      besterTag: 2.8,
      schlechtesterTag: -1.7
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
      rendite: -11.3,
      gewinn: -8.4,
      verlustserie: 5,
      rueckgang: -11.1,
      besterTag: 3.1,
      schlechtesterTag: -5.5
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
      rendite: 3.9,
      gewinn: 2.7,
      verlustserie: 4,
      rueckgang: -5.6,
      besterTag: 2.8,
      schlechtesterTag: -1.9
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
      rendite: -8.3,
      gewinn: -5.6,
      verlustserie: 5,
      rueckgang: -10.9,
      besterTag: 2.6,
      schlechtesterTag: -7
    },
    einzelspiele: {
      tipps: 35,
      treffer: 26
    }
  }
];

/* Hinweis, wenn für einen Monat keine Wochenwerte angezeigt werden können. */
window.TRACKRECORD_WOCHEN_HINWEIS = "Wochenwerte veröffentlichen wir ab dem 5. Oktober 2026. Frühere Werte stammen aus anderen Bot-Einstellungen und sind nicht vergleichbar. Für frühere Monate zeigen wir den Monatsbericht.";

/* Kurve: kumulierte Einsätze je Tag seit Start (d = Datum, g = Stand am Tagesende, rr = nur Logik für Fußnote/Hinterlegung).
   Wird von tools/auto_ergebnisse.py aus ergebnisse.json geschrieben, nicht von Hand ändern. */
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
  {"d": "2026-11-03", "g": 4.4, "rr": false}
];

/* Stand seit Start (Kennzahlen über der Kurve). */
window.TRACKRECORD_START = {"stand": "2026-11-03", "wetten": 369, "treffer": 236, "gewinn": 4.4, "rendite": 1.2, "rueckrechnung": true};

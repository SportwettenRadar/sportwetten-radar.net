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
    monat: "2026-09",
    live: {
      wetten: 177,
      treffer: 126,
      rendite: 13.8,
      verlustserie: 4,
      rueckgang: -4.9,
      besterTag: 5.3,
      schlechtesterTag: -2.2
    },
    einzelspiele: {
      tipps: 49,
      treffer: 39
    }
  },

];

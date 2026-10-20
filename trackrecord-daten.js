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
      - Optional: Die Zeile "rueckrechnung: true," blendet unter dem Monat
        dezent "* Rückrechnung mit den aktuellen Einstellungen" ein. Nur fuer
        nachtraeglich neu gerechnete Monate verwenden (z. B. September 2026).

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
    rueckrechnung: true,
    live: {
      wetten: 104,
      treffer: 73,
      rendite: 12.2,
      verlustserie: 3,
      rueckgang: -5.0,
      besterTag: 4.1,
      schlechtesterTag: -2.7
    },
    einzelspiele: {
      tipps: 49,
      treffer: 39
    }
  },

];

/* Wochen. Jede Woche gehört zu einem Monat ("monat") und ist auf dessen Grenzen zugeschnitten
   (Mo bis So, am Monatsanfang/-ende eine Teilwoche). So ergeben die Wochen eines Monats zusammen den Monat.
   Pflichtfelder: monat, von, bis, live.wetten, live.treffer, live.rendite, einzelspiele.tipps, einzelspiele.treffer.
   Rendite in Prozent bei gleichem Einsatz je Wette; der Gewinn in Einsätzen wird daraus berechnet (oder als live.gewinn eintragen).
   Verlustserie, rueckgang, besterTag, schlechtesterTag sind optional. */
window.TRACKRECORD_WOCHEN = [
  {
    monat: "2026-10",
    von: "2026-10-12",
    bis: "2026-10-18",
    live: { wetten: 75, treffer: 42, rendite: -11.3 },
    einzelspiele: { tipps: 34, treffer: 27 }
  }
];

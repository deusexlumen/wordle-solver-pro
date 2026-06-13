# BUXE_OS v24.X -- SOLVER LANDSCAPE

## Stand
- **Wordle Solver PRO** ✅ fertig
- **Quordle Solver** ✅ fertig

## Kandidaten für die nächste Erweiterung

### 1. Wordle-Familie: Mehrere Boards
| Spiel | Boards | Beschreibung | Aufwand | Mehrwert |
|---|---|---|---|---|
| **Dordle** | 2 | Zwei Wordles parallel | Sehr gering | Gering, da Quordle bereits existiert |
| **Octordle** | 8 | Acht Wordles parallel | Gering | Hoch — logische Erweiterung von Quordle |
| **Sedecordle** | 16 | Sechzehn Wordles parallel | Mittel | Mittel — wird schnell unübersichtlich |
| **Duotrigordle** | 32 | 32 Wordles parallel | Mittel | Gering — eher Gimmick |
| **Waffle** | — | Buchstaben in Waffel-Grid tauschen | Mittel | Hoch — visuell anders, nutzt gleiche Engine |

### 2. NYT Wort-Rätsel
| Spiel | Mechanik | Aufwand | Mehrwert |
|---|---|---|---|
| **Connections** | 16 Wörter in 4 Gruppen à 4 sortieren | Mittel | Sehr hoch — extrem populär, braucht semantische Kategorien |
| **Spelling Bee** | Wörter aus 7 Buchstaben bilden (Mitte zwingend) | Mittel | Hoch — pure Wortlisten-Filterung |
| **Strands** | Themen-Wörter in 6×8-Grid finden | Hoch | Mittel — komplexere UI und Pfad-Suche |
| **Letter Boxed** | Wörter aus Buchstaben am Rand eines Quadrats bilden | Mittel | Hoch — gut mit Wortliste lösbar |

### 3. Zahlen-/Logik-Rätsel
| Spiel | Mechanik | Aufwand | Mehrwert |
|---|---|---|---|
| **Sudoku** | 9×9 Zahlenrätsel | Mittel | Sehr hoch — klassisch, viele Varianten |
| **Kakuro** | Kreuzwortartige Summen | Mittel | Hoch |
| **KenKen** | Sudoku + Rechenkäfige | Mittel | Hoch |
| **Futoshiki** | Ungleichheits-Sudoku | Mittel | Mittel |
| **Nerdle** | Mathe-Gleichung raten (6 Versuche, Farbfeedback) | Gering | Mittel — ähnlich Wordle, aber mit Zahlen |
| **Nonogram / Picross** | Pixel-Bild aus Zeilen-/Spaltenhinweisen | Mittel | Hoch — visuell sehr befriedigend |

### 4. Klassische Denkspiele / Logikrätsel
| Spiel | Mechanik | Aufwand | Mehrwert |
|---|---|---|---|
| **Mastermind** | Farbcode erraten mit Hinweisen | Gering | Hoch — einfach, aber tief |
| **Bulls and Cows** | Zahlencode erraten | Gering | Mittel |
| **Knights and Knaves** | Wahrheits-/Lügen-Logik | Mittel | Hoch — Rätsel-Generator + Solver |
| **Einstein's Riddle / Zebra Puzzle** | Logik-Grid-Rätsel | Mittel | Hoch |
| **Monty Hall Problem** | Wahrscheinlichkeits-Simulator | Sehr gering | Mittel — gut als Lern-Tool |
| **Tower of Hanoi** | Rekursions-Visualisierung | Sehr gering | Mittel |

### 5. Wissen/Medien
| Spiel | Mechanik | Aufwand | Mehrwert |
|---|---|---|---|
| **Worldle / Globle** | Land anhand Umriss oder Nähe raten | Mittel | Mittel — braucht Geodaten |
| **Flagle** | Flagge erraten | Mittel | Mittel |
| **Heardle** | Song anhand Snippet erraten | Hoch | Gering — Audio-Integration aufwändig |
| **Moviedle** | Film anhand Frame-Sequenz erraten | Hoch | Gering |

### 6. Semantische Rätsel
| Spiel | Mechanik | Aufwand | Mehrwert |
|---|---|---|---|
| **Contexto / Semantle** | Wort anhand semantischer Nähe raten | Hoch | Hoch — benötigt Word-Embeddings |
| **Redactle** | Fehlende Wörter in Wikipedia-Artikel erraten | Hoch | Mittel |

## Empfohlene Roadmap

1. **Sudoku** — Klassiker, sofort nützlich, viele Nutzer, gut als mathematischer Solver demonstrierbar.
2. **Nonogram / Picross** — Visuell anders als Wordle, aber sehr beliebt; Zeilen-/Spalten-Logik passt gut zu einem mathematischen Tool.
3. **Mastermind** — Schnell gebaut, intuitiv, und die Strategie (Entropie) können wir aus der Wordle-Engine recyclen.
4. **Connections** — Sehr beliebt, aber braucht semantische Kategorien (entweder manuell gepflegt oder mit Embeddings).

## Risiken/Hinweise
- **Connections**: Ohne gute Kategoriedatenbank ist ein Solver nur ein Assistent, kein perfekter Löser.
- **Contexto/Semantle**: Benötigt semantische Embeddings (z. B. via Sentence Transformers oder OpenAI API) — deutlich höherer Aufwand.
- **Heardle/Moviedle**: Urheberrecht und Medien-Integration problematisch.
- **Sudoku/Nonogram**: Brauchen keine externen APIs; können rein clientseitig mit Backtracking/Constraint-Propagation gelöst werden.

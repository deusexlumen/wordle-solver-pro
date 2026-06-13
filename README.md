# Wordle Solver PRO

Ein mathematischer Rätsel-Assistent für Wordle, Quordle, Sudoku und Nonogramme — gebaut mit Next.js 16, React 19 und TypeScript. Die Solver laufen komplett clientseitig; optional kannst du Screenshots per Gemini-OCR analysieren lassen.

## Features

- **Wordle Solver**
  - Filtert Kandidaten anhand von grün/gelb/grau-Feedback.
  - Entropie-basierte Vorschläge, die den Kandidatenraum maximal verkleinern.
  - Pattern-Trap-Scanner mit Eliminator-Wörtern.
  - Screenshot-Upload für Gemini-OCR-Analyse.

- **Quordle Solver**
  - Verwaltet vier Boards parallel mit gemeinsamer Eingabezeile.
  - Kombinierter Vorschlag, der alle Boards gleichzeitig voranbringt.

- **Sudoku Solver**
  - Backtracking mit Constraint Propagation (Single-Candidate) und MRV-Heuristik.
  - Interaktives 9×9-Grid.

- **Nonogram Solver**
  - Zeilen-/Spaltenbasierte Constraint Propagation plus Backtracking.
  - Eingabe der Hinweise als kommagetrennte Listen.

- **Mastermind Solver**
  - Code-Knacker für 6 Farben × 4 Positionen.
  - Minimax-Heuristik für optimale Vorschläge.
  - Manuelle Feedback-Eingabe (schwarz/weiß).

- **Kakuro Solver**
  - Summen-Rätsel-Assistent mit Constraint Propagation und Backtracking.
  - 5×5-Beispiel-Rätsel inklusive.

- **Connections Assistant**
  - Teilt 16 Wörter per Gemini-API in 4 thematische Gruppen ein.
  - Eingabe als Text oder kommagetrennte Liste.

- **Gemini OCR**
  - Route `/api/gemini/analyze-screenshot` analysiert hochgeladene Screenshots.
  - Retry/Backoff mit `gemini-2.5-flash-lite` als Primary und `gemini-2.5-flash` als Fallback.

## Tech-Stack

- **Framework:** Next.js 16.2.9 (App Router)
- **UI:** React 19.2.4, Tailwind CSS 4.3.0, shadcn/ui
- **Sprache:** TypeScript 5.9.3
- **Tests:** Vitest 4.1.8, jsdom, React Testing Library
- **Linting:** ESLint 9 Flat Config
- **OCR:** `@google/genai`
- **Package-Manager:** pnpm

## Setup

```bash
pnpm install
pnpm build:words   # Baut public/words.json aus word-list
pnpm dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Verfügbare Scripts

| Script | Beschreibung |
|--------|--------------|
| `pnpm dev` | Startet den Dev-Server |
| `pnpm build` | Baut Wortliste + Produktionsbuild |
| `pnpm build:words` | Generiert `public/words.json` |
| `pnpm start` | Startet den Produktionsserver |
| `pnpm test` | Führt Vitest-Tests aus |
| `pnpm lint` | Führt ESLint über das Projekt aus |

## Projektstruktur (Auszug)

```
app/
  api/gemini/analyze-screenshot/     # Gemini OCR API
  api/gemini/analyze-connections/  # Gemini Connections API
  connections/                     # Connections UI
  kakuro/                          # Kakuro UI
  mastermind/                      # Mastermind UI
  nonogram/                        # Nonogram UI
  quordle/                         # Quordle UI
  sudoku/                          # Sudoku UI
  page.tsx                         # Wordle UI
components/
  connections/                     # ConnectionsBoard
  kakuro/                          # KakuroBoard
  mastermind/                      # MastermindBoard
  nonogram/                        # NonogramBoard
  sudoku/                          # SudokuBoard
  wordle/                          # Wordle-Komponenten
hooks/
  useWordle.ts
  useQuordle.ts
lib/
  solver.ts                       # Wordle-Logik
  gameState.ts                    # Quordle-State-Hilfen
  sudoku.ts                       # Sudoku-Engine
  nonogram.ts                     # Nonogram-Engine
  gemini.ts                       # Gemini-Client
  words.ts                        # Wortlisten-Utils
tests/                            # Vitest-Tests
```

## Tests

```bash
pnpm test
```

Aktuell sind **41 Tests** enthalten für Wordle-, Quordle-, Sudoku-, Nonogram-, Mastermind-, Kakuro- und Connections-Logik.

## Umgebungsvariablen

Für die Gemini-OCR-Funktion wird ein Google API-Key benötigt:

```bash
cp .env.local.example .env.local
# GOOGLE_API_KEY=dein-key-hier-einfügen
```

Ohne API-Key funktionieren alle Solver weiterhin; nur der Screenshot-Upload schlägt fehl.

## Deployment

Die App wird als statischer Export gebaut (`output: 'export'` in `next.config.ts`) und kann auf jedem Static-Hoster deployed werden.

```bash
pnpm build
```

## Lizenz

MIT

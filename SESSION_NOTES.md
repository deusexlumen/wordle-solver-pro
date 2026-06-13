# BUXE_OS v24.X -- SESSION_NOTES

## Current Project State

- **Entscheidung/Projekt:** Next.js-Projekt `wordle-solver-pro` im `Projects/`-Root als mathematischer Assistent für Wordle und weitere Rätsel.
- **Tech-Stack:** Next.js 16.2.9, React 19.2.4, TypeScript 5.9.3, Tailwind CSS 4.3.0, shadcn/ui, pnpm, `@google/genai`, `word-list`, `react-dropzone`, Vitest.
- **Implementierte Solver:** Wordle, Quordle, Sudoku, Nonogram, Mastermind, Kakuro, Connections, Math Trivia Quiz.
- **Build/Qualität (Stand 2026-06-13):**
  - `pnpm build` ✅
  - `pnpm test` ✅ (48/48 Tests)
  - `pnpm lint` ✅ (ESLint 9 Flat Config, `scripts/` ignoriert)

## Recent Decisions / Learnings

- `suppressHydrationWarning` im `<html>`-Tag.
- Explizite `"en-US"` Locale bei Zahlenformatierung.
- Korrekte lexikalische Hook-Reihenfolge (`remainingCandidates` vor abgeleiteten Heuristiken).
- TypeScript-konforme `//`-BUXE-Header (keine `#`-Header in TS/TSX).

## Active Open Items / TODO (Ideen-Pool)

- Hangman Solver (Wortraten mit Buchstaben-Häufigkeit).
- Crossword Helper (Muster-Matching gegen Wortliste).
- Countdown Zahlenrunde (Solver für das britische TV-Rätsel).
- Cryptoquote / Substitutions-Chiffre-Assistent.
- 2048-Tippgeber oder automatischer Spieler.
- Brainfuck-/Code-Puzzle-Generator für Anfänger.
- Optional: tatsächliche Gemini-OCR mit echtem API-Key testen.

---

## Archive

### Wordle Solver PRO Initialbau (2026-06-12)

- **Solver-Engine:** Clientseitiger Filter für grün/gelb/grau inklusive Mehrfachbuchstaben, Entropie-basierte Vorschläge, Pattern-Trap-Scanner mit Eliminator-Wörtern.
- **OCR:** `/api/gemini/analyze-screenshot` mit Retry/Backoff (primary `gemini-2.5-flash-lite`, fallback `gemini-2.5-flash`).
- **Build/Qualität:**
  - `pnpm build` ✅
  - `pnpm test` ✅ (48/48 Tests)
  - `pnpm lint` ✅ (ESLint 9 Flat Config, `scripts/` ignoriert)

### Erweiterung Quordle (2026-06-12)

- `lib/gameState.ts` mit `calculateGameState` erstellt, damit mehrere Boards ohne Hook-Regel-Verletzung berechnet werden können.
- `hooks/useQuordle.ts` verwaltet 4 Board-Histories mit gemeinsamer Eingabezeile.
- `app/quordle/page.tsx` mit 2×2 Board-Grid und kombiniertem Vorschlag.
- Navigation zwischen Wordle und Quordle in `app/page.tsx`.

### Erweiterung Sudoku (2026-06-12)

- `lib/sudoku.ts` mit Backtracking + Constraint Propagation (Single-Candidate) + MRV-Heuristik.
- `components/sudoku/SudokuBoard.tsx` mit interaktivem 9×9-Grid.
- `app/sudoku/page.tsx` + Navigation in `app/page.tsx` und `app/quordle/page.tsx`.
- 5 Unit-Tests für Sudoku.

### Erweiterung Nonogram (2026-06-13)

- `lib/nonogram.ts` mit Zeilenmuster-Generator, Constraint Propagation und Backtracking implementiert.
- `components/nonogram/NonogramBoard.tsx` + `app/nonogram/page.tsx` für interaktive Eingabe der Zeilen-/Spaltenhinweise.
- 6 Unit-Tests für Nonogram; Beispiel-Rätsel validiert.

### Erweiterung Mastermind (2026-06-13)

- `lib/mastermind.ts` mit Code-Generator, Feedback-Berechnung, Filterung und Minimax-Vorschlag.
- `components/mastermind/MastermindBoard.tsx` + `app/mastermind/page.tsx` für interaktives Code-Knacken.
- Zentrale `components/Navigation.tsx` für alle Solver-Routen.
- 7 Unit-Tests für Mastermind.

### Erweiterung Kakuro (2026-06-13)

- `lib/kakuro.ts` mit Summen-Kombinationsgenerator, Run-Erkennung, Constraint Propagation und Backtracking.
- `components/kakuro/KakuroBoard.tsx` + `app/kakuro/page.tsx` mit 5×5-Beispiel.
- Navigation um Kakuro erweitert.
- 6 Unit-Tests für Kakuro.

### Erweiterung Connections (2026-06-13)

- `/api/gemini/analyze-connections` Route mit Gemini-Gruppierung.
- `lib/connections.ts` + `components/connections/ConnectionsBoard.tsx` + `app/connections/page.tsx`.
- Navigation um Connections erweitert.
- 6 Unit-Tests für Parser und Validierung.

### Erweiterung Math Trivia Quiz (2026-06-13)

- `lib/mathQuiz.ts` mit Aufgaben-Generator für +, −, ×, ÷ und Punkte-/Streak-Logik.
- `components/math-quiz/MathQuizBoard.tsx` + `app/math-quiz/page.tsx`.
- Navigation um Math Quiz erweitert.
- 7 Unit-Tests für Generator und Punkteberechnung.

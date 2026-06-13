# BUXE_OS v24.X -- QUORDLE SOLVER Plan

**Ziel:** Den bestehenden Wordle Solver PRO um einen Quordle-Modus erweitern — vier Wordle-Boards parallel mit gemeinsamer Eingabe, pro-Board-Filterung und einem kombinierten Vorschlag.

**Motivation:** Quordle ist "more like wordle" und kann die komplette bestehende Solver-Engine wiederverwenden. Statt vier separate Solver-Seiten zu bauen, nutzen wir die Engine für vier Instanzen.

**Architektur:**
- `useWordleGame(solutionIndex?)` — isolierter Hook für ein einzelnes Board (refactored aus `useWordle`).
- `useQuordle()` — verwaltet vier `useWordleGame`-Instanzen, synchronisiert die Eingabe und berechnet kombinierte Vorschläge.
- Neue Route `app/quordle/page.tsx` mit 4 Boards im 2×2-Grid.
- Gemeinsame Eingabezeile unten; jeder Buchstabentipp wird an alle vier Boards übermittelt.
- Kombinierter Vorschlag maximiert die durchschnittliche Kandidaten-Reduktion über alle vier Pools.

**Dateien:**
- Refactor: `hooks/useWordle.ts` -> `hooks/useWordleGame.ts` + `hooks/useWordle.ts` (re-export für /).
- Create: `hooks/useQuordle.ts`
- Create: `app/quordle/page.tsx`
- Modify: `components/wordle/Board.tsx` — optionale `compact`-Variante für kleinere Kacheln.
- Modify: `app/page.tsx` — Navigation zu /quordle.
- Tests: `tests/quordle.test.ts`

**Akzeptanzkriterien:**
- `/quordle` lädt ohne Fehler.
- Eingabe eines Wortes aktualisiert alle vier Board-Pools.
- Kombinierter Vorschlag wird angezeigt.
- `pnpm build`, `pnpm test`, `pnpm lint` bleiben grün.

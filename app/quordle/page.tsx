// # BUXE_OS v24.X -- QUORDLE PAGE

"use client";

import { useQuordle } from "@/hooks/useQuordle";
import { Board } from "@/components/wordle/Board";
import { Suggestions } from "@/components/wordle/Suggestions";
import { Scorecard } from "@/components/wordle/Scorecard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tile } from "@/components/wordle/Tile";
import { Navigation } from "@/components/Navigation";

const FEEDBACK_CYCLE: ("" | "green" | "yellow" | "gray")[] = [
  "",
  "gray",
  "yellow",
  "green",
];

export default function QuordlePage() {
  const {
    boards,
    combinedSuggestions,
    currentWord,
    setCurrentWord,
    currentFeedback,
    setCurrentFeedback,
    submitGuess,
    reset,
  } = useQuordle();

  function updateFeedback(index: number) {
    const next = [...currentFeedback];
    const current = next[index];
    const currentIndex = FEEDBACK_CYCLE.indexOf(current);
    next[index] = FEEDBACK_CYCLE[(currentIndex + 1) % FEEDBACK_CYCLE.length];
    setCurrentFeedback(next);
  }

  const canSubmit =
    currentWord.length === 5 && currentFeedback.every((f) => f !== "");

  // Board #1 und #2 oben, #3 und #4 unten
  const solvedCount = boards.filter(
    (b) => b.history.length > 0 && b.history[b.history.length - 1].feedback.every((f) => f === "green")
  ).length;

  return (
    <main className="mx-auto max-w-6xl p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quordle Solver PRO</h1>
        <Navigation current="/quordle" />
      </header>

      {/* Gemeinsame Eingabezeile */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
        <h2 className="text-lg font-semibold">Gemeinsame Eingabe</h2>
        <Input
          value={currentWord}
          onChange={(e) =>
            setCurrentWord(e.target.value.toLowerCase().replace(/[^a-z]/g, "").slice(0, 5))
          }
          placeholder="Ratewort für alle vier Boards"
          maxLength={5}
          className="text-center uppercase"
        />
        <div className="flex gap-2 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => updateFeedback(i)}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              aria-label={`Feedback für Position ${i + 1} setzen`}
            >
              <Tile letter={currentWord[i] || ""} state={currentFeedback[i]} />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={submitGuess} disabled={!canSubmit} className="flex-1">
            Für alle Boards übernehmen
          </Button>
          <Button onClick={reset} variant="outline">
            Zurücksetzen
          </Button>
        </div>
      </section>

      {/* Vier Boards */}
      <div className="grid gap-4 md:grid-cols-2">
        {boards.map((board) => (
          <Board
            key={board.id}
            history={board.history}
            compact
            showInput={false}
          />
        ))}
      </div>

      {/* Kombinierte Strategie */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Suggestions
          suggestions={combinedSuggestions}
          eliminators={[]}
          trap={null}
        />
        <Scorecard
          remaining={boards.reduce(
            (sum, b) => sum + b.remainingCandidates.length,
            0
          )}
          trap={null}
        />
      </div>

      <p className="text-center text-sm text-zinc-400">
        Gelöste Boards: {solvedCount} / 4
      </p>
    </main>
  );
}

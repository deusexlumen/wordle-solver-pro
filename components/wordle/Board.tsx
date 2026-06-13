// # BUXE_OS v24.X -- BOARD

"use client";

import { Tile } from "./Tile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GuessRow } from "@/lib/solver";

interface BoardProps {
  history: GuessRow[];
  currentWord?: string;
  setCurrentWord?: (s: string) => void;
  currentFeedback?: ("" | "green" | "yellow" | "gray")[];
  setCurrentFeedback?: (f: ("" | "green" | "yellow" | "gray")[]) => void;
  submitGuess?: () => void;
  reset?: () => void;
  compact?: boolean;
  showInput?: boolean;
  // Erlaubt das Spreaden des gesamten useWordle-Game-Objekts in page.tsx
  [key: string]: unknown;
}

const FEEDBACK_CYCLE: ("" | "green" | "yellow" | "gray")[] = ["", "gray", "yellow", "green"];

export function Board({
  history,
  currentWord = "",
  setCurrentWord,
  currentFeedback = ["", "", "", "", ""],
  setCurrentFeedback,
  submitGuess,
  reset,
  compact = false,
  showInput = true,
}: BoardProps) {
  const tileSize = compact ? "sm" : "md";
  const gapClass = compact ? "gap-1" : "gap-2";
  const paddingClass = compact ? "p-2" : "p-4";

  // Zyklisch durch leer -> grau -> gelb -> grün wechseln
  function updateFeedback(index: number) {
    if (!setCurrentFeedback) return;
    const next = [...currentFeedback];
    const current = next[index];
    const currentIndex = FEEDBACK_CYCLE.indexOf(current);
    next[index] = FEEDBACK_CYCLE[(currentIndex + 1) % FEEDBACK_CYCLE.length];
    setCurrentFeedback(next);
  }

  const canSubmit =
    currentWord.length === 5 && currentFeedback.every((f) => f !== "");

  return (
    <section
      className={`space-y-${compact ? "2" : "4"} rounded-xl border border-zinc-800 bg-zinc-900/50 ${paddingClass}`}
    >
      <h2 className={`font-semibold ${compact ? "text-sm" : "text-lg"}`}>
        Rätsel-Board
      </h2>

      {/* Bereits eingegebene Versuche */}
      <div className={`space-y-${compact ? "1" : "2"}`}>
        {history.map((row, rowIdx) => (
          <div key={`${row.word}-${rowIdx}`} className={`flex ${gapClass} justify-center`}>
            {row.word.split("").map((letter, i) => (
              <Tile key={i} letter={letter} state={row.feedback[i]} size={tileSize} />
            ))}
          </div>
        ))}
      </div>

      {/* Aktive Eingabezeile */}
      {showInput && (
        <div className={`space-y-${compact ? "2" : "3"}`}>
          <Input
            value={currentWord}
            onChange={(e) =>
              setCurrentWord?.(
                e.target.value.toLowerCase().replace(/[^a-z]/g, "").slice(0, 5)
              )
            }
            placeholder="Ratewort eingeben"
            maxLength={5}
            className="text-center uppercase"
          />
          <div className={`flex ${gapClass} justify-center`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => updateFeedback(i)}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                aria-label={`Feedback für Position ${i + 1} setzen`}
              >
                <Tile
                  letter={currentWord[i] || ""}
                  state={currentFeedback[i]}
                  size={tileSize}
                />
              </button>
            ))}
          </div>
          <div className={`flex ${gapClass}`}>
            <Button onClick={submitGuess} disabled={!canSubmit} className="flex-1">
              Hinweis übernehmen
            </Button>
            <Button onClick={reset} variant="outline">
              Zurücksetzen
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

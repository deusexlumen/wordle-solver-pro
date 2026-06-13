// # BUXE_OS v24.X -- MASTERMINDBOARD

"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  generateAllCodes,
  suggestGuess,
  filterPossibilities,
  feedbackToString,
  DEFAULT_COLORS,
  DEFAULT_POSITIONS,
  type Code,
  type Feedback,
  type GuessEntry,
} from "@/lib/mastermind";

const COLOR_STYLES = [
  { bg: "#ef4444", label: "Rot" },
  { bg: "#22c55e", label: "Grün" },
  { bg: "#3b82f6", label: "Blau" },
  { bg: "#facc15", label: "Gelb" },
  { bg: "#a855f7", label: "Lila" },
  { bg: "#f97316", label: "Orange" },
];

function PegView({ color, small = false }: { color: number; small?: boolean }) {
  const style = COLOR_STYLES[color] ?? COLOR_STYLES[0];
  return (
    <div
      title={style.label}
      className={cn(
        "rounded-full border border-zinc-600 shadow-sm",
        small ? "h-6 w-6" : "h-10 w-10"
      )}
      style={{ backgroundColor: style.bg }}
    />
  );
}

function CodeView({ code, small = false }: { code: Code; small?: boolean }) {
  return (
    <div className="flex gap-1">
      {code.map((color, idx) => (
        <PegView key={idx} color={color} small={small} />
      ))}
    </div>
  );
}

export function MastermindBoard() {
  const [history, setHistory] = useState<GuessEntry[]>([]);
  const [blackInput, setBlackInput] = useState(0);
  const [whiteInput, setWhiteInput] = useState(0);
  const [status, setStatus] = useState<string>("");

  const allCodes = useMemo(
    () => generateAllCodes(DEFAULT_COLORS, DEFAULT_POSITIONS),
    []
  );

  const possibilities = useMemo(() => {
    let remaining = [...allCodes];
    for (const entry of history) {
      remaining = filterPossibilities(remaining, entry.guess, entry.feedback);
    }
    return remaining;
  }, [history, allCodes]);

  const suggestion = useMemo(() => {
    try {
      return suggestGuess(possibilities, allCodes);
    } catch {
      return null;
    }
  }, [possibilities, allCodes]);

  function handleSubmitFeedback() {
    if (!suggestion) return;
    const feedback: Feedback = { black: blackInput, white: whiteInput };

    if (blackInput + whiteInput > DEFAULT_POSITIONS) {
      setStatus("❌ Schwarz + Weiß dürfen nicht mehr als 4 ergeben.");
      return;
    }

    const nextRemaining = filterPossibilities(possibilities, suggestion, feedback);
    if (nextRemaining.length === 0) {
      setStatus("❌ Keine Codes mehr übrig — Feedback widersprüchlich?");
      return;
    }

    setHistory((prev) => [...prev, { guess: suggestion, feedback }]);
    setBlackInput(0);
    setWhiteInput(0);
    setStatus("");
  }

  function handleNewGame() {
    setHistory([]);
    setBlackInput(0);
    setWhiteInput(0);
    setStatus("");
  }

  const isSolved = history.some((entry) => entry.feedback.black === DEFAULT_POSITIONS);

  return (
    <section className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <h2 className="text-lg font-semibold">Mastermind Solver</h2>

      <p className="text-sm text-zinc-400">
        Denk dir einen 4-stelligen Code aus 6 Farben aus. Der Solver schlägt dir einen Guess
        vor — gib das Feedback ein, und er berechnet den nächsten Schritt.
      </p>

      {isSolved ? (
        <div className="rounded-lg bg-green-900/30 p-4 text-green-300">
          🎉 Code in {history.length} Zügen gelöst!
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">Vorschlag:</span>
            {suggestion ? <CodeView code={suggestion} /> : <span>–</span>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-zinc-400">Schwarz:</label>
            <input
              type="number"
              min={0}
              max={DEFAULT_POSITIONS}
              value={blackInput}
              onChange={(e) => setBlackInput(parseInt(e.target.value, 10) || 0)}
              className="w-16 rounded-md border border-zinc-700 bg-zinc-950 p-1 text-center text-zinc-100"
            />
            <label className="text-sm text-zinc-400">Weiß:</label>
            <input
              type="number"
              min={0}
              max={DEFAULT_POSITIONS}
              value={whiteInput}
              onChange={(e) => setWhiteInput(parseInt(e.target.value, 10) || 0)}
              className="w-16 rounded-md border border-zinc-700 bg-zinc-950 p-1 text-center text-zinc-100"
            />
            <Button onClick={handleSubmitFeedback} disabled={!suggestion}>
              Feedback bestätigen
            </Button>
          </div>

          {possibilities.length > 0 && (
            <p className="text-xs text-zinc-500">
              Noch {possibilities.length.toLocaleString("en-US")} mögliche Codes.
            </p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-300">Verlauf</h3>
          <ul className="space-y-2">
            {history.map((entry, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm">
                <span className="w-6 text-zinc-500">{idx + 1}.</span>
                <CodeView code={entry.guess} small />
                <span className="text-zinc-300" aria-label="Feedback">
                  {feedbackToString(entry.feedback)}
                </span>
                <span className="text-xs text-zinc-500">
                  ({entry.feedback.black} schwarz, {entry.feedback.white} weiß)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleNewGame} variant="outline">
          Neues Spiel
        </Button>
      </div>

      {status && <p className="text-sm text-red-400">{status}</p>}
    </section>
  );
}

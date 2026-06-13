// # BUXE_OS v24.X -- KAKUROBOARD

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  cloneKakuroBoard,
  solveKakuro,
  isKakuroSolved,
  EXAMPLE_KAKURO,
  type KakuroBoard as BoardType,
} from "@/lib/kakuro";

function formatClue(rowSum?: number, colSum?: number): string {
  if (rowSum !== undefined && colSum !== undefined) return `${colSum}\${rowSum}`;
  if (rowSum !== undefined) return `${rowSum}`;
  if (colSum !== undefined) return `${colSum}`;
  return "";
}

export function KakuroBoard() {
  const [board, setBoard] = useState<BoardType>(cloneKakuroBoard(EXAMPLE_KAKURO));
  const [status, setStatus] = useState<string>("");

  function handleSolve() {
    const working = cloneKakuroBoard(EXAMPLE_KAKURO);
    if (solveKakuro(working)) {
      setBoard(working);
      setStatus("✅ Gelöst!");
    } else {
      setStatus("❌ Keine Lösung möglich.");
    }
  }

  function handleReset() {
    setBoard(cloneKakuroBoard(EXAMPLE_KAKURO));
    setStatus("");
  }

  return (
    <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <h2 className="text-lg font-semibold">Kakuro Solver</h2>

      <p className="text-sm text-zinc-400">
        Fülle die weißen Zellen mit Ziffern 1–9 so, dass jede Summe aus unterschiedlichen
        Ziffern besteht.
      </p>

      <div className="inline-block border-2 border-zinc-700">
        {board.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              if (cell.type === "blank") {
                return (
                  <div
                    key={`${r}-${c}`}
                    className="h-12 w-12 bg-zinc-950"
                  />
                );
              }
              if (cell.type === "clue") {
                return (
                  <div
                    key={`${r}-${c}`}
                    className="flex h-12 w-12 items-center justify-center bg-zinc-800 text-xs font-semibold text-zinc-300"
                  >
                    {formatClue(cell.rowSum, cell.colSum)}
                  </div>
                );
              }
              return (
                <div
                  key={`${r}-${c}`}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center border border-zinc-600 bg-zinc-100 text-lg font-semibold text-zinc-900",
                    cell.value === null && "bg-zinc-50"
                  )}
                >
                  {cell.value ?? ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSolve}>Lösen</Button>
        <Button onClick={handleReset} variant="outline">
          Zurücksetzen
        </Button>
      </div>

      {status && <p className="text-sm">{status}</p>}

      {isKakuroSolved(board) && (
        <p className="text-xs text-zinc-500">
          Hinweis: Dies ist ein 5×5-Beispiel. In der aktuellen Version kannst du das Rätsel noch
          nicht selbst eingeben.
        </p>
      )}
    </section>
  );
}

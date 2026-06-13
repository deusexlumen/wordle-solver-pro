// # BUXE_OS v24.X -- SUDOKUBOARD

"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  createEmptyBoard,
  solveSudoku,
  cloneBoard,
  isBoardValid,
  EXAMPLE_EASY,
  type SudokuBoard,
} from "@/lib/sudoku";

export function SudokuBoard() {
  const [board, setBoard] = useState<SudokuBoard>(createEmptyBoard());
  const [status, setStatus] = useState<string>("");

  const updateCell = useCallback(
    (row: number, col: number, raw: string) => {
      const value = raw === "" ? null : parseInt(raw, 10);
      if (value !== null && (Number.isNaN(value) || value < 1 || value > 9)) return;

      setBoard((prev) => {
        const next = cloneBoard(prev);
        next[row][col] = value;
        return next;
      });
      setStatus("");
    },
    []
  );

  function handleSolve() {
    const working = cloneBoard(board);
    if (!isBoardValid(working)) {
      setStatus("❌ Das Board enthält Konflikte.");
      return;
    }
    if (solveSudoku(working)) {
      setBoard(working);
      setStatus("✅ Gelöst!");
    } else {
      setStatus("❌ Keine Lösung möglich.");
    }
  }

  function handleClear() {
    setBoard(createEmptyBoard());
    setStatus("");
  }

  function handleExample() {
    setBoard(cloneBoard(EXAMPLE_EASY));
    setStatus("Beispiel geladen.");
  }

  return (
    <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <h2 className="text-lg font-semibold">Sudoku Solver</h2>

      <div className="inline-block border-2 border-zinc-700">
        {board.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              const isRightBorder = (c + 1) % 3 === 0 && c !== 8;
              const isBottomBorder = (r + 1) % 3 === 0 && r !== 8;
              return (
                <input
                  key={`${r}-${c}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={cell ?? ""}
                  onChange={(e) => updateCell(r, c, e.target.value)}
                  className={cn(
                    "h-10 w-10 border border-zinc-600 bg-zinc-950 text-center text-lg font-semibold text-zinc-100 outline-none focus:bg-zinc-800",
                    isRightBorder && "border-r-2 border-r-zinc-500",
                    isBottomBorder && "border-b-2 border-b-zinc-500"
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSolve}>Lösen</Button>
        <Button onClick={handleClear} variant="outline">
          Löschen
        </Button>
        <Button onClick={handleExample} variant="secondary">
          Beispiel laden
        </Button>
      </div>

      {status && <p className="text-sm">{status}</p>}
    </section>
  );
}

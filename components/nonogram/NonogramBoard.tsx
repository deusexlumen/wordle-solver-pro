// # BUXE_OS v24.X -- NONOGRAMBOARD

"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  createEmptyNonogram,
  solveNonogram,
  EXAMPLE_HEART,
  type NonogramBoard as BoardType,
} from "@/lib/nonogram";

function parseClues(raw: string): number[] {
  return raw
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => parseInt(s, 10))
    .filter((n) => !Number.isNaN(n) && n > 0);
}

function formatClues(clues: number[][]): string {
  return clues.map((line) => line.join(",")).join("\n");
}

export function NonogramBoard() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [rowCluesRaw, setRowCluesRaw] = useState(formatClues(EXAMPLE_HEART.rowClues));
  const [colCluesRaw, setColCluesRaw] = useState(formatClues(EXAMPLE_HEART.colClues));
  const [board, setBoard] = useState<BoardType>(
    createEmptyNonogram(EXAMPLE_HEART.rows, EXAMPLE_HEART.cols)
  );
  const [status, setStatus] = useState<string>("");

  const getClues = useCallback(() => {
    const rowClues = rowCluesRaw.split("\n").map(parseClues);
    const colClues = colCluesRaw.split("\n").map(parseClues);
    return { rowClues, colClues };
  }, [rowCluesRaw, colCluesRaw]);

  function handleResize() {
    setBoard(createEmptyNonogram(rows, cols));
    setStatus("");
  }

  function handleSolve() {
    const { rowClues, colClues } = getClues();
    if (rowClues.length !== rows || colClues.length !== cols) {
      setStatus(`❌ Es müssen genau ${rows} Zeilen- und ${cols} Spaltenhinweise geben.`);
      return;
    }
    const working = createEmptyNonogram(rows, cols);
    if (solveNonogram(working, rowClues, colClues)) {
      setBoard(working);
      setStatus("✅ Gelöst!");
    } else {
      setStatus("❌ Keine Lösung möglich.");
    }
  }

  function handleClear() {
    setBoard(createEmptyNonogram(rows, cols));
    setStatus("");
  }

  function handleExample() {
    setRows(EXAMPLE_HEART.rows);
    setCols(EXAMPLE_HEART.cols);
    setRowCluesRaw(formatClues(EXAMPLE_HEART.rowClues));
    setColCluesRaw(formatClues(EXAMPLE_HEART.colClues));
    setBoard(createEmptyNonogram(EXAMPLE_HEART.rows, EXAMPLE_HEART.cols));
    setStatus("Beispiel geladen.");
  }

  return (
    <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <h2 className="text-lg font-semibold">Nonogram Solver</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Zeilenhinweise (eine Zeile pro Reihe)</label>
          <textarea
            value={rowCluesRaw}
            onChange={(e) => setRowCluesRaw(e.target.value)}
            rows={rows}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2 font-mono text-sm text-zinc-100"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Spaltenhinweise (eine Zeile pro Spalte)</label>
          <textarea
            value={colCluesRaw}
            onChange={(e) => setColCluesRaw(e.target.value)}
            rows={cols}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2 font-mono text-sm text-zinc-100"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm text-zinc-400">Größe:</label>
        <input
          type="number"
          min={2}
          max={20}
          value={rows}
          onChange={(e) => setRows(parseInt(e.target.value, 10) || 5)}
          className="w-16 rounded-md border border-zinc-700 bg-zinc-950 p-1 text-center text-zinc-100"
        />
        <span className="text-zinc-500">×</span>
        <input
          type="number"
          min={2}
          max={20}
          value={cols}
          onChange={(e) => setCols(parseInt(e.target.value, 10) || 5)}
          className="w-16 rounded-md border border-zinc-700 bg-zinc-950 p-1 text-center text-zinc-100"
        />
        <Button onClick={handleResize} variant="secondary" size="sm">
          Anwenden
        </Button>
      </div>

      <div className="inline-block border-2 border-zinc-700">
        {board.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={cn(
                  "h-8 w-8 border border-zinc-600",
                  cell === 1 && "bg-indigo-500",
                  cell === 0 && "bg-zinc-950"
                )}
              />
            ))}
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

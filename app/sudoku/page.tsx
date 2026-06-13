// # BUXE_OS v24.X -- SUDOKU PAGE

import { SudokuBoard } from "@/components/sudoku/SudokuBoard";
import Link from "next/link";

export default function SudokuPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sudoku Solver</h1>
        <nav className="flex gap-4">
          <Link
            href="/"
            className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800"
          >
            Wordle
          </Link>
          <Link
            href="/quordle"
            className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800"
          >
            Quordle
          </Link>
          <Link
            href="/nonogram"
            className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800"
          >
            Nonogram
          </Link>
        </nav>
      </header>

      <p className="text-zinc-400">
        Tippe die vorgegebenen Zahlen ein und klicke auf <strong>Lösen</strong>.
        Der Solver nutzt Backtracking mit Constraint Propagation.
      </p>

      <SudokuBoard />
    </main>
  );
}

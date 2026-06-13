// # BUXE_OS v24.X -- SUDOKU PAGE

import { SudokuBoard } from "@/components/sudoku/SudokuBoard";
import { Navigation } from "@/components/Navigation";

export default function SudokuPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sudoku Solver</h1>
        <Navigation current="/sudoku" />
      </header>

      <p className="text-zinc-400">
        Tippe die vorgegebenen Zahlen ein und klicke auf <strong>Lösen</strong>.
        Der Solver nutzt Backtracking mit Constraint Propagation.
      </p>

      <SudokuBoard />
    </main>
  );
}

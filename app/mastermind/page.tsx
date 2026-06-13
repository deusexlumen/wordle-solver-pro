// # BUXE_OS v24.X -- MASTERMIND PAGE

import { MastermindBoard } from "@/components/mastermind/MastermindBoard";
import Link from "next/link";

export default function MastermindPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mastermind Solver</h1>
        <nav className="flex flex-wrap gap-2">
          {[
            { href: "/", label: "Wordle" },
            { href: "/quordle", label: "Quordle" },
            { href: "/sudoku", label: "Sudoku" },
            { href: "/nonogram", label: "Nonogram" },
            { href: "/mastermind", label: "Mastermind", active: true },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800 ${
                item.active ? "bg-zinc-800" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <MastermindBoard />
    </main>
  );
}

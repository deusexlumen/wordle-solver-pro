// # BUXE_OS v24.X -- PAGE

"use client";

import Link from "next/link";
import { useWordle } from "@/hooks/useWordle";
import { Board } from "@/components/wordle/Board";
import { Suggestions } from "@/components/wordle/Suggestions";
import { Scorecard } from "@/components/wordle/Scorecard";
import { DemoLoader } from "@/components/wordle/DemoLoader";
import { ImageDropzone } from "@/components/wordle/ImageDropzone";

export default function HomePage() {
  const game = useWordle();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Wordle Solver PRO</h1>
        <nav className="flex gap-4">
          <Link
            href="/"
            className="rounded-lg bg-zinc-800 px-3 py-1 text-sm"
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
            href="/sudoku"
            className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800"
          >
            Sudoku
          </Link>
          <Link
            href="/nonogram"
            className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800"
          >
            Nonogram
          </Link>
        </nav>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Board {...game} />
          <Suggestions
            suggestions={game.suggestions}
            eliminators={game.eliminators}
            trap={game.trap}
          />
        </div>
        <aside className="space-y-6">
          <Scorecard remaining={game.remainingCandidates.length} trap={game.trap} />
          <DemoLoader onLoad={game.loadDemo} />
          <ImageDropzone onAnalyzed={game.loadDemo} />
        </aside>
      </div>
    </main>
  );
}

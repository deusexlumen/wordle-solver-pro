// # BUXE_OS v24.X -- NONOGRAM PAGE

import { NonogramBoard } from "@/components/nonogram/NonogramBoard";
import Link from "next/link";

export default function NonogramPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nonogram Solver</h1>
        <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300">
          ← zurück zur Übersicht
        </Link>
      </header>

      <p className="text-zinc-400">
        Gib die Zeilen- und Spaltenhinweise ein (z. B. <code>2,2</code>) und klicke auf <strong>Lösen</strong>.
        Der Solver findet das versteckte Pixel-Bild.
      </p>

      <NonogramBoard />
    </main>
  );
}

// # BUXE_OS v24.X -- SCORECARD

import { findTrap } from "@/lib/solver";

interface ScorecardProps {
  remaining: number;
  trap: ReturnType<typeof findTrap>;
}

export function Scorecard({ remaining, trap }: ScorecardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
      <h2 className="text-lg font-semibold">Strategie-Kompass</h2>
      <p>
        Verbleibende Kandidaten: <strong>{remaining.toLocaleString("en-US")}</strong>
      </p>
      {trap ? (
        <p className="text-yellow-400">Falle aktiv — Eliminator vorschlagen.</p>
      ) : (
        <p className="text-green-400">Keine Falle erkannt.</p>
      )}
    </div>
  );
}

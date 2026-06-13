// # BUXE_OS v24.X -- SUGGESTIONS

import { Badge } from "@/components/ui/badge";
import { findTrap } from "@/lib/solver";

interface SuggestionsProps {
  suggestions: string[];
  eliminators: string[];
  trap: ReturnType<typeof findTrap>;
}

export function Suggestions({ suggestions, eliminators, trap }: SuggestionsProps) {
  return (
    <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <h2 className="text-lg font-semibold">Vorschläge</h2>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((w) => (
          <Badge key={w} variant="secondary" className="text-base px-3 py-1">
            {w}
          </Badge>
        ))}
      </div>
      {trap && (
        <div className="space-y-2">
          <p className="text-sm text-yellow-400">
            ⚠️ Wordle-Falle erkannt: {trap.pattern} ({trap.examples.join(", ")})
          </p>
          <div className="flex flex-wrap gap-2">
            {eliminators.map((w) => (
              <Badge key={w} className="bg-red-600 text-white">
                {w}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

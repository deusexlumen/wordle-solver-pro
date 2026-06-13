// # BUXE_OS v24.X -- DEMOLOADER

import { GuessRow } from "@/lib/solver";

// Vorgefertigtes Beispiel-Szenario für die interaktive Demo
export const DEMO_SCENARIO: GuessRow[] = [
  { word: "drive", feedback: ["gray", "gray", "gray", "gray", "gray"] },
  { word: "stare", feedback: ["gray", "gray", "green", "gray", "gray"] },
];

interface DemoLoaderProps {
  onLoad: (rows: GuessRow[]) => void;
}

export function DemoLoader({ onLoad }: DemoLoaderProps) {
  return (
    <button
      type="button"
      onClick={() => onLoad(DEMO_SCENARIO)}
      className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
    >
      Szenario-Demo interaktiv laden
    </button>
  );
}

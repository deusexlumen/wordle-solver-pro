// # BUXE_OS v24.X -- CONNECTIONS

export interface ConnectionsGroup {
  title: string;
  words: string[];
}

export interface ConnectionsAnalysis {
  groups: ConnectionsGroup[];
}

// Parst einen Rohtext in maximal 16 Wörter.
export function parseWords(raw: string): string[] {
  return raw
    .split(/[\s,\n]+/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 16);
}

// Ruft die Gemini-API auf, um 16 Wörter in 4 Gruppen einzuteilen.
export async function analyzeConnections(words: string[]): Promise<ConnectionsAnalysis> {
  const res = await fetch("/api/gemini/analyze-connections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ words }),
  });

  if (!res.ok) {
    const data = (await res.json()) as { error?: string; detail?: string };
    throw new Error(data.error || data.detail || "Analysis failed");
  }

  return (await res.json()) as ConnectionsAnalysis;
}

// Prüft, ob alle 16 Wörter genau einmal in den Gruppen vorkommen.
export function isValidAnalysis(words: string[], analysis: ConnectionsAnalysis): boolean {
  const allGroupWords = analysis.groups.flatMap((g) => g.words);
  if (allGroupWords.length !== 16) return false;
  const sortedInput = [...words].sort();
  const sortedGroup = [...allGroupWords].sort();
  return sortedInput.every((w, i) => w === sortedGroup[i]);
}

// # BUXE_OS v24.X -- CONNECTIONSBOARD

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { analyzeConnections, parseWords, type ConnectionsGroup } from "@/lib/connections";

const EXAMPLE_WORDS = [
  "apple",
  "banana",
  "cherry",
  "date",
  "red",
  "blue",
  "green",
  "yellow",
  "king",
  "queen",
  "rook",
  "bishop",
  "mercury",
  "venus",
  "earth",
  "mars",
];

function GroupCard({ group, color }: { group: ConnectionsGroup; color: string }) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <h3 className="mb-2 font-semibold">{group.title}</h3>
      <div className="flex flex-wrap gap-2">
        {group.words.map((word) => (
          <span
            key={word}
            className="rounded-full bg-zinc-950 px-3 py-1 text-sm text-zinc-100"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ConnectionsBoard() {
  const [raw, setRaw] = useState(EXAMPLE_WORDS.join("\n"));
  const [groups, setGroups] = useState<ConnectionsGroup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const words = parseWords(raw);
  const isComplete = words.length === 16;

  async function handleAnalyze() {
    if (!isComplete) {
      setStatus("❌ Bitte gib genau 16 Wörter ein.");
      return;
    }
    setLoading(true);
    setStatus("");
    setGroups(null);
    try {
      const result = await analyzeConnections(words);
      setGroups(result.groups);
      setStatus("✅ Gruppen analysiert.");
    } catch (err) {
      setStatus(`❌ ${err instanceof Error ? err.message : "Fehler bei der Analyse."}`);
    } finally {
      setLoading(false);
    }
  }

  function handleExample() {
    setRaw(EXAMPLE_WORDS.join("\n"));
    setGroups(null);
    setStatus("");
  }

  const colors = [
    "border-yellow-500/50 bg-yellow-500/10",
    "border-green-500/50 bg-green-500/10",
    "border-blue-500/50 bg-blue-500/10",
    "border-purple-500/50 bg-purple-500/10",
  ];

  return (
    <section className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <h2 className="text-lg font-semibold">Connections Assistant</h2>

      <p className="text-sm text-zinc-400">
        Gib 16 Wörter ein (eins pro Zeile oder kommagetrennt). Gemini teilt sie in 4 thematische
        Gruppen ein.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">
            Wörter ({words.length}/16)
          </label>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={10}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2 font-mono text-sm text-zinc-100"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAnalyze} disabled={loading || !isComplete}>
              {loading ? "Analysiere…" : "Gruppen finden"}
            </Button>
            <Button onClick={handleExample} variant="secondary" size="sm">
              Beispiel laden
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Vorschau</label>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <Input
                key={i}
                value={words[i] ?? ""}
                readOnly
                className="text-center text-sm"
              />
            ))}
          </div>
        </div>
      </div>

      {groups && (
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map((group, idx) => (
            <GroupCard key={idx} group={group} color={colors[idx % colors.length]} />
          ))}
        </div>
      )}

      {status && <p className="text-sm">{status}</p>}
    </section>
  );
}

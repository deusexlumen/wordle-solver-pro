// BUXE_OS v24.X -- SOLVER

// Typen für die Wordle-Farbzustände
export type TileState = "green" | "yellow" | "gray";

// Eine bereits eingegebene Zeile mit Wort und Feedback
export interface GuessRow {
  word: string;
  feedback: TileState[];
}

// Statistiken über die verbleibenden Kandidaten
export interface CandidateStats {
  total: number;
  guessesDistribution: Record<1 | 2 | 3 | 4 | 5 | 6, number>;
}

/**
 * Filtert eine Wortliste anhand des bisherigen Spielverlaufs.
 * Berücksichtigt grüne, gelbe und graue Felder inklusive Mehrfachbuchstaben.
 */
export function filterCandidates(words: string[], history: GuessRow[]): string[] {
  return words.filter((candidate) => {
    for (const { word, feedback } of history) {
      // Buchstabenhäufigkeiten im Kandidaten zählen
      const letterCounts: Record<string, number> = {};
      for (let i = 0; i < 5; i++) {
        const c = candidate[i];
        letterCounts[c] = (letterCounts[c] || 0) + 1;
      }

      // Zuerst alle grünen Positionen prüfen und verbrauchen
      for (let i = 0; i < 5; i++) {
        const guessChar = word[i];
        const state = feedback[i];

        if (state === "green") {
          if (candidate[i] !== guessChar) return false;
          letterCounts[guessChar]--;
        }
      }

      // Danach gelbe und graue Positionen auswerten
      for (let i = 0; i < 5; i++) {
        const guessChar = word[i];
        const state = feedback[i];

        if (state === "yellow") {
          // Gelb darf nicht an derselben Position stehen
          if (candidate[i] === guessChar) return false;
          // Buchstabe muss noch an einer anderen Stelle verfügbar sein
          if (!letterCounts[guessChar] || letterCounts[guessChar] <= 0) return false;
          letterCounts[guessChar]--;
        }

        if (state === "gray") {
          // Grau ist mehrdeutig, wenn der Buchstabe bereits grün/gelb war
          const greenYellowCount = word
            .split("")
            .filter((c, idx) => c === guessChar && feedback[idx] !== "gray").length;

          if (greenYellowCount === 0) {
            // Buchstabe kommt im Kandidaten überhaupt nicht vor
            if (letterCounts[guessChar] > 0) return false;
          } else {
            // Mehr Vorkommen als bereits bekannt sind unzulässig
            if (letterCounts[guessChar] > greenYellowCount) return false;
          }
        }
      }
    }
    return true;
  });
}

/**
 * Berechnet das erwartete Informationsgewinn-Maß (Entropie) eines Rateschusses.
 */
export function scoreGuess(guess: string, candidates: string[]): number {
  const buckets: Record<string, number> = {};
  for (const answer of candidates) {
    const pattern = computePattern(guess, answer);
    buckets[pattern] = (buckets[pattern] || 0) + 1;
  }
  let entropy = 0;
  const total = candidates.length;
  for (const count of Object.values(buckets)) {
    const p = count / total;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

/**
 * Berechnet das Wordle-Farb-Muster zwischen einem Ratewort und einer Antwort.
 */
function computePattern(guess: string, answer: string): string {
  const result: TileState[] = Array(5).fill("gray");
  const answerCounts: Record<string, number> = {};
  for (const c of answer) answerCounts[c] = (answerCounts[c] || 0) + 1;

  // Grüne Treffer zuerst markieren
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i] = "green";
      answerCounts[guess[i]]--;
    }
  }

  // Dann gelbe Buchstaben an anderen Positionen
  for (let i = 0; i < 5; i++) {
    if (result[i] === "green") continue;
    if (answerCounts[guess[i]] > 0) {
      result[i] = "yellow";
      answerCounts[guess[i]]--;
    }
  }

  return result.join("");
}

/**
 * Gibt die besten Ratevorschläge zurück, sortiert nach Entropie.
 */
export function getSuggestions(candidates: string[], allWords: string[], limit = 5): string[] {
  if (candidates.length === 0) return [];
  const pool = candidates.length <= 2 ? candidates : allWords;
  const scored = pool
    .filter((w) => /^[a-z]{5}$/.test(w))
    .map((w) => ({ word: w, score: scoreGuess(w, candidates) }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.word);
}

/**
 * Erkennt Wordle-Fallen: mehrere Kandidaten, die sich nur an wenigen Positionen unterscheiden.
 */
export function findTrap(candidates: string[]): { pattern: string; examples: string[] } | null {
  if (candidates.length < 3 || candidates.length > 12) return null;
  const patterns: Record<string, string[]> = {};
  for (const word of candidates) {
    for (let mask = 1; mask < 32; mask++) {
      let key = "";
      for (let i = 0; i < 5; i++) {
        key += (mask & (1 << i)) ? word[i] : "?";
      }
      patterns[key] = patterns[key] || [];
      patterns[key].push(word);
    }
  }
  const traps = Object.values(patterns).filter((group) => group.length >= 3);
  if (traps.length === 0) return null;
  const worst = traps.sort((a, b) => b.length - a.length)[0];
  const pattern = worst[0]
    .split("")
    .map((c, i) => (worst.every((w) => w[i] === c) ? c : "?"))
    .join("");
  return { pattern, examples: worst.slice(0, 6) };
}

/**
 * Sucht nach Wörtern, die die variierenden Buchstaben einer Falle abdecken.
 */
export function getEliminatorWords(
  trap: { pattern: string; examples: string[] },
  allWords: string[],
  limit = 5
): string[] {
  const varyingIndices = trap.pattern
    .split("")
    .map((c, i) => (c === "?" ? i : -1))
    .filter((i) => i !== -1);
  const neededLetters = new Set<string>();
  for (const ex of trap.examples) {
    for (const idx of varyingIndices) neededLetters.add(ex[idx]);
  }
  return allWords
    .filter((w) => {
      const covered = new Set<string>();
      for (const idx of varyingIndices) covered.add(w[idx]);
      for (const letter of neededLetters) if (covered.has(letter)) return true;
      return false;
    })
    .slice(0, limit);
}

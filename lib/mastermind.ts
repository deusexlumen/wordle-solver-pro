// # BUXE_OS v24.X -- MASTERMIND

export type Peg = number;
export type Code = Peg[];

export interface Feedback {
  black: number; // richtige Farbe an richtiger Position
  white: number; // richtige Farbe an falscher Position
}

export interface GuessEntry {
  guess: Code;
  feedback: Feedback;
}

// Standard-Regel: 6 Farben, 4 Positionen (Farben dürfen wiederholt werden).
export const DEFAULT_COLORS = 6;
export const DEFAULT_POSITIONS = 4;

// Erzeugt alle möglichen Codes für die gegebene Farb- und Positionsanzahl.
export function generateAllCodes(colors: number, positions: number): Code[] {
  const codes: Code[] = [];

  function backtrack(current: Code) {
    if (current.length === positions) {
      codes.push([...current]);
      return;
    }
    for (let color = 0; color < colors; color++) {
      current.push(color);
      backtrack(current);
      current.pop();
    }
  }

  backtrack([]);
  return codes;
}

// Berechnet das Feedback (Schwarz/Weiß) für einen Guess gegen einen Secret-Code.
export function calculateFeedback(guess: Code, secret: Code): Feedback {
  const positions = guess.length;
  let black = 0;
  const guessRemaining: (Peg | null)[] = [];
  const secretRemaining: (Peg | null)[] = [];

  // Erst die schwarzen Treffer entfernen.
  for (let i = 0; i < positions; i++) {
    if (guess[i] === secret[i]) {
      black++;
      guessRemaining.push(null);
      secretRemaining.push(null);
    } else {
      guessRemaining.push(guess[i]);
      secretRemaining.push(secret[i]);
    }
  }

  // Dann die weißen Treffer zählen.
  let white = 0;
  const secretCounts = new Map<Peg, number>();
  for (const peg of secretRemaining) {
    if (peg !== null) {
      secretCounts.set(peg, (secretCounts.get(peg) || 0) + 1);
    }
  }

  for (const peg of guessRemaining) {
    if (peg !== null) {
      const count = secretCounts.get(peg) || 0;
      if (count > 0) {
        white++;
        secretCounts.set(peg, count - 1);
      }
    }
  }

  return { black, white };
}

// Filtert alle Codes, die mit dem gegebenen Guess und Feedback vereinbar sind.
export function filterPossibilities(
  possibilities: Code[],
  guess: Code,
  feedback: Feedback
): Code[] {
  return possibilities.filter((possible) => {
    const fb = calculateFeedback(guess, possible);
    return fb.black === feedback.black && fb.white === feedback.white;
  });
}

// Wählt den nächsten Guess per Minimax-Heuristik (Knuth-Algorithmus, vereinfacht).
// Gibt bei nur noch einem Kandidaten diesen direkt zurück.
export function suggestGuess(possibilities: Code[], allCodes: Code[]): Code {
  if (possibilities.length === 0) {
    throw new Error("Keine möglichen Codes mehr übrig.");
  }
  if (possibilities.length <= 2) {
    return possibilities[0];
  }

  let bestGuess = allCodes[0];
  let bestScore = Infinity;

  for (const guess of allCodes) {
    // Gruppiere verbleibende Kandidaten nach Feedback.
    const counts = new Map<string, number>();
    for (const possible of possibilities) {
      const fb = calculateFeedback(guess, possible);
      const key = `${fb.black},${fb.white}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const worstCase = Math.max(...counts.values());
    // Bevorzuge Kandidaten bei Gleichstand, damit der Guess auch gewinnen kann.
    const isCandidate = possibilities.some((p) => p.every((v, i) => v === guess[i]));
    const score = worstCase - (isCandidate ? 0.5 : 0);

    if (score < bestScore) {
      bestScore = score;
      bestGuess = guess;
    }
  }

  return bestGuess;
}

// Erzeugt einen zufälligen Secret-Code.
export function generateSecretCode(colors: number, positions: number): Code {
  return Array.from({ length: positions }, () => Math.floor(Math.random() * colors));
}

// Gibt ein menschenlesbares Feedback-Symbol zurück.
export function feedbackToString(feedback: Feedback): string {
  return "●".repeat(feedback.black) + "○".repeat(feedback.white);
}

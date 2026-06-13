// # BUXE_OS v24.X -- NONOGRAM

export type NonogramCell = 0 | 1 | null;
export type NonogramBoard = NonogramCell[][];

// Erzeugt ein leeres Board der gegebenen Größe.
export function createEmptyNonogram(rows: number, cols: number): NonogramBoard {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
}

// Generiert alle möglichen Zeilenmuster für eine Linie der Länge `length` und Hinweise `clues`.
// Jeder Block muss mit mindestens einer leeren Zelle vom nächsten getrennt sein.
export function generateLinePatterns(length: number, clues: number[]): number[][] {
  if (clues.length === 0) return [Array(length).fill(0)];

  const totalFilled = clues.reduce((a, b) => a + b, 0);
  const minGaps = clues.length - 1;
  if (totalFilled + minGaps > length) return [];

  const patterns: number[][] = [];

  function backtrack(clueIndex: number, position: number, current: number[]) {
    if (clueIndex === clues.length) {
      patterns.push([...current, ...Array(length - current.length).fill(0)]);
      return;
    }

    const remainingClues = clues.slice(clueIndex);
    const minNeeded = remainingClues.reduce((a, b) => a + b, 0) + remainingClues.length - 1;
    const maxStart = length - minNeeded;

    for (let start = position; start <= maxStart; start++) {
      const next = [...current];
      // Führende Leerstellen
      while (next.length < start) next.push(0);
      // Gefüllter Block
      for (let i = 0; i < clues[clueIndex]; i++) next.push(1);
      // Obligatorische Lücke nach dem Block (außer beim letzten)
      if (clueIndex < clues.length - 1) next.push(0);

      backtrack(clueIndex + 1, start + clues[clueIndex] + 1, next);
    }
  }

  backtrack(0, 0, []);
  return patterns;
}

// Prüft, ob eine vollständig gefüllte Linie exakt zu den Hinweisen passt.
export function lineMatchesClues(line: NonogramCell[], clues: number[]): boolean {
  const groups: number[] = [];
  let current = 0;
  for (const cell of line) {
    if (cell === 1) {
      current++;
    } else {
      if (current > 0) groups.push(current);
      current = 0;
    }
  }
  if (current > 0) groups.push(current);

  return groups.length === clues.length && groups.every((g, i) => g === clues[i]);
}

// Prüft, ob das gesamte Board konsistent mit den Hinweisen ist.
// Erwartet ein vollständig gefülltes Board.
export function isNonogramValid(
  board: NonogramBoard,
  rowClues: number[][],
  colClues: number[][]
): boolean {
  for (let r = 0; r < board.length; r++) {
    if (!lineMatchesClues(board[r], rowClues[r])) return false;
  }
  for (let c = 0; c < board[0].length; c++) {
    const col = board.map((row) => row[c]);
    if (!lineMatchesClues(col, colClues[c])) return false;
  }
  return true;
}

// Filtert alle möglichen Muster einer Linie auf diejenigen, die mit den bereits
// bekannten Zellen übereinstimmen.
function filterPatterns(patterns: number[][], line: NonogramCell[]): number[][] {
  return patterns.filter((pattern) =>
    pattern.every((value, idx) => line[idx] === null || line[idx] === value)
  );
}

// Wendet Constraint Propagation auf Zeilen und Spalten an. Wenn eine Zelle in
// allen noch gültigen Mustern einer Linie denselben Wert hat, wird sie gesetzt.
// Gibt false zurück, wenn ein Widerspruch auftritt.
function propagate(
  board: NonogramBoard,
  rowPatterns: number[][][],
  colPatterns: number[][][]
): boolean {
  const rows = board.length;
  const cols = board[0].length;
  let changed = true;

  while (changed) {
    changed = false;

    // Zeilen
    for (let r = 0; r < rows; r++) {
      const line = board[r];
      const validPatterns = filterPatterns(rowPatterns[r], line);
      if (validPatterns.length === 0) return false;

      for (let c = 0; c < cols; c++) {
        if (line[c] === null) {
          const allOnes = validPatterns.every((p) => p[c] === 1);
          const allZeros = validPatterns.every((p) => p[c] === 0);
          if (allOnes) {
            line[c] = 1;
            changed = true;
          } else if (allZeros) {
            line[c] = 0;
            changed = true;
          }
        }
      }
    }

    // Spalten
    for (let c = 0; c < cols; c++) {
      const line = board.map((row) => row[c]);
      const validPatterns = filterPatterns(colPatterns[c], line);
      if (validPatterns.length === 0) return false;

      for (let r = 0; r < rows; r++) {
        if (board[r][c] === null) {
          const allOnes = validPatterns.every((p) => p[r] === 1);
          const allZeros = validPatterns.every((p) => p[r] === 0);
          if (allOnes) {
            board[r][c] = 1;
            changed = true;
          } else if (allZeros) {
            board[r][c] = 0;
            changed = true;
          }
        }
      }
    }
  }

  return true;
}

// Löst das Nonogram via Constraint Propagation plus Backtracking.
export function solveNonogram(
  board: NonogramBoard,
  rowClues: number[][],
  colClues: number[][]
): boolean {
  const rows = board.length;
  const cols = board[0].length;

  const rowPatterns = rowClues.map((clues) => generateLinePatterns(cols, clues));
  const colPatterns = colClues.map((clues) => generateLinePatterns(rows, clues));

  // Schnell-Check: Widersprüchliche Hinweise?
  if (rowPatterns.some((p) => p.length === 0) || colPatterns.some((p) => p.length === 0)) {
    return false;
  }

  function isSolved(): boolean {
    return board.every((row) => row.every((cell) => cell !== null));
  }

  function backtrack(): boolean {
    if (!propagate(board, rowPatterns, colPatterns)) return false;
    if (isSolved()) return isNonogramValid(board, rowClues, colClues);

    // Erste unbekannte Zelle finden (einfache Heuristik).
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === null) {
          for (const value of [0, 1] as const) {
            const snapshot = board.map((row) => [...row]);
            board[r][c] = value;
            if (backtrack()) return true;
            // Board wiederherstellen
            for (let i = 0; i < rows; i++) {
              board[i] = snapshot[i];
            }
          }
          return false;
        }
      }
    }

    return false;
  }

  return backtrack();
}

// Konvertiert ein gelöstes Board in ein lesbares String-Raster.
export function boardToString(board: NonogramBoard): string {
  return board
    .map((row) => row.map((cell) => (cell === 1 ? "█" : ".")).join(""))
    .join("\n");
}

// Beispiel: 5×5 Rätsel (validiertes, lösbares Bild)
export const EXAMPLE_HEART = {
  rows: 5,
  cols: 5,
  rowClues: [[2], [5], [5], [3], [1]],
  colClues: [[2], [4], [5], [3], [2]],
};

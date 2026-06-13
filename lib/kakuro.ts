// # BUXE_OS v24.X -- KAKURO

export type KakuroCell =
  | { type: "blank" }
  | { type: "clue"; rowSum?: number; colSum?: number }
  | { type: "input"; value: number | null };

export type KakuroBoard = KakuroCell[][];

// Hilfstyp für eine zusammenhängende Folge von Eingabezellen.
export interface Run {
  cells: [number, number][];
  sum: number;
}

// Erzeugt ein leeres Board der gegebenen Größe.
export function createEmptyKakuro(rows: number, cols: number): KakuroBoard {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ type: "blank" }))
  );
}

// Erzeugt eine tiefe Kopie des Boards.
export function cloneKakuroBoard(board: KakuroBoard): KakuroBoard {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.type === "input") return { ...cell };
      return cell;
    })
  );
}

// Generiert alle geordneten Tupel aus `length` unterschiedlichen Ziffern 1–9,
// die zusammen `targetSum` ergeben. (Reihenfolge innerhalb eines Runs ist relevant.)
export function generateSumCombinations(targetSum: number, length: number): number[][] {
  if (length < 1 || length > 9) return [];
  const combinations: number[][] = [];

  function backtrack(start: number, current: number[], currentSum: number) {
    if (current.length === length) {
      if (currentSum === targetSum) combinations.push([...current]);
      return;
    }
    for (let num = start; num <= 9; num++) {
      current.push(num);
      backtrack(num + 1, current, currentSum + num);
      current.pop();
    }
  }

  backtrack(1, [], 0);

  // Jede Kombination in alle Permutationen entfalten.
  const results: number[][] = [];
  for (const combo of combinations) {
    results.push(...permutations(combo));
  }
  return results;
}

function permutations(arr: number[]): number[][] {
  if (arr.length <= 1) return [arr];
  const result: number[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

// Ermittelt alle horizontalen und vertikalen Runs eines Boards.
export function getRuns(board: KakuroBoard): Run[] {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const runs: Run[] = [];

  // Horizontale Runs: eine rowSum-Clue links davon gilt für die Zellen rechts davon.
  for (let r = 0; r < rows; r++) {
    let currentRun: [number, number][] = [];
    let currentSum: number | null = null;

    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell.type === "input") {
        if (currentSum !== null) {
          currentRun.push([r, c]);
        }
      } else {
        if (currentRun.length > 0) {
          runs.push({ cells: currentRun, sum: currentSum! });
          currentRun = [];
        }
        currentSum =
          cell.type === "clue" && cell.rowSum !== undefined ? cell.rowSum : null;
      }
    }
    if (currentRun.length > 0 && currentSum !== null) {
      runs.push({ cells: currentRun, sum: currentSum });
    }
  }

  // Vertikale Runs: eine colSum-Clue oben davon gilt für die Zellen darunter.
  for (let c = 0; c < cols; c++) {
    let currentRun: [number, number][] = [];
    let currentSum: number | null = null;

    for (let r = 0; r < rows; r++) {
      const cell = board[r][c];
      if (cell.type === "input") {
        if (currentSum !== null) {
          currentRun.push([r, c]);
        }
      } else {
        if (currentRun.length > 0) {
          runs.push({ cells: currentRun, sum: currentSum! });
          currentRun = [];
        }
        currentSum =
          cell.type === "clue" && cell.colSum !== undefined ? cell.colSum : null;
      }
    }
    if (currentRun.length > 0 && currentSum !== null) {
      runs.push({ cells: currentRun, sum: currentSum });
    }
  }

  return runs;
}

// Filtert alle Kombinationen eines Runs auf diejenigen, die mit den
// bereits bekannten Ziffern übereinstimmen.
function filterRunCombinations(run: Run, board: KakuroBoard): number[][] {
  const combinations = generateSumCombinations(run.sum, run.cells.length);
  return combinations.filter((combo) =>
    run.cells.every(([r, c], idx) => {
      const cell = board[r][c];
      if (cell.type !== "input") return false;
      return cell.value === null || cell.value === combo[idx];
    })
  );
}

// Findet alle Runs, in denen die Zelle (r, c) vorkommt, zusammen mit ihrem Index.
function getCellRuns(runs: Run[], r: number, c: number): [Run, number][] {
  const result: [Run, number][] = [];
  for (const run of runs) {
    const idx = run.cells.findIndex(([rr, cc]) => rr === r && cc === c);
    if (idx !== -1) result.push([run, idx]);
  }
  return result;
}

// Ermittelt alle möglichen Ziffern für eine leere Zelle unter Berücksichtigung
// ihrer horizontalen und vertikalen Runs.
function getPossibleValues(board: KakuroBoard, runs: Run[], r: number, c: number): number[] {
  const cellRuns = getCellRuns(runs, r, c);
  if (cellRuns.length === 0) return [];

  let possible: Set<number> | null = null;
  for (const [run, idx] of cellRuns) {
    const combos = filterRunCombinations(run, board);
    if (combos.length === 0) return [];
    const values = new Set(combos.map((combo) => combo[idx]));
    if (possible === null) {
      possible = values;
    } else {
      possible = new Set([...possible].filter((v: number) => values.has(v)));
    }
  }

  return possible ? [...possible].sort((a, b) => a - b) : [];
}

// Wendet Constraint Propagation an: Zellen mit nur einem möglichen Wert werden gesetzt.
// Gibt false zurück, wenn ein Widerspruch auftritt.
function propagate(board: KakuroBoard): boolean {
  const runs = getRuns(board);
  let changed = true;

  while (changed) {
    changed = false;

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const cell = board[r][c];
        if (cell.type !== "input" || cell.value !== null) continue;

        const possible = getPossibleValues(board, runs, r, c);
        if (possible.length === 0) return false;
        if (possible.length === 1) {
          cell.value = possible[0];
          changed = true;
        }
      }
    }
  }

  return true;
}

// Prüft, ob das Board vollständig und gültig gelöst ist.
export function isKakuroSolved(board: KakuroBoard): boolean {
  for (const run of getRuns(board)) {
    let sum = 0;
    const seen = new Set<number>();
    for (const [r, c] of run.cells) {
      const cell = board[r][c];
      if (cell.type !== "input" || cell.value === null) return false;
      sum += cell.value;
      if (seen.has(cell.value)) return false;
      seen.add(cell.value);
    }
    if (sum !== run.sum) return false;
  }
  return true;
}

// Löst das Kakuro via Constraint Propagation plus Backtracking (MRV-Heuristik).
export function solveKakuro(board: KakuroBoard): boolean {
  if (!propagate(board)) return false;
  if (isKakuroSolved(board)) return true;

  const runs = getRuns(board);

  // Zelle mit den wenigsten Möglichkeiten finden (Minimum Remaining Values).
  let bestCell: [number, number] | null = null;
  let bestValues: number[] = [];

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const cell = board[r][c];
      if (cell.type !== "input" || cell.value !== null) continue;

      const values = getPossibleValues(board, runs, r, c);
      if (values.length === 0) return false;
      if (bestCell === null || values.length < bestValues.length) {
        bestCell = [r, c];
        bestValues = values;
        if (values.length === 1) break;
      }
    }
  }

  if (!bestCell) return false;
  const [r, c] = bestCell;

  for (const digit of bestValues) {
    const snapshot = cloneKakuroBoard(board);
    const cell = board[r][c];
    if (cell.type === "input") cell.value = digit;
    if (solveKakuro(board)) return true;
    // Board wiederherstellen
    for (let i = 0; i < board.length; i++) {
      board[i] = snapshot[i];
    }
  }

  return false;
}

// Kleines 5×5-Beispiel-Rätsel.
export const EXAMPLE_KAKURO: KakuroBoard = [
  [
    { type: "blank" },
    { type: "blank" },
    { type: "clue", colSum: 21 },
    { type: "clue", colSum: 12 },
    { type: "clue", colSum: 9 },
  ],
  [
    { type: "blank" },
    { type: "clue", rowSum: 12, colSum: 13 },
    { type: "input", value: null },
    { type: "input", value: null },
    { type: "input", value: null },
  ],
  [
    { type: "clue", rowSum: 23, colSum: 20 },
    { type: "input", value: null },
    { type: "input", value: null },
    { type: "input", value: null },
    { type: "input", value: null },
  ],
  [
    { type: "clue", rowSum: 10 },
    { type: "input", value: null },
    { type: "input", value: null },
    { type: "blank" },
    { type: "blank" },
  ],
  [
    { type: "clue", rowSum: 10 },
    { type: "input", value: null },
    { type: "input", value: null },
    { type: "blank" },
    { type: "blank" },
  ],
];

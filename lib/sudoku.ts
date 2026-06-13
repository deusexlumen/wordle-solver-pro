// # BUXE_OS v24.X -- SUDOKU

export type SudokuBoard = (number | null)[][];

// Erzeugt ein leeres 9×9-Board.
export function createEmptyBoard(): SudokuBoard {
  return Array.from({ length: 9 }, () => Array(9).fill(null));
}

// Prüft, ob `num` an Position (row, col) regelkonform gesetzt werden kann.
export function isValid(board: SudokuBoard, row: number, col: number, num: number): boolean {
  // Zeile
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) return false;
  }
  // Spalte
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) return false;
  }
  // 3×3-Block
  const blockRow = Math.floor(row / 3) * 3;
  const blockCol = Math.floor(col / 3) * 3;
  for (let r = blockRow; r < blockRow + 3; r++) {
    for (let c = blockCol; c < blockCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) return false;
    }
  }
  return true;
}

// Prüft, ob das gesamte Board gültig ist (keine Konflikte).
export function isBoardValid(board: SudokuBoard): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const value = board[r][c];
      if (value !== null && !isValid(board, r, c, value)) return false;
    }
  }
  return true;
}

// Liefert alle Kandidaten für eine Zelle.
export function getCandidates(board: SudokuBoard, row: number, col: number): number[] {
  if (board[row][col] !== null) return [];
  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) candidates.push(num);
  }
  return candidates;
}

// Löst das Sudoku via Backtracking (mit einfacher Constraint Propagation).
// Gibt `true` zurück, wenn eine Lösung gefunden wurde; das Board wird in-place verändert.
export function solveSudoku(board: SudokuBoard): boolean {
  // Constraint Propagation: Single-Candidate-Zellen sofort füllen.
  let progress = true;
  while (progress) {
    progress = false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === null) {
          const candidates = getCandidates(board, r, c);
          if (candidates.length === 0) return false; // Widerspruch
          if (candidates.length === 1) {
            board[r][c] = candidates[0];
            progress = true;
          }
        }
      }
    }
  }

  // Leere Zelle mit den wenigsten Kandidaten finden (MRV-Heuristik).
  let bestRow = -1;
  let bestCol = -1;
  let bestCandidates: number[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === null) {
        const candidates = getCandidates(board, r, c);
        if (candidates.length === 0) return false;
        if (bestCandidates.length === 0 || candidates.length < bestCandidates.length) {
          bestRow = r;
          bestCol = c;
          bestCandidates = candidates;
          if (candidates.length === 1) break;
        }
      }
    }
  }

  if (bestRow === -1) return true; // Alles gefüllt

  for (const num of bestCandidates) {
    board[bestRow][bestCol] = num;
    if (solveSudoku(board)) return true;
    board[bestRow][bestCol] = null;
  }

  return false;
}

// Erzeugt eine tiefe Kopie des Boards.
export function cloneBoard(board: SudokuBoard): SudokuBoard {
  return board.map((row) => [...row]);
}

// Beispiel-Rätsel: Leicht.
export const EXAMPLE_EASY: SudokuBoard = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9],
];

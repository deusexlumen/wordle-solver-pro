// # BUXE_OS v24.X -- SUDOKU TESTS

import { describe, it, expect } from "vitest";
import {
  createEmptyBoard,
  isValid,
  isBoardValid,
  solveSudoku,
  cloneBoard,
  EXAMPLE_EASY,
} from "@/lib/sudoku";

describe("Sudoku solver", () => {
  it("validates a correct empty placement", () => {
    const board = createEmptyBoard();
    expect(isValid(board, 0, 0, 5)).toBe(true);
  });

  it("detects row conflicts", () => {
    const board = createEmptyBoard();
    board[0][2] = 5;
    expect(isValid(board, 0, 4, 5)).toBe(false);
  });

  it("detects block conflicts", () => {
    const board = createEmptyBoard();
    board[1][1] = 7;
    expect(isValid(board, 2, 2, 7)).toBe(false);
  });

  it("solves the example puzzle", () => {
    const board = cloneBoard(EXAMPLE_EASY);
    expect(solveSudoku(board)).toBe(true);
    expect(isBoardValid(board)).toBe(true);
    expect(board.every((row) => row.every((cell) => cell !== null))).toBe(true);
  });

  it("returns false for an unsolvable puzzle", () => {
    const board = createEmptyBoard();
    board[0][0] = 1;
    board[0][1] = 1;
    expect(solveSudoku(board)).toBe(false);
  });
});

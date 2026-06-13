// # BUXE_OS v24.X -- NONOGRAM TESTS

import { describe, it, expect } from "vitest";
import {
  createEmptyNonogram,
  generateLinePatterns,
  solveNonogram,
  lineMatchesClues,
  EXAMPLE_HEART,
} from "@/lib/nonogram";

describe("Nonogram solver", () => {
  it("generates correct line patterns for clue [2,1] in length 5", () => {
    const patterns = generateLinePatterns(5, [2, 1]);
    expect(patterns).toContainEqual([1, 1, 0, 1, 0]);
    expect(patterns).toContainEqual([1, 1, 0, 0, 1]);
    expect(patterns).toContainEqual([0, 1, 1, 0, 1]);
    expect(patterns).toHaveLength(3);
  });

  it("returns a single pattern when there is no free space", () => {
    expect(generateLinePatterns(4, [2, 1])).toEqual([[1, 1, 0, 1]]);
  });

  it("returns an empty array for impossible clues", () => {
    expect(generateLinePatterns(2, [3])).toEqual([]);
  });

  it("validates complete lines against clues", () => {
    expect(lineMatchesClues([1, 1, 0, 1], [2, 1])).toBe(true);
    expect(lineMatchesClues([1, 1, 1, 0], [2, 1])).toBe(false);
    expect(lineMatchesClues([0, 0, 0], [])).toBe(true);
  });

  it("solves the example heart puzzle", () => {
    const board = createEmptyNonogram(EXAMPLE_HEART.rows, EXAMPLE_HEART.cols);
    expect(solveNonogram(board, EXAMPLE_HEART.rowClues, EXAMPLE_HEART.colClues)).toBe(true);
    expect(board.every((row) => row.every((cell) => cell !== null))).toBe(true);
  });

  it("returns false for an impossible puzzle", () => {
    const board = createEmptyNonogram(2, 2);
    expect(solveNonogram(board, [[3], [0]], [[1], [1]])).toBe(false);
  });
});

// # BUXE_OS v24.X -- KAKURO TESTS

import { describe, it, expect } from "vitest";
import {
  generateSumCombinations,
  getRuns,
  solveKakuro,
  isKakuroSolved,
  cloneKakuroBoard,
  EXAMPLE_KAKURO,
  type KakuroBoard,
} from "@/lib/kakuro";

function makeBoard(cells: string[][]): KakuroBoard {
  return cells.map((row) =>
    row.map((cell) => {
      if (cell === "." || cell === "") return { type: "blank" };
      if (cell.startsWith("c")) {
        const parts = cell.slice(1).split("/");
        return {
          type: "clue",
          colSum: parts[0] ? parseInt(parts[0], 10) : undefined,
          rowSum: parts[1] ? parseInt(parts[1], 10) : undefined,
        };
      }
      return { type: "input", value: cell === " " ? null : parseInt(cell, 10) };
    })
  );
}

describe("Kakuro solver", () => {
  it("generates sum combinations for small sums", () => {
    const combos = generateSumCombinations(5, 2);
    expect(combos).toContainEqual([1, 4]);
    expect(combos).toContainEqual([4, 1]);
    expect(combos).toHaveLength(4); // [1,4], [4,1], [2,3], [3,2]
  });

  it("returns empty for impossible sums", () => {
    expect(generateSumCombinations(1, 2)).toEqual([]);
    expect(generateSumCombinations(45, 10)).toEqual([]);
  });

  it("detects horizontal and vertical runs", () => {
    const board = makeBoard([
      [".", "c3/3", " ", " ", ""],
      [".", " ", " ", ".", "."],
      [".", ".", ".", ".", "."],
    ]);
    const runs = getRuns(board);
    expect(runs).toHaveLength(2);
    expect(runs[0]).toEqual({ cells: [[0, 2], [0, 3]], sum: 3 });
    expect(runs[1]).toEqual({ cells: [[1, 1]], sum: 3 });
  });

  it("solves the example puzzle", () => {
    const board = cloneKakuroBoard(EXAMPLE_KAKURO);
    expect(solveKakuro(board)).toBe(true);
    expect(isKakuroSolved(board)).toBe(true);
  });

  it("returns false for an impossible puzzle", () => {
    const board = makeBoard([
      [".", "c/3", " ", ""],
      ["c4/", " ", " ", ""],
    ]);
    expect(solveKakuro(board)).toBe(false);
  });

  it("clones the board deeply", () => {
    const original = cloneKakuroBoard(EXAMPLE_KAKURO);
    const clone = cloneKakuroBoard(original);
    const input = clone[1][2];
    if (input.type === "input") input.value = 99;
    expect((original[1][2] as { type: "input"; value: number | null }).value).toBeNull();
  });
});

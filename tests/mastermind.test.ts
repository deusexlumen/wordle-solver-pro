// # BUXE_OS v24.X -- MASTERMIND TESTS

import { describe, it, expect } from "vitest";
import {
  generateAllCodes,
  calculateFeedback,
  filterPossibilities,
  suggestGuess,
  generateSecretCode,
  DEFAULT_COLORS,
  DEFAULT_POSITIONS,
} from "@/lib/mastermind";

describe("Mastermind engine", () => {
  it("generates all codes for 2 colors and 2 positions", () => {
    const codes = generateAllCodes(2, 2);
    expect(codes).toHaveLength(4);
    expect(codes).toContainEqual([0, 0]);
    expect(codes).toContainEqual([1, 1]);
  });

  it("calculates perfect feedback as all black", () => {
    expect(calculateFeedback([0, 1, 2, 3], [0, 1, 2, 3])).toEqual({ black: 4, white: 0 });
  });

  it("calculates all-white feedback for shifted colors", () => {
    expect(calculateFeedback([0, 1, 2, 3], [1, 2, 3, 0])).toEqual({ black: 0, white: 4 });
  });

  it("does not double-count matching colors", () => {
    // Zwei gleiche Farben im Guess, eine im Secret.
    expect(calculateFeedback([0, 0, 1, 2], [0, 3, 4, 5])).toEqual({ black: 1, white: 0 });
  });

  it("filters possibilities based on feedback", () => {
    const all = generateAllCodes(DEFAULT_COLORS, DEFAULT_POSITIONS);
    const guess = [0, 0, 1, 1];
    const feedback = { black: 2, white: 0 };
    const remaining = filterPossibilities(all, guess, feedback);
    expect(remaining.length).toBeGreaterThan(0);
    expect(remaining.length).toBeLessThan(all.length);
    for (const code of remaining) {
      expect(calculateFeedback(guess, code)).toEqual(feedback);
    }
  });

  it("solves a secret code via iterative filtering", () => {
    const secret = [2, 4, 1, 0];
    const all = generateAllCodes(DEFAULT_COLORS, DEFAULT_POSITIONS);
    let possibilities = [...all];
    let attempts = 0;

    while (attempts < 12) {
      const guess = suggestGuess(possibilities, all);
      const feedback = calculateFeedback(guess, secret);
      if (feedback.black === DEFAULT_POSITIONS) break;
      possibilities = filterPossibilities(possibilities, guess, feedback);
      expect(possibilities.length).toBeGreaterThan(0);
      attempts++;
    }

    expect(attempts).toBeLessThan(12);
  });

  it("generates a secret code with valid pegs", () => {
    const code = generateSecretCode(DEFAULT_COLORS, DEFAULT_POSITIONS);
    expect(code).toHaveLength(DEFAULT_POSITIONS);
    expect(code.every((peg) => peg >= 0 && peg < DEFAULT_COLORS)).toBe(true);
  });
});

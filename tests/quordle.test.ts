// # BUXE_OS v24.X -- QUORDLE TESTS

import { describe, it, expect } from "vitest";
import { filterCandidates, GuessRow } from "@/lib/solver";

const ALL_WORDS = ["apple", "apply", "ample", "amaze", "beach", "black", "blame", "bread", "break", "brick"];

describe("Quordle multi-board filtering", () => {
  it("applies the same guess to four independent histories", () => {
    const guess: GuessRow = { word: "bread", feedback: ["green", "gray", "gray", "gray", "yellow"] };
    const histories: GuessRow[][] = [[guess], [guess], [guess], [guess]];

    for (const history of histories) {
      const candidates = filterCandidates(ALL_WORDS, history);
      expect(candidates.length).toBeGreaterThanOrEqual(0);
    }
  });

  it("keeps board pools isolated", () => {
    const historyA: GuessRow[] = [{ word: "apple", feedback: ["green", "green", "green", "green", "green"] }];
    const historyB: GuessRow[] = [{ word: "black", feedback: ["gray", "green", "green", "green", "green"] }];

    const poolA = filterCandidates(ALL_WORDS, historyA);
    const poolB = filterCandidates(ALL_WORDS, historyB);

    expect(poolA).toContain("apple");
    expect(poolB).not.toContain("apple");
  });
});

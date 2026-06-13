// BUXE_OS v24.X -- SOLVER_TESTS

import { describe, it, expect } from "vitest";
import { filterCandidates, getSuggestions, findTrap, getEliminatorWords } from "@/lib/solver";

describe("filterCandidates", () => {
  it("filters after STARE -> green at A", () => {
    const words = ["stamp", "stare", "aback", "brain", "abled"];
    const result = filterCandidates(words, [
      { word: "stare", feedback: ["gray", "gray", "green", "gray", "gray"] },
    ]);
    expect(result).toContain("aback");
    expect(result).not.toContain("stare");
  });

  it("handles yellow feedback correctly", () => {
    const words = ["apple", "helix", "eagle", "crane"];
    const result = filterCandidates(words, [
      { word: "crane", feedback: ["gray", "gray", "gray", "gray", "yellow"] },
    ]);
    expect(result).toContain("helix");
    expect(result).not.toContain("crane");
  });

  it("handles double letters with gray feedback", () => {
    const words = ["sassy", "basis", "cases", "shows"];
    const result = filterCandidates(words, [
      { word: "sassy", feedback: ["green", "gray", "gray", "gray", "gray"] },
    ]);
    expect(result).toContain("shows");
    expect(result).not.toContain("sassy");
    expect(result).not.toContain("basis");
  });
});

describe("getSuggestions", () => {
  it("returns empty array for no candidates", () => {
    expect(getSuggestions([], ["apple", "brain"], 5)).toEqual([]);
  });

  it("prefers candidates when only two remain", () => {
    const candidates = ["apple", "apply"];
    const suggestions = getSuggestions(candidates, ["zebra", "apple", "apply"], 5);
    expect(suggestions).toContain("apple");
    expect(suggestions).toContain("apply");
  });
});

describe("findTrap", () => {
  it("detects a trap among similar candidates", () => {
    const candidates = ["block", "clock", "flock", "shock", "smack"];
    const trap = findTrap(candidates);
    expect(trap).not.toBeNull();
    expect(trap!.examples.length).toBeGreaterThanOrEqual(3);
  });

  it("returns null for fewer than 3 candidates", () => {
    expect(findTrap(["apple", "apply"])).toBeNull();
  });

  it("returns null for too many candidates", () => {
    expect(findTrap(Array(13).fill("apple"))).toBeNull();
  });
});

describe("getEliminatorWords", () => {
  it("finds words covering varying trap letters", () => {
    const trap = { pattern: "?lock", examples: ["block", "clock", "flock"] };
    const eliminators = getEliminatorWords(trap, ["bacon", "cabal", "flame", "ghoul"], 5);
    expect(eliminators.length).toBeGreaterThan(0);
  });
});

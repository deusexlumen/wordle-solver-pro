// # BUXE_OS v24.X -- CONNECTIONS TESTS

import { describe, it, expect } from "vitest";
import { parseWords, isValidAnalysis } from "@/lib/connections";

describe("Connections parser", () => {
  it("parses words from newline-separated text", () => {
    const words = parseWords("apple\nbanana\ncherry");
    expect(words).toEqual(["apple", "banana", "cherry"]);
  });

  it("parses words from comma-separated text", () => {
    const words = parseWords("apple, banana, cherry");
    expect(words).toEqual(["apple", "banana", "cherry"]);
  });

  it("lowercases and trims words", () => {
    const words = parseWords("  Apple  ,  BANANA ");
    expect(words).toEqual(["apple", "banana"]);
  });

  it("limits to 16 words", () => {
    const words = parseWords(Array.from({ length: 20 }, (_, i) => `word${i}`).join(" "));
    expect(words).toHaveLength(16);
  });
});

describe("Connections validation", () => {
  it("validates a correct analysis", () => {
    const words = Array.from({ length: 16 }, (_, i) => `word${i}`);
    const analysis = {
      groups: [
        { title: "A", words: words.slice(0, 4) },
        { title: "B", words: words.slice(4, 8) },
        { title: "C", words: words.slice(8, 12) },
        { title: "D", words: words.slice(12, 16) },
      ],
    };
    expect(isValidAnalysis(words, analysis)).toBe(true);
  });

  it("rejects an analysis with missing words", () => {
    const words = Array.from({ length: 16 }, (_, i) => `word${i}`);
    const analysis = {
      groups: [
        { title: "A", words: words.slice(0, 4) },
        { title: "B", words: words.slice(4, 7) },
        { title: "C", words: words.slice(8, 12) },
        { title: "D", words: words.slice(12, 16) },
      ],
    };
    expect(isValidAnalysis(words, analysis)).toBe(false);
  });
});

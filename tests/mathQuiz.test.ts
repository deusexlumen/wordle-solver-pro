// # BUXE_OS v24.X -- MATH QUIZ TESTS

import { describe, it, expect } from "vitest";
import {
  generateProblem,
  checkAnswer,
  calculatePoints,
  createInitialState,
} from "@/lib/mathQuiz";

describe("Math quiz engine", () => {
  it("generates an addition problem for easy difficulty", () => {
    const problem = generateProblem("easy");
    expect(problem.operation).toMatch(/^[+-]$/);
    expect(problem.answer).toBe(
      problem.operation === "+" ? problem.a + problem.b : problem.a - problem.b
    );
  });

  it("generates a multiplication problem for medium difficulty", () => {
    const problem = generateProblem("medium");
    expect(["+", "-", "*"]).toContain(problem.operation);
    if (problem.operation === "*") {
      expect(problem.answer).toBe(problem.a * problem.b);
    }
  });

  it("generates a division problem for hard difficulty", () => {
    // Division kann selten sein, daher wiederholen wir den Test mehrfach.
    let divisionFound = false;
    for (let i = 0; i < 50; i++) {
      const problem = generateProblem("hard");
      if (problem.operation === "/") {
        divisionFound = true;
        expect(problem.a % problem.b).toBe(0);
        expect(problem.answer).toBe(problem.a / problem.b);
        break;
      }
    }
    expect(divisionFound).toBe(true);
  });

  it("checks answers correctly", () => {
    const problem = { a: 5, b: 3, operation: "+" as const, answer: 8, display: "5 + 3" };
    expect(checkAnswer(problem, 8)).toBe(true);
    expect(checkAnswer(problem, 7)).toBe(false);
  });

  it("calculates points with difficulty and streak bonus", () => {
    expect(calculatePoints("easy", 0)).toBe(10);
    expect(calculatePoints("medium", 5)).toBe(30);
    expect(calculatePoints("hard", 10)).toBe(50);
  });

  it("caps streak bonus at 10", () => {
    expect(calculatePoints("hard", 100)).toBe(50);
  });

  it("creates initial state", () => {
    const state = createInitialState();
    expect(state).toEqual({ score: 0, streak: 0, totalAnswered: 0, correctAnswers: 0 });
  });
});

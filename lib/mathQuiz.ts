// # BUXE_OS v24.X -- MATH QUIZ

export type Difficulty = "easy" | "medium" | "hard";
export type Operation = "+" | "-" | "*" | "/";

export interface MathProblem {
  a: number;
  b: number;
  operation: Operation;
  answer: number;
  display: string;
}

export interface QuizState {
  score: number;
  streak: number;
  totalAnswered: number;
  correctAnswers: number;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOperations(difficulty: Difficulty): Operation[] {
  switch (difficulty) {
    case "easy":
      return ["+", "-"];
    case "medium":
      return ["+", "-", "*"];
    case "hard":
      return ["+", "-", "*", "/"];
  }
}

function getRanges(difficulty: Difficulty): { min: number; max: number } {
  switch (difficulty) {
    case "easy":
      return { min: 1, max: 20 };
    case "medium":
      return { min: 2, max: 50 };
    case "hard":
      return { min: 2, max: 100 };
  }
}

// Erzeugt eine neue Rechenaufgabe passend zur Schwierigkeit.
export function generateProblem(difficulty: Difficulty): MathProblem {
  const operations = getOperations(difficulty);
  const operation = operations[getRandomInt(0, operations.length - 1)];
  const { min, max } = getRanges(difficulty);

  let a: number;
  let b: number;
  let answer: number;

  switch (operation) {
    case "+":
      a = getRandomInt(min, max);
      b = getRandomInt(min, max);
      answer = a + b;
      break;
    case "-":
      a = getRandomInt(min, max);
      b = getRandomInt(min, a); // Keine negativen Ergebnisse
      answer = a - b;
      break;
    case "*":
      a = getRandomInt(2, difficulty === "medium" ? 12 : 20);
      b = getRandomInt(2, difficulty === "medium" ? 12 : 20);
      answer = a * b;
      break;
    case "/":
      b = getRandomInt(2, 12);
      answer = getRandomInt(2, difficulty === "hard" ? 20 : 12);
      a = b * answer; // Stets ganzzahlig teilbar
      break;
  }

  const display = `${a} ${operation} ${b}`;
  return { a, b, operation, answer, display };
}

// Prüft, ob die Nutzerantwort korrekt ist.
export function checkAnswer(problem: MathProblem, userAnswer: number): boolean {
  return userAnswer === problem.answer;
}

// Berechnet Punkte basierend auf Schwierigkeit und Streak.
export function calculatePoints(difficulty: Difficulty, streak: number): number {
  const base = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
  const streakBonus = Math.min(streak, 10) * 2;
  return base + streakBonus;
}

// Gibt die initiale Quiz-State zurück.
export function createInitialState(): QuizState {
  return {
    score: 0,
    streak: 0,
    totalAnswered: 0,
    correctAnswers: 0,
  };
}

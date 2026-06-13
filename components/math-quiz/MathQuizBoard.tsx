// # BUXE_OS v24.X -- MATHQUIZBOARD

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  generateProblem,
  checkAnswer,
  calculatePoints,
  createInitialState,
  type Difficulty,
  type QuizState,
} from "@/lib/mathQuiz";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Leicht",
  medium: "Mittel",
  hard: "Schwer",
};

export function MathQuizBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [problem, setProblem] = useState(() => generateProblem("easy"));
  const [input, setInput] = useState("");
  const [state, setState] = useState<QuizState>(createInitialState);
  const [feedback, setFeedback] = useState<string>("");

  function nextProblem(level: Difficulty = difficulty) {
    setProblem(generateProblem(level));
    setInput("");
    setFeedback("");
  }

  function changeDifficulty(level: Difficulty) {
    setDifficulty(level);
    nextProblem(level);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseInt(input, 10);
    if (Number.isNaN(value)) return;

    const isCorrect = checkAnswer(problem, value);
    setState((prev) => {
      const streak = isCorrect ? prev.streak + 1 : 0;
      const points = isCorrect ? calculatePoints(difficulty, streak) : 0;
      return {
        score: prev.score + points,
        streak,
        totalAnswered: prev.totalAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      };
    });

    if (isCorrect) {
      setFeedback(`✅ Richtig! +${calculatePoints(difficulty, state.streak + 1)} Punkte`);
    } else {
      setFeedback(`❌ Falsch. Richtig wäre ${problem.answer} gewesen.`);
    }

    setTimeout(nextProblem, 1200);
  }

  function handleReset() {
    setState(createInitialState());
    setFeedback("");
    nextProblem();
  }

  return (
    <section className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <h2 className="text-lg font-semibold">Math Trivia Quiz</h2>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((level) => (
          <Button
            key={level}
            onClick={() => changeDifficulty(level)}
            variant={difficulty === level ? "default" : "outline"}
            size="sm"
          >
            {DIFFICULTY_LABELS[level]}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-zinc-800 p-3">
          <p className="text-xs text-zinc-400">Punkte</p>
          <p className="text-xl font-bold">{state.score}</p>
        </div>
        <div className="rounded-lg bg-zinc-800 p-3">
          <p className="text-xs text-zinc-400">Streak</p>
          <p className="text-xl font-bold">{state.streak}</p>
        </div>
        <div className="rounded-lg bg-zinc-800 p-3">
          <p className="text-xs text-zinc-400">Richtig</p>
          <p className="text-xl font-bold">
            {state.correctAnswers}/{state.totalAnswered}
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-4xl font-bold tracking-wider">{problem.display} = ?</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="number"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Deine Antwort"
          className="flex-1 text-center text-xl"
          autoFocus
        />
        <Button type="submit" disabled={input === ""}>
          Prüfen
        </Button>
      </form>

      {feedback && <p className="text-center text-lg">{feedback}</p>}

      <div className="flex justify-center">
        <Button onClick={handleReset} variant="outline">
          Quiz zurücksetzen
        </Button>
      </div>
    </section>
  );
}

// # BUXE_OS v24.X -- MATH QUIZ PAGE

import { MathQuizBoard } from "@/components/math-quiz/MathQuizBoard";
import { Navigation } from "@/components/Navigation";

export default function MathQuizPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Math Trivia Quiz</h1>
        <Navigation current="/math-quiz" />
      </header>

      <MathQuizBoard />
    </main>
  );
}

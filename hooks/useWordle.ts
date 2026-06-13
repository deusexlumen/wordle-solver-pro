// # BUXE_OS v24.X -- USEWORDLE

"use client";

import { useEffect, useMemo, useState } from "react";
import { loadWords } from "@/lib/words";
import { GuessRow } from "@/lib/solver";
import { calculateGameState } from "@/lib/gameState";

// Zentraler Hook für den gesamten Wordle-Solver-Zustand
export function useWordle() {
  const [allWords, setAllWords] = useState<string[]>([]);
  const [history, setHistory] = useState<GuessRow[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState<
    (GuessRow["feedback"][number] | "")[]
  >(Array(5).fill(""));

  // Wörterbuch einmalig beim Mount laden
  useEffect(() => {
    loadWords().then(setAllWords);
  }, []);

  const game = useMemo(
    () => calculateGameState(allWords, history),
    [allWords, history]
  );

  // Aktuelle Zeile mit Feedback in den Verlauf übernehmen
  function submitGuess() {
    if (currentWord.length !== 5) return;
    if (currentFeedback.some((f) => !f)) return;
    setHistory((h) => [
      ...h,
      { word: currentWord.toLowerCase(), feedback: currentFeedback as GuessRow["feedback"] },
    ]);
    setCurrentWord("");
    setCurrentFeedback(Array(5).fill(""));
  }

  // Spiel zurücksetzen
  function reset() {
    setHistory([]);
    setCurrentWord("");
    setCurrentFeedback(Array(5).fill(""));
  }

  // Demo-Szenario oder OCR-Ergebnis laden
  function loadDemo(rows: GuessRow[]) {
    setHistory(rows);
  }

  return {
    ...game,
    currentWord,
    setCurrentWord,
    currentFeedback,
    setCurrentFeedback,
    submitGuess,
    reset,
    loadDemo,
  };
}

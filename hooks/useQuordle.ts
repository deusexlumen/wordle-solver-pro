// # BUXE_OS v24.X -- USEQUORDLE

"use client";

import { useEffect, useMemo, useState } from "react";
import { loadWords } from "@/lib/words";
import { scoreGuess, GuessRow } from "@/lib/solver";
import { calculateGameState, WordleGameState } from "@/lib/gameState";

// Zustand für eines der vier Quordle-Boards
interface QuordleBoard extends WordleGameState {
  id: number;
}

// Zentrale Eingabezeile, die an alle Boards verteilt wird
export interface QuordleInputState {
  currentWord: string;
  setCurrentWord: (s: string) => void;
  currentFeedback: ("" | "green" | "yellow" | "gray")[];
  setCurrentFeedback: (f: ("" | "green" | "yellow" | "gray")[]) => void;
}

export function useQuordle() {
  const [allWords, setAllWords] = useState<string[]>([]);
  const [histories, setHistories] = useState<GuessRow[][]>([
    [],
    [],
    [],
    [],
  ]);
  const [currentWord, setCurrentWord] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState<
    ("" | "green" | "yellow" | "gray")[]
  >(Array(5).fill(""));

  useEffect(() => {
    loadWords().then(setAllWords);
  }, []);

  // Vier einzelne Spielzustände ableiten
  const boards: QuordleBoard[] = useMemo(
    () =>
      histories.map((history, id) => ({
        id,
        ...calculateGameState(allWords, history),
      })),
    [histories, allWords]
  );

  // Kombinierter Vorschlag: maximiert die Summe der Entropien über alle vier Pools.
  const combinedSuggestions = useMemo(() => {
    const activeBoards = boards.filter(
      (b) => b.remainingCandidates.length > 0 && b.remainingCandidates.length <= 2000
    );
    if (activeBoards.length === 0) return [];

    const pool = activeBoards.some((b) => b.remainingCandidates.length > 2)
      ? allWords
      : activeBoards.flatMap((b) => b.remainingCandidates);

    const scored = Array.from(new Set(pool))
      .filter((w) => /^[a-z]{5}$/.test(w))
      .map((word) => ({
        word,
        score: activeBoards.reduce(
          (sum, b) => sum + scoreGuess(word, b.remainingCandidates),
          0
        ),
      }))
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 5).map((s) => s.word);
  }, [boards, allWords]);

  // Eine Zeile an alle vier Boards anhängen
  function submitGuess() {
    if (currentWord.length !== 5) return;
    if (currentFeedback.some((f) => !f)) return;

    const row: GuessRow = {
      word: currentWord.toLowerCase(),
      feedback: currentFeedback as GuessRow["feedback"],
    };

    setHistories((prev) => prev.map((history) => [...history, row]));
    setCurrentWord("");
    setCurrentFeedback(Array(5).fill(""));
  }

  function reset() {
    setHistories([[], [], [], []]);
    setCurrentWord("");
    setCurrentFeedback(Array(5).fill(""));
  }

  return {
    boards,
    combinedSuggestions,
    currentWord,
    setCurrentWord,
    currentFeedback,
    setCurrentFeedback,
    submitGuess,
    reset,
  };
}

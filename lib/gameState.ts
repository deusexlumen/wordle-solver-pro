// # BUXE_OS v24.X -- GAMESTATE

import {
  filterCandidates,
  findTrap,
  getEliminatorWords,
  getSuggestions,
  GuessRow,
} from "./solver";

// Reiner Solver-Zustand für ein einzelnes Wordle/Quordle-Board.
export interface WordleGameState {
  history: GuessRow[];
  remainingCandidates: string[];
  suggestions: string[];
  trap: ReturnType<typeof findTrap>;
  eliminators: string[];
}

// Berechnet alle abgeleiteten Zustände für ein Board — ohne React-Hooks,
// damit es aus useMemo heraus aufgerufen werden kann.
export function calculateGameState(
  allWords: string[],
  history: GuessRow[]
): WordleGameState {
  const remainingCandidates = filterCandidates(allWords, history);
  const suggestions = getSuggestions(remainingCandidates, allWords, 5);
  const trap = findTrap(remainingCandidates);
  const eliminators = trap ? getEliminatorWords(trap, allWords, 5) : [];

  return {
    history,
    remainingCandidates,
    suggestions,
    trap,
    eliminators,
  };
}

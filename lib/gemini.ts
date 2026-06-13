// BUXE_OS v24.X -- GEMINI_CLIENT

import { GuessRow } from "@/lib/solver";

/**
 * Sendet einen Screenshot an die API-Route und gibt die erkannten Wordle-Versuche zurück.
 */
export async function analyzeScreenshot(file: File): Promise<GuessRow[]> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch("/api/gemini/analyze-screenshot", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error("OCR failed");
  }

  const data = await res.json();
  return data.guesses as GuessRow[];
}

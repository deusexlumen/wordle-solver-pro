// # BUXE_OS v24.X -- WORDS
// Lädt das Wörterbuch aus der statischen JSON-Datei und cached es clientseitig.
export type WordList = string[];

let cached: WordList | null = null;

export async function loadWords(): Promise<WordList> {
  if (cached) return cached;
  const res = await fetch("/words.json");
  cached = (await res.json()) as WordList;
  return cached;
}

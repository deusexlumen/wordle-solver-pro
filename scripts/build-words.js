// # BUXE_OS v24.X -- BUILD_WORDS
// Build-Skript: Liest words.txt aus word-list, filtert auf 5-Buchstaben-Wörter und schreibt public/words.json.
const fs = require("fs");
const path = require("path");
const wordList = require("word-list");

const words = fs
  .readFileSync(wordList.default, "utf-8")
  .split("\n")
  .filter((w) => /^[a-z]{5}$/.test(w));

fs.writeFileSync(
  path.join(__dirname, "../public/words.json"),
  JSON.stringify(words)
);
console.log(`Wrote ${words.length.toLocaleString("en-US")} words`);

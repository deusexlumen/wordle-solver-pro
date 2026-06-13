// # BUXE_OS v24.X -- GEMINI_CONNECTIONS_ROUTE

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const PRIMARY_MODEL = "gemini-2.5-flash-lite";
const FALLBACK_MODEL = "gemini-2.5-flash";

export interface ConnectionsGroup {
  title: string;
  words: string[];
}

/**
 * Nimmt 16 Wörter entgegen und gruppiert sie mit Gemini in 4 Connections-Kategorien.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const body = (await req.json()) as { words?: string[] };
  const words = body.words;
  if (!Array.isArray(words) || words.length !== 16) {
    return NextResponse.json({ error: "Exactly 16 words required" }, { status: 400 });
  }

  const genAI = new GoogleGenAI({ apiKey });

  const prompt = `You are a Connections puzzle assistant. Group these 16 words into 4 thematically related groups of 4 words each.

Words: ${words.join(", ")}

Return ONLY a JSON object with this exact structure:
{
  "groups": [
    { "title": "Category name", "words": ["word1", "word2", "word3", "word4"] },
    ...
  ]
}

Each word must appear exactly once. The categories should be clever and specific, like in the NYT Connections game.`;

  let lastError: unknown;
  for (const modelName of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    let retries = 3;
    while (retries > 0) {
      try {
        const result = await genAI.models.generateContent({ model: modelName, contents: prompt });
        const text = result.text || "";
        const json = JSON.parse(text.replace(/```json\n?|```\n?/g, "").trim()) as {
          groups: ConnectionsGroup[];
        };
        return NextResponse.json(json);
      } catch (err) {
        lastError = err;
        const message = String(err);
        if (message.includes("503") || message.includes("high demand")) {
          await new Promise((r) => setTimeout(r, 2000));
          retries--;
        } else {
          break;
        }
      }
    }
  }

  return NextResponse.json({ error: "Gemini failed", detail: String(lastError) }, { status: 502 });
}

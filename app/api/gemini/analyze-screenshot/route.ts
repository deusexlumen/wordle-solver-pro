// BUXE_OS v24.X -- GEMINI_OCR_ROUTE

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Primäres Modell für schnelle, kostengünstige OCR-Analyse.
const PRIMARY_MODEL = "gemini-2.5-flash-lite";
// Fallback-Modell, falls das primäre Modell überlastet ist oder fehlschlägt.
const FALLBACK_MODEL = "gemini-2.5-flash";

/**
 * Nimmt ein Bild entgegen und analysiert es mit Gemini.
 * Gibt ein JSON mit der erkannten Wordle-Versuchshistorie zurück.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("image") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No image" }, { status: 400 });
  }

  const bytes = await file.bytes();
  const base64 = Buffer.from(bytes).toString("base64");
  const mime = file.type || "image/png";

  const genAI = new GoogleGenAI({ apiKey });

  const prompt = `Analyze this Wordle screenshot. Return a JSON object with an array "guesses". Each guess has "word" (5 lowercase letters) and "feedback" (array of 5 strings: "green", "yellow", "gray").`;

  const contents = [
    { text: prompt },
    { inlineData: { mimeType: mime, data: base64 } },
  ];

  let lastError: unknown;
  for (const modelName of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    let retries = 3;
    while (retries > 0) {
      try {
        const result = await genAI.models.generateContent({ model: modelName, contents });
        const text = result.text || "";
        const json = JSON.parse(text.replace(/```json\n?|```\n?/g, "").trim());
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

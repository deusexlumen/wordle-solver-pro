// # BUXE_OS v24.X -- IMAGEDROPZONE

"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { analyzeScreenshot } from "@/lib/gemini";
import { GuessRow } from "@/lib/solver";

/**
 * Drag & Drop Zone für Wordle-Screenshots.
 * Sendet das Bild an die Gemini-OCR-API und übergibt erkannte Versuche an die Elternkomponente.
 */
export function ImageDropzone({ onAnalyzed }: { onAnalyzed: (rows: GuessRow[]) => void }) {
  const onDrop = useCallback(
    async (files: File[]) => {
      const rows = await analyzeScreenshot(files[0]);
      onAnalyzed(rows);
    },
    [onAnalyzed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div
      {...getRootProps()}
      className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-700 p-6 text-center hover:border-zinc-500"
    >
      <input {...getInputProps()} />
      <p className="text-sm text-zinc-300">
        {isDragActive
          ? "Bild hier loslassen..."
          : "Screenshot per Drag & Drop oder Klick hochladen"}
      </p>
    </div>
  );
}

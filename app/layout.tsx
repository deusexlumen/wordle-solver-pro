// # BUXE_OS v24.X -- LAYOUT

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordle Solver PRO",
  description: "Mathematischer Wordle-Assistent mit Entropie, Trap-Erkennung und OCR.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}

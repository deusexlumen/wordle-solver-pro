// # BUXE_OS v24.X -- KAKURO PAGE

import { KakuroBoard } from "@/components/kakuro/KakuroBoard";
import { Navigation } from "@/components/Navigation";

export default function KakuroPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kakuro Solver</h1>
        <Navigation current="/kakuro" />
      </header>

      <KakuroBoard />
    </main>
  );
}

// # BUXE_OS v24.X -- CONNECTIONS PAGE

import { ConnectionsBoard } from "@/components/connections/ConnectionsBoard";
import { Navigation } from "@/components/Navigation";

export default function ConnectionsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Connections Assistant</h1>
        <Navigation current="/connections" />
      </header>

      <ConnectionsBoard />
    </main>
  );
}

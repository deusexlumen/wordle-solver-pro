// # BUXE_OS v24.X -- NAVIGATION

import Link from "next/link";

const ROUTES = [
  { href: "/", label: "Wordle" },
  { href: "/quordle", label: "Quordle" },
  { href: "/sudoku", label: "Sudoku" },
  { href: "/nonogram", label: "Nonogram" },
  { href: "/mastermind", label: "Mastermind" },
];

export function Navigation({ current }: { current: string }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {ROUTES.map((route) => {
        const isActive = route.href === current;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={`rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800 ${
              isActive ? "bg-zinc-800" : ""
            }`}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}

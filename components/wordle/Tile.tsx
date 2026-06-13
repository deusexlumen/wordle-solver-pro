// # BUXE_OS v24.X -- TILE

import { cn } from "@/lib/utils";
import { TileState } from "@/lib/solver";

interface TileProps {
  state: TileState | "";
  letter: string;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "w-8 h-8 text-lg",
  md: "w-12 h-12 text-2xl",
};

export function Tile({ state, letter, size = "md" }: TileProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center font-bold uppercase rounded border-2",
        sizeClasses[size],
        state === "green" && "bg-green-600 border-green-600 text-white",
        state === "yellow" && "bg-yellow-500 border-yellow-500 text-white",
        state === "gray" && "bg-zinc-700 border-zinc-700 text-white",
        state === "" && "bg-transparent border-zinc-600 text-zinc-200"
      )}
    >
      {letter}
    </div>
  );
}

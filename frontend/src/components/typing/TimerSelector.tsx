const DURATIONS = [15, 30, 60, 120] as const;

interface TimerSelectorProps {
  selected: number;
  isActive: boolean;
  onSelect: (duration: number) => void;
}

export function TimerSelector({ selected, isActive, onSelect }: TimerSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {DURATIONS.map((d) => (
        <button
          key={d}
          onClick={() => onSelect(d)}
          disabled={isActive}
          className={`text-sm px-3 py-1.5 min-h-[36px] rounded transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#c4a882]/50 ${
            d === selected
              ? "text-[#c4a882] bg-[#c4a882]/10"
              : isActive
                ? "text-zinc-700 !cursor-not-allowed"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-[#1a1a1a]"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {d}
        </button>
      ))}
    </div>
  );
}

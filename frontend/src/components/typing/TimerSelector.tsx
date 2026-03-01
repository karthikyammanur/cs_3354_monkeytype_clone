const DURATIONS = [15, 30, 60, 120] as const;

interface TimerSelectorProps {
  selected: number;
  isActive: boolean;
  onSelect: (duration: number) => void;
}

export function TimerSelector({ selected, isActive, onSelect }: TimerSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      {DURATIONS.map((d) => (
        <button
          key={d}
          onClick={() => onSelect(d)}
          disabled={isActive}
          className={`text-sm px-3 py-1 rounded transition-colors ${
            d === selected
              ? "text-amber-400 bg-amber-400/10"
              : isActive
                ? "text-zinc-700 cursor-not-allowed"
                : "text-zinc-500 hover:text-zinc-300"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {d}
        </button>
      ))}
    </div>
  );
}

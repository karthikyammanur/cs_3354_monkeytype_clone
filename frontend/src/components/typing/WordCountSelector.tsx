const WORD_COUNTS = [10, 25, 50, 100] as const;

interface WordCountSelectorProps {
  selected: number;
  isActive: boolean;
  onSelect: (count: number) => void;
}

export function WordCountSelector({ selected, isActive, onSelect }: WordCountSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {WORD_COUNTS.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`text-sm px-3 py-1.5 min-h-[36px] rounded transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/50 ${
            c === selected
              ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
              : isActive
                ? "text-[var(--color-muted)] hover:text-[var(--color-secondary-text)] hover:bg-[var(--color-surface)]"
                : "text-[var(--color-secondary-text)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

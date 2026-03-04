import type { TestMode } from "../../hooks/useTypingTest.ts";

const MODES: { value: TestMode; label: string }[] = [
  { value: "time", label: "time" },
  { value: "words", label: "words" },
  { value: "sentences", label: "sentences" },
];

interface ModeSelectorProps {
  selected: TestMode;
  isActive: boolean;
  onSelect: (mode: TestMode) => void;
}

export function ModeSelector({ selected, isActive, onSelect }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-[var(--color-surface)] p-1">
      {MODES.map((m) => (
        <button
          key={m.value}
          onClick={() => onSelect(m.value)}
          disabled={isActive}
          className={`text-xs px-3 py-1 rounded transition-colors cursor-pointer focus:outline-none ${
            m.value === selected
              ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
              : isActive
                ? "text-[var(--color-muted)] !cursor-not-allowed"
                : "text-[var(--color-secondary-text)] hover:text-[var(--color-text)]"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

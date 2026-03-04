import type { TestMode } from "../../hooks/useTypingTest.ts";

interface TimerProps {
  timeRemaining: number;
  elapsedTime: number;
  isActive: boolean;
  isFinished: boolean;
  liveWpm: number;
  testMode: TestMode;
}

export function Timer({ timeRemaining, elapsedTime, isActive, isFinished, liveWpm, testMode }: TimerProps) {
  const isCountUp = testMode === "words";
  const displayTime = isCountUp ? elapsedTime : timeRemaining;
  const isLow = !isCountUp && isActive && timeRemaining <= 5;

  return (
    <div className="flex items-baseline gap-3">
      <div
        className={`text-3xl font-semibold tabular-nums transition-colors duration-300 ${
          isFinished
            ? "text-[var(--color-muted)]"
            : isLow
              ? "text-red-400"
              : isActive
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-secondary-text)]"
        }`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {displayTime}
      </div>
      {isActive && (
        <span
          className="text-sm tabular-nums text-[var(--color-secondary-text)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {liveWpm} wpm
        </span>
      )}
    </div>
  );
}

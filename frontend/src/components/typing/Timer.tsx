interface TimerProps {
  timeRemaining: number;
  isActive: boolean;
  isFinished: boolean;
}

export function Timer({ timeRemaining, isActive, isFinished }: TimerProps) {
  const isLow = isActive && timeRemaining <= 5;

  return (
    <div
      className={`text-3xl font-semibold tabular-nums transition-colors ${
        isFinished
          ? "text-zinc-600"
          : isLow
            ? "text-amber-400"
            : isActive
              ? "text-amber-400"
              : "text-zinc-500"
      }`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {timeRemaining}
    </div>
  );
}

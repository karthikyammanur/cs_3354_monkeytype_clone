interface TimerProps {
  timeRemaining: number;
  isActive: boolean;
  isFinished: boolean;
}

export function Timer({ timeRemaining, isActive, isFinished }: TimerProps) {
  const isLow = isActive && timeRemaining <= 5;

  return (
    <div
      className={`text-3xl font-semibold tabular-nums transition-colors duration-300 ${
        isFinished
          ? "text-zinc-600"
          : isLow
            ? "text-red-400"
            : isActive
              ? "text-[#c4a882]"
              : "text-zinc-500"
      }`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {timeRemaining}
    </div>
  );
}

interface TimerProps {
  timeRemaining: number;
  isActive: boolean;
  isFinished: boolean;
  liveWpm: number;
}

export function Timer({ timeRemaining, isActive, isFinished, liveWpm }: TimerProps) {
  const isLow = isActive && timeRemaining <= 5;

  return (
    <div className="flex items-baseline gap-3">
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
      {isActive && (
        <span
          className="text-sm tabular-nums text-zinc-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {liveWpm} wpm
        </span>
      )}
    </div>
  );
}

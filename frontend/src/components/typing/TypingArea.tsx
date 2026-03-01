import { useRef, useEffect, useMemo } from "react";

type CharStatus = "correct" | "incorrect" | "pending";

interface TypingAreaProps {
  currentText: string;
  currentIndex: number;
  charStatuses: CharStatus[];
  isActive: boolean;
  isFinished: boolean;
}

const CHARS_PER_LINE = 65;
const VISIBLE_LINES = 3;
const LINE_HEIGHT = 40;

export function TypingArea({ currentText, currentIndex, charStatuses, isActive, isFinished }: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLine = useMemo(() => Math.floor(currentIndex / CHARS_PER_LINE), [currentIndex]);

  const scrollOffset = useMemo(() => {
    const targetLine = Math.max(0, currentLine - 1);
    return targetLine * LINE_HEIGHT;
  }, [currentLine]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: scrollOffset, behavior: "smooth" });
    }
  }, [scrollOffset]);

  if (!currentText) {
    return (
      <div className="flex items-center justify-center h-32">
        <span className="text-zinc-600 text-lg" style={{ fontFamily: "var(--font-mono)" }}>Loading...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "1.35rem",
        lineHeight: `${LINE_HEIGHT}px`,
        height: `${VISIBLE_LINES * LINE_HEIGHT}px`,
      }}
    >
      <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
        {currentText.split("").map((char, i) => {
          const status = charStatuses[i] ?? "pending";
          const isCursor = i === currentIndex && !isFinished;

          let colorClass = "text-zinc-600";
          let bgClass = "";
          if (status === "correct") colorClass = "text-emerald-400";
          if (status === "incorrect") {
            colorClass = "text-red-400";
            bgClass = "bg-red-400/15";
          }

          return (
            <span
              key={i}
              className={`${colorClass} ${bgClass} ${
                isCursor
                  ? isActive
                    ? "border-l-2 border-amber-400"
                    : "border-l-2 border-amber-400 animate-pulse"
                  : ""
              }`}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}

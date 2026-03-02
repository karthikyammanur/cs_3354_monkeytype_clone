import { useRef, useEffect } from "react";

type CharStatus = "correct" | "incorrect" | "pending";

interface TypingAreaProps {
  currentText: string;
  currentIndex: number;
  charStatuses: CharStatus[];
  isActive: boolean;
  isFinished: boolean;
}

const VISIBLE_LINES = 3;
const LINE_HEIGHT_DESKTOP = 40;
const LINE_HEIGHT_MOBILE = 34;

function getLineHeight() {
  return typeof window !== "undefined" && window.innerWidth < 768
    ? LINE_HEIGHT_MOBILE
    : LINE_HEIGHT_DESKTOP;
}

export function TypingArea({ currentText, currentIndex, charStatuses, isActive, isFinished }: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!cursorRef.current || !containerRef.current) return;
    const lh = getLineHeight();
    const cursorTop = cursorRef.current.offsetTop;
    const containerScroll = containerRef.current.scrollTop;
    const visibleBottom = containerScroll + lh * VISIBLE_LINES;

    if (cursorTop >= visibleBottom - lh || cursorTop < containerScroll) {
      containerRef.current.scrollTo({ top: Math.max(0, cursorTop - lh), behavior: "smooth" });
    }
  }, [currentIndex]);

  if (!currentText) return null;

  const lh = getLineHeight();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: isMobile ? "1.1rem" : "1.35rem",
        lineHeight: `${lh}px`,
        height: `${VISIBLE_LINES * lh}px`,
      }}
    >
      <div style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
        {currentText.split("").map((char, i) => {
          const status = charStatuses[i] ?? "pending";
          const isCursor = i === currentIndex && !isFinished;

          let colorClass = "text-zinc-600";
          let bgClass = "";
          if (status === "correct") colorClass = "text-[#c4a882]";
          if (status === "incorrect") {
            colorClass = "text-red-400";
            bgClass = "bg-red-400/15";
          }

          return (
            <span
              key={i}
              ref={isCursor ? cursorRef : undefined}
              className={`${colorClass} ${bgClass} ${
                isCursor
                  ? isActive
                    ? "border-l-2 border-[#c4a882]"
                    : "border-l-2 border-[#c4a882] animate-pulse"
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

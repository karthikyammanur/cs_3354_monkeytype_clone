import { Link } from "react-router-dom";
import type { TestMode } from "../../hooks/useTypingTest.ts";

export type SaveStatus = "idle" | "saving" | "saved" | "error" | "guest";

interface ResultsProps {
  wpm: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
  duration: number;
  elapsedTime: number;
  testMode: TestMode;
  wordCount: number;
  saveStatus: SaveStatus;
  onRestart: () => void;
  onLogin: () => void;
}

export function Results({ wpm, accuracy, totalChars, correctChars, duration, elapsedTime, testMode, wordCount, saveStatus, onRestart, onLogin }: ResultsProps) {
  const timeLabel = testMode === "words" ? `${elapsedTime}s` : `${duration}s`;
  const modeLabel = testMode === "words" ? `words: ${wordCount}` : testMode === "sentences" ? "sentences" : null;

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-12">
        <div className="flex flex-col items-center">
          <span className="text-[var(--color-secondary-text)] text-sm uppercase tracking-wider mb-1">wpm</span>
          <span
            className="text-5xl sm:text-6xl font-semibold text-[var(--color-primary)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {wpm}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[var(--color-secondary-text)] text-sm uppercase tracking-wider mb-1">accuracy</span>
          <span
            className="text-3xl sm:text-4xl font-semibold text-[var(--color-accent)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {accuracy}%
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-[var(--color-secondary-text)]" style={{ fontFamily: "var(--font-mono)" }}>
        <span>characters: <span className="text-[var(--color-text)]">{correctChars}</span>/{totalChars}</span>
        <span>time: <span className="text-[var(--color-text)]">{timeLabel}</span></span>
        {modeLabel && <span>mode: <span className="text-[var(--color-text)]">{modeLabel}</span></span>}
      </div>

      <div className="h-5 flex items-center">
        {saveStatus === "saving" && (
          <p className="text-xs text-[var(--color-secondary-text)] animate-pulse">saving...</p>
        )}
        {saveStatus === "saved" && (
          <p className="text-xs text-[var(--color-accent)]">result saved</p>
        )}
        {saveStatus === "error" && (
          <p className="text-xs text-red-400">failed to save result</p>
        )}
        {saveStatus === "guest" && (
          <p className="text-xs text-[var(--color-muted)]">
            <button onClick={onLogin} className="text-[var(--color-secondary-text)] hover:text-[var(--color-text)] underline underline-offset-2 transition-colors cursor-pointer">
              sign in
            </button>
            {" "}to save your results
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4">
        <button
          onClick={onRestart}
          className="px-6 py-2 rounded text-sm text-[var(--color-text)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-active)] transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-border)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          restart
        </button>
        {saveStatus === "saved" && (
          <Link
            to="/profile"
            className="px-6 py-2 rounded text-sm text-[var(--color-secondary-text)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            view profile
          </Link>
        )}
      </div>

      <p className="text-xs text-[var(--color-muted)]">
        or press <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-secondary-text)]">tab</kbd> to restart
      </p>
    </div>
  );
}

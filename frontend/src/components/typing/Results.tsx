import { Link } from "react-router-dom";

export type SaveStatus = "idle" | "saving" | "saved" | "error" | "guest";

interface ResultsProps {
  wpm: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
  duration: number;
  saveStatus: SaveStatus;
  onRestart: () => void;
  onLogin: () => void;
}

export function Results({ wpm, accuracy, totalChars, correctChars, duration, saveStatus, onRestart, onLogin }: ResultsProps) {
  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-12">
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 text-sm uppercase tracking-wider mb-1">wpm</span>
          <span
            className="text-5xl sm:text-6xl font-semibold text-[#c4a882]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {wpm}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 text-sm uppercase tracking-wider mb-1">accuracy</span>
          <span
            className="text-3xl sm:text-4xl font-semibold text-[#d4a574]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {accuracy}%
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-zinc-500" style={{ fontFamily: "var(--font-mono)" }}>
        <span>characters: <span className="text-zinc-300">{correctChars}</span>/{totalChars}</span>
        <span>time: <span className="text-zinc-300">{duration}s</span></span>
      </div>

      <div className="h-5 flex items-center">
        {saveStatus === "saving" && (
          <p className="text-xs text-zinc-500 animate-pulse">saving...</p>
        )}
        {saveStatus === "saved" && (
          <p className="text-xs text-[#d4a574]">result saved</p>
        )}
        {saveStatus === "error" && (
          <p className="text-xs text-red-400">failed to save result</p>
        )}
        {saveStatus === "guest" && (
          <p className="text-xs text-zinc-600">
            <button onClick={onLogin} className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition-colors cursor-pointer">
              sign in
            </button>
            {" "}to save your results
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4">
        <button
          onClick={onRestart}
          className="px-6 py-2 rounded text-sm text-zinc-300 bg-[#1a1a1a] hover:bg-[#252525] active:bg-[#2a2a2a] transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2a2520]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          restart
        </button>
        {saveStatus === "saved" && (
          <Link
            to="/profile"
            className="px-6 py-2 rounded text-sm text-zinc-400 border border-[#2a2520] hover:border-[#3d362e] hover:text-zinc-200 transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            view profile
          </Link>
        )}
      </div>

      <p className="text-xs text-zinc-700">
        or press <kbd className="px-1.5 py-0.5 rounded bg-[#1a1a1a] text-zinc-400">tab</kbd> to restart
      </p>
    </div>
  );
}

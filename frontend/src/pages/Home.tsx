import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { useApiClient } from "../api/client.ts";
import { useTypingTest } from "../hooks/useTypingTest.ts";
import { TimerSelector } from "../components/typing/TimerSelector.tsx";
import { Timer } from "../components/typing/Timer.tsx";
import { TypingArea } from "../components/typing/TypingArea.tsx";
import { Results, type SaveStatus } from "../components/typing/Results.tsx";
import { FocusOverlay } from "../components/typing/FocusOverlay.tsx";

export function Home() {
  const {
    currentText,
    currentIndex,
    isActive,
    isFinished,
    duration,
    timeRemaining,
    wpm,
    accuracy,
    totalChars,
    correctChars,
    charStatuses,
    isLoading,
    error,
    liveWpm,
    restart,
    setDuration,
    handleKeyPress,
  } = useTypingTest();

  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const api = useApiClient();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const savedRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.restart) {
      savedRef.current = false;
      setSaveStatus("idle");
      restart();
    }
  }, [location.state?.restart]);

  useEffect(() => {
    if (!isFinished || savedRef.current) return;

    if (!isAuthenticated) {
      setSaveStatus("guest");
      return;
    }

    savedRef.current = true;
    setSaveStatus("saving");
    api.post("/tests", { wpm, accuracy, duration, totalChars, correctChars })
      .then(() => setSaveStatus("saved"))
      .catch(() => setSaveStatus("error"));
  }, [isFinished, isAuthenticated, api, wpm, accuracy, duration, totalChars, correctChars]);

  const handleRestart = useCallback(() => {
    savedRef.current = false;
    setSaveStatus("idle");
    restart();
  }, [restart]);

  const handleDurationChange = useCallback((seconds: number) => {
    if (isActive) {
      savedRef.current = false;
      setSaveStatus("idle");
    }
    setDuration(seconds);
  }, [isActive, setDuration]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "BUTTON" || tag === "A" || tag === "TEXTAREA") return;

      if (e.key === "Tab") {
        e.preventDefault();
        handleRestart();
        return;
      }

      if (isFinished) return;

      if (e.key === " ") e.preventDefault();

      if (e.key === "Backspace") {
        e.preventDefault();
        handleKeyPress("Backspace");
        return;
      }

      if (e.key.length === 1) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFinished, handleKeyPress, handleRestart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <FocusOverlay isActive={isActive} />
      {isFinished ? (
        <Results
          wpm={wpm}
          accuracy={accuracy}
          totalChars={totalChars}
          correctChars={correctChars}
          duration={duration}
          saveStatus={saveStatus}
          onRestart={handleRestart}
          onLogin={() => loginWithRedirect()}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <TimerSelector selected={duration} isActive={isActive} onSelect={handleDurationChange} />
            <Timer timeRemaining={timeRemaining} isActive={isActive} isFinished={isFinished} liveWpm={liveWpm} />
          </div>

          <div className="w-full max-w-3xl">
            {isLoading ? (
              <div className="flex items-center justify-center h-[120px]">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#2a2520] animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-[120px] gap-3">
                <p className="text-red-400/80 text-sm" style={{ fontFamily: "var(--font-mono)" }}>{error}</p>
                <button
                  onClick={restart}
                  className="text-sm px-4 py-1.5 rounded bg-[#1a1a1a] text-zinc-300 hover:bg-[#252525] transition-colors cursor-pointer"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  retry
                </button>
              </div>
            ) : (
              <TypingArea
                currentText={currentText}
                currentIndex={currentIndex}
                charStatuses={charStatuses}
                isActive={isActive}
                isFinished={isFinished}
              />
            )}
          </div>

          {!isActive && !isLoading && !error && (
            <p className="text-zinc-600 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              start typing to begin
            </p>
          )}
        </>
      )}
    </div>
  );
}

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { useApiClient } from "../api/client.ts";
import { useTypingTest } from "../hooks/useTypingTest.ts";
import { useSound } from "../hooks/useSound.ts";
import { ModeSelector } from "../components/typing/ModeSelector.tsx";
import { TimerSelector } from "../components/typing/TimerSelector.tsx";
import { WordCountSelector } from "../components/typing/WordCountSelector.tsx";
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
    elapsedTime,
    wpm,
    accuracy,
    totalChars,
    correctChars,
    charStatuses,
    isLoading,
    error,
    liveWpm,
    testMode,
    wordCount,
    restart,
    setDuration,
    setTestMode,
    setWordCount,
    handleKeyPress,
  } = useTypingTest();

  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const api = useApiClient();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const savedRef = useRef(false);
  const location = useLocation();
  const { playClick, playError, playComplete } = useSound();

  useEffect(() => {
    if (location.state?.restart) {
      savedRef.current = false;
      setSaveStatus("idle");
      restart();
    }
  }, [location.state?.restart]);

  const saveDuration = testMode === "words" ? elapsedTime : duration;

  useEffect(() => {
    if (!isFinished || savedRef.current) return;

    playComplete();

    if (!isAuthenticated) {
      setSaveStatus("guest");
      return;
    }

    savedRef.current = true;
    setSaveStatus("saving");

    const clampedDuration = Math.min(Math.max(saveDuration, 1), 32767);
    api.post("/tests", { wpm, accuracy, duration: clampedDuration, totalChars, correctChars })
      .then(() => setSaveStatus("saved"))
      .catch(() => setSaveStatus("error"));
  }, [isFinished, isAuthenticated, api, wpm, accuracy, saveDuration, totalChars, correctChars, playComplete]);

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

  const handleWordCountChange = useCallback((count: number) => {
    if (isActive) {
      savedRef.current = false;
      setSaveStatus("idle");
    }
    setWordCount(count);
  }, [isActive, setWordCount]);

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
        const charIndex = currentIndex;
        const expected = currentText[charIndex];
        if (expected !== undefined) {
          if (e.key === expected) {
            playClick();
          } else {
            playError();
          }
        }
        handleKeyPress(e.key);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFinished, handleKeyPress, handleRestart, currentIndex, currentText, playClick, playError]);

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
          elapsedTime={elapsedTime}
          testMode={testMode}
          wordCount={wordCount}
          saveStatus={saveStatus}
          onRestart={handleRestart}
          onLogin={() => loginWithRedirect()}
        />
      ) : (
        <>
          <div className="flex flex-col items-center gap-3">
            <ModeSelector selected={testMode} isActive={isActive} onSelect={setTestMode} />
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {testMode === "words" ? (
                <WordCountSelector selected={wordCount} isActive={isActive} onSelect={handleWordCountChange} />
              ) : (
                <TimerSelector selected={duration} isActive={isActive} onSelect={handleDurationChange} />
              )}
              <Timer
                timeRemaining={timeRemaining}
                elapsedTime={elapsedTime}
                isActive={isActive}
                isFinished={isFinished}
                liveWpm={liveWpm}
                testMode={testMode}
              />
            </div>
          </div>

          <div className="w-full max-w-3xl">
            {isLoading ? (
              <div className="flex items-center justify-center h-[120px]">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[var(--color-border)] animate-pulse"
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
                  className="text-sm px-4 py-1.5 rounded bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
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
            <p className="text-[var(--color-muted)] text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              start typing to begin
            </p>
          )}
        </>
      )}
    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useApiClient } from "../api/client.ts";
import { useTypingTest } from "../hooks/useTypingTest.ts";
import { TimerSelector } from "../components/typing/TimerSelector.tsx";
import { Timer } from "../components/typing/Timer.tsx";
import { TypingArea } from "../components/typing/TypingArea.tsx";
import { Results, type SaveStatus } from "../components/typing/Results.tsx";

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
    restart,
    setDuration,
    handleKeyPress,
  } = useTypingTest();

  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const api = useApiClient();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const savedRef = useRef(false);

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

  const handleRestart = () => {
    savedRef.current = false;
    setSaveStatus("idle");
    restart();
  };

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
          <div className="flex items-center gap-6">
            <TimerSelector selected={duration} isActive={isActive} onSelect={setDuration} />
            <Timer timeRemaining={timeRemaining} isActive={isActive} isFinished={isFinished} />
          </div>

          <div className="w-full max-w-3xl">
            <TypingArea
              currentText={currentText}
              currentIndex={currentIndex}
              charStatuses={charStatuses}
              isActive={isActive}
              isFinished={isFinished}
            />
          </div>

          {!isActive && (
            <p className="text-zinc-600 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              start typing to begin
            </p>
          )}
        </>
      )}
    </div>
  );
}

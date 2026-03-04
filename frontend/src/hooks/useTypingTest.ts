import { useState, useCallback, useEffect, useRef } from "react";
import { publicFetch } from "../api/client.ts";
import { calculateWPM, calculateAccuracy } from "../utils/scoring.ts";

type CharStatus = "correct" | "incorrect" | "pending";
export type TestMode = "time" | "words" | "sentences";

interface WordsResponse {
  words: string[];
}

interface SentencesResponse {
  sentences: string[];
}

export function useTypingTest() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [duration, setDurationState] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [charStatuses, setCharStatuses] = useState<CharStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liveWpm, setLiveWpm] = useState(0);
  const [testMode, setTestModeState] = useState<TestMode>("time");
  const [wordCount, setWordCountState] = useState(25);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isActiveRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const correctCharsRef = useRef(0);
  const testModeRef = useRef<TestMode>("time");

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchContent = useCallback(async (mode: TestMode, wc: number) => {
    setIsLoading(true);
    setError(null);
    try {
      let text: string;
      if (mode === "sentences") {
        const data = await publicFetch<SentencesResponse>("/sentences?count=10");
        text = data.sentences.join(" ");
      } else if (mode === "words") {
        const data = await publicFetch<WordsResponse>(`/words?count=${wc}`);
        text = data.words.join(" ");
      } else {
        const data = await publicFetch<WordsResponse>("/words?count=200");
        text = data.words.join(" ");
      }
      setCurrentText(text);
      setCharStatuses(new Array(text.length).fill("pending"));
    } catch (e) {
      setError((e as Error).message || "Failed to load content");
      setCurrentText("");
      setCharStatuses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent(testMode, wordCount);
  }, []);

  const endTest = useCallback((elapsedOverride?: number) => {
    clearTimer();
    setIsActive(false);
    isActiveRef.current = false;
    setIsFinished(true);

    const mode = testModeRef.current;
    const elapsed = elapsedOverride ?? (mode === "words"
      ? Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
      : duration);

    setElapsedTime(elapsed);

    setTotalChars((prevTotal) => {
      setCorrectChars((prevCorrect) => {
        setWpm(calculateWPM(prevCorrect, elapsed));
        setAccuracy(calculateAccuracy(prevCorrect, prevTotal));
        return prevCorrect;
      });
      return prevTotal;
    });
  }, [duration, clearTimer]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed > 0) {
        setLiveWpm(Math.round((correctCharsRef.current / 5) / (elapsed / 60)));
      }

      if (testModeRef.current === "words") {
        setElapsedTime(Math.round(elapsed));
      } else {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
  }, [endTest]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === "Backspace") {
      setCurrentIndex((prev) => {
        if (prev <= 0) return 0;
        const newIndex = prev - 1;
        setCharStatuses((statuses) => {
          const updated = [...statuses];
          if (updated[newIndex] === "correct") {
            setCorrectChars((c) => {
              correctCharsRef.current = c - 1;
              return c - 1;
            });
          }
          if (updated[newIndex] !== "pending") {
            setTotalChars((t) => t - 1);
          }
          updated[newIndex] = "pending";
          return updated;
        });
        return newIndex;
      });
      return;
    }

    setCurrentIndex((prev) => {
      setCurrentText((text) => {
        if (prev >= text.length) return text;

        if (!isActiveRef.current) {
          setIsActive(true);
          isActiveRef.current = true;
          startTimer();
        }

        const isCorrect = key === text[prev];
        setCharStatuses((statuses) => {
          const updated = [...statuses];
          updated[prev] = isCorrect ? "correct" : "incorrect";
          return updated;
        });
        setTotalChars((t) => t + 1);
        if (isCorrect) {
          setCorrectChars((c) => {
            correctCharsRef.current = c + 1;
            return c + 1;
          });
        }

        if (prev + 1 >= text.length) {
          const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
          setTimeout(() => endTest(elapsed), 0);
        }

        return text;
      });
      return prev + 1;
    });
  }, [startTimer, endTest]);

  const resetState = useCallback(() => {
    clearTimer();
    setCurrentIndex(0);
    setIsActive(false);
    isActiveRef.current = false;
    setIsFinished(false);
    setWpm(0);
    setAccuracy(0);
    setTotalChars(0);
    setCorrectChars(0);
    setLiveWpm(0);
    setElapsedTime(0);
    correctCharsRef.current = 0;
    startTimeRef.current = 0;
  }, [clearTimer]);

  const restart = useCallback(() => {
    resetState();
    setTimeRemaining(duration);
    fetchContent(testModeRef.current, wordCount);
  }, [duration, wordCount, fetchContent, resetState]);

  const setDuration = useCallback((seconds: number) => {
    const wasActive = isActiveRef.current;
    setDurationState(seconds);
    setTimeRemaining(seconds);
    if (wasActive) {
      resetState();
      setTimeRemaining(seconds);
      fetchContent(testModeRef.current, wordCount);
    }
  }, [resetState, fetchContent, wordCount]);

  const setTestMode = useCallback((mode: TestMode) => {
    if (isActiveRef.current) return;
    testModeRef.current = mode;
    setTestModeState(mode);
    resetState();
    if (mode === "words") {
      setTimeRemaining(0);
    } else {
      setTimeRemaining(duration);
    }
    fetchContent(mode, wordCount);
  }, [resetState, fetchContent, wordCount, duration]);

  const setWordCount = useCallback((count: number) => {
    const wasActive = isActiveRef.current;
    setWordCountState(count);
    if (wasActive) {
      resetState();
    }
    fetchContent("words", count);
  }, [resetState, fetchContent]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
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
  };
}

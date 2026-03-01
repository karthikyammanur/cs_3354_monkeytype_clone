import { useState, useCallback, useEffect, useRef } from "react";
import { publicFetch } from "../api/client.ts";
import { calculateWPM, calculateAccuracy } from "../utils/scoring.ts";

type CharStatus = "correct" | "incorrect" | "pending";

interface WordsResponse {
  words: string[];
}

export function useTypingTest() {
  const [words, setWords] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [typed, setTyped] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [duration, setDurationState] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [charStatuses, setCharStatuses] = useState<CharStatus[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isActiveRef = useRef(false);

  const fetchWords = useCallback(async () => {
    try {
      const data = await publicFetch<WordsResponse>("/words?count=200");
      const text = data.words.join(" ");
      setWords(data.words);
      setCurrentText(text);
      setCharStatuses(new Array(text.length).fill("pending"));
    } catch (e) {
      console.error("Failed to fetch words:", e);
    }
  }, []);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const endTest = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    isActiveRef.current = false;
    setIsFinished(true);

    setTotalChars((prevTotal) => {
      setCorrectChars((prevCorrect) => {
        setWpm(calculateWPM(prevCorrect, duration));
        setAccuracy(calculateAccuracy(prevCorrect, prevTotal));
        return prevCorrect;
      });
      return prevTotal;
    });
  }, [duration]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          endTest();
          return 0;
        }
        return prev - 1;
      });
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
            setCorrectChars((c) => c - 1);
          }
          if (updated[newIndex] !== "pending") {
            setTotalChars((t) => t - 1);
          }
          updated[newIndex] = "pending";
          return updated;
        });
        setTyped((t) => t.slice(0, -1));
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
        setTyped((t) => t + key);
        setTotalChars((t) => t + 1);
        if (isCorrect) {
          setCorrectChars((c) => c + 1);
        }

        return text;
      });
      return prev + 1;
    });
  }, [startTimer]);

  const restart = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTyped("");
    setCurrentIndex(0);
    setIsActive(false);
    isActiveRef.current = false;
    setIsFinished(false);
    setTimeRemaining(duration);
    setWpm(0);
    setAccuracy(0);
    setTotalChars(0);
    setCorrectChars(0);
    fetchWords();
  }, [duration, fetchWords]);

  const setDuration = useCallback((seconds: number) => {
    if (isActiveRef.current) return;
    setDurationState(seconds);
    setTimeRemaining(seconds);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    words,
    currentText,
    typed,
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
  };
}
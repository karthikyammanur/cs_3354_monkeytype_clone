// Typing test result state
import { create } from "zustand";
import type { TestResult } from "../types/index.ts";

interface TestState {
  recentResult: TestResult | null;
  setRecentResult: (result: TestResult) => void;
  clearResult: () => void;
}

export const useTestStore = create<TestState>((set) => ({
  recentResult: null,
  setRecentResult: (result) => set({ recentResult: result }),
  clearResult: () => set({ recentResult: null }),
}));

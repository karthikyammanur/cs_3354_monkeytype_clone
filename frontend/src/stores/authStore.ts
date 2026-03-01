// Local user state from our database
import { create } from "zustand";
import type { User } from "../types/index.ts";

interface AuthState {
  user: User | null;
  isProfileLoaded: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isProfileLoaded: false,
  setUser: (user) => set({ user, isProfileLoaded: true }),
  clearUser: () => set({ user: null, isProfileLoaded: false }),
}));

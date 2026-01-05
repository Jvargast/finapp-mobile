import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setHasSeenOnboarding: (value: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  hasSeenOnboarding: false,
  setAuthenticated: (val) => set({ isAuthenticated: val }),
  setLoading: (val) => set({ isLoading: val }),
  setHasSeenOnboarding: (val) => set({ hasSeenOnboarding: val }),
  reset: () => set({ isAuthenticated: false, isLoading: false }),
}));

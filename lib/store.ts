import { create } from 'zustand';

/**
 * Scroll progress of the hero experience (0..1).
 * Kept as a mutable ref so the R3F render loop can read it
 * every frame without triggering React renders.
 */
export const experienceProgress = { value: 0 };

interface UIState {
  loaded: boolean;
  setLoaded: (v: boolean) => void;
}

export const useUI = create<UIState>()((set) => ({
  loaded: false,
  setLoaded: (v) => set({ loaded: v }),
}));

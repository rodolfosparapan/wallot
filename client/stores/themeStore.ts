import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: __DEV__ ? 'dark' : 'system',
  setMode: (mode) => set({ mode }),
}));

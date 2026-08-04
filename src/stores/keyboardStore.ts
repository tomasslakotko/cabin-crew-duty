import { create } from 'zustand';

interface KeyboardState {
  /** Current in-app keyboard height in px (0 when closed) */
  height: number;
  setHeight: (height: number) => void;
}

export const useKeyboardStore = create<KeyboardState>((set) => ({
  height: 0,
  setHeight: (height) => set({ height }),
}));

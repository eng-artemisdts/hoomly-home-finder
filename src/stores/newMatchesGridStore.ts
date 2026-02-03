import { create } from "zustand";

interface NewMatchesGridState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  finishLoading: () => void;
}

export const useNewMatchesGridStore = create<NewMatchesGridState>((set) => ({
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
  finishLoading: () => set({ isLoading: false }),
}));

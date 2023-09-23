import { create } from 'zustand';

type GameStore = {
  game: Phaser.Game | null;
  isLoading: boolean;
  error: string | null;
  createGame: (game: Phaser.Game) => void;
};

export const useGameStore = create<GameStore>((set) => {
  return {
    game: null,
    isLoading: true,
    error: null,
    createGame: (game) => {
      set({ game, isLoading: false });
    },
  };
});

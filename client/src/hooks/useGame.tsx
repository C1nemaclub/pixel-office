import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import Phaser from 'phaser';

export default function useGame(parentEl: React.RefObject<HTMLDivElement>, config: Phaser.Types.Core.GameConfig) {
  const [game, setGame] = useState<Phaser.Game | null>(null);
  const [gameLoading, setGameLoading] = useState<boolean>(true);
  const createGame = useGameStore((state) => state.createGame);

  useEffect(() => {
    if (parentEl.current && !game) {
      setGameLoading(true);
      const newGame = new Phaser.Game({ ...config, parent: parentEl.current });
      newGame.events.on('progress', (value: number) => {
        if (value === 1) setGameLoading(false);
      });
      setGame(newGame);
      createGame(newGame);
    }

    return () => game?.destroy(true);
  }, [game, parentEl, config]);

  return { game, gameLoading };
}

import { useState, useEffect } from 'react';
import Phaser from 'phaser';

export default function useGame(
  parentEl: React.RefObject<HTMLDivElement>,
  config: Phaser.Types.Core.GameConfig) {
  const [game, setGame] = useState<Phaser.Game | null>(null);
  const [gameLoading, setGameLoading] = useState<boolean>(true);

  useEffect(() => {
    if (parentEl.current && !game) {
      setGameLoading(true);
      const newGame = new Phaser.Game({ ...config, parent: parentEl.current });
      newGame.events.on('progress', (value: number) => {
        if (value === 1) setGameLoading(false);
      });
      setGame(newGame);
    }
    return () => game?.destroy(true);
  }, [game, parentEl, config]);

  return { game, gameLoading };
}

import { useState, useEffect } from 'react';
import Phaser from 'phaser';

export default function useGame( parentEl: React.RefObject<HTMLDivElement>, config: Phaser.Types.Core.GameConfig) {
  const [game, setGame] = useState<Phaser.Game | null>(null);

  useEffect(() => {
    if (parentEl.current && !game) {
      const newGame = new Phaser.Game({ ...config, parent: parentEl.current });
      setGame(newGame);
    }
    return () => game?.destroy(true);
  }, [game, parentEl, config]);

  return game;
}

import { useRef } from 'react';
import { useGame } from '../../hooks';
import { gameConfig } from '../../game';

const Game = () => {
  const parentEl = useRef<HTMLDivElement>(null);
  useGame(parentEl, gameConfig);

  return <div ref={parentEl} className='gameContainer' />;
};

export default Game;

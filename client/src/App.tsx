import { gameConfig } from './game';
import { useRef } from 'react';
import { useGame } from './hooks';
import { Game } from 'phaser';

function App() {
  const parentEl = useRef<HTMLDivElement>(null);
  const game = useGame(parentEl, gameConfig);

  return (
    <div className='App'>
      <h2 className='py-4 px-2 text-slate-50 bg-teal-500 font-bold text-2xl'>
        Pixel Office
      </h2>
      <div ref={parentEl} className='gameContainer' />
    </div>
  );
}

export default App;

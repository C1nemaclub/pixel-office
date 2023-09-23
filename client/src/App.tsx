import { gameConfig } from './game';
import { useRef, useEffect } from 'react';
import { useGame } from './hooks';
import { useRoomStore } from './store/roomStore';
import Game from './components/Game/Game';
import Ui from './components/Ui/Ui';

function App() {
  const parentEl = useRef<HTMLDivElement>(null);
  const { room } = useRoomStore();
  useGame(parentEl, gameConfig);

  useEffect(() => {
    return () => {
      room?.leave();
    };
  }, [room]);

  return (
    <div className='App'>
      <Ui />
      <Game />
    </div>
  );
}

export default App;

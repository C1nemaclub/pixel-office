import { useEffect } from 'react';
import { useRoomStore } from './store/roomStore';
import Game from './components/Game/Game';
import Ui from './components/Ui/Ui';

function App() {
  const { room } = useRoomStore();

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

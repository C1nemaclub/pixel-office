import { useEffect, lazy, Suspense } from 'react';
import { useRoomStore } from './store/roomStore';
import Spinner from './components/core/Spinner';
// import Game from './components/Game/Game';
// import Ui from './components/Ui/Ui';

const Game = lazy(() => import('./components/Game/Game'));
const Ui = lazy(() => import('./components/Ui/Ui'));

function App() {
  const { room } = useRoomStore();

  useEffect(() => {
    return () => {
      room?.leave();
    };
  }, [room]);

  return (
    <div className='App'>
      <Suspense fallback={<Spinner />}>
        <Ui />
        <Game />
      </Suspense>
    </div>
  );
}

export default App;

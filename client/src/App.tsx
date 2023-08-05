import { gameConfig } from './game';
import { useRef, useState } from 'react';
import { useGame } from './hooks';
import useRoom from './hooks/useRoom';
import JoinModal from './components/JoinModal/JoinModal';
import Loader from './components/Loader/Loader';
import MainModal from './components/MainModal/MainModal';
import Chat from './components/Chat/Chat';
import { useRoomStore } from './store/roomStore';

export const MODAL_TYPES = {
  MAIN: 'MAIN',
  JOIN: 'JOIN',
  CREATE: 'CREATE',
  EMPTY: 'EMPTY',
};

function App() {
  const parentEl = useRef<HTMLDivElement>(null);
  // const { joinOrCreate, room, connectionLoading } = useRoom();
  const { joinOrCreate, room, isLoading } = useRoomStore();
  const { game, gameLoading } = useGame(parentEl, gameConfig);
  const [currentModal, setCurrentModal] = useState(MODAL_TYPES.MAIN);

  const handleJoinGame = (selectedChar: number, name: string) => {
    if (game) {
      room?.send('join-game', { selectedChar, name });
      setCurrentModal(MODAL_TYPES.EMPTY);
    }
  };

  return (
    <div className='App'>
      {gameLoading ? (
        <Loader text='Loading Game Assets...' centered />
      ) : (
        <>
          {currentModal === MODAL_TYPES.MAIN && (
            <MainModal
              loading={isLoading}
              onSwitch={() => {
                joinOrCreate(game, () => {
                  setCurrentModal(MODAL_TYPES.JOIN);
                });
              }}
            />
          )}
          {currentModal === MODAL_TYPES.JOIN && (
            <JoinModal onJoin={handleJoinGame} />
          )}
        </>
      )}
      {room && game && <Chat />}
      <div ref={parentEl} className='gameContainer' />
    </div>
  );
}

export default App;

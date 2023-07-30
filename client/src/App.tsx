import { gameConfig } from './game';
import { useRef, useState } from 'react';
import { useGame } from './hooks';
import useRoom from './hooks/useRoom';
import MainModal from './components/SelectionScreen/MainModal/MainModal';
import JoinModal from './components/JoinModal/JoinModal';
import Loader from './components/Loader/Loader';

export const MODAL_TYPES = {
  MAIN: 'MAIN',
  JOIN: 'JOIN',
  CREATE: 'CREATE',
  EMPTY: 'EMPTY',
};

function App() {
  const parentEl = useRef<HTMLDivElement>(null);
  const { joinOrCreate, room, connectionLoading } = useRoom();
  const { game, gameLoading } = useGame(parentEl, gameConfig, room);
  const [currentModal, setCurrentModal] = useState(MODAL_TYPES.MAIN);

  const closeModalAndShow = (modalType: string) => {
    setCurrentModal(modalType);
  };
  
  return (
    <div className='App'>
      {gameLoading ? (
        <Loader text='Loading Game Assets...' centered />
      ) : (
        <>
          {currentModal === MODAL_TYPES.MAIN && (
            <MainModal
              loading={connectionLoading}
              onSwitch={() => {
                joinOrCreate(game, () => {
                  closeModalAndShow(MODAL_TYPES.JOIN);
                });
              }}
            />
          )}
          {currentModal === MODAL_TYPES.JOIN && (
            <JoinModal
              onJoin={(selectedChar, name) => {
                if (game) {
                  room?.send('join-game', { selectedChar, name });
                  closeModalAndShow(MODAL_TYPES.EMPTY);
                }
              }}
            />
          )}
        </>
      )}
      <div ref={parentEl} className='gameContainer' />
    </div>
  );
}

export default App;

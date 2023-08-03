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
  const { joinOrCreate, room, connectionLoading } = useRoom();
  const { joinOrCreate: newJoin, room: newRoom } = useRoomStore()
  const { game, gameLoading } = useGame(parentEl, gameConfig, newRoom);
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
                // joinOrCreate(game, () => {
                //   closeModalAndShow(MODAL_TYPES.JOIN);
                // });
                newJoin(game, ()=>{
                  closeModalAndShow(MODAL_TYPES.JOIN);
                })
              }}
            />
          )}
          {currentModal === MODAL_TYPES.JOIN && (
            <JoinModal
              onJoin={(selectedChar, name) => {
                if (game) {
                  newRoom?.send('join-game', { selectedChar, name });
                  closeModalAndShow(MODAL_TYPES.EMPTY);
                }
              }}
            />
          )}
        </>
      )}
      <Chat />
      <div ref={parentEl} className='gameContainer' />
    </div>
  );
}

export default App;

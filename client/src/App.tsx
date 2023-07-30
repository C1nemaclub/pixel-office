import { gameConfig } from './game';
import { useRef, useEffect, useState } from 'react';
import { useGame } from './hooks';
import { client } from './colyseus';
import { Room, RoomAvailable } from 'colyseus.js';
import { Player } from './models/Player.model';
import useRoom from './hooks/useRoom';
import MainModal from './components/SelectionScreen/MainModal/MainModal';
import JoinModal from './components/JoinModal/JoinModal';
// import { Background } from './game/scenes';
import { Background } from './game/scenes/Background';

export const MODAL_TYPES = {
  MAIN: 'MAIN',
  JOIN: 'JOIN',
  CREATE: 'CREATE',
  EMPTY: 'EMPTY',
};

function App() {
  const parentEl = useRef<HTMLDivElement>(null);
  const { joinOrCreate, availableRooms, room } = useRoom();
  const { game } = useGame(parentEl, gameConfig, room);
  const [currentModal, setCurrentModal] = useState(MODAL_TYPES.MAIN);

  const closeModalAndShow = (modalType: string) => {
    setCurrentModal(modalType);
  };

  return (
    <div className='App'>
      {currentModal === MODAL_TYPES.MAIN && (
        <MainModal
          onSwitch={() => {
            joinOrCreate();
            const backgroundScene = game?.scene.keys.background as Background;
            backgroundScene.launchOffice()
            closeModalAndShow(MODAL_TYPES.JOIN);
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
          onReturn={closeModalAndShow}
        />
      )}
      <div ref={parentEl} className='gameContainer' />
    </div>
  );
}

export default App;

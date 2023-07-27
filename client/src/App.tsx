import { gameConfig } from './game';
import { useRef, useEffect, useState } from 'react';
import { useGame } from './hooks';
import { client } from './colyseus';
import { Room, RoomAvailable } from 'colyseus.js';
import { Player } from './models/Player.model';
import SelectionScreen from './components/SelectionScreen/SelectionScreen';
import useRoom from './hooks/useRoom';
import MainModal from './components/SelectionScreen/MainModal/MainModal';

const MODAL_TYPES = {
  MAIN: 'MAIN',
  JOIN: 'JOIN',
  CREATE: 'CREATE',
};

function App() {
  const parentEl = useRef<HTMLDivElement>(null);
  const { joinOrCreate, availableRooms, setName, name, room } = useRoom();
  const { game } = useGame(parentEl, gameConfig, room);
  const [currentModal, setCurrentModal] = useState(MODAL_TYPES.MAIN);

  const closeModalAndShow = (modalType) => {
    setCurrentModal(modalType);
  };

  return (
    <div className='App'>
      <SelectionScreen setName={setName} name={name} />
      {currentModal === MODAL_TYPES.MAIN && (
        <MainModal
          onJoin={() => closeModalAndShow(MODAL_TYPES.JOIN)}
          onCreate={() => closeModalAndShow(MODAL_TYPES.CREATE)}
        />
      )}
      <button
        onClick={joinOrCreate}
        className='px-4 py-2 bg-teal-500 text-slate-50 hover:bg-teal-600'
      >
        Enter Room
      </button>
      <button
        onClick={() => {
          room?.send('join-game');
        }}
      >
        Join
      </button>
      <div ref={parentEl} className='gameContainer' />
    </div>
  );
}

export default App;

import { gameConfig } from './game';
import { useRef, useState, useEffect } from 'react';
import { useGame } from './hooks';
// import useRoom from './hooks/useRoom';
import JoinModal from './components/JoinModal/JoinModal';
import Loader from './components/Loader/Loader';
import MainModal from './components/MainModal/MainModal';
import Chat from './components/Chat/Chat';
import { useRoomStore } from './store/roomStore';
import Socials from './components/Socials/Socials';
import { CallManager } from './calls/CallManager';
import { Player } from './models/Player.model';
import useStream from './hooks/useStream';
import useCallManager from './hooks/useCallManager';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, handleUserMedia, audioDevices, changeAudioSource } = useStream(videoRef);
  useCallManager(stream);

  const handleJoinGame = (selectedChar: number, name: string) => {
    if (game) {
      room?.send('join-game', { selectedChar, name });
      setCurrentModal(MODAL_TYPES.EMPTY);
    }
  };

  useEffect(() => {
    return () => {
      room?.leave();
    };
  }, [room]);

  return (
    <div className='App'>
      <video autoPlay ref={videoRef} playsInline />
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
                  handleUserMedia();
                });
              }}
            />
          )}
          {currentModal === MODAL_TYPES.JOIN && <JoinModal onJoin={handleJoinGame} audioDevices={audioDevices} changeAudioSource={changeAudioSource} />}
        </>
      )}
      {room && game && <Chat />}
      <Socials />
      <div ref={parentEl} className='gameContainer' />
    </div>
  );
}

export default App;

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
import useCallManager, { TPeer } from './hooks/useCallManager';

import { useDeviceStore } from './store/deviceStore';
import UserMedia from './components/UserMedia/UserMedia';
import MediaIcon from './components/MediaIcon/MediaIcon';
import { FaVideoSlash, FaVideo } from 'react-icons/fa';
import Video from './components/Video/Video';

export const MODAL_TYPES = {
  MAIN: 'MAIN',
  JOIN: 'JOIN',
  CREATE: 'CREATE',
  EMPTY: 'EMPTY',
};

function App() {
  const parentEl = useRef<HTMLDivElement>(null);
  const { joinOrCreate, room, isLoading } = useRoomStore();
  const { game, gameLoading } = useGame(parentEl, gameConfig);
  const [currentModal, setCurrentModal] = useState(MODAL_TYPES.MAIN);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { handleUserMedia, changeMediaSource, toggleCamera } = useStream(videoRef);
  const { peers } = useCallManager();
  const stream = useDeviceStore((state) => state.stream);

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
      {peers.length > 0 && (
        <>
          <div className='flex flex-wrap gap-4 px-8 py-2 w-3/4 m-auto fixed left-1/2 -translate-x-1/2 top-5 justify-center'>
            {peers.map((peer: TPeer) => {
              return <Video key={peer.peerID} peer={peer} />;
            })}
          </div>
        </>
      )}
      <UserMedia toggleCamera={toggleCamera} ref={videoRef} />
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
          {currentModal === MODAL_TYPES.JOIN && <JoinModal onJoin={handleJoinGame} changeMediaSource={changeMediaSource} />}
        </>
      )}
      {room && game && <Chat />}
      <Socials />
      <div ref={parentEl} className='gameContainer' />
    </div>
  );
}

export default App;

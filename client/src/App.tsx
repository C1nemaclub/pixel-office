import { gameConfig } from './game';
import { useRef, useState, useEffect } from 'react';
import { useGame } from './hooks';
import JoinModal from './components/JoinModal/JoinModal';
import Loader from './components/Loader/Loader';
import MainModal from './components/MainModal/MainModal';
import Chat from './components/Chat/Chat';
import { useRoomStore } from './store/roomStore';
import Socials from './components/Socials/Socials';
import useStream from './hooks/useStream';
import useCallManager, { TPeer } from './hooks/useCallManager';
import UserMedia from './components/UserMedia/UserMedia';
import Video from './components/Video/Video';
import { MODAL_TYPES } from './utils/contants';
import { useDeviceStore } from './store/deviceStore';

function App() {
  const parentEl = useRef<HTMLDivElement>(null);
  const { joinOrCreate, room, isLoading } = useRoomStore();
  const { game, gameLoading } = useGame(parentEl, gameConfig);
  const [currentModal, setCurrentModal] = useState(MODAL_TYPES.MAIN);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { handleUserMedia, changeMediaSource, toggleCamera } = useStream(videoRef);
  const { isAudioActive, isVideoActive, stream } = useDeviceStore((state) => state);
  const { peers } = useCallManager();

  const handleJoinGame = (selectedChar: number, name: string) => {
    if (game) {
      room?.send('join-game', { selectedChar, name, hasAudioActive: isAudioActive, hasVideoActive: isVideoActive, didAllowMedia: stream !== null });
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
        <div className='flex flex-wrap gap-4 px-8 py-2 w-3/4 m-auto fixed left-1/2 -translate-x-1/2 top-2 justify-center'>
          {peers.map((peer: TPeer) => {
            return <Video key={peer.peerID} peer={peer} />;
          })}
        </div>
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
          {currentModal === MODAL_TYPES.JOIN && (
            <JoinModal handleUserMedia={handleUserMedia} onJoin={handleJoinGame} changeMediaSource={changeMediaSource} />
          )}
        </>
      )}
      {room && game && <Chat />}
      <Socials />
      <div ref={parentEl} className='gameContainer' />
    </div>
  );
}

export default App;

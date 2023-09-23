import { useRef, useState } from 'react';
import useCallManager, { TPeer } from '../../hooks/useCallManager';
import useStream from '../../hooks/useStream';
import Socials from '../Socials/Socials';
import UserMedia from '../UserMedia/UserMedia';
import Video from '../Video/Video';
import VideoList from '../Video/VideoList';
import { MODAL_TYPES } from '../../utils/contants';
import MainModal from '../MainModal/MainModal';
import JoinModal from '../JoinModal/JoinModal';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { useDeviceStore } from '../../store/deviceStore';
import Chat from '../Chat/Chat';

function Ui() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { peers } = useCallManager();
  const { toggleCamera, handleUserMedia, changeMediaSource } = useStream(videoRef);
  const [currentModal, setCurrentModal] = useState(MODAL_TYPES.MAIN);
  const gameFromStore = useGameStore((state) => state.game);
  const { joinOrCreate, room, isLoading } = useRoomStore();
  const { isAudioActive, isVideoActive, stream } = useDeviceStore((state) => state);

  const handleJoinGame = (selectedChar: number, name: string) => {
    if (gameFromStore) {
      room?.send('join-game', {
        selectedChar,
        name,
        hasAudioActive: isAudioActive,
        hasVideoActive: isVideoActive,
        didAllowMedia: stream !== null,
      });
      setCurrentModal(MODAL_TYPES.EMPTY);
    }
  };

  return (
    <>
      <VideoList>
        {peers.map((peer: TPeer) => {
          return <Video key={peer.peerID} peer={peer} />;
        })}
      </VideoList>
      <UserMedia toggleCamera={toggleCamera} ref={videoRef} />
      {currentModal === MODAL_TYPES.MAIN && (
        <MainModal
          loading={isLoading}
          onSwitch={() => {
            joinOrCreate(gameFromStore, () => {
              setCurrentModal(MODAL_TYPES.JOIN);
              handleUserMedia();
            });
          }}
        />
      )}
      {currentModal === MODAL_TYPES.JOIN && (
        <JoinModal handleUserMedia={handleUserMedia} onJoin={handleJoinGame} changeMediaSource={changeMediaSource} />
      )}
      <Socials />
      {gameFromStore && <Chat />}
    </>
  );
}

export default Ui;

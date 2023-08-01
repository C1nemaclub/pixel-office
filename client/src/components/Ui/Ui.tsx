import { useState } from 'react';
import { useRoomContext } from '../../store/RoomProvider';
import JoinModal from '../JoinModal/JoinModal';
import { MODAL_TYPES } from '../../App';
import MainModal from '../MainModal/MainModal';

function Ui({ game }: { game: Phaser.Game | null }) {
  const [currentModal, setCurrentModal] = useState(MODAL_TYPES.MAIN);
  const { joinOrCreate, room } = useRoomContext();

  return (
    <div>
      {currentModal === MODAL_TYPES.MAIN && (
        <MainModal
          onSwitch={() => {
            joinOrCreate(game, () => {
              setCurrentModal(MODAL_TYPES.JOIN);
            });
          }}
        />
      )}
      {currentModal === MODAL_TYPES.JOIN && (
        <JoinModal
          onJoin={(selectedChar, name) => {
            if (game) {
              room?.send('join-game', { selectedChar, name });
              setCurrentModal(MODAL_TYPES.EMPTY);
            }
          }}
        />
      )}
    </div>
  );
}

export default Ui;

import { FC, useEffect } from 'react';
import { useAtom } from 'jotai';
import { roomAtom } from '../../hooks/useRoom';
import { useRoomStore } from '../../store/roomStore';

interface ButtonProps {}

const Chat: FC<ButtonProps> = ({}) => {
  const [room] = useAtom(roomAtom);
  const { room: newRoom, isLoading } = useRoomStore();
  //   console.log(room);

  // useEffect(() => {
  //   if (room) {
  //     room.onMessage('welcome', (message: string) => {
  //       console.log('from chat in React', message);
  //     });
  //   }
  // }, [room]);

  useEffect(() => {
    if (newRoom) {
      newRoom.onMessage('welcome', (message: string) => {
        console.log('from chat in React', message);
      });
    }
  }, [newRoom]);

  return (
    <div>
      Chat
      {isLoading && <h1>loading</h1>}
    </div>
  );
};

export default Chat;

import { FC, useEffect } from 'react';
import { useAtom } from 'jotai';
import { roomAtom } from '../../hooks/useRoom';

interface ButtonProps {}

const Chat: FC<ButtonProps> = ({}) => {
  const [room] = useAtom(roomAtom);
  //   console.log(room);

  useEffect(() => {
    if (room) {
      room.onMessage('welcome', (message: string) => {
        console.log('welcome', message);
      });
    }
  }, [room]);

  return <div>Chat</div>;
};

export default Chat;

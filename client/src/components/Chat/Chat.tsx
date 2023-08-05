import { FC, useEffect } from 'react';
import { roomAtom } from '../../hooks/useRoom';
import { useRoomStore } from '../../store/roomStore';
import { generateRandomColor } from '../../utils/utils';

interface ButtonProps {}

const messages = [
  {
    time: '3:50PM',
    user: 'Evelyn',
    message: 'Hey Everyone!',
    id: 1,
  },
  {
    time: '3:51PM',
    user: 'Sam',
    message: 'Hows is it going!',
    id: 2,
  },
  {
    time: '3:52PM',
    user: 'Evelyn',
    message: 'Just Chilling, By the way this is a really long message to see how it looks on the screen.',
    id: 3,
  },
];

const Chat: FC<ButtonProps> = ({}) => {
  // const { room, isLoading } = useRoomStore();

  // useEffect(() => {
  //   if (room) {
  //     room.onMessage('welcome', (message: string) => {
  //       console.log('from chat in React', message);
  //     });
  //   }
  // }, [room]);


  

  return (
    <div className='w-fit max-w-md border border-red-600 h-fit min-h-[160px] p-2 rounded'>
      <div className=''>
        <h2 className="text-slate-50 font-bold">Chat Box</h2>
        <div>
          {messages.map((message: any) => {
            const color = generateRandomColor();
            return (
              <div className='flex gap-2 justify-start items-start'>
                <p className='text-slate-300'>[{message.time}]</p>
                <p style={{color}} className="">{message.user}</p>
                <p className="text-slate-300">: {message.message}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Chat;

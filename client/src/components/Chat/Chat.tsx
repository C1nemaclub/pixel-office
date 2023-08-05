import { FC, useEffect } from 'react';
import { roomAtom } from '../../hooks/useRoom';
import { useRoomStore } from '../../store/roomStore';
import { generateRandomColor } from '../../utils/utils';
import { Input } from 'postcss';
import Button from '../Button/Button';

interface ButtonProps {}

const messages: any[] = [
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
    <div className='flex flex-col justify-between  w-[400px] bg-[#110c27] min-h-[160px] p-4 rounded fixed bottom-6 left-6'>
        <h2 className="text-slate-50 font-bold">Chat Box</h2>
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
        <form className='flex gap-2 mt-2'>
          <input className="custom-input w-full outline-none" placeholder='Message' />
          <Button>Send</Button>
        </form>
    </div>
  );
};

export default Chat;

import { FC, useEffect, useState, FormEvent} from 'react';
import { roomAtom } from '../../hooks/useRoom';
import { useRoomStore } from '../../store/roomStore';
import { generateRandomColor } from '../../utils/utils';
import { Input } from 'postcss';
import Button from '../Button/Button';
import { ChatEvent, ChatMessage } from '../../models/ChatEvent.model';

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

type EventOrMessage = ChatEvent | ChatMessage;


const Chat: FC<ButtonProps> = ({}) => {
  const { room, isLoading } = useRoomStore();
  const [message, setMessage] = useState<string>('')
  const [chatEvents, setChatEvents] = useState<ChatEvent[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (room) {
      room.onMessage('chat-message', (event: ChatMessage) => {
        setChatMessages((prev) => [...prev, event]);
      });
      room.onMessage('chat-event', (event: ChatEvent) => {
        setChatEvents((prev) => [...prev, event]);
      })
    }
  }, [room]);

  const sendMessage = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!message) return;
    if (room) {
      room.send('chat-message', message);
      setMessage('')
    }
  }


  return (
    <div className='flex flex-col justify-between  w-[400px] bg-[#110c27] min-h-[160px] p-4 rounded fixed bottom-6 left-6'>
        <h2 className="text-slate-50 font-bold">Chat Box</h2>
          {messages.map((message: any) => {
            const color = generateRandomColor();
            return (
              <div className='flex gap-2 justify-start items-start' key={message.id}>
                <p className='text-slate-300'>[{message.time}]</p>
                <p style={{color}} className="">{message.user}</p>
                <p className="text-slate-300">: {message.message}</p>
              </div>
            );
          })}
          {chatMessages.map((event: ChatMessage)=>{
            const color = generateRandomColor();
            return (
              <div className='flex gap-2 justify-start items-start' key={event.id}>
                <p className='text-slate-300'>[{event.time}]</p>
                <p style={{color}} className="">{event.name}</p>
                <p className="text-slate-300">: {event.message}</p>
              </div>
            )
          })}
          {chatEvents.map((event: ChatEvent)=>{
            return (
              <div className='flex gap-2 justify-start items-start' key={event.id}>
                <p className="text-slate-300">Server: {event.message}</p>
              </div>
            )
          })}
          





        <form className='flex gap-2 mt-2' onSubmit={sendMessage}>
          <input className="custom-input w-full outline-none" placeholder='Message' value={message} onChange={(e)=>setMessage(e.target.value)} />
          <Button type="submit">Send</Button>
        </form>
    </div>
  );
};

export default Chat;

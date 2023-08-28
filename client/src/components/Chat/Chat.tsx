import { FC, useEffect, useState, FormEvent, useRef } from 'react';
import { useRoomStore } from '../../store/roomStore';
import { colorArray } from '../../utils/utils';
import { ChatEvent, ChatMessage } from '../../models/ChatEvent.model';
import Button from '../Button/Button';

interface ButtonProps {}

type EventOrMessage = ChatEvent | ChatMessage;

const Chat: FC<ButtonProps> = ({}) => {
  const { room } = useRoomStore();
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<EventOrMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (room) {
      room.onMessage('chat-message', (event: ChatMessage) => {
        setChatHistory((prev) => [...prev, event]);
      });
      room.onMessage('chat-event', (event: ChatEvent) => {
        setChatHistory((prev) => [...prev, event]);
        setIsChatOpen(true);
      });
      room.onMessage('welcome', (message: any) => {
        console.log("Wlecome", message);
      });
    }
  }, [room]);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    if (room) {
      room.send('chat-message', message);
      setMessage('');
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [chatHistory]);

  return (
    <>
      {isChatOpen && (
        <div className='flex flex-col justify-between  w-[450px] bg-[#110c27]  min-h-[160px] p-4 rounded fixed bottom-6 left-6'>
          <h2 className='text-slate-50 font-bold'>Chat Box</h2>
          <div
            className='max-h-[220px] overflow-auto chat-container'
            ref={chatRef}
          >
            {chatHistory.map((event: EventOrMessage) => {
              if (event.type === 'message') {
                const color = colorArray[event.selectedChar];
                return (
                  <div
                    className='flex gap-2 justify-start items-start flex-wrap'
                    key={event.id}
                  >
                    <p className='text-slate-300'>[{event.time}]</p>
                    <p style={{ color }} className=''>
                      {event.name}
                    </p>
                    <p className='text-slate-300 flex-1'>: {event.message}</p>
                  </div>
                );
              } else if (event.type === 'event') {
                return (
                  <div
                    className='flex gap-2 justify-start items-start flex-wrap'
                    key={event.id}
                  >
                    <p className='text-slate-500'>Server: {event.message}</p>
                  </div>
                );
              }
            })}
          </div>
          <form className='flex gap-2 mt-2' onSubmit={sendMessage}>
            <input
              className='custom-input w-full outline-none'
              placeholder='Message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type='submit'>Send</Button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chat;

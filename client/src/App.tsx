import { gameConfig } from './game';
import { useRef, useEffect, useState } from 'react';
import { useGame } from './hooks';
import { client } from './colyseus';
import { Room, RoomAvailable } from 'colyseus.js';

function App() {
  const parentEl = useRef<HTMLDivElement>(null);
  const game = useGame(parentEl, gameConfig);
  const [availableRooms, setAvailableRooms] = useState<RoomAvailable[]>([]);

  const joinOrCreate = () => {
    client.joinOrCreate('my_room').then((room) => {
      room.onMessage('type', (message: string) => {
        console.log(message, room.sessionId);
        game?.events.emit('room', room);
      });

      room.onMessage('new-player', (message: string) => {
        console.log(message, 'new Player React');
        game?.events.emit('new-player', message);
      });

      game?.events.on('move', (data: number) => {
        console.log('move', data);
      });
    });
  };

  const getAvailableRooms = async () => {
    const rooms = await client.getAvailableRooms();
    setAvailableRooms(rooms);
  };

  useEffect(() => {
    getAvailableRooms();
  }, []);

  return (
    <div className='App'>
      <h2 className='py-4 px-2 text-slate-50 bg-teal-500 font-bold text-2xl'>
        Pixel Office {}
      </h2>
      {availableRooms.length > 0 ? availableRooms.map(room => <li>{room.name}</li>) : <p>No rooms available</p>}
      <button
        onClick={joinOrCreate}
        className='px-4 py-2 bg-teal-500 text-slate-50 hover:bg-teal-600'
      >
        Enter Room
      </button>
      <div ref={parentEl} className='gameContainer' />
    </div>
  );
}

export default App;

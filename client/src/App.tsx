import { gameConfig } from './game';
import { useRef, useEffect, useState } from 'react';
import { useGame } from './hooks';
import { client } from './colyseus';
import { Room, RoomAvailable } from 'colyseus.js';
import { Player } from './models/Player.model';

function App() {
  const parentEl = useRef<HTMLDivElement>(null);
  const game = useGame(parentEl, gameConfig);
  const [room, setRoom] = useState<Room | null>(null);
  const [availableRooms, setAvailableRooms] = useState<RoomAvailable[]>([]);

  const joinOrCreate = () => {
    client.joinOrCreate('my_room').then((room) => {
      setRoom(room);

      room.onMessage('current-players', (players: Player[])=>{
        game?.events.emit('current-players', { players, clientId: room.sessionId })
      })

      room.onMessage('new-player', (player: Player) => {
        console.log(player, 'new-player');
        game?.events.emit('new-player', player);
      });

      room.onMessage('player-moved', (movementData: any)=>{
        game?.events.emit('player-moved', movementData)
      })

      room.onMessage('player-left', (id: string)=>{
        game?.events.emit('player-left', id)
      })
      
      game?.events.on('progress', (value: number) => {
        console.log('progress Front', value);
      });
    });
  };

  const getAvailableRooms = async () => {
    const rooms = await client.getAvailableRooms();
    setAvailableRooms(rooms);
  };

  useEffect(() => {
    getAvailableRooms();
    game?.events.on('move', (data: number) => {
        room?.send('move', data);
    });
    // game?.events.on('progress', (value: number) => {
    //   console.log('progress Front', value);
    // });
  }, [game, room]);

  return (
    <div className='App'>
      <h2 className='py-4 px-2 text-slate-50 bg-teal-500 font-bold text-2xl'>
        Pixel Office {}
      </h2>
      {availableRooms.length > 0 ? (
        availableRooms.map((room) => <li key={room.name}>{room.name}</li>)
      ) : (
        <p>No rooms available</p>
      )}
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

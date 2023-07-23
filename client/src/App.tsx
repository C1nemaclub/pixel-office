import { gameConfig } from './game';
import { useRef, useEffect, useState } from 'react';
import { useGame } from './hooks';
import { client } from './colyseus';
import { Room, RoomAvailable } from 'colyseus.js';
import { Player } from './models/Player.model';
import SelectionScreen from './components/SelectionScreen/SelectionScreen';
import useRoom from './hooks/useRoom';

function App() {
  const parentEl = useRef<HTMLDivElement>(null);
  const game = useGame(parentEl, gameConfig);
  const { joinOrCreate: join, availableRooms, setName } = useRoom(game)


  return (
    <div className='App'>
      <SelectionScreen setName={setName} />
      <h2 className='py-4 px-2 text-slate-50 bg-teal-500 font-bold text-2xl'>
        Pixel Office {}
      </h2>
      {availableRooms.length > 0 ? (
        availableRooms.map((room) => <li key={room.name}>{room.name}</li>)
      ) : (
        <p>No rooms available</p>
      )}
      <button
        onClick={join}
        className='px-4 py-2 bg-teal-500 text-slate-50 hover:bg-teal-600'
      >
        Enter Room
      </button>
      <div ref={parentEl} className='gameContainer' />
    </div>
  );
}

export default App;

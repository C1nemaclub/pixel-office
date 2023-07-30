import { useState } from 'react';
import { client } from '../colyseus';
import { Room, RoomAvailable } from 'colyseus.js';

function useRoom() {
  const [room, setRoom] = useState<Room | null>(null);
  const [availableRooms] = useState<RoomAvailable[]>([]);

  const joinOrCreate = () => {
    client.joinOrCreate('my_room', { name }).then((room) => {
      setRoom(room);
    });
  };

  return {
    joinOrCreate,
    room,
    availableRooms,
  };
}

export default useRoom;

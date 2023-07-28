import { useEffect, useState } from 'react';
import { client } from '../colyseus';
import { Room, RoomAvailable } from 'colyseus.js';
import Phaser from 'phaser';
import { Player } from '../models/Player.model';
import { phaserEvent } from '../events/EventHandler';

function useRoom() {
  const [room, setRoom] = useState<Room | null>(null);
  const [name, setName] = useState<string>('');
  const [skinIndex, setSkinIndex] = useState<number>(0);
  const [availableRooms, setAvailableRooms] = useState<RoomAvailable[]>([]);

  const joinOrCreate = () => {
    client.joinOrCreate('my_room', { name }).then((room) => {
      setRoom(room);
    });
  };


  return {
    joinOrCreate,
    room,
    availableRooms,
    name,
    setName,
    skinIndex,
    setSkinIndex,
  };
}

export default useRoom;

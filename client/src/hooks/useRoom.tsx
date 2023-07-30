import { useState } from 'react';
import { client } from '../colyseus';
import { Room, RoomAvailable } from 'colyseus.js';
import { Game } from 'phaser';
import { Background } from '../game/scenes';

function useRoom() {
  const [room, setRoom] = useState<Room | null>(null);
  const [availableRooms] = useState<RoomAvailable[]>([]);
  const [connectionLoading, setConnectionLoading] = useState<boolean>(false)

  const joinOrCreate = (game: Game | null,callback: Function) => {
    setConnectionLoading(true);
    client.joinOrCreate('my_room').then((room) => {
      setRoom(room);
      const backgroundScene = game?.scene.keys.background as Background;
      backgroundScene.launchOffice()
      setConnectionLoading(false);
      callback()
    });
  };

  return {
    joinOrCreate,
    room,
    availableRooms,
    connectionLoading
  };
}

export default useRoom;

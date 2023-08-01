import { useState, useEffect } from 'react';
import { client } from '../colyseus';
import { Room, RoomAvailable } from 'colyseus.js';
import { Game } from 'phaser';
import { Background } from '../game/scenes';
import { ConnectionError } from '../utils/errorHandler';

function useRoom() {
  const [room, setRoom] = useState<Room | null>(null);
  const [availableRooms, setAvailableRooms] = useState<RoomAvailable[]>([]);
  const [connectionLoading, setConnectionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const joinOrCreate = (game: Game | null, callback: Function) => {
    setConnectionLoading(true);
    client
      .joinOrCreate('my_room', {
        label: 'Office',
        password: 'secret',
      })
      .then((room) => {
        setRoom(room);
        const backgroundScene = game?.scene.keys.background as Background;
        backgroundScene.launchOffice();
        setConnectionLoading(false);
        callback();
      })
      .catch((e: unknown) => {
        if (e instanceof Error) {
          setError(e.message);
        }
      })
      .finally(() => {
        setConnectionLoading(false);
      });
  };

  useEffect(() => {
    client
      .getAvailableRooms('my_room')
      .then((rooms) => {
        console.log('Available rooms', rooms);
        setAvailableRooms(rooms);
      })
      .catch((e: unknown) => {
        if (e instanceof Error) {
          setError(e.message);
        }
      });
  }, []);

  return {
    joinOrCreate,
    room,
    availableRooms,
    connectionLoading,
  };
}

export default useRoom;

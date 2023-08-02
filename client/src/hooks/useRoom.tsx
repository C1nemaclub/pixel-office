import { useState, useEffect } from 'react';
import { client } from '../colyseus';
import { Room, RoomAvailable } from 'colyseus.js';
import { Game } from 'phaser';
import { Background } from '../game/scenes';
import { atom, useAtom } from 'jotai';

type RoomContextType = {
  joinOrCreate: (game: Game | null, callback: Function) => void;
  room: Room | null;
  availableRooms: RoomAvailable[];
  connectionLoading: boolean;
  error: string | null;
};

export const roomAtom = atom<Room | null>(null);

function useRoom() {
  const [room, setRoom] = useState<Room | null>(null);
  const [availableRooms, setAvailableRooms] = useState<RoomAvailable[]>([]);
  const [connectionLoading, setConnectionLoading] = useState<boolean>(false);
  const [_, setError] = useState<string | null>(null);
  const [__, setRoomAtom] = useAtom(roomAtom);

  const joinOrCreate = (game: Game | null, callback: Function) => {
    setConnectionLoading(true);
    client
      .joinOrCreate('public')
      .then((room) => {
        setRoom(room);
        const backgroundScene = game?.scene.keys.background as Background;
        backgroundScene.launchOffice();
        setConnectionLoading(false);
        callback();
        setRoomAtom(room);
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

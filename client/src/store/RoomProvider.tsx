import { Room, RoomAvailable } from 'colyseus.js';
import { client } from '../colyseus';
import React, { useContext, createContext, useState } from 'react';
import { Game } from 'phaser';
import { Background } from '../game/scenes';

type RoomContextType = {
  joinOrCreate: (game: Game | null,callback: Function) => void;
  room: Room | null;
  availableRooms: RoomAvailable[];
  connectionLoading: boolean;
};

const RoomContext = createContext({} as RoomContextType);

export const useRoomContext = () => {
  return useContext(RoomContext);
};

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [availableRooms] = useState<RoomAvailable[]>([]);
  const [connectionLoading, setConnectionLoading] = useState<boolean>(false);

  const joinOrCreate = (game: Game | null,callback?: Function) => {
    setConnectionLoading(true);
    client.joinOrCreate('my_room').then((room) => {
      setRoom(room);
      const backgroundScene = game?.scene.keys.background as Background;
      backgroundScene.launchOffice()
      setConnectionLoading(false);
      if(callback) callback();
    });
  };

  return (
    <RoomContext.Provider
      value={{
        joinOrCreate,
        room,
        availableRooms,
        connectionLoading,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

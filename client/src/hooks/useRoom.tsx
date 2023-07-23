import { useEffect, useState } from 'react';
import { client } from '../colyseus';
import { Room, RoomAvailable } from 'colyseus.js';
import Phaser from 'phaser';
import { Player } from '../models/Player.model';



function useRoom(game: Phaser.Game | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [name, setName] = useState<string>('')
  const [skinIndex, setSkinIndex] = useState<number>(0)
  const [availableRooms, setAvailableRooms] = useState<RoomAvailable[]>([]);


  const joinOrCreate = () => {
    client.joinOrCreate('my_room', { name }).then((room) => {
      setRoom(room);
      room.onMessage('current-players', (players: Player[]) => {
        game?.events.emit('current-players', {
          players,
          clientId: room.sessionId,
        });
      });

      room.onMessage('new-player', (player: Player) => {
        game?.events.emit('new-player', player);
      });

      room.onMessage('player-moved', (movementData: any) => {
        game?.events.emit('player-moved', movementData);
      });

      room.onMessage('player-left', (id: string) => {
        game?.events.emit('player-left', id);
      });

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
    }, [room, game])

  return { joinOrCreate, room, availableRooms, name, setName, skinIndex, setSkinIndex };
}

export default useRoom;

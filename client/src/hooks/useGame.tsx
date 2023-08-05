import { useState, useEffect } from 'react';
import Phaser from 'phaser';
import { Room } from 'colyseus.js';
import { Player } from '../models/Player.model';
import { phaserEvent } from '../events/EventHandler';
import { useRoomStore } from '../store/roomStore';

export default function useGame(
  parentEl: React.RefObject<HTMLDivElement>,
  config: Phaser.Types.Core.GameConfig) {
  const [game, setGame] = useState<Phaser.Game | null>(null);
  const [gameLoading, setGameLoading] = useState<boolean>(true);
  const { room: myRoom } = useRoomStore();

  useEffect(() => {
    if (parentEl.current && !game) {
      setGameLoading(true);
      const newGame = new Phaser.Game({ ...config, parent: parentEl.current });
      newGame.events.on('progress', (value: number) => {
        if (value === 1) setGameLoading(false);
      });
      setGame(newGame);
    }
    return () => game?.destroy(true);
  }, [game, parentEl, config]);

  useEffect(() => {
    if (myRoom && game && parentEl.current) {
      //Ask if game is ready

      myRoom.onMessage('current-players', (players: Player[]) => {
        phaserEvent.emit('lmao', players);

        //Emit to phaser when game is ready to listen
        game.events.once('ready', () => {
          console.log('current-players', players);
          phaserEvent.emit('lmao', players);
        });

        game.events.emit('current-players', {
          players,
          clientId: myRoom.sessionId,
        });
      });

      myRoom.onMessage('new-player', (player: any) => {
        console.log('new-player', player);
        game.events.emit('new-player', player);
      });

      myRoom.onMessage('player-moved', (movementData: any) => {
        game.events.emit('player-moved', movementData);
      });

      myRoom.onMessage('player-left', (id: string) => {
        game.events.emit('player-left', id);
      });

      game?.events.on('progress', (value: number) => {
        console.log('progress Front', value);
      });

      game?.events.on('move', (data: number) => {
        myRoom?.send('move', data);
      });
    }
  }, [game, myRoom]);

  return { game, gameLoading };
}

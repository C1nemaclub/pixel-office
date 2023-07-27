import { useState, useEffect } from 'react';
import Phaser from 'phaser';
import { Room } from 'colyseus.js';
import { Player } from '../models/Player.model';
import { phaserEvent } from '../events/EventHandler';

export default function useGame(
  parentEl: React.RefObject<HTMLDivElement>,
  config: Phaser.Types.Core.GameConfig,
  room: Room | null
) {
  const [game, setGame] = useState<Phaser.Game | null>(null);

  useEffect(() => {
    if (parentEl.current && !game && room) {
      const newGame = new Phaser.Game({ ...config, parent: parentEl.current });
      setGame(newGame);
    }
    return () => game?.destroy(true);
  }, [game, parentEl, config, room]);

  useEffect(() => {
    if (game) {
    }
    if (room && game && parentEl.current) {
      //Ask if game is ready

      room.onMessage('current-players', (players: Player[]) => {
        phaserEvent.emit('lmao', players);

        //Emit to phaser when game is ready to listen
        game.events.once('ready', () => {
          console.log('current-players', players);
          phaserEvent.emit('lmao', players);
        });

        game.events.emit('current-players', {
          players,
          clientId: room.sessionId,
        });
      });

      room.onMessage('new-player', (player: any) => {
        console.log('new-player', player);
        game.events.emit('new-player', player);
      });

      room.onMessage('player-moved', (movementData: any) => {
        game.events.emit('player-moved', movementData);
      });

      room.onMessage('player-left', (id: string) => {
        game.events.emit('player-left', id);
      });

      // game?.events.on('progress', (value: number) => {
      //   console.log('progress Front', value);
      // });

      game?.events.on('move', (data: number) => {
        room?.send('move', data);
      });
    }
  }, [game, room]);

  return { game };
}

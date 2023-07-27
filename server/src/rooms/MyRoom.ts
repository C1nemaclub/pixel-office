import { Room, Client } from '@colyseus/core';
import { MyRoomState } from './schema/MyRoomState';

type Player = {
  id: string;
  x: number,
  y: number,
}

const players: {[key: string]: Player} = {}

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage('type', (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!' , options);


    this.onMessage('join-game', (client, message) => {
    players[client.sessionId] = {
      id: client.sessionId,
      x: 14,
      y: 10,
    };
      this.broadcastToAllButMe(client, 'new-player', players[client.sessionId]);
      client.send('current-players', this.getAllPlayers())
    })


    // players[client.sessionId] = {
    //   id: client.sessionId,
    //   x: 14,
    //   y: 10,
    // };

    // this.broadcastToAllButMe(client, 'new-player', players[client.sessionId]);
    // client.send('current-players', this.getAllPlayers())



    this.onMessage('move', (client, movementData) => {      
      console.log(movementData, client.sessionId)
      players[client.sessionId] = { ...players[client.sessionId], x: movementData.x, y: movementData.y }
      this.broadcastToAllButMe(client, 'player-moved', {
        id: client.sessionId,
        ...movementData
      });
    })
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    delete players[client.sessionId]
    this.broadcast('player-left', client.sessionId)
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }

  broadcastToAllButMe(client: Client, type: string, message: any) {
    const otherClients = this.clients.filter((c) => c.sessionId !== client.sessionId);
    otherClients.forEach((client) => client.send(type, message));
  }

  getOtherPlayers(client: Client) {
    return Object.values(players).filter((player: Player)=> player.id !== client.sessionId)
  }
  getAllPlayers(){
    return Object.values(players)
  }
}

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
    console.log('MyRoom created!', options)
    
    if(options && options.password){
      // this.setPrivate(true)
      this.setMetadata({password: true , ...options})
      //Name the room
    }
    
    this.setState(new MyRoomState());

    this.onMessage('type', (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    if(!options.password){
      client.leave()
      return
    }
    if(options && options.password && this.metadata.password){
      if(options.password !== this.metadata.password){
        client.send('wrong-password')
        client.leave()
        return
      }
    }
    console.log(client.sessionId, 'joined!' , options);


    this.onMessage('join-game', (client, playerData: {selectedChar: number, name: string}) => {
      console.log("join game", playerData)
    players[client.sessionId] = {
      id: client.sessionId,
      x: 14,
      y: 10,
      ...playerData
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

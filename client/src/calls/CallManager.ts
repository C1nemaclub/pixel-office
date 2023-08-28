import { Room } from 'colyseus.js';
import { Player } from '../models/Player.model';
import Peer from 'simple-peer';
import { PeerType } from '../models/Peer.model';

export class CallManager {
  peers: PeerType[] = [];
  client: Room<any>;
  stream: MediaStream;

  constructor(room: Room | null) {
    if (room instanceof Room) {
      this.client = room;
    }
    throw new Error('Invalid room');
  }

  handleCurrentUsersConnection(players: Player[]) {
    console.log('Class', players);

    players.forEach((user) => {
      const peer = this.createPeer(user.id, this.client.id, this.stream);
      this.peers.push({
        peerID: user.id,
        peer,
      });
    });
  }

  createPeer(userToCall: string, callerID: string, stream: MediaStream): Peer.Instance {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      this.client.send('call-user', { signal, callerID, userToCall });
    });

    return peer;
  }
}

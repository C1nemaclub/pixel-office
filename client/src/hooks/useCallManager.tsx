import { useRoomStore } from '../store/roomStore';
import { useDeviceStore } from '../store/deviceStore';
import Peer, { SignalData } from 'simple-peer';
import { useState, useEffect, useRef } from 'react';
import { Player } from '../models/Player.model';
import toast from 'react-hot-toast';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import global from 'global';

import * as process from 'process';
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
global.process = process;

export type TPeer = {
  peerID: string;
  peer: Peer.Instance;
  playerData: Player;
};

const useCallManager = () => {
  const [me, setMe] = useState<string>('');
  const [peers, setPeers] = useState<TPeer[]>([]);
  const peersRef = useRef<TPeer[]>([]);

  const { room } = useRoomStore();
  const stream = useDeviceStore((state) => state.stream);

  useEffect(() => {
    try {
      if (room && stream) {
        setMe(room.sessionId);
        room.onMessage('current-players', (players: Player[]) => {
          console.log(players, 'x');

          const peers: TPeer[] = [];
          players.forEach((player: Player) => {
            if (player.id === room.sessionId || !player.didAllowMedia) return;
            const peer = createPeer(player.id, room.sessionId);
            peersRef.current.push({
              peerID: player.id,
              peer,
              playerData: player,
            });
            peers.push({ peerID: player.id, peer, playerData: player });
          });
          setPeers(peers);
        });

        room.onMessage('user-joined', (payload: { signal: SignalData; callerID: string; callerData: Player }) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
            playerData: payload.callerData,
          });
          setPeers((users: TPeer[]) => [...users, { peer, peerID: payload.callerID, playerData: payload.callerData }]);
        });

        room.onMessage('call-accepted', (payload: { signal: SignalData; id: string; playerData: Player }) => {
          const peerToConnect = peersRef.current.find((peer: TPeer) => peer.peerID === payload.id);

          peerToConnect?.peer.signal(payload.signal);
        });

        room.onMessage('player-left', (userID: string) => {
          const peerToDisconnect = peersRef.current.find((peer: TPeer) => peer.peerID === userID);

          if (peerToDisconnect) peerToDisconnect.peer.destroy();
          peersRef.current = peersRef.current.filter((peer: TPeer) => peer.peerID !== userID);
          setPeers((users: TPeer[]) => {
            return users.filter((user: TPeer) => user.peerID !== userID);
          });
        });
      }
    } catch (e) {
      toast.error('Something went wrong');
      console.log(e);
    }
  }, [room, stream]);

  const createPeer = (userToCall: string, callerID: string): Peer.Instance => {
    if (!stream) throw new Error('Stream is null');
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: 'stun:numb.viagenie.ca',
            username: 'sultan1640@gmail.com',
            credential: '98376683',
          },
          {
            urls: 'turn:numb.viagenie.ca',
            username: 'sultan1640@gmail.com',
            credential: '98376683',
          },
        ],
      },
      stream,
    });

    peer.on('signal', (signal) => {
      room?.send('call-user', { signal, callerID, userToCall });
    });
    console.log('Calling ' + userToCall);

    return peer;
  };

  const addPeer = (incomingSignal: SignalData, callerID: string, stream: MediaStream | null): Peer.Instance => {
    if (!stream) throw new Error('Stream is null');
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal: SignalData) => {
      room?.send('answer-call', { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  return { peers, me };
};

export default useCallManager;

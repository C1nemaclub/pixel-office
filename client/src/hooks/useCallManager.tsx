import { useRoomStore } from '../store/roomStore';
import { useDeviceStore } from '../store/deviceStore';
import Peer, { SignalData } from 'simple-peer';
import { useState, useEffect, useRef } from 'react';
import { Player } from '../models/Player.model';

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
    if (room && stream) {
      setMe(room.sessionId);
      room.onMessage('current-players', (players: Player[]) => {
        const peers: TPeer[] = [];
        players.forEach((player: Player) => {
          if (player.id === room.sessionId) return;
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
        peersRef.current.filter((peer: TPeer) => peer.peerID !== userID);
        setPeers((users: TPeer[]) => {
          return users.filter((user: TPeer) => user.peerID !== userID);
        });
      });
    }
  }, [room, stream]);

  const createPeer = (userToCall: string, callerID: string): Peer.Instance => {
    if (!stream) throw new Error('Stream is null');
    const peer = new Peer({
      initiator: true,
      trickle: false,
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

    console.log('Answering ' + callerID);

    peer.on('signal', (signal: SignalData) => {
      room?.send('answer-call', { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  return { peers, me };
};

export default useCallManager;

import { useRoomStore } from '../store/roomStore';
import { useDeviceStore } from '../store/deviceStore';
import Peer, { SignalData } from 'simple-peer';
import { useState, useEffect, useRef } from 'react';
import { FaAmericanSignLanguageInterpreting } from 'react-icons/fa';
import { Player } from '../models/Player.model';

export type TPeer = {
  peerID: string;
  peer: Peer.Instance;
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
        console.log(players);
        const peers: TPeer[] = [];
        players.forEach((player: Player) => {
          if (player.id === room.sessionId) return;
          const peer = createPeer(player.id, room.sessionId);
          peersRef.current.push({
            peerID: player.id,
            peer,
          });
          peers.push({ peerID: player.id, peer });
        });
        setPeers(peers);
      });

      room.onMessage('user-joined', (payload: { signal: SignalData; callerID: string }) => {
        console.log('User Joined');
        // alert(`${payload.callerID} just joined the room!`);
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });
        setPeers((users: TPeer[]) => [...users, { peer, peerID: payload.callerID }]);
      });

      room.onMessage('call-accepted', (payload: { signal: SignalData; id: string }) => {
        alert(`${payload.id} just accepted your call!`);
        const peerToConnect = peersRef.current.find((peer: TPeer) => peer.peerID === payload.id);

        peerToConnect?.peer.signal(payload.signal);
      });

      room.onMessage('user-disconnected', (userID: string) => {
        alert(`${userID} just left the room!`);
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
      alert('Calling');
      room?.send('call-user', { signal, callerID, userToCall });
    });
    console.log('Done');

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
      alert('Answering');
      room?.send('answer-call', { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  return { peers };
};

export default useCallManager;

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
  const { stream } = useDeviceStore();

  useEffect(() => {
    if (room) {
      room.onMessage('current-players', (players: Player[]) => {
        console.log(players);
        const peers: TPeer[] = [];
        players.forEach((player: Player) => {
          const peer = createPeer(player.id, room.id, stream);
          peersRef.current.push({
            peerID: player.id,
            peer,
          });
          peers.push({ peerID: player.id, peer });
        });
        setPeers(peers);
      });

      room.onMessage(
        'user-joined',
        (payload: { signal: SignalData; callerID: string }) => {
          toast.success(`${payload.callerID} just joined the room!`)
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          setPeers((users: TPeer[]) => [...users, {peer, peerID: payload.callerID}]);
        }
      );
    }
  }, [room]);

  const createPeer = (userToCall: string, callerID: string, stream: MediaStream | null): Peer.Instance => {
    if (!stream) throw new Error('Stream is null');
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      room?.send('call-user', { signal, callerID, userToCall });
    });

    return peer;
  };

  return {};
};

export default useCallManager;

import { Room } from 'colyseus.js';
import { useRoomStore } from '../store/roomStore';

interface useCallManagerProps {}

const useCallManager = (stream: MediaStream | null) => {
  const { room } = useRoomStore();
  return {};
};

export default useCallManager;

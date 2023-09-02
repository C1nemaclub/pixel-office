import { useRoomStore } from '../store/roomStore';
import { useDeviceStore } from '../store/deviceStore';


const useCallManager = () => {
  const { room } = useRoomStore();
  const { stream } = useDeviceStore();
  return {};
};

export default useCallManager;

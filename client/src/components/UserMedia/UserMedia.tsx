import { forwardRef } from 'react';
import { FaVideoSlash, FaVideo, FaMicrophoneAltSlash, FaMicrophoneAlt } from 'react-icons/fa';
import MediaIcon from '../MediaIcon/MediaIcon';
import { useDeviceStore } from '../../store/deviceStore';

interface UserMediaProps {
  toggleCamera: (deviceName: string) => void;
}

const UserMedia = forwardRef<HTMLVideoElement, UserMediaProps>(({ toggleCamera }, ref) => {
  
  const { stream, isVideoActive, isAudioActive } = useDeviceStore((state) => state);
  return (
    <div className='max-w-[300px] w-full fixed right-5 top-5 rounded overflow-hidden'>
      <video ref={ref} autoPlay playsInline />
      {stream && (
        <div className='absolute right-3 bottom-3 flex gap-2'>
          <MediaIcon
            active={isVideoActive}
            onClick={() => toggleCamera('video')}
            activeIcon={<FaVideo color='#fff' size={20} />}
            disableIcon={<FaVideoSlash color='#fff' size={20} />}
          />
          <MediaIcon
            active={isAudioActive}
            onClick={() => toggleCamera('audio')}
            activeIcon={<FaMicrophoneAlt color='#fff' size={20} />}
            disableIcon={<FaMicrophoneAltSlash color='#fff' size={20} />}
          />
        </div>
      )}
    </div>
  );
});

export default UserMedia;

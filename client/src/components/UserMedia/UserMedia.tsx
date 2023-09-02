import { forwardRef } from 'react';
import { FaVideoSlash, FaVideo } from 'react-icons/fa';
import Button from '../Button/Button';
import MediaIcon from '../MediaIcon/MediaIcon';

interface UserMediaProps {
  stream: MediaStream | null;
  toggleCamera: () => void;
  isVideoActive: boolean;
}

const UserMedia = forwardRef<HTMLVideoElement, UserMediaProps>(({ stream, toggleCamera, isVideoActive }, ref) => {
  return (
    <div className='max-w-[300px] w-full fixed right-5 top-5 rounded overflow-hidden'>
      <video ref={ref} autoPlay playsInline />
      {stream && (
        <>
          <MediaIcon
            active={isVideoActive}
            onClick={toggleCamera}
            activeIcon={<FaVideo color='#fff' size={20} />}
            disableIcon={<FaVideoSlash color='#fff' size={20} />}
          />
        </>
      )}
    </div>
  );
});

export default UserMedia;

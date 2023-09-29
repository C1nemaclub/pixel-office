import { useRef, useEffect, useState } from 'react';
import { TPeer } from '../../hooks/useCallManager';
import Spinner from '../core/Spinner';

function Video({ peer }: { peer: TPeer }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConnected, setIsConnected] = useState<boolean>(peer.peer.connected);

  useEffect(() => {
    peer.peer.on('stream', (stream: MediaStream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
    peer.peer.on('connect', () => setIsConnected(true));
  }, [peer.peer]);

  return (
    <div className='relative max-h-48 rounded basis-48 shrink-0 h-[150px] overflow-hidden'>
      {!isConnected && (
        <div className='w-full h-full bg-slate-700 flex items-center justify-center'>
          <Spinner />
        </div>
      )}
      <video ref={videoRef} autoPlay playsInline className='w-full h-full rounded-xl' />
      <p className='absolute text-slate-50 z-10 bottom-2 right-2 bg-slate-800 px-3 text-sm text-center rounded-full'>{peer.playerData.name}</p>
    </div>
  );
}

export default Video;

import { useDeviceStore } from '../store/deviceStore';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { useRoomStore } from '../store/roomStore';

const useStream = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const { dispatch, stream } = useDeviceStore((state) => state);
  const updatePlayer = useRoomStore((state) => state.updatePlayerStatus);

  const handleUserMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((media) => {
        handleStream(media);
        listUserDevices();
        toast.success('Successfully connected to your devices.');
        updatePlayer({ hasAudioActive: true, hasVideoActive: true, didAllowMedia: true });
      })
      .catch((error: unknown) => {
        console.log(error);
        if (error instanceof Error) dispatch({ type: 'SET_ERROR', payload: error.message });
        toast.error("There was an error accessing your device's camera and microphone.");
        updatePlayer({ hasAudioActive: false, hasVideoActive: false, didAllowMedia: false });
      });
  };

  const listUserDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter((device) => device.kind === 'audioinput');
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');
    dispatch({ type: 'SET_AUDIO_DEVICE', payload: audioDevices });
    dispatch({ type: 'SET_VIDEO_DEVICE', payload: videoDevices });
  };

  const changeMediaSource = (deviceId: string, deviceType: string) => {
    if (deviceType === 'audio') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: { deviceId } }).then(handleStream);
    } else if (deviceType === 'video') {
      navigator.mediaDevices.getUserMedia({ video: { deviceId }, audio: true }).then(handleStream);
    }
  };

  const toggleCamera = (deviceName: string) => {
    if (deviceName === 'video') {
      const videoTracks = stream?.getVideoTracks()[0];
      if (!videoTracks) return;

      const isLive = videoTracks.enabled;
      if (isLive) {
        videoTracks.enabled = false;
        dispatch({ type: 'SET_VIDEO_STATE', payload: 'stop' });
        updatePlayer({ hasVideoActive: false });
      } else {
        videoTracks.enabled = true;
        dispatch({ type: 'SET_VIDEO_STATE', payload: 'live' });
        updatePlayer({ hasVideoActive: true });
      }
    } else {
      const audioTracks = stream?.getAudioTracks()[0];
      if (!audioTracks) return;

      const isLive = audioTracks.enabled;
      if (isLive) {
        audioTracks.enabled = false;
        dispatch({ type: 'SET_AUDIO_STATE', payload: 'stop' });
        updatePlayer({ hasAudioActive: false });
      } else {
        audioTracks.enabled = true;
        dispatch({ type: 'SET_AUDIO_STATE', payload: 'live' });
        updatePlayer({ hasAudioActive: true });
      }
    }
  };

  const handleStream = (stream: MediaStream) => {
    videoRef.current!.srcObject = stream;
    videoRef.current!.muted = true;

    dispatch({ type: 'SET_STREAM', payload: stream });
  };

  const deviceChangeHandler = () => {
    handleUserMedia();
  };

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', deviceChangeHandler);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', deviceChangeHandler);
    };
  }, []);

  return { handleUserMedia, changeMediaSource, toggleCamera };
};

export default useStream;

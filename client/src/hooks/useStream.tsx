import { useDeviceStore } from '../store/deviceStore';
import { useEffect } from 'react';

const useStream = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const { dispatch, stream, isAudioActive, isVideoActive } = useDeviceStore((state) => state);

  const handleUserMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((media) => {
        handleStream(media);
        listUserDevices();
      })
      .catch((error) => {
        console.log(error);
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
      const isLive = stream?.getVideoTracks()[0].enabled;

      if (isLive) {
        stream?.getVideoTracks().forEach((track) => {
          track.enabled = false;
        });
        dispatch({ type: 'SET_VIDEO_STATE', payload: 'stop' });
      } else {
        stream?.getVideoTracks().forEach((track) => {
          track.enabled = true;
        });
        dispatch({ type: 'SET_VIDEO_STATE', payload: 'live' });
      }
    } else {
      const isLive = stream?.getAudioTracks()[0].enabled;

      if (isLive) {
        stream?.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
        dispatch({ type: 'SET_AUDIO_STATE', payload: 'stop' });
      } else {
        stream?.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
        dispatch({ type: 'SET_AUDIO_STATE', payload: 'live' });
      }
    }
  };

  const handleStream = (stream: MediaStream) => {
    videoRef.current!.srcObject = stream;
    dispatch({ type: 'SET_STREAM', payload: stream });
  };

  const deviceChangeHandler = (e: any) => {
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

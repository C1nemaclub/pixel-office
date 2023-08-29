import { useDeviceStore } from '../store/deviceStore';

const useStream = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const { dispatch, stream } = useDeviceStore((state) => state);

  const handleUserMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(async (media) => {
        handleStream(media);
        handleDevices();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter((device) => device.kind === 'audioinput');
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');
    dispatch({ type: 'SET_AUDIO_DEVICE', payload: audioDevices });
    dispatch({ type: 'SET_VIDEO_DEVICE', payload: videoDevices });
  };

  const changeMediaSource = async (deviceId: string, deviceType: string) => {
    if (deviceType === 'audio') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: { deviceId } }).then(handleStream);
    } else if (deviceType === 'video') {
      navigator.mediaDevices.getUserMedia({ video: { deviceId }, audio: true }).then(handleStream);
    }
  };

  const toggleCamera = () => {
    const isLive = stream?.getVideoTracks()[0].readyState === "live";
    
    if(isLive){
      stream?.getVideoTracks().forEach(track => {
        if(track.readyState === "live") track.stop()
      })
      dispatch({type: "SET_VIDEO_STATE", payload: "stop"})
    } else{
      handleUserMedia()
    }
  }

  const handleStream = (stream: MediaStream) => {
    videoRef.current!.srcObject = stream;
    dispatch({ type: 'SET_STREAM', payload: stream });
  };

  return { handleUserMedia, changeMediaSource, toggleCamera };
};

export default useStream;

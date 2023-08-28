import { useEffect, useState } from 'react';

const useStream = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  useEffect(() => {
    console.log(stream?.getAudioTracks(), 'TRacks');
  }, [stream]);

  const handleUserMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(async (media) => {
        handleStream(media)

        const devices = await navigator.mediaDevices.enumerateDevices();
        setAudioDevices(devices.filter((device) => device.kind === 'audioinput'));
        setVideoDevices(devices.filter((device) => device.kind === 'videoinput'));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeAudioSource = async (deviceId: string) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: { deviceId } }).then(handleStream);
  };

  const changeVideoSource = async (deviceId: string) => {
    navigator.mediaDevices.getUserMedia({ video: { deviceId }, audio: true }).then(handleStream);
  };

  const handleStream = (stream: MediaStream) => {
    setStream(stream)
    videoRef.current!.srcObject = stream
  }

  return { stream, handleUserMedia, audioDevices, videoDevices, changeAudioSource, changeVideoSource };
};

export default useStream;

type DeviceAction = {
  type: 'SET_AUDIO_DEVICE' | 'SET_VIDEO_DEVICE';
  payload: MediaDeviceInfo[];
};

type StreamAction = {
  type: 'SET_STREAM';
  payload: MediaStream;
};

type StringAction = {
  type: 'SET_ERROR' | "SET_VIDEO_STATE" | "SET_AUDIO_STATE";
  payload: string;
};

export type Action = DeviceAction | StreamAction | StringAction;

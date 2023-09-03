import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Action } from '../types/deviceStore.types';

type DeviceStoreType = {
  stream: MediaStream | null;
  audioDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
  error: string | null;
  isVideoActive: boolean;
  isAudioActive: boolean;
  dispatch: (action: Action) => any;
};

export const useDeviceStore = create<DeviceStoreType>()(
  devtools((set) => {
    return {
      stream: null,
      audioDevices: [],
      videoDevices: [],
      error: null,
      isVideoActive: true,
      isAudioActive: true,
      dispatch: (action: Action) => set((state: any) => reducer(state, action), false, action.type),
    };
  })
);

const reducer = (state: DeviceStoreType, action: Action): DeviceStoreType => {
  const { type } = action;
  switch (type) {
    case 'SET_AUDIO_DEVICE':
      return { ...state, audioDevices: action.payload };
    case 'SET_VIDEO_DEVICE':
      return { ...state, videoDevices: action.payload };
    case 'SET_STREAM':
      return { ...state, stream: action.payload };
    case 'SET_AUDIO_STATE':
      return { ...state, isAudioActive: action.payload === 'live' ? true : false };
    case 'SET_VIDEO_STATE':
      return { ...state, isVideoActive: action.payload === 'live' ? true : false };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

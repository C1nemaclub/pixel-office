import { Room } from 'colyseus.js';
import { create } from 'zustand';
import { client } from '../colyseus';
import { Background } from '../game/scenes';
import { Player } from '../models/Player.model';

type RoomStoreType = {
  name: string;
  room: Room | null;
  isLoading: boolean;
  joinOrCreate: (game: any, callback: () => void) => void;
  error: string | null;
  updatePlayerStatus: (player: Partial<Player>) => void;
};

export const useRoomStore = create<RoomStoreType>((set) => {
  return {
    name: 'hello',
    room: null,
    isLoading: false,
    error: null,
    joinOrCreate: (game, callback) => {
      set({ isLoading: true });

      client
        .joinOrCreate('public')
        .then((room: Room) => {
          const backgroundScene = game?.scene.keys.background as Background;
          backgroundScene.launchOffice(room);
          set({ room, isLoading: false });
          callback();
        })
        .catch((e: unknown) => {
          if (e instanceof Error) set({ error: e.message });
        })
        .finally(() => set({ isLoading: false }));
    },
    updatePlayerStatus: (player: Partial<Player>) => {
      const room = useRoomStore.getState().room;
      console.log(room);
      
      if (!room) throw new Error('Room is null');
      room.send('update-player-status', player);
    }
  };
});

// const useStore = create((set) => ({
//   count: 0,
//   dispatch: (action: any) => set((state: any) => reducer(state, action)),
// }));

// const reducer = (state: any, action: any) => {
//   switch (action.type) {
//     case 'START_LOADING':
//       return { ...state, loading: true };
//     default:
//       return state;
//   }
// };

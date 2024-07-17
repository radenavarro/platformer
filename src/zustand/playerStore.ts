import { StateCreator } from 'zustand'

export type PlayerStoreProps = {
  player: {
    playerWidth: number;
    playerHeight: number;
    playerX: number;
    playerY: number;
    setPlayerX: (num:number) => void;
    setPlayerY: (num:number) => void;
    playerScrollX: number;
    playerScrollY: number;
    setPlayerScrollX: (num:number) => void;
    setPlayerScrollY: (num:number) => void;
  }
}

export const playerStore:StateCreator<PlayerStoreProps> = (set) => ({
  player: {
    playerWidth: 64,
    playerHeight: 64,
    playerX: 0,
    playerY: 0,
    setPlayerX: (value) => set((state) => ({ player: { ...state.player, playerX: value } })),
    setPlayerY: (value) => set((state) => ({ player: { ...state.player, playerY: value } })),
    playerScrollX: 0,
    playerScrollY: 0,
    setPlayerScrollX: (value) => set((state) => ({ player: { ...state.player, playerScrollX: value } })),
    setPlayerScrollY: (value) => set((state) => ({ player: { ...state.player, playerScrollY: value } }))
  }
})

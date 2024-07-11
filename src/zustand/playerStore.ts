import { StateCreator } from 'zustand'

export type PlayerStoreProps = {
    playerWidth: number,
    playerHeight: number,
    playerX: number,
    playerY: number
}

export const playerStore:StateCreator<PlayerStoreProps> = (set) => ({
  playerWidth: 64,
  playerHeight: 64,
  playerX: 0,
  playerY: 0
})

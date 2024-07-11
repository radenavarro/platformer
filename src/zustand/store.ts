import { create } from 'zustand'
import { playerStore, PlayerStoreProps } from './playerStore'
import { mapStore, MapStoreProps } from './mapStore'

type GameStoreProps = PlayerStoreProps & MapStoreProps

export const useGameStore = create<GameStoreProps>()((...args) => ({
  ...playerStore(...args),
  ...mapStore(...args)
}))

import { create } from 'zustand'
import { playerStore, PlayerStoreProps } from './playerStore'
import { mapStore, MapStoreProps } from './mapStore'
import { devtools } from 'zustand/middleware'

type GameStoreProps = PlayerStoreProps & MapStoreProps

export const useGameStore = create<GameStoreProps>()(
  devtools(
    (...args) => ({
      ...playerStore(...args),
      ...mapStore(...args)
    })
    , { name: 'gameStore' }
  ))

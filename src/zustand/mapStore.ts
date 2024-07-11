import { StateCreator } from 'zustand'
import { SectorInfo } from '../core/types'

export type MapStoreProps = {
    map01TileInfo: SectorInfo[],
    setMap01TileInfo: (sector:SectorInfo) => void
}

export const mapStore:StateCreator<MapStoreProps> = (set) => ({
  map01TileInfo: [],
  setMap01TileInfo: (sectorInfo) => set((state) => ({ map01TileInfo: [...state.map01TileInfo, sectorInfo] }))
})

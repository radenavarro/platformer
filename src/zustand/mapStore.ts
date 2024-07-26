import { StateCreator } from 'zustand'
import { SectorInfo } from '../core/types'

export type MapStoreProps = {
  map01: {
    tileInfo: SectorInfo[];
    setTileInfo: (sector:SectorInfo) => void;
  }
}

export const mapStore:StateCreator<MapStoreProps> = (set) => ({
  map01: {
    tileInfo: [],
    setTileInfo: (sectorInfo) => set((state) => ({ map01: { ...state.map01, tileInfo: sectorInfo } }))
  }
})

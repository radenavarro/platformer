import { useEffect, useMemo, useState } from 'react'
import { level } from '../constants/level'
import { Tile } from '../views/maps/map01/layout/layout'

export const useTileInfo = (mapTileInfo) => {
  const [tileInfo, setTileInfo] = useState([])

  useEffect(() => {
    if (mapTileInfo) loadTileInfo()
  }, [mapTileInfo])

  function loadTileInfo () {
    const tileData = []
    const startCol = 0
    const endCol = Math.ceil(level.map01.width / 32) + 1

    for (let y = 0; y < mapTileInfo.length; y++) {
      for (let x = startCol; x < endCol; x++) {
        if (x >= 0 && x < mapTileInfo[0].length) {
          const tile = mapTileInfo[y][x]
          const [fullTileName, fullTileData]:[string, Tile] = Object.entries(level.map01.tiles).find(([key, value]) => value.abbr === tile)
          if (fullTileName !== 'empty') {
            tileData.push({ x: x * 32, y: y * 32, tileX: x, tileY: y, ...fullTileData })
          }
        }
      }
    }
    setTileInfo(tileData)
  }

  return useMemo(() => ({ tileInfo }), [JSON.stringify(tileInfo)])
}

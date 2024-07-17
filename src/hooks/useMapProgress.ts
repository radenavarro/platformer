import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../zustand/store'
import { throttle } from '../helpers/helpers'
import { MapProgress, MapProgressOutput, MapProgressProps } from './hookTypes'

export const useMapProgress = ({ map }:MapProgressProps):MapProgressOutput => {
  const [mapProgress, setMapProgress] = useState<MapProgress>({ x: 0, y: 0 })
  const totalTileWidth = useMemo(() => Math.round(map.width / 32), [map])
  const totalTileHeight = useMemo(() => Math.round(map.height / 32), [map])

  const { playerX, playerY } = useGameStore().player

  useEffect(() => {
    handlePercentProgress()
  }, [map, playerX, playerY])

  const handlePercentProgress = throttle(
    calculatePercentProgress,
    (1000 / 60)
  )
  function calculatePercentProgress () {
    const tilesX = Math.round(playerX / 32)
    const tilesY = Math.round(playerY / 32)
    setMapProgress({ x: tilesX, y: tilesY })
  }
  //   console.log(mapProgress)
  return { playerInTile: mapProgress, totalTileWidth, totalTileHeight }
}

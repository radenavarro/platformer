import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../zustand/store'
import { throttle } from '../helpers/helpers'
import { MapProgress, MapProgressOutput, MapProgressProps } from './hookTypes'
import { PlayerOutOfBoundsError } from '../errors/errors'

export const useMapProgress = ({ map }:MapProgressProps):MapProgressOutput => {
  const [mapProgress, setMapProgress] = useState<MapProgress>({ x: 0, y: 0 })
  const totalTileWidth = useMemo(() => Math.round(map.width / 32), [map])
  const totalTileHeight = useMemo(() => Math.round(map.height / 32), [map])

  const { playerX, playerY } = useGameStore().player

  useEffect(() => {
    handleProgress()
  }, [map, playerX, playerY])

  const handleProgress = throttle(
    calculateProgress,
    (1000 / 60)
  )
  function calculateProgress () {
    const tilesX = Math.round(playerX / 32)
    const tilesY = Math.round(playerY / 32)
    if (Math.abs(Math.round(playerX / 32)) > totalTileWidth) {
      throw new PlayerOutOfBoundsError('El jugador ha salido de los límites de forma errónea. Revisa deltaTime o las variables que determinan la posición')
    }
    setMapProgress({ x: tilesX, y: tilesY })
  }
  //   console.log(mapProgress)
  return { playerInTile: mapProgress, totalTileWidth, totalTileHeight }
}

import { useCallback, useEffect, useState } from 'react'
import { canvas } from '../constants/canvas'
import { useGameStore } from '../zustand/store'
import { Camera } from './hookTypes'
import { playerInAnyBoundary } from '../helpers/helpers'
import { level } from '../constants/level'

export const useCamera = (tileData) => {
  const { playerX, playerY } = useGameStore().player

  const [camera, setCamera] = useState<Camera>(() => ({
    x: Math.max(0, playerX - canvas.width / 2),
    y: 0
  }))

  const updateCamera = useCallback(() => {
    // if (!playerInAnyBoundary(tileData)) {
    setCamera(prevCamera => {
      // Centrar la cámara en el jugador
      let newX = playerX - canvas.width / 2

      // Asegurarse de que la cámara no se mueva más allá de los límites del nivel
      newX = Math.max(0, Math.min(newX, level.map01.width - canvas.width))

      return {
        x: newX,
        y: prevCamera.y
      }
    })
    // }
  }, [playerX])

  useEffect(() => {
    updateCamera()
  }, [playerX, updateCamera])

  return { camera }
}

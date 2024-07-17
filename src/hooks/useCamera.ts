import { useCallback, useEffect, useState } from 'react'
import { canvas } from '../constants/canvas'
import { useGameStore } from '../zustand/store'
import { Camera } from './hookTypes'

export const useCamera = () => {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
  const { playerX, playerY } = useGameStore().player
  const updateGame = useCallback(() => {
    // Actualiza la posición de la cámara basada en la posición del jugador
    setCamera(prevCamera => ({
      x: playerX - canvas.width / 2,
      y: playerY - canvas.height / 2
    }))
  }, [playerX, playerY])

  useEffect(() => {
    const gameLoop = setInterval(updateGame, 1000 / 60)
    return () => clearInterval(gameLoop)
  }, [playerX, playerY])

  return { camera }
}

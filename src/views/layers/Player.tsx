import { useCallback, useEffect, useRef, useState } from 'react'
import { GameState } from '../../core/types'
import { Player as PlayerEntity } from '../../core/player'
import { useSprites } from '../../hooks/useSprites'
import { playerProps, playerSprites } from '../../constants/player'
import { useGameLoop } from '../../hooks/useGameLoop'
import { useGameStore } from '../../zustand/store'
import { Camera, MapProgressOutput } from '../../hooks/hookTypes'
import { playerInLeftEdge } from '../../helpers/helpers'
import { level } from '../../constants/level'
import { useCollision } from '../../hooks/useCollision'
import { levelLayout } from '../maps/map01/layout/map01'

export const PlayerLayer = ({ camera, tileData } : { camera:Camera, tileData: MapProgressOutput }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerState, setPlayerState] = useState<GameState>({
    x: 0,
    y: 0,
    direction: 'right',
    action: 'idle',
    currentFrame: 0,
    frameCount: 0,
    frameRate: 10,
    isJumping: false,
    velocityY: 0
  })
  const keysPressed = useRef<Record<string, boolean>>({})
  const lastUpdateTimeRef = useRef<number>(performance.now())
  const animationFrameId = useRef<number | null>(null)
  const spritesRef = useRef(playerSprites)
  const { imagesRef, imagesLoaded } = useSprites({ spriteReference: spritesRef })
  const player = useRef(new PlayerEntity(0, 0, 4, 35, -10)).current

  // Zustand
  const { setPlayerX, setPlayerY } = useGameStore().player

  // Colisiones
  const { collidingBlocks } = useCollision(player, levelLayout, level.map01)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key] = true
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key] = false
  }, [])

  const updateGame = (deltaTime: number) => {
    player.update(
      deltaTime,
      keysPressed.current,
      tileData,
      collidingBlocks
    )

    const { x, y } = player.getPosition()
    const { spriteX, spriteY } = player.getSpritePosition()
    const action = player.getAction()

    // Actualizar coords player Zustand
    setPlayerX(x)
    setPlayerY(y)
    // Actualizar estado player en componente
    setPlayerState((prev) => {
      const newState: GameState = {
        ...prev,
        x,
        y,
        spriteX,
        spriteY,
        action,
        direction: keysPressed.current.a ? 'left' : (keysPressed.current.d ? 'right' : prev.direction),
        timeAccumulator: prev.timeAccumulator + deltaTime// Lleva un registro del tiempo que ha pasado para determinar cuándo es necesario cambiar al siguiente frame de la animación
      }

      const currentAction = action === 'death' ? action : `${action}${newState.direction.charAt(0).toUpperCase() + newState.direction.slice(1)}`
      const spriteInfo = spritesRef.current[currentAction]

      if (spriteInfo) {
        newState.frameRate = spriteInfo.frameRate
        const frameDuration = 1000 / newState.frameRate// El tiempo que debe durar cada frame de la animación

        // Reiniciar el acumulador si cambia la acción o dirección
        if (action !== prev.action || newState.direction !== prev.direction) {
          newState.timeAccumulator = 0
          newState.currentFrame = 0
        }

        // Lógica para sprites que no hacen bucle, de 1 solo uso
        if (!spriteInfo.loop) {
          if (newState.currentFrame === spriteInfo.order.length - 1) return newState
          if (spriteInfo.order) {
            newState.currentFrame = (newState.currentFrame + 1) % spriteInfo.order.length
          } else {
            newState.currentFrame = (newState.currentFrame + 1) % spriteInfo.sprites.length
          }
        } else {
          // Lógica para el resto de sprites
          while (newState.timeAccumulator >= frameDuration) { // evita que la animación se "salte" frames cuando el tiempo entre actualizaciones es grande
            newState.timeAccumulator -= frameDuration
            if (spriteInfo.order) {
              const orderIndex = (newState.currentFrame + 1) % spriteInfo.order.length
              newState.currentFrame = spriteInfo.order[orderIndex] - 1
            } else {
              newState.currentFrame = (newState.currentFrame + 1) % spriteInfo.sprites.length
            }
          }
        }
      }

      return newState
    })
  }

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { action, direction, currentFrame, x, y }: GameState = playerState
    const currentAction = action === 'death' ? action : `${action}${direction.charAt(0).toUpperCase() + direction.slice(1)}`
    const spriteInfo = spritesRef.current[currentAction]
    const currentImage = imagesRef.current?.[currentAction]?.[currentFrame]

    if (currentImage) {
      ctx.save()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const xWithCamera: number = playerInLeftEdge(tileData) ? x : x - camera.x
      const yWithCamera: number = playerInLeftEdge(tileData) ? y : y - camera.y

      if (spriteInfo.flipHorizontal) {
        ctx.scale(-1, 1)
        ctx.translate(-xWithCamera - currentImage.width, yWithCamera)
      } else {
        ctx.translate(xWithCamera, yWithCamera)
      }

      ctx.drawImage(currentImage, 0, playerProps.spawn.y)
      ctx.restore()
    }
  },
  [
    playerState,
    imagesRef
  ])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawPlayer(ctx, canvas)
  }, [drawPlayer])

  useGameLoop(updateGame, render, true, imagesLoaded)

  /**
   * Activa la carga de imagenes y los listeners.
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    lastUpdateTimeRef.current = performance.now()
    animationFrameId.current = requestAnimationFrame(updateGame)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [handleKeyDown, handleKeyUp, updateGame])

  return (
    <canvas ref={canvasRef} width={level.map01.width} height={level.map01.height} style={{ zIndex: 10, position: 'absolute' }} />
  )
}

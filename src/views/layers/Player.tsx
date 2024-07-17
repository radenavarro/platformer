import { useCallback, useEffect, useRef, useState } from 'react'
import { canvas } from '../../constants/canvas'
import { GameState } from '../../core/types'
import { Player as PlayerEntity } from '../../core/player'
import { useSprites } from '../../hooks/useSprites'
import { playerProps, playerSprites } from '../../constants/player'
import { useGameLoop } from '../../hooks/useGameLoop'
import { usePlayerScroll } from '../../hooks/usePlayerScroll'
import { useGameStore } from '../../zustand/store'
import { Camera, MapProgressOutput } from '../../hooks/hookTypes'
import { playerInLeftEdge, playerInRightEdge } from '../../helpers/helpers'

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
  const player = useRef(new PlayerEntity(0, 0, 10, 25, -10)).current

  // Zustand
  const { playerX, playerY, setPlayerX, setPlayerY } = useGameStore().player

  // const { scrollX, scrollY } = usePlayerScroll(playerState, player, tileData)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key] = true
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key] = false
  }, [])

  const updateGame = (deltaTime: number) => {
    // console.log(scrollX)
    player.update(
      deltaTime,
      keysPressed.current,
      // { scrollX, scrollY },
      tileData
    )

    const { x, y } = player.getPosition()
    const action = player.getAction()

    // Actualizar coords player Zustand
    setPlayerX(x)
    setPlayerY(y)
    // Actualizar estado player en componente
    setPlayerState((prev) => {
      const newState:GameState = {
        ...prev,
        x,
        y,
        action,
        direction: keysPressed.current.a ? 'left' : (keysPressed.current.d ? 'right' : prev.direction)
      }

      // Actualizar sprite
      const currentAction = `${action}${newState.direction.charAt(0).toUpperCase() + newState.direction.slice(1)}`
      const spriteInfo = spritesRef.current[currentAction]

      if (spriteInfo) {
        newState.frameRate = spriteInfo.frameRate
        newState.frameCount = (prev.frameCount + 1) % newState.frameRate
        if (newState.frameCount === 0 || action !== prev.action || newState.direction !== prev.direction) {
          if (spriteInfo.order) {
            const orderIndex = (prev.currentFrame + 1) % spriteInfo.order.length
            newState.currentFrame = spriteInfo.order[orderIndex] - 1
          } else {
            newState.currentFrame = (prev.currentFrame + 1) % spriteInfo.sprites.length
          }
        }
      }

      return newState
    })
  }

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { action, direction, currentFrame, x, y } = playerState
    const currentAction = `${action}${direction.charAt(0).toUpperCase() + direction.slice(1)}`

    const spriteInfo = spritesRef.current[currentAction]
    const currentImage = imagesRef.current[currentAction][currentFrame]

    if (currentImage) {
      ctx.save()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const drawX = x
      const drawY = y

      // Ajustar la posición de dibujo basada en el scroll
      // if (scrollX !== 0) {
      //   if ((direction === 'left' && !playerInLeftEdge(tileData)) || (direction === 'right' && !playerInRightEdge(tileData))) {
      //     drawX = scrollX
      //   }
      // }
      // if (scrollY !== 0) {
      //   drawY = scrollY
      // }

      // console.log(drawX)

      if (spriteInfo.flipHorizontal) {
        ctx.scale(-1, 1)
        ctx.translate(-drawX - currentImage.width, drawY)
      } else {
        ctx.translate(drawX, drawY)
      }
      ctx.drawImage(currentImage, 0, playerProps.spawn.y)
      ctx.restore()
    }
  }, [playerState, imagesRef, scrollX, scrollY])

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
    <canvas ref={canvasRef} width={canvas.width} height={canvas.height} style={{ zIndex: 10, position: 'absolute' }} />
  )
}

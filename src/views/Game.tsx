import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { playerSprites } from '../constants/player'
import { useImages } from '../hooks/useImages'
import { Player } from '../core/player'
import { useGameLoop } from '../hooks/useGameLoop'
import { GameState } from '../core/types'
import { useElementBounds } from '../hooks/useElementBounds'

const BG = '#88bef5'

const Game = () => {
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
  const spritesRef = useRef(playerSprites())

  const player = useRef(new Player(0, 0, 10, -20)).current

  const { imagesRef, imagesLoaded } = useImages({ spriteReference: spritesRef })

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key] = true
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key] = false
  }, [])

  const canvasCoords = useElementBounds(canvasRef)

  const updateGame = useCallback((deltaTime: number) => {
    player.update(deltaTime, keysPressed.current)

    setPlayerState((prev) => {
      const { x, y } = player.getPosition()
      const action = player.getAction()

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
  }, [player])

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { action, direction, currentFrame, x, y } = playerState
    const currentAction = `${action}${direction.charAt(0).toUpperCase() + direction.slice(1)}`

    const spriteInfo = spritesRef.current[currentAction]
    const currentImage = imagesRef.current[currentAction][currentFrame]

    if (currentImage) {
      ctx.save()
      if (spriteInfo.flipHorizontal) {
        ctx.scale(-1, 1)
        ctx.translate(-x - currentImage.width, y)
      } else {
        ctx.translate(x, y)
      }
      ctx.drawImage(currentImage, 0, canvas.height / 2)
      ctx.restore()
    }
  }, [playerState, imagesRef])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawBackground(ctx, canvas)
    drawPlayer(ctx, canvas)
  }, [drawBackground, drawPlayer])

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

  /**
   * Activa el renderizado cuando las imagenes están cargadas o cambia algo en el jugador
   */
  // useEffect(() => {
  //   if (imagesLoaded) render()
  // }, [playerState, imagesLoaded, render])

  return <canvas ref={canvasRef} width={800} height={600} />
}

export default Game

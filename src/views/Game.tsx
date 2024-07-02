import { useEffect, useRef, useState } from 'react'
import { playerSprites } from '../constants/player'
import { useImages } from '../hooks/useImages'

const SPEED = 5
const BG = '#88bef5'

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // const [imagesLoaded, setImagesLoaded] = useState(false)
  const [playerState, setPlayerState] = useState({
    x: 0,
    y: 0,
    direction: 'right',
    action: 'idle',
    currentFrame: 0,
    frameCount: 0,
    frameRate: 10
  })

  const keysPressed = useRef<Record<string, boolean>>({})
  const animationFrameId = useRef<number | null>(null)
  const spritesRef = useRef(playerSprites())

  const images = useImages({ spriteReference: spritesRef })

  const handleKeyDown = (e: KeyboardEvent) => {
    keysPressed.current[e.key] = true
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    keysPressed.current[e.key] = false
  }

  /**
   *
   */
  const updateGame = () => {
    setPlayerState((prev) => {
      const newState = { ...prev }
      let action = 'idle'
      let direction = prev.direction

      if (keysPressed.current.a) {
        newState.x -= SPEED
        action = 'move'
        direction = 'left'
      } else if (keysPressed.current.d) {
        newState.x += SPEED
        action = 'move'
        direction = 'right'
      }

      const currentAction = `${action}${direction.charAt(0).toUpperCase() + direction.slice(1)}`
      const spriteInfo = spritesRef.current[currentAction]

      if (!spriteInfo) {
        return prev
      }

      newState.frameRate = spriteInfo.frameRate
      newState.frameCount = (prev.frameCount + 1) % newState.frameRate
      if (newState.frameCount === 0 || action !== prev.action || direction !== prev.direction) {
        if (spriteInfo.order) {
          const orderIndex = (prev.currentFrame + 1) % spriteInfo.order.length
          newState.currentFrame = spriteInfo.order[orderIndex] - 1
        } else {
          newState.currentFrame = (prev.currentFrame + 1) % spriteInfo.sprites.length
        }
      }

      newState.action = action
      newState.direction = direction

      return newState
    })

    animationFrameId.current = requestAnimationFrame(updateGame)
  }

  const drawBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const drawPlayer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { action, direction, currentFrame, x, y } = playerState
    const currentAction = `${action}${direction.charAt(0).toUpperCase() + direction.slice(1)}`
    const spriteInfo = spritesRef.current[currentAction]
    const currentImage = images?.imagesRef?.current[currentAction][currentFrame]

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
  }

  /**
   * Renderiza los elementos en el canvas. IMPORTANTE: Lo que se renderiza más tarde se superpone a lo que se renderiza primero
   */
  const render = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawBackground(ctx, canvas)
    drawPlayer(ctx, canvas)
  }

  /**
   * Activa la carga de imagenes y los listeners.
   */
  useEffect(() => {
    // loadAllImages()

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    updateGame()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  /**
   * Activa el renderizado cuando las imagenes están cargadas o cambia algo en el jugador
   */
  useEffect(() => {
    if (images.imagesLoaded) render()
  }, [playerState, images.imagesLoaded])

  return <canvas ref={canvasRef} width={800} height={600} />
}

export default Game

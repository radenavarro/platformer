import React, { useEffect, useRef, useState } from 'react'
import { playerSprites } from '../constants/player'

const SPEED = 5
const BG = '#88bef5'

const Game = () => {
  const canvasRef = useRef(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [playerState, setPlayerState] = useState({
    x: 0,
    y: 0,
    direction: 'right',
    action: 'idle',
    currentFrame: 0,
    frameCount: 0
  })

  const keysPressed = useRef({})
  const animationFrameId = useRef(null)
  const spritesRef = useRef(playerSprites())
  const imagesRef = useRef({})

  const canvas = canvasRef.current
  const ctx = canvas?.getContext('2d')

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const loadAllImages = async () => {
    try {
      for (const [key, value] of Object.entries(spritesRef.current)) {
        imagesRef.current[key] = await Promise.all(value.sprites.map(loadImage))
      }
      setImagesLoaded(true)
    } catch (error) {
      console.error('Failed to load one or more images', error)
    }
  }

  const handleKeyDown = (e) => {
    keysPressed.current[e.key] = true
  }

  const handleKeyUp = (e) => {
    keysPressed.current[e.key] = false
  }

  const updateGame = () => {
    setPlayerState(prev => {
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

      newState.frameCount = (prev.frameCount + 1) % spriteInfo.frameRate
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

  const drawBackground = () => {
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Aquí podrías añadir más elementos de fondo si lo deseas
    // Por ejemplo, dibujar nubes, montañas, etc.
  }

  const drawPlayer = () => {
    const currentAction = `${playerState.action}${playerState.direction.charAt(0).toUpperCase() + playerState.direction.slice(1)}`
    const spriteInfo = spritesRef.current[currentAction]
    const currentImage = imagesRef.current[currentAction][playerState.currentFrame]

    if (currentImage) {
      ctx.save()
      if (spriteInfo.flipHorizontal) {
        ctx.scale(-1, 1)
        ctx.translate(-playerState.x - currentImage.width, playerState.y)
      } else {
        ctx.translate(playerState.x, playerState.y)
      }
      ctx.drawImage(currentImage, 0, 0)
      ctx.restore()
    }
  }

  const render = () => {
    drawBackground()
    drawPlayer()
  }

  useEffect(() => {
    loadAllImages()

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    updateGame()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  useEffect(() => {
    if (!imagesLoaded) return
    render()
  }, [playerState])

  return <canvas ref={canvasRef} width={800} height={600} />
}

export default Game

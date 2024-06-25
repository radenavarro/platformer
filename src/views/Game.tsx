import React, { useEffect, useRef, useState } from 'react'

const SPEED = 5 // Velocidad de movimiento del personaje

const Game = () => {
  const canvasRef = useRef(null)
  const [playerState, setPlayerState] = useState({
    x: 0,
    y: 0,
    direction: 'right',
    isJumping: false,
    isCrouching: false,
    isLookingUp: false,
    isAttacking: false
  })

  const keysPressed = useRef({})
  const animationFrameId = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true
    }

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false
      if (e.key === 'w') {
        setPlayerState(prev => ({ ...prev, isLookingUp: false }))
      } else if (e.key === 's') {
        setPlayerState(prev => ({ ...prev, isCrouching: false }))
      }
    }

    const handleMouseDown = () => {
      setPlayerState(prev => ({ ...prev, isAttacking: true }))
    }

    const handleMouseUp = () => {
      setPlayerState(prev => ({ ...prev, isAttacking: false }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    const updateGame = () => {
      setPlayerState(prev => {
        const newState = { ...prev }

        if (keysPressed.current.a) {
          newState.x -= SPEED
          newState.direction = 'left'
        }
        if (keysPressed.current.d) {
          newState.x += SPEED
          newState.direction = 'right'
        }
        if (keysPressed.current.w) {
          newState.isLookingUp = true
        }
        if (keysPressed.current.s) {
          newState.isCrouching = true
        }
        if (keysPressed.current[' '] && !prev.isJumping) {
          newState.isJumping = true
          // TODO: Implementar lógica de salto
        }

        return newState
      })

      animationFrameId.current = requestAnimationFrame(updateGame)
    }

    updateGame()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const drawPlayer = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'red'
      ctx.fillRect(playerState.x, playerState.y, 50, 50)
      // TODO: Sprites de personaje
    }

    drawPlayer()
  }, [playerState])

  return <canvas ref={canvasRef} width={800} height={600} />
}

export default Game

import { useRef, useEffect, useCallback } from 'react'

export const useGameLoop = (
  update: (deltaTime: number) => void,
  render: () => void,
  shouldUpdate: boolean,
  shouldRender: boolean
) => {
  const lastTimeRef = useRef<number>(0)
  const requestIdRef = useRef<number | null>(null)

  const gameLoop = useCallback((currentTime: number) => {
    if (lastTimeRef.current !== 0) {
      const deltaTime = (currentTime - lastTimeRef.current)

      if (shouldUpdate) {
        update(deltaTime)
      }
    }

    lastTimeRef.current = currentTime

    if (shouldRender) {
      render()
    }

    requestIdRef.current = requestAnimationFrame(gameLoop)
  }, [update, render, shouldUpdate, shouldRender])

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current)
      }
    }
  }, [gameLoop])
}

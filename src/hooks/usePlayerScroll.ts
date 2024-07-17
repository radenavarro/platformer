import { useEffect, useState } from 'react'
import { canvas } from '../constants/canvas'
import { useGameStore } from '../zustand/store'
import { MapProgressOutput } from './hookTypes'
import { playerInLeftEdge, playerInRightEdge } from '../helpers/helpers'

export const usePlayerScroll = (playerState, shouldEnableScrolling:boolean, tileData:MapProgressOutput) => {
  const [scrollX, setScrollX] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  const updateScrollX = useGameStore((state) => state.player?.setPlayerScrollX)
  const updateScrollY = useGameStore((state) => state.player?.setPlayerScrollY)

  function handleScrollX (value:number) {
    setScrollX(value)
    updateScrollX(value)
  }

  function handleScrollY (value:number) {
    setScrollY(value)
    updateScrollY(value)
  }

  function somewhatEquals (value:number, equalValue:number, sensitivity:number) {
    if (value <= equalValue + (sensitivity / 2) && value >= equalValue - (sensitivity / 2)) return true
    return false
  }

  useEffect(() => {
    console.log(playerInLeftEdge(tileData))
    if (shouldEnableScrolling) {
      const { action, direction, x, y } = playerState
      // console.log(x)
      if (direction === 'right' &&
        somewhatEquals(Math.round(x), Math.round(canvas.width / 3), 40) &&
        !playerInRightEdge(tileData)
      ) {
        handleScrollX(canvas.width / 3)
      }
      if (
        direction === 'left' &&
        somewhatEquals(Math.round(x), Math.round(canvas.width - (canvas.width / 3)), 40) &&
        !playerInLeftEdge(tileData)
      ) {
        console.log('???????????')
        handleScrollX(canvas.width - (canvas.width / 3))
      }
      if (action === 'jump' && Math.abs(y) === 100) {
        handleScrollY(-100)
      }
      if (action === 'fall' && Math.abs(y) === 0) {
        handleScrollY(1)
      }
    }
  }, [playerState.x, playerState.y])

  return { scrollX, scrollY }
}

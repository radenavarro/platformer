import { MapProgressOutput } from '../hooks/hookTypes'

export function throttle (mainFunction: (...params:any[]) => void, delay: number) {
  let timerFlag: number | null = null

  return (...args: any[]) => {
    if (timerFlag === null) {
      mainFunction(...args)
      timerFlag = setTimeout(() => {
        timerFlag = null
      }, delay)
    }
  }
}

export function playerInLeftEdge (tileData:MapProgressOutput):boolean {
  const { playerInTile } = tileData
  console.log(playerInTile.x + ' < 10')
  if (playerInTile.x < 10) return true
  return false
}

export function playerInRightEdge (tileData:MapProgressOutput):boolean {
  const { playerInTile, totalTileWidth } = tileData

  if (playerInTile?.x > (totalTileWidth - 10)) return true

  return false
}

export function playerInAnyBoundary (tileData:MapProgressOutput):boolean {
  console.log(tileData)
  if (playerInRightEdge(tileData) || playerInLeftEdge(tileData)) return true
  return false
}

import { MapProgressOutput } from '../hooks/hookTypes'

/**
 *
 * @param mainFunction
 * @param delay
 * @returns function
 */
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

/**
 *
 * @param tileData
 * @returns boolean
 */
export function playerInLeftEdge (tileData:MapProgressOutput):boolean {
  const { playerInTile } = tileData
  if (playerInTile.x < 12) return true
  return false
}

/**
 *
 * @param tileData
 * @returns boolean
 */
export function playerInRightEdge (tileData:MapProgressOutput):boolean {
  const { playerInTile, totalTileWidth } = tileData
  if (playerInTile?.x > (totalTileWidth - 12)) return true
  return false
}

/**
 *
 * @param tileData
 * @returns boolean
 */
export function playerInAnyBoundary (tileData:MapProgressOutput):boolean {
  if (playerInRightEdge(tileData) || playerInLeftEdge(tileData)) return true
  return false
}

/**
 *
 * @param value
 * @param equalValue
 * @param sensitivity
 * @returns boolean
 */
export function somewhatEquals (value:number, equalValue:number, sensitivity:number) {
  if (value <= equalValue + (sensitivity / 2) && value >= equalValue - (sensitivity / 2)) return true
  return false
}

/**
 *
 * @param inferiorLimit
 * @param superiorLimit
 * @param value
 * @param includeLimits
 * @returns boolean
 */
export function between (inferiorLimit:number, superiorLimit:number, value: number, includeLimits: boolean = false) {
  if (includeLimits) {
    if (value >= inferiorLimit && value <= superiorLimit) return true
  } else {
    if (value > inferiorLimit && value < superiorLimit) return true
  }
  return false
}

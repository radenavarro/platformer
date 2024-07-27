import { MapProgressOutput } from '../hooks/hookTypes'
import { Collision } from '../views/maps/map01/layout/layout'

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

/**
 *
 * @param numbers
 * @returns number
 */
export function highestOf (numbers:number[] | undefined) {
  return numbers?.reduce((a, b) => Math.max(a, b), 0)
}
/**
 *
 * @param numbers
 * @returns number
 */
export function lowestOf (numbers:number[]) {
  return numbers.reduce((a, b) => Math.min(a, b), numbers[0])
}
/**
 *
 * @param number
 * @param values
 * @returns number
 */
export function closestTo (number:number, values:number[]) {
  return values.reduce((prev, acc) => {
    return Math.abs(number - prev) > Math.abs(number - acc) ? acc : prev
  }, 0)
}

/**
 * Una vez se pinta un elemento en el canvas (como el jugador), su valor de y puede ser cualquiera pero para él, ese valor va a ser su 0. Esta
 * función correlaciona su valor de "y" relativo a ese elemento con el valor de "y" que usan los elementos de un nivel.
 *
 * La función asume que el tamaño de tile <strong>siempre</strong> va a ser 32 y el tamaño del canvas <strong>siempre</strong> va a ser 600.
 * @param playerY
 * @param spawnY
 * @returns number
 */
export function toggleY (playerY: number, spawnY: number) {
  const tileSize = 32
  const canvasHeight = 600

  const realY = spawnY + playerY
  const visibleTiles = Math.floor(canvasHeight / tileSize)
  const maxMappingHeight = (visibleTiles - 1) * tileSize

  return maxMappingHeight - realY
}

/**
 *
 * @param collisions
 * @param playerX
 * @returns boolean
 */
export function obstacleLeft (collisions:Collision[], playerX) {
  const collision = collisions.find((hc) => (hc.x - playerX) <= 32)
  return (!!collision && collision?.x < playerX)
}
/**
 *
 * @param collisions
 * @param playerX
 * @returns boolean
 */
export function obstacleRight (collisions:Collision[], playerX) {
  const collision = collisions.find((hc) => (playerX - hc.x) <= 32)
  return (!!collision && collision?.x > playerX)
}

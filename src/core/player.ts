import { canvas } from '../constants/canvas'
import { playerProps } from '../constants/player'
import { between, closestTo, highestOf, isBeside, lowestOf, obstacleLeft, obstacleRight, toggleY, toggleYCoords } from '../helpers/helpers'
import { MapProgressOutput } from '../hooks/hookTypes'
import { Collision, Tile } from '../views/maps/map01/layout/layout'
import { Action, Entity } from './types'

interface PlayerInterface extends Entity {
    getJumpHeight: () => number,
    update: (deltaTime:number, keys:{ a: boolean; d: boolean; w: boolean }, tileData: MapProgressOutput) => void
}

export class Player implements PlayerInterface {
  private x: number = 0
  private y: number = 0
  private spriteX: number = 0
  private spriteY: number = 0
  private velocityY: number = 0
  private speed: number // unidades por segundo
  private jumpVelocity: number // unidades por segundo (negativo porque va hacia arriba)
  private isJumping: boolean = false
  private action: Action
  private mass: number
  private trespassMapBounds: boolean = false

  constructor (
    x:number = 0,
    y:number = 0,
    speed:number = 10,
    mass:number = 70,
    jumpVelocity:number = -14,
    isJumping:boolean = false,
    action:Action = 'idle',
    spriteX:number = 0,
    spriteY:number = 0
  ) {
    this.x = x
    this.y = y
    this.spriteX = spriteX
    this.spriteY = spriteY
    this.speed = speed
    this.jumpVelocity = jumpVelocity
    this.isJumping = isJumping
    this.action = action
    this.mass = mass
  }

  public getSpeed () {
    return this.speed
  }

  public getJumpHeight () {
    return this.jumpVelocity
  }

  public setTrespassMapBounds (value:boolean) {
    this.trespassMapBounds = value
  }

  public update (
    deltaTime: number,
    keys: { a: boolean; d: boolean; w: boolean },
    tileData: MapProgressOutput,
    playerCollisions: Collision[]
  ) {
    // Movimiento horizontal
    const horizontalCollisions = playerCollisions.filter((pc) => (Math.round(toggleY(this.y, playerProps.spawn.y) / 32) * 32) + 32 === pc.y)
    if (keys.a) {
      if (obstacleLeft(horizontalCollisions, this.x)) {
        this.x = Math.round(this.x / 32) * 32
      } else {
        this.x -= (this.speed * (deltaTime / 16.67))
      }

      this.action = 'move'
    } else if (keys.d) {
      if (obstacleRight(horizontalCollisions, this.x)) {
        this.x = Math.round(this.x / 32) * 32
      } else {
        this.x += (this.speed * (deltaTime / 16.67))
      }
      this.action = 'move'
    }
    // Salto: impulso inicial
    if (keys.w && !this.isJumping) {
      this.velocityY = this.getJumpHeight()
      this.isJumping = true
    }

    // Gravedad
    this.velocityY += (9.8 * Math.abs(this.mass)) / 1000
    this.y += this.velocityY

    // Bloque justo debajo del jugador
    const mappedYCollisions = playerCollisions?.map((pc) => pc.y) ?? []
    const roundedY = Math.round(toggleY(this.y, playerProps.spawn.y) / 32) * 32

    const sueloMasCercano = mappedYCollisions.length > 0 ? toggleY(closestTo(roundedY, mappedYCollisions), playerProps.spawn.y) : undefined

    // Detectar cuando el jugador toca el suelo
    if (sueloMasCercano && !isNaN(sueloMasCercano) && this.y > sueloMasCercano) { // 64 = nivel de suelo
      this.y = sueloMasCercano
      this.velocityY = 0
      this.isJumping = false
    }

    if (!Object.entries(keys)?.find((k) => !!k[1])) this.action = 'idle'
  }

  getPosition () {
    return { x: this.x, y: this.y }
  }

  getAbsolutePosition (levelHeight:number) {
    return { x: this.x, y: 192 - this.y }
  }

  getAction () {
    if (this.isJumping) return 'jump'
    if (this.velocityY !== 0) return 'fall'
    return this.action
  }

  getSpritePosition () {
    return { spriteX: this.spriteX, spriteY: this.spriteY }
  }
}

import { playerProps } from '../constants/player'
import { closestTo, obstacleLeft, obstacleRight, toggleY } from '../helpers/helpers'
import { MapProgressOutput } from '../hooks/hookTypes'
import { Collision } from '../views/maps/map01/layout/layout'
import { Action, Entity, KeysPressed } from './types'

interface PlayerInterface extends Entity {
    getJumpHeight: () => number,
    update: (
      deltaTime: number,
      keys: KeysPressed,
      tileData: MapProgressOutput,
      playerCollisions: Collision[]
    ) => void
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
  private hitbox: {width: number; height: number} = { width: 32, height: 32 }
  private updates:number = 0

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
    keys: KeysPressed,
    tileData: MapProgressOutput,
    playerCollisions: Collision[]
  ) {
    // Constantes
    const tileSide = 32
    const spawnY = playerProps.spawn.y

    // Gravedad
    this.velocityY += (9.8 * Math.abs(this.mass)) / 1000

    // Movimiento horizontal
    this.handleXMovement(keys, playerCollisions, deltaTime)

    // Salto: impulso inicial
    if (keys.w && !this.isJumping) {
      this.velocityY = this.getJumpHeight()
      this.isJumping = true
    }

    // Calcular la posición Y futura
    let nextY = this.y + this.velocityY

    // Calcular colisiones
    const mappedYCollisions = playerCollisions?.map((pc) => pc.y) ?? []
    const mapRelativeNextY = Math.round(toggleY(nextY, spawnY))
    const closestY = closestTo(mapRelativeNextY, mappedYCollisions)
    // console.log(mappedYCollisions + ' update: ' + this.updates)

    // Si hay suelo debajo, se define al jugador como que está saltando para que no caiga de golpe
    if (
      (!closestY || closestY > mapRelativeNextY) &&
      !this.isJumping
    ) {
      this.isJumping = true
    }

    // Manejar colisión con el techo
    if (
      closestY &&
      (closestY - tileSide) < (mapRelativeNextY + (this.hitbox.height * 1.5)) &&// Normalmente sería solo this.hitbox.height pero he tenido que hacerlo un poco más laxo porque de lo contrario no se daba la condición
      Math.abs((mapRelativeNextY + this.hitbox.height) - (closestY - tileSide)) < 32
    ) {
      this.velocityY = 0
    }

    // Manejar colisión con el suelo
    if (
      closestY &&
      closestY > mapRelativeNextY &&
      Math.abs(closestY - mapRelativeNextY) < 64// Lo lógico habría sido pensar que la diferencia tendría que ser menor de 32, pero de nuevo he tenido que ser más generoso, de lo contrario el jugador aparecía incrustado en el suelo
    ) {
      nextY = toggleY(closestY, spawnY)
      this.velocityY = 0
      this.isJumping = false
    }

    // Actualizar posición Y al final
    this.y = nextY

    if (!Object.entries(keys)?.find((k) => !!k[1])) this.action = 'idle'
    this.updates += 1// TODO: Esto es para depurar, cuando no se necesite hay que eliminarlo
  }

  /**
   *
   * @param keys
   * @param collisions
   * @param deltaTime
   */
  private handleXMovement (keys: KeysPressed, collisions:Collision[], deltaTime:number) {
    const spawnY = playerProps.spawn.y
    const horizontalCollisions = collisions.filter((pc) => (Math.round(toggleY(this.y, spawnY) / 32) * 32) + 32 === pc.y)
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

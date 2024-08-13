import { playerProps } from '../constants/player'
import { closestTo, obstacleLeft, obstacleRight, playerInLeftMapLimit, playerInRightMapLimit, toggleY } from '../helpers/helpers'
import { Camera, MapProgressOutput } from '../hooks/hookTypes'
import { Collision } from '../views/maps/map01/layout/layout'
import { Action, Entity, KeysPressed } from './types'

interface Mob extends Entity {
    update: (
      deltaTime: number,
      tileData: MapProgressOutput,
      playerCollisions: Collision[],
      camera: Camera
    ) => void
}

export class Enemy implements Mob {
  private x: number = 0
  private y: number = 0
  private velocityY: number = 0
  private speed: number // unidades por segundo
  private jumpVelocity: number // unidades por segundo (negativo porque va hacia arriba)
  private isJumping: boolean = false
  private action: Action
  private mass: number
  private hp: number
  private hitbox: {width: number; height: number} = { width: 32, height: 32 }
  private hasSpawned: boolean = false
  private initialParams: {x?:number; y?:number; speed?:number; mass?:number; jumpVelocity?:number; isJumping?:boolean; action?:Action;} = {}

  constructor (
    x:number = 0,
    y:number = 0,
    speed:number = 10,
    mass:number = 70,
    jumpVelocity:number = -14,
    isJumping:boolean = false,
    hp:number = 100,
    action:Action = 'idle'
  ) {
    this.x = x
    this.y = y
    this.speed = speed
    this.jumpVelocity = jumpVelocity
    this.isJumping = isJumping
    this.action = action
    this.mass = mass
    this.hp = hp
    this.initialParams = {
      x, y, speed, jumpVelocity, isJumping, action, mass
    }
  }

  public getSpeed () {
    return this.speed
  }

  public getJumpHeight () {
    return this.jumpVelocity
  }

  public update (
    deltaTime: number,
    tileData: MapProgressOutput,
    playerCollisions: Collision[],
    camera: Camera
  ) {
    // Gravedad
    this.velocityY += (9.8 * Math.abs(this.mass)) / 1000

    if (this.isInCamera() && !this.hasSpawned) {
      this.hasSpawned = true
    }

    // Movimiento horizontal
    if (this.hasSpawned) {
      this.handleXMovement(playerCollisions, deltaTime, tileData)
    }
  }

  /**
   *
   * @param keys
   * @param collisions
   * @param deltaTime
   */
  private handleXMovement (collisions:Collision[], deltaTime:number, tileData:MapProgressOutput) {
    console.log('enemigo se mueve')
  }

  private isInCamera () {
    // TODO: Manejar cuando la entidad está dentro de los límites de la cámara del jugador
    return false
  }

  getPosition () {
    return { x: this.x, y: this.y }
  }

  getAbsolutePosition (levelHeight:number) {
    return { x: this.x, y: 192 - this.y }
  }

  getAction () {
    if (this.isJumping) return 'jump'
    if (Math.round(this.velocityY) !== 0) return 'fall'
    return this.action
  }
}

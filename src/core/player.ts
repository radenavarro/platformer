import { Action } from './types'

interface PlayerInterface {
    getSpeed: () => number,
    getJumpHeight: () => number,
    update: (deltaTime:number, keys:{ a: boolean; d: boolean; w: boolean }) => void,
    getPosition: () => { x: number, y: number }
    getAction: () => Action
}

export class Player implements PlayerInterface {
  private x: number = 0
  private y: number = 0
  private velocityY: number = 0
  private speed: number // unidades por segundo
  private jumpVelocity: number // unidades por segundo (negativo porque va hacia arriba)
  private isJumping: boolean = false
  private action: Action
  private mass: number

  constructor (
    x:number = 0,
    y:number = 0,
    speed:number = 10,
    mass:number = 70,
    jumpVelocity:number = -14,
    isJumping:boolean = false,
    action:Action = 'idle'
  ) {
    this.x = x
    this.y = y
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

  update (deltaTime: number, keys: { a: boolean; d: boolean; w: boolean }) {
    // Movimiento horizontal
    if (keys.a) {
      this.x -= this.speed * (deltaTime / 16.67)
      this.action = 'move'
    } else if (keys.d) {
      this.x += this.speed * (deltaTime / 16.67)
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

    // Detectar cuando el jugador toca el suelo
    if (this.y > 0) { // 0 = nivel de suelo
      this.y = 0
      this.velocityY = 0
      this.isJumping = false
    }

    if (!Object.entries(keys)?.find((k) => !!k[1])) this.action = 'idle'
  }

  getPosition () {
    return { x: this.x, y: this.y }
  }

  getAction () {
    if (this.isJumping) return 'jump'
    if (this.velocityY !== 0) return 'fall'
    return this.action
  }
}

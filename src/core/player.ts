interface PlayerInterface {
    speed: number,
    jumpHeight: number
}

export class Player implements PlayerInterface {
  private speed: number
  private jumpHeight: number
  constructor (speed:number, jumpHeight:number) {
    this.speed = speed
    this.jumpHeight = jumpHeight
  }

  public getSpeed () {
    return this.speed
  }

  public getJumpHeight () {
    return this.jumpHeight
  }
}

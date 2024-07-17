export class PlayerOutOfBoundsError extends Error {
  constructor (message:string) {
    super(message)
    this.name = 'Player out of bounds error'
  }
}

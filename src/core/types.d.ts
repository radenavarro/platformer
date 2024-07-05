export type Action = 'idle' | 'move' | 'jump' | 'fall'
export type Direction = 'left' | 'right'
export type ActionDirection = 'idleLeft' | 'moveLeft' | 'jumpLeft' | 'fallLeft' | 'idleRight' | 'moveRight' | 'jumpRight' | 'fallRight'
export type GameState = {
    x?: number,
    y?: number,
    direction?: Direction,
    action?: Action,
    currentFrame?: number,
    frameCount?: number,
    frameRate?: number,
    isJumping?: boolean,
    velocityY?: number
}

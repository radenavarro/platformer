import idleSprite from '../assets/pj/idle.png'
import run1Sprite from '../assets/pj/run1.png'
import run2Sprite from '../assets/pj/run2.png'
import run3Sprite from '../assets/pj/run3.png'
import run4Sprite from '../assets/pj/run4.png'
import death1Sprite from '../assets/pj/death1.png'
import death2Sprite from '../assets/pj/death2.png'
import death3Sprite from '../assets/pj/death3.png'
import death4Sprite from '../assets/pj/death4.png'

export const playerSprites = (Object.freeze(() => {
  return {
    idleRight: {
      sprites: [idleSprite],
      flipHorizontal: false,
      frameRate: 4,
      loop: true
    },
    idleLeft: {
      sprites: [idleSprite],
      flipHorizontal: true,
      frameRate: 4,
      loop: true
    },
    moveRight: {
      sprites: [
        run1Sprite,
        run2Sprite,
        run3Sprite,
        run4Sprite
      ],
      order: [1, 2, 3, 4],
      flipHorizontal: false,
      loop: true,
      frameRate: 4
    },
    moveLeft: {
      sprites: [
        run1Sprite,
        run2Sprite,
        run3Sprite,
        run4Sprite
      ],
      order: [1, 2, 3, 4],
      flipHorizontal: true,
      loop: true,
      frameRate: 4
    },
    jumpRight: {
      sprites: [
        run1Sprite,
        run2Sprite,
        run3Sprite,
        run4Sprite
      ],
      order: [1, 2, 3, 4],
      flipHorizontal: false,
      loop: true,
      frameRate: 4
    },
    jumpLeft: {
      sprites: [
        run1Sprite,
        run2Sprite,
        run3Sprite,
        run4Sprite
      ],
      order: [1, 2, 3, 4],
      flipHorizontal: true,
      loop: true,
      frameRate: 4
    },
    death: {
      sprites: [
        death1Sprite,
        death2Sprite,
        death3Sprite,
        death4Sprite
      ],
      order: [1, 2, 3, 4],
      flipHorizontal: false,
      loop: false,
      frameRate: 4
    }
  }
}))()

export const playerProps = (Object.freeze(() => {
  return {
    spawn: {
      x: 32 * 3,
      y: 32 * 10// Hay que recordar que "y" va de arriba a abajo, es decir, 0 es la parte superior, y cuanto más positivo es, más abajo estará el puntero
    }
  }
}))()

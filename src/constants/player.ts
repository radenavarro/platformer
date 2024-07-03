import idleSprite from '../assets/pj/idle.png'
import run1Sprite from '../assets/pj/run1.png'
import run2Sprite from '../assets/pj/run2.png'
import run3Sprite from '../assets/pj/run3.png'

export const playerSprites = Object.freeze(() => {
  return {
    idleRight: {
      sprites: [idleSprite],
      flipHorizontal: false,
      frameRate: 10
    },
    idleLeft: {
      sprites: [idleSprite],
      flipHorizontal: true,
      frameRate: 10
    },
    moveRight: {
      sprites: [
        run1Sprite,
        run2Sprite,
        run3Sprite
      ],
      order: [1, 2, 1, 3],
      flipHorizontal: false,
      loop: true,
      frameRate: 10
    },
    moveLeft: {
      sprites: [
        run1Sprite,
        run2Sprite,
        run3Sprite
      ],
      order: [1, 2, 1, 3],
      flipHorizontal: true,
      loop: true,
      frameRate: 10
    },
    jumpRight: {
      sprites: [
        run1Sprite,
        run2Sprite,
        run3Sprite
      ],
      order: [1, 2, 1, 3],
      flipHorizontal: false,
      loop: true,
      frameRate: 10
    },
    jumpLeft: {
      sprites: [
        run1Sprite,
        run2Sprite,
        run3Sprite
      ],
      order: [1, 2, 1, 3],
      flipHorizontal: true,
      loop: true,
      frameRate: 10
    }
  }
})

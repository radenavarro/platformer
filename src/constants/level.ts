import { map01Tiles } from './mapTiles'

export const level = (Object.freeze(() => {
  return {
    map01: {
      width: 32 * 50,
      height: 32 * 19,
      groundLevel: 64,
      tiles: {
        empty: {
          blocksPlayer: false,
          blocksEnemies: false,
          //   src: '',
          width: 32,
          height: 32,
          abbr: '_'
        },
        floor: {
          blocksPlayer: true,
          blocksEnemies: true,
          src: map01Tiles.floor,
          width: 32,
          height: 32,
          abbr: '-'
        },
        ground: {
          blocksPlayer: true,
          blocksEnemies: true,
          src: map01Tiles.ground,
          width: 32,
          height: 32,
          abbr: '*'
        }
      }
    }
  }
}))()

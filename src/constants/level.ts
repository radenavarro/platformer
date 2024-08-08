import { map01Tiles } from './mapTiles'

export const level = (Object.freeze(() => {
  return {
    map01: {
      width: 32 * 100,
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
        spikedfloor: {
          blocksPlayer: true,
          blocksEnemies: true,
          src: map01Tiles.spikedfloor,
          width: 32,
          height: 32,
          abbr: '^',
          killsPlayer: true
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

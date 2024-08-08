import { level } from '../../../../constants/level'
import { LevelLayout } from './layout'

const tiles = level.map01.tiles

const tile = (() => {
  return {
    abbr: (tl) => {
      return {
        times: (tms) => {
          return Array(tms).fill(tl)
        }
      }
    }
  }
})()

export const levelLayout:LevelLayout = [
  [...tile.abbr('_').times(100)],
  [...tile.abbr('_').times(100)],
  [...tile.abbr('_').times(100)],
  [...tile.abbr('_').times(100)],
  [...tile.abbr('_').times(100)],
  [...tile.abbr('_').times(30), ...tile.abbr('-').times(2), ...tile.abbr('_').times(68)],
  [...tile.abbr('_').times(100)],
  [...tile.abbr('_').times(100)],
  [...tile.abbr('_').times(100)],
  [...tile.abbr('_').times(35), ...tile.abbr('-').times(2), ...tile.abbr('_').times(63)],
  [...tile.abbr('_').times(100)],
  [...tile.abbr('_').times(100)],
  [...tile.abbr('_').times(7), ...tile.abbr('-').times(3), ...tile.abbr('_').times(20), ...tile.abbr('-').times(50), ...tile.abbr('_').times(20)],
  [...tile.abbr('-').times(7), ...tile.abbr('*').times(3), ...tile.abbr('^').times(3), ...tile.abbr('-').times(17), ...tile.abbr('*').times(50), ...tile.abbr('-').times(20)],
  [...tile.abbr('*').times(100)],
  [...tile.abbr('*').times(100)],
  [...tile.abbr('*').times(100)],
  [...tile.abbr('*').times(100)],
  [...tile.abbr('*').times(100)]
].reverse()

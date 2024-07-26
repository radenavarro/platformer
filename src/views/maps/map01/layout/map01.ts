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
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(50)],
  [...tile.abbr('_').times(7), '-', '-', '-', ...tile.abbr('_').times(39), '-'],
  [...tile.abbr('-').times(7), '*', '*', '*', ...tile.abbr('-').times(40)],
  [...tile.abbr('*').times(50)],
  [...tile.abbr('*').times(50)],
  [...tile.abbr('*').times(50)],
  [...tile.abbr('*').times(50)],
  [...tile.abbr('*').times(50)]
].reverse()

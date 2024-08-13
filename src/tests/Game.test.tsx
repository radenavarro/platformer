import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test } from 'vitest'
import { PlayerLayer } from '../views/layers/Player'
import Game from '../views/Game'
import { level } from '../constants/level'
import { levelLayout as map01LevelLayout } from '../views/maps/map01/layout/map01'

describe('Game', () => {
  beforeEach(() => {
    render(<Game />)
  })
  test('Should start', () => {
    const gameContainer = screen.getByTestId('gameWrapper')
    expect(gameContainer).toBeDefined()
  })
})

describe('PlayerLayer', () => {
  let container: HTMLElement

  beforeEach(() => {
    const renderResult = render(<PlayerLayer />)
    container = renderResult.container
  })

  test('Is visible', () => {
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeDefined()
  })
})

describe('Map01', () => {
  test('Has right width', () => {
    const tilesWidth = Math.round(level.map01.width / 32)
    const errors = map01LevelLayout.filter((layoutLine) => layoutLine.length !== tilesWidth)
    expect(errors).toHaveLength(0)
  })

  test('Has right height', () => {
    const tilesHeight = Math.round(level.map01.height / 32)
    expect(tilesHeight).toBe(map01LevelLayout.length)
  })
})

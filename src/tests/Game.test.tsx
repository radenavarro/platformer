import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test } from 'vitest'
import { PlayerLayer } from '../views/layers/Player'
import Game from '../views/Game'

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

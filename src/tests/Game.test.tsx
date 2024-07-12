import { render, screen, fireEvent } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { PlayerLayer } from '../views/layers/Player'
import Game from '../views/Game'
import { act } from 'react'

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

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  test('Is visible', () => {
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeDefined()
  })

  test('Movement works', async () => {
    const canvas = container.querySelector('canvas')
    const ctx = canvas?.getContext('2d')

    let initialImageData:ImageData | boolean = false
    let updatedImageData:ImageData | boolean = false
    if (ctx) {
      initialImageData = ctx.getImageData(0, 0, 800, 600)
      console.log(initialImageData)

      await act(async () => {
        fireEvent.keyDown(document, { key: 'd' })
      })

      updatedImageData = ctx.getImageData(0, 0, 800, 600)
    }

    expect(initialImageData).not.toBe(updatedImageData)
  })
})
